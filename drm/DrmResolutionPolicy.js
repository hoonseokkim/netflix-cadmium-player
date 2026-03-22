/**
 * @module DrmResolutionPolicy
 * @description Determines the DRM resolution trust level based on device capabilities
 * and content protection requirements. Returns LIMITED resolution if the device
 * requires restricted output or if HDCP is unavailable for protected content.
 * @see Module_54973
 */

import { trustedConfig as ResolutionTrustLevel } from '../drm/ResolutionTrustConfig.js';

/**
 * Evaluates the DRM resolution trust level for the current playback context.
 *
 * @param {Object} deviceCapabilities - Device DRM capabilities.
 * @param {boolean} deviceCapabilities.qUa - Whether device requires restricted output.
 * @param {boolean} isHdcpAvailable - Whether HDCP is available.
 * @param {boolean} isProtectedContent - Whether the content requires protection.
 * @returns {string} Resolution trust level: LIMITED or FULL ($r).
 */
export function getResolutionTrustLevel(deviceCapabilities, isHdcpAvailable, isProtectedContent) {
    if (deviceCapabilities.qUa) {
        return ResolutionTrustLevel.LIMITED;
    }
    if (isHdcpAvailable && !isProtectedContent) {
        return ResolutionTrustLevel.LIMITED;
    }
    return ResolutionTrustLevel.$r;
}
