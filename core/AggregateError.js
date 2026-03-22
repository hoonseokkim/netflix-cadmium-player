/**
 * @file AggregateError.js
 * @description Custom AggregateError implementation for environments that may not
 * support the native AggregateError. Wraps multiple errors into a single
 * error with a combined message and provides stringification utilities.
 * @module core/AggregateError
 * @see Module_67164
 */

/**
 * Recursively stringifies an error, including its aggregate sub-errors.
 * @param {Error} error - The error to stringify
 * @param {Function} [formatter=stringify] - Optional formatter for sub-errors
 * @returns {string} Formatted error string
 */
function stringify(error, formatter = stringify) {
  let subErrorsStr = '';
  if (error.errors) {
    subErrorsStr = error.errors
      .map(formatter)
      .reduce((acc, item) => `${acc},${item}`);
  }
  return `${error?.name}::${error?.message}::{${error?.stack}}[${subErrorsStr}]`;
}

/**
 * A polyfill/custom implementation of AggregateError that combines multiple
 * error messages into a single Error. Used for reporting multiple failures
 * from concurrent operations.
 * @extends Error
 */
export class CadmiumAggregateError extends Error {
  /**
   * @param {string} message - The primary error message
   * @param {Array<string|Error>} errors - Array of sub-error messages or errors
   */
  constructor(message, errors) {
    super(CadmiumAggregateError.buildMessage(message, errors));

    /** @private */
    this._errors = errors;

    /** @type {string} */
    this.name = 'AggregateError';
  }

  /**
   * Builds a combined message from the primary message and all sub-errors.
   * @param {string} message - Primary message
   * @param {Array<string|Error>} errors - Sub-errors
   * @returns {string} Combined message with each error on a new line
   * @static
   */
  static buildMessage(message, errors) {
    return errors.reduce((acc, err) => `${acc}\n${err}`, message);
  }

  /**
   * Converts an error to a detailed string representation including sub-errors.
   * @param {Error} error - The error to stringify
   * @returns {string}
   * @static
   */
  static stringify(error) {
    return stringify(error);
  }

  /**
   * The array of sub-errors.
   * @type {Array<string|Error>}
   */
  get errors() {
    return this._errors;
  }
}
