/**
 * @file IndexedDBStorageFactory - Factory classes for IndexedDB-backed persistent storage
 * @module core/IndexedDBStorageFactory
 * @description Provides three injectable factory classes for creating and managing
 * IndexedDB databases used by the Netflix player for offline/persistent storage.
 * Handles database creation, upgrades, validation, corruption recovery, timeouts,
 * and cleanup. Uses inversify for dependency injection.
 * @original Module_84970
 */

import { injectable, injectDecorator, optional, multiInject } from '../core/Inversify.js';
import { LoggerToken } from '../core/LoggerTokens.js';
import { EventTypeEnum } from '../core/EventTypes.js';
import { PerformanceMarkerToken } from '../core/PerformanceMarkerTokens.js';
import { PromiseTimerSymbol, PromiseTimerToken } from '../timing/PromiseTimer.js';
import { PerformanceMarks } from '../core/PerformanceMarks.js';

// ============================================================================
// IndexedDB Database Opener
// ============================================================================

/**
 * Opens and manages an IndexedDB database with timeout, upgrade, and error handling.
 * Handles blocked, upgrade-needed, success, error, and timeout scenarios.
 *
 * @class IndexedDBDatabaseOpener
 * @injectable
 */
export class IndexedDBDatabaseOpener {
    /**
     * @param {Object} logger - Logger factory
     * @param {Object} config - Database configuration (name, version, timeout, etc.)
     * @param {Object} promiseTimer - Promise-based timer for timeouts
     * @param {Function} indexedDBFactory - Factory function returning the IDBFactory
     * @param {Object} performanceMarker - Performance marker for timing
     */
    constructor(logger, config, promiseTimer, indexedDBFactory, performanceMarker) {
        /** @type {Object} Database configuration */
        this.config = config;

        /** @type {Object} Promise timer for timeout management */
        this.promiseTimer = promiseTimer;

        /** @type {Object} Performance marker */
        this.performanceMarker = performanceMarker;

        /** @type {Object} Logger */
        this.logger = logger.createSubLogger('IndexedDBStorage');

        /** @type {Promise<IDBFactory>} Resolved IDBFactory reference */
        this.indexedDBPromise = new Promise((resolve, reject) => {
            try {
                const factory = indexedDBFactory();
                if (factory) {
                    resolve(factory);
                } else {
                    reject({ errorCode: EventTypeEnum.INDEXDB_NOT_SUPPORTED });
                }
            } catch (error) {
                reject({
                    errorCode: EventTypeEnum.INDEXDB_ACCESS_EXCEPTION,
                    cause: error
                });
            }
        });
    }

    /**
     * Open the database, creating it if needed. Caches the result.
     * @returns {Promise<IDBDatabase>}
     */
    create() {
        if (!this._openPromise) {
            this._openPromise = this._openDatabase();
        }
        return this._openPromise;
    }

    /**
     * Close and delete the database.
     * @param {IDBDatabase} db - The database to destroy
     * @returns {Promise<void>}
     */
    destroy(db) {
        this._openPromise = null;
        return this.promiseTimer.withTimeout(this.config.timeout, new Promise((resolve, reject) => {
            db.close();
            this.deleteDatabase(db.name).then(resolve).catch(reject);
        })).catch((error) => {
            if (error instanceof PromiseTimerSymbol) {
                return Promise.reject({ errorCode: EventTypeEnum.INDEXDB_ACCESS_EXCEPTION });
            }
            return error.errorcode
                ? Promise.reject(error)
                : Promise.reject({ errorCode: EventTypeEnum.INDEXDB_ACCESS_EXCEPTION, cause: error });
        });
    }

    /**
     * Delete a database by name.
     * @param {string} name - Database name
     * @returns {Promise<void>}
     */
    deleteDatabase(name) {
        return this.promiseTimer.withTimeout(this.config.timeout, new Promise((resolve, reject) => {
            this.indexedDBPromise.then((factory) => {
                const request = factory.deleteDatabase(name);
                request.onsuccess = () => resolve();
                request.onerror = () => reject({
                    errorCode: EventTypeEnum.INDEXDB_ACCESS_EXCEPTION,
                    cause: request.error
                });
            }).catch(reject);
        }));
    }

