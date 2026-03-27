/**
 * Netflix Cadmium Player - MediaRequestPipeline
 * Webpack Module 99021 (exported as `eKa`)
 *
 * Per-media-type pipeline that manages the full lifecycle of media fragment
 * requests. Extends BranchPipeline to provide request creation, queuing,
 * attachment to the source buffer, pruning, and abandonment.
 *
 * Each media type (audio, video, text, supplementary) gets its own
 * MediaRequestPipeline instance. The pipeline coordinates between the
 * stream selector (which picks streams/bitrates), the append queue
 * (which feeds fragments to the SourceBuffer), and the request list
 * (which tracks in-flight and completed requests).
 *
 * Key concepts:
 * - Request lifecycle: create -> enqueue -> attach -> append -> prune
 * - Attach index (_attachIndex): tracks how far through the request list
 *   we have attached fragments to the append queue
 * - Append queue: ordered queue of fragments waiting to be appended to
 *   the SourceBuffer
 * - Branch pruner: scheduled task that evicts old, already-appended
 *   requests to free memory
 * - Abandonment: optionally abort in-flight requests that are stale
 *   relative to current playback position
 *
 * Original obfuscated name: class `v` / `a` in Module 99021
 */

// Dependencies (webpack module references):
// import { __extends, __generator, __decorate, __importStar } from './Module_22970';  // 22970 - tslib helpers
// import * as TypeUtil from './Module_17267';         // 17267 - type checking utilities (wc, isUndefined)
// import { TimeUtil } from './Module_91176';          // 91176 - time utilities
// import { HCa } from './Module_47743';               // 47743 - media request factory (HCa.create)
// import { l$a } from './Module_21306';               // 21306 - RequestList constructor
// import { bP as BranchPipeline } from './Module_81392'; // 81392 - BranchPipeline base class
// import { MediaType } from './Module_65161';         // 65161 - media type enum
// import { assert } from './Module_52571';            // 52571 - assertion utility
// import { RJ as AppendQueue } from './Module_89645'; // 89645 - AppendQueue (readInt32 -> appendQueue)
// import { completionState, ie } from './Module_40666'; // 40666 - task/scheduler utilities
// import { o0 } from './Module_97757';                // 97757 - decorator
// import { CBb } from './Module_27977';               // 27977 - profile helper
// import { kP } from './Module_3033';                 // 3033  - MediaPipelineFactory singleton
// import { yDb } from './Module_58418';               // 58418 - attachment threshold calculator

/**
 * @class MediaRequestPipeline
 * @extends BranchPipeline
 * @description Manages media fragment requests for a single media type,
 *   coordinating download, queuing, SourceBuffer attachment, and pruning.
 */
class MediaRequestPipeline extends BranchPipeline {
  /**
   * @param {Object} pipelineId - Pipeline/branch identifier passed to BranchPipeline
   * @param {Object} config - Pipeline configuration (max requests, thresholds, etc.)
   * @param {Object} console - Scoped logger instance
   * @param {Object} streamSelector - Stream selector for notifying about released requests
   * @param {Object} innerViewable - Viewable state; checks readiness for playback
   * @param {string} mediaType - One of MediaType.VIDEO, AUDIO, TEXT, SUPPLEMENTARY
   * @param {Object} [scheduler] - Optional scheduler for creating the prune task
   * @param {Object} metadataProvider - Metadata provider for request creation
   */
  constructor(pipelineId, config, console, streamSelector, innerViewable, mediaType, scheduler, metadataProvider) {
    super(pipelineId);

    /** @type {Object} Pipeline configuration */
    this.config = config;

    /** @type {Object} Scoped logger */
    this.console = console;

    /** @type {Object} Stream selector that receives released-request notifications */
    this.streamSelector = streamSelector;

    /** @type {Object} Viewable state object */
    this.innerViewable = innerViewable;

    /** @type {string} Media type this pipeline handles */
    this.mediaType = mediaType;

    /** @type {Object} Metadata provider for request creation */
    this.metadataProvider = metadataProvider;

    /** @type {AppendQueue} Queue of fragments to be appended to SourceBuffer */
    this.appendQueue = new AppendQueue(this.console);

    /** @type {Function} Bound error logger */
    this.error = this.console.error.bind(this.console);

    /** @type {Function} Bound retry logger */
    this.RETRY = this.console.RETRY.bind(this.console);

    /** @type {Function} Bound pause-trace logger */
    this.pauseTrace = this.console.pauseTrace.bind(this.console);

    // Initialize request state (requestList, _attachIndex, etc.)
    this._resetRequestState();

    /** @type {Object|undefined} Scheduled task that runs the prune loop */
    this.branchPruner = scheduler?.createScheduledTask(() => {
      return this._runPruneLoop();
    }, 'pruner');
  }

