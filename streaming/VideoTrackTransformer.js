/**
 * @file VideoTrackTransformer.js
 * @description Transforms raw video track data from the manifest into the internal
 *   track format used by the player, filtering out tracks without streams.
 * @module streaming/VideoTrackTransformer
 * @original Module_44858 (ynb)
 */

import { partitionBy } from '../utils/CollectionUtils.js';
import { BaseTrackTransformer } from '../streaming/BaseTrackTransformer.js'; // Module 28518 (E7)
import { TrackType } from '../types/MediaTypes.js'; // Module 51344 (mj)
import { LANGUAGE_MAP, FRAGMENT_VALIDATOR_DEFAULTS } from '../types/LanguageMap.js'; // Module 35128

/**
 * Transforms video tracks from manifest data into the player's internal representation.
 * Extends BaseTrackTransformer with video-specific logic for handling streams,
 * DRM headers, and language mapping.
 *
 * @extends BaseTrackTransformer
 */
export class VideoTrackTransformer extends BaseTrackTransformer {
    /**
     * Transforms raw video tracks into the internal video track format.
     * Filters out tracks that have no streams and logs warnings for missing ones.
     *
     * @param {Object} baseTrackInfo - Common track information (type, session, etc.)
     * @param {Array<Object>} rawTracks - Raw video tracks from the manifest
     * @returns {Array<Object>} Transformed video tracks with streams, language, and DRM info
     * @throws {Error} If no valid video tracks remain after filtering
     */
    transformVideoTracks(baseTrackInfo, rawTracks) {
        const [validTracks, invalidTracks] = Array.from(
            partitionBy((track) => track.streams && track.streams.length > 0, rawTracks)
        );

        // Log warnings for tracks missing streams
        invalidTracks.forEach((track) => {
            this.log.RETRY('Video track is missing streams', {
                trackId: track.ff
            });
        });

        const transformedTracks = validTracks.map((rawTrack) => {
            const rawLanguage = rawTrack.language;

            const track = {
                ...baseTrackInfo,
                type: TrackType.videoBufferedSegments,
                trackId: rawTrack.ff,
                language: LANGUAGE_MAP[rawLanguage.toLowerCase()] || FRAGMENT_VALIDATOR_DEFAULTS.FX,
                rawTrackType: rawLanguage,
                streams: [],
                playbackInfo: {},
                prkDrmHeaders: rawTrack.prkDrmHeaders,
                rank: rawTrack.rank ?? -1,
                isMissing: rawTrack.isMissing ?? true
            };

            track.streams = this.there(rawTrack.streams, track);

            this.log.pauseTrace('Transformed video track', {
                StreamCount: track.streams.length
            });

            return track;
        });

        if (!transformedTracks.length) {
            throw Error('No valid video tracks');
        }

        this.log.pauseTrace('Transformed video tracks', {
            Count: transformedTracks.length
        });

        return transformedTracks;
    }

    /**
     * Extracts DRM header IDs from video tracks, preferring per-track (PRK) DRM headers
     * over track-level DRM headers.
     *
     * @param {Array<Object>} tracks - Array of video tracks
     * @returns {Array<string>} Array of DRM header IDs
     */
    extractDrmHeaderIds(tracks) {
        const prkHeaders = tracks
            .map((track) => track.prkDrmHeaders)
            .filter(Boolean);

        const flatPrkIds = [].concat(...prkHeaders).map((header) => header.la);

        const trackDrmIds = tracks
            .map((track) => track.drmHeader)
            .filter(Boolean)
            .map((header) => header.la);

        return flatPrkIds.length > 0 ? flatPrkIds : trackDrmIds;
    }
}

export default VideoTrackTransformer;
