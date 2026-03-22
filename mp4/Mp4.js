/**
 * Netflix Cadmium Player - MP4 Header Request Module
 * Component: MP4
 *
 * Handles the initial MP4 header (moov box) download for a media stream.
 * Parses the MP4 structure (moov, sidx, trak, etc.) to extract codec info,
 * timescale, fragment index, and optional VMAF quality data. Extends the
 * base media request class to support multi-part header fetching.
 */

// Dependencies
// import { __extends, __assign } from 'tslib';              // webpack 22970
// import { Mp4BoxParser } from './Mp4BoxParser';             // webpack 91562
// import { TimeUtil } from './TimeUtil';                      // webpack 91176
// import { EventEmitter } from './EventEmitter';             // webpack 90745
// import { platform } from './Platform';                      // webpack 66164
// import { concatenateArrayBuffers } from './BufferUtils';    // webpack 69575
// import { outputList } from './Mixins';                      // webpack 85254
// import { assert } from './Assert';                          // webpack 52571
// import { MediaType, playerPhase } from './Constants';       // webpack 65161
// import { RequestMetrics } from './RequestMetrics';          // webpack 83527
// import { BaseMediaRequest } from './BaseMediaRequest';      // webpack 50247

const mp4Console = new platform.Console("MP4", "media|asejs");

/**
 * Creates a default header-request descriptor.
 * @param {number} sourceBufferIndex - Index of the source buffer
 * @returns {Object}
 */
function createHeaderRequestDescriptor(sourceBufferIndex) {
    return {
        isHeaderRequest: true,
        cdnId: { phase: playerPhase.STARTING },
        sourceBufferIndex,
        responseType: 0,
    };
}

/**
 * @class Mp4HeaderRequest
 * @extends BaseMediaRequest
 *
 * Manages the download and parsing of an MP4 header (init segment).
 * After the header bytes arrive, the moov/sidx boxes are parsed to
 * extract stream metadata such as codec, timescale, fragment durations,
 * track ID, and optional per-fragment VMAF quality scores.
 */
export class Mp4HeaderRequest extends BaseMediaRequest {
    /** @type {Console} Shared console for MP4 log messages */
    static mp4StaticConsole = mp4Console;

    /**
     * @param {Object} stream - The media stream descriptor
     * @param {Object} pipeline - Request pipeline reference
     * @param {Object} queueing - Queueing context with track reference
     * @param {Object} requestInfo - Byte range { offset, byteSize, sourceDataBuffer, sourceBufferIndex }
     * @param {*} config - Player configuration
     * @param {*} networkContext - Network / CDN context
     * @param {boolean} [fromCache] - Whether this came from the cache
     * @param {*} [diagnostics] - Diagnostics reference
     */
    constructor(stream, pipeline, queueing, requestInfo, config, networkContext, fromCache, diagnostics) {
        const track = queueing.track;
        const label = `${fromCache ? "(cache)" : ""}${stream.id} header`;

        // If there's already buffered data, adjust offset/size accordingly
        let adjustedOffset = requestInfo.offset;
        let adjustedSize = requestInfo.byteSize;

        if (requestInfo.sourceDataBuffer) {
            adjustedOffset += requestInfo.sourceDataBuffer.byteLength;
            adjustedSize -= requestInfo.sourceDataBuffer.byteLength;
        }

        const adjustedRequest = {
            ...requestInfo,
            ...createHeaderRequestDescriptor(requestInfo.sourceBufferIndex),
            offset: adjustedOffset,
            byteSize: adjustedSize,
        };

        super(stream, track, label, adjustedRequest, config, networkContext, pipeline, diagnostics);

        /** @type {Object} */
        this.queueing = queueing;

        /** @private @type {number} Number of sub-requests made */
        this._subRequestCount = 0;

        RequestMetrics.initializeMetrics(this, stream, networkContext, adjustedRequest, diagnostics);

        /** @private @type {number} Initial request size */
        this._initialRequestSize = adjustedRequest.byteSize;

        ++this._subRequestCount;
    }

    /** @returns {boolean} Always true for header requests */
    get isHeaderRequest() {
        return true;
    }

    /** @returns {*} Parsed header metadata */
    get headerMetadata() {
        return this._headerMetadata;
    }

    /**
     * Cancels the request and emits a cancellation event.
     */
    dispose() {
        if (!this.complete) {
            const event = { type: "headerRequestCancelled", request: this };
            this.emit(event.type, event);
        }
        super.dispose();
    }

    /**
     * Called when bytes arrive — notifies the stream that header data is incoming.
     * @param {ArrayBuffer} data
     */
    extractBytes(data) {
        this.stream.onHeaderDataReceiving();
        super.extractBytes(data);
    }

    /**
     * Handles a redirect during the header download.
     * @param {*} url
     * @param {*} headers
     * @param {*} status
     */
    handleRedirect(url, headers, status) {
        this.stream.onHeaderRedirect();
        super.handleRedirect(url, headers, status);
    }

