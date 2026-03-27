/**
 * Netflix Cadmium Player — Probe Manager
 *
 * Manages health-check ("probe") requests against CDN servers that have
 * experienced download failures. When a server fails, the probe manager
 * issues lightweight HTTP requests to determine whether the failure is
 * transient (server recovers) or persistent (server should be removed
 * from the selection pool).
 *
 * Probe lifecycle:
 *  1. On error, `issueProbe()` creates probe requests to every URL of
 *     the failing stream.
 *  2. `onProbeSuccess()` — the server is healthy; optionally switches
 *     traffic back.
 *  3. `onProbeFailure()` — retries with exponential back-off; after
 *     `maxThrottledNetworkFailures` consecutive failures, marks the
 *     server as permanently failed.
 *
 * @module ProbeManager
 */

// import { platform }     from '../core/AsejsEngine.js';
// import { assert }       from '../ads/AdPoliciesManager.js';
// import { r$a as ProbeRequest } from '../modules/Module_72681.js';

/**
 * Computes the next probe retry delay using exponential back-off with
 * optional jitter.
 *
 * @param {Object}  params
 * @param {number}  params.baseDelayMs       - Base delay before first retry.
 * @param {number}  params.retryCount        - Number of retries so far.
 * @param {number}  params.minProbeIntervalMs - Minimum delay (ms).
 * @param {number}  [params.maxDelayMs=120000] - Maximum delay cap (ms).
 * @param {number}  [params.jitterFraction=0.1] - Fraction of delay to add as jitter.
 * @returns {number} Delay in milliseconds.
 */
export function computeProbeRetryDelay(params) {
  const maxDelay = params.maxDelayMs ?? 120_000;
  const jitterFraction = params.jitterFraction ?? 0.1;

  const baseDelay = Math.min(
    Math.max(params.minProbeIntervalMs, params.baseDelayMs * Math.pow(2, params.retryCount)),
    maxDelay,
  );

  const jitter = ePb(0, baseDelay * jitterFraction);
  return baseDelay + jitter;
}

/**
 * Coordinates probe requests against failing CDN servers.
 */
class ProbeManager {
  /**
   * @param {Object}   locationSelector - CDN location selection facade.
   * @param {Function} onNetworkReset   - Callback invoked when network health is restored.
   * @param {Object}   config           - Player probe configuration.
   */
  constructor(locationSelector, onNetworkReset, config) {
    this.locationSelector = locationSelector;
    this.onNetworkReset = onNetworkReset;
    this.config = config;

    /** @type {Set<number>} Active delayed-report timer IDs. */
    this.pendingTimers = new Set();

    /** @type {Object<string, Object>} Per-server probe state. */
    this.serverProbeState = {};

    /** @type {Object<string, Object>} Per-(server, serverId) probe-request state. */
    this.probeRequestState = {};

    /** @type {boolean} Whether endplay logging is enabled. */
    this.loggingEnabled = true;

    /** @type {number} Monotonically increasing probe-group identifier. */
    this.groupId = 1;
  }

  /* ------------------------------------------------------------------ */
  /*  Probe issuance                                                     */
  /* ------------------------------------------------------------------ */

