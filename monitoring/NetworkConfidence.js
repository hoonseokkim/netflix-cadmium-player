/**
 * Netflix Cadmium Player — Network Measurement Confidence
 *
 * Tracks how much data has been observed and for how long in order to
 * classify the current throughput estimate's reliability into one of
 * four confidence levels:
 *
 *  - `HAVE_NOTHING`   — No samples received yet.
 *  - `HAVE_SOMETHING` — At least one sample received.
 *  - `HAVE_MINIMUM`   — Enough data (bytes or time) for a rough estimate.
 *  - `HAVE_ENOUGH`    — Enough data for a reliable estimate (triggers
 *                        the "confidence ready" callback).
 *
 * The confidence level is consumed by the ABR controller to decide
 * whether to trust the throughput estimate or fall back to conservative
 * bitrate selection.
 *
 * @module NetworkConfidence
 */

// import { platform }   from '../core/AsejsEngine.js';
// import { OP as ConfidenceLevel } from '../core/AsejsEngine.js';

/**
 * Monitors bytes and elapsed time to determine throughput-measurement
 * confidence.
 */
class NetworkConfidence {
  /**
   * @param {Object}   config             - Player configuration.
   * @param {number}   config.minimumMeasurementTime  - Min time (ms) for HAVE_MINIMUM.
   * @param {number}   config.minimumMeasurementBytes - Min bytes for HAVE_MINIMUM.
   * @param {number}   config.probingMeasurementTime  - Min time (ms) for HAVE_ENOUGH.
   * @param {number}   config.probingMeasurementBytes - Min bytes for HAVE_ENOUGH.
   * @param {boolean}  config.stopNetworkConfidence   - Whether to pause timing when idle.
   * @param {Function} onConfidenceReady  - Called once when confidence reaches HAVE_ENOUGH.
   */
  constructor(config, onConfidenceReady) {
    this.config = config;
    this.onConfidenceReady = onConfidenceReady;

    /** @type {number} Total bytes observed. */
    this.totalBytes = 0;

    /** @type {number} Cumulative download duration from completed segments (ms). */
    this.completedDuration = 0;

    /** @type {number} Duration of the current in-progress download segment (ms). */
    this.activeDuration = 0;

    this.reset();
  }

  /* ------------------------------------------------------------------ */
  /*  Computed properties                                                */
  /* ------------------------------------------------------------------ */

  /**
   * Total measurement duration (completed + active segments).
   * @type {number}
   */
  get duration() {
    return this.completedDuration + this.activeDuration;
  }

  /* ------------------------------------------------------------------ */
  /*  Lifecycle                                                          */
  /* ------------------------------------------------------------------ */

  /** Resets all state to initial values. */
  reset() {
    /** @type {number} Current confidence level (ConfidenceLevel enum). */
    this.confidence = ConfidenceLevel.HAVE_NOTHING;

    this.totalBytes = 0;

    /** @type {number|undefined} Timestamp of the first sample in the current segment. */
    this.segmentStartTime = undefined;

    this.activeDuration = 0;
    this.completedDuration = 0;
  }

  /**
   * Creates a deep copy of this confidence tracker (including current state).
   * @returns {NetworkConfidence}
   */
  clone() {
    const copy = new NetworkConfidence(this.config, this.onConfidenceReady);
    copy.confidence = this.confidence;
    copy.totalBytes = this.totalBytes;
    copy.segmentStartTime = this.segmentStartTime;
    copy.completedDuration = this.completedDuration;
    copy.activeDuration = this.activeDuration;
    return copy;
  }

  /* ------------------------------------------------------------------ */
  /*  Data ingestion                                                     */
  /* ------------------------------------------------------------------ */

  /**
   * Records a bandwidth sample (bytes transferred in a time window).
   *
   * Promotes the confidence level as thresholds are crossed:
   *  1. HAVE_NOTHING  -> HAVE_SOMETHING  (first sample).
   *  2. HAVE_SOMETHING -> HAVE_MINIMUM   (min time or bytes).
   *  3. HAVE_MINIMUM  -> HAVE_ENOUGH     (probing time or bytes).
   *
   * @param {number} bytes     - Number of bytes in this sample.
   * @param {number} startTime - Sample start timestamp (ms).
   * @param {number} endTime   - Sample end timestamp (ms).
   */
  item(bytes, startTime, endTime) {
    if (this.segmentStartTime === undefined) {
      this.segmentStartTime = startTime;
    }

    this.totalBytes += bytes;
    this.activeDuration = Math.max(endTime - this.segmentStartTime, this.activeDuration);

    // Promote from HAVE_NOTHING
    this.confidence = Math.max(this.confidence, ConfidenceLevel.HAVE_SOMETHING);

    // Promote to HAVE_MINIMUM
    if (this.confidence < ConfidenceLevel.HAVE_MINIMUM) {
      if (this.duration > this.config.minimumMeasurementTime ||
          this.totalBytes > this.config.minimumMeasurementBytes) {
        this.confidence = ConfidenceLevel.HAVE_MINIMUM;
      }
    }

    // Promote to HAVE_ENOUGH (triggers one-time callback)
    if (this.confidence < ConfidenceLevel.HAVE_ENOUGH) {
      if (this.duration > this.config.probingMeasurementTime ||
          this.totalBytes > this.config.probingMeasurementBytes) {
        this.confidence = ConfidenceLevel.HAVE_ENOUGH;
        this.onConfidenceReady();
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Query                                                              */
  /* ------------------------------------------------------------------ */

  /**
   * Returns the current confidence level.
   * @returns {number} ConfidenceLevel enum value.
   */
  key() {
    return this.confidence;
  }

  /* ------------------------------------------------------------------ */
  /*  Filter protocol stubs                                              */
  /* ------------------------------------------------------------------ */

  /** No-op: satisfies the filter start() interface. */
  start() {}

  /**
   * Called when all in-flight requests have completed. If
   * `stopNetworkConfidence` is enabled, accumulates the active duration
   * into the completed bucket and resets the segment timer.
   */
  aseTimer() {
    if (this.config.stopNetworkConfidence) {
      this.completedDuration += this.activeDuration;
      this.activeDuration = 0;
      this.segmentStartTime = undefined;
    }
  }

  /** No-op: satisfies the filter logBatcher() interface. */
  logBatcher() {}
}

export { NetworkConfidence as ase_Chb };
