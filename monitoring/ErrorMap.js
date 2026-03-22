/**
 * Netflix Cadmium Player - ErrorMap
 * Maps network error codes to error handling strategies (retry, probe, fail).
 * Implements throttling logic to prevent excessive retries on persistent failures.
 * Used by the network monitor to decide how to handle each type of connection error.
 *
 * @module ErrorMap
 */

// import { __importDefault } from 'tslib';
// import { platform } from './Module_66164';
// import NetworkConstants from './Module_14282';

// Error scope levels from NetworkConstants
// const { ErrorScope } = NetworkConstants;
// ErrorScope.CONNECTION = connection-level scope
// ErrorScope.URL = URL-level scope
// ErrorScope.UNDEFINED = undefined scope

// Error action from NetworkConstants
// const { ErrorAction } = NetworkConstants;
// ErrorAction.RETRY = retry the request
// ErrorAction.PROBE = probe the server first, then retry
// ErrorAction.FAIL = fail permanently

/**
 * Maps network error names to categorized handling strategies.
 * Provides retry throttling and CDN-switchable error detection.
 */
class ErrorMap {
  /**
   * Error category constants.
   * Each is a tuple of [ErrorScope, isPermanent].
   */

  /** Timeout-scoped, non-permanent */
  static TIMEOUT_ERROR = [NetworkConstants.ErrorScope.CONNECTION, false];

  /** Timeout-scoped, permanent */
  static TIMEOUT_PERMANENT = [NetworkConstants.ErrorScope.CONNECTION, true];

  /** Undefined scope, non-permanent (generic errors) */
  static GENERIC_ERROR = [NetworkConstants.ErrorScope.UNDEFINED, false];

  /** Undefined scope, permanent */
  static PERMANENT_ERROR = [NetworkConstants.ErrorScope.UNDEFINED, true];

  /** URL-scoped, permanent */
  static URL_PERMANENT = [NetworkConstants.ErrorScope.URL, true];

  /** Special: unclassified error */
  static UNCLASSIFIED = [-1, false];

  /** Undefined scope, non-permanent (transient) */
  static TRANSIENT_ERROR = [NetworkConstants.ErrorScope.UNDEFINED, false];

