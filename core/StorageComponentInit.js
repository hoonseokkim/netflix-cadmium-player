/**
 * Storage Component Initializer
 *
 * Registers a handler for the INIT_COMPONENT_STORAGE lifecycle event.
 * Initializes the appropriate storage backend (IndexedDB, localStorage, or none)
 * based on the player configuration.
 *
 * @module core/StorageComponentInit
 * @original Module_59416
 */

/** @type {Object|undefined} The initialized storage instance */
export let storage = undefined;

/**
 * Initializes the storage component based on the configured storage type.
 *
 * Supported storage types:
 * - "idb" - IndexedDB storage
 * - "ls"  - localStorage storage
 * - "none" - No persistent storage (in-memory only)
 *
 * @param {Function} complete - Completion callback, receives SUCCESS or error result
 */
disposableList.get(componentManagerSymbol).register(Events.INIT_COMPONENT_STORAGE, (complete) => {
    let storageFactory;

    switch (config.storageType) {
        case "idb":
            storageFactory = createIdbStorage;
            break;
        case "none":
            storageFactory = createNoneStorage;
            break;
        case "ls":
            storageFactory = createLsStorage;
            break;
    }

    storageFactory((result) => {
        if (result.success) {
            storage = result.storage;
            complete(SUCCESS);
        } else {
            complete(result);
        }
    });
});
