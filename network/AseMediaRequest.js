/**
 * AseMediaRequest - Represents a single media segment HTTP request.
 *
 * Extends BaseMediaRequest to manage one or more HTTP sub-requests that together
 * fetch a media segment (audio/video/text). Handles request splitting for large
 * segments, open-range (live) requests, byte-range negotiation, stall recovery,
 * side-channel metadata extraction, and fragment-time debugging.
 *
 * @module AseMediaRequest
 * @webpack-module 50247
 * @exports AppendResult, AseMediaRequest
 */

import { __extends, __assign } from "../../tslib"; // Module 22970
import { EventEmitter } from "../../events/EventEmitter"; // Module 90745
import { mp4BoxParser } from "../../media/Mp4BoxParser"; // Module 91562
// Module 66164 - platform (side-effect import)
import { outputList } from "../../util/OutputList"; // Module 85254
import { assert } from "../../util/Assert"; // Module 52571
// Module 1936 - side-effect import
import { stateEnum, HTTPRequestWrapper } from "./HTTPRequestWrapper"; // Module 75539
import { MediaType, TimeUtil } from "../../media/MediaTypes"; // Module 45247
import { isLiveStream, isLiveStreamTrack } from "../../media/LiveStreamUtil"; // Module 8149
import { internal_Rla } from "../../config/RequestConfig"; // Module 24940
import { RequestListenerMixin } from "./RequestListenerMixin"; // Module 81392 (t$a)
import { BaseMediaRequest } from "./BaseMediaRequest"; // Module 78015 (xW)

/**
 * Result of attempting to append downloaded data to the source buffer.
 * @enum {number}
 */
export const AppendResult = Object.freeze({
    NOTHING_APPENDED: 0,
    PARTIAL: 1,
    COMPLETE: 2,
    ERROR: 3,
});

/**
 * Represents an ASE (Adaptive Streaming Engine) media request for a single
 * segment. Manages one or more HTTP sub-requests (HTTPRequestWrapper instances)
 * that collectively download the segment data.
 *
 * @extends BaseMediaRequest
 */
export class AseMediaRequest extends BaseMediaRequest {
    /**
     * @param {Object} stream - The media stream this request belongs to
     * @param {Object} requestLabel - Label/identifier for the request type
     * @param {string} label - Human-readable label (e.g., "moof", "mdat")
     * @param {Object} properties - Request properties including offset, size, responseType, etc.
     * @param {Object} listenerDelegate - Delegate that receives request lifecycle callbacks
     * @param {Object} currentSegment - The segment metadata being fetched
     * @param {Object} config - Player configuration
     * @param {Object} console - Logger instance
     */
    constructor(stream, requestLabel, label, properties, listenerDelegate, currentSegment, config, console) {
        super(stream, properties);

        /** @type {Object} Label/identifier for the request type */
        this.requestLabel = requestLabel;

        /** @type {string} Human-readable label */
        this.label = label;

        /** @type {Object} Request properties (offset, size, responseType, etc.) */
        this.properties = properties;

        /** @type {Object} The segment metadata being fetched */
        this.currentSegment = currentSegment;

        /** @type {Object} Player configuration */
        this.config = config;

        /** @type {Object} Logger instance */
        this.console = console;

        /** @type {number} Expected response type from platform config */
        this.platformResponseType = internal_Rla.responseType;

        /** @type {EventEmitter} Event emitter for request lifecycle events */
        this.events = new EventEmitter();

        /** @type {number} Current state of this request (see stateEnum) */
        this.requestState = stateEnum.CREATED;

        /** @type {number} Cumulative bytes received across all sub-requests */
        this.previousBytesReceived = 0;

        /** @type {number} Timestamp of the most recent sub-request activity */
        this._lastRequestTimestamp = -Infinity;

        /** @type {Array<HTTPRequestWrapper>} Sub-requests for this segment */
        this.completedRequests = [];

        /** @type {number} Index of next sub-request whose response data should be processed */
        this._processedResponseIndex = 0;

        /** @type {boolean} Whether this is a range request (for open-range/live) */
        this.isRangeRequest = false;

        // Set up the listener delegate (from RequestListenerMixin)
        this._setListenerDelegate(listenerDelegate);

        this.requestState = stateEnum.CREATED;

        /** @type {string} The URL to request from */
        this.requestUrl = stream.buildRequestUrl(!!properties.isEndOfStream, properties.byteRangeHint);

        /** @type {string} The final resolved URL (after redirects, etc.) */
        this.finalUrl = stream.location || properties.location;

        /** @type {*} Source buffer index for demuxing */
        this.sourceBufferIndex = stream.liveAdjustAudioTimestamps || properties.sourceBufferIndex;

        /** @type {*} Byte range hint for the segment */
        this.byteRangeHint = properties.byteRangeHint;

        // For open-range requests (la <= 0), determine if we should use range requests
        this.isRangeRequest = (0 >= properties.la) && this._shouldUseRangeRequest();

        // Initialize sub-requests
        this._initializeSubRequests(requestLabel, label, properties);
    }

