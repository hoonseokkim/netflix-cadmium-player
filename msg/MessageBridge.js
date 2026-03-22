/**
 * @module MessageBridge
 * @description Wrapper around an internal message transport that provides
 *              send() and request() methods with variadic arguments.
 *              Acts as a bridge/proxy for inter-component messaging.
 *              Original: Module_84898
 */

import MessageTransport from '../msg/MessageTransport'; // Module 2178

/**
 * Provides a simplified send/request interface on top of a MessageTransport.
 */
class MessageBridge {
    /**
     * @param {string} channel - The messaging channel identifier
     * @param {Object} options - Transport configuration options
     */
    constructor(channel, options) {
        /** @type {MessageTransport} The underlying transport instance */
        this.transport = new MessageTransport(channel, options);
    }

    /**
     * Sends a message without expecting a response.
     * @param {string} type - Message type identifier
     * @param {*} payload - Primary message payload
     * @param {...*} additionalArgs - Additional arguments forwarded to the transport
     * @returns {*} Result from the transport send operation
     */
    send(type, payload, ...additionalArgs) {
        return this.transport.send(type, payload, additionalArgs);
    }

    /**
     * Sends a request and expects a response.
     * @param {string} type - Request type identifier
     * @param {*} payload - Primary request payload
     * @param {...*} additionalArgs - Additional arguments forwarded to the transport
     * @returns {Promise<*>} Response from the transport
     */
    request(type, payload, ...additionalArgs) {
        return this.transport.request(type, payload, additionalArgs);
    }
}

export { MessageBridge };
export default MessageBridge;
