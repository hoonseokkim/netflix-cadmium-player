/**
 * Netflix Cadmium Player - AsePlaygraph
 * Component: ASEJS_PLAYGRAPH
 *
 * The main playgraph manager — the central orchestrator of Netflix's streaming
 * engine. It manages the entire lifecycle of content playback:
 *
 * - Segment scheduling: Decides which segments to download next based on
 *   buffer levels, branch probabilities, and playback position.
 * - Buffer management: Coordinates audio/video/text buffer levels and
 *   triggers rebuffering/buffering-complete events.
 * - Branch management: For interactive content (choose-your-own-adventure),
 *   manages multiple concurrent branches with probabilistic pre-fetching.
 * - Player coordination: Bridges between the download engine and the
 *   media player (MSE SourceBuffer management).
 * - Live streaming: Handles live edge detection, segment availability
 *   windows, and manifest refreshes.
 * - Ad insertion: Coordinates ad pod playback within the segment timeline.
 *
 * The playgraph operates as a state machine:
 *   CLOSED -> OPEN -> STREAMING -> (back to OPEN on cancel, or CLOSED on destroy)
 *
 * Key terminology:
 * - Branch: A download pipeline for a sequence of segments from a single viewable.
 * - WorkingSegment: A segment with resolved timestamps and download state.
 * - Normalization: Resolving relative timestamps to absolute PTS values.
 * - Viewable: A piece of content (movie, episode, ad) with its own manifest.
 * - Stream selector: The ABR (adaptive bitrate) component that picks quality levels.
 */

// Dependencies (commented out — resolved by the module bundler)
// import { __importDefault, __values, __read, __assign, __generator, __decorate, __param, __extends, __spreadArray } from '../ads/AdBreakMismatchLogger.js';
// import { ClockWatcher, EventEmitter } from '../core/AsejsEngine.js';
// import { PlaygraphFactory as WorkingPlaygraphFactory, SegmentType } from '../ads/AdPoliciesManager.js';
// import { TimeUtil, assert as filterAssert, DeferredLease, isDefined } from '../core/AsejsEngine.js';
// import { platform } from '../core/AsejsEngine.js';
// import { DISABLED, fVb as formatContentType, eka as ZERO_DURATION } from './classes/DISABLED.js';
// import { CancelReason } from '../media/MediaExportsIndex.js';
// import { EngineState } from '../media/MediaExportsIndex.js';
// import { MediaType, PlaybackState, processPayload, qPb as getErrorScope } from '../core/AsejsEngine.js';
// import { ViewableFetcher } from './modules/Module_26286.js';
// import { createBranch as ase_Pic } from './PaddingBranch.js';
// import { SegmentValidator } from './modules/Module_31485.js';
// import { assert } from '../ads/AdPoliciesManager.js';
// import { NullPlayer } from './modules/Module_61651.js';
// import { Scheduler } from '../buffer/BufferingStateTracker.js';
// import { createStreamFilters, createStreamFilterConfig } from './modules/Module_63576.js';
// import { EventProcessingPipeline, LogEventType as getByteOffset } from './AseTrack.js';
// import { TrackChangeHandler } from './modules/Module_5653.js';
// import { WallClockSource } from '../core/AsejsEngine.js';
// import { DiagnosticEventHandler, PositionTrackerDiagnostics } from '../core/AsejsEngine.js';
// import { TimedTextSegmentHandler } from './modules/Module_63172.js';
// import { ViewableEventHandler } from './modules/Module_13580.js';
// import { SessionMetricsClass, consoleLogger } from './modules/SessionMetricsClass.js';
// import NetworkMonitor from './network/NetworkMonitor.js';
// import { FragmentHandler } from './modules/frag_Gjb.js';
// import { ManifestFetchScheduler } from './modules/Module_60028.js';
// import { BranchSchedulerHandler } from './modules/Module_73036.js';
// import { findBranchesAtTimestamp } from './AseTrack.js';
// import { dataBucketSymbol } from './modules/Module_6783.js';
// import { computeLiveStartTime, applyLiveNormalization as ase_Hga } from './modules/Module_99548.js';
// import { isLiveStream } from '../network/AseMediaRequest.js';
// import { ViewableEventAggregator } from './modules/Module_29739.js';
// import { mcc as freezeEventFields } from './modules/Module_66412.js';
// import { validateSegmentPosition, constrainSegmentPosition, positionsEqual, seekSegmentPosition } from './modules/Module_94328.js';
// import { DualStreamSelectorWithAudio } from './abr/DualStreamSelectorWithAudio.js';
// import { DualStreamSelector } from './abr/DualStreamSelector.js';
// import { evaluateBranches } from './modules/Module_25317.js';
// import { validatePlaygraphUpdate } from './modules/Module_86451.js';
// import { BranchCollection } from './modules/Module_88874.js';
// import { PositionTracker } from '../buffer/BufferingStateTracker.js';
// import { buildBranchTracks } from './modules/Module_78538.js';
// import { SegmentNormalizationInfo } from './modules/Module_36472.js';
// import { BufferLevelMonitor } from './modules/Module_54775.js';
// import { hasAllTerminalBranches } from './modules/Module_4489.js';
// import { getBufferDurationsByBranch } from './modules/Module_35879.js';
// import { scheduleBufferingTimeout } from './modules/Module_56879.js';
// import { ErrorHandler } from './modules/Module_86048.js';
// import { SegmentOverrideTracker } from './modules/ase_Ijb.js';
// import { EvaluationTimer, EvaluationState } from './modules/ase_Jjb.js';
// import { decorators } from './modules/Module_75393.js';
// import { StreamableRequest } from './modules/Module_46262.js';

/**
 * Parses media streams from branch tracks, returning a map of media type
 * to parsed stream data. Excludes text tracks.
 *
 * @param {Array} branchTracks - Array of track objects from a branch.
 * @returns {Object|undefined} Map of mediaType -> parsedStream, or undefined
 *   if fewer than 2 media types are present.
 */
function parseMediaStreams(branchTracks) {
  const streamMap = {};
  branchTracks.forEach((track) => {
    if (track.mediaType !== MediaType.TEXT_MEDIA_TYPE) {
      streamMap[track.mediaType] = track.parseStream();
    }
  });
  return Object.keys(streamMap).length >= 1 ? streamMap : undefined;
}

const paramDecorator = decorators.parameterDecorator;

/**
 * @class AsePlaygraph
 * @description The main playgraph engine class. Manages the full lifecycle of
 *   streaming playback, from seeking to a position, through downloading and
 *   buffering segments, to presenting them via the media player.
 */
class AsePlaygraph {
  /**
   * @param {Object} initialSegmentMap - Initial playgraph segment map from manifest.
   * @param {number} weight - Priority weight for this playgraph in multi-playgraph scenarios.
   * @param {Object} config - Player configuration object.
   * @param {string} id - Unique playgraph identifier.
   * @param {string} trackIdValue - Track ID manager for viewable/track resolution.
   * @param {Function} notifyCallback - Callback to notify the engine of state changes.
   * @param {Function} branchFilterFn - Function to filter/validate branches.
   * @param {Function} configOverrideFn - Function to get config overrides per viewable.
   * @param {*} errorHandlerContext - Context for error handling.
   * @param {Object} configWrapper - Configuration wrapper with per-viewable config access.
   */
  constructor(
    initialSegmentMap,
    weight,
    config,
    id,
    trackIdValue,
    notifyCallback,
    branchFilterFn,
    configOverrideFn,
    errorHandlerContext,
    configWrapper
  ) {
    this.weight = weight;
    this.config = config;
    this.id = id;
    this.trackIdValue = trackIdValue;
    this.notifyCallback = notifyCallback;
    this.branchFilterFn = branchFilterFn;
    this.configWrapper = configWrapper;

    /** @type {boolean} Whether media has ever started playing */
    this.hasEverPlayed = false;

    /** @type {Object|undefined} Ad container/manager reference */
    this.playbackContainer = undefined;

    /** @type {Array<Function>} Registered branch evaluation hooks */
    this.evaluationHooks = [];

    /** @type {Object|undefined} Parent playgraph node in hierarchy */
    this.parentNode = undefined;

    /** @type {boolean} Whether evaluation hooks have requested a hold */
    this.evaluationHoldRequested = false;

    /** @type {Object|undefined} Playgraph segment map reference */
    this.playgraphSegmentMap = undefined;

    /** @type {*} Previous evaluation result */
    this.previousValue = undefined;

    /** @type {string} ASE API version */
    this.aseApiVersion = '2.0';

    /** @type {*} Manifest fetch buffer timestamp */
    this.manifestFetchBuffer = undefined;

    /** @type {Function|undefined} End-of-seek notify action callback */
    this.endNotifyAction = undefined;

    /** @type {Object|undefined} Current seek/playback position state */
    this.playbackStateRef = undefined;

    /** @type {string} Current engine state */
    this.requestState = EngineState.CLOSED;

    /** @type {boolean} Whether first streaming drive hasn't been logged yet */
    this.isFirstDrive = true;

    /** @type {boolean} Whether live ad hydration re-evaluation is pending */
    this.liveAdReevalPending = false;

    /** @type {*} Track configuration selector (audio) */
    this.audioTrackSelector = undefined;

    /** @type {*} Track configuration selector (video) */
    this.videoTrackSelector = undefined;

    /** @type {*} Track configuration selector (text) */
    this.textTrackSelector = undefined;

    /** @type {ClockWatcher} Tracks event listener lifetimes */
    this.listenerCleanup = new ClockWatcher();

    /** @type {Object} Audio switchability map by viewable ID */
    this.audioSwitchabilityMap = {};

    /** @type {number} Remaining manifest distance for ad hydration */
    this.remainingManifestDistance = 0;

    /** @type {boolean} Whether all branches have completed streaming */
    this.allBranchesComplete = false;

    this.initializeEventHandlers();

    // ======== MODULE: ASEJS_PLAYGRAPH ========
    /** @type {Console} Scoped console logger */
    this.console = new platform.Console('ASEJS_PLAYGRAPH', 'asejs', `${this.id}`);

    /** @type {SessionMetricsClass} Diagnostics and metrics tracer */
    this.diagnosticsTracer = new SessionMetricsClass({
      maxEntries: 10,
      engineRef: this,
      source: 'AsePlaygraph',
      console: this.console,
    });

    /** @type {EventEmitter} Event bus for playgraph events */
    this.events = new EventEmitter();

    /** @type {WorkingPlaygraph} The active working playgraph */
    this.workingPlaygraph = WorkingPlaygraphFactory.create(initialSegmentMap);
    this.updateWorkingPlaygraphRef(this.workingPlaygraph);

    /** @type {BranchCollection} Collection of active branches */
    this.branches = new BranchCollection();

    /** @type {SegmentOverrideTracker} Tracks manual segment override decisions */
    this.segmentOverrideTracker = new SegmentOverrideTracker(this.console);

    /**
     * @type {DualStreamSelectorWithAudio}
     * ABR stream selector for joint audio+video selection.
     */
    this.jointStreamSelector = new DualStreamSelectorWithAudio(
      this.config,
      TimeUtil.fromMilliseconds(this.config.maxTrailingBufferLen),
      {
        parent: (handle) => handle.getParentHandle(),
        next: this.getNextTrackHandle.bind(this),
      },
      this.events,
      this.console
    );

    /**
     * @type {DualStreamSelector}
     * ABR stream selector for independent audio/video selection.
     */
    this.independentStreamSelector = new DualStreamSelector(
      this.config,
      TimeUtil.fromMilliseconds(this.config.maxTrailingBufferLen),
      {
        parent: (handle) => handle.getParentHandle(),
        next: this.getNextTrackHandle.bind(this),
      },
      this.events,
      this.console
    );

    /** @type {SegmentValidator} Validates segment state transitions */
    this.segmentValidator = new SegmentValidator(this.console, this.events);

    /** @type {Object} Buffer budget constraints */
    this.bufferBudget = {
      maxTotalBufferLevel: config.maxTotalBufferLevelPerSession || Infinity,
    };

    /** @type {NullPlayer} Player proxy (starts as null player, replaced on setPlayer) */
    this.player = new NullPlayer(this);

    /** @type {Scheduler} Scheduler for branch operations */
    this.branchScheduler = new Scheduler(this.player.playerCore, this.console, 'playgraph', 1);

    this.initializeWallClockScheduler();

    /** @type {PositionTracker} Tracks playback position and buffering state */
    this.positionTracker = new PositionTracker(
      this.console,
      config,
      trackIdValue,
      this.events,
      this.onBufferingTimeout.bind(this),
      this.id,
      this.engineScheduler
    );

    /** @type {BufferLevelMonitor} Monitors and reports buffer levels */
    this.bufferLevelMonitor = new BufferLevelMonitor(
      this.branchScheduler,
      this.engineScheduler,
      this.config,
      this.notifyEvent.bind(this),
      this.playgraphState,
      this.console,
      this
    );

    // Bind network error handlers from position tracker
    this.onCriticalNetworkError = this.positionTracker.onCriticalNetworkError.bind(this.positionTracker);
    this.onTemporaryNetworkError = this.positionTracker.onTemporaryNetworkError.bind(this.positionTracker);
    this.onUpdatingLastSuccessEvent = this.positionTracker.onUpdatingLastSuccessEvent.bind(this.positionTracker);

    // Bind event handlers
    this.onLogdata = this.onLogdata.bind(this);
    this.onAsereportconfigoverrides = this.onAsereportconfigoverrides.bind(this);
    this.onLiveEventTimesUpdated = this.onLiveEventTimesUpdated.bind(this);
    this.onLiveLoggingInfoUpdated = this.onLiveLoggingInfoUpdated.bind(this);
    this.onLivePostplayUpdated = this.onLivePostplayUpdated.bind(this);
    this.onChaptersUpdated = this.onChaptersUpdated.bind(this);
    this.selectTracksForViewable = this.selectTracksForViewable.bind(this);

    /** @type {EventProcessingPipeline} Pipeline for processing playback events */
    this.eventProcessingPipeline = new EventProcessingPipeline(config, this.console);

    this.initializeBufferingTimeout();

    // Register event processors in the pipeline
    this.eventProcessingPipeline.addHandler(new DiagnosticEventHandler(this.positionTracker.diagnosticsTracer));
    this.eventProcessingPipeline.addHandler(new TimedTextSegmentHandler(this.getCurrentPlayingBranch.bind(this)));
    this.eventProcessingPipeline.addHandler(new ViewableEventHandler(this.getCurrentPlayingBranch.bind(this)));
    this.eventProcessingPipeline.addHandler(new DiagnosticEventHandler(this.diagnosticsTracer));
    this.eventProcessingPipeline.addHandler(new FragmentHandler(this.branches, this));
    this.eventProcessingPipeline.addHandler(new BranchSchedulerHandler(this.branchScheduler));

    /** @type {ViewableEventAggregator} Aggregates viewable-level events */
    this.viewableEventAggregator = new ViewableEventAggregator('viewables');
    this.eventProcessingPipeline.addHandler(this.viewableEventAggregator);

    /** @type {ErrorHandler} Handles streaming errors and retry logic */
    this.errorHandler = new ErrorHandler(this, this.console, errorHandlerContext);

    /** @type {ManifestFetchScheduler} Schedules manifest refresh fetches */
    this.manifestFetchScheduler = new ManifestFetchScheduler(this.engineScheduler, this.console, this.events);

    /** @type {EvaluationTimer} Timer that drives periodic branch re-evaluation */
    this.evaluationTimer = new EvaluationTimer(this.evaluateBranches.bind(this));

    // Initialize stream filters
    this.setStreamFilters(createStreamFilters(), createStreamFilterConfig(this.console, this.config));
  }

