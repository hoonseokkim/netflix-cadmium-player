/**
 * Netflix Cadmium Player — WebCryptoBase
 *
 * Base class that wraps the W3C Web Crypto API (SubtleCrypto) and exposes
 * high-level helpers for AES-CBC, AES-GCM, HMAC-SHA256, and RSA-OAEP
 * operations used throughout the Netflix MSL (Message Security Layer) stack.
 *
 * @module crypto/WebCryptoBase
 */

import { CryptoKey, KeyPairHolder } from '../modules/Module_78212.js';

/** Usages granted to imported AES encrypt/decrypt keys. */
const AES_KEY_USAGES = ['encrypt', 'decrypt'];

/** Algorithm descriptor for HMAC-SHA256 operations. */
const HMAC_SHA256_ALGORITHM = {
  name: 'HMAC',
  hash: { name: 'SHA-256' },
};

/** Algorithm descriptor for RSA-OAEP unwrap / decrypt. */
const RSA_OAEP_ALGORITHM = { name: 'RSA-OAEP' };

export class WebCryptoBase {
  /**
   * @param {Crypto} webCryptoInstance - The platform `Crypto` object
   *   (typically `window.crypto` or the NRD equivalent).
   */
  constructor(webCryptoInstance) {
    /** @type {Crypto} */
    this.webCrypto = webCryptoInstance;
    /** @type {SubtleCrypto} */
    this.webCryptoSubtle = this.webCrypto.subtle;
  }

  /* ------------------------------------------------------------------
   * Abstract hooks — subclasses must implement these.
   * ----------------------------------------------------------------*/

  /**
   * Initialise the Web Crypto back-end (platform-specific).
   * @abstract
   */
  initWebCrypto() {
    throw new Error('not implemented');
  }

  /**
   * Platform-specific crypto teardown / feature-of-concern hook.
   * @abstract
   */
  foc() {
    throw new Error('not implemented');
  }

  /* ------------------------------------------------------------------
   * Random bytes
   * ----------------------------------------------------------------*/

  /**
   * Generate cryptographically-strong random bytes.
   *
   * @param {number} byteLength - Number of random bytes to produce.
   * @returns {Uint8Array} A buffer filled with random values.
   */
  getRandomValues(byteLength) {
    const buffer = new Uint8Array(byteLength);
    return this.webCrypto.getRandomValues(buffer);
  }

  /* ------------------------------------------------------------------
   * AES-CBC
   * ----------------------------------------------------------------*/

  /**
   * Validate that a key/IV pair is suitable for AES-CBC.
   *
   * @param {CryptoKey} key - Must have algorithm `"AES-CBC"` and type `"secret"`.
   * @param {Uint8Array} iv - Must be exactly 16 bytes.
   * @throws {Error} On any mismatch.
   */
  async validateAesCbcKey(key, iv) {
    if (key.algorithm !== 'AES-CBC') throw new Error('mismatched key algorithm');
    if (key.aesKey.type !== 'secret') throw new Error('invalid platformKey');
    if (iv.byteLength !== 16) throw new Error('iv wrong size');
  }

  /**
   * Build the `AlgorithmIdentifier` for AES-CBC.
   *
   * @param {Uint8Array} iv - 16-byte initialisation vector.
   * @returns {{ name: string, iv: Uint8Array }}
   */
  static getAlgorithmParams(iv) {
    return { name: 'AES-CBC', iv };
  }

  /**
   * Encrypt plaintext with AES-CBC.
   *
   * @param {CryptoKey} key - AES-CBC secret key.
   * @param {Uint8Array} iv  - 16-byte IV.
   * @param {BufferSource} plaintext - Data to encrypt.
   * @returns {Promise<Uint8Array>} The ciphertext.
   */
  async encryptAesCbc(key, iv, plaintext) {
    await this.validateAesCbcKey(key, iv);
    const result = await this.webCryptoSubtle.encrypt(
      WebCryptoBase.getAlgorithmParams(iv),
      key.aesKey,
      plaintext,
    );
    return new Uint8Array(result);
  }

  /**
   * Decrypt ciphertext with AES-CBC.
   *
   * @param {CryptoKey} key - AES-CBC secret key.
   * @param {Uint8Array} iv  - 16-byte IV.
   * @param {BufferSource} ciphertext - Data to decrypt.
   * @returns {Promise<Uint8Array>} The plaintext.
   */
  async decryptAesCbc(key, iv, ciphertext) {
    await this.validateAesCbcKey(key, iv);
    const result = await this.webCryptoSubtle.decrypt(
      WebCryptoBase.getAlgorithmParams(iv),
      key.aesKey,
      ciphertext,
    );
    return new Uint8Array(result);
  }

