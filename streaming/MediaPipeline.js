/**
 * Netflix Cadmium Player - MediaPipeline
 * Webpack Module 46512 (exported as `aJa`)
 *
 * Abstract base class for media pipelines (audio, video, text). Extends
 * BranchPipeline to provide the core state and lifecycle management shared
 * by OnDemandPipeline (Module 95052) and LivePipeline (Module 95324).
 *
 * A MediaPipeline tracks:
 * - The current fragment range (firstFragment..lastFragment) and the next
 *   fragment index to request (nextFragmentIndex)
 * - A MediaRequestPipeline (yq/requestPipeline) that manages request queuing
 * - A RequestQueue (requestQueue) that creates and dispatches HTTP requests
 * - A StreamMetrics tracker for bandwidth/throughput measurement
 * - Buffer level, live-edge timing, and request-pacing state
 *
 * Subclasses override `tryIssueRequest`, `cancelStreaming`, and provide
 * media-type-specific behaviour (e.g., video seek, audio track switching).
 *
 * Original obfuscated name: class `w` in Module 46512
 *
 * @module streaming/MediaPipeline
 */

// Dependency mapping (webpack module IDs):
// 22970 -> tslib helpers (__extends, __assign, __values, __read)
// 66164 -> platform utilities (platform.now, platform helpers)
// 91176 -> TimeUtil (max, seekToSample, fromMilliseconds)
// 81392 -> BranchPipeline base class (bP)
// 8934  -> StreamMetrics (internal_Mhb)
// 65161 -> MediaType enum + helpers (FI = getMediaTypeShortName)
// 14242 -> StallDetector (internal_Qlb)
// 69575 -> mathTanh / scoped logger factory
// 52571 -> assert utility
// 78541 -> RequestQueue factory (TD = createRequestQueue)
// 96652 -> SideChannel utilities (jSc, zsc)
// 73861 -> MediaRequestPipeline (djb)
// 64141 -> Live availability time calculator (xfc)
// 15908 -> Request pacing (ZVa = calculatePacedRequestTime, internal_Qla = PacingCurveType)

import { __extends, __assign, __values, __read } from './Module_22970';
import * as PlatformUtil from './Module_66164';
import { TimeUtil } from './Module_91176';
import { BranchPipeline } from './Module_81392';
import { StreamMetrics } from './Module_8934';
import { MediaType, getMediaTypeShortName } from './Module_65161';
import { StallDetector } from './Module_14242';
import { createScopedLogger } from './Module_69575';
import { assert } from './Module_52571';
import { createRequestQueue } from './Module_78541';
import { calculateSideChannelBuffer, buildNetworkHints } from './Module_96652';
import { MediaRequestPipeline } from './Module_73861';
import { calculateLiveAvailabilityTime } from './Module_64141';
import {
  calculatePacedRequestTime,
  PacingCurveType,
} from './Module_15908';

/**
 * @class MediaPipeline
 * @extends BranchPipeline
 * @description Abstract base class for per-media-type download pipelines.
 *   Manages the fragment range, request pipeline, request queue, and
 *   buffer/timing state for a single media type within a playback session.
 */
