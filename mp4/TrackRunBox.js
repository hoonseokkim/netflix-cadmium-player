/**
 * @file TrackRunBox.js
 * @description Parser and editor for the ISO BMFF 'trun' (Track Run) box.
 * The Track Run box contains per-sample information (duration, size,
 * flags, composition time offset) for a run of contiguous samples
 * within a movie fragment (moof). This is critical for DASH/fMP4
 * streaming where each fragment contains its own sample table.
 *
 * Supports:
 * - Parsing track run headers (sample count, data offset, first sample flags)
 * - Reading per-sample entries (duration, size, flags, composition offset)
 * - Splitting track runs for partial fragment operations
 * - Audio frame fading for seamless transitions
 * - Keyframe detection from sample flags
 *
 * @module mp4/TrackRunBox
 * @see Module_70179
 */

import { assert } from '../assert/Assert.js';
import { audioSampleRegistry, fadeFrame as fadeFrame } from '../media/AudioSampleEditor.js';

/** @type {string} ISO BMFF box type identifier */
const BOX_TYPE = 'trun';

/** Flag bit masks for trun box flags field */
const FLAGS = {
  DATA_OFFSET_PRESENT: 0x1,
  FIRST_SAMPLE_FLAGS_PRESENT: 0x4,
  SAMPLE_DURATION_PRESENT: 0x100,
  SAMPLE_SIZE_PRESENT: 0x200,
  SAMPLE_FLAGS_PRESENT: 0x400,
  SAMPLE_COMPOSITION_TIME_OFFSET_PRESENT: 0x800,
};

/**
 * Extracts the sample dependency type (2 bits) from sample flags.
 * Bits 24-25 of the 32-bit flags field.
 * @param {number} flags - The 32-bit sample flags
 * @returns {number} Dependency type (0-3)
 */
function getSampleDependencyType(flags) {
  return (flags & 0x03000000) >>> 24;
}

/**
 * Checks if the sample-is-non-sync flag is set (bit 16).
 * @param {number} flags - The 32-bit sample flags
 * @returns {boolean} True if the non-sync flag is set
 */
function isNonSyncSample(flags) {
  return !!((flags & 0x10000) >>> 16);
}

/**
 * Parser/editor for the ISO BMFF Track Run (trun) box.
 * Extends the base FullBox parser with track-run-specific parsing.
 */
export class TrackRunBox extends /* FullBox */ BaseBox {
  /** @type {string} */
  static writeUint32 = BOX_TYPE;

  /** @type {boolean} */
  static isBoxComplete = false;

  constructor(header, bitReader, length, offset, version) {
    super(header, bitReader, length, offset, version);

    /** @type {boolean} Whether this box has been split */
    this.isSplit = false;
  }

  /**
   * Whether a data offset is present in this track run.
   * @type {boolean}
   */
  get hasDataOffset() {
    return !!(this.flags & FLAGS.DATA_OFFSET_PRESENT);
  }

  /**
   * Whether first-sample-flags are present.
   * @type {boolean}
   */
  get hasFirstSampleFlags() {
    return !!(this.flags & FLAGS.FIRST_SAMPLE_FLAGS_PRESENT);
  }

  /**
   * Whether per-sample duration is present.
   * @type {boolean}
   */
  get hasSampleDuration() {
    return !!(this.flags & FLAGS.SAMPLE_DURATION_PRESENT);
  }

  /**
   * Whether per-sample size is present.
   * @type {boolean}
   */
  get hasSampleSize() {
    return !!(this.flags & FLAGS.SAMPLE_SIZE_PRESENT);
  }

  /**
   * Whether per-sample flags are present.
   * @type {boolean}
   */
  get hasSampleFlags() {
    return !!(this.flags & FLAGS.SAMPLE_FLAGS_PRESENT);
  }

  /**
   * Whether per-sample composition time offsets are present.
   * @type {boolean}
   */
  get hasSampleCompositionTimeOffset() {
    return !!(this.flags & FLAGS.SAMPLE_COMPOSITION_TIME_OFFSET_PRESENT);
  }

