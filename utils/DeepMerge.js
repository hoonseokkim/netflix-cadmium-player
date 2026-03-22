/**
 * @module DeepMerge
 * @description Performs a deep/recursive merge of two objects. When both values
 *              at a given key are plain objects, merges them recursively; otherwise
 *              uses the provided merge function to resolve the value.
 *              Part of the Ramda-style functional utility chain.
 *              Original: Module_29924
 */

import curry from '../utils/Curry'; // Module 20239
import isPlainObject from '../utils/IsPlainObject'; // Module 78678
import mergeWith from '../utils/MergeWith'; // Module 48796

/**
 * Recursively merges two objects. When both sides of a key are objects,
 * the merge recurses into them. Otherwise, the provided merge function
 * determines which value wins.
 *
 * @param {Function} mergeFn - Function(key, leftVal, rightVal) to resolve conflicts
 * @param {Object} left - Left/base object
 * @param {Object} right - Right/override object
 * @returns {Object} Deeply merged result
 */
const deepMergeWith = curry(function deepMergeWith(mergeFn, left, right) {
    return mergeWith(function (key, leftVal, rightVal) {
        if (isPlainObject(leftVal) && isPlainObject(rightVal)) {
            return deepMergeWith(mergeFn, leftVal, rightVal);
        }
        return mergeFn(key, leftVal, rightVal);
    }, left, right);
});

export default deepMergeWith;
