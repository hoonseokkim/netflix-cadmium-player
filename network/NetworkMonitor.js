/**
 * Netflix Cadmium Player — Network Performance Monitor
 *
 * Central throughput estimation engine that aggregates bandwidth samples from
 * multiple statistical filters (EWMA, sliding-window, IQR, T-Digest) and
 * publishes consolidated estimates to the ABR controller and session history.
 *
 * Responsibilities:
 *  - Recording bytes transferred / connection timing for every HTTP response.
 *  - Driving pluggable filter instances (created via FilterFactory).
 *  - Maintaining network-active / network-idle lifecycle events.
 *  - Computing composite throughput snapshots consumed by the buffer manager.
 *  - Tracking network interruptions and forwarding them to the latency monitor.
 *  - Persisting per-session throughput history for cross-session warm-start.
 *
 * @module NetworkMonitor
 */

// --- external dependency stubs (webpack imports) ---
// import * as helpers        from '../modules/Module_22970.js';
// import * as util           from '../modules/Module_17267.js';
// import { EventEmitter }    from '../modules/Module_90745.js';
// import { platform }        from '../modules/Module_66164.js';
// import { Deferred }        from '../modules/Module_91176.js';
// import { j6 as SlidingWindowBucket } from '../modules/Module_72697.js';
// import { hFa as FilterFactory }      from '../modules/Module_97315.js';
// import { ase_Chb as NetworkConfidence } from '../monitoring/NetworkConfidence.js';
// import { QP as ConfidenceFilter }       from '../modules/Module_66917.js';
// import { OEc as isTraceCandidate }      from '../modules/Module_5593.js';
// import { REa as EndpointActivity }      from '../network/EndpointActivity.js';
// import { internal_Aib as PaceReportLogger } from '../modules/Module_75640.js';
// import SessionTraceSummary              from '../modules/Module_21487.js';
// import { internal_Zkb as PERSISTENT_FILTER_NAMES } from '../modules/Module_33951.js';
// import { nzc as buildTraceSummaryMap }  from '../modules/Module_28838.js';

const logger = new platform.Console('ASEJS_NETWORK_MONITOR', 'media|asejs');

/** @type {NetworkMonitor|undefined} Singleton reference */
let singletonInstance;

/**
 * Aggregates throughput measurements from the transport layer and exposes
 * a consolidated bandwidth estimate to the adaptive bitrate controller.
 *
 * @extends EventEmitter
 */
class NetworkMonitor extends EventEmitter {
  /**
   * @param {Object} latencyMonitor   - Reports network interruption intervals.
   * @param {Object} locationSelector - CDN / endpoint selection facade.
   * @param {Object} sessionHistory   - Cross-session throughput persistence.
   * @param {Object} config           - Player network configuration.
   */
  constructor(latencyMonitor, locationSelector, sessionHistory, config) {
    super();

    /** @type {Object<string, Object>} Filter instances keyed by filter name. */
    this.filterMap = {};

    /** @type {number} Count of requests that have not yet received a first byte. */
    this.pendingFirstByteCount = 0;

    /** @type {number} Outstanding bytes still expected from in-flight requests. */
    this.pendingBytes = 0;

    /** @type {string[]} Request-IDs of currently active requests. */
    this.activeRequestIds = [];

    /** @type {number} Total bytes buffered but not yet consumed. */
    this.bufferBytes = 0;

    /** @type {boolean} Whether the initial throughput has been pushed to the location selector. */
    this.hasPublishedInitialEstimate = false;

    /** @type {number|undefined} Timestamp when the current session segment began. */
    this.sessionSegmentStart = undefined;

    /** @type {Object|undefined} Session-trace summary helper. */
    this.sessionTraceSummary = undefined;

    /** @type {number} Timestamp of the last abandonment-lock acquisition. */
    this.lastAbandonmentLockTime = -Infinity;

    /** @type {Deferred|null} Resolves when next data-received event fires. */
    this.dataReceivedDeferred = null;

    this.config = config;
    this.filterFactory = new FilterFactory(config);

    /** @type {EndpointActivity} Tracks per-CDN bandwidth for all endpoints. */
    this.allEndpointsActivity = new EndpointActivity(true);

    /** @type {EndpointActivity} Tracks bandwidth for the *active* endpoint only. */
    this.activeEndpointActivity = new EndpointActivity(false);

    if (config.enablePaceReportLogging) {
      /** @type {PaceReportLogger|undefined} */
      this.paceReportLogger = new PaceReportLogger(this.config);
    }

    this.reset();

    this.latencyMonitor = latencyMonitor;
    this.locationSelector = locationSelector;
    this.sessionHistory = sessionHistory;

    /** @type {string} Current network interface name (e.g. "wifi", "cellular"). */
    this.networkInterfaceName = platform.TE.name();
    this.locationSelector.onNetworkChange(this.networkInterfaceName);

    platform.events.on('networkchange', this._handleNetworkChange.bind(this));

    if (config.enableSessionTraceSummaryEndplay) {
      this.sessionTraceSummary = new SessionTraceSummary();
    }

    singletonInstance = this;
  }

