/**
 * Netflix Cadmium Player - LocationHistory
 * Maintains per-CDN and global throughput/bandwidth history for adaptive bitrate
 * selection. Tracks throughput samples, connection info, response times, IQR stats,
 * and TDigest histograms. Persists state to platform storage across sessions.
 *
 * @module LocationHistory
 */

// import { __assign, __importStar, __importDefault } from 'tslib';
// import * as utils from './Module_17267';
// import { platform } from './Module_66164';
// import NetworkConstants from './Module_14282';
// import { FilterFactory } from './Module_97315';
// import { loadFromStorage } from './Module_28600';

/**
 * Helper to get or initialize a nested property on an object.
 * @param {Object} obj - The target object.
 * @param {string} key - The property key.
 * @param {*} defaultValue - Default value if key doesn't exist.
 * @returns {*} The existing or newly-set value.
 */
function getOrSet(obj, key, defaultValue) {
  return utils.has(obj, key) ? obj[key] : (obj[key] = defaultValue);
}

/**
 * Default (empty) bandwidth estimate state.
 * @type {Object}
 */
const EMPTY_BANDWIDTH_STATE = {
  confidence: NetworkConstants.ReadyState.HAVE_NOTHING,
  bufferLength: { average: 0 },
  throughputLocationHistory: { average: 0 },
  default: { average: 0 },
  playbackRateRef: { average: 0 },
  throughputEstimateObj: { average: 0 },
  timestamp: 0,
};

/**
 * Per-CDN bandwidth/throughput history tracker.
 * Manages multiple filtered history streams (throughput, response time, IQR, etc.)
 * and computes aggregated bandwidth estimates.
 */
class CdnBandwidthHistory {
  /**
   * @param {Object} config - Bandwidth estimation configuration.
   * @param {number} config.bandwidthExpirationTime - Seconds before bandwidth data expires.
   * @param {number} config.fastHistoricBandwidthExpirationTime - Seconds before fast-path data degrades.
   * @param {Object} [config.filterDefinitionOverrides] - Override filter parameters.
   * @param {Object} config.defaultFilterDefinitions - Default filter definitions.
   */
  constructor(config) {
    /** @type {Object} */
    this.config = config;

    const overrides = config.filterDefinitionOverrides;
    const factory = new FilterFactory(config);

    /** @type {number} Current confidence level (HAVE_NOTHING..HAVE_ENOUGH) */
    this.confidence = NetworkConstants.ReadyState.HAVE_NOTHING;

    /** @type {Object} */
    this.defaultFilterDefinitions = config.defaultFilterDefinitions;

    /** @type {Object} Primary throughput filter */
    this.bufferLength = factory.create("throughput-location-history", overrides);

    /** @type {Object} Instantaneous throughput filter */
    this.throughputLocationHistory = factory.create("throughput-location-history", overrides);

    /** @type {Object} Throughput confidence interval (initial) */
    this.throughputCiInitial = factory.create("throughput-location-history", overrides);

    /** @type {Object} Throughput confidence interval (low) */
    this.throughputCiLow = factory.create("throughput-location-history", overrides);

    /** @type {Object} Throughput confidence interval (high) */
    this.throughputCiHigh = factory.create("throughput-location-history", overrides);

    /** @type {Object} Response connection time filter */
    this.playbackRateRef = factory.create("respconn-location-history", overrides);

    /** @type {Object} Server-reported timing filter */
    this.throughputEstimateObj = factory.create("respconn-location-history", overrides);

    /** @type {Object} TDigest-based throughput histogram */
    this.tdigestHistory = factory.create("throughput-tdigest-history", overrides);

    /** @type {Object} IQR-based throughput statistics */
    this.iqrHistory = factory.create("throughput-iqr-history", overrides);

    /** @type {Object} Download time average filter */
    this.downloadTimeAvg = factory.create("throughput-location-history", overrides);

    /** @type {Object} Download time variance filter */
    this.downloadTimeVariance = factory.create("throughput-location-history", overrides);

    /** @type {Object} Download time-to-first-byte average filter */
    this.downloadTtfbAvg = factory.create("throughput-location-history", overrides);

    /** @type {Object} Download time-to-first-byte variance filter */
    this.downloadTtfbVariance = factory.create("throughput-location-history", overrides);

    /** @type {number|null} Timestamp of the last throughput sample */
    this.lastSampleTimestamp = null;
  }

