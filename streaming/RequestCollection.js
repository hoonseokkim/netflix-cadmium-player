/**
 * Netflix Cadmium Player - RequestCollection
 * Webpack Module 21306 (exported as `l$a`)
 *
 * A partitioned collection that organizes media download requests into three
 * ordered buckets based on their lifecycle state:
 *
 *   0 = **complete** — requests whose data has been fully received
 *   1 = **active**   — requests currently downloading
 *   2 = **pending**  — requests queued but not yet started
 *
 * Extends `PartitionedCollection` (Module 99735) to add media-aware bookkeeping:
 * - Tracks total received bytes across all non-aborted requests
 * - Maintains a `ContiguousRange` (Module 5800 / `WF`) that records the
 *   contiguous time span covered by the collected segments
 * - Provides convenience accessors for content start/end PTS, timescale,
 *   metadata, and segment boundaries
 * - Automatically promotes a request from the "active" partition to "complete"
 *   when it finishes and its start PTS is contiguous with the complete partition
 * - Implements request lifecycle callbacks: `onRequestActive`,
 *   `onDataReceived`, `onRequestComplete`, `onRequestRedirectedBranch`,
 *   `onContentLengthChanged`
 * - Exposes `removeAbortedRequests()` to prune dead entries
 *
 * The owning pipeline (the consumer from the module that creates
 * `new f.l$a(console, this)`) delegates segment bookkeeping to this collection.
 *
 * Original obfuscated export: `l$a`
 *
 * @module RequestCollection
 */

// -- Dependencies (resolved by the webpack bundler at runtime) --
// import { __extends, __read, __spreadArray } from '../modules/Module_22970.js';  // tslib
// import { assert }                           from '../modules/Module_52571.js';  // assertion
// import { PartitionedCollection }            from '../modules/Module_99735.js';  // base class (internal_Uab)
// import { outputList }                       from '../modules/Module_85254.js';  // mixin applicator
// import { RequestList (mja) }                from '../modules/Module_71472.js';  // ordered request list
// import { processingContext }                from '../modules/Module_71808.js';  // processing context mixin
// import { bP as BranchCallbackHandler }      from '../modules/Module_81392.js';  // branch callback mixin
// import { ContiguousRange (WF) }             from '../modules/Module_5800.js';   // contiguous range tracker

import { __extends, __read, __spreadArray } from '../modules/Module_22970.js';
import { assert } from '../modules/Module_52571.js';
import { internal_Uab as PartitionedCollection } from '../modules/Module_99735.js';
import { outputList } from '../modules/Module_85254.js';
import { mja as RequestList } from '../modules/Module_71472.js';
import { processingContext } from '../modules/Module_71808.js';
import { bP as BranchCallbackHandler } from '../modules/Module_81392.js';
import { WF as ContiguousRange } from '../modules/Module_5800.js';

/**
 * Partition index constants for request states.
 * @enum {number}
 */
const Partition = Object.freeze({
  COMPLETE: 0,
  ACTIVE: 1,
  PENDING: 2,
});

/**
 * Determines which partition bucket a request belongs in.
 *
 * @param {Object} request            - The media request object
 * @param {boolean} request.complete  - Whether the request has finished downloading
 * @param {boolean} request.active    - Whether the request is currently downloading
 * @returns {number} Partition index (0 = complete, 1 = active, 2 = pending)
 */
function classifyRequest(request, collection) {
  if (request.complete) {
    // A completed request that doesn't yet overlap with the contiguous end
    // stays in the active bucket to preserve ordering.
    return collection.empty || request.contentStartTicks <= collection.contiguousEndPts
      ? Partition.COMPLETE
      : Partition.ACTIVE;
  }
  return request.active ? Partition.ACTIVE : Partition.PENDING;
}

/**
 * A partitioned, ordered collection of media download requests.
 *
 * Requests are automatically sorted into three internal sub-lists (complete,
 * active, pending) based on their download state. The collection tracks total
 * bytes received and maintains a contiguous time-range object.
 */
