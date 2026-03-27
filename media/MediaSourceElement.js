/**
 * Netflix Cadmium Player - MediaSourceElement
 *
 * Wraps the HTML5 <video> element with Media Source Extensions (MSE).
 * Manages source buffers, seeking, playback quality metrics, and
 * video element lifecycle (create, attach, detach, destroy).
 *
 * @module MediaSourceElement
 * @see Module_11953
 */

// --- Dependency imports (webpack module IDs for reference) ---
import { SourceBuffer } from '../modules/Module_90762.js';                  // g = a(90762)
import {
    segmentDurationMs,
    lK as NOOP_RESOLVE,
    AUDIO_TYPE as AUDIO_TYPE,
    B7 as VIDEO_TYPE
} from '../config/PlayerConfiguration.js';                                        // f = a(33096)
import { config } from '../drm/MicrosoftScreenSizeFilter.js';                        // e = a(29204)
import { jl as EventEmitter } from '../text/SubtitleDownloader.js';            // h = a(94886)
import {
    writeBytes as documentVisibility,
    stateChangeEvent as visibilityChangeEvent
} from '../modules/Module_37509.js';                                        // k = a(37509)
import { createElement, pic as matchesSourceBuffer } from '../core/PlayerConfig.js'; // l = a(52569)
import {
    fetchOperation as createDebugLogger,
    disposableList,
    extractFromMessage as toHexString
} from '../drm/LicenseBroker.js';                                        // m = a(31276)
import {
    ea as ErrorCodes,
    EventTypeEnum,
    mapMediaErrorCode as mapMediaErrorCode
} from '../drm/MediaKeySystemAccessServices.js';                                        // n = a(36129)
import { assert } from '../config/PlayerConfiguration.js';                        // q = a(45146)
import { zk as formatPts } from '../modules/Module_8825.js';                // r = a(8825)
import { cib as cachedValueFactory } from '../modules/Module_67572.js';     // u = a(67572)
import {
    assignProperties,
    initializeModel as serializeError,
    parseInteger
} from '../utils/IpAddressUtils.js';                                         // v = a(3887)
import { r_a as formatErrorPayload } from '../modules/Module_77705.js';     // w = a(77705)
import {
    NP as NativeMediaSource,
    $i as documentRef,
    totalTime as toMediaTime,
    internal_Tka as absPts
} from '../utils/IpAddressUtils.js';                                        // x = a(22365)
import { gd as isDefined, wc as isNumber } from '../utils/IpAddressUtils.js'; // y = a(32687)
import { ofb as mediaElementBindingKey } from '../modules/Module_80012.js'; // A = a(80012)
import { MediaSourceEvents } from './MediaSourceEvents.js';             // z = a(16520)
import {
    eQc as sanitizeDuration,
    ellaSendRateMultiplier as toMilliseconds
} from '../drm/LicenseBroker.js';                                         // B = a(5021)
import { PlayerEvents } from '../drm/LicenseBroker.js';                  // C = a(85001)
import { zv as ReadyState } from '../msl/MslComponentInitializer.js';              // D = a(63156)
import { iWa as extractSystemCode } from '../drm/EmeConstants.js';      // E = a(82100)
import { MediaType } from '../streaming/MediaRequestEventReporter.js';                     // G = a(26388)
import { valueList as schedulerKey } from '../monitoring/MonitoringModule.js';     // F = a(53085)
import { currentBitrate as ObservableValue } from '../drm/EmeSession.js'; // H = a(81734)

// ─── Feature detection ───────────────────────────────────────────────────────

/** Whether MSE is supported in this environment. */
const isMseSupported = !!(
    NativeMediaSource &&
    HTMLVideoElement &&
    URL &&
    HTMLVideoElement.prototype.playing
);

// ─── Helper: createVideoElement ──────────────────────────────────────────────

/**
 * Creates a new `<video>` element styled for full-viewport playback.
 *
 * @returns {HTMLVideoElement} The newly created video element.
 */
