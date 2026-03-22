/**
 * @module LiveAdManifestWindowCalculator
 * @description Calculates manifest window offsets for live ad segments.
 * Determines how far back the manifest window must extend for each ad break,
 * and computes the minimum number of ad segments required to fit within
 * the configured window size and allowance.
 *
 * @original Module_98589
 */

/**
 * Calculates manifest window parameters for each live ad segment.
 * For each segment, computes the cumulative content offset, the minimum
 * manifest window start position, and the offset from the window start.
 *
 * @param {Array<{startTimeMs: number, contentEndPts: number}>} segments - Ad break segments.
 * @param {Object} config - Window configuration.
 * @param {number} config.liveAdManifestWindowMs - Manifest window duration in ms.
 * @param {number} config.liveAdManifestWindowAllowanceMs - Extra allowance in ms.
 * @returns {Array<{windowSize: number, contentOffset: number, windowStart: number}>}
 *   Per-segment window parameters, or empty array if no segments.
 */
export function calculateAdManifestWindows(segments, config) {
  if (!segments || segments.length === 0) {
    return [];
  }

  const windowDuration = config.liveAdManifestWindowMs;
  const windowAllowance = config.liveAdManifestWindowAllowanceMs;

  // Calculate cumulative content offsets
  const cumulativeOffsets = [];
  let runningOffset = 0;

  for (const segment of segments) {
    cumulativeOffsets.push(runningOffset);
    runningOffset += segment.contentEndPts - segment.startTimeMs;
  }

  // Calculate window parameters from last segment backwards
  const result = new Array(segments.length);
  let previousWindowStart;

  for (let i = segments.length - 1; i >= 0; i--) {
    const contentOffset = cumulativeOffsets[i];
    const candidateStart = contentOffset - windowAllowance - windowDuration;
    const windowStart = previousWindowStart !== undefined
      ? Math.min(candidateStart, previousWindowStart - windowDuration)
      : candidateStart;

    result[i] = {
      windowSize: contentOffset - windowStart,
      contentOffset,
      windowStart,
    };

    previousWindowStart = windowStart;
  }

  return result;
}

/**
 * Calculates the minimum number of ad segments needed to fit within
 * the manifest window constraints.
 *
 * @param {Array<{startTimeMs: number, contentEndPts: number}>} segments - Ad break segments.
 * @param {Object} config - Window configuration.
 * @param {number} config.liveAdManifestWindowMs - Manifest window duration in ms.
 * @param {number} config.liveAdManifestWindowAllowanceMs - Extra allowance in ms.
 * @returns {number} The minimum segment index (1-based) from which ads can be served.
 */
export function getMinimumAdSegmentIndex(segments, config) {
  if (!segments || segments.length === 0) {
    return 0;
  }

  const windows = calculateAdManifestWindows(segments, config);

  for (let i = windows.length - 1; i >= 0; i--) {
    if (windows[i].windowStart < 0) {
      return i + 1;
    }
  }

  return 1;
}