  // ─────────── Properties ───────────

  /** @type {Object|undefined} Parent playgraph node */
  get parent() {
    return this.parentNode;
  }
  set parent(value) {
    this.parentNode = value;
  }

  /** @type {string} Current engine state */
  get state() {
    return this.requestState;
  }

  /** @type {boolean} Whether a real (non-null) player has been set */
  get hasStarted() {
    return !(this.player instanceof NullPlayer);
  }

  /** @type {Object|undefined} Ad container reference */
  get adContainer() {
    return this.playbackContainer;
  }

  /** @type {Object|undefined} Ad manager from the ad container */
  get adManager() {
    return this.playbackContainer?.adManager;
  }

  /** @type {WorkingPlaygraph} The current working playgraph */
  get currentPlaygraph() {
    return this.workingPlaygraph;
  }

  /** @type {AsePlaygraph} Self-reference (used by child components) */
  get playgraphEngine() {
    return this;
  }

  /** @type {Object} The raw segment map */
  get segmentMap() {
    return this.workingPlaygraph.segmentMap;
  }

  /**
   * Current seek position. Only valid after seekStreaming has been called.
   * @type {Object}
   * @throws {Error} If accessed before seekStreaming.
   */
  get playbackPosition() {
    assert(this.isPlayingContent, 'AsePlaygraph.seekPosition accessed before seekStreaming');
    return this.playbackStateRef.position;
  }

  /**
   * Current seek timestamp resolved to absolute time.
   * @type {*}
   * @throws {Error} If accessed before seekStreaming.
   */
  get seekTimestamp() {
    assert(this.isPlayingContent, 'AsePlaygraph.seekTimestamp accessed before seekStreaming');
    return this.resolveTime(this.playbackPosition).timeValue;
  }

  /** @type {Object} The playback state observable */
  get playgraphState() {
    return this.positionTracker.state;
  }

  /** @type {boolean} Whether the player is currently buffering */
  get isBuffering() {
    return this.positionTracker.isBuffering;
  }

  /** @type {boolean} Whether playback content is active (seekStreaming called) */
  get isPlayingContent() {
    return this.playbackStateRef !== undefined;
  }

  /**
   * Current playback position — uses the player's position if started,
   * otherwise the seek position.
   * @type {Object}
   */
  get position() {
    return this.player.isPlaybackStarted ? this.player.position : this.playbackPosition;
  }

  /**
   * Current playback timestamp — uses the player's timestamp if started,
   * otherwise the seek timestamp.
   * @type {*}
   */
  get setPosition() {
    return this.player.isPlaybackStarted ? this.player.setPosition : this.seekTimestamp;
  }

  /** @type {*} Current stream filters */
  get streamFilters() {
    return this.streamFilterConfig;
  }

  /** @type {*} Current stream filter parameters */
  get streamFilterParams() {
    return this.streamFilterParamsValue;
  }

  /** @type {*} Track ID value manager */
  get trackIdManager() {
    return this.trackIdValue;
  }

  /**
   * Returns the appropriate stream selector based on whether joint
   * audio+video selection is enabled.
   * @type {DualStreamSelector|DualStreamSelectorWithAudio}
   */
  get activeStreamSelector() {
    return this.isJointStreamSelectorEnabled() ? this.independentStreamSelector : this.jointStreamSelector;
  }

  // ─────────── Initialization ───────────

  /**
   * Initializes the wall-clock scheduler used for time-based operations
   * like manifest refresh scheduling.
   * @private
   */
  initializeWallClockScheduler() {
    this.engineScheduler = new Scheduler(
      new WallClockSource({
        isPlaying: true,
        currentTime: () => TimeUtil.fromMilliseconds(platform.platform.now()),
        speed: 1,
      }),
      this.console,
      'wallclock'
    );
  }

  /**
   * Sets up a periodic buffering timeout check.
   * @private
   */
  initializeBufferingTimeout() {
    scheduleBufferingTimeout(
      {
        positionTracker: this.positionTracker,
        engineScheduler: this.engineScheduler,
      },
      Scheduler.manifestUrlFetch(TimeUtil.fromMilliseconds(this.config.prebufferTimeLimit)),
      () => {
        if (
          this.player.isPlaybackStarted &&
          this.player.currentPlayingBranch &&
          (this.positionTracker.state.value === PlaybackState.REBUFFERING ||
            this.positionTracker.state.value === PlaybackState.BUFFERING)
        ) {
          this.checkBufferingProgress(this.player.currentPlayingBranch);
        }
      },
      'buffering'
    );
  }

  /**
   * Initializes bound event handler functions used throughout the playgraph.
   * @private
   */
  initializeEventHandlers() {
    /**
     * Called when a segment begins presenting to the user.
     * Updates live edge detection and emits diagnostic events.
     */
    this.onSegmentPresenting = (event) => {
      const workingSegment = this.workingPlaygraph.getSegment(event.position.segmentId);
      assert(workingSegment, 'segment must exist in workingPlaygraph');

      const nextSegmentId = this.findNextSegmentFromPlayer(workingSegment);

      if (nextSegmentId && this.player.isPlaybackStarted) {
        const matchingBranch = findBranchesAtTimestamp(
          this.player.branches.filter((branch) => branch.currentSegment.id === event.position.segmentId),
          event.playerTimestamp,
          { allowSubSegments: true }
        );

        if (matchingBranch) {
          this.player.liveEdgeDetector?.updateLiveEdge(
            {
              segment: workingSegment,
              get bufferEnd() {
                return matchingBranch.segmentEndTime.subtract(workingSegment.startTime);
              },
            },
            nextSegmentId,
            this.position.offset,
            true,
            false,
            undefined
          );
        }
      }

      const [viewableSession] = this.getActiveViewableSessions().filter(
        (session) => workingSegment.viewableId === session.viewableId
      );

      DISABLED.laser.isEnabled &&
        DISABLED.laser.log({
          playgraphId: this.id,
          type: 'PRESENTING_PLAYGRAPH_SEGMENT_CHANGE',
          contentType: formatContentType(workingSegment.type),
          isMainContent: workingSegment.isMainContent,
          isTerminal: workingSegment.isTerminalSegment,
          segmentId: workingSegment.id,
          viewableId: workingSegment.viewableId.toString(),
          viewableType: viewableSession.isAdPlaygraph ? 'LIVE' : 'SVOD',
        });

      this.evaluationTimer.start();
    };

    /** Called when DRM keys become ready for a viewable */
    this.onDrmReady = () => {
      this.notifyCallback('onDrmReady');
    };

    /** Tracks whether media has ever started playing */
    this.onPlaybackStartedChanged = (event) => {
      if (!this.hasEverPlayed) {
        this.hasEverPlayed = event.newValue;
      }
    };

    /** Called when media events progress (ad tracking, etc.) */
    this.onMediaEventsProgress = () => {
      this.notifyCallback('mediaEventsProgress');
    };
  }

  // ─────────── Lifecycle ───────────

  /**
   * Opens the playgraph engine, transitioning from CLOSED to OPEN state.
   *
   * @returns {boolean} True if the transition was successful, false if
   *   the engine was already open.
   */
  open() {
    this.isFirstDrive = true;
    this.events.emit('opening', { type: 'opening' });
    this.events.emit('openComplete', { type: 'openComplete' });

    if (this.requestState !== EngineState.CLOSED) {
      return false;
    }

    this.requestState = EngineState.OPEN;
    return true;
  }

  /**
   * Destroys the playgraph engine and all associated resources.
   * Cancels any active streaming, destroys schedulers, and cleans up.
   */
  destroy() {
    this.engineScheduler.destroy();
    this.branchScheduler.destroy();

    if (this.requestState !== EngineState.CLOSED) {
      this.cancelStreaming(CancelReason.destruction);
      this.evaluationTimer.destroy();
      this.requestState = EngineState.CLOSED;

      if (!this.hasStarted) {
        this.player.destroy();
      }

      this.manifestFetchScheduler.destroy();
      this.playbackContainer?.destroy();
    }
  }

  /**
   * Checks whether new tracks can be set without disrupting playback.
   *
   * @param {*} audioSelector - Audio track selector.
   * @param {*} videoSelector - Video track selector.
   * @param {*} textSelector - Text track selector.
   * @returns {boolean} True if tracks can be safely changed.
   */
  checkCanSetTracks(audioSelector, videoSelector, textSelector) {
    const segmentTracks = buildBranchTracks(
      this.branches,
      this.selectTracksForViewable.bind(this),
      audioSelector,
      videoSelector,
      textSelector
    ).segmentTracks;
    return this.canAcceptNewTracks(segmentTracks);
  }

  /**
   * Sets new audio/video/text track selectors and reconfigures all branches.
   *
   * @param {*} audioSelector - Audio track selector.
   * @param {*} videoSelector - Video track selector.
   * @param {*} textSelector - Text track selector.
   * @returns {boolean} True if tracks were successfully set.
   */
  setTracks(audioSelector, videoSelector, textSelector) {
    const previousAudio = this.audioTrackSelector;
    const previousVideo = this.videoTrackSelector;
    const previousText = this.textTrackSelector;

    this.audioTrackSelector = audioSelector;
    this.videoTrackSelector = videoSelector;
    this.textTrackSelector = textSelector;

    const result = buildBranchTracks(this.branches, this.selectTracksForViewable.bind(this));
    const { segmentTracks, mediaEventTracks, titleTracks } = result;

    if (segmentTracks.length === 0) return true;

    if (!this.canAcceptNewTracks(segmentTracks)) {
      this.audioTrackSelector = previousAudio;
      this.videoTrackSelector = previousVideo;
      this.textTrackSelector = previousText;
      return false;
    }

    const currentPosition = this.position;
    this.player.updateSegmentTracks(segmentTracks);
    this.player.setDrmViewable(titleTracks);

    const currentTimestamp = this.resolveTime(currentPosition).timeValue;

    mediaEventTracks.forEach((trackInfo) => {
      const branch = trackInfo.branch;
      const tracks = trackInfo.tracks;
      const timestamp = currentPosition.segmentId === branch.currentSegment.id ? currentTimestamp : undefined;
      const parentBranch = this.branches.getParentBranch(branch);
      branch.setTracks(tracks, timestamp, parentBranch !== undefined, segmentTracks);

      if (branch.isActive) {
        const viewableSession = branch.viewableSession;
        if (branch.currentSegment.type === SegmentType.padding) {
          // Padding segments use zero-range bitrates
          const paddingSession = { maxBitrates: [0, 0] };
          if (this.evaluationTimer.state === EvaluationState.REQUEST_ISSUED) {
            this.emitSegmentStarting(branch, paddingSession, !parentBranch, branch.viewableSession.manifestRef);
          }
        } else if (this.evaluationTimer.state === EvaluationState.REQUEST_ISSUED) {
          this.emitSegmentStarting(branch, viewableSession, !parentBranch, branch.viewableSession.manifestRef);
        }
      }
    });

    this.positionTracker.updateTracksForPosition(currentPosition, mediaEventTracks[0].tracks);
    return true;
  }

  // ─────────── Stream Filters ───────────

  /**
   * Creates stream filters from the current config.
   * @param {*} [overrideConfig] - Optional config override.
   * @returns {*} Stream filter configuration.
   */
  createStreamFilters(overrideConfig) {
    return createStreamFilters(this.config, overrideConfig);
  }

  /**
   * Creates stream filter parameters.
   * @param {*} [overrideConfig] - Optional config override.
   * @returns {*} Stream filter parameters.
   */
  createStreamFilterConfig(overrideConfig) {
    return createStreamFilterConfig(this.console, this.config, overrideConfig);
  }

  // ─────────── Segment Data ───────────

  /**
   * Gets data about a segment relative to the current playback position.
   *
   * @param {string} currentSegmentId - The segment currently being played.
   * @param {string} targetSegmentId - The segment to get data about.
   * @returns {Object} Segment data including adjacency and timing info.
   */
  getSegmentData(currentSegmentId, targetSegmentId) {
    const currentSegment = this.workingPlaygraph.getSegment(currentSegmentId);
    const targetSegment = this.workingPlaygraph.getSegment(targetSegmentId);
    assert(currentSegment, 'currentSegment must exist in workingPlaygraph');
    assert(targetSegment, 'targetSegment must exist in workingPlaygraph');

    const nextSegmentId = this.findNextSegmentFromPlayer(currentSegment);

    return {
      isAdjacentSegment: currentSegment.isAdjacentTo(targetSegmentId),
      isBranchActive:
        targetSegmentId !== currentSegmentId &&
        this.branches.has(targetSegmentId) &&
        this.branches.getActiveBranchList(targetSegmentId)[0].isPlaybackActive,
      targetStartTime: targetSegment.startTime.playbackSegment,
      nextSegmentId: nextSegmentId,
    };
  }

  // ─────────── Segment Navigation ───────────

