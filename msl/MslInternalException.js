/**
 * @module MslInternalException
 * @description Exception class for internal MSL (Message Security Layer) errors.
 * Extends the base Netflix exception class with an "MslInternalException" type.
 *
 * @original Module 10690
 */

import { __extends, __importDefault } from '../utils/TsLibHelpers.js';
import BaseException from '../core/BaseException.js';

/**
 * Represents an internal error within the MSL (Message Security Layer) subsystem.
 * Thrown when an unexpected condition occurs during MSL message processing,
 * key exchange, or token management.
 */
class MslInternalException extends BaseException {
    /**
     * @param {string} message - The error message describing what went wrong
     * @param {*} [cause] - Optional underlying cause of the exception
     */
    constructor(message, cause) {
        super("MslInternalException", message, cause);
    }
}

export default MslInternalException;
