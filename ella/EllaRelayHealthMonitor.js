/**
 * Netflix Cadmium Player - Ella Relay Health Monitor
 *
 * Tracks the health of Ella relay nodes used for low-latency live streaming.
 * Monitors consecutive missed segments and windowed error counts to detect
 * and mark failed relay nodes, enabling failover to healthy alternatives.
 *
 * @module ella/EllaRelayHealthMonitor
 */

/**
 * Tracks the health status of a single Ella relay node.
 *
 * Failure detection uses two mechanisms:
 * 1. Consecutive missed segments exceeding a threshold
 * 2. Total errors within a sliding window exceeding a threshold
 */
export class RelayNodeHealth {
  /**
   * @param {boolean} isFailed - Initial failure state.
   * @param {number} failureRecordWindowMs - Total window duration for tracking errors.
   * @param {number} maxFailuresInWindow - Max errors before marking failed.
   * @param {number} maxConsecutiveFailures - Max consecutive misses before marking failed.
   * @param {number} healthMonitoringWindowMs - Duration of each monitoring sub-window.
   * @param {Object} console - Logging console.
   * @param {string} relayNodeId - Identifier for this relay node.
   */
  constructor(
    isFailed,
    failureRecordWindowMs,
    maxFailuresInWindow,
    maxConsecutiveFailures,
    healthMonitoringWindowMs,
    console,
    relayNodeId
  ) {
    /** @type {boolean} Whether this relay is currently marked as failed */
    this.isFailed = isFailed;
    /** @type {Object} */
    this.console = console;
    /** @type {string} */
    this.relayNodeId = relayNodeId;
    /** @type {number} Current consecutive missed segment count */
    this.consecutiveMissedCount = 0;
    /** @private @type {Array<number>} Error counts per monitoring sub-window */
    this.windowFailureCounts = [];
    /** @type {number} */
    this.maxFailuresInWindow = maxFailuresInWindow;
    /** @type {number} */
    this.maxConsecutiveFailures = maxConsecutiveFailures;
    /** @type {number} Maximum number of sub-window slots to track */
    this.maxWindowSlots = Math.max(
      1,
      Math.floor(failureRecordWindowMs / healthMonitoringWindowMs)
    );
  }

  /**
   * Records consecutive missed segments. Marks the node as failed
   * if the count exceeds the threshold.
   *
   * @param {number} count - Current consecutive miss count.
   * @returns {boolean} Whether this call caused a state change to failed.
   */
  recordConsecutiveMiss(count) {
    const wasFailed = this.isFailed;
    this.consecutiveMissedCount = count;

    if (count >= this.maxConsecutiveFailures) {
      this.console.log(
        `Marking relay node ${this.relayNodeId} as failed (consecutive missed) - ` +
          `consecutive missed: ${count}/${this.maxConsecutiveFailures}`
      );
      this.isFailed = true;
    }

    return !wasFailed && this.isFailed;
  }

  /**
   * Records errors within a monitoring window. Marks the node as failed
   * if total errors across windows exceed the threshold.
   *
   * @param {number} errorCount - Error count for this window.
   * @returns {boolean} Whether this call caused a state change to failed.
   */
  recordWindowFailure(errorCount) {
    const wasFailed = this.isFailed;

    this.windowFailureCounts.push(errorCount);
    while (this.windowFailureCounts.length > this.maxWindowSlots) {
      this.windowFailureCounts.shift();
    }

    const totalErrors = this.windowFailureCounts.reduce(
      (sum, n) => sum + n,
      0
    );
    if (totalErrors >= this.maxFailuresInWindow) {
      this.console.log(
        `Marking relay node ${this.relayNodeId} as failed (window errors) - ` +
          `total window errors: ${totalErrors}/${this.maxFailuresInWindow}, ` +
          `windows tracked: ${this.windowFailureCounts.length}/${this.maxWindowSlots}`
      );
      this.isFailed = true;
    }

    return !wasFailed && this.isFailed;
  }

  /**
   * Returns the total error count across all tracked windows.
   * @returns {number}
   */
  getTotalWindowErrors() {
    return this.windowFailureCounts.reduce((sum, n) => sum + n, 0);
  }

  /**
   * Resets the consecutive missed segment counter.
   */
  resetConsecutiveMissed() {
    this.consecutiveMissedCount = 0;
  }
}

/**
 * Manages health monitoring across all Ella relay nodes.
 *
 * Provides relay selection (picking the next healthy node), failure
 * reporting, and health tracking. When all relays are marked failed,
 * getNextValidRelay returns null, signaling that HTTP fallback should
 * be used.
 */
