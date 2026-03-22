/**
 * Netflix Cadmium Player — Throughput Persistence Store
 *
 * Reads persisted throughput estimates and IQR (interquartile range)
 * percentile data from local storage.  This allows the player to make
 * an informed initial bitrate selection on startup without waiting for
 * real network measurements.
 *
 * The data is stored under the key "gtp" (global throughput persistence)
 * and contains average throughput and distribution percentiles.
 *
 * @module ThroughputPersistenceStore
 */

/**
 * Provides read access to previously-persisted throughput statistics.
 */
class ThroughputPersistenceStore {
  /**
   * @param {Storage} storage - A Storage-like object (e.g. localStorage).
   */
  constructor(storage) {
    /** @type {Storage} */
    this.storage = storage;
  }

  /**
   * Read and parse the persisted throughput blob from storage.
   *
   * @returns {object|undefined} Parsed throughput data, or undefined on failure.
   * @private
   */
  readPersistedData() {
    try {
      const raw = this.storage.getItem("gtp");
      if (raw) return JSON.parse(raw);
    } catch (_err) {
      // Swallow parse / access errors.
    }
  }

  /**
   * Return the last-known average throughput estimate (bits/sec).
   *
   * @returns {number|undefined}
   */
  getAvailableBandwidth() {
    const data = this.readPersistedData();
    if (data?.tp) return data.tp.a;
  }

  /**
   * Return the 25th-percentile throughput.
   *
   * @returns {number|undefined}
   */
  getPercentile25() {
    const iqr = this.readIqrData();
    if (iqr) return iqr.p25;
  }

  /**
   * Return the 50th-percentile (median) throughput.
   *
   * @returns {number|undefined}
   */
  getPercentile50() {
    const iqr = this.readIqrData();
    if (iqr) return iqr.p50;
  }

  /**
   * Return the 75th-percentile throughput.
   *
   * @returns {number|undefined}
   */
  getPercentile75() {
    const iqr = this.readIqrData();
    if (iqr) return iqr.p75;
  }

  /**
   * Extract the IQR sub-object from the persisted data.
   *
   * @returns {object|undefined}
   * @private
   */
  readIqrData() {
    const data = this.readPersistedData();
    if (data?.iqr) return data.iqr;
  }
}

export { ThroughputPersistenceStore };