  /**
   * Gets the composition time offset of the last sample (if present).
   * @type {number}
   */
  get lastSampleCompositionOffset() {
    if (!this.hasSampleCompositionTimeOffset) return 0;
    this.bitReader.offset = this.sampleDataOffset + this.sampleEntrySize - 4;
    return this.version === 0 ? this.bitReader.dc() : this.bitReader.workin_Ufa();
  }

  /**
   * Parses the track run box content including the header fields
   * and per-sample entries (duration, size, flags, composition offset).
   *
   * @param {Object} [context] - Fragment parsing context
   * @param {Object} [context.data] - Fragment data accumulator
   * @param {Object} [context.codecConfigs] - Codec-specific default configurations
   * @returns {boolean} Always returns true
   */
  videoSampleEntry(context) {
    this.oi(); // Parse version and flags

    this.headerEndOffset = this.bitReader.offset;
    this.sampleCount = this.bitReader.dc();
    this.dataOffset = this.hasDataOffset ? this.bitReader.workin_Ufa() : 0;
    this.firstSampleFlags = this.hasFirstSampleFlags ? this.bitReader.dc() : undefined;

    // Calculate per-sample entry size
    this.sampleEntrySize =
      (this.hasSampleDuration ? 4 : 0) +
      (this.hasSampleSize ? 4 : 0) +
      (this.hasSampleFlags ? 4 : 0) +
      (this.hasSampleCompositionTimeOffset ? 4 : 0);

    this.sampleDataOffset = this.bitReader.offset;

    assert(this.hasDataOffset, 'Expected data offset to be present in Track Run');
    assert(
      this.length - (this.bitReader.offset - this.startOffset) === this.sampleCount * this.sampleEntrySize,
      'Expected remaining data in box to be sample information'
    );

    if (context?.data) {
      context.data.dataOffset = this.dataOffset;
      context.data.sampleCount = this.sampleCount;
      this.keyframeArray = [];

      const trackFragmentHeaderId = this.parent?.findChildBox('tfhd')?.Y4;

      for (let i = 0; i < this.sampleCount; i++) {
        const sample = {};

        // Sample duration
        if (this.hasSampleDuration) {
          sample.duration = this.bitReader.dc();
        } else if (context.data.defaultSampleDuration) {
          sample.duration = context.data.defaultSampleDuration;
        } else if (trackFragmentHeaderId && context.codecConfigs?.[trackFragmentHeaderId]) {
          sample.duration = context.codecConfigs[trackFragmentHeaderId].defaultSampleDuration;
        }

        // Sample size
        if (this.hasSampleSize) {
          sample.size = this.bitReader.dc();
        } else if (context.data.defaultSampleSize) {
          sample.size = context.data.defaultSampleSize;
        } else if (trackFragmentHeaderId && context.codecConfigs?.[trackFragmentHeaderId]) {
          sample.size = context.codecConfigs[trackFragmentHeaderId].defaultSampleSize;
        }

        // Sample flags
        if (this.hasSampleFlags) {
          sample.flags = this.bitReader.dc();
        } else if (context.data.defaultSampleFlags) {
          sample.flags = context.data.defaultSampleFlags;
        } else if (trackFragmentHeaderId && context.codecConfigs?.[trackFragmentHeaderId]) {
          sample.flags = context.codecConfigs[trackFragmentHeaderId].defaultSampleFlags;
        }

        // Sample composition time offset
        if (this.hasSampleCompositionTimeOffset) {
          sample.compositionTimeOffset = this.version === 0
            ? this.bitReader.dc()
            : this.bitReader.workin_Ufa();
        }

        // First sample may use firstSampleFlags override
        if (i === 0 && this.hasFirstSampleFlags) {
          sample.flags = this.firstSampleFlags;
        }

        this.keyframeArray.push(sample);
      }

      context.data.keyframeArray = this.keyframeArray;

      // Merge auxiliary encryption info if present
      if (context.data.auxiliaryInfo) {
        assert(
          context.data.auxiliaryInfo.length === context.data.keyframeArray.length,
          `num fragment samples: ${context.data.keyframeArray.length}, num samples in auxiliary info: ${context.data.auxiliaryInfo.length}`
        );
        for (let i = 0; i < context.data.keyframeArray.length; i++) {
          context.data.keyframeArray[i].encryptionIV = context.data.auxiliaryInfo[i].encryptionIV;
          context.data.keyframeArray[i].subsampleInfo = context.data.auxiliaryInfo[i].subsampleInfo;
        }
      }
    }

    return true;
  }

