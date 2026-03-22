/**
 * Netflix Cadmium Player - Netflix Media Events Reporter
 *
 * Reports Netflix media events (open, close, cancel, and custom events)
 * at end-of-playback for diagnostic and analytics purposes.
 *
 * @module diagnostics/NetflixMediaEventsReporter
 */

/**
 * Collects and serializes Netflix media event data when playback ends.
 * Implements the reporter interface with `ic`, `enabled`, `deserialize`,
 * and `destroy` methods.
 */
export class NetflixMediaEventsReporter {
  /**
   * @param {Object|null} mediaEventSource - Source of media events, or null if disabled.
   */
  constructor(mediaEventSource) {
    /** @type {Object|null} The media event data source */
    this.mediaEventSource = mediaEventSource;
  }

  /** @returns {string} Reporter identifier */
  get name() {
    return 'NetflixMediaEventsReporter';
  }

  /** @returns {boolean} Whether this reporter is enabled */
  get enabled() {
    return !!this.mediaEventSource;
  }

  /**
   * Serializes media event data on end-of-playback.
   *
   * @param {Object} event - The playback event.
   * @param {string} event.eventType - The event type identifier.
   * @returns {Object} Serialized media events or empty object.
   */
  deserialize({ eventType }) {
    if (eventType !== 'endPlayback' || !this.mediaEventSource) {
      return {};
    }

    const eventData = this.mediaEventSource.getEventData();
    if (!eventData) return {};

    return {
      netflixMediaEvents: {
        opened: eventData.opened,
        closed: eventData.closed,
        cancelled: eventData.isCancelledFlag,
        events: eventData.events.map((event) => ({
          id: event.id,
          applicationScope: event.applicationScope,
          action: event.action,
          timestamp: event.timestamp,
          duration: event.duration,
          eventDelay: event.eventDelay,
          timeSinceTriggeredMs: event.timeSinceTriggeredMs,
        })),
      },
    };
  }

  /** Cleanup handler (no-op for this reporter). */
  destroy() {}
}