    // ──────────────────────────────────────────────
    // Getters
    // ──────────────────────────────────────────────

    /** @returns {boolean} Always false for base AseMediaRequest (overridden in subclasses) */
    get isIndexRequest() {
        return false;
    }

    /** @returns {number} Current request state */
    get state() {
        return this.requestState;
    }

    /** @returns {boolean} True if request is opened but not yet complete */
    get isOpened() {
        return this.requestState >= stateEnum.OPENED && this.requestState < stateEnum.COMPLETE;
    }

    /** @returns {boolean} True if request is actively sending/receiving */
    get active() {
        return this.requestState >= stateEnum.ACTIVE && this.requestState < stateEnum.COMPLETE;
    }

    /** @returns {boolean} True if request is in the receiving state */
    get isReceiving() {
        return this.requestState === stateEnum.RECEIVING;
    }

    /** @returns {boolean} True if request completed successfully */
    get complete() {
        return this.requestState === stateEnum.COMPLETE;
    }

    /** @returns {boolean} True if request was aborted */
    get aborted() {
        return this.requestState === stateEnum.ABORTED;
    }

    /** @returns {boolean} True if request is stalled (waiting for byte range) */
    get isStalled() {
        return void 0 !== this.stalledRange;
    }

    /** @returns {string} The request URL */
    get url() {
        return this.requestUrl;
    }

    /** @returns {number} HTTP status code from the active or first completed sub-request */
    get status() {
        return this._activeFailedRequest?.status || this.completedRequests[0].status;
    }

    /** @returns {string|undefined} Error code if the request failed */
    get errorCode() {
        return this._activeFailedRequest?.errorCode;
    }

    /** @returns {string|undefined} Error name if the request failed */
    get errorName() {
        return this._activeFailedRequest?.errorName;
    }

    /** @returns {*} Additional error detail (dh property) */
    get errorDetail() {
        return this._activeFailedRequest?.dh;
    }

    /** @returns {number} Total bytes received so far */
    get bytesReceived() {
        return this.previousBytesReceived;
    }

    /** @returns {number} Timestamp of the last request activity */
    get lastRequestTimestamp() {
        return this._lastRequestTimestamp;
    }

    /** @returns {number} The response type from the properties */
    get responseType() {
        return this.properties.responseType;
    }

    /** @returns {string} The resolved/final location URL */
    get location() {
        return this.finalUrl;
    }

    /** @returns {*} The source buffer index */
    get sourceBufferIdx() {
        return this.sourceBufferIndex;
    }

    /** @returns {*} The CDN type identifier from request properties */
    get cdnTypeIdentifier() {
        return this.properties.rC;
    }

    // ──────────────────────────────────────────────
    // Public methods
    // ──────────────────────────────────────────────

    /**
     * Update the final URL and source buffer index (e.g., from tfdt parsing).
     * @param {string} url - The resolved final URL
     * @param {*} sourceBufferIndex - The source buffer index
     */
    parseTfdt(url, sourceBufferIndex) {
        this.finalUrl = url;
        this.sourceBufferIndex = sourceBufferIndex;
    }