class RequestCollection extends PartitionedCollection {
  /**
   * @param {Object} logger   - Scoped console / logger instance
   * @param {Object} pipeline - The owning pipeline (receives lifecycle events)
   */
  constructor(logger, pipeline) {
    const completedList = new RequestList(logger);
    const activeList = new RequestList(logger);
    const pendingList = new RequestList(logger);

    super(
      [completedList, activeList, pendingList],
      (request) => classifyRequest(request, self),
    );

    // `self` is captured for the classifier closure (mirrors the original
    // pattern where the constructor referenced `q` before super returned).
    const self = this;

    const [complete, active, pending] = [completedList, activeList, pendingList];

    /** @type {RequestList} Requests that have been fully downloaded */
    this._completeList = complete;

    /** @type {RequestList} Requests currently being downloaded */
    this._activeList = active;

    /** @type {RequestList} Requests queued but not yet started */
    this._pendingList = pending;

    /** @type {number} Total bytes received across all non-aborted requests */
    this._receivedBytes = 0;

    /** @type {number} Count of aborted requests seen */
    this._abortedCount = 0;

    /** @type {Object} Scoped logger */
    this.console = logger;

    /** @type {Object} Owning pipeline reference */
    this._pipeline = pipeline;

    /** @type {ContiguousRange|undefined} Contiguous time-range tracker */
    this._contiguousRange = undefined;
  }

  // ---------------------------------------------------------------------------
  // Size / byte accessors
  // ---------------------------------------------------------------------------

  /**
   * Total number of items across all three partitions (delegates to sub-lists'
   * `.la` property which tracks content-length / byte totals).
   * @type {number}
   */
  get totalContentLength() {
    return this._completeList.la + this._activeList.la + this._pendingList.la;
  }

  /**
   * The pending (unsent) partition.
   * @type {RequestList}
   */
  get pendingRequests() {
    return this._pendingList;
  }

  /**
   * The active (downloading) partition.
   * @type {RequestList}
   */
  get activeRequests() {
    return this._activeList;
  }

  /**
   * The complete (fully downloaded) partition.
   * @type {RequestList}
   */
  get completeRequests() {
    return this._completeList;
  }

  /**
   * Total received bytes across all non-aborted requests.
   * @type {number}
   */
  get receivedBytes() {
    return this._receivedBytes;
  }

  /**
   * Bytes in the complete partition only.
   * @type {number}
   */
  get completedBytes() {
    return this._completeList.la;
  }

  /**
   * Bytes in complete + active partitions minus already-accounted received bytes.
   * This represents "useful" buffered bytes not yet fully committed.
   * @type {number}
   */
  get bufferedBytes() {
    return this._completeList.la + this._activeList.la - this._receivedBytes;
  }

  /**
   * Content length of the pending partition.
   * @type {number}
   */
  get pendingContentLength() {
    return this._pendingList.la;
  }

  /**
   * Total content length minus received bytes — i.e. outstanding bytes.
   * @type {number}
   */
  get outstandingBytes() {
    return this.totalContentLength - this._receivedBytes;
  }

  // ---------------------------------------------------------------------------
  // First / last element accessors
  // ---------------------------------------------------------------------------

  /**
   * First request across all partitions (earliest by insertion order).
   * @type {Object|undefined}
   */
  get first() {
    return this.wuc();
  }

  /**
   * Last request across all partitions.
   * @type {Object|undefined}
   */
  get last() {
    return this.internal_Pdc();
  }

  /**
   * The earliest request when considering contiguous coverage. If the complete
   * list is non-empty, returns `this.first`. Otherwise, returns whichever of
   * the active or pending list starts earlier.
   * @type {Object|undefined}
   */
  get earliestContiguousRequest() {
    if (!this._completeList.empty || this._pendingList.empty || this._activeList.empty) {
      return this.first;
    }
    return this._activeList.contentStartTicks < this._pendingList.contentStartTicks
      ? this._activeList.first
      : this._pendingList.first;
  }

