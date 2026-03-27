/**
 * Netflix Cadmium Player — KeyWrapperClass
 *
 * Base class for all key-exchange handlers (Clear, RSA-OAEP, DH).
 * Given raw session-key bytes and an ALE encryption scheme, this class
 * imports the key material into platform `CryptoKey` objects and
 * constructs the appropriate cipher instance (AES-GCM or AES-CBC-HS256).
 *
 * Subclasses implement the transport-specific logic for obtaining the
 * raw key bytes (e.g. RSA unwrap, clear-text, Diffie-Hellman).
 *
 * @module drm/KeyWrapperClass
 */

import { AleScheme } from './KeyProvisionValidator.js';
import { sliceBuffer as SY } from '../utils/ArrayBufferSlice.js';
import { AES_GCM_Cipher } from '../modules/Module_51708.js';
import { AES_CBC_HS256_Cipher } from '../crypto/AES_CBC_HS256_Cipher.js';

export class KeyWrapperClass {
  /**
   * @param {string} keyExchangeScheme  - Identifier for the key-exchange mechanism
   *                                      (e.g. `AleKeyxScheme.RSA_OAEP_256`).
   * @param {object} cryptoEngine       - WebCryptoBase instance for key import.
   * @param {object} drmKeyWrapper      - Base64URL / UTF-8 helper.
   * @param {object} aleEncryptionScheme - The ALE cipher scheme to derive
   *                                       (e.g. `AleScheme.A128GCM`).
   */
  constructor(keyExchangeScheme, cryptoEngine, drmKeyWrapper, aleEncryptionScheme) {
    /** @type {object} */
    this.crypto = cryptoEngine;
    /** @type {object} */
    this.drmKeyWrapper = drmKeyWrapper;
    /** @type {object} */
    this.aleEncryptionScheme = aleEncryptionScheme;
  }

  /**
   * Derive a cipher instance from raw session-key bytes.
   *
   * Depending on the configured ALE encryption scheme the key material
   * is interpreted differently:
   *
   * - **A128GCM** — 16-byte key imported as AES-GCM.
   * - **A128CBC-HS256** — 32-byte key split into a 16-byte AES-CBC key
   *   (second half) and a 16-byte HMAC-SHA256 key (first half), then
   *   used to construct an {@link AES_CBC_HS256_Cipher}.
   *
   * @param {Uint8Array} rawKeyBytes - Raw (unwrapped) session key material.
   * @param {string} keyId           - Key identifier for the new cipher.
   * @returns {Promise<object>} A cipher instance with `encrypt` / `decrypt`.
   * @throws {Error} If the key size doesn't match the scheme or the
   *   scheme is unknown.
   */
  async processLicenseChallenge(rawKeyBytes, keyId) {
    switch (this.aleEncryptionScheme) {
      case AleScheme.A128GCM: {
        if (rawKeyBytes.byteLength !== 16) {
          throw new Error(`bad key size for ${this.aleEncryptionScheme.toString()}`);
        }
        const aesGcmKey = await this.crypto.importKey('AES-GCM', rawKeyBytes);
        return AES_GCM_Cipher.create(this.crypto, this.drmKeyWrapper, keyId, aesGcmKey);
      }

      case AleScheme.A128CBC_HS256: {
        if (rawKeyBytes.byteLength !== 32) {
          throw new Error(`bad key size for ${this.aleEncryptionScheme.toString()}`);
        }
        /* Second 16 bytes → AES-CBC encryption key. */
        const aesCbcKeyBytes = SY(rawKeyBytes, 16);
        /* First 16 bytes → HMAC-SHA256 signing key. */
        const hmacKeyBytes = SY(rawKeyBytes, 0, 16);

        const aesCbcKey = await this.crypto.importKey('AES-CBC', aesCbcKeyBytes);
        const hmacKey = await this.crypto.importKey('HMAC-SHA256', hmacKeyBytes);

        return AES_CBC_HS256_Cipher.create(
          this.crypto,
          this.drmKeyWrapper,
          keyId,
          aesCbcKey,
          hmacKey,
        );
      }

      default:
        throw new Error('invalid ALE scheme');
    }
  }
}