  /**
   * Handles setting the next segment to play after the current one.
   * This is the core of interactive content branching — when a user
   * makes a choice, this method records the decision.
   *
   * @param {string} currentSegmentId - The current segment.
   * @param {string} nextSegmentId - The chosen next segment.
   * @param {boolean} [isImplicit=false] - Whether this is an implicit (auto) transition.
   * @param {boolean} [isSeek=true] - Whether this comes from a seek operation.
   */
  notifyEvent(currentSegmentId, nextSegmentId, isImplicit, isSeek = true) {
    if (!nextSegmentId) {
      throw new Error('AsePlaygraph.setNextSegment - nextSegmentId undefined - not implemented');
    }

    // If seeking and there's already a pending override, just update it
    if (isSeek && this.segmentOverrideTracker.getSegment(currentSegmentId)) {
      if (!isImplicit) {
        this.segmentOverrideTracker.set(currentSegmentId, nextSegmentId);
      }
      return;
    }

    const [activeBranch] = this.getBranchesForSegment(currentSegmentId);
    const currentWorkingSegment = this.workingPlaygraph.getSegment(currentSegmentId);
    assert(currentWorkingSegment, 'currentSegment must exist in workingPlaygraph');

    // Check if this is an auto-advance with a single next option and no overrides
    const nextCount = currentWorkingSegment.forwardBranchCount;
    const overrideCount = currentWorkingSegment.branchOverrides?.length ?? 0;
    const isAutoAdvance = nextCount === 1 && overrideCount === 0 && currentWorkingSegment.nextSegmentIds[0] === nextSegmentId;

    // Update live edge detection
    if (this.position.segmentId === currentSegmentId && activeBranch && !(isAutoAdvance && isImplicit)) {
      this.player.liveEdgeDetector?.updateLiveEdge(
        {
          segment: activeBranch.currentSegment,
          get bufferEnd() {
            return activeBranch.segmentEndTime.subtract(activeBranch.currentSegment.startTime);
          },
        },
        nextSegmentId,
        this.position.offset,
        isSeek,
        isImplicit,
        undefined
      );
    }

    // For non-seek operations, update position directly
    if (!isSeek) {
      const newPosition = {
        offset: TimeUtil.seekToSample,
        segmentId: nextSegmentId,
      };
      this.playbackStateRef = {
        position: newPosition,
        isPlaybackActive: true,
        originalSeekPosition: newPosition,
      };
    }

    // Record the override
    if (isImplicit) {
      this.segmentOverrideTracker.setImplicit(currentWorkingSegment.id, nextSegmentId);
    } else {
      this.segmentOverrideTracker.set(currentWorkingSegment.id, nextSegmentId);
    }

    this.evaluationTimer.start();

    // Propagate buffer state to child branches
    if (isSeek && currentWorkingSegment.terminalOverrides?.length > 0) {
      assert(activeBranch);
      if (activeBranch.isLastSegment(currentWorkingSegment.terminalOverrides)) {
        this.getBranchesForSegment(nextSegmentId).forEach((childBranch) =>
          this.propagateBufferState(activeBranch, childBranch)
        );
      }
    }

    if (!isSeek) {
      this.positionTracker.updatePosition(this.playbackPosition);
    }
  }

  /**
   * Checks whether new segment tracks can be accepted without causing
   * playback disruption (e.g., too little buffer remaining).
   *
   * @private
   * @param {Array} segmentTracks - The new tracks to evaluate.
   * @returns {boolean} True if safe to accept.
   */
  canAcceptNewTracks(segmentTracks) {
    if (segmentTracks.length === 0) return true;

    // Don't accept if all branches are ready but buffer is critically low
    if (
      this.player.allBranchesReady &&
      this.player.estimatedTime.value.subtract(this.player.setPosition).lessThan(TimeUtil.fromMilliseconds(5000))
    ) {
      return false;
    }

    const branches = this.player.branches;
    if (!branches.length) return true;

    // Ensure all branches belong to the same viewable
    const firstViewableId = branches[0]?.viewableSession.viewableId;
    return !branches.some((branch) => branch.viewableSession.viewableId !== firstViewableId);
  }

  /**
   * Propagates buffer state from a completed parent branch to a child branch.
   * @private
   */
  propagateBufferState(parentBranch, childBranch) {
    const bufferEnd = parentBranch.previousState.subtract(childBranch.currentSegment.startTime);
    childBranch.propagateBufferState(bufferEnd, 'from playgraph');
    this.propagateToDescendants(childBranch);
  }

  /**
   * Recursively propagates buffer state to all descendant branches.
   * @private
   */
  propagateToDescendants(branch) {
    this.branches.getChildBranches(branch).forEach((child) => {
      this.propagateBufferState(branch, child);
    });
  }

  // ─────────── Configuration ───────────

  /**
   * Applies branch weight configuration updates (e.g., when probabilities
   * change for interactive content choices).
   *
   * @param {Object} weightConfig - Map of segmentId -> { branchId: weight }.
   */
  applyConfig(weightConfig) {
    Object.keys(weightConfig).forEach((segmentId) => {
      this.workingPlaygraph.applyConfig(segmentId, weightConfig[segmentId]);
    });
    this.evaluationTimer.start();
  }

  /**
   * Sets stream filter configuration.
   * @private
   */
  setStreamFilters(filters, filterConfig) {
    this.streamFilterConfig = filters;
    this.streamFilterParamsValue = filterConfig;
    if (this.state === EngineState.STREAMING) {
      this.notifyCallback('setStreamFilters');
    }
  }

  /**
   * Registers a branch evaluation hook.
   * @param {Function} hook - Evaluation hook function.
   */
  addEvaluationHook(hook) {
    assert(this.evaluationHooks.indexOf(hook) === -1, 'Attempted to add the same evaluation hook twice');
    this.evaluationHooks.push(hook);
  }

  /**
   * Validates a track ID against the track ID manager.
   * @param {*} trackId - The track ID to validate.
   * @returns {boolean}
   */
  validateTrackId(trackId) {
    return this.trackIdValue.validateTrackId(trackId);
  }

  // ─────────── Seeking ───────────

  /**
   * Seeks to a position in the playgraph and begins streaming.
   * This is the primary entry point for starting or resuming playback.
   *
   * @param {Object} seekPosition - Target position { segmentId, offset }.
   */
  seekStreaming(seekPosition) {
    this.seekStreamingInternal(seekPosition);
  }

  /**
   * Internal seek implementation with optional entry point callback.
   *
   * @private
   * @param {Object} seekPosition - Target position.
   * @param {Function} [entryPointCallback] - Optional callback for entry points.
   */
  seekStreamingInternal(seekPosition, entryPointCallback) {
    const segMap = this.segmentMap;
    const validation = validateSegmentPosition(segMap, seekPosition);

    if (validation.isInvalid) {
      const sanitized = constrainSegmentPosition(segMap, seekPosition);

      if (sanitized === undefined) {
        const errorMsg =
          `Invalid seekPosition after sanitization to ${seekPosition.segmentId}` +
          `(${seekPosition.offset.playbackSegment}ms)` +
          `, reason: ${validation.reason}`;
        this.reportStreamingFailure({
          message: errorMsg,
          viewableId: segMap.segments[seekPosition.segmentId]?.viewableId,
        });
        return;
      }

      if (this.audioTrackSelector === undefined || this.videoTrackSelector === undefined) {
        this.reportStreamingFailure({ message: 'No track selectors available' });
        return;
      }

      // Check for duplicate seek to same position
      const isDuplicate =
        !(this.hasStarted && this.player.hasPlayingContent) &&
        positionsEqual(this.playbackStateRef?.originalSeekPosition, sanitized);

      this.events.emit('seeking', {
        type: 'seeking',
        position: seekPosition,
        duplicate: isDuplicate,
      });

      if (!isDuplicate) {
        this.endNotifyAction = entryPointCallback;

        if (this.isPlayingContent) {
          this.updateLiveEdgeOnSeek(sanitized);
          this.clearOverridesForSeek(seekPosition);
        } else if (this.branches.empty && entryPointCallback) {
          const currentBranch = this.player.getActiveBranch();
          if (currentBranch) {
            this.updateLiveEdgeOnSeek(sanitized, {
              segmentId: currentBranch.currentSegment.id,
              offset: currentBranch.qualityDescriptor,
            });
            this.clearOverridesForSeek(seekPosition);
          }
        }

        const leaseGuard = this.acquireViewableLeases();

        try {
          const viewableId = segMap.segments[sanitized.segmentId].viewableId;
          const viewableSession = this.getActiveViewableSessions().filter(
            (session) => session.viewableId === viewableId
          )[0];

          this.cancelStreaming(CancelReason.jitPlaygraphUpdate);
          this.clearPlayerState();

          this.playbackStateRef = {
            position: sanitized,
            originalSeekPosition: sanitized,
            isPlaybackActive: false,
          };
          this.manifestFetchBuffer = TimeUtil.seekToSample;
          this.positionTracker.updatePosition();
          this.playbackContainer?.adManager.updatePosition(viewableSession, sanitized);

          this.requestState = EngineState.STREAMING;
          this.evaluationTimer.start();
        } finally {
          this.events.emit('seeked', {
            type: 'seeked',
            position: seekPosition,
          });
          leaseGuard.release();
        }
      }
    } else {
      const errorMsg =
        `Invalid seekPosition to ${seekPosition?.segmentId}` +
        `(${seekPosition.offset.playbackSegment}ms)` +
        `, reason: ${validation.reason}`;
      this.reportStreamingFailure({
        message: errorMsg,
        viewableId: segMap.segments[seekPosition.segmentId]?.viewableId,
      });
    }
  }

  /**
   * Updates live edge detection state when seeking.
   * @private
   */
  updateLiveEdgeOnSeek(seekPosition, fromPosition, isImplicit = false, ptsOffset, forceUpdate = false) {
    const currentSegment = this.workingPlaygraph.getSegment(
      fromPosition?.segmentId || this.position.segmentId
    );
    assert(currentSegment, 'currentSegment must exist in workingPlaygraph');
    this.player.liveEdgeDetector?.updateLiveEdge(
      {
        segment: currentSegment,
        bufferEnd: currentSegment.offset,
      },
      seekPosition.segmentId,
      fromPosition ? fromPosition.offset : this.position.offset,
      false,
      isImplicit,
      ptsOffset,
      forceUpdate
    );
  }

  /**
   * Clears segment overrides that are no longer relevant after a seek.
   * @private
   */
  clearOverridesForSeek(seekPosition) {
    const activeBranch = this.player.getActiveBranch();
    if (activeBranch?.currentSegment.id === seekPosition.segmentId) {
      this.segmentOverrideTracker.clearFromSegment(seekPosition.segmentId);

      if (!this.segmentOverrideTracker.getSegment(seekPosition.segmentId) && this.player.hasPlayingContent) {
        const branches = this.player.branches;
        const lastBranch = this.player.getActiveBranch();
        if (lastBranch) {
          const childBranch = findLast(branches, (b) => b.parent === lastBranch);
          if (childBranch) {
            this.segmentOverrideTracker.set(lastBranch.currentSegment.id, childBranch?.currentSegment.id);
          }
        }
      }
    } else {
      this.segmentOverrideTracker.clearAll();
    }
  }

  /**
   * Acquires viewable leases to prevent premature disposal during seek.
   * @private
   */
  acquireViewableLeases() {
    const leases = this.branches
      .filter((branch) => branch.currentSegment.viewableId !== SegmentType.viewableId && !branch.isDisposed)
      .map((branch) => {
        if (this.trackIdValue.hasViewable(branch.currentSegment.viewableId)) {
          const parentInfo = this.getParentViewableInfo(branch.currentSegment.id, branch.currentSegment.viewableId);
          return this.trackIdValue.createViewable(branch.currentSegment.viewableId, parentInfo).decompressor;
        }
      })
      .filter(isDefined);

    return new DeferredLease({
      name: 'playgraphLeases',
      onRelease: () => leases.forEach((lease) => lease.release()),
      console: this.console,
    }).acquire();
  }

  // ─────────── Streaming Control ───────────

  /**
   * Cancels all active streaming. Destroys branches, clears buffers,
   * and resets player state.
   *
   * @param {string} [reason=CancelReason.destruction] - Reason for cancellation.
   */
  cancelStreaming(reason = CancelReason.destruction) {
    this.events.emit('cancelingStreaming', {
      type: 'cancelingStreaming',
      reason,
    });

    this.positionTracker.cancelTimer();
    const viewableSessions = this.getActiveViewableSessions();
    this.branches.destroyAll();

    DISABLED.laser.isEnabled &&
      DISABLED.laser.log({
        type: 'BUFFER_DURATION_CHANGE',
        playgraphId: this.id,
        durations: {
          AUDIO: ZERO_DURATION,
          MEDIA_EVENTS: ZERO_DURATION,
          VIDEO: ZERO_DURATION,
          TEXT: ZERO_DURATION,
        },
      });

    if (reason === CancelReason.destruction) {
      this.segmentOverrideTracker.clearAll();
      if (viewableSessions.length) {
        for (const session of viewableSessions) {
          session.clearPendingRequests();
        }
      }
    }

    this.branchScheduler.clearErrorCache();
    this.player.resetState();
    this.playbackStateRef = undefined;
    this.bufferLevelMonitor.reset();
    this.listenerCleanup?.clear();

    if (this.requestState === EngineState.STREAMING) {
      this.requestState = EngineState.OPEN;
    }

    this.events.emit('cancelStreaming', {
      type: 'cancelStreaming',
      reason,
    });
  }

  // ─────────── Branch Management ───────────

  /**
   * Gets all active branches for a given segment.
   * @param {string} segmentId - The segment ID.
   * @returns {Array} Active branches.
   */
  getBranchesForSegment(segmentId) {
    return this.branches.getActiveBranchList(segmentId);
  }

  /**
   * Handles an underflow event (player ran out of buffered data).
   * @param {*} underflowInfo - Information about the underflow.
   */
  handleUnderflow(underflowInfo) {
    this.positionTracker.handleUnderflow(underflowInfo);
    assert(this.player.currentTrackInfo, 'Must have an appended branch on underflow');

    if (this.player.isEndOfStream && this.positionTracker.isBuffering) {
      this.console.trace('End of stream flagged implying branch completion, declaring buffering complete');
      const bufferInfo = this.getBufferedDuration(this.setPosition);
      this.positionTracker.bufferingCompleteHandler('complete', bufferInfo.prefetchedAudioMs, bufferInfo.prefetchedVideoMs);
    }

    this.bufferLevelMonitor.update(this.player.currentTrackInfo, this.setPosition, true);
    this.notifyCallback('onUnderflow');
    this.events.emit('underflow');
  }