  // =========================================================================
  // Getters (property accessors)
  // =========================================================================

  /**
   * The inner viewable state.
   * @type {Object}
   */
  get ma() {
    return this.innerViewable;
  }

  /**
   * Whether any requests have been created (requestCount > 0).
   * @type {boolean}
   */
  get hasRequests() {
    return this.requestCount > 0;
  }

  /**
   * Whether no request data has been received yet.
   * @type {boolean}
   */
  get isAwaitingFirstData() {
    return !this._hasReceivedData;
  }

  /**
   * Total number of requests in the request list.
   * @type {number}
   */
  get requestCount() {
    return this.requestList.length;
  }

  /**
   * Number of in-flight (pending) requests.
   * @type {number}
   */
  get pendingRequestCount() {
    return this.requestList.JO;
  }

  /**
   * Whether the append queue is complete (all fragments appended).
   * @type {boolean}
   */
  get isQueueComplete() {
    return this.appendQueue.mI;
  }

  /**
   * The last completed request's previous state.
   * @type {Object}
   */
  get lastCompletedState() {
    return this.requestList.complete.previousState;
  }

  /**
   * The buffered end position (internal_Uub).
   * @type {number}
   */
  get bufferedEnd() {
    return this.requestList.internal_Uub;
  }

  /**
   * Request interest count (ric).
   * @type {number}
   */
  get requestInterestCount() {
    return this.requestList.ric;
  }

  /**
   * The request list's previous state.
   * @type {Object}
   */
  get previousState() {
    return this.requestList.previousState;
  }

  /**
   * Gap between previous state and timestamp positions (in playback segment units).
   * Returns 0 if timestamp is undefined.
   * @type {number}
   */
  get bufferGap() {
    return this.requestList.timestamp === undefined
      ? 0
      : this.requestList.previousState.playbackSegment - this.requestList.timestamp.playbackSegment;
  }

  /**
   * Buffer status: total duration and amount ahead of current position.
   * @type {{ la: number, G: number }}
   */
  get bufferStatus() {
    return {
      la: this.requestList.ypa,
      G: this.requestList.empty
        ? 0
        : Math.max(this.requestList.internal_Uub - this.requestList.timestamp.playbackSegment, 0),
    };
  }

  /**
   * Total buffered duration (ypa).
   * @type {number}
   */
  get totalBufferedDuration() {
    return this.requestList.ypa;
  }

  /**
   * Buffer level (la) from the request list.
   * @type {number}
   */
  get bufferLevel() {
    return this.requestList.la;
  }

  /**
   * Total request count including pending (bn + JO).
   * @type {number}
   */
  get totalRequestAndPendingCount() {
    return this._computeTotalRequestAndPendingCount();
  }

  /**
   * Whether there are more requests than pending (i.e., some are completed).
   * @type {boolean}
   */
  get hasCompletedRequests() {
    return this.requestList.length > this.requestList.JO;
  }

  /**
   * Count of active branches (bn).
   * @type {number}
   */
  get activeBranchCount() {
    return this.requestList.bn;
  }

  /**
   * The last attached request.
   * @type {Object|undefined}
   */
  get lastAttachedRequest() {
    return this._lastAttachedRequest;
  }

  /**
   * Whether any request has been attached.
   * @type {boolean}
   */
  get hasAttachedRequest() {
    return this._lastAttachedRequest !== undefined;
  }

