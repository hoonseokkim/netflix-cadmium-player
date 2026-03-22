/**
 * Console Logger Factory
 *
 * Creates a chainable trace-logger function backed by the Cadmium
 * platform Console.  Supports hierarchical prefix extension so that
 * sub-systems can create child loggers (e.g. "DRM:License:Request").
 *
 * Usage:
 *   const log = consoleLogger("DRM", "License");
 *   log("processing request");          // traces "DRM License:processing request"
 *   const subLog = log.extend("Request");
 *   subLog("sent");                     // traces "DRM License:Request:sent"
 *   subLog.error("failed!");            // errors  "DRM License:Request:failed!"
 *
 * @module ConsoleLogger
 * @source Module_72163
 */

import { __spreadArray } from '../core/ReflectMetadataPolyfill';
import { platform as cadmium } from '../core/CadmiumPlatformFactory';

/**
 * Create a logger function with optional prefix segments.
 *
 * @param {string|Object} categoryOrConsole - Category string or existing Console instance.
 * @param {...string} prefixSegments        - Additional prefix segments to join with ":".
 * @returns {Function} A trace function with `.console`, `.extend()`, and `.error()` properties.
 */
export function consoleLogger(categoryOrConsole, ...prefixSegments) {
    const consoleInstance = typeof categoryOrConsole === "string"
        ? new cadmium.Console(categoryOrConsole)
        : categoryOrConsole;

    const prefix = prefixSegments
        .filter(function (segment) { return segment; })
        .map(function (segment) { return `${segment}`; })
        .join(":");

    function trace(...args) {
        return prefix
            ? consoleInstance.pauseTrace(prefix, ...args)
            : consoleInstance.pauseTrace(...args);
    }

    /** The underlying Console instance. */
    trace.console = consoleInstance;

    /**
     * Create a child logger with additional prefix segments.
     */
    trace.extend = function (...additionalSegments) {
        return consoleLogger(consoleInstance, prefix, ...additionalSegments);
    };

    /**
     * Log an error through the underlying console.
     */
    trace.error = function (...args) {
        return consoleInstance.error(prefix, ...args);
    };

    return trace;
}
