/**
 * Netflix Cadmium Player — JWEEncryptor
 *
 * Implements JWE (JSON Web Encryption) compact serialisation using
 * "direct" key agreement (`alg: "dir"`).  The Content Encryption Key
 * (CEK) is derived from the current session rather than being wrapped
 * inside the JWE token, so the second segment is always empty.
 *
 * Used by the MSL (Message Security Layer) transport to protect
 * request/response payloads between the client and Netflix edge servers.
 *
 * @module crypto/JWEEncryptor
 */

export class JWEEncryptor {
  /**
   * @param {object} encryptionScheme - ALE encryption scheme (toString yields e.g. "A128CBC-HS256").
   * @param {object} cryptoEngine     - WebCryptoBase instance for random-byte generation.
   * @param {object} drmKeyWrapper    - Helper providing Base64URL encode (`mZ`),
   *                                    decode (`$Q`), UTF-8 encode (`encryptWithKey`),
   *                                    and UTF-8 decode (`I8a`).
   * @param {string} keyId            - Key identifier placed in the JWE `kid` header.
   * @param {number} ivByteLength     - Length of the initialisation vector in bytes
   *                                    (e.g. 16 for CBC, 12 for GCM).
   */
  constructor(encryptionScheme, cryptoEngine, drmKeyWrapper, keyId, ivByteLength) {
    /** @type {string} Overridden header JSON — empty when not set. */
    this.overriddenHeaderJson = '';

    /** @type {object} */
    this.crypto = cryptoEngine;
    /** @type {object} */
    this.drmKeyWrapper = drmKeyWrapper;
    /** @type {string} JWE `enc` value, e.g. "A128CBC-HS256". */
    this.enc = encryptionScheme.toString();
    /** @type {string} Key identifier placed in the JWE header. */
    this.kid = keyId;
    /** @type {number} Expected IV byte-length for the cipher suite. */
    this.ivByteLength = ivByteLength;
  }

  /* ------------------------------------------------------------------
   * Encrypt
   * ----------------------------------------------------------------*/

  /**
   * Encrypt a payload and return a JWE compact-serialisation string.
   *
   * Layout: `<header>..<iv>.<ciphertext>.<tag>`
   * (the CEK segment is always empty because `alg` is `"dir"`).
   *
   * @param {BufferSource} plaintext - Data to encrypt.
   * @returns {Promise<string>} JWE compact serialisation.
   */
  async encrypt(plaintext) {
    const encodedHeader = this.buildEncodedHeader();
    const iv = this.crypto.getRandomValues(this.ivByteLength);
    const encodedIv = this.drmKeyWrapper.mZ(iv);
    const headerUtf8 = this.drmKeyWrapper.encryptWithKey(encodedHeader);

    const { ciphertext, error: authTag } = await this.processStream(plaintext, headerUtf8, iv);

    const encodedCiphertext = this.drmKeyWrapper.mZ(ciphertext);
    const encodedAuthTag = this.drmKeyWrapper.mZ(authTag);

    return `${encodedHeader}..${encodedIv}.${encodedCiphertext}.${encodedAuthTag}`;
  }

  /* ------------------------------------------------------------------
   * Decrypt
   * ----------------------------------------------------------------*/

