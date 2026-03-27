/**
 * Netflix Cadmium Player - MediaSourceManager (MediaPresenterASE)
 *
 * Manages the MediaSource API presentation layer, coordinating between
 * the HTML video element, source buffers, text streams, and player state.
 * Handles seeking, buffering state transitions, playback control (play/pause),
 * volume/mute synchronization, rebuffering detection, gap monitoring for live
 * streams, and decoder/render timeout detection.
 *
 * Originally: Module 73056 (export: wHa)
 * Referenced by Module_18128 as "MediaSourceManager"
 */

// --- Dependency Imports ---
import { DX as DISPOSE_PRIORITY } from "../modules/Module_33096"; // disposePriority
import { config } from "../modules/Module_29204"; // playerConfig
import { ljb as TIMED_TEXT_REBUFFER, fJa as AV_REBUFFER, gJa as TEXT_REBUFFER } from "../modules/Module_13044"; // rebufferReasons
import { writeBytes as eventBus, downloadNode as DOWNLOAD_EVENT, stateChangeEvent as VISIBILITY_CHANGE_EVENT } from "../modules/Module_37509"; // eventBus
import { addOneTimeEventListener as addOneTimeEventListener } from "../modules/Module_52569"; // domUtils
import { jy as performanceNow } from "../modules/Module_24066"; // performanceUtils
import { fetchOperation as createLoggerFactory, disposableList } from "../modules/Module_31276"; // loggerFactory / disposables
import "../modules/Module_24550"; // side-effect import
import { ea as ErrorCode } from "../modules/Module_36129"; // errorCodes
import { hEa as TimeoutErrorFactory } from "../modules/Module_91591"; // timeoutErrors
import { assert } from "../modules/Module_45146"; // assertions
import { zk as formatTime, oG as clampValue } from "../modules/Module_8825"; // timeUtils
import { initializeModel as serializeError } from "../modules/Module_3887"; // errorSerializer
import { scheduleAsync } from "../modules/Module_32219"; // asyncScheduler
import { setState as PresentingState, PlayerEvents, streamState as SeekCause, zh as BufferingState, pacingTargetBufferStrategy as PlaybackState } from "../modules/Module_85001"; // playerConstants
import { gd as isValidElement } from "../modules/Module_32687"; // domValidation
import { wkb as REWIND_THRESHOLD, pKa as DEFAULT_DURATION } from "../modules/Module_93294"; // playbackConstants
import { MediaSourceEvents } from "../modules/Module_16520"; // mediaSourceEvents
import { ellaSendRateMultiplier as createDuration, MILLISECONDS } from "../modules/Module_5021"; // durationUtils
import { uK as DURATION_OBSERVABLE_TYPE } from "../modules/Module_45842"; // observableTypes
import { n8 as createTimeoutTimer } from "../modules/Module_4246"; // timerFactory
import { plb as SEEK_ENGINE_TYPE } from "../modules/Module_65106"; // seekEngineType
import { PRc as createThrottledCallback } from "../modules/Module_97368"; // throttle
import { TextStreamBuilder } from "../modules/Module_33059"; // textStreamBuilder
import { p7 as SegmentLocationProcessor } from "../modules/Module_91562"; // segmentLocationProcessor
import { $i as documentVisibility } from "../modules/Module_22365"; // documentVisibility
import { MediaType } from "../modules/Module_26388"; // mediaTypes
import { qnb as PlayStateController } from "../modules/Module_49587"; // playStateController
import { zv as ReadyStateConstants } from "../modules/Module_63156"; // readyStateConstants
import { rnb as VideoFreezeMonitor } from "../modules/Module_42087"; // videoFreezeMonitor

/**
 * MediaPresenterASE - Adaptive Streaming Engine Media Presenter.
 *
 * Orchestrates media playback by managing the HTMLVideoElement through the
 * MediaSource Extensions API. Coordinates buffering, seeking, text tracks,
 * volume, play/pause state, decoder timeouts, render timeouts, and gap
 * detection for live streams.
 */
