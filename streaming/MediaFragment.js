/**
 * @module MediaFragment
 *
 * Represents a single media fragment (audio or video segment) in the Netflix
 * Cadmium streaming player. A MediaFragment extends StreamRequest and carries
 * all metadata required to download, buffer, decode, and present one segment
 * of content: timing information (content start / end ticks, presentation
 * timestamps), VMAF quality scores, edit-window trimming, SAP (Stream Access
 * Point) information, and response-data queuing.
 *
 * Referenced as "fragment index builder" by Module_18128.
 *
 * Original: Module_50468
 *
 * @dependencies
 *   Module 22970  - tslib helpers (__extends, __assign, __importDefault, etc.)
 *   Module 91176  - TimeUtil (tick / timescale arithmetic)
 *   Module 52571  - assert utility
 *   Module 14282  - MediaTypeConstants (AUDIO / VIDEO / TEXT enums)
 *   Module 95591  - FragmentStatistics (FKa)
 *   Module 85254  - outputList (decorator / registration helper)
 *   Module 89645  - QueueIterator (async response iterator)
 *   Module 78015  - StreamRequest (base class, xW)
 *   Module 5800   - FragmentDataProxy (WF) – stores trimmed content bounds
 *   Module 71808  - processingContext
 */

// ---------------------------------------------------------------------------
// Imports  (module IDs kept as comments for traceability)
// ---------------------------------------------------------------------------
import tslib from '../ads/AdBreakMismatchLogger.js';                   // 22970 – tslib helpers
import { TimeUtil } from '../core/AsejsEngine.js';            // 91176 – TimeUtil
import { assert } from '../ads/AdPoliciesManager.js';              // 52571 – assert
import MediaTypeConstants from './MediaFragment.js';      // 14282 – media-type constants
import { FragmentStatistics } from './MediaFragment.js';  // 95591 – FKa
import { outputList } from '../network/AseMediaRequest.js';          // 85254 – outputList
import { QueueIterator } from './MediaFragment.js';       // 89645 – QueueIterator / RJ
import { StreamRequest } from '../network/AseMediaRequest.js';       // 78015 – base class (xW)
import { FragmentDataProxy } from './MediaFragment.js';    // 5800  – WF
import { processingContext } from './MediaFragment.js';   // 71808 – processingContext

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default timescale used when no fragments are available (milliseconds). */
const DEFAULT_TIMESCALE = 1000;

// ---------------------------------------------------------------------------
// MediaFragment
// ---------------------------------------------------------------------------

/**
 * A single downloadable / bufferable media fragment.
 *
 * Extends `StreamRequest` which provides the base stream reference, content
 * length, read-position (byte offset) and convenience accessors for movie ID,
 * media type, bitrate, timescale, etc.
 */
export class MediaFragment extends StreamRequest {
  // -----------------------------------------------------------------------
  // Construction
  // -----------------------------------------------------------------------

  /**
   * @param {object} stream          - The parent stream descriptor.
   * @param {object} segment         - The media segment this fragment belongs to.
   * @param {object} fragmentInfo    - Per-fragment metadata from the manifest / index.
   * @param {Function} [metadataProvider] - Optional callback returning cached metadata.
   */
  constructor(stream, segment, fragmentInfo, metadataProvider) {
    super(stream, fragmentInfo);

    /** @type {boolean} Whether this fragment has been marked as queued. */
    this._queued = false;

    MediaFragment.initializeFragment(this, stream, segment, fragmentInfo, metadataProvider);
  }

  // -----------------------------------------------------------------------
  // Static helpers
  // -----------------------------------------------------------------------

