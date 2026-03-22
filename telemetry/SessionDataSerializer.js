/**
 * @module SessionDataSerializer
 * @description Serializes and deserializes playback session data for telemetry events.
 *              Handles encoding/decoding of session context including play times, track IDs,
 *              CDN info, buffered segments, program maps, and streaming metadata.
 *              Used for logblob generation and session persistence.
 *              Original: Module_23048
 */

import { __decorate, __param } from 'tslib'; // Module 22970
import { injectable, inject as injectDecorator } from 'inversify'; // Module 22674
import { PlayerCoreToken } from '../core/PlayerCoreToken'; // Module 30869
import { MILLISECONDS } from '../timing/TimeUnit'; // Module 5021
import { ConfigToken } from '../core/ConfigToken'; // Module 4203
import { ClockToken } from '../timing/ClockToken'; // Module 81918

// --- Inner serializer classes ---

/**
 * Serializes/deserializes individual buffered segment entries.
 */
class BufferedSegmentCodec {
    encode(segment) {
        return {
            downloadableId: segment.downloadableStreamId,
            duration: segment.duration,
        };
    }

    decode(data) {
        return {
            ob: data.downloadableId,
            duration: data.duration,
        };
    }
}

/**
 * Serializes/deserializes per-program duration breakdowns.
 */
class ProgramDurationCodec {
    encode(programData) {
        return {
            totalDuration: programData.kq,
            totalAdDuration: programData.totalAdDuration,
            totalOtherDuration: programData.totalOtherDuration,
        };
    }

    decode(data) {
        return {
            kq: data.totalDuration,
            totalAdDuration: data.totalAdDuration,
            totalOtherDuration: data.totalOtherDuration,
        };
    }
}

/**
 * Serializes/deserializes play time metrics across content, ads, and programs.
 */
class PlayTimesCodec {
    encode(playTimes) {
        const segmentCodec = new BufferedSegmentCodec();
        const programCodec = new ProgramDurationCodec();

        return {
            total: playTimes.total,
            totalContentTime: playTimes.totalContentTime,
            totalAdDuration: playTimes.totalAdDuration,
            totalCombinedDuration: playTimes.totalCombinedDuration,
            totalOtherDuration: playTimes.totalOtherDuration,
            totalStartSlateDuration: playTimes.totalStartSlateDuration,
            totalLiveEdgeDuration: playTimes.totalLiveEdgeDuration,
            totalLiveEdgeAdDuration: playTimes.totalLiveEdgeAdDuration,
            audioBufferedSegments: playTimes.audioBufferedSegments.map(segmentCodec.encode),
            videoBufferedSegments: playTimes.videoBufferedSegments.map(segmentCodec.encode),
            TEXT_MEDIA_TYPE: playTimes.TEXT_MEDIA_TYPE.map(segmentCodec.encode),
            programs: Object.entries(playTimes.programMap ?? {}).reduce((acc, [key, value]) => {
                acc[key] = programCodec.encode(value);
                return acc;
            }, {}),
        };
    }

    decode(data) {
        const segmentCodec = new BufferedSegmentCodec();
        const programCodec = new ProgramDurationCodec();

        return {
            total: data.total,
            totalContentTime: data.totalContentTime ?? data.total,
            totalAdDuration: data.totalAdDuration,
            totalCombinedDuration: data.totalCombinedDuration,
            totalOtherDuration: data.totalOtherDuration,
            totalStartSlateDuration: data.totalStartSlateDuration,
            totalLiveEdgeDuration: data.totalLiveEdgeDuration,
            totalLiveEdgeAdDuration: data.totalLiveEdgeAdDuration,
            audioBufferedSegments: data.audioBufferedSegments.map(segmentCodec.decode),
            videoBufferedSegments: data.videoBufferedSegments.map(segmentCodec.decode),
            TEXT_MEDIA_TYPE: data.TEXT_MEDIA_TYPE.map(segmentCodec.decode),
            programMap: Object.entries(data.programs ?? {}).reduce((acc, [key, value]) => {
                acc[key] = programCodec.decode(value);
                return acc;
            }, {}),
        };
    }
}

/**
 * Serializes/deserializes CDN downloadable info per media type.
 */
