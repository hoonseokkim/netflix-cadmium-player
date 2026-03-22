/**
 * Netflix Cadmium Player - Logblob Builder
 *
 * Constructs logblob telemetry events for all playback lifecycle phases:
 * startplay, midplay, endplay, repos, resumeplay, chgstrm, statechanged, etc.
 * Gathers player state, track info, buffer status, timing data, and formats
 * them for server-side analytics.
 *
 * @module LogblobBuilder
 * @original Module_97444
 */

// import { ReportEventTypes } from '../telemetry/ReportEventTypes.js'; // webpack 18169
// import { formatInteger, formatSeconds, assignProperties } from '../utils/ObjectUtils.js'; // webpack 3887
// import { getPageLoadTime, findMaxValue } from '../utils/DomUtils.js'; // webpack 52569
// import { errorCodes } from '../core/ErrorCodes.js'; // webpack 36129
// import { PlayerEvents, PresentingState } from '../player/PlayerEvents.js'; // webpack 85001
// import { MILLISECONDS } from '../utils/ConfigUtils.js'; // webpack 5021

/**
 * @enum {number} Bitflags for logblob field inclusion
 */
const LogblobFields = {
    /** Include media offset fields */
    MOFF: 1,
    /** Include presented stream info */
    PRESENTED_STREAMS: 2,
    /** Include screen/display info */
    SCREEN: 4,
    /** Include fatal error details */
    FATAL_ERROR: 8,
    /** Include browser info */
    BROWSER_INFO: 16
};

/**
 * Builds logblob telemetry events for all playback milestones.
 * Each event type gathers relevant player state and formats it for analytics.
 */
