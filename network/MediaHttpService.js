/**
 * @module MediaHttpService
 * @description Injectable service that handles HTTP communication for media segment downloads.
 * Wraps the HTTP layer to provide media-specific request lifecycle management including
 * header handling, progress tracking, error mapping, and completion notification.
 * Maps low-level HTTP error codes to player-level error categories.
 * @original Module_22806
 */

// Dependencies
// import { ReadyState } from '../network/ReadyState';         // Module 48220
// import { M5 } from '../network/Tokens';                     // Module 24550
// import { EventTypeEnum } from '../network/EventTypes';      // Module 36129
// import { LoggerToken } from '../monitoring/LoggerToken';     // Module 87386
// import { injectable, inject } from 'inversify';             // Module 22674
// import { HttpToken } from '../network/HttpToken';           // Module 32934
// import { symbolMarker } from '../network/SymbolMarker';     // Module 42207
// import { ClockToken } from '../timing/ClockToken';          // Module 81918
// import { MILLISECONDS } from '../timing/TimeUnit';          // Module 5021

/**
 * Manages HTTP requests for media segment downloads.
 * Provides request lifecycle callbacks (headers, progress, completion, error)
 * and translates low-level HTTP errors into player error categories.
 *
 * @injectable
 */
export class MediaHttpService {
    /**
     * @param {Object} networkConfig - Network configuration (injected via M5 token)
     * @param {Object} logger - Logger instance (injected via LoggerToken)
     * @param {Object} httpClient - HTTP client (injected via HttpToken)
     * @param {Object} downloadReportInterval - Download progress reporting interval (injected via symbolMarker)
     * @param {Object} clock - Playback clock (injected via ClockToken)
     */
    constructor(networkConfig, logger, httpClient, downloadReportInterval, clock) {
        /** @private */
        this._networkConfig = networkConfig;

        /** @private */
        this._httpClient = httpClient;

        /** @private */
        this._downloadReportInterval = downloadReportInterval;

        /** @private */
        this._clock = clock;

        /** @private */
        this._log = logger.createSubLogger('MediaHttp');
    }

    /**
     * Gets the current playback timestamp in milliseconds.
     *
     * @returns {number} Current time in milliseconds
     */
    timestamp() {
        return this._clock.getCurrentTime().toUnit(/* MILLISECONDS */);
    }

    /**
     * Dispatches a timestamp update for a media request.
     *
     * @private
     * @param {Object} mediaRequest - The media request
     * @param {number} timestamp - The timestamp to dispatch
     */
    _dispatchTimestamp(mediaRequest, timestamp) {
        mediaRequest.gLc({
            mediaRequest,
            timestamp
        });
    }

    /**
     * Handles the headers-ready event for a media request.
     * Forwards header information to the underlying request with timing data.
     *
     * @param {Object} event - The headers-ready event
     * @param {Object} event.mediaRequest - The source media request
     * @param {number} [event.connect] - Connection timestamp
     * @param {number} event.timestamp - Event timestamp
     */
    onHeadersReady(event) {
        const request = event.mediaRequest.previousRequest;
        request.jLb({
            ...event,
            timestamp: event.connect ? event.timestamp : this.timestamp(),
            connect: event.connect ?? false,
            mediaRequest: request,
            readyState: request.readyState
        });
    }

    /**
     * Handles response headers received from the server.
     *
     * @param {Object} event - The headers-received event
     */
    onRequestHeadersReceived(event) {
        this._dispatchTimestamp(event.mediaRequest.previousRequest, event.timestamp);
    }

    /**
     * Handles data progress events during download.
     * Updates byte counts and reports download progress at configured intervals.
     *
     * @param {Object} event - The progress event
     * @param {Object} event.mediaRequest - The media request
     * @param {number} event.bytes - Total bytes received so far
     */
    onDataProgress(event) {
        const request = event.mediaRequest.previousRequest;
        const bytes = event.bytes;

        if (request === undefined) return;

        // If still in receiving state, trigger headers ready first
        if (request.readyState === /* ReadyState.receivingState */ 2) {
            this.onHeadersReady(event);
        }

        // Report progress at configured intervals
        if (this._downloadReportInterval.mapTransform(bytes)) {
            event.mediaRequest = request;
            event.timestamp = this.timestamp();

            if (bytes > request.bytesReceived) {
                event.newBytes = bytes - request.bytesReceived;
                event.bytesLoaded = bytes;
                request.jLc(event);
            }
        }
    }

