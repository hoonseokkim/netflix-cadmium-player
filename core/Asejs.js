/**
 * Netflix Cadmium Player — ASEJS Singleton Factory
 *
 * Provides a singleton accessor for the core Adaptive Streaming Engine in
 * JavaScript (ASEJS) instance.  The engine is lazily created on first call
 * and can be explicitly destroyed for cleanup.
 *
 * @module AsejsFactory
 */

// Dependencies
// import { platform } from './modules/Platform';
// import { AsejsEngine as AsejsEngine } from './modules/AsejsEngine';

/** @type {AsejsEngine|undefined} Cached singleton instance. */
let asejsInstance;

/**
 * Return (or lazily create) the global ASEJS engine singleton.
 *
 * @returns {AsejsEngine}
 */
export function getAsejsInstance() {
  if (!asejsInstance) {
    const console = new platform.Console("ASEJS", "media|asejs");
    asejsInstance = new AsejsEngine(console);
  }
  return asejsInstance;
}

/**
 * Destroy the current ASEJS singleton so a fresh one is created on the
 * next call to {@link getAsejsInstance}.
 */
export function destroyAsejsInstance() {
  asejsInstance = undefined;
}
