/**
 * Netflix Cadmium Player — Session Throughput History
 *
 * Persists per-session throughput summaries to platform storage so that
 * the ABR controller can warm-start bandwidth estimation on subsequent
 * playback sessions (e.g. after a page reload or app restart).
 *
 * Each stored record contains:
 *  - `average`  — EWMA throughput estimate at session end (kbps).
 *  - `neuhd`    — Network-entropy UHD metric for the session.
 *  - `d`        — Active download duration of the session (ms).
 *  - `t`        — Timestamp when the session was recorded.
 *
 * @module SessionHistory
 */

// import { platform } from '../core/AsejsEngine.js';

const logger = new platform.Console('ASEJS_SESSION_HISTORY', 'media|asejs');

/**
 * @typedef {Object} SessionRecord
 * @property {number} average - EWMA throughput at session end (kbps).
 * @property {number} neuhd   - UHD entropy measurement.
 * @property {number} d       - Active download duration (ms).
 * @property {number} t       - Timestamp of the recording (ms since epoch).
 */

/**
 * Manages a bounded list of recent session throughput records stored in
 * platform-level persistent storage.
 */
class SessionHistory {
  /**
   * @param {Object} config - Player configuration.
   * @param {number} config.minSessionHistoryDuration - Minimum duration (ms) for a session to be stored.
   * @param {number} config.maxNumSessionHistoryStored - Maximum number of stored records.
   */
  constructor(config) {
    this.config = config;

    /** @type {SessionRecord} In-progress record for the current session. */
    this.currentSession = {
      avtp: 0,
      neuhd: 0,
      d: 0,
      t: 0,
    };

    this._loadFromStorage();
  }

  /* ------------------------------------------------------------------ */
  /*  Storage I/O                                                        */
  /* ------------------------------------------------------------------ */

  /**
   * Loads previously persisted session records from platform storage,
   * filters out stale / invalid entries, and sorts by timestamp.
   * @private
   */
  _loadFromStorage() {
    const raw = platform.storage.key('sth');

    if (raw) {
      const minDuration = this.config.minSessionHistoryDuration;

      /** @type {SessionRecord[]} */
      this.sessionHistory = raw
        .filter((entry) => entry.d >= minDuration && entry.neuhd >= 0 && entry.average > 0)
        .sort((a, b) => a.t - b.t);

      logger.log('session history list: ', this.sessionHistory);
    } else {
      this.sessionHistory = [];
    }
  }

  /**
   * Saves the current session record to the persisted history list
   * (if it meets minimum-duration / validity constraints), then resets
   * the in-progress record.
   */
  save() {
    const record = this.currentSession;

    if (
      record.d >= this.config.minSessionHistoryDuration &&
      record.neuhd >= 0 &&
      record.average > 0
    ) {
      this.sessionHistory.push(record);

      // Trim to the configured maximum
      const maxStored = this.config.maxNumSessionHistoryStored;
      if (this.sessionHistory.length > maxStored) {
        this.sessionHistory = this.sessionHistory.slice(
          this.sessionHistory.length - maxStored,
        );
      }

      if (this.sessionHistory.length) {
        logger.log('saving state: ', JSON.stringify(this.sessionHistory));
        platform.storage.set('sth', this.sessionHistory);
      }
    }

    // Reset in-progress record
    this.currentSession = { avtp: 0, neuhd: 0, d: 0, t: 0 };
  }

  /* ------------------------------------------------------------------ */
  /*  Lifecycle                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Fully resets both in-memory history and the current session record
   * (e.g. on user sign-out or explicit cache clear).
   */
  reset() {
    this.sessionHistory = [];
    this.currentSession = { avtp: 0, neuhd: 0, d: 0, t: 0 };
  }

  /* ------------------------------------------------------------------ */
  /*  Accessors                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Returns the full list of persisted session records.
   * @returns {SessionRecord[]}
   */
  getSessionHistory() {
    return this.sessionHistory;
  }

  /**
   * Updates the in-progress record with the latest throughput, entropy,
   * and duration values from the current playback session.
   *
   * @param {number} averageThroughput - Current EWMA throughput (kbps).
   * @param {number} uhdEntropy        - UHD entropy metric.
   * @param {number} activeDuration    - Active download duration (ms).
   */
  updateCurrentSession(averageThroughput, uhdEntropy, activeDuration) {
    this.currentSession.average = averageThroughput;
    this.currentSession.neuhd = uhdEntropy;
    this.currentSession.d = activeDuration;
    this.currentSession.t = platform.platform.now();
  }
}

export default SessionHistory;
