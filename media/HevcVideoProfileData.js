/**
 * @module HevcVideoProfileData
 * @description Static data for an HEVC Main10 video profile configuration.
 *              Contains encryption session parameters, media key system factory
 *              settings, and resolution/dimension metadata for HEVC DRM content.
 *              Original: Module_96660
 */

import { baseMediaAttributes } from '../media/BaseMediaAttributes'; // Module 44661

/**
 * HEVC Main10 video profile configuration data.
 *
 * Contains two encrypted stream entries referencing base media attributes,
 * bitrate range bounds, a dash profile string, and default resolution values.
 *
 * @type {Array}
 */
export const hevcVideoProfileData = [
    {
        /** @type {string} Encoded data identifier */
        data: "heH/heDu",
        /** @type {boolean} Whether encryption session is enabled */
        encryptionSession: true,
        /** @type {number[]} Media key system factory IDs */
        mediaKeySystemFactory: [176, 733],
        /** @type {number} Profile size parameter */
        size: 753,
        /** @type {Object} Reference to base media attribute at index 0 */
        mediaAttribute: baseMediaAttributes[0],
    },
    {
        /** @type {string} Encoded data identifier */
        data: "hHkgDABahHkX",
        /** @type {boolean} Whether encryption session is enabled */
        encryptionSession: true,
        /** @type {number[]} Media key system factory IDs */
        mediaKeySystemFactory: [44],
        /** @type {number} Profile size parameter */
        size: 573,
        /** @type {Object} Reference to base media attribute at index 1 */
        mediaAttribute: baseMediaAttributes[1],
    },
    {
        /** @type {number} Minimum bitrate in bps */
        $: 1000,
        /** @type {number} Maximum bitrate in bps */
        O: 25000,
    },
    {
        /** @type {number} Minimum bitrate in bps */
        $: 5000,
        /** @type {number} Maximum bitrate in bps */
        O: 25000,
    },
    /** @type {string} DASH profile identifier for HEVC Main10 L30 with CENC and PRK */
    "hevc-main10-L30-dash-cenc-prk-do",
    /** @type {number} Default bitrate tier */
    64,
    /** @type {number} Default width */
    320,
    /** @type {number} Default height */
    240,
    /** @type {number} Minimum value flag */
    1,
    /** @type {number} Maximum value flag */
    1,
];

export { hevcVideoProfileData };
export default hevcVideoProfileData;
