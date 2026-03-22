/**
 * Netflix Cadmium Player - DRM Module Bindings
 *
 * IoC container bindings for the DRM (Digital Rights Management) subsystem.
 * Registers the DRM configuration and determines the DRM profile type
 * ("browsertest" vs "browser") based on runtime configuration.
 *
 * @module DrmModuleBindings
 * @see Module_99198
 */

import { DrmConfig } from '../drm/DrmConfig.js';
import { jja as DrmConfigToken } from '../drm/DrmTokens.js';
import { readFloat32 as ContainerModule } from '../ioc/ContainerModule.js';
import { SP as DrmProfileProvider } from '../drm/DrmProfileProvider.js';
import { ConfigToken } from '../core/ConfigToken.js';

/**
 * IoC binding that registers DrmConfig as a singleton.
 * @type {ContainerModule}
 */
export const drmConfigBinding = new ContainerModule((bind) => {
    bind(DrmConfigToken).to(DrmConfig).sa();
});

/**
 * IoC binding that provides the DRM profile string based on config.
 * Returns "browsertest" if the bE flag is set in config, otherwise "browser".
 * @type {ContainerModule}
 */
export const drmProfileBinding = new ContainerModule((bind) => {
    bind(DrmProfileProvider).DO((resolver) => {
        const config = resolver.onConfigChanged.key(ConfigToken)();
        return config?.bE ? "browsertest" : "browser";
    });
});
