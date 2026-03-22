/**
 * Netflix Cadmium Player -- MediaKeyServicesSymbol
 *
 * Dependency-injection symbol and helper utilities for the MediaKey
 * services layer.  Used by the IoC container to resolve the
 * {@link MediaKeySystemAccessServices} singleton.
 *
 * Also provides utility functions for evaluating key-system support
 * status during the capability-probing phase.
 *
 * Original: Webpack Module 21103
 *
 * @module drm/MediaKeyServicesSymbol
 */

/**
 * IoC container binding key for the MediaKeySystemAccess services.
 * @type {string}
 */
export const MediaKeyServicesSymbol = 'MediaKeySystemAccessServicesSymbol';

/**
 * @typedef {Object} KeySystemSupportStatus
 * @property {boolean} supported - Whether the key system is supported.
 * @property {string}  [reason]  - Reason string if not supported.
 */

/**
 * Create a support-status object.  If a reason string is provided the
 * status is "not supported"; otherwise it is "supported".
 *
 * @param {string} [reason] - Optional reason for unsupported status.
 * @returns {KeySystemSupportStatus}
 */
export function createSupportStatus(reason) {
  return reason
    ? { supported: false, reason }
    : { supported: true };
}

/**
 * Mark a key-system entry as unsupported if a disqualifying reason is
 * provided and the entry is currently marked as supported.
 *
 * @param {Array<{ status: KeySystemSupportStatus }>} entries - Key system entries.
 * @param {number} index - Index of the entry to update.
 * @param {string} [reason] - Disqualifying reason.
 */
export function disqualifyKeySystem(entries, index, reason) {
  if (reason && entries[index].status.supported) {
    entries[index].status = createSupportStatus(reason);
  }
}

/**
 * Find the index of the last supported key-system entry (highest
 * priority).  Returns `undefined` if no entry is supported.
 *
 * @param {Array<{ status: KeySystemSupportStatus }>} entries
 * @returns {number|undefined}
 */
export function findBestSupportedIndex(entries) {
  let bestIndex;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].status.supported) {
      bestIndex = i;
      break;
    }
  }
  return bestIndex;
}
