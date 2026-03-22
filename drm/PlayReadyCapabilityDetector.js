/**
 * @module PlayReadyCapabilityDetector
 * @description Microsoft PlayReady DRM capability detection for the Netflix Cadmium player.
 *
 * Extends the base VideoCapabilityDetector to probe Microsoft-specific APIs
 * (MSMediaKeys.isTypeSupportedWithFeatures) for codec, resolution, HDR,
 * Dolby Vision, AV1, HDCP, and audio-endpoint support on Edge/IE platforms.
 *
 * Exports:
 *   - PlayReadyCapabilityDetector (class)
 *   - MS_FEATURE_QUERIES (capability feature-string lookup table)
 *
 * Original: Webpack Module 75456
 */

// ---------------------------------------------------------------------------
// Imports (original webpack IDs noted for traceability)
// ---------------------------------------------------------------------------
import { onHealthChange as VideoProfiles } from './VideoProfileIds.js';         // 75568
import { VideoCapabilityDetector } from './VideoCapabilityDetector.js';          // 46286
import { DrmPlatformType, MediaSecurityLevel, buildSupportResult } from '../media/MediaConstants.js'; // 56800
import { KeySystemIds } from '../drm/KeySystemIds.js';                          // 17612
import { toMilliseconds, MILLISECONDS } from '../timing/TimingUtils.js';        // 5021
import { CodecStrings } from '../media/CodecStrings.js';                        // 73796
import { MsMediaKeysHelper } from './MsMediaKeysHelper.js';                     // 40290
import { CodecRegex } from '../media/CodecRegex.js';                            // 22210

// ---------------------------------------------------------------------------
// Feature-query string sets used by MSMediaKeys.isTypeSupportedWithFeatures
// ---------------------------------------------------------------------------

/**
 * Pre-built arrays of feature-query key=value pairs passed to the
 * Microsoft isTypeSupportedWithFeatures API to probe hardware capabilities.
 *
 * @type {Record<string, string[]>}
 */
export const MS_FEATURE_QUERIES = {
    /** 1080p SDR, 8-bit, 5.8 Mbps */
    sdr1080p: [
        'decode-res-x=1920', 'decode-res-y=1080', 'decode-bpc=8',
        'decode-bitrate=5800', 'decode-fps=30',
        'display-res-x=1920', 'display-res-y=1080', 'display-bpc=8',
    ],

    /** QHD (1440p) SDR, 10-bit, 16 Mbps */
    sdrQhd: [
        'decode-res-x=3840', 'decode-res-y=2160', 'decode-bpc=10',
        'decode-bitrate=16000', 'decode-fps=30',
        'display-res-x=2560', 'display-res-y=1440', 'display-bpc=8',
    ],

    /** 4K (2160p) SDR, 10-bit, 16 Mbps */
    sdr4k: [
        'decode-res-x=3840', 'decode-res-y=2160', 'decode-bpc=10',
        'decode-bitrate=16000', 'decode-fps=30',
        'display-res-x=3840', 'display-res-y=2160', 'display-bpc=8',
    ],

    /** 1080p HDR10, 10-bit, 5.8 Mbps */
    hdr1080p: [
        'decode-res-x=1920', 'decode-res-y=1080', 'decode-bpc=10',
        'decode-bitrate=5800', 'decode-fps=30',
        'display-res-x=1920', 'display-res-y=1080', 'display-bpc=8', 'hdr=1',
    ],

    /** QHD HDR10, 10-bit, 16 Mbps */
    hdrQhd: [
        'decode-res-x=3840', 'decode-res-y=2160', 'decode-bpc=10',
        'decode-bitrate=16000', 'decode-fps=30',
        'display-res-x=2560', 'display-res-y=1440', 'display-bpc=8', 'hdr=1',
    ],

    /** 1080p Dolby Vision (dvhe.05), 10-bit, 5.8 Mbps */
    dv1080p: [
        'decode-res-x=1920', 'decode-res-y=1080', 'decode-bpc=10',
        'decode-bitrate=5800', 'decode-fps=30',
        'display-res-x=1920', 'display-res-y=1080', 'display-bpc=8',
        'hdr=1', 'ext-profile=dvhe.05',
    ],

    /** QHD Dolby Vision (dvhe.05), 10-bit, 16 Mbps */
    dvQhd: [
        'decode-res-x=3840', 'decode-res-y=2160', 'decode-bpc=10',
        'decode-bitrate=16000', 'decode-fps=30',
        'display-res-x=2560', 'display-res-y=1440', 'display-bpc=8',
        'hdr=1', 'ext-profile=dvhe.05',
    ],

    /** HDCP version 1 */
    hdcpVersion1: ['hdcp=1'],

    /** HDCP version 2 */
    hdcpVersion2: ['hdcp=2'],

    /** CENC clear-lead encryption probe (1080p, 10 Mbps, 8-bit) */
    cencClearLead: [
        'decode-bpp=8', 'decode-res-x=1920', 'decode-res-y=1080',
        'decode-bitrate=10000000', 'decode-fps=30',
        'encryption-type=cenc-clearlead', 'encryption-iv-size=8',
    ],
};

