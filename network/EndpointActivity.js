/**
 * Netflix Cadmium Player — Endpoint Activity Tracker
 *
 * Tracks per-CDN-endpoint download activity and computes available
 * bandwidth by delegating to an underlying sliding-window bandwidth
 * estimator.  Two modes of operation are supported:
 *
 *  1. **All-endpoints** (`trackAllEndpoints = true`) — every data sample
 *     is forwarded to the estimator regardless of which CDN is serving.
 *  2. **Active-endpoint-only** (`trackAllEndpoints = false`) — only
 *     samples from the currently active video endpoint are forwarded.
 *     When multiple video requests are in flight simultaneously the
 *     tracker pauses, and resumes once a single endpoint is active again.
 *
 * @module EndpointActivity
 */

// import { platform }   from '../modules/Module_66164.js';
// import { internal_Iab as BandwidthEstimator } from '../modules/Module_56089.js';
// import { MediaType }  from '../modules/Module_65161.js';

/**
 * Per-endpoint bandwidth activity tracker used by {@link NetworkMonitor}.
 */
class EndpointActivity {
  /**
   * @param {boolean} trackAllEndpoints - If true, tracks all endpoints;
   *   if false, tracks only the single active video endpoint.
   */
  constructor(trackAllEndpoints) {
    /** @type {boolean} */
    this.trackAllEndpoints = trackAllEndpoints;

    /**
     * Map of endpoint-ID to active-request metadata.
     * Only used in single-endpoint mode.
     * @type {Object<number, {im: number, pbcid: *, pendingRequests: number, started: boolean}>}
     */
    this.activeEndpoints = {};

    /** @type {BandwidthEstimator} */
    this.estimator = new BandwidthEstimator();
  }

  /* ------------------------------------------------------------------ */
  /*  Lifecycle                                                          */
  /* ------------------------------------------------------------------ */

  /** Resets the bandwidth estimator to a clean state. */
  reset() {
    this.estimator = new BandwidthEstimator();
  }

  /* ------------------------------------------------------------------ */
  /*  Request tracking                                                   */
  /* ------------------------------------------------------------------ */

  /**
   * Notifies the tracker that a new HTTP request has started.
   *
   * @param {number} timestamp      - Wall-clock time (ms).
   * @param {Object} requestContext - Request metadata.
   * @param {number} requestContext.im    - Endpoint (server) identifier.
   * @param {*}      requestContext.pbcid - Playback-context identifier.
   * @param {string} requestContext.type  - Media type of the request.
   */
  recordRequestStart(timestamp, requestContext) {
    if (!requestContext.im) return;

    if (this.trackAllEndpoints) {
      this.estimator.start(timestamp, requestContext.im, requestContext.pbcid);
      return;
    }

    // Single-endpoint mode: only track video requests
    if (requestContext.type !== MediaType.U) return;

    if (this.activeEndpoints[requestContext.im]) {
      this.activeEndpoints[requestContext.im].pendingRequests += 1;
    } else {
      this.activeEndpoints[requestContext.im] = {
        im: requestContext.im,
        pbcid: requestContext.pbcid,
        pendingRequests: 1,
        started: false,
      };
    }

    this._evaluateSingleEndpoint(timestamp);
  }

  /**
   * Notifies the tracker that an HTTP request has completed.
   *
   * @param {number} timestamp      - Wall-clock time (ms).
   * @param {Object} requestContext - Request metadata.
   */
  recordRequestComplete(timestamp, requestContext) {
    if (!requestContext.im) return;

    if (this.trackAllEndpoints) {
      this.estimator.aseTimer(timestamp, requestContext.im, requestContext.pbcid);
      return;
    }

    // Single-endpoint mode
    const entry = this.activeEndpoints[requestContext.im];
    if (requestContext.type !== MediaType.U || !entry) return;

    --entry.pendingRequests;

    if (entry.pendingRequests === 0) {
      if (entry.started) {
        this.estimator.aseTimer(timestamp, requestContext.im, requestContext.pbcid);
      }
      entry.started = false;
      delete this.activeEndpoints[requestContext.im];
    }

    this._evaluateSingleEndpoint(timestamp);
  }

  /* ------------------------------------------------------------------ */
  /*  Data ingestion                                                     */
  /* ------------------------------------------------------------------ */

  /**
   * Records bytes transferred for a completed chunk / response.
   *
   * @param {number} bytes          - Bytes in the chunk.
   * @param {number} startTime      - Transfer start timestamp (ms).
   * @param {number} endTime        - Transfer end timestamp (ms).
   * @param {Object} requestContext - Request metadata.
   */
  recordBytesTransferred(bytes, startTime, endTime, requestContext) {
    if (!requestContext.im) return;

    if (this.trackAllEndpoints) {
      this.estimator.item(bytes, startTime, endTime, requestContext.im, requestContext.pbcid);
    } else if (this.currentActiveEndpoint === requestContext.im) {
      this.estimator.item(bytes, startTime, endTime, requestContext.im, requestContext.pbcid);
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Throughput query                                                    */
  /* ------------------------------------------------------------------ */

  /**
   * Returns the current bandwidth estimate from the underlying estimator.
   * @returns {Object} Bandwidth estimate object.
   */
  getAvailableBandwidth() {
    return this.estimator.key();
  }

  /* ------------------------------------------------------------------ */
  /*  Internal helpers                                                   */
  /* ------------------------------------------------------------------ */

  /**
   * In single-endpoint mode, starts the estimator when exactly one
   * endpoint has active requests, or stops it when multiple endpoints
   * are active concurrently.
   *
   * @param {number} timestamp - Current wall-clock time (ms).
   * @private
   */
  _evaluateSingleEndpoint(timestamp) {
    const endpointIds = Object.keys(this.activeEndpoints).map((id) => parseInt(id));
    const firstEntry = this.activeEndpoints[endpointIds[0]];

    if (endpointIds.length === 1 && firstEntry.started === false) {
      // Exactly one endpoint active — start tracking it
      this.estimator.start(timestamp, firstEntry.im, firstEntry.pbcid);
      this.currentActiveEndpoint = firstEntry.im;
    } else if (endpointIds.length > 1 && this.currentActiveEndpoint) {
      // Multiple endpoints — pause tracking
      const current = this.activeEndpoints[this.currentActiveEndpoint];
      this.estimator.aseTimer(timestamp, this.currentActiveEndpoint, current.pbcid);
      current.started = false;
      this.currentActiveEndpoint = undefined;
    }
  }
}

export { EndpointActivity as REa };
