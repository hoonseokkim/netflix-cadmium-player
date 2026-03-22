/**
 * Netflix Cadmium Player - WorkingSegment
 * Webpack Module 48781 (exported as `Pnb` / `i7b`)
 *
 * A WorkingSegment is the mutable, runtime representation of a single segment
 * within the playgraph's directed graph. Each segment has a time range
 * (startTime / endTime), a set of weighted branches to possible "next" segments,
 * and transition behavior (immediate vs. deferred branching).
 *
 * Key concepts:
 * - **Branches (next)**: Each segment can point to multiple next segments, each
 *   with an associated weight that determines selection probability.
 * - **Transition mode (fe)**: Either "immediate" (for interactive choice points
 *   or ad insertion) or a deferred/default mode where the player follows the
 *   highest-weight branch automatically.
 * - **Weight normalization**: Branch weights are normalized to probabilities.
 *   When a segment has its own weight, the "self probability" (continuing the
 *   current segment) is computed relative to the sum of immediate-branch weights.
 * - **Forced choices (kz)**: An array of forced choice IDs that override the
 *   transition mode to "immediate".
 *
 * Also exports:
 * - `BranchWeight` (i7b): A lightweight object holding normalized weight and
 *   transition mode for a single branch entry.
 * - Helper functions for merging branch maps, computing weight info, and
 *   normalizing weights.
 *
 * Original obfuscated identifiers:
 *   Class `n` → WorkingSegment (Pnb)
 *   Class `m` → BranchWeight (i7b)
 *   Function `d` (tid) → buildBranchWeights
 *   Function `p` (Ocd) → computeSelfProbability
 *   Function `c` (ajd) → mergeBranchMaps
 *   Function `g` (Hfc) → computeWeightInfo
 *   Function `f` (Gfc) → normalizeWeight
 *   Export `sUb` → clampSegmentToRange
 */

// Dependencies (resolved by module bundler):
// import { __assign, __values } from './modules/Module_22970';       // tslib helpers
// import { TimeUtil, YX as TimeRange, vG as TimeFormat } from './modules/Module_91176'; // time utilities
// import { EYa as isImmediate } from './modules/Module_4152';        // transition mode check
// import { ed as SegmentType } from './modules/Module_58304';        // segment type enum

/**
 * Builds a map of BranchWeight objects for each branch of a segment.
 * Optionally merges branch definitions from a previous segment version.
 *
 * @param {Object} segmentData - The raw segment data containing `next` branches.
 * @param {string} defaultTransitionMode - The default transition mode for branches.
 * @param {WorkingSegment} [previousSegment] - Optional previous segment to merge branches from.
 * @returns {Object<string, BranchWeight>|undefined} Map of branch ID to BranchWeight, or undefined if no branches.
 */
function buildBranchWeights(segmentData, defaultTransitionMode, previousSegment) {
  if (!segmentData.next) return undefined;

  const mergedBranches = previousSegment?.next
    ? mergeBranchMaps(segmentData.next, previousSegment.next)
    : segmentData.next;

  const weightInfo = computeWeightInfo(mergedBranches);
  const { totalWeight, weightedBranchCount } = weightInfo;

  const result = {};
  weightInfo.branchIds.forEach((branchId) => {
    result[branchId] = new BranchWeight(
      mergedBranches[branchId],
      weightedBranchCount,
      totalWeight,
      defaultTransitionMode
    );
  });

  return result;
}

/**
 * Computes the probability of staying on the current segment (self-probability)
 * given the transition mode and branch weights.
 *
 * For non-immediate modes, always returns 1 (the segment always plays fully).
 * For immediate mode with explicit weights, returns the segment's own weight
 * divided by the total weight. For uniform (no weights), returns 1/(N+1).
 *
 * @param {string} transitionMode - The transition mode ("immediate" or other).
 * @param {WorkingSegment} segment - The segment to compute probability for.
 * @returns {number} The self-probability (0 to 1).
 */
