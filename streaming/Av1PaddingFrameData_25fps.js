/**
 * @file Av1PaddingFrameData_25fps.js
 * @description AV1 codec padding frame data for 25fps at 16:9 aspect ratio (480x270).
 *              Contains pre-encoded black/silent frames used during stream transitions
 *              (ad insertion, codec switching) to maintain continuous playback.
 *              Profile: av1-main-L30-dash-cbcs-prk, bitrate: 64kbps.
 * @module streaming/Av1PaddingFrameData_25fps
 * @original Module_64826
 */

import { X as parentFrameData } from './Av1PaddingFrameData_24fps'; // Module 77013

/**
 * AV1 padding frame descriptors for 25fps playback.
 *
 * Each entry in the array serves a specific purpose:
 * - [0]: Video segment with encryption session data (init segment part 1)
 * - [1]: Video segment with encryption session data (init segment part 2)
 * - [2]: Timing config { $: 1000ms frame duration, O: 25000ms total duration }
 * - [3]: Timing config { $: 5000ms frame duration, O: 25000ms total duration }
 * - [4]: Profile name string
 * - [5]: Bitrate (64 kbps)
 * - [6]: Width (480)
 * - [7]: Height (270)
 * - [8]: Extended width multiplier (1)
 * - [9]: Extended height multiplier (1)
 *
 * @type {Array}
 */
export const X = [
  {
    data: 'hYRABhCohYTUga4EhYTyCGCjhYQpAcCYgAYEhYRWATCIhYQe',
    encryptionSession: true,
    mediaKeySystemFactory: [180, 687],
    size: 707,
    mediaAttribute: parentFrameData[0],
  },
  {
    data: 'gRABCVgugVB9gugtA8gugJAFgAYBCdgughgB4GARgtgKgtYCC/gtYLCGCjgtYNBgAKAogtYGCvCPACgtYZAEgtYDBEgf4AAggtYAgowAgtYcgDYAAogtYygDQHgtYDgqYB',
    encryptionSession: true,
    mediaKeySystemFactory: [44],
    size: 340,
    mediaAttribute: parentFrameData[1],
  },
  { $: 1000, O: 25000 },
  { $: 5000, O: 25000 },
  'av1-main-L30-dash-cbcs-prk',
  64,
  480,
  270,
  1,
  1,
];
