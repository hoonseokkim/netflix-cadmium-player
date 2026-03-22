/**
 * Netflix Cadmium Player - ASE Throughput Estimators (EWMA Family)
 *
 * Provides three throughput estimation filters for the adaptive streaming engine:
 * - ExponentialMovingAverageFilter: Discrete EWMA with half-life decay
 * - ContinuousEWMAFilter: Continuous-time exponential weighted moving average
 * - PausableEWMAFilter: Continuous EWMA that pauses during stalls/rebuffers
 *
 * @module ase/ThroughputEstimators
 */

/**
 * Discrete exponential moving average filter for throughput estimation.
 * Uses a half-life based decay factor to weight recent samples more heavily.
 */
export class ExponentialMovingAverageFilter {
  /**
   * @param {number} halfLife - Number of samples for 50% weight decay.
   * @param {number} [initialLength=0] - Initial sample count (for warm start).
   */
  constructor(halfLife, initialLength = 0) {
    /** @type {number} */
    this.initialLength = initialLength;
    this.reset();
    this._setHalfLife(halfLife);
  }

  /**
   * Updates the decay factor for a new half-life.
   * @private
   * @param {number} halfLife
   */
  _setHalfLife(halfLife) {
    /** @type {number} Exponential decay factor per sample */
    this.alpha = Math.pow(0.5, 1 / halfLife);
    /** @type {number} */
    this.halfLife = halfLife;
  }

  /**
   * Resets the filter, optionally restoring from saved state.
   * @param {Object} [state] - Previous state with { average, variance }.
   */
  reset(state) {
    if (state && state.average !== undefined && isFinite(state.average)) {
      this.length = this.initialLength;
      this.average = state.average;
      this._meanSquare =
        state.variance && isFinite(state.variance)
          ? state.variance + state.average * state.average
          : state.average * state.average;
    } else {
      this._meanSquare = 0;
      this.average = 0;
      this.length = 0;
    }
  }

  /**
   * Adds a new sample to the filter.
   * @param {number} value - The sample value (e.g. throughput in bps).
   */
  addSample(value) {
    if (!isFinite(value)) return;

    this.length++;
    const alpha = this.alpha;
    this.average = alpha * this.average + (1 - alpha) * value;
    this._meanSquare =
      alpha * this._meanSquare + (1 - alpha) * value * value;
  }

  /**
   * Computes the bias-corrected mean and variance.
   * @private
   * @returns {{ mean: number, variance: number }}
   */
  _getCorrectedStats() {
    if (this.length === 0) return { mean: 0, variance: 0 };

    const biasFactor = 1 - Math.pow(this.alpha, this.length);
    const correctedMean = this.average / biasFactor;
    return {
      mean: correctedMean,
      variance: Math.max(
        this._meanSquare / biasFactor - correctedMean * correctedMean,
        0
      ),
    };
  }

  /**
   * Returns the current throughput estimate (floored integers).
   * @returns {{ averageBps: number, variance: number }}
   */
  getEstimate() {
    const stats = this._getCorrectedStats();
    return {
      averageBps: Math.floor(stats.mean),
      variance: Math.floor(stats.variance),
    };
  }

  /**
   * Serializes the filter state for persistence.
   * @returns {{ a: number, s: number, n: number }|null}
   */
  getState() {
    if (this.length === 0) return null;
    return {
      a: Number(this.average.toPrecision(6)),
      s: Number(this._meanSquare.toPrecision(6)),
      n: this.length,
    };
  }

  /**
   * Restores the filter from a previously saved state.
   * @param {Object} state - Serialized state object.
   * @returns {boolean} Whether the restore was successful.
   */
  restoreState(state) {
    if (
      !state ||
      !('a' in state) ||
      !('s' in state) ||
      !isFinite(state.a) ||
      !isFinite(state.s)
    ) {
      this._meanSquare = 0;
      this.average = 0;
      this.length = 0;
      return false;
    }

    this.average = state.a;
    this._meanSquare = state.s;
    this.length =
      'n' in state && isFinite(state.n) ? state.n : 16 * this.halfLife;
    return true;
  }
}

/**
 * Continuous-time exponential weighted moving average filter.
 * Tracks throughput using continuous exponential decay based on wall-clock time.
 */
export class ContinuousEWMAFilter {
  /**
   * @param {number} halfLife - Half-life in milliseconds.
   */
  constructor(halfLife) {
    this.setInterval(halfLife);
    this.reset();
  }

  /**
   * Updates the half-life / decay rate.
   * @param {number} halfLife - New half-life in milliseconds.
   */
  setInterval(halfLife) {
    /** @type {number} */
    this.halfLife = halfLife;
    /** @type {number} Decay rate constant */
    this.alpha = -Math.log(0.5) / halfLife;
  }

  /**
   * Resets the filter state.
   * @param {Object} [state] - Optional initial state { average }.
   */
  reset(state) {
    /** @type {number|null} */
    this.startTime = null;
    /** @type {number|null} */
    this.lastUpdateTime = null;
    /** @type {number} */
    this.average = state && isFinite(state.average) ? state.average : 0;
  }

  /**
   * Records the start time for this filter.
   * @param {number} time - Start timestamp in ms.
   */
  start(time) {
    if (this.startTime == null) this.startTime = time;
    if (this.lastUpdateTime == null) this.lastUpdateTime = time;
  }

