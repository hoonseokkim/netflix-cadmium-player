/**
 * Cadmium Platform Factory
 *
 * Factory function that creates the top-level `cadmium` platform object.
 * This is the root namespace / service locator for the entire Netflix
 * player runtime. It wires together:
 *
 * - Storage (persistent key-value store with async fallback)
 * - Platform clock (monotonic time vs wall-clock time conversion)
 * - EventEmitter for cross-component communication
 * - Console / logging infrastructure
 * - Promise polyfill with `.fail()` alias for `.catch()`
 * - DOM APIs: setImmediate, clearTimeout, requestIdleCallback,
 *   SourceBuffer, MediaSource
 * - Network ping utility (fire-and-forget fetch)
 * - Memory info stub
 *
 * @module CadmiumPlatformFactory
 * @source Module_92623
 */

import { EventEmitter } from '../events/EventEmitter';

// ---------------------------------------------------------------------------
// Storage wrapper - caches values in memory, delegates to async backing store
// ---------------------------------------------------------------------------

let platformApi;
let getCategoryLog;
let backingStorage;
let storageCache;
let getMonotonicTime;
let getWallClockTime;
let platformLogger;
let setImmediateFn;
let requestIdleCallbackFn;
let clearTimeoutFn;
let SourceBufferRef;
let MediaSourceRef;
let internalVersion;
let sdkConfig;

class Storage {
    set(key, value) {
        storageCache[key] = value;
        backingStorage.save(key, value);
    }

    /**
     * Synchronous get with async fallback.
     * If the key is not in the cache, issues an asynchronous load
     * and optionally invokes the callback when available.
     */
    key(key, callback) {
        if (storageCache.hasOwnProperty(key)) {
            return storageCache[key];
        }

        platformLogger.pauseTrace(
            "key: " + key + ", is not available in storage cache and needs to be retrieved asynchronously"
        );

        backingStorage.loading(key, function (result) {
            if (result.success) {
                storageCache[key] = result.data;
                if (callback) callback(result.data);
            } else {
                storageCache[key] = undefined;
            }
        });
    }

    item(key) {
        backingStorage.item(key);
    }

    clear() {
        platformLogger.info("WARNING: Calling unimplemented function Storage.clear()");
    }
}

// ---------------------------------------------------------------------------
// Platform clock - bridges monotonic time and wall-clock time
// ---------------------------------------------------------------------------

class PlatformClock {
    /** @returns {number} Current monotonic time in ms. */
    now() {
        return getWallClockTime();
    }

    /**
     * Convert a wall-clock timestamp to monotonic time.
     * @param {number} wallClockTimestamp
     * @returns {number} Equivalent monotonic time.
     */
    $va(wallClockTimestamp) {
        return wallClockTimestamp + getMonotonicTime() - getWallClockTime();
    }

    /**
     * Convert a monotonic timestamp to wall-clock time.
     * @param {number} monotonicTimestamp
     * @returns {number} Equivalent wall-clock time.
     */
    internal_Mwa(monotonicTimestamp) {
        return monotonicTimestamp + getWallClockTime() - getMonotonicTime();
    }
}

// ---------------------------------------------------------------------------
// Console logger - wraps getCategoryLog with prefix support
// ---------------------------------------------------------------------------

class Console {
    /**
     * @param {string} debugCategory  - Category identifier (e.g. "JS-ASE").
     * @param {*}      groups         - Optional group filter.
     * @param {*}      prefixGroups   - Optional prefix chain.
     */
    constructor(debugCategory, groups, prefixGroups) {
        this.debugCategory = debugCategory;
        this.groups = groups;
        this.prefixGroups = prefixGroups;

        const log = getCategoryLog(debugCategory, groups, prefixGroups);
        this.info = log.info.bind(log);
        this.fatal = log.fatal.bind(log);
        this.error = log.error.bind(log);
        this.RETRY = log.RETRY.bind(log);
        this.pauseTrace = log.pauseTrace.bind(log);
        this.debug = log.debug.bind(log);
        this.log = log.log.bind(log);
    }

    /**
     * Create a child console with an additional prefix.
     */
    withPrefix(prefix) {
        const newPrefixes = [];
        if (this.prefixGroups && Array.isArray(this.prefixGroups)) {
            newPrefixes.push(...this.prefixGroups);
        } else if (this.prefixGroups) {
            newPrefixes.push(this.prefixGroups);
        }
        newPrefixes.push(prefix);
        return new Console(this.debugCategory, this.groups, newPrefixes);
    }

    get prefix() {
        return Array.isArray(this.prefixGroups)
            ? this.prefixGroups.join(" ")
            : this.prefixGroups;
    }
}

// ---------------------------------------------------------------------------
// Promise polyfill - adds `.fail()` as an alias for `.catch()`
// ---------------------------------------------------------------------------

const PromiseWithFail = (function () {
    const P = Promise;
    P.prototype.fail = Promise.prototype.catch;
    return P;
})();

// ---------------------------------------------------------------------------
// Version helper
// ---------------------------------------------------------------------------

function getVersion() {
    return internalVersion ? internalVersion : "0.0.0.0";
}

// ---------------------------------------------------------------------------
// Memory stub
// ---------------------------------------------------------------------------

function getMemoryStats(callback) {
    callback({
        Yjd: 0,
        hmd: 0,
        xgd: 0,
        afd: 0
    });
}

// ---------------------------------------------------------------------------
// Factory export
// ---------------------------------------------------------------------------

/**
 * Initialize and return the cadmium platform object.
 *
 * @param {Object} platformConfig - Host-provided platform bindings.
 * @returns {Object} The cadmium namespace object.
 */
module.exports = function createCadmiumPlatform(platformConfig) {
    platformApi = platformConfig.internal_Wxa;
    getCategoryLog = platformConfig.getCategoryLog;
    backingStorage = platformConfig.storage;
    storageCache = platformConfig.storageCache;
    getMonotonicTime = platformConfig.getMonotonicTime;
    getWallClockTime = platformConfig.getTime;
    platformLogger = platformConfig.ucc;
    setImmediateFn = platformConfig.setImmediate;
    requestIdleCallbackFn = platformConfig.requestIdleCallback;
    clearTimeoutFn = platformConfig.clearTimeout;
    SourceBufferRef = platformConfig.SourceBuffer;
    MediaSourceRef = platformConfig.MediaSource;
    internalVersion = platformConfig.internal_Zgd;
    sdkConfig = platformConfig.SD;

    return {
        name: "cadmium",
        SD: sdkConfig,
        internal_Wxa: platformApi,
        storage: new Storage(),
        Storage: Storage,
        platform: new PlatformClock(),
        events: new EventEmitter(),
        console: new Console("JS-ASE", undefined, "default"),
        Console: Console,
        options: {},
        Promise: PromiseWithFail,
        setImmediate: setImmediateFn,
        clearTimeout: clearTimeoutFn,
        v9c: SourceBufferRef,
        MediaSource: MediaSourceRef,
        requestIdleCallback: requestIdleCallbackFn,
        TE: {
            name: getVersion
        },
        memory: {
            Qfd: getMemoryStats
        },
        C0: platformConfig.C0,
        aqa: platformConfig.aqa,
        AL: platformConfig.AL,
        $qa: platformConfig.$qa,
        ping: function (url) {
            fetch(url).catch(function () {});
        }
    };
};
