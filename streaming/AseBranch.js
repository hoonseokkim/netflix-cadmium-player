/**
 * Netflix Cadmium Player - ASE (Adaptive Streaming Engine) Branch
 *
 * Represents a single branch in the streaming pipeline's branch graph. A branch
 * corresponds to a content segment (e.g., a viewable in a playgraph or ad insertion
 * point) and manages the full lifecycle of streaming that segment:
 *
 * - Acquiring a viewable/manifest for the segment
 * - Setting up media tracks (audio/video/text)
 * - Creating stream selectors for ABR
 * - Managing header fragment receipt
 * - Creating and running segment pipelines
 * - Handling live content timing/randomization
 * - Supporting track changes and error recovery
 * - Coordinating with parent branches for seamless transitions
 *
 * The branch goes through states: CREATED -> normalized (pipeline active) -> CANCELLED.
 *
 * @module AseBranch
 * @see Module_1552
 */

import { __extends, __awaiter, __generator, __decorate } from '../_tslib.js';
import { TimeUtil, Deferred, ie as TimeIe } from '../timing/TimeUtil.js';
import { platform } from '../core/Platform.js';
import { MediaType } from '../player/MediaType.js';
import { assert } from '../assert/Assert.js';
import { vX as TrackSet } from '../streaming/TrackSet.js';
import { u as DEBUG_LOGGING } from '../core/DebugFlags.js';
import { TD as createTextRequestQueue } from '../streaming/TextRequestQueue.js';
import { m7 as SharedStreamSelector, l8 as PerTrackStreamSelector } from '../streaming/StreamSelector.js';
import { WJ as TextQueueManager } from '../streaming/TextQueueManager.js';
import { k8 as ParentStreamProxy } from '../streaming/ParentStreamProxy.js';
import { o0 as trackableDecorator } from '../core/Trackable.js';
import { calculateLiveAdTiming as calculateLiveAdTiming } from '../live/LiveAdTiming.js';
import { ncb as EllaAlgorithms } from '../ella/EllaAlgorithms.js';
import { lW as mediaTypeSortOrder } from '../streaming/StreamSortUtils.js';
import { ase_Lka as AdSegmentPipeline } from '../ads/AdSegmentPipeline.js';
import { $hb as SegmentPipeline } from '../streaming/SegmentPipeline.js';
import { iab as BranchRecorder } from '../streaming/BranchRecorder.js';

/**
 * Branch request states.
 * @enum {number}
 */
export const BranchState = {
    CREATED: 0,
    CANCELLED: 1,
};

/**
 * ASE Branch - manages streaming for a single content segment in the playgraph.
 *
 * @extends BaseBranch (from parent module)
 */
export class AseBranch /* extends BaseBranch */ {
    /**
     * @param {Object} config - Streaming configuration
     * @param {Object} manifestManager - Manifest/viewable manager
     * @param {Object} oU - Event emitter for transport events
     * @param {Object} e3 - Track provider/selector
     * @param {Object} currentPlayer - Current player instance
     * @param {Object} networkState - Network state info
     * @param {Object} mediaTypeConfig - Media type configuration
     * @param {Object} playgraphState - Playgraph state manager
     * @param {Object} branchScheduler - Scheduler for branch operations
     * @param {Object} viewableProvider - Provides the viewable/manifest (LC)
     * @param {Object} W8a - Player core wrapper
     * @param {Object} segmentInfo - Current segment metadata
     * @param {Object} startTime - Branch start time reference
     * @param {Object} console - Logger
     */
    constructor(config, manifestManager, oU, e3, currentPlayer, networkState, mediaTypeConfig,
                playgraphState, branchScheduler, viewableProvider, W8a, /* ...base args */) {
        // super(...)
        this.config = config;
        this.oU = oU;
        this.e3 = e3;
        this.currentPlayer = currentPlayer;
        this.playgraphState = playgraphState;
        this.branchScheduler = branchScheduler;
        this.LC = viewableProvider;
        this.W8a = W8a;

        /** @type {TrackSet} Track management for this branch */
        this.iI = new TrackSet();

        /** @type {number} Counter for live ad prefetch attempts */
        this.l4a = 0;

        /** @type {Object|undefined} Text track selection */
        this.textTrackSelection = undefined;

        /** @type {Object|undefined} Text request queue */
        this.wJ = undefined;

        /** @type {BranchRecorder} Records branch lifecycle events */
        this.rec = new BranchRecorder({ ma: this });

        /** @type {Object|undefined} Live ad manifest timing handle */
        this.qva = undefined;

        /** @type {Object|undefined} ELLA algorithms instance */
        this.ellaAlgorithms = undefined;

        /** @type {Deferred} Resolves when the branch is fully normalized */
        this.normalizedPromise = new Deferred();
        this.normalizedPromise.then(() => {
            if (DEBUG_LOGGING) this.console.log("AseBranch normalized promise callback", this.branchId);
        });

        /** @type {Deferred} Resolves when header fragments are received */
        this.headerPromise = new Deferred();

        /** @type {Function} Callback for header fragment events */
        this.onHeaderFragmentHandler = this._createHeaderHandler();

        /** @type {Array} Per-media-type stream selectors */
        this.perMediaTypeSelectors = [];
    }

