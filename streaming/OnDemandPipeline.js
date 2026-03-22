/**
 * Netflix Cadmium Player - On-Demand Streaming Pipeline
 *
 * Extends the base pipeline to handle SVOD (on-demand) media segment
 * requests. Manages fragment iteration, request creation, buffer limit
 * checks, audio fade in/out for segment transitions, and request pacing
 * (both linear and logarithmic).
 *
 * @module OnDemandPipeline
 * @original Module_95052
 */

// import { __extends, __decorate, __assign } from 'tslib'; // webpack 22970
// import { platform } from '../core/Platform.js'; // webpack 66164
// import { EventEmitter } from '../events/EventEmitter.js'; // webpack 90745
// import { MediaType, PlaybackState } from '../types/MediaTypes.js'; // webpack 65161
// import { assert } from '../assert/Assert.js'; // webpack 52571
// import { u as DEBUG } from '../core/Debug.js'; // webpack 48170
// import { processingContext } from '../streaming/ProcessingContext.js'; // webpack 71808
// import { mixin } from '../utils/Mixin.js'; // webpack 85254
// import { loggable } from '../utils/Loggable.js'; // webpack 97757
// import { WJ as RequestCache } from '../streaming/RequestCache.js'; // webpack 42431
// import { RequestManager } from '../streaming/RequestManager.js'; // webpack 99021
// import { BasePipeline } from '../streaming/BasePipeline.js'; // webpack 46512
// import { calculatePacingDelay, PacingType } from '../streaming/RequestPacing.js'; // webpack 15908
// import { calculateLiveLikePacing } from '../streaming/LiveLikePacing.js'; // webpack 75100

/**
 * Pipeline for on-demand (SVOD) content streaming. Issues media segment
 * requests sequentially, handles fragment navigation, audio fades, and
 * adaptive request pacing based on buffer level.
 */
export class OnDemandPipeline extends BasePipeline {
    /**
     * @param {Object} parent - Parent pipeline manager
     * @param {Object} config - Pipeline configuration
     * @param {Object} logger - Logger
     * @param {Object} reporter - Telemetry reporter
     * @param {Object} innerViewable - Viewable context
     * @param {number} mediaType - Media type (audio/video)
     * @param {Object} playerRef - Player core reference
     * @param {Function} metadataProvider - Cached metadata provider
     * @param {Object} streamSelector - Stream selection service
     */
    constructor(parent, config, logger, reporter, innerViewable, mediaType, playerRef, metadataProvider, streamSelector) {
        super(parent, config, logger, reporter, innerViewable, mediaType, playerRef, metadataProvider, streamSelector);

        /** @type {EventEmitter} Pipeline events */
        this.events = new EventEmitter();

        /** @type {RequestManager} Manages request lifecycle */
        this.requestManager = new RequestManager(
            this, config, this.console, this.xm,
            this.innerViewable, this.mediaType, this.FK,
            () => this.cachedMetadata
        );
    }

