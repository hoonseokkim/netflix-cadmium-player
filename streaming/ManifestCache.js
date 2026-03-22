/**
 * Netflix Cadmium Player - ManifestCache
 * Webpack Module 53300 (exported as `tgb`)
 *
 * Central cache for streaming manifests that coordinates manifest fetching,
 * lease management, expiry, dormant caching, and reuse-on-error semantics.
 *
 * The ManifestCache sits between the player and the manifest fetcher (VTa).
 * When a manifest is requested via `fetchManifest()`, the cache:
 *  1. Checks if a dormant (prefetched) copy already exists
 *  2. Otherwise creates a new ManifestCacheItem and fetches via the throttler
 *  3. Manages the item's lifecycle through active -> expired -> deleted states
 *  4. Optionally stores items in a dormant queue for later reuse
 *  5. Optionally stores items in a reuse-on-error cache for fallback
 *
 * Key concepts:
 * - Lease-based access: callers acquire leases on manifest items via a
 *   reference-counted map (manifestCount). When all leases are released,
 *   the item transitions to dormant, reuse-on-error, or deleted.
 * - Dormant cache (eventQueue): optional secondary cache for prefetched
 *   manifests that haven't been promoted to active use yet.
 * - Reuse-on-error cache (reuseOnErrorCache): stores recently-used manifests
 *   that can serve as fallback if a fresh fetch fails.
 * - Throttler: rate-limits concurrent manifest fetches.
 * - Expiry tracking (expiryTracker): monitors TTLs and auto-expires items.
 * - Plugins: extensible hook system for manifest-received and deleted events.
 *
 * Original obfuscated export: `b.tgb`
 */

// Dependencies (webpack module references):
// import { __values, __read, __spreadArray, __awaiter, __generator } from './Module_22970';  // tslib helpers
// import { mathTanh, internal_Jka, jkb, lfb, pX, internal_Kcb, observableBool, np } from './Module_91176'; // utilities
// import { platform } from './Module_66164';           // platform abstraction
// import { EventEmitter } from './Module_90745';       // event emitter
// import { mJa } from './Module_2300';                 // playback lease/cache stats
// import { internal_Mbb } from './Module_84726';       // DormantManifestQueue
// import { wCb } from './Module_37349';                // computeManifestTtl
// import { fHa } from './Module_52885';                // ManifestCacheItem

/**
 * Reasons a manifest can be removed from the active cache.
 * @enum {number}
 */
const ManifestRemovalReason = Object.freeze({
    /** TTL expired naturally */
    expired: 0,
    /** Expired lazily on next access */
    lazyExpired: 1,
    /** Explicitly flushed (e.g. during teardown) */
    flushed: 2,
    /** Removed because viewableId was invalidated */
    removedByViewableId: 3,
    /** Superseded by a newer manifest for the same content */
    superseded: 4,
});

/**
 * Reverse-lookup map for ManifestRemovalReason (number -> string name).
 * @type {Object<number, string>}
 */
const ManifestRemovalReasonNames = Object.freeze(
    Object.fromEntries(
        Object.entries(ManifestRemovalReason).map(([k, v]) => [v, k])
    )
);

/**
 * @class ManifestCache
 * @description Central manifest cache with lease management, dormant caching,
 *   expiry tracking, reuse-on-error fallback, and plugin hooks.
 */
