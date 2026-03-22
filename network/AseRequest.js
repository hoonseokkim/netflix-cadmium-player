/**
 * @module AseRequest
 * @description Adaptive Streaming Engine (ASE) request class. Manages HTTP media
 * segment requests including range requests, byte-range splitting, request lifecycle
 * (open/active/receiving/complete/abort), side-channel processing (X-TCP-Info,
 * X-NFLX-NCL), and fragment time debugging for live streams.
 * @see Module_50247
 */

import { __extends, __assign } from '../core/tslib.js';
import { EventEmitter } from '../events/EventEmitter.js';
import { mp4BoxParser } from '../mp4/MP4BoxParser.js';
import { assert } from '../assert/Assert.js';
import { stateEnum, HTTPRequestWrapper } from '../network/HttpRequestWrapper.js';
import { MediaType, TimeUtil, FI as getMediaTypeName } from '../media/MediaTypes.js';
import { dk as isLiveStream } from '../streaming/StreamUtils.js';
import { internal_Rla } from '../network/NetworkConfig.js';
import { t$a as aseRequestType } from '../network/NetworkTypes.js';
import { xW as BaseMediaRequest } from '../network/BaseMediaRequest.js';
import { outputList } from '../core/Registry.js';

/**
 * Enum representing the append state of a request.
 * @enum {number}
 */
export const AppendState = Object.freeze({
    NOTHING_APPENDED: 0,
    PARTIAL: 1,
    COMPLETE: 2,
    ERROR: 3
});

/**
 * AseRequest manages a single media segment HTTP request, potentially split
 * across multiple sub-requests (range requests). Handles request lifecycle,
 * byte-range management, stalling/resuming, and response processing.
 */
export class AseRequest extends BaseMediaRequest {
    /**
     * @param {Object} stream - The media stream object.
     * @param {Object} requestLabel - Request metadata/label.
     * @param {string} label - Human-readable label.
     * @param {Object} properties - Request properties (byteRangeHint, responseType, etc).
     * @param {Object} currentSegment - The current segment being requested.
     * @param {Object} config - Player configuration.
     * @param {Object} console - Logger/console instance.
     */
    constructor(stream, requestLabel, label, properties, currentSegment, config, console) {
        super(stream, properties);

        /** @type {Object} */
        this.requestLabel = requestLabel;
        /** @type {string} */
        this.label = label;
        /** @type {Object} */
        this.properties = properties;
        /** @type {Object} */
        this.currentSegment = currentSegment;
        /** @type {Object} */
        this.config = config;
        /** @type {Object} */
        this.console = console;

        /** @type {string} */
        this.YN = internal_Rla.responseType;
        /** @type {EventEmitter} */
        this.events = new EventEmitter();
        /** @type {number} */
        this.requestState = stateEnum.CREATED;
        /** @type {number} */
        this.previousBytesReceived = 0;
        /** @type {number} */
        this.K8 = -Infinity;
        /** @type {Array} */
        this.completedRequests = [];
        /** @type {number} */
        this.processedResponseIndex = 0;
        /** @type {boolean} */
        this.isRangeRequest = false;

        this.G5a(currentSegment);
        this.requestState = stateEnum.CREATED;
        this.requestUrl = stream.L0(!!properties.isEndOfStream, properties.byteRangeHint);
        this.finalUrl = stream.location || properties.location;
        this.sourceBufferIndex = stream.liveAdjustAudioTimestamps || properties.sourceBufferIndex;
        this.byteRangeHint = properties.byteRangeHint;
        this.isRangeRequest = (properties.la <= 0) && this.isOpenRangeSupported();
        this.initializeSubRequests(requestLabel, label, properties);
    }

    /** @returns {boolean} Always false for this request type. */
    get Ee() { return false; }

    /** @returns {number} Current request state. */
    get state() { return this.requestState; }

    /** @returns {boolean} True if request is opened but not complete. */
    get opened() {
        return this.requestState >= stateEnum.OPENED && this.requestState < stateEnum.COMPLETE;
    }

