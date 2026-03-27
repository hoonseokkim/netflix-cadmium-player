/**
 * Netflix Cadmium Player — Dual Stream Selector
 *
 * Extends `BaseStreamSelector` to handle concurrent audio+video stream
 * selection using joint streams.  This selector:
 *
 * 1. Creates joint (audio+video+text) stream combinations.
 * 2. Delegates to the underlying ABR algorithm for optimal selection.
 * 3. Manages header pre-downloading for adjacent segments.
 * 4. Evaluates buffering-complete state during startup/rebuffer.
 * 5. Emits per-media-type and joint stream-selection events.
 *
 * @module DualStreamSelector
 */

// Dependencies
// import { __extends, __assign, __spreadArray, __read }
//   from '../ads/AdBreakMismatchLogger.js';
// import { MediaType, TEXT_MEDIA_TYPE } from '../core/AseConfigConstants.js';
// import { assert }              from '../ads/AdPoliciesManager.js';
// import { timeSlice, D2a }      from '../core/AsejsEngine.js';
// import { dGa as StreamListBuilder } from './modules/Module_44284.js';
// import { pWa as createPredictor }   from './modules/Module_14246.js';
// import { l7 as JointStreamBuilder } from './modules/Module_56841.js';
// import { dk as isLiveSegment, isLiveStream } from '../network/AseMediaRequest.js';
// import { BaseStreamSelector }  from './modules/Module_54477.js';

/**
 * Dual stream selector for concurrent audio+video streams.
 *
 * Builds joint stream combinations from separate audio, video, and text
 * track lists, selects the optimal combination via the registered ABR
 * algorithm, and propagates the result to each individual media type.
 *
 * @extends BaseStreamSelector
 */
export class DualStreamSelector extends BaseStreamSelector {
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

    /** @type {Function} Bound throughput predictor */
    this.throughputPredictor = predictor.predict.bind(predictor);

