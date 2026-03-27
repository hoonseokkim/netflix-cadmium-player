/**
 * Netflix Cadmium Player — Joint Audio/Video Stream Selector
 *
 * Coordinates the simultaneous selection of audio AND video streams (and
 * optionally text) as a single optimisation pass.  Uses VMAF quality scores
 * and marginal-utility analysis to find the Pareto-optimal audio/video
 * bitrate combination within the available bandwidth budget.
 *
 * This selector differs from `SingleTrackStreamSelector` in that it holds
 * *two* stream bundles (`audioBundle` / `videoBundle`) and passes both into
 * the underlying algorithm so that the joint optimiser can reason about
 * the combined bitrate allocation.
 *
 * @module JointStreamSelector
 */

// Dependencies
// import { platform }            from '../core/AsejsEngine.js';
// import { playerPhase, MediaType } from '../core/AsejsEngine.js';
// import { i0 as forEachStream, findLast } from '../core/AsejsEngine.js';
// import { selectorRegistry }    from './modules/Module_3082.js';
// import { ResolutionSelector }  from './abr/PacerateSelector.js';
// import { JointStream, F6a }   from '../streaming/JointStream.js';
// import { wDb }                 from './modules/Module_44284.js';
// import * as streamSelectorUtils from './abr/StreamSelector.js';
// … remaining module imports …

/**
 * Joint audio+video adaptive-bitrate stream selector.
 *
 * Unlike `SingleTrackStreamSelector`, this class manages *two* stream bundles
 * — one for audio and one for video — and selects them together so that the
 * combined allocation respects the bandwidth envelope while maximising
 * perceptual quality (VMAF).
 */
