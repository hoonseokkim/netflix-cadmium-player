/**
 * Netflix Cadmium Player — RSA_OAEP_256_KeyxHandler
 *
 * Key-exchange handler for the RSA-OAEP-256 scheme.  During the MSL
 * handshake the client generates an RSA-2048 key pair, sends the public
 * key to the server, and receives back a wrapped (RSA-OAEP encrypted)
 * session key that is unwrapped with the private key.
 *
 * Extends {@link KeyWrapperClass} which provides the shared
 * `processLicenseChallenge` logic for deriving cipher instances from
 * raw key material.
 *
 * @module crypto/RSA_OAEP_256_KeyxHandler
 */

import { AleKeyxScheme } from '../modules/Module_2802.js';
import { KeyWrapperClass } from '../drm/KeyWrapperClass.js';

export class RSA_OAEP_256_KeyxHandler extends KeyWrapperClass {
  /**
   * @param {object} cryptoEngine  - WebCryptoBase instance.
   * @param {object} drmKeyWrapper - Base64URL / UTF-8 helper.
   * @param {object} aleScheme     - The ALE encryption scheme to use for
   *                                 deriving session ciphers.
   */
  constructor(cryptoEngine, drmKeyWrapper, aleScheme) {
    super(AleKeyxScheme.RSA_OAEP_256, cryptoEngine, drmKeyWrapper, aleScheme);

    /** @type {import('../modules/Module_78212.js').KeyPairHolder|null} */
    this.keyPair = null;

    /** @type {string|null} Base64URL-encoded SPKI public key. */
    this.encodedPublicKey = null;
  }

  /* ------------------------------------------------------------------
   * Public API
   * ----------------------------------------------------------------*/

  /**
   * Return the public key (generating the key pair lazily if needed).
   *
   * @returns {Promise<CryptoKey>} The RSA-OAEP public key.
   */
  async getPublicKey() {
    await this.ensureKeyPairGenerated();
    return this.keyPair.publicKey;
  }

  /**
   * Build the key-exchange request data to send to the server.
   *
   * @returns {Promise<{ scheme: string, data: { publickey: string } }>}
   */
  async buildKeyExchangeRequest() {
    await this.ensureKeyPairGenerated();
    return {
      scheme: AleKeyxScheme.RSA_OAEP_256,
      data: { publickey: this.encodedPublicKey },
    };
  }

  /**
   * Process a key-exchange response from the server.
   *
   * The response contains a `wrappedkey` field — an RSA-OAEP encrypted
   * blob that, once decrypted with our private key, yields the raw
   * session key material.  That material is then handed to
   * {@link KeyWrapperClass#processLicenseChallenge} to derive the
   * appropriate cipher instance.
   *
   * @param {object} keyResponse - Server key-exchange response object.
   * @param {string} keyResponse.scheme - Must equal `RSA_OAEP_256`.
   * @param {string} keyResponse.kid    - Key identifier.
   * @param {object} keyResponse.data   - Contains `wrappedkey` (Base64URL).
   * @returns {Promise<object>} A cipher instance ready for encrypt/decrypt.
   * @throws {Error} If scheme or data format is incompatible, or no key pair exists.
   */
  async processKeyExchangeResponse(keyResponse) {
    if (keyResponse.scheme !== AleKeyxScheme.RSA_OAEP_256) {
      throw new Error('incompatible key response scheme');
    }

    const keyId = keyResponse.kid;

    if (!RSA_OAEP_256_KeyxHandler.isWrappedKeyResponse(keyResponse.data)) {
      throw new Error('incompatible key response data');
    }

    const { wrappedkey: wrappedKeyBase64 } = keyResponse.data;
    const wrappedKeyBytes = this.drmKeyWrapper.$Q(wrappedKeyBase64);

    if (!this.keyPair) throw new Error('no key pair');

    const rawSessionKey = await this.crypto.decryptRsaOaep(this.keyPair.privateKey, wrappedKeyBytes);
    return this.processLicenseChallenge(rawSessionKey, keyId);
  }

  /* ------------------------------------------------------------------
   * Internal helpers
   * ----------------------------------------------------------------*/

  /**
   * Lazily generate and cache the RSA-OAEP key pair, exporting the
   * public key as Base64URL-encoded SPKI.
   *
   * @private
   */
  async ensureKeyPairGenerated() {
    if (this.keyPair && this.encodedPublicKey) return;

    this.keyPair = await this.crypto.generateRsaOaepKeyPair();
    const exportedSpki = await this.crypto.exportPublicKey(this.keyPair);
    this.encodedPublicKey = this.drmKeyWrapper.mZ(exportedSpki);
  }

  /**
   * Type-guard for wrapped-key response data.
   *
   * @param {*} data - Candidate response data.
   * @returns {boolean} `true` if the object has a string `wrappedkey` field.
   * @private
   */
  static isWrappedKeyResponse(data) {
    return typeof data === 'object' && 'wrappedkey' in data && typeof data.wrappedkey === 'string';
  }
}
