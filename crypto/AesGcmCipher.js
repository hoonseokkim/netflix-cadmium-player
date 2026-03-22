/**
 * @module AesGcmCipher
 * @description AES-GCM encryption/decryption cipher for JWE (JSON Web Encryption).
 * Extends the base JWE encryptor to provide AES-128-GCM encrypt and decrypt
 * operations using the Web Crypto API. Splits output into ciphertext and
 * authentication tag (last 16 bytes).
 * @see Module_51708
 */

import { __extends, __awaiter, __generator } from '../core/tslib.js';
import { JWEEncryptor } from '../crypto/JWEEncryptor.js';
import { SY as sliceBuffer } from '../utils/BufferUtils.js';
import { AleScheme } from '../crypto/AleScheme.js';

/**
 * AES-GCM cipher implementation for JWE encryption/decryption.
 * Uses 128-bit AES-GCM with a 12-byte IV.
 */
export class AesGcmCipher extends JWEEncryptor {
    /**
     * @param {Object} crypto - Web Crypto API wrapper.
     * @param {ArrayBuffer} iv - Initialization vector.
     * @param {ArrayBuffer} additionalData - Additional authenticated data (AAD).
     * @param {CryptoKey} key - The AES-GCM CryptoKey.
     */
    constructor(crypto, iv, additionalData, key) {
        super(AleScheme.A128GCM, crypto, iv, additionalData, 12);
        /** @type {CryptoKey} */
        this.key = key;
    }

    /**
     * Factory method to create an AES-GCM cipher instance.
     * @param {Object} crypto - Web Crypto API wrapper.
     * @param {ArrayBuffer} iv - Initialization vector.
     * @param {ArrayBuffer} additionalData - AAD.
     * @param {CryptoKey} key - Must have algorithm "AES-GCM".
     * @returns {AesGcmCipher}
     * @throws {Error} If key algorithm is not AES-GCM.
     */
    static create(crypto, iv, additionalData, key) {
        if (key.algorithm !== 'AES-GCM') {
            throw new Error('invalid AES-GCM key');
        }
        return new AesGcmCipher(crypto, iv, additionalData, key);
    }

    /**
     * Encrypts data using AES-GCM, returning ciphertext and auth tag separately.
     * @param {ArrayBuffer} data - Plaintext data to encrypt.
     * @param {ArrayBuffer} iv - Initialization vector.
     * @param {ArrayBuffer} additionalData - AAD.
     * @returns {Promise<{ciphertext: ArrayBuffer, authTag: ArrayBuffer}>}
     * @throws {Error} If encryption fails.
     */
    async encrypt(data, iv, additionalData) {
        let result;
        try {
            result = await this.crypto.decryptAsync(this.key, additionalData, iv, data);
        } catch {
            throw new Error('Internal encrypt error: Cipher job failed');
        }

        const ciphertextLength = result.byteLength - 16;
        const ciphertext = sliceBuffer(result, 0, ciphertextLength);
        const authTag = sliceBuffer(result, ciphertextLength);

        return { ciphertext, authTag };
    }

    /**
     * Decrypts a payload using AES-GCM with additional authenticated data.
     * @param {ArrayBuffer} data - Ciphertext to decrypt.
     * @param {ArrayBuffer} iv - Initialization vector.
     * @param {ArrayBuffer} aad1 - First AAD component.
     * @param {ArrayBuffer} aad2 - Second AAD component.
     * @returns {Promise<ArrayBuffer>} Decrypted plaintext.
     * @throws {Error} If decryption fails.
     */
    async decrypt(data, iv, aad1, aad2) {
        const signingData = this.prepareSigningData([aad1, aad2]);
        try {
            return await this.crypto.deriveKeyAsync(this.key, data, iv, signingData);
        } catch {
            throw new Error('Internal decrypt error: Cipher job failed');
        }
    }
}
