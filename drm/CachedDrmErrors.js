/**
 * Netflix Cadmium Player -- CachedDrmErrors
 *
 * Persists DRM-related errors to IndexedDB so that the key-system
 * restrictor can avoid key systems that have historically failed on
 * this device.  For example, if PlayReady SL3000 fails repeatedly
 * due to a hardware issue, the player falls back to SL2000 or
 * Widevine on subsequent playback attempts.
 *
 * Errors are stored with a timestamp, key system, error code, and
 * sub-codes.  Old entries are pruned based on a configurable
 * expiration window and count limit.
 *
 * Original: Webpack Module 19699
 *
 * @module drm/CachedDrmErrors
 */

// import { KeySystemHelper } from './KeySystemIds.js';   // Module 17612

/**
 * IndexedDB storage key for cached DRM errors.
 * @type {string}
 */
export const STORAGE_KEY = 'errors';

/**
 * @typedef {Object} CachedDrmError
 * @property {Date}   time             - When the error occurred.
 * @property {string} keySystem        - Key-system identifier.
 * @property {number} code             - Primary error code.
 * @property {number} [errorSubCode]   - EME sub-error code.
 * @property {string} [errorExternalCode] - External/CDM error code.
 */

/**
 * Manages persistent storage of DRM error history.
 */
export class CachedDrmErrors {
  /**
   * @param {object} storageFactory - Factory for creating MediaKeysStorage instances.
   * @param {object} logger - Debug logger factory.
   * @param {Function} config - Configuration accessor.
   * @param {object} licenseManager - Promise-timeout manager.
   * @param {object} playerCore - Player core (for system clock).
   * @param {object} typeChecker - Runtime type-check utility.
   */
  constructor(storageFactory, logger, config, licenseManager, playerCore, typeChecker) {
    /** @private */ this._storageFactory = storageFactory;
    /** @private */ this._config = config;
    /** @private */ this._licenseManager = licenseManager;
    /** @private */ this._playerCore = playerCore;
    /** @private */ this._typeChecker = typeChecker;

    this.log = logger.createSubLogger('CachedErrors');
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  /**
   * Load all cached DRM errors, filtering expired and invalid entries.
   *
   * @returns {Promise<CachedDrmError[]>}
   */
  async load() {
    if (!this._config().enableCachedErrors) {
      return [];
    }

    const timeoutSeconds = this._config().cachedErrorsStorageTimeoutSeconds;

    try {
      return await this._loadFilterAndSave([]);
    } catch (err) {
      this.log.error('Load failed.', err);
      return [];
    }
  }

  /**
   * Add a new error to the cache (if caching is enabled and the
   * key system is a hardware-DRM system).
   *
   * @param {Date} time - Error timestamp.
   * @param {string} keySystem - Key-system identifier.
   * @param {number} code - Primary error code.
   * @param {number} [errorSubCode] - EME sub-error code.
   * @param {string} [errorExternalCode] - External CDM error code.
   * @returns {Promise<void>}
   */
  async add(time, keySystem, code, errorSubCode, errorExternalCode) {
    if (!this._config().enableCachedErrors || !keySystem || !code) {
      return;
    }

    // Only cache errors for hardware-DRM key systems
    if (!this._isHardwareDrm(keySystem)) {
      return;
    }

    try {
      await this._loadFilterAndSave([{ time, keySystem, code, errorSubCode, errorExternalCode }]);
    } catch (err) {
      this.log.error('Add failed.', err);
    }
  }

  // -----------------------------------------------------------------------
  // Private: Load/filter/save pipeline
  // -----------------------------------------------------------------------

  /**
   * Load existing errors, filter them, append new entries, and save.
   *
   * @param {CachedDrmError[]} newEntries
   * @returns {Promise<CachedDrmError[]>}
   * @private
   */
  async _loadFilterAndSave(newEntries) {
    let errors = await this._loadRawErrors();
    errors = this._deserializeEntries(errors);
    errors = this._filterExpired(errors);
    errors = errors.concat(newEntries);
    errors = this._filterByErrorCodes(errors);
    errors = this._trimToLimit(errors);
    return this._saveErrors(errors);
  }

  /**
   * Load raw serialized error entries from IndexedDB.
   *
   * @returns {Promise<Array>}
   * @private
   */
  async _loadRawErrors() {
    const storage = await this._storageFactory.create();
    try {
      const result = await storage.load(STORAGE_KEY);
      return result.value?.errors || [];
    } catch (err) {
      if (err.Ya === 'STORAGE_NODATA') {
        this.log.info('No CachedErrors.');
        return [];
      }
      throw err;
    }
  }

  /**
   * Deserialize stored arrays into error objects.
   *
   * Storage format: `[timestamp, keySystem, code, subCode, externalCode]`
   *
   * @param {Array} entries - Raw serialized entries.
   * @returns {CachedDrmError[]}
   * @private
   */
  _deserializeEntries(entries) {
    return entries
      .filter((e) => this._isValidEntry(e))
      .map((e) => ({
        time: new Date(e[0]),
        keySystem: e[1],
        code: e[2],
        errorSubCode: e[3],
        errorExternalCode: e[4],
      }));
  }

  /**
   * Serialize error objects for IndexedDB storage.
   *
   * @param {CachedDrmError} error
   * @returns {Array}
   * @private
   */
  static _serialize(error) {
    return [
      error.time.getTime(),
      error.keySystem,
      error.code,
      error.errorSubCode,
      error.errorExternalCode,
    ];
  }

  // -----------------------------------------------------------------------
  // Private: Filters
  // -----------------------------------------------------------------------

  /**
   * Remove entries older than the configured expiration window.
   * @private
   */
  _filterExpired(errors) {
    const expirationMs = this._config().cachedErrorExpirationSeconds * 1000;
    const cutoff = this._playerCore.systemClock.now() - expirationMs;
    return errors.filter((e) => e.time.getTime() > cutoff);
  }

  /**
   * Keep only errors whose codes are in the configured allow-list.
   * @private
   */
  _filterByErrorCodes(errors) {
    const allowedCodes = this._config().errorCodesToCache;
    return errors.filter((e) => allowedCodes.includes(e.code));
  }

  /**
   * Trim the list to the configured maximum count (keeping newest).
   * @private
   */
  _trimToLimit(errors) {
    return errors.slice(-this._config().cachedErrorCountLimit);
  }

  // -----------------------------------------------------------------------
  // Private: Persistence
  // -----------------------------------------------------------------------

  /**
   * Save errors to IndexedDB.
   *
   * @param {CachedDrmError[]} errors
   * @returns {Promise<CachedDrmError[]>}
   * @private
   */
  async _saveErrors(errors) {
    const serialized = {
      version: 1,
      errors: errors.map(CachedDrmErrors._serialize),
    };

    const storage = await this._storageFactory.create();
    await storage.save(STORAGE_KEY, serialized, false);
    return errors;
  }

  // -----------------------------------------------------------------------
  // Private: Validation
  // -----------------------------------------------------------------------

  /** @private */
  _isValidEntry(entry) {
    return (
      this._typeChecker.isNumber(entry[0]) &&
      this._typeChecker.isString(entry[1]) &&
      this._typeChecker.isNumber(entry[2]) &&
      (this._typeChecker.isNumber(entry[3]) || entry[3] === undefined) &&
      (this._typeChecker.isString(entry[4]) || entry[4] === undefined)
    );
  }

  /** @private */
  _isHardwareDrm(keySystem) {
    return keySystem.includes('3000') || keySystem.includes('HW_SECURE_ALL');
  }
}
