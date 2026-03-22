/**
 * Netflix Cadmium Player - Socket Router Transport
 * Deobfuscated from Module_99306
 *
 * Transport layer implementation that sends requests via a SocketRouter client.
 * Used as an alternative to HTTP/SSL transport for real-time communication.
 * Implements the transport interface with send() and getTransportInfo() methods.
 *
 * Injectable service that depends on Logger and a SocketRouter client.
 */

import { __decorate, __param } from "tslib"; // Module 22970
import { injectable, inject as injectDecorator } from "inversify"; // Module 22674
import { LoggerToken } from "../symbols/LoggerToken"; // Module 87386
import { SocketRouterClientToken } from "../symbols/SocketRouterClientToken"; // Module 54861
import { SocketRouterRequestOptions } from "./SocketRouterRequestOptions"; // Module 70885

export const SocketRouterTransportSymbol = "SocketRouterTransportSymbol";

@injectable()
class SocketRouterTransport {
    /**
     * @param {Object} logger - Logger service
     * @param {Object} client - SocketRouter client for making requests
     */
    constructor(logger, client) {
        this.client = client;
        this.transportType = "sr"; // Socket Router
        this.log = logger.createSubLogger("SocketRouterTransport");
    }

    /**
     * Send a request through the SocketRouter.
     *
     * @param {Object} endpoint - Endpoint descriptor with type and callback
     * @param {*} payload - Request payload to send
     * @returns {Promise<{body: string, headers: Object}>} Response with body and parsed headers
     */
    send(endpoint, payload) {
        const self = this;
        const requestType = endpoint.so;
        const request = {
            type: requestType,
            payload: payload,
            options: SocketRouterRequestOptions[requestType]
        };

        return this.client.request(request).then(function (response) {
            // Call optional response callback
            if (endpoint.M8a) {
                endpoint.M8a(response);
            }
            return {
                body: JSON.stringify(response.body),
                headers: self.parseHeaders(response.headers)
            };
        }).catch(function (error) {
            self.log.RETRY("Error sending SocketRouter request", {
                subCode: error.errorSubCode,
                message: error.message
            });
            throw error;
        });
    }

    /**
     * Returns transport state info.
     * @returns {{ socketRouterOpen: boolean }} Whether the socket router connection is open
     */
    getTransportInfo() {
        return {
            socketRouterOpen: this.client.iua
        };
    }

    /**
     * Parse raw header strings (e.g. "Content-Type: application/json") into key-value object.
     *
     * @param {string[]} rawHeaders - Array of "Key: Value" header strings
     * @returns {Object} Parsed headers map
     */
    parseHeaders(rawHeaders) {
        const headers = {};
        const headerList = rawHeaders ?? [];
        for (const headerLine of headerList) {
            const colonIndex = headerLine.indexOf(":");
            if (colonIndex > 0) {
                const key = headerLine.substring(0, colonIndex).trim();
                const value = headerLine.substring(colonIndex + 1).trim();
                headers[key] = value;
            }
        }
        return headers;
    }
}

export { SocketRouterTransport };