    /**
     * Check whether the downloaded data can be appended to the source buffer.
     * All sub-requests must be either receiving or complete.
     * @returns {boolean}
     */
    canAppend() {
        if (this.state < stateEnum.RECEIVING) return false;
        return this.completedRequests.every(
            (subReq) => subReq.state === stateEnum.RECEIVING || subReq.state === stateEnum.COMPLETE
        );
    }

    /**
     * Update the stream URL if it has changed (e.g., for live stream URL rotation).
     * @returns {number} 0 = success, 1 = missing URL, 2 = swap failed
     */
    updateStreamUrl() {
        if (this.complete) return 0;

        const stream = this.stream;
        const session = stream.viewableSession;
        const needsUpdate = session.mM;

        if (!stream.url) {
            this.console.RETRY(
                "updateurl, missing url for streamId:", stream.selectedStreamId,
                "mediaRequest:", this, "stream:", stream
            );
            return 1;
        }

        const newUrl = stream.buildRequestUrl(this.isEndOfStream, this.byteRangeHint);

        if (this.url !== newUrl || needsUpdate) {
            session.parseTfdt(this, stream.location, stream.liveAdjustAudioTimestamps);
            if (!this.swapUrl(newUrl)) {
                this.console.RETRY("swapUrl failed: ", this.errorName);
                return 2;
            }
        }

        return 0;
    }

    /**
     * Check if the open-range request has failed.
     * @returns {boolean} True if this is an open-range request with a failed first sub-request
     */
    hasOpenRangeError() {
        return (0 >= this.la) &&
            (1 <= this.completedRequests.length) &&
            (void 0 !== this.completedRequests[0].errorCode);
    }

    /**
     * Change the stream for a failed open-range request (e.g., CDN failover).
     * @param {Object} newStream - The new stream to switch to
     */
    changeStream(newStream) {
        assert(0 >= this.la, "AseRequest.changeStream is only supported for open range requests");
        assert(
            1 <= this.completedRequests.length && void 0 !== this.completedRequests[0].errorCode,
            "AseRequest.changeStream only supported when open range request has failed"
        );
        assert(
            this.stream.track === newStream.track,
            "AseStream.changeStream cannot change stream to a different track"
        );
        this.getIdentifier(newStream);
        this.updateStreamUrl();
    }

    /**
     * Process available response data from completed sub-requests.
     * Iterates through sub-requests in order, invoking the loadRawData callback
     * for each newly available response.
     */
    processResponseData() {
        while (this._processedResponseIndex < this.completedRequests.length) {
            const subReq = this.completedRequests[this._processedResponseIndex];
            if (!subReq.response) break;

            ++this._processedResponseIndex;
            const isLastResponse = !this.endedEvent &&
                (this._processedResponseIndex === this.completedRequests.length);
            this.loadRawData?.call(this, subReq.response, isLastResponse);
            subReq.getPayloadSize();
        }
    }

    /**
     * Send all sub-requests. Transitions state to OPENED.
     * @returns {boolean} True if all sub-requests were sent successfully
     */
    send() {
        this._requestMonitor?.startMonitoring();

        const success = this.completedRequests.every((subReq) => subReq.send());
        if (success) {
            this.requestState = stateEnum.OPENED;
            this._notifyOpened(this);
        }
        return success;
    }

    /**
     * Resume a stalled request by validating and re-requesting the stalled byte range.
     * @returns {boolean} True if the request was successfully resumed
     */
    resume() {
        assert(void 0 !== this.stalledRange, "invalid attempt to resume request hat is not stalled");
        const success = this._validateAndRequestByteRange(this.stalledRange.offset, this.stalledRange.la);
        if (success) {
            this.stalledRange = void 0;
        }
        return success;
    }

    /**
     * Abort this request and all sub-requests.
     * @returns {boolean} Always returns true
     */
    abort() {
        if (this.requestState !== stateEnum.ABORTED) {
            const wasActive = this.active;
            const wasOpened = this.opened;
            this.requestState = stateEnum.ABORTED;
            this.completedRequests.forEach((subReq) => subReq.abort());
            this.stalledRange = void 0;
            this._notifyAborted(this, wasActive, wasOpened);
        }
        return true;
    }

