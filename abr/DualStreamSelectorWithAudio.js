/**
 * Netflix Cadmium Player — Dual Stream Selector with Audio
 *
 * Extends `BaseStreamSelector` to handle separate audio and video stream
 * selection where each media type is selected independently but shares a
 * bandwidth budget.  Unlike `DualStreamSelector` (which uses joint
 * audio+video combinations), this selector:
 *
 * 1. Selects audio and video streams as individual tracks.
 * 2. Uses a pair of throughput predictors — one for audio bandwidth
 *    allocation, one for video.
 * 3. Supports configurable audio bandwidth profiles (switchable profiles).
 * 4. Reports separate pacing rates for audio (`internal_Wza`) and video
 *    (`T5a`).
 *
 * @module DualStreamSelectorWithAudio
 */

// Dependencies
// import { __extends, __assign } from './modules/Module_22970.js';
// import { MediaType }           from './modules/Module_45247.js';
// import { timeSlice, D2a }      from './modules/Module_65161.js';
// import { pWa as createPredictor } from './modules/Module_14246.js';
// import { jLa as SingleStreamListBuilder } from './modules/Module_44284.js';
// import { assert }              from './modules/Module_52571.js';
// import { isLiveStream }        from './modules/Module_8149.js';
// import { BaseStreamSelector }  from './modules/Module_54477.js';

/**
 * Dual stream selector with independent audio handling.
 *
 * Manages audio and video selection separately, each with its own throughput
 * predictor.  Provides explicit control over audio-rate signalling and
 * bandwidth allocation between the two media types.
 *
 * @extends BaseStreamSelector
 */
export class DualStreamSelectorWithAudio extends BaseStreamSelector {
  /**
   * @param {string} name - Selector name.
   * @param {Object} config - ABR configuration.
   * @param {Object} streamBundle - Stream bundle reference.
   * @param {Object} trackInfo - Track information.
   * @param {boolean} enablePacerate - Whether pace-rate control is enabled.
   */
  constructor(name, config, streamBundle, trackInfo, enablePacerate) {
    super(name, config, streamBundle, trackInfo, enablePacerate);

    const predictor = createPredictor(this.config);

    /** @type {Function} Sets the audio bitrate for bandwidth allocation */
    this.setAudioBitrate = predictor.internal_Wza.bind(predictor);

    /** @type {Function} Sets the video bitrate for bandwidth allocation */
    this.setVideoBitrate = predictor.T5a.bind(predictor);

    /** @type {Function} Returns the audio bandwidth allocation */
    this.getAudioAllocation = predictor.UUa.bind(predictor);

    /** @type {Function} Returns the video bandwidth allocation */
    this.getVideoAllocation = predictor.ZWa.bind(predictor);

    /**
     * Per-media-type throughput predictors.
     * Index 0 = audio bandwidth allocation predictor.
     * Index 1 = video throughput predictor.
     * @type {Function[]}
     */
    this.throughputPredictors = [
      predictor.calculateAudioBandwidthAllocation.bind(predictor),
      predictor.predict.bind(predictor),
    ];
  }

  // ---------------------------------------------------------------------------
  // Core selection
  // ---------------------------------------------------------------------------