    /**
     * Handles request errors by mapping HTTP error codes to player error categories.
     *
     * Error code mapping:
     * - HTTP_UNKNOWN -> internal error
     * - HTTP_XHR -> XHR error
     * - HTTP_PROTOCOL (4xx) -> bad request / no address (452)
     * - HTTP_PROTOCOL (5xx) -> server error
     * - HTTP_PROXY -> proxy error
     * - HTTP_OFFLINE -> offline error
     * - HTTP_TIMEOUT / HTTP_READTIMEOUT -> timeout
     * - HTTP_PARSE -> parse error
     * - HTTP_BAD_URL -> bad request
     * - DOWNLOADER_IO_ERROR -> proxy/IO error
     *
     * @param {Object} event - The error event
     */
    onRequestError(event) {
        let request = event.mediaRequest;
        let errorCode = event.errorcode;
        let httpCode = event.httpcode;
        const errorNames = /* ReadyState.errorNameMap */ {};

        if (request === undefined) return;

        request = request.previousRequest;
        if (request === undefined) return;

        if (errorCode === /* EventTypeEnum.HTTP_ABORT */) {
            event.mediaRequest = request;
            event.readyState = request.readyState;
            request.aLc(event);
            return;
        }

        let mappedError;
        switch (errorCode) {
            case 0: // HTTP_UNKNOWN
                mappedError = errorNames.internal_Bab;
                break;
            case 1: // HTTP_XHR
                mappedError = errorNames.CFa;
                break;
            case 2: // HTTP_PROTOCOL
                if (httpCode > 400 && httpCode < 500) {
                    mappedError = httpCode === 452 ? errorNames.CONNECTION_NO_ADDRESS : errorNames.vka;
                } else if (httpCode >= 500) {
                    mappedError = errorNames.d7;
                } else {
                    mappedError = errorNames.CFa;
                }
                break;
            case 3: // HTTP_PROXY
                mappedError = errorNames.DFa;
                break;
            case 4: // HTTP_OFFLINE
                mappedError = errorNames.internal_Cab;
                break;
            case 5: // HTTP_TIMEOUT
                mappedError = errorNames.f7;
                break;
            case 6: // HTTP_READTIMEOUT
                mappedError = errorNames.f7;
                break;
            case 7: // HTTP_PARSE
                mappedError = errorNames.internal_Hdb;
                break;
            case 8: // HTTP_BAD_URL
                mappedError = errorNames.vka;
                break;
            case 9: // DOWNLOADER_IO_ERROR
                mappedError = errorNames.DFa;
                break;
            default:
                mappedError = errorNames.f7;
        }

        event.mediaRequest = request;
        event.readyState = request.readyState;
        event.errorcode = mappedError;
        event.nativecode = errorCode;
        request.L0a(event);
    }

    /**
     * Handles request completion (success or failure).
     * On success, updates metrics (load time, first byte time, last byte time)
     * and notifies the request of completion.
     *
     * @param {Object} requestInfo - Request context with playerState
     * @param {Object} response - The completed response
     */
    onRequestFinish(requestInfo, response) {
        const request = response.request.previousRequest;
        if (!request) return;

        if (response.success) {
            if (requestInfo.playerState && request.readyState !== /* DONE */ 4) {
                switch (request.readyState) {
                    case /* ABORTED */ 5:
                        return;
                    case /* RECEIVING */ 3:
                        break;
                    case /* receivingState */ 2:
                        this.onHeadersReady({
                            mediaRequest: response.request,
                            responseHeaders: response.headers,
                            httpCode: response.httpCode
                        });
                        break;
                    default:
                        break;
                }

                if (!request.isEndOfStream) {
                    const completionEvent = {
                        mediaRequest: request,
                        readyState: request.readyState,
                        timestamp: this.timestamp(),
                        cadmiumResponse: response
                    };

                    requestInfo.playerState.loadStartTime += 1;
                    request.recordLoadStartTime();

                    if (request.isFirstRender()) {
                        requestInfo.playerState.firstRenderTime += 1;
                        response.responseMetrics.timestamp = Math.ceil(request.firstByteTime);
                        response.responseMetrics.lastByteTimeMs = Math.ceil(request.lastByteTime);
                        response.responseMetrics.start = Math.floor(request.startLoadTime);
                    }

                    request.responseMetadata = completionEvent;
                    request.notifyComplete(completionEvent);
                }
            }
        } else {
            if (request.readyState === /* ABORTED */ 5) return;

            this.onRequestError({
                mediaRequest: response.request,
                errorcode: response.errorcode,
                httpcode: response.httpcode,
                responseHeaders: response.headers,
                cadmiumResponse: response
            });
        }
    }

    /**
     * Initiates a media download request, wiring up progress, header, and completion callbacks.
     *
     * @param {Object} requestInfo - The request descriptor with previousRequest
     * @param {Object} options - Download options
     * @returns {Object} The download handle
     */
    download(requestInfo, options) {
        const downloadHandle = this._httpClient.download(requestInfo, options);

        if (requestInfo.previousRequest?.readyState === /* OPENED */ 1) {
            downloadHandle.onHeadersCallback((event) => {
                this.onRequestHeadersReceived(event);
            });
        }

        downloadHandle.onCompleteCallback((response) => {
            this.onRequestFinish(requestInfo, response);
        });

        downloadHandle.onProgressCallback((event) => {
            this.onDataProgress(event);
        });

        return downloadHandle;
    }
}

export default MediaHttpService;
