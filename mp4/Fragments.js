/**
 * Netflix Cadmium Player - Stream Fragments Module
 * Component: FRAGMENTS
 *
 * Extends the base FrameDurationInfo / FragmentKey system to add byte-size
 * information, offsets, and bitrate computation for each fragment within a
 * downloadable media stream.
 */

// Dependencies
// import { __extends, __assign } from 'tslib';          // webpack 22970
// import { platform } from './Platform';                 // webpack 66164
// import { assert } from './Assert';                     // webpack 52571
// import { BitrateCalculator } from './BitrateCalc';     // webpack 95591
// import { FragmentKey, FrameDurationInfo, materializeArray } from './Fragments_1'; // webpack 82149

const logger = new platform.Console("FRAGMENTS", "media|asejs");

/** @type {boolean} Whether Float64Array is supported */
let supportsFloat64 = false;
try {
    new Float64Array(8);
    supportsFloat64 = true;
} catch (_) {
    supportsFloat64 = false;
}

// ---------------------------------------------------------------------------
// StreamFragmentKey — extends FragmentKey with byte-size / offset info
// ---------------------------------------------------------------------------

/**
 * @class StreamFragmentKey
 * @extends FragmentKey
 *
 * Adds per-fragment byte size, byte offset, VMAF quality score, and
 * bitrate to the base FragmentKey.
 */
export class StreamFragmentKey extends FragmentKey {
    /**
     * @param {StreamFragments} streamFragments - Parent stream fragments
     * @param {number} index - Fragment index
     */
    constructor(streamFragments, index) {
        super(streamFragments.durationInfo, index);
        /** @type {StreamFragments} */
        this.streamFragments = streamFragments;
    }

    /**
     * Fragment byte size.
     * @returns {number}
     */
    get byteSize() {
        return this.streamFragments.sizesByIndex(this.currentIndex);
    }

    /**
     * Byte offset from the start of the stream.
     * @returns {number}
     */
    get offset() {
        return this.streamFragments.getByteOffset(this.currentIndex);
    }

    /**
     * Additional stream access points (SAPs) within this fragment.
     * @returns {*}
     */
    get additionalSAPs() {
        return (
            this.streamFragments.sampleDependencyFlags &&
            this.streamFragments.sampleDependencyFlags[this.currentIndex]
        );
    }

    /**
     * Encoded SAP entries with offsets.
     * @returns {Array<Object>}
     */
    get sapEntries() {
        return this.streamFragments.getSAPEntries(this.currentIndex);
    }

    /**
     * Per-fragment VMAF quality score.
     * @returns {number|undefined}
     */
    get vmafScore() {
        return (
            this.streamFragments.vmafScores &&
            this.streamFragments.vmafScores[this.currentIndex]
        );
    }

    /**
     * Bitrate in kbps for this fragment.
     * @returns {number}
     */
    get bitrateKbps() {
        return (8 * this.byteSize) / ((1e3 * this.durationTicks) / this.timescaleValue);
    }

    /** @returns {Object} JSON-safe representation */
    toJSON() {
        return {
            index: this.index,
            contentStartTicks: this.contentStartTicks,
            contentEndTicks: this.contentEndTicks,
            durationTicks: this.durationTicks,
            timescale: this.timescaleValue,
            startPts: this.presentationStartTime.playbackSegment,
            endPts: this.segmentEndTime.playbackSegment,
            duration: this.offset.playbackSegment,
            additionalSAPs: this.additionalSAPs,
        };
    }
}

// ---------------------------------------------------------------------------
// StreamFragments — fragment list with byte sizes and offsets
// ---------------------------------------------------------------------------

/** @constant {number} Offset index bucket size for fast offset lookup */
const OFFSET_BUCKET_SIZE = 128;

/**
 * @class StreamFragments
 *
 * Combines a FrameDurationInfo (timing) with per-fragment byte sizes
 * and offsets. Supports offset caching for efficient random access,
 * total byte counting, bitrate computation, subarray slicing, and
 * iteration helpers.
 */