  /**
   * Selects the optimal stream for the given media type (audio or video)
   * and determines download-eligible formats.
   *
   * @param {Object} sessionState
   * @param {Object} bufferState
   * @param {Object} filterConfig
   * @param {number} currentPosition
   * @param {Object} playerState
   * @param {Object} mediaTrackInfo
   * @param {*} bufferingState
   * @param {Object} [audioFilterOverride]
   * @param {Object} [videoFilterOverride]
   * @param {boolean} [forceSelection]
   * @returns {Object} Selection result with `stream`, `downloadableFormats`,
   *   `initSelReason`, `cdnId`, `networkInfo`, `streamList`, and
   *   `selectionResult`.
   */
  selectStreamAndLocations(sessionState, bufferState, filterConfig, currentPosition, playerState, mediaTrackInfo, bufferingState, audioFilterOverride, videoFilterOverride, forceSelection) {
    let downloadableFormats = [];

    // Choose the correct filter override for the current media type
    const activeFilter = mediaTrackInfo.mediaType === MediaType.V
      ? audioFilterOverride
      : videoFilterOverride;

    const track = mediaTrackInfo.track;

    // Validate track location
    if (!this.validateTrack(track, isLiveStream(track) ? track.wsa(currentPosition) : undefined)) {
      return {
        stream: undefined,
        downloadableFormats,
        reason: "locationSelectionFailure",
      };
    }

    // Build state and stream list
    const streamState = this.buildStreamState(sessionState, bufferState, playerState, mediaTrackInfo, !!forceSelection);
    const streamSelector = mediaTrackInfo.streamSelector;
    const streamBundle = streamSelector.configObject;
    const downloadHint = mediaTrackInfo.UH;
    const previousSelection = streamBundle.elementList;

    const streamListResult = this._buildStreamList(mediaTrackInfo, bufferState, sessionState, filterConfig, activeFilter);
    const streams = streamListResult.first;

    // All streams filtered out
    if (streams.length === 0 && activeFilter?.fpa) {
      return {
        stream: undefined,
        downloadableFormats,
        reason: "allStreamsFiltered",
      };
    }

    // If the previous selection's track changed, find the closest match
    let currentSelection = previousSelection;
    if (currentSelection && !currentSelection.track.equals(track)) {
      currentSelection = this._findClosestStream(currentSelection, streams);
    }

    const mediaType = mediaTrackInfo.mediaType;
    const isAudio = mediaType === MediaType.V;

    // For audio, check if a switch is actually needed
    if (isAudio && currentSelection && !this._shouldSwitchAudio(streamBundle, currentSelection)) {
      if (this.config.graphSelectorSetAudioRate) {
        this.setAudioBitrate(currentSelection.bitrate);
      }
      return { stream: currentSelection, downloadableFormats };
    }

    // Select the throughput predictor for this media type
    const predictor = this.throughputPredictors[mediaType];
    const priorAllocation = isAudio ? this.getVideoAllocation() : this.getAudioAllocation();

    // Run the ABR algorithm
    const selectionResult = streamSelector.selectStream(
      streamState, streamListResult, priorAllocation,
      predictor, mediaTrackInfo.OYa(),
      bufferingState, downloadHint,
    );

    if (!selectionResult) {
      return {
        stream: undefined,
        downloadableFormats,
        reason: "streamSelectionFailure",
      };
    }

    // CDN metadata
    const cdnId = {
      Mh: selectionResult.cprStreamId,
      cprNetworkId: selectionResult.cprNetworkId,
    };

    // Initial selection reason
    let initSelReason;
    if (selectionResult.reason) {
      initSelReason = selectionResult.reason;
      this.updateVideoBitrate(mediaType, streams, filterConfig);
    }

    // Emit selection event
    this._emitSelectionEvent(mediaType, selectionResult, streams);

    // Update bundle and signal the selected bitrate
    const selectedStream = selectionResult.mediaSource || streams[0];
    const selectedBitrate = selectedStream.bitrate;

    if (isAudio) {
      if (this.config.graphSelectorSetAudioRate) {
        this.setAudioBitrate(selectedBitrate);
      }
    } else {
      this.setVideoBitrate(selectedBitrate);
    }

    streamBundle.oV(selectedStream);

    // Determine pre-downloadable formats
    downloadableFormats = streams.filter(
      (s) => s !== selectedStream && s.qx && !s.isLive && !s.fragmentIndex?.length,
    );

    return {
      stream: selectedStream,
      downloadableFormats,
      initSelReason,
      cdnId,
      networkInfo: selectionResult.networkInfo,
      streamList: streams,
      selectionResult,
    };
  }

  // ---------------------------------------------------------------------------
  // Private: stream list construction
  // ---------------------------------------------------------------------------

  /**
   * Builds a single-type stream list with look-ahead segments.
   *
   * @param {Object} mediaTrackInfo
   * @param {Object} bufferState
   * @param {Object} sessionState
   * @param {Object} filterConfig
   * @param {Object} [filterOverride]
   * @returns {Object}
   * @private
   */
  _buildStreamList(mediaTrackInfo, bufferState, sessionState, filterConfig, filterOverride) {
    const streamList = new SingleStreamListBuilder();

    streamList.OQ(
      this.filterStreams(
        mediaTrackInfo.track.downloadables,
        sessionState, filterConfig,
        mediaTrackInfo.isLive.qualityDescriptor,
        mediaTrackInfo.isPlaybackActive(),
        filterOverride,
      ),
    );

    let remainingDuration = this.config.maxSimulationDuration
      - mediaTrackInfo.isLive.previousState.lowestWaterMarkLevelBufferRelaxed(bufferState).playbackSegment;

    let current = mediaTrackInfo;

    while (remainingDuration > 0) {
      const next = this.navigator.next(current);
      if (!next?.isPlaybackActive) break;

      streamList.OQ(
        this.filterStreams(
          next.track.downloadables,
          sessionState, filterConfig,
          next.isLive.qualityDescriptor,
          next.isPlaybackActive(),
          filterOverride,
        ),
      );

      remainingDuration -= next.isLive.currentSegment.offset.playbackSegment;
      current = next;
    }

    return streamList;
  }