    /**
     * Internal database open logic with full lifecycle handling.
     * @private
     * @returns {Promise<IDBDatabase>}
     */
    _openDatabase() {
        let openRequest;
        const self = this;

        return this.promiseTimer.withTimeout(this.config.timeout, new Promise((resolve, reject) => {
            if (self.config.disableReason) {
                return reject({ errorCode: self.config.disableReason });
            }

            self.indexedDBPromise.then((factory) => {
                self.performanceMarker.mark(PerformanceMarks.IDB_OPEN_START);
                openRequest = factory.open(self.config.name, self.config.version);

                if (!openRequest) {
                    return reject({ errorCode: EventTypeEnum.INDEXDB_OPEN_NULL });
                }

                openRequest.onblocked = () => {
                    self.performanceMarker.mark(PerformanceMarks.IDB_OPEN_BLOCKED);
                    reject({ errorCode: EventTypeEnum.INDEXDB_OPEN_BLOCKED });
                };

                openRequest.onupgradeneeded = () => {
                    self.performanceMarker.mark(PerformanceMarks.IDB_UPGRADE_NEEDED);
                    const db = openRequest.result;
                    try {
                        db.createObjectStore(self.config.objectStoreName, { keyPath: 'name' });
                    } catch (error) {
                        self.logger.error('Exception while creating object store', error);
                    }
                };

                openRequest.onsuccess = (event) => {
                    self.performanceMarker.mark(PerformanceMarks.IDB_OPEN_SUCCESS);
                    try {
                        const db = event.target.result;
                        const storeCount = db.objectStoreNames.length;
                        self.logger.trace('objectstorenames length ', storeCount);

                        if (storeCount === 0) {
                            self.logger.error('invalid indexedDb state, deleting');
                            self.performanceMarker.mark(PerformanceMarks.IDB_INVALID_STATE);
                            try { db.close(); } catch (e) {}
                            factory.deleteDatabase(self.config.name);
                            setTimeout(() => {
                                reject({ errorCode: EventTypeEnum.INDEXDB_INVALID_STORE_STATE });
                            }, 1);
                            return;
                        }
                    } catch (error) {
                        self.logger.error('Exception while inspecting indexedDb objectstorenames', error);
                    }
                    resolve(openRequest.result);
                };

                openRequest.onerror = () => {
                    self.performanceMarker.mark(PerformanceMarks.IDB_OPEN_ERROR);
                    self.logger.error('IndexedDB open error', openRequest.error);
                    reject({
                        errorCode: EventTypeEnum.INDEXDB_OPEN_ERROR,
                        cause: openRequest.error
                    });
                };
            }).catch(reject);
        })).catch((error) => {
            if (error instanceof PromiseTimerSymbol) {
                try {
                    if (openRequest && openRequest.readyState) {
                        self.performanceMarker.mark('readyState-' + openRequest.readyState);
                    }
                } catch (e) {}

                if (self.config.allowLateSuccess && openRequest && openRequest.readyState === 'done') {
                    if (self._isValidOpenResult(openRequest)) {
                        self.performanceMarker.mark(PerformanceMarks.IDB_LATE_SUCCESS);
                        return Promise.resolve(openRequest.result);
                    }
                    self.performanceMarker.mark(PerformanceMarks.IDB_LATE_INVALID);
                }

                self.performanceMarker.mark(PerformanceMarks.IDB_OPEN_TIMEOUT);
                return Promise.reject({ errorCode: EventTypeEnum.INDEXDB_OPEN_TIMEOUT });
            }

            if (error.errorcode) {
                return Promise.reject(error);
            }

            self.performanceMarker.mark(PerformanceMarks.IDB_OPEN_EXCEPTION);
            self.logger.error('IndexedDB open exception occurred', error);
            return Promise.reject({
                errorCode: EventTypeEnum.INDEXDB_OPEN_EXCEPTION,
                cause: error
            });
        });
    }

