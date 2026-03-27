/**
 * Netflix Cadmium Player - PlaygraphMetricsReporter
 *
 * Extends BaseAsePlayer to coordinate playgraph-based streaming, managing
 * DRM viewable IDs, pipeline health monitoring, presentation delay control,
 * network metrics reporting, and branch lifecycle events.
 *
 * @module PlaygraphMetricsReporter
 */

import {
    __extends,
    __awaiter,
    __generator,
    __values,
    __read,
    __spreadArray,
    __decorate,
    __importDefault,
} from '../runtime/tslib';
import { ClockWatcher } from '../events/ClockWatcher';
import { TimeUtil, findLast } from '../util/TimeUtil';
import { laser } from '../logging/laser';
import { jh as ClockDriftCollection } from '../metrics/ClockDriftCollection';
import { assert } from '../util/assert';
import { MediaType } from '../media/MediaType';
import { tK as TaskScheduler, ie as TaskPriority } from '../scheduling/TaskScheduler';
import { gz as DecoratorRegistry } from '../decorators/DecoratorRegistry';
import { xKa as ManifestProcessorEvent } from '../manifest/ManifestProcessorEvent';
import { o0 as injectable } from '../di/injectable';
import NetworkStatsProvider from '../network/NetworkStatsProvider';
import { dkb as PresentationDelayController } from '../streaming/PresentationDelayController';
import { createPipelineHealthMonitor as createPipelineHealthMonitor, cjb as HealthLevel } from '../health/PipelineHealthMonitor';
import { F$a as PlaygraphController } from '../streaming/PlaygraphController';
import { uJa as BaseAsePlayer } from '../player/BaseAsePlayer';
import { zjb as PlayerClock } from '../clock/PlayerClock';
import { nlb as ManifestMetadataTracker } from '../manifest/ManifestMetadataTracker';

/**
 * Throughput metric names used for network metrics reporting.
 * @type {string[]}
 */
const THROUGHPUT_METRIC_NAMES = [
    'throughput-ewma',
    'throughput-ewma2',
    'throughput-sw-fast',
    'throughput-ci',
    'throughput-iqr-history',
    'throughput-iqr',
    'throughput-sw',
    'throughput-tdigest-history',
    'throughput-tdigest',
    'throughput-wssl',
];

/** @type {Function} */
const decorators = DecoratorRegistry.eSa;

/**
 * PlaygraphMetricsReporter - orchestrates ASE (Adaptive Streaming Engine) playback
 * with playgraph-based stream management, DRM lifecycle, pipeline health monitoring,
 * and real-time network/buffer metrics reporting to the laser telemetry system.
 *
 * @extends BaseAsePlayer
 */
