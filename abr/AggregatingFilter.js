/**
 * Netflix Cadmium Player — AggregatingFilter
 *
 * A filter wrapper that buffers incoming data samples before forwarding
 * them to a delegate filter. Maintains a sliding window of at most `maxN`
 * samples, adjusting timestamps with an accumulating offset whenever
 * discontinuities (seeks) are detected.
 *
 * Used in the ABR (adaptive bitrate) pipeline to smooth out bursty
 * throughput observations before they reach the bandwidth estimator.
 *
 * @module abr/AggregatingFilter
 * @original Module_47317
 */

// import { __read, __values } from 'tslib';                // Module 22970
// import { TCc as insertSorted } from './SortedInsert';     // Module 77399

export class AggregatingFilter {
    /**
     * @param {Object} filterParams - Configuration parameters
     * @param {number} [filterParams.max_n=10] - Maximum number of buffered samples
     * @param {Object} filter - Delegate filter that receives forwarded samples
     */
    constructor(filterParams, filter) {
        /** @type {Object} Filter configuration */
        this.filterParams = filterParams;

        /** @type {Object} Delegate filter */
        this.filter = filter;

        /** @type {number} Maximum number of samples to buffer */
        this.maxBufferedSamples = Math.max(filterParams.max_n || 10, 0);

        this.reset();
    }

    /**
     * Reset internal state — clears the sample buffer, offset, and delegate.
     */
    reset() {
        /** @type {Array} Buffered samples: [adjustedStart, adjustedEnd, value] */
        this.pendingSamples = [];

        /** @type {number} Accumulated timestamp offset from seek discontinuities */
        this.offset = 0;

        /** @type {number|null} Start time of pending data */
        this.startTime = null;

        /** @type {number|null} Last reported seek/discontinuity time */
        this.lastSeekTime = null;

        this.filter.reset();

        /** @type {Object|null} Cached clone of filter with pending samples applied */
        this.cachedFilterClone = null;
    }

    /**
     * Add a new data sample. Adjusts timestamps by the current offset,
     * buffers the sample, and flushes overflow to the delegate filter.
     *
     * @param {number} value - Sample value (e.g., bytes downloaded)
     * @param {number} startTime - Sample start timestamp (ms)
     * @param {number} endTime - Sample end timestamp (ms)
     */
    addSample(value, startTime, endTime) {
        const lastSeek = this.lastSeekTime;

        // Detect discontinuity and adjust offset
        if (lastSeek !== null && endTime > lastSeek) {
            this.offset += Math.max(startTime - lastSeek, 0);
            this.lastSeekTime = null;
        }

        // Insert sorted by adjusted timestamps
        insertSorted(this.pendingSamples, [
            startTime - this.offset,
            endTime - this.offset,
            value,
        ]);

        // Flush overflow to delegate filter
        while (this.pendingSamples && this.pendingSamples.length > this.maxBufferedSamples) {
            const [sampleStart, sampleEnd, sampleValue] = this.pendingSamples.shift();
            this.filter.addSample(sampleValue, sampleStart, sampleEnd);
        }

        this.cachedFilterClone = null;
    }

    /**
     * Query the filter for a throughput estimate, including pending samples.
     * Lazily creates a clone of the delegate filter with all pending samples
     * applied for the query.
     *
     * @param {number} currentTime - Current playback time (ms)
     * @param {*} interpolation - Interpolation parameter for the delegate filter
     * @returns {*} Throughput estimate from the delegate filter
     */
    query(currentTime, interpolation) {
        if (!this.cachedFilterClone) {
            this.cachedFilterClone = this.filter.clone();
            for (const [start, end, value] of this.pendingSamples) {
                this.cachedFilterClone.addSample(value, start, end);
            }
        }

        const lastSeek = this.lastSeekTime;
        return this.cachedFilterClone.query(
            (lastSeek === null ? currentTime : lastSeek) - this.offset,
            interpolation
        );
    }

    /**
     * Clone this aggregating filter (with its current state).
     * @returns {AggregatingFilter}
     */
    clone() {
        const cloned = new AggregatingFilter(this.filterParams, this.filter.clone());
        cloned.lastSeekTime = this.lastSeekTime;
        cloned.offset = this.offset;
        return cloned;
    }

    /**
     * Notify the filter that playback has started/resumed at a given time.
     * Adjusts for any pending seek discontinuity.
     * @param {number} time - Playback start time (ms)
     */
    start(time) {
        const lastSeek = this.lastSeekTime;
        if (lastSeek !== null && time > lastSeek) {
            this.offset += time - lastSeek;
            this.lastSeekTime = null;
        }
        this.filter.start(time - this.offset);
    }

    /**
     * Record a timer/seek event. Tracks the minimum seek time to detect
     * discontinuities when samples arrive later.
     * @param {number} time - Seek/timer time (ms)
     */
    recordSeek(time) {
        this.lastSeekTime =
            this.lastSeekTime === null ? time : Math.min(this.lastSeekTime, time);
        this.filter.recordSeek(time - this.offset);
    }

    /**
     * Flush/finalize the delegate filter's batch state.
     */
    flushBatch() {
        this.filter.flushBatch();
    }

    /**
     * @returns {string} Human-readable description
     */
    toString() {
        return `AggregatingFilter(${this.maxBufferedSamples}, ${this.filter.toString()})`;
    }
}
