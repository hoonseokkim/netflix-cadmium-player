/**
 * @file SegmentManager.js
 * @description Manages playback segments (episodes/chapters) in the Netflix Cadmium player.
 * Handles loading, transitioning, queuing, and closing of media segments for
 * seamless multi-segment playback (e.g., auto-play next episode, binge watching).
 * @module player/SegmentManager
 * @see Module_64181
 */

import PlayerEvents from './PlayerEvents.js';
import { MILLISECONDS } from '../timing/TimeUnit.js';

/**
 * Returns a minimal segment descriptor for logging.
 * @param {Object} segment - The segment object
 * @returns {{ movieId: * }}
 */
function segmentSummary(segment) {
  return { movieId: segment.R };
}

/**
 * Returns a detailed JSON string of a segment for debug logging.
 * @param {Object} segment - The segment object
 * @returns {string}
 */
function segmentDetails(segment) {
  return JSON.stringify({
    movieId: segment.R,
    startPts: segment.startPts,
    logicalEnd: segment.logicalEnd,
    params: segment.manifestSessionData ? {
      trackingId: segment.manifestSessionData.TrackingId,
      authParams: segment.manifestSessionData.internal_Goa,
      sessionParams: segment.manifestSessionData.sessionParams,
      disableTrackStickiness: segment.manifestSessionData.ESa,
      uiPlayStartTime: segment.manifestSessionData.JC,
      loadImmediately: segment.manifestSessionData.fva,
      playbackState: segment.manifestSessionData.playbackState ? {
        currentTime: segment.manifestSessionData.playbackState.currentTime,
        volume: segment.manifestSessionData.playbackState.volume,
        muted: segment.manifestSessionData.playbackState.muted,
        playbackRate: segment.manifestSessionData.playbackState.playbackRate,
      } : undefined,
      pin: segment.manifestSessionData.BNb,
      heartbeatCooldown: segment.manifestSessionData.uXa,
      uiLabel: segment.manifestSessionData.manifestFormat,
      uxLabels: segment.manifestSessionData.yBa,
    } : undefined,
  });
}

/**
 * Represents an individual playback session for a single segment (episode).
 * Handles loading the player, observing playback progress, and triggering
 * preloading of the next segment at the appropriate time.
 */
class SegmentSession {
  /**
   * @param {Object} log - Logger instance
   * @param {Object} config - Player configuration
   * @param {Object} timeWatcher - Observes playback time for preload triggers
   * @param {Object} playerFactory - Creates player instances for segments
   * @param {Object} viewableConfig - Viewable configuration factory
   * @param {Object} ufa - UFA configuration
   * @param {Object} segmentManager - Parent SegmentManager reference
   * @param {Object} segment - The segment data (movieId, startPts, logicalEnd, etc.)
   * @param {HTMLElement} containerElement - DOM container for player elements
   * @param {Object} aseGcSettings - ASE garbage collection settings
   * @param {Object} indexManager - Index manager for segment tracking
   */
  constructor(log, config, timeWatcher, playerFactory, viewableConfig, ufa, segmentManager, segment, containerElement, aseGcSettings, indexManager) {
    this.log = log;
    this.config = config;
    this.timeWatcher = timeWatcher;
    this.playerFactory = playerFactory;
    this.viewableConfig = viewableConfig;
    this.ufa = ufa;
    this.segmentManager = segmentManager;
    this.currentSegment = segment;
    this.containerElement = containerElement;
    this.aseGcSettings = aseGcSettings;
    this.indexManager = indexManager;

    /** @private Cancels the time observation */
    this.cancelTimeObserver = () => {
      if (this.timeObserver) {
        this.timeObserver.cancel();
        this.timeObserver = undefined;
      }
    };

    /** @private Handles transition event when segment becomes active */
    this.onTransitionEvent = (event) => {
      this.log.pauseTrace('Received the transition event', { movieId: event.R });
      this.resolveTransition();
    };

    /** @private Callback invoked when the segment's preload point is reached */
    this.onPreloadPointReached = () => {};

    this.log.debug('Constructing session data', segmentSummary(segment));

    /** @type {Promise} Promise that resolves when this session transitions */
    this.transitionPromise = new Promise((resolve) => {
      this.resolveTransition = resolve;
    });
  }

