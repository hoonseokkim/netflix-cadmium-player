/**
 * Netflix Cadmium Player - ID Counter
 * Deobfuscated from Module_72632
 *
 * Simple auto-incrementing ID generator.
 * Returns a unique integer on each call, starting from 0.
 * Used throughout the player for assigning unique identifiers
 * to objects, requests, tasks, etc.
 */

let counter = 0;

/**
 * Generates a unique integer ID by incrementing an internal counter.
 *
 * @returns {number} A unique monotonically increasing integer
 */
export function id() {
    return counter++;
}