  /**
   * Record a new throughput sample.
   * @param {number} throughput - The throughput value.
   * @param {number} confidence - The confidence level.
   */
  recordThroughput(throughput, confidence) {
    this.confidence = confidence;
    this.bufferLength.item(throughput);
    this.tdigestHistory.item(throughput);
    this.lastSampleTimestamp = platform.platform.now();
    this.clearFailure();
  }

  /**
   * Record an instantaneous throughput measurement.
   * @param {number} instantThroughput
   */
  recordInstantThroughput(instantThroughput) {
    this.throughputLocationHistory.item(instantThroughput);
    this.clearFailure();
  }

  /**
   * Record throughput confidence interval values.
   * @param {Object} ci - Confidence interval with initial, low, high fields.
   */
  recordThroughputCi(ci) {
    this.throughputCiInitial.item(ci.initial);
    this.throughputCiLow.item(ci.low);
    this.throughputCiHigh.item(ci.high);
    this.clearFailure();
  }

  /**
   * Record IQR (interquartile range) statistics.
   * @param {Object} iqrData - IQR data object.
   * @param {number} iqrValue - IQR computed value.
   */
  recordIqr(iqrData, iqrValue) {
    this.iqrHistory.set(iqrData, iqrValue);
    this.clearFailure();
  }

  /**
   * Record connection info (response time, connection count, etc.).
   * @param {Object} connectionInfo
   */
  recordConnectionInfo(connectionInfo) {
    this.playbackRateRef.item(connectionInfo);
    this.clearFailure();
  }

  /**
   * Record server-reported timing data.
   * @param {Object} serverTiming
   */
  recordServerTiming(serverTiming) {
    this.throughputEstimateObj.item(serverTiming);
    this.clearFailure();
  }

  /**
   * Record download time statistics.
   * @param {Object} downloadStats - Object with average, variance, ttfbAvg, ttfbVariance fields.
   */
  recordDownloadTime(downloadStats) {
    this.downloadTimeAvg.item(downloadStats.average);
    this.downloadTimeVariance.item(downloadStats.variance);
    this.downloadTtfbAvg.item(downloadStats.ttfbAvg);
    this.downloadTtfbVariance.item(downloadStats.ttfbVariance);
    this.clearFailure();
  }

  /**
   * Serialize the current state for persistence.
   * @returns {Object|null} Serialized state, or null if no data.
   */
  getState() {
    const state = {
      c: this.confidence,
      t: utils.isEmpty(this.lastSampleTimestamp) ? null : platform.platform.toRelativeTime(this.lastSampleTimestamp),
      tp: this.bufferLength.getState(),
      itp: this.throughputLocationHistory.getState(),
      tcii: this.throughputCiInitial.getState(),
      tcil: this.throughputCiLow.getState(),
      tcih: this.throughputCiHigh.getState(),
      rt: this.playbackRateRef.getState(),
      hrt: this.throughputEstimateObj.getState(),
      iqr: this.iqrHistory.getState(),
      td: this.tdigestHistory.getState(),
      dta: this.downloadTimeAvg.getState(),
      dtv: this.downloadTimeVariance.getState(),
      dtta: this.downloadTtfbAvg.getState(),
      dttv: this.downloadTtfbVariance.getState(),
    };

    return (utils.isEmpty(state.tp) && utils.isEmpty(state.rt) && utils.isEmpty(state.hrt))
      ? null
      : state;
  }

  /**
   * Restore state from a previously serialized snapshot.
   * @param {Object} state - Serialized state.
   * @returns {boolean} Whether the state was valid and restored.
   */
  restoreState(state) {
    const now = platform.platform.now();

    if (!state || utils.isEmpty(state.c) || utils.isEmpty(state.t) || utils.isEmpty(state.tp) ||
        !utils.isFinite(state.c) || !utils.isFinite(state.t) || utils.isEmpty(state.t) ||
        state.c < 0 || state.c > NetworkConstants.ReadyState.HAVE_ENOUGH ||
        state.t > now || !this.bufferLength.restoreState(state.tp)) {
      this.confidence = NetworkConstants.ReadyState.HAVE_NOTHING;
      this.lastSampleTimestamp = null;
      this.clearFailure();
      this.bufferLength.restoreState(null);
      this.playbackRateRef.restoreState(null);
      this.throughputEstimateObj.restoreState(null);
      return false;
    }

    this.confidence = state.c;
    this.lastSampleTimestamp = platform.platform.fromRelativeTime(state.t);
    this.playbackRateRef.restoreState(state.rt);
    this.throughputEstimateObj.restoreState(state.hrt);
    this.throughputLocationHistory.restoreState(state.itp);
    this.throughputCiInitial.restoreState(state.tcii);
    this.throughputCiLow.restoreState(state.tcil);
    this.throughputCiHigh.restoreState(state.tcih);
    this.downloadTimeAvg.restoreState(state.dta);
    this.downloadTimeVariance.restoreState(state.dtv);
    this.downloadTtfbAvg.restoreState(state.dtta);
    this.downloadTtfbVariance.restoreState(state.dttv);
    if (!utils.isEmpty(state.iqr)) this.iqrHistory.restoreState(state.iqr);
    if (!utils.isEmpty(state.td)) this.tdigestHistory.restoreState(state.td);

    return true;
  }