  /* ------------------------------------------------------------------ */
  /*  Static helpers                                                     */
  /* ------------------------------------------------------------------ */

  /** @returns {NetworkMonitor|undefined} The current singleton (if any). */
  static instance() {
    return singletonInstance;
  }

  /** Resets the singleton if it exists. */
  static create() {
    singletonInstance?.reset();
  }

  /* ------------------------------------------------------------------ */
  /*  Computed properties                                                */
  /* ------------------------------------------------------------------ */

  /**
   * Whether an abandonment lock is currently active (prevents rapid
   * successive request cancellations).
   * @type {boolean}
   */
  get isAbandonmentLocked() {
    return platform.platform.now() - this.lastAbandonmentLockTime < this.config.requestAbandonmentLockIntervalMs;
  }

  /** @type {Object} The location selector / CDN endpoint handler. */
  get locationHandler() {
    return this.locationSelector;
  }

  /** @type {number|null} Wall-clock time of the first data-received event in this segment. */
  get startTime() {
    return this.firstEventTime;
  }

  /** @type {number} Current network-confidence level. */
  get confidence() {
    return this.filterMap.confidence.key(0);
  }

  /** @type {number} Number of currently in-flight requests. */
  get activeRequestCount() {
    return this.activeRequestCounter;
  }

  /** @type {string[]} Active request IDs. */
  get activeRequestIdList() {
    return this.activeRequestIds;
  }

  /** @type {number|undefined} Maximum observed response end-time. */
  get maxResponseEndTime() {
    return this._maxResponseEndTime;
  }

  /** @type {string|null} Currently selected CDN location key. */
  get location() {
    return this.selectedLocation;
  }

  /** @type {Object|undefined} Latest entropy measurement result. */
  get entropyResult() {
    return this._entropyResult;
  }

  /* ------------------------------------------------------------------ */
  /*  Internal helpers                                                   */
  /* ------------------------------------------------------------------ */

  /**
   * Handles a platform "networkchange" event (e.g. wifi -> cellular).
   * @param {string} newInterface - The new network interface name.
   * @private
   */
  _handleNetworkChange(newInterface) {
    this.networkInterfaceName = newInterface;
    this.locationSelector.onNetworkChange(newInterface);
  }

