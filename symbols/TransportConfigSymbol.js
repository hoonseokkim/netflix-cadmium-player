/**
 * Transport Config Symbol
 *
 * Dependency injection symbol for the transport layer configuration.
 * Binds/resolves the transport configuration object that controls
 * HTTP transport settings (timeouts, retries, connection pooling, etc.)
 * used by the network subsystem.
 *
 * @module symbols/TransportConfigSymbol
 * @original Module_70865
 */

/**
 * Symbol identifier for the TransportConfig service in the DI container.
 * @type {string}
 */
export const TransportConfigSymbol = "TransportConfigSymbol";
