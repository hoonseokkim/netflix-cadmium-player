/**
 * Netflix Cadmium Player — HEVC Main10 L30 Profile Configuration
 *
 * Defines the codec configuration for HEVC (H.265) Main10 profile at Level 3.0
 * with DASH CENC encryption. Contains initialization data, encryption session
 * parameters, media key system factory IDs, and resolution/framerate constraints.
 *
 * Profile string: "hevc-main10-L30-dash-cenc-prk-do"
 *
 * @module media/HevcMain10L30Config
 * @original Module_51914
 */

import { X as baseMediaAttributes } from '../modules/Module_56803.js';

/**
 * HEVC Main10 Level 3.0 codec configuration entries.
 *
 * @type {Array}
 * @property {object} 0 - Primary codec init data with encryption session info.
 * @property {object} 1 - Secondary codec init data.
 * @property {object} 2 - Minimum bitrate/framerate constraint: {min: 1000, max: 24000}.
 * @property {object} 3 - Standard bitrate/framerate constraint: {min: 6000, max: 24000}.
 * @property {string} 4 - Profile identifier string.
 * @property {number} 5 - Maximum bitrate (kbps): 64.
 * @property {number} 6 - Maximum width: 320.
 * @property {number} 7 - Maximum height: 240.
 * @property {number} 8 - Aspect ratio numerator: 4.
 * @property {number} 9 - Aspect ratio denominator: 3.
 */
export const X = [
  {
    data: 'heEVDQheFREBhdgBDggAYEheBXgRQCheASDogBoG',
    encryptionSession: true,
    mediaKeySystemFactory: [176, 733],
    size: 753,
    mediaAttribute: baseMediaAttributes[0],
  },
  {
    data: 'hNI1DohNIkg9ABhNIEDQhNIJCIhKIDhIoEgC4ChNISgL4ChNIGgEYChNIQC3hNIhBvhNJXgJIAgygCAAAxhNa1gEQChNYBgEQKhNhi',
    encryptionSession: true,
    mediaKeySystemFactory: [44],
    size: 621,
    mediaAttribute: baseMediaAttributes[1],
  },
  { $: 1000, O: 24000 },
  { $: 6000, O: 24000 },
  'hevc-main10-L30-dash-cenc-prk-do',
  64,
  320,
  240,
  4,
  3,
];
