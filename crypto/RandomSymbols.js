/**
 * @module RandomSymbols
 * @description Dependency injection symbols for random number generation services.
 * SystemRandom typically wraps crypto.getRandomValues() while RandomGenerator
 * provides a higher-level interface for generating random data.
 *
 * @original Module_10306
 */

/**
 * Symbol identifier for the system-level random number service
 * (typically backed by Web Crypto API's getRandomValues).
 * @type {string}
 */
export const SystemRandomSymbol = "SystemRandomSymbol";

/**
 * Symbol identifier for the random generator service.
 * @type {string}
 * @internal
 */
export const RandomGeneratorSymbol = "RandomGeneratorSymbol";
