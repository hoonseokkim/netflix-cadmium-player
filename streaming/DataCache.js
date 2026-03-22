/**
 * @file DataCache - TTL-based cache for manifests, LDL data, and metadata
 * @module streaming/DataCache
 * @description A general-purpose cache with time-to-live (TTL) expiration,
 * max entry limits, and LRU-style eviction. Used to cache manifest data,
 * low-delay live (LDL) data, and metadata keyed by movie ID. Supports
 * optional gzip compression, Promise-based async lookups, and cache events.
 *
 * Note: This is distinct from ManifestCache (Module_53300) which handles
 * manifest fetching coordination. This module handles generic data caching
 * with TTL and eviction policies.
 * @original Module_83195
 */

/**
 * Default cache configuration values.
 * @type {Object}
 */
const DEFAULT_CONFIG = {
    /** TTL in milliseconds for each data type */
    ttl: {
        manifest: 1200000,    // 20 minutes
        ldl: 900000,          // 15 minutes
        metadata: 1200000     // 20 minutes
    },
    /** Maximum number of entries per data type */
    maxCount: {
        manifest: 10,
        ldl: 10,
        metadata: 10
    },
    /** Maximum byte size per data type */
    maxSize: {
        manifest: 10240,
        ldl: 10240,
        metadata: 10240
    }
};

/**
 * Create a null-prototype object (no inherited properties).
 * @returns {Object} Clean object with no prototype chain
 */
function createNullObject() {
    return Object.create(null);
}

/**
 * Check if a value is not undefined.
 * @param {*} value
 * @returns {boolean}
 */
function isDefined(value) {
    return typeof value !== 'undefined';
}

/**
 * Return the first defined value from the arguments.
 * @param {...*} values
 * @returns {*}
 */
function firstDefined(...values) {
    for (const value of values) {
        if (isDefined(value)) {
            return value;
        }
    }
}

/**
 * Calculate the deep byte size of an object graph.
 * Handles circular references. Returns -1 if circular references are detected
 * and the `checkCircular` flag is set.
 *
 * @param {*} obj - Object to measure
 * @param {boolean} [checkCircular] - If true, return -1 on circular refs
 * @returns {number} Approximate byte size
 */
function calculateObjectSize(obj, checkCircular) {
    function hasCircularRef(target) {
        const visited = [];
        return (function check(current) {
            if (current && typeof current === 'object') {
                if (visited.indexOf(current) !== -1) return true;
                visited.push(current);
                for (const key in current) {
                    if (current.hasOwnProperty(key) && check(current[key])) {
                        return true;
                    }
                }
            }
            return false;
        })(target);
    }

    if (checkCircular && hasCircularRef(obj)) {
        return -1;
    }

    const visited = [];
    const stack = [obj];
    let totalSize = 0;

    while (stack.length) {
        const current = stack.pop();
        if (typeof current === 'boolean') {
            totalSize += 4;
        } else if (typeof current === 'string') {
            totalSize += 2 * current.length;
        } else if (typeof current === 'number') {
            totalSize += 8;
        } else if (typeof current === 'object' && visited.indexOf(current) === -1) {
            visited.push(current);
            for (const key in current) {
                stack.push(current[key]);
            }
        }
    }
    return totalSize;
}

/**
 * TTL-based cache for streaming data including manifests, LDL data, and metadata.
 *
 * @class DataCache
 */
export class DataCache {
    /**
     * @param {Object} options - Cache configuration
     * @param {Object} options.log - Logger instance
     * @param {Object} options.playerCore - Player core for time functions
     * @param {Object} [options.Promise] - Promise constructor for async mode
     * @param {Function} [options.op] - Optional compression function (e.g., gzip)
     * @param {Function} [options.GJ] - Optional decompression function
     * @param {boolean} [options.xE=false] - Enable verbose debug logging
     * @param {Object} [options.events] - Event emitter for cache events
     */
    constructor(options) {
        /** @type {Object} Logger */
        this.log = options.log;

        /** @type {Object} Player core reference */
        this.playerCore = options.playerCore;

        /** @type {Object} Cache storage keyed by field type */
        this.store = createNullObject();

        /** @type {Object} Promise constructor (if async mode) */
        this.Promise = options.Promise;

        /** @type {Function|undefined} Compression function */
        this.compressFn = options.op;

        /** @type {Function|undefined} Decompression function */
        this.decompressFn = options.GJ;

        /** @type {boolean} Verbose debug mode */
        this.debugMode = options.xE || false;

        /** @type {boolean} Whether eviction is suspended */
        this._evictionSuspended = false;

        /** @type {Object} TTL configuration per data type */
        this.ttlConfig = createNullObject();

        /** @type {Object} Max count configuration per data type */
        this.maxCountConfig = createNullObject();

        /** @type {Object} Max size configuration per data type */
        this.maxSizeConfig = createNullObject();

        this._initConfig(options);

        if (options.events) {
            /** @type {Object} Event emitter for add/delete cache events */
            this.events = options.events;
        }
    }

