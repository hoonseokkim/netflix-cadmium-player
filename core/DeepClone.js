/**
 * Netflix Cadmium Player — DeepClone
 *
 * Utility function that performs a deep clone of an object by
 * round-tripping through JSON serialization / deserialization.
 *
 * @module core/DeepClone
 */

/**
 * Deep-clone any JSON-serialisable value.
 *
 * @param {*} value - The value to clone. Must be JSON-serialisable.
 * @returns {*} A structurally identical deep copy.
 */
export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}
