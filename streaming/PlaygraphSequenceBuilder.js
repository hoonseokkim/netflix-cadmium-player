/**
 * Netflix Cadmium Player — Playgraph Sequence Builder
 *
 * Parses a compact playgraph sequence string (e.g., "0.0 0.1 1.0 1.1")
 * into a full playgraph configuration with segments, transitions, and
 * timing data. Used for constructing playgraphs from serialized manifests.
 *
 * The sequence string format is: "<viewableIndex>.<segmentIndex>" pairs
 * separated by spaces, where each pair maps to a segment in the playgraph.
 *
 * @module PlaygraphSequenceBuilder
 */

// Dependencies
// import { videoConfigBuilder as PlaygraphConfigBuilder } from './modules/Module_48456';

/**
 * Builds a playgraph configuration from a compact sequence string.
 *
 * @param {object} params - Build parameters.
 * @param {object} params.qkd - Timing map: viewableId -> array of PTS values per segment index.
 * @param {string[]} params.pendingSegmentRequests - Array of viewable IDs indexed by position.
 * @param {string} params.mha - Space-separated sequence string (e.g., "0.0 0.1 1.0").
 * @returns {object} A playgraph configuration object.
 */
export function buildPlaygraphFromSequence({ qkd: timingMap, pendingSegmentRequests: viewableIds, mha: sequenceString }) {
  const builder = new PlaygraphConfigBuilder();
  const entries = sequenceString.split(" ");
  const digitPattern = /\d+/;

  /** Tracks the segment instance count per viewable for unique ID generation. */
  const instanceCounts = new Map();
  viewableIds.forEach((id) => instanceCounts.set(id, 0));

  entries.forEach((entry, entryIndex) => {
    const viewableIndex = Number(entry.split(".")[0].match(digitPattern)[0]);
    const segmentIndex = Number(entry.split(".")[1].match(digitPattern)[0]);

    const viewableId = viewableIds[viewableIndex];
    const instanceCount = instanceCounts.get(viewableId);
    const segmentId = `${viewableId}-${instanceCount}`;

    instanceCounts.set(viewableId, instanceCount + 1);

    const segmentConfig = {
      J: viewableId,
      startTimeMs: timingMap.get?.(viewableId)?.[segmentIndex] ?? 0,
      contentEndPts: timingMap.get?.(viewableId)?.[segmentIndex + 1] ?? undefined,
    };

    // Link to next segment if one exists
    if (entries.length > entryIndex + 1) {
      const nextViewableIndex = Number(entries[entryIndex + 1].split(".")[0].match(digitPattern)[0]);
      const nextViewableId = viewableIds[nextViewableIndex];
      const nextInstanceCount = instanceCounts.get(nextViewableId);
      const nextSegmentId = `${nextViewableId}-${nextInstanceCount}`;

      segmentConfig.defaultNext = nextSegmentId;
      segmentConfig.next = { [nextSegmentId]: {} };

      // Re-set count (the original code does this; may be intentional for lookahead)
      instanceCounts.set(viewableId, instanceCount + 1);
    }

    // First entry becomes the initial segment
    if (entryIndex === 0) {
      builder.BF(segmentId);
    }

    builder.configureFragment(segmentId, segmentConfig);
  });

  return builder.build();
}
