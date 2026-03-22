/**
 * @module MslMessageException
 * @description Custom exception class for MSL (Message Security Layer) message errors.
 * Extends a base exception class to provide MSL-specific error context.
 * @original Module_20754
 */

import { __extends, __importDefault } from 'tslib'; // Module 22970
import BaseException from '../core/BaseException'; // Module 63053

/**
 * Exception thrown when MSL message processing encounters an error.
 * Carries the "MslMessageException" error name for identification in error handling.
 *
 * @extends BaseException
 */
export default class MslMessageException extends BaseException {
    /**
     * @param {string} message - Error message describing the MSL failure
     * @param {*} details - Additional error details or inner error
     * @param {*} context - Error context information
     */
    constructor(message, details, context) {
        super('MslMessageException', message, details, context);
    }
}