  /**
   * Adds an event handler to the event processing pipeline.
   * @param {*} handler - The event handler to add.
   */
  addEventHandler(handler) {
    this.eventProcessingPipeline.addHandler(handler);
  }

  /**
   * Sets the ad container/manager.
   * @param {Object} adContainer - The ad management container.
   */
  setAdContainer(adContainer) {
    assert(!this.playbackContainer, 'AdManager already set');
    this.playbackContainer = adContainer;
    this.playbackContainer.adManager.events.addListener('mediaEventsProgress', this.onMediaEventsProgress);
  }

  // ─────────── Player Management ───────────

  /**
   * Updates the media player instance.
   * @param {Object} newPlayer - The new player implementation.
   * @returns {boolean} True if the player was successfully updated.
   */
  updatePlayer(newPlayer) {
    this.addEventHandler(new TrackChangeHandler(newPlayer));
    this.positionTracker.onPlayerUpdated();
    return this.setPlayerInternal(newPlayer);
  }

  /**
   * Internal player swap logic.
   * @private
   */
  setPlayerInternal(newPlayer) {
    const oldPlayer = this.player;

    if (!this.player.canTransitionTo(newPlayer)) {
      this.reportStreamingFailure({ message: 'player in use' });
      return false;
    }

    this.player = newPlayer;
    this.branchScheduler.updateTimeSource(this.player.playerCore);

    this.player.events.on('segmentPresenting', this.onSegmentPresenting);
    this.player.events.on('drmReady', this.onDrmReady);
    this.player.isPlaybackStartedProperty.addListener(this.onPlaybackStartedChanged);

    const drmMediaTypes = this.getActiveDrmMediaTypes();
    if (drmMediaTypes.length > 0) {
      this.player.setDrmViewable(drmMediaTypes);
    }

    this.events.emit('playerChanged', {
      type: 'playerChanged',
      old: oldPlayer,
      new: this.player,
    });

    return true;
  }

  /**
   * Detaches the current player, reverting to a null player.
   */
  detachPlayer() {
    if (this.hasStarted) {
      this.player.events.removeListener('segmentPresenting', this.onSegmentPresenting);
      this.player.events.removeListener('drmReady', this.onDrmReady);
      this.player.isPlaybackStartedProperty.removeListener(this.onPlaybackStartedChanged);
      this.setPlayerInternal(new NullPlayer(undefined));
    }
  }

  // ─────────── Time Resolution ───────────

  /**
   * Resolves a playgraph position to an absolute timestamp and viewable ID.
   *
   * @param {Object} position - { segmentId, offset }
   * @returns {{ viewableId: number, timeValue: * }}
   */
  resolveTime(position) {
    const offset = position.offset;
    const workingSegment = this.workingPlaygraph.getSegment(position.segmentId);
    assert(workingSegment, 'segment must exist in workingPlaygraph');

    return {
      viewableId: workingSegment.viewableId,
      timeValue: workingSegment.startTime.add(offset),
    };
  }

  /**
   * Finds the playgraph position corresponding to an absolute timestamp.
   *
   * @param {*} timestamp - The absolute timestamp to look up.
   * @param {boolean} [allowFuzzy] - Whether to allow approximate matching.
   * @returns {Object|undefined} The matching position.
   */
  seekSegmentPosition(timestamp, allowFuzzy) {
    // First check if the player can resolve it directly
    const playerResult = this.player.seekSegmentPosition(timestamp);
    if (playerResult !== undefined) return playerResult;

    const currentTrackInfo = this.player.currentTrackInfo;
    return seekSegmentPosition(
      timestamp,
      {
        playgraph: this,
        currentTrackRef: currentTrackInfo && {
          id: currentTrackInfo.currentSegment.id,
          boxTimestamp: currentTrackInfo.boxTimestamp,
        },
      },
      allowFuzzy
    );
  }

  /**
   * Estimates the absolute time for a given position.
   *
   * @param {Object} position - The position to estimate.
   * @param {boolean} [includeUnbuffered=false] - Whether to walk forward
   *   through unbuffered segments.
   * @returns {*} The estimated absolute time.
   */
  estimateAbsoluteTime(position, includeUnbuffered = false) {
    const result = this.generateTimeEstimates(position, includeUnbuffered).next();
    if (!result.done) {
      return result.value?.absoluteTime;
    }
  }

  /**
   * Generator that yields time estimates walking forward from a position.
   * @private
   */
  *generateTimeEstimates(position, includeUnbuffered = false) {
    // Yield estimates from the player first
    const playerEstimates = this.player.generateTimeEstimates(position);
    for (const estimate of playerEstimates) {
      yield estimate;
    }

    if (!includeUnbuffered) return;

    const visited = {};
    let currentPosition = this.position;
    let currentSegment;

    // Try to use the player's current track info for more accurate estimates
    if (this.hasStarted && this.player.isPlaybackStarted) {
      const trackInfo = this.player.currentTrackInfo;
      if (trackInfo) {
        currentSegment = this.workingPlaygraph.getSegment(trackInfo.currentSegment.id);
        if (currentSegment) {
          currentPosition = {
            offset: TimeUtil.seekToSample,
            segmentId: trackInfo.currentSegment.id,
          };
        }
      }
    }

    if (!currentSegment) {
      currentSegment = this.workingPlaygraph.getSegment(currentPosition.segmentId);
      assert(currentSegment, `currentSegment ${currentPosition} must exist in workingPlaygraph`);
    }

    let accumulatedDuration = currentSegment.startTime
      .add(currentPosition.offset)
      .subtract(currentSegment.endTime);

    assert(currentSegment, 'Current segment should be defined by here');
    const baseTimestamp = this.setPosition;

    // If current segment has a default next and we're not at the target
    if (currentSegment.defaultNext && currentSegment.id !== position.segmentId) {
      // Walk forward through default next segments
      let nextSegment = this.workingPlaygraph.getSegment(currentSegment.defaultNext);
      assert(nextSegment, `currentSegment.defaultNext must exist in workingPlaygraph ${currentSegment.defaultNext} from ${position.segmentId}`);

      const playgraph = this.workingPlaygraph;
      const pathGenerator = this.workingPlaygraph.traverseWith((pg, id) => {
        const seg = playgraph.getSegment(id);
        assert(seg, 'nextSegment must exist in workingPlaygraph');
        return seg.defaultNext;
      }, nextSegment.id);

      for (const segment of pathGenerator) {
        if (visited[segment.id]) break;
        visited[segment.id] = true;

        if (segment.id === position.segmentId) {
          const duration = position.offset.add(accumulatedDuration);
          yield { duration, absoluteTime: baseTimestamp.add(duration) };
          return;
        }

        accumulatedDuration = accumulatedDuration.add(segment.offset);
      }
    } else if (currentSegment.id === position.segmentId) {
      const duration = position.offset.subtract(currentPosition.offset);
      yield { duration, absoluteTime: baseTimestamp.add(duration) };
    }
  }

  /**
   * Constrains a position to valid segment boundaries.
   * @param {Object} position - Position to constrain.
   * @returns {Object|undefined} Constrained position, or undefined if invalid.
   */
  constrainPosition(position) {
    return constrainSegmentPosition(this.segmentMap, position);
  }

  /**
   * Looks up the data bucket symbol for logging/diagnostics.
   * @param {Object} timeInfo - { viewableId, timeValue }
   * @returns {*} The data bucket symbol.
   */
  getDataBucketSymbol(timeInfo) {
    return dataBucketSymbol(this.segmentMap, timeInfo.viewableId, timeInfo.timeValue);
  }

  /**
   * Finds the position in the playgraph for a given viewable ID.
   * Searches forward through the segment graph from the current position.
   *
   * @param {number} viewableId - The viewable to find.
   * @returns {Object|undefined} The position, or undefined if not found.
   */
  findPositionForViewable(viewableId) {
    let currentPos = this.position;

    if (this.segmentMap.segments[currentPos.segmentId].viewableId === viewableId) {
      return currentPos;
    }

    // Search through player branches
    if (this.player.isPlaybackStarted) {
      const branches = this.player.branches;
      const currentBranchIdx = branches.indexOf(this.player.currentPlayingBranch);
      if (currentBranchIdx !== -1) {
        for (let i = currentBranchIdx; i < branches.length; i++) {
          const branch = branches[i];
          if (branch.currentSegment.viewableId === viewableId) {
            return {
              segmentId: branch.currentSegment.id,
              offset: branch.presentationStartTime,
            };
          }
        }
      }
    }

    // Walk forward through default next
    currentPos = this.player.currentTrackInfo
      ? {
          segmentId: this.player.currentTrackInfo.currentSegment.id,
          offset: this.player.currentTrackInfo.presentationStartTime,
        }
      : currentPos;

    while (true) {
      const rawSegment = this.segmentMap.segments[currentPos.segmentId];
      if (rawSegment.viewableId === viewableId) return currentPos;
      if (rawSegment.defaultNext) {
        currentPos = {
          segmentId: rawSegment.defaultNext,
          offset: TimeUtil.seekToSample,
        };
      } else {
        break;
      }
    }

    return undefined;
  }

  // ─────────── Viewable Lookup ───────────

  /**
   * Looks up segment properties for a viewable at a specific time.
   *
   * @param {Object} lookupInfo - { viewableId, timeValue }
   * @param {Object} [options] - Options.
   * @returns {*} The segment properties or undefined.
   */
  lookupSegmentByProperties(lookupInfo, options = { skipAdAdjustment: false }) {
    if (lookupInfo.viewableId === SegmentType.viewableId) return undefined;

    const positionInfo = this.getDataBucketSymbol(lookupInfo);
    const parentInfo = this.getParentViewableInfo(positionInfo?.segmentId, lookupInfo.viewableId);
    const viewableHandle = this.trackIdValue.createViewable(lookupInfo.viewableId, parentInfo);

    try {
      let timestamp = lookupInfo.timeValue;

      if (viewableHandle.viewableSession?.isAdPlaygraph && !options.skipAdAdjustment) {
        timestamp = computeLiveStartTime(
          this.console,
          viewableHandle.viewableSession.getPlaygraphNode(),
          viewableHandle.viewableSession,
          timestamp
        );
      }

      if (this.videoTrackSelector === undefined) {
        this.reportStreamingFailure({ message: 'No track selectors available' });
      } else {
        return viewableHandle.viewableSession?.lookupSegmentByProperties(
          this.config,
          timestamp,
          this.videoTrackSelector
        );
      }
    } catch (error) {
      this.console.error(error, error.stack);
    } finally {
      viewableHandle.decompressor.release();
    }
  }

  /**
   * Looks up segment properties and adds presentation start time.
   * @param {Object} lookupInfo - { viewableId, timeValue }
   * @returns {Object|undefined} Enhanced lookup result with presentation start.
   */
  lookupWithPresentationTime(lookupInfo) {
    const result = this.lookupSegmentByProperties(lookupInfo);
    if (result) {
      return {
        ...lookupInfo,
        presentationStartTime: result.presentationStartTime,
      };
    }
  }

  // ─────────── Buffer Management ───────────

  /**
   * Checks if all branches have content remaining to stream.
   * @returns {boolean} True if streaming is complete for all branches.
   */
  isStreamingComplete() {
    return hasAllTerminalBranches(this.branches, this.hasMoreContent.bind(this));
  }

  /**
   * Recursively checks if a branch has more content to deliver.
   * @private
   */
  hasMoreContent(branch) {
    const parentBranch = this.branches.getParentBranch(branch);
    return parentBranch === undefined || (parentBranch.hasMoreSegments && this.hasMoreContent(parentBranch));
  }

  /**
   * Returns the maximum total buffer level allowed.
   * @returns {number} Maximum buffer level in bytes or Infinity.
   */
  getMaxBufferLevel() {
    return this.bufferBudget.maxTotalBufferLevel;
  }

  /**
   * Gets buffer duration info by branch.
   * @param {*} branch - The branch to query.
   * @returns {*}
   */
  getBufferDurationsByBranch(branch) {
    return getBufferDurationsByBranch(this.branches, branch);
  }

  /**
   * Gets buffered duration ahead of the given timestamp.
   *
   * @param {*} currentTimestamp - The reference timestamp.
   * @returns {{ prefetchedAudioMs: number, prefetchedVideoMs: number, prefetchedTextMs: number }}
   */
  getBufferedDuration(currentTimestamp) {
    let audioMs, videoMs, textMs;

    function durationAhead(endTimeMs) {
      return endTimeMs ? Math.max(endTimeMs - currentTimestamp.playbackSegment, 0) : 0;
    }

    this.branches.walkBranches((branch) => {
      const audioEnd = branch.getEndTime(MediaType.AUDIO);
      const videoEnd = branch.getEndTime(MediaType.VIDEO);
      const textEnd = branch.getEndTime(MediaType.TEXT_MEDIA_TYPE);

      if (
        branch.currentSegment.isTerminalSegment ||
        !this.branches.hasChildBranch(branch) ||
        !branch.hasMoreSegments
      ) {
        if (!audioMs || audioEnd < audioMs) audioMs = audioEnd;
        if (!videoMs || videoEnd < videoMs) videoMs = videoEnd;
        if (!textMs || textEnd < textMs) textMs = textEnd;
      }

      return branch.hasMoreSegments;
    });

    return {
      prefetchedAudioMs: durationAhead(audioMs),
      prefetchedVideoMs: durationAhead(videoMs),
      prefetchedTextMs: durationAhead(textMs),
    };
  }

  /**
   * Maps a segment ID through a child playgraph to find the corresponding
   * segment in the parent.
   * @param {string} segmentId - Segment in the current playgraph.
   * @returns {WorkingSegment|undefined} Corresponding parent segment.
   */
  mapToParentSegment(segmentId) {
    const parentId = this.workingPlaygraph.mapToRoot(segmentId);
    return parentId ? this.workingPlaygraph.rootPlaygraph.getSegment(parentId) : undefined;
  }