class MediaPipeline extends BranchPipeline {
  /**
   * @param {Object} branchId - Identifier passed to BranchPipeline
   * @param {Object} config - Pipeline configuration (buffer targets, pacing, etc.)
   * @param {Object} logContext - Logging/context object
   * @param {Object} streamSelector - Stream selector for choosing bitrates/streams
   * @param {Object} innerViewable - The viewable state container
   * @param {Object} track - Track metadata (mediaType, downloadables, viewableSession)
   * @param {Object} metricsProvider - Metrics/telemetry provider (playbackSegment bitrate source)
   * @param {Object} scheduler - Scheduler for timed tasks
   * @param {Object} [requestQueue] - Optional pre-built request queue; created if absent
   */
  constructor(branchId, config, logContext, streamSelector, innerViewable, track, metricsProvider, scheduler, requestQueue) {
    super(branchId);

    /** @type {Object} Pipeline configuration */
    this.config = config;

    /** @type {Object} Inner viewable state */
    this.innerViewable = innerViewable;

    /** @type {Object} Track metadata */
    this.track = track;

    /** @type {Object} Metrics/telemetry provider */
    this.metricsProvider = metricsProvider;

    /** @type {Object} Task scheduler */
    this.scheduler = scheduler;

    /** @type {boolean} Whether this pipeline has established a connection */
    this.connected = false;

    /** @type {boolean} Whether download data has been received for buffering check */
    this.hasReceivedDownloadData = false;

    /** @type {number} Earliest time at which the next request may be issued (pacing) */
    this.nextRequestAvailableTime = -Infinity;

    /** @type {string} Current request availability status */
    this.requestAvailabilityStatus = 'available';

    /** @type {boolean} Whether the pipeline is cancelled */
    this.isCancelled = false;

    /** @type {boolean} Whether end-of-stream has been reached for remaining segments */
    this.endOfStreamReached = false;

    /** @type {number} Timestamp of last request abandonment (for lock interval) */
    this.lastAbandonmentTimestamp = -Infinity;

    /** @type {StreamMetrics} Per-stream metrics tracker */
    this.streamMetrics = new StreamMetrics(this.mediaType, config, logContext, this);

    // Create scoped logger
    const logPrefix = `[${this.mediaType}]`;

    /** @type {Object} Scoped console/logger */
    this.console = createScopedLogger(PlatformUtil.platform, logContext, logPrefix);

    /** @type {Function} Bound error logger */
    this.error = this.console.error.bind(this.console);

    /** @type {Function} Bound retry logger */
    this.RETRY = this.console.RETRY.bind(this.console);

    /** @type {Function} Bound pause-trace logger */
    this.pauseTrace = this.console.pauseTrace.bind(this.console);

    /** @type {number} Current playback position in milliseconds */
    this.currentPlaybackPositionMs = metricsProvider.playbackSegment;

    // Stall detector (optional, config-driven)
    if (config.stallAtFrameCount) {
      /** @type {StallDetector|undefined} */
      this.stallDetector = new StallDetector(config.stallAtFrameCount, this.console);
    }

    /** @type {MediaRequestPipeline} Request pipeline managing download requests */
    this.requestPipeline = new MediaRequestPipeline(
      this,
      streamSelector,
      this.config,
      this.console,
      this.mediaType
    );

    /** @type {Object} Request queue that dispatches HTTP requests for fragments */
    this.requestQueue = requestQueue || createRequestQueue(
      this.mediaType,
      this.track.viewableSession,
      this.config,
      this.console,
      this.track.isAdPlaygraph,
      this.requestPipeline.wUa.bind(this.requestPipeline),
      this.requestPipeline.iuc.bind(this.requestPipeline),
      function () {}
    );

    this.requestQueue.on('created', () => {
      this.events.emit('requestQueueCreated');
    });
  }

  // ===========================================================================
  // Property Accessors
  // ===========================================================================

  /**
   * The media type of this pipeline (audio, video, text, etc.).
   * @type {string}
   */
  get mediaType() {
    return this.track.mediaType;
  }

  /**
   * The track metadata object.
   * @type {Object}
   */
  get track() {
    return this.track;
  }

  /**
   * The inner viewable state.
   * @type {Object}
   */
  get ma() {
    return this.innerViewable;
  }

  /**
   * Current segment ID from the inner viewable.
   * @type {*}
   */
  get segmentId() {
    return this.innerViewable.currentSegment.id;
  }

  /**
   * Composite key: "{segmentId}-{mediaTypeShort}" for uniquely identifying
   * this pipeline's segment within a media type.
   * @type {string}
   */
  get segmentMediaKey() {
    return `${this.segmentId}-${getMediaTypeShortName(this.mediaType)}`;
  }

  /**
   * The request pipeline (MediaRequestPipeline) instance.
   * @type {MediaRequestPipeline}
   */
  get requestPipeline() {
    return this.yq;
  }

  /**
   * Available downloadable streams for this track.
   * @type {Array}
   */
  get downloadables() {
    return this.track.downloadables;
  }

  /**
   * Current buffer level as a time value.
   * @type {Object}
   */
  get bufferLevel() {
    return this.yq.IZ;
  }

  /**
   * The requested/target buffer level.
   * @type {Object}
   */
  get requestedBufferLevel() {
    return this.yq.requestedBufferLevel;
  }

  /**
   * The throughput/bitrate estimator.
   * @type {Object}
   */
  get bitrateEstimator() {
    return this.currentPlaybackPositionMs;
  }

