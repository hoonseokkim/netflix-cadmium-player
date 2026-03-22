/**
 * @module ZoneLogTracker
 * @description Tracks the currently active zone log entry (e.g., ad break, chapter marker)
 * relative to the current playback position. Schedules timer-based re-checks so that
 * zone transitions trigger callbacks at the right moment. Used for ad-zone awareness
 * and timed-text region tracking.
 *
 * @see Module_7953
 */

/**
 * Monitors playback position against a set of zone log entries and fires
 * a callback when the active zone changes.
 */
export class ZoneLogTracker {
  /** @type {number} Extra delay (ms) added when scheduling the next zone check */
  static RETRY_DELAY_MS = 10;

  /**
   * @param {function(): number} getPositionFn - Returns current playback position
   * @param {function(): void} [onZoneChangedFn] - Called when the active zone changes
   */
  constructor(getPositionFn, onZoneChangedFn) {
    /** @private */
    this._getPosition = getPositionFn;

    /** @private */
    this._onZoneChanged = onZoneChangedFn;

    /** @private */
    this._enabled = false;

    /** @private */
    this._retryCallback = () => {
      this._retryTimeout = undefined;
      this.update();
    };
  }

  /**
   * Recalculates the active zone based on the current position.
   * If the zone changes and `silent` is false, fires the onZoneChanged callback.
   * @param {boolean} [silent=false] - Suppress the callback
   */
  update(silent = false) {
    const position = this._getPosition();

    if (this._lastCheckedPosition === position) return;

    const entries = this._zoneLog?.zoneLog(position)?.[0];
    let activeZone;

    if (entries && 'startTime' in entries) {
      if (entries.startTime <= position && position <= entries.endTime) {
        activeZone = entries;
        this._scheduleNextCheck(entries.endTime - position);
      } else {
        this._scheduleNextCheck(entries.startTime - position);
      }
    }

    this._lastCheckedPosition = position;

    if (this._currentZone !== activeZone) {
      this._currentZone = activeZone;
      if (!silent && this._onZoneChanged) {
        this._onZoneChanged();
      }
    }
  }

  /**
   * Enables tracking and performs an initial update.
   */
  start() {
    this._enabled = true;
    this.update();
  }

  /**
   * Sets the zone log data source. Resets tracked state.
   * @param {object|null} zoneLog - The zone log to track against
   */
  setZoneLog(zoneLog) {
    this._zoneLog = zoneLog;
    this._currentZone = undefined;
    this._lastCheckedPosition = undefined;
    if (!zoneLog) {
      this.stop();
    }
  }

  /**
   * Disables tracking and clears any pending timer.
   */
  stop() {
    this._enabled = false;
    this.clearTimer();
  }

  /**
   * Performs a silent update and returns the current active zone.
   * @returns {object|undefined} The active zone entry, if any
   */
  getCurrentZone() {
    this.update(true);
    return this._currentZone;
  }

  /**
   * Schedules a re-check after `delayMs` milliseconds.
   * @param {number} delayMs
   * @private
   */
  _scheduleNextCheck(delayMs) {
    this.clearTimer();
    if (this._enabled && delayMs > 0) {
      this._retryTimeout = globalThis.setTimeout(
        this._retryCallback,
        delayMs + ZoneLogTracker.RETRY_DELAY_MS
      );
    }
  }

  /**
   * Clears any pending retry timeout.
   */
  clearTimer() {
    if (this._retryTimeout) {
      globalThis.clearTimeout(this._retryTimeout);
      this._retryTimeout = undefined;
    }
  }
}

export { ZoneLogTracker as internal_Hmb };
