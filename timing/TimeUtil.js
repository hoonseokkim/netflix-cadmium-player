/**
 * Netflix Cadmium Player - TimeUtil (Full Implementation)
 *
 * Rational time representation using ticks/timescale for sample-accurate
 * media timing. This is the primary version with full comparison, arithmetic,
 * serialization, and display formatting support.
 *
 * All media timing in the Cadmium player uses this class to avoid
 * floating-point precision errors. Times are represented as rational
 * numbers (ticks/timescale) where timescale is typically 1000 (ms)
 * or a media-specific value like 90000 (MPEG-TS).
 *
 * @module timing/TimeUtil
 */

/**
 * Computes the least common multiple of two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function lcm(a, b) {
  return a && b ? Math.abs((a * b) / gcd(a, b)) : 0;
}

/**
 * Display format options for time values.
 * @enum {string}
 */
export const TimeDisplayFormat = {
  /** Milliseconds display */
  MILLISECONDS: 'ms',
  /** Simple ms suffix display */
  SIMPLE: 'simple',
};

/**
 * Represents a rational time value as ticks/timescale, providing
 * sample-accurate arithmetic and comparison for media playback.
 */
export class TimeUtil {
  /**
   * @param {number|Object} ticks - Tick count, or object with { ticks, timescale }.
   * @param {number} [timescale] - Ticks per second (e.g. 1000 for ms).
   */
  constructor(ticks, timescale) {
    if (typeof ticks === 'object') {
      this.ticks = ticks.ticks;
      this.timescale = ticks.timescale;
    } else {
      this.ticks = ticks;
      this.timescale = timescale;
    }
    if (!isFinite(this.ticks)) {
      this.timescale = 1;
    }
  }

  // --- Static Factory Methods ---

  /**
   * Creates a TimeUtil from milliseconds.
   * @param {number} ms
   * @returns {TimeUtil}
   */
  static fromMilliseconds(ms) {
    return ms === 0 ? TimeUtil.ZERO : new TimeUtil(ms, 1000);
  }

  /**
   * Creates a TimeUtil from seconds.
   * @param {number} seconds
   * @returns {TimeUtil}
   */
  static fromSeconds(seconds) {
    return seconds === 0
      ? TimeUtil.ZERO
      : new TimeUtil(1000 * seconds, 1000);
  }

  /**
   * Converts ticks to milliseconds.
   * @param {number} ticks
   * @param {number} timescale
   * @returns {number}
   */
  static ticksToMs(ticks, timescale) {
    return Math.floor((1000 * ticks) / timescale);
  }

  /**
   * Converts milliseconds to ticks.
   * @param {number} ms
   * @param {number} timescale
   * @returns {number}
   */
  static msToTicks(ms, timescale) {
    return Math.floor((ms * timescale) / 1000);
  }

  /** Returns the maximum of the provided times. */
  static max(...times) {
    return times.reduce((a, b) => (a.greaterThan(b) ? a : b));
  }

  /** Returns the minimum of the provided times. */
  static min(...times) {
    return times.reduce((a, b) => (a.lessThan(b) ? a : b));
  }

  /** Returns the absolute value of a time. */
  static abs(time) {
    return new TimeUtil(Math.abs(time.ticks), time.timescale);
  }

  // --- Getters ---

  /** @returns {number} Value in milliseconds (floored). */
  get milliseconds() {
    return TimeUtil.ticksToMs(this.ticks, this.timescale);
  }

  /** @returns {number} Value in milliseconds (precise float). */
  get preciseMilliseconds() {
    return (1000 * this.ticks) / this.timescale;
  }

  /** @returns {number} Value in seconds (float). */
  get seconds() {
    return this.ticks / this.timescale;
  }

  /** @returns {boolean} Whether this time is finite. */
  isFinite() {
    return !!this.timescale && isFinite(this.ticks);
  }

  // --- Arithmetic ---

  /** Rescales to a new timescale. */
  rescale(newTimescale) {
    const factor = newTimescale / this.timescale;
    return new TimeUtil(
      Math.floor(this.ticks * factor),
      Math.floor(this.timescale * factor)
    );
  }

