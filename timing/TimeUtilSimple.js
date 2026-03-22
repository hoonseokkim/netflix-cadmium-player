/**
 * Netflix Cadmium Player - TimeUtil (Simplified Implementation)
 *
 * A lighter-weight rational time representation using ticks/timescale.
 * Used in contexts where the full TimeUtil feature set is not needed
 * (e.g., within the ASE or isolated utility modules).
 *
 * Provides core arithmetic, comparison, and conversion operations
 * without the display formatting and extended comparison methods
 * of the full TimeUtil.
 *
 * @module timing/TimeUtilSimple
 */

/**
 * Computes the greatest common divisor of two integers.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function computeGCD(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Computes the least common multiple of two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number|false}
 */
function computeLCM(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') return false;
  return a && b ? Math.abs((a * b) / computeGCD(a, b)) : 0;
}

/**
 * Simplified rational time class using ticks/timescale representation.
 * Suitable for lightweight timing operations without full formatting support.
 */
export class TimeUtilSimple {
  /**
   * @param {number|Object} ticks - Tick count, or object with { ticks, timescale }.
   * @param {number} [timescale] - Ticks per second.
   */
  constructor(ticks, timescale) {
    if (typeof ticks === 'object') {
      this.ticks = ticks.ticks;
      this.timescale = ticks.timescale;
    } else {
      this.ticks = ticks;
      this.timescale = timescale;
    }
  }

  /** Creates from milliseconds. */
  static fromMilliseconds(ms) {
    return new TimeUtilSimple(ms, 1000);
  }

  /** Converts ticks to milliseconds. */
  static ticksToMs(ticks, timescale) {
    return Math.floor((1000 * ticks) / timescale);
  }

  /** Converts milliseconds to ticks. */
  static msToTicks(ms, timescale) {
    return Math.floor((ms * timescale) / 1000);
  }

  static max(...times) {
    return times.reduce((a, b) => (a.greaterThan(b) ? a : b));
  }

  static min(...times) {
    return times.reduce((a, b) => (a.lessThan(b) ? a : b));
  }

  /** @returns {number} Value in milliseconds (precise float). */
  get milliseconds() {
    return (1000 * this.ticks) / this.timescale;
  }

  /** @returns {number} Value in seconds. */
  get seconds() {
    return this.ticks / this.timescale;
  }

  /** Rescales to a new timescale. */
  rescale(newTimescale) {
    const factor = newTimescale / this.timescale;
    return new TimeUtilSimple(
      Math.floor(this.ticks * factor),
      Math.floor(this.timescale * factor)
    );
  }

  /** Adds another time. */
  add(other) {
    if (this.timescale === other.timescale) {
      return new TimeUtilSimple(this.ticks + other.ticks, this.timescale);
    }
    const common = computeLCM(this.timescale, other.timescale);
    return this.rescale(common).add(other.rescale(common));
  }

  /** Subtracts another time. */
  subtract(other) {
    return this.add(new TimeUtilSimple(-other.ticks, other.timescale));
  }

  /** Multiplies by a scalar. */
  multiply(factor) {
    return new TimeUtilSimple(this.ticks * factor, this.timescale);
  }

  /** Divides by another time, returning a ratio. */
  divide(other) {
    if (this.timescale === other.timescale) {
      return this.ticks / other.ticks;
    }
    const common = computeLCM(this.timescale, other.timescale);
    return this.rescale(common).divide(other.rescale(common));
  }

  /** Returns the reciprocal. */
  reciprocal() {
    return new TimeUtilSimple(this.timescale, this.ticks);
  }

  // --- Comparison ---

  /** @private */
  _compare(compareFn, other) {
    if (this.timescale === other.timescale) {
      return compareFn(this.ticks, other.ticks);
    }
    const common = computeLCM(this.timescale, other.timescale);
    return compareFn(this.rescale(common).ticks, other.rescale(common).ticks);
  }

  equal(other) { return this._compare((a, b) => a === b, other); }
  lessThan(other) { return this._compare((a, b) => a < b, other); }
  greaterThan(other) { return this._compare((a, b) => a > b, other); }
  lessThanOrEqual(other) { return this._compare((a, b) => a <= b, other); }
  greaterThanOrEqual(other) { return this._compare((a, b) => a >= b, other); }

  toJSON() {
    return { ticks: this.ticks, timescale: this.timescale };
  }

  toString() {
    return `${this.ticks}/${this.timescale}`;
  }

  /** Zero time. */
  static ZERO = new TimeUtilSimple(0, 1);
  /** One millisecond. */
  static ONE_MS = new TimeUtilSimple(1, 1000);
}
