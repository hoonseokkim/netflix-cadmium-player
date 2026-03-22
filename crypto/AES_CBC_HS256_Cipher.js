/**
 * Netflix Cadmium Player — AES_CBC_HS256_Cipher
 *
 * Cipher implementation for AES-128-CBC with HMAC-SHA256 authentication
 * (the `A128CBC-HS256` scheme defined by the Netflix ALE/MSL protocol).
 *
 * This is a thin specialisation of the base cipher class (`n7`) that
 * locks the scheme to {@link AleScheme.A128CBC_HS256} and validates
 * the HMAC key algorithm at construction time.
 *
 * @module crypto/AES_CBC_HS256_Cipher
 */

import { n7 as BaseCipher } from '../modules/Module_88501.js';
import { AleScheme } from '../modules/Module_2802.js';

export class AES_CBC_HS256_Cipher extends BaseCipher {
  /**
   * @param {object} cryptoEngine     - WebCryptoBase (or wrapper) instance.
   * @param {object} drmKeyWrapper    - Utility for Base64URL encode/decode.
   * @param {string} keyId            - Key identifier for this cipher context.
   * @param {CryptoKey} aesKey        - Imported AES-CBC platform key.
   * @param {CryptoKey} hmacKey       - Imported HMAC-SHA256 platform key.
   */
  constructor(cryptoEngine, drmKeyWrapper, keyId, aesKey, hmacKey) {
    super(AleScheme.A128CBC_HS256, cryptoEngine, drmKeyWrapper, keyId, aesKey, hmacKey);
  }

  /**
   * Factory that validates the HMAC key algorithm before construction.
   *
   * @param {object} cryptoEngine     - WebCryptoBase instance.
   * @param {object} drmKeyWrapper    - Base64URL encode/decode helper.
   * @param {string} keyId            - Key identifier.
   * @param {CryptoKey} aesKey        - AES-CBC key.
   * @param {CryptoKey} hmacKey       - HMAC-SHA256 key — must have `algorithm === "HMAC-SHA256"`.
   * @returns {AES_CBC_HS256_Cipher}
   * @throws {Error} If `hmacKey.algorithm` is not `"HMAC-SHA256"`.
   */
  static create(cryptoEngine, drmKeyWrapper, keyId, aesKey, hmacKey) {
    if (hmacKey.algorithm !== 'HMAC-SHA256') {
      throw new Error(BaseCipher.internal_Ddb);
    }
    return new AES_CBC_HS256_Cipher(cryptoEngine, drmKeyWrapper, keyId, aesKey, hmacKey);
  }
}
