/**
 * VideoPlayerApi - Public API facade for the Netflix Cadmium Video Player
 *
 * Wraps the internal player subsystem and exposes a clean public interface for
 * controlling playback, querying state, managing tracks, timed text, live playback,
 * and the playgraph (interactive branching).
 *
 * @module player/VideoPlayerApi
 * @original Module_58343
 */

// import { getCategoryLog } from '../core/logging';
// import { assert } from '../assert';

/**
 * Public-facing API for the Netflix video player.
 *
 * Delegates all operations to the internal player subsystem accessed
 * through the viewEventEmitter. Wraps event listeners to inject the
 * correct `type` and `target` properties.
 */
export class VideoPlayerApi {
    /**
     * @param {number} timeOffset - Time offset for the player session
     * @param {Object} viewEventEmitter - Internal view/event emitter that wraps the player subsystem
     */
    constructor(timeOffset, viewEventEmitter) {
        this.timeOffset = timeOffset;
        this.viewEventEmitter = viewEventEmitter;

        /** @type {Map<string, Map<Function, Function>>} Wrapped listener cache */
        this.wrappedListenerCache = new Map();
        this.log = getCategoryLog("VideoPlayer");

        Object.defineProperty(this, "diagnostics", {
            get: this.getDiagnostics,
        });
    }

    // ─── Internal Helpers ────────────────────────────────────────────

    /**
     * Gets the internal timed text (player) subsystem.
     * @private
     * @returns {Object} The player subsystem
     */
    getPlayerSubsystem() {
        return this.viewEventEmitter.getTimedTextSubsystem();
    }

    /**
     * Gets or creates a wrapped event listener for a given event type and callback.
     * Ensures event objects have the correct `type` and `target` fields.
     *
     * @private
     * @param {string} eventType - Event name
     * @param {Function} callback - Original callback
     * @returns {Function} Wrapped callback
     */
    getWrappedListener(eventType, callback) {
        if (!this.wrappedListenerCache.has(eventType)) {
            this.wrappedListenerCache.set(eventType, new Map());
        }
        const typeMap = this.wrappedListenerCache.get(eventType);
        if (!typeMap.has(callback)) {
            typeMap.set(callback, this.createWrappedListener(eventType, callback));
        }
        return typeMap.get(callback);
    }

    /**
     * Creates a wrapped listener that injects type and target.
     * @private
     */
    createWrappedListener(eventType, callback) {
        return (event) => {
            return callback(Object.assign({}, event, {
                type: eventType,
                target: this,
            }));
        };
    }

    /**
     * Chains a promise with an optional completion callback.
     * @private
     * @param {Promise} promise
     * @param {Function} [callback]
     * @returns {Promise}
     */
    chainCallback(promise, callback) {
        return callback ? promise.then(callback, callback) : promise;
    }

    // ─── Event Management ────────────────────────────────────────────

    /**
     * @param {string} eventType
     * @param {Function} callback
     * @param {*} [context]
     */
    addEventListener(eventType, callback, context) {
        return this.viewEventEmitter.addListener(eventType, this.getWrappedListener(eventType, callback), context);
    }

    /**
     * @param {string} eventType
     * @param {Function} callback
     */
    removeEventListener(eventType, callback) {
        return this.viewEventEmitter.removeListener(eventType, this.getWrappedListener(eventType, callback));
    }

    // ─── State Queries ───────────────────────────────────────────────

    /** @returns {boolean} Whether the player view is ready */
    getReady() {
        return this.viewEventEmitter.isReady();
    }

    /** @returns {*} The experience ID (xid) */
    getXid() {
        return this.getPlayerSubsystem().cB();
    }

    /** @returns {string} Playback context ID */
    getPlaybackContextId() {
        return this.getPlayerSubsystem().VCb();
    }

    /** @returns {*} Movie/content ID */
    getMovieId() {
        return this.getPlayerSubsystem().ICb();
    }

    /** @returns {HTMLElement} The player DOM element */
    getElement() {
        return this.viewEventEmitter.getConfiguration();
    }

    /** @returns {boolean} Whether playback is currently active */
    isPlaying() {
        return this.getPlayerSubsystem().isCurrentlyPlaying();
    }

    /** @returns {boolean} Whether playback is paused */
    isPaused() {
        return this.getPlayerSubsystem().qda();
    }

    /** @returns {boolean} Whether audio is muted */
    isMuted() {
        return this.getPlayerSubsystem().KYa();
    }

    /** @returns {boolean} Whether the player subsystem is ready */
    isReady() {
        return this.getPlayerSubsystem().isReady();
    }

