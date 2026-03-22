/**
 * @module ZoneLogTracker
 * @description Tracks timed text/subtitle zone log entries against the current playback position.
 * Schedules timers to re-check when zone boundaries are crossed, notifying a callback
 * when the active zone entry changes.
 *
 * @original Module_7953
 */

const RETRY_DELAY_MS = 10;

export class ZoneLogTracker {
  /**
   * @param {Function} getCurrentTime - Returns the current playback time in ms.
   * @param {Function} [onZoneChange] - Callback invoked when the active zone entry changes.
   */
  constructor(getCurrentTime, onZoneChange) {
    /** @private */
    this.getCurrentTime = getCurrentTime;
    /** @private */
    this.onZoneChange = onZoneChange;
    /** @private */
    this.retryEnabled = false;
    /** @private */
    this.retryTimeout = undefined;
    /** @private */
    this.lastCheckedTime = undefined;
    /** @private */
    this.activeZoneEntry = undefined;
    /** @private */
    this.zoneLog = undefined;

    /** @private */
    this.retryCallback = () => {
      this.retryTimeout = undefined;
      this.update();
    };
  }

  /**
   * Updates the active zone entry based on current playback time.
   * If the active entry changes and `silent` is false, the onChange callback fires.
   *
   * @param {boolean} [silent=false] - If true, suppresses the change callback.
   */
  update(silent) {
    const currentTime = this.getCurrentTime();

    if (this.lastCheckedTime !== currentTime) {
      const entries = this.zoneLog?.zoneLog(currentTime)?.[0];
      let matchedEntry;

      if (entries && 'startTime' in entries) {
        if (entries.startTime <= currentTime && currentTime <= entries.endTime) {
          matchedEntry = entries;
          this.scheduleRetry(entries.endTime - currentTime);
        } else {
          this.scheduleRetry(entries.startTime - currentTime);
        }
      }

      this.lastCheckedTime = currentTime;

      if (this.activeZoneEntry !== matchedEntry) {
        this.activeZoneEntry = matchedEntry;
        if (!silent && this.onZoneChange) {
          this.onZoneChange();
        }
      }
    }
  }

  /**
   * Enables retry polling and performs an initial update.
   */
  start() {
    this.retryEnabled = true;
    this.update();
  }

  /**
   * Sets the zone log data source. Resets tracked state.
   * If data is null/undefined, stops the timer.
   *
   * @param {Object|null} data - The zone log data provider.
   */
  setZoneLog(data) {
    this.zoneLog = data;
    this.activeZoneEntry = this.lastCheckedTime = undefined;
    if (!data) {
      this.stop();
    }
  }

  /**
   * Stops tracking and clears any pending timer.
   */
  stop() {
    this.retryEnabled = false;
    this.clearTimer();
  }

  /**
   * Silently updates and returns the current active zone entry.
   *
   * @returns {Object|undefined} The active zone entry, if any.
   */
  getActiveZoneEntry() {
    this.update(true);
    return this.activeZoneEntry;
  }

  /**
   * Schedules a retry timer to re-check zone boundaries.
   *
   * @private
   * @param {number} delayMs - Delay until next check.
   */
  scheduleRetry(delayMs) {
    this.clearTimer();
    if (this.retryEnabled && delayMs > 0) {
      this.retryTimeout = Da.setTimeout(this.retryCallback, delayMs + RETRY_DELAY_MS);
    }
  }

  /**
   * Clears any pending retry timer.
   *
   * @private
   */
  clearTimer() {
    if (this.retryTimeout) {
      Da.clearTimeout(this.retryTimeout);
      this.retryTimeout = undefined;
    }
  }
}
