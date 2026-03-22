/**
 * Netflix Cadmium Player - SourceBufferManager
 *
 * Manages appending media data (audio, video, text) to MSE SourceBuffers.
 * Extends EventEmitter to notify listeners of header/fragment append events.
 *
 * @module SourceBufferManager
 * @see Webpack Module 78647
 */

import { __extends, __generator, __importDefault, __assign } from '../../modules/Module_22970.js'; // tslib helpers
import { EventEmitter } from '../../modules/Module_90745.js';
import {
    TimeUtil,
    AbortController,
    internal_Vrb,
    xM as isAbortError,
    VC,
    t9a as AbortError,
} from '../../modules/Module_91176.js';
import { platform } from '../../modules/Module_66164.js';
import { globalExtension } from '../../modules/Module_8171.js';
import MediaTypeEnum from '../../modules/Module_14282.js';
import { MediaType } from '../../modules/Module_65161.js';
import { assert } from '../../modules/Module_52571.js';
import { internal_Zgb as AppendProcessor } from '../../modules/Module_98321.js';
import { NC as AppendResult } from '../../modules/Module_50247.js';
import { s5 as createDelayedTask, ie as TimerUtil } from '../../modules/Module_40666.js';
import { MIb as buildAppendMetadata, concatenateArrayBuffers } from '../../modules/Module_69575.js';
import { AsyncIterator } from '../../modules/Module_29092.js';
import { KCa as TextMediaRequest } from '../../modules/Module_11758.js';
import { dk as isLiveStream } from '../../modules/Module_8149.js';

/**
 * Returns the relaxed buffer level for the given source buffer manager.
 *
 * @param {SourceBufferManager} manager - The source buffer manager instance
 * @returns {number} The relaxed buffer water mark level
 */
export function getRelaxedBufferLevel(manager) {
    return manager.lowestWaterMarkLevelBufferRelaxed(
        TimeUtil.fromMilliseconds(manager.cV)
    );
}

/**
 * Manages appending media segments to an MSE SourceBuffer. Handles header
 * appending, fragment appending (incremental and monolithic), text track
 * appending, end-of-stream signalling, and just-in-time (JIT) buffering.
 *
 * @extends EventEmitter
 *
 * @fires headerAppended - When a stream header has been appended
 * @fires requestAppended - When a media request has been appended
 * @fires managerdebugevent - Debug/trace messages
 */
export class SourceBufferManager extends EventEmitter {
    /**
     * @param {string} mediaType - The media type (audio/video/text)
     * @param {object} platformMediaSource - Platform MSE MediaSource wrapper
     * @param {object} sourceBuffer - The underlying SourceBuffer abstraction
     * @param {object} config - Configuration options
     * @param {object} player - Player instance for DRM readiness checks
     * @param {object} [forceEstRelativeLiveBookmark] - Live playback scheduler (optional)
     */
    constructor(mediaType, platformMediaSource, sourceBuffer, config, player, forceEstRelativeLiveBookmark) {
        super();

        /** @type {string} */
        this.mediaType = mediaType;

        /** @type {object} */
        this.platformMediaSource = platformMediaSource;

        /** @type {object} The underlying source buffer abstraction */
        this.sourceBuffer = sourceBuffer;

        /** @type {object} */
        this.config = config;

        /** @type {object} */
        this.player = player;

        /** @type {object|undefined} */
        this.forceEstRelativeLiveBookmark = forceEstRelativeLiveBookmark;

        /** @type {boolean} Whether frame processing is paused */
        this._isProcessingFramePaused = false;

        /** @type {boolean} Whether forced append bypass is active */
        this._forceAppendBypass = false;

        /** @type {boolean} Whether DRM key has been signalled to the source buffer */
        this._hasDrmKeySignalled = false;

        /** @type {object} Logging console bound to this media type */
        this.console = globalExtension.pE(this.mediaType);
        this.error = this.console.error.bind(this.console);
        this.RETRY = this.console.RETRY.bind(this.console);
        this.pauseTrace = this.console.pauseTrace.bind(this.console);

        // Listen for source buffer ready events to trigger append processing
        sourceBuffer.events?.addListener('ready', () => {
            this._processAppendQueue();
        });

        /** @type {AppendProcessor} Processes append metadata (offsets, logs, etc.) */
        this._appendProcessor = new AppendProcessor(
            this.config,
            this.mediaType,
            this.platformMediaSource.codecProfilesMap,
            this.console
        );

        this.create();
    }

