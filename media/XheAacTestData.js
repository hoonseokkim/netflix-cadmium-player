/**
 * @file XheAacTestData.js
 * @description Test/reference data for xHE-AAC (Extended High Efficiency AAC) audio codec.
 * Contains pre-encoded initialization segments (ftyp/moov boxes) and fragment
 * headers for testing the xHE-AAC DASH streaming pipeline. Includes two
 * sample entries with encryption session metadata and codec configuration
 * parameters (sample rate 48kHz, various frame sizes).
 * @module media/XheAacTestData
 * @see Module_70349
 */

/**
 * Pre-encoded xHE-AAC test data including initialization segments and
 * codec configuration. Used for testing and validation of the xHE-AAC
 * streaming pipeline.
 *
 * Structure:
 * - [0]: First init segment with ftyp/moov boxes (810 bytes, encrypted, key system factory [176, 665])
 * - [1]: Second init segment (2346 bytes, encrypted, key system factory [44])
 * - [2]: Frame size config: 2048 samples at 48kHz
 * - [3]: Frame size config: 12288 samples at 48kHz
 * - [4]: Codec string: "xheaac-dash"
 * - [5]: Channel count: 32
 * - [6]: Audio profile: "2.0"
 *
 * @type {Array<Object|string|number>}
 */
export const X = [
  {
    /** @type {string} Base64-encoded initialization segment data */
    data: 'IAcgZnR5BwBpBzBvA2gBYBABgA4CBkBzBtgAIBdpeGRhBzBogCQAADAKBtFvB2gDYBdsbXZoBkgA4BgAAJC7CAgAwDABgAQDgAAIgBgLgB4QBAgDwNgAANACgGABfhdHJhBrgBYBBcB0BrgOYDAHgLoZgCYDgCgDgO4rcBfW1kBpBhgf4CgA4Aga4UBVDEgBgDAlgDoABsBygDIGgjwAB1BugFIKgB4FcBMG1pBuBmgBABAQgnIAgJgLAkgMYAgC4DccZHJlgA4CgSwGcMdXJsAggBYFf0c3RiBsgA4BCogA4ABzgHYGgC4CeYbXA0gUACgZQMgjwAAQgvQJB0BlgGQABzgBACADgLoCcEXkAVgFQAA4gBAACFCogbACcFT/lGBDBCA8DADTDJEggBwAcSS2aBACAEAGALBcCIACAJACAIAJAIAAAJD8ABCAABAQgAQAdfwBgMAoAZgB4AeB/yAGACCGAIBCgHAAgQoABggGAAcFFUKegSwAeuQAQFgOYBcP8ARWDLAAAGABgzgBgcYBF0gOYDgAAFgB4BBzBjgB4JAUgB4BB6gxQNgEYBBjBvgB4JA4hJgABlB4gC4CBtBlgl4GBggAgCAgg/AAgC4DgeYGgAYBgTAAggIJd9dWR0giYCB1gG4AgA4DgAACAhg0AKg6gBhHQAFwgp4CgAAHBIBpBsgPwAhAACCpB0hZQAgPgChbIAgHgDgKQDBGgFwAg4QAdob2ZlByAgFJdTIE1QBFBHAtAyAvA0AvBEAgBBgNYAdpbyBFBugXAABkgDgB',
    /** @type {boolean} Whether this segment uses encryption */
    encryptionSession: true,
    /** @type {Array<number>} Key system factory identifiers */
    mediaKeySystemFactory: [176, 665],
    /** @type {number} Total size in bytes */
    size: 810,
  },
  {
    /** @type {string} Base64-encoded initialization segment data */
    data: 'IACUBtFvBmgA4BcQbWZoBkgA4BgAACABgAYBd8dHJhgC4CAcB0gC4CACAAAqgC4FgAYBAIgBIEgGYBgDYABkB0gGYFgAACBIgGYAB1BugAwAACAFgBYBAMgAYBCcgJwFA4gAgBCrgAYFCqgBYgcIlm1kBhB0DRC/DlDDBCA8DADTDJEggCQAcSS2aBACAEAGALBcCIACAJACAIAJgQIAcJ/AGAABAQgAQAdfwBgMAoAZgB4AeB/yAGACCGAIBCAAAggVgABggGAAcFFUKeBsAACuBAAEgRQAgXQAcP8ARWDLAEAAA5BAB7AkAAAbCVDAAMCbD2CiA8gNIBcPAMBAgTYAeC8AFgDAgBoBc9QLWyDZgaIAgD4WcYALblBwADAmD9CoCPgDIBcDwDAQgAoAdgvABYAwgAwACjCpZpgACEdVMAFtDKDgAjgVIACDDwgvQCBkBTBUa0gACQCngVQHBwhEwCALAiCaalgACRgqoOA0gqiWCwgqi5hVSYC5gqoOCZgqlBCqh/9SC+h/9TC1',
    /** @type {boolean} Whether this segment uses encryption */
    encryptionSession: true,
    /** @type {Array<number>} Key system factory identifiers */
    mediaKeySystemFactory: [44],
    /** @type {number} Total size in bytes */
    size: 2346,
  },
  {
    /** @type {number} Frame size in samples */
    $: 2048,
    /** @type {number} Sample rate in Hz */
    O: 48000,
  },
  {
    /** @type {number} Frame size in samples */
    $: 12288,
    /** @type {number} Sample rate in Hz */
    O: 48000,
  },
  /** @type {string} DASH codec string */
  'xheaac-dash',
  /** @type {number} Channel configuration */
  32,
  /** @type {string} Audio profile */
  '2.0',
];