  /**
   * Returns comprehensive buffer duration info for diagnostics.
   * @returns {Object} Buffer level information.
   */
  getBufferDurationInfo() {
    const bufferInfo = this.isPlayingContent
      ? this.getBufferedDuration(this.setPosition)
      : { prefetchedAudioMs: 0, prefetchedVideoMs: 0, prefetchedTextMs: 0 };

    const networkInfo = NetworkMonitor.instance().getNetworkInfo();

    return {
      totalabuflmsecs: bufferInfo.prefetchedAudioMs,
      totalvbuflmsecs: bufferInfo.prefetchedVideoMs,
      totaltbuflmsecs: bufferInfo.prefetchedTextMs,
      abuflbytes: 0,
      vbuflbytes: 0,
      tbuflbytes: 0,
      currentBandwidth:
        (networkInfo.confidence > 0 && networkInfo.bandwidth?.average) || 0,
    };
  }

  // ─────────── Streamable Requests ───────────

  /**
   * Gets the list of pending download requests to issue. This is the main
   * "pump" function called by the streaming engine to drive downloads.
   *
   * @returns {Array<StreamableRequest>} Requests to issue.
   */
  getPendingRequests() {
    if (this.hasStreamingFailure()) {
      this.diagnosticsTracer.emitDiagnosticEvent({ isStreamingFailureReported: true });
      return [];
    }

    const branchCount = this.branches.size;
    this.diagnosticsTracer.emitDiagnosticEvent({ branchCount });

    if (!this.isPlayingContent || branchCount === 0) return [];

    const currentTimestamp = this.setPosition;
    const currentPosition = this.position;
    const diagnosticSegments = [];

    const presentingSegment = this.workingPlaygraph.getSegment(this.position.segmentId);
    assert(presentingSegment, 'presentingSegment must exist in workingPlaygraph');

    const segmentDuration = presentingSegment.offset;
    const nextBranchCount = this.segmentOverrideTracker.getSegment(presentingSegment.id)
      ? 1
      : presentingSegment.branchWeight ?? 1;

    const requests = this.branches.reduce((accumulator, branch, branchIndex) => {
      const requestPipelines = branch.getRequestPipelines();

      for (const pipeline of requestPipelines) {
        if (!pipeline.isDoneStreaming()) {
          const requestId = `p${this.id}-${branchIndex}-${branch.timestamp?.playbackSegment}`;
          const startOffset = this.computeStreamableStartOffset(pipeline);
          const request = new StreamableRequest(
            this,
            pipeline,
            requestId,
            nextBranchCount,
            segmentDuration.playbackSegment,
            startOffset.playbackSegment,
            currentTimestamp.playbackSegment,
            currentPosition
          );
          accumulator.push(request);
        }

        if (!pipeline.isTerminalSegment() && this.diagnosticsTracer.isDetailedLoggingEnabled) {
          diagnosticSegments.push({
            segmentId: pipeline.segmentId,
            isDoneStreaming: pipeline.isDoneStreaming(),
            isNormalized: pipeline.isNormalized(),
            needsHeaderRequest: pipeline.track.needsHeaderRequest,
          });
        }
      }

      return accumulator;
    }, []);

    this.diagnosticsTracer.emitDiagnosticEvent({ nonStreamables: diagnosticSegments });
    return requests;
  }

  /**
   * Computes the start offset for a streamable request, accounting for
   * discontiguous buffering.
   * @private
   */
  computeStreamableStartOffset(pipeline) {
    let parentHandle = pipeline.getParentHandle();
    if (
      this.config.enableDiscontiguousBuffering &&
      parentHandle &&
      isContiguousSegment(parentHandle.branch.currentSegment.getAdjacencyInfo(pipeline.segmentId))
    ) {
      return pipeline.liveEdgeTime;
    }

    while (parentHandle && !parentHandle.hasCompletedDownload) {
      pipeline = parentHandle;
      parentHandle = parentHandle.getParentHandle();
    }
    return pipeline.liveEdgeTime;
  }

  /**
   * Gets the next track handle for stream selector chain traversal.
   * @param {Object} handle - Current download handle.
   * @returns {Object|undefined} The next handle in the chain.
   */
  getNextTrackHandle(handle) {
    if (handle.branch.isCancelledFlag) return undefined;
    const nextSegmentId = handle.branch.currentSegment.defaultNext;
    if (!nextSegmentId) return undefined;

    const [nextBranch] = this.branches.getActiveBranchList(nextSegmentId);
    return nextBranch?.getTrackForMediaType(handle.mediaType);
  }

  // ─────────── Buffering ───────────

  /**
   * Called when a buffering timeout occurs. Reports a streaming failure
   * with viewable context for diagnostics.
   * @private
   */
  onBufferingTimeout(message, errorSubCode, networkError) {
    if (this.segmentValidator.hasStreamingFailure()) return;

    let viewableId;
    try {
      const currentPosition = this.position;
      if (currentPosition) {
        const workingSegment = this.workingPlaygraph.getSegment(currentPosition.segmentId);
        assert(workingSegment, 'currentPosition segment must exist in workingPlaygraph');
        viewableId = workingSegment.viewableId;
      }
    } catch (error) {
      this.console.error(
        'Error getting viewableId for buffering timeout',
        error,
        'state:', this.positionTracker.state.value,
        'hasPlayer:', this.hasStarted,
        'hasPosition:', this.player.isPlaybackStarted,
        'branches:', JSON.stringify(this.player.branches)
      );
    }

    this.reportStreamingFailure({
      message,
      viewableId,
      errorSubCode,
      networkErrorCode: networkError?.errorCode,
      httpCode: networkError?.httpCode,
      diagnosticHandle: networkError?.diagnosticHandle,
    });
  }

  /**
   * Reports a streaming failure to the error handler.
   * @param {Object} errorInfo - Error details.
   */
  reportStreamingFailure(errorInfo) {
    this.segmentValidator.reportStreamingFailure(errorInfo);
    return true;
  }

  /**
   * Checks if there's a pending streaming failure.
   * @returns {boolean}
   */
  hasStreamingFailure() {
    return this.segmentValidator.hasStreamingFailure();
  }

  // ─────────── Logging & Events ───────────

  /**
   * Emits a log data event with processed pipeline data.
   * @param {string} target - The log target identifier.
   * @param {*} logEvent - Optional log event type.
   */
  emitLogData(target, logEvent) {
    const fields = this.processLogEvent(logEvent, target);
    this.events.emit('logdata', {
      type: 'logdata',
      target,
      fields,
    });
  }

  /**
   * Processes a log event through the event pipeline.
   * @private
   */
  processLogEvent(logEvent, target) {
    if (logEvent !== undefined) {
      this.manifestFetchScheduler.recordEvent(logEvent);
    }

    const fields = this.eventProcessingPipeline.serialize(logEvent, target);

    if (logEvent === getByteOffset.endPlayback) {
      const bufferInfo = this.getBufferDurationInfo();
      fields.vbuflmsec = bufferInfo.totalvbuflmsecs;
      fields.abuflmsec = bufferInfo.totalabuflmsecs;
      fields.vbuflbytes = bufferInfo.vbuflbytes;
      fields.abuflbytes = bufferInfo.abuflbytes;
      fields.audioSwitchability = this.getAudioSwitchability();
    }

    return fields;
  }

  /**
   * Gets audio switchability data across all viewables.
   * @private
   */
  getAudioSwitchability() {
    this.getActiveViewableSessions().forEach((session) => {
      const viewableId = session.viewableId;
      if (viewableId !== -1 && session.audioSwitchability !== undefined) {
        this.audioSwitchabilityMap[viewableId] = session.audioSwitchability;
      }
    });
    return this.audioSwitchabilityMap;
  }

  /**
   * Gets the log summary for diagnostic purposes.
   * @returns {*}
   */
  getLogSummary() {
    return this.eventProcessingPipeline.getLogSummary();
  }

  /**
   * Updates buffer budget constraints.
   * @param {Object} budget - New buffer budget.
   */
  updateBufferBudget(budget) {
    this.bufferBudget = budget;
    this.notifyCallback('updateBudget');
  }

  /**
   * Updates the priority weight of this playgraph.
   * @param {number} newWeight - New weight value.
   */
  updateWeight(newWeight) {
    if (newWeight !== this.weight) {
      this.weight = newWeight;
      this.events.emit('weightUpdated');
    }
  }

  // ─────────── Playgraph Updates ───────────

  /**
   * Updates the working playgraph with a new version.
   *
   * @param {WorkingPlaygraph} newPlaygraph - The updated playgraph.
   * @returns {Object} Result with success flag and reason.
   */
  updateWorkingPlaygraph(newPlaygraph) {
    const validation = this.validatePlaygraphUpdate(newPlaygraph.segmentMap);

    if (validation.success) {
      this.player.scheduleOnRenderThread(() => {
        this.updateWorkingPlaygraphRef(newPlaygraph.mergeFrom(this.workingPlaygraph));
      });

      const currentTrackInfo = this.player.currentTrackInfo;
      if (currentTrackInfo) {
        this.segmentOverrideTracker.refreshOverrides(currentTrackInfo.currentSegment.id);
        this.bufferLevelMonitor.update(currentTrackInfo, this.setPosition, true);
      }
      this.evaluationTimer.start();
    } else {
      this.diagnosticsTracer.emitDiagnosticEvent({
        current: this.workingPlaygraph.segmentMap,
        target: newPlaygraph.segmentMap,
        result: validation,
      });
    }

    return validation;
  }

  /**
   * Updates the playgraph from a raw segment map.
   *
   * @param {Object} segmentMap - New segment map data.
   * @returns {Object} Validation result.
   */
  updatePlaygraphMap(segmentMap) {
    const newPlaygraph = WorkingPlaygraphFactory.update(this.workingPlaygraph, segmentMap);
    return this.updateWorkingPlaygraph(newPlaygraph);
  }

  /**
   * Validates whether a playgraph update is safe to apply.
   * @private
   */
  validatePlaygraphUpdate(newSegmentMap) {
    const diff = validatePlaygraphUpdate(this.segmentMap, newSegmentMap);
    const { removed, modified, added } = diff;

    // No changes
    if ([diff.newSegments, removed, modified].every((list) => !list.length)) {
      return { success: true, reason: processPayload.PLAYGRAPH_UNCHANGED };
    }

    // Modified segments but no additions — and player is active
    if (modified.length === 0 && added.length === 0 && this.hasStarted && this.player.isPlaybackStarted) {
      return {
        success: false,
        reason: processPayload.NO_MATCHING_SEGMENT_FOUND,
        segmentId: this.position?.segmentId,
      };
    }

    // Check if removed segments are already in the player pipeline
    const removedActiveBranches = this.player.branches.filter(
      (branch) => removed.indexOf(branch.currentSegment.id) > -1
    );
    if (removedActiveBranches.length > 0) {
      return {
        success: false,
        reason: processPayload.SEGMENT_ALREADY_APPENDED_REMOVAL_NOT_SUPPORTED,
        segmentId: removedActiveBranches[0].currentSegment.id,
      };
    }

    // Check if the seek position's segment is being removed
    if (this.isPlayingContent && !this.player.isPlaybackStarted && removed.indexOf(this.playbackPosition.segmentId) > -1) {
      return {
        success: false,
        reason: processPayload.LOSS_OF_POSITION,
        segmentId: this.playbackPosition.segmentId,
      };
    }

    // Validate each modified segment
    if (this.isPlayingContent) {
      for (const segmentId of modified) {
        const oldSegment = this.segmentMap.segments[segmentId];
        const newSegment = newSegmentMap.segments[segmentId];
        const oldEndPts = oldSegment.contentEndPts;
        const oldViewableId = oldSegment.viewableId;
        const newEndPts = newSegment.contentEndPts;
        const newStartTime = newSegment.startTimeMs;
        const newViewableId = newSegment.viewableId;

        // Check for end-time changes on the presenting segment
        if (this.position.segmentId === segmentId && newEndPts !== oldEndPts) {
          if (!newEndPts) {
            return {
              success: false,
              reason: processPayload.SEGMENT_EXTENSION_NOT_SUPPORTED,
              segmentId,
            };
          }
          const truncationPoint = TimeUtil.fromMilliseconds(newEndPts - newStartTime + 1);
          if (this.position.offset?.greaterThan(truncationPoint)) {
            return {
              success: false,
              reason: processPayload.APPENDED_PAST_TRUNCATION_POINT,
              segmentId,
            };
          }
        }

        // Viewable ID must not change for existing segments
        if (oldViewableId !== newViewableId) {
          return {
            success: false,
            reason: processPayload.EXISTING_SEGMENT_VIEWABLE_ID_MISMATCHED,
            segmentId,
          };
        }

        // Check that existing branches can handle the update
        for (const branch of this.branches.getActiveBranchList(segmentId)) {
          if (!branch.handleVideoPadding(newSegment)) {
            return {
              success: false,
              reason: processPayload.EXISTING_BRANCH_UPDATE_ERROR,
              segmentId,
            };
          }
        }
      }
    }

    return { success: true, reason: processPayload.PLAYGRAPH_CHANGED };
  }

  // ─────────── Viewable Management ───────────

  /**
   * Gets the playgraph node data for a specific viewable.
   * @param {number} viewableId - The viewable ID.
   * @returns {*}
   */
  getPlaygraphNode(viewableId) {
    const [session] = this.getActiveViewableSessions().filter(
      (s) => s.viewableId === viewableId
    );
    if (session) return session.getPlaygraphNode();
  }

  /**
   * Gets the minimum total buffer duration across all branches.
   * @returns {number}
   */
  getMinTotalBufferDuration() {
    let minDuration = Infinity;
    for (const branch of this.branches) {
      minDuration = Math.min(minDuration, branch.getTotalBufferDuration());
    }
    return minDuration;
  }

  /**
   * Gets the minimum target buffer duration across all branches.
   * @returns {number}
   */
  getTargetBufferDuration() {
    let minDuration = Infinity;
    for (const branch of this.branches) {
      minDuration = Math.min(minDuration, branch.getTargetBufferDuration());
    }
    return minDuration;
  }

  /**
   * Updates the working playgraph reference and emits an update event.
   * @private
   */
  updateWorkingPlaygraphRef(newPlaygraph) {
    const updateEvent = {
      type: 'playgraphUpdating',
      previousSegmentMap: this.workingPlaygraph.segmentMap,
      newSegmentMap: newPlaygraph.segmentMap,
    };
    this.workingPlaygraph = newPlaygraph;
    this.updateLiveEdgeAfterPlaygraphChange();
    this.events.emit('playgraphUpdating', updateEvent);
  }

