/**
 * @file ArrayUtils.js
 * @description Utility functions for working with arrays, objects, and sorting.
 * Provides helpers for hiding object properties, flattening arrays,
 * and comparator functions for numeric/string sorting.
 * @module utils/ArrayUtils
 * @see Module_66523
 */

/**
 * Makes an existing property non-enumerable on an object.
 * Useful for hiding internal properties from serialization (JSON.stringify, for..in).
 * @param {Object} obj - The target object
 * @param {string} prop - The property name to hide
 */
export function hideProperty(obj, prop) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (descriptor) {
    Object.defineProperty(obj, prop, {
      configurable: descriptor.configurable,
      enumerable: false,
      value: descriptor.value,
      writable: descriptor.writable,
    });
  }
}

/**
 * Flattens a nested array structure into a single-level array.
 * @param {Array<Array>} arr - The nested array to flatten
 * @returns {Array} The flattened array
 */
export function flatten(arr) {
  return [].concat.apply([], [...arr]);
}

/**
 * Numeric comparator function for Array.prototype.sort().
 * Sorts numbers in ascending order.
 * @param {number} a
 * @param {number} b
 * @returns {number} Negative if a < b, positive if a > b, zero if equal
 */
export function numericCompare(a, b) {
  return a - b;
}

/**
 * String comparator function for Array.prototype.sort().
 * Uses locale-aware comparison for proper unicode ordering.
 * @param {string} a
 * @param {string} b
 * @returns {number} Negative if a < b, positive if a > b, zero if equal
 */
export function stringCompare(a, b) {
  return a.localeCompare(b);
}
