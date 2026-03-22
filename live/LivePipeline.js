/**
 * Netflix Cadmium Player - Live Streaming Pipeline
 *
 * Extends the base pipeline for live/linear content streaming. Handles
 * live edge tracking, ELLA (Enhanced Low-Latency Algorithm) integration,
 * missing segment management, error recovery with stream switching,
 * segment time adjustments, and live-specific request creation.
 *
 * @module LivePipeline
 * @original Module_95324
 */

// import { __extends, __decorate, __assign, __spreadArray, __read } from 'tslib'; // webpack 22970
// import { TimeUtil } from '../types/ConfigExports.js'; // webpack 91176 (p)
// import { EventEmitter } from '../events/EventEmitter.js'; // webpack 90745
// import { MediaType, PlaybackState } from '../types/MediaTypes.js'; // webpack 65161
// import { assert } from '../assert/Assert.js'; // webpack 52571
// import { u as DEBUG } from '../core/Debug.js'; // webpack 48170
// import { mixin } from '../utils/Mixin.js'; // webpack 85254
// import { processingContext } from '../streaming/ProcessingContext.js'; // webpack 71808
// import { loggable } from '../utils/Loggable.js'; // webpack 97757
// import { exhaustive } from '../utils/Exhaustive.js'; // webpack 85858
// import { isLiveStream } from '../utils/StreamUtils.js'; // webpack 8149
// import { EllaRequest } from '../ella/EllaRequest.js'; // webpack 45691
// import { WJ as RequestCache } from '../streaming/RequestCache.js'; // webpack 42431
// import { EllaRequestManager } from '../ella/EllaRequestManager.js'; // webpack 27265
// import { BasePipeline } from '../streaming/BasePipeline.js'; // webpack 46512
// import { LiveErrorHandler, LiveErrorAction } from '../live/LiveErrorHandler.js'; // webpack 71077
// import { EllaRelayController } from '../ella/EllaRelayController.js'; // webpack 7611
// import { EllaHttpDecision } from '../ella/EllaHttpDecision.js'; // webpack 25915

/**
 * Pipeline for live/linear content. Manages the full lifecycle of live
 * media requests including ELLA relay, missing segment handling, error
 * recovery, stream switching, and segment boundary adjustments.
 */
export class LivePipeline extends BasePipeline {
    /**
     * @param {Object} parent - Parent pipeline manager
     * @param {Object} config - Pipeline configuration
     * @param {Object} logger - Logger
     * @param {Object} reporter - Telemetry reporter
     * @param {Object} innerViewable - Viewable context
     * @param {number} mediaType - Media type
     * @param {Object} playerRef - Player core reference
     * @param {Function} metadataProvider - Metadata provider
     * @param {Object} streamSelector - Stream selector
     */
    constructor(parent, config, logger, reporter, innerViewable, mediaType, playerRef, metadataProvider, streamSelector) {
        super(parent, config, logger, reporter, innerViewable, mediaType, playerRef, metadataProvider, streamSelector);

        this.parent = parent;
        this.config = config;
        this.events = new EventEmitter();
        this._highestMissingIndex = -1;
        this.hasMarkedEndOfStream = false;
        this.hasMissingRequestsWithError = false;
        this.missingSegmentSet = new Set();
        this.missingSegmentCount = 0;

        /** @type {Object} ELLA request manager for live requests */
        this.requestManager = new EllaRequestManager(
            this, config, this.console, this.xm,
            this.innerViewable, this.mediaType, this.FK,
            () => this.cachedMetadata
        );

        // Initialize ELLA components if enabled
        if (this._isEllaEnabled) {
            this._ellaDecision = new EllaHttpDecision(config, this.console);
            const manifest = this.branch.viewableSession.manifestRef.ella;
            const relayServers = config.overrideEllaRelayServers
                ? [...config.ellaRelayServers]
                : (manifest?.relayServers || []);

            this.ellaRelay = new EllaRelayController(
                config, this, this.track, this.requestManager,
                this.branch.ellaAlgorithms, relayServers,
                this._ellaDecision, manifest?.initialConfig, manifest?.constraints
            );
        }

        this.liveErrorHandler = new LiveErrorHandler(this.branch.viewableSession, config);
    }

    /** @returns {Object} The media track */
    get track() {
        return this.track;
    }

