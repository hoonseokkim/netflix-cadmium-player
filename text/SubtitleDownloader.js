/**
 * Netflix Cadmium Player - SubtitleDownloader (TimedTextManager)
 *
 * Central manager for timed text (subtitle/caption) tracks. Handles activation,
 * deactivation, buffering state, retry logic, image-based and text-based subtitle
 * rendering coordination, and subtitle QoE (Quality of Experience) tracking.
 *
 * @module SubtitleDownloader
 * @see Module_73585
 */

import { WP as TrackState } from "./TrackState";                    // Module 26159
import { internal_Hmb as TextTrackPoller } from "./TextTrackPoller"; // Module 7953
import { jl as EventEmitterImpl } from "./EventEmitter";             // Module 94886
import { config as playerConfig } from "./PlayerConfig";             // Module 29204
import { fetchOperation as getLogger } from "./LoggerFactory";       // Module 31276
import { gmb as SubtitleTracker } from "./SubtitleTracker";          // Module 69899
import { ea as ErrorCodes, eG as extractError } from "./ErrorCodes"; // Module 36129
import { scheduleAsync } from "./AsyncScheduler";                    // Module 32219
import { gd as isValidTime, isArray } from "./TypeUtils";            // Module 32687
import {
    zh as TextBufferingState,
    setState as PresentingState,
    pacingTargetBufferStrategy as PlaybackState,
    PlayerEvents
} from "./PlayerEnums";                                              // Module 85001
import { SideloadedTextTrack as SideloadedTextTrack } from "./SideloadedTextTrack"; // Module 35781
import { MediaType } from "./MediaTypes";                            // Module 26388

// ─── Track loading state to caption status mapping ──────────────────────────────

/**
 * Maps track loading states to caption display statuses.
 * LOADING -> { loading: true }, LOAD_FAILED -> { error: true }
 * @type {Object<string, Object>}
 */
const TRACK_STATE_TO_CAPTION_STATUS = {
    [TrackState.cs.LOADING]: { loading: true },
    [TrackState.cs.LOAD_FAILED]: { error: true },
};

// ─── Event names ────────────────────────────────────────────────────────────────

/** @type {string} Event fired when an image subtitle block should be shown */
const SHOW_SUBTITLE_EVENT = "showsubtitle";

/** @type {string} Event fired when an image subtitle block should be removed */
const REMOVE_SUBTITLE_EVENT = "removesubtitle";

// ─── TimedTextManager ───────────────────────────────────────────────────────────

/**
 * Manages the lifecycle of timed text (subtitle/caption) tracks, including
 * track selection changes, activation/deactivation of text and image-based
 * subtitles, buffering state management, retry logic on failure, and QoE tracking.
 */
