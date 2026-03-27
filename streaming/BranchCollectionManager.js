/**
 * Netflix Cadmium Player - BranchCollectionManager
 *
 * Manages the collection of media pipeline branches (audio/video/text).
 * Coordinates MediaSource creation, source buffer allocation, and branch lifecycle.
 *
 * @module BranchCollectionManager
 * @original Module 74504 (export: F$a)
 */

import { __awaiter, __generator, __spreadArray, __read } from '../ads/AdBreakMismatchLogger.js'; // tslib helpers
import { ClockWatcher } from '../core/AsejsEngine.js'; // event subscription manager
import {
    TimeUtil,
    observableBool,
    gIa as ObservableAggregator,
    hLb as isDefined,
    findLast,
    np as arrayDifference,
    ePa as removeFromArray,
    gd as isNonNullish,
} from '../core/AsejsEngine.js'; // time utilities & array helpers
import { platform } from '../core/AsejsEngine.js'; // platform APIs
import { ed as SegmentType } from '../ads/AdPoliciesManager.js'; // segment type enum
import { p$a as MediaTypeBranch } from '../modules/Module_74418.js'; // per-media-type branch
import { getManifestDuration as getManifestDuration } from '../modules/Module_62614.js'; // manifest helpers
import { RJ as BranchQueue } from './MediaFragment.js'; // branch queue
import { MediaType } from '../core/AsejsEngine.js'; // media type constants
import { nab as SourceBufferManager } from '../buffer/SourceBufferManager.js'; // source buffer manager
import { TransitionEventEmitter as TransitionEventEmitter } from './AseTrack.js'; // transition event emitter
import { ie as SchedulerUtil, completionState } from '../buffer/BufferingStateTracker.js'; // scheduler utilities
import { assert } from '../ads/AdPoliciesManager.js'; // assertion helper
import { PlaygraphVisitor as PlaygraphVisitor } from '../modules/Module_67181.js'; // playgraph visitor
import { ase_Mka as LiveSegmentTracker } from './MediaPipeline.js'; // live segment tracker
import { lLa as LiveEdgeDetector } from '../modules/Module_16290.js'; // live edge detector
import { OW as CdnListObserver } from '../modules/Module_89527.js'; // CDN list observer

/**
 * Manages a collection of media pipeline branches, coordinating MediaSource creation,
 * source buffer allocation, branch enqueueing/pruning, and lifecycle transitions.
 */
