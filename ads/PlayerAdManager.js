/**
 * Netflix Cadmium Player - Player Ad Manager
 *
 * Manages ad break lifecycle at the player level: detects ad break boundaries,
 * emits events for ad break start/end/presenting, handles seek-during-ad logic,
 * and exposes ad container metadata to the UI layer.
 *
 * This is the primary ad management component that bridges the low-level
 * ad composer with the player session and UI layers.
 *
 * @module ads/PlayerAdManager
 */

/**
 * Build an event info object for ad break events.
 *
 * @param {Object} presentingInfo - The presenting info with position and adBreak.
 * @param {*} [playerTimestamp] - Optional player timestamp override.
 * @returns {Object} Event info payload.
 */
function buildAdBreakEventInfo(presentingInfo, playerTimestamp) {
  return {
    playerTimestamp: playerTimestamp || TimeUtil.ZERO,
    position: presentingInfo.position,
    adBreak: presentingInfo.adBreak.adBreakRef,
    adBreakData: presentingInfo.adBreak.adBreakRef,
  };
}

/**
 * Check if an ad break complete event was triggered by an empty ad break.
 * @param {Object} event - The ad break complete event.
 * @returns {boolean}
 */
export function isEmptyAdBreakComplete(event) {
  return !!event.emptyAdBreak;
}

/**
 * Check if an ad break complete event has full presenting info.
 * @param {Object} event - The ad break complete event.
 * @returns {boolean}
 */
export function hasAdBreakPresentingInfo(event) {
  return !!event.presentingInfo;
}

/**
 * Check if an ad break complete event is anonymous (no ad break reference).
 * @param {Object} event - The ad break complete event.
 * @returns {boolean}
 */
export function isAnonymousAdBreakComplete(event) {
  return !event.emptyAdBreak && !event.presentingInfo;
}

/**
 * Player-level ad manager that tracks ad break transitions and emits
 * lifecycle events consumed by the UI and analytics layers.
 *
 * Events emitted:
 * - adBreakPresenting: An ad break has started presenting
 * - adPresenting: An individual ad within a break is presenting
 * - adBreakFallback: A dynamic ad fell back to embedded
 * - adBreakComplete: An ad break has completed
 * - adBreakEnded: An ad break has fully ended
 * - adPlaygraphUpdated: Ad playgraph data was updated
 * - segmentDropped: An ad segment was dropped due to error
 * - advertsMismatch: Ad metadata mismatch detected
 */
export class PlayerAdManager {
  /**
   * @param {Object} playbackContainer - Container for the active playback instance.
   * @param {Object} playerSession - The player session wrapper.
   * @param {Object} loggerContext - Context for scoped logging.
   * @param {Object} viewableSessionMap - Map of viewable session IDs to sessions.
   */
  constructor(playbackContainer, playerSession, loggerContext, viewableSessionMap) {
    /** @type {Object} */
    this.playbackContainer = playbackContainer;
    /** @type {Object} */
    this.playerSession = playerSession;
    /** @type {Object} */
    this.viewableSessionMap = viewableSessionMap;
    /** @type {Object} Event subscription manager */
    this.eventSubscriptions = new ClockWatcher();
    /** @type {boolean} Whether the first segment has been reported */
    this.hasReportedSegment = false;
    /** @type {boolean} Whether the initial ad ping URL has been fired */
    this.hasFiredAdPing = false;
    /** @type {Object} Scoped console logger */
    this.console = createScopedConsole(loggerContext, 'PLAYERADMANAGER');
    /** @type {Object} Event emitter for ad lifecycle events */
    this.events = new EventEmitter();
    /** @type {Object|undefined} The currently active ad break, if any */
    this.currentAdBreak = undefined;

    this._bindEventListeners();
  }

  /**
   * Whether the player is currently within an ad break.
   * @returns {boolean}
   */
  get isInAdBreak() {
    return !!this.currentAdBreak;
  }

  /**
   * Reference to the ad composer (ad metadata manager).
   * @returns {Object}
   */
  get adComposer() {
    return this.playbackContainer.managerRef;
  }

  /**
   * Reference to the ad break player that resolves positions to ad breaks.
   * @returns {Object}
   */
  get adBreakPlayer() {
    return this.playbackContainer.adBreakPlayer;
  }

  /**
   * Whether seeking is allowed at the current playback position.
   * Seeking is blocked during non-embedded ad breaks unless explicitly enabled.
   *
   * @returns {boolean}
   */
  canSeek() {
    if (!this.playerSession.hasStarted || !this.playerSession.player.isPlaybackStarted) {
      return true;
    }

    const adBreakInfo = this.adBreakPlayer.getAdBreakAtPosition(
      this.playerSession.player.position
    );

    if (!adBreakInfo) return true;
    if (adBreakInfo.adBreak.type === 'embedded') return true;
    return adBreakInfo.adBreak.adBreakRef.playerControls.seekEnabled ?? true;
  }

