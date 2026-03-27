/**
 * Netflix Cadmium Player — T-Digest Throughput Filter
 *
 * Maintains a T-Digest data structure for streaming quantile estimation
 * of throughput samples. Unlike the EWMA filter (which produces a single
 * mean), this filter can answer arbitrary percentile queries such as
 * "what throughput do we exceed 90% of the time?"
 *
 * Supports optional **exponential decay weighting**: older samples are
 * down-weighted by a factor of 2^((t - t0) / halfLife), causing the
 * digest to gradually "forget" stale measurements. When the cumulative
 * weight exceeds a configured threshold, the entire digest is rescaled.
 *
 * The filter exposes three configurable quantiles (low, high, initial)
 * used by the ABR controller for conservative / aggressive / startup
 * throughput estimates.
 *
 * @module TdigestFilter
 * @see https://github.com/tdunning/t-digest
 */

// import * as helpers from '../ads/AdBreakMismatchLogger.js';
// import { platform } from '../core/AsejsEngine.js';
// import { TDigest }  from '../modules/Module_15913.js';

/**
 * Streaming quantile filter backed by a T-Digest.
 */
class TdigestFilter {
  /**
   * @param {Object}  config
   * @param {number}  config.c           - T-Digest compression parameter (delta).
   * @param {number}  config.ase_Qid     - Whether to use sorted merge (K parameter).
   * @param {number}  config.ase_Tda     - Low quantile (e.g. 0.10).
   * @param {number}  config.ase_Eca     - High quantile (e.g. 0.90).
   * @param {number}  config.ase_Kta     - Initial / startup quantile.
   * @param {boolean} config.ase_Jdd     - Enable exponential decay weighting.
   * @param {number}  config.fB          - Decay half-life (ms).
   * @param {number}  config.kJb         - Weight threshold for full rescale.
   */
  constructor(config) {
    this.config = config;

    /** @type {number} T-Digest compression (delta) parameter. */
    this.compression = config.c;

    /** @type {number} Sorted-merge mode flag. */
    this.sortedMerge = config.ase_Qid;

    /** @type {number} Low percentile boundary (e.g. 0.10). */
    this.lowQuantile = config.ase_Tda;

    /** @type {number} High percentile boundary (e.g. 0.90). */
    this.highQuantile = config.ase_Eca;

    /** @type {number} Initial / startup percentile. */
    this.initialQuantile = config.ase_Kta;

    /** @type {boolean} Whether exponential decay is enabled. */
    this.decayEnabled = config.ase_Jdd;

    /** @type {number} Decay half-life in milliseconds. */
    this.halfLifeMs = config.fB;

    /** @type {number} Weight-accumulation threshold triggering a full rescale. */
    this.rescaleThreshold = config.kJb;

    this.reset();
  }

  /* ------------------------------------------------------------------ */
  /*  Lifecycle                                                          */
  /* ------------------------------------------------------------------ */

  /** Resets the digest to an empty state. */
  reset() {
    /** @type {TDigest} The underlying T-Digest data structure. */
    this.digest = new TDigest(this.compression, this.sortedMerge);

    /** @type {number|null} Timestamp of the first sample (ms), used as decay reference. */
    this.referenceTime = null;
  }

  /* ------------------------------------------------------------------ */
  /*  Data ingestion                                                     */
  /* ------------------------------------------------------------------ */

  /**
   * Records a throughput sample into the digest.
   *
   * @param {number} bytes     - Bytes transferred.
   * @param {number} startTime - Transfer start timestamp (ms).
   * @param {number} endTime   - Transfer end timestamp (ms).
   */
  item(bytes, startTime, endTime) {
    const durationMs = Math.max(endTime - startTime, 1);
    const throughputKbps = (8 * bytes) / durationMs;

    if (this.decayEnabled) {
      // Exponential decay weighting
      if (this.referenceTime === null) {
        this.referenceTime = startTime;
      }

      const decayFactor = Math.pow(2, (startTime - this.referenceTime) / this.halfLifeMs);
      let weightedDuration = durationMs * decayFactor;

      // Rescale the entire digest when accumulated weight is too large
      if (decayFactor >= this.rescaleThreshold) {
        const rescaledDigest = new TDigest(this.compression, this.sortedMerge);

        for (const centroid of this.digest.buildPath()) {
          rescaledDigest.push(centroid.mean, centroid.n / decayFactor);
        }

        this.digest = rescaledDigest;
        weightedDuration = durationMs; // Reset weight to un-decayed
        this.referenceTime = startTime;
      }

      this.digest.push(throughputKbps, weightedDuration);
    } else {
      this.digest.push(throughputKbps, durationMs);
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Quantile query                                                     */
  /* ------------------------------------------------------------------ */

  /**
   * Returns throughput estimates at the configured quantile boundaries.
   *
   * @returns {{low: number, high: number, initial: number}}
   *   Throughput values (kbps) at the low, high, and initial quantiles.
   */
  key() {
    const quantiles = this.digest.kk([this.lowQuantile, this.highQuantile, this.initialQuantile]);
    return {
      low: quantiles[0] || 0,
      high: quantiles[1] || 0,
      initial: quantiles[2] || 0,
    };
  }

  /* ------------------------------------------------------------------ */
  /*  Cloning                                                            */
  /* ------------------------------------------------------------------ */

  /**
   * Creates a deep copy of this filter, including all centroids in the
   * underlying digest.
   *
   * @returns {TdigestFilter}
   */
  clone() {
    const copy = new TdigestFilter(this.config);
    const clonedDigest = new TDigest(this.compression, this.sortedMerge);

    for (const centroid of this.digest.buildPath()) {
      clonedDigest.push(centroid.mean, centroid.n);
    }

    copy.digest = clonedDigest;
    return copy;
  }

  /* ------------------------------------------------------------------ */
  /*  Filter protocol stubs                                              */
  /* ------------------------------------------------------------------ */

  /** No-op: satisfies the filter logBatcher() interface. */
  logBatcher() {}

  /** No-op: satisfies the filter start() interface. */
  start() {}

  /** No-op: satisfies the filter aseTimer() interface. */
  aseTimer() {}
}

export { TdigestFilter as ase_Wab };