  /**
   * Populate all instance fields from the supplied fragment metadata.
   *
   * Extracted as a static method so it can be invoked both from the
   * constructor and from reinitialisation paths.
   *
   * @param {MediaFragment} target
   * @param {object}        stream
   * @param {object}        segment
   * @param {object}        fragmentInfo
   * @param {Function}      [metadataProvider]
   */
  static initializeFragment(target, stream, segment, fragmentInfo, metadataProvider) {
    // Delegate base-class field initialisation.
    StreamRequest.initializeRequest(target, stream, fragmentInfo);

    /** @type {number} Index of this fragment within the stream's fragment list. */
    target._index = fragmentInfo.index;

    /** @type {number} Content-start tick (in timescale units). */
    target._contentStartTicks = fragmentInfo.contentStartTicks;

    /** @type {number} Content-end tick (in timescale units). */
    target._contentEndTicks = fragmentInfo.contentEndTicks;

    /** @type {number|undefined} VMAF quality score (fragment-level or stream-level fallback). */
    target._vmaf = fragmentInfo.vmaf ? fragmentInfo.vmaf : stream.vmaf;

    /** @type {object|undefined} Encryption / DRM key info. */
    target._keyInfo = fragmentInfo.qz;

    /** @type {object} The segment descriptor this fragment belongs to. */
    target._segment = segment;

    /** @type {Function|undefined} Callback providing cached metadata value. */
    target._metadataProvider = metadataProvider;

    /** @type {boolean} Whether this is the very first fragment of a playback session. */
    target._isFirstFragment = !!fragmentInfo.xn;

    /** @type {boolean} Whether state info is attached. */
    target._hasStateInfo = !!fragmentInfo.stateInfo;

    /** @type {number} CDN region identifier (0 = default). */
    target._region = fragmentInfo.region ?? 0;

    /** @type {boolean} Whether this fragment requires a key-rotation update. */
    target._requiresKeyUpdate = !!fragmentInfo.kUa;

    /** @type {boolean} Whether an auxiliary buffer is used. */
    target._hasAuxiliaryBuffer = !!fragmentInfo.AB;

    /**
     * @type {MediaFragment|FragmentDataProxy}
     * If the presentation window differs from the raw content window, a
     * FragmentDataProxy is used to remap start/end ticks. Otherwise the
     * fragment itself acts as its own data source.
     */
    target._dataSource =
      (fragmentInfo.TH === undefined || fragmentInfo.UL === undefined) ||
      (fragmentInfo.TH === fragmentInfo.contentStartTicks && fragmentInfo.UL === fragmentInfo.contentEndTicks)
        ? target
        : new FragmentDataProxy(target, {
            contentStartTicks: fragmentInfo.TH,
            contentEndTicks: fragmentInfo.UL,
          });

    /** @type {*} Auxiliary data associated with the fragment. */
    target._auxiliaryData = fragmentInfo.awa;

    /** @type {Array|undefined} Additional Stream Access Points within this fragment. */
    target._additionalSAPs = fragmentInfo.additionalSAPs;

    /** @type {boolean} Whether the stream uses random-access positioning. */
    target._randomAccessPositioning = stream.R0;

    /**
     * @type {object|undefined} Parsed edit-window (start/end sample offsets)
     * derived from the ASE location history.
     */
    target._editWindow = fragmentInfo.ase_location_history
      ? target._parseEditWindow(fragmentInfo.ase_location_history)
      : undefined;

    /** @type {*} Sample version identifier. */
    target._sampleVersion = fragmentInfo.sv;

    /** @type {boolean} Whether data has been fully appended to the source buffer. */
    target._appended = false;

    /** @type {boolean} Whether the last response chunk has been received. */
    target._lastChunkReceived = false;

    /** @type {Array} Queued raw data chunks (before the iterator is created). */
    target._dataChunks = [];
  }

  // -----------------------------------------------------------------------
  // Static – fragment statistics builder
  // -----------------------------------------------------------------------

  /**
   * Build aggregate statistics for an array of fragments.
   *
   * Returns a `FragmentStatistics` instance containing parallel typed arrays
   * of durations, byte sizes, stream indices, and VMAF scores.
   *
   * @param {MediaFragment[]} fragments
   * @returns {FragmentStatistics}
   */
  static buildFragmentStatistics(fragments) {
    const length = fragments.length;
    const durations = new Uint32Array(length);
    const sizes = new Uint32Array(length);
    const streamIndices = new Uint8Array(length);
    const vmafScores = new Uint8Array(length);
    let totalSize = 0;

    for (let i = 0; i < length; ++i) {
      const frag = fragments[i];
      const size = frag.contentLength;

      durations[i] = frag._contentEndTicks - frag._contentStartTicks;
      sizes[i] = size;
      streamIndices[i] = frag.stream.streamIndex;

      if (frag.vmaf !== undefined && frag.vmaf !== null) {
        vmafScores[i] = frag.vmaf;
      }

      totalSize += size;
    }

    return new FragmentStatistics(
      durations,
      sizes,
      length ? fragments[0].timescaleValue : DEFAULT_TIMESCALE,
      totalSize,
    );
  }

