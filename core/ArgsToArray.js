/**
 * Netflix Cadmium Player - Arguments to Array Utility
 * Deobfuscated from Module_72849
 *
 * Functional utility that wraps a function so its arguments
 * are collected into an array (variadic to array conversion).
 * Uses Ramda-style currying pattern.
 */

const _curry1 = require('./curry1');  // Module 16805
const _arity = require('./arity');    // Module 57301

/**
 * Creates a function that collects all arguments into an array
 * and passes them as a single argument to the wrapped function.
 *
 * @param {Function} fn - The function to wrap
 * @returns {Function} A new function that collects arguments into an array
 */
const argsToArray = _curry1(function (fn) {
    return _arity(function () {
        return Array.prototype.slice.call(arguments, 0);
    }, fn);
});

module.exports = argsToArray;
