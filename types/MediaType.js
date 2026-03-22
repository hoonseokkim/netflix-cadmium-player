/**
 * Netflix Cadmium Player - MediaType Enum
 *
 * Defines the media type enumeration used throughout the player to distinguish
 * between audio, video, timed text (subtitles), and supplementary (media events) streams.
 *
 * @module Module_26388
 */

/**
 * Primary media type enum for all stream types.
 * @enum {number}
 */
export const MediaType = {
    AUDIO: 0,
    VIDEO: 1,
    TIMED_TEXT: 2,
    SUPPLEMENTARY: 3
};

/**
 * Subset enum containing only primary (audio/video) stream types.
 * Used when operations should exclude text and supplementary streams.
 * @enum {number}
 */
export const PrimaryMediaType = {
    AUDIO: 0,
    VIDEO: 1
};

/**
 * Reverse lookup map from numeric MediaType values to human-readable string names.
 * @type {Object<number, string>}
 */
export const MediaTypeNames = {
    [MediaType.AUDIO]: "audio",
    [MediaType.VIDEO]: "video",
    [MediaType.TIMED_TEXT]: "subtitle",
    [MediaType.SUPPLEMENTARY]: "mediaEvents"
};
