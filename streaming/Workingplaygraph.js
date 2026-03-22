/**
 * Netflix Cadmium Player - WorkingPlaygraph
 * Component: WORKINGPLAYGRAPH
 *
 * A WorkingPlaygraph is a live, mutable representation of the segment timeline
 * that the player actively uses for scheduling downloads and managing playback.
 * It wraps the immutable PlaygraphMap (the raw segment data from the manifest)
 * and provides:
 *
 * - Segment lookup by ID (with lazy instantiation of WorkingSegment wrappers)
 * - Iteration over segments and their graph connections (next, previous, ancestors)
 * - Normalization: resolving relative timestamps to absolute PTS values once
 *   the viewable's timing information becomes available
 * - Support for child/parent playgraph chaining (for ad insertion and
 *   interactive content)
 * - Branch weight/probability management for interactive choice points
 *
 * The segment graph is a directed graph where each segment can have multiple
 * "next" segments (branches) with associated weights/probabilities.
 */

// Dependencies
// import { __extends, __values, __generator, __read, __spreadArray } from './modules/Module_22970.js';
// import { assert, findLast, DeferredIterator, uniqueArray } from './modules/Module_91176.js';
// import { platform } from './modules/Module_66164.js';
// import { WorkingSegment, computeWeightRange, normalizeWeight } from './modules/Module_48781.js';
// import { mergePlaygraphs } from './modules/Module_26162.js';

/**
 * Resolves the default next segment ID for a given segment, choosing the
 * branch with highest weight if no explicit default is set.
 *
 * @param {WorkingPlaygraph} playgraph - The playgraph to look up segments in.
 * @param {string} segmentId - The current segment's ID.
 * @returns {string|undefined} The next segment ID, or undefined if terminal.
 */
function resolveDefaultNext(playgraph, segmentId) {
  const segment = playgraph.getSegment(segmentId);
  if (!segment) return undefined;

  // Use the explicit default if it has non-zero weight
  if (segment.defaultNext) {
    const defaultBranch = segment.next?.[segment.defaultNext];
    if (defaultBranch && defaultBranch.normalizedWeight !== 0) {
      return segment.defaultNext;
    }
  }

  // Otherwise pick the branch with highest normalized weight
  if (segment.next) {
    const branches = segment.next;
    const branchIds = Object.keys(branches);
    const [highestId] = branchIds.reduce(
      ([bestId, bestWeight], id) => {
        return branches[id].normalizedWeight > bestWeight
          ? [id, branches[id].normalizedWeight]
          : [bestId, bestWeight];
      },
      [undefined, 0]
    );
    return highestId ?? branchIds[0];
  }

  return undefined;
}

/**
 * @class PlaygraphFactory
 * @description Static factory for creating and updating WorkingPlaygraph instances.
 *   Acts as the public API for playgraph construction.
 */
class PlaygraphFactory {
  /**
   * @param {Object} segmentMap - The raw playgraph segment map from the manifest.
   */
  constructor(segmentMap) {
    /** @type {Object} The underlying segment map data */
    this.segmentMap = segmentMap;
  }

  /**
   * Creates a new WorkingPlaygraph from a raw segment map.
   *
   * @param {Object} segmentMap - Raw playgraph data from manifest.
   * @returns {WorkingPlaygraph} A new working playgraph instance.
   */
  static create(segmentMap) {
    return new WorkingPlaygraph(segmentMap);
  }

  /**
   * Creates a new WorkingPlaygraph and merges state from an existing one.
   *
   * @param {WorkingPlaygraph} existingPlaygraph - The existing playgraph to
   *   merge state from (e.g., already-created WorkingSegments).
   * @param {Object} newSegmentMap - The new segment map data.
   * @returns {WorkingPlaygraph} Updated working playgraph.
   */
  static update(existingPlaygraph, newSegmentMap) {
    return new WorkingPlaygraph(newSegmentMap).mergeFrom(existingPlaygraph);
  }