export class MediaPresenterASE {
  /**
   * @param {Object} playerState - The shared player state object
   * @param {number} initialMediaTime - Starting media time in milliseconds
   * @param {boolean} [skipLicenseCheck=false] - Whether to skip DRM license waiting
   */
  constructor(playerState, initialMediaTime, skipLicenseCheck = false) {
    /** @type {Object} */
    this.playerState = playerState;

    /** @private @type {number} */
    this._initialMediaTime = initialMediaTime;

    /** @private @type {boolean} */
    this._skipLicenseCheck = skipLicenseCheck;

    /** @type {Object} */
    this.mediaSourceElement = this.playerState.mediaSourceElement;

    /** @type {Object} */
    this.log = createLoggerFactory(this.playerState, "MediaPresenterASE");

    /** @private @type {number} - AV rebuffer count */
    this._avRebufferCount = 0;

    /** @private @type {number} - Text rebuffer count */
    this._textRebufferCount = 0;

    /** @type {HTMLVideoElement} */
    this.htmlVideoElement = this.mediaSourceElement.htmlVideoElement;

    /** @private @type {VideoFreezeMonitor} */
    this._videoFreezeMonitor = new VideoFreezeMonitor(
      this.playerState,
      this.log.createLogger("VideoFreezeMonitor")
    );

    /** @private @type {PlayStateController} */
    this._playStateController = new PlayStateController(
      this.htmlVideoElement,
      this.playerState
    );

    /** @private @type {boolean} - Whether autoplay was blocked */
    this._autoplayBlocked = false;

    /** @private @type {boolean} - Whether initial media has been set up */
    this._initialMediaSetUp = false;

    /** @private @type {boolean} - Whether track switch is pending */
    this._trackSwitchPending = false;

    /** @private @type {boolean} - Whether play promise rejection was already logged */
    this._playPromiseRejectionLogged = false;

    /** @private @type {Set} - Licenses received before source buffers were created */
    this._pendingLicenses = new Set();

    /** @private @type {Object} - Duration observable for presenting state */
    this._durationObservable = disposableList.key(DURATION_OBSERVABLE_TYPE)(
      createDuration(DEFAULT_DURATION)
    );

    /** @private @type {*} */
    this._pendingYield = undefined;

    /** @private @type {Object} - Seek engine / layout engine for managing seeks */
    this._seekEngine = disposableList.key(SEEK_ENGINE_TYPE)(this.playerState);

    /** @private @type {Object} - HTMLVideoElement event handlers */
    this._videoEventHandlers = {};

    /** @private @type {Object} - MediaSource event handlers */
    this._mediaSourceEventHandlers = {};

    /** @private @type {Object} - EventBus handlers */
    this._eventBusHandlers = {};

    /** @private @type {Object} - PlayerState event handlers */
    this._playerEventHandlers = {};

    /** @private @type {Object} - Timer state listener handlers */
    this._timerStateListeners = {};

    /** @private @type {Object} - Render timer listener handlers */
    this._renderTimerListeners = {};

    /** @type {TextStreamBuilder} */
    this.textStreamBuilder = new TextStreamBuilder(
      this.playerState,
      this._seekEngine
    );

    /** @private @type {number} - Unexpected rewind count */
    this._unexpectedRewindCount = 0;

    /** @private @type {boolean} - Whether we are in rebuffering state due to branch switch */
    this._branchSwitchBuffering = false;

    /**
     * @private
     * Core render loop tick. Called on each animation frame or state change.
     * Updates media time, processes pending seeks, determines presenting state.
     */
    this._renderTick = () => {
      this.playerState.lastStreamStartTime = performanceNow();

      if (this.isDisposed() || !this._initialized) {
        return;
      }

      const isUpdating = this.mediaSourceElement.pDb();

      if (!isUpdating) {
        this._processSeek();
        this.textStreamBuilder.OVb(this.mediaTime);
      }

      // Determine whether to play or pause the video element
      if (
        this.playerState.paused.value ||
        !this.textStreamBuilder.cSa(this.mediaTime) ||
        !this._isBufferingComplete() ||
        isUpdating ||
        this._seekEngine.sda
      ) {
        this._pauseVideoElement();
      } else if (!this._autoplayBlocked) {
        this._playVideoElement();
      }

      this._processPendingPtsChange();

      if (
        !this.mediaSourceElement.pDb() &&
        !this._trackSwitchPending &&
        !this._branchSwitchBuffering
      ) {
        const currentTime = this.mediaSourceElement.XA(true);
        const previousState = this.playerState.presentingState.value;
        const newState = this._determinePresentingState();

        // (debug assertion removed)
        if (previousState !== newState) {
          // state transition
        }

        if (newState === PresentingState.ENDED) {
          this.mediaTime = this.playerState.seekTarget.toUnit(MILLISECONDS);
          this._pauseVideoElement();
        } else if (newState !== PresentingState.WAITING) {
          this._updateMediaTime(currentTime);
        }

        this._emitMediaTime();
        this.textStreamBuilder.rQa(this.mediaTime);
        this.playerState.presentingState.set(newState);

        if (
          newState === PresentingState.WAITING &&
          (previousState === PresentingState.PLAYING ||
            previousState === PresentingState.PAUSED)
        ) {
          this._onRebufferStart();
        }
      }
    };

    /**
     * @private
     * Throttled version of the render tick, used as the main callback.
     */
    this._scheduledRenderTick = createThrottledCallback(this._renderTick);

    /** @type {number} - Current media time in milliseconds */
    this.mediaTime = this._initialMediaTime;

    /** @type {boolean} */
    this.playerState.logBlobEvent = false;

    // Listen for source buffers being added
    this.mediaSourceElement.addEventListener(
      MediaSourceEvents.sourceBufferAdded,
      () => {
        if (this.hasRequiredSourceBuffers) {
          this.log.pauseTrace(
            "sourceBuffers have been created. Initialize MediaPresenter."
          );
          try {
            this._initialize();
          } catch (err) {
            this.log.error("Exception while initializing", err);
            this._fireError(ErrorCode.PLAY_INIT_EXCEPTION);
          }
        }
      }
    );

    // Listen for DRM licenses being added
    this.mediaSourceElement.addEventListener(
      MediaSourceEvents.licenseadded,
      (event) => {
        const licenseId = event.J;
        if (this.hasRequiredSourceBuffers) {
          this._onLicenseAdded(licenseId);
        } else {
          this._pendingLicenses.add(licenseId);
        }
      }
    );
  }

  // ---------------------------------------------------------------------------
  // Public Properties
  // ---------------------------------------------------------------------------

  /**
   * Whether all required source buffers have been created.
   * @returns {boolean}
   */
  get hasRequiredSourceBuffers() {
    const session = this.playerState.streamingSession;
    if (!session?.mediaTypesForBranching) {
      return false;
    }
    return [...session.mediaTypesForBranching].every((type) =>
      this.mediaSourceElement.sourceBuffers.find(
        (sb) => sb.mediaType === type
      )
    );
  }

  /**
   * Whether a seek is currently pending.
   * @returns {boolean}
   */
  get hasPendingSeek() {
    return this._seekEngine.sda;
  }

  // ---------------------------------------------------------------------------
  // Public Methods - Media Source Passthrough
  // ---------------------------------------------------------------------------

  /**
   * Handle PTS (Presentation Timestamp) change event from the source buffer.
   * @param {Object} event - PTS change event data
   */
  onPtsChanged(event) {
    const initialTimestamp = Math.ceil(event.initialTimestamp);
    const newMediaTime = Math.ceil(
      event.previousTimeValue ?? event.initialTimestamp
    );

    if (!this._seekEngine.Y2) {
      const diagnosticInfo = {
        oldMediaTime: this.mediaTime,
        newMediaTime,
        contentPts: event.encryptionMetadata,
      };
      Object.assign(diagnosticInfo, this.playerState.j4a.KWa());
      this.log.error("ptsChanged without pendingPtsChanged", diagnosticInfo);

      this._seekEngine.Y2 = {
        eF: false,
        XT: this.mediaTime,
        OT: newMediaTime,
        encryptionMetadata: event.encryptionMetadata,
        cause: SeekCause.SEEK,
        skip: false,
        mediaTimeObservable: this.playerState.mediaTimeObservable.value,
        targetBuffer: this.playerState.targetBuffer.value,
        R: this.playerState.R,
      };
    }

    const pendingPtsChange = this._seekEngine.Y2;
    this._seekEngine.Y2 = undefined;
    this._seekEngine.nfa = true;

    const resolvedTime = pendingPtsChange.eF ? newMediaTime : initialTimestamp;

    this._applyPtsChange(pendingPtsChange, resolvedTime, event.encryptionMetadata);
  }

  /**
   * Get the current element time (from MediaSource).
   * @returns {number}
   */
  getCurrentElementTime() {
    return this.mediaSourceElement.XA(false);
  }

  /**
   * Get the current playback rate from the media source.
   * @returns {number}
   */
  getPlaybackRate() {
    return this.mediaSourceElement.ksa();
  }

  /**
   * Get the number of decoded frames.
   * @returns {number}
   */
  getDecodedFrameCount() {
    return this.mediaSourceElement.YA();
  }

  /**
   * Get the number of dropped frames.
   * @returns {number}
   */
  getDroppedFrameCount() {
    return this.mediaSourceElement.vS();
  }

