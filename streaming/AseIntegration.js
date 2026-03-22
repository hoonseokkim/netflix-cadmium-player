/**
 * Netflix Cadmium Player - ASE Integration Implementation
 * Component: ASE_INTEGRATION
 *
 * The bridge between Netflix's player state management and the Adaptive
 * Streaming Engine (ASE). This class coordinates the full playback lifecycle
 * by connecting player-level state (paused, seeking, track selection) with
 * the streaming engine's internal playgraph, segment scheduling, and buffer
 * management.
 *
 * Responsibilities:
 * - Initializes and configures the streaming engine (playgraph config,
 *   network corrections, media request config).
 * - Manages playgraph creation, start, seek, stop, and teardown.
 * - Handles track switching (audio, video, timed text) by pausing/resuming
 *   the ASE player and updating selected track indices.
 * - Forwards ASE events (error, logdata, bufferingStarted, bufferingComplete,
 *   serverSwitch, streamSelected, segmentNormalized, etc.) to the player state.
 * - Manages manifest caching and auxiliary manifest fetching for ad breaks
 *   and multi-viewable content.
 * - Bridges PTS (presentation timestamp) conversions between player time
 *   and playgraph-internal segment offsets.
 * - Creates and manages the playback context exposed to the ASE player,
 *   including media element access, playback rate, and codec negotiation.
 *
 * Key lifecycle:
 *   initializeIntegration() -> onSegmentNormalized() -> open() ->
 *   playing() -> [seek/trackSwitch/underflow/...] -> stop() -> dispose()
 *
 * Key terminology:
 * - Playgraph: The segment graph that the streaming engine traverses.
 * - PlaybackContext: The interface the ASE player uses to access the
 *   HTMLMediaElement, playback position, and rate.
 * - ManifestCache: Caches manifest data keyed by viewable ID.
 * - CprStreamId: Current playback run stream state observable.
 * - SegmentMap: Mapping of segment IDs to start/end times.
 */

// Dependencies (commented out — resolved by the module bundler)
// import { playerPhase, getByteOffset, TimeUtil, p8, u8, platform, PlaybackState, bD } from './modules/Module_45247.js';
// import { EventEmitter } from './modules/Module_90745.js';
// import { scheduleAsync } from './modules/Module_32219.js';
// import { ea as ErrorCategory, EventTypeEnum } from './modules/Module_36129.js';
// import { kPa as processLogData } from './modules/Module_30326.js';
// import { zh as BufferingState, PlayerEvents, streamState } from './modules/Module_85001.js';
// import { createMediaRequestConfig, createFormatConfig } from './modules/Module_29204.js';
// import { gd as isValidMediaType } from './modules/Module_32687.js';
// import { ellaSendRateMultiplier, MILLISECONDS, seekToSample } from './modules/Module_5021.js';
// import { vzc as computeStartPosition } from './modules/Module_64302.js';
// import { zk as formatMediaTime } from './modules/Module_8825.js';
// import { currentBitrate as ObservableValue } from './modules/Module_81734.js';
// import { ManifestCacheClass } from './modules/Module_64213.js';
// import { MediaType, DT as MediaTypeToString, supplementaryMediaType } from './modules/Module_26388.js';
// import { SegmentManager } from './modules/Module_45240.js';
// import { y$a as AseUtilities } from './modules/Module_26668.js';
// import { we as NfError } from './modules/Module_31149.js';
// import { EventEmitter as NodeEventEmitter } from './modules/Module_17187.js';
// import { playgraphConfigBuilder } from './modules/Module_87141.js';

/**
 * @typedef {object} AseGcSettings
 * @property {object} aseGcSettings - Inner settings with viewable J identifier
 * @property {Function} checkJitter - Checks jitter state
 * @property {Function} getSegmentInfo - Gets segment info by segment ID
 * @property {Function} BS - Builds segment map from playback data
 * @property {string} listenerInfo - Current segment ID for listener context
 */

/**
 * @typedef {object} PlaygraphSegmentMapEntry
 * @property {string} J - Viewable ID for this segment
 * @property {number} startTimeMs - Start time in milliseconds
 * @property {number} contentEndPts - Content end PTS
 */

/**
 * @typedef {object} StreamState
 * @property {string} id - Current segment ID
 * @property {number} IPa - Quality descriptor in playback time
 * @property {number} internal_Ipa - Segment start time
 * @property {number} Vic - Segment end time
 * @property {number} BPc - Timed text update time
 * @property {number} B2a - Box timestamp
 */

/**
 * @typedef {object} BufferDurationInfo
 * @property {number} vbuflmsec - Video buffer level in ms
 * @property {number} vbuflbytes - Video buffer level in bytes
 * @property {number} abuflmsec - Audio buffer level in ms
 * @property {number} abuflbytes - Audio buffer level in bytes
 * @property {number} tbuflmsec - Text buffer level in ms
 * @property {number} tbuflbytes - Text buffer level in bytes
 */

/**
 * ASE Integration Implementation - connects the player to the streaming engine.
 */
class AseIntegrationImpl {
    /**
     * @param {AseGcSettings} aseGcSettings - Garbage collection / segment settings
     * @param {object} playerState - The central player state object
     * @param {object} debug - Debug/assertion utility
     * @param {*} _unused - Unused parameter (legacy)
     * @param {object} manifestFetcher - Service for fetching manifests
     */
    constructor(aseGcSettings, playerState, debug, _unused, manifestFetcher) {
        this.aseGcSettings = aseGcSettings;
        this.playerState = playerState;
        this.debug = debug;
        this.manifestFetcher = manifestFetcher;

        this.isInitialized = false;
        this.isDeviceMonitored = false;
        this.isActive = false;

        this.requestedAudioTrackIndex = undefined;
        this.requestedTextTrackIndex = undefined;
        this.requestedVideoTrackIndex = undefined;

        this.hasNetworkInfo = false;

        /** @type {Record<string, object>} Encoder logging info per media type */
        this.encoderLoggingInfo = {
            [MediaType.V]: {},
            [MediaType.U]: {},
            [MediaType.TEXT_MEDIA_TYPE]: {},
            [MediaType.supplementaryMediaType]: {},
        };

        /** @type {object|undefined} Cached stream state from last segmentPresenting */
        this.cachedStreamState = undefined;

        /**
         * Handler invoked when buffering completes. Logs start-play data,
         * transitions the player to PLAYING, and records playback delay.
         * @private
         */
        this.bufferingCompleteHandler = () => {
            this.debug.assert(this.playgraph, 'has access to asePlaygraph');
            this.debug.assert(this.internalLogger, 'has access to internalLogger');
            this.debug.assert(this.utilService, 'has access to mediaBufferGetLogFields');

            const bufferedState = this.bufferedState;
            const averageBufferLength = this.networkMonitor.key()?.bufferLength?.average;

            const logEvent = {
                type: 'logdata',
                target: 'startplay',
                fields: {
                    hasasereport: this.playerState.aseReportEnabled,
                    hashindsight: false,
                    buffCompleteReason: bufferedState.reason,
                    actualbw: averageBufferLength,
                    initSelReason: bufferedState.initSelReason ?? 'unknown',
                    bcVBufferLevelMs: bufferedState.bcVBufferLevelMs,
                    bcABufferLevelMs: bufferedState.bcABufferLevelMs,
                },
            };

            processLogData({
                ITa: logEvent,
                sessionStats: this.sessionStats,
                loadTime: this.loadTime,
            });

            this.playgraph.S7a('startplay', getByteOffset.startPlayback);

            if (this.asePlayer?.isPlaybackStarted) {
                this.internalLogger.pauseTrace('Buffering complete', {
                    Cause: 'ASE Buffering complete',
                    evt: bufferedState,
                }, this.utilService());

                this.playerState.bufferedState = bufferedState;
                this.playerState.avBufferingState.set(BufferingState.NORMAL);

                if (!this.hasFirstPlayback) {
                    this.hasFirstPlayback = true;
                    this.playerState.recordPlayDelay('pb');
                }

                const stoppingPhases = [playerPhase.STOPPING, playerPhase.STOPPED, playerPhase.PAUSED];
                if (!stoppingPhases.includes(this.cprStreamId.value)) {
                    this.playing();
                }
            } else {
                this.internalLogger.error(
                    `Shim received buffering complete but player has no position (player ${this.asePlayer ? '' : 'un'}defined, state ${this.playerState.state})`
                );
            }
        };

        /**
         * Callback invoked when a track update has been applied. Clears
         * requested track indices and resumes playback if needed.
         * @private
         */
        this.trackUpdateCallback = () => {
            this.debug.assert(this.internalLogger, 'has access to internalLogger');

            this.requestedAudioTrackIndex = undefined;
            this.requestedTextTrackIndex = undefined;
            this.requestedVideoTrackIndex = undefined;

            if (this.playerState.paused.value && this.isResuming) {
                this.isResuming = false;
                this.playerState.paused.set(false, { QB: true });
            }

            this.playerState.mediaSourceManager?.tic();
            this.pendingTrackUpdateCallback?.call(this);
            this.pendingTrackUpdateCallback = undefined;
        };

        /** @type {EventEmitter} Internal event emitter */
        this.events = new NodeEventEmitter();

        /** @type {ManifestCacheClass} Cache for manifest data */
        this.manifestCache = new ManifestCacheClass(
            this.updateDownloadState.bind(this),
            (entry) => this.playerState.updateUploadQueue(entry),
            (entry, data) => this.playerState.validateUploadQueue(entry, data),
        );
    }

    // ─── Computed Properties ───────────────────────────────────────────