// ---------------------------------------------------------------------------
// PlayReadyCapabilityDetector
// ---------------------------------------------------------------------------

/**
 * Probes Microsoft PlayReady / Edge-specific codec and DRM capabilities via
 * the `MSMediaKeys.isTypeSupportedWithFeatures` API.
 *
 * @extends VideoCapabilityDetector
 */
export class PlayReadyCapabilityDetector extends VideoCapabilityDetector {
    /**
     * @param {object}  config          - Player configuration accessor
     * @param {object}  platformMedia   - Platform media-source abstraction
     * @param {object}  capabilityApi   - Capability / feature-detection helper
     * @param {object}  scheduler       - Scheduling service (intervals & delays)
     * @param {object}  playerCore      - Core player instance (provides systemClock)
     * @param {object}  di              - Dependency-injection container
     * @param {object}  keySystemAccess - Key-system access provider
     */
    constructor(config, platformMedia, capabilityApi, scheduler, playerCore, di, keySystemAccess) {
        super(config, platformMedia, capabilityApi, di);

        /** @type {object} */
        this.scheduler = scheduler;

        /** @type {object} */
        this.playerCore = playerCore;

        /** @type {object} */
        this.di = di;

        /** @type {object} */
        this.keySystemAccess = keySystemAccess;

        /** @type {string} Platform DRM type identifier */
        this.type = DrmPlatformType.Microsoft;

        /** @type {string} HEVC codec string used for video capability probes */
        this.hevcCodecString = 'hvc1';

        /** @type {string} AVC codec string used for audio-endpoint probes */
        this.avcCodecString = 'avc1';

        /** @private @type {Object<string, *>} Cached telemetry properties */
        this._telemetryCache = {};

        this._initializeWidevineChecks();
    }

    // -----------------------------------------------------------------------
    // Key-system helpers
    // -----------------------------------------------------------------------

    /**
     * Returns the active key-system string (e.g. "com.microsoft.playready").
     * @returns {Promise<string>}
     */
    getKeySystemVersion() {
        return this.keySystemAccess.ZH().then(result => result.keySystem);
    }

    // -----------------------------------------------------------------------
    // Capability checks  (isTypeSupportedWithFeatures wrappers)
    // -----------------------------------------------------------------------

    /**
     * Low-level: build a feature query and call MSMediaKeys.isTypeSupported.
     *
     * @param {string}   keySystem  - Key-system identifier
     * @param {string}   codecStr   - Codec string (e.g. "hvc1", "avc1")
     * @param {string[]} features   - Feature-query key=value pairs
     * @returns {boolean} Whether the combination is supported
     */
    _isTypeSupportedWithFeatures(keySystem, codecStr, features) {
        const query = MsMediaKeysHelper.buildFeatureQuery(keySystem, codecStr, features);
        return this._evaluateTypeSupport(query);
    }