  /* ------------------------------------------------------------------
   * AES-GCM
   * ----------------------------------------------------------------*/

  /**
   * Validate that a key/IV pair is suitable for AES-GCM.
   *
   * @param {CryptoKey} key - Must have algorithm `"AES-GCM"` and type `"secret"`.
   * @param {Uint8Array} iv - Must be exactly 12 bytes.
   * @throws {Error} On any mismatch.
   */
  async validateAesGcmKey(key, iv) {
    if (key.algorithm !== 'AES-GCM') throw new Error('mismatched key algorithm');
    if (key.aesKey.type !== 'secret') throw new Error('invalid platformKey');
    if (iv.byteLength !== 12) throw new Error('iv wrong size');
  }

  /**
   * Build the `AesGcmParams` algorithm descriptor.
   *
   * @param {Uint8Array} iv             - 12-byte initialisation vector.
   * @param {BufferSource} additionalData - AAD (Additional Authenticated Data).
   * @returns {AesGcmParams}
   */
  static getAesGcmParams(iv, additionalData) {
    return {
      name: 'AES-GCM',
      iv,
      additionalData,
      tagLength: 128,
    };
  }

  /**
   * Encrypt plaintext with AES-GCM (128-bit tag).
   *
   * @param {CryptoKey} key             - AES-GCM secret key.
   * @param {Uint8Array} iv             - 12-byte IV.
   * @param {BufferSource} additionalData - AAD.
   * @param {BufferSource} plaintext     - Data to encrypt.
   * @returns {Promise<Uint8Array>} Ciphertext including the authentication tag.
   */
  async encryptAesGcm(key, iv, additionalData, plaintext) {
    await this.validateAesGcmKey(key, iv);
    const result = await this.webCryptoSubtle.encrypt(
      WebCryptoBase.getAesGcmParams(iv, additionalData),
      key.aesKey,
      plaintext,
    );
    return new Uint8Array(result);
  }

  /**
   * Decrypt ciphertext with AES-GCM (128-bit tag).
   *
   * @param {CryptoKey} key             - AES-GCM secret key.
   * @param {Uint8Array} iv             - 12-byte IV.
   * @param {BufferSource} additionalData - AAD.
   * @param {BufferSource} ciphertext    - Data to decrypt (must be >= 16 bytes).
   * @returns {Promise<Uint8Array>} The plaintext.
   * @throws {Error} If ciphertext is too short to contain a tag.
   */
  async decryptAesGcm(key, iv, additionalData, ciphertext) {
    await this.validateAesGcmKey(key, iv);
    if (ciphertext.byteLength < 16) throw new Error('ciphertext too short');
    const result = await this.webCryptoSubtle.decrypt(
      WebCryptoBase.getAesGcmParams(iv, additionalData),
      key.aesKey,
      ciphertext,
    );
    return new Uint8Array(result);
  }

  /* ------------------------------------------------------------------
   * HMAC-SHA256
   * ----------------------------------------------------------------*/

  /**
   * Validate that a key is suitable for HMAC-SHA256 signing.
   *
   * @param {CryptoKey} key - Must have algorithm `"HMAC-SHA256"` and type `"secret"`.
   * @throws {Error} On mismatch.
   */
  async validateHmacKey(key) {
    if (key.algorithm !== 'HMAC-SHA256') throw new Error('mismatched key algorithm');
    if (key.aesKey.type !== 'secret') throw new Error('invalid platformKey');
  }

  /**
   * Compute an HMAC-SHA256 signature.
   *
   * @param {CryptoKey} hmacKey  - HMAC-SHA256 secret key.
   * @param {BufferSource} data  - Data to sign.
   * @returns {Promise<Uint8Array>} 32-byte HMAC digest.
   */
  async signHmacSha256(hmacKey, data) {
    await this.validateHmacKey(hmacKey);
    const signature = await this.webCryptoSubtle.sign(
      HMAC_SHA256_ALGORITHM,
      hmacKey.aesKey,
      data,
    );
    return new Uint8Array(signature);
  }

  /* ------------------------------------------------------------------
   * Key import
   * ----------------------------------------------------------------*/