    /**
     * Whether all three track indices (audio, video, text) have been requested.
     * @returns {boolean}
     */
    get hasAllTrackRequests() {
        return (
            this.requestedAudioTrackIndex !== undefined &&
            this.requestedTextTrackIndex !== undefined &&
            this.requestedVideoTrackIndex !== undefined
        );
    }

    /**
     * The network monitor from the streaming engine.
     * @returns {object}
     */
    get networkMonitor() {
        this.debug.assert(this.streamingEngine, 'has access to streamingEngine');
        return this.streamingEngine.networkMonitor;
    }

    /**
     * Resolves the deepest playgraph segment map by following nested
     * playgraphSegmentMap references.
     * @returns {object|undefined} The leaf-level segment map
     */
    get playgraphSegmentMap() {
        let map = this.playgraph?.playgraphSegmentMap;
        while (map?.playgraphSegmentMap) {
            map = map.playgraphSegmentMap;
        }
        return map?.segmentMap;
    }

    /**
     * Resolves the leaf-level ASE player by following internal_Xca chains.
     * @returns {object|undefined}
     */
    get leafPlayer() {
        let player = this.asePlayer;
        while (player?.internal_Xca) {
            player = player.internal_Xca;
        }
        return player;
    }

    /**
     * Returns the current playback position as { Ga, J } if the leaf player
     * has started playback and has a valid position in the segment map.
     * @returns {{Ga: object, J: string}|undefined}
     */
    get currentPlaybackInfo() {
        if (this.leafPlayer?.isPlaybackStarted) {
            const position = this.leafPlayer.position;
            const segmentEntry = position && this.playgraphSegmentMap?.segments[position.M];
            if (segmentEntry) {
                return {
                    Ga: TimeUtil.fromMilliseconds(position.offset.playbackSegment + segmentEntry.startTimeMs),
                    J: segmentEntry.J,
                };
            }
        }
        return undefined;
    }

    /**
     * Returns the current segment IDs from all branches of the leaf player.
     * @returns {string[]}
     */
    get currentBranchSegmentIds() {
        return this.leafPlayer?.branches.map((branch) => branch.currentSegment.id) ?? [];
    }

    /**
     * Returns the estimated playback time from the ASE player.
     * @returns {number|undefined}
     */
    get estimatedTime() {
        return this.asePlayer?.estimatedTime.value.playbackSegment;
    }

    // ─── Lifecycle ─────────────────────────────────────────────────────

    /**
     * Disposes of the integration, releasing the playgraph, player, and
     * network monitor resources.
     */
    dispose() {
        this.isActive = false;
        this.networkMonitor.setNetworkMonitorListener(null);
        this.debug.assert(this.streamingEngine, 'has access to streamingEngine');

        if (this.playgraph) {
            this.streamingEngine.removePlaygraph(this.playgraph);
        }
        if (this.asePlayer) {
            this.streamingEngine.destroyPlaygraph(this.asePlayer);
        }

        this.streamingEngine.removeManifestSideChannel(
            this.manifestCache.getManifestCacheEntry(this.aseGcSettings.aseGcSettings.J)
        );
        this.manifestCache.clear();
        this.platformMediaSource?.clearListeners();
    }

    /**
     * Initializes the integration with configuration, globals, and services.
     * Sets up playgraph config, network corrections for short titles, and
     * initial media request config.
     *
     * @param {object} params
     * @param {object} params.config - Player configuration
     * @param {object} params.aseGlobals - ASE global state (streamingEngine, playgraphConfig)
     * @param {object} params.internalLogger - Logging service
     * @param {object} params.eventBus - Event bus with mergeConfig utility
     * @param {Function} params.utilService - Returns buffer log fields
     * @param {Function} params.getCategoryLog - Logger factory by category
     * @param {Function} params.cha - Server switch handler
     * @param {Function} params.playbackCallbacks - Segment-presenting callback
     */
    initializeIntegration({ config, aseGlobals, internalLogger, eventBus, utilService, getCategoryLog, cha, playbackCallbacks }) {
        this.internalLogger = internalLogger;
        this.log = internalLogger.createLogger('AseIntegrationImpl');

        this.aseUtilities = new AseUtilities(this.internalLogger);
        this.utilService = utilService;
        this.cha = cha;
        this.playbackCallbacks = playbackCallbacks;

        const playbackSegment = this.playerState.aseGcSettings;

        this.debug.assert(playbackSegment, 'has a playback segment');
        this.debug.assert(config, 'has access to config');
        this.debug.assert(eventBus, 'has access to utils');
        this.debug.assert(getCategoryLog, 'has access to getCategoryLog');
        this.debug.assert(aseGlobals, 'has access to aseGlobals');
        this.debug.assert(aseGlobals.streamingEngine, 'has access to streamingEngine');
        this.debug.assert(playbackSegment.parsedManifest, 'has access to parsedManifest');
        this.debug.assert(playbackSegment.manifestRef, 'has access to manifest');

        this.config = config;
        this.streamingEngine = aseGlobals.streamingEngine;

        // Apply playgraph configuration from config builder
        aseGlobals.playgraphConfig.set(playgraphConfigBuilder(config), true, getCategoryLog('ASE'));
        aseGlobals.playgraphConfig.set({
            maxNumberTitlesScheduled: config.prefetchPipelineConfig?.maxNumberTitlesScheduled ?? 1,
        }, true, internalLogger);

        // Correct network settings for short titles (< 5 minutes)
        if (config.correctNetworkForShortTitles && !playbackSegment.liveController.isLive && playbackSegment.manifestRef.manifestContent.duration < 300000) {
            aseGlobals.playgraphConfig.setPlaygraphConfig({ expandDownloadTime: false }, true, internalLogger);
        } else {
            aseGlobals.playgraphConfig.setPlaygraphConfig({
                expandDownloadTime: aseGlobals.playgraphConfig.getPlaygraphConfig().expandDownloadTime,
            }, true, internalLogger);
        }

        // Set initial media request config based on seek/autoplay state
        const initialVideoProfile = playbackSegment.tracks.videoTrack?.streams?.[0]?.profileName;
        aseGlobals.playgraphConfig.setPlaygraphConfig(
            createMediaRequestConfig(!!playbackSegment.sessionContext.isSeeking, !!playbackSegment.sessionContext.isAutoPlay, initialVideoProfile),
            true,
            internalLogger
        );

        // Build format config, merging live format if applicable
        let formatConfig = eventBus.mergeConfig({}, createFormatConfig(playbackSegment.manifestFormat));
        if (playbackSegment.liveController.isLive) {
            formatConfig = eventBus.mergeConfig(formatConfig, createFormatConfig('live'));
        }

        this.playgraphConfig = aseGlobals.playgraphConfig.clone(formatConfig);
        platform.events.emit('networkchange', playbackSegment.parsedManifest.networkType);
        this.isInitialized = true;
    }

    // ─── Segment Lifecycle ─────────────────────────────────────────────

    /**
     * Called when a segment has been normalized (resolved to absolute PTS).
     * Sets up the network monitor, determines which media types participate
     * in branching, and triggers zone/config updates.
     *
     * @param {object} event
     * @param {string} event.M - Segment ID
     * @param {object} event.flags - Skip flags for audio/video tracks
     * @param {object} event.requestContext - Request context
     */
    onSegmentNormalized(event) {
        this.debug.assert(this.streamingEngine, 'has access to streamingEngine');

        const playbackData = this.playerState.getPlaybackSegment(event.M);
        this.debug.assert(playbackData.parsedManifest, 'has access to playback parsedManifest');

        const flags = event.flags;
        this.networkMonitor.create();

        this.mediaTypesForBranching = new Set([MediaType.V, MediaType.U]);
        if (flags.skipAudioTrack || flags.skipVideoTrack) {
            this.mediaTypesForBranching.delete(flags.skipAudioTrack ? MediaType.V : MediaType.U);
        }

        this.selectedTrackIndices = [
            playbackData.parsedManifest.videoTrackIndex,
            playbackData.parsedManifest.audioTrackIndex,
            playbackData.parsedManifest.textTrackIndex,
        ];

        this.updateDownloadState(playbackData.R, undefined, event.requestContext);
        this.processConfigChange(event);
        this.triggerZoneUpdate();
    }

    /**
     * Updates the playgraph map on the existing playgraph instance.
     * @param {object} map - New playgraph map data
     */
    updatePlaygraphMap(map) {
        this.playgraph?.updatePlaygraphMap(map);
    }

    // ─── Playgraph Ready & Event Wiring ────────────────────────────────

