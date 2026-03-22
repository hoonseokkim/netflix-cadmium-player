/**
 * Netflix Cadmium Player — SegmentMapMatcher
 *
 * Utility class for matching segment maps between download requests
 * and their corresponding track data. Used during branch management
 * to find the correct download request for a given segment map based
 * on track index and segment count.
 *
 * @module streaming/SegmentMapMatcher
 */

// import { __read } from 'tslib';
// import { assert } from '../modules/Module_52571';
// import { getTrackIndex } from '../modules/Module_28871';

export class SegmentMapMatcher {
  /**
   * Get the track index (J property) from a segment map.
   * Asserts that all segments in the map share the same track index.
   *
   * @static
   * @param {Object} segmentMap - Object with `segments` and `initialSegment`.
   * @returns {*} The track index value shared by all segments.
   */
  static getTrackIndex(segmentMap) {
    const segments = segmentMap.segments;
    const initialSegmentKey = segmentMap.initialSegment;
    const trackIndex = segments[initialSegmentKey].trackIndex;

    // Assert all segments belong to the same track
    Object.keys(segments).forEach(function (key) {
      assert(segments[key].trackIndex === trackIndex);
    });

    return segments[initialSegmentKey].trackIndex;
  }

  /**
   * Find the download request that matches a given segment map, based
   * on track index equality and segment count.
   *
   * @param {Array}  downloadRequests - List of pending download request objects.
   * @param {Object} targetEntry      - Entry containing `segmentMap.segments`.
   * @returns {Object|undefined} The first matching download request, or undefined.
   */
  findMatchingRequest(downloadRequests, targetEntry) {
    const segmentCount = Object.keys(targetEntry.segmentMap.segments).length;

    const [match] = downloadRequests.filter(function (request) {
      const matchesTrack =
        SegmentMapMatcher.getTrackIndex(targetEntry.segmentMap) ===
        getTrackIndex(request.context.wishListItem.key);

      const matchesSegmentCount =
        segmentCount === 1 ||
        segmentCount === Object.keys(request.segmentMap?.segmentMap.segments || {}).length;

      return matchesTrack && matchesSegmentCount;
    });

    return match;
  }
}
