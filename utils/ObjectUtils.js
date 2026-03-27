/**
 * Netflix Cadmium Player - Object Utilities
 *
 * A collection of general-purpose helper functions for property manipulation,
 * type coercion, formatting, and string operations used throughout the player.
 *
 * @module Module_3887
 */

// import { assert } from '../config/PlayerConfiguration.js';           // webpack module 45146
// import { round, randomFloat } from './IpAddressUtils.js'; // webpack module 22365
// import { isFunction, isDefined, isNumber } from './IpAddressUtils.js'; // webpack module 32687

/**
 * Invoke a named method on an object with optional fallback value.
 * @param {Object} obj - Target object
 * @param {string} methodName - Method name to invoke
 * @param {*} fallback - Fallback value if method doesn't exist
 * @param {...*} args - Arguments to pass to the method
 * @returns {*} Method result or fallback
 */
export function invokeMethod(obj, methodName, fallback, ...args) {
    if (obj) {
        const method = obj[methodName];
        if (typeof method === 'function') {
            fallback = method.apply(obj, args);
        }
    }
    return fallback;
}

/**
 * Convert an array to a lookup set object where each element becomes a key with value true.
 * @param {Array} arr - Input array
 * @returns {Object} Lookup set { element: true, ... }
 */
export function arrayToLookupSet(arr) {
    const result = {};
    for (let i = arr.length; i--;)
        result[arr[i]] = true;
    return result;
}

/**
 * Case-insensitive boolean parser. Returns true only for the string "true".
 * @param {string} value - String to parse
 * @returns {boolean}
 */
export function parseBoolean(value) {
    return (/^true$/i).test(value);
}

/**
 * Generate a random integer in the range [min, max) using Math.round.
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (exclusive)
 * @returns {number}
 */
export function randomInRange(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

/**
 * Pretty-print a value as JSON with 2-space indentation.
 * @param {*} value - Value to serialize
 * @returns {string} Formatted JSON string
 */
export function prettyPrintJson(value) {
    return JSON.stringify(value, null, "  ");
}

/**
 * Wrap a non-array value in a single-element array. Arrays pass through unchanged.
 * @param {*} value - Value to wrap
 * @returns {Array}
 */
export function ensureArray(value) {
    return Array.isArray(value) ? value : [value];
}

/**
 * Return the first defined (non-null/non-undefined) argument.
 * @param {...*} args - Candidate values
 * @returns {*} First defined value, or undefined
 */
export function coalesce(...args) {
    for (let i = 0; i < args.length; i++) {
        if (args[i] !== null && args[i] !== undefined) {
            return args[i];
        }
    }
}

/**
 * Format a number as an integer string (0 decimal places).
 * @param {number} value - Number to format
 * @returns {string|undefined}
 */
export function formatInteger(value) {
    return isFinite(value) && typeof value === 'number' ? value.toFixed(0) : undefined;
}

/**
 * Convert milliseconds to seconds and format as an integer string.
 * @param {number} ms - Time in milliseconds
 * @returns {string|undefined}
 */
export function formatSeconds(ms) {
    return isFinite(ms) && typeof ms === 'number' ? (ms / 1000).toFixed(0) : undefined;
}

/**
 * Shallow-copy an array-like object to a true Array.
 * @param {ArrayLike} arrayLike - Array-like to copy
 * @returns {Array}
 */
export function toArray(arrayLike) {
    const result = [];
    for (let i = 0; i < arrayLike.length; i++)
        result[i] = arrayLike[i];
    return result;
}

/**
 * Iterate over own properties of an object.
 * @param {Object} obj - Object to iterate
 * @param {Function} callback - Called with (key, value) for each property
 */
export function forEachProperty(obj, callback) {
    for (const key in obj)
        if (obj.hasOwnProperty(key))
            callback(key, obj[key]);
}

/**
 * Copy properties from source to target with optional key transformation.
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @param {Object} [options] - Options
 * @param {boolean} [options.lowercaseKeys] - Convert keys to lowercase
 * @param {string} [options.prefix] - Prefix to prepend to keys
 * @param {boolean} [options.skipUndefined] - Skip null/undefined values
 * @returns {Object} The target object
 */
export function assignProperties(target, source, options) {
    if (source) {
        if (options) {
            const lowercaseKeys = options.lowercaseKeys;
            const prefix = options.prefix;
            const skipUndefined = options.skipUndefined;
            forEachProperty(source, function(key, value) {
                if (!skipUndefined || (value !== null && value !== undefined))
                    target[(prefix || "") + (lowercaseKeys ? key.toLowerCase() : key)] = value;
            });
        } else {
            forEachProperty(source, function(key, value) {
                target[key] = value;
            });
        }
    }
    return target;
}

/**
 * Parse a string as a base-10 integer.
 * @param {string} value - String to parse
 * @returns {number}
 */
export function parseInteger(value) {
    return parseInt(value, 10);
}

/**
 * Escape HTML special characters in a string.
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export const escapeHtml = (function() {
    const entityMap = {
        "&": "&amp;",
        "'": "&#39;",
        '"': "&quot;",
        "<": "&lt;",
        ">": "&gt;"
    };
    const pattern = /[&'"<>]/g;
    return function(str) {
        return str.replace(pattern, (ch) => entityMap[ch]);
    };
})();

/**
 * Trim leading and trailing whitespace from each line.
 * @param {string} str - String to trim
 * @returns {string} Trimmed string
 */
export const trim = (function() {
    const pattern = /^\s+|\s+$/gm;
    return function(str) {
        return str.replace(pattern, "");
    };
})();

/**
 * Serialize an Error to a string including stack trace, message, and error number.
 * @param {Error} error - Error to format
 * @returns {string|undefined}
 */
export function formatErrorToString(error) {
    if (error) {
        const stack = error.stack;
        const number = error.number;
        let message = error.message;
        if (!message) message = "" + error;
        let result;
        if (stack) {
            result = "" + stack;
            if (result.indexOf(message) !== 0) {
                result = message + "\n" + result;
            }
        } else {
            result = message;
        }
        if (number) result += "\nnumber:" + number;
        return result;
    }
}