    /**
     * Dispose of all sub-requests and clean up resources.
     */
    dispose() {
        this.completedRequests.forEach((subReq) => subReq.dispose());
        this.stalledRange = void 0;
    }

    /**
     * Swap the request URL across all sub-requests (e.g., for live URL rotation).
     * @param {string} newUrl - The new URL to use
     * @returns {boolean} True if at least one sub-request successfully swapped
     */
    swapUrl(newUrl) {
        this.requestUrl = newUrl;
        return this.completedRequests
            .map((subReq) => subReq.parseTrun(this.requestUrl))
            .some((result) => result);
    }

    /**
     * Get the response data for a specific sub-request by index.
     * @param {number} index - The sub-request index
     * @returns {*} The response data
     */
    getSubResponse(index) {
        assert(index >= 0 && index < this.completedRequests.length);
        return this.completedRequests[index].response;
    }

    /**
     * Get a specific response header from any sub-request that has it.
     * @param {string} name - Header name
     * @param {boolean} caseInsensitive - Whether to match case-insensitively
     * @returns {string|null} The header value, or null if not found
     */
    getResponseHeader(name, caseInsensitive) {
        let value = null;
        this.completedRequests.some((subReq) => !!(value = subReq.getResponseHeader(name, caseInsensitive)));
        return value;
    }

    /**
     * Get all response headers from any sub-request that has them.
     * @param {*} filter - Filter criteria for headers
     * @returns {*} The headers, or null
     */
    getAllResponseHeaders(filter) {
        let headers = null;
        this.completedRequests.some((subReq) => !!(headers = subReq.getAllResponseHeaders(filter)));
        return headers;
    }

    /**
     * Get a composite request ID string.
     * @returns {string} Single ID or parenthesized comma-separated list of IDs
     */
    getRequestId() {
        if (this.completedRequests.length === 1) {
            return this.completedRequests[0].getRequestId();
        }
        return "(" + this.completedRequests.map((r) => r.getRequestId()).join(", ") + ")";
    }

    /**
     * Get the request ID of the first sub-request.
     * @returns {string}
     */
    getFirstRequestId() {
        return this.completedRequests[0].getRequestId();
    }

    /**
     * No-op placeholder for stall notification (overridden via mixin).
     */
    onStallNotification() {}

    /**
     * @returns {string} String representation with the request ID
     */
    toString() {
        return "ID: " + this.getRequestId();
    }

    // ──────────────────────────────────────────────
    // Sub-request lifecycle callbacks
    // (Called by HTTPRequestWrapper instances)
    // ──────────────────────────────────────────────

    /**
     * Called when a sub-request becomes active (headers sent, waiting for response).
     * @param {HTTPRequestWrapper} subRequest
     */
    onRequestActive(subRequest) {
        if (this.state > stateEnum.OPENED) return;

        this.requestState = stateEnum.ACTIVE;
        this._lastRequestTimestamp = Math.max(this._lastRequestTimestamp, subRequest.requestTimestamp);
        this._requestMonitor?.onRequestActive();
        this._notifyActive(this);
    }

    /**
     * Handle range unavailability - occurs when content-length indicates more data
     * than what is available at the given range.
     * @param {HTTPRequestWrapper} subRequest
     * @param {number} requestedEnd - The end offset we asked for
     * @param {number|undefined} actualEnd - The actual available end, or undefined
     */
    _handleRangeResponse(subRequest, requestedEnd, actualEnd) {
        if (void 0 === actualEnd) {
            this._handleRangeUnavailable(subRequest);
        } else {
            const remaining = actualEnd - requestedEnd;
            if (remaining > 0 && !this._validateAndRequestByteRange(requestedEnd, remaining)) {
                this.stalledRange = {
                    offset: requestedEnd,
                    la: remaining,
                    bytesReceivedTotal: actualEnd,
                };
                this._notifyStalled(this);
            }
        }
    }

