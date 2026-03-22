/**
 * ASE Player Buffer
 *
 * Manages the buffering pipeline for a single media type (audio/video) in
 * the ASE (Adaptive Streaming Engine). Handles request reception, DRM
 * readiness detection, buffer state tracking, throttling, pacing, and
 * live edge detection. Extends EventEmitter with per-media-type stats.
 *
 * @module AsePlayerBuffer
 * @original Module_74418
 */

// import { EventEmitter } from './EventEmitter';
// import { objectValues } from './ObjectUtils';
// import { Observable, ObservableBool } from './Observable';
// import { TimeUtil } from './TimeUtil';
// import { platform } from './PlatformGlobals';
// import { IS_DEBUG } from './DebugFlags';
// import { AseBufferBranch } from './AseBufferBranch';
// import { AsyncIterator } from './AsyncIterator';
// import { JustInTimeThrottler } from './JustInTimeThrottler';
// import { BatchRequestThrottler } from './BatchRequestThrottler';
// import { AppendPacer } from './AppendPacer';
// import { LiveRequestMonitor } from './LiveRequestMonitor';
// import { LiveRequestLogger } from './LiveRequestLogger';
// import { assert } from './Assert';
// import { mathTanh as createScopedLogger } from './LoggerUtils';
// import { isBufferReset } from './BufferResetUtils';
// import { AseStreamTracker } from './AseStreamTracker';

/**
 * Manages the streaming buffer for a single media type, tracking received
 * requests, handling DRM events, and coordinating throttlers and pacers.
 *
 * @extends EventEmitter
 */
export class AsePlayerBuffer extends EventEmitter {
    /**
     * @param {Object} requestQueue - The underlying request queue
     * @param {string} mediaType - 'audio' or 'video'
     * @param {Object} streamTracker - Stream tracking state
     * @param {Object} config - Buffer configuration
     * @param {Object} logger - Logger instance
     * @param {Object} player - Player reference
     * @param {Object} configSnapshot - Configuration snapshot
     * @param {Object} branchScheduler - Branch scheduling manager
     * @param {Object} liveEdgeDetector - Live edge detection
     * @param {Object} liveRequestMonitorConfig - Config for live request monitoring
     * @param {Object} [existingStreamTracker] - Existing tracker to reuse
     */
    constructor(requestQueue, mediaType, streamTracker, config, logger, player, configSnapshot, branchScheduler, liveEdgeDetector, liveRequestMonitorConfig, existingStreamTracker) {
        super();

        /** @type {Object} */
        this.requestQueue = requestQueue;
        /** @type {string} */
        this.mediaType = mediaType;
        /** @type {Object} */
        this.config = config;
        /** @type {Object} */
        this.logger = logger;
        /** @type {Object} */
        this.player = player;
        /** @type {Object} */
        this.configSnapshot = configSnapshot;
        /** @type {Object} */
        this.branchScheduler = branchScheduler;

        /** @type {Observable<boolean>} */
        this.hasReceivedRequest = new ObservableBool(false);
        /** @type {Observable<number>} */
        this.latestRequestTimestamp = new ObservableBool(TimeUtil.fromMilliseconds(-Infinity));

        this.logger = createScopedLogger(platform, this.logger, `AsePlayerBuffer [${mediaType}]:`);

        /** @type {AseBufferBranch} */
        this.bufferBranch = new AseBufferBranch(this.logger, streamTracker, mediaType);

        this.resume();

        if (player && configSnapshot && branchScheduler) {
            if (existingStreamTracker) {
                this.streamTracker = existingStreamTracker;
                existingStreamTracker.updateTrackState(player, branchScheduler, this.requestQueue);
            } else {
                this._createStreamTracker();
            }

            // Add just-in-time throttler
            const jitThrottler = new JustInTimeThrottler(
                player?.branchScheduler,
                TimeUtil.fromMilliseconds(this.config.minimumJustInTimeBufferLevel),
                logger
            );
            this.bufferBranch.addThrottler(jitThrottler);

            // Add batch request throttler if configured
            if (this.config.batchRequestThrottlerSleepDuration > 0) {
                this.batchThrottler = new BatchRequestThrottler(
                    TimeUtil.fromMilliseconds(this.config.batchRequestThrottlerMaxDuration),
                    this.config.batchRequestThrottlerSleepDuration,
                    this.logger
                );
                this.bufferBranch.addThrottler(this.batchThrottler);
            }

            // Add append pacer if configured
            if (this.config.appendPacingFactor) {
                const appendPacer = new AppendPacer(
                    player?.branchScheduler,
                    this.config.appendPacingFactor,
                    TimeUtil.fromMilliseconds(this.config.appendPacingThreshold),
                    logger
                );
                this.bufferBranch.addThrottler(appendPacer);
            }

            // Add live request monitor if configured
            if (liveRequestMonitorConfig) {
                this.liveRequestMonitor = new LiveRequestMonitor(liveRequestMonitorConfig, this.mediaType, logger);
                this.bufferBranch.addThrottler(this.liveRequestMonitor);
            }

            // Add live request logger in debug mode
            if (IS_DEBUG && this.config.enableLiveRequestLogger) {
                const liveLogger = new LiveRequestLogger(logger);
                this.bufferBranch.addThrottler(liveLogger);
            }
        }

        this.requestQueue.on("requestAppended", (event) => {
            this.hasReceivedRequest.set(true);
            if (event.request.previousState) {
                this.latestRequestTimestamp.set(event.request.previousState);
            }
            this.emit("requestAppended");
        });

        // Initialize stats
        this.totalReceivedCount = 0;
        this.requestsSinceLastPeriod = 0;
        this.cumulativePts = 0;
        this.cumulativeRequestCount = 0;
    }