    /** @returns {boolean} Whether the player is in background mode */
    isBackground() {
        return this.getPlayerSubsystem().QFb();
    }

    /** @returns {boolean} Whether playback has ended */
    isEnded() {
        return this.getPlayerSubsystem().AYa();
    }

    // ─── Playback Control ────────────────────────────────────────────

    /** @param {boolean} isBackground */
    setBackground(isBackground) {
        return this.getPlayerSubsystem().w5a(isBackground);
    }

    startInactivityMonitor() {
        return this.getPlayerSubsystem().q4();
    }

    /** @param {number} transitionTime */
    setTransitionTime(transitionTime) {
        return this.getPlayerSubsystem().S5a(transitionTime);
    }

    /** Prepares the player for playback */
    prepare() {
        return this.getPlayerSubsystem().CU();
    }

    /** Begins loading content */
    loading() {
        return this.getPlayerSubsystem().loading();
    }

    /**
     * Closes the player session.
     * @param {Function} [callback] - Optional completion callback
     */
    closing(callback) {
        return this.chainCallback(this.viewEventEmitter.closing(), callback);
    }

    /** Starts or resumes playback */
    playing() {
        return this.getPlayerSubsystem().playing();
    }

    /** Pauses playback */
    pause() {
        return this.getPlayerSubsystem().pause();
    }

    /** @throws {Error} Not implemented */
    seek() {
        throw Error("Seek by graph position has not been implemented");
    }

    /** @throws {Error} Not implemented */
    transition() {
        throw Error("Transition segment has not been implemented");
    }

    /**
     * Engages playback at a specified point.
     * @param {*} position
     * @param {Function} [callback]
     */
    engage(position, callback) {
        return this.chainCallback(this.getPlayerSubsystem().O_(position), callback);
    }

    /** @param {*} errorInfo - Forces an error condition */
    induceError(errorInfo) {
        return this.getPlayerSubsystem().gFb(errorInfo);
    }

    /** No-op stub for stall recovery */
    tryRecoverFromStall() {}

    // ─── Media Info ──────────────────────────────────────────────────

    /** @returns {Object} Player diagnostics */
    getDiagnostics() {
        return this.getPlayerSubsystem().OBb();
    }

    /** @returns {number} Current playback time */
    getCurrentTime() {
        return this.getPlayerSubsystem().XA();
    }

    /** @returns {number} Buffered time range */
    getBufferedTime() {
        return this.getPlayerSubsystem().wBb();
    }

    /** @returns {number} Current segment time */
    getSegmentTime() {
        return this.getPlayerSubsystem().XH();
    }

    /** @returns {number} Content duration */
    getDuration() {
        return this.getPlayerSubsystem().YL();
    }

    /** @returns {Object} Video dimensions */
    getVideoSize() {
        return this.getPlayerSubsystem().PDb();
    }

    /** @returns {number} Current volume level */
    getVolume() {
        return this.getPlayerSubsystem().SDb();
    }

    /** @returns {boolean} Whether the player is busy/updating */
    getBusy() {
        return this.getPlayerSubsystem().getUpdatingState();
    }

    /** @returns {*} Current error state */
    getError() {
        return this.getPlayerSubsystem().getError();
    }

    /** @returns {*} Ad manager instance */
    getAdManager() {
        return this.getPlayerSubsystem().getPlaybackContainer();
    }

    /** @returns {number} Current playback rate */
    getPlaybackRate() {
        return this.getPlayerSubsystem().fetchData();
    }

    /** @returns {Object} Time code information */
    getTimeCodes() {
        return this.getPlayerSubsystem().HDb();
    }

    /** @returns {Array} Chapter information */
    getChapters() {
        return this.getPlayerSubsystem().getChapters();
    }

    /** @returns {*} Crop aspect ratio */
    getCropAspectRatio() {
        return this.getPlayerSubsystem().fsa();
    }

    /** @returns {*} Additional log info for telemetry */
    getAdditionalLogInfo() {
        return this.getPlayerSubsystem().lBb();
    }

    /** @returns {Object} Session summary data */
    getSessionSummary() {
        return this.getPlayerSubsystem().CWa();
    }

    /**
     * @param {*} params - Screenshot generation parameters
     * @returns {*} Generated screenshots
     */
    generateScreenshots(params) {
        return this.getPlayerSubsystem().gBb(params);
    }

    // ─── Audio Track Management ──────────────────────────────────────

    /** @returns {Array} List of available audio tracks */
    getAudioTrackList() {
        return this.getPlayerSubsystem().nBb();
    }

