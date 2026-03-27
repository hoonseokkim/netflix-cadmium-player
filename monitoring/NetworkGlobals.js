/**
 * @module NetworkGlobals
 * @description Singleton manager for global network monitoring state.
 * Aggregates throughput, latency, and general network monitors into a single
 * access point. Supports periodic persistence of throughput/latency history.
 *
 * @see Module_3033
 */

import { __importDefault } from '../core/tslib';
import { platform } from '../core/Platform';
import { timestampBuffer } from '../timing/TimestampBuffer';
import ThroughputMonitor from '../monitoring/ThroughputMonitor';
import LatencyMonitor from '../monitoring/LatencyMonitor';
import NetworkMonitorAggregator from '../monitoring/NetworkMonitorAggregator';
import { assert } from '../assert/Assert';
import { Ulb as HistoryTracker } from '../monitoring/HistoryTracker';
import DefaultMonitor from '../monitoring/DefaultMonitor';

/** @type {NetworkGlobals|undefined} */
let singletonInstance;

/**
 * Global network monitoring singleton that owns throughput, latency,
 * and aggregated network monitors.
 */
export class NetworkGlobals {
  /** @type {object|undefined} Frozen config snapshot */
  static config;

  /** @type {*} */
  static platformRef;

  /**
   * @param {object} config - Network monitoring configuration
   * @param {*} platformTag - Platform identifier
   * @param {*} platformRef - Platform reference
   */
  constructor(config, platformTag, platformRef) {
    this.throughputMonitor = new ThroughputMonitor(config, platformRef);
    this.latencyMonitor = new LatencyMonitor(config);
    this.defaultMonitor = new DefaultMonitor(config);
    this.networkMonitor = new NetworkMonitorAggregator(
      this.latencyMonitor,
      this.throughputMonitor,
      this.defaultMonitor,
      config,
    );
    this.historyTracker = new HistoryTracker(platform.aqa, platformTag);
    timestampBuffer.initialize(config);

    if (config.periodicHistoryPersistMs) {
      this._persistInterval = setInterval(() => {
        this.throughputMonitor.save();
        this.latencyMonitor.save();
      }, config.periodicHistoryPersistMs);
    }
  }

  /**
   * Gets or creates the singleton instance.
   * @param {object} config
   * @param {*} platformTag
   * @param {*} platformRef
   * @returns {NetworkGlobals}
   */
  static getOrCreate(config, platformTag, platformRef) {
    if (singletonInstance === undefined) {
      NetworkGlobals.config = config;
      NetworkGlobals.platformRef = platformRef;
      singletonInstance = new NetworkGlobals(config, platformTag, platformRef);
    } else {
      assert(NetworkGlobals.config === config);
      assert(NetworkGlobals.platformRef === platformRef);
    }
    return singletonInstance;
  }

  /**
   * Returns the existing singleton, throwing if not yet created.
   * @returns {NetworkGlobals}
   */
  static instance() {
    assert(singletonInstance, 'CommonGlobals accessed too early');
    return singletonInstance;
  }

  /**
   * Destroys the singleton and releases resources (static).
   */
  static destroy() {
    NetworkGlobals.config = undefined;
    NetworkGlobals.platformRef = undefined;
    singletonInstance?.destroy();
    singletonInstance = undefined;
  }

  /**
   * Destroys this instance's monitors and clears the persist interval.
   */
  destroy() {
    this.networkMonitor.destroy();
    if (this._persistInterval) {
      clearInterval(this._persistInterval);
    }
  }
}

export { NetworkGlobals };
