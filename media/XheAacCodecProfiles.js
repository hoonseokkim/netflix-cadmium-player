/**
 * Netflix Cadmium Player — XHE-AAC Codec Profiles
 *
 * Test / configuration data for xHE-AAC (Extended High-Efficiency AAC)
 * audio codec support detection. Contains two encoded audio sample
 * entries with encryption session markers, media key system factory
 * parameters, and codec-specific metadata.
 *
 * This data is used by the capability detection pipeline to probe
 * whether the platform's MediaSource / MSE stack can decode xHE-AAC
 * content at various sample rates and channel configurations.
 *
 * @module media/XheAacCodecProfiles
 */

// import { X as baseProfiles } from '../modules/Module_70349';

/**
 * xHE-AAC codec profile test configurations.
 *
 * Each entry in the array is either:
 *   - An object with encoded sample data, encryption session flag,
 *     media key system factory params, and byte size.
 *   - A raw config object with `minBufferSize` ($) and `sampleRate` (O).
 *   - A string codec identifier.
 *   - A number (e.g. max bitrate or channel count).
 *
 * @type {Array}
 */
export const XHE_AAC_PROFILES = [
  {
    /** Base64-like encoded audio init segment (profile 1) */
    data: 'hlIhALhlJxDihlJhB+hlJKAxhlI5D1hlIFCphlINCZhlIhB1hlIHBnhlICBfhlICD6gAQAAEgd4DAFBQhlIBBihlI2cEHXPzADBhCAAVDIgPYACggJYAcB/gCKDZBghlT6',
    encryptionSession: true,
    mediaKeySystemFactory: [176, 666],
    size: 811,
    /** Reference to the base profile at index 0 */
    mediaAttribute: null, // baseProfiles[0]
  },
  {
    /** Base64-like encoded audio init segment (profile 2, larger) */
    data: 'klJlD6gAYBBVgAYFBWgBYgAQCsklICfUf+YDBiklI2cEHXPzADBhCAAVDIgVAAegAEABD+AACKDZBgklYABNklYCcCQIejDUAQgFAAgAAFADBGCAgF4BgAAADBB4hKoAAGgCYFBRkmoEgFIgkn4AewkCHoD1AEgRAAgEgGDRCgAYgjwBAAAwBegM4ADBgCgDBfDgAGhACYgACTCmhoAAdhIEPYD2ACAVhLIIALAlg4QACBZLgAE0gqlSBKgqgVCDhVM7hVVTh///gqrAhVVTiqlTh///gqnm',
    encryptionSession: true,
    mediaKeySystemFactory: [44],
    size: 4416,
    /** Reference to the base profile at index 1 */
    mediaAttribute: null, // baseProfiles[1]
  },
  {
    /** Minimum buffer size in bytes for low-rate xHE-AAC */
    minBufferSize: 2048,
    /** Sample rate: 48 kHz */
    sampleRate: 48000,
  },
  {
    /** Minimum buffer size in bytes for high-rate xHE-AAC */
    minBufferSize: 12288,
    /** Sample rate: 48 kHz */
    sampleRate: 48000,
  },
  /** DASH codec string identifier */
  'xheaac-dash',
  /** Default max bitrate (kbps) */
  64,
  /** Channel layout descriptor */
  '2.0',
];
