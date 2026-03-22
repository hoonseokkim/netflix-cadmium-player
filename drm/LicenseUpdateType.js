/**
 * Netflix Cadmium Player -- LicenseUpdateType
 *
 * Distinguishes between initial license requests and renewal requests
 * when calling `MediaKeySession.update()`.  The player uses this to
 * annotate telemetry and to route the response through the correct
 * processing pipeline.
 *
 * Original: Webpack Module 27995
 *
 * @module drm/LicenseUpdateType
 */

/**
 * @enum {number}
 */
export const LicenseUpdateType = Object.freeze({
  /** Initial license request -- first key acquisition for a session. */
  Request: 0,

  /** License renewal -- extending an existing session's validity. */
  Renewal: 1,
});
