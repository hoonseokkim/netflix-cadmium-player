/**
 * Netflix Cadmium Player - PlaybackInstance
 *
 * The main playback orchestrator. Manages the lifecycle of a single playback session,
 * including manifest fetching, stream initialization, ASE (Adaptive Streaming Engine)
 * integration, viewable transitions, ad management, subtitle rendering, and teardown.
 *
 * Dependencies (module IDs):
 *   p  = 22970 - asyncHelpers (__awaiter, generator runtime)
 *   c  = 50040 - sessionLock (BV session lock manager)
 *   g  = 86258 - playbackSetup (j5b - initialize playback bindings)
 *   f  = 20318 - aseGlobals (global ASE state)
 *   e  = 66093 - batteryManager (BD - battery status API)
 *   h  = 11953 - mediaSourceWrapper (qHa - MediaSource element wrapper)
 *   k  = 73585 - subtitlePlayer (internal_Dmb - subtitle download/sync)
 *   l  = 24427 - throttleFactory (l1b - creates throttled updater)
 *   m  = 33096 - constants (WJa, eIa, DX, SUCCESS, lK noop)
 *   n  = 81734 - observable (currentBitrate - Observable value holder)
 *   q  = 29204 - playerConfig (config singleton)
 *   r  = 94886 - eventEmitter (jl - event emitter)
 *   u  = 42654 - inactivityMonitor (W1b - idle timeout watcher)
 *   v  = 37509 - documentEvents (writeBytes, downloadNode, stateChangeEvent)
 *   w  = 13044 - playbackRegistry (playbackInstanceHolder, tq list, iJa/jJa hooks)
 *   x  = 59032 - bitrateSelector ($gb - per-viewable bitrate selector)
 *   y  = 62439 - viewableAdapter (ViewableAdapterClass)
 *   A  = 79014 - textRenderer (internal_Fmb - timed text renderer)
 *   z  = 39480 - playbackInitBindings (l5b - additional init bindings)
 *   B  = 31276 - loggerFactory (fetchOperation, getCategoryLog)
 *   C  = 5021  - timeUtils (MILLISECONDS, ri, ellaSendRateMultiplier)
 *   D  = 36129 - errorCodes (ea error enum, EventTypeEnum, hka)
 *   E  = 45146 - assert (assert, l_ - validation helpers)
 *   G  = 8825  - mathUtils (zk - format media time, oG - clamp)
 *   F  = 3887  - parseUtils (initializeModel, parseInteger, forEachProperty)
 *   H  = 32219 - scheduler (scheduleAsync)
 *   J  = 32687 - typeChecks (wc - isDefined, gd - isNumber, n1 - isString, EM, UYa)
 *   M  = 73056 - mediaSourceManager (wHa - MSE buffer manager)
 *   K  = 45266 - sessionDataMerger (mergeSessionData)
 *   L  = 16520 - mediaSourceEvents (MediaSourceEvents enum)
 *   O  = 52569 - domFactory (createElement)
 *   I  = 72639 - manifestFlavors (qq - flavor constants)
 *   N  = 85001 - playerEnums (pacingTargetBufferStrategy, setState, zh, PlayerEvents, streamState, rCa)
 *   Q  = 31149 - playerError (we - error class, internal_Nra)
 *   S  = 78719 - exceptionHandler (L0b - unhandled exception catcher)
 *   T  = 35128 - trackConstants (fragmentValidator - NONE language sentinel)
 *   U  = 13494 - videoQuality (SD - getVideoQuality, lAc - getAVBufferStatus)
 *   X  = 65361 - rateController (ujb - playback rate controller)
 *   Y  = 79048 - viewableConstants (viewableId, yQa - createChoiceMap)
 *   da = 26388 - mediaTypes (MediaType - V=audio, U=video, TEXT_MEDIA_TYPE=text)
 *   ba = 91176 - manifestUtils (AbortController, isLive)
 *   aa = 73403 - trackManager (wJa - track selection manager)
 *   ca = 54973 - manifestTypeResolver (getLicenseType)
 *   ea = 99416 - subtitleConfig (internal_Emb - subtitle configuration)
 */

// ============================================================================
// Imports (mapped from obfuscated module require calls)
// ============================================================================
import asyncHelpers from '../modules/Module_22970'; // p - __awaiter
import sessionLock from '../modules/Module_50040';  // c - BV session lock
import playbackSetup from '../modules/Module_86258'; // g - j5b init bindings
import aseGlobals from '../modules/Module_20318';    // f - global ASE state
import batteryManager from '../modules/Module_66093'; // e - BD battery API
import mediaSourceWrapper from '../modules/Module_11953'; // h - qHa MediaSource
import subtitlePlayerModule from '../modules/Module_73585'; // k - internal_Dmb
import throttleFactory from '../modules/Module_24427'; // l - l1b throttle
import constants from '../modules/Module_33096';      // m - WJa, eIa, DX, etc
import Observable from '../modules/Module_81734';      // n - currentBitrate
import playerConfig from '../modules/Module_29204';    // q - config
import EventEmitter from '../modules/Module_94886';    // r - jl
import inactivityMonitor from '../modules/Module_42654'; // u - W1b
import documentEvents from '../modules/Module_37509'; // v - writeBytes
import playbackRegistry from '../modules/Module_13044'; // w - playbackInstanceHolder
import bitrateSelector from '../modules/Module_59032'; // x - $gb
import viewableAdapter from '../modules/Module_62439'; // y - ViewableAdapterClass
import textRendererModule from '../modules/Module_79014'; // A - internal_Fmb
import playbackInitBindings from '../modules/Module_39480'; // z - l5b
import loggerFactory from '../modules/Module_31276';   // B - fetchOperation
import timeUtils from '../modules/Module_5021';        // C - MILLISECONDS
import errorCodes from '../modules/Module_36129';      // D - ea, EventTypeEnum
import assertUtils from '../modules/Module_45146';     // E - assert, l_
import mathUtils from '../modules/Module_8825';        // G - zk, oG
import parseUtils from '../modules/Module_3887';       // F - initializeModel
import scheduler from '../modules/Module_32219';       // H - scheduleAsync
import typeChecks from '../modules/Module_32687';      // J - wc, gd, n1, EM, UYa
import MediaSourceManager from '../modules/Module_73056'; // M - wHa
import sessionDataMerger from '../modules/Module_45266'; // K - mergeSessionData
import mediaSourceEvents from '../modules/Module_16520'; // L - MediaSourceEvents
import domFactory from '../modules/Module_52569';      // O - createElement
import manifestFlavors from '../modules/Module_72639'; // I - qq
import playerEnums from '../modules/Module_85001';     // N - enums
import playerError from '../modules/Module_31149';     // Q - we
import exceptionHandler from '../modules/Module_78719'; // S - L0b
import trackConstants from '../modules/Module_35128';  // T - fragmentValidator
import videoQuality from '../modules/Module_13494';    // U - SD, lAc
import rateController from '../modules/Module_65361'; // X - ujb
import viewableConstants from '../modules/Module_79048'; // Y - viewableId, yQa
import MediaType from '../modules/Module_26388';       // da - MediaType
import manifestUtils from '../modules/Module_91176';   // ba - AbortController, isLive
import trackManager from '../modules/Module_73403';    // aa - wJa
import manifestTypeResolver from '../modules/Module_54973'; // ca - getLicenseType
import subtitleConfig from '../modules/Module_99416'; // ea - internal_Emb

// ============================================================================
// PlaybackState enum (from playerEnums.pacingTargetBufferStrategy)
// ============================================================================
const PlaybackState = playerEnums.pacingTargetBufferStrategy;
const PresentingState = playerEnums.setState;
const BufferingState = playerEnums.zh;
const PlayerEvents = playerEnums.PlayerEvents;
const StreamState = playerEnums.streamState;

/**
 * PlaybackInstance - The main playback orchestrator for Netflix Cadmium player.
 *
 * Manages the entire lifecycle of a playback session: loading, authorization,
 * manifest fetching, ASE streaming initialization, viewable transitions,
 * ad integration, subtitle rendering, error handling, and teardown.
 */
