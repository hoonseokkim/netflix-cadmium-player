/**
 * Netflix Cadmium Player -- DrmState
 *
 * Enumeration of DRM license lifecycle states, used to track and report
 * the progress of license acquisition, renewal, and individualization
 * through the play-delay telemetry system.
 *
 * Each state maps to a short telemetry code (e.g. "lg", "lc", "lr")
 * for efficient wire representation.
 *
 * Original: Webpack Module 28289
 *
 * @module drm/DrmState
 */

/**
 * DRM license lifecycle state identifiers.
 * @enum {number}
 */
export const DrmState = Object.freeze({
  /** License generation has started. */
  licenseStarted: 0,

  /** License challenge has been received from the CDM. */
  receivedLicenseChallenge: 1,

  /** License response has been received from the server. */
  receivedLicense: 2,

  /** Renewal challenge has been generated and sent. */
  receivedRenewalChallengeComplete: 3,

  /** Renewal license has been received from the server. */
  receivedRenewalLicenseComplete: 4,

  /** Renewal license request failed. */
  receivedRenewalLicenseFailed: 5,

  /** Individualization challenge has been generated and sent. */
  receivedIndivChallengeComplete: 6,

  /** Individualization license has been received. */
  receivedIndivLicenseComplete: 7,

  /** Initial license has been successfully added to the session. */
  addLicenseComplete: 8,

  /** Renewal license has been successfully added to the session. */
  addRenewalLicenseComplete: 9,

  /** Failed to add renewal license to the session. */
  addRenewalLicenseFailed: 10,
});

/**
 * Convert a DrmState value to its telemetry shortcode.
 *
 * @param {number} state - A {@link DrmState} enum value.
 * @returns {string} Short telemetry code (e.g. "lg", "lc", "ld").
 */
export function drmStateToTelemetryCode(state) {
  switch (state) {
    case DrmState.licenseStarted:
      return 'lg';
    case DrmState.receivedLicenseChallenge:
      return 'lc';
    case DrmState.receivedLicense:
      return 'lr';
    case DrmState.receivedRenewalChallengeComplete:
      return 'renew_lc';
    case DrmState.receivedRenewalLicenseComplete:
      return 'renew_lr';
    case DrmState.receivedRenewalLicenseFailed:
      return 'renew_lr_failed';
    case DrmState.receivedIndivChallengeComplete:
      return 'ilc';
    case DrmState.receivedIndivLicenseComplete:
      return 'ilr';
    case DrmState.addLicenseComplete:
      return 'ld';
    case DrmState.addRenewalLicenseComplete:
      return 'renew_ld';
    case DrmState.addRenewalLicenseFailed:
      return 'renew_ld_failed';
    default:
      return 'unknown';
  }
}