  // ---------------------------------------------------------------------------
  // Private: audio-switch decision
  // ---------------------------------------------------------------------------

  /**
   * Determines whether an audio track switch is warranted.
   *
   * When `switchableAudioProfiles` is configured, switches are always allowed.
   * Otherwise a switch is only allowed when the CDN location has changed.
   *
   * @param {Object} streamBundle
   * @param {Object} candidateStream
   * @returns {boolean}
   * @private
   */
  _shouldSwitchAudio(streamBundle, candidateStream) {
    if (this.config.switchableAudioProfiles.length > 0) return true;

    const previousLocation = streamBundle.y1;
    return !previousLocation || previousLocation !== candidateStream.location;
  }

  // ---------------------------------------------------------------------------
  // Private: closest-stream search
  // ---------------------------------------------------------------------------

  /**
   * Finds the stream in `candidates` whose bitrate is closest to (but not
   * exceeding) the reference stream's bitrate.
   *
   * @param {Object} reference
   * @param {Object[]} candidates
   * @returns {Object}
   * @private
   */
  _findClosestStream(reference, candidates) {
    let closest = candidates[0];
    candidates
      .filter((c) => c.isReadyForSelection)
      .every((c) => (c.bitrate <= reference.bitrate ? (closest = c, true) : false));
    return closest;
  }

  // ---------------------------------------------------------------------------
  // Buffering-complete evaluation
  // ---------------------------------------------------------------------------

  /**
   * Evaluates whether prebuffering is complete for the given media track.
   *
   * @param {Object} sessionState
   * @param {Object} playerPhase
   * @param {Object} bufferState
   * @param {boolean} prebufferTimeLimitReached
   * @param {number} playbackRate
   * @param {Object} mediaTrackInfo
   * @param {*} previousBufferingState
   * @returns {Object}
   */
  evaluateBufferingComplete(sessionState, playerPhase, bufferState, prebufferTimeLimitReached, playbackRate, mediaTrackInfo, previousBufferingState) {
    // Already playing
    if (!timeSlice(playerPhase)) {
      return { complete: true, reason: "playing" };
    }

    // Track not ready
    if (!mediaTrackInfo.W2a) {
      return { complete: false, reason: "unknown" };
    }

    // Already evaluated
    if (mediaTrackInfo.AMb) {
      assert(mediaTrackInfo.rxa);
      return mediaTrackInfo.rxa;
    }

    const streamSelector = mediaTrackInfo.streamSelector;
    const streamBundle = streamSelector.configObject;
    const bufferStats = this.getBufferStats(mediaTrackInfo, bufferState);
    const currentSelection = streamBundle.elementList;
    const bufferLevel = bufferStats.downloadPosition - bufferStats.playbackPosition;

    // Insufficient buffer
    if (bufferLevel < this.config.minPrebufSize || currentSelection === undefined) {
      return { complete: false, hw: bufferLevel, reason: "preBuf" };
    }

    // Audio is always considered complete
    if (mediaTrackInfo.mediaType === MediaType.V) {
      return { complete: true, hw: bufferLevel, reason: "audio" };
    }

    // External complete signal
    const externalReason = sessionState.tQa(mediaTrackInfo.mediaType);
    if (externalReason) {
      return { complete: true, hw: bufferLevel, reason: externalReason };
    }

    // Validate and run the buffering algorithm
    this.validateTrack(mediaTrackInfo.track);

    const singleList = new SingleStreamListBuilder();
    singleList.OQ([currentSelection]);

    streamSelector.internal_Cfa(
      singleList,
      getBufferingPhase(playerPhase),
      bufferStats,
      this.throughputPredictors[mediaTrackInfo.mediaType],
    );

    const result = streamSelector.GA(bufferStats, playerPhase, playbackRate, currentSelection, previousBufferingState);

    if (!result.complete && prebufferTimeLimitReached) {
      return { complete: true, reason: "prebufferTimeLimit", hw: bufferLevel };
    }

    result.hw = bufferLevel;
    return result;
  }

  // ---------------------------------------------------------------------------
  // Event emission
  // ---------------------------------------------------------------------------

  /**
   * Emits a per-media-type `"streamSelection"` event.
   *
   * @param {string} mediaType
   * @param {Object} selectionResult
   * @param {Object[]} streams
   * @private
   */
  _emitSelectionEvent(mediaType, selectionResult, streams) {
    this.events?.emit("streamSelection", {
      type: "streamSelection",
      mediaType,
      result: selectionResult,
      streamList: streams,
    });
  }
}