  /**
   * The underlying request list.
   * @type {Object}
   */
  get requestListRef() {
    return this.requestList;
  }

  // =========================================================================
  // Lifecycle methods
  // =========================================================================

  /**
   * Cancel all streaming activity. Aborts in-flight requests, notifies the
   * stream selector, resets state, flushes the append queue, and destroys
   * the prune task.
   *
   * @param {boolean} deferred - If true, defer the abort/dispose to the next tick
   */
  cancelStreaming(deferred) {
    const self = this;
    const requests = this.requestList;

    function doCancel() {
      const copies = requests.map(r => r);
      if (copies.length > 0) {
        self.streamSelector.internal_Kwa(copies);
      }
      requests.forEach(r => {
        r.abort();
        r.dispose();
      });
    }

    if (deferred) {
      setTimeout(doCancel, 1);
    } else {
      doCancel();
    }

    this._resetRequestState();
    this.appendQueue.prioritizeBranch();
    this.branchPruner?.destroy();
  }

  /**
   * Reset the pipeline: cancel streaming and clear the append queue sentinel.
   */
  create() {
    this.cancelStreaming();
    this.appendQueue.AQb();
  }

  /**
   * Closing hook: flush the append queue.
   */
  closing() {
    this.appendQueue.prioritizeBranch();
  }

  /**
   * Mark the request cache as eligible for pruning on the next
   * notifyLastRequest() call.
   */
  pruneRequestCache() {
    this._pruneEligible = true;
  }

  // =========================================================================
  // Diagnostics
  // =========================================================================

  /**
   * Returns diagnostic information about the append queue and request state.
   * @returns {Object} Diagnostic snapshot
   */
  getQueueDiagnostics() {
    return {
      endMarked: this.appendQueue.length !== undefined,
      queueCount: this.appendQueue.length,
      isComplete: this.appendQueue.mI,
      itemCount: this.appendQueue.internal_Vub,
      continuousEndPts: this.appendQueue.buildPath().reduce((acc, entry) => {
        if (entry && !entry.done) {
          const val = entry.value;
          if (Math.abs(val.contentStart.playbackSegment - acc) < 100 || acc === -1) {
            return val.contentEnd.playbackSegment;
          }
        }
        return acc;
      }, -1),
      sentinelItemCount: this.appendQueue.buildPath().filter(entry => entry && entry.done).length,
      processedCount: this.appendQueue.eoc,
      rc: this.requestCount,
    };
  }

  /**
   * Returns internal state for debugging/serialization.
   * @returns {Object}
   */
  internal_Pvc() {
    return {
      completedRequests: this.requestList.internal_Qvc(),
    };
  }

  // =========================================================================
  // Request creation and management
  // =========================================================================

  /**
   * Create a new media fragment request from a record, add it to the request
   * list, and return it.
   *
   * @param {Object} record - The download record (must not have a header)
   * @param {Object} streamInfo - Stream information containing the track
   * @param {Object} context - Creation context
   * @returns {Object} The newly created request
   */
  serializeRecord(record, streamInfo, context) {
    const cfg = this.config;
    assert(!record.header);

    let request = HCa.create(
      context,
      cfg,
      streamInfo.track,
      record,
      this.requestList,
      this.isLive.currentSegment,
      this.console,
      this.metadataProvider
    );

    // If the new request's start time doesn't match the list's end time, adjust it
    if (
      this.requestList.length &&
      this.requestList.segmentEndTime &&
      !request.presentationStartTime.equal(this.requestList.segmentEndTime)
    ) {
      request.vWb(this.requestList.segmentEndTime);
    }

    this._addRequest(request);
    return request;
  }

  /**
   * Insert a request into the request list and update pipeline state.
   * Restarts the prune task if it was idle, and marks data as received.
   *
   * @param {Object} request - The media request to add
   * @private
   */
  _addRequest(request) {
    this.requestList.insertNode(request);

    // Restart pruner if it completed
    if (this.branchPruner?.state === completionState.complete) {
      this.branchPruner?.reuseOnErrorCacheSize();
    }

    this._markDataReceived();

    // Sentinel/EOS requests reset the received-data flag
    if (request.stateInfo) {
      this._hasReceivedData = false;
    }
  }