class TimedTextManager {
    /**
     * @param {Object} playerState - The player state container.
     * @param {Object} sizeProvider - Provides subtitle sizing/layout information.
     */
    constructor(playerState, sizeProvider) {
        /** @type {Object} */
        this.playerState = playerState;

        /** @type {Object} */
        this.sizeProvider = sizeProvider;

        /** @type {number} Total number of timing drift samples collected */
        this._driftSampleCount = 0;

        /** @type {number} Cumulative timing drift sum (ms) */
        this._cumulativeDrift = 0;

        /** @type {boolean} Whether the manager has been destroyed */
        this._isDestroyed = false;

        /** @type {boolean} Whether first video frame has rendered */
        this._firstRenderOccurred = false;

        /** @type {number} Current retry count for failed track activations */
        this._retryCount = 0;

        /** @type {Set} Set of currently displayed image subtitle blocks */
        this._activeImageBlocks = new Set();

        /** @type {boolean} Whether subtitle display is enabled (visible) */
        this._isVisible = true;

        /** @type {number|undefined} Average drift metric (ms), rounded up */
        this.averageDrift = undefined;

        /** @type {Object|undefined} Currently active text track */
        this._activeTrack = undefined;

        /** @type {Object|undefined} Image subtitle renderer (playlist check) */
        this._imageSubRenderer = undefined;

        /** @type {number|undefined} Retry timeout handle */
        this._retryTimeoutHandle = undefined;

        // ── Event emitter for subtitle events ───────────────────────────────

        /** @type {EventEmitterImpl} */
        this._eventEmitter = new EventEmitterImpl();

        // ── Subtitle QoE tracker ────────────────────────────────────────────

        /** @type {SubtitleTracker} */
        this._subtitleTracker = new SubtitleTracker(
            getLogger(playerState, "SubtitleTracker"),
            playerConfig.erc
        );

        // ── Logger ──────────────────────────────────────────────────────────

        /** @type {Object} */
        this.log = getLogger(playerState, "TimedTextManager");

        // ── Text track poller (polls for current cue changes) ───────────────

        /** @type {TextTrackPoller} */
        this._textTrackPoller = new TextTrackPoller(
            this._getCurrentPts.bind(this),
            this._updateCaptionSettings.bind(this)
        );

        // ── Wire up listeners ───────────────────────────────────────────────

        this.playerState.tracks.addListener(
            [MediaType.TEXT_MEDIA_TYPE],
            this._onTextTrackSelectionChanged
        );

        if (playerConfig.preBufferTimedText) {
            this.playerState.addEventListener(
                PlayerEvents.firstRenderOccurred,
                this._onFirstRenderOccurred
            );
            this._onTextTrackSelectionChanged();
        } else {
            this.playerState.textBufferingState.set(TextBufferingState.NORMAL);
            this.playerState.addEventListener(
                PlayerEvents.firstRenderOccurred,
                () => {
                    this._firstRenderOccurred = true;
                    this._onTextTrackSelectionChanged();
                }
            );
        }

        this.playerState.presentingState.addListener(this._onPresentingStateChanged);
        this.playerState.addEventListener(PlayerEvents.l7a, this._onSyncRequested);
        this.playerState.captionSettings.addListener(this._onCaptionSettingsChanged);
        this.playerState.addEventListener(PlayerEvents.clearTimeoutFn, this._onDestroy);
    }

    // ── Bound callbacks (arrow-like closures) ───────────────────────────────

    /**
     * Handles text track selection changes. Deactivates the old track and
     * activates the newly selected one, managing buffering state accordingly.
     * @private
     */
    _onTextTrackSelectionChanged = () => {
        this._cancelRetryTimer();

        if (this._activeTrack) {
            this.log.info("Deactivating", this._activeTrack);
            this._subtitleTracker.anc(this._getCurrentPts());
        }

        this.playerState.isSeeking.set(null);
        this._textTrackPoller.sSb(undefined);
        this._deactivateCurrentTrack();

        let selectedTrack = this.playerState.tracks.textTrackSelection;
        if (selectedTrack && selectedTrack.dr() && !selectedTrack.checkMethod()) {
            selectedTrack = null;
        }

        if (selectedTrack && this.playerState.presentingState.value !== PresentingState.WAITING) {
            const currentPts = this._getCurrentPts();
            this._subtitleTracker.dac(currentPts, selectedTrack);
        }

        if (selectedTrack) {
            this.log.info("Activating", selectedTrack);
            this.playerState.textBufferingState.set(
                selectedTrack.getState() === TrackState.cs.LOADED
                    ? TextBufferingState.NORMAL
                    : TextBufferingState.BUFFERING
            );

            if (!this._firstRenderOccurred) {
                this.playerState.recordPlayDelay("tt_start");
            }

            selectedTrack
                .internal_Hta(this.sizeProvider)
                .then(this._onTrackActivationResult)
                .catch(this._onTrackActivationResult);
        } else {
            this.playerState.textBufferingState.set(TextBufferingState.NORMAL);
        }

        this._activeTrack = selectedTrack;
        this._updateCaptionSettings();

        if (this.playerState.liveController.isLive) {
            this.playerState.textBufferingState.set(TextBufferingState.NORMAL);
        }
    };

