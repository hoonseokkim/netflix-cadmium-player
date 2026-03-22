/**
 * Netflix Cadmium Player — TimedTextTrackType
 *
 * Enumeration for the two types of timed-text (subtitle) track content:
 *   - TEXT  (0) — Traditional text-based subtitles (TTML, WebVTT, etc.)
 *   - IMAGE (1) — Image-based subtitles (bitmap overlays, used for some
 *                 languages or for forced narrative subtitles)
 *
 * @module text/TimedTextTrackType
 */

/**
 * @readonly
 * @enum {number}
 */
export const TimedTextTrackType = {
  /** Text-based subtitle track (TTML, WebVTT). */
  TEXT: 0,
  /** Image-based subtitle track (bitmap overlay). */
  IMAGE: 1,
};
