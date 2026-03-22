/**
 * Netflix Cadmium Player — ConfigChangeObserver
 *
 * Simple observer that tracks configuration changes. Each instance is
 * assigned a unique ID (via Module 72632's `id()` helper) and holds a
 * callback invoked when the configuration is updated.
 *
 * @module config/ConfigChangeObserver
 */

// import { id as generateId } from '../modules/Module_72632';

export class ConfigChangeObserver {
  /**
   * @param {Function} onConfigChanged - Callback invoked when configuration changes.
   */
  constructor(onConfigChanged) {
    /** @type {string|number} Unique observer identifier. */
    this.id = generateId();

    /** @type {Function} Callback for config changes. */
    this.onConfigChanged = onConfigChanged;
  }

  /**
   * Attach the internal MAC (Message Authentication Context) reference.
   * Called during MSL session initialisation.
   *
   * @param {Object} macContext - The MAC context to associate with this observer.
   */
  setMacContext(macContext) {
    this.macContext = macContext;
  }
}