    /**
     * Sync event handler - starts the text track poller if first render occurred.
     * @private
     */
    _onSyncRequested = () => {
        if (this._firstRenderOccurred) {
            this._textTrackPoller.start();
            if (this.playerState.presentingState.value !== PresentingState.PLAYING) {
                this._textTrackPoller.aseTimer();
            }
        }
    };

    /**
     * Updates the current caption settings based on track state and poller output.
     * @private
     */
    _updateCaptionSettings = () => {
        let captionStatus;

        if (
            this._isVisible &&
            this.playerState.state.value === PlaybackState.NORMAL &&
            this.playerState.presentingState.value !== PresentingState.WAITING
        ) {
            if (this._imageSubRenderer) {
                captionStatus = this._textTrackPoller.internal_Tuc();
            } else if (this.playerState.tracks.textTrackSelection) {
                captionStatus =
                    TRACK_STATE_TO_CAPTION_STATUS[
                        this.playerState.tracks.textTrackSelection.getState()
                    ];
            }
        }

        if (captionStatus && isValidTime(captionStatus.startTime)) {
            const currentCaptionSettings = this.playerState.captionSettings.value;
            if (currentCaptionSettings !== captionStatus) {
                this._driftSampleCount++;
                this._cumulativeDrift +=
                    this._textTrackPoller.CCb() - captionStatus.startTime;
                this.averageDrift = Math.ceil(
                    this._cumulativeDrift / (this._driftSampleCount + 0)
                );
            }
        }

        this.playerState.captionSettings.set(captionStatus);
    };

    /**
     * Computes the current presentation timestamp, accounting for image sub offsets.
     * @private
     * @returns {number} Current PTS value.
     */
    _getCurrentPts = () => {
        let pts = this.playerState.mWa();
        if (this._activeTrack && this._activeTrack.iB) {
            pts += this._activeTrack.iB;
        }
        return pts;
    };

    /**
     * Called when an image subtitle block should be shown.
     * @private
     * @param {Object} block - The subtitle image block.
     */
    _onShowImageSubtitle = (block) => {
        this._activeImageBlocks.add(block);
        if (this._isVisible) {
            this._fireEvent(SHOW_SUBTITLE_EVENT, block);
            if (block && block.id) {
                this._subtitleTracker.PWb(block.id);
            }
        }
        this.log.pauseTrace("showsubtitle", this._buildSubtitleLogInfo(block));
    };

    /**
     * Called when an image subtitle block should be removed.
     * @private
     * @param {Object} block - The subtitle image block.
     */
    _onRemoveImageSubtitle = (block) => {
        if (this._activeImageBlocks.delete(block) && this._isVisible) {
            this._fireEvent(REMOVE_SUBTITLE_EVENT, block);
            this.log.pauseTrace("removesubtitle", this._buildSubtitleLogInfo(block));
        }
    };

    /**
     * Hides all currently visible image subtitle blocks.
     * @private
     */
    _hideAllImageSubtitles = () => {
        this._activeImageBlocks.forEach((block) => {
            this._fireEvent(REMOVE_SUBTITLE_EVENT, block);
            this.log.pauseTrace("hide subtitle", this._buildSubtitleLogInfo(block));
        });
    };

    /**
     * Re-shows all currently tracked image subtitle blocks.
     * @private
     */
    _showAllImageSubtitles = () => {
        this._activeImageBlocks.forEach((block) => {
            this._fireEvent(SHOW_SUBTITLE_EVENT, block);
            this.log.pauseTrace("resume subtitle", this._buildSubtitleLogInfo(block));
        });
    };

    /**
     * Handles image subtitle buffer underflow.
     * @private
     */
    _onImageSubtitleUnderflow = () => {
        this.log.RETRY(
            "imagesubs buffer underflow",
            this.playerState.tracks.textTrackSelection.playbackInfo
        );
        this.playerState.textBufferingState.set(TextBufferingState.BUFFERING);
    };

