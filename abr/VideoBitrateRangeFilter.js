/**
 * @file VideoBitrateRangeFilter.js
 * @description Filters video streams by configurable bitrate ranges.
 *              Used by the ABR (Adaptive Bitrate) system to constrain stream
 *              selection to a set of allowed bitrate ranges. Supports per-viewable
 *              and global bitrate filter configurations.
 * @module abr/VideoBitrateRangeFilter
 * @original Module_48867
 */

import { platform } from '../core/defaultPlatformConfig'; // Module 66164
import { DEBUG_ENABLED } from '../core/DebugSymbols'; // Module 48170
import { fcc as checkBitrateInRange } from '../abr/StreamFilterUtils'; // Module 2983

/**
 * Filters available video streams based on configurable bitrate ranges.
 * Maintains both global and per-viewable filter configurations.
 */
export class VideoBitrateRangeFilter {
  /**
   * @param {Object} logger - Console/logger for debug output
   */
  constructor(logger) {
    /** @type {Object} Logger instance */
    this.console = logger;

    /** @type {Array} Global bitrate filter ranges */
    this._globalFilters = [];

    /** @type {Object<string, Array>} Per-viewable ID filter ranges */
    this._viewableFilters = {};

    /** @type {boolean} Whether the undefined-viewable warning has been logged */
    this._undefinedViewableWarned = false;
  }

  /**
   * Sets the bitrate filter ranges, optionally scoped to a specific viewable.
   * @param {Array} filters - Array of bitrate range filter objects
   * @param {string} [viewableId] - If provided, filters apply only to this viewable
   */
  setBitrateFilters(filters, viewableId) {
    this._globalFilters = filters;

    if (viewableId !== undefined) {
      this._viewableFilters[viewableId] = filters;
    } else if (!this._undefinedViewableWarned) {
      this.console.RETRY('StreamFilters: Bitrate filters received with undefined viewable id');
      this._undefinedViewableWarned = true;
    }
  }

  /**
   * Filters an array of video streams, returning only those within allowed bitrate ranges.
   *
   * @param {Array<Object>} streams - Available video streams to filter
   * @returns {Array<Object>} Streams whose bitrate falls within configured ranges
   */
  filterStreams(streams) {
    if (streams.length === 0) return streams;

    const viewableId = streams[0].J;

    if (viewableId === undefined) {
      this.console.error('StreamFilters: Stream has undefined viewable id');
      return streams;
    }

    // Notify the platform of the viewable being filtered
    try {
      platform.SD?.(viewableId);
    } catch (error) {
      this.console.error('StreamFilters: createFilteredVideoStreamList: ' + error);
      return streams;
    }

    const activeFilters = this._viewableFilters[viewableId] || this._globalFilters;

    if (DEBUG_ENABLED) {
      this.console.pauseTrace(
        `VideoBitrateRangesFilter: filtering ${streams.length} streams with ${JSON.stringify(activeFilters)}`
      );
    }

    const filtered = streams.filter((stream) => {
      return checkBitrateInRange(stream.profile, stream.bitrate, stream.track, activeFilters, this.console).inRange;
    });

    if (DEBUG_ENABLED) {
      this.console.pauseTrace(
        `VideoBitrateRangesFilter: ... ${filtered.length} streams in range`
      );
    }

    return filtered;
  }
}