class PlaybackInstance {
    /**
     * @param {number} movieId - The content ID (viewable/movie ID)
     * @param {object} initialTime - Initial playback time reference
     * @param {object} sessionContext - Session context data (seek state, playback state, etc.)
     * @param {string} segmentId - Initial segment identifier
     * @param {object} viewableConfig - The viewable configuration / GC settings
     * @param {object} indexManager - Manages manifest/segment indexing
     * @param {Function} transactionIdGenerator - Generates source transaction IDs (lB)
     * @param {object} lastVideoSync - Clock/sync reference for video timing (qa)
     * @param {object} asyncLoader - Async component loader
     * @param {object} playerCore - Core player engine reference
     * @param {object} adService - Ad manifest parser service
     * @param {Function} adContentManagerFactory - Creates ad content manager (sa)
     * @param {Function} manifestVerifier - Validates parsed manifests (w_a -> ha)
     * @param {object} analyticsService - Analytics/logging service
     * @param {object} session - Session manager (for manifest caching, etc.)
     * @param {Function} viewableConfigErrorFactory - Creates error objects from error codes
     * @param {object} seekableCheck - Seekable range checker
     * @param {Function} playerCoreFactory - Creates player core time references (aR)
     * @param {Function} drmSessionFactory - Creates DRM sessions / viewable segments
     * @param {object} manifestStore - Manifest cache/store
     * @param {object} segmentDownloader - Segment download manager
     * @param {Function} mediaFactory - Media element factory (Ca)
     * @param {object} eventBus - Global event bus
     * @param {Function} viewableContextFactory - Creates viewable context (v2a -> La)
     * @param {object} playDelayStore - Play delay metrics store
     * @param {object} j4aHandler - Segment position tracker (j4a -> Oa)
     * @param {Function} aseFactory - ASE streaming session factory (subtitleRenderer -> Ka)
     * @param {Function} adContainerFactory - Creates ad playback container (FT -> Pa)
     * @param {object} qualityReporter - Playback quality reporter (g2a -> Sa)
     * @param {Function} adTrackerFactory - Creates ad tracker (Ua)
     * @param {object} errorDelayConfig - Error handling delay config (WPa -> Ta)
     * @param {object} lnaController - LNA controller (Xa)
     * @param {object} debugTraceSelector - Debug trace selection config (YY -> $a)
     * @param {object} initialManifestRef - Pre-fetched manifest reference (ab)
     */
    constructor(
        movieId,
        initialTime,
        sessionContext,
        segmentId,
        viewableConfig,
        indexManager,
        transactionIdGenerator,
        lastVideoSync,
        asyncLoader,
        playerCore,
        adService,
        adContentManagerFactory,
        manifestVerifier,
        analyticsService,
        session,
        viewableConfigErrorFactory,
        seekableCheck,
        playerCoreFactory,
        drmSessionFactory,
        manifestStore,
        segmentDownloader,
        mediaFactory,
        eventBus,
        viewableContextFactory,
        playDelayStore,
        j4aHandler,
        aseFactory,
        adContainerFactory,
        qualityReporter,
        adTrackerFactory,
        errorDelayConfig,
        lnaController,
        debugTraceSelector,
        initialManifestRef
    ) {
        /** @private Reference to `this` for closures */
        const self = this;

        // --- Closure-scoped listener callbacks for constructor ---

        /**
         * Listener: captures initial stream bitrate from the first target buffer change.
         * Removes itself after the first valid stream value arrives.
         */
        function onInitialTargetBufferChange(event) {
            if (event.newValue && event.newValue.stream) {
                self.targetBuffer.removeListener(onInitialTargetBufferChange);
                self.internal_Lta = event.newValue.stream.bitrate;
            }
        }

        /**
         * Listener: fires the YB (content presenting) event once playback leaves
         * WAITING/PAUSED state. Records the wall-clock time reference (kI).
         */
        function onFirstContentPresenting(event) {
            if (event.newValue !== PresentingState.WAITING && event.newValue !== PresentingState.PAUSED) {
                self.presentingState.removeListener(onFirstContentPresenting);
                self.kI = self.playerCore.kJ;
                self.nextState.emit(PlayerEvents.YB);
            }
        }

        /**
         * Listener: detects the first render (frame displayed) and records FFR
         * (first-frame-rendered) play delay metric. Removes itself after firing.
         */
        function onFirstFrameRendered(event) {
            if (event.newValue !== PresentingState.WAITING) {
                self.presentingState.removeListener(onFirstFrameRendered);
                self.firstRenderOccurred = true;
                self.transitionTime = self.playerCore.systemClock.toUnit(timeUtils.MILLISECONDS);
                self.recordPlayDelay('ffr');
                self.nextState.emit(PlayerEvents.firstRenderOccurred);
            }
        }

        // ---- Store injected dependencies ----
        this.viewableConfig = viewableConfigErrorFactory;
        this.indexManager = indexManager;
        this.transactionIdGenerator = transactionIdGenerator;
        this.lastVideoSync = lastVideoSync;
        this.asyncLoader = asyncLoader;
        this.playerCore = playerCore;
        this.adService = adService;
        this.manifestVerifier = manifestVerifier;
        this.analyticsService = analyticsService;
        this.session = session;
        this.viewableConfigFactory = viewableConfigErrorFactory;
        this.seekableCheck = seekableCheck;
        this.playerCoreFactory = playerCoreFactory;
        this.drmSessionFactory = drmSessionFactory;
        this.manifestStore = manifestStore;
        this.segmentDownloader = segmentDownloader;
        this.mediaFactory = mediaFactory;
        this.eventBus = eventBus;
        this.viewableContextFactory = viewableContextFactory;
        this.playDelayStore = playDelayStore;
        this.j4aHandler = j4aHandler;
        this.aseFactory = aseFactory;
        this.adContainerFactory = adContainerFactory;
        this.qualityReporter = qualityReporter;
        this.adTrackerFactory = adTrackerFactory;
        this.errorDelayConfig = errorDelayConfig;
        this.lnaController = lnaController;
        this.debugTraceSelector = debugTraceSelector;

        // ---- Internal state initialization ----

        /** @type {Array} Debug log entries */
        this.$Nb = [];

        /** @type {Map<number, ViewableSegment>} Map of movie IDs to viewable segments */
        this.viewableMap = new Map();

        /** @type {Map<number, object>} Auxiliary manifest cache (by viewable ID) */
        this.auxiliaryManifestCache = new Map();

        /** @type {AbortController} For canceling in-flight manifest requests on close */
        this.abortController = new manifestUtils.AbortController();

        /** @type {TrackManager} Manages audio/video/text track selections */
        this.tracks = new trackManager.wJa();

        // ---- Observable state properties ----

        /** @type {Observable<boolean|null>} Whether the player is currently seeking */
        this.isSeeking = new Observable.currentBitrate(null);

        /** @type {Observable<object|undefined>} Current caption/subtitle settings */
        this.captionSettings = new Observable.currentBitrate(undefined);

        /** @type {Observable<boolean|null>} Whether playback is stalled */
        this.isStalled = new Observable.currentBitrate(null);

        /** @type {Observable<number|null>} Current playback rate (temporary, overwritten below) */
        this.playbackRate = new Observable.currentBitrate(null);

        /** @type {Observable<number|undefined>} Current media time in milliseconds */
        this.mediaTime = new Observable.currentBitrate(undefined);

        /** @type {RateController} Playback rate controller with speed limits */
        this.playbackRate = new rateController.ujb(1, playerConfig.config.J_a);

        /** @type {Observable<boolean>} Whether playback is in background mode */
        this.background = new Observable.currentBitrate(true);

        /** @type {Observable<number|undefined>} Current program ID for live content */
        this.programId = new Observable.currentBitrate(undefined);

        // ---- Bound callback functions for viewable state synchronization ----

        /** Forwards track resume checks to the viewable's track manager */
        this.onTrackResumeCheck = function (event) {
            return self.tracks.canResume({
                Mc: event.qwa,
                audioTrackSelection: event.UE,
                textTrackSelection: event.textTrackInfo,
            });
        };

        /** Syncs seeking state from viewable to this instance */
        this.onViewableSeekingChanged = function (event) {
            return self.isSeeking.set(event.newValue);
        };

        /** Syncs caption settings from viewable to this instance */
        this.onViewableCaptionSettingsChanged = function (event) {
            return self.captionSettings.set(event.newValue);
        };

        /** Syncs stalled state from viewable to this instance */
        this.onViewableStalledChanged = function (event) {
            return self.isStalled.set(event.newValue);
        };

        /** Syncs playback rate from viewable to this instance */
        this.onViewablePlaybackRateChanged = function (event) {
            return self.playbackRate.set(event.newValue);
        };

        /** Syncs target buffer from viewable to this instance */
        this.onViewableTargetBufferChanged = function (event) {
            return self.targetBuffer.set(event.newValue);
        };

        /** Syncs media time observable from viewable to this instance */
        this.onViewableMediaTimeObservableChanged = function (event) {
            return self.mediaTimeObservable.set(event.newValue);
        };

        /** Syncs media time from viewable to this instance */
        this.onMediaTimeChanged = function (event) {
            return self.mediaTime.set(event.newValue);
        };

        /** Syncs background state from viewable to this instance */
        this.onBackgroundChanged = function (event) {
            return self.background.set(event.newValue);
        };

        /** Syncs playback rate from viewable to this instance */
        this.onPlaybackRateChanged = function (event) {
            return self.playbackRate.set(event.newValue);
        };

        /** Syncs program ID from viewable to this instance */
        this.onProgramIdChanged = function (event) {
            return self.programId.set(event.newValue);
        };

        // ---- Session and render state ----

        /** @type {Object} Accumulated session statistics */
        this.sessionStats = {};

        /** @type {number} Timestamps for first render and load start */
        this.firstRenderTime = this.loadStartTime = 0;

        /** @type {EventEmitter} Internal event emitter for playback lifecycle events */
        this.nextState = new EventEmitter.jl();

        /** @type {Object} Buffered report data (FBa) */
        this.bufferedReportData = {};

        /** @type {boolean} Whether content playgraph has been received */
        this.contentPlaygraphPresent = false;

        /** @type {boolean} Whether playback quality has been reported */
        this.playbackQualityReported = false;

        /** @type {boolean} Whether the first frame has been rendered */
        this.firstRenderOccurred = false;

        // ---- Additional observable state ----

        /** @type {Observable<object|undefined>} Container dimensions (width, height) */
        this.containerDimensions = new Observable.currentBitrate(undefined);

        /** @type {Observable<number>} Playback lifecycle state (NOTLOADED -> LOADING -> NORMAL -> CLOSING -> CLOSED) */
        this.state = new Observable.currentBitrate(PlaybackState.NOTLOADED);

        /** @type {Observable<boolean>} Whether the player is actively playing (derived from presentingState) */
        this.mk = new Observable.currentBitrate(false);

        /** @type {Observable<boolean>} Whether playback is paused */
        this.paused = new Observable.currentBitrate(false);

        /** @type {Observable<boolean>} Whether audio is muted */
        this.muted = new Observable.currentBitrate(false);

        /** @type {Observable<number>} Volume level 0.0-1.0 */
        this.volume = new Observable.currentBitrate(playerConfig.config.internal_Lnc / 100);

        /** @type {Observable<string>} Presenting state (WAITING, PLAYING, PAUSED) */
        this.presentingState = new Observable.currentBitrate(PresentingState.WAITING);

        /** @type {Observable<string>} Combined playgraph buffering state */
        this.playgraphState = new Observable.currentBitrate(BufferingState.BUFFERING);

        /** @type {Observable<string>} Audio/video buffering state */
        this.avBufferingState = new Observable.currentBitrate(BufferingState.BUFFERING);

        /** @type {Observable<string>} Text/subtitle buffering state */
        this.textBufferingState = new Observable.currentBitrate(BufferingState.BUFFERING);

        /** @type {Observable<number|null>} Media time as observed by the media source */
        this.mediaTimeObservable = new Observable.currentBitrate(null);

        /** @type {Observable<object|null>} Current target buffer information */
        this.targetBuffer = new Observable.currentBitrate(null);

        /** @type {Observable<number|null>} Current requested playback time */
        this.currentRequestedTime = new Observable.currentBitrate(null);

        /** @type {object} Throttled updater for this instance */
        this.throttledUpdater = throttleFactory.l1b(this);

        /** @type {Array<Observable>} Source buffer observables [audio, video, text] */
        this.sourceBufferArray = [
            new Observable.currentBitrate(null),
            new Observable.currentBitrate(null),
            new Observable.currentBitrate(null),
        ];

        /** @type {Object} Battery charging status history */
        this.batteryStatusHistory = {};

        /** @type {boolean} Whether ASE reporting is enabled */
        this.aseReportEnabled = false;

        /** @type {number} Buffer length and playback rate reference */
        this.bufferLength = this.playbackRateRef = -1;

        /**
         * Transforms a media time value through device monitoring if active.
         * Returns null for invalid values. Preserves the original if no
         * streaming session or device monitoring is inactive.
         *
         * @param {number|null} mediaTimeValue - Raw media time
         * @param {string} [segmentId] - Optional segment to check for manifest
         * @returns {number|null} Adjusted media time
         */
        this.transformMediaTime = function (mediaTimeValue, segmentId) {
            var streamingSession;
            mediaTimeValue = mediaTimeValue === undefined ? null : mediaTimeValue;
            if (!typeChecks.wc(mediaTimeValue)) return null;
            if (segmentId && !self.getPlaybackSegment(segmentId).manifestRef) return mediaTimeValue;
            streamingSession = self.streamingSession;
            if (streamingSession && streamingSession.isDeviceMonitored) {
                return self.streamingSession.kRa(mediaTimeValue);
            }
            return mediaTimeValue;
        };

        /** Bound handler: closes playback on document unload */
        this.onDocumentUnload = function () {
            self.closePlayback();
        };

        /**
         * Visibility change handler: auto-pauses when tab is hidden (if volume is 0),
         * auto-resumes when tab becomes visible again.
         */
        this.onVisibilityChange = function () {
            var pausedMeta;
            var isHidden = document.hidden;

            // Auto-pause when hidden if effectively muted
            if (self.effectiveVolume === 0 && isHidden && !self.paused.value) {
                self.paused.set(true, { QB: true });
                return false;
            }

            // Auto-resume when visible if we auto-paused
            if (!isHidden && self.paused.value) {
                pausedMeta = self.paused.sn;
                if (pausedMeta && pausedMeta.QB === true && !self.background.value) {
                    if (self.liveController.isLive && self.liveController.liveEdgeValue()) {
                        self.liveController.seekToLiveEdge();
                    }
                    self.paused.set(false, { QB: true });
                    return false;
                }
            }
        };

        // ---- Initialize playback identity ----

        /** @type {number} The initial movie ID (preserved for currentPlaybackViewable) */
        this.initialMovieId = movieId;

        /** @type {number} The currently active movie/viewable ID */
        this.movieId = movieId;

        // Public event API aliases
        this.addEventListener = this.nextState.addListener;
        this.removeEventListener = this.nextState.removeListener;
        this.fireEvent = this.nextState.emit;

        // ---- Create initial viewable segment ----
        this._initializeViewable(
            {
                J: movieId,
                currentViewableId: viewableConfig.aseGcSettings.main,
                M: segmentId,
                sessionContext: sessionContext || {},
            },
            playerConfig.config.enableManifestCache ? this.session.cB(movieId) : undefined,
            initialTime
        );

        // ---- Create logger and ad content manager ----
        this.log = loggerFactory.fetchOperation(this);
        this.adContentManager = adContentManagerFactory(this);
        this.networkEstimator = manifestVerifier(this);

        // ---- Create container DOM element ----
        this.containerElement = domFactory.createElement('DIV', constants.WJa, undefined, {
            id: this.viewableId,
        });

        // ---- Bind viewable GC settings to this instance ----
        this._bindViewableSettings();

        // ---- Create internal logger ----
        this.internalLogger = this.log.createLogger('Playback');

        // ---- Additional setup bindings ----
        playbackSetup.j5b(this);

        // ---- Register as active playback instance ----
        playbackRegistry.playbackInstanceHolder.activeInstance = this;
        if (!playbackRegistry.playbackInstanceHolder.jUa) {
            playbackRegistry.playbackInstanceHolder.jUa = this;
        }

        this.internalLogger.info('Playback created', this.playbackInfo);

        if (this.zIb) {
            this.internalLogger.info('Playback selected for trace playback info logging');
        } else {
            this.internalLogger.pauseTrace('Playback not selected for trace playback info logging');
        }

        // ---- Manifest cache integration ----
        if (playerConfig.config.enableManifestCache) {
            this.session.task(this.viewableId);

            this.addEventListener(PlayerEvents.YB, function () {
                self.session.RAc(self.viewableId);
                self.tracks.addListener([MediaType.TEXT_MEDIA_TYPE], function () {
                    self.session.$Db();
                });
                self.tracks.addListener([MediaType.V], function () {
                    self.session.$Db();
                });
            });

            this.addEventListener(PlayerEvents.clearTimeoutFn, function () {
                self.session.OAc(self.viewableId);
            });
        }

        // ---- State change logging ----
        this.state.addListener(function (event) {
            self.internalLogger.info('Playback state changed', {
                From: event.oldValue,
                To: event.newValue,
            });
            assertUtils.assert(event.newValue > event.oldValue);
        });

        // ---- Document unload listener ----
        documentEvents.writeBytes.addListener(documentEvents.downloadNode, this.onDocumentUnload, constants.eIa);

        // ---- Media time change throttling ----
        const mediaTimeThrottler = viewableConfigErrorFactory(timeUtils.ri(1));
        this.mediaTime.addListener(function () {
            self._emitMediaTimeChangedThrottled();
            mediaTimeThrottler.scheduleHydration(function () {
                return self._emitMediaTimeChangedDebounced();
            });
        });

        // ---- Presenting state logging ----
        this.presentingState.addListener(function (event) {
            self.internalLogger.info(
                'PresentingState changed',
                {
                    From: event.oldValue,
                    To: event.newValue,
                    MediaTime: mathUtils.zk(self.mediaTime.value),
                },
                self.utilService()
            );
        });

        // Derive "is playing" from presenting state
        this.presentingState.addListener(function () {
            self.mk.set(self.presentingState.value === PresentingState.PLAYING);
        });

        // ---- Buffering state logging ----
        this.playgraphState.addListener(function (event) {
            self.internalLogger.info(
                'BufferingState changed',
                {
                    From: event.oldValue,
                    To: event.newValue,
                    MediaTime: mathUtils.zk(self.mediaTime.value),
                },
                self.utilService()
            );
        });

        this.avBufferingState.addListener(function (event) {
            self.internalLogger.info(
                'AV BufferingState changed',
                {
                    From: event.oldValue,
                    To: event.newValue,
                    MediaTime: mathUtils.zk(self.mediaTime.value),
                },
                self.utilService()
            );
        });

        this.textBufferingState.addListener(function (event) {
            self.internalLogger.info(
                'Text BufferingState changed',
                {
                    From: event.oldValue,
                    To: event.newValue,
                    MediaTime: mathUtils.zk(self.mediaTime.value),
                },
                self.utilService()
            );
        });

        // ---- Track change logging ----
        this.tracks.addListener([MediaType.V], function (event) {
            assertUtils.assert(event.UE && event.UE.isMissing);
            self.internalLogger.info(
                'AudioTrack changed',
                event.UE && {
                    ToBcp47: event.UE.languageCode,
                    To: event.UE.trackId,
                },
                event.XE && {
                    FromBcp47: event.XE.languageCode,
                    From: event.XE.trackId,
                },
                { MediaTime: mathUtils.zk(self.mediaTime.value) }
            );
        });

        this.tracks.addListener([MediaType.TEXT_MEDIA_TYPE], function (event) {
            assertUtils.assert(!event.textTrackInfo || event.textTrackInfo.isMissing);
            self.internalLogger.info(
                'TimedTextTrack changed',
                event.textTrackInfo
                    ? { ToBcp47: event.textTrackInfo.languageCode, To: event.textTrackInfo.trackId }
                    : { To: 'none' },
                event.YT
                    ? { FromBcp47: event.YT.languageCode, From: event.YT.trackId }
                    : { From: 'none' },
                { MediaTime: mathUtils.zk(self.mediaTime.value) }
            );
        });

        // ---- First render and content presenting listeners ----
        this.presentingState.addListener(onFirstFrameRendered, constants.DX);
        this.presentingState.addListener(onFirstContentPresenting);

        this.addEventListener(PlayerEvents.YB, function () {
            self.contentPlaygraphPresent = true;
            self.initialPlayTime = self.x$();
            self.recordPlayDelay('start');
        });

        this.targetBuffer.addListener(onInitialTargetBufferChange);

        // ---- Additional init bindings ----
        playbackInitBindings.l5b(this);

        // ---- Register in global playback list ----
        playbackRegistry.tq.push(this);

        // ---- Viewable context / adapter (if enabled) ----
        if (playerConfig.config.gga) {
            this.viewableContext = this.viewableContextFactory(this);
            this.ViewableAdapter = new viewableAdapter.ViewableAdapterClass(this);
        }

        // ---- Run registered playback creation hooks ----
        playbackRegistry.iJa.forEach(function (hook) {
            hook(self);
        });

        // ---- ASE segment navigation handler (deferred setup) ----
        this._setupAseSegmentNavigation = function () {
            self.addEventListener(PlayerEvents.D3, function (event) {
                var streamingSession, combinedPlaygraph, matchingSegmentKey;
                var cause = event.cause;
                var isSkip = event.skip;
                var targetPosition = event.OT;
                var fromPosition = event.XT;
                var segmentViewableId = event.R;
                var encryptionMetadata = event.encryptionMetadata;

                if (cause === StreamState.SEGMENT_CHANGED || cause === StreamState.INITIAL) {
                    return;
                }

                streamingSession = self.streamingSession;
                if (streamingSession) streamingSession.aseTimer();

                if (isSkip) {
                    streamingSession = self.streamingSession;
                    if (streamingSession && streamingSession.parseData(targetPosition)) {
                        self.internalLogger.pauseTrace(
                            'Repositioned. Skipping from ' + fromPosition + ' to ' + targetPosition
                        );

                        var handleSkipError = function (error) {
                            self.log.error('streamingSession.skipped threw an exception', error);
                            var wrappedError = playerError.we.internal_Nra(errorCodes.ea.ASE_SKIPPED_THREW, error);
                            self.fireErrorEvent(wrappedError.code, wrappedError);
                        };

                        try {
                            self.streamingSession.skipped(targetPosition).then(function (result) {
                                var session;
                                if (!result.d1) {
                                    session = self.streamingSession;
                                    if (session) session.playing();
                                }
                            }).catch(handleSkipError);
                        } catch (error) {
                            handleSkipError(error);
                        }
                    } else {
                        self.log.error('can skip returned false');
                    }
                } else {
                    self.internalLogger.pauseTrace(
                        'Repositioned. Seeking from ' + fromPosition + ' to ' + targetPosition
                    );

                    try {
                        combinedPlaygraph = self.currentViewableConfig.BS(self.currentViewableConfig);
                        matchingSegmentKey = Object.keys(combinedPlaygraph.segments).find(function (key) {
                            var contentEnd;
                            var segment = combinedPlaygraph.segments[key];
                            return (
                                segment.J === segmentViewableId &&
                                segment.startTimeMs <= encryptionMetadata &&
                                ((contentEnd = segment.contentEndPts) !== null && contentEnd !== undefined
                                    ? contentEnd
                                    : Infinity) > encryptionMetadata
                            );
                        });

                        streamingSession = self.streamingSession;
                        if (streamingSession) {
                            streamingSession.seekWithTimeInterval(encryptionMetadata, matchingSegmentKey);
                        }
                    } catch (error) {
                        self.log.error('streamingSession.seekByContentPts threw an exception', error);
                        var seekError = playerError.we.internal_Nra(errorCodes.ea.ASE_SEEK_THREW, error);
                        self.fireErrorEvent(seekError.code, seekError);
                    }
                }
            });

            self.addEventListener(PlayerEvents.pt, function (event) {
                self.j4aHandler.pt(event);
                self.currentViewableConfig.playDelayMetrics.M0a(event.XT, event.OT);
            });
        };

        // ---- Playback rate change -> ASE notification ----
        this.playbackRate.addListener(function () {
            var session = self.streamingSession;
            if (session && session.isDeviceMonitored) {
                session.vPc();
            }
            self.fireEvent(PlayerEvents.internal_Tfa);
        });

        // ---- Underflow (rebuffer) handler ----
        this.addEventListener(PlayerEvents.iH, function (event) {
            var session;
            if (event.cause === playbackRegistry.gJa) {
                try {
                    self.playgraphState.set(BufferingState.BUFFERING);
                    session = self.streamingSession;
                    if (session) session.underflow(self.mediaSourceManager.RBb());
                } catch (error) {
                    self.log.error('streamingSession.underflow threw an exception', error);
                    var underflowError = playerError.we.internal_Nra(errorCodes.ea.ASE_UNDERFLOW_THREW, error);
                    self.fireErrorEvent(underflowError.code, underflowError);
                }
            }
        });

        // ---- Visibility change listener ----
        documentEvents.writeBytes.addListener(documentEvents.stateChangeEvent, this.onVisibilityChange);

        // ---- Apply initial manifest reference if provided ----
        if (initialManifestRef) {
            this.currentViewableConfig.manifestRef = initialManifestRef;
            this.manifestStore.CV(movieId, initialManifestRef);
        }
    }

