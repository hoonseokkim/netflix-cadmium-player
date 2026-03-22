/**
 * Netflix Cadmium Player - Live Request Pacing Calculator
 * Deobfuscated from Module_75100
 *
 * Calculates pacing delays for live stream segment requests.
 * Ensures requests for live content are properly spaced based on
 * fragment duration and configured pacing multipliers to avoid
 * overwhelming the CDN or requesting segments too early.
 */

/**
 * Calculates the pacing delay for a live stream request.
 *
 * @param {Object} params
 * @param {Object} params.liveContext - Live playback context with timing info
 * @param {Object} params.maxSegmentDuration - Maximum allowed segment duration
 * @param {Object} params.fragmentIndex - Fragment index for timescale conversions
 * @param {Object} params.dataJson - Fragment data
 * @param {Object} params.config - Configuration with liveLikeRequestPacingMultiplier
 * @returns {Object|undefined} Object with pacingDelay (bpc) and segmentDuration (juc), or undefined if no track metadata
 */
export function calculateLiveRequestPacing(params) {
    const liveContext = params.liveContext;
    const maxSegmentDuration = params.maxSegmentDuration;
    const fragmentIndex = params.fragmentIndex;
    const dataJson = params.dataJson;
    const config = params.config;

    if (liveContext.trackMeta === undefined) {
        return undefined;
    }

    const timescaleOffset = fragmentIndex.getTimescaleOffset(dataJson) - liveContext.presentationStartTime.playbackSegment;
    const segmentDuration = fragmentIndex.getSegmentDuration(dataJson);

    return {
        pacingDelay: liveContext.timestamp.playbackSegment +
            (timescaleOffset + Math.min(segmentDuration, maxSegmentDuration.playbackSegment)) /
            config.liveLikeRequestPacingMultiplier -
            liveContext.trackMeta.playbackSegment,
        segmentDuration: segmentDuration
    };
}
