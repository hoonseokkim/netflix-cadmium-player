/**
 * @file MslInterruptedException.js
 * @description Exception class for MSL (Message Security Layer) interruptions.
 *              Thrown when an MSL operation is interrupted, for example due to
 *              session teardown, network cancellation, or timeout during MSL
 *              handshake/key exchange.
 * @module msl/MslInterruptedException
 * @original Module_25978
 */

// import MslException from './MslException'; // Module 18595

/**
 * Exception thrown when an MSL operation is interrupted.
 * Extends MslException with a specific "MslInterruptedException" type name.
 */
export class MslInterruptedException extends MslException {
  /**
   * @param {string} message - Description of the interruption.
   * @param {Error} [cause] - Optional underlying error that caused the interruption.
   */
  constructor(message, cause) {
    super("MslInterruptedException", message, cause);
  }
}

export default MslInterruptedException;