  /**
   * Returns an iterator over the append queue entries.
   * @returns {Iterator}
   */
  getRequestIterator() {
    return this.appendQueue.ase_Yra();
  }

  /**
   * If all requests have been attached and pruning is eligible, flush
   * the append queue.
   */
  notifyLastRequest() {
    if (this._attachIndex === this.requestList.length && this._pruneEligible) {
      this.appendQueue.prioritizeBranch();
    }
  }

  // =========================================================================
  // Request attachment (append queue feeding)
  // =========================================================================

  /**
   * Walk the request list from _attachIndex and enqueue appendable requests
   * into the append queue. Handles missing-segment replacement (padding) and
   * respects the max-attach-per-activation config.
   *
   * @returns {Promise<void>} Resolves when all enqueued requests are attached
   */
  tryAttachRequests() {
    let result = Promise.resolve();

    // Bail if not ready for playback or already fully attached
    if (
      !this.innerViewable.isReadyForPlayback(this.mediaType) ||
      this._attachIndex === this.requestList.length
    ) {
      return result;
    }

    const maxAttach = this.config.maxRequestsToAttachOnBranchActivation;
    let attachedCount = 0;
    const toEnqueue = [];

    while (this._attachIndex < this.requestList.length) {
      const request = this.requestList.key(this._attachIndex);

      if (request) {
        if (request.NB) {
          // Missing segment
          if (this.config.enableMissingSegmentsReplacement) {
            toEnqueue.push(...this._providePaddingFragments(request));
          } else {
            break;
          }
        } else {
          // Normal request - check ordering and appendability
          if (
            this.requestList.CAb &&
            this.requestList.CAb.contentStartTicks < request.contentStartTicks
          ) {
            break;
          }
          if (!request.canAppend()) {
            break;
          }
          toEnqueue.push(request);
        }

        ++attachedCount;

        // Track the first attach start time
        if (!TypeUtil.wc(this._firstAttachPts)) {
          this._firstAttachPts = request.timestamp?.playbackSegment;
        }
      }

      ++this._attachIndex;

      if (!TypeUtil.isUndefined(maxAttach) && attachedCount >= maxAttach) {
        break;
      }
    }

    if (toEnqueue.length) {
      // Clear sentinel if present
      if (this.appendQueue.length !== undefined) {
        this.error('tryToAtach() but requestQueue has sentinel:', this.appendQueue.length);
        this.appendQueue.AQb();
      }

      result = Promise.all(
        toEnqueue.map(request =>
          this.appendQueue.enqueue(request).then(() => this._onRequestAttached(request))
        )
      );

      this.notifyLastRequest();
    }

    return result;
  }

  /**
   * Track the most recently attached request.
   * @param {Object} request
   * @private
   */
  _onRequestAttached(request) {
    this._lastAttachedRequest = request;
  }

  // =========================================================================
  // Request abandonment
  // =========================================================================

  /**
   * Abandon requests that are stale relative to the current playback position.
   * Walks the pending request list in reverse and aborts any request whose
   * timestamp is behind the current partial player timestamp.
   *
   * @param {Function} [callback] - Optional callback receiving the array of abandoned requests
   */
  abandonStaleRequests(callback) {
    const self = this;
    const abandoned = [];

    if (this.requestList.JO === 0) {
      return;
    }

    const currentTimestamp = this.requestList.actualPartialPlayerTimestamp;

    this.requestList.jWb.q6a(request => {
      // Skip sentinel/EOS requests and requests ahead of playback
      if (request.stateInfo || currentTimestamp > request.timestamp?.playbackSegment) {
        return true;
      }

      if (request.xn) {
        this._hasReceivedData = false;
      }

      if (!self._abortRequest(request)) {
        self.RETRY('request abort failed:', request.toString());
        return true;
      }

      abandoned.unshift(request);
    });

    this._purgeAbortedRequests();

    if (abandoned.length && typeof callback === 'function') {
      callback(abandoned);
    }
  }

