/**
 * Netflix Cadmium Player -- MediaKeysStorage
 *
 * IndexedDB-backed persistent storage for DRM key material and
 * session data.  Used by the limited-duration license (LDL) system
 * to cache key sessions across playback sessions.
 *
 * Operations (load, save, delete, clear, loadAll) are wrapped with
 * configurable timeouts via the license manager's promise-timer
 * infrastructure.
 *
 * Original: Webpack Module 92093
 *
 * @module drm/MediaKeysStorage
 */

// import { EventTypeEnum } from '../core/ErrorCodes.js'; // Module 36129
// import { PromiseTimerSymbol } from '../utils/PromiseTimer.js'; // Module 59818

/**
 * Reason codes for storage operation failures.
 * @enum {number}
 */
export const StorageFailureReason = Object.freeze({
  /** No data found for the requested key. */
  NoData: 0,

  /** An internal error occurred during the storage operation. */
  Error: 1,

  /** The operation timed out. */
  Timeout: 2,
});

/**
 * Internal error wrapper for storage operations.
 * @private
 */
class StorageError {
  /**
   * @param {StorageFailureReason} reason
   * @param {Error} [cause]
   */
  constructor(reason, cause) {
    this.reason = reason;
    this.cause = cause;
  }
}

/**
 * IndexedDB-backed storage for DRM key data.
 */
export class MediaKeysStorage {
  /**
   * @param {object} config - Storage configuration.
   * @param {string} config.storeName - IndexedDB object store name.
   * @param {number} config.timeout - Operation timeout duration.
   * @param {StorageFailureReason} [config.forceError] - Force all ops to fail (testing).
   * @param {object} licenseManager - Promise-timeout manager.
   * @param {IDBDatabase} database - Opened IndexedDB database instance.
   */
  constructor(config, licenseManager, database) {
    /** @private */ this._config = config;
    /** @private */ this._licenseManager = licenseManager;
    /** @private */ this._db = database;
  }

  // -----------------------------------------------------------------------
  // CRUD Operations
  // -----------------------------------------------------------------------

  /**
   * Load a single entry by key.
   *
   * @param {string} key - Storage key.
   * @returns {Promise<{ key: string, value: * }>}
   * @throws {{ Ya: string, cause: * }} On failure.
   */
  async load(key) {
    try {
      const data = await this._executeTransaction('get', false, key);
      return { key, value: data };
    } catch (err) {
      const errorType = err.reason === StorageFailureReason.NoData
        ? 'STORAGE_NODATA'
        : err.reason === StorageFailureReason.Timeout
          ? 'STORAGE_LOAD_TIMEOUT'
          : 'STORAGE_LOAD_ERROR';
      throw { Ya: errorType, cause: err.cause };
    }
  }

  /**
   * Save an entry.
   *
   * @param {string} name - Storage key.
   * @param {*} data - Data to persist.
   * @param {boolean} [addOnly=false] - If true, use "add" (fails if exists).
   * @returns {Promise<boolean>} True if an existing entry was overwritten.
   * @throws {{ Ya: string, cause: * }} On failure.
   */
  async save(name, data, addOnly = false) {
    try {
      await this._executeTransaction(addOnly ? 'add' : 'put', true, { name, data });
      return !addOnly;
    } catch (err) {
      const errorType = err.reason === StorageFailureReason.Timeout
        ? 'STORAGE_SAVE_TIMEOUT'
        : 'STORAGE_SAVE_ERROR';
      throw { Ya: errorType, cause: err.cause };
    }
  }

  /**
   * Delete a single entry by key.
   *
   * @param {string} key - Storage key.
   * @returns {Promise<void>}
   * @throws {{ Ya: string, cause: * }} On failure.
   */
  async remove(key) {
    try {
      await this._executeTransaction('delete', true, key);
    } catch (err) {
      const errorType = err.reason === StorageFailureReason.Timeout
        ? 'STORAGE_DELETE_TIMEOUT'
        : 'STORAGE_DELETE_ERROR';
      throw { Ya: errorType, cause: err.cause };
    }
  }

  /**
   * Clear all entries from the store.
   *
   * @returns {Promise<void>}
   * @throws {{ Ya: string, cause: * }} On failure.
   */
  async removeAll() {
    try {
      await this._executeTransaction('clear', true, '');
    } catch (err) {
      const errorType = err.reason === StorageFailureReason.Timeout
        ? 'STORAGE_DELETE_TIMEOUT'
        : 'STORAGE_DELETE_ERROR';
      throw { Ya: errorType, cause: err.cause };
    }
  }

  /**
   * Load all entries from the store using a cursor scan.
   *
   * @returns {Promise<Array<{ key: string, value: * }>>}
   */
  async loadAll() {
    return this._licenseManager.withTimeout(
      this._config.timeout,
      new Promise((resolve, reject) => {
        if (this._config.forceError !== undefined) {
          reject(new StorageError(this._config.forceError));
          return;
        }

        const results = [];
        const txn = this._db.transaction(this._config.storeName, 'readonly');
        const cursorReq = txn.objectStore(this._config.storeName).openCursor();

        txn.onerror = () => reject(new StorageError(StorageFailureReason.Error, cursorReq.error));

        cursorReq.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            try {
              results.push({ key: cursor.value.name, value: cursor.value.data });
              cursor.continue();
            } catch (err) {
              reject(new StorageError(StorageFailureReason.Error, err));
            }
          } else {
            resolve(results);
          }
        };

        cursorReq.onerror = () => reject(new StorageError(StorageFailureReason.Error, cursorReq.error));
      }),
    ).catch((err) => {
      if (err instanceof StorageError) return Promise.reject(err);
      // PromiseTimer timeout
      return Promise.reject(new StorageError(StorageFailureReason.Timeout, err));
    });
  }

  // -----------------------------------------------------------------------
  // Private: Transaction execution
  // -----------------------------------------------------------------------

  /**
   * Execute a single IndexedDB transaction with timeout.
   *
   * @param {string} method - IDBObjectStore method name ("get", "put", "add", "delete", "clear").
   * @param {boolean} readwrite - Whether the transaction needs write access.
   * @param {*} data - Argument to pass to the store method.
   * @returns {Promise<*>}
   * @private
   */
  _executeTransaction(method, readwrite, data) {
    return this._licenseManager.withTimeout(
      this._config.timeout,
      new Promise((resolve, reject) => {
        const mode = readwrite ? 'readwrite' : 'readonly';
        const txn = this._db.transaction(this._config.storeName, mode);
        const request = txn.objectStore(this._config.storeName)[method](data);

        txn.onerror = () => reject(new StorageError(StorageFailureReason.Error, request.error));

        request.onsuccess = (event) => {
          if (method === 'get') {
            try {
              const result = event.target.result;
              if (result) {
                resolve(result.data);
              } else {
                reject(new StorageError(StorageFailureReason.NoData));
              }
            } catch (err) {
              reject(new StorageError(StorageFailureReason.NoData, err));
            }
          } else {
            resolve(undefined);
          }
        };

        request.onerror = () => reject(new StorageError(StorageFailureReason.Error, request.error));
      }),
    ).catch((err) => {
      if (err instanceof StorageError) return Promise.reject(err);
      return Promise.reject(new StorageError(StorageFailureReason.Timeout, err));
    });
  }
}