function computeSelfProbability(transitionMode, segment) {
  if (transitionMode !== 'immediate') return 1;

  const branchIds = segment.next ? Object.keys(segment.next) : [];

  if (branchIds.some((id) => segment.next[id].weight !== undefined)) {
    // Weighted mode: segment needs its own weight to participate
    if (segment.weight === undefined) return 0;

    const totalWeight = segment.weight + branchIds.reduce(
      (sum, id) => sum + (segment.next[id].weight || 0),
      0
    );
    return segment.weight / totalWeight;
  }

  // Uniform mode: equal probability among self + all branches
  return 1 / (branchIds.length + 1);
}

/**
 * Merges two branch definition maps. Keys from the base map are preserved;
 * the override map can replace values for existing keys.
 *
 * @param {Object} baseBranches - The base branch definitions.
 * @param {Object} overrideBranches - The override branch definitions.
 * @returns {Object} Merged branch map.
 */
function mergeBranchMaps(baseBranches, overrideBranches) {
  const merged = {};
  for (const key of Object.keys(baseBranches)) {
    merged[key] = overrideBranches[key] || baseBranches[key];
  }
  return merged;
}

/**
 * Computes aggregate weight information for a set of branches.
 *
 * @param {Object} branches - Map of branch ID to branch data (each with optional `weight`).
 * @returns {{ branchIds: string[], weightedBranchCount: number, totalWeight: number|undefined }}
 *   - branchIds: all branch keys
 *   - weightedBranchCount: number of branches that have weights (or total count if none have weights)
 *   - totalWeight: sum of all weights, or undefined if no branch has a weight
 */
function computeWeightInfo(branches) {
  const branchIds = Object.keys(branches);

  const totalWeight = branchIds.every((id) => branches[id].weight === undefined)
    ? undefined
    : branchIds.reduce((sum, id) => sum + (branches[id].weight || 0), 0);

  const weightedBranchCount = totalWeight === undefined
    ? branchIds.length
    : branchIds.reduce((count, id) => count + (branches[id].weight ? 1 : 0), 0);

  return {
    branchIds,
    weightedBranchCount,
    totalWeight,
  };
}

/**
 * Normalizes a single branch weight to a probability value.
 *
 * @param {number|undefined} weight - The branch's raw weight.
 * @param {number} branchCount - Number of weighted branches.
 * @param {number|undefined} totalWeight - Sum of all weights (undefined = uniform).
 * @returns {number} Normalized weight (0 to 1).
 */
function normalizeWeight(weight, branchCount, totalWeight) {
  if (totalWeight === undefined) {
    // Uniform: equal probability
    return 1 / branchCount;
  }
  if (totalWeight === 0) {
    // All-zero weights: only branches with undefined weight get probability
    return weight === undefined ? 1 / branchCount : 0;
  }
  // Weighted: proportion of total
  return weight === undefined ? 0 : weight / totalWeight;
}

/**
 * Creates a clamped copy of a segment's data with start/end times bounded
 * to the given range.
 *
 * @param {WorkingSegment} segment - The segment to clamp.
 * @param {PresentationTime} rangeStart - The lower time bound.
 * @param {PresentationTime} rangeEnd - The upper time bound.
 * @returns {Object} A shallow copy of the segment data with clamped start/end PTS values.
 */
function clampSegmentToRange(segment, rangeStart, rangeEnd) {
  return {
    ...segment.currentSegment,
    startTimeMs: TimeUtil.max(rangeStart, segment.startTime).playbackSegment,
    contentEndPts: TimeUtil.min(rangeEnd, segment.endTime).playbackSegment,
  };
}

/**
 * @class WorkingSegment
 * @description Runtime representation of a segment in the playgraph's directed graph.
 *   Wraps raw segment data with computed properties for branch weights, transition
 *   probabilities, time ranges, and interactive choice support.
 *
 * The toString() output uses the format: `WSeg[<mediaType>](<id>) <timeRange>v:<version>`
 */