  /**
   * Playback time from timestamp or manifest-derived lI time.
   * @type {number}
   */
  get playbackTimeOrManifestTime() {
    return this.timestamp || this.manifestDerivedTime;
  }

  /**
   * Live edge time: from the request event emitter if available, else playbackTimeOrManifestTime.
   * @type {number}
   */
  get liveEdgeTime() {
    return this.requestEventEmitter.liveEdgeTime || this.playbackTimeOrManifestTime;
  }

  /**
   * Last appended fragment time.
   * @type {*}
   */
  get lastAppendedTime() {
    return this.requestEventEmitter.L$;
  }

  /**
   * UQa property forwarded from the request event emitter.
   * @type {*}
   */
  get UQa() {
    return this.requestEventEmitter.UQa;
  }

  /**
   * Segment end time of the last completed request fragment.
   * @type {number|undefined}
   */
  get lastCompletedSegmentEndTime() {
    const lastCompleted = this.requestEventEmitter.lHb;
    return lastCompleted?.segmentEndTime;
  }

  /**
   * yqa property forwarded from request event emitter.
   * @type {*}
   */
  get yqa() {
    return this.requestEventEmitter.yqa;
  }

  /**
   * Whether the current next-fragment-index has moved past the first fragment.
   * @type {boolean}
   */
  get hasSurpassedFirstFragment() {
    return !!this.firstFragment && this.nextFragmentIndex > this.firstFragment.index;
  }

  /**
   * Whether the pipeline has consumed past the last fragment (done downloading).
   * @type {boolean}
   */
  get isPastLastFragment() {
    return (
      !!this.lastFragment &&
      (this.nextFragmentIndex > this.lastFragment.index ||
        this.currentPlaybackPositionMs >= this.lastFragment.segmentEndTime.playbackSegment)
    );
  }

  /**
   * Whether this is truly the last segment and no pending requests remain.
   * @type {boolean}
   */
  get isCompletelyFinished() {
    return this.isAtLastSegment && this.requestEventEmitter.JO === 0;
  }

  /**
   * Whether the pipeline is at the last segment and has no outstanding operations.
   * @type {boolean}
   */
  get isDoneDownloading() {
    return this.isAtLastSegment && this.yq.OOc === 0;
  }

  /**
   * Whether end-of-stream has been signalled for remaining segments.
   * @type {boolean}
   */
  get isEndOfStreamReached() {
    if (this.endOfStreamReached) return true;
    if (!this.hasMoreSegments) return false;
    const nextSegment = this.getNextSegmentInfo();
    return this.endOfStreamReached || (this.endOfStreamReached = nextSegment === undefined || nextSegment.e2a);
  }

  /**
   * Whether a last completed request fragment exists.
   * @type {boolean}
   */
  get hasLastCompletedRequest() {
    return !!this.requestEventEmitter.lHb;
  }

  /**
   * Total segment count from the request event emitter.
   * @type {number}
   */
  get segmentCount() {
    return this.requestEventEmitter.segmentCount;
  }

  /**
   * Lowest water-mark buffer level for determining seek safety.
   * @type {Object|undefined}
   */
  get lowestWaterMark() {
    return this.previousState
      ? TimeUtil.max(
          this.previousState.lowestWaterMarkLevelBufferRelaxed(this.pipelineStartTime),
          TimeUtil.seekToSample
        )
      : undefined;
  }

  /**
   * f0 property forwarded from the live state.
   * @type {*}
   */
  get f0() {
    return this.isLive.f0;
  }

  /**
   * The stream bundle for this pipeline's media type.
   * @type {Object}
   */
  get streamBundle() {
    return this.streamSelector.streamBundle(this.mediaType);
  }

  /**
   * Whether DIA (Dynamic Input Adaptation) is enabled. Default false in base class.
   * @type {boolean}
   */
  get isDiaEnabled() {
    return false;
  }

  /**
   * Whether Qqa is active. Default false in base class.
   * @type {boolean}
   */
  get Qqa() {
    return false;
  }

  /**
   * Fragment index offset from the request event emitter.
   * @type {number}
   */
  get fragmentIndexOffset() {
    return this.requestEventEmitter.fragmentIndex.offset;
  }