export class JointStreamSelector {
  /**
   * @param {string|null} selectorName - Registered algorithm name; falls back
   *   to `config.ase_stream_selector`, then `"default"`.
   * @param {Object} config - ABR configuration parameters.
   * @param {Object} audioBundle - Audio stream bundle.
   * @param {Object} videoBundle - Video stream bundle.
   * @param {boolean} [enablePacerate] - Instantiate a `ResolutionSelector`
   *   for pace-rate control.
   */
  constructor(selectorName, config, audioBundle, videoBundle, enablePacerate) {
    this.selectorName = selectorName;
    this.config = config;

    /** @type {Object} Audio stream bundle */
    this.audioBundle = audioBundle;

    /** @type {Object} Video stream bundle */
    this.videoBundle = videoBundle;

    const resolvedName = selectorName || config.ase_stream_selector;

    /** @type {Object} Pluggable joint-selection algorithm instance */
    this.streamSelectorInstance = new (
      (selectorRegistry[resolvedName] || selectorRegistry["default"])()
    )();

    if (enablePacerate) {
      /** @type {ResolutionSelector|undefined} */
      this._resolutionSelector = new ResolutionSelector(config, MediaType.U);
    }
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /** @type {ResolutionSelector|undefined} */
  get pacerateSelector() {
    return this._resolutionSelector;
  }

  // ---------------------------------------------------------------------------
  // Stream bundle accessors
  // ---------------------------------------------------------------------------

  /**
   * Returns the audio or video bundle depending on the requested media type.
   *
   * @param {string} mediaType - `MediaType.V` (audio) or `MediaType.U` (video).
   * @returns {Object}
   */
  getStreamBundle(mediaType) {
    return mediaType === MediaType.V ? this.audioBundle : this.videoBundle;
  }

  /**
   * Updates the appropriate bundle based on the incoming bundle's media type.
   *
   * @param {Object} bundle - A stream bundle whose `.track.mediaType`
   *   determines which internal reference is replaced.
   */
  setStreamBundle(bundle) {
    if (bundle.track?.mediaType === MediaType.V) {
      this.audioBundle = bundle;
    }
    if (bundle.track?.mediaType === MediaType.U) {
      this.videoBundle = bundle;
    }
  }

  // ---------------------------------------------------------------------------
  // Header pre-downloading
  // ---------------------------------------------------------------------------

  /**
   * Marks adjacent segments for header pre-downloading when conditions allow.
   *
   * @param {Object[]} segments - First segment list.
   * @param {Object} selectedStream - The stream that was just selected.
   * @param {number} bufferLevelMs - Current buffer level in ms.
   */
  scheduleHeaderPreDownloading(segments, selectedStream, bufferLevelMs) {
    if (this.config.enableAllHeadersPreDownloading) {
      segments.forEach((seg) => {
        seg.qx = !seg.fragmentIndex || !seg.fragmentIndex.length;
      });
      return;
    }

    const shouldSmartPreDownload =
      this.config.smartHeaderPreDownloading &&
      bufferLevelMs > this.config.minBufferLenForHeaderDownloading &&
      !selectedStream.isLive &&
      segments.every((seg) => !seg.qx);

    if (!shouldSmartPreDownload) return;

    let idx = segments.length - 1;

    while (idx >= 0) {
      if (segments[idx - 1] && segments[idx - 1].isEqual(selectedStream)) {
        segments[idx].sba((stream) => {
          if (!stream.fragmentIndex?.length) {
            stream.qx = true;
          }
        });
      }
      if (segments[idx + 1] && segments[idx + 1].isEqual(selectedStream)) {
        segments[idx].sba((stream) => {
          if (!stream.fragmentIndex?.length) {
            stream.qx = true;
          }
        });
      }
      --idx;
    }
  }

  // ---------------------------------------------------------------------------
  // Core selection
  // ---------------------------------------------------------------------------

  /**
   * Runs one round of joint stream selection across both audio and video.
   *
   * @param {Object} player - Current player state.
   * @param {Object} streamList - Ordered stream-list wrapper.
   * @param {number} switchReason
   * @param {Function} [throughputPredictor]
   * @param {Object} [previousManifest]
   * @param {*} [bufferingState]
   * @param {Object} [downloadHint]
   * @returns {Object} Joint selection result.
   */
  selectStream(player, streamList, switchReason, throughputPredictor, previousManifest, bufferingState, downloadHint) {
    const buffer = player?.buffer;
    const nowMs = platform.now();
    const cfg = this.config;
    const firstSegments = streamList.first;

    // Validate first segments
    validateSegments(streamList.first);

    // Determine metadata for repeated-first-selection logic
    const selectionInfo = this._getFirstSelectionMetadata(cfg.noRepeatedFirstSelectionLogic, streamList.first);
    let metadataResult = selectionInfo.metadataResult;
    const isFirstSelection = selectionInfo.isFirstSelection;

    // Reset position cursors on start
    if (player.state === playerPhase.STARTING) {
      this.lastSwitchPosition = undefined;
      this.lastDowngradePosition = undefined;
    }

    // Propagate throughput estimates
    if (throughputPredictor !== undefined) {
      this._applyThroughputEstimates(streamList, player.state, player.buffer, throughputPredictor);
    }

    // Choose algorithm method by player phase
    let algorithmMethod;
    const phase = player.state;

    switch (phase) {
      case playerPhase.STARTING:
        algorithmMethod = this.streamSelectorInstance.renderZone;
        break;
      case playerPhase.BUFFERING:
        algorithmMethod = this.streamSelectorInstance.parseMetadata;
        break;
      case playerPhase.REBUFFERING:
        algorithmMethod = this.streamSelectorInstance.getStreamSelection;
        break;
      case playerPhase.PAUSED:
        algorithmMethod = this.streamSelectorInstance.getStreamFallback;
        break;
      default:
        algorithmMethod = this.streamSelectorInstance.refresh;
        break;
    }

    // Apply shouldWaitForBuffer for the video bundle
    const videoFirstStream = firstSegments[0].getStreamsByType(MediaType.U);

    if (isLiveSegment(videoFirstStream)) {
      this.videoBundle.shouldWaitForBuffer = shouldWaitForBuffer(
        player,
        videoFirstStream.track.trackInfo.playbackSegment,
        cfg.minimumPresentationDelayMs,
        this.videoBundle.shouldWaitForBuffer,
      );
    }

    // Execute the joint algorithm
    const selectionResult = algorithmMethod.call(this.streamSelectorInstance, {
      config: cfg,
      player,
      el: streamList,
      metadataResult,
      internal_Mca: !!previousManifest,
      h0: isFirstSelection,
      KNc: switchReason,
      shouldWaitForBuffer: this.videoBundle.shouldWaitForBuffer,
      playerPositionMs: this.lastDowngradePosition,
      IZa: this.lastSwitchPosition,
      GHb: Math.max(this.lastDowngradePosition ?? 0, this.lastSwitchPosition ?? 0),
    });

    selectionResult.cprStreamId = player.state;

    const selectedJointStream = selectionResult.mediaSource;

    if (selectedJointStream) {
      // Update both bundles
      this.audioBundle.oV(selectedJointStream.getStreamsByType(MediaType.V));
      this.videoBundle.oV(selectedJointStream.getStreamsByType(MediaType.U));

      // Header pre-downloading
      this.scheduleHeaderPreDownloading(
        streamList.first,
        selectedJointStream,
        buffer.downloadPosition - buffer.playbackPosition,
      );

      selectionResult.cprNetworkId = selectedJointStream.bufferLength || 0;
      selectionResult.getConfig = selectedJointStream.getConfig;

      // Annotate the stream with selection reason
      if (selectionResult.reason) {
        selectedJointStream.pv = selectionResult.reason;
        if (selectionResult.reason !== "min_fragment_vmaf") {
          selectedJointStream.g5a = selectionResult.selectedStreamReason;
          selectedJointStream.Y0 = selectionResult.Y0;
          selectedJointStream.zXa = selectionResult.getConfig?.QY;
          selectedJointStream.AXa = selectionResult.getConfig?.notificationList;
        }
      }

      // Compute pacing / network info
      const networkInfo = computeNetworkInfo({
        buffer,
        player,
        UH: downloadHint,
        internal_Mca: previousManifest,
        kva: firstSegments[0].videoStream,
        mediaSource: selectedJointStream.videoStream,
        vBa: computeJointUpswitchStream(firstSegments, selectedJointStream),
        fBa: firstSegments[firstSegments.length - 1].videoStream,
        R2: this.pacerateSelector,
      });
      selectionResult.networkInfo = networkInfo || selectionResult.networkInfo;

      // Track downgrade
      if (metadataResult && !isFirstSelection && selectedJointStream.bitrate < metadataResult.bitrate) {
        this.lastDowngradePosition = buffer.fl;
      }

      // Buffering-complete evaluation
      if (player.state !== playerPhase.PLAYING && player.state !== playerPhase.PAUSED) {
        const bufferingPhase = getBufferingPhase(player.state);
        const bufferingResult = this.computeBufferingComplete(
          player.buffer, bufferingPhase, player.playbackRate, selectedJointStream, bufferingState,
        );
        if (bufferingResult.complete) {
          selectionResult.bufferingCompleteHandler = bufferingResult.complete;
          selectionResult.JPa = bufferingResult.reason;
        } else {
          selectionResult.bufferingCompleteHandler = false;
          selectionResult.nextFragmentIndex = bufferingResult.nextFragmentIndex;
          selectionResult.internal_Xda = bufferingResult.internal_Xda;
          selectionResult.progress = bufferingResult.progress;
        }
      } else {
        selectionResult.bufferingCompleteHandler = true;
        selectionResult.JPa = "playing";
      }
    }

    // Attach ASE report
    if (player.aseReportEnabled && selectedJointStream) {
      const report = buildAseReport(selectedJointStream, buffer, player, nowMs, this.config.reportedFilters);
      mergeReport(report, selectionResult);
    }

    return selectionResult;
  }

  // ---------------------------------------------------------------------------
  // Buffering-complete helper
  // ---------------------------------------------------------------------------

  /**
   * @param {Object} buffer
   * @param {string} bufferingPhase
   * @param {number} playbackRate
   * @param {Object} selectedStream
   * @param {Object} [previousState]
   * @returns {Object}
   */
  computeBufferingComplete(buffer, bufferingPhase, playbackRate, selectedStream, previousState) {
    return computeGA(buffer, bufferingPhase, playbackRate, selectedStream, previousState, this.config);
  }

  // ---------------------------------------------------------------------------
  // Position tracking
  // ---------------------------------------------------------------------------

  /**
   * Updates position cursors after a bitrate change.
   *
   * @param {number} position
   * @param {Object|undefined} previousStream
   * @param {Object} currentStream
   */
  updateSwitchPosition(position, previousStream, currentStream) {
    if (typeof previousStream !== "undefined") {
      if (previousStream.bitrate < currentStream.bitrate) {
        this.lastSwitchPosition = position;
      }
    } else {
      this.lastDowngradePosition = undefined;
      this.lastSwitchPosition = undefined;
    }
  }

  // ---------------------------------------------------------------------------
  // Throughput estimation
  // ---------------------------------------------------------------------------

  /**
   * Applies throughput predictions across all streams in the list.
   *
   * @param {Object} streamList
   * @param {string} playerPhaseValue
   * @param {Object} buffer
   * @param {Function} throughputPredictor
   * @private
   */
  _applyThroughputEstimates(streamList, playerPhaseValue, buffer, throughputPredictor) {
    let lastConfig;
    let lastPrediction;

    streamList.TL((segment) => {
      forEachStream(segment, (stream) => {
        if (stream.isReadyForSelection && stream.getConfig && stream.getConfig.confidence) {
          if (lastConfig !== stream.getConfig) {
            lastConfig = stream.getConfig;
            lastPrediction = throughputPredictor(stream.getConfig, buffer, playerPhaseValue, 0, false);
          }
          stream.bufferLength = Math.floor(lastPrediction.lower) || 1;
          stream.internal_Sha = lastPrediction.upper !== undefined ? Math.floor(lastPrediction.upper) : 1;
        } else {
          stream.bufferLength = undefined;
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // First-selection metadata resolution
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the current selection round is the very first one and
   * returns matching metadata when available.
   *
   * @param {boolean} noRepeatedFirstSelectionLogic
   * @param {Object[]} segments
   * @returns {{ metadataResult: Object|undefined, isFirstSelection: boolean }}
   * @private
   */
  _getFirstSelectionMetadata(noRepeatedFirstSelectionLogic, segments) {
    const videoSelectedTrack = this.getSelectedTrack();
    let audioSelectedTrack = this.getSelectedTrack();
    let isFirstSelection = false;

    if (!videoSelectedTrack) {
      isFirstSelection = true;
      return { rn: videoSelectedTrack, isFirstSelection };
    }

    // Verify the selected track still exists in the current segment list
    const foundVideo = findLast(segments, (seg) => seg.isEqual(videoSelectedTrack));
    const foundAudio = findLast(segments, (seg) => seg.isEqual(audioSelectedTrack));

    if (!foundVideo) {
      // Fall back to closest match by bitrate + VMAF
      const fallback = findClosestStream(segments, videoSelectedTrack.bitrate, videoSelectedTrack.vmaf);
      isFirstSelection = true;

      // If "no repeated first selection" is enabled and audio track still exists,
      // suppress the first-selection flag.
      if (noRepeatedFirstSelectionLogic && audioSelectedTrack && foundAudio) {
        isFirstSelection = false;
      }
    }

    return { rn: videoSelectedTrack, isFirstSelection };
  }

  // ---------------------------------------------------------------------------
  // Selected-track snapshot
  // ---------------------------------------------------------------------------

  /**
   * Returns a `JointStream` snapshot of the currently selected audio + video
   * element lists, or `undefined` if neither is set.
   *
   * @returns {JointStream|undefined}
   */
  getSelectedTrack() {
    if (this.audioBundle.elementList || this.videoBundle.elementList) {
      return new JointStream({
        audio: this.audioBundle.elementList,
        videoBufferedSegments: this.videoBundle.elementList,
      });
    }
    return undefined;
  }
}