class WorkingSegment {
  /**
   * @param {string} id - Unique segment identifier.
   * @param {Object} segmentData - Raw segment data from the manifest.
   * @param {string} defaultTransitionMode - Default transition mode (e.g., "immediate").
   * @param {string} mediaType - Media type label (e.g., "audio", "video").
   * @param {WorkingSegment} [previousSegment] - Previous version of this segment for reuse/merge.
   */
  constructor(id, segmentData, defaultTransitionMode, mediaType, previousSegment) {
    /** @type {string} Unique segment identifier */
    this.id = id;

    /** @type {Object} Raw segment data from manifest */
    this.currentSegment = segmentData;

    /** @type {string} Media type label for logging */
    this.mediaType = mediaType;

    /** @type {boolean} Whether time attributes were reused from a previous segment */
    this.timeAttributesReused = false;

    /** @type {Object<string, number>} Map of branch ID to immediate-mode weight */
    this.immediateWeights = {};

    /**
     * Returns the transition mode for a specific branch.
     * If forced choices are active, returns "immediate"; otherwise falls back
     * to the branch-specific mode or the segment-level mode.
     * @type {function(string): string}
     */
    this.getTransitionModeForBranch = (branchId) => {
      if (this.forcedChoices?.length) return 'immediate';
      return this.next?.[branchId]?.transitionMode ?? this.transitionMode;
    };

    /** @private {string} The configured default transition mode */
    this._defaultTransitionMode = segmentData.fe ?? defaultTransitionMode;

    /** @type {number|undefined} This segment's weight (for self-probability in immediate mode) */
    this.weight = previousSegment ? previousSegment.weight : segmentData.weight;

    /** @type {string|undefined} Explicit default next segment ID */
    this.defaultNext = segmentData.defaultNext !== null ? segmentData.defaultNext : undefined;

    /** @type {Object<string, BranchWeight>|undefined} Map of next-segment branches */
    this.next = segmentData.next
      ? buildBranchWeights(segmentData, this._defaultTransitionMode, previousSegment)
      : undefined;

    /** @type {number} Self-probability (probability of continuing this segment) */
    this.selfProbability = computeSelfProbability(this._defaultTransitionMode, this);

    // Reuse time objects from previous segment if the raw values match
    const canReuseTimeAttrs = previousSegment
      ? previousSegment.timeAttributesReused
        && previousSegment.contentEndPts === segmentData.contentEndPts
        && previousSegment.startTimeMs === segmentData.startTimeMs
      : false;
    this.timeAttributesReused = canReuseTimeAttrs;

    /** @type {PresentationTime} Segment start time */
    this.startTime = canReuseTimeAttrs
      ? previousSegment.startTime
      : TimeUtil.fromMilliseconds(segmentData.startTimeMs);

    /** @type {PresentationTime} Segment end time */
    this.endTime = canReuseTimeAttrs
      ? previousSegment.endTime
      : TimeUtil.fromMilliseconds(segmentData.contentEndPts || Infinity);

    /** @type {string[]|undefined} Forced choice IDs that override transition to "immediate" */
    this.forcedChoices = previousSegment && canReuseTimeAttrs
      ? previousSegment.forcedChoices
      : undefined;

    this.applyBranchWeights();
  }

  // ─── Computed Properties ───────────────────────────────────────────────

  /** @returns {*} Segment version */
  get version() {
    return this.currentSegment.J;
  }

  /** @returns {*} Program ID for this segment */
  get programId() {
    return this.currentSegment.programId;
  }

  /** @returns {string} Segment type (e.g., "content") */
  get type() {
    return this.currentSegment.type || SegmentType.content;
  }

  /** @returns {number} Start time in milliseconds (raw) */
  get startTimeMs() {
    return this.currentSegment.startTimeMs;
  }

  /** @returns {number} End time in milliseconds (raw, Infinity if not set) */
  get contentEndPts() {
    return this.currentSegment.contentEndPts || Infinity;
  }

  /** @returns {*} Fade-in configuration */
  get fadeIn() {
    return this.currentSegment.fadeIn;
  }

