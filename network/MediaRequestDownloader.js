/**
 * Media Request Downloader
 *
 * Handles downloading media segments (audio/video/text) for the ASE streaming
 * engine. Manages request initiation, abort handling, retry logic with
 * configurable backoff, and response completion notification. Uses dependency
 * injection for clock, config, logger, HTTP client, and response type.
 *
 * @module MediaRequestDownloader
 * @original Module_77425
 * @injectable
 */

// import { injectable, inject } from './DependencyInjection';
// import { ClockToken } from './Clock';
// import { LoggerToken } from './Logger';
// import { HttpToken } from './HttpClient';
// import { ConfigToken } from './Config';
// import { MediaType } from './MediaType';
// import { TrackType } from './TrackType';
// import { MediaRequestState, MediaRequestEvent } from './MediaRequestEvents';
// import { MILLISECONDS } from './TimeUnits';

/**
 * Maps a MediaType to the corresponding TrackType for request metadata.
 * @param {string} mediaType
 * @returns {string}
 */
function mediaTypeToTrackType(mediaType) {
    switch (mediaType) {
        case MediaType.V:       return TrackType.AUDIO;
        case MediaType.U:       return TrackType.VIDEO;
        case MediaType.TEXT:    return TrackType.TEXT;
        case MediaType.SUPPLEMENTARY: return TrackType.SUPPLEMENTARY;
        default:                return "unknown";
    }
}

/**
 * Downloads media request segments with retry support and abort handling.
 *
 * @injectable
 * @param {Object} clock - System clock for timestamps
 * @param {Object} networkConfig - Network configuration (useRangeHeader, etc.)
 * @param {Object} config - Player configuration provider
 * @param {Object} logger - Logger factory
 * @param {Object} responseType - Response type configuration
 * @param {Object} httpClient - HTTP download client
 */
export class MediaRequestDownloader {
    constructor(clock, networkConfig, config, logger, responseType, httpClient) {
        /** @type {Object} */
        this.clock = clock;
        /** @type {Object} */
        this.networkConfig = networkConfig;
        /** @type {Function} */
        this.config = config;
        /** @type {Object} */
        this.responseType = responseType;
        /** @type {Object} */
        this.httpClient = httpClient;
        /** @type {Object} */
        this.log = logger.createSubLogger("MediaRequestDownloader");
    }

    /**
     * Initiates the download of a media request segment.
     *
     * @param {Object} mediaRequest - The media request object
     * @param {Object} byteRange - Byte range { start, end } for the download
     * @param {Object} requestContext - Additional request context
     */
    download(mediaRequest, byteRange, requestContext) {
        const self = this;
        mediaRequest.retryEnabled = true;
        mediaRequest.aborted = false;

        const isFullRequest = byteRange.start === 0 && byteRange.end === -1;
        const useRangeHeader = this.networkConfig.useRangeHeader || (!isFullRequest && mediaRequest.encodingPipelineInfo !== undefined);
        const trackType = mediaTypeToTrackType(mediaRequest.mediaType);

        const downloadParams = {
            url: mediaRequest.url,
            responseType: this.responseType.responseConfig.format,
            withCredentials: false,
            category: trackType,
            offset: isFullRequest ? undefined : byteRange.start,
            length: isFullRequest ? undefined : mediaRequest.totalBytes,
            track: { type: trackType },
            stream: {
                streamId: mediaRequest.selectedStreamId,
                bitrate: mediaRequest.bitrate,
            },
            sourceBuffer: { id: mediaRequest.sourceBufferIndex },
            previousRequest: mediaRequest,
            requestContext,
            useRangeHeader,
            cdnType: mediaRequest.cdnType,
        };

        // Add encoding pipeline info if available
        const pipelineInfo = mediaRequest.encodingPipelineInfo;
        if (pipelineInfo?.encodingpipelinetime !== undefined &&
            pipelineInfo?.pipelineDuration !== undefined &&
            pipelineInfo?.encodingTime !== undefined) {
            downloadParams.encodingPipelineInfo = [
                pipelineInfo.encodingTime,
                pipelineInfo.pipelineDuration,
                pipelineInfo.encodingpipelinetime,
                pipelineInfo.encodingPipelineMetadata,
            ];
        }

        const startTimestamp = this.getTimestamp();

        const downloadHandle = this.httpClient.download(downloadParams, (response) => {
            if (!response.success || mediaRequest.readyState === MediaRequestState.DONE) return;

            if (mediaRequest.readyState === MediaRequestState.ABORTED) return false;

            // Handle receiving state transition
            if (mediaRequest.readyState === MediaRequestState.RECEIVING_INITIAL) {
                mediaRequest.onHeadersReceived({
                    mediaRequest,
                    readyState: mediaRequest.readyState,
                    timestamp: mediaRequest.isEndOfStream ? startTimestamp : self.getTimestamp(),
                    connect: false,
                    responseHeaders: response.headers,
                    httpCode: response.httpCode,
                });
            }

            // Notify completion
            const completionData = {
                mediaRequest,
                readyState: mediaRequest.readyState,
                timestamp: self.getTimestamp(),
                cadmiumResponse: response,
                response: response.content,
            };
            mediaRequest.responseMetadata = completionData;
            mediaRequest.notifyComplete(completionData);
        });

        // Set up retry on abort
        const onAbort = () => {
            mediaRequest.removeEventListener(MediaRequestEvent.ABORT, onAbort);
            if (mediaRequest.aborted) {
                self.log.debug("MediaRequest aborted, not retrying (" + mediaRequest + ")");
                return;
            }

            const retryWaits = self.config().failedDownloadRetryWaitsASE;
            if (mediaRequest.downloadRetryCount === undefined) {
                mediaRequest.downloadRetryCount = 0;
            } else {
                mediaRequest.downloadRetryCount++;
            }
            if (mediaRequest.downloadRetryCount >= retryWaits.length) {
                mediaRequest.downloadRetryCount = retryWaits.length - 1;
            }

            clearTimeout(mediaRequest.retryTimeoutId);
            mediaRequest.retryTimeoutId = setTimeout(() => {
                mediaRequest.currentPosition();
            }, retryWaits[mediaRequest.downloadRetryCount]);
        };

        mediaRequest.addEventListener(MediaRequestEvent.ABORT, onAbort);
        mediaRequest.abortFunction = downloadHandle.abort;
    }

    /**
     * Aborts an in-progress media request download.
     * @param {Object} mediaRequest
     */
    abort(mediaRequest) {
        try {
            mediaRequest.aborted = true;
            clearTimeout(mediaRequest.retryTimeoutId);
            mediaRequest.retryTimeoutId = undefined;
            mediaRequest.downloadRetryCount = undefined;
            mediaRequest.abortFunction();
        } catch (err) {
            this.log.RETRY("exception aborting request");
        }
    }

    /**
     * Gets the current time in milliseconds from the clock.
     * @returns {number}
     */
    getTimestamp() {
        return this.clock.getCurrentTime().toUnit(MILLISECONDS);
    }
}
