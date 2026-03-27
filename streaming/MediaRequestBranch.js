/**
 * Netflix Cadmium Player - Media Request Branch Manager
 *
 * Manages a branch of media segment requests for a specific media type
 * (audio/video/text). Handles the lifecycle of download requests including
 * queuing, attaching to the source buffer, pruning old segments, cancellation,
 * URL swapping, and providing padding fragments for missing segments.
 *
 * Extends the base branch pipeline (bP) with concrete request management,
 * including a request queue, completed request tracking, and segment pipeline
 * integration.
 *
 * @module MediaRequestBranch
 * @see Module_99021
 */

import { __extends, __decorate, __generator } from '../_tslib.js';
import * as NumberUtils from '../utils/NumberUtils.js';
import { TimeUtil } from '../timing/TimeUtil.js';
import { HCa as RequestFactory } from '../streaming/RequestFactory.js';
import { l$a as RequestList } from '../streaming/RequestList.js';
import { bP as BaseBranchPipeline } from '../streaming/BaseBranchPipeline.js';
import { MediaType } from '../player/MediaType.js';
import { assert } from '../assert/Assert.js';
import { RJ as RequestQueue } from '../streaming/RequestQueue.js';
import { completionState } from '../streaming/CompletionState.js';
import { o0 as trackableDecorator } from '../core/Trackable.js';
import { CBb as getProfileType } from '../media/ProfileUtils.js';
import { kP as MediaFactory } from '../media/MediaFactory.js';
import { yDb as calculateAttachThreshold } from '../streaming/AttachThreshold.js';

/**
 * Manages media segment requests for a single media type within a streaming branch.
 * Tracks completed requests, manages a request queue for source buffer attachment,
 * handles pruning of old segments, and provides padding for missing segments.
 */
class MediaRequestBranch extends BaseBranchPipeline {
    /**
     * @param {Object} baseConfig - Base pipeline configuration
     * @param {Object} config - Branch-specific configuration
     * @param {Object} console - Logger instance
     * @param {Object} requestManager - Network request manager
     * @param {Object} viewable - The viewable/session context
     * @param {string} mediaType - Media type (AUDIO/VIDEO/TEXT)
     * @param {Object} scheduler - Task scheduler for background operations
     * @param {Object} streamModeConfig - Stream mode configuration
     */
    constructor(baseConfig, config, console, requestManager, viewable, mediaType, scheduler, streamModeConfig) {
        super(baseConfig);
        this.config = config;
        this.console = console;
        this.xm = requestManager;
        this.innerViewable = viewable;
        this.mediaType = mediaType;
        this.streamModeConfig = streamModeConfig;

        /** @type {RequestQueue} Queue for managing request ordering */
        this.readInt32 = new RequestQueue(this.console);

        this.error = this.console.error.bind(this.console);
        this.RETRY = this.console.RETRY.bind(this.console);
        this.pauseTrace = this.console.pauseTrace.bind(this.console);

        this._resetRequestState();

        /** @type {Object|undefined} Scheduled task for pruning old requests */
        this.branchPruner = scheduler?.createScheduledTask(
            () => this._pruneOldRequests(),
            "pruner"
        );
    }

    /** @returns {Object} The inner viewable/session */
    get ma() { return this.innerViewable; }

    /** @returns {boolean} Whether there are completed requests */
    get zz() { return this.completedRequestCount > 0; }

    /** @returns {boolean} Whether the branch has received its first data */
    get v6a() { return !this.pba; }

    /** @returns {number} Count of completed requests */
    get completedRequestCount() { return this.completedRequests.length; }

    /** @returns {number} Number of requests attached to source buffer */
    get attachedRequestCount() { return this.completedRequests.JO; }

    /** @returns {boolean} Whether all queued items are complete */
    get TY() { return this.readInt32.mI; }

    /** @returns {Object} The previous state of the latest completed request */
    get Hk() { return this.completedRequests.complete.previousState; }

    /** @returns {number} The last attached position */
    get L$() { return this.completedRequests.internal_Uub; }

    /** @returns {*} Request index counter */
    get UQa() { return this.completedRequests.ric; }

    /** @returns {Object} Previous state data */
    get tJ() { return this.completedRequests.previousState; }

