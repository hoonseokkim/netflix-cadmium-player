/**
 * Netflix Cadmium Player - Prefetch Wishlist Builder
 *
 * Generates prioritized prefetch wishlists from a set of candidate viewable items.
 * Allocates buffer budgets based on total prefetch budget and data rate estimates.
 *
 * @module prefetch/PrefetchWishlistBuilder
 */

/**
 * Default bytes-per-second estimate for calculating per-item buffer budgets.
 * 625 KB/s = ~5 Mbps.
 * @type {number}
 */
export const DEFAULT_PREFETCH_BYTES_PER_SECOND = 625_000;

/**
 * Builds prefetch wishlists with per-item buffer budgets and media stream filters.
 */
export class PrefetchWishlistBuilder {
  /**
   * @param {Object} consoleContext - Logger context for creating scoped consoles.
   * @param {Object} config - Prefetcher configuration.
   * @param {number} config.defaultHeaderCacheSize - Max number of items to prefetch.
   * @param {number} [config.dataPrefetchDurationMs] - Override data prefetch duration in ms.
   * @param {number} config.defaultHeaderCacheDataPrefetchMs - Default data prefetch duration.
   * @param {number} [config.maxTotalBufferLevelPerSession] - Max buffer bytes per session.
   */
  constructor(consoleContext, config) {
    /** @type {Object} */
    this.console = consoleContext;
    /** @type {Object} */
    this.config = config;
  }

  /**
   * Create a prioritized prefetch wishlist from the current wish list items and budget.
   *
   * Items are sorted by priority, sliced to the maximum count, and each
   * receives a buffer budget based on the data rate estimate and total budget.
   *
   * @param {Object} input - Input parameters.
   * @param {Array<Object>} input.wishListItems - Candidate items sorted by priority.
   * @param {Object} input.totalBudget - Total budget with `inMemoryBytes` field.
   * @returns {Object} Object with `prefetchItems` array of prefetch item contexts.
   */
  createPrefetchWishlist(input) {
    const maxItems = this.config.defaultHeaderCacheSize;
    const dataPrefetchDurationMs =
      this.config.dataPrefetchDurationMs ||
      this.config.defaultHeaderCacheDataPrefetchMs;
    const hasBudget =
      input.totalBudget.inMemoryBytes > 0 &&
      input.totalBudget.inMemoryBytes !== Infinity;

    // Calculate per-item buffer budget based on data rate estimate
    const bytesPerItem = hasBudget
      ? (dataPrefetchDurationMs * DEFAULT_PREFETCH_BYTES_PER_SECOND) / 1000
      : this.config.maxTotalBufferLevelPerSession || Infinity;

    // How many items can fit in the budget
    const budgetItemCount = hasBudget
      ? Math.floor(input.totalBudget.inMemoryBytes / bytesPerItem)
      : maxItems;

    return {
      prefetchItems: input.wishListItems
        .sort((a, b) => a.priority - b.priority)
        .slice(0, maxItems)
        .map((wishListItem, index) => {
          const sessionConfig = wishListItem.key.config;
          return {
            bufferBudget: {
              inMemoryBytes:
                index > budgetItemCount - 1 ? 0 : bytesPerItem,
            },
            wishListItem,
            prefetchWeight: 1,
            seekableCheck: sessionConfig,
            mediaStreamFilters: {
              audioBufferedSegments: [],
              videoBufferedSegments: [],
            },
          };
        }),
    };
  }
}
