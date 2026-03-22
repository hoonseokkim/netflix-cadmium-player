/**
 * @module media/AacScaleFactorBands
 * @description AAC (Advanced Audio Coding) scale factor band tables and constants.
 *              These tables define the spectral band boundaries used in AAC decoding
 *              for different sampling rates. Each table maps scale factor band indices
 *              to spectral line offsets.
 *
 *              Tables included:
 *              - Long window (1024-point) scale factor band offsets for 12 sampling rates
 *              - Short window (128-point) scale factor band offsets for 12 sampling rates
 *              - Number of scale factor bands per sampling rate (long and short windows)
 *              - Number of scale factor band entries per sampling rate
 *              - Power-of-2 lookup table for requantization (2^((x-200)/4))
 *              - 4/3 power lookup table for Huffman decoding (x^(4/3))
 *              - AAC sampling rate table per MPEG-4 specification
 *
 * @see Module_96103
 * @see ISO 14496-3 (MPEG-4 Audio)
 */

// ============================================================================
// Long window (1024-point MDCT) scale factor band offset tables
// Indexed by sampling rate index (0-11), mapping to sampling rates:
//   96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000
// ============================================================================

/** @type {Uint16Array} SFB offsets for 96000/88200 Hz long window */
const SFB_LONG_96000 = new Uint16Array([
  0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 64,
  72, 80, 88, 96, 108, 120, 132, 144, 156, 172, 188, 212, 240, 276, 320, 384,
  448, 512, 576, 640, 704, 768, 832, 896, 960, 1024,
]);

/** @type {Uint16Array} SFB offsets for 64000 Hz long window */
const SFB_LONG_64000 = new Uint16Array([
  0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 64,
  72, 80, 88, 100, 112, 124, 140, 156, 172, 192, 216, 240, 268, 304, 344, 384,
  424, 464, 504, 544, 584, 624, 664, 704, 744, 784, 824, 864, 904, 944, 984, 1024,
]);

/** @type {Uint16Array} SFB offsets for 48000/44100 Hz long window */
const SFB_LONG_48000 = new Uint16Array([
  0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80,
  88, 96, 108, 120, 132, 144, 160, 176, 196, 216, 240, 264, 292, 320, 352, 384,
  416, 448, 480, 512, 544, 576, 608, 640, 672, 704, 736, 768, 800, 832, 864, 896,
  928, 1024,
]);

/** @type {Uint16Array} SFB offsets for 32000 Hz long window */
const SFB_LONG_32000 = new Uint16Array([
  0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80,
  88, 96, 108, 120, 132, 144, 160, 176, 196, 216, 240, 264, 292, 320, 352, 384,
  416, 448, 480, 512, 544, 576, 608, 640, 672, 704, 736, 768, 800, 832, 864, 896,
  928, 960, 992, 1024,
]);

/** @type {Uint16Array} SFB offsets for 24000/22050 Hz long window */
const SFB_LONG_24000 = new Uint16Array([
  0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 52, 60, 68, 76,
  84, 92, 100, 108, 116, 124, 136, 148, 160, 172, 188, 204, 220, 240, 260, 284,
  308, 336, 364, 396, 432, 468, 508, 552, 600, 652, 704, 768, 832, 896, 960, 1024,
]);

/** @type {Uint16Array} SFB offsets for 16000/12000/11025 Hz long window */
const SFB_LONG_16000 = new Uint16Array([
  0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 100, 112, 124, 136,
  148, 160, 172, 184, 196, 212, 228, 244, 260, 280, 300, 320, 344, 368, 396, 424,
  456, 492, 532, 572, 616, 664, 716, 772, 832, 896, 960, 1024,
]);

/** @type {Uint16Array} SFB offsets for 8000 Hz long window */
const SFB_LONG_8000 = new Uint16Array([
  0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 172, 188,
  204, 220, 236, 252, 268, 288, 308, 328, 348, 372, 396, 420, 448, 476, 508, 544,
  580, 620, 664, 712, 764, 820, 880, 944, 1024,
]);

// ============================================================================
// Short window (128-point MDCT) scale factor band offset tables
// ============================================================================

/** @type {Uint16Array} SFB offsets for 96000/88200 Hz short window */
const SFB_SHORT_96000 = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 92, 128]);

