/**
 * @module EdgePlatformConfig
 * @description Platform configuration for Microsoft Edge (Chromium and legacy).
 *              Detects hardware DRM capabilities (HEVC, HDR, Dolby Vision) through
 *              MSMediaKeys, determines PlayReady support, and builds capability
 *              profiles for audio/video playback configuration.
 *              Original: Module_30837
 */

import { CapabilityDetectorType } from '../media/CapabilityDetectorType'; // Module 56800 (XF, ks)
import { KeySystemNames } from '../drm/DrmScheme'; // Module 17612 (wb)
import { AudioVideoProfiles } from '../media/AudioVideoProfiles'; // Module 75568
import { getBaseDeviceConfig, getBaseStreamingConfig } from '../streaming/AseStreamingConfigDefaults'; // Module 64232
import { CodecProfiles } from '../media/HevcProfileConfig'; // Module 73796 (zc)
import { flattenAndMap } from '../utils/CollectionUtils'; // Module 88195
import { FeatureLists } from '../media/FeatureLists'; // Module 75456 (nameMap)

/**
 * Detects hardware DRM and HDR capabilities on Edge/Windows.
 * @param {boolean} enableHWDRM - Whether HW DRM should be tested
 * @param {boolean} disablePlayReady - Whether PlayReady is disabled
 * @returns {{ supportsHwdrmHevc: boolean, supportsHwdrmAny: boolean }}
 */
export function detectHardwareDrmCapabilities(enableHWDRM, disablePlayReady) {
    let supportsHwdrmHevc;
    let supportsHwdrmAny;

    if (enableHWDRM) {
        const isHighResScreen = window.screen.height * window.devicePixelRatio >= 1440;
        const supportsHevcHwdrm = supportsHevcMse() && supportsHevcPlayReady() && (isHighResScreen || supportsHevcHdr() || supportsHdrMediaQuery());
        supportsHwdrmHevc = supportsHevcHwdrm;
        supportsHwdrmAny = supportsHevcHwdrm || supportsDolbyVisionPlayReady();
    } else {
        supportsHwdrmHevc = window.MSMediaKeys?.isTypeSupported(KeySystemNames.playReady, CodecProfiles.playReadyHwdrmHevc);
        supportsHwdrmAny = supportsHwdrmHevc || window.MSMediaKeys?.isTypeSupported(KeySystemNames.playReadyLegacy, CodecProfiles.playReadyHwdrmHevc);
    }

    if (disablePlayReady) {
        supportsHwdrmHevc = supportsHwdrmAny = false;
    }

    return {
        supportsHwdrmHevc,
        supportsHwdrmAny,
    };
}

/**
 * Checks if the display supports HDR via the dynamic-range media query.
 * @returns {boolean}
 */
export function supportsHdrMediaQuery() {
    return !!window.matchMedia?.("(dynamic-range: high)").matches;
}

/**
 * Tests if a given key system + features combo is "probably" supported.
 * @param {string} keySystem - Key system string
 * @param {string} features - Feature/codec string
 * @returns {boolean}
 */
export function isTypeSupportedWithFeatures(keySystem, features) {
    try {
        return "probably" === window.MSMediaKeys?.isTypeSupportedWithFeatures?.(keySystem, features);
    } catch {
        return false;
    }
}

/**
 * Checks Dolby Vision PlayReady support.
 * @returns {boolean}
 */
export function supportsDolbyVisionPlayReady() {
    return isTypeSupportedWithFeatures(KeySystemNames.playReadyLegacy, CodecProfiles.dolbyVisionPlayReady);
}

/**
 * Checks HEVC MSE support via PlayReady with specific features.
 * @returns {boolean}
 */
export function supportsHevcMse() {
    return isTypeSupportedWithFeatures(
        KeySystemNames.playReady,
        `video/mp4;codecs=${CodecProfiles.hevcMain10};features=${FeatureLists.hevcFeatures.join(",")}`
    );
}