    /** @returns {boolean} Whether ELLA split encoding is active */
    get isSplitEncoding() {
        return this.track.viewableSession.encodingInfo.isSplitEncoding;
    }

    /** @returns {number} Count of unique missing segments */
    get missingSegmentSetSize() {
        return this._missingSegmentSetSize;
    }

    /** @returns {number} Highest missing segment index, or -1 if no errors */
    get highestMissingErrorIndex() {
        return this.hasMissingRequestsWithError ? this._highestMissingIndex : -1;
    }

    /** @returns {boolean} First fragment has been fully received */
    get isFirstFragmentComplete() {
        return !!this.firstFragment &&
            (!this.firstFragment.editWindow || this.highestMissingErrorIndex >= this.firstFragment.index);
    }

    /** @returns {boolean} Last fragment has been fully received */
    get isLastFragmentComplete() {
        return !!this.lastFragment &&
            (!this.lastFragment.editWindow || this.highestMissingErrorIndex >= this.lastFragment.index);
    }

    /**
     * Checks if ELLA is compatible with current stream
     * @returns {boolean}
     */
    isEllaCompatible() {
        return this.branch.ellaAlgorithms?.isInitialized
            ? (this.mediaType === MediaType.AUDIO || this.mediaType === MediaType.VIDEO)
            : (DEBUG && this.trace("LivePipeline: not compatible with Ella"), false);
    }

    /**
     * Gets ELLA summary diagnostics
     * @returns {Object|undefined}
     */
    getEllaSummary() {
        const summary = this.ellaRelay?.getSummary();
        if (summary) this.console.error("ELLA summary: ", summary);
        return summary;
    }

    /** @returns {boolean} Whether ELLA is enabled for this pipeline */
    get isEllaEnabled() {
        return this.isEllaCompatible() && this.config.liveIsEllaEnabled;
    }

    /** @returns {boolean} Whether ELLA relay is active */
    get isEllaRelayActive() {
        return this.ellaRelay !== undefined && this.ellaRelay.isActive;
    }

    /**
     * Cancels all live streaming operations
     * @param {*} reason
     */
    cancelStreaming(reason) {
        DEBUG && this.trace("pipeline.cancelStreaming");
        this.isCancelled = true;
        this.ellaRelay?.cancelStreaming();
        this.requestManager.cancelStreaming(reason);
        this.streamSelector?.streamBundle(this.mediaType).destroy();

        if (this.mediaRequest) {
            this.branch.viewableSession.removeMediaRequest(this.mediaType, this.mediaRequest);
            RequestCache.instance.unregister(this.mediaRequest);
            this.mediaRequest.removeAllListeners();
            this.mediaRequest = undefined;
        }
    }

    /**
     * Tries to issue a live media request
     * @param {Object} stream - Stream to request
     * @param {Object} networkInfo - Network state
     * @param {*} cdnId - CDN ID
     * @returns {{success: boolean, reason: string}}
     */
    tryIssueRequest(stream, networkInfo, cdnId) {
        // Check ELLA HTTP vs relay decision
        if (this._ellaDecision) {
            const decision = this._ellaDecision.decide(stream, {
                uploadBitrate: this.currentPts,
                downloadBitrate: this.ellaRelay?.downloadBitrate
            });
            if (!decision.allowHttp) {
                return { success: false, reason: "ellaRequestsOnlyAllowed" };
            }
        }

        const earlyResult = this._checkPreconditions(stream);
        if (earlyResult) return earlyResult;

        assert(stream.isLive, "LivePipeline.tryIssueRequest: stream must be live");
        const result = this._makeLiveRequest(stream, this.mediaRequest, cdnId, networkInfo);
        this.resetPipelineState();
        return result;
    }

    /**
     * Gets the latest live segment PTS from missing segments
     * @returns {Object|undefined} Presentation start time of the next segment
     */
    getLatestLiveSegment() {
        const latestMissing = Array.from(this.missingSegmentSet).reduce((best, seg) => {
            return seg.segmentIndex !== undefined &&
                (best?.segmentIndex === undefined || best.segmentIndex < seg.segmentIndex)
                ? seg : best;
        }, undefined);

        if (latestMissing?.segmentIndex !== undefined) {
            assert(isLiveStream(latestMissing.stream), "LivePipeline: stream must be live");
            return latestMissing.stream.track.getTrackSegment(latestMissing.segmentIndex + 1).presentationStartTime;
        }
    }

