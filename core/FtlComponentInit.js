/**
 * FTL (First Time Load) Component Initializer
 *
 * Registers a handler for the INIT_COMPONENT_FTL lifecycle event.
 * When triggered, starts the FTL monitoring system if enabled in config.
 *
 * @module core/FtlComponentInit
 * @original Module_59405
 */

// import { config } from '../core/PlayerConfig';
// import { SUCCESS } from '../core/StatusCodes';
// import { ea as Events } from '../core/ErrorCodes';
// import { disposableList } from '../core/ServiceLocator';
// import { $cb as ftlMonitorSymbol } from '../monitoring/FtlMonitor';
// import { vk as componentManagerSymbol } from '../core/ComponentManager';

/**
 * Initializes the FTL component.
 *
 * Checks if FTL is enabled in configuration and starts the FTL monitor.
 * Calls the completion callback with SUCCESS when done.
 */
disposableList.get(componentManagerSymbol).register(Events.INIT_COMPONENT_FTL, (complete) => {
    if (config.ftlEnabled) {
        disposableList.get(ftlMonitorSymbol).start();
    }
    complete(SUCCESS);
});
