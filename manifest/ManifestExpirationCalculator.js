/**
 * Netflix Cadmium Player -- ManifestExpirationCalculator
 *
 * Computes the time-to-live (TTL) for a manifest, which determines when
 * the player should request a refreshed manifest. The TTL depends on:
 *
 * - Sticky steering metadata (Infinity if sticky steering is active)
 * - A custom expiration override from the manifest (pOb)
 * - The manifest's "wid" (window duration) field
 * - Whether the manifest is for a short-form title (15 min default vs 2 hr)
 *
 * @module manifest/ManifestExpirationCalculator
 * @original Module_37349
 */

/**
 * Compute the expiration time (in milliseconds) for a manifest.
 *
 * Priority:
 * 1. If sticky steering is active and the feature flag is on, return Infinity
 *    (never expire -- the steering layer will handle refresh).
 * 2. If conditional-no-download is set and the manifest carries a custom TTL,
 *    return that custom TTL.
 * 3. Otherwise, use the manifest's `wid` field (seconds) or fall back to
 *    900s (short-form) / 7200s (long-form), converted to milliseconds.
 *
 * @param {Object} manifest - Parsed manifest data
 * @param {number} [manifest.pOb] - Custom TTL override in ms
 * @param {boolean} [manifest.hEb] - True if short-form content
 * @param {Object} [manifest.steeringAdditionalInfo] - Steering metadata
 * @param {Object} config - Streaming configuration
 * @param {number} [config.wid] - Manifest window duration in seconds
 * @param {boolean} [config.cnd] - Conditional-no-download flag
 * @param {boolean} stickySteeringEnabled - Whether sticky steering is enabled
 * @returns {number} TTL in milliseconds, or Infinity
 */
export function computeManifestExpirationTime(manifest, config, stickySteeringEnabled) {
    const windowDuration = config.wid;

    // Sticky steering: never expire
    if (stickySteeringEnabled) {
        const steeringMeta = manifest.steeringAdditionalInfo?.stickySteeringMetadata;
        if (steeringMeta?.isActive) {
            return Infinity;
        }
    }

    // Custom TTL from manifest (conditional-no-download mode)
    if (config.cnd && manifest.customTtlMs !== undefined) {
        return manifest.customTtlMs;
    }

    // Default: use wid, or 900s (short-form) / 7200s (long-form)
    const ttlSeconds = windowDuration
        ? windowDuration
        : (manifest.isShortForm ? 900 : 7200);

    return 1000 * ttlSeconds;
}
