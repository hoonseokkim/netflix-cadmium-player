/**
 * Netflix Cadmium Player - NfError
 *
 * Core error class used throughout the Netflix player for structured error
 * reporting. Captures error codes, sub-codes, MSL codes, edge codes,
 * display messages, and playback service errors.
 *
 * @module Module_31149
 */

// import { ErrorCode, EventTypeEnum } from '../drm/MediaKeySystemAccessServices.js'; // webpack module 36129
import { ErrorCode, EventTypeEnum } from './Module_36129.js';

/**
 * Netflix player error object with structured error information.
 */
export class NfError {
    /**
     * @param {number} [code=ErrorCode.UNKNOWN] - Primary error code
     * @param {string} [errorSubCode] - Error sub-code for classification
     * @param {string} [errorExternalCode] - External-facing error code
     * @param {string} [edgeCode] - CDN edge error code
     * @param {string} [mslCode] - MSL protocol error code
     * @param {string} [message] - Human-readable error message
     * @param {string} [details] - Detailed error information (stack trace etc.)
     * @param {*} [data] - Associated error data/object
     * @param {string} [errorDisplayMessage] - User-facing display message
     * @param {*} [playbackServiceError] - Playback service error details
     * @param {string} [alert] - Alert identifier
     * @param {string} [alertTag] - Alert tag for categorization
     * @param {string} [playbackContextId] - Playback context identifier
     * @param {*} [extraData] - Additional error metadata
     */
    constructor(code, errorSubCode, errorExternalCode, edgeCode, mslCode, message, details, data, errorDisplayMessage, playbackServiceError, alert, alertTag, playbackContextId, extraData) {
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
        this.extraData = extraData;
        this.success = false;
    }

    /**
     * Format an Error object as a string and store it as details/data.
     * @param {Error} error - The error to capture
     */
    setErrorDetails(error) {
        this.details = NfError.formatError(error);
        this.data = error;
    }

    /**
     * @returns {string} JSON string representation
     */
    toString() {
        return JSON.stringify(this.toJSON());
    }

    /**
     * @returns {Object} Serializable error object
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
            playbackServiceError: this.playbackServiceError
        };
    }

    /**
     * Format an Error to a string with stack trace and error number.
     * @param {Error} error - Error to format
     * @returns {string}
     */
    static formatError(error) {
        if (error) {
            const stack = error.stack;
            const number = error.number;
            let message = error.message;
            if (!message) message = "" + error;
            let result;
            if (stack) {
                result = "" + stack;
                if (result.indexOf(message) !== 0) {
                    result = message + "\n" + result;
                }
            } else {
                result = message;
            }
            if (number) result += "\nnumber:" + number;
            return result;
        }
        return "";
    }

    /**
     * Create an NfError from an exception with error code.
     * @param {number} code - Error code
     * @param {Error} exception - The caught exception
     * @returns {NfError}
     */
    static fromException(code, exception) {
        return new NfError(code, EventTypeEnum.EXCEPTION, undefined, undefined, undefined, undefined, exception.message, exception.stack);
    }

    /**
     * Create an NfError with code and sub-code only.
     * @param {number} code - Error code
     * @param {string} subCode - Error sub-code
     * @returns {NfError}
     */
    static fromSubCode(code, subCode) {
        return new NfError(code, subCode);
    }

    /**
     * Create an NfError with code, sub-code, and alert.
     * @param {number} code - Error code
     * @param {string} subCode - Error sub-code
     * @param {string} alert - Alert identifier
     * @returns {NfError}
     */
    static fromAlert(code, subCode, alert) {
        return new NfError(code, subCode, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, alert);
    }
}
