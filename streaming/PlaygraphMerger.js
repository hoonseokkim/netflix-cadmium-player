/**
 * @file PlaygraphMerger.js
 * @description Merges two playgraphs that share a common viewable.
 *              A playgraph is a directed graph of playback segments. When Netflix
 *              needs to combine playgraphs (e.g., merging ad breaks into content,
 *              or combining branching paths), this module computes the merged
 *              playgraph along with mappings from old segment IDs to new ones.
 *
 *              Key concepts:
 *              - A playgraph is a linear sequence of segments for a viewable
 *              - Two playgraphs share exactly one common viewable
 *              - Segments from the shared viewable are split/merged at time boundaries
 *              - Non-shared viewable segments pass through unchanged
 * @module streaming/PlaygraphMerger
 * @original Module_26162
 */

// import { __spreadArray, __read, __values, __assign } from './tslib';  // Module 22970
// import { assert, dPa, TimeUtil } from './utils';                      // Module 91176
// import { ed, pRa } from './PlaygraphSegment';                         // Module 58304
// import { videoConfigBuilder } from './videoConfigBuilder';             // Module 48456
// import { CJa } from './PlaygraphMapping';                             // Module 43341
// import { fA } from './Playgraph';                                     // Module 7314
// import { sUb } from './PlaygraphSegmentSplit';                        // Module 48781

/**
 * Segment type enum reference.
 * @enum {string}
 */
const SegmentType = {
  adBreak: "adBreak",
};

/**
 * Resolves the merged segment type when two segments overlap.
 * If either segment is an ad break, the merged segment is an ad break.
 * @param {object} segmentA - First segment.
 * @param {object} segmentB - Second segment.
 * @returns {string} The resolved segment type.
 */
function resolveSegmentType(segmentA, segmentB) {
  if (segmentA.type === SegmentType.adBreak || segmentB.type === SegmentType.adBreak) {
    return SegmentType.adBreak;
  }
  return segmentA.type;
}

/**
 * Linearizes a playgraph into an ordered array of segments.
 * Asserts that the playgraph is linear (each node has at most 1 outgoing edge).
 * @param {object} playgraph - The playgraph to linearize.
 * @returns {object[]} Ordered array of segments.
 */
function linearizePlaygraph(playgraph) {
  const segments = [...playgraph.CE.SH(playgraph.initial.id)];
  console.assert(
    segments.every((s) => s.FF <= 1),
    "Must be linear playgraph"
  );
  return segments;
}

/**
 * Merge two playgraphs that share exactly one common viewable.
 *
 * The merge process:
 * 1. Finds the shared viewable between both playgraphs
 * 2. For segments in the shared viewable, splits and re-maps them at time boundaries
 * 3. Non-shared viewable segments pass through with identity mapping
 * 4. Builds a new combined playgraph with updated segment connections
 *
 * @param {object} primaryPlaygraph - The primary playgraph (content).
 * @param {object} secondaryPlaygraph - The secondary playgraph (e.g., ads).
 * @returns {{
 *   mergedPlaygraph: object,
 *   primaryMapping: object,
 *   secondaryMapping: object
 * }} The merged playgraph and ID mappings from each source.
 */