  /**
   * Adds a throughput sample spanning a time interval.
   *
   * @param {number} bytes - Number of bytes transferred.
   * @param {number} startTime - Transfer start time (ms).
   * @param {number} endTime - Transfer end time (ms).
   */
  addSample(bytes, startTime, endTime) {
    if (this.startTime == null) this.startTime = startTime;
    if (this.lastUpdateTime == null) this.lastUpdateTime = startTime;

    this.startTime = Math.min(this.startTime, startTime);

    const duration = Math.max(endTime - startTime, 1);
    const alpha = this.alpha;
    const latestTime = Math.max(endTime, this.lastUpdateTime);
    const timeSinceUpdate = latestTime - this.lastUpdateTime;
    const timeAfterEnd = latestTime - endTime;

    this.average =
      this.average *
        (timeSinceUpdate > 0 ? Math.exp(-alpha * timeSinceUpdate) : 1) +
      ((8 * bytes) / duration) *
        (1 - Math.exp(-alpha * duration)) *
        (timeAfterEnd > 0 ? Math.exp(-alpha * timeAfterEnd) : 1);

    this.lastUpdateTime = latestTime;
  }

  /**
   * Returns the throughput estimate at a given time.
   *
   * @param {number} currentTime - Current timestamp in ms.
   * @returns {{ averageBps: number, variance: number }}
   */
  getEstimate(currentTime) {
    const lastTime = this.lastUpdateTime ?? 0;
    const startTime = this.startTime ?? 0;

    currentTime = Math.max(currentTime, lastTime);
    let estimate =
      this.average * Math.exp(-this.alpha * (currentTime - lastTime));
    const normFactor =
      1 - Math.exp(-this.alpha * (currentTime - startTime));

    if (normFactor > 0) estimate /= normFactor;

    return { averageBps: Math.floor(estimate), variance: 0 };
  }

  /** @returns {string} */
  toString() {
    return `ewma(${this.halfLife})`;
  }

  /**
   * The last update time.
   * @type {number|null}
   */
  get time() {
    return this.lastUpdateTime;
  }
}

/**
 * Pausable continuous EWMA filter.
 * Wraps a ContinuousEWMAFilter to handle pause/stall gaps by adjusting
 * the time offset, so throughput estimation is not affected by idle periods.
 */
export class PausableEWMAFilter {
  /**
   * @param {number} halfLife - Half-life in milliseconds.
   */
  constructor(halfLife) {
    /** @private @type {ContinuousEWMAFilter} */
    this._inner = new ContinuousEWMAFilter(halfLife);
    /** @private @type {number} Accumulated time offset from pauses */
    this._timeOffset = 0;
    /** @private @type {number|null} Timestamp when current pause began */
    this._pauseTimestamp = null;
  }

  /**
   * Updates the half-life.
   * @param {number} halfLife - New half-life in ms.
   */
  setInterval(halfLife) {
    this._inner.setInterval(halfLife);
  }

  /**
   * Resets the filter.
   * @param {Object} [state] - Optional initial state.
   */
  reset(state) {
    this._inner.reset(state);
    this._timeOffset = 0;
    this._pauseTimestamp = null;
  }

  /**
   * Records the start time, adjusting for any pause gap.
   * @param {number} time - Start timestamp.
   */
  start(time) {
    if (this._pauseTimestamp !== null && time > this._pauseTimestamp) {
      this._timeOffset += time - this._pauseTimestamp;
      this._pauseTimestamp = null;
    }
    this._inner.start(time - this._timeOffset);
  }

  /**
   * Adds a sample, adjusting timestamps for pause gaps.
   *
   * @param {number} bytes - Bytes transferred.
   * @param {number} startTime - Transfer start time (ms).
   * @param {number} endTime - Transfer end time (ms).
   */
  addSample(bytes, startTime, endTime) {
    if (this._pauseTimestamp !== null && endTime > this._pauseTimestamp) {
      this._timeOffset +=
        startTime > this._pauseTimestamp
          ? startTime - this._pauseTimestamp
          : 0;
      this._pauseTimestamp = null;
    }
    this._inner.addSample(
      bytes,
      startTime - this._timeOffset,
      endTime - this._timeOffset
    );
  }

  /**
   * Marks a pause/stall at the given timestamp.
   * @param {number} timestamp - Pause start timestamp.
   */
  markPause(timestamp) {
    const lastInnerTime = this._inner.lastUpdateTime;
    this._pauseTimestamp = Math.max(
      lastInnerTime == null ? 0 : lastInnerTime + this._timeOffset,
      this._pauseTimestamp == null
        ? timestamp
        : Math.min(this._pauseTimestamp, timestamp)
    );
  }

  /**
   * Returns the throughput estimate.
   *
   * @param {number} currentTime - Current timestamp.
   * @returns {{ averageBps: number, variance: number }}
   */
  getEstimate(currentTime) {
    const adjustedTime =
      (this._pauseTimestamp ? this._pauseTimestamp : currentTime) -
      this._timeOffset;
    return this._inner.getEstimate(adjustedTime);
  }

  /** @returns {string} */
  toString() {
    return this._inner.toString();
  }
}
