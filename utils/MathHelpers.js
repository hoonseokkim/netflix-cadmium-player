/**
 * @module MathHelpers
 * @description Numeric utility functions: clamping, linear interpolation (lerp),
 * and millisecond-to-seconds formatting.
 *
 * @see Module_8825
 */

import { isNumber } from '../utils/TypeCheckers';

/**
 * Clamps a value between a minimum and maximum.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Linearly interpolates (remaps) a value from one range to another.
 * @param {number} value - Input value
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number}
 */
export function lerp(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Formats a millisecond value as seconds with 3 decimal places.
 * Returns undefined if the value is not a number.
 * @param {number} ms
 * @returns {string|undefined}
 */
export function formatMillisecondsAsSeconds(ms) {
  if (isNumber(ms)) {
    return (ms / 1000).toFixed(3);
  }
}

export { clamp, lerp, formatMillisecondsAsSeconds };
