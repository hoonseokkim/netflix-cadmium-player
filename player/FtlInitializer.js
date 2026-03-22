/**
 * @file FtlInitializer - First Time Load (FTL) component initializer
 * @module player/FtlInitializer
 * @description Registers a handler for the INIT_COMPONENT_FTL lifecycle event.
 * When the player initializes, this checks if FTL (First Time Load) profiling
 * is enabled in the config and starts the FTL tracker if so.
 *
 * FTL tracks time-to-first-frame and other startup performance metrics.
 *
 * @original Module_59405
 *
 * @dependencies
 *   Module 29204 - Player configuration (config.ftlEnabled)
 *   Module 33096 - Result constants (SUCCESS)
 *   Module 36129 - Lifecycle event names (ea.INIT_COMPONENT_FTL)
 *   Module 31276 - Disposable list / service locator
 *   Module 69484 - FTL tracker service ($cb)
 *   Module 11479 - Component keys (vk)
 */

// import { config } from '../core/PlayerConfig';
// import { SUCCESS } from '../core/ResultConstants';
// import { LifecycleEvents } from '../core/LifecycleEvents';
// import { disposableList } from '../core/DisposableList';
// import { ftlTracker } from '../telemetry/FtlTracker';
// import { componentKeys } from '../core/ComponentKeys';

/**
 * Registers the FTL initialization handler.
 *
 * When INIT_COMPONENT_FTL fires during player startup:
 * 1. Checks `config.ftlEnabled`
 * 2. If enabled, starts the FTL tracker service
 * 3. Calls the completion callback with SUCCESS
 *
 * @param {Object} disposableList - The service locator / disposable registry
 * @param {Object} config - Player configuration
 */
export function registerFtlInitializer(disposableList, config, ftlTracker, componentKey, lifecycleEvent) {
    disposableList.key(componentKey).register(lifecycleEvent, function (done) {
        if (config.ftlEnabled) {
            disposableList.key(ftlTracker).start();
        }
        done(/* SUCCESS */);
    });
}