/**
 * Checks HEVC PlayReady key system support.
 * @returns {boolean}
 */
export function supportsHevcPlayReady() {
    return window.MSMediaKeys?.isTypeSupported(KeySystemNames.playReady, CodecProfiles.hevcPlayReady);
}

/**
 * Checks HEVC HDR support with specific codec profile features.
 * @returns {boolean}
 */
export function supportsHevcHdr() {
    return isTypeSupportedWithFeatures(
        KeySystemNames.playReady,
        `video/mp4;codecs=${CodecProfiles.hevcCodecProfile};features=${FeatureLists.hevcHdrFeatures.join(",")}`
    );
}

/**
 * Parses whether HW DRM for HEVC and QHD is enabled from config data.
 * @param {Object} config - Configuration object with data property
 * @returns {boolean}
 */
function isHwDrmForHevcEnabled(config) {
    const value = (config.data?.enableHWDRMForHEVCAndQHDOnly ?? "true").toString().toLowerCase();
    return value !== "false";
}

/**
 * Parses whether PlayReady is disabled from config data.
 * @param {Object} config - Configuration object with data property
 * @returns {boolean}
 */
function isPlayReadyDisabled(config) {
    const value = (config.data?.disablePlayReady ?? "false").toString().toLowerCase();
    return value === "true";
}

/**
 * Returns the device configuration for Edge-based Cadmium player.
 * @param {Object} platformFlags - Platform detection flags
 * @returns {Object} Device configuration
 */
export function getEdgeDeviceConfig(platformFlags) {
    const prefix = platformFlags.zE ? "NFCDIE-04-"
        : platformFlags.GYa ? "NFCDIE-LX-"
        : platformFlags.internal_Tta ? "NFCDIE-AP-"
        : platformFlags.bda ? "NFCDIE-AT-"
        : platformFlags.YS ? "NFCDIE-PH-"
        : "NFCDIE-03-";

    return {
        ...getBaseDeviceConfig(),
        sy: "D",
        platformPrefix: prefix,
        debugLabel: "edge-cadmium",
    };
}

/**
 * Returns the streaming configuration for Edge with codec profiles.
 * @param {Object} config - Runtime configuration
 * @returns {Object} Streaming configuration with supported profiles
 */
export function getEdgeStreamingConfig(config) {
    const { readSlice, bufferLevel } = AudioVideoProfiles;

    const streamingConfig = {
        ...getBaseStreamingConfig(),
        iL: flattenAndMap([readSlice.ap, readSlice.fG, readSlice.lP, readSlice.mP, readSlice.nP, readSlice.hp]),
        supportedVideoProfiles: flattenAndMap([
            ...bufferLevel.C5, ...bufferLevel.W5,
            ...bufferLevel.KW, ...bufferLevel.LW,
            ...bufferLevel.IW, ...bufferLevel.JW,
            ...bufferLevel.mDa, ...bufferLevel.nDa, ...bufferLevel.oDa,
        ]),
        supportedAudioProfiles: flattenAndMap([
            ...bufferLevel.B5, ...bufferLevel.internal_Bja,
            ...bufferLevel.internal_Aja, ...bufferLevel.internal_Cja,
        ]),
        yB: undefined,
        enableHDRPassthrough: false,
    };

    const enableHWDRM = isHwDrmForHevcEnabled(config);
    const disablePlayReady = isPlayReadyDisabled(config);

    if (!detectHardwareDrmCapabilities(enableHWDRM, disablePlayReady).supportsHwdrmAny) {
        streamingConfig.enableHEVC = true;
        streamingConfig.enableDolbyVision = true;
        streamingConfig.enableHDR = true;
    }

    return streamingConfig;
}

/**
 * Returns the full playback override configuration for Edge.
 * Merges base config with HW DRM or SW DRM-specific options.
 * @param {Object} capabilities - Player capabilities including uB flag
 * @param {Object} config - Runtime configuration
 * @returns {Object} Complete playback configuration overrides
 */
