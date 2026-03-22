/**
 * @module AudioTrackRole
 * @description Defines audio track role classifications and mappings.
 * Audio tracks can be PRIMARY (main), ASSISTIVE (accessibility/closed captions),
 * COMMENTARY (director's commentary), or NONE. Provides a lookup map from
 * descriptive string keys to role enum values.
 * @origin Module_35128
 */

/**
 * Audio track role enumeration.
 * @enum {string}
 */
export const AudioTrackRole = Object.freeze({
  /** Primary / main audio track */
  PRIMARY: 'PRIMARY',

  /** Assistive audio (e.g. audio descriptions, closed captions) */
  ASSISTIVE: 'ASSISTIVE',

  /** Commentary track (e.g. director's commentary) */
  COMMENTARY: 'COMMENTARY',

  /** No specific role */
  NONE: 'NONE',
});

/**
 * Maps descriptive track role strings (from manifest metadata) to
 * AudioTrackRole enum values.
 * @type {Object.<string, string>}
 */
export const audioTrackRoleMap = Object.freeze({
  assistive: AudioTrackRole.ASSISTIVE,
  closedcaptions: AudioTrackRole.ASSISTIVE,
  directorscommentary: AudioTrackRole.COMMENTARY,
  commentary: AudioTrackRole.COMMENTARY,
  subtitles: AudioTrackRole.PRIMARY,
  primary: AudioTrackRole.PRIMARY,
  none: AudioTrackRole.NONE,
});
