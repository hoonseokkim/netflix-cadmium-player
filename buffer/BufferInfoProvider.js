/**
 * Netflix Cadmium Player — BufferInfoProvider
 *
 * Injectable service that provides buffer status information by delegating
 * to a configuration callback. Exposes available buffer, buffer health,
 * and live buffer metrics.
 *
 * Decorated with `@injectable` for the IoC container, with the config
 * injected via the `ConfigSymbol` token.
 *
 * @module buffer/BufferInfoProvider
 * @original Module_25293
 */

// import { __decorate, __param } from 'tslib';        // Module 22970
// import { injectable, inject } from 'inversify';      // Module 22674
// import { ConfigToken } from '../core/AseConfig';     // Module 4203

export class BufferInfoProvider {
    /**
     * @param {Function} config - Injected config provider that returns buffer info
     */
    constructor(config) {
        /** @private */
        this.config = config;
    }

    /**
     * Get the amount of available buffer (in ms or bytes, depending on context).
     * @returns {number}
     */
    getAvailableBuffer() {
        return this.#getBufferInfo().availableBuffer;
    }

    /**
     * Get buffer health status information.
     * @returns {*}
     */
    getBufferHealth() {
        return this.#getBufferInfo().bufferHealth;
    }

    /**
     * Get live buffer information (for live/linear streaming).
     * @returns {*}
     */
    getLiveBufferInfo() {
        return this.#getBufferInfo().liveBufferInfo;
    }

    /**
     * Get the buffer write position.
     * @returns {*}
     */
    getWritePosition() {
        return this.#getBufferInfo().writePosition;
    }

    /**
     * Internal accessor that invokes the config callback to get current buffer state.
     * @returns {Object} Buffer info object with availableBuffer, bufferHealth, liveBufferInfo, writePosition
     */
    #getBufferInfo() {
        return this.config();
    }
}
