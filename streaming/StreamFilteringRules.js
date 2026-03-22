/**
 * Stream Filtering Rules
 *
 * Applies quality-control stream filtering based on server-side rules.
 * When the manifest specifies `streamFilteringRules` with `action: "keepLowest"`,
 * this filter retains only the lowest-bitrate stream for each specified profile,
 * discarding higher-bitrate duplicates. This is used for bandwidth-constrained
 * scenarios or A/B testing of stream selection.
 *
 * @module streaming/StreamFilteringRules
 * @original Module_19092
 */

export class StreamFilteringRules {
  /**
   * @param {Object} config - Configuration object containing streamFilteringRules.
   * @param {Object} [config.streamFilteringRules] - Filtering rules from the manifest.
   * @param {boolean} [config.streamFilteringRules.qcEnabled] - Whether QC filtering is enabled.
   * @param {string[]} [config.streamFilteringRules.profiles] - Profile names to filter.
   * @param {string} [config.streamFilteringRules.action] - Filter action (e.g. "keepLowest").
   */
  constructor(config) {
    if (
      config.streamFilteringRules &&
      config.streamFilteringRules.qcEnabled &&
      config.streamFilteringRules.profiles &&
      config.streamFilteringRules.profiles.length &&
      config.streamFilteringRules.action === "keepLowest"
    ) {
      /** @private @type {Object.<string, boolean>} Map of profiles to filter */
      this._filteredProfiles = {};
      config.streamFilteringRules.profiles.forEach((profile) => {
        this._filteredProfiles[profile] = true;
      });
    }
  }

  /**
   * Filters an array of streams, keeping only the first (lowest-bitrate)
   * occurrence for each filtered profile.
   *
   * @param {Array} streams - Array of stream objects with a `profile` property.
   * @returns {Array} Filtered streams.
   */
  filterStreams(streams) {
    const seen = {};
    const filteredProfiles = this._filteredProfiles;

    if (filteredProfiles === undefined) {
      return streams;
    }

    return streams.filter((stream) => {
      if (!filteredProfiles[stream.profile]) {
        return true; // not a filtered profile, keep it
      }
      if (seen[stream.profile]) {
        return false; // already seen this profile, discard duplicate
      }
      seen[stream.profile] = true;
      return true; // first occurrence, keep it
    });
  }
}
