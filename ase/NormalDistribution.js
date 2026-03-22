/**
 * Netflix Cadmium Player - Normal Distribution
 *
 * Implements a normal (Gaussian) distribution with CDF computation,
 * quantile estimation (via bisection), and partial expectation.
 * Used by the ASE for bandwidth estimation and probabilistic
 * decision-making in the adaptive bitrate algorithm.
 *
 * @module ase/NormalDistribution
 */

/**
 * Normal distribution with mean and variance for CDF computation,
 * quantile estimation (via bisection), and partial expectation.
 *
 * Uses a modified Gaussian CDF formulation involving the complementary
 * error function (erfc) and precomputed exponential terms for efficiency.
 */
export class NormalDistribution {
  /**
   * @param {number} mean - The distribution mean.
   * @param {number} variance - The distribution variance (must be >= 0).
   */
  constructor(mean, variance) {
    /** @type {number} Distribution mean */
    this.mean = mean;
    /** @type {number} Distribution variance */
    this.variance = variance;

    if (variance > 0) {
      /** @type {number} Precomputed coefficient: mean^3 / variance */
      this.cubeMeanOverVariance = Math.pow(mean, 3) / variance;
      const exponentArg = (2 * this.cubeMeanOverVariance) / mean;
      /** @type {number} Precomputed exponential term for CDF, or 0 if overflow */
      this.expTerm = exponentArg <= 500 ? Math.exp(exponentArg) : 0;
    } else {
      this.expTerm = 0;
    }
  }

  /**
   * Computes the cumulative distribution function P(X <= x).
   *
   * @param {number} x - The value to evaluate.
   * @returns {number} Probability in [0, 1].
   */
  cdf(x) {
    const { mean, expTerm } = this;

    if (expTerm && x > 0) {
      const scale = Math.sqrt(this.cubeMeanOverVariance / (2 * x));
      const normalizedX = x / mean;
      const erfcLower = erfc(scale * (normalizedX - 1));
      const erfcUpper = erfc(scale * (normalizedX + 1));
      return Math.max((2 - erfcLower + expTerm * erfcUpper) / 2, 0);
    }

    if (x < mean) return 0;
    if (x > mean) return 1;
    return 0.5;
  }

  /**
   * Finds the quantile (inverse CDF) for a given probability using bisection.
   *
   * @param {number} probability - Target cumulative probability in (0, 1).
   * @param {number} tolerance - Convergence tolerance for bisection.
   * @param {number} maxIterations - Maximum number of bisection iterations.
   * @returns {number} The x value where CDF(x) approximately equals probability.
   */
  quantile(probability, tolerance, maxIterations) {
    let low = 0;
    let high = this.mean + 5 * Math.sqrt(this.variance);
    let residual = 1;
    let mid = 0;

    while (Math.abs(residual) > tolerance && maxIterations--) {
      mid = (low + high) / 2;
      residual = probability - this.cdf(mid);
      if (residual < 0) {
        high = mid;
      } else {
        low = mid;
      }
    }

    return mid;
  }

  /**
   * Computes the CDF and partial mean (expected value of X given X <= x).
   * Returns [CDF(x), E[X | X <= x] * CDF(x)].
   *
   * Used by the delivery distribution estimator to project throughput
   * during idle gaps.
   *
   * @param {number} x - The value to evaluate.
   * @returns {[number, number]} Tuple of [cdf, partialExpectation].
   */
  cdfAndPartialMean(x) {
    const { mean, expTerm } = this;

    if (expTerm && x > 0) {
      const scale = Math.sqrt(this.cubeMeanOverVariance / (2 * x));
      const normalizedX = x / mean;
      const erfcLower = 2 - erfc(scale * (normalizedX - 1));
      const erfcUpper = expTerm * erfc(scale * (normalizedX + 1));
      return [
        Math.max((erfcLower + erfcUpper) / 2, 0),
        Math.max((mean * (erfcLower - erfcUpper)) / 2, 0),
      ];
    }

    if (x < mean) return [0, 0];
    if (x > mean) return [1, mean];
    return [0.5, mean / 2];
  }
}