export function mergePlaygraphs(primaryPlaygraph, secondaryPlaygraph) {
  const primaryIdMap = {};
  const secondaryIdMap = {};
  const initialIdMap = {};

  const secondarySegments = linearizePlaygraph(secondaryPlaygraph);
  const primaryViewables = primaryPlaygraph.viewableIdList;
  const secondaryViewables = secondaryPlaygraph.viewableIdList;

  // Find the single shared viewable
  const sharedViewables = findIntersection(primaryViewables, secondaryViewables);
  console.assert(
    sharedViewables.length === 1,
    "Playgraphs to be merged should have exactly one shared viewable"
  );
  const sharedViewableId = sharedViewables[0];

  // Extend the last secondary segment to max time if it matches shared viewable
  if (secondarySegments.length) {
    const lastSegment = secondarySegments[secondarySegments.length - 1];
    if (
      lastSegment.J === sharedViewableId &&
      lastSegment.contentEndPts !== Infinity
    ) {
      secondarySegments[secondarySegments.length - 1] =
        lastSegment.extend(TimeUtil.MAX_TIME);
    }
  }

  const mergedSegments = {};

  // Process primary segments in the shared viewable
  for (const primarySeg of primaryPlaygraph.filter(
    (seg) => seg.J === sharedViewableId
  )) {
    const startTime = primarySeg.startTime;
    const endTime = primarySeg.endTime;
    let phase = startTime.equal(TimeUtil.seekToSample) ? 1 : 0;
    const mergedBatch = [];

    for (const secondarySeg of secondarySegments) {
      let newId = undefined;
      let newSegment = undefined;

      if (secondarySeg.J === sharedViewableId) {
        if (phase === 0) {
          if (secondarySeg.containsTime(startTime)) {
            newSegment = splitSegment(secondarySeg, startTime, endTime);
            if (
              secondarySeg.containsTime(endTime) &&
              (secondarySeg.endTime.isFinite() || endTime.isFinite())
            ) {
              newId = `${primarySeg.id}`;
              phase = 2;
            } else {
              newId = `${primarySeg.id}:${secondarySeg.id}`;
              phase = 1;
            }
          }
        } else if (phase === 1) {
          newId = `${primarySeg.id}:${secondarySeg.id}`;
          if (secondarySeg.containsTime(endTime)) {
            if (secondarySeg.startTime.lessThan(endTime)) {
              newSegment = splitSegment(secondarySeg, startTime, endTime);
            }
            phase = 2;
          } else {
            newSegment = secondarySeg;
          }
        }
      } else if (phase === 1) {
        newId = `${primarySeg.id}:${secondarySeg.id}`;
        newSegment = secondarySeg;
      }

      if (newId && newSegment) {
        primaryIdMap[newId] = primarySeg.id;
        secondaryIdMap[newId] = secondarySeg.id;
        if (!mergedBatch.length) {
          initialIdMap[primarySeg.id] = newId;
        }
        mergedBatch.push({ id: newId, segment: newSegment });

        // Link consecutive segments in the batch
        if (mergedBatch.length > 1) {
          const [prev, curr] = mergedBatch.slice(-2);
          prev.segment = {
            ...normalizeSegment(prev.segment),
            Oc: curr.id,
            next: { [curr.id]: {} },
          };
        }
      }

      if (phase === 2) {
        // Close out the last segment in this batch
        if (mergedBatch.length) {
          const last = mergedBatch[mergedBatch.length - 1];
          last.segment = {
            ...normalizeSegment(last.segment),
            type: resolveSegmentType(last.segment, primarySeg),
            defaultNext: primarySeg.defaultNext,
            next: primarySeg.next,
          };
        }
        break;
      }
    }

    mergedBatch.forEach((item) => {
      mergedSegments[item.id] = item.segment;
    });
  }

  // Pass through non-shared-viewable segments with identity mapping
  for (const primarySeg of primaryPlaygraph.filter(
    (seg) => seg.J !== sharedViewableId
  )) {
    mergedSegments[primarySeg.id] = primarySeg;
    primaryIdMap[primarySeg.id] = primarySeg.id;
  }

  // Build the merged playgraph
  const mergedPlaygraph = Playgraph.create(
    new VideoConfigBuilder()
      .buildFromSegments(mergedSegments, () => true, initialIdMap)
      .setInitial(initialIdMap[primaryPlaygraph.initial.id] || primaryPlaygraph.initial.id)
      .build()
  );

  const primaryMapping = new PlaygraphMapping(primaryPlaygraph, mergedPlaygraph, primaryIdMap);
  const secondaryMapping = new PlaygraphMapping(secondaryPlaygraph, mergedPlaygraph, secondaryIdMap);

  return {
    mergedPlaygraph,
    primaryMapping,
    secondaryMapping,
  };
}
