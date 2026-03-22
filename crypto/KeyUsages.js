/**
 * @module KeyUsages
 * @description Web Crypto API key usage mappings for different cryptographic operations.
 * Maps operation names to their required KeyUsage arrays as used by SubtleCrypto methods.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey
 * @original Module 10558
 */

/**
 * Maps cryptographic operation names to their corresponding Web Crypto API KeyUsage arrays.
 *
 * @type {Record<string, string[]>}
 */
export const KEY_USAGES = {
    /** Full key agreement: both encrypt and decrypt */
    fka: ["encrypt", "decrypt"],

    /** Encryption only */
    encrypt: ["encrypt"],

    /** Decryption only */
    decrypt: ["decrypt"],

    /** Key wrapping: both wrap and unwrap */
    wrapUnwrap: ["wrap", "unwrap"],

    /** Key wrapping only */
    wrap: ["wrap"],

    /** Key unwrapping only */
    unwrap: ["unwrap"],

    /** Signing: both sign and verify */
    signVerify: ["sign", "verify"],

    /** Signing only */
    sign: ["sign"],

    /** Verification only */
    verify: ["verify"],

    /** Key derivation */
    deriveKey: ["deriveKey"]
};