    /**
     * Checks whether QHD (2560x1440) HEVC playback is supported.
     * @returns {boolean}
     */
    isQhdSupported() {
        return this._isTypeSupportedWithFeatures(
            KeySystemIds.playready,
            this.hevcCodecString,
            MS_FEATURE_QUERIES.sdrQhd,
        );
    }

    /**
     * Checks whether HDR10 (1080p) HEVC playback is supported.
     * @returns {boolean}
     */
    isHdrSupported() {
        return this._isTypeSupportedWithFeatures(
            KeySystemIds.playready,
            this.hevcCodecString,
            MS_FEATURE_QUERIES.hdr1080p,
        );
    }

    /**
     * Checks whether Dolby Vision (1080p) HEVC playback is supported.
     * @returns {boolean}
     */
    isDolbyVisionSupported() {
        return this._isTypeSupportedWithFeatures(
            KeySystemIds.playready,
            this.hevcCodecString,
            MS_FEATURE_QUERIES.dv1080p,
        );
    }

    /**
     * Checks whether AV1 Main-profile playback (1080p SDR) is supported.
     * @returns {boolean}
     */
    isAv1Supported() {
        return this._isTypeSupportedWithFeatures(
            KeySystemIds.playready,
            CodecStrings.av1MainCodecRegex,
            MS_FEATURE_QUERIES.sdr1080p,
        );
    }

    /**
     * Checks whether 4K HEVC playback is supported.
     * @returns {boolean}
     */
    isHevcSupported() {
        return this._isTypeSupportedWithFeatures(
            KeySystemIds.playready,
            this.hevcCodecString,
            MS_FEATURE_QUERIES.sdr4k,
        );
    }

    /**
     * Checks whether HEVC with CENC clear-lead encryption is supported.
     * @returns {boolean}
     */
    isHevcClearLeadSupported() {
        return this._isTypeSupportedWithFeatures(
            KeySystemIds.playready,
            this.hevcCodecString,
            MS_FEATURE_QUERIES.cencClearLead,
        );
    }

    /**
     * Checks whether AVC with CENC clear-lead encryption is supported.
     * @returns {boolean}
     */
    isAvcClearLeadSupported() {
        return this._isTypeSupportedWithFeatures(
            KeySystemIds.playready,
            this.avcCodecString,
            MS_FEATURE_QUERIES.cencClearLead,
        );
    }

    /**
     * Checks whether a specific audio endpoint codec is supported.
     * @param {string} audioCodecName - e.g. "DD", "DD+JOC", "PCM5.1"
     * @returns {boolean}
     */
    isAudioEndpointSupported(audioCodecName) {
        return this._isTypeSupportedWithFeatures(
            KeySystemIds.recommendation,
            this.avcCodecString,
            [`audio-endpoint-codec=${audioCodecName}`],
        );
    }

    /**
     * Whether the platform advertises PlayReady hardware DRM support.
     * @type {boolean}
     */
    get isPlayReadyHardwareDrmAvailable() {
        try {
            return this._evaluateTypeSupport(
                KeySystemIds.playready + '|' + CodecStrings.$_a,
            );
        } catch (_err) {
            return false;
        }
    }

    // -----------------------------------------------------------------------
    // Security-level resolution promise helpers
    // -----------------------------------------------------------------------

    /**
     * Resolves the promise for the requested security level.
     *
     * @param {string} securityLevel - MediaSecurityLevel enum value
     * @returns {Promise<boolean>}
     */
    _getSecurityLevelSupport(securityLevel) {
        switch (securityLevel) {
            case MediaSecurityLevel.Level_1_4:
                return this._resolveAnyWidevineSupport();
            case MediaSecurityLevel.Level_2_2:
                return this._widevine1080pPromise;
            default:
                return Promise.resolve(false);
        }
    }

