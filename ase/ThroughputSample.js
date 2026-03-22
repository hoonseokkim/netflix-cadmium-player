/**
 * Netflix Cadmium Player -- ThroughputSample
 *
 * A simple data class representing a single throughput measurement sample.
 * Used by the bandwidth estimator to track download speed observations.
 *
 * If the size represents a "seek to sample" sentinel value, the size
 * field is replaced with the sentinel constant.
 *
 * @module ase/ThroughputSample
 * @original Module_70826
 * @dependencies
 *   Module 72574 - seekToSample sentinel constant
 */

import { seekToSample } from '../streaming/SegmentReExports'; // Module 72574

/**
 * Represents a single throughput measurement.
 *
 * @param {number} timestamp - The time at which this sample was recorded
 * @param {Object|number} sizeOrSentinel - Byte size of the sample, or an object
 *        with a `isSeekToSample()` method that returns true if this is a
 *        seek-to-sample sentinel value
 */
export function ThroughputSample(timestamp, sizeOrSentinel) {
    this.timestamp = timestamp;
    this.size = sizeOrSentinel.isSeekToSample()
        ? seekToSample
        : sizeOrSentinel;
}
