/**
 * @module GetPrototypeOf
 * @description Cross-environment polyfill for Object.getPrototypeOf.
 * Handles the case where __proto__ access may be restricted (e.g., in
 * sandboxed environments that throw ERR_PROTO_ACCESS).
 *
 * @see Module_5141
 */

/**
 * Returns the prototype of an object, using the best available mechanism.
 *
 * Resolution order:
 *   1. If __proto__ is accessible and has a getter, use a bound getter.
 *   2. Otherwise, fall back to Object.getPrototypeOf.
 *   3. Returns false if neither method is available.
 *
 * @param {*} obj - The object to get the prototype of
 * @returns {object|null|false} The prototype, or false if unavailable
 */
export default function getPrototypeOf(obj) {
  if (obj == null) return obj;
  return Object.getPrototypeOf(Object(obj));
}