    /**
     * Resolves to true if either 1080p or 720p hardware DRM is supported.
     * @private
     * @returns {Promise<boolean>}
     */
    _resolveAnyWidevineSupport() {
        return this._widevine1080pPromise.then(supported =>
            supported ? Promise.resolve(supported) : this._widevine720pPromise,
        );
    }

    // -----------------------------------------------------------------------
    // HDR / Dolby Vision detection (override points)
    // -----------------------------------------------------------------------

    /**
     * Returns HDR detection result with reason string.
     * @returns {Promise<{result: boolean, reason: string}>}
     */
    getHdrDetectionResult() {
        return Promise.resolve({
            result: this.isHdrSupported(),
            reason: 'is-type-supported',
        });
    }

    /**
     * Checks whether 1080p HEVC with HDR is available via software DRM.
     * @returns {Promise<boolean>}
     */
    getHdr1080pSoftwareSupport() {
        return this.isWidevineSoftwareSupported && this.isHevcSupported()
            ? this._widevine1080pPromise
            : Promise.resolve(false);
    }

    /**
     * Returns Dolby Vision detection result with reason string.
     * @returns {Promise<{result: boolean, reason: string}>}
     */
    getDolbyVisionDetectionResult() {
        return Promise.resolve(this.isDolbyVisionSupported()).then(result => ({
            result,
            reason: 'isTypeSupportedWithFeatures',
        }));
    }

    // -----------------------------------------------------------------------
    // Telemetry
    // -----------------------------------------------------------------------

    /**
     * Populates the telemetry/ITS (Is-Type-Supported) data on the given bag.
     *
     * @param {object} telemetryBag - Mutable object to write capability flags onto
     */
    populateTelemetry(telemetryBag) {
        this._telemetryBag = telemetryBag;
        Object.assign(this._telemetryBag, this._telemetryCache);

        telemetryBag.itshwdrm = this.isWidevineSoftwareSupported;
        telemetryBag.itsqhd   = this.isQhdSupported();
        telemetryBag.itshevc  = this.isHevcSupported();
        telemetryBag.itshdr   = this.isHdrSupported();
        telemetryBag.itsdv    = this.isDolbyVisionSupported();
        telemetryBag.itsav1   = this.isAv1Supported();
        telemetryBag.itshevccl = this.isHevcClearLeadSupported();
        telemetryBag.itsavccl  = this.isAvcClearLeadSupported();
        telemetryBag.itsdd     = this.isAudioEndpointSupported('DD');
        telemetryBag.itsddjoc  = this.isAudioEndpointSupported('DD+JOC');
        telemetryBag.itspcm51  = this.isAudioEndpointSupported('PCM5.1');

        this._updateHdcpTelemetry();
    }

    /**
     * Serialises HDCP probe results to the telemetry bag.
     * @private
     */
    _updateHdcpTelemetry() {
        if (this._telemetryBag) {
            this._telemetryBag.itshdcp = JSON.stringify({
                hdcp1: this._hdcpVersion1Result,
                time1: this._hdcpVersion1Timestamp - this._hdcpVersion1BaseTime,
                hdcp2: this._hdcpVersion2Result,
                time2: this._hdcpVersion2Timestamp - this._hdcpVersion2BaseTime,
            });
        }
    }

    // -----------------------------------------------------------------------
    // HDCP probing
    // -----------------------------------------------------------------------

    /**
     * Probes HDCP version 1 support via isTypeSupportedWithFeatures.
     * @private
     * @returns {string} Result string from MSMediaKeys ("probably", "maybe", etc.)
     */
    _probeHdcpVersion1() {
        const parts = MsMediaKeysHelper.buildFeatureQuery(
            KeySystemIds.recommendation,
            this.avcCodecString,
            MS_FEATURE_QUERIES.hdcpVersion1,
        ).split('|');

        this._hdcpVersion1Result = MsMediaKeysHelper.isTypeSupportedWithFeatures(parts[0], parts[1]);
        this._hdcpVersion1Timestamp = this.playerCore.systemClock.toUnit(MILLISECONDS);
        this._hdcpVersion1BaseTime = this._hdcpVersion1BaseTime || this._hdcpVersion1Timestamp;
        this._updateHdcpTelemetry();

        return this._hdcpVersion1Result;
    }