class PlaygraphMetricsReporter extends BaseAsePlayer {
    /**
     * @param {Object} player - The underlying media player instance
     * @param {number} drmViewableId - The initial DRM viewable ID
     * @param {Object} config - Streaming configuration parameters
     */
    constructor(player, drmViewableId, config) {
        super();

        /** @type {Object} */
        this.player = player;

        /** @type {number} */
        this.currentDrmViewableId = drmViewableId;

        /** @type {Object} */
        this.config = config;

        /** @type {number[]} DRM viewable IDs that have been marked ready */
        this.drmViewableIds = [];

        /** @type {Object|undefined} Cached prefetch reference holder */
        this.prefetchReference = undefined;

        /** @type {Object|undefined} Current playgraph controller */
        this.currentPlaygraph = undefined;

        /** @type {ClockWatcher} Event watcher for player event bindings */
        this.eventWatcher = new ClockWatcher();

        /** @type {Object|undefined} Cached stream state from prior destroy */
        this.cachedStreamState = undefined;

        /** @type {Object|undefined} Last encryption position tracker */
        this.lastEncryptionPosition = undefined;

        /** @type {number|null} Interval ID for network metrics reporting */
        this.networkMetricsIntervalId = null;

        // Bind player events via the event watcher
        this.eventWatcher.on(this.player, 'underflow', this.onUnderflow.bind(this));

        /** @type {PlayerClock} */
        this.playerClock = new PlayerClock(player);

        this.eventWatcher.on(this.player, 'skipped', this._onSkipped.bind(this));
        this.eventWatcher.on(this.player, 'playbackEnding', this.onPlaybackEnding.bind(this));
        this.eventWatcher.on(this.player, 'paused', this._onPaused.bind(this));

        /** @type {TaskScheduler} */
        this.taskScheduler = new TaskScheduler(this.playerClock, this.console, 'player');

        /** @type {ClockDriftCollection} */
        this.clockDriftCollection = new ClockDriftCollection();

        // Initialize manifest metadata tracker if reuse-on-error caching is available
        if (player.canPlayCodec && player.reuseOnErrorCacheSize) {
            this.manifestMetadata = new ManifestMetadataTracker(this, player, this.console);
        }

        /** @type {PresentationDelayController} */
        this.presentationDelayController = new PresentationDelayController(
            {
                /**
                 * @param {Object} request
                 * @returns {Object}
                 */
                qga(request) {
                    return typeof player.qga === 'function'
                        ? player.qga(request)
                        : { ng: 'APPROVED' };
                },
                /**
                 * @returns {number} Current playgraph ID, or -1 if none
                 */
                txc: () => {
                    return this.currentPlaygraph?.playgraph?.id ?? -1;
                },
                forceEstRelativeLiveBookmark: this.branchScheduler,
            },
            this.config
        );

        // Start presentation delay monitoring if enabled
        if (this.config.enablePresentationDelayControl) {
            this.branchScheduler.startMonitoring(
                () => this.onTimeUpdate(),
                TimeUtil.fromMilliseconds(500)
            );
        }

        /** @type {Object} Pipeline health monitor instance */
        this.pipelineHealthMonitor = createPipelineHealthMonitor({
            JHc: Math.min(
                config.pipelineHealthThresholdLowMs,
                config.minimumPresentationDelayMs - 2500
            ),
            internal_Omc: config.pipelineHealthThresholdCriticalMs,
            /**
             * @returns {Object} The current playback set position
             */
            initializeEncryption: () => this.setPosition,
            /**
             * Collects all source buffers from active branches across media types.
             * @returns {Array} List of source buffers
             */
            tyc: () => {
                const activeBranches =
                    this.currentPlaygraph?.getActiveBranchList() || [];
                const sourceBufferList = [];
                for (const branch of activeBranches) {
                    for (const mediaType of [
                        MediaType.V,
                        MediaType.U,
                        MediaType.TEXT_MEDIA_TYPE,
                    ]) {
                        const buffer = branch.$d(mediaType);
                        if (buffer) {
                            sourceBufferList.push(buffer);
                        }
                    }
                }
                return sourceBufferList;
            },
            forceEstRelativeLiveBookmark: this.branchScheduler,
            console: this.console,
            healthCheckInterval: 500,
        });

        // Bind methods that are used as callbacks
        this.onPlayingStateChange = this.onPlayingStateChange.bind(this);
        this.dxa = this.dxa.bind(this);

        // Wire up health change listener and playing state listener
        this.pipelineHealthMonitor.addListener('healthChange', this.dxa);
        this.player.addListener('playing', this.onPlayingStateChange);

        // Start periodic network metrics reporting if laser telemetry is enabled
        if (laser.isEnabled && laser.LS) {
            this.networkMetricsIntervalId = setInterval(
                this.reportNetworkMetrics.bind(this),
                500
            );
        }
    }

    // ─── Getters ────────────────────────────────────────────────────────

    /**
     * The player's default time offset.
     * @type {number}
     */
    get defaultTimeOffset() {
        return this.player.defaultTimeOffset;
    }

    /**
     * The current DRM viewable ID used for this session.
     * @type {number}
     */
    get drmViewableIdProperty() {
        return this.currentDrmViewableId;
    }

    /**
     * Active branches from the current playgraph, or an empty array.
     * @type {Array}
     */
    get sourceBuffers() {
        return this.currentPlaygraph?.activeBranches || [];
    }