export class LogblobBuilder {
    /**
     * @param {Object} logger - Logger factory
     * @param {Object} logblobFormatter - Formats raw fields into logblob payloads
     * @param {Object} mediaFactory - Media transport for sending logblobs
     * @param {Object} timeProvider - Current time provider
     * @param {Object} fieldProvider - Additional field providers (download info, etc.)
     * @param {Object} playerState - Current player state reference
     */
    constructor(logger, logblobFormatter, mediaFactory, timeProvider, fieldProvider, playerState) {
        this._logblobFormatter = logblobFormatter;
        this._mediaFactory = mediaFactory;
        this._timeProvider = timeProvider;
        this._fieldProvider = fieldProvider;

        /** @type {number} Count of interruption play events */
        this._interruptionCount = 0;

        /** @type {number} Count of reposition events */
        this._repositionCount = 0;

        /** @type {number} Midplay sequence counter */
        this._midplaySequence = 0;

        /** @type {boolean} Current pause state for state change tracking */
        this._isPaused = false;

        /** Midplay event - periodic playback health report */
        this.onMidplay = () => {
            const data = this._buildCommonFields();
            data.prstate = this._getPresentingState();
            data.paustate = playerState.isPaused();
            data.midplayseq = this._midplaySequence++;
            fieldProvider.addSessionFields(data);
            this._sendLogblob(ReportEventTypes.midPlay, undefined,
                LogblobFields.MOFF | LogblobFields.SCREEN, data);
        };

        /** Browser visibility change */
        this.onVisibilityChange = () => {
            this._sendLogblob(ReportEventTypes.visibilityChange, undefined,
                LogblobFields.MOFF | LogblobFields.BROWSER_INFO, {});
        };

        /** Text track switch started */
        this.onTextTrackSwitchStart = (event) => {
            this._textSwitchStartTime = this._getCurrentTimeMs();
            this._previousTextTrack = event.previousTrack;
        };

        /** Pause state changed */
        this.onPauseStateChanged = (newPaused) => {
            if (newPaused !== this._isPaused) {
                this._onStateTransition(this._isPaused, newPaused);
                this._isPaused = newPaused;
            }
        };

        /** Playback speed changed */
        this.onPlaybackSpeedChanged = (event) => {
            this._sendLogblob(ReportEventTypes.speedChange, undefined, LogblobFields.MOFF, {
                speedold: Math.floor(1000 * event.oldValue),
                speed: Math.floor(1000 * event.newValue)
            });
        };

        /** Text track switch completed */
        this.onTextTrackSwitchComplete = (event) => {
            const tracks = playerState.subscriberList;
            const textTrack = tracks.tracks.textTrackSelection;
            if (event.newValue || (textTrack?.isActive() && !textTrack?.isDisabled())) {
                const newTrackInfo = this._formatTextTrack(event.newValue ?? textTrack);
                const oldTrackInfo = this._formatTextTrack(this._previousTextTrack);
                const data = {
                    switchdelay: formatInteger(this._getCurrentTimeMs() - this._textSwitchStartTime),
                    track: newTrackInfo,
                    oldtrack: oldTrackInfo
                };
                fieldProvider.addDownloadInfo(data,
                    tracks.targetBuffer.value?.stream,
                    tracks.currentAudioStream.value?.stream);
                this._sendLogblob(ReportEventTypes.textTrackSwitch, undefined, LogblobFields.MOFF, data);
            }
        };

        /** Playback aborted */
        this.onPlaybackAborted = (waitTime, reason) => {
            const tracks = playerState.subscriberList;
            const data = {
                waittime: formatInteger(waitTime),
                abortedevent: "resumeplay",
                resumeplayreason: reason
            };
            fieldProvider.addDownloadInfo(data, tracks.isStalled.value, tracks.playbackRate.value);
            this._sendLogblob(ReportEventTypes.playbackAborted, undefined,
                LogblobFields.MOFF | LogblobFields.BROWSER_INFO, data);
        };

        /** Resume play after rebuffer */
        this.onResumePlay = (playDelay, skipped, context) => {
            const data = {
                playdelay: formatInteger(playDelay),
                reason: context.reason,
                intrplayseq: this._interruptionCount - 1,
                skipped
            };
            if (context.reason === "repos") {
                data.prstate = playerState.isPlaying.value === true ? "playing" : "paused";
                if (context.streamState === "FRAGMENTS_MISSING") {
                    data.repos_reason = "missing_segments";
                }
            }
            this._sendLogblob(ReportEventTypes.resumePlay, undefined,
                LogblobFields.MOFF | LogblobFields.PRESENTED_STREAMS, data);
        };

        /** Audio track switch completed */
        this.onAudioTrackSwitchComplete = () => {
            const newTrack = this._formatAudioTrack(
                playerState.subscriberList.tracks.audioTrackSelection,
                playerState.subscriberList.playbackRate.value.downloadableStreamId
            );
            const oldTrack = this._formatAudioTrack(
                this._previousAudioTrack,
                this._previousAudioDlId
            );
            this._sendLogblob(ReportEventTypes.audioTrackSwitch, undefined, LogblobFields.MOFF, {
                switchdelay: formatInteger(this._getCurrentTimeMs() - this._audioSwitchStartTime),
                track: newTrack,
                oldtrack: oldTrack
            });
        };

        /** Audio track switch started */
        this.onAudioTrackSwitchStart = (event) => {
            this._audioSwitchStartTime = this._getCurrentTimeMs();
            this._previousAudioTrack = event.track;
        };

        /** Start play - first frame rendered */
        this.onStartPlay = (event) => {
            const sub = event.subscriberList;
            const data = {
                playdelaysdk: formatInteger(playerState.getPlayDelaySdk()),
                applicationPlaydelay: formatInteger(playerState.getApplicationPlayDelay()),
                playdelay: formatInteger(playerState.getTotalPlayDelay()),
                trackid: sub.TrackingId,
                bookmark: formatInteger(sub.bookmark || 0),
                pbnum: sub.index
            };

            // Audio track info
            data.audiotrackinfo = this._formatAudioTrack(
                playerState.subscriberList.tracks.audioTrackSelection,
                playerState.subscriberList.currentAudioStream.value?.stream?.downloadableStreamId
            );

            // Video track info
            const videoTrack = playerState.subscriberList.tracks.videoTrack;
            const videoDlId = playerState.subscriberList.targetBuffer.value?.stream?.downloadableStreamId;
            data.videotrackinfo = this._formatVideoTrack(videoTrack, videoDlId);
            data.texttrackinfo = this._formatTextTrack(sub.tracks.textTrackSelection);

            if (playerState.blocked) data.blocked = playerState.blocked;
            data.initvbitrate = playerState.initBitrate;

            fieldProvider.addBrowserFields(data);
            fieldProvider.addExtraFields(data);
            data.esnSource = globalThis._cad_global?.device?.esnSource;
            this._addMaxBitrateFields(data, sub);
            data.pdltime = getPageLoadTime();
            assignProperties(data, sub.playDelayTimestamps, { prefix: "sm_" });
            data.ttTrackFields = sub.tracks.textTrackSelection?.playbackInfo;
            data.itsxheaac = MediaSource.isTypeSupported('audio/mp4; codecs="mp4a.40.42"');

            fieldProvider.addAudioTrackInfo(data, true, sub.tracks.audioTrackSelection, sub);
            fieldProvider.addVideoTrackInfo(data, true, sub.tracks.videoTrack, sub);
            data.packageId = sub.manifestRef?.manifestContent.qcPackageId;
            fieldProvider.addSessionFields(data);
            fieldProvider.addTimingFields(data, sub);
            this._addCacheFields(data);

            this._sendLogblob(ReportEventTypes.startPlay, event.lastError,
                LogblobFields.MOFF | LogblobFields.PRESENTED_STREAMS | LogblobFields.SCREEN |
                LogblobFields.FATAL_ERROR | LogblobFields.BROWSER_INFO, data);
        };

        /** Stream quality change */
        this.onStreamChange = (oldStream, newStream, mediaOffset, bandwidth) => {
            this._sendLogblob(ReportEventTypes.changeStream, undefined, 0, {
                moff: formatSeconds(mediaOffset),
                moffms: formatInteger(mediaOffset),
                vbitrate: newStream.bitrate,
                vbitrateold: oldStream.bitrate,
                vdlid: newStream.downloadableStreamId,
                vdlidold: oldStream.downloadableStreamId,
                vheight: newStream.height,
                vheightold: oldStream.height,
                vwidth: newStream.width,
                vwidthold: oldStream.width,
                bw: bandwidth
            });
        };

        /** Reposition/seek */
        this.onReposition = (oldOffset, audioStream, videoStream) => {
            const data = {
                moffold: formatSeconds(oldOffset),
                reposseq: this._repositionCount++,
                prstate: this._getPresentingState(),
                paustate: playerState.isPaused()
            };
            fieldProvider.addDownloadInfo(data, videoStream?.stream, audioStream?.stream);
            this._sendLogblob(ReportEventTypes.reposition, undefined, LogblobFields.MOFF, data);
        };

        /** End play */
        this.onEndPlay = () => {
            const sub = playerState.subscriberList;
            const lastError = playerState.lastError;
            const data = this._buildCommonFields();
            data.paustate = !playerState.isCurrentlyPlaying();
            data.muted = playerState.isMuted();
            data.endreason = lastError ? "error" : playerState.hasEnded() ? "ended" : "stopped";
            fieldProvider.addAudioTrackInfo(data, false, sub.tracks.audioTrackSelection, sub);
            fieldProvider.addVideoTrackInfo(data, false, sub.tracks.videoTrack, sub);
            fieldProvider.addSessionFields(data);
            this._addCacheFields(data);
            this._sendLogblob(ReportEventTypes.endPlay, lastError,
                LogblobFields.MOFF | LogblobFields.PRESENTED_STREAMS | LogblobFields.SCREEN |
                LogblobFields.FATAL_ERROR | LogblobFields.BROWSER_INFO, data);
        };

        /** Render stream switch */
        this.onRenderStreamSwitch = (oldStream, newStream, mediaOffset) => {
            const audioObs = playerState.subscriberList.currentAudioStream;
            const data = {
                moff: formatSeconds(mediaOffset),
                moffms: formatInteger(mediaOffset),
                vdlidold: oldStream.downloadableStreamId,
                vbitrateold: oldStream.bitrate
            };
            fieldProvider.addDownloadInfo(data, newStream, audioObs.value?.stream);
            this._sendLogblob(ReportEventTypes.renderStreamSwitch, undefined, 0, data);
        };

        this._logger = logger.createSubLogger("LogblobBuilderImpl");
        this.playerState = playerState;
    }

