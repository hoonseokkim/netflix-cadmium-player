/**
 * Netflix Cadmium Player — ASEJS Base Stream Pipeline
 *
 * Provides the abstract base class for media-type stream pipelines
 * (audio, video, timed-text).  Manages branch registration, playback
 * position resolution, pause/resume of download pipelines, and
 * segment-location lookup.
 *
 * Concrete subclasses add DRM, buffering heuristics, and
 * media-source-extension integration.
 *
 * @module BaseStreamPipeline
 */

// Dependencies
// import { __generator, __values, __read, __spreadArray, __decorate, __param } from 'tslib';
// import { EventEmitter } from './modules/EventEmitter';
// import { TimeUtil, observableBool, flatten, findLast, XY, hn, np, assert } from './modules/TimeUtil';
// import { platform } from './modules/Platform';
// import { assert as softAssert } from './modules/Assert';
// import { timeSlice, F7 as ALL_MEDIA_TYPES } from './modules/StreamConstants';
// import { gz as decorators } from './modules/Decorators';
// import { u as DEBUG } from './modules/Debug';
// import { oAb as findBranchForPosition } from './modules/BranchUtils';

/**
 * Represents the download state for a single media type within a viewable.
 */
class MediaTypeDownloadState {
  /**
   * @param {number} mediaType - The media type enum value.
   */
  constructor(mediaType) {
    /** @type {number} */
    this.mediaType = mediaType;

    /** @type {*} Pending download handle, if any. */
    this.pendingDownloadHandle = undefined;
  }
}

/**
 * @enum {number} Describes the switchability of streams within a viewable.
 */
const StreamSwitchability = Object.freeze({
  NO_DATA: 0,
  SWITCHABLE: 1,
  NONSWITCHABLE: 2,
  SWITCHABLE_AND_NONSWITCHABLE: 3,
});

/**
 * Abstract base class for stream pipelines.
 *
 * Manages an ordered list of branches (segments queued for playback),
 * provides position-to-branch resolution, and coordinates pause/resume
 * across all branches.
 */
class BaseStreamPipeline {
  constructor() {
    /** @type {number[]} Media-type indices that are currently paused. */
    this.pausedMediaTypes = [];

    /** @type {observableBool<boolean>} Observable: whether the pipeline is buffering. */
    this.isBuffering = new observableBool(false);

    /** @type {observableBool<TimeUtil>} Observable: current buffer end position. */
    this.bufferEndPosition = new observableBool(TimeUtil.fromMilliseconds(-Infinity));

    /** @type {observableBool<TimeUtil>} Observable: lowest buffer level. */
    this.lowestBufferLevel = new observableBool(TimeUtil.fromMilliseconds(-Infinity));

    /** @type {*} Playgraph reference (set after claim). */
    this.playgraphRef = undefined;

    /** @type {EventEmitter} */
    this.events = new EventEmitter();

    /** @type {Console} */
    this.console = new platform.Console("ASEJS", "media|asejs");

    /** @type {*} Internal active-viewable reference. */
    this.activeViewableRef = undefined;
  }

  // ──────────────────────────────────────────────
  //  Getters
  // ──────────────────────────────────────────────

  /** @returns {*} The active viewable for this pipeline. */
  get activeViewable() {
    return this.playgraphRef;
  }

  /** @returns {Console} */
  get pipelineConsole() {
    return this.console;
  }

  /** @returns {*} Stream-direction / mode descriptor. */
  get streamDirection() {
    return this.activeViewableRef;
  }

  /** @returns {*} Unused placeholder. */
  get pendingSeek() {
    // No-op getter.
  }

  /** @returns {Map} Empty capabilities map. */
  get capabilities() {
    return new Map();
  }

  /** @returns {number} Playback rate (always 1x for base pipeline). */
  get playbackRate() {
    return this.getPlaybackRate();
  }

  /** @returns {boolean} Always false for the base pipeline. */
  get isLowLatency() {
    return false;
  }

  /** @returns {observableBool<boolean>} */
  get bufferingObservable() {
    return this.isBuffering;
  }

  /** @returns {observableBool<TimeUtil>} */
  get bufferEndObservable() {
    return this.bufferEndPosition;
  }

  /** @returns {observableBool<TimeUtil>} */
  get lowestBufferObservable() {
    return this.lowestBufferLevel;
  }

  /** @returns {boolean} Whether any content has been queued. */
  get hasPlayingContent() {
    return this.hasPlayingContentInternal;
  }

  /** @returns {*} Initial playback time. */
  get initialPlaybackTime() {
    return this.getInitialPlaybackTime();
  }

  /**
   * The branch whose time range contains the current playback position.
   * @returns {object}
   */
  get currentBranch() {
    const position = this.currentPosition;
    const branch = this.findBranchForPosition(position, false);
    if (DEBUG) {
      softAssert(branch, `Could not find current branch for ${position.playbackSegment}`);
    }
    return branch;
  }

