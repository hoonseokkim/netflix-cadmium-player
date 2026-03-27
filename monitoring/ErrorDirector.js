/**
 * Netflix Cadmium Player — Error Director
 *
 * Orchestrates error detection, failure-mode classification, and recovery
 * for network-layer errors encountered during media downloads.
 *
 * Responsibilities:
 *  - Mapping raw HTTP / transport error codes to failure actions via the
 *    ErrorMap (permanent vs. temporary, probe vs. ignore).
 *  - Propagating failures into the OcNetwork graph (server / location
 *    level) through the LocationSelector.
 *  - Coordinating with the ProbeManager to issue health-check requests
 *    when a server fails.
 *  - Triggering network-reset after a configurable timeout when the
 *    entire network is temporarily down.
 *  - Emitting "requestError", "criticalNetworkError", and
 *    "temporaryNetworkError" events for upper-layer consumers.
 *
 * @module ErrorDirector
 */

// --- external dependency stubs ---
// import * as helpers       from '../ads/AdBreakMismatchLogger.js';
// import { EventEmitter, ClockWatcher } from '../core/AsejsEngine.js';
// import * as util          from '../abr/InitialStreamSelector.js';
// import { platform }       from '../core/AsejsEngine.js';
// import { Y7 as DebouncedAction } from '../core/AsejsEngine.js';
// import NodeType           from '../streaming/MediaFragment.js';
// import { mkb as ProbeManager }    from '../monitoring/ProbeManager.js';
// import { YW as ErrorMap }          from '../monitoring/ErrorMap.js';
// import { xfb as LiveErrorMap }     from '../modules/Module_16131.js';
// import { errorNameMap }            from '../modules/Module_16131.js';

const logger = new platform.Console('ASEJS_ERROR_DIRECTOR', 'asejs');
const setImmediate = platform.setImmediate;

/**
 * Handles network errors, classifies them, and drives recovery.
 */
class ErrorDirector {
  /**
   * @param {boolean}  isLiveStream     - Whether the session is a live stream.
   * @param {Object}   locationSelector - CDN location selection facade.
   * @param {Object}   config           - Player network configuration.
   * @param {Function} onFatalError     - Callback invoked on permanent network failure.
   * @param {Function} onNetworkReset   - Callback invoked when network state is reset.
   * @param {Function} [urlHealthCb]    - Optional URL-health reporting callback.
   */
  constructor(isLiveStream, locationSelector, config, onFatalError, onNetworkReset, urlHealthCb) {
    this.locationSelector = locationSelector;
    this.config = config;
    this.onFatalError = onFatalError;
    this.onNetworkReset = onNetworkReset;
    this.urlHealthCallback = urlHealthCb;

    /** @type {EventEmitter} Emits error-related events to subscribers. */
    this.events = new EventEmitter();

    /** @type {ClockWatcher} Manages event listener subscriptions with cleanup. */
    this.eventListeners = new ClockWatcher();

    /** @type {DebouncedAction} Debounces rapid network-reset calls. */
    this.resetDebouncer = new DebouncedAction();

    /**
     * Error map that classifies error codes into failure actions.
     * Uses a live-specific map for live streams.
     * @type {ErrorMap|LiveErrorMap}
     */
    this.errorMap = isLiveStream ? new LiveErrorMap(config) : new ErrorMap(config);

    this.eventListeners.addListener(this.locationSelector, 'networkFailed', this._onNetworkFailed.bind(this));
    this.eventListeners.addListener(this.locationSelector, 'issueServerProbeRequest', this._onProbeRequest.bind(this));

    /** @type {number} Wall-clock time of the session start (ms). */
    this.sessionStartTime = platform.platform.now();

    /** @type {ProbeManager} Drives probe requests against failing servers. */
    this.probeManager = new ProbeManager(locationSelector, onNetworkReset, config);

    /** @type {Object|undefined} Most recent error context for deferred handling. */
    this.lastErrorContext = undefined;

    /** @type {number|undefined} Timer ID for the network-reset timeout. */
    this.resetTimer = undefined;
  }

  /* ------------------------------------------------------------------ */
  /*  Lifecycle                                                          */
  /* ------------------------------------------------------------------ */

  /** Tears down listeners and resets probe state. */
  destroy() {
    this.eventListeners.clear();
    this.probeManager.reset();
  }

  /* ------------------------------------------------------------------ */
  /*  Error handling                                                     */
  /* ------------------------------------------------------------------ */

