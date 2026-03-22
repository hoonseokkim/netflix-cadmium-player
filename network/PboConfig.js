/**
 * @module PboConfig
 * @description Configuration for the PBO (Playback Orchestration) service.
 * Defines service routing commands, API versions, codec support flags,
 * manifest settings, language preferences, and timeout values used by the
 * PBO client to communicate with Netflix backend services.
 *
 * @original Module_17705
 */

// import { injectable, inject } from 'inversify';  // Module 22674
// import { ConfigBase } from '...';                 // Module 64174
// import { config, types } from '...';              // Module 12501

/**
 * @class PboConfig
 * @extends ConfigBase
 */
export class PboConfig extends ConfigBase {
  /**
   * @param {Object} configProvider - Configuration provider.
   * @param {Function} getPlayerConfig - Returns the player configuration object.
   * @param {Object} service - PBO service instance.
   * @param {Object} baseConfig - Base player configuration with codec/feature flags.
   */
  constructor(configProvider, getPlayerConfig, service, baseConfig) {
    super(configProvider, 'PboConfigImpl');

    /** @private */
    this.getPlayerConfig = getPlayerConfig;

    /** @private */
    this.service = service;

    /** @private */
    this.baseConfig = baseConfig;
  }

  /**
   * UI version string.
   * @config uiVersion
   * @type {string}
   */
  get uiVersion() {
    return this.getPlayerConfig().tw.uiVersion || '';
  }

  /**
   * UI platform identifier.
   * @config uiPlatform
   * @type {string}
   */
  get uiPlatform() {
    return this.getPlayerConfig().tw.uiPlatform || '';
  }

  /**
   * PBO protocol version.
   * @config pboVersion
   * @type {number}
   */
  get version() {
    return 2;
  }

  /**
   * Organization identifier for PBO requests.
   * @config pboOrganization
   * @type {string}
   */
  get organization() {
    return 'cadmium';
  }

  /**
   * Preferred languages for content.
   * @config pboLanguages
   * @type {string[]}
   */
  get languages() {
    return this.getPlayerConfig().tw.preferredLanguages;
  }

  /**
   * Whether playback has limited functionality.
   * @config hasLimitedPlaybackFunctionality
   * @type {boolean}
   */
  get hasLimitedPlaybackFunctionality() {
    return false;
  }

  /**
   * PBO service command routing definitions. Maps command names to service
   * endpoints with version, direct-API flags, and socket router usage.
   * @config pboCommands
   * @type {Object}
   */
  get commands() {
    return Object.assign({
      logblob: {
        service: 'logblob',
        isLogsApiDirect: true,
        version: '1',
        useSocketRouter: true,
      },
      manifest: {
        service: 'manifest',
        isPlayApiDirect: true,
        version: '1',
      },
      licensedmanifest: {
        service: 'licensedmanifest',
        isPlayApiDirect: true,
        version: '1',
      },
      license: {
        service: 'pbo_licenses',
        version: '^1.0.0',
      },
      events: {
        service: 'event',
        isPlayApiDirect: true,
        version: '1',
        useSocketRouter: true,
      },
      bind: {
        service: this.service.bindServiceName,
        version: '^1.0.0',
      },
      ping: {
        service: 'pbo_events',
        version: '^1.0.0',
      },
      config: {
        service: 'pbo_config',
        version: '^1.0.0',
      },
      prefetchLiveAds: {
        service: 'prefetchLiveAds',
        isPlayApiDirect: true,
        version: '1',
      },
      aleProvision: {
        service: 'pbo_tokens',
        version: '^1.0.0',
        orgOverride: 'nrdjs',
      },
    }, this.commandsOverride);
  }

  /**
   * Override map for PBO commands.
   * @config pboCommandsOverride
   * @type {Object}
   */
  get commandsOverride() {
    return {};
  }

  /**
   * Whether to record PBO history.
   * @config pboRecordHistory
   * @type {boolean}
   */
  get recordHistory() {
    return false;
  }

  /**
   * Maximum number of history entries to retain.
   * @config pboHistorySize
   * @type {number}
   */
  get historySize() {
    return 10;
  }

  /**
   * Whether to add X-ESN header to PBO requests.
   * @config pboAddXEsnHeader
   * @type {boolean}
   */
  get addXEsnHeader() {
    return false;
  }

  /**
   * Whether HEVC codec is enabled.
   * @type {boolean}
   */
  get enableHEVC() {
    return this.baseConfig.enableHEVC;
  }

  /**
   * Whether Dolby Vision is enabled.
   * @type {boolean}
   */
  get enableDolbyVision() {
    return this.baseConfig.enableDolbyVision;
  }

  /**
   * Whether HDR is enabled.
   * @type {boolean}
   */
  get enableHDR() {
    return this.baseConfig.enableHDR;
  }

  /**
   * Whether to use studio manifest.
   * @config pboUseStudioManifest
   * @type {boolean}
   */
  get useStudioManifest() {
    return false;
  }

  /**
   * Whether lean manifest optimization is enabled.
   * @config pboEnableLeanManifest
   * @type {boolean}
   */
  get enableLeanManifest() {
    return true;
  }

  /**
   * Header names to use for request identification.
   * @config useHeaderForRequestNames
   * @type {string[]}
   */
  get headerForRequestNames() {
    return [];
  }

  /**
   * Whether V2 optimized manifest is used.
   * @config pboEnableV2OptimizedManifest
   * @type {boolean}
   */
  get isV2Manifest() {
    return true;
  }

  /**
   * Whether V3 manifest is used.
   * @config pboEnableV3Manifest
   * @type {boolean}
   */
  get isV3Manifest() {
    return false;
  }

  /**
   * Whether low-latency streaming is enabled.
   * @type {boolean}
   */
  get enableLowLatency() {
    return this.baseConfig.enableLowLatency;
  }

  /**
   * Supported subtitle format versions.
   * @type {Array}
   */
  get subtitleVersions() {
    return this.baseConfig.subtitleVersions;
  }

  /**
   * PBO request timeout in milliseconds.
   * @config pboTimeout
   * @type {number}
   */
  get timeout() {
    return toMilliseconds(59);
  }

  /**
   * Whether PBO backoff is enabled for retries.
   * @config enablePboBackoff
   * @type {boolean}
   */
  get enablePboBackoff() {
    return true;
  }
}
