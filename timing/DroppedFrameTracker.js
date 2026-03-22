/**
 * @module DroppedFrameTracker
 * @description Tracks total dropped video frames over time using a time-callback
 * function (typically from HTMLVideoElement.getVideoPlaybackQuality). Handles
 * counter resets (e.g., on source change), pause/resume tracking, and provides
 * the current dropped frame delta.
 * @see Module_55099
 */

import { wc as isNumber } from '../utils/TypeChecks.js';

/**
 * Tracks dropped video frames by periodically sampling a counter callback.
 * Supports pause/resume to exclude frames dropped during paused state.
 */
export class DroppedFrameTracker {
    /**
     * @param {Function} timeCallback - Returns the current total dropped frame count
     *   (e.g., from VideoPlaybackQuality.droppedVideoFrames).
     */
    constructor(timeCallback) {
        /** @private */
        this.timeCallback = timeCallback;
        /** @private @type {boolean} */
        this.hasReceivedValue = false;
        /** @private @type {number} */
        this.accumulatedOffset = 0;
        /** @private @type {number} */
        this.lastRawValue = 0;
        /** @private @type {number} */
        this.pauseOffset = 0;
        /** @private @type {boolean} */
        this.isPaused = false;
        /** @private @type {number} */
        this.pauseSnapshot = 0;
    }

    /**
     * Records a new raw dropped frame count. Handles counter resets
     * by accumulating the previous value as an offset.
     * @param {number} rawValue - Current raw dropped frame count.
     */
    recordDroppedFrames(rawValue) {
        if (rawValue < this.lastRawValue) {
            this.accumulatedOffset += this.lastRawValue;
        }
        this.lastRawValue = rawValue;
        this.hasReceivedValue = true;
    }

    /**
     * Returns the total number of dropped frames since tracking began,
     * minus any frames dropped during paused periods.
     * @returns {number|undefined} Total adjusted dropped frames, or undefined if no data.
     */
    getTotalDroppedFrames() {
        if (!this.hasReceivedValue) return undefined;
        if (this.isPaused) {
            return this.pauseSnapshot - this.pauseOffset;
        }
        return this.accumulatedOffset + this.lastRawValue - this.pauseOffset;
    }

    /**
     * Refreshes the tracker by sampling the callback for the latest value.
     */
    refresh() {
        const value = this.timeCallback();
        if (isNumber(value)) {
            this.recordDroppedFrames(value);
        }
    }

    /**
     * Pauses tracking. Frames dropped while paused will be excluded
     * from the total count when resumed.
     */
    pause() {
        if (!this.isPaused) {
            if (this.hasReceivedValue) {
                this.pauseSnapshot = this.accumulatedOffset + this.lastRawValue;
            }
            this.isPaused = true;
        }
    }

    /**
     * Resumes tracking after a pause. Adjusts the offset to exclude
     * frames dropped during the paused period.
     */
    resume() {
        if (this.isPaused) {
            if (this.hasReceivedValue) {
                this.pauseOffset += this.accumulatedOffset + this.lastRawValue - this.pauseSnapshot;
            }
            this.pauseSnapshot = 0;
            this.isPaused = false;
        }
    }
}
