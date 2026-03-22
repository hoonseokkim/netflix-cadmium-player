/**
 * @module PlaybackState
 * @description Enumeration of playback states for the streaming pipeline.
 * Tracks whether the player is stopped, buffering, rebuffering, streaming,
 * or performing a track switch.
 *
 * @original Module 11528
 */

/**
 * Playback state enum values.
 * @enum {number}
 */
export const PlaybackState = {
    /** Player is stopped */
    STOPPED: 0,

    /** Initial buffering before playback starts */
    BUFFERING: 1,

    /** Rebuffering during playback (stall) */
    REBUFFERING: 2,

    /** Actively streaming/playing content */
    STREAMING: 3,

    /** Performing a track switch (audio/video) */
    TRACK_SWITCH: 4
};

/**
 * Determines whether the given playback state represents a buffering condition.
 * Returns true for BUFFERING, REBUFFERING, and TRACK_SWITCH states.
 *
 * @param {number} state - A PlaybackState value
 * @returns {boolean} True if the state involves buffering
 */
export function isBufferingState(state) {
    return (
        state === PlaybackState.BUFFERING ||
        state === PlaybackState.REBUFFERING ||
        state === PlaybackState.TRACK_SWITCH
    );
}
