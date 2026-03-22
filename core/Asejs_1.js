/**
 * Netflix Cadmium Player — ASEJS Prefetch Configuration Provider
 *
 * Creates and caches a PrefetchManager that lazily loads the ASEJS engine
 * module.  This allows the player to begin prefetching streaming resources
 * before full engine initialization.
 *
 * @module AsejsPrefetchConfigProvider
 */

// Dependencies
// import { __awaiter, __generator, __importStar } from 'tslib';
// import { platform } from './modules/Platform';
// import { PrefetchManager } from './modules/PrefetchManager';
// import { getAsejsInstance } from './core/Asejs';

/** @type {PrefetchManager|undefined} Cached prefetch manager. */
let prefetchManagerInstance;

/**
 * Lazy-load the ASEJS engine module and return the singleton instance.
 *
 * @returns {Promise<AsejsEngine>}
 * @private
 */
async function loadAsejsEngine() {
  const { getAsejsInstance } = await import("./Asejs");
  return getAsejsInstance();
}

/**
 * Create (or return the cached) PrefetchManager backed by the ASEJS engine.
 *
 * @param {object} configProvider - Configuration provider passed through
 *                                  to the PrefetchManager.
 * @returns {PrefetchManager}
 */
export function createPrefetchConfigProvider(configProvider) {
  const console = new platform.Console("ASEJS", "media|asejs");
  if (!prefetchManagerInstance) {
    prefetchManagerInstance = new PrefetchManager(
      () => loadAsejsEngine(),
      configProvider,
      console
    );
  }
  return prefetchManagerInstance;
}