  /**
   * The element list from the config object.
   * @type {Array}
   */
  get elementList() {
    return this.configObject.elementList;
  }

  /**
   * Next request available time (for pacing).
   * @type {number}
   */
  get nextAvailableTime() {
    return this.nextRequestAvailableTime;
  }

  /**
   * Current request availability status string.
   * @type {string}
   */
  get availabilityStatus() {
    return this.requestAvailabilityStatus;
  }

  /**
   * Timescale value from the first fragment, defaulting to 1.
   * @type {number}
   */
  get timescaleValue() {
    return this.firstFragment?.timescaleValue ?? 1;
  }

  /**
   * Content start ticks from the first fragment.
   * @type {number|undefined}
   */
  get contentStartTicks() {
    return this.firstFragment?.contentStartTicks;
  }

  /**
   * Content end ticks from the last fragment.
   * @type {number|undefined}
   */
  get contentEndTicks() {
    return this.lastFragment?.contentEndTicks;
  }

  /**
   * Download state duration in ticks for the current quality descriptor.
   * @type {number}
   */
  get downloadStateDuration() {
    return this.isLive.qualityDescriptor.downloadState(this.timescaleValue).$;
  }

  /**
   * Whether the request event emitter has fragments.
   * @type {boolean}
   */
  get hasFragments() {
    return this.requestEventEmitter.hasFragments;
  }

  /**
   * Whether the pipeline has started issuing requests.
   * @type {boolean}
   */
  get started() {
    return this.requestEventEmitter.started;
  }

  /**
   * Start-of-sequence marker from the request event emitter.
   * @type {*}
   */
  get startOfSequence() {
    return this.requestEventEmitter.startOfSequence;
  }

  /**
   * Manifest-derived time: computed from the live state's quality descriptor.
   * @type {number}
   */
  get manifestDerivedTime() {
    return this.metricsProvider.item(this.isLive.qualityDescriptor);
  }

  /**
   * Whether request abandonment is currently locked (within the lock interval).
   * @type {boolean}
   */
  get isAbandonmentLocked() {
    return (
      PlatformUtil.platform.platform.now() - this.lastAbandonmentTimestamp <
      this.config.requestAbandonmentLockIntervalMs
    );
  }

  /**
   * Buffer target from the live state for this media type.
   * @type {*}
   */
  get bufferTarget() {
    return this.isLive.rca(this.mediaType);
  }

  /**
   * xh property forwarded from the inner viewable.
   * @type {*}
   */
  get xh() {
    return this.innerViewable.xh;
  }

  /**
   * Pipeline start time: from the request event emitter, or first fragment, or manifest-derived.
   * @type {number}
   */
  get pipelineStartTime() {
    return (
      this.requestEventEmitter.tJ ||
      this.firstFragment?.presentationStartTime?.item(this.isLive.qualityDescriptor) ||
      this.manifestDerivedTime
    );
  }

  /**
   * Current playback position as a TimeUtil value.
   * @type {Object}
   */
  get currentPlaybackPositionAsTime() {
    return TimeUtil.fromMilliseconds(this.currentPlaybackPositionMs);
  }

  /**
   * Whether the connection setup requirement for buffering is met.
   * @type {boolean}
   */
  get isReadyForBuffering() {
    let ready = true;
    if (this.config.requireSetupConnectionDuringBuffering) {
      ready = this.connected;
    }
    if (this.config.requireDownloadDataAtBuffering) {
      ready = ready && this.hasReceivedDownloadData;
    }
    return ready;
  }

  /**
   * Whether a stall detector is configured.
   * @type {boolean}
   */
  get hasStallDetector() {
    return this.stallDetector !== undefined;
  }

  /**
   * Stall detection result: { complete, reason }.
   * @type {{ complete: boolean, reason: string }}
   */
  get stallDetectionResult() {
    return this.stallDetector?.GA()
      ? { complete: true, reason: 'stall' }
      : { complete: false, reason: 'stall' };
  }

  // ===========================================================================
  // Lifecycle Methods
  // ===========================================================================

  /**
   * Resets the request event emitter's write head.
   */
  resetWriteHead() {
    this.requestEventEmitter.bW();
  }

