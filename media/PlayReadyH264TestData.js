/**
 * PlayReady H264 Test Data
 *
 * Contains pre-encoded MP4 segment template data for PlayReady-protected
 * H.264 Main Profile Level 3.0 DASH content at 320x240 resolution.
 * Includes compressed init segment and media segment data with track ID
 * patch offsets.
 *
 * Used by MediaSegmentTemplateFactory to generate black/placeholder frames.
 *
 * @module PlayReadyH264TestData
 * @source Module_26931
 */
export default function PlayReadyH264TestData(module, exports, require) {
    Object.defineProperties(exports, {
        __esModule: {
            value: true
        }
    });
    exports.X = void 0;

    var parentTemplateData = require(19034);

    exports.X = [
        {
            data: "hdzvgAgChd1ACACIhdwfhNQFhdyM",
            encryptionSession: true,
            mediaKeySystemFactory: [176, 731],  // Track ID patch offsets in init segment
            size: 751,
            mediaAttribute: parentTemplateData.X[0]
        },
        {
            data: "h/v/h/v7",
            encryptionSession: true,
            mediaKeySystemFactory: [44],         // Track ID patch offsets in media segment
            size: 1022,
            mediaAttribute: parentTemplateData.X[1]
        },
        {
            $: 1000,       // timescale
            O: 30000       // duration
        },
        {
            $: 6000,       // timescale
            O: 30000       // duration
        },
        "playready-h264mpl30-dash",  // codec profile
        64,                           // bitrate (kbps)
        320,                          // width
        240,                          // height
        1,                            // V1a (display aspect ratio numerator)
        1                             // W1a (display aspect ratio denominator)
    ];
}