class CdnInfoCodec {
    encode(cdnInfo) {
        const mediaCodec = new CdnMediaCodec();
        return {
            audio: mediaCodec.encode(cdnInfo.audioBufferedSegments),
            videoBufferedSegments: mediaCodec.encode(cdnInfo.videoBufferedSegments),
            timedtext: mediaCodec.encode(cdnInfo.timedTextCdn),
            mediaevents: mediaCodec.encode(cdnInfo.mediaEventsCdn),
        };
    }

    decode(data) {
        const mediaCodec = new CdnMediaCodec();
        return {
            audio: mediaCodec.decode(data.audioBufferedSegments),
            videoBufferedSegments: mediaCodec.decode(data.videoBufferedSegments),
            timedTextCdn: mediaCodec.decode(data.timedtext),
            mediaEventsCdn: mediaCodec.decode(data.mediaevents),
        };
    }
}

/**
 * Serializes/deserializes per-media-type CDN info.
 */
class CdnMediaCodec {
    encode(cdnData) {
        return {
            streamingCdnId: cdnData.streamingCdnId,
            presentingCdnId: cdnData.pya,
        };
    }

    decode(data) {
        return {
            streamingCdnId: data.streamingCdnId,
            pya: data.presentingCdnId,
        };
    }
}

/**
 * Serializes/deserializes full session context data for telemetry.
 */
class SessionContextCodec {
    encode(session) {
        return {
            streamingType: session.manifestType,
            toString: session.toString,
            xid: session.sourceTransactionId,
            movieId: session.R,
            programId: session.programId,
            position: session.position,
            clientTime: session.clientTime,
            sessionStartTime: session.defaultTimeOffset,
            videoTrackId: session.trackIdentifier,
            audioTrackId: session.ew,
            timedTextTrackId: session.timedTextTrackId,
            mediaId: session.mediaId,
            playTimes: new PlayTimesCodec().encode(session.XB),
            trackId: session.trackId,
            drmSessionId: session.drmSessionId,
            appId: session.appId,
            sessionParams: session.sessionParams,
            profileId: session.o3,
            cdnDownloadableInfos: session.C$ ? new CdnInfoCodec().encode(session.C$) : undefined,
        };
    }

    decode(data) {
        return {
            rf: data.streamingType,
            toString: data.toString,
            sourceTransactionId: data.xid,
            R: data.movieId,
            programId: data.programId,
            position: data.position,
            clientTime: data.clientTime,
            defaultTimeOffset: data.sessionStartTime,
            trackIdentifier: data.videoTrackId,
            ew: data.audioTrackId,
            timedTextTrackId: data.timedTextTrackId,
            mediaId: data.mediaId,
            XB: new PlayTimesCodec().decode(data.playTimes),
            trackId: data.trackId,
            drmSessionId: data.drmSessionId,
            appId: data.appId,
            sessionParams: data.sessionParams,
            o3: data.profileId,
            C$: data.cdnDownloadableInfos ? new CdnInfoCodec().decode(data.cdnDownloadableInfos) : undefined,
        };
    }
}

export { SessionContextCodec };

/**
 * Injectable factory for creating serialized session data for telemetry events.
 * Gathers data from the active playback session including position, tracks,
 * play times, CDN info, and DRM session identifiers.
 */
class SessionDataSerializer {
    /**
     * @param {Object} playerCore - Player core providing clock access
     * @param {Function} configProvider - Provides session/app configuration
     * @param {Object} clock - Clock for session timing
     * @param {string} profile - Current user profile ID
     */
    constructor(playerCore, configProvider, clock, profile) {
        /** @type {Object} Player core */
        this.playerCore = playerCore;

        /** @type {Function} Configuration provider */
        this.configProvider = configProvider;

        /** @type {Object} Session clock */
        this.clock = clock;

        /** @type {string} Profile identifier */
        this.profile = profile;
    }