    /**
     * Whether the end-of-stream flag is set.
     * @type {boolean}
     */
    get endOfStream() {
        return this.endOfStream;
    }

    /**
     * Whether the source buffer supports period transitions (multi-period).
     * @type {boolean}
     */
    get _supportsMultiPeriod() {
        return !!this.sourceBuffer.wrc;
    }

    /**
     * Resets internal state for a new playback session or seek.
     *
     * @param {boolean} [keepQueue=false] - If true, preserve the existing append queue
     */
    create(keepQueue) {
        this._delayedEosTask?.destroy();

        if (!keepQueue) {
            /** @type {Array} Queue of media requests waiting to be appended */
            this._appendQueue = [];
        }

        this._partialRequest = undefined;
        this._needsHeaderAppend = undefined;
        this._currentHeader = undefined;

        // Cancel any in-flight audio/video append task
        if (this._avAppendTask) {
            this._avAppendTask.isCancelledFlag = true;
            this._avAppendTask.iterator.cleanup();
            this._avAppendTask = undefined;
        }

        // Cancel any in-flight text append task
        if (this._textAppendTask) {
            this._textAppendTask.isCancelledFlag = true;
            this._textAppendTask.iterator.cleanup();
            this._textAppendTask = undefined;
        }

        // Abort any pending async appends
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = undefined;
        }
        this.abortController = new AbortController();

        /** @type {boolean} Whether DRM readiness has been observed at least once */
        this._hasDrmBeenReady = false;

        /** @type {object|undefined} Timestamp of the last appended live request */
        this._lastLiveAppendTimestamp = undefined;

        this._hasDrmKeySignalled = false;
        this.endOfStream = false;

