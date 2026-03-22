/**
 * @module MslEntityAuthException
 * @description Exception class for MSL (Message Security Layer) entity authentication errors.
 * Thrown when entity authentication data is invalid, missing, or fails verification
 * during the MSL handshake process.
 *
 * @original Module_24571
 */

// import MslException from './MslException'; // Module 63053

/**
 * @class MslEntityAuthException
 * @extends MslException
 */
export default class MslEntityAuthException extends MslException {
  /**
   * @param {number} errorCode - The MSL error code.
   * @param {string} [message] - Human-readable error message.
   * @param {Error} [cause] - The underlying cause, if any.
   */
  constructor(errorCode, message, cause) {
    super('MslEntityAuthException', errorCode, message, cause);
  }
}
