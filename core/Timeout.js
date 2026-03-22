/**
 * Netflix Cadmium Player - Timeout
 *
 * A cancellable timeout wrapper around setTimeout. Provides status
 * checking and explicit cancellation with a boolean return indicating
 * whether the timeout was still pending when cancelled.
 *
 * @module core/Timeout
 */

/**
 * Wraps a setTimeout call with cancellation and status inspection.
 */
export class Timeout {
  /**
   * @param {Function} callback - Function to invoke when the timeout fires.
   * @param {number} delayMs - Delay in milliseconds before firing.
   */
  constructor(callback, delayMs) {
    /** @type {number|undefined} The underlying timeout handle */
    this.timeout = setTimeout(() => {
      this.timeout = undefined;
      callback();
    }, delayMs);
  }

  /**
   * Whether the timeout is still pending (has not yet fired or been cancelled).
   * @returns {boolean|undefined} True if pending, undefined if already fired/cancelled.
   */
  get isPending() {
    if (this.timeout) return true;
  }

  /**
   * Cancels the timeout if it is still pending.
   * @returns {boolean|undefined} True if successfully cancelled, undefined if already done.
   */
  clear() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
      return true;
    }
  }
}
