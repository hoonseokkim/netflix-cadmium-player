/**
 * @file OriginalFormatBoxParser.js
 * @description Parser for the MP4/ISOBMFF 'frma' (Original Format) box.
 *              The 'frma' box appears inside a protection scheme info box ('sinf')
 *              and indicates the original, unencrypted codec format of the track
 *              (e.g., 'avc1' for H.264, 'hev1' for HEVC). This is essential for
 *              DRM-encrypted content where the sample entry is 'encv'/'enca'.
 * @module mp4/OriginalFormatBoxParser
 * @original Module_89362
 */

import { __extends } from 'tslib'; // Module 22970
import { debugEnabled as BaseBoxParser } from '../mp4/BoxParserRegistry'; // Module 72905

/**
 * Parses the 'frma' (Original Format) box from an MP4 container.
 * Extracts the original codec four-character code from encrypted tracks.
 *
 * @extends BaseBoxParser
 */
export class OriginalFormatBoxParser extends BaseBoxParser {
  /**
   * The four-character box type identifier.
   * @type {string}
   */
  static writeUint32 = 'frma';

  /**
   * Parses the 'frma' box content.
   * Reads the original format (4-byte codec identifier) from the bitstream.
   *
   * @param {Object} [context] - Optional parsing context
   * @param {Object} [context.ce] - Container element to store the original format
   * @returns {boolean} Always returns true (parsing succeeded)
   */
  videoSampleEntry(context) {
    /** @type {string} The original codec format code (e.g., 'avc1', 'hev1', 'av01') */
    this._originalFormat = this.bitReader.gC();

    // Store on the container element if provided
    if (context?.ce) {
      context.ce.HVc = this._originalFormat;
    }

    return true;
  }
}

export default OriginalFormatBoxParser;
