/**
 * Netflix Cadmium Player - SSL Transport
 * Deobfuscated from Module_89146
 *
 * Transport layer implementation that sends requests over HTTPS/SSL.
 * Uses the platform HTTP client to make POST requests with JSON payloads.
 * Implements the transport interface with send() and getTransportInfo() methods.
 *
 * Injectable service depending on Logger and HTTP client.
 */

import { __decorate, __param } from "tslib"; // Module 22970
import { injectable, inject as injectDecorator } from "inversify"; // Module 22674
import { MILLISECONDS } from "../core/TimeUnit"; // Module 5021
import { LoggerToken } from "../symbols/LoggerToken"; // Module 87386
import { HttpToken } from "../symbols/HttpToken"; // Module 32934

@injectable()
class SslTransport {
    /**
     * @param {Object} logger - Logger instance
     * @param {Object} httpClient - Platform HTTP client for making requests
     */
    constructor(logger, httpClient) {
        this.httpClient = httpClient;
        this.transportType = "ssl";
        this.log = logger.createSubLogger("SslTransport");
    }

    /**
     * Send a request over SSL/HTTPS.
     *
     * @param {Object} endpoint - Endpoint descriptor with url, type, timeout, headers
     * @param {*} payload - Request payload (will be JSON stringified)
     * @returns {Promise<{body: string, headers: Object}>} Response
     */
    send(endpoint, payload) {
        const self = this;
        const requestConfig = {
            url: endpoint.url.toString,
            languageSelection: "nq-" + endpoint.so,
            gOb: JSON.stringify(payload),
            connectTimeoutMilliseconds: endpoint.timeout.toUnit(MILLISECONDS),
            headers: endpoint.headers,
            withCredentials: true,
            cdnType: "pbo"
        };

        return new Promise(function (resolve, reject) {
            self.httpClient.download(requestConfig, function (response) {
                response.success ? resolve(response) : reject(response);
            });
        }).then(function (response) {
            return {
                body: response.content,
                headers: response.headers
            };
        }).catch(function (response) {
            if (!response.error) {
                response.errorSubCode = response.errorcode || response.errorSubCode;
                throw response;
            }

            const error = response.error;
            error.headers = response.headers;
            self.log.error("Error sending SSL request", {
                subCode: error.errorSubCode,
                data: error.content,
                message: error.message
            });
            throw error;
        });
    }

    /**
     * Returns transport state info.
     * SSL transport has no persistent connection state.
     * @returns {Object} Empty object
     */
    getTransportInfo() {
        return {};
    }
}

export { SslTransport };
