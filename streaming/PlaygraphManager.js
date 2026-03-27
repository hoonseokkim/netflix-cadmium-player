/**
 * Netflix Cadmium Player — Playgraph Manager
 *
 * High-level manager for the playgraph (Netflix's content segment graph).
 * Orchestrates segment navigation, MediaSession integration, playback
 * transitions, and event forwarding between the playgraph state machine
 * and the player pipeline.
 *
 * Hooks into the browser's MediaSession API for system-level play/pause/seek
 * controls (e.g., keyboard media keys, OS media controls).
 *
 * @module PlaygraphManager
 */

// Dependencies
// import { cb as PlayerEventNames, JX as PlaygraphEvents, setState as PresentingState, streamState as StreamState, PlayerEvents } from './modules/Module_85001';
// import { PlaygraphIndex as PlaygraphIndex } from './modules/Module_98899';
// import { PlaygraphNormalizer as PlaygraphNormalizer } from './modules/Module_15645';
// import { ellaSendRateMultiplier as createThrottle } from './modules/Module_5021';
// import { segmentDurationMs as SECONDS_PER_UNIT } from './modules/Module_33096';
// import { disposableList } from './modules/Module_31276';
// import { uK as ThrottleToken } from './modules/Module_45842';

/**
 * Manages the playgraph lifecycle: segment index, state machine,
 * MediaSession integration, and segment transitions.
 */
export class PlaygraphManager {
  /**
   * @param {object} playgraphData      - Raw playgraph descriptor.
   * @param {object} logger             - Logger instance.
   * @param {object} eventBusFactory    - Factory for event bus creation.
   * @param {object} playgraphConfig    - Additional playgraph configuration.
   * @param {object} metricsReporter    - Playback metrics reporter.
   * @param {object} sessionFactory     - Streaming session factory.
   * @param {function} playgraphParser  - Parses raw playgraph data.
   * @param {object} lifecycleManager   - Manages lifecycle hooks.
   */
  constructor(playgraphData, logger, eventBusFactory, playgraphConfig, metricsReporter, sessionFactory, playgraphParser, lifecycleManager) {
    /** @private */ this.metricsReporter = metricsReporter;
    /** @private */ this.lifecycleManager = lifecycleManager;

    // Normalize playgraph data if configured
    if (playgraphConfig.xBa) {
      playgraphData = new PlaygraphNormalizer().I1c(playgraphData);
    }

    /** @private Parsed playgraph state. */
    this.playgraph = playgraphParser(playgraphData);

    /** @private Segment index for manifest metadata. */
    this.indexManager = new PlaygraphIndex(this.playgraph);
    this.indexManager.iSb(this.playgraph.aseGcSettings.J);

    /** @private */ this.log = logger.createSubLogger("PlaygraphManager");

    /** @private Event bus for state change notifications. */
    this.eventBus = eventBusFactory.create();

    /** @private State machine driving segment transitions. */
    this.stateMachine = sessionFactory.create(this.playgraph, this.indexManager, this.log, this.eventBus);

    this.#registerInternalListeners();
    this.#setupMediaSession();
  }

  // ---------------------------------------------------------------------------
  // MediaSession Integration
  // ---------------------------------------------------------------------------