  /**
   * Loads the segment's player. If `isBackground` is true, the player is loaded
   * in the background (for preloading the next episode).
   * @param {boolean} isBackground - Whether to load as a background (preloaded) session
   */
  loading(isBackground) {
    this.log.pauseTrace('Loading new segment', segmentSummary(this.currentSegment));

    this.player = this.playerFactory.triggerZoneUpdate(
      this.config, this.ufa, this.viewableConfig,
      this.currentSegment, this.aseGcSettings, this.indexManager
    );

    // Listen for segment becoming inactive (error/close)
    this.player.addEventListener(PlayerEvents.cb.U0, (event) => {
      this.log.pauseTrace('Segment is inactive', segmentSummary(this.currentSegment));
      this.segmentManager.closing(this.viewableConfig(event.errorCode));
    });

    this.player.addEventListener(PlayerEvents.cb.closed, this.cancelTimeObserver);

    // Listen for timecode updates (start/end points)
    this.player.addEventListener(PlayerEvents.cb.s7a, (event) => {
      event.timecodes.forEach((timecode) => {
        if (timecode.type === 'start' && isBackground) {
          this.currentSegment.startPts = timecode.r4;
          this.currentSegment.manifestSessionData.startPts = timecode.r4;
        } else if (timecode.type === 'ending') {
          this.currentSegment.logicalEnd = timecode.r4;
          this.currentSegment.manifestSessionData.logicalEnd = timecode.r4;
        }
      });

      if (this.currentSegment.id && this.currentSegment.logicalEnd) {
        this.aseGcSettings.KWb(this.currentSegment.id, this.currentSegment.logicalEnd);
      }

      this.segmentManager.tried(this.currentSegment);
    });

    if (isBackground) {
      this.log.debug('Pausing background segment', segmentSummary(this.currentSegment));
      this.player.addEventListener(PlayerEvents.cb.XYa, this.onTransitionEvent);
      this.player.lNb(); // Pause in background
    } else {
      this.containerElement.appendChild(this.player.getConfiguration());
      const onLoaded = (event) => {
        this.onTransitionEvent(event);
        this.player.removeEventListener(PlayerEvents.cb.loaded, onLoaded);
      };
      this.player.addEventListener(PlayerEvents.cb.loaded, onLoaded);
    }
  }

  /**
   * Starts observing playback time to determine when to preload the next segment.
   * The observation point is calculated based on the segment's logical end time
   * minus a configurable preload buffer.
   */
  observe() {
    this.log.pauseTrace('Observing segment', segmentDetails(this.currentSegment));

    if (this.timeObserver) {
      this.log.pauseTrace('Segment is currently observing', segmentSummary(this.currentSegment));
    } else if (this.currentSegment.manifestSessionData?.fva) {
      // Load immediately if flagged
      this.onPreloadPointReached(this);
    } else {
      const watcher = this.timeWatcher.internal_Uvb(this.config, () => {
        return this.player ? (this.player.XH() || 0) : 0;
      });

      const observeTime = this.calculatePreloadTime(this.currentSegment);
      this.log.pauseTrace('Adding a moment to watch', { time: observeTime });

      watcher.observe(observeTime, () => {
        this.log.pauseTrace('Segment has reached its loading point', segmentSummary(this.currentSegment));
        this.onPreloadPointReached(this);
        this.cancelTimeObserver();
      });
    }
  }

  /**
   * Closes this segment session and cleans up resources.
   * @param {*} [error] - Optional error that caused the close
   * @returns {Promise<void>}
   */
  closing(error) {
    this.log.info('Closing segment', {
      segment: segmentDetails(this.currentSegment),
      error,
    });

    if (this.player) {
      this.player.removeEventListener(PlayerEvents.cb.XYa, this.onTransitionEvent);
      return this.player.closing(error);
    }
    return Promise.resolve();
  }

  /**
   * Sets the callback to invoke when the segment's preload point is reached.
   * @param {Function} callback
   */
  setPreloadCallback(callback) {
    this.onPreloadPointReached = callback;
  }

  /**
   * Calculates the time at which preloading of the next segment should begin.
   * @param {Object} segment - The current segment
   * @returns {number} The preload trigger time in presentation time
   * @private
   */
  calculatePreloadTime(segment) {
    const logicalEnd = segment.logicalEnd;
    const loadImmediately = segment.manifestSessionData ? segment.manifestSessionData.fva : false;
    let preloadTime = 0;

    if (logicalEnd && !loadImmediately) {
      preloadTime = logicalEnd - this.config.rCb();
      if (preloadTime < this.config.zCb()) {
        const minBuffer = logicalEnd - this.config.zCb();
        preloadTime = logicalEnd - minBuffer / 2;
      }
    }
    return preloadTime;
  }
}