  /**
   * Creates a linked child-parent playgraph pair (used for ad pods and
   * interactive branching).
   *
   * @param {WorkingPlaygraph} parentPlaygraph - The parent playgraph.
   * @param {Object} childSegmentMap - The child's segment map.
   * @returns {{ childPlaygraph: WorkingPlaygraph, mapping: Object }}
   *   The child playgraph and the segment mapping between parent and child.
   */
  static graphFactory(parentPlaygraph, childSegmentMap) {
    const result = mergePlaygraphs(parentPlaygraph, childSegmentMap);
    const { childPlaygraph, segmentMapping, timestampMapping } = result;

    parentPlaygraph.setChildPlaygraph(childPlaygraph, segmentMapping);
    childPlaygraph.setParentPlaygraph(parentPlaygraph, segmentMapping);

    return {
      childPlaygraph,
      mapping: timestampMapping,
    };
  }
}

/** @type {number} Auto-incrementing ID counter for WorkingPlaygraph instances */
let nextPlaygraphId = 0;

/**
 * @class WorkingPlaygraph
 * @extends PlaygraphFactory
 * @description The active, mutable playgraph used during playback. Wraps raw
 *   segment data with WorkingSegment instances that track normalization state,
 *   download progress, and branch relationships.
 */
class WorkingPlaygraph extends PlaygraphFactory {
  /**
   * @param {Object} segmentMap - The raw segment map from the manifest.
   */
  constructor(segmentMap) {
    super(segmentMap);

    /**
     * @type {WeakMap<Object, WorkingSegment>}
     * Maps raw segment data objects to their WorkingSegment wrappers.
     * Uses WeakMap so segments can be garbage collected when removed.
     */
    this.segmentWrapperCache = new WeakMap();

    /**
     * @type {Map<number, Function>}
     * Stores normalization functions keyed by viewableId.
     * When a viewable's timing info becomes available, the normalization
     * function converts relative timestamps to absolute PTS.
     */
    this.normalizationMap = new Map();

    // ======== MODULE: WORKINGPLAYGRAPH ========
    /** @type {Console} Scoped console logger */
    this.console = new platform.Console('WORKINGPLAYGRAPH');

    // Validate initial segment exists
    assert(segmentMap.initialSegment, 'Playgraph must have an initial segment');
    const initialSeg = this.getSegment(segmentMap.initialSegment);
    assert(
      initialSeg,
      `Could not find initial segment ${segmentMap.initialSegment} in playgraph`
    );

    /** @type {WorkingSegment} The initial/starting segment of this playgraph */
    this.initialSegment = initialSeg;

    /**
     * @type {Object} Generator-based traversal callbacks for synchronized iteration.
     * Each method returns a generator that yields WorkingSegments.
     */
    this.generatorTraversals = {
      forwardFromSegment: this.generateForwardSegments.bind(this),
      predecessorsOf: this.generatePredecessors.bind(this),
      defaultPathFrom: this.generateDefaultPath.bind(this),
      ancestorsOf: this.generateAncestors.bind(this),
      decompressor: this.generateBranchTree.bind(this),
    };

    /**
     * @type {Object} Callback-based traversal methods (non-generator).
     * Each method accepts a visitor callback and traverses accordingly.
     */
    this.callbackTraversals = {
      forwardFromSegment: this.visitForwardSegments.bind(this),
      predecessorsOf: this.visitPredecessors.bind(this),
      defaultPathFrom: this.visitDefaultPath.bind(this),
      ancestorsOf: this.visitAncestors.bind(this),
      decompressor: this.visitBranchTree.bind(this),
    };

    /** @type {number} Unique ID for this playgraph instance */
    this.playgraphId = nextPlaygraphId++;

    /**
     * @type {DeferredIterator}
     * Supports deferred/lazy iteration over the branch tree,
     * computing downstream segments and their weights.
     */
    this.branchTreeIterator = new DeferredIterator((segment) => {
      return Object.keys(segment.next || {}).map((nextId) => ({
        segment: this.getSegment(nextId),
        weight: segment.offset.playbackSegment,
      }));
    });
  }

