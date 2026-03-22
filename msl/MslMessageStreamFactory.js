/**
 * @module MslMessageStreamFactory
 * @description Factory that delegates creation of MSL message streams
 * (send, receive, key exchange, crypto context) to the appropriate
 * internal builders. Acts as a facade for the MSL messaging subsystem.
 * @origin Module_31238
 */

import { assert } from '../assert/assert.js';
import {
  createSendMessageStream,
} from './MslSendMessageStream.js';
import {
  createReceiveMessageStream,
} from './MslReceiveMessageStream.js';
import {
  createKeyExchangeStream,
} from './MslKeyExchangeStream.js';
import {
  createCryptoContextStream,
} from './MslCryptoContextStream.js';

/**
 * Facade for constructing various MSL message stream types.
 * Delegates to specialized builders for send, receive, key exchange,
 * and crypto context operations.
 */
export class MslMessageStreamFactory {
  /**
   * Creates a send message stream for outbound MSL communication.
   * @param {Object} context - MSL context
   * @param {Object} header - Message header
   * @param {Object} payload - Payload data
   * @param {Object} options - Additional options
   * @param {Object} transport - Transport layer
   * @param {Object} callbacks - Result/error callbacks
   */
  createSendStream(context, header, payload, options, transport, callbacks) {
    createSendMessageStream(context, header, payload, options, transport, callbacks);
  }

  /**
   * Creates a receive message stream for inbound MSL communication.
   * @param {Object} context - MSL context
   * @param {Object} header - Message header
   * @param {Object} payload - Payload data
   * @param {Object} options - Additional options
   * @param {*} extra - Additional parameter (nullable)
   * @param {Object} transport - Transport layer
   * @param {Object} callbacks - Result/error callbacks
   */
  createReceiveStream(context, header, payload, options, extra, transport, callbacks) {
    createReceiveMessageStream(context, header, payload, options, null, transport, callbacks);
  }

  /**
   * Creates a key exchange stream for MSL key negotiation.
   * @param {Object} context - MSL context
   * @param {Object} header - Message header
   * @param {Object} payload - Payload data
   * @param {Object} options - Additional options
   * @param {Object} callbacks - Result/error callbacks
   */
  createKeyExchangeStream(context, header, payload, options, callbacks) {
    createKeyExchangeStream(context, header, payload, options, callbacks);
  }

  /**
   * Creates a crypto context stream for MSL encryption operations.
   * @param {Object} context - MSL context
   * @param {Object} header - Message header
   * @param {Object} callbacks - Result/error callbacks
   */
  createCryptoContextStream(context, header, callbacks) {
    createCryptoContextStream(context, header, callbacks);
  }
}
