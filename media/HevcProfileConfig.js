/**
 * @module HevcProfileConfig
 * @description Defines HEVC (H.265) video profile configurations including codec strings,
 * encryption parameters, media key system factory settings, and resolution constraints.
 * Contains profile data for "hevc-main10-L30-dash-cenc-prk-do" profile at 320x240 (4:3).
 * @original Module_23259
 */

import { X as parentProfiles } from '../media/HevcParentProfiles'; // Module 51914

/**
 * HEVC Main10 Level 3.0 profile configurations.
 *
 * Each entry defines:
 * - data: Base64-encoded codec configuration string
 * - encryptionSession: Whether DRM encryption session is required
 * - mediaKeySystemFactory: Key system factory parameters
 * - size: Total configuration size in bytes
 * - mediaAttribute: Reference to parent media attribute config
 *
 * Additional entries define bitrate ranges, profile name, and resolution/aspect ratio.
 *
 * @type {Array}
 */
export const X = [
    {
        data: 'heA8DDBQheD4gfYEheEtBYgFQBgAYCheBWAnAQheAe',
        encryptionSession: true,
        mediaKeySystemFactory: [176, 733],
        size: 753,
        mediaAttribute: parentProfiles[0]
    },
    {
        data: 'gCIBDqhNgVDShNgtCMhNgJgFYCDyhNgNhMAFhNgnAigF4JgBYFgF4DgBYAgF4IgBYFhTgPAWhTgMhUAEACA+hUCCBlhUCShCoChUABhGwJhT4VATC8CTgGgCAigTIBhT5PhlQHdGGMIZC8CMgmIDhIgBgEIGAFgRIJA2gRIMgVgFgRgDgMoGAugRALgEIFAHgQ4KA+gQ4SAIhk4JBIhk4I',
        encryptionSession: true,
        mediaKeySystemFactory: [44],
        size: 808,
        mediaAttribute: parentProfiles[1]
    },
    {
        /** Minimum bitrate in bps */
        minBitrate: 1000,
        /** Maximum bitrate in bps */
        maxBitrate: 50000
    },
    {
        /** Minimum bitrate in bps (alternate range) */
        minBitrate: 10000,
        /** Maximum bitrate in bps (alternate range) */
        maxBitrate: 50000
    },
    /** Profile name identifier */
    'hevc-main10-L30-dash-cenc-prk-do',
    /** Profile ID */
    64,
    /** Width in pixels */
    320,
    /** Height in pixels */
    240,
    /** Horizontal aspect ratio component */
    4,
    /** Vertical aspect ratio component */
    3
];

export default X;
