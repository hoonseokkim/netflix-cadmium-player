/**
 * Sample Description Box (stsd) Parser
 *
 * Parses the ISO BMFF 'stsd' (Sample Description) box, which describes
 * the coding type and initialization parameters for samples in a track.
 * For video tracks, determines the frame duration from child codec
 * configuration boxes (e.g. Netflix frame rate box or audio sample entry).
 *
 * Supports:
 *   - Reading video sample entries and their sample counts
 *   - Extracting frame duration from audio sample rate fields
 *   - Extracting frame duration from Netflix-specific FrameRateBox (nfFR)
 *   - Validating frame rates (must be multiples of 1000 with 1000/1001 ticks)
 *   - Re-parsing child boxes at specific sample entry offsets
 *
 * @module mp4/SampleDescriptionBox
 * @original Module_84379
 * @extends FullBox (Module 72905)
 */

// import { __extends } from 'tslib';                              // Module 22970
// import { QHa as NETFLIX_FRAME_RATE_BOX_TYPE } from './BoxTypes'; // Module 75589
// import { TimeUtil } from './TimeUtil';                           // Module 49420
// import { default as AudioSampleEntry } from './AudioSampleEntry'; // Module 70428
// import { debugEnabled as FullBox } from './FullBox';             // Module 72905
// import { default as EncryptedVideoBox } from './EncryptedVideoBox'; // Module 41192

/**
 * Parser for the Sample Description (stsd) box.
 *
 * The stsd box contains codec-specific initialization data. This parser
 * reads the entry count and delegates to child box parsers for the
 * actual sample entry descriptions (avc1, hev1, encv, mp4a, etc.).
 *
 * @extends FullBox
 */
export default class SampleDescriptionBox /* extends FullBox */ {
  /** @type {string} ISO BMFF four-character box type */
  static writeUint32 = 'stsd';

  /** @type {boolean} Whether parsing completes in a single pass */
  static isBoxComplete = true;

  /**
   * Reads the video sample entry count from the box content.
   * Stores the entry count for later child box iteration.
   *
   * @returns {boolean} Always true (parsing continues with children).
   */
  videoSampleEntry() {
    this.oi(); // skip header / version+flags
    this.entryCount = this.bitReader.dc(); // read uint32 entry count
    return true;
  }

  /**
   * Processes child boxes to extract frame duration information.
   * Checks the first child box in the children map:
   *   - If it's an AudioSampleEntry, computes frameDuration from its sample rate
   *   - If it's an EncryptedVideoBox, looks for a Netflix FrameRateBox child
   *     and validates the frame rate (must be 1000 or 1001 ticks with
   *     numerator divisible by 1000)
   *
   * @param {Object} [context] - Optional context to store the frame duration.
   * @returns {boolean} Always true.
   */
  supportsOperation(context) {
    const childKeys = Object.keys(this.childrenMap);
    if (childKeys.length) {
      const firstKey = childKeys[0];
      if (this.childrenMap[firstKey].length) {
        const firstChild = this.childrenMap[firstKey][0];

        if (firstChild instanceof AudioSampleEntry) {
          // Audio: frame duration = samples per frame / sample rate
          this.frameDuration = new TimeUtil(firstChild.samplesPerFrame, firstChild.samplerate);
        } else if (firstChild instanceof EncryptedVideoBox) {
          // Encrypted video: look for Netflix frame rate box
          const frameRateBoxes = firstChild.childrenMap[NETFLIX_FRAME_RATE_BOX_TYPE];
          if (frameRateBoxes && frameRateBoxes.length) {
            const frameRateInfo = frameRateBoxes[0].createView;
            if (
              (frameRateInfo.ticksPerFrame !== 1000 && frameRateInfo.ticksPerFrame !== 1001) ||
              frameRateInfo.numeratorValue % 1000 !== 0
            ) {
              this.bitReader.console.RETRY(
                "Unexpected frame rate in NetflixFrameRateBox: " +
                frameRateInfo.numeratorValue + "/" + frameRateInfo.ticksPerFrame
              );
            } else {
              this.frameDuration = new TimeUtil(frameRateInfo.ticksPerFrame, frameRateInfo.numeratorValue);
            }
          }
        }

        if (context && this.frameDuration) {
          context.frameDuration = this.frameDuration;
        }
      }
    }
    return true;
  }

  /**
   * Re-parses a specific child box at a sample entry offset.
   * Used when additional sample entries need to be processed.
   *
   * @param {string} boxType - The box type key to re-parse.
   */
  reparseChildBox(boxType) {
    if (this.childrenMap[boxType] !== undefined && this.childrenMap[boxType].length !== 0) {
      // Seek to the (entryCount - 1)th entry at byte offset + 12
      this.readFloat64.fo(this.entryCount - 1, this.byteOffset + 12);
      const child = this.childrenMap[boxType][0];
      this.parseBoxContent(child.byteLength, child.byteOffset);
    }
  }
}