export class BranchCollectionManager {
    /**
     * @param {object} playgraph - The playgraph instance for this session
     * @param {object} player - The player controller
     * @param {object} console - Logging console
     * @param {object} config - Pipeline configuration
     * @param {object} configurationSnapshot - Snapshot of current configuration
     * @param {object} events - Event emitter for pipeline-level events
     * @param {Array<string>} mediaTypesForBranching - Media types (audio/video/text) to create branches for
     * @param {object} branchScheduler - Scheduler for branch tasks
     * @param {object} manifestMetadata - Metadata about the current manifest
     * @param {object} isPlaybackStartedProperty - Observable boolean for playback started state
     * @param {object} estimatedTime - Observable for estimated playback time
     * @param {object} liveEdgeTime - Observable for live edge time
     * @param {object} [liveEdgeDetectorOverride] - Optional override for the live edge detector
     * @param {object} [externalConfigMap] - Optional external configuration map for branches
     */
    constructor(
        playgraph,
        player,
        console,
        config,
        configurationSnapshot,
        events,
        mediaTypesForBranching,
        branchScheduler,
        manifestMetadata,
        isPlaybackStartedProperty,
        estimatedTime,
        liveEdgeTime,
        liveEdgeDetectorOverride,
        externalConfigMap
    ) {
        this.playgraph = playgraph;
        this.player = player;
        this.console = console;
        this.config = config;
        this.configurationSnapshot = configurationSnapshot;
        this.events = events;
        this.mediaTypesForBranching = mediaTypesForBranching;
        this.branchScheduler = branchScheduler;
        this.manifestMetadata = manifestMetadata;
        this.isPlaybackStartedProperty = isPlaybackStartedProperty;
        this.estimatedTime = estimatedTime;
        this.liveEdgeTime = liveEdgeTime;
        this.externalConfigMap = externalConfigMap;

        /** @type {Array} Branches that have completed all media appending */
        this.completedBranches = [];

        /** @type {boolean} Whether a branch transition is currently in progress */
        this._isInTransition = false;

        /** @type {TransitionEventEmitter} Emitter for transition-related events between branches */
        this.transitionEventEmitter = new TransitionEventEmitter();

        // Bind event handlers
        this.branchEditedHandler = this._onBranchEdited.bind(this);
        this.requestCompleteHandler = this._onRequestComplete.bind(this);
        this.liveMissingSegmentHandler = this._onLiveMissingSegment.bind(this);
        this.seekToLiveEdgeHandler = this._onSeekToLiveEdge.bind(this);

        this.branchQueue = new BranchQueue(this.console);
        this.liveEdgeDetector = liveEdgeDetectorOverride || new LiveEdgeDetector(this.console, playgraph);

        this.inNonSeamlessTransition = mediaTypesForBranching.some((mediaType) => {
            return !(externalConfigMap === null || externalConfigMap === undefined || !externalConfigMap.key(mediaType));
        });

        this._initializeMediaSource();

        if (this.activeBranches) {
            this.primaryBranch = this._findBranchByMediaType(this._getPrimaryMediaType());
            this._attachBranchPropertyListeners();
        }

        this.branchPruner = branchScheduler.createScheduledTask(() => {
            return this._runBranchPrunerLoop();
        }, 'branchPruner');

        this.eventSubscriptions = new ClockWatcher();
        this.eventSubscriptions.on(this.events, 'segmentPresenting', () => {
            return __awaiter(this, void 0, void 0, function () {
                let gcConfig;
                return __generator(this, function (state) {
                    switch (state.label) {
                        case 0:
                            this._lastStreamState = this.player.getStreamState();
                            gcConfig = this.config.$rb;
                            return gcConfig !== null && gcConfig !== undefined && gcConfig.segmentPresenting
                                ? [4, Promise.resolve()]
                                : [3, 2];
                        case 1:
                            state.T();
                            this.events.emit('requestGarbageCollection', {
                                time: platform.platform.now(),
                                type: 'requestGarbageCollection',
                            });
                            state.label = 2;
                        // falls through
                        case 2:
                            return [2];
                    }
                });
            });
        });
    }

    // ──────────── Getters ────────────

    /** @returns {LiveEdgeDetector} The live edge detector instance */
    get liveEdgeDetectorRef() {
        return this.liveEdgeDetector;
    }

    /**
     * Returns a map of media type to pipeline controller (fF) for each active branch.
     * @returns {Map<string, object>}
     */
    get mediaTypeBuffers() {
        const map = new Map();
        this.activeBranches.forEach((branch) => {
            map.set(branch.mediaType, branch.fF);
        });
        return map;
    }

    /**
     * Returns the last captured stream state at segment presentation time.
     * @returns {object|undefined}
     */
    get lastStreamState() {
        return this._lastStreamState;
    }

    /**
     * Whether all active branches are ready for playback.
     * @returns {boolean}
     */
    get allBranchesReady() {
        return this.activeBranches.every((branch) => branch.allBranchesReady);
    }

    /**
     * Whether playback has started on the primary branch.
     * @returns {boolean}
     */
    get hasPlaybackStarted() {
        return !(this.primaryBranch === null || this.primaryBranch === undefined || !this.primaryBranch.isPlaybackStartedProperty.value);
    }

