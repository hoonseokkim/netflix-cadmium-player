/**
 * Netflix Cadmium Player - MP4A Audio Sample Entry Box Parser
 * Deobfuscated from Module_97066
 *
 * Parser for the 'mp4a' (MPEG-4 Audio) box in MP4 containers.
 * Extends the base audio sample entry box to handle AAC audio
 * codec configuration via the ESDS (Elementary Stream Descriptor) sub-box.
 */

import { __extends } from '../core/tslib';
import { assert } from '../assert/Assert';
import AudioSampleEntryBox from './AudioSampleEntryBox';

const Mp4aBox = (function (parent) {
    function Mp4aBox() {
        return parent !== null && parent.apply(this, arguments) || this;
    }

    __extends(Mp4aBox, parent);

    /**
     * Processes the mp4a box contents.
     * Finds the ESDS (Elementary Stream Descriptor) child box and
     * extracts the actual sample rate by scaling the ESDS bitrate
     * with the audio sample rate.
     *
     * @returns {boolean} Always returns true indicating the box is supported
     */
    Mp4aBox.prototype.supportsOperation = function () {
        // Look for the 'esds' child box
        let esdsContainer = this.findChildBox("esds");

        // Find the ES_Descriptor (tag type 5 = DecoderSpecificInfo)
        let decoderSpecificInfo = esdsContainer && esdsContainer.esDescriptor.findChildBox(5);

        if (decoderSpecificInfo) {
            assert(this.samplerate);
            // Calculate actual sample rate from the decoder specific info
            this.sampleCount = decoderSpecificInfo.sampleCount * this.samplerate / decoderSpecificInfo.baseTimescale;
        }

        return true;
    };

    /** Box type identifier */
    Mp4aBox.boxType = "mp4a";

    /** Whether this box type can be fully parsed */
    Mp4aBox.isBoxComplete = true;

    return Mp4aBox;
})(AudioSampleEntryBox);

export default Mp4aBox;