function createVideoElement() {
    const video = createElement('VIDEO', 'position:absolute;width:100%;height:100%');
    video.disablePictureInPicture = config.disablePictureInPicture;
    return video;
}

// ─── TraceLog ────────────────────────────────────────────────────────────────

/**
 * Circular buffer that records trace events for diagnostics.
 * Keeps the most recent `maxEntries` entries.
 */
class TraceLog {
    constructor() {
        /** @type {Array<[string, *]>} */
        this._entries = [];
        /** @type {number} */
        this._maxEntries = 50;
    }

    /**
     * Append a trace entry.
     *
     * @param {string} label - Short event label.
     * @param {*}      [value] - Optional payload.
     */
    addEntry(label, value) {
        this._entries.push([label, value]);
        if (this._entries.length > this._maxEntries) {
            this._entries.shift();
        }
    }

    /**
     * Return all stored trace entries.
     *
     * @returns {Array<[string, *]>}
     */
    getEntries() {
        return this._entries;
    }
}

// ─── MediaSourceElement ──────────────────────────────────────────────────────

/**
 * Wraps a `<video>` element and a native `MediaSource`, providing a
 * higher-level API for Netflix's adaptive streaming engine (ASE).
 *
 * Responsibilities:
 *  - Creating / attaching / detaching the HTMLVideoElement
 *  - Opening and closing the underlying MediaSource
 *  - Adding / removing SourceBuffers
 *  - Seeking with event validation (seeking -> seeked -> timeupdate)
 *  - Collecting playback-quality statistics (decoded / dropped / corrupted frames)
 *  - Forwarding relevant video-element events through an EventEmitter
 */