  /**
   * Get internal buffering info from the media source element.
   * @returns {*}
   */
  getBufferingInfo() {
    return this.mediaSourceElement.getCorruptedFrameCount();
  }

  /**
   * Handle a normal (non-EOS) buffer append completion.
   * @param {Object} appendInfo - Information about the appended segment
   */
  onBufferAppendComplete(appendInfo) {
    this.textStreamBuilder.acc(appendInfo);
    this._updateDuration(appendInfo)
      .then(() => {
        this._onDurationUpdated();
        this.playerState.fireEvent(PlayerEvents.sea);
      })
      .catch((err) => {
        this._fireError(ErrorCode.PLAY_MSE_DURATIONCHANGE_ERROR, {
          Cf: serializeError(err),
        });
      });
  }

  /**
   * Handle an end-of-stream buffer append.
   * @param {Object} sourceBuffer - The source buffer
   * @param {number} endTime - The end time
   * @param {*} additionalInfo - Extra info
   */
  onBufferAppendEOS(sourceBuffer, endTime, additionalInfo) {
    endTime = this._processAseLocation(sourceBuffer, endTime);
    this.textStreamBuilder.$bc(sourceBuffer, endTime, additionalInfo);
    this._onDurationUpdated();

    if (!this._initialMediaSetUp && sourceBuffer.type === MediaType.U) {
      if (!this._seekEngine.sda) {
        this.seek(this._initialMediaTime, SeekCause.INITIAL);
      }
      this._initialMediaSetUp = true;
    }
  }

  /**
   * Notify that a track switch is starting (enter rebuffering).
   */
  onTrackSwitchStart() {
    this.playerState.presentingState.set(PresentingState.WAITING);
    this._trackSwitchPending = true;
    this._scheduledRenderTick();
  }

  /**
   * Notify that a track switch has completed.
   */
  onTrackSwitchComplete() {
    if (this._trackSwitchPending) {
      this._trackSwitchPending = false;
      scheduleAsync(() => {
        this.seek(
          this.playerState.bM() || 0,
          SeekCause.TRACK_CHANGED
        );
      });
    }
  }

  /**
   * Notify that a branch switch is starting (enter rebuffering).
   */
  onBranchSwitchStart() {
    this._branchSwitchBuffering = true;
    this.playerState.presentingState.set(PresentingState.WAITING);
    this._scheduledRenderTick();
  }

  /**
   * Get the current text track info.
   * @returns {*}
   */
  getActiveTextTrack() {
    return this.textStreamBuilder.r0();
  }

  /**
   * Get available text tracks.
   * @returns {*}
   */
  getTextTracks() {
    return this.textStreamBuilder.s0();
  }

  /**
   * Set the active text track.
   * @param {*} textTrack - The text track to activate
   */
  setActiveTextTrack(textTrack) {
    this.textStreamBuilder.YXc(textTrack);
    scheduleAsync(() => {
      this._scheduledRenderTick();
    });
  }

  /**
   * Get rebuffer statistics.
   * @returns {{ avRebufferCount: number, textRebufferCount: number }}
   */
  getRebufferStats() {
    return {
      dqa: this._avRebufferCount,
      lwa: this._textRebufferCount,
    };
  }

  /**
   * Seek to a specific time.
   * @param {number} time - Target time in milliseconds
   * @param {string} cause - Reason for the seek
   * @param {*} [movieId] - Optional movie ID (defaults to playerState.M)
   * @param {boolean} [isInternalSeek=false] - Whether this is an internal seek
   */
  seek(time, cause, movieId = this.playerState.M, isInternalSeek = false) {
    const hasLicense = this.playerState.streamingSession?.isDeviceMonitored;

    if (this.isDisposed() || !hasLicense) {
      return;
    }

    const liveMetadata = this.playerState.manifestRef?.manifestContent?.liveMetadata;
    const hasInternalJxb = liveMetadata?.internal_Jxb ?? false;

    if (
      this.playerState.liveController.isLive &&
      !hasInternalJxb &&
      time === 0
    ) {
      this.log.error(
        "Unexpected seek to 0 for the live playback",
        Error().stack
      );
    }

    this.playerState.fireEvent(PlayerEvents.bza, { Jc: cause });

    this._seekEngine.jU = {
      time,
      cause,
      M: movieId,
      buc: isInternalSeek,
    };

    this.playerState.presentingState.set(PresentingState.WAITING);
    this._scheduledRenderTick();
  }

  /**
   * Close and dispose of the media presenter.
   */
  close() {
    if (this._closed) {
      return;
    }

    this.log.info("Closing.");
    this.textStreamBuilder.closing();
    this._removeTimerStateListeners();
    this._stopRenderTimer();

    // Remove MediaSource event listeners
    this.mediaSourceElement.removeEventListener(
      MediaSourceEvents.seeked,
      this._mediaSourceEventHandlers[MediaSourceEvents.seeked]
    );
    this.mediaSourceElement.removeEventListener(
      MediaSourceEvents.currentTimeChanged,
      this._mediaSourceEventHandlers[MediaSourceEvents.currentTimeChanged]
    );

    // Remove HTMLVideoElement event listeners
    this.htmlVideoElement.removeEventListener(
      "ended",
      this._videoEventHandlers.ended
    );
    this.htmlVideoElement.removeEventListener(
      "play",
      this._videoEventHandlers.playing
    );
    this.htmlVideoElement.removeEventListener(
      "pause",
      this._videoEventHandlers.pause
    );
    this.htmlVideoElement.removeEventListener(
      "playing",
      this._videoEventHandlers.playing
    );

    // Close play state controller
    this._playStateController.closing();

    // Remove event bus listeners
    eventBus.removeListener(
      DOWNLOAD_EVENT,
      this._eventBusHandlers[DOWNLOAD_EVENT]
    );
    eventBus.removeListener(
      VISIBILITY_CHANGE_EVENT,
      this._eventBusHandlers[VISIBILITY_CHANGE_EVENT]
    );

    // Remove player state listeners
    this.playerState.removeEventListener(
      PlayerEvents.clearTimeoutFn,
      this._playerEventHandlers[PlayerEvents.clearTimeoutFn]
    );
    this.playerState.removeEventListener(
      PlayerEvents.internal_Aga,
      this._playerEventHandlers[PlayerEvents.internal_Aga]
    );
    this.playerState.removeEventListener(
      PlayerEvents.internal_Fga,
      this._playerEventHandlers[PlayerEvents.internal_Fga]
    );
    this.playerState.removeEventListener(
      PlayerEvents.ZM,
      this._playerEventHandlers[PlayerEvents.ZM]
    );

    // Remove observable listeners
    this.playerState.paused.removeListener(this._playerEventHandlers.paused);
    this.playerState.muted.removeListener(this._playerEventHandlers.muted);
    this.playerState.volume.removeListener(this._playerEventHandlers.volume);
    this.playerState.playbackRate.removeListener(
      this._playerEventHandlers.playbackRate
    );
    this.playerState.avBufferingState.removeListener(
      this._playerEventHandlers.avBufferingState
    );
    this.playerState.textBufferingState.removeListener(
      this._playerEventHandlers.textBufferingState
    );

    // Clear text stream callback
    this.textStreamBuilder.bha(() => {});

    this._closed = true;

    try {
      this.htmlVideoElement.volume = 0;
      this.htmlVideoElement.muted = true;
      this._pauseVideoElement();
      this.mediaSourceElement.closing();
    } catch (_ignored) {
      // Suppress errors during cleanup
    }

    this.htmlVideoElement = undefined;
    this.textStreamBuilder.xQb();
  }

