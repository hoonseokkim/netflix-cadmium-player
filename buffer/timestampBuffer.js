/**
 * Netflix Cadmium Player - JS Bridge Performance Tracker
 * Component: timestampBuffer
 *
 * Tracks the latency of JS-to-native bridge calls using a T-Digest
 * data structure for memory-efficient percentile estimation. Used to
 * monitor and report bridge call performance at various quantiles
 * (p25, p50, p75, p90, p95, p99).
 */

// Dependencies
// import { TDigest } from './TDigest';   // webpack 15913
// import { assert } from './Assert';      // webpack 52571

/**
 * @class JSBridgePerfTracker
 *
 * Singleton that records JS bridge call durations and computes
 * percentile statistics using a T-Digest sketch.
 */
export class JSBridgePerfTracker {
    /**
     * @param {Object} config - Player configuration
     * @param {boolean} config.enableRecordJSBridgePerf - Whether tracking is enabled
     * @param {Object} [config.JSBridgeTDigestConfig] - T-Digest parameters
     * @param {number} config.JSBridgeTDigestConfig.c - Compression parameter
     * @param {number} config.JSBridgeTDigestConfig.maxc - Max compression
     */
    constructor(config) {
        /** @type {Object} */
        this.config = config;

        /** @type {TDigest|undefined} */
        this.digest = undefined;

        this._initialize();
    }

    /**
     * Returns the singleton instance.
     * @returns {JSBridgePerfTracker}
     * @throws {Error} if the singleton has not been created
     */
    static getInstance() {
        assert(JSBridgePerfTracker._instance !== undefined);
        return JSBridgePerfTracker._instance;
    }

    /**
     * Creates the singleton with the given configuration.
     * @param {Object} config
     */
    static create(config) {
        JSBridgePerfTracker._instance = new JSBridgePerfTracker(config);
    }

    /**
     * Records a bridge call duration sample.
     * @param {number} durationMs - The measured duration in milliseconds
     */
    recordSample(durationMs) {
        this.digest?.push(durationMs);
    }

    /**
     * Returns percentile statistics for the recorded samples.
     *
     * @returns {Array<number>|undefined} Array of [p25, p50, p75, p90, p95, p99]
     *   values rounded to one decimal place, or undefined if tracking is disabled.
     */
    getPercentiles() {
        if (!this.digest) return undefined;

        this.digest.compress();

        return this.digest
            .quantiles([0.25, 0.5, 0.75, 0.9, 0.95, 0.99])
            .map((value) => (value ? parseFloat(value.toFixed(1)) : 0));
    }

    /**
     * Initializes the T-Digest if tracking is enabled.
     * @private
     */
    _initialize() {
        if (this.config.enableRecordJSBridgePerf && this.config.JSBridgeTDigestConfig) {
            this.digest = new TDigest(
                this.config.JSBridgeTDigestConfig.c,
                this.config.JSBridgeTDigestConfig.maxc
            );
        }
    }
}
