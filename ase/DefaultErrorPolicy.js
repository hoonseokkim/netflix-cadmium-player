/**
 * Netflix Cadmium Player - Default Error Policy
 *
 * Provides default ASE error handling policy that always returns
 * a zero backoff delay for zone serialization and marks instances
 * for unconditional retry. Used as the fallback policy when no
 * specific error handling is configured.
 *
 * @module ase/DefaultErrorPolicy
 */

/**
 * Default error policy: zero backoff, always retry.
 */
export class DefaultErrorPolicy {
  /**
   * Returns a zone serialization with zero backoff delay.
   * @returns {{ backoffDelay: number }}
   */
  serializeZone() {
    return { backoffDelay: 0 };
  }

  /**
   * Creates an instance configuration that enables unconditional retry.
   * @returns {{ shouldRetry: boolean }}
   */
  createInstance() {
    return { shouldRetry: true };
  }
}
