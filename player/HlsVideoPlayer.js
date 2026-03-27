/**
 * Netflix Cadmium Player - HLS Video Player
 *
 * Native HLS-based video player implementation for platforms that support
 * HLS natively (e.g., Safari / iOS). Creates an HTML5 <video> element and
 * relies on the browser's built-in HLS support rather than Media Source
 * Extensions (MSE). Handles playback lifecycle, track selection, event
 * dispatching, manifest fetching, ad-break gating, and analytics.
 *
 * This is the counterpart to the MSE-based player; the factory chooses
 * between them based on the `useHLSPlayer` config flag.
 *
 * @module HlsVideoPlayer
 * @see Module_25050
 */

// --- Dependency imports (webpack module IDs for reference) ---
import {
  setState as PlaybackState,
  cb as PlayerEvent
} from '../drm/LicenseBroker.js';                       // p = a(85001)
import { createElement } from '../core/PlayerConfig.js'; // c = a(52569)
import { playbackInstanceHolder } from './PlaybackRegistry.js'; // g = a(13044)
import { qq as ManifestFlavor } from '../streaming/AsePrefetcherAdapter.js';   // f = a(72639)
import { trustedConfig as TrustedConfig } from '../drm/EmeSession.js'; // e = a(24735)
import {
  ea as ErrorCode,
  EventTypeEnum
} from '../drm/MediaKeySystemAccessServices.js';                       // h = a(36129)
import { zv as ReadyStateMap } from '../msl/MslComponentInitializer.js'; // k = a(63156)
import { currentBitrate as Observable } from '../drm/EmeSession.js'; // l = a(81734)
import { MILLISECONDS } from '../drm/LicenseBroker.js';  // m = a(5021)
import { wc as isValidNumber } from '../utils/IpAddressUtils.js'; // n = a(32687)
import { mergeSessionData } from '../drm/DefaultDrmProvider.js';   // q = a(45266)
import { initializeModel as serializeError } from '../utils/IpAddressUtils.js'; // r = a(3887)
import { MediaType } from '../streaming/MediaRequestEventReporter.js';    // u = a(26388)
import { AbortController } from '../core/AsejsEngine.js'; // v = a(91176)

/**
 * HLS-based video player that uses native browser HLS support.
 *
 * Instantiated when the platform supports `application/vnd.apple.mpegURL`
 * and the configuration flag `useHLSPlayer` is set.
 */
class HlsVideoPlayer {
  /**
   * @param {Object} logger - Logger factory (createSubLogger)
   * @param {Function} createPlaybackSession - Factory for playback sessions (DRM session creator)
   * @param {Object} mediaKeySession - Media key / license session helper
   * @param {Object} clock - Wall-clock / system-time provider
   * @param {Object} manifestStore - Manifest fetching service
   * @param {Object} eventEmitter - Player event emitter / dispatcher
   * @param {Object} adService - Advertisement service
   * @param {Object} hlsStreamBuilder - HLS stream builder (builds HLS URL + segments)
   * @param {Object} playgraphManager - Playgraph lifecycle manager
   * @param {Object} videoStreamHandler - Video stream presentation handler
   * @param {Object} audioStreamHandler - Audio stream presentation handler
   * @param {Object} playerCore - Core player reference (system clock, etc.)
   * @param {Object} analyticsService - Analytics / telemetry service
   * @param {Object} config - Player configuration
   * @param {Object} asyncLoader - Async component loader
   * @param {Object} currentSegment - Current playback segment descriptor
   * @param {Function} createError - Error factory for player errors
   */
  constructor(
    logger,
    createPlaybackSession,
    mediaKeySession,
    clock,
    manifestStore,
    eventEmitter,
    adService,
    hlsStreamBuilder,
    playgraphManager,
    videoStreamHandler,
    audioStreamHandler,
    playerCore,
    analyticsService,
    config,
    asyncLoader,
    currentSegment,
    createError
  ) {
    /** @private */
    this._createPlaybackSession = createPlaybackSession;
    /** @private */
    this._mediaKeySession = mediaKeySession;
    /** @private */
    this._clock = clock;
    /** @private */
    this._manifestStore = manifestStore;
    /** @private */
    this._eventEmitter = eventEmitter;
    /** @private */
    this._adService = adService;
    /** @private */
    this._hlsStreamBuilder = hlsStreamBuilder;
    /** @private */
    this._playgraphManager = playgraphManager;
    /** @private */
    this._videoStreamHandler = videoStreamHandler;
    /** @private */
    this._audioStreamHandler = audioStreamHandler;
    /** @private */
    this._playerCore = playerCore;
    /** @private */
    this._analyticsService = analyticsService;
    /** @private */
    this._config = config;
    /** @private */
    this._asyncLoader = asyncLoader;
    /** @private */
    this._currentSegment = currentSegment;
    /** @private */
    this._createError = createError;

    // --- Observable state ---

    /** Whether an advertisement is currently active (starts true until content loads) */
    this._isAdActive = new Observable(true);
    /** Whether playback is currently playing (not paused) */
    this._isPlaying = new Observable(false);
    /** Whether the media is stalled / buffering */
    this._isStalled = new Observable(false);
    /** Whether playback has reached the end */
    this._hasEnded = new Observable(false);
    /** Loading progress (0 = not loaded, 0.5 = metadata, 1 = ready) */
    this._loadProgress = new Observable(0);
    /** Current playback presentation state */
    this._presentationState = new Observable(PlaybackState.WAITING);
    /** Target time for an in-progress seek operation */
    this._seekTargetTime = new Observable(undefined);

    // --- Internal state ---

    /** @private */
    this._abortController = new AbortController();
    /** @private */
    this._isClosed = false;
    /** @private */
    this._contentPlaygraphStarted = false;
    /** @private */
    this._isLoaded = false;
    /** @private {Set<string>} Events that have been fired once */
    this._firedOnceEvents = new Set();
    /** @private */
    this._playbackBlocked = false;
    /** @private */
    this._autoplayRequested = false;

    // --- Logger ---
    /** @private */
    this._log = logger.createSubLogger('HLSVideoPlayer');

    // --- Video element ---

    /** @private {HTMLVideoElement} */
    this._videoElement = createElement(
      'VIDEO',
      'position:absolute;width:100%;height:100%'
    );
    this._videoElement.playsInline = this._config.bOb;

    // --- Playback session ---

    /** @private */
    this._session = this._createPlaybackSession(
      playbackInstanceHolder.index++,
      currentSegment.R,
      currentSegment.id,
      currentSegment.manifestSessionData ?? {},
      this._mediaKeySession.wH(),
      this._clock.getCurrentTime(),
      false,
      undefined,
      () => this._getCurrentTimeMs()
    );

    this._session.mediaTime.set(this._session.hashQuery ?? 0);

    this._setupEventListeners();

    /** @private */
    this._analyticsTracker = this._analyticsService.create(this);
    // Trigger tracker initialisation side-effect
    this._analyticsTracker;

    this._load();
  }

