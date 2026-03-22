/**
 * Netflix Cadmium Player — PlatformModule
 *
 * IoC container module that binds the three core platform-related
 * service tokens to their concrete implementations:
 *
 *   - PlatformToken   -> PlatformProvider       (singleton)
 *   - IX              -> PlatformCapabilities
 *   - DrmConstants    -> DrmConstantsProvider
 *
 * @module ioc/PlatformModule
 */

// import { ContainerModule } from '../modules/Module_22674';
// import { PlatformToken } from '../modules/Module_91581';
// import { IX as PlatformCapabilitiesToken } from '../modules/Module_5614';
// import { DrmConstantsToken } from '../modules/Module_52033';
// import { PlatformProvider, PlatformCapabilities, DrmConstantsProvider } from '../modules/Module_89397';

/**
 * IoC container module for platform bindings.
 * @type {ContainerModule}
 */
export const platformModule = new ContainerModule(function (bind) {
  bind(PlatformToken).to(PlatformProvider).inSingletonScope();
  bind(PlatformCapabilitiesToken).to(PlatformCapabilities);
  bind(DrmConstantsToken).to(DrmConstantsProvider);
});
