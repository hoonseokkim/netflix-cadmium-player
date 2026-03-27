/**
 * Netflix Cadmium Player — Bandwidth Predictor (Manifold-Based)
 *
 * Estimates available bandwidth using a "bandwidth manifold" — a pair of
 * throughput-vs-buffer curves that are blended based on how close the
 * current throughput is to a configurable threshold.  The blending uses
 * a power-law decay (`gamma` exponent) so that the predictor smoothly
 * transitions between an optimistic and a conservative curve.
 *
 * Optionally applies a secondary NIQR (normalised inter-quartile range)
 * correction curve that further discounts the prediction when the
 * throughput variance is high.
 *
 * Extends the base `ThroughputPredictor` class from Module_50612.
 *
 * @module Predictor
 */

// Dependencies
// import { platform }           from '../core/AsejsEngine.js';
// import { constrainValue, parseCurve as parseCurve, zTa as evaluateCurve,
//          $rc as evaluateNiqrFactor, RVc as blendCurves }
//   from '../streaming/StreamingExports.js';
// import { TJ as ThroughputPredictor } from './StddevPredictor.js';

/**
 * Manifold-based bandwidth predictor.
 *
 * Uses two throughput curves (optimistic and conservative) that are
 * interpolated based on how far the current throughput deviates from a
 * threshold.  The result is then optionally attenuated by a NIQR
 * correction factor.
 *
 * @extends ThroughputPredictor
 */
export class ManifoldBandwidthPredictor extends ThroughputPredictor {
  /**
   * @param {Object} config - Predictor configuration including
   *   `bandwidthManifold` sub-object with `curves`, `threshold`, `gamma`,
   *   `filter`, `simpleScaling`, `niqrfilter`, and `niqrcurve`.
   */
  constructor(config) {
    super(config);

    // -----------------------------------------------------------------------
    // Parse manifold curves
    // -----------------------------------------------------------------------

    /** @type {Object} Parsed optimistic throughput curve */
    this._optimisticCurve = undefined;

    /** @type {Object} Parsed conservative throughput curve */
    this._conservativeCurve = undefined;

    if (Array.isArray(config.bandwidthManifold.curves)) {
      this._optimisticCurve = parseCurve(config.bandwidthManifold.curves[0], 0, 0, 1);
      this._conservativeCurve = parseCurve(config.bandwidthManifold.curves[1], 0, 0, 1);
    }

    /**
     * Throughput threshold (ms) below which the predictor becomes more
     * conservative.  Clamped to [1, 100000].
     * @type {number}
     */
    this._throughputThreshold = constrainValue(config.bandwidthManifold.threshold || 6000, 1, 100000);

    /**
     * Power-law exponent that controls how sharply the predictor transitions
     * between the optimistic and conservative curves.  Clamped to [0.1, 10].
     * @type {number}
     */
    this._blendGamma = constrainValue(config.bandwidthManifold.gamma || 1, 0.1, 10);

    /**
     * Name of the throughput filter used to retrieve the filtered average
     * (e.g. `"ewma"`, `"sliding"`).
     * @type {string}
     */
    this._throughputFilter = config.bandwidthManifold.filter;

    /**
     * When `true`, the two curves are evaluated independently and then
     * linearly blended.  When `false`, the curves are pre-blended into a
     * single curve before evaluation (more accurate but slower).
     * @type {boolean}
     */
    this._useSimpleScaling = !!config.bandwidthManifold.simpleScaling;

    // -----------------------------------------------------------------------
    // Optional NIQR correction
    // -----------------------------------------------------------------------

    /** @type {string|undefined} Name of the NIQR filter */
    this._niqrFilterName = undefined;

    /** @type {Object|undefined} Parsed NIQR correction curve */
    this._niqrCurve = undefined;

    if (config.bandwidthManifold.niqrfilter && config.bandwidthManifold.niqrcurve) {
      this._niqrFilterName = config.bandwidthManifold.niqrfilter;
      this._niqrCurve = parseCurve(config.bandwidthManifold.niqrcurve, 1, 0, 4);
    }

    // -----------------------------------------------------------------------
    // Prediction function (bound to `this` via closure)
    // -----------------------------------------------------------------------

    /**
     * Predicts bandwidth given the current throughput estimates and buffer
     * state.
     *
     * @param {Object} throughputEstimates - Map of filter names to throughput
     *   statistics (`.average`, `.uwa`, etc.).
     * @param {Object} buffer - Buffer state with `downloadPosition` and
     *   `playbackPosition`.
     * @param {number} bufferDurationMs - Duration of buffered content in ms.
     * @param {number} previousBandwidth - Previously predicted bandwidth.
     * @param {boolean} [applySmoothing=true] - Whether to apply temporal
     *   smoothing to the prediction.
     * @returns {{ lower: number, upper: number }} Predicted bandwidth range.
     */
    this.predict = (throughputEstimates, buffer, bufferDurationMs, previousBandwidth, applySmoothing = true) => {
      // Determine the base throughput estimate
      const rawBandwidth = this.getAvailableBandwidth(throughputEstimates, bufferDurationMs);
      const filteredAverage = this._isFilterAvailable(bufferDurationMs)
        ? rawBandwidth
        : (throughputEstimates[this._throughputFilter]?.average || rawBandwidth);

      // Compute the blending weight: 1 when throughput is well above the
      // threshold, decaying to 0 as throughput approaches or falls below it.
      const blendWeight = Math.pow(
        Math.max(1 - bufferDurationMs / this._throughputThreshold, 0),
        this._blendGamma,
      );

      const bufferLevel = buffer.downloadPosition - buffer.playbackPosition;

      // Evaluate the manifold
      let scalingFactor;
      if (this._useSimpleScaling) {
        const optimisticFactor = evaluateCurve(this._optimisticCurve, bufferLevel, 1);
        const conservativeFactor = evaluateCurve(this._conservativeCurve, bufferLevel, 1);
        scalingFactor = optimisticFactor * blendWeight + conservativeFactor * (1 - blendWeight);
      } else {
        const blendedCurve = blendCurves(this._optimisticCurve, this._conservativeCurve, blendWeight);
        scalingFactor = evaluateCurve(blendedCurve, bufferLevel, 1);
      }

      // Apply optional NIQR correction
      if (this._niqrFilterName) {
        const niqrValue = throughputEstimates[this._niqrFilterName]?.uwa;
        if (niqrValue !== undefined) {
          const niqrFactor = evaluateNiqrFactor(this._niqrCurve, niqrValue);
          scalingFactor = Math.min(scalingFactor * niqrFactor, 1);
        }
      }

      // Final prediction
      const predictedBandwidth = filteredAverage * (1 - scalingFactor);
      const smoothedBandwidth = applySmoothing
        ? this._applyTemporalSmoothing(predictedBandwidth, previousBandwidth)
        : predictedBandwidth;

      return {
        lower: smoothedBandwidth,
        upper: smoothedBandwidth * this.config.upperThroughputPredictionFactor,
      };
    };
  }
}