    /**
     * During a transition, returns the maximum transition timestamp across all active branches.
     * Returns undefined when not in transition.
     * @returns {object|undefined}
     */
    get transitionTimestamp() {
        if (!this._isInTransition) {
            return undefined;
        }
        return TimeUtil.max(
            ...this.activeBranches
                .map((branch) => {
                    return branch.ddc === null || branch.ddc === undefined ? undefined : branch.ddc.wHb;
                })
                .filter(isDefined)
        );
    }

    // ──────────── Branch Pruner Loop (Generator) ────────────

    /**
     * Generator function that continuously prunes completed branches from the collection.
     * Waits for an appropriate delay before pruning each branch.
     * @private
     * @returns {Generator}
     */
    *_runBranchPrunerLoop() {
        // This is a generator-based coroutine used by the scheduler
        // We need to preserve the __generator pattern for the scheduler to work
    }

    // ──────────── Event Handlers ────────────

    /**
     * Handles branch edited events - reschedules the pruner and restarts active pipelines.
     * @private
     */
    _onBranchEdited() {
        this.branchPruner.reuseOnErrorCacheSize();
        const activeMediaTypes = this.activeBranches
            .filter((branch) => branch.NFb)
            .map((branch) => branch.mediaType);
        this.pauseAllPipelines(activeMediaTypes);
        this.resume(activeMediaTypes);
    }

    /**
     * Handles request completion by updating live edge time.
     * @private
     * @param {object} event - The request complete event
     */
    _onRequestComplete(event) {
        this._updateLiveEdgeTime(event.isLive);
    }

    /**
     * Handles live missing segment events by updating live edge time.
     * @private
     * @param {object} event - The live missing segment event
     */
    _onLiveMissingSegment(event) {
        this._updateLiveEdgeTime(event.isLive);
    }

    /**
     * Handles seek-to-live-edge requests by delegating to the player.
     * @private
     */
    _onSeekToLiveEdge() {
        this.player.o4a();
    }

    /**
     * Updates the live edge time based on a branch's reported live edge,
     * considering whether prior branches have completed.
     * @private
     * @param {object} liveBranch - The branch reporting a live edge update
     */
    _updateLiveEdgeTime(liveBranch) {
        const branchList = this.getActiveBranchList();
        const branchIndex = branchList.indexOf(liveBranch);

        if (branchIndex === -1) return;
        if (branchList.slice(0, branchIndex).some((b) => !b.hasMoreSegments)) return;

        let edgeTime = liveBranch.liveEdgeTime;
        if (edgeTime && edgeTime.greaterThan(this.liveEdgeTime.value)) {
            if (liveBranch.hasMoreSegments && branchIndex < branchList.length - 1) {
                edgeTime = TimeUtil.max(edgeTime, branchList[branchIndex + 1].liveEdgeTime || TimeUtil.g0a);
            }
            this.liveEdgeTime.set(edgeTime);
        }
    }

    // ──────────── Public API ────────────

    /**
     * Enqueues a new branch into the collection for processing.
     * Attaches event listeners and updates live edge time if applicable.
     * @param {object} branch - The branch to enqueue
     */
    enqueueBranch(branch) {
        assert(
            this.getActiveBranchList().indexOf(branch) === -1,
            `Branch ${branch.currentSegment.id} is already in the collection, cannot re-queue`
        );

        branch.events.on('branchEdited', this.branchEditedHandler);
        branch.events.on('requestComplete', this.requestCompleteHandler);
        branch.events.on('liveMissingSegment', this.liveMissingSegmentHandler);
        branch.events.on('requestSeekToLiveEdge', this.seekToLiveEdgeHandler);

        if (branch.liveEdgeTime && this.getActiveBranchList().every((b) => b.hasMoreSegments)) {
            this.liveEdgeTime.set(branch.liveEdgeTime);
        }

        if (branch.allMediaAppended) {
            assert(this.branchQueue.A7a().length === 0, 'Cannot append a completed branch after initial branches, ');
            this.completedBranches.push(branch);
        } else {
            this.branchQueue.enqueue(branch);
            if (!branch.currentSegment.xO || (branch.viewableSession.isAdPlaygraph && !isFinite(branch.currentSegment.contentEndPts))) {
                // skip prioritization
            } else {
                this.branchQueue.prioritizeBranch();
            }
            if (!this._isInTransition) {
                this._subscribeBranchTransitionEvents(branch);
            }
        }

        if (this.branchPruner.state === completionState.complete) {
            this.branchPruner.reuseOnErrorCacheSize();
        }
    }

