/**
 * @file CadmiumError.js
 * @description Custom error class for the Netflix Cadmium player. Extends native Error
 * with support for chained causes, message IDs, error codes, and abort tracking.
 * @module core/CadmiumError
 * @see Module_63053
 */

import TsLibHelpers from '../utils/TsLibHelpers.js';
import ErrorCodes from './ErrorCodes.js';

/** Maximum valid message ID from ErrorCodes configuration */
const MAX_MESSAGE_ID = ErrorCodes.default.kf;

/**
 * Custom error class used throughout the Cadmium player for structured error handling.
 * Supports error chaining (cause), message IDs for telemetry, and error/abort callbacks.
 */
export default class CadmiumError extends Error {
  /**
   * @param {string} name - The error name/category
   * @param {Error} error - The underlying error object
   * @param {string} [context] - Optional context string appended to the message
   * @param {Error} [cause] - Optional causal error for error chaining
   */
  constructor(name, error, context, cause) {
    super(error.message);

    // Ensure correct prototype chain for instanceof checks
    if (typeof Object.setPrototypeOf === 'undefined') {
      this.__proto__ = new.target.prototype;
    } else {
      Object.setPrototypeOf(this, new.target.prototype);
    }

    if (context) {
      this.message += ` [${context}]`;
    }

    /** @type {string} */
    this.name = name;

    /** @type {Error} */
    this.error = error;

    /** @type {Error|undefined} */
    this.cause = cause;

    // Build a comprehensive stack trace including the cause chain
    let stackStr = this.toString();
    if (this.stack) {
      stackStr += '\n' + this.stack;
    }
    if (this.cause?.stack) {
      stackStr += '\nCaused by ' + this.cause.stack;
    }
    this.stack = stackStr;
  }

  /**
   * Sets the message ID for this error, used for telemetry/logging identification.
   * Only sets the ID if one hasn't been set yet (either directly or via cause chain).
   * @param {number} messageId - A numeric ID within the valid range [0, MAX_MESSAGE_ID]
   * @returns {this} For method chaining
   * @throws {RangeError} If messageId is outside the valid range
   */
  setMessageId(messageId) {
    if (messageId < 0 || messageId > MAX_MESSAGE_ID) {
      throw new RangeError(`Message ID ${messageId} is outside the valid range.`);
    }
    if (!this.getMessageId()) {
      this.messageId = messageId;
    }
    return this;
  }

  /**
   * Gets the message ID, checking this error first, then walking the cause chain.
   * @returns {number|undefined} The message ID if set
   */
  getMessageId() {
    if (this.messageId) {
      return this.messageId;
    }
    if (this.cause && this.cause.messageId) {
      return this.cause.messageId;
    }
  }

  /**
   * Sets the error code if neither errorCode nor fatalErrorCode is already set.
   * @param {*} errorCode - The error code to assign
   * @returns {this} For method chaining
   */
  setErrorCode(errorCode) {
    if (errorCode && !this.errorCode && !this.fatalErrorCode) {
      this.errorCode = errorCode;
    }
    return this;
  }

  /**
   * Sets the fatal error code if neither errorCode nor fatalErrorCode is already set.
   * @param {*} fatalErrorCode - The fatal error code to assign
   * @returns {this} For method chaining
   */
  setFatalErrorCode(fatalErrorCode) {
    if (fatalErrorCode && !this.errorCode && !this.fatalErrorCode) {
      this.fatalErrorCode = fatalErrorCode;
    }
    return this;
  }

  /**
   * Sets the abort flag if not already aborted and no error callback is set.
   * @param {*} abortFlag - The abort indicator
   * @returns {this} For method chaining
   */
  setAborted(abortFlag) {
    if (abortFlag && !this.isAborted && !this.errorCallbackFn) {
      this.isAborted = abortFlag;
    }
    return this;
  }

  /**
   * Sets the error callback function if not already aborted and no callback is set.
   * @param {Function} callback - The error callback function
   * @returns {this} For method chaining
   */
  setErrorCallback(callback) {
    if (callback && !this.isAborted && !this.errorCallbackFn) {
      this.errorCallbackFn = callback;
    }
    return this;
  }

  /**
   * @returns {string} String representation as "name: message"
   */
  toString() {
    return `${this.name}: ${this.message}`;
  }
}
