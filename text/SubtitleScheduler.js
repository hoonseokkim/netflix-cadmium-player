/**
 * Netflix Cadmium Player - Subtitle Scheduler
 *
 * Manages the scheduling, staging, display, and removal of subtitle cues
 * during media playback. Uses a worker loop to continuously check cue timing
 * against the current playback position.
 *
 * @module SubtitleScheduler
 * @see Module_17972
 */

import { __extends, __values, __generator } from "tslib"; // Module 22970
import { ie as AsyncUtil, TimeUtil, findLast, completionState, playbackStateEnum } from "./CoreUtilities"; // Module 91176
import { ClockWatcher, EventEmitter } from "./EventUtils"; // Module 90745

/**
 * Determines if a cue should be visible at the given time.
 *
 * @param {Object} cue - The subtitle cue object.
 * @param {number} currentTime - The current playback time in milliseconds.
 * @param {number} [prerollOffset=0] - Time in ms before displayTime to start showing the cue.
 * @returns {boolean} True if the cue is active at the given time.
 */
function isCueActiveAtTime(cue, currentTime, prerollOffset = 0) {
    return cue.displayTime - prerollOffset <= currentTime && currentTime < cue.displayTime + cue.duration;
}

// ─── SubtitleBufferingWatcher ───────────────────────────────────────────────────

/**
 * Monitors subtitle data availability and emits a "bufferingcomplete" event
 * once subtitle data has been fetched. Uses exponential backoff when an
 * underflow (data starvation) is detected, and periodic polling otherwise.
 */
class SubtitleBufferingWatcher {
    /**
     * @param {Function} fetchSubtitles - Callback that returns subtitle data (or null if unavailable).
     * @param {Object} logger - Logger instance.
     * @param {boolean} [isLive=false] - Whether the stream is a live broadcast.
     */
    constructor(fetchSubtitles, logger, isLive = false) {
        /** @type {Function} */
        this._fetchSubtitles = fetchSubtitles;

        /** @type {Object} */
        this.logger = logger;

        /** @type {boolean} */
        this._isLive = isLive;

        /** @type {EventEmitter} */
        this.events = new EventEmitter();

        /** @type {boolean} */
        this._isBuffering = false;

        /** @type {number|undefined} Interval ID for periodic polling. */
        this._pollingIntervalId = undefined;

        /** @type {number|undefined} Timeout ID for backoff retry. */
        this._backoffTimeoutId = undefined;
    }

    /**
     * Whether the watcher is currently in a buffering state.
     * @type {boolean}
     */
    get buffering() {
        return this._isBuffering;
    }

    /**
     * Starts (or restarts) periodic polling for subtitle data.
     * Uses a 500 ms interval for live streams and 20 000 ms for VOD.
     */
    startPolling() {
        this.logger.pauseTrace("AseTimer:Buffering watcher restart");
        this._isBuffering = true;

        if (this._pollingIntervalId) {
            clearInterval(this._pollingIntervalId);
        }

        const pollInterval = this._isLive ? 500 : 20_000;
        this._pollingIntervalId = setInterval(() => this._checkBufferingComplete(), pollInterval);
    }

    /**
     * Called when a subtitle underflow is detected. Begins exponential-backoff
     * polling starting at ~500 ms, capped at 2 000 ms.
     */
    onUnderflow() {
        this.logger.pauseTrace("AseTimer:Buffering watcher underflow");
        this._isBuffering = true;
        this._retryWithBackoff(1);
    }

    /**
     * Resets the watcher, stopping all polling and clearing the buffering flag.
     */
    reset() {
        this.logger.pauseTrace("AseTimer:Buffering watcher reset");
        clearInterval(this._pollingIntervalId);
        clearTimeout(this._backoffTimeoutId);
        this._isBuffering = false;
    }

    /**
     * Exponential-backoff retry: delay = 250 * 2^attempt, capped at 2 000 ms.
     *
     * @param {number} attempt - The current retry attempt (1-based).
     * @private
     */
    _retryWithBackoff(attempt) {
        let delay = 250 * (1 << attempt);
        if (delay > 2_000) {
            delay = 2_000;
        }

        this._checkBufferingComplete();

        if (this._isBuffering) {
            this._backoffTimeoutId = setTimeout(
                this._retryWithBackoff.bind(this, attempt + 1),
                delay
            );
        }
    }

