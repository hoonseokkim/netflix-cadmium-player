/**
 * @module MediaRequestQueue
 * @description A specialized sorted collection for managing media download requests.
 * Extends a base sorted array to track requests across three states: complete,
 * active (in-progress), and pending (not yet started). Maintains byte counters,
 * contiguous range tracking, and provides methods for request lifecycle management
 * including adding, removing, completing, aborting, and splicing requests.
 * @original Module_21306
 */

// import { __extends, __read, __spreadArray } from 'tslib';
// import { assert } from '../assert/Assert';                    // Module 52571
// import { SortedArray } from '../classes/SortedArray';         // Module 99735
// import { registerClass } from '../core/Registry';            // Module 85254
// import { RequestBucket } from '../streaming/RequestBucket';  // Module 71472
// import { processingContext } from '../streaming/ProcessingContext'; // Module 71808
// import { bP } from '../streaming/StreamingTokens';           // Module 81392
// import { ContiguousRange } from '../streaming/ContiguousRange'; // Module 5800

/**
 * A queue of media requests organized by state: complete, active, and pending.
 * Tracks total received bytes, contiguous byte ranges, and provides request
 * lifecycle management.
 *
 * @extends SortedArray
 */
export class MediaRequestQueue extends SortedArray {
    /**
     * @param {Object} logger - Console/logger instance
     * @param {Object} config - Queue configuration
     */
    constructor(logger, config) {
        const buckets = [
            new RequestBucket(logger),
            new RequestBucket(logger),
            new RequestBucket(logger)
        ];

        // Sorting function: complete=0, active=1, pending=2
        super(buckets, (request) => {
            if (request.complete) {
                return this.empty || request.contentStartTicks <= this.completedEndTicks ? 0 : 1;
            }
            return request.active ? 1 : 2;
        });

        const [completeBucket, activeBucket, pendingBucket] = buckets;

        /** @type {RequestBucket} Completed requests */
        this.completeBucket = completeBucket;

        /** @type {RequestBucket} Active (in-progress) requests */
        this.activeBucket = activeBucket;

        /** @type {RequestBucket} Pending (not started) requests */
        this.pendingBucket = pendingBucket;

        /** @type {number} Total bytes received across all non-aborted requests */
        this.receivedBytes = 0;

        /** @private @type {number} Count of aborted requests */
        this._abortedCount = 0;

        /** @private */
        this._logger = logger;

        /** @private */
        this._config = config;
    }

    // ─── Computed Properties ───

    /** @type {number} Total byte count across all buckets */
    get totalBytes() {
        return this.completeBucket.la + this.activeBucket.la + this.pendingBucket.la;
    }

    /** @type {RequestBucket} The pending requests bucket */
    get pendingRequests() {
        return this.pendingBucket;
    }

    /** @type {RequestBucket} The active requests bucket */
    get activeRequests() {
        return this.activeBucket;
    }

    /** @type {RequestBucket} The completed requests bucket */
    get completeRequests() {
        return this.completeBucket;
    }

    /** @type {number} Number of bytes received (alias) */
    get totalReceivedBytes() {
        return this.receivedBytes;
    }

    /** @type {number} Bytes in completed requests */
    get completedBytes() {
        return this.completeBucket.la;
    }

    /** @type {number} Active bytes minus received bytes (buffered but not yet complete) */
    get bufferedBytes() {
        return this.completeBucket.la + this.activeBucket.la - this.receivedBytes;
    }

    /** @type {number} Pending bytes count */
    get pendingBytes() {
        return this.pendingBucket.la;
    }

    /** @type {number} Total bytes minus received bytes */
    get remainingBytes() {
        return this.totalBytes - this.receivedBytes;
    }

    /** @type {Object|undefined} First request in the queue */
    get firstRequest() {
        return this.wuc();
    }

    /** @type {Object|undefined} Last request in the queue */
    get lastRequest() {
        return this.internal_Pdc();
    }

    /**
     * @type {Object|undefined} The earliest request by start time
     * Picks from active or pending bucket based on which starts earlier.
     */
    get earliestRequest() {
        if (!this.completeBucket.empty || this.pendingBucket.empty || this.activeBucket.empty) {
            return this.firstRequest;
        }
        return this.activeBucket.contentStartTicks < this.pendingBucket.contentStartTicks
            ? this.activeBucket.first
            : this.pendingBucket.first;
    }

