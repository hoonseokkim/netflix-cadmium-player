/**
 * @module Assert
 * @description Assertion utility that logs errors with stack traces to the
 * global extension console before throwing an AssertionError. Used throughout
 * the player for runtime invariant checks.
 * @see Module_52571
 */

import { __extends } from '../core/tslib.js';
import { globalExtension } from '../core/GlobalExtension.js';

/**
 * Custom assertion error class extending the built-in Error.
 */
export class AssertionError extends Error {
    /**
     * @param {string} [message] - Error message.
     */
    constructor(message) {
        super(message);
        this.name = 'AssertionError';
    }
}

/**
 * Asserts that a condition is truthy. If the condition is falsy,
 * logs the failure to the global console and throws an AssertionError.
 *
 * @param {*} condition - The condition to test.
 * @param {string} [message='Assertion failed'] - Optional error message.
 * @throws {AssertionError} When condition is falsy.
 */
export function assert(condition, message) {
    if (!condition) {
        const error = new AssertionError(message || 'Assertion failed');
        globalExtension.console.error('Assertion failed', {
            value: condition,
            message: message,
            stack: error.stack
        });
        throw error;
    }
}
