/**
 * Netflix Cadmium Player - Type Detector
 * Deobfuscated from Module_96222
 *
 * Returns a string representation of the type of a value.
 * Similar to Ramda's R.type() - identifies Null, Undefined, Object,
 * Number, Boolean, and String types.
 */

const isPlainObject = require('./isPlainObject'); // Module 5158

/**
 * Detects and returns the type name of the given value.
 *
 * @param {*} value - The value to detect the type of
 * @returns {string} The type name: "Null", "Undefined", "Object", "Number", "Boolean", or "String"
 */
module.exports = function typeDetector(value) {
    if (value === null) return "Null";
    if (typeof value === "undefined") return "Undefined";
    if (isPlainObject(value)) return "Object";
    if (typeof value === "number") return "Number";
    if (typeof value === "boolean") return "Boolean";
    if (typeof value === "string") return "String";
};