    /**
     * Called when the playgraph is ready. Wires up all event listeners
     * between the playgraph/player and the player state.
     *
     * @param {object} params
     * @param {object} params.loadTime - Load time metrics
     * @param {object} params.sessionStats - Session statistics
     */
    onPlaygraphReady({ loadTime, sessionStats }) {
        this.debug.assert(this.playgraph, 'has access to asePlaygraph');
        this.debug.assert(this.asePlayer, 'has access to asePlayer');

        this.sessionStats = sessionStats;
        this.loadTime = loadTime;

        const playgraphEvents = this.playgraph.events;

        // ── Error handling ──
        playgraphEvents.addListener('error', (errorEvent) => {
            if (errorEvent.error !== 'NFErr_MC_StreamingFailure') return;

            this.internalLogger.pauseTrace(`receiving an unrecoverable streaming error: ${JSON.stringify(errorEvent)}`);
            this.internalLogger.pauseTrace(`StreamingFailure, buffer status:${JSON.stringify(this.utilService())}`);

            scheduleAsync(() => {
                let errorCategory = ErrorCategory.ASE_SESSION_ERROR;
                let nativeCode = errorEvent.nativeCode;
                const context = errorEvent.context;

                if (context?.type === 'adBreakHydration') {
                    errorCategory = ErrorCategory.MANIFEST;
                    nativeCode = EventTypeEnum.AUXILIARY_MANIFEST_ADBREAK_HYDRATION_FATAL_ERROR;
                }

                this.playerState.fireError(errorCategory, {
                    Ya: nativeCode,
                    configFlag: errorEvent.errormsg,
                    httpcode: errorEvent.httpCode,
                    networkErrorCode: errorEvent.networkErrorCode,
                    errorSubcode: errorEvent.httpCode,
                });
            });
        });

        // ── Log data forwarding ──
        playgraphEvents.addListener('logdata', (logEvent) => {
            if (typeof logEvent.target === 'string' && typeof logEvent.fields === 'object') {
                logEvent.fields.aseApiVersion = this.playgraph?.aseApiVersion;
                processLogData({
                    ITa: logEvent,
                    sessionStats,
                    loadTime,
                });
            }
        });

        // ── Buffering state changes ──
        playgraphEvents.addListener('bufferingStarted', () => {
            this.playerState.avBufferingState.set(BufferingState.BUFFERING);
        });

        playgraphEvents.addListener('bufferingComplete', (state) => {
            this.bufferedState = state;
        });

        // ── Paused state listener ──
        this.playerState.paused.addListener((change) => {
            this.debug.assert(this.internalLogger, 'has access to internalLogger');

            if (!change.sn?.QB && this.isInitialized) {
                if (change.newValue && [playerPhase.PLAYING, playerPhase.PAUSED].includes(this.cprStreamId.value)) {
                    this.cprStreamId.set(playerPhase.PAUSED);
                    this.hasContent.emit('paused', {
                        type: 'paused',
                        hasContent: this.hasContent.playbackPosition,
                    });
                } else if (!change.newValue && this.cprStreamId.value === playerPhase.PAUSED) {
                    this.cprStreamId.set(playerPhase.PLAYING);
                    this.hasContent.emit('playing', {
                        type: 'playing',
                        hasContent: this.hasContent.playbackPosition,
                    });
                }
            }

            if (!change.newValue) {
                this.isResuming = false;
            }

            this.internalLogger.info('Paused changed', {
                From: change.oldValue,
                To: change.newValue,
                MediaTime: formatMediaTime(this.playerState.mediaTime.value),
            });
        });

        // ── Track change listener ──
        this.playerState.tracks.addListener([MediaType.V, MediaType.U, MediaType.TEXT_MEDIA_TYPE], (trackEvent) => {
            if (!this.isInitialized) return;

            this.debug.assert(this.internalLogger, 'has access to internalLogger');

            const hasTrackChange = trackEvent.bZ || trackEvent.internal_Lia || (trackEvent.M4 && this.playerState.liveController.isLive);

            if (!trackEvent.forceSetTrack && !hasTrackChange) {
                this.internalLogger.pauseTrace('No tracks to process', {
                    Cc: trackEvent.UE?.trackId,
                    videoTrack: trackEvent.qwa?.trackId,
                    xJ: trackEvent.textTrackInfo?.trackId,
                    forceSetTrack: trackEvent.forceSetTrack,
                });
                return;
            }

            const trackIds = {};
            if (trackEvent.bZ) {
                trackIds.ew = trackEvent.UE?.trackId;
            }
            if (trackEvent.internal_Lia) {
                trackIds.trackIdentifier = trackEvent.qwa?.trackId;
            }
            if (trackEvent.M4 && this.playerState.liveController.isLive) {
                trackIds.textTrackId = trackEvent.textTrackInfo?.trackId;
            }

            this.switchTracks(trackIds);
        });

        // ── Server switch ──
        playgraphEvents.addListener('serverSwitch', (event) => {
            this.playerState.fireEvent(PlayerEvents.internal_Xga, event);

            let mediaType;
            if (event.mediatype === MediaTypeToString[MediaType.V]) {
                mediaType = MediaType.V;
            } else if (event.mediatype === MediaTypeToString[MediaType.U]) {
                mediaType = MediaType.U;
            } else if (event.mediatype === MediaTypeToString[MediaType.TEXT_MEDIA_TYPE]) {
                mediaType = MediaType.TEXT_MEDIA_TYPE;
            }

            if (isValidMediaType(mediaType)) {
                this.cha(event.segmentId, event.server, mediaType);
            }
        });

        // ── Stream selected ──
        playgraphEvents.addListener('streamSelected', (event) => {
            if (!this.isActive) return;

            const playbackContextId = event.manifest.playbackContextId;
            if (!this.playerState.mBc(playbackContextId) && this.config.fatalOnManifestMistmatch) {
                this.playerState.fireError(ErrorCategory.MANIFEST_MISTMATCH, { Xaa: playbackContextId });
                return;
            }

            const segmentTime = this.playgraph?.resolveTime(event.position).timeValue.playbackSegment;
            let streamList = [];
            let matchingStream;
            let targetObservable;

            if (event.mediaType === MediaType.U) {
                matchingStream = this.playerState.yEb(event.streamId);
                targetObservable = this.playerState.isStalled;
                streamList = this.playerState.fM();
            } else if (event.mediaType === MediaType.V) {
                matchingStream = this.playerState.cEb(event.streamId);
                targetObservable = this.playerState.playbackRate;
                streamList = this.playerState.hvc();
            }

            if (matchingStream && targetObservable) {
                targetObservable.set(matchingStream, {
                    jR: segmentTime,
                    g$: event.bandwidth,
                });
            } else if (event.mediaType !== MediaType.TEXT_MEDIA_TYPE) {
                this.internalLogger.error('no matching stream for streamSelected event', {
                    streamId: event.streamId,
                    mediaType: event.mediaType,
                    streamList,
                    cachedManifest: this.playerState.generateRandom,
                });
            }
        });

        // ── Segment normalized ──
        playgraphEvents.addListener('segmentNormalized', (event) => {
            const segmentId = event.segmentId;
            let contentEndTime = TimeUtil.fromMilliseconds(Math.floor(event.viewableContentEnd.playbackSegment));
            let earliestContentEnd = TimeUtil.fromMilliseconds(Math.floor(event.viewableEarliestContentEnd.playbackSegment));

            contentEndTime = ellaSendRateMultiplier(contentEndTime);
            earliestContentEnd = ellaSendRateMultiplier(earliestContentEnd);

            let segmentMapEntry;
            if (this.playgraphSegmentMap?.segments[segmentId]) {
                segmentMapEntry = this.playgraphSegmentMap.segments[segmentId];
            }

            const segmentExists = this.playerState.rEb(segmentId);
            const viewableExists = segmentMapEntry && this.playerState.internal_Aca(segmentMapEntry.J);

            if (!segmentExists) {
                this.processSegmentManifest(segmentId);
            } else if (viewableExists && this.playerState.HYa()) {
                const viewableData = this.playerState.bk(segmentMapEntry.J);
                if (viewableData.M === `placeholder-segmentId-${segmentMapEntry.J}`) {
                    viewableData.M = segmentId;
                }
            }

            const playbackData = this.playerState.getPlaybackSegment(segmentId);
            if (playbackData) {
                this.debug.assert(
                    playbackData.M === segmentId,
                    `segmentNormalized: playbackViewableData segmentId should match the value in the event. playbackViewableData.segmentId: ${playbackData.M} event.segmentId: ${segmentId} `
                );
                playbackData.segmentTimestamp = contentEndTime;
                playbackData.segmentDurationValue = earliestContentEnd;
            }

            if (!this.playerState.seekTarget) {
                if (this.playerState.liveController.isLive && contentEndTime.toUnit(MILLISECONDS) === Infinity) {
                    this.playerState.seekTarget = seekToSample;
                } else {
                    this.playerState.seekTarget = contentEndTime;
                }
            }

            const currentSeekTarget = this.playerState.seekTarget.toUnit(MILLISECONDS);
            const contentEndMs = contentEndTime.toUnit(MILLISECONDS);
            if (this.playerState.liveController.isLive && contentEndMs !== Infinity && contentEndMs > currentSeekTarget) {
                this.playerState.seekTarget = contentEndTime;
            }
        });

        // ── Location selected ──
        playgraphEvents.addListener('locationSelected', (event) => {
            this.playerState.fireEvent(PlayerEvents.LOCATION_SELECTED, event);
        });

        // ── ASE report enabled ──
        playgraphEvents.addListener('aseReportEnabled', () => {
            this.playerState.aseReportEnabled = true;
        });

        // ── Log blob ──
        playgraphEvents.addListener('logblob', (event) => {
            this.playerState.fireEvent(PlayerEvents.LOGBLOB, event);
        });

        // ── Media request complete ──
        playgraphEvents.addListener('mediaRequestComplete', (event) => {
            const cadmiumResponse = event?.uUc?.cadmiumResponse;
            if (cadmiumResponse) {
                this.playerState.fireEvent(PlayerEvents.MEDIA_REQUEST_COMPLETE, {
                    response: cadmiumResponse,
                    R: this.playerState.aseGcSettings.R,
                });
            }
        });

        // ── Transport report ──
        playgraphEvents.addListener('transportReport', (event) => {
            const cadmiumResponse = event.internal_Wrc?.cadmiumResponse;
            if (cadmiumResponse) {
                this.playerState.fireEvent(PlayerEvents.MEDIA_REQUEST_COMPLETE, {
                    response: cadmiumResponse,
                    R: this.playerState.aseGcSettings.R,
                });
            }
        });

        // ── Live event times updated ──
        playgraphEvents.addListener('liveEventTimesUpdated', (event) => {
            const { M: segmentId, startTime, endTime } = event;
            if (this.playerState.rEb(segmentId)) {
                const playbackData = this.playerState.getPlaybackSegment(segmentId);
                if (playbackData.liveController.isLive) {
                    playbackData.liveController.setLiveEventTimes(startTime, endTime);
                }
            }
        });

        // ── Live logging info updated ──
        playgraphEvents.addListener('liveLoggingInfoUpdated', (event) => {
            const { mediaType, info } = event;
            const previousInfo = this.encoderLoggingInfo[mediaType];
            this.encoderLoggingInfo[mediaType] = info;

            const encoderTagChanged = this.encoderLoggingInfo[mediaType].encoderTag !== previousInfo.encoderTag && previousInfo.encoderTag !== undefined;
            const encoderRegionChanged = this.encoderLoggingInfo[mediaType].encoderRegion !== previousInfo.encoderRegion && previousInfo.encoderRegion !== undefined;

            if (encoderRegionChanged || encoderTagChanged) {
                this.playerState.fireEvent(PlayerEvents.ava, {
                    mediaType,
                    vr: previousInfo,
                    current: this.encoderLoggingInfo[mediaType],
                    encodingLoggingInfo: info.encodingLoggingInfo,
                    downloadableStreamId: info.downloadableStreamId,
                });
            }
        });

        // ── Live postplay updated ──
        playgraphEvents.addListener('livePostplayUpdated', (event) => {
            this.playerState.fireEvent(PlayerEvents.iIb, {
                J: event.J,
                internal_Bfa: event.internal_Bfa,
                action: event.action,
            });
        });

        // ── Chapters updated ──
        playgraphEvents.addListener('chaptersUpdated', (event) => {
            this.playerState.fireEvent(PlayerEvents.jpa, { J: event.J });
        });

        // ── Seeked ──
        playgraphEvents.addListener('seeked', (event) => {
            this.lastSeekPosition = event.position;
        });

        this._setupPlayerEventListeners();
    }

