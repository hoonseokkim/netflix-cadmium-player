/**
 * Netflix Cadmium Player - Video Player Session
 *
 * The main player session wrapper that bridges the internal player state
 * machine with the external UI API. Each VideoPlayerSession corresponds
 * to one viewable (movie/episode/ad) being played. It exposes a clean
 * API for the UI to:
 *
 * - Query playback state (progress, buffering, current time, duration)
 * - Control playback (play, pause, seek, set audio/text tracks)
 * - Manage volume and mute state
 * - Access live playback features
 * - Subscribe to state change events
 * - Report engagement and capture session summaries
 *
 * Internally it delegates to the PlayerState object and relays events
 * through a next-state event bus for the player controller to handle.
 *
 * @module VideoPlayerSession
 * @original Module_41893
 */

// import { FatalErrorCode, ErrorSubCode } from '../core/ErrorCodeEnums';
// import { PlayerState, PlayerEvents, PresentingState, StreamState, cb as PlayerCallbacks } from '../types/PlayerEnums';
// import { MILLISECONDS } from '../timing/TimeUnit';
// import { document, performance } from '../utils/PlatformGlobals';
// import { ApiEndpoint } from '../network/ApiEndpoint';
// import { formatInteger } from '../utils/Formatters';
// import { MediaType } from '../types/MediaType';
// import { assert } from '../assert/Assert';

/**
 * Represents a single video playback session.
 */
export class VideoPlayerSession {
    /**
     * @param {Object} stringifier - String/error formatting utilities
     * @param {Object} urlValidator - URL validation service
     * @param {Function} createLogger - Logger factory
     * @param {Object} nextStateEmitter - Event bus for state change notifications
     * @param {Object} engagePayloadFactory - Creates engagement payloads
     * @param {Function} getApiEndpoint - Returns API endpoint for a given type
     * @param {Function} screenshotService - Screenshot generation service
     * @param {Object} config - Player configuration
     * @param {Object} viewableConfig - Viewable-specific configuration helpers
     * @param {Object} playerStateFactory - Factory to create PlayerState instances
     * @param {Object} segment - Initial segment information
     * @param {*} drmConfig - DRM configuration
     * @param {*} additionalConfig - Additional configuration
     */
    constructor(
        stringifier,
        urlValidator,
        createLogger,
        nextStateEmitter,
        engagePayloadFactory,
        getApiEndpoint,
        screenshotService,
        config,
        viewableConfig,
        playerStateFactory,
        segment,
        drmConfig,
        additionalConfig
    ) {
        /** @private */
        this.stringifier = stringifier;
        /** @private */
        this.urlValidator = urlValidator;
        /** @private */
        this.nextStateEmitter = nextStateEmitter;
        /** @private */
        this.engagePayloadFactory = engagePayloadFactory;
        /** @private */
        this.getApiEndpoint = getApiEndpoint;
        /** @private */
        this.screenshotService = screenshotService;
        /** @private */
        this.config = config;
        /** @private */
        this.viewableConfig = viewableConfig;
        /** @private */
        this.segment = segment;

        /** @private */
        this.playerState = playerStateFactory.create(
            segment.movieId,
            segment.timeOffset,
            drmConfig,
            additionalConfig,
            segment.manifestSessionData,
            segment.id,
            segment.manifestRef
        );
        this.playerState.background.set(true);

        /** @private */
        this.log = createLogger("VideoPlayer", this.playerState);
        /** @private */
        this.pendingExternalTracks = [];
        /** @private */
        this.timecodes = [];
        /** @private */
        this.ended = false;
        /** @private */
        this.pendingTrackHydration = undefined;

        this.#setupEventListeners();

        this.playerState.state.addListener((change) => {
            if (change.newValue === PlayerState.NORMAL) {
                this.#emitEvent(PlayerCallbacks.SESSION_LOADED, { movieId: segment.movieId });
            }
        });

        if (this.playerState.sessionContext.isSeeking) {
            this.branchController = this.#createBranchController();
            this.playerState.addEventListener(PlayerEvents.POSITION_CHANGED, (event) => {
                const segmentId = event.position.segmentId;
                if (this.lastReportedSegmentId !== segmentId) {
                    this.lastReportedSegmentId = segmentId;
                    this.#emitEvent(PlayerCallbacks.SEGMENT_CHANGED, { segmentId });
                }
            });
        }
    }