    /**
     * Initialize TTL, max count, and max size from options or defaults.
     * @private
     */
    _initConfig(options) {
        this.ttlConfig.manifest = firstDefined(options.manifestTtl, DEFAULT_CONFIG.ttl.manifest);
        this.ttlConfig.ldl = firstDefined(options.ldlTtl, DEFAULT_CONFIG.ttl.ldl);
        this.ttlConfig.metadata = firstDefined(options.metadataTtl, DEFAULT_CONFIG.ttl.metadata);

        this.maxCountConfig.manifest = firstDefined(options.manifestMaxCount, DEFAULT_CONFIG.maxCount.manifest);
        this.maxCountConfig.ldl = firstDefined(options.ldlMaxCount, DEFAULT_CONFIG.maxCount.ldl);
        this.maxCountConfig.metadata = firstDefined(options.metadataMaxCount, DEFAULT_CONFIG.maxCount.metadata);

        this.maxSizeConfig.manifest = firstDefined(options.manifestMaxSize, DEFAULT_CONFIG.maxSize.manifest);
        this.maxSizeConfig.ldl = firstDefined(options.ldlMaxSize, DEFAULT_CONFIG.maxSize.ldl);
        this.maxSizeConfig.metadata = firstDefined(options.metadataMaxSize, DEFAULT_CONFIG.maxSize.metadata);
    }

    /**
     * Check if cached data exists and is not expired for a given movie and field.
     * @param {string|number} movieId
     * @param {string} field - Data type (e.g., 'manifest', 'ldl', 'metadata')
     * @returns {boolean}
     */
    has(movieId, field) {
        this._assertDefined(movieId);
        this._assertDefined(field);
        return !!this._lookup(movieId, field, undefined).value;
    }

    /**
     * Internal lookup that returns value, reason, and log info.
     * @private
     */
    _lookup(movieId, field, capsKey) {
        const result = { value: null, reason: '', log: '' };
        const fieldStore = this.store[field];
        capsKey = capsKey || 'DEFAULTCAPS';

        if (typeof fieldStore === 'undefined') {
            result.log = `cache miss: no data exists for field:${field}`;
            result.reason = 'unavailable';
            return result;
        }

        if (typeof fieldStore[movieId] === 'undefined') {
            result.log = `cache miss: no data exists for movieId:${movieId}`;
            result.reason = 'unavailable';
        } else {
            const entry = fieldStore[movieId][capsKey];
            if (entry && entry.value) {
                if (this._isExpired(entry)) {
                    result.log = `cache miss: ${field} data expired for movieId:${movieId}`;
                    result.reason = 'expired';
                    this.clearData(movieId, field, capsKey, false, 'expired');
                } else {
                    result.log = this.Promise && entry.value instanceof this.Promise
                        ? `cache hit: ${field} request in flight for movieId:${movieId}`
                        : `cache hit: ${field} available for movieId:${movieId}`;
                    result.value = entry.value;
                }
            } else {
                result.log = `cache miss: ${field} data not available for movieId:${movieId}`;
                result.reason = 'unavailable';
            }
        }
        return result;
    }

    /**
     * Get data from the cache. Returns a Promise in async mode.
     * @param {string|number} movieId
     * @param {string} field
     * @param {string} [capsKey]
     * @returns {*|Promise}
     */
    getData(movieId, field, capsKey) {
        this._assertDefined(movieId);
        this._assertDefined(field);

        const result = this._lookup(movieId, field, capsKey);
        this.log.trace(result.log);

        if (result.value) {
            if (this.Promise) {
                return result.value instanceof this.Promise
                    ? result.value
                    : Promise.resolve(result.value);
            }
            return this.decompressFn
                ? JSON.parse(this.decompressFn(result.value, 'gzip', false))
                : result.value;
        }
        return this.Promise ? Promise.reject(result.reason) : result.reason;
    }

