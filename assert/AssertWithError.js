/**
 * Netflix Cadmium Player - Assert with Custom Error
 * Deobfuscated from Module_89707
 *
 * Assertion utility that throws a custom AssertionError (extending Error)
 * when the assertion condition fails. Used throughout the player for
 * runtime invariant checks.
 */

import { __extends } from '../core/tslib';

/**
 * Custom error class for assertion failures.
 * Extends the native Error class.
 */
const AssertionError = (function (ErrorBase) {
    function AssertionError() {
        return ErrorBase !== null && ErrorBase.apply(this, arguments) || this;
    }
    __extends(AssertionError, ErrorBase);
    return AssertionError;
})(Error);

/**
 * Asserts that a condition is truthy. Throws an AssertionError if the
 * condition is falsy.
 *
 * @param {*} condition - The condition to check
 * @param {string} [message="Assertion failed"] - Error message if assertion fails
 * @throws {AssertionError} When condition is falsy
 */
export function assert(condition, message) {
    if (!condition) {
        throw new AssertionError(message || "Assertion failed");
    }
}
