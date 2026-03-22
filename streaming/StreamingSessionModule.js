/**
 * Netflix Cadmium Player - Streaming Session DI Module
 *
 * Dependency injection container module that binds streaming session
 * related services: StreamingSession, MediaRequest, RestartManager,
 * MediaRequestDownloader, and OpenConnectSideChannel.
 *
 * @module StreamingSessionModule
 * @original Module_92692
 */

// import { ContainerModule } from 'inversify'; // webpack 22674
// import { StreamingSessionToken } from '../streaming/StreamingSessionToken.js'; // webpack 67263
// import { StreamingSession } from '../streaming/StreamingSession.js'; // webpack 13005
// import { MediaRequestToken } from '../streaming/MediaRequestToken.js'; // webpack 24240
// import { MediaRequest } from '../streaming/MediaRequest.js'; // webpack 22806
// import { eib as RestartManagerToken, internal_Wgb as DownloaderToken } from '../streaming/TransportTokens.js'; // webpack 31034
// import { RestartManager } from '../streaming/RestartManager.js'; // webpack 76457
// import { MediaRequestDownloader } from '../streaming/MediaRequestDownloader.js'; // webpack 77425
// import { internal_Vgb as SideChannelToken } from '../streaming/SideChannelToken.js'; // webpack 51790
// import { OpenConnectSideChannel } from '../network/OpenConnectSideChannel.js'; // webpack 89936

/**
 * IoC container module for streaming session bindings.
 * Registers all services needed for an active streaming session.
 *
 * Bindings:
 * - StreamingSessionToken -> StreamingSession (singleton)
 * - MediaRequestToken -> MediaRequest (singleton)
 * - RestartManagerToken -> RestartManager (singleton)
 * - DownloaderToken -> MediaRequestDownloader (singleton)
 * - SideChannelToken -> OpenConnectSideChannel (singleton)
 *
 * @type {ContainerModule}
 */
export const streamingSessionModule = new ContainerModule((bind) => {
    bind(StreamingSessionToken).to(StreamingSession).inSingletonScope();
    bind(MediaRequestToken).to(MediaRequest).inSingletonScope();
    bind(RestartManagerToken).to(RestartManager).inSingletonScope();
    bind(DownloaderToken).to(MediaRequestDownloader).inSingletonScope();
    bind(SideChannelToken).to(OpenConnectSideChannel).inSingletonScope();
});