export class StreamFragments {
    /**
     * @param {number} streamIndex - Index of this stream in the manifest
     * @param {FrameDurationInfo} durationInfo - Timing information
     * @param {Object} sizeData - { offset: number, sizes: Uint32Array }
     * @param {Uint8Array} [sampleDependencyFlags] - Per-fragment sample dep flags
     * @param {Object} [additionalSAPOffsets] - SAP byte offsets
     * @param {Uint8Array} [vmafScores] - Per-fragment VMAF scores
     * @param {number} [movieId] - For diagnostic logging
     */
    constructor(streamIndex, durationInfo, sizeData, sampleDependencyFlags, additionalSAPOffsets, vmafScores, movieId) {
        /** @private @type {number} Bucket size for offset index */
        this._bucketSize = OFFSET_BUCKET_SIZE;

        /** @type {FrameDurationInfo} */
        this.durationInfo = durationInfo;

        /** @type {number} Byte offset of the first fragment */
        this.baseOffset = sizeData.offset;

        /** @type {Uint32Array} Per-fragment byte sizes */
        this.sizes = sizeData.sizes;

        /** @type {number} */
        this.streamIndex = streamIndex;

        /** @private Cached values */
        this._cachedLastIndex = undefined;
        this._cachedLastOffset = undefined;
        this._offsetIndex = undefined;
        this._totalBytes = undefined;
        this._bitrateStats = undefined;

        /** @type {Uint8Array|undefined} */
        this.sampleDependencyFlags = sampleDependencyFlags;

        /** @type {Function|undefined} SAP offset getter */
        this._sapOffsetGetter = additionalSAPOffsets?.getByteOffset;

        /** @type {Uint8Array|undefined} */
        this.vmafScores = vmafScores;

        /** @type {number} Actual fragment count (min of duration entries and size entries) */
        this.maxLength = Math.min(this.durationInfo.length, this.sizes.length);

        // Compute max bitrate and largest fragment
        const stats = this._computeBitrateStats();
        this._maxBitrateKbps = stats.maxBitrate;
        this._largestFragmentBytes = stats.largestFragment;

        // Validation
        if (this.durationInfo.fragmentDurationTicks.length !== this.sizes.length) {
            logger.pauseTrace(
                `Mis-matched stream duration (${this.durationInfo.fragmentDurationTicks.length},${this.sizes.length}) for movie id ${movieId}`
            );
        }
        if (this.durationInfo.sapIndices && !this._sapOffsetGetter) {
            logger.error(`Mis-matched additional SAPs information for movie id ${movieId}`);
        }
    }

    // -- Computed properties ------------------------------------------------

    /** @returns {string} */
    get mediaType() {
        return this.durationInfo.mediaType;
    }

    /** @returns {number} Number of fragments */
    get length() {
        return this.maxLength;
    }

    /** @returns {number} First fragment time ticks */
    get firstFragmentTimeTicks() {
        return this.durationInfo.firstFragmentTimeTicks;
    }

    /** @returns {number} Last fragment end time ticks */
    get lastFragmentEndTimeTicks() {
        return this.durationInfo.lastFragmentEndTimeTicks;
    }

    /** @returns {number} Start PTS in ms */
    get startPtsMs() {
        return this.durationInfo.startPtsMs;
    }

    /** @returns {number} End PTS in ms */
    get endPtsMs() {
        return this.durationInfo.endPtsMs;
    }

    /** @returns {TimeUtil} Start time */
    get startTime() {
        return this.durationInfo.startTime;
    }

    /** @returns {TimeUtil} End time */
    get endTime() {
        return this.durationInfo.endTime;
    }

    /** @returns {number} Max bitrate in kbps */
    get maxBitrateKbps() {
        return this._maxBitrateKbps;
    }

    /** @returns {number} Largest fragment in bytes */
    get largestFragmentBytes() {
        return this._largestFragmentBytes;
    }

    /** @returns {*} Frame duration */
    get frameDuration() {
        return this.durationInfo.frameDuration;
    }

    /** @returns {number} Timescale */
    get timescaleValue() {
        return this.durationInfo.timescaleValue;
    }

    /** @returns {number} Total bytes across all fragments */
    get totalBytes() {
        return this._totalBytes || this._computeTotalBytes();
    }

    /** @returns {Uint8Array|undefined} Sample dependency flags */
    get sampleDeps() {
        return this.sampleDependencyFlags;
    }

    /** @returns {Function|undefined} SAP offset getter */
    get sapOffsetGetter() {
        return this._sapOffsetGetter;
    }

