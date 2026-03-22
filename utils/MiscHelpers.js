/**
 * @module MiscHelpers
 * @description General-purpose utility functions used throughout the player.
 * Includes property iteration, HTML escaping, string trimming, number formatting,
 * type coercion helpers, and error serialization.
 *
 * @see Module_3887
 */

import { assert } from '../assert/Assert';
import { totalTime, random as internalRandom } from '../timing/TimeHelpers';
import { typeofChecker, isDefined as gd, isNumber as wc } from '../utils/TypeCheckers';

/**
 * Safely invokes a method on an object if it exists and is a function.
 * @param {object} obj - The target object
 * @param {string} methodName - Method name to invoke
 * @param {*} defaultValue - Fallback if method doesn't exist
 * @param {...*} args - Arguments to pass to the method
 * @returns {*}
 */
export function safeInvoke(obj, methodName, defaultValue, ...args) {
  if (obj) {
    const method = obj[methodName];
    if (typeofChecker(method)) {
      return method.apply(obj, args);
    }
  }
  return defaultValue;
}

/**
 * Creates a lookup set (object with boolean values) from an array of strings.
 * @param {string[]} arr
 * @returns {Object<string, boolean>}
 */
export function arrayToLookupSet(arr) {
  const result = {};
  for (let i = arr.length; i--;) {
    result[arr[i]] = true;
  }
  return result;
}

/**
 * Parses a string as a boolean (case-insensitive "true").
 * @param {string} value
 * @returns {boolean}
 */
export function parseBoolean(value) {
  return /^true$/i.test(value);
}

/**
 * Returns a random value in the range [min, max).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInRange(min, max) {
  return totalTime(min + internalRandom() * (max - min));
}

/**
 * Pretty-prints an object as indented JSON.
 * @param {*} obj
 * @returns {string}
 */
export function prettyPrint(obj) {
  return JSON.stringify(obj, null, '  ');
}

/**
 * Wraps a value in an array if it is not already one.
 * @param {*} value
 * @returns {Array}
 */
export function ensureArray(value) {
  return Array.isArray(value) ? value : [value];
}

/**
 * Returns the first defined (non-null, non-undefined) argument.
 * @param {...*} args
 * @returns {*}
 */
export function coalesce(...args) {
  for (const arg of args) {
    if (gd(arg)) return arg;
  }
}

/**
 * Formats a number as an integer string (no decimals), or undefined if not a number.
 * @param {number} value
 * @returns {string|undefined}
 */
export function formatInteger(value) {
  return wc(value) ? value.toFixed(0) : undefined;
}

/**
 * Converts milliseconds to seconds and formats as integer string.
 * @param {number} ms
 * @returns {string|undefined}
 */
export function formatSeconds(ms) {
  return wc(ms) ? (ms / 1000).toFixed(0) : undefined;
}

/**
 * Copies an array-like object into a new Array.
 * @param {ArrayLike} arrayLike
 * @returns {Array}
 */
export function toArray(arrayLike) {
  const result = [];
  for (let i = 0; i < arrayLike.length; i++) {
    result[i] = arrayLike[i];
  }
  return result;
}

/**
 * Iterates over own properties of an object, invoking callback(key, value).
 * @param {object} obj
 * @param {function(string, *): void} callback
 */
export function forEachProperty(obj, callback) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      callback(key, obj[key]);
    }
  }
}

/**
 * Copies properties from source to target with optional transformations.
 * @param {object} target
 * @param {object} source
 * @param {object} [options]
 * @param {boolean} [options.aea] - Lowercase property names
 * @param {string} [options.prefix] - Prefix to prepend to property names
 * @param {boolean} [options.jxa] - Only copy defined values
 * @returns {object} The target object
 */
export function assignProperties(target, source, options) {
  if (!source) return target;

  if (options) {
    const { aea: lowercaseKeys, prefix, jxa: skipUndefined } = options;
    forEachProperty(source, (key, value) => {
      if (!skipUndefined || gd(value)) {
        target[(prefix || '') + (lowercaseKeys ? key.toLowerCase() : key)] = value;
      }
    });
  } else {
    forEachProperty(source, (key, value) => {
      target[key] = value;
    });
  }
  return target;
}

/**
 * Parses a string as a base-10 integer.
 * @param {string} value
 * @returns {number}
 */
export function parseInteger(value) {
  return parseInt(value, 10);
}

/**
 * Escapes HTML special characters in a string.
 * @param {string} str
 * @returns {string}
 */
export const escapeHtml = (() => {
  const entityMap = {
    '&': '&amp;',
    "'": '&#39;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;',
  };
  const pattern = /[&'"<>]/g;

  function replaceEntity(char) {
    assert(entityMap[char] !== undefined);
    return entityMap[char];
  }

  return (str) => str.replace(pattern, replaceEntity);
})();

/**
 * Trims leading and trailing whitespace from each line.
 * @param {string} str
 * @returns {string}
 */
export const trim = (() => {
  const pattern = /^\s+|\s+$/gm;
  return (str) => str.replace(pattern, '');
})();

/**
 * Serializes an Error object into a formatted string including stack, message, and number.
 * @param {Error} error
 * @returns {string|undefined}
 */
export function formatError(error) {
  if (!error) return undefined;

  const stack = error.stack;
  const number = error.number;
  let message = error.message;

  if (!message) {
    message = '' + error;
  }

  let result;
  if (stack) {
    result = '' + stack;
    if (result.indexOf(message) !== 0) {
      result = message + '\n' + result;
    }
  } else {
    result = message;
  }

  if (number) {
    result += '\nnumber:' + number;
  }

  return result;
}

// Legacy export aliases
export { formatError as initializeModel };
