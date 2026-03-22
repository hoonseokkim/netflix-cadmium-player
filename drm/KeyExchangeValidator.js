/**
 * Key Exchange Validator
 *
 * Validates the structure of DRM key exchange data, ensuring that scheme,
 * type, and keyx fields conform to expected formats. Used during MSL
 * (Message Security Layer) key exchange negotiation.
 *
 * @module KeyExchangeValidator
 * @original Module_80462
 */

// import { isValidScheme, isValidSchemeVersion } from './DrmScheme';

/**
 * Current key exchange data version
 * @type {number}
 */
export const KEY_EXCHANGE_VERSION = 1;

/**
 * Validates a key exchange data object.
 * Checks that it has valid ver, scheme, type, and keyx fields.
 *
 * @param {Object} keyExchangeData
 * @returns {boolean}
 */
export function isValidKeyExchangeData(keyExchangeData) {
    return typeof keyExchangeData === "object" &&
        ("ver" in keyExchangeData) &&
        ("scheme" in keyExchangeData) &&
        ("type" in keyExchangeData) &&
        ("keyx" in keyExchangeData) &&
        isValidSchemeVersion(keyExchangeData.scheme) &&
        typeof keyExchangeData.type === "string" &&
        isValidKeyExchangePayload(keyExchangeData.keyx);
}

/**
 * Validates a key exchange payload (keyx field).
 * Must be an object with a valid "scheme" field and optional "data" object.
 *
 * @param {Object} payload
 * @returns {boolean}
 */
export function isValidKeyExchangePayload(payload) {
    return typeof payload === "object" &&
        ("scheme" in payload) &&
        isValidScheme(payload.scheme) &&
        (!("data" in payload) || typeof payload.data === "object");
}
