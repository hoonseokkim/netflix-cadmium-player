/**
 * @module EmeSessionFactorySymbol
 * @description Dependency injection symbol for the EME (Encrypted Media Extensions)
 * session factory. Used by the DRM subsystem to create and manage EME sessions
 * for content decryption.
 *
 * @see https://www.w3.org/TR/encrypted-media/
 * @original Module_10060
 */

/**
 * Symbol identifier for the EME session factory service.
 * Used for IoC container binding/resolution.
 * @type {string}
 */
export const EmeSessionFactorySymbol = "EmeSessionFactorySymbol";