    /**
     * Creates a serialized session data snapshot from the current playback state.
     * @param {Object} playbackState - Current playback state with manifest, tracks, timing
     * @returns {Object} Serialized session data for telemetry
     */
    create(playbackState) {
        const sessionParams = {
            ...(playbackState.sessionContext.sessionParams ?? {}),
            uiVersion: this.configProvider().tw.uiVersion,
        };

        const position = playbackState.liveController.isLive
            ? playbackState.liveController.getUIAdjustedCurrentContentPts()
            : playbackState.seekTargetTime ?? 0;

        const streamingSession = playbackState.streamingSession?.getSessionSnapshot();

        return {
            href: playbackState.manifestRef?.links
                ? playbackState.manifestRef.links.A0("events").toString
                : "",
            manifestType: playbackState.manifestRef?.manifestContent.manifestType ?? "VOD",
            sourceTransactionId: playbackState.sourceTransactionId.toString(),
            R: playbackState.R,
            programId: playbackState.programId.value,
            position: Math.floor(position),
            clientTime: this.playerCore.kJ.toUnit(MILLISECONDS),
            defaultTimeOffset: playbackState.kI ? playbackState.kI.toUnit(MILLISECONDS) : -1,
            trackIdentifier: playbackState.tracks.videoTrack?.trackId,
            ew: playbackState.tracks.audioTrackSelection?.trackId,
            timedTextTrackId: playbackState.tracks.textTrackSelection?.trackId,
            mediaId: undefined,
            XB: this._buildPlayTimes(playbackState),
            trackId: playbackState.TrackingId !== undefined ? playbackState.TrackingId.toString() : "",
            drmSessionId: this.configProvider().drmSessionId || this.clock.id,
            appId: this.configProvider().appId || this.clock.id,
            sessionParams,
            o3: this.profile,
            C$: streamingSession?.C$,
        };
    }

    /**
     * Decodes serialized session data back to internal format.
     * @param {Object} data - Serialized session data
     * @returns {Object} Deserialized session data
     */
    decode(data) {
        return new SessionContextCodec().decode(data);
    }

    /**
     * Decodes an array of buffered segment entries.
     * @param {Array<Object>} segments - Serialized segment entries
     * @returns {Array<Object>} Deserialized segment entries
     */
    decodeSegments(segments) {
        return segments.map((segment) => ({
            ob: segment.downloadableId,
            duration: segment.duration,
        }));
    }

    /**
     * Builds play time metrics from playback state.
     * @private
     * @param {Object} playbackState - Current playback state
     * @returns {Object} Play time metrics
     */
    _buildPlayTimes(playbackState) {
        const metrics = playbackState.playDelayMetrics;
        if (!metrics) {
            return {
                total: 0,
                totalContentTime: 0,
                totalAdDuration: 0,
                totalCombinedDuration: 0,
                totalOtherDuration: 0,
                totalLiveEdgeDuration: 0,
                totalLiveEdgeAdDuration: 0,
                totalStartSlateDuration: 0,
                videoBufferedSegments: [],
                audioBufferedSegments: [],
                TEXT_MEDIA_TYPE: [],
                programMap: {},
            };
        }

        const times = metrics.getPlayTimes();
        return {
            total: times.total,
            totalContentTime: times.totalContentTime,
            totalAdDuration: times.totalAdDuration,
            totalOtherDuration: times.totalOtherDuration,
            totalCombinedDuration: times.totalCombinedDuration,
            totalLiveEdgeDuration: times.totalLiveEdgeDuration,
            totalLiveEdgeAdDuration: times.totalLiveEdgeAdDuration,
            totalStartSlateDuration: times.totalStartSlateDuration,
            audioBufferedSegments: this.decodeSegments(times.audioBufferedSegments),
            videoBufferedSegments: this.decodeSegments(times.videoBufferedSegments),
            TEXT_MEDIA_TYPE: this.decodeSegments(times.timedtext),
            programMap: this._buildProgramMap(times.programs),
        };
    }

    /**
     * Builds the program duration map from raw program data.
     * @private
     * @param {Object} programs - Raw program duration data
     * @returns {Object} Program map with duration breakdowns
     */
    _buildProgramMap(programs) {
        return Object.entries(programs).reduce((acc, [key, value]) => {
            acc[key] = {
                kq: value.totalDuration,
                totalAdDuration: value.totalAdDuration,
                totalOtherDuration: value.totalOtherDuration,
            };
            return acc;
        }, {});
    }
}

export { SessionDataSerializer };
export default SessionDataSerializer;
