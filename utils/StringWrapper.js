/**
 * @module StringWrapper
 * @description A wrapper class around a string value providing chainable
 * string comparison methods: startsWith, endsWith, contains, and equals.
 * Used for MSL/DI service identifier matching.
 *
 * @original Module 11625
 */

/**
 * Wraps a string value with convenience comparison methods.
 */
export class StringWrapper {
    /**
     * @param {string} value - The string value to wrap
     */
    constructor(value) {
        /** @type {string} The wrapped string value */
        this._value = value;
    }

    /**
     * Checks if the wrapped string starts with the given prefix.
     *
     * @param {string} prefix - The prefix to check for
     * @returns {boolean} True if the string starts with the prefix
     */
    startsWith(prefix) {
        return this._value.indexOf(prefix) === 0;
    }

    /**
     * Checks if the wrapped string ends with the given suffix.
     *
     * @param {string} suffix - The suffix to check for
     * @returns {boolean} True if the string ends with the suffix
     */
    endsWith(suffix) {
        const reversedSuffix = suffix.split("").reverse().join("");
        const reversedValue = this._value.split("").reverse().join("");
        return reversedValue.indexOf(reversedSuffix) === 0;
    }

    /**
     * Checks if the wrapped string contains the given substring.
     *
     * @param {string} substring - The substring to search for
     * @returns {boolean} True if the string contains the substring
     */
    contains(substring) {
        return this._value.indexOf(substring) !== -1;
    }

    /**
     * Checks if the wrapped string is exactly equal to the given value.
     *
     * @param {string} other - The string to compare against
     * @returns {boolean} True if the strings are equal
     */
    equals(other) {
        return this._value === other;
    }

    /**
     * Returns the underlying string value.
     *
     * @returns {string} The wrapped string
     */
    getValue() {
        return this._value;
    }
}