class MediaSourceElement {
    /**
     * @param {object} playerState - The shared player-state container.
     */
    constructor(playerState) {
        /** @type {object} */
        this.playerState = playerState;

        // Silence an unused promise (original code: `Promise.resolve()`)
        Promise.resolve();

        /** @type {Array<SourceBuffer>} Source buffers attached to the native MediaSource. */
        this._sourceBuffers = [];

        /** @type {EventEmitter} */
        this.eventEmitter = new EventEmitter();

        /** @type {number} Cached currentTime in seconds from the video element. */
        this._cachedCurrentTimeSeconds = 0;

        /**
         * Array of cached-value wrappers that track frame statistics.
         * @type {Array<object>}
         * @private
         */
        this._cachedValues = [];

        /** @type {object} Debug logger scoped to "MediaElementASE". */
        this.debugLogger = createDebugLogger(this.playerState, 'MediaElementASE');

        /**
         * Promise resolver that is replaced when waiting for a video-type
         * source-buffer's internal signal (e.g. changeType readiness).
         * @private
         */
        this._pendingResolve = NOOP_RESOLVE;

        /** @type {boolean} Whether at least one decoded frame has been detected. */
        this._hasDecodedFrame = false;

        /** @type {TraceLog} */
        this._traceLog = new TraceLog();

        /** @type {ObservableValue} Mirrors the video element's `readyState`. */
        this._readyStateObservable = new ObservableValue(ReadyState.aK.HAVE_NOTHING);

        /**
         * Map of event-name -> handler currently attached to the video element.
         * @type {Record<string, Function>}
         * @private
         */
        this._videoEventHandlers = {};

        /**
         * Pending seek state. Non-null while a seek is in progress.
         * @type {{ seekingFired?: boolean, seekedFired?: boolean, timeUpdateFired?: boolean } | undefined}
         * @private
         */
        this._pendingSeek = undefined;

        // ── Cached frame-statistic accessors ──

        /** Returns the number of decoded frames (webkit fallback). */
        this.getDecodedFrameCount = this._createCachedAccessor(() => {
            if (this.htmlVideoElement) {
                return this.htmlVideoElement.webkitDecodedFrameCount ?? 0;
            }
        });

        /** Returns total video frames via VideoPlaybackQuality or webkit fallback. */
        this.getTotalVideoFrames = this._createCachedAccessor(() => {
            if (this.htmlVideoElement) {
                const quality = this._getVideoPlaybackQuality();
                return quality ? quality.totalVideoFrames : this.htmlVideoElement.webkitDecodedFrameCount;
            }
        });

        /** Returns dropped video frames via VideoPlaybackQuality or webkit fallback. */
        this.getDroppedVideoFrames = this._createCachedAccessor(() => {
            if (this.htmlVideoElement) {
                const quality = this._getVideoPlaybackQuality();
                return quality ? quality.droppedVideoFrames : this.htmlVideoElement.webkitDroppedFrameCount;
            }
        });

        /** Returns corrupted video frames (if available). */
        this.getCorruptedVideoFrames = this._createCachedAccessor(() => {
            if (this.htmlVideoElement) {
                const quality = this._getVideoPlaybackQuality();
                return quality && quality.corruptedVideoFrames;
            }
        });

        // ── Bound callbacks (must survive addEventListener / removeEventListener) ──

        /** @private Handler called when a license is added (DRM). */
        this._onLicenseAdded = (license) => {
            this.eventEmitter.emit(MediaSourceEvents.licenseadded, { J: license });
        };

        /** @private Visibility-change handler: pause/resume cached-value tracking. */
        this._onVisibilityChange = () => {
            if (documentRef.hidden === true) {
                this._cachedValues.forEach((cv) => { cv.refresh(); cv.MZc(); });
            } else {
                this._cachedValues.forEach((cv) => { cv.refresh(); cv.n_c(); });
            }
        };

        /** @private Populates diagnostic info for log/telemetry snapshots. */
        this._onDiagnosticSnapshot = (event) => {
            if (!this.htmlVideoElement) return;

            const snapshot = event.FBa;
            const trustStatus = this._getGraphicsTrustStatus();
            if (trustStatus) {
                snapshot.ConstrictionActive = trustStatus.constrictionActive;
                snapshot.Status = trustStatus.status;
            }

            try {
                snapshot.readyState = '' + this.htmlVideoElement.readyState;
                snapshot.currentTime = '' + this.htmlVideoElement.currentTime;
                snapshot.pbRate = '' + this.htmlVideoElement.playbackRate;
            } catch (_ignored) { /* swallow */ }

            let i = this._sourceBuffers.length;
            while (i--) {
                const sb = this._sourceBuffers[i];
                let prefix = '';
                if (sb.type === AUDIO_TYPE) prefix = 'audio';
                else if (sb.type === VIDEO_TYPE) prefix = 'video';
                assignProperties(snapshot, sb.getBufferStatus(), { prefix });
            }

            if (this.nativeMediaSource) {
                const dur = this.nativeMediaSource.duration;
                if (dur && !isNaN(dur)) {
                    snapshot.duration = dur.toFixed(4);
                }
            }
        };

        /** @private Emits readyStateChanged when the observable fires. */
        this._onReadyStateChange = () => {
            this.eventEmitter.emit(MediaSourceEvents.readyStateChanged);
        };

        // ── Initialization ──

        if (isMseSupported) {
            this._mediaElementBinding = disposableList.key(mediaElementBindingKey).create(this, this.playerState);
            this.scheduler = disposableList.key(schedulerKey);

            if (config.B1) {
                new Promise((resolve) => {
                    this._pendingResolve = resolve;
                    this.playerState.addEventListener(PlayerEvents.clearTimeoutFn, resolve);
                });
            }

            this.debugLogger.pauseTrace('Created Media Element');
            this.addEventListener = this.eventEmitter.addListener;
            this.removeEventListener = this.eventEmitter.removeListener;

            /** @private The encrypted-media event name for this environment. */
            this._encryptedEventName = 'encrypted';
        } else {
            this._fireError(ErrorCodes.PLAY_MSE_NOTSUPPORTED);
        }
    }

    // ── Properties ───────────────────────────────────────────────────────────

