/**
 * @file CollectionUtils.js
 * @description General-purpose collection utility functions: partitioning, merging,
 *   deduplication, and search across arrays and iterables.
 * @module utils/CollectionUtils
 * @original Module_45266 (zN, fWb, wAc, findByName, mergeSessionData, OJb)
 */

import { zipWith } from '../utils/ZipWith.js';        // Module 29664
import { partitionBy } from '../utils/PartitionBy.js'; // Module 31435
import { uniqueBy } from '../utils/UniqueBy.js';       // Module 60024
import { sortStable } from '../utils/SortStable.js';   // Module 56663
import { findByName as findByNameFn } from '../utils/FindByName.js'; // Module 5154

/**
 * Combines two arrays element-wise, preferring non-undefined values from the second array.
 *
 * @param {Array} base - Base array of values
 * @param {Array} overrides - Override array; non-undefined values replace base values
 * @returns {Array} Merged array
 */
export function mergeSessionData(base, overrides) {
    return zipWith((baseVal, overrideVal) => {
        return overrideVal !== undefined ? overrideVal : baseVal;
    }, base, overrides);
}

export {
    /** @function zipWith - Combines two arrays element-wise with a combiner function */
    zipWith,
    /** @function partitionBy - Splits an iterable into [matching, non-matching] by predicate */
    partitionBy,
    /** @function uniqueBy - Removes duplicate elements from an array by a comparator */
    uniqueBy,
    /** @function sortStable - Performs a stable sort on an array */
    sortStable,
    /** @function findByName - Finds an element by its name property */
    findByNameFn as findByName
};

export default {
    zipWith,
    mergeSessionData,
    partitionBy,
    uniqueBy,
    sortStable,
    findByName: findByNameFn
};
