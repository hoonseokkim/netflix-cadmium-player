/**
 * @module AleEncryptionSchemes
 * @description Enumerations for Netflix's Application Level Encryption (ALE) system.
 * Defines the supported encryption schemes, key exchange schemes, and key types
 * used in the MSL (Message Security Layer) protocol.
 *
 * @see Module_2802
 */

/**
 * ALE content encryption schemes.
 * @enum {string}
 */
export const AleScheme = {
  /** AES-128-GCM authenticated encryption */
  A128GCM: 'A128GCM',

  /** AES-128-CBC with HMAC-SHA256 */
  A128CBC_HS256: 'A128CBC-HS256',

  /** AES-128-CBC with HMAC-SHA256, Netflix-specific variant (NRD) */
  A128CBC_HS256_NRD: 'A128CBC-HS256-NRD',
};

/**
 * ALE key exchange schemes.
 * @enum {string}
 */
export const AleKeyxScheme = {
  /** Cleartext key exchange (no encryption on key transport) */
  CLEAR: 'CLEAR',

  /** RSA-OAEP with SHA-256 key wrapping */
  RSA_OAEP_256: 'RSA-OAEP-256',

  /** Authenticated Diffie-Hellman key exchange */
  AUTH_DH: 'AUTH-DH',

  /** Widevine-managed key exchange */
  WIDEVINE: 'WIDEVINE',
};

/**
 * ALE key types used in key negotiation.
 * @enum {string}
 */
export const AleKeyType = {
  /** Pre-shared key */
  PSK: 'PSK',

  /** Master generated key */
  MGK: 'MGK',

  /** Wrapped key */
  WRAP: 'WRAP',
};

/**
 * Validates whether a value is a valid ALE encryption scheme.
 * @param {string} value
 * @returns {boolean}
 */
export function isValidAleScheme(value) {
  return Object.values(AleScheme).includes(value);
}

/**
 * Validates whether a value is a valid ALE key exchange scheme.
 * @param {string} value
 * @returns {boolean}
 */
export function isValidAleKeyxScheme(value) {
  return Object.values(AleKeyxScheme).includes(value);
}
