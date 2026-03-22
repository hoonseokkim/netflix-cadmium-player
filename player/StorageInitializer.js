/**
 * @file StorageInitializer - Player storage backend initializer
 * @module player/StorageInitializer
 * @description Registers a handler for the INIT_COMPONENT_STORAGE lifecycle event.
 * Based on the configured `storageType` ("idb", "ls", or "none"), initializes the
 * appropriate storage backend (IndexedDB, localStorage, or no-op) and makes it
 * available to the player.
 *
 * @original Module_59416
 *
 * @dependencies
 *   Module 29204 - Player configuration (config.storageType)
 *   Module 33096 - Result constants (SUCCESS)
 *   Module 50350 - NoOp storage factory (t_c)
 *   Module 36129 - Lifecycle event names (ea.INIT_COMPONENT_STORAGE)
 *   Module 75876 - IndexedDB storage factory (r_c)
 *   Module 19630 - LocalStorage factory (s_c)
 *   Module 31276 - Disposable list / service locator
 *   Module 11479 - Component keys (vk)
 */

// import { config } from '../core/PlayerConfig';
// import { SUCCESS } from '../core/ResultConstants';
// import { noOpStorageFactory } from '../player/NoOpStorageFactory';
// import { indexedDbStorageFactory } from '../player/IndexedDbStorageFactory';
// import { localStorageFactory } from '../player/LocalStorageFactory';

/**
 * The current storage instance, set during initialization.
 * @type {Object|undefined}
 */
export let storage = undefined;

/**
 * Storage type constants.
 * @enum {string}
 */
export const StorageType = Object.freeze({
    INDEXED_DB: 'idb',
    LOCAL_STORAGE: 'ls',
    NONE: 'none',
});

/**
 * Registers the storage initialization handler on the player lifecycle.
 *
 * When INIT_COMPONENT_STORAGE fires during player startup:
 * 1. Reads `config.storageType` to determine which backend to use
 * 2. Calls the appropriate async factory function
 * 3. On success, stores the result in the `storage` export and completes
 * 4. On failure, forwards the error result to the completion callback
 *
 * @param {Object} disposableList - The service locator / disposable registry
 * @param {Object} config - Player configuration
 * @param {Object} factories - Map of storage type to factory function
 * @param {Function} factories.idb - IndexedDB storage factory
 * @param {Function} factories.ls - LocalStorage factory
 * @param {Function} factories.none - No-op storage factory
 */
export function registerStorageInitializer(disposableList, config, factories, componentKey, lifecycleEvent, SUCCESS) {
    disposableList.key(componentKey).register(lifecycleEvent, function (done) {
        let factory;

        switch (config.storageType) {
            case StorageType.INDEXED_DB:
                factory = factories.idb;
                break;
            case StorageType.NONE:
                factory = factories.none;
                break;
            case StorageType.LOCAL_STORAGE:
                factory = factories.ls;
                break;
        }

        factory(function (result) {
            if (result.success) {
                storage = result.storage;
                done(SUCCESS);
            } else {
                done(result);
            }
        });
    });
}
