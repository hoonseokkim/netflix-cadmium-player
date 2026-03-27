/**
 * @module TypeCheckers
 * @description Re-exports type-checking utility functions from the core
 * type-checking service. Provides predicates for validating data types,
 * arrays, intervals, and performing type-safe transformations.
 * @origin Module_32687
 */

import { TypeCheckService } from '../types/TypeCheckService.js';

/**
 * The underlying type check service instance.
 * @type {TypeCheckService}
 */
export const typeChecker = TypeCheckService;

/**
 * Runs validation checks on the given value.
 * @param {*} value
 * @returns {boolean}
 */
export function runChecks(value) {
  return typeChecker.runChecks(value);
}

/**
 * Checks if value satisfies the N9 predicate (e.g. non-null object).
 * @param {*} value
 * @returns {boolean}
 */
export function isNonNullObject(value) {
  return typeChecker.N9(value);
}

/**
 * Checks if value satisfies the YNa predicate.
 * @param {*} value
 * @returns {boolean}
 */
export function isSpecialType(value) {
  return typeChecker.YNa(value);
}

/**
 * Checks if the given value is an array.
 * @param {*} value
 * @returns {boolean}
 */
export function isArray(value) {
  return typeChecker.SQ(value);
}

/**
 * Checks if the value satisfies the zrb predicate.
 * @param {*} value
 * @returns {boolean}
 */
export function isTypedValue(value) {
  return typeChecker.zrb(value);
}

/**
 * Applies a map transformation with type checking.
 * @param {*} value
 * @param {Function} mapper
 * @param {*} context
 * @returns {*}
 */
export function mapTransform(value, mapper, context) {
  return typeChecker.mapTransform(value, mapper, context);
}

/**
 * Applies the VOa transformation.
 * @param {*} value
 * @param {*} param1
 * @param {*} param2
 * @returns {*}
 */
export function transformWithOptions(value, param1, param2) {
  return typeChecker.VOa(value, param1, param2);
}

/**
 * Applies the O9 transformation.
 * @param {*} value
 * @param {*} param1
 * @param {*} param2
 * @returns {*}
 */
export function validateAndTransform(value, param1, param2) {
  return typeChecker.O9(value, param1, param2);
}

/**
 * Checks if the value satisfies the t9 predicate.
 * @param {*} value
 * @returns {boolean}
 */
export function isSimpleType(value) {
  return typeChecker.t9(value);
}

/**
 * Checks the Q$b predicate.
 * @param {*} value
 * @returns {boolean}
 */
export function isEncodedValue(value) {
  return typeChecker.Q$b(value);
}

/**
 * Checks the R$b predicate.
 * @param {*} value
 * @returns {boolean}
 */
export function isDecodedValue(value) {
  return typeChecker.R$b(value);
}

/**
 * Checks if value passes the isNonEmptyArray predicate.
 * @param {*} value
 * @returns {boolean}
 */
export function isInternalType(value) {
  return typeChecker.isNonEmptyArray(value);
}

/**
 * Checks if the value passes the filter predicate (array check).
 * @param {*} value
 * @returns {boolean}
 */
export function arrayCheck(value) {
  return typeChecker.filterPredicate(value);
}

/**
 * Validates whether a value represents a valid interval.
 * @param {*} value
 * @returns {boolean}
 */
export function isValidInterval(value) {
  return typeChecker.isValidInterval(value);
}

/**
 * Checks the isRegExp predicate.
 * @param {*} value
 * @returns {boolean}
 */
export function isRegisteredType(value) {
  return typeChecker.isRegExp(value);
}

/**
 * Performs a typeof-based type check.
 * @param {*} value
 * @returns {boolean}
 */
export function typeofChecker(value) {
  return typeChecker.isFunction(value);
}
