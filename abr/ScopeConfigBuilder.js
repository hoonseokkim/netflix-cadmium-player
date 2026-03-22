/**
 * @module ScopeConfigBuilder
 * @description Builder step in the ABR scope configuration chain. Provides `when()`
 * to attach a filter predicate, and `whenActiveAndNotStalled()` as a convenience
 * shortcut that filters for non-stalled, active playback targets.
 *
 * @see Module_7190
 */

import { tja as NextStepBuilder } from '../abr/ScopeNextStep';

/**
 * Intermediate builder for ABR scope configuration.
 * Allows attaching a "when" predicate that gates whether the scope applies.
 */
export class ScopeConfigBuilder {
  /**
   * @param {object} scopeConfig - The scope configuration being assembled
   */
  constructor(scopeConfig) {
    /** @private */
    this._scopeConfig = scopeConfig;
  }

  /**
   * Sets a custom predicate that determines when this scope is active.
   * @param {function(object): boolean} predicate
   * @returns {NextStepBuilder}
   */
  when(predicate) {
    this._scopeConfig.pR = predicate;
    return new NextStepBuilder(this._scopeConfig);
  }

  /**
   * Convenience: scope is active when the target is non-null, not stalled,
   * and not in a "completed" (cZa) state.
   * @returns {NextStepBuilder}
   */
  whenActiveAndNotStalled() {
    this._scopeConfig.pR = (context) => {
      return context.target !== null &&
        !context.target.isStalled() &&
        !context.target.isCompleted();
    };
    return new NextStepBuilder(this._scopeConfig);
  }
}

export { ScopeConfigBuilder as bDa };
