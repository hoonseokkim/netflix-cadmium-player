/**
 * Netflix Cadmium Player - MSL Exception
 *
 * Exception class for errors in Netflix's Message Security Layer (MSL) protocol.
 * Extends a base exception class with the "MslException" type identifier.
 *
 * @module MslException
 * @see Module_1966
 */

import { __extends } from '../_tslib.js';
import BaseException from '../msl/BaseException.js';

/**
 * Exception thrown during MSL protocol operations.
 * @extends BaseException
 */
export default class MslException extends BaseException {
    /**
     * @param {string|number} errorCode - The MSL error code
     * @param {string} [message] - Human-readable error message
     * @param {Error} [cause] - The underlying cause error
     */
    constructor(errorCode, message, cause) {
        super("MslException", errorCode, message, cause);
    }
}
