/**
 * Netflix Cadmium Player - ASE Decision Store
 *
 * Two-tier key-value store used by the ASE to track playback decisions.
 * Maintains a "committed" store and an "override" store. Lookups check
 * the override store first, then fall back to committed. This enables
 * temporary overrides during ABR evaluation without mutating committed state.
 *
 * @module ase/DecisionStore
 */

/**
 * Two-tier decision store with committed and override layers.
 * Used to track and manage ASE playback decisions such as selected
 * bitrates, CDN choices, and buffer targets.
 */
export class DecisionStore {
  /**
   * @param {Object} console - Console/logger instance.
   */
  constructor(console) {
    /** @type {Object} Logger instance */
    this.console = console;
    this.reset();
  }

  /**
   * Retrieves a value by key, checking the override store first,
   * then falling back to the committed store.
   *
   * @param {string} key - The decision key.
   * @returns {*} The stored value, or undefined if not found.
   */
  key(key) {
    return this.overrides[key] || this.committed[key];
  }

  /**
   * Sets a value in the committed store, only if it has not been set before.
   *
   * @param {string} key - The decision key.
   * @param {*} value - The value to store.
   */
  set(key, value) {
    if (this.committed[key] === undefined) {
      this.committed[key] = value;
    }
  }

  /**
   * Sets an override value, only if neither store already has a value.
   *
   * @param {string} key - The decision key.
   * @param {*} value - The override value.
   */
  setOverride(key, value) {
    if (this.key(key) === undefined) {
      this.overrides[key] = value;
    }
  }

  /**
   * Clears both the override and committed values for a key.
   *
   * @param {string} key - The decision key to clear.
   */
  clear(key) {
    this.clearOverride(key);
    this.committed[key] = undefined;
  }

  /**
   * Clears only the override value for a key.
   *
   * @param {string} key - The decision key.
   */
  clearOverride(key) {
    this.overrides[key] = undefined;
  }

  /**
   * Retains only a single key in the committed store,
   * discarding all others and clearing all overrides.
   *
   * @param {string} keyToRetain - The key to keep.
   */
  retainOnly(keyToRetain) {
    this.committed = { [keyToRetain]: this.committed[keyToRetain] };
    this.overrides = {};
  }

  /**
   * Resets both stores to empty objects.
   */
  reset() {
    /** @type {Object<string, *>} Committed decision values */
    this.committed = {};
    /** @type {Object<string, *>} Override decision values (checked first) */
    this.overrides = {};
  }

  /**
   * Serializes the store contents for debugging.
   *
   * @returns {{ committed: Object, overrides: Object }}
   */
  toJSON() {
    return {
      committed: this.committed,
      overrides: this.overrides,
    };
  }
}