    /**
     * Adds a DRM viewable to all active branches.
     * @param {object} drmViewable - The DRM viewable to add
     */
    addDrmViewable(drmViewable) {
        this.activeBranches.forEach((branch) => {
            branch.addDrmViewable(drmViewable);
        });
    }

    /**
     * Sets the DRM viewable configuration, reconciling source buffers by removing
     * unnecessary media types and adding new ones as needed.
     * @param {Array<string>} requiredMediaTypes - Media types required by the DRM viewable
     */
    setDrmViewable(requiredMediaTypes) {
        let changed = false;
        let currentMediaTypes = this.activeBranches.map((branch) => branch.mediaType);

        // Filter out text type unless there's an ad playgraph
        const hasAdPlaygraph = this.playgraph.playlistArray().some((pg) => pg.isAdPlaygraph);
        if (!hasAdPlaygraph) {
            currentMediaTypes = currentMediaTypes.filter((type) => type !== MediaType.TEXT_MEDIA_TYPE);
        }

        // Remove source buffers for media types no longer needed
        const typesToRemove = arrayDifference(currentMediaTypes, requiredMediaTypes);
        typesToRemove.forEach((mediaType) => {
            let sourceBuffer = findLast(this.platformMediaSource.sourceBuffers, (sb) => sb.mediaType === mediaType);
            assert(sourceBuffer);
            this.platformMediaSource.removeSourceBuffer(sourceBuffer);

            const branch = this._findBranchByMediaType(mediaType);
            assert(branch);
            branch.create();
            branch.destroy();
            removeFromArray(this.activeBranches, branch);
            removeFromArray(typesToRemove, mediaType);
            changed = true;
        });

        // Add source buffers for newly required media types
        const typesToAdd = arrayDifference(requiredMediaTypes, currentMediaTypes);
        if (!this._ensureSourceBuffers(this.platformMediaSource, typesToAdd)) {
            this._reportError({
                ej: 'error creating source buffers',
                errorSubCode: 'NFErr_MC_StreamingInitFailure',
            });
            throw this.platformMediaSource.error;
        }

        typesToAdd.forEach((mediaType) => {
            const sourceBuffer = findLast(this.platformMediaSource.sourceBuffers, (sb) => sb.mediaType === mediaType);
            assert(sourceBuffer);
            const branch = this._createMediaTypeBranch(this.platformMediaSource, sourceBuffer);
            this.activeBranches.push(branch);
            changed = true;
        });

        if (changed) {
            this._attachBranchPropertyListeners();
        }
    }

    /**
     * Resets all active branches, clears transition state, and removes all queued branches.
     */
    create() {
        this.activeBranches.forEach((branch) => {
            branch.create();
        });
        this._isInTransition = false;
        this.inNonSeamlessTransition = false;
        this.transitionEventEmitter.removeAllListeners();
        this.clearAllBranches();
    }

    /**
     * Resets a single media type branch.
     * @param {string} mediaType - The media type to reset
     */
    resetMediaTypeBranch(mediaType) {
        this._resetMediaTypeBranches([mediaType]);
    }

    /**
     * Resets branches for the specified media types.
     * @private
     * @param {Array<string>} mediaTypes - Media types to reset
     */
    _resetMediaTypeBranches(mediaTypes) {
        mediaTypes.forEach((mediaType) => {
            const branch = this._findBranchByMediaType(mediaType);
            branch?.create(false, mediaTypes);
        });
    }

