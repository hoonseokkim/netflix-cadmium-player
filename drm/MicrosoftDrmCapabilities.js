/**
 * Netflix Cadmium Player - Microsoft DRM Capabilities
 *
 * Implements DRM capability detection for Microsoft PlayReady key system.
 * Checks codec support with features like DD+JOC audio endpoint codecs
 * using the ms-canPresentCodecWithFeatures API.
 *
 * @module MicrosoftDrmCapabilities
 * @original Module_92049
 */

// import { DrmType } from '../drm/DrmType.js'; // webpack 56800
// import { DrmProfile } from '../drm/DrmProfile.js'; // webpack 75568
// import { KeySystem } from '../drm/KeySystem.js'; // webpack 17612
// import { BaseDrmCapabilities } from '../drm/BaseDrmCapabilities.js'; // webpack 31741
// import { MsCapabilityQuery } from '../drm/MsCapabilityQuery.js'; // webpack 40290
// import { CodecCapability } from '../drm/CodecCapability.js'; // webpack 73796

/**
 * Microsoft PlayReady DRM capability checker.
 * Extends BaseDrmCapabilities to provide PlayReady-specific codec probing.
 */
export class MicrosoftDrmCapabilities extends BaseDrmCapabilities {
    /**
     * @param {Function} config - Configuration provider
     * @param {Object} logger - Logger instance
     * @param {Object} platformQuery - Platform-specific query interface
     * @param {Object} lifecycleHooks - Lifecycle hook manager
     */
    constructor(config, logger, platformQuery, lifecycleHooks) {
        super(config, logger, lifecycleHooks);

        /** @type {Object} Platform query interface for MS-specific APIs */
        this.platformQuery = platformQuery;

        /** @type {string} DRM type identifier */
        this.type = DrmType.Microsoft;
    }

    /**
     * Checks if Atmos (DD+JOC) audio is supported
     * @returns {Promise<boolean>}
     */
    checkAtmosSupport() {
        return Promise.resolve(
            this.config().enableAtmos &&
            this._canPresentCodec(KeySystem.PLAYREADY, "avc1", ["audio-endpoint-codec=DD+JOC"])
        );
    }

    /**
     * Checks if spatial audio is supported
     * @returns {Promise<boolean>}
     */
    checkSpatialAudioSupport() {
        return Promise.resolve(
            this.config().enableSpatialAudio &&
            this._canPresentCodec(KeySystem.PLAYREADY, "avc1", ["audio-endpoint-codec=DD+JOC"])
        );
    }

    /**
     * Returns the set of available DRM profile capabilities
     * @returns {Object} Map of profile IDs to capability descriptors
     */
    getAvailableProfiles() {
        const atmosConfig = {
            codecString: "avc1",
            keySystem: KeySystem.PLAYREADY,
            features: ["audio-endpoint-codec=DD+JOC"]
        };

        return {
            [DrmProfile.STANDARD]: CodecCapability.STANDARD,
            [DrmProfile.HIGH_DEF]: CodecCapability.STANDARD,
            [DrmProfile.ULTRA_HD]: undefined,
            [DrmProfile.HDR]: CodecCapability.HDR,
            [DrmProfile.ATMOS]: this.config().enableAtmos ? atmosConfig : undefined,
            [DrmProfile.ATMOS_HD]: this.config().enableAtmos ? atmosConfig : undefined,
            [DrmProfile.SPATIAL_AUDIO]: this.config().enableSpatialAudio ? atmosConfig : undefined
        };
    }

    /**
     * Checks whether a specific DRM profile is supported
     * @param {string} profileId - The profile ID to check
     * @returns {Promise<{supported: boolean, reason?: string}>}
     */
    checkProfileSupport(profileId) {
        const profileConfig = this._profileMap[profileId];

        if (!profileConfig) {
            return Promise.resolve({ supported: false, reason: "ms-no-properties" });
        }

        let keySystem = KeySystem.PLAYREADY;
        let codecString;
        let features = [];

        if (this.platformQuery.isSimpleProfile(profileConfig)) {
            codecString = profileConfig;
        } else {
            features = profileConfig.features;
            codecString = profileConfig.codecString;
            keySystem = profileConfig.keySystem;
        }

        const supported = this._canPresentCodec(keySystem, codecString, features);
        return Promise.resolve(
            supported
                ? { supported: true }
                : { supported: false, reason: "ms-can-present-codec-with-features" }
        );
    }

    /**
     * Queries the platform for codec+features support
     * @param {string} keySystem - Key system identifier
     * @param {string} codecString - Codec string
     * @param {Array<string>} features - Feature strings
     * @returns {boolean} Whether the codec is supported
     * @private
     */
    _canPresentCodec(keySystem, codecString, features) {
        const query = MsCapabilityQuery.build(keySystem, codecString, features);
        return this._queryPlatform(query);
    }
}
