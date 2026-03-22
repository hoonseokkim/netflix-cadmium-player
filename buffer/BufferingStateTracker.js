/**
 * Netflix Cadmium Player - BufferingStateTracker
 *
 * Manages the buffering lifecycle for the streaming player. Tracks prebuffer
 * progress, emits buffering start/progress/complete events, and runs a network
 * timeout watchdog that forces a streaming failure when data has not been
 * received within the configured threshold.
 *
 * @module BufferingStateTracker
 * @original Webpack Module 25510 (export `pab`)
 */

// Module 22970 - tslib helpers (__assign, __generator, __decorate, __spreadArray)
import { __assign, __generator, __decorate } from '../modules/Module_22970.js';
// Module 91176 - Observable utilities and TimeUtil
import { observableBool, TimeUtil } from '../modules/Module_91176.js';
// Module 66164 - Platform abstraction (platform.now(), etc.)
import { platform } from '../modules/Module_66164.js';
// Module 97685 - Laser logging / telemetry
import { laser } from '../modules/Module_97685.js';
// Module 65161 - PlaybackState enum, MediaType enum, timeSlice helper
import { PlaybackState, MediaType, timeSlice } from '../modules/Module_65161.js';
// Module 52571 - Assertion utility
import { assert } from '../modules/Module_52571.js';
// Module 61996 - Session metrics / diagnostics / consoleLogger decorator
import { SessionMetricsClass, consoleLogger } from '../modules/Module_61996.js';
// Module 40666 - Scheduled-task helpers (ie.manifestUrlFetch, completionState)
import { ie, completionState } from '../modules/Module_40666.js';

/**
 * Tracks the buffering state of the player, coordinating prebuffer progress
 * computation, event emission, and a network-timeout watchdog that will
 * abort playback when no data arrives for too long.
 */
export class BufferingStateTracker {
    /**
     * @param {Object} console             - Logging / trace console.
     * @param {Object} config              - Playback configuration bag.
     * @param {Object} networkMonitor      - Provides `oHb` (last data-received timestamp).
     * @param {Object} events              - Event emitter for buffering lifecycle events.
     * @param {Function} _reportStreamingFailure - Callback invoked on fatal buffering timeout.
     * @param {string} playgraphId         - Unique identifier for the current play-graph session.
     * @param {Object} taskScheduler       - Scheduler for timers and periodic tasks.
     * @param {number} [notificationIntervalMs=500] - Interval (ms) for buffering progress notifications.
     */
    constructor(
        console,
        config,
        networkMonitor,
        events,
        _reportStreamingFailure,
        playgraphId,
        taskScheduler,
        notificationIntervalMs = 500
    ) {
        this.console = console;
        this.config = config;
        this.networkMonitor = networkMonitor;
        this.events = events;
        this._reportStreamingFailure = _reportStreamingFailure;
        this.playgraphId = playgraphId;
        this.taskScheduler = taskScheduler;
        this._notificationIntervalMs = notificationIntervalMs;

        /** @type {number} Timestamp of the last rebuffer completion */
        this._lastRebufferCompleteTime = 0;
        /** @type {number} Timestamp of the most recent seek */
        this._seekTimestamp = 0;
        /** @type {number} Timestamp when the current buffering phase started */
        this._bufferingStartTime = 0;

        /** @type {string[]} Media types that have hit the memory limit */
        this._memoryLimitMediaTypes = [];

        /** @private Network error stats */
        this._errorStats = { criticalErrorCount: 0 };

        /** @type {import('../modules/Module_91176.js').observableBool} Observable playback state */
        this.state = new observableBool(PlaybackState.STOPPED);

        /** @type {import('../modules/Module_61996.js').SessionMetricsClass} Diagnostics tracer */
        this.diagnosticsTracer = new SessionMetricsClass({
            Ig: 10,
            engineRef: this,
            source: 'BufferStateTracker',
            grb: () => ({ isBuffering: this.isBuffering }),
        });
    }

    // ──────────────────────────────────────────────
    //  Computed properties
    // ──────────────────────────────────────────────

    /** @returns {number} Count of critical network errors during this buffering phase. */
    get criticalErrorCount() {
        return this._errorStats.criticalErrorCount;
    }

    /** @returns {boolean} Whether the player is currently in a time-slice (buffering) state. */
    get Io() {
        return timeSlice(this.state.value);
    }

    // ──────────────────────────────────────────────
    //  Public API
    // ──────────────────────────────────────────────