    /**
     * Live edge detector from the current playgraph, if available.
     * @type {Object|undefined}
     */
    get liveEdgeDetector() {
        return this.currentPlaygraph?.liveEdgeDetector;
    }

    /**
     * Media type to buffer map from the current playgraph, or an empty map.
     * @type {Map}
     */
    get mediaTypeBufferMap() {
        return this.currentPlaygraph?.mediaTypeBufferMap || new Map();
    }

    /**
     * List of active branches from the current playgraph.
     * @type {Array}
     */
    get activeBranchList() {
        return this.currentPlaygraph?.getActiveBranchList() || [];
    }

    /**
     * The underlying playgraph object from the current controller.
     * @type {Object|undefined}
     */
    get playgraphData() {
        return this.currentPlaygraph?.playgraph;
    }

    /**
     * The player clock instance.
     * @type {PlayerClock}
     */
    get clock() {
        return this.playerClock;
    }

    /**
     * Whether all branches are ready and the current track has more segments.
     * @type {boolean}
     */
    get hasMoreContent() {
        return !!(
            this.currentPlaygraph?.allBranchesReady &&
            this.currentTrackInfo?.hasMoreSegments
        );
    }

    /**
     * Whether all branches in the current playgraph are ready.
     * @type {boolean}
     */
    get allBranchesReady() {
        return this.currentPlaygraph?.allBranchesReady ?? false;
    }

    /**
     * The last position info prior to a skip event.
     * @type {Object|undefined}
     */
    get lastPositionPriorToSkip() {
        return this.lastSkipPosition;
    }

    // ─── Playback Lifecycle ─────────────────────────────────────────────

    /**
     * Handles the playback ending event. Emits a "playbackEnding" event
     * with the final player timestamp and position, and logs to laser.
     *
     * @param {Object} event - The playback ending event data
     */
    onPlaybackEnding(event) {
        if (!this.isPlaybackStarted) {
            this.console.RETRY(
                `Unexpected playback ending event at ${event.hasContent}`
            );
            return;
        }

        const position = this.seekSegmentPosition(
            event.hasContent || this.player.playbackPosition,
            true
        );
        assert(position, 'Playback ending at position outside playgraph');

        const playerTimestamp = this.eB(position);
        assert(playerTimestamp, 'Playback ending at clamped position outside playgraph');

        this.events.emit('playbackEnding', {
            type: 'playbackEnding',
            playerTimestamp,
            position,
        });

        if (laser.isEnabled) {
            laser.log({
                playgraphId: this.playgraph?.id || -1,
                type: 'PRESENTING_STATE_CHANGE',
                state: 'ENDED',
            });
        }
    }

    /**
     * Registers a DRM viewable ID as ready. Forwards it to the current
     * playgraph controller and emits a "drmReady" event.
     *
     * @param {number} viewableId - The DRM viewable ID
     */
    onDrmReady(viewableId) {
        if (this.drmViewableIds.indexOf(viewableId) === -1) {
            this.drmViewableIds.push(viewableId);
        }
        if (this.currentPlaygraph) {
            this.currentPlaygraph.addDrmViewable(viewableId);
        }
        this.events.emit('drmReady', { viewableId });
    }

    /**
     * Removes a DRM viewable ID from the ready list.
     *
     * @param {number} viewableId - The DRM viewable ID to remove
     */
    onDrmNotReady(viewableId) {
        const index = this.drmViewableIds.indexOf(viewableId);
        if (index !== -1) {
            this.drmViewableIds.splice(index, 1);
        }
    }

    /**
     * Checks whether a given DRM viewable ID is ready for playback.
     *
     * @param {number} viewableId - The DRM viewable ID to check
     * @returns {boolean} True if the viewable is DRM-ready
     */
    isDrmReady(viewableId) {
        if (this.drmViewableIds.indexOf(viewableId) !== -1) {
            return true;
        }
        const matchingBranch = findLast(this.branches, (branch) => {
            return branch.om && branch.viewableSession.J === viewableId;
        });
        return !!matchingBranch?.viewableSession?.isReadyForPlayback;
    }

