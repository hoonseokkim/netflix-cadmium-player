/**
 * Netflix Cadmium Player - JointStream
 *
 * A JointStream combines individual audio, video, and text media streams
 * into a single unified stream representation. It provides a facade that
 * delegates property access to the appropriate underlying stream (primarily
 * the video stream as the "primary" stream) and offers aggregate operations
 * across all present streams.
 *
 * Used throughout the player for stream selection, ABR decisions, and
 * playback state management.
 *
 * @module streaming/JointStream
 * @original Module 33923
 */

// import { assert } from '../assert';  // Module 91176
// import { MediaType } from '../types/MediaType';  // Module 65161

/**
 * @typedef {Object} JointStreamComponents
 * @property {StreamInfo} [audio] - The audio stream component
 * @property {StreamInfo} [video] - The video stream component
 * @property {StreamInfo} [text] - The text/subtitle stream component
 */

/**
 * Creates a JointStream from a single stream by wrapping it in the
 * appropriate component slot based on its media type.
 *
 * @param {StreamInfo} stream - A single stream with a mediaType property
 * @returns {JointStream} A new JointStream containing only the given stream
 * @throws {AssertionError} If the stream is a supplementary media type
 */
export function createJointStreamFromSingleStream(stream) {
    assert(
        stream.mediaType !== MediaType.supplementaryMediaType,
        'Media events is unsupported'
    );

    const componentsByMediaType = {
        [MediaType.AUDIO]: { audio: stream },
        [MediaType.VIDEO]: { video: stream },
        [MediaType.TEXT]: { text: stream },
    };

    return new JointStream(componentsByMediaType[stream.mediaType]);
}

/**
 * Represents a joint audio/video/text stream bundle.
 *
 * Most property accessors delegate to the "primary stream", which is
 * determined by whichever stream is present (video takes priority over
 * audio, audio over text). Many properties specifically delegate to the
 * video stream component.
 */
export class JointStream {
    /** @type {StreamInfo|undefined} */
    #audioStream;

    /** @type {StreamInfo|undefined} */
    #videoStream;

    /** @type {StreamInfo|undefined} */
    #textStream;

    /**
     * @param {JointStreamComponents} components
     * @param {StreamInfo} [components.audio] - Audio stream
     * @param {StreamInfo} [components.video] - Video stream
     * @param {StreamInfo} [components.text] - Text stream
     */
    constructor({ audio, video, text } = {}) {
        this.#audioStream = audio;
        this.#videoStream = video;
        this.#textStream = text;
    }

    // ──────────────────────────────────────────────
    // Core stream access
    // ──────────────────────────────────────────────