    /**
     * The list of currently attached source buffers.
     * @returns {Array<SourceBuffer>}
     */
    get sourceBuffers() {
        return this._sourceBuffers;
    }

    /**
     * Minimum seek delta (in PTS units) below which a seek is ignored.
     * @returns {number}
     * @private
     */
    get _minSeekDelta() {
        return config.pZc;
    }

    // ── Public API ───────────────────────────────────────────────────────────

    /**
     * Read the current playback position from the underlying video element,
     * caching the raw seconds value, and return it in media-time (PTS) units.
     *
     * @param {boolean} [reportErrors=false] - If true, fires an error event on failure.
     * @returns {number} Current time in PTS units.
     */
    getCurrentTime(reportErrors) {
        try {
            if (this.htmlVideoElement) {
                this._cachedCurrentTimeSeconds = this.htmlVideoElement.currentTime;
            }
        } catch (err) {
            this.debugLogger.error('Exception while getting VIDEO.currentTime', err);
            if (reportErrors) {
                this._reportError(ErrorCodes.PLAY_MSE_GETCURRENTTIME, err);
            }
        }
        return toMediaTime(this._cachedCurrentTimeSeconds * segmentDurationMs);
    }

    /**
     * Seek the video element to the given media-time position.
     *
     * @param {number}  targetPts          - Target position in PTS units.
     * @param {boolean} [forceSeek=false]  - Skip the minimum-delta check.
     */
    seek(targetPts, forceSeek = false) {
        assert(!this._pendingSeek);
        this._refreshCachedValues();

        const currentPts = this.getCurrentTime(true);

        if (!forceSeek && !config.Lbc && absPts(currentPts - targetPts) <= this._minSeekDelta) {
            this.debugLogger.pauseTrace('Seek delta too small', {
                currentTime: currentPts,
                seekTime: targetPts,
                min: this._minSeekDelta,
            });
            this._traceLog.addEntry('smallseek', targetPts);
            return;
        }

        this._traceLog.addEntry('seek', targetPts);
        try {
            this.debugLogger.pauseTrace('Setting video elements currentTime', {
                From: formatPts(currentPts),
                To: formatPts(targetPts),
            });
            this._pendingSeek = {};
            this.htmlVideoElement.currentTime = targetPts / segmentDurationMs;
            this.eventEmitter.emit(MediaSourceEvents.currentTimeChanged);
        } catch (err) {
            this.debugLogger.error('Exception while setting VIDEO.currentTime', err);
            this._reportError(ErrorCodes.PLAY_MSE_SETCURRENTTIME, err);
        }
    }

    /**
     * Whether a seek operation is currently in progress.
     * @returns {boolean}
     */
    isSeeking() {
        return !!this._pendingSeek;
    }

    /**
     * Create and register a single SourceBuffer for the given media type.
     *
     * @param {string} mediaType - The media type identifier (audio or video).
     * @returns {SourceBuffer|undefined} The created buffer, or undefined on failure.
     */
    addSourceBuffer(mediaType) {
        try {
            const sb = new SourceBuffer(this.playerState, mediaType, this.nativeMediaSource, this.debugLogger);
            this._sourceBuffers.push(sb);
            if (mediaType === VIDEO_TYPE && sb.hUa) {
                sb.hUa.addListener(this._pendingResolve);
            }
            this.eventEmitter.emit(MediaSourceEvents.sourceBufferAdded);
            return sb;
        } catch (err) {
            const serialized = serializeError(err);
            this.debugLogger.error('Unable to add source buffer.', { error: serialized });
            this.playerState.fireError(ErrorCodes.PLAY_MSE_SOURCEADD, {
                Ya: mediaType === MediaType.V ? EventTypeEnum.MSE_AUDIO : EventTypeEnum.MSE_VIDEO,
                configFlag: serialized,
            });
        }
    }

    /**
     * Create source buffers for an array of media types.
     *
     * @param {Array<string>} mediaTypes - Array of media type identifiers.
     * @returns {boolean} Always returns true.
     */
    addSourceBuffers(mediaTypes) {
        mediaTypes.forEach((type) => this.addSourceBuffer(type));
        return true;
    }

