/**
 * DRM License Request Factory
 *
 * Creates the appropriate DRM license request handler based on the
 * DRM scheme in use (PlayReady, FairPlay, or Widevine/default).
 * Acts as a factory that delegates to scheme-specific implementations.
 *
 * @module DrmLicenseRequestFactory
 * @source Module_90581
 */

import { __decorate, __param } from '../core/ReflectMetadataPolyfill';
import { injectable, injectDecorator } from '../ioc/ComponentDependencyResolver';
import { dP as DmSymbol } from '../symbols/DrmSessionDependencies';
import { keyMap as KeyEncoderSymbol } from '../symbols/DrmSessionDependencies';
import { zG as TextCodecSymbol } from '../symbols/DrmSessionDependencies';
import { ConfigToken } from '../symbols/DrmSessionDependencies';
import { nativeProcessor as VersionSymbol } from '../symbols/DrmSessionDependencies';
import { DrmScheme } from '../drm/DrmScheme';
import { SC as KeyIdRegistrySymbol } from '../symbols/DrmSessionDependencies';
import { EDa as WidevineRequestHandler } from '../drm/DefaultDrmProvider';
import { IEa as PlayReadyRequestHandler } from '../drm/PlayReadyEmeSessionAdapter';
import { vKa as FairPlayRequestHandler } from '../drm/FairPlayEmeSessionAdapter';

class DrmLicenseRequestFactory {
    /**
     * @param {Object} textCodec     - UTF-8 text encoder/decoder.
     * @param {Object} dm            - DRM module reference.
     * @param {Object} keyEncoder    - Binary key encoder.
     * @param {Function} config      - Configuration accessor.
     * @param {Object} keyIdRegistry - Key ID tracking registry.
     * @param {string} version       - Player version string.
     */
    constructor(textCodec, dm, keyEncoder, config, keyIdRegistry, version) {
        this.textCodec = textCodec;
        this.dm = dm;
        this.keyEncoder = keyEncoder;
        this.config = config;
        this.keyIdRegistry = keyIdRegistry;
        this.VERSION = version;
    }

    /**
     * Create a DRM license request handler for the given scheme.
     *
     * @param {string} drmScheme - One of DrmScheme.playready, .fairplay, or default (Widevine).
     * @returns {Object} The appropriate license request handler instance.
     */
    create(drmScheme) {
        switch (drmScheme) {
            case DrmScheme.playready:
                return new PlayReadyRequestHandler(this.dm, this.keyEncoder);

            case DrmScheme.fairplay:
                return new FairPlayRequestHandler(
                    this.dm,
                    this.keyEncoder,
                    this.textCodec,
                    this.VERSION
                );

            default:
                // Widevine / generic handler
                return new WidevineRequestHandler(
                    this.dm,
                    this.keyEncoder,
                    this.keyIdRegistry,
                    this.config
                );
        }
    }
}

export { DrmLicenseRequestFactory as vEa };

// IoC registration
DrmLicenseRequestFactory = __decorate([
    injectable(),
    __param(0, injectDecorator(TextCodecSymbol)),
    __param(1, injectDecorator(DmSymbol)),
    __param(2, injectDecorator(KeyEncoderSymbol)),
    __param(3, injectDecorator(ConfigToken)),
    __param(4, injectDecorator(KeyIdRegistrySymbol)),
    __param(5, injectDecorator(VersionSymbol))
], DrmLicenseRequestFactory);
