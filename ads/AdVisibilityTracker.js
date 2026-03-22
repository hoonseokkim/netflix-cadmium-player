/**
 * @module AdVisibilityTracker
 * @description Tracks the visibility state of ads during playback.
 *              Monitors document visibility changes and records cumulative and
 *              continuous time spent at each visibility level. Reports ad dimensions,
 *              screen size, and fullscreen status for analytics.
 *              Original: Module_24711
 */

import { __decorate, __param } from 'tslib'; // Module 22970
import { injectable, inject as injectDecorator } from 'inversify'; // Module 22674
import { LoggerToken } from '../monitoring/LoggerToken'; // Module 87386
import { AdTrackerBase } from '../ads/AdTrackerBase'; // Module 87144

/**
 * Tracks ad visibility using the Page Visibility API.
 * Records how long ads are visible/hidden and reports screen metrics.
 */
class AdVisibilityTracker extends AdTrackerBase {
    /**
     * @param {Object} logger - Logger factory instance
     */
    constructor(logger) {
        super();

        /** @type {number} Maximum visibility level reached (0 = hidden, 1 = visible) */
        this.maxVisibility = 0;

        /** @type {number[]} Cumulative time in ms at each visibility level */
        this.cumulativeTimeByVisibilityMs = [0];

        /** @type {number[]} Maximum continuous time in ms at each visibility level */
        this.maxContinuousTimeByVisibilityMs = [0];

        /** @type {number} Current visibility state (0 = hidden, 1 = visible) */
        this.visibility = 0;

        /** @type {number|undefined} Playback segment offset when visibility last changed to visible */
        this._visibilityChangeOffset = undefined;

        /** @type {boolean} Whether currently listening for visibility changes */
        this.isListening = false;

        /**
         * Handler for document visibilitychange events.
         * Updates visibility state and tracks continuous visible time.
         */
        this.onVisibilityChange = () => {
            const isAdPresenting = this.playbackContainer.onAdPresenting.value;
            const currentState = this.playbackContainer.aB();

            if (isAdPresenting && currentState) {
                const previousVisibility = this.visibility;
                this.visibility = document.hidden ? 0 : 1;

                if (previousVisibility !== this.visibility) {
                    if (this.visibility === 1) {
                        // Became visible
                        this.maxVisibility = this.visibility;
                        this._visibilityChangeOffset = currentState.position.offset.playbackSegment;
                    } else {
                        // Became hidden - record continuous visible time
                        const visibleDuration = currentState.position.offset.playbackSegment - (this._visibilityChangeOffset || 0);
                        if (visibleDuration > this.maxContinuousTimeByVisibilityMs[0]) {
                            this.maxContinuousTimeByVisibilityMs[0] = visibleDuration;
                        }
                        this._visibilityChangeOffset = undefined;
                    }
                }
            } else {
                this.unsubscribe();
            }
        };

        this.logger = logger.createSubLogger("AdVisibilityTracker");
    }

    /**
     * Starts tracking visibility changes for the given playback state.
     * @param {Object} playerState - Current player state
     */
    start(playerState) {
        super.start(playerState);
        if (!this.isListening) {
            document.addEventListener("visibilitychange", this.onVisibilityChange);
            this.isListening = true;
        }
    }

    /**
     * Reports visibility analytics for an ad event.
     * @param {Object} eventData - Ad event data containing event type and position info
     * @returns {Object} Analytics payload with visibility, timing, and screen metrics
     */
    reportSpeedAnalytics(eventData) {
        const rect = this.playerState.containerElement.getBoundingClientRect();
        let adHeight = rect.height;
        let adWidth = rect.width;

        // On adStart, fall back to document dimensions if container has zero size
        if (eventData.event === "adStart") {
            adHeight = adHeight === 0 ? document.documentElement.clientHeight : adHeight;
            adWidth = adWidth === 0 ? document.documentElement.clientWidth : adWidth;
        }

        // Calculate continuous visible time since last visibility change
        const continuousTime = eventData.ii.offset.playbackSegment - (this._visibilityChangeOffset ?? 0);
        if (continuousTime > this.maxContinuousTimeByVisibilityMs[0]) {
            this.maxContinuousTimeByVisibilityMs[0] = continuousTime;
        }

        const isFullScreen = document.fullscreenElement
            ? true
            : screen.height === window.outerHeight && screen.width === window.outerWidth;

        this.cumulativeTimeByVisibilityMs = this.maxContinuousTimeByVisibilityMs;

        return {
            cumulativeTimeByVisibilityMs: this.cumulativeTimeByVisibilityMs,
            maxContinuousTimeByVisibilityMs: this.maxContinuousTimeByVisibilityMs,
            visibility: this.visibility,
            maxVisibility: this.maxVisibility,
            screenHeight: screen.height,
            screenWidth: screen.width,
            adHeight,
            adWidth,
            fullScreen: isFullScreen,
        };
    }

    /**
     * Resets cached visibility tracking state.
     */
    clearCache() {
        this._visibilityChangeOffset = undefined;
        this.maxContinuousTimeByVisibilityMs = [0];
        this.maxVisibility = this.visibility = document.hidden ? 0 : 1;
    }

    /**
     * Removes visibility change listener and calls parent unsubscribe.
     */
    unsubscribe() {
        super.unsubscribe();
        document.removeEventListener("visibilitychange", this.onVisibilityChange);
    }
}

export { AdVisibilityTracker };
export default AdVisibilityTracker;
