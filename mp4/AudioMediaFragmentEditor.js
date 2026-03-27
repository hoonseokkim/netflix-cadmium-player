/**
 * Netflix Cadmium Player - Audio Media Fragment Editor
 * Component: MP4
 * Original: Module 75811
 *
 * Extends MediaFragmentEditor to handle audio-specific fragment editing
 * with fade-in/fade-out gain curve generation and MP4 box manipulation.
 * When audio segments are spliced together (e.g., during seamless audio
 * transitions), this editor applies configurable fade curves to avoid
 * audible pops/clicks at segment boundaries.
 */

// import { __extends, __spreadArray, __read, __values } from 'tslib';          // webpack 22970
// import { Mp4BoxParser } from './Mp4BoxParser';                                // webpack 91562
// import { TimeUtil } from '../timing/TimeUtil';                                // webpack 91176
// import { concatenateArrayBuffers } from '../buffer/BufferUtils';              // webpack 69575
// import { assert } from '../assert/assert';                                    // webpack 52571
// import { MediaType } from '../types/MediaType';                               // webpack 65161
// import { MediaFragmentEditor, allArrayBuffers } from './Mp4_1';              // webpack 47267

/**
 * Converts a linear amplitude value to decibels.
 * @param {number} amplitude - Linear amplitude value (0..1)
 * @returns {number} Value in decibels
 */
function amplitudeToDecibels(amplitude) {
    return 20 * Math.log(amplitude) / Math.log(10);
}

/**
 * Computes a per-sample gain curve (in dB) for a fade-in or fade-out region
 * within an audio segment's edit specification.
 *
 * The curve covers the full sample range [0, sampleCount) and returns an array
 * where each entry is a gain adjustment in dB. Samples that should be silenced
 * are marked as -Infinity. Samples that need no adjustment are marked as 0.
 *
 * @param {Object} editSpec - The edit specification for the segment
 * @param {number} editSpec.start - Start sample offset of the edit region
 * @param {number} [editSpec.end] - End sample offset (defaults to sampleCount)
 * @param {number} [editSpec.jAa] - Number of silent frames to prepend (fade-in padding)
 * @param {number} [editSpec.g6a] - Number of silent frames to append (fade-out padding)
 * @param {boolean} [editSpec.fadeIn] - Whether to apply a fade-in curve
 * @param {boolean} [editSpec.fadeOut] - Whether to apply a fade-out curve
 * @param {number} [editSpec.yzb] - Fade-in start offset override (1-based)
 * @param {number} [editSpec.zzb] - Fade-out start offset override (1-based)
 * @param {number} sampleCount - Total number of samples in the segment
 * @param {boolean} applyFadeOut - Whether fade-out is enabled for this pass
 * @param {number} frameDuration - Duration of a single frame
 * @param {Object} fadeDuration - Scaled fade duration (has scaledValue method)
 * @param {number} maximumFade - Maximum fade amplitude (linear, 0..1)
 * @param {boolean} insertSilentFrameOnFade - Whether to insert a silent frame at fade boundaries
 * @returns {number[]|undefined} Per-sample gain array in dB, or undefined if no fading needed
 */
