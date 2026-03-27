/**
 * Netflix Cadmium Player - Type Checks
 *
 * Facade module that exposes type-checking utility functions from the
 * underlying type checker (Module_76564). Used throughout the player
 * for runtime type validation.
 *
 * @module Module_32687
 */

// import { typeChecker } from './TypeChecks.js'; // webpack module 76564

import { typeChecker } from './Module_76564.js';

/** @type {Object} The underlying type checker instance */
export const is = typeChecker;

/** Check if value is defined (not null and not undefined) */
export function isDefined(value) { return is.runChecks(value); }

/** Check if value is a non-null object */
export function isObject(value) { return is.N9(value); }

/** Check if value is a plain object (not array, not null) */
export function isPlainObject(value) { return is.YNa(value); }

/** Check if value is an Array */
export function isArray(value) { return is.SQ(value); }

/** Check if value is a TypedArray (Uint8Array, etc.) */
export function isTypedArray(value) { return is.zrb(value); }

/** Check if value is a finite number, optionally within [min, max] range */
export function isNumber(value, min, max) { return is.mapTransform(value, min, max); }

/** Check if value is a finite integer, optionally within [min, max] range */
export function isInteger(value, min, max) { return is.VOa(value, min, max); }

/** Check if value is a positive finite number, optionally within [min, max] range */
export function isPositiveNumber(value, min, max) { return is.O9(value, min, max); }

/** Check if value is a boolean */
export function isBoolean(value) { return is.t9(value); }

/** Check if value is true */
export function isTrue(value) { return is.Q$b(value); }

/** Check if value is false */
export function isFalse(value) { return is.R$b(value); }

/** Check if value is a non-empty array */
export function isNonEmptyArray(value) { return is.isNonEmptyArray(value); }

/** Check if value is a string */
export function isString(value) { return is.filterPredicate(value); }

/** Check if value is a valid time interval (finite non-negative number) */
export function isValidInterval(value) { return is.isValidInterval(value); }

/** Check if value is a RegExp */
export function isRegExp(value) { return is.isRegExp(value); }

/** Check if value is a function */
export function isFunction(value) { return is.isFunction(value); }