  // ---------------------------------------------------------------------------
  // HLS support check
  // ---------------------------------------------------------------------------

  /**
   * Check whether the browser natively supports HLS playback.
   * @returns {boolean}
   */
  _supportsHls() {
    return (
      !!this._videoElement.canPlayType &&
      (this._videoElement.canPlayType('application/vnd.apple.mpegURL') !== '' ||
        this._videoElement.canPlayType('audio/mpegurl') !== '')
    );
  }

  // ---------------------------------------------------------------------------
  // Event listener setup
  // ---------------------------------------------------------------------------

  /**
   * Attach all event listeners to the HTML video element and observable state.
   * @private
   */
  _setupEventListeners() {
    const el = this._videoElement;

    el.addEventListener('loadedmetadata', () => {
      this._emitEvent(PlayerEvent.rIb);
      this._emitEvent(PlayerEvent.qIb);
      this._emitEvent(PlayerEvent.eventCallback);
      this._emitEvent(PlayerEvent.internal_Doa);
      this._emitEvent(PlayerEvent.gq);
      this._emitEvent(PlayerEvent.EC);
    });

    el.addEventListener('error', (event) => {
      const error = this._createError(ErrorCode.PLAY_MSE_EVENT_ERROR, event);
      this._close(error);
    });

    el.addEventListener('timeupdate', () => {
      this._hasEnded.set(false);
      this._session.mediaTime.set(this._getCurrentTimeMs());
      this._syncStreamHandlers();
      this._emitEvent(PlayerEvent.currentTimeChanged);
      this._emitEvent(PlayerEvent.kWb);
    });

    el.addEventListener('durationchange', () => {
      this._emitEvent(PlayerEvent.RSa);
    });

    el.addEventListener('resize', () => {
      this._emitEvent(PlayerEvent.P8a);
    });

    el.addEventListener('playing', () => {
      this._syncStreamHandlers();
      this._isStalled.set(false);
      this._isPlaying.set(true);
      this._hasEnded.set(false);
      this._presentationState.set(PlaybackState.PLAYING);
    });

    el.addEventListener('pause', () => {
      this._isPlaying.set(false);
      this._isStalled.set(false);
      this._presentationState.set(PlaybackState.PAUSED);
    });

    el.addEventListener('waiting', () => {
      this._presentationState.set(PlaybackState.WAITING);
    });

    el.addEventListener('stalled', () => {
      this._isStalled.set(true);
    });

    el.addEventListener('seeking', () => {
      this._isStalled.set(false);
      this._seekTargetTime.set(this._session.mediaTime.value);
      this._presentationState.set(PlaybackState.WAITING);
    });

    el.addEventListener('seeked', () => {
      if (this._seekTargetTime.value !== undefined) {
        this._session.playDelayMetrics.M0a(
          this._seekTargetTime.value,
          this._getCurrentTimeMs()
        );
        this._seekTargetTime.set(undefined);
      }
      this._presentationState.set(
        this.isCurrentlyPlaying() ? PlaybackState.PLAYING : PlaybackState.PAUSED
      );
    });

    el.addEventListener('progress', () => {
      this._emitEvent(PlayerEvent.internal_Toa);
      this._updateLoadProgress();
    });

    el.addEventListener('ended', () => {
      this._presentationState.set(PlaybackState.ENDED);
      this._isStalled.set(false);
      this._isPlaying.set(false);
      this._hasEnded.set(true);
    });

    el.addEventListener('volumechange', () => {
      this._emitEvent(PlayerEvent.HXb);
      this._emitEvent(PlayerEvent.EKb);
    });

    // --- Observable listeners ---

    this._isPlaying.addListener(() => {
      this._emitEvent(PlayerEvent.I2a);
      this._emitEvent(PlayerEvent.mNb);
      this._maybeStartContentPlaygraph();
    });

    this._loadProgress.addListener(() => {
      this._emitEvent(PlayerEvent.kZ);
    });

    this._isStalled.addListener(() => {
      this._emitEvent(PlayerEvent.kZ);
    });

    this._isAdActive.addListener(() => {
      this._maybeStartContentPlaygraph();
    });

    this._hasEnded.addListener(() => {
      this._emitEvent(PlayerEvent.internal_Syb);
    });

    this._session.playbackRate.addListener((change) => {
      this._videoElement.playbackRate = change.newValue;
      this._emitEvent(PlayerEvent.internal_Tfa);
    });
  }

