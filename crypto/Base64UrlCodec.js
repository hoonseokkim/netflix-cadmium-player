/**
 * @file Base64UrlCodec - UTF-8 and Base64URL encoding/decoding utilities
 * @module crypto/Base64UrlCodec
 * @description Provides methods for converting between strings, Uint8Arrays,
 * and Base64URL-encoded strings. Used throughout the MSL (Message Security Layer)
 * stack for encoding keys, tokens, and payloads.
 *
 * @original Module_49217
 */

/**
 * Codec for UTF-8 string <-> Uint8Array and Base64URL <-> Uint8Array conversions.
 *
 * @class Base64UrlCodec
 */
export class Base64UrlCodec {
    /**
     * Encodes a UTF-8 string into a Uint8Array.
     *
     * @param {string} str - The string to encode
     * @returns {Uint8Array} The UTF-8 encoded bytes
     */
    stringToBytes(str) {
        return new TextEncoder().encode(str);
    }

    /**
     * Decodes a Uint8Array back into a UTF-8 string.
     *
     * @param {Uint8Array} bytes - The bytes to decode
     * @returns {string} The decoded string
     */
    bytesToString(bytes) {
        return new TextDecoder().decode(bytes);
    }

    /**
     * Encodes a Uint8Array into a Base64URL string (no padding).
     *
     * Base64URL replaces `+` with `-`, `/` with `_`, and strips trailing `=`.
     *
     * @param {Uint8Array} bytes - The bytes to encode
     * @returns {string} The Base64URL-encoded string
     */
    bytesToBase64Url(bytes) {
        return btoa(String.fromCharCode.apply(null, bytes))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/g, '');
    }

    /**
     * Decodes a Base64URL string into a Uint8Array.
     *
     * Re-adds standard Base64 padding and reverses the URL-safe character
     * substitutions before decoding.
     *
     * @param {string} base64url - The Base64URL-encoded string
     * @returns {Uint8Array} The decoded bytes
     */
    base64UrlToBytes(base64url) {
        // Restore standard Base64 characters and padding
        let base64 = base64url
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        base64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');

        const binaryString = atob(base64);
        const length = binaryString.length;
        const bytes = new Uint8Array(length);

        for (let i = 0; i < length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        return bytes;
    }
}
