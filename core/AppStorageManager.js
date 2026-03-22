/**
 * Netflix Cadmium Player - Application Storage Manager
 * Deobfuscated from Module_67894
 *
 * Manages persistent storage with dual backend support: in-memory ("mem")
 * and IndexedDB ("idb"). Routes storage operations to the appropriate backend
 * based on configurable storage rules (key prefix matching).
 *
 * The factory (AppStorageManagerFactory) creates and initializes the storage
 * system including IndexedDB setup. The manager (AppStorageManager) provides
 * CRUD operations for loading, saving, and removing items.
 */

import { __decorate, __param } from "tslib"; // Module 22970
import { injectable, inject as injectDecorator } from "inversify"; // Module 22674
import { EventTypeEnum } from "../events/EventTypeEnum"; // Module 36129
import { InitParamToken } from "../symbols/InitParamToken"; // Module 42236
import { LoggerToken } from "../symbols/LoggerToken"; // Module 87386
import { IndexedDbFactoryToken } from "../symbols/IndexedDbFactoryToken"; // Module 86607
import { DEFAULT_STORAGE_RULE_KEY } from "../config/StorageRuleConstants"; // Module 31679
import { enumConstants } from "../config/EnumConstants"; // Module 34231

/**
 * Core storage manager that routes operations to mem or idb backends.
 */
class AppStorageManager {
    constructor(logger, config, indexedDbFactory, memoryStorage) {
        this.logger = logger;
        this.config = config;
        this.indexedDbFactory = indexedDbFactory;
        this.storage = memoryStorage;

        // Initialize with in-memory storage; idb added after initialization
        this.storageBackends = {
            mem: {
                storage: this.storage,
                key: "mem"
            }
        };
        this.storageRules = this.config.storageRules;
    }

    /**
     * Initialize storage backends (including IndexedDB).
     * @returns {Promise<AppStorageManager>}
     */
    create() {
        const self = this;
        return this.initializeIndexedDb().then(function (error) {
            if (!self.isStorageUsable(error, self.config.enableHDRPassthrough)) {
                throw self.createStorageError(error);
            }
            return self;
        });
    }

    /**
     * Load an item from the appropriate storage backend.
     * @param {string} key - Storage key
     * @returns {Promise<*>}
     */
    loading(key) {
        const self = this;
        return new Promise(function (resolve, reject) {
            self.getBackendForKey(key).storage.loading(key)
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Save an item to the appropriate storage backend.
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @param {*} options - Save options
     * @returns {Promise<*>}
     */
    save(key, value, options) {
        const self = this;
        return new Promise(function (resolve, reject) {
            self.getBackendForKey(key).storage.save(key, value, options)
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Delete an item from the appropriate storage backend.
     * @param {string} key - Storage key
     * @returns {Promise<void>}
     */
    item(key) {
        const self = this;
        return new Promise(function (resolve, reject) {
            self.getBackendForKey(key).storage.item(key)
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Remove all items from all storage backends.
     * @returns {Promise<void>}
     */
    removeAll() {
        const self = this;
        return new Promise(function (resolve, reject) {
            self.removeAllFromBackend("mem")
                .then(function () {
                    return self.removeAllFromBackend("idb");
                })
                .catch(function (err) {
                    return Promise.reject(err);
                })
                .then(function () {
                    resolve();
                })
                .catch(function (err) {
                    self.logger.error("remove all failed");
                    reject(err);
                });
        });
    }

    /**
     * Load all items from all storage backends.
     * @returns {Promise<Array>}
     */
    loadAll() {
        const self = this;
        let allItems = [];
        return this.loadAllFromBackend("mem")
            .then(function (memItems) {
                allItems = allItems.concat(memItems);
                return self.loadAllFromBackend("idb");
            })
            .catch(function (error) {
                if (!self.isNoDataError(error)) {
                    self.logger.error("IndexedDb.LoadAll exception", error);
                }
                return [];
            })
            .then(function (idbItems) {
                return allItems = allItems.concat(idbItems);
            })
            .catch(function (error) {
                self.logger.error("load all failed", error);
                throw error;
            });
    }

    /** @private Initialize IndexedDB backend */
    initializeIndexedDb() {
        const self = this;
        return this.indexedDbFactory.create().then(function (idbInstance) {
            self.storageBackends.idb = {
                storage: idbInstance,
                key: "idb"
            };
        }).catch(function (error) {
            self.logger.error("idb failed to load", error);
            return error || { Ya: EventTypeEnum.UNKNOWN };
        });
    }

    /** @private Check if storage is usable after init */
    isStorageUsable(error, enableHDRPassthrough) {
        return !error || (error && enableHDRPassthrough) ? true : false;
    }

    /** @private Create error object for storage failure */
    createStorageError(error) {
        let message = "";
        if (error) {
            message += error.errorcode;
        }
        return { Ya: message };
    }

    /** @private Remove all items from a specific backend */
    removeAllFromBackend(backendKey) {
        const backend = this.storageBackends[backendKey];
        return backend ? backend.storage.removeAll() : Promise.resolve();
    }

    /** @private Load all items from a specific backend */
    loadAllFromBackend(backendKey) {
        const backend = this.storageBackends[backendKey];
        return backend ? backend.storage.loadAll() : Promise.resolve([]);
    }

    /**
     * @private
     * Determine which storage backend to use based on key prefix rules.
     * Falls back to the default rule if no prefix matches.
     */
    getStorageRule(key) {
        for (const prefix in this.storageRules) {
            if (key.startsWith(prefix)) {
                return this.storageRules[prefix];
            }
        }
        return this.storageRules[DEFAULT_STORAGE_RULE_KEY];
    }

    /**
     * @private
     * Get the storage backend component for a given key.
     * Iterates through the storage rule priorities and returns the first available backend.
     */
    getBackendForKey(key) {
        const self = this;
        let selectedBackend;

        this.getStorageRule(key).every(function (backendKey) {
            if (self.storageBackends[backendKey]) {
                selectedBackend = self.storageBackends[backendKey];
                return false; // stop iteration
            }
            return true;
        });

        if (!selectedBackend) {
            this.logger.error("component not found for storageKey", {
                u_c: key,
                mcd: Object.keys(this.storageBackends),
                rules: this.storageRules
            });
            selectedBackend = this.storageBackends.mem;
        }

        this.logger.pauseTrace("component found for key", {
            storageKey: key,
            componentKey: selectedBackend.key
        });

        return selectedBackend;
    }

    /** @private Check if error is a "no data" error */
    isNoDataError(error) {
        return (error && (error.errorcode || error.errorSubCode)) === EventTypeEnum.STORAGE_NODATA;
    }
}

/**
 * Factory for creating and initializing AppStorageManager instances.
 */
@injectable()
class AppStorageManagerFactory {
    constructor(debugManager, initParam, storage, config) {
        this.debugManager = debugManager;
        this.initParam = initParam;
        this.storage = storage;
        this.config = config;
    }

    /** Create (or return cached) AppStorageManager instance */
    create() {
        if (!this.instance) {
            this.instance = this.doCreate();
        }
        return this.instance;
    }

    /** @private Instantiate and initialize the storage manager */
    doCreate() {
        this.storageManager = new AppStorageManager(
            this.debugManager.createSubLogger("AppStorage"),
            this.config,
            this.initParam,
            this.storage
        );
        return this.storageManager.create();
    }
}

export { AppStorageManagerFactory, AppStorageManager };
