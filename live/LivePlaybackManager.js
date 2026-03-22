/**
 * Netflix Cadmium Player - Live Playback Manager
 * Module: 78312
 *
 * Manages playback state and positioning for live streaming content.
 * Tracks the live edge, handles seek-to-live-edge operations, manages
 * live event timing (start/end slates), calculates playback rate drift
 * correction, and exposes state about whether the user is watching at
 * the live edge or has seeked away.
 *
 * Exported as `LivePlaybackManagerFactorySymbol` via Module 30873.
 */

// Dependencies:
// import { createScheduledInterval } from '../ella';                 // webpack 5021  (ellaSendRateMultiplier)
// import { assert } from '../assert';                                // webpack 45146
// import { isDefined } from '../utils/TypeGuards';                   // webpack 32687 (wc)
// import { PlayerEvents, streamState } from '../events/PlayerEvents';// webpack 85001
// import { SlateState } from './LivePlaybackConstants';              // webpack 30873
// import { Observable } from '../classes/Observable';                // webpack 81734 (currentBitrate)
// import { TimeUtil } from '../timing/TimeUtil';                    // webpack 45247
// import { isLiveManifestType, hasSegmentAvailabilityWindow } from '../streaming/ManifestUtils'; // webpack 91176

/**
 * @typedef {Object} LiveBookmark
 * @property {number} startPts - The starting PTS for the bookmark
 * @property {number} downloadNotifyPts - PTS at which to notify about download boundaries
 * @property {number} minimumPts - The minimum allowed PTS
 */

/**
 * Manages live playback state, live edge tracking, event timing (slates),
 * and user intent regarding live-edge viewing.
 */
