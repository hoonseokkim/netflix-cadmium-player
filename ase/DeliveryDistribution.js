/**
 * Netflix Cadmium Player - ASE Delivery Distribution Estimator
 *
 * Implements exponentially-weighted statistical filters for estimating
 * throughput and delivery time distributions in the adaptive streaming engine.
 * Used by the ABR algorithm to predict download performance.
 *
 * @module ase/DeliveryDistribution
 */

import { NormalDistribution } from './NormalDistribution.js';

/**
 * Base class placeholder for delivery distribution filters.
 */
export class DeliveryFilterBase {
  constructor() {}
}

/**
 * Exponentially-weighted moving average/variance tracker.
 * Maintains running statistics with exponential decay over time.
 */
export class ExponentialWeightedStats {
  /**
   * @param {number} alpha - Decay rate constant (derived from half-life).
   * @param {number} average - Initial mean value.
   * @param {number} variance - Initial variance.
   * @param {number} weight - Initial weight (total accumulated mass).
   * @param {number} anchor - Time anchor for decay calculations.
   */
  constructor(alpha, average, variance, weight, anchor) {
    /** @type {number} Exponential decay rate */
    this.alpha = alpha;
    /** @type {number} Running weighted average */
    this.average = average;
    /** @type {number} Total accumulated weight */
    this.weight = weight;
    /** @private @type {number} Weighted sum of squared deviations */
    this._weightedVariance = variance * this.weight;
    /** @private @type {number} Time anchor for exponential decay */
    this._anchor = anchor;
  }

  /**
   * Creates a deep copy of this stats tracker.
   * @returns {ExponentialWeightedStats}
   */
  clone() {
    return new ExponentialWeightedStats(
      this.alpha,
      this.average,
      this.variance,
      this.weight,
      this._anchor
    );
  }

  /**
   * The current variance estimate.
   * @type {number}
   */
  get variance() {
    return this.weight ? this._weightedVariance / this.weight : 0;
  }

  /**
   * Updates the running statistics with a new observation over a time interval.
   *
   * Uses exponential weighting so recent observations have more influence.
   * The update follows a Welford-like incremental variance formula adapted
   * for continuous exponential weights.
   *
   * @param {number} startTime - Start of the observation interval.
   * @param {number} endTime - End of the observation interval.
   * @param {number} value - The observed value (e.g., throughput rate).
   */
  update(startTime, endTime, value) {
    const alpha = this.alpha;
    const previousWeight = this.weight;
    let anchor = this._anchor;

    // Reset weight if time gap is too large (prevents numerical overflow)
    const timeSinceAnchor = alpha * (startTime - anchor);
    if (timeSinceAnchor > 5) {
      this.weight /= Math.exp(timeSinceAnchor);
      this._anchor = anchor = startTime;
    }

    // Compute exponential weight for this interval
    const intervalWeight =
      Math.exp(alpha * (endTime - anchor)) -
      Math.exp(alpha * (startTime - anchor));
    const newWeight = (this.weight += intervalWeight);

    // Update mean using incremental formula
    const previousAverage = this.average;
    const newAverage =
      previousAverage + (intervalWeight * (value - previousAverage)) / newWeight;
    this.average = newAverage;

    // Update weighted variance (Welford-like for exponential weights)
    this._weightedVariance = previousWeight
      ? (this._weightedVariance * (newWeight - intervalWeight)) / previousWeight +
        intervalWeight * (value - newAverage) * (value - previousAverage)
      : 0;
  }
}

/**
 * Delivery distribution filter for the adaptive streaming engine.
 *
 * Tracks throughput statistics using two exponentially-weighted filters:
 * a primary filter for the main throughput metric and an auxiliary filter
 * for an overhead/idle metric. Used by the ABR algorithm to estimate
 * bandwidth distributions for segment download predictions.
 */