    /**
     * Forwards a process-frame notification to the current playgraph.
     *
     * @param {Object} frameData - Frame processing data
     */
    onProcessFrame(frameData) {
        this.currentPlaygraph?.onProcessFrame(frameData);
    }

    /**
     * Sets the active DRM viewable on the current playgraph and updates
     * the stored DRM viewable ID.
     *
     * @param {number} viewableId - The DRM viewable ID
     */
    setDrmViewable(viewableId) {
        this.currentPlaygraph?.setDrmViewable(viewableId);
        this.currentDrmViewableId = viewableId;
    }

    // ─── Stream & Branch Management ─────────────────────────────────────

    /**
     * Resets the player state. Clears the clock drift collection,
     * resets encryption tracking, and re-creates sub-components.
     */
    create() {
        this.clockDriftCollection = new ClockDriftCollection();
        super.create();
        this.lastEncryptionPosition = undefined;
        this.currentPlaygraph?.create();
        this.manifestMetadata?.create();
    }

    /**
     * Deactivates a single branch by ID.
     *
     * @param {Object} branch - The branch to deactivate
     */
    deactivateBranch(branch) {
        this.deactivateBranches([branch]);
    }

    /**
     * Deactivates multiple branches. Delegates to the parent class for each,
     * notifies the manifest metadata tracker, and forwards to the playgraph.
     *
     * @param {Array} branches - The branches to deactivate
     */
    deactivateBranches(branches) {
        branches.forEach((branch) => {
            super.deactivateBranch(branch);
            this.manifestMetadata?.TUc(branch);
        });
        this.currentPlaygraph?.deactivateBranches(branches);
    }

    /**
     * Clears all branches from the current playgraph.
     */
    clearAllBranches() {
        this.currentPlaygraph?.clearAllBranches();
    }

    /**
     * Pauses streaming pipelines and delegates to the parent.
     *
     * @param {Array|undefined} mediaTypes - Media types to pause, or all if undefined
     */
    pause(mediaTypes) {
        this.pauseAllPipelines(mediaTypes);
        super.pause(mediaTypes || this.mediaTypesForBranching);
    }

    /**
     * Resumes streaming pipelines and delegates to the parent.
     *
     * @param {Array|undefined} mediaTypes - Media types to resume, or all if undefined
     */
    resume(mediaTypes) {
        this.currentPlaygraph?.resume(mediaTypes);
        super.resume(mediaTypes || this.mediaTypesForBranching);
    }

    /**
     * Destroys this reporter, cleaning up all listeners, timers,
     * sub-components, and cached state.
     */
    destroy() {
        this.pipelineHealthMonitor.removeListener('healthChange', this.dxa);
        this.player.removeListener('playing', this.onPlayingStateChange);

        // Cache the stream state if currently active
        this.cachedStreamState = this.isStreamActive()
            ? this.getStreamState()
            : undefined;

        if (this.currentPlaygraph) {
            this.onPlaygraphDestroyed(this.currentPlaygraph.playgraph);
        }

        this.playerClock.destroy();
        this.taskScheduler.destroy();
        this.eventWatcher.clear();
        this.manifestMetadata?.destroy();

        super.destroy();

        this.pipelineHealthMonitor.aseTimer();
        clearInterval(this.networkMetricsIntervalId);
    }

    /**
     * Initializes or returns the current encryption position.
     * Tracks clock drift and emits log events when positions diverge.
     *
     * @returns {Object} The current or cached encryption position
     */
    initializeEncryption() {
        if (!this.currentPlaygraph?.cencProtectionSpecified) {
            return super.initializeEncryption();
        }

        const currentPosition = this.player.playbackPosition;

        if (this.playerCore.zj) {
            if (this.lastEncryptionPosition) {
                if (this.lastEncryptionPosition.greaterThan(currentPosition)) {
                    const relaxed =
                        this.lastEncryptionPosition.lowestWaterMarkLevelBufferRelaxed(
                            currentPosition
                        );
                    this.clockDriftCollection.push(relaxed.playbackSegment);
                    return this.lastEncryptionPosition;
                }

                if (this.branches.length) {
                    const lastBitrate = this.currentPlaygraph.lastMediaBitrate;
                    if (lastBitrate && lastBitrate.lessThan(currentPosition)) {
                        this.events.emit('logdata', {
                            type: 'logdata',
                            target: 'endplay',
                            createView: {
                                clockdrift: { type: 'count' },
                            },
                        });
                        return this.lastEncryptionPosition;
                    }
                }
            }
            this.lastEncryptionPosition = currentPosition;
        }

        return currentPosition;
    }