    /**
     * Handles image subtitle buffering complete.
     * @private
     */
    _onImageSubtitleBufferingComplete = () => {
        this.log.info(
            "imagesubs buffering complete",
            this.playerState.tracks.textTrackSelection.playbackInfo
        );
        this.playerState.textBufferingState.set(TextBufferingState.NORMAL);
    };

    /**
     * Notifies the image sub renderer of the current playback time.
     * @private
     */
    _onCurrentTimeChanged = () => {
        if (this._firstRenderOccurred && this._imageSubRenderer) {
            this._imageSubRenderer.detected(this._getCurrentPts());
        }
    };

    /**
     * Handles period transition for image subtitles.
     * @private
     * @param {Object} event - Event containing encryption metadata.
     */
    _onPeriodTransition = (event) => {
        if (this._firstRenderOccurred && this._imageSubRenderer) {
            this._imageSubRenderer.pause();
            this._imageSubRenderer.openOutput(event.encryptionMetadata);
        }
    };

    /**
     * Handles segment presenting for image subtitles.
     * @private
     */
    _onSegmentPresenting = () => {
        if (this._firstRenderOccurred && this._imageSubRenderer) {
            this._imageSubRenderer.SOb();
        }
    };

    /**
     * Handles listener info events for image subtitles.
     * @private
     * @param {Object} event - Contains listenerInfo and s2 data.
     */
    _onListenerInfoEvent = (event) => {
        if (this._imageSubRenderer) {
            this._imageSubRenderer.notifyEvent(event.listenerInfo, event.s2);
        }
    };

    /**
     * Handles config update events for image subtitles.
     * @private
     * @param {Object} event - Contains M and RWb config data.
     */
    _onConfigUpdate = (event) => {
        if (this._imageSubRenderer) {
            this._imageSubRenderer.applyConfig(event.M, event.RWb);
        }
    };

    /**
     * Handles first video render event when pre-buffering is enabled.
     * @private
     */
    _onFirstRenderOccurred = () => {
        this._firstRenderOccurred = true;
        scheduleAsync(() => {
            if (this._activeTrack?.isImageBased) {
                this._imageSubRenderer?.detected(this._getCurrentPts());
            } else {
                this._onSyncRequested();
            }
            this._updateCaptionSettings();
        });
    };

    /**
     * Destroys the manager, cleaning up all state and listeners.
     * @private
     */
    _onDestroy = () => {
        this._deactivateCurrentTrack();
        this._textTrackPoller.aseTimer();
        this._updateCaptionSettings();
        this._isDestroyed = true;
        this._cancelRetryTimer();
    };

    /**
     * Handles changes to the externally-rendered caption settings value.
     * @private
     * @param {Object} event - The change event with newValue.
     */
    _onCaptionSettingsChanged = (event) => {
        const newValue = event.newValue;
        if (newValue && isArray(newValue.blocks)) {
            this._subtitleTracker.PWb(
                ...newValue.blocks.map((block) => block.id)
            );
        }
    };

    /**
     * Handles presenting state transitions (playing, paused, waiting, ended).
     * @private
     * @param {Object} event - Contains newValue and oldValue.
     */
    _onPresentingStateChanged = (event) => {
        this._handlePresentingStateTransition(event.newValue, event.oldValue);
        this._onSyncRequested();
        this._updateCaptionSettings();
    };

