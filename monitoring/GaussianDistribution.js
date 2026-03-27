/**
 * Netflix Cadmium Player — GaussianDistribution
 *
 * Models a Gaussian (normal) distribution with a given mean and variance.
 * Provides methods to compute the complementary CDF (survival function)
 * and the quantile (inverse CDF) function.
 *
 * Used in the monitoring/ABR pipeline for statistical confidence
 * calculations on throughput and latency measurements.
 *
 * @module monitoring/GaussianDistribution
 * @original Module_32201
 */

// import { erfc as erfc, cCc as erfcInverse } from './ErrorFunction'; // Module 68157

export default class GaussianDistribution {
    /**
     * @param {number} mean - Mean (mu) of the distribution
     * @param {number} variance - Variance (sigma^2) of the distribution
     */
    constructor(mean, variance) {
        /** @type {number} Distribution mean */
        this.mean = mean;

        /** @type {number} Distribution variance */
        this.variance = variance;
    }

    /**
     * Compute the upper-tail probability P(X > x) for this distribution.
     * Uses the complementary error function: P(X > x) = 0.5 * erfc(-(x - mu) / sqrt(2 * sigma^2))
     *
     * @param {number} x - The value to evaluate
     * @returns {number} Probability that a random variable exceeds x
     */
    survivalFunction(x) {
        return 0.5 * erfc(-(x - this.mean) / Math.sqrt(2 * this.variance));
    }

    /**
     * Compute the quantile function (inverse CDF) for this distribution.
     * Given a probability p, returns the value x such that P(X < x) = p.
     *
     * Uses: x = mu - sqrt(2 * sigma^2) * erfcInverse(2 * p)
     *
     * @param {number} p - Probability (0 < p < 1)
     * @returns {number} The quantile value
     */
    quantile(p) {
        return this.mean - Math.sqrt(2 * this.variance) * erfcInverse(2 * p);
    }
}