    /**
     * Fetches the playback rate, falling back to the parent's fetchData.
     *
     * @returns {*} The playback rate or parent result
     */
    fetchData() {
        let result = this.player.playbackRate;
        if (result === undefined) {
            result = super.fetchData();
        }
        return result;
    }

    /**
     * @returns {boolean} Whether a stream is currently active (including cached state)
     */
    isStreamActive() {
        return !!this.cachedStreamState || super.isStreamActive();
    }

    /**
     * @returns {Object} The current stream state, or cached state from a prior destroy
     */
    getStreamState() {
        return this.cachedStreamState
            ? this.cachedStreamState
            : super.getStreamState();
    }

    /**
     * Returns the current playgraph's pending seek target, if valid.
     *
     * @returns {Object|undefined} The pending seek target, or undefined
     */
    getPendingSeekTarget() {
        const pendingTarget = this.currentPlaygraph?.yHb;
        if (
            !this.currentPlaygraph?.playgraph ||
            (pendingTarget && this.playgraph?.segmentMap?.segments[pendingTarget.currentSegment.id])
        ) {
            return pendingTarget;
        }
        return undefined;
    }

    /**
     * Handles playgraph destruction. Asserts the playgraph matches,
     * destroys the controller, and resets the presentation delay controller.
     *
     * @param {Object} playgraph - The playgraph being destroyed
     */
    onPlaygraphDestroyed(playgraph) {
        assert(playgraph === this.playgraph);
        this.currentPlaygraph?.destroy();
        this.currentPlaygraph = undefined;
        this.playgraph?.events?.removeListener(
            'seeking',
            this.pipelineHealthMonitor.markHealthDegraded
        );
        this.presentationDelayController.create();
    }

    /**
     * Claims playback resources from a prefetch context. Creates a new
     * PlaygraphController and wires up pipeline health monitoring.
     *
     * @param {Object} playgraph - The playgraph to claim
     * @param {Object|undefined} prefetchState - Optional prefetch state
     * @returns {boolean} Whether the claim succeeded
     */
    claimFromPrefetch(playgraph, prefetchState) {
        this.cachedStreamState = undefined;

        const result = super.claimFromPrefetch(playgraph, prefetchState);
        if (result) {
            const controller = new PlaygraphController(
                playgraph,
                this,
                this.console,
                playgraph.config,
                this.config,
                this.events,
                this.mediaTypesForBranching,
                this.taskScheduler,
                this.manifestMetadata,
                this.tQ,
                this.oQ,
                this.kob,
                prefetchState?.liveEdgeDetector,
                prefetchState?.mediaTypeBufferMap
            );

            prefetchState?.clearReferences();
            this.currentPlaygraph = controller;
            this.pauseAllPipelines(this.X2);

            if (this.manifestMetadata) {
                let processorEvent =
                    playgraph.eventProcessingPipeline.internal_Xyc(ManifestProcessorEvent);
                if (!processorEvent) {
                    processorEvent = new ManifestProcessorEvent();
                    playgraph.getRemaining(processorEvent);
                }
                this.manifestMetadata.yTc(processorEvent);
            }

            this.playgraph?.events?.addListener(
                'seeking',
                this.pipelineHealthMonitor.markHealthDegraded
            );
        }

        return result;
    }

    /**
     * Clears references to the current playgraph and prefetch holder.
     */
    clearReferences() {
        this.currentPlaygraph?.clearReferences();
        this.prefetchReference?.destroy();
    }

