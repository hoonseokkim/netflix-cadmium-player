/**
 * HttpClient - Core HTTP download client for the Netflix player
 *
 * Manages XHR-based HTTP requests for media downloads, probe requests,
 * and side-channel communication. Handles URL construction with byte ranges,
 * CDN proxy URLs, timeouts (connect + read), progress tracking, response
 * parsing, and error classification.
 *
 * @module network/HttpClient
 * @original Module_61726
 */

// import { jl as EventEmitter } from '../events/EventEmitter';
// import { config } from '../core/PlayerConfig';
// import { SUCCESS } from '../core/StatusCodes';
// import { BGb as isValidUrl } from '../utils/url';
// import { jy as getTimestamp } from '../timing/Clock';
// import { ea as ErrorCodes, EventTypeEnum, eG as formatError } from '../core/ErrorCodes';
// import { getCategoryLog, fetchOperation } from '../core/ServiceLocator';
// import { assert, jaa as assertUrl } from '../assert';
// import { internal_Uka as random } from '../utils/random';
// import { scheduleAsync } from '../utils/scheduler';
// import { arrayCheck as isString } from '../utils/typeCheck';
// import { vkb as isOnline } from '../core/StatusCodes';

/** Event: download started */
export const EVENT_DOWNLOAD_STARTED = 1;

/** Event: download completed */
export const EVENT_DOWNLOAD_COMPLETED = 2;

/** Event: download progress */
export const EVENT_DOWNLOAD_PROGRESS = 3;

/** Event: network offline detected */
export const EVENT_NETWORK_OFFLINE = 4;

/** Event: download queued */
export const EVENT_DOWNLOAD_QUEUED = 5;

/** Response type: binary (ArrayBuffer) */
export const RESPONSE_TYPE_BINARY = 3; // Q$a

/** Response type: XML */
export const RESPONSE_TYPE_XML = 2; // j7b

/** Response type: text (default) */
export const RESPONSE_TYPE_TEXT = 1; // Ea

/**
 * Constructs a URL with byte range parameters for a media request.
 *
 * @param {Object} request - Media request descriptor
 * @param {Object} result - Result object to update with url and range
 */
export function buildMediaUrl(request, result) {
    const urlParts = request.url.split("?");
    const range = buildByteRange(request);
    let path = urlParts[0];

    if (range) {
        result.range = range;
        const useRangeHeader = request.useRangeHeader ?? config.useRangeHeader;

        if (useRangeHeader || request.cdnType !== OPEN_CONNECT_APPLIANCE) {
            request.headers = request.headers || {};
            request.headers.Range = `bytes=${range}`;
        } else {
            result.range = range;
            path = path[path.length - 1] === "/" ? `${path}range/` : `${path}/range/`;
            path += range;
        }
    }

    let extraParams = request.efc ? `random=${(1e17 * random()).toFixed(0)}` : "";
    if (config.enableOCSideChannel && request.rC) {
        extraParams = `sc=${request.rC}${extraParams ? `&${extraParams}` : ""}`;
    }

    let url = urlParts[1] ? `${path}?${urlParts[1]}${extraParams ? `&${extraParams}` : ""}` : `${path}${extraParams ? `?${extraParams}` : ""}`;

    if (request.sourceBufferArray && !isValidUrl(url) && config.cdnProxyUrl) {
        url = config.cdnProxyUrl.replace("{URL}", url).replace("{EURL}", encodeURIComponent(url));
    }

    result.url = url;
}

/**
 * Builds a byte range string from request offset/length.
 *
 * @param {Object} request
 * @returns {string|undefined} e.g. "0-1023" or "500-"
 */
export function buildByteRange(request) {
    const offset = request.offset;
    if (offset === undefined) return undefined;

    assert(offset >= 0);
    if (request.length !== undefined) {
        const end = offset + request.length - 1;
        assert(end >= 0);
        return `${offset}-${end}`;
    }
    return `${offset}-`;
}

/**
 * Core HTTP client for Netflix player downloads.
 *
 * Uses XMLHttpRequest for all network operations. Tracks download
 * metrics, handles timeouts, progress events, and error classification.
 */
export class HttpClient {
    constructor() {
        this.debugLogger = getCategoryLog("Http");
        this.eventEmitter = new EventEmitter();
        this.requestCounter = 0;
        this.urlStats = {
            ssl: 0,
            "non-ssl": 0,
            invalid: 0,
        };

        this.addEventListener = this.eventEmitter.addListener;
        this.removeEventListener = this.eventEmitter.removeListener;
    }