  /**
   * Iterates buffered fragments and replaces any missing segments
   * that are before the current next-fragment index.
   */
  checkAndReplaceMissingSegments() {
    this.yq.CY((entries) => {
      const entry = entries[0];
      const startTimeMs = entry.presentationStartTime?.playbackSegment;
      const index = entry.index;
      if (index < this.nextFragmentIndex) {
        this.replaceSegmentAt(startTimeMs, index);
      }
    });
  }

  /**
   * Initialises the pipeline: creates the request event emitter and registers
   * the request queue with the viewable session.
   */
  create() {
    this.requestEventEmitter.create();
    if (this.firstFragment) {
      this.replaceSegmentAt(
        this.firstFragment.presentationStartTime.playbackSegment,
        this.firstFragment.index
      );
    }
    if (this.requestQueue) {
      this.isLive.viewableSession.BY(this.mediaType, this.requestQueue);
    }
  }

  /**
   * Serialises pipeline state for diagnostics / telemetry.
   * @returns {Object}
   */
  toJSON() {
    return {
      started: this.started,
      startOfSequence: this.startOfSequence,
      segmentId: this.segmentId,
      requestedBufferLevel: this.requestedBufferLevel,
      viewableId: this.innerViewable.viewableSession.J,
      hasFragments: this.hasFragments,
    };
  }

  /**
   * Refreshes request URLs (e.g., after CDN failover).
   * @returns {*}
   */
  updateRequestUrls() {
    return this.requestEventEmitter.updateRequestUrls();
  }

  /**
   * Sets the current playback position and next fragment index, then
   * resets pacing state.
   * @param {number} positionMs - Playback position in milliseconds
   * @param {number} fragmentIndex - Next fragment index to request
   */
  replaceSegmentAt(positionMs, fragmentIndex) {
    this.currentPlaybackPositionMs = positionMs;
    this.nextFragmentIndex = fragmentIndex;
    this.resetPacingState();
  }

  /**
   * Returns an iterator over pending/active requests.
   * @returns {Iterator}
   */
  getRequestIterator() {
    return this.requestEventEmitter.getRequestIterator();
  }

  /**
   * Queries the live state for the next segment of this media type.
   * @returns {Object|undefined}
   */
  getNextSegmentInfo() {
    return this.isLive.QCb(this.mediaType);
  }

  /**
   * Checks whether a given time is within the buffered range and complete.
   * @param {Object} time - Time value with a `playbackSegment` property
   * @returns {boolean}
   */
  isWithinRange(time) {
    const entry = this.requestEventEmitter.ytc(time.playbackSegment);
    return entry ? entry.complete : false;
  }

  // ===========================================================================
  // Request Lifecycle
  // ===========================================================================

  /**
   * No-op hook for subclasses (called during extended lifecycle events).
   */
  onExtendedLifecycle() {}

  /**
   * Attempts to issue a header request if the stream's header hasn't been received.
   * Asserts that the pipeline is neither cancelled, done, nor at the last segment.
   * @param {Object} stream - The stream to issue the request on
   * @returns {{ Ff: *, reason: string }|undefined}
   */
  tryIssueHeaderRequest(stream) {
    assert(!this.isCancelled, 'pipeline.tryIssueRequest on disabled pipeline');
    assert(!this.isDone(), 'pipeline.tryIssueRequest on done pipeline');
    assert(!this.isAtLastSegment);

    if (!stream.headerReceived) {
      const result = stream.IC(this.isLive.currentSegment, this.requestQueue);
      return result
        ? { Ff: result, reason: 'success' }
        : { Ff: result, reason: 'pipelineTryIssueHeaderRequest' };
    }
  }

