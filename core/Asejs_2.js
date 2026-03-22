/**
 * Netflix Cadmium Player — ASEJS Scoped Logger
 *
 * Provides a global, auto-incrementing scoped console logger for ASEJS
 * subsystems.  Each call to `getLogger(index)` returns a child console
 * tagged with the given numeric index, creating it lazily on first access.
 *
 * @module AsejsScopedLogger
 */

// Dependencies
// import { platform } from './modules/Platform';
// import { mathTanh as createScopedConsole } from './modules/ConsoleFactory';

/**
 * Factory that vends index-scoped console loggers under the ASEJS namespace.
 */
class AsejsScopedLoggerFactory {
  /**
   * @param {number} initialId - Starting id used as the console suffix.
   */
  constructor(initialId) {
    const suffix = `(${initialId})`;

    /** @type {Console} Root ASEJS console for this factory. */
    this.console = new platform.Console("ASEJS", "media|asejs", suffix);

    /** @type {Console[]} Cache of child loggers keyed by numeric index. */
    this.childLoggers = [];
  }

  /**
   * Get (or lazily create) a child logger for the given numeric index.
   *
   * @param {number} index
   * @returns {Console}
   */
  getLogger(index) {
    if (!this.childLoggers[index]) {
      const tag = `[${index}]`;
      this.childLoggers[index] = createScopedConsole(platform, this.console, tag);
    }
    return this.childLoggers[index];
  }
}

/** @type {AsejsScopedLoggerFactory} Global logger factory instance (id = 0). */
export const globalLoggerFactory = new AsejsScopedLoggerFactory(0);