class ManifestCache {
    /**
     * @param {Object} options
     * @param {Object} options.console - Scoped logger instance
     * @param {Object} options.VTa - Manifest fetcher service
     * @param {Function} options.hashLookup - Maps viewableId to a cache key hash
     * @param {Object} options.config - Cache configuration
     * @param {number} options.config.SIb - Maximum number of cached manifests
     * @param {boolean} options.config.manifestCacheDormantCacheEnabled - Enable dormant cache
     * @param {boolean} options.config.manifestCacheReuseOnErrorEnabled - Enable reuse-on-error
     * @param {number} options.config.reuseOnErrorCacheTimeout - TTL for reuse-on-error entries (ms)
     * @param {number} options.config.wid - Default manifest TTL override
     * @param {boolean} options.config.cnd - Use manifest-provided TTL
     * @param {boolean} options.config.hEb - Short TTL mode flag
     */
    constructor(options) {
        /** @private @type {number} Counter for generating unique expiry keys */
        this._expirySequence = 0;

        /** @private @type {Array} Registered cache plugins */
        this.plugins = [];

        /** @private @type {Object} Scoped logger */
        this.console = mathTanh(platform, options.console, "MANIFESTCACHE2");

        /** @private @type {Object} Manifest fetcher service */
        this._manifestFetcher = options.VTa;

        /** @private @type {Function} Hash lookup for viewable IDs */
        this.hashLookup = options.hashLookup;

        /**
         * @private @type {Object} Reference-counted map of active (primary) manifest items.
         * Each entry is lease-counted; when all leases are released the item is evicted.
         */
        this.manifestCount = new internal_Jka(this.console, "manifest-primary");

        /**
         * @private @type {Object} Throttler that rate-limits concurrent manifest fetches.
         */
        this.throttler = new jkb(this.console, {
            /**
             * Called by the throttler to actually initiate a manifest fetch.
             * @param {Object} throttleEntry - The queued entry
             * @param {number} waitTimeMs - How long this entry waited in the queue
             * @returns {Object} Fetch handle with item, key, and promote function
             */
            fDc: (throttleEntry, waitTimeMs) => {
                const viewableId = throttleEntry.item;
                this.console.pauseTrace("Fetching manifest", {
                    NBa: viewableId.J,
                });

                const fetchHandle = this._manifestFetcher.internal_Qsc({
                    tb: [{
                        Xa: viewableId,
                        waitTimeMs,
                        hasManifestCached: throttleEntry.hasManifestCached(),
                    }],
                    $dc: {
                        Vs: viewableId.isPrefetch,
                    },
                });

                return {
                    item: fetchHandle,
                    key: throttleEntry,
                    uT: () => fetchHandle.internal_Nfa(viewableId),
                };
            },
        }, options.config.SIb);

        /** @private @type {Object} Cache configuration */
        this.config = options.config;

        /** @type {EventEmitter} Cache events: manifestScheduled, manifestReceived, activated, expired, deleted */
        this.events = new EventEmitter();

        // Initialize dormant cache if enabled
        if (this.config.manifestCacheDormantCacheEnabled) {
            /**
             * @private @type {Object|undefined} Dormant manifest queue for prefetched items.
             */
            this.eventQueue = new internal_Mbb(
                this.hashLookup,
                options.config,
                options.VTa,
                options.console,
                (manifest) => this._computeExpiryTimestamp(manifest)
            );

            this.eventQueue.events.addListener("itemAdded", (event) => {
                this._expiryTracker.track(event.item);
                if (event.FKc) {
                    this.events.emit("manifestScheduled", {
                        type: "manifestScheduled",
                        LE: event.item,
                    });
                    event.item.manifestRef.then(
                        (manifest) => {
                            this.events.emit("manifestReceived", {
                                type: "manifestReceived",
                                LE: event.item,
                                S: manifest,
                            });
                        },
                        () => { /* ignore rejection */ }
                    );
                }
            });

            this.eventQueue.events.addListener("itemRemoved", (event) => {
                if (event.reason !== "claimed") {
                    this.console.log("Removing dormant manifest item", event.item);
                    this._expiryTracker.delete(event.item);
                    event.item.VLb();

                    if (event.reason === "expired") {
                        this.events.emit("expired", {
                            type: "expired",
                            LE: event.item,
                        });
                    }

                    this.events.emit("deleted", {
                        type: "deleted",
                        LE: event.item,
                    });
                }
            });
        }

        /**
         * @private @type {Object} Secondary map for expired-but-retained manifest items.
         */
        this._expiredManifests = new lfb(this.console, "manifest-expired");

        /**
         * @private @type {Object} LRU cache of manifests kept for reuse-on-error fallback.
         */
        this._reuseOnErrorCache = new pX({
            enabled: this.config.manifestCacheReuseOnErrorEnabled,
        }, undefined, {
            Ig: 1,
            sua: (_key, item) => {
                this._expiryTracker.delete(item);
            },
        });

        /**
         * @private @type {Object} Tracks TTLs and auto-expires manifest items.
         */
        this._expiryTracker = new internal_Kcb((item) => {
            // When an item's TTL expires, remove it from dormant and active caches
            if (this.eventQueue?.hasManifest(item.viewableId)) {
                this.eventQueue?.item(item.viewableId);
            }

            const hash = this.hashLookup(item.viewableId);
            if (this.manifestCount.has(hash)) {
                const entry = this.manifestCount.key(hash);
                try {
                    if (entry?.value === item) {
                        this._expireActiveManifest(hash, ManifestRemovalReason.expired);
                    }
                } finally {
                    entry?.decompressor.release();
                }
            }

            if (this._reuseOnErrorCache.has(hash)) {
                this._reuseOnErrorCache.delete(hash);
            }
        });

        /**
         * @private @type {Object} Observable boolean tracking whether the player is in
         *   a "sticky steering" mode that affects manifest TTL computation.
         */
        this._stickySteeringActive = new observableBool(false);
        this._stickySteeringActive.addListener((change) => {
            if (!change.newValue) {
                this._recalculateExpiries();
            }
        });

        // Wire up plugin hooks for manifest events
        this.events.on("manifestReceived", (event) => {
            for (const plugin of this.plugins) {
                plugin.zid(event.LE, event.manifestRef);
            }
        });

        this.events.on("deleted", (event) => {
            for (const plugin of this.plugins) {
                plugin.internal_Aid(event.LE);
            }
        });
    }

