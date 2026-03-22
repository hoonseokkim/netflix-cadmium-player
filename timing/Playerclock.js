/**
 * Netflix Cadmium Player - Player Clock
 * Component: PLAYERCLOCK
 *
 * Observes the underlying media element's playback state (playing,
 * paused, underflow, seeking) and provides a unified clock interface.
 * Emits events when the clock starts/stops, adjusts, or changes speed
 * so that downstream components can synchronize buffer management,
 * ABR decisions, and UI updates.
 */

// Dependencies
// import { EventEmitter } from './EventEmitter';       // webpack 90745
// import { TimeUtil } from './TimeUtil';                // webpack 91176
// import { platform } from './Platform';                // webpack 66164
// import { playbackStateEnum } from './Constants';      // webpack 65161
// import { outputList } from './Mixins';                // webpack 85254

const logger = new platform.Console("PLAYERCLOCK");

/**
 * @class PlayerClock
 * @mixes EventEmitter
 *
 * Wraps the platform player to track whether playback is running or
 * stopped, the current playback position, and the playback rate.
 * Emits:
 *   - "stopStart"       — when playback transitions between running/stopped
 *   - "clockAdjusted"   — when the clock is corrected (seek, skip, drift)
 *   - "speedChanged"    — when the playback rate changes
 */
export class PlayerClock {
    /**
     * @param {Object} player - The platform media player
     */
    constructor(player) {
        /** @type {Object} */
        this.player = player;

        /** @private @type {boolean} Whether the clock is currently running */
        this._isRunning = false;

        /** @type {ClockWatcher} Event listener manager */
        this._eventWatcher = new ClockWatcher();

        this._bindPlayerEvents();
    }

    // -- Computed properties ------------------------------------------------

    /**
     * Current playback position. When the clock is stopped, returns the
     * position at which it stopped (to avoid the element's position from
     * drifting during pause).
     *
     * @returns {TimeUtil}
     */
    get currentTime() {
        return this._frozenPosition || this.player.playbackPosition || TimeUtil.ZERO;
    }

    /**
     * Whether the clock is currently running (playing and not underflowing).
     * @returns {boolean}
     */
    get isRunning() {
        return this._isRunning;
    }

    /**
     * Current playback rate.
     * @returns {number}
     */
    get speed() {
        return this.player.playbackRate ?? 1;
    }

    // -- Public methods -----------------------------------------------------

    /**
     * Tears down the clock and removes all event listeners.
     */
    destroy() {
        this._setRunningState(false);
        this._eventWatcher.clear();
    }

    // -- Private methods ----------------------------------------------------

    /**
     * Binds listeners for player state-change events.
     * @private
     */
    _bindPlayerEvents() {
        const watcher = this._eventWatcher;

        watcher.on(this.player, "paused", () => this._setRunningState(false));
        watcher.on(this.player, "playing", () => this._setRunningState(true));
        watcher.on(this.player, "underflow", () => this._setRunningState(false));
        watcher.on(this.player, "skipped", () => this._onSkip());
        watcher.on(this.player, "clockAdjusted", () => this._onClockAdjusted());
        watcher.on(this.player, "playbackRateChanged", () => this._onPlaybackRateChanged());
    }

    /**
     * Updates the running state and emits "stopStart".
     * When stopping, freezes the current position so downstream
     * consumers see a stable timestamp.
     *
     * @private
     * @param {boolean} [running=false]
     */
    _setRunningState(running = false) {
        if (running !== this._isRunning) {
            this._isRunning = running;

            // Freeze position when stopping so it doesn't drift
            this._frozenPosition = running ? undefined : this.player.playbackPosition;

            if (running) {
                logger.log("PlayerClock: Player is running", this.player.playbackPosition);
            } else {
                logger.log("PlayerClock: Player is stopping", this.player.playbackPosition);
            }
        }

        this.emit("stopStart", { type: "stopStart" });
    }

    /**
     * Handles a skip event (e.g., ad skip or chapter skip).
     * Unfreezes the position and emits a clock adjustment.
     * @private
     */
    _onSkip() {
        this._frozenPosition = undefined;
        this._onClockAdjusted(playbackStateEnum.skipped);
    }

    /**
     * Emits a "clockAdjusted" event with the given reason.
     * @private
     * @param {number} [reason] - playbackStateEnum value
     */
    _onClockAdjusted(reason = playbackStateEnum.adjustment) {
        logger.log("PlayerClock: clock adjusted", {
            isRunning: this.isRunning,
            position: this.player.playbackPosition,
            reason: playbackStateEnum[reason],
        });

        this.emit("clockAdjusted", { type: "clockAdjusted", reason });
    }

    /**
     * Emits a "speedChanged" event when the playback rate changes.
     * @private
     */
    _onPlaybackRateChanged() {
        this.emit("speedChanged", { type: "speedChanged" });
    }
}

// Mix in EventEmitter
outputList(EventEmitter, PlayerClock);
