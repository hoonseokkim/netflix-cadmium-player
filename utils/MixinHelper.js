/**
 * @file MixinHelper - Utilities for mixin/trait composition via prototype copying
 * @module utils/MixinHelper
 * @description Provides functions to copy properties between prototypes for
 * mixin-style composition. Supports copying own and inherited properties,
 * with control over overwriting existing properties.
 * @original Module_85254
 */

import { __values } from '../core/TsLib.js';
import { assert } from '../assert/Assert.js';

/** @type {string[]} Built-in Function property names to exclude from copying */
const FUNCTION_BUILTIN_PROPS = Object.getOwnPropertyNames(Function);

/**
 * Get all own property names from an object and its prototype chain
 * (up to but not including Object.prototype).
 *
 * @param {Object} obj - The object to inspect
 * @returns {string[]} All property names from the object and its prototypes
 */
function getAllPropertyNames(obj) {
    const names = Object.getOwnPropertyNames(obj);

    for (let proto = Object.getPrototypeOf(obj); proto !== Object.prototype; proto = Object.getPrototypeOf(proto)) {
        for (const name of Object.getOwnPropertyNames(proto)) {
            if (names.indexOf(name) === -1) {
                names.push(name);
            }
        }
    }

    return names;
}

/**
 * Copy property descriptors from source to target, filtered by a predicate.
 *
 * @param {Object} source - Source object to copy from
 * @param {Object} target - Target object to copy to
 * @param {boolean} overwriteExisting - Whether to overwrite existing own properties
 * @param {boolean} overwriteInherited - Whether to overwrite inherited properties
 * @param {Function} filter - Predicate that receives property name, returns boolean
 */
function copyProperties(source, target, overwriteExisting, overwriteInherited, filter) {
    Object.getOwnPropertyNames(source)
        .filter((name) => {
            return filter(name) &&
                (overwriteExisting || !Object.prototype.hasOwnProperty.call(target, name)) &&
                (overwriteInherited || !(name in target));
        })
        .forEach((name) => {
            const descriptor = Object.getOwnPropertyDescriptor(source, name);
            if (descriptor !== undefined) {
                Object.defineProperty(target, name, descriptor);
            }
        });
}

/**
 * Copy properties from a source prototype chain to a target, excluding
 * properties that already exist on the target (or its prototype chain).
 *
 * @param {Object} source - Source prototype to copy from
 * @param {Object} target - Target object to copy to
 * @param {boolean} excludeOwn - Exclude target's own properties from overwrite check
 * @param {boolean} excludeInherited - Exclude target's inherited properties from overwrite check
 */
export function copyPrototypeChain(source, target, excludeOwn, excludeInherited) {
    let excludedNames = [];
    if (!excludeOwn) {
        excludedNames = Object.getOwnPropertyNames(target);
    }
    if (!excludeInherited) {
        excludedNames = getAllPropertyNames(target);
    }

    // Recursively copy from parent prototypes first
    const parentProto = Object.getPrototypeOf(source);
    if (parentProto !== null && parentProto !== Object.prototype) {
        copyPrototypeChain(parentProto, target, excludeOwn, excludeInherited);
    }

    // Copy source's own properties (excluding constructor and already-present names)
    copyProperties(source, target, true, true, (name) => {
        return name !== 'constructor' && excludedNames.indexOf(name) === -1;
    });
}

/**
 * Apply a mixin (source class or object) to a target class.
 * Copies prototype methods and static properties.
 *
 * @param {Function|Object} source - Source class or plain object to mix in
 * @param {Function} target - Target class to receive the mixin
 * @param {boolean} [overwriteExisting=true] - Whether to overwrite existing own properties
 * @param {boolean} [overwriteInherited=true] - Whether to overwrite inherited properties
 * @returns {Function} The target class (for chaining)
 */
export function applyMixin(source, target, overwriteExisting = true, overwriteInherited = true) {
    if (!overwriteInherited) {
        assert(!overwriteExisting);
    }

    if (source.prototype) {
        // Source is a class/constructor function
        copyPrototypeChain(source.prototype, target.prototype, overwriteExisting, overwriteInherited);

        // Copy static properties (excluding Function built-ins like name, length, etc.)
        copyProperties(source, target, overwriteExisting, overwriteInherited, (name) => {
            return FUNCTION_BUILTIN_PROPS.indexOf(name) === -1;
        });
    } else {
        // Source is a plain object - copy directly to target prototype
        copyProperties(source, target.prototype, overwriteExisting, overwriteInherited, (name) => {
            return FUNCTION_BUILTIN_PROPS.indexOf(name) === -1;
        });
    }

    return target;
}

export default { copyPrototypeChain, applyMixin };