  /**
   * Called when a download request fails. Creates probe requests to all
   * URLs of the failing stream to test server health.
   *
   * @param {Object} failedRequest - The request that failed.
   * @param {Object} errorContext   - Error metadata (serverId, errorCode, etc.).
   */
  issueProbe(failedRequest, errorContext) {
    const config = this.config;
    const serverId = failedRequest.sourceBufferIndex;
    const stream = failedRequest.stream;
    const location = failedRequest.server.location;

    assert(stream, 'Failing url should have an associated stream');
    assert(location, 'Failing url should have an associated location');

    const probeRequestIds = [];
    const primaryLocation = stream.locations[0];
    let issuedNewProbe = false;

    let state = this.serverProbeState[serverId];
    const now = platform.platform.now();

    if (!state) {
      state = this._initServerState(serverId, now, errorContext, failedRequest);
    } else if (state.lastErrorTimestamp >= now - config.throttledNetworkFailureThresholdMs) {
      return; // Throttled — too soon since last error
    }

    if (state.isThrottled) return;

    // Mark whether this is the primary location
    if (primaryLocation && location.id === primaryLocation.id) {
      failedRequest.isPrimary = true;
    }

    state.lastErrorTimestamp = now;
    state.isThrottled = false;
    state.error = errorContext;
    ++state.failureCount;

    if (!stream?.urls?.length) return;

    stream.urls.forEach((urlNode) => {
      const probeServerId = urlNode.server.id;
      const stateKey = `${probeServerId}-${serverId}`;
      const existing = this.probeRequestState[stateKey];

      if (existing?.activeRequestId !== undefined) return; // Probe already in-flight

      // Cancel any pending retry timer
      if (existing?.retryTimeout) clearTimeout(existing.retryTimeout);

      // Build the probe URL
      const probeUrl = failedRequest.stream?.sourceStream?.I0?.(failedRequest.M, urlNode.url);
      assert(probeUrl, `Unexpected probeUrl: ${probeUrl}`);

      const probeRequest = this.issueProbeRequest(probeUrl, failedRequest, probeServerId);

      this.probeRequestState[stateKey] = {
        success: false,
        retryCount: 0,
        activeRequestId: probeRequest.getRequestId(),
      };

      probeRequestIds.push(probeRequest.getRequestId());
      issuedNewProbe = true;

      if (!state.probeServerIds.includes(probeServerId)) {
        state.probeServerIds.push(probeServerId);
      }
    });

    if (probeRequestIds.length > 0) {
      const logEntry = {
        ts: platform.platform.now(),
        es: errorContext.serverId,
        fc: errorContext.errorCode,
        fn: errorContext.errorName,
        nc: errorContext.diagnosticInfo,
        pb: probeRequestIds,
        gid: this.groupId,
      };
      if (errorContext.httpCode) logEntry.hc = errorContext.httpCode;
      this._logProbeData(logEntry, 'errpb');
    }

    if (issuedNewProbe) this.groupId++;
  }

  /**
   * Sends a single probe HTTP request.
   *
   * @param {string} probeUrl       - URL to probe (with cache-bust param).
   * @param {Object} requestContext - Original failing request context.
   * @param {string} serverId       - Target server ID.
   * @returns {ProbeRequest} The issued probe request object.
   */
  issueProbeRequest(probeUrl, requestContext, serverId) {
    const probe = new ProbeRequest(this);
    const cacheBust = `random=${parseInt(`${1e7 * Math.random()}`)}`;
    const separator = probeUrl.includes('?') ? '&' : '?';

    probe.tNc(`${probeUrl}${separator}${cacheBust}`, requestContext, serverId);
    return probe;
  }

  /* ------------------------------------------------------------------ */
  /*  Internal state                                                     */
  /* ------------------------------------------------------------------ */

  /**
   * Initializes per-server probe state on first failure.
   *
   * @param {string} serverId     - Server identifier.
   * @param {number} timestamp    - Current time (ms).
   * @param {Object} errorContext - Error metadata.
   * @param {Object} failedRequest
   * @returns {Object} The newly created state object.
   * @private
   */
  _initServerState(serverId, timestamp, errorContext, failedRequest) {
    const location = failedRequest.server.location;
    const state = {
      failureCount: 0,
      lastErrorTimestamp: timestamp,
      isThrottled: false,
      error: errorContext,
      probeServerIds: [],
      probeResults: {},
      location,
      M: errorContext.M,
      Med: errorContext,
    };
    this.serverProbeState[serverId] = state;
    return state;
  }

  /**
   * Returns probe state for a given server.
   * @param {string} serverId
   * @returns {Object|undefined}
   */
  getState(serverId) {
    return this.serverProbeState[serverId];
  }

  /**
   * Clears probe state for a given server.
   * @param {string} serverId
   * @private
   */
  _clearServerState(serverId) {
    this.serverProbeState[serverId] = undefined;
  }

  /* ------------------------------------------------------------------ */
  /*  Logging                                                            */
  /* ------------------------------------------------------------------ */