    /**
     * Record the audio track info from the given track descriptor(s).
     * @param {Object|Object[]} tracks - One or more track descriptors.
     */
    _updateAudioTrackInfo(tracks) {
        if (!Array.isArray(tracks)) {
            tracks = [tracks];
        }
        tracks.forEach((track) => {
            if (track.mediaType === MediaType.V) {
                this.dtb = {
                    ...this.dtb,
                    audio: {
                        trackId: track.trackId,
                        trackIndex: track.trackIndex,
                    },
                };
            }
        });
    }

    /**
     * Record a seek timestamp (called when the user seeks).
     */
    onSeek() {
        this._seekTimestamp = platform.platform.now();
    }

    /**
     * Start buffering for the given position (initial load or position update).
     * @param {number} position - The playback position to buffer from.
     */
    updatePosition(position) {
        this._setState(PlaybackState.STOPPED);
        this._startBuffering(position, PlaybackState.BUFFERING);
    }

    /**
     * Increment the critical-error counter (called on unrecoverable network errors).
     */
    onCriticalNetworkError() {
        this._errorStats.criticalErrorCount++;
    }

    /**
     * Handle a temporary network error.  If the player is currently in the
     * initial-buffering state and no data has been received for longer than
     * `config.networkFailureAbandonMs`, a streaming failure is reported.
     *
     * @param {Object} errorEvent - Network error descriptor.
     */
    onTemporaryNetworkError(errorEvent) {
        this._lastNetworkError = {
            Mk: errorEvent.httpCode,
            errorCode: errorEvent.errorCode,
            dh: errorEvent.dh,
        };

        if (
            errorEvent.type === 'temporaryNetworkError' &&
            this.state.value === PlaybackState.BUFFERING
        ) {
            const lastSuccess = this.networkMonitor.oHb || 0;
            if (platform.platform.now() - lastSuccess >= this.config.networkFailureAbandonMs) {
                this._reportStreamingFailure(
                    'BufferingStateTracker: Temporary failure while buffering',
                    'NFErr_MC_StreamingFailure',
                    this._lastNetworkError
                );
            }
        }
    }

    /**
     * Clear the cached network error when a successful network event is received.
     */
    onUpdatingLastSuccessEvent() {
        this._lastNetworkError = undefined;
    }

    /**
     * Trigger a rebuffering phase (underflow).  No-op if already buffering.
     * @param {number} position - Current playback position.
     */
    setup(position) {
        if (!this.isBuffering) {
            this._startBuffering(position, PlaybackState.REBUFFERING);
        }
    }

    /**
     * Handle a track-switch event.  Enters TRACK_SWITCH buffering if not
     * already in the initial BUFFERING state.
     *
     * @param {number} position - Current playback position.
     * @param {Object|Object[]} tracks - Track descriptor(s) for the new selection.
     */
    onTrackSwitch(position, tracks) {
        if (this.state.value !== PlaybackState.BUFFERING) {
            this._startBuffering(position, PlaybackState.TRACK_SWITCH);
        }
        this._updateAudioTrackInfo(tracks);
    }

    /**
     * Handle a memory-limit signal for a given media type.  When both media
     * types have reported memory limits, buffering is completed early.
     *
     * @param {string} mediaType - The media type that hit its limit.
     * @param {Object} bufferLevels - Contains `prefetchedAudioMs` and `prefetchedVideoMs`.
     */
    onMemoryLimitReached(mediaType, bufferLevels) {
        if (!this.config.bufferingCompleteOnMemoryLimit || !this.isBuffering) return;

        if (this._memoryLimitMediaTypes.indexOf(mediaType) === -1) {
            this._memoryLimitMediaTypes.push(mediaType);
        }

        if (this._memoryLimitMediaTypes.length === 2) {
            Promise.resolve().then(() => {
                if (this.isBuffering && this.actualStartPosition !== undefined) {
                    this.bufferingCompleteHandler(
                        'memoryLimit',
                        bufferLevels.prefetchedAudioMs,
                        bufferLevels.prefetchedVideoMs
                    );
                }
            });
        }
    }

    /**
     * Called when the actual start position is resolved and the initial audio
     * track is known.  Logs laser telemetry for the PAUSED / BUFFERING states.
     *
     * @param {number} startPosition - Resolved start position.
     * @param {Object} [audioTrack] - Initial audio track descriptor.
     */
    onStartPositionResolved(startPosition, audioTrack) {
        assert(
            this.state.value === PlaybackState.BUFFERING &&
            this.actualStartPosition === undefined
        );

        this.actualStartPosition = startPosition;

        if (audioTrack) {
            this.events.emit('initialAudioTrack', {
                type: 'initialAudioTrack',
                trackId: audioTrack.trackId,
                trackIndex: audioTrack.trackIndex,
            });
            this._updateAudioTrackInfo(audioTrack);
        }

        if (laser.isEnabled) {
            laser.log({
                playgraphId: this.playgraphId,
                type: 'PRESENTING_STATE_CHANGE',
                state: 'PAUSED',
            });
            laser.log({
                playgraphId: this.playgraphId,
                type: 'STREAMING_STATE_CHANGE',
                state: 'BUFFERING',
            });
        }
    }