    // --- Properties ---

    /** @returns {number} Current live edge position, or -1 */
    get Le() {
        return this.e3?.lWa() ?? -1;
    }

    /**
     * Returns the stream selector for a given media type index.
     * Uses shared selector for shared mode, per-track otherwise.
     */
    rca(mediaTypeIndex) {
        return this.isSharedStreamSelector()
            ? this.sharedStreamSelector
            : this.perMediaTypeSelectors[mediaTypeIndex];
    }

    /** @returns {Array} Initial track list from the track provider */
    get oa() {
        if (this.om && this.xY?.length === 0 && this.e3) {
            if (DEBUG_LOGGING) this.console.pauseTrace("Branch getting initial tracks");
            this.xY = this.e3.Z3(this.viewableSession).sort(mediaTypeSortOrder);
            if (DEBUG_LOGGING) this.console.pauseTrace("Branch got initial tracks:", this.xY);
        }
        return this.xY;
    }

    /** @returns {boolean} Whether all media has been appended to source buffer */
    get TY() {
        return this.hasMoreSegments
            ? this.$A().every(s => s.requestEventEmitter.allMediaAppended)
            : false;
    }

    /** @returns {boolean} Whether any pipeline has pending partial buffers */
    get XOa() {
        return this.$A().some(s => s.internal_Pbc);
    }

    /** @returns {boolean} Whether this is the last segment in the playgraph */
    get Pk() {
        return !!this.segmentPipelineState?.isLastSegmentFlag;
    }

    /** @returns {boolean} Whether there are more segments after this one */
    get Dk() {
        return !!this.segmentPipelineState?.hasMoreSegments;
    }

    /** @returns {number} Count of segments processed */
    get bL() {
        return this.segmentPipelineState?.segmentCount ?? 0;
    }

    /** @returns {boolean} Whether playback is active for this branch */
    get ag() {
        return !!this.segmentPipelineState?.isPlaybackActive;
    }

    /** @returns {Promise} Promise that resolves when branch is normalized */
    get UO() {
        return this.normalizedPromise.promise.then(() => {});
    }

    /** @returns {Promise} Promise that resolves when viewable is available */
    get PBa() {
        return this.LC.mq.then(() => {});
    }

    /** @returns {boolean} Whether the viewable/manifest is available */
    get om() {
        return !!this.LC?.viewableSession;
    }

    /** @returns {boolean} Whether all tracks have received their headers */
    get fta() {
        return !!this.tracks.length && this.tracks.every(t => t.headerReceived);
    }

    /** @returns {Object} The viewable session (asserts it exists) */
    get L() {
        assert(this.LC.viewableSession, "viewable should be available");
        return this.LC.viewableSession;
    }

    /** @returns {number} Timescale value for this branch */
    get O() {
        return this.segmentPipelineState?.timescaleValue || this.ar.timescaleValue;
    }

    /** @returns {number} Content start time in ticks */
    get Cb() {
        return this.segmentPipelineState?.contentStartTicks ?? this.ar.$;
    }

    /** @returns {number} Content end time in ticks */
    get Pb() {
        return this.segmentPipelineState?.contentEndTicks
            ?? this.currentSegment.endTime.downloadState(this.ar.timescaleValue).$;
    }

    // --- Lifecycle Methods ---

