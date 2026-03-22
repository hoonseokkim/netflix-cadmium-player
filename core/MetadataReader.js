/**
 * @module MetadataReader
 * @description Reads dependency injection metadata from classes using the Reflect
 * metadata API. Extracts constructor parameter types and tagged metadata
 * for the IoC (Inversion of Control) container.
 *
 * @original Module 11499
 */

import { INJECT_METADATA_KEY, TAGGED_METADATA_KEY, MULTI_INJECT_METADATA_KEY } from '../core/MetadataKeys.js';

/**
 * Reads reflection-based metadata from injectable classes.
 * Used by the dependency injection container to resolve constructor parameters.
 */
export class MetadataReader {
    /**
     * Reads constructor metadata for a given target class, including
     * parameter types and tagged injections.
     *
     * @param {Function} target - The class constructor to read metadata from
     * @returns {{ constructorParams: Array, taggedParams: Object }}
     *   constructorParams - Array of constructor parameter type identifiers
     *   taggedParams - Object mapping parameter indices to tag metadata
     */
    getConstructorMetadata(target) {
        const constructorParams = Reflect.getMetadata(INJECT_METADATA_KEY, target);
        const taggedParams = Reflect.getMetadata(TAGGED_METADATA_KEY, target);
        return {
            constructorParams,
            taggedParams: taggedParams || {}
        };
    }

    /**
     * Reads multi-injection metadata for a given target class.
     * Multi-inject allows injecting all implementations of a given service identifier.
     *
     * @param {Function} target - The class constructor to read metadata from
     * @returns {Array} Array of multi-injection metadata entries
     */
    getMultiInjectMetadata(target) {
        return Reflect.getMetadata(MULTI_INJECT_METADATA_KEY, target) || [];
    }
}