  /**
   * Lazily computed set of unique viewable IDs across all segments.
   * @type {Set<number>}
   */
  get uniqueViewableIds() {
    if (!this._uniqueViewableIds) {
      this._uniqueViewableIds = this.computeUniqueViewableIds();
    }
    return this._uniqueViewableIds;
  }

  /**
   * Whether this playgraph has a child playgraph linked to it.
   * @type {boolean}
   */
  get hasChildPlaygraph() {
    return !!this.childPlaygraphRef;
  }

  /**
   * Whether this playgraph has a parent playgraph linked to it.
   * @type {boolean}
   */
  get hasParentPlaygraph() {
    return !!this.parentPlaygraphRef;
  }

  /**
   * The child playgraph's segment map, if one exists.
   * @type {Object|undefined}
   */
  get childSegmentMap() {
    return this.childPlaygraphRef?.segmentMap;
  }

  /**
   * The parent playgraph's segment map, if one exists.
   * @type {Object|undefined}
   */
  get parentSegmentMap() {
    return this.parentPlaygraphRef?.segmentMap;
  }

  /**
   * Returns the root-level playgraph in the hierarchy.
   * Walks up through parent references until finding one with no parent.
   * @type {WorkingPlaygraph}
   */
  get rootPlaygraph() {
    return this.parentSegmentMap?.rootPlaygraph ?? this;
  }

  /**
   * Merges state from an existing playgraph into this one. Used when the
   * playgraph is updated (e.g., live manifest refresh) — preserves already-
   * created WorkingSegment wrappers and normalization state.
   *
   * @param {WorkingPlaygraph} source - The existing playgraph to merge from.
   * @returns {WorkingPlaygraph} This playgraph (for chaining).
   */
  mergeFrom(source) {
    const segments = this.segmentMap.segments;

    for (const segmentId of Object.keys(segments)) {
      if (source.hasCreatedSegment(segmentId)) {
        const rawSegment = segments[segmentId];
        this.createWorkingSegment(segmentId, rawSegment, source.getSegment(segmentId));
        if (source.normalizationMap.has(rawSegment.viewableId)) {
          this.applyNormalization(
            rawSegment.viewableId,
            source.normalizationMap.get(rawSegment.viewableId)
          );
        }
      }
    }

    return this;
  }

  /**
   * Checks whether a segment ID exists in the segment map.
   *
   * @param {string} segmentId - The segment ID to check.
   * @returns {boolean} True if the segment exists.
   */
  has(segmentId) {
    return !!this.segmentMap.segments[segmentId];
  }

  /**
   * Gets or lazily creates a WorkingSegment for the given segment ID.
   *
   * @param {string} segmentId - The segment ID to look up.
   * @returns {WorkingSegment|undefined} The working segment, or undefined
   *   if the segment doesn't exist in the map.
   */
  getSegment(segmentId) {
    const rawSegment = this.segmentMap.segments[segmentId];
    if (!rawSegment) return undefined;
    return this.segmentWrapperCache.get(rawSegment) || this.createWorkingSegment(segmentId, rawSegment);
  }

  /**
   * Generator that yields [segmentId, WorkingSegment] pairs for all segments.
   * @yields {[string, WorkingSegment]}
   */
  *entries() {
    for (const segmentId of Object.keys(this.segmentMap.segments)) {
      yield [segmentId, this.getSegment(segmentId)];
    }
  }

  /**
   * Iterates over all segments, calling the callback for each.
   *
   * @param {Function} callback - Called with (workingSegment, segmentId, playgraph).
   */
  forEach(callback) {
    Object.keys(this.segmentMap.segments).forEach((segmentId) => {
      const segment = this.getSegment(segmentId);
      callback(segment, segmentId, this);
    });
  }

  /**
   * Returns an iterator over all segment IDs.
   * @returns {Iterator<string>}
   */
  keys() {
    return Object.keys(this.segmentMap.segments).values();
  }