    /**
     * @type {Object|undefined} The request at the latest network interruption boundary
     */
    get latestInterruptionRequest() {
        if (this.pendingBucket.empty || this.activeBucket.empty) {
            return this.networkInterruptionTime;
        }
        return this.activeBucket.contentEndTicks < this.pendingBucket.contentEndTicks
            ? this.pendingBucket.networkInterruptionTime
            : this.activeBucket.networkInterruptionTime;
    }

    /** @type {Object|undefined} First request in the pending bucket */
    get firstPendingRequest() {
        return this.pendingBucket.first;
    }

    /** @type {number|undefined} Timescale value from the first request */
    get timescale() {
        return this.firstRequest?.timescaleValue;
    }

    /** @type {number|undefined} Content start ticks of the earliest request */
    get contentStartTicks() {
        return this.earliestRequest?.contentStartTicks;
    }

    /** @type {number|undefined} Content end ticks of the latest interruption request */
    get contentEndTicks() {
        return this.latestInterruptionRequest?.contentEndTicks;
    }

    /** @type {*} Cached metadata from the first request */
    get cachedMetadata() {
        return this.firstRequest?.cachedMetadata;
    }

    /**
     * @type {number} End ticks of the completed range.
     * If complete bucket is empty, returns contentStartTicks.
     */
    get completedEndTicks() {
        return this.completeBucket.empty ? this.contentStartTicks : this.completeBucket.contentEndTicks;
    }

    /** @type {*} Completed segment playback segment reference */
    get completedSegment() {
        return this.completeBucket.empty
            ? this.presentationStartTime?.playbackSegment
            : this.completeBucket.segmentEndTime.playbackSegment;
    }

    /** @type {*} Previously completed segment reference */
    get previousSegment() {
        return this.completeBucket.empty
            ? this.timestamp?.playbackSegment
            : this.completeBucket.previousState.playbackSegment;
    }

    /** @type {*} Previous state playback segment from active or complete bucket */
    get previousActiveSegment() {
        return this.activeBucket.previousState?.playbackSegment ||
            this.completeBucket.previousState?.playbackSegment;
    }

    /** @type {number} Pending bucket length */
    get pendingCount() {
        return this.pendingBucket.length;
    }

    /** @type {number} Active bucket length */
    get activeCount() {
        return this.activeBucket.length;
    }

    /** @type {number} Complete bucket length */
    get completeCount() {
        return this.completeBucket.length;
    }

    /** @type {Array} Concatenation of complete and active requests */
    get allActiveRequests() {
        return this.completeBucket.concat(this.activeBucket);
    }

    /** @type {*} Current contiguous range state */
    get contiguousRange() {
        return this.currentState;
    }

    // ─── Validation ───

    /**
     * Validates internal consistency of the request queue.
     * Asserts that byte counts match, buckets contain correctly-stated requests,
     * and contiguous ranges are accurate.
     */
    trimToEditBoundaries() {
        if (this.length === 0) {
            assert(this.receivedBytes === 0);
            assert(this.completeBucket.empty);
            assert(this.activeBucket.empty);
            assert(this.pendingBucket.empty);
        } else {
            assert(this.completeBucket.every((r) => r.complete || r.aborted));
            assert(this.activeBucket.every((r) => r.active || r.complete || r.aborted));
            assert(this.pendingBucket.every((r) => !r.active && !r.complete));

            if (!this.activeBucket.empty && this.activeBucket.first.complete) {
                if (this.completeBucket.empty) {
                    assert(
                        !this.pendingBucket.empty &&
                        this.activeBucket.contentStartTicks > this.pendingBucket.contentStartTicks,
                        'unsent earlier than active'
                    );
                } else {
                    assert(
                        this.activeBucket.contentStartTicks > this.completeBucket.contentEndTicks,
                        'gap in complete array'
                    );
                }
            }

            // Verify receivedBytes matches sum of non-aborted request bytes
            const expectedBytes =
                this.completeBucket.reduce((sum, r) => sum + (r.aborted ? 0 : r.bytesReceived), 0) +
                this.activeBucket.reduce((sum, r) => sum + (r.aborted ? 0 : r.bytesReceived), 0);

            if (this.receivedBytes !== expectedBytes) {
                assert(false, 'receivedBytes does not match complete + active');
            }

            // Verify contiguous range
            const contiguous = this.internal_Caa;
            if (this.empty) {
                assert(contiguous === undefined);
            } else {
                assert(contiguous !== undefined);
                const sorted = this.map((r) => r).sort(
                    (a, b) => a.contentStartTicks - b.contentStartTicks
                );
                assert(contiguous.contentStartTicks === sorted[0].contentStartTicks);

                let endTicks = sorted[0].contentEndTicks;
                for (let i = 1; i < sorted.length && sorted[i].contentStartTicks === endTicks; ++i) {
                    endTicks = sorted[i].contentEndTicks;
                }
                assert(contiguous.contentEndTicks === endTicks, 'contiguousEnd mismatch');
            }

            this.ue.forEach((bucket) => bucket.trimToEditBoundaries());
        }
    }

