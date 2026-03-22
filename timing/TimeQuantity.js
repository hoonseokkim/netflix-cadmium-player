/**
 * @module TimeQuantity
 * @description Provides immutable time quantity and time unit classes for
 * the Cadmium player's timing subsystem. TimeUnit defines named units
 * (milliseconds, seconds, ticks, etc.) with conversion factors. TimeQuantity
 * represents a specific duration in a given unit and supports conversion,
 * arithmetic (add, subtract, scale), and comparison operations.
 * @origin Module_35201
 */

import { buildTransportPacket } from '../utils/ObjectUtils.js';

/**
 * Represents a unit of time with a name and a conversion factor.
 */
export class TimeUnit {
  /**
   * @param {number} factor - Conversion factor relative to the base unit
   * @param {string} name - Human-readable name (e.g. "ms", "seconds", "ticks")
   * @param {TimeUnit} [baseUnit] - The base unit for conversions (defaults to self)
   */
  constructor(factor, name, baseUnit) {
    /** @type {number} */
    this.factor = factor;

    /** @type {string} */
    this.name = name;

    /** @type {TimeUnit} */
    this.baseUnit = baseUnit || this;

    buildTransportPacket(this, 'base');
  }

  /**
   * Checks equality with another TimeUnit by comparing factors.
   * @param {TimeUnit} other
   * @returns {boolean}
   */
  equals(other) {
    return this.factor === other.factor;
  }

  /**
   * @returns {string} JSON representation (the unit name)
   */
  toJSON() {
    return this.name;
  }
}

/**
 * Represents an immutable time quantity with a magnitude and unit.
 * Supports unit conversion, arithmetic, and comparison.
 */
export class TimeQuantity {
  /**
   * @param {number} magnitude - The numeric value
   * @param {TimeUnit} unit - The time unit
   */
  constructor(magnitude, unit) {
    /** @type {TimeUnit} */
    this.unit = unit;

    /** @type {number} */
    this.magnitude = Math.floor(magnitude);

    /** @type {string} */
    this.display = this.magnitude + ' ' + this.unit.name;
  }

  /**
   * Converts this quantity to the target unit, returning the floored integer value.
   * @param {TimeUnit} targetUnit
   * @returns {number}
   */
  toUnit(targetUnit) {
    if (this.unit.equals(targetUnit)) {
      return this.magnitude;
    }
    return Math.floor(this.magnitude * this.unit.factor / targetUnit.factor);
  }

  /**
   * Converts this quantity to the target unit, returning the precise (non-floored) value.
   * @param {TimeUnit} targetUnit
   * @returns {number}
   */
  toPreciseUnit(targetUnit) {
    if (this.unit.equals(targetUnit)) {
      return this.magnitude;
    }
    return this.magnitude * this.unit.factor / targetUnit.factor;
  }

  /**
   * Returns a new TimeQuantity converted to the target unit (floored).
   * @param {TimeUnit} targetUnit
   * @returns {TimeQuantity}
   */
  as(targetUnit) {
    return new TimeQuantity(this.toUnit(targetUnit), targetUnit);
  }

  /**
   * Returns a new TimeQuantity converted to the target unit (floored).
   * Alias for `as()`.
   * @param {TimeUnit} targetUnit
   * @returns {TimeQuantity}
   */
  to(targetUnit) {
    return new TimeQuantity(this.toUnit(targetUnit), targetUnit);
  }

  /**
   * @returns {string} Human-readable display string (e.g. "1500 ms")
   */
  toString() {
    return this.display;
  }

  /**
   * @returns {{ magnitude: number, units: string }}
   */
  toJSON() {
    return {
      magnitude: this.magnitude,
      units: this.unit.name,
    };
  }

  /**
   * Adds another TimeQuantity to this one (in the common base unit).
   * @param {TimeQuantity} other
   * @returns {TimeQuantity}
   */
  add(other) {
    return this._combine(other);
  }

  /**
   * Subtracts another TimeQuantity from this one (in the common base unit).
   * @param {TimeQuantity} other
   * @returns {TimeQuantity}
   */
  subtract(other) {
    return this._combine(other, (v) => -v);
  }

  /**
   * Multiplies this quantity by a scalar factor.
   * @param {number} factor
   * @returns {TimeQuantity}
   */
  scale(factor) {
    return new TimeQuantity(this.toUnit(this.unit.baseUnit) * factor, this.unit.baseUnit);
  }

  /**
   * Returns the signed difference between this and another quantity
   * in the common base unit.
   * @param {TimeQuantity} other
   * @returns {number}
   */
  difference(other) {
    return this.toUnit(this.unit.baseUnit) - other.toUnit(this.unit.baseUnit);
  }

  /**
   * Checks equality with another TimeQuantity.
   * @param {TimeQuantity} other
   * @returns {boolean}
   */
  equals(other) {
    return this.difference(other) === 0;
  }

  /**
   * Checks if this quantity is zero.
   * @returns {boolean}
   */
  isZero() {
    return this.magnitude === 0;
  }

  /**
   * Checks if this quantity is negative.
   * @returns {boolean}
   */
  isNegative() {
    return this.magnitude < 0;
  }

  /**
   * Checks if this quantity is positive.
   * @returns {boolean}
   */
  isPositive() {
    return this.magnitude > 0;
  }

  /**
   * Combines two TimeQuantity values using the common base unit.
   * @param {TimeQuantity} other
   * @param {Function} [transform=identity] - Optional transform for the other value
   * @returns {TimeQuantity}
   * @private
   */
  _combine(other, transform = (v) => v) {
    const baseUnit = this.unit.baseUnit;
    return new TimeQuantity(
      this.toUnit(baseUnit) + transform(other.toUnit(baseUnit)),
      baseUnit
    );
  }
}
