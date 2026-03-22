/**
 * @module mp4/EditListBox
 * @description Parser for the ISO BMFF 'elst' (Edit List) box.
 *              The Edit List box maps presentation time to media time, enabling:
 *              - Initial delays (empty edits)
 *              - Media time offsets
 *              - Rate-scaled playback segments
 *
 *              Each entry contains:
 *              - segmentDuration: duration of this edit in movie timescale
 *              - mediaTime: start time within the media (or -1 for empty edit)
 *              - mediaRateInteger: playback rate numerator
 *              - mediaRateFraction: playback rate denominator
 *
 *              Parsed edit list entries are stored in the codec config for the
 *              corresponding track, enabling proper timestamp computation during
 *              demuxing and presentation.
 *
 * @see Module_96989
 * @see ISO 14496-12 Section 8.6.6 (Edit List Box)
 */

import * as tslib from '../utils/tslib.js';                      // Module 22970
import { debugEnabled as BaseBox } from '../mp4/BaseBox.js';     // Module 72905

/**
 * Parses the 'elst' (Edit List) box from an ISO BMFF container.
 * @extends BaseBox
 */
class EditListBox extends BaseBox {
  /**
   * Parses the edit list box content and stores entries in codec config.
   *
   * @param {Object} [context] - Parsing context with codecConfigs per track
   * @returns {boolean} Always true (parsing succeeded)
   */
  videoSampleEntry(context) {
    // Resolve the track ID from the parent track header box (tkhd)
    const trackId = this.parent?.parent?.findChildBox("tkhd")?.createView?.trackId;

    if (typeof trackId === "undefined") {
      return true;
    }

    this.oi(); // Initialize version and flags from full box header

    const entryCount = this.bitReader.dc(); // uint32 entry count

    /** @type {Array<Object>} Parsed edit list entries */
    this.editListEntries = [];

    for (let i = 0; i < entryCount; i++) {
      // Version 1 uses 64-bit values, version 0 uses 32-bit
      const segmentDuration = this.version === 1 ? this.bitReader.longValue() : this.bitReader.dc();
      const mediaTime = this.version === 1 ? this.bitReader.longValue() : this.bitReader.dc();
      const mediaRateInteger = this.bitReader.sg();   // int16
      const mediaRateFraction = this.bitReader.sg();   // int16

      this.editListEntries.push({
        vld: segmentDuration,
        fJc: mediaTime,
        Yid: mediaRateInteger,
        Wid: mediaRateFraction,
      });
    }

    // Store edit list in the codec config for this track
    if (context?.codecConfigs?.[trackId]) {
      context.codecConfigs[trackId].internal_Jaa = this.editListEntries;
    }

    return true;
  }
}

/** @type {string} ISO BMFF four-character code */
EditListBox.writeUint32 = "elst";

/** @type {boolean} Whether the box must be fully buffered before parsing */
EditListBox.isBoxComplete = false;

export default EditListBox;
