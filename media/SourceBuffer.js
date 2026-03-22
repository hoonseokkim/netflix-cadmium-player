/**
 * Netflix Cadmium Player - Source Buffer Wrapper
 *
 * Wraps the native MSE SourceBuffer API, providing lifecycle management,
 * buffered range queries, media data appending, codec switching support,
 * and error handling for both audio and video source buffers.
 *
 * @module SourceBuffer
 * @original Module_90762
 */

// import { getMediaTypeName } from '../utils/MediaTypeUtils.js'; // webpack 93294
// import { config as globalConfig } from '../core/Config.js'; // webpack 29204
// import { ObservableValue } from '../utils/ObservableValue.js'; // webpack 81734
// import { EventEmitter } from '../events/EventEmitter.js'; // webpack 94886
// import { disposableList } from '../core/Registry.js'; // webpack 31276
// import { errorCodes } from '../core/ErrorCodes.js'; // webpack 36129
// import { assert } from '../assert/Assert.js'; // webpack 45146
// import { isNumber } from '../utils/TypeChecks.js'; // webpack 32687
// import { PlayerEvents } from '../player/PlayerEvents.js'; // webpack 85001
// import { MimeTypeResolver } from '../media/MimeTypeResolver.js'; // webpack 95162
// import { enumNamespace as HttpConstants } from '../network/HttpConstants.js'; // webpack 48220
// import { MediaType } from '../types/MediaType.js'; // webpack 26388

/**
 * Error thrown when codec switching fails
 */
export class CodecSwitchingError extends Error {
    /**
     * @param {string} message - Error message
     */
    constructor(message) {
        super(message);
        this.name = "CodecSwitchingError";
    }
}

/**
 * Wrapper around the native MSE SourceBuffer. Manages appending media data,
 * tracking buffer state, handling codec changes, and reporting errors.
 */
export class SourceBuffer {
    /**
     * @param {Object} playerState - Current player state
     * @param {number} mediaType - Media type (audio/video)
     * @param {MediaSource} mediaSource - Native MediaSource object
     * @param {Object} logger - Logger instance
     */
    constructor(playerState, mediaType, mediaSource, logger) {
        /** @type {Object} */
        this.playerState = playerState;

        /** @type {number} */
        this._mediaType = mediaType;

        /** @type {Object} */
        this.log = logger;

        /** @type {ObservableValue<boolean>} Whether the buffer is currently updating */
        this.updatingState = new ObservableValue(false);

        /** @type {Object} Error state tracking */
        this.errorState = { data: undefined, state: "", operation: "" };

        /** @type {*} */
        this.error = undefined;

        // Determine MIME type from current track streams
        const track = mediaType === MediaType.VIDEO
            ? playerState.tracks.videoTrack
            : playerState.tracks.audioTrackSelection;
        this.mimeType = this._getMimeTypeForProfile(track.streams);

        /** @type {EventEmitter} */
        this.eventEmitter = new EventEmitter();

        /** @type {Object} Metrics metadata */
        this.sourceBufferMetrics = { Type: this._mediaType };

        let isFirstBuffer = false;
        if (globalConfig.enableFirstBufferTracking) {
            isFirstBuffer = true;
            this._firstBufferFilled = new ObservableValue(false);
        }

        this.log.trace("Adding source buffer", this.sourceBufferMetrics, { TypeId: this.mimeType });

        /** @type {SourceBuffer} Native MSE SourceBuffer */
        this.nativeSourceBuffer = mediaSource.addSourceBuffer(this.mimeType);

        // Set up native event listeners
        this.nativeSourceBuffer.addEventListener("updatestart", () => {
            this.errorState.state = "updatestart";
        });

        this.nativeSourceBuffer.addEventListener("update", () => {
            this.errorState.state = "update";
        });

        this.nativeSourceBuffer.addEventListener("updateend", () => {
            this.updatingState.set(false);
            if (this._endOfStreamHandler) this._endOfStreamHandler();
            this.errorState.state = "updateend";

            let rangeCount = 0;
            try { rangeCount = this.nativeSourceBuffer.buffered.length; } catch (e) {}

            if (isFirstBuffer && rangeCount) {
                isFirstBuffer = false;
                this._firstBufferFilled.set(true);
            }
        });

        this.nativeSourceBuffer.addEventListener("error", (event) => {
            try {
                const errorMsg = event.target.error?.message;
                if (event.message || errorMsg) {
                    logger.error("error event received on sourcebuffer", {
                        mediaErrorMessage: event.message
                    });
                }
            } catch (e) {}

            playerState.fireError("PLAY_MSE_SOURCEBUFFER_ERROR", {
                mediaTypeName: getMediaTypeName(this._mediaType),
                errorInfo: this._getErrorState()
            });
        });

        this.nativeSourceBuffer.addEventListener("abort", () => {});

        playerState.addEventListener(PlayerEvents.closed, () => {
            this.nativeSourceBuffer = undefined;
        });
    }

