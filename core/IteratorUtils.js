/**
 * Netflix Cadmium Player - Iterator Utilities
 * Deobfuscated from Module_97322
 *
 * Utility functions for working with iterators and iterables.
 * Provides helpers to get the last element of an iterator and
 * to convert iterators/iterables to arrays.
 */

/**
 * Returns the last value from an iterator by consuming it fully.
 *
 * @param {Iterator} iterator - An iterator to consume
 * @returns {*} The last value yielded by the iterator
 */
export function getLastIteratorValue(iterator) {
    let lastValue;
    let result = iterator.next();

    do {
        if (!result.done) {
            lastValue = result.value;
        }
        result = iterator.next();
    } while (!result.done);

    return lastValue;
}

/**
 * Converts an iterator or array to an array.
 * If the input is already an array, returns it directly.
 * Otherwise, consumes the iterator and collects values into an array.
 *
 * @param {Array|Iterator} iterable - An array or iterator to convert
 * @returns {Array} The resulting array
 */
export function iteratorToArray(iterable) {
    if (Array.isArray(iterable)) {
        return iterable;
    }

    const result = [];
    let item = iterable.next();

    while (!item.done) {
        result.push(item.value);
        item = iterable.next();
    }

    return result;
}
