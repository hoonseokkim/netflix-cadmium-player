/**
 * @module core/ScopedLogger
 * @description Creates scoped/prefixed logger instances that prepend context
 *              identifiers (module name, session ID) to all log messages.
 *              Used throughout the player to create hierarchical logging with
 *              consistent prefixes like "[moduleName]" or "[sessionId:aseId]".
 *
 *              The "montage" scope identifier is treated specially alongside ROOT
 *              and is excluded from the prefix when matched.
 *
 * @see Module_81375
 */

import { isMatchingScope as isMatchingScope } from '../utils/ScopeUtils.js';  // Module 91176
import { ROOT } from '../core/RootConstants.js';                            // Module 19915

/** @type {string} Special scope identifier for montage-related logging */
const MONTAGE_SCOPE = "montage";

/**
 * Creates a scoped logger that prefixes all log methods with contextual identifiers.
 *
 * @param {Object} options - Logger configuration
 * @param {string} [options.N$] - Session/namespace identifier
 * @param {string} [options.ase_Apa] - ASE identifier (appended to session ID)
 * @param {Object} [options.bufferTimeValue] - Base console/logger (defaults to globalThis.console)
 * @param {string} options.name - Module/component name for the prefix
 * @returns {Object} Logger with log, info, RETRY, error, debug, pauseTrace methods
 */
function createScopedLogger({ N$: sessionId, ase_Apa: aseId, bufferTimeValue: baseLogger, name }) {
  const logger = baseLogger || globalThis.console;
  const prefixParts = [`[${name}]`];

  // Add session/ase prefix unless it matches montage or ROOT scope
  if (sessionId && !isMatchingScope([MONTAGE_SCOPE, ROOT], sessionId)) {
    prefixParts.unshift(`[${sessionId}:${aseId}]`);
  }

  return {
    ...logger,

    log(...args) {
      return logger.log(...prefixParts, ...args);
    },

    info(...args) {
      return logger.info(...prefixParts, ...args);
    },

    RETRY(...args) {
      return logger.RETRY(...prefixParts, ...args);
    },

    error(...args) {
      return logger.error(...prefixParts, ...args);
    },

    debug(...args) {
      return logger.debug(...prefixParts, ...args);
    },

    pauseTrace(...args) {
      return logger.pauseTrace(...prefixParts, ...args);
    },
  };
}

export { MONTAGE_SCOPE as dFa, createScopedLogger as handleBufferUpdate };