    // ──────────────────────────────────────────────
    //  Computed properties
    // ──────────────────────────────────────────────

    /**
     * Returns a size summary of all cache tiers.
     * @returns {{ activeCount: number, totalActiveCount: number, primaryCount: number, dormantCount: number|undefined, totalCount: number }}
     */
    get size() {
        return {
            Ina: this._expiredCount,
            y9: this._activeAndExpiredCount,
            $md: this._primaryCount,
            vkd: this.eventQueue?.size,
            kVb: this._totalCount,
        };
    }

    /**
     * Returns all manifest cache entries (active + expired) as a flat array.
     * @returns {Array<Object>}
     */
    get _allEntries() {
        const active = Array.from(this.manifestCount.values());
        const expired = Array.from(this._expiredManifests.values());
        return [...active, ...expired];
    }

    /**
     * Total count of manifests across all tiers (active + expired + dormant).
     * @returns {number}
     */
    get _totalCount() {
        return this._activeAndExpiredCount + (this.eventQueue?.size ?? 0);
    }

    /**
     * Count of active + expired manifests (excludes dormant).
     * @returns {number}
     */
    get _activeAndExpiredCount() {
        return this._primaryCount + this._expiredCount;
    }

    /**
     * Count of primary (active, non-expired) manifests.
     * @returns {number}
     */
    get _primaryCount() {
        return this.manifestCount.size;
    }

    /**
     * Count of expired-but-retained manifests.
     * @returns {number}
     */
    get _expiredCount() {
        return this._expiredManifests.size;
    }

    // ──────────────────────────────────────────────
    //  Public API
    // ──────────────────────────────────────────────