    // --- Private helpers ---

    /** @returns {number} Current time in milliseconds */
    _getCurrentTimeMs() {
        return this._timeProvider.getCurrentTime().toUnit(MILLISECONDS);
    }

    /** @returns {number} Media offset from start */
    _getMediaOffset() {
        return this._getCurrentTimeMs() -
            this.playerState.subscriberList.timeOffset.toUnit(MILLISECONDS);
    }

    /**
     * Formats audio track info
     * @param {Object} track - Audio track
     * @param {string} downloadableId - Downloadable stream ID
     * @returns {Object}
     */
    _formatAudioTrack(track, downloadableId) {
        return track ? {
            trackId: track.trackId,
            bcp47: track.languageCode,
            downloadableId,
            rank: track.rank,
            chan: track.channels
        } : {};
    }

    /**
     * Formats video track info
     * @param {Object} track - Video track
     * @param {string} downloadableId - Downloadable stream ID
     * @returns {Object}
     */
    _formatVideoTrack(track, downloadableId) {
        return track ? {
            id: track.trackId,
            downloadableId,
            rank: track.rank
        } : {};
    }

    /**
     * Formats text track info
     * @param {Object} track - Text track
     * @returns {Object}
     */
    _formatTextTrack(track) {
        return track ? {
            trackId: track.trackId,
            bcp47: track.languageCode,
            downloadableId: track.downloadableStreamId,
            rank: track.rank,
            isImageBased: track.isImageBased,
            profile: track.profile
        } : {};
    }