    /**
     * Cancels all streaming operations for this pipeline
     * @param {*} reason - Cancellation reason
     */
    cancelStreaming(reason) {
        DEBUG && this.trace("pipeline.cancelStreaming");
        this.isCancelled = true;
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
     * Attempts to issue a new media segment request
     * @param {Object} stream - The stream to request from
     * @param {Object} networkInfo - Current network information
     * @param {*} cdnId - CDN identifier
     * @returns {{success: boolean, reason: string}}
     */
    tryIssueRequest(stream, networkInfo, cdnId) {
        const earlyResult = this._checkPreconditions(stream);
        if (earlyResult) return earlyResult;

        assert(!stream.isLive, "OnDemandPipeline.tryIssueRequest: stream must not be live");
        const fragments = stream.getFragments();
        assert(fragments, `initialHeaderReceived and headerFragments mismatch`);

        const result = this._makeRequest(stream, fragments, this.mediaRequest, networkInfo, cdnId);
        this.resetPipelineState();
        return result;
    }

    /**
     * Creates and sends a media request for the next fragment
     * @param {Object} stream - Media stream
     * @param {Array} fragments - Fragment list
     * @param {Object} mediaRequest - Current media request object
     * @param {Object} networkInfo - Network state
     * @param {*} cdnId - CDN identifier
     * @returns {{success: boolean, reason: string}}
     * @private
     */
    _makeRequest(stream, fragments, mediaRequest, networkInfo, cdnId) {
        const viewable = this.innerViewable;
        const session = viewable.viewableSession;
        const mediaType = this.mediaType;
        const nextIndex = this.nextFragmentIndex;

        if (nextIndex >= fragments.length) {
            this.warn("makeRequest nextFragmentIndex past fragments length");
            return { success: false, reason: "insufficientFragments" };
        }

        if (!this.firstFragment || !this.lastFragment) {
            this.warn("makeRequest delayed, first or last fragment not set");
            return { success: false, reason: "noFirstOrLastFragment" };
        }

        // Check for audio fade in/out at segment boundaries
        const fadeInNeeded = mediaType === MediaType.AUDIO &&
            !!this.config.segmentFadeDuration &&
            this.branch.currentSegment.fadeIn &&
            this.firstFragment.offset.ms < this.config.segmentFadeDuration &&
            this.firstFragment.editWindow !== undefined;

        const fadeOutNeeded = mediaType === MediaType.AUDIO &&
            !!this.config.segmentFadeDuration &&
            this.branch.currentSegment.fadeOut &&
            this.lastFragment.offset.ms < this.config.segmentFadeDuration &&
            this.lastFragment.editWindow !== undefined;

        // Create the fragment request descriptor
        const fragment = this.fragmentHelper.createFragment(stream, nextIndex, fadeInNeeded, fadeOutNeeded);

        // Apply fade markings on audio fragments
        if (mediaType === MediaType.AUDIO && this.config.segmentFadeDuration) {
            this._applyFadeMarkers(fragment);
        }

        // Check buffer size limits
        if (session.bufferSizeLimiter && !session.bufferSizeLimiter.canAllocate(this.mediaType, fragment.byteLength)) {
            return {
                success: false,
                reason: mediaType === MediaType.VIDEO ? "globalVideoMemoryLimit" : "globalAudioMemoryLimit"
            };
        }

        this._currentRegion = fragment.region;
        fragment.cdnId = cdnId;
        this._stallDetector?.trackFragment(fragment, stream);

        // Mark last request in sequence for video
        if (fragment.isLastInSequence && mediaType === MediaType.VIDEO) {
            this.xm.recordContentEnd(viewable.currentSegment, fragment.endPts);
        }

        // Apply max request size limit
        if (this.config.maxRequestSize) {
            fragment.maxRequestSize = this.config.maxRequestSize;
        }

        fragment.location = stream.location;
        fragment.sourceBufferIndex = stream.sourceBufferIndex;
        fragment.sideChannelData = stream.sideChannelData;

        this._recordRequestMetrics(fragment, { stream, networkInfo, duration: fragment.offset });

        // Create and send the media request
        mediaRequest = this.requestEventEmitter.createMediaRequest(fragment, mediaRequest, stream);

        if (!mediaRequest.send()) {
            this.warn("MediaRequest.send error: " + mediaRequest.errorCode);
            if (mediaRequest.aborted) {
                return { success: false, reason: "requestAborted" };
            }
            session.onNetworkFailure({
                message: "MediaRequest open failed (1)",
                errorSubCode: "NFErr_MC_StreamingFailure"
            });
            return { success: false, reason: "openAseMediaRequest" };
        }

        this._stallDetector?.onRequestCreated(mediaRequest, fragment, stream);
        this._advanceStreamingPosition(mediaRequest.segmentEndTime.ms, fragment.nextIndex);

        return { success: true, reason: "success" };
    }

    /**
     * Advances the streaming position after a successful request
     * @param {number} newPts - New PTS position
     * @param {number} newIndex - New fragment index
     */
    _advanceStreamingPosition(newPts, newIndex) {
        const ptsDelta = newPts - this.currentPts;
        this.currentPts = newPts;
        this.nextFragmentIndex = newIndex;
        this._updatePacing(ptsDelta);
    }

    /**
     * Updates request pacing based on buffer level
     * @param {number} [ptsDelta] - PTS advancement in ms
     * @private
     */
    _updatePacing(ptsDelta) {
        this._nextRequestDelay = -Infinity;
        this._pacingState = "available";

        const fragments = this.elementList?.fragmentIndex;
        if (fragments === undefined || this.nextFragmentIndex >= fragments.length) return;

        if (this.branch.isLiveLike && this.config.enableLiveLikeRequestPacing) {
            const liveSegmentDuration = this.branch.viewableSession.liveTimeline.getLiveSegmentDuration();
            const pacing = calculateLiveLikePacing({
                branch: this.branch,
                segmentDuration: liveSegmentDuration,
                fragmentIndex: fragments,
                nextIndex: this.nextFragmentIndex,
                config: this.config
            });
            if (pacing) {
                const result = this._calculateDelay(pacing.targetPts, pacing.segmentDuration);
                this._nextRequestDelay = result.delay;
                this._pacingState = result.state;
            }
        } else if (this.config.enableSvodRequestPacing) {
            const params = {
                fragmentDuration: ptsDelta ?? fragments.getDuration(this.nextFragmentIndex),
                startTime: this.branch.getStartTime(this.mediaType),
                minTargetBuffer: this.config.minSvodTargetBufferDurationMs,
                maxBuffer: this.config.maxMediaBufferAllowed
            };

            this._nextRequestDelay = this.config.enableSvodLogarithmicPacing
                ? calculatePacingDelay(PacingType.LOGARITHMIC, {
                    ...params,
                    curveCenter: this.config.svodLogarithmicRequestPacingCurveCenterPositionMs,
                    curveSharpness: this.config.svodLogarithmicRequestPacingCurveSharpness
                })
                : calculatePacingDelay(PacingType.LINEAR, {
                    ...params,
                    growthSlope: this.config.svodBufferGrowthRateSlope
                });

            this._pacingState = "waitingOnPacedRequest";
        }
    }
}

// Apply logging mixin
// mixin(processingContext, OnDemandPipeline);