export class EllaRelayHealthMonitor {
  /**
   * @param {Object} console - Logging console.
   * @param {Object} relayServersByType - Map of media type to relay server lists.
   * @param {Object} config - Configuration parameters.
   * @param {number} config.ellaRelayFailureRecordWindowMs - Total failure tracking window.
   * @param {number} config.ellaRelayMaxFailuresInWindow - Max errors before failure.
   * @param {number} config.ellaRelayMaxConsecutiveFailures - Max consecutive misses.
   * @param {number} config.ellaChannelHealthMonitoringWindowMs - Sub-window duration.
   */
  constructor(console, relayServersByType, config) {
    /** @type {Object} */
    this.console = console;
    /** @type {Object} */
    this.relayServersByType = relayServersByType;
    /** @type {Map<string, RelayNodeHealth>} */
    this.relayHealthMap = new Map();

    /** @type {number} */
    this.failureRecordWindowMs = Number(config.ellaRelayFailureRecordWindowMs);
    /** @type {number} */
    this.maxFailuresInWindow = Number(config.ellaRelayMaxFailuresInWindow);
    /** @type {number} */
    this.maxConsecutiveFailures = Number(
      config.ellaRelayMaxConsecutiveFailures
    );
    /** @type {number} */
    this.healthMonitoringWindowMs = Number(
      config.ellaChannelHealthMonitoringWindowMs
    );
  }

  /**
   * Finds the next healthy relay node for the given media type.
   *
   * @param {number} mediaType - The media type (e.g. VIDEO, AUDIO).
   * @returns {string|null} The relay node ID, or null if all are failed.
   */
  getNextValidRelay(mediaType) {
    let result = null;
    const relays = this.relayServersByType[mediaType];

    for (const relay of relays) {
      const health = this.relayHealthMap.get(relay);
      if (health === undefined || !health.isFailed) {
        result = relay;
        break;
      }
    }

    return result;
  }

  /**
   * Gets or creates the health tracker for a relay node.
   *
   * @param {string} relayId - Relay node identifier.
   * @returns {RelayNodeHealth}
   */
  getRelayHealth(relayId) {
    let health = this.relayHealthMap.get(relayId);
    if (!health) {
      health = new RelayNodeHealth(
        false,
        this.failureRecordWindowMs,
        this.maxFailuresInWindow,
        this.maxConsecutiveFailures,
        this.healthMonitoringWindowMs,
        this.console,
        relayId
      );
      this.relayHealthMap.set(relayId, health);
    }
    return health;
  }

  /**
   * Reports consecutive missed segments for a relay.
   *
   * @param {string} relayId - Relay node identifier.
   * @param {string} channelId - Channel identifier.
   * @param {number} missedCount - Current consecutive missed count.
   * @returns {boolean} Whether the relay was newly marked as failed.
   */
  checkConsecutiveMissed(relayId, channelId, missedCount) {
    const health = this.getRelayHealth(relayId);
    const newlyFailed = health.recordConsecutiveMiss(missedCount);
    this.console.pauseTrace(
      'reportConsecutiveMissedSegments: ',
      relayId,
      channelId,
      missedCount,
      'failed:',
      health.isFailed
    );
    return newlyFailed;
  }

  /**
   * Reports missed segments within a monitoring window.
   *
   * @param {string} relayId - Relay node identifier.
   * @param {string} channelId - Channel identifier.
   * @param {number} errorCount - Error count for this window.
   * @returns {boolean} Whether the relay was newly marked as failed.
   */
  checkWindowMissed(relayId, channelId, errorCount) {
    const health = this.getRelayHealth(relayId);
    const newlyFailed = health.recordWindowFailure(errorCount);
    this.console.pauseTrace(
      'reportMissedSegmentsInWindow: ',
      relayId,
      channelId,
      errorCount,
      'totalWindowErrors:',
      health.getTotalWindowErrors(),
      'failed:',
      health.isFailed
    );
    return newlyFailed;
  }

  /**
   * Reports a channel join failure, immediately marking the relay as failed.
   *
   * @param {string} relayId - Relay node identifier.
   * @param {string} channelId - Channel identifier.
   */
  reportChannelFailure(relayId, channelId) {
    const health = this.getRelayHealth(relayId);
    health.isFailed = true;
    this.console.log(
      'reportJoinFailure: ',
      relayId,
      channelId,
      health,
      this.getNextValidRelay(0 /* MediaType.VIDEO */)
    );
  }

  /**
   * Reports a successful segment receipt, resetting the consecutive miss counter.
   *
   * @param {string} relayId - Relay node identifier.
   * @param {string} channelId - Channel identifier.
   */
  reportChannelSuccess(relayId, channelId) {
    this.console.pauseTrace('reportSegmentReceived: ', relayId, channelId);
    const health = this.relayHealthMap.get(relayId);
    if (health) health.resetConsecutiveMissed();
  }
}
