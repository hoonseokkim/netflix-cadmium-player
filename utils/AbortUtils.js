/**
 * @module AbortUtils
 * @description Utilities for working with AbortSignal / AbortController.
 * Provides helpers to detect AbortError, throw on aborted signals, and
 * create promises that resolve when a signal is aborted.
 *
 * @original Module_43155
 */

/**
 * Custom AbortError class for environments that don't natively support it.
 * @extends Error
 */
export class AbortError extends Error {
  /**
   * @param {string} [message] - Error message.
   */
  constructor(message) {
    super(message);
    this.name = 'AbortError';
  }
}

/**
 * Checks whether an error is an AbortError.
 *
 * @param {Error|null} error - The error to check.
 * @returns {boolean} True if the error has name "AbortError".
 */
export function isAbortError(error) {
  return error?.name === 'AbortError';
}

/**
 * Throws the signal's abort reason if the signal is already aborted.
 *
 * @param {AbortSignal} signal - The abort signal to check.
 * @throws {*} The signal's reason if aborted.
 */
export function throwIfAborted(signal) {
  if (signal.aborted) {
    throw signal.reason;
  }
}

/**
 * Returns a promise that resolves when the given signal is aborted.
 * Optionally throws the abort reason after resolution.
 *
 * @param {AbortSignal} signal - The abort signal to watch.
 * @param {boolean} [throwOnAbort=true] - If true, the promise rejects with the abort reason.
 * @returns {Promise<void>} Resolves (or rejects) when the signal aborts.
 */
export function onAbort(signal, throwOnAbort = true) {
  let afterResolve = () => {};

  if (!throwOnAbort) {
    afterResolve = () => {
      throwIfAborted(signal);
    };
  }

  return new Promise((resolve) => {
    if (signal.aborted) {
      return resolve();
    }

    const handler = () => resolve();

    if (signal.addListener) {
      signal.addListener('abort', handler);
    } else {
      signal.addEventListener?.('abort', handler);
    }
  }).then(afterResolve);
}