  /**
   * The latest request that extends the contiguous range, considering both
   * active and pending partitions.
   * @type {Object|undefined}
   */
  get latestContiguousRequest() {
    if (this._pendingList.empty || this._activeList.empty) {
      return this.networkInterruptionTime;
    }
    return this._activeList.contentEndTicks < this._pendingList.contentEndTicks
      ? this._pendingList.networkInterruptionTime
      : this._activeList.networkInterruptionTime;
  }

  /**
   * First item in the pending partition.
   * @type {Object|undefined}
   */
  get firstPendingRequest() {
    return this._pendingList.first;
  }

  // ---------------------------------------------------------------------------
  // Timescale / PTS accessors
  // ---------------------------------------------------------------------------

  /**
   * Timescale of the first request, if available.
   * @type {number|undefined}
   */
  get timescale() {
    return this.first && this.first.timescaleValue;
  }

  /**
   * Content start PTS of the earliest contiguous request.
   * @type {number|undefined}
   */
  get contentStartPts() {
    return this.earliestContiguousRequest && this.earliestContiguousRequest.contentStartTicks;
  }

  /**
   * Content end PTS of the latest contiguous request.
   * @type {number|undefined}
   */
  get contentEndPts() {
    return this.latestContiguousRequest && this.latestContiguousRequest.contentEndTicks;
  }

  /**
   * Cached metadata from the first request.
   * @type {Object|undefined}
   */
  get cachedMetadata() {
    return this.first && this.first.cachedMetadata;
  }

  /**
   * The PTS up to which the complete partition is contiguous.
   * If the complete list is empty, falls back to `contentStartTicks`.
   * @type {number|undefined}
   */
  get contiguousEndPts() {
    return this._completeList.empty
      ? this.contentStartTicks
      : this._completeList.contentEndTicks;
  }

  /**
   * Segment end time (playback segment) from the complete partition.
   * Falls back to `presentationStartTime.playbackSegment` when empty.
   * @type {number|undefined}
   */
  get segmentEndTime() {
    if (this._completeList.empty) {
      const startTime = this.presentationStartTime;
      return startTime === null || startTime === void 0 ? void 0 : startTime.playbackSegment;
    }
    return this._completeList.segmentEndTime.playbackSegment;
  }

  /**
   * Previous state's playback segment, from the complete partition or the
   * overall timestamp.
   * @type {number|undefined}
   */
  get previousSegment() {
    if (this._completeList.empty) {
      const ts = this.timestamp;
      return ts === null || ts === void 0 ? void 0 : ts.playbackSegment;
    }
    return this._completeList.previousState.playbackSegment;
  }

  /**
   * The previous playback segment from active or complete partitions.
   * @type {number|undefined}
   */
  get lastActiveOrCompleteSegment() {
    const activeState = this._activeList.previousState;
    const completeState = this._completeList.previousState;
    return (activeState === null || activeState === void 0 ? void 0 : activeState.playbackSegment)
      || (completeState === null || completeState === void 0 ? void 0 : completeState.playbackSegment);
  }

  // ---------------------------------------------------------------------------
  // Partition length accessors
  // ---------------------------------------------------------------------------

  /**
   * Number of pending (unsent) requests.
   * @type {number}
   */
  get pendingCount() {
    return this._pendingList.length;
  }

  /**
   * Number of active (downloading) requests.
   * @type {number}
   */
  get activeCount() {
    return this._activeList.length;
  }

  /**
   * Number of complete (downloaded) requests.
   * @type {number}
   */
  get completeCount() {
    return this._completeList.length;
  }

  /**
   * Concatenation of the complete and active partitions (excludes pending).
   * @type {Array}
   */
  get completedAndActive() {
    return this._completeList.concat(this._activeList);
  }

  /**
   * The contiguous range tracker.
   * @type {ContiguousRange|undefined}
   */
  get contiguousRange() {
    return this._contiguousRange;
  }

  // ---------------------------------------------------------------------------
  // Mutation hooks (called around push/shift/pop/splice)
  // ---------------------------------------------------------------------------