    // ─── Request Lifecycle ───

    /**
     * Called when a request is added to the queue.
     * Updates received bytes and contiguous range tracking.
     *
     * @private
     * @param {Object} request - The media request being added
     */
    _onRequestAdded(request) {
        if (request.aborted) {
            ++this._abortedCount;
        } else {
            this.receivedBytes += request.bytesReceived || 0;
        }

        if (this.empty) {
            this.currentState = new ContiguousRange(this, {});
        } else if (request.contentStartTicks !== this.contentEndTicks) {
            if (request.contentStartTicks > this.currentState.contentEndTicks) {
                this.currentState.f4(this.currentState.contentEndTicks);
            } else if (
                request.contentStartTicks < this.contentStartTicks ||
                request.contentStartTicks === this.currentState.contentEndTicks
            ) {
                let endTicks = request.contentEndTicks;
                this.sortByComparator(
                    (a, b) => a.contentStartTicks - b.contentStartTicks,
                    (item) => {
                        endTicks = item.contentStartTicks === endTicks ? item.contentEndTicks : endTicks;
                    }
                );
                if (endTicks === Math.max(this.contentEndTicks, request.contentEndTicks)) {
                    this.currentState.tpa();
                } else {
                    this.currentState.f4(endTicks);
                }
            }
        }

        request.G5a(this);
    }

    /**
     * Called when a request is removed from the queue.
     * Updates byte counters and contiguous range.
     *
     * @private
     * @param {Object} request - The media request being removed
     */
    _onRequestRemoved(request) {
        if (request.aborted) {
            --this._abortedCount;
        } else {
            this.receivedBytes -= request.bytesReceived;
        }

        if (this.empty) {
            this.currentState = undefined;
        } else if (
            request.contentStartTicks !== this.contentEndTicks &&
            request.contentEndTicks <= this.currentState.contentEndTicks &&
            request.contentStartTicks > this.currentState.contentStartTicks
        ) {
            this.currentState.f4(request.contentStartTicks);
        }

        request.uub();
    }

    /**
     * Recalculates contiguous range after bulk modifications.
     */
    update() {
        this.completeBucket.update();
        this.activeBucket.update();
        this.pendingBucket.update();

        if (this.currentState) {
            const sorted = this.map((r) => r).sort(
                (a, b) => a.contentStartTicks - b.contentStartTicks
            );
            this.currentState.tpa();
            let endTicks = sorted[0].contentEndTicks;
            for (let i = 1; i < sorted.length; ++i) {
                if (sorted[i].contentStartTicks !== endTicks) {
                    this.currentState.f4(endTicks);
                    break;
                }
                endTicks = sorted[i].contentEndTicks;
            }
        }
    }

    /**
     * Pushes a request and updates tracking.
     * @param {Object} request
     * @returns {number} New length
     */
    push(request) {
        this._onRequestAdded(request);
        return super.push(request);
    }

    /**
     * Shifts the first request off and updates tracking.
     * @returns {Object|undefined} The removed request
     */
    shift() {
        const request = super.shift();
        if (request) this._onRequestRemoved(request);
        return request;
    }

    /**
     * Pops the last request and updates tracking.
     * @returns {Object|undefined} The removed request
     */
    pop() {
        const request = super.pop();
        if (request) this._onRequestRemoved(request);
        return request;
    }

    /**
     * Unshifts a request to the front and updates tracking.
     * @param {Object} request
     * @returns {number} New length
     */
    unshift(request) {
        this._onRequestAdded(request);
        return super.unshift(request);
    }

    /**
     * Inserts a request at its sorted position.
     * @param {Object} request
     */
    insertNode(request) {
        this._onRequestAdded(request);
        super.insertNode(request);
    }

    /**
     * Removes a specific request from the queue.
     * @param {Object} request
     * @returns {boolean} Whether the request was found and removed
     */
    remove(request) {
        if (!super.remove(request)) return false;
        this._onRequestRemoved(request);
        return true;
    }