  /**
   * Attaches side-channel / congestion-pacing-rate (CPR) metadata to a request
   * when connecting to an Open Connect Appliance (OCA).
   * @param {Object} request - The outgoing request object
   * @param {Object} requestInfo - Request info containing networkInfo, stream, E3
   */
  attachSideChannelMetadata(request, requestInfo) {
    const networkInfo = requestInfo.networkInfo;
    const presentationEndTime = requestInfo.E3;
    const viewable = this.innerViewable;
    let mediaType = this.mediaType;

    if (requestInfo.stream.cdnType !== 'OPEN_CONNECT_APPLIANCE') {
      return;
    }

    if (
      (this.config.svodEnableUnifiedSideChannel || this.config.enableUnifiedSideChannel) &&
      viewable.viewableSession.blackBoxNotifier
    ) {
      // Unified side channel path
      const notifier = viewable.viewableSession.blackBoxNotifier;
      const cprEnabled =
        this.config.enableHybridPacing ||
        (mediaType === MediaType.V && this.config.enableCprAudio) ||
        (mediaType === MediaType.U && this.config.enableCprVideo);
      const byteRangeHintsEnabled =
        this.config.enableSCByteRangeHints &&
        this.mediaType === MediaType.U &&
        this.config.pipelineEnabled;

      const bufferInfo = calculateSideChannelBuffer(
        viewable.getStartTime(this.mediaType),
        this.config.OCSCBufferQuantizationConfig
      );
      const networkHints =
        cprEnabled && networkInfo ? buildNetworkHints(networkInfo) : undefined;

      const sideChannelData = {
        Eec: bufferInfo,
        Rhc: PlatformUtil.platform.platform.now(),
        tPc: presentationEndTime.playbackSegment,
        ...networkHints,
      };

      if (byteRangeHintsEnabled) {
        sideChannelData.$ec = {
          start: request.offset,
          size: request.la,
        };
      }

      request.ZN = cprEnabled ? networkInfo : undefined;
      request.internal_Skd = sideChannelData;
      request.rC = notifier.lwb(sideChannelData);
    } else if (viewable.viewableSession.blackBoxNotifier2) {
      // Legacy side channel path
      const notifier2 = viewable.viewableSession.blackBoxNotifier2;
      const cprEnabled =
        this.config.enableHybridPacing ||
        (mediaType === MediaType.V && this.config.enableCprAudio) ||
        (mediaType === MediaType.U && this.config.enableCprVideo);
      const byteRangeHintsEnabled =
        this.config.enableSCByteRangeHints &&
        this.mediaType === MediaType.U &&
        this.config.pipelineEnabled;

      request.ZN = cprEnabled ? networkInfo : undefined;
      request.rC = notifier2.tu({
        bR: viewable.getStartTime(this.mediaType),
        nginxSendingRate: this.config.enableNginxRateLimit
          ? this.config.nginxSendingRate
          : undefined,
        y7a: String(PlatformUtil.platform.platform.now()),
        HMb: networkInfo,
        FPa: byteRangeHintsEnabled
          ? { start: request.offset, size: request.la }
          : undefined,
        LNb: presentationEndTime.playbackSegment,
      });
    }
  }

  /**
   * Called when stream segment boundaries are normalised. Sets first/last
   * fragment and replaces the current segment position.
   * @param {Object} [firstFrag] - First fragment descriptor
   * @param {Object} [lastFrag] - Last fragment descriptor
   */
  onSegmentNormalized(firstFrag, lastFrag) {
    if (firstFrag) this.firstFragment = firstFrag;
    if (lastFrag) this.lastFragment = lastFrag;

    assert(this.firstFragment);
    assert(this.lastFragment);
    assert(this.nextFragmentIndex === undefined);

    this.replaceSegmentAt(
      this.firstFragment.presentationStartTime.playbackSegment,
      this.firstFragment.index
    );
  }

  /**
   * Truncates the pipeline at the given fragment (e.g., for early termination
   * or live edge trimming). May trigger "lastRequestIssued" events.
   * @param {Object} fragment - The fragment to truncate at
   * @returns {boolean} Whether the truncation was applied
   */
  truncate(fragment) {
    assert(this.firstFragment, 'expected first fragment to exist on updateStreaming');

    // Already done or fragment is past the last fragment
    if (
      (this.isDone() && this.lastFragment?.appended) ||
      (this.lastFragment && fragment.index > this.lastFragment.index)
    ) {
      return false;
    }

    this.lastFragment = fragment;

    if (!this.isAtLastSegment) {
      return true;
    }

    const replacementRange = this.yq.V$b(fragment);
    if (!replacementRange) {
      return false;
    }

    this.replaceSegmentAt(replacementRange[0], replacementRange[1]);

    if (this.isAtLastSegment) {
      this.requestEventEmitter.pruneRequestCache();
      this.requestEventEmitter.notifyLastRequest();
      Promise.resolve().then(() => {
        this.events.emit('lastRequestIssued', {
          type: 'lastRequestIssued',
          mediaType: this.mediaType,
        });
      });
    }

    return true;
  }

