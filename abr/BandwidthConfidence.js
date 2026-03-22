/**
 * Netflix Cadmium Player — BandwidthConfidence
 *
 * Calculates a confidence factor (0-1) for bandwidth estimates based on
 * the ratio of downloaded bytes to available buffer. Used during ABR
 * stream selection to weight bandwidth predictions.
 *
 * @module abr/BandwidthConfidence
 * @original Module_88502
 */

// import { MediaType } from '../media/MediaType';          // Module 65161
// import { dk as hasAudioStream } from '../streaming/StreamUtils'; // Module 8149

/**
 * Calculate a bandwidth confidence factor based on download progress.
 *
 * When the audio stream is available, the confidence is computed as the
 * ratio of bytes downloaded (`downloadedBytes`) to either the full buffer
 * target or a "loose" adjusted target that accounts for the playback
 * segment size.
 *
 * @param {number} downloadedBytes - Number of bytes downloaded so far
 * @param {number} bufferTarget - Target buffer size in bytes
 * @param {Object} streamSet - Stream set providing access to streams by type
 * @param {string} mode - Confidence calculation mode: "loose" or "strict"
 * @returns {number} Confidence factor between 0 and 1 (inclusive)
 */
export function calculateBandwidthConfidence(downloadedBytes, bufferTarget, streamSet, mode) {
    let confidence = 1;

    const audioStreams = streamSet.getStreamsByType(MediaType.AUDIO);

    if (hasAudioStream(audioStreams)) {
        switch (mode) {
            case 'loose': {
                const segmentSize = audioStreams.track.trackInfo.playbackSegment;
                confidence = Math.min(
                    1,
                    downloadedBytes / Math.max(bufferTarget - segmentSize, segmentSize)
                );
                break;
            }
            default:
                confidence = Math.min(1, downloadedBytes / bufferTarget);
        }
    }

    return confidence;
}
