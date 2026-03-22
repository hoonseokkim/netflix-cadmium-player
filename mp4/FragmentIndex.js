/**
 * Netflix Cadmium Player - Fragment Index
 *
 * Stores parallel arrays of fragment durations and sizes for a media track.
 * Supports subarray slicing and concatenation for segment management.
 *
 * @module FragmentIndex
 * @original Module_95591
 */

// import { __spreadArray, __read } from 'tslib'; // webpack 22970
// import { ArrayCopyUtils } from '../mp4/Mp4ParserExports.js'; // webpack 91562
// import { assert } from '../assert/Assert.js'; // webpack 52571

/**
 * Represents a parallel-array index of fragment durations and byte sizes
 * for a media track. Used by pipelines to look up fragment offsets and sizes.
 */
export class FragmentIndex {
    /**
     * @param {Uint32Array} durations - Array of fragment durations (in timescale units)
     * @param {Uint32Array} sizes - Array of fragment byte sizes
     * @param {number} timescale - Timescale for duration values
     * @param {number} [totalContentLength] - Pre-computed total byte length
     */
    constructor(durations, sizes, timescale, totalContentLength) {
        /** @type {Uint32Array} Fragment durations */
        this.durations = durations;

        /** @type {Uint32Array} Fragment byte sizes */
        this.sizes = sizes;

        /** @type {number} Media timescale */
        this.timescale = timescale;

        /** @type {number} Number of fragments */
        this.length = Math.min(durations.length, sizes.length);

        /** @private @type {number|undefined} Cached total content length */
        this._totalContentLength = totalContentLength;
    }

    /**
     * Total byte size of all fragments
     * @returns {number}
     */
    get totalContentLength() {
        if (this._totalContentLength === undefined) {
            this._totalContentLength = this._computeTotalLength();
        }
        return this._totalContentLength;
    }

    /**
     * Returns a sub-range of this fragment index
     * @param {number} start - Start index (inclusive)
     * @param {number} end - End index (exclusive)
     * @returns {FragmentIndex}
     */
    subarray(start, end) {
        return new FragmentIndex(
            this.durations.subarray(start, end),
            this.sizes.subarray(start, end),
            this.timescale
        );
    }

    /**
     * Concatenates this index with one or more other FragmentIndex instances
     * @param {...FragmentIndex} others - Additional fragment indices to append
     * @returns {FragmentIndex} New concatenated index
     */
    concat(...others) {
        const all = [this, ...others];
        const totalLength = all.reduce((sum, idx) => sum + idx.length, 0);
        const newDurations = new Uint32Array(totalLength);
        const newSizes = new Uint32Array(totalLength);
        const timescale = all[0].timescale;

        all.reduce((offset, idx) => {
            ArrayCopyUtils.set(newDurations, idx.durations, offset);
            ArrayCopyUtils.set(newSizes, idx.sizes, offset);
            return offset + idx.length;
        }, 0);

        return new FragmentIndex(newDurations, newSizes, timescale);
    }

    /**
     * Computes total byte size across all fragments
     * @returns {number}
     * @private
     */
    _computeTotalLength() {
        const sizes = this.sizes;
        const count = this.length;
        let total = 0;
        for (let i = 0; i < count; ++i) {
            total += sizes[i];
        }
        return total;
    }
}