  /**
   * Emits structured probe log data to the endplay log pipeline.
   *
   * @param {Object} data    - Log payload.
   * @param {string} fieldName - Log field name (e.g. "errpb", "pbres", "erep").
   * @private
   */
  _logProbeData(data, fieldName) {
    if (!this.loggingEnabled) return;

    this.locationSelector.emitLogData({
      type: 'logdata',
      target: 'endplay',
      fields: {
        [fieldName]: {
          type: 'array',
          value: data,
          adjust: ['ts'],
        },
      },
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Probe callbacks                                                    */
  /* ------------------------------------------------------------------ */

  /**
   * Called when a probe request succeeds.
   *
   * @param {Object} probeResult - Probe request result.
   * @param {Object} originalRequest - The original failing request context.
   */
  onProbeSuccess(probeResult, originalRequest) {
    const serverId = originalRequest.sourceBufferIndex;

    if (originalRequest.AOb) {
      // Switchback probe — reset the server immediately
      this.locationSelector.resetServerStatus(probeResult.sourceBufferIndex, false);
      return;
    }

    const state = this.serverProbeState[serverId];
    if (!state) return;

    const probeServerId = probeResult.sourceBufferIndex;
    const stateKey = `${probeServerId}-${serverId}`;
    const probeState = this.probeRequestState[stateKey];
    if (!probeState) return;

    const errorContext = state.error;

    // Clear retry timer
    if (probeState.retryTimeout) clearTimeout(probeState.retryTimeout);

    probeState.success = true;
    probeState.retryCount = 0;
    probeState.activeRequestId = undefined;
    state.probeResults[probeServerId] = true;

    // Check if the probed server itself was previously throttled
    const probedServerState = this.serverProbeState[probeServerId];

    if (probedServerState?.isThrottled && this.config.allowSwitchback) {
      this.locationSelector.resetServerStatus(probeServerId, probedServerState.error.failureAction[1]);

      if (this.loggingEnabled) {
        this._logProbeData({
          ts: platform.platform.now(),
          id: probeResult.requestId,
          servid: originalRequest.sourceBufferIndex,
          gid: probeResult.groupId || -1,
        }, 'errst');
      }

      this.serverProbeState[probeServerId] = undefined;
      this.onNetworkReset();
    }

    // If the probe was to a *different* server than the one that failed,
    // schedule a delayed failure report for the original server
    if (probeResult.url !== originalRequest.url) {
      const sameServerProbe = this.probeRequestState[`${serverId}-${serverId}`];

      if (!sameServerProbe || !sameServerProbe.success) {
        const location = probedServerState?.location;
        const avgThroughput = location?.throughputEstimate?.serverTimingAverage?.average
          || Math.random() * this.config.maxDelayToReportFailure;
        const delay = Math.min(avgThroughput, this.config.maxDelayToReportFailure);

        const timerId = setTimeout(() => {
          this.pendingTimers.delete(timerId);

          if (state.isThrottled !== false) return;
          if (sameServerProbe?.success) return;

          state.isThrottled = true;
          this.locationSelector.reportEngineError(
            errorContext.failureAction[0],
            errorContext.failureAction[1],
            originalRequest.stream.sourceStream.url,
            errorContext,
          );

          if (this.loggingEnabled) {
            this._logProbeData({
              ts: platform.platform.now(),
              id: probeResult.requestId,
              servid: originalRequest.sourceBufferIndex,
              gid: probeResult.groupId || -1,
            }, 'erep');
          }
        }, delay);

        this.pendingTimers.add(timerId);
      }
    }

    // Log probe result
    if (this.loggingEnabled) {
      this._logProbeData({
        ts: platform.platform.now(),
        id: probeResult.requestId,
        result: 1,
        servid: probeResult.sourceBufferIndex,
        gid: probeResult.groupId || -1,
      }, 'pbres');
    }
  }

  /**
   * Called when a probe request fails.
   *
   * @param {Object} probeResult     - Probe request result.
   * @param {Object} originalRequest - The original failing request context.
   */
  onProbeFailure(probeResult, originalRequest) {
    if (originalRequest.AOb) return;

    const config = this.config;
    const serverId = originalRequest.sourceBufferIndex;
    const state = this.serverProbeState[serverId];
    const probeServerId = probeResult.sourceBufferIndex;
    const stateKey = `${probeServerId}-${serverId}`;
    const probeState = this.probeRequestState[stateKey];

    if (!probeState) return;

    if (!state) {
      probeState.success = false;
      probeState.activeRequestId = undefined;
      return;
    }

    let allProbesFailed = 0;
    probeState.success = false;
    probeState.activeRequestId = undefined;
    state.probeResults[probeServerId] = false;

    const probeServerIds = state.probeServerIds;

    // Retry with exponential back-off for same-server probes
    if (config.allowSwitchback && probeServerId === serverId && originalRequest.isPrimary) {
      const location = state.location;
      const baseDelay = location?.throughputEstimate?.serverTimingAverage?.average || 300 * Math.random();

      const retryDelay = computeProbeRetryDelay({
        baseDelayMs: baseDelay,
        retryCount: probeState.retryCount,
        minProbeIntervalMs: config.minProbeIntervalMs,
      });

      probeState.retryTimeout = setTimeout(() => {
        probeState.retryTimeout = undefined;
        const retry = this.issueProbeRequest(probeResult.url, originalRequest, probeServerId);
        retry.vXc(probeResult.groupId);
        probeState.activeRequestId = retry.getRequestId();
      }, retryDelay);
    }

    ++probeState.retryCount;

    // Check if all probes for this server have failed
    if (probeServerId === serverId) {
      probeServerIds.forEach((sid) => {
        if (state.probeResults[sid] === false) allProbesFailed++;
      });

      if (probeServerIds.length === allProbesFailed && state.failureCount >= config.maxThrottledNetworkFailures) {
        const errorContext = state.error;
        state.isThrottled = true;

        const stream = originalRequest.stream;
        assert(stream, 'Probe failed url should have an associated stream');

        stream.urls.forEach((urlNode) => {
          this.locationSelector.reportEngineError(
            errorContext.failureAction[0],
            errorContext.failureAction[1],
            urlNode.url,
            errorContext,
          );

          if (this.loggingEnabled) {
            this._logProbeData({
              ts: platform.platform.now(),
              id: -1,
              servid: urlNode.server.id,
            }, 'erep');
          }
        });
      }
    }

    // Log probe result
    if (this.loggingEnabled) {
      this._logProbeData({
        ts: platform.platform.now(),
        id: probeResult.requestId,
        result: 0,
        servid: probeResult.sourceBufferIndex,
        gid: probeResult.groupId || -1,
      }, 'pbres');
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Error recovery                                                     */
  /* ------------------------------------------------------------------ */

  /**
   * Called on a successful download. If the server was previously
   * throttled and switchback is allowed, resets its failure state.
   *
   * @param {Object} request - The successful request.
   */
  onRequestSuccess(request) {
    if (!request.url) return;

    const serverId = this.locationSelector.getLocationForUrl(request.url)
      || this.locationSelector.getServersForStream(request.stream)[0]?.id;

    if (!serverId) return;

    const state = this.serverProbeState[serverId];
    if (state?.isThrottled && this.config.allowSwitchback) {
      this.locationSelector.resetServerStatus(state.error.serverId, false);

      if (this.loggingEnabled) {
        this._logProbeData({
          ts: platform.platform.now(),
          id: -1,
          servid: serverId,
        }, 'errst');
      }

      this._clearServerState(serverId);

      const retryState = this.probeRequestState[`${serverId}-${serverId}`];
      if (retryState?.retryTimeout) clearTimeout(retryState.retryTimeout);
    }
  }

  /**
   * Alias for `onRequestSuccess` — called by the error director.
   * @param {Object} request
   */
  onRequestError(request) {
    // Delegates to the same success-path for tracking
    this.onRequestSuccess(request);
  }

  /* ------------------------------------------------------------------ */
  /*  Lifecycle                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Resets all probe state, cancels pending timers and retries.
   */
  reset() {
    const probeStates = this.probeRequestState;

    for (const key in probeStates) {
      if (!probeStates.hasOwnProperty(key)) continue;
      const state = probeStates[`${key}-${key}`];
      if (state?.retryTimeout) clearTimeout(state.retryTimeout);
    }

    this.pendingTimers.forEach((timerId) => clearTimeout(timerId));
    this.pendingTimers.clear();
    this.probeRequestState = {};
    this.serverProbeState = {};
  }
}

export { ProbeManager, computeProbeRetryDelay };
