/**
 * Media Capability Detector Manager
 *
 * Manages audio and video capability detectors for the player.
 * Lazily creates and caches the appropriate detector based on the
 * current configuration (e.g. PlayReady, Widevine, FairPlay).
 * Delegates capability queries (codec support, key system version,
 * HDR support, etc.) to the underlying detectors.
 *
 * @module MediaCapabilityDetectorManager
 * @source Module_98960
 */

import { __decorate, __param } from '../core/ReflectMetadataPolyfill';
import { TW as ConfigReaderSymbol } from '../symbols/DrmSessionDependencies';
import { injectable, injectDecorator } from '../ioc/ComponentDependencyResolver';
import { internal_Mcb as CapabilityArraySymbol } from '../symbols/DrmSessionDependencies';
import { internal_Hab as CapabilityDetectorFactorySymbol } from '../symbols/DrmSessionDependencies';

class MediaCapabilityDetectorManager {
    /**
     * @param {Function} config                  - Config accessor returning player config.
     * @param {Object}   capabilityDetectorFactory - Factory for creating capability detectors.
     * @param {Object}   capabilityArrayProvider   - Provider of pre-populated capability arrays.
     */
    constructor(config, capabilityDetectorFactory, capabilityArrayProvider) {
        this.config = config;
        this.capabilityDetectorFactory = capabilityDetectorFactory;
        this.capabilityArrayProvider = capabilityArrayProvider;
    }

    /**
     * Check if an audio stream is supported.
     * @param {Object} audioStream - Audio stream descriptor.
     * @returns {boolean}
     */
    isAudioStreamSupported(audioStream) {
        return this._getAudioDetector().BDb(audioStream);
    }

    /**
     * Check if a video stream is supported.
     * @param {Object} videoStream - Video stream descriptor.
     * @returns {boolean}
     */
    isVideoStreamSupported(videoStream) {
        return this._getVideoDetector().BDb(videoStream);
    }

    /** @private Lazily create / cache the audio capability detector. */
    _getAudioDetector() {
        if (
            !this._audioDetector ||
            this._audioDetector.type !== this.config().audioCapabilityDetectorType
        ) {
            this._audioDetector = this.capabilityDetectorFactory.getAudioCapability(
                this.config().audioCapabilityDetectorType
            );
        }
        return this._audioDetector;
    }

    /** @private Lazily create / cache the video capability detector. */
    _getVideoDetector() {
        if (
            !this._videoDetector ||
            this._videoDetector.type !== this.config().videoCapabilityDetectorType
        ) {
            this._videoDetector = this.capabilityDetectorFactory.getVideoCapability(
                this.config().videoCapabilityDetectorType
            );
            this._videoDetector.wOa(this.capabilityArrayProvider.getCapabilitiesArray());
        }
        return this._videoDetector;
    }

    /** Check video format variant support. */
    FV(format) {
        return this._getVideoDetector().FV(format);
    }

    /** Check video ultra-HD support. */
    uZ(profile) {
        return this._getVideoDetector().uZ(profile);
    }

    /** Get the key system version string. */
    getKeySystemVersion() {
        return this._getVideoDetector().getKeySystemVersion();
    }

    /** Get video DRM capabilities info. */
    internal_Eha() {
        return this._getVideoDetector().internal_Eha();
    }

    /** Get audio spatial capabilities. */
    SAa() {
        return this._getAudioDetector().SAa();
    }

    /** Get audio DRM capabilities info. */
    internal_Dha() {
        return this._getAudioDetector().internal_Dha();
    }

    /** Get video codec profiles supported. */
    TAa() {
        return this._getVideoDetector().TAa();
    }

    /** Get extended video DRM capabilities. */
    internal_Fha() {
        return this._getVideoDetector().internal_Fha();
    }

    /** Get HDR capability info. */
    hca() {
        return this._getVideoDetector().hca();
    }
}

export { MediaCapabilityDetectorManager as mEa };

// IoC registration
MediaCapabilityDetectorManager = __decorate([
    injectable(),
    __param(0, injectDecorator(ConfigReaderSymbol)),
    __param(1, injectDecorator(CapabilityDetectorFactorySymbol)),
    __param(2, injectDecorator(CapabilityArraySymbol))
], MediaCapabilityDetectorManager);
