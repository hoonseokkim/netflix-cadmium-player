/**
 * Low Network Activity (LNA) Manager
 *
 * Controls the player's Low Network Activity mode, which reduces
 * network usage during periods of inactivity (e.g. idle/paused
 * playback, background tabs). LNA mode is triggered by server-side
 * signals and suppresses certain categories of network traffic
 * (stream changes, debug logs, CDN selection, network stats, mid-play
 * requests) to save bandwidth.
 *
 * LNA has three severity levels: LOW, MEDIUM, HIGH. Higher levels
 * suppress more activity (e.g. HIGH blocks load-in-progress, MEDIUM
 * blocks additional operations).
 *
 * @module LowNetworkActivityManager
 * @source Module_95735
 */

import { __decorate } from '../core/ReflectMetadataPolyfill';
import { r7 as LnaLevel } from '../core/ErrorCodeEnums';
import { injectable } from '../ioc/ComponentDependencyResolver';
import { config } from '../config/PlayerConfiguration';
import { assert } from '../assert/Assert';

class LowNetworkActivityManager {
    constructor() {
        /** Whether LNA mode is currently active. */
        this.isLnaActive = false;

        /** Current LNA severity level. */
        this.lnaLevel = LnaLevel.LOW;

        /** Categories of network activity suppressed during LNA. */
        this.suppressedCategories = [
            "chgstrm",   // stream changes
            "debug",     // debug traffic
            "cdnsel",    // CDN selection
            "netstats",  // network statistics
            "midplay"    // mid-play requests
        ];
    }

    /**
     * Enter LNA mode after a specified delay.
     *
     * @param {Object} options
     * @param {number} options.duration      - Duration (ms) of LNA mode.
     * @param {number} options.lnaStartTime  - Delay (ms) before activating LNA.
     * @param {string} [options.level]       - LNA severity level (LOW/MEDIUM/HIGH).
     * @param {string[]} [options.platform]  - Target platforms; skipped if not "web".
     */
    _enterLnaMode(options) {
        const self = this;
        const duration = options.duration;
        const startDelay = options.lnaStartTime;
        const level = options.level;

        assert(duration !== undefined && duration > 0, "Unexpected or undefined duration value");
        assert(startDelay !== undefined && startDelay > 0, "Unexpected or undefined start time value");

        // Skip if not targeting web platform or if LNA is force-disabled
        if ((options.platform && !options.platform.includes("web")) || config.forceDisableLNA) {
            return;
        }

        this.lnaLevel = level !== null && level !== undefined ? level : LnaLevel.LOW;

        setTimeout(function () {
            self.isLnaActive = true;
            self._scheduleExit({ lnaStopTime: duration });
        }, startDelay);
    }

    /**
     * Schedule exiting LNA mode after the given stop time (plus random jitter).
     *
     * @param {Object} options
     * @param {number} options.lnaStopTime - Time (ms) until LNA mode should end.
     */
    _scheduleExit(options) {
        const self = this;
        const stopTime = options.lnaStopTime;

        assert(stopTime !== undefined && stopTime > 0, "Unexpected or undefined stop time value");

        const jitter = Math.floor(Math.random() * config.lnaModeJitterMs) + 1;

        if (this._exitTimer) {
            clearTimeout(this._exitTimer);
        }

        this._exitTimer = setTimeout(function () {
            if (self.isLnaActive) {
                self.isLnaActive = false;
                self._exitTimer = undefined;
            }
        }, stopTime + jitter);
    }

    /**
     * Process an LNA-related event from the server.
     *
     * Handles three event types:
     * - "enterLNAMode": enter LNA with the provided payload.
     * - "exitLNAMode":  schedule an early LNA exit.
     * - "lna":          legacy format with start/end/current timestamps.
     *
     * @param {Object} event - LNA event descriptor.
     */
    processLnaEvent(event) {
        if (event.type === "enterLNAMode" && event.payload) {
            this._enterLnaMode(event.payload);
        } else if (event.type === "exitLNAMode" && event.payload) {
            this._scheduleExit(event.payload);
        } else if (event.type === "lna") {
            const startTime = event.lnaStartTime;
            const endTime = event.lnaEndTime;
            const serverTime = event.serverCurrTime;
            const level = event.level;

            if (startTime && endTime && serverTime) {
                const remainingDuration = Math.min(endTime - serverTime, config.maxLNADuration);
                if (serverTime < endTime && serverTime > startTime) {
                    this._enterLnaMode({
                        lnaStartTime: 1,
                        duration: remainingDuration,
                        level: level
                    });
                }
            }
        }
    }

    /**
     * Whether a high-priority network load is currently blocked by LNA.
     * Only blocks at HIGH severity.
     */
    isLoadInProgress() {
        return this.isLnaActive && this.lnaLevel === LnaLevel.HIGH;
    }

    /**
     * Whether medium-or-higher priority operations are blocked.
     */
    isMediumOrHighBlocked() {
        return this.isLnaActive && (this.lnaLevel === LnaLevel.MEDIUM || this.lnaLevel === LnaLevel.HIGH);
    }

    /**
     * Check if a specific activity category is suppressed during LNA.
     * @param {string} category - Category name to check.
     * @returns {boolean}
     */
    isCategorySuppressed(category) {
        return this.isLnaActive && this.suppressedCategories.includes(category);
    }

    /** Whether LNA mode is currently active. */
    get isActive() {
        return this.isLnaActive;
    }
}

export { LowNetworkActivityManager };

// IoC registration
LowNetworkActivityManager = __decorate([
    injectable()
], LowNetworkActivityManager);