function computeFadeGainCurve(editSpec, sampleCount, applyFadeOut, frameDuration, fadeDuration, maximumFade, insertSilentFrameOnFade) {
    if (editSpec.jAa === undefined && editSpec.g6a === undefined && !editSpec.fadeIn && !editSpec.fadeOut) {
        return undefined;
    }

    const totalSamples = (editSpec.end ?? sampleCount) - editSpec.start;
    const gainCurve = new Array(totalSamples);

    const hasFadeIn = editSpec.fadeIn;
    const fadeInStartOffset = editSpec.yzb ? editSpec.yzb - 1 : 0;
    const fadeOutStartOffset = editSpec.zzb ? editSpec.zzb - 1 : 0;

    // Number of silent frames to prepend/append
    const silentPrependCount = Math.min(
        totalSamples,
        Math.max(editSpec.jAa || 0, insertSilentFrameOnFade && hasFadeIn && !fadeInStartOffset ? 1 : 0)
    );
    const silentAppendCount = Math.min(
        totalSamples - silentPrependCount,
        Math.max(editSpec.g6a || 0, insertSilentFrameOnFade && applyFadeOut && !fadeOutStartOffset ? 1 : 0)
    );

    // Compute fade step count from the scaled duration
    const fadeStepCount = Math.floor(fadeDuration.scaledValue(frameDuration));

    // Compute fade-in and fade-out region boundaries
    const fadeInLength = Math.max(
        0,
        Math.min(totalSamples - silentPrependCount - silentAppendCount, hasFadeIn ? Math.max(0, fadeStepCount - fadeInStartOffset) : 0)
    );
    const fadeOutLength = Math.max(
        0,
        Math.min(totalSamples - silentPrependCount - silentAppendCount - fadeInLength, applyFadeOut ? Math.max(0, fadeStepCount - fadeOutStartOffset) : 0)
    );

    const fadeInEnd = silentPrependCount + fadeInLength;
    const fadeOutStart = totalSamples - silentAppendCount - fadeOutLength;
    const fadeOutBaseOffset = fadeOutStartOffset ? 0 : Math.max(0, fadeStepCount + 1 - fadeOutLength);
    const gainStep = (1 - maximumFade) / (fadeStepCount + 1);

    for (let i = 0; i < totalSamples; ++i) {
        if (i < silentPrependCount) {
            // Silent prepend region
            gainCurve[i] = -Infinity;
        } else if (i >= totalSamples - silentAppendCount) {
            // Silent append region
            gainCurve[i] = -Infinity;
        } else if (hasFadeIn && i < fadeInEnd) {
            // Fade-in region: ramp amplitude up
            gainCurve[i] = amplitudeToDecibels(maximumFade + (i - silentPrependCount + fadeInStartOffset) * gainStep);
        } else if (applyFadeOut && i >= fadeOutStart) {
            // Fade-out region: ramp amplitude down
            gainCurve[i] = amplitudeToDecibels(1 - (i - fadeOutStart + fadeOutBaseOffset + 1) * gainStep);
        } else {
            // No gain change
            gainCurve[i] = 0;
        }
    }

    return gainCurve;
}

/**
 * Audio-specific media fragment editor that handles fade-in/fade-out
 * gain curves when splicing audio segments together.
 *
 * Extends the base MediaFragmentEditor to add:
 * - Configurable segment fade-in/fade-out durations
 * - Per-sample gain curve computation
 * - MP4 box-level editing for trimming and applying gain adjustments
 * - Support for optimized (partial) response editing
 *
 * @extends MediaFragmentEditor
 */
export class AudioMediaFragmentEditor extends MediaFragmentEditor {
    /**
     * @param {Console} console - Console instance for logging
     * @param {Object} config - Audio editor configuration
     * @param {number} [config.segmentFadeInDuration] - Fade-in duration in ms (-1 to use segmentFadeDuration)
     * @param {number} [config.segmentFadeOutDuration] - Fade-out duration in ms (-1 to use segmentFadeDuration)
     * @param {number} [config.segmentFadeDuration] - Default fade duration in ms
     * @param {Object} config.maximumFade - Map of profile to max fade dB value
     * @param {boolean} [config.retainSbrOnFade] - Whether to retain SBR data during fade
     * @param {boolean} [config.insertSilentFrameOnFade] - Whether to insert silent frames at fade boundaries
     * @param {string} profile - Audio codec profile name
     */
    constructor(console, config, profile) {
        super(console, MediaType.AUDIO);

        /** @type {Console} */
        this.console = console;

        /** @type {Object} */
        this.config = config;

        /** @type {Object} Fade-in duration as a TimeUtil value */
        this.segmentFadeInDuration = TimeUtil.fromMilliseconds(
            config.segmentFadeInDuration >= 0 ? config.segmentFadeInDuration : config.segmentFadeDuration
        );

        /** @type {Object} Fade-out duration as a TimeUtil value */
        this.segmentFadeOutDuration = TimeUtil.fromMilliseconds(
            config.segmentFadeOutDuration >= 0 ? config.segmentFadeOutDuration : config.segmentFadeDuration
        );

        /** @type {number} Maximum fade amplitude (linear scale, derived from dB config) */
        this.maximumFade = Math.pow(10, (config.maximumFade[profile] || -44) / 20);
    }

