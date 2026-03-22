/**
 * Netflix Cadmium Player - Network Error Policy Decorator
 *
 * Decorates ASE zone serialization and instance creation to handle
 * network-level errors (HTTP status 0 or 900). When a network error
 * is detected, marks the instance for ASE retry and resets the zone
 * backoff delay to zero for immediate retry.
 *
 * @module ase/NetworkErrorPolicyDecorator
 */

/**
 * Policy decorator that modifies ASE behavior for network errors.
 *
 * Status 0 indicates a network failure (connection refused, DNS failure, etc.).
 * Status 900 is a custom Netflix error code for transport-level failures.
 * Both trigger immediate retry with zero backoff.
 */
export class NetworkErrorPolicyDecorator {
  /**
   * Decorates instance creation: if a network error is detected,
   * ensures the ASE retry flag defaults to true.
   *
   * @param {Object} context - The request context with a `response` property.
   * @param {Function} createFn - The original instance creation function.
   * @returns {Object} The created instance, potentially with retry enabled.
   */
  createInstance(context, createFn) {
    const instance = createFn(context);
    if (this._isNetworkError(context)) {
      instance.shouldRetry = instance.shouldRetry ?? true;
    }
    return instance;
  }

  /**
   * Decorates zone serialization: if a network error is detected,
   * resets the backoff delay to zero for immediate retry.
   *
   * @param {Object} context - The request context with a `response` property.
   * @param {Function} serializeFn - The original zone serialization function.
   * @returns {Object} The serialized zone, potentially with backoff reset to 0.
   */
  serializeZone(context, serializeFn) {
    const zone = serializeFn(context);
    if (this._isNetworkError(context)) {
      zone.backoffDelay = 0;
    }
    return zone;
  }

  /**
   * Checks whether the response indicates a network-level error.
   *
   * @param {Object} context - Context containing a response object.
   * @returns {boolean|undefined} True if status is 0 or 900 and response is not ok.
   * @private
   */
  _isNetworkError({ response }) {
    if (
      !response.ok &&
      (response.status === 0 || response.status === 900)
    ) {
      return true;
    }
  }
}