    /**
     * Update the initial stream-selection metadata while buffering.
     *
     * @param {*} [selector]      - Stream selector reference.
     * @param {number} [initBitrate] - Initial bitrate chosen.
     * @param {string} [initSelReason] - Reason for the initial selection.
     */
    updateInitialSelection(selector, initBitrate, initSelReason) {
        assert(this.isBuffering);
        this.selector = selector ?? this.selector;
        this.initBitrate = initBitrate ?? this.initBitrate;
        this.initSelReason = initSelReason || this.initSelReason;
    }

    /**
     * Finalize the buffering phase: emit the completion event, transition to
     * STREAMING, and clean up timers.
     *
     * @param {string} reason              - Why buffering completed (e.g. "prebufferFilled", "memoryLimit").
     * @param {number} prefetchedAudioMs   - Audio buffer level at completion (ms).
     * @param {number} prefetchedVideoMs   - Video buffer level at completion (ms).
     */
    bufferingCompleteHandler(reason, prefetchedAudioMs, prefetchedVideoMs) {
        assert(
            this.isBuffering &&
            this.actualStartPosition !== undefined &&
            this.reason === undefined &&
            this.bcVBufferLevelMs === undefined &&
            this.bcABufferLevelMs === undefined
        );

        this.reason = reason;
        this.bcVBufferLevelMs = prefetchedAudioMs;
        this.bcABufferLevelMs = prefetchedVideoMs;
        this.percentage = 100;

        this._stopProgressNotifier();
        this._destroyBufferingTimeoutTask();
        this._deferredCheckTask?.destroy();

        if (this.state.value === PlaybackState.REBUFFERING) {
            this._lastRebufferCompleteTime = platform.platform.now();
        }

        this._emitBufferingCompleteEvent();
        this._setState(PlaybackState.STREAMING);

        // Reset transient buffering state
        this.bcABufferLevelMs = undefined;
        this.bcVBufferLevelMs = undefined;
        this.reason = undefined;
        this.initSelReason = undefined;
        this.initBitrate = undefined;
        this.selector = undefined;
        this.actualStartPosition = undefined;
    }

    /**
     * Stop tracking: transition to STOPPED and tear down all timers.
     */
    aseTimer() {
        this._setState(PlaybackState.STOPPED);
        this._stopProgressNotifier();
        this._destroyBufferingTimeoutTask();
        this._deferredCheckTask?.destroy();
    }