    /** @type {JointStreamBuilder} Builder for joint stream combinations */
    this.jointStreamBuilder = new JointStreamBuilder();
  }

  // ---------------------------------------------------------------------------
  // Core selection
  // ---------------------------------------------------------------------------

  /**
   * Selects the optimal joint stream and determines download locations.
   *
   * @param {Object} sessionState - Session-level state.
   * @param {Object} bufferState - Buffer statistics.
   * @param {Object} filterConfig - Stream filter configuration.
   * @param {number} currentPosition - Current playback position.
   * @param {Object} playerState - Player state object.
   * @param {Object} mediaTrackInfo - Info about the media track being selected.
   * @param {*} bufferingState - Previous buffering-complete state.
   * @param {Object} [audioFilterOverride] - Optional audio-specific filter.
   * @param {Object} [videoFilterOverride] - Optional video-specific filter.
   * @param {boolean} [forceSelection] - Force selection even if normally skipped.
   * @returns {Object} Selection result with `stream`, `downloadableFormats`,
   *   `initSelReason`, `cdnId`, `networkInfo`, `streamList`, and
   *   `selectionResult`.
   */
  selectStreamAndLocations(sessionState, bufferState, filterConfig, currentPosition, playerState, mediaTrackInfo, bufferingState, audioFilterOverride, videoFilterOverride, forceSelection) {
    let downloadableFormats = [];
    const track = mediaTrackInfo.track;

    // Validate track location
    if (!this.validateTrack(track, isLiveStream(track) ? track.wsa(currentPosition) : undefined)) {
      return {
        stream: undefined,
        downloadableFormats,
        reason: "locationSelectionFailure",
      };
    }

    const streamSelector = mediaTrackInfo.streamSelector;
    const downloadHint = mediaTrackInfo.UH;
    const previousSelection = streamSelector.getSelectedTrack();
    const mediaType = mediaTrackInfo.mediaType;
    const isAudio = mediaType === MediaType.V;
    const isText = mediaType === MediaType.TEXT_MEDIA_TYPE;

    // For audio or text, fall back to video track info when no previous selection exists
    let referenceTrackInfo = mediaTrackInfo;
    if ((isText || isAudio) && !previousSelection) {
      const videoTrackInfo = mediaTrackInfo.isLive.noop(MediaType.U);
      referenceTrackInfo = videoTrackInfo || referenceTrackInfo;
    }

    // Build the player/buffer state for the algorithm
    const streamState = this.buildStreamState(sessionState, bufferState, playerState, referenceTrackInfo, !!forceSelection);

    // Build joint stream lists
    const streamListResult = this.buildStreamLists(
      mediaTrackInfo, bufferState, sessionState, streamState.state,
      filterConfig, audioFilterOverride, videoFilterOverride, previousSelection,
    );
    const jointStreams = streamListResult.first;

    // Check if all streams were filtered
    const hasFilterOverride = audioFilterOverride?.fpa || videoFilterOverride?.fpa;
    if (jointStreams.length === 0 && hasFilterOverride) {
      return {
        stream: undefined,
        downloadableFormats,
        reason: "allStreamsFiltered",
      };
    }

    // If the previous selection's track changed, find the closest match
    let currentSelection = previousSelection;
    if (currentSelection && !currentSelection.JS(track.mediaType)?.equals(mediaTrackInfo.track)) {
      currentSelection = this._findClosestJointStream(currentSelection, jointStreams);
    }

    // For audio/text with an existing selection, return immediately
    if ((isText || isAudio) && currentSelection) {
      const selectedStream = currentSelection.getStreamsByType(mediaType);
      downloadableFormats = this._getPreDownloadableFormats(jointStreams, currentSelection);
      return { stream: selectedStream, downloadableFormats };
    }

    // Run the ABR algorithm
    const selectionResult = streamSelector.selectStream(
      streamState, streamListResult, 0,
      this.throughputPredictor, referenceTrackInfo.OYa(),
      bufferingState, downloadHint,
    );

    if (!selectionResult) {
      return {
        stream: undefined,
        downloadableFormats,
        reason: "streamSelectionFailure",
      };
    }

    // Extract CDN info
    const cdnId = {
      Mh: selectionResult.cprStreamId,
      cprNetworkId: selectionResult.cprNetworkId,
    };

    // Track initial selection reason
    let initSelReason;
    if (selectionResult.reason) {
      initSelReason = selectionResult.reason;
      this.updateVideoBitrate(mediaType, jointStreams, filterConfig);
    }

    // Emit selection events
    this._emitSelectionEvents(selectionResult, jointStreams);

    // Update bundles with the selected joint stream
    const selectedJoint = selectionResult.mediaSource || jointStreams[0];
    streamSelector.streamBundle(MediaType.V).oV(selectedJoint.getStreamsByType(MediaType.V));
    streamSelector.streamBundle(MediaType.U).oV(selectedJoint.getStreamsByType(MediaType.U));

    downloadableFormats = this._getPreDownloadableFormats(jointStreams, selectedJoint);

    const selectedStream = selectedJoint.getStreamsByType(mediaType);
    const networkInfo = selectionResult.networkInfo;

    // Build list of unique streams for this media type
    const uniqueStreams = Array.from(
      new Set(
        jointStreams
          .map((js) => js.getStreamsByType(mediaType))
          .filter((s) => s !== undefined),
      ),
    );

    const enrichedResult = {
      ...selectionResult,
      Bd: selectedStream,
    };

    return {
      stream: selectedStream,
      downloadableFormats,
      initSelReason,
      cdnId,
      networkInfo,
      streamList: uniqueStreams,
      selectionResult: enrichedResult,
    };
  }

  // ---------------------------------------------------------------------------
  // Pre-downloadable format helpers
  // ---------------------------------------------------------------------------

  /**
   * Returns the list of streams eligible for header pre-downloading across
   * both audio and video types.
   *
   * @param {Object[]} jointStreams - All joint stream candidates.
   * @param {Object} selectedJoint - The selected joint stream.
   * @returns {Object[]}
   * @private
   */
  _getPreDownloadableFormats(jointStreams, selectedJoint) {
    const audioFormats = this._getPreDownloadableForType(jointStreams, selectedJoint, MediaType.V);
    const videoFormats = this._getPreDownloadableForType(jointStreams, selectedJoint, MediaType.U);
    return [...audioFormats, ...videoFormats];
  }

  /**
   * Returns pre-downloadable streams for a single media type.
   *
   * @param {Object[]} jointStreams
   * @param {Object} selectedJoint
   * @param {string} mediaType
   * @returns {Object[]}
   * @private
   */
  _getPreDownloadableForType(jointStreams, selectedJoint, mediaType) {
    const streams = jointStreams.map((js) => js.getStreamsByType(mediaType));
    const selected = selectedJoint.getStreamsByType(mediaType);
    return streams.filter(
      (s) => s !== undefined && s !== selected && s.qx && !s.isLive && !s.fragmentIndex?.length,
    );
  }

  // ---------------------------------------------------------------------------
  // Joint stream list construction
  // ---------------------------------------------------------------------------

  /**
   * Constructs the full list of joint stream candidates, including look-ahead
   * segments up to `maxSimulationDuration`.
   *
   * @param {Object} mediaTrackInfo
   * @param {Object} bufferState
   * @param {Object} sessionState
   * @param {string} playerPhase
   * @param {Object} filterConfig
   * @param {Object} [audioFilter]
   * @param {Object} [videoFilter]
   * @param {Object} [previousSelection]
   * @returns {Object} Stream list builder.
   * @private
   */
  buildStreamLists(mediaTrackInfo, bufferState, sessionState, playerPhase, filterConfig, audioFilter, videoFilter, previousSelection) {
    const streamList = new StreamListBuilder();

    // Filter audio and video streams
    const audioStreams = this.filterStreams(
      mediaTrackInfo.isLive.GS(MediaType.U), sessionState, filterConfig,
      mediaTrackInfo.isLive.qualityDescriptor, mediaTrackInfo.isLive.isPlaybackActive, videoFilter,
    );
    let videoStreams = this.filterStreams(
      mediaTrackInfo.isLive.GS(MediaType.V), sessionState, filterConfig,
      mediaTrackInfo.isLive.qualityDescriptor, mediaTrackInfo.isLive.isPlaybackActive, audioFilter,
    );
    const textStreams = mediaTrackInfo.isLive.GS(MediaType.TEXT_MEDIA_TYPE);
    const bufferStats = this.getBufferStats(mediaTrackInfo, bufferState);

    // Build joint streams for the first segment
    const initialJointStreams = this.jointStreamBuilder.createJointStreams(
      this.config, this.throughputPredictor, bufferStats,
      playerPhase, videoStreams, audioStreams, textStreams, previousSelection,
    );
    streamList.OQ(initialJointStreams);

    // Look ahead to future segments
    let remainingDuration = this.config.maxSimulationDuration
      - mediaTrackInfo.isLive.previousState.lowestWaterMarkLevelBufferRelaxed(bufferState).playbackSegment;

    let currentSegment = mediaTrackInfo;

    while (remainingDuration > 0) {
      const nextSegment = this.navigator.next(currentSegment);
      if (!nextSegment?.isPlaybackActive) break;

      const nextAudioStreams = this.filterStreams(
        nextSegment.isLive.GS(MediaType.U), sessionState, filterConfig,
        nextSegment.isLive.qualityDescriptor, nextSegment.isLive.isPlaybackActive, videoFilter,
      );
      videoStreams = this.filterStreams(
        mediaTrackInfo.isLive.GS(MediaType.V), sessionState, filterConfig,
        mediaTrackInfo.isLive.qualityDescriptor, mediaTrackInfo.isLive.isPlaybackActive, audioFilter,
      );

      const nextJointStreams = this.jointStreamBuilder.createJointStreams(
        this.config, this.throughputPredictor, bufferStats,
        playerPhase, videoStreams, nextAudioStreams, textStreams, previousSelection,
      );
      streamList.OQ(nextJointStreams);

      remainingDuration -= nextSegment.isLive.currentSegment.offset.playbackSegment;
      currentSegment = nextSegment;
    }

    return streamList;
  }

  // ---------------------------------------------------------------------------
  // Closest joint stream search
  // ---------------------------------------------------------------------------

  /**
   * Finds the joint stream in `candidates` that most closely matches
   * `reference` by walking up from the lowest bitrate.
   *
   * @param {Object} reference - Previously selected joint stream.
   * @param {Object[]} candidates - Available joint stream candidates.
   * @returns {Object}
   * @private
   */
  _findClosestJointStream(reference, candidates) {
    let closest = candidates[0];
    candidates
      .filter((c) => c.isReadyForSelection)
      .every((c) => {
        if (c.cw && c.videoBitrateKbps && reference.cw && reference.videoBitrateKbps
          && c.cw <= reference.cw && c.videoBitrateKbps <= reference.videoBitrateKbps) {
          closest = c;
          return true;
        }
        return false;
      });
    return closest;
  }

  // ---------------------------------------------------------------------------
  // Buffering-complete (prebuffer) evaluation
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
   * @returns {Object} Buffering-complete result.
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
    const bufferStats = this.getBufferStats(mediaTrackInfo, bufferState);
    const selectedTrack = streamSelector.getSelectedTrack();
    const bufferLevel = bufferStats.downloadPosition - bufferStats.playbackPosition;

    // Not enough data buffered
    if (bufferLevel < this.config.minPrebufSize || selectedTrack === undefined) {
      return { complete: false, hw: bufferLevel, reason: "preBuf" };
    }

    // Audio tracks are considered complete immediately
    if (mediaTrackInfo.mediaType === MediaType.V) {
      return { complete: true, hw: bufferLevel, reason: "audio" };
    }

    // External prebuffer-complete signal
    const externalReason = sessionState.tQa(mediaTrackInfo.mediaType);
    if (externalReason) {
      return { complete: true, hw: bufferLevel, reason: externalReason };
    }

    // Validate the track and run the buffering algorithm
    this.validateTrack(mediaTrackInfo.track);

    const singleStreamList = new StreamListBuilder();
    singleStreamList.OQ([selectedTrack]);
    streamSelector.internal_Cfa(singleStreamList, getBufferingPhase(playerPhase), bufferStats, this.throughputPredictor);

    const result = streamSelector.GA(bufferStats, playerPhase, playbackRate, selectedTrack, previousBufferingState);

    if (!result.complete && prebufferTimeLimitReached) {
      return { complete: true, reason: "prebufferTimeLimit", hw: bufferLevel };
    }

    result.hw = bufferLevel;
    return result;
  }

  // ---------------------------------------------------------------------------
  // Event helpers
  // ---------------------------------------------------------------------------

  /**
   * Extracts a per-media-type selection result slice.
   *
   * @param {string} mediaType
   * @param {Object} selectionResult
   * @returns {Object}
   * @private
   */
  _getPerTypeResult(mediaType, selectionResult) {
    return {
      ...selectionResult,
      Bd: selectionResult.mediaSource?.getStreamsByType(mediaType),
    };
  }

  /**
   * Returns unique streams of the given type from the joint stream list.
   *
   * @param {string} mediaType
   * @param {Object[]} jointStreams
   * @returns {Object[]}
   * @private
   */
  _getUniqueStreamsForType(mediaType, jointStreams) {
    return Array.from(
      new Set(
        jointStreams.map((js) => js.getStreamsByType(mediaType)).filter((s) => s !== undefined),
      ),
    );
  }

  /**
   * Emits per-media-type `"streamSelection"` events and a combined
   * `"jointStreamSelection"` event.
   *
   * @param {Object} selectionResult
   * @param {Object[]} jointStreams
   * @private
   */
  _emitSelectionEvents(selectionResult, jointStreams) {
    jointStreams[0].sba((stream) => {
      const perTypeStreams = this._getUniqueStreamsForType(stream.mediaType, jointStreams);
      const perTypeResult = this._getPerTypeResult(stream.mediaType, selectionResult);

      this.events.emit("streamSelection", {
        type: "streamSelection",
        mediaType: stream.mediaType,
        result: perTypeResult,
        streamList: perTypeStreams,
      });
    });

    this.events.emit("jointStreamSelection", {
      type: "jointStreamSelection",
      result: selectionResult,
      streamList: jointStreams,
    });
  }
}