    /** @returns {boolean} True if request is active but not complete. */
    get active() {
        return this.requestState >= stateEnum.ACTIVE && this.requestState < stateEnum.COMPLETE;
    }

    /** @returns {boolean} True if currently receiving data. */
    get isReceiving() { return this.requestState === stateEnum.RECEIVING; }

    /** @returns {boolean} True if request completed successfully. */
    get complete() { return this.requestState === stateEnum.COMPLETE; }

    /** @returns {boolean} True if request was aborted. */
    get aborted() { return this.requestState === stateEnum.ABORTED; }

    /** @returns {boolean} True if request is stalled. */
    get isStalled() { return this.stalledRange !== undefined; }

    /** @returns {string} The request URL. */
    get url() { return this.requestUrl; }

    /** @returns {number|undefined} HTTP status code. */
    get status() { return this.failedRequest?.status || this.completedRequests[0].status; }

    /** @returns {string|undefined} Error code from failed sub-request. */
    get errorCode() { return this.failedRequest?.errorCode; }

    /** @returns {string|undefined} Error name from failed sub-request. */
    get errorName() { return this.failedRequest?.errorName; }

    /** @returns {*} Additional error data. */
    get dh() { return this.failedRequest?.dh; }

    /** @returns {number} Total bytes received so far. */
    get bytesReceived() { return this.previousBytesReceived; }

    /** @returns {number} Latest request timestamp. */
    get requestTimestamp() { return this.K8; }

    /** @returns {*} Response type from properties. */
    get responseType() { return this.properties.responseType; }

    /** @returns {string} Final URL after redirects. */
    get location() { return this.finalUrl; }

    /** @returns {number} Source buffer index. */
    get md() { return this.sourceBufferIndex; }

    /** @returns {*} Request class identifier. */
    get requestClass() { return this.properties.rC; }

    /**
     * Updates the final URL and source buffer index (e.g., after TFDT parsing).
     */
    parseTfdt(url, sourceBufferIndex) {
        this.finalUrl = url;
        this.sourceBufferIndex = sourceBufferIndex;
    }

    /**
     * @returns {boolean} Whether all sub-requests are in a state that allows appending.
     */
    canAppend() {
        if (this.state < stateEnum.RECEIVING) return false;
        return this.completedRequests.every(
            r => r.state === stateEnum.RECEIVING || r.state === stateEnum.COMPLETE
        );
    }

    /**
     * Checks if the stream URL needs updating, and swaps if necessary.
     * @returns {number} 0 = no update needed, 1 = missing URL, 2 = swap failed.
     */
    updateStreamUrl() {
        if (this.complete) return 0;
        const stream = this.stream;
        const session = stream.viewableSession;
        const needsUpdate = session.mM;
        if (!stream.url) {
            this.console.RETRY('updateurl, missing url for streamId:', stream.selectedStreamId,
                'mediaRequest:', this, 'stream:', stream);
            return 1;
        }
        const newUrl = stream.L0(this.isEndOfStream, this.byteRangeHint);
        if (this.url !== newUrl || needsUpdate) {
            session.parseTfdt(this, stream.location, stream.liveAdjustAudioTimestamps);
            if (!this.swapUrl(newUrl)) {
                this.console.RETRY('swapUrl failed: ', this.errorName);
                return 2;
            }
        }
        return 0;
    }

    /** @returns {boolean} Whether the first sub-request has an error on an open range request. */
    hasOpenRangeError() {
        return this.la <= 0 && this.completedRequests.length >= 1 &&
            this.completedRequests[0].errorCode !== undefined;
    }

    /**
     * Sends all sub-requests.
     * @returns {boolean} True if all sub-requests were sent successfully.
     */
    send() {
        this.RMa?.IMc();
        const allSent = this.completedRequests.every(r => r.send());
        if (allSent) {
            this.requestState = stateEnum.OPENED;
            this.extractBytes(this);
        }
        return allSent;
    }

