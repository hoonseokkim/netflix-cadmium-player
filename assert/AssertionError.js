/**
 * Netflix Cadmium Player - Assertion Utility
 *
 * Simple assertion function that throws an AssertionError when the
 * condition is falsy. Used throughout the player for invariant checks.
 *
 * @module AssertionError
 * @original Module_93334
 */

/**
 * Custom error class for assertion failures
 */
export class AssertionError extends Error {
    /**
     * @param {string} [message] - Error message
     */
    constructor(message) {
        super(message);
        this.name = "AssertionError";
    }
}

/**
 * Asserts that a condition is truthy; throws AssertionError if not.
 * @param {*} condition - The condition to check
 * @param {string} [message="Assertion failed"] - Error message on failure
 * @throws {AssertionError} When condition is falsy
 */
export function assert(condition, message) {
    if (!condition) {
        throw new AssertionError(message || "Assertion failed");
    }
}
