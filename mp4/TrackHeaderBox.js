/**
 * Track Header Box (tkhd) Parser
 *
 * Parses the ISO BMFF Track Header Box which contains metadata about
 * an individual track in the MP4 container: creation/modification times,
 * track ID, duration, width, height, volume, and track-enabled flags.
 *
 * Supports both version 0 (32-bit timestamps) and version 1 (64-bit
 * timestamps) of the box format.
 *
 * @module TrackHeaderBox
 * @source Module_85571
 */

import { __extends } from '../core/ReflectMetadataPolyfill';
import { debugEnabled as FullBox } from '../mp4/BoxParserRegistry';

class TrackHeaderBox extends FullBox {
    /**
     * Parse the track header data from the box payload.
     *
     * @param {Object} [context] - Optional parsing context with track info.
     * @param {Object} [context.ce] - Container element to receive width/height.
     * @param {Object} [context.codecConfigs] - Map to register per-track codec configs.
     * @returns {boolean} True when parsing succeeds.
     */
    videoSampleEntry(context) {
        this.oi(); // Read version and flags from FullBox header

        // Field layout depends on box version
        const fields = this.version === 1
            ? [
                { creationTime: "int64" },
                { modificationTime: "int64" },
                { trackId: "int32" },
                { offset: 32, type: "offset" },      // reserved
                { duration: "int64" }
            ]
            : [
                { creationTime: "int32" },
                { modificationTime: "int32" },
                { trackId: "int32" },
                { offset: 32, type: "offset" },      // reserved
                { duration: "int32" }
            ];

        // Append common fields after version-dependent section
        const allFields = fields.concat(
            { offset: 64, type: "offset" },           // reserved
            { Ohd: "int16" },                          // layer
            { Sbd: "int16" },                          // alternateGroup
            { volume: "int16" },
            { offset: 16, type: "offset" },           // reserved
            { offset: 288, type: "offset" },          // matrix (9x int32 = 288 bits)
            { width: "int32" },                        // fixed-point 16.16
            { height: "int32" }                        // fixed-point 16.16
        );

        // Parse all fields into this.createView
        this.createView = this.qF(allFields);

        // Decode track flags
        this.createView.trackEnabled = !!(this.flags & 1);
        this.createView.trackInMovie = !!(this.flags & 2);
        this.createView.trackInPreview = !!(this.flags & 4);
        this.createView.trackSizeIsAspectRatio = !!(this.flags & 8);

        // Set width/height on container element (convert from 16.16 fixed-point)
        if (context && context.ce) {
            context.ce.width = this.createView.width / 65536;
            context.ce.height = this.createView.height / 65536;
        }

        // Initialize codec config entry for this track
        if (context && context.codecConfigs) {
            context.codecConfigs[this.createView.trackId] = {};
        }

        return true;
    }
}

/** Four-character code identifying this box type. */
TrackHeaderBox.writeUint32 = "tkhd";

/** Whether the box needs to be completely read before parsing. */
TrackHeaderBox.isBoxComplete = false;

export default TrackHeaderBox;