    /**
     * Check whether buffering is complete by evaluating the current selectee
     * state for both audio and video streams.  If a minimum rebuffer interval
     * has not yet elapsed, the check is deferred.
     *
     * @param {number} position            - Current playback position.
     * @param {*} selectionHint            - Hint passed to the prebuffer-check logic.
     * @param {Object} streamSelector      - Provides `noop(mediaType)` to get current selectees.
     * @param {Object} prebufferChecker    - Evaluates prebuffer completeness via `lpa()`.
     */
    checkBufferingComplete(position, selectionHint, streamSelector, prebufferChecker) {
        assert(this.isBuffering);

        // Cancel any outstanding deferred check
        this._deferredCheckTask?.destroy();

        // Enforce minimum interval between rebuffer completions
        if (
            this.state.value === PlaybackState.REBUFFERING &&
            platform.platform.now() < this._lastRebufferCompleteTime + this.config.minimumBufferingCompleteInterval
        ) {
            const remainingMs =
                this.config.minimumBufferingCompleteInterval -
                (platform.platform.now() - this._lastRebufferCompleteTime);

            this._deferredCheckTask = this.taskScheduler.uu(
                ie.manifestUrlFetch(TimeUtil.fromMilliseconds(remainingMs)),
                () => {
                    this.checkBufferingComplete(position, selectionHint, streamSelector, prebufferChecker);
                }
            );
            return;
        }

        const videoSelectee = streamSelector.noop(MediaType.V);
        const audioSelectee = streamSelector.noop(MediaType.U);
        const elapsedMs = platform.platform.now() - Math.max(this._bufferingStartTime, this._seekTimestamp);

        if (!videoSelectee && !audioSelectee) return;

        /**
         * Evaluate whether a single selectee's prebuffer is complete.
         * @param {Object|null} selectee
         * @returns {{ complete: boolean, reason: string, hw?: number }}
         */
        const evaluateSelectee = (selectee) => {
            if (!selectee) {
                return { complete: true, reason: 'noSelectee' };
            }
            if (selectee.isLastSegmentFlag() || selectee.getPointer()) {
                return prebufferChecker.lpa(
                    this.state.value,
                    position,
                    elapsedMs >= this.config.prebufferTimeLimit,
                    selectionHint,
                    selectee,
                    this.criticalErrorCount
                );
            }
            return { complete: false, reason: 'selecteeNotStreamable' };
        };

        const videoResult = evaluateSelectee(videoSelectee);
        const audioResult = evaluateSelectee(audioSelectee);

        /** Summarize a result for diagnostics */
        const summarize = (result) => ({
            reason: result.reason,
            complete: result.complete,
            bl: result.hw ?? 0,
        });

        this.diagnosticsTracer.emitDiagnosticEvent({
            as: summarize(videoResult),
            vs: summarize(audioResult),
            bt: elapsedMs,
        });

        // Use audio result as primary when audio selectee exists, else video
        const primaryResult = audioSelectee ? audioResult : videoResult;
        primaryResult.f4c = audioSelectee && audioResult.hw || 0;
        primaryResult.hdc = videoSelectee && videoResult.hw || 0;

        if (videoResult.complete && audioResult.complete) {
            primaryResult.complete = true;
            this.bufferingCompleteHandler(
                primaryResult.reason ?? 'unknown',
                primaryResult.f4c ?? 0,
                primaryResult.hdc ?? 0
            );
        } else {
            primaryResult.complete = false;
            this._updateBufferingProgress(primaryResult);
            this.diagnosticsTracer.emitDiagnosticEvent({
                bp: this.percentage,
            });
        }
    }

    // ──────────────────────────────────────────────
    //  Private helpers
    // ──────────────────────────────────────────────

    /**
     * Compute and update the buffering progress percentage (0-99).
     * @param {Object} status - Prebuffer status with optional `progress`, `internal_Xda`, `hw` fields.
     * @private
     */
    _updateBufferingProgress(status) {
        let ratio = status.progress;

        if (status.internal_Xda) {
            // Time-based progress: elapsed / limit
            ratio = (platform.platform.now() - Math.max(this._bufferingStartTime, this._seekTimestamp)) /
                this.config.prebufferTimeLimit;
        } else if (!ratio) {
            // Size-based progress: buffered / target
            ratio = (status.hw ?? 0) / this.config.minPrebufSize;
        }

        const newPercentage = Math.min(
            Math.max(Math.round(100 * ratio), this.percentage ?? 0),
            99
        );

        if (newPercentage !== this.percentage) {
            this.percentage = newPercentage;
        }
    }

    /**
     * Enter a buffering state, reset counters, emit the started event, and
     * optionally create the network-timeout watchdog.
     *
     * @param {number|undefined} position - Playback position (may be undefined for initial BUFFERING).
     * @param {string} targetState - One of PlaybackState.BUFFERING, REBUFFERING, TRACK_SWITCH.
     * @private
     */
    _startBuffering(position, targetState) {
        assert(targetState === PlaybackState.BUFFERING || position !== undefined);

        this.actualStartPosition = position;
        this.percentage = 0;
        this._lastEmittedPercentage = undefined;
        this._errorStats.criticalErrorCount = 0;
        this._memoryLimitMediaTypes = [];

        const wasAlreadyBuffering =
            this.state.value === PlaybackState.BUFFERING ||
            this.state.value === PlaybackState.REBUFFERING;

        this._bufferingStartTime = platform.platform.now();
        this._setState(targetState);

        if (!wasAlreadyBuffering) {
            this._emitBufferingStartedEvent();
        }

        if (this.isBuffering) {
            this._startProgressNotifier();
            if (targetState === PlaybackState.REBUFFERING || this.config.replicateErrorDirectorInitialBuffering) {
                this._createBufferingTimeoutTask();
            }
        }
    }

    /**
     * Set the playback state on the observable.
     * @param {string} newState
     * @private
     */
    _setState(newState) {
        this.state.set(newState);
    }

    /**
     * Emit a "bufferingStarted" event.
     * @private
     */
    _emitBufferingStartedEvent() {
        assert(this.events && this.percentage !== undefined);
        this._lastEmittedPercentage = this.percentage;
        this.events.emit('bufferingStarted', {
            type: 'bufferingStarted',
            platform: platform.platform.now(),
            percentage: this.percentage,
        });
    }