  /**
   * Registers browser MediaSession action handlers for play, pause,
   * seek-forward, seek-backward, and seek-to actions.
   * @private
   */
  #setupMediaSession() {
    try {
      const mediaSession = navigator.mediaSession;
      if (!mediaSession?.setActionHandler) return;

      const throttle = disposableList.key(ThrottleToken)(createThrottle(500));

      mediaSession.setActionHandler("play", () => {
        this.playgraph.internal_Uca("play");
        throttle.scheduleHydration(() => this.getPlayer().playing());
      });

      mediaSession.setActionHandler("pause", () => {
        this.playgraph.internal_Uca("pause");
        throttle.scheduleHydration(() => this.getPlayer().pause());
      });

      mediaSession.setActionHandler("seekbackward", () => {
        this.playgraph.internal_Uca("seekbackward");
        throttle.scheduleHydration(() => {
          const player = this.getPlayer();
          const currentTime = player.XA();
          if (currentTime) {
            player.seek(Math.max(0, currentTime - 10 * SECONDS_PER_UNIT), StreamState.SEEK);
          }
        });
      });

      mediaSession.setActionHandler("seekforward", () => {
        this.playgraph.internal_Uca("seekforward");
        throttle.scheduleHydration(() => {
          const player = this.getPlayer();
          const currentTime = player.XA();
          const duration = player.YL();
          if (currentTime) {
            player.seek(Math.min(currentTime + 10 * SECONDS_PER_UNIT, duration), StreamState.SEEK);
          }
        });
      });

      mediaSession.setActionHandler("seekto", (details) => {
        this.playgraph.internal_Uca("seekto");
        throttle.scheduleHydration(() => {
          const player = this.getPlayer();
          const seekTime = details.seekTime;
          if (seekTime !== undefined && seekTime >= 0 && seekTime < player.YL()) {
            player.seek(seekTime * SECONDS_PER_UNIT, StreamState.SEEK);
          }
        });
      });

      // Disable track skip buttons (not applicable for streaming video)
      mediaSession.setActionHandler("previoustrack", null);
      mediaSession.setActionHandler("nexttrack", null);
    } catch (error) {
      this.log.error("Error setting up MediaSession", error);
    }
  }

  // ---------------------------------------------------------------------------
  // Playgraph Accessors
  // ---------------------------------------------------------------------------

  /** @returns {string} The playgraph ID. */
  getPlaygraphId() {
    return this.playgraph.playgraphId;
  }

  /** @returns {object} The ASE GC settings. */
  getSettings() {
    return this.playgraph.aseGcSettings;
  }

  /** @returns {string} The current segment (listener info). */
  getCurrentSegmentId() {
    return this.playgraph.listenerInfo;
  }

  /** @returns {object} The segment array/map. */
  getSegmentMap() {
    return this.playgraph.segmentArray;
  }

  // ---------------------------------------------------------------------------
  // Event & Notification Methods
  // ---------------------------------------------------------------------------

  /**
   * Forwards events to the playgraph.
   * @param {...*} args - Event arguments.
   */
  notifyEvent(...args) {
    this.playgraph.notifyEvent(...args);
  }

  /**
   * Dispatches internal events.
   * @param {Array} args - Event arguments.
   */
  dispatchInternalEvent(...args) {
    this.playgraph.dsb(args);
  }

  /**
   * Updates the playgraph segment map.
   * @param {object} segmentMap - New segment map.
   */
  updatePlaygraphMap(segmentMap) {
    this.playgraph.segmentArray = segmentMap;
  }

  // ---------------------------------------------------------------------------
  // Configuration & State
  // ---------------------------------------------------------------------------

  /**
   * Returns the computed position offset.
   * @returns {number|undefined}
   */
  getPositionOffset() {
    return this.playgraph.eya.H0();
  }

  /**
   * Applies configuration to the playgraph.
   * @param {*} config - Configuration key.
   * @param {*} value  - Configuration value.
   */
  applyConfig(config, value) {
    this.playgraph.applyConfig(config, value);
  }

  // ---------------------------------------------------------------------------
  // Segment Transitions
  // ---------------------------------------------------------------------------

  /**
   * Initiates a transition from the current segment to a target segment.
   *
   * @param {string} currentSegmentId - Must match the current segment.
   * @param {string} nextSegmentId    - Target segment ID.
   * @param {object} [sessionParams={}]  - Optional session parameters.
   * @param {boolean} [autoStart=true]   - Whether to auto-start playback.
   * @returns {Promise}
   * @throws {Error} If segment IDs are invalid.
   */
  transitionTo(currentSegmentId, nextSegmentId, sessionParams = {}, autoStart = true) {
    if (currentSegmentId !== this.playgraph.listenerInfo) {
      throw new Error("Invalid currentSegmentId");
    }

    const nextSegments = this.getSegmentMap().segments[currentSegmentId].next ?? {};
    if (Object.keys(nextSegments).indexOf(nextSegmentId) === -1) {
      throw new Error("Invalid nextSegmentId");
    }

    this.log.info(`Transition initiated: ${currentSegmentId} -> ${nextSegmentId}`);
    sessionParams.sessionParams?.isUIAutoPlay; // side-effect access
    return this.stateMachine.eXa(nextSegmentId, sessionParams, autoStart);
  }

  /**
   * Computes the current playback offset from the segment start.
   * @returns {number|undefined} Offset in milliseconds, or undefined.
   */
  getPlaybackOffset() {
    const currentTime = this.stateMachine.buildInstance().XH();
    const startTime = this.playgraph.aseGcSettings.startTimeMs;
    return currentTime ? currentTime - startTime : undefined;
  }

  /**
   * Computes the absolute playback position (offset + segment position).
   * @returns {number|undefined}
   */
  getAbsolutePosition() {
    const segmentPosition = this.playgraph.eya.H0(this.playgraph.listenerInfo);
    const offset = this.getPlaybackOffset();
    return segmentPosition && offset ? segmentPosition + offset : undefined;
  }

  /** @returns {boolean} Whether the state machine is ready. */
  isReady() {
    return this.stateMachine.isReady();
  }

  /**
   * Adds an event listener.
   * @param {string} event    - Event name.
   * @param {function} handler - Callback.
   * @param {*} [context]      - Optional context.
   */
  addListener(event, handler, context) {
    this.eventBus.addListener(event, handler, context);
  }

  /**
   * Removes an event listener.
   * @param {string} event    - Event name.
   * @param {function} handler - Callback.
   */
  removeListener(event, handler) {
    this.eventBus.removeListener(event, handler);
  }

  /** @returns {object} Current configuration snapshot. */
  getConfiguration() {
    return this.stateMachine.getConfiguration();
  }

  /** @returns {object} The underlying player (timed text subsystem). */
  getPlayer() {
    return this.stateMachine.buildInstance();
  }

  // ---------------------------------------------------------------------------
  // Playback Control
  // ---------------------------------------------------------------------------

  /**
   * Starts playback from an initial segment.
   *
   * @param {string} [initialSegment] - Segment to start from (defaults to initial).
   * @param {object} [sessionParams={}] - Session parameters.
   * @param {*} [manifestRef]           - Manifest reference.
   * @returns {*} Lifecycle hook result.
   */
  startPlayback(initialSegment, sessionParams = {}, manifestRef) {
    initialSegment = initialSegment ?? this.getSegmentMap().initialSegment;
    const hook = this.lifecycleManager.hwb(this);
    this.#initializeSegment(initialSegment ?? this.getSegmentMap().initialSegment, sessionParams, manifestRef);
    return hook;
  }

  /**
   * Adds a new segment to the playgraph dynamically.
   *
   * @param {object} segmentDescriptor - Segment descriptor.
   * @param {string} segmentDescriptor.R        - Movie/viewable ID.
   * @param {number} segmentDescriptor.startPts - Start PTS.
   * @param {number} segmentDescriptor.logicalEnd - Logical end PTS.
   * @returns {*} State machine result.
   */
  addSegment(segmentDescriptor) {
    this.log.info(`Adding segment - movieId: ${segmentDescriptor.R}, startPts: ${segmentDescriptor.startPts}, logicalEnd: ${segmentDescriptor.logicalEnd}`);

    const metadata = Object.assign(
      {},
      segmentDescriptor.manifestSessionData,
      segmentDescriptor.startPts ? { Nb: segmentDescriptor.startPts } : {},
      segmentDescriptor.logicalEnd ? { Cj: segmentDescriptor.logicalEnd } : {},
    );

    this.#updateSegmentMetadata(segmentDescriptor.R, metadata, segmentDescriptor.manifestRef);
    return this.stateMachine.erb(segmentDescriptor);
  }

  /**
   * Transitions to the next segment (auto-detected from playgraph).
   * @param {object} [params] - Transition parameters.
   * @returns {Promise}
   */
  transition(params) {
    const nextSegment = this.playgraph.cca(this.playgraph.listenerInfo);
    if (nextSegment) {
      return this.transitionTo(this.playgraph.listenerInfo, nextSegment, params);
    }
    this.log.error("Next segment is not defined");
    return Promise.reject();
  }

  /**
   * Closes/tears down the playgraph.
   * @param {*} reason - Close reason.
   * @returns {Promise}
   */
  closing(reason) {
    return this.stateMachine.closing(reason);
  }

  // ---------------------------------------------------------------------------
  // Private Helpers
  // ---------------------------------------------------------------------------

  /**
   * Initializes a segment for playback.
   * @private
   */
  #initializeSegment(segmentId, sessionParams, manifestRef) {
    if (segmentId === undefined) {
      segmentId = this.getSegmentMap()?.initialSegment;
    }
    if (sessionParams || manifestRef) {
      this.#updateSegmentMetadata(
        this.getSegmentMap().segments[segmentId].J,
        sessionParams ?? {},
        manifestRef,
      );
    }
    this.stateMachine.DU(segmentId);
  }

  /**
   * Updates manifest metadata and session data for a viewable.
   * @private
   */
  #updateSegmentMetadata(viewableId, sessionData, manifestRef) {
    if (manifestRef) {
      this.indexManager.updateManifestMetadata(viewableId, manifestRef);
    }
    this.indexManager.internal_Oac(viewableId, sessionData);
  }

  /**
   * Registers internal event listeners for lifecycle management.
   * @private
   */
  #registerInternalListeners() {
    this.playgraph.Z_c(() => {
      this.indexManager.$E();
      this.stateMachine.$E();
    });

    this.playgraph.$_c((event) => {
      this.stateMachine.t1a(event);
    });

    this.playgraph.X_c((event) => {
      this.stateMachine.initializeHandler(event);
    });

    this.addListener(PlaygraphEvents.internal_Rga, (event) => this.#onPlayerReady(event));
    this.addListener(PlayerEventNames.HFb, (event) => this.#onTransitionRequest(event));
  }

  /**
   * Handles segment transition requests.
   * @private
   */
  #onTransitionRequest(event) {
    this.stateMachine.QVb(event).catch(() =>
      this.eventBus.emit(PlayerEventNames.error, event.cia())
    );
  }

  /**
   * Handles the player-ready event: re-registers presenting listener,
   * emits standard lifecycle events.
   * @private
   */
  #onPlayerReady(event) {
    const error = this.getPlayer().getError();
    if (error) {
      this.eventBus.emit(PlayerEventNames.kZ, error);
      return;
    }

    const player = event.player;
    const playerId = player.getConfiguration().id;

    if (!this.lastPlayerId || this.lastPlayerId !== playerId) {
      const handler = (presentingEvent) => this.#onSegmentPresenting(presentingEvent);
      this.getPlayer().UPb(PlayerEvents.iO, handler);
      player.EOa(PlayerEvents.iO, handler);
      this.lastPlayerId = playerId;
    }

    this.eventBus.emit(PlayerEventNames.internal_Doa);
    this.eventBus.emit(PlayerEventNames.eventCallback);
    this.eventBus.emit(PlayerEventNames.EC);
    this.eventBus.emit(PlayerEventNames.gq);
    this.eventBus.emit(PlayerEventNames.lia);
    this.eventBus.emit(PlayerEventNames.kZ);
  }

  /**
   * Handles segment-presenting metrics events.
   * @private
   */
  #onSegmentPresenting(event) {
    const { metrics } = event;
    if (!metrics) return;

    const player = this.getPlayer();
    const currentSegment = player.getPlaybackSegment(event.position.segmentId);
    const sourceSegment = player.getPlaybackSegment(metrics.srcsegment);
    this.metricsReporter.HRc(event, currentSegment, sourceSegment, !!player.WCb().isSeeking);
  }
}
