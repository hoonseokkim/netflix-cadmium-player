/**
 * Memory Limit Utilities
 *
 * Provides helper functions for identifying memory limit configuration types
 * (global vs static) and formatting IStreamable debug strings.
 *
 * @module streaming/MemoryLimitUtils
 * @original Module_57141
 */

/**
 * Determines the memory limit scope for audio/video-specific memory limit keys.
 *
 * @param {string} key - The memory limit configuration key
 * @returns {string|false} "global" for global limits, "static" for static limits, or false if unrecognized
 */
export function getAudioVideoMemoryLimitScope(key) {
    if (key === "globalAudioMemoryLimit" || key === "globalVideoMemoryLimit") {
        return "global";
    }
    if (key === "staticAudioMemoryLimit" || key === "staticVideoMemoryLimit") {
        return "static";
    }
    return false;
}

/**
 * Determines the memory limit scope for any memory limit key,
 * including combined (non-audio/video-specific) limits.
 *
 * @param {string} key - The memory limit configuration key
 * @returns {string|false} "global" for global limits, "static" for static limits, or false if unrecognized
 */
export function getMemoryLimitScope(key) {
    if (key === "globalMemoryLimit") {
        return "global";
    }
    if (key === "staticMemoryLimit") {
        return "static";
    }
    return getAudioVideoMemoryLimitScope(key);
}

/**
 * Formats an IStreamable object into a human-readable debug string.
 *
 * @param {Object} streamable - The streamable object to format
 * @param {string} streamable.identifier - Stream identifier
 * @param {string} streamable.mediaType - Media type (audio/video)
 * @param {string} streamable.groupId - Group identifier
 * @param {Object} streamable.xh - Profile info (serialized as JSON)
 * @param {*} streamable.nx - Sub-profile
 * @param {*} streamable.WI - Previous sub-profile
 * @param {string} streamable.playgraphState - Current playgraph state
 * @param {boolean} streamable.gv - Whether the path is complete
 * @param {number} streamable.streamingPlayerMs - Streaming position in ms
 * @param {*} streamable.vp - Current value/position
 * @returns {string} Formatted debug string
 */
export function formatStreamableDebugString(streamable) {
    return (
        `IStreamable: ${streamable.identifier} [${streamable.mediaType}] ${streamable.groupId} ` +
        `p:${JSON.stringify(streamable.xh)} sp:${streamable.nx} ` +
        `pssp:${streamable.WI} ` +
        `state:${streamable.playgraphState} path-complete:${streamable.gv} ` +
        `streaming:${streamable.streamingPlayerMs} current:${streamable.vp}`
    );
}