    /** @returns {number} Time gap between first request timestamp and previous state */
    get eza() {
        return this.completedRequests.timestamp === undefined
            ? 0
            : this.completedRequests.previousState.playbackSegment - this.completedRequests.timestamp.playbackSegment;
    }

    /** @returns {Object} Buffer info with byte count and duration */
    get IZ() {
        return {
            la: this.completedRequests.ypa,
            G: this.completedRequests.empty
                ? 0
                : Math.max(this.completedRequests.internal_Uub - this.completedRequests.timestamp.playbackSegment, 0),
        };
    }

    /** @returns {number} Total bytes of completed requests */
    get ypa() { return this.completedRequests.ypa; }

    /** @returns {number} Byte count of all requests */
    get bL() { return this.completedRequests.la; }

    /** @returns {number} Total outstanding and pending request count */
    get OOc() { return this._getOutstandingCount(); }

    /** @returns {boolean} Whether there are more requests than attached */
    get qXa() { return this.completedRequests.length > this.completedRequests.JO; }

    /** @returns {number} Active (in-flight) request count */
    get bn() { return this.completedRequests.bn; }

    /** @returns {Object|undefined} The last attached request */
    get lHb() { return this.PMa; }

    /** @returns {boolean} Whether a request has been attached */
    get yqa() { return this.PMa !== undefined; }

    /** @returns {Object} The completed requests collection */
    get Ta() { return this.completedRequests; }

    /**
     * Cancels all in-flight streaming requests and resets state.
     * @param {boolean} [deferred=false] - If true, cancellation is deferred via setTimeout
     */
    cancelStreaming(deferred) {
        const self = this;
        const requests = this.completedRequests;

        const doCancel = () => {
            const requestsCopy = requests.map(r => r);
            if (requestsCopy.length > 0) {
                self.xm.internal_Kwa(requestsCopy);
            }
            requests.forEach(r => { r.abort(); r.dispose(); });
        };

        deferred ? setTimeout(doCancel, 1) : doCancel();

        this._resetRequestState();
        this.readInt32.prioritizeBranch();
        this.branchPruner?.destroy();
    }

    /** Resets the branch by cancelling all requests and clearing the queue. */
    create() {
        this.cancelStreaming();
        this.readInt32.AQb();
    }

    /** Marks the request queue as closing. */
    closing() {
        this.readInt32.prioritizeBranch();
    }

    /** Flags that the request cache should be pruned on next opportunity. */
    pruneRequestCache() {
        this.trb = true;
    }

    /**
     * Returns diagnostic information about the request queue state.
     * @returns {Object} Diagnostics including queue count, completion status, etc.
     */
    getDiagnostics() {
        return {
            endMarked: this.readInt32.length !== undefined,
            queueCount: this.readInt32.length,
            isComplete: this.readInt32.mI,
            itemCount: this.readInt32.internal_Vub,
            continuousEndPts: this.readInt32.buildPath().reduce((acc, item) => {
                if (item && !item.done) {
                    const val = item.value;
                    if (100 > Math.abs(val.contentStart.playbackSegment - acc) || acc === -1) {
                        return val.contentEnd.playbackSegment;
                    }
                }
                return acc;
            }, -1),
            sentinelItemCount: this.readInt32.buildPath().filter(item => item?.done).length,
            processedCount: this.readInt32.eoc,
            rc: this.completedRequestCount,
        };
    }

    /**
     * Serializes the internal state for debugging/telemetry.
     * @returns {Object} Serialized request state
     */
    internal_Pvc() {
        return { completedRequests: this.completedRequests.internal_Qvc() };
    }

    /**
     * Creates a new media request record and inserts it into the completed requests list.
     * @param {Object} requestInfo - The download request metadata
     * @param {Object} streamInfo - Stream selection information
     * @param {Object} manifestData - Manifest data for the request
     * @returns {Object} The created request record
     */
    serializeRecord(requestInfo, streamInfo, manifestData) {
        assert(!requestInfo.header);

        const request = RequestFactory.create(
            manifestData, this.config, streamInfo.track, requestInfo,
            this.completedRequests, this.isLive.currentSegment,
            this.console, this.streamModeConfig
        );

        // Adjust start time if there is a gap from the previous request
        if (this.completedRequests.length && this.completedRequests.segmentEndTime &&
            !request.presentationStartTime.equal(this.completedRequests.segmentEndTime)) {
            request.vWb(this.completedRequests.segmentEndTime);
        }

        this._insertRequest(request);
        return request;
    }

