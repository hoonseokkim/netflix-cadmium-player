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
