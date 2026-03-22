/**
 * Netflix Cadmium Player -- LiveAvailabilityTimeCalculator
 *
 * Calculates the live stream availability time, used to determine how far
 * ahead of the current playback position the player should fetch segments
 * for live/linear content.
 *
 * The formula accounts for encoding pipeline latency and the current wall
 * clock time to produce an adjusted availability timestamp.
 *
 * @module streaming/LiveAvailabilityTimeCalculator
 * @original Module_64141
 * @dependencies
 *   Module 66164 - platform globals (performance.now())
 */

import { platform } from '../utils/PlatformGlobals'; // Module 66164

/**
 * Calculate the live availability time for a segment.
 *
 * Formula: publishTime + fragmentDuration - (encodingPipelineTime - currentTime)
 *
 * This represents when a live segment becomes available for download,
 * accounting for encoding pipeline delay.
 *
 * @param {Object} params
 * @param {number} params.encodingPipelineTime - Encoding pipeline reference timestamp
 * @param {number} params.publishTime - When the segment was published (server time)
 * @param {number} params.fragmentDuration - Duration of the fragment
 * @param {number} [params.currentTime=platform.now()] - Current wall-clock time
 * @returns {number} Availability time in milliseconds
 */
export function calculateLiveAvailabilityTime({ encodingPipelineTime, publishTime, fragmentDuration, currentTime }) {
    const now = currentTime === undefined ? platform.platform.now() : currentTime;
    return publishTime + fragmentDuration - (encodingPipelineTime - now);
}
