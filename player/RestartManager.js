/**
 * Netflix Cadmium Player — Restart Manager
 *
 * Handles non-seamless playback transitions (restarts) when the player
 * cannot perform an in-place codec or segment switch.  Determines whether
 * a given media transition can be played seamlessly or requires a full
 * restart, considering codec mismatches and ad-break DRM constraints.
 *
 * @module RestartManager
 */

// Dependencies
// import { MediaType } from './modules/Module_45247';
// import { ea as ErrorCodes } from './modules/Module_36129';
// import { wb as DrmUtils } from './modules/Module_17612';

/**
 * Manages player restarts for non-seamless media transitions.
 */
export class RestartManager {
  /**
   * @param {object} playerState      - The current player state.
   * @param {object} config           - Restart configuration.
   * @param {object} loggerFactory    - Logger factory for creating loggers.
   */
  constructor(playerState, config, loggerFactory) {
    /** @private */ this.playerState = playerState;
    /** @private */ this.config = config;
    /** @private */ this.streamingSession = this.playerState.streamingSession;
    /** @private */ this.log = loggerFactory.createLogger("RestartManagerImpl");
  }

  /**
   * Determines whether a media transition can be played without a restart.
   *
   * - Video transitions always succeed seamlessly.
   * - Audio transitions are checked for ad/DRM and codec constraints.
   * - Other media types cannot be played seamlessly.
   *
   * @param {object} transition - The media transition descriptor.
   * @param {string} transition.mediaType - The media type being transitioned.
   * @returns {{ qu: boolean, reason?: string|object }}
   */
  canPlayCodec(transition) {
    const { mediaType } = transition;

    if (mediaType === MediaType.V) {
      return { qu: true };
    }

    if (mediaType === MediaType.U) {
      return this.#canPlayWithAds(transition);
    }

    return { qu: false, reason: "not-audio-not-video" };
  }

  /**
   * Performs a full player restart for a non-seamless transition.
   *
   * Pauses playback, resets the media source, restarts the ASE timer,
   * and reinitializes the streaming session.
   *
   * @param {object} mediaAttributesRecord - Media attributes for the restart.
   * @param {object} fromSegments          - Source segments keyed by media type.
   * @returns {Promise<void>}
   */
  reuseOnErrorCacheSize(mediaAttributesRecord, fromSegments) {
    const defaultSegment = fromSegments[MediaType.U] ?? fromSegments[MediaType.V];
    if (defaultSegment === undefined) {
      this.log.RETRY("No fromSegment for audio/video given in playgraph restart");
    }

    // Pause if not already paused
    if (!this.playerState.paused.value) {
      this.playerState.paused.set(true, { QB: true });
    }

    this.playerState.mediaSourceManager?.VZc();
    this.streamingSession.aseTimer();

    return this.playerState
      .handleStreamRestart()
      .then(() => this.streamingSession.fVc())
      .then(() => this.streamingSession.internal_Faa(this.playerState.R))
      .catch((error) => {
        this.log.error("Restart player for non-seamless transition failed.", {
          error,
          restartContext: {
            mediaAttributesRecord,
            fromSegments,
          },
        });
        this.playerState.fireError(ErrorCodes.PLAYER_RESTART, error);
      });
  }

  /**
   * Checks whether an audio transition can be played seamlessly,
   * considering ad-break DRM restrictions and codec mismatches.
   *
   * @private
   * @param {object} transition - The audio transition descriptor.
   * @returns {{ qu: boolean, reason?: string|object }}
   */
  #canPlayWithAds(transition) {
    let canPlay = true;
    const { fromSegment, toSegment, from, to } = transition;

    // Check if forced restart is needed for ads-to-content transitions
    if (fromSegment.M !== toSegment.M) {
      if (this.#isAdTransitionForced(fromSegment, toSegment, this.config.adBreakTransitionConfig)) {
        return { qu: false, reason: "testing-forced-ads-content" };
      }
    }

    // Check PlayReady DRM ad-break transition constraints
    if (fromSegment.M !== toSegment.M) {
      const encryptionKey = this.playerState.hm?.encryptionSession.observeKey ?? "";
      if (DrmUtils.g1(encryptionKey) &&
          this.#isAdTransitionForced(fromSegment, toSegment, this.config.playreadyAdsConfig)) {
        return { qu: false, reason: "playready-forced-ads-content" };
      }
    }

    // Check for codec mismatches between source and target profiles
    const { codecMismatchPatterns } = this.config;
    if (codecMismatchPatterns.length > 0) {
      codecMismatchPatterns.some((pattern) => {
        const regex = new RegExp(pattern);
        if ((regex.test(from.profile) && !regex.test(to.profile)) ||
            (regex.test(to.profile) && !regex.test(from.profile))) {
          canPlay = false;
          return true; // break
        }
        return false;
      });

      if (!canPlay) {
        return {
          qu: false,
          reason: { mediaType: "video", cause: "mismatch", details: "codec" },
        };
      }
    }

    return { qu: canPlay };
  }

  /**
   * Checks if a segment transition matches a forced-restart pattern
   * (e.g., "adtocontent" or "contenttoad").
   *
   * @private
   * @param {object} fromSegment - Source segment reference.
   * @param {object} toSegment   - Target segment reference.
   * @param {string[]} patterns  - Lowercase transition patterns to match.
   * @returns {boolean}
   */
  #isAdTransitionForced(fromSegment, toSegment, patterns) {
    const segmentMap = this.streamingSession.playgraphSegmentMap;
    const fromType = segmentMap?.segments[fromSegment.M]?.type;
    const toType = segmentMap?.segments[toSegment.M]?.type;
    const transitionKey = `${fromType}to${toType}`;

    return patterns
      .map((p) => p.toLowerCase())
      .includes(transitionKey.toLowerCase());
  }
}
