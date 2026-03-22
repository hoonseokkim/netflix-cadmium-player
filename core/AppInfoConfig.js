/**
 * @module AppInfoConfig
 * @description Application-level configuration for Netflix endpoints.
 * Extends ConfigBase to provide environment-aware URL construction for the
 * API, NQ (network quality), logs, and Play API endpoints. Supports
 * Staging, Test, Integration, and Production environments. Also determines
 * whether MSL (Message Security Layer) routing should be used.
 *
 * @see Module_7700
 */

import { __decorate, __param } from '../core/tslib';
import { injectable, inject as injectDecorator, optional } from '../core/InversifyDecorators';
import { UC as Environment } from '../core/EnvironmentEnum';
import { config as configDecorator, string as stringType } from '../core/ConfigDecorators';
import { ConfigBase } from '../core/ConfigBase';
import { gp as APP_CONFIG_KEY, internal_Kja as CONFIG_NAME_KEY } from '../core/ServiceKeys';
import { q8 as MSL_CONFIG_KEY } from '../msl/MslServiceKeys';

/**
 * Configuration class providing Netflix environment-specific endpoint URLs.
 * @extends ConfigBase
 */
export class AppInfoConfig extends ConfigBase {
  /**
   * @param {object} appConfigData - Raw configuration data
   * @param {object} environment - Environment constants
   * @param {object} mslConfig - MSL configuration for routing decisions
   * @param {string} [configName='AppInfoConfigImpl'] - Configuration name
   */
  constructor(appConfigData, environment, mslConfig, configName) {
    super(appConfigData, configName ?? 'AppInfoConfigImpl');

    /** @private */
    this._environment = environment;

    /** @private */
    this._mslConfig = mslConfig;
  }

  /**
   * Returns the NQ (Network Quality) endpoint, with MSL path prefix if applicable.
   * @param {*} context
   * @returns {string}
   */
  getNqEndpoint(context) {
    return `${this.nqBaseUrl}${this.shouldUseMsl(context) ? '/msl_v1' : ''}`;
  }

  /**
   * Returns the Play API endpoint, with MSL path prefix if applicable.
   * @param {*} context
   * @returns {string}
   */
  getPlayApiEndpoint(context) {
    return `${this.host}${this.shouldUseMsl(context) ? '/msl' : ''}/playapi`;
  }

  /**
   * Whether MSL routing should be used for the given context.
   * @param {*} context
   * @returns {boolean}
   */
  shouldUseMsl(context) {
    return this._mslConfig.shouldUseMsl(context);
  }

  /**
   * The main API endpoint URL.
   * @type {string}
   */
  get apiEndpoint() {
    return `${this.host}/api`;
  }

  /**
   * The NQ (Network Quality) base URL.
   * @type {string}
   */
  get nqBaseUrl() {
    return `${this.host}/nq`;
  }

  /**
   * The logging endpoint URL.
   * @type {string}
   */
  get logsEndpoint() {
    let hostname;
    switch (this._environment.aS) {
      case Environment.internal_Test:
      case Environment.YFa:
        hostname = 'logs.test.netflix.com';
        break;
      default:
        hostname = 'logs.netflix.com';
    }
    return `https://${hostname}/log`;
  }

  /**
   * The base host URL for the current environment.
   * @type {string}
   */
  get host() {
    let subdomain;
    switch (this._environment.aS) {
      case Environment.Staging:
        subdomain = 'www.stage';
        break;
      case Environment.internal_Test:
        subdomain = 'www-qa.test';
        break;
      case Environment.YFa:
        subdomain = 'www-int.test';
        break;
      default:
        subdomain = 'www';
    }
    return `https://${subdomain}.netflix.com`;
  }

  /**
   * The PBO (Playback Optimization) config key.
   * @type {string}
   */
  get pboConfigKey() {
    return 'pbo_config';
  }
}

// Legacy export alias
export { AppInfoConfig as DrmConfig };