  /**
   * Reads a single sample entry from the current bit reader position.
   * @param {Object} defaults - Default values for missing fields
   * @param {number} [firstCompositionOffset] - First sample's composition offset for relative calculation
   * @param {number} [accumulatedDuration] - Running duration total
   * @returns {Object} Sample entry with compositionTimeOffset, flags, size, duration, and adjustedOffset
   * @private
   */
  readSampleEntry(defaults, firstCompositionOffset, accumulatedDuration) {
    const duration = this.hasSampleDuration ? this.bitReader.dc() : defaults.defaultSampleDuration;
    const size = this.hasSampleSize ? this.bitReader.dc() : defaults.defaultSampleSize;
    const flags = this.hasSampleFlags ? this.bitReader.dc() : defaults.defaultSampleFlags;
    const compositionOffset = this.hasSampleCompositionTimeOffset
      ? (this.version === 0 ? this.bitReader.dc() : this.bitReader.workin_Ufa())
      : 0;

    return {
      compositionTimeOffset: compositionOffset,
      flags,
      size,
      duration,
      adjustedOffset: (accumulatedDuration || 0) + compositionOffset - (firstCompositionOffset !== undefined ? firstCompositionOffset : compositionOffset),
    };
  }

  /**
   * Extracts all sample sizes from the track run.
   * @param {Object} defaults - Default sample values
   * @returns {Array<number>} Array of sample sizes
   */
  getAllSampleSizes(defaults) {
    assert(this.dataOffset !== undefined);
    assert(this.sampleDataOffset !== undefined);
    assert(this.sampleCount !== undefined);
    assert(this.sampleEntrySize !== undefined);

    if (!this.hasSampleSize) {
      return Array.from({ length: this.sampleCount }, () => defaults.defaultSampleSize);
    }

    const sizes = [];
    let offset = this.sampleDataOffset + (this.hasSampleDuration ? 4 : 0);
    for (let i = 0; i < this.sampleCount; (++i, offset += this.sampleEntrySize)) {
      sizes.push(this.bitReader.buffer.getUint32(offset, false));
    }
    return sizes;
  }

  /**
   * Finds indices of keyframe (sync) samples in the track run.
   * A sample is a keyframe if its dependency type is not 2 and the non-sync flag is set,
   * or based on the first-sample-flags if per-sample flags aren't present.
   * @returns {Array<number>} Array of keyframe sample indices
   */
  getKeyframeSampleIndices() {
    assert(this.dataOffset !== undefined);
    assert(this.sampleDataOffset !== undefined);
    assert(this.sampleCount !== undefined);
    assert(this.sampleEntrySize !== undefined);

    const indices = [];

    if (this.hasSampleFlags) {
      let offset = this.sampleDataOffset + (this.hasSampleDuration ? 4 : 0) + (this.hasSampleSize ? 4 : 0);
      for (let i = 0; i < this.sampleCount; (++i, offset += this.sampleEntrySize)) {
        const flags = this.bitReader.buffer.getUint32(offset, false);
        if (getSampleDependencyType(flags) !== 2 && isNonSyncSample(flags)) {
          // Non-keyframe
        } else {
          indices.push(i);
        }
      }
    } else if (this.hasFirstSampleFlags) {
      if (getSampleDependencyType(this.firstSampleFlags) !== 2 && isNonSyncSample(this.firstSampleFlags)) {
        // Non-keyframe
      } else {
        indices.push(0);
      }
    }

    return indices;
  }