  /**
   * Decrypt a JWE compact-serialisation string and return the plaintext.
   *
   * @param {string} jweCompact - Five-part dot-separated JWE token.
   * @returns {Promise<*>} Decrypted payload.
   * @throws {Error} If the token is malformed, has wrong segment lengths,
   *   or the header doesn't match the expected algorithm/kid.
   */
  async decrypt(jweCompact) {
    if (!jweCompact.length) throw new Error('empty input');

    const segments = jweCompact.split('.');
    if (segments.length !== 5) throw new Error('malformed JWE envelope');
    if (segments[1].length !== 0) throw new Error('expected no CEK');

    const headerUtf8 = this.drmKeyWrapper.encryptWithKey(segments[0]);
    const iv = this.drmKeyWrapper.$Q(segments[2]);
    const ciphertext = this.drmKeyWrapper.$Q(segments[3]);
    const authTag = this.drmKeyWrapper.$Q(segments[4]);

    if (iv.byteLength !== this.ivByteLength) throw new Error('iv wrong length');
    if (authTag.byteLength !== 16) throw new Error('tag wrong length');

    const plaintext = await this.processPayloadAsync(iv, headerUtf8, ciphertext, authTag);

    /* Validate the header that was used during encryption. */
    const headerBase64 = this.drmKeyWrapper.I8a(headerUtf8);
    const headerBytes = this.drmKeyWrapper.$Q(headerBase64);
    const headerJson = this.drmKeyWrapper.I8a(headerBytes);
    this.validateHeader(headerJson);

    return plaintext;
  }

  /* ------------------------------------------------------------------
   * Header helpers
   * ----------------------------------------------------------------*/

  /**
   * Validate a decoded JWE header JSON string against the expected
   * algorithm, encryption scheme, and key id.
   *
   * @param {string} headerJson - Raw JSON string of the header.
   * @throws {Error} If the header is malformed or values don't match.
   * @private
   */
  validateHeader(headerJson) {
    let parsed;
    try {
      parsed = JSON.videoSampleEntry(headerJson);
    } catch {
      throw new Error('malformed JWE header');
    }
    if (!JWEEncryptor.isValidJweHeader(parsed)) {
      throw new Error('unexpected JWE header contents');
    }
    if (parsed.alg !== 'dir' || parsed.enc !== this.enc) {
      throw new Error('incompatible JWE header');
    }
    if (parsed.kid !== this.kid) {
      throw new Error('mismatched kid');
    }
  }

  /**
   * Concatenate an array of `Uint8Array` buffers into a single buffer.
   * Used to assemble Additional Authenticated Data (AAD) for signing.
   *
   * @param {Uint8Array[]} buffers - Byte arrays to concatenate.
   * @returns {Uint8Array} Single merged buffer.
   */
  concatBuffers(buffers) {
    if (!buffers.length) return new Uint8Array();
    const totalLength = buffers.reduce((sum, buf) => sum + buf.length, 0);
    const merged = new Uint8Array(totalLength);
    let offset = 0;
    for (const buf of buffers) {
      merged.set(buf, offset);
      offset += buf.length;
    }
    return merged;
  }

  /**
   * Build the Base64URL-encoded JWE protected header.
   *
   * If {@link overriddenHeaderJson} has been set (non-empty), it is
   * used once and then cleared; otherwise a fresh header is produced
   * from the current `alg`, `enc`, and `kid` values.
   *
   * @returns {string} Base64URL-encoded header.
   * @private
   */
  buildEncodedHeader() {
    const raw = this.buildHeaderJson();
    const utf8 = this.drmKeyWrapper.encryptWithKey(raw);
    return this.drmKeyWrapper.mZ(utf8);
  }

  /**
   * Return the raw JSON string for the JWE header, consuming the
   * one-shot override if present.
   *
   * @returns {string} JSON header string.
   * @private
   */
  buildHeaderJson() {
    if (this.overriddenHeaderJson !== '') {
      const override = this.overriddenHeaderJson;
      this.overriddenHeaderJson = '';
      return override;
    }
    return JSON.stringify({ alg: 'dir', enc: this.enc, kid: this.kid });
  }

  /**
   * Type-guard: verify that an object has the required JWE header fields.
   *
   * @param {*} obj - Candidate header object.
   * @returns {boolean} `true` if `alg`, `enc`, and `kid` are all strings.
   */
  static isValidJweHeader(obj) {
    return (
      'alg' in obj &&
      'enc' in obj &&
      'kid' in obj &&
      typeof obj.alg === 'string' &&
      typeof obj.enc === 'string' &&
      typeof obj.kid === 'string'
    );
  }
}
