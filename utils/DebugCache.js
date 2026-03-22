/**
 * Netflix Cadmium Player — Debug Cache
 *
 * A simple toggle-able cache (Map) used for debug/diagnostic purposes.
 * When enabled, stores debug entries; when disabled, clears and stops
 * collecting. Used internally by the Cadmium player for conditional
 * diagnostic data collection.
 *
 * @module utils/DebugCache
 * @original Module_65149
 */

/**
 * Whether the debug cache is currently enabled.
 * @type {boolean}
 */
export let isEnabled = false;

/**
 * The debug cache map. Stores diagnostic entries when enabled.
 * Entries are keyed by an application-defined identifier.
 * @type {Map<any, any>}
 */
export let debugCache = new Map();

/**
 * Enable the debug cache. Clears any existing entries and begins
 * accepting new diagnostic data.
 */
export function enable() {
  isEnabled = true;
  debugCache.clear();
}

/**
 * Disable the debug cache. Clears all stored entries and stops
 * accepting new diagnostic data.
 */
export function disable() {
  isEnabled = false;
  debugCache.clear();
}

export { debugCache as ase_Zca };