    /** @returns {Observable<boolean>} Whether any request has been received */
    get hasReceived() {
        return this.hasReceivedRequest;
    }

    /** @returns {Observable<number>} Timestamp of the latest request */
    get latestTimestamp() {
        return this.latestRequestTimestamp;
    }

    /** @returns {boolean} Whether the buffer branch is running */
    get isRunning() {
        return this.bufferBranch.isActive;
    }

    /** @returns {boolean} Whether end-of-stream has been signaled */
    get endOfStream() {
        return this.requestQueue.endOfStream;
    }

    /**
     * Creates a new stream tracker for this buffer.
     * @private
     */
    _createStreamTracker() {
        assert(this.player && this.configSnapshot && this.branchScheduler, "Player should be defined");
        const previous = this.streamTracker;
        if (this.streamTracker) this.streamTracker.dispose();
        this.streamTracker = new AseStreamTracker(
            this.mediaType, this.logger, this.player, this.requestQueue,
            this.player.events, this.configSnapshot, this.branchScheduler, this.liveEdgeDetector
        );
        this.streamTracker.initialize(previous);
    }

    /**
     * Gets diagnostic information for this buffer.
     * @returns {Object|undefined}
     */
    getDiagnostics() {
        const branchState = this.bufferBranch;
        const currentBranch = branchState.currentActiveBranch;
        if (!currentBranch) return undefined;

        const segment = currentBranch.getSegment(this.mediaType);
        let requestMetrics;
        if (segment?.requestEventEmitter) {
            requestMetrics = segment.requestEventEmitter.getMetrics();
        }

        return {
            requestMetrics,
            currentBranch: {
                segmentId: currentBranch.currentSegment?.id,
                cancelled: currentBranch.isCancelledFlag,
            },
            currentReceivedCount: branchState?.receivedCount,
            totalReceivedCount: this.totalReceivedCount,
            currentState: branchState?.stateLabel || "Uninitialized",
            lastRequestPushed: this.lastRequestPushed && {
                contentEndPts: this.lastRequestPushed.segmentEndTime?.playbackSegment,
                fragmentIndex: this.lastRequestPushed.index,
            },
            timeSinceLastPush: this.lastPushTimestamp && platform.platform.now() - this.lastPushTimestamp,
            cpts: this.cumulativePts,
            crq: this.cumulativeRequestCount,
            rslp: this.requestsSinceLastPeriod,
            firstRequestSSPushed: this.firstRequestSSPushed && {
                contentStartPts: this.firstRequestSSPushed.startPts,
                fragmentIndex: this.firstRequestSSPushed.index,
            },
            firstRequestPushed: this.firstRequestPushed && {
                contentStartPts: this.firstRequestPushed.startPts,
                fragmentIndex: this.firstRequestPushed.index,
            },
        };
    }

    /** Resumes the buffer pipeline. */
    resume() {
        if (IS_DEBUG) this.logger.pauseTrace("resume");
        this._startPipeline();
    }

    /**
     * Marks the buffer as "needs DRM" to signal header append.
     */
    markHeaderAppendNeeded() {
        this.requestQueue.forceAppendHeaders(true);
    }

    /**
     * Resets the buffer, optionally preserving some state.
     * @param {boolean} [preserveState=false]
     * @param {string[]} [mediaTypes]
     */
    reset(preserveState = false, mediaTypes) {
        if (IS_DEBUG) this.logger.pauseTrace("AsePlayerBuffer.create mediaTypes:", mediaTypes);
        this.stop();
        this.requestQueue.create(preserveState);
        this.hasReceivedRequest.set(false);
        this.latestRequestTimestamp.set(TimeUtil.fromMilliseconds(-Infinity));

        if (!preserveState) {
            this.bufferDiagnostics = undefined;
            this.streamTracker?.create();
            this.liveRequestMonitor?.reset(
                this.player?.mediaTypesForBranching,
                mediaTypes || this.player?.mediaTypesForBranching
            );
            this.batchThrottler?.reset();
        }
    }