    /**
     * Callback for track activation (success or failure).
     * @private
     * @param {Object} result - Activation result with track, success, aborted fields.
     */
    _onTrackActivationResult = (result) => {
        if (this._isDestroyed) return;

        const track = result.track;

        if (track === this.playerState.tracks.textTrackSelection) {
            try {
                this._imageSubRenderer = track.IWa();
                if (track.isImageBased) {
                    this._activateImageSubtitles(result);
                } else {
                    this._activateTextSubtitles(result);
                }
            } catch (error) {
                this.log.error("Error activating track:", error, track);
                return;
            }
        }

        if (!this._firstRenderOccurred) {
            this.playerState.recordPlayDelay(
                result.success ? "tt_comp" : "tt_err"
            );
        }

        if (result.success) {
            if (playerConfig.safariPlayPauseWorkaroundDelay) {
                setTimeout(() => {
                    this.playerState.textBufferingState.set(TextBufferingState.NORMAL);
                }, playerConfig.safariPlayPauseWorkaroundDelay);
            } else {
                this.playerState.textBufferingState.set(TextBufferingState.NORMAL);
            }

            if (!track.isImageBased) {
                this._updateCaptionSettings();
            }
        } else if (result.aborted) {
            this.log.RETRY("aborted timed text track loading");
        } else if (playerConfig.fatalOnTimedTextLoadError) {
            this.playerState.fireError(ErrorCodes.INIT_TIMEDTEXT_TRACK, {
                Cf: result.track ? result.track.playbackInfo : {},
            });
        } else {
            this.log.error("ignore subtitle initialization error", result);
            this.playerState.textBufferingState.set(TextBufferingState.NORMAL);
        }
    };

    // ── Public methods ──────────────────────────────────────────────────────

    /**
     * Enables subtitle display (shows hidden subtitles).
     */
    enableDisplay() {
        this._isVisible = true;
        this._showAllImageSubtitles();
        this._updateCaptionSettings();
    }

    /**
     * Disables subtitle display (hides visible subtitles).
     */
    disableDisplay() {
        this._isVisible = false;
        this._hideAllImageSubtitles();
        this._updateCaptionSettings();
    }

    /**
     * Registers an event listener.
     * @param {string} eventName - The event type.
     * @param {Function} handler - The callback function.
     * @param {*} [context] - Optional context.
     */
    addEventListener(eventName, handler, context) {
        this._eventEmitter.addListener(eventName, handler, context);
    }

    /**
     * Removes an event listener.
     * @param {string} eventName - The event type.
     * @param {Function} handler - The callback function.
     */
    removeEventListener(eventName, handler) {
        this._eventEmitter.removeListener(eventName, handler);
    }

    /**
     * Emits an event through the internal event emitter.
     * @param {string} eventName - The event type.
     * @param {*} data - Event data.
     * @param {*} [extra] - Optional extra data.
     * @private
     */
    _fireEvent(eventName, data, extra) {
        this._eventEmitter.emit(eventName, data, extra);
    }

    /**
     * Adds a sideloaded text track to the player.
     * @param {string} trackId - Unique identifier for the track.
     * @param {string} url - URL of the subtitle resource.
     * @param {Object} [options] - Additional track options.
     */
    addSideloadedTrack(trackId, url, options) {
        const newTrack = SideloadedTextTrack.dlc(
            this.playerState,
            trackId,
            url,
            options
        );

        this._insertTrackByRank(this.playerState.sk, newTrack);
        this.playerState.supportedKeySystemList.forEach((keySystem) => {
            this._insertTrackByRank(keySystem.sk, newTrack);
        });

        this.playerState.tracks.setTextTrack(newTrack);
        this.playerState.fireEvent(PlayerEvents.EC);
    }

    /**
     * Pre-loads a text track without activating it.
     * @param {Object} track - The text track to preload.
     * @returns {Promise<void>}
     */
    preloadTrack(track) {
        if (this._isTrackValid(track)) {
            return track.internal_Hta(this.sizeProvider).then(() => {});
        }
        return Promise.resolve();
    }

    /**
     * Computes the subtitle QoE (Quality of Experience) score.
     * @param {number} currentPts - The current presentation timestamp.
     * @returns {number} QoE score (0-100).
     */
    getSubtitleQoeScore(currentPts) {
        return this._subtitleTracker.jzc(currentPts);
    }

    /**
     * Returns detailed subtitle QoE data per track.
     * @param {number} currentPts - The current presentation timestamp.
     * @returns {Array<Object>} Array of QoE data objects per track.
     */
    getSubtitleQoeData(currentPts) {
        return this._subtitleTracker.JWa(currentPts);
    }

