/**
 * Netflix Cadmium Player — ASEJS Server Clock
 *
 * Manages the mapping between device wall-clock time and server time for
 * live-stream playback.  The delta is continually refined as OCA (Open
 * Connect Appliance) clock-sync messages arrive, allowing accurate
 * presentation-time calculations even when the local clock drifts.
 *
 * Also contains a simple `DeltaTracker` that records a rolling window of
 * server-time-delta adjustments for diagnostic purposes.
 *
 * @module AsejsServerClock
 */

// Dependencies
// import { platform } from './modules/Platform';
// import { TimeUtil, Deferred, assert } from './modules/TimeUtil';
// import { u as DEBUG } from './modules/Debug';

// ─────────────────────────────────────────────────────────────
//  DeltaTracker — rolling window of clock-delta samples
// ─────────────────────────────────────────────────────────────

/**
 * Records the most recent server-time-delta adjustments in a bounded
 * circular buffer, tracking min/max for diagnostics.
 */
class DeltaTracker {
  constructor() {
    /** @type {number} Maximum number of samples to retain. */
    this.maxSamples = 20;

    /** @type {number} */
    this.max = Number.NEGATIVE_INFINITY;

    /** @type {number} */
    this.min = Number.POSITIVE_INFINITY;

    /** @type {number[]} Rolling window of delta values. */
    this.deltaValues = [];

    /** @type {number[]} Corresponding server-time values. */
    this.serverTimeValues = [];

    /** @type {number} Total number of samples ever recorded. */
    this.length = 0;
  }

  /**
   * Record a new delta sample.
   *
   * @param {number} delta      - The clock-delta adjustment.
   * @param {number} serverTime - The server-time that produced this delta.
   */
  addSample(delta, serverTime) {
    this.length++;
    if (this.max < delta) this.max = delta;
    if (this.min > delta) this.min = delta;

    if (this.deltaValues.length >= this.maxSamples) {
      this.deltaValues.shift();
      this.serverTimeValues.shift();
    }
    this.deltaValues.push(delta);
    this.serverTimeValues.push(serverTime);
  }
}

// ─────────────────────────────────────────────────────────────
//  ServerClock
// ─────────────────────────────────────────────────────────────

/**
 * Maintains the server-time delta for a single viewable session, allowing
 * the player to translate between device-local and server wall-clock times.
 */
class ServerClock {
  /**
   * @param {object} viewableSession - The parent viewable/session.
   * @param {object} config          - Configuration blob.
   */
  constructor(viewableSession, config) {
    /** @type {object} */
    this.viewableSession = viewableSession;

    /** @type {object} */
    this.config = config;

    /** @type {Deferred<void>} Resolves once the first clock sync completes. */
    this.syncDeferred = new Deferred();

    /** @type {Console} */
    this.console = new platform.Console("ASEJS", "asejs|serverclock");

    /** @type {DeltaTracker} */
    this.deltaTracker = new DeltaTracker();

    /**
     * @type {number|undefined} Delta in ms: serverTime = deviceTime + delta.
     * Undefined until the first sync.
     * @private
     */
    this.serverTimeDelta = undefined;

    /** @type {number|undefined} Device-time at last sync. @private */
    this.lastSyncDeviceTime = undefined;

    /** @type {number|undefined} Server-time at last sync. @private */
    this.lastSyncServerTime = undefined;
  }

  /**
   * Current server time in milliseconds.
   * Falls back to device time if no sync has occurred.
   *
   * @returns {number}
   */
  get serverTimeMs() {
    if (this.serverTimeDelta === undefined) {
      const deviceNow = platform.platform.now();
      if (DEBUG) {
        this.console.debug(
          "serverTimeMs will be based on the device clock and may be inaccurate " +
            `prior to setting serverTimeDelta from OC clock sync. returning ${deviceNow}`
        );
      }
      return deviceNow;
    }
    return platform.platform.now() + this.serverTimeDelta;
  }

  /**
   * Update the server time from an incoming OCA clock-sync value.
   * Only moves the delta forward (server time must increase).
   *
   * @param {number} newServerTimeMs
   */
  set serverTimeMs(newServerTimeMs) {
    this.lastSyncDeviceTime = platform.platform.now();
    this.lastSyncServerTime = newServerTimeMs;

    const newDelta = this.lastSyncServerTime - this.lastSyncDeviceTime;
    if (this.serverTimeDelta === undefined || newDelta > this.serverTimeDelta) {
      this.updateDelta(newDelta, newServerTimeMs);
    }

    if (!this.syncDeferred.aO) {
      if (DEBUG) {
        this.console.log("LiveServerClock: synchronized", {
          UZa: this.viewableSession.getPlaygraphNode(),
        });
      }
      this.syncDeferred.resolve();
    }
  }

  /** @returns {Promise<void>} Resolves when the first clock sync completes. */
  get synchronizedPromise() {
    return this.syncDeferred.promise;
  }

