/**
 * Netflix Cadmium Player - Fragment Duration Info Module
 * Component: FRAGMENTS
 *
 * Provides the base fragment key class and the FrameDurationInfo class
 * which tracks per-fragment timing (duration, offsets, presentation times)
 * for a media track. Used by the higher-level StreamFragments to combine
 * timing with byte-size information.
 */

// Dependencies
// import { __extends } from 'tslib';                  // webpack 91176 (inherits helper)
// import { TimeUtil } from './TimeUtil';               // webpack 91176
// import { platform } from './Platform';               // webpack 66164
// import { assert } from './Assert';                   // webpack 52571

const logger = new platform.Console("FRAGMENTS", "media|asejs");

/**
 * Creates an array-materializer: calls the given per-index accessor for
 * every index in `this.length` and returns the collected array.
 *
 * Used to generate cached "all-values" arrays for getTimescaleOffset,
 * getEndTimeMs, getDurationMs, etc.
 *
 * @param {Function} accessor - A function(index) that returns a value
 * @returns {Function} A function that returns the full array
 */
export function materializeArray(accessor) {
    return function () {
        const result = new Array(this.length);
        for (let i = 0; i < this.length; ++i) {
            result[i] = accessor.call(this, i);
        }
        return result;
    };
}

/**
 * Returns a bracketed string representation of a typed array.
 * @param {TypedArray} typedArray
 * @returns {string}
 */
export function typedArrayToString(typedArray) {
    return `[${Array(typedArray.length)
        .map((_, i) => typedArray[i].toString())
        .join(",")}]`;
}

// ---------------------------------------------------------------------------
// FragmentKey — lightweight accessor into FrameDurationInfo at a given index
// ---------------------------------------------------------------------------

/**
 * @class FragmentKey
 * A cursor pointing at one fragment inside a FrameDurationInfo.
 * Exposes timing properties (start, end, duration) for that fragment.
 */
export class FragmentKey {
    /**
     * @param {FrameDurationInfo} durationInfo - The parent duration-info object
     * @param {number} index - Fragment index within durationInfo
     */
    constructor(durationInfo, index) {
        /** @type {FrameDurationInfo} */
        this.durationInfo = durationInfo;
        /** @type {number} */
        this.currentIndex = index;
    }

    /** @type {number} Fragment index */
    get index() {
        return this.currentIndex;
    }

    /**
     * Presentation start time as a TimeUtil instance.
     * @returns {TimeUtil}
     */
    get presentationStartTime() {
        return new TimeUtil(this.contentStartTicks, this.timescaleValue);
    }

    /**
     * Segment end time as a TimeUtil instance.
     * @returns {TimeUtil}
     */
    get segmentEndTime() {
        return new TimeUtil(this.contentEndTicks, this.timescaleValue);
    }

    /**
     * Duration as a TimeUtil instance.
     * @returns {TimeUtil}
     */
    get duration() {
        return new TimeUtil(this.durationTicks, this.timescaleValue);
    }

    /**
     * Content start in timescale ticks.
     * @returns {number}
     */
    get contentStartTicks() {
        return this.durationInfo.baseTimeTicks + this.durationInfo.cumulativeTicks[this.currentIndex];
    }

    /**
     * Content end in timescale ticks.
     * @returns {number}
     */
    get contentEndTicks() {
        return this.contentStartTicks + this.durationInfo.fragmentDurationTicks[this.currentIndex];
    }

    /**
     * Duration in timescale ticks.
     * @returns {number}
     */
    get durationTicks() {
        return this.durationInfo.fragmentDurationTicks[this.currentIndex];
    }

    /**
     * Frame duration reference.
     * @returns {*}
     */
    get frameDuration() {
        return this.durationInfo.frameDuration;
    }

    /**
     * Timescale value (ticks per second).
     * @returns {number}
     */
    get timescaleValue() {
        return this.durationInfo.timescaleValue;
    }

    /** @returns {Object} JSON-safe representation */
    toJSON() {
        return {
            startPts: (1e3 * this.contentStartTicks) / this.frameDuration.timescaleValue,
            endPts: (1e3 * this.contentEndTicks) / this.frameDuration.timescaleValue,
            duration: (1e3 * this.durationTicks) / this.frameDuration.timescaleValue,
            index: this.index,
        };
    }
}

// ---------------------------------------------------------------------------
// FrameDurationInfo — fragment timing for a media track
// ---------------------------------------------------------------------------

/**
 * @class FrameDurationInfo
 * Holds the per-fragment duration ticks for a media track.
 * Supports binary-search lookup by presentation timestamp, subarray slicing,
 * and iteration helpers (forEach, map, reduce).
 */
