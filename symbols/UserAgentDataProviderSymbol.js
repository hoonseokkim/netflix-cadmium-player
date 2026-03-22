/**
 * User Agent Data Provider Symbols
 *
 * Dependency injection symbols for the User-Agent Client Hints data
 * provider services. These tokens are used to bind/resolve the sync
 * and async UA data providers in the IoC container.
 *
 * @module symbols/UserAgentDataProviderSymbol
 * @original Module_75236
 */

/**
 * Symbol identifier for the synchronous UserAgentData provider.
 * @type {string}
 */
export const UserAgentDataProviderSymbol = "UserAgentDataProviderSymbol";

/**
 * Symbol identifier for the asynchronous UserAgentData provider.
 * Used when UA-CH data must be fetched via the async
 * `navigator.userAgentData.getHighEntropyValues()` API.
 * @type {string}
 */
export const UserAgentDataAsyncProviderSymbol = "UserAgentDataAsyncProviderSymbol";
