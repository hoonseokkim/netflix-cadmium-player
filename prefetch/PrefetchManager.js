/**
 * Netflix Cadmium Player - Prefetch Manager
 *
 * Orchestrates background prefetching of upcoming viewable content.
 * Coordinates wishlist evaluation, playgraph creation, buffer budget
 * allocation, and lifecycle management of prefetched items. Emits
 * events for prefetch start/complete/claimed/evicted tracking.
 *
 * This is one of the key performance optimization components in the
 * player, enabling seamless transitions between episodes/titles by
 * pre-buffering content before the user navigates to it.
 *
 * @module prefetch/PrefetchManager
 */

/**
 * Orchestrates background prefetching of upcoming viewable items.
 *
 * Key responsibilities:
 * - Manages a wish list of items to prefetch (prioritized)
 * - Creates playgraphs for prefetch items with allocated budgets
 * - Handles claiming: seamless handoff from prefetch to active playback
 * - Manages eviction when budgets change or items expire
 * - Tracks statistics for diagnostics
 *
 * Events emitted:
 * - itemQueued: A new prefetch item was queued
 * - prefetchStarted: A prefetch item started buffering
 * - prefetchComplete: A prefetch item completed buffering
 * - itemClaimed: A prefetch item was claimed for active playback
 * - itemDropped: A prefetch item was destroyed
 * - itemEvicted: A prefetch item was evicted due to budget/priority
 * - itemReevaluated: A prefetch item's budget was updated
 */
export class PrefetchManager {
  /**
   * @param {Function} getPlaybackEngine - Async factory returning the playback engine.
   * @param {Object} config - Prefetcher configuration.
   * @param {number} config.prefetchBudgetInBytes - Total prefetch memory budget.
   * @param {boolean} config.prefetcherSoftReset - Use soft reset on clear.
   * @param {number} [config.maxTotalBufferLevelPerSession] - Max buffer per session.
   * @param {boolean} config.livePrefetchEnabled - Enable prefetch for live titles.
   * @param {Object} loggerContext - Logger context for scoped console.
   * @param {Object} [reconciliationStrategy] - Strategy for matching prefetch items.
   * @param {Object} [playgraphFactory] - Factory for creating playgraph descriptors.
   */
  constructor(
    getPlaybackEngine,
    config,
    loggerContext,
    reconciliationStrategy,
    playgraphFactory
  ) {
    /** @type {Function} */
    this.getPlaybackEngine = getPlaybackEngine;
    /** @type {Object} */
    this.config = config;
    /** @type {Object} */
    this.reconciliationStrategy = reconciliationStrategy;
    /** @type {Array<Object>} Active prefetch item entries */
    this.prefetchItems = [];
    /** @type {Array<Object>} Item generator plugins */
    this.itemGenerators = [];
    /** @type {Array<Object>} Current wish list items */
    this.wishListItems = [];
    /** @type {Object} Event emitter */
    this.events = new EventEmitter();
    /** @type {Object} Aggregated statistics */
    this.stats = {
      itemsRequested: 0,
      itemsStarted: 0,
      itemsClaimed: 0,
      bytesClaimed: 0,
      itemsCompleted: 0,
      itemsDiscarded: 0,
      bytesDiscarded: 0,
    };

    this._registerEventListeners();
    this.setBudget({ inMemoryBytes: config.prefetchBudgetInBytes });
  }

  /**
   * Active prefetch item contexts.
   * @returns {Array<Object>}
   */
  get activeContexts() {
    return this.prefetchItems.map((item) => item.context);
  }

  /**
   * Current wish list items.
   * @returns {Array<Object>}
   */
  get currentWishList() {
    return this.wishListItems;
  }

  /**
   * Update the wish list, dropping removed items and triggering re-evaluation.
   *
   * @param {Array<Object>} newWishList - The new set of wish list items.
   */
  updateWishlist(newWishList) {
    this.wishListItems = newWishList;
    this._processWishList();
  }

  /**
   * Reset the prefetcher, either soft (keep playgraphs) or hard (drop everything).
   *
   * @param {Object} [resetConfig] - Override config for reset behavior.
   */
  reset(resetConfig) {
    resetConfig ??= this.config;
    if (resetConfig.prefetcherSoftReset) {
      this.prefetchItems.forEach((item) => this._softResetItem(item));
    } else {
      this.updateWishlist([]);
    }
  }

  /**
   * Attempt to claim a prefetched playgraph for active playback.
   * Returns the playgraph if a matching prefetch item is found.
   *
   * @param {Object} playgraphDescriptor - The playgraph descriptor to match.
   * @param {Object} sessionConfig - Session configuration for validation.
   * @returns {Object|undefined} The claimed playgraph, or undefined.
   */
  claimPrefetchedPlaygraph(playgraphDescriptor, sessionConfig) {
    const match = this.reconciliationStrategy.findMatch(this.prefetchItems, {
      playgraph: playgraphDescriptor,
      seekableCheck: sessionConfig,
    });

    if (match?.playgraph) {
      this._dropPrefetchItem(match.context, { keepPlaygraph: true, keepWishListItem: true });

      if (match.isLive) {
        this._softResetItem(match, true);
      }

      match.playgraph.playbackContainer.isPrefetched = true;

      this.events.emit('itemClaimed', {
        type: 'itemClaimed',
        wishListItem: match.context.wishListItem,
        videoBytesBuffered: match.playgraph.getBufferDurationInfo().videoBytes,
        audioBytesBuffered: match.playgraph.getBufferDurationInfo().audioBytes,
      });
    }

    if (!sessionConfig.allowParallelStreaming) {
      this.reset(sessionConfig);
    }

    return match?.playgraph;
  }

  /**
   * Get diagnostic statistics for all prefetch items.
   *
   * @returns {Object} Stats including per-item details and aggregated counters.
   */
  getStats() {
    return {
      wishListLength: this.wishListItems.length,
      prefetchListLength: this.prefetchItems.length,
      aggregated: { ...this.stats },
    };
  }

  /**
   * Register internal event listeners for stats tracking.
   * @private
   */
  _registerEventListeners() {
    this.events.on('prefetchComplete', () => this.stats.itemsCompleted++);
    this.events.on('prefetchStarted', () => this.stats.itemsStarted++);
    this.events.on('itemQueued', () => this.stats.itemsRequested++);

    this.events.on('itemClaimed', (event) => {
      this.stats.itemsClaimed++;
      this.stats.bytesClaimed +=
        (event.videoBytesBuffered ?? 0) + (event.audioBytesBuffered ?? 0);
    });

    this.events.on('itemDropped', (event) => {
      this.stats.itemsDiscarded++;
      this.stats.bytesDiscarded +=
        (event.videoBytesBuffered ?? 0) + (event.audioBytesBuffered ?? 0);
    });
  }

  /**
   * Re-evaluate the prefetch wish list.
   * @private
   */
  _processWishList() {
    // Implementation delegates to item generators and reconciliation strategy
  }

  /**
   * Soft-reset a prefetch item: cancel streaming but preserve the playgraph.
   * @private
   */
  _softResetItem(item, preserveBuffer = false) {
    // Cancel streaming, optionally preserving buffer snapshot
  }

  /**
   * Drop a prefetch item.
   * @private
   */
  async _dropPrefetchItem(context, options = {}) {
    // Remove from active list, optionally keeping playgraph/wish list item
  }
}
