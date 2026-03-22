/**
 * @module PlaybackError
 * @description Represents a playback error in the Netflix Cadmium player.
 * Contains error codes, sub-codes, MSL codes, display messages, and other
 * diagnostic information used for error reporting and handling.
 * @origin Module_31149
 */

import { ErrorCode, EventTypeEnum } from '../types/ErrorCodes.js';

/**
 * Represents a structured playback error with detailed diagnostic fields.
 */
export class PlaybackError {
  /**
   * @param {number} [code=ErrorCode.UNKNOWN] - Primary error code
   * @param {string} [errorSubCode] - Sub-classification of the error
   * @param {string} [errorExternalCode] - External-facing error code
   * @param {string} [edgeCode] - CDN edge error code
   * @param {string} [mslCode] - MSL protocol error code
   * @param {string} [message] - Human-readable error message
   * @param {string} [details] - Detailed error description (e.g. stack trace)
   * @param {*} [data] - Raw error data or exception object
   * @param {string} [errorDisplayMessage] - User-facing display message
   * @param {*} [playbackServiceError] - Playback service error payload
   * @param {*} [alert] - Alert information
   * @param {string} [alertTag] - Tag for categorizing the alert
   * @param {string} [playbackContextId] - Context ID for the playback session
   * @param {*} [mfa] - Multi-factor authentication data
   */
  constructor(
    code,
    errorSubCode,
    errorExternalCode,
    edgeCode,
    mslCode,
    message,
    details,
    data,
    errorDisplayMessage,
    playbackServiceError,
    alert,
    alertTag,
    playbackContextId,
    mfa
  ) {
    this.code = code === undefined ? ErrorCode.UNKNOWN : code;
    this.errorSubCode = errorSubCode;
    this.errorExternalCode = errorExternalCode;
    this.edgeCode = edgeCode;
    this.mslCode = mslCode;
    this.message = message;
    this.details = details;
    this.data = data;
    this.errorDisplayMessage = errorDisplayMessage;
    this.playbackServiceError = playbackServiceError;
    this.alert = alert;
    this.alertTag = alertTag;
    this.playbackContextId = playbackContextId;
    this.mfa = mfa;
    /** @type {boolean} Always false for error objects */
    this.success = false;
  }

  /**
   * Formats an error or exception into a string with stack trace and error number.
   * @param {Error|*} error - The error to format
   * @returns {string} Formatted error string
   */
  static initializeModel(error) {
    if (error) {
      const stack = error.stack;
      const number = error.number;
      let message = error.message;

      if (!message) {
        message = '' + error;
      }

      let result;
      if (stack) {
        result = '' + stack;
        if (result.indexOf(message) !== 0) {
          result = message + '\n' + result;
        }
      } else {
        result = message;
      }

      if (number) {
        result += '\nnumber:' + number;
      }

      return result;
    }
    return '';
  }

  /**
   * Sets the error details from an exception object.
   * @param {Error|*} error - The exception to extract details from
   */
  setErrorFromException(error) {
    this.details = PlaybackError.initializeModel(error);
    this.data = error;
  }

  /**
   * @returns {string} JSON string representation of this error
   */
  toString() {
    return JSON.stringify(this.toJSON());
  }

  /**
   * @returns {Object} Plain object representation suitable for serialization
   */
  toJSON() {
    return {
      code: this.code,
      errorSubCode: this.errorSubCode,
      errorExternalCode: this.errorExternalCode,
      edgeCode: this.edgeCode,
      mslCode: this.mslCode,
      message: this.message,
      details: this.details,
      data: this.data,
      errorDisplayMessage: this.errorDisplayMessage,
      playbackServiceError: this.playbackServiceError,
    };
  }

  /**
   * Creates a PlaybackError from a native exception.
   * @param {number} code - Error code
   * @param {Error} exception - The caught exception
   * @returns {PlaybackError}
   */
  static fromException(code, exception) {
    return new PlaybackError(
      code,
      EventTypeEnum.EXCEPTION,
      undefined,
      undefined,
      undefined,
      undefined,
      exception.message,
      exception.stack
    );
  }

  /**
   * Creates a PlaybackError with code and sub-code only.
   * @param {number} code - Error code
   * @param {string} subCode - Error sub-code
   * @returns {PlaybackError}
   */
  static fromSubCode(code, subCode) {
    return new PlaybackError(code, subCode);
  }

  /**
   * Creates a PlaybackError with an alert tag.
   * @param {number} code - Error code
   * @param {string} subCode - Error sub-code
   * @param {string} alertTag - Alert tag
   * @returns {PlaybackError}
   */
  static fromAlertTag(code, subCode, alertTag) {
    return new PlaybackError(
      code,
      subCode,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      alertTag
    );
  }
}