  /** @returns {boolean} Whether at least one clock sync has occurred. */
  get isSynchronized() {
    return this.syncDeferred.aO;
  }

  /**
   * Apply a new server-time delta and record it in the delta tracker.
   *
   * @param {number} newDelta    - New delta value.
   * @param {number} serverTime  - Server time that produced this delta.
   * @private
   */
  updateDelta(newDelta, serverTime) {
    const previousDelta = this.serverTimeDelta;
    this.serverTimeDelta = newDelta;
    if (previousDelta !== undefined) {
      this.adjustSimulatedLiveEdge(previousDelta);
      this.deltaTracker.addSample(newDelta - previousDelta, serverTime);
    }
    if (DEBUG) {
      this.console.debug(
        "Updating serverTimeDelta from ",
        previousDelta,
        "ms to ",
        newDelta,
        "ms"
      );
    }
  }

  /**
   * Convert a server timestamp to device-local time.
   *
   * @param {number} serverTimeMs
   * @returns {number}
   */
  serverToDeviceTime(serverTimeMs) {
    return serverTimeMs - (this.serverTimeDelta ?? 0);
  }

  /**
   * Convert a device timestamp to server time.
   *
   * @param {number} deviceTimeMs
   * @returns {number}
   */
  deviceToServerTime(deviceTimeMs) {
    return deviceTimeMs + (this.serverTimeDelta ?? 0);
  }

  /**
   * Conditionally update the server time, applying only when the delta is
   * outside expected tolerances.
   *
   * @param {number} serverTimeMs
   * @param {number} segmentDurationMs
   */
  conditionallyUpdateServerTime(serverTimeMs, segmentDurationMs) {
    if (DEBUG) this.console.log("updateServerTimeMs: ", serverTimeMs, segmentDurationMs);

    if (
      !this.config.enableConditionalServerTimeUpdate ||
      this.serverTimeDelta === undefined ||
      segmentDurationMs < 0
    ) {
      this.serverTimeMs = serverTimeMs;
    } else {
      this.lastSyncDeviceTime = platform.platform.now();
      this.lastSyncServerTime = serverTimeMs;
      const newDelta = this.lastSyncServerTime - this.lastSyncDeviceTime;
      const estimatedServerTime = this.lastSyncDeviceTime + this.serverTimeDelta;

      if (
        estimatedServerTime < this.lastSyncServerTime ||
        estimatedServerTime >
          this.lastSyncServerTime +
            segmentDurationMs +
            this.config.negligibleServerTimeDeltaDifference
      ) {
        if (DEBUG) {
          this.console.debug(
            "updateServerTimeDelta: ",
            this.serverTimeDelta,
            newDelta,
            this.lastSyncServerTime,
            estimatedServerTime,
            segmentDurationMs
          );
        }
        this.updateDelta(newDelta, serverTimeMs);
      }
    }
  }

  /** @returns {DeltaTracker} The rolling delta-adjustment tracker. */
  get deltaHistory() {
    return this.deltaTracker;
  }

  /**
   * Diagnostic snapshot of the current clock state.
   *
   * @returns {object}
   */
  get clockSnapshot() {
    const deviceNow = platform.platform.now();
    if (this.serverTimeDelta === undefined) {
      return { deviceTimeMs: deviceNow };
    }
    return {
      deviceTimeMs: deviceNow,
      serverTimeMs: deviceNow + this.serverTimeDelta,
      lastSyncDeviceTime: this.lastSyncDeviceTime,
      lastSyncServerTime: this.lastSyncServerTime,
    };
  }

  /**
   * Re-sync the delta from the last known device/server time pair.
   * Used after a long pause or background event.
   */
  resync() {
    if (this.lastSyncDeviceTime !== undefined && this.lastSyncServerTime !== undefined) {
      const previousDelta = this.serverTimeDelta;
      this.serverTimeDelta = this.lastSyncServerTime - this.lastSyncDeviceTime;
      if (DEBUG) {
        this.console.debug(
          "resync: Updating serverTimeDelta from ",
          previousDelta,
          "ms to ",
          this.serverTimeDelta,
          "ms"
        );
      }
      this.adjustSimulatedLiveEdge(previousDelta);
    }
  }

  /**
   * Adjust the simulated live edge on auxiliary manifests when the delta changes.
   *
   * @param {number|undefined} previousDelta
   * @private
   */
  adjustSimulatedLiveEdge(previousDelta) {
    if (this.viewableSession.isAuxiliaryManifest) {
      assert(
        previousDelta && this.serverTimeDelta,
        "Unexpected simulatedLiveEdge during initial clock sync. " +
          "simulatedLiveEdge should be set during pipeline normalization " +
          "AFTER the initial header request and initial clock sync occurs."
      );
      this.viewableSession.reportPlaygraphUpdate(this.serverTimeDelta - previousDelta);
    }
  }
}

export { DeltaTracker, ServerClock };
