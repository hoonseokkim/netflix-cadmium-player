/**
 * @file AseStreamExtended - Extended ASE stream with URL building and download management
 * @module streaming/AseStreamExtended
 * @description Extends the base AseStream with URL construction for media requests
 * (including live segment URL templates), header processing, bandwidth estimation,
 * and auxiliary manifest support. Handles both VOD and live streaming URL patterns.
 * @original Module_87225
 */

import { assert } from '../assert/Assert.js';
import { MediaType } from '../types/MediaType.js';
import { DEBUG_ENABLED } from '../core/DebugFlags.js';
import { AseStream } from '../streaming/AseStream.js';

/**
 * Extended ASE (Adaptive Streaming Engine) stream that adds URL construction,
 * header processing, and bandwidth estimation on top of the base stream.
 *
 * @class AseStreamExtended
 * @extends AseStream
 */
export class AseStreamExtended extends AseStream {
    /**
     * @param {Object} streamContext - Stream context/parent
     * @param {Object} config - Streaming configuration
     * @param {Object} console - Debug console/logger
     */
    constructor(streamContext, config, console) {
        super(streamContext, config, console);

        /** @type {Object} Streaming configuration */
        this.streamingConfig = config;

        /** @type {Object} Debug console */
        this.console = console;

        /** @type {boolean} Whether profile streaming offset should be applied */
        this.applyProfileStreamingOffset = false;
    }

    /**
     * The track adaptation set (intentionally returns undefined in base).
     * @type {undefined}
     * @readonly
     */
    get adaptationSet() {
        return undefined;
    }

    /**
     * The underlying media track.
     * @type {Object}
     * @readonly
     */
    get track() {
        return this.track;
    }

    /**
     * Whether the stream header has been received.
     * @type {boolean}
     * @readonly
     */
    get hasHeader() {
        return !!this.headerData;
    }

    /**
     * Presentation timestamp of the track.
     * @type {number}
     * @readonly
     */
    get presentationTime() {
        return this.track.presentationTime;
    }

    /**
     * Track ordering/priority value.
     * @type {*}
     * @readonly
     */
    get orderingValue() {
        return this.track.oba;
    }

    /**
     * Process a received stream header (initialization segment).
     * Only processes the first header; duplicates are ignored.
     *
     * @param {*} headerData - The initialization segment data
     * @param {*} codecInfo - Codec information
     * @param {*} protectionInfo - Content protection metadata
     * @param {*} trackInfo - Track metadata
     * @param {*} sampleEntry - Video/audio sample entry
     * @param {*} timescale - Media timescale
     * @param {*} duration - Track duration
     */
    onHeaderReceived(headerData, codecInfo, protectionInfo, trackInfo, sampleEntry, timescale, duration) {
        if (DEBUG_ENABLED && this.console) {
            this.console.trace('AseStream.onHeaderReceived');
        }

        if (this.headerReceived) {
            if (DEBUG_ENABLED) {
                this.console.trace('Duplicate header received for stream ', this);
            }
        } else {
            this.headerData = headerData;
            this.track.onHeaderReceived(this, codecInfo, protectionInfo, trackInfo, sampleEntry, timescale, duration);
            this.track.activate(this);
        }
    }

    /**
     * Copy header data from another stream of the same type.
     * @param {AseStreamExtended} otherStream - Source stream to copy from
     */
    copyHeaderFrom(otherStream) {
        if (DEBUG_ENABLED) {
            assert(otherStream instanceof AseStreamExtended);
            assert(otherStream.selectedStreamId === this.selectedStreamId);
        }

        if (!this.headerReceived) {
            this.track.copyTrackInfo(otherStream.track);
            this.headerData = otherStream.headerData;
        }
    }

    /**
     * Build the request URL for a media fragment.
     *
     * @param {boolean} isVod - Whether this is a VOD (non-live) request
     * @param {number} [liveSegmentId] - Segment number for live streams
     * @param {string} [baseUrl] - Optional base URL override
     * @returns {string} The complete request URL
     */
    buildRequestUrl(isVod, liveSegmentId, baseUrl) {
        const urlParts = (baseUrl || this.url)?.split('?');
        const basePath = urlParts?.[0] ?? '';
        let queryString = urlParts?.[1] ?? '';

        let segmentPath;
        if (isVod) {
            segmentPath = this.track.vodSegmentPath;
        } else {
            if (liveSegmentId === undefined && this.console) {
                this.console.error('AseStream.getRequestUrl: liveSegmentId undefined');
            }
            assert(liveSegmentId !== undefined, 'liveSegmentId is required for live media requests');
            segmentPath = this.track.liveSegmentTemplate.replace('$Number$', liveSegmentId.toString());
        }

        // Add auxiliary manifest parameters if needed
        if (this.viewableSession.networkState.isAuxiliaryManifest()) {
            const trackInfo = this.track.trackInfo;
            queryString += (queryString ? '&' : '') +
                'flp=' + encodeURIComponent(
                    `ast,${this.viewableSession.networkState.getManifestInfo(true).playbackSegment}` +
                    `,startSegment,${this.track.startSegment}` +
                    `,duration,${trackInfo.duration}` +
                    `,timeScale,${trackInfo.timescaleValue}`
                );
        }

        // Add constraint reason for video streams with min bitrate constraints
        const constraints = this.track.getStreamConstraints();
        if (constraints.minBitrateConstraint !== undefined && this.track.mediaType === MediaType.VIDEO) {
            queryString += (queryString ? '&' : '') +
                'cr=' + encodeURIComponent(constraints.minBitrateConstraint.reason) +
                '&meb=' + encodeURIComponent(constraints.minBitrateConstraint.bitrate);
        }

        return basePath + '/' + segmentPath + (queryString ? '?' + queryString : '');
    }

    /**
     * Check if the stream has enough buffered data based on bandwidth estimation.
     * @returns {boolean} True if sufficient data is buffered
     */
    hasSufficientBuffer() {
        const playbackPosition = this.viewableSession?.sharedMediaSourceExtensions?.playbackSegment ?? 0;
        return this.streamingConfig.mediaRate * this.bitrate / 8 *
            (this.streamingConfig.minRequiredBuffer + playbackPosition) < this.bufferedBytes;
    }

    /**
     * Get the request URL, automatically determining VOD vs live mode.
     * @param {number} [segmentId] - Segment ID (undefined for VOD)
     * @param {string} [baseUrl] - Optional base URL override
     * @returns {string} The request URL
     */
    getRequestUrl(segmentId, baseUrl) {
        const isVod = segmentId === undefined || segmentId === this.track.startSegment;
        return this.buildRequestUrl(isVod, isVod ? undefined : segmentId, baseUrl);
    }
}

export default AseStreamExtended;