export class DeliveryDistribution {
  /**
   * @param {Object} filterParams - Filter configuration parameters.
   * @param {number} filterParams.hl - Half-life for exponential decay (seconds).
   * @param {number} filterParams.min_b - Minimum bandwidth estimate for gap projection.
   * @param {number} filterParams.min_iv - Minimum interval value for gap estimation.
   */
  constructor(filterParams) {
    /** @type {Object} Original filter configuration */
    this.filterParams = filterParams;
    /** @type {number} Half-life for exponential decay */
    this.halfLife = filterParams.hl;
    /** @type {number} Minimum bandwidth estimate */
    this._minBandwidth = filterParams.min_b;
    /** @type {number} Minimum interval for gap estimation */
    this._minInterval = filterParams.min_iv;
    this.reset();
  }

  /**
   * Creates a deep copy of this distribution into an optional target.
   *
   * @param {DeliveryDistribution} [target] - Existing instance to copy into.
   * @returns {DeliveryDistribution}
   */
  clone(target) {
    if (!target) target = new DeliveryDistribution(this.filterParams);
    target._firstSampleTime = this._firstSampleTime;
    target._lastSampleTime = this._lastSampleTime;
    target._primaryFilter = this._primaryFilter.clone();
    target._auxiliaryFilter = this._auxiliaryFilter.clone();
    return target;
  }

  /**
   * Resets the filter to its initial state with no samples.
   */
  reset() {
    const decayRate = -Math.log(0.5) / this.halfLife;
    this._primaryFilter = new ExponentialWeightedStats(decayRate, 0, 0, 0, 0);
    this._auxiliaryFilter = new ExponentialWeightedStats(decayRate, 0, 0, 0, 0);
    this._firstSampleTime = null;
    this._lastSampleTime = null;
  }

  /**
   * Records the start time of the first sample.
   * @param {number} time - Start timestamp.
   */
  start(time) {
    if (this._firstSampleTime === null) {
      this._firstSampleTime = time;
    }
  }

  /**
   * Adds a throughput sample to the filter.
   *
   * @param {number} bytes - Number of bytes transferred.
   * @param {number} startTime - Download start time (ms).
   * @param {number} endTime - Download end time (ms).
   */
  addSample(bytes, startTime, endTime) {
    this._firstSampleTime =
      this._firstSampleTime === null
        ? startTime
        : Math.min(this._firstSampleTime, startTime);
    this._lastSampleTime =
      this._lastSampleTime === null
        ? endTime
        : Math.max(this._lastSampleTime, endTime);

    const duration = Math.max(endTime - startTime, 1);
    this._primaryFilter.update(startTime, endTime, bytes / duration);
    this._auxiliaryFilter.update(startTime, endTime, bytes / duration / 8);
  }

  /**
   * Computes the current throughput estimate, optionally projecting forward
   * from a given time with a bandwidth parameter to fill idle gaps.
   *
   * @param {number} currentTime - Current timestamp.
   * @param {number} [bandwidth] - Optional bandwidth for gap projection.
   * @returns {{ primaryMean: number|null, primaryVariance: number|null, auxiliaryMean: number|null, auxiliaryVariance: number|null }}
   */
  getEstimate(currentTime, bandwidth) {
    const firstTime = this._firstSampleTime || 0;
    const lastTime = this._lastSampleTime || 0;
    let gap = currentTime - lastTime;
    const minInterval = this._minInterval;
    let primary = this._primaryFilter;
    let auxiliary = this._auxiliaryFilter;

    if (gap > 0) {
      // Clone filters to avoid mutating state during estimation
      primary = new ExponentialWeightedStats(
        primary.alpha,
        primary.average,
        primary.variance,
        primary.weight,
        primary._anchor
      );
      auxiliary = new ExponentialWeightedStats(
        auxiliary.alpha,
        auxiliary.average,
        auxiliary.variance,
        auxiliary.weight,
        auxiliary._anchor
      );

      if (primary.weight > 0 && bandwidth !== 0) {
        if (bandwidth === undefined) bandwidth = this._minBandwidth;
        if (gap >= minInterval)
          bandwidth = Math.min(bandwidth, this._minBandwidth);

        const projectedMean = bandwidth * primary.average;
        const projectedVariance = Math.pow(bandwidth, 2) * primary.variance;

        if (projectedVariance === 0) {
          gap = Math.max(gap, minInterval);
        } else {
          // Use normal distribution CDF to estimate gap impact
          const dist = new NormalDistribution(minInterval, projectedVariance);
          const cdf = dist.cdfAndPartialMean(gap);
          const missingWeight = minInterval - cdf[1];
          const remainingWeight = 1 - cdf[0];

          gap =
            remainingWeight > 1e-11
              ? Math.max(missingWeight / remainingWeight, gap)
              : gap + (2 * projectedVariance) / minInterval;
        }

        primary.update(firstTime + lastTime, firstTime + currentTime, bandwidth / gap);
        auxiliary.update(firstTime + lastTime, firstTime + currentTime, 0);
      }
    } else {
      primary = this._primaryFilter;
      auxiliary = this._auxiliaryFilter;
    }

    const primaryWeight = primary.weight;
    const auxiliaryWeight = auxiliary.weight;

    return {
      primaryMean: primaryWeight ? primary.average : null,
      primaryVariance: primaryWeight ? primary.variance : null,
      auxiliaryMean: auxiliaryWeight ? auxiliary.average : null,
      auxiliaryVariance: auxiliaryWeight ? auxiliary.variance : null,
    };
  }

