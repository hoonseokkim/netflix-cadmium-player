/**
 * @module StreamSelectionEntry
 * @description Simple data container for a stream selection entry, pairing a
 * stream identifier (V2) with its associated key/configuration (K4a).
 *
 * @see Module_4595
 */

/**
 * Represents a single stream selection entry binding a stream ID to its key data.
 */
export class StreamSelectionEntry {
  /**
   * @param {*} streamId - The stream identifier (V2)
   * @param {*} keyData - The associated key or configuration data (K4a)
   */
  constructor(streamId, keyData) {
    /** @type {*} Stream identifier */
    this.streamId = streamId;

    /** @type {*} Associated key/configuration data */
    this.keyData = keyData;
  }
}

// Legacy alias
export { StreamSelectionEntry };