    /**
     * Sets up event listeners on the ASE player (logdata, segmentPresenting,
     * ptsChanged, fragmentsMissing).
     * @private
     */
    _setupPlayerEventListeners() {
        this.debug.assert(this.asePlayer, 'has access to asePlayer');

        const playerEvents = this.asePlayer.events;

        // ── Player log data ──
        playerEvents.addListener('logdata', (logEvent) => {
            if (typeof logEvent.target === 'string' && typeof logEvent.fields === 'object') {
                processLogData({
                    ITa: logEvent,
                    sessionStats: this.sessionStats,
                    loadTime: this.loadTime,
                });
            }
        });

        // ── Segment presenting ──
        playerEvents.addListener('segmentPresenting', (event) => {
            this.debug.assert(this.playgraph, 'has access to asePlaygraph');
            this.debug.assert(this.asePlayer, 'has access to asePlayer');
            this.debug.assert(this.playbackCallbacks, 'has access to segmentPresentingHandler');

            const resolvedTime = this.playgraph.resolveTime(event.position);

            let innerSegmentMapEntry;
            const innerPosition = event.inner?.position;
            if (innerPosition && this.playgraphSegmentMap) {
                innerSegmentMapEntry = this.playgraphSegmentMap.segments[innerPosition.M];
            }

            if (this.aseGcSettings.checkJitter()) {
                this.aseGcSettings.listenerInfo = event.position.M;
            }

            this.playbackCallbacks({
                J: resolvedTime.J,
                mR: innerSegmentMapEntry,
                XS: false,
                programId: event.programId,
            });

            const metrics = event.metrics;
            if (this.pendingLongTransition && metrics) {
                const segment = metrics.segment;
                if (
                    metrics.srcsegment === this.pendingLongTransition.fromSegment.M &&
                    segment === this.pendingLongTransition.toSegment.M &&
                    (metrics.transitionType === 'seamless' || metrics.transitionType === 'perfect')
                ) {
                    metrics.transitionType = 'long';
                    this.pendingLongTransition = undefined;
                }
            }

            this.playerState.fireEvent(PlayerEvents.iO, {
                type: 'segmentPresenting',
                position: {
                    segmentId: event.position.M,
                    offset: event.position.offset,
                },
                playerTimestamp: event.playerTimestamp,
                metrics: event.metrics,
            });

            this.cachedStreamState = this.asePlayer.getStreamState();
        });

        // ── PTS changed (seek/skip) ──
        playerEvents.addListener('ptsChanged', (event) => {
            this.debug.assert(this.playgraph, 'has access to asePlaygraph');

            const seekPosition = this.lastSeekPosition ?? this.playgraph.seekSegmentPosition(event.initialTimestamp);
            this.lastSeekPosition = undefined;

            const resolvedTime = this.playgraph.eB(seekPosition);
            const encryptionMetadata = this.resolveEncryptionMetadata(seekPosition);

            const ptsChangeInfo = {
                L0c: resolvedTime?.$B,
                initialTimestamp: event.initialTimestamp.$B,
                encryptionMetadata,
            };

            this.playerState.mediaSourceManager.aSc(ptsChangeInfo);

            if (event.inNonSeamlessTransition) {
                this.hasContent.emit('clockAdjusted', {
                    type: 'clockAdjusted',
                    hasContent: this.hasContent.playbackPosition,
                });
            } else {
                this.hasContent.emit('skipped', {
                    type: 'skipped',
                    hasContent: this.hasContent.playbackPosition,
                });
            }
        });

        // ── Fragments missing ──
        playerEvents.addListener('fragmentsMissing', (event) => {
            const resolvedTime = this.playgraph?.resolveTime(event.nextAvailableGraphPosition);
            this.playerState.mediaSourceManager.seek(
                resolvedTime.timeValue.playbackSegment,
                streamState.FRAGMENTS_MISSING,
                event.nextAvailableGraphPosition.M
            );
        });
    }

    // ─── Chapters ──────────────────────────────────────────────────────

    /**
     * Returns chapters for a given viewable ID.
     * @param {string} viewableId
     * @returns {Array} Chapter list, or empty array
     */
    getChapters(viewableId) {
        return this.playgraph?.getChapters(viewableId) ?? [];
    }

    // ─── Segment & Manifest Management ─────────────────────────────────

    /**
     * Processes a segment's manifest, resolving auxiliary manifests if needed.
     * Links the segment to its parent manifest for ad break hydration.
     *
     * @param {string} segmentId
     */
    processSegmentManifest(segmentId) {
        if (!this.playgraphSegmentMap?.segments[segmentId]) return;

        const segmentEntry = this.playgraphSegmentMap.segments[segmentId];
        const currentViewable = this.playerState.currentPlaybackViewable;
        const manifestRef = currentViewable.manifestRef;

        let resolvedManifest;

        if (manifestRef?.auxiliaryManifests) {
            resolvedManifest = manifestRef.auxiliaryManifests.find(
                (m) => m.manifestContent.R === segmentEntry.J
            );
        }

        if (!resolvedManifest) {
            resolvedManifest = this.playerState.findManifestById(segmentEntry.J);
        }

        if (!resolvedManifest && manifestRef?.manifestContent.auxiliaryManifestToken) {
            const fetchResult = this.manifestFetcher.fetchAuxiliaryManifest({
                Kb: manifestRef.manifestContent.auxiliaryManifestToken,
                parentManifestId: currentViewable.R,
                J: segmentEntry.J,
            });
            if (fetchResult) {
                resolvedManifest = fetchResult.manifestRef;
            }
        }

        if (resolvedManifest && resolvedManifest.manifestContent.auxiliaryManifestToken === manifestRef?.manifestContent.auxiliaryManifestToken) {
            this.playerState.updateSegmentManifest(
                segmentEntry.J,
                {
                    Mf: {
                        Kb: resolvedManifest.manifestContent.auxiliaryManifestToken,
                        parentManifestId: currentViewable.R,
                    },
                },
                currentViewable.sourceTransactionId,
                resolvedManifest
            );
        }
    }

    // ─── Stream State ──────────────────────────────────────────────────

    /**
     * Returns the current stream state (segment ID, quality, timestamps).
     * Falls back to cached state if the player is not actively streaming.
     *
     * @returns {StreamState}
     */
    getStreamState() {
        const isActive = this.asePlayer?.isStreamActive();
        const state = (this.cachedStreamState ?? (isActive && this.asePlayer.getStreamState())) || {};

        const currentSegment = state.currentSegment;
        const qualityDescriptor = state.qualityDescriptor;
        const timedTextUpdateTime = state.timedTextUpdateTime;
        const boxTimestamp = state.boxTimestamp;

        return {
            id: String(currentSegment?.id),
            IPa: qualityDescriptor?.playbackSegment ?? 0,
            internal_Ipa: currentSegment?.startTime.playbackSegment ?? Infinity,
            Vic: currentSegment?.endTime.playbackSegment ?? 0,
            BPc: timedTextUpdateTime?.playbackSegment ?? Infinity,
            B2a: boxTimestamp?.playbackSegment ?? 0,
        };
    }

    /**
     * Returns buffer duration info for all media types.
     * @returns {BufferDurationInfo}
     */
    getBufferDurationInfo() {
        this.debug.assert(this.playgraph, 'has access to asePlaygraph');

        const info = this.playgraph.getBufferDurationInfo();
        return {
            vbuflmsec: info.totalvbuflmsecs,
            vbuflbytes: info.vbuflbytes,
            abuflmsec: info.totalabuflmsecs,
            abuflbytes: info.abuflbytes,
            tbuflmsec: info.totaltbuflmsecs,
            tbuflbytes: info.tbuflbytes,
        };
    }

    // ─── Playback Control ──────────────────────────────────────────────

