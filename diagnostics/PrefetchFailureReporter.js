/**
 * Netflix Cadmium Player - Prefetch Failure Reporter
 *
 * Reports prefetch failure data at the start of playback.
 * Captures the failure context that was set during a failed prefetch
 * attempt and emits it as diagnostic data.
 *
 * @module diagnostics/PrefetchFailureReporter
 */

/**
 * Emits prefetch failure information when playback starts.
 */
export class PrefetchFailureReporter {
  /**
   * @param {Object} failureData - The prefetch failure context to report.
   */
  constructor(failureData) {
    /** @type {Object} Prefetch failure data */
    this.failureData = failureData;
  }

  /** @returns {string} Reporter identifier */
  get name() {
    return 'PrefetchFailureReporter';
  }

  /** @returns {string} Short identifier for log tagging */
  get shortName() {
    return 'prefetch';
  }

  /** @returns {boolean} Always enabled */
  get enabled() {
    return true;
  }

  /**
   * Returns the failure data when playback starts.
   *
   * @param {Object} event - The playback event.
   * @param {string} event.eventType - The event type.
   * @returns {Object|undefined} Failure data on startPlayback, undefined otherwise.
   */
  deserialize({ eventType }) {
    if (eventType === 'startPlayback') {
      return this.failureData;
    }
  }
}