    /**
     * Restarts the buffer, optionally preserving state.
     * @param {boolean} [preserveState=false]
     */
    restart(preserveState = false) {
        if (IS_DEBUG) this.logger.pauseTrace("restart");
        this.reset(preserveState);
        this._startPipeline(true);
    }

    /** Stops the buffer pipeline. */
    stop() {
        if (IS_DEBUG) this.logger.pauseTrace("stop");
        this.bufferBranch.stopPipeline();
        this.requestsSinceLastPeriod = 0;
        this.firstRequestSSPushed = undefined;
    }

    /** Closes the stream tracker. */
    close() {
        if (IS_DEBUG) this.logger.pauseTrace("close");
        this.streamTracker?.closing();
    }

    /** Destroys the buffer. */
    destroy() {
        this.stop();
        this.close();
    }

    /** Signals DRM readiness. */
    addDrmViewable() {
        if (this.config.forceAppendHeadersAfterDrm) {
            this.requestQueue.forceReappendHeaders();
        }
        this.requestQueue.signalDrmReady();
    }

    /**
     * Processes a media frame.
     * @param {Object} frame
     */
    onProcessFrame(frame) {
        this.requestQueue.onProcessFrame(frame);
    }

    /**
     * Handles a received media request from the pipeline.
     * @param {Object} request
     */
    _onRequestReceived(request) {
        if (IS_DEBUG) {
            this.logger.pauseTrace(
                `requestReceived: ${this.bufferBranch.currentActiveBranch?.currentSegment.id} ${request.toString()}, edit: ${JSON.stringify(request.locationHistory)}`
            );
        }

        if (this.requestQueue.endOfStream) {
            if (IS_DEBUG) this.logger.error("Buffer manager has declared EOS, ignoring request", request.toString());
            return;
        }

        // Update diagnostics
        if (this.bufferDiagnostics) {
            this.bufferDiagnostics.lastEndPts = request.segmentEndTime?.playbackSegment;
            this.bufferDiagnostics.lastStartPts = request.previousState?.playbackSegment;
            this.bufferDiagnostics.lastTimestamp = request.previousState;
        } else {
            this.bufferDiagnostics = {
                firstStartPts: request.presentationStartTime?.playbackSegment,
                firstEndPts: request.timestamp?.playbackSegment,
                lastEndPts: request.segmentEndTime?.playbackSegment,
                lastStartPts: request.previousState?.playbackSegment,
                lastTimestamp: request.previousState,
            };
        }

        // Check if DRM is needed
        if (request.isEncrypted && request.stream.track.contentProfile && !this.player?.isDrmReady(request.viewableSession.keySessionId)) {
            this.emit("drmNeeded", {
                keySessionId: request.viewableSession.keySessionId,
                timestamp: request.timestamp,
            });
        }

        this.requestQueue.appendRequest(request);

        // Update stats
        this.totalReceivedCount++;
        this.requestsSinceLastPeriod++;
        this.lastPushTimestamp = platform.platform.now();

        if (!this.firstRequestSSPushed) {
            this.firstRequestSSPushed = {
                endPts: request.segmentEndTime?.playbackSegment,
                startPts: request.presentationStartTime?.playbackSegment,
                index: request.index,
            };
            if (!this.firstRequestPushed) {
                this.firstRequestPushed = this.firstRequestSSPushed;
            }
        }

        // Track cumulative PTS
        const prev = this.lastRequestPushed;
        let isContinuous = false;
        if (prev && Math.abs(prev.previousState.playbackSegment - (request.timestamp?.playbackSegment ?? NaN)) < 100) {
            this.cumulativePts += request.previousState.playbackSegment - prev.previousState.playbackSegment;
            this.cumulativeRequestCount++;
            isContinuous = true;
        }
        if (!isContinuous) {
            this.cumulativePts = request.offset?.playbackSegment;
            this.cumulativeRequestCount = 1;
        }

        this.lastRequestPushed = request;
    }

    /**
     * Starts (or restarts) the async pipeline iteration.
     * @private
     * @param {boolean} [force=false]
     */
    _startPipeline(force) {
        if (!this.bufferBranch.isActive || force) {
            this.bufferBranch.resetPipeline();
            AsyncIterator.iterate(this.bufferBranch, this._onPipelineResult.bind(this));
        }
    }

    /**
     * Processes a result from the async pipeline iterator.
     * @private
     * @param {Object} result
     */
    _onPipelineResult(result) {
        if (result.done) return;

        const value = result.value;
        if (isBufferReset(value)) {
            this.latestRequestTimestamp.set(value.isLive.previousState);
            this.hasReceivedRequest.set(true);
        } else {
            try {
                this._onRequestReceived(value);
            } catch (err) {
                this.logger.error("Error in requestReceived", err);
            }
        }
    }

    /**
     * Checks if a media request should trigger a data parse.
     * @param {Object} request
     * @returns {boolean}
     */
    parseData(request) {
        return !!this.streamTracker?.parseData(request);
    }
}