    /** @returns {Uint8Array|undefined} VMAF quality scores */
    get perFragmentVMAF() {
        return this.vmafScores;
    }

    /** @returns {FrameDurationInfo} The underlying duration info */
    get trackDurationInfo() {
        return this.durationInfo;
    }

    /** @returns {BitrateCalculator} Lazily computed bitrate calculator */
    get bitrateCalculator() {
        return this._bitrateStats || this._createBitrateCalculator();
    }

    // -- Methods ------------------------------------------------------------

    /**
     * Returns the byte size of the fragment at the given index.
     * @param {number} index
     * @returns {number}
     */
    sizesByIndex(index) {
        if (this.sizes) return this.sizes[index];
        logger.error("sizesByIndex _sizes is undefined");
        return -1;
    }

    /**
     * Returns the presentation time offset in ms for the fragment at index.
     * @param {number} index
     * @returns {number}
     */
    getTimescaleOffset(index) {
        return this.durationInfo.getTimescaleOffset(index);
    }

    /**
     * Returns the end time in ms for the fragment at index.
     * @param {number} index
     * @returns {number}
     */
    getEndTimeMs(index) {
        return this.durationInfo.getTimescaleOffset(index) + this.durationInfo.getDurationMs(index);
    }

    /**
     * Returns the byte offset from stream start for the fragment at index.
     * Uses a cached index with bucket-based acceleration.
     *
     * @param {number} index
     * @returns {number}
     */
    getByteOffset(index) {
        if (this._cachedLastIndex !== index || this._cachedLastOffset === undefined) {
            if (index === 0) {
                return this.baseOffset;
            }

            if (this._cachedLastIndex === index - 1 && this._cachedLastOffset !== undefined) {
                this._cachedLastOffset += this.sizes[this._cachedLastIndex];
                ++this._cachedLastIndex;
            } else {
                const offsetIndex = this._offsetIndex || this._buildOffsetIndex();
                const bucketIdx = Math.floor(index / this._bucketSize);
                const bucketStart = bucketIdx * this._bucketSize;
                let offset = offsetIndex[bucketIdx];

                for (let i = bucketStart; i < index; ++i) {
                    offset += this.sizes[i];
                }

                this._cachedLastIndex = index;
                this._cachedLastOffset = offset;
            }
        }
        return this._cachedLastOffset;
    }

    /**
     * Duration in ms for the fragment at index.
     * @param {number} index
     * @returns {number}
     */
    getDurationMs(index) {
        return this.durationInfo.getDurationMs(index);
    }

    /**
     * Returns a StreamFragmentKey for the given index.
     * @param {number} index
     * @returns {StreamFragmentKey}
     */
    key(index) {
        return new StreamFragmentKey(this, index);
    }

    /**
     * Returns the additional SAP entries for the fragment at the given index.
     * @param {number} index
     * @returns {Array<Object>}
     */
    getSAPEntries(index) {
        assert(index >= 0);

        const sapIndices = this.durationInfo.sapIndices;
        const sapSamples = this.durationInfo.sapSampleNumbers;
        const sapOffsets = this._sapOffsetGetter;

        if (!sapOffsets || !sapIndices || !sapSamples || index >= sapIndices.length) {
            return [];
        }

        const entries = [];
        const endIdx = index === sapIndices.length - 1 ? sapSamples.length : sapIndices[index + 1];

        for (let i = sapIndices[index]; i < endIdx; ++i) {
            entries.push({
                sampleNumber: sapSamples[i],
                presentationOffset:
                    this.getTimescaleOffset(index) +
                    this.frameDuration.convertTicks(sapSamples[i]).playbackSegment,
                offset: sapOffsets[i],
            });
        }
        return entries;
    }

    /**
     * Binary-search for the fragment containing the given timestamp.
     * @param {number} timestampMs
     * @param {number} [minTimestampMs]
     * @param {boolean} [clampToLast]
     * @returns {number}
     */
    findFragmentIndex(timestampMs, minTimestampMs, clampToLast) {
        return this.durationInfo.findFragmentIndex(timestampMs, minTimestampMs, clampToLast);
    }

