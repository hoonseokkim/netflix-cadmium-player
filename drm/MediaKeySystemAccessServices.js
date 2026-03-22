/**
 * Netflix Cadmium Player -- MediaKeySystemAccessServices
 *
 * Orchestrates the DRM key-system discovery and validation pipeline.
 * This is the primary entry point for establishing DRM capabilities:
 *
 *   1. Queries the {@link KeySystemProvider} for supported key systems
 *      and their robustness levels
 *   2. Iterates through candidates, calling
 *      `navigator.requestMediaKeySystemAccess()` for each
 *   3. Optionally validates the key system by performing a test
 *      `generateRequest` cycle
 *   4. Caches the result as a singleton promise for reuse
 *   5. Determines the DRM type string (widevine/playready/fairplay)
 *      for manifest requests
 *
 * The result is a {@link KeySystemAccessWrapper} that the rest of the
 * DRM pipeline uses to create sessions and obtain licenses.
 *
 * Original: Webpack Module 9717
 *
 * @module drm/MediaKeySystemAccessServices
 */

// import { DrmScheme } from './DrmScheme.js';                         // Module 53921
// import { KeySystemHelper } from './KeySystemIds.js';                // Module 17612
// import { DrmError } from '../core/DrmError.js';                     // Module 61731
// import { ErrorCode, EventTypeEnum } from '../core/ErrorCodes.js';   // Module 36129
// import { KeySystemAccessWrapper } from './KeySystemAccessWrapper.js'; // Module 52428
// import { EmeConstants } from './EmeConstants.js';                    // Module 82100
// import { CodecStrings } from '../media/CodecStrings.js';            // Module 73796
// import { DrmInitDataPssh } from './DrmInitDataPssh.js';             // Module 84218

/**
 * Manages discovery and caching of the browser's MediaKeySystemAccess.
 */