  /**
   * Mark a request as missing-segment, abort it, recalculate the request
   * list, and try to attach new requests.
   *
   * @param {Object} request - The request to mark as missing
   */
  markRequestMissing(request) {
    request.NB = true;
    request.abort();
    this.requestList.pNc();
    this.tryAttachRequests();
  }

  // =========================================================================
  // Prune loop
  // =========================================================================

  /**
   * Generator-based prune loop. Iterates through the request list from the
   * front, waiting a configured delay before evicting each old request.
   * Only prunes requests that have been appended or are sentinels, and
   * stops when only one non-sentinel request remains.
   *
   * @returns {Generator} Async generator for the scheduled task runner
   * @private
   */
  *_runPruneLoop() {
    while (this.requestList.length) {
      const firstRequest = this.requestList.key(0);
      const pruneDelay = TimeUtil.fromMilliseconds(
        this.config.tC?.playbackSegment ?? 0
      );
      const waitMs = pruneDelay.item(firstRequest.previousState);

      yield ie.millisecondsDelay(waitMs);

      // Keep at least one non-sentinel request
      if (this.requestList.complete.length <= 1 && !firstRequest.stateInfo) {
        break;
      }

      assert(firstRequest === this.requestList.key(0));

      // Abort if not yet appended
      if (!firstRequest.appended) {
        this._abortRequest(firstRequest);
      }

      const removed = this.requestList.splice(0, 1);
      if (this._attachIndex > 0) {
        this._attachIndex--;
      }
      this.streamSelector.internal_Kwa(removed);
    }
  }

  // =========================================================================
  // Request lookup
  // =========================================================================

  /**
   * Find a request matching the given criteria.
   * @param {*} criteria - Search criteria passed to requestList.cAb
   * @returns {Object|undefined} Matching request, or undefined
   */
  findRequest(criteria) {
    if (this.requestList.length) {
      const found = this.requestList.cAb(criteria);
      if (found) return found;
    }
  }

  /**
   * Find the insertion point for a new request based on its presentation
   * time range. Returns [playbackSegment, index] or undefined.
   *
   * @param {Object} request - Request with presentationStartTime and segmentEndTime
   * @returns {[number, number]|undefined} [pts, index] or undefined
   */
  findInsertionPoint(request) {
    const endTime = request.segmentEndTime;
    const idx = this.requestList.ZTa(request.presentationStartTime.playbackSegment);

    if (idx < 0) return undefined;

    const existing = this.requestList.key(idx);
    assert(
      existing &&
        existing.presentationStartTime?.playbackSegment !== undefined &&
        existing.segmentEndTime?.playbackSegment !== undefined &&
        existing.index !== undefined,
      'expected existing request to be defined with properties'
    );

    if (existing.segmentEndTime?.equal(endTime)) {
      this._abortRequestsAfter(idx);
      return [existing.segmentEndTime?.playbackSegment, existing.index + 1];
    }

    this._abortRequestsAfter(idx - 1);
    return [existing.presentationStartTime?.playbackSegment, existing.index];
  }

  /**
   * Attempt to swap URLs on all in-flight requests. Returns requests that
   * were successfully updated.
   *
   * @returns {Array<Object>} Requests whose URLs were updated
   */
  updateRequestUrls() {
    const updated = [];

    this.requestList.forEach(request => {
      const result = request.streamId?.call(request);
      if (result === 1) {
        updated.push(request);
      } else if (result === 2) {
        this.isLive.viewableSession.onNetworkFailure({
          ej: 'swapUrl failure',
        });
      }
    });

    return updated;
  }

  // =========================================================================
  // Download event handlers
  // =========================================================================

  /**
   * Called when the first byte of a response is received.
   * Triggers attachment if the request is a header segment (unless
   * request abandonment is enabled).
   *
   * @param {Object} request - The request that received its first byte
   */
  onFirstByte(request) {
    if (request.isHeaderSegment && request.canAppend() && !this.config.enableRequestAbandonment) {
      this.tryAttachRequests();
    }
    this.onFirstByteReceived(request);
  }

