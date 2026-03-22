/**
 * Netflix Cadmium Player - Request Ledger
 *
 * Tracks timing information for individual media download requests,
 * recording timestamps at key lifecycle points: send, load, first byte,
 * and completion. Generates trace strings for debugging/telemetry that
 * indicate whether requests completed within their expected duration.
 *
 * @module RequestLedger
 * @see Module_1936
 */

import { platform } from '../core/Platform.js';
import { globalExtension } from '../core/GlobalExtension.js';

/** @type {string[]} Per-media-type trace strings tracking request completion patterns */
const traceHistory = ["", "", ""];

/**
 * Records timing data for a single media download request lifecycle.
 */
export class RequestLedger {
    /**
     * @param {Object} request - The media request being tracked
     */
    constructor(request) {
        /** @type {Object} The tracked request */
        this.request = request;

        /** @type {number} Timestamp when request was sent */
        this.sendTime = 0;

        /** @type {number} Timestamp when connection opened */
        this.openTime = 0;

        /** @type {number} Timestamp when first byte received */
        this.firstByteTime = 0;

        /** @type {number} Timestamp when request completed */
        this.completeTime = 0;
    }

    /**
     * Returns the logger for this request's media type.
     * @returns {Object} Logger instance
     */
    get console() {
        return globalExtension.pE(this.request.mediaType);
    }

    /**
     * Returns the expected duration from the request offset.
     * @returns {number|undefined} Expected segment duration
     */
    get expectedDuration() {
        return this.request.offset?.playbackSegment;
    }

    /** Records the send timestamp. */
    onSend() {
        this.sendTime = platform.platform.now();
    }

    /** Records the connection open timestamp and logs trace. */
    onOpen() {
        this.openTime = platform.platform.now();
        this._trace();
    }

    /** Records the first byte timestamp and logs trace. */
    onFirstByte() {
        this.firstByteTime = platform.platform.now();
        this._trace();
    }

    /** Records the completion timestamp and logs trace. */
    onComplete() {
        this.completeTime = platform.platform.now();
        this._trace();
    }

    /**
     * Generates a debug trace string with timing intervals and updates
     * the per-media-type history with completion status markers.
     * @private
     */
    _trace() {
        let trace = `RequestLedger ID: ${this.request.getRequestId()}`;
        trace += ` load-open: ${this.openTime - this.sendTime}`;

        if (this.firstByteTime > 0) {
            // firstbyte-load interval (constructed but not appended in original)
        }

        if (this.completeTime > 0) {
            const totalTime = this.completeTime - this.sendTime;
            const mediaType = this.request.mediaType;

            if (this.expectedDuration && totalTime > this.expectedDuration) {
                // Request took longer than expected duration
                traceHistory[mediaType] += "X";
            } else {
                traceHistory[mediaType] += ".";
            }

            // Keep only last 10 characters of trace history
            if (traceHistory[mediaType].length > 10) {
                traceHistory[mediaType] = traceHistory[mediaType].slice(1);
            }
        }
    }
}
