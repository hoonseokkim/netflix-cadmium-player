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

/**
 * IoC container module for platform bindings.
 * @type {ContainerModule}
 */
export const platformModule = new ContainerModule(function (bind) {
  bind(PlatformToken).to(PlatformProvider).inSingletonScope();
  bind(PlatformCapabilitiesToken).to(PlatformCapabilities);
  bind(DrmConstantsToken).to(DrmConstantsProvider);
});
