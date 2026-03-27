/**
 * Netflix Cadmium Player — Prioritized Request Cache
 *
 * A priority-aware cache for media download requests. Manages a queue of
 * pending requests with priority ordering, supports abort via AbortController,
 * and deduplicates requests by key. Used to coordinate prefetch and
 * on-demand media segment downloads.
 *
 * @module streaming/PrioritizedRequestCache
 * @original Module_49690
 */

import { __assign } from '../ads/AdBreakMismatchLogger.js'; // tslib helpers
import { AbortController } from '../modules/Module_41674.js'; // abort controller polyfill
import { internal_Jka as LruCache } from '../modules/Module_57086.js'; // LRU cache implementation
import { iFa as PriorityQueue } from '../modules/Module_67442.js'; // priority queue

/**
 * A prioritized, deduplicated request cache for media segment downloads.
 *
 * Wraps a priority queue and an LRU cache to manage download requests.
 * Requests are keyed for deduplication - requesting the same key returns
 * the existing in-flight request. Supports urgency promotion (marking
 * a request as required bumps its priority).
 */
export class PrioritizedRequestCache {
  /**
   * @param {object} console - Logger instance.
   * @param {object} requestExecutor - Executor that performs the actual download (fDc method).
   * @param {number|boolean} maxSize - Maximum cache size / live mode flag.
   */
  constructor(console, requestExecutor, maxSize) {
    /** @private */
    this.console = console;
    /** @private */
    this.requestExecutor = requestExecutor;
    /** @private */
    this.maxSize = maxSize;

    /**
     * Priority queue for managing request ordering.
     * @private
     */
    this.priorityQueue = new PriorityQueue(console, { Ig: maxSize });

    /**
     * LRU cache for deduplicating requests by key.
     * @private
     */
    this.lruCache = new LruCache(console, 'pri-cache');
  }

  /**
   * Get cache statistics.
   *
   * @returns {{maxSize: *, activeItemsLength: number, queueSize: number}}
   */
  getStats() {
    return {
      maxSize: this.maxSize,
      activeItemsLength: this.priorityQueue.GY,
      queueSize: this.priorityQueue.mF,
    };
  }

  /**
   * Number of active (in-flight) items.
   * @type {number}
   */
  get activeItemCount() {
    return this.priorityQueue.GY;
  }

  /**
   * Number of queued (waiting) items.
   * @type {number}
   */
  get queueSize() {
    return this.priorityQueue.mF;
  }

  /**
   * Remove a cached request entry by key, cancelling it if in-flight.
   *
   * @param {string} key - Cache key to invalidate.
   */
  remove(key) {
    if (this.lruCache.has(key)) {
      this.lruCache.delete(key);
    }
  }

  /**
   * Request a media segment by key. Returns existing entry if cached,
   * otherwise creates a new prioritized download request.
   *
   * @param {object} requestDescriptor - Request descriptor.
   * @param {string} requestDescriptor.key - Unique cache key.
   * @param {number} requestDescriptor.priority - Request priority.
   * @param {boolean} requestDescriptor.required - Whether this is an urgent request.
   * @returns {object} Cached entry with value (promise) and promote method.
   */
  request(requestDescriptor) {
    const self = this;
    const descriptor = __assign({}, requestDescriptor);

    const entry = this.lruCache.eWa(descriptor.key, () => {
      const abortController = new AbortController();

      let promoteCallback = () => {
        descriptor.required = true;
        queueEntry.uT();
      };

      const queueItem = {
        Vv: abortController.signal,
        LFb: () => {
          self.console.pauseTrace('Invoking pri-cache', {
            key: descriptor.key,
            sya: descriptor.priority,
            Rkd: descriptor.required,
          });

          const download = self.requestExecutor.fDc(descriptor, abortController.signal);

          if (descriptor.required) {
            download.uT();
          }

          promoteCallback = () => download.uT();

          return download.item;
        },
        priority: descriptor.priority,
      };

      const queueEntry = self.priorityQueue.item(queueItem);

      return {
        value: __assign(__assign({}, queueEntry), {
          uT: () => {
            promoteCallback?.();
          },
        }),
        tN: () => {
          self.console.pauseTrace('pri-cache item removal', {
            key: descriptor.key,
          });
          abortController.abort();
          self.priorityQueue.item(queueItem);
        },
      };
    });

    if (requestDescriptor.required) {
      entry.value.uT();
    }

    return entry;
  }

  /**
   * Clear all cached requests, aborting any in-flight downloads.
   */
  clear() {
    this.lruCache.clear();
    this.priorityQueue.clear();
  }
}

export { PrioritizedRequestCache };