    /**
     * Probes HDCP version 2 support via isTypeSupportedWithFeatures.
     * @private
     * @returns {string} Result string from MSMediaKeys ("probably", "maybe", etc.)
     */
    _probeHdcpVersion2() {
        const parts = MsMediaKeysHelper.buildFeatureQuery(
            KeySystemIds.recommendation,
            this.hevcCodecString,
            MS_FEATURE_QUERIES.hdcpVersion2,
        ).split('|');

        this._hdcpVersion2Result = MsMediaKeysHelper.isTypeSupportedWithFeatures(parts[0], parts[1]);
        this._hdcpVersion2Timestamp = this.playerCore.systemClock.toUnit(MILLISECONDS);
        this._hdcpVersion2BaseTime = this._hdcpVersion2BaseTime || this._hdcpVersion2Timestamp;
        this._updateHdcpTelemetry();

        return this._hdcpVersion2Result;
    }

    // -----------------------------------------------------------------------
    // HDCP-aware output descriptor
    // -----------------------------------------------------------------------

    /**
     * Determines the best HDCP level and returns a digital video output
     * descriptor suitable for license requests.
     *
     * @returns {Promise<Array<{type: string, outputType: string, supportedHdcpVersions: string[], isHdcpEngaged: boolean}>>}
     */
    getVideoOutputDescriptor() {
        return this._getSecurityLevelSupport(MediaSecurityLevel.Level_2_2).then(has2_2 => {
            if (has2_2) {
                return this._buildOutputDescriptor(MediaSecurityLevel.Level_2_2);
            }
            return this._getSecurityLevelSupport(MediaSecurityLevel.Level_1_4).then(has1_4 =>
                has1_4
                    ? this._buildOutputDescriptor(MediaSecurityLevel.Level_1_4)
                    : this._buildOutputDescriptor(undefined),
            );
        });
    }

    // -----------------------------------------------------------------------
    // Per-profile codec validation
    // -----------------------------------------------------------------------

    /**
     * Checks whether a specific video profile (identified by codec key) is
     * supported via isTypeSupportedWithFeatures.
     *
     * @param {string} profileKey - Codec profile identifier
     * @returns {Promise<{supported: boolean, reason?: string}>}
     */
    checkProfileSupport(profileKey) {
        return this.getKeySystemVersion().then(keySystem => {
            const entry = this._codecProfileMap[profileKey];
            if (!entry) {
                return { supported: false, reason: 'ms-no-properties' };
            }

            let features = [];
            let codecStr;
            if (this.is.filterPredicate(entry)) {
                codecStr = entry;
            } else {
                features = entry.features;
                codecStr = entry.codecString;
                keySystem = entry.keySystem;
            }

            return this._isTypeSupportedWithFeatures(keySystem, codecStr, features)
                ? { supported: true }
                : { supported: false, reason: 'ms-can-present-codec-with-features' };
        });
    }

    /**
     * Validates whether a given codec string is allowed under the current
     * key-system constraints. Some codecs are restricted on PlayReady.
     *
     * @param {string} codecString - Full codec identifier (e.g. "hev1.2.6.L93.B0")
     * @returns {Promise<{supported: boolean, reason?: string}>}
     */
    validateMediaCapabilities(codecString) {
        return this.getKeySystemVersion().then(keySystem => {
            if (keySystem === KeySystemIds.playready) {
                // HEVC clear-lead restricted check
                if (CodecRegex.wFa.test(codecString)) {
                    return buildSupportResult(this.isHevcClearLeadSupported(), 'ms-restricted');
                }
                // AV1 / related codec restrictions
                if (
                    [CodecRegex.av1MainCodecRegex, CodecRegex.fja].some(rx => rx.test(codecString)) &&
                    !CodecRegex.pGa.test(codecString)
                ) {
                    return { supported: false, reason: 'ms-restricted' };
                }
            }
            return { supported: true };
        });
    }