export class MediaKeySystemAccessServices {
  /**
   * @param {object} logger - Debug logger factory.
   * @param {object} base64Codec - Base64 encode/decode utility.
   * @param {Function} config - Configuration accessor.
   * @param {object} platformConfig - Platform feature flags.
   * @param {object} mksaInternalFactory - Factory for creating MKSA internal objects.
   * @param {object} emeAdapterFactory - Factory for EME session adapters.
   * @param {object} keySystemProvider - Provider of key-system candidates.
   */
  constructor(logger, base64Codec, config, platformConfig, mksaInternalFactory, emeAdapterFactory, keySystemProvider) {
    /** @private */ this._logger = logger;
    /** @private */ this._base64 = base64Codec;
    /** @private */ this._config = config;
    /** @private */ this._platformConfig = platformConfig;
    /** @private */ this._mksaFactory = mksaInternalFactory;
    /** @private */ this._emeAdapterFactory = emeAdapterFactory;
    /** @private */ this._keySystemProvider = keySystemProvider;

    this.log = logger.createSubLogger('MediaKeySystemAccessServices');

    /** @type {Promise<KeySystemAccessWrapper>|undefined} @private */
    this._accessPromise = undefined;

    /** @type {KeySystemAccessWrapper|undefined} */
    this.keySystemAccess = undefined;

    /** @type {string|undefined} */
    this.observeKey = undefined;
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  /**
   * Get (or lazily create) the `KeySystemAccessWrapper`.
   * The result is cached as a singleton promise.
   *
   * @returns {Promise<KeySystemAccessWrapper>}
   */
  getAccess() {
    if (!this._accessPromise) {
      this._accessPromise = this._discoverKeySystem();
    }
    return this._accessPromise;
  }

  /**
   * Determine the DRM type string for manifest requests.
   *
   * If multiple key systems are configured, determines the type from
   * the resolved access; otherwise computes it directly from config.
   *
   * @returns {Promise<string>} One of "widevine", "playready", "fairplay".
   */
  getDrmType() {
    const keySystems = this._config().configuredKeySystems || [this._config().defaultKeySystem];

    if (keySystems.length > 1) {
      const types = keySystems.map((ks) => this._keySystemHelper.drmTypeFromScheme(
        this._keySystemHelper.parseKeySystem(ks),
      ));

      if (new Set(types).size === 1) {
        return Promise.resolve(types[0]);
      }

      // Ambiguous -- must resolve from actual access
      return this.getAccess()
        .then((access) => access.getKeySession())
        .then((scheme) => this._keySystemHelper.drmTypeFromScheme(scheme));
    }

    const scheme = this._keySystemHelper.parseKeySystem(keySystems[0]);
    return Promise.resolve(this._keySystemHelper.drmTypeFromScheme(scheme));
  }

  // -----------------------------------------------------------------------
  // Computed properties
  // -----------------------------------------------------------------------

  /** @type {string|undefined} The resolved key-system observe-key. */
  get currentKeySystem() {
    return this.observeKey;
  }

  /** @type {Array|undefined} Key-system probe results. */
  get probeResults() {
    return this._probeResults;
  }

  /** @type {number|undefined} Active MediaKeys instance count. */
  get activeMediaKeysCount() {
    return this.keySystemAccess?.activeMediaKeysCount;
  }

  // -----------------------------------------------------------------------
  // Private: Discovery pipeline
  // -----------------------------------------------------------------------

  /**
   * Discover and validate the best available key system.
   *
   * @returns {Promise<KeySystemAccessWrapper>}
   * @private
   */
  async _discoverKeySystem() {
    try {
      const candidates = await this._keySystemProvider.key();
      this._probeResults = candidates;

      const bestIndex = this._findBestSupported(candidates);

      // Build a chain of lazy promises, one per candidate
      const attempts = candidates.map((candidate, index) => {
        return () => {
          if (!candidate.status.supported) {
            return Promise.reject(new Error(`${candidate.keySystem}: ${candidate.status.reason}`));
          }

          const isBestCandidate = index === bestIndex;
          const shouldValidate = this._config().validateKeySystemAccess && !isBestCandidate;

          return this._requestAccess(candidate.keySystem, candidate.robustness)
            .catch((err) => {
              this._markUnsupported(candidates, index, 'not-supported');
              throw err;
            })
            .then((access) => {
              return shouldValidate ? this._validateAccess(access) : access;
            })
            .catch((err) => {
              this._markUnsupported(candidates, index, 'validation-failed');
              throw err;
            });
        };
      });

      // Try each candidate in order, falling back on failure
      const access = await this._tryInOrder(attempts);

      this.keySystemAccess = access;
      this.observeKey = access.observeKey;
      return access;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Request a `MediaKeySystemAccess` for a specific key system.
   *
   * @param {string} keySystem - Key-system identifier.
   * @param {string} [robustness] - Robustness level.
   * @returns {Promise<KeySystemAccessWrapper>}
   * @private
   */
  _requestAccess(keySystem, robustness) {
    const scheme = this._keySystemHelper.parseKeySystem(keySystem);
    const configs = this._buildConfigurations(scheme, robustness, keySystem);

    return new Promise((resolve, reject) => {
      const adapter = this._emeAdapterFactory.create(scheme);

      adapter.requestMediaKeySystemAccess(keySystem, configs)
        .then((access) => {
          this._validateCapabilities(access, keySystem, robustness);
          this.log.info('Created media key system access', {
            keySystem,
            config: access.getConfiguration ? JSON.stringify(access.getConfiguration()) : undefined,
          });

          const wrapper = this._mksaFactory.create(keySystem, access, scheme);
          resolve(wrapper);
        })
        .catch((err) => {
          this.log.warn('Unable to create media key system access', {
            keySystem,
            error: err.message,
          });
          reject(new Error(
            `EME_CREATE_MEDIAKEYS_SYSTEMACCESS_FAILED: ${err.message}`,
          ));
        });
    });
  }

  /**
   * Build `MediaKeySystemConfiguration` objects for the given scheme.
   *
   * @param {number} scheme - DrmScheme enum.
   * @param {string} [robustness] - Robustness level string.
   * @param {string} keySystem - Key-system identifier.
   * @returns {MediaKeySystemConfiguration[]}
   * @private
   */
  _buildConfigurations(scheme, robustness, keySystem) {
    const isHwDrm =
      (robustness === 'HW_SECURE_ALL' || this._isHwKeySystem(keySystem)) &&
      this._config().enableHevcWithHwDrm;

    const videoCapabilities = [
      { contentType: 'video/mp4;codecs=avc1.42E01E' },
    ];

    if (isHwDrm) {
      videoCapabilities.push({ contentType: 'video/mp4;codecs=hev1.2.4.L153.B0' });
    }

    if (robustness) {
      videoCapabilities.forEach((cap) => { cap.robustness = robustness; });
    }

    const config = {
      initDataTypes: ['cenc'],
      videoCapabilities,
      sessionTypes: ['temporary'],
    };

    // Widevine with persistent state requirement
    if (scheme === 1 /* DrmScheme.widevine */ && this._platformConfig.requirePersistentState) {
      config.persistentState = 'required';
    }

    return [config];
  }

  /**
   * Validate that the resolved capabilities include the expected codecs.
   *
   * @param {MediaKeySystemAccess} access
   * @param {string} keySystem
   * @param {string} [robustness]
   * @throws {Error} If required codecs are not supported.
   * @private
   */
  _validateCapabilities(access, keySystem, robustness) {
    const isHwDrm =
      (robustness === 'HW_SECURE_ALL' || this._isHwKeySystem(keySystem)) &&
      this._config().enableHevcWithHwDrm;

    const caps = access.getConfiguration().videoCapabilities;
    if (!caps?.some((c) => c.contentType === 'video/mp4;codecs=avc1.42E01E')) {
      throw new Error('AVC not supported');
    }
    if (isHwDrm && !caps?.some((c) => c.contentType === 'video/mp4;codecs=hev1.2.4.L153.B0')) {
      throw new Error('HEVC not supported');
    }
  }

  /**
   * Validate a key-system access by performing a test license cycle.
   *
   * @param {KeySystemAccessWrapper} access
   * @returns {Promise<KeySystemAccessWrapper>}
   * @private
   */
  async _validateAccess(access) {
    const scheme = access.getKeySession();
    const adapter = access.createEmeAdapter();
    const parser = access.createMessageParser();

    const mediaKeys = await access.createMediaKeys();
    adapter.createSession(mediaKeys, () => {});

    await adapter.setServerCertificate(mediaKeys, parser.getServerCertificate());
    await adapter.generateRequest('cenc', this._getTestInitData(scheme), false);
    await adapter.close();

    return access;
  }

  /**
   * Get test init-data (PSSH boxes) for the given DRM scheme.
   *
   * @param {number} scheme - DrmScheme enum.
   * @returns {Uint8Array[]}
   * @private
   */
  _getTestInitData(scheme) {
    // Uses DrmInitDataPssh (Module 84218) test PSSH data
    const DrmScheme = { playready: 0, widevine: 1, fairplay: 2 };
    switch (scheme) {
      case DrmScheme.fairplay:
        return ['c2tkOi8v...'].map(this._base64.decode); // FairPlay SKD URLs
      case DrmScheme.playready:
        return ['AAADPHBzc2g...'].map(this._base64.decode); // PlayReady PSSH
      default:
        return ['AAAANHBzc2g...'].map(this._base64.decode); // Widevine PSSH
    }
  }

  // -----------------------------------------------------------------------
  // Utility
  // -----------------------------------------------------------------------

  _isHwKeySystem(keySystem) {
    return keySystem.includes('3000');
  }

  _findBestSupported(candidates) {
    for (let i = candidates.length - 1; i >= 0; i--) {
      if (candidates[i].status.supported) return i;
    }
    return undefined;
  }

  _markUnsupported(candidates, index, reason) {
    if (reason && candidates[index].status.supported) {
      candidates[index].status = { supported: false, reason };
    }
  }

  /**
   * Try each factory function in order, returning the first success.
   *
   * @param {Array<() => Promise>} attempts
   * @returns {Promise}
   * @private
   */
  _tryInOrder(attempts) {
    return attempts.reduce(
      (chain, attempt) => chain.catch(() => attempt()),
      Promise.reject(new Error('keySystem missing')),
    );
  }

  /** @private */
  get _keySystemHelper() {
    // Lazy reference to avoid circular imports
    return {
      parseKeySystem(ks) {
        if (ks?.includes('playready')) return 0;
        if (ks?.includes('fps')) return 2;
        if (ks?.includes('widevine')) return 1;
        throw new Error(`Invalid KeySystem: ${ks}`);
      },
      drmTypeFromScheme(s) {
        return s === 0 ? 'playready' : s === 2 ? 'fairplay' : 'widevine';
      },
    };
  }
}
