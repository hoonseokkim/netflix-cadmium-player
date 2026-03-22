/**
 * Stream Segment Info
 *
 * Lightweight wrapper around a stream and its segment metadata (content length,
 * byte offset). Provides pass-through accessors to the underlying stream's
 * properties like viewable session, media type, bitrate, profile, timescale,
 * sample multiplier, and frame duration.
 *
 * @module StreamSegmentInfo
 * @original Module_78015
 */

/**
 * Holds a reference to a stream along with segment-level byte offset and
 * content length, providing convenient accessors to the underlying stream's
 * properties.
 */
export class StreamSegmentInfo {
    /**
     * @param {Object} stream - The media stream
     * @param {Object} segmentInfo - Segment metadata with .contentLength and .offset
     */
    constructor(stream, segmentInfo) {
        StreamSegmentInfo._initialize(this, stream, segmentInfo);
    }

    /**
     * Initializes the instance fields.
     * @param {StreamSegmentInfo} instance
     * @param {Object} stream
     * @param {Object} segmentInfo
     */
    static _initialize(instance, stream, segmentInfo) {
        instance._stream = stream;
        instance._contentLength = segmentInfo.contentLength;
        instance._offset = segmentInfo.offset;
    }

    /** @returns {Object} The underlying media stream */
    get stream() {
        return this._stream;
    }

    /** @returns {number} Content length of this segment in bytes */
    get contentLength() {
        return this._contentLength;
    }

    /** @returns {number} Byte offset of this segment */
    get offset() {
        return this._offset;
    }

    /** @returns {Object} The viewable session associated with this stream */
    get viewableSession() {
        return this._stream.viewableSession;
    }

    /** @returns {*} The movie/resource identifier */
    get movieId() {
        return this._stream.movieId;
    }

    /** @returns {string} The media type (audio/video) */
    get mediaType() {
        return this._stream.mediaType;
    }

    /** @returns {*} The stream's downloadable ID */
    get downloadableId() {
        return this._stream.selectedStreamId;
    }

    /** @returns {number} The stream's bitrate */
    get bitrate() {
        return this._stream.bitrate;
    }

    /** @returns {string} The stream's content profile */
    get profile() {
        return this._stream.profile;
    }

    /** @returns {number} The stream's timescale value */
    get timescale() {
        return this._stream.timescaleValue;
    }

    /** @returns {number} The sample multiplier */
    get sampleMultiplier() {
        return this._stream.sampleMultiplier;
    }

    /** @returns {number} The frame duration */
    get frameDuration() {
        return this._stream.frameDuration;
    }

    /**
     * Replaces the underlying stream reference.
     * @param {Object} newStream
     */
    setStream(newStream) {
        this._stream = newStream;
    }
}