    // ========================================================================
    // Delegated getters — proxy properties from the current viewable config
    // ========================================================================

    /** @returns {IterableIterator} All viewable segments */
    get allViewableSegments() {
        return this.viewableMap.values();
    }

    /** @returns {object} The current viewable's GC settings (by movieId) */
    get currentViewableConfig() {
        return this.viewableMap.key(this.movieId);
    }

    /** @returns {object} The viewable for the initial movie ID */
    get currentPlaybackViewable() {
        return this.getViewableById(this.initialMovieId);
    }

    /** @returns {number} The start PTS for playback (from seekTime or session context) */
    get startPts() {
        if (this.seekTime !== undefined) return this.seekTime;
        var firstViewable = this.allViewableSegments.next();
        var startPts =
            firstViewable && firstViewable.value
                ? firstViewable.value.sessionContext.startPts
                : undefined;
        return startPts !== null && startPts !== undefined ? startPts : 0;
    }

    /** @returns {object} The parsed manifest for the current viewable */
    get parsedManifest() {
        return this.currentViewableConfig.parsedManifest;
    }

    set parsedManifest(value) {
        this.currentViewableConfig.parsedManifest = value;
    }

    get internal_Kra() {
        return this.currentViewableConfig.sessionContext.internal_Kra;
    }

    get internal_Lra() {
        return this.currentViewableConfig.sessionContext.internal_Lra;
    }

    /** @returns {number} The viewable index */
    get index() {
        return this.currentViewableConfig.index;
    }

    /** @returns {string} The current segment ID */
    get segmentId() {
        return this.currentViewableConfig.M;
    }

    /** @returns {string} The initial or current segment ID for ASE */
    get initialSegmentId() {
        return this.currentViewableConfig.D8a
            ? this.currentViewableConfig.listenerInfo
            : this.currentViewableConfig.M;
    }

    /** @returns {object} The DRM/encryption session handler */
    get encryptionHandler() {
        return this.currentViewableConfig.hm;
    }

    set encryptionHandler(value) {
        this.currentViewableConfig.hm = value;
    }

    /** @returns {number} The transition timestamp */
    get transitionTime() {
        return this.currentViewableConfig.transitionTime;
    }

    set transitionTime(value) {
        this.currentViewableConfig.transitionTime = value;
    }

    /** @returns {string} The manifest source identifier (e.g., "ui", "videopreparer") */
    get manifestSource() {
        return this.currentViewableConfig.generateRandom;
    }

    set manifestSource(value) {
        this.currentViewableConfig.generateRandom = value;
    }

    /** @returns {object} Quality zone settings (qZ) */
    get qualityZone() {
        return this.currentViewableConfig.qZ;
    }

    set qualityZone(value) {
        this.currentViewableConfig.qZ = value;
    }

    /** @returns {number} Initial stream bitrate */
    get internal_Lta() {
        return this.currentViewableConfig.internal_Lta;
    }

    set internal_Lta(value) {
        this.currentViewableConfig.internal_Lta = value;
    }

    /** @returns {object} The manifest reference for the current viewable */
    get manifestRef() {
        return this.currentViewableConfig.manifestRef;
    }

    set manifestRef(value) {
        this.currentViewableConfig.manifestRef = value;
    }

    /** @returns {number} Seek time / hash query time */
    get seekTime() {
        return this.currentViewableConfig.hashQuery;
    }

    set seekTime(value) {
        this.currentViewableConfig.hashQuery = value;
    }

    /** @returns {object} Internal LHA reference */
    get lastStreamStartTime() {
        return this.currentViewableConfig.lastStreamStartTime;
    }

    set lastStreamStartTime(value) {
        this.currentViewableConfig.lastStreamStartTime = value;
    }

    /** @returns {object} The session context for the current viewable */
    get sessionContext() {
        return this.currentViewableConfig.sessionContext;
    }

    set sessionContext(value) {
        this.currentViewableConfig.sessionContext = value;
    }

    /** @returns {object} The media storage manager for the current viewable */
    get mediaStorageManager() {
        return this.currentViewableConfig.mediaStorageManager;
    }

    set mediaStorageManager(value) {
        this.currentViewableConfig.mediaStorageManager = value;
    }

    /** @returns {object} Play delay metrics tracker */
    get playDelayMetrics() {
        return this.currentViewableConfig.playDelayMetrics;
    }

    /** @returns {number} The viewable/movie ID for the current config */
    get viewableId() {
        return this.currentViewableConfig.R;
    }

    /** @returns {string} The manifest format (e.g., "trailer", "billboard") */
    get manifestFormat() {
        return this.currentViewableConfig.manifestFormat;
    }

    /** @returns {Array} Supported key system list for DRM */
    get supportedKeySystemList() {
        return this.currentViewableConfig.supportedKeySystemList;
    }

    /** @returns {Array} Encrypted content metadata */
    get encryptedContentMetadata() {
        return this.currentViewableConfig.encryptedContentMetadata;
    }

    /** @returns {Array} Trickplay track list */
    get trickplayTracks() {
        return this.currentViewableConfig.trickplayTracks;
    }

    /** @returns {Array} Subtitle/text track list (sk) */
    get textTrackList() {
        return this.currentViewableConfig.sk;
    }

    /** @returns {string} The playback context ID */
    get playbackContextId() {
        return this.currentViewableConfig.playbackContextId;
    }

    /** @returns {string} The auxiliary manifest token */
    get auxiliaryManifestToken() {
        return this.currentViewableConfig.auxiliaryManifestToken;
    }

    /** @returns {object} Additional track info (aT) */
    get additionalTrackInfo() {
        return this.currentViewableConfig.aT;
    }

    /** @returns {object} JU property */
    get JU() {
        return this.currentViewableConfig.JU;
    }

    /** @returns {string} The session info ID */
    get sessionInfoId() {
        return this.currentViewableConfig.sessionInfoId;
    }

    /** @returns {Array} DRM info array (di) */
    get drmInfo() {
        return this.currentViewableConfig.di;
    }

    /** @returns {object} Segment timestamp reference */
    get segmentTimestamp() {
        return this.currentViewableConfig.segmentTimestamp;
    }

    set segmentTimestamp(value) {
        this.currentViewableConfig.segmentTimestamp = value;
    }

    /** @returns {number} Source transaction ID */
    get sourceTransactionId() {
        return this.currentViewableConfig.sourceTransactionId;
    }

    /** @returns {number} The current viewable's main viewable ID */
    get currentViewableId() {
        return this.currentViewableConfig.currentViewableId;
    }

    /** @returns {string} The tracking ID */
    get TrackingId() {
        return this.currentViewableConfig.TrackingId;
    }

    /** @returns {object} Time offset reference */
    get timeOffset() {
        return this.currentViewableConfig.timeOffset;
    }

    /** @returns {object} Wall clock time reference (kI) */
    get kI() {
        return this.currentViewableConfig.kI;
    }

    set kI(value) {
        this.currentViewableConfig.kI = value;
    }

    /** @returns {string} The correlation ID */
    get correlationId() {
        return this.currentViewableConfig.correlationId;
    }

    /** @returns {object} LV property */
    get lV() {
        return this.currentViewableConfig.lV;
    }

    /** @returns {number} Seek target time */
    get seekTargetTime() {
        return this.currentViewableConfig.seekTargetTime;
    }

    /** @returns {object} Play delay timestamps map */
    get playDelayTimestamps() {
        return this.currentViewableConfig.playDelayTimestamps;
    }

    /** @returns {object} FW property */
    get fw() {
        return this.currentViewableConfig.fw;
    }

    /** @returns {object} Dropped frame reporter */
    get droppedFrameReporter() {
        return this.currentViewableConfig.droppedFrameReporter;
    }

    /** @returns {object} Bitrate selector (c2) */
    get bitrateSelector() {
        return this.currentViewableConfig.c2;
    }

    /**
     * Whether download reporting is enabled for this session.
     * Based on sourceTransactionId modulo the configured denominator.
     */
    get downloadReportEnabled() {
        var manifestConfig, streamingClientConfig;
        var denominator = playerConfig.config.downloadReportDenominator;
        var steeringInfo = this.manifestRef;

        streamingClientConfig =
            steeringInfo && steeringInfo.manifestContent && steeringInfo.manifestContent.steeringAdditionalInfo
                ? steeringInfo.manifestContent.steeringAdditionalInfo.streamingClientConfig
                : undefined;

        if (streamingClientConfig !== undefined && streamingClientConfig.downloadReportDenominator !== undefined) {
            try {
                denominator = parseInt(streamingClientConfig.downloadReportDenominator, 10);
            } catch (error) {
                this.log.error(
                    'Unable to parse manifest config override:' + streamingClientConfig.downloadReportDenominator
                );
            }
        }

        return denominator !== 0 && this.currentViewableConfig.sourceTransactionId % denominator === 0;
    }

    /** @returns {boolean} Whether track hydration is in progress */
    get internal_Aqa() {
        return this.currentViewableConfig.internal_Aqa;
    }

    /** @returns {object} The live controller for the current viewable */
    get liveController() {
        return this.currentViewableConfig.liveController;
    }

    /**
     * Effective volume: 0 if muted, otherwise the volume rounded to 2 decimal places.
     * Used for auto-pause logic on tab visibility change.
     */
    get effectiveVolume() {
        return this.muted.value ? 0 : Math.round(100 * this.volume.value) / 100;
    }

    /** @returns {object} Summary playback info for logging (MovieId, TrackingId, Xid) */
    get playbackInfo() {
        return {
            MovieId: this.viewableId,
            TrackingId: this.TrackingId,
            Xid: this.sourceTransactionId,
        };
    }

    /** @returns {string} The playgraph ID */
    get playgraphId() {
        return this.currentViewableConfig.playgraphId;
    }

    // ========================================================================
    // Play delay recording
    // ========================================================================

    /**
     * Records a play delay metric by name.
     * @param {string} metricName - The delay metric key (e.g., "ffr", "start", "ats", "at")
     * @param {number} [forMovieId] - Optional movie ID (defaults to current movieId)
     */
    recordPlayDelay(metricName, forMovieId) {
        forMovieId = forMovieId === undefined ? this.movieId : forMovieId;
        var viewable = this.viewableMap.key(forMovieId);
        if (viewable) viewable.recordPlayDelay(metricName);
    }

    /**
     * Delegates lM (play delay timestamp update) to the current viewable config.
     * @param {object} timestamps - Timestamp data to merge
     */
    updatePlayDelayTimestamps(timestamps) {
        this.currentViewableConfig.lM(timestamps);
    }

    // ========================================================================
    // Content / manifest queries
    // ========================================================================

    /**
     * @returns {boolean} Whether the current manifest contains a content playgraph
     */
    hasContentPlaygraph() {
        var manifestRef = this.manifestRef;
        return !!(manifestRef && manifestRef.manifestContent && manifestRef.manifestContent.contentPlaygraph);
    }

    /**
     * @returns {object} Jitter check result from the viewable config
     */
    checkJitter() {
        return this.currentViewableConfig.checkJitter();
    }

    /**
     * @returns {boolean} Whether the content contains advertisements
     */
    hasAdvertisements() {
        var manifestRef = this.manifestRef;
        var adverts = manifestRef ? manifestRef.manifestContent.adverts : undefined;
        var adBreakCount = adverts && adverts.adBreaks ? adverts.adBreaks.length : 0;
        var hasAdverts = adverts ? adverts.hasAdverts : false;
        var containerHasAds = this.playbackContainer ? this.playbackContainer.hasAdvertisements() : false;
        return adBreakCount > 0 || hasAdverts === true || containerHasAds === true;
    }

    /**
     * Checks if a given viewable ID matches the current viewable.
     * @param {number} viewableId
     * @returns {boolean}
     */
    isCurrentViewable(viewableId) {
        return viewableId !== undefined && viewableId === this.currentViewableId;
    }

    // ========================================================================
    // Viewable settings binding
    // ========================================================================

    /**
     * Binds all observable properties from the current viewable config to this instance,
     * so changes to the viewable propagate to the PlaybackInstance's own observables.
     * @private
     */
    _bindViewableSettings() {
        const self = this;

        this.tracks.addListener(
            [MediaType.V, MediaType.TEXT_MEDIA_TYPE, MediaType.U],
            function (event) {
                return self.currentViewableConfig.tracks.canResume({
                    Mc: event.qwa,
                    audioTrackSelection: event.UE,
                    textTrackSelection: event.textTrackInfo,
                });
            }
        );

        this.isSeeking.addListener(function (event) {
            return self.currentViewableConfig.isSeeking.set(event.newValue);
        });
        this.captionSettings.addListener(function (event) {
            return self.currentViewableConfig.captionSettings.set(event.newValue);
        });
        this.isStalled.addListener(function (event) {
            return self.currentViewableConfig.isStalled.set(event.newValue);
        });
        this.playbackRate.addListener(function (event) {
            return self.currentViewableConfig.playbackRate.set(event.newValue);
        });
        this.targetBuffer.addListener(function (event) {
            return self.currentViewableConfig.targetBuffer.set(event.newValue);
        });
        this.mediaTimeObservable.addListener(function (event) {
            return self.currentViewableConfig.mediaTimeObservable.set(event.newValue);
        });
        this.sourceBufferArray[MediaType.V].addListener(function (event) {
            return self.currentViewableConfig.sourceBufferArray[MediaType.V].set(event.newValue);
        });
        this.sourceBufferArray[MediaType.U].addListener(function (event) {
            return self.currentViewableConfig.sourceBufferArray[MediaType.U].set(event.newValue);
        });
        this.sourceBufferArray[MediaType.TEXT_MEDIA_TYPE].addListener(function (event) {
            return self.currentViewableConfig.sourceBufferArray[MediaType.TEXT_MEDIA_TYPE].set(event.newValue);
        });
        this.mediaTime.addListener(function (event) {
            return self.currentViewableConfig.mediaTime.set(event.newValue);
        });
        this.background.addListener(function (event) {
            return self.currentViewableConfig.background.set(event.newValue);
        });
        this.playbackRate.addListener(function (event) {
            return self.currentViewableConfig.playbackRate.set(event.newValue);
        });
        this.programId.addListener(function (event) {
            return self.currentViewableConfig.programId.set(event.newValue);
        });

        this.syncViewableState();
    }

    /**
     * Synchronizes all observable state from the current viewable config
     * into this PlaybackInstance. Called when the active viewable changes.
     */
    syncViewableState() {
        const self = this;

        if (this.currentViewableConfig === this._previousViewableConfig) return;

        this.currentViewableConfig.mediaTime.set(this.mediaTime.value);
        this.currentViewableConfig.background.set(this.background.value);
        this.currentViewableConfig.playbackRate.set(this.playbackRate.value);
        this.currentViewableConfig.programId.set(this.programId.value);

        this._addTrackListener(this.onTrackResumeCheck);

        this._addViewableObservableListener(
            function (config) { return config.captionSettings; },
            this.onViewableCaptionSettingsChanged
        );
        this._addViewableObservableListener(
            function (config) { return config.isSeeking; },
            this.onViewableSeekingChanged
        );
        this._addViewableObservableListener(
            function (config) { return config.isStalled; },
            this.onViewableStalledChanged
        );
        this._addViewableObservableListener(
            function (config) { return config.playbackRate; },
            this.onViewablePlaybackRateChanged
        );
        this._addViewableObservableListener(
            function (config) { return config.mediaTimeObservable; },
            this.onViewableMediaTimeObservableChanged
        );
        this._addViewableObservableListener(
            function (config) { return config.targetBuffer; },
            this.onViewableTargetBufferChanged
        );
        this._addViewableObservableListener(
            function (config) { return config.sourceBufferArray[MediaType.V]; },
            function (event) { return self.sourceBufferArray[MediaType.V].set(event.newValue); }
        );
        this._addViewableObservableListener(
            function (config) { return config.sourceBufferArray[MediaType.U]; },
            function (event) { return self.sourceBufferArray[MediaType.U].set(event.newValue); }
        );
        this._addViewableObservableListener(
            function (config) { return config.sourceBufferArray[MediaType.TEXT_MEDIA_TYPE]; },
            function (event) { return self.sourceBufferArray[MediaType.TEXT_MEDIA_TYPE].set(event.newValue); }
        );
        this._addViewableObservableListener(
            function (config) { return config.mediaTime; },
            this.onMediaTimeChanged
        );
        this._addViewableObservableListener(
            function (config) { return config.background; },
            this.onBackgroundChanged
        );
        this._addViewableObservableListener(
            function (config) { return config.playbackRate; },
            this.onPlaybackRateChanged
        );
        this._addViewableObservableListener(
            function (config) { return config.programId; },
            this.onProgramIdChanged
        );

        this.tracks.setTextTrack(this.currentViewableConfig.tracks.textTrackSelection);
        this.tracks.setAudioTrack(this.currentViewableConfig.tracks.audioTrackSelection, { RQ: true });
        this.tracks.setVideoTrack(this.currentViewableConfig.tracks.videoTrack);

        this.isSeeking.set(this.currentViewableConfig.isSeeking.value);
        this.captionSettings.set(this.currentViewableConfig.captionSettings.value);
        this.isStalled.set(this.currentViewableConfig.isStalled.value);
        this.playbackRate.set(this.currentViewableConfig.playbackRate.value);

        this._previousViewableConfig = this.currentViewableConfig;
    }