/**
 * Manages multiple playback segments for seamless episode transitions.
 * Coordinates loading, queuing, transitioning, and closing of segment sessions
 * to enable features like binge-watching and next-episode preloading.
 */
export class SegmentManager {
  /**
   * @param {Object} videoSyncClock - Provides current video sync time
   * @param {Object} logger - Logger instance
   * @param {Object} timeWatcher - Time watcher for preload trigger observations
   * @param {Object} playerFactory - Factory for creating segment players
   * @param {Object} config - Player configuration
   * @param {Object} aseGcSettings - ASE garbage collection settings
   * @param {Object} viewableConfig - Viewable config factory
   * @param {Object} ufa - UFA configuration
   * @param {Object} elementFactory - DOM element factory
   * @param {Object} eventBusFactory - Event bus factory
   * @param {Object} indexManager - Index manager for segment tracking
   */
  constructor(videoSyncClock, logger, timeWatcher, playerFactory, config, aseGcSettings, viewableConfig, ufa, elementFactory, eventBusFactory, indexManager) {
    this.videoSyncClock = videoSyncClock;
    this.timeWatcher = timeWatcher;
    this.playerFactory = playerFactory;
    this.config = config;
    this.aseGcSettings = aseGcSettings;
    this.viewableConfig = viewableConfig;
    this.ufa = ufa;
    this.elementFactory = elementFactory;
    this.indexManager = indexManager;

    /** @private Event forwarding bindings from player events to the event bus */
    this.eventForwarders = Object.values(PlayerEvents.cb).map((event) => ({
      event,
      handler: (data) => this.eventBus.emit(event, data),
    }));

    /** @type {Object} Event bus for segment manager events */
    this.eventBus = eventBusFactory.create();

    /** @type {Array<SegmentSession>} Queue of segments waiting to be loaded */
    this.queuedSegments = [];

    /** @type {Object} Sub-logger for segment manager operations */
    this.log = logger.createSubLogger('SegmentManager');

    /** @type {boolean} Whether the first segment is yet to be loaded */
    this.isFirstSegment = true;

    /** @type {HTMLDivElement} Container element for player DOM nodes */
    this.containerElement = this.elementFactory.createElement('div', /* CSS class */);
  }

  /**
   * Returns whether the current session's player is ready.
   * @returns {boolean}
   */
  isPlayerReady() {
    return this.currentSession?.player ? this.currentSession.player.isReady() : false;
  }

  /**
   * Gets the container DOM element.
   * @returns {HTMLDivElement}
   */
  getConfiguration() {
    return this.containerElement;
  }

  /**
   * Gets the current active player instance.
   * @returns {Object} The player instance
   * @throws {Error} If no player is ready
   */
  buildInstance() {
    if (!this.currentSession?.player) {
      throw new Error('Player not ready');
    }
    return this.currentSession.player;
  }

  /**
   * Updates segment data (timecodes) from playback events.
   * @param {Object} segment - Updated segment data
   */
  tried(segment) {
    const existingSession = this.findSession(segment);
    if (existingSession) {
      this.overwriteSegmentData(existingSession, segment);
    } else if (!this.aseGcSettings.getSegmentInfo(segment.id)) {
      this.log.error('Tried to update a non-existent segment', {
        segment: segmentDetails(segment),
        currentMovieId: this.currentSession.currentSegment.R,
        queuedMovieIds: this.queuedSegments.map((s) => s.currentSegment.R),
        xid: this.currentSession.player?.cB(),
      });
    }
  }

  /**
   * Adds a new segment to the playback queue. If it's the first segment,
   * it begins loading immediately. Subsequent segments are queued and
   * observation starts to trigger preloading at the right time.
   * @param {Object} segment - The segment to add
   * @returns {Promise|null} The transition promise for this segment
   */
  configureFragment(segment) {
    let session;
    this.log.info('Adding segment', segmentDetails(segment));

    if (this.isFirstSegment) {
      this.log.pauseTrace('First segment, loading', segmentSummary(segment));
      session = this.loadNextEpisode(segment);
      this.isFirstSegment = false;
    } else {
      this.log.pauseTrace('Subsequent segment, caching', segmentSummary(segment));
      session = this.findSession(segment);
      if (session) {
        this.overwriteSegmentData(session, segment);
      } else {
        session = this.createSession(segment);
        this.queuedSegments.push(session);
        this.currentSession.observe();
      }
    }

    return session ? session.transitionPromise : null;
  }

