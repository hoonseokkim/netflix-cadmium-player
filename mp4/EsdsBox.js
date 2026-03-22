/**
 * Netflix Cadmium Player - ESDS Box Parser
 * Deobfuscated from Module_96345
 *
 * MP4 box parser for the "esds" (Elementary Stream Descriptor) box.
 * This box contains the ES_Descriptor which describes the elementary
 * stream properties including codec configuration (e.g., AAC audio config).
 *
 * Extends the base box parser class and uses the ES_Descriptor parser
 * to decode the box contents from a bit reader.
 */

import { __extends } from "tslib"; // Module 22970
import { ESDescriptorParser } from "../mp4/ESDescriptorParser"; // Module 47887
import { BaseBoxParser } from "../mp4/BaseBoxParser"; // Module 72905

class EsdsBoxParser extends BaseBoxParser {
    constructor() {
        super(...arguments);
    }

    /**
     * Parse the ESDS box content.
     * Reads and parses the ES_Descriptor from the video sample entry.
     *
     * @param {Object} sampleEntry - Video/audio sample entry context
     * @returns {boolean} true if parsing succeeded
     */
    videoSampleEntry(sampleEntry) {
        this.oi(); // Skip version and flags (full box header)
        this.esDescriptor = ESDescriptorParser.iPb(this.bitReader, sampleEntry);
        return true;
    }
}

/** Four-character box type code */
EsdsBoxParser.writeUint32 = "esds";

/** Whether this box must be completely read before parsing */
EsdsBoxParser.isBoxComplete = false;

export default EsdsBoxParser;