    /**
     * Called when the first byte of response data is received from a sub-request.
     * Handles side-channel metadata extraction and open-range request negotiation.
     * @param {HTTPRequestWrapper} subRequest
     */
    onFirstByte(subRequest) {
        if (isLiveStream(this.stream)) {
            // Extract next segment content-length hint from OC header
            if (this.config.enableNextSegmentSizeFromOC && void 0 !== this.properties.index) {
                let nextContentLength = subRequest.getResponseHeader("X-NFLX-NCL", false);
                if (nextContentLength) {
                    nextContentLength = Number(nextContentLength);
                    const nextIndex = this.properties.index + 1;
                    if (!isNaN(nextContentLength)) {
                        this.stream.setSegmentSize(nextIndex, nextContentLength);
                    }
                }
            }

            // Extract server timing and TCP info for side-channel processing
            const serverTiming = subRequest.serverTimingEntries.length > 0
                ? subRequest.serverTimingEntries[0]
                : -1;
            const tcpInfo = subRequest.getResponseHeader("X-TCP-Info", false);
            const session = this.stream.viewableSession;

            const enableUnifiedSideChannel = session.isAdPlaygraph
                ? (this.config.liveEnableUnifiedSideChannel || this.config.enableUnifiedSideChannel)
                : (this.config.svodEnableUnifiedSideChannel || this.config.enableUnifiedSideChannel);

            if (enableUnifiedSideChannel && session.blackBoxNotifier && tcpInfo) {
                session.blackBoxNotifier.processSideChannel(tcpInfo, {
                    mediaType: this.mediaType,
                    throughputEstimateObj: serverTiming,
                    byteRangeHint: this.properties.byteRangeHint,
                    selectedStreamId: this.stream.selectedStreamId,
                    stream: this.stream,
                    isFirstByte: true,
                });
            } else if (session.textIndexer) {
                session.textIndexer.processOCSideChannelMessage(
                    this.stream, this.currentSegment, this.url, this.mediaType,
                    tcpInfo, serverTiming, this.properties.byteRangeHint
                );
            }
        }

        // Update segment size estimate from content-length
        const contentLength = subRequest.getContentLength();
        if (void 0 !== this.properties.index && void 0 !== contentLength) {
            this.stream.setSegmentSize(this.properties.index, contentLength);
        }

        // For open-range (non-range) requests, negotiate content length
        if (0 >= this.la && !this.isRangeRequest) {
            this._handleRangeResponse(subRequest, this.offset + subRequest.la, contentLength);
            if (void 0 !== contentLength) {
                this._processFirstByteReceived(subRequest);
                this._onContentLengthChanged(subRequest, contentLength, this.la);
            }
        } else {
            this._processFirstByteReceived(subRequest);
        }
    }

    /**
     * Called when a sub-request is complete.
     * @param {HTTPRequestWrapper} subRequest
     * @param {number} bytesReceived - Bytes received in this completion
     */
    onRequestComplete(subRequest, bytesReceived) {
        if (this.state > stateEnum.RECEIVING) return;

        if (this.config.debugFragmentTimes && this.stream.isLive) {
            this._debugFragmentTimes(subRequest);
        }

        this._updateRequestStats(subRequest, bytesReceived);
        this.processResponseData();

        const allComplete = this.completedRequests.every((r) => r.complete);
        if (allComplete && !this.endedEvent) {
            this.requestState = stateEnum.COMPLETE;
            this._requestMonitor?.onRequestFinish();
            this._notifyCompleted(this, bytesReceived);
            this.dispose();
        } else {
            this._notifyDataReceived(this, bytesReceived);
        }
    }

    /**
     * Called when a sub-request is redirected.
     */
    onRequestRedirected() {
        this._notifyRedirected(this);
    }

    /**
     * Called when a sub-request fails.
     * For 416/206 errors on open-range requests, retries with a smaller range.
     * @param {HTTPRequestWrapper} subRequest
     */
    onRequestFailed(subRequest) {
        this.console.RETRY("AseRequest.onrequesterror:", this.toString(), "sub request:", subRequest.toString());

        const httpStatus = subRequest.status;

        if ((httpStatus === 416 || httpStatus === 206) && 0 >= this.la && !this._shouldUseRangeRequest()) {
            // Retry with half the byte range
            subRequest.abort();
            subRequest.dispose();
            this._removeSubRequest(subRequest);
            this._createSubRequest(subRequest.requestLabel, this.label, this.properties, {
                offset: subRequest.offset,
                la: Math.max(Math.ceil(subRequest.la / 2), 1),
            });
        } else {
            this._activeFailedRequest = subRequest;
            this._notifyFailed(this);
        }
    }