    /** @returns {Object} Iterator over the request queue */
    getRequestIterator() {
        return this.readInt32.ase_Yra();
    }

    /** Checks if all requests have been attached and triggers pruning if needed. */
    notifyLastRequest() {
        if (this.VE === this.completedRequests.length && this.trb) {
            this.readInt32.prioritizeBranch();
        }
    }

    /**
     * Attempts to attach pending requests to the source buffer.
     * @returns {Promise} Resolves when attachment is complete
     */
    bW() {
        const self = this;
        let promise = Promise.resolve();

        if (!this.innerViewable.isReadyForPlayback(this.mediaType) ||
            this.VE === this.completedRequests.length) {
            return promise;
        }

        const maxRequests = this.config.maxRequestsToAttachOnBranchActivation;
        let count = 0;
        const toAttach = [];

        while (this.VE < this.completedRequests.length) {
            const request = this.completedRequests.key(this.VE);

            if (request) {
                if (request.NB) {
                    if (this.config.enableMissingSegmentsReplacement) {
                        toAttach.push(...this.SRc(request));
                    } else {
                        break;
                    }
                } else {
                    if (this.completedRequests.CAb &&
                        this.completedRequests.CAb.contentStartTicks < request.contentStartTicks) {
                        break;
                    }
                    if (!request.canAppend()) break;
                    toAttach.push(request);
                }

                count++;
                if (!NumberUtils.wc(this.B2a)) {
                    this.B2a = request.timestamp?.playbackSegment;
                }
            }

            this.VE++;
            if (maxRequests !== undefined && count >= maxRequests) break;
        }

        if (toAttach.length) {
            if (this.readInt32.length !== undefined) {
                this.error("tryToAtach() but requestQueue has sentinel:", this.readInt32.length);
                this.readInt32.AQb();
            }

            promise = Promise.all(toAttach.map(request =>
                self.readInt32.enqueue(request).then(() => self._onRequestAttached(request))
            ));

            this.notifyLastRequest();
        }

        return promise;
    }

    /**
     * Callback when a request is first received (first byte).
     * @param {Object} request - The request that received its first byte
     */
    onFirstByte(request) {
        if (request.isHeaderSegment && request.canAppend() && !this.config.enableRequestAbandonment) {
            this.bW();
        }
        this.onFirstByteReceived(request);
    }

    /**
     * Callback when data is received for a request.
     * Checks if enough data has been received to start attachment.
     * @param {Object} request - The request receiving data
     * @param {*} data - The received data chunk
     */
    onDataReceived(request, data) {
        if (this.config.enableRequestAbandonment && request.canAppend() && !request.appended) {
            const stream = request.stream;
            const track = stream.track;
            const bitrate = stream.bitrate;

            const threshold = calculateAttachThreshold({
                dfc: request.la,
                KHc: track.downloadables[0].bitrate,
                internal_Smc: bitrate,
                CJc: this.config.streamModeAppendAttachThreshold,
                wUc: request.offset.ri,
                isLive: this.isLive.viewableSession.isAdPlaygraph,
            });

            if (request.bytesReceived >= threshold) {
                this.bW();
            }
        }

        this.onDataReceived(request, data);
    }

    /**
     * Callback when a request completes.
     * @param {Object} request - The completed request
     * @param {*} result - The completion result
     */
    onRequestComplete(request, result) {
        if (request.isHeaderSegment && !request.appended) {
            this.bW();
        }

        if (this.branchPruner?.state === completionState.complete) {
            this.branchPruner?.reuseOnErrorCacheSize();
        }

        this.onRequestCompleted(request, result);
    }

    /**
     * Updates request URLs (e.g., after URL expiration).
     * @returns {Array} List of requests that successfully swapped URLs
     */
    updateRequestUrls() {
        const self = this;
        const swapped = [];

        this.completedRequests.forEach((request) => {
            const status = request.streamId?.call(request);
            if (status === 1) {
                swapped.push(request);
            } else if (status === 2) {
                self.isLive.viewableSession.onNetworkFailure({ ej: "swapUrl failure" });
            }
        });

        return swapped;
    }

