/**
 * @file MediaType.js
 * @description Defines media type enumerations for the Cadmium player.
 *              Classifies media into audio, video, text (subtitles), and
 *              supplementary (media events) types. Also provides a
 *              subset enum for audio/video only, and a display-name mapping.
 * @module media/MediaType
 * @original Module_26388
 */

/**
 * Full set of media types supported by the player.
 * @enum {number}
 */
export const MediaType = Object.freeze({
  /** Audio track */
  AUDIO: 0,
  /** Video track */
  VIDEO: 1,
  /** Text/subtitle track */
  TEXT: 2,
  /** Supplementary media events track */
  SUPPLEMENTARY: 3,
});

/**
 * Subset of media types containing only audio and video.
 * Used in contexts where only A/V streams are relevant (e.g., ABR).
 * @enum {number}
 */
export const AVMediaType = Object.freeze({
  /** Audio */
  AUDIO: 0,
  /** Video */
  VIDEO: 1,
});

/**
 * Human-readable display names for each media type.
 * @type {Object<number, string>}
 */
export const MediaTypeDisplayName = Object.freeze({
  [MediaType.AUDIO]: "audio",
  [MediaType.VIDEO]: "video",
  [MediaType.TEXT]: "subtitle",
  [MediaType.SUPPLEMENTARY]: "mediaEvents",
});