  /**
   * Bookkeeping performed before a request is added to the collection.
   * Updates received-byte counters and maintains the contiguous range.
   *
   * @param {Object} request - The request being added
   * @private
   */
  _onBeforeAdd(request) {
    if (request.aborted) {
      ++this._abortedCount;
    } else {
      this._receivedBytes += request.bytesReceived || 0;
    }

    if (this.empty) {
      // First request — initialise the contiguous range.
      this._contiguousRange = new ContiguousRange(this, {});
    } else if (request.contentStartTicks !== this.contentEndTicks) {
      if (request.contentStartTicks > this._contiguousRange.contentEndTicks) {
        // Gap detected — cap contiguous end at current boundary.
        this._contiguousRange.f4(this._contiguousRange.contentEndTicks);
      } else if (
        request.contentStartTicks < this.contentStartTicks ||
        request.contentStartTicks === this._contiguousRange.contentEndTicks
      ) {
        // Inserted before existing data — re-scan for contiguous end.
        let contiguousEnd = request.contentEndTicks;
        this.sortByComparator(
          (a, b) => a.contentStartTicks - b.contentStartTicks,
          (item) => {
            contiguousEnd = item.contentStartTicks === contiguousEnd
              ? item.contentEndTicks
              : contiguousEnd;
          },
        );
        if (contiguousEnd === Math.max(this.contentEndTicks, request.contentEndTicks)) {
          this._contiguousRange.tpa();
        } else {
          this._contiguousRange.f4(contiguousEnd);
        }
      }
    }

    request.G5a(this);
  }