  /**
   * Generator that yields WorkingSegment instances for all segments.
   * @yields {WorkingSegment}
   */
  *values() {
    for (const segmentId of Object.keys(this.segmentMap.segments)) {
      yield this.getSegment(segmentId);
    }
  }

  /**
   * Applies a normalization function to all segments belonging to a viewable.
   * Normalization converts relative segment timestamps to absolute PTS values.
   *
   * @param {number} viewableId - The viewable ID to normalize.
   * @param {Function} normalizationFn - Function that maps relative time to absolute PTS.
   */
  applyNormalization(viewableId, normalizationFn) {
    let found = false;
    this.forEachCreatedSegment((segment) => {
      if (segment.viewableId === viewableId) {
        if (!found) {
          this.normalizationMap.set(viewableId, normalizationFn);
        }
        this.normalizeSegment(segment);
        found = true;
      }
    });
    if (found && this.hasParentPlaygraph) {
      this.parentSegmentMap?.applyNormalization(viewableId, normalizationFn);
    }
  }

  /**
   * Removes the normalization function for a viewable (e.g., when it's disposed).
   *
   * @param {number} viewableId - The viewable ID to clear normalization for.
   */
  clearNormalization(viewableId) {
    if (this.normalizationMap.has(viewableId)) {
      this.normalizationMap.delete(viewableId);
      this.parentPlaygraphRef?.segmentMap.clearNormalization(viewableId);
    }
  }

  /**
   * Normalizes a specific segment by ID using a normalization function.
   *
   * @param {string} segmentId - The segment to normalize.
   * @param {*} startTimeNormalized - The normalized start time.
   * @param {*} endTimeNormalized - The normalized end time.
   */
  normalizeSegmentById(segmentId, startTimeNormalized, endTimeNormalized) {
    if (this.hasCreatedSegment(segmentId)) {
      this.getSegment(segmentId).normalize(startTimeNormalized, endTimeNormalized);
    }
  }

  /**
   * Generator that yields segments matching a predicate.
   *
   * @param {Function} predicate - Test function receiving raw segment data.
   * @yields {WorkingSegment}
   */
  *filter(predicate) {
    for (const segmentId of Object.keys(this.segmentMap.segments)) {
      if (predicate(this.segmentMap.segments[segmentId])) {
        yield this.getSegment(segmentId);
      }
    }
  }

  /**
   * Updates branch weights/probabilities for a segment's next-branches.
   *
   * @param {string} segmentId - The segment whose branches to update.
   * @param {Object} weightMap - Map of branch segment IDs to their new weights.
   */
  applyConfig(segmentId, weightMap) {
    const segment = this.getSegment(segmentId);
    const branches = segment?.next;

    if (branches) {
      // Update raw weights
      Object.keys(weightMap).forEach((branchId) => {
        const branch = branches[branchId];
        if (branch) {
          branch.weight = weightMap[branchId];
        }
      });

      // Recompute normalized weights
      const { minWeight, maxWeight } = computeWeightRange(branches);
      Object.keys(branches).forEach((branchId) => {
        const branch = branches[branchId];
        if (branch) {
          branch.normalizedWeight = normalizeWeight(branch.weight, minWeight, maxWeight);
        }
      });
    }

    segment?.applyConfig(weightMap);
  }

  /**
   * Generator that traverses segments following a resolver function.
   * The resolver determines which segment comes next at each step.
   *
   * @param {Function} nextResolver - Function(playgraph, currentId) => nextId.
   * @param {string} startSegmentId - The segment ID to start from.
   * @yields {WorkingSegment}
   */
  *traverseWith(nextResolver, startSegmentId) {
    let currentId = startSegmentId;
    while (currentId) {
      const segment = this.getSegment(currentId);
      if (!segment) break;
      yield segment;
      currentId = nextResolver(this, currentId);
    }
  }

  /**
   * Whether a segment has any outgoing branches.
   *
   * @param {string} segmentId - The segment ID to check.
   * @returns {boolean} True if the segment has next-branches.
   */
  hasNextBranches(segmentId) {
    const segment = this.segmentMap.segments[segmentId];
    return !!(segment && segment.next && Object.keys(segment.next).length);
  }

