/**
 * @file ConfigurationStore.js
 * @description Injectable configuration store with revision tracking, validation,
 *              and debug support. Provides three injectable classes:
 *              - ConfigurationDataStore: Simple key-value store with revision counter
 *              - DebugConfigurationProvider: Config provider with debug manager integration
 *              - ConfigurationProvider: Config provider with validation and fallback
 * @module ioc/ConfigurationStore
 * @original Module_80217
 */

import { __decorate, __param } from 'tslib'; // Module 22970
import { injectable, injectDecorator } from 'inversify'; // Module 22674
import { PC as DebugToken } from '../monitoring/DebugLogConsole'; // Module 90597
import { LoggerToken } from '../monitoring/ErrorDirector'; // Module 87386
import { ima as ValidatorToken } from '../core/PlayerConfig'; // Module 37187
import { QJa as FallbackProviderToken } from '../core/ConfigParameterReader'; // Module 17842
import { BP as BaseConfigToken } from '../core/PlayerServiceLocator'; // Module 83767

/**
 * A simple key-value configuration data store with revision tracking.
 * Each update increments the revision counter, enabling change detection.
 *
 * @injectable
 */
export class ConfigurationDataStore {
  constructor() {
    /** @type {Object} The configuration data */
    this._dataStore = {};

    /** @type {number} Revision counter, incremented on each update */
    this._revisionCounter = 0;
  }

  /**
   * Merges new configuration values into the store and bumps the revision.
   * @param {Object} updates - Key-value pairs to merge
   */
  update(updates) {
    this._dataStore = Object.assign({}, this._dataStore, updates);
    this._revisionCounter++;
  }

  /**
   * Returns the current configuration data.
   * @returns {Object}
   */
  get data() {
    return this._dataStore;
  }

  /**
   * Returns the current revision number.
   * @returns {number}
   */
  get revision() {
    return this._revisionCounter;
  }
}

/**
 * Configuration provider with debug manager integration.
 * Used when debug/development features are enabled.
 *
 * @injectable
 */
export class DebugConfigurationProvider {
  /**
   * @param {Object} debug - Debug interface
   * @param {Object} baseConfig - Base configuration
   * @param {Object} validator - Configuration validator
   * @param {Object} debugManager - Debug manager for logging
   * @param {Object} fallbackProvider - Fallback configuration provider
   */
  constructor(debug, baseConfig, validator, debugManager, fallbackProvider) {
    this.debug = debug;
    this.baseConfig = baseConfig;
    this.validator = validator;
    this.debugManager = debugManager;
    this.fallbackProvider = fallbackProvider;
  }
}

/**
 * Configuration provider with validation and fallback support.
 * Production version without debug manager dependency.
 *
 * @injectable
 */
export class ConfigurationProvider {
  /**
   * @param {Object} baseConfig - Base configuration
   * @param {Object} validator - Configuration validator
   * @param {Object} fallbackProvider - Fallback configuration provider
   */
  constructor(baseConfig, validator, fallbackProvider) {
    this.baseConfig = baseConfig;
    this.validator = validator;
    this.fallbackProvider = fallbackProvider;
  }
}
