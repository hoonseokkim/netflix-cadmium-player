/**
 * Netflix Cadmium Player — Observable Boolean
 *
 * An EventEmitter-based observable that holds a boolean value, emitting
 * "yes" or "no" events on change.  Provides a deferred promise that
 * resolves when the first value is set.
 *
 * @module ObservableBool
 */

// Dependencies
// import { __extends } from 'tslib';
// import { Deferred } from './modules/Module_91176';
// import { EventEmitter } from './modules/Module_90745';

/**
 * An observable boolean value backed by an EventEmitter.
 *
 * Emits `"yes"` when set to `true` and `"no"` when set to `false`.
 * The `firstValue` promise resolves when a value is set for the first time.
 *
 * @extends EventEmitter
 */
export class ObservableBool extends EventEmitter {
  /**
   * @param {Promise<boolean>} [initialPromise] - Optional promise whose
   *   resolved value is used to set the initial state.
   */
  constructor(initialPromise) {
    super();

    /** @private */
    this._deferred = new Deferred();

    /** @type {Promise<ObservableBool>} Resolves on the first value set. */
    this.firstValue = this._deferred.promise;

    /** @type {boolean|undefined} Current value. */
    this.value = undefined;

    initialPromise?.then((value) => this.set(value));
  }

  /**
   * Sets the boolean value. Only emits and resolves if the value changes.
   *
   * @param {boolean} value - The new value.
   * @returns {this}
   */
  set(value) {
    if (value !== this.value) {
      if (this.value === undefined) {
        this._deferred.resolve(this);
      }
      this.value = value;
      this.emit(value ? "yes" : "no");
    }
    return this;
  }

  /**
   * Returns the current value (alias for `value`).
   * @type {boolean|undefined}
   */
  get isTrue() {
    return this.value;
  }

  /**
   * Returns the negation of the current value, or undefined if not yet set.
   * @type {boolean|undefined}
   */
  get isFalse() {
    if (this.value !== undefined) {
      return !this.value;
    }
    return undefined;
  }

  /**
   * @returns {string} String representation of the current value.
   */
  toString() {
    return String(this.value);
  }
}