    /** @returns {boolean} Whether the buffer is updating */
    getUpdatingState() {
        return this.updatingState.value;
    }

    /** @returns {boolean} Whether the native buffer is updating */
    updating() {
        return this.nativeSourceBuffer ? this.nativeSourceBuffer.updating : false;
    }

    /**
     * Sets the end-of-stream handler callback
     * @param {Function} handler
     */
    setEndOfStreamHandler(handler) {
        this._endOfStreamHandler = handler;
    }

    /** @returns {Object} Current error state */
    _getErrorState() {
        return this.errorState;
    }

    /** @returns {TimeRanges} Native buffered ranges */
    buffered() {
        return this.nativeSourceBuffer.buffered;
    }

    toString() {
        return `SourceBuffer (type: ${this._mediaType})`;
    }

    toJSON() {
        return { type: this._mediaType };
    }

    /**
     * Gets buffered ranges in milliseconds
     * @returns {Array<{start: number, end: number}>|undefined}
     */
    getBufferedRanges() {
        try {
            const buffered = this.nativeSourceBuffer.buffered;
            if (buffered) {
                const ranges = [];
                for (let i = 0; i < buffered.length; i++) {
                    const start = 1000 * buffered.start(i);
                    const end = 1000 * buffered.end(i);
                    assert(end > start);
                    ranges.push({ start, end });
                }
                return ranges;
            }
        } catch (e) {}
    }

    /**
     * Gets human-readable buffer status
     * @returns {Object|undefined} Buffer status with total buffered time and ranges
     */
    getBufferStatus() {
        let ranges = this.getBufferedRanges();
        if (ranges) {
            ranges = ranges.map(r => ({ start: r.start / 1000, end: r.end / 1000 }));
            const totalBuffered = ranges.reduce((sum, r) => sum + r.end - r.start, 0);
            const rangeStrings = ranges.map(r => `${r.start}-${r.end}`);
            return {
                Buffered: totalBuffered.toFixed(3),
                Ranges: rangeStrings.join("|")
            };
        }
    }

    /**
     * Appends raw media data to the source buffer
     * @param {ArrayBuffer} data - Media data
     * @param {Object} [metadata] - Segment metadata with timestampOffset
     */
    appendMediaData(data, metadata) {
        try {
            assert(
                this.nativeSourceBuffer.buffered && this.nativeSourceBuffer.buffered.length <= 1,
                "Gaps in media are not allowed: " + JSON.stringify(this.getBufferStatus())
            );
        } catch (e) {}

        assert(!this.getUpdatingState());

        const offset = metadata?.timestampOffset / 1000;
        if (isNumber(offset) && this.nativeSourceBuffer.timestampOffset !== offset) {
            this._recordOperation("timestampOffset", offset);
            this.nativeSourceBuffer.timestampOffset = offset;
        }

        this._recordOperation(metadata?.isEndOfStream ? "headerappend" : "mediaappend");
        this.nativeSourceBuffer.appendBuffer(data);
        this.updatingState.set(true);
    }

    /**
     * Removes a time range from the buffer
     * @param {number} start - Start time in seconds
     * @param {number} end - End time in seconds
     */
    remove(start, end) {
        assert(!this.getUpdatingState());
        try {
            this._recordOperation("remove");
            this.nativeSourceBuffer.remove(start, end);
            this.updatingState.set(true);
        } catch (e) {
            this.log.error("SourceBuffer remove exception", e, this.sourceBufferMetrics);
        }
    }

    /**
     * Records the current operation for error diagnostics
     * @param {string} operation - Operation name
     * @param {*} [data] - Operation data
     * @private
     */
    _recordOperation(operation, data) {
        this.errorState.data = data;
        this.errorState.state = "init";
        this.errorState.operation = operation;
    }

    /**
     * Records processing time metrics
     * @param {number} duration - Processing duration
     * @param {number} count - Number of items processed
     */
    setProcessingTime(duration, count) {
        this._processingTimeMs = (duration / count) * 1000;
    }

