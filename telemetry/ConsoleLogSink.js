/**
 * @module ConsoleLogSink
 * @description Console log sink that routes player log messages to the browser console.
 * Filters messages by log level against a configured threshold and dispatches
 * to console.error, console.warn, or console.log accordingly.
 *
 * @see Module_2734
 */

import { disposableList } from '../core/DisposableList';
import { oX as LOG_SINK_KEY } from '../core/ServiceKeys';
import { TGa as LogCategory } from '../core/LogCategories';

/**
 * Registers a console log sink that writes player log entries to the browser console.
 *
 * Log level routing:
 *   - Level <= 1: console.error
 *   - Level <= 2: console.warn
 *   - Level >= 3: console.log
 *
 * Messages are suppressed when no global config exists or the message level
 * exceeds the configured maximum log level (config.DHc).
 */
export function registerConsoleLogSink() {
  disposableList.key(LOG_SINK_KEY).register(LogCategory.g_b, (logEntry) => {
    const level = logEntry.level;

    // Skip if no config or level exceeds threshold
    if (!globalThis._cad_global?.config || level <= globalThis._cad_global.config.DHc) {
      const formattedMessage = logEntry.format();
      const console = globalThis.console;

      if (level <= 1) {
        console.error(formattedMessage);
      } else if (level <= 2) {
        console.warn(formattedMessage);
      } else {
        console.log(formattedMessage);
      }
    }
  });
}

export default registerConsoleLogSink;
