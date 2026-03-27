/**
 * Netflix Cadmium Player - Session Module IoC Bindings
 *
 * Registers IoC container bindings for the streaming session subsystem.
 * Binds session-related services including the session manager, session factory,
 * session token provider, configuration provider, and various session utilities.
 *
 * @module SessionModuleBindings
 * @see Module_99584
 */

import { readFloat32 as ContainerModule } from '../ioc/ContainerModule.js';
import { hjb as SessionManagerToken } from '../streaming/SessionManagerTokens.js';
import { dJa as SessionManager } from '../streaming/SessionManager.js';
import { SessionToken } from '../streaming/SessionToken.js';
import { HLa as SessionFactory } from '../streaming/SessionFactory.js';
import { akb as SessionConfigToken } from '../streaming/SessionConfigTokens.js';
import { KJa as SessionConfig } from '../streaming/SessionConfig.js';
import { $jb as SessionUtilToken, SessionHelperToken as SessionHelperToken } from '../streaming/SessionUtilTokens.js';
import { nHa as SessionUtil } from '../streaming/SessionUtil.js';
import { xGa as SessionHelper } from '../streaming/SessionHelper.js';
import { q$a as ConfigProviderToken, QCa as ConfigResolverToken } from '../streaming/ConfigProviderTokens.js';
import { aseGlobals } from '../core/Globals.js';
import { PCa as ConfigResolver } from '../streaming/ConfigResolver.js';
import { FJa as EventBusToken, EJa as EventBus } from '../events/EventBus.js';
import { vDa as StreamingServiceToken } from '../streaming/StreamingServiceTokens.js';
import { uDa as StreamingService } from '../streaming/StreamingService.js';

/**
 * IoC module that configures all session-related bindings.
 * @type {ContainerModule}
 */
export const sessionModule = new ContainerModule((bind) => {
    bind(SessionManagerToken).to(SessionManager).sa();
    bind(SessionConfigToken).to(SessionConfig).sa();
    bind(SessionToken).to(SessionFactory).sa();
    bind(SessionUtilToken).to(SessionUtil).sa();
    bind(SessionHelperToken).to(SessionHelper).sa();

    // Config provider uses a factory that returns the current streaming engine's config
    bind(ConfigProviderToken).w1c(() => aseGlobals.streamingEngine?.currentConfigProvider);

    bind(ConfigResolverToken).to(ConfigResolver).sa();
    bind(EventBusToken).to(EventBus);
    bind(StreamingServiceToken).to(StreamingService).sa();
});