    /** Adds max bitrate/resolution fields from video streams */
    _addMaxBitrateFields(data, subscriberList) {
        const streams = subscriberList.tracks.videoTrack?.streams;
        if (streams) {
            data.maxbitrate = findMaxValue(streams.map(s => s.bitrate));
            data.maxresheight = findMaxValue(streams.map(s => s.height));
        }
    }

    /** Adds cache status fields */
    _addCacheFields(data) {
        data.cachedManifest = "notcached";
        data.cachedLicense = "notcached";
        data.usedldl = "false";
    }

    /** Builds common fields for midplay/endplay */
    _buildCommonFields() {
        const sub = this.playerState.subscriberList;
        const metrics = sub.playDelayMetrics;
        const data = {
            totaltime: formatSeconds(metrics.getTotalTime()),
            totalcontenttime: formatSeconds(metrics.totalContentTime()),
            reposcount: this._repositionCount,
            intrplaycount: this._interruptionCount
        };
        data.playqualvideo = JSON.stringify({ numskip: 0, numlowqual: 0 });

        const videoInfo = sub.isStalled.value;
        if (videoInfo) data.videofr = videoInfo.framerate.toFixed(3);

        const abrDelay = metrics.getAbrDelay();
        if (abrDelay) data.abrdel = abrDelay;

        const vmaf = metrics.hasVmaf() && metrics.getVmaf();
        if (vmaf) data.tw_vmaf = vmaf;

        const extraMetrics = metrics.getExtraMetrics();
        if (extraMetrics) assignProperties(data, extraMetrics);

        data.rbfrs = this._interruptionCount;
        this._addMaxBitrateFields(data, sub);
        return data;
    }

    /** Gets the current presenting state as a string */
    _getPresentingState() {
        const state = this.playerState.presentingState.value;
        if (state === PresentingState.PLAYING) return "playing";
        if (state === PresentingState.PAUSED) return "paused";
        if (state === PresentingState.ENDED) return "ended";
        return "waiting";
    }

    /** Handles state transitions for statechanged logblob */
    _onStateTransition(wasPaused, nowPaused) {
        const sub = this.playerState.subscriberList;
        const data = {
            newstate: nowPaused ? "Paused" : "Playing",
            oldstate: wasPaused ? "Paused" : "Playing"
        };
        this._fieldProvider.addDownloadInfo(data,
            sub.targetBuffer.value?.stream,
            sub.currentAudioStream.value?.stream);
        this._sendLogblob(ReportEventTypes.stateChanged, undefined, LogblobFields.MOFF, data);
    }

    /**
     * Sends a logblob event to the analytics backend
     * @param {string} eventType - Event type identifier
     * @param {Object} [error] - Error object if applicable
     * @param {number} fieldFlags - Bitflags for field groups
     * @param {Object} data - Event-specific data
     */
    _sendLogblob(eventType, error, fieldFlags, data) {
        const self = this;
        let level;

        if (error && errorCodes.isInfoLevel(
            error?.errorCode, error?.errorcode, this._getMediaOffset(), undefined
        )) {
            level = "info";
        }

        const sub = this.playerState.subscriberList;
        this._applyFieldGroups(data, error, fieldFlags);

        const severity = level || (error ? "error" : "info");
        const payload = this._logblobFormatter.format(eventType, severity, data, sub);
        this._mediaFactory.logblob(payload);

        if (severity === "error" || eventType === ReportEventTypes.endPlay) {
            this._mediaFactory.flushLogblobs(false).catch(() => {
                self._logger.debug("Failed to flush the logblobs");
            });
        }
    }

    /** Applies field groups based on bitflags */
    _applyFieldGroups(data, error, flags) {
        const sub = this.playerState.subscriberList;
        this._fieldProvider.addCommonFields(data, sub);
        if (flags & LogblobFields.MOFF) {
            this._fieldProvider.addMediaOffsetFields(data, sub, false);
        }
        if (flags & LogblobFields.PRESENTED_STREAMS) {
            this._fieldProvider.addPresentedStreamFields(data, sub);
        }
        if (flags & LogblobFields.SCREEN) {
            this._fieldProvider.addScreenFields(data, this.playerState.getConfiguration());
        }
        if (error && (flags & LogblobFields.FATAL_ERROR)) {
            this._fieldProvider.addErrorFields(data, sub, error);
        }
        if (flags & LogblobFields.BROWSER_INFO) {
            this._fieldProvider.addBrowserFields(data);
        }
    }
}