    /**
     * Adds one or more branches to the current playgraph and parent.
     *
     * @param {...Object} newBranches - Branches to add
     */
    addBranches(...newBranches) {
        const controller = this.currentPlaygraph;
        assert(controller);
        newBranches.forEach((branch) => controller.enqueueBranch(branch));
        super.addBranches(...newBranches);
    }

    /**
     * Delegates lha (branch finalization) to the current playgraph.
     */
    finalizeBranches() {
        this.currentPlaygraph?.lha();
    }

    /**
     * Updates the playgraph segment mapping for a transition.
     *
     * @param {Object} transition - Contains `to` and `from` segment references
     * @param {*} param2 - Additional parameter
     * @param {*} param3 - Additional parameter
     */
    updateSegmentMapping(transition, param2, param3) {
        this.playgraph?.H7a(transition.to, transition.from, param2, param3, true);
    }

    /**
     * Parses data at the given position. Validates the position is within
     * range of the current track and that the buffer level permits it.
     *
     * @param {Object} position - The playback position to parse at
     * @returns {boolean} Whether parsing succeeded
     */
    parseData(position) {
        if (!this.currentPlaygraph) {
            return false;
        }

        const trackInfo = this.internal_Fba(position);
        if (!trackInfo) {
            return false;
        }

        let threshold = TimeUtil.seekToSample;

        // Use a longer threshold when on the current track with multi-segment or keyed segments
        if (
            trackInfo === this.currentTrackInfo &&
            !trackInfo.currentSegment.xO &&
            (trackInfo.currentSegment.FF > 1 || trackInfo.currentSegment.km?.length)
        ) {
            threshold = TimeUtil.fromMilliseconds(
                this.config.minimumTimeBeforeBranchDecision
            );
        }

        if (
            trackInfo.previousState
                .lowestWaterMarkLevelBufferRelaxed(threshold)
                .lessThan(position) ||
            !trackInfo.isWithinRange(position)
        ) {
            return false;
        }

        return this.currentPlaygraph.parseData(position);
    }

    /**
     * Notifies the presentation delay controller that playback is ready.
     *
     * @param {Object} readyInfo - Playback readiness information
     */
    notifyPlaybackReady(readyInfo) {
        this.presentationDelayController.notifyPlaybackReady(readyInfo);
    }

    /**
     * Returns the current presentation delay, or Infinity if unavailable.
     *
     * @returns {number} The presentation delay in milliseconds
     */
    getPresentationDelay() {
        return this.playgraph?.tCb() ?? Infinity;
    }

    // ─── Event Handlers ─────────────────────────────────────────────────

    /**
     * Handles underflow events. Resets the playgraph position,
     * notifies the presentation delay controller, and logs to laser.
     */
    onUnderflow() {
        if (this.playgraph?.isBuffering) {
            this.console.error(
                'AsePlayer: received underflow in buffering state - ignoring'
            );
            return;
        }

        const currentPos = this.setPosition;
        assert(this.playgraph);

        const segmentPosition = this.seekSegmentPosition(currentPos, true);
        assert(segmentPosition);

        this.currentPlaygraph?.onUnderflow(segmentPosition);

        const trackInfo = this.internal_Fba(currentPos);
        trackInfo?.viewableSession?.setup();

        this.playgraph.onUnderflow(segmentPosition);
        this.presentationDelayController.h4a();

        if (laser.isEnabled) {
            laser.log({
                type: 'STREAMING_STATE_CHANGE',
                playgraphId: this.playgraph?.id ?? -1,
                state: 'REBUFFERING',
            });
            laser.log({
                playgraphId: this.playgraph?.id ?? -1,
                type: 'PRESENTING_STATE_CHANGE',
                state: 'PAUSED',
            });
        }
    }

    /**
     * Handles "skipped" events. Clears the last encryption position
     * and records the skip position.
     *
     * @param {Object} event - The skip event
     */
    _onSkipped(event) {
        this.lastEncryptionPosition = undefined;
        this._recordSkipPosition(event);
    }