    /**
     * Provides padding fragments for missing segments based on media type.
     * @param {Object} request - The request with a missing segment
     * @returns {Array} Padding fragment requests
     * @private
     */
    SRc(request) {
        let paddingRequests = [];

        switch (this.mediaType) {
            case MediaType.V: // AUDIO
                paddingRequests = this._provideAudioPadding(request);
                break;
            case MediaType.U: // VIDEO
                paddingRequests = this._provideVideoPadding(request);
                break;
            case MediaType.TEXT_MEDIA_TYPE:
                paddingRequests = this._provideTextPadding(request);
                break;
            case MediaType.supplementaryMediaType:
                this.console.error("providePaddingFragments not implemented for MEDIA_EVENTS");
                break;
        }

        if (request.qz?.notifyInitialize) {
            paddingRequests[paddingRequests.length - 1].qz = { nI: true };
        }

        return paddingRequests;
    }

    // --- Private methods ---

    /** @private */
    _insertRequest(request) {
        this.completedRequests.insertNode(request);

        if (this.branchPruner?.state === completionState.complete) {
            this.branchPruner?.reuseOnErrorCacheSize();
        }

        this.internal_Sgc();
        if (request.stateInfo) this.pba = false;
    }

    /** @private */
    _onRequestAttached(request) {
        this.PMa = request;
    }

    /** @private */
    _resetRequestState() {
        const hadRequests = this.completedRequests !== undefined && this.completedRequests.length > 0;
        const oldRequests = this.completedRequests;

        this.completedRequests = new RequestList(this.console, this);
        this.VE = 0;
        this.readInt32.clear();
        this.PMa = undefined;
        this.B2a = null;
        this.branchPruner?.reuseOnErrorCacheSize();
        this.trb = this.pba = false;

        if (hadRequests) {
            const requestsCopy = oldRequests.map(r => r);
            this.xm.internal_Kwa(requestsCopy);
        }
    }

    /** @private */
    internal_Sgc() {
        if (!this.pba) this.pba = true;
    }

    /** @private */
    _getOutstandingCount() {
        return this.completedRequests.bn + this.completedRequests.JO;
    }

    /**
     * Generator that prunes old completed requests on a schedule.
     * @private
     */
    *_pruneOldRequests() {
        while (this.completedRequests.length) {
            const request = this.completedRequests.key(0);
            const pruneDelay = TimeUtil.fromMilliseconds(this.config.tC?.playbackSegment ?? 0);
            const delayMs = pruneDelay.item(request.previousState);
            yield completionState.ie.millisecondsDelay(delayMs);

            if (this.completedRequests.complete.length <= 1 && !request.stateInfo) break;

            assert(request === this.completedRequests.key(0));
            if (!request.appended) this.KQ(request);

            const removed = this.completedRequests.splice(0, 1);
            if (this.VE > 0) this.VE--;

            this.xm.internal_Kwa(removed);
        }
    }

    /** @private */
    _provideAudioPadding(request) {
        const factory = MediaFactory.instance();
        return factory.yha.POb(
            this.isLive.viewableSession, request.stream.durationValue,
            getProfileType(request.stream.profile), request.stream.bitrate,
            request.stream.track.codecValue, request.offset,
            this.isLive.currentSegment,
            (x, y) => request.timestamp.item(y).downloadState(x).$,
            this.config, this.console
        );
    }

    /** @private */
    _provideVideoPadding(request) {
        const frameRate = request.stream.track.frameDuration?.K3a();
        assert(frameRate, "Video streams must have a frame rate");

        const factory = MediaFactory.instance();
        return factory.yha.QOb(
            this.isLive.viewableSession, "padding", request.stream.profile,
            frameRate, request.stream.track.resolution?.zD,
            request.stream.track.codecValue, request.offset,
            this.isLive.currentSegment,
            (z, B) => request.timestamp.item(B).downloadState(z).$,
            this.console
        ).fragmentIndex;
    }

    /** @private */
    _provideTextPadding(request) {
        const factory = MediaFactory.instance();
        request.loadRawData(factory.yha.XRc(), true);
        return [request];
    }

    /** @private - Aborts a request, returns true if successful */
    KQ(request) {
        return request.abort();
    }
}

export { MediaRequestBranch };
