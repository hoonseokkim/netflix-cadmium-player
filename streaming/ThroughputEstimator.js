/**
 * Netflix Cadmium Player — Throughput Estimator
 *
 * Estimates network throughput by tracking downloaded data size and
 * time intervals. Maintains a sliding window of recent download segments
 * and computes bandwidth as total bytes downloaded over elapsed time.
 *
 * Used by the ABR algorithm to gauge available network capacity for
 * stream selection decisions.
 *
 * @module streaming/ThroughputEstimator
 * @original Module_53205
 */

import { __decorate, __param } from '../ads/AdBreakMismatchLogger.js'; // tslib decorators
import { injectable, injectDecorator } from '../ads/AdBreakMismatchLogger.js'; // DI framework
import { seekToSample as ZERO_BYTES, fetchPayload as BYTES_UNIT } from '../ase/ThroughputSample.js'; // byte units
import { seekToSample as ZERO_DURATION, MILLISECONDS } from '../drm/LicenseBroker.js'; // time units
import { xmb as ThroughputConfigToken } from '../modules/Module_22692.js'; // DI token

/**
 * Estimates throughput from a bounded window of download samples.
 *
 * Tracks cumulative download size and a queue of time intervals. When
 * queried, flushes pending intervals and computes throughput as
 * (totalBytes / totalTime).
 */
class ThroughputEstimator {
  /**
   * @param {object} config - Throughput estimator configuration.
   * @param {number} config.cpc - Maximum number of intervals to keep.
   */
  constructor(config) {
    /** @private */
    this.config = config;

    /**
     * Cumulative download size.
     * @private
     */
    this.totalDownloadSize = ZERO_BYTES;

    /**
     * Pending time intervals to process.
     * @private
     * @type {Array<{start: *, end: *}>}
     */
    this.pendingIntervals = [];

    /**
     * Earliest tracked timestamp.
     * @private
     * @type {*|undefined}
     */
    this.earliestTimestamp = undefined;

    /**
     * Latest tracked timestamp.
     * @private
     * @type {*|undefined}
     */
    this.latestTimestamp = undefined;
  }

  /**
   * Get the current throughput estimate.
   *
   * Flushes any pending intervals, then computes throughput as
   * totalDownloadSize / elapsed time.
   *
   * @returns {{m7a: number, med: number}} Object with:
   *   - m7a: Estimated throughput (bytes per millisecond), floored.
   *   - med: Elapsed time window in milliseconds.
   */
  getAvailableBandwidth() {
    // Flush all pending intervals
    while (this.pendingIntervals.length > 0) {
      const interval = this.pendingIntervals.shift();
      this.processInterval(interval);
    }

    const elapsed = (this.earliestTimestamp === undefined || this.latestTimestamp === undefined)
      ? ZERO_DURATION
      : this.latestTimestamp.lowestWaterMarkLevelBufferRelaxed(this.earliestTimestamp);

    const throughput = elapsed.EGb()
      ? 0
      : this.totalDownloadSize.toUnit(BYTES_UNIT) / elapsed.toUnit(MILLISECONDS);

    return {
      m7a: Math.floor(throughput),
      med: elapsed.toUnit(MILLISECONDS),
    };
  }

  /**
   * Record a new download sample.
   *
   * @param {object} sample - Download sample.
   * @param {object} sample.size - Size of downloaded data.
   * @param {object} sample.apc - Time interval {start, end}.
   */
  addSample(sample) {
    this.totalDownloadSize = this.totalDownloadSize.item(sample.size);
    this.pendingIntervals.push(sample.apc);

    // Keep intervals sorted by start time
    this.pendingIntervals.sort((a, b) => a.start.xl(b.start));

    // Evict oldest intervals if over capacity
    while (this.pendingIntervals.length > this.config.cpc) {
      const evicted = this.pendingIntervals.shift();
      this.processInterval(evicted);
    }
  }

  /**
   * Process a time interval, updating earliest/latest timestamps.
   *
   * @param {object} interval - Time interval with start and end.
   * @private
   */
  processInterval(interval) {
    // Initialize earliest if not set
    if (this.earliestTimestamp === undefined) {
      this.earliestTimestamp = interval.start;
    }

    // Extend earliest if there's a gap (interval started before current latest)
    if (this.latestTimestamp !== undefined && this.latestTimestamp.xl(interval.start) > 0) {
      this.earliestTimestamp = this.earliestTimestamp.item(
        interval.start.lowestWaterMarkLevelBufferRelaxed(this.latestTimestamp),
      );
    }

    // Update latest timestamp
    if (this.latestTimestamp === undefined || this.latestTimestamp.xl(interval.end) > 0) {
      this.latestTimestamp = interval.end;
    }
  }
}

export { ThroughputEstimator };

// Apply DI decorators
const DecoratedThroughputEstimator = __decorate(
  [
    injectable(),
    __param(0, injectDecorator(ThroughputConfigToken)),
  ],
  ThroughputEstimator,
);

export { DecoratedThroughputEstimator };
