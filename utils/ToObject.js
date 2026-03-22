/**
 * @module ToObject
 * @description Converts a value to an Object, throwing on null/undefined.
 * Bundles a RequireObjectCoercible check before wrapping with Object().
 * Also exports a simple "is object or function" predicate.
 *
 * @see Module_8156
 */

/**
 * Converts a value to an Object. Throws TypeError for null/undefined.
 * Equivalent to the ES spec's ToObject abstract operation.
 * @param {*} value
 * @returns {object}
 * @throws {TypeError} If value is null or undefined
 */
export function toObject(value) {
  requireObjectCoercible(value);
  return Object(value);
}

/**
 * Throws TypeError if value is null or undefined (RequireObjectCoercible).
 * @param {*} value
 * @throws {TypeError}
 */
function requireObjectCoercible(value) {
  if (value == null) {
    throw new TypeError(`Cannot convert ${value} to object`);
  }
}

/**
 * Returns true if the value is a non-null object or function.
 * @param {*} value
 * @returns {boolean}
 */
export function isObjectLike(value) {
  return !!value && (typeof value === 'function' || typeof value === 'object');
}

export default toObject;
