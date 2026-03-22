/**
 * @module AseGlobals
 * @description Provides a global singleton container for ASE (Adaptive Streaming Engine)
 * configuration and shared state. The AseGlobals class serves as a namespace-like
 * object that can hold global references used across the streaming pipeline.
 * @original Module_20318
 */

/**
 * Empty container class for ASE global state.
 * Acts as a shared namespace for global references used by the streaming engine.
 */
export class AseGlobals {}

/**
 * Singleton instance of AseGlobals shared across the streaming pipeline.
 * @type {AseGlobals}
 */
export const aseGlobals = new AseGlobals();

export default { AseGlobals, aseGlobals };