    /**
     * Returns the current subtitle configuration (size, visibility, margins, etc.).
     * @returns {Object} Subtitle configuration object.
     */
    getSubtitleConfiguration() {
        const config = {
            size: this.sizeProvider.DBb().characterSize,
        };

        const textRenderer = this.playerState.textRenderer;
        if (textRenderer) {
            config.visibility = textRenderer.RWa();
            config.o$ = textRenderer.PWa();
            config.margins = textRenderer.QWa();
        }

        return config;
    }

    /**
     * Updates the subtitle size and re-activates text-based tracks if needed.
     * @param {Object} newSize - The new size configuration.
     */
    updateSize(newSize) {
        this.sizeProvider.LXc(newSize);

        const currentTrack = this.playerState.tracks.textTrackSelection;
        if (this._isTrackValid(currentTrack) && !currentTrack.isImageBased) {
            currentTrack
                .internal_Hta(this.sizeProvider)
                .then(this._onTrackActivationResult)
                .catch(this._onTrackActivationResult);
        }
    }

    // ── Private methods ─────────────────────────────────────────────────────

    /**
     * Handles presenting state transitions for subtitle tracker start/end.
     * @private
     * @param {string} newState - The new presenting state.
     * @param {string} oldState - The previous presenting state.
     */
    _handlePresentingStateTransition(newState, oldState) {
        if (newState === PresentingState.PLAYING || newState === PresentingState.PAUSED) {
            if (oldState !== PresentingState.PLAYING && oldState !== PresentingState.PAUSED) {
                const track = this.playerState.tracks.textTrackSelection;
                if (!track || this._isTrackValid(track)) {
                    this._subtitleTracker.SKb(
                        this._getCurrentPts(),
                        track || undefined,
                        "presentingstate:" + newState
                    );
                }
            }
        } else if (newState === PresentingState.WAITING || newState === PresentingState.ENDED) {
            this._subtitleTracker.end(
                this._getCurrentPts() ?? undefined,
                "presentingstate:" + newState
            );
        }
    }

    /**
     * Cancels the retry timer for failed track activations.
     * @private
     */
    _cancelRetryTimer() {
        this._retryCount = 0;
        Da.clearTimeout(this._retryTimeoutHandle);
    }

    /**
     * Deactivates the currently active track, cleaning up image sub listeners.
     * @private
     */
    _deactivateCurrentTrack() {
        if (this._imageSubRenderer) {
            this._imageSubRenderer.aseTimer();
        }

        if (this._activeTrack?.isImageBased) {
            this._toggleImageSubListeners("removeListener");
        }

        this._imageSubRenderer = undefined;
    }

    /**
     * Adds or removes image subtitle event listeners.
     * @private
     * @param {string} method - Either "addListener" or "removeListener".
     */
    _toggleImageSubListeners(method) {
        if (!this._imageSubRenderer) return;

        this._imageSubRenderer[method]("showsubtitle", this._onShowImageSubtitle);
        this._imageSubRenderer[method]("removesubtitle", this._onRemoveImageSubtitle);
        this._imageSubRenderer[method]("underflow", this._onImageSubtitleUnderflow);
        this._imageSubRenderer[method]("bufferingComplete", this._onImageSubtitleBufferingComplete);

        if (method === "addListener") {
            this.playerState.addEventListener(PlayerEvents.currentTimeChanged, this._onCurrentTimeChanged);
            this.playerState.addEventListener(PlayerEvents.pt, this._onPeriodTransition);
            this.playerState.addEventListener(PlayerEvents.iO, this._onSegmentPresenting);
            this.playerState.addEventListener(PlayerEvents.rwa, this._onListenerInfoEvent);
            this.playerState.addEventListener(PlayerEvents.h8a, this._onConfigUpdate);
        } else {
            this.playerState.removeEventListener(PlayerEvents.currentTimeChanged, this._onCurrentTimeChanged);
            this.playerState.removeEventListener(PlayerEvents.pt, this._onPeriodTransition);
            this.playerState.removeEventListener(PlayerEvents.iO, this._onSegmentPresenting);
            this.playerState.removeEventListener(PlayerEvents.rwa, this._onListenerInfoEvent);
            this.playerState.removeEventListener(PlayerEvents.h8a, this._onConfigUpdate);
        }
    }