  /**
   * Check if this presenter has been disposed or is in an invalid state.
   * @returns {boolean}
   */
  isDisposed() {
    if (this._closed) {
      return true;
    }
    if (isValidElement(this.htmlVideoElement)) {
      return false;
    }
    this.log.error(
      "MediaPresenter not closed and videoElement is not defined"
    );
    return true;
  }

  // ---------------------------------------------------------------------------
  // Private Methods - Initialization
  // ---------------------------------------------------------------------------

  /**
   * @private
   * Initialize the media presenter after source buffers are ready.
   */
  _initialize() {
    this.log.pauseTrace("Video element initializing");

    // Register each source buffer with the text stream builder
    this.mediaSourceElement.sourceBuffers.forEach((sb) => {
      this.textStreamBuilder.XXc(sb);
    });

    // Check DRM status
    if (this.playerState.aT) {
      this.log.pauseTrace("Waiting for encrypted");
    } else {
      this.log.RETRY("Movie is not DRM protected", {
        MovieId: this.playerState.R,
      });
      this.playerState.streamingSession?.internal_Faa(this.playerState.R);
    }

    // Process any licenses that arrived before source buffers were created
    if (this._pendingLicenses.size > 0) {
      setTimeout(() => {
        this.log.pauseTrace(
          "Notifying about licenses that were added before source buffers created"
        );
        Array.from(this._pendingLicenses).forEach((licenseId) => {
          this._pendingLicenses.delete(licenseId);
          this._onLicenseAdded(licenseId);
        });
      }, 0);
    }

    // Wait for loadedmetadata
    this.log.pauseTrace("Waiting for loadedmetadata");
    addOneTimeEventListener(
      this.htmlVideoElement,
      "loadedmetadata",
      () => {
        this.log.pauseTrace("Video element event: loadedmetadata");
        this.playerState.recordPlayDelay("md");
      }
    );

    // Register event bus listeners
    eventBus.addListener(
      DOWNLOAD_EVENT,
      (this._eventBusHandlers[DOWNLOAD_EVENT] = () => this.close()),
      DISPOSE_PRIORITY
    );

    // Register player state event listeners
    this.playerState.addEventListener(
      PlayerEvents.clearTimeoutFn,
      (this._playerEventHandlers[PlayerEvents.clearTimeoutFn] = () =>
        this.close()),
      DISPOSE_PRIORITY
    );

    this.playerState.addEventListener(
      PlayerEvents.internal_Aga,
      (this._playerEventHandlers[PlayerEvents.internal_Aga] = () =>
        this.close())
    );

    this.playerState.addEventListener(
      PlayerEvents.internal_Fga,
      (this._playerEventHandlers[PlayerEvents.internal_Fga] = () =>
        this._playVideoElement())
    );

    // Register observable listeners
    this.playerState.paused.addListener(
      (this._playerEventHandlers.paused = () => this._scheduledRenderTick())
    );

    this.playerState.muted.addListener(
      (this._playerEventHandlers.muted = () => this._syncVolumeAndMute())
    );

    this.playerState.volume.addListener(
      (this._playerEventHandlers.volume = () => this._syncVolumeAndMute())
    );

    this.playerState.playbackRate.addListener(
      (this._playerEventHandlers.playbackRate = () =>
        this._onPlaybackRateChanged())
    );

    this.playerState.avBufferingState.addListener(
      (this._playerEventHandlers.avBufferingState = () =>
        this._scheduledRenderTick())
    );

    this.playerState.textBufferingState.addListener(
      (this._playerEventHandlers.textBufferingState = () =>
        this._scheduledRenderTick())
    );

    // Initial volume/mute/rate sync
    this._syncVolumeAndMute();
    this._onPlaybackRateChanged();

    // Text stream readiness callback
    this.textStreamBuilder.bha(() => this._onDurationUpdated());
    this._onDurationUpdated();

    // Complete initialization
    this._completeInitialization();
  }

  /**
   * @private
   * Complete the initialization by attaching video element event listeners
   * and starting the render loop.
   */
  _completeInitialization() {
    // Attach MediaSource event listeners
    this.mediaSourceElement.addEventListener(
      MediaSourceEvents.seeked,
      (this._videoEventHandlers[MediaSourceEvents.seeked] = () =>
        this._onSeeked())
    );

    this.mediaSourceElement.addEventListener(
      MediaSourceEvents.currentTimeChanged,
      (this._videoEventHandlers[MediaSourceEvents.currentTimeChanged] = () =>
        this._onCurrentTimeChanged())
    );

    // Attach HTMLVideoElement event listeners
    this.htmlVideoElement.addEventListener(
      "ended",
      (this._videoEventHandlers.ended = () => {
        this.log.pauseTrace("Video element event: ended");
        this._scheduledRenderTick();
      })
    );

    this.htmlVideoElement.addEventListener(
      "play",
      (this._videoEventHandlers.playing = () => {
        this.log.pauseTrace("Video element event: play");
        this._scheduledRenderTick();
      })
    );

    this.htmlVideoElement.addEventListener(
      "pause",
      (this._videoEventHandlers.pause = () => {
        this.log.pauseTrace("Video element event: pause");
        this._playStateController.videoBufferedSegments();
        this._scheduledRenderTick();
      })
    );

    this.htmlVideoElement.addEventListener(
      "playing",
      (this._videoEventHandlers.playing = () => {
        this.log.pauseTrace("Video element event: playing");
        this._playStateController.videoBufferedSegments();
        this._scheduledRenderTick();
        if (
          config.monitorFrozenFrames &&
          this.playerState.hasAdvertisements()
        ) {
          this._videoFreezeMonitor.SZc();
        }
      })
    );

    /** @private @type {boolean} - Whether initialization is complete */
    this._initialized = true;

    this.textStreamBuilder.OVb(this.mediaTime);
    this.log.pauseTrace("Video element initialization complete");
    this.playerState.recordPlayDelay("vi");

    // Delayed readiness (e.g. for preload scenarios)
    if (config.mxb) {
      setTimeout(() => {
        this._ready = true;
        this._scheduledRenderTick();
      }, config.mxb);
    } else {
      this._ready = true;
    }

    // Set up decoder and render timeout monitors
    this._setupDecoderTimeoutMonitor();

    // Set up gap monitor for live content
    if (this.playerState.liveController.isLive) {
      this._setupGapMonitor();
    }

    scheduleAsync(() => this._scheduledRenderTick());
  }