    /** No-op for pause (handled via paused observable). */
    paused() {}

    /**
     * Emits a playbackRateChanged event.
     */
    onPlaybackRateChanged() {
        this.hasContent.emit('playbackRateChanged', {
            type: 'playbackRateChanged',
            hasContent: this.hasContent.playbackPosition,
        });
    }

    /**
     * Opens (starts) the streaming session. Activates the playgraph,
     * sets the initial seek position, and begins buffering.
     */
    open() {
        if (this.isActive) return;

        this.debug.assert(this.playgraph, 'has access to asePlaygraph');
        this.debug.assert(this.asePlayer, 'has access to asePlayer');

        this.isActive = true;
        this.isDeviceMonitored = true;

        this.playgraph.send();

        this.debug.assert(this.actualStartPosition, 'invalid start position relative to playgraph');
        this.lastSeekPosition = this.actualStartPosition;
        this.playgraph.top(this.actualStartPosition);

        this.cprStreamId.set(playerPhase.BUFFERING);
        this.scheduleTrackUpdate(this.bufferingCompleteHandler);
        this.playgraph.updateTrackState(this.asePlayer);

        this.bindVideoElementEvents();

        const playbackContainer = this.getPlaybackContainer();
        const adData = playbackContainer?.sr.hasAdvertisements();
        const viewableIdStr = this.playerState.aseGcSettings.R.toString();

        if (adData?.result[viewableIdStr]) {
            this.events.emit('adMetadataUpdated');
        }
    }

    /**
     * Resumes playback (transitions to PLAYING state).
     */
    playing() {
        this.debug.assert(this.playgraph, 'has access to asePlaygraph');
        this.debug.assert(this.asePlayer, 'has access to asePlayer');

        if (this.playgraph.state === 0) return;

        this.asePlayer.resume(this.isResuming ? [MediaType.V, MediaType.TEXT_MEDIA_TYPE] : undefined);
        this.cprStreamId.set(playerPhase.PLAYING);
        this.hasContent.emit('playing', {
            type: 'playing',
            hasContent: this.hasContent.playbackPosition,
        });
    }

    /**
     * Stops playback by pausing the ASE player and transitioning to STOPPING.
     */
    stop() {
        this.cprStreamId.set(playerPhase.STOPPING);
        this.asePlayer?.pause();
        this.events.emit('stop');
        this.hasContent.emit('paused', {
            type: 'paused',
            hasContent: this.hasContent.playbackPosition,
        });
    }

    /**
     * Ends the playback session. Logs end-play event, cancels streaming,
     * and saves throughput/latency monitor data.
     */
    endPlayback() {
        this.debug.assert(this.playgraph, 'has access to asePlaygraph');
        this.debug.assert(this.streamingEngine, 'has access to streamingEngine');

        if (this.isActive && this.cprStreamId.value !== playerPhase.STOPPED && this.cprStreamId.value !== playerPhase.STOPPING) {
            this.stop();
        }

        this.playgraph.S7a('endplay', getByteOffset.endPlayback);
        this.playgraph.cancelStreaming();
        this.streamingEngine.throughputMonitor.save();
        this.streamingEngine.latencyMonitor.save();
    }

    /**
     * Handles underflow (rebuffering). Sets state to REBUFFERING and
     * schedules the buffering complete handler.
     */
    underflow() {
        this.cprStreamId.set(playerPhase.REBUFFERING);
        this.playgraph?.S7a('intrplay', getByteOffset.underflow);
        this.hasContent.emit('underflow', {
            type: 'underflow',
            hasContent: this.hasContent.playbackPosition,
        });
        this.scheduleTrackUpdate(this.bufferingCompleteHandler);
    }

    /**
     * Sets bitrate filters on the stream selector.
     * @param {*} minBitrate
     * @param {*} maxBitrate
     */
    setBitrateFilters(minBitrate, maxBitrate) {
        this.IBa.setBitrateFilters(minBitrate, maxBitrate);
    }

    // ─── Seek ──────────────────────────────────────────────────────────

    /**
     * Seeks to a specific time within a segment. Resolves the segment ID
     * if not provided, sets up the playgraph position, and begins rebuffering.
     *
     * @param {number} timeMs - Target time in milliseconds
     * @param {string} [segmentId] - Optional segment ID to seek within
     */
    seekWithTimeInterval(timeMs, segmentId) {
        this.debug.assert(this.playgraph, 'has access to asePlaygraph');
        this.debug.assert(this.asePlayer, 'has access to asePlayer');

        if (!segmentId || !this.playgraph.segmentMap.segments[segmentId]) {
            segmentId = this.locateSegmentByTime(timeMs) ?? this.aseGcSettings.listenerInfo;
        }

        this.debug.logError(segmentId, 'has access to segmentId');
        this.debug.assert(this.playgraph.segmentMap.segments[segmentId], 'segment exists in playgraph map');

        const position = {
            M: segmentId,
            offset: TimeUtil.fromMilliseconds(timeMs - this.playgraph.segmentMap.segments[segmentId].startTimeMs),
        };

        this.lastSeekPosition = position;
        this.playgraph.top(position);
        this.asePlayer.resume();

        this.cprStreamId.set(playerPhase.BUFFERING);
        this.scheduleTrackUpdate(this.bufferingCompleteHandler);

        const validPosition = this.playgraph.kRb(position);
        this.debug.assert(validPosition, 'Valid position must be provided for seek');
    }

    // ─── Track Switching ───────────────────────────────────────────────

    /**
     * Returns the audio track configuration for a given manifest.
     * If the manifest matches the current playback manifest, returns the
     * selected audio track index; otherwise picks the best matching track.
     *
     * @param {object} manifest - The manifest to get track config for
     * @param {object} contextData - Additional context for track selection
     * @returns {number} Audio track index
     */
    getTrackConfiguration(manifest, contextData) {
        this.debug.assert(this.playerState.manifestRef, 'has access to playback manifest');
        this.debug.assert(this.aseUtilities, 'has access to ASE utils');

        const currentAudioIndex = this.selectedTrackIndices[MediaType.V];
        if (manifest.R === this.playerState.manifestRef.manifestContent.R) {
            return currentAudioIndex;
        }
        return this.aseUtilities.selectBestAudioTrack(
            this.playerState.manifestRef.manifestContent.audio_tracks[currentAudioIndex],
            contextData
        );
    }

    /**
     * Returns the text track index if live and the track is valid (not none
     * or has forced subtitles).
     *
     * @param {object} manifest - Manifest with timedtexttracks
     * @param {Array} textTracks - Text track list
     * @returns {number|undefined}
     */
    getTextTrackIndex(manifest, textTracks) {
        this.debug.assert(this.playerState.manifestRef, 'has access to playback manifest');

        if (this.playerState.liveController.isLive) {
            const textTrackIndex = this.selectedTrackIndices[MediaType.TEXT_MEDIA_TYPE];
            const track = textTracks[textTrackIndex];
            if (track && (!track.isNone || track.mda)) {
                return textTrackIndex;
            }
        }
        return undefined;
    }

    /**
     * Resolves a track index from a track ID, falling back to the currently
     * selected index if no ID is provided.
     *
     * @param {number} mediaType - Media type constant
     * @param {string|undefined} trackId - Target track ID
     * @param {Array} trackList - Available tracks
     * @returns {number|undefined}
     * @private
     */
    _resolveTrackIndex(mediaType, trackId, trackList) {
        this.debug.assert(this.internalLogger, 'has access to internalLogger');

        const currentIndex = this.selectedTrackIndices[mediaType];
        if (trackId === undefined) return currentIndex;

        let resolvedIndex;
        trackList.some((track, index) => {
            if (track.new_track_id === trackId) {
                resolvedIndex = index;
                return true;
            }
            return false;
        });

        if (resolvedIndex === undefined) {
            this.internalLogger.error('switchTracks, trackId not found:', trackId);
        }
        return resolvedIndex;
    }

    /**
     * Initiates a track switch. Pauses media types, updates selected indices,
     * and resumes if possible.
     *
     * @param {object} trackIds
     * @param {string} [trackIds.ew] - Audio track ID
     * @param {string} [trackIds.textTrackId] - Text track ID
     * @param {string} [trackIds.trackIdentifier] - Video track ID
     */
    switchTracks(trackIds) {
        this.debug.assert(this.internalLogger, 'has access to internalLogger');
        this.debug.assert(this.asePlayer, 'has access to asePlayer');
        this.debug.assert(this.playerState.manifestRef, 'has access to playback manifest');

        const manifest = this.playerState.manifestRef.manifestContent;
        const audioIndex = this._resolveTrackIndex(MediaType.V, trackIds.ew, manifest.audio_tracks);
        const textIndex = this._resolveTrackIndex(MediaType.TEXT_MEDIA_TYPE, trackIds.textTrackId, manifest.timedtexttracks);
        const videoIndex = this._resolveTrackIndex(MediaType.U, trackIds.trackIdentifier, manifest.video_tracks);

        this.requestedAudioTrackIndex = audioIndex;
        this.requestedTextTrackIndex = textIndex;
        this.requestedVideoTrackIndex = videoIndex;

        this.playerState.mediaSourceManager?.f_c();

        // Pause all media types if currently playing
        if (!this.playerState.paused.value) {
            this.asePlayer.pause([MediaType.V, MediaType.TEXT_MEDIA_TYPE, MediaType.U]);
            this.isResuming = true;
            this.playerState.paused.set(true, { QB: true });
        }

        this.debug.assertNumber(this.requestedAudioTrackIndex, 'has access to valid requestedAudioTrackIndex number');
        this.selectedTrackIndices[MediaType.V] = this.requestedAudioTrackIndex;

        this.debug.assertNumber(this.requestedTextTrackIndex, 'has access to valid requestedTextTrackIndex number');
        this.selectedTrackIndices[MediaType.TEXT_MEDIA_TYPE] = this.requestedTextTrackIndex;

        this.debug.assertNumber(this.requestedVideoTrackIndex, 'has access to valid requestedVideoTrackIndex number');
        this.selectedTrackIndices[MediaType.U] = this.requestedVideoTrackIndex;

        // Resume if the playgraph can handle it
        if (this.canResume() || this.isResuming) {
            this.asePlayer.resume(this.isResuming ? [MediaType.V, MediaType.TEXT_MEDIA_TYPE, MediaType.U] : undefined);
        }

        this.scheduleTrackUpdate(this.trackUpdateCallback);
    }