  // -----------------------------------------------------------------------
  // Read-only properties
  // -----------------------------------------------------------------------

  /** @returns {boolean} Always `true` – type-guard for media fragments. */
  get isMediaFragment() {
    return true;
  }

  /** @returns {boolean} Always `true` – indicates this is a requestable resource. */
  get isRequestable() {
    return true;
  }

  /** @returns {number} Fragment index within its parent stream. */
  get index() {
    return this._index;
  }

  /** @returns {number|undefined} VMAF quality score. */
  get vmaf() {
    return this._vmaf;
  }

  /**
   * Computed bitrate in kbit/s based on content length and segment duration.
   * @returns {number}
   */
  get computedBitrateKbps() {
    return (8 * this.contentLength) / this.offset.playbackSegment;
  }

  /** @returns {number} Content-start tick value. */
  get contentStartTicks() {
    return this._contentStartTicks;
  }

  /** @returns {number} Content-end tick value. */
  get contentEndTicks() {
    return this._contentEndTicks;
  }

  /**
   * Cached metadata value obtained from the metadata provider callback.
   * Falls back to `0` when no provider is set.
   * @returns {number}
   */
  get cachedMetadata() {
    return this._metadataProvider?.call(this) ?? 0;
  }

  /** @returns {boolean} Whether this is the first fragment of a playback session. */
  get isFirstFragment() {
    return this._isFirstFragment;
  }

  /** @returns {boolean} Whether the fragment carries state information. */
  get hasStateInfo() {
    return this._hasStateInfo;
  }

  /** @returns {number} CDN region identifier. */
  get region() {
    return this._region;
  }

  /** @returns {boolean} Whether the fragment requires a DRM key update. */
  get requiresKeyUpdate() {
    return this._requiresKeyUpdate;
  }

  /** @returns {boolean} Whether auxiliary buffer data is present. */
  get hasAuxiliaryBuffer() {
    return this._hasAuxiliaryBuffer;
  }

  /** @returns {*} Auxiliary data payload. */
  get auxiliaryData() {
    return this._auxiliaryData;
  }

  /** @returns {Array|undefined} Additional Stream Access Points. */
  get additionalSAPs() {
    return this._additionalSAPs;
  }

  /** @returns {object|undefined} The parsed edit window. */
  get editWindow() {
    return this._editWindow;
  }

  /** @returns {*} Sample version identifier. */
  get sampleVersion() {
    return this._sampleVersion;
  }

  /**
   * Effective sample count after applying the edit window.
   * If an edit window is set the count is `(end ?? sampleCount) - start`,
   * otherwise the raw `sampleCount` is returned.
   * @returns {number}
   */
  get effectiveSampleCount() {
    if (this._editWindow) {
      return (this._editWindow.end ?? this.sampleCount) - this._editWindow.start;
    }
    return this.sampleCount;
  }

  /**
   * Presentation start ticks (may differ from raw content start when a
   * `FragmentDataProxy` is in use).
   * @returns {number}
   */
  get presentationStartTicks() {
    return this._dataSource.contentStartTicks;
  }

  /**
   * Presentation end ticks (may differ from raw content end when a
   * `FragmentDataProxy` is in use).
   * @returns {number}
   */
  get presentationEndTicks() {
    return this._dataSource.contentEndTicks;
  }

  /** @returns {number} Duration in ticks of the presentation window. */
  get durationTicks() {
    return this._dataSource.durationTicks;
  }

  /** @returns {object} Byte offset descriptor from the data source. */
  get dataOffset() {
    return this._dataSource.offset;
  }

  /** @returns {object} Presentation start time (TimeUtil). */
  get presentationStartTime() {
    return this._dataSource.presentationStartTime;
  }

  /** @returns {object} Segment end time (TimeUtil). */
  get segmentEndTime() {
    return this._dataSource.segmentEndTime;
  }

  /**
   * Number of frames derived from duration ticks and frame duration.
   * @returns {number}
   */
  get frameCount() {
    const ticks = this.durationTicks;
    assert(ticks);
    return ticks / this.stream.frameDuration.$;
  }

  /** @returns {boolean} Whether the final data chunk has been received. */
  get lastChunkReceived() {
    return this._lastChunkReceived;
  }

  /** @returns {boolean} Whether any queued data chunks exist. */
  get hasQueuedData() {
    return this._dataChunks.length > 0;
  }

  // -----------------------------------------------------------------------
  // Mutation methods
  // -----------------------------------------------------------------------