    /**
     * Edits an audio media fragment by applying fade-in and/or fade-out curves,
     * trimming samples, and reassembling the MP4 data.
     *
     * @param {Object} fragment - The media fragment to edit
     * @param {Object} fragment.ase_location_history - Edit specification (start, end, fade params)
     * @param {number} fragment.sampleCount - Total sample count in the fragment
     * @param {Array} fragment.kv - Response data chunks
     * @param {Object} fragment.stream - Stream reference
     * @param {Object} [fragment.O2] - Optimized response descriptor
     * @param {boolean} [fragment.isPreProcessed] - Whether responses are pre-processed
     * @param {boolean} [applyFadeOut=true] - Whether to apply fade-out processing
     * @returns {Object} Result with success flag, optional logDataArray and kv (edited chunks)
     */
    editFragment(fragment, applyFadeOut = true) {
        const logDataArray = [];

        assert(!fragment.appended, `AudioMediaFragmentEditor [\${fragment.mediaType}]: Attempt to edit appended fragment`);

        // No edit spec means nothing to do
        if (!fragment.ase_location_history) {
            return { success: true };
        }

        assert(fragment.MS, "AudioMediaFragmentEditor: fragment has missing responses");

        // Cannot edit if offset is non-positive
        if (fragment.offset.$ <= 0) {
            return { success: false };
        }

        // Extract moof data from response chunks
        const responseChunks = fragment.kv;
        const splitResult = this.splitAtMoofBoundary(responseChunks);
        const moofData = splitResult.n0a;
        const remainingChunks = splitResult.OU;

        if (!moofData) {
            return { success: false };
        }

        // Determine if we need to handle non-ArrayBuffer responses
        const hasNonArrayBufferResponses = fragment.isPreProcessed === false &&
            !responseChunks.every((chunk) => chunk instanceof ArrayBuffer);

        let editedChunks = [];

        // ---------- Fade-in / start-trim pass ----------
        let fadeInResult;
        let fadeInSuccess;
        let fadeInStats;
        let fadeInData;
        let fadeInOffsets;

        if (fragment.ase_location_history.start > 0 ||
            fragment.ase_location_history.jAa ||
            fragment.ase_location_history.fadeIn) {

            const startEditResult = this.#editStart(fragment, moofData, applyFadeOut, hasNonArrayBufferResponses);
            fadeInSuccess = startEditResult.success;
            fadeInStats = startEditResult.sessionStats;
            fadeInData = startEditResult.data;
            fadeInOffsets = startEditResult.QL;

            if (!fadeInSuccess) {
                return { success: fadeInSuccess };
            }

            if (fadeInStats) {
                logDataArray.push(fadeInStats);
            }

            fadeInResult = fadeInData ? [concatenateArrayBuffers(fadeInData)] : undefined;
            const startOffset = fragment.ase_location_history.start;

            if (fadeInOffsets) {
                editedChunks.push(...fadeInOffsets);
            }
        }

        // ---------- Fade-out / end-trim pass ----------
        if ((fragment.ase_location_history.end !== null && fragment.ase_location_history.end !== fragment.sampleCount) ||
            fragment.ase_location_history.g6a ||
            fragment.ase_location_history.fadeOut) {

            const dataForEndEdit = fadeInResult
                ? concatenateArrayBuffers(fadeInResult)
                : moofData;

            const endEditResult = this.#editEnd(
                fragment,
                dataForEndEdit,
                fragment.ase_location_history.start,
                applyFadeOut,
                hasNonArrayBufferResponses
            );

            const endSuccess = endEditResult.success;
            const endStats = endEditResult.sessionStats;
            const endData = endEditResult.data;
            const endOffsets = endEditResult.QL;

            if (!endSuccess) {
                return { success: endSuccess };
            }

            if (endStats) {
                logDataArray.push(endStats);
            }

            fadeInResult = endData ? [concatenateArrayBuffers(endData)] : undefined;

            if (endOffsets) {
                // Adjust offsets to account for data size changes
                const byteOffset = moofData.byteLength - dataForEndEdit.byteLength +
                    editedChunks.reduce((sum, entry) => sum + entry.item, 0);

                endOffsets.forEach((entry) => {
                    entry.offset += byteOffset;
                });

                editedChunks.push(...endOffsets);
            }
        }