  /**
   * Updates live edge detection after a playgraph change.
   * @private
   */
  updateLiveEdgeAfterPlaygraphChange() {
    const currentPosition =
      this.player && this.hasStarted && this.player.isPlaybackStarted ? this.position : undefined;

    if (!currentPosition) return;

    const currentSegment = this.workingPlaygraph.getSegment(currentPosition.segmentId);
    assert(currentSegment, 'currentPosition segment must exist in workingPlaygraph');

    const previousNextSegment = this.player.liveEdgeDetector?.currentNextSegmentId;
    const newNextSegment = this.findNextSegmentFromPlayer(currentSegment);

    if (newNextSegment && newNextSegment !== previousNextSegment && this.player.hasPlayingContent) {
      const activeBranch = this.player.currentPlayingBranch;
      this.player.liveEdgeDetector?.updateLiveEdge(
        {
          segment: activeBranch.currentSegment,
          get bufferEnd() {
            return activeBranch.segmentEndTime.subtract(activeBranch.currentSegment.startTime);
          },
        },
        newNextSegment,
        this.position.offset,
        true,
        false,
        undefined
      );
    }
  }

  // ─────────── Viewable Session Management ───────────

  /**
   * Registers a viewable session (e.g., when a manifest is fetched for a
   * new viewable/ad).
   *
   * @param {Object} viewableSession - The viewable session to register.
   * @param {boolean} [triggerAdHydration] - Whether to trigger ad hydration.
   */
  registerViewableSession(viewableSession, triggerAdHydration) {
    this.unregisterViewableListeners(viewableSession);

    viewableSession.networkEvents.addListener('criticalNetworkError', this.onCriticalNetworkError);
    viewableSession.networkEvents.addListener('temporaryNetworkError', this.onTemporaryNetworkError);
    viewableSession.networkEvents.addListener('requestError', this.onTemporaryNetworkError);
    viewableSession.networkEvents.addListener('updatingLastSuccessEvent', this.onUpdatingLastSuccessEvent);

    const isUnique = this.getActiveViewableSessions().filter((s) => s === viewableSession).length <= 1;

    viewableSession.events.addListener('logdata', this.onLogdata);
    viewableSession.events.addListener('asereportconfigoverrides', this.onAsereportconfigoverrides);
    viewableSession.events.addListener('liveEventTimesUpdated', this.onLiveEventTimesUpdated);
    viewableSession.events.addListener('liveLoggingInfoUpdated', this.onLiveLoggingInfoUpdated);
    viewableSession.events.addListener('livePostplayUpdated', this.onLivePostplayUpdated);
    viewableSession.events.addListener('chaptersUpdated', this.onChaptersUpdated);

    if (viewableSession.isAdPlaygraph && isUnique) {
      viewableSession.updateLiveEventTimesFromMetadata();
      if (viewableSession.textIndexer) {
        viewableSession.textIndexer.addHandler(this.eventProcessingPipeline);
      }
      this.viewableEventAggregator.addViewableEventSource(viewableSession.eventProcessingPipeline, viewableSession.branchKey);
    }

    // Check for config overrides
    const viewableConfig = this.configWrapper.getConfigForViewable(viewableSession);
    if (
      viewableConfig.aseReportDenominator !== this.config.aseReportDenominator ||
      viewableConfig.aseReportIntervalMs !== this.config.aseReportIntervalMs ||
      viewableConfig.aseReportMaxStreamSelections !== this.config.aseReportMaxStreamSelections
    ) {
      this.events.emit('asereportconfigoverrides', {
        type: 'asereportconfigoverrides',
        aseReportDenominator: viewableConfig.aseReportDenominator,
        aseReportIntervalMs: viewableConfig.aseReportIntervalMs,
        aseReportMaxStreamSelections: viewableConfig.aseReportMaxStreamSelections,
      });
    }

    if (this.requestState === EngineState.STREAMING && triggerAdHydration) {
      this.waitForAdHydration();
    }
  }

  /**
   * Called when the last branch using a viewable session is destroyed.
   * @param {Object} viewableSession - The viewable session being released.
   */
  onViewableSessionReleased(viewableSession) {
    const activeBranches = this.branches.filter(
      (branch) => branch.isActive && branch.viewableSession === viewableSession
    );
    const isLastUsage = activeBranches.length === 0;

    this.audioSwitchabilityMap[viewableSession.viewableId] = viewableSession.audioSwitchability;

    if (isLastUsage) {
      this.unregisterViewableListeners(viewableSession);
      this.viewableEventAggregator.removeViewableEventSource(viewableSession.eventProcessingPipeline);
    }
  }

  /**
   * Removes all event listeners from a viewable session.
   * @private
   */
  unregisterViewableListeners(viewableSession) {
    viewableSession.networkEvents.removeListener('criticalNetworkError', this.onCriticalNetworkError);
    viewableSession.networkEvents.removeListener('temporaryNetworkError', this.onTemporaryNetworkError);
    viewableSession.networkEvents.removeListener('updatingLastSuccessEvent', this.onUpdatingLastSuccessEvent);
    viewableSession.events.removeListener('logdata', this.onLogdata);
    viewableSession.events.removeListener('asereportconfigoverrides', this.onAsereportconfigoverrides);
    viewableSession.events.removeListener('liveEventTimesUpdated', this.onLiveEventTimesUpdated);
    viewableSession.events.removeListener('liveLoggingInfoUpdated', this.onLiveLoggingInfoUpdated);
    viewableSession.events.removeListener('livePostplayUpdated', this.onLivePostplayUpdated);
    viewableSession.events.removeListener('chaptersUpdated', this.onChaptersUpdated);
    this.viewableEventAggregator.removeViewableEventSource(viewableSession.eventProcessingPipeline);
  }

  // ─────────── Branch-to-Player Pipeline ───────────

  /**
   * Adds a normalized branch to the player's rendering pipeline.
   * @private
   */
  addBranchToPlayer(branch) {
    assert(branch.isPlaybackActive, 'expected branch to be normalized on addBranchToPlayer');

    if (!this.player.hasPlayingContent && !this.playbackStateRef?.isPlaybackActive) {
      this.handleFirstBranchNormalization(branch);
    }

    this.positionTracker.addBranchTracks(branch.tracks);

    if (this.player.hasPlayingContent) {
      const currentTrackInfo = this.player.currentTrackInfo;
      if (currentTrackInfo) {
        this.segmentOverrideTracker.clear(currentTrackInfo.currentSegment.id);
      }
    }

    this.player.addBranches(branch);
    this.events.emit('branchEnqueued', { branch, type: 'branchEnqueued' });
    this.bufferLevelMonitor.update(branch, this.setPosition);
  }

  /**
   * Handles the first branch becoming normalized — resolves the initial
   * seek position to absolute PTS.
   * @private
   */
  handleFirstBranchNormalization(branch) {
    assert(branch.presentationStartTime, 'Normalized branch should have a defined content start timestamp');
    assert(this.playbackStateRef, 'AsePlaygraph should have a seek position on first branch normalization');
    assert(!this.playbackStateRef.isPlaybackActive, 'Seek position should not already be normalized on first branch normalization');

    const viewableSession = branch.viewableSession;
    const workingSegment = this.workingPlaygraph.getSegment(branch.currentSegment.id);
    assert(workingSegment, 'WorkingSegment for a normalized branch must exist');

    if (!workingSegment.isNormalized) {
      if (viewableSession.isAdPlaygraph) {
        this.normalizeLiveBranch(branch);
      } else {
        if (this.audioTrackSelector === undefined || this.videoTrackSelector === undefined) {
          this.reportStreamingFailure({ message: 'No track selectors available' });
          return;
        }
        this.workingPlaygraph.applyNormalization(
          viewableSession.viewableId,
          viewableSession.resolveTimestamps.bind(viewableSession, [this.audioTrackSelector, this.videoTrackSelector, this.textTrackSelector])
        );
      }
    }

    this.playbackStateRef = {
      ...this.playbackStateRef,
      position: {
        segmentId: workingSegment.id,
        offset: branch.presentationStartTime.subtract(workingSegment.startTime),
      },
      isPlaybackActive: true,
    };

    this.positionTracker.setInitialPosition(
      this.playbackStateRef.position,
      branch.tracks.filter((track) => track.mediaType === MediaType.AUDIO)[0]
    );
  }

  /**
   * Normalizes a live/ad branch with live-specific timestamp handling.
   * @private
   */
  normalizeLiveBranch(branch) {
    const [primaryTrack] = branch.tracks;
    assert(isLiveStream(primaryTrack), 'Expected primary track to be live');
    assert(branch.viewableSession.positionService, 'Expected live viewable with position service');

    const liveEndNormalization =
      applyLiveNormalization(this.console, this.config, branch.viewableSession, branch.currentSegment.endTime) ||
      TimeUtil.zero;

    const liveStartNormalization =
      branch.parent || branch.currentSegment.startTime.equals(TimeUtil.seekToSample)
        ? TimeUtil.zero
        : branch.viewableSession.positionService.getPlaygraphNode(false);

    const adjustedStart = computeLiveStartTime(
      this.console,
      liveStartNormalization,
      branch.viewableSession,
      TimeUtil.fromMilliseconds(branch.currentSegment.startTimeMs)
    );

    this.workingPlaygraph.normalizeSegmentById(branch.currentSegment.id, adjustedStart, liveEndNormalization);
    this.waitForAdHydration();
  }

  /**
   * Clears player state for a fresh streaming session.
   * @private
   */
  clearPlayerState() {
    this.bufferLevelMonitor.reset();
    this.player.clearAllBranches();
    this.playbackStateRef = undefined;
    this.listenerCleanup?.clear();
  }

  // ─────────── Error Handling ───────────

  /**
   * Handles download errors by delegating to the error handler.
   * @param {Object} request - The failed request.
   * @param {Object} error - The error details.
   * @param {number} retryCount - Current retry attempt number.
   * @returns {Object} Error handling decision.
   */
  handleDownloadError(request, error, retryCount) {
    const result = this.errorHandler.handleError(
      error,
      request.mediaProperties.mediaType,
      retryCount < 1 || (!request.mediaProperties.branch.isCancelledFlag && !this.hasMoreContent(request.mediaProperties.branch))
    );

    if (retryCount === 1 && getErrorScope(result.reason) === 'global') {
      this.positionTracker.reportGlobalError(request.mediaProperties.mediaType, this.getBufferedDuration(this.setPosition));
    }

    return result;
  }

  // ─────────── Stream Selection ───────────

  /**
   * Issues a download request for a specific streamable. This is the core
   * method called by the request scheduler to actually begin downloading
   * a segment's data.
   *
   * @param {Object} streamable - The streamable request to issue.
   * @returns {Object} Result with success flag and reason.
   */
  issueRequest(streamable) {
    const mediaProps = streamable.mediaProperties;
    const mediaType = mediaProps.mediaType;

    // Run stream selection (ABR)
    const selectionResult = this.activeStreamSelector.selectStreamAndLocations(
      this.playgraphState.value,
      this.setPosition,
      mediaProps.bufferEndTime,
      mediaProps.segmentStartTime,
      this.player.playbackRate,
      mediaProps,
      this.positionTracker.bufferingStartTime,
      this.streamFilters,
      this.streamFilterParams,
      this.liveAdReevalPending
    );

    const {
      stream,
      downloadableFormats,
      initSelReason: initialSelectionReason,
      cdnId,
      networkInfo,
      reason: failureReason,
      streamList,
      selectionResult: abrResult,
    } = selectionResult;

    if (!stream) {
      return { success: false, reason: failureReason || 'selectLocationsAndStream' };
    }

    if (this.videoTrackSelector === undefined) {
      this.reportStreamingFailure({ message: 'No track selectors available' });
      return { success: false, reason: 'noTrackSelectors' };
    }

    if (mediaProps.isDoneStreaming()) {
      return { success: false, reason: 'pipelineDoneStreaming' };
    }

    // Check DRM readiness and buffer limits
    if (
      this.playgraphState.value === PlaybackState.STREAMING &&
      mediaProps.branch &&
      mediaProps.branch.viewableSession.contentProfile &&
      !mediaProps.branch.viewableSession.isDrmReady(this.videoTrackSelector) &&
      !this.player.isDrmReady(mediaProps.branch.viewableSession.viewableId)
    ) {
      const bufferAhead = mediaProps.bufferEndTime.playbackSegment - this.setPosition.playbackSegment;

      if (!mediaProps.branch.viewableSession.isReadyForPlayback && bufferAhead > this.config.maxBufferingCompleteBufferInMs) {
        return { success: false, reason: 'maxBufferingCompleteBufferInMs' };
      }

      if (!stream.networkKey && stream.mediaType === MediaType.VIDEO && bufferAhead >= this.config.maxFastPlayBufferInMs) {
        return { success: false, reason: 'maxFastPlayBufferInMs' };
      }
    }

    // Determine primary media type for buffering progress tracking
    let primaryMediaType = MediaType.VIDEO;
    if (mediaProps.branch?.tracks.every((track) => track.mediaType === MediaType.AUDIO)) {
      primaryMediaType = MediaType.AUDIO;
    }

    if (this.positionTracker.isBuffering && mediaType === primaryMediaType) {
      this.positionTracker.updateStreamSelection(
        mediaProps.streamSelector.selectorName,
        stream.bitrate,
        initialSelectionReason
      );
    }

    // Check segment availability window for live
    if (
      this.config.linearEnforceSegmentAvailabilityWindowAtIssueRequest &&
      mediaProps.branch.viewableSession.hasSegmentAvailabilityWindow &&
      mediaProps.segmentStartTime.lessThan(mediaProps.branch.viewableSession.getEarliestAvailableSegment())
    ) {
      mediaProps.branch.events.emit('requestSeekToLiveEdge', { type: 'requestSeekToLiveEdge' });
      return { success: false, reason: 'behindSegmentAvailabilityWindow' };
    }

    // Queue speculative header downloads
    this.queueSpeculativeHeaders(mediaProps.branch.currentSegment, downloadableFormats);

    // Issue the actual download request
    const previousManifestEndTime = mediaProps.branch.currentManifestEndTime?.playbackSegment;
    const result = mediaProps.tryIssueRequest(stream, networkInfo, cdnId);

    if (result.requestToken) {
      // First drive logging
      if (this.isFirstDrive) {
        this.emitTimingEvent('firstDriveStreaming');
        this.isFirstDrive = false;
      }

      // Track manifest distance for ad hydration
      if (this.remainingManifestDistance > 0) {
        const currentManifestEnd = mediaProps.branch.currentManifestEndTime?.playbackSegment;
        if (previousManifestEndTime && currentManifestEnd) {
          this.remainingManifestDistance -= previousManifestEndTime - currentManifestEnd;
          if (this.remainingManifestDistance <= 0) {
            this.waitForAdHydration();
          }
        }
      }

      this.events.emit('requestIssued', {
        type: 'requestIssued',
        timestamp: platform.platform.now(),
        mediaType,
        result: abrResult,
        streamList,
        segmentId: mediaProps.branch.currentSegment.id,
      });
    } else if (result.reason === 'waitingOnMediaEvents') {
      assert(this.playbackContainer, 'waitingOnMediaEvents requires adManager');
      this.playbackContainer.adManager.handleMediaEventWait(
        mediaProps.branch.viewableSession.viewableId,
        mediaProps.bufferEndTime,
        mediaProps.segmentStartTime
      );
    }

    return result;
  }

