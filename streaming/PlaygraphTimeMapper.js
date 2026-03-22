/**
 * @file PlaygraphTimeMapper.js
 * @description Maps presentation timestamps across playgraph segments for interactive
 * content (e.g., Bandersnatch). Handles time translation between the linear
 * timeline and the branching playgraph structure, accounting for segments
 * that may have different main branches.
 * @module streaming/PlaygraphTimeMapper
 * @see Module_69882
 * @injectable
 */

import { assert } from '../assert/Assert.js';
import { injectable } from '../core/ReflectMetadata.js';

/**
 * Maps timestamps between the linear playback timeline and the branching
 * playgraph structure used in interactive Netflix content.
 */
@injectable()
export class PlaygraphTimeMapper {
  /**
   * Initializes the mapper with a playgraph definition.
   * @param {Object} playgraph - The playgraph definition containing segments and structure
   * @param {Object} playgraph.segments - Map of segment ID to segment data
   * @param {string} playgraph.initialSegment - The ID of the first segment
   */
  initialize(playgraph) {
    /** @type {Object} The playgraph definition */
    this.playgraph = playgraph;

    /** @type {Map<string, {before: string, after: string}>} Nearest-main-branch map */
    this.nearestMainBranchMap = this.buildNearestMainBranchMap(
      this.playgraph.segments[this.playgraph.initialSegment].main
    );
  }

  /**
   * Calculates the total linear duration of the playgraph by walking the
   * default path from the initial segment, summing each segment's duration.
   * Stops at a specified segment ID or when all segments have been visited.
   * @param {string} [stopAtSegmentId] - Optional segment ID to stop at
   * @returns {number} Total duration in milliseconds
   */
  getTotalDuration(stopAtSegmentId) {
    assert(this.playgraph, 'Playgraph should be initialized');

    let currentId = this.playgraph.initialSegment;
    let totalDuration = 0;
    const visited = new Set();

    while (currentId && !visited.has(currentId)) {
      const segment = this.playgraph.segments[currentId];
      if (!segment || !segment.contentEndPts) break;
      if (stopAtSegmentId && stopAtSegmentId === currentId) break;

      totalDuration += segment.contentEndPts - segment.startTimeMs;
      visited.add(currentId);
      currentId = segment.defaultNext;
    }

    return totalDuration;
  }

  /**
   * Maps a local presentation time within a specific segment to a position
   * on the linear timeline. For segments on the main branch, returns the
   * local time directly. For non-main segments, interpolates between the
   * nearest main-branch segments before and after.
   *
   * @param {number} localTime - The local presentation time within the segment
   * @param {string} segmentId - The segment ID containing the local time
   * @param {number} totalEndTime - The total end time for fallback calculation
   * @returns {number|undefined} The mapped linear time, or undefined if unavailable
   */
  mapToLinearTime(localTime, segmentId, totalEndTime) {
    assert(this.playgraph, 'Playgraph should be initialized');

    const segment = this.playgraph.segments[segmentId];
    const linearOffset = this.getTotalDuration(segmentId);
    const mainBranch = segment.main;

    if (segment && mainBranch !== undefined && linearOffset !== undefined) {
      const linearTime = linearOffset + localTime - segment.startTimeMs;

      // If this segment is on the main branch, return time directly
      if (mainBranch === segment.J) {
        return localTime;
      }

      // Otherwise interpolate between nearest main-branch neighbors
      const beforeId = this.nearestMainBranchMap.get(segmentId)?.before;
      const afterId = this.nearestMainBranchMap.get(segmentId)?.after;

      const beforeEndPts = beforeId ? this.playgraph.segments[beforeId].contentEndPts : 0;
      const afterStartMs = afterId ? this.playgraph.segments[afterId].startTimeMs : totalEndTime;

      const beforeLinearEnd = beforeId
        ? this.getTotalDuration(beforeId) + this.playgraph.segments[beforeId].contentEndPts - this.playgraph.segments[beforeId].startTimeMs
        : 0;
      const afterLinearStart = afterId ? this.getTotalDuration(afterId) : this.getTotalDuration();

      if (beforeEndPts != null && afterStartMs != null && beforeLinearEnd != null && afterLinearStart != null) {
        return beforeEndPts + (linearTime - beforeLinearEnd) * (afterStartMs - beforeEndPts) / (afterLinearStart - beforeLinearEnd);
      }
    }
  }

  /**
   * Builds a map from each segment ID to its nearest main-branch segments
   * (before and after). Used for interpolating non-main-branch timestamps.
   *
   * @param {*} mainBranch - The main branch identifier
   * @returns {Map<string, {before: string|undefined, after: string|undefined}>}
   * @private
   */
  buildNearestMainBranchMap(mainBranch) {
    assert(this.playgraph, 'Playgraph should be initialized');

    let lastMainId;
    let currentId = this.playgraph.initialSegment;
    const pendingNonMain = [];
    const map = new Map();
    const visited = new Set();

    while (currentId && !visited.has(currentId)) {
      const segment = this.playgraph.segments[currentId];

      if (segment.J === mainBranch) {
        // This segment is on the main branch
        map.set(currentId, { before: currentId, after: currentId });
        lastMainId = currentId;

        // Update all pending non-main segments with this as their "after"
        pendingNonMain.forEach((nonMainId) => {
          const entry = map.get(nonMainId);
          if (entry) entry.after = lastMainId;
        });
        pendingNonMain.length = 0;
      } else {
        // Non-main segment: record the last main as "before", "after" TBD
        map.set(currentId, { before: lastMainId, after: undefined });
        pendingNonMain.push(currentId);
      }

      currentId = segment.defaultNext;
    }

    return map;
  }
}
