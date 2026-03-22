/**
 * Netflix Cadmium Player - NetworkInterruptionHistory
 * Tracks network streaming session durations and interruption events.
 * Records when concurrent streaming begins/ends and logs download
 * timing samples within a configurable sliding window.
 * Persists to platform storage for cross-session continuity.
 *
 * @module NetworkInterruptionHistory
 */

// import { __importStar } from 'tslib';
// import * as utils from './Module_17267';
// import { platform } from './Module_66164';

/**
 * Tracks network interruption timing for adaptive streaming decisions.
 * Maintains a time-windowed log of network events to help detect
 * patterns of connectivity issues.
 */
class NetworkInterruptionHistory {
  /**
   * @param {Object} config - Configuration.
   * @param {number} config.netIntrStoreWindow - Size of the sliding window (in ms of streaming time).
   */
  constructor(config) {
    /** @type {Object} */
    this.config = config;

    this.loadPersistedState();
  }

  /**
   * Persist the current state to platform storage.
   */
  save() {
    const state = this.getState();
    platform.storage.set("nh", state);
  }

  /**
   * Mark the beginning of a concurrent streaming session.
   * Starts the streaming clock if not already running.
   */
  startStreaming() {
    if (this.isStreaming) return;
    this.isStreaming = true;
    this.lastTimestamp = platform.platform.now();
  }

  /**
   * Mark the end of a concurrent streaming session.
   * Accumulates the elapsed streaming time.
   */
  stopStreaming() {
    if (!this.isStreaming) return;

    const now = platform.platform.now();
    this.totalStreamingTimeMs += now - this.lastTimestamp;
    this.lastTimestamp = now;
    this.isStreaming = false;
    this.lastInterruptionTimestamp = -1;
  }

  /**
   * Record a network download event with timing information.
   *
   * @param {number} downloadStartTime - When the download started (absolute time).
   * @param {number} downloadEndTime - When the download ended (absolute time).
   */
  recordDownloadEvent(downloadStartTime, downloadEndTime) {
    if (!this.isStreaming) return;

    // Update streaming time if download ended after our last checkpoint
    if (downloadEndTime > this.lastTimestamp) {
      this.totalStreamingTimeMs += downloadEndTime - this.lastTimestamp;
      this.lastTimestamp = downloadEndTime;
    }

    // Only record if this is a new interruption (not a duplicate)
    if (this.lastInterruptionTimestamp === -1 || downloadStartTime > this.lastInterruptionTimestamp) {
      const relativeStart = downloadEndTime - downloadStartTime;
      this.interruptionLog.push([this.totalStreamingTimeMs - relativeStart, relativeStart]);
      this.trimWindow();
      this.lastInterruptionTimestamp = downloadEndTime;
    }
  }

  /**
   * Trim the interruption log to keep only events within the sliding window.
   * @private
   */
  trimWindow() {
    const windowStart = this.totalStreamingTimeMs - this.config.netIntrStoreWindow;
    this.interruptionLog = this.interruptionLog.filter(entry => entry[0] > windowStart);
  }

  /**
   * Load persisted state from platform storage, or initialize fresh state.
   * @private
   */
  loadPersistedState() {
    const savedState = platform.storage.key("nh");
    if (!this.restoreState(savedState)) {
      this.lastTimestamp = platform.platform.now();
      this.totalStreamingTimeMs = 0;
      this.isStreaming = false;
      this.lastInterruptionTimestamp = -1;
      this.interruptionLog = [];
    }
  }

  /**
   * Restore state from a serialized snapshot.
   *
   * @param {Object} state - Previously serialized state.
   * @returns {boolean} Whether the state was valid and restored.
   */
  restoreState(state) {
    if (!(state && utils.has(state, "t") && utils.has(state, "s") &&
          utils.has(state, "i") && utils.isNumber(state.t) &&
          utils.isNumber(state.s) && utils.isArray(state.i))) {
      return false;
    }

    this.lastTimestamp = platform.platform.fromRelativeTime(1000 * state.t);
    this.totalStreamingTimeMs = 1000 * state.s;
    this.isStreaming = false;
    this.interruptionLog = state.i.map(entry => [1000 * entry[0], entry[1]]);
    this.lastInterruptionTimestamp = -1;
    return true;
  }

  /**
   * Serialize current state for persistence.
   * Timestamps are converted to seconds for compact storage.
   *
   * @returns {Object} Serialized state.
   */
  getState() {
    if (this.isStreaming) {
      const now = platform.platform.now();
      return {
        t: now / 1000 | 0,
        s: (this.totalStreamingTimeMs + (now - this.lastTimestamp)) / 1000 | 0,
        i: this.interruptionLog.map(entry => [entry[0] / 1000 | 0, entry[1]]),
      };
    }

    return {
      t: platform.platform.toRelativeTime(this.lastTimestamp) / 1000 | 0,
      s: this.totalStreamingTimeMs / 1000 | 0,
      i: this.interruptionLog.map(entry => [entry[0] / 1000 | 0, entry[1]]),
    };
  }
}

export default NetworkInterruptionHistory;
