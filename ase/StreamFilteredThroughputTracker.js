/**
 * Netflix Cadmium Player - Stream-Filtered Throughput Tracker
 *
 * Wraps a throughput measurement filter and restricts its operation
 * to specific CDN streams. Tracks active request count per filtered
 * stream and triggers timer callbacks when all requests complete.
 *
 * @module ase/StreamFilteredThroughputTracker
 */

/**
 * Filters throughput tracking events to only process those matching
 * a set of allowed CDN stream IDs. Delegates actual measurement to
 * an inner filter while managing per-stream request counting.
 */
export class StreamFilteredThroughputTracker {
  /**
   * @param {Object} innerFilter - The underlying throughput filter to delegate to.
   * @param {string[]} allowedStreamIds - List of CDN stream IDs to track.
   */
  constructor(innerFilter, allowedStreamIds) {
    /** @type {number} Count of in-flight requests for tracked streams */
    this.activeRequestCount = 0;
    /** @type {Object} The wrapped throughput filter */
    this.innerFilter = innerFilter;
    /** @type {string[]} CDN stream IDs this tracker monitors */
    this.allowedStreamIds = allowedStreamIds;
  }

  /**
   * Checks whether the given stream matches any of the allowed CDN stream IDs.
   *
   * @param {Object} stream - Stream object with optional cdnId.cprStreamId.
   * @returns {boolean} True if the stream is in the allowed set.
   */
  isTrackedStream(stream) {
    return (
      this.allowedStreamIds.filter(
        (id) => id === stream.cdnId?.cprStreamId
      ).length > 0
    );
  }

  /**
   * Records a throughput data item if the stream is tracked.
   *
   * @param {number} timestamp - Measurement timestamp.
   * @param {number} bytes - Bytes transferred.
   * @param {number} duration - Transfer duration.
   * @param {Object} stream - The stream being measured.
   */
  item(timestamp, bytes, duration, stream) {
    if (this.isTrackedStream(stream)) {
      this.innerFilter.item(timestamp, bytes, duration, stream);
    }
  }

  /**
   * Signals the start of a measurement period for a tracked stream.
   *
   * @param {number} timestamp - Start timestamp.
   * @param {Object} stream - The stream being measured.
   */
  start(timestamp, stream) {
    if (this.innerFilter.start && this.isTrackedStream(stream)) {
      this.innerFilter.start(timestamp);
    }
  }

  /**
   * Triggers the ASE timer callback if the stream is tracked.
   *
   * @param {number} timestamp - Timer timestamp.
   * @param {Object} stream - The stream context.
   */
  aseTimer(timestamp, stream) {
    if (this.innerFilter.aseTimer && this.isTrackedStream(stream)) {
      this.innerFilter.aseTimer(timestamp);
    }
  }

  /**
   * Retrieves the key from the inner filter.
   *
   * @param {*} identifier - Key identifier.
   * @returns {*} The key value from the inner filter.
   */
  key(identifier) {
    if (this.innerFilter.key) {
      return this.innerFilter.key(identifier);
    }
  }

  /**
   * Flushes the inner filter's log batch.
   */
  logBatcher() {
    if (this.innerFilter.logBatcher) {
      this.innerFilter.logBatcher();
    }
  }

  /**
   * Resets the tracker, clearing the active request count and
   * reinitializing the inner filter.
   */
  create() {
    this.activeRequestCount = 0;
    if (this.innerFilter.create) {
      this.innerFilter.create();
    }
  }

  /**
   * Records the start of a request for a tracked stream.
   * Increments the active request counter.
   *
   * @param {number} timestamp - Request start timestamp.
   * @param {Object} stream - The stream being requested.
   */
  recordRequestStart(timestamp, stream) {
    if (this.isTrackedStream(stream)) {
      this.activeRequestCount += 1;
      if (this.innerFilter.recordRequestStart) {
        this.innerFilter.recordRequestStart(timestamp, stream);
      }
    }
  }

  /**
   * Records the completion of a request for a tracked stream.
   * Decrements the active request counter and fires the ASE timer
   * when all tracked requests have completed.
   *
   * @param {number} timestamp - Request completion timestamp.
   * @param {*} _unused - Unused parameter (kept for interface compatibility).
   * @param {Object} stream - The stream that completed.
   */
  recordRequestComplete(timestamp, _unused, stream) {
    if (this.isTrackedStream(stream)) {
      this.activeRequestCount = Math.max(this.activeRequestCount - 1, 0);
      if (this.activeRequestCount === 0) {
        this.aseTimer(timestamp, stream);
      }
      if (this.innerFilter.recordRequestComplete) {
        this.innerFilter.recordRequestComplete(timestamp, stream);
      }
    }
  }
}