    /**
     * Checks whether the playgraph can resume with the current track selection.
     * @returns {boolean}
     */
    canResume() {
        this.debug.assert(this.playgraph, 'has access to asePlaygraph');
        return this.playgraph.canResume(
            { kV: this.getTrackConfiguration.bind(this) },
            { kV: () => this.selectedTrackIndices[MediaType.U] },
            { kV: this.getTextTrackIndex.bind(this) }
        );
    }

    // ─── Playback Ending & Network Info ────────────────────────────────

    /**
     * Checks whether the playback should continue by emitting a
     * playbackEnding event. If cancelled, the playback continues.
     *
     * @returns {boolean} Whether playback should continue (has network info)
     */
    checkPlaybackEnding() {
        if (!this.hasNetworkInfo) {
            const endingEvent = {
                type: 'playbackEnding',
                cancel: () => { this.hasNetworkInfo = true; },
            };
            this.hasContent.emit(endingEvent.type, endingEvent);
        }

        const result = this.hasNetworkInfo;
        this.hasNetworkInfo = false;
        return result;
    }

    // ─── DRM ───────────────────────────────────────────────────────────

    /**
     * Notifies the ASE player that DRM is ready (or not) for a given
     * position.
     *
     * @param {number} position - The position for which DRM is ready
     * @param {boolean} [isReady=true] - Whether DRM is ready
     */
    onDrmReady(position, isReady = true) {
        if (!this.isDeviceMonitored) {
            return this.fail('Must call open prior to drmReady');
        }
        if (Number.isFinite(position)) {
            this.debug.assert(this.asePlayer, 'has access to asePlayer');
            if (isReady) {
                this.asePlayer.onDrmReady(position);
            } else {
                this.asePlayer.onDrmNotReady(position);
            }
        }
    }

    /**
     * Checks if DRM is ready for the current viewable.
     * @returns {boolean}
     */
    checkDrmReady() {
        if (this.asePlayer?.isPlaybackStarted) {
            return this.asePlayer.isDrmReady(this.aseGcSettings.aseGcSettings.J);
        }
        return false;
    }

    // ─── Data Parsing & Time Conversion ────────────────────────────────

    /**
     * Parses data at the given time, checking both the playback container
     * and the ASE player.
     *
     * @param {number} timeMs - Time in milliseconds
     * @returns {boolean} Whether parsing succeeded
     */
    parseData(timeMs) {
        if (!this.asePlayer) return false;

        const time = TimeUtil.fromMilliseconds(timeMs);
        const containerResult = this.getPlaybackContainer()?.parseData(time) ?? true;
        return this.asePlayer.parseData(time) && containerResult;
    }

    /**
     * Resolves encryption metadata for a segment position.
     * @param {object} position - Segment position { M, offset }
     * @returns {number} Start time in ms plus offset
     * @private
     */
    resolveEncryptionMetadata(position) {
        this.debug.assert(this.playgraph, 'has access to asePlaygraph');
        return this.playgraph.segmentMap.segments[position.M].startTimeMs + Number(position.offset.playbackSegment.toFixed(0));
    }

    /**
     * Converts a player PTS value to content PTS.
     * @param {number} playerPts - Player PTS in milliseconds
     * @returns {number} Content PTS in milliseconds
     */
    convertPlayerPtsToContentPts(playerPts) {
        this.debug.assert(this.playgraph, 'has access to asePlaygraph');

        const time = TimeUtil.fromMilliseconds(playerPts);
        const position = this.playgraph.seekSegmentPosition(time, { rZc: true, qZc: true });

        if (position) {
            return this.resolveEncryptionMetadata(position);
        }
        return this.fail(`convertPlayerPtsToContentPts failed to convert playerPts: ${playerPts}`);
    }

    /**
     * Converts content PTS to player PTS using the segment map.
     *
     * @param {string} segmentId - Segment ID
     * @param {number} contentPtsMs - Content PTS in milliseconds
     * @returns {number} Player PTS in milliseconds
     */
    convertContentPtsToPlayerPts(segmentId, contentPtsMs) {
        this.debug.assert(this.playgraph, 'has access to asePlaygraph');
        this.debug.assert(this.internalLogger, 'has access to internalLogger');

        if (!this.playgraph.segmentMap.segments[segmentId]) {
            segmentId = this.locateSegmentByTime(contentPtsMs);
        }

        this.debug.logError(segmentId, 'has access to segmentId');

        const position = {
            M: segmentId,
            offset: TimeUtil.fromMilliseconds(contentPtsMs - this.playgraph.segmentMap.segments[segmentId].startTimeMs),
        };

        const resolved = this.playgraph.eB(position);
        if (resolved) {
            return resolved.playbackSegment;
        }
        return contentPtsMs;
    }

    /**
     * Converts a time in milliseconds to a viewable-scoped time with
     * viewable ID.
     *
     * @param {number} timeMs - Time in milliseconds
     * @param {string} [segmentId] - Optional segment ID
     * @returns {number|undefined} Playback segment time
     */
    convertToViewableTime(timeMs, segmentId) {
        this.debug.assert(this.playgraph, 'has access to asePlaygraph');
        this.debug.assert(this.asePlayer, 'has access to asePlayer');

        if (!segmentId || !this.playgraph.segmentMap.segments[segmentId]) {
            segmentId = this.locateSegmentByTime(timeMs) ?? this.asePlayer?.position.M;
        }

        const playbackData = this.playerState.getPlaybackSegment(segmentId);
        const query = {
            Ga: TimeUtil.fromMilliseconds(timeMs),
            J: playbackData.R,
        };

        return this.playgraph.mAb(query)?.timeValue.playbackSegment;
    }

    // ─── Segment Navigation ────────────────────────────────────────────

    /**
     * Navigates to the next segment, either seamlessly or with a flush.
     *
     * @param {string} targetSegmentId - The segment to navigate to
     * @param {boolean} seamless - Whether to use seamless transition
     * @returns {boolean} Whether the navigation was initiated
     */
    chooseNextSegment(targetSegmentId, seamless) {
        this.debug.assert(this.internalLogger, 'has access to internalLogger');
        this.debug.assert(this.playgraph, 'has access to asePlaygraph');
        this.debug.assert(this.asePlayer, 'has access to asePlayer');

        const currentSegmentId = this.getStreamState().id;
        const segmentData = this.playgraph.getSegmentData(currentSegmentId, targetSegmentId);

        if (seamless) {
            if (!segmentData.O3c) {
                this.internalLogger.RETRY(`chooseNextSegment, seamless transition, invalid destination: ${targetSegmentId} for current segment: ${currentSegmentId}`);
                return false;
            }
            if (segmentData.v0a !== undefined && segmentData.v0a !== targetSegmentId) {
                return false;
            }
            this.playgraph.notifyEvent(currentSegmentId, targetSegmentId, false, seamless);
            return true;
        }

        // Non-seamless transition
        if (segmentData.v0a !== undefined) {
            return false;
        }

        if (segmentData.r$) {
            this.asePlayer.create();
            this.lastSeekPosition = {
                M: targetSegmentId,
                offset: TimeUtil.fromMilliseconds(0),
            };
            this.playgraph.notifyEvent(currentSegmentId, targetSegmentId, false, seamless);
            this.asePlayer.resume();
            this.cprStreamId.set(playerPhase.BUFFERING);
            this.scheduleTrackUpdate(this.bufferingCompleteHandler);
        }

        return !!segmentData.r$;
    }

    /**
     * Forwards a notification event to the playgraph.
     *
     * @param {string} fromSegment - Source segment ID
     * @param {string} toSegment - Target segment ID
     * @param {boolean} cancel - Whether to cancel the transition
     * @param {*} context - Additional context
     */
    notifyEvent(fromSegment, toSegment, cancel, context) {
        this.debug.assert(this.playgraph, 'has access to asePlaygraph');
        this.playgraph.notifyEvent(fromSegment, toSegment, cancel, context);
    }

    /**
     * Emits a "skipped" event and returns a resolved promise wrapper.
     * @returns {object} Promise-based result with iVc property
     */
    skipped() {
        this.debug.assert(this.internalLogger, 'has access to internalLogger');

        const position = this.hasContent.playbackPosition;
        this.hasContent.emit('skipped', {
            type: 'skipped',
            hasContent: position,
        });

        return new p8(Promise.resolve()).iVc;
    }

    /**
     * Delegates xsa call to the playgraph.
     * @param {*} arg1
     * @param {*} arg2
     * @returns {*}
     */
    xsa(arg1, arg2) {
        return this.playgraph?.xsa(arg1, arg2);
    }

    /**
     * Delegates hWa call to the playgraph.
     * @returns {*}
     */
    hWa() {
        return this.playgraph?.hWa();
    }

    // ─── Event Listeners ───────────────────────────────────────────────

