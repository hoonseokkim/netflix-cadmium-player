/**
 * Netflix Cadmium Player — Explicit Video Stream Filter
 *
 * Filters video streams based on an explicit downloadables map from
 * configuration. When a specific downloadable ID is configured for a
 * given stream type, only that stream is returned; otherwise all
 * streams pass through unfiltered.
 *
 * @module abr/ExplicitVideoStreamFilter
 * @original Module_84132
 */

/**
 * Filters video streams to match explicitly configured downloadable IDs.
 */
export class ExplicitVideoStreamFilter {
  /**
   * @param {object} config - Player configuration.
   * @param {Object<string, string|number>} config.explicitVideoDownloadablesMap
   *        Map of stream type to explicit downloadable ID.
   * @param {object} console - Logger instance.
   */
  constructor(config, console) {
    /** @private */
    this.config = config;
    /** @private */
    this.console = console;
  }

  /**
   * Filter streams to only include the explicitly configured downloadable.
   *
   * If the configuration has an explicit downloadable ID for the stream's
   * type (identified by `R` property), only matching streams are returned.
   * If no explicit mapping exists, all streams pass through.
   *
   * @param {Array<object>} streams - Available video streams.
   * @returns {Array<object>} Filtered streams (may be empty if explicit ID not found).
   */
  filterStreams(streams) {
    if (streams.length === 0) {
      return streams;
    }

    const explicitId = this.config.explicitVideoDownloadablesMap[streams[0].R];

    if (explicitId !== undefined) {
      const filtered = streams.filter((stream) => `${stream.id}` === `${explicitId}`);
      return filtered;
    }

    return streams;
  }
}

export { ExplicitVideoStreamFilter as internal_Lcb };