  // ---------------------------------------------------------------------------
  // Playgraph lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Start the content playgraph if we are playing, not in an ad, and haven't
   * already started it.
   * @private
   */
  _maybeStartContentPlaygraph() {
    if (
      !this.isCurrentlyPlaying() ||
      this._isAdActive.value ||
      this._contentPlaygraphStarted ||
      this._playbackBlocked
    ) {
      return;
    }
    this._contentPlaygraphStarted = true;
    this._session.kI = this._playerCore.kJ;
    this._playgraphManager.startPlayback(this, this._session);
  }

  // ---------------------------------------------------------------------------
  // Time / offset calculations
  // ---------------------------------------------------------------------------

  /**
   * Calculate the time from playback start to the transition point.
   * @returns {number} Milliseconds
   */
  getTimeToTransition() {
    return (
      this._transitionTimeMs -
      (this._session.timeOffset.toUnit(MILLISECONDS) +
        this._clock.sI.toUnit(MILLISECONDS))
    );
  }

  /**
   * Get the effective playback start time in milliseconds.
   * Uses the session's JC value if valid, otherwise computes from offsets.
   * @returns {number} Milliseconds
   */
  _getEffectiveStartTime() {
    const jc = this._session.sessionContext.JC;
    return isValidNumber(jc)
      ? jc
      : this._session.timeOffset.toUnit(MILLISECONDS) +
          this._clock.sI.toUnit(MILLISECONDS);
  }

  /**
   * Elapsed time since the effective start.
   * @returns {number} Milliseconds
   */
  getElapsedSinceStart() {
    return this._playerCore.systemClock.toUnit(MILLISECONDS) - this._getEffectiveStartTime();
  }

  /**
   * Time remaining until the transition point.
   * @returns {number} Milliseconds
   */
  getTimeUntilTransition() {
    return this._transitionTimeMs - this._getEffectiveStartTime();
  }

  // ---------------------------------------------------------------------------
  // Loading progress
  // ---------------------------------------------------------------------------

  /**
   * Update the loading progress based on the video element's ready state.
   * When fully loaded, marks the transition time and clears the ad flag.
   * @private
   */
  _updateLoadProgress() {
    let progress;
    if (this._videoElement.readyState <= ReadyStateMap.aK.HAVE_METADATA) {
      progress = 0;
    } else if (this._videoElement.readyState <= ReadyStateMap.aK.HAVE_CURRENT_DATA) {
      progress = 0.5;
    } else {
      progress = 1;
    }

    if (progress === 1) {
      this._transitionTimeMs = this._playerCore.systemClock.toUnit(MILLISECONDS);
      this._isAdActive.set(false);
      this._emitOnce(PlayerEvent.loaded);
    }

    this._loadProgress.set(progress);
  }

  // ---------------------------------------------------------------------------
  // Stream handler sync
  // ---------------------------------------------------------------------------

  /**
   * Synchronize both video and audio stream handlers with the current time.
   * @private
   */
  _syncStreamHandlers() {
    const currentTimeMs = this._getCurrentTimeMs();
    this._videoStreamHandler.gSb(currentTimeMs);
    this._audioStreamHandler.gSb(currentTimeMs);
  }

  // ---------------------------------------------------------------------------
  // Manifest fetching & HLS initialisation
  // ---------------------------------------------------------------------------