  /**
   * Splits the track run at a specified sample index for partial fragment
   * operations (e.g., seeking within a fragment). Rewrites box headers
   * to reflect the split portion.
   *
   * @param {Object} moofContext - The moof box context
   * @param {Object} defaults - Default sample values
   * @param {Object|null} mdatEditor - Optional mdat box editor for adjusting data references
   * @param {number} sampleIndex - The sample index to split at
   * @param {number} splitIndex - The target split point
   * @param {number} compositionOffset - Composition time offset adjustment
   * @param {boolean} keepAfter - If true, keep samples after the split point; otherwise keep before
   * @returns {boolean} Whether the split was a no-op (split at boundary)
   */
  splitAtSample(moofContext, defaults, mdatEditor, sampleIndex, splitIndex, compositionOffset, keepAfter) {
    assert(this.dataOffset !== undefined);
    assert(this.sampleDataOffset !== undefined);
    assert(this.headerEndOffset !== undefined);
    assert(this.sampleCount !== undefined);
    assert(moofContext.CA !== undefined);

    let accumulatedSize = 0;
    let accumulatedDuration = 0;
    let firstCompositionOffset;

    this.readFloat64.offset = this.sampleDataOffset;

    // Walk through samples up to the split point
    for (let i = 0; i < splitIndex; ++i) {
      const entry = this.readSampleEntry(defaults, firstCompositionOffset, accumulatedDuration);
      if (i === 0) firstCompositionOffset = entry.compositionTimeOffset;
      accumulatedSize += entry.size;
      accumulatedDuration += entry.duration;
    }

    const savedOffset = this.bitReader.offset;
    const currentEntry = this.readSampleEntry(defaults, firstCompositionOffset, accumulatedDuration);
    this.X3a = keepAfter;
    this.l4 = sampleIndex;
    this.qTb = accumulatedDuration;

    this.isSplit = true;

    if (keepAfter) {
      this.bQb = this.dataOffset + accumulatedSize;
      this.B3 = 0;
      if (sampleIndex === this.sampleCount) return true;
    } else {
      this.bQb = this.dataOffset;
      this.B3 = accumulatedSize;
      if (sampleIndex === 0) return true;
    }

    if (sampleIndex === 0 || sampleIndex === this.sampleCount) return false;

    if (keepAfter) {
      // Keep samples after the split: accumulate remaining sizes
      this.B3 += currentEntry.size;
      for (let i = sampleIndex + 1; i < this.sampleCount; ++i) {
        const entry = this.readSampleEntry(defaults, firstCompositionOffset, accumulatedDuration);
        this.B3 += entry.size;
      }
      // Rewrite header with reduced sample count
      this.readFloat64.offset = this.headerEndOffset;
      this.sampleCount = sampleIndex;
      this.readFloat64.fo(this.sampleCount);
      this.readFloat64.d9a(compositionOffset);
      if (this.hasFirstSampleFlags) this.bitReader.offset += 4;
      this.parseBoxContent(this.length - (savedOffset - this.startOffset), savedOffset);
    } else {
      // Keep samples before the split: adjust offsets
      const consumedBytes = savedOffset - this.sampleDataOffset;
      this.sampleDataOffset = savedOffset;
      this.readFloat64.offset = this.headerEndOffset;
      this.sampleCount -= sampleIndex;
      this.readFloat64.fo(this.sampleCount);
      this.dataOffset += accumulatedSize;
      this.readFloat64.d9a(compositionOffset, this.dataOffset);
      if (this.hasFirstSampleFlags) this.bitReader.offset += 4;
      this.parseBoxContent(consumedBytes, this.readFloat64.offset);
    }

    mdatEditor?.parseBoxContent(this.B3, moofContext.CA + this.bQb);
    return true;
  }