  /**
   * Get the current bandwidth estimate.
   * Adjusts confidence based on data age.
   *
   * @returns {Object} Bandwidth estimate with confidence, throughput, response time, etc.
   */
  getBandwidthEstimate() {
    // Check for recent failure
    if (!utils.isUndefined(this.failureTimestamp)) {
      if ((platform.platform.now() - this.failureTimestamp) / 1000 < this.config.failureExpirationTime) {
        return { ...EMPTY_BANDWIDTH_STATE, isFailed: true };
      }
      this.clearFailure();
    }

    const config = this.config;
    if (utils.isEmpty(this.lastSampleTimestamp)) {
      return EMPTY_BANDWIDTH_STATE;
    }

    const ageSeconds = (platform.platform.now() - this.lastSampleTimestamp) / 1000;
    if (ageSeconds > config.bandwidthExpirationTime) {
      this.confidence = NetworkConstants.ReadyState.HAVE_NOTHING;
    } else if (ageSeconds > config.fastHistoricBandwidthExpirationTime) {
      this.confidence = Math.min(this.confidence, NetworkConstants.ReadyState.HAVE_SOMETHING);
    }

    const throughput = this.bufferLength.getBandwidthEstimate();
    const instantThroughput = this.throughputLocationHistory.getBandwidthEstimate();
    const ciInitial = this.throughputCiInitial.getBandwidthEstimate().average;
    const ciLow = this.throughputCiLow.getBandwidthEstimate().average;
    const ciHigh = this.throughputCiHigh.getBandwidthEstimate().average;
    const responseTime = this.playbackRateRef.getBandwidthEstimate();
    const serverTiming = this.throughputEstimateObj.getBandwidthEstimate();
    const iqr = this.iqrHistory.getBandwidthEstimate();
    const tdigest = this.tdigestHistory.getBandwidthEstimate();
    const downloadTime = {
      average: this.downloadTimeAvg.getWeightedAverage().average,
      variance: this.downloadTimeVariance.getWeightedAverage().average,
      ttfbAvg: this.downloadTtfbAvg.getBandwidthEstimate().average,
      ttfbVariance: this.downloadTtfbVariance.getBandwidthEstimate().average,
    };

    const estimate = {
      age: ageSeconds,
      confidence: this.confidence,
      bufferLength: throughput,
      throughputLocationHistory: instantThroughput,
      default: throughput,
      playbackRateRef: responseTime,
      throughputEstimateObj: serverTiming,
      iqrStats: iqr,
      tdigestStats: tdigest,
      downloadTimeStats: downloadTime,
      timestamp: 0,
      isFailed: false,
    };

    estimate["throughput-ci"] = {
      initial: ciInitial,
      low: ciLow,
      high: ciHigh,
    };

    return estimate;
  }

  /**
   * Serialize for session handoff.
   * @returns {Object}
   */
  serializeForHandoff() {
    return {
      f: utils.isUndefined(this.failureTimestamp) ? undefined : platform.platform.toRelativeTime(this.failureTimestamp),
      g: this.getState(),
      h: [null, null, null, null],
    };
  }

  /**
   * Restore from session handoff data.
   * @param {Object} data
   * @returns {boolean}
   */
  restoreFromHandoff(data) {
    this.failureTimestamp = utils.isUndefined(data.f) ? undefined : platform.platform.fromRelativeTime(data.f);
    return this.restoreState(data.g);
  }

  /**
   * Mark this CDN as failed at the given timestamp.
   * @param {number} timestamp
   */
  markFailed(timestamp) {
    this.failureTimestamp = timestamp;
  }

