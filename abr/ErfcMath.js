/**
 * Netflix Cadmium Player - Complementary Error Function (erfc) Math Utilities
 * Deobfuscated from Module_68157
 *
 * Mathematical utility functions for statistical calculations used in
 * adaptive bitrate (ABR) algorithms. Provides:
 *
 *   - erfc(x): Complementary error function approximation using
 *     Horner's method with Abramowitz & Stegun coefficients
 *   - inverseErfc(p): Inverse complementary error function using
 *     rational approximation with Newton-Raphson refinement
 *   - sfunc(x): Survival function (1 - erfc(x))
 *
 * These are used for confidence-interval based throughput prediction.
 */

/**
 * Complementary error function approximation.
 * Uses the Abramowitz and Stegun approximation (formula 7.1.26).
 *
 * @param {number} x - Input value
 * @returns {number} erfc(x) approximation
 */
function erfc(x) {
    const absX = Math.abs(x);
    const t = 1 / (1 + absX / 2);

    const result = t * Math.exp(
        -absX * absX
        - 1.26551223
        + t * (1.00002368
        + t * (0.37409196
        + t * (0.09678418
        + t * (-0.18628806
        + t * (0.27886807
        + t * (-1.13520398
        + t * (1.48851587
        + t * (-0.82215223
        + 0.17087277 * t))))))))
    );

    return x >= 0 ? result : 2 - result;
}

/**
 * Inverse complementary error function.
 * Uses rational approximation followed by Newton-Raphson refinement.
 *
 * @param {number} p - Probability value (0 < p < 2)
 * @returns {number} x such that erfc(x) = p; returns -100/100 for out-of-range
 */
function inverseErfc(p) {
    if (p >= 2) return -100;
    if (p <= 0) return 100;

    const pp = p < 1 ? p : 2 - p;
    let t = Math.sqrt(-2 * Math.log(pp / 2));
    let x = -0.70711 * ((2.30753 + 0.27061 * t) / (1 + t * (0.99229 + 0.04481 * t)) - t);

    // Two rounds of Newton-Raphson refinement
    for (let i = 0; i < 2; i++) {
        const err = erfc(x) - pp;
        x += err / (1.1283791670955126 * Math.exp(-(x * x)) - x * err);
    }

    return p < 1 ? x : -x;
}

/**
 * Survival function: 1 - erfc(x).
 *
 * @param {number} x - Input value
 * @returns {number} 1 - erfc(x)
 */
function survivalFunction(x) {
    return 1 - erfc(x);
}

export { erfc, inverseErfc, survivalFunction };