  /**
   * Transitions to the next preloaded segment. Used for episode transitions.
   * @param {*} segmentId - The segment ID to transition to
   * @param {Object} [options={}] - Transition options
   * @returns {Promise<void>}
   */
  transition(segmentId, options) {
    const nextSession = this.nextSession;
    const nextPlayer = nextSession?.player;

    if (nextSession && nextPlayer) {
      this.nextSession = undefined;
      this.log.info('Transitioning segment', segmentDetails(nextSession.currentSegment));
      nextPlayer.S5a(this.videoSyncClock.getCurrentTime().toUnit(MILLISECONDS));
      return this.activateSession(nextSession, options);
    }

    const nextSegment = nextSession?.currentSegment;
    this.log.error('Transitioning to next segment failed. Session or player not available.', {
      mid: this.currentSession.currentSegment.R,
      xid: this.currentSession.player?.cB(),
      nextSegmentId: segmentId,
      currentSegment: segmentDetails(this.currentSession.currentSegment),
      nextSegment: nextSegment ? segmentDetails(nextSegment) : undefined,
      queuedMovieIds: this.queuedSegments.map((s) => s.currentSegment.R),
    });
    return Promise.reject();
  }

  /**
   * Closes all active and queued segments.
   * @param {*} [error] - Optional error that triggered closing
   * @returns {Promise<void>}
   */
  closing(error) {
    this.log.pauseTrace('Closing all segments', {
      currSession: JSON.stringify(segmentSummary(this.currentSession.currentSegment)),
      nextSession: this.nextSession
        ? JSON.stringify(segmentSummary(this.nextSession.currentSegment))
        : undefined,
    });

    const closePromises = [this.currentSession.closing(error)];
    if (this.nextSession) {
      closePromises.push(this.nextSession.closing());
    }

    return Promise.all(closePromises).then(() => {
      this.nextSession = undefined;
      this.queuedSegments = [];
      this.isFirstSegment = true;
    });
  }

  /**
   * Adds an event listener on the event bus.
   * @param {string} event
   * @param {Function} listener
   * @param {*} [context]
   */
  addListener(event, listener, context) {
    this.eventBus.addListener(event, listener, context);
  }

  /**
   * Removes an event listener from the event bus.
   * @param {string} event
   * @param {Function} listener
   */
  removeListener(event, listener) {
    this.eventBus.removeListener(event, listener);
  }

  /**
   * Overwrites existing segment data with updated values.
   * @param {SegmentSession} session
   * @param {Object} newData
   * @private
   */
  overwriteSegmentData(session, newData) {
    this.mergeSegmentData(session.currentSegment, newData);
    this.log.pauseTrace('Overwrote existing segment data', segmentDetails(session.currentSegment));
  }

  /**
   * Begins loading the next episode/segment, either as the first play or as a preload.
   * @param {Object} segment - The segment to load
   * @returns {SegmentSession|undefined}
   * @private
   */
  loadNextEpisode(segment) {
    this.log.info('Loading the next episode', segmentSummary(segment));

    let session;
    if (this.currentSession) {
      this.config.ZUa()[segment.R] = segment.startPts;
      session = this.findSession(segment);
    } else {
      session = this.createSession(segment);
    }

    if (session) {
      this.log.pauseTrace('Found the next session', segmentSummary(segment));
      session.setPreloadCallback((s) => { this.checkQueueForPreload(s); });

      if (this.currentSession) {
        this.log.pauseTrace('Subsequent playback, caching player and pausing', segmentSummary(segment));
        this.nextSession = session;
        session.loading(true);
      } else {
        this.log.pauseTrace('First playback transitioning immediately', segmentSummary(segment));
        session.loading(false);
        this.activateSession(session);
      }
      return session;
    }

    this.log.RETRY('Unable to find the session, make sure to add it before loading', segmentSummary(segment));
  }