  /**
   * Trim the fragment's content window to new start / end timestamps.
   *
   * If the current edit window covers the entire fragment, the content ticks
   * are updated directly and the data source is reset to `this`. Otherwise
   * a new `FragmentDataProxy` is created.
   *
   * @param {object} newStart   - TimeUtil-compatible start timestamp.
   * @param {object} newEnd     - TimeUtil-compatible end timestamp.
   * @param {boolean} isExtend  - `true` when extending rather than trimming.
   */
  trimFragment(newStart, newEnd, isExtend) {
    assert(newStart.timescaleValue === this.timescaleValue, 'Cannot change content timestamp timescale');
    assert(newEnd.timescaleValue === this.timescaleValue, 'Cannot change content timestamp timescale');

    if (this._isWholeFragment(this._editWindow)) {
      this._contentStartTicks = newStart.$;
      this._contentEndTicks = newEnd.$;
      this._dataSource = this;

      if (this._editWindow) {
        this._editWindow = {
          ...this._editWindow,
          start: 0,
          end: null,
        };
      }
    } else {
      assert(this._editWindow, 'Undefined edit window should be handled as whole fragment');

      const prevSampleCount = this.sampleCount;

      this._dataSource = new FragmentDataProxy(this, {
        contentStartTicks: newStart.$,
        contentEndTicks: newEnd.$,
      });

      const currentEdit = this._editWindow;
      const editStart = currentEdit.start;
      const editEnd = currentEdit.end;

      this._editWindow.end =
        isExtend || prevSampleCount >= this.sampleCount
          ? (editEnd === null || editEnd >= this.sampleCount ? null : this._editWindow.end)
          : (editEnd === null ? prevSampleCount : editEnd);

      this._contentStartTicks = newStart.item(this.frameDuration.wh(editStart)).$;
      this._contentEndTicks = newStart.item(
        this.frameDuration.wh(this._editWindow.end ?? this.sampleCount),
      ).$;
    }
  }

  /**
   * Extend the fragment to contain `sampleCount` frames from the current
   * content start.
   *
   * @param {number} sampleCount - Desired total sample count.
   */
  extendFragmentEnd(sampleCount) {
    this.trimFragment(
      this.contentStart.downloadState(this.timescaleValue),
      this.contentStart.item(this.frameDuration.wh(sampleCount)),
      true,
    );
  }

  /**
   * Change the start timestamp of this fragment while keeping the end
   * unchanged. Only valid when no start-edit is already applied.
   *
   * @param {object} newStart - TimeUtil-compatible start timestamp.
   */
  changeStartTimestamp(newStart) {
    assert(
      !this._editWindow || this._editWindow.start === 0,
      'Cannot change start time of fragment with start edit',
    );
    this.trimFragment(newStart, this.contentEnd, true);
  }

  /** Mark this fragment as the first fragment in the playback session. */
  markFirstFragment() {
    this._isFirstFragment = true;
  }

  /** Mark this fragment as carrying state information. */
  markHasStateInfo() {
    this._hasStateInfo = true;
  }

  /**
   * Attach DRM / encryption key info to this fragment.
   *
   * @param {object} keyProvider - Object exposing key-exchange methods.
   */
  attachKeyInfo(keyProvider) {
    this._keyInfo = {
      fe: keyProvider.NBb(),
      get nI() {
        return keyProvider.xO;
      },
    };
  }

  /**
   * Update the sample version identifier.
   * @param {*} version
   */
  setSampleVersion(version) {
    this._sampleVersion = version;
  }

  /**
   * Update the CDN region and associated flags.
   *
   * @param {number}  region              - New region identifier.
   * @param {boolean} requiresKeyUpdate   - Whether a key update is needed.
   * @param {boolean} hasAuxiliaryBuffer  - Whether auxiliary buffer data exists.
   */
  setRegionInfo(region, requiresKeyUpdate, hasAuxiliaryBuffer) {
    this._region = region;
    this._requiresKeyUpdate = requiresKeyUpdate;
    this._hasAuxiliaryBuffer = hasAuxiliaryBuffer;
  }