  /**
   * Enables or disables CPR (content-proportional representation) for video.
   * @param {boolean} enabled - Whether to enable CPR.
   */
  setCprVideoEnabled(enabled) {
    this.config.enableCprVideo = enabled;
  }

  /**
   * Queues speculative header downloads for upcoming streams.
   * @private
   */
  queueSpeculativeHeaders(currentSegment, downloadableFormats) {
    downloadableFormats.forEach((format) => {
      format.viewableSession.queueHeaderRequest(format, currentSegment, () => {
        assert(this.isPlayingContent, 'Speculative header callback after streaming is cancelled');
        const currentMs = this.setPosition.playbackSegment;
        const bufferTarget = currentMs + this.config.minBufferLenForHeaderDownloading;
        return {
          excludedSegments: [],
          playgraphState: this.positionTracker.state.value,
          bufferTargetMs: bufferTarget,
          streamingPlayerMs: bufferTarget,
          playerPositionMs: currentMs,
        };
      });
    });
  }

  /**
   * Waits for ad hydration to complete by monitoring the evaluation timer.
   * @returns {Promise<void>}
   */
  waitForAdHydration() {
    return new Promise((resolve) => {
      if (this.requestState === EngineState.CLOSED) {
        resolve();
      } else {
        this.evaluationTimer.waitForState(EvaluationState.EVALUATED, () => {
          this.evaluationTimer.start();
          this.evaluationTimer.waitForState(EvaluationState.REQUEST_ISSUED, resolve);
        });
      }
    });
  }

  // ─────────── Branch Evaluation ───────────

  /**
   * The main branch evaluation loop. Called periodically by the evaluation timer.
   * Determines which branches to create, keep, or destroy based on:
   * - Current playback position
   * - Buffer levels
   * - Branch weights/probabilities
   * - Segment overrides (user choices)
   *
   * This is the "brain" of the playgraph — it decides what to download next.
   * @private
   */
  evaluateBranches() {
    if (this.requestState !== EngineState.STREAMING) return;

    const currentPosition = this.position;
    const playerBranches = this.player.branches;
    const branchCreationList = this.branches.getBranchCreationCandidates();

    const [firstBranch] = playerBranches;
    const startSegment = firstBranch
      ? this.workingPlaygraph.getSegment(firstBranch.currentSegment.id)
      : this.workingPlaygraph.getSegment(currentPosition.segmentId);

    assert(startSegment, 'startSegment must exist in workingPlaygraph');

    // Compute current buffer durations for each player branch
    const branchDurations = playerBranches.map((branch) => ({
      id: branch.currentSegment.id,
      duration: branch.previousState.subtract(branch.timestamp).playbackSegment,
    }));

    // Run the branch evaluation algorithm
    const evaluation = evaluateBranches(
      this.console,
      this.workingPlaygraph.branchTreeIterator,
      startSegment,
      branchCreationList,
      this.segmentOverrideTracker,
      branchDurations,
      TimeUtil.fromMilliseconds(this.config.branchDistanceThreshold),
      this.config.minimumDownstreamBranchProbability,
      TimeUtil.fromMilliseconds(this.config.branchCreationThreshold)
    );

    const { branchPlan } = evaluation;
    this.remainingManifestDistance = evaluation.manifestDistance || 0;

    // Run evaluation hooks (extensions can modify the plan)
    const hookResult = this.evaluationHooks.reduce(
      (acc, hook) => {
        const result = hook(acc.branchPlan);
        if (!acc.holdRequested) acc.holdRequested = result.holdRequested;
        acc.branchPlan = result.branchPlan;
        return acc;
      },
      { holdRequested: false, branchPlan }
    );

    this.evaluationHoldRequested = hookResult.holdRequested;

    // Apply the branch plan — create/destroy branches as needed
    this.branches
      .applyBranchPlan(
        hookResult.branchPlan,
        (segmentId, parentBranch) => {
          const workingSegment = this.workingPlaygraph.getSegment(segmentId);
          assert(workingSegment, 'segment must exist in workingPlaygraph');

          // Determine the content start offset
          let startOffset;
          if (segmentId === this.playbackPosition.segmentId) {
            startOffset = this.playbackPosition.offset;
          } else if (segmentId === this.endNotifyAction?.segmentId) {
            startOffset = this.endNotifyAction.offset;
          } else {
            startOffset = TimeUtil.seekToSample;
          }

          const contentStartTime = workingSegment.startTime.add(startOffset);
          return this.createBranch(workingSegment, contentStartTime, parentBranch);
        },
        this.console
      )
      .removed.forEach((removedBranch) => {
        removedBranch.cancelStreaming('aborted');
      });

    this.enqueuePendingBranches();

    if (!hookResult.holdRequested) {
      this.checkStreamingComplete();
    }

    this.evaluationTimer.waitForState(EvaluationState.EVALUATED, () => {
      const rootBranch = this.branches.root();
      if (rootBranch?.isActive) {
        this.notifyCallback('reevaluateBranches');
      }
      this.evaluationTimer.transitionTo(EvaluationState.REQUEST_ISSUED);
    });

    this.events.emit('branchesReevaluated', { type: 'branchesReevaluated' });
  }

  /**
   * Gets all active viewable sessions across branches.
   * @returns {Array} Unique array of active viewable sessions.
   */
  getActiveViewableSessions() {
    const sessions = [];
    for (const branch of this.branches) {
      if (branch.isActive) {
        sessions.push(branch.viewableSession);
        if (branch.viewableSession.alternateViewable) {
          sessions.push(branch.viewableSession.alternateViewable);
        }
      }
    }
    return uniqueArray(sessions);
  }

  /**
   * Gets chapters for a viewable.
   * @param {number} viewableId
   * @returns {*}
   */
  getChapters(viewableId) {
    const [session] = this.getActiveViewableSessions().filter((s) => s.viewableId === viewableId);
    return session?.getChapters();
  }

  /** @returns {string} Human-readable representation */
  toString() {
    return `AsePlaygraph(state: ${this.requestState}, branches: ${this.branches.size})`;
  }

  /** @returns {Object} JSON-serializable representation */
  toJSON() {
    return {
      state: this.requestState,
      branches: this.branches.size,
    };
  }

  /**
   * Enqueues pending normalized branches into the player's rendering pipeline.
   * @private
   */
  enqueuePendingBranches() {
    if (this.requestState !== EngineState.STREAMING) return;

    // Enqueue the root branch if not yet in the player
    if (!this.player.currentTrackInfo) {
      const [rootBranch] = this.branches.getActiveBranchList(this.playbackPosition.segmentId);
      if (rootBranch?.isPlaybackActive) {
        this.addBranchToPlayer(rootBranch);
      }
    }

    // Enqueue subsequent normalized branches
    if (this.player.currentTrackInfo) {
      while (true) {
        const nextSegmentId = this.getNextSegmentForBranch(this.player.currentTrackInfo.currentSegment);
        if (!nextSegmentId) break;

        const [nextBranch] = this.branches.getActiveBranchList(nextSegmentId).filter(
          (branch) => branch.parent === this.player.currentTrackInfo
        );
        if (!nextBranch) break;
        if (!nextBranch?.isPlaybackActive) break;
        if (nextBranch.viewableSession.isAdPlaygraph && !nextBranch.isReadyForPlayback()) break;
        if (this.player.wouldCreateDuplicateBranch(nextBranch)) break;

        this.addBranchToPlayer(nextBranch);
      }

      this.bufferLevelMonitor.update(this.player.currentTrackInfo, this.setPosition);
    }
  }

  /** Whether media has ever started playing */
  hasEverPlayedContent() {
    return this.hasEverPlayed;
  }

  /**
   * Finds the next segment to play after the given segment, checking both
   * player branches and segment overrides.
   * @private
   */
  findNextSegmentFromPlayer(segment) {
    if (this.player.hasPlayingContent) {
      const activeBranch = this.player.currentPlayingBranch;
      let reachedActive = false;

      const branchesAfterCurrent = this.player.branches.filter((branch) => {
        if (!reachedActive) reachedActive = branch === activeBranch;
        return reachedActive;
      });

      const segmentIndex = findLastIndex(branchesAfterCurrent, (branch) => branch.currentSegment.id === segment.id);

      const nextBranch = branchesAfterCurrent[segmentIndex + 1];
      if (nextBranch) return nextBranch.currentSegment.id;
    }

    return this.getNextSegmentForBranch(segment, false);
  }

  /**
   * Gets the next segment ID for a branch, considering overrides and defaults.
   * @private
   */
  getNextSegmentForBranch(segment, includeDefault = true) {
    const override = this.segmentOverrideTracker.getSegment(segment.id);
    if (override) return override;
    if (!includeDefault && segment.forwardBranchCount === 1) return segment.nextSegmentIds[0];
    return undefined;
  }

  /**
   * Checks if streaming is complete and handles end-of-stream.
   * @private
   */
  checkStreamingComplete() {
    const hasIncomplete = this.branches.empty || this.getIncompleteBranchCount() !== 0;

    if (!hasIncomplete && !this.allBranchesComplete) {
      // All branches done streaming
      if (this.positionTracker.isBuffering) {
        const bufferInfo = this.getBufferedDuration(this.setPosition);
        this.positionTracker.bufferingCompleteHandler('complete', bufferInfo.prefetchedAudioMs, bufferInfo.prefetchedVideoMs);
      }
      this.emitStreamerEnd();
      this.allBranchesComplete = true;
    } else if (hasIncomplete && this.allBranchesComplete) {
      this.allBranchesComplete = false;
    }
  }

  /**
   * Gets the count of branches that still have content to stream.
   * @private
   */
  getIncompleteBranchCount() {
    return this.branches.filter((branch) => !branch.hasMoreSegments).length;
  }

  /**
   * Checks buffering progress against the stream selector's targets.
   * @private
   */
  checkBufferingProgress(branch) {
    if (this.hasMoreContent(branch)) {
      this.positionTracker.checkBufferingProgress(
        this.setPosition,
        this.player.playbackRate,
        branch,
        {
          getMinBufferTarget: this.activeStreamSelector.getMinBufferTarget.bind(
            this.activeStreamSelector,
            this.errorHandler
          ),
        }
      );
    }
  }

  // ─────────── Branch Normalization ───────────

  /**
   * Called when a branch's segment timestamps are normalized (resolved).
   * @private
   */
  onBranchNormalized(branch, event) {
    if (event.didNormalizeSegment) {
      const viewableSession = branch.viewableSession;
      const workingSegment = this.workingPlaygraph.getSegment(branch.currentSegment.id);
      assert(workingSegment, 'WorkingSegment for a normalized branch must exist');

      if (viewableSession.isAdPlaygraph) {
        this.normalizeLiveBranch(branch);
      } else {
        if (this.audioTrackSelector === undefined || this.videoTrackSelector === undefined) {
          this.reportStreamingFailure({ message: 'No track selectors available' });
          return;
        }
        this.workingPlaygraph.applyNormalization(
          viewableSession.viewableId,
          viewableSession.resolveTimestamps.bind(viewableSession, [this.audioTrackSelector, this.videoTrackSelector, this.textTrackSelector])
        );
      }

      const normInfo = SegmentNormalizationInfo.create(branch, this.console, this.config);
      assert(normInfo, 'Segment should be normalized');

      Promise.resolve().then(() => {
        this.events.emit('segmentNormalized', {
          type: 'segmentNormalized',
          segmentId: workingSegment.id,
          normalizedStart: workingSegment.startTime,
          normalizedEnd: workingSegment.endTime,
          viewableContentEnd: normInfo.viewableContentEnd,
          viewableEarliestContentEnd: normInfo.viewableEarliestContentEnd,
          media: parseMediaStreams(branch.tracks),
        });
      });
    }

    Promise.resolve().then(() => this.enqueuePendingBranches());
    this.notifyCallback('branchNormalized');
  }

  /**
   * Called when a branch completes streaming all its segments.
   * @private
   */
  onBranchStreamingComplete() {
    if (!this.evaluationHoldRequested) {
      this.checkStreamingComplete();
    }
  }

  /**
   * Called when the evaluation timer should restart.
   * @private
   */
  onLastRequestIssued() {
    this.evaluationTimer.start();
  }

  /**
   * Called when a branch's content start time is finalized.
   * @private
   */
  onBranchEdited(branch) {
    this.propagateToDescendants(branch);
  }

  /**
   * Called when a branch's timestamp offsets change (for live/ad content).
   * @private
   */
  onBranchTimestampsChanged(branch, event) {
    const { newStartTime, newEndTime } = event;
    const viewableSession = branch.viewableSession;

    if (!newStartTime.equals(branch.currentSegment.startTime)) {
      viewableSession.mediaEventsStore?.updateTimestamp(newStartTime, branch.currentSegment.startTime);
    }
    if (!newEndTime.equals(branch.currentSegment.endTime)) {
      viewableSession.mediaEventsStore?.updateTimestamp(newEndTime, branch.currentSegment.endTime);
    }
  }

  // ─────────── Branch Creation ───────────

