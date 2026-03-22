/**
 * Netflix Cadmium Player -- SegmentAvailabilityFactory
 *
 * Factory function that creates the appropriate segment availability
 * tracker based on the manifest type. For manifests with a segment
 * availability window (e.g., live/DASH), it creates a windowed tracker;
 * for on-demand content, it creates a static (full) availability tracker.
 *
 * @module streaming/SegmentAvailabilityFactory
 * @original Module_4786
 * @dependencies
 *   Module 20349 - StaticSegmentAvailability (zfb) - for on-demand content
 *   Module 40385 - WindowedSegmentAvailability (qfb) - for live/windowed content
 */

import { StaticSegmentAvailability } from '../streaming/StaticSegmentAvailability';     // Module 20349
import { WindowedSegmentAvailability } from '../streaming/WindowedSegmentAvailability'; // Module 40385

/**
 * Create a segment availability tracker appropriate for the manifest type.
 *
 * @param {Object} manifest - The parsed manifest
 * @param {boolean} manifest.hasSegmentAvailabilityWindow - True for live/windowed manifests
 * @param {Object} config - Streaming configuration
 * @returns {StaticSegmentAvailability|WindowedSegmentAvailability}
 */
export function createSegmentAvailabilityTracker(manifest, config) {
    if (manifest.hasSegmentAvailabilityWindow) {
        return new WindowedSegmentAvailability();
    }
    return new StaticSegmentAvailability(config);
}