    /**
     * Checks whether subtitle data is now available. If so, resets the watcher
     * and emits a "bufferingcomplete" event.
     *
     * @private
     */
    _checkBufferingComplete() {
        const data = this._fetchSubtitles();
        this.logger.pauseTrace("AseTimer:Buffering complete check", data?.length);

        if (data !== null) {
            this.reset();
            this.events.emit("bufferingcomplete", {
                type: "bufferingcomplete",
                subtitleData: data,
            });
        }
    }
}

// ─── SubtitleScheduler ──────────────────────────────────────────────────────────

/**
 * Core subtitle scheduling engine. Extends EventEmitter and drives the
 * subtitle display lifecycle:
 *
 *   1. Fetches cue data from the subtitle source.
 *   2. Stages cues that are approaching their display time.
 *   3. Shows cues when their display time is reached.
 *   4. Removes cues once they expire.
 *
 * Emits the following events:
 *   - "showsubtitle"      — a cue should be rendered on screen
 *   - "stagesubtitle"     — a cue should be pre-loaded / prepared
 *   - "removesubtitle"    — a cue should be removed from screen
 *   - "underflow"         — no subtitle data available (buffering)
 *   - "bufferingComplete" — subtitle data is now available after an underflow
 *
 * @extends EventEmitter
 */
class SubtitleScheduler extends EventEmitter {
    /**
     * @param {Function} getPlaybackTime - Returns the current playback time in ms.
     * @param {Function} fetchSubtitles - Returns subtitle cues for a given time, or null.
     * @param {Function} computeSleepDuration - Computes how long to sleep given next event time and current time.
     * @param {Object} logger - Logger instance.
     * @param {Function} isPaused - Returns true if playback is paused.
     * @param {Function} getTaskScheduler - Returns the current player task scheduler.
     * @param {Object} presentationPipeline - The segment presentation event source.
     * @param {Object} [options] - Additional options.
     * @param {boolean} [options.isLive] - Whether the stream is live.
     * @param {number} [options.a_c] - Preroll offset in ms for early cue activation.
     */
    constructor(getPlaybackTime, fetchSubtitles, computeSleepDuration, logger, isPaused, getTaskScheduler, presentationPipeline, options) {
        super();

        /** @private @type {Function} */
        this._getPlaybackTime = getPlaybackTime;

        /** @private @type {Function} */
        this._fetchSubtitles = fetchSubtitles;

        /** @private @type {Function} */
        this._computeSleepDuration = computeSleepDuration;

        /** @type {Object} */
        this.logger = logger;

        /** @private @type {Function} */
        this._isPaused = isPaused;

        /** @private @type {Function} */
        this._getTaskScheduler = getTaskScheduler;

        /** @private @type {Object} */
        this._presentationPipeline = presentationPipeline;

        /** @type {Object|undefined} */
        this.options = options;

        /**
         * Cues that have been staged (pre-loaded) but not yet shown.
         * @type {Array<Object>}
         */
        this._stagedCues = [];

        /**
         * Cues currently visible on screen.
         * @type {Array<Object>}
         */
        this._visibleCues = [];

        /**
         * All active cues (staged + visible + pending) tracked by the worker loop.
         * @type {Array<Object>}
         */
        this._activeCues = [];

        /** @private @type {ClockWatcher} */
        this._presentationWatcher = new ClockWatcher();

        /** @private @type {ClockWatcher} */
        this._taskSchedulerWatcher = new ClockWatcher();

        /** @private @type {ClockWatcher} */
        this._clockWatcher = new ClockWatcher();

        /** @private @type {SubtitleBufferingWatcher} */
        this._bufferingWatcher = new SubtitleBufferingWatcher(
            () => fetchSubtitles(getPlaybackTime()),
            this.logger,
            this.options?.isLive || false
        );

        this._bufferingWatcher.events.on("bufferingcomplete", () => {
            this.logger.pauseTrace("AseTimer:Received buffering complete from watcher");
            this._scheduledTask?.reuseOnErrorCacheSize();
            this._onBufferingComplete();
        });

        this._bufferingWatcher.startPolling();
        this._setupTaskScheduler();

        this._presentationWatcher.on(this._presentationPipeline, "segmentPresenting", () => {
            this._onTimelineChanged();
        });

        this._presentationWatcher.on(this._presentationPipeline, "taskSchedulerChanged", () => {
            this._setupTaskScheduler();
        });

        this._scheduledTask?.destroy();
    }