    /**
     * Returns the FragmentKey at the given timestamp.
     * @param {number} timestampMs
     * @param {number} [minTimestampMs]
     * @param {boolean} [clampToLast]
     * @returns {StreamFragmentKey|undefined}
     */
    findSampleAt(timestampMs, minTimestampMs, clampToLast) {
        return this.durationInfo.findSampleAt(timestampMs, minTimestampMs, clampToLast);
    }

    /**
     * Estimate fragment count within a duration budget.
     * @param {number} startIndex
     * @param {number} durationMs
     * @returns {{ blocks: number, remainingMs: number }}
     */
    estimateFragmentCount(startIndex, durationMs) {
        return this.durationInfo.estimateFragmentCount(startIndex, durationMs);
    }

    /**
     * Checks whether all fragments from startMs through the stream fit within
     * a byte budget, dropping old fragments from the tail as needed.
     *
     * @param {number} startMs - Minimum duration in ms that must be retained
     * @param {number} maxBytes - Maximum byte budget
     * @param {number} minDurationMs - Minimum content duration in ms
     * @param {number} minBytes - Minimum bytes to keep
     * @param {number} [maxIndex] - Optional upper fragment index bound
     * @returns {boolean} true if all fragments fit within budget
     */
    fitsInByteBudget(startMs, maxBytes, minDurationMs, minBytes, maxIndex) {
        let fits = true;
        let fragmentIdx = 0;
        const durations = this.durationInfo.fragmentDurationTicks;
        const sizes = this.sizes;
        const startTicks = Math.floor((startMs * this.timescaleValue) / 1e3);
        const minDurationTicks = Math.floor((minDurationMs * this.timescaleValue) / 1e3);

        let accumulatedDuration = 0;
        let accumulatedBytes = 0;
        let tailIdx = 0;

        // Accumulate from cached range if available
        if (this.durationInfo.maxBitrateFragmentIndex !== undefined && this.durationInfo.largestFragmentIndex !== undefined) {
            for (
                fragmentIdx = this.durationInfo.maxBitrateFragmentIndex;
                fragmentIdx <= this.durationInfo.largestFragmentIndex;
                ++fragmentIdx
            ) {
                accumulatedDuration += durations[fragmentIdx];
                accumulatedBytes += sizes[fragmentIdx];
            }
        }

        if (accumulatedBytes > maxBytes) {
            fits = false;
        } else {
            while (fragmentIdx < this.length && (!maxIndex || fragmentIdx < maxIndex)) {
                const fragSize = sizes[fragmentIdx];
                const fragDuration = durations[fragmentIdx];

                if (accumulatedBytes + fragSize > maxBytes) {
                    // Try dropping old fragments from tail
                    while (
                        fragmentIdx - tailIdx > 1 &&
                        accumulatedBytes + fragSize > maxBytes &&
                        (accumulatedDuration - durations[tailIdx] >= minDurationTicks ||
                            accumulatedBytes - sizes[tailIdx] > minBytes)
                    ) {
                        accumulatedDuration -= durations[tailIdx];
                        accumulatedBytes -= sizes[tailIdx];
                        ++tailIdx;
                    }

                    if (accumulatedDuration < startTicks || accumulatedBytes + fragSize > maxBytes) {
                        fits = false;
                        this.durationInfo.maxBitrateFragmentIndex = tailIdx;
                        this.durationInfo.largestFragmentIndex = fragmentIdx;
                        break;
                    }
                }

                accumulatedDuration += fragDuration;
                accumulatedBytes += fragSize;
                ++fragmentIdx;
            }
        }

        return fits;
    }

    /**
     * Returns a sub-range of this StreamFragments.
     * @param {number} [start]
     * @param {number} [end]
     * @returns {StreamFragments}
     */
    subarray(start, end) {
        assert(start === undefined || (start >= 0 && start < this.length));
        assert(end === undefined || (end > start && end <= this.length));

        return new StreamFragments(
            this.streamIndex,
            this.durationInfo.subarray(start, end),
            {
                offset: this.getByteOffset(start),
                sizes: this.sizes.subarray(start, end),
            },
            this.sampleDeps && this.sampleDeps.subarray(start, end),
            this.sapOffsetGetter && { getByteOffset: this.sapOffsetGetter },
            this.vmafScores && this.vmafScores.subarray(start, end)
        );
    }

    /**
     * Iterate over every fragment.
     * @param {Function} callback
     */
    forEach(callback) {
        for (let i = 0; i < this.length; ++i) {
            callback(this.key(i), i, this);
        }
    }

