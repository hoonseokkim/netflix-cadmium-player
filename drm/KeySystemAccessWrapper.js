/**
 * Netflix Cadmium Player -- KeySystemAccessWrapper
 *
 * Wraps the browser's `MediaKeySystemAccess` object with additional
 * Netflix-specific metadata:
 *
 *   - The resolved key-system string (e.g. "com.widevine.alpha")
 *   - Factory methods for creating message parsers and EME session adapters
 *   - A unique "observe key" that includes the robustness level
 *   - Tracking of MediaKeys instances via `WeakRef` for leak detection
 *
 * This wrapper is the result of the capability-probing phase and is
 * passed to the rest of the DRM pipeline for session creation.
 *
 * Original: Webpack Module 52428
 *
 * @module drm/KeySystemAccessWrapper
 */

// import { KeySystemHelper } from './KeySystemIds.js';       // Module 17612
// import { detectRobustnessLevel } from './EmeConstants.js'; // Module 82100

export class KeySystemAccessWrapper {
  /**
   * @param {string} keySystem - The resolved key-system identifier string.
   * @param {object} messageParserFactory - Factory for creating DRM message parsers.
   * @param {object} emeAdapterFactory - Factory for creating EME session adapters.
   * @param {MediaKeySystemAccess} mediaKeySystemAccess - The browser MKSA object.
   * @param {number} drmScheme - The {@link DrmScheme} enum value.
   */
  constructor(keySystem, messageParserFactory, emeAdapterFactory, mediaKeySystemAccess, drmScheme) {
    /** @type {string} */
    this.keySystem = keySystem;

    /** @private */
    this._messageParserFactory = messageParserFactory;

    /** @private */
    this._emeAdapterFactory = emeAdapterFactory;

    /** @private */
    this._mediaKeySystemAccess = mediaKeySystemAccess;

    /** @private */
    this._drmScheme = drmScheme;

    /**
     * Weak references to all `MediaKeys` objects created from this access.
     * Used for diagnostics / leak detection.
     * @type {WeakRef<MediaKeys>[]}
     * @private
     */
    this._mediaKeysRefs = [];
  }

  // -----------------------------------------------------------------------
  // MediaKeys creation
  // -----------------------------------------------------------------------

  /**
   * Create a `MediaKeys` object from the underlying access.
   * The result is tracked via `WeakRef` for leak diagnostics.
   *
   * @returns {Promise<MediaKeys>}
   */
  async createMediaKeys() {
    const mediaKeys = await this._mediaKeySystemAccess.createMediaKeys();

    if (typeof WeakRef !== 'undefined') {
      this._mediaKeysRefs.push(new WeakRef(mediaKeys));
    }

    return mediaKeys;
  }

  // -----------------------------------------------------------------------
  // Configuration introspection
  // -----------------------------------------------------------------------

  /**
   * Return the resolved `MediaKeySystemConfiguration`.
   * @returns {MediaKeySystemConfiguration}
   */
  getConfiguration() {
    return this._mediaKeySystemAccess.getConfiguration();
  }

  /**
   * Return the internal DRM scheme enum value for this key system.
   * Parsed from the raw key-system string.
   * @returns {number}
   */
  getKeySession() {
    // KeySystemHelper.parseKeySystem(this._mediaKeySystemAccess.keySystem)
    return this._drmScheme;
  }

  // -----------------------------------------------------------------------
  // Factory methods
  // -----------------------------------------------------------------------

  /**
   * Create a new EME session adapter for this key system.
   * @returns {EmeSessionAdapter}
   */
  createEmeAdapter() {
    return this._emeAdapterFactory.create(this._drmScheme);
  }

  /**
   * Create a new DRM message parser for this key system.
   * @returns {object}
   */
  createMessageParser() {
    return this._messageParserFactory.create(this._drmScheme);
  }

  // -----------------------------------------------------------------------
  // Computed properties
  // -----------------------------------------------------------------------

  /**
   * A unique key combining the key-system identifier and the resolved
   * robustness level (e.g. "com.widevine.alpha.HW_SECURE_ALL").
   *
   * Used as a cache key and for telemetry.
   *
   * @type {string}
   */
  get observeKey() {
    let key = this.keySystem;
    const robustness = this._detectRobustness();
    if (robustness) {
      key += '.' + robustness;
    }
    return key;
  }

  /**
   * The number of `MediaKeys` instances created from this access
   * that are still reachable (not garbage-collected).
   *
   * @type {number}
   */
  get activeMediaKeysCount() {
    return this._mediaKeysRefs.filter((ref) => ref.deref() !== undefined).length;
  }

  // -----------------------------------------------------------------------
  // Private
  // -----------------------------------------------------------------------

  /**
   * Detect the robustness level from the resolved configuration.
   *
   * @returns {string|undefined}
   * @private
   */
  _detectRobustness() {
    const config = this._mediaKeySystemAccess.getConfiguration();
    const levels = ['HW_SECURE_ALL', 'SW_SECURE_DECODE', 'SW_SECURE_CRYPTO'];
    return levels.find((level) => {
      return config.videoCapabilities?.some((cap) => cap.robustness === level);
    });
  }
}