    /**
     * Store data in the cache with TTL-based expiration.
     * @param {string|number} movieId
     * @param {string} field
     * @param {*} data
     * @param {Function} [destroyFn] - Cleanup callback when entry is evicted
     * @param {string} [capsKey]
     * @param {number} [customTtl] - Override TTL for this entry
     * @returns {Object} The created cache entry
     */
    setData(movieId, field, data, destroyFn, capsKey, customTtl) {
        this._assertDefined(movieId);
        this._assertDefined(field);

        const store = this.store;
        const key = capsKey || 'DEFAULTCAPS';

        if (!store[field]) {
            store[field] = createNullObject();
            Object.defineProperty(store[field], 'currentCount', {
                enumerable: false, configurable: true, writable: true, value: 0
            });
            Object.defineProperty(store[field], 'size', {
                enumerable: false, configurable: true, writable: true, value: 0
            });
        }

        data = this.compressFn ? this.compressFn(JSON.stringify(data), 'gzip', true) : data;

        const fieldStore = store[field];
        this._makeSpace(movieId, field, key, fieldStore);

        const self = this;
        const ttl = customTtl || this.ttlConfig[field] + 1;

        const entry = {
            creationTime: this.playerCore.getTime(),
            value: data,
            size: 0,
            type: field,
            destroyFn: destroyFn,
            ttl: ttl,
            expiryTimer: setTimeout(() => {
                self.clearData(movieId, field, key, false, 'expired');
            }, ttl)
        };

        fieldStore[movieId] = fieldStore[movieId] || createNullObject();
        fieldStore[movieId][key] = entry;
        fieldStore.size += 0;
        fieldStore.currentCount++;

        if (this.events) {
            this.events.emit('addedCacheItem', entry);
        }

        return entry;
    }

    /**
     * Find the oldest or first expired entry for eviction.
     * @private
     */
    _findEvictionCandidate(fieldStore, capsKey) {
        let oldestId;
        let oldestTime = Number.POSITIVE_INFINITY;
        let expiredId;

        Object.keys(fieldStore).every((id) => {
            const entry = fieldStore[id] && fieldStore[id][capsKey];
            if (entry && entry.value && this._isExpired(entry)) {
                expiredId = id;
            }
            if (entry && entry.value && entry.creationTime < oldestTime) {
                oldestTime = entry.creationTime;
                oldestId = id;
            }
            return true;
        });

        return expiredId || oldestId;
    }

    /**
     * Ensure space in the cache by evicting if at capacity.
     * @private
     */
    _makeSpace(movieId, field, capsKey, fieldStore) {
        const currentCount = fieldStore.currentCount;
        const maxCount = this.maxCountConfig[field];
        const existing = fieldStore[movieId] && fieldStore[movieId][capsKey];

        let removeId;
        let reason;

        if (existing && existing.value) {
            removeId = movieId;
            reason = 'promise_or_expired';
        } else if (currentCount >= maxCount && !this._evictionSuspended) {
            removeId = this._findEvictionCandidate(fieldStore, capsKey);
            reason = 'cache_full';
        }

        if (this.debugMode) {
            this.log.debug('makespace ', {
                maxCount,
                currentCount: fieldStore.currentCount,
                field,
                movieId,
                movieToBeRemoved: removeId
            });
        }

        if (removeId) {
            this.clearData(removeId, field, capsKey, undefined, reason);
            this.log.debug('removed from cache: ', removeId, field);
        }
    }

    /**
     * Clear all entries except for the specified movie ID.
     * @param {string|number} keepMovieId
     * @param {string[]} fields
     */
    clearAllExcept(keepMovieId, fields) {
        this._assertDefined(keepMovieId);
        const self = this;
        const keepId = keepMovieId + '';

        fields.forEach((field) => {
            const fieldStore = self.store[field];
            if (fieldStore) {
                Object.keys(fieldStore).forEach((id) => {
                    if (id !== keepId) {
                        self.clearData(id, field, undefined, undefined, 'clear_all');
                    }
                });
            }
        });
    }

    /**
     * Remove a specific cache entry.
     * @param {string|number} movieId
     * @param {string} field
     * @param {string} [capsKey]
     * @param {boolean} [suppressDestroyFn]
     * @param {string} [reason]
     */
    clearData(movieId, field, capsKey, suppressDestroyFn, reason) {
        this._assertDefined(movieId);
        this._assertDefined(field);

        const fieldStore = this.store[field];
        const movieStore = fieldStore ? fieldStore[movieId] : undefined;
        capsKey = capsKey || 'DEFAULTCAPS';

        if (movieStore && movieStore[capsKey]) {
            fieldStore.size -= movieStore[capsKey].size;
            fieldStore.currentCount--;

            const entry = movieStore[capsKey];
            if (entry) {
                clearTimeout(entry.expiryTimer);
                movieStore[capsKey] = undefined;
                if (!suppressDestroyFn && entry.destroyFn) {
                    entry.destroyFn();
                }
            }

            if (this.events) {
                this.events.emit('deletedCacheItem', {
                    creationTime: entry.creationTime,
                    destroyFn: entry.destroyFn,
                    size: entry.size,
                    type: entry.type,
                    value: entry.value,
                    reason: reason,
                    movieId: movieId
                });
            }
        }
    }

