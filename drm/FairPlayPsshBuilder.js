/**
 * Netflix Cadmium Player -- FairPlayPsshBuilder
 *
 * Constructs FairPlay-compatible PSSH (Protection System Specific
 * Header) boxes from key IDs.  FairPlay does not use standard CENC
 * PSSH boxes; instead Netflix builds a custom box hierarchy:
 *
 *   pssh
 *     +-- fpsd (FairPlay Streaming Data)
 *           +-- fpsi (FairPlay Streaming Info -- contains the scheme)
 *           +-- fpsk (FairPlay Streaming Key)
 *                 +-- fkri (FairPlay Key Request Info -- key ID)
 *                 +-- fkai (FairPlay Key Asset ID)
 *                 +-- fkvl (FairPlay Key Version List)
 *
 * The PSSH system ID is a fixed UUID:
 *   94ce86fb-07ff-4f43-adb8-93d2fa968ca2
 *
 * This builder also extracts 16-byte key IDs from raw init-data blobs
 * using a specific byte offset scheme.
 *
 * Original: Webpack Module 77699
 *
 * @module drm/FairPlayPsshBuilder
 */

/**
 * Fixed FairPlay PSSH system ID (16 bytes).
 * UUID: 94ce86fb-07ff-4f43-adb8-93d2fa968ca2
 * @type {Uint8Array}
 */
const FAIRPLAY_SYSTEM_ID = new Uint8Array([
  0x94, 0xce, 0x86, 0xfb, 0x07, 0xff, 0x4f, 0x43,
  0xad, 0xb8, 0x93, 0xd2, 0xfa, 0x96, 0x8c, 0xa2,
]);

/**
 * FairPlay scheme identifiers (four-character codes as uint32).
 * @enum {number}
 */
const FairPlayScheme = Object.freeze({
  /** Standard content key ("cbcs" -- "cbcs" as FourCC). */
  CBCS: 0x63626373,

  /** Clear-lead content key ("cbc1" as FourCC). */
  CBC1: 0x63626331,
});

/**
 * Builds FairPlay PSSH boxes for license request init-data.
 */
export class FairPlayPsshBuilder {
  /**
   * @param {object} base64Codec - Base64 encode/decode helper.
   * @param {object} elementFactory - Unused (injected for consistency).
   * @param {object} textEncoder - TextEncoder wrapper for FourCC encoding.
   */
  constructor(base64Codec, elementFactory, textEncoder) {
    /** @private */ this._base64 = base64Codec;
    /** @private */ this._textEncoder = textEncoder;
  }

  // -----------------------------------------------------------------------
  // Key ID extraction
  // -----------------------------------------------------------------------

  /**
   * Extract a 16-byte key ID from a raw init-data blob.
   *
   * The init-data format encodes the key ID starting at byte offset 14
   * through byte 30 as Base64.  After decoding, the first 4 bytes are
   * stripped to yield the final 16-byte key ID.
   *
   * @param {Uint8Array} initData - Raw init-data from the CDM.
   * @returns {Uint8Array} 16-byte key ID.
   */
  extractKeyId(initData) {
    // Bytes 14..30 contain a Base64-encoded key ID with 4-byte prefix
    const encoded = initData.subarray(14, 30);
    const chars = String.fromCharCode.apply(null, encoded);
    const decoded = this._base64.decode(chars);
    const keyIdWithPrefix = decoded.subarray(4);

    const keyId = new Uint8Array(16);
    keyId.set(keyIdWithPrefix);
    return keyId;
  }

  // -----------------------------------------------------------------------
  // PSSH box construction
  // -----------------------------------------------------------------------

  /**
   * Build a complete PSSH box containing FairPlay init data for the
   * given key IDs.
   *
   * @param {Uint8Array[]} keyIds - Array of 16-byte key IDs.
   * @param {boolean} isClearLead - If true, use CBC1 scheme; else CBCS.
   * @returns {Uint8Array} Complete PSSH box bytes.
   */
  buildPsshBox(keyIds, isClearLead) {
    const scheme = isClearLead ? FairPlayScheme.CBC1 : FairPlayScheme.CBCS;

    const keyEntries = keyIds.map((keyId) => ({
      keyRequestInfo: keyId,
      assetId: keyId,
      versionList: [1],
    }));

    return this._buildPsshContainer(scheme, keyEntries);
  }