  /** @returns {object} The first branch in the pipeline. */
  get firstBranch() {
    return this.branches[0];
  }

  /** @returns {object|undefined} The last branch, if content is queued. */
  get lastBranch() {
    return this.hasPlayingContent
      ? this.branches[this.branches.length - 1]
      : undefined;
  }

  /**
   * The branch that is currently presenting (closest to playback position).
   * @returns {object}
   */
  get presentingBranch() {
    const position = this.currentPosition;
    const branch = this.findPresentingBranch(position);
    softAssert(branch, `Could not find presenting branch for ${position.playbackSegment}`);
    return branch;
  }

  /** @returns {boolean} Whether at least one branch exists. */
  get hasBranches() {
    return this.branches.length > 0;
  }

  // ──────────────────────────────────────────────
  //  Lifecycle stubs (overridden in subclasses)
  // ──────────────────────────────────────────────

  /** No-op: DRM ready notification. */
  onDrmReady() {}

  /** No-op: DRM not-ready notification. */
  onDrmNotReady() {}

  /** @returns {boolean} Always false in the base. */
  parseData() {
    return false;
  }

  /**
   * @returns {boolean} Whether the pipeline has active branches.
   */
  isStreamActive() {
    return this.branches.length > 0;
  }

  /**
   * Return the presenting branch, asserting that branches exist.
   * @returns {object}
   */
  getStreamState() {
    softAssert(
      this.branches.length > 0,
      "Could not find presenting branch. Player has no branches."
    );
    return this.presentingBranch;
  }

  /**
   * Check whether a given branch is registered with this pipeline.
   * @param {object} branch
   * @returns {boolean}
   */
  containsBranch(branch) {
    return this.branches.indexOf(branch) !== -1;
  }

  /**
   * Attempt to claim a playgraph from a prefetch pipeline.
   * @returns {boolean} True if the claim succeeded.
   */
  claimFromPrefetch() {
    return this.playgraph === undefined;
  }

  /** No-op. */
  clearReferences() {}

  /** No-op. */
  destroy() {}

  // ──────────────────────────────────────────────
  //  Position / segment resolution
  // ──────────────────────────────────────────────

  /**
   * Find the closest segment position within the branch list for a given
   * content-time reference.
   *
   * @param {object} segmentRef - { M: segmentId, offset: TimeUtil }
   * @returns {TimeUtil|undefined}
   */
  resolveSegmentPosition(segmentRef) {
    const matching = this.branches.filter(
      (b) => b.currentSegment.id === segmentRef.M
    );
    if (matching.length === 0) return;

    const initialTime = this.getInitialPlaybackTime();
    let closest = new TimeUtil(Infinity, 1);

    matching.forEach((branch) => {
      const candidate = branch.boxTimestamp.item(segmentRef.offset);
      if (initialTime.qw(candidate).lessThan(initialTime.qw(closest))) {
        closest = candidate;
      }
    });

    return closest;
  }

  /**
   * Generator that yields { No, qw } for each branch matching a segment ref.
   * Used for iterating over all candidate positions.
   *
   * @param {object} segmentRef
   * @yields {{ No: TimeUtil, qw: TimeUtil }}
   */
  *iterateSegmentPositions(segmentRef) {
    const matching = this.branches.filter(
      (b) => b.currentSegment.id === segmentRef.M
    );
    if (matching.length === 0) return;

    const initialTime = this.getInitialPlaybackTime();
    for (const branch of matching) {
      const position = branch.boxTimestamp.item(segmentRef.offset);
      const relative = initialTime.qw(position);
      yield { No: position, qw: relative };
    }
  }

  /**
   * Resolve a playback position to a segment reference (segment id + offset).
   *
   * @param {TimeUtil}  position
   * @param {boolean}  [useLast=false] - If true, fall back to the last branch.
   * @returns {{ M: string, offset: TimeUtil }|undefined}
   */
  resolvePositionToSegment(position, useLast = false) {
    const branch = this.findPresentingBranch(position, useLast);
    if (!branch) return;

    const segment = branch.currentSegment;
    const segmentId = segment.id;
    const segmentDuration = segment.offset;
    const offset = TimeUtil.min(
      position.lowestWaterMarkLevelBufferRelaxed(
        segment.startTime.item(branch.qualityDescriptor)
      ),
      segmentDuration
    );
    return { M: segmentId, offset };
  }

