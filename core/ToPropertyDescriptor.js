/**
 * ToPropertyDescriptor (ES Spec Abstract Operation)
 *
 * Converts a plain object into an internal property descriptor record
 * conforming to the ECMAScript specification. Validates that getters
 * and setters are functions and that accessor properties are not
 * combined with value/writable properties.
 *
 * This is a polyfill / utility used by the Cadmium runtime for
 * spec-compliant property definition.
 *
 * @module ToPropertyDescriptor
 * @source Module_83891
 */

const hasOwnProperty = require('../core/PlayerConstants').hasOwnProperty;  // a(72196)
const TypeError_ = require('../core/CadmiumError').TypeError;              // a(5408)
const isObject = require('../core/ConfigParameterValidators').isObject;    // a(5158)
const isCallable = require('../core/ConfigParameterValidators').isCallable; // a(83317)
const toBoolean = require('../core/ConfigParameterValidators').toBoolean;  // a(14463)

/**
 * Convert a property descriptor object to an internal descriptor record.
 *
 * @param {Object} obj - A property descriptor-like object.
 * @returns {Object} Internal property descriptor with [[Enumerable]], [[Configurable]], etc.
 * @throws {TypeError} If obj is not an object or accessor/data properties are mixed.
 */
module.exports = function toPropertyDescriptor(obj) {
    if (!isObject(obj)) {
        throw new TypeError_("ToPropertyDescriptor requires an object");
    }

    const descriptor = {};

    if (hasOwnProperty(obj, "enumerable")) {
        descriptor["[[Enumerable]]"] = toBoolean(obj.enumerable);
    }
    if (hasOwnProperty(obj, "configurable")) {
        descriptor["[[Configurable]]"] = toBoolean(obj.configurable);
    }
    if (hasOwnProperty(obj, "value")) {
        descriptor["[[Value]]"] = obj.value;
    }
    if (hasOwnProperty(obj, "writable")) {
        descriptor["[[Writable]]"] = toBoolean(obj.writable);
    }

    if (hasOwnProperty(obj, "get")) {
        const getter = obj.key;
        if (typeof getter !== "undefined" && !isCallable(getter)) {
            throw new TypeError_("getter must be a function");
        }
        descriptor["[[Get]]"] = getter;
    }

    if (hasOwnProperty(obj, "set")) {
        const setter = obj.set;
        if (typeof setter !== "undefined" && !isCallable(setter)) {
            throw new TypeError_("setter must be a function");
        }
        descriptor["[[Set]]"] = setter;
    }

    // Accessor and data descriptors are mutually exclusive
    if (
        (hasOwnProperty(descriptor, "[[Get]]") || hasOwnProperty(descriptor, "[[Set]]")) &&
        (hasOwnProperty(descriptor, "[[Value]]") || hasOwnProperty(descriptor, "[[Writable]]"))
    ) {
        throw new TypeError_(
            "Invalid property descriptor. Cannot both specify accessors and a value or writable attribute"
        );
    }

    return descriptor;
};