  /**
   * Determines whether this pipeline is at its last downloadable segment.
   * Returns false if the pipeline is done; true if playback is active;
   * otherwise falls back to the track's internal end-of-stream flag.
   * @returns {boolean}
   */
  get isAtLastSegment() {
    if (this.isDone()) return false;
    if (this.isPlaybackActive()) return true;
    return this.track.internal_Nea;
  }

  /**
   * Whether playback is active (both first and last fragments are defined).
   * @returns {boolean}
   */
  isPlaybackActive() {
    return this.firstFragment !== undefined && this.lastFragment !== undefined;
  }

  /**
   * Whether the pipeline is done (cancelled or completely finished).
   * @returns {boolean}
   */
  isDone() {
    return this.isCancelled || this.isCompletelyFinished;
  }

  /**
   * Returns whether HTTP pipelining is enabled, checking the request queue's
   * track override first.
   * @returns {boolean}
   */
  isPipelineEnabled() {
    const pipelineEnabled = this.config.pipelineEnabled;
    if (this.requestQueue?.track) {
      return this.requestQueue.track.pipelineEnabled;
    }
    return pipelineEnabled;
  }

  // ===========================================================================
  // Request Callbacks
  // ===========================================================================

  /**
   * Called when a request completes successfully. Updates stream metrics and
   * marks download data as received if configured.
   * @param {Object} request - The completed request
   * @param {*} result - Completion result/metadata
   */
  onRequestComplete(request, result) {
    this.requestPipeline.lLc(request);
    if (this.config.indicatorForDownloadDataAtBuffering === 'oncomplete') {
      this.hasReceivedDownloadData = true;
    }
    this.onRequestCompleted(request, result);
  }

  /**
   * Called when a request becomes active (starts downloading). Updates
   * stream metrics with stream/timing information.
   * @param {Object} request - The now-active request
   */
  onRequestActive(request) {
    if (!request.isEndOfStream) {
      this.requestPipeline.oLb(
        request.stream,
        request.timestamp?.playbackSegment,
        request.presentationStartTime?.playbackSegment
      );
    }
    this.requestPipeline.hLc(this.segmentId, request.stream, request.isEndOfStream);
    this.wba(request);
  }

  /**
   * Called when the first byte of a response is received. Marks the connection
   * as established and optionally flags download-data receipt.
   * @param {Object} request - The request that received data
   */
  onFirstByte(request) {
    this.connected = true;
    if (this.config.indicatorForDownloadDataAtBuffering === 'onfirstbyte') {
      this.hasReceivedDownloadData = true;
    }
    this.onFirstByteReceived(request);
  }

  // ===========================================================================
  // Buffer / Fragment Analysis
  // ===========================================================================

  /**
   * Analyses the fragment index to compute buffer occupancy at a given time.
   * Returns an object with the list of fragments after the time, plus counts
   * of completed, partial, and z3 requests.
   * @param {Object} time - Time value with `playbackSegment` property
   * @returns {{ Ta: Array, internal_Ixa: number, partial: number, z3: number }}
   */
  getBufferOccupancy(time) {
    const fragmentIndex = this.requestEventEmitter.fragmentIndex;

    if (fragmentIndex.length === 0) {
      return { Ta: [], internal_Ixa: 0, partial: 0, z3: 0 };
    }

    let searchIndex = fragmentIndex.iba(time.playbackSegment);
    if (searchIndex < 0) {
      searchIndex =
        fragmentIndex.timestamp === undefined ||
        time.playbackSegment <= fragmentIndex.timestamp.playbackSegment
          ? 0
          : fragmentIndex.length;
    }

    return {
      Ta: fragmentIndex.AWc(searchIndex),
      internal_Ixa: Math.max(0, fragmentIndex.completedRequests - searchIndex),
      partial: fragmentIndex.partial,
      z3: fragmentIndex.z3,
    };
  }

