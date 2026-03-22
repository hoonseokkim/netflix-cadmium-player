/**
 * Netflix Cadmium Player - ASE Sliding Window Throughput Estimators
 *
 * Provides sliding-window based throughput estimators for the adaptive
 * streaming engine. Three variants handle different scenarios:
 * - SlidingWindowEstimator: Basic time-windowed throughput
 * - PausableSlidingWindowEstimator: Handles pause/stall gaps
 * - SegmentCountSlidingWindowEstimator: Limits by both time and segment count
 *
 * @module ase/SlidingWindowEstimators
 */

/**
 * Basic sliding window throughput estimator.
 * Maintains a queue of samples within a time window and computes
 * average throughput in bits per second.
 */
export class SlidingWindowEstimator {
  /**
   * @param {number} windowSize - Maximum window duration in milliseconds.
   */
  constructor(windowSize) {
    /** @type {number} */
    this.windowSize = windowSize;
    this.reset();
  }

  /**
   * Adds a duration/bytes pair to the sliding window.
   * @private
   */
  _addEntry(duration, bytes) {
    if (!this._isStarted()) return;

    this._totalBytes += duration;
    this._totalDuration += duration;
    this._bytesTransferred += bytes;
    this._samples.push({ bytes, segmentDuration: duration });
  }

  /**
   * Trims samples that have fallen outside the time window.
   * @private
   */
  _trimWindow() {
    while (this._totalDuration > this.windowSize) {
      const oldest = this._samples.shift();
      this._bytesTransferred -= oldest.bytes;
      this._totalDuration -= oldest.segmentDuration;
    }
  }

  /**
   * Whether the estimator has been started.
   * @private
   * @returns {boolean}
   */
  _isStarted() {
    return !isNaN(this._totalBytes);
  }

  /**
   * Resets the estimator to its initial state.
   */
  reset() {
    /** @private @type {Array<{bytes: number, segmentDuration: number}>} */
    this._samples = [];
    /** @private @type {number} */
    this._totalBytes = NaN;
    /** @private @type {number} */
    this._bytesTransferred = 0;
    /** @private @type {number} */
    this._totalDuration = 0;
  }

  /**
   * Updates the window size, trimming excess samples.
   * @param {number} windowSize - New window size in ms.
   */
  setInterval(windowSize) {
    this.windowSize = windowSize;
    this._trimWindow();
  }

  /**
   * Marks the start time for the estimator.
   * @param {number} time - Start timestamp in ms.
   */
  start(time) {
    if (!this._isStarted()) {
      this._totalBytes = time;
    }
  }

  /**
   * Records a throughput sample.
   *
   * @param {number} bytes - Bytes transferred.
   * @param {number} startTime - Transfer start time (ms).
   * @param {number} endTime - Transfer end time (ms).
   */
  addSample(bytes, startTime, endTime) {
    if (!this._isStarted()) this._totalBytes = startTime;

    // Fill gap between last sample and this one with zero-byte entry
    if (startTime > this._totalBytes) {
      this._addEntry(startTime - this._totalBytes, 0);
    }

    // Add the actual sample
    this._addEntry(
      endTime > this._totalBytes ? endTime - this._totalBytes : 0,
      bytes
    );
    this._trimWindow();
  }

  /**
   * Returns the current throughput estimate in bits per second.
   *
   * @returns {{ averageBps: number, variance: number }}
   */
  getEstimate() {
    return {
      averageBps: Math.floor(
        (8 * this._bytesTransferred) / this._totalDuration
      ),
      variance: 0,
    };
  }
}

/**
 * Pausable sliding window throughput estimator.
 * Wraps SlidingWindowEstimator to handle pause/stall gaps,
 * preventing idle time from deflating throughput estimates.
 */
export class PausableSlidingWindowEstimator {
  /**
   * @param {number} windowSize - Maximum window duration in milliseconds.
   */
  constructor(windowSize) {
    /** @private @type {number} Accumulated time offset from pauses */
    this._timeOffset = 0;
    /** @private @type {number} Timestamp when the pause began (NaN = not paused) */
    this._pauseTimestamp = NaN;
    /** @private @type {SlidingWindowEstimator} */
    this._window = new SlidingWindowEstimator(windowSize);
  }

  /** Resets the estimator. */
  reset() {
    this._window.reset();
    this._timeOffset = 0;
    this._pauseTimestamp = NaN;
  }

