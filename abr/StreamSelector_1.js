/**
 * Netflix Cadmium Player — ABR Stream Selector (Single-Track)
 *
 * Concrete stream selector that operates on a single media track (audio OR
 * video).  It wraps a pluggable selection algorithm obtained from the
 * selector registry and delegates to the appropriate method depending on
 * the current player phase (STARTING → renderZone, BUFFERING → parseMetadata,
 * REBUFFERING → getStreamSelection, PAUSED → getStreamFallback, default →
 * refresh).
 *
 * @module StreamSelector_1
 */

// Dependencies
// import { platform }         from './modules/Module_66164.js';
// import { playerPhase, MediaType } from './modules/Module_65161.js';
// import { i0 as forEachStream }    from './modules/Module_91176.js';
// import { selectorRegistry }       from './modules/Module_3082.js';
// import { ResolutionSelector }     from './abr/PacerateSelector.js';
// import * as streamSelectorUtils   from './abr/StreamSelector.js';
// import { ... } from remaining modules

/**
 * Single-track adaptive bitrate stream selector.
 *
 * Manages one `StreamBundle` (either audio or video), selects the optimal
 * stream on every tick, and produces a selection result with pacing,
 * buffering-complete, and CDN information.
 */
export class SingleTrackStreamSelector {
  /**
   * @param {string|null} selectorName - Name of the registered selection
   *   algorithm.  Falls back to `config.ase_stream_selector` then `"default"`.
   * @param {Object} config - ABR configuration parameters.
   * @param {Object} streamBundle - The stream bundle (track + element list)
   *   being managed.
   * @param {boolean} [enablePacerate] - When `true` a `ResolutionSelector`
   *   (pace-rate controller) is instantiated.
   */
  constructor(selectorName, config, streamBundle, enablePacerate) {
    this.selectorName = selectorName;
    this.config = config;
    this.streamBundle = streamBundle;

    const resolvedName = selectorName || config.ase_stream_selector;

    /** @type {Object} Pluggable stream-selection algorithm instance */
    this.streamSelectorInstance = new (
      (selectorRegistry[resolvedName] || selectorRegistry["default"])()
    )();

    if (enablePacerate) {
      /** @type {ResolutionSelector|undefined} Pace-rate controller */
      this.pacerateSelector = new ResolutionSelector(
        config,
        streamBundle.track?.mediaType,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Stream bundle accessors
  // ---------------------------------------------------------------------------

  /**
   * Returns the current stream bundle.
   * @returns {Object}
   */
  getStreamBundle() {
    return this.streamBundle;
  }

  /**
   * Replaces the current stream bundle.
   * @param {Object} newBundle
   */
  setStreamBundle(newBundle) {
    this.streamBundle = newBundle;
  }

  // ---------------------------------------------------------------------------
  // Core selection
  // ---------------------------------------------------------------------------

  /**
   * Runs one round of stream selection.
   *
   * The specific sub-algorithm invoked depends on the player phase:
   *
   * | Phase        | Algorithm method          |
   * |--------------|---------------------------|
   * | STARTING     | `renderZone`              |
   * | BUFFERING    | `parseMetadata`           |
   * | REBUFFERING  | `getStreamSelection`      |
   * | PAUSED       | `getStreamFallback`       |
   * | *default*    | `refresh`                 |
   *
   * @param {Object} player - Current player state.
   * @param {Object} streamList - Ordered stream list wrapper (supports
   *   `first`, `y1c`, `TL`).
   * @param {number} switchReason - Numeric switch-reason code.
   * @param {Function} [throughputPredictor] - Throughput prediction callback.
   * @param {Object} [previousManifest] - Previous manifest reference for
   *   delta-based ABR decisions.
   * @param {*} [bufferingState] - Buffering-complete state from prior tick.
   * @param {Object} [downloadHint] - Download hint / UH object for pacing.
   * @returns {Object} Selection result containing `mediaSource`,
   *   `bufferingCompleteHandler`, `networkInfo`, etc.
   */
  selectStream(player, streamList, switchReason, throughputPredictor, previousManifest, bufferingState, downloadHint) {
    const buffer = player?.buffer;
    const nowMs = platform.now();
    const cfg = this.config;
    const firstSegments = streamList.first;

    // Validate first segments
    validateSegments(firstSegments);

    // Determine metadata for repeated-first-selection logic
    const selectionInfo = getFirstSelectionMetadata(
      cfg.noRepeatedFirstSelectionLogic,
      player,
      firstSegments,
      this.streamBundle.elementList,
    );
    let metadataResult = selectionInfo.metadataResult;
    const isFirstSelection = selectionInfo.isFirstSelection;

    // Reset position cursors when starting
    if (player.state === playerPhase.STARTING) {
      this.lastDowngradePosition = undefined;
      this.lastSwitchPosition = undefined;
    }

    // Apply throughput prediction to individual streams when a predictor is
    // available.
    if (throughputPredictor !== undefined) {
      this._applyThroughputEstimates(streamList, player.state, player.buffer, throughputPredictor);
    }

    // Choose the algorithm method based on the current player phase
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

    // Check if first segment is a live stream and apply shouldWaitForBuffer
    if (isLiveSegment(firstSegments[0])) {
      this.streamBundle.shouldWaitForBuffer = shouldWaitForBuffer(
        player,
        firstSegments[0].track.trackInfo.playbackSegment,
        cfg.minimumPresentationDelayMs,
        this.streamBundle.shouldWaitForBuffer,
      );
    }

    // Retrieve encoder-level information and metadata
    const encoderLevelInfo = streamList.y1c();
    const streamMetadata = metadataResult ? getStreamMetadata(metadataResult) : undefined;

    // Execute the selected algorithm
    const selectionParams = {
      config: cfg,
      player,
      el: encoderLevelInfo,
      metadataResult: streamMetadata,
      internal_Mca: !!previousManifest,
      h0: isFirstSelection,
      KNc: switchReason,
      shouldWaitForBuffer: this.streamBundle.shouldWaitForBuffer,
      playerPositionMs: this.lastDowngradePosition,
      IZa: this.lastSwitchPosition,
      GHb: Math.max(
        this.lastDowngradePosition ?? 0,
        this.lastSwitchPosition ?? 0,
      ),
    };

    const rawResult = algorithmMethod.call(this.streamSelectorInstance, selectionParams);

    // Build the final result object
    const result = buildSelectionResult(rawResult);
    result.cprStreamId = player.state;

    const selectedStream = result.mediaSource;

    if (selectedStream) {
      // Update the stream bundle with the newly selected stream
      this.streamBundle.oV(selectedStream);

      // Pre-download headers for adjacent streams when appropriate
      scheduleHeaderPreDownloading(
        streamList.first,
        selectedStream,
        buffer.downloadPosition - buffer.playbackPosition,
        this.config.enableAllHeadersPreDownloading,
        this.config.smartHeaderPreDownloading,
        this.config.minBufferLenForHeaderDownloading,
      );

      result.cprNetworkId = selectedStream.bufferLength || 0;
      result.getConfig = selectedStream.getConfig;

      // Annotate the stream with selection reason
      if (result.reason) {
        selectedStream.pv = result.reason;
        if (result.reason !== "min_fragment_vmaf") {
          selectedStream.g5a = result.selectedStreamReason;
          selectedStream.Y0 = result.Y0;
          selectedStream.zXa = result.getConfig?.QY;
          selectedStream.AXa = result.getConfig?.notificationList;
        }
      }

      // Compute pacing / network info
      const networkInfo = computeNetworkInfo({
        buffer,
        player,
        UH: downloadHint,
        internal_Mca: previousManifest,
        kva: firstSegments[0],
        mediaSource: selectedStream,
        vBa: computeUpswitchStream(firstSegments, selectedStream),
        fBa: firstSegments[firstSegments.length - 1],
        R2: this.pacerateSelector,
      });
      result.networkInfo = networkInfo || result.networkInfo;

      // Track downgrade position
      if (metadataResult && !isFirstSelection && selectedStream.bitrate < metadataResult.bitrate) {
        this.lastDowngradePosition = buffer.fl;
      }

      // Compute buffering-complete state
      if (player.state !== playerPhase.PLAYING && player.state !== playerPhase.PAUSED) {
        const bufferingPhase = getBufferingPhase(player.state);
        const bufferingResult = this.computeBufferingComplete(
          player.buffer, bufferingPhase, player.playbackRate, selectedStream, bufferingState,
        );
        if (bufferingResult.complete) {
          result.bufferingCompleteHandler = bufferingResult.complete;
          result.JPa = bufferingResult.reason;
        } else {
          result.bufferingCompleteHandler = false;
          result.nextFragmentIndex = bufferingResult.nextFragmentIndex;
          result.internal_Xda = bufferingResult.internal_Xda;
          result.progress = bufferingResult.progress;
        }
      } else {
        result.bufferingCompleteHandler = true;
        result.JPa = "playing";
      }
    }

    // Attach ASE report when enabled
    if (player.aseReportEnabled && selectedStream) {
      const report = buildAseReport(selectedStream, buffer, player, nowMs, this.config.reportedFilters);
      mergeReport(report, result);
    }

    return result;
  }

  // ---------------------------------------------------------------------------
  // Buffering-complete helper
  // ---------------------------------------------------------------------------

  /**
   * Computes whether buffering is complete and, if not, the current progress.
   *
   * @param {Object} buffer
   * @param {string} bufferingPhase
   * @param {number} playbackRate
   * @param {Object} selectedStream
   * @param {Object} [previousState]
   * @returns {Object}
   */
  computeBufferingComplete(buffer, bufferingPhase, playbackRate, selectedStream, previousState) {
    return computeGA(
      buffer,
      bufferingPhase,
      playbackRate,
      getStreamMetadata(selectedStream),
      previousState,
      this.config,
    );
  }

  // ---------------------------------------------------------------------------
  // Position tracking for bitrate downgrades
  // ---------------------------------------------------------------------------

  /**
   * Updates the internal "last switch position" when the selected stream's
   * bitrate is lower than the previous stream's.
   *
   * @param {number} position - Current playback position.
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
  // Throughput estimation propagation
  // ---------------------------------------------------------------------------

  /**
   * Applies throughput predictions to every stream in `streamList`, using the
   * supplied `throughputPredictor` callback.
   *
   * @param {Object} streamList
   * @param {string} playerPhase
   * @param {Object} buffer
   * @param {Function} throughputPredictor
   * @private
   */
  _applyThroughputEstimates(streamList, playerPhaseValue, buffer, throughputPredictor) {
    const self = this;
    let lastConfig;
    let lastPrediction;

    streamList.TL((segment) => {
      forEachStream(segment, (stream) => {
        if (stream.isReadyForSelection && stream.getConfig && stream.getConfig.confidence) {
          if (lastConfig !== stream.getConfig) {
            lastConfig = stream.getConfig;
            lastPrediction = throughputPredictor(
              stream.getConfig,
              buffer,
              playerPhaseValue,
              stream.track.viewableSession.aN[MediaType.V],
            );
          }
          stream.bufferLength = Math.floor(lastPrediction.lower) || 1;
          stream.internal_Sha = Math.floor(lastPrediction.upper || 1) || 1;
        } else {
          stream.bufferLength = self.config.defaultThroughput;
        }
      });
    });
  }
}