    /**
     * Called when the HTTP response completes. Accumulates response data,
     * attempts to parse the MP4 header, and either issues a follow-up
     * request or signals completion/failure.
     *
     * @param {Object} response - The HTTP response
     * @param {*} context - Additional context
     */
    onRequestComplete(response, context) {
        const body = response.response;
        if (body) {
            this._accumulateResponseData(body);
        }

        assert(this.sourceData);
        response.getPayloadSize();

        if (this._parseHeader()) {
            this.stream.onHeaderRedirect();
            super.onRequestComplete(response, context);
        } else if (this._remainingHeaderBytes) {
            this._issueFollowUp(response.offset + response.byteSize, this._remainingHeaderBytes);
            super.onRequestComplete(response, context);
        } else {
            super.onRequestFailed(response);
        }
    }

    /**
     * Issues a follow-up request for remaining header bytes.
     * @private
     * @param {number} offset - Byte offset to continue from
     * @param {number} size - Number of bytes remaining
     */
    _issueFollowUp(offset, size) {
        this.makeFollowupRequest(
            this.requestLabel,
            `${this.label} (${this._subRequestCount})`,
            createHeaderRequestDescriptor(this.sourceBufferIndex),
            { offset, byteSize: size }
        );
        ++this._subRequestCount;
    }

    /**
     * Parses the accumulated header bytes as MP4 boxes (moov, sidx, etc.)
     * and extracts stream metadata.
     *
     * @private
     * @returns {boolean} true if parsing succeeded and produced valid metadata
     */
    _parseHeader() {
        const config = this.config;
        const MediaSource = platform.MediaSource;

        const parser = new Mp4BoxParser(
            Mp4HeaderRequest.mp4StaticConsole,
            this.stream,
            this.sourceData,
            this.stream.isLive ? ["moov"] : ["sidx"],
            config.parseAdditionalBoxesMp4Header,
            {
                skipEncryption: this.stream.track.skipEncryption,
                noFrameDuration: this.frameDuration === undefined,
                skipCodecProfileValidation:
                    !MediaSource.codecProfilesMap || !MediaSource.codecProfilesMap.validateCodecProfile,
                translateToVp9Draft: config.translateToVp9Draft,
                applyProfileStreamingOffset: this.stream.applyProfileStreamingOffset,
                useNativeDataViewMethods: config.useNativeDataViewMethods,
                enableFullParsing: true,
                skipDolbyVisionCheck:
                    !MediaSource.codecProfilesMap || !MediaSource.codecProfilesMap.supportsDolbyVision,
                reorderTrakMvex: config.reorderTrakMvex,
            }
        );

        const frameDurationRef = { frameDuration: this.frameDuration };
        const parseResult = parser.parseInitSegment(frameDurationRef);

        this.usedNativeDataView = config.useNativeDataViewMethods && parser.usedNativeDataView;

        if (parseResult.success) {
            assert(parseResult.codecString);

            this._codecString = parseResult.codecString;
            this._headerMetadata = parseResult.headerMetadata;
            this._hasEncryption = !!parseResult.encryptionInfo;
            this._protectionScheme = frameDurationRef.protectionScheme;

            if (this.frameDuration === undefined && parseResult.frameDuration === undefined) {
                this.console.error(`No frame duration available for ${this.selectedStreamId}`);
            }

            const parsedFrameDuration = parseResult.frameDuration
                ? new TimeUtil(parseResult.frameDuration)
                : this.frameDuration;

            // Extract per-fragment VMAF scores if configured
            let vmafScores;
            if (
                this.stream.mediaType === MediaType.VIDEO &&
                config.perFragmentVMAFConfig?.qcEnabled
            ) {
                if (this.stream.segmentVmaf?.length) {
                    vmafScores = this.stream.segmentVmaf;
                } else if (this.stream.segmentVmafData?.segmentVmaf?.length > 0) {
                    const rawVmaf = this.stream.segmentVmafData.segmentVmaf;
                    vmafScores = new Uint8Array(rawVmaf.length);
                    for (let i = 0; i < rawVmaf.length; i++) {
                        vmafScores[i] = rawVmaf[i].vmaf;
                    }
                } else if (parseResult.perFragmentVMAF?.length) {
                    vmafScores = new Uint8Array(parseResult.perFragmentVMAF.length);
                    for (let i = 0; i < parseResult.perFragmentVMAF.length; i++) {
                        vmafScores[i] = parseResult.perFragmentVMAF[i];
                    }
                }
            }

            const compositionTimeOffset = parseResult.compositionTimeOffset
                ? new TimeUtil(parseResult.compositionTimeOffset)
                : undefined;

            // Populate stream with parsed metadata
            this.stream.setHeaderData(
                parseResult.codecString,
                parseResult.timescaleValue,
                parsedFrameDuration,
                parseResult.fragmentIndex,
                parseResult.sampleDependencyFlags,
                parseResult.additionalSAPs,
                vmafScores,
                parseResult.trackId,
                compositionTimeOffset
            );

            this.sourceData = undefined;
        } else {
            this._remainingHeaderBytes = parseResult.remainingBytes || 0;
        }

        return !!parseResult.success;
    }

    /**
     * Accumulates response data into sourceData.
     * @private
     * @param {ArrayBuffer} data
     */
    _accumulateResponseData(data) {
        this.sourceData = this.sourceData
            ? concatenateArrayBuffers(this.sourceData, data)
            : data;
    }
}

// Apply mixins
outputList(RequestMetrics, Mp4HeaderRequest, false, false);
outputList(EventEmitter, Mp4HeaderRequest);