  /**
   * Attempts to abandon stale in-flight requests that are unlikely to complete
   * within the allowed time budget. Respects the abandonment lock interval.
   * @param {number} timeBudget - Maximum allowed time in units of per-request average
   * @param {number} totalBandwidth - Total available bandwidth
   * @param {number} startupPenalty - Additional penalty for non-active requests
   */
  tryAbandonRequests(timeBudget, totalBandwidth, startupPenalty) {
    if (this.isAbandonmentLocked) return;

    const pendingRequests = this.requestEventEmitter.myc();
    pendingRequests.sort((a, b) => a.index - b.index);

    getMediaTypeShortName(this.mediaType);

    const bandwidthPerRequest = totalBandwidth / pendingRequests.length;
    const requestsToAbandon = [];

    for (const request of pendingRequests) {
      const bitrate = request.bitrate;
      const offset = request.offset;
      const appended = request.appended;
      const remainingBits =
        8 * ((request.la || offset.playbackSegment * bitrate / 8) - request.bytesReceived);

      if (request.data.presentationStartTime === undefined) continue;

      if (requestsToAbandon.length > 0) {
        requestsToAbandon.push(request);
      } else if (
        Math.ceil(remainingBits / bandwidthPerRequest) +
          (request.active ? 0 : startupPenalty) >
        timeBudget
      ) {
        if (appended) return;
        requestsToAbandon.push(request);
      }
    }

    if (requestsToAbandon.length === 0) return;

    const firstAbandoned = requestsToAbandon[0];
    this.requestEventEmitter.U$b(requestsToAbandon);
    this.replaceSegmentAt(
      firstAbandoned.data.presentationStartTime?.playbackSegment,
      firstAbandoned.index
    );
    this.lastAbandonmentTimestamp = PlatformUtil.platform.platform.now();
  }

  /**
   * Resets the pipeline after reaching the last segment: prunes the request
   * cache and emits "lastRequestIssued".
   */
  resetPipelineState() {
    if (this.isAtLastSegment) {
      this.requestEventEmitter.pruneRequestCache();
      this.events.emit('lastRequestIssued', {
        type: 'lastRequestIssued',
        mediaType: this.mediaType,
      });
    }
  }

  /**
   * Resets the request-pacing state to allow immediate request issuance.
   * @private
   */
  resetPacingState() {
    this.nextRequestAvailableTime = -Infinity;
    this.requestAvailabilityStatus = 'available';
  }

  // ===========================================================================
  // Live Availability / Request Pacing
  // ===========================================================================

  /**
   * Calculates the live availability time and pacing delay for the next request.
   * If the requested time is within the live edge, it may apply logarithmic
   * pacing; otherwise, it returns the estimated availability time.
   *
   * @param {number} requestTimeMs - The time (ms) of the fragment to request
   * @param {number} bufferTargetMs - Current buffer target in milliseconds
   * @returns {{ Vw: number, AA: string }} Next available time and status reason
   */
  calculateLiveRequestTiming(requestTimeMs, bufferTargetMs) {
    const livePlayback = this.track.viewableSession.pT;
    assert(livePlayback !== undefined, 'Trying to get a live availability time without a live playback');

    const networkState = livePlayback.networkState;
    const encodingPipelineTime = livePlayback.encodingpipelinetime;
    const liveEdge = networkState.getLiveEdgeTime(true);
    const liveEdgeDetail = networkState.PVa(true);

    if (requestTimeMs <= liveEdge) {
      // Fragment is within the live window
      if (this.config.enableLiveRequestPacing) {
        const presentationDelay = this.isLive.ase_Psa();
        const minimumDelay = this.config.minimumPresentationDelayMs ?? 0;
        const startTime = this.isLive.getStartTime(this.mediaType);

        const pacedTime = calculatePacedRequestTime(
          PacingCurveType.LOGARITHMIC,
          {
            b7a: presentationDelay,
            c0a: minimumDelay,
            QRa: startTime,
            bufferTargetMs,
            internal_Hwb: this.config.logarithmicRequestPacingCurveCenterPositionMs ?? 0,
            internal_Kwb: this.config.logarithmicRequestPacingCurveSharpness ?? 1,
          }
        );

        return { Vw: pacedTime, AA: 'waitingOnPacedRequest' };
      }

      return { Vw: -Infinity, AA: 'available' };
    }

    // Fragment is beyond the live edge - calculate availability
    const availabilityTime = calculateLiveAvailabilityTime({
      Wf: encodingPipelineTime,
      OKc: requestTimeMs,
      HHc: liveEdgeDetail.playbackSegment,
    });

    return { Vw: availabilityTime, AA: 'waitingOnLiveAvailability' };
  }
}

export { MediaPipeline };
export default MediaPipeline;
