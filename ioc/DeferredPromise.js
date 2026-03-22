/**
 * @module ioc/DeferredPromise
 * @description A minimal deferred promise utility that creates a Promise and
 *              exposes its resolve and reject methods as instance properties.
 *              Unlike the more full-featured Deferred (Module 28999), this
 *              version does not track settled state or provide a bindable `then`.
 *
 * @see Module_94293
 */

/**
 * Creates a promise with externally accessible resolve/reject methods.
 * @class DeferredPromise
 */
class DeferredPromise {
  constructor() {
    /** @type {Promise} The underlying promise */
    this.promise = new Promise((resolve, reject) => {
      /** @type {Function} Resolves the promise */
      this.resolve = resolve;
      /** @type {Function} Rejects the promise */
      this.reject = reject;
    });
  }
}

export { DeferredPromise };