  /** @returns {string} */
  toString() {
    return `DeliveryDist(${this.halfLife})`;
  }

  /** No-op lifecycle hooks for interface compatibility. */
  aseTimer() {}
  logBatcher() {}
}

/**
 * Extended base filter (empty extension point for subclassing).
 */
export class ExtendedDeliveryFilterBase extends DeliveryFilterBase {}

/**
 * Delivery distribution with confidence interval estimation.
 *
 * Extends DeliveryDistribution to produce low/high/initial bandwidth
 * bounds using the underlying normal distribution model. Used by the
 * ABR algorithm to make conservative vs. aggressive bandwidth estimates.
 */
export class DeliveryDistributionCI extends DeliveryDistribution {
  /**
   * @param {Object} filterParams - Filter params including CI thresholds.
   * @param {number} filterParams.lowPercentile - Low confidence percentile.
   * @param {number} filterParams.highPercentile - High confidence percentile.
   * @param {number} filterParams.initialPercentile - Initial estimate percentile.
   * @param {number} filterParams.accuracy - Bisection tolerance for quantile.
   * @param {number} filterParams.maxIterations - Max bisection iterations.
   * @param {string} filterParams.estimationMode - "deliverytime" or throughput mode.
   */
  constructor(filterParams) {
    super(filterParams);
    this.filterParams = filterParams;
  }

  /**
   * Computes confidence interval bandwidth estimates.
   *
   * In "deliverytime" mode, estimates are inverted (8 / delivery_time_quantile)
   * to convert from delivery time to throughput.
   *
   * @returns {{ low: number|null, high: number|null, initial: number|null }}
   */
  getEstimate() {
    if (
      this._primaryFilter.weight === 0 ||
      this._auxiliaryFilter.weight === 0
    ) {
      return { low: null, high: null, initial: null };
    }

    const { accuracy, BIc: maxIterations } = this.filterParams;

    switch (this.filterParams.f2) {
      case 'deliverytime': {
        const dist = new NormalDistribution(
          this._primaryFilter.average,
          this._primaryFilter.variance
        );
        return {
          low: 8 / dist.quantile(this.filterParams.ase_Eca, accuracy, maxIterations),
          high: 8 / dist.quantile(this.filterParams.ase_Tda, accuracy, maxIterations),
          initial: 8 / dist.quantile(this.filterParams.ase_Kta, accuracy, maxIterations),
        };
      }
      default: {
        const dist = new NormalDistribution(
          this._auxiliaryFilter.average,
          this._auxiliaryFilter.variance
        );
        return {
          low: dist.quantile(this.filterParams.ase_Tda, accuracy, maxIterations),
          high: dist.quantile(this.filterParams.ase_Eca, accuracy, maxIterations),
          initial: dist.quantile(this.filterParams.ase_Kta, accuracy, maxIterations),
        };
      }
    }
  }

  /**
   * Creates a deep copy.
   * @returns {DeliveryDistributionCI}
   */
  clone() {
    const copy = new DeliveryDistributionCI(this.filterParams);
    super.clone(copy);
    return copy;
  }

  /** @returns {string} */
  toString() {
    return `DeliveryDistCI([${this.filterParams.ase_Tda}, ${this.filterParams.ase_Eca}])`;
  }
}