    /**
     * Builds a log-friendly object describing an image subtitle block.
     * @private
     * @param {Object} block - The image subtitle block.
     * @returns {Object} Log info object.
     */
    _buildSubtitleLogInfo(block) {
        return {
            currentPts: this._getCurrentPts(),
            displayTime: block.displayTime,
            duration: block.duration,
            id: block.id,
            originX: block.originX,
            originY: block.originY,
            sizeX: block.sizeX,
            sizeY: block.sizeY,
            rootContainerExtentX: block.rootContainerExtentX,
            rootContainerExtentY: block.rootContainerExtentY,
        };
    }

    /**
     * Activates an image-based subtitle track after successful loading.
     * @private
     * @param {Object} result - Track activation result.
     */
    _activateImageSubtitles(result) {
        const track = result.track;
        if (!track || !track.isImageBased) {
            throw Error("Not an image base subtitle");
        }

        if (result.success) {
            this._cancelRetryTimer();
            this._toggleImageSubListeners("addListener");
            this.log.info("Activated", track);
            this.playerState.isSeeking.set(track);

            if (this._firstRenderOccurred) {
                scheduleAsync(() => {
                    this._imageSubRenderer.detected(this._getCurrentPts());
                });
            } else {
                this._imageSubRenderer.pause();
            }
        } else {
            this._retryActivation(track, result);
        }
    }

    /**
     * Activates a text-based subtitle track after successful loading.
     * @private
     * @param {Object} result - Track activation result.
     */
    _activateTextSubtitles(result) {
        const track = result.track;
        const success = result.success;

        if (!track || track.isImageBased) {
            throw Error("Not a valid text track");
        }

        if (success) {
            this._cancelRetryTimer();
            this._textTrackPoller.sSb(this._imageSubRenderer);
            this.log.info("Activated", track);
            this.playerState.isSeeking.set(track);
        } else {
            this._retryActivation(track, extractError(result));
        }

        this._updateCaptionSettings();
    }

    /**
     * Schedules a retry for a failed track activation, up to the configured limit.
     * @private
     * @param {Object} track - The track that failed to activate.
     * @param {Object} errorInfo - Error information for logging.
     */
    _retryActivation(track, errorInfo) {
        const canRetry = this._retryCount < playerConfig.JIc;

        if (canRetry) {
            this._retryTimeoutHandle = Da.setTimeout(() => {
                this._retryCount++;
                track
                    .internal_Hta(this.sizeProvider)
                    .then(this._onTrackActivationResult)
                    .catch(this._onTrackActivationResult);
            }, playerConfig.j1c);
        }

        this.log.error(
            "Failed to activate" + (track?.isImageBased ? " img subtitle" : ""),
            { retry: canRetry },
            errorInfo,
            track
        );
    }

    /**
     * Checks whether a track is valid and usable.
     * @private
     * @param {Object|null} track - The track to validate.
     * @returns {boolean} True if the track is valid.
     */
    _isTrackValid(track) {
        return !(!track || (track.dr() && !track.checkMethod()));
    }

    /**
     * Inserts a track into a list sorted by rank.
     * @private
     * @param {Array} trackList - The list to insert into.
     * @param {Object} track - The track to insert.
     */
    _insertTrackByRank(trackList, track) {
        let insertIndex = trackList.findIndex((t) => t.rank >= track.rank);
        if (insertIndex === -1) {
            insertIndex = 0;
        }
        trackList.splice(insertIndex, 0, track);
    }
}

export { TimedTextManager };
