/**
 * Netflix Cadmium Player — Video / Playgraph Configuration Builder
 *
 * Fluent builder for constructing a validated playgraph configuration
 * object.  A playgraph describes a directed graph of video segments
 * with an initial segment and optional branching / next-segment rules.
 *
 * @module VideoConfigBuilder
 */

// Dependencies
// import { __assign } from 'tslib';
// import { assert } from './modules/TimeUtil';
// import { pRa as cloneSegmentConfig } from './modules/SegmentUtils';

/**
 * Remap the keys of an object using a rename map.
 *
 * @param {object} source    - Original key-value pairs.
 * @param {object} renameMap - { oldKey: newKey } mapping.
 * @returns {object}
 * @private
 */
function remapKeys(source, renameMap) {
  return Object.keys(source).reduce((acc, key) => {
    acc[renameMap[key] || key] = source[key];
    return acc;
  }, {});
}

/**
 * Fluent builder for a playgraph configuration.
 *
 * Usage:
 * ```js
 * const config = new PlaygraphConfigBuilder()
 *   .setInitialSegment('intro')
 *   .setFeatureFlags(featureFlags)
 *   .addSegment('intro', introSegmentDef)
 *   .addSegment('main', mainSegmentDef)
 *   .build();
 * ```
 */
class PlaygraphConfigBuilder {
  /**
   * @param {object} [existingConfig] - Optional existing config to clone from.
   */
  constructor(existingConfig) {
    /** @type {string|undefined} */
    this.initialSegment = undefined;

    /** @type {object|undefined} Feature flags / metadata. */
    this.featureFlags = undefined;

    /** @type {object|undefined} Segment definitions keyed by segment id. */
    this.segments = undefined;

    /** @type {*} Media types eligible for branching. */
    this.mediaTypesForBranching = undefined;

    if (existingConfig) {
      this.setInitialSegment(existingConfig.initialSegment);
      this.setFeatureFlags(existingConfig.fe);
      this.importAllSegments(existingConfig.segments);
    }
  }

  /**
   * Set the initial (entry-point) segment id.
   *
   * @param {string} segmentId
   * @returns {this}
   */
  setInitialSegment(segmentId) {
    this.initialSegment = segmentId;
    return this;
  }

  /**
   * Set feature flags / metadata for the playgraph.
   *
   * @param {object} flags
   * @returns {this}
   */
  setFeatureFlags(flags) {
    this.featureFlags = flags;
    return this;
  }

  /**
   * Set the media types that are allowed to branch.
   *
   * @param {*} mediaTypes
   * @returns {this}
   */
  setMediaTypesForBranching(mediaTypes) {
    this.mediaTypesForBranching = mediaTypes;
    return this;
  }

  /**
   * Look up a segment definition by id.
   *
   * @param {string} segmentId
   * @returns {object|undefined}
   */
  getSegmentInfo(segmentId) {
    return this.segments?.[segmentId];
  }

  /**
   * Add or replace a single segment definition, optionally remapping
   * the keys in its `next` map.
   *
   * @param {string}  segmentId  - Unique segment identifier.
   * @param {object}  segmentDef - Raw segment definition to clone.
   * @param {object} [renameMap] - Optional key-rename map for `next` entries.
   * @returns {this}
   */
  addSegment(segmentId, segmentDef, renameMap) {
    if (!this.segments) this.segments = {};
    this.segments[segmentId] = cloneSegmentConfig(segmentDef);

    if (renameMap) {
      const seg = this.segments[segmentId];
      if (seg.next) {
        seg.next = remapKeys(seg.next, renameMap);
      }
      if (seg.defaultNext && renameMap[seg.defaultNext]) {
        seg.defaultNext = renameMap[seg.defaultNext];
      }
    }
    return this;
  }

  /**
   * Mutate an existing segment definition in place.
   *
   * @param {string}   segmentId - Segment to modify.
   * @param {function} mutator   - Callback receiving the segment object.
   */
  modifySegment(segmentId, mutator) {
    const seg = this.segments?.[segmentId];
    assert(seg, `Segment for modification ${segmentId} is not part of segments`);
    mutator(seg);
  }

  /**
   * Import all segments from a raw segments map, replacing any existing ones.
   *
   * @param {object}   segmentsMap          - { segmentId: segmentDef }.
   * @param {function} [filter=()=>true]    - Optional predicate to include/exclude.
   * @param {object}   [renameMap]          - Optional key rename map.
   * @returns {this}
   */
  importAllSegments(segmentsMap, filter = () => true, renameMap) {
    this.segments = {};
    return this.mergeSegments(segmentsMap, filter, renameMap);
  }

  /**
   * Merge segments from a raw map into the existing segments, adding
   * only those that pass the filter.
   *
   * @param {object}   segmentsMap        - { segmentId: segmentDef }.
   * @param {function} [filter=()=>true]  - Optional predicate.
   * @param {object}   [renameMap]        - Optional key rename map.
   * @returns {this}
   */
  mergeSegments(segmentsMap, filter = () => true, renameMap) {
    Object.keys(segmentsMap)
      .filter((id) => filter(segmentsMap[id], id))
      .forEach((id) => {
        this.addSegment(id, segmentsMap[id], renameMap);
      });
    return this;
  }

  /**
   * Check whether a segment exists by id.
   *
   * @param {string} segmentId
   * @returns {boolean}
   */
  hasSegment(segmentId) {
    return !!this.segments?.[segmentId];
  }

  /**
   * Add a "next" transition from `fromSegment` to `toSegment`.
   *
   * @param {string} toSegmentId   - Destination segment id.
   * @param {string} fromSegmentId - Source segment id.
   */
  addNextTransition(toSegmentId, fromSegmentId) {
    this.modifySegment(fromSegmentId, (seg) => {
      seg.defaultNext = toSegmentId;
      seg.next = seg.next
        ? { ...seg.next, [toSegmentId]: {} }
        : { [toSegmentId]: {} };
    });
  }

  /**
   * Validate and produce the final playgraph configuration object.
   *
   * @returns {{ Ef: string, segments: object, fe?: object, mediaTypesForBranching?: * }}
   * @throws {Error} If segments or initialSegment are missing or inconsistent.
   */
  build() {
    if (!this.segments) {
      throw new Error("Invalid playgraph - `segments` is not defined");
    }
    if (!this.initialSegment) {
      throw new Error("Invalid playgraph - `initialSegment` is not defined");
    }
    if (!this.segments[this.initialSegment]) {
      throw new Error("Invalid playgraph - `initialSegment` is not part of `segments`");
    }

    const config = {
      Ef: this.initialSegment,
      segments: this.segments,
    };

    if (this.featureFlags) config.fe = this.featureFlags;
    if (this.mediaTypesForBranching) config.mediaTypesForBranching = this.mediaTypesForBranching;

    return config;
  }
}

export { PlaygraphConfigBuilder };
