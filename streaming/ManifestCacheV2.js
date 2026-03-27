/**
 * @module ManifestCache
 * @description Two-tier manifest cache (active + dormant) with expiration, throttled
 * fetching, lease management, error-reuse, and plugin notification. Manages the
 * lifecycle of manifest items from prefetch through active use to expiration.
 * @see Module_53300
 */

import { __values, __read, __spreadArray, __awaiter, __generator } from '../core/tslib.js';
import { platform } from '../core/Platform.js';
import {
    EventEmitter, internal_Jka as RefCounter, jkb as Throttler,
    lfb as ExpiredMap, pX as BoundedCache, ExpiryTracker as ExpiryTracker,
    observableBool as ObservableBool, np as filterNewEntries, mathTanh as createLogger,
    c3a as manifestPriorityComparator
} from '../utils/CollectionUtils.js';
import { mJa as LeaseManager } from '../core/LeaseManager.js';
import { DormantQueue as DormantQueue } from '../streaming/DormantManifestQueue.js';
import { wCb as computeExpiry } from '../streaming/ManifestExpiry.js';
import { fHa as ManifestItem } from '../streaming/ManifestItem.js';

/**
 * Removal reasons for active manifests.
 * @enum {number}
 */
const RemovalReason = Object.freeze({
    expired: 0,
    lazyExpired: 1,
    flushed: 2,
    removedByViewableId: 3,
    superseded: 4
});

/**
 * Two-tier manifest cache with active and dormant layers.
 *
 * Active cache: manifests in use (leased to playback sessions).
 * Dormant cache: prefetched manifests awaiting promotion.
 *
 * Features:
 * - Throttled concurrent fetch with configurable max slots (SIb)
 * - Lease-based access with automatic cleanup on release
 * - Error fallback: stale manifest reuse on fetch failure
 * - Plugin hooks for manifest receipt and deletion events
 * - Expiry tracking with configurable TTL per manifest
 * - Background state awareness (suspends expiry in background)
 */
export class ManifestCache {
    /**
     * @param {Object} options
     * @param {Object} options.config - Configuration (SIb = max cache slots, etc.)
     * @param {Object} options.VTa - Manifest fetcher
     * @param {Function} options.hashLookup - Maps viewableId to cache key
     * @param {Object} options.console - Logger
     */
    constructor(options) {
        this.sequenceCounter = 0;
        this.plugins = [];
        this.console = createLogger(platform, options.console, 'MANIFESTCACHE2');
        this.manifestFetcher = options.VTa;
        this.hashLookup = options.hashLookup;
        this.config = options.config;
        this.events = new EventEmitter();

        // Primary active manifest map
        this.activeManifests = new RefCounter(this.console, 'manifest-primary');

        // Fetch throttler
        this.throttler = new Throttler(this.console, {
            fDc: (entry, waitTimeMs) => {
                const viewable = entry.item;
                this.console.pauseTrace('Fetching manifest', { NBa: viewable.J });
                const fetchPromise = this.manifestFetcher.internal_Qsc({
                    tb: [{ Xa: viewable, waitTimeMs, hasManifestCached: entry.hasManifestCached() }],
                    $dc: { Vs: viewable.isPrefetch }
                });
                return {
                    item: fetchPromise,
                    key: entry,
                    uT: () => fetchPromise.internal_Nfa(viewable)
                };
            }
        }, options.config.SIb);

        // Expired manifests
        this.expiredManifests = new ExpiredMap(this.console, 'manifest-expired');

        // Error reuse cache
        this.errorReuseCache = new BoundedCache(
            { enabled: this.config.manifestCacheReuseOnErrorEnabled },
            undefined,
            { Ig: 1, sua: (key, item) => this.expiryTracker.delete(item) }
        );

        // Expiry tracker
        this.expiryTracker = new ExpiryTracker((item) => {
            if (this.dormantQueue?.hasManifest(item.viewableId)) {
                this.dormantQueue?.item(item.viewableId);
            }
            const hash = this.hashLookup(item.viewableId);
            if (this.activeManifests.has(hash)) {
                const ref = this.activeManifests.key(hash);
                try {
                    if (ref?.value === item) this.expireActive(hash, RemovalReason.expired);
                } finally {
                    ref?.decompressor.release();
                }
            }
            if (this.errorReuseCache.has(hash)) this.errorReuseCache.delete(hash);
        });

        // Dormant queue
        if (this.config.manifestCacheDormantCacheEnabled) {
            this.dormantQueue = new DormantQueue(
                this.hashLookup, options.config, options.VTa, options.console,
                (manifest) => this.computeExpiryTime(manifest)
            );
            this.setupDormantListeners();
        }

        // Background state
        this.isBackgrounded = new ObservableBool(false);
        this.isBackgrounded.addListener((event) => {
            if (!event.newValue) this.recomputeExpiries();
        });

        // Plugin notifications
        this.events.on('manifestReceived', (event) => {
            for (const plugin of this.plugins) plugin.zid(event.LE, event.manifestRef);
        });
        this.events.on('deleted', (event) => {
            for (const plugin of this.plugins) plugin.internal_Aid(event.LE);
        });
    }

