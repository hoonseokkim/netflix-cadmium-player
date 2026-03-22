/**
 * @module NetworkMonitorFactory
 * @description Injectable factory that creates network monitors when enabled
 *              by configuration. Wraps the network monitor provider with a
 *              config check.
 *              Original: Module_59806
 */

import { __decorate, __param } from 'tslib'; // Module 22970
import { injectable, inject as injectDecorator } from 'inversify'; // Module 22674

/**
 * Factory that conditionally creates network monitor instances
 * based on configuration settings.
 */
class NetworkMonitorFactory {
    /**
     * @param {Object} config - Configuration with bXb (enable network monitoring) flag
     * @param {Function} monitorProvider - Provider function that returns monitoring data
     * @param {Function} networkMonitor - Factory function that creates the monitor from data
     */
    constructor(config, monitorProvider, networkMonitor) {
        /** @type {Object} Configuration */
        this.config = config;

        /** @type {Function} Provider for monitoring data */
        this.monitorProvider = monitorProvider;

        /** @type {Function} Network monitor constructor/factory */
        this.networkMonitor = networkMonitor;
    }

    /**
     * Creates a network monitor if monitoring is enabled in config.
     * @returns {Object|undefined} Network monitor instance, or undefined if disabled
     */
    createMonitor() {
        if (this.config.enableNetworkMonitoring) {
            return this.networkMonitor(this.monitorProvider());
        }
    }
}

export { NetworkMonitorFactory };
export default NetworkMonitorFactory;