    /**
     * Schedules hydration of dormant manifests for a list of viewable IDs.
     * Filters out viewable IDs that already have active manifests and caps
     * the number of hydrations to the remaining cache capacity.
     *
     * @param {Array<Object>} viewableIds - List of viewable ID objects to hydrate
     */
    scheduleHydration(viewableIds) {
        const remainingCapacity = Math.max(0, this.config.SIb - this._activeAndExpiredCount);
        if (remainingCapacity <= 0) return;

        // Map to [hash, viewableId] pairs
        let candidates = viewableIds.map((id) => [this.hashLookup(id), id]);

        // Filter out IDs that already exist in the active manifest map
        candidates = np(candidates, Array.from(this.manifestCount.keys()), (pair, key) => {
            const [hash] = pair;
            return hash === key;
        });

        if (candidates.length > remainingCapacity) {
            const sorted = candidates
                .map(([, viewableId]) => viewableId)
                .sort(c3a)
                .slice(0, remainingCapacity);
            this.eventQueue?.scheduleHydration(sorted);
        } else {
            this.eventQueue?.scheduleHydration(candidates.map(([, viewableId]) => viewableId));
        }
    }

    /**
     * Fetches (or retrieves from cache) a manifest for the given viewable ID.
     * Returns a lease handle that must be released when the caller is done.
     *
     * @param {Object} viewableId - The viewable ID object identifying the content
     * @returns {Object} Lease handle with `.value` (ManifestCacheItem) and `.decompressor.release()`
     */
    fetchManifest(viewableId) {
        return this._acquireManifestLease(viewableId);
    }

    /**
     * Attempts to claim a prefetched manifest from the dormant cache.
     *
     * @param {Object} viewableId - The viewable ID to look up
     * @returns {Object|undefined} The dormant manifest item if found, undefined otherwise
     */
    prefetch(viewableId) {
        if (this.eventQueue?.hasManifest(viewableId)) {
            this.console.pauseTrace("Prefetch manifest found", {
                NBa: viewableId.J,
            });
            return this.eventQueue.claim(viewableId);
        }
    }

    /**
     * Flushes all active manifests from the cache, marking them as flushed.
     * Also clears the dormant queue.
     */
    logBatcher() {
        this.console.pauseTrace("Flush Called");
        this.eventQueue?.clear();

        for (const key of this.manifestCount.keys()) {
            this._expireActiveManifest(key, ManifestRemovalReason.flushed);
        }
    }

    /**
     * Returns diagnostic statistics about the cache state.
     *
     * @returns {Object} Cache statistics including counts, throttler state, plugin stats, and top entries
     */
    getStats() {
        const pluginStats = {};
        for (const plugin of this.plugins) {
            pluginStats[plugin.pkd] = plugin.cgd();
        }

        const top5Entries = this._allEntries.slice(0, 5).map((entry) => ({
            viewableId: entry.value.viewableId.J,
            itemsRequested: entry.value.itemsRequested,
            lastAccessed: entry.value.sZa,
            hasManifest: entry.value.hasManifest,
            isExpired: entry.value.matchExpiry,
        }));

        return {
            manifestCount: this.manifestCount.size,
            totalManifestCount: this.size,
            playbackLeases: mJa.J1a,
            playbackCaches: mJa.I1a,
            activePending: Array.from(this.manifestCount.values())
                .filter((entry) => !entry.value.hasManifest).length,
            expiredPending: Array.from(this._expiredManifests.values())
                .filter((entry) => !entry.value.hasManifest).length,
            throttler: this.throttler.getStats(),
            plugins: pluginStats,
            top5Entries,
        };
    }

    // ──────────────────────────────────────────────
    //  Private methods
    // ──────────────────────────────────────────────