    /**
     * Adds a track listener, removing the previous viewable's listener first.
     * @private
     * @param {Function} callback
     */
    _addTrackListener(callback) {
        if (this._previousViewableConfig) {
            this._previousViewableConfig.tracks.removeListener(callback);
        }
        this.currentViewableConfig.tracks.addListener(
            [MediaType.V, MediaType.U, MediaType.TEXT_MEDIA_TYPE],
            callback
        );
    }

    /**
     * Adds an observable listener, removing the previous viewable's listener first.
     * @private
     * @param {Function} observableSelector - Selects the observable from viewable config
     * @param {Function} callback - The listener callback
     */
    _addViewableObservableListener(observableSelector, callback) {
        if (this._previousViewableConfig) {
            observableSelector(this._previousViewableConfig).removeListener(callback);
        }
        observableSelector(this.currentViewableConfig).addListener(callback);
    }

    /**
     * @returns {boolean} Whether seamless playback is allowed
     */
    isSeamlessAllowed() {
        var container = this.playbackContainer;
        return container ? container.hR() : true;
    }

    /**
     * @returns {boolean} Whether this is a live stream with ad support
     */
    isLiveWithAds() {
        var manifestRef = this.manifestRef;
        var adverts = manifestRef ? manifestRef.manifestContent.adverts : undefined;
        return this.liveController.isLive && !!(adverts && adverts.hasAdverts);
    }

    // ========================================================================
    // Loading / Initialization
    // ========================================================================

    /**
     * Begins loading the playback. Transitions from NOTLOADED to LOADING,
     * starts the async component loader, and fetches the manifest.
     * Can only be called once (replaces itself with a noop on first call).
     *
     * @param {number} asyncLoadStartTime - Timestamp when async load was requested
     */
    loading(asyncLoadStartTime) {
        const self = this;

        // Ensure loading() is called only once
        this.loading = function () {};

        this.asyncLoadStartTime = asyncLoadStartTime;

        if (this.state.value !== PlaybackState.NOTLOADED) return;
        if (this.isAsyncLoaderReady() && this.lnaController.isLoadInProgress()) return;

        this.internalLogger.info('Playback loading', this);
        this._transitionToLoading();
        this.recordPlayDelay('asl_load_start');

        var loader = this.asyncLoader;
        var startTime = loader.startTime;
        var endTime = loader.endTime;

        if (typeChecks.gd(startTime)) {
            if (typeChecks.gd(endTime)) {
                this.recordPlayDelay('asl_ended');
            } else {
                this.recordPlayDelay('asl_in_progress');
            }
        } else {
            this.recordPlayDelay('asl_not_started');
        }

        this.asyncLoader.internal_Nda(function (result) {
            self.recordPlayDelay('asl_load_complete');
            if (result.success) {
                self._onAsyncLoadComplete();
            } else {
                self.fireErrorEvent(result.errorCode || errorCodes.ea.INIT_ASYNCCOMPONENT, result);
            }
        });
    }

    /**
     * Initializes core playback objects after manifest authorization.
     * Creates the time reference, applies session context, and sets up the media pipeline.
     * @private
     */
    _initializeCoreObjects() {
        try {
            if (this.state.value !== PlaybackState.LOADING) return;

            this._updateContainerDimensions();

            this.seekTime = this.playerCoreFactory.sbc({
                LF: timeUtils.ellaSendRateMultiplier(this.startPts),
                R: this.viewableId,
                downloadNotify: this.segmentTimestamp,
                sessionContext: this.sessionContext,
                optimalDecoderBufferMilliseconds: this.sessionContext.isSeeking
                    ? playerConfig.config.optimalDecoderBufferMillisecondsBranching
                    : playerConfig.config.optimalDecoderBufferMilliseconds,
                liveController: this.liveController,
            }).toUnit(timeUtils.MILLISECONDS);

            this._applyPlaybackState();
            this._initializeMediaPipeline();
        } catch (error) {
            this.fireErrorEvent(errorCodes.ea.INIT_CORE_OBJECTS2, {
                Ya: errorCodes.EventTypeEnum.EXCEPTION,
                configFlag: parseUtils.initializeModel(error),
            });
        }
    }

    /**
     * Updates the container dimensions based on the largest video stream resolution.
     * @private
     */
    _updateContainerDimensions() {
        var currentDimensions = this.containerDimensions.value;
        var maxDimensions = { width: 1, height: 1 };

        this.getVideoStreams({ YWb: true }).forEach(function (stream) {
            if (maxDimensions.width * maxDimensions.height < stream.width * stream.height) {
                maxDimensions = { width: stream.width, height: stream.height };
            }
        });

        var widthChanged = maxDimensions.height !== (currentDimensions ? currentDimensions.height : undefined);
        var heightChanged = maxDimensions.width !== (currentDimensions ? currentDimensions.width : undefined);

        if (widthChanged || heightChanged) {
            this.containerDimensions.set(maxDimensions);
        }
    }

    /**
     * Called when the playgraph/segment map is updated.
     * Refreshes segment data and notifies the streaming session.
     */
    onPlaygraphUpdated() {
        var session = this.streamingSession;
        var playgraphData = this.currentViewableConfig.BS(this);
        this.handleSegmentUpdates(playgraphData);
        if (session) session.updatePlaygraphMap(playgraphData);
    }

    /**
     * Handles notification that a segment has changed in the playgraph.
     * @param {string} segmentId - The new segment ID
     */
    onNextSegmentChanged(segmentId) {
        var session = this.streamingSession;
        assertUtils.assert(this.streamingSession, 'ASE should be initialized');

        var segmentData = this.currentViewableConfig.cca(segmentId);
        if (!segmentData) {
            this.log.RETRY('onNextSegmentChanged: Next segment not found');
            return;
        }

        if (segmentId === this.currentViewableConfig.listenerInfo) {
            if (!this.streamingSession.mpa(segmentData, true)) {
                this._transitionToSegment(segmentData, {});
            }
        } else {
            if (session) session.notifyEvent(segmentId, segmentData, false, true);
        }
    }

    /**
     * Transitions to a new segment, performing either a seamless switch or a seek.
     *
     * @param {string} segmentId - Target segment ID
     * @param {object} sessionData - Additional session data to merge
     * @param {boolean} [forceSeek=true] - Whether to force a seek even for seamless transitions
     * @returns {Promise}
     */
    _transitionToSegment(segmentId, sessionData, forceSeek) {
        const self = this;
        forceSeek = forceSeek === undefined ? true : forceSeek;

        var segmentInfo = this.currentViewableConfig.getSegmentInfo(segmentId);

        // Check if we can do a same-viewable seek
        if (this.seekableCheck.xBa && this.currentViewableConfig.aseGcSettings.J === segmentInfo.J) {
            return Promise.resolve(
                this.mediaSourceManager.seek(segmentInfo.startTimeMs, StreamState.SEEK, undefined)
            );
        }

        var manifestData = this.indexManager.KS(segmentInfo.J);
        sessionData = sessionDataMerger.mergeSessionData(manifestData.manifestSessionData, sessionData);

        var session = this.streamingSession;
        if (!session || !session.isDeviceMonitored) {
            throw Error('No streaming session');
        }

        this.debugLog('Transition ' + this.currentViewableConfig.listenerInfo + '->' + segmentId);

        var viewableSegment = this.getPlaybackSegment(segmentId);
        viewableSegment.transitionTime = this.lastVideoSync.getCurrentTime().toUnit(timeUtils.MILLISECONDS);
        viewableSegment.sessionContext = sessionData;

        var transitionType = this.currentViewableConfig.getSegmentInfo(segmentId).fe;
        transitionType = transitionType !== null && transitionType !== undefined ? transitionType : 'seamless';

        if (transitionType !== 'seamless' || forceSeek) {
            var transitionPromise;
            if (this.streamingSession.getSegmentData(segmentId).r$) {
                transitionPromise = this._transitionWithData(segmentId, viewableSegment.R);
            } else {
                transitionPromise = this._transitionWithSeek(segmentId, viewableSegment.R);
            }
            return transitionPromise.then(function () {
                self._onViewableTransitioned(viewableSegment.R);
            });
        }

        return Promise.resolve();
    }

    /**
     * Performs a seek-based transition when ASE has no data for the target segment.
     * @private
     * @param {string} segmentId
     * @param {number} viewableId
     * @returns {Promise}
     */
    _transitionWithSeek(segmentId, viewableId) {
        var startTimeMs = this.currentViewableConfig.segmentArray.segments[segmentId].startTimeMs;
        this.debugLog('NO DATA ' + segmentId + ', SEEKING ' + startTimeMs + ', viewableId: ' + viewableId);
        return Promise.resolve(
            this.mediaSourceManager.seek(startTimeMs, StreamState.SEEK, segmentId, true)
        );
    }

    /**
     * Performs a data-driven transition when ASE has buffered data for the target segment.
     * Waits for ASE stop and reposition events, then either skips or seeks.
     * @private
     * @param {string} segmentId
     * @param {number} viewableId
     * @returns {Promise}
     */
    _transitionWithData(segmentId, viewableId) {
        const self = this;
        var session = this.streamingSession;

        if (!session || !session.isDeviceMonitored) {
            throw Error('No streaming session');
        }

        var stopPromise = new Promise(function (resolve) {
            function onStop() {
                session.removeEventListener('stop', onStop);
                resolve();
            }
            session.addEventListener('stop', onStop);
        });

        var wasSkip = false;
        var repositionPromise = new Promise(function (resolve) {
            function onReposition(event) {
                self.removeEventListener(PlayerEvents.D3, onReposition);
                session.aseTimer();
                wasSkip = event.skip;
                resolve();
            }
            self.addEventListener(PlayerEvents.D3, onReposition);
        });

        var combinedPromise = Promise.all([stopPromise, repositionPromise]).then(function () {
            var chooseSuccess = false;
            if (wasSkip) {
                chooseSuccess = session.mpa(segmentId, false);
            }
            if (!chooseSuccess) {
                self.debugLog(
                    'Seek forced - ASE chooseNextSegment failed. Likely ASE entered panic mode and chose a default segment.'
                );
                return self._transitionWithSeek(segmentId, viewableId);
            }
        });

        var seekTime = session.mRa(
            segmentId,
            this.currentViewableConfig.segmentArray.segments[segmentId].startTimeMs
        );

        this.mediaSourceManager.seek(seekTime, StreamState.SEGMENT_CHANGED, segmentId, true);

        return combinedPromise;
    }

    // ========================================================================
    // Viewable creation and manifest management
    // ========================================================================

    /**
     * Creates or retrieves a viewable segment for the given configuration.
     * @private
     * @param {object} config - { J: movieId, currentViewableId, M: segmentId, sessionContext, ze, internal_Fdc }
     * @param {number} [transactionId] - Source transaction ID
     * @param {object} [timeReference] - Time reference for the viewable
     */
    _initializeViewable(config, transactionId, timeReference) {
        transactionId = transactionId === undefined ? this.transactionIdGenerator.wH() : transactionId;
        timeReference = timeReference === undefined ? this.lastVideoSync.getCurrentTime() : timeReference;

        var enableTraceLogging = !!playerConfig.config.tXb && !(transactionId % playerConfig.config.tXb);
        var movieId = config.J;
        var mainViewableId = config.currentViewableId;
        var segmentId = config.M;
        var sessionContext = config.sessionContext;
        var auxiliaryOptions = config.ze;

        var viewableSegment;

        if (this.viewableMap.has(movieId)) {
            viewableSegment = this.viewableMap.key(movieId);
        } else {
            viewableSegment = this.drmSessionFactory(
                playbackRegistry.playbackInstanceHolder.index++,
                movieId,
                segmentId,
                sessionContext,
                transactionId,
                timeReference,
                enableTraceLogging,
                this.currentViewableConfig,
                this.transformMediaTime,
                auxiliaryOptions,
                mainViewableId,
                this
            );

            this.viewableMap.set(movieId, viewableSegment);

            if (this.viewableMap.size > 1) {
                viewableSegment.mediaStorageManager = this.isCurrentViewable(viewableSegment.currentViewableId)
                    ? this.mediaStorageManager
                    : this.analyticsService.create(this, viewableSegment, false, this.transformMediaTime);
            }

            viewableSegment.c2 = new bitrateSelector.$gb(this, viewableSegment);

            var auxManifestToken = auxiliaryOptions ? auxiliaryOptions.auxiliaryManifestToken : undefined;

            var auxiliaryManifest = config.internal_Fdc;
            if (!auxiliaryManifest) {
                var currentManifestRef = this.currentViewableConfig.manifestRef;
                var auxManifests = currentManifestRef ? currentManifestRef.auxiliaryManifests : undefined;
                if (auxManifests) {
                    auxiliaryManifest = auxManifests.find(function (manifest) {
                        return (
                            manifest.manifestContent.R === movieId &&
                            (auxManifestToken === undefined ||
                                manifest.manifestContent.auxiliaryManifestToken === auxManifestToken)
                        );
                    });
                }
            }

            if (auxiliaryManifest) {
                this._applyManifest(auxiliaryManifest, viewableSegment);
            } else if (this.viewableMap.size > 1 && this.manifestStore.hasManifestCached(viewableSegment.R)) {
                this._queueManifestFetch(viewableSegment);
            }
        }
    }

    /**
     * Updates a segment's manifest for an auxiliary viewable (e.g., ad content).
     * @param {number} viewableId - Target viewable ID
     * @param {object} requestOptions - Manifest request options with auxiliaryManifestInfo
     * @param {number} transactionId - Source transaction ID
     * @param {object} manifestOverride - Optional manifest override
     */
    updateSegmentManifest(viewableId, requestOptions, transactionId, manifestOverride) {
        const self = this;

        assertUtils.assert(
            requestOptions.auxiliaryManifestInfo,
            'Auxiliary viewable config request options must have auxiliary options'
        );

        var auxInfo = requestOptions.auxiliaryManifestInfo;
        var auxToken = auxInfo.auxiliaryManifestToken;
        var parentId = auxInfo.parentManifestId;

        if (!parentId || !this._hasViewable(parentId)) return;

        var parentManifest = this.getViewableById(parentId).manifestRef;
        var parentContent = parentManifest ? parentManifest.manifestContent : undefined;

        var auxiliaryOptions = {
            Kb: auxToken,
            bF: this.playbackContextId,
            parentManifestId: parentId,
            jfa: parentContent,
            execPointer: requestOptions.execPointer,
        };

        var session = this.streamingSession;
        assertUtils.assert(
            session && session.playgraphSegmentMap,
            'If we have auxiliary viewables combined playgraph must exist'
        );

        var playgraphMap = session ? session.playgraphSegmentMap : undefined;
        if (!playgraphMap || !playgraphMap.segments) return;

        var matchingSegmentKey = Object.keys(playgraphMap.segments).find(function (key) {
            var map = self.streamingSession ? self.streamingSession.playgraphSegmentMap : undefined;
            return map ? map.segments[key].J === viewableId : false;
        });

        if (!matchingSegmentKey && this.isLiveWithAds()) {
            matchingSegmentKey = 'placeholder-segmentId-' + viewableId;
        }

        assertUtils.assert(
            !!matchingSegmentKey,
            'Segment for the auxiliary viewable should exist in the combined playgraph'
        );

        if (matchingSegmentKey) {
            this._initializeViewable(
                {
                    Fdc: manifestOverride,
                    ze: auxiliaryOptions,
                    sessionContext: { AE: true, isSeeking: false, JC: Date.now() },
                    M: matchingSegmentKey,
                    J: viewableId,
                },
                transactionId
            );
        }
    }