    /**
     * Main initialization: acquires viewable, sets up tracks, waits for headers,
     * then normalizes the branch (creates segment pipeline).
     */
    async data() {
        super.data();
        if (this.isCancelledFlag) return;

        if (DEBUG_LOGGING) this.console.log(`AseBranch {${this.currentSegment.id}} awaiting viewable`);

        await this.LC.data(this, async () => {
            if (DEBUG_LOGGING) this.console.pauseTrace(`Branch {${this.currentSegment.id}}: Waiting for randomization`);
            const result = await this._performLiveRandomization();
            if (DEBUG_LOGGING) this.console.pauseTrace(`Branch {${this.currentSegment.id}}: Randomization complete`);

            if (this.isCancelledFlag) {
                if (DEBUG_LOGGING) this.console.pauseTrace(`Branch {${this.currentSegment.id}}: Cancelled`);
                await new Promise(() => {}); // Block forever
            }
            return result;
        });

        if (this.isCancelledFlag) return;

        assert(this.LC.viewableSession, "viewable should be available");
        if (this.LC.viewableSession.$5a()) {
            this.config = this.LC.viewableSession.config;
        }

        // Get parent stream bundles
        const parentBundles = this.tracks.map(track => this.parent?.streamBundle(track.mediaType));

        this.pSb(this.ar);
        this.tracks.some(track => {
            if (track.mediaType === MediaType.TEXT_MEDIA_TYPE) {
                this._setupTextTrack(track);
            }
        });

        await this._waitForHeaders();

        if (DEBUG_LOGGING) this.console.log(`AseBranch {${this.currentSegment.id}} have headers`);
        if (this.isCancelledFlag) return;

        if (this.parent) {
            await this.U2.OXb();
            if (this.isCancelledFlag) return;

            if (DEBUG_LOGGING) this.console.log(`AseBranch {${this.currentSegment.id}} parent normalized, creating header streamables`);
            this._setupParentStreams(parentBundles);
        }

        this._normalize();
    }

    /**
     * Creates the segment pipeline and resolves the normalized promise.
     * @private
     */
    _normalize() {
        if (DEBUG_LOGGING) this.console.log(`AseBranch {${this.currentSegment.id}} normalizing`);

        if (this.isCancelledFlag) return;

        const PipelineClass = this.viewableSession.isAdPlaygraph ? AdSegmentPipeline : SegmentPipeline;

        this.segmentPipelineState = new PipelineClass(
            this, this.config, this.console, this.viewableSession,
            this.oU, this.viewableId, this.ar, this.iI.items,
            this.gD, this.currentPlayer, this.playgraphState,
            this.events, this.branchScheduler
        );

        this.aTa(this.segmentPipelineState.ER);

        if (DEBUG_LOGGING) this.console.log(`AseBranch {${this.currentSegment.id}} normalizing - setting normalized branch`);

        this.normalizedPromise.resolve(this.segmentPipelineState);
        this.events.emit("needsRequest");
    }

    /**
     * Cancels all streaming for this branch and cleans up resources.
     * @param {string} [reason="other"] - Cancellation reason
     */
    cancelStreaming(reason = "other") {
        super.cancelStreaming(reason);
        this.requestState = BranchState.CANCELLED;

        let viewableSession;
        if (this.om) {
            viewableSession = this.viewableSession;
            this.viewableSession.events.validateManifest("onHeaderFragments", this.onHeaderFragmentHandler);
        }

        this.segmentPipelineState?.cancelStreaming(reason);

        this.iI.forEach(track => {
            track.cancel();
            track.streamSelector.streamBundle(track.mediaType).destroy();
        });

        this.LC.destroy();

        if (this.qva) {
            this.qva.destroy();
            this.qva = undefined;
        }

        if (this.wJ) {
            this.wJ.removeAllListeners();
            if (DEBUG_LOGGING) this.console.pauseTrace("AseBranch destroying textRequestQueue:", this.wJ);
            TextQueueManager.instance.yaa(this.wJ);
            this.wJ = undefined;
        }

        this.events.emit("branchDestroyed", { type: "branchDestroyed", reason, L: viewableSession });
        this.events.removeAllListeners();
    }

    /** @returns {boolean} Whether a given media type is ready for playback */
    isReadyForPlayback(mediaType) {
        return !!this.segmentPipelineState?.isReadyForPlayback(mediaType);
    }

    /** Returns whether this branch supports a given media type */
    supportsMediaType(mediaType) {
        return this.tracks.some(t => t.mediaType === mediaType);
    }