  /**
   * Bookkeeping performed after a request is removed from the collection.
   * Adjusts received-byte counters and contiguous range.
   *
   * @param {Object} request - The request that was removed
   * @private
   */
  _onAfterRemove(request) {
    if (request.aborted) {
      --this._abortedCount;
    } else {
      this._receivedBytes -= request.bytesReceived;
    }

    if (this.empty) {
      this._contiguousRange = undefined;
    } else if (
      request.contentStartTicks !== this.contentEndTicks &&
      request.contentEndTicks <= this._contiguousRange.contentEndTicks &&
      request.contentStartTicks > this._contiguousRange.contentStartTicks
    ) {
      this._contiguousRange.f4(request.contentStartTicks);
    }

    request.uub();
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /**
   * Debug-only validation that asserts internal invariants.
   * Checks partition membership, byte totals, and contiguous-range consistency.
   */
  trimToEditBoundaries() {
    if (this.length === 0) {
      assert(this._receivedBytes === 0);
      assert(this._completeList.empty);
      assert(this._activeList.empty);
      assert(this._pendingList.empty);
    } else {
      // Every item in the complete partition must be complete or aborted.
      assert(this._completeList.every((r) => r.complete || r.aborted));
      // Every item in the active partition must be active, complete, or aborted.
      assert(this._activeList.every((r) => r.active || r.complete || r.aborted));
      // Every item in the pending partition must be neither active nor complete.
      assert(this._pendingList.every((r) => !r.active && !r.complete));

      // If the active list has completed items, verify ordering.
      if (!this._activeList.empty && this._activeList.first.complete) {
        if (this._completeList.empty) {
          assert(
            !this._pendingList.empty &&
              this._activeList.contentStartTicks > this._pendingList.contentStartTicks,
            'unsent earlier than active',
          );
        } else {
          assert(
            this._activeList.contentStartTicks > this._completeList.contentEndTicks,
            'gap in complete array',
          );
        }
      }

      // Verify that receivedBytes matches the sum of bytesReceived from
      // complete + active (non-aborted) requests.
      const expectedBytes =
        this._completeList.reduce((sum, r) => sum + (r.aborted ? 0 : r.bytesReceived), 0) +
        this._activeList.reduce((sum, r) => sum + (r.aborted ? 0 : r.bytesReceived), 0);
      if (this._receivedBytes !== expectedBytes) {
        assert(false, 'receivedBytes does not match complete + active');
      }

      // Verify contiguous range consistency.
      const range = this.internal_Caa;
      if (this.empty) {
        assert(range === undefined);
      } else {
        assert(range !== undefined);
        const sorted = this.map((r) => r);
        sorted.sort((a, b) => a.contentStartTicks - b.contentStartTicks);
        assert(range.contentStartTicks === sorted[0].contentStartTicks);

        let contiguousEnd = sorted[0].contentEndTicks;
        for (let i = 1; i < sorted.length && sorted[i].contentStartTicks === contiguousEnd; ++i) {
          contiguousEnd = sorted[i].contentEndTicks;
        }
        assert(range.contentEndTicks === contiguousEnd, 'contigousEnd mismatch');
      }

      // Recurse into sub-lists.
      this.ue.forEach((subList) => subList.trimToEditBoundaries());
    }
  }

  // ---------------------------------------------------------------------------
  // Refresh / re-partition
  // ---------------------------------------------------------------------------

  /**
   * Re-evaluates partition membership for all items and recalculates the
   * contiguous range from scratch.
   */
  update() {
    this._completeList.update();
    this._activeList.update();
    this._pendingList.update();

    if (this._contiguousRange) {
      const sorted = this.map((r) => r);
      sorted.sort((a, b) => a.contentStartTicks - b.contentStartTicks);
      this._contiguousRange.tpa();

      let contiguousEnd = sorted[0].contentEndTicks;
      for (let i = 1; i < sorted.length; ++i) {
        if (sorted[i].contentStartTicks !== contiguousEnd) {
          this._contiguousRange.f4(contiguousEnd);
          break;
        }
        contiguousEnd = sorted[i].contentEndTicks;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Collection mutation overrides
  // ---------------------------------------------------------------------------

  /**
   * Adds a request to the end of the appropriate partition.
   * @param {Object} request
   * @returns {number} New total length
   */
  push(request) {
    this._onBeforeAdd(request);
    return super.push(request);
  }

  /**
   * Removes and returns the first request.
   * @returns {Object|undefined}
   */
  shift() {
    const request = super.shift();
    if (request) this._onAfterRemove(request);
    return request;
  }

  /**
   * Removes and returns the last request.
   * @returns {Object|undefined}
   */
  pop() {
    const request = super.pop();
    if (request) this._onAfterRemove(request);
    return request;
  }

  /**
   * Adds a request to the front of the appropriate partition.
   * @param {Object} request
   * @returns {number} New total length
   */
  unshift(request) {
    this._onBeforeAdd(request);
    return super.unshift(request);
  }

  /**
   * Inserts a request at its sorted position.
   * @param {Object} request
   */
  insertNode(request) {
    this._onBeforeAdd(request);
    super.insertNode(request);
  }

  /**
   * Removes a specific request from the collection.
   * @param {Object} request
   * @returns {boolean} Whether the request was found and removed
   */
  remove(request) {
    if (!super.item(request)) return false;
    this._onAfterRemove(request);
    return true;
  }

  /**
   * Splice requests in/out of the collection.
   * @param {number} start  - Start index
   * @param {number} count  - Number of items to remove
   * @param {...Object} newRequests - Items to insert
   * @returns {Array} Removed items
   */
  splice(start, count, ...newRequests) {
    const removed = super.splice(start, count, ...__spreadArray([], __read(newRequests), false));
    newRequests.forEach(this._onBeforeAdd.bind(this));
    removed.forEach(this._onAfterRemove.bind(this));
    return removed;
  }

  // ---------------------------------------------------------------------------
  // Aborted-request cleanup
  // ---------------------------------------------------------------------------

  /**
   * Removes all aborted (and not already flagged as `NB`) requests from the
   * collection, invoking an optional callback for each removed request.
   *
   * @param {Function} [callback] - Called with `(request, index, collection)`
   *   for each removed aborted request
   */
  removeAbortedRequests(callback) {
    const self = this;
    this.reduce((ranges, request, index) => {
      if (request.aborted && !request.NB) {
        if (callback) callback(request, index, self);
        if (ranges.length === 0 || ranges[0].end !== index) {
          ranges.unshift({ start: index, end: index + 1 });
        } else {
          ranges[0].end += 1;
        }
      }
      return ranges;
    }, []).forEach((range) => {
      self.splice(range.start, range.end - range.start);
    });
  }

  // ---------------------------------------------------------------------------
  // Search helpers
  // ---------------------------------------------------------------------------

  /**
   * Finds the index of the request matching the given start PTS.
   * @param {number} startPts
   * @returns {number} Index, or -1 if not found
   */
  findByStartPts(startPts) {
    return this.eAb((subList) => subList.ZTa(startPts));
  }

  /**
   * Finds the index of the request matching the given end PTS.
   * @param {number} endPts
   * @returns {number} Index, or -1 if not found
   */
  findByEndPts(endPts) {
    return this.eAb((subList) => subList.iba(endPts));
  }

  /**
   * Returns the request whose end PTS matches, or undefined.
   * @param {number} endPts
   * @returns {Object|undefined}
   */
  getRequestByEndPts(endPts) {
    const index = this.findByEndPts(endPts);
    return index !== -1 ? this.key(index) : undefined;
  }

  /**
   * Returns all requests from the given index onward.
   * @param {number} startIndex
   * @returns {Array}
   */
  getRequestsFrom(startIndex) {
    const result = [];
    for (let i = startIndex; i < this.length; i++) {
      const request = this.key(i);
      if (request) result.push(request);
    }
    return result;
  }

  // ---------------------------------------------------------------------------
  // Request lifecycle callbacks
  // ---------------------------------------------------------------------------

  /**
   * Called when a request transitions to the active (downloading) state.
   * Moves it to the active partition and notifies the sub-list.
   *
   * @param {Object} request
   */
  onRequestActive(request) {
    this.move(request);
    this.wba(request);
  }

  /**
   * Called when data is received for an active request.
   * Updates the received-bytes counter.
   *
   * @param {Object} request
   * @param {number} bytesReceived
   */
  onDataReceived(request, bytesReceived) {
    this._receivedBytes += bytesReceived;
    this.onDataReceived(request, bytesReceived);
  }

  /**
   * Called when a request has completed downloading.
   * Updates byte counters and promotes contiguous completed requests.
   *
   * @param {Object} request
   * @param {number} bytesReceived
   */
  onRequestComplete(request, bytesReceived) {
    this._receivedBytes += bytesReceived;
    this._promoteCompletedRequests();
    this.onRequestCompleted(request, bytesReceived);
  }

  /**
   * Called when a request is aborted and redirected to a different branch.
   *
   * @param {Object} request        - The aborted request
   * @param {*} newBranch           - Target branch
   * @param {*} reason              - Redirect reason
   */
  onRequestRedirectedBranch(request, newBranch, reason) {
    this._receivedBytes -= request.bytesReceived;
    ++this._abortedCount;
    this.j0(request, newBranch, reason);
  }

  /**
   * Called when the content-length header for a request is updated.
   *
   * @param {Object} request     - The affected request
   * @param {number} newLength   - New content length
   * @param {number} oldLength   - Previous content length
   */
  onContentLengthChanged(request, newLength, oldLength) {
    this._activeList.G2c(newLength - oldLength);
    this.zUa(request, newLength, oldLength);
  }

  /**
   * Called externally to trigger promotion of completed requests.
   */
  pNc() {
    this._promoteCompletedRequests();
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  /**
   * Moves requests from the active partition into the complete partition as
   * long as they are contiguous with the existing complete set.
   * @private
   */
  _promoteCompletedRequests() {
    while (
      this._activeList.first &&
      (this._activeList.first.complete || this._activeList.first.NB) &&
      (this._completeList.empty
        ? this._activeList.first === this.earliestContiguousRequest
        : this._activeList.first.contentStartTicks === this._completeList.contentEndTicks)
    ) {
      this.qYc();
    }
  }

  /**
   * Returns diagnostic info about the completed requests (request IDs,
   * append status).
   * @returns {Array<{requestId: string, appended: boolean, isAppendable: boolean}>}
   */
  getCompletedRequestInfo() {
    return this._completeList.map((request) => ({
      requestId: request.getRequestId(),
      appended: request.appended,
      isAppendable: request.canAppend(),
    }));
  }
}

export { RequestCollection };

// Apply the BranchCallbackHandler and processingContext mixins.
outputList(BranchCallbackHandler, RequestCollection, false);
outputList(processingContext, RequestCollection);