    /**
     * Core manifest acquisition logic. Looks up or creates a manifest item,
     * wraps it in a lease, and handles expiry-on-access retry.
     *
     * @private
     * @param {Object} viewableId - The viewable ID to fetch
     * @param {boolean} [isRetry=false] - Whether this is a retry after lazy expiry
     * @returns {Object} Lease handle
     */
    _acquireManifestLease(viewableId, isRetry = false) {
        const hash = this.hashLookup(viewableId);

        this.console.pauseTrace("Acquiring lease for manifest", {
            NBa: viewableId.J,
            ZR: this.manifestCount.size,
            T2a: !!viewableId.isPrefetch,
            sya: viewableId.priority,
        });

        const lease = this.manifestCount.eWa(hash, () => {
            // Try to claim from dormant/prefetch cache first
            let item = this.prefetch(viewableId);
            if (!item) {
                item = this._createAndFetchManifestItem(hash, viewableId);
                this._updateDormantCapacity();
            }

            if (item.isPrefetch) {
                item.events.on("promoted", () => {
                    this.events.emit("activated", {
                        type: "activated",
                        LE: item,
                    });
                });
            } else {
                this.events.emit("activated", {
                    type: "activated",
                    LE: item,
                });
            }

            return {
                value: item,
                tN: () => {
                    this.console.pauseTrace("Leases removed", {
                        Bld: item.seqId,
                        L: viewableId.J,
                    });
                    this._onAllLeasesReturned(item);
                },
            };
        });

        // If the manifest has already expired, release and retry once
        if (lease.value.matchExpiry) {
            if (isRetry) {
                this.console.error("Skipping Retry on an already expired manifest", {
                    NBa: viewableId.J,
                });
            } else {
                this._expireActiveManifest(hash, ManifestRemovalReason.lazyExpired);
                this.console.pauseTrace("Manifest Expired, releasing", {
                    NBa: viewableId.J,
                });
                lease.decompressor.release();
                return this._acquireManifestLease(viewableId, true);
            }
        }

        // Promote prefetch items to required
        if (!viewableId.isPrefetch) {
            lease.value.internal_Nfa();
        }

        return lease;
    }

    /**
     * Creates a new ManifestCacheItem and initiates the fetch via the throttler.
     *
     * @private
     * @param {string} hash - The cache key hash
     * @param {Object} viewableId - The viewable ID to fetch
     * @returns {Object} The created ManifestCacheItem
     */
    _createAndFetchManifestItem(hash, viewableId) {
        /** @type {Object|undefined} Cached fallback from reuse-on-error cache */
        let fallbackItem;

        /**
         * Lazily retrieves a fallback manifest from the reuse-on-error cache.
         * @returns {Object|undefined}
         */
        const getFallbackItem = () => {
            if (!fallbackItem && this._reuseOnErrorCache.has(hash)) {
                fallbackItem = this._reuseOnErrorCache.key(hash);
            }
            return fallbackItem;
        };

        // Submit to throttler
        const throttleHandle = this.throttler.key({
            key: hash,
            priority: viewableId.priority ?? 0,
            required: !viewableId.isPrefetch,
            item: viewableId,
            hasManifestCached: () => !!getFallbackItem(),
        });

        // Create the cache item
        const cacheItem = new fHa({
            ED: false,
            eR: 0,
            SA: { absolute: Infinity },
            viewableId,
            internal_Nfa: () => {
                this.console.pauseTrace("Promote to required", { key: hash });
                throttleHandle.value.uT();
                this._updateDormantCapacity(0);
            },
        });

        // Initiate the async fetch
        const manifestPromise = this._fetchWithFallback(hash, throttleHandle.value.item, cacheItem, getFallbackItem);
        this._registerManifestItem(hash, cacheItem, manifestPromise).then(() => {
            fallbackItem = undefined;
        });

        // Wire up removal/expiry handlers
        cacheItem.events.on("removed", () => {
            this.console.log("Removing manifest item", cacheItem);
            throttleHandle.decompressor.release();
        });

        cacheItem.events.on("expired", async () => {
            this.console.log("In expiring manifest handler", cacheItem);
            if (cacheItem.YYa.value) {
                throttleHandle.decompressor.release();
            } else {
                cacheItem.YYa.addListener(() => {
                    throttleHandle.decompressor.release();
                });
            }
            this.events.emit("expired", {
                type: "expired",
                LE: cacheItem,
            });
        });

        return cacheItem;
    }

