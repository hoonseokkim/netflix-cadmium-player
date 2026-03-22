/**
 * Netflix Cadmium Player - Standard Deviation Predictor
 * Deobfuscated from Module_93928
 *
 * Extends a base throughput predictor class (TJ) to predict bandwidth
 * using standard deviation calculations from different source metrics.
 * Supports multiple prediction sources: "deliverytime", "averagetp", and "ewma".
 *
 * For each source, it calculates lower/upper throughput bounds using
 * stddev multipliers from config to create confidence intervals.
 */

import { __extends } from "tslib"; // Module 22970
import { TJ as BaseThroughputPredictor } from "./BaseThroughputPredictor"; // Module 50612

class StddevPredictor extends BaseThroughputPredictor {
    constructor(config) {
        super(config);

        /**
         * Calculates predicted throughput bounds based on configured stddev source.
         *
         * @param {Object} stats - Statistics object containing buffer and throughput data
         * @param {Object} stats.bufferLength - Buffer length stats with average
         * @param {Object} stats.normalizeMediaType - Normalized stats per media type
         * @returns {{ lower: number, upper: number }} Predicted throughput bounds
         */
        this.predictBounds = function (stats) {
            let stddev = {
                lower: stats.bufferLength.average,
                upper: undefined
            };

            const source = this.config.stddevPredictorSource;

            if (source === "deliverytime") {
                // Delivery time based prediction
                if (!stats.normalizeMediaType || !stats.normalizeMediaType.average) {
                    return stddev;
                }

                const deliveryStddev = Math.sqrt(stats.normalizeMediaType.xg || 0);
                return {
                    lower: 8 / (stats.normalizeMediaType.average + this.config.stddevPredictorMultiplier * deliveryStddev),
                    upper: 8 / (stats.normalizeMediaType.average - this.config.stddevPredictorUpperMultiplier * deliveryStddev)
                };
            }

            if (source === "averagetp") {
                // Average throughput based prediction
                if (!stats.normalizeMediaType || !stats.normalizeMediaType.gZ) {
                    return stddev;
                }

                const tpStddev = Math.sqrt(stats.normalizeMediaType.q5 || 0);
                return {
                    lower: stats.normalizeMediaType.gZ + this.config.stddevPredictorMultiplier * tpStddev,
                    upper: stats.normalizeMediaType.gZ + this.config.stddevPredictorUpperMultiplier * tpStddev
                };
            }

            if (source === "ewma") {
                // Exponentially weighted moving average prediction
                if (stats.normalizeMediaType && stats.normalizeMediaType.q5) {
                    const ewmaStddev = Math.sqrt(stats.normalizeMediaType.q5 || 0);
                    return {
                        lower: stats.bufferLength.average + this.config.stddevPredictorMultiplier * ewmaStddev,
                        upper: stats.bufferLength.average + this.config.stddevPredictorUpperMultiplier * ewmaStddev
                    };
                }
                return stddev;
            }

            return stddev;
        };
    }
}

export { StddevPredictor };
