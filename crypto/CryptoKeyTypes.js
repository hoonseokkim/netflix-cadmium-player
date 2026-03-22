/**
 * Crypto Key Types and Data Structures
 *
 * Defines cipher algorithm names, key types, CryptoKey wrapper class,
 * and KeyPairHolder for asymmetric key pairs used in the MSL crypto layer.
 * Re-exported from the crypto barrel module.
 *
 * @module CryptoKeyTypes
 * @original Module_78212
 */

/**
 * Supported cipher algorithm identifiers
 * @enum {string}
 */
export const CipherAlgorithm = Object.freeze({
    AES_GCM: "AES-GCM",
    AES_CBC: "AES-CBC",
    HMAC_SHA256: "HMAC-SHA256",
    RSA_OAEP: "RSA-OAEP",
    DIFFIE_HELLMAN: "DIFFIE-HELLMAN",
    DERIVE: "DERIVE",
});

/**
 * Key type identifiers
 * @enum {number}
 */
export const KeyType = Object.freeze({
    SECRET: 0,
    PRIVATE: 1,
    PUBLIC: 2,
});

/**
 * Wrapper around a Web Crypto API CryptoKey with algorithm and type metadata.
 */
export class CryptoKey {
    /**
     * @param {string} algorithm - Cipher algorithm identifier
     * @param {CryptoKey} aesKey - The underlying Web Crypto CryptoKey
     * @param {number} type - KeyType enum value
     */
    constructor(algorithm, aesKey, type) {
        /** @type {string} */
        this.algorithm = algorithm;
        /** @type {CryptoKey} */
        this.aesKey = aesKey;
        /** @type {number} */
        this.type = type;
    }

    /**
     * Creates a secret (symmetric) key wrapper.
     * @param {string} algorithm - Must be AES-GCM, AES-CBC, HMAC-SHA256, or DERIVE
     * @param {CryptoKey} rawKey - The underlying CryptoKey
     * @returns {CryptoKey}
     * @throws {Error} If algorithm is incompatible with secret keys
     */
    static createSecretKey(algorithm, rawKey) {
        if (algorithm === "RSA-OAEP" || algorithm === "DIFFIE-HELLMAN") {
            throw new Error("incompatible algorithm for secret key");
        }
        return new CryptoKey(algorithm, rawKey, KeyType.SECRET);
    }

    /**
     * Creates a private (asymmetric) key wrapper.
     * @param {string} algorithm - Must be RSA-OAEP or DIFFIE-HELLMAN
     * @param {CryptoKey} rawKey - The underlying CryptoKey
     * @returns {CryptoKey}
     * @throws {Error} If algorithm is incompatible with private keys
     */
    static createPrivateKey(algorithm, rawKey) {
        if (algorithm !== "RSA-OAEP" && algorithm !== "DIFFIE-HELLMAN") {
            throw new Error("incompatible algorithm for private key");
        }
        return new CryptoKey(algorithm, rawKey, KeyType.PRIVATE);
    }

    /**
     * Creates a public (asymmetric) key wrapper.
     * @param {string} algorithm - Must be RSA-OAEP or DIFFIE-HELLMAN
     * @param {CryptoKey} rawKey - The underlying CryptoKey
     * @returns {CryptoKey}
     * @throws {Error} If algorithm is incompatible with public keys
     */
    static createPublicKey(algorithm, rawKey) {
        if (algorithm !== "RSA-OAEP" && algorithm !== "DIFFIE-HELLMAN") {
            throw new Error("incompatible algorithm for public key");
        }
        return new CryptoKey(algorithm, rawKey, KeyType.PUBLIC);
    }
}

/**
 * Holds an asymmetric key pair (private + public), validating type and algorithm consistency.
 */
export class KeyPairHolder {
    /**
     * @param {CryptoKey} privateKey - Must have type PRIVATE
     * @param {CryptoKey} publicKey - Must have type PUBLIC
     * @throws {Error} If key types or algorithms don't match
     */
    constructor(privateKey, publicKey) {
        if (privateKey.type !== KeyType.PRIVATE) {
            throw new Error("wrong key type for private key");
        }
        if (publicKey.type !== KeyType.PUBLIC) {
            throw new Error("wrong key type for public key");
        }
        if (privateKey.algorithm !== publicKey.algorithm) {
            throw new Error("algorithm mismatch between public and private key");
        }

        /** @type {string} */
        this.algorithm = privateKey.algorithm;
        /** @type {CryptoKey} */
        this.privateKey = privateKey;
        /** @type {CryptoKey} */
        this.publicKey = publicKey;
    }
}
