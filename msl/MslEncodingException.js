/**
 * @module MslEncodingException
 * @description Exception class for MSL (Message Security Layer) encoding/decoding errors.
 * Thrown when message serialization or deserialization fails due to malformed
 * data, missing fields, or unsupported encoding formats.
 *
 * @original Module_88257
 */

// import MslException from './MslException'; // Module 63053

/**
 * @class MslEncodingException
 * @extends MslException
 */
export default class MslEncodingException extends MslException {
  /**
   * @param {number} errorCode - The MSL error code.
   * @param {string} [message] - Human-readable error message.
   * @param {Error} [cause] - The underlying cause, if any.
   */
  constructor(errorCode, message, cause) {
    super('MslEncodingException', errorCode, message, cause);
  }
}
