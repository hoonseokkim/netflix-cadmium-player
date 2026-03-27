/**
 * Netflix Cadmium Player — AES_CBC_HS256_NRD_Cipher
 *
 * Netflix Reference Device (NRD) variant of AES-128-CBC with HMAC-SHA256.
 * Uses the `A128CBC-HS256-NRD` ALE scheme, which differs from the standard
 * `A128CBC-HS256` only in the scheme identifier — the underlying
 * encrypt/sign flow is identical.
 *
 * @module crypto/AES_CBC_HS256_NRD_Cipher
 */

import { n7 as BaseCipher } from '../modules/Module_88501.js';
import { AleScheme } from '../drm/KeyProvisionValidator.js';

export class AES_CBC_HS256_NRD_Cipher extends BaseCipher {
  /**
   * @param {object} cryptoEngine     - WebCryptoBase (or wrapper) instance.
   * @param {object} drmKeyWrapper    - Base64URL encode/decode helper.
   * @param {string} keyId            - Key identifier.
   * @param {CryptoKey} aesKey        - Imported AES-CBC platform key.
   * @param {CryptoKey} hmacKey       - Imported HMAC-SHA256 platform key.
   */
  constructor(cryptoEngine, drmKeyWrapper, keyId, aesKey, hmacKey) {
    super(AleScheme.A128CBC_HS256_NRD, cryptoEngine, drmKeyWrapper, keyId, aesKey, hmacKey);
  }

  /**
   * Factory that validates the HMAC key algorithm before construction.
   *
   * @param {object} cryptoEngine     - WebCryptoBase instance.
   * @param {object} drmKeyWrapper    - Base64URL encode/decode helper.
   * @param {string} keyId            - Key identifier.
   * @param {CryptoKey} aesKey        - AES-CBC key.
   * @param {CryptoKey} hmacKey       - HMAC-SHA256 key — must have `algorithm === "HMAC-SHA256"`.
   * @returns {AES_CBC_HS256_NRD_Cipher}
   * @throws {Error} If `hmacKey.algorithm` is not `"HMAC-SHA256"`.
   */
  static create(cryptoEngine, drmKeyWrapper, keyId, aesKey, hmacKey) {
    if (hmacKey.algorithm !== 'HMAC-SHA256') {
      throw new Error(BaseCipher.internal_Ddb);
    }
    return new AES_CBC_HS256_NRD_Cipher(cryptoEngine, drmKeyWrapper, keyId, aesKey, hmacKey);
  }
}
