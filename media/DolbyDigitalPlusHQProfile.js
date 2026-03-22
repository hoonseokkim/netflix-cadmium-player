/**
 * Dolby Digital Plus 5.1 HQ Audio Profile Definition
 *
 * Defines the audio profile configuration for the "ddplus-5.1hq-dash"
 * (Dolby Digital Plus 5.1 High Quality) audio stream format.
 *
 * Contains:
 *   - Initialization segment data (base64-encoded) for both stream variants
 *   - Encryption session flag (both variants require encrypted sessions)
 *   - Media key system factory parameters (codec IDs [176, 590] and [44])
 *   - Byte sizes for the init segments
 *   - Media attribute references from parent profile configurations
 *   - Sample rate / output rate pairs (1536/48000 and 12288/48000)
 *   - Profile identifier string: "ddplus-5.1hq-dash"
 *   - Maximum bitrate: 640 kbps
 *   - Channel layout: "5.1"
 *
 * @module media/DolbyDigitalPlusHQProfile
 * @original Module_75452
 */

// import { X as parentProfileAttributes } from './Module_86252'; // parent profile set
// import { X as secondaryAttributes } from './Module_27443';     // secondary attribute set

/**
 * Dolby Digital Plus 5.1 HQ profile configuration array.
 *
 * Index layout:
 *   [0] - Primary init segment descriptor (E-AC-3 variant 1)
 *   [1] - Secondary init segment descriptor (E-AC-3 variant 2)
 *   [2] - Sample rate config: { sampleRate: 1536, outputRate: 48000 }
 *   [3] - Sample rate config: { sampleRate: 12288, outputRate: 48000 }
 *   [4] - Profile name string: "ddplus-5.1hq-dash"
 *   [5] - Max bitrate: 640 (kbps)
 *   [6] - Channel layout: "5.1"
 *
 * @type {Array}
 */
export const DolbyDigitalPlus51HQProfile = [
  {
    data: "hMPLAUhMIMAKgAQAAJgYQCAChMJ7",
    encryptionSession: true,
    mediaKeySystemFactory: [176, 590],
    size: 610,
    mediaAttribute: null, // parentProfileAttributes[0] at runtime
  },
  {
    data: "8NY4AK8NYpBQ8NYFAED/jtYCgAAChQYBcAjgYYBhCGjQwzjfY+juA+j8o9jwo+gfwLhdACABhWwGgrgEgAAQADhkwBhWQChkYFgIYMgEACA7jcoFC4hFQWiJgBj4oDj7wEBfgQ4LhWgCAHiO4GgIAWAOhewADthhICiuAFgZYLjt4DiyIChjgCDggIAVABgb4BgIAChxwFghAMgEACAdjYgFDcgQQWgcABhxYDj3oEhG4MgnICADjFoEiLgGhxYWAHgcgAkGoBiqoHgpYLD4glYDki4FBwgRAWgcoBiCYDh/4EhQAMglYDjVIGgIAWgcwBibQDj0QEDXhC4Lgn4ChCCDglYDhCzDhCCAghQDhCzEhCCAgHIDhCzDhCCBgHIDjH0FhCA/k/xsgABrAXBQk///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k///k//c",
    encryptionSession: true,
    mediaKeySystemFactory: [44],
    size: 20588,
    mediaAttribute: null, // secondaryAttributes[1] at runtime
  },
  { sampleRate: 1536, outputRate: 48000 },
  { sampleRate: 12288, outputRate: 48000 },
  "ddplus-5.1hq-dash",
  640,
  "5.1",
];
