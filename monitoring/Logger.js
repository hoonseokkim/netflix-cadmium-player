/**
 * @module Logger
 * @description Core logging implementation for the Cadmium player.
 *              Supports standard log levels (fatal, error, warn, info, trace, debug)
 *              and dispatches log entries to registered log sinks. Includes
 *              context metadata and sub-logger creation.
 *              Original: Module_29045
 */

import { LogLevel } from '../monitoring/LogLevel'; // Module 87386 (ep)
import { LogEntry } from '../monitoring/LogEntry'; // Module 90694 (JGa)
import { createLoggerInstance } from '../monitoring/LoggerFactory'; // Module 37960

/**
 * Logger that dispatches messages to registered log sinks.
 */
class Logger {
    /**
     * @param {Object} clock - Clock providing getCurrentTime()
     * @param {Object} loggerFactory - Factory for creating logger argument instances
     * @param {Object} logSinks - Container holding registered log sink functions
     * @param {string} [category="General"] - Debug category name for this logger
     */
    constructor(clock, loggerFactory, logSinks, category = "General") {
        /** @type {Object} Clock reference for timestamping log entries */
        this.clock = clock;

        /** @type {Object} Logger factory for formatting arguments */
        this.loggerFactory = loggerFactory;

        /** @type {Object} Registered log sinks */
        this.logSinks = logSinks;

        /** @type {string} Category label for this logger */
        this.category = category;

        /** @type {Object} Additional context metadata attached to log entries */
        this._contextMetadata = {};
    }

    /**
     * Adds context metadata that will be included in all log entries.
     * @param {string} key - Metadata key
     * @param {*} value - Metadata value
     */
    setContextMetadata(key, value) {
        this._contextMetadata[key] = value;
    }

    /**
     * Logs a fatal-level message.
     * @param {string} message - Log message
     * @param {...*} args - Additional arguments
     */
    fatal(message, ...args) {
        this._dispatch(LogLevel.FATAL, message, this._formatArgs(message, args));
    }

    /**
     * Logs an error-level message.
     * @param {string} message - Log message
     * @param {...*} args - Additional arguments
     */
    error(message, ...args) {
        this._dispatch(LogLevel.ERROR, message, this._formatArgs(message, args));
    }

    /**
     * Logs a warn-level message.
     * @param {string} message - Log message
     * @param {...*} args - Additional arguments
     */
    warn(message, ...args) {
        this._dispatch(LogLevel.WARN, message, this._formatArgs(message, args));
    }

    /**
     * Logs an info-level message.
     * @param {string} message - Log message
     * @param {...*} args - Additional arguments
     */
    info(message, ...args) {
        this._dispatch(LogLevel.INFO, message, this._formatArgs(message, args));
    }

    /**
     * Logs a trace-level message.
     * @param {string} message - Log message
     * @param {...*} args - Additional arguments
     */
    trace(message, ...args) {
        this._dispatch(LogLevel.TRACE, message, this._formatArgs(message, args));
    }

    /**
     * Debug-level log (no-op in production builds).
     * @param {string} _message - Log message (ignored)
     * @param {...*} _args - Additional arguments (ignored)
     */
    debug(_message, ..._args) {
        // No-op in production
    }

    /**
     * Alias for debug().
     * @param {string} message - Log message
     * @param {...*} args - Additional arguments
     */
    log(message, ...args) {
        this.debug(message, ...args);
    }

    /**
     * Writes a log entry at the specified level.
     * @param {number} level - Log level
     * @param {string} message - Log message
     * @param {...*} args - Additional arguments
     */
    write(level, message, ...args) {
        this._dispatch(level, message, this._formatArgs(message, args));
    }

    /**
     * @returns {string} JSON string representation
     */
    toString() {
        return JSON.stringify(this);
    }

    /**
     * @returns {Object} JSON-serializable representation
     */
    toJSON() {
        return { category: this.category };
    }

    /**
     * Creates a sub-logger with a different category.
     * @param {string} category - Category name for the new logger
     * @returns {Logger} New logger instance sharing the same sinks
     */
    createLogger(category) {
        return new Logger(this.clock, this.loggerFactory, this.logSinks, category);
    }

    /**
     * Dispatches a log entry to all registered sinks.
     * @private
     * @param {number} level - Log level
     * @param {string} message - Log message
     * @param {*} formattedArgs - Formatted arguments
     */
    _dispatch(level, message, formattedArgs) {
        const entry = new LogEntry(level, this.category, this.clock.getCurrentTime(), message, formattedArgs);
        for (const sink of this.logSinks.logSinks) {
            sink(entry);
        }
    }

    /**
     * Prepends context metadata to the argument list if present.
     * @private
     * @param {*} args - Original arguments array
     * @returns {*[]} Arguments with optional context metadata prepended
     */
    _prependContextMetadata(args) {
        return Object.keys(this._contextMetadata).length > 0
            ? [this._contextMetadata, ...args]
            : args;
    }

    /**
     * Formats log arguments, adding stack trace for empty messages.
     * @private
     * @param {string} message - The log message
     * @param {*[]} args - Raw arguments
     * @returns {*} Formatted arguments via the logger factory
     */
    _formatArgs(message, args) {
        if (!message || message === "null" || message === "undefined") {
            args.push({
                StackTrace: Error("Empty message").stack ?? "nostack",
            });
        }
        return createLoggerInstance(this.loggerFactory, this._prependContextMetadata(args));
    }
}

export { Logger };
export default Logger;