    /** Returns all stream bundles, optionally sorted */
    $A(sortFn = mediaTypeSortOrder) {
        return this.segmentPipelineState?.$A(sortFn) || [];
    }

    /** Returns the stream bundle for a given media type */
    streamBundle(mediaType) {
        return this.rca(mediaType)?.streamBundle(mediaType);
    }

    /** Returns media streamables for this branch */
    returning() {
        if (!this.fta) return this.iI.items;
        const result = this.segmentPipelineState?.returning() || [];
        if (DEBUG_LOGGING) this.console.pauseTrace("getMediaStreamables returning:", result);
        return result;
    }

    /** Gets the start time for a given media type */
    getStartTime(mediaType, offset) {
        return this.segmentPipelineState?.getStartTime(mediaType, offset) || 0;
    }

    /** Gets the buffer status across all media types */
    getBufferStatus() {
        return this.segmentPipelineState?.getBufferStatus() || {};
    }

    /** Gets the end time for a given media type */
    getEndTime(mediaType) {
        return this.segmentPipelineState?.getEndTime(mediaType) || this.lI.playbackSegment;
    }

    /**
     * Sets new tracks for the branch, updating pipelines as needed.
     * @param {Array} tracks - New track list
     * @param {Object} startTime - New start time reference
     * @param {*} options - Additional options
     * @param {Array} mediaTypes - Media types to update
     */
    async canResume(tracks, startTime, options, mediaTypes) {
        if (DEBUG_LOGGING) this.console.pauseTrace("Branch.setTracks:", tracks);
        this.xY = tracks.sort(mediaTypeSortOrder);
        this.pSb(startTime);

        if (this.isPlaybackActive) {
            assert(this.segmentPipelineState);

            const headerTracks = this.iI.filter(t => t.track.headerReceived).items;
            const updateResult = this.segmentPipelineState.DWb(headerTracks, startTime, options, mediaTypes);
            if (updateResult.ase_Bqa) {
                this.aTa(updateResult.ER);
            }

            if (!this.fta) {
                this.headerPromise = new Deferred();
                this.normalizedPromise = new Deferred();

                if (DEBUG_LOGGING) this.console.log(`AseBranch {${this.currentSegment.id}} setTracks waiting for headers`);
                await this._waitForHeaders();

                if (this.isCancelledFlag) return;
                if (this.parent) await this.parent.UO;

                this.segmentPipelineState.DWb(this.iI.items, startTime, options, []);

                if (DEBUG_LOGGING) this.console.log(`AseBranch {${this.currentSegment.id}} setTracks pipelines updated`);
                this.normalizedPromise.resolve(this.segmentPipelineState);
                this.events.emit("needsRequest");
            }
        }

        // Handle text track updates
        tracks.some(track => {
            if (track.mediaType === MediaType.TEXT_MEDIA_TYPE) {
                this._setupTextTrack(track);
                return true;
            }
        });

        this.getErrorRecoveryMode(mediaTypes);
    }

    /**
     * Creates the stream selector for shared mode (audio + video combined).
     * @private
     */
    _createSharedStreamSelector(trackInfo) {
        const algorithm = trackInfo.track.isAdPlaygraph
            ? this.config.liveStreamSelectorAlgorithm
            : this.config.ase_stream_selector;

        const audioTrack = this.JS(MediaType.V);
        const videoTrack = this.JS(MediaType.U);
        const videoDownloadables = this.$Sb(MediaType.U);

        const audioProxy = new ParentStreamProxy(() => this.parent?.streamBundle(MediaType.V));
        const videoProxy = new ParentStreamProxy(() => this.parent?.streamBundle(MediaType.U));

        if (audioTrack) audioProxy.R5a(audioTrack);
        if (videoTrack) videoProxy.R5a(videoTrack);

        this.sharedStreamSelector = new SharedStreamSelector(algorithm, this.config, audioProxy, videoProxy, videoDownloadables);
    }