/** @type {Uint16Array} SFB offsets for 64000 Hz short window */
const SFB_SHORT_64000 = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 92, 128]);

/** @type {Uint16Array} SFB offsets for 48000/44100 Hz short window */
const SFB_SHORT_48000 = new Uint16Array([0, 4, 8, 12, 16, 20, 28, 36, 44, 56, 68, 80, 96, 112, 128]);

/** @type {Uint16Array} SFB offsets for 24000/22050 Hz short window */
const SFB_SHORT_24000 = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 36, 44, 52, 64, 76, 92, 108, 128]);

/** @type {Uint16Array} SFB offsets for 16000/12000/11025 Hz short window */
const SFB_SHORT_16000 = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 60, 72, 88, 108, 128]);

/** @type {Uint16Array} SFB offsets for 8000 Hz short window */
const SFB_SHORT_8000 = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 36, 44, 52, 60, 72, 88, 108, 128]);

// ============================================================================
// Indexed tables: one entry per sampling rate index (0-11)
// ============================================================================

/**
 * Long window SFB offset tables indexed by sampling rate index.
 * @type {Array<Uint16Array>}
 */
const SFB_LONG_TABLES = [
  SFB_LONG_96000, SFB_LONG_96000, SFB_LONG_64000,
  SFB_LONG_48000, SFB_LONG_48000, SFB_LONG_32000,
  SFB_LONG_24000, SFB_LONG_24000,
  SFB_LONG_16000, SFB_LONG_16000, SFB_LONG_16000,
  SFB_LONG_8000,
];

/**
 * Short window SFB offset tables indexed by sampling rate index.
 * @type {Array<Uint16Array>}
 */
const SFB_SHORT_TABLES = [
  SFB_SHORT_96000, SFB_SHORT_96000, SFB_SHORT_64000,
  SFB_SHORT_48000, SFB_SHORT_48000, SFB_SHORT_48000,
  SFB_SHORT_24000, SFB_SHORT_24000,
  SFB_SHORT_16000, SFB_SHORT_16000, SFB_SHORT_16000,
  SFB_SHORT_8000,
];

/**
 * Number of short window SFB entries per sampling rate index.
 * @type {Uint8Array}
 */
const SFB_SHORT_COUNT = new Uint8Array([12, 12, 12, 14, 14, 14, 15, 15, 15, 15, 15, 15]);

/**
 * Number of long window SFB entries per sampling rate index.
 * @type {Uint8Array}
 */
const SFB_LONG_COUNT = new Uint8Array([41, 41, 47, 49, 49, 51, 47, 47, 43, 43, 43, 40]);

// ============================================================================
// Requantization lookup tables
// ============================================================================

/**
 * Power-of-2 requantization table: 2^((i - 200) / 4) for i in [0..427].
 * Used for scale factor application during AAC decoding.
 * @type {Float32Array}
 */
const REQUANT_POWER_TABLE = (() => {
  const table = new Float32Array(428);
  for (let i = 0; i < 428; i++) {
    table[i] = Math.pow(2, (i - 200) / 4);
  }
  return table;
})();

/**
 * Huffman inverse quantization table: i^(4/3) for i in [0..8190].
 * Used for spectral coefficient dequantization.
 * @type {Float32Array}
 */
const IQ_TABLE = (() => {
  const table = new Float32Array(8191);
  const exponent = 4 / 3;
  for (let i = 0; i < 8191; i++) {
    table[i] = Math.pow(i, exponent);
  }
  return table;
})();

/**
 * Standard AAC sampling rates per MPEG-4 Audio specification (ISO 14496-3).
 * Indexed by sampling frequency index (0-12).
 * @type {Int32Array}
 */
const AAC_SAMPLING_RATES = new Int32Array([
  96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350,
]);

export {
  SFB_LONG_TABLES,      // hlb
  SFB_SHORT_TABLES,     // ilb
  SFB_SHORT_COUNT,      // t6b
  SFB_LONG_COUNT,       // s6b
  REQUANT_POWER_TABLE,  // T5b
  IQ_TABLE,             // V1b
  AAC_SAMPLING_RATES,   // S5b
};