        // Assemble final result
        const finalChunks = (fadeInResult || [moofData]).concat(
            this.#buildOptimizedResponseChunks(
                remainingChunks,
                fragment.O2?.offset ?? moofData.byteLength,
                fragment.O2?.la,
                editedChunks
            )
        );

        return {
            success: true,
            logDataArray,
            kv: finalChunks,
        };
    }

    /**
     * Applies fade-in editing to the start of the fragment's MP4 data.
     *
     * @param {Object} fragment - The media fragment
     * @param {ArrayBuffer} moofData - The moof box data
     * @param {boolean} [applyFadeOut=true] - Whether fade-out is also being applied
     * @param {boolean} [hasNonArrayBufferResponses=false] - Whether non-ArrayBuffer responses exist
     * @returns {Object} Result with success, sessionStats, data, and QL (offset list)
     */
    #editStart(fragment, moofData, applyFadeOut = true, hasNonArrayBufferResponses = false) {
        assert(fragment.ase_location_history);

        const silentPrependFrames = fragment.ase_location_history.jAa;
        applyFadeOut = !!(fragment.ase_location_history.fadeOut && applyFadeOut);

        // Nothing to do if no start trim, no silent prepend, no fade-in, and no fade-out
        if (!fragment.ase_location_history.start && !silentPrependFrames && !fragment.ase_location_history.fadeIn && !applyFadeOut) {
            return { success: true };
        }

        const gainCurve = computeFadeGainCurve(
            fragment.ase_location_history,
            fragment.sampleCount,
            applyFadeOut,
            fragment.frameDuration,
            this.segmentFadeInDuration,
            this.maximumFade,
            this.config.insertSilentFrameOnFade
        );

        const streamHeader = fragment.stream.getStreamHeader();
        assert(streamHeader || "-1" === fragment.stream.selectedStreamId,
            "Should have a header for the stream that is being edited");

        const parser = new Mp4BoxParser(this.mp4Console, fragment.stream, moofData, {
            ce: streamHeader?.internal_Lea,
        });

        const editResult = parser.editStart({
            Jl: fragment.ase_location_history.start,
            O: fragment.sampleMultiplier,
            dH: gainCurve,
            y4a: false,
            aV: this.config.retainSbrOnFade,
            wT: amplitudeToDecibels(this.maximumFade),
            internal_Cqa: hasNonArrayBufferResponses,
        });

        if (!editResult) {
            this.console.error(
                `AudioMediaFragmentEditor [${fragment.mediaType}]: ${fragment.toString()} edit failed`
            );
            return { success: false };
        }

        return {
            success: true,
            sessionStats: fragment.hQb(silentPrependFrames),
            data: editResult.data,
            QL: editResult.QL,
        };
    }

    /**
     * Applies fade-out editing to the end of the fragment's MP4 data.
     *
     * @param {Object} fragment - The media fragment
     * @param {ArrayBuffer} moofData - The moof box data (possibly already edited by start pass)
     * @param {number} [startOffset=0] - Sample offset from start editing pass
     * @param {boolean} [applyFadeOut=true] - Whether fade-out is enabled
     * @param {boolean} [hasNonArrayBufferResponses=false] - Whether non-ArrayBuffer responses exist
     * @returns {Object} Result with success, sessionStats, data, and QL (offset list)
     */
    #editEnd(fragment, moofData, startOffset = 0, applyFadeOut = true, hasNonArrayBufferResponses = false) {
        assert(fragment.ase_location_history);

        const silentAppendFrames = fragment.ase_location_history.g6a;
        applyFadeOut = !!(fragment.ase_location_history.fadeOut && applyFadeOut);

        // Nothing to do if no end trim, no silent append, no fade-in, and no fade-out
        if (!(fragment.ase_location_history.end !== null && fragment.ase_location_history.end !== fragment.sampleCount ||
              silentAppendFrames || fragment.ase_location_history.fadeIn || applyFadeOut)) {
            return { success: true };
        }

        const gainCurve = computeFadeGainCurve(
            fragment.ase_location_history,
            fragment.sampleCount,
            applyFadeOut,
            fragment.frameDuration,
            this.segmentFadeOutDuration,
            this.maximumFade,
            this.config.insertSilentFrameOnFade
        );

        const streamHeader = fragment.stream.getStreamHeader();
        assert(streamHeader || "-1" === fragment.stream.selectedStreamId,
            "Should have a header for the stream that is being edited");

        const parser = new Mp4BoxParser(this.mp4Console, fragment.stream, moofData, {
            ce: streamHeader?.internal_Lea,
        });

        const editResult = parser.editEnd({
            Jl: (fragment.ase_location_history.end ?? fragment.sampleCount) - startOffset,
            O: fragment.sampleMultiplier,
            dH: gainCurve,
            y4a: false,
            aV: this.config.retainSbrOnFade,
            wT: amplitudeToDecibels(this.maximumFade),
            internal_Cqa: hasNonArrayBufferResponses,
        });

        if (!editResult) {
            this.console.error(
                `AudioMediaFragmentEditor [${fragment.mediaType}]: ${fragment.toString()} edit failed`
            );
            return { success: false };
        }

        return {
            success: true,
            sessionStats: fragment.hQb(silentAppendFrames),
            data: editResult.data,
            QL: editResult.QL,
        };
    }

    /**
     * Builds the optimized response chunks by splicing edited regions into
     * the remaining (post-moof) response data. Edited offsets describe
     * byte regions that were removed from the moof and need to be accounted
     * for when reconstructing the full response.
     *
     * @param {Array<ArrayBuffer>} remainingChunks - Chunks beyond the moof box
     * @param {number} baseOffset - Byte offset where remaining chunks start
     * @param {number} [requestLength] - Expected total byte length of the request
     * @param {Array<{offset: number, item: number}>} editOffsets - Offset/size pairs for edited regions
     * @returns {Array<ArrayBuffer>} Reassembled response chunks
     */
    #buildOptimizedResponseChunks(remainingChunks, baseOffset, requestLength, editOffsets) {
        // If no edits affect the remaining chunks, return them as-is
        if (editOffsets.length === 0 ||
            editOffsets.every((entry) => {
                const offset = entry.offset;
                return offset + entry.item <= baseOffset ||
                    (requestLength !== undefined && offset >= baseOffset + requestLength);
            })) {
            return remainingChunks;
        }

        // If remaining chunks are empty, validate the single edit covers the base offset
        if (remainingChunks.length === 0) {
            assert(editOffsets.length === 1,
                "Expected only one edit when entire edited fragment is in initial response");
            assert(editOffsets[0].offset === baseOffset,
                "Expected edit offset to match request offset when entire edited fragment is in initial response");
            return [];
        }

        assert(allArrayBuffers(remainingChunks),
            "Must have array buffers to edit optimized response beyond original request");

        // Concatenate remaining chunks into a single buffer if needed
        const combinedBuffer = remainingChunks.length > 1
            ? concatenateArrayBuffers(remainingChunks)
            : remainingChunks[0];

        assert(requestLength === undefined || requestLength === combinedBuffer.byteLength,
            "Request bytes mismatch");

        // Sort edit offsets by position
        editOffsets.sort((a, b) => a.offset - b.offset);

        // Build result by copying non-edited regions
        let currentOffset = baseOffset;
        const resultChunks = [];

        for (const { offset, item: removedSize } of editOffsets) {
            // Copy bytes before this edit
            if (offset >= currentOffset) {
                resultChunks.push(combinedBuffer.slice(currentOffset - baseOffset, offset - baseOffset));
            }
            // Skip past the edited (removed) region
            currentOffset = Math.max(currentOffset, offset + removedSize);
        }

        // Copy any remaining bytes after the last edit
        if (currentOffset < baseOffset + combinedBuffer.byteLength) {
            resultChunks.push(combinedBuffer.slice(currentOffset - baseOffset));
        }

        return resultChunks;
    }
}
