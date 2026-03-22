/**
 * Netflix Cadmium Player -- EmeSessionAdapterFactory
 *
 * Factory that creates the appropriate EME session adapter based on
 * the DRM scheme in use.  The three adapters are:
 *
 *   - **Widevine** (default): {@link EmeSessionAdapter}
 *   - **PlayReady**: {@link PlayReadyEmeSessionAdapter}
 *     (supports renewal via new session)
 *   - **FairPlay**: {@link FairPlayEmeSessionAdapter}
 *     (custom PSSH building and JSON response transformation)
 *
 * Injected into the DRM pipeline via IoC; used by
 * {@link MediaKeySystemAccessServices} and {@link EmeSession}.
 *
 * Original: Webpack Module 17250
 *
 * @module drm/EmeSessionAdapterFactory
 */

import { EmeSessionAdapter } from './EmeSessionAdapter.js';
import { PlayReadyEmeSessionAdapter } from './PlayReadyEmeSessionAdapter.js';
import { FairPlayEmeSessionAdapter } from './FairPlayEmeSessionAdapter.js';

/**
 * DRM scheme enum values (mirrors DrmScheme from Module 53921).
 * @private
 */
const DrmScheme = Object.freeze({
  playready: 0,
  widevine: 1,
  fairplay: 2,
});

/**
 * Creates the correct EME session adapter for a given DRM scheme.
 */
export class EmeSessionAdapterFactory {
  /**
   * @param {object} elementFactory - DOM element factory.
   * @param {object} textDecoder - Text encoder/decoder wrapper.
   * @param {object} base64Codec - Base64 encode/decode utility.
   * @param {object} typeChecker - Runtime type-check utility.
   * @param {object} navigator - Browser navigator reference.
   * @param {object} platformConfig - Platform feature flags.
   */
  constructor(elementFactory, textDecoder, base64Codec, typeChecker, navigator, platformConfig) {
    /** @private */ this._elementFactory = elementFactory;
    /** @private */ this._textDecoder = textDecoder;
    /** @private */ this._base64Codec = base64Codec;
    /** @private */ this._typeChecker = typeChecker;
    /** @private */ this._navigator = navigator;
    /** @private */ this._platformConfig = platformConfig;
  }

  /**
   * Create an EME session adapter for the given DRM scheme.
   *
   * @param {number} drmScheme - A {@link DrmScheme} enum value.
   * @returns {EmeSessionAdapter} The appropriate adapter instance.
   */
  create(drmScheme) {
    const args = [
      this._navigator,
      this._typeChecker,
      this._base64Codec,
      this._elementFactory,
      this._platformConfig,
      this._textDecoder,
    ];

    switch (drmScheme) {
      case DrmScheme.playready:
        return new PlayReadyEmeSessionAdapter(...args);

      case DrmScheme.fairplay:
        return new FairPlayEmeSessionAdapter(...args);

      default:
        return new EmeSessionAdapter(...args);
    }
  }
}