  /**
   * @param {Object} config - Error handling configuration.
   * @param {boolean} config.httpsConnectErrorAsPerm - Treat HTTPS connect errors as permanent.
   * @param {boolean} config.probeServerWhenError - Whether to probe server on certain errors.
   * @param {number} config.throttledNetworkFailureThresholdMs - Time window for throttling.
   * @param {number} config.maxThrottledNetworkFailures - Max failures before throttling.
   */
  constructor(config) {
    /** @type {Object} */
    this.config = config;

    const c = platform.networkConstants.errorNameMap;

    /**
     * Map of error name -> error category tuple [scope, isPermanent].
     * @type {Object<string, Array>}
     */
    this.errorCategoryMap = {
      [c.INVALID_STATE]: ErrorMap.GENERIC_ERROR,
      [c.UNKNOWN_ERROR]: ErrorMap.GENERIC_ERROR,
      [c.ABORTED]: ErrorMap.GENERIC_ERROR,
      [c.NETWORK_ERROR]: ErrorMap.GENERIC_ERROR,
      [c.SSL_ERROR]: ErrorMap.GENERIC_ERROR,
      [c.PROTOCOL_ERROR]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_4XX]: ErrorMap.PERMANENT_ERROR,
      [c.HTTP_5XX]: ErrorMap.PERMANENT_ERROR,
      [c.HTTP_301]: ErrorMap.TRANSIENT_ERROR,
      [c.HTTP_302]: ErrorMap.TRANSIENT_ERROR,
      [c.HTTP_400]: ErrorMap.UNCLASSIFIED,
      [c.HTTP_403]: ErrorMap.TRANSIENT_ERROR,
      [c.HTTP_404]: ErrorMap.TRANSIENT_ERROR,
      [c.HTTP_407]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_409]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_412]: ErrorMap.TIMEOUT_ERROR,
      [c.HTTP_416]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_500]: ErrorMap.TRANSIENT_ERROR,
      [c.HTTP_502]: ErrorMap.TRANSIENT_ERROR,
      [c.HTTP_503]: ErrorMap.TRANSIENT_ERROR,
      [c.HTTP_504]: ErrorMap.TRANSIENT_ERROR,
      [c.CONNECTION_TIMEOUT]: ErrorMap.PERMANENT_ERROR,
      [c.CONNECTION_REFUSED]: config.httpsConnectErrorAsPerm ? ErrorMap.PERMANENT_ERROR : ErrorMap.TRANSIENT_ERROR,
      [c.CONNECTION_RESET]: ErrorMap.TRANSIENT_ERROR,
      [c.CONNECTION_RESET_ON_CONNECT]: ErrorMap.URL_PERMANENT,
      [c.CONNECTION_CLOSED_ON_CONNECT]: ErrorMap.PERMANENT_ERROR,
      [c.CONNECTION_FAILED]: ErrorMap.URL_PERMANENT,
      [c.CONNECTION_PROXY_ERROR]: ErrorMap.TIMEOUT_PERMANENT,
      [c.CONNECTION_NO_ADDRESS]: ErrorMap.TIMEOUT_PERMANENT,
      [c.DNS_ERROR]: ErrorMap.PERMANENT_ERROR,
      [c.DNS_TIMEOUT]: ErrorMap.URL_PERMANENT,
      [c.DNS_LOOKUP_FAILED]: ErrorMap.TRANSIENT_ERROR,
      [c.SSL_HANDSHAKE_ERROR]: ErrorMap.PERMANENT_ERROR,
      [c.SSL_CERTIFICATE_ERROR]: ErrorMap.PERMANENT_ERROR,
      [c.PROXY_AUTH_REQUIRED]: ErrorMap.PERMANENT_ERROR,
      [c.RANGE_NOT_SATISFIABLE]: ErrorMap.GENERIC_ERROR,
      [c.TOO_MANY_REQUESTS]: ErrorMap.GENERIC_ERROR,
      // HTTP status codes
      [c.HTTP_301_MOVED]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_302_FOUND]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_303_SEE_OTHER]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_307_REDIRECT]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_308_REDIRECT]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_401]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_405]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_406]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_408]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_410]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_413]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_414]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_415]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_429]: ErrorMap.GENERIC_ERROR,
      [c.HTTP_501]: ErrorMap.GENERIC_ERROR,
      [c.CONNECTION_CLOSED]: ErrorMap.TRANSIENT_ERROR,
      [c.TIMEOUT]: ErrorMap.TIMEOUT_ERROR,
    };

    /**
     * Set of error names that are eligible for CDN switching.
     * @type {Object<string, boolean>}
     */
    this.cdnSwitchableErrors = {
      [c.HTTP_301]: true,
      [c.HTTP_403]: true,
      [c.HTTP_404]: true,
      [c.CONNECTION_RESET]: true,
      [c.SSL_ERROR]: true,
    };

    /**
     * Per-CDN failure tracking for throttling.
     * @type {Object<string, Object>}
     */
    this.failureTrackers = {};

    /**
     * Per-CDN last error category cache.
     * @type {Object<string, Array>}
     */
    this.lastErrorCategories = {};
  }

  /**
   * Get the error category for a given error name.
   *
   * @param {string} errorName - The network error name.
   * @returns {Array|undefined} Error category tuple [scope, isPermanent].
   */
  getErrorCategory(errorName) {
    return this.errorCategoryMap[errorName];
  }

  /**
   * Whether the given error name is eligible for CDN switching.
   *
   * @param {string} errorName
   * @returns {boolean}
   */
  isCdnSwitchable(errorName) {
    return !!this.cdnSwitchableErrors[errorName];
  }

  /**
   * Determine the error action (RETRY, PROBE, or FAIL) for a given error
   * and CDN identifier.
   *
   * @param {string} errorName - The network error name.
   * @param {string} cdnId - The CDN identifier.
   * @returns {string} The error action constant.
   */
  getErrorAction(errorName, cdnId) {
    const config = this.config;
    const category = this.getErrorCategory(errorName) || ErrorMap.GENERIC_ERROR;
    this.lastErrorCategories[cdnId] = category;

    if (config.probeServerWhenError && errorName !== platform.networkConstants.errorNameMap.DNS_ERROR) {
      if (category === ErrorMap.GENERIC_ERROR || category === ErrorMap.TRANSIENT_ERROR) {
        return NetworkConstants.ErrorAction.PROBE;
      }
      return NetworkConstants.ErrorAction.FAIL;
    }

    if (category !== ErrorMap.TRANSIENT_ERROR || this.isThrottled(cdnId)) {
      return NetworkConstants.ErrorAction.FAIL;
    }

    return NetworkConstants.ErrorAction.RETRY;
  }

  /**
   * Clear failure tracking for a specific CDN.
   *
   * @param {string} cdnId - The CDN identifier.
   */
  clearFailures(cdnId) {
    delete this.failureTrackers[cdnId];
    delete this.lastErrorCategories[cdnId];
  }

  /**
   * Reset all failure tracking state.
   */
  resetAll() {
    this.failureTrackers = {};
    this.lastErrorCategories = {};
  }

  /**
   * Check whether a CDN has exceeded the failure threshold and should
   * be throttled (no more retries).
   *
   * @private
   * @param {string} cdnId - The CDN identifier.
   * @returns {boolean} True if the CDN is throttled.
   */
  isThrottled(cdnId) {
    const now = platform.platform.now();
    const config = this.config;
    const tracker = this.failureTrackers[cdnId];

    if (tracker) {
      // Reset if the failure window has elapsed
      if (tracker.lastFailureTime >= now - config.throttledNetworkFailureThresholdMs ||
          tracker.isThrottled) {
        return tracker.isThrottled;
      }

      tracker.lastFailureTime = now;
      ++tracker.count;

      if (tracker.count >= config.maxThrottledNetworkFailures) {
        tracker.isThrottled = true;
        return true;
      }
    } else {
      this.failureTrackers[cdnId] = {
        lastFailureTime: now,
        count: 1,
      };
    }

    return false;
  }
}

export { ErrorMap };
