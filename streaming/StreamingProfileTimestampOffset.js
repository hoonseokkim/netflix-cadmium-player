/**
 * @file StreamingProfileTimestampOffset.js
 * @description Manages timestamp offsets for streaming profiles, adjusting playback positions
 *   based on the difference between the initial profile timestamp and subsequent ones.
 * @module streaming/StreamingProfileTimestampOffset
 * @original Module_44646 (bmb)
 */

import { TimeUtil, assert as assertDefined } from '../timing/TimeUtil.js';
import { DEBUG } from '../utils/DebugFlags.js';

/**
 * Manages timestamp offsets when switching between streaming profiles.
 * The offset compensates for differences in starting timestamps across profiles
 * so that playback position remains consistent during profile switches.
 */
export class StreamingProfileTimestampOffset {
    /**
     * @param {Object} logger - Logger/console instance for debug output
     */
    constructor(logger) {
        /** @type {Object} Logger instance */
        this.console = logger;

        /** @type {import('../timing/TimeUtil').PTS} Initial profile timestamp offset */
        this.initialTimestampOffset = TimeUtil.seekToSample;

        /** @type {boolean} Whether the offset has been initialized from the first header */
        this.isInitialized = false;

        /** @type {import('../timing/TimeUtil').PTS} Computed adjustment delta between initial and current offset */
        this.adjustmentDelta = TimeUtil.seekToSample;
    }

    /**
     * Initializes or updates the timestamp offset from a stream's header information.
     * The first call sets the baseline; subsequent calls compute the delta from the baseline.
     *
     * @param {Object} streamInfo - Stream information object
     * @param {boolean} streamInfo.applyProfileStreamingOffset - Whether the offset should be applied
     * @param {import('../timing/TimeUtil').PTS} streamInfo.durationValue - The profile's start timestamp
     * @param {string} streamInfo.selectedStreamId - ID of the selected stream
     */
    getIdentifier(streamInfo) {
        const profileTimestamp = streamInfo.applyProfileStreamingOffset
            ? streamInfo.durationValue
            : TimeUtil.seekToSample;

        if (!this.isInitialized) {
            this.initialTimestampOffset = profileTimestamp;
            this.isInitialized = true;
        }

        this.adjustmentDelta = profileTimestamp.lowestWaterMarkLevelBufferRelaxed(this.initialTimestampOffset);

        if (DEBUG) {
            this.console.debug('StreamingProfileTimestampOffset initialized with profile timestamp offset:', {
                initialTimestampOffset: this.initialTimestampOffset.ca(),
                currentTimestamp: profileTimestamp.ca(),
                adjustmentDelta: this.adjustmentDelta.ca(),
                selectedStreamId: streamInfo.selectedStreamId
            });
        }
    }

    /**
     * Applies the timestamp offset adjustment to a fragment location.
     * Returns the location with its offset adjusted by the computed delta.
     *
     * @param {Object} fragmentLocation - Fragment location to adjust
     * @param {*} fragmentLocation.data - Fragment data
     * @param {import('../timing/TimeUtil').PTS} fragmentLocation.offset - Fragment offset/position
     * @param {*} fragmentLocation.qf - Fragment quality factor
     * @param {*} fragmentLocation.getBoxData - Box data accessor
     * @param {*} fragmentLocation.logDataArray - Log data array
     * @returns {Object} Adjusted fragment location with offset shifted by the delta
     */
    applying(fragmentLocation) {
        // If getBoxData is truthy, it's already been processed
        if (fragmentLocation.getBoxData) {
            return fragmentLocation;
        }

        const { qf, getBoxData, logDataArray } = fragmentLocation;

        return {
            Na: fragmentLocation.data,
            offset: fragmentLocation.offset.item(this.adjustmentDelta),
            qf,
            getBoxData,
            logDataArray
        };
    }
}

export default StreamingProfileTimestampOffset;