    /** @returns {number} Maximum recommended audio track index */
    getMaxRecommendedAudioIndex() {
        return this.getPlayerSubsystem().ACb();
    }

    /** @returns {Object} Currently selected audio track */
    getAudioTrack() {
        return this.getPlayerSubsystem().mBb();
    }

    /** @param {Object} track - Audio track to select */
    setAudioTrack(track) {
        return this.getPlayerSubsystem().setAudioTrack(track);
    }

    /** @param {boolean} muted */
    setMuted(muted) {
        return this.getPlayerSubsystem().tSb(muted);
    }

    /** @param {number} volume */
    setVolume(volume) {
        return this.getPlayerSubsystem().MSb(volume);
    }

    /** @param {number} rate */
    setPlaybackRate(rate) {
        return this.getPlayerSubsystem().internal_Zza(rate);
    }

    // ─── Text/Subtitle Track Management ──────────────────────────────

    /**
     * @param {*} [options]
     * @returns {Array} List of text tracks
     */
    getTextTrackList(options) {
        return this.getPlayerSubsystem().NWa(options);
    }

    /**
     * @param {*} [options]
     * @returns {number} Maximum recommended text track index
     */
    getMaxRecommendedTextIndex(options) {
        return this.getPlayerSubsystem().TVa(options);
    }

    /** @returns {Object} Currently selected text track */
    getTextTrack() {
        return this.getPlayerSubsystem().MWa();
    }

    /** @param {Object} track - Text track to select */
    setTextTrack(track) {
        return this.getPlayerSubsystem().setTextTrack(track);
    }

    /** Alias for getTextTrackList */
    getTimedTextTrackList(options) {
        return this.getPlayerSubsystem().NWa(options);
    }

    /** Alias for getMaxRecommendedTextIndex */
    getMaxRecommendedTimedTextIndex(options) {
        return this.getPlayerSubsystem().TVa(options);
    }

    /** Alias for getTextTrack */
    getTimedTextTrack() {
        return this.getPlayerSubsystem().MWa();
    }

    /** Alias for setTextTrack */
    setTimedTextTrack(track) {
        return this.getPlayerSubsystem().setTextTrack(track);
    }

    /** @returns {Object} Timed text (subtitle) configuration */
    getTimedTextSettings() {
        return this.getPlayerSubsystem().getSubtitleConfiguration();
    }

    /** @param {Object} settings - New timed text configuration */
    setTimedTextSettings(settings) {
        return this.getPlayerSubsystem().setTimedTextConfig(settings);
    }

    /**
     * Loads a custom timed text track.
     * @param {*} url
     * @param {*} language
     * @param {*} type
     * @param {*} options
     */
    loadCustomTimedTextTrack(url, language, type, options) {
        return this.getPlayerSubsystem().mIb(url, language, type, options);
    }

    /**
     * @param {*} frameIndex - Trick play frame index
     * @returns {*} Trick play frame data
     */
    getTrickPlayFrame(frameIndex) {
        return this.getPlayerSubsystem().KDb(frameIndex);
    }

    // ─── Live Playback ───────────────────────────────────────────────

    /**
     * Gets the live playback manager interface if available.
     * @returns {Object|undefined} Live playback controls, or undefined if not a live stream
     */
    getLivePlaybackManager() {
        const liveManager = this.getPlayerSubsystem().livePlaybackManager();
        assert(liveManager, "Unexpected call to getLivePlaybackManager()");

        if (liveManager.isLive && !liveManager.FYc()) {
            return {
                seekToLiveEdge: () => liveManager.seekToLiveEdge(),
                isAtLiveEdge: () => liveManager.eventEndPts(),
                getLiveEventState: () => liveManager.getLiveEventState(),
                isLiveEventEnded: () => liveManager.isLiveEventEnded(),
            };
        }
    }

    // ─── Playgraph (Interactive Content) ─────────────────────────────

    /**
     * Gets the playgraph manager for interactive content.
     * @returns {Object} Playgraph management API
     */
    getPlaygraphManager() {
        return {
            getPlaygraphId: () => this.viewEventEmitter.lWa(),
            getCurrentSegmentId: () => this.viewEventEmitter.KBb(),
            getPlaygraphMap: () => this.viewEventEmitter.CS(),
            updatePlaygraphMap: (map) => this.viewEventEmitter.updatePlaygraphMap(map),
            getSegmentOffset: () => this.viewEventEmitter.rDb(),
            getPlaygraphSessionOffset: () => this.viewEventEmitter.internal_Cyc(),
            getPlaygraphDuration: () => this.viewEventEmitter.internal_Byc(),
        };
    }
}