  /**
   * Whether a segment has any incoming branches (predecessors).
   *
   * @param {string} segmentId - The segment ID to check.
   * @returns {boolean} True if other segments point to this one.
   */
  hasPredecessors(segmentId) {
    const segment = this.getSegment(segmentId);
    return !!(segment && this.findPredecessorIds(segment).length);
  }

  /**
   * Links a child playgraph to this one.
   *
   * @param {WorkingPlaygraph} childPlaygraph - The child playgraph.
   * @param {Object} segmentMapping - Mapping between parent and child segments.
   */
  setChildPlaygraph(childPlaygraph, segmentMapping) {
    this.childPlaygraphRef = {
      playgraph: childPlaygraph,
      mapping: segmentMapping,
    };
  }

  /**
   * Unique numeric ID for this playgraph instance.
   * @type {number}
   */
  get id() {
    return this.playgraphId;
  }

  /**
   * Human-readable identifier showing the parent -> self -> child chain.
   * @type {string}
   */
  get identifier() {
    const parentId = this.parentPlaygraphRef?.segmentMap.id ?? 'N';
    const childId = this.childPlaygraphRef?.segmentMap?.id ?? 'N';
    return `${parentId} -> (${this.id}) -> ${childId}`;
  }

  /**
   * Links a parent playgraph to this one.
   *
   * @param {WorkingPlaygraph} parentPlaygraph - The parent playgraph.
   * @param {Object} segmentMapping - Mapping between parent and child segments.
   */
  setParentPlaygraph(parentPlaygraph, segmentMapping) {
    this.parentPlaygraphRef = {
      playgraph: parentPlaygraph,
      mapping: segmentMapping,
    };
  }

  /**
   * Maps a segment ID from this playgraph to the parent's segment space.
   *
   * @param {string} segmentId - Segment ID in this playgraph.
   * @returns {string|undefined} Corresponding segment ID in the parent.
   */
  mapToParent(segmentId) {
    return this.parentPlaygraphRef?.mapping.mapForward(segmentId);
  }

  /**
   * Recursively maps a segment ID up through the parent chain to the
   * root playgraph's segment space.
   *
   * @param {string} segmentId - Segment ID to map.
   * @returns {string} The mapped segment ID at the root level.
   */
  mapToRoot(segmentId) {
    if (!this.hasParentPlaygraph) return segmentId;
    const parentId = this.mapToParent(segmentId);
    return parentId !== undefined ? this.parentSegmentMap.mapToRoot(parentId) : segmentId;
  }

  /**
   * Maps a segment ID from this playgraph to the child's segment space.
   *
   * @param {string} segmentId - Segment ID in this playgraph.
   * @returns {string|undefined} Corresponding segment ID in the child.
   */
  mapToChild(segmentId) {
    if (!this.hasChildPlaygraph) return segmentId;
    const childId = this.childSegmentMap.mapToChild(segmentId);
    return childId !== undefined ? this.childSegmentMap.mapToParent(childId) : undefined;
  }

  /**
   * Maps a parent segment ID to this playgraph's segment space
   * using reverse mapping.
   *
   * @param {string} segmentId - Segment ID in parent playgraph.
   * @returns {*} The reverse-mapped result.
   */
  reverseMapFromParent(segmentId) {
    return this.parentPlaygraphRef?.mapping.mapReverse(segmentId);
  }

  /**
   * Maps a child segment ID to this playgraph's segment space.
   *
   * @param {string} segmentId - Segment ID in child playgraph.
   * @returns {*} The forward-mapped result.
   */
  forwardMapFromChild(segmentId) {
    return this.childPlaygraphRef?.mapping.mapForward(segmentId);
  }

  /**
   * Checks if a segment has been instantiated (has a WorkingSegment wrapper).
   *
   * @param {string} segmentId - The segment ID to check.
   * @returns {boolean} True if the WorkingSegment wrapper exists.
   */
  hasCreatedSegment(segmentId) {
    const rawSegment = this.segmentMap.segments[segmentId];
    return rawSegment ? this.segmentWrapperCache.has(rawSegment) : false;
  }