  /**
   * Get the current player control state for the active ad break.
   *
   * @returns {Object} Player control state.
   */
  getPlayerControlState() {
    return this.currentAdBreak?.playerControls ?? {
      seekEnabled: undefined,
      playPauseEnabled: undefined,
      languageSelectionEnabled: undefined,
    };
  }

  /**
   * Query which viewable sessions have advertisements.
   *
   * @param {Object} [filter] - Optional filter with viewableIdList.
   * @returns {Object} Object with viewableIds array and per-viewable boolean result.
   */
  hasAdvertisements(filter) {
    const activeViewables = new Set(this.adComposer.getViewableIds());
    let viewableIds = Object.keys(this.adComposer.adBreaks).filter((id) =>
      activeViewables.has(id)
    );

    if (filter?.viewableIdList) {
      viewableIds = viewableIds.filter(
        (id) => filter.viewableIdList.indexOf(id) !== -1
      );
    }

    const result = {};
    viewableIds.forEach((id) => {
      result[id] = (this.adComposer.adBreaks[id]?.length ?? 0) > 0;
    });

    return { viewableIds, result };
  }

  /**
   * Get ad break containers with full ad metadata for UI consumption.
   *
   * @param {Object} [filter] - Optional filter with viewableIdList.
   * @returns {Object} Object with viewableIds array and per-viewable ad container data.
   */
  getAdsContainers(filter) {
    let viewableIds = this.adComposer.getViewableIds();
    const result = {};

    if (filter?.viewableIdList) {
      viewableIds = viewableIds.filter(
        (id) => filter.viewableIdList.indexOf(id) !== -1
      );
    }

    viewableIds.forEach((viewableId) => {
      let adBreakViews = this.adComposer.getAdBreaksForViewable(viewableId);
      if (!adBreakViews) return;

      const viewable = this.viewableSessionMap.key(Number(viewableId));
      const hasDaiAdverts =
        !!viewable?.isAdPlaygraph && !!viewable?.manifestRef.adverts?.hasAdverts;
      const adBreakStates = this.adComposer.adBreaks[viewableId];

      result[`${viewableId}`] = adBreakViews.map((view, index) => {
        const adBreakState = adBreakStates[index];

        const ads = view.ads?.map((ad) => {
          const stateEntry = adBreakState.duration.findLast(
            (entry) => entry.id === ad.id
          );
          return {
            ...ad,
            hasPlayed: stateEntry?.hasPlayed ?? false,
            isError: stateEntry?.isError ?? false,
          };
        });

        return {
          ...view,
          ads,
          hasCompletedPlayback: adBreakState.hasCompletedPlayback || hasDaiAdverts,
          isHiddenFromUser: adBreakState.hasCompletedPlayback || hasDaiAdverts,
        };
      });
    });

    return { viewableIds, result };
  }

  /**
   * Bind internal event listeners for player session and ad events.
   * @private
   */
  _bindEventListeners() {
    this.playerSession.events.on('playerChanged', () => this._onPlayerChanged());
    this._onPlayerChanged();

    this.playerSession.events.on('cancelingStreaming', () => {
      if (this.currentAdBreak) {
        const lastPosition = this.playerSession.player.lastKnownPosition;
        if (lastPosition) {
          this._onAdBreakEnded(lastPosition.position);
        } else {
          this.currentAdBreak = undefined;
        }
      }
    });

    this.playbackContainer.adPlaygraphEvents.on('adPlaygraphUpdated', (event) =>
      this.events.emit('adPlaygraphUpdated', event)
    );

    this.adComposer.events.on('adSegmentDropped', (event) =>
      this._onAdSegmentDropped(event)
    );

    this.adComposer.events.on('advertsMismatch', (event) =>
      this.events.emit('advertsMismatch', event)
    );
  }

  /**
   * Handle player instance changes by rebinding segment presentation listeners.
   * @private
   */
  _onPlayerChanged() {
    this.eventSubscriptions.clear();

    if (this.playerSession.hasStarted) {
      const player = this.playerSession.player;
      this.eventSubscriptions.addListener(
        player.events,
        'segmentPresenting',
        (event) => this._onSegmentPresenting(event)
      );
      this.eventSubscriptions.addListener(
        player.events,
        'playbackEnding',
        (event) => this._onPlaybackEnding(event)
      );
    }
  }

  /**
   * Emit adBreakEnded and clear the active ad break state.
   * @private
   */
  _onAdBreakEnded(position) {
    this.currentAdBreak = undefined;
    this.events.emit('adBreakEnded', {
      type: 'adBreakEnded',
      eventInfo: { position },
      playerControlState: this.getPlayerControlState(),
    });
  }
}