    /**
     * Removes all event listeners from queued branches and clears the queue.
     */
    clearAllBranches() {
        this.getActiveBranchList().forEach((branch) => {
            branch.events.validateManifest('branchEdited', this.branchEditedHandler);
            branch.events.validateManifest('requestComplete', this.requestCompleteHandler);
            branch.events.validateManifest('liveMissingSegment', this.liveMissingSegmentHandler);
            branch.events.validateManifest('requestSeekToLiveEdge', this.seekToLiveEdgeHandler);
        });
        this.completedBranches = [];
        this.branchQueue.clear();
        this.branchPruner.reuseOnErrorCacheSize();
    }

    /**
     * Resumes pipeline processing for specified media types (or all if none specified).
     * @param {Array<string>} [mediaTypes] - Optional filter of media types to resume
     */
    resume(mediaTypes) {
        this.activeBranches.forEach((branch) => {
            if (mediaTypes === undefined || mediaTypes.indexOf(branch.mediaType) !== -1) {
                branch.resume();
            }
        });
    }

    /**
     * Pauses active pipelines, executes a callback, then resumes them.
     * @param {Function} callback - Function to execute while pipelines are paused
     */
    queueFileAsync(callback) {
        const activePipelines = this.activeBranches.filter((branch) => branch.NFb);
        activePipelines.forEach((branch) => branch.aseTimer());
        callback();
        activePipelines.forEach((branch) => branch.resume());
    }

    /**
     * Pauses all (or specified) media pipelines.
     * @param {Array<string>} [mediaTypes] - Optional filter of media types to pause
     */
    pauseAllPipelines(mediaTypes) {
        this.activeBranches.forEach((branch) => {
            if (mediaTypes === undefined || mediaTypes.indexOf(branch.mediaType) !== -1) {
                branch.aseTimer();
            }
        });
    }

    /**
     * Triggers late-hit-analysis on all active branches.
     */
    lha() {
        this.activeBranches.forEach((branch) => branch.lha());
    }

    /**
     * Handles underflow events, checking for missing segments in live ad playback
     * and emitting a fragmentsMissing event if appropriate.
     * @param {object} underflowTime - The time at which the underflow occurred
     */
    setup(underflowTime) {
        this.console.pauseTrace('attached-player: onUnderflow');
        const streamState = this.lastStreamState;

        if (streamState.om && streamState.viewableSession.isAdPlaygraph) {
            const segments = streamState.$A();

            if (
                !this.config.enableMissingSegmentsReplacement &&
                segments &&
                segments.length > 0 &&
                segments.every((seg) => seg instanceof LiveSegmentTracker)
            ) {
                let latestSegments = segments.map((seg) => seg.getLatestLiveSegment()).filter(isNonNullish);

                if (latestSegments.length) {
                    let maxSegment = TimeUtil.max(...latestSegments);
                    const duration = getManifestDuration(streamState.viewableSession.manifestRef);
                    maxSegment = maxSegment.item(TimeUtil.fromMilliseconds(duration));

                    const resolvedTime = this.playgraph.resolveTime(underflowTime);
                    assert(resolvedTime.timeValue.playbackSegment <= maxSegment.playbackSegment);

                    const graphPosition = this.playgraph.dataBucketSymbol({
                        J: streamState.viewableSession.J,
                        timeValue: maxSegment,
                    });
                    assert(graphPosition);

                    const event = {
                        type: 'fragmentsMissing',
                        nextAvailableGraphPosition: graphPosition,
                        nextAvailableContentTimestamp: maxSegment,
                    };
                    this.events.emit(event.type, event);
                }
            }
        }
    }

    /**
     * Returns an iterator over queued branches.
     * @returns {Iterator}
     */
    getBranchQueueIterator() {
        return this.branchQueue.getIterator();
    }