  /**
   * Main entry point for reporting a transport / HTTP error.
   *
   * @param {Object[]|Object} affectedRequests - Request(s) that failed (with url, stream, byteRangeHint).
   * @param {Object}  [hostInfo]       - Host / port info for host-level matching.
   * @param {number}  httpCode         - HTTP status code (0 if transport-level).
   * @param {number}  errorCode        - Internal error code.
   * @param {Object}  [diagnosticInfo] - Additional diagnostic context.
   */
  reportEngineError(affectedRequests, hostInfo, httpCode, errorCode, diagnosticInfo) {
    const errorName = errorCode ? errorNameMap.name[errorCode] : undefined;

    logger.RETRY(
      `Failure ${errorName} on ${affectedRequests?.url} with ${httpCode} on ${JSON.stringify(affectedRequests || hostInfo)}`,
    );

    // Look up the failure action for this error code
    if (errorCode && util.isArray(this.errorMap.getFailureAction(errorCode))) {
      var failureAction = this.errorMap.getFailureAction(errorCode) || ErrorMap.ug;
    } else {
      logger.error(`Unmapped failure code in JSASE error director : ${errorCode}`);
      return;
    }

    // Ignored errors
    if (failureAction === ErrorMap.uta) return;

    // Store error context for the networkFailed handler
    this.lastErrorContext = {
      Mk: httpCode,
      errorCode,
      errorName,
      diagnosticInfo: diagnosticInfo,
    };

    // Emit request-error event
    this.events.emit('requestError', {
      type: 'requestError',
      httpCode,
      errorCode,
      dh: diagnosticInfo,
    });

    // Critical (fatal) error detection
    if (errorCode && this.errorMap.isCriticalError(errorCode)) {
      this.events.emit('criticalNetworkError', {
        type: 'criticalNetworkError',
        errorCode,
      });
    }

    // Build the set of affected URL / server pairs
    const affectedUrls = this._buildAffectedUrls(affectedRequests, hostInfo);
    if (affectedUrls === undefined) {
      logger.error('Invalid affected for network failure');
      return;
    }

    // Trigger a probe if configured
    if (this.config.probeServerWhenError) {
      this.probeManager.onRequestError(affectedRequests);
    }

    // Process each affected URL
    for (const entry of affectedUrls) {
      const urlNodes = entry.urls;
      const serverId = entry.sourceBufferIndex;

      const failureDecision = this.errorMap.evaluateFailure(errorCode, serverId);

      if (failureDecision === NodeType.default.WW.ha) {
        // Apply the failure at the determined graph level
        const [failureLevel, isPermanent] = failureAction;
        urlNodes.some((urlNode) => {
          this.locationSelector.reportEngineError(failureLevel, isPermanent, urlNode.url);
          return failureLevel === NodeType.default.xk.UP; // stop at server level
        });
      } else if (failureDecision === NodeType.default.WW.PROBE) {
        // Issue a probe instead of immediately failing
        this.probeManager.issueProbe(entry, {
          serverId,
          failureAction,
          httpCode,
          errorCode,
          errorName,
          diagnosticInfo: diagnosticInfo,
        });
      }

      // Notify URL-health callback for zero/undefined HTTP codes
      if (this.urlHealthCallback && (httpCode === 0 || httpCode === undefined)) {
        this.urlHealthCallback('error', entry.url);
      }
    }
  }

  /**
   * Builds the list of affected URL entries from a failing request or
   * host-level info.
   *
   * @param {Object} request   - The failing request (with stream, url, byteRangeHint).
   * @param {Object} [hostInfo] - Host / port for host-level matching.
   * @returns {Object[]|undefined}
   * @private
   */
  _buildAffectedUrls(request, hostInfo) {
    const selector = this.locationSelector;

    if (request) {
      const stream = selector.findStreamBySource(request.stream);
      this.lastByteRangeHint = request.byteRangeHint;

      return selector.getServersForStream(request.stream).map((server) => ({
        url: request.url,
        sourceBufferIndex: server.id,
        server,
        stream,
        urls: server.urls,
        M: request.byteRangeHint,
      }));
    }

    if (hostInfo) {
      return selector.findUrlsByHostPort(hostInfo.host, hostInfo.port)
        .map((match) => ({
          url: selector.buildProbeUrl(match.url.url, match.url.stream.sourceStream),
          sourceBufferIndex: match.server.id,
          server: match.server,
          stream: match.url.stream,
          urls: match.server.urls,
        }))
        .filter((entry) => entry.url !== '');
    }

    return undefined;
  }

