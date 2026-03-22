/**
 * To Unsigned Integer (ToLength helper)
 *
 * Converts a value to a valid unsigned integer (array length).
 * Clamps the result between 0 and MAX_SAFE_INTEGER.
 * Part of the ES spec-compliant internal abstract operations.
 *
 * @module ToUnsignedInteger
 * @source Module_69808
 */

const MAX_SAFE_INTEGER = require('../core/PlayerConstants').MAX_SAFE_INTEGER; // a(38752)
const toInteger = require('../core/ConfigParameterValidators').toInteger;     // a(76113)

/**
 * Convert a value to a valid unsigned integer (length).
 * @param {*} value - The value to convert.
 * @returns {number} An integer in the range [0, MAX_SAFE_INTEGER].
 */
module.exports = function toUnsignedInteger(value) {
    const integer = toInteger(value);
    if (integer <= 0) return 0;
    if (integer > MAX_SAFE_INTEGER) return MAX_SAFE_INTEGER;
    return integer;
};