  /** @returns {*} Fade-out configuration */
  get fadeOut() {
    return this.currentSegment.fadeOut;
  }

  /** @returns {*} Key material / DRM info */
  get keyMaterial() {
    return this.currentSegment.km;
  }

  /** @returns {boolean} Whether this is the main/default segment */
  get isMain() {
    return this.currentSegment.main;
  }

  /** @returns {PresentationTime} Duration of this segment */
  get duration() {
    return this.endTime?.lowestWaterMarkLevelBufferRelaxed(this.startTime) || TimeUtil.uh;
  }

  /** @returns {number} Number of next-segment branches */
  get branchCount() {
    return this.next ? Object.keys(this.next).length : 0;
  }

  /** @returns {boolean} Whether this segment is a terminal node (no valid next) */
  get isTerminal() {
    return this.branchIds.length
      ? !this.defaultNext && this.activeBranchIds.length === 0
      : true;
  }

  /** @returns {boolean} Whether this is a content-type segment */
  get isContentType() {
    return !this.type || this.type === SegmentType.content;
  }

  /** @returns {string[]} All branch IDs */
  get branchIds() {
    return Object.keys(this.next || {});
  }

  /** @returns {Object<string, number>} The immediate weights map */
  get immediateWeightMap() {
    return this.immediateWeights;
  }

  /** @returns {string[]} Branch IDs that have non-zero immediate weight */
  get activeBranchIds() {
    return this.branchIds.filter((id) => !!this.immediateWeights[id]);
  }

  /**
   * Total immediate weight across all active branches.
   * Cached; invalidated when weights change.
   * @returns {number}
   */
  get totalImmediateWeight() {
    return this._cachedTotalImmediateWeight
      ?? (this._cachedTotalImmediateWeight = this._computeTotalImmediateWeight());
  }

  /**
   * Total immediate weight for branches in "immediate" transition mode only.
   * Cached; invalidated when weights change.
   * @returns {number}
   */
  get totalImmediateTransitionWeight() {
    return this._cachedImmediateTransitionWeight
      ?? (this._cachedImmediateTransitionWeight = this._computeImmediateTransitionWeight());
  }

  /**
   * Self-weight ratio: the segment's own weight relative to self + immediate branches.
   * Returns 1 if the segment has no weight.
   * @returns {number}
   */
  get selfWeightRatio() {
    return this.weight
      ? this.weight / (this.weight + this.totalImmediateTransitionWeight)
      : 1;
  }

  /**
   * The effective transition mode for this segment.
   * If forced choices are active, returns "immediate".
   * @returns {string}
   */
  get transitionMode() {
    return this.forcedChoices?.length ? 'immediate' : this._defaultTransitionMode;
  }

  // ─── Time Query Methods ────────────────────────────────────────────────

  /**
   * Clamps a time value to be within [seekToSample, segment.offset].
   *
   * @param {PresentationTime} time - The time to clamp.
   * @returns {PresentationTime} The clamped time.
   */
  clampToSegmentRange(time) {
    return TimeUtil.min(TimeUtil.max(TimeUtil.seekToSample, time), this.offset);
  }

  /**
   * Checks if the given time is relative to the segment start.
   *
   * @param {PresentationTime} time - The time to check.
   * @returns {*} Result of the comparison.
   */
  timeRelativeToStart(time) {
    return this.startTime.item(time);
  }

  /**
   * Computes the duration from the given time to this segment's start.
   *
   * @param {PresentationTime} time - The reference time.
   * @returns {PresentationTime} Duration.
   */
  durationFromStart(time) {
    return time.lowestWaterMarkLevelBufferRelaxed(this.startTime);
  }

  /**
   * Tests whether the given time falls strictly between start and end.
   *
   * @param {PresentationTime} time - The time to test.
   * @returns {boolean} True if time is within the open interval (start, end).
   */
  containsTimeExclusive(time) {
    return time.greaterThan(this.startTime) && time.lessThan(this.endTime);
  }

