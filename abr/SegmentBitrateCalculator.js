/**
 * @module SegmentBitrateCalculator
 * @description Calculates the effective bitrate of the next video segment based on
 * actual segment size and duration, rather than relying on the stream's nominal bitrate.
 * Used by the ABR (Adaptive Bitrate) algorithm to make more accurate bandwidth estimates.
 *
 * @original Module 10592
 */

import { isValidVideoStream } from '../streaming/StreamValidation.js';
import { DEBUG } from '../utils/DebugFlags.js';
import { console as nfConsole } from '../utils/PlatformGlobals.js';

/**
 * Calculates the real bitrate of the next segment for a given stream.
 *
 * If the stream has a valid video stream and we can determine the next segment's
 * size and duration, the actual bitrate is computed as (8 * segmentSizeBytes) / durationMs.
 * Otherwise, falls back to the stream's nominal bitrate.
 *
 * @param {boolean} enabled - Whether segment-level bitrate calculation is enabled
 * @param {Object} stream - The stream object containing videoStream and bitrate properties
 * @param {number} segmentIndex - The index of the next segment to calculate bitrate for
 * @returns {number} The calculated bitrate in kbps
 */
export function calculateNextSegmentBitrate(enabled, stream, segmentIndex) {
    if (!enabled || typeof segmentIndex !== 'number' || !isValidVideoStream(stream.videoStream)) {
        return stream.bitrate;
    }

    const segmentSize = stream.videoStream.getSegmentSize(segmentIndex);
    const segmentDuration = stream.videoStream.track.trackInfo.playbackSegment;

    if (!segmentSize || !segmentDuration) {
        if (DEBUG) {
            nfConsole.debug("No next segment size or duration found, using stream bitrate");
        }
        return stream.bitrate;
    }

    const bitrate = (8 * segmentSize) / segmentDuration;

    if (DEBUG) {
        nfConsole.log(
            `Next segment size: ${segmentSize} bytes, ` +
            `duration: ${segmentDuration} ms, ` +
            `bitrate: ${bitrate} kbps. ` +
            `Original bitrate: ${stream.bitrate} kbps`
        );
    }

    return bitrate;
}
