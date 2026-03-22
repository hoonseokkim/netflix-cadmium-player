/**
 * Type Validator
 *
 * Provides type checking and validation methods for various data types
 * including numbers, strings, booleans, arrays, objects, and Uint8Arrays.
 * Used throughout the Cadmium player for input validation.
 *
 * @module TypeValidator
 * @original Module_76564
 */

const SINGLE_TOKEN_REGEX = /^\S+$/;

/**
 * Comprehensive type validation utility class.
 */
class TypeValidator {
    /**
     * Checks if the value is defined (not undefined).
     * @param {*} value
     * @returns {boolean}
     */
    isDefined(value) {
        return value !== undefined;
    }

    /**
     * Checks if the value is not null and not undefined.
     * @param {*} value
     * @returns {boolean}
     */
    isNotNullOrUndefined(value) {
        return value !== null && value !== undefined;
    }

    /**
     * Checks if the value is an object (typeof === 'object').
     * @param {*} value
     * @returns {boolean}
     */
    isObject(value) {
        return TypeValidator._isObject(value);
    }

    /**
     * Checks if the value is a non-null object.
     * @param {*} value
     * @returns {boolean}
     */
    isNonNullObject(value) {
        return !!(value && TypeValidator._isObject(value));
    }

    /**
     * Checks if the value is an Array.
     * @param {*} value
     * @returns {boolean}
     */
    isArray(value) {
        return Array.isArray(value);
    }

    /**
     * Checks if the value is a Uint8Array.
     * @param {*} value
     * @returns {boolean}
     */
    isUint8Array(value) {
        return !!(value && value.constructor === Uint8Array);
    }

    /**
     * Checks if the value is a finite number within optional bounds.
     * @param {*} value
     * @param {number} [min]
     * @param {number} [max]
     * @returns {boolean}
     */
    isNumber(value, min, max) {
        return TypeValidator._isFiniteNumber(value, min, max);
    }

    /**
     * Checks if the value is NaN.
     * @param {*} value
     * @returns {boolean}
     */
    isNaN(value) {
        return TypeValidator._isNaN(value);
    }

    /**
     * Checks if the value is an integer within optional bounds.
     * @param {*} value
     * @param {number} [min]
     * @param {number} [max]
     * @returns {boolean}
     */
    isInteger(value, min, max) {
        return TypeValidator._isFiniteNumber(value, min, max) && value % 1 === 0;
    }

    /**
     * Checks if the value is a non-negative number within optional bounds.
     * @param {*} value
     * @param {number} [min]
     * @param {number} [max]
     * @returns {boolean}
     */
    isNonNegativeNumber(value, min, max) {
        return TypeValidator._isInteger(value, min || 0, max);
    }

    /**
     * Checks if the value is a positive number (>= 1).
     * @param {*} value
     * @returns {boolean}
     */
    isPositiveNumber(value) {
        return TypeValidator._isInteger(value, 1);
    }

    /**
     * Checks if the value is a byte (integer 0-255).
     * @param {*} value
     * @returns {boolean}
     */
    isByte(value) {
        return TypeValidator._isInteger(value, 0, 255);
    }

    /**
     * Checks if the value is a floating-point number (has decimal part).
     * @param {*} value
     * @returns {boolean}
     */
    isFloat(value) {
        return value === +value && (value === 0 || value !== (value | 0)) && true;
    }

    /**
     * Checks if the value is a single-token string (no whitespace).
     * @param {*} value
     * @returns {boolean}
     */
    isSingleToken(value) {
        return !!(value && SINGLE_TOKEN_REGEX.test(value));
    }

    /**
     * Checks if the value is a string.
     * @param {*} value
     * @returns {boolean}
     */
    isString(value) {
        return TypeValidator._isString(value);
    }

    /**
     * Checks if the value is a non-empty string.
     * @param {*} value
     * @returns {boolean}
     */
    isNonEmptyString(value) {
        return !!(TypeValidator._isString(value) && value);
    }

    /**
     * Checks if the value is a boolean.
     * @param {*} value
     * @returns {boolean}
     */
    isBoolean(value) {
        return value === true || value === false;
    }

    /**
     * Checks if the value is a function.
     * @param {*} value
     * @returns {boolean}
     */
    isFunction(value) {
        return typeof value === "function";
    }

    // ---- Static helpers ----

    /** @private */
    static _isString(value) {
        return typeof value === "string";
    }

    /** @private */
    static _isFiniteNumber(value, min, max) {
        return typeof value === "number" && !isNaN(value) && isFinite(value) &&
            (min === undefined || value >= min) &&
            (max === undefined || value <= max);
    }

    /** @private */
    static _isNaN(value) {
        return typeof value === "number" && isNaN(value);
    }

    /** @private */
    static _isInteger(value, min, max) {
        return TypeValidator._isFiniteNumber(value, min, max) && value % 1 === 0;
    }

    /** @private */
    static _isObject(value) {
        return typeof value === "object";
    }
}

/**
 * Singleton instance of the type validator.
 * @type {TypeValidator}
 */
export const typeValidator = new TypeValidator();
