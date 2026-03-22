/**
 * Netflix Cadmium Player - User Agent Data Provider
 * Deobfuscated from Module_76892
 *
 * Provides access to high-entropy User-Agent Client Hints data
 * (architecture and platformVersion) via the navigator.userAgentData API.
 * Exports two injectable classes:
 *   - AsyncUserAgentDataProvider: returns promises for the data
 *   - SyncUserAgentDataProvider: returns cached synchronous results
 */

import { __decorate } from '../core/tslib';
import { injectable } from '../ioc/inversify';
import { navigator as navRef } from '../core/GlobalScope';

/** Default state before data is available */
const UNINITIALIZED = {
    isSupported: false,
    reason: "uninitialized"
};

/** Cached synchronous architecture result */
let architectureResult = { ...UNINITIALIZED };

/** Cached synchronous platform version result */
let platformVersionResult = { ...UNINITIALIZED };

/**
 * Initiate the high-entropy User-Agent data request.
 * This runs once at module load time.
 */
const highEntropyPromise = navRef?.userAgentData?.getHighEntropyValues?.call(
    navRef.userAgentData,
    ["architecture", "platformVersion"]
);

// When the promise resolves, cache the results for synchronous access
highEntropyPromise?.then(function (data) {
    const arch = data.architecture;
    architectureResult = arch
        ? { isSupported: true, architecture: arch }
        : { isSupported: false, reason: "undefined" };

    const version = data.platformVersion;
    platformVersionResult = version
        ? { isSupported: true, version: version }
        : { isSupported: false, reason: "undefined" };
}).catch(function () {
    architectureResult = { isSupported: false, reason: "exception" };
    platformVersionResult = { isSupported: false, reason: "exception" };
});

/**
 * Synchronous User-Agent data provider.
 * Returns cached results from the high-entropy data request.
 * Results may be "uninitialized" if the async request hasn't completed yet.
 */
class SyncUserAgentDataProvider {
    get architecture() {
        return architectureResult;
    }

    get platformVersion() {
        return platformVersionResult;
    }
}

SyncUserAgentDataProvider = __decorate([injectable()], SyncUserAgentDataProvider);
export { SyncUserAgentDataProvider };

/**
 * Async User-Agent data provider.
 * Returns promises that resolve with the raw values from
 * the User-Agent Client Hints API.
 */
class AsyncUserAgentDataProvider {
    get architecture() {
        return Promise.resolve().then(function () {
            return highEntropyPromise?.then(function (data) {
                return data.architecture;
            });
        });
    }

    get platformVersion() {
        return Promise.resolve().then(function () {
            return highEntropyPromise?.then(function (data) {
                return data.platformVersion;
            });
        });
    }
}

AsyncUserAgentDataProvider = __decorate([injectable()], AsyncUserAgentDataProvider);
export { AsyncUserAgentDataProvider };