  // ---------------------------------------------------------------------------
  // Private Methods - Timeout & Gap Monitoring
  // ---------------------------------------------------------------------------

  /**
   * @private
   * Set up decoder timeout and no-render timeout monitors.
   */
  _setupDecoderTimeoutMonitor() {
    // Decoder timeout: fires if we stay in WAITING state too long
    if (config.decoderTimeoutMilliseconds) {
      assert(!this._decoderTimer);
      this._decoderTimer = disposableList.key(createTimeoutTimer)(
        config.decoderTimeoutMilliseconds,
        () => {
          const errorInfo =
            disposableList.key(TimeoutErrorFactory).internal_Bxb(
              this.playerState
            );
          this._fireError(errorInfo.code, errorInfo);
        }
      );
      this._attachTimerStateListeners((restartTimer) =>
        this._updateDecoderTimer(restartTimer)
      );
    }

    // No-render timeout: fires if presenting but no frames are rendered
    if (config.noRenderTimeoutMilliseconds) {
      this._renderTimer = disposableList.key(createTimeoutTimer)(
        config.noRenderTimeoutMilliseconds,
        () => {
          if (this.playerState.mediaSourceManager?.getDecodedFrameCount() === 0) {
            const errorInfo =
              disposableList.key(TimeoutErrorFactory).internal_Bxb(
                this.playerState
              );
            this._fireError(errorInfo.code, errorInfo);
          }
          this._stopRenderTimer();
        }
      );
      this._attachRenderTimerListeners(() => this._updateRenderTimer());
    }
  }

  /**
   * @private
   * Update the decoder timer based on current player state.
   * Starts the timer when in WAITING state with all buffers normal and
   * license available; stops it otherwise.
   * @param {boolean} [restartTimer=true]
   */
  _updateDecoderTimer(restartTimer = true) {
    const session = this.playerState.streamingSession;
    const hasLicense =
      (session?.isDeviceMonitored && session.checkDrmReady()) ||
      this._skipLicenseCheck;

    const shouldStart =
      this.playerState.presentingState.value === PresentingState.WAITING &&
      this.playerState.state.value === PlaybackState.NORMAL &&
      this.playerState.avBufferingState.value === BufferingState.NORMAL &&
      this.playerState.textBufferingState.value === BufferingState.NORMAL &&
      !this.playerState.logBlobEvent &&
      hasLicense;

    let action;
    if (shouldStart) {
      if (restartTimer) {
        this._decoderTimer.flushFunction();
      }
      this._decoderTimer.OL();
      action = "ensureTimer";
    } else {
      this._decoderTimer.flushFunction();
      action = "stopTimer";
    }

    this.log.pauseTrace("Timer update: " + action, {
      presentingState: PresentingState[this.playerState.presentingState.value],
      playbackState: PlaybackState[this.playerState.state.value],
      avBufferingState: BufferingState[this.playerState.avBufferingState.value],
      textBufferingState:
        BufferingState[this.playerState.textBufferingState.value],
      autoplayWasBlocked: this.playerState.logBlobEvent,
      hasLicense,
      restartTimer,
    });
  }

  /**
   * @private
   * Attach listeners that trigger decoder timer re-evaluation.
   * @param {Function} updateFn
   */
  _attachTimerStateListeners(updateFn) {
    const addObservableListener = (observable, name, handler) => {
      handler = handler ?? (() => updateFn());
      this._timerStateListeners[name] = handler;
      observable.addListener(handler);
    };

    const addEventHandler = (target, eventName, handler) => {
      handler = handler ?? (() => updateFn());
      this._timerStateListeners[eventName] = handler;
      target.addEventListener(eventName, handler);
    };

    addObservableListener(this.playerState.avBufferingState, "avBufferingState");
    addObservableListener(this.playerState.presentingState, "presentingState");
    addObservableListener(
      this.playerState.textBufferingState,
      "textBufferingState"
    );
    addObservableListener(this.playerState.state, "state");
    addEventHandler(this.playerState, PlayerEvents.internal_Hoa);
    addEventHandler(this.playerState, PlayerEvents.logBlobEvent);
    addEventHandler(this.playerState, PlayerEvents.OZa);
    addEventHandler(this.playerState, PlayerEvents.bza, () => updateFn(true));

    updateFn();
  }

  /**
   * @private
   * Remove all timer state listeners.
   */
  _removeTimerStateListeners() {
    const removeEvent = (target, eventName) => {
      const handler = this._timerStateListeners[eventName];
      if (handler) {
        target.removeEventListener(eventName, handler);
        delete this._timerStateListeners[eventName];
      }
    };

    const removeObservable = (observable, name) => {
      const handler = this._timerStateListeners[name];
      if (handler) {
        observable.removeListener(handler);
        delete this._timerStateListeners[name];
      }
    };

    removeObservable(this.playerState.avBufferingState, "avBufferingState");
    removeObservable(this.playerState.presentingState, "presentingState");
    removeObservable(
      this.playerState.textBufferingState,
      "textBufferingState"
    );
    removeObservable(this.playerState.state, "state");
    removeEvent(this.playerState, PlayerEvents.internal_Hoa);
    removeEvent(this.playerState, PlayerEvents.logBlobEvent);
    removeEvent(this.playerState, PlayerEvents.OZa);
    removeEvent(this.playerState, PlayerEvents.bza);

    this._decoderTimer?.flushFunction();
  }

  /**
   * @private
   * Update the no-render timer based on presenting state and visibility.
   */
  _updateRenderTimer() {
    let action;
    if (
      this.playerState.presentingState.value === PresentingState.PLAYING &&
      this.playerState.mediaSourceManager?.getPlaybackRate() !== 0 &&
      !documentVisibility.hidden
    ) {
      this._renderTimer.OL();
      action = "ensureTimer";
    } else {
      this._renderTimer.flushFunction();
      action = "stopTimer";
    }

    this.log.pauseTrace("No render timer update: " + action, {
      presentingState:
        PresentingState[this.playerState.presentingState.value],
      hidden: documentVisibility.hidden,
    });
  }