    /**
     * Handles "paused" events. Logs a PAUSED state change to laser,
     * notifies the presentation delay controller, and records the position.
     *
     * @param {Object} event - The pause event
     */
    _onPaused(event) {
        if (laser.isEnabled) {
            laser.log({
                playgraphId: this.playgraph?.id ?? -1,
                type: 'PRESENTING_STATE_CHANGE',
                state: 'PAUSED',
            });
        }
        this.presentationDelayController.internal_Xza(false);
        this._recordSkipPosition(event);
    }

    /**
     * Records the last position prior to a skip/pause event, and schedules
     * cleanup after 1 second.
     *
     * @param {Object} event - The event containing position data
     * @private
     */
    _recordSkipPosition(event) {
        if (!this.branches.length || !event?.hasContent) {
            return;
        }

        const targetPosition = event.yOb || event.hasContent;
        const skipRecord = (this.lastSkipPosition = {
            No: targetPosition,
            position: this.seekSegmentPosition(targetPosition, true),
        });

        this.branchScheduler.uu(
            TaskPriority.manifestUrlFetch(TimeUtil.fromMilliseconds(1000)),
            () => {
                if (this.lastSkipPosition === skipRecord) {
                    this.lastSkipPosition = undefined;
                }
            },
            'cleanupLastPositionPriorToSkip'
        );
    }

    /**
     * Returns the current VUa value from the playgraph controller.
     *
     * @returns {*}
     */
    VUa() {
        return this.currentPlaygraph?.VUa();
    }

    /**
     * Queues an async file operation, delegating to the playgraph controller
     * if available, otherwise falling back to the parent.
     *
     * @param {Object} fileOp - The file operation to queue
     */
    queueFileAsync(fileOp) {
        if (this.currentPlaygraph) {
            this.currentPlaygraph.queueFileAsync(fileOp);
        } else {
            super.queueFileAsync(fileOp);
        }
    }

    /**
     * Pauses all media pipelines for the given media types.
     *
     * @param {Array|undefined} mediaTypes - The media types to pause
     */
    pauseAllPipelines(mediaTypes) {
        this.currentPlaygraph?.pauseAllPipelines(mediaTypes);
    }

    /**
     * Asserts the playgraph exists and delegates to the parent's J7a.
     *
     * @param {*} param - Parameter for the parent call
     * @returns {*}
     */
    J7a(param) {
        assert(this.playgraph && this.currentPlaygraph);
        return super.J7a(param);
    }

    /**
     * Delegates o4a callback to the player if available.
     */
    o4a() {
        this.player.o4a?.call(this.player);
    }

    // ─── Playing / Time Update / Health ─────────────────────────────────

    /**
     * Handles the transition to "playing" state. Starts the health monitor,
     * updates the presentation delay controller, and logs to laser.
     */
    onPlayingStateChange() {
        if (this.config.enableRequestAbandonment && !this.pipelineHealthMonitor.isCancelled) {
            this.pipelineHealthMonitor.start();
        }

        this.presentationDelayController.$za(this.getPresentationDelay());
        this.presentationDelayController.internal_Xza(true);

        if (laser.isEnabled) {
            laser.log({
                playgraphId: this.playgraph?.id ?? -1,
                type: 'PRESENTING_STATE_CHANGE',
                state: 'PLAYING',
            });
            laser.log({
                playgraphId: this.playgraph?.id ?? -1,
                type: 'STREAMING_STATE_CHANGE',
                state: 'STREAMING',
            });
        }
    }

    /**
     * Periodic time-update handler for presentation delay monitoring.
     * Updates the delay controller and logs metrics to laser.
     */
    onTimeUpdate() {
        const currentPlaygraph = this.playgraph;
        assert(currentPlaygraph, 'expected playgraph while time updating');

        const presentationDelay = this.getPresentationDelay();
        const targetBufferDuration = currentPlaygraph.getTargetBufferDuration();

        this.presentationDelayController.$za(presentationDelay);

        if (laser.isEnabled) {
            laser.log({
                playgraphId: this.playgraph?.id ?? -1,
                type: 'PRESENTATION_DELAY_CHANGE',
                glassToGlassLatencyMs: -1,
                presentationDelayMs: presentationDelay,
                targetBufferDurationMs: targetBufferDuration,
                targetPresentationDelayMs: this.config.minimumPresentationDelayMs,
            });
        }
    }