  /**
   * Debug helper: force a bandwidth estimate recalculation.
   */
  debug() {
    this.getBandwidthEstimate();
    if (!utils.isEmpty(this.lastSampleTimestamp)) {
      platform.platform.now(); // Trigger time check
    }
  }

  /**
   * Clear the failure state.
   * @private
   */
  clearFailure() {
    this.failureTimestamp = undefined;
  }
}

/**
 * Top-level location history manager that maintains per-CDN bandwidth histories
 * and a global aggregate. Persists data to platform storage.
 */
class LocationHistory {
  /**
   * @param {Object} config - Bandwidth estimation configuration.
   * @param {number} [config.overrideBandwidth] - Fixed bandwidth override (disables estimation).
   * @param {Function} loadValidator - Validator function for loading persisted data.
   */
  constructor(config, loadValidator) {
    /** @type {Object} */
    this.config = config;

    /** @type {Function} */
    this.loadValidator = loadValidator;

    this.resetHistory();

    /** @type {CdnBandwidthHistory} Global (CDN-agnostic) history */
    this.globalHistory = new CdnBandwidthHistory(this.config);

    this.loadPersistedState();

    // If a fixed bandwidth override is configured, return it directly
    if (config.overrideBandwidth) {
      const fixedEstimate = {
        ...EMPTY_BANDWIDTH_STATE,
        confidence: NetworkConstants.ReadyState.HAVE_ENOUGH,
        bufferLength: { average: config.overrideBandwidth, variance: 0 },
      };
      this.getBandwidthEstimate = () => fixedEstimate;
    }
  }

  /**
   * Get or create a CDN-specific bandwidth history.
   *
   * @param {string} [networkId] - The network identifier.
   * @param {string} [cdnId] - The CDN identifier.
   * @returns {CdnBandwidthHistory} The per-CDN history.
   */
  getCdnHistory(networkId, cdnId) {
    const networkEntry = getOrSet(this.history, networkId ?? "", {});
    return getOrSet(networkEntry, cdnId ?? "", new CdnBandwidthHistory(this.config));
  }

  /**
   * Load persisted state from platform storage.
   * @private
   */
  loadPersistedState() {
    const localHistory = loadFromStorage("lh", this.validateLocalHistory.bind(this));
    const globalState = loadFromStorage("gh", this.validateGlobalState.bind(this));

    if (localHistory) this.restoreLocalHistory(localHistory);
    if (globalState) this.restoreGlobalState(globalState);
  }

  /**
   * Validate global state from storage.
   * @private
   */
  validateGlobalState(data) {
    if (data && typeof data === "object") return data;
    return undefined;
  }

  /**
   * Validate local history from storage.
   * @private
   */
  validateLocalHistory(data) {
    if (data && typeof data === "object") {
      for (const networkId in data) {
        const networkEntry = data[networkId];
        for (const cdnId in networkEntry) {
          networkEntry[cdnId].g = this.validateGlobalState(networkEntry[cdnId].g) || null;
        }
      }
      return data;
    }
    return undefined;
  }

  /**
   * Get serialized state for all CDN histories.
   * @returns {Object}
   */
  getState() {
    const state = {};
    for (const networkId in this.history) {
      const networkEntry = this.history[networkId];
      for (const cdnId in networkEntry) {
        const cdnHistory = networkEntry[cdnId];
        getOrSet(state, networkId, {})[cdnId] = cdnHistory.serializeForHandoff();
      }
    }
    return state;
  }

  /**
   * Restore global state.
   * @private
   */
  restoreGlobalState(state) {
    this.globalHistory.restoreState(state);
  }

  /**
   * Restore local history from serialized state.
   * @private
   */
  restoreLocalHistory(state) {
    let allValid = true;
    for (const networkId in state) {
      const networkEntry = state[networkId];
      for (const cdnId in networkEntry) {
        const entry = networkEntry[cdnId];
        const history = new CdnBandwidthHistory(this.config);
        if (history.restoreFromHandoff(entry)) {
          getOrSet(this.history, networkId, {})[cdnId] = history;
        } else {
          allValid = false;
        }
      }
    }
    return allValid;
  }

  /**
   * Persist current state to platform storage.
   */
  save() {
    const localState = this.getState();
    platform.storage.set("lh", localState);
    platform.storage.set("gh", this.globalHistory.getState());
  }