    // -----------------------------------------------------------------------
    // Codec profile map (loadAvailable override)
    // -----------------------------------------------------------------------

    /**
     * Builds the full map of video-profile identifiers to their codec strings,
     * key-system ids, and feature-query arrays. This drives per-profile
     * capability probing during manifest evaluation.
     *
     * @returns {Object<string, {Dd: string, keySystem: string, features: string[]}>}
     */
    loadAvailable() {
        const map = super.loadAvailable();

        const sdr1080p  = MS_FEATURE_QUERIES.sdr1080p;
        const sdrQhd    = MS_FEATURE_QUERIES.sdrQhd;
        const sdr4k     = MS_FEATURE_QUERIES.sdr4k;
        const hdr1080p  = MS_FEATURE_QUERIES.hdr1080p;
        const hdrQhd    = MS_FEATURE_QUERIES.hdrQhd;
        const dv1080p   = MS_FEATURE_QUERIES.dv1080p;
        const dvQhd     = MS_FEATURE_QUERIES.dvQhd;

        // -- HEVC QHD SDR profiles (L90 through L153, three variants each) --
        const hevcQhdSdrEntries = [
            { profiles: [VideoProfiles.M6, VideoProfiles.L6, VideoProfiles.K6], codec: 'hev1.2.6.L90.timerHandle' },
            { profiles: [VideoProfiles.P6, VideoProfiles.O6, VideoProfiles.N6], codec: 'hev1.2.6.L93.timerHandle' },
            { profiles: [VideoProfiles.S6, VideoProfiles.R6, VideoProfiles.Q6], codec: 'hev1.2.6.L120.timerHandle' },
            { profiles: [VideoProfiles.V6, VideoProfiles.U6, VideoProfiles.T6], codec: 'hev1.2.6.L123.timerHandle' },
            { profiles: [VideoProfiles.X6, VideoProfiles.dX, VideoProfiles.W6], codec: 'hev1.2.6.L150.timerHandle' },
            { profiles: [VideoProfiles.Z6, VideoProfiles.eX, VideoProfiles.Y6], codec: 'hev1.2.6.L153.timerHandle' },
        ];
        for (const { profiles, codec } of hevcQhdSdrEntries) {
            const entry = { Dd: codec, keySystem: KeySystemIds.playready, features: sdrQhd };
            for (const p of profiles) map[p] = entry;
        }

        // -- HEVC HDR 1080p profiles --
        const hevcHdr1080pEntries = [
            { profiles: [VideoProfiles.v6, VideoProfiles.u6, VideoProfiles.t6], codec: 'hev1.2.6.L90.timerHandle' },
            { profiles: [VideoProfiles.y6, VideoProfiles.x6, VideoProfiles.w6], codec: 'hev1.2.6.L93.timerHandle' },
            { profiles: [VideoProfiles.A6, VideoProfiles.cX, VideoProfiles.z6], codec: 'hev1.2.6.L120.timerHandle' },
        ];
        for (const { profiles, codec } of hevcHdr1080pEntries) {
            const entry = { Dd: codec, keySystem: KeySystemIds.playready, features: hdr1080p };
            for (const p of profiles) map[p] = entry;
        }

        // -- HEVC HDR QHD profiles --
        const hevcHdrQhdEntries = [
            { profiles: [VideoProfiles.D6, VideoProfiles.C6, VideoProfiles.B6], codec: 'hev1.2.6.L123.timerHandle' },
            { profiles: [VideoProfiles.G6, VideoProfiles.F6, VideoProfiles.E6], codec: 'hev1.2.6.L150.timerHandle' },
            { profiles: [VideoProfiles.J6, VideoProfiles.I6, VideoProfiles.H6], codec: 'hev1.2.6.L153.timerHandle' },
        ];
        for (const { profiles, codec } of hevcHdrQhdEntries) {
            const entry = { Dd: codec, keySystem: KeySystemIds.playready, features: hdrQhd };
            for (const p of profiles) map[p] = entry;
        }

        // -- Dolby Vision 1080p profiles --
        const dv1080pEntries = [
            { profiles: [VideoProfiles.Z5, VideoProfiles.Y5], codec: 'hev1.2.6.L90.timerHandle' },
            { profiles: [VideoProfiles.b6, VideoProfiles.a6], codec: 'hev1.2.6.L93.timerHandle' },
            { profiles: [VideoProfiles.c6, VideoProfiles.internal_Pja, VideoProfiles.SW], codec: 'hev1.2.6.L120.timerHandle' },
        ];
        for (const { profiles, codec } of dv1080pEntries) {
            const entry = { Dd: codec, keySystem: KeySystemIds.playready, features: dv1080p };
            for (const p of profiles) map[p] = entry;
        }

        // -- Dolby Vision QHD profiles --
        const dvQhdEntries = [
            { profiles: [VideoProfiles.e6, VideoProfiles.internal_Qja, VideoProfiles.d6], codec: 'hev1.2.6.L123.timerHandle' },
            { profiles: [VideoProfiles.g6, VideoProfiles.internal_Rja, VideoProfiles.f6], codec: 'hev1.2.6.L150.timerHandle' },
            { profiles: [VideoProfiles.i6, VideoProfiles.internal_Sja, VideoProfiles.h6], codec: 'hev1.2.6.L153.timerHandle' },
        ];
        for (const { profiles, codec } of dvQhdEntries) {
            const entry = { Dd: codec, keySystem: KeySystemIds.playready, features: dvQhd };
            for (const p of profiles) map[p] = entry;
        }

        // -- AV1 Main profile, DASH Protected (1080p SDR) --
        const av1ProtectedSdr1080p = [
            { profile: VideoProfiles.zx,                        codec: 'av01.0.04M.10' },
            { profile: VideoProfiles.av1MainL31DashProtected,   codec: 'av01.0.05M.10' },
            { profile: VideoProfiles.av1MainL40DashProtected,   codec: 'av01.0.08M.10' },
            { profile: VideoProfiles.av1MainL41DashProtected,   codec: 'av01.0.09M.10' },
        ];
        for (const { profile, codec } of av1ProtectedSdr1080p) {
            map[profile] = { Dd: codec, keySystem: KeySystemIds.playready, features: sdr1080p };
        }

        // -- AV1 Main profile, DASH Protected (4K) --
        map[VideoProfiles.G5] = { Dd: 'av01.0.12M.10', keySystem: KeySystemIds.playready, features: sdr4k };
        map[VideoProfiles.I5] = { Dd: 'av01.0.13M.10', keySystem: KeySystemIds.playready, features: sdr4k };

        // -- AV1 Main profile with extended color info, DASH Protected (1080p) --
        const av1ExtProtectedSdr1080p = [
            { profile: VideoProfiles.YO, codec: 'av01.0.04M.10.0.112.09.16.09.0' },
            { profile: VideoProfiles.ZO, codec: 'av01.0.05M.10.0.112.09.16.09.0' },
            { profile: VideoProfiles.$O, codec: 'av01.0.08M.10.0.112.09.16.09.0' },
            { profile: VideoProfiles.aP, codec: 'av01.0.09M.10.0.112.09.16.09.0' },
        ];
        for (const { profile, codec } of av1ExtProtectedSdr1080p) {
            map[profile] = { Dd: codec, keySystem: KeySystemIds.playready, features: sdr1080p };
        }

        // -- AV1 Main profile with extended color info, DASH Protected (4K) --
        map[VideoProfiles.D5] = { Dd: 'av01.0.12M.10.0.112.09.16.09.0', keySystem: KeySystemIds.playready, features: sdr4k };
        map[VideoProfiles.E5] = { Dd: 'av01.0.13M.10.0.112.09.16.09.0', keySystem: KeySystemIds.playready, features: sdr4k };

        // -- AV1 Main profile, DASH Live (1080p SDR) --
        const av1LiveSdr1080p = [
            { profile: VideoProfiles.yx,                  codec: 'av01.0.04M.10' },
            { profile: VideoProfiles.av1MainL31DashLive,  codec: 'av01.0.05M.10' },
            { profile: VideoProfiles.av1MainL40DashLive,  codec: 'av01.0.08M.10' },
            { profile: VideoProfiles.av1MainL41DashLive,  codec: 'av01.0.09M.10' },
        ];
        for (const { profile, codec } of av1LiveSdr1080p) {
            map[profile] = { Dd: codec, keySystem: KeySystemIds.playready, features: sdr1080p };
        }

        // -- AV1 Main profile, DASH Live (4K) --
        map[VideoProfiles.F5] = { Dd: 'av01.0.12M.10', keySystem: KeySystemIds.playready, features: sdr4k };
        map[VideoProfiles.H5] = { Dd: 'av01.0.13M.10', keySystem: KeySystemIds.playready, features: sdr4k };

        return map;
    }