    /**
     * Returns a combined list of all branches: completed + queued.
     * @returns {Array<object>}
     */
    getActiveBranchList() {
        return [...this.completedBranches, ...this.branchQueue.A7a()];
    }

    /**
     * Processes a frame update for all active branches.
     * @param {object} frame - The frame to process
     */
    onProcessFrame(frame) {
        this.activeBranches.forEach((branch) => {
            branch.onProcessFrame(frame);
        });
    }

    /**
     * Checks if all branches can parse the given data.
     * @param {object} data - The data to validate
     * @returns {boolean}
     */
    parseData(data) {
        return this.activeBranches.every((branch) => branch.parseData(data));
    }

    /**
     * Clears internal references on branches and resets the live edge detector.
     */
    clearReferences() {
        this.activeBranches.forEach((branch) => branch.internal_Svb());
        this.liveEdgeDetector = new LiveEdgeDetector(this.console, this.playgraph);
    }

    /**
     * Returns diagnostic information about the branch collection state.
     * @returns {{ nSc: Array, zPc: Array }}
     */
    getDiagnosticInfo() {
        return {
            nSc: this.getActiveBranchList(),
            zPc: this.activeBranches,
        };
    }

    /**
     * Destroys the branch collection, clearing all listeners and resources.
     */
    destroy() {
        this._playbackStartedSubscription.clear();
        this._estimatedTimeSubscription.clear();
        this.activeBranches.forEach((branch) => branch.destroy());
        if (!this.configurationSnapshot.VVa) {
            this.platformMediaSource.clearListeners();
        }
        this.clearAllBranches();
        this.branchPruner.destroy();
        this.eventSubscriptions.clear();
    }

    // ──────────── Private Methods ────────────

    /**
     * Creates the MediaSource, adds source buffers for each required media type,
     * and initializes the active branch array.
     * @private
     */
    _initializeMediaSource() {
        this._emitStartEvent('createMediaSourceStart');

        let mediaSource;
        if (this.configurationSnapshot.VVa) {
            mediaSource = this.configurationSnapshot.VVa();
        } else {
            mediaSource = new platform.MediaSource(this.player.player);
            if (!mediaSource.codecProfilesMap) {
                mediaSource.codecProfilesMap = platform.MediaSource.codecProfilesMap;
            }
        }

        if (mediaSource.readyState !== 1) {
            this._reportError({
                ej: 'exception in init',
                errorSubCode: 'NFErr_MC_StreamingInitFailure',
            });
            return;
        }

        this._emitStartEvent('createMediaSourceEnd');

        /** @type {object} The platform MediaSource instance */
        this.platformMediaSource = mediaSource;

        if (!this._ensureSourceBuffers(mediaSource, this.mediaTypesForBranching)) {
            this._reportError({
                ej: 'error creating source buffers',
                errorSubCode: 'NFErr_MC_StreamingInitFailure',
            });
            throw mediaSource.error;
        }

        this._branchInitData = {};
        this.playgraph.getRemaining(new PlaygraphVisitor(this.playgraph, this._branchInitData, this.config));

        this.activeBranches = mediaSource.sourceBuffers
            .filter((sb) => this.mediaTypesForBranching.indexOf(sb.mediaType) >= 0)
            .map((sb) => this._createMediaTypeBranch(mediaSource, sb));
    }

    /**
     * Ensures that source buffers exist for each requested media type,
     * creating new ones as needed.
     * @private
     * @param {object} mediaSource - The platform MediaSource
     * @param {Array<string>} mediaTypes - Media types that need source buffers
     * @returns {boolean} True if all source buffers were created successfully
     */
    _ensureSourceBuffers(mediaSource, mediaTypes) {
        let success = true;
        const existingBuffers = mediaSource.sourceBuffers;

        mediaTypes.forEach((mediaType) => {
            const exists = findLast(existingBuffers, (sb) => sb.mediaType === mediaType);
            if (!exists) {
                if (!mediaSource.addSourceBuffer(mediaType)) {
                    success = false;
                }
            }
        });

        if (!success) {
            this.console.RETRY('Error adding sourceBuffer:', mediaSource.error);
        }
        return success;
    }

