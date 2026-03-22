/**
 * Netflix Cadmium Player — Bandwidth Predictor (Margin-Based)
 *
 * A simpler bandwidth predictor that applies a configurable "margin"
 * (percentage deduction) to the observed throughput.  The margin can be
 * either a static value or interpolated from a buffer-level-dependent
 * curve.  Optionally switches between two margin configurations based on
 * whether the in-session throughput falls below a threshold.
 *
 * Extends the base `ThroughputPredictor` class from Module_50612.
 *
 * @module Predictor_1
 */

// Dependencies
// import { platform }                     from './modules/Module_66164.js';
// import { TJ as ThroughputPredictor }    from './modules/Module_50612.js';
// import { interpolateQualityMetric }     from './modules/Module_28847.js';

/**
 * Margin-based bandwidth predictor.
 *
 * Deducts a percentage margin from the raw throughput estimate.  The margin
 * can be a fixed value (`P$` / `h$`) or interpolated from a curve
 * (`Q$` / `j$`) that maps buffer level to margin percentage.
 *
 * Two sets of margin parameters are available:
 * - **High-throughput** (`P$`, `Q$`) — used when in-session throughput is
 *   above `R$`.
 * - **Low-throughput** (`h$`, `j$`) — used when in-session throughput is
 *   at or below `R$`.
 *
 * @extends ThroughputPredictor
 */
export class MarginBandwidthPredictor extends ThroughputPredictor {
  /**
   * @param {Object} config - Predictor configuration.  Expected keys:
   *   - `P$` / `h$` — static margin percentages (high / low throughput).
   *   - `Q$` / `j$` — margin interpolation curves (high / low throughput).
   *   - `i$` — curve interpolation parameter.
   *   - `R$` — throughput threshold for switching between margin sets.
   *   - `switchConfigBasedOnInSessionTput` — enable threshold-based switching.
   *   - `upperThroughputPredictionFactor` — multiplier for the upper bound.
   */
  constructor(config) {
    super(config);

    /**
     * Predicts bandwidth by applying a margin deduction to the raw
     * throughput estimate.
     *
     * @param {Object} throughputEstimates - Throughput filter map.
     * @param {Object} buffer - Buffer state.
     * @param {number} bufferDurationMs - Current buffer duration in ms.
     * @param {number} previousBandwidth - Prior prediction for smoothing.
     * @param {boolean} [applySmoothing=true] - Whether to smooth the result.
     * @returns {{ lower: number, upper: number }}
     */
    this.predict = (throughputEstimates, buffer, bufferDurationMs, previousBandwidth, applySmoothing = true) => {
      const rawBandwidth = this.getAvailableBandwidth(throughputEstimates, bufferDurationMs);
      const useLowThroughputConfig = this._isLowThroughput(throughputEstimates, bufferDurationMs);

      // Apply the margin: predicted = raw * (100 - margin%) / 100
      const marginPercent = this._getMarginPercent(buffer, useLowThroughputConfig);
      const marginAdjusted = rawBandwidth ? (rawBandwidth * (100 - marginPercent) / 100) | 0 : 0;

      // Temporal smoothing
      const smoothed = applySmoothing
        ? this._applyTemporalSmoothing(marginAdjusted, previousBandwidth)
        : marginAdjusted;

      return {
        lower: smoothed,
        upper: smoothed * this.config.upperThroughputPredictionFactor,
      };
    };
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Returns the margin percentage to deduct from the raw throughput.
   *
   * When a curve is configured the margin is interpolated from the buffer
   * level; otherwise the static margin value is used.
   *
   * @param {Object} buffer - Buffer state with `downloadPosition` and
   *   `playbackPosition`.
   * @param {boolean} useLowThroughput - `true` to use the low-throughput
   *   margin set.
   * @returns {number} Margin as a percentage (0–100).
   * @private
   */
  _getMarginPercent(buffer, useLowThroughput) {
    const cfg = this.config;
    let staticMargin = useLowThroughput ? cfg.P$ : cfg.h$;
    const curve = useLowThroughput ? cfg.Q$ : cfg.j$;

    if (Array.isArray(curve)) {
      staticMargin = interpolateQualityMetric(
        curve,
        buffer.downloadPosition - buffer.playbackPosition,
        cfg.i$,
      );
    }

    return staticMargin;
  }

  /**
   * Determines whether the in-session throughput is below the configured
   * threshold, triggering the low-throughput margin set.
   *
   * @param {Object} throughputEstimates
   * @param {number} bufferDurationMs
   * @returns {boolean}
   * @private
   */
  _isLowThroughput(throughputEstimates, bufferDurationMs) {
    const bandwidth = this.getAvailableBandwidth(throughputEstimates, bufferDurationMs);
    return this.config.switchConfigBasedOnInSessionTput && bandwidth < this.config.R$;
  }
}