  /**
   * Records a sample, adjusting for any pause gaps.
   *
   * @param {number} bytes - Bytes transferred.
   * @param {number} startTime - Transfer start time (ms).
   * @param {number} endTime - Transfer end time (ms).
   */
  addSample(bytes, startTime, endTime) {
    if (this._isPaused() && endTime > this._pauseTimestamp) {
      if (startTime > this._pauseTimestamp) {
        this._timeOffset += startTime - this._pauseTimestamp;
      }
      this._pauseTimestamp = NaN;
    }
    this._window.addSample(
      bytes,
      startTime - this._timeOffset,
      endTime - this._timeOffset
    );
  }

  /**
   * Marks the start time, adjusting for pauses.
   * @param {number} time - Start timestamp.
   */
  start(time) {
    if (this._isPaused() && time > this._pauseTimestamp) {
      this._timeOffset += time - this._pauseTimestamp;
      this._pauseTimestamp = NaN;
    }
    this._window.start(time - this._timeOffset);
  }

  /**
   * Marks a pause at the given timestamp.
   * @param {number} timestamp - Pause start timestamp.
   */
  markPause(timestamp) {
    this._pauseTimestamp = this._isPaused()
      ? Math.min(timestamp, this._pauseTimestamp)
      : timestamp;
  }

  /**
   * Returns the current throughput estimate.
   * @returns {{ averageBps: number, variance: number }}
   */
  getEstimate() {
    return this._window.getEstimate();
  }

  /**
   * Updates the window size.
   * @param {number} windowSize - New window size in ms.
   */
  setInterval(windowSize) {
    this._window.setInterval(windowSize);
  }

  /**
   * Whether the estimator is currently paused.
   * @private
   * @returns {boolean}
   */
  _isPaused() {
    return !isNaN(this._pauseTimestamp);
  }
}

/**
 * Segment-count-limited sliding window throughput estimator.
 * Limits the window by both total duration and maximum segment count.
 */
export class SegmentCountSlidingWindowEstimator {
  /**
   * @param {number} maxDuration - Maximum window duration in ms.
   * @param {number} maxSegments - Maximum number of segments to retain.
   */
  constructor(maxDuration, maxSegments) {
    /** @type {number} */
    this.maxDuration = maxDuration;
    /** @type {number} */
    this.maxSegments = maxSegments;
    this.reset();
  }

  /** Resets the estimator. */
  reset() {
    /** @private @type {Array<{duration: number, bytes: number}>} */
    this._samples = [];
    /** @private @type {number} */
    this._bytesTransferred = 0;
    /** @private @type {number} */
    this._totalDuration = 0;
  }

  /**
   * Records a sample if the segment completed successfully.
   *
   * @param {number} bytes - Bytes transferred.
   * @param {number} startTime - Start time (ms).
   * @param {number} endTime - End time (ms).
   * @param {boolean} isComplete - Whether the segment completed.
   */
  addSample(bytes, startTime, endTime, isComplete) {
    if (!isComplete) return;

    const duration = endTime - startTime;
    this._totalDuration += duration;
    this._bytesTransferred += bytes;
    this._samples.push({ duration, bytes });
    this._trimWindow();
  }

  /** No-op for interface compatibility. */
  start() {}
  /** No-op for interface compatibility. */
  markPause() {}

  /**
   * Returns the throughput estimate.
   * @returns {{ averageBps: number, variance: number }}
   */
  getEstimate() {
    return {
      averageBps: Math.floor(
        (8 * this._bytesTransferred) / this._totalDuration
      ),
      variance: 0,
    };
  }

  /**
   * Updates the window constraints.
   *
   * @param {number} maxDuration - New max duration in ms.
   * @param {number} maxSegments - New max segment count.
   */
  setInterval(maxDuration, maxSegments) {
    this.maxDuration = maxDuration;
    this.maxSegments = maxSegments;
    this._trimWindow();
  }

  /**
   * Trims samples exceeding the window constraints.
   * @private
   */
  _trimWindow() {
    while (
      this._totalDuration > this.maxDuration ||
      this._samples.length > this.maxSegments
    ) {
      const oldest = this._samples.shift();
      this._bytesTransferred -= oldest.bytes;
      this._totalDuration -= oldest.duration;
    }
  }
}