    /**
     * Creates a media type branch, including source buffer manager and pipeline controller.
     * Attaches error/log/debug event forwarding and DRM listeners for video.
     * @private
     * @param {object} mediaSource - The platform MediaSource
     * @param {object} sourceBuffer - The source buffer for this media type
     * @returns {MediaTypeBranch} The created branch
     */
    _createMediaTypeBranch(mediaSource, sourceBuffer) {
        const bufferManager = new SourceBufferManager(
            sourceBuffer.mediaType,
            mediaSource,
            sourceBuffer,
            this.config,
            this.player,
            this.branchScheduler
        );

        bufferManager.addListener('error', (err) => {
            this._reportError({ ej: err.errorstr });
        });
        bufferManager.addListener('logdata', (data) => {
            this.events.emit('logdata', data);
        });
        bufferManager.addListener('managerdebugevent', (data) => {
            this.events.emit('managerdebugevent', data);
        });

        const externalConfig = this.externalConfigMap?.key(sourceBuffer.mediaType);

        const branch = new MediaTypeBranch(
            bufferManager,
            sourceBuffer.mediaType,
            this,
            this.config,
            this.console,
            this.player,
            this.configurationSnapshot,
            this.branchScheduler,
            this.liveEdgeDetector,
            this.manifestMetadata,
            externalConfig
        );

        if (sourceBuffer.mediaType === MediaType.U) {
            branch.on('drmNeeded', (event) => {
                this.events.emit('drmNeeded', event);
            });
        }

        if (!externalConfig) {
            branch.fF?.bbc(
                new CdnListObserver(
                    (this._branchInitData[sourceBuffer.mediaType] = {}),
                    this.console,
                    this.player,
                    bufferManager,
                    this.player.events,
                    this.configurationSnapshot,
                    this.branchScheduler
                )
            );
        }

        return branch;
    }

    /**
     * Prunes a completed branch from the collection, removing listeners and canceling streaming.
     * @private
     * @param {object} branch - The branch to prune
     */
    _pruneBranch(branch) {
        assert(branch.allMediaAppended, 'Attempted to prune branch that has not been fully appended');

        this.completedBranches = this.completedBranches.filter((b) => b !== branch);
        this.branchQueue.item(branch);

        branch.events.removeListener('branchEdited', this.branchEditedHandler);
        branch.events.removeListener('requestComplete', this.requestCompleteHandler);
        branch.events.removeListener('liveMissingSegment', this.liveMissingSegmentHandler);
        branch.events.removeListener('requestSeekToLiveEdge', this.seekToLiveEdgeHandler);

        branch.cancelStreaming('pruned');

        const gcConfig = this.config.$rb;
        if (gcConfig !== null && gcConfig !== undefined && gcConfig.branchPruned) {
            this.events.emit('requestGarbageCollection', {
                time: platform.platform.now(),
                type: 'requestGarbageCollection',
            });
        }
    }

    /**
     * Subscribes to transition events on a newly queued branch,
     * setting up listeners for each track's transition signal.
     * @private
     * @param {object} branch - The branch being transitioned to
     */
    _subscribeBranchTransitionEvents(branch) {
        this._isInTransition = true;

        branch.tracks.forEach((track) => {
            const existingBranch = this._findBranchByMediaType(track.mediaType);
            if (existingBranch !== undefined) {
                this.transitionEventEmitter.once(track.headerContainerRef, (event) => {
                    return existingBranch.internal_Ltc(event);
                });
            }
        });

        if (branch.presentationStartTime) {
            this._emitPtsChanged();
        } else {
            branch.events.once('branchNormalized', () => {
                this._emitPtsChanged();
            });
        }
    }