  /**
   * Import raw key material into a platform `CryptoKey`.
   *
   * Supported algorithms:
   * - `"AES-GCM"`      — 16-byte key
   * - `"AES-CBC"`      — 16-byte key
   * - `"HMAC-SHA256"`  — 16- or 32-byte key
   *
   * @param {string} algorithm   - One of the supported algorithm names.
   * @param {Uint8Array} rawKey  - Raw key bytes.
   * @returns {Promise<CryptoKey>} Wrapped platform key.
   * @throws {Error} On invalid algorithm or key length.
   */
  async importKey(algorithm, rawKey) {
    const keyLength = rawKey.byteLength;
    let algorithmDescriptor;
    let usages;

    switch (algorithm) {
      case 'AES-GCM':
        algorithmDescriptor = { name: 'AES-GCM' };
        usages = AES_KEY_USAGES;
        if (keyLength !== 16) throw new Error('invalid import key length');
        break;

      case 'AES-CBC':
        algorithmDescriptor = { name: 'AES-CBC' };
        usages = AES_KEY_USAGES;
        if (keyLength !== 16) throw new Error('invalid import key length');
        break;

      case 'HMAC-SHA256':
        algorithmDescriptor = HMAC_SHA256_ALGORITHM;
        usages = ['sign', 'verify'];
        if (keyLength !== 16 && keyLength !== 32) throw new Error('invalid import key length');
        break;

      default:
        throw new Error('invalid import algorithm');
    }

    const platformKey = await this.webCryptoSubtle.importKey(
      'raw',
      rawKey,
      algorithmDescriptor,
      false,
      usages,
    );
    return CryptoKey.XZ(algorithm, platformKey);
  }

  /* ------------------------------------------------------------------
   * RSA-OAEP key pair generation & export
   * ----------------------------------------------------------------*/

  /**
   * Generate a 2048-bit RSA-OAEP key pair (SHA-256 hash).
   *
   * @returns {Promise<KeyPairHolder>} Holder containing private and public keys.
   */
  async generateRsaOaepKeyPair() {
    const rsaParams = {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: 'SHA-256' },
    };

    const keyPair = await this.webCryptoSubtle.generateKey(rsaParams, false, AES_KEY_USAGES);

    const privateKey = CryptoKey.UZ('RSA-OAEP', keyPair.privateKey);
    const publicKey = CryptoKey.VZ('RSA-OAEP', keyPair.publicKey);
    return new KeyPairHolder(privateKey, publicKey);
  }

  /**
   * Export the public key of an RSA-OAEP key pair as SPKI DER bytes.
   *
   * @param {KeyPairHolder} keyPairHolder - Must have algorithm `"RSA-OAEP"`.
   * @returns {Promise<Uint8Array>} DER-encoded SubjectPublicKeyInfo.
   */
  async exportPublicKey(keyPairHolder) {
    if (keyPairHolder.algorithm !== 'RSA-OAEP') throw new Error('invalid export key algorithm');
    const publicPlatformKey = keyPairHolder.publicKey.aesKey;
    if (publicPlatformKey.type !== 'public') throw new Error('invalid export key type');
    const exported = await this.webCryptoSubtle.exportKey('spki', publicPlatformKey);
    return new Uint8Array(exported);
  }

  /* ------------------------------------------------------------------
   * RSA-OAEP decrypt (unwrap)
   * ----------------------------------------------------------------*/

  /**
   * Validate that a key is suitable for RSA-OAEP private-key operations.
   *
   * @param {CryptoKey} key - Must have algorithm `"RSA-OAEP"` and type `"private"`.
   * @throws {Error} On mismatch.
   */
  async validateRsaOaepKey(key) {
    if (key.algorithm !== 'RSA-OAEP') throw new Error('mismatched key algorithm');
    if (key.aesKey.type !== 'private') throw new Error('invalid platformKey');
  }

  /**
   * Decrypt (unwrap) data with an RSA-OAEP private key.
   *
   * @param {CryptoKey} privateKey      - RSA-OAEP private key.
   * @param {BufferSource} ciphertext   - Encrypted key material.
   * @returns {Promise<Uint8Array>} Decrypted (unwrapped) bytes.
   */
  async decryptRsaOaep(privateKey, ciphertext) {
    await this.validateRsaOaepKey(privateKey);
    const result = await this.webCryptoSubtle.decrypt(
      RSA_OAEP_ALGORITHM,
      privateKey.aesKey,
      ciphertext,
    );
    return new Uint8Array(result);
  }
}
