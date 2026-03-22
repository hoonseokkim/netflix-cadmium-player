/**
 * Netflix Cadmium Player — ClearKeyxHandler
 *
 * Key-exchange handler for the "CLEAR" (unencrypted) scheme.  In this
 * mode the server sends the raw session key in plaintext (Base64URL-encoded)
 * — no asymmetric wrapping is performed.  This is used in development /
 * debug scenarios or when the transport is already protected by TLS.
 *
 * Extends {@link KeyWrapperClass} which provides the shared
 * `processLicenseChallenge` logic for deriving cipher instances.
 *
 * @module drm/ClearKeyxHandler
 */

import { AleKeyxScheme } from '../modules/Module_2802.js';
import { KeyWrapperClass } from './KeyWrapperClass.js';

export class ClearKeyxHandler extends KeyWrapperClass {
  /**
   * @param {object} cryptoEngine  - WebCryptoBase instance.
   * @param {object} drmKeyWrapper - Base64URL / UTF-8 helper.
   * @param {object} aleScheme     - The ALE encryption scheme for session ciphers.
   */
  constructor(cryptoEngine, drmKeyWrapper, aleScheme) {
    super(AleKeyxScheme.CLEAR, cryptoEngine, drmKeyWrapper, aleScheme);
  }

  /**
   * Build the key-exchange request data for the CLEAR scheme.
   * No client-side key material is needed, so only the scheme identifier
   * is returned.
   *
   * @returns {Promise<{ scheme: string }>}
   */
  async buildKeyExchangeRequest() {
    return { scheme: AleKeyxScheme.CLEAR };
  }

  /**
   * Process a key-exchange response containing a cleartext session key.
   *
   * @param {object} keyResponse - Server key-exchange response.
   * @param {string} keyResponse.scheme - Must equal `CLEAR`.
   * @param {string} keyResponse.kid    - Key identifier.
   * @param {object} keyResponse.data   - Contains `key` (Base64URL-encoded raw key).
   * @returns {Promise<object>} A cipher instance ready for encrypt/decrypt.
   * @throws {Error} If the scheme or data format is incompatible.
   */
  async processKeyExchangeResponse(keyResponse) {
    if (keyResponse.scheme !== AleKeyxScheme.CLEAR) {
      throw new Error('incompatible key response scheme');
    }

    const keyId = keyResponse.kid;

    if (!ClearKeyxHandler.isClearKeyResponse(keyResponse.data)) {
      throw new Error('incompatible key response data');
    }

    const rawKeyBytes = this.drmKeyWrapper.$Q(keyResponse.data.key);
    return this.processLicenseChallenge(rawKeyBytes, keyId);
  }

  /**
   * Type-guard for clear-key response data.
   *
   * @param {*} data - Candidate response data.
   * @returns {boolean} `true` if the object has a string `key` field.
   * @private
   */
  static isClearKeyResponse(data) {
    return typeof data === 'object' && 'key' in data && typeof data.key === 'string';
  }
}