    /**
     * Remove a native source buffer from the MediaSource and our tracking list.
     *
     * @param {object} nativeSourceBuffer - The native SourceBuffer to remove.
     */
    removeSourceBuffer(nativeSourceBuffer) {
        this._sourceBuffers = this._sourceBuffers.filter(
            (sb) => !matchesSourceBuffer(nativeSourceBuffer, sb)
        );
        this.nativeMediaSource.removeSourceBuffer(nativeSourceBuffer);
    }

    /**
     * Signal end-of-stream to the native MediaSource.
     */
    endOfStream() {
        this._traceLog.addEntry('endofstream');
        if (config.enableTimedTextFallback) {
            this.nativeMediaSource.endOfStream();
        }
    }

    /**
     * Clear all tracked source buffers.
     *
     * @param {object} [session] - Optional session object whose Tjd() is invoked.
     * @returns {boolean} Always true.
     */
    clearListeners(session) {
        this._sourceBuffers = [];
        if (session) session.Tjd();
        return true;
    }

    /**
     * Return the sanitised duration of the native MediaSource.
     *
     * @returns {number|undefined}
     */
    getMediaSourceDuration() {
        if (this.nativeMediaSource) {
            return sanitizeDuration(this.nativeMediaSource.duration);
        }
    }

    /**
     * Detect whether the video element has decoded at least one frame.
     *
     * @returns {boolean}
     */
    hasDecodedFrame() {
        if (
            !this._hasDecodedFrame &&
            this.htmlVideoElement &&
            this.htmlVideoElement.readyState >= ReadyState.aK.HAVE_CURRENT_DATA
        ) {
            const count = this.htmlVideoElement.webkitDecodedFrameCount;
            if (count === undefined || count > 0 || config.webkitDecodedFrameCountIncorrectlyReported) {
                this._hasDecodedFrame = true;
            }
        }
        return this._hasDecodedFrame;
    }

    /**
     * Open the MediaSource: create (or adopt) a video element, instantiate the
     * native MediaSource, wire up events, and attach to the DOM.
     *
     * @param {HTMLVideoElement} [existingVideoElement] - Reuse this element instead of creating one.
     */
    open(existingVideoElement) {
        this.htmlVideoElement = existingVideoElement || createVideoElement();

        // Create native MediaSource
        try {
            this.nativeMediaSource = new NativeMediaSource();
        } catch (err) {
            this._reportError(ErrorCodes.PLAY_MSE_CREATE_MEDIASOURCE, err);
            return;
        }

        // Create object URL
        try {
            this._objectURL = URL.createObjectURL(this.nativeMediaSource);
        } catch (err) {
            this._reportError(ErrorCodes.PLAY_MSE_CREATE_MEDIASOURCE_OBJECTURL, err);
            return;
        }

        // Wire up events and attach
        try {
            this.nativeMediaSource.addEventListener('sourceopen', (event) => {
                this._onSourceOpen(event);
            });
            this._mediaElementBinding.internal_Fac(this._onLicenseAdded);
            this._attachVideoEventListeners(this.htmlVideoElement);
            this._attachToContainer(this.htmlVideoElement);
            this.htmlVideoElement.src = this._objectURL;
            this._readyStateObservable.addListener(this._onReadyStateChange);
            this.playerState.addEventListener(PlayerEvents.a6a, this._onDiagnosticSnapshot);
            documentVisibility.addListener(visibilityChangeEvent, this._onVisibilityChange);
            this._onVisibilityChange();
        } catch (err) {
            this._reportError(ErrorCodes.PLAY_MSE_CREATE_MEDIASOURCE_OPEN, err);
            return;
        }

        // Auto-attach DRM binding if no external video element was provided
        if (!existingVideoElement && this.playerState.aT && !config.z8a) {
            this._mediaElementBinding.SLb();
        }
    }

