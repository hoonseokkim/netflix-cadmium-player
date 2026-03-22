/**
 * Netflix Cadmium Player -- KeySystemIds
 *
 * Maps between EME key-system identifier strings (e.g.
 * "com.widevine.alpha") and the internal {@link DrmScheme} enum.
 * Also contains helper utilities for key-system detection and
 * classification.
 *
 * Original: Webpack Module 17612
 *
 * @module drm/KeySystemIds
 */

import { DrmScheme } from './DrmScheme.js';
// import { PlaybackError } from '../core/PlaybackError.js';   // Module 31149
// import { ErrorCode } from '../core/ErrorCodes.js';           // Module 36129
// import { SecurityLevel } from './EmeConstants.js';            // Module 82100

/**
 * Well-known EME key-system identifier strings.
 */
export class KeySystemHelper {
  /** Apple FairPlay Streaming 3.0 key system. */
  static FPS_3_0 = 'com.apple.fps.3_0';

  /** Google Widevine key system. */
  static WIDEVINE = 'com.widevine.alpha';

  /** Microsoft PlayReady Recommendation (base). */
  static PLAYREADY = 'com.microsoft.playready.recommendation';

  /** Microsoft PlayReady 3000 (SL3000 -- hardware DRM). */
  static PLAYREADY_3000 = 'com.microsoft.playready.recommendation.3000';

  /** Microsoft PlayReady 2000 (SL2000 -- software DRM). */
  static PLAYREADY_2000 = 'com.microsoft.playready.recommendation.2000';

  /** Microsoft PlayReady 3000 with clear-lead support. */
  static PLAYREADY_3000_CLEARLEAD = 'com.microsoft.playready.recommendation.3000.clearlead';

  /**
   * Key-system strings that require hardware-level DRM (SL3000).
   * Used to determine whether HW-DRM restrictions apply.
   * @type {string[]}
   */
  static HW_DRM_KEY_SYSTEMS = [
    KeySystemHelper.PLAYREADY_3000,
    KeySystemHelper.PLAYREADY_3000_CLEARLEAD,
  ];

  /**
   * Parse a key-system identifier string into its corresponding DrmScheme.
   *
   * @param {string} keySystemString - EME key-system identifier.
   * @returns {DrmScheme} The matching DRM scheme enum value.
   * @throws {Error} If the key system string is unrecognised.
   */
  static parseKeySystem(keySystemString) {
    if (keySystemString) {
      if (keySystemString.includes('playready')) return DrmScheme.playready;
      if (keySystemString.includes('fps')) return DrmScheme.fairplay;
      if (keySystemString.includes('widevine')) return DrmScheme.widevine;
    }
    throw new Error(`Invalid KeySystem: ${keySystemString}`);
  }

  /**
   * Convert a DrmScheme to its human-readable DRM type name.
   *
   * @param {DrmScheme} scheme - Internal DRM scheme enum.
   * @returns {string} One of "playready", "fairplay", or "widevine".
   */
  static drmTypeFromScheme(scheme) {
    switch (scheme) {
      case DrmScheme.playready:
        return 'playready';
      case DrmScheme.fairplay:
        return 'fairplay';
      default:
        return 'widevine';
    }
  }

  /**
   * Determine whether the given key-system string represents a
   * hardware-secured DRM configuration (PlayReady SL3000 or
   * HW_SECURE_ALL robustness).
   *
   * @param {string} keySystemOrRobustness - Key system or robustness string.
   * @returns {boolean} True if hardware DRM is required.
   */
  static isHardwareDrm(keySystemOrRobustness) {
    return (
      keySystemOrRobustness.includes('3000') ||
      keySystemOrRobustness.includes('HW_SECURE_ALL')
    );
  }
}
