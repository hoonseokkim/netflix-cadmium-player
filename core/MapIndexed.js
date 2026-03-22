/**
 * Netflix Cadmium Player - Map Indexed Utility
 * Deobfuscated from Module_67758
 *
 * Ramda-style utility that creates a function mapping over
 * a collection with both value and index available.
 * Converts the collection to an array before mapping.
 */

const _curry2 = require('./curry2');       // Module 31187
const _map = require('./internalMap');     // Module 81057
const _toArray = require('./toArray');     // Module 38695

/**
 * Maps a function over a collection, converting the collection to an
 * array first to ensure consistent indexing behavior.
 *
 * @param {Function} fn - Mapping function receiving (value, index)
 * @param {*} collection - The collection to map over
 * @returns {Array} The mapped result array
 */
const mapIndexed = _curry2(function (fn, collection) {
    return _map(_toArray(collection), fn);
});

module.exports = mapIndexed;