  /**
   * Apply or update the edit window for this fragment.
   *
   * When the resulting window covers the entire fragment the data source is
   * reset to `this`; otherwise a `FragmentDataProxy` is created / reused.
   *
   * @param {object} [editSpec={}] - Partial edit-window descriptor.
   */
  setEditWindow(editSpec = {}) {
    const frameDurationTicks = this.stream.frameDuration.$;
    const previousWindow = this._editWindow || { start: 0, end: null };
    const parsed = this._parseEditWindow(editSpec);

    if (this._isWholeFragment(parsed)) {
      this._contentStartTicks = this._dataSource.contentStartTicks;
      this._contentEndTicks = this._dataSource.contentEndTicks;
      this._dataSource = this;
    } else {
      if (!this._dataSource || this._dataSource === this) {
        this._dataSource = new FragmentDataProxy(this, this);
      }
      this._contentStartTicks =
        this._dataSource.contentStartTicks + parsed.start * frameDurationTicks;
      this._contentEndTicks =
        this._dataSource.contentStartTicks +
        (parsed.end ?? this.sampleCount) * frameDurationTicks;
    }

    this._editWindow = { ...previousWindow, ...parsed };
  }

  /**
   * Trim samples from the beginning of the fragment.
   *
   * @param {number} [samplesToTrim=1] - Number of leading samples to remove.
   */
  trimStart(samplesToTrim = 1) {
    if (this._editWindow) {
      this.setEditWindow({
        start: this._editWindow.start + samplesToTrim,
        end: this._editWindow.end,
      });
    } else {
      this.setEditWindow({ start: samplesToTrim });
    }
  }

  /**
   * Trim samples from the end of the fragment.
   *
   * @param {number} samplesToTrim - Number of trailing samples to remove.
   */
  trimEnd(samplesToTrim) {
    if (this._editWindow) {
      this.setEditWindow({
        start: this._editWindow.start,
        end: (this._editWindow.end || 0) - samplesToTrim,
      });
    } else {
      this.setEditWindow({ start: 0, end: -samplesToTrim });
    }
  }

  /**
   * Collapse the fragment to zero duration (keeping its position).
   * Used when the fragment needs to be logically "empty" but still present
   * in the fragment list.
   */
  collapseToEmpty() {
    if (this._editWindow) {
      this.setEditWindow({
        start: this._editWindow.start,
        end: this._editWindow.start,
      });
    } else {
      this.setEditWindow({ start: 0, end: 0 });
    }
  }

  /**
   * Mark the last-fragment-of-period flag.
   *
   * @param {*} value - Last-fragment metadata.
   */
  markLastFragment(value) {
    if (!this._editWindow) this.setEditWindow();
    this._editWindow.jAa = value;
  }

  /**
   * Enable fade-in on this fragment.
   *
   * @param {number} [duration] - Optional fade-in duration.
   */
  enableFadeIn(duration) {
    if (!this._editWindow) this.setEditWindow();
    this._editWindow.fadeIn = true;
    if (duration) this._editWindow.yzb = duration;
  }

  /**
   * Enable fade-out on this fragment.
   *
   * @param {number} [duration] - Optional fade-out duration.
   */
  enableFadeOut(duration) {
    if (!this._editWindow) this.setEditWindow();
    this._editWindow.fadeOut = true;
    if (duration) this._editWindow.zzb = duration;
  }

  // -----------------------------------------------------------------------
  // Keyframe / SAP lookup
  // -----------------------------------------------------------------------

  /**
   * Find the keyframe SAP at or before the given playback position (video).
   *
   * @param {number} positionMs - Playback position in milliseconds.
   * @returns {{ sampleIndex: number, presentationTime: number }|undefined}
   */
  findKeyframeSAP(positionMs) {
    if (positionMs < this.presentationStartTime.playbackSegment ||
        positionMs >= this.segmentEndTime.playbackSegment) {
      return undefined;
    }
    if (!this._additionalSAPs || !this._additionalSAPs.length) {
      return undefined;
    }

    const relativeSample = new TimeUtil(
      positionMs + 1 - this.presentationStartTime.playbackSegment,
      DEFAULT_TIMESCALE,
    ).scaledValue(this.stream.frameDuration);

    for (let i = this._additionalSAPs.length - 1; i >= 0; --i) {
      const sap = this._additionalSAPs[i];
      if (sap.start <= relativeSample) return sap;
    }

    return {
      Jl: 0,
      hasContent: this.contentStart.playbackSegment,
    };
  }

