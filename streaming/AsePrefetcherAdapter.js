/**
 * Netflix Cadmium Player - ASE Prefetcher Adapter
 * Component: AsePrefetcherAdapter (Module 61170)
 *
 * Implements the AsePrefetcherAdapterSymbol interface to manage manifest
 * prefetching for upcoming content in Netflix's streaming engine.
 *
 * Responsibilities:
 * - Prefetching manifests for anticipated content (next episodes, branches)
 * - Managing a wishlist of content items prioritized for prefetching
 * - Handling auxiliary manifest fetching for Dynamic Ad Insertion (DAI)
 * - Caching manifest entries and tracking their expiration
 * - Coordinating ad break hydration requests with the manifest store
 * - Bridging between the playgraph's content schedule and the manifest layer
 *
 * The adapter maintains a manifest cache and a configuration provider (the
 * "current config provider") that drives the actual download scheduling.
 * When the playgraph determines which viewables are likely to be played next,
 * it pushes them through this adapter, which ensures their manifests are
 * fetched and cached ahead of time.
 *
 * @injectable
 * @implements {AsePrefetcherAdapter}
 */

import { __decorate, __param } from 'tslib'; // Module 22970
import { LoggerToken } from '../core/LoggerToken'; // Module 87386
import { getTrackIndex, TimeUtil, PlayerError as bD } from '../media/TrackHelpers'; // Module 45247
import { aseGlobals } from '../core/AseGlobals'; // Module 20318
import { ConfigToken } from '../core/ConfigToken'; // Module 4203
import { createFormatConfig } from '../media/FormatConfig'; // Module 29204
import { ManifestFlavor } from '../streaming/ManifestFlavor'; // Module 72639
import { AsePrefetcherProviderSymbol, AsePrefetcherAdapterSymbol } from '../streaming/AsePrefetcherSymbols'; // Module 67590
import { injectable, injectDecorator } from '../core/Injectable'; // Module 22674
import { PrefetchItemGeneratorToken } from '../streaming/PrefetchItemGeneratorToken'; // Module 59315
import { EventEmitter } from '../events/EventEmitter'; // Module 90745
import { ManifestStoreToken } from '../streaming/ManifestStoreToken'; // Module 49745
import { ManifestCache } from '../streaming/ManifestCache'; // Module 64213
import { PrefetchFilter } from '../streaming/PrefetchFilter'; // Module 25505
import { assert } from '../assert/assert'; // Module 45146
import { PrefetchItemGenerator } from '../streaming/PrefetchItemGenerator'; // Module 37991
import { AbortController } from '../network/AbortController'; // Module 91176
import { getManifestFetchType } from '../streaming/ManifestFetchType'; // Module 54973
import { NetworkError } from '../network/NetworkError'; // Module 31149

/**
 * A simple deferred promise wrapper that exposes resolve/reject externally.
 * Used to track when a prefetch item has been fully prepared.
 */
