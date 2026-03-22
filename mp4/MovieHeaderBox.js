/**
 * @file MovieHeaderBox.js
 * @description Parser for the ISO BMFF 'mvhd' (Movie Header) box.
 * Contains overall metadata about the media presentation including
 * creation/modification times, timescale, and duration. Supports
 * both version 0 (32-bit fields) and version 1 (64-bit fields).
 * @module mp4/MovieHeaderBox
 * @see Module_71368
 */

import { FullBox } from './FullBox.js';

/**
 * Parser for the Movie Header (mvhd) box in ISO BMFF containers.
 * The mvhd box provides global timing information for the entire presentation.
 * @extends FullBox
 */
export default class MovieHeaderBox extends FullBox {
  /** @type {string} ISO BMFF four-character box type */
  static writeUint32 = 'mvhd';

  /** @type {boolean} Whether parsing completes in a single pass */
  static isBoxComplete = false;

  /**
   * Parses the movie header box content.
   * Version 0 uses 32-bit integers for time fields.
   * Version 1 uses 64-bit integers for time fields.
   *
   * Parsed fields:
   * - creationTime: When the media was created
   * - modificationTime: When the media was last modified
   * - timescale (O): Number of time units per second
   * - duration: Length of the presentation in timescale units
   *
   * @returns {boolean} Always returns true
   */
  videoSampleEntry() {
    this.oi(); // Parse version and flags

    if (this.version === 1) {
      this.createView = this.qF([
        { creationTime: 'int64' },
        { modificationTime: 'int64' },
        { O: 'int32' },       // timescale
        { duration: 'int64' },
      ]);
    } else {
      this.createView = this.qF([
        { creationTime: 'int32' },
        { modificationTime: 'int32' },
        { O: 'int32' },       // timescale
        { duration: 'int32' },
      ]);
    }

    return true;
  }
}
