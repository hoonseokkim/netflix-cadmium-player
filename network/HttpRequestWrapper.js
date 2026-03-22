/**
 * Netflix Cadmium Player — HTTP Request Wrapper
 *
 * Wraps an individual media HTTP request with lifecycle state management,
 * retry logic with exponential backoff and jitter, network monitoring
 * integration, and structured event dispatch to a listener interface.
 *
 * Each wrapper tracks a single byte-range download for a media stream
 * (audio, video, or text), transitioning through the states:
 *   CREATED -> OPENED -> ACTIVE -> RECEIVING -> COMPLETE | ABORTED
 *
 * Used by AseRequest (the segment-level request coordinator) to manage
 * per-fragment HTTP fetches against Netflix Open Connect CDN endpoints.
 *
 * @module HttpRequestWrapper
 */

// --- external dependency stubs (webpack imports) ---
// import * as helpers            from '../modules/Module_22970.js';  // tslib helpers
// import { ClockWatcher }        from '../modules/Module_90745.js';  // EventEmitter + ClockWatcher
// import { platform }            from '../modules/Module_66164.js';  // platform abstraction
// import { laser, mediaTypeToString } from '../modules/Module_97685.js'; // logging / telemetry
// import { assert }              from '../modules/Module_52571.js';  // assertion util
// import { timestampBuffer }     from '../modules/Module_45550.js';  // latency sample ring buffer
// import { MediaType }           from '../modules/Module_65161.js';  // media type enum
// import NetworkMonitor          from '../modules/Module_40497.js';  // network perf monitor

/* ------------------------------------------------------------------ */
/*  Request State Enum                                                */
/* ------------------------------------------------------------------ */

/**
 * Lifecycle states for an HTTP media request.
 * @enum {number}
 */
export const RequestState = Object.freeze({
  /** Request object created but not yet sent. */
  CREATED:   0,
  /** Request has been sent (opened) and is awaiting response headers. */
  OPENED:    1,
  /** Response headers received; waiting for first data byte. */
  ACTIVE:    2,
  /** Actively receiving response body bytes. */
  RECEIVING: 3,
  /** Response fully received and processed. */
  COMPLETE:  4,
  /** Request was cancelled before completion. */
  ABORTED:   5,
});

/* ------------------------------------------------------------------ */
/*  HTTPRequestWrapper                                                */
/* ------------------------------------------------------------------ */

/**
 * @typedef {Object} RequestProperties
 * @property {string}  [rC]                  - CDN type identifier / side-channel token
 * @property {*}       [ZN]                  - Bandwidth estimator reference
 * @property {number}  cdnId                 - CDN server identifier
 * @property {number}  [responseType]        - Desired response type override
 * @property {boolean} isEndOfStream         - Whether this is the final segment
 * @property {boolean} [enableForcedJsRequests] - Force JS-based (XHR) requests
 */

/**
 * @typedef {Object} ByteRange
 * @property {number} offset - Start byte offset within the resource
 * @property {number} la     - Content length (number of bytes to fetch)
 */

/**
 * @typedef {Object} RequestListener
 * @property {function} onRequestActive           - Headers received, request now active
 * @property {function} onFirstByte               - First body byte received
 * @property {function} onDataReceived            - Progress: additional body bytes received
 * @property {function} onRequestComplete         - Download finished successfully
 * @property {function} onRequestFailed           - Download failed (network / HTTP error)
 * @property {function} onRequestRedirected       - Server issued a redirect
 * @property {function} onRequestRedirectedBranch - Request disposed while still in-flight
 * @property {function} onContentLengthChanged    - Content-Length updated after initial estimate
 */

export class HTTPRequestWrapper {

  /* ---------------------------------------------------------------- */
  /*  Construction                                                    */
  /* ---------------------------------------------------------------- */