    /**
     * Performs the actual manifest fetch with fallback-on-error logic.
     *
     * @private
     * @param {string} hash - Cache key hash
     * @param {Promise} fetchPromise - The throttled fetch promise
     * @param {Object} cacheItem - The ManifestCacheItem being populated
     * @param {Function} getFallbackItem - Lazy getter for reuse-on-error fallback
     * @returns {Promise<Object>} The resolved manifest
     */
    async _fetchWithFallback(hash, fetchPromise, cacheItem, getFallbackItem) {
        let manifest;
        try {
            const fetchResult = await fetchPromise;
            const entry = await fetchResult.entries.key(cacheItem.viewableId);
            cacheItem.cacheHit = entry.cacheHit;
            cacheItem.eR = entry.la;
            cacheItem.hasFallbackItem = !!getFallbackItem();
            manifest = entry.manifestRef;
        } catch (error) {
            if (xM(error)) {
                throw error;
            }

            this.console.error("Error fetching manifest", {
                aHb: hash,
                error: VC.wy(error),
            });

            const fallback = getFallbackItem();
            if (fallback) {
                this.console.pauseTrace("Reusing manifest from error cache", { aHb: hash });
                manifest = await fallback.S;
                cacheItem.wasFallbackItem = true;
            } else {
                throw error;
            }
        } finally {
            cacheItem.onRequestFinish();
            if (platform.platform) {
                if (manifest) {
                    cacheItem.SA.absolute = this._computeExpiryTimestamp(manifest);
                    cacheItem.pIc();
                } else {
                    cacheItem.SA.absolute = 0;
                }
            }
            this._expiryTracker.internal_Zfa(cacheItem);
        }
        return manifest;
    }

    /**
     * Registers a newly-created manifest item in the primary cache and
     * emits lifecycle events.
     *
     * @private
     * @param {string} hash - Cache key hash
     * @param {Object} cacheItem - The ManifestCacheItem
     * @param {Promise<Object>} manifestPromise - Promise resolving to the manifest
     */
    async _registerManifestItem(hash, cacheItem, manifestPromise) {
        cacheItem.manifestRef = manifestPromise;
        try {
            const manifest = await manifestPromise;
            this.events.emit("manifestReceived", {
                type: "manifestReceived",
                LE: cacheItem,
                S: manifest,
            });
        } catch {
            this._handleFetchFailure(hash, cacheItem);
        }
        this._expiryTracker.track(cacheItem);
        this.console.log("Created manifest Item", cacheItem);
    }

    /**
     * Cleans up cache entries when a manifest fetch fails.
     *
     * @private
     * @param {string} hash - Cache key hash
     * @param {Object} cacheItem - The failed ManifestCacheItem
     */
    _handleFetchFailure(hash, cacheItem) {
        /**
         * Removes the item from the given map if it matches.
         * @param {Object} map - The cache map to check
         * @param {string} key - The key to look up
         * @returns {boolean} Whether the item was deleted
         */
        const removeIfMatch = (map, key) => {
            const entry = map.key(key);
            let deleted = false;
            if (entry) {
                if (entry.value === cacheItem) {
                    this.console.log("Deleting manifest item due failure", cacheItem);
                    map.delete(key);
                    deleted = true;
                }
                entry.decompressor.release();
            }
            return deleted;
        };

        removeIfMatch(this.manifestCount, hash);
        removeIfMatch(this._expiredManifests, hash);

        // Also clean up any aliased entries in the expired map
        const aliases = this._expiredManifests.cvc(hash);
        if (aliases) {
            for (const alias of aliases) {
                if (removeIfMatch(this._expiredManifests, alias)) {
                    this._expiredManifests.internal_Wnc(hash, alias);
                }
            }
        }

        if (this._reuseOnErrorCache.has(hash, cacheItem)) {
            this.console.log("Deleting manifest from reuseOnErrorCache due to failure", cacheItem);
            this._reuseOnErrorCache.delete(hash);
        }
    }

