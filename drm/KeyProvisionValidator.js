/**
 * @module KeyProvisionValidator
 * @description Validates DRM key exchange data and key provision responses.
 * Ensures that key exchange objects have the correct shape (scheme, data, kid)
 * and that key provision responses contain valid tokens, schemes, TTLs, and key data.
 * @original Module_20408
 */

import { isValidScheme, isValidProvisionScheme } from '../drm/DrmScheme'; // Module 2802

/**
 * Version number for the key exchange format.
 * @type {number}
 */
export const KEY_EXCHANGE_VERSION = 1;

/**
 * Validates whether an object is a valid key exchange data structure.
 *
 * @param {*} keyData - The object to validate
 * @returns {boolean} True if the object has valid scheme, data (object), and kid (string) properties
 */
export function isValidKeyExchangeData(keyData) {
    return (
        typeof keyData === 'object' &&
        'scheme' in keyData &&
        'data' in keyData &&
        'kid' in keyData &&
        isValidScheme(keyData.scheme) &&
        typeof keyData.kid === 'string' &&
        typeof keyData.data === 'object'
    );
}

/**
 * Parses and validates a key provision response JSON string.
 *
 * A valid key provision response must contain:
 * - token (string): The provision token
 * - scheme (string): A valid DRM provision scheme
 * - ttl (number): Time-to-live for the key
 * - keyx (object): Valid key exchange data
 * - ver (number): Version number
 * - rw (number, optional): Renewal window
 *
 * @param {string} jsonString - The JSON string to parse
 * @returns {Object} The parsed key provision response
 * @throws {Error} If the JSON is malformed or has unexpected contents
 */
export function parseKeyProvisionResponse(jsonString) {
    let parsed;
    try {
        parsed = JSON.parse(jsonString);
    } catch (e) {
        throw new Error('malformed JSON');
    }

    const response = parsed;

    const isValid =
        typeof response === 'object' &&
        'token' in response &&
        'scheme' in response &&
        'ttl' in response &&
        'keyx' in response &&
        'ver' in response &&
        typeof response.token === 'string' &&
        isValidProvisionScheme(response.scheme) &&
        typeof response.ttl === 'number';

    if (
        !isValid ||
        (response.rw !== undefined && typeof response.rw !== 'number') ||
        typeof response.keyx !== 'object' ||
        !isValidKeyExchangeData(response.keyx) ||
        typeof response.ver !== 'number'
    ) {
        throw new Error('unexpected key provision response contents');
    }

    return parsed;
}

export default {
    KEY_EXCHANGE_VERSION,
    isValidKeyExchangeData,
    parseKeyProvisionResponse
};