  /**
   * Called when data bytes are received for a request. When request
   * abandonment is enabled, checks if enough bytes have been received
   * to trigger early attachment.
   *
   * @param {Object} request - The request receiving data
   * @param {*} data - The received data chunk
   */
  onDataReceived(request, data) {
    if (this.config.enableRequestAbandonment && request.canAppend() && !request.appended) {
      const stream = request.stream;
      const track = stream.track;
      const bitrate = stream.bitrate;

      const attachThreshold = yDb({
        dfc: request.la,
        KHc: track.downloadables[0].bitrate,
        internal_Smc: bitrate,
        CJc: this.config.streamModeAppendAttachThreshold,
        wUc: request.offset.ri,
        isLive: this.isLive.viewableSession.isAdPlaygraph,
      });

      if (request.bytesReceived >= attachThreshold) {
        this.tryAttachRequests();
      }
    }

    this.onDataReceived(request, data);
  }

  /**
   * Called when a request completes successfully. Triggers attachment
   * for header segments and restarts the pruner if idle.
   *
   * @param {Object} request - The completed request
   * @param {*} result - Completion result/metadata
   */
  onRequestComplete(request, result) {
    if (request.isHeaderSegment && !request.appended) {
      this.tryAttachRequests();
    }

    if (this.branchPruner?.state === completionState.complete) {
      this.branchPruner?.reuseOnErrorCacheSize();
    }

    this.onRequestCompleted(request, result);
  }

  // =========================================================================
  // In-flight request queries
  // =========================================================================

  /**
   * Returns all in-flight requests (both active downloads and pending).
   * @returns {Array<Object>}
   */
  getAllInFlightRequests() {
    return this.requestList.active.concat(this.requestList.jWb);
  }

  /**
   * Abort a contiguous set of requests, remove them from the append queue,
   * and purge them from the request list.
   *
   * @param {Array<Object>} requests - Contiguous requests to abort
   */
  abortContiguousRequests(requests) {
    let anyAborted = false;
    let lastIndex = -1;

    requests.map(request => {
      assert(lastIndex === -1 || request.index === lastIndex + 1, 'requests to abort must be contiguous');
      lastIndex = request.index;

      if (!this._abortRequest(request)) {
        return false;
      }

      anyAborted = true;
      this.appendQueue.item(request);
      request.dispose();
      return true;
    });

    if (anyAborted) {
      this._purgeAbortedRequests();
    }
  }

  // =========================================================================
  // Private helpers
  // =========================================================================

  /**
   * Compute total request + pending count.
   * @returns {number}
   * @private
   */
  _computeTotalRequestAndPendingCount() {
    return this.requestList.bn + this.requestList.JO;
  }

  /**
   * Reset all request-tracking state. Creates a fresh request list,
   * clears the append queue, and notifies the stream selector about
   * any released requests.
   * @private
   */
  _resetRequestState() {
    const hadRequests = this.requestList !== undefined && this.requestList.length > 0;
    const oldList = this.requestList;

    /** @type {Object} Ordered list of media requests */
    this.requestList = new RequestList(this.console, this);

    /** @type {number} Index into requestList of the next request to attach */
    this._attachIndex = 0;

    this.appendQueue.clear();

    /** @type {Object|undefined} Last request attached to the append queue */
    this._lastAttachedRequest = undefined;

    /** @type {number|null} PTS of the first attached request */
    this._firstAttachPts = null;

    this.branchPruner?.reuseOnErrorCacheSize();

    /** @type {boolean} Whether pruning is eligible */
    this._pruneEligible = false;

    /** @type {boolean} Whether any request data has been received */
    this._hasReceivedData = false;

    // Notify stream selector about all released requests
    if (hadRequests) {
      const released = oldList.map(r => r);
      this.streamSelector.internal_Kwa(released);
    }
  }

  /**
   * Mark that data has been received (set _hasReceivedData to true).
   * @private
   */
  _markDataReceived() {
    if (!this._hasReceivedData) {
      this._hasReceivedData = true;
    }
  }

