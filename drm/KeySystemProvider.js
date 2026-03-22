/**
 * Netflix Cadmium Player -- KeySystemProvider
 *
 * Evaluates which DRM key systems are available and suitable for the
 * current device.  This is the first stage of the DRM pipeline and
 * runs before any `requestMediaKeySystemAccess()` call.
 *
 * The provider:
 *   1. Reads the configured key-system list (e.g. `["com.widevine.alpha"]`)
 *   2. Expands each entry with its robustness variants
 *   3. Checks hardware-DRM eligibility (OS version, architecture)
 *   4. Checks the key-system restrictor for recent error history
 *   5. Returns an ordered list of candidates with their support status
 *
 * Original: Webpack Module 48691
 *
 * @module drm/KeySystemProvider
 */

// import { KeySystemHelper } from './KeySystemIds.js';             // Module 17612
// import { EmeConstants } from './EmeConstants.js';                 // Module 82100
// import { MediaKeyServicesSymbol } from './MediaKeyServicesSymbol.js'; // Module 21103

/**
 * @typedef {Object} KeySystemCandidate
 * @property {{ keySystem: string, robustness?: string }} config - Key system + robustness.
 * @property {{ supported: boolean, reason?: string }}    status - Current support status.
 */

export class KeySystemProvider {
  /**
   * @param {object} logger - Debug logger factory.
   * @param {Function} config - Configuration accessor.
   * @param {object} messageParserFactory - Factory for DRM message parsers.
   * @param {object} keySystemRestrictor - Tracks key-system error history.
   * @param {object} platformInfo - Provides architecture / OS version info.
   * @param {object} licenseManager - Promise-timeout manager.
   */
  constructor(logger, config, messageParserFactory, keySystemRestrictor, platformInfo, licenseManager) {
    /** @private */ this._config = config;
    /** @private */ this._messageParserFactory = messageParserFactory;
    /** @private */ this._keySystemRestrictor = keySystemRestrictor;
    /** @private */ this._platformInfo = platformInfo;
    /** @private */ this._licenseManager = licenseManager;

    this.log = logger.createSubLogger('KeySystemProvider');
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  /**
   * Evaluate all configured key-system candidates and return an ordered
   * list with their support status.
   *
   * @returns {Promise<KeySystemCandidate[]>}
   */
  async getKeySystemCandidates() {
    try {
      const candidates = this._buildCandidateList();

      const [hwDrmReason, restrictedKeySystems] = await Promise.all([
        this._checkHardwareDrmEligibility(),
        this._keySystemRestrictor.getRestrictedKeySystems(),
      ]);

      // Apply hardware-DRM eligibility
      candidates.forEach((candidate) => {
        const reason = this._evaluateHwDrmRequirement(candidate.config, hwDrmReason);
        if (reason) {
          candidate.status = { supported: false, reason };
        }
      });

      // Find the best (highest-priority) supported candidate
      const bestIndex = this._findBestSupported(candidates);

      // Apply error-based restrictions (skip the best candidate)
      candidates.forEach((candidate, index) => {
        if (candidate.status.supported && index !== bestIndex) {
          const key = this._candidateKey(candidate.config);
          if (restrictedKeySystems.includes(key)) {
            candidate.status = { supported: false, reason: 'too-many-errors' };
          }
        }
      });

      return candidates;
    } catch (err) {
      this.log.error('KeySystemProvider failed.', err);
      throw err;
    }
  }

  // -----------------------------------------------------------------------
  // Private: Candidate list construction
  // -----------------------------------------------------------------------

  /**
   * Build the initial list of key-system candidates from configuration.
   *
   * @returns {KeySystemCandidate[]}
   * @private
   */
  _buildCandidateList() {
    const keySystems = this._config().configuredKeySystems || [this._config().defaultKeySystem];

    const expanded = keySystems.map((ks) => {
      const scheme = this._parseKeySystem(ks);
      const robustnessLevels = this._messageParserFactory.create(scheme).getSupportedRobustnessLevels();

      return (robustnessLevels.length > 0 ? robustnessLevels : [undefined]).map((robustness) => ({
        keySystem: ks,
        robustness,
      }));
    });

    // Flatten and create candidates with default "supported" status
    return expanded.flat().map((config) => ({
      config,
      status: { supported: true },
    }));
  }

  // -----------------------------------------------------------------------
  // Private: Hardware DRM eligibility
  // -----------------------------------------------------------------------

  /**
   * Check whether the device is eligible for hardware DRM.
   *
   * @returns {Promise<string|undefined>} Reason string if ineligible.
   * @private
   */
  async _checkHardwareDrmEligibility() {
    if (this._config().enableHwDrmByOsVersion) {
      const osVersion = await this._getOsVersion();
      const minVersion = this._config().minHwDrmOsVersion;
      if (!this._meetsMinVersion(osVersion, minVersion)) {
        return 'os-version';
      }
      return undefined;
    }

    if (this._config().enableHwDrmByArchitecture) {
      const arch = await this._getArchitecture();
      if (arch !== 'arm') {
        return 'architecture-not-arm';
      }
      return undefined;
    }

    return 'hwdrm-not-enabled';
  }

  /**
   * Evaluate whether a specific candidate requires hardware DRM and
   * whether that requirement is met.
   *
   * @param {{ keySystem: string, robustness?: string }} config
   * @param {string|undefined} hwDrmReason
   * @returns {string|undefined} Disqualification reason, or undefined.
   * @private
   */
  _evaluateHwDrmRequirement(config, hwDrmReason) {
    const isHwRequired =
      config.robustness === 'HW_SECURE_ALL' ||
      this._isHwKeySystem(config.keySystem);

    if (isHwRequired) {
      if (hwDrmReason) return hwDrmReason;

      // Screen-height check for non-arm HW DRM
      if (this._config().enforceScreenHeightForHwDrm &&
          1440 > globalThis.screen.height * globalThis.devicePixelRatio) {
        return 'hwdrm-screen-height';
      }
    }

    return undefined;
  }

  // -----------------------------------------------------------------------
  // Private: Platform queries
  // -----------------------------------------------------------------------

  /** @private */
  async _getArchitecture() {
    try {
      return await this._licenseManager.withTimeout(1000, this._platformInfo.architecture);
    } catch {
      return undefined;
    }
  }

  /** @private */
  async _getOsVersion() {
    try {
      return await this._licenseManager.withTimeout(1000, this._platformInfo.platformVersion);
    } catch {
      return undefined;
    }
  }

  // -----------------------------------------------------------------------
  // Private: Utility
  // -----------------------------------------------------------------------

  /** @private */
  _meetsMinVersion(version, minMajor) {
    if (minMajor === 0) return true;
    if (!version) return false;
    return (parseInt(version.split('.')[0], 10) || 0) >= minMajor;
  }

  /** @private */
  _isHwKeySystem(ks) {
    return ks.includes('3000');
  }

  /** @private */
  _parseKeySystem(ks) {
    if (ks?.includes('playready')) return 0;
    if (ks?.includes('fps')) return 2;
    if (ks?.includes('widevine')) return 1;
    throw new Error(`Invalid KeySystem: ${ks}`);
  }

  /** @private */
  _candidateKey(config) {
    return config.robustness
      ? `${config.keySystem}.${config.robustness}`
      : config.keySystem;
  }

  /** @private */
  _findBestSupported(candidates) {
    for (let i = candidates.length - 1; i >= 0; i--) {
      if (candidates[i].status.supported) return i;
    }
    return undefined;
  }
}