  /**
   * Tests whether the given time falls within [start, end).
   *
   * @param {PresentationTime} time - The time to test.
   * @returns {boolean} True if time is within the half-open interval.
   */
  containsTime(time) {
    return time.$f(this.startTime) && time.timeComparison(this.endTime);
  }

  /**
   * Tests whether the given time falls within [seekToSample, offset).
   *
   * @param {PresentationTime} time - The time to test.
   * @returns {boolean} True if time is within the segment's effective range.
   */
  isInEffectiveRange(time) {
    return time.$f(TimeUtil.seekToSample) && time.timeComparison(this.offset);
  }

  // ─── Mutation Methods ──────────────────────────────────────────────────

  /**
   * Normalizes the segment's start and end times to a common timescale.
   * Updates both the internal PresentationTime objects and the raw segment data.
   *
   * @param {PresentationTime} normalizedStart - The new start time.
   * @param {PresentationTime} normalizedEnd - The new end time.
   */
  normalize(normalizedStart, normalizedEnd) {
    if (normalizedStart && normalizedEnd) {
      const commonTimescale = Math.max(
        normalizedStart.timescaleValue,
        normalizedEnd.timescaleValue
      );
      this.startTime = normalizedStart.downloadState(commonTimescale);
      this.endTime = normalizedEnd.downloadState(commonTimescale);
      this.currentSegment.startTimeMs = this.startTime.playbackSegment;
      this.currentSegment.contentEndPts = this.endTime.playbackSegment;
      this.timeAttributesReused = true;
    }
  }

  /**
   * Updates the segment's weight and recalculates the self-probability.
   *
   * @param {number} newWeight - The new weight value.
   */
  updateWeight(newWeight) {
    this.weight = newWeight;
    this.selfProbability = computeSelfProbability(this.transitionMode, this);
  }

  /**
   * Extends the segment's end time.
   *
   * @param {PresentationTime} newEndTime - The new end time.
   * @returns {WorkingSegment} This segment (for chaining).
   */
  extend(newEndTime) {
    this.endTime = newEndTime;
    return this;
  }

  /**
   * Checks whether a branch with the given ID exists.
   *
   * @param {string} branchId - The branch ID to check.
   * @returns {boolean} True if the branch exists.
   */
  hasBranch(branchId) {
    return !!(this.next && Object.keys(this.next).indexOf(branchId) > -1);
  }

  /**
   * Determines the consensus transition mode across all active branches.
   * If all active branches agree on a mode, returns that mode; otherwise
   * falls back to the segment-level transition mode.
   *
   * @returns {string} The resolved transition mode.
   */
  resolveTransitionMode() {
    if (!this.activeBranchIds.length) return this.transitionMode;

    const resolved = this.activeBranchIds
      .map(this.getTransitionModeForBranch)
      .reduce((prev, curr) => (prev === curr ? curr : undefined));

    return resolved ?? this.transitionMode;
  }

  /**
   * Computes the transition probability for a specific branch.
   * Returns an object with `selfProbability` (probability through normal flow)
   * and optionally `immediate` (additional probability from immediate transition).
   *
   * @param {string} branchId - The branch to compute probability for.
   * @returns {{ selfProbability: number, immediate?: number }} The probability breakdown.
   */
  computeBranchProbability(branchId) {
    if (this.totalImmediateWeight) {
      const baseProbability = (this.immediateWeights[branchId] || 0) / this.totalImmediateWeight;

      if (this.weight === undefined || this.totalImmediateTransitionWeight === 0) {
        return { selfProbability: baseProbability };
      }

      const selfRatio = this.selfWeightRatio;
      if (selfRatio !== 1 && isImmediate(this.getTransitionModeForBranch(branchId)) && this.immediateWeights[branchId]) {
        return {
          selfProbability: selfRatio * baseProbability,
          immediate: this.immediateWeights[branchId] / this.totalImmediateTransitionWeight * (1 - selfRatio),
        };
      }

      return { selfProbability: selfRatio * baseProbability };
    }

    // No weights at all — uniform distribution
    return {
      selfProbability: this.next?.[branchId] ? 1 / this.branchCount : 0,
    };
  }