  /** Adds another TimeUtil. */
  add(other) {
    if (
      !this.isFinite() ||
      !other.isFinite() ||
      this.timescale === other.timescale
    ) {
      return new TimeUtil(this.ticks + other.ticks, this.timescale);
    }
    const common = lcm(this.timescale, other.timescale);
    return new TimeUtil(
      (this.ticks * common) / this.timescale +
        (other.ticks * common) / other.timescale,
      common
    );
  }

  /** Subtracts another TimeUtil. */
  subtract(other) {
    if (this.timescale === other.timescale) {
      return new TimeUtil(this.ticks - other.ticks, this.timescale);
    }
    const common = lcm(this.timescale, other.timescale);
    return new TimeUtil(
      (this.ticks * common) / this.timescale -
        (other.ticks * common) / other.timescale,
      common
    );
  }

  /** Multiplies by a scalar. */
  multiply(factor) {
    return factor === 1
      ? this
      : new TimeUtil(this.ticks * factor, this.timescale);
  }

  /** Returns the absolute difference. */
  absoluteDifference(other) {
    if (this.timescale === other.timescale) {
      return new TimeUtil(Math.abs(this.ticks - other.ticks), this.timescale);
    }
    const common = lcm(this.timescale, other.timescale);
    return new TimeUtil(
      Math.abs(
        (this.ticks * common) / this.timescale -
          (other.ticks * common) / other.timescale
      ),
      common
    );
  }

  // --- Comparison ---

  /** @param {TimeUtil} other @returns {boolean} */
  equal(other) {
    return this._compare((a, b) => a === b, other);
  }

  /** @param {TimeUtil} other @returns {boolean} */
  lessThan(other) {
    return this._compare((a, b) => a < b, other);
  }

  /** @param {TimeUtil} other @returns {boolean} */
  greaterThan(other) {
    return this._compare((a, b) => a > b, other);
  }

  /** @param {TimeUtil} other @returns {boolean} */
  lessThanOrEqual(other) {
    return this._compare((a, b) => a <= b, other);
  }

  /** @param {TimeUtil} other @returns {boolean} */
  greaterThanOrEqual(other) {
    return this._compare((a, b) => a >= b, other);
  }

  /** Returns signed comparison value for sorting. */
  compareTo(other) {
    if (this.timescale === other.timescale) {
      return this.ticks === other.ticks ? 0 : this.ticks - other.ticks;
    }
    const common = lcm(this.timescale, other.timescale);
    return (
      (this.ticks * common) / this.timescale -
      (other.ticks * common) / other.timescale
    );
  }

  /**
   * Internal comparison helper that normalizes timescales.
   * @private
   */
  _compare(compareFn, other) {
    if (this.timescale === other.timescale) {
      return compareFn(this.ticks, other.ticks);
    }
    const common = lcm(this.timescale, other.timescale);
    return compareFn(
      (this.ticks * common) / this.timescale,
      (other.ticks * common) / other.timescale
    );
  }

  // --- Serialization ---

  toJSON() {
    return { ticks: this.ticks, timescale: this.timescale };
  }

  toString() {
    return `${this.ticks}/${this.timescale}`;
  }

  /**
   * Debug-friendly display string.
   * @param {string} [format]
   * @returns {string}
   */
  toDisplayString(format) {
    const ms = this.preciseMilliseconds;
    const msStr =
      ms % 1 === 0
        ? ms.toString()
        : ms.toFixed(3).replace(/\.?0+$/, '');

    if (format === TimeDisplayFormat.SIMPLE) {
      return `${msStr}ms`;
    }
    return `${this.ticks}/${this.timescale} (${msStr}ms)`;
  }

  // --- Static Constants ---

  /** Zero time at 1000 ticks/s. */
  static ZERO = new TimeUtil(0, 1000);
  /** One millisecond. */
  static ONE_MS = new TimeUtil(1, 1000);
  /** Positive infinity. */
  static POSITIVE_INFINITY = new TimeUtil(Infinity, 1);
  /** Negative infinity. */
  static NEGATIVE_INFINITY = new TimeUtil(-Infinity, 1);
}