        this._updateTimestampOffset(TimeUtil.seekToSample);
        this.sourceBuffer.create?.call(this.sourceBuffer);
        this._appendProcessor.create();
    }

    /**
     * Forces a header re-append on the next queue processing cycle.
     */
    internal_Vtc() {
        this._needsHeaderAppend = true;
    }

    /**
     * Signals that append can proceed even if frame processing was paused.
     */
    internal_Faa() {
        this._forceAppendBypass = true;
        this._processAppendQueue();
    }

    /**
     * Sets whether frame processing is currently paused.
     *
     * @param {boolean} isPaused - True if frame processing is paused
     */
    onProcessFrame(isPaused) {
        this._isProcessingFramePaused = isPaused;
    }

    /**
     * Adds a media request to the append queue and triggers processing.
     *
     * @param {object} request - The media request to enqueue
     */
    enqueueRequest(request) {
        this._appendQueue.push(request);
        this._processAppendQueue();
    }

    /**
     * Called when new data has been detected; re-triggers queue processing.
     */
    detected() {
        this._processAppendQueue();
    }

    /**
     * Called when a stream header completes downloading.
     * May immediately append the header or defer to the queue.
     *
     * @param {object} stream - The stream whose header completed
     */
    cLc(stream) {
        if (this.config.appendFirstHeaderOnComplete && this._partialRequest === undefined) {
            this._appendHeader(stream, 0);
        } else {
            this._processAppendQueue();
        }
    }

    /**
     * Signals end-of-stream to the underlying source buffer.
     * May delay the signal for live streams based on configuration.
     *
     * @param {boolean} [skipIfMultiPeriod=false] - If true, skip signalling when multi-period is supported
     */
    signalEndOfStream(skipIfMultiPeriod) {
        if (skipIfMultiPeriod === undefined) {
            skipIfMultiPeriod = false;
        }

        if (this.endOfStream) return;

        this.endOfStream = true;
        this._processAppendQueue();

        if (skipIfMultiPeriod && this._supportsMultiPeriod) return;

        if (this._lastLiveAppendTimestamp && this.forceEstRelativeLiveBookmark && this.config.delayNotificationOfEoS) {
            // Delay EOS notification for live streams until buffer drains near the end
            const bufferThreshold = TimeUtil.fromMilliseconds(this.config.timeBeforeEndOfStreamBufferMark);
            const bufferLevel = this._lastLiveAppendTimestamp.lowestWaterMarkLevelBufferRelaxed(bufferThreshold);
            const { priorityConfig, promise } = createDelayedTask(this.forceEstRelativeLiveBookmark, bufferLevel, true);

            this._delayedEosTask?.destroy();
            this._delayedEosTask = priorityConfig;

            promise.then(() => {
                if (this.endOfStream) {
                    this.sourceBuffer.endOfStream?.call(this.sourceBuffer);
                }
            });
        } else {
            this.sourceBuffer.endOfStream?.call(this.sourceBuffer);
        }
    }

    /**
     * Updates the timestamp offset on the source buffer if it changed.
     *
     * @param {object} newOffset - The new timestamp offset value
     * @private
     */
    _updateTimestampOffset(newOffset) {
        if (this.timestampOffset?.equal(newOffset)) return;

        this.timestampOffset = newOffset;
        this.sourceBuffer.JSb(newOffset.$, newOffset.timescaleValue);
    }

    /**
     * Main append queue processor. Dequeues the next request and dispatches
     * it for header or fragment appending based on stream state.
     *
     * @private
     */
    _processAppendQueue() {
        const config = this.config;

        // Don't process if an append is already in-flight or queue is empty
        if (this._avAppendTask || this._textAppendTask || !this._appendQueue.length) return;

        if (!this.sourceBuffer || this.sourceBuffer.ready === false) {
            this._emitDebug(
                '@' + platform.platform.now() + ', applying: not appending, sourceBuffer not ready'
            );
            return;
        }

        const request = this._appendQueue[0];
        const isRetained = request.NB;

        // Remove aborted requests that aren't retained
        if (request.aborted && !isRetained) {
            this.RETRY(
                'aborted fragment should not appear in the toAppend list:',
                request.toString(),
                'complete:',
                request.complete
            );
            this._emitDebug(
                '@' + platform.platform.now() +
                ', applying: removing aborted fragment from toAppend: ' + request.toString()
            );
            this._appendQueue.shift();
            return;
        }

        const stream = request.stream;
        const viewableSession = stream.viewableSession;

        if (!stream.headerReceived) return;

        // Signal DRM key to source buffer if needed
        if (request.xn && !this._hasDrmKeySignalled) {
            this.sourceBuffer.GTb?.call(this.sourceBuffer, {
                J: stream.track.viewableSession.J,
                YFb: stream.networkKey,
            });
            this._hasDrmKeySignalled = true;
        }

        // Check if a header needs to be appended first
        if (this._needsNewHeader(stream, request.index)) {
            this._needsHeaderAppend = false;
            this._appendHeader(stream, request.index);
            return;
        }

        const isDrmReady = this.player.isDrmReady(viewableSession.J);
        const isSameKeySystem = this._isSameKeySystem(stream);

        if (!isDrmReady && !isSameKeySystem && (this._hasDrmBeenReady || config.waitForDrmToAppendMedia)) {
            return;
        }

        const bufferAhead = this._getBufferAhead(request);

        // JIT (just-in-time) buffering: defer append if buffer is sufficient
        if (
            this.mediaType === MediaTypeEnum.default.pq.V &&
            (request.stateInfo || request.AB || request.ase_location_history?.fadeOut) &&
            request.ase_location_history &&
            !config.requireAudioStreamToEncompassVideo &&
            !this.endOfStream &&
            this._appendQueue.length <= (request.stateInfo || request.AB ? 1 : 2) &&
            bufferAhead > config.minimumJustInTimeBufferLevel &&
            !request.qz?.notifyInitialize
        ) {
            this._scheduleJitAppend();
            return;
        }

        // Proceed with appending
        if (!this._hasDrmBeenReady) {
            this._hasDrmBeenReady = isSameKeySystem;
        }
        this._appendQueue.shift();

        try {
            this._appendFragment(request);
        } catch (err) {
            this.console.error(err);
            throw err;
        }
    }

    /**
     * Schedules a just-in-time append task that waits until the buffer
     * level drops below the threshold before appending.
     *
     * @private
     */
    _scheduleJitAppend() {
        if (!this.forceEstRelativeLiveBookmark) return;

        if (this.scheduledPruneTask) {
            if (!this.scheduledPruneTask.isCancelled) {
                this.scheduledPruneTask.reuseOnErrorCacheSize();
            }
        } else {
            this.scheduledPruneTask = this.forceEstRelativeLiveBookmark.createScheduledTask(
                () => this._runJitAppendLoop(),
                'JIT Appender'
            );
        }
    }

    /**
     * Generator-based loop that waits for buffer to drain before appending.
     *
     * @private
     * @returns {Generator}
     */
    _runJitAppendLoop() {
        const self = this;
        return __generator(this, function (state) {
            switch (state.label) {
                case 0:
                    if (self._appendQueue.length !== 1) return [3, 3];

                    const request = self._appendQueue[0];
                    if ((!request.stateInfo && !request.AB) || request.qz?.notifyInitialize) {
                        return [2];
                    }

                    const bufferAhead = self._getBufferAhead(request);
                    const minLevel = self.config.minimumJustInTimeBufferLevel;

                    if (bufferAhead > minLevel) {
                        return [4, TimerUtil.manifestUrlFetch(TimeUtil.fromMilliseconds(bufferAhead - minLevel))];
                    }
                    return [3, 2];

                case 1:
                    state.T();
                    state.label = 2;

                case 2:
                    self._processAppendQueue();
                    return [3, 0];

                case 3:
                    return [2];
            }
        });
    }

    /**
     * Calculates how far ahead of the current playback position the
     * given request's timestamp is (in playback segment units).
     *
     * @param {object} request - The media request
     * @returns {number} Buffer ahead in segment units, or NaN if timestamp is unavailable
     * @private
     */
    _getBufferAhead(request) {
        return (request.timestamp?.playbackSegment ?? NaN) - this.player.setPosition.playbackSegment;
    }

    /**
     * Determines if a new header needs to be appended before the next fragment.
     *
     * @param {object} stream - The media stream
     * @param {number} index - The fragment index
     * @returns {boolean} True if a header append is needed
     * @private
     */
    _needsNewHeader(stream, index) {
        const codecProfiles = stream.ck;
        assert(codecProfiles);

        if (codecProfiles.length === 0) {
            return (this._needsHeaderAppend = false);
        }

        if (this._needsHeaderAppend || this._currentHeader === undefined ||
            stream.selectedStreamId !== this._currentHeader.selectedStreamId) {
            return true;
        }

        if (codecProfiles.length > 1) {
            return internal_Vrb(codecProfiles, (profile) => profile.startPosition <= index) !==
                this._currentHeader.fGb;
        }

        return false;
    }

    /**
     * Checks whether the stream uses the same key system as the currently
     * appended header (used to determine if DRM readiness can be skipped).
     *
     * @param {object} stream - The media stream
     * @returns {boolean} True if the stream shares the current key system
     * @private
     */
    _isSameKeySystem(stream) {
        if (stream.mediaType === MediaType.V || !stream.networkKey) return true;
        if (this._currentHeader === undefined) return false;
        if (!stream.track.JJb) return !stream.networkKey;

        const codecProfiles = stream.ck;
        assert(codecProfiles);
        return codecProfiles[this._currentHeader.fGb].ry === false;
    }

    /**
     * Appends a stream header to the source buffer and updates tracking state.
     *
     * @param {object} stream - The media stream containing the header
     * @param {number} fragmentIndex - The fragment index to determine which codec profile to use
     * @private
     */
    _appendHeader(stream, fragmentIndex) {
        if (this._isProcessingFramePaused && !this._forceAppendBypass) return;

        if (stream.ck && stream.ck.length !== 0) {
            const profileIndex = stream.ck.reduce((best, profile, idx) => {
                return profile.startPosition <= fragmentIndex ? idx : best;
            }, 0);

            const codecProfile = stream.ck[profileIndex];

            // Signal DRM key info if this is the first header
            if (!this._currentHeader) {
                this.sourceBuffer.GTb?.call(this.sourceBuffer, {
                    J: stream.track.viewableSession.J,
                    YFb: stream.networkKey,
                });
                this._hasDrmKeySignalled = true;
            }

            this._appendToSourceBuffer(codecProfile.data, {
                Ee: true,
                profile: stream.profile,
                bitrate: stream.bitrate,
                selectedStreamId: stream.selectedStreamId,
            })
                .then(() => {
                    this._emitDebug(
                        '@' + platform.platform.now() +
                        ', header appended, streamId: ' + stream.selectedStreamId
                    );
                    this._emitHeaderAppended(stream.selectedStreamId, profileIndex);
                })
                .catch((err) => {
                    if (!isAbortError(err)) {
                        this.RETRY(
                            'appendHeader caught:',
                            VC.wy(err),
                            'buffer error:',
                            this.sourceBuffer.error
                        );
                        this._emitDebug(
                            '@' + platform.platform.now() +
                            ', appendHeader error: ' + this.sourceBuffer.error
                        );
                        throw Error('appendHeaderError');
                    }
                });

            this._currentHeader = {
                Oa: stream.selectedStreamId,
                fGb: profileIndex,
            };
        }

        this._processAppendQueue();
    }

    /**
     * Appends a media fragment to the source buffer. Handles audio/video and
     * text tracks differently. Updates duration if needed for VOD content.
     *
     * @param {object} request - The media request containing fragment data
     * @private
     */
    _appendFragment(request) {
        let timestampOffset = request.internal_Eya || TimeUtil.seekToSample;
        const stream = request.stream;
        const segment = request.currentSegment;

        // Update MediaSource duration for VOD streams when segment end time is known
        if (
            !isLiveStream(stream) &&
            segment.endTime &&
            !segment.endTime.equal(TimeUtil.uh)
        ) {
            const durationCandidate = segment.endTime.item(timestampOffset).ri;
            if (
                this.platformMediaSource.duration === Infinity ||
                this.platformMediaSource.duration < durationCandidate
            ) {
                this.platformMediaSource.duration = durationCandidate;
            }
        }

        // Compute optional start-time offset for the append
        const startTimeOffset = request.sv !== undefined
            ? TimeUtil.fromMilliseconds(request.sv).item(request.internal_Eya)
            : undefined;

        const nextRequestTimestamp = this._appendQueue[0]?.timestamp;

        const appendContext = {
            endOfStream: this.endOfStream || !!request.qz?.notifyInitialize,
            b2: startTimeOffset,
            p0a: nextRequestTimestamp,
        };

        // Process the request through the append processor (computes offsets, logs, etc.)
        const processed = this._appendProcessor.applying(request, appendContext);
        const { getBoxData: skipAppend, logDataArray, kv: fragmentBuffers, offset: newTimestampOffset } = processed;

        // Emit any log events from the processor
        logDataArray?.forEach((logEntry) => this.emit(logEntry.type, logEntry));

        // Update the timestamp offset
        this._updateTimestampOffset(newTimestampOffset);

        // If skipAppend is set, call getBoxData on the request and skip actual buffer append
        if (skipAppend && (request.stateInfo || request.AB)) {
            request.getBoxData();
        }

        let appendStatus = AppendResult.NOTHING_APPENDED;

        if (!skipAppend) {
            if (this.mediaType === MediaType.V || this.mediaType === MediaType.U) {
                appendStatus = this._appendAudioOrVideo(request, fragmentBuffers);
            } else if (this.mediaType === MediaType.TEXT_MEDIA_TYPE) {
                appendStatus = this._appendText(request);
            }
        }

        switch (appendStatus) {
            case AppendResult.ERROR:
                this._handleAppendError(request);
                break;
            case AppendResult.PARTIAL:
                this._partialRequest = request;
                break;
            case AppendResult.COMPLETE:
                this._onAppendComplete(request);
                this._partialRequest = request;
                break;
            case AppendResult.NOTHING_APPENDED:
                this._onNothingAppended(request, true);
                break;
        }
    }

    /**
     * Checks if the platform requires incremental (per-chunk) appending.
     *
     * @returns {boolean} True if incremental append is required
     * @private
     */
    _isIncrementalAppendRequired() {
        return (
            platform.setImmediate.codecProfilesMap.nestedConfig.isRequired ||
            !!this.platformMediaSource.codecProfilesMap?.BUb
        );
    }

    /**
     * Dispatches audio/video fragment appending to incremental or monolithic strategy.
     *
     * @param {object} request - The media request
     * @param {Array<ArrayBuffer>} buffers - Fragment data buffers
     * @returns {number} AppendResult status
     * @private
     */
    _appendAudioOrVideo(request, buffers) {
        return this._isIncrementalAppendRequired()
            ? this._appendAudioOrVideoIncremental(request, buffers)
            : this._appendAudioOrVideoMonolithic(request, buffers);
    }

    /**
     * Appends audio/video fragments incrementally (one buffer at a time).
     * Supports streaming (non-complete) requests via async iteration.
     *
     * @param {object} request - The media request
     * @param {Array<ArrayBuffer>} buffers - Initial fragment data buffers
     * @returns {number} AppendResult.PARTIAL
     * @private
     */
    _appendAudioOrVideoIncremental(request, buffers) {
        const metadata = buildAppendMetadata(buffers, request);
        const appendPromises = (buffers || request.kv).map((buf, idx) => {
            return this._appendToSourceBuffer(buf, idx === 0 ? metadata : undefined);
        });

        if (!request.MS) {
            const iterator = request.wWa();
            const task = {
                Na: request,
                iterator,
                isCancelledFlag: false,
            };
            this._avAppendTask = task;

            AsyncIterator.tua(iterator, (result) => {
                if (task.isCancelledFlag) return;
                if (result.done) {
                    this._avAppendTask = undefined;
                } else {
                    const p = this._appendToSourceBuffer(result.value, metadata);
                    appendPromises.push(p);
                }
            });
        }

        Promise.all(appendPromises)
            .then(() => {
                this._onAppendComplete(request);
            })
            .catch((err) => {
                if (!isAbortError(err)) {
                    this.console.pauseTrace(
                        'appendAudioOrVideoIncremental failed to append fragment:',
                        VC.wy(err)
                    );
                    throw err;
                }
            });

        return AppendResult.PARTIAL;
    }

    /**
     * Appends audio/video fragments monolithically (concatenated into one buffer).
     * Supports streaming requests by collecting all chunks before appending.
     *
     * @param {object} request - The media request
     * @param {Array<ArrayBuffer>} buffers - Initial fragment data buffers
     * @returns {number} AppendResult.PARTIAL
     * @private
     */
    _appendAudioOrVideoMonolithic(request, buffers) {
        const metadata = buildAppendMetadata(buffers, request);

        if (!buffers) {
            buffers = request.kv;
        }

        if (request.MS) {
            // All data is already available -- concatenate and append
            this._concatenateAndAppend(buffers, metadata)
                .then(() => {
                    this._onAppendComplete(request);
                })
                .catch((err) => {
                    if (!isAbortError(err)) {
                        this.console.pauseTrace(
                            'appendAudioOrVideoMonolithic failed to append fragment:',
                            VC.wy(err)
                        );
                        throw err;
                    }
                });
        } else {
            // Streaming: collect all chunks via async iterator, then append
            const iterator = request.wWa();
            const task = {
                Na: request,
                iterator,
                isCancelledFlag: false,
            };
            this._avAppendTask = task;

            AsyncIterator.tua(iterator, (result) => {
                if (task.isCancelledFlag) return;
                if (result.done) {
                    this._concatenateAndAppend(buffers, metadata)
                        .then(() => {
                            this._onAppendComplete(request);
                        })
                        .catch((err) => {
                            if (!isAbortError(err)) {
                                this.console.pauseTrace(
                                    'appendAudioOrVideoMonolithic iterator failed to append fragment:',
                                    VC.wy(err)
                                );
                                throw err;
                            }
                        });
                    this._avAppendTask = undefined;
                } else {
                    buffers.push(result.value);
                }
            });
        }

        return AppendResult.PARTIAL;
    }

    /**
     * Concatenates multiple buffers into one and appends to the source buffer.
     *
     * @param {Array<ArrayBuffer>} buffers - The buffers to concatenate
     * @param {object} metadata - Append metadata
     * @returns {Promise<void>}
     * @private
     */
    _concatenateAndAppend(buffers, metadata) {
        const data = buffers.length > 1 ? concatenateArrayBuffers(buffers) : buffers[0];
        return this._appendToSourceBuffer(data, metadata);
    }

    /**
     * Low-level append to the source buffer. Uses async append if available
     * and configured, otherwise falls back to synchronous appendBuffer.
     *
     * @param {ArrayBuffer} data - The data to append
     * @param {object} [metadata] - Optional metadata for the append
     * @returns {Promise<void>}
     * @private
     */
    _appendToSourceBuffer(data, metadata) {
        if (this.config.enableAsyncAppend && typeof this.sourceBuffer.internal_Xbc === 'function') {
            const signal = this.abortController?.signal;
            return new Promise((resolve, reject) => {
                if (!this.sourceBuffer.internal_Xbc(data, metadata, (result) => {
                    if (signal?.aborted) {
                        return reject(new AbortError());
                    }
                    return result.success ? resolve() : reject(result.error);
                })) {
                    return reject(Error('appendBufferAsync returned failure: ' + JSON.stringify(metadata)));
                }
            });
        }

        return this.sourceBuffer.appendBuffer(data, metadata)
            ? Promise.resolve()
            : Promise.reject();
    }

    /**
     * Appends a text media fragment. Collects all chunks (streaming or not)
     * and emits a subtitleData event.
     *
     * @param {object} request - The text media request
     * @returns {number} AppendResult status
     * @private
     */
    _appendText(request) {
        assert(request instanceof TextMediaRequest);

        const buffers = request.kv;

        if (request.MS) {
            // All data available
            assert(buffers.every((b) => b instanceof ArrayBuffer));
            Promise.resolve().then(() => this._emitSubtitleData(request, buffers));
            return AppendResult.COMPLETE;
        }

        // Streaming: collect chunks via async iterator
        const iterator = request.wWa();
        const task = {
            Na: request,
            iterator,
            isCancelledFlag: false,
        };
        this._textAppendTask = task;

        AsyncIterator.tua(iterator, (result) => {
            if (task.isCancelledFlag) return;
            if (result.done) {
                this._textAppendTask = undefined;
                assert(buffers.every((b) => b instanceof ArrayBuffer));
                this._emitSubtitleData(request, buffers);
            } else {
                buffers.push(result.value);
            }
        });

        return AppendResult.PARTIAL;
    }

    /**
     * Concatenates text buffers, decodes them, and emits a subtitleData event
     * on the platform media source.
     *
     * @param {object} request - The text media request
     * @param {Array<ArrayBuffer>} buffers - The text data buffers
     * @private
     */
    _emitSubtitleData(request, buffers) {
        let concatenated = concatenateArrayBuffers(buffers);
        concatenated = new Uint8Array(concatenated);
        const decoded = platform.AL(concatenated);
        assert(decoded);

        const isEndOfStream = request.stateInfo && request.qz?.notifyInitialize;

        const subtitlePayload = {
            vhd: true,
            M: request.byteRangeHint,
            startPts: request.presentationStartTime.playbackSegment,
            xmlGetterFn: request.segmentEndTime.playbackSegment,
            iz: request.stream.presentationTime.playbackSegment,
            playerStateRef: decoded,
            endOfStream: isEndOfStream,
        };

        const event = __assign({ type: 'subtitleData' }, subtitlePayload);
        this.platformMediaSource.events.emit(event.type, event);

        if (typeof this.sourceBuffer.dcc === 'function') {
            this.sourceBuffer.dcc(subtitlePayload);
        }
    }

    /**
     * Called when a fragment has been fully appended. Updates live timestamp
     * tracking and emits the requestAppended event.
     *
     * @param {object} request - The completed media request
     * @private
     */
    _onAppendComplete(request) {
        // Reset live timestamp if it no longer matches
        if (
            this._lastLiveAppendTimestamp !== undefined &&
            this.mediaType === MediaTypeEnum.default.pq.V &&
            !request.timestamp.equal(this._lastLiveAppendTimestamp)
        ) {
            this._lastLiveAppendTimestamp = undefined;
        }

        this._emitDebug(
            '@' + platform.platform.now() +
            ', request appended, type: ' + request.mediaType +
            ', streamId: ' + request.selectedStreamId +
            ', pts: ' + request.timestamp?.playbackSegment +
            '-' + request.previousState.playbackSegment
        );

        this._onNothingAppended(request, false);
    }

    /**
     * Finalization step after a request has been processed (whether appended
     * or skipped). Updates live state, signals period transitions, and
     * re-triggers queue processing.
     *
     * @param {object} request - The processed media request
     * @param {boolean} wasSkipped - True if the request was not actually appended
     * @private
     */
    _onNothingAppended(request, wasSkipped) {
        if (request.stateInfo || request.AB) {
            // Live: track the last appended timestamp for EOS delay calculation
            this._lastLiveAppendTimestamp = wasSkipped ? request.timestamp : request.previousState;
            this.sourceBuffer.wrc?.call(this.sourceBuffer, request.qz);
            this._hasDrmKeySignalled = false;

            if (request.qz?.notifyInitialize) {
                this.signalEndOfStream();
            }
        } else {
            this._lastLiveAppendTimestamp = undefined;
        }

        request.appended = true;
        request.getPayloadSize();
        this._emitRequestAppended(request);
        this._processAppendQueue();
    }

    /**
     * Handles a source buffer error during append.
     *
     * @param {object} request - The failed media request
     * @throws {Error} Always throws with the source buffer error
     * @private
     */
    _handleAppendError(request) {
        if (this.sourceBuffer.error !== undefined) {
            if (this.sourceBuffer.error === 'done') return;

            this.error(
                'failure to append queued mediaRequest:',
                request?.toString(),
                'err:',
                JSON.stringify(this.sourceBuffer.error)
            );
            throw this.sourceBuffer.error;
        }

        const err = Error(
            'failure to append queued mediaRequest: ' + request?.toString() +
            ' err: ' + this.sourceBuffer.error
        );
        this.error(err.message);
        throw err;
    }

    /**
     * Emits a "headerAppended" event.
     *
     * @param {string} streamId - The stream ID whose header was appended
     * @param {number} profileIndex - The codec profile index used
     * @private
     */
    _emitHeaderAppended(streamId, profileIndex) {
        const event = {
            type: 'headerAppended',
            mediaType: this.mediaType,
            streamId,
            isIndex: profileIndex,
        };
        this.emit(event.type, event);
    }

    /**
     * Emits a "requestAppended" event.
     *
     * @param {object} request - The appended media request
     * @private
     */
    _emitRequestAppended(request) {
        const event = {
            type: 'requestAppended',
            mediaType: this.mediaType,
            request,
        };
        this.emit(event.type, event);
    }

    /**
     * Emits a "managerdebugevent" for internal tracing.
     *
     * @param {string} message - The debug message
     * @private
     */
    _emitDebug(message) {
        const event = {
            type: 'managerdebugevent',
            message,
        };
        this.emit(event.type, event);
    }
}
