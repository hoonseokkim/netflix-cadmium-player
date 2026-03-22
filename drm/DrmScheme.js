/**
 * Netflix Cadmium Player -- DrmScheme
 *
 * Enumeration of supported DRM scheme types.  Used throughout the player
 * to branch on DRM-specific logic (message parsing, PSSH generation,
 * key-system selection, etc.).
 *
 * Original: Webpack Module 53921
 *
 * @module drm/DrmScheme
 */

/**
 * Supported DRM scheme identifiers.
 * @enum {number}
 */
export const DrmScheme = Object.freeze({
  /** Microsoft PlayReady. */
  playready: 0,

  /** Google Widevine (used on Chrome, Firefox, Android). */
  widevine: 1,

  /** Apple FairPlay Streaming (used on Safari, iOS, tvOS). */
  fairplay: 2,
});