    // -----------------------------------------------------------------------
    // Widevine / HDCP polling initialisation
    // -----------------------------------------------------------------------

    /**
     * Starts asynchronous polling for HDCP and hardware-DRM readiness.
     * On platforms with software DRM, polls at intervals until a definitive
     * answer is obtained or a timeout fires.
     *
     * @private
     */
    _initializeWidevineChecks() {
        if (this.isWidevineSoftwareSupported) {
            // 1080p probe
            this._widevine1080pPromise = this._pollCodecSupport(
                this.config().pollIntervalMs,
                this.config().pollTimeoutMs1080p,
                () => {
                    const result = this._probeHdcpVersion2();
                    return [result !== 'maybe', result];
                },
            ).then(result => result === 'probably');

            // 720p probe (only if 1080p was not supported)
            this._widevine720pPromise = this._widevine1080pPromise.then(is1080p => {
                if (is1080p) return true;
                return this._pollCodecSupport(
                    this.config().pollIntervalMs,
                    this.config().pollTimeoutMs720p,
                    () => {
                        const result = this._probeHdcpVersion1();
                        return [result !== 'maybe', result];
                    },
                ).then(result => result === 'probably');
            });
        } else {
            this._widevine720pPromise = Promise.resolve(true);
            this._widevine1080pPromise = Promise.resolve(false);
        }
    }

    /**
     * Polls a check function at a fixed interval until either the check
     * returns a definitive result or a timeout fires.
     *
     * @private
     * @param {number}   intervalMs  - Polling interval in milliseconds
     * @param {number}   timeoutMs   - Maximum wait time
     * @param {Function} checkFn     - Returns [isDone: boolean, result: string]
     * @returns {Promise<string>} The final result or "timeout"
     */
    _pollCodecSupport(intervalMs, timeoutMs, checkFn) {
        return new Promise(resolve => {
            const [isDone, initialResult] = checkFn();
            if (isDone) return resolve(initialResult);

            const pollHandle = this.scheduler.repeatInterval(
                toMilliseconds(intervalMs),
                () => {
                    const [done, result] = checkFn();
                    if (done) {
                        pollHandle.cancel();
                        timeoutHandle.cancel();
                        resolve(result);
                    }
                },
            );

            const timeoutHandle = this.scheduler.scheduleDelay(
                toMilliseconds(timeoutMs),
                () => {
                    pollHandle.cancel();
                    timeoutHandle.cancel();
                    resolve('timeout');
                },
            );
        });
    }
}

export default PlayReadyCapabilityDetector;
