/**
 * Netflix Cadmium Player - DI Metadata
 *
 * Key-value metadata entry used in the dependency injection container.
 * Represents either a named binding (key === "named") or a tagged
 * binding (arbitrary key-value pair). Part of the InversifyJS-inspired
 * DI system.
 *
 * @module di/Metadata
 */

/** @type {string} The key string used for named bindings */
const NAMED_TAG = 'named';

/**
 * A metadata tag for DI bindings, supporting named and tagged formats.
 */
export class Metadata {
  /**
   * @param {string|symbol} key - The metadata key ("named" for named bindings).
   * @param {*} value - The metadata value.
   */
  constructor(key, value) {
    /** @type {string|symbol} Metadata key */
    this.key = key;
    /** @type {*} Metadata value */
    this.value = value;
  }

  /**
   * Returns a human-readable string representation.
   *
   * Named bindings display as "named: <value>".
   * Tagged bindings display as "tagged: { key: <key>, value: <value> }".
   *
   * @returns {string}
   */
  toString() {
    return this.key === NAMED_TAG
      ? `named: ${this.value.toString()} `
      : `tagged: { key:${this.key.toString()}, value: ${this.value} }`;
  }
}