  /**
   * Find the current media segment SAP at or before the given position.
   * Identical to `findKeyframeSAP` but used in a different call-site context.
   *
   * @param {number} positionMs
   * @returns {{ sampleIndex: number, presentationTime: number }|undefined}
   */
  findCurrentSegmentSAP(positionMs) {
    // Implementation is intentionally identical to findKeyframeSAP (mirrors original).
    return this.findKeyframeSAP(positionMs);
  }

  /**
   * Locate the sample closest to `positionMs` (audio path / non-SAP).
   *
   * @param {number}  positionMs       - Playback position in milliseconds.
   * @param {boolean} ceilRounding     - `true` to round up, `false` to round down.
   * @returns {{ Jl: number, hasContent: number }|undefined}
   */
  findSampleAtPosition(positionMs, ceilRounding) {
    if (positionMs < this.presentationStartTime.playbackSegment ||
        positionMs >= this.segmentEndTime.playbackSegment) {
      return undefined;
    }

    if (!ceilRounding && this._randomAccessPositioning) {
      return {
        Jl: 0,
        hasContent: this.presentationStartTime.playbackSegment,
      };
    }

    const frameDurationTicks = this.frameDuration.$;
    const timescale = this.frameDuration.timescaleValue;
    const totalFrames = Math.floor(this.durationTicks / frameDurationTicks);

    const roundFn = ceilRounding ? Math.ceil : Math.floor;
    const frameIndex = Math.min(
      roundFn(
        (TimeUtil.BKb(positionMs, timescale) -
          this.contentStartTicks +
          (ceilRounding ? -1 : 1) * (timescale / DEFAULT_TIMESCALE - 1)) /
          frameDurationTicks,
      ),
      totalFrames,
    );

    const presentationTime = TimeUtil.z7a(
      this.contentStartTicks + frameIndex * frameDurationTicks,
      timescale,
    );

    return frameIndex === totalFrames
      ? undefined
      : { Jl: frameIndex, hasContent: presentationTime };
  }

  /**
   * Look up the closest sample for the given position, dispatching to the
   * video (keyframe) or audio (sample) path as appropriate.
   *
   * @param {number} positionMs
   * @returns {object|undefined}
   */
  findSampleBefore(positionMs) {
    return this.mediaType === MediaTypeConstants.pq.U
      ? this.findKeyframeSAP(positionMs)
      : this.findSampleAtPosition(positionMs, false);
  }

  /**
   * Look up the next sample at or after the given position, dispatching to
   * the video (segment SAP) or audio (sample) path.
   *
   * @param {number} positionMs
   * @returns {object|undefined}
   */
  findSampleAfter(positionMs) {
    return this.mediaType === MediaTypeConstants.pq.U
      ? this.findCurrentSegmentSAP(positionMs)
      : this.findSampleAtPosition(positionMs, true);
  }

  // -----------------------------------------------------------------------
  // Data / response handling
  // -----------------------------------------------------------------------

  /**
   * Determine whether the fragment has been modified (edit window applied or
   * data chunks received).
   *
   * @returns {boolean}
   */
  isModified() {
    return this._editWindow ? this.lastChunkReceived : this.hasQueuedData;
  }

  /**
   * Create and return an async iterator for the response data stream.
   * May only be called once per fragment.
   *
   * @returns {AsyncIterator}
   */
  createResponseIterator() {
    assert(!this._responseIterator, 'Should not get response iterator more than once');
    this._responseIterator = new QueueIterator(this.stream.console);
    return this._responseIterator.getIterator();
  }

  /**
   * Enqueue a chunk of raw response data.
   *
   * If the response iterator has already been created the chunk is fed
   * directly into the queue; otherwise it is buffered in `_dataChunks`.
   *
   * @param {*}       chunk           - The raw data chunk.
   * @param {boolean} isLastChunk     - `true` when this is the final chunk.
   */
  loadRawData(chunk, isLastChunk) {
    if (this._responseIterator) {
      this._responseIterator.enqueue(chunk);
      if (isLastChunk) this._responseIterator.prioritizeBranch();
    } else {
      this._dataChunks.push(chunk);
    }
    this._lastChunkReceived = isLastChunk;
  }

  /** Clear all buffered data chunks. */
  clearDataChunks() {
    this._dataChunks = [];
  }

  /**
   * Merge metadata from a continuation fragment (e.g. when a CMAF chunk
   * extends the current fragment).
   *
   * @param {object} continuation - The continuation fragment metadata.
   */
  mergeFragmentData(continuation) {
    this.contentLength += continuation.contentLength;
    this._contentEndTicks = continuation.contentEndTicks;

    if (this._editWindow) {
      this._dataSource = new FragmentDataProxy(this, {
        contentStartTicks: this.presentationStartTicks,
        contentEndTicks: this._contentEndTicks,
      });
      this._editWindow.end = this.sampleCount;
    }
  }