  /* ------------------------------------------------------------------ */
  /*  Network failure / recovery                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Handles the "networkFailed" event from the LocationSelector.
   * If temporary, schedules a reset; if permanent, triggers fatal error.
   *
   * @param {Object} event
   * @param {boolean} event.lua - Whether the failure is permanent.
   * @private
   */
  _onNetworkFailed(event) {
    const isPermanent = event.lua;
    const timeSinceStart = platform.platform.now() - this.sessionStartTime;

    logger.RETRY(
      `Network has failed ${isPermanent ? 'permanently' : 'temporarily'} last success was ${timeSinceStart} ms ago`,
    );

    let lastErrorCode;
    let lastHttpCode;
    let lastDiagnosticInfo;

    if (this.lastErrorContext) {
      lastErrorCode = this.lastErrorContext.errorCode;
      lastHttpCode = this.lastErrorContext.httpCode;
      lastDiagnosticInfo = this.lastErrorContext.diagnosticInfo;
    }

    if (!isPermanent) {
      this.events.emit('temporaryNetworkError', {
        type: 'temporaryNetworkError',
        errorCode: lastErrorCode,
        httpCode: lastHttpCode,
        dh: lastDiagnosticInfo,
      });
    }

    if (isPermanent) {
      // Clear any pending reset timer and report fatal
      if (this.resetTimer) {
        clearTimeout(this.resetTimer);
        this.resetTimer = undefined;
      }
      this.probeManager.reset();
      this.onFatalError({
        lua: isPermanent,
        BNc: lastErrorCode,
        DNc: lastHttpCode,
        ENc: lastDiagnosticInfo,
        liveAdjustAudioTimestamps: event.sourceBufferIndex,
      });
    } else if (!this.resetTimer) {
      // Schedule a temporary-failure reset
      const self = this;
      this.resetTimer = setTimeout(() => {
        self.resetTimer = undefined;
        self._resetNetwork();
      }, this.config.networkFailureResetWaitMs);
    }
  }

  /**
   * Resets the network graph, error map, and triggers a reconnect.
   * @private
   */
  _resetNetwork() {
    if (this.resetDebouncer.ioa) return;

    this.resetDebouncer.fYb(() => {
      if (!this.resetTimer) {
        this.locationSelector.resetNetworkStatus();
        this.errorMap.resetNetworkStatus();
        this.onNetworkReset();
      }
    });
  }

  /**
   * Records a successful download so the error director can track
   * "last success" timing.
   *
   * @param {Object} request - The request that succeeded.
   */
  onSuccessfulDownload(request) {
    this.sessionStartTime = Math.max(
      request.requestTimestamp || platform.platform.now(),
      this.sessionStartTime,
    );

    if (this.config.probeServerWhenError) {
      this.probeManager.onRequestSuccess(request);
    }

    const affected = this._buildAffectedUrls(request);
    if (affected?.length) {
      affected.forEach((entry) => {
        this.errorMap.onSuccessfulDownload(entry.sourceBufferIndex);
        this.locationSelector.onSuccessfulDownload(entry.sourceBufferIndex);
      });
    }

    this.events.emit('updatingLastSuccessEvent', { type: 'updatingLastSuccessEvent' });
  }

  /* ------------------------------------------------------------------ */
  /*  Probe request handler                                              */
  /* ------------------------------------------------------------------ */

  /**
   * Handles the "issueServerProbeRequest" event from LocationSelector.
   *
   * @param {Object} event
   * @param {Object} event.url    - The URL node to probe.
   * @param {Object} event.liveAdjustAudioTimestamps - Server node.
   * @param {Object} event.stream - Associated stream.
   * @private
   */
  _onProbeRequest(event) {
    const server = event.liveAdjustAudioTimestamps;
    const stream = event.stream;

    if (!event.url) return;

    const probeUrl = event.url.url;
    const probeRequest = {
      url: probeUrl,
      sourceBufferIndex: server.id,
      server,
      stream,
      urls: server.urls,
      M: this.lastByteRangeHint,
      AOb: true,
    };

    const builtUrl = stream.sourceStream?.I0?.(probeRequest.M, probeUrl);
    if (builtUrl) {
      this.probeManager.issueProbeRequest(builtUrl, probeRequest, server.id);
    }
  }
}

export { ErrorDirector as ErrorDirectorClass };
