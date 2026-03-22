/**
 * @file AES_CBC_HMAC_SHA256_JWE_Cipher - JWE cipher using AES-CBC + HMAC-SHA256
 * @module crypto/AES_CBC_HMAC_SHA256_JWE_Cipher
 * @description Implements JWE (JSON Web Encryption) content encryption using the
 * AES-CBC-HMAC-SHA256 composite algorithm (A128CBC-HS256 / A256CBC-HS512).
 * Handles encryption with AES-CBC followed by HMAC-SHA256 authentication tag
 * generation, and decryption with HMAC verification before AES-CBC decryption.
 * Uses a truncated 16-byte authentication tag.
 * @original Module_88501
 */

import { JWEEncryptor } from '../crypto/JWEEncryptor.js';
import { sliceBuffer } from '../utils/BufferUtils.js';

/**
 * JWE cipher that combines AES-CBC encryption with HMAC-SHA256 authentication.
 *
 * The encrypt flow:
 *   1. AES-CBC encrypt the plaintext
 *   2. Compute HMAC-SHA256 over (AAD || IV || ciphertext || AAD_length)
 *   3. Truncate HMAC to 16 bytes for the authentication tag
 *
 * The decrypt flow:
 *   1. Recompute the HMAC and verify against the provided tag
 *   2. AES-CBC decrypt the ciphertext
 *
 * @class AesCbcHmacSha256JweCipher
 * @extends JWEEncryptor
 */
export class AesCbcHmacSha256JweCipher extends JWEEncryptor {
    /**
     * @param {*} arg1 - First base class argument
     * @param {*} arg2 - Second base class argument
     * @param {*} arg3 - Third base class argument
     * @param {*} arg4 - Fourth base class argument
     * @param {Object} aesCbcKey - AES-CBC encryption key (must have algorithm 'AES-CBC')
     * @param {Object} hmacKey - HMAC-SHA256 signing key (must have algorithm 'HMAC-SHA256')
     * @throws {Error} If key algorithms don't match expected values
     */
    constructor(arg1, arg2, arg3, arg4, aesCbcKey, hmacKey) {
        super(arg1, arg2, arg3, arg4, 16);

        if (aesCbcKey.algorithm !== 'AES-CBC') {
            throw Error('invalid AES-CBC key');
        }
        if (hmacKey.algorithm !== 'HMAC-SHA256') {
            throw Error('invalid HMAC-SHA256 key');
        }

        /** @type {Object} AES-CBC encryption/decryption key */
        this.aesCbcKey = aesCbcKey;

        /** @type {Object} HMAC-SHA256 signing key */
        this.hmacKey = hmacKey;
    }

    /**
     * Encrypt plaintext and generate authentication tag.
     *
     * @param {Uint8Array} plaintext - Data to encrypt
     * @param {Uint8Array} aad - Additional Authenticated Data
     * @param {Uint8Array} iv - Initialization vector
     * @returns {Promise<{ciphertext: Uint8Array, authTag: Uint8Array}>}
     * @throws {Error} If encryption fails
     */
    async encrypt(plaintext, aad, iv) {
        let ciphertext;
        try {
            ciphertext = await this.crypto.encryptAsync(this.aesCbcKey, iv, plaintext);
        } catch {
            throw Error('Internal encrypt error: Cipher job failed');
        }

        const authTag = await this._computeAuthTag(aad, iv, ciphertext);
        return { ciphertext, authTag };
    }

    /**
     * Verify authentication tag and decrypt ciphertext.
     *
     * @param {Uint8Array} iv - Initialization vector
     * @param {Uint8Array} aad - Additional Authenticated Data
     * @param {Uint8Array} ciphertext - Encrypted data
     * @param {Uint8Array} expectedAuthTag - Authentication tag to verify
     * @returns {Promise<Uint8Array>} Decrypted plaintext
     * @throws {Error} If HMAC verification fails or decryption fails
     */
    async decrypt(iv, aad, ciphertext, expectedAuthTag) {
        const computedTag = await this._computeAuthTag(aad, iv, ciphertext);

        if (!this._constantTimeEqual(expectedAuthTag, computedTag)) {
            throw Error('JWE is untrusted');
        }

        try {
            return await this.crypto.decryptData(this.aesCbcKey, iv, ciphertext);
        } catch {
            throw Error('Internal decrypt error: Cipher job failed');
        }
    }

    /**
     * Compute the truncated HMAC-SHA256 authentication tag.
     *
     * @private
     * @param {Uint8Array} aad - Additional Authenticated Data
     * @param {Uint8Array} iv - Initialization vector
     * @param {Uint8Array} ciphertext - The encrypted data
     * @returns {Promise<Uint8Array>} 16-byte truncated HMAC
     * @throws {Error} If HMAC computation fails
     */
    async _computeAuthTag(aad, iv, ciphertext) {
        const hmacInput = this.prepareHmacData(aad, iv, ciphertext);

        let hmacResult;
        try {
            hmacResult = await this.crypto.hmacSign(this.hmacKey, hmacInput);
        } catch {
            throw Error(AesCbcHmacSha256JweCipher.HMAC_ERROR_MESSAGE);
        }

        // Truncate to 16 bytes (128 bits)
        return sliceBuffer(hmacResult, 0, 16);
    }

    /**
     * Prepare the HMAC input data: AAD || IV || ciphertext || AAD_length_in_bits.
     *
     * @param {Uint8Array} aad - Additional Authenticated Data
     * @param {Uint8Array} iv - Initialization vector
     * @param {Uint8Array} ciphertext - The encrypted data
     * @returns {Uint8Array} Concatenated HMAC input
     */
    prepareHmacData(aad, iv, ciphertext) {
        const aadLengthBits = this._encodeBitLength((8 * aad.byteLength).valueOf());
        return this.prepareSigningData([aad, iv, ciphertext, aadLengthBits]);
    }

    /**
     * Encode a bit length as a 64-bit big-endian unsigned integer.
     *
     * @private
     * @param {number} bitLength - The length in bits
     * @returns {Uint8Array} 8-byte big-endian representation
     */
    _encodeBitLength(bitLength) {
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setUint32(4, bitLength);
        view.setUint32(0, 0);
        return new Uint8Array(view.buffer);
    }

    /**
     * Constant-time comparison of two byte arrays to prevent timing attacks.
     *
     * @private
     * @param {Uint8Array} a - First array
     * @param {Uint8Array} b - Second array
     * @returns {boolean} True if arrays are equal
     */
    _constantTimeEqual(a, b) {
        let equal = true;
        if (a.length !== b.length) {
            equal = false;
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                equal = false;
            }
        }
        return equal;
    }

    /** @type {string} Error message for HMAC failures */
    static HMAC_ERROR_MESSAGE = 'Internal hmac error: Cipher job failed';

    /** @type {string} Error message for invalid HMAC key */
    static INVALID_HMAC_KEY_MESSAGE = 'invalid HMAC key';
}

export default AesCbcHmacSha256JweCipher;