    /**
     * Adds an event listener.
     * @param {string} eventName
     * @param {Function} handler
     * @returns {this}
     */
    addEventListener(eventName, handler) {
        this.events.addListener(eventName, handler);
        return this;
    }

    /**
     * Removes an event listener.
     * @param {string} eventName
     * @param {Function} handler
     * @returns {this}
     */
    removeEventListener(eventName, handler) {
        this.events.removeListener(eventName, handler);
        return this;
    }

    // ─── Config ────────────────────────────────────────────────────────

    /**
     * Applies a single config key/value to the playgraph.
     * @param {string} key
     * @param {*} value
     */
    applyPlaygraphConfig(key, value) {
        this.playgraph.applyConfig({ [key]: value });
    }

    // ─── Segment Location ──────────────────────────────────────────────

    /**
     * Locates the segment containing the given time by scanning the
     * playgraph segment map. Falls back to the nearest segment.
     *
     * @param {number} timeMs - Time in milliseconds
     * @returns {string|undefined} Segment ID
     */
    locateSegmentByTime(timeMs) {
        this.debug.assert(this.playgraph, 'has access to asePlaygraph');
        this.debug.assert(this.internalLogger, 'has access to internalLogger');

        const segmentMap = this.playgraph.segmentMap;
        const matchingSegments = [];
        let nearestDistance = Infinity;
        let nearestSegmentId;

        for (const segmentId in segmentMap.segments) {
            const segment = segmentMap.segments[segmentId];
            const startTime = segment.startTimeMs;
            const contentEnd = segment.contentEndPts;
            const isBeforeEnd = timeMs < Number(contentEnd ?? Infinity);

            if (startTime <= timeMs && isBeforeEnd) {
                matchingSegments.push(segmentId);
            } else {
                const distance = Math.min(Math.abs(timeMs - startTime), Math.abs(timeMs - contentEnd));
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestSegmentId = segmentId;
                }
            }
        }