  /**
   * Reset all history state.
   * @private
   */
  resetHistory() {
    /** @type {Object} Per-CDN history map: { networkId: { cdnId: CdnBandwidthHistory } } */
    this.history = {};

    /** @type {string} Current network identifier */
    this.currentNetworkId = "";

    /** @type {string} Current CDN identifier */
    this.currentCdnId = "";

    /** @type {CdnBandwidthHistory|null} Cached reference to the active CDN history */
    this.activeCdnHistory = null;
  }

  /**
   * Set the current network identifier.
   * @param {string} networkId
   */
  setNetworkId(networkId) {
    this.currentNetworkId = networkId;
    this.activeCdnHistory = null;
  }

  /**
   * Set the current CDN identifier.
   * @param {string} cdnId
   */
  setCdnId(cdnId) {
    this.currentCdnId = cdnId;
    this.activeCdnHistory = null;
  }

  /**
   * Get the active CDN history (lazy initialization).
   * @private
   * @returns {CdnBandwidthHistory}
   */
  getActiveCdnHistory() {
    if (utils.isEmpty(this.activeCdnHistory)) {
      this.activeCdnHistory = this.getCdnHistory(this.currentNetworkId, this.currentCdnId);
    }
    return this.activeCdnHistory;
  }

  // --- Forwarding methods (record to both active CDN and global history) ---

  /** @param {number} throughput @param {number} confidence */
  recordThroughput(throughput, confidence) {
    this.getActiveCdnHistory().recordThroughput(throughput, confidence);
    this.globalHistory.recordThroughput(throughput, confidence);
  }

  /** @param {number} instantThroughput */
  recordInstantThroughput(instantThroughput) {
    this.getActiveCdnHistory().recordInstantThroughput(instantThroughput);
    this.globalHistory.recordInstantThroughput(instantThroughput);
  }

  /** @param {Object} ci */
  recordThroughputCi(ci) {
    this.getActiveCdnHistory().recordThroughputCi(ci);
    this.globalHistory.recordThroughputCi(ci);
  }

  /** @param {Object} iqrData @param {number} iqrValue */
  recordIqr(iqrData, iqrValue) {
    if (iqrData?.fragmentEndTimeTicks && iqrData?.timescaleDivisor && iqrData?.fragmentStartTimeTicks) {
      this.getActiveCdnHistory().recordIqr(iqrData, iqrValue);
      this.globalHistory.recordIqr(iqrData, iqrValue);
    }
  }

  /** @param {Object} connectionInfo */
  recordConnectionInfo(connectionInfo) {
    this.getActiveCdnHistory().recordConnectionInfo(connectionInfo);
    this.globalHistory.recordConnectionInfo(connectionInfo);
  }

  /** @param {Object} serverTiming */
  recordServerTiming(serverTiming) {
    this.getActiveCdnHistory().recordServerTiming(serverTiming);
    this.globalHistory.recordServerTiming(serverTiming);
  }

  /** @param {Object} downloadStats */
  recordDownloadTime(downloadStats) {
    this.getActiveCdnHistory().recordDownloadTime(downloadStats);
    this.globalHistory.recordDownloadTime(downloadStats);
  }

  /**
   * Mark a specific CDN as failed.
   * @param {string} networkId - Network identifier.
   * @param {number} timestamp - Failure timestamp.
   */
  markFailed(networkId, timestamp) {
    this.getCdnHistory(networkId, this.currentCdnId).markFailed(timestamp);
  }

  /**
   * Get the best bandwidth estimate, preferring CDN-specific data
   * over the global estimate.
   *
   * @param {string} [networkId] - Optional network ID override.
   * @returns {Object} Bandwidth estimate.
   */
  getBandwidthEstimate(networkId) {
    const cdnHistory = networkId
      ? this.history[networkId]?.[this.currentCdnId]
      : null;

    if (cdnHistory) {
      const estimate = cdnHistory.getBandwidthEstimate();
      if (estimate.confidence > NetworkConstants.ReadyState.HAVE_NOTHING) {
        return estimate;
      }
    }

    return this.globalHistory.getBandwidthEstimate();
  }

  /**
   * Debug: log all history entries.
   */
  debug() {
    for (const networkId in this.history) {
      const networkEntry = this.history[networkId];
      for (const cdnId in networkEntry) {
        networkEntry[cdnId].debug(networkId);
      }
    }
  }
}

export default LocationHistory;
export { CdnBandwidthHistory };