  /**
   * Pushes the current throughput estimate into the location selector so it
   * can inform CDN selection and warm-start future sessions.
   * @private
   */
  _publishThroughputToLocationSelector() {
    if (this.hasPublishedInitialEstimate) return;

    const snapshot = this._buildRawFilterSnapshot();

    this.locationSelector.updateThroughputEstimate(
      snapshot.default.average,
      this.confidence,
    );

    if (snapshot['initial-throughput-ewma']?.average) {
      this.locationSelector.updateInitialThroughput(snapshot['initial-throughput-ewma'].average);
    }

    if (snapshot['throughput-ci']) {
      this.locationSelector.updateThroughputConfidenceInterval(snapshot['throughput-ci']);
    }

    if (snapshot.deliverytime) {
      this.locationSelector.updateDeliveryTime(snapshot.deliverytime);
    }

    this.locationSelector.updateIqrMetrics(
      snapshot.iqrResult?.iqrStats,
      snapshot.iqrResult?.sampleCount,
    );

    if (!util.isEmpty(this.lastNetworkActivityTime)) {
      this.hasPublishedInitialEstimate = true;
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Filter instantiation                                               */
  /* ------------------------------------------------------------------ */

  /**
   * Builds the full set of throughput / confidence / entropy filters from
   * the current configuration.
   * @returns {Object<string, Object>} Map of filter-name to filter instance.
   * @private
   */
  _createFilterMap() {
    const cfg = this.config;
    const enabledFilterNames = cfg.enableFilters
      .concat(cfg.experimentalFilter)
      .filter(Boolean);
    const overrides = cfg.filterDefinitionOverrides;
    const factory = this.filterFactory;

    const filters = enabledFilterNames.reduce((map, name) => {
      map[name] = factory.create(name, overrides);
      return map;
    }, {});

    filters.confidence = new ConfidenceFilter(
      cfg,
      new NetworkConfidence(cfg, this._onConfidenceReady.bind(this)),
    );

    const traceSummaryFilters = buildTraceSummaryMap(
      cfg.enableSessionTraceSummaryEndplay,
      cfg,
    );

    return { ...filters, ...traceSummaryFilters };
  }

  /* ------------------------------------------------------------------ */
  /*  Session lifecycle                                                  */
  /* ------------------------------------------------------------------ */

  /**
   * Resets all internal state for a new playback session.
   */
  reset() {
    const overrides = this.config.filterDefinitionOverrides;
    const factory = this.filterFactory;
    const cfg = this.config;

    this.selectedLocation = null;
    this._entropyResult = undefined;
    this.filterMap = this._createFilterMap();

    if (this.config.enableThroughputTraceResearchData) {
      const traceParams = this.config.throughputTraceParam;
      this.filterMap.traceBuckets = new SlidingWindowBucket(
        traceParams.numB * traceParams.bSizeMs,
        traceParams.bSizeMs,
      );
    }

    this.allEndpointsActivity.reset();
    this.activeEndpointActivity.reset();

    this.connectionTimeFilter = factory.create('respconn-ewma', overrides);
    this.serverTimingFilter = factory.create('respconn-ewma', overrides);

    this.paceReportLogger?.reset();
    this.sessionSegmentStart = undefined;

    this.sessionTraceSummary = cfg.enableSessionTraceSummaryEndplay
      ? new SessionTraceSummary()
      : undefined;

    this._publishThroughputBound = this._publishThroughputToLocationSelector.bind(this);

    if (this._publishInterval !== undefined) {
      clearInterval(this._publishInterval);
      this._publishInterval = undefined;
    }

    this.networkInterruptionTime = null;
    this.lastNetworkActivityTime = null;
    this.firstEventTime = null;
    this.cumulativeIdleTime = 0;

    if (cfg.resetActiveRequestsAtSessionInit) {
      this.pendingBytes = 0;
      this.pendingFirstByteCount = 0;
      this.activeRequestCounter = 0;
      this.activeRequestIds = [];
    }
  }

  /**
   * Called when the location / CDN endpoint changes. Resets filters that
   * are not marked as persistent across location switches, and adjusts
   * timing bookkeeping.
   *
   * @param {string|null} newLocation - Key of the newly selected CDN location.
   */
  setNetworkMonitorListener(newLocation) {
    const filters = this.filterMap;

    if (newLocation === this.selectedLocation) return;

    if (this._publishInterval !== undefined) {
      clearInterval(this._publishInterval);
      this._publishInterval = undefined;
    }

    if (util.isEmpty(this.selectedLocation)) {
      this.cumulativeIdleTime = 0;
      this.firstEventTime = null;
    }

    if (!util.isEmpty(newLocation)) {
      for (const name in filters) {
        if (filters[name]?.reset && !PERSISTENT_FILTER_NAMES.has(name)) {
          filters[name].reset();
        }
      }
      this.connectionTimeFilter.reset();
      this.serverTimingFilter.reset();
    }

    if (!util.isEmpty(this.firstEventTime)) {
      const endOfActivity = util.isEmpty(this.lastNetworkActivityTime)
        ? platform.platform.now()
        : this.lastNetworkActivityTime;
      this.cumulativeIdleTime += endOfActivity - this.firstEventTime;
    }

    this.lastNetworkActivityTime = null;
    this.firstEventTime = null;
    this.selectedLocation = newLocation;
    this.locationSelector.setNetworkMonitorListener(newLocation);
  }

  /* ------------------------------------------------------------------ */
  /*  Data ingestion                                                     */
  /* ------------------------------------------------------------------ */

  /**
   * Records bytes transferred for a completed (or partial) HTTP response.
   *
   * @param {number} bytes          - Number of bytes in this chunk.
   * @param {number} startTime      - Timestamp when the transfer started (ms).
   * @param {number} endTime        - Timestamp when the transfer ended (ms).
   * @param {Object} requestContext - Per-request metadata (e.g. im, pbcid, x5).
   */
  recordBytesTransferred(bytes, startTime, endTime, requestContext) {
    this._maxResponseEndTime = Math.max(this._maxResponseEndTime || 0, endTime);
    this.pendingBytes -= bytes;

    const cfg = this.config;
    const filters = this.filterMap;

    // WebSocket / secondary-layer throughput
    if (requestContext.x5 === true) {
      const wsslFilter = filters['throughput-wssl'];
      wsslFilter?.item(bytes, startTime, endTime, true);
      return;
    }

    if (util.isUndefined(startTime)) {
      logger.RETRY('addDataReceived called with undefined start time');
      return;
    }

    this.paceReportLogger?.recordBytesTransferred(bytes, startTime, endTime, requestContext);

    // Ignore short responses if configured
    if (cfg.ignoreShortResponses) {
      const duration = endTime - startTime;
      if (duration < cfg.shortResponseDurationMs || requestContext.la <= cfg.shortResponseBytes) {
        return;
      }
    }

    // Optionally expand very short download windows to a minimum duration
    if (cfg.expandDownloadTime && endTime - startTime < cfg.minimumResponseDurationMs) {
      startTime = endTime - cfg.minimumResponseDurationMs;
    } else if (endTime - startTime === 0) {
      startTime = endTime - 1;
    }

    // Feed both endpoint-activity trackers
    this.allEndpointsActivity.recordBytesTransferred(bytes, startTime, endTime, requestContext);
    this.activeEndpointActivity.recordBytesTransferred(bytes, startTime, endTime, requestContext);

    // Feed all registered filters
    for (const filterName in filters) {
      const filter = filters[filterName];
      if (filter) {
        if (filter.item) {
          filter.item(bytes, startTime, endTime, requestContext);
        } else if (filter.recordMetric) {
          filter.recordMetric(bytes, startTime, endTime, {});
        }
      }
    }

    // Update first-event / last-network timing
    if (util.isEmpty(this.firstEventTime)) {
      this.firstEventTime = startTime;
      this.lastNetworkActivityTime = null;
      this.hasPublishedInitialEstimate = false;
    }

    if (!util.isEmpty(this.lastNetworkActivityTime)) {
      if (startTime > this.lastNetworkActivityTime) {
        this.firstEventTime += startTime - this.lastNetworkActivityTime;
      }
      this.lastNetworkActivityTime = null;
      this.hasPublishedInitialEstimate = false;
    }

    // Network-interruption detection
    if (!util.isEmpty(this.networkInterruptionTime)) {
      if (startTime - this.networkInterruptionTime > cfg.minReportedNetIntrDuration) {
        this.latencyMonitor.reportNetworkInterruption(this.networkInterruptionTime, startTime);
      } else if (endTime - startTime > cfg.minReportedNetIntrDuration) {
        this.latencyMonitor.reportNetworkInterruption(startTime, endTime);
      }
    }

    this.networkInterruptionTime = this.networkInterruptionTime
      ? Math.max(endTime, this.networkInterruptionTime)
      : endTime;

    // Resolve any pending abandonment deferred
    this.dataReceivedDeferred?.resolve();
  }

  /**
   * Records a connection-time sample (time-to-first-byte for a TCP / TLS connection).
   * @param {number} connectionTimeMs - Connection setup time in milliseconds.
   */
  recordConnectionInfo(connectionTimeMs) {
    if (isNaN(connectionTimeMs) || util.isEmpty(connectionTimeMs)) return;
    this.connectionTimeFilter.item(connectionTimeMs);
    this.locationSelector.recordConnectionInfo(connectionTimeMs);
  }

  /**
   * Records a server-timing (round-trip) sample reported via the
   * `Server-Timing` HTTP response header.
   * @param {number} serverTimingMs - Server processing time in milliseconds.
   */
  recordServerTiming(serverTimingMs) {
    if (isNaN(serverTimingMs) || util.isEmpty(serverTimingMs)) return;

    this.serverTimingFilter.item(serverTimingMs);
    this.locationSelector.recordServerTiming(serverTimingMs);

    const filters = this.filterMap;
    const now = platform.platform.now();

    for (const name in filters) {
      const filter = filters[name];
      if (filter?.aL) {
        filter.DSb?.(now);
        filter.aL(serverTimingMs, 'HTTP');
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Session-trace helpers                                              */
  /* ------------------------------------------------------------------ */

  /**
   * Marks that a trace-eligible request has started.
   * @param {Object} request
   */
  markTraceStart(request) {
    if (this.sessionTraceSummary && isTraceCandidate(request)) {
      this.sessionTraceSummary.markTraceStart();
    }
  }

  /** Marks the end of a trace-eligible request. */
  markTraceEnd() {
    this.sessionTraceSummary?.markTraceEnd();
  }

  /**
   * Records a trace measurement value.
   * @param {number} value
   */
  recordTraceValue(value) {
    this.sessionTraceSummary?.recordTraceValue(value);
  }

  /* ------------------------------------------------------------------ */
  /*  Request lifecycle                                                  */
  /* ------------------------------------------------------------------ */

  /**
   * Called when an HTTP request begins loading (loadstart / send).
   * @param {number} timestamp      - Wall-clock time of the event (ms).
   * @param {Object} requestContext - Metadata for the request (la, requestId, etc.).
   */
  recordRequestStart(timestamp, requestContext) {
    const requestId = requestContext.requestId;

    if (this.sessionTraceSummary && this.sessionSegmentStart === undefined) {
      this.sessionSegmentStart = platform.platform.now();
    }

    if (++this.activeRequestCounter === 1) {
      this.emit('active', timestamp);
    }

    // Propagate to filters that care about concurrency
    if (this.config.enableActiveRequestsInFilters) {
      const filters = this.filterMap;
      for (const name in filters) {
        filters[name]?.recordRequestStart?.(timestamp, requestContext);
      }
    }

    if (this.config.stopOnAllInactiveRequests) {
      this.onAllRequestsIdle(timestamp, requestContext);
    }

    if (requestId) {
      if (!this.config.stopOnAllInactiveRequests) {
        this.onAllRequestsIdle(timestamp, requestContext);
      }
      this.activeRequestIds.push(requestId);
    }

    this.pendingBytes += requestContext.la || 0;
    this.allEndpointsActivity.recordRequestStart(timestamp, requestContext);
    this.activeEndpointActivity.recordRequestStart(timestamp, requestContext);
  }

  /** Increments the pending-first-byte counter. */
  onFirstByteMonitor() {
    ++this.pendingFirstByteCount;
  }

  /**
   * Called when an HTTP request completes (success or error).
   *
   * @param {number}  timestamp      - Wall-clock time of the event.
   * @param {boolean} hadFirstByte   - Whether we received at least one byte.
   * @param {Object}  requestContext - Per-request metadata.
   */
  recordRequestComplete(timestamp, hadFirstByte, requestContext) {
    const requestId = requestContext.requestId;

    if (hadFirstByte) --this.pendingFirstByteCount;
    --this.activeRequestCounter;

    const remainingBytes = (requestContext.la || 0) - (requestContext.bytesReceived || 0);
    this.pendingBytes = Math.max((this.pendingBytes || 0) - remainingBytes, 0);

    if (this.config.resetActiveRequestsAtSessionInit) {
      this.activeRequestCounter = Math.max(this.activeRequestCounter, 0);
      this.pendingFirstByteCount = Math.max(this.pendingFirstByteCount, 0);
    }

    if (this.config.enableActiveRequestsInFilters) {
      const filters = this.filterMap;
      for (const name in filters) {
        filters[name]?.recordRequestComplete?.(timestamp, hadFirstByte, requestContext);
      }
    }

    if (this.config.stopOnAllInactiveRequests) {
      this.onRequestStop(timestamp, requestContext);
    }

    if (this.activeRequestCounter === 0) {
      if (!this.config.stopOnAllInactiveRequests) {
        this.onRequestStop(timestamp, requestContext);
      }
      this.emit('inactive', timestamp);
    }

    if (requestId) {
      const idx = this.activeRequestIds.indexOf(requestId);
      if (idx >= 0) this.activeRequestIds.splice(idx, 1);
    }

    this.allEndpointsActivity.recordRequestComplete(timestamp, requestContext);
    this.activeEndpointActivity.recordRequestComplete(timestamp, requestContext);
  }

  /* ------------------------------------------------------------------ */
  /*  Filter start / stop                                                */
  /* ------------------------------------------------------------------ */

  /**
   * Signals all filters that a new request chunk has started downloading.
   * @param {number} timestamp
   * @param {Object} requestContext
   */
  onAllRequestsIdle(timestamp, requestContext) {
    if (util.isEmpty(this.networkInterruptionTime) && !util.isEmpty(this.lastNetworkActivityTime)) {
      this.networkInterruptionTime = timestamp;
    }

    const filters = this.filterMap;
    if (this.config.startMonitorOnLoadStart) {
      for (const name in filters) {
        filters[name]?.start?.(timestamp, requestContext);
      }
    }
  }

  /**
   * Signals all filters that all in-flight requests have completed for
   * the current download window.
   * @param {number} timestamp
   * @param {Object} requestContext
   */
  onRequestStop(timestamp, requestContext) {
    const filters = this.filterMap;
    for (const name in filters) {
      filters[name]?.aseTimer?.(timestamp, requestContext);
    }

    this.lastNetworkActivityTime = util.isEmpty(this.lastNetworkActivityTime)
      ? timestamp
      : Math.min(this.lastNetworkActivityTime, timestamp);

    this.networkInterruptionTime = null;
  }

  /* ------------------------------------------------------------------ */
  /*  Periodic / batch operations                                        */
  /* ------------------------------------------------------------------ */

  /**
   * Called periodically (e.g. on each ABR evaluation) to flush filter
   * logs, update entropy, and persist throughput to session history.
   */
  logBatcher() {
    const filters = this.filterMap;
    for (const name in filters) {
      filters[name]?.logBatcher?.();
    }
    this._updateEntropy();
    this._persistThroughput();
  }

  /**
   * Pushes the latest throughput estimate into session history.
   * @private
   */
  _persistThroughput() {
    const entropy = this.entropyResult;
    let uhdEntropy = 0;
    if (entropy?.uhd !== undefined) {
      uhdEntropy = entropy.uhd;
    }
    const snapshot = this.getThroughputSnapshot();
    if (snapshot?.average?.average) {
      this.sessionHistory.updateCurrentSession(
        snapshot.average.average,
        uhdEntropy,
        snapshot.average.activeDuration,
      );
      this.sessionHistory.save();
    }
  }

  /**
   * Computes and caches the network entropy from the entropy filter,
   * then resets it for the next evaluation window.
   * @private
   */
  _updateEntropy() {
    const entropyFilter = this.filterMap.entropy;
    if (entropyFilter) {
      this._entropyResult = entropyFilter.computeEntropy();
      entropyFilter.reset();
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Throughput snapshots                                                */
  /* ------------------------------------------------------------------ */

  /**
   * Builds a raw map of each filter's current estimate without applying
   * composite logic (secondary estimator, WSSL aggregation, etc.).
   *
   * @returns {Object} Raw filter output keyed by filter name.
   * @private
   */
  _buildRawFilterSnapshot() {
    const now = platform.platform.now();
    const filters = this.filterMap;
    const cfg = this.config;
    const defaultFilterName = cfg.defaultFilter;
    const defaultSubKey = cfg.$7b;
    const secondaryFilterName = cfg.secondaryFilter;
    const snapshot = {};

    for (const name in filters) {
      if (filters[name]?.key) {
        snapshot[name] = filters[name].key(now, this.pendingBytes);
        if (filters[name].type === 'iqr') snapshot.iqrResult = snapshot[name];
        if (filters[name].type === 'tdigest') snapshot.tdigestResult = snapshot[name];
        if (filters[name].type === 'wssl') snapshot.x5 = snapshot[name];
      }
    }

    snapshot.cdnavtp = this.allEndpointsActivity.getAvailableBandwidth();
    snapshot.activecdnavtp = this.activeEndpointActivity.getAvailableBandwidth();

    // Resolve the "default" estimator
    if (defaultFilterName && snapshot[defaultFilterName] && defaultSubKey !== undefined && snapshot[defaultFilterName][defaultSubKey] !== undefined) {
      snapshot.default = { Fa: snapshot[defaultFilterName][defaultSubKey] };
    } else if (defaultFilterName && snapshot[defaultFilterName]) {
      snapshot.default = snapshot[defaultFilterName];
    } else {
      snapshot.default = snapshot['throughput-ewma'];
    }

    // Resolve secondary estimator (conservative min)
    if (cfg.secondThroughputEstimator !== 'none' && secondaryFilterName !== 'none') {
      snapshot.secondaryEstimate = secondaryFilterName && snapshot[secondaryFilterName]
        ? snapshot[secondaryFilterName]
        : snapshot['throughput-sw'];
    }

    return snapshot;
  }

  /**
   * Returns the pace-report data (if pace-report logging is enabled).
   * @returns {Object|undefined}
   */
  getPaceReport() {
    return this.paceReportLogger?.getPaceReport();
  }

  /**
   * Builds the composite throughput snapshot used by the buffer / ABR
   * controller. Applies secondary-estimator conservative-min, WSSL
   * aggregation, and attaches connection-time / server-timing averages.
   *
   * @returns {Object} Composite throughput snapshot.
   */
  getThroughputSnapshot() {
    const raw = this._buildRawFilterSnapshot();
    let primary = raw.default;
    const connectionTimeAvg = this.connectionTimeFilter.key();
    const serverTimingAvg = this.serverTimingFilter.key();
    const cfg = this.config;

    // Conservative-min with secondary estimator
    if (raw.secondaryEstimate) {
      const secondary = raw.secondaryEstimate;
      if (
        util.wc(primary.average) &&
        util.wc(secondary.average) &&
        primary.average > secondary.average &&
        secondary.average > 0
      ) {
        primary = secondary;
      }
    }

    raw.average = primary;
    raw.throughputLocationHistory = raw['initial-throughput-ewma'];

    // WSSL aggregation (WebSocket secondary layer)
    if (
      cfg.enableWsslEstimate &&
      primary &&
      !util.isEmpty(primary.average) &&
      !isNaN(primary.average) &&
      raw.x5 &&
      !util.isEmpty(raw.x5.average) &&
      !isNaN(raw.x5.average)
    ) {
      if (cfg.wsslAggregationMethod === 'max') {
        raw.average.average = Math.max(raw.x5.average, primary.average);
      } else if (cfg.wsslAggregationMethod === 'sum') {
        raw.average.average += raw.x5.average;
      }
    }

    raw.connectionTimeAverage = connectionTimeAvg;
    raw.serverTimingAverage = serverTimingAvg;

    // Optional trace-research data
    if (this.config.enableThroughputTraceResearchData) {
      const tp = this.config.throughputTraceParam;
      raw.traceResearchData = this.filterMap.traceBuckets.key(tp.fillS, tp.fillHl);
    }

    // Active download duration
    const activeDuration =
      this.cumulativeIdleTime +
      (util.isEmpty(this.firstEventTime)
        ? 0
        : (util.isEmpty(this.lastNetworkActivityTime)
            ? platform.platform.now()
            : this.lastNetworkActivityTime) - this.firstEventTime);

    raw.activeDuration = activeDuration;
    return raw;
  }

  /**
   * Builds an object of human-readable throughput / IQR / T-Digest
   * statistics suitable for logging or debug overlays.
   *
   * @returns {Object} Formatted statistics.
   */
  getFormattedStats() {
    const stats = {};
    const snapshot = this.getThroughputSnapshot();

    if (!snapshot.confidence || !snapshot['throughput-ewma']) return stats;

    stats.aseavtp = Number(snapshot['throughput-ewma'].average).toFixed(2);
    stats.asevartp = Number(snapshot['throughput-ewma'].xg).toFixed(2);

    if (snapshot.iqrResult) {
      const iqr = snapshot.iqrResult.iqrStats;
      if (
        iqr &&
        iqr.fragmentStartTimeTicks !== undefined &&
        iqr.fragmentEndTimeTicks !== undefined &&
        iqr.timescaleDivisor !== undefined &&
        !isNaN(iqr.fragmentStartTimeTicks || 0) &&
        !isNaN(iqr.fragmentEndTimeTicks) &&
        !isNaN(iqr.timescaleDivisor)
      ) {
        stats.aseniqr =
          iqr.timescaleDivisor > 0
            ? Number((iqr.fragmentStartTimeTicks - iqr.fragmentEndTimeTicks) / iqr.timescaleDivisor).toFixed(2)
            : -1;
        stats.aseiqr = Number(iqr.fragmentStartTimeTicks - iqr.fragmentEndTimeTicks).toFixed(2);
        stats.asemedtp = Number(iqr.timescaleDivisor).toFixed(2);
      }
      stats.iqrsamples = snapshot.iqrResult.sampleCount;
    }

    if (snapshot.tdigestResult?.timerHandle) {
      stats.tdigest = snapshot.tdigestResult.timerHandle();
    }

    return stats;
  }

  /**
   * Delegates to session history to retrieve all stored sessions.
   * @returns {Array}
   */
  getSessionHistory() {
    return this.sessionHistory.getSessionHistory();
  }

  /**
   * Builds a session-summary object for endplay logging.
   * @returns {Object|undefined}
   */
  getSessionSummary() {
    if (this.sessionSegmentStart === undefined) return undefined;

    const elapsed = platform.platform.now() - this.sessionSegmentStart;
    const ewma = this.filterMap.average?.key(platform.platform.now(), this.pendingBytes)?.average;
    const avgResponseTime = this.filterMap['response-time-average']?.getMetrics()?.averageResponseTime ?? 0;
    const throughputBuckets = this.filterMap['throughput-bucket-percentiles']?.getMetrics()?.percentiles ?? [];
    const responseTimeBuckets = this.filterMap['response-time-bucket-percentiles']?.getMetrics()?.percentiles ?? [];

    const summary = {
      startTimeSec: Math.floor(this.sessionSegmentStart / 1000),
      duration: elapsed,
      throughputEstimate: ewma,
      avgResponseTime,
      throughputBuckets,
      responseTimeBuckets,
    };

    const entropy = this._entropyResult;
    if (entropy?.logMediaPipelineStatus !== undefined) {
      summary.hdEntropy = entropy.logMediaPipelineStatus;
    }
    if (entropy?.uhd !== undefined) {
      summary.uhdEntropy = entropy.uhd;
    }

    const covMetric = this.filterMap['throughput-coefficient-of-variation']?.getMetrics()?.coefficientOfVariation;
    if (covMetric !== undefined) summary.coefficientOfVariation = covMetric;

    const trendMetric = this.filterMap['throughput-trend']?.getMetrics()?.marginalUtility;
    if (trendMetric !== undefined) summary.throughputTrend = trendMetric;

    const switchMetric = this.filterMap['throughput-switches']?.getMetrics()?.switchCount;
    if (switchMetric !== undefined) summary.throughputSwitches = switchMetric;

    const lowTp = this.filterMap['low-throughput']?.getMetrics();
    if (lowTp?.LV !== undefined) summary.lowThroughputDuration = lowTp.LV;
    if (lowTp?.zT !== undefined) summary.lowThroughputCount = lowTp.zT;

    const traceAvg = this.sessionTraceSummary?.getAverageTrace();
    if (traceAvg !== undefined) summary.traceAverage = Math.round(traceAvg);

    const traceCount = this.sessionTraceSummary?.getTraceCount();
    if (traceCount !== undefined) summary.traceCount = traceCount;

    return summary;
  }

  /* ------------------------------------------------------------------ */
  /*  Confidence callback                                                */
  /* ------------------------------------------------------------------ */

  /**
   * Invoked when the confidence filter reaches HAVE_ENOUGH. Starts a
   * periodic timer that keeps pushing the latest estimate into the
   * location selector.
   * @private
   */
  _onConfidenceReady() {
    this._publishThroughputToLocationSelector();
    this._publishInterval = setInterval(
      this._publishThroughputBound,
      this.config.historicBandwidthUpdateInterval,
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Request abandonment                                                */
  /* ------------------------------------------------------------------ */

  /**
   * Waits for fresh bandwidth data, then returns a snapshot taken
   * *after* the EWMA has been updated. Used by the abandonment
   * controller to make a cancel/keep decision.
   *
   * @returns {Promise<{freshEstimate: number, staleEstimate: number, connectionTime: number}|null>}
   */
  async getPostAbandonmentEstimate() {
    const snapshot = this.getThroughputSnapshot();
    const staleEstimate = snapshot.average.average;
    const connectionTime = snapshot.connectionTimeAverage.average;

    if (this.isAbandonmentLocked) {
      return { freshEstimate: staleEstimate, staleEstimate, connectionTime };
    }

    this.lastAbandonmentLockTime = platform.platform.now();

    const cfg = this.config;
    const defaultFilterName = cfg.defaultFilter;
    const secondaryFilterName = cfg.secondaryFilter;

    if (!defaultFilterName.match(/ewma/)) return null;

    // Wait for the next data-received event so we have a fresh sample
    this.dataReceivedDeferred = new Deferred();
    await this.dataReceivedDeferred;

    const freshSnapshot = this.getThroughputSnapshot();
    const fastSw = freshSnapshot['throughput-sw-fast']?.average || 0;

    // Reset the primary (and secondary) filter so the *next* estimate
    // starts from a clean state after abandonment.
    this.filterMap[defaultFilterName]?.reset();
    if (secondaryFilterName !== 'none') {
      this.filterMap[secondaryFilterName]?.reset();
    }

    return { freshEstimate: fastSw, staleEstimate, connectionTime };
  }
}

export default NetworkMonitor;