    /** @returns {Object} Cache size metrics. */
    get size() {
        return {
            Ina: this.expiredCount,
            y9: this.totalActiveCount,
            $md: this.primaryCount,
            vkd: this.dormantQueue?.size,
            kVb: this.totalWithDormant
        };
    }

    get primaryCount() { return this.activeManifests.size; }
    get expiredCount() { return this.expiredManifests.size; }
    get totalActiveCount() { return this.primaryCount + this.expiredCount; }
    get totalWithDormant() { return this.totalActiveCount + (this.dormantQueue?.size ?? 0); }

    /**
     * Acquires a lease for the manifest matching the given viewable.
     * @param {Object} viewableId - Viewable identifier.
     * @returns {Object} Lease with value (ManifestItem) and release method.
     */
    fetchManifest(viewableId) {
        return this.acquireLease(viewableId);
    }

    /**
     * Schedules prefetch of manifests for upcoming viewables.
     * @param {Array} viewableIds - Upcoming viewable identifiers.
     */
    scheduleHydration(viewableIds) {
        const availableSlots = Math.max(0, this.config.SIb - this.totalActiveCount);
        if (availableSlots <= 0) return;

        let candidates = viewableIds.map(id => [this.hashLookup(id), id]);
        candidates = filterNewEntries(candidates, Array.from(this.activeManifests.keys()),
            (a, key) => a[0] === key);

        if (candidates.length > availableSlots) {
            const sorted = candidates.map(([, id]) => id).sort(manifestPriorityComparator).slice(0, availableSlots);
            this.dormantQueue?.scheduleHydration(sorted);
        } else {
            this.dormantQueue?.scheduleHydration(candidates.map(([, id]) => id));
        }
    }

    /** Flushes all active manifests and clears dormant queue. */
    flush() {
        this.console.pauseTrace('Flush Called');
        this.dormantQueue?.clear();
        for (const key of this.activeManifests.keys()) {
            this.expireActive(key, RemovalReason.flushed);
        }
    }

    /** @returns {Object} Diagnostic statistics. */
    getStats() {
        const pluginStats = {};
        for (const plugin of this.plugins) pluginStats[plugin.pkd] = plugin.cgd();

        const topEntries = this.allManifestItems.slice(0, 5).map(ref => ({
            viewableId: ref.value.viewableId.J,
            itemsRequested: ref.value.itemsRequested,
            lastAccessed: ref.value.sZa,
            hasManifest: ref.value.hasManifest,
            isExpired: ref.value.matchExpiry
        }));

        return {
            manifestCount: this.activeManifests.size,
            totalManifestCount: this.size,
            playbackLeases: LeaseManager.J1a,
            playbackCaches: LeaseManager.I1a,
            activePending: Array.from(this.activeManifests.values()).filter(r => !r.value.hasManifest).length,
            expiredPending: Array.from(this.expiredManifests.values()).filter(r => !r.value.hasManifest).length,
            throttler: this.throttler.getStats(),
            plugins: pluginStats,
            top5Entries: topEntries
        };
    }

    /** @private */
    get allManifestItems() {
        return [
            ...Array.from(this.activeManifests.values()),
            ...Array.from(this.expiredManifests.values())
        ];
    }

    /** @private */
    computeExpiryTime(manifest) {
        return computeExpiry(manifest, this.config, this.isBackgrounded.value) + platform.platform.now();
    }

    /** @private */
    acquireLease(viewableId, isRetry = false) {
        const hash = this.hashLookup(viewableId);
        this.console.pauseTrace('Acquiring lease for manifest', {
            NBa: viewableId.J, ZR: this.activeManifests.size,
            T2a: !!viewableId.isPrefetch, sya: viewableId.priority
        });

        const lease = this.activeManifests.eWa(hash, () => {
            let item = this.claimPrefetch(viewableId);
            if (!item) { item = this.createAndFetch(hash, viewableId); this.adjustCapacity(); }
            if (item.isPrefetch) {
                item.events.on('promoted', () => this.events.emit('activated', { type: 'activated', LE: item }));
            } else {
                this.events.emit('activated', { type: 'activated', LE: item });
            }
            return {
                value: item,
                tN: () => {
                    this.console.pauseTrace('Leases removed', { Bld: item.seqId, L: viewableId.J });
                    this.onAllLeasesReturned(item);
                }
            };
        });

        if (lease.value.matchExpiry) {
            if (isRetry) {
                this.console.error('Skipping Retry on an already expired manifest', { NBa: viewableId.J });
            } else {
                this.expireActive(hash, RemovalReason.lazyExpired);
                lease.decompressor.release();
                return this.acquireLease(viewableId, true);
            }
        }
        if (!viewableId.isPrefetch) lease.value.internal_Nfa();
        return lease;
    }

