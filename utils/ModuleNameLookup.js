/**
 * @file ModuleNameLookup - Utilities for finding modules by name
 * @module utils/ModuleNameLookup
 * @description Provides helper functions for flattening module lists and
 * looking up modules by name. Used internally by the player's module
 * registration and dependency resolution system.
 * @original Module_88195
 */

import { findByName } from '../utils/NameMatcher.js';

/**
 * Flatten a nested array of module names and map each to an object with
 * a `name` property plus optional additional properties.
 *
 * @param {Array<string|string[]>} modules - Array (possibly nested) of module names
 * @param {Object} [extraProps] - Additional properties to merge into each entry
 * @returns {Array<{name: string}>} Flat array of module descriptor objects
 *
 * @example
 *   flattenAndMap([['audio', 'video'], 'text'], { required: true })
 *   // => [{ name: 'audio', required: true }, { name: 'video', required: true }, { name: 'text', required: true }]
 */
export function flattenAndMap(modules, extraProps) {
    return [].concat.apply([], Array.from(modules)).map((name) => {
        return Object.assign({ name }, extraProps ?? {});
    });
}

/**
 * Look up one or more module descriptors by name from a collection.
 *
 * @param {Array<{name: string}>} collection - The collection to search
 * @param {...string} names - One or more names to find
 * @returns {*} The matched module descriptor(s)
 */
export function lookupByName(collection, ...names) {
    return findByName(
        (entry, name) => entry.name === name,
        collection,
        names
    );
}

export default { flattenAndMap, lookupByName };
