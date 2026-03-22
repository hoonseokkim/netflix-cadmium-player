/**
 * Netflix Cadmium Player - Loose Equality Check
 *
 * Compares two values for equality, returning true if they are strictly equal
 * or if both are NaN (using an isNaN utility).
 *
 * @module LooseEquals
 * @see Module_99939
 */

import isNaN from '../utils/IsNaN.js';

/**
 * Checks if two values are equal, treating NaN === NaN as true.
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean} True if values are equal or both are NaN
 */
export default function looseEquals(a, b) {
    return a === b || (isNaN(a) && isNaN(b));
}
