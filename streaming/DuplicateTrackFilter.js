/**
 * Netflix Cadmium Player -- DuplicateTrackFilter
 *
 * A stream filter that removes duplicate/redundant streams during the
 * STREAMING playback state. When playback is actively streaming, this
 * filter returns an empty array (i.e., all streams are considered
 * duplicates and filtered out). In other states (e.g., BUFFERING), the
 * full stream list passes through unchanged.
 *
 * Used to prevent re-selection of already-active streams during steady-state
 * streaming.
 *
 * @module streaming/DuplicateTrackFilter
 * @original Module_47233
 * @dependencies
 *   Module 65161 - PlaybackState enum
 */

import { PlaybackState } from '../streaming/PlaybackState'; // Module 65161

/**
 * Filter that strips streams during the STREAMING state.
 */
class DuplicateTrackFilter {
    /**
     * Filter the stream list based on the current playback state.
     *
     * @param {Array<Object>} streams - The candidate stream list
     * @param {number} playbackState - Current playback state
     * @returns {Array<Object>} Filtered stream list (empty during STREAMING)
     */
    filterStreams(streams, playbackState) {
        if (playbackState === PlaybackState.STREAMING) {
            return [];
        }
        return streams;
    }
}

export { DuplicateTrackFilter };