    /**
     * Records a missing segment
     * @param {Object} request - The failed request
     * @param {boolean} isTerminal - Whether this ends the live event
     */
    markMissingSegment(request, isTerminal) {
        DEBUG && this.trace("Marking missing request: ", request.toString(), isTerminal);

        if (request.isFirstInSequence) {
            this.hasMissingRequestsWithError = true;
        }

        if (isTerminal) {
            request.markEndOfStream();
            request.setSegmentContext(this.branch.currentSegment);
        }

        this.missingSegmentSet.add(request);
        this.missingSegmentCount += 1;
        this._missingSegmentSetSize = this.missingSegmentSet.size;
        this.requestEventEmitter.notifyMissingSegment(request);

        this.events.emit("liveMissingSegment", {
            type: "liveMissingSegment",
            segmentId: request.index,
            mediaType: this.mediaType,
            branch: this.branch
        });

        if (this.config.enableMissingSegmentsReplacement &&
            this.nextFragmentIndex === request.index) {
            this._advanceStreamingPosition(request.segmentEndTime.ms, this.nextFragmentIndex + 1);
        }
    }

    /**
     * Re-issues a failed live request, optionally switching streams
     * @param {Object} request - The failed request
     * @param {boolean} switchStream - Whether to switch to an alternate stream
     */
    reissueLiveRequest(request, switchStream) {
        if (switchStream && this.config.liveSwitchStreamsOnErrorInPipeline && request.canSwitchStream()) {
            const currentIndex = this.downloadables.indexOf(request.stream);
            const newIndex = currentIndex > 0
                ? Math.max(currentIndex - 1, 0)
                : Math.min(1, this.downloadables.length - 1);
            const newStream = this.downloadables[newIndex];
            request.switchStream(newStream);

            if (!newStream.headerReceived) {
                const edgeTime = this.liveEdgeTime.ms;
                this.branch.viewableSession.queueHeaderRequest(newStream, this.branch.currentSegment, () => ({
                    state: this.state,
                    playbackState: PlaybackState.STREAMING,
                    liveEdgeMs: edgeTime,
                    streamingMs: edgeTime,
                    currentTimeMs: this.FK.playerCore.currentTime.ms
                }));
            }
        } else {
            this._updateRequestUrls();
        }
    }

    /**
     * Handles request completion for live
     * @param {Object} request - Completed request
     * @param {Object} metadata - Response metadata
     */
    onRequestComplete(request, metadata) {
        this.missingSegmentCount = 0;
        super.onRequestComplete(request, metadata);
    }

    /**
     * Handles live request failure with error classification
     * @param {Object} request - Failed request
     */
    onRequestFailed(request) {
        if (request.isEndOfStream) {
            this._skipToNextSegment(request);
            return;
        }

        const bufferLevel = request.timestamp.relativeTo(this.FK.playerCore.currentTime);
        const action = this.liveErrorHandler.onRequestFailed(
            request, bufferLevel, this.downloadables.indexOf(request.stream) > 0
        );

        switch (action) {
            case LiveErrorAction.RETRY:
                this.warn("onrequesterror: retrying same url");
                this.reissueLiveRequest(request, false);
                break;
            case LiveErrorAction.SWITCH_STREAM:
                this.warn("onrequesterror: switching stream");
                this.reissueLiveRequest(request, true);
                break;
            case LiveErrorAction.SKIP_OR_FORWARD:
            case LiveErrorAction.SKIP:
                this.warn("onrequesterror: declaring missing segment");
                this.markMissingSegment(request, false);
                break;
            case LiveErrorAction.FORWARD:
                this._skipToNextSegment(request);
                break;
            case LiveErrorAction.STOP:
                this._handleLiveStop(request);
                break;
            case LiveErrorAction.REQUEST_SEEK_TO_EDGE:
                this.warn("onrequesterror: requesting seek to edge");
                this.branch.events.emit("requestSeekToLiveEdge", {
                    type: "requestSeekToLiveEdge"
                });
                break;
            default:
                exhaustive(action);
        }
    }

