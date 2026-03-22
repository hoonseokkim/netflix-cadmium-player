/**
 * Netflix Cadmium Player — DrmSessionManager
 *
 * Manages the lifecycle of a single DRM / MSL session.  Each session
 * carries a token, an expiration window, and a crypto engine (cipher)
 * used to encrypt and decrypt payloads within that window.
 *
 * The manager enforces time-based validity: once the session has
 * expired, any encrypt/decrypt call will throw.
 *
 * @module drm/DrmSessionManager
 */

/** Tolerance in milliseconds when comparing "now" against a deadline. */
const TIME_TOLERANCE_MS = 1000;

export class DrmSessionManager {
  /**
   * @param {string} token              - Opaque session/renewal token.
   * @param {Date}   expirationTime     - When the session keys expire.
   * @param {Date}   validityStartTime  - Earliest time the session may be used.
   * @param {object} cryptoEngine       - Cipher instance (encrypt / decrypt).
   * @param {object} drmKeyWrapper      - Helper for UTF-8 encode (`encryptWithKey`)
   *                                      and decode (`I8a`).
   */
  constructor(token, expirationTime, validityStartTime, cryptoEngine, drmKeyWrapper) {
    /** @type {string} */
    this.token = token;
    /** @type {object} */
    this.cryptoEngine = cryptoEngine;
    /** @type {object} */
    this.drmKeyWrapper = drmKeyWrapper;

    const now = new Date();

    /** @type {Date} Clamped so it is never in the past. */
    this.sessionExpirationTime = expirationTime < now ? now : expirationTime;

    /** @type {Date} Clamped between now and expiration. */
    this.sessionValidityStart = validityStartTime < now ? now : validityStartTime;
    if (this.sessionValidityStart > this.sessionExpirationTime) {
      this.sessionValidityStart = this.sessionExpirationTime;
    }
  }

  /* ------------------------------------------------------------------
   * Decrypt
   * ----------------------------------------------------------------*/

  /**
   * Decrypt raw ciphertext bytes using the session cipher.
   *
   * @param {BufferSource} ciphertext - Encrypted data.
   * @returns {Promise<*>} Decrypted payload (bytes or JWE result).
   * @throws {Error} If the session has expired.
   */
  async decrypt(ciphertext) {
    this.assertSessionNotExpired();
    return this.cryptoEngine.decrypt(ciphertext);
  }

  /**
   * Decrypt ciphertext and then UTF-8–decode the result to a string.
   *
   * @param {BufferSource} ciphertext - Encrypted data.
   * @returns {Promise<string>} Decrypted UTF-8 string.
   * @throws {Error} If the session has expired.
   */
  async decryptToString(ciphertext) {
    this.assertSessionNotExpired();
    const decrypted = await this.cryptoEngine.decrypt(ciphertext);
    return this.drmKeyWrapper.I8a(decrypted);
  }

  /* ------------------------------------------------------------------
   * Encrypt
   * ----------------------------------------------------------------*/

  /**
   * Encrypt data using the session cipher.  If `data` is a string it is
   * first UTF-8 encoded; otherwise it is passed through as-is.
   *
   * @param {string|BufferSource} data - Plaintext to encrypt.
   * @returns {Promise<*>} Encrypted result.
   * @throws {Error} If the session has expired.
   */
  async encrypt(data) {
    this.assertSessionNotExpired();
    const payload = typeof data === 'string'
      ? this.drmKeyWrapper.encryptWithKey(data)
      : data;
    return this.cryptoEngine.encrypt(payload);
  }

  /**
   * UTF-8 encode a string and encrypt it with the session cipher.
   *
   * @param {string} text - Plaintext string.
   * @returns {Promise<*>} Encrypted result.
   * @throws {Error} If the session has expired.
   */
  async encryptString(text) {
    this.assertSessionNotExpired();
    const utf8Bytes = this.drmKeyWrapper.encryptWithKey(text);
    return this.cryptoEngine.encrypt(utf8Bytes);
  }

  /* ------------------------------------------------------------------
   * Session validity
   * ----------------------------------------------------------------*/

  /**
   * Return the session expiration timestamp.
   *
   * @returns {Date}
   */
  getExpirationTime() {
    return this.sessionExpirationTime;
  }

  /**
   * Check whether the session validity-start time has been reached.
   * Returns `true` once "now" is at or past the start time (within
   * the 1-second tolerance).
   *
   * @returns {boolean}
   */
  isSessionValid() {
    return this.hasTimeElapsed(this.sessionValidityStart);
  }

  /* ------------------------------------------------------------------
   * Internal helpers
   * ----------------------------------------------------------------*/

  /**
   * Throw if the session has expired.
   *
   * @throws {Error} `"session expired"` when the current time is at or
   *   past the expiration deadline.
   * @private
   */
  assertSessionNotExpired() {
    if (this.hasTimeElapsed(this.sessionExpirationTime)) {
      throw new Error('session expired');
    }
  }

  /**
   * Determine whether a given deadline has been reached (or is within
   * the 1-second tolerance window).
   *
   * @param {Date} deadline - The point in time to compare against.
   * @returns {boolean} `true` if "now" >= deadline (within tolerance).
   * @private
   */
  hasTimeElapsed(deadline) {
    const nowMs = Date.now();
    const deadlineMs = deadline.getTime();
    return Math.abs(nowMs - deadlineMs) <= TIME_TOLERANCE_MS || nowMs >= deadlineMs;
  }
}