    /** @private */
    claimPrefetch(viewableId) {
        if (!this.dormantQueue?.hasManifest(viewableId)) return undefined;
        this.console.pauseTrace('Prefetch manifest found', { NBa: viewableId.J });
        return this.dormantQueue.claim(viewableId);
    }

    /** @private */
    createAndFetch(hash, viewableId) {
        let errorFallback;
        const throttlerEntry = this.throttler.key({
            key: hash, priority: viewableId.priority ?? 0,
            required: !viewableId.isPrefetch, item: viewableId,
            hasManifestCached: () => {
                if (!errorFallback && this.errorReuseCache.has(hash)) errorFallback = this.errorReuseCache.key(hash);
                return !!errorFallback;
            }
        });
        const item = new ManifestItem({
            ED: false, eR: 0, SA: { absolute: Infinity }, viewableId,
            internal_Nfa: () => {
                this.console.pauseTrace('Promote to required', { key: hash });
                throttlerEntry.value.uT();
                this.adjustCapacity(0);
            }
        });
        this.expiryTracker.track(item);
        item.events.on('removed', () => { throttlerEntry.decompressor.release(); });
        item.events.on('expired', () => {
            if (item.YYa.value) throttlerEntry.decompressor.release();
            else item.YYa.addListener(() => throttlerEntry.decompressor.release());
            this.events.emit('expired', { type: 'expired', LE: item });
        });
        return item;
    }

    /** @private */
    expireActive(hash, reason) {
        const isFlushing = reason === RemovalReason.flushed || reason === RemovalReason.removedByViewableId;
        const item = this.activeManifests.AVb(this.expiredManifests, hash, `${hash}:${this.sequenceCounter++}`);
        if (item) {
            this.console.debug('Expiring active manifest', { hash, flushed: isFlushing, reason: RemovalReason[reason] });
            item.LOa(0);
            if (isFlushing) item.flushed = true;
            item.uMc();
        }
    }

    /** @private */
    adjustCapacity(reserveSlots = 1) {
        const available = Math.max(0, this.config.SIb - this.totalActiveCount - reserveSlots - this.expiredCount);
        this.dormantQueue?.nrb(available);
    }

    /** @private */
    onAllLeasesReturned(item) {
        const hash = this.hashLookup(item.viewableId);
        let action = 'none';
        if (!item.flushed) {
            if (!item.matchExpiry && item.isPrefetch && this.config.manifestCacheDormantCacheEnabled &&
                !this.dormantQueue?.hasManifest(item.viewableId)) {
                action = 'addToDormant';
            } else if (!item.isPrefetch && item.hasManifest) {
                action = 'reuseOnErrorCache';
            }
        }

        switch (action) {
            case 'addToDormant':
                this.dormantQueue ? this.dormantQueue.qVc(item) : this.expiryTracker.delete(item);
                break;
            case 'reuseOnErrorCache': {
                const expiry = platform.platform.now() + this.config.reuseOnErrorCacheTimeout;
                item.LOa(expiry);
                this.expiryTracker.track(item);
                this.errorReuseCache.delete(hash);
                this.errorReuseCache.zFb(hash, item);
                item.VLb();
                this.events.emit('deleted', { type: 'deleted', LE: item });
                break;
            }
            default:
                this.expiryTracker.delete(item);
                item.VLb();
                this.events.emit('deleted', { type: 'deleted', LE: item });
        }
    }

    /** @private */
    setupDormantListeners() {
        this.dormantQueue.events.addListener('itemAdded', (event) => {
            this.expiryTracker.track(event.item);
            if (event.FKc) {
                this.events.emit('manifestScheduled', { type: 'manifestScheduled', LE: event.item });
                event.item.manifestRef.then(manifest => {
                    this.events.emit('manifestReceived', { type: 'manifestReceived', LE: event.item, S: manifest });
                }, () => {});
            }
        });
        this.dormantQueue.events.addListener('itemRemoved', (event) => {
            if (event.reason !== 'claimed') {
                this.expiryTracker.delete(event.item);
                event.item.VLb();
                if (event.reason === 'expired') this.events.emit('expired', { type: 'expired', LE: event.item });
                this.events.emit('deleted', { type: 'deleted', LE: event.item });
            }
        });
    }

    /** @private */
    async recomputeExpiries() {
        const dormantItems = this.dormantQueue?.values() || [];
        const activeItems = Array.from(this.activeManifests.values()).map(ref => ref.value);
        for (const item of [...activeItems, ...dormantItems]) {
            if (item.hasManifest && !isFinite(item.SA.absolute)) {
                const manifest = await item.S;
                item.LOa(this.computeExpiryTime(manifest));
                this.expiryTracker.internal_Zfa(item);
            }
        }
    }
}