  /**
   * @private
   * Attach listeners for the no-render timer.
   * @param {Function} updateFn
   */
  _attachRenderTimerListeners(updateFn) {
    this.playerState.presentingState.addListener(
      (this._renderTimerListeners.presentingState = updateFn)
    );
    eventBus.addListener(
      VISIBILITY_CHANGE_EVENT,
      (this._eventBusHandlers[VISIBILITY_CHANGE_EVENT] = updateFn)
    );
    updateFn();
  }

  /**
   * @private
   * Stop and clean up the no-render timer.
   */
  _stopRenderTimer() {
    if (this._renderTimerListeners.presentingState) {
      this.playerState.presentingState.removeListener(
        this._renderTimerListeners.presentingState
      );
    }
    eventBus.removeListener(
      VISIBILITY_CHANGE_EVENT,
      this._eventBusHandlers[VISIBILITY_CHANGE_EVENT]
    );
    this._renderTimer?.flushFunction();
  }

  /**
   * @private
   * Set up a gap monitor for live content that detects and seeks over
   * discontinuities in the buffered ranges.
   */
  _setupGapMonitor() {
    if (!config.gapsTimeoutMilliseconds) {
      return;
    }

    assert(!this._gapTimer);

    /**
     * Find the buffered ranges with gaps for a given media type.
     * @returns {{ bufferedRanges: Array, mediaType: string } | undefined}
     */
    const getGappedRanges = () => {
      const videoSb = this.mediaSourceElement.sourceBuffers.find(
        (sb) => sb.mediaType === MediaType.U
      );
      const videoRanges = videoSb?.getBufferedRanges() ?? [];

      const audioSb = this.mediaSourceElement.sourceBuffers.find(
        (sb) => sb.mediaType === MediaType.V
      );
      const audioRanges = config.monitorAudioGaps
        ? audioSb?.getBufferedRanges() ?? []
        : [];

      if (videoRanges.length > 1) {
        return { bufferedRanges: videoRanges, mediaType: "video" };
      }
      if (audioRanges.length > 1) {
        return { bufferedRanges: audioRanges, mediaType: "audio" };
      }
      return undefined;
    };

    /**
     * Find the next buffered range after the current media time.
     * @param {Array} ranges - Buffered ranges
     * @param {number} currentTime - Current media time
     * @returns {Object|undefined}
     */
    const findNextRange = (ranges, currentTime) => {
      return ranges.find((range, index) => {
        if (Math.abs(currentTime - range.end) < Math.abs(currentTime - range.start)) {
          return false;
        }
        const rangeLength = range.end - range.start;
        if (index !== ranges.length - 1 && rangeLength < 10000) {
          return false;
        }
        return true;
      });
    };

    /**
     * Update the gap timer based on current buffered state.
     */
    const updateGapTimer = () => {
      const gapped = getGappedRanges();
      if (!gapped) {
        this._gapTimer.flushFunction();
        return;
      }

      const { bufferedRanges, mediaType } = gapped;
      const readyState =
        this.htmlVideoElement?.readyState ??
        ReadyStateConstants.aK.HAVE_NOTHING;
      const isStarved = readyState < ReadyStateConstants.aK.HAVE_FUTURE_DATA;
      const nextRange = findNextRange(bufferedRanges, this.mediaTime);

      let action;
      if (isStarved && nextRange) {
        this._gapTimer.OL();
        action = "ensureTimer";
      } else {
        this._gapTimer.flushFunction();
        action = "stopTimer";
      }

      this.log.pauseTrace("Gaps Monitor Timer update: " + action, {
        mediaType,
        mediaTime: this.mediaTime,
        bufferedRanges: JSON.stringify(bufferedRanges),
        nextRange: JSON.stringify(nextRange),
        readyState,
      });
    };

    this._gapTimer = disposableList.key(createTimeoutTimer)(
      config.gapsTimeoutMilliseconds,
      () => {
        const gapped = getGappedRanges();
        if (gapped) {
          const { bufferedRanges } = gapped;
          const nextRange = findNextRange(bufferedRanges, this.mediaTime);
          if (nextRange) {
            this.log.error("Detected media gaps: seeking over gap", {
              seekPoint: nextRange.start,
              ranges: JSON.stringify(bufferedRanges),
            });
            this.mediaSourceElement.UUc();
            this.seek(nextRange.start, SeekCause.MEDIA_DISCONTINUITY);
          }
        }
      }
    );

    this.playerState.mediaTime.addListener(updateGapTimer);
    this.playerState.mediaSourceElement.addEventListener(
      MediaSourceEvents.readyStateChanged,
      updateGapTimer
    );
    this.playerState.addEventListener(PlayerEvents.sea, updateGapTimer);
    updateGapTimer();
  }

  // ---------------------------------------------------------------------------
  // Private Methods - Playback Control
  // ---------------------------------------------------------------------------

  /**
   * @private
   * Attempt to play the video element. Handles autoplay blocking.
   */
  _playVideoElement() {
    if (
      this.isDisposed() ||
      !isValidElement(this.htmlVideoElement) ||
      this.htmlVideoElement.ended ||
      !this._ready ||
      !this._playStateController.paused
    ) {
      return;
    }

    this.log.pauseTrace("Calling play on element");

    Promise.resolve(this._playStateController.playing())
      .then(() => {
        if (this._closed) return;
        this._autoplayBlocked = false;
        this.htmlVideoElement.style.display = null;
        this.playerState.logBlobEvent = false;
        this.playerState.fireEvent(PlayerEvents.internal_Hoa);
      })
      .catch((err) => {
        if (err.name === "NotAllowedError") {
          this.log.RETRY(
            "Playback is blocked by the browser settings",
            err
          );
          this.playerState.logBlobEvent = true;
          if (!this._closed) {
            this._autoplayBlocked = true;
            this.htmlVideoElement.style.display = "none";
            this.playerState.fireEvent(PlayerEvents.logBlobEvent, {
              player: {
                play: () => this._playVideoElement(),
              },
            });
          }
        } else if (!this._closed && !this._playPromiseRejectionLogged) {
          this._playPromiseRejectionLogged = true;
          this.log.error("Play promise rejected", err);
        }
      });
  }

  /**
   * @private
   * Pause the video element.
   */
  _pauseVideoElement() {
    if (
      this.isDisposed() ||
      !isValidElement(this.htmlVideoElement) ||
      this.htmlVideoElement.ended ||
      !this._ready ||
      this._playStateController.paused
    ) {
      return;
    }

    this.log.pauseTrace("Calling pause on element");
    this._playStateController.pause();
  }