    /**
     * Called when a sub-request is aborted externally.
     */
    onRequestAbortedExternally() {
        if (this.state !== stateEnum.ABORTED) {
            this.console.RETRY("AseRequest.onrequestaborted:", this.toString());
            const wasActive = this.active;
            const wasOpened = this.opened;
            this.requestState = stateEnum.ABORTED;
            this._notifyAborted(this, wasActive, wasOpened);
        }
    }

    /**
     * Called when the content-length of an open-range request changes.
     * @param {HTTPRequestWrapper} subRequest
     * @param {number} newLength - The new content length
     * @param {number} previousLength - The previous content length
     */
    _onContentLengthChanged(subRequest, newLength, previousLength) {
        this.contentLength += newLength - previousLength;

        const event = {
            type: "updatedBytes",
            newContentLength: newLength,
            previousContentLength: previousLength,
        };
        this.events.emit(event.type, event);
        this._notifyContentLengthChanged(this, newLength, previousLength);
    }

    /**
     * Called when receiving data. Transitions from ACTIVE to RECEIVING on first byte,
     * or just notifies listener on subsequent data.
     * @param {HTTPRequestWrapper} subRequest
     */
    onDataReceived(subRequest, bytesReceived) {
        this._updateRequestStats(subRequest, bytesReceived);
        this._notifyDataReceived(this, bytesReceived);
    }

    // ──────────────────────────────────────────────
    // Stub methods (overridden by subclasses/mixins)
    // ──────────────────────────────────────────────

    /**
     * No-op stub - overridden by subclasses.
     */
    onStallResolved() {
        assert(false);
    }

    /**
     * No-op stub - overridden by subclasses.
     */
    onFragmentTimesResolved() {
        assert(false);
    }

    // ──────────────────────────────────────────────
    // Private / internal methods
    // ──────────────────────────────────────────────

    /**
     * Initialize sub-requests based on request properties.
     * - For sized requests (la > 0): split into multiple if exceeding maxRequestSize, else single range request
     * - For open-range requests (la <= 0): use range request or fetch with initial size
     *
     * @param {Object} requestLabel
     * @param {string} label
     * @param {Object} properties
     * @private
     */
    _initializeSubRequests(requestLabel, label, properties) {
        if (properties.la > 0) {
            // Sized request - potentially split into sub-requests
            if (properties.maxRequestSize && properties.la > properties.maxRequestSize) {
                this._splitIntoSubRequests(requestLabel, label, properties, properties.maxRequestSize, properties);
            } else {
                this._createSubRequest(requestLabel, label, properties, properties);
            }
        } else if (this.isRangeRequest) {
            // Open-range request using byte-range
            this._createSubRequest(requestLabel, label, properties, properties);
        } else {
            // Open-range request without byte-range - use initial fetch size
            const offset = properties.offset;
            let fetchSize;

            if (void 0 !== properties.index) {
                fetchSize = this.stream.getSegmentSize(properties.index);
            }

            if (!fetchSize) {
                fetchSize = this.mediaType === MediaType.TEXT_MEDIA_TYPE
                    ? this.config.liveTextInitialFetchSizeBytes
                    : this.config.liveInitialFetchSizeBytes;
            }

            let adjustedProperties = properties;
            if (this.config.debugFragmentTimes || this.config.enableForcedJsRequests) {
                adjustedProperties = {
                    ...properties,
                    responseType: 0,
                    enableForcedJsRequests: this.config.enableForcedJsRequests,
                };
            }

            this._createSubRequest(requestLabel, label, adjustedProperties, {
                offset,
                la: fetchSize,
            });
        }
    }