  /**
   * @param {Object}            stream       - Media stream descriptor (audio/video/text)
   * @param {string}            requestUrl   - Initial request URL
   * @param {*}                 transportType - Transport constructor parameter
   * @param {*}                 transportConfig - Transport configuration
   * @param {RequestProperties} properties   - CDN & request property bag
   * @param {ByteRange}         byteRange    - Offset + content length
   * @param {RequestListener}   listener     - Callback interface for state transitions
   * @param {Object}            [segment]    - Current segment metadata
   * @param {Object}            config       - Player configuration
   * @param {Object}            console      - Logging console
   */
  constructor(stream, requestUrl, transportType, transportConfig, properties, byteRange, listener, segment, config, console) {
    /** @type {Object} Media stream descriptor */
    this.stream = stream;

    /** @type {string} Current request URL (may change on redirect/retry) */
    this.requestUrl = requestUrl;

    /** @type {RequestProperties} */
    this.properties = properties;

    /** @type {RequestListener} */
    this.listener = listener;

    /** @type {Object} Player configuration */
    this.config = config;

    /** @type {Object} Logger */
    this.console = console;

    /** @type {number} Total bytes received across all progress events */
    this.previousBytesReceived = 0;

    /** @type {number} Number of retry attempts so far */
    this.retryCount = 0;

    /** @type {RequestState} Current lifecycle state */
    this.requestState = RequestState.CREATED;

    /** @type {boolean} Whether the last attempt failed (pending retry) */
    this.isFailed = false;

    /** @private Underlying platform media request */
    this.request = new platform.HttpMediaRequest(
      transportType,
      transportConfig,
      this._buildMediaRequestDescriptor(properties, segment)
    );

    /** @type {number} Byte offset within the resource */
    this.offset = byteRange.offset;

    /** @type {number} Number of bytes to fetch */
    this.contentLength = byteRange.la;

    /** @type {string} Human-readable request description */
    this.id = this._formatRequestInfo();

    /** @type {string} CDN type identifier / side-channel token */
    this.cdnTypeIdentifier = properties.rC;

    /** @type {*} Bandwidth estimator reference */
    this.bandwidthEstimator = properties.ZN;

    /** @type {number} CDN server id */
    this.cdnId = properties.cdnId;

    /** @type {number} Desired response type (0 = arraybuffer, 1 = blob) */
    this.responseType = this._resolveResponseType(properties);

    /** @private Event listener subscription handle */
    this.eventListeners = this._attachListeners();

    // Attach network monitor for non-text, non-header-only requests
    const isTextMedia = this.mediaType === MediaType.TEXT_MEDIA_TYPE;
    const skipMonitoring = !config.addHeaderDataToNetworkMonitor && properties.isEndOfStream;
    if (!isTextMedia && !skipMonitoring) {
      /** @type {NetworkMonitor|undefined} */
      this.networkMonitor = NetworkMonitor.instance();
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Getters (read-only computed properties)                         */
  /* ---------------------------------------------------------------- */

  /** @returns {string} Current request URL */
  get url() {
    return this.requestUrl;
  }

  /** @returns {number} Content length in bytes */
  get la() {
    return this.contentLength;
  }

  /** @returns {number} Media type enum value from the parent stream */
  get mediaType() {
    return this.stream.mediaType;
  }

  /** @returns {number} Bytes received so far */
  get bytesReceived() {
    return this.previousBytesReceived;
  }

  /** @returns {number|undefined} HTTP status code from the underlying request */
  get status() {
    return this.request.status;
  }

  /** @returns {number|undefined} Timestamp when the request was issued */
  get requestTimestamp() {
    return this.request.requestTimestamp;
  }

  /** @returns {*} Raw response body */
  get response() {
    return this.request.response;
  }

  /** @returns {number|undefined} Platform error code */
  get errorCode() {
    return this.request.errorCode;
  }

  /** @returns {string|undefined} Platform error name */
  get errorName() {
    return this.request.errorName;
  }

  /** @returns {string|undefined} Native platform error code */
  get nativeCode() {
    return this.request.dh;
  }

  /** @returns {*} Underlying transport track reference */
  get track() {
    return this.request.track;
  }

  /** @returns {Array} Server-Timing header entries */
  get serverTimingEntries() {
    return this.request.serverTimingEntries;
  }

  /** @returns {boolean} True if the request has been opened but not yet completed */
  get opened() {
    return this.requestState >= RequestState.OPENED && this.requestState < RequestState.COMPLETE;
  }

  /** @returns {boolean} True if the request is actively downloading (ACTIVE or RECEIVING) */
  get active() {
    return this.requestState >= RequestState.ACTIVE && this.requestState < RequestState.COMPLETE;
  }

  /** @returns {boolean} True if currently in the RECEIVING state */
  get isReceiving() {
    return this.requestState === RequestState.RECEIVING;
  }

  /** @returns {boolean} True if the download completed successfully */
  get complete() {
    return this.requestState === RequestState.COMPLETE;
  }

  /** @returns {boolean} True if the request was aborted */
  get aborted() {
    return this.requestState === RequestState.ABORTED;
  }

  /** @returns {RequestState} Current lifecycle state */
  get state() {
    return this.requestState;
  }

  /** @returns {number} Last byte offset (inclusive) of the requested range */
  get endOffset() {
    return this.offset + this.contentLength - 1;
  }

  /* ---------------------------------------------------------------- */
  /*  Public methods                                                  */
  /* ---------------------------------------------------------------- */

  /**
   * Send the request. May only be called once while in CREATED state.
   * @returns {boolean} True if the request was sent successfully
   */
  send() {
    if (this.requestState !== RequestState.CREATED) {
      return false;
    }

    const byteRange = { start: this.offset, end: this.endOffset };
    const encodingPipelineInfo = this.stream.isLive
      ? this.stream.viewableSession.encodingInfo.encodingPipelineInfo
      : undefined;

    const sent = this.request.send(
      this.requestUrl,
      byteRange,
      this.responseType,
      {},           // extra headers
      undefined,    // timeout
      undefined,    // priority
      this.cdnTypeIdentifier,
      this.stream.cdnType,
      encodingPipelineInfo
    );

    if (!sent) {
      return false;
    }

    this.requestState = RequestState.OPENED;
    return true;
  }

  /**
   * Update the request URL. If the URL changed and the request is in-flight,
   * the underlying transport is redirected. If the URL is the same and the
   * request has failed or timed out, a retry is scheduled.
   *
   * @param {string} newUrl - The (potentially updated) URL
   * @returns {boolean} True on success
   */
  updateUrl(newUrl) {
    // Not yet opened or already finished — just update the URL
    if (this.state < RequestState.OPENED || this.state >= RequestState.COMPLETE) {
      this.requestUrl = newUrl;
      return true;
    }

    if (this.requestUrl === newUrl) {
      // Same URL: check for failure or timeout → schedule retry
      const timedOut =
        this.state === RequestState.ACTIVE &&
        platform.now() - this.requestTimestamp > this.config.missedRequestFailureTimeout;

      if (this.isFailed || timedOut) {
        return this._scheduleRetry();
      }
    } else {
      // Different URL: redirect the underlying request
      this._cancelRetryTimer();
      this.retryCount = 0;
      this.requestUrl = newUrl;
      this.isFailed = false;
      return this.request.updateUrl(newUrl);
    }

    return true;
  }

  /**
   * Abort the in-flight request.
   * @returns {boolean} Always true
   */
  abort() {
    if (this.aborted) {
      return true;
    }

    // Record completion metrics before aborting
    if (this.active) {
      this.networkMonitor?.recordRequestComplete(
        platform.now(),
        this.requestStartTime,
        this._getRequestMetrics()
      );
    }

    this.requestState = RequestState.ABORTED;
    this._cancelRetryTimer();
    this.request.abort();

    if (laser.isEnabled) {
      laser.log({
        playgraphId: this.stream.playgraphId,
        type: 'HTTP_REQUEST_STATE_CHANGE',
        id: this.getRequestId().toString(),
        state: 'ABORTED',
      });
    }

    return true;
  }

  /**
   * Dispose of the request, cleaning up listeners and aborting if necessary.
   * Notifies the listener via onRequestRedirectedBranch if the request was
   * still in-flight.
   */
  dispose() {
    // readyState 7 = DONE, 5 = ABORTED in the platform layer
    if (this.request.readyState !== 7 && this.request.readyState !== 5) {
      const wasOpened = this.opened;
      const wasActive = this.active;
      this.abort();
      this.listener.onRequestRedirectedBranch(this, wasActive, wasOpened);
    }

    this._cancelRetryTimer();
    this.eventListeners?.clear();
    this.request.dispose();
  }

  /**
   * Retrieve a single response header value.
   * @param {string}  name         - Header name
   * @param {boolean} [caseExact]  - Whether the lookup is case-sensitive
   * @returns {string|null}
   */
  getResponseHeader(name, caseExact) {
    return this.request.getResponseHeader(name, caseExact);
  }

  /**
   * Retrieve all response headers.
   * @param {boolean} [caseExact] - Whether the lookup is case-sensitive
   * @returns {Object}
   */
  getAllResponseHeaders(caseExact) {
    return this.request.getAllResponseHeaders(caseExact);
  }

  /**
   * Parse the Content-Range header to determine the total resource size.
   * @returns {number|undefined} Total content length, or undefined if unavailable
   */
  getContentLength() {
    const contentRange = this.getResponseHeader('content-range', false);
    if (!contentRange) {
      return undefined;
    }

    const slashIndex = contentRange.indexOf('/');
    assert(slashIndex !== -1, 'unable to parse content-range: ' + contentRange);

    const totalStr = contentRange.slice(slashIndex + 1);
    const total = parseInt(totalStr);
    assert(total > 0, 'unable to parse content-range: ' + contentRange);

    return total;
  }

  /**
   * Get the payload size from the underlying request.
   */
  getPayloadSize() {
    this.request.getPayloadSize();
  }

  /**
   * @returns {number} Unique request identifier from the transport layer
   */
  getRequestId() {
    return this.request.getRequestId();
  }

  /**
   * @returns {string} Human-readable representation
   */
  toString() {
    return `ID: ${this.request.getRequestId()} ${this.id}`;
  }

  /**
   * @returns {Object} JSON-serializable summary
   */
  toJSON() {
    return {
      requestId: this.request.getRequestId(),
      id: this.id,
    };
  }

  /* ---------------------------------------------------------------- */
  /*  Event handlers (called by platform transport via ClockWatcher)  */
  /* ---------------------------------------------------------------- */

  /**
   * Called when HTTP response headers are received (status line available).
   * Transitions OPENED -> ACTIVE.
   * @private
   */
  _onHeadersReceived() {
    if (this.requestState !== RequestState.OPENED) {
      return;
    }

    this.requestState = RequestState.ACTIVE;

    const timestamp = this.request.requestTimestamp || this.request.loadTime;
    timestampBuffer.instance().push(platform.now() - timestamp);

    // Record request start for network monitoring (header-based mode)
    if (!this.config.markRequestActiveOnFirstByte) {
      this.networkMonitor?.recordRequestStart(timestamp, this._getRequestMetrics());
    }

    this.listener.onRequestActive(this);
    this.requestStartTime = timestamp;

    if (laser.isEnabled) {
      laser.log({
        playgraphId: this.stream.playgraphId,
        type: 'HTTP_REQUEST_STATE_CHANGE',
        id: this.getRequestId().toString(),
        state: 'WAITING',
        mediaType: mediaTypeToString(this.stream.mediaType),
        byteRange: [this.offset, this.endOffset],
        url: this.url,
        bitrateKbps: this.stream.bitrate,
        retryCount: this.retryCount,
      });
    }
  }

  /**
   * Called when the first response body byte arrives.
   * Transitions to RECEIVING, parses Content-Range / Content-Length headers,
   * and records connection timing.
   * @private
   */
  _onFirstByteReceived() {
    if (this.requestState >= RequestState.RECEIVING) {
      return;
    }

    this.requestState = RequestState.RECEIVING;

    const timestamp = this.request.requestTimestamp || this.request.firstByteTimestamp;
    timestampBuffer.instance().push(platform.now() - timestamp);

    // Record request start for network monitoring (first-byte mode)
    if (this.config.markRequestActiveOnFirstByte) {
      this.networkMonitor?.recordRequestStart(timestamp, this._getRequestMetrics());
    }

    this.networkMonitor?.onFirstByteMonitor();

    // Record connection info from Server-Timing if this is a new connection
    const serverTimingEntries = this.request.serverTimingEntries;
    if (this.request.connect && serverTimingEntries.length) {
      this.networkMonitor?.recordConnectionInfo(serverTimingEntries[0]);
    }

    this.requestStartTime = timestamp;
    this.listener.onFirstByte(this);

    // Update content length from actual response if initially unknown
    if (this.contentLength === 0) {
      this._updateContentLength(this.request.totalBytes);
    }

    // Parse response headers for logging
    const contentRangeHeader = this.request.getResponseHeader('Content-Range', true);
    const contentLengthHeader = this.request.getResponseHeader('Content-Length', true);
    const transferEncodingHeader = this.request.getResponseHeader('Transfer-Encoding', true);
    const hasContentRange = contentRangeHeader !== null;

    // Consume all headers (for monitoring purposes)
    this.request.getAllResponseHeaders(true);

    if (laser.isEnabled) {
      if (hasContentRange) {
        const rangeMatch = contentRangeHeader?.match(/bytes (\d+)-(\d+)\/(\d+|\*)/);
        const contentRange = rangeMatch
          ? [parseInt(rangeMatch[1]), parseInt(rangeMatch[2])]
          : [this.offset, this.endOffset];

        laser.log({
          playgraphId: this.stream.playgraphId,
          type: 'HTTP_REQUEST_STATE_CHANGE',
          id: this.getRequestId().toString(),
          state: 'RECEIVING',
          httpStatus: this.status,
          responseType: 'BYTE_RANGE',
          contentRange,
        });
      } else {
        laser.log({
          playgraphId: this.stream.playgraphId,
          type: 'HTTP_REQUEST_STATE_CHANGE',
          id: this.getRequestId().toString(),
          state: 'RECEIVING',
          httpStatus: this.status,
          responseType: 'OPEN_RANGE',
          chunked: transferEncodingHeader === 'chunked',
          contentLength: contentLengthHeader ? parseInt(contentLengthHeader) : -1,
        });
      }
    }
  }

  /**
   * Called on download progress (additional bytes received).
   * @private
   */
  _onDataProgress() {
    if (this.requestState > RequestState.RECEIVING) {
      return;
    }

    this.requestState = RequestState.RECEIVING;

    const timestamp = this.request.requestTimestamp;
    timestampBuffer.instance().push(platform.now() - timestamp);

    const bytesTransferred = this._recordBytesTransferred(true);
    this.listener.onDataReceived(this, bytesTransferred);
  }

  /**
   * Called when the request completes successfully.
   * @private
   */
  _onRequestFinish() {
    if (this.aborted) {
      return;
    }

    const timestamp = this.request.requestTimestamp;
    timestampBuffer.instance().push(platform.now() - timestamp);

    const bytesTransferred = this._recordBytesTransferred(true);

    this.networkMonitor?.recordRequestComplete(
      timestamp,
      this.requestStartTime,
      this._getRequestMetrics()
    );

    this.requestState = RequestState.COMPLETE;
    this.listener.onRequestComplete(this, bytesTransferred);
    this.dispose();

    if (laser.isEnabled) {
      laser.log({
        playgraphId: this.stream.playgraphId,
        type: 'HTTP_REQUEST_STATE_CHANGE',
        id: this.getRequestId().toString(),
        state: 'SUCCEEDED',
      });
    }
  }

  /**
   * Called when the server issues a redirect.
   * @private
   */
  _onRequestRedirected() {
    this.listener.onRequestRedirected(this);
  }

  /**
   * Called when the request fails with a network or HTTP error.
   * @private
   */
  _onRequestError() {
    if (this.complete || this.aborted) {
      return;
    }
    if (typeof this.request.errorCode !== 'number') {
      return;
    }

    this.isFailed = true;

    const timestamp = this.request.requestTimestamp;
    timestampBuffer.instance().push(platform.now() - timestamp);

    // Optionally record failed bytes to the network monitor
    const shouldRecordBytes =
      this.config.reportFailedRequestsToNetworkMonitor &&
      this.request.status === undefined;
    this._recordBytesTransferred(shouldRecordBytes);

    this.networkMonitor?.recordNetworkError(this.request.errorCode);

    if (laser.isEnabled) {
      laser.log({
        playgraphId: this.stream.playgraphId,
        type: 'HTTP_REQUEST_STATE_CHANGE',
        id: this.getRequestId().toString(),
        state: 'FAILED',
        httpStatus: this.status,
      });
    }

    this.listener.onRequestFailed(this);
  }

  /* ---------------------------------------------------------------- */
  /*  Private helpers                                                 */
  /* ---------------------------------------------------------------- */

  /**
   * Record byte transfer progress to the network monitor and return
   * the number of new bytes received since the last call.
   *
   * @private
   * @param {boolean} shouldRecord - Whether to push samples to the network monitor
   * @returns {number} Delta bytes received
   */
  _recordBytesTransferred(shouldRecord) {
    const currentTimestamp = this.request.requestTimestamp;
    const deltaBytes = this.request.bytesReceived - this.previousBytesReceived;

    if (shouldRecord && this.networkMonitor) {
      if (this.requestStartTime !== undefined && deltaBytes > 0) {
        this.networkMonitor.recordBytesTransferred(
          deltaBytes,
          this.requestStartTime,
          currentTimestamp,
          this._getRequestMetrics()
        );
      }
      this.request.serverTimingEntries?.forEach((entry) => {
        this.networkMonitor.recordServerTiming(entry);
      });
    }

    this.requestStartTime = currentTimestamp;
    this.previousBytesReceived = this.request.bytesReceived;
    return deltaBytes;
  }

  /**
   * Update the content length and notify the listener.
   * @private
   * @param {number} newLength
   */
  _updateContentLength(newLength) {
    const previousLength = this.contentLength;
    this.contentLength = newLength;
    this.listener.onContentLengthChanged(this, this.contentLength, previousLength);
  }

  /**
   * Build the metrics object passed to the network monitor.
   * @private
   * @returns {Object}
   */
  _getRequestMetrics() {
    return {
      requestId: this.id,
      im: this.stream.liveAdjustAudioTimestamps,
      pbcid: this.stream.viewableSession.manifestRef.cdnResponseData?.pbcid,
      type: this.mediaType,
      ZN: this.bandwidthEstimator,
      la: this.contentLength,
      bytesReceived: this.request.bytesReceived,
      cdnId: this.cdnId,
    };
  }

  /**
   * Build a human-readable description of this request (stream + byte range).
   * @private
   * @returns {string}
   */
  _formatRequestInfo() {
    let info = this.stream ? this.stream.toString() : this.url;
    if (this.contentLength) {
      info += `,range ${this.offset}-${this.offset + this.contentLength - 1}`;
    }
    return info;
  }

  /**
   * Attach event listeners to the underlying platform request via ClockWatcher.
   * @private
   * @returns {ClockWatcher}
   */
  _attachListeners() {
    const watcher = new ClockWatcher();
    const events = platform.HttpMediaRequest.events;

    watcher.on(this.request, events.HEADERS_RECEIVED, () => this._onHeadersReceived());
    watcher.on(this.request, events.FIRST_BYTE,       () => this._onFirstByteReceived());
    watcher.on(this.request, events.DATA_PROGRESS,     () => this._onDataProgress());
    watcher.on(this.request, events.COMPLETE,          () => this._onRequestFinish());
    watcher.on(this.request, events.REDIRECTED,        () => this._onRequestRedirected());
    watcher.on(this.request, events.ERROR,             () => this._onRequestError());

    return watcher;
  }

  /**
   * Build the media request descriptor passed to the platform transport constructor.
   * @private
   * @param {RequestProperties} properties
   * @param {Object}            [segment]
   * @returns {Object}
   */
  _buildMediaRequestDescriptor(properties, segment) {
    return {
      mediaType: this.mediaType,
      selectedStreamId: this.stream.selectedStreamId,
      bitrate: this.stream.bitrate,
      sourceBufferIndex: this.stream.liveAdjustAudioTimestamps,
      isHeaderSegment: !properties.isEndOfStream,
      M: segment?.id ?? 'unknown',
      config: this.config,
      enableForcedJsRequests: properties.enableForcedJsRequests,
    };
  }

  /**
   * Schedule a retry with exponential backoff and random jitter.
   * @private
   * @returns {boolean} Always true
   */
  _scheduleRetry() {
    if (this.retryTimerId !== undefined) {
      return true;
    }

    // Calculate base delay, accounting for time already elapsed
    const elapsed = this.request.requestTimestamp
      ? platform.now() - this.request.requestTimestamp
      : 0;
    let delay = Math.max(0, this.config.networkRequestRetryDelay - elapsed);

    // Add exponential jitter: minJitter * 2^retryCount, capped at maxJitter
    const jitter = Math.random() * Math.min(
      this.config.networkRequestRetryMinJitter * Math.pow(2, this.retryCount),
      this.config.networkRequestRetryMaxJitter
    );
    delay += jitter;

    this.retryCount += 1;

    this.retryTimerId = setTimeout(() => {
      this.retryTimerId = undefined;

      if (this.state >= RequestState.COMPLETE) {
        return;
      }
      if (!this.isFailed && this.state !== RequestState.ACTIVE) {
        return;
      }

      this.isFailed = false;

      if (!this.request.updateUrl(this.requestUrl)) {
        this.listener.onRequestFailed(this);
      }

      if (laser.isEnabled) {
        laser.log({
          playgraphId: this.stream.playgraphId,
          type: 'HTTP_REQUEST_STATE_CHANGE',
          id: this.getRequestId().toString(),
          state: 'WAITING',
          mediaType: mediaTypeToString(this.stream.mediaType),
          byteRange: [this.offset, this.endOffset],
          url: this.url,
          bitrateKbps: this.stream.bitrate,
          retryCount: 0,
        });
      }
    }, delay);

    return true;
  }

  /**
   * Cancel any pending retry timer.
   * @private
   */
  _cancelRetryTimer() {
    if (this.retryTimerId !== undefined) {
      clearTimeout(this.retryTimerId);
      this.retryTimerId = undefined;
    }
  }

  /**
   * Determine the response type: use the property override if provided,
   * otherwise fall back to platform capability detection.
   * @private
   * @param {RequestProperties} properties
   * @returns {number} 0 = arraybuffer, 1 = blob
   */
  _resolveResponseType(properties) {
    if (properties.responseType !== undefined) {
      return properties.responseType;
    }
    // If codec profiles indicate arraybuffer is not required, prefer it
    const profiles = platform.HttpMediaRequest.codecProfilesMap;
    if (profiles && !profiles.nestedConfig.isRequired) {
      return 0; // arraybuffer
    }
    return 1; // blob
  }
}

// Legacy export alias for backward compatibility
export { RequestState as stateEnum };