  /**
   * Abort all requests after the given index. Used when re-inserting
   * requests at an earlier position.
   *
   * @param {number} afterIndex - Abort all requests with index > afterIndex
   * @private
   */
  _abortRequestsAfter(afterIndex) {
    for (let i = afterIndex + 1; i < this.requestCount; i++) {
      const request = this.requestList.key(i);
      assert(request, 'expected request to exist');
      this.appendQueue.item(request);
      if (!request.aborted) {
        this._abortRequest(request);
        request.dispose();
      }
    }
    this._purgeAbortedRequests();
  }

  /**
   * Abort a single request.
   *
   * @param {Object} request - The request to abort
   * @returns {boolean} True if the abort succeeded
   * @private
   */
  _abortRequest(request) {
    return request.abort() ? true : false;
  }

  /**
   * Purge all aborted requests from the request list, adjusting _attachIndex
   * and notifying the stream selector.
   * @private
   */
  _purgeAbortedRequests() {
    if (this.requestList.length === 0) return;

    const purged = [];
    let indexAdjustment = 0;

    this.requestList.internal_Ofa((request, index) => {
      if (index < this._attachIndex) {
        ++indexAdjustment;
      }
      purged.push(request);
    });

    this._attachIndex -= indexAdjustment;
    this.branchPruner?.reuseOnErrorCacheSize();
    this.streamSelector.internal_Kwa(purged);
  }

  // =========================================================================
  // Padding / missing-segment replacement
  // =========================================================================

  /**
   * Generate padding fragments to replace a missing segment, dispatching
   * by media type.
   *
   * @param {Object} request - The missing-segment request
   * @returns {Array<Object>} Replacement padding fragments
   * @private
   */
  _providePaddingFragments(request) {
    let fragments = [];

    switch (this.mediaType) {
      case MediaType.V:
        fragments = this._provideAudioPadding(request);
        break;
      case MediaType.U:
        fragments = this._provideVideoPadding(request);
        break;
      case MediaType.TEXT_MEDIA_TYPE:
        fragments = this._provideTextPadding(request);
        break;
      case MediaType.supplementaryMediaType:
        this.console.error('providePaddingFragments not implemented for MEDIA_EVENTS');
        break;
    }

    // Propagate initialization notification to the last padding fragment
    if (request.qz?.notifyInitialize) {
      fragments[fragments.length - 1].qz = { nI: true };
    }

    return fragments;
  }

  /**
   * Generate audio padding fragments for a missing segment.
   * @param {Object} request
   * @returns {Array<Object>}
   * @private
   */
  _provideAudioPadding(request) {
    return MediaPipelineFactory.instance().yha.POb(
      this.isLive.viewableSession,
      request.stream.durationValue,
      CBb(request.stream.profile),
      request.stream.bitrate,
      request.stream.track.codecValue,
      request.offset,
      this.isLive.currentSegment,
      (x, y) => request.timestamp.item(y).downloadState(x).$,
      this.config,
      this.console
    );
  }

  /**
   * Generate video padding fragments for a missing segment.
   * @param {Object} request
   * @returns {Array<Object>}
   * @private
   */
  _provideVideoPadding(request) {
    const frameRate = request.stream.track.frameDuration?.K3a();
    assert(frameRate, 'Video streams must have a frame rate');

    return MediaPipelineFactory.instance().yha.QOb(
      this.isLive.viewableSession,
      'padding',
      request.stream.profile,
      frameRate,
      request.stream.track.resolution?.zD,
      request.stream.track.codecValue,
      request.offset,
      this.isLive.currentSegment,
      (z, B) => request.timestamp.item(B).downloadState(z).$,
      this.console
    ).fragmentIndex;
  }

  /**
   * Generate text padding for a missing text segment.
   * @param {Object} request
   * @returns {Array<Object>}
   * @private
   */
  _provideTextPadding(request) {
    request.loadRawData(MediaPipelineFactory.instance().yha.XRc(), true);
    return [request];
  }
}

// Apply decorator (originally: d.__decorate([m.o0], v))
// MediaRequestPipeline = __decorate([o0], MediaRequestPipeline);

export { MediaRequestPipeline, MediaRequestPipeline };