  /**
   * Find the branch (and its reference) for a segment position, choosing
   * the one closest to initial time.
   *
   * @param {object} segmentRef
   * @returns {object|undefined} The matched branch.
   */
  findBranchForSegment(segmentRef) {
    const matching = this.branches.filter(
      (b) => b.currentSegment.id === segmentRef.M
    );
    if (matching.length === 0) return;

    const initialTime = this.getInitialPlaybackTime();
    let closest = new TimeUtil(Infinity, 1);
    let result;

    matching.forEach((branch) => {
      const candidate = branch.boxTimestamp.item(segmentRef.offset);
      if (initialTime.qw(candidate).lessThan(initialTime.qw(closest))) {
        closest = candidate;
        result = branch;
      }
    });

    return result;
  }

  /** No-op: DRM viewable assignment. */
  setDrmViewable() {}

  /**
   * Reset by clearing all branches.
   */
  create() {
    this.clearAllBranches();
  }

  /** No-op placeholder. */
  v4a() {}

  /** No-op placeholder. */
  I3() {}

  /** @returns {boolean} Always false. */
  get sV() {
    return false;
  }

  /**
   * Immediately execute a queued async file callback.
   * @param {function} callback
   */
  queueFileAsync(callback) {
    callback();
  }

  // ──────────────────────────────────────────────
  //  Pause / Resume
  // ──────────────────────────────────────────────

  /**
   * Pause downloads for the specified media types.
   *
   * @param {number[]} [mediaTypes=ALL_MEDIA_TYPES]
   */
  pause(mediaTypes = ALL_MEDIA_TYPES) {
    this.pausedMediaTypes = mediaTypes?.reduce((acc, mt) => {
      if (acc.indexOf(mt) === -1) acc.push(mt);
      return acc;
    }, this.pausedMediaTypes);
  }

  /**
   * Resume downloads for the specified media types.
   *
   * @param {number[]} [mediaTypes=ALL_MEDIA_TYPES]
   */
  resume(mediaTypes = ALL_MEDIA_TYPES) {
    const self = this;
    mediaTypes.forEach((mt) => {
      const idx = self.pausedMediaTypes.indexOf(mt);
      if (idx !== -1) self.pausedMediaTypes.splice(idx, 1);
    });
  }

  /**
   * Transfer this pipeline's branches and state to another pipeline,
   * pausing all downloads first.
   *
   * @param {BaseStreamPipeline} target
   * @returns {boolean} Whether the transfer succeeded.
   */
  transferTo(target) {
    softAssert(this.playgraph);
    softAssert(target !== this);
    this.pauseAllPipelines();
    const claimed = target.claimFromPrefetch(this.playgraph, this);
    if (claimed) {
      target.pause(this.pausedMediaTypes);
      target.addBranches(...this.branches);
      this.onPlaygraphDestroyed(this.playgraph);
    }
    return claimed;
  }

  /**
   * Register one or more branches with this pipeline, emitting a
   * "segmentAppended" event for each.
   *
   * @param {...object} newBranches
   */
  addBranches(...newBranches) {
    for (const branch of newBranches) {
      this.events.emit("segmentAppended", {
        type: "segmentAppended",
        M: branch.currentSegment.id,
        branchId: branch.branchId,
      });
    }
  }

  // ──────────────────────────────────────────────
  //  Internal helpers
  // ──────────────────────────────────────────────

  /**
   * Get the initial playback time from the first branch.
   * @returns {TimeUtil}
   */
  getInitialPlaybackTime() {
    return this.getFirstBranchTime();
  }

  /**
   * @returns {TimeUtil}
   * @private
   */
  getFirstBranchTime() {
    if (DEBUG) {
      softAssert(this.hasPlayingContent, "Attempted to get initial time before any branches were queued");
    }
    const [first] = this.branches;
    if (DEBUG) softAssert(first);
    return first.timestamp || first.lI;
  }

  /**
   * Default playback rate.
   * @returns {number}
   */
  getPlaybackRate() {
    return 1;
  }

  /** No-op: subclass override point. */
  $L() {}

  /**
   * Find the presenting branch for a given position, optionally falling
   * back to the last branch.
   *
   * @param {TimeUtil}  position
   * @param {boolean}  [useLast=false]
   * @returns {object|undefined}
   * @private
   */
  findPresentingBranch(position, useLast = false) {
    if (!this.hasPlayingContent) return;
    const initial = this.getFirstBranchTime();
    if (position.lessThan(initial)) return this.branches[0];
    return findBranchForPosition(this.branches, position) || (useLast ? this.currentTrackInfo : undefined);
  }

  /**
   * Aggregate buffer status across all branches (until one has no more segments).
   *
   * @returns {object} Cumulative buffer status keyed by category.
   * @private
   */
  aggregateBufferStatus() {
    const result = {};
    for (const branch of this.branches) {
      const status = branch.getBufferStatus();
      for (const key in status) {
        const value = status[key];
        if (value) {
          result[key] = (result[key] ?? 0) + value;
        }
      }
      if (!branch.hasMoreSegments) break;
    }
    return result;
  }
}

export { BaseStreamPipeline, MediaTypeDownloadState, StreamSwitchability };
