/**
 * Netflix Cadmium Player — VideoSampleEntryParser
 *
 * An MP4 box parser that handles the "Visual Sample Entry" box type
 * (e.g. `avc1`, `hev1`, `hvc1`, `encv`). Extends the base box parser
 * and records the sample entry type on the parsing context.
 *
 * @module mp4/VideoSampleEntryParser
 */

// import { __extends } from 'tslib';
// import { BoxParser as BaseBoxParser, DEBUG as u } from '../modules/Module_72905';

export default class VideoSampleEntryParser /* extends BaseBoxParser */ {
  /**
   * Parse a Visual Sample Entry box.
   *
   * Skips the 6-byte reserved area, reads the data-reference index,
   * logs the sample entry type when debug tracing is enabled, and
   * stores the type on the parsing context.
   *
   * @param {Object} [context] - Optional parsing context with a `ce` (container entry).
   * @returns {boolean} Always `true` indicating successful parsing.
   */
  videoSampleEntry(context) {
    // Skip 6 reserved bytes
    this.bitReader.offset += 6;

    // Read data_reference_index (uint16)
    this.bitReader.readUint16();

    if (DEBUG) {
      this.bitReader.console.pauseTrace(
        'VideoSampleEntry sampleEntryType: ' + this.type
      );
    }

    // Store the sample entry type on the container entry
    if (context?.ce) {
      context.ce.sampleEntryType = this.type;
    }

    return true;
  }
}