  /**
   * Activates a session as the current playing session, handling DOM transitions
   * and event forwarding.
   * @param {SegmentSession} session - The session to activate
   * @param {Object} [options={}] - Activation options
   * @returns {Promise<void>}
   * @private
   */
  activateSession(session, options = {}) {
    const error = session.player ? session.player.getError() : 'missing player';

    if (error) {
      session.player?.closing();
      this.log.error('Transitioning to next segment failed. Session is in the error state.', {
        srcmid: this.currentSession.currentSegment.R,
        mid: session.currentSegment.R,
        error,
        xid: session.player?.cB(),
      });
      return Promise.reject();
    }

    this.log.pauseTrace('Playing episode', segmentSummary(session.currentSegment));

    const previousSession = this.currentSession;
    this.currentSession = session;
    const newPlayer = this.currentSession.player;
    newPlayer.w5a(false);
    this.transferEventListeners(newPlayer, previousSession?.player);

    if (previousSession?.player) {
      const oldElement = previousSession.player.getConfiguration();
      const newElement = newPlayer.getConfiguration();
      oldElement.style.display = 'none';

      const closePromise = previousSession.closing();
      this.containerElement.appendChild(newElement);
      closePromise.then(() => {
        if (oldElement.parentElement) {
          oldElement.parentElement.removeChild(oldElement);
        }
      });

      newElement.style.display = 'block';
      newPlayer.qBa(options);
      newPlayer.q4();
      newPlayer.playing();
    }

    return Promise.resolve();
  }

  /**
   * Checks queued segments and preloads the next one if playback time is near the end.
   * @param {SegmentSession} currentSession
   * @private
   */
  checkQueueForPreload(currentSession) {
    if (!this.queuedSegments.length || !currentSession.player) return;

    const currentTime = currentSession.player.XH();
    const nextQueued = this.queuedSegments[0];
    const logicalEnd = this.currentSession.currentSegment.logicalEnd;
    const loadImmediately = this.currentSession.currentSegment.manifestSessionData?.fva;

    if (logicalEnd || loadImmediately) {
      let triggerTime;
      if (loadImmediately) {
        triggerTime = 0;
      } else if (logicalEnd) {
        triggerTime = logicalEnd - this.config.rCb();
      }

      if (currentTime !== null && currentTime >= triggerTime) {
        this.log.info('Got a time change, loading the next player', segmentSummary(nextQueued.currentSegment));
        this.loadNextEpisode(nextQueued.currentSegment);
        this.queuedSegments.splice(0, 1);
        this.checkQueueForPreload(currentSession);
      }
    }
  }

  /**
   * Finds an existing session by segment movie ID.
   * @param {Object} segment
   * @returns {SegmentSession|undefined}
   * @private
   */
  findSession(segment) {
    if (this.currentSession.currentSegment.R === segment.R) {
      return this.currentSession;
    }
    return this.queuedSegments.find((s) => s.currentSegment.R === segment.R);
  }

  /**
   * Merges new segment data into an existing segment.
   * @param {Object} existing - The existing segment data
   * @param {Object} update - The new segment data to merge
   * @private
   */
  mergeSegmentData(existing, update) {
    existing.startPts = update.startPts || existing.startPts;
    existing.logicalEnd = update.logicalEnd || existing.logicalEnd;
    existing.manifestSessionData = update.manifestSessionData || existing.manifestSessionData;
    existing.manifestRef = update.manifestRef || existing.manifestRef;
  }

  /**
   * Creates a new SegmentSession for the given segment.
   * @param {Object} segment
   * @returns {SegmentSession}
   * @private
   */
  createSession(segment) {
    return new SegmentSession(
      this.log, this.config, this.timeWatcher, this.playerFactory,
      this.viewableConfig, this.ufa, this, segment, this.containerElement,
      this.aseGcSettings, this.indexManager
    );
  }

  /**
   * Transfers event forwarding listeners from the old player to the new player.
   * @param {Object} newPlayer
   * @param {Object} [oldPlayer]
   * @private
   */
  transferEventListeners(newPlayer, oldPlayer) {
    this.eventForwarders.forEach((binding) => {
      if (oldPlayer) {
        oldPlayer.removeEventListener(binding.event, binding.handler);
      }
      newPlayer.addEventListener(binding.event, binding.handler);
    });
    this.eventBus.emit(PlayerEvents.JX.internal_Rga, { player: newPlayer });
  }
}