    /**
     * Check if an open request result has valid object stores.
     * @private
     */
    _isValidOpenResult(request) {
        try {
            return request.result.objectStoreNames.length > 0;
        } catch (error) {
            this.performanceMarker.mark(PerformanceMarks.IDB_CHECK_FAILED);
            this.logger.error('failed to check open request state', error);
        }
        return false;
    }
}

// ============================================================================
// IndexedDB Storage Factory (Simple)
// ============================================================================

/**
 * Simple factory that creates storage instances from an already-opened database.
 *
 * @class IndexedDBSimpleStorageFactory
 * @injectable
 */
export class IndexedDBSimpleStorageFactory {
    /**
     * @param {Object} config - Storage configuration
     * @param {Object} promiseTimer - Promise timer for timeouts
     */
    constructor(config, promiseTimer) {
        this.config = config;
        this.promiseTimer = promiseTimer;
    }

    /**
     * Create a storage instance from an open database.
     * @param {IDBDatabase} db - The opened database
     * @returns {Promise<Object>} Storage instance
     */
    create(db) {
        return Promise.resolve(new IndexedDBObjectStore(this.config, this.promiseTimer, db));
    }
}

// ============================================================================
// IndexedDB Storage Manager
// ============================================================================

/**
 * High-level storage manager that handles database lifecycle including
 * opening, validation, corruption recovery, and re-creation.
 *
 * @class IndexedDBStorageManager
 * @injectable
 */
export class IndexedDBStorageManager {
    /**
     * @param {Object} logger - Logger factory
     * @param {Object} config - Storage configuration
     * @param {Object} databaseOpener - IndexedDBDatabaseOpener instance
     * @param {Object} storageFactory - Factory for creating storage from a DB
     * @param {Array<Object>} [validators] - Optional database validators
     * @param {Object} performanceMarker - Performance marker
     */
    constructor(logger, config, databaseOpener, storageFactory, validators, performanceMarker) {
        this.config = config;
        this.databaseOpener = databaseOpener;
        this.storageFactory = storageFactory;
        this.validators = validators;
        this.performanceMarker = performanceMarker;
        this.logger = logger.createSubLogger('IndexedDBStorage');

        /** @type {Object|null} Cached storage instance */
        this.storage = null;
    }

    /**
     * Get or create the storage instance. Handles validation and recovery.
     * @returns {Promise<Object>} The storage instance
     */
    create() {
        if (this.storage) {
            return Promise.resolve(this.storage);
        }
        if (!this._createPromise) {
            this._createPromise = this._initStorage(this.validators);
        }
        return this._createPromise;
    }

    /**
     * Internal initialization with validation and corruption recovery.
     * @private
     * @param {Array<Object>} validators
     * @returns {Promise<Object>}
     */
    _initStorage(validators = []) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.performanceMarker.mark(PerformanceMarks.STORAGE_INIT_START);

            self.databaseOpener.create().then((db) => {
                self.storageFactory.create(db).then((storage) => {
                    Promise.all(validators.map((v) => v.validate(storage))).then(() => {
                        self.storage = storage;
                        resolve(self.storage);
                    }).catch((validationError) => {
                        self.logger.debug('DB validation failed, cause: ' + validationError);
                        if (self.config.autoRepairCorruptDB) {
                            self.logger.debug('Fixing corrupt DB');
                            self.databaseOpener.destroy(db).then(() => {
                                self.logger.error('Invalid database deleted, creating new database.');
                                self._initStorage().then((newStorage) => {
                                    self.logger.error('Invalid database successfully recreated.');
                                    self.storage = newStorage;
                                    resolve(self.storage);
                                });
                            }).catch((deleteError) => {
                                self.logger.error("Couldn't delete invalid database.");
                                reject(deleteError);
                            });
                        } else {
                            self.logger.debug('Ignoring invalid DB due to config');
                            self.storage = storage;
                            resolve(self.storage);
                        }
                    });
                }).catch(reject);
            }).catch(reject);
        });
    }
}

export default {
    IndexedDBDatabaseOpener,
    IndexedDBSimpleStorageFactory,
    IndexedDBStorageManager
};