    /**
     * Close the MediaSource: detach events, tear down video element, revoke
     * the object URL, and clear internal state.
     */
    close() {
        this._traceLog.addEntry('close');
        if (!this.htmlVideoElement) return;

        this.getCurrentTime(false);
        this._refreshCachedValues();
        this._sourceBuffers = [];
        this._removeVideoEventListeners(this.htmlVideoElement);
        this._detachFromContainer(this.htmlVideoElement);
        this._mediaElementBinding.NTc(this._onLicenseAdded);
        this._mediaElementBinding.closing();
        clearTimeout(this._mediaElementBinding.Qkd);
        this._readyStateObservable.removeListener(this._onReadyStateChange);
        this.playerState.removeEventListener(PlayerEvents.a6a, this._onDiagnosticSnapshot);
        documentVisibility.removeListener(visibilityChangeEvent, this._onVisibilityChange);
        this.htmlVideoElement = undefined;
    }

    /**
     * Reset pending-seek state without waiting for completion events.
     */
    resetSeek() {
        if (this._pendingSeek) {
            this._traceLog.addEntry('resetSeek');
            this._pendingSeek = undefined;
        }
    }

    /**
     * Lazily attach the DRM binding (deferred encrypted-media setup).
     */
    attachEncryptedMediaBinding() {
        if (config.z8a) {
            this._mediaElementBinding.SLb();
        }
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    /**
     * Query the VideoPlaybackQuality interface from the video element.
     *
     * @returns {VideoPlaybackQuality|undefined}
     * @private
     */
    _getVideoPlaybackQuality() {
        if (!this.htmlVideoElement) return undefined;
        return (
            (this.htmlVideoElement.getVideoPlaybackQuality && this.htmlVideoElement.getVideoPlaybackQuality()) ||
            this.htmlVideoElement.videoPlaybackQuality ||
            this.htmlVideoElement.playbackQuality
        );
    }

    /**
     * Check whether the last player error was a pause/inactivity timeout.
     *
     * @returns {boolean}
     * @private
     */
    _isTimeoutError() {
        const lastError = this.playerState.lastError;
        const code = lastError && lastError.errorCode;
        return code != null && [ErrorCodes.PAUSE_TIMEOUT, ErrorCodes.INACTIVITY_TIMEOUT].indexOf(code) >= 0;
    }

    /**
     * Wrap a value-producing function in a cached-value helper that
     * participates in visibility-change refresh cycles.
     *
     * @param {Function} fn - Producer function.
     * @returns {Function} Accessor that refreshes and returns the cached value.
     * @private
     */
    _createCachedAccessor(fn) {
        const cached = disposableList.key(cachedValueFactory)(fn);
        this._cachedValues.push(cached);
        return () => {
            cached.refresh();
            return cached.internal_Wvc();
        };
    }

    /**
     * Fire an error on the player state, extracting hex sub-codes from the
     * exception message when possible.
     *
     * @param {string} errorCode - One of the ErrorCodes constants.
     * @param {Error}  err       - The caught exception.
     * @private
     */
    _reportError(errorCode, err) {
        const payload = {
            Ya: EventTypeEnum.EXCEPTION,
            configFlag: serializeError(err),
        };

        try {
            const match = err.message.match(/(?:[x\W\s]|^)([0-9a-f]{8})(?:[x\W\s]|$)/i);
            const hex = match[1].toUpperCase();
            if (hex && hex.length === 8) {
                payload.errorSubcode = hex;
            }
        } catch (_ignored) { /* no hex sub-code found */ }

        this.playerState.fireError(errorCode, payload);
    }

    /**
     * Refresh all cached frame-stat values.
     * @private
     */
    _refreshCachedValues() {
        this._cachedValues.forEach((cv) => cv.refresh());
    }

    /**
     * Return the Edge/IE graphics trust status (HDCP), if available.
     *
     * @returns {object|undefined}
     * @private
     */
    _getGraphicsTrustStatus() {
        return this.htmlVideoElement && this.htmlVideoElement.msGraphicsTrustStatus;
    }

    /**
     * Fire a fatal error on the player state (no exception payload).
     *
     * @param {string} errorCode
     * @param {object} [details]
     * @private
     */
    _fireError(errorCode, details) {
        this.playerState.fireError(errorCode, details, undefined);
    }

    /**
     * Handle the native MediaSource `sourceopen` event (only once).
     *
     * @param {Event} event
     * @private
     */
    _onSourceOpen(event) {
        if (!this._sourceOpened) {
            this._sourceOpened = true;
            this.eventEmitter.emit(MediaSourceEvents.sourceopen, event);
        }
    }

    /**
     * Handle the video element `seeking` event.
     * @private
     */
    _onSeeking() {
        this._traceLog.addEntry('seeking');
        this.debugLogger.pauseTrace('Video element event: seeking');

        if (this._pendingSeek) {
            this._pendingSeek.seekingFired = true;
        } else {
            this.debugLogger.error('unexpected seeking event');
            if (config.fatalOnUnexpectedSeeking) {
                this._fireError(ErrorCodes.PLAY_MSE_UNEXPECTED_SEEKING, {
                    Cf: { Trace: this._traceLog.getEntries() },
                });
            }
        }
    }

    /**
     * Handle the video element `seeked` event.
     * @private
     */
    _onSeeked() {
        this._traceLog.addEntry('seeked');
        this.debugLogger.pauseTrace('Video element event: seeked');

        if (this._pendingSeek) {
            assert(this._pendingSeek.seekingFired);
            this._pendingSeek.seekedFired = true;
            this._maybeCompleteSeek();
        } else {
            this.debugLogger.error('unexpected seeked event');
            if (config.fatalOnUnexpectedSeeked) {
                this._fireError(ErrorCodes.PLAY_MSE_UNEXPECTED_SEEKED, {
                    Cf: { Trace: this._traceLog.getEntries() },
                });
            }
        }
    }

    /**
     * Handle the video element `timeupdate` event.
     * @private
     */
    _onTimeUpdate() {
        this._traceLog.addEntry('timeupdate', this.htmlVideoElement?.currentTime);

        if (this._pendingSeek) {
            this._pendingSeek.timeUpdateFired = true;
            this._maybeCompleteSeek();
        }
        this.eventEmitter.emit(MediaSourceEvents.currentTimeChanged);
    }

    /**
     * Handle the video element `loadstart` event.
     * @private
     */
    _onLoadStart() {
        this.debugLogger.pauseTrace('Video element event: loadstart');
    }

    /**
     * Handle the video element `volumechange` event.
     *
     * @param {Event} event
     * @private
     */
    _onVolumeChange(event) {
        this.debugLogger.pauseTrace('Video element event:', event.type);
        try {
            this.playerState.volume.set(this.htmlVideoElement.volume);
            this.playerState.muted.set(this.htmlVideoElement.muted);
        } catch (err) {
            this.debugLogger.error('error updating volume', err);
        }
    }

    /**
     * Handle the video element `error` event.
     *
     * @param {Event} event
     * @private
     */
    _onError(event) {
        const traceEntries = this._traceLog.getEntries();
        const target = event.target;
        const mediaError = target && target.error;
        const legacyErrorCode = event.errorCode;

        let code = mediaError && mediaError.code;
        if (!isDefined(code)) {
            code = legacyErrorCode && legacyErrorCode.code;
        }

        const message = mediaError && mediaError.message;

        let systemCode = mediaError && mediaError.msExtendedCode;
        if (!isDefined(systemCode)) systemCode = mediaError && mediaError.systemCode;
        if (!isDefined(systemCode)) systemCode = event.systemCode;
        if (!isDefined(systemCode)) systemCode = extractSystemCode(message);

        const errorInfo = assignProperties(
            {},
            { code, systemCode, pauseTrace: JSON.stringify(traceEntries) },
            { jxa: true }
        );

        const payload = {
            Ya: mapMediaErrorCode(code),
            configFlag: formatErrorPayload(errorInfo),
        };

        try {
            if (message) payload.uea = message;
        } catch (_ignored) { /* swallow */ }

        const parsedSystemCode = parseInteger(systemCode);
        if (isNumber(parsedSystemCode)) {
            payload.errorSubcode = toHexString(parsedSystemCode, 4);
        }

        this._fireError.call(this, ErrorCodes.PLAY_MSE_EVENT_ERROR, payload);
    }

    /**
     * If the pending seek has received both `seeked` and `timeupdate` events,
     * finalize the seek and emit the `seeked` event to listeners.
     *
     * @private
     */
    _maybeCompleteSeek() {
        if (this._pendingSeek && this._pendingSeek.seekedFired && this._pendingSeek.timeUpdateFired) {
            this._traceLog.addEntry('seekcomplete');
            this._pendingSeek = undefined;
            this.eventEmitter.emit(MediaSourceEvents.seeked);
        }
    }

    /**
     * Attach all video-element event listeners and start the readyState
     * polling interval.
     *
     * @param {HTMLVideoElement} videoElement
     * @private
     */
    _attachVideoEventListeners(videoElement) {
        const handlers = this._videoEventHandlers;

        const on = (eventName, handler) => {
            videoElement.addEventListener(eventName, handler);
            handlers[eventName] = handler;
        };

        on('error', (e) => this._onError(e));
        on('seeking', () => this._onSeeking());
        on('seeked', () => this._onSeeked());
        on('timeupdate', () => this._onTimeUpdate());
        on('loadstart', () => this._onLoadStart());
        on('volumechange', (e) => this._onVolumeChange(e));
        on(this._encryptedEventName, () => this.attachEncryptedMediaBinding());

        if (config.disableVideoRightClickMenu) {
            on('contextmenu', (e) => e.preventDefault());
        }

        this._readyStatePollingInterval = this.scheduler.repeatInterval(
            toMilliseconds(500),
            () => { this._readyStateObservable.set(videoElement.readyState); }
        );
    }

    /**
     * Remove all video-element event listeners and cancel readyState polling.
     *
     * @param {HTMLVideoElement} videoElement
     * @private
     */
    _removeVideoEventListeners(videoElement) {
        if (!videoElement) return;

        for (const [eventName, handler] of Object.entries(this._videoEventHandlers)) {
            videoElement.removeEventListener(eventName, handler);
            delete this._videoEventHandlers[eventName];
        }

        this._readyStatePollingInterval?.cancel();
        this._readyStateObservable.set(ReadyState.aK.HAVE_NOTHING);
    }

    /**
     * Insert the video element into the player container, just before the
     * last child (so overlays remain on top).
     *
     * @param {HTMLVideoElement} videoElement
     * @private
     */
    _attachToContainer(videoElement) {
        const container = this.playerState.containerElement;
        const lastChild = container.lastChild;
        if (lastChild) {
            container.insertBefore(videoElement, lastChild);
        } else {
            container.appendChild(videoElement);
        }
    }

    /**
     * Remove the video element from the DOM and revoke the object URL.
     *
     * @param {HTMLVideoElement} videoElement
     * @private
     */
    _detachFromContainer(videoElement) {
        // Preserve the last frame on pause/inactivity timeout if configured
        if (!(config.preserveLastFrame && this._isTimeoutError())) {
            videoElement.removeAttribute('src');
            videoElement.loading();
            this.playerState.containerElement.removeChild(videoElement);
        }

        if (this._objectURL) {
            URL.revokeObjectURL(this._objectURL);
            this._objectURL = undefined;
        }
        this.nativeMediaSource = undefined;
    }
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
    MediaSourceElement,
    TraceLog,
    createVideoElement,
    isMseSupported,
};

/** @deprecated Use named export `MediaSourceElement` instead. */
export const qHa = MediaSourceElement;