export function getEdgePlaybackOverrides(capabilities, config) {
    const { onHealthChange } = AudioVideoProfiles;
    const hasWidevine = capabilities.uB;
    const enableHWDRM = isHwDrmForHevcEnabled(config);
    const disablePlayReady = isPlayReadyDisabled(config);

    const { supportsHwdrmAny, supportsHwdrmHevc } = detectHardwareDrmCapabilities(enableHWDRM, disablePlayReady);

    const standardVideoProfiles = flattenAndMap([onHealthChange.YJ, onHealthChange.ZJ]);
    const extendedVideoProfiles = flattenAndMap([onHealthChange.YJ, onHealthChange.ZJ, onHealthChange.$J]);

    // Base configuration for all Edge variants
    let mergedConfig = {
        nudgeSourceBuffer: true,
        audioCapabilityDetectorType: CapabilityDetectorType.audio.Microsoft,
        videoCapabilityDetectorType: CapabilityDetectorType.video.Microsoft,
        microsoftHwdrmRequiresHevc: true,
        microsoftScreenSizeFilterEnabled: true,
        addFailedLogBlobsToQueue: false,
        bookmarkIgnoreBeginning: "2000",
        forceAppendEncryptedStreamHeaderFirst: true,
        retainSbrOnFade: true,
        enableXHEAAC: true,
        useEncryptedEvent: false,
        // Prefetch/cache settings
        prepareCadmium: true,
        enableLdlPrefetch: !supportsHwdrmAny || supportsHwdrmHevc,
        licenseRenewalRequestDelay: 5000,
        enableMediaPrefetch: true,
        defaultHeaderCacheSize: 15,
        prepareLdlCacheMaxCount: 15,
    };

    // Widevine-specific overrides
    if (hasWidevine) {
        mergedConfig = {
            ...mergedConfig,
            webkitDecodedFrameCountIncorrectlyReported: true,
            noRenderTimeoutMilliseconds: 10000,
        };
    }

    // HW DRM (PlayReady) configuration
    if (supportsHwdrmAny) {
        return {
            ...mergedConfig,
            microsoftClearLeadRequiresSwdrm: true,
            enableHWDRM: true,
            enableHEVC: true,
            enablePRK: true,
            enableDV: true,
            enableHDR: true,
            microsoftHwdrmRequiresHevc: false,
            enableDDPlus51: true,
            enableDDPlusAtmos: true,
            keySystemList: [KeySystemNames.playReady, KeySystemNames.playReadyHardware],
            validateKeySystemAccess: true,
            enableCDMAttestedDescriptors: true,
            enableCachedErrors: true,
            enableKeySystemRestrictor: true,
        };
    }

    // SW DRM (Widevine/fallback) configuration
    return {
        ...mergedConfig,
        audioCapabilityDetectorType: CapabilityDetectorType.audio.Default,
        videoCapabilityDetectorType: CapabilityDetectorType.video.Chrome,
        microsoftScreenSizeFilterEnabled: false,
        keySystemList: [KeySystemNames.widevine],
        licenseRenewalRequestDelay: 0,
        audioProfiles: flattenAndMap([readSlice.ap, readSlice.fG, readSlice.hp]),
        videoProfiles: hasWidevine ? extendedVideoProfiles : standardVideoProfiles,
        liveVideoProfiles: flattenAndMap([onHealthChange.uP, onHealthChange.vP]),
        droppedFrameRateFilterEnabled: true,
        enableCDMAttestedDescriptors: true,
        enableFullHdForSWDRM: hasWidevine,
    };
}

export default {
    getEdgeDeviceConfig,
    getEdgeStreamingConfig,
    getEdgePlaybackOverrides,
    detectHardwareDrmCapabilities,
    supportsHdrMediaQuery,
    isTypeSupportedWithFeatures,
    supportsDolbyVisionPlayReady,
    supportsHevcMse,
    supportsHevcPlayReady,
    supportsHevcHdr,
};