        const result = matchingSegments[0] || nearestSegmentId;
        this.debug.logError(result, 'has access to locatedSegmentId');
        return result;
    }

    // ─── Playback Container ────────────────────────────────────────────

    /**
     * Returns the playback container from the playgraph.
     * @returns {object|undefined}
     */
    getPlaybackContainer() {
        return this.playgraph?.playbackContainer;
    }

    /**
     * Returns segment data for a given target segment from the perspective
     * of the current segment.
     *
     * @param {string} targetSegmentId
     * @returns {object}
     */
    getSegmentData(targetSegmentId) {
        this.debug.assert(this.asePlayer, 'has access to asePlayer');
        this.debug.assert(this.playgraph, 'has access to asePlaygraph');
        return this.playgraph.getSegmentData(
            this.asePlayer.getStreamState().currentSegment?.id,
            targetSegmentId
        );
    }

    /**
     * Returns a playgraph node by ID.
     * @param {string} nodeId
     * @returns {object|undefined}
     */
    getPlaygraphNode(nodeId) {
        return this.playgraph?.getPlaygraphNode(nodeId);
    }

    /**
     * Checks whether live program playgraphs should be enabled for the
     * given playback data.
     *
     * @param {object} playbackData - Playback data with manifestRef
     * @returns {boolean}
     */
    shouldEnableLiveProgramPlaygraphs(playbackData) {
        return (
            this.playgraphConfig.enableLiveProgramPlaygraphs ||
            (playbackData.manifestRef.manifestContent.manifestType === 'LINEAR' &&
                this.playgraphConfig.enableLiveProgramPlaygraphsForLinear)
        );
    }

    // ─── Internal: Scheduling & State Management ───────────────────────

    /**
     * Binds play/pause events from the HTML video element to the
     * cprStreamId state machine.
     * @private
     */
    bindVideoElementEvents() {
        this.debug.assert(this.playerState.mediaSourceElement, 'has access to mediaElement');

        const videoElement = this.playerState.mediaSourceElement.htmlVideoElement;
        this.debug.assert(videoElement, 'has access to videoElement');

        videoElement.addEventListener('play', () => {
            if (this.cprStreamId.value === playerPhase.PAUSED) {
                this.cprStreamId.set(playerPhase.PLAYING);
                this.hasContent.emit('playing', {
                    type: 'playing',
                    hasContent: this.hasContent.playbackPosition,
                });
            }
        });

        videoElement.addEventListener('pause', () => {
            if (this.cprStreamId.value === playerPhase.PLAYING) {
                this.cprStreamId.set(playerPhase.PAUSED);
                this.hasContent.emit('paused', {
                    type: 'paused',
                    hasContent: this.hasContent.playbackPosition,
                });
            }
        });
    }

    /**
     * Emits an error event on the playgraph.
     * @param {string} message - Error message
     */
    fail(message) {
        this.playgraph?.events.emit('error', {
            type: 'error',
            error: 'NFErr_MC_StreamingFailure',
            errormsg: message,
        });
    }

    /**
     * Schedules a callback to run when both the ASE player has started
     * and the playgraph is in STREAMING state. If not yet ready, adds
     * listeners that re-check on state changes.
     *
     * @param {Function} callback - The callback to execute
     */
    scheduleTrackUpdate(callback) {
        if (callback !== this.trackUpdateCallback && this.trackUpdateCallback) {
            this.pendingTrackUpdateCallback = callback;
            return;
        }

        const isPlayerStarted = this.asePlayer?.isPlaybackStartedProperty.value === true;
        const isStreaming = this.playgraph?.playgraphState.value === PlaybackState.STREAMING;

        // Remove previous listeners
        this.asePlayer?.isPlaybackStartedProperty.removeListener(this.playerStateListener);
        this.playgraph?.playgraphState.removeListener(this.playgraphStateListener);

        if (isPlayerStarted && isStreaming) {
            callback();
        } else {
            this.playerStateListener = () => this.scheduleTrackUpdate(callback);
            this.playgraphStateListener = () => this.scheduleTrackUpdate(callback);
            this.asePlayer?.isPlaybackStartedProperty.addListener(this.playerStateListener);
            this.playgraph?.playgraphState.addListener(this.playgraphStateListener);
        }
    }

    // ─── Manifest Management ───────────────────────────────────────────

    /**
     * Builds manifest data for a viewable, including readiness status,
     * playgraph config, and branching media types.
     *
     * @param {string} viewableId
     * @returns {Promise<object>}
     * @private
     */
    _buildManifestData(viewableId) {
        const viewableData = this.playerState.bk(viewableId);

        return Promise.resolve(viewableData.manifestRef ?? this._fetchManifest(viewableData))
            .then((manifestRef) => {
                const manifest = manifestRef.manifestContent;
                return {
                    S: manifest,
                    isReadyForPlayback: manifest.ata && !manifest.iM,
                    config: this.playgraphConfig,
                    mediaTypesForBranching: [...this.mediaTypesForBranching],
                    playgraphId: this.playgraph?.id ?? -1,
                };
            });
    }

    /**
     * Fetches a manifest for a viewable, resolving parent manifest
     * references for auxiliary content.
     *
     * @param {object} viewableData
     * @returns {Promise<object>} Manifest reference
     * @private
     */
    _fetchManifest(viewableData) {
        let prerequisite = Promise.resolve();

        if (viewableData.ze?.parentManifestId) {
            const parentId = viewableData.ze.parentManifestId;
            const parentManifest = this.playerState.bk(parentId).manifestRef?.manifestContent;

            if (parentManifest) {
                viewableData.ze.jfa = parentManifest;
            } else {
                prerequisite = this.manifestCache
                    .getManifestCacheEntry(parentId)
                    .vv.then((result) => result.manifestRef)
                    .then((ref) => { viewableData.ze.jfa = ref; })
                    .catch(() => {
                        this.playerState.fireError(
                            ErrorCategory.MANIFEST,
                            EventTypeEnum.AUXILIARY_MANIFEST_ERROR_RETRIEVING_PARENT_MANIFEST
                        );
                    });
            }
        }

        return prerequisite
            .then(() => this.playerState.internal_Jya(viewableData))
            .then(() => viewableData.manifestRef)
            .catch((error) => {
                throw new bD('Failed to request manifest', {
                    Cd: 0,
                    KAa: 0,
                    errorCode: error.code ?? 0,
                    context: {
                        error: error instanceof NfError ? error.toJSON() : error,
                        type: 'manifest',
                    },
                });
            });
    }

    /**
     * Stores or updates a download state entry in the manifest cache
     * for a given viewable ID. Sets up the manifest side channel if
     * OC side channel is enabled.
     *
     * @param {string} viewableId - The viewable ID
     * @param {object} [auxiliaryInfo] - Auxiliary manifest info
     * @param {object} [requestContext] - Request context with transaction IDs
     */
    updateDownloadState(viewableId, auxiliaryInfo, requestContext) {
        this.debug.assert(this.streamingEngine, 'has access to streamingEngine');

        const cacheKey = {
            J: viewableId,
            parentManifestId: auxiliaryInfo?.auxiliaryManifestInfo?.parentManifestId,
            auxiliaryManifestToken: auxiliaryInfo?.auxiliaryManifestInfo?.auxiliaryManifestToken,
        };

        if (this.manifestCache.has(cacheKey)) return;

        // Handle auxiliary manifest linking
        if (
            !this.playerState.internal_Aca(viewableId) &&
            auxiliaryInfo?.auxiliaryManifestInfo?.parentManifestId &&
            this.playerState.internal_Aca(auxiliaryInfo.auxiliaryManifestInfo.parentManifestId)
        ) {
            const parentData = this.playerState.bk(auxiliaryInfo.auxiliaryManifestInfo.parentManifestId);
            const parentToken = parentData.manifestRef?.manifestContent.auxiliaryManifestToken;
            const existingManifest = this.playerState.findManifestById(viewableId);

            let resolvedManifest;
            if (existingManifest?.manifestContent?.auxiliaryManifestToken === parentToken) {
                resolvedManifest = existingManifest;
            }

            this.playerState.updateSegmentManifest(viewableId, auxiliaryInfo, parentData.sourceTransactionId, resolvedManifest);
        }

        let viewableData;
        if (this.playerState.internal_Aca(viewableId)) {
            viewableData = this.playerState.bk(viewableId);
        }

        const sourceTransactionId = requestContext
            ? requestContext.sourceTransactionId
            : viewableData?.sourceTransactionId;
        const pbcid = requestContext
            ? requestContext.pbcid
            : viewableData?.correlationId;

        let manifestPromise;

        this.manifestCache.store(cacheKey, {
            yZ() {},
            equals(other) {
                return other && other.J === cacheKey.J && (sourceTransactionId === other.sourceTransactionId || !other.sourceTransactionId || !sourceTransactionId);
            },
            get vv() {
                if (!manifestPromise) {
                    manifestPromise = this._owner._buildManifestData(viewableId);
                }
                return manifestPromise;
            },
            set vv(value) {
                manifestPromise = value;
            },
            _owner: this,
            events: new EventEmitter(),
            sourceTransactionId,
            J: cacheKey.J,
            expired: false,
            superseded: false,
        });

        if (this.playgraphConfig.enableOCSideChannel) {
            this.streamingEngine.addManifestSideChannel(
                this.manifestCache.getManifestCacheEntry(cacheKey.J, auxiliaryInfo),
                {
                    Ia: sourceTransactionId,
                    pbcid,
                    s_: requestContext?.value,
                }
            );
        }
    }

    /**
     * Refreshes a manifest for a given segment ID by rebuilding the
     * manifest cache entry and notifying the streaming engine.
     *
     * @param {string} segmentId - Segment ID to refresh
     * @returns {Promise}
     */
    refreshManifest(segmentId) {
        this.debug.assert(this.streamingEngine, 'has access to streamingEngine');

        const playbackData = this.playerState.getPlaybackSegment(segmentId);
        const auxiliaryInfo = playbackData.ze;
        const viewableId = this.aseGcSettings.getSegmentInfo(segmentId).J;

        const cacheKey = {
            J: playbackData.R,
            parentManifestId: auxiliaryInfo?.parentManifestId,
            auxiliaryManifestToken: auxiliaryInfo?.auxiliaryManifestToken,
        };

        if (!this.manifestCache.has(cacheKey)) {
            return Promise.resolve();
        }

        let auxManifestInfo;
        if (auxiliaryInfo) {
            auxManifestInfo = {
                Mf: {
                    Kb: auxiliaryInfo.auxiliaryManifestToken,
                    parentManifestId: auxiliaryInfo.parentManifestId,
                },
            };
        }

        const cacheEntry = this.manifestCache.getManifestCacheEntry(viewableId, auxManifestInfo);
        cacheEntry.vv = this._buildManifestData(viewableId);
        return this.streamingEngine.g5(cacheEntry);
    }

    // ─── Config Change & Zone Update ───────────────────────────────────

    /**
     * Processes a config change event by computing the start position,
     * creating the playgraph, and setting up the stream selector.
     *
     * @param {object} event
     * @param {object} event.requestContext - Request context
     * @param {string} event.M - Segment ID
     */
    processConfigChange(event) {
        const requestContext = event.requestContext;
        const segmentId = event.M;

        this.debug.assert(this.streamingEngine, 'has access to streamingEngine');
        this.debug.assert(this.internalLogger, 'has access to internalLogger');

        const playbackData = this.playerState.getPlaybackSegment(segmentId);
        const segmentMap = this.aseGcSettings.BS(playbackData);
        const segmentEntry = segmentMap.segments[segmentId];

        this.debug.assert(segmentEntry, 'segment exists');

        this.actualStartPosition = computeStartPosition(
            segmentEntry.J,
            segmentMap,
            this.playerState.startPts,
            segmentEntry.startTimeMs
        );

        const playgraphConfig = Object.create(this.playgraphConfig, {
            KL: { value: requestContext.value },
            enablePrerollForInitialSeek: { value: this.playerState.background.value },
            enableLiveProgramPlaygraphs: { value: this.shouldEnableLiveProgramPlaygraphs(playbackData) },
        });

        this.cprStreamId = new ObservableValue(playerPhase.STARTING);
        this.playgraph = this.streamingEngine.createPlaygraph(
            segmentMap,
            this.playgraphConfig.playgraphDefaultWeight,
            playgraphConfig,
            this.manifestCache
        );

        this.IBa = new u8(this.internalLogger);
        const streamSelector = this.playgraph.$$(this.IBa);
        const streamFilters = this.playgraph.Z$();
        this.playgraph.L5a(streamFilters, streamSelector);

        this.canResume();
        this.isResuming = false;
    }

    /**
     * Triggers a zone update by creating the playback context and ASE
     * player. Configures media types for branching and live program
     * playgraph support.
     */
    triggerZoneUpdate() {
        this.debug.assert(this.streamingEngine, 'has access to streamingEngine');
        this.debug.assert(this.playerState.manifestRef, 'has access to playback manifest');

        const manifest = this.playerState.manifestRef?.manifestContent;
        const hasTextTrack = this.getTextTrackIndex(manifest, manifest.timedtexttracks) !== undefined;

        const mediaTypes = [...this.mediaTypesForBranching];
        if (hasTextTrack) {
            mediaTypes.push(MediaType.TEXT_MEDIA_TYPE);
        }

        const playerConfig = Object.create(this.playgraphConfig, {
            Uh: { value: mediaTypes },
            VVa: { value: () => this._getOrCreateMediaSource() },
            enableLiveProgramPlaygraphs: { value: this.shouldEnableLiveProgramPlaygraphs(this.playerState) },
        });

        this.hasContent = this.createPlaybackContext();
        this.asePlayer = this.streamingEngine.createPlayer(this.hasContent, playerConfig);
    }

    /**
     * Creates the playback context object exposed to the ASE player. This
     * wraps the EventEmitter with computed properties for time offset,
     * playback position, playback rate, and media element access.
     *
     * @returns {object} Playback context
     */
    createPlaybackContext() {
        if (this.hasContent) return this.hasContent;

        const context = Object.create(new EventEmitter(), {
            al: {
                get: () => this.playerState.timeOffset.toUnit(MILLISECONDS),
            },
            playbackPosition: {
                get: () => {
                    this.debug.assertNumber(this.playerState.mediaTime.value, 'has access to mediaTime.value');
                    return TimeUtil.fromMilliseconds(this.playerState.mediaTime.value);
                },
            },
            playbackRate: {
                get: () => Math.max(this.playerState.playbackRate.value, 0.01),
            },
            internal_Kxc: {
                value: () => {
                    this.debug.assert(this.playerState.mediaSourceElement, 'has access to mediaElement');
                    return this.playerState.mediaSourceElement;
                },
            },
            o4a: {
                value: () => {
                    this.playerState.liveController.seekToLiveEdge();
                },
            },
        });

        // Add codec negotiation if configured
        if (this.config.internal_Vqc) {
            this.debug.assert(this.internalLogger, 'has access to internalLogger');
            this.segmentManager = new SegmentManager(this.playerState, this.config, this.internalLogger);

            Object.defineProperties(context, {
                qu: {
                    value: (transitionInfo) => {
                        const result = this.segmentManager.canPlayCodec(transitionInfo);
                        if (!result.canPlayCodec) {
                            this.pendingLongTransition = {
                                Aba: transitionInfo.fromSegment,
                                toSegment: transitionInfo.toSegment,
                            };
                        }
                        return result;
                    },
                },
                reuseOnErrorCacheSize: {
                    value: (arg1, arg2) => this.segmentManager.reuseOnErrorCacheSize(arg1, arg2),
                },
            });
        }

        return context;
    }

    /**
     * Resets and re-creates the player and playback context, then resumes
     * playback. Used for error recovery or reconfiguration.
     *
     * @returns {Promise<void>}
     */
    resetAndResumePlayback() {
        return new Promise((resolve) => {
            this.bindVideoElementEvents();
            this._teardownPlayer();
            this.triggerZoneUpdate();

            this.debug.assert(this.asePlayer, 'asePlayer should have been re-created');
            this._setupPlayerEventListeners();
            this.playgraph.updateTrackState(this.asePlayer);
            this.playing();

            this.cprStreamId.set(playerPhase.BUFFERING);
            this.scheduleTrackUpdate(() => {
                if (this.playerState.paused.value) {
                    this.playerState.paused.set(false, { QB: true });
                }
                this.bufferingCompleteHandler();
                resolve();
            });
        });
    }

    /**
     * Tears down the current playgraph and ASE player.
     * @private
     */
    _teardownPlayer() {
        this.playgraph?.roc();
        this.streamingEngine.destroyPlaygraph(this.asePlayer);
        this.asePlayer = undefined;
        this.platformMediaSource = undefined;
    }

    /**
     * Gets or creates the platform media source for the playback context.
     * @returns {object} Platform media source
     * @private
     */
    _getOrCreateMediaSource() {
        if (!this.platformMediaSource) {
            this.platformMediaSource = new platform.MediaSource(this.hasContent);
            if (!this.platformMediaSource.codecProfilesMap) {
                this.platformMediaSource.codecProfilesMap = platform.MediaSource.codecProfilesMap;
            }
        }
        return this.platformMediaSource;
    }
}

export { AseIntegrationImpl };
