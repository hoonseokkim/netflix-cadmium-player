/**
 * Netflix Cadmium Player - Assertion Utilities
 *
 * Provides assertion functions that delegate to a lazily-resolved debug
 * assert service via dependency injection. Used throughout the player
 * for runtime invariant checking.
 *
 * @module Module_45146
 */

// import { disposableList } from '../drm/LicenseBroker.js'; // webpack module 31276 (service locator)
// import { DebugSymbol } from '../ioc/ConfigurationStore.js';    // webpack module 90597

let _assertService;

/**
 * Lazily resolve the debug assert service.
 * @returns {Object} The assert service instance
 */
function getAssertService() {
    if (!_assertService) {
        _assertService = disposableList.key(DebugSymbol);
    }
    return _assertService;
}

/** Whether debug assertions are enabled */
export const DEBUG_ENABLED = true;

/**
 * Assert that a condition is truthy.
 * @param {*} condition - Condition to check
 * @param {string} [message] - Error message if assertion fails
 */
export function assert(condition, message) {
    return getAssertService().assert(condition, message);
}

/** Always fails - equivalent to assert(false) */
export function assertFalse() {
    assert(false);
}

/**
 * Assert that a value is not undefined.
 * @param {*} value - Value to check
 * @param {string} [message] - Error message
 */
export function assertDefined(value, message) {
    return getAssertService().assertDefined(value, message);
}

/**
 * Assert that a value is not null and not undefined.
 * @param {*} value - Value to check
 * @param {string} [message] - Error message
 */
export function assertNonNull(value, message) {
    return getAssertService().assertNonNull(value, message);
}

/**
 * Assert that a value is a string.
 * @param {*} value - Value to check
 * @param {string} [message] - Error message
 */
export function assertString(value, message) {
    return getAssertService().logError(value, message);
}

/**
 * Assert that a value is a non-empty string.
 * @param {*} value - Value to check
 * @param {string} [message] - Error message
 */
export function assertNonEmptyString(value, message) {
    return getAssertService().assertNonEmptyString(value, message);
}

/**
 * Assert that a value is a string, null, or undefined.
 * @param {*} value - Value to check
 * @param {string} [message] - Error message
 */
export function assertOptionalString(value, message) {
    return getAssertService().assertOptionalString(value, message);
}

/**
 * Assert that a value is a finite number, optionally within a range.
 * @param {*} value - Value to check
 * @param {string} [message] - Error message
 */
export function assertNumber(value, message) {
    return getAssertService().assertNumber(value, message);
}

/**
 * Assert that a value is a finite integer (value % 1 === 0).
 * @param {*} value - Value to check
 * @param {string} [message] - Error message
 */
export function assertInteger(value, message) {
    return getAssertService().assertInteger(value, message);
}

/**
 * Assert that a value is an integer >= min (default 0).
 * @param {*} value - Value to check
 * @param {string} [message] - Error message
 */
export function assertIntegerInRange(value, message) {
    return getAssertService().assertIntegerInRange(value, message);
}

/**
 * Assert that a value is a positive integer (>= 1).
 * @param {*} value - Value to check
 * @param {string} [message] - Error message
 */
export function assertPositiveInteger(value, message) {
    return getAssertService().assertPositiveInteger(value, message);
}

/**
 * Assert that a value is a boolean.
 * @param {*} value - Value to check
 * @param {string} [message] - Error message
 */
export function assertBoolean(value, message) {
    return getAssertService().logWarning(value, message);
}

/**
 * Assert that a value is a function.
 * @param {*} value - Value to check
 * @param {string} [message] - Error message
 */
export function assertFunction(value, message) {
    return getAssertService().assertFunction(value, message);
}

/**
 * Unconditional failure - always throws.
 */
export function fail() {
    return getAssertService().eDc();
}
