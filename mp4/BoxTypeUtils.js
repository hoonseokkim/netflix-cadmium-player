/**
 * Netflix Cadmium Player -- BoxTypeUtils
 *
 * Utility functions for converting between MP4/ISOBMFF box type codes
 * (four-character codes like 'moov', 'moof', 'mdat') and their 32-bit
 * integer representations, plus a timescale conversion helper.
 *
 * @module mp4/BoxTypeUtils
 * @original Module_32296
 * @dependencies
 *   Module 93334 - assert utility
 */

import { assert } from '../utils/TypeValidator'; // Module 93334

/**
 * Converts a 32-bit unsigned integer to a 4-character box type string.
 *
 * For example, 0x6D6F6F76 -> "moov"
 *
 * @param {number} value - 32-bit unsigned integer representing the box type
 * @returns {string} 4-character string
 */
export function uint32ToBoxType(value) {
    assert("number" === typeof value);
    return (
        String.fromCharCode((value >>> 24) & 0xFF) +
        String.fromCharCode((value >>> 16) & 0xFF) +
        String.fromCharCode((value >>> 8) & 0xFF) +
        String.fromCharCode(value & 0xFF)
    );
}

/**
 * Converts a 4-character box type string to a 32-bit unsigned integer.
 *
 * For example, "moov" -> 0x6D6F6F76
 *
 * @param {string} str - 4-character box type string
 * @returns {number} 32-bit unsigned integer
 */
export function boxTypeToUint32(str) {
    return (
        str.charCodeAt(3) +
        (str.charCodeAt(2) << 8) +
        (str.charCodeAt(1) << 16) +
        (str.charCodeAt(0) << 24)
    );
}

/**
 * Converts a timestamp from timescale units to milliseconds.
 *
 * @param {number} timestamp - Time value in timescale units
 * @param {number} timescale - Number of units per second
 * @returns {number} Time in milliseconds (floored to integer)
 */
export function timescaleToMilliseconds(timestamp, timescale) {
    return Math.floor(1000 * timestamp / timescale);
}