    /**
     * Whether the buffering watcher is currently active.
     * @type {boolean}
     */
    get _buffering() {
        return this._bufferingWatcher.buffering;
    }

    // ── Worker Loop ───────────────────────────────────────────────────────────

    /**
     * Generator-based worker loop that continuously processes subtitle cues.
     * Called as a scheduled task by the player's task scheduler.
     *
     * @returns {Generator} Async generator for the task scheduler.
     * @private
     */
    *_subtitleWorkerLoop() {
        this.logger.pauseTrace("AseTimer:Starting subtitle worker");

        if (this._isPaused()) {
            this.logger.pauseTrace("Paused: exiting");
            return;
        }

        const getPlaybackSegment = () => this.branchScheduler.playerCore.currentTime.playbackSegment;
        const getTime = this._getPlaybackTime;

        // Merge staged and visible cues into active set
        this._activeCues = this._visibleCues.concat(this._stagedCues);
        this._refreshSubtitles(getTime(), true);

        while (this._activeCues.length) {
            let currentTime = getTime();
            const timeAtLoopStart = currentTime;

            this._removeExpiredCues(currentTime);

            for (const cue of this._activeCues) {
                this.logger.pauseTrace(`AseTimer:Checking subtitle ${cue.id}`);

                if (currentTime >= cue.displayTime + cue.duration) {
                    // Cue already expired — skip
                    continue;
                }

                if (isCueActiveAtTime(cue, currentTime, this.options.a_c)) {
                    this.logger.pauseTrace(`AseTimer:Showing subtitle ${cue.id}`);
                    this._showCue(cue);
                    currentTime = Math.max(currentTime, cue.displayTime);
                } else {
                    this.logger.pauseTrace(`AseTimer:Staging subtitle ${cue.id}`);
                    this._stageCue(cue);
                }
            }

            const nextEventTime = this._getNextEventTime(currentTime);

            if (!isFinite(nextEventTime)) {
                this._bufferingWatcher.startPolling();
                break;
            }

            const playbackSegment = getPlaybackSegment();
            const sleepDuration = this._computeSleepDuration(nextEventTime, timeAtLoopStart);

            if (sleepDuration === undefined) {
                break;
            }

            const wakeTime = Math.max(sleepDuration, 10) + playbackSegment;
            this.logger.pauseTrace(`AseTimer:Sleeping till PlayerTime ${wakeTime}`);

            yield AsyncUtil.millisecondsDelay(TimeUtil.fromMilliseconds(wakeTime));

            this._refreshSubtitles(getTime());
        }

        this.logger.pauseTrace(`AseTimer:Checking removed subtitles one more time ${getTime()}`);
        this._removeExpiredCues(getTime());
        this.logger.pauseTrace("AseTimer:Ending subtitle worker");
    }

    // ── Subtitle Data Management ──────────────────────────────────────────────