    /**
     * Returns the stream component matching the given media type.
     *
     * @param {string} mediaType - One of MediaType.AUDIO, MediaType.VIDEO, or MediaType.TEXT
     * @returns {StreamInfo|undefined}
     */
    #getStreamByMediaType(mediaType) {
        switch (mediaType) {
            case MediaType.AUDIO:
                return this.#audioStream;
            case MediaType.VIDEO:
                return this.#videoStream;
            case MediaType.TEXT:
                return this.#textStream;
        }
    }

    /**
     * Public accessor to get a stream component by media type.
     *
     * @param {string} mediaType
     * @returns {StreamInfo|undefined}
     */
    getStreamsByType(mediaType) {
        return this.#getStreamByMediaType(mediaType);
    }

    /**
     * Returns the track associated with the given media type, if present.
     *
     * @param {string} mediaType
     * @returns {Track|undefined}
     */
    getTrackByType(mediaType) {
        const stream = this.#getStreamByMediaType(mediaType);
        return stream ? stream.track : undefined;
    }

    /**
     * The primary stream -- the first available stream in priority order:
     * video > audio > text. Used as a fallback reference for single-stream
     * property access.
     *
     * @type {StreamInfo|undefined}
     */
    get primaryStream() {
        return this.#videoStream || this.#audioStream || this.#textStream;
    }

    /**
     * Whether both audio and video streams are present, making this a
     * true audio+video joint stream.
     *
     * @type {boolean}
     */
    get hasAudioAndVideo() {
        return this.#videoStream !== undefined && this.#audioStream !== undefined;
    }

    // ──────────────────────────────────────────────
    // Iteration helpers
    // ──────────────────────────────────────────────

    /**
     * Calls the provided callback for each defined stream component
     * (audio, video, text).
     *
     * @param {function(StreamInfo): void} callback
     */
    forEachStream(callback) {
        [this.#audioStream, this.#videoStream, this.#textStream]
            .filter(stream => stream !== undefined)
            .forEach(callback);
    }

    /**
     * Returns true if the predicate holds for every defined stream component.
     *
     * @param {function(StreamInfo): boolean} predicate
     * @returns {boolean}
     */
    everyStream(predicate) {
        return [this.#audioStream, this.#videoStream, this.#textStream]
            .filter(stream => stream !== undefined)
            .every(predicate);
    }

    // ──────────────────────────────────────────────
    // Delegated video-stream properties (read-only)
    // ──────────────────────────────────────────────

    /** @type {*} Stream request object or similar */
    get request() {
        return this.#videoStream.R;
    }

    /** @type {string} The media type of the video stream */
    get mediaType() {
        return this.#videoStream.mediaType;
    }

    /**
     * Bitrate of the primary video stream.
     * Note: In the original code this was a self-referencing getter (likely a bug
     * or the property shadows an underlying stream field).
     *
     * @type {number}
     */
    get bitrate() {
        return this.#videoStream.bitrate;
    }

    /**
     * Combined bitrate: if both audio and video are present, returns the sum
     * of both bitrates; otherwise returns just the video stream bitrate.
     *
     * @type {number}
     */
    get combinedBitrate() {
        return this.hasAudioAndVideo
            ? this.#videoStream.bitrate + this.#audioStream.bitrate
            : this.#videoStream.bitrate;
    }

    /** @type {number|undefined} Audio stream bitrate (kbps) */
    get audioBitrateKbps() {
        return this.#audioStream?.bitrate;
    }

    /** @type {number|undefined} Video stream bitrate (kbps) */
    get videoBitrateKbps() {
        return this.#videoStream?.bitrate;
    }

    /**
     * VMAF quality score for the video stream, defaulting to 0 if unavailable.
     *
     * @type {number}
     */
    get vmafScore() {
        return this.#videoStream.vmaf ?? 0;
    }

    /** @type {number} Buffer length of the video stream */
    get bufferLength() {
        return this.#videoStream.bufferLength;
    }

    /** @param {number} value */
    set bufferLength(value) {
        this.#videoStream.bufferLength = value;
    }

    /** @type {*} Stream identifier */
    get id() {
        return this.#videoStream.id;
    }

    /** @type {*} The currently selected stream ID */
    get selectedStreamId() {
        return this.#videoStream.selectedStreamId;
    }

    /** @type {number} Current fragment/segment index */
    get fragmentIndex() {
        return this.#videoStream.fragmentIndex;
    }

    /** @type {*} Event fired when the stream has ended */
    get endedChangedEvent() {
        return this.#videoStream.endedChangedEvent;
    }

    /** @type {*} Internal tracking state */
    get internalTrackingState() {
        return this.#videoStream.internal_Sha;
    }

    /** @param {*} value */
    set internalTrackingState(value) {
        this.#videoStream.internal_Sha = value;
    }

    /**
     * Whether all present streams can be auto-selected by ABR.
     *
     * @type {boolean}
     */
    get canAutoSelect() {
        return this.everyStream(stream => stream.canAutoSelect);
    }

    /** @type {*} Live audio timestamp adjustment info */
    get liveAdjustAudioTimestamps() {
        return this.#videoStream.liveAdjustAudioTimestamps;
    }

    /** @type {boolean} Whether this is a live stream */
    get isLive() {
        return this.#videoStream.isLive;
    }

    /**
     * Whether all present streams are ready for stream selection.
     *
     * @type {boolean}
     */
    get isReadyForSelection() {
        return this.everyStream(stream => stream.isReadyForSelection);
    }

    /** @type {boolean} Whether the stream is playable */
    get isPlayable() {
        return this.#videoStream.isPlayable;
    }

    /** @type {*} Original obfuscated property oI */
    get streamState() {
        return this.#videoStream.oI;
    }

    /** @type {boolean} Whether the stream is filtered */
    get isFiltered() {
        return this.#videoStream.isFiltered;
    }

    /** @type {string} Profile name of the video stream */
    get profileName() {
        return this.#videoStream.profileName;
    }

    /**
     * Sets a selection priority on all present streams.
     *
     * @param {*} value
     */
    set selectionPriority(value) {
        this.forEachStream(stream => {
            stream.qx = value;
        });
    }

    /** @type {*} CDN location of the video stream */
    get location() {
        return this.#videoStream.location;
    }

    /**
     * Returns an array of CDN locations from all present streams that have one.
     *
     * @type {Array<*>}
     */
    get allLocations() {
        const locations = [];
        this.forEachStream(stream => {
            if (stream.location) {
                locations.push(stream.location);
            }
        });
        return locations;
    }

    /** @param {*} value */
    set playbackVolume(value) {
        this.#videoStream.pv = value;
    }

    /** @param {*} value */
    set headerRequestData(value) {
        this.#videoStream.g5a = value;
    }

    /** @param {*} value */
    set licenseData(value) {
        this.#videoStream.Y0 = value;
    }

    /** @param {*} value */
    set startPts(value) {
        this.#videoStream.zXa = value;
    }

    /** @param {*} value */
    set endPts(value) {
        this.#videoStream.AXa = value;
    }

    /** @type {*} Per-segment VMAF quality data */
    get segmentVmafData() {
        return this.#videoStream.segmentVmafData;
    }

    /** @type {*} Encoding profile of the video stream */
    get profile() {
        return this.#videoStream.profile;
    }

    /** @type {number} Index of the video stream */
    get streamIndex() {
        return this.#videoStream.streamIndex;
    }

    /** @type {*} The viewable session associated with this stream */
    get viewableSession() {
        return this.#videoStream.viewableSession;
    }

    /** @type {*} Configuration object */
    get config() {
        return this.#videoStream.getConfig;
    }

    /** @param {*} value */
    set config(value) {
        this.#videoStream.getConfig = value;
    }

    // ──────────────────────────────────────────────
    // Display / debugging
    // ──────────────────────────────────────────────

    /**
     * Returns a human-readable bitrate description string.
     *
     * @returns {string} e.g. "audio: 128kbps | video 4500kbps" or "4500kbps"
     */
    getBitrateDescription() {
        if (this.hasAudioAndVideo) {
            return `audio: ${this.audioBitrateKbps}kbps | video ${this.videoBitrateKbps}kbps`;
        }
        return `${this.bitrate}kbps`;
    }

    /**
     * Compares this JointStream to another for equality. Two JointStreams
     * are equal if every present stream has a matching stream in the other
     * with the same selectedStreamId.
     *
     * @param {JointStream} other
     * @returns {boolean}
     */
    isEqual(other) {
        return (
            !!other &&
            this.everyStream(stream => {
                const otherStream = other.getStreamsByType(stream.mediaType);
                return (
                    otherStream !== undefined &&
                    stream.selectedStreamId === otherStream.selectedStreamId
                );
            })
        );
    }

    /**
     * Returns a string representation combining all present stream toString() outputs.
     *
     * @returns {string}
     */
    toString() {
        return (
            (this.#audioStream ? this.#audioStream.toString() : '') +
            (this.#videoStream ? this.#videoStream.toString() : '') +
            (this.#textStream ? this.#textStream.toString() : '')
        );
    }
}
