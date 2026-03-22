/**
 * Netflix Cadmium Player - Audio Fragment Trimmer
 * Deobfuscated from Module_82924
 *
 * Processes audio media fragments to trim frames based on timing constraints.
 * Uses codec profile information and frame duration to calculate how many
 * audio frames to include in a fragment, trimming from the beginning or end
 * as needed to align with playback timing.
 *
 * This is distinct from AudioMediaFragmentEditor (Module_75811) which handles
 * fade curves and MP4 box editing. This class handles the higher-level decision
 * of how many frames to keep/skip per fragment.
 *
 * Key operations:
 *   - Calculates frame counts using scaled time values
 *   - Determines trim points based on presentation start time and segment boundaries
 *   - Enforces minimum audio frames per fragment from config
 *   - Handles pre-roll (p0a) for gapless audio transitions
 */

import { TimeUtil } from "../core/TimeUtil"; // Module 91176
import { GCb as getCodecProfileConfig } from "../media/CodecProfileConfig"; // Module 7559

class AudioFragmentTrimmer {
    /**
     * @param {Object} config - Editor configuration including minimumAudioFramesPerFragment
     * @param {Object} codecProfilesMap - Map of codec profiles
     * @param {Object} console - Console/logger instance
     */
    constructor(config, codecProfilesMap, console) {
        this.config = config;
        this.codecProfilesMap = codecProfilesMap;
        this.console = console;
    }

    /**
     * Set the frame duration for calculations.
     * @param {Object} trackInfo - Track info containing frameDuration
     */
    setTrackInfo(trackInfo) {
        this.frameDuration = trackInfo.frameDuration;
    }

    /**
     * Apply fragment trimming to determine how many frames to keep.
     *
     * @param {Object} fragment - Fragment data to process
     * @param {Object} context - Playback context with pre-roll info (p0a)
     * @returns {Object} Edited fragment descriptor with trim information
     */
    applyTrimming(fragment, context) {
        // Already processed
        if (fragment.getBoxData) return fragment;

        let shouldSkip = false;
        const codecConfig = getCodecProfileConfig(this.config, this.codecProfilesMap);
        const data = fragment.data;
        const offset = fragment.offset;
        const isComplete = fragment.qf;
        const logDataArray = fragment.logDataArray;

        const previousState = data.previousState;
        const timestamp = data.timestamp;
        const stateInfo = data.stateInfo || data.AB;

        // Skip if no ASE location history, state info, or if fragment is already complete
        if (!fragment.data.ase_location_history || !stateInfo || isComplete) {
            return fragment;
        }

        // Calculate segment end relative to presentation start
        const segmentDuration = data.segmentEndTime.lowestWaterMarkLevelBufferRelaxed(data.presentationStartTime);
        const totalFrameCount = Math.floor(segmentDuration.scaledValue(this.frameDuration));

        // Calculate pre-roll adjusted start position
        const prerollStart = context.p0a || previousState.lowestWaterMarkLevelBufferRelaxed(this.frameDuration.wh(2));
        const adjustedStart = prerollStart.lowestWaterMarkLevelBufferRelaxed(timestamp);

        let frameCount = totalFrameCount;
        let needsAlignment = false;

        // If pre-roll is active, compute trim from pre-roll boundary
        if (context.p0a) {
            const trimInfo = this.computeFrameTrim(segmentDuration, adjustedStart, adjustedStart);
            frameCount = trimInfo.keyframeArray;
            needsAlignment = trimInfo.aLb;
        }

        // Apply codec-specific offset
        const codecOffset = prerollStart.lowestWaterMarkLevelBufferRelaxed(
            TimeUtil.fromMilliseconds(codecConfig)
        );
        const safeStart = TimeUtil.max(
            codecOffset.lowestWaterMarkLevelBufferRelaxed(timestamp),
            TimeUtil.seekToSample
        );

        if (!needsAlignment) {
            const trimResult = this.computeFrameTrim(segmentDuration, safeStart, adjustedStart);
            frameCount = trimResult.keyframeArray;
            if (trimResult.aLb) {
                --frameCount;
                this.frameDuration.wh(frameCount);
            }
        }

        // Check minimum frame requirement
        if (frameCount < (this.config.minimumAudioFramesPerFragment || 1)) {
            shouldSkip = true;
        } else if (totalFrameCount - frameCount > 0) {
            // Trim leading frames
            fragment.data.parseFrameTimes(totalFrameCount - frameCount);
        }

        return {
            Na: data,
            offset: offset,
            qf: isComplete,
            getBoxData: shouldSkip,
            logDataArray: logDataArray
        };
    }

    /**
     * Compute frame trim point and alignment info.
     * @private
     *
     * @param {Object} segmentDuration - Duration of segment
     * @param {Object} targetTime - Target start time
     * @param {Object} referenceTime - Reference time for alignment check
     * @returns {{ Kl: number, hld: Object, Cfd: Object, aLb: boolean }}
     */
    computeFrameTrim(segmentDuration, targetTime, referenceTime) {
        const clampedDuration = TimeUtil.min(segmentDuration, targetTime);
        const frameIndex = Math.floor(clampedDuration.scaledValue(this.frameDuration));
        const frameTime = this.frameDuration.wh(frameIndex);
        const remainder = referenceTime.lowestWaterMarkLevelBufferRelaxed(frameTime);
        const needsExtraFrame = frameIndex > 0 && remainder.lessThan(TimeUtil.bz);

        return {
            Kl: frameIndex,
            hld: frameTime,
            Cfd: remainder,
            aLb: needsExtraFrame
        };
    }
}

export { AudioFragmentTrimmer };