    // --- Query methods ---

    /** @returns {boolean} Whether the session has reached NORMAL state */
    isReady() {
        return this.playerState.state.value === PlayerState.NORMAL;
    }

    /** @returns {number} The movie/viewable ID */
    getMovieId() {
        return this.playerState.movieId;
    }

    /** @returns {string} The source transaction ID */
    getTransactionId() {
        return this.playerState.sourceTransactionId;
    }

    /** @returns {string|undefined} The playback context ID from the manifest */
    getPlaybackContextId() {
        return this.playerState.manifestRef?.manifestContent?.playbackContextId;
    }

    /** @returns {HTMLElement} The container element */
    getContainerElement() {
        return this.playerState.containerElement;
    }

    /** @returns {boolean} Whether video is currently presenting */
    isPlaying() {
        return this.playerState.isPlaying.value;
    }

    /** @returns {boolean} Whether playback is paused */
    isPaused() {
        return this.playerState.paused.value;
    }

    /** @returns {boolean} Whether playback has ended */
    isEnded() {
        return this.ended;
    }

    /**
     * Returns buffering/loading progress information.
     * @returns {{ networkStalled: boolean, stalled: boolean, progress: number, progressRollback: boolean }|null}
     */
    getBufferingState() {
        const value = this.playerState.currentRequestedTime.value;
        if (!value) return null;
        return {
            networkStalled: !!value.endedEvent,
            stalled: !!value.endedEvent,
            progress: value.progress,
            progressRollback: !!value.progressRollback,
        };
    }

    /** @returns {Object|null} The last error, formatted for external consumption */
    getError() {
        const error = this.playerState.lastError;
        return error ? error.toErrorInfo() : null;
    }

    /** @returns {HTMLVideoElement|undefined} The video element, if available */
    getVideoElement() {
        return this.playerState.getPlaybackContainer()?.videoElement;
    }

    /** @returns {Object} The live playback controller */
    getLiveController() {
        return this.playerState.liveController;
    }

    /**
     * Returns the current playback time (UI-adjusted for live, raw for VOD).
     * @returns {number|null}
     */
    getCurrentTime() {
        const live = this.getLiveController();
        return live.isLive
            ? live.getUIAdjustedCurrentContentPts() ?? null
            : this.getRawCurrentTime();
    }

    /** @returns {number} Raw media time in milliseconds */
    getRawCurrentTime() {
        return this.playerState.mediaTime.value;
    }

    /**
     * Returns the furthest buffered time.
     * @returns {number}
     */
    getBufferedEnd() {
        const currentTime = (this.getStartTime() || 0) + this.playerState.getBufferedTime();
        return Math.min(currentTime, this.getDuration());
    }

    /** @returns {number|null} The start time of the current position */
    getStartTime() {
        const live = this.getLiveController();
        return live.isLive
            ? live.getUIAdjustedCurrentContentPts() ?? null
            : this.playerState.getBaseMediaTime();
    }

    /** @returns {number} Total duration in milliseconds */
    getDuration() {
        const live = this.getLiveController();
        return live.isLive
            ? live.getLiveContentDuration()
            : this.playerState.segmentTimestamp.toUnit(MILLISECONDS);
    }

    /** @returns {{ width: number, height: number }|null} Container dimensions */
    getContainerDimensions() {
        const dims = this.playerState.containerDimensions.value;
        return dims ? { width: dims.width, height: dims.height } : null;
    }

    /** @returns {boolean} Whether the session is in background mode */
    isBackground() {
        return this.playerState.background.value;
    }

    /** @returns {boolean} Whether audio is muted */
    isMuted() {
        return this.playerState.muted.value;
    }

    /** @returns {number} Current volume (0-1) */
    getVolume() {
        return this.playerState.volume.value;
    }

    /** @returns {number} Current playback rate */
    getPlaybackRate() {
        return this.playerState.playbackRate.value;
    }