export class FrameDurationInfo {
    /**
     * @param {string} mediaType - e.g. "video", "audio", "supplementary"
     * @param {*} frameDurationRef - Reference frame duration
     * @param {Object} timingData - { timescaleValue, baseTimeTicks, fragmentDurationTicks }
     * @param {Object} [additionalSAPData] - Optional SAP (stream access point) data
     */
    constructor(mediaType, frameDurationRef, timingData, additionalSAPData) {
        /** @type {string} */
        this.mediaType = mediaType;

        /** @type {number} Number of fragments */
        this.length = timingData.fragmentDurationTicks.length;

        /** @type {number} Ticks per second */
        this.timescaleValue = timingData.timescaleValue;

        /** @type {Uint32Array} Per-fragment duration in ticks */
        this.fragmentDurationTicks = timingData.fragmentDurationTicks;

        /** @type {Uint32Array|undefined} SAP index array */
        this.sapIndices = additionalSAPData?.sapIndices;

        /** @type {Uint32Array|undefined} SAP sample numbers */
        this.sapSampleNumbers = additionalSAPData?.sapSampleNumbers;

        /** @type {*} */
        this.frameDurationRef = frameDurationRef;

        /** @private Cached indices for max bitrate / largest fragment */
        this.maxBitrateFragmentIndex = undefined;
        this.largestFragmentIndex = undefined;

        /** @type {number} Base time in ticks (decode time of first fragment) */
        this.baseTimeTicks = timingData.baseTimeTicks;

        /**
         * @type {Uint32Array} Cumulative duration ticks.
         * cumulativeTicks[i] = sum of fragmentDurationTicks[0..i-1].
         * cumulativeTicks[length] = total duration.
         */
        this.cumulativeTicks = new Uint32Array(this.length + 1);

        if (this.length) {
            let cumulative = 0;
            for (let i = 0; i < this.length; ++i) {
                this.cumulativeTicks[i] = cumulative;
                cumulative += this.fragmentDurationTicks[i];
            }
            this.cumulativeTicks[this.length] = cumulative;

            /** @type {number} Average fragment duration in milliseconds */
            this.averageFragmentDuration = Math.floor(
                (this.endPtsMs - this.startPtsMs) / this.length
            );
        }
    }

    // -- Computed properties ------------------------------------------------

    /**
     * First fragment's decode time in ticks.
     * @returns {number}
     */
    get firstFragmentTimeTicks() {
        return this.getAbsoluteTimeTicks(0);
    }

    /**
     * Last fragment's end time in ticks.
     * @returns {number}
     */
    get lastFragmentEndTimeTicks() {
        return this.getAbsoluteTimeTicks(this.length);
    }

    /**
     * Start presentation timestamp in milliseconds.
     * @returns {number}
     */
    get startPtsMs() {
        return this.getTimescaleOffset(0);
    }

    /**
     * End presentation timestamp in milliseconds.
     * @returns {number}
     */
    get endPtsMs() {
        return this.getTimescaleOffset(this.length);
    }

    /**
     * Start time as a TimeUtil instance.
     * @returns {TimeUtil}
     */
    get startTime() {
        return new TimeUtil(this.baseTimeTicks, this.timescaleValue);
    }

    /**
     * End time as a TimeUtil instance.
     * @returns {TimeUtil}
     */
    get endTime() {
        return new TimeUtil(this.lastFragmentEndTimeTicks, this.timescaleValue);
    }

    /**
     * Frame duration reference.
     * @returns {*}
     */
    get frameDuration() {
        return this.frameDurationRef;
    }

    /**
     * Timescale getter (alias).
     * @returns {number}
     */
    get timescale() {
        return this.timescaleValue;
    }

    // -- Methods ------------------------------------------------------------

    /**
     * Absolute time in ticks for fragment at the given index.
     * @param {number} index
     * @returns {number}
     */
    getAbsoluteTimeTicks(index) {
        return this.baseTimeTicks + this.cumulativeTicks[index];
    }

    /**
     * Presentation time offset in milliseconds for fragment at index.
     * @param {number} index
     * @returns {number}
     */
    getTimescaleOffset(index) {
        return Math.floor(
            (1e3 * (this.baseTimeTicks + this.cumulativeTicks[index])) / this.timescaleValue
        );
    }

    /**
     * End time in milliseconds for fragment at index.
     * @param {number} index
     * @returns {number}
     */
    getEndTimeMs(index) {
        return this.getTimescaleOffset(index + 1);
    }

    /**
     * Duration in milliseconds for fragment at index.
     * @param {number} index
     * @returns {number}
     */
    getDurationMs(index) {
        return this.getEndTimeMs(index) - this.getTimescaleOffset(index);
    }

    /**
     * Returns a FragmentKey for the given index.
     * @param {number} index
     * @returns {FragmentKey}
     */
    key(index) {
        return new FragmentKey(this, index);
    }

    /**
     * Binary-search for the fragment containing the given timestamp (ms).
     *
     * @param {number} timestampMs - Presentation time in milliseconds
     * @param {number} [minTimestampMs] - Optional lower bound (skip fragments before this)
     * @param {boolean} [clampToLast] - If true, clamp out-of-range to last fragment
     * @returns {number} Fragment index, or -1 if not found
     */
    findFragmentIndex(timestampMs, minTimestampMs, clampToLast) {
        if (this.length === 0 || timestampMs < this.getTimescaleOffset(0)) {
            return -1;
        }

        const effectiveTs = Math.max(timestampMs, minTimestampMs || 0);
        let low = 0;
        let high = this.length - 1;

        while (high >= low) {
            const mid = low + ((high - low) >> 1);
            const midStart = this.getTimescaleOffset(mid);

            if (effectiveTs < midStart) {
                high = mid - 1;
            } else if (effectiveTs >= midStart + this.getDurationMs(mid)) {
                low = mid + 1;
            } else {
                // Found — but skip past minTimestampMs if needed
                let idx = mid;
                while (minTimestampMs && idx < this.length && this.getTimescaleOffset(idx) < minTimestampMs) {
                    ++idx;
                }
                return idx < this.length ? idx : clampToLast ? this.length - 1 : -1;
            }
        }

        return clampToLast ? this.length - 1 : -1;
    }

