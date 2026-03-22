/**
 * Netflix Cadmium Player - DAI Prefetcher
 *
 * Manages Dynamic Ad Insertion (DAI) prefetching for live streams.
 * Pre-fetches ad break metadata and auxiliary manifests before they're needed,
 * enabling seamless ad insertion during live playback.
 *
 * Handles speculative ad break queues, prefetch scheduling, manifest window
 * management, and ad break hydration when live ad breaks are encountered.
 *
 * @module ads/DaiPrefetcher
 */

/**
 * Internal prefetch state machine states.
 * @enum {number}
 */
const PrefetchState = {
  INITIAL: 0,
  PENDING: 1,
  SUCCESS: 2,
  FAILED: 3,
};

/**
 * DAI hydration result status.
 * @enum {number}
 */
export const DaiHydrationStatus = {
  SUCCESS: 0,
  MISSED_OPPORTUNITY: 1,
};

/**
 * Prefetches DAI ad break metadata for live streams.
 *
 * Schedules prefetch requests based on ad break timing windows,
 * manages auxiliary manifest leases, and provides speculative
 * ad break data for the ad composer.
 *
 * Events emitted:
 * - daiPrefetchComplete: Prefetch request succeeded
 * - daiPrefetchFailed: Prefetch request failed
 */
export class DaiPrefetcher {
  /**
   * @param {Object} viewableSession - The live viewable session context.
   * @param {Object} engineScheduler - Scheduler for timed tasks.
   * @param {Object} viewableManager - Manager for creating auxiliary viewables.
   * @param {Object} playerAdManager - Player-level ad manager for break events.
   * @param {Object} playgraph - The active playgraph instance.
   * @param {Object} loggerContext - Logger context for scoped console.
   */
  constructor(
    viewableSession,
    engineScheduler,
    viewableManager,
    playerAdManager,
    playgraph,
    loggerContext
  ) {
    /** @type {Object} */
    this.viewableSession = viewableSession;
    /** @type {Object} */
    this.engineScheduler = engineScheduler;
    /** @type {Object} */
    this.viewableManager = viewableManager;
    /** @type {Object} */
    this.playerAdManager = playerAdManager;
    /** @type {Object} */
    this.playgraph = playgraph;
    /** @type {Map<string, Object>} Hydrated ad break containers by trigger ID */
    this.hydratedContainers = new Map();
    /** @type {number} Current prefetch state */
    this.prefetchState = PrefetchState.INITIAL;
    /** @type {boolean} Whether prefetching is enabled */
    this.isEnabled = true;
    /** @type {Object} Speculative ad break data */
    this.speculativeData = { adBreaks: new Map(), orderedQueues: [] };
    /** @type {Array<Object>} Scheduled tasks for cleanup */
    this.scheduledTasks = [];
    /** @type {Object} Event emitter */
    this.events = new EventEmitter();
  }

  /** @type {boolean} */
  get enabled() {
    return this.isEnabled;
  }

  set enabled(value) {
    if (this.isEnabled !== value) {
      this.isEnabled = value;
      this.scheduledPrefetchTask?.reschedule();
    }
  }

  /**
   * Check if a DAI prefetch failed for a specific ad break index.
   * @param {number} adBreakIndex
   * @returns {boolean}
   */
  wasDaiPrefetchFailed(adBreakIndex) {
    return (
      this.knownAdBreakTriggerIds.length === adBreakIndex + 1 &&
      this.prefetchState === PrefetchState.FAILED
    );
  }

  /**
   * Get all hydrated ad break containers.
   * @returns {Map<string, Object>}
   */
  getHydratedContainers() {
    return this.hydratedContainers;
  }

  /**
   * Handle ad break hydration when a live ad break is encountered.
   * Matches the trigger ID to speculative data and records the result.
   *
   * @param {string} triggerId - The ad break trigger ID.
   * @param {Object} adBreakMetadata - The ad break metadata from media events.
   */
  onAdBreakEncountered(triggerId, adBreakMetadata) {
    const hasSpeculativeData = this.speculativeData.adBreaks.has(triggerId);
    const isInQueue = this.speculativeData.orderedQueues.some(
      (q) => q[0] === triggerId
    );

    if (hasSpeculativeData && isInQueue) {
      const speculativeAdBreak = this.speculativeData.adBreaks.get(triggerId);

      this.hydratedContainers.set(triggerId, {
        status: DaiHydrationStatus.SUCCESS,
        adBreak: speculativeAdBreak,
      });

      this.speculativeData.adBreaks.delete(triggerId);
    } else if (this.prefetchState === PrefetchState.PENDING) {
      this.hydratedContainers.set(triggerId, {
        status: DaiHydrationStatus.MISSED_OPPORTUNITY,
      });
    }
  }

  /**
   * Remove hydrated containers for ad breaks that have been played.
   * @param {Array<Object>} adBreaks - Ad breaks to clean up.
   */
  cleanupPlayedAdBreaks(adBreaks) {
    adBreaks.forEach((adBreak) => {
      const triggerId = adBreak.triggerId?.();
      if (triggerId) {
        this.hydratedContainers.delete(triggerId);
      }
    });
  }

  /**
   * Schedule ad break hydration (triggered externally).
   */
  scheduleAdBreakHydration() {
    if (!this.scheduledPrefetchTask?.isCancelled) {
      this.scheduledPrefetchTask?.reschedule();
    }
  }

  /**
   * Clean up all resources.
   */
  destroy() {
    this.pendingRequest?.abortController.abort();
    this.scheduledPrefetchTask?.destroy();
    this.eventSubscriptions?.clear();

    for (const task of this.scheduledTasks) {
      task.destroy();
    }
    this.scheduledTasks = [];
  }
}