    /**
     * Splices requests in/out of the queue with proper tracking.
     * @param {number} start - Start index
     * @param {number} deleteCount - Number to remove
     * @param {...Object} items - Items to insert
     * @returns {Array} Removed items
     */
    splice(start, deleteCount, ...items) {
        const removed = super.splice(start, deleteCount, ...items);
        items.forEach(this._onRequestAdded.bind(this));
        removed.forEach(this._onRequestRemoved.bind(this));
        return removed;
    }

    /**
     * Removes all aborted requests from the queue.
     * @param {Function} [callback] - Optional callback called for each removed request
     */
    removeAbortedRequests(callback) {
        this.reduce((ranges, request, index) => {
            if (request.aborted && !request.NB) {
                if (callback) callback(request, index, this);
                if (ranges.length === 0 || ranges[0].end !== index) {
                    ranges.unshift({ start: index, end: index + 1 });
                } else {
                    ranges[0].end += 1;
                }
            }
            return ranges;
        }, []).forEach((range) => {
            this.splice(range.start, range.end - range.start);
        });
    }

    /**
     * Finds a request by start ticks.
     * @param {number} startTicks
     * @returns {number} Index or -1
     */
    findByStartTicks(startTicks) {
        return this.eAb((bucket) => bucket.ZTa(startTicks));
    }

    /**
     * Finds a request by end ticks.
     * @param {number} endTicks
     * @returns {number} Index or -1
     */
    findByEndTicks(endTicks) {
        return this.eAb((bucket) => bucket.iba(endTicks));
    }

    /**
     * Gets the request at a given end ticks position.
     * @param {number} endTicks
     * @returns {Object|undefined}
     */
    getByEndTicks(endTicks) {
        const index = this.findByEndTicks(endTicks);
        return index !== -1 ? this.key(index) : undefined;
    }

    /**
     * Gets all requests from the given index onward.
     * @param {number} startIndex
     * @returns {Array}
     */
    getRequestsFrom(startIndex) {
        const results = [];
        while (startIndex < this.length) {
            const request = this.key(startIndex);
            if (request) results.push(request);
            startIndex++;
        }
        return results;
    }

    // ─── State Change Handlers ───

    /**
     * Called when a request becomes active (download started).
     * @param {Object} request
     */
    onRequestActive(request) {
        this.move(request);
        this.wba(request);
    }

    /**
     * Called when data is received for a request.
     * @param {Object} request
     * @param {number} bytes - New bytes received
     */
    onDataReceived(request, bytes) {
        this.receivedBytes += bytes;
        this.onDataReceived(request, bytes);
    }

    /**
     * Called when a request completes successfully.
     * @param {Object} request
     * @param {number} bytes - Final bytes received
     */
    onRequestComplete(request, bytes) {
        this.receivedBytes += bytes;
        this._promoteCompletedRequests();
        this.onRequestCompleted(request, bytes);
    }

    /**
     * Called when a request is redirected to a different branch.
     * @param {Object} request
     * @param {*} newTarget
     * @param {*} context
     */
    onRequestRedirectedBranch(request, newTarget, context) {
        this.receivedBytes -= request.bytesReceived;
        ++this._abortedCount;
        this.j0(request, newTarget, context);
    }

    /**
     * Called when content length changes for a request.
     * @param {Object} request
     * @param {number} newLength
     * @param {number} oldLength
     */
    onContentLengthChanged(request, newLength, oldLength) {
        this.activeBucket.G2c(newLength - oldLength);
        this.zUa(request, newLength, oldLength);
    }

    /**
     * Triggers promotion of completed active requests.
     */
    pNc() {
        this._promoteCompletedRequests();
    }

    /**
     * Promotes completed requests from active bucket to complete bucket
     * when they form a contiguous range.
     * @private
     */
    _promoteCompletedRequests() {
        while (
            this.activeBucket.first &&
            (this.activeBucket.first.complete || this.activeBucket.first.NB) &&
            (this.completeBucket.empty
                ? this.activeBucket.first === this.earliestRequest
                : this.activeBucket.first.contentStartTicks === this.completeBucket.contentEndTicks)
        ) {
            this.qYc();
        }
    }

    /**
     * Returns diagnostic info about completed requests.
     * @returns {Array<{requestId: *, appended: boolean, isAppendable: boolean}>}
     */
    getCompletedRequestInfo() {
        return this.completeBucket.map((request) => ({
            requestId: request.getRequestId(),
            appended: request.appended,
            isAppendable: request.canAppend()
        }));
    }
}

registerClass(/* bP */ undefined, MediaRequestQueue, false);
registerClass(/* processingContext */ undefined, MediaRequestQueue);

export default MediaRequestQueue;