    /**
     * Called when all leases for a manifest item have been released.
     * Decides whether to move the item to dormant cache, reuse-on-error cache,
     * or simply delete it.
     *
     * @private
     * @param {Object} cacheItem - The ManifestCacheItem whose leases are all returned
     */
    _onAllLeasesReturned(cacheItem) {
        const emitDeleted = () => {
            cacheItem.VLb();
            this.events.emit("deleted", {
                type: "deleted",
                LE: cacheItem,
            });
        };

        let action = "none";

        if (!cacheItem.flushed) {
            if (!cacheItem.matchExpiry && cacheItem.isPrefetch) {
                // Prefetched, not expired -> try dormant cache
                if (this.config.manifestCacheDormantCacheEnabled &&
                    !this.eventQueue?.hasManifest(cacheItem.viewableId)) {
                    action = "addToDormant";
                }
            } else if (!cacheItem.isPrefetch && cacheItem.hasManifest) {
                // Non-prefetch with a resolved manifest -> reuse-on-error
                action = "reuseOnErrorCache";
            }
        }

        this.console.log("allLeasesReturned to cache", {
            action,
            ltb: cacheItem,
        });

        switch (action) {
            case "addToDormant":
                if (this.eventQueue) {
                    this.eventQueue?.qVc(cacheItem);
                } else {
                    this._expiryTracker.delete(cacheItem);
                }
                break;

            case "reuseOnErrorCache": {
                const expiryTime = platform.platform.now() + this.config.reuseOnErrorCacheTimeout;
                cacheItem.LOa(expiryTime);
                this._expiryTracker.track(cacheItem);
                const hash = this.hashLookup(cacheItem.viewableId);
                this._reuseOnErrorCache.delete(hash);
                this._reuseOnErrorCache.zFb(hash, cacheItem);
                emitDeleted();
                break;
            }

            default:
                this._expiryTracker.delete(cacheItem);
                emitDeleted();
                break;
        }
    }

    /**
     * Moves an active manifest to the expired pool.
     *
     * @private
     * @param {string} hash - Cache key hash
     * @param {number} reason - ManifestRemovalReason enum value
     */
    _expireActiveManifest(hash, reason) {
        const isForcedRemoval = reason === ManifestRemovalReason.flushed ||
            reason === ManifestRemovalReason.removedByViewableId;

        const expiredKey = `${hash}:${this._expirySequence++}`;
        const item = this.manifestCount.AVb(this._expiredManifests, hash, expiredKey);

        if (item) {
            this.console.debug("Expiring active manifest", {
                aHb: hash,
                flushed: isForcedRemoval,
                reason: ManifestRemovalReasonNames[reason],
            });
            item.LOa(0);
            if (isForcedRemoval) {
                item.flushed = true;
            }
            item.uMc();
        }
    }

    /**
     * Notifies the dormant queue of updated capacity.
     *
     * @private
     * @param {number} [reserveSlots=1] - Number of slots to reserve beyond current usage
     */
    _updateDormantCapacity(reserveSlots = 1) {
        const availableSlots = Math.max(
            0,
            this.config.SIb - this._activeAndExpiredCount - reserveSlots - this._expiredCount
        );
        this.eventQueue?.nrb(availableSlots);
    }

    /**
     * Computes the absolute expiry timestamp for a manifest.
     *
     * @private
     * @param {Object} manifest - The resolved manifest object
     * @returns {number} Absolute expiry timestamp (ms since epoch)
     */
    _computeExpiryTimestamp(manifest) {
        return wCb(manifest, this.config, this._stickySteeringActive.value) + platform.platform.now();
    }

    /**
     * Recalculates expiry timestamps for all active and dormant manifests
     * (e.g., after sticky-steering mode changes).
     *
     * @private
     */
    async _recalculateExpiries() {
        const dormantItems = this.eventQueue?.values() || [];
        const activeItems = Array.from(this.manifestCount.values()).map((entry) => entry.value);
        const allItems = [...activeItems, ...dormantItems];

        for (const item of allItems) {
            if (item.hasManifest && !isFinite(item.SA.absolute)) {
                const manifest = await item.S;
                item.LOa(this._computeExpiryTimestamp(manifest));
                this._expiryTracker.internal_Zfa(item);
            }
        }
    }
}

export { ManifestCache, ManifestRemovalReason };
export default ManifestCache;
