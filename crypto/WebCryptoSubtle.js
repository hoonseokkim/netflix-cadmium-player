/**
 * Netflix Cadmium Player — WebCryptoSubtle
 *
 * Unified wrapper around the Web Crypto API (`SubtleCrypto`) that handles
 * different browser implementations and API versions:
 *   - Standard `window.crypto.subtle`
 *   - Legacy `window.msCrypto.subtle` (IE11)
 *   - Legacy `window.crypto.webkitSubtle`
 *   - Legacy prefixed APIs that use events instead of Promises
 *
 * Each crypto operation (encrypt, decrypt, sign, verify, digest,
 * generateKey, deriveKey, deriveBits, importKey, exportKey, wrapKey,
 * unwrapKey) is dispatched through a version-aware switch that accounts
 * for API differences across browser implementations.
 *
 * @module crypto/WebCryptoSubtle
 * @original Module_50441
 */

import { __importDefault } from 'tslib'; // Module 22970
// import { kl } from './KeyFormat';           // Module 11475
// import PromiseLib from './Promise';         // Module 90122
// import { eD } from './Encoding';            // Module 69193
// import DerKeyUtils from './DerKeyUtils';    // Module 69763

/**
 * Enumeration of Web Crypto API versions detected across browsers.
 * @enum {number}
 */
export const WebCryptoVersion = {
    /** Legacy IE11 msCrypto (event-based) */
    MS_CRYPTO: 1,
    /** Standard crypto.subtle (version 2) */
    STANDARD_V2: 2,
    /** Webkit prefixed crypto (version 3) */
    WEBKIT_PREFIXED: 3,
    /** Legacy webkit with different key format handling */
    WEBKIT_LEGACY: 4,
    /** Standard crypto.subtle (version 5) */
    STANDARD_V5: 5,
    /** Default / auto-detected version */
    DEFAULT: 3,
};

/** @type {number} Current detected Web Crypto API version */
let currentVersion = WebCryptoVersion.DEFAULT;

/** @type {SubtleCrypto|null} Reference to the platform's SubtleCrypto implementation */
let subtleCrypto = null;

/**
 * Set the active Web Crypto API version.
 * @param {number} version - One of {@link WebCryptoVersion} values
 */
export function setWebCryptoVersion(version) {
    currentVersion = version;
}

/**
 * Get the current Web Crypto API version.
 * @returns {number} Current version
 */
export function getWebCryptoVersion() {
    return currentVersion;
}

/**
 * Override the SubtleCrypto implementation used by all operations.
 * @param {SubtleCrypto} implementation - Custom SubtleCrypto instance
 */
export function setSubtleCrypto(implementation) {
    subtleCrypto = implementation;
}

/**
 * Normalize an extractable flag: undefined becomes false.
 * @param {boolean|undefined} value
 * @returns {boolean}
 */
function normalizeExtractable(value) {
    return typeof value === 'undefined' ? false : value;
}

/**
 * Normalize key usages array, translating legacy "wrap"/"unwrap"
 * to "wrapKey"/"unwrapKey" for webkit-prefixed implementations.
 * @param {string[]} usages
 * @returns {string[]}
 */
function normalizeKeyUsages(usages) {
    if (usages && usages.length) {
        if (
            currentVersion === WebCryptoVersion.WEBKIT_PREFIXED ||
            currentVersion === WebCryptoVersion.WEBKIT_LEGACY
        ) {
            return usages.map((usage) => {
                if (usage === 'wrap') return 'wrapKey';
                if (usage === 'unwrap') return 'unwrapKey';
                return usage;
            });
        }
        return usages;
    }
    // Default to all usages
    if (
        currentVersion === WebCryptoVersion.WEBKIT_PREFIXED ||
        currentVersion === WebCryptoVersion.WEBKIT_LEGACY
    ) {
        return 'encrypt decrypt sign verify deriveKey wrapKey unwrapKey'.split(' ');
    }
    return 'encrypt decrypt sign verify deriveKey wrap unwrap'.split(' ');
}

/**
 * Wrap a possibly event-based crypto operation result into a Promise.
 * Handles both Promise-returning (modern) and event-based (IE11) APIs.
 * @param {Promise|CryptoOperation} operation
 * @returns {Promise}
 */
function wrapAsPromise(operation) {
    if (operation.then) return operation;
    return new Promise((resolve, reject) => {
        operation.oncomplete = (event) => {
            resolve(event.target.result);
        };
        operation.onerror = (event) => {
            reject(event);
        };
    });
}

