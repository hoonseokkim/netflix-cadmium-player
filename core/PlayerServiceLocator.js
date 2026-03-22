/**
 * @module PlayerServiceLocator
 * @description Central service locator / dependency injection registry for
 * the Cadmium player. Provides keyed access to core services such as
 * the player core, scheduler, source buffers, media elements, loggers,
 * and disposable resource management.
 * @origin Module_31276
 */

import { ServiceRegistry } from '../classes/ServiceRegistry.js';
import { LoggerToken } from '../monitoring/LoggerToken.js';
import { PlayerCoreToken } from '../player/PlayerCoreToken.js';

/**
 * Player core service key
 * @type {ServiceKey}
 */
export const playerCore = ServiceRegistry.key(PlayerCoreToken);

/**
 * Scheduler service key
 * @type {ServiceKey}
 */
export const scheduler = ServiceRegistry.key(/* valueList token */);

/**
 * Source buffer reference key - provides encode/decode for source buffer handles
 * @type {ServiceKey}
 */
export const sourceBufferRef = ServiceRegistry.key(/* zG token */);

/** Encode a source buffer reference */
export const encodeSourceBufferRef = sourceBufferRef.encode.bind(sourceBufferRef);

/** Decode a source buffer reference */
export const decodeSourceBufferRef = sourceBufferRef.decode.bind(sourceBufferRef);

/**
 * Media element reference key - provides encode/decode for media element handles
 * @type {ServiceKey}
 */
export const mediaElementRef = ServiceRegistry.key(/* dP token */);

/** Encode a media element reference */
export const encodeMediaElementRef = mediaElementRef.encode.bind(mediaElementRef);

/** Decode a media element reference */
export const decodeMediaElementRef = mediaElementRef.decode.bind(mediaElementRef);

/** Extract data from a media element message */
export const extractFromMessage = mediaElementRef.extractFromMessage.bind(mediaElementRef);

/**
 * Binary data reader key for Uint8Array operations
 * @type {ServiceKey}
 */
export const readUint8 = ServiceRegistry.key(/* keyMap token */);

/**
 * Wraps a value through arrayCheck + decode + encode pipeline.
 * If the input passes the array check, it is first decoded from a
 * source-buffer reference, then encoded as a Uint8Array reader.
 * @param {*} value - The value to transform
 * @returns {*} The encoded result
 */
export function encodeWithArrayCheck(value) {
  const decoded = arrayCheck(value) ? decodeSourceBufferRef(value) : value;
  return readUint8.encode(decoded);
}

/** Decode from the Uint8 reader */
export const decodeUint8 = readUint8.decode.bind(readUint8);

/**
 * Re-encodes a decoded Uint8 value back to a source buffer reference.
 * @param {*} value
 * @returns {*}
 */
export function reencodeToSourceBuffer(value) {
  return encodeSourceBufferRef(decodeUint8(value));
}

/**
 * Debug / log manager service key
 * @type {ServiceKey}
 */
export const debugManager = ServiceRegistry.key(LoggerToken);

/** General-purpose logger */
export const log = debugManager.createSubLogger('General');

/**
 * Creates a category-scoped logger.
 * @param {string} category - Log category name
 * @param {*} [options] - Optional logger configuration
 * @returns {Logger}
 */
export function getCategoryLog(category, options) {
  return debugManager.createSubLogger(category, undefined, options);
}

/**
 * Creates a logger scoped to a specific fetch/network operation.
 * @param {string} operationId - Operation identifier
 * @param {string} category - Log category
 * @param {*} [options] - Optional configuration
 * @returns {Logger}
 */
export function fetchOperation(operationId, category, options) {
  return debugManager.createSubLogger(category, operationId, options);
}

/**
 * Creates a sub-logger with additional context parameters.
 * @param {string} category
 * @param {*} param1
 * @param {*} param2
 * @param {*} [options]
 * @returns {Logger}
 */
export function createContextLogger(category, param1, param2, options) {
  return debugManager.createSubLogger(category, undefined, options, param1, param2);
}

/**
 * Creates a disposable resource tracker.
 * @param {*} token
 * @param {*} param1
 * @param {*} param2
 * @returns {Disposable}
 */
export function createDisposable(token, param1, param2) {
  return ServiceRegistry.key(/* T7 token */)(token, param1, param2).dispose();
}

/**
 * The underlying service registry / disposable list.
 * @type {ServiceRegistry}
 */
export const disposableList = ServiceRegistry;
