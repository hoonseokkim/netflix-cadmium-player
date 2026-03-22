/**
 * Netflix Cadmium Player - Deferred
 *
 * A deferred promise utility that exposes resolve/reject methods externally.
 * Tracks whether the promise has been settled and provides a bindable
 * `then` accessor for chaining. Used throughout the player for coordinating
 * async operations where the resolution trigger is separate from the consumer.
 *
 * @module core/Deferred
 * @template T
 */

/**
 * Wraps a Promise and exposes its resolve/reject controls externally.
 * @template T
 */
export class Deferred {
  constructor() {
    /** @type {boolean} Whether this deferred has been settled */
    this.isSettled = false;

    /** @type {Promise<T>} The underlying promise */
    this.promise = new Promise((resolve, reject) => {
      /** @private */
      this._resolve = resolve;
      /** @private */
      this._reject = reject;
    });
  }

  /**
   * Returns a bound `then` method for the underlying promise,
   * allowing this deferred to be used directly in promise chains.
   * @returns {Function}
   */
  get then() {
    return this.promise.then.bind(this.promise);
  }

  /**
   * Whether this deferred has been settled (resolved or rejected).
   * @returns {boolean}
   */
  get settled() {
    return this.isSettled;
  }

  /**
   * Resolves the deferred with the given value.
   * @param {T} value - The resolution value.
   */
  resolve(value) {
    this.isSettled = true;
    this._resolve?.call(this, value);
    this._reject = this._resolve = undefined;
  }

  /**
   * Rejects the deferred with the given reason.
   * @param {*} reason - The rejection reason.
   */
  reject(reason) {
    this.isSettled = true;
    this._reject?.call(this, reason);
    this._reject = this._resolve = undefined;
  }
}