    /**
     * Sends a HEAD probe request to test CDN connectivity.
     *
     * @param {Object} options - { url, lRc: probeCallback }
     */
    probeRequest(options) {
        const xhr = new XMLHttpRequest();
        const probeCallback = options.lRc;

        xhr.open("HEAD", options.url, true);
        xhr.timeout = config.probeRequestTimeoutMilliseconds;

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 2) {
                probeCallback?.notifyComplete(xhr.status);
            }
        };

        xhr.ontimeout = xhr.onerror = () => {
            probeCallback?.L0a(xhr.status);
        };

        xhr.send();
    }

    /**
     * Downloads a resource via XHR.
     *
     * @param {Object} request - Media request descriptor
     * @param {Function} callback - Completion callback
     * @returns {Object} Download result handle with abort capability
     */
    download(request, callback) {
        let xhr = null;
        let completed = false;
        let connected = false;
        let timeoutHandle = null;
        const self = this;
        const logger = request?.playerState?.log
            ? fetchOperation(request.playerState, "Http")
            : this.debugLogger;

        const connectTimeout = request.connectTimeoutMilliseconds || config.connectTimeoutMilliseconds;
        const readTimeout = request.noProgressTimeoutMilliseconds || config.noProgressTimeoutMilliseconds;

        const logContext = { Num: this.requestCounter++ };
        let callbacks = [callback];
        const metrics = {};

        this.trackUrlStats(request);

        const result = new DownloadResult(request, abort, resetTimeout, metrics, (cb) => {
            if (!completed) {
                assert(callbacks, "Callback should be added before download starts.");
                callbacks?.unshift(cb);
            }
        });

        function resetTimeout() {
            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
                timeoutHandle = null;
            }
            timeoutHandle = setTimeout(onTimeout, connected ? readTimeout : connectTimeout);
        }

        function finishDownload() {
            if (completed) return;
            completed = true;

            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
                timeoutHandle = null;
            }

            self.eventEmitter.removeListener(EVENT_NETWORK_OFFLINE, onOffline);
            self.updateResponseHeaders(result, xhr);

            if (xhr) {
                xhr.onloadstart = null;
                xhr.onreadystatechange = null;
                xhr.onprogress = null;
                xhr.onerror = null;
                xhr.onload = null;
                xhr.onabort = null;
                xhr = null;
            }

            if (!result.success) {
                if (result.errorcode !== EventTypeEnum.HTTP_ABORT) {
                    logger.RETRY("Download failed", logContext, formatError(result));
                } else {
                    logger.pauseTrace("Download aborted", logContext);
                }
            }

            const cbs = callbacks;
            callbacks = null;
            cbs?.reduceRight((_acc, cb) => {
                scheduleAsync(() => cb(result));
            }, null);

            self.eventEmitter.emit(EVENT_DOWNLOAD_COMPLETED, result, true);
        }

        function setError(errorCode, httpStatus, responseBody) {
            result.success = false;
            result.errorcode = errorCode;

            const now = getTimestamp();
            const rm = result.responseMetrics;
            rm.timestamp = rm.timestamp || now;
            rm.lastByteTimeMs = rm.lastByteTimeMs || now;

            if (httpStatus && httpStatus > 0) {
                result.httpcode = httpStatus;
                result.errorSubcode = httpStatus.toString();
            }
            if (responseBody) {
                result.configFlag = responseBody;
            }

            if ((errorCode === EventTypeEnum.HTTP_OFFLINE || errorCode === EventTypeEnum.HTTP_READTIMEOUT || errorCode === EventTypeEnum.HTTP_TIMEOUT) && xhr) {
                xhr.onabort = null;
                abort();
            }

            finishDownload();
        }

        function onOffline() {
            if (!isOnline()) setError(EventTypeEnum.HTTP_OFFLINE);
        }

        function onTimeout() {
            setError(connected ? EventTypeEnum.HTTP_READTIMEOUT : EventTypeEnum.HTTP_TIMEOUT);
        }

        function abort() {
            try { xhr?.abort(); } catch (e) {}
        }

        function onAbort() {
            setError(EventTypeEnum.HTTP_ABORT);
        }

        // Start the download asynchronously
        scheduleAsync(() => {
            if (!isString(request.url) || !isValidUrl(request.url)) {
                setError(EventTypeEnum.HTTP_BAD_URL);
                return;
            }

            try {
                buildMediaUrl(request, result);
                const url = result.url;
                assertUrl(url);
                logContext.url = url;

                if (!isOnline()) {
                    scheduleAsync(setError.bind(undefined, EventTypeEnum.HTTP_OFFLINE));
                    return;
                }

                xhr = new XMLHttpRequest();

                xhr.onreadystatechange = () => {
                    if (xhr?.readyState === 2) {
                        connected = true;
                        metrics.timestamp = getTimestamp();
                        xhr.onreadystatechange = null;
                        resetTimeout();
                        self.updateResponseHeaders(result, xhr);
                        result.onDataProgress({
                            timestamp: metrics.timestamp,
                            connect: true,
                            mediaRequest: request,
                            start: metrics.start,
                            rt: [metrics.timestamp - metrics.start],
                            responseHeaders: result.headers,
                            httpCode: result.httpCode,
                        });
                    }
                };

                xhr.onprogress = (event) => {
                    connected = true;
                    metrics.bytesReceivedTotal = event.loaded;
                    resetTimeout();
                    self.updateResponseHeaders(result, xhr);
                    result.onDataProgress({
                        mediaRequest: request,
                        bytes: event.loaded,
                        timestamp: getTimestamp(),
                        bytesLoaded: event.loaded,
                        responseHeaders: result.headers,
                        httpCode: result.httpCode,
                    });
                };

                xhr.onload = (event) => {
                    if (completed || !xhr) return;
                    metrics.lastByteTimeMs = getTimestamp();
                    metrics.timestamp = metrics.timestamp || metrics.lastByteTimeMs;
                    metrics.bytesReceivedTotal = event.loaded;

                    if (xhr.status >= 200 && xhr.status <= 299) {
                        let content;
                        switch (result.type) {
                            case RESPONSE_TYPE_BINARY:
                                content = xhr.response || new ArrayBuffer(0);
                                break;
                            case RESPONSE_TYPE_XML:
                                content = xhr.responseXML;
                                break;
                            default:
                                content = xhr.responseText;
                        }
                        result.parsed = false;
                        result.content = content;
                        result.success = true;
                    } else if (xhr.status === 420) {
                        setError(EventTypeEnum.HTTP_PROXY, xhr.status);
                    } else {
                        setError(EventTypeEnum.HTTP_PROTOCOL, xhr.status, xhr.response);
                    }

                    finishDownload();
                };

                xhr.onabort = onAbort;

                xhr.onerror = () => {
                    if (!xhr) return;
                    let status = xhr.status;
                    if (typeof config.forceXhrErrorResponseCode !== "undefined") {
                        status = config.forceXhrErrorResponseCode;
                    }

                    if (status > 0) {
                        if (status === 420) {
                            setError(EventTypeEnum.HTTP_PROXY, status);
                        } else {
                            let responseText;
                            try { responseText = xhr.responseText; } catch (e) {}
                            setError(EventTypeEnum.HTTP_PROTOCOL, status, responseText);
                        }
                    } else {
                        setError(EventTypeEnum.HTTP_UNKNOWN);
                    }
                };

                const startTime = getTimestamp();
                sendXhr(xhr, url, true, request);
                self.eventEmitter.emit(EVENT_DOWNLOAD_STARTED, result, true);
                metrics.start = startTime;

                result.onRequestHeadersReceived({ mediaRequest: request, timestamp: startTime });
                resetTimeout();
                self.eventEmitter.addListener(EVENT_NETWORK_OFFLINE, onOffline);
            } catch (e) {
                logger.error("Exception starting download", e, logContext);
                setError(EventTypeEnum.HTTP_XHR, undefined, String(e));
            }
        });

        return result;
    }

    /**
     * Tracks URL scheme statistics.
     * @private
     */
    trackUrlStats(request) {
        try {
            const url = request.url;
            if (isValidUrl(url)) {
                if (url.indexOf("https") === 0) this.urlStats.ssl++;
                else if (url.indexOf("http") === 0) this.urlStats["non-ssl"]++;
                else this.urlStats.invalid++;
            } else {
                this.urlStats.invalid++;
            }
        } catch (e) {}
    }

    /**
     * Updates result object with response headers from XHR.
     * @private
     */
    updateResponseHeaders(result, xhr) {
        if ((result.httpCode === undefined || result.headers === undefined) && xhr) {
            result.httpCode = xhr.status;
            const headers = {};
            xhr.getAllResponseHeaders().trim().split(/[\r\n]+/).forEach((line) => {
                const [name, ...rest] = line.split(": ");
                const value = rest.join(": ");
                if (name) headers[name.toLowerCase()] = value;
            });
            result.headers = headers;
        }
    }
}

/**
 * Sends an XHR request with the appropriate method, headers, and body.
 * @private
 */
function sendXhr(xhr, url, async, request) {
    const body = request.gOb;
    const headers = request.headers;

    xhr.open(body ? "POST" : "GET", url, async);

    switch (request.responseType) {
        case RESPONSE_TYPE_BINARY:
            xhr.responseType = "arraybuffer";
            break;
        case RESPONSE_TYPE_XML:
            if (xhr.overrideMimeType) xhr.overrideMimeType("text/xml");
            break;
    }

    let allHeaders = headers;
    if (body) {
        const contentType = {
            "Content-Type": isString(body) ? "text/plain" : "application/x-octet-stream",
        };
        allHeaders = allHeaders ? Object.assign(contentType, allHeaders) : contentType;
    }

    if (allHeaders) {
        Object.entries(allHeaders).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
        });
    }

    if (request.withCredentials) xhr.withCredentials = true;

    xhr.send(body || undefined);
}

/** Singleton HTTP client instance */
export const httpClient = new HttpClient();