    /**
     * Emits a ptsChanged event with the initial timestamp of the first queued branch.
     * @private
     */
    _emitPtsChanged() {
        const firstBranch = this.branchQueue.A7a()[0];
        if (firstBranch) {
            assert(firstBranch.timestamp);
            this.events.emit('ptsChanged', {
                initialTimestamp: firstBranch.timestamp,
                inNonSeamlessTransition: this.inNonSeamlessTransition,
            });
            this.inNonSeamlessTransition = false;
        }
    }

    /**
     * Finds an active branch by its media type.
     * @private
     * @param {string} mediaType - The media type to search for
     * @returns {MediaTypeBranch|undefined}
     */
    _findBranchByMediaType(mediaType) {
        return findLast(this.activeBranches, (branch) => branch.mediaType === mediaType);
    }

    /**
     * Determines the primary media type: prefers video (U), falls back to audio (V).
     * @private
     * @returns {string}
     */
    _getPrimaryMediaType() {
        return this.mediaTypesForBranching.indexOf(MediaType.U) !== -1
            ? MediaType.U
            : MediaType.V;
    }

    /**
     * Emits a timing/start event with the current platform timestamp.
     * @private
     * @param {string} eventName - The name of the start event
     */
    _emitStartEvent(eventName) {
        const event = {
            type: 'startEvent',
            event: eventName,
            platform: platform.platform.now(),
        };
        this.events.emit(event.type, event);
    }

    /**
     * Reports an error to the playgraph.
     * @private
     * @param {object} errorInfo - Error information with ej and optional errorSubCode
     */
    _reportError(errorInfo) {
        this.playgraph.onNetworkFailure(errorInfo);
    }

    /**
     * Attaches property listeners that aggregate playback-started and estimated-time
     * across all active branches into the collection-level observables.
     * @private
     */
    _attachBranchPropertyListeners() {
        // Clear existing subscriptions if present
        if (this._playbackStartedSubscription) {
            this._playbackStartedSubscription.clear();
        }
        this._playbackStartedSubscription = observableBool.TXb(
            this.activeBranches.map((branch) => branch.isPlaybackStartedProperty),
            (values) => values.every((v) => v),
            (value) => this.isPlaybackStartedProperty.set(value)
        );

        if (this._estimatedTimeSubscription) {
            this._estimatedTimeSubscription.clear();
        }
        this._estimatedTimeSubscription = new ObservableAggregator(
            this.activeBranches.map((branch) => branch.estimatedTime),
            (values) => TimeUtil.min(...values),
            (value) => this.estimatedTime.set(value),
            TimeUtil.fromMilliseconds(-Infinity)
        );
    }
}

/**
 * Generator-based branch pruner loop. Extracted to preserve the original
 * __generator pattern required by the branch scheduler.
 *
 * This is attached to the prototype to match the original pattern where
 * the scheduler calls the generator function.
 */
BranchCollectionManager.prototype._runBranchPrunerLoop = function () {
    const self = this;
    return __generator(self, function (state) {
        switch (state.label) {
            case 0:
                if (!self.branchQueue.internal_Vub && !self.completedBranches.length) {
                    return [3, 2];
                }
                {
                    const [firstBranch] = __read(self.getActiveBranchList(), 1);
                    const gcConfig = self.configurationSnapshot.tC;
                    const playbackDelay =
                        firstBranch.currentSegment.type === SegmentType.content &&
                        (gcConfig !== null && gcConfig !== undefined ? gcConfig.playbackSegment : undefined) || 0;
                    const timeSource = firstBranch.ase_Nua || firstBranch.previousState;
                    const delayTime = timeSource.item(TimeUtil.fromMilliseconds(playbackDelay + 1000));
                    return [4, SchedulerUtil.millisecondsDelay(delayTime)];
                }
            case 1:
                state.T();
                self._pruneBranch(__read(self.getActiveBranchList(), 1)[0]);
                return [3, 0];
            case 2:
                return [2];
        }
    });
};
