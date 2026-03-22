/**
 * @module CryptoAlgorithms
 * @description Defines cryptographic algorithm constants and lookup utilities for
 * the MSL (Message Security Layer) protocol. Includes compression algorithms
 * (GZIP, LZW), encryption algorithms (AES/CBC, AES wrap, RSA), signature
 * algorithms (HmacSHA256, SHA256withRSA, AESCmac), and MSL error codes.
 * @see Module_51411
 */

import { TC as MslConstants } from '../msl/MslConstants.js';
import { af as WebCryptoAlgorithms } from '../crypto/WebCryptoAlgorithms.js';

/** @type {Object} MSL entity authentication capabilities. */
const entityAuthCapabilities = MslConstants.yG;

/**
 * Supported compression algorithms.
 * @enum {string}
 */
export const CompressionAlgorithm = Object.freeze({
    GZIP: 'GZIP',
    LZW: 'LZW'
});

/**
 * Selects the preferred compression algorithm from a list of supported ones.
 * @param {string[]} available - Available compression algorithms.
 * @returns {string|null} The preferred algorithm or null.
 */
export function selectCompressionAlgorithm(available) {
    const preferred = [CompressionAlgorithm.GZIP, CompressionAlgorithm.LZW];
    for (let i = 0; i < preferred.length && available.length > 0; i++) {
        for (let j = 0; j < available.length; j++) {
            if (available[j] === preferred[i]) return preferred[i];
        }
    }
    return null;
}

/**
 * Encryption algorithm registry with name-based lookup.
 * Maps between internal names and WebCrypto algorithm specs.
 * @type {Object}
 */
const EncryptionAlgorithm = {
    AES: 'AES'
};

Object.defineProperties(EncryptionAlgorithm, {
    /** Looks up an encryption algorithm by name or WebCrypto spec. */
    getByName: {
        value(algorithm) {
            let name = algorithm;
            if (typeof algorithm === 'string') name = algorithm.toLowerCase();
            if (typeof algorithm === 'object' && typeof algorithm.name === 'string') {
                name = algorithm.name.toLowerCase();
            }
            return WebCryptoAlgorithms.XO.name.toLowerCase() === name
                ? EncryptionAlgorithm.AES
                : EncryptionAlgorithm[algorithm];
        },
        writable: false, enumerable: false, configurable: false
    },
    /** Returns the WebCrypto algorithm spec for a given internal name. */
    toWebCrypto: {
        value(name) {
            if (EncryptionAlgorithm.AES === name) return WebCryptoAlgorithms.XO;
        },
        writable: false, enumerable: false, configurable: false
    }
});
Object.freeze(EncryptionAlgorithm);

/**
 * Cipher algorithm registry (AES/CBC, AES wrap, RSA).
 * @type {Object}
 */
const CipherAlgorithm = {
    AES_CBC_PKCS5: 'AES/CBC/PKCS5Padding',
    AES_WRAP: 'AESWrap',
    RSA_ECB_PKCS1: 'RSA/ECB/PKCS1Padding'
};

Object.defineProperties(CipherAlgorithm, {
    getByName: {
        value(name) {
            if (CipherAlgorithm.AES_CBC_PKCS5 === name) return CipherAlgorithm.AES_CBC_PKCS5;
            if (CipherAlgorithm.RSA_ECB_PKCS1 === name) return CipherAlgorithm.RSA_ECB_PKCS1;
            return CipherAlgorithm[name];
        },
        writable: false, enumerable: false, configurable: false
    }
});
Object.freeze(CipherAlgorithm);

/**
 * Signature algorithm registry (HmacSHA256, SHA256withRSA, AESCmac).
 * @type {Object}
 */
const SignatureAlgorithm = {
    HMAC_SHA256: 'HmacSHA256',
    SHA256_RSA: 'SHA256withRSA',
    AES_CMAC: 'AESCmac'
};

Object.defineProperties(SignatureAlgorithm, {
    /** Looks up a signature algorithm by name or WebCrypto spec. */
    getByName: {
        value(algorithm) {
            let name = algorithm;
            let hashName;
            if (typeof algorithm === 'string') name = algorithm.toLowerCase();
            if (typeof algorithm === 'object' && typeof algorithm.name === 'string') {
                name = algorithm.name.toLowerCase();
            }
            if (typeof algorithm === 'object' && typeof algorithm.hash === 'object') {
                hashName = algorithm.hash.name.toLowerCase();
            }
            if (WebCryptoAlgorithms.fX.name.toLowerCase() === name &&
                WebCryptoAlgorithms.fX.hash.name.toLowerCase() === hashName) {
                return SignatureAlgorithm.HMAC_SHA256;
            }
            if (WebCryptoAlgorithms.X7.name.toLowerCase() === name &&
                WebCryptoAlgorithms.X7.hash.name.toLowerCase() === hashName) {
                return SignatureAlgorithm.SHA256_RSA;
            }
            if (WebCryptoAlgorithms.l9a.name.toLowerCase() === name) {
                return SignatureAlgorithm.AES_CMAC;
            }
            return SignatureAlgorithm[algorithm];
        },
        writable: false, enumerable: false, configurable: false
    },
    /** Returns the WebCrypto algorithm spec for a given internal name. */
    toWebCrypto: {
        value(name) {
            if (SignatureAlgorithm.HMAC_SHA256 === name) return WebCryptoAlgorithms.fX;
            if (SignatureAlgorithm.SHA256_RSA === name) return WebCryptoAlgorithms.mKa;
            if (SignatureAlgorithm.AES_CMAC === name) return WebCryptoAlgorithms.l9a;
        },
        writable: false, enumerable: false, configurable: false
    }
});
Object.freeze(SignatureAlgorithm);

/**
 * MSL error codes enumeration.
 * @enum {number}
 */
const MslErrorCode = Object.freeze({
    ha: 1,
    fs: 2,
    zg: 3,
    $e: 4,
    o7: 5,
    zi: 6,
    ud: 7,
    m6: 8,
    TJa: 9,
    internal_Wla: 10
});

/**
 * Default export combining all algorithm registries and MSL constants.
 */
export default {
    entityAuthCapabilities,
    MAX_LONG_VALUE: 9007199254740992,
    MAX_HEADER_VERSION: 12,
    EncryptionAlgorithm,
    CipherAlgorithm,
    SignatureAlgorithm,
    ErrorCode: MslErrorCode
};