    /**
     * Fetches new subtitle cue data and merges it into the active cue list.
     * On a full refresh (`isInitial`), also removes cues no longer in the source data.
     *
     * @param {number} currentTime - Current playback time in ms.
     * @param {boolean} [isInitial=false] - If true, performs a full refresh.
     * @private
     */
    _refreshSubtitles(currentTime, isInitial = false) {
        let shouldRefresh = isInitial || !this._stagedCues.length;

        if (!shouldRefresh) {
            shouldRefresh = this._activeCues[this._activeCues.length - 1].displayTime > currentTime;
        }

        if (!shouldRefresh) {
            return;
        }

        this.logger.pauseTrace(`AseTimer:Getting subtitles for ${currentTime}`, {
            Ddd: this.branchScheduler.playerCore.currentTime,
        });

        const newCues = this._fetchSubtitles(currentTime);

        if (!newCues) {
            this._onUnderflow();
            return;
        }

        this.logger.pauseTrace(`AseTimer:Received ${newCues.length} subtitles`);

        for (const cue of newCues) {
            // Skip if already tracked or already expired
            const alreadyTracked = findLast(this._activeCues, (c) => c.id === cue.id);
            if (alreadyTracked || currentTime >= cue.displayTime + cue.duration) {
                continue;
            }

            this.logger.pauseTrace(`AseTimer:adding ${cue.id}`, {
                start: cue.startTime,
                eed: cue.displayTime,
                end: cue.endTime,
                ued: cue.duration,
            });
            this._activeCues.push(cue);
        }

        // On initial refresh, remove cues that are no longer in source data
        if (isInitial) {
            const orphanedCues = this._activeCues.filter(
                (cue) => !findLast(newCues, (c) => c.id === cue.id)
            );
            orphanedCues.forEach((cue) => this._removeCue(cue));
        }

        if (!this._activeCues.length) {
            this._bufferingWatcher.startPolling();
        }
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    /**
     * Stops the scheduler and clears all state: destroys the scheduled task,
     * resets the buffering watcher, removes all cues, and clears all event watchers.
     */
    stop() {
        this.logger.pauseTrace("AseTimer:Stop");
        this._scheduledTask?.destroy();
        this._bufferingWatcher.reset();
        this._removeAllVisibleCues();
        this._presentationWatcher.clear();
        this._taskSchedulerWatcher.clear();
        this._clockWatcher.clear();
    }

    /**
     * Removes all currently visible cues and clears the visible cue list.
     * Also destroys the scheduled task if it has been cancelled.
     *
     * @private
     */
    _removeAllVisibleCues() {
        this.logger.pauseTrace("AseTimer:Removing all", this._visibleCues.length);

        for (const cue of this._visibleCues) {
            this._removeCue(cue);
        }

        this._visibleCues = [];

        if (this._scheduledTask?.isCancelled) {
            this._scheduledTask?.destroy();
        }
    }

    /**
     * Pauses the subtitle scheduler by destroying the current scheduled task.
     */
    pause() {
        this._scheduledTask?.destroy();
    }

    /**
     * Re-evaluates the scheduler state. Restarts the worker if conditions are met,
     * or destroys the task if paused.
     */
    detected() {
        if (
            this._scheduledTask?.state !== completionState.complete &&
            this._scheduledTask?.state !== completionState.destroyed &&
            !this._isPaused()
        ) {
            this._scheduledTask?.reuseOnErrorCacheSize();
        }

        if (this.isPlaying) {
            this._bufferingWatcher.startPolling();
        }

        if (this._isPaused()) {
            this._scheduledTask?.destroy();
        }
    }

    // ── Task Scheduler Setup ──────────────────────────────────────────────────

    /**
     * Binds to the player's task scheduler and creates the subtitle worker task.
     * Listens for clock changes to re-register clock event listeners.
     *
     * @private
     */
    _setupTaskScheduler() {
        this.logger.pauseTrace("Setting up new task scheduler");

        this.branchScheduler = this._getTaskScheduler();

        if (!this.branchScheduler) {
            this.logger.RETRY("AseTimer: no player task scheduler");
            return;
        }

        this._taskSchedulerWatcher.clear();
        this._taskSchedulerWatcher.on(this.branchScheduler, "clockChanged", () => {
            this._registerClockListeners();
        });

        this._scheduledTask = this.branchScheduler.createScheduledTask(
            () => this._subtitleWorkerLoop(),
            "subtitleWorker"
        );

        this._registerClockListeners();
    }

    // ── Timing ────────────────────────────────────────────────────────────────

    /**
     * Computes the next time point at which a cue event (show or remove) occurs
     * after `currentTime`.
     *
     * @param {number} currentTime - The current playback time in ms.
     * @returns {number} The next event time, or Infinity if none.
     * @private
     */
    _getNextEventTime(currentTime) {
        const allEventTimes = this._activeCues
            .map((cue) => [cue.displayTime, cue.displayTime + cue.duration + 1])
            .reduce((acc, times) => acc.concat(times), [])
            .filter((time) => time > currentTime)
            .sort((a, b) => a - b);

        return allEventTimes[0] ?? Infinity;
    }

    // ── Clock Listeners ───────────────────────────────────────────────────────

    /**
     * Registers listeners on the player core's clock for seeking (clockAdjusted)
     * and stop/start events. Triggers a task restart when appropriate.
     *
     * @private
     */
    _registerClockListeners() {
        this._clockWatcher.clear();

        if (!this.branchScheduler?.playerCore) {
            this.logger.pauseTrace("onClockChanged: playerTaskScheduler has not been set or clock is undefined");
            return;
        }

        this.logger.pauseTrace("onClockChanged: clock listeners registered");

        this._clockWatcher.on(this.branchScheduler.playerCore, "clockAdjusted", (event) => {
            if (event.reason === playbackStateEnum.skipped) {
                this._onTimelineChanged();
            }
        });

        this._clockWatcher.on(this.branchScheduler.playerCore, "stopStart", () => {
            if (!this.branchScheduler.updateState) {
                this._scheduledTask?.reuseOnErrorCacheSize();
            }
        });

        this._scheduledTask?.reuseOnErrorCacheSize();
    }

    // ── Timeline Changes ──────────────────────────────────────────────────────

    /**
     * Handles timeline changes (e.g., seek). Removes all visible cues and
     * either restarts the worker or destroys the task if paused.
     *
     * @private
     */
    _onTimelineChanged() {
        this.logger.pauseTrace("Timeline changed");
        this._removeAllVisibleCues();

        if (this._isPaused()) {
            this._scheduledTask?.destroy();
        } else {
            this._scheduledTask?.reuseOnErrorCacheSize();
        }
    }

    // ── Cue State Transitions ─────────────────────────────────────────────────

    /**
     * Stages a cue (marks it as pre-loaded / upcoming). Emits "stagesubtitle".
     * No-op if the cue is already staged.
     *
     * @param {Object} cue - The subtitle cue.
     * @private
     */
    _stageCue(cue) {
        if (this._stagedCues.indexOf(cue) !== -1) {
            return;
        }

        this.logger.pauseTrace("AseTimer:Staging", cue.id);
        this._stagedCues.push(cue);
        this.emit("stagesubtitle", cue);
    }

    /**
     * Removes expired cues from all tracking lists.
     *
     * @param {number} currentTime - Current playback time in ms.
     * @private
     */
    _removeExpiredCues(currentTime) {
        const allTrackedCues = this._visibleCues.concat(this._stagedCues);

        for (const cue of allTrackedCues) {
            if (currentTime >= cue.displayTime + cue.duration) {
                this._removeCue(cue);
            }
        }
    }

    /**
     * Shows a cue on screen. Moves it from staged to visible and emits "showsubtitle".
     *
     * @param {Object} cue - The subtitle cue.
     * @private
     */
    _showCue(cue) {
        if (this._visibleCues.indexOf(cue) !== -1) {
            return;
        }

        this._visibleCues.push(cue);

        // Remove from staged list if present
        if (this._stagedCues.indexOf(cue) !== -1) {
            this._stagedCues = this._stagedCues.filter((c) => c !== cue);
        }

        this.logger.pauseTrace("AseTimer:Showing", cue.id);
        this.emit("showsubtitle", cue);
    }

    /**
     * Called when subtitle data is unavailable (underflow). Emits "underflow"
     * and triggers the buffering watcher's underflow handler.
     *
     * @private
     */
    _onUnderflow() {
        this.logger.pauseTrace("AseTimer:onUnderflow", this.isPlaying);

        if (!this.isPlaying) {
            this.emit("underflow");
            this._bufferingWatcher.onUnderflow();
        }
    }

    /**
     * Removes a cue from all tracking lists. Emits "removesubtitle" if the cue
     * was visible.
     *
     * @param {Object} cue - The subtitle cue to remove.
     * @private
     */
    _removeCue(cue) {
        this.logger.pauseTrace("AseTimer:Removing", cue.id);

        if (this._stagedCues.indexOf(cue) !== -1) {
            this._stagedCues = this._stagedCues.filter((c) => c !== cue);
        }

        if (this._visibleCues.indexOf(cue) !== -1) {
            this.emit("removesubtitle", cue);
            this._visibleCues = this._visibleCues.filter((c) => c !== cue);
        }

        this._activeCues = this._activeCues.filter((c) => c !== cue);
    }

    /**
     * Called when buffering is complete (subtitle data has arrived). Emits
     * "bufferingComplete" and restarts the scheduled task.
     *
     * @private
     */
    _onBufferingComplete() {
        if (!this._activeCues.length) {
            return;
        }

        this.emit("bufferingComplete");

        if (!this._isPaused()) {
            this._scheduledTask?.reuseOnErrorCacheSize();
        }
    }
}

// ─── Exports ────────────────────────────────────────────────────────────────────

export { SubtitleScheduler, SubtitleBufferingWatcher };