    // --- Control methods ---

    /**
     * Sets the muted state.
     * @param {boolean} muted
     */
    setMuted(muted) {
        this.playerState.muted.set(!!muted);
    }

    /**
     * Sets the volume level (clamped to 0-1).
     * @param {number} volume
     */
    setVolume(volume) {
        this.playerState.volume.set(this.#clampVolume(volume));
    }

    /**
     * Sets the playback rate.
     * @param {number} rate
     */
    setPlaybackRate(rate) {
        this.playerState.playbackRate.set(rate);
    }

    /** Starts or resumes playback. */
    play() {
        this.playerState.recordPlayDelay("uiCalledPlay");
        if (this.playerState.logBlobEvent) {
            this.playerState.fireEvent(PlayerEvents.LOG_BLOB_PLAY);
        } else {
            this.load();
            if (this.playerState.paused.value) {
                this.playerState.paused.set(false);
                this.playerState.fireEvent(PlayerEvents.PLAY);
            }
        }
    }

    /** Pauses playback. */
    pause() {
        this.load();
        if (!this.playerState.paused.value) {
            this.playerState.paused.set(true);
            this.playerState.fireEvent(PlayerEvents.PAUSE);
        }
    }

    /**
     * Seeks to a given position in milliseconds.
     * @param {number} timeMs - Target time in milliseconds
     * @param {string} [seekType] - Type of seek operation
     * @param {*} [param3] - Additional seek parameter
     * @param {*} [param4] - Additional seek parameter
     */
    seek(timeMs, seekType, param3, param4) {
        seekType = seekType ?? StreamState.SEEK;
        if (!this.playerState.canSeek()) return;

        const live = this.getLiveController();
        if (
            live.isLive &&
            live.isWithinUILiveEdgeThreshold(live.revertUIAdjustedTime(timeMs)) &&
            !live.isLiveEventEnded(true)
        ) {
            live.seekToLiveEdge();
        } else if (this.playerState.mediaSourceManager) {
            if (live.isLive) {
                timeMs = live.revertUIAdjustedTime(timeMs);
            }
            this.playerState.mediaSourceManager.seek(timeMs, seekType, param3, param4);
        } else {
            if (live.isLive) {
                timeMs = live.getLiveBookmark(timeMs).hashQuery;
            }
            this.playerState.seekTarget = timeMs;
        }
    }

    /**
     * Sets the background state of this session.
     * @param {boolean} isBackground
     */
    setBackground(isBackground) {
        this.playerState.background.set(isBackground);
    }

    /**
     * Loads the session (triggers manifest fetch, DRM init, etc.).
     */
    load() {
        if (this.loaded) return;
        this.loaded = true;
        this.playerState.load((state, callback) => {
            try {
                this.#emitEvent(PlayerCallbacks.SESSION_INITIALIZED, undefined, true);
                if (state.manifestRef) {
                    const manifest = state.manifestRef.manifestContent;
                    if (manifest.watermarkInfo) {
                        this.#emitEvent(PlayerCallbacks.WATERMARK_INFO, manifest.watermarkInfo, true);
                    }
                    if (manifest.choiceMap) {
                        this.#emitEvent(PlayerCallbacks.CHOICE_MAP, { segmentMap: manifest.choiceMap }, true);
                    }
                    if (manifest.timecodeAnnotations) {
                        this.timecodes = manifest.timecodeAnnotations;
                        this.#emitEvent(PlayerCallbacks.TIMECODES, { timecodes: this.timecodes }, true);
                    }
                }
                callback({ success: true });
            } catch (err) {
                callback({
                    errorSubCode: ErrorSubCode.EXCEPTION,
                    configFlag: this.stringifier.stringify(err),
                });
            }
        });
    }

    /**
     * Closes the session, optionally with an error.
     * @param {Object} [error] - Error to close with
     * @returns {Promise<void>}
     */
    close(error) {
        if (!this.closePromise) {
            this.closePromise = new Promise((resolve) => {
                if (error) {
                    this.playerState.closeWithError(error, resolve);
                } else {
                    this.playerState.close(resolve);
                }
            });
        }
        return this.closePromise;
    }

    // --- Event subscription ---

    /**
     * @param {string} eventName
     * @param {Function} handler
     * @param {*} [context]
     */
    addEventListener(eventName, handler, context) {
        this.nextStateEmitter.addListener(eventName, handler, context);
    }

    /**
     * @param {string} eventName
     * @param {Function} handler
     */
    removeEventListener(eventName, handler) {
        this.nextStateEmitter.removeListener(eventName, handler);
    }

    // --- Private helpers ---

    /**
     * Clamps a volume value to [0, 1].
     * @private
     */
    #clampVolume(value) {
        return value < 0 ? 0 : value > 1 ? 1 : value;
    }