  /**
   * @private
   * Sync the HTML video element's volume and muted properties with player state.
   */
  _syncVolumeAndMute() {
    if (this.isDisposed()) return;

    if (
      this.htmlVideoElement &&
      this.htmlVideoElement.volume !== this.playerState.volume.value
    ) {
      this.htmlVideoElement.volume = this.playerState.volume.value;
    }
    if (
      this.htmlVideoElement &&
      this.htmlVideoElement.muted !== this.playerState.muted.value
    ) {
      this.htmlVideoElement.muted = this.playerState.muted.value;
    }
  }

  /**
   * @private
   * Sync the HTML video element's playback rate with player state.
   */
  _onPlaybackRateChanged() {
    if (!this.isDisposed() && this.htmlVideoElement) {
      this.htmlVideoElement.playbackRate =
        this.playerState.playbackRate.value;
    }
  }

  // ---------------------------------------------------------------------------
  // Private Methods - Seeking
  // ---------------------------------------------------------------------------

  /**
   * @private
   * Process a pending seek request from the seek engine.
   */
  _processSeek() {
    if (!this._seekEngine.jU) {
      return;
    }

    const seekRequest = this._seekEngine.jU;
    const requestedTime = seekRequest.platform;
    const cause = seekRequest.cause;
    const movieId = seekRequest.M;
    const isInternalSeek = seekRequest.buc;

    if (this.textStreamBuilder.getUpdatingState() && cause !== SeekCause.INITIAL) {
      return;
    }

    const contentId = this.playerState.getPlaybackSegment(movieId).R;
    const textState = this.textStreamBuilder.getUpdatingState()
      ? undefined
      : this.textStreamBuilder.zvc();

    const seekResult = this._seekEngine.internal_Txc(
      requestedTime,
      cause,
      movieId,
      isInternalSeek,
      textState
    );

    const newMediaTime = seekResult.OT;
    const contentPts = seekResult.encryptionMetadata;
    const playerPts = seekResult.EPc;
    const shouldSkip = seekResult.parseData;
    const isExactSeek = seekResult.eF;

    this.textStreamBuilder.rQa(this.mediaTime);
    const oldMediaTime = this.mediaTime;
    const formattedRequestedTime = formatTime(requestedTime);

    this.playerState.debugLog(
      `SEEKING: Requested: (${contentId}:${cause}:${formattedRequestedTime}) - Actual: (contentPts: ${contentPts},playerPts: ${playerPts}, newMediaTime: ${newMediaTime})`
    );

    this.log.info("Seeking", {
      Requested: formattedRequestedTime,
      Actual: formatTime(newMediaTime),
      Cause: cause,
      Skip: shouldSkip,
    });

    if (cause !== SeekCause.INITIAL && !shouldSkip) {
      this.textStreamBuilder.xQb();
      this.textStreamBuilder.TXc();
    }

    const prevMediaTimeObservable = this.playerState.mediaTimeObservable.value;
    const prevTargetBuffer = this.playerState.targetBuffer.value;

    this.playerState.mediaTimeObservable.set(null);
    this.playerState.targetBuffer.set(null);
    this._seekEngine.jU = undefined;

    const seekInfo = {
      eF: isExactSeek,
      XT: oldMediaTime,
      OT: newMediaTime,
      encryptionMetadata: contentPts,
      cause,
      skip: shouldSkip,
      mediaTimeObservable: prevMediaTimeObservable,
      targetBuffer: prevTargetBuffer,
      R: contentId,
    };

    if (shouldSkip) {
      this._seekEngine.nfa = true;
    } else {
      this._seekEngine.Y2 = seekInfo;
    }

    this.playerState.fireEvent(PlayerEvents.D3, seekInfo);

    if (shouldSkip) {
      this._applyPtsChange(seekInfo, newMediaTime, contentPts);
      this.textStreamBuilder.skip(newMediaTime);
    }
  }

  /**
   * @private
   * Process a pending PTS change from the seek engine (after source buffer seek completes).
   */
  _processPendingPtsChange() {
    if (!this._seekEngine.nfa) {
      return;
    }
    if (
      this._isBufferingComplete() &&
      this.textStreamBuilder.cSa(this.mediaTime)
    ) {
      this.mediaSourceElement.seek(this.mediaTime);
      this._seekEngine.nfa = false;
      scheduleAsync(() => this._scheduledRenderTick());
    }
  }

  /**
   * @private
   * Apply a PTS change: update media time and fire the event.
   * @param {Object} seekInfo - Seek info object
   * @param {number} newTime - New media time
   * @param {*} contentPts - Content PTS metadata
   */
  _applyPtsChange(seekInfo, newTime, contentPts) {
    this.mediaTime = newTime;
    this._emitMediaTime(true);
    this.playerState.fireEvent(PlayerEvents.pt, {
      OT: newTime,
      encryptionMetadata: contentPts,
      XT: seekInfo.XT,
      cause: seekInfo.cause,
      skip: seekInfo.skip,
      mediaTimeObservable: seekInfo.mediaTimeObservable,
      targetBuffer: seekInfo.targetBuffer,
      R: seekInfo.R,
    });
  }

  // ---------------------------------------------------------------------------
  // Private Methods - State Management
  // ---------------------------------------------------------------------------

  /**
   * @private
   * Determine the current presenting state (PLAYING, PAUSED, WAITING, ENDED).
   * @returns {number}
   */
  _determinePresentingState() {
    const currentState = this.playerState.presentingState.value;
    let newState = currentState;

    if (this._seekEngine.sda) {
      newState = PresentingState.WAITING;
    } else if (this.htmlVideoElement && this.htmlVideoElement.ended) {
      if (currentState === PresentingState.PLAYING) {
        newState = PresentingState.ENDED;
      }
    } else if (
      this._isBufferingComplete() &&
      this.textStreamBuilder.cSa(this.mediaTime)
    ) {
      if (this.mediaSourceElement.xoc()) {
        newState = this._playStateController.paused
          ? PresentingState.PAUSED
          : PresentingState.PLAYING;
      } else {
        this._durationObservable.scheduleHydration(() =>
          this._onCanPlayThrough()
        );
      }
    } else {
      newState = this.playerState.seekTarget
        ? this.playerState.iEb(
            this.mediaTime,
            this.textStreamBuilder.cqa()
          )
          ? PresentingState.WAITING
          : PresentingState.ENDED
        : PresentingState.WAITING;
    }

    return newState;
  }

  /**
   * @private
   * Called when the video element can play through (enough data buffered).
   */
  _onCanPlayThrough() {
    if (this.isDisposed()) return;
    if (config.qLc) {
      this.textStreamBuilder.pLc();
    }
    this._scheduledRenderTick();
  }

