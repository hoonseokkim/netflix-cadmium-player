/**
 * Netflix Cadmium Player - Socket Router Connection Configuration
 * Deobfuscated from Module_78710
 *
 * Default configuration and retry policies for SocketRouter connections.
 * Provides:
 *   - Exponential backoff retry logic (max 5 retries, 500ms base delay)
 *   - Connection timeouts (connect: 3 attempts, 120s delay, 600s create)
 *   - Disconnect timeouts (disconnect: 3 attempts, 30s delay, 60s create)
 *   - Reconnection guard (max 4 reconnect attempts before stopping)
 *
 * Handles special error cases: unauthorized errors and ALE failures
 * abort retries immediately.
 */

import { __assign } from "tslib"; // Module 22970
import { Sla as createMaxRetriesError, Dsc as parseRetryErrorInfo } from "../network/SocketRouterErrors"; // Module 62411

/** Default connection timeout configuration */
export const DEFAULT_CONNECT_TIMEOUTS = {
    count: 3,
    dU: 120000,    // 120 seconds delay
    create: 600000 // 600 seconds create timeout
};

/** Default disconnection timeout configuration */
export const DEFAULT_DISCONNECT_TIMEOUTS = {
    count: 3,
    dU: 30000,    // 30 seconds delay
    create: 60000 // 60 seconds create timeout
};

/**
 * Apply default configuration to a SocketRouter connection config.
 * Fills in retry, connect, disconnect, and reconnect policies if not provided.
 *
 * @param {Object} config - Partial connection configuration
 * @returns {Object} Complete connection configuration with defaults applied
 */
export function applyDefaultConnectionConfig(config) {
    config = Object.assign({}, config);

    // Default retry policy: exponential backoff, max 5 retries
    if (!config.retry) {
        config.retry = function (attemptNumber, error) {
            if (attemptNumber > 5) {
                throw createMaxRetriesError(attemptNumber);
            }

            const errorInfo = parseRetryErrorInfo(error);

            // Abort immediately on authorization failure
            if (errorInfo.unauthorized) {
                throw createMaxRetriesError(attemptNumber);
            }

            // Abort immediately on first ALE failure
            if (attemptNumber === 1 && errorInfo["ale-failure"]) {
                throw createMaxRetriesError(attemptNumber);
            }

            // Exponential backoff: 500ms, 1000ms, 2000ms, 4000ms, 8000ms
            return new Promise(function (resolve) {
                return setTimeout(resolve, 500 * Math.pow(2, attemptNumber - 1));
            });
        };
    }

    // Default connection timeouts
    if (!config.connect) {
        config.connect = DEFAULT_CONNECT_TIMEOUTS;
    }

    // Default disconnection timeouts
    if (!config.disconnect) {
        config.disconnect = DEFAULT_DISCONNECT_TIMEOUTS;
    }

    // Default reconnection guard: max 4 attempts before giving up
    if (!config.bJ) {
        let reconnectAttempts = 0;
        config.bJ = function () {
            if (reconnectAttempts >= 4) {
                reconnectAttempts = 0;
                return false;
            }
            reconnectAttempts++;
            return true;
        };
    }

    return config;
}
