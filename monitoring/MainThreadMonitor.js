/**
 * Netflix Cadmium Player - Main Thread Monitor
 *
 * Monitors main thread responsiveness by polling at a configured rate and
 * tracking how many callbacks fire per time bucket. Generates a "busyness"
 * score (0-9) for each interval, where 0 = fully responsive and 9 = unresponsive.
 *
 * Used to detect UI thread starvation that could affect playback quality.
 *
 * @module MainThreadMonitor
 * @see Module_99732
 */

import { config as appConfig } from '../core/AppConfig.js';
import { segmentDurationMs, SUCCESS } from '../monitoring/MonitoringConstants.js';
import { jy as getTimestamp } from '../timing/TimingUtils.js';
import { ea as ComponentEvents } from '../core/ComponentEvents.js';
import { uX as floorValue, kG as clampMin, compareTimeRanges } from '../utils/MathUtils.js';
import { UYa as isValidPollRate } from '../utils/ValidationUtils.js';
import { disposableList } from '../core/DisposableList.js';
import { vk as MonitorToken } from '../monitoring/MonitorToken.js';

/**
 * Registers the main thread monitor component.
 * Sets up an interval-based polling mechanism that tracks how many times
 * the callback fires per time bucket, then converts that to a responsiveness score.
 */
disposableList.key(MonitorToken).register(ComponentEvents.INIT_COMPONENT_MAINTHREADMONITOR, (done) => {
    const pollRate = appConfig.mainThreadMonitorPollRate;
    const scoreFactor = -6 / (pollRate - 2 - 2);
    const bucketDuration = segmentDurationMs;

    /** @type {number[]} Array of poll counts per time bucket */
    const pollCounts = [];

    /** @type {number} Current time bucket index */
    let currentBucket = getCurrentBucket();

    /**
     * Gets the current time bucket index.
     * @returns {number} Current bucket index
     */
    function getCurrentBucket() {
        return floorValue(getTimestamp() / bucketDuration);
    }

    /**
     * Records a poll tick, advancing buckets as needed and incrementing the counter.
     */
    function recordPoll() {
        const bucket = getCurrentBucket();
        if (bucket !== currentBucket) {
            // Fill in missed buckets with zeros
            for (let missed = clampMin(bucket - currentBucket, 30); missed--;) {
                pollCounts.push(0);
            }
            // Trim old buckets (keep last 31)
            const overflow = compareTimeRanges(pollCounts.length - 31, 0);
            if (overflow) {
                pollCounts.splice(0, overflow);
            }
            currentBucket = bucket;
        }
        pollCounts[pollCounts.length - 1]++;
    }

    if (isValidPollRate(pollRate)) {
        setInterval(recordPoll, 1000 / pollRate);

        /**
         * Exported monitor API providing thread responsiveness scores.
         * @type {Object}
         */
        exports.IIb = {
            /**
             * Returns an array of responsiveness scores (0-9) for recent time buckets.
             * 0 = fully responsive (poll count near expected rate)
             * 9 = completely unresponsive (no polls recorded)
             *
             * @returns {number[]} Array of responsiveness scores
             */
            getResponsivenessScores() {
                const scores = [];
                for (let i = pollCounts.length - 1; i--;) {
                    const count = pollCounts[i];
                    if (count <= 0) {
                        scores.unshift(9);
                    } else if (count <= 1) {
                        scores.unshift(8);
                    } else if (count >= pollRate - 1) {
                        scores.unshift(0);
                    } else {
                        scores.unshift(floorValue((count - 2) * scoreFactor + 7));
                    }
                }
                return scores;
            },
        };
    }

    done(SUCCESS);
});
