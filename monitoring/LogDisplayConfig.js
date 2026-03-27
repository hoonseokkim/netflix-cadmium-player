/**
 * Netflix Cadmium Player - LogDisplayConfig
 *
 * Injectable configuration class for the in-browser debug log overlay.
 * Extends ConfigBase and exposes settings that control whether the DOM-based
 * diagnostics panel renders, how many log entries it retains, and the log
 * level threshold for auto-showing the panel.
 *
 * Originally: Module 14188 (export: HGa)
 *
 * Dependencies:
 *   - Module 22970 (__decorate, __param) - tslib decorator helpers
 *   - Module 22674 (injectable, injectDecorator) - inversify DI
 *   - Module 12501 (config, zd, tM) - config decorator + type tokens
 *   - Module 64174 (ConfigBase) - base configuration class
 *   - Module 83767 (gp) - DI token for log display config
 *   - Module 5614  (IX) - DI token for base player config
 */

import { __decorate, __param } from '../modules/Module_22970';
import { injectable, injectDecorator } from '../modules/Module_22674';
import { config, zd as BOOLEAN_TYPE, tM as NUMBER_TYPE } from '../modules/Module_12501';
import { ConfigBase } from '../modules/Module_64174';
import { gp as LOG_DISPLAY_CONFIG_TOKEN } from '../modules/Module_83767';
import { IX as BASE_CONFIG_TOKEN } from '../modules/Module_5614';

/**
 * Configuration for the debug log display overlay.
 *
 * @extends ConfigBase
 */
class LogDisplayConfig extends ConfigBase {
    /**
     * @param {Object} configValues - Raw config values (injected).
     * @param {Object} baseConfig - The base player configuration, used to
     *   inherit `defaultSegmentDurationMs`.
     */
    constructor(configValues, baseConfig) {
        super(configValues, 'LogDisplayConfigImpl');

        /** @private */
        this._baseConfig = baseConfig;
    }

    /**
     * Whether to render DOM-based diagnostic elements.
     * Overridden by the `renderDomDiagnostics` remote config flag.
     *
     * @type {boolean}
     * @default true
     */
    get renderDomDiagnostics() {
        return true;
    }

    /**
     * Inherits the default segment duration from the base player config.
     *
     * @type {number}
     */
    get defaultSegmentDurationMs() {
        return this._baseConfig.defaultSegmentDurationMs;
    }

    /**
     * The log level at or above which the debug overlay auto-shows.
     * A value of -1 means the overlay never auto-shows.
     * Overridden by the `logDisplayAutoshowLevel` remote config flag.
     *
     * @type {number}
     * @default -1
     */
    get logDisplayAutoshowLevel() {
        return -1;
    }
}

// Apply config decorators (remote config binding)
__decorate(
    [config(BOOLEAN_TYPE, 'renderDomDiagnostics')],
    LogDisplayConfig.prototype,
    'renderDomDiagnostics',
    null
);
__decorate(
    [config(NUMBER_TYPE, 'logDisplayMaxEntryCount')],
    LogDisplayConfig.prototype,
    'I1',
    null
);
__decorate(
    [config(NUMBER_TYPE, 'logDisplayAutoshowLevel')],
    LogDisplayConfig.prototype,
    'logDisplayAutoshowLevel',
    null
);

// Apply DI decorators
const DecoratedLogDisplayConfig = __decorate(
    [
        injectable(),
        __param(0, injectDecorator(LOG_DISPLAY_CONFIG_TOKEN)),
        __param(1, injectDecorator(BASE_CONFIG_TOKEN)),
    ],
    LogDisplayConfig
);

export { DecoratedLogDisplayConfig as LogDisplayConfig };
export { DecoratedLogDisplayConfig };
