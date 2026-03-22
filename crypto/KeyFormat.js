/**
 * @module KeyFormat
 * @description Enum of cryptographic key import/export formats used with the
 * Web Crypto API's importKey() and exportKey() methods.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#format
 * @original Module_11475
 */

/**
 * Supported key formats for Web Crypto operations.
 * @enum {string}
 */
export const KeyFormat = {
    /** Raw key bytes (symmetric keys) */
    RAW: "raw",
    /** JSON Web Key format (public or private) */
    JWK: "jwk",
    /** SubjectPublicKeyInfo format (public keys) */
    SPKI: "spki",
    /** PKCS#8 PrivateKeyInfo format (private keys) */
    PKCS8: "pkcs8",
};