  /**
   * Creates a ViewableFetcher for a branch that handles manifest fetching
   * and viewable session creation.
   * @private
   */
  createViewableFetcher(segment, isChildBranch) {
    return new ViewableFetcher(
      segment.viewableId,
      this.trackIdValue,
      // On viewable received
      (branch, viewableSession, fetchContext, parentInfo, isAdHydration) => {
        if (this.state === EngineState.CLOSED) return;
        this.events.emit('branchViewableReceived', {
          type: 'branchViewableReceived',
          segment,
          viewableSession,
          fetchContext,
          parentInfo,
          isAdHydration,
        });
        this.registerViewableSession(viewableSession, isAdHydration);
        this.evaluationTimer.waitForState(EvaluationState.REQUEST_ISSUED, () => {
          if (!branch.isCancelledFlag) {
            this.emitSegmentStarting(branch, viewableSession, isChildBranch, viewableSession.manifestRef);
          }
        });
      },
      // On viewable failed
      (branch, error, fetchContext, parentInfo) => {
        if (this.state === EngineState.CLOSED) return;
        const parentViewable = branch.parent?.viewableSession.alternateViewable || branch.parent?.viewableSession;
        this.events.emit('branchViewableFailed', {
          type: 'branchViewableFailed',
          segment,
          parentViewable,
          viewableId: segment.viewableId,
          fetchContext,
          parentInfo,
          error,
        });
      },
      this.onViewableSessionReleased.bind(this),
      this.getParentViewableInfo.bind(this, segment.id, segment.viewableId)
    );
  }

  /**
   * Creates a new branch for a segment and wires up all event listeners.
   *
   * @private
   * @param {WorkingSegment} segment - The segment to create a branch for.
   * @param {*} contentStartTime - Absolute start time for the content.
   * @param {Object} [parentBranch] - Parent branch, if this is a child.
   * @returns {Object} The created branch.
   */
  createBranch(segment, contentStartTime, parentBranch) {
    if (this.branchFilterFn(segment, contentStartTime)) {
      throw new Error('Not implemented');
    }

    const viewableFetcher = this.createViewableFetcher(segment, !parentBranch);
    const bufferStart = parentBranch
      ? parentBranch.previousState.subtract(contentStartTime)
      : this.manifestFetchBuffer || TimeUtil.seekToSample;

    const branch = createBranch({
      config: this.config,
      console: this.console,
      segment,
      events: this.events,
      playgraph: this,
      contentStartTime,
      qualityDescriptor: bufferStart,
      getCurrentPlayerTime: this.getCurrentPlayerTime.bind(this),
      playgraphState: this.playgraphState,
      branchScheduler: this.branchScheduler,
      viewableFetcher,
      branchCollection: this.branches,
      engineScheduler: this.engineScheduler,
    });

    // Handle padding segments that already have a viewable session
    if (branch.isActive && branch.viewableSession?.viewableId === SegmentType.viewableId) {
      this.emitSegmentStarting(
        branch,
        parentBranch?.isActive ? parentBranch.viewableSession : { maxBitrates: [0, 0] },
        !parentBranch
      );
    }

    this.setupBranchListeners(branch, !!parentBranch);
    return branch;
  }

  /**
   * Gets the current player timestamp in milliseconds.
   * @private
   */
  getCurrentPlayerTime() {
    return this.setPosition.playbackSegment;
  }

  /**
   * Sets up event listeners on a newly created branch.
   * @private
   */
  setupBranchListeners(branch, hasParent) {
    const listenerTracker = new ClockWatcher();

    listenerTracker.addListener(branch.events, 'needsRequest', () => {
      const rootBranch = this.branches.root();
      if (!rootBranch || rootBranch.isActive) {
        this.notifyCallback('branchNeedsHeader');
      }
    });

    listenerTracker.addListener(branch.events, 'branchNormalized', this.onBranchNormalized.bind(this, branch));
    listenerTracker.addListener(branch.events, 'lastRequestIssued', this.onLastRequestIssued.bind(this, branch));
    listenerTracker.addListener(branch.events, 'contentStartFinalized', () => this.enqueuePendingBranches());
    listenerTracker.addListener(branch.events, 'branchStreamingComplete', this.onBranchStreamingComplete.bind(this, branch));
    listenerTracker.addListener(branch.events, 'checkBufferingProgress', this.checkBufferingProgress.bind(this, branch));
    listenerTracker.addListener(branch.events, 'branchEdited', this.onBranchEdited.bind(this, branch));

    listenerTracker.addListener(branch.events, 'branchOffsetUpdated', (event) => {
      if (
        branch.isActive &&
        branch.viewableSession.isAdPlaygraph &&
        branch.viewableSession.mediaEventsStore
      ) {
        this.playbackContainer?.adManager.handleOffsetUpdate(branch.viewableSession, event.qualityDescriptor);
      }
    });

    listenerTracker.addListener(branch.events, 'branchTimestampsChanged', this.onBranchTimestampsChanged.bind(this, branch));

    listenerTracker.addListener(branch.events, 'branchDestroyed', (event) => {
      listenerTracker.clear();

      if (this.branches.contains(branch)) {
        this.branches.removeBranch(branch);
        this.evaluationTimer.start();
      }

      const wouldDuplicate = this.player.wouldCreateDuplicateBranch(branch);

      this.evaluationTimer.waitForState(EvaluationState.EVALUATED, () => {
        if (event.reason !== 'aborted' || wouldDuplicate) {
          // Don't emit abort for branches that would duplicate
        } else {
          this.emitSegmentAborted(branch.currentSegment.id);
        }
        this.emitBranchDestroyed(branch, event.reason);
      });

      if (event.viewableSession?.isDisposed) {
        this.workingPlaygraph.clearNormalization(event.viewableSession.viewableId);
      }
    });

    listenerTracker.addListener(branch.events, 'liveMissingSegment', (event) => {
      this.events.emit('liveMissingSegment', event);
    });

    listenerTracker.addListener(branch.events, 'requestSeekToLiveEdge', (event) => {
      this.events.emit('requestSeekToLiveEdge', event);
    });

    if (!hasParent) {
      this.emitTimingEvent('createDlTracksStart');
      branch.events.once('requestQueuesCreated', () => {
        this.emitTimingEvent('createDlTracksEnd');
      });
    }
  }

  /**
   * Gets the branch currently presenting to the user.
   * @private
   */
  getCurrentPlayingBranch(timestamp) {
    if (this.player.isPlaybackStarted) {
      return this.player.currentPlayingBranch.getSegmentAtTimestamp(timestamp);
    }
  }

  /**
   * Returns the playgraph ID.
   * @returns {string}
   */
  getPlaygraphId() {
    return this.id;
  }

  /**
   * Selects tracks for a given viewable session based on current track selectors.
   *
   * @param {Object} viewableSession - The viewable session.
   * @param {*} [audioSelector] - Override audio selector.
   * @param {*} [videoSelector] - Override video selector.
   * @param {*} [textSelector] - Override text selector.
   * @returns {Array} Selected tracks.
   */
  selectTracksForViewable(viewableSession, audioSelector, videoSelector, textSelector) {
    const selectors = [
      [MediaType.AUDIO, audioSelector || this.audioTrackSelector, 'audio_tracks'],
      [MediaType.VIDEO, videoSelector || this.videoTrackSelector, 'video_tracks'],
    ];

    const selectedTracks = selectors
      .map(([mediaType, selector, trackKey]) => {
        if (!viewableSession.manifestRef) return undefined;
        assert(selector, `Expected mediaType ${mediaType} track selector to be defined`);
        const trackList = viewableSession.manifestRef[trackKey];
        const selectedIndex = selector.selectTrack(viewableSession.manifestRef, trackList);
        if (selectedIndex !== undefined && selectedIndex >= 0 && selectedIndex < trackList.length) {
          return viewableSession.getTrackById(trackList[selectedIndex].trackIdMatch);
        }
        return undefined;
      })
      .filter(isDefined);

    // Handle text tracks
    const effectiveTextSelector = textSelector || this.textTrackSelector;
    if (viewableSession.manifestRef && effectiveTextSelector) {
      const textTracks = viewableSession.manifestRef.timedtexttracks;
      const selectedTextIndex = effectiveTextSelector.selectTrack(viewableSession.manifestRef, textTracks);
      if (selectedTextIndex !== undefined && selectedTextIndex >= 0 && selectedTextIndex < textTracks.length) {
        const textTrack = viewableSession.getTrackById(textTracks[selectedTextIndex].id);
        if (textTrack) selectedTracks.push(textTrack);
      }
    }

    return selectedTracks;
  }

  /**
   * Gets the ad manager's render reference for a viewable.
   * @param {number} viewableId
   * @returns {*}
   */
  getAdRenderReference(viewableId) {
    return this.playbackContainer?.adManagerRef?.getAdRenderReference(viewableId);
  }

  /**
   * Gets the set of active DRM media types across all viewable sessions.
   * @private
   */
  getActiveDrmMediaTypes() {
    const mediaTypes = new Set();
    this.getActiveViewableSessions().forEach((session) => {
      this.selectTracksForViewable(session, this.audioTrackSelector, this.videoTrackSelector, this.textTrackSelector).forEach(
        (track) => mediaTypes.add(track.mediaType)
      );
    });
    return Array.from(mediaTypes).sort();
  }

  /**
   * Whether joint stream selector is enabled (audio+video selected together).
   * @private
   */
  isJointStreamSelectorEnabled() {
    return (
      this.config.jointStreamSelectorEnabled &&
      this.getActiveViewableSessions().every((session) => !session.isAdPlaygraph)
    );
  }

  // ─────────── Event Forwarding ───────────

  /** @private */
  onLogdata(event) {
    this.events.emit('logdata', event);
  }

  /** @private */
  onAsereportconfigoverrides(event) {
    this.events.emit('asereportconfigoverrides', event);
  }

  /** @private */
  onLiveEventTimesUpdated(event) {
    const viewableSession = event.viewableSession;
    const { startTime, endTime } = event;

    this.branches
      .filter((branch) => branch.isActive && branch.viewableSession === viewableSession)
      .forEach((branch) => {
        this.events.emit('liveEventTimesUpdated', {
          type: 'liveEventTimesUpdated',
          segmentId: branch.currentSegment.id,
          startTime,
          endTime,
        });
      });
  }

  /** @private */
  onLiveLoggingInfoUpdated(event) {
    const viewableSession = event.viewableSession;
    const { mediaType, info } = event;

    this.branches
      .filter((branch) => branch.isActive && branch.viewableSession === viewableSession)
      .forEach((branch) => {
        this.events.emit('liveLoggingInfoUpdated', {
          type: 'liveLoggingInfoUpdated',
          segmentId: branch.currentSegment.id,
          mediaType,
          info,
        });
      });
  }

  /** @private */
  onLivePostplayUpdated(event) {
    this.events.emit('livePostplayUpdated', {
      type: 'livePostplayUpdated',
      viewableId: event.viewableSession.viewableId,
      postplayData: event.postplayData,
      action: event.action,
    });
  }

  /** @private */
  onChaptersUpdated(event) {
    this.events.emit('chaptersUpdated', {
      viewableId: event.viewableSession.viewableId,
      type: 'chaptersUpdated',
    });
  }

  // ─────────── Event Emission Helpers ───────────

  /**
   * Emits a segmentStarting event when a branch begins processing a new segment.
   * @private
   */
  emitSegmentStarting(branch, viewableSession, isInitial, manifest) {
    const audioTracks = branch.tracks.filter((track) => track.mediaType === MediaType.AUDIO);
    const audioTrackId = audioTracks.length ? audioTracks[0].trackId : undefined;

    const event = {
      type: 'segmentStarting',
      segmentId: branch.currentSegment.id,
      contentOffset: branch.qualityDescriptor.playbackSegment,
      contentStartPts: branch.presentationStartTime.playbackSegment,
      maxBitrates: {
        audio: viewableSession.maxBitrates[MediaType.AUDIO],
        video: viewableSession.maxBitrates[MediaType.VIDEO],
      },
      media: parseMediaStreams(branch.tracks),
      initial: isInitial,
      manifest,
      audioTrackId,
      branchId: branch.branchId,
    };

    freezeEventFields(event, ['manifest']);
    this.events.emit(event.type, event);
  }

  /**
   * Emits a segmentAborted event.
   * @private
   */
  emitSegmentAborted(segmentId) {
    this.events.emit('segmentAborted', {
      type: 'segmentAborted',
      segmentId,
    });
  }

  /**
   * Emits a branchDestroyed event.
   * @private
   */
  emitBranchDestroyed(branch, reason) {
    this.events.emit('branchDestroyed', {
      type: 'branchDestroyed',
      branchId: branch.branchId,
      segmentId: branch.currentSegment.id,
      allMediaAppended: branch.allMediaAppended,
      reason,
    });
  }

  /**
   * Emits a streamerEnd event (all streaming complete).
   * @private
   */
  emitStreamerEnd() {
    this.events.emit('streamerEnd', {
      type: 'streamerEnd',
      timestamp: platform.platform.now(),
    });
  }

  /**
   * Emits a timing/performance event.
   * @private
   */
  emitTimingEvent(eventName) {
    this.events.emit('startEvent', {
      type: 'startEvent',
      event: eventName,
      timestamp: platform.platform.now(),
    });
  }

  /**
   * Gets parent viewable info for a segment (used for ad-to-content mapping).
   * @private
   */
  getParentViewableInfo(segmentId, viewableId) {
    if (!segmentId) return undefined;
    const parentSegmentId = this.playgraphEngine.workingPlaygraph.mapToRoot(segmentId);
    if (!parentSegmentId) return undefined;

    const parentSegment = this.playgraphEngine.workingPlaygraph.rootPlaygraph.getSegment(parentSegmentId);
    const parentViewableId = parentSegment?.viewableId;

    if (parentViewableId && String(parentViewableId) !== String(viewableId)) {
      return { parentMapping: { viewableId: parentViewableId } };
    }
    return undefined;
  }
}

// ─────────── Decorators ───────────
// These decorators add logging, parameter serialization, and diagnostics
// to the public API methods of AsePlaygraph.

// (Decorator metadata preserved from original for runtime compatibility)
// @paramDecorator.serialize() on playbackPosition getter
// @paramDecorator.serialize() on position getter
// @consoleLogger({ methodName: 'checkCanSetTracks', return: true })
// @consoleLogger({ methodName: 'setTracks', return: true })
// @consoleLogger({ methodName: 'setNextSegment', eventData: true })
// @consoleLogger({ methodName: 'seekStreaming' })
// @consoleLogger({ methodName: 'seekStreamingWithEntryPoint' })
// @consoleLogger({ methodName: 'getStreamables', detailed: true })
// @consoleLogger({ methodName: 'updateWorkingPlaygraph', return: true })
// @consoleLogger({ methodName: 'updatePlaygraphMap', return: true })

export { AsePlaygraph };