    /**
     * Refresh the TTL for an existing cache entry.
     * @param {string|number} movieId
     * @param {string} field
     * @param {string} [capsKey]
     * @param {number} [customTtl]
     */
    refreshTtl(movieId, field, capsKey, customTtl) {
        this._assertDefined(movieId);
        this._assertDefined(field);

        const self = this;
        const fieldStore = this.store[field];
        const movieStore = fieldStore ? fieldStore[movieId] : undefined;
        const key = capsKey || 'DEFAULTCAPS';
        const entry = movieStore && movieStore[key];
        const ttl = customTtl || this.ttlConfig[field] + 1;

        if (entry) {
            clearTimeout(entry.expiryTimer);
            entry.creationTime = this.playerCore.getTime();
            entry.ttl = ttl;
            entry.expiryTimer = setTimeout(() => {
                self.clearData(movieId, field, key, false, 'expired');
            }, ttl);
        }
    }

    /**
     * Reset a field's store.
     * @param {string} field
     */
    resetField(field) {
        this._assertDefined(field);
        this.store[field] = createNullObject();
        this.store[field].currentCount = 0;
        this.store[field].size = 0;
    }

    /**
     * Check if an entry has expired.
     * @private
     */
    _isExpired(entry) {
        return this.playerCore.getTime() - entry.creationTime > entry.ttl;
    }

    /**
     * Get statistics about cache contents.
     * @param {number} [startTime]
     * @param {number} [endTime]
     * @param {string} [capsKey='DEFAULTCAPS']
     * @returns {Object}
     */
    getStats(startTime, endTime, capsKey) {
        const stats = {};
        const self = this;
        const store = this.store;
        const timeRangeFilter = isDefined(startTime) && isDefined(endTime);
        const key = capsKey || 'DEFAULTCAPS';

        Object.keys(store).forEach((field) => {
            const ids = Object.keys(store[field]);
            const fieldStore = store[field];

            ids.forEach((id) => {
                const entry = fieldStore && fieldStore[id] && fieldStore[id][key];
                if (entry && isDefined(entry.value) && !(entry.value instanceof self.Promise)) {
                    stats[field] = (stats[field] | 0) + 1;
                    if (self._isExpired(entry)) {
                        stats[field + '_expired'] = (stats[field + '_expired'] | 0) + 1;
                    }
                    if (timeRangeFilter && entry.creationTime >= startTime && entry.creationTime < endTime) {
                        stats[field + '_delta'] = (stats[field + '_delta'] | 0) + 1;
                    }
                }
            });
        });

        return stats;
    }

    /**
     * Get the detailed state of all cache entries.
     * @param {string} [capsKey='DEFAULTCAPS']
     * @returns {Array<{movieId: string, state: string, type: string, size: number}>}
     */
    getState(capsKey) {
        const entries = [];
        const self = this;
        const store = this.store;
        const key = capsKey || 'DEFAULTCAPS';

        Object.keys(store).forEach((field) => {
            const ids = Object.keys(store[field]);
            const fieldStore = store[field];

            ids.forEach((id) => {
                const entry = fieldStore && fieldStore[id] && fieldStore[id][key];
                if (entry && isDefined(entry.value)) {
                    const state = self._isExpired(entry) ? 'expired'
                        : entry.value instanceof self.Promise ? 'loading'
                        : 'cached';
                    entries.push({ movieId: id, state, type: field, size: entry.size });
                }
            });
        });

        return entries;
    }

    /**
     * Suspend eviction temporarily.
     */
    suspendEviction() {
        this._evictionSuspended = true;
    }

    /**
     * Resume eviction and evict excess entries.
     */
    resumeEviction() {
        this._evictionSuspended = false;
        while (this.store.manifest.currentCount > this.maxCountConfig.manifest) {
            const evictId = this._findEvictionCandidate(this.store.manifest, undefined);
            this.clearData(evictId, 'manifest', undefined, undefined, 'eviction');
            this.log.debug('removed from cache: ', evictId, 'manifest');
        }
    }

    /**
     * Assert a debug condition.
     * @private
     */
    _assertDefined(value) {
        if (!value && (this.log.error('Debug Assert Failed', undefined), this.debugMode)) {
            throw Error('Debug Assert Failed ');
        }
    }
}

export default DataCache;