  /**
   * Generator yielding WorkingSegments for all forward (next) branches
   * from a given segment.
   *
   * @param {string} segmentId - The segment to get forward branches from.
   * @yields {WorkingSegment}
   */
  *generateForwardSegments(segmentId) {
    const rawSegment = this.segmentMap.segments[segmentId];
    if (!rawSegment || !rawSegment.next) return;

    for (const nextId of Object.keys(rawSegment.next)) {
      yield this.getSegment(nextId);
    }
  }

  /**
   * Visits forward segments using a callback-based traversal.
   *
   * @param {string} segmentId - Starting segment ID.
   * @param {Function} visitor - Callback for each forward segment.
   * @param {*} state - Initial state passed through the visitor chain.
   */
  visitForwardSegments(segmentId, visitor, state) {
    this.traverseWithVisitor(this.generateForwardSegments(segmentId), visitor, state);
  }

  /**
   * Generator yielding WorkingSegments for all predecessors of a segment.
   *
   * @param {string} segmentId - The segment to find predecessors of.
   * @yields {WorkingSegment}
   */
  *generatePredecessors(segmentId) {
    const segment = this.getSegment(segmentId);
    if (!segment) return;

    for (const predId of this.findPredecessorIds(segment)) {
      yield this.getSegment(predId);
    }
  }

  /**
   * Visits predecessors using a callback-based traversal.
   *
   * @param {string} segmentId - Starting segment ID.
   * @param {Function} visitor - Callback for each predecessor.
   * @param {*} state - Initial state.
   */
  visitPredecessors(segmentId, visitor, state) {
    this.traverseWithVisitor(this.generatePredecessors(segmentId), visitor, state);
  }

  /**
   * Shared visitor traversal logic. Iterates a generator, calling the visitor
   * for each segment. The visitor can return { continueTraversal: false }
   * to stop early.
   *
   * @private
   * @param {Generator} segmentGenerator - Generator yielding WorkingSegments.
   * @param {Function} visitor - Callback(segment, previousSegment, playgraph, state).
   * @param {*} state - Mutable state threaded through the visitor.
   */
  traverseWithVisitor(segmentGenerator, visitor, state) {
    let shouldContinue = true;
    let previousSegment;

    for (const segment of segmentGenerator) {
      const result = visitor(segment, previousSegment, this, state);
      shouldContinue = result.continueTraversal;
      state = result.state;
      if (!shouldContinue) break;
      previousSegment = segment;
    }
  }

  /**
   * Generator following the default-next path from a segment.
   * At each step, picks the branch with the highest weight.
   *
   * @param {string} segmentId - Starting segment ID.
   * @yields {WorkingSegment}
   */
  *generateDefaultPath(segmentId) {
    yield* this.traverseWith(resolveDefaultNext, segmentId);
  }

  /**
   * Visits segments along the default path using a callback.
   *
   * @param {string} segmentId - Starting segment ID.
   * @param {Function} visitor - Callback for each segment.
   * @param {*} state - Initial state.
   */
  visitDefaultPath(segmentId, visitor, state) {
    this.traverseWithVisitor(this.generateDefaultPath(segmentId), visitor, state);
  }

  /**
   * Generator yielding ancestor segments (walking backward through predecessors).
   *
   * @param {string} segmentId - Starting segment ID.
   * @yields {WorkingSegment}
   */
  *generateAncestors(segmentId) {
    let currentSegment = this.getSegment(segmentId);

    while (currentSegment) {
      const predecessorIds = [...this.generatePredecessors(currentSegment.id)];
      if (predecessorIds.length === 0) break;

      currentSegment =
        predecessorIds.length === 1
          ? predecessorIds[0]
          : findLast(predecessorIds, (pred) => pred.defaultNext === segmentId) ||
            predecessorIds[0];

      yield currentSegment;
    }
  }