class DeferredPromise {
  constructor() {
    /** @type {Promise<any>} */
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

/**
 * The main prefetcher adapter class. Manages manifest prefetching for
 * upcoming viewables and coordinates with the manifest cache and
 * configuration provider.
 */
class AsePrefetcherAdapter {
  /**
   * @param {Logger} logger - Logger instance
   * @param {Function} configFactory - Factory function returning prefetch config
   * @param {PrefetchItemGeneratorToken} itemGeneratorToken - Token for item generator binding
   * @param {Function} configProviderFactory - Factory for creating the config provider
   * @param {ManifestStore} manifestStore - The manifest store for fetching manifests
   */
  constructor(logger, configFactory, itemGeneratorToken, configProviderFactory, manifestStore) {
    /**
     * Token for binding the item generator to the configuration provider.
     * @type {PrefetchItemGeneratorToken}
     * @private
     */
    this._itemGeneratorToken = itemGeneratorToken;

    /**
     * Factory function for creating the prefetch configuration provider.
     * @type {Function}
     * @private
     */
    this._configProviderFactory = configProviderFactory;

    /**
     * The manifest store used for fetching manifests.
     * @type {ManifestStore}
     * @private
     */
    this.manifestStore = manifestStore;

    /**
     * The current wishlist of items to prefetch, ordered by priority.
     * @type {Array<PrefetchWishlistItem>}
     * @private
     */
    this._wishlistItems = [];

    /**
     * Map of viewable ID -> { wishlistEntry, viewableInfo, deferredPromise }
     * Tracks active prefetch entries and their resolution state.
     * @type {Map<string, {wishlistEntry: Object, viewableInfo: Object, deferredPromise: DeferredPromise}>}
     * @private
     */
    this._prefetchEntries = new Map();

    /**
     * Map of auxiliary manifest cache key -> { adBreakToken, manifest }
     * Stores fetched auxiliary manifests for ad insertion.
     * @type {Map<string, Object>}
     * @private
     */
    this._auxiliaryManifestMap = new Map();

    /**
     * Callback invoked when a prefetch completes. Resolves the deferred
     * promise for the corresponding viewable.
     * @type {Function}
     * @private
     */
    this._onPrefetchComplete = (event) => {
      const viewableId = getTrackIndex(event.wishListItem.key);
      if (this._prefetchEntries.has(viewableId)) {
        const entry = this._prefetchEntries.get(viewableId);
        const viewableInfo = entry.viewableInfo;
        const deferred = entry.deferredPromise;
        deferred.resolve?.(viewableInfo);
      }
    };

    /**
     * Callback invoked when a manifest is removed from cache or playback
     * is closing. Marks the cached entry as expired and cleans up.
     * @type {Function}
     * @private
     */
    this._onManifestRemoved = (event) => {
      const viewableId = event.J;
      const manifestRef = event.manifestRef;

      if (event.target.R8a(event.J)) return;

      // Mark the main manifest cache entry as expired
      if (this.manifestCache.has({ J: viewableId })) {
        this.manifestCache.getManifestCacheEntry(viewableId).expired = true;
      }

      // Mark any auxiliary manifest cache entries as expired
      manifestRef?.then((manifest) => {
        const content = manifest.manifestContent;
        if (content?.auxiliaryManifestToken && content.auxiliaryManifests) {
          content.auxiliaryManifests.forEach((auxManifest) => {
            const auxiliaryOptions = {
              Mf: {
                Kb: content.auxiliaryManifestToken,
                parentManifestId: viewableId,
              },
            };
            const auxKey = {
              J: auxManifest.R,
              parentManifestId: content.R,
              auxiliaryManifestToken: content.auxiliaryManifestToken,
            };
            if (this.manifestCache.has(auxKey)) {
              this.manifestCache.getManifestCacheEntry(auxManifest.R, auxiliaryOptions).expired = true;
            }
          });
        }
      }).catch(() => {});

      this._removePrefetchEntry(viewableId);
      this._updateWishlistAndNotify(this._wishlistItems);
    };

    /**
     * Callback to handle auxiliary manifest expiration on playback close
     * or manifest removal. Marks the specific auxiliary entry as expired.
     * @type {Function}
     * @private
     */
    this._onAuxiliaryManifestRemoved = (event, auxiliaryKey) => {
      const viewableId = event.J;
      const manifestRef = event.manifestRef;

      if (event.target.R8a(viewableId)) return;

      manifestRef?.then((manifest) => {
        const content = manifest.manifestContent;
        if (
          content?.auxiliaryManifestToken &&
          content.auxiliaryManifestToken === auxiliaryKey.auxiliaryManifestToken &&
          viewableId === auxiliaryKey.parentManifestId
        ) {
          const auxiliaryOptions = {
            Mf: {
              Kb: content.auxiliaryManifestToken,
              parentManifestId: viewableId,
            },
          };
          if (this.manifestCache.has(auxiliaryKey)) {
            this.manifestCache.getManifestCacheEntry(auxiliaryKey.J, auxiliaryOptions).expired = true;
          }
          this._auxiliaryManifestMap.delete(this.manifestCache.generateKey(auxiliaryKey));
        }
      }).catch(() => {});
    };

    /** @type {Logger} */
    this.logger = logger.createSubLogger('VideoPreparer');

    /** @type {Object} */
    this.config = configFactory();
  }

  /**
   * Lazily-initialized configuration provider that drives prefetch scheduling.
   * Sets up the item generator, filter, and event listeners on first access.
   * @type {ConfigurationProvider}
   */
  get currentConfigProvider() {
    if (!this.configurationProvider) {
      this.configurationProvider = this._configProviderFactory();
      this.configurationProvider
        .addItemGenerator(new PrefetchItemGenerator())
        .D5a(this._itemGeneratorToken)
        .BSb(new PrefetchFilter())
        .eSb({ hI: this.config.sQc });
      this.configurationProvider.events.on('prefetchComplete', this._onPrefetchComplete);
    }
    return this.configurationProvider;
  }

  /**
   * Initializes the manifest cache with callbacks for updating download
   * state, handling ad break uploads, and validating ad break requests.
   *
   * @param {PlaybackContext} playbackContext - The current playback context
   */
  initializeCache(playbackContext) {
    this.manifestCache = new ManifestCache(
      (viewableId, auxiliaryOptions) => {
        return this.updateDownloadState(viewableId, playbackContext, aseGlobals.playgraphConfig, auxiliaryOptions);
      },
      (adBreakRequest) => {
        return this.hydrateAdBreak(playbackContext, adBreakRequest);
      },
      (adBreakInfo, abortSignal) => {
        return this.prefetchDaiManifests(adBreakInfo, playbackContext, abortSignal);
      }
    );
  }

  /**
   * Fetches a manifest for a viewable and begins tracking it in the wishlist.
   * Returns a promise that resolves when the prefetch item is fully prepared.
   *
   * @param {Object} viewableInfo - Information about the viewable to prefetch
   * @param {PlaybackContext} playbackContext - The current playback context
   * @returns {Promise<any>} Resolves when the prefetch item is ready
   */
  preparePrefetch(viewableInfo, playbackContext) {
    // Register event listeners if not already registered
    if (playbackContext.events.listeners('manifestRemovedFromCache').indexOf(this._onManifestRemoved) === -1) {
      playbackContext.events.on('manifestRemovedFromCache', this._onManifestRemoved);
    }
    if (playbackContext.events.listeners('playbackClosing').indexOf(this._onManifestRemoved) === -1) {
      playbackContext.events.on('playbackClosing', this._onManifestRemoved);
    }

    return this._fetchManifestForViewable(viewableInfo.R, playbackContext, viewableInfo.manifestSessionData)
      .then(() => {
        this._updateWishlistAndNotify(this._buildPrioritizedWishlist(this._createWishlistEntry(viewableInfo, playbackContext)));
        return this._prefetchEntries.get(viewableInfo.R).deferredPromise.promise;
      });
  }

  /**
   * Returns stats from the current configuration provider.
   * @returns {Object} Prefetch statistics
   */
  getStats() {
    return this.currentConfigProvider.getStats();
  }

  /**
   * Stores an auxiliary manifest entry in the auxiliary manifest map.
   *
   * @param {Object} auxiliaryKey - Key identifying the auxiliary manifest
   * @param {Object} manifest - The auxiliary manifest data
   * @param {string} [adBreakToken] - Optional ad break token
   */
  storeAuxiliaryManifest(auxiliaryKey, manifest, adBreakToken) {
    const entry = {
      Pj: adBreakToken,
      S: manifest,
    };
    this._auxiliaryManifestMap.set(this.manifestCache.generateKey(auxiliaryKey), entry);
  }

  /**
   * Retrieves a previously fetched auxiliary manifest by its key.
   *
   * @param {Object} auxiliaryKey - Key identifying the auxiliary manifest
   * @returns {Object|undefined} The auxiliary manifest entry, or undefined
   */
  getAuxiliaryManifest(auxiliaryKey) {
    return this._auxiliaryManifestMap.get(this.manifestCache.generateKey(auxiliaryKey));
  }

  /**
   * Builds a prioritized wishlist by placing the given entry first,
   * followed by existing items (excluding duplicates), trimmed to the
   * configured maximum count. Optionally assigns priority indices.
   *
   * @param {Object} primaryEntry - The entry to prioritize
   * @returns {Array<Object>} The prioritized wishlist
   * @private
   */
  _buildPrioritizedWishlist(primaryEntry) {
    const combined = [primaryEntry, ...this._wishlistItems.filter((item) => {
      return getTrackIndex(item.key) !== getTrackIndex(primaryEntry.key);
    })];

    const trimmed = combined.slice(0, this.config.tQc);

    if (this.config.uQc) {
      return trimmed.map((item, index) => ({ ...item, priority: index }));
    }
    return trimmed;
  }

  /**
   * Fetches a manifest and processes auxiliary manifests from the result.
   *
   * @param {string} viewableId - The viewable ID to fetch
   * @param {PlaybackContext} playbackContext - The current playback context
   * @param {Object} [sessionData={}] - Optional session data
   * @returns {Promise<Object>} The manifest content
   * @private
   */
  fetchManifestWithAuxiliary(viewableId, playbackContext, sessionData = {}) {
    return this._fetchManifestForViewable(viewableId, playbackContext, sessionData)
      .then((manifest) => {
        this._processAuxiliaryManifests(manifest, playbackContext);
        return manifest.manifestContent;
      })
      .catch((error) => {
        throw new bD('Failed to request manifest', {
          Cd: 0,
          KAa: 0,
          errorCode: error.code ?? 0,
          context: {
            error: error instanceof NetworkError ? error.toJSON() : error,
            type: 'manifest',
          },
        });
      });
  }

  /**
   * Fetches a manifest from the manifest store using a pre-fetch flavor.
   *
   * @param {string} viewableId - The viewable ID
   * @param {PlaybackContext} playbackContext - The playback context
   * @param {Object} [sessionData={}] - Optional session data
   * @returns {Promise<Object>} The fetched manifest
   * @private
   */
  _fetchManifestForViewable(viewableId, playbackContext, sessionData = {}) {
    const abortController = new AbortController();
    return this.manifestStore.fetchManifest(
      {
        Ia: playbackContext.cB(viewableId) ?? playbackContext.NRa(viewableId),
        J: viewableId,
        flavor: ManifestFlavor.PRE_FETCH,
        type: getManifestFetchType(this.config, true),
        sessionContext: sessionData,
      },
      abortController.signal
    );
  }

  /**
   * Sets up event listeners for auxiliary manifest expiration tied to
   * a specific playback context and auxiliary key.
   *
   * @param {PlaybackContext} playbackContext - The playback context
   * @param {Object} auxiliaryKey - The auxiliary manifest key to track
   * @private
   */
  _registerAuxiliaryManifestListeners(playbackContext, auxiliaryKey) {
    const onPlaybackClosing = (event) => {
      this._onAuxiliaryManifestRemoved(event, auxiliaryKey);
      playbackContext.events.removeListener('playbackClosing', onPlaybackClosing);
    };

    const onManifestRemoved = (event) => {
      this._onAuxiliaryManifestRemoved(event, auxiliaryKey);
      playbackContext.events.removeListener('manifestRemovedFromCache', onManifestRemoved);
    };

    playbackContext.events.on('manifestRemovedFromCache', onManifestRemoved);
    playbackContext.events.on('playbackClosing', onPlaybackClosing);
  }

  /**
   * Prefetches DAI (Dynamic Ad Insertion) manifests. Fetches auxiliary
   * manifests from the parent manifest's transaction context and returns
   * the advert data.
   *
   * @param {Object} adBreakInfo - Information about the ad break
   * @param {PlaybackContext} playbackContext - The playback context
   * @param {AbortSignal} abortSignal - Signal for aborting the request
   * @returns {Promise<Object>} The adverts data from the manifest
   * @private
   */
  prefetchDaiManifests(adBreakInfo, playbackContext, abortSignal) {
    const audioTrackId = adBreakInfo.$y;
    const textTrackId = adBreakInfo.t$;
    const auxiliaryInfo = adBreakInfo.auxiliaryManifestInfo;
    const auxiliaryManifestToken = auxiliaryInfo.auxiliaryManifestToken;
    const parentManifestId = auxiliaryInfo.parentManifestId;
    const parentCacheEntry = this.manifestCache.getManifestCacheEntry(parentManifestId);

    return parentCacheEntry.vv.then((parentData) => {
      const playbackContextId = parentData.manifestRef.playbackContextId;
      const sourceTransactionId = parentCacheEntry.sourceTransactionId;
      const flavor = ManifestFlavor.$r;
      const sessionContext = {
        AE: true,
        isSeeking: false,
        JC: Date.now(),
      };

      return this.manifestStore.fetchManifest(
        {
          Ia: Number(sourceTransactionId),
          sessionContext,
          J: parentManifestId,
          t$: textTrackId,
          $y: audioTrackId,
          flavor,
          type: undefined,
          CJ: undefined,
          ze: {
            Kb: auxiliaryManifestToken,
            bF: playbackContextId,
          },
        },
        abortSignal,
        false
      ).then((manifest) => {
        this._processAuxiliaryManifests(manifest, playbackContext);
        this.manifestStore.xOb();

        manifest.auxiliaryManifests.forEach((auxManifest) => {
          this.manifestStore.CV(auxManifest.manifestContent.R, auxManifest);
          const auxKey = {
            J: auxManifest.manifestContent.R,
            parentManifestId,
            auxiliaryManifestToken,
          };
          this.storeAuxiliaryManifest(auxKey, auxManifest);
          this._registerAuxiliaryManifestListeners(playbackContext, auxKey);
        });

        if (!manifest.manifestContent.adverts) {
          throw Error(`Dai prefetch request has no adverts forparentViewableId: ${parentManifestId}`);
        }
        return manifest.manifestContent.adverts;
      });
    });
  }

  /**
   * Hydrates a specific ad break by fetching its auxiliary manifest.
   * Returns the first ad break from the response.
   *
   * @param {PlaybackContext} playbackContext - The playback context
   * @param {Object} adBreakRequest - The ad break hydration request
   * @returns {Promise<Object>} The hydrated ad break
   * @private
   */
  hydrateAdBreak(playbackContext, adBreakRequest) {
    assert(
      adBreakRequest.auxiliaryManifestInfo,
      'auxiliaryOptions must exist if an adBreak hydration was requested'
    );

    const auxiliaryInfo = adBreakRequest.auxiliaryManifestInfo;
    const auxiliaryManifestToken = auxiliaryInfo.auxiliaryManifestToken;
    const parentManifestId = auxiliaryInfo.parentManifestId;
    const adBreakToken = adBreakRequest.adBreakToken;
    const adBreakTriggerId = adBreakRequest.hb;

    assert(!!auxiliaryManifestToken, 'auxiliaryManifestToken must exist if an adBreak hydration was requested');

    const parentCacheEntry = this.manifestCache.getManifestCacheEntry(
      adBreakRequest.auxiliaryManifestInfo?.parentManifestId
    );

    return parentCacheEntry.vv.then((parentData) => {
      const playbackContextId = parentData.manifestRef.playbackContextId;
      const sourceTransactionId = parentCacheEntry.sourceTransactionId;

      assert(sourceTransactionId !== undefined, 'parent xid must exist if an adBreak hydration was requested');

      const flavor = ManifestFlavor.$r;
      const sessionContext = {
        AE: true,
        isSeeking: false,
        JC: Date.now(),
      };
      const abortController = new AbortController();

      return this.manifestStore.fetchManifest(
        {
          Ia: Number(sourceTransactionId),
          sessionContext,
          J: parentManifestId,
          flavor,
          type: undefined,
          CJ: undefined,
          ze: {
            Pj: adBreakToken,
            hb: adBreakTriggerId,
            auxiliaryManifestToken,
            parentManifestId,
            bF: playbackContextId,
          },
        },
        abortController.signal,
        false
      ).then((manifest) => {
        this._processAuxiliaryManifests(manifest, playbackContext);

        manifest.auxiliaryManifests.forEach((auxManifest) => {
          const auxKey = {
            J: auxManifest.manifestContent.R,
            parentManifestId,
            auxiliaryManifestToken,
          };
          this.storeAuxiliaryManifest(auxKey, auxManifest, adBreakToken);
          this._registerAuxiliaryManifestListeners(playbackContext, auxKey);
        });

        if (!manifest.manifestContent.adverts?.adBreaks.length) {
          throw Error(
            `AdBreak hydration request came with no adBreak forparentViewableId: ${parentManifestId}, adBreakToken: ${adBreakToken}, adBreakTriggerId: ${adBreakTriggerId}`
          );
        }

        return manifest.manifestContent.adverts?.adBreaks[0];
      });
    });
  }

  /**
   * Processes auxiliary manifests from a fetch result, registering them
   * in the download state tracker.
   *
   * @param {Object} manifest - The fetched manifest result
   * @param {PlaybackContext} playbackContext - The playback context
   * @private
   */
  _processAuxiliaryManifests(manifest, playbackContext) {
    const content = manifest.manifestContent;
    content.auxiliaryManifests?.forEach((auxManifest) => {
      this.updateDownloadState(auxManifest.R, playbackContext, aseGlobals.playgraphConfig, {
        Mf: {
          Kb: auxManifest.auxiliaryManifestToken,
          parentManifestId: content.R,
        },
      }, auxManifest);
    });
  }

  /**
   * Creates a wishlist entry for a viewable, including its manifest
   * cache entry and deferred promise for completion tracking.
   *
   * @param {Object} viewableInfo - The viewable information
   * @param {PlaybackContext} playbackContext - The playback context
   * @returns {Object} The wishlist entry
   * @private
   */
  _createWishlistEntry(viewableInfo, playbackContext) {
    const deferred = new DeferredPromise();
    let wishlistKey;

    // Reuse existing entry if viewable is already being tracked
    if (this._prefetchEntries.has(viewableInfo.R)) {
      const existing = this._prefetchEntries.get(viewableInfo.R);
      const existingInfo = existing.viewableInfo;

      if (existingInfo.R === viewableInfo.R && existingInfo.manifestFormat === viewableInfo.manifestFormat) {
        wishlistKey = existing.wishlistEntry.key;
      }

      // Reuse the deferred if content is still in the provider's stats
      if (this.currentConfigProvider.getStats().contents.some((item) => item.id === viewableInfo.R)) {
        return existing.wishlistEntry;
      }
    }

    const formatConfig = aseGlobals.playgraphConfig.clone(createFormatConfig(viewableInfo.manifestFormat));

    if (!wishlistKey) {
      wishlistKey = {
        J: viewableInfo.R,
        config: formatConfig,
      };
    }

    const cacheKey = { J: viewableInfo.R };
    if (!this.manifestCache.has(cacheKey)) {
      this.manifestCache.store(cacheKey, this._createManifestCacheEntry(viewableInfo, playbackContext, formatConfig));
    }

    const wishlistEntry = {
      key: wishlistKey,
      phd: false,
      priority: viewableInfo.priority,
      internal_Ooa: TimeUtil.fromMilliseconds(viewableInfo.manifestSessionData?.startPts ?? 0),
      manifestCache: this.manifestCache,
    };

    this._prefetchEntries.set(viewableInfo.R, {
      wishlistEntry,
      viewableInfo,
      deferredPromise: deferred,
    });

    return wishlistEntry;
  }

  /**
   * Creates a manifest cache entry for lazy manifest fetching.
   * The manifest is fetched on first access of the `vv` property.
   *
   * @param {Object} viewableInfo - The viewable information
   * @param {PlaybackContext} playbackContext - The playback context
   * @param {Object} formatConfig - The format configuration
   * @returns {Object} The manifest cache entry
   * @private
   */
  _createManifestCacheEntry(viewableInfo, playbackContext, formatConfig) {
    const viewableId = viewableInfo.R;
    let manifestPromise;

    return {
      get Ia() {
        return playbackContext.cB(viewableId);
      },
      expired: false,
      events: new EventEmitter(),
      yZ() {},
      get vv() {
        if (!manifestPromise) {
          manifestPromise = this.fetchManifestWithAuxiliary(viewableInfo.R, playbackContext, viewableInfo.manifestSessionData)
            .then((manifestContent) => ({
              S: manifestContent,
              isReadyForPlayback: manifestContent.ata && !manifestContent.iM,
              config: formatConfig,
              e6a: {},
            }));
        }
        return manifestPromise;
      },
      J: viewableId,
      superseded: false,
      equals(other) {
        const transactionId = playbackContext.cB(viewableId);
        return other && other.J === viewableId && (!other.sourceTransactionId || !transactionId || transactionId === other.sourceTransactionId);
      },
    };
  }

  /**
   * Updates the download state for a viewable by adding or updating its
   * manifest cache entry. Handles both primary and auxiliary manifests.
   *
   * @param {string} viewableId - The viewable ID
   * @param {PlaybackContext} playbackContext - The playback context
   * @param {Object} playgraphConfig - The playgraph configuration
   * @param {Object} [auxiliaryOptions] - Optional auxiliary manifest options
   * @param {Object} [existingManifest] - Optional pre-fetched manifest to use
   */
  updateDownloadState(viewableId, playbackContext, playgraphConfig, auxiliaryOptions, existingManifest) {
    const transactionId = playbackContext.cB(viewableId);

    if (!transactionId && !auxiliaryOptions) return;

    const cacheKey = {
      J: viewableId,
      parentManifestId: auxiliaryOptions?.auxiliaryManifestInfo?.parentManifestId,
      auxiliaryManifestToken: auxiliaryOptions?.auxiliaryManifestInfo?.auxiliaryManifestToken,
    };

    if (this.manifestCache.has(cacheKey)) return;

    const sourceTransactionId = transactionId ??
      this.manifestCache.getManifestCacheEntry(auxiliaryOptions?.auxiliaryManifestInfo?.parentManifestId).sourceTransactionId;

    let manifestPromise;

    this.manifestCache.store(cacheKey, {
      yZ() {},
      equals(other) {
        return other && other.J === cacheKey.J && (sourceTransactionId === other.sourceTransactionId || !other.sourceTransactionId || !sourceTransactionId);
      },
      get vv() {
        if (!manifestPromise) {
          manifestPromise = (existingManifest
            ? Promise.resolve(existingManifest)
            : this.fetchManifestWithAuxiliary(viewableId, playbackContext)
          ).then((manifestContent) => ({
            S: manifestContent,
            isReadyForPlayback: manifestContent.ata && !manifestContent.iM,
            config: playgraphConfig,
            e6a: {},
          }));
        }
        return manifestPromise;
      },
      set vv(value) {
        manifestPromise = value;
      },
      events: new EventEmitter(),
      sourceTransactionId,
      J: cacheKey.J,
      expired: false,
      superseded: false,
    });
  }

  /**
   * Replaces the internal wishlist items without notifying the config provider.
   *
   * @param {Array<Object>} items - The new wishlist items
   * @private
   */
  _setWishlistItems(items) {
    this._wishlistItems = items;
  }

  /**
   * Updates the wishlist and notifies the configuration provider.
   *
   * @param {Array<Object>} items - The new wishlist items
   * @private
   */
  _updateWishlistAndNotify(items) {
    this._setWishlistItems(items);
    this.currentConfigProvider.updateWishlist(this._wishlistItems);
  }

  /**
   * Removes a prefetch entry by viewable ID and updates the wishlist
   * to exclude it.
   *
   * @param {string} viewableId - The viewable ID to remove
   * @private
   */
  _removePrefetchEntry(viewableId) {
    if (this._prefetchEntries.has(viewableId)) {
      this._setWishlistItems(
        this._wishlistItems.filter((item) => getTrackIndex(item.key) !== viewableId)
      );
      this._prefetchEntries.delete(viewableId);
    }
  }
}

export { AsePrefetcherAdapter };