    /**
     * Split a large request into multiple evenly-sized sub-requests.
     *
     * @param {Object} requestLabel
     * @param {string} label
     * @param {Object} properties
     * @param {number} maxSize - Maximum bytes per sub-request
     * @param {Object} range - { offset, la } total range to fetch
     * @private
     */
    _splitIntoSubRequests(requestLabel, label, properties, maxSize, range) {
        let numChunks = Math.ceil(range.la / maxSize);
        let offset = range.offset;
        let remaining = range.la;

        while (remaining > 0) {
            const chunkSize = Math.ceil(remaining / numChunks);
            this._createSubRequest(requestLabel, label, properties, {
                offset,
                la: chunkSize,
            });
            offset += chunkSize;
            remaining -= chunkSize;
            --numChunks;
        }
    }

    /**
     * Determine whether to use explicit byte-range requests (for live streams).
     * @returns {boolean}
     * @private
     */
    _shouldUseRangeRequest() {
        return !!this.requestLabel.GUb;
    }

    /**
     * Create a single HTTP sub-request (HTTPRequestWrapper) and add it to the list.
     *
     * @param {Object} requestLabel
     * @param {string} label
     * @param {Object} properties
     * @param {Object} range - { offset, la } byte range for this sub-request
     * @private
     */
    _createSubRequest(requestLabel, label, properties, range) {
        const subRequest = new HTTPRequestWrapper(
            this.stream, this.requestUrl, requestLabel, label,
            properties, range, this, this.currentSegment,
            this.config, this.console
        );
        this.completedRequests.push(subRequest);

        // If already opened, send immediately
        if (this.state >= stateEnum.OPENED) {
            subRequest.send();
            // If we were already complete, reopen
            if (this.state >= stateEnum.COMPLETE) {
                this.requestState = stateEnum.OPENED;
                this._notifyOpened(this);
            }
        }
    }

    /**
     * Remove a sub-request from the list (e.g., when retrying with different range).
     * Also decrements contentLength if known.
     *
     * @param {HTTPRequestWrapper} subRequest
     * @private
     */
    _removeSubRequest(subRequest) {
        const index = this.completedRequests.indexOf(subRequest);
        if (index !== -1) {
            this.completedRequests.splice(index, 1);
            if (this.contentLength > 0) {
                assert(this.contentLength >= subRequest.la);
                this.contentLength -= subRequest.la;
            }
        }
    }

    /**
     * Create a follow-up sub-request (e.g., mdat after moof).
     *
     * @param {Object} requestLabel
     * @param {string} label
     * @param {Object} properties
     * @param {Object} range - { offset, la }
     */
    makeFollowupRequest(requestLabel, label, properties, range) {
        this._createSubRequest(requestLabel, label, properties, range);
        this.contentLength += range.la;
    }

    /**
     * Process the transition to RECEIVING state on first byte.
     * @param {HTTPRequestWrapper} subRequest
     * @private
     */
    _processFirstByteReceived(subRequest) {
        if (this.state <= stateEnum.ACTIVE) {
            this._updateRequestStats(subRequest, 0);
            this.requestState = stateEnum.RECEIVING;
            this._requestMonitor?.onFirstByteReceived();
            this.processResponseData();
            this._notifyFirstByteReceived(this);
        } else {
            this.onDataReceived(subRequest, 0);
        }
    }

    /**
     * Validate a byte range with the buffer size limiter and issue a new sub-request.
     * @param {number} offset
     * @param {number} length
     * @returns {boolean} True if the range was accepted and sub-request created
     * @private
     */
    _validateAndRequestByteRange(offset, length) {
        const session = this.stream.viewableSession;
        if (session.bufferSizeLimiter && !session.bufferSizeLimiter.canAllocate(this.mediaType, length)) {
            return false;
        }
        this._createSubRequest(this.completedRequests[0].requestLabel, this.label, this.properties, {
            offset,
            la: length,
        });
        return true;
    }

    /**
     * Handle case where the requested byte range is not available from the server.
     * Retries once by re-initializing sub-requests.
     * @param {HTTPRequestWrapper} subRequest
     * @private
     */
    _handleRangeUnavailable(subRequest) {
        this._rangeUnavailableCount = (this._rangeUnavailableCount || 0) + 1;
        if (this._rangeUnavailableCount <= 1) {
            this._removeSubRequest(subRequest);
            subRequest.abort();
            this.stalledRange = void 0;
            this._initializeSubRequests(subRequest.requestLabel, this.label, this.properties);
        }
    }