export class LivePlaybackManager {
    /**
     * @param {Function} configGetter - Returns the live playback configuration object
     * @param {Function} driftCorrectionFactory - Factory for creating playback rate drift correction controllers
     * @param {Object} scheduler - Scheduler providing repeatInterval for periodic tasks
     * @param {Object} logger - Logger instance
     * @param {Object} currentSegment - The current playback segment with manifest, media time, etc.
     * @param {Object} playerState - The player state object with event firing and state observables
     */
    constructor(configGetter, driftCorrectionFactory, scheduler, logger, currentSegment, playerState) {
        /** @type {Function} */
        this.config = configGetter;

        /** @type {Object} */
        this.scheduler = scheduler;

        /** @type {Object} */
        this.currentSegment = currentSegment;

        /** @type {Object} */
        this.playerState = playerState;

        /** @type {Observable<boolean>} Whether the user intends to watch at the live edge */
        this.intentToPlayAtLiveEdge = new Observable(false);

        /** @type {Observable<boolean>} Whether playback is currently at the live edge */
        this.isAtLiveEdge = new Observable(false);

        /** @type {number|undefined} PTS of the live event start */
        this.eventStartPts = undefined;

        /** @type {number|undefined} PTS of the live event end */
        this.eventEndPts = undefined;

        /** @type {boolean} Whether live event times have been set */
        this.hasSetLiveEventTimes = false;

        /** @type {number|undefined} Forced AST-relative bookmark position */
        this.forcedAstBookmark = undefined;

        /** @type {Object} Sub-logger for this component */
        this.log = logger.createSubLogger("LivePlaybackManager");

        /** @type {Object|undefined} Playback rate drift correction controller */
        this.playbackRateDriftCorrection = undefined;

        /** @private @type {Object|undefined} Repeating interval handle for live edge updates */
        this._liveEdgeUpdateInterval = undefined;

        // Apply forced AST bookmark from config
        this.forcedAstBookmark = this.config().forceAstRelativeLiveBookmark;

        const startSlateMs = this.config().startSlateMs;
        const liveSlateMs = this.config().liveSlateMs;
        this.hasSetLiveEventTimes = isDefined(startSlateMs) && isDefined(liveSlateMs);

        // -- Closure-captured state --
        let slateTimingInterval;
        let previousSeekTarget;

        // ---- Event Listeners ----

        // On first render: set up drift correction and slate timing
        playerState?.addEventListener(PlayerEvents.firstRenderOccurred, () => {
            if (!this.isLive) return;

            assert(
                this.playerState && this.playerState.activeSegment === this.currentSegment,
                "Unexpected playback segment on playbackReady"
            );

            // Initialize playback rate drift correction if enabled
            if (this.config().enableLivePlaybackRateDriftCorrection) {
                this.playbackRateDriftCorrection = driftCorrectionFactory((newRate) => {
                    assert(
                        this.isLive && this.playerState && this.playerState.activeSegment === this.currentSegment,
                        "Unexpected playback segment on playback rate update"
                    );
                    if (this.currentSegment.playbackRate.value !== newRate) {
                        this.currentSegment.playbackRate.set(newRate);
                        this.playerState.fireEvent(PlayerEvents.LIVE_EVENT_TIMES_CHANGED);
                    }
                });
            }

            // Schedule periodic slate time calculation if slate timing is configured
            if (this.hasSetLiveEventTimes) {
                const firstRenderLiveEdge = this.getLiveEdge();

                slateTimingInterval = this.scheduler.repeatInterval(
                    createScheduledInterval(500),
                    () => {
                        const currentLiveEdge = this.getLiveEdge();
                        let eventStartTime;
                        let eventEndTime;

                        // Check if we've reached the start slate boundary
                        const startSlatePts = firstRenderLiveEdge + startSlateMs;
                        if (currentLiveEdge >= startSlatePts - 500) {
                            eventStartTime = this.convertPtsToEventTime(startSlatePts);
                        }

                        // Check if we've reached the end slate boundary
                        const endSlatePts = firstRenderLiveEdge + startSlateMs + liveSlateMs;
                        if (currentLiveEdge >= endSlatePts - 500) {
                            eventEndTime = this.convertPtsToEventTime(endSlatePts);
                            slateTimingInterval?.cancel();
                        }

                        this.setLiveEventTimes(eventStartTime, eventEndTime, true);
                    }
                );
            }
        });

        // On closing: clean up drift correction and intervals
        playerState?.addEventListener(PlayerEvents.clearTimeoutFn, () => {
            if (!this.isLive) return;
            assert(
                this.playerState && this.playerState.activeSegment === this.currentSegment,
                "Unexpected playback segment on closing"
            );
            this.playbackRateDriftCorrection = undefined;
            this._liveEdgeUpdateInterval?.cancel();
            this._liveEdgeUpdateInterval = undefined;
            slateTimingInterval?.cancel();
        });

        // On reposition (seek / live edge jump)
        playerState?.addEventListener(PlayerEvents.repositioned, (event) => {
            if (!this.isLive) return;
            assert(
                this.playerState && this.playerState.activeSegment === this.currentSegment,
                "Unexpected playback segment on repositioning"
            );
            if (event.cause === streamState.SEEK || event.cause === streamState.LIVE_EDGE) {
                this.intentToPlayAtLiveEdge.set(
                    (event.cause === streamState.LIVE_EDGE || this.config().simulateLiveEdge) &&
                    !this.isPlaybackPausedByUser()
                );
            }
        });

        // On user-initiated pause
        playerState?.addEventListener(PlayerEvents.userInitiatedPause, () => {
            if (!this.isLive) return;
            assert(
                this.playerState && this.playerState.activeSegment === this.currentSegment,
                "Unexpected playback segment on userInitiatedPause"
            );
            this.intentToPlayAtLiveEdge.set(false);
        });

        // On background state change: seek to live edge or event start when returning to foreground
        playerState?.background.addListener(() => {
            if (!this.isLive) return;
            assert(
                this.playerState && this.playerState.activeSegment === this.currentSegment,
                "Unexpected playback segment on background update"
            );
            if (!this.playerState.background.value && this.getIntentToPlayAtLiveEdge() && this.forcedAstBookmark === undefined) {
                if (this.isLiveEventEnded()) {
                    this.playerState.mediaSourceManager?.seek(this.eventStartPts, streamState.SEEK);
                } else {
                    this.seekToLiveEdge();
                }
            }
        });

        // On media time update: recalculate live edge, fire events on state transitions
        this.currentSegment.mediaTime.addListener(() => {
            if (!this.isLive) return;

            assert(
                this.playerState && this.playerState.activeSegment === this.currentSegment,
                "Unexpected playback segment on mediaTime update"
            );

            const state = this.playerState;
            this.calculateIsAtLiveEdge();

            const prevSeekTarget = previousSeekTarget;
            const currentSeekTarget = this.currentSegment.seekTargetTime ?? undefined;
            previousSeekTarget = currentSeekTarget;

            // Fire event if the live event state changed
            const prevEventState = this.getLiveEventState(prevSeekTarget);
            const currentEventState = this.getLiveEventState(currentSeekTarget);
            if (prevEventState !== currentEventState) {
                state.fireEvent(PlayerEvents.LIVE_EVENT_TIMES_CHANGED);
            }

            // Manage the periodic live edge update interval
            if (this.isLiveEventEnded()) {
                this._liveEdgeUpdateInterval?.cancel();
                this._liveEdgeUpdateInterval = undefined;
            } else if (!this._liveEdgeUpdateInterval) {
                this._liveEdgeUpdateInterval = this.scheduler.repeatInterval(
                    createScheduledInterval(1000),
                    () => {
                        this.calculateIsAtLiveEdge();
                        state.fireEvent(PlayerEvents.LIVE_EVENT_TIMES_CHANGED);
                    }
                );
            }

            // Update drift correction
            this.playbackRateDriftCorrection?.onPlaybackRateChanged(
                this.playerState.playing.value && this.getIntentToPlayAtLiveEdge(),
                currentSeekTarget,
                this.getLiveEdge()
            );

            // Force live edge during start slate if configured
            if (this.config().enableForceLiveEdgeAtEventStart && this.isLiveEventStarted()) {
                this.forceLiveEdgeInStartSlate();
            }
        });

        // On playing state change
        playerState?.playing.addListener(() => {
            if (!this.isLive) return;
            assert(
                this.playerState && this.playerState.activeSegment === this.currentSegment,
                "Unexpected playback segment on playing update"
            );
            if (this.config().enableForceLiveEdgeOnResumeInStartSlate) {
                this.forceLiveEdgeInStartSlate();
            }
        });

        // When intent to play at live edge changes, recalculate
        this.intentToPlayAtLiveEdge.addListener(() => {
            assert(this.isLive, `Unexpected call to intentToPlayAtLiveEdge.set(). isLive:${this.isLive}`);
            assert(
                this.playerState && this.playerState.activeSegment === this.currentSegment,
                "Playback is required for live."
            );
            this.calculateIsAtLiveEdge();
        });

        // When isAtLiveEdge changes, fire the event
        this.isAtLiveEdge.addListener(() => {
            assert(this.isLive, `Unexpected call to intentToPlayAtLiveEdge.set(). isLive:${this.isLive}`);
            assert(
                this.playerState && this.playerState.activeSegment === this.currentSegment,
                "Playback is required for live."
            );
            this.playerState.fireEvent(PlayerEvents.LIVE_EVENT_TIMES_CHANGED);
        });
    }