// --- Auto-detect SubtleCrypto on load ---
if (typeof Da !== 'undefined') {
    if (Da.msCrypto) {
        subtleCrypto = Da.msCrypto.subtle;
        currentVersion = WebCryptoVersion.MS_CRYPTO;
    } else if (Da.crypto) {
        if (Da.crypto.webkitSubtle) {
            subtleCrypto = Da.crypto.webkitSubtle;
            currentVersion = WebCryptoVersion.WEBKIT_LEGACY;
        } else if (Da.crypto.subtle) {
            subtleCrypto = Da.crypto.subtle;
        } else {
            throw new ReferenceError(
                'Expected window.crypto.subtle but it was undefined. ' +
                'It may be unavailable if running in an insecure context.'
            );
        }
    }
}

/**
 * Unified SubtleCrypto facade that normalizes across browser implementations.
 * @namespace
 */
export const subtleCryptoFacade = {
    /**
     * Encrypt data using the specified algorithm and key.
     * @param {AlgorithmIdentifier} algorithm
     * @param {CryptoKey} key
     * @param {BufferSource} data
     * @returns {Promise<ArrayBuffer>}
     */
    encrypt(algorithm, key, data) {
        return wrapAsPromise(subtleCrypto.encrypt(algorithm, key, data));
    },

    /**
     * Decrypt data using the specified algorithm and key.
     * @param {AlgorithmIdentifier} algorithm
     * @param {CryptoKey} key
     * @param {BufferSource} data
     * @returns {Promise<ArrayBuffer>}
     */
    decrypt(algorithm, key, data) {
        return wrapAsPromise(subtleCrypto.decrypt(algorithm, key, data));
    },

    /**
     * Sign data using the specified algorithm and key.
     * @param {AlgorithmIdentifier} algorithm
     * @param {CryptoKey} key
     * @param {BufferSource} data
     * @returns {Promise<ArrayBuffer>}
     */
    sign(algorithm, key, data) {
        return wrapAsPromise(subtleCrypto.sign(algorithm, key, data));
    },

    /**
     * Verify a signature using the specified algorithm and key.
     * @param {AlgorithmIdentifier} algorithm
     * @param {CryptoKey} key
     * @param {BufferSource} signature
     * @param {BufferSource} data
     * @returns {Promise<boolean>}
     */
    verify(algorithm, key, signature, data) {
        return wrapAsPromise(subtleCrypto.verify(algorithm, key, signature, data));
    },

    /**
     * Generate a cryptographic digest of the data.
     * @param {AlgorithmIdentifier} algorithm
     * @param {BufferSource} data
     * @returns {Promise<ArrayBuffer>}
     */
    digest(algorithm, data) {
        return wrapAsPromise(subtleCrypto.digest(algorithm, data));
    },

    /**
     * Generate a new cryptographic key or key pair.
     * @param {AlgorithmIdentifier} algorithm
     * @param {boolean} extractable
     * @param {string[]} keyUsages
     * @returns {Promise<CryptoKey|CryptoKeyPair>}
     */
    generateKey(algorithm, extractable, keyUsages) {
        extractable = normalizeExtractable(extractable);
        keyUsages = normalizeKeyUsages(keyUsages);
        return wrapAsPromise(subtleCrypto.generateKey(algorithm, extractable, keyUsages));
    },

    /**
     * Derive a new key from a base key.
     * @param {AlgorithmIdentifier} algorithm
     * @param {CryptoKey} baseKey
     * @param {AlgorithmIdentifier} derivedKeyAlgorithm
     * @param {boolean} extractable
     * @param {string[]} keyUsages
     * @returns {Promise<CryptoKey>}
     */
    deriveKey(algorithm, baseKey, derivedKeyAlgorithm, extractable, keyUsages) {
        extractable = normalizeExtractable(extractable);
        keyUsages = normalizeKeyUsages(keyUsages);
        return wrapAsPromise(
            subtleCrypto.deriveKey(algorithm, baseKey, derivedKeyAlgorithm, extractable, keyUsages)
        );
    },

    /**
     * Derive bits from a base key.
     * @param {AlgorithmIdentifier} algorithm
     * @param {CryptoKey} baseKey
     * @param {number} length
     * @returns {Promise<ArrayBuffer>}
     */
    deriveBits(algorithm, baseKey, length) {
        return wrapAsPromise(subtleCrypto.deriveBits(algorithm, baseKey, length));
    },

    /**
     * Import a key from external representation.
     * Handles DER-to-JWK conversion for webkit legacy implementations.
     * @param {string} format - "raw", "pkcs8", "spki", or "jwk"
     * @param {BufferSource|JsonWebKey} keyData
     * @param {AlgorithmIdentifier} algorithm
     * @param {boolean} extractable
     * @param {string[]} keyUsages
     * @returns {Promise<CryptoKey>}
     */
    importKey(format, keyData, algorithm, extractable, keyUsages) {
        extractable = normalizeExtractable(extractable);
        keyUsages = normalizeKeyUsages(keyUsages);

        if (currentVersion === WebCryptoVersion.WEBKIT_LEGACY) {
            // Webkit legacy requires JWK format; convert DER if needed
            if (format === 'pkcs8' || format === 'spki') {
                const algorithmName = DerKeyUtils.getAlgorithmName(algorithm);
                const usageFlags = DerKeyUtils.getUsageFlags(keyUsages);
                const jwk = DerKeyUtils.derToJwk(keyData, algorithmName, usageFlags, extractable);
                if (!jwk) {
                    throw new Error('Could not make valid JWK from DER input');
                }
                const jwkString = JSON.stringify(jwk);
                const operation = subtleCrypto.importKey(
                    'jwk',
                    Encoding.stringToBytes(jwkString),
                    algorithm,
                    extractable,
                    keyUsages
                );
                return wrapAsPromise(operation);
            }
        }

        return wrapAsPromise(
            subtleCrypto.importKey(format, keyData, algorithm, extractable, keyUsages)
        );
    },

    /**
     * Export a key to external representation.
     * Handles JWK-to-DER conversion for webkit legacy implementations.
     * @param {string} format - "raw", "pkcs8", "spki", or "jwk"
     * @param {CryptoKey} key
     * @returns {Promise<ArrayBuffer|JsonWebKey>}
     */
    exportKey(format, key) {
        if (currentVersion === WebCryptoVersion.WEBKIT_LEGACY) {
            if (format === 'pkcs8' || format === 'spki') {
                return wrapAsPromise(subtleCrypto.exportKey('jwk', key)).then((result) => {
                    const jwkString = Encoding.bytesToString(new Uint8Array(result));
                    const jwk = JSON.parse(jwkString);
                    const derResult = DerKeyUtils.jwkToDer(jwk);
                    if (!derResult) {
                        throw new Error('Could not make valid DER from JWK input');
                    }
                    return derResult.der.buffer;
                });
            }
        }

        return wrapAsPromise(subtleCrypto.exportKey(format, key));
    },

    /**
     * Wrap (encrypt) a key for export.
     * @param {string} format
     * @param {CryptoKey} key
     * @param {CryptoKey} wrappingKey
     * @param {AlgorithmIdentifier} wrapAlgorithm
     * @returns {Promise<ArrayBuffer>}
     */
    wrapKey(format, key, wrappingKey, wrapAlgorithm) {
        let operation;
        switch (currentVersion) {
            case WebCryptoVersion.MS_CRYPTO:
            case WebCryptoVersion.STANDARD_V5:
                // These versions don't take format parameter
                operation = subtleCrypto.wrapKey(key, wrappingKey, wrapAlgorithm);
                break;
            case WebCryptoVersion.STANDARD_V2:
            case WebCryptoVersion.WEBKIT_PREFIXED:
            case WebCryptoVersion.WEBKIT_LEGACY:
                operation = subtleCrypto.wrapKey(format, key, wrappingKey, wrapAlgorithm);
                break;
            default:
                throw new Error(`Unsupported Web Crypto version ${currentVersion}.`);
        }
        return wrapAsPromise(operation);
    },

    /**
     * Unwrap (decrypt) an imported key.
     * @param {string} format
     * @param {BufferSource} wrappedKey
     * @param {CryptoKey} unwrappingKey
     * @param {AlgorithmIdentifier} unwrapAlgorithm
     * @param {AlgorithmIdentifier} unwrappedKeyAlgorithm
     * @param {boolean} extractable
     * @param {string[]} keyUsages
     * @returns {Promise<CryptoKey>}
     */
    unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages) {
        let operation;
        switch (currentVersion) {
            case WebCryptoVersion.MS_CRYPTO:
                operation = subtleCrypto.unwrapKey(
                    wrappedKey,
                    unwrappedKeyAlgorithm,
                    unwrappingKey
                );
                break;
            case WebCryptoVersion.STANDARD_V2:
            case WebCryptoVersion.WEBKIT_PREFIXED:
            case WebCryptoVersion.WEBKIT_LEGACY:
            case WebCryptoVersion.STANDARD_V5:
                extractable = normalizeExtractable(extractable);
                keyUsages = normalizeKeyUsages(keyUsages);
                operation = subtleCrypto.unwrapKey(
                    format,
                    wrappedKey,
                    unwrappingKey,
                    unwrapAlgorithm,
                    unwrappedKeyAlgorithm,
                    extractable,
                    keyUsages
                );
                break;
            default:
                throw new Error(`Unsupported Web Crypto version ${currentVersion}.`);
        }
        return wrapAsPromise(operation);
    },
};
