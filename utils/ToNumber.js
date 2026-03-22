/**
 * @file ToNumber - ES specification-compliant ToNumber abstract operation
 * @module utils/ToNumber
 * @description Implements the ECMAScript ToNumber abstract operation with proper
 * handling of binary (0b), octal (0o), and hex (0x) literals, Unicode whitespace,
 * Symbol and BigInt rejection. This is a polyfill/spec-compliance utility.
 * @original Module_84583
 */

import GetIntrinsic from '../utils/GetIntrinsic.js';
import TypeError from '../utils/TypeError.js';
import callBound from '../utils/CallBound.js';
import regexTest from '../utils/RegexTest.js';
import isPrimitive from '../utils/IsPrimitive.js';
import ToPrimitive from '../utils/ToPrimitive.js';
import trimWhitespace from '../utils/TrimWhitespace.js';

const $Number = GetIntrinsic('%Number%');
const $RegExp = GetIntrinsic('%RegExp%');
const $parseInt = GetIntrinsic('%parseInt%');

const stringSlice = callBound('String.prototype.slice');

/** @type {Function} Test for binary literal (0b...) */
const isBinaryLiteral = regexTest(/^0b[01]+$/i);

/** @type {Function} Test for octal literal (0o...) */
const isOctalLiteral = regexTest(/^0o[0-7]+$/i);

/** @type {Function} Test for invalid hex with sign (-+0x...) */
const isInvalidHexLiteral = regexTest(/^[-+]0x[0-9a-f]+$/i);

/** @type {Function} Test for problematic Unicode characters */
const hasProblematicUnicode = regexTest(new $RegExp('[\u0085\u200b\ufffe]', 'g'));

/**
 * Convert a value to a Number following the ES specification.
 *
 * Handles:
 * - Binary literals (0b...) parsed as base-2
 * - Octal literals (0o...) parsed as base-8
 * - Rejects Symbol and BigInt with TypeError
 * - Strips whitespace before conversion
 * - Returns NaN for problematic Unicode or signed hex literals
 *
 * @param {*} value - The value to convert to a number
 * @returns {number} The numeric result
 * @throws {TypeError} If value is a Symbol or BigInt
 */
export function ToNumber(value) {
    let input = isPrimitive(value) ? value : ToPrimitive(value, $Number);

    if (typeof input === 'symbol') {
        throw new TypeError('Cannot convert a Symbol value to a number');
    }

    if (typeof input === 'bigint') {
        throw new TypeError("Conversion from 'BigInt' to 'number' is not allowed.");
    }

    if (typeof input === 'string') {
        if (isBinaryLiteral(input)) {
            return ToNumber($parseInt(stringSlice(input, 2), 2));
        }
        if (isOctalLiteral(input)) {
            return ToNumber($parseInt(stringSlice(input, 2), 8));
        }
        if (hasProblematicUnicode(input) || isInvalidHexLiteral(input)) {
            return NaN;
        }
        const trimmed = trimWhitespace(input);
        if (trimmed !== input) {
            return ToNumber(trimmed);
        }
    }

    return +input;
}

export default ToNumber;