  /**
   * Visits ancestors using a callback-based traversal.
   *
   * @param {string} segmentId - Starting segment ID.
   * @param {Function} visitor - Callback for each ancestor.
   * @param {*} state - Initial state.
   */
  visitAncestors(segmentId, visitor, state) {
    this.traverseWithVisitor(this.generateAncestors(segmentId), visitor, state);
  }

  /**
   * Generator for the branch tree decomposition (not implemented in base class).
   * @throws {Error} Always throws — must be overridden.
   */
  generateBranchTree() {
    assert(false, 'Not implemented');
  }

  /**
   * Visits the branch tree using the DeferredIterator for weighted traversal.
   *
   * @param {string} segmentId - Starting segment ID.
   * @param {Function} visitor - Callback for each branch tree node.
   * @param {*} state - Initial state.
   */
  visitBranchTree(segmentId, visitor, state) {
    const segment = this.getSegment(segmentId);
    assert(segment, 'Segment not found in playgraph');

    this.branchTreeIterator.traverse(segment, (seg, _prev, _pg, st) => {
      return visitor(seg, _prev, this, st);
    }, state);
  }

  /**
   * Creates a WorkingSegment wrapper for a raw segment.
   *
   * @private
   * @param {string} segmentId - The segment ID.
   * @param {Object} rawSegment - The raw segment data from the map.
   * @param {WorkingSegment} [existingWrapper] - An existing wrapper to merge from.
   * @returns {WorkingSegment} The created WorkingSegment.
   */
  createWorkingSegment(segmentId, rawSegment, existingWrapper) {
    const wrapper = new WorkingSegment(
      segmentId,
      rawSegment,
      this.segmentMap.loadingStrategy || 'lazy',
      this.identifier,
      existingWrapper
    );

    // Apply pending normalization if not already normalized
    if (!wrapper.isNormalized && this.normalizationMap.has(rawSegment.viewableId)) {
      this.normalizeSegment(wrapper);
    }

    this.segmentWrapperCache.set(rawSegment, wrapper);
    return wrapper;
  }

  /**
   * Iterates over all created (instantiated) WorkingSegments.
   *
   * @private
   * @param {Function} callback - Called with (workingSegment, segmentId).
   */
  forEachCreatedSegment(callback) {
    Object.keys(this.segmentMap.segments).forEach((segmentId) => {
      const wrapper = this.segmentWrapperCache.get(this.segmentMap.segments[segmentId]);
      if (wrapper) callback(wrapper, segmentId);
    });
  }

  /**
   * Applies the stored normalization function to a WorkingSegment.
   *
   * @private
   * @param {WorkingSegment} segment - The segment to normalize.
   */
  normalizeSegment(segment) {
    const normFn = this.normalizationMap.get(segment.viewableId);
    if (normFn) {
      segment.normalize(normFn(segment.startTimeMs), normFn(segment.contentEndPts));
    }
  }

  /**
   * Computes the set of unique viewable IDs across all segments.
   *
   * @private
   * @returns {*} Unique set of viewable IDs.
   */
  computeUniqueViewableIds() {
    return uniqueArray(
      Object.keys(this.segmentMap.segments).map(
        (segmentId) => this.segmentMap.segments[segmentId].viewableId
      )
    );
  }

  /**
   * Finds all segment IDs that have a "next" reference pointing to
   * the given segment (i.e., predecessors in the graph).
   *
   * @private
   * @param {WorkingSegment} segment - The target segment.
   * @returns {string[]} Array of predecessor segment IDs.
   */
  findPredecessorIds(segment) {
    if (!segment.predecessorIds) {
      segment.predecessorIds = [];
      for (const segmentId in this.segmentMap.segments) {
        const nextMap = this.segmentMap.segments[segmentId].next;
        if (nextMap && segment.id in nextMap) {
          segment.predecessorIds.push(segmentId);
        }
      }
    }
    return segment.predecessorIds;
  }
}

export { PlaygraphFactory, WorkingPlaygraph };
