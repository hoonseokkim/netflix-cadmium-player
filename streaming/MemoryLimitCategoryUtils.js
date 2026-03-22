/**
 * @file MemoryLimitCategoryUtils - Memory limit category classification and stream info formatting
 * @module streaming/MemoryLimitCategoryUtils
 * @description Utility functions for classifying memory limit configuration keys
 * into categories ("global" or "static") and for formatting IStreamable debug
 * information strings used in ASE diagnostics.
 *
 * @original Module_57141
 */

/**
 * Determines the memory limit category for audio/video-specific limit keys.
 *
 * @param {string} key - A memory limit configuration key
 * @returns {string|false} "global" for global limits, "static" for static limits, or false
 */
function getMediaSpecificMemoryCategory(key) {
    if (key === 'globalAudioMemoryLimit' || key === 'globalVideoMemoryLimit') {
        return 'global';
    }
    if (key === 'staticAudioMemoryLimit' || key === 'staticVideoMemoryLimit') {
        return 'static';
    }
    return false;
}

/**
 * Determines the memory limit category for any memory limit key,
 * including the combined (non-media-specific) limit keys.
 *
 * @param {string} key - A memory limit configuration key
 * @returns {string|false} "global", "static", or false if not a recognized memory limit key
 */
export function getMemoryLimitCategory(key) {
    if (key === 'globalMemoryLimit') {
        return 'global';
    }
    if (key === 'staticMemoryLimit') {
        return 'static';
    }
    return getMediaSpecificMemoryCategory(key);
}

export { getMediaSpecificMemoryCategory };

/**
 * Formats an IStreamable object into a human-readable debug string
 * showing its identifier, media type, group, profile, playback state, etc.
 *
 * @param {Object} streamable - An IStreamable-compatible object
 * @param {string} streamable.identifier - Unique stream identifier
 * @param {string} streamable.mediaType - Media type (audio/video/text)
 * @param {string} streamable.groupId - Stream group ID
 * @param {*} streamable.xh - Profile info (serialized as JSON)
 * @param {*} streamable.nx - Sub-profile info
 * @param {*} streamable.WI - Previous sub-profile info
 * @param {string} streamable.playgraphState - Current playgraph state
 * @param {boolean} streamable.gv - Whether the path is complete
 * @param {number} streamable.streamingPlayerMs - Streaming position in ms
 * @param {*} streamable.vp - Current value/position
 * @returns {string} Formatted debug string
 */
export function formatStreamableInfo(streamable) {
    return (
        `IStreamable: ${streamable.identifier} [${streamable.mediaType}] ${streamable.groupId} ` +
        `p:${JSON.stringify(streamable.xh)} sp:${streamable.nx} ` +
        `pssp:${streamable.WI} ` +
        `state:${streamable.playgraphState} path-complete:${streamable.gv} ` +
        `streaming:${streamable.streamingPlayerMs} current:${streamable.vp}`
    );
}
