/**
 * @module ArrayBufferSlice
 * @description Cross-platform utility to slice typed arrays (Uint8Array).
 * Handles environments where Uint8Array.prototype.slice may not be available
 * by falling back to ArrayBuffer.prototype.slice.
 *
 * @original Module 1084
 */

/**
 * Slices a Uint8Array, returning a new Uint8Array containing the specified range.
 * Uses native slice when available, otherwise falls back to buffer.slice.
 *
 * @param {Uint8Array} array - The source typed array to slice
 * @param {number} [start=0] - The beginning index (inclusive)
 * @param {number} [end=array.buffer.byteLength] - The ending index (exclusive)
 * @returns {Uint8Array} A new Uint8Array containing the sliced data
 */
export function sliceTypedArray(array, start, end) {
    if (array.slice) {
        return array.slice(start, end);
    }
    return new Uint8Array(array.buffer.slice(start || 0, end || array.buffer.byteLength));
}