    // ---- Properties ----

    /**
     * Whether the current content is a live stream.
     * Determined by checking the manifest type or the manifest format string.
     * @type {boolean}
     */
    get isLive() {
        const segment = this.currentSegment;
        const manifestRef = segment.manifestRef;
        const manifestFormat = segment.manifestFormat;
        return manifestRef
            ? isLiveManifestType(manifestRef.manifestContent.manifestType)
            : manifestFormat === "live";
    }

    // ---- Public Methods ----

    /**
     * Checks whether the live UI should be disabled based on the presence
     * of a live event end time in the manifest metadata.
     * @returns {boolean}
     */
    shouldDisableLiveUi() {
        return this.currentSegment.manifestRef?.manifestContent.liveMetadata?.liveEventEndTime !== undefined;
    }

    /**
     * Determines if the live UI is currently disabled, either by forced config
     * or by manifest metadata indicating the event has a known end time.
     * @returns {boolean}
     */
    isLiveUiDisabled() {
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );
        const shouldAutoDisable = this.currentSegment.manifestRef?.manifestContent.liveMetadata?.disableOnEndTime ?? false;
        return this.config().forceDisableLiveUi || (shouldAutoDisable && this.shouldDisableLiveUi());
    }

    /**
     * Processes the live manifest to extract event start/end times and
     * optionally set a forced AST bookmark based on config offset.
     */
    processManifest() {
        assert(this.isLive, `Unexpected call to processManifest(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );
        assert(this.currentSegment.manifestRef?.manifestContent.liveMetadata, "Live manifest is unavailable.");

        const liveMetadata = this.currentSegment.manifestRef.manifestContent.liveMetadata;
        this.setLiveEventTimes(liveMetadata.liveEventStartTime, liveMetadata.liveEventEndTime);

        const forcedOffset = this.config().forcedEventStartOffset;
        if (forcedOffset !== undefined && this.eventStartPts !== undefined) {
            this.forcedAstBookmark = this.eventStartPts + forcedOffset;
        }
    }

    /**
     * Sets the live event start and end times (in PTS). Validates that the times
     * are consistent and fires a LIVE_EVENT_TIMES_CHANGED event if they change.
     *
     * @param {string|undefined} startTimeString - ISO date string for event start
     * @param {string|undefined} endTimeString - ISO date string for event end
     * @param {boolean} [forceUpdate=false] - If true, update even if times were previously set
     */
    setLiveEventTimes(startTimeString, endTimeString, forceUpdate) {
        assert(this.isLive, `Unexpected call to setLiveEventTimes(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );

        if (!this.hasSetLiveEventTimes || forceUpdate) {
            const state = this.playerState;
            const previousStartPts = this.eventStartPts;
            const previousEndPts = this.eventEndPts;

            const newStartPts = this.parseLiveTimestamp(startTimeString) ?? previousStartPts;
            const newEndPts = this.parseLiveTimestamp(endTimeString) ?? previousEndPts;

            // Validate: either both undefined, or start >= 0 with optional end > start
            const isValid =
                (newStartPts === undefined && newEndPts === undefined) ||
                (newStartPts !== undefined && newStartPts >= 0 && newEndPts === undefined) ||
                (newStartPts !== undefined && newStartPts >= 0 && newEndPts !== undefined && newEndPts > newStartPts);

            if (isValid) {
                this.eventStartPts = newStartPts;
                this.eventEndPts = newEndPts;
                if (previousStartPts !== this.eventStartPts || previousEndPts !== this.eventEndPts) {
                    state.fireEvent(PlayerEvents.LIVE_EVENT_TIMES_CHANGED);
                }
            } else {
                this.log.error(
                    `Unexpected live event times. Ignoring:startTime:${startTimeString}, startPts:${newStartPts}, endTime:${endTimeString}, endPts:${newEndPts}`
                );
            }
        }
    }

    /**
     * Returns the current content event time as an ISO date string,
     * based on the current seek target PTS.
     * @returns {string|undefined}
     */
    getCurrentContentEventTime() {
        assert(this.isLive, `Unexpected call to getCurrentContentEventTime(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );
        const seekTarget = this.currentSegment.seekTargetTime;
        if (seekTarget !== null) {
            return this.convertPtsToEventTime(seekTarget);
        }
    }

    /**
     * Returns the current segment number in the live stream based on the
     * seek target time and the segment template duration.
     * @returns {number|undefined}
     */
    getCurrentSegmentNumber() {
        assert(this.isLive, `Unexpected call to getCurrentSegmentNumber(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );
        assert(this.currentSegment.manifestRef?.manifestContent.liveMetadata, "Live manifest is unavailable.");

        const seekTarget = this.currentSegment.seekTargetTime;
        if (seekTarget !== null) {
            const liveMetadata = this.currentSegment.manifestRef.manifestContent.liveMetadata;
            const firstVideoStream = this.currentSegment.manifestRef.manifestContent.video_tracks[0].streams[0];
            const segmentTemplateId = liveMetadata.downloadableIdToSegmentTemplateId[firstVideoStream.downloadableId];
            const segmentTemplate = liveMetadata.segmentTemplateIdToSegmentTemplate[segmentTemplateId];

            const startNumber = Number(segmentTemplate.startNumber);
            const segmentDuration = new TimeUtil(segmentTemplate.duration, segmentTemplate.timescaleValue);
            return startNumber + Math.floor(seekTarget / segmentDuration.toMilliseconds());
        }
    }

    /**
     * Returns the current content PTS adjusted for UI display purposes.
     * During START_SLATE returns 0, during LIVE_EVENT returns time since event start,
     * during END_SLATE returns the total event duration.
     * @returns {number|undefined}
     */
    getUIAdjustedCurrentContentPts() {
        assert(this.isLive, `Unexpected call to getUIAdjustedCurrentContentPts(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );

        const seekTarget = this.currentSegment.seekTargetTime;
        if (seekTarget !== null) {
            switch (this.getLiveEventState(seekTarget)) {
                case SlateState.START_SLATE:
                    return 0;
                case SlateState.LIVE_EVENT:
                    assert(this.eventStartPts !== undefined, "eventStartPts should be defined in LIVE_EVENT slate.");
                    return seekTarget - this.eventStartPts;
                case SlateState.END_SLATE:
                    assert(
                        this.eventStartPts !== undefined && this.eventEndPts !== undefined,
                        "eventStartPts and eventEndPts should be defined in END_SLATE slate."
                    );
                    return this.eventEndPts - this.eventStartPts;
            }
        }
    }

    /**
     * Converts a UI-adjusted time back to an absolute PTS value.
     * @param {number} uiTime - The UI-adjusted time to convert
     * @returns {number}
     */
    revertUIAdjustedTime(uiTime) {
        assert(this.isLive, `Unexpected call to revertUIAdjustedTime(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );
        if (this.eventStartPts === undefined) {
            return this.getLiveEdge() ?? this.currentSegment.seekTargetTime ?? uiTime;
        }
        return this.eventStartPts + uiTime;
    }

    /**
     * Checks whether the given PTS is within the configured live edge threshold.
     * @param {number} pts - The PTS to check
     * @returns {boolean}
     */
    isWithinUILiveEdgeThreshold(pts) {
        assert(this.isLive, `Unexpected call to isWithinUILiveEdgeThreshold(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );
        const liveEdge = this.getLiveEdge();
        return liveEdge !== undefined && pts >= liveEdge - this.config().liveEdgeThreshold;
    }

    /**
     * Calculates the bookmark position for live playback, taking into account
     * forced bookmarks, event boundaries, and user resume position.
     *
     * @param {number} resumePositionMs - Resume position relative to event start (ms)
     * @param {boolean} isInitialPlay - Whether this is the initial play request
     * @returns {LiveBookmark}
     */
    getLiveBookmark(resumePositionMs, isInitialPlay) {
        assert(this.isLive, `Unexpected call to getLiveBookmark(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );

        // If a forced bookmark is set, always use it
        if (this.forcedAstBookmark !== undefined) {
            return {
                startPts: this.forcedAstBookmark,
                downloadNotifyPts: Number.MAX_SAFE_INTEGER,
                minimumPts: this.forcedAstBookmark
            };
        }

        if (this.config().simulateLiveEdge) {
            this.intentToPlayAtLiveEdge.set(true);
        }

        const maxSafeValue = Number.MAX_SAFE_INTEGER;
        let startPts;

        if (isInitialPlay || this.eventStartPts === undefined || (this.eventEndPts === undefined && resumePositionMs === 0)) {
            // Start at the live edge
            this.intentToPlayAtLiveEdge.set(true);
            startPts = maxSafeValue;
        } else {
            // Start at a specific position relative to event start
            startPts = this.eventStartPts + resumePositionMs;
            if (this.eventEndPts !== undefined && startPts > this.eventEndPts) {
                // If past the end, reset to event start
                startPts = this.eventStartPts;
            }
        }

        return {
            startPts,
            downloadNotifyPts: this.eventEndPts ?? Number.MAX_SAFE_INTEGER,
            minimumPts: this.eventStartPts ?? maxSafeValue
        };
    }

    /**
     * Returns the maximum seek PTS across event end, live edge, and current seek target.
     * @returns {number}
     */
    getMaxSeekPts() {
        return Math.max(
            this.eventEndPts ?? 0,
            this.getLiveEdge() ?? 0,
            this.currentSegment.seekTargetTime ?? 0
        );
    }

    /**
     * Returns the duration of the live content from event start to the current
     * position (or event end if the event has ended).
     * @returns {number}
     */
    getLiveContentDuration() {
        assert(this.isLive, `Unexpected call to getLiveContentDuration(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );

        if (this.eventStartPts === undefined) {
            return 0;
        }

        const seekTarget = this.currentSegment.seekTargetTime;
        const endPoint = this.eventEndPts !== undefined
            ? this.eventEndPts
            : (this.getIsAtLiveEdge() && seekTarget !== null ? seekTarget : this.getMaxSeekPts());

        return endPoint - this.eventStartPts;
    }

    /**
     * Returns the current live latency: the distance from the live edge,
     * clamped to the event end if applicable.
     * @returns {number}
     */
    getLiveLatency() {
        assert(this.isLive, `Unexpected call to getMaxSeekPts(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );

        let liveEdge = this.getLiveEdge();
        if (this.eventEndPts !== undefined && liveEdge !== undefined) {
            liveEdge = Math.min(this.eventEndPts, liveEdge);
        }
        return liveEdge ?? 0;
    }

    /**
     * Returns the current live edge PTS from the streaming session's playgraph.
     * @returns {number|undefined}
     */
    getLiveEdge() {
        assert(this.isLive, `Unexpected call to getLiveEdge(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );
        return this.playerState.streamingSession
            ?.getPlaygraphNode(this.currentSegment.streamId)
            ?.liveEdgePts;
    }

    /**
     * Seeks the player to the current live edge position.
     * Updates the intent to play at live edge (unless user has paused).
     */
    seekToLiveEdge() {
        assert(this.isLive, `Unexpected call to seekToLiveEdge(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );

        this.intentToPlayAtLiveEdge.set(!this.isPlaybackPausedByUser());

        if (this.playerState.mediaSourceManager) {
            const liveEdge = this.getLiveEdge();
            if (liveEdge !== undefined) {
                this.playerState.mediaSourceManager.seek(
                    liveEdge,
                    streamState.LIVE_EDGE,
                    this.currentSegment.presentationId
                );
            }
        } else {
            this.currentSegment.bookmark = this.getLiveBookmark(0, true).startPts;
        }
    }

    /**
     * Returns whether the player is currently at the live edge.
     * Recalculates first, then returns the current value.
     * @returns {boolean}
     */
    getIsAtLiveEdge() {
        assert(this.isLive, `Unexpected call to isAtLiveEdge(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );
        this.calculateIsAtLiveEdge();
        return this.isAtLiveEdge.value;
    }

    /**
     * Returns the current value of the intent-to-play-at-live-edge flag.
     * @returns {boolean}
     */
    getIntentToPlayAtLiveEdge() {
        assert(this.isLive, `Unexpected call to intentToPlayAtLiveEdge(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );
        return this.intentToPlayAtLiveEdge.value;
    }

    /**
     * Determines the current live event state (START_SLATE, LIVE_EVENT, or END_SLATE)
     * based on the given PTS position relative to event start and end.
     *
     * @param {number|undefined|null} [pts] - The PTS to evaluate; defaults to current seek target
     * @returns {string} One of SlateState values
     */
    getLiveEventState(pts) {
        assert(this.isLive, `Unexpected call to getLiveEventState(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );

        // For linear streams with segment availability windows, always report LIVE_EVENT
        if (hasSegmentAvailabilityWindow(this.currentSegment.manifestRef?.manifestContent.manifestType)) {
            return SlateState.LIVE_EVENT;
        }

        const currentPts = pts ?? this.currentSegment.seekTargetTime ?? 0;
        const startPts = this.eventStartPts ?? Infinity;
        const endPts = this.eventEndPts ?? Infinity;

        if (currentPts < startPts) return SlateState.START_SLATE;
        if (currentPts > endPts) return SlateState.END_SLATE;
        return SlateState.LIVE_EVENT;
    }

    /**
     * Checks whether the live event has ended.
     *
     * @param {boolean} [checkEndPtsOnly=false] - If true, only checks if eventEndPts is defined.
     *   If false (default), also verifies the live edge has passed the end.
     * @returns {boolean}
     */
    isLiveEventEnded(checkEndPtsOnly) {
        assert(this.isLive, `Unexpected call to isLiveEventEnded(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );

        if (checkEndPtsOnly) {
            return this.eventEndPts !== undefined;
        }

        const liveEdge = this.getLiveEdge();
        return this.eventEndPts !== undefined && liveEdge !== undefined && this.eventEndPts < liveEdge;
    }

    /**
     * Checks whether the live event has started (the live edge has passed the start PTS).
     * @returns {boolean}
     */
    isLiveEventStarted() {
        assert(this.isLive, `Unexpected call to isLiveEventStarted(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );
        const liveEdge = this.getLiveEdge();
        return this.eventStartPts !== undefined && liveEdge !== undefined && this.eventStartPts < liveEdge;
    }

    /**
     * Checks whether playback is paused due to user action (not a system/buffering pause).
     * @returns {boolean}
     */
    isPlaybackPausedByUser() {
        assert(this.isLive, `Unexpected call to isPlaybackPausedByUser(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );
        return this.playerState.paused.value && !(this.playerState.paused.metadata?.isSystemPause);
    }

    /**
     * Recalculates whether the player is at the live edge based on both
     * the user's intent and the actual playback position.
     * @private
     */
    calculateIsAtLiveEdge() {
        assert(this.isLive, `Unexpected call to calculateIsAtLiveEdge(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );
        this.isAtLiveEdge.set(
            this.getIntentToPlayAtLiveEdge() &&
            this.isWithinUILiveEdgeThreshold(this.currentSegment.seekTargetTime ?? 0)
        );
    }

    /**
     * If playback is active, in the START_SLATE state, not at the live edge,
     * and no forced bookmark is set, forces a seek to the live edge.
     * @private
     */
    forceLiveEdgeInStartSlate() {
        assert(this.isLive, `Unexpected call to forceLiveEdgeInStartSlate(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );
        if (
            this.playerState.playing.value &&
            this.getLiveEventState() === SlateState.START_SLATE &&
            !this.getIsAtLiveEdge() &&
            this.forcedAstBookmark === undefined
        ) {
            this.seekToLiveEdge();
        }
    }

    /**
     * Converts a PTS value to an ISO 8601 event time string using the manifest's
     * availability start time and event availability offset.
     *
     * @param {number} pts - The PTS to convert
     * @returns {string} ISO 8601 date string
     * @private
     */
    convertPtsToEventTime(pts) {
        assert(this.isLive, `Unexpected call to convertPtsToEventTime(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );
        assert(this.currentSegment.manifestRef?.manifestContent.liveMetadata, "Live manifest is unavailable.");

        const liveMetadata = this.currentSegment.manifestRef.manifestContent.liveMetadata;
        const firstVideoStream = this.currentSegment.manifestRef.manifestContent.video_tracks[0].streams[0];
        const segmentTemplateId = liveMetadata.downloadableIdToSegmentTemplateId[firstVideoStream.downloadableId];
        const segmentTemplate = liveMetadata.segmentTemplateIdToSegmentTemplate[segmentTemplateId];

        const availabilityStartTimeMs = new Date(segmentTemplate.availabilityStartTime).getTime();
        return new Date(availabilityStartTimeMs - liveMetadata.eventAvailabilityOffsetMs + pts).toISOString();
    }

    /**
     * Parses a live event timestamp string into a PTS value relative to
     * the manifest's availability start time and event availability offset.
     *
     * @param {string|undefined} eventDateString - ISO date string to parse
     * @returns {number|undefined} PTS in milliseconds, or undefined if invalid
     * @private
     */
    parseLiveTimestamp(eventDateString) {
        assert(this.isLive, `Unexpected call to convertEventTimeToPts(). isLive:${this.isLive}`);
        assert(
            this.playerState && this.playerState.activeSegment === this.currentSegment,
            "Playback is required for live."
        );
        assert(this.currentSegment.manifestRef?.manifestContent.liveMetadata, "Live manifest is unavailable.");

        if (!eventDateString) return undefined;

        const liveMetadata = this.currentSegment.manifestRef.manifestContent.liveMetadata;
        const firstVideoStream = this.currentSegment.manifestRef.manifestContent.video_tracks[0].streams[0];
        const segmentTemplateId = liveMetadata.downloadableIdToSegmentTemplateId[firstVideoStream.downloadableId];
        const segmentTemplate = liveMetadata.segmentTemplateIdToSegmentTemplate[segmentTemplateId];

        const pts = new Date(eventDateString).getTime()
            + liveMetadata.eventAvailabilityOffsetMs
            - new Date(segmentTemplate.availabilityStartTime).getTime();

        if (isNaN(pts) || pts < 0) {
            this.log.error(
                `Invalid live event time. Ignoring: eventDateString:${eventDateString}, ` +
                `eventAvailabilityOffsetMs:${liveMetadata.eventAvailabilityOffsetMs}, ` +
                `availabilityStartTime:${segmentTemplate.availabilityStartTime}`
            );
            return undefined;
        }

        return pts;
    }
}

export default LivePlaybackManager;