    /**
     * Update internal stats (timestamp, bytes received) from a sub-request event.
     * @param {HTTPRequestWrapper} subRequest
     * @param {number} bytesReceived
     * @private
     */
    _updateRequestStats(subRequest, bytesReceived) {
        if (this._activeFailedRequest === subRequest) {
            this._activeFailedRequest = void 0;
        }
        this._lastRequestTimestamp = Math.max(this._lastRequestTimestamp, subRequest.requestTimestamp);
        this.previousBytesReceived += bytesReceived;
    }

    /**
     * Debug helper: log fragment timing information for live stream segments.
     * Compares actual vs. expected presentation time and duration.
     * @param {HTTPRequestWrapper} subRequest
     * @private
     */
    _debugFragmentTimes(subRequest) {
        assert(isLiveStream(this.stream), "debugFragmentTimes only supported for live streams");

        if (this.mediaType === MediaType.TEXT_MEDIA_TYPE) return;
        if (!this.pDc) return;
        if (subRequest !== this.completedRequests[0]) return;
        if (!(subRequest.response instanceof ArrayBuffer)) return;

        const boxInfo = mp4BoxParser.parseFragmentHeader(new DataView(subRequest.response));
        if (!boxInfo) return;

        const decodeTime = boxInfo.baseDecodeTime;
        const presentationOffset = boxInfo.compositionOffset;
        const fragmentDuration = boxInfo.fragmentDuration;

        if (void 0 === presentationOffset || void 0 === fragmentDuration) {
            // Fallback: use frame duration for video or 0 for audio
            const fallback = (void 0 === presentationOffset)
                ? (this.mediaType === MediaType.VIDEO
                    ? this.stream.frameDuration.downloadState(this.sampleMultiplier).value
                    : 0)
                : 0;
            new TimeUtil(decodeTime + fallback, this.stream.sampleMultiplier);
        } else {
            const videoTrack = this.viewableSession.getTracks(MediaType.VIDEO)[0];
            assert(isLiveStreamTrack(videoTrack), "Unexpected on-demand video track in live branch");

            let adjustedDecodeTime = decodeTime;
            if (this.mediaType === MediaType.AUDIO && this.config.enableAudioTimestampAdjust) {
                adjustedDecodeTime -= videoTrack.compositionOffset.downloadState(this.sampleMultiplier).value;
            }

            const duration = this.stream.frameDuration.convertTimescale(fragmentDuration);
            const presentationTime = new TimeUtil(
                adjustedDecodeTime + presentationOffset,
                this.stream.sampleMultiplier
            ).subtractOffset(this.stream.track.compositionOffset);

            const expectedPresentation = this.contentStart.item(videoTrack.presentationTime);
            const expectedDuration = this.expectedDuration;
            const durationMismatch = !duration.equal(expectedDuration);
            const presentationDiff = TimeUtil.abs(
                presentationTime.subtractOffset(expectedPresentation)
            ).value;
            const presentationMismatch = durationMismatch && presentationDiff > 1;

            let status;
            if (durationMismatch && presentationMismatch) {
                status = "both";
            } else if (durationMismatch) {
                status = "duration";
            } else if (presentationMismatch) {
                status = "presentation";
            } else if (presentationTime.equal(expectedPresentation)) {
                status = "ok";
            } else {
                status = "onetick";
            }

            const message =
                "onrequestcomplete, fragmentTimes: index " + this.index +
                ` decode ${decodeTime}` +
                ` adjusted ${adjustedDecodeTime}` +
                ` presentation ${presentationTime.toString()}` +
                ` expected ${expectedPresentation.toString()}` +
                ` duration ${duration.toString()}` +
                ` expected ${expectedDuration.toString()} ` +
                status;

            if (durationMismatch) {
                this.console.error(message);
            } else if (presentationMismatch) {
                this.console.RETRY(message);
            } else {
                this.console.pauseTrace(message);
            }
        }
    }
}

// Apply the RequestListenerMixin - maps internal callback names to public listener API
outputList(RequestListenerMixin, AseMediaRequest, false);