  /**
   * Fetch the supplemental manifest, set up audio/text track listeners,
   * build the HLS stream URL, and begin loading.
   * @private
   * @returns {Promise<void>}
   */
  _fetchManifestAndInitialize() {
    this._session.recordPlayDelay('ats');

    return this._manifestStore
      .fetchManifest(
        {
          Ia: this._session.sourceTransactionId,
          sessionContext: this._session.sessionContext,
          J: this._session.R,
          flavor: ManifestFlavor.SUPPLEMENTAL,
          type: TrustedConfig.$r,
        },
        this._abortController.signal
      )
      .then((manifest) => {
        /**
         * Set the active text/subtitle track, filtering out "none" tracks
         * that don't pass the checkMethod gate.
         * @param {Object|null} track
         */
        const setActiveTextTrack = (track) => {
          let effectiveTrack = track;
          if (track && track.dr() && !track.checkMethod()) {
            effectiveTrack = null;
          }
          this._session.isSeeking.set(effectiveTrack);
        };

        this._session.recordPlayDelay('at');

        const parsedManifest = this._adService.create({}).YMb(manifest);
        this._session.manifestRef = manifest;
        this._session.parsedManifest = parsedManifest;

        // --- Native audio track synchronisation ---

        this._videoElement.audioTracks.addEventListener('addtrack', () => {
          this._syncNativeAudioTrack(this._session.tracks.audioTrackSelection);
        });

        this._videoElement.audioTracks.addEventListener('change', () => {
          for (const nativeTrack of this._videoElement.audioTracks) {
            if (
              nativeTrack.qcEnabled &&
              nativeTrack.label !== this._session.tracks.audioTrackSelection?.displayName
            ) {
              const matchedTrack =
                this._session.supportedKeySystemList.find(
                  (t) => t.displayName === nativeTrack.label
                ) ?? null;
              this._session.tracks.setAudioTrack(matchedTrack);
            }
          }
        });

        this._session.tracks.addListener([MediaType.V], (change) => {
          this._syncNativeAudioTrack(change.UE);
          this._emitEvent(PlayerEvent.eventCallback);
          this._emitEvent(PlayerEvent.EC);
        });

        // --- Native text track synchronisation ---

        this._videoElement.textTracks.addEventListener('addtrack', () => {
          this._syncNativeTextTrack(this._session.tracks.textTrackSelection);
        });

        this._videoElement.textTracks.addEventListener('change', () => {
          const textTracks = this._videoElement.textTracks;
          for (let i = 0; i < textTracks.length; i++) {
            const nativeTrack = textTracks[i];
            if (
              nativeTrack.mode === 'showing' &&
              nativeTrack.label !== this._session.tracks.textTrackSelection?.displayName
            ) {
              const matchedTrack =
                this._session.sk.find(
                  (t) => t.displayName === nativeTrack.label
                ) ?? null;
              this._session.tracks.setTextTrack(matchedTrack);
              setActiveTextTrack(matchedTrack);
            }
          }
        });

        this._session.tracks.setTextTrack(parsedManifest.paa);
        setActiveTextTrack(parsedManifest.paa);

        this._session.tracks.addListener([MediaType.TEXT_MEDIA_TYPE], (change) => {
          this._syncNativeTextTrack(change.textTrackInfo);
          this._emitEvent(PlayerEvent.gq);
        });

        return this._hlsStreamBuilder.build(manifest, (label) =>
          this._session.recordPlayDelay(label)
        );
      })
      .then((hlsResult) => {
        const hlsUrl = hlsResult.ZHc;
        const cdnMap = hlsResult.wgc;
        const streamData = hlsResult.B_c;

        const audioSegments = streamData.audioBufferedSegments;
        const defaultAudioTrackId = streamData.$wb;
        const videoSegments = streamData.videoBufferedSegments;

        const {
          playbackRate,
          tracks,
          supportedKeySystemList,
          isStalled,
          hashQuery: startPosition,
          targetBuffer,
          mediaTimeObservable,
          playDelayMetrics,
          parsedManifest,
        } = this._session;

        // Filter supported audio tracks to those present in the manifest
        parsedManifest.supportedKeySystemList = supportedKeySystemList.filter(
          (track) => audioSegments.find((seg) => seg.track.ff === track.trackId)
        );

        tracks.setVideoTrack(parsedManifest.defaultTrack);
        tracks.setAudioTrack(
          supportedKeySystemList.find((t) => t.trackId === defaultAudioTrackId)
        );

        const videoSegment = videoSegments[0];
        const videoStream = videoSegment.stream;
        const audioSegment = audioSegments.find(
          (seg) => seg.track.ff === defaultAudioTrackId
        );
        const audioStream = audioSegment.stream;

        this._initialBitrate = videoStream.bitrate;

        // --- Video stream handler wiring ---
        this._videoStreamHandler.X2a.addListener(
          this._createPresentingHandler(tracks.videoTrack, targetBuffer)
        );
        this._videoStreamHandler.L6a.addListener(
          this._createStreamingHandler(
            tracks.videoTrack,
            isStalled,
            this._session.sourceBufferArray[MediaType.U]
          )
        );

        const videoCdnUrlId = cdnMap.key(videoStream.sh).m3.urlId;
        this._videoStreamHandler.data(videoSegments, videoSegment, videoCdnUrlId);

        // --- Audio stream handler wiring ---
        this._audioStreamHandler.X2a.addListener(
          this._createPresentingHandler(tracks.audioTrackSelection, mediaTimeObservable)
        );
        this._audioStreamHandler.L6a.addListener(
          this._createStreamingHandler(
            tracks.audioTrackSelection,
            playbackRate,
            this._session.sourceBufferArray[MediaType.V]
          )
        );

        const audioCdnUrlId = cdnMap.key(audioStream.sh).m3.urlId;
        this._audioStreamHandler.data(audioSegments, audioSegment, audioCdnUrlId);

        // --- Start loading ---
        this._videoElement.src = hlsUrl;
        this._videoElement.currentTime = (startPosition ?? 0) / 1000;
        this._videoElement.loading();

        playDelayMetrics.M0a(0, startPosition && startPosition > 0 ? startPosition : 1);
      })
      .catch((err) => {
        if (err instanceof Error) {
          const serialised = serializeError(err);
          this._log.error('uncaught exception', err, serialised);
        }
        this._close(
          this._createError(err.code ?? ErrorCode.UNHANDLED_EXCEPTION, err)
        );
      });
  }

  // ---------------------------------------------------------------------------
  // Stream change handler factories
  // ---------------------------------------------------------------------------