    /**
     * Changes the MIME type of the source buffer (codec switching)
     * @param {string} profileName - New profile name
     * @throws {CodecSwitchingError} If codec switching is not supported or fails
     */
    changeMimeType(profileName) {
        if (!this.nativeSourceBuffer) {
            this.log.info("No SourceBuffer");
            return;
        }

        const newMimeType = this._getMimeTypeForProfile([{
            type: this._mediaType,
            profileName
        }]);

        if (newMimeType === this.mimeType) return;

        const oldMimeType = this.mimeType;
        this.log.info(`Changing SourceBuffer mime-type from: ${this.mimeType} to: ${newMimeType}`);

        if (!this.nativeSourceBuffer.changeType) {
            throw new CodecSwitchingError("Platform doesnt support changing SourceBuffer mime-type");
        }

        try {
            this._recordOperation("changeType", newMimeType);
            this.nativeSourceBuffer.changeType(newMimeType);
            this.mimeType = newMimeType;
        } catch (e) {
            this.log.error("Error changing SourceBuffer type", e, this.sourceBufferMetrics, {
                From: oldMimeType,
                To: newMimeType
            });
            throw new CodecSwitchingError(e.message);
        }
    }

    /**
     * Appends a buffer with optional header/media distinction
     * @param {ArrayBuffer} data - Media data
     * @param {Object} [metadata] - Segment metadata
     * @returns {boolean} true
     */
    appendBuffer(data, metadata) {
        if (!metadata || metadata.isEndOfStream) {
            this._appendBufferEOS(data, metadata);
        } else {
            this._appendBufferNormal(data, metadata);
        }
        return true;
    }

    /** @private */
    _appendBufferEOS(data, metadata) {
        this.playerState.mediaSourceManager.appendBufferEOS(this, data, metadata || {});
    }

    /** @private */
    _appendBufferNormal(data, metadata) {
        const request = this._createMediaRequest(data, metadata);
        this.playerState.mediaSourceManager.appendBufferNormal(request);
    }

    /**
     * Creates a synthetic MediaRequest object for pre-loaded media data
     * @private
     */
    _createMediaRequest(data, metadata) {
        const processingTime = this._processingTimeMs || 0;
        return {
            getRequestId: () => this.requestId,
            constructor: { name: "MediaRequest" },
            mediaType: this._mediaType,
            readyState: HttpConstants.readyState.DONE,
            ptsStart: metadata.startPts,
            ptsEnd: metadata.startPts + metadata.duration,
            segmentDuration: metadata.duration,
            timestampOffset: processingTime,
            encryptionMetadata: metadata.encryptionMetadata,
            segmentId: metadata.segmentId,
            selectedStreamId: metadata.selectedStreamId,
            sourceBufferIndex: +metadata.sourceBufferIndex,
            location: metadata.location,
            byteOffsetStart: metadata.offset,
            byteOffsetEnd: metadata.offset + metadata.byteLength - 1,
            bitrate: metadata.bitrate,
            response: data,
            hasResponseData: data && data.byteLength > 0,
            isHeaderSegment: true,
            get isEndOfStream() { return !this.isHeaderSegment; },
            processingLatencyMs: this._processingLatencyMs - Math.floor(processingTime) || Infinity,
            toJSON() {
                const info = {
                    requestId: this.requestId,
                    segmentId: this.segmentId,
                    isHeader: this.isEndOfStream,
                    ptsStart: this.ptsStart,
                    ptsOffset: this.timestampOffset,
                    responseType: this.responseType,
                    duration: this.segmentDuration,
                    readystate: this.readyState
                };
                if (this.stream) info.bitrate = this.stream.bitrate;
                return JSON.stringify(info);
            }
        };
    }

    /**
     * Signals end of stream for this source buffer
     * @returns {boolean} true
     */
    endOfStream() {
        this.playerState.debugLog("EndOfStream");
        this.playerState.mediaSourceManager?.signalEndOfStream(this._mediaType);
        return true;
    }

    /**
     * Sets the associated stream reference
     * @param {Object} stream
     */
    setStream(stream) {
        this._stream = stream;
    }

    addEventListener(event, handler, priority) {
        this.eventEmitter.addListener(event, handler, priority);
    }

    removeEventListener(event, handler) {
        this.eventEmitter.removeListener(event, handler);
    }

    /**
     * Gets the MIME type string for given stream profiles
     * @param {Array<Object>} streams
     * @returns {string} MIME type string
     * @private
     */
    _getMimeTypeForProfile(streams) {
        const resolver = MimeTypeResolver.getInstance();
        return this._mediaType === MediaType.VIDEO
            ? resolver.getVideoMimeType(streams)
            : resolver.getAudioMimeType(streams);
    }

    /** @returns {number} The media type */
    get mediaType() { return this._mediaType; }

    /** @returns {Object} The associated stream */
    get stream() { return this._stream; }

    /** @returns {string} "audio" or "video" */
    get typeName() {
        return this._mediaType === 0 ? "audio" : "video";
    }
}
