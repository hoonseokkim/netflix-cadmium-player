/**
 * Netflix Cadmium Player - Open Connect Side Channel (Media Request Factory)
 *
 * Factory for creating MediaRequest objects used by the Open Connect
 * side channel (OC/SC) transport layer. Handles HTTP-like request lifecycle
 * including send, progress, completion, and error handling for media segments.
 *
 * @module OpenConnectSideChannel
 * @original Module_89936
 * @injectable
 */

// import { __decorate, __param } from 'tslib'; // webpack 22970
// import { injectable, inject } from 'inversify'; // webpack 22674
// import { LoggerToken } from '../core/LoggerToken.js'; // webpack 87386
// import { ConfigToken } from '../core/ConfigToken.js'; // webpack 4203
// import { document as doc } from '../core/Globals.js'; // webpack 22365
// import { symbolMarker } from '../core/DownloadReportInterval.js'; // webpack 42207
// import { eib, internal_Wgb } from '../streaming/TransportTokens.js'; // webpack 31034
// import { EventEmitter } from '../events/EventEmitter.js'; // webpack 94886
// import { enumNamespace as HttpConstants } from '../network/HttpConstants.js'; // webpack 48220
// import { gG as UniqueIdGenerator } from '../utils/UniqueIdGenerator.js'; // webpack 62665
// import { assert } from '../assert/Assert.js'; // webpack 45146

/**
 * @typedef {Object} ReadyState
 * @property {number} UNSENT - Request not yet opened
 * @property {number} OPENED - Request opened
 * @property {number} receivingState - Headers received
 * @property {number} RECEIVING - Receiving body data
 * @property {number} DONE - Request complete
 * @property {number} ABORTED - Request aborted
 */

/**
 * Factory that creates MediaRequest objects for Open Connect side channel transport.
 *
 * @param {Function} config - Configuration provider
 * @param {Object} logger - Logger instance
 * @param {Object} downloadReportInterval - Interval checker for download reporting
 * @param {Object} ocTransport - Open Connect transport layer
 * @param {Object} httpTransport - HTTP transport layer
 * @param {Object} idGenerator - Unique ID generator
 */
export class OpenConnectSideChannel {
    constructor(config, logger, downloadReportInterval, ocTransport, httpTransport, idGenerator) {
        this._config = config;
        this._logger = logger;
        this._downloadReportInterval = downloadReportInterval;
        this._ocTransport = ocTransport;
        this._httpTransport = httpTransport;
        this._idGenerator = idGenerator;
    }