  /**
   * Create a handler invoked when a new segment is being presented (downloaded).
   * @param {Object} trackInfo - Track descriptor (has `.streams`, `.trackId`)
   * @param {Object} targetObservable - Observable to set with the new segment info
   * @returns {Function} Listener callback
   * @private
   */
  _createPresentingHandler(trackInfo, targetObservable) {
    return (change) => {
      const { cdnid, CZ: segment, stream: streamRef } = change.newValue;

      const matchedStream = trackInfo.streams.find(
        (s) => s.bitrate === streamRef.stream.bitrate
      );
      const cdn = this._session.di.find((c) => c.id === cdnid);

      this._log.info(
        `Presenting ${matchedStream.type} request with bitrate ${matchedStream.bitrate}, ` +
          `track ${trackInfo.trackId} [${segment.startTime}...${segment.endTime}]`
      );

      targetObservable.set({
        stream: matchedStream,
        CZ: {
          ...segment,
          Yic: segment.startTime,
          jvb: segment.endTime,
        },
        sourceBufferArray: cdn,
      });
    };
  }

  /**
   * Create a handler invoked when a stream switch occurs (new bitrate is active).
   * @param {Object} trackInfo - Track descriptor
   * @param {Object} bitrateObservable - Observable for the active bitrate
   * @param {Object} cdnObservable - Observable for the active CDN
   * @returns {Function} Listener callback
   * @private
   */
  _createStreamingHandler(trackInfo, bitrateObservable, cdnObservable) {
    return (change) => {
      const matchedStream = trackInfo.streams.find(
        (s) => s.bitrate === change.newValue.stream.bitrate
      );

      this._log.info(
        `Streaming ${matchedStream.type} stream with bitrate ${matchedStream.bitrate}, ` +
          `track ${trackInfo.trackId}`
      );

      bitrateObservable.set(matchedStream, {
        jR: change.sn.jR,
        g$: undefined,
      });

      const cdn = this._session.di.filter((c) => c.id === change.sn.cdnid)[0];
      cdnObservable.set(cdn);
    };
  }

  // ---------------------------------------------------------------------------
  // Stubs (features not supported on the HLS path)
  // ---------------------------------------------------------------------------

  /**
   * @returns {Array} Always empty — HLS player does not expose DRM key IDs.
   */
  getKeyIds() {
    return [];
  }

  /**
   * @returns {Array} Always empty — chapter support not available via native HLS.
   */
  getChapters() {
    return [];
  }

  // ---------------------------------------------------------------------------
  // Native track synchronisation helpers
  // ---------------------------------------------------------------------------

  /**
   * Synchronize native text track visibility with the selected text track.
   * @param {Object} selectedTrack - The currently selected text track descriptor
   * @private
   */
  _syncNativeTextTrack(selectedTrack) {
    const textTracks = this._videoElement.textTracks;
    for (let i = 0; i < textTracks.length; i++) {
      const nativeTrack = textTracks[i];
      if (nativeTrack.label === selectedTrack.displayName && nativeTrack.mode !== 'showing') {
        nativeTrack.mode = 'showing';
      }
      if (nativeTrack.label !== selectedTrack.displayName && nativeTrack.mode === 'showing') {
        nativeTrack.mode = 'hidden';
      }
    }
  }