    /**
     * Resumes a stalled request.
     * @returns {boolean} True if resume was successful.
     */
    resume() {
        assert(this.stalledRange !== undefined, 'invalid attempt to resume request that is not stalled');
        const resumed = this.validateByteRange(this.stalledRange.offset, this.stalledRange.la);
        if (resumed) this.stalledRange = undefined;
        return resumed;
    }

    /**
     * Aborts the request and all sub-requests.
     * @returns {boolean} Always true.
     */
    abort() {
        if (this.requestState !== stateEnum.ABORTED) {
            const wasActive = this.active;
            const wasOpened = this.opened;
            this.requestState = stateEnum.ABORTED;
            this.completedRequests.forEach(r => r.abort());
            this.stalledRange = undefined;
            this.j0(this, wasActive, wasOpened);
        }
        return true;
    }

    /** Disposes all sub-requests and clears stalled state. */
    dispose() {
        this.completedRequests.forEach(r => r.dispose());
        this.stalledRange = undefined;
    }

    /**
     * Gets a response header from the first sub-request that has it.
     * @param {string} name - Header name.
     * @param {boolean} caseSensitive - Whether to match case-sensitively.
     * @returns {string|null}
     */
    getResponseHeader(name, caseSensitive) {
        let value = null;
        this.completedRequests.some(r => !!(value = r.getResponseHeader(name, caseSensitive)));
        return value;
    }

    /** @returns {string} Composite request ID string. */
    getRequestId() {
        if (this.completedRequests.length === 1) {
            return this.completedRequests[0].getRequestId();
        }
        return '(' + this.completedRequests.map(r => r.getRequestId()).join(', ') + ')';
    }

    toString() {
        return 'ID: ' + this.getRequestId();
    }

    // --- Private/internal methods ---

    /** @private */
    initializeSubRequests(requestLabel, label, properties) {
        if (properties.la > 0) {
            if (properties.maxRequestSize && properties.la > properties.maxRequestSize) {
                this.splitIntoChunks(requestLabel, label, properties, properties.maxRequestSize, properties);
            } else {
                this.makeRangeRequest(requestLabel, label, properties, properties);
            }
        } else if (this.isRangeRequest) {
            this.makeRangeRequest(requestLabel, label, properties, properties);
        } else {
            let offset = properties.offset;
            let fetchSize;
            if (properties.index !== undefined) {
                fetchSize = this.stream.$Bb(properties.index);
            }
            if (!fetchSize) {
                fetchSize = this.mediaType === MediaType.TEXT_MEDIA_TYPE
                    ? this.config.liveTextInitialFetchSizeBytes
                    : this.config.liveInitialFetchSizeBytes;
            }
            if (this.config.debugFragmentTimes || this.config.enableForcedJsRequests) {
                properties = {
                    ...properties,
                    responseType: 0,
                    enableForcedJsRequests: this.config.enableForcedJsRequests
                };
            }
            this.makeRangeRequest(requestLabel, label, properties, { offset, la: fetchSize });
        }
    }

    /** @private */
    splitIntoChunks(requestLabel, label, properties, maxSize, range) {
        let numChunks = Math.ceil(range.la / maxSize);
        let offset = range.offset;
        let remaining = range.la;
        while (remaining > 0) {
            const chunkSize = Math.ceil(remaining / numChunks);
            this.makeRangeRequest(requestLabel, label, properties, { offset, la: chunkSize });
            offset += chunkSize;
            remaining -= chunkSize;
            numChunks--;
        }
    }

    /** @private */
    isOpenRangeSupported() {
        return !!this.requestLabel.GUb;
    }

    /** @private */
    makeRangeRequest(requestLabel, label, properties, range) {
        const subRequest = new HTTPRequestWrapper(
            this.stream, this.requestUrl, requestLabel, label,
            properties, range, this, this.currentSegment, this.config, this.console
        );
        this.completedRequests.push(subRequest);
        if (this.state >= stateEnum.OPENED) {
            subRequest.send();
            if (this.state >= stateEnum.COMPLETE) {
                this.requestState = stateEnum.OPENED;
                this.extractBytes(this);
            }
        }
    }
}

outputList(aseRequestType, AseRequest, false);