    /**
     * Checks if a viewable exists in the viewable map.
     * @private
     * @param {number} viewableId
     * @returns {boolean}
     */
    _hasViewable(viewableId) {
        return !!this.viewableMap.has(viewableId);
    }

    /**
     * Checks if a segment ID is valid by trying to resolve its playback segment.
     * @param {string} segmentId
     * @returns {boolean}
     */
    isSegmentValid(segmentId) {
        try {
            this.getPlaybackSegment(segmentId);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Returns the viewable config for a given viewable/movie ID.
     * @param {number} viewableId
     * @returns {object} The viewable configuration
     * @throws {Error} If the viewable is not found
     */
    getViewableById(viewableId) {
        if (viewableId === viewableConstants.viewableId) return this.currentViewableConfig;
        if (!this.viewableMap.has(viewableId)) {
            throw Error('Playback segment not found: ' + viewableId);
        }
        return this.viewableMap.key(viewableId);
    }

    /**
     * Resolves a segment ID to the correct viewable configuration.
     * Searches the viewable map, then falls back to the playgraph map,
     * and finally returns the current viewable config as default.
     *
     * @param {string} segmentId
     * @returns {object} The viewable configuration for this segment
     */
    getPlaybackSegment(segmentId) {
        // First, search the viewable map
        for (var iterator = this.allViewableSegments, entry = iterator.next(); !entry.done; entry = iterator.next()) {
            if (entry.value.M === segmentId) {
                return entry.value;
            }
        }

        // Then check the playgraph map
        var session = this.streamingSession;
        var playgraphMap = session ? session.playgraphSegmentMap : undefined;

        if (playgraphMap && playgraphMap.segments && playgraphMap.segments[segmentId]) {
            var movieId = session.playgraphSegmentMap.segments[segmentId].J;
            var matched;

            if (this.currentPlaybackViewable.R === movieId) {
                matched = this.currentPlaybackViewable;
            }

            return matched !== null && matched !== undefined ? matched : this.getViewableById(movieId);
        }

        // Default to current viewable config
        return this.currentViewableConfig;
    }

    /**
     * Finds a cached auxiliary manifest by viewable ID.
     * @param {number} viewableId
     * @returns {object|undefined}
     */
    findManifestById(viewableId) {
        return this.auxiliaryManifestCache.key(viewableId);
    }

    /**
     * Queues a manifest fetch for a viewable that has a cached manifest.
     * @private
     * @param {object} viewableSegment
     * @returns {Promise}
     */
    _queueManifestFetch(viewableSegment) {
        const self = this;
        var viewableId = viewableSegment.R;

        this.indexManager.sXc(viewableId);

        return this._fetchManifest(viewableSegment)
            .then(function (manifest) {
                self._applyManifest(manifest, viewableSegment);

                var prepPromise = viewableSegment.aT
                    ? self.mediaSourceElement.JE.tUc(viewableSegment)
                    : Promise.resolve();

                self._prepareSubtitles(viewableSegment);

                return prepPromise.then(function () {
                    return self.indexManager.iSb(viewableId);
                });
            })
            .catch(function (error) {
                self.log.error('queueManifest failed', error);
                self.indexManager.rXc(viewableId, error);
                throw self.viewableConfig(error.code, error);
            });
    }

    /**
     * Fetches the main manifest for the primary viewable.
     * @returns {Promise<object>} The manifest response
     */
    fetchMainManifest() {
        var viewableConfig = this.currentViewableConfig;

        assertUtils.assert(
            viewableConfig.currentViewableId !== undefined,
            'segment should have mainViewableId defined to fetch main manifest'
        );

        viewableConfig.sourceTransactionId =
            viewableConfig.sourceTransactionId !== null && viewableConfig.sourceTransactionId !== undefined
                ? viewableConfig.sourceTransactionId
                : this.transactionIdGenerator.wH();

        var playgraphData = this.currentViewableConfig.BS(this);
        var segmentKey = Object.keys(playgraphData.segments).find(function (key) {
            return playgraphData.segments[key].J === viewableConfig.currentViewableId;
        });

        var flavor = manifestFlavors.qq.$r;
        var sessionContext = { AE: true, isSeeking: false };

        if (segmentKey) {
            var segment = playgraphData.segments[segmentKey];
            var existingSessionData = this.indexManager.KS(viewableConfig.currentViewableId).manifestSessionData;

            sessionContext = Object.assign(
                existingSessionData !== null && existingSessionData !== undefined
                    ? existingSessionData
                    : this.sessionContext,
                {
                    Nb: segment.startTimeMs,
                    xmlGetterFn: segment.contentEndPts,
                    isSeeking: false,
                    JC: Date.now(),
                    isAutoPlay: true,
                }
            );

            this._initializeViewable({
                J: viewableConfig.currentViewableId,
                currentViewableId: viewableConfig.currentViewableId,
                M: segmentKey,
                sessionContext: sessionContext,
            }, viewableConfig.sourceTransactionId);
        }

        if (playerConfig.config.enableManifestCache && this.manifestStore.hasManifestCached(this.viewableId)) {
            return this.manifestStore.getCachedManifest(this.viewableId);
        }

        return this.manifestStore.fetchManifest(
            {
                Ia: viewableConfig.sourceTransactionId,
                sessionContext: sessionContext,
                J: viewableConfig.currentViewableId,
                flavor: flavor,
                type: undefined,
                CJ: undefined,
                ze: undefined,
            },
            this.abortController.signal,
            false
        );
    }

    /**
     * Pre-fetches ad manifests for DAI (Dynamic Ad Insertion).
     * @param {object} options - Contains $y, t$, auxiliaryManifestInfo
     * @returns {Promise<object>} Ad manifest data
     */
    prefetchAdManifest(options) {
        const self = this;
        var $y = options.$y;
        var t$ = options.t$;
        var auxInfo = options.auxiliaryManifestInfo;
        var auxToken = auxInfo.auxiliaryManifestToken;
        var parentId = auxInfo.parentManifestId;

        var parentViewable = this.getViewableById(parentId);
        var flavor = manifestFlavors.qq.$r;

        return this.manifestStore
            .fetchManifest(
                {
                    Ia: parentViewable.sourceTransactionId,
                    sessionContext: { AE: true, isSeeking: false, JC: Date.now() },
                    J: parentViewable.R,
                    flavor: flavor,
                    type: undefined,
                    $y: $y,
                    t$: t$,
                    ze: { Kb: auxToken, bF: parentViewable.playbackContextId },
                },
                this.abortController.signal,
                false
            )
            .then(function (response) {
                self.manifestStore.xOb();
                response.auxiliaryManifests.forEach(function (manifest) {
                    self.manifestStore.CV(manifest.manifestContent.R, manifest);
                    self.auxiliaryManifestCache.set(manifest.manifestContent.R, manifest);
                });
                if (!response.manifestContent.adverts) {
                    throw Error('Dai prefetch request has no adverts forparentViewableId: ' + parentId);
                }
                return response.manifestContent.adverts;
            });
    }

    /**
     * Hydrates an ad break manifest.
     * @param {object} options - Contains auxiliaryManifestInfo, adBreakToken, hb
     * @returns {Promise<object>} The hydrated ad break
     */
    hydrateAdBreak(options) {
        const self = this;

        assertUtils.assert(
            options.auxiliaryManifestInfo,
            'auxiliaryOptions must exist if an adBreak hydration was requested'
        );

        var auxInfo = options.auxiliaryManifestInfo;
        var auxToken = auxInfo.auxiliaryManifestToken;
        var parentId = auxInfo.parentManifestId;
        var adBreakToken = options.adBreakToken;
        var triggerId = options.hb;

        assertUtils.assert(!!auxToken, 'auxiliaryManifestToken must exist if an adBreak hydration was requested');

        var parentViewable = this.getViewableById(options.auxiliaryManifestInfo.parentManifestId);
        var flavor = manifestFlavors.qq.$r;

        return this.manifestStore
            .fetchManifest(
                {
                    Ia: parentViewable.sourceTransactionId,
                    sessionContext: { AE: true, isSeeking: false, JC: Date.now() },
                    J: parentViewable.R,
                    flavor: flavor,
                    type: undefined,
                    CJ: undefined,
                    ze: {
                        Pj: adBreakToken,
                        hb: triggerId,
                        auxiliaryManifestToken: auxToken,
                        parentManifestId: parentId,
                        bF: parentViewable.playbackContextId,
                    },
                },
                this.abortController.signal,
                false
            )
            .then(function (response) {
                response.auxiliaryManifests.forEach(function (manifest) {
                    self.auxiliaryManifestCache.set(manifest.manifestContent.R, manifest);
                });
                if (!response.manifestContent.adverts || !response.manifestContent.adverts.adBreaks.length) {
                    throw Error(
                        'AdBreak hydration request came with no adBreak forparentViewableId: ' +
                            parentId +
                            ', adBreakToken: ' +
                            adBreakToken +
                            ', adBreakTriggerId: ' +
                            triggerId
                    );
                }
                return response.manifestContent.adverts.adBreaks[0];
            });
    }

    // ========================================================================
    // Play delay / timing metrics
    // ========================================================================

    /**
     * Computes the async load duration (at - ats).
     * @returns {number|undefined}
     */
    getAsyncLoadDuration() {
        if (typeChecks.wc(this.playDelayTimestamps.ats) && typeChecks.wc(this.playDelayTimestamps.at)) {
            return this.playDelayTimestamps.at - this.playDelayTimestamps.ats;
        }
    }

    /**
     * @returns {number} The minimum of video and audio buffer lengths in milliseconds
     */
    getBufferedTime() {
        var videoBuffer = this.getVideoBufferLength();
        var audioBuffer = this.getAudioBufferLength();
        return Math.min(videoBuffer, audioBuffer);
    }

    /**
     * Starts the inactivity monitor (auto-stops playback after idle timeout).
     */
    startInactivityMonitor() {
        if (!this.background.value) {
            this.internalLogger.info('Starting inactivity monitor for movie ' + this.viewableId);
            new inactivityMonitor.W1b(this);
        }
    }

    // ========================================================================
    // Close / shutdown
    // ========================================================================

    /**
     * Begins closing the playback, with an optional callback when fully closed.
     * @param {Function} [callback] - Called when the playback reaches CLOSED state
     */
    closing(callback) {
        if (callback) {
            if (this.state.value === PlaybackState.CLOSED) {
                callback();
            } else {
                this.addEventListener(PlayerEvents.closed, function () {
                    callback();
                });
            }
        }
        this.closePlayback();
    }

    // ========================================================================
    // Error handling
    // ========================================================================

    /**
     * Creates and fires a fatal error, triggering playback close.
     * @param {string} errorCode
     * @param {object} [errorData]
     * @param {*} [extra]
     */
    fireError(errorCode, errorData, extra) {
        var error = this.viewableConfig(errorCode, errorData, extra);
        this._handleFatalError(error, undefined);
    }

    /**
     * Handles a fatal error: logs it, optionally delays handling, then closes.
     * @private
     * @param {object} error - The error object
     * @param {Function} [onCloseCallback] - Optional callback after close
     */
    _handleFatalError(error, onCloseCallback) {
        const self = this;

        var session = this.streamingSession;
        var mediaSourceManager = this.mediaSourceManager;
        var currentTime = this.lastVideoSync.getCurrentTime().lowestWaterMarkLevelBufferRelaxed(this.timeOffset);

        errorCodes.hka(
            error.errorCode,
            error.errorcode,
            currentTime.toUnit(timeUtils.MILLISECONDS),
            mediaSourceManager ? mediaSourceManager.YA() : undefined
        ) ||
            this.errorDelayConfig.item(
                this.playerCore.systemClock,
                this.encryptionHandler ? this.encryptionHandler.encryptionSession.observeKey : undefined,
                error.errorCode,
                error.errorcode,
                error.errorSubcode
            );

        error.vSb(this.firstRenderOccurred);

        if (this.state.value === PlaybackState.NOTLOADED) {
            // If not yet loaded, store the error and start loading (which will pick it up)
            if (!this.lastError) {
                this.lastError = error;
                this.loading();
            }
            return;
        }

        if (onCloseCallback) {
            if (this.state.value === PlaybackState.CLOSED) {
                onCloseCallback();
            } else {
                this.addEventListener(PlayerEvents.closed, function () {
                    onCloseCallback();
                });
            }
        }

        var closeNow = function () {
            self.closePlayback(error);
        };

        var delayConfig = playerConfig.config.lxb && error ? playerConfig.config.lxb[error.errorCode] : undefined;
        var delayMs = -1;

        if (typeChecks.n1(delayConfig)) {
            delayMs = parseUtils.parseInteger(delayConfig);
        }

        this.internalLogger.error('Fatal playback error', {
            Error: '' + error,
            HandleDelay: '' + delayConfig,
        });

        if (delayMs >= 0) {
            setTimeout(closeNow, delayMs);
        } else {
            closeNow();
        }
    }

    /**
     * Appends a debug log entry with the current time and segment ID.
     * @param {string} message
     */
    debugLog(message) {
        var segmentId = this.segmentId;
        var entry =
            this.lastVideoSync.getCurrentTime().toUnit(timeUtils.MILLISECONDS) + '-' + segmentId + '-' + message;
        this.$Nb.push(entry);
    }

    /**
     * @returns {object} Upstream bandwidth estimation data
     */
    getUpstreamData() {
        return this.currentViewableConfig.UVa();
    }

    /**
     * Triggers an immediate media time change notification.
     */
    notifyMediaTimeChanged() {
        this._emitMediaTimeChangedDebounced();
    }

    /**
     * @returns {string|null} The current ASE stream state ID, or null
     */
    getAseStreamStateId() {
        var session = this.streamingSession;
        if (session && session.isDeviceMonitored) {
            var stateId = session.getStreamState().id;
            if (stateId !== undefined) return stateId;
        }
        return null;
    }

    /**
     * @returns {Array<number>} Unique viewable IDs from the current playgraph
     */
    getPlaygraphViewableIds() {
        var playgraphData = this.currentViewableConfig.BS(this);
        var movieIds = Object.values(playgraphData.segments).map(function (segment) {
            return segment.J;
        });
        return [].concat(Array.from(new Set(movieIds)));
    }

    /**
     * Calculates the remaining playback duration, if available.
     * @returns {number|undefined}
     */
    getRemainingDuration() {
        var manifestRef, duration;

        if (this.currentViewableId) {
            var viewable = this.viewableMap.key(this.currentViewableId);
            manifestRef = viewable ? viewable.manifestRef : undefined;
            duration = manifestRef ? manifestRef.manifestContent.duration : undefined;
        } else {
            manifestRef = this.manifestRef;
            duration = manifestRef ? manifestRef.manifestContent.duration : undefined;
        }

        if (duration) {
            return this.currentViewableConfig.eya.qWc(
                this.getCurrentMediaTime(),
                this.currentViewableConfig.listenerInfo,
                duration
            );
        }
    }

    /**
     * @returns {number|null} The current media time, adjusted through device monitoring if active
     */
    getCurrentMediaTime() {
        var session = this.streamingSession;
        var isMonitored = session ? session.isDeviceMonitored : undefined;

        if (this.currentViewableConfig.V$ === undefined || isMonitored) {
            return this.transformMediaTime(this.mediaTime.value);
        }
        return this.currentViewableConfig.V$;
    }

    /**
     * @returns {number|null} The current media time from the media source, clamped to segment bounds
     */
    getMediaSourceTime() {
        var rawTime = this.transformMediaTime(this.mediaSourceManager.RBb());
        if (rawTime === null) return null;
        return Math.min(
            this.segmentTimestamp.toUnit(timeUtils.MILLISECONDS),
            Math.max(0, rawTime)
        );
    }

    /**
     * @returns {object|undefined} The choice map segments (for branched/interactive content)
     */
    getChoiceMapSegments() {
        var manifestRef = this.manifestRef;
        var choiceMap = manifestRef ? manifestRef.manifestContent.choiceMap : undefined;
        return choiceMap ? choiceMap.segments : undefined;
    }

    /**
     * Updates the session context with additional data and reapplies playback state.
     * @param {object} additionalData
     */
    updateSessionContext(additionalData) {
        this.sessionContext = sessionDataMerger.mergeSessionData(this.sessionContext, additionalData);
        this._applyPlaybackState();
    }

    /**
     * Resolves the target viewable ID for a given options object.
     * @param {object} [options]
     * @returns {number} The resolved viewable/movie ID
     */
    resolveTargetViewableId(options) {
        if (options && options.J) return options.J;
        if (options && options.YWb && this.mR) {
            if (this.mR.J === viewableConstants.viewableId) {
                var defaultNext = this.mR.defaultNext;
                if (defaultNext && this.streamingSession && this.streamingSession.playgraphSegmentMap) {
                    return this.streamingSession.playgraphSegmentMap.segments[defaultNext].J;
                }
                return this.viewableId;
            }
            return this.mR.J;
        }
        return this.viewableId;
    }

    /**
     * @returns {Array} Audio streams for the current or target viewable
     */
    getAudioStreams() {
        var audioTrack = this.getViewableById(this.resolveTargetViewableId(undefined)).tracks.audioTrackSelection;
        return audioTrack ? audioTrack.streams : [];
    }

    /**
     * @param {object} [options] - Options with optional J (viewable ID) or YWb flag
     * @returns {Array} Video streams for the target viewable
     */
    getVideoStreams(options) {
        var videoTrack = this.getViewableById(this.resolveTargetViewableId(options)).tracks.videoTrack;
        return videoTrack ? videoTrack.streams : [];
    }

    /**
     * Finds a DRM info entry by its ID across all viewables.
     * @param {string} drmInfoId
     * @returns {object|undefined}
     */
    findDrmInfoById(drmInfoId) {
        for (var iter = this.allViewableSegments, entry = iter.next(); !entry.done; entry = iter.next()) {
            var drmInfoList = entry.value.di;
            var found = drmInfoList && drmInfoList.find(function (info) {
                return info.id === drmInfoId;
            });
            if (found) return found;
        }
    }

    /**
     * Prepares subtitles for a viewable (loads the selected text track).
     * @private
     * @param {object} [viewableSegment] - Defaults to current viewable config
     */
    _prepareSubtitles(viewableSegment) {
        viewableSegment = viewableSegment === undefined ? this.currentViewableConfig : viewableSegment;
        if (viewableSegment.tracks.textTrackSelection) {
            this.subtitlePlayer.T2a(viewableSegment.tracks.textTrackSelection);
        } else {
            Promise.resolve();
        }
    }

    /**
     * Synchronizes text track selection across all viewables in the playgraph
     * when the language changes.
     * @param {object} selectedTrack - The newly selected text track
     */
    syncTextTrackAcrossViewables(selectedTrack) {
        const self = this;
        var playgraphData = this.currentViewableConfig.BS(this);

        Object.values(playgraphData.segments).forEach(function (segment) {
            var viewable = self.viewableMap.key(segment.J);
            var parsedManifest = viewable ? viewable.parsedManifest : undefined;
            var textTracks = parsedManifest ? parsedManifest.sk : undefined;

            if (!textTracks) return;

            // Filter by language code
            var candidates = textTracks.filter(function (track) {
                return track.languageCode === selectedTrack.languageCode;
            });

            // Narrow by display name if ambiguous
            if (candidates.length > 1) {
                candidates = candidates.filter(function (track) {
                    return track.displayName === selectedTrack.displayName;
                });
            }

            // Narrow by language if still ambiguous
            if (candidates.length > 1) {
                candidates = candidates.filter(function (track) {
                    return track.language === selectedTrack.language;
                });
            }

            // Pick the highest-ranked match
            var bestMatch = candidates.sort(function (a, b) {
                return a.rank - b.rank;
            });

            var topCandidate = bestMatch.length > 0 ? bestMatch[0] : undefined;

            if (topCandidate && topCandidate !== viewable.tracks.textTrackSelection) {
                viewable.tracks.setTextTrack(topCandidate);
                self.subtitlePlayer.T2a(viewable.tracks.textTrackSelection);
            }
        });
    }

    /**
     * Finds an audio stream by downloadable stream ID across all viewables.
     * @param {string} streamId
     * @returns {object|undefined}
     */
    findAudioStreamById(streamId) {
        for (var iter = this.allViewableSegments, entry = iter.next(); !entry.done; entry = iter.next()) {
            var keySystemList = entry.value.supportedKeySystemList;
            for (var ksIter = keySystemList[Symbol.iterator](), ks = ksIter.next(); !ks.done; ks = ksIter.next()) {
                var found = ks.value.streams.find(function (stream) {
                    return stream.downloadableStreamId === streamId;
                });
                if (found) return found;
            }
        }
    }

    /**
     * Finds a video stream by downloadable stream ID across all viewables.
     * @param {string} streamId
     * @returns {object|undefined}
     */
    findVideoStreamById(streamId) {
        for (var iter = this.allViewableSegments, entry = iter.next(); !entry.done; entry = iter.next()) {
            var contentMetadata = entry.value.encryptedContentMetadata;
            for (var cmIter = contentMetadata[Symbol.iterator](), cm = cmIter.next(); !cm.done; cm = cmIter.next()) {
                var found = cm.value && cm.value.streams.find(function (stream) {
                    return stream.downloadableStreamId === streamId;
                });
                if (found) return found;
            }
        }
    }

    /**
     * Checks if a playback context ID belongs to any viewable in this instance.
     * @param {string} contextId
     * @returns {boolean}
     */
    hasPlaybackContextId(contextId) {
        for (var iter = this.allViewableSegments, entry = iter.next(); !entry.done; entry = iter.next()) {
            if (entry.value.playbackContextId === contextId) return true;
        }
        return false;
    }

    /**
     * Gets the current video quality (resolution, bitrate, etc.).
     * @returns {object}
     */
    getVideoQuality() {
        var adapter = this.ViewableAdapter;
        if (adapter && adapter.aaa) return adapter.aaa.call(adapter);
        return this._computeVideoQuality().internal_Vzb;
    }

    /**
     * Updates ASE bitrate filters for the given viewable.
     * @param {number} viewableId
     */
    updateBitrateFilters(viewableId) {
        var session = this.streamingSession;
        if (!session || !session.isDeviceMonitored) return;
        if (!this.viewableMap.has(viewableId)) return;

        var adapter = this.ViewableAdapter;
        if (adapter && adapter.aaa) {
            adapter.mWb();
        } else {
            var bufferStatus = this.getAVBufferStatus(viewableId);
            session.setBitrateFilters(bufferStatus, viewableId);
        }
    }

    // ========================================================================
    // Manifest format checks
    // ========================================================================

    /** @returns {boolean} Whether this is a trailer */
    isTrailer() {
        return 'trailer' === this.manifestFormat;
    }

    /** @returns {boolean} Whether this is a billboard */
    isBillboard() {
        return !!this.manifestFormat && this.manifestFormat.indexOf('billboard') >= 0;
    }

    /** @returns {boolean} Whether this is a video merchandising format */
    isVideoMerch() {
        return !!this.manifestFormat && this.manifestFormat.indexOf('video-merch') >= 0;
    }

    /** @returns {boolean} Whether this is a mini-modal format */
    isMiniModal() {
        return !!this.manifestFormat && this.manifestFormat.indexOf('mini-modal') >= 0;
    }

    /** @returns {boolean} Whether this is a supplemental (non-primary) format */
    isSupplementalFormat() {
        return this.isTrailer() || this.isBillboard() || this.isVideoMerch() || this.isMiniModal();
    }

    /**
     * Computes the pixel aspect ratio from video stream metadata, if available.
     * @returns {number|undefined}
     */
    getPixelAspectRatio() {
        var manifestRef, viewableId;
        var options = { YWb: true };
        var targetViewable = this.getViewableById(this.resolveTargetViewableId(options));

        if (targetViewable.manifestRef && targetViewable.manifestRef.manifestContent.execPointer) return;
        if (!this.encryptedContentMetadata) return;

        var pixelAspectRatio;

        this.getVideoStreams(options).forEach(function (stream) {
            if (
                typeChecks.wc(stream.ORa) &&
                typeChecks.wc(stream.rwb) &&
                typeChecks.wc(stream.qwb) &&
                typeChecks.wc(stream.pwb) &&
                (stream.ORa > 0 || stream.rwb > 0)
            ) {
                var sarWidth = 1;
                var sarHeight = 1;

                if (typeChecks.wc(stream.FNb) && typeChecks.wc(stream.GNb)) {
                    sarWidth = stream.FNb;
                    sarHeight = stream.GNb;
                }

                var ratio = (stream.pwb * sarHeight) / (stream.qwb * sarWidth);

                if (typeChecks.wc(pixelAspectRatio)) {
                    pixelAspectRatio = stream.ORa > 0 ? Math.max(pixelAspectRatio, ratio) : Math.min(pixelAspectRatio, ratio);
                } else {
                    pixelAspectRatio = ratio;
                }
            }
        });

        return pixelAspectRatio;
    }

    // ========================================================================
    // Timing / statistics
    // ========================================================================

    /**
     * @returns {object} Load and first-render timestamps
     */
    getTimingData() {
        return {
            tr: this.loadStartTime,
            rt: this.firstRenderTime,
        };
    }

    /**
     * Gets a session statistic by key.
     * @param {string} key
     * @returns {*}
     */
    getSessionStat(key) {
        return this.sessionStats[key];
    }

    /**
     * Calculates elapsed time since the transition or session start.
     * @returns {number} Elapsed milliseconds
     */
    getElapsedTimeSinceTransition() {
        if (this.transitionTime) {
            return this.lastVideoSync.getCurrentTime().toUnit(timeUtils.MILLISECONDS) - this.transitionTime;
        }
        return this.playerCore.systemClock.toUnit(timeUtils.MILLISECONDS) - this._getSessionStartTime();
    }

    /**
     * Computes the initial play time (time from transition to first content).
     * @returns {number}
     */
    x$() {
        if (this.transitionTime) {
            return this.lastVideoSync.getCurrentTime().toUnit(timeUtils.MILLISECONDS) - this.transitionTime;
        }
        var clockOffset = this.lastVideoSync.sI;
        return (
            this.transitionTime -
            (this.timeOffset.toUnit(timeUtils.MILLISECONDS) + clockOffset.toUnit(timeUtils.MILLISECONDS))
        );
    }

    /**
     * Calculates elapsed time since playback started or transitioned.
     * @returns {number}
     */
    getElapsedPlaybackTime() {
        if (this.transitionTime) {
            return this.lastVideoSync.getCurrentTime().toUnit(timeUtils.MILLISECONDS) - this.transitionTime;
        }
        return this.transitionTime - this._getSessionStartTime();
    }

    /**
     * Gathers battery status data with timestamps.
     * @returns {object|null}
     */
    getBatteryStatus() {
        var loadTime = this.loadTime;
        var relativeTimestamps = {};

        parseUtils.forEachProperty(this.batteryStatusHistory, function (key, timestamps) {
            relativeTimestamps[key] = timestamps.map(function (timestamp) {
                return timestamp - loadTime;
            });
        });

        if (batteryManager.BD) {
            return {
                level: batteryManager.BD.nCb(),
                charging: batteryManager.BD.dVa(),
                statuses: relativeTimestamps,
            };
        }
        return null;
    }

    /**
     * Collects and returns buffered report data.
     * @returns {object}
     */
    getBufferedReport() {
        this._emitBufferedReportEvent();
        return this.bufferedReportData;
    }

    /**
     * @private
     * @returns {number} The session start time (from JC or computed from offsets)
     */
    _getSessionStartTime() {
        var startTime = this.sessionContext.JC;

        if (!typeChecks.wc(startTime)) {
            startTime =
                this.timeOffset.toUnit(timeUtils.MILLISECONDS) +
                this.lastVideoSync.sI.toUnit(timeUtils.MILLISECONDS);
        }

        assertUtils.assert(typeChecks.EM(startTime));
        return startTime;
    }

    /**
     * @returns {number} Elapsed wall-clock time since load
     */
    getWallClockElapsed() {
        return (
            this.lastVideoSync.getCurrentTime().toUnit(timeUtils.MILLISECONDS) -
            this.timeOffset.toUnit(timeUtils.MILLISECONDS)
        );
    }

    /**
     * Marks the playback for deferred close (D4c flag).
     */
    markForDeferredClose() {
        this.deferredClose = true;
    }

    /**
     * Triggers immediate finalization of close.
     */
    triggerImmediateClose() {
        this.finalizeClose();
    }

    // ========================================================================
    // Buffer length queries
    // ========================================================================

    /** @returns {number} Video buffer length in milliseconds */
    getVideoBufferLength() {
        var stats = this._getBufferStats();
        return stats ? stats.vbuflmsec : 0;
    }

    /** @returns {number} Audio buffer length in milliseconds */
    getAudioBufferLength() {
        var stats = this._getBufferStats();
        return stats ? stats.abuflmsec : 0;
    }

    /** @returns {number} Text buffer length in milliseconds */
    getTextBufferLength() {
        var stats = this._getBufferStats();
        return stats ? stats.tbuflmsec : 0;
    }

    /** @returns {number} Video buffer length in bytes */
    getVideoBufferBytes() {
        var stats = this._getBufferStats();
        return stats ? stats.vbuflbytes : 0;
    }

    /** @returns {number} Audio buffer length in bytes */
    getAudioBufferBytes() {
        var stats = this._getBufferStats();
        return stats ? stats.abuflbytes : 0;
    }

    /** @returns {number} Text buffer length in bytes */
    getTextBufferBytes() {
        var stats = this._getBufferStats();
        return stats ? stats.tbuflbytes : 0;
    }

    // ========================================================================
    // Manifest fetching
    // ========================================================================

    /**
     * Fetches a manifest for a viewable segment.
     * @private
     * @param {object} [viewableSegment] - Defaults to current viewable config
     * @param {object} [refreshOptions] - Optional refresh/context data (CJ)
     * @param {boolean} [includeType=true] - Whether to include the manifest type
     * @returns {Promise<object>}
     */
    _fetchManifest(viewableSegment, refreshOptions, includeType) {
        const self = this;
        viewableSegment = viewableSegment === undefined ? this.currentViewableConfig : viewableSegment;
        includeType = includeType === undefined ? true : includeType;

        var hasRefreshOptions = !!refreshOptions;
        var isAuxiliary = !hasRefreshOptions && viewableSegment !== this.currentViewableConfig;

        var flavor;
        if (playerConfig.config.internal_Hya.qcEnabled) {
            flavor = manifestFlavors.qq.z5b;
        } else if (isAuxiliary) {
            flavor = manifestFlavors.qq.PRE_FETCH;
        } else if (this.isSupplementalFormat()) {
            flavor = manifestFlavors.qq.SUPPLEMENTAL;
        } else {
            flavor = manifestFlavors.qq.$r;
        }

        var manifestType =
            this.isSupplementalFormat() || hasRefreshOptions || isAuxiliary
                ? undefined
                : manifestTypeResolver.getLicenseType(playerConfig.config, isAuxiliary);

        var auxOptions = viewableSegment.ze;
        var execPointer =
            auxOptions && auxOptions.execPointer !== undefined ? auxOptions.execPointer : false;

        return this.manifestStore
            .fetchManifest(
                {
                    Ia: viewableSegment.sourceTransactionId,
                    sessionContext: viewableSegment.sessionContext,
                    J: viewableSegment.R,
                    flavor: flavor,
                    type: manifestType,
                    CJ: refreshOptions,
                    ze: viewableSegment.ze,
                    execPointer: execPointer,
                },
                this.abortController.signal,
                viewableSegment.ze ? false : includeType
            )
            .then(function (response) {
                if (response.FYa) {
                    self.fireEvent(PlayerEvents.RZa, { R: viewableSegment.R });
                }
                return response;
            });
    }

    /**
     * Applies a fetched manifest to a viewable segment: parses tracks, sets defaults.
     * @private
     * @param {object} manifest - The fetched manifest response
     * @param {object} [viewableSegment] - Target viewable (defaults to current)
     * @param {boolean} [isRefresh=false] - Whether this is a manifest refresh (preserves tracks)
     */
    _applyManifest(manifest, viewableSegment, isRefresh) {
        viewableSegment = viewableSegment === undefined ? this.currentViewableConfig : viewableSegment;
        isRefresh = isRefresh === undefined ? false : isRefresh;

        if (viewableSegment.sessionContext.isSeeking && !manifest.manifestContent.choiceMap) {
            this.fireError(errorCodes.ea.BRANCH_CHOICE_MAP_MISSING);
            return;
        }

        var parser = this.adService.create(this);
        var isAuxiliaryWithParent = !!(
            viewableSegment.ze &&
            viewableSegment.ze.auxiliaryManifestToken &&
            viewableSegment.ze.jfa
        );

        var manifestRef, parsedManifest;

        if (isRefresh) {
            var refreshResult = parser.WBc(viewableSegment.manifestRef, viewableSegment.parsedManifest, manifest);
            manifestRef = refreshResult.manifestRef;
            parsedManifest = refreshResult.parsedManifest;
        } else {
            if (isAuxiliaryWithParent) {
                var auxOptions = viewableSegment.ze;
                manifest = parser.NVc(manifest, auxOptions ? auxOptions.jfa : undefined);
            }
            manifestRef = manifest;
            parsedManifest = parser.YMb(manifest);
        }

        viewableSegment.manifestRef = manifestRef;
        viewableSegment.parsedManifest = parsedManifest;

        if (viewableSegment.currentViewableId) {
            var existingZe = viewableSegment.ze;
            viewableSegment.ze = Object.assign(existingZe !== null && existingZe !== undefined ? existingZe : {}, {
                Kb: manifestRef.manifestContent.auxiliaryManifestToken,
                bF: manifestRef.manifestContent.playbackContextId,
            });
        }

        if (viewableSegment.R === viewableSegment.currentViewableId && !this.mva) {
            this.mva = manifestRef.manifestContent.playbackContextId;
        }

        if (!isRefresh) {
            viewableSegment.tracks.setVideoTrack(parsedManifest.defaultTrack);
            viewableSegment.tracks.setAudioTrack(parsedManifest.naa);
            viewableSegment.tracks.setTextTrack(parsedManifest.paa);
        }

        if (viewableSegment.liveController.isLive) {
            viewableSegment.liveController.processManifest();
        }
    }

    /**
     * Fires a viewable-changed event after transitioning to a new viewable.
     * @private
     * @param {number} viewableId
     */
    _onViewableTransitioned(viewableId) {
        var isSeamless = false;
        this._notifyViewableChanged({ J: viewableId, XS: isSeamless });
    }

    /**
     * Checks whether a seek is outside the acceptable range.
     * @param {number} seekTarget - Target time
     * @param {number} tolerance - Tolerance in ms
     * @returns {boolean} True if the seek is valid
     */
    isSeekInRange(seekTarget, tolerance) {
        if (!this.seekableCheck.C8a) return true;
        var diff = this.seekTarget.toUnit(timeUtils.MILLISECONDS) - seekTarget;
        return diff < 0 || diff > tolerance;
    }

    /**
     * Forces a rebuffer by seeking to the current media time.
     */
    forceRebuffer() {
        this.mediaSourceManager.seek(this.getCurrentMediaTime() || 0, StreamState.FORCE_REBUFFER);
    }

    /**
     * Hydrates audio, text, and video tracks by fetching an updated manifest.
     * @param {string} audioTrackId
     * @param {string} textTrackId
     * @param {string} videoTrackId
     * @returns {Promise<object>} The hydrated tracks { Cc, xJ, videoTrack }
     */
    hydrateTracksFromManifest(audioTrackId, textTrackId, videoTrackId) {
        const self = this;
        var viewableConfig = this.currentViewableConfig;
        viewableConfig.internal_Aqa = true;

        return this._fetchManifest(viewableConfig, {
            bF: viewableConfig.playbackContextId,
            KUc: audioTrackId,
            OUc: textTrackId,
            PUc: videoTrackId,
        }, false)
            .then(function (manifest) {
                self._applyManifest(manifest, viewableConfig, true);
                self.manifestStore.CV(viewableConfig.R, viewableConfig.manifestRef);
                var session = self.streamingSession;
                return session ? session.g5(self.initialSegmentId) : undefined;
            })
            .then(function () {
                var audioTrack = viewableConfig.supportedKeySystemList.find(function (track) {
                    return track.trackId === audioTrackId;
                });
                var textTrack = viewableConfig.sk.find(function (track) {
                    return track.trackId === textTrackId;
                });
                var videoTrack = viewableConfig.encryptedContentMetadata.find(function (track) {
                    return track.trackId === videoTrackId;
                });

                if (!(audioTrack && audioTrack.isMissing && textTrack && textTrack.isMissing && videoTrack && videoTrack.isMissing)) {
                    throw Error(
                        'Track hydration failed: requiredAudioTrackId=' +
                            audioTrackId +
                            ' requiredTextTrackId=' +
                            textTrackId +
                            ' requiredVideoTrackId=' +
                            videoTrackId
                    );
                }

                self.fireEvent(PlayerEvents.zVb);
                return { Cc: audioTrack, xJ: textTrack, videoTrack: videoTrack };
            });
    }

    /**
     * @returns {object|undefined} The playback container (ad container)
     */
    getPlaybackContainer() {
        return this.playbackContainer;
    }

    /**
     * Handles viewable change notifications: updates movieId, syncs state, fires events.
     * @private
     * @param {object} params - { J: movieId, XS: isSeamless, mR: segmentRef }
     */
    _notifyViewableChanged(params) {
        const self = this;
        var newMovieId = params.J;
        var isSeamless = params.XS;
        var newSegmentRef = params.mR;

        // Update segment reference if changed
        if (newSegmentRef !== this.mR) {
            this.mR = newSegmentRef;
            this._updateContainerDimensions();
        }

        this.currentViewableConfig.programId.set(params.programId);

        if (this.previousMovieId) {
            if (newMovieId === this.movieId) {
                this.previousMovieId = newMovieId;
                return;
            }

            var newViewable = this.getViewableById(newMovieId);
            var manifestRef = newViewable.manifestRef;

            if (manifestRef && typeChecks.gd(manifestRef.pr_ats) && typeChecks.gd(manifestRef.pr_at)) {
                newViewable.updatePlayDelayTimestamps({
                    pr_ats: manifestRef.pr_ats,
                    pr_at: manifestRef.pr_at,
                });
            }

            // Fire viewable-leaving event if crossing viewable boundaries
            if (!this.currentViewableId || newViewable.currentViewableId !== this.currentViewableId) {
                this.fireEvent(PlayerEvents.v_a, { R: this.movieId });
            }

            this.movieId = newMovieId;
            this._applyPlaybackState();

            if (!isSeamless) {
                this.syncViewableState();
            }

            this.kI = this.playerCore.kJ;

            if (!this.currentViewableConfig.transitionTime) {
                this.currentViewableConfig.transitionTime =
                    this.lastVideoSync.getCurrentTime().toUnit(timeUtils.MILLISECONDS);
            }
        }

        // Enable trick play if configured
        var enableTrickPlay =
            typeof this.sessionContext.enableTrickPlay === 'boolean'
                ? this.sessionContext.enableTrickPlay
                : playerConfig.config.enableTrickPlay;

        if (enableTrickPlay && !isSeamless) {
            this.segmentDownloader.enableTrickPlay(this);
        }

        var eventData = {
            R: newMovieId,
            XS: isSeamless,
            l3: this.previousMovieId,
        };

        this.previousMovieId = newMovieId;
        this.fireEvent(PlayerEvents.ZM, eventData);
    }

    // ========================================================================
    // Core initialization (post-authorization)
    // ========================================================================

    /**
     * Called when async components finish loading. Creates the media source element
     * and media storage manager.
     * @private
     */
    _onAsyncLoadComplete() {
        try {
            this.mediaSourceElement = new mediaSourceWrapper.qHa(this);
            this.mediaStorageManager = this.analyticsService.create(
                this,
                this.currentViewableConfig,
                true,
                this.transformMediaTime
            );

            if (playerConfig.config.captureUnhandledExceptions) {
                new exceptionHandler.L0b(this, this.log);
            }

            if (playerConfig.config.B$) {
                this._setupBatteryMonitoring(this);
            }

            this._validateAndInitialize();
        } catch (error) {
            this.fireErrorEvent(errorCodes.ea.INIT_CORE_OBJECTS1, {
                Ya: errorCodes.EventTypeEnum.EXCEPTION,
                configFlag: parseUtils.initializeModel(error),
            });
        }
    }

    /**
     * Validates the movie ID and proceeds with initialization.
     * @private
     */
    _validateAndInitialize() {
        if (this.lastError) {
            this._handleFatalError(this.lastError);
        } else if (typeChecks.UYa(this.viewableId)) {
            this._acquireSessionLock();
        } else {
            this.fireErrorEvent(errorCodes.ea.INIT_BADMOVIEID, { Cf: '' + this.viewableId });
        }
    }

    /**
     * Acquires the session lock (ensuring single-session playback).
     * @private
     */
    _acquireSessionLock() {
        var lockResult = sessionLock.BV.bSb;

        if (lockResult) {
            if (lockResult.success) {
                this._closeOtherPlaybacksAndProceed();
            } else {
                this.fireErrorEvent(errorCodes.ea.INIT_SESSION_LOCK, lockResult);
            }
        } else {
            assertUtils.assert(!playerConfig.config.enforceSingleSession);
            this._acquirePlaybackLock();
        }
    }

    /**
     * Closes other active playback instances if configured, then proceeds.
     * @private
     */
    _closeOtherPlaybacksAndProceed() {
        const self = this;

        if (!this.background.value && playerConfig.config.closeOtherPlaybacks) {
            playbackRegistry.ojb(function () {
                self._acquirePlaybackLock();
            }, this);
        } else {
            this._acquirePlaybackLock();
        }
    }

    /**
     * Acquires the playback lock and begins authorization.
     * @private
     */
    _acquirePlaybackLock() {
        const self = this;

        if (this.state.value !== PlaybackState.LOADING) return;

        if (playerConfig.config.enforceSinglePlayback && !this.isSupplementalFormat()) {
            sessionLock.BV.wA(playbackRegistry.njb, function (result) {
                if (result.success) {
                    self.playbackLockHandle = result.gva;
                    self._authorize();
                } else {
                    self.fireErrorEvent(errorCodes.ea.INIT_PLAYBACK_LOCK);
                }
            }, true);
        } else {
            this._authorize();
        }
    }

    /**
     * Authorizes playback by fetching the manifest (or using cached).
     * @private
     */
    _authorize() {
        const self = this;

        if (this.state.value !== PlaybackState.LOADING) return;

        this.log.info('Authorizing', this);

        var authStartTime = this.lastVideoSync.getCurrentTime().toUnit(timeUtils.MILLISECONDS);
        this.recordPlayDelay('ats');

        assertUtils.l_(this.viewableId);
        assertUtils.l_(this.TrackingId);

        var onAuthComplete = this._onAuthorizationComplete.bind(this, authStartTime);
        var viewableConfig = this.currentViewableConfig;

        Promise.all([
            this.manifestRef,
            playerConfig.config.enableManifestCache && this.manifestStore.hasManifestCached(this.viewableId)
                ? this.manifestStore.getCachedManifest(this.viewableId).catch(function () {})
                : undefined,
            viewableConfig.currentViewableId && viewableConfig.currentViewableId !== viewableConfig.R
                ? this.fetchMainManifest()
                : undefined,
        ])
            .then(function (results) {
                var uiManifest = results[0];
                var cachedManifest = results[1];
                var mainManifest = results[2];

                var bestManifest;
                if (uiManifest && cachedManifest) {
                    bestManifest =
                        cachedManifest.manifestContent.expiration > uiManifest.manifestContent.expiration
                            ? cachedManifest
                            : uiManifest;
                } else if (uiManifest) {
                    bestManifest = uiManifest;
                } else if (cachedManifest) {
                    bestManifest = cachedManifest;
                }

                // Reject manifest if it expires within 30 minutes
                if (
                    bestManifest &&
                    1800000 > bestManifest.manifestContent.expiration - self.playerCore.kJ.toUnit(timeUtils.MILLISECONDS)
                ) {
                    bestManifest = undefined;
                }

                // Apply main manifest for auxiliary viewables
                if (mainManifest) {
                    var auxViewable = self.viewableMap.key(viewableConfig.currentViewableId);
                    var contextId = mainManifest.manifestContent.playbackContextId;
                    var auxToken = mainManifest.manifestContent.auxiliaryManifestToken;

                    self.mva = contextId;

                    if (auxViewable) self._applyManifest(mainManifest, auxViewable);

                    var existingZe = viewableConfig.ze;
                    viewableConfig.ze = Object.assign(
                        existingZe !== null && existingZe !== undefined ? existingZe : {},
                        { Kb: auxToken, bF: contextId }
                    );

                    // Invalidate cached manifest if aux token doesn't match
                    if (auxToken && auxToken !== (bestManifest ? bestManifest.manifestContent.auxiliaryManifestToken : undefined)) {
                        bestManifest = undefined;
                    }
                }

                if (bestManifest) {
                    self.manifestSource = bestManifest === uiManifest ? 'ui' : 'videopreparer';
                    return bestManifest;
                }

                return self._fetchManifest();
            })
            .then(function (manifest) {
                try {
                    self._applyManifest(manifest);
                    onAuthComplete(constants.SUCCESS);

                    if (!self.playbackQualityReported) {
                        self.playbackQualityReported = true;
                        self.qualityReporter.startPlayback(self);
                    }
                } catch (error) {
                    self.log.error('Exception processing authorization response', error);
                    onAuthComplete({ success: false, errorcode: errorCodes.EventTypeEnum.$4b });
                }
            })
            .catch(onAuthComplete);
    }

    /**
     * Callback after authorization completes (success or failure).
     * @private
     * @param {number} authStartTime - Timestamp when auth started
     * @param {object} result - { success, errorcode, ... }
     */
    _onAuthorizationComplete(authStartTime, result) {
        const self = this;

        if (this.state.value !== PlaybackState.LOADING) return;

        this.recordPlayDelay('at');

        var manifest = this.manifestRef;
        this.updatePlayDelayTimestamps({
            pr_ats: manifest && typeChecks.gd(manifest.pr_ats) ? manifest.pr_ats : authStartTime,
            pr_at: manifest && typeChecks.gd(manifest.pr_at)
                ? manifest.pr_at
                : this.lastVideoSync.getCurrentTime().toUnit(timeUtils.MILLISECONDS),
        });

        if (!result.success) {
            this.fireErrorEvent(errorCodes.ea.MANIFEST, result);
            return;
        }

        // Validate manifest has required tracks
        manifestUtils.isLive(manifest.manifestContent.manifestType);

        if (
            this.parsedManifest.di.length <= 0 ||
            !this.parsedManifest.naa ||
            !this.parsedManifest.defaultTrack ||
            !this.parsedManifest.paa
        ) {
            this.fireErrorEvent(errorCodes.ea.MANIFEST_VERIFY, this.manifestVerifier(this.parsedManifest));
            return;
        }

        if (this.asyncLoadStartTime) {
            this.log.info('Processing post-authorize', this);
            this.asyncLoadStartTime(this, function (postAuthResult) {
                if (postAuthResult.success) {
                    self._initializeStreaming();
                } else {
                    self.fireErrorEvent(errorCodes.ea.INIT_POSTAUTHORIZE, postAuthResult);
                }
            });
        } else {
            this._initializeStreaming();
        }
    }

    /**
     * Initializes the ASE streaming session and core playback objects.
     * @private
     */
    _initializeStreaming() {
        const self = this;

        asyncHelpers.__awaiter(this, void 0, void 0, function generator() {
            return (function (gen) {
                if (self.state.value !== PlaybackState.LOADING) return;

                // Create choice map for interactive content
                var manifestRef = self.currentViewableConfig.manifestRef;
                if (manifestRef && manifestRef.manifestContent.choiceMap) {
                    var choiceMapConfig = self.currentViewableConfig.manifestRef.manifestContent.choiceMap;
                    self.currentViewableConfig.create(
                        viewableConstants.yQa(choiceMapConfig, { config: playerConfig.config })
                    );
                }

                // Create streaming session via ASE factory
                self.streamingSession = self.aseFactory(self.currentViewableConfig, self);

                self.streamingSession.initializeIntegration({
                    $v: aseGlobals.aseGlobals,
                    config: playerConfig.config,
                    eventBus: self.eventBus,
                    internalLogger: self.internalLogger,
                    utilService: self.utilService.bind(self),
                    getCategoryLog: loggerFactory.getCategoryLog,
                    cha: self._onSourceBufferChanged.bind(self),
                    playbackCallbacks: self._notifyViewableChanged.bind(self),
                });

                self._initializeCoreObjects();
            })(generator);
        });
    }

    /**
     * Initializes the media pipeline: MediaSource, MSE buffers, ASE streaming,
     * subtitles, and finishes loading.
     * @private
     */
    _initializeMediaPipeline() {
        const self = this;

        try {
            if (this.state.value !== PlaybackState.LOADING) return;

            // Open the MediaSource element
            this.mediaSourceElement.send();

            var sourceOpenPromise = new Promise(function (resolve) {
                self.mediaSourceElement.addEventListener(mediaSourceEvents.MediaSourceEvents.sourceopen, resolve);
            });

            // Create the MSE buffer manager
            this.mediaSourceManager = new MediaSourceManager.wHa(this, this.startPts);

            // Determine audio flags
            var isNoAudio =
                this.parsedManifest.naa.language === trackConstants.fragmentValidator.NONE;
            var flags = { zXb: this.parsedManifest.naa.dr || isNoAudio };

            var requestContext = {
                Ia: this.sourceTransactionId,
                pbcid: this.correlationId,
                value: this.downloadReportEnabled,
            };

            try {
                if (this.state.value !== PlaybackState.LOADING) return;

                var session = this.streamingSession;

                // Initialize ASE with segment/buffer info
                session.onSegmentNormalized({
                    flags: flags,
                    requestContext: requestContext,
                    M: this.initialSegmentId,
                    getAVBufferStatus: this.getAVBufferStatus.bind(this),
                });

                var playgraphData = this.currentViewableConfig.BS(this);
                this.handleSegmentUpdates(playgraphData);
                session.updatePlaygraphMap(playgraphData);

                // Set up ASE segment navigation
                this._setupAseSegmentNavigation();

                // Notify ASE that the playgraph is ready
                session.onPlaygraphReady({
                    Ys: this.sessionStats,
                    loadTime: this.loadTime,
                });

                // Create the ad playback container
                this.playbackContainer = this.adTrackerFactory(session, this);

                // Ad presenting state listeners
                this.playbackContainer.onAdPresenting.addListener(function (event) {
                    if (event.newValue) {
                        var container = self.playbackContainer;
                        if (container && container.xHb === 'dynamic') {
                            self.subtitlePlayer.EBc();
                        }
                        if (playerConfig.config.enableManifestCache && !self.liveController.isLive) {
                            self.session.WDb();
                        }
                    } else {
                        var container = self.playbackContainer;
                        if (container && container.xHb === 'dynamic') {
                            self.subtitlePlayer.WYc();
                        }
                    }
                });

                this.playbackContainer.addEventListener(playerEnums.rCa.internal_Jna, function () {
                    if (!self.liveController.isLive) self.session.WDb();
                });
            } catch (error) {
                this.log.error('Failed to initialize ASE streaming', {
                    error: error,
                    startPts: this.startPts,
                    flags: flags,
                });
                throw error;
            }

            // Start streaming when MediaSource opens
            sourceOpenPromise.then(function () {
                if (
                    self.state.value !== PlaybackState.CLOSING &&
                    self.state.value !== PlaybackState.CLOSED
                ) {
                    var session = self.streamingSession;
                    if (session) session.send();
                }
            });

            // Set initial media time
            this.mediaTime.set(this.startPts);

            // Create subtitle player and text renderer
            var subtitleConfigInstance = new subtitleConfig.internal_Emb(playerConfig.config);
            this.subtitlePlayer = new subtitlePlayerModule.internal_Dmb(this, subtitleConfigInstance);

            var renderTimedText =
                typeof this.sessionContext.renderTimedText === 'boolean'
                    ? this.sessionContext.renderTimedText
                    : playerConfig.config.renderTimedText;

            if (renderTimedText) {
                this.textRenderer = new textRendererModule.internal_Fmb(this, subtitleConfigInstance);
            }

            // Start inactivity monitor
            this.startInactivityMonitor();

            // Run post-load hooks
            playbackRegistry.jJa.forEach(function (hook) {
                hook(self);
            });

            // Transition to NORMAL state
            this._finalizeLoad();
        } catch (error) {
            this.fireErrorEvent(errorCodes.ea.INIT_CORE_OBJECTS3, {
                Ya: errorCodes.EventTypeEnum.EXCEPTION,
                configFlag: parseUtils.initializeModel(error),
            });
        }
    }

    /**
     * Transitions from NOTLOADED to LOADING and records the load start time.
     * @private
     */
    _transitionToLoading() {
        assertUtils.assert(this.state.value === PlaybackState.NOTLOADED);
        this.loadTime = this.lastVideoSync.getCurrentTime().toUnit(timeUtils.MILLISECONDS);
        this.state.set(PlaybackState.LOADING);
    }

    /**
     * Handles a stream restart (e.g., after a DRM license renewal).
     * Creates a new MediaSource and MSE manager, preserving the video element.
     * @returns {Promise}
     */
    handleStreamRestart() {
        const self = this;

        return asyncHelpers.__awaiter(this, void 0, void 0, function generator() {
            return (function (gen) {
                var session = self.streamingSession;
                var lastPts = typeChecks.wc(session ? session.atb : undefined)
                    ? session.atb
                    : self.seekTargetTime;

                assertUtils.assert(typeChecks.wc(lastPts), 'lastPts before restart should have a valid number type');

                var wasJumping = self.mediaSourceManager.jU;
                var videoElement = self.mediaSourceElement.htmlVideoElement;

                self.nextState.emit(PlayerEvents.internal_Aga);

                // Re-create MediaSource and manager
                self.mediaSourceElement = new mediaSourceWrapper.qHa(self);
                self.mediaSourceElement.send(videoElement);
                self.mediaSourceManager = new MediaSourceManager.wHa(
                    self,
                    wasJumping ? self.mediaTime.value : lastPts,
                    true
                );

                return new Promise(function (resolve) {
                    function onSourceOpen() {
                        self.mediaSourceElement.removeEventListener(
                            mediaSourceEvents.MediaSourceEvents.sourceopen,
                            onSourceOpen
                        );
                        resolve();
                    }
                    self.mediaSourceElement.addEventListener(
                        mediaSourceEvents.MediaSourceEvents.sourceopen,
                        onSourceOpen
                    );
                });
            })(generator);
        });
    }

    /**
     * Fires an error event, handling both PlayerError instances and raw error data.
     * Ensures only one error is processed (via the `done` flag).
     * @param {string} errorCode
     * @param {object} errorData
     */
    fireErrorEvent(errorCode, errorData) {
        if (this.done) return;
        this.done = true;

        if (errorData instanceof playerError.we) {
            this.fireError(errorData.code, errorData);
        } else {
            this.fireError(errorCode, errorData);
        }
    }

    /**
     * Sets up battery charging status monitoring.
     * @private
     * @param {PlaybackInstance} instance
     */
    _setupBatteryMonitoring(instance) {
        const self = this;

        function onBatteryChange() {
            var key = batteryManager.BD.dVa() + '';
            var entries = instance.batteryStatusHistory[key];
            if (!entries) {
                entries = instance.batteryStatusHistory[key] = [];
            }
            entries.push(self.lastVideoSync.getCurrentTime().toUnit(timeUtils.MILLISECONDS));
            self.log.pauseTrace('charging change event', {
                level: batteryManager.BD.nCb(),
                charging: batteryManager.BD.dVa(),
            });
        }

        var eventName = batteryManager.BD.VZb;
        batteryManager.BD.addEventListener(eventName, onBatteryChange);

        instance.addEventListener(PlayerEvents.clearTimeoutFn, function () {
            batteryManager.BD.removeEventListener(eventName, onBatteryChange);
        });
    }

    /**
     * Begins the close sequence: removes listeners, fires closing event,
     * disposes streaming, and schedules finalization.
     * @param {object} [error] - The error that caused the close (if any)
     */
    closePlayback(error) {
        const self = this;

        if (
            this.state.value !== PlaybackState.NOTLOADED &&
            this.state.value !== PlaybackState.LOADING &&
            this.state.value !== PlaybackState.NORMAL
        ) {
            return;
        }

        this.internalLogger.info(
            'Playback closing',
            this,
            error ? { ErrorCode: error.ErrorCode } : undefined
        );

        this.debugLog('Closing');

        // Remove document event listeners
        documentEvents.writeBytes.removeListener(documentEvents.downloadNode, this.onDocumentUnload);
        documentEvents.writeBytes.removeListener(documentEvents.stateChangeEvent, this.onVisibilityChange);

        this.lastError = error;
        this.currentViewableConfig.V$ = this.getCurrentMediaTime();
        this._emitBufferedReportEvent();

        // Log ASE session data
        var session = this.streamingSession;
        if (session && session.isDeviceMonitored) {
            session.logBatcher();
        }

        try {
            this.nextState.emit(PlayerEvents.clearTimeoutFn, { movieId: this.movieId });
        } catch (error) {
            this.internalLogger.error('Unable to fire playback closing event', error);
        }

        this.state.set(PlaybackState.CLOSING);
        this._disposeStreaming();
        this.abortController.abort();

        if (!this.deferredClose) {
            scheduler.scheduleAsync(function () {
                return self.finalizeClose();
            });
        }
    }

    /**
     * Emits the throttled media time change event.
     * @private
     */
    _emitMediaTimeChangedThrottled() {
        this.nextState.emit(PlayerEvents.lWb);
    }

    /**
     * Emits the debounced media time change event (fires less frequently).
     * @private
     */
    _emitMediaTimeChangedDebounced() {
        var currentTime = this.mediaTime.value;
        if (this.lastEmittedMediaTime !== currentTime) {
            this.lastEmittedMediaTime = currentTime;
            this.nextState.emit(PlayerEvents.l7a);
        }
    }

    /**
     * Finalizes the close: releases the playback lock and completes shutdown.
     */
    finalizeClose() {
        const self = this;

        assertUtils.assert(this.state.value === PlaybackState.CLOSING);

        var lockHandle = this.playbackLockHandle;
        this.playbackLockHandle = undefined;

        if (lockHandle) {
            sessionLock.BV.release(lockHandle, function (result) {
                assertUtils.assert(result.success);
                self._finalizeShutdown();
            });
        } else {
            this._finalizeShutdown();
        }
    }

    /**
     * Disposes the streaming session.
     * @private
     */
    _disposeStreaming() {
        var session = this.streamingSession;
        if (session) session.dispose();
        delete this.streamingSession;
    }

    /**
     * Final shutdown: removes from registry, sets state to CLOSED, fires closed event,
     * cleans up event listeners and encryption sessions.
     * @private
     */
    _finalizeShutdown() {
        // Prevent double-finalization
        this._finalizeShutdown = constants.lK;

        assertUtils.assert(this.state.value === PlaybackState.CLOSING);

        // Remove from global playback list
        var index = playbackRegistry.tq.indexOf(this);
        assertUtils.assert(index >= 0);
        playbackRegistry.tq.splice(index, 1);

        // Transition to CLOSED
        this.state.set(PlaybackState.CLOSED);
        this.nextState.emit(PlayerEvents.closed, undefined, true);
        this.nextState.cleanup();

        // Close all encryption sessions
        for (
            var iter = this.allViewableSegments, entry = iter.next();
            !entry.done;
            entry = iter.next()
        ) {
            var viewable = entry.value;
            var encHandler = viewable.hm;
            if (encHandler) encHandler.closing().catch(function () {});
            delete viewable.hm;
        }

        this.currentViewableConfig.internal_Ewa();
    }

    /**
     * Applies playback state (volume, muted, rate) from the session context.
     * @private
     */
    _applyPlaybackState() {
        var playbackState = this.sessionContext.playbackState;
        if (!playbackState) return;

        if (typeof playbackState.volume === 'number') {
            this.volume.set(mathUtils.oG(playbackState.volume, 0, 1));
        }
        if (typeof playbackState.muted === 'boolean') {
            this.muted.set(playbackState.muted);
        }
        if (typeof playbackState.playbackRate === 'number') {
            this.playbackRate.set(playbackState.playbackRate);
        }
    }

    /**
     * Emits the buffered report data event.
     * @private
     */
    _emitBufferedReportEvent() {
        this.nextState.emit(PlayerEvents.a6a, { FBa: this.bufferedReportData });
    }

    /**
     * Updates a source buffer observable when a stream changes.
     * @private
     * @param {string} segmentId
     * @param {string} streamId
     * @param {number} mediaType - MediaType enum value
     */
    _onSourceBufferChanged(segmentId, streamId, mediaType) {
        var stream = this.findDrmInfoById(streamId);
        var viewable = this.getPlaybackSegment(segmentId);
        if (stream) viewable.sourceBufferArray[mediaType].set(stream);
    }

    /**
     * @returns {object} Buffer length data for logging
     */
    utilService() {
        return {
            AudioBufferLength: this.getAudioBufferLength(),
            VideoBufferLength: this.getVideoBufferLength(),
        };
    }

    /**
     * Gets the raw buffer statistics from the streaming session.
     * @private
     * @returns {object|undefined}
     */
    _getBufferStats() {
        var session = this.streamingSession;
        if (session && session.isDeviceMonitored) {
            return session.IFb();
        }
    }

    /**
     * Transitions from LOADING to NORMAL state.
     * @private
     */
    _finalizeLoad() {
        if (this.state.value === PlaybackState.LOADING) {
            this.state.set(PlaybackState.NORMAL);
        }
    }

    /**
     * Computes the video quality for the current viewable.
     * @private
     * @returns {object}
     */
    _computeVideoQuality(viewableId) {
        viewableId = viewableId === undefined ? this.viewableId : viewableId;
        var videoStreams = this.getVideoStreams({ J: viewableId });
        var viewable = this.getViewableById(viewableId);
        return videoQuality.SD(videoStreams, function (stream) {
            return viewable.c2.nJ(stream);
        });
    }

    /**
     * Gets the A/V buffer status for a viewable (used by ASE for bitrate decisions).
     * @param {number} [viewableId] - Defaults to current viewable ID
     * @returns {object}
     */
    getAVBufferStatus(viewableId) {
        viewableId = viewableId === undefined ? this.viewableId : viewableId;
        var videoStreams = this.getVideoStreams({ J: viewableId });
        var viewable = this.getViewableById(viewableId);
        return videoQuality.lAc(videoStreams, function (stream) {
            return viewable.c2.nJ(stream);
        });
    }

    /**
     * Processes segment updates from the playgraph, creating viewable entries
     * for any new segments not yet in the viewable map.
     * @param {object} playgraphData - The combined playgraph segment map
     */
    handleSegmentUpdates(playgraphData) {
        const self = this;

        Object.keys(playgraphData.segments)
            .filter(function (segmentKey) {
                return !self.viewableMap.has(playgraphData.segments[segmentKey].J);
            })
            .forEach(function (segmentKey) {
                var segment = playgraphData.segments[segmentKey];
                var movieId = segment.J;

                var initialViewable = self.viewableMap.key(
                    playgraphData.segments[playgraphData.initialSegment].J
                );
                var mainViewable = segment.main ? self.viewableMap.key(segment.main) : undefined;

                var existingSessionData = self.indexManager.KS(movieId).manifestSessionData;
                var sessionContext = Object.assign(
                    existingSessionData !== null && existingSessionData !== undefined
                        ? existingSessionData
                        : self.sessionContext,
                    {
                        Nb: segment.startTimeMs,
                        xmlGetterFn: segment.contentEndPts,
                        isSeeking: false,
                        JC: Date.now(),
                        isAutoPlay: true,
                    }
                );

                var auxiliaryOptions;
                if (self.isCurrentViewable(segment.main) && self.mva) {
                    var auxToken =
                        mainViewable ? mainViewable.auxiliaryManifestToken : undefined;
                    auxiliaryOptions = {
                        Kb: auxToken !== null && auxToken !== undefined
                            ? auxToken
                            : (initialViewable ? initialViewable.auxiliaryManifestToken : undefined),
                        bF: self.mva,
                    };
                }

                var transactionId = self.isCurrentViewable(segment.main)
                    ? (initialViewable ? initialViewable.sourceTransactionId : undefined)
                    : undefined;

                self._initializeViewable(
                    {
                        J: movieId,
                        currentViewableId: segment.main,
                        M: segmentKey,
                        sessionContext: sessionContext,
                        ze: auxiliaryOptions,
                    },
                    transactionId
                );
            });
    }
}

export { PlaybackInstance };
export default PlaybackInstance;