    /**
     * Handles health-change events from the pipeline health monitor.
     * Triggers stale request abandonment when health degrades to LOW.
     *
     * @param {Object} healthEvent - The health change event
     * @private
     */
    dxa(healthEvent) {
        const hasStaleRequests = healthEvent.yoc;
        if (healthEvent.ABc === HealthLevel.LOW && hasStaleRequests) {
            this.abandonStaleRequests(healthEvent);
        }
    }

    /**
     * Abandons stale network requests when pipeline health is low.
     * Queries the network stats provider for the current connection state
     * and instructs the monitor to cancel timed-out requests.
     *
     * @param {Object} healthEvent - The health change event
     */
    async abandonStaleRequests(healthEvent) {
        const { ISc: staleDurationMs, me: monitor } = healthEvent;

        const networkStats = await NetworkStatsProvider.instance().SUc();
        if (!networkStats) {
            return;
        }

        const { TKb: connectionType, GQb: effectiveType } = networkStats;
        const adjustedDuration = Math.max(0, staleDurationMs - 500);
        monitor.T$b(adjustedDuration, connectionType, effectiveType);
    }

    // ─── Network Metrics ────────────────────────────────────────────────

    /**
     * Reports network throughput and buffer duration metrics to the laser
     * telemetry system. Called periodically via setInterval.
     */
    reportNetworkMetrics() {
        const statsInstance = NetworkStatsProvider.instance();
        const playgraphId = this.playgraph?.id ?? -1;

        if (statsInstance) {
            const stats = NetworkStatsProvider.instance().key();
            const metrics = [];

            for (const metricName in stats) {
                if (THROUGHPUT_METRIC_NAMES.indexOf(metricName) !== -1) {
                    const metricObj = stats[metricName];
                    if (metricObj && typeof metricObj === 'object') {
                        const avg = metricObj.average;
                        if (typeof avg === 'number') {
                            metrics.push({ name: metricName, value: avg });
                        }
                    }
                }
            }

            metrics.push({
                name: 'response-time-average',
                value: stats.throughputEstimateObj.average,
            });

            laser.log({
                type: 'NETWORK_METRICS_UPDATE',
                responseTimeMs: stats.throughputEstimateObj.average,
                throughputKbps: stats.bufferLength.average,
                metrics,
            });
        }

        // Report buffer durations if available
        const bufferDurationInfo = this.playgraph?.getBufferDurationInfo?.();
        if (bufferDurationInfo) {
            laser.log({
                playgraphId,
                type: 'BUFFER_DURATION_CHANGE',
                durations: {
                    AUDIO: {
                        aheadMs: bufferDurationInfo.totalabuflmsecs,
                        behindMs: 0,
                    },
                    VIDEO: {
                        aheadMs: bufferDurationInfo.totalvbuflmsecs,
                        behindMs: 0,
                    },
                    TEXT: {
                        aheadMs: bufferDurationInfo.totaltbuflmsecs ?? 0,
                        behindMs: 0,
                    },
                    MEDIA_EVENTS: {
                        aheadMs: 0,
                        behindMs: 0,
                    },
                },
            });
        }
    }
}

// Apply decorators (Netflix DI and memoization decorators)
__decorate(
    [decorators.return.HPa(), decorators.return.filterRules],
    PlaygraphMetricsReporter.prototype,
    'Gu',
    null
);
__decorate(
    [decorators.return.HPa(), decorators.return.WE],
    PlaygraphMetricsReporter.prototype,
    'getPendingSeekTarget',
    null
);

/** @type {typeof PlaygraphMetricsReporter} */
const DecoratedPlaygraphMetricsReporter = __decorate(
    [injectable],
    PlaygraphMetricsReporter
);

export { DecoratedPlaygraphMetricsReporter as PlaygraphMetricsReporter };
export default PlaygraphMetricsReporter;
