/**
 * Netflix Cadmium Player - Play Request Parameters Mapper
 * Deobfuscated from Module_81889
 *
 * Maps external play request parameters (from the Netflix UI) into
 * the internal parameter format used by the Cadmium player engine.
 * Handles all playback configuration including tracking, auth,
 * branching (interactive content), trick play, and language settings.
 */

/**
 * Mapper class for converting external play request parameters
 * to internal player representation.
 */
class PlayRequestParamsMapper {

    /**
     * Maps external play request parameters to internal format.
     *
     * @param {Object} [params={}] - External play request parameters
     * @param {string} params.trackingId - Content tracking identifier
     * @param {Object} params.authParams - Authentication parameters
     * @param {Object} params.sessionParams - Session-level parameters
     * @param {string} params.uiLabel - UI manifest format label
     * @param {Object} params.uxLabels - UX experiment labels
     * @param {boolean} params.disableTrackStickiness - Whether to disable track stickiness
     * @param {number} params.uiPlayStartTime - UI play start timestamp
     * @param {string} params.forceAudioTrackId - Force specific audio track
     * @param {string} params.forceTimedTextTrackId - Force specific timed text track
     * @param {boolean} params.isBranching - Whether this is an interactive branching seek
     * @param {Object} params.playbackState - Current playback state snapshot
     * @param {boolean} params.enableTrickPlay - Whether trick play is enabled
     * @param {number} params.heartbeatCooldown - Heartbeat cooldown period
     * @param {boolean} params.isPlaygraph - Whether this is a playgraph auto-play
     * @param {boolean} params.loadImmediately - Whether to load content immediately
     * @param {string} params.pin - User PIN for parental controls
     * @param {boolean} params.preciseSeeking - Enable precise seeking
     * @param {number} params.startPts - Start presentation timestamp
     * @param {number} params.endPts - End presentation timestamp
     * @param {number} params.logicalEnd - Logical end point
     * @param {boolean} params.renderTimedText - Whether to render timed text
     * @param {Object} params.extraManifestParams - Additional manifest parameters
     * @param {string} params.assetId - Asset identifier
     * @param {Array} params.audioLanguages - Preferred audio languages
     * @param {Array} params.textLanguages - Preferred text languages
     * @param {string} params.videoLanguage - Preferred video language
     * @param {string} params.videoAspectRatio - Preferred video aspect ratio
     * @param {string} params.packageId - QC package identifier
     * @param {Array} params.desiredDownloadables - Desired downloadable streams
     * @param {string} params.requestReference - Request reference identifier
     * @param {Array} params.additionalAudioAssets - Additional audio assets
     * @param {Array} params.additionalTextAssets - Additional text assets
     * @returns {Object} Internal play request parameters
     */
    mapParams(params) {
        params = params === undefined ? {} : params;

        return {
            trackingId: params.trackingId,
            authParams: params.authParams,
            sessionParams: params.sessionParams,
            manifestFormat: params.uiLabel,
            uxLabels: params.uxLabels,
            disableTrackStickiness: params.disableTrackStickiness,
            uiPlayStartTime: params.uiPlayStartTime,
            forceAudioTrackId: params.forceAudioTrackId,
            forceTimedTextTrackId: params.forceTimedTextTrackId,
            isSeeking: params.isBranching,
            playbackState: params.playbackState ? {
                currentTime: params.playbackState.currentTime,
                volume: params.playbackState.volume,
                muted: params.playbackState.muted,
                playbackRate: params.playbackState.playbackRate
            } : undefined,
            enableTrickPlay: params.enableTrickPlay,
            heartbeatCooldown: params.heartbeatCooldown,
            isAutoPlay: params.isPlaygraph,
            loadImmediately: params.loadImmediately || false,
            pin: params.pin,
            preciseSeeking: params.preciseSeeking,
            startPts: params.startPts,
            endPts: params.endPts,
            logicalEnd: params.logicalEnd,
            renderTimedText: params.renderTimedText,
            extraManifestParams: params.extraManifestParams,
            assetId: params.assetId,
            audioLanguages: params.audioLanguages,
            textLanguages: params.textLanguages,
            videoLanguage: params.videoLanguage,
            videoAspectRatio: params.videoAspectRatio,
            packageId: params.packageId,
            desiredDownloadables: params.desiredDownloadables,
            requestReference: params.requestReference,
            additionalAudioAssets: params.additionalAudioAssets,
            additionalTextAssets: params.additionalTextAssets
        };
    }
}

export { PlayRequestParamsMapper };
