/**
 * @module DrmModule
 * @description IoC (Inversion of Control) container module for DRM-related bindings.
 * Registers DRM service implementations including key system management,
 * session handling, and a media request constructor factory for DRM operations.
 * @see Module_51770
 */

import { ContainerModule } from '../core/inversify.js';
import { mHa as DrmKeySystemServiceId, lHa as DrmKeySystemServiceImpl } from '../drm/DrmKeySystemService.js';
import { wgb as DrmSessionManagerId, kHa as DrmSessionManagerImpl } from '../drm/DrmSessionManager.js';
import { DrmProviderFactoryId as DrmProviderFactoryId } from '../drm/DrmProviderFactory.js';
import { WP as DrmProviderImpl } from '../drm/DrmProvider.js';
import { zgb as MediaRequestFactoryId } from '../drm/DrmMediaRequestFactory.js';
import { DrmMediaRequestFactoryImpl as DrmMediaRequestFactoryImpl } from '../drm/DrmMediaRequestFactoryImpl.js';
import { sX as DrmConfigId, hHa as DrmConfigImpl } from '../drm/DrmConfig.js';
import { ugb as DrmCryptoId, gHa as DrmCryptoImpl } from '../drm/DrmCrypto.js';

/**
 * IoC container module that binds all DRM-related interfaces to their implementations.
 * - DrmSessionManager: manages DRM session lifecycle
 * - DrmKeySystemService: handles key system selection and management
 * - DrmProviderFactory: creates DRM provider instances
 * - MediaRequestFactory: constructs DRM-related media requests
 * - DrmConfig: DRM configuration
 * - DrmCrypto: DRM cryptographic operations
 */
export const DrmContainerModule = new ContainerModule((bind) => {
    bind(DrmSessionManagerId).to(DrmSessionManagerImpl).inSingletonScope();
    bind(DrmKeySystemServiceId).to(DrmKeySystemServiceImpl).inSingletonScope();

    bind(DrmProviderFactoryId).toFactory((...args) => {
        return new DrmProviderImpl(...args);
    });

    bind(MediaRequestFactoryId).toFactory(() => {
        return (context) => new DrmMediaRequestFactoryImpl(context);
    });

    bind(DrmConfigId).to(DrmConfigImpl).inSingletonScope();
    bind(DrmCryptoId).to(DrmCryptoImpl).inSingletonScope();
});