    /**
     * Start a periodic notifier that emits "buffering" progress events.
     * @private
     */
    _startProgressNotifier() {
        this._stopProgressNotifier();
        this._progressNotifierTask = this.taskScheduler.startMonitoring(
            () => this._emitBufferingProgressEvent(),
            TimeUtil.fromMilliseconds(this._notificationIntervalMs),
            'buffering-notification'
        );
    }

    /**
     * Stop the periodic progress notifier.
     * @private
     */
    _stopProgressNotifier() {
        this._progressNotifierTask?.destroy();
    }

    /**
     * Emit a "buffering" progress event if the percentage has changed since
     * the last emission.
     * @private
     */
    _emitBufferingProgressEvent() {
        if (
            this.isBuffering &&
            this.events &&
            this.percentage !== undefined &&
            this.percentage !== this._lastEmittedPercentage
        ) {
            if (this.events.emit('buffering', {
                type: 'buffering',
                platform: platform.platform.now(),
                percentage: this.percentage,
            })) {
                this._lastEmittedPercentage = this.percentage;
            }
        }
    }

    /**
     * Emit a "bufferingComplete" event with all relevant metadata.
     * @private
     */
    _emitBufferingCompleteEvent() {
        assert(
            this.events &&
            this.actualStartPosition &&
            this.reason !== undefined &&
            this.bcABufferLevelMs !== undefined &&
            this.bcVBufferLevelMs !== undefined
        );

        this._lastEmittedPercentage = this.percentage;

        const eventData = {
            type: 'bufferingComplete',
            platform: platform.platform.now(),
            actualStartPosition: this.actualStartPosition,
            reason: this.reason,
            bcABufferLevelMs: this.bcABufferLevelMs,
            bcVBufferLevelMs: this.bcVBufferLevelMs,
            selector: this.selector,
            initBitrate: this.initBitrate,
            initSelReason: this.initSelReason,
            ...this.dtb,
        };

        this.events.emit('bufferingComplete', eventData);
    }

    /**
     * Create (or reuse) the network-timeout watchdog task.  The task
     * periodically checks whether data has been received; if not, it forces
     * a streaming failure.
     * @private
     */
    _createBufferingTimeoutTask() {
        if (this._timeoutTask) {
            if (
                this._timeoutTask.state === completionState.complete ||
                this._timeoutTask.state === completionState.destroyed
            ) {
                this._timeoutTask.reuseOnErrorCacheSize();
                return;
            }
            // Task already running -- nothing to do
            return;
        }

        this._timeoutTask = this.taskScheduler.createScheduledTask(
            () => this._bufferingTimeoutTaskRunner(),
            'bufferingTimeoutTask'
        );
    }

    /**
     * Destroy the network-timeout watchdog task if it exists.
     * @private
     */
    _destroyBufferingTimeoutTask() {
        if (this._timeoutTask) {
            if (this._timeoutTask.state !== completionState.destroyed) {
                this._timeoutTask.destroy();
            }
            this._timeoutTask = undefined;
        }
    }

    /**
     * Generator-based watchdog that waits for `config.maxBufferingTimeAllowedWithNetworkError`
     * ms, then checks whether any data has arrived.  If the gap since the last
     * received data exceeds the threshold the player is forced into a streaming
     * failure state.  Otherwise the loop repeats with the remaining time.
     *
     * @generator
     * @private
     */
    *_bufferingTimeoutTaskRunner() {
        const maxWaitMs = this.config.maxBufferingTimeAllowedWithNetworkError;

        this.console.pauseTrace(`BufferingStateTracker: starting buffering timer: ${maxWaitMs}ms`);
        yield ie.manifestUrlFetch(TimeUtil.fromMilliseconds(maxWaitMs));

        while (this.isBuffering) {
            const lastSuccess = this.networkMonitor.oHb || 0;
            const silenceMs = platform.platform.now() - lastSuccess;

            if (silenceMs >= maxWaitMs) {
                this.console.pauseTrace(`Forcing streaming failure, ${silenceMs}ms since data received`);
                this._reportStreamingFailure(
                    'BufferingStateTracker: Temporary failure while buffering',
                    'NFErr_MC_StreamingFailure',
                    this._lastNetworkError
                );
                return;
            }

            this.console.pauseTrace(
                `BufferingStateTracker: network activity, wait ${maxWaitMs - silenceMs}ms`
            );
            yield ie.manifestUrlFetch(TimeUtil.fromMilliseconds(maxWaitMs - silenceMs));
        }
    }
}
