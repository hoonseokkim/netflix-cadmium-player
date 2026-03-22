/**
 * @file SegmentPositionFormatter.js
 * @description Utility function to format a segment position (segment number + offset)
 *              into a human-readable debug string. Used in trace logging throughout
 *              the streaming pipeline.
 * @module streaming/SegmentPositionFormatter
 * @original Module_82475
 */

/**
 * Formats a segment position as a debug-friendly string.
 * @param {Object} position - Segment position object
 * @param {number} position.M - Segment number
 * @param {Object} position.offset - Offset with a .ca() display method
 * @returns {string} Formatted string like "( 42, 1234ms )"
 */
export function formatSegmentPosition(position) {
  return `( ${position.M}, ${position.offset.ca()} )`;
}
