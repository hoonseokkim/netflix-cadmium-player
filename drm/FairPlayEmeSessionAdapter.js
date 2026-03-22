/**
 * Netflix Cadmium Player -- FairPlayEmeSessionAdapter
 *
 * Extends {@link EmeSessionAdapter} with Apple FairPlay Streaming
 * (FPS)-specific behaviour.  FairPlay does not use standard CENC
 * PSSH init-data; instead this adapter:
 *
 *   1. Extracts key IDs from the raw init-data blobs using
 *      {@link FairPlayPsshBuilder.extractKeyId}
 *   2. Builds a custom PSSH box via {@link FairPlayPsshBuilder.buildPsshBox}
 *   3. Passes the custom PSSH to the base `generateRequest`
 *   4. On `update`, parses the license response as JSON, maps key IDs
 *      to response payloads, and passes the restructured response
 *      to the CDM
 *   5. Supports license renewal by sending a "renew" update message
 *
 * Original: Webpack Module 81471
 *
 * @module drm/FairPlayEmeSessionAdapter
 */

import { EmeSessionAdapter } from './EmeSessionAdapter.js';
import { FairPlayPsshBuilder } from './FairPlayPsshBuilder.js';
// import { LicenseUpdateType } from './LicenseUpdateType.js';   // Module 27995
// import { KeyIdMapper } from './KeyIdMapper.js';               // Module 47450

/**
 * FairPlay EME session adapter.
 */
export class FairPlayEmeSessionAdapter extends EmeSessionAdapter {
  /**
   * @param {object} navigator - Browser navigator.
   * @param {object} typeChecker - Type-check utility.
   * @param {object} base64Codec - Base64 encode/decode.
   * @param {object} elementFactory - DOM element factory.
   * @param {object} platformConfig - Platform feature flags.
   * @param {object} textDecoder - Text decoder wrapper.
   */
  constructor(navigator, typeChecker, base64Codec, elementFactory, platformConfig, textDecoder) {
    super(navigator, typeChecker, base64Codec, elementFactory, platformConfig, textDecoder);

    /** @private */
    this._psshBuilder = new FairPlayPsshBuilder(base64Codec, elementFactory, textDecoder);

    /**
     * Base64-encoded key IDs extracted during generateRequest.
     * Used to map license responses back to keys.
     * @type {string[]}
     * @private
     */
    this._encodedKeyIds = [];

    /**
     * Key IDs that were present in the initial license response.
     * Used by {@link getTrackedKeyIds} to filter key-status checks.
     * @type {string[]|undefined}
     * @private
     */
    this._trackedKeyIds = undefined;
  }

  // -----------------------------------------------------------------------
  // Generate request (with PSSH transformation)
  // -----------------------------------------------------------------------

  /**
   * Generate a FairPlay license request.
   *
   * Extracts key IDs from each init-data blob, builds a custom PSSH
   * box, and delegates to the base adapter.
   *
   * @param {string} initDataType - e.g. "cenc"
   * @param {Uint8Array[]} initDataArray - Raw init-data blobs.
   * @param {boolean} isClearLead - Whether to use clear-lead scheme.
   * @returns {Promise<void>}
   */
  generateRequest(initDataType, initDataArray, isClearLead) {
    try {
      // Extract 16-byte key IDs from each init-data blob
      const keyIds = initDataArray.map((data) => this._psshBuilder.extractKeyId(data));

      // Store Base64-encoded versions for response mapping
      this._encodedKeyIds = keyIds.map((kid) => this._base64Codec.encode(kid));

      // Build a single FairPlay PSSH box
      const psshBox = this._psshBuilder.buildPsshBox(keyIds, isClearLead);

      // Use the base adapter with the transformed init data
      return super.generateRequest(initDataType, [psshBox]);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  // -----------------------------------------------------------------------
  // Update (with response transformation)
  // -----------------------------------------------------------------------

  /**
   * Update the FairPlay session with a license response.
   *
   * The server response is a JSON structure containing per-key
   * payloads.  This method maps each response entry to the correct
   * key ID, handles missing keys (marks them with error status), and
   * sends the restructured response to the CDM.
   *
   * @param {BufferSource[]} responseArray - License response buffers.
   * @param {number} updateType - LicenseUpdateType (Request or Renewal).
   * @param {string[]} [keyIds] - Expected key IDs.
   * @returns {Promise<void>}
   */
  update(responseArray, updateType, keyIds) {
    const LicenseUpdateType = { Request: 0, Renewal: 1 };

    if (keyIds) {
      try {
        // Decode the response as JSON
        const responseText = this._textDecoder.encode(responseArray[0]);
        const parsed = JSON.parse(responseText);

        // Map each response entry to its key ID
        const mappedEntries = parsed.RESPONSES.map((entry) => {
          const index = this._mapKeyIndex(entry.ID);
          return {
            keyID: updateType === LicenseUpdateType.Renewal
              ? this._encodedKeyIds[this._encodedKeyIds.length - 1]
              : keyIds[index],
            payload: entry.PAYLOAD,
          };
        });

        // Track which key IDs received responses (for initial requests)
        if (updateType === LicenseUpdateType.Request) {
          const respondedKeyIds = mappedEntries.map((e) => e.keyID);
          this._trackedKeyIds = respondedKeyIds;

          // Mark any missing key IDs with error status
          keyIds.forEach((kid) => {
            if (!respondedKeyIds.includes(kid)) {
              mappedEntries.push({ keyID: kid, error: 1 });
            }
          });
        }

        const responseJson = JSON.stringify(mappedEntries);
        responseArray = [this._textDecoder.decode(responseJson)];
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return super.update(responseArray);
  }

  // -----------------------------------------------------------------------
  // Renewal
  // -----------------------------------------------------------------------

  /**
   * Initiate a license renewal by sending a "renew" update.
   *
   * @returns {Promise<void>}
   */
  renew() {
    return super.update([this._textDecoder.decode('renew')]);
  }

  // -----------------------------------------------------------------------
  // Key tracking
  // -----------------------------------------------------------------------

  /**
   * Return the key IDs from the initial license response.
   * Used to scope key-status change evaluation.
   *
   * @returns {string[]|undefined}
   */
  getTrackedKeyIds() {
    return this._trackedKeyIds;
  }

  // -----------------------------------------------------------------------
  // Private helpers
  // -----------------------------------------------------------------------

  /**
   * Map a response entry ID to a key-ID index.
   * Uses the KeyIdMapper utility from Module_47450.
   *
   * @param {string} responseId
   * @returns {number}
   * @private
   */
  _mapKeyIndex(responseId) {
    // KeyIdMapper.parseResponseId(responseId) -- maps to index
    // Simplified: assume sequential mapping
    return parseInt(responseId, 10) || 0;
  }
}