  // -----------------------------------------------------------------------
  // Telemetry / logging
  // -----------------------------------------------------------------------

  /**
   * Build a log-data payload describing the edit applied to this fragment,
   * suitable for the "endplay" telemetry event.
   *
   * @param {*} [extra] - Optional extra value appended to the log array.
   * @returns {object}  Structured log entry.
   */
  buildEditLogEntry(extra) {
    const entry = {
      type: 'logdata',
      target: 'endplay',
      fields: {},
    };

    const fieldName = this.mediaType === MediaTypeConstants.pq.V
      ? 'audioedit'
      : 'videoedit';

    const isStartAligned = this.contentStart.equal(this.presentationStartTime);
    const values = [
      isStartAligned ? this.segmentEndTime.playbackSegment : this.presentationStartTime.playbackSegment,
      isStartAligned ? -this.offset.playbackSegment : this.offset.G,
    ];

    if (extra) values.push(extra);

    entry.fields[fieldName] = { type: 'array', value: values };
    return entry;
  }

  // -----------------------------------------------------------------------
  // Byte-offset lookup
  // -----------------------------------------------------------------------

  /**
   * Retrieve the byte offset within the segment for a given sample index
   * (based on SAP data).
   *
   * @param {number} sampleIndex
   * @returns {number|undefined}
   */
  getByteOffsetForSample(sampleIndex) {
    let offset;
    if (this._additionalSAPs) {
      for (let i = 0; i < this._additionalSAPs.length; ++i) {
        if (this._additionalSAPs[i].start === sampleIndex) {
          offset = this._additionalSAPs[i].offset;
        }
      }
    }
    return offset;
  }

  // -----------------------------------------------------------------------
  // Serialisation
  // -----------------------------------------------------------------------

  /** @returns {string} Human-readable summary. */
  toString() {
    return (
      `[${this.selectedStreamId}, ${this.bitrate}kbit/s, ` +
      `c:${this.presentationStartTime.playbackSegment}-${this.segmentEndTime.playbackSegment},` +
      `p:${this.timestamp.playbackSegment}-${this.previousState.playbackSegment},` +
      `d:${this.offset.playbackSegment}]`
    );
  }

  /** @returns {object} JSON-serialisable representation. */
  toJSON() {
    return {
      movieId: this.R,
      streamId: this.selectedStreamId,
      bitrate: this.bitrate,
      index: this.index,
      startPts: this.presentationStartTime.playbackSegment,
      endPts: this.segmentEndTime.playbackSegment,
      contentStartPts: this.presentationStartTime.playbackSegment,
      contentEndPts: this.segmentEndTime.playbackSegment,
      fragmentStartPts: this.contentStart.playbackSegment,
      fragmentEndPts: this.contentEnd.playbackSegment,
      edit: this._editWindow,
    };
  }

  // -----------------------------------------------------------------------
  // Private helpers
  // -----------------------------------------------------------------------

  /**
   * Parse a raw edit-window descriptor into normalised form.
   *
   * - `start` is clamped to `>= 0`.
   * - `end` is set to `null` when it equals (or exceeds) `sampleCount`,
   *   and negative values are interpreted as offsets from the end.
   *
   * @param {object} raw - Raw edit descriptor (`{ start?, end? }`).
   * @returns {{ start: number, end: number|null }}
   * @private
   */
  _parseEditWindow(raw) {
    const start = Math.max(raw.start || 0, 0);
    const end =
      raw.end === undefined || raw.end === null || raw.end === this.sampleCount
        ? null
        : Math.min(
            this.sampleCount,
            Math.max(start, raw.end < 0 ? this.sampleCount + raw.end : raw.end),
          );

    return { ...raw, start, end };
  }

  /**
   * Determine whether the given edit window represents the full fragment
   * (no trimming).
   *
   * @param {object|undefined} editWindow
   * @returns {boolean}
   * @private
   */
  _isWholeFragment(editWindow) {
    return !editWindow || (editWindow.start === 0 && (editWindow.end === this.sampleCount || editWindow.end === null));
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------
outputList(processingContext, MediaFragment);

export default MediaFragment;
