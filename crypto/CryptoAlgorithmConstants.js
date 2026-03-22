/**
 * Crypto Algorithm Constants
 *
 * Defines the full set of cryptographic algorithm descriptors used by the
 * Netflix MSL (Message Security Layer) and DRM subsystems.  Each constant
 * is a WebCrypto-compatible algorithm descriptor object containing a `name`
 * and, where applicable, a `hash` sub-object.
 *
 * Also provides three classifier functions to determine whether an algorithm
 * descriptor is HMAC-based, RSA-based, or Elliptic-Curve-based.
 *
 * @module CryptoAlgorithmConstants
 * @source Module_96837
 */

/**
 * Map of algorithm descriptors keyed by internal name.
 */
export const algorithms = {
    /** AES Key Wrap */
    bja: { name: "AES-KW" },

    /** AES-CBC (block cipher) */
    XO: { name: "AES-CBC" },

    /** Elliptic Curve Diffie-Hellman key exchange */
    r0b: { name: "ECDH" },

    /** Diffie-Hellman key exchange */
    D_b: { name: "DH" },

    /** HMAC with SHA-256 */
    fX: { name: "HMAC", hash: { name: "SHA-256" } },

    /** RSA-OAEP with SHA-1 (encryption) */
    rsaAlgorithm: { name: "RSA-OAEP", hash: { name: "SHA-1" } },

    /** RSAES-PKCS1-v1_5 (legacy encryption) */
    internal_Kla: { name: "RSAES-PKCS1-v1_5" },

    /** RSASSA-PKCS1-v1_5 with SHA-1 (signing) */
    F5b: { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-1" } },

    /** AES-CMAC */
    l9a: { name: "AES-CMAC" },

    /** ECDSA with SHA-256 (signing) */
    s0b: { name: "ECDSA", hash: { name: "SHA-256" } },

    /** RSASSA-PKCS1-v1_5 with SHA-1 (alias for F5b) */
    G5b: { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-1" } },

    /** RSASSA-PKCS1-v1_5 with SHA-256 (signing) */
    X7: { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },

    /** Netflix proprietary DH variant */
    R5c: { name: "NFLX-DH" },

    /** SHA-256 digest */
    ead: { name: "SHA-256" },

    /** SHA-384 digest */
    fad: { name: "SHA-384" }
};

/**
 * Returns true if the algorithm is HMAC-based.
 * @param {Object} algorithm - Algorithm descriptor with `name`.
 * @returns {boolean}
 */
export function isHmacAlgorithm(algorithm) {
    return "HMAC" === algorithm.name;
}

/**
 * Returns true if the algorithm is RSA-based.
 * @param {Object} algorithm - Algorithm descriptor with `name`.
 * @returns {boolean}
 */
export function isRsaAlgorithm(algorithm) {
    switch (algorithm.name) {
        case algorithms.rsaAlgorithm.name:
        case algorithms.internal_Kla.name:
        case algorithms.F5b.name:
        case algorithms.G5b.name:
        case algorithms.X7.name:
            return true;
        default:
            return false;
    }
}

/**
 * Returns true if the algorithm is Elliptic-Curve-based (ECDH or ECDSA).
 * @param {Object} algorithm - Algorithm descriptor with `name`.
 * @returns {boolean}
 */
export function isEcAlgorithm(algorithm) {
    switch (algorithm.name) {
        case algorithms.r0b.name:
        case algorithms.s0b.name:
            return true;
        default:
            return false;
    }
}

export {
    algorithms as af,
    isHmacAlgorithm as XDc,
    isRsaAlgorithm as wEc,
    isEcAlgorithm as GDc
};
