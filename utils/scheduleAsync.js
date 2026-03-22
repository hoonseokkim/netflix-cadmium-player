/**
 * @module scheduleAsync
 * @description Schedules a callback to run asynchronously via setTimeout(fn, 0).
 * Used throughout the player to defer execution to the next event loop tick.
 * @origin Module_32219
 */

/**
 * Schedules a function to execute asynchronously on the next event loop tick.
 * @param {Function} callback - The function to execute
 * @returns {number} The timeout ID (can be used with clearTimeout)
 */
export function scheduleAsync(callback) {
  return setTimeout(callback, 0);
}