    /**
     * Returns the FragmentKey at the given timestamp, or undefined.
     * @param {number} timestampMs
     * @param {number} [minTimestampMs]
     * @param {boolean} [clampToLast]
     * @returns {FragmentKey|undefined}
     */
    findSampleAt(timestampMs, minTimestampMs, clampToLast) {
        const idx = this.findFragmentIndex(timestampMs, minTimestampMs, clampToLast);
        return idx >= 0 ? this.key(idx) : undefined;
    }

    /**
     * Estimate how many fragments fit within a duration budget starting at
     * the given index.
     *
     * @param {number} startIndex - Starting fragment index
     * @param {number} durationMs - Duration budget in milliseconds
     * @returns {{ blocks: number, remainingMs: number }}
     */
    estimateFragmentCount(startIndex, durationMs) {
        const durationTicks = Math.floor((durationMs * this.timescaleValue) / 1e3);
        let endIndex = Math.min(
            startIndex + Math.ceil(durationMs / this.averageFragmentDuration),
            this.length
        );
        let accumulatedTicks = this.cumulativeTicks[endIndex] - this.cumulativeTicks[startIndex];

        if (accumulatedTicks >= durationTicks) {
            while (accumulatedTicks >= durationTicks) {
                --endIndex;
                accumulatedTicks -= this.fragmentDurationTicks[endIndex];
            }
            return { blocks: Math.max(endIndex - startIndex + 1, 0), remainingMs: 0 };
        }

        while (accumulatedTicks < durationTicks && endIndex <= this.length) {
            durationMs -= accumulatedTicks || 0;
            accumulatedTicks += this.fragmentDurationTicks[endIndex];
            ++endIndex;
        }
        return { blocks: Math.max(endIndex - startIndex - 1, 0), remainingMs: durationMs };
    }

    /**
     * Returns a sub-range of this FrameDurationInfo.
     * @param {number} [start]
     * @param {number} [end]
     * @returns {FrameDurationInfo}
     */
    subarray(start, end) {
        assert(start === undefined || (start >= 0 && start < this.length));
        assert(end === undefined || (end > start && end <= this.length));

        return new FrameDurationInfo(
            this.mediaType,
            this.frameDuration,
            {
                timescaleValue: this.timescaleValue,
                baseTimeTicks: this.baseTimeTicks + this.cumulativeTicks[start],
                fragmentDurationTicks: this.fragmentDurationTicks.subarray(start, end),
            },
            this.sapIndices && {
                sapIndices: this.sapIndices.subarray(start, end + 1),
                sapSampleNumbers: this.sapSampleNumbers,
            }
        );
    }

    /**
     * Iterate over every fragment.
     * @param {Function} callback - (FragmentKey, index, this)
     */
    forEach(callback) {
        for (let i = 0; i < this.length; ++i) {
            callback(this.key(i), i, this);
        }
    }

    /**
     * Map over every fragment.
     * @param {Function} callback - (FragmentKey, index, this) => T
     * @returns {Array<T>}
     */
    map(callback) {
        const result = [];
        for (let i = 0; i < this.length; ++i) {
            result.push(callback(this.key(i), i, this));
        }
        return result;
    }

    /**
     * Reduce over every fragment.
     * @param {Function} callback - (accumulator, FragmentKey, index, this) => T
     * @param {*} initial
     * @returns {*}
     */
    reduce(callback, initial) {
        let acc = initial;
        for (let i = 0; i < this.length; ++i) {
            acc = callback(acc, this.key(i), i, this);
        }
        return acc;
    }

    /** @returns {Object} JSON-safe representation */
    toJSON() {
        return {
            length: this.length,
            averageFragmentDuration: this.averageFragmentDuration,
        };
    }

    /** Logs all fragments for debugging. */
    logFragments() {
        logger.pauseTrace(
            `TrackFragments: ${this.length}, averageFragmentDuration: ${this.averageFragmentDuration}ms`
        );
        for (let i = 0; i < this.length; ++i) {
            const frag = this.key(i);
            logger.pauseTrace(
                `TrackFragments: ${i}: [${frag.presentationStartTime.playbackSegment}-${frag.segmentEndTime.playbackSegment}]`
            );
        }
    }
}

// Pre-compute cached array accessors
materializeArray(FrameDurationInfo.prototype.getTimescaleOffset);
materializeArray(FrameDurationInfo.prototype.getEndTimeMs);
FrameDurationInfo.prototype.allDurationsMs = materializeArray(
    FrameDurationInfo.prototype.getDurationMs
);
