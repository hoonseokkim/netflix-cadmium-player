/**
 * @module HEVCProfileDefinition
 * @description Defines an HEVC (H.265) Main10 L30 media profile with codec configuration
 * data, encryption settings, key system parameters, and resolution/framerate specs.
 * Used for DRM-protected HEVC streaming at 320x240 with CENC (Common Encryption).
 * @see Module_51914
 */

import { X as baseProfiles } from '../media/BaseProfileDefinitions.js';

/**
 * HEVC Main10 Level 3.0 profile definition for DRM-protected content.
 *
 * Contains two codec configuration records (SPS/PPS parameter sets),
 * timing information (1000ms and 6000ms timescales at 24fps), and
 * resolution/aspect ratio data.
 *
 * @type {Array}
 */
export const HEVCProfile = [
    {
        /** Base64-encoded HEVC decoder configuration record (SPS). */
        data: 'heEVDQheFREBhdgBDggAYEheBXgRQCheASDogBoG',
        encryptionSession: true,
        mediaKeySystemFactory: [176, 733],
        size: 753,
        mediaAttribute: baseProfiles[0]
    },
    {
        /** Base64-encoded HEVC decoder configuration record (PPS). */
        data: 'hNI1DohNIkg9ABhNIEDQhNIJCIhKIDhIoEgC4ChNISgL4ChNIGgEYChNIQC3hNIhBvhNJXgJIAgygCAAAxhNa1gEQChNYBgEQKhNhi',
        encryptionSession: true,
        mediaKeySystemFactory: [44],
        size: 621,
        mediaAttribute: baseProfiles[1]
    },
    {
        /** Timescale: 1000 ticks, framerate: 24000/1000 = 24fps. */
        $: 1000,
        O: 24000
    },
    {
        /** Timescale: 6000 ticks, framerate: 24000/6000 = 4fps (thumbnail). */
        $: 6000,
        O: 24000
    },
    /** Profile string identifier for manifest matching. */
    'hevc-main10-L30-dash-cenc-prk-do',
    /** Maximum bitrate (kbps). */
    64,
    /** Width in pixels. */
    320,
    /** Height in pixels. */
    240,
    /** Numerator of aspect ratio. */
    4,
    /** Denominator of aspect ratio. */
    3
];