    /**
     * Emits an event through the next-state event bus.
     * @private
     */
    #emitEvent(eventName, data, sync) {
        data = data || {};
        data.target = this;
        this.nextStateEmitter.emit(eventName, data, !sync);
    }

    /**
     * Sets up all internal event listeners to relay state changes.
     * @private
     */
    #setupEventListeners() {
        this.playerState.addEventListener(PlayerEvents.CURRENT_TIME_CHANGED, () => {
            this.#emitEvent(PlayerCallbacks.CURRENT_TIME_CHANGED);
        });

        this.playerState.containerDimensions.addListener(() => {
            this.#emitEvent(PlayerCallbacks.CONTAINER_DIMENSIONS_CHANGED);
        });

        this.playerState.addEventListener(PlayerEvents.SEEKING, () => {
            this.#emitEvent(PlayerCallbacks.SEEKING);
        });

        this.playerState.addEventListener(PlayerEvents.SEEKED, () => {
            this.#emitEvent(PlayerCallbacks.DURATION_CHANGED);
        });

        this.playerState.addEventListener(PlayerEvents.POSITION_CHANGED, () => {
            this.#emitEvent(PlayerCallbacks.DURATION_CHANGED);
        });

        this.playerState.addEventListener(PlayerEvents.STOP_PLAYBACK, (errorCode) => {
            this.#emitEvent(PlayerCallbacks.STOP_PLAYBACK, { errorCode });
        });

        this.playerState.isPlaying.addListener(() => {
            this.#emitEvent(PlayerCallbacks.PLAYING_CHANGED);
        });

        this.playerState.paused.addListener(() => {
            this.#emitEvent(PlayerCallbacks.PAUSED_CHANGED);
        });

        this.playerState.muted.addListener(() => {
            this.#emitEvent(PlayerCallbacks.MUTED_CHANGED);
        });

        this.playerState.volume.addListener(() => {
            this.#emitEvent(PlayerCallbacks.VOLUME_CHANGED);
        });

        this.playerState.presentingState.addListener(() => {
            this.#updateEndedState();
        });

        this.playerState.state.addListener(() => {
            this.#updateEndedState();
        });

        this.playerState.currentRequestedTime.addListener((change) => {
            if (
                !this.hasEmittedLoaded &&
                this.playerState.state.value === PlayerState.NORMAL &&
                !change.newValue
            ) {
                this.hasEmittedLoaded = true;
                this.#emitEvent(PlayerCallbacks.LOADED);
            }
            this.#emitEvent(PlayerCallbacks.BUFFERING_STATE_CHANGED);
        });

        this.playerState.tracks.addListener([MediaType.VIDEO, MediaType.TEXT], (change) => {
            if (change.audioChanged) {
                this.#emitEvent(PlayerCallbacks.AUDIO_TRACK_CHANGED);
                this.#emitEvent(PlayerCallbacks.AUDIO_CHANGED);
            }
            if (change.textChanged) {
                this.#emitEvent(PlayerCallbacks.TEXT_TRACK_CHANGED);
            }
        });

        this.playerState.state.addListener((change) => {
            switch (change.newValue) {
                case PlayerState.NORMAL:
                    this.#emitEvent(PlayerCallbacks.READY);
                    this.#emitEvent(PlayerCallbacks.CONTAINER_DIMENSIONS_CHANGED);
                    this.#emitEvent(PlayerCallbacks.STREAMS_CHANGED);
                    this.#emitEvent(PlayerCallbacks.AUDIO_CHANGED);
                    this.#emitEvent(PlayerCallbacks.VOLUME_INITIALIZED);
                    this.#processExternalTrackQueue();
                    this.#setupSubtitleListeners();
                    break;
                case PlayerState.CLOSING:
                    if (this.playerState.lastError) {
                        this.#emitEvent(PlayerCallbacks.ERROR, this.playerState.lastError);
                    }
                    break;
                case PlayerState.CLOSED:
                    this.#emitEvent(PlayerCallbacks.CLOSED);
                    this.nextStateEmitter.cleanup();
                    break;
            }
        });

        this.playerState.addEventListener(PlayerEvents.LIVE_EVENT_TIMES_CHANGED, () => {
            this.#emitEvent(PlayerCallbacks.LIVE_EVENT_TIMES_CHANGED);
            this.#emitEvent(PlayerCallbacks.CURRENT_TIME_CHANGED);
            this.#emitEvent(PlayerCallbacks.DURATION_CHANGED);
            this.#emitEvent(PlayerCallbacks.READY);
        });
    }

    /**
     * Updates the ended state based on player and presenting state.
     * @private
     */
    #updateEndedState() {
        const wasEnded = this.ended;
        const isNowEnded =
            this.playerState.state.value === PlayerState.NORMAL &&
            this.playerState.presentingState.value === PresentingState.ENDED;

        let isTransitioning = false;
        if (isNowEnded && this.playerState.streamingSession) {
            isTransitioning = this.playerState.streamingSession.isTransitioning?.() ?? false;
        }

        if (wasEnded !== isNowEnded && !isTransitioning) {
            this.ended = isNowEnded;
            this.playerState.debugLog("Ended changed: " + isNowEnded);
            if (isNowEnded || this.playerState.state.value === PlayerState.CLOSING) {
                this.#emitEvent(PlayerCallbacks.ENDED);
            }
        }
    }

    /**
     * Processes any queued external subtitle track additions.
     * @private
     */
    #processExternalTrackQueue() {
        if (this.playerState.state.value !== PlayerState.NORMAL) return;

        let defaultTrack;
        while (this.pendingExternalTracks.length > 0) {
            const entry = this.pendingExternalTracks.shift();
            const track = this.playerState.subtitlePlayer.addExternalTrack(
                entry.url,
                entry.name,
                entry.options
            );
            if (entry.isDefault) {
                defaultTrack = track;
            }
        }
        if (defaultTrack) {
            this.playerState.tracks.setTextTrack(defaultTrack);
        }
    }

    /**
     * Sets up subtitle and ad event listeners after the session is ready.
     * @private
     */
    #setupSubtitleListeners() {
        this.playerState.subtitlePlayer.addEventListener("showsubtitle", (event) => {
            this.#emitEvent(PlayerCallbacks.SHOW_SUBTITLE, event, true);
        });

        this.playerState.subtitlePlayer.addEventListener("removesubtitle", (event) => {
            this.#emitEvent(PlayerCallbacks.REMOVE_SUBTITLE, event, true);
        });

        const container = this.playerState.getPlaybackContainer();
        container.onAdPresenting.addListener((change) => {
            if (container.supportsAdPresenting) {
                this.#emitEvent(PlayerCallbacks.AD_PRESENTING, {
                    state: change.newValue ? "start" : "stop",
                });
            }
        });

        const streamingSession = this.playerState.streamingSession;
        const aseContainer = streamingSession?.getPlaybackContainer();
        aseContainer?.events?.addListener("adPlaygraphUpdated", () => {
            this.#emitEvent(PlayerCallbacks.AD_METADATA_UPDATED);
        });

        streamingSession?.addEventListener("adMetadataUpdated", () => {
            this.#emitEvent(PlayerCallbacks.AD_METADATA_UPDATED);
        });
    }

    /**
     * Creates a branch controller if the session supports seeking/branching.
     * @private
     */
    #createBranchController() {
        // Implemented by external module injection
        return null;
    }
}

export default VideoPlayerSession;
