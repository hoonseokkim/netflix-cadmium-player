/**
 * Netflix Cadmium Player - Time Units
 *
 * Defines the time unit hierarchy used throughout the player for precise
 * media timing: microseconds, milliseconds, seconds, minutes, and hours.
 * Provides factory functions to create Duration instances from various units.
 *
 * @module TimeUnits
 */

// import { TimeUnit as BaseTimeUnit, Duration } from '../core/DataSizeUnits.js'; // webpack module 35201

/**
 * Extended TimeUnit for the player's time unit definitions.
 * @extends BaseTimeUnit
 */
export class PlayerTimeUnit extends BaseTimeUnit {
    constructor(...args) {
        super(...args);
    }
}

/** @type {PlayerTimeUnit} Microsecond time unit (base unit, factor = 1) */
export const MICROSECONDS = new PlayerTimeUnit(1, "\u03bcs");

/** @type {PlayerTimeUnit} Millisecond time unit (1000 microseconds) */
export const MILLISECONDS = new PlayerTimeUnit(1000, "ms", MICROSECONDS);

/** @type {PlayerTimeUnit} Second time unit (1,000,000 microseconds) */
export const SECONDS = new PlayerTimeUnit(1000 * MILLISECONDS.unitName, "s", MICROSECONDS);

/** @type {PlayerTimeUnit} Minute time unit (60 seconds) */
export const MINUTES = new PlayerTimeUnit(60 * SECONDS.unitName, "min", MICROSECONDS);

/** @type {PlayerTimeUnit} Hour time unit (60 minutes) */
export const HOURS = new PlayerTimeUnit(60 * MINUTES.unitName, "hr", MICROSECONDS);

/** @type {Duration} Zero-duration constant (0 milliseconds) */
export const ZERO_DURATION = fromMilliseconds(0);

/**
 * Create a Duration from microseconds.
 * @param {number} value - Microsecond count
 * @returns {Duration}
 */
export function fromMicroseconds(value) {
    return new Duration(value, MICROSECONDS);
}

/**
 * Convert seconds to a Duration in microseconds.
 * @param {number} seconds
 * @returns {Duration}
 */
export function fromSecondsToMicroseconds(seconds) {
    return new Duration(seconds * SECONDS.unitName, MICROSECONDS);
}

/**
 * Create a Duration from milliseconds.
 * @param {number} value - Millisecond count
 * @returns {Duration}
 */
export function fromMilliseconds(value) {
    return new Duration(value, MILLISECONDS);
}

/**
 * Create a Duration from seconds.
 * @param {number} value - Second count
 * @returns {Duration}
 */
export function fromSeconds(value) {
    return new Duration(value, SECONDS);
}

/**
 * Create a Duration from minutes.
 * @param {number} value - Minute count
 * @returns {Duration}
 */
export function fromMinutes(value) {
    return new Duration(value, MINUTES);
}

/**
 * Create a Duration from hours.
 * @param {number} value - Hour count
 * @returns {Duration}
 */
export function fromHours(value) {
    return new Duration(value, HOURS);
}

/**
 * Create a timestamp Duration from a millisecond value.
 * @param {number} ms - Millisecond timestamp
 * @returns {Duration}
 */
export function timestamp(ms) {
    return fromMilliseconds(ms);
}