    /**
     * Creates the MediaRequest factory, returning a constructor function.
     * The resulting MediaRequest supports full HTTP lifecycle events.
     */
    createFactory() {
        const config = this._config;
        const logger = this._logger;
        const downloadReportInterval = this._downloadReportInterval;
        const ocTransport = this._ocTransport;
        const httpTransport = this._httpTransport;
        const idGenerator = this._idGenerator;

        /**
         * MediaRequest - Represents a single media segment HTTP request
         */
        class MediaRequest {
            /**
             * @param {Object} track - The media track
             * @param {string} label - Request label (e.g., "notification")
             * @param {Object} [segmentInfo] - Segment metadata
             */
            constructor(track, label, segmentInfo) {
                this.requestId = idGenerator.generateId().toString();
                this.downloadReportInterval = downloadReportInterval;
                this.log = logger.createSubLogger("MediaRequest");
                this.config = config;
                this.eventEmitter = new EventEmitter();
                this.label = label;

                // Select transport based on label and config
                if (label === "notification") {
                    if (config().enableOCSideChannel) {
                        this._transport = ocTransport;
                    }
                } else {
                    this._transport = httpTransport;
                }

                if (segmentInfo) {
                    this.mediaType = segmentInfo.mediaType;
                    this.selectedStreamId = segmentInfo.selectedStreamId;
                    this.bitrate = segmentInfo.bitrate;
                    this.sourceBufferIndex = segmentInfo.sourceBufferIndex || 0;
                    this.isHeaderSegment = segmentInfo.isHeaderSegment;
                    this.segmentId = segmentInfo.segmentId;
                }

                this.inprogress = undefined;
                this.byteOffsetEnd = undefined;
                this.byteOffsetStart = undefined;
                this.track = track;
                this.bytesReceived = undefined;
                this.url = undefined;
                this.responseType = undefined;
                this.readyState = HttpConstants.readyState.UNSENT;
                this.status = undefined;
                this.errorCode = undefined;
                this.errorName = undefined;
                this.nativeCode = undefined;
                this.bytesReceived = 0;
                this.requestTimestamp = undefined;
                this.firstByteTimestamp = undefined;
                this.loadTime = undefined;
                this.lastByteTime = undefined;
                this.startLoadTime = undefined;
                this.lastProgressTime = undefined;
                this.firstByteTime = undefined;
                this.connectTime = undefined;
                this._response = undefined;
                this.serverTimingEntries = [];
                this.isNoneTrack = false;
            }

            addEventListener(event, handler, priority) {
                this.eventEmitter.addListener(event, handler, priority);
            }

            removeEventListener(event, handler) {
                this.eventEmitter.removeListener(event, handler);
            }

            emit(event, data, async) {
                this.eventEmitter.emit(event, data, async);
            }

            /** Called when request starts sending */
            onSendStart(event) {
                if (this.readyState === HttpConstants.readyState.OPENED) {
                    this.inprogress = true;
                    this.loadTime = this.requestTimestamp = event.timestamp;
                    this.readyState = HttpConstants.readyState.receivingState;
                    this.emit(HttpConstants.events.SEND_START, event);
                }
            }

            /** Called when response headers are received */
            onHeadersReceived(event) {
                if (event.responseHeaders) this._responseHeaders = event.responseHeaders;
                if (event.httpCode) this.status = event.httpCode;

                if (this.readyState < HttpConstants.readyState.RECEIVING) {
                    this.serverTimingEntries = [];
                    const latency = event.timestamp - this.loadTime;
                    if (!this.isEndOfStream && latency > 0) {
                        this.connectTime = true;
                        this.serverTimingEntries.push(latency);
                    }

                    this.firstByteTimestamp = this.config().ignoreFirstByte === true
                        ? event.timestamp
                        : this.requestTimestamp = event.timestamp;

                    this.readyState = HttpConstants.readyState.RECEIVING;

                    if (this.status >= 200 && this.status <= 299) {
                        this.emit(HttpConstants.events.HEADERS_RECEIVED, event);
                    }
                }
            }

            /** Called on download progress */
            onProgress(event) {
                if (this.readyState === HttpConstants.readyState.RECEIVING) {
                    this.lastProgressTime = this.requestTimestamp = event.timestamp;
                    event.newBytes = event.bytesLoaded - this.bytesReceived;
                    this.bytesReceived = event.bytesLoaded;

                    if (this.downloadReportInterval.isValid(this.lastProgressTime) &&
                        this.status >= 200 && this.status <= 299) {
                        this.emit(HttpConstants.events.PROGRESS, event);
                    }
                }
            }

            /** Called when request completes successfully */
            notifyComplete(event) {
                const validStates = [
                    HttpConstants.readyState.receivingState,
                    HttpConstants.readyState.RECEIVING
                ];
                if (validStates.indexOf(this.readyState) > -1) {
                    this.inprogress = false;
                    this.requestTimestamp = event.timestamp;
                    this.readyState = HttpConstants.readyState.DONE;

                    const previousBytes = this.bytesReceived;
                    this.bytesReceived = event.cadmiumResponse.responseMetrics.bytesReceivedTotal;
                    assert(this.bytesReceived === this.totalBytes,
                        "bytesReceived do not match expected totalBytes.");

                    event.newBytes = this.totalBytes - previousBytes;

                    if (this.downloadReportInterval.isValid(this.lastByteTime)) {
                        this.requestTimestamp = this.lastByteTime;
                        if (event.newBytes === 0) this.lastProgressTime = this.lastByteTime;
                    }

                    if (this.downloadReportInterval.isValid(this.startLoadTime)) {
                        this.loadTime = this.startLoadTime;
                    }

                    this._response = event.response;
                    this.emit(HttpConstants.events.COMPLETE, event);

                    this.track.emit("mediaRequestComplete", {
                        type: "mediaRequestComplete",
                        detail: event
                    });
                }
            }

            /** Called when request is cancelled */
            onCancelled(event) {
                this.inprogress = false;
                this.emit(HttpConstants.events.CANCELLED, event);
            }

            /** Called when a transport error occurs */
            onError(event) {
                this.requestTimestamp = event.timestamp;
                this.status = event.httpcode ?? this.status;
                this._responseHeaders = event.responseHeaders ?? this._responseHeaders;
                this.errorCode = event.errorcode;
                this.errorName = HttpConstants.errorNames.name[this.errorCode];
                this.nativeCode = event.nativecode;

                this.track.emit("transportreport", {
                    type: "transportreport",
                    detail: event
                });

                this.emit(HttpConstants.events.ERROR, event);
                this.inprogress = false;
            }

            /**
             * Opens and sends the request
             * @param {string} url - Request URL
             * @param {*} byteRange - Byte range info
             * @param {string} responseType - Expected response type
             * @param {*} d - unused
             * @param {*} e - unused
             * @param {*} sideChannelData - Side channel payload
             * @param {string} cdnType - CDN type identifier
             * @param {Object} encodingInfo - Encoding pipeline info
             * @returns {boolean} Whether the request was sent
             */
            send(url, byteRange, responseType, d, e, sideChannelData, cdnType, encodingInfo) {
                this.started = false;
                this.bytesReceived = byteRange;
                this._sideChannelData = sideChannelData;
                this.cdnType = cdnType;
                this.encodingPipelineInfo = encodingInfo;
                this.url = url;
                this.responseType = responseType;
                return this.url ? this._open() : false;
            }

            /** @private */
            _open() {
                this.readyState = HttpConstants.readyState.OPENED;
                this.status = 0;
                this.bytesReceived = 0;
                this.nativeCode = undefined;
                this.errorName = undefined;
                this.errorCode = undefined;
                this._responseHeaders = undefined;
                this._transport.sendRequest(this, this.bytesReceived, this._sideChannelData);
                return true;
            }

            /** Disposes/aborts the request */
            dispose() {
                const activeStates = [
                    HttpConstants.readyState.OPENED,
                    HttpConstants.readyState.receivingState,
                    HttpConstants.readyState.RECEIVING
                ];
                if (activeStates.indexOf(this.readyState) !== -1) {
                    this.abort();
                }
                return true;
            }

            /** Redirects the request to a new URL */
            redirect(newUrl) {
                this.url = newUrl;
                return this.readyState > HttpConstants.readyState.UNSENT
                    ? (this.abort(), this._open())
                    : true;
            }

            /** Aborts the request */
            abort() {
                this.readyState = HttpConstants.readyState.ABORTED;
                this._transport.cancelRequest(this);
                return true;
            }

            pause() {}

            /**
             * Gets a response header value
             * @param {string} name - Header name
             * @returns {string|null}
             */
            getResponseHeader(name) {
                return this._responseHeaders?.[name.toLowerCase()] ?? null;
            }

            getAllResponseHeaders() { return ""; }

            getPayloadSize() {}

            getRequestId() { return this.requestId; }

            toString() {
                return JSON.stringify({
                    requestId: this.getRequestId(),
                    segmentId: this.segmentId,
                    isHeader: this.isEndOfStream,
                    ptsStart: this.ptsStart,
                    ptsOffset: this.timestampOffset,
                    responseType: this.responseType,
                    duration: this.segmentDuration,
                    readystate: this.readyState,
                    bitrate: this.bitrate
                });
            }

            toJSON() { return this.toString(); }

            /**
             * Records timing from the Resource Timing API for accuracy
             */
            recordLoadStartTime() {
                if (this.config().useResourceTimingAPI && performance?.getEntriesByType) {
                    if (!this.downloadReportInterval.isValid(this.startLoadTime) ||
                        (!this.downloadReportInterval.isValid(this.lastByteTime) &&
                         this.downloadReportInterval.isValid(this.url))) {
                        const pattern = `${this.url.split("nflxvideo.net")[0].split("//").pop()}*nflxvideo.net/range/${this.byteOffsetStart}-${this.byteOffsetEnd}*`;
                        const regex = new RegExp(pattern);
                        const entry = performance.getEntriesByType("resource")
                            .filter(e => regex.exec(e.name))[0];

                        if (this.downloadReportInterval.isValid(entry)) {
                            if (entry.startTime > 0) {
                                this.startLoadTime = entry.startTime;
                                if (entry.requestStart > 0) {
                                    this.startLoadTime = Math.max(this.startLoadTime, entry.requestStart);
                                }
                            }
                            if (entry.responseStart > 0) this.firstByteTime = entry.responseStart;
                            if (entry.responseEnd > 0) this.lastByteTime = entry.responseEnd;
                        }
                    }
                }
            }

            /** Whether Resource Timing data is available */
            hasResourceTimingData() {
                return this.downloadReportInterval.isValid(this.startLoadTime) &&
                       this.downloadReportInterval.isValid(this.lastByteTime) &&
                       this.downloadReportInterval.isValid(this.firstByteTime);
            }

            /** @returns {number} Total bytes expected */
            get totalBytes() {
                if (this.byteOffsetStart === 0 && this.byteOffsetEnd === -1) {
                    return Number(this.getResponseHeader("content-length")) || this.bytesReceived;
                }
                return this.byteOffsetEnd - this.byteOffsetStart + 1;
            }

            /** @returns {number} Byte length of the range */
            get byteLength() {
                return this.byteOffsetEnd - this.byteOffsetStart + 1;
            }

            /** @returns {boolean} Whether response data is available */
            get hasResponseData() {
                return !!(this.response && this.response.byteLength > 0);
            }

            /** @returns {boolean} Whether this is NOT a header segment */
            get isEndOfStream() {
                return !this.isHeaderSegment;
            }

            /** @returns {ArrayBuffer} The response data */
            get response() {
                return this._response;
            }
        }

        return MediaRequest;
    }
}
