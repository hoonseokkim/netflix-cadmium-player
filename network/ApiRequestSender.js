/**
 * @module ApiRequestSender
 * @description Injectable service for sending API requests to Netflix backend.
 *              Constructs request contexts with proper URLs, headers, and MSL/HTTP
 *              transport preferences, then dispatches them via the configured transport.
 *              Original: Module_51658
 */

import { __decorate, __param } from 'tslib'; // Module 22970
import { injectable, unmanaged } from 'inversify'; // Module 22674
import { buildRequestUrl, buildRequestHeaders, wrapError } from '../network/RequestUtils'; // Module 71977
import { PlayerError } from '../core/PlayerError'; // Module 31149
import { TransportPreference } from '../network/TransportPreference'; // Module 34231

/**
 * Sends API requests to the Netflix backend, handling URL construction,
 * header generation, and transport selection (MSL vs HTTP).
 */
class ApiRequestSender {
    /**
     * @param {Object} context - Request context containing transport, session, version info
     * @param {number} errorCode - Default error code for wrapping failures
     */
    constructor(context, errorCode) {
        /** @type {Object} Shared request context */
        this.context = context;

        /** @type {number} Error code used when wrapping transport errors */
        this.errorCode = errorCode;
    }

    /**
     * Sends an API request through the configured transport.
     * @param {Object} requestOptions - Options including log, wait time, etc.
     * @param {Object} endpointConfig - Endpoint configuration (url, name, callMode, headers)
     * @param {*} payload - Request body/payload
     * @param {*} [additionalData] - Optional extra data for the request
     * @param {string} [transportPreference=PreferMsl] - Transport preference
     * @returns {Promise<*>} Response from the transport
     */
    send(requestOptions, endpointConfig, payload, additionalData, transportPreference = TransportPreference.PreferMsl) {
        return this._buildRequest(requestOptions, endpointConfig, payload, transportPreference, additionalData)
            .then((prepared) => this.context.transport.send(prepared.context, prepared.request));
    }

    /**
     * Builds the request and context objects.
     * @private
     * @param {Object} requestOptions - Request options
     * @param {Object} endpointConfig - Endpoint configuration
     * @param {*} payload - Request payload
     * @param {string} transportPreference - Transport preference
     * @param {*} [additionalData] - Optional extra data
     * @returns {Promise<{context: Object, request: Object}>}
     */
    _buildRequest(requestOptions, endpointConfig, payload, transportPreference, additionalData) {
        try {
            const request = this.context.requestFactory.create(
                this.context.sessionManager.getSessionId(),
                endpointConfig.url,
                payload,
                additionalData,
                transportPreference
            );

            const requestContext = this._buildRequestContext(endpointConfig, requestOptions, transportPreference);

            return Promise.resolve({ context: requestContext, request });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Builds the request context with URL, headers, and metadata.
     * @private
     * @param {Object} endpointConfig - Endpoint configuration
     * @param {Object} requestOptions - Request options
     * @param {string} transportPreference - Transport preference
     * @returns {Object} Request context for the transport layer
     */
    _buildRequestContext(endpointConfig, requestOptions, transportPreference) {
        return {
            Je: this.context.responseType,
            so: endpointConfig.name,
            url: this.context.buildUrl(
                buildRequestUrl(this.context.emeSession, this.context.VERSION, endpointConfig.name, transportPreference)
            ),
            callModeFlag: endpointConfig.callModeFlag,
            timeout: this.context.VERSION.timeout,
            headers: {
                ...buildRequestHeaders(
                    this.context.emeSession,
                    this.context.VERSION,
                    this.context.DR,
                    endpointConfig.name,
                    transportPreference
                ),
                ...(endpointConfig.customHeaders ?? {}),
            },
            callMode: endpointConfig.callMode,
            log: requestOptions.log,
            BPa: requestOptions.BPa,
            waitTimeMs: requestOptions.waitTimeMs,
            J: requestOptions.J,
            requestId: this.context.sessionManager.generateRequestId(),
            M8a: this.M8a,
        };
    }

    /**
     * Wraps an error with the configured error code.
     * @param {Error} error - Original error
     * @returns {PlayerError} Wrapped error
     */
    errorWrapper(error) {
        if (error instanceof PlayerError) return error;
        return wrapError(this.errorCode, error);
    }
}

export { ApiRequestSender };
export default ApiRequestSender;