    /**
     * Adjusts the start time of the first fragment based on actual playback position
     * @param {Object} currentTime - Current playback time
     */
    adjustStartTime(currentTime) {
        assert(this.firstFragment, "LivePipeline.adjustStartTime: firstFragment must be set");
        assert(this.track.frameDuration, "LivePipeline.adjustStartTime: frameDuration must be set");

        const frameDuration = this.track.frameDuration;
        const relativeTime = currentTime.relativeTo(this.firstFragment.contentStart).inTimescale(frameDuration.timescale);
        const frameIndex = Math.max(0, Math.floor(relativeTime.ticks / frameDuration.ticks));

        if (frameIndex !== (this.firstFragment.editWindow?.start || 0)) {
            assert(this.nextFragmentIndex === this.firstFragment.index);
            this.firstFragment.setEditWindow({ start: frameIndex });
        }
    }

    /**
     * Adjusts the end time of the last fragment
     * @param {Object} targetTime - Target end time
     */
    adjustEndTime(targetTime) {
        assert(this.lastFragment, "LivePipeline.adjustEndTime: lastFragment must be set");
        assert(this.track.frameDuration, "LivePipeline.adjustEndTime: frameDuration must be set");

        const frameDuration = this.track.frameDuration;
        const relativeTime = targetTime.relativeTo(this.lastFragment.contentStart).inTimescale(frameDuration.timescale);
        const frameIndex = Math.min(
            this.lastFragment.sampleCount,
            Math.ceil(relativeTime.ticks / frameDuration.ticks)
        );

        const currentEnd = this.lastFragment.editWindow?.end ?? this.lastFragment.sampleCount;
        if (frameIndex !== currentEnd) {
            assert(this.nextFragmentIndex <= this.lastFragment.index);
            this.lastFragment.setEditWindow({ end: frameIndex });

            if (this.isLastSegment) {
                this.requestEventEmitter.pruneRequestCache();
                this.requestEventEmitter.notifyLastRequest();
                Promise.resolve().then(() => {
                    this.events.emit("lastRequestIssued", {
                        type: "lastRequestIssued",
                        mediaType: this.mediaType
                    });
                });
            }
        }
    }

    /**
     * Updates fragment start/end times from the track manifest
     */
    updateFragmentTimes() {
        assert(this.firstFragment, "LivePipeline.updateFragmentTimes: firstFragment must be set");
        const firstSeg = this.track.getTrackSegment(this.firstFragment.index);
        this.firstFragment.trimFragment(firstSeg.presentationStartTime, firstSeg.segmentEndTime, false);

        if (this.lastFragment && isFinite(this.lastFragment.index)) {
            const lastSeg = this.track.getTrackSegment(this.lastFragment.index);
            this.lastFragment.trimFragment(lastSeg.presentationStartTime, lastSeg.segmentEndTime, false);
        }

        this.requestManager.updateFragmentTimes();
    }

    /**
     * Records a missing segment error for tracking
     * @param {Object} request - The missing request
     */
    recordMissingSegment(request) {
        if (request.isFirstInSequence) {
            this.hasMissingRequestsWithError = true;
            this.parent.onFirstFragmentError(this);
        }
        this._highestMissingIndex = Math.max(this._highestMissingIndex, request.index);
    }

    /** @private */
    _handleLiveStop(request) {
        this.warn("onrequesterror: stopping live event");
        const eventTimes = this.branch.viewableSession.liveEventTimes;
        const endTime = this.branch.viewableSession.networkState.getSegmentEndTime(request.segmentEndTime);

        if (eventTimes.startTime === undefined) {
            eventTimes.startTime = new Date(
                this.branch.viewableSession.networkState.getAbsoluteTime(false).ms
            ).toISOString();
        }
        if (eventTimes.endTime === undefined) {
            eventTimes.endTime = new Date(endTime.ms).toISOString();
        }

        this.branch.viewableSession.updateLiveEventTimes(
            eventTimes.startTime, eventTimes.endTime, false, endTime.ms
        );

        if (!this.hasMarkedEndOfStream) {
            this.markMissingSegment(request, true);
            this.hasMarkedEndOfStream = true;
        }
    }

    /**
     * Updates pacing for live pipeline based on segment timing
     * @private
     */
    _updatePacing() {
        const segmentEnd = this.track.getTrackSegment(this.nextFragmentIndex).segmentEndTime;
        const segmentDuration = this.branch.viewableSession.getLiveSegmentDuration().ms;
        const result = this._calculateDelay(segmentEnd.ms, segmentDuration);
        this._nextRequestDelay = result.delay;
        this._pacingState = result.state;
    }
}

// Apply logging mixin
// mixin(processingContext, LivePipeline);