  /**
   * Applies audio fading to samples in this track run for seamless transitions.
   * Modifies sample data in-place by applying gain adjustments to audio frames.
   *
   * @param {Object} moofContext - The moof box context with data offset
   * @param {Object} defaults - Default sample values
   * @param {Object} mdatEditor - The mdat box editor
   * @param {Array<number>} gainValues - Per-sample gain values (negative = fade, -Infinity = silence)
   * @param {string} codecId - The audio codec identifier (e.g., 'xheaac-dash', 'ddp')
   * @param {*} codecProfile - Codec profile info
   * @param {boolean} [asymmetricFade=false] - Whether to use asymmetric fading
   * @param {*} [fadeConfig] - Additional fade configuration
   */
  applyAudioFade(moofContext, defaults, mdatEditor, gainValues, codecId, codecProfile, asymmetricFade = false, fadeConfig) {
    assert(this.dataOffset !== undefined);
    assert(this.sampleDataOffset !== undefined);
    assert(this.sampleCount !== undefined);
    assert(this.sampleEntrySize !== undefined);
    assert(moofContext.CA !== undefined);

    // Extend gain values array to cover all samples
    for (let i = gainValues.length; i < this.sampleCount; ++i) {
      gainValues[i] = gainValues[i - 1];
    }

    // Get silence frame if any samples need silencing
    let silenceFrame;
    if (gainValues.some((g) => g <= 0)) {
      silenceFrame = this.getSilenceFrame(codecId, codecProfile)?.silenceData;
    }

    this.bitReader.offset = this.sampleDataOffset;
    let dataPos = moofContext.CA + this.dataOffset;

    // Normalize codec name for lookup
    const normalizedCodec = codecId.includes('xheaac') ? 'xheaac'
      : codecId.includes('heaac') ? 'aac'
      : 'ddp';

    const rawBuffer = new Uint8Array(
      this.bitReader.buffer.buffer,
      this.bitReader.buffer.byteOffset,
      this.bitReader.buffer.byteLength
    );

    for (let i = 0; i < this.sampleCount; ++i) {
      const sampleSize = this.readSampleEntry(defaults).size;

      if (gainValues[i] === -Infinity) {
        // Complete silence: replace with silence frame
        if (silenceFrame && this.hasSampleSize) {
          mdatEditor.internal_Yya(sampleSize, silenceFrame, dataPos);
          const extraBytes = this.sampleEntrySize - (this.hasSampleDuration ? 4 : 0);
          this.readFloat64.offset -= extraBytes;
          this.readFloat64.fo(silenceFrame.byteLength);
          this.readFloat64.offset += extraBytes - 4;
        }
      } else if (gainValues[i] < 0) {
        // Partial fade: apply gain to audio frame
        try {
          const frameData = rawBuffer.subarray(dataPos, dataPos + sampleSize);
          const result = fadeFrame({
            codec: normalizedCodec,
            frame: frameData,
            gain: gainValues[i],
            asymmetric: asymmetricFade,
            config: fadeConfig,
          });
          if (result.outputSize !== sampleSize) {
            this.bitReader.console.error(
              `TrackRunBoxEditor: parse frame size error ${result.outputSize} should be ${sampleSize}`
            );
          }
        } catch (error) {
          this.bitReader.console.error(
            `TrackRunBoxEditor: fadeFrame error: ${error.message} ${error.stack}`
          );
        }
      }

      dataPos += sampleSize;
    }
  }

  /**
   * Looks up the appropriate silence frame for a given codec.
   * @param {string} codecId - The codec identifier
   * @param {*} codecProfile - The codec profile
   * @returns {Object|undefined} Silence frame data
   * @private
   */
  getSilenceFrame(codecId, codecProfile) {
    if (typeof codecProfile === 'string') {
      assert(codecProfile !== 'reset' && codecProfile !== 'standard');
      return audioSampleRegistry[codecProfile];
    }
    if (codecId !== undefined) {
      return codecProfile
        ? audioSampleRegistry.create[codecId] || audioSampleRegistry.standard[codecId]
        : audioSampleRegistry.standard[codecId];
    }
  }
}
