/**
 * @file DefaultDrmProvider.js
 * @description Default DRM provider for browser environments, implementing capability
 *   detection for HDR/DV, HDCP level queries, codec profile mapping, and media key
 *   system support checks via the MediaCapabilities API.
 * @module drm/DefaultDrmProvider
 * @original Module_46286 (oP)
 */

import { MediaType, DrmProviderType, HdcpLevel } from '../types/MediaTypes.js'; // Module 56800
import { VideoProfile } from '../types/VideoProfile.js'; // Module 75568
import { BaseDrmProvider } from '../drm/BaseDrmProvider.js'; // Module 65264 (jP)
import { VideoCodecMap } from '../media/VideoCodecMap.js'; // Module 48617 (jEa)
import { uniqueBy } from '../utils/CollectionUtils.js'; // Module 45266
import { MediaCapabilitiesResult } from '../drm/MediaCapabilitiesResult.js'; // Module 7802

/**
 * Default DRM provider for standard browser environments.
 * Provides capability detection for video features using the MediaCapabilities API,
 * HDCP level reporting, and codec profile filtering.
 *
 * @extends BaseDrmProvider
 */
export class DefaultDrmProvider extends BaseDrmProvider {
    /**
     * @param {Function} config - Configuration accessor function
     * @param {Object} platformMediaSource - Platform media source abstraction
     * @param {Object} hdcpChecker - HDCP level checker
     * @param {Object} fragmentHealthRef - Fragment health and display capability reference
     */
    constructor(config, platformMediaSource, hdcpChecker, fragmentHealthRef) {
        super(config, platformMediaSource, MediaType.internal_Video, fragmentHealthRef);

        /** @type {Function} Configuration accessor */
        this.config = config;

        /** @type {Object} Platform media source */
        this.platformMediaSource = platformMediaSource;

        /** @type {Object} HDCP level checker */
        this.hdcpChecker = hdcpChecker;

        /** @type {Object} Fragment health / display capability reference */
        this.fragmentHealthRef = fragmentHealthRef;

        /** @type {string} Provider type identifier */
        this.type = DrmProviderType.Default;
    }

    /**
     * Checks whether a forced video profile switch is available.
     * Default provider does not support forced switches.
     *
     * @returns {Promise<boolean>} Always resolves to false
     */
    async FV() {
        return false;
    }

    /**
     * Gets the key system version string.
     * Default provider has no specific key system version.
     *
     * @returns {Promise<string>} Always resolves to empty string
     */
    async getKeySystemVersion() {
        return '';
    }

    /**
     * Checks whether HDR10 is supported on the current display.
     *
     * @returns {Promise<{result: boolean, reason: string}>} Support status with reason
     */
    async checkHdr10Support() {
        if (!this.config().gTa) {
            return { result: false, reason: 'disabled' };
        }
        if (!this.fragmentHealthRef.getHealthStatus()) {
            return { result: false, reason: 'non-hdr-display' };
        }
        const capabilities = await this.fragmentHealthRef.gba(VideoProfile.cX);
        return { result: capabilities.supported, reason: 'media-capabilities' };
    }

    /**
     * Checks whether Dolby Vision is supported on the current display.
     *
     * @returns {Promise<{result: boolean, reason: string}>} Support status with reason
     */
    async checkDolbyVisionSupport() {
        if (!this.config().gTa) {
            return { result: false, reason: 'disabled' };
        }
        if (!this.fragmentHealthRef.getHealthStatus()) {
            return { result: false, reason: 'non-hdr-display' };
        }
        const capabilities = await this.fragmentHealthRef.gba(VideoProfile.SW);
        return { result: capabilities.supported, reason: 'media-capabilities' };
    }

    /**
     * Checks if a specific HDR feature is supported.
     * Default provider does not support this check.
     *
     * @returns {Promise<boolean>} Always resolves to false
     */
    async checkHdrFeatureSupport() {
        return false;
    }

    /**
     * No-op handler for output restrictions.
     */
    wOa() {}

    /**
     * Maps an HDCP level enum to its string representation.
     *
     * @param {number} level - HDCP level enum value
     * @returns {string|undefined} HDCP version string (e.g., "1.4", "2.2")
     */
    getHdcpVersionString(level) {
        switch (level) {
            case HdcpLevel.Level_1_4:
                return '1.4';
            case HdcpLevel.Level_2_2:
                return '2.2';
        }
    }

    /**
     * Gets the codec-to-profile mapping for available video codecs.
     *
     * @returns {Object} Map of video profile names to codec strings
     */
    loadAvailable() {
        return VideoCodecMap.loadAvailable();
    }

    /**
     * Gets the deduplicated list of supported profiles by filtering out duplicates
     * from configured profiles and supported audio/video profiles.
     *
     * @returns {Array<Object>} Deduplicated profile list
     */
    getDataBuffer() {
        const dedup = (a, b) => uniqueBy((x, y) => x.name === y.name, a, b);
        const videoFiltered = dedup(this.config().jrb, this.config().supportedVideoProfiles);
        return dedup(videoFiltered, this.config().supportedAudioProfiles);
    }

    /**
     * Gets additional DRM-specific data.
     * Default provider returns no extra data.
     *
     * @returns {Promise<undefined>}
     */
    async hca() {
        return undefined;
    }

    /**
     * Gets digital video output descriptors including HDCP status.
     *
     * @param {number} hdcpLevel - HDCP level to check
     * @returns {Array<Object>} Array of output descriptor objects
     */
    getVideoOutputDescriptors(hdcpLevel) {
        const supportedVersions = [];
        if (this.hdcpChecker.runChecks(hdcpLevel)) {
            supportedVersions.push(this.getHdcpVersionString(hdcpLevel));
        }

        return [{
            type: 'DigitalVideoOutputDescriptor',
            outputType: 'unknown',
            supportedHdcpVersions: supportedVersions,
            isHdcpEngaged: supportedVersions.length > 0
        }];
    }

    /**
     * Checks audio codec support. When all video profiles are overridden,
     * reports all as supported without querying the platform.
     *
     * @param {Array<Object>} profiles - Audio profiles to check
     * @returns {Promise<MediaCapabilitiesResult>} Support results for each profile
     */
    async hasAudioSupport(profiles) {
        if (this.config().overrideEnableAllVideoProfiles) {
            return new MediaCapabilitiesResult(
                profiles,
                profiles.map(() => ({ supported: true }))
            );
        }
        return super.hasAudioSupport(profiles);
    }
}

export default DefaultDrmProvider;