  /**
   * @private
   * Check if both AV and text buffering are in NORMAL state.
   * @returns {boolean}
   */
  _isBufferingComplete() {
    return (
      this.playerState.avBufferingState.value === BufferingState.NORMAL &&
      this.playerState.textBufferingState.value === BufferingState.NORMAL
    );
  }

  /**
   * @private
   * Called when a rebuffer event starts (transition from PLAYING/PAUSED to WAITING).
   */
  _onRebufferStart() {
    if (this.playerState.presentingState.value !== PresentingState.WAITING) {
      return;
    }

    const textAheadOfAV =
      this.textStreamBuilder.q1c() > this.textStreamBuilder.cqa();

    if (this.playerState.textBufferingState.value !== BufferingState.NORMAL) {
      if (this.playerState.isSeeking.value) {
        this.playerState.fireEvent(PlayerEvents.iH, {
          Jc: TIMED_TEXT_REBUFFER,
        });
        this.log.RETRY(
          "rebuffer due to timed text",
          this.playerState.isSeeking.value.playbackInfo
        );
      } else {
        this.playerState.fireEvent(PlayerEvents.R4);
      }
    } else if (textAheadOfAV) {
      this._avRebufferCount++;
      this.playerState.fireEvent(PlayerEvents.iH, { Jc: AV_REBUFFER });
    } else {
      this._textRebufferCount++;
      this.playerState.fireEvent(PlayerEvents.iH, { Jc: TEXT_REBUFFER });
    }
  }

  // ---------------------------------------------------------------------------
  // Private Methods - Media Time
  // ---------------------------------------------------------------------------

  /**
   * @private
   * Update the media time from the element's current time, with rewind protection.
   * @param {number} elementTime - Current time reported by the video element
   */
  _updateMediaTime(elementTime) {
    if (elementTime < this.mediaTime) {
      if (this.mediaTime - elementTime > REWIND_THRESHOLD) {
        if (config.performRewindCheck || config.logUnexpectedRewindDelay) {
          this._unexpectedRewindCount++;
          const diagnosticInfo = {
            Trace: this.mediaSourceElement.consoleLogger.traceDownloadEvents(),
            ElementTime: formatTime(elementTime),
            MediaTime: formatTime(this.mediaTime),
          };

          if (config.performRewindCheck) {
            this._fireError(ErrorCode.PLAY_MSE_UNEXPECTED_REWIND, {
              Cf: diagnosticInfo,
            });
          } else if (config.logUnexpectedRewindDelay) {
            this.mediaSourceElement.consoleLogger.pauseTrace(
              "unexpected-rewind"
            );
            Da.setTimeout(() => {
              this.log.error("UnexpectedRewind", diagnosticInfo);
            }, config.logUnexpectedRewindDelay);
          }
        }
      }
    } else {
      this.mediaTime = clampValue(
        elementTime,
        0,
        this.playerState.seekTarget.toUnit(MILLISECONDS)
      );
    }
  }

  /**
   * @private
   * Emit the current media time to the player state.
   * @param {boolean} [forceNotify=false] - Whether to force notification
   */
  _emitMediaTime(forceNotify) {
    this.playerState.mediaTime.set(this.mediaTime);
    if (forceNotify) {
      this.playerState.internal_Qtc();
    }
  }

  // ---------------------------------------------------------------------------
  // Private Methods - Duration & Buffers
  // ---------------------------------------------------------------------------

  /**
   * @private
   * Called when the duration may need updating (after buffer appends or text stream changes).
   */
  _onDurationUpdated() {
    if (this._initialized) {
      this._scheduledRenderTick();
    }
    this.textStreamBuilder.internal_Vtb();
  }

  /**
   * @private
   * Update the MediaSource duration if the new segment extends beyond the current duration.
   * @param {Object} appendInfo - Segment append information
   * @returns {Promise<void>}
   */
  _updateDuration(appendInfo) {
    const isOpen =
      this.mediaSourceElement && this.mediaSourceElement.WVa();

    assert(
      this.playerState.seekTarget,
      "Player duration should be defined before appends start (ase did not fire segmentNormalized event)"
    );

    if (this.playerState.seekTarget && isOpen) {
      let endTime;
      if (
        appendInfo.processingLatencyMs !== Infinity &&
        appendInfo.timestampOffset > 0
      ) {
        endTime =
          appendInfo.processingLatencyMs + appendInfo.timestampOffset;
      } else {
        endTime = appendInfo.ptsEnd;
      }

      if (endTime > this.playerState.seekTarget.R2a(MILLISECONDS)) {
        this.playerState.seekTarget = createDuration(endTime);
      }
    }

    return Promise.resolve();
  }

  /**
   * @private
   * Process ASE location data for a segment.
   * @param {Object} sourceBuffer - Source buffer
   * @param {number} endTime - End time
   * @returns {number} Possibly modified end time
   */
  _processAseLocation(sourceBuffer, endTime) {
    const aseData = this.playerState.hm;
    const extractedOutput = aseData?.extractOutput();

    if (extractedOutput && sourceBuffer.type === MediaType.U) {
      const processor = new SegmentLocationProcessor(this.log, {
        mediaType: MediaType.U,
        url: "http://some-url",
      }, endTime);

      const processed = processor.ase_location_history(extractedOutput);
      if (processed) {
        endTime = processed;
      }
    }

    return endTime;
  }

  // ---------------------------------------------------------------------------
  // Private Methods - Event Handlers
  // ---------------------------------------------------------------------------

  /**
   * @private
   * Handle a license being added.
   * @param {*} licenseId
   */
  _onLicenseAdded(licenseId) {
    this.playerState.recordPlayDelay("ld", licenseId);
    this.playerState.streamingSession?.internal_Faa(licenseId);
    this.playerState.fireEvent(PlayerEvents.OZa);
  }

  /**
   * @private
   * Handle the 'seeked' event from the media source.
   */
  _onSeeked() {
    this._scheduledRenderTick();
  }

  /**
   * @private
   * Handle the 'currentTimeChanged' event from the media source.
   */
  _onCurrentTimeChanged() {
    this._scheduledRenderTick();
    this.playerState.fireEvent(PlayerEvents.currentTimeChanged);
  }

  /**
   * @private
   * Fire an error through the player state, unless already closed.
   * @param {string} code - Error code
   * @param {Object} [data] - Error data
   * @param {*} [extra] - Extra info
   */
  _fireError(code, data, extra) {
    if (!this._closed) {
      this.playerState.fireError(code, data, extra);
    }
  }
}

export { MediaPresenterASE };
