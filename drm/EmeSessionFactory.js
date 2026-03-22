/**
 * Netflix Cadmium Player -- EmeSessionFactory
 *
 * Injectable factory that creates {@link EmeSession} instances.
 * Each call to `create()` resolves the current
 * {@link KeySystemAccessWrapper} from
 * {@link MediaKeySystemAccessServices} and passes it (along with
 * the logger, clock, config, and license manager) to the
 * `EmeSession` constructor.
 *
 * This factory is the bridge between the IoC container and the
 * per-playback DRM session lifecycle.
 *
 * Original: Webpack Module 74946
 *
 * @module drm/EmeSessionFactory
 */

// import { EmeSession } from './EmeSession.js';                               // Module 97737
// import { MediaKeySystemAccessServices } from './MediaKeySystemAccessServices.js'; // Module 9717

/**
 * Factory for creating EmeSession instances.
 *
 * Injected dependencies (via IoC decorators in the original):
 *   - LoggerFactory       (Module 87386)
 *   - Clock               (Module 81918)
 *   - Base64Codec         (Module 2248)
 *   - PlatformConfig      (Module 23563)
 *   - PromiseTimerFactory (Module 59818)
 *   - MediaKeyServices    (Module 21103)
 */
export class EmeSessionFactory {
  /**
   * @param {object} loggerFactory - Creates sub-loggers for DRM components.
   * @param {object} clock - System clock for timestamp generation.
   * @param {object} base64Codec - Base64 encode/decode utility.
   * @param {object} config - DRM configuration (timeouts, flags, etc.).
   * @param {object} licenseManager - Promise-timeout manager for DRM operations.
   * @param {object} mediaKeyServices - The {@link MediaKeySystemAccessServices} singleton.
   */
  constructor(loggerFactory, clock, base64Codec, config, licenseManager, mediaKeyServices) {
    /** @private */ this._loggerFactory = loggerFactory;
    /** @private */ this._clock = clock;
    /** @private */ this._base64Codec = base64Codec;
    /** @private */ this._config = config;
    /** @private */ this._licenseManager = licenseManager;
    /** @private */ this._mediaKeyServices = mediaKeyServices;
  }

  /**
   * Create a new EmeSession.
   *
   * Resolves the key-system access (triggering discovery if needed),
   * then constructs the session with all required dependencies.
   *
   * @returns {Promise<EmeSession>} A new, uninitialised EME session.
   */
  async create() {
    const encryptionSession = await this._mediaKeyServices.getAccess();

    // EmeSession constructor signature:
    //   (logger, clock, base64Codec, config, licenseManager, encryptionSession)
    return new EmeSessionImpl(
      this._loggerFactory,
      this._clock,
      this._base64Codec,
      this._config,
      this._licenseManager,
      encryptionSession,
    );
  }
}

/**
 * Placeholder reference for the actual EmeSession class.
 * In the real codebase this is Module_97737's `ycb` export.
 *
 * @private
 */
class EmeSessionImpl {
  constructor(loggerFactory, clock, base64Codec, config, licenseManager, encryptionSession) {
    this._loggerFactory = loggerFactory;
    this._clock = clock;
    this._base64Codec = base64Codec;
    this._config = config;
    this._licenseManager = licenseManager;
    this._encryptionSession = encryptionSession;
  }
}
