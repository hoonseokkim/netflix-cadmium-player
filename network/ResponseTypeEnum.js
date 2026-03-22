/**
 * @file ResponseTypeEnum.js
 * @description Defines response type classification for network responses.
 *              Distinguishes between HTTP responses and Ella (Netflix's custom
 *              transport protocol) responses. Provides type-checking utilities
 *              to determine if a response matches a given type.
 * @module network/ResponseTypeEnum
 * @original Module_24940
 */

/**
 * Enum for network response transport types.
 * @enum {number}
 */
export const ResponseType = Object.freeze({
  /** Standard HTTP response */
  HTTP: 0,
  /** Ella protocol response (Netflix custom transport) */
  ELLA: 1,
});

/**
 * Checks if the given response object is an HTTP response.
 * @param {object} response - The response object to check.
 * @returns {boolean} True if the response type matches HTTP.
 */
export function isHttpResponse(response) {
  return response && response.YN === ResponseType.HTTP;
}

/**
 * Checks if the given response object is an Ella response.
 * @param {object} response - The response object to check.
 * @returns {boolean} True if the response type matches Ella.
 */
export function isEllaResponse(response) {
  return response && response.YN === ResponseType.ELLA;
}

/**
 * Alias for isHttpResponse - validates response as HTTP type.
 * @param {object} response - The response object to check.
 * @returns {boolean}
 */
export function validateHttpResponse(response) {
  return response && response.YN === ResponseType.HTTP;
}

/**
 * Alias for isEllaResponse - validates response as Ella type.
 * @param {object} response - The response object to check.
 * @returns {boolean}
 */
export function validateEllaResponse(response) {
  return response && response.YN === ResponseType.ELLA;
}
