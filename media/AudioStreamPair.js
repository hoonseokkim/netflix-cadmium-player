/**
 * Audio Stream Pair
 *
 * Simple value object that pairs a sample rate with an output rate
 * for audio stream configuration. Used internally to describe
 * audio stream timing parameters.
 *
 * @module media/AudioStreamPair
 * @original Module_95817
 */

/**
 * Represents a paired sample/output rate for an audio stream.
 */
export class AudioStreamPair {
  constructor() {
    /** @type {number|undefined} Sample rate in Hz */
    this.sampleRate = undefined;
    /** @type {number|undefined} Output rate in Hz */
    this.outputRate = undefined;
  }

  /**
   * Creates a new AudioStreamPair with the given rates.
   *
   * @param {number} sampleRate - The sample rate (e.g. 1536, 12288).
   * @param {number} outputRate - The output rate (e.g. 48000).
   * @returns {AudioStreamPair}
   */
  static of(sampleRate, outputRate) {
    const pair = new AudioStreamPair();
    pair.sampleRate = sampleRate;
    pair.outputRate = outputRate;
    return pair;
  }
}