  /**
   * Synchronize native audio track enabled state with the selected audio track.
   * @param {Object} selectedTrack - The currently selected audio track descriptor
   * @private
   */
  _syncNativeAudioTrack(selectedTrack) {
    for (const nativeTrack of this._videoElement.audioTracks) {
      if (nativeTrack.label !== selectedTrack.displayName || nativeTrack.qcEnabled) {
        // Disable tracks that don't match the selection
        if (nativeTrack.label !== selectedTrack.displayName && nativeTrack.qcEnabled) {
          nativeTrack.qcEnabled = false;
        }
      } else {
        // Enable the matching track
        nativeTrack.qcEnabled = true;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Playback container (no-op for HLS)
  // ---------------------------------------------------------------------------

  /** @returns {void} */
  getPlaybackContainer() {}

  /** @returns {void} */
  livePlaybackManager() {}

  // ---------------------------------------------------------------------------
  // Time queries
  // ---------------------------------------------------------------------------

  /**
   * Get the current playback time in milliseconds (floored).
   * @returns {number}
   * @private
   */
  _getCurrentTimeMs() {
    return Math.floor(1000 * this._videoElement.currentTime);
  }

  /**
   * Get the current presentation time in milliseconds.
   * @returns {number}
   */
  getPresentationTime() {
    return this._getCurrentTimeMs();
  }

  /**
   * Get the current media time in milliseconds.
   * @returns {number}
   */
  getMediaTime() {
    return this._getCurrentTimeMs();
  }

  /**
   * Get the total duration in milliseconds (floored).
   * @returns {number}
   */
  getDuration() {
    return Math.floor(1000 * this._videoElement.duration);
  }

  /**
   * Get the movie/content ID from the current segment.
   * @returns {*}
   */
  getMovieId() {
    return this._currentSegment.R;
  }

  /**
   * Get the source transaction ID for this session.
   * @returns {string}
   */
  getSourceTransactionId() {
    return this._session.sourceTransactionId;
  }

  /**
   * Get the playback context ID from the manifest.
   * @returns {string|undefined}
   */
  getPlaybackContextId() {
    return this._session.manifestRef?.manifestContent?.playbackContextId;
  }

  // ---------------------------------------------------------------------------
  // Element access
  // ---------------------------------------------------------------------------

  /**
   * Get the underlying HTML video element.
   * @returns {HTMLVideoElement}
   */
  getConfiguration() {
    return this._videoElement;
  }

  // ---------------------------------------------------------------------------
  // Playback state queries
  // ---------------------------------------------------------------------------

  /**
   * Whether the player has finished loading (progress === 1).
   * @returns {boolean}
   */
  isReady() {
    return this.getUpdatingState() === null;
  }

  /**
   * Whether the media is currently playing (not paused).
   * @returns {boolean}
   */
  isCurrentlyPlaying() {
    return this._isPlaying.value;
  }

  /**
   * Whether the media is currently paused.
   * @returns {boolean}
   */
  isPaused() {
    return !this._isPlaying.value;
  }

  /**
   * Whether the media element has ended.
   * @returns {boolean}
   */
  isEnded() {
    return this._videoElement.ended;
  }

  /**
   * Get the current loading/buffering state, or null if fully loaded.
   * @returns {{ stalled: boolean, progress: number, progressRollback: boolean } | null}
   */
  getUpdatingState() {
    if (this._loadProgress.value !== 1) {
      return {
        stalled: this._isStalled.value,
        progress: this._loadProgress.value,
        progressRollback: false,
      };
    }
    return null;
  }

  /**
   * Get the last error, if any.
   * @returns {Object|null}
   */
  getError() {
    return this._lastError?.cia() ?? null;
  }

  /**
   * Get the end of the buffered range in milliseconds, or null.
   * @returns {number|null}
   */
  getBufferedEnd() {
    if (this._videoElement.buffered.length === 1) {
      return 1000 * this._videoElement.buffered.end(0);
    }
    return null;
  }

  /**
   * Get the native video dimensions.
   * @returns {{ width: number, height: number }}
   */
  getVideoSize() {
    return {
      width: this._videoElement.videoWidth,
      height: this._videoElement.videoHeight,
    };
  }

  // ---------------------------------------------------------------------------
  // Volume
  // ---------------------------------------------------------------------------

  /**
   * Whether the video element is muted.
   * @returns {boolean}
   */
  isMuted() {
    return this._videoElement.muted;
  }

  /**
   * Get the current volume (0..1).
   * @returns {number}
   */
  getVolume() {
    return this._videoElement.volume;
  }

  /**
   * Set the muted state.
   * @param {boolean} muted
   */
  setMuted(muted) {
    this._videoElement.muted = muted;
  }

  /**
   * Set the volume (0..1).
   * @param {number} volume
   */
  setVolume(volume) {
    this._videoElement.volume = volume;
  }

  // ---------------------------------------------------------------------------
  // Event dispatching
  // ---------------------------------------------------------------------------

  /**
   * Subscribe to a player event.
   * @param {string} event
   * @param {Function} handler
   * @param {*} [context]
   */
  addEventListener(event, handler, context) {
    this._eventEmitter.addListener(event, handler, context);
  }

  /**
   * Unsubscribe from a player event.
   * @param {string} event
   * @param {Function} handler
   */
  removeEventListener(event, handler) {
    this._eventEmitter.removeListener(event, handler);
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  /**
   * Begin loading the player (async component check + HLS support check).
   * @private
   */
  _load() {
    if (this._isLoaded) return;
    this._isLoaded = true;

    this._asyncLoader.internal_Nda((result) => {
      if (!this._supportsHls()) {
        this._close(this._createError(ErrorCode.HLS_NOT_SUPPORTED));
        return;
      }
      if (result.success) {
        this._fetchManifestAndInitialize();
      } else {
        this._close(
          this._createError(
            result.errorCode || ErrorCode.INIT_ASYNCCOMPONENT,
            result
          )
        );
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Close / teardown
  // ---------------------------------------------------------------------------

  /**
   * Close the player, tear down the video element, and notify listeners.
   * @param {Object} [error] - Optional player error that caused the close
   * @returns {Promise<void>}
   * @private
   */
  _close(error) {
    if (this._isClosed) return Promise.resolve();

    this._session.mediaTime.set(this._getCurrentTimeMs());
    this._syncStreamHandlers();
    this._session.V$ = this.getPresentationTime();
    this._isClosed = true;

    this._videoElement.removeAttribute('src');
    this._videoElement.loading();

    error?.vSb(!this._isAdActive.value);
    this._lastError = error;
    this._abortController.abort();

    if (error) {
      this._emitEvent(PlayerEvent.error, error.cia());
    }
    this._emitEvent(PlayerEvent.closed);

    return this._playgraphManager.zha(this._session);
  }

  // ---------------------------------------------------------------------------
  // Play / pause / seek
  // ---------------------------------------------------------------------------

  /**
   * Start or resume playback. Handles autoplay-blocked scenarios.
   */
  play() {
    const playPromise = this._videoElement.playing();
    this._playbackBlocked = false;

    if (playPromise) {
      playPromise
        .then(() => {
          this._emitOnce(PlayerEvent.xsb);
        })
        .catch((err) => {
          this._emitEvent(PlayerEvent.kZ);

          if (err.name === 'NotAllowedError') {
            this._log.RETRY('Playback is blocked by the browser settings', err);
            this._playbackBlocked = true;
            this._autoplayRequested = true;
            this._emitOnce(PlayerEvent.internal_Ioa, {
              player: {
                play: () => this.play(),
              },
            });
          }
        });
    }
  }

  /**
   * Emit an event with optional payload, attaching `this` as target.
   * @param {string} eventName
   * @param {Object} [data]
   * @param {boolean} [skipQueue]
   * @private
   */
  _emitEvent(eventName, data, skipQueue) {
    const payload = data || {};
    payload.target = this;
    this._eventEmitter.emit(eventName, payload, !skipQueue);
  }

  /**
   * Emit an event only once (subsequent calls with the same event are ignored).
   * @param {string} eventName
   * @param {Object} [data]
   * @private
   */
  _emitOnce(eventName, data) {
    if (this._firedOnceEvents.has(eventName)) return;
    this._firedOnceEvents.item(eventName);
    this._emitEvent(eventName, data, undefined);
  }

  /**
   * Pause playback.
   */
  pause() {
    this._videoElement.pause();
  }

  /**
   * Pause playback (alias used internally for ad-break transitions).
   */
  pauseForAdBreak() {
    this.pause();
  }

  /**
   * Seek to a position in milliseconds.
   * @param {number} positionMs
   */
  seek(positionMs) {
    this._videoElement.currentTime = positionMs / 1000;
  }

  /**
   * Force-close the player with an external error.
   * @param {*} detail - Additional error detail
   */
  forceCloseWithError(detail) {
    this._close(
      this._createError(ErrorCode.EXTERNAL, EventTypeEnum.UNKNOWN, detail)
    );
  }

  // ---------------------------------------------------------------------------
  // Playback rate
  // ---------------------------------------------------------------------------

  /**
   * Get the current playback rate.
   * @returns {number}
   */
  getPlaybackRate() {
    return this._session.playbackRate.value;
  }

  /**
   * Set the playback rate.
   * @param {number} rate
   */
  setPlaybackRate(rate) {
    this._session.playbackRate.set(rate);
  }

  // ---------------------------------------------------------------------------
  // Track listing & selection
  // ---------------------------------------------------------------------------

  /**
   * Get all available audio tracks in the exposed format.
   * @returns {Array<Object>}
   */
  getAudioTracks() {
    return this._session.supportedKeySystemList.map((t) =>
      this._mapTrackToExposedFormat(t)
    );
  }

  /**
   * Get audio tracks available for a specific mode/selection.
   * @param {*} selection
   * @returns {Array<Object>}
   */
  getAudioTracksForSelection(selection) {
    return this._getAudioTracksForMode(selection).map((t) =>
      this._mapTrackToExposedFormat(t)
    );
  }

  /**
   * Get the currently selected audio track in exposed format.
   * @returns {Object|undefined}
   */
  getCurrentAudioTrack() {
    const track = this._session.tracks.audioTrackSelection;
    return track && this._mapTrackToExposedFormat(track);
  }

  /**
   * Get the currently selected text track in exposed format.
   * @returns {Object|undefined}
   */
  getCurrentTextTrack() {
    const track = this._session.tracks.textTrackSelection;
    return track && this._mapTrackToExposedFormat(track);
  }

  /**
   * Set the active audio track by its exposed representation.
   * @param {Object} trackRef - Exposed track object
   * @returns {Promise<void>}
   */
  setAudioTrack(trackRef) {
    const track = this._findTrackByExposedRef(trackRef);
    if (track && track.isMissing) {
      this._session.tracks.setAudioTrack(track);
      return Promise.resolve();
    }
    this._log.error('Invalid setAudioTrack call');
    return Promise.reject(Error('Invalid setAudioTrack call'));
  }

  /**
   * Set the active text track by its exposed representation.
   * @param {Object} trackRef - Exposed track object
   * @returns {Promise<void>}
   */
  setTextTrack(trackRef) {
    const track = this._session.sk.find(
      (t) => this._mapTrackToExposedFormat(t) === trackRef
    );
    if (track && track.isMissing) {
      this._session.tracks.setTextTrack(track);
      this._session.isSeeking.set(track);
      return Promise.resolve();
    }
    this._log.error('Invalid setTextTrack call');
    return Promise.reject(Error('Invalid setTextTrack call'));
  }

  /**
   * Get the maximum selectable audio track index.
   * @returns {number}
   */
  getMaxAudioTrackIndex() {
    return this._computeMaxTrackIndex(
      this._session.supportedKeySystemList,
      this._session.manifestRef?.manifestContent?.wJb
    );
  }

  /**
   * Get the maximum selectable text track index for a given selection.
   * @param {*} selection
   * @returns {number}
   */
  getMaxTextTrackIndex(selection) {
    return this._computeMaxTrackIndex(
      this._getAudioTracksForMode(selection),
      this._session.manifestRef?.manifestContent?.xJb
    );
  }

  /**
   * Map an internal track descriptor to the public/exposed format.
   * Caches the result on the track object to avoid re-creating.
   * @param {Object} track
   * @returns {Object}
   * @private
   */
  _mapTrackToExposedFormat(track) {
    const exposed = (track.r3a = track.r3a || {
      trackId: track.trackId,
      bcp47: track.languageCode,
      displayName: track.displayName,
      trackType: track.language,
      rawTrackType: track.rawTrackType,
      channels: track.channels,
    });

    if (this._isAudioTrack(track)) {
      exposed.isNative = track.isNative;
      exposed.surroundFormatLabel = track.internal_Gha;
    }

    if (this._isTextTrack(track)) {
      exposed.isNoneTrack = track.dr();
      exposed.isForcedNarrative = track.checkMethod();
      exposed.isImageBased = track.isImageBased;
    }

    exposed.subType = track.EV;
    exposed.variant = track.variant;

    return exposed;
  }

  /**
   * Check whether a track is an audio track (has `isNative` property).
   * @param {Object} track
   * @returns {boolean}
   * @private
   */
  _isAudioTrack(track) {
    return typeof track.isNative !== 'undefined';
  }

  /**
   * Check whether a track is a text track (has `dr` and `checkMethod`).
   * @param {Object} track
   * @returns {boolean}
   * @private
   */
  _isTextTrack(track) {
    return typeof track.dr !== 'undefined' && typeof track.checkMethod !== 'undefined';
  }

  /**
   * Find an internal track by its exposed reference object.
   * @param {Object} exposedRef
   * @returns {Object|undefined}
   * @private
   */
  _findTrackByExposedRef(exposedRef) {
    return (
      exposedRef &&
      this._session.supportedKeySystemList.find(
        (t) => this._mapTrackToExposedFormat(t) === exposedRef
      )
    );
  }

  /**
   * Get the list of audio tracks associated with a given selection/mode.
   * @param {*} selection
   * @returns {Array<Object>}
   * @private
   */
  _getAudioTracksForMode(selection) {
    const track =
      this._findTrackByExposedRef(selection) ||
      this._session.tracks.audioTrackSelection;
    return track?.sk ?? [];
  }

  /**
   * Compute the maximum selectable track index given a rank threshold.
   * @param {Array<Object>} tracks
   * @param {number|undefined} rankThreshold
   * @returns {number}
   * @private
   */
  _computeMaxTrackIndex(tracks, rankThreshold) {
    const lastIndex = tracks.length - 1;
    if (typeof rankThreshold !== 'number') return lastIndex;

    const firstExceedingIndex = tracks.findIndex((t) => t.rank > rankThreshold);
    return firstExceedingIndex === -1 ? lastIndex : firstExceedingIndex - 1;
  }

  // ---------------------------------------------------------------------------
  // Session data
  // ---------------------------------------------------------------------------

  /**
   * Merge additional session data into the session context.
   * @param {Object} data
   */
  updateSessionData(data) {
    this._session.sessionContext = mergeSessionData(
      this._session.sessionContext,
      data
    );
  }

  /**
   * Get the playback segment by ID. Throws if the ID doesn't match.
   * @param {*} segmentId
   * @returns {Object}
   */
  getPlaybackSegment(segmentId) {
    if (segmentId !== this._session.M) {
      throw Error(`Unknown segmentId ${segmentId}`);
    }
    return this._session;
  }

  /**
   * Get the current session context.
   * @returns {Object}
   */
  getSessionContext() {
    return this._session.sessionContext;
  }

  // ---------------------------------------------------------------------------
  // No-op / stub methods (unsupported on HLS path)
  // ---------------------------------------------------------------------------

  /** No-op: not applicable to HLS player */
  enablePersistentLicense() {}

  /** No-op: not applicable to HLS player */
  updateSecurityLevel() {}

  /** No-op: not applicable to HLS player */
  notifyDisplayChange() {}

  /** No-op: not applicable to HLS player */
  initializeHandler() {}

  /**
   * Not supported on HLS path.
   * @returns {Promise<never>}
   */
  requestKeySystemAccess() {
    return Promise.reject();
  }

  /**
   * @returns {Object} Empty object (no custom diagnostics on HLS)
   */
  getDiagnostics() {
    return {};
  }

  /** No-op */
  resetDiagnostics() {}

  /**
   * @returns {Object} Empty object
   */
  getStreamingStats() {
    return {};
  }

  /** No-op */
  notifyVisibilityChange() {}

  /** No-op */
  dispose() {}

  /**
   * @returns {boolean} Always false — no picture-in-picture support on HLS path
   */
  supportsPictureInPicture() {
    return false;
  }

  /**
   * Returns a stub timed-text (subtitle) manager that does nothing.
   * @returns {Object}
   */
  getTimedTextManager() {
    return {
      addEventListener() {},
      removeEventListener() {},
      getGroups() {
        return [];
      },
      register() {},
      notifyUpdated() {},
      getModel() {},
      getTime() {
        return 0;
      },
    };
  }

  /**
   * No-op promise resolve for license operations.
   * @returns {Promise<{ success: boolean }>}
   */
  acquireLicense() {
    return Promise.resolve({ success: true });
  }

  /** No-op */
  updateKeyStatus() {}

  /** No-op */
  getSubtitleConfiguration() {}

  /** No-op */
  setTimedTextConfig() {}

  /** No-op */
  clearTimedTextState() {}

  /** No-op */
  resetSegmentIndex() {}

  /**
   * Not supported.
   * @returns {Promise<never>}
   */
  switchCdnForSegment() {
    return Promise.reject();
  }

  /**
   * Not supported.
   * @returns {Promise<never>}
   */
  retryPlaying() {
    return Promise.reject();
  }

  /**
   * Not supported.
   * @returns {Promise<never>}
   */
  retryWithFallback() {
    return Promise.reject();
  }

  /**
   * Not supported.
   * @returns {Promise<never>}
   */
  applyConfig() {
    return Promise.reject();
  }

  /** No-op */
  clearSourceBuffer() {}
}

export { HlsVideoPlayer };
export default HlsVideoPlayer;