    /**
     * Creates a per-track stream selector for a single media type.
     * @private
     */
    _createPerTrackStreamSelector(trackInfo) {
        const algorithm = trackInfo.mediaType === MediaType.V
            ? this.config.audiostreamSelectorAlgorithm
            : trackInfo.track.isAdPlaygraph
                ? this.config.liveStreamSelectorAlgorithm
                : this.config.ase_stream_selector;

        const proxy = new ParentStreamProxy(() => this.parent?.streamBundle(trackInfo.track.mediaType));
        proxy.R5a(trackInfo.track);

        const selector = new PerTrackStreamSelector(algorithm, this.config, proxy, this.$Sb(trackInfo.mediaType));
        this.perMediaTypeSelectors[trackInfo.mediaType] = selector;
    }

    /**
     * Initializes the ELLA (Enhanced Low-Latency Algorithm) subsystem.
     * @private
     */
    _initializeElla() {
        const audioTrack = this.JS(MediaType.V);
        const videoTrack = this.JS(MediaType.U);
        const networkMonitor = this.viewableSession.networkMonitor;
        const relayServers = this.viewableSession.manifestRef.ella?.relayServers;

        this.ellaAlgorithms = new EllaAlgorithms(networkMonitor, this.console, audioTrack, videoTrack, this.config, relayServers);
    }

    /**
     * Sets up a text track and creates a text request queue if needed.
     * @private
     */
    _setupTextTrack(track) {
        this.textTrackSelection = track;

        if (!this.wJ) {
            this.wJ = createTextRequestQueue(
                MediaType.TEXT_MEDIA_TYPE, this.viewableSession, this.config, this.console, true,
                (report) => this.oU.emit("transportReport", report),
                (report) => this.oU.emit("mediaRequestComplete", report),
                () => {}
            );
            if (DEBUG_LOGGING) this.console.pauseTrace("AseBranch created textRequestQueue:", this.wJ);
        }

        this.getErrorRecoveryMode([MediaType.TEXT_MEDIA_TYPE]);
    }

    /**
     * Waits for header fragments to be received for all tracks.
     * @private
     */
    async _waitForHeaders() {
        if (this.fta) {
            this.headerPromise.resolve();
        } else {
            this.viewableSession.events.on("onHeaderFragments", this.onHeaderFragmentHandler);
            this.events.emit("needsRequest");
        }
        return this.headerPromise.promise;
    }

    /**
     * Creates the handler for header fragment events.
     * @returns {Function} Event handler
     * @private
     */
    _createHeaderHandler() {
        return () => {
            if (!this.isCancelledFlag && this.fta) {
                this.viewableSession.events.validateManifest("onHeaderFragments", this.onHeaderFragmentHandler);
                this.headerPromise.resolve();
            }
        };
    }

    /**
     * Performs live content timing randomization to spread manifest requests.
     * @returns {Promise<Object|undefined>} Timing result for live ad manifests
     * @private
     */
    async _performLiveRandomization() {
        if (!this.parent) return;
        if (this.isCancelledFlag) return;
        if (!this.config.enableLiveManifestThrottling) return;

        await this.U2.PXb();

        if (!this.parent) return;

        const rootViewable = this.parent.viewableSession.jk || this.parent.viewableSession;
        if (!rootViewable?.isAuxiliary || !rootViewable.networkState) return;

        if (!this.parent || this.isCancelledFlag) return;
        await this._calculateLiveTiming();

        if (!this.trackMeta) return;

        const networkState = rootViewable.networkState;
        const endTime = this.timestamp.lowestWaterMarkLevelBufferRelaxed(this.trackMeta);
        const steeringOffset = this.e3?.RVa(this.currentSegment.id);

        if (!endTime.isFinite()) return;

        const timing = calculateLiveAdTiming(endTime, networkState, this.config, steeringOffset);
        const { QZc, oPc, WIb, M4c, delay, timeRandomizationWasCalculated } = timing;

        if (DEBUG_LOGGING) {
            this.console.info(`AseBranch {${this.currentSegment.id}} ad start availability time: ${QZc}`, {
                liveAdManifestWindowMs: this.config.liveAdManifestWindowMs,
                delay,
            });
        }

        if (oPc > platform.platform.now()) {
            await new Promise((resolve) => {
                this.qva = this.W8a.uu(
                    TimeIe.millisecondsDelay(TimeUtil.fromMilliseconds(oPc)),
                    resolve,
                    "liveAdManifestWindow"
                );
            });

            return {
                Xia: this.config.liveAdManifestWindowMs,
                TQ: M4c,
                K4: delay,
                xC: M4c + delay,
                timeRandomizationWasCalculated,
            };
        }
    }
}