  /**
   * Sets forced choice IDs, overriding transition mode to "immediate".
   *
   * @param {string[]} choiceIds - The forced choice IDs.
   */
  setForcedChoices(choiceIds) {
    this.forcedChoices = choiceIds;
    this._invalidateWeightCaches();
  }

  /**
   * Applies branch weights from the current `next` map (or from an explicit
   * weight override map) into the `immediateWeights` map.
   *
   * @param {Object<string, number>} [weightOverrides] - Optional map of branch ID to weight override.
   */
  applyBranchWeights(weightOverrides) {
    if (this.next) {
      const branches = this.next;
      this.immediateWeights = Object.keys(this.next).reduce((acc, branchId) => {
        const weight = weightOverrides ? (weightOverrides[branchId] || 0) : branches[branchId].weight;
        if (weight !== undefined && weight !== null && weight >= 0) {
          acc[branchId] = weight;
        }
        return acc;
      }, {});
    } else {
      this.immediateWeights = {};
    }
    this._invalidateWeightCaches();
  }

  // ─── Private Helpers ───────────────────────────────────────────────────

  /**
   * Computes the total weight of all active branches.
   * @private
   * @returns {number}
   */
  _computeTotalImmediateWeight() {
    return this.activeBranchIds.reduce(
      (sum, id) => sum + this.immediateWeights[id],
      0
    );
  }

  /**
   * Computes the total weight of active branches that use "immediate" transition mode.
   * @private
   * @returns {number}
   */
  _computeImmediateTransitionWeight() {
    return this.activeBranchIds
      .filter((id) => isImmediate(this.getTransitionModeForBranch(id)))
      .reduce((sum, id) => sum + this.immediateWeights[id], 0);
  }

  /**
   * Invalidates cached weight computations. Called whenever weights or
   * forced choices change.
   * @private
   */
  _invalidateWeightCaches() {
    this._cachedTotalImmediateWeight = undefined;
    this._cachedImmediateTransitionWeight = undefined;
  }

  /**
   * Returns a human-readable representation of this segment.
   * Format: `WSeg[<mediaType>](<id>) <timeRange>v:<version>`
   *
   * @returns {string}
   */
  toString() {
    const timeRange = new TimeRange(this.startTime, this.endTime);
    return `WSeg[${this.mediaType}](${this.id}) ${timeRange.toString(TimeFormat.playbackSegment)}v:${this.version}`;
  }
}

/**
 * @class BranchWeight
 * @description Lightweight value object holding the normalized weight and transition
 *   mode for a single branch within a segment's `next` map.
 *
 * Original obfuscated name: class `m` (i7b)
 */
class BranchWeight {
  /**
   * @param {Object} branchData - Raw branch data with optional `weight` and `fe` (transition mode).
   * @param {number} weightedBranchCount - Number of branches that carry weight.
   * @param {number|undefined} totalWeight - Total weight across all branches.
   * @param {string} defaultTransitionMode - Fallback transition mode.
   */
  constructor(branchData, weightedBranchCount, totalWeight, defaultTransitionMode) {
    /** @type {string} Transition mode for this branch */
    this.transitionMode = branchData.fe || defaultTransitionMode;

    /** @type {number|undefined} Raw weight value */
    this.weight = branchData.weight;

    /** @type {number} Normalized weight (0 to 1) */
    this.normalizedWeight = normalizeWeight(branchData.weight, weightedBranchCount, totalWeight);
  }
}

// ─── Exports ─────────────────────────────────────────────────────────────

export {
  WorkingSegment,
  BranchWeight,
  buildBranchWeights,
  computeSelfProbability,
  mergeBranchMaps,
  computeWeightInfo,
  normalizeWeight,
  clampSegmentToRange,
};

export default WorkingSegment;
