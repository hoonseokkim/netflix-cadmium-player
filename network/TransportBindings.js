/**
 * Netflix Cadmium Player — Transport Layer DI Bindings
 *
 * Configures the dependency-injection container bindings for the network
 * transport layer.  Decides which transport implementation to use based on
 * platform capabilities (socket router support, MSL preference, matrix
 * playback, native processing).
 *
 * @module TransportBindings
 */

// Dependencies
// import { readFloat32 as ContainerModule } from './modules/Module_22674';  // IoC container module
// import { q8 as TransportConfigToken } from './modules/Module_70865';
// import { ohb as MslTransportToken, DirectTransportToken as DirectTransportToken, TransportSelectorToken as TransportSelectorToken } from './modules/Module_14543';
// import { OHa as MslTransportImpl } from './modules/Module_60204';
// import { QKa as DirectTransportImpl } from './modules/Module_89146';
// import { mLa as TransportConfigImpl } from './modules/Module_74429';
// import { LKa as SocketRouterTransportToken, KKa as SocketRouterTransportImpl } from './modules/Module_99306';
// import { ZC as MslPreference } from './modules/Module_34231';
// import { nativeProcessor as NativeProcessorToken } from './modules/Module_7605';
// import { fma as MatrixPlaybackToken } from './modules/Module_54861';

/**
 * IoC container module that registers all transport-related bindings.
 *
 * The transport selector (`TransportSelectorToken`) uses a factory function
 * that inspects the runtime configuration to choose between:
 *
 * 1. **Socket Router Transport** — when the CDN supports socket routing,
 *    the platform has native processing, and matrix playback is enabled.
 * 2. **MSL Transport** — when the config prefers MSL (Message Security Layer).
 * 3. **Direct Transport** — the default HTTP-based transport.
 */
export const transports = new ContainerModule((bind) => {
  bind(TransportConfigToken).to(TransportConfigImpl).inSingletonScope();
  bind(MslTransportToken).to(MslTransportImpl);
  bind(DirectTransportToken).to(DirectTransportImpl);
  bind(SocketRouterTransportToken).to(SocketRouterTransportImpl).inSingletonScope();

  bind(TransportSelectorToken).toFactory((context) => {
    return (requestConfig, cdnId) => {
      const transportConfig = context.onConfigChanged.key(TransportConfigToken);
      const nativeProcessor = context.onConfigChanged.key(NativeProcessorToken);
      const matrixPlayback = context.onConfigChanged.key(MatrixPlaybackToken);

      const cdnConfig = cdnId ? nativeProcessor.internal_Sza[cdnId] : undefined;

      // Use socket router when CDN supports it, request allows it,
      // matrix playback is available, and the transport supports it
      const useSocketRouter =
        cdnConfig?.useSocketRouter &&
        requestConfig?.iQc !== false &&
        matrixPlayback?.iua &&
        transportConfig.supportsMatrixPlayback;

      if (useSocketRouter) {
        return context.onConfigChanged.key(SocketRouterTransportToken);
      }

      // Fall back to MSL or direct transport based on preference
      const mslPreference = requestConfig?.kKc ?? MslPreference.PreferMsl;
      if (transportConfig.shouldUseMsl(mslPreference)) {
        return context.onConfigChanged.key(MslTransportToken);
      }

      return context.onConfigChanged.key(DirectTransportToken);
    };
  });
});