    /**
     * Map over every fragment.
     * @param {Function} callback
     * @returns {Array}
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
     * @param {Function} callback
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
        return { length: this.length };
    }

    /** Logs all fragments for debugging. */
    logFragments() {
        logger.pauseTrace(`StreamFragments: ${this.length}`);
        for (let i = 0; i < this.length; ++i) {
            const frag = this.key(i);
            logger.pauseTrace(
                `StreamFragments: ${i}: [${frag.presentationStartTime.playbackSegment}-${frag.segmentEndTime.playbackSegment}]` +
                    ` @ ${frag.offset}, ${frag.byteSize} bytes`
            );
        }
    }

    // -- Private helpers ----------------------------------------------------

    /**
     * Computes max bitrate (kbps) and largest fragment (bytes).
     * @private
     * @returns {{ maxBitrate: number, largestFragment: number }}
     */
    _computeBitrateStats() {
        let maxRatio = 0;
        let maxSize = 0;
        let maxRatioIdx = this.durationInfo.maxBitrateFragmentIndex;
        let maxSizeIdx = this.durationInfo.largestFragmentIndex;
        const durations = this.durationInfo.fragmentDurationTicks;
        const sizes = this.sizes;

        if (
            maxRatioIdx === undefined ||
            maxRatioIdx >= this.length ||
            maxSizeIdx === undefined ||
            maxSizeIdx >= this.length
        ) {
            for (let i = 0; i < this.length; ++i) {
                const size = sizes[i];
                if (size > maxSize) {
                    maxSize = size;
                    maxSizeIdx = i;
                }
                const ratio = size / durations[i];
                if (ratio > maxRatio) {
                    maxRatio = ratio;
                    maxRatioIdx = i;
                }
            }
            if (this.durationInfo.maxBitrateFragmentIndex === undefined) {
                this.durationInfo.maxBitrateFragmentIndex = maxRatioIdx;
            }
            if (this.durationInfo.largestFragmentIndex === undefined) {
                this.durationInfo.largestFragmentIndex = maxSizeIdx;
            }
        } else {
            maxRatio = sizes[maxRatioIdx] / durations[maxRatioIdx];
            maxSize = sizes[maxSizeIdx];
        }

        return {
            maxBitrate: Math.floor((maxRatio * this.timescaleValue) / 125),
            largestFragment: maxSize,
        };
    }

    /**
     * Computes total bytes across all fragments.
     * @private
     * @returns {number}
     */
    _computeTotalBytes() {
        let total = 0;
        for (let i = 0; i < this.length; ++i) {
            total += this.sizes[i];
        }
        return (this._totalBytes = total);
    }

    /**
     * Lazily creates a BitrateCalculator.
     * @private
     * @returns {BitrateCalculator}
     */
    _createBitrateCalculator() {
        return (this._bitrateStats = new BitrateCalculator(
            this.durationInfo.fragmentDurationTicks,
            this.sizes,
            this.durationInfo.timescaleValue
        ));
    }

    /**
     * Builds a bucketed offset index for fast random-access offset lookups.
     * @private
     * @returns {Float64Array|Array<number>}
     */
    _buildOffsetIndex() {
        if (!this._offsetIndex) {
            const bucketCount = Math.ceil(this.length / this._bucketSize);
            const index = supportsFloat64
                ? new Float64Array(bucketCount)
                : new Array(bucketCount);

            let runningOffset = this.baseOffset;
            for (let b = 0; b < index.length; ++b) {
                index[b] = runningOffset;
                for (let j = 0; j < this._bucketSize; ++j) {
                    runningOffset += this.sizes[b * this._bucketSize + j];
                }
            }
            this._offsetIndex = index;
        }
        return this._offsetIndex;
    }
}

// Pre-compute cached array accessors
materializeArray(StreamFragments.prototype.getTimescaleOffset);
materializeArray(StreamFragments.prototype.getEndTimeMs);
StreamFragments.prototype.allDurationsMs = materializeArray(
    StreamFragments.prototype.getDurationMs
);
materializeArray(StreamFragments.prototype.getByteOffset);
StreamFragments.prototype.allSizes = materializeArray(
    StreamFragments.prototype.sizesByIndex
);
materializeArray(StreamFragments.prototype.key);