  // -----------------------------------------------------------------------
  // Internal box builders
  // -----------------------------------------------------------------------

  /**
   * Build the "fpsi" (FairPlay Streaming Info) box.
   * Contains the 4-byte scheme identifier.
   *
   * @param {number} scheme - FourCC scheme code.
   * @returns {Uint8Array}
   * @private
   */
  _buildFpsiBox(scheme) {
    const payload = new Uint8Array(4);
    new DataView(payload.buffer).setUint32(0, scheme);
    return this._buildFullBox('fpsi', [payload]);
  }

  /**
   * Build a single "fpsk" (FairPlay Streaming Key) box for one key entry.
   *
   * @param {Uint8Array} keyId - 16-byte key request info.
   * @param {Uint8Array} assetId - Asset identifier (same as key ID for Netflix).
   * @param {number[]} versionList - Array of supported version numbers.
   * @returns {Uint8Array}
   * @private
   */
  _buildFpskBox(keyId, assetId, versionList) {
    const children = [this._buildFullBox('fkri', [keyId])];

    if (assetId.byteLength) {
      children.push(this._buildBox('fkai', [assetId]));
    }
    if (versionList.length) {
      const versionBytes = new Uint8Array(new Uint32Array(versionList).buffer);
      children.push(this._buildBox('fkvl', [versionBytes]));
    }

    return this._buildBox('fpsk', children);
  }

  /**
   * Build the complete PSSH box wrapping all FairPlay data.
   *
   * @param {number} scheme - FairPlay scheme code.
   * @param {Array<{keyRequestInfo: Uint8Array, assetId: Uint8Array, versionList: number[]}>} entries
   * @returns {Uint8Array}
   * @private
   */
  _buildPsshContainer(scheme, entries) {
    const children = [this._buildFpsiBox(scheme)];

    for (const entry of entries) {
      children.push(this._buildFpskBox(entry.keyRequestInfo, entry.assetId, entry.versionList));
    }

    const fpsdBox = this._buildBox('fpsd', children);

    // PSSH box payload: system ID (16 bytes) + data-size (4 bytes) + data
    const dataSizeBytes = new Uint8Array(4);
    new DataView(dataSizeBytes.buffer).setUint32(0, fpsdBox.byteLength);

    return this._buildFullBox('pssh', [FAIRPLAY_SYSTEM_ID, dataSizeBytes, fpsdBox]);
  }

  /**
   * Build a "full box" (ISO BMFF) with version=0 and flags=0.
   *
   * Layout: [4 bytes size][4 bytes type][4 bytes version+flags][...payloads]
   *
   * @param {string} type - Four-character box type.
   * @param {Uint8Array[]} payloads - Child data arrays.
   * @returns {Uint8Array}
   * @private
   */
  _buildFullBox(type, payloads) {
    let dataSize = 0;
    for (const p of payloads) dataSize += p.byteLength;

    const box = new Uint8Array(12 + dataSize);
    const view = new DataView(box.buffer);

    let offset = 0;
    view.setUint32(offset, box.byteLength); offset += 4;
    box.set(this._textEncoder.decode(type), offset); offset += 4;
    view.setUint32(offset, 0); offset += 4; // version=0, flags=0

    for (const p of payloads) {
      box.set(p, offset);
      offset += p.byteLength;
    }

    return box;
  }

  /**
   * Build a standard box (no version/flags field).
   *
   * Layout: [4 bytes size][4 bytes type][...payloads]
   *
   * @param {string} type - Four-character box type.
   * @param {Uint8Array[]} payloads - Child data arrays.
   * @returns {Uint8Array}
   * @private
   */
  _buildBox(type, payloads) {
    let dataSize = 0;
    for (const p of payloads) dataSize += p.byteLength;

    const box = new Uint8Array(8 + dataSize);
    let offset = 0;
    new DataView(box.buffer).setUint32(offset, box.byteLength); offset += 4;
    box.set(this._textEncoder.decode(type), offset); offset += 4;

    for (const p of payloads) {
      box.set(p, offset);
      offset += p.byteLength;
    }

    return box;
  }
}
