/**
 * Netflix Cadmium Player - Media Events Fetcher
 * Component: MEDIAEVENTS_FETCHER
 *
 * Fetches timed metadata (media events) from a supplementary CMAF/MP4
 * track in a live stream. Sequentially downloads segment headers and
 * media segments, parses the embedded SCTE-35 / Netflix event boxes,
 * and emits "mediaEventsReceived" for each segment's events.
 */

// Dependencies
// import { __awaiter, __generator, __decorate } from 'tslib';  // webpack 22970
// import { EventEmitter } from './EventEmitter';               // webpack 90745
// import { TimeUtil, assert, AbortController, RetryQueue } from './TimeUtil'; // webpack 91176
// import { Mp4BoxParser, MediaType, EventBoxParser, Scte35BoxParser } from './Mp4BoxParser'; // webpack 91562
// import { platform } from './Platform';                        // webpack 66164
// import { TaskScheduler } from './TaskScheduler';              // webpack 40666
// import { isLiveStream, isLiveDownloadable } from './LiveUtils'; // webpack 8149
// import { SessionMetricsClass, consoleLogger } from './SessionMetrics'; // webpack 61996
// import { ko } from './Pipeline';                              // webpack 54366

/**
 * @class MediaEventsFetcher
 *
 * Coordinates the download of supplementary media segments that carry
 * timed metadata (ad break markers, program boundaries, Netflix custom
 * events). Uses a generator-based fetch loop that waits until the live
 * edge advances past each segment's availability window before issuing
 * the HTTP request.
 */
export class MediaEventsFetcher {
    /**
     * @param {Object} taskScheduler - Scheduler for creating background tasks
     * @param {Object} viewableSession - The live viewable session
     * @param {Function} isCompleteCheck - Returns true when no more events are needed
     * @param {Object} [diagnostics] - Optional diagnostics reporter
     */
    constructor(taskScheduler, viewableSession, isCompleteCheck, diagnostics) {
        /** @type {Object} */
        this.taskScheduler = taskScheduler;

        /** @type {Object} */
        this.viewableSession = viewableSession;

        /** @private @type {Function} */
        this._isCompleteCheck = isCompleteCheck;

        /** @type {Object|undefined} */
        this.diagnosticsReporter = diagnostics;

        /** @type {EventEmitter} */
        this.events = new EventEmitter();

        /** @type {number} Current segment index being fetched */
        this.segmentIndex = 0;

        /** @type {TimeUtil} End time of the last fetched segment */
        this.segmentEndTime = TimeUtil.ZERO;

        /** @private @type {boolean} Whether the fetcher has been destroyed */
        this._isDestroyed = false;

        this.console = new platform.Console(
            "MEDIAEVENTS_FETCHER",
            "asejs",
            `[${this.viewableSession.sessionId}]`
        );

        /** @type {AbortController} Master abort controller */
        this.masterAbortController = new AbortController();

        /** @type {RetryQueue} Request queue with retry support */
        this.requestQueue = new RetryQueue(this.console, {
            maxRetries: 10,
            enableRetry: true,
        });

        /** @type {SessionMetricsClass} */
        this._sessionMetrics = new SessionMetricsClass({
            engine: this,
            source: "media-events-provider",
            maxEntries: 10,
            console: this.console,
        });

        this.viewableSession.eventProcessingPipeline.register(
            new ko(this._sessionMetrics)
        );
    }

    // -- Computed properties ------------------------------------------------

    /**
     * Whether the fetch task is currently running.
     * @returns {boolean}
     */
    get isRunning() {
        return !!this._activeTask?.isRunning;
    }

    /**
     * Whether the fetcher has been started (even if now stopped).
     * @returns {boolean}
     */
    get isStarted() {
        return this._activeTask !== undefined;
    }

    /**
     * The supplementary media track carrying event data.
     * @returns {Object}
     */
    get track() {
        const track = this.viewableSession.getTracks(MediaType.supplementaryMediaType)[0];
        assert(isLiveStream(track), "MediaEventsFetchProviderBase: track is not live");
        return track;
    }

    /**
     * The first downloadable stream for the supplementary track.
     * @returns {Object}
     */
    get stream() {
        return this.track.downloadables[0];
    }

    /**
     * Current health state (number of pending requests in the queue).
     * @returns {number}
     */
    get healthState() {
        return this.requestQueue.pendingCount;
    }

    // -- Public methods -----------------------------------------------------

    /**
     * Starts the fetch loop at the given segment index.
     * @param {number} startSegmentIndex
     */
    start(startSegmentIndex) {
        assert(!this.isRunning, "MediaEventsFetchProviderBase: start called while running");

        if (this._isDestroyed) {
            this.console.RETRY("MediaEventsFetchProviderBase: start called after destruct");
            return;
        }

        this.segmentIndex = Math.max(startSegmentIndex, this.stream.track.startSegmentNumber);
        this.segmentEndTime = this.stream.track.getTrackSegment(this.segmentIndex).segmentEndTime;

        this._activeTask = this.taskScheduler.createScheduledTask(
            () => this._fetchLoop(),
            "media-events-fetcher"
        );
    }

    /**
     * Restarts the fetch loop from a new segment index.
     * @param {number} startSegmentIndex
     */
    restart(startSegmentIndex) {
        if (this._isDestroyed) {
            this.console.RETRY("MediaEventsFetchProviderBase: restart called after destruct");
            return;
        }

        this.destroy();
        this._isDestroyed = false;
        this.masterAbortController = new AbortController();
        this.start(startSegmentIndex);
    }

    /**
     * Stops the fetch loop and cancels all pending requests.
     */
    destroy() {
        this._isDestroyed = true;
        this._activeTask?.destroy();
        this._activeTask = undefined;
        this.masterAbortController.abort();
        this.requestQueue.clear();
        this.segmentEndTime = TimeUtil.ZERO;
    }

    /**
     * Updates the segment index when URLs change (e.g., manifest refresh).
     * @param {number} segmentIndex
     */
    updateSegmentIndex(segmentIndex) {
        // Called externally when the manifest updates
    }

    // -- Private methods ----------------------------------------------------

    /**
     * Checks whether more segments should be fetched.
     * @private
     * @returns {boolean}
     */
    _shouldContinueFetching() {
        return !this._isDestroyed && !this._isCompleteCheck(this.segmentEndTime);
    }

    /**
     * Generator-based fetch loop. Waits for each segment to become
     * available at the live edge, then enqueues a download request.
     * @private
     * @returns {Generator}
     */
    *_fetchLoop() {
        assert(
            isLiveDownloadable(this.stream),
            "MediaEventsFetchProviderBase: stream is not live"
        );

        this.console.log("Fetch task: starting", {
            shouldContinue: this._shouldContinueFetching(),
            healthState: this.healthState,
        });

        // Enqueue header request on first run
        if (this._headerPromise === undefined) {
            this.console.log("Fetch task: queuing header request");
            this._headerPromise = this._enqueueRequest(true).promise;
        }

        const maxHealthState = 20;

        while (this._shouldContinueFetching() && this.healthState < maxHealthState) {
            const segment = this.stream.track.getTrackSegment(this.segmentIndex);
            const segmentEndTime = segment.segmentEndTime;
            const segmentStartTime = segment.presentationStartTime;
            const liveEdgeMs = this.viewableSession.getLiveEdgeTime(true);
            const waitMs = Math.max(0, segmentEndTime.playbackSegment - liveEdgeMs);

            this.console.log("Fetch task: waitRelative", {
                waitMs,
                segmentEndTime,
                liveEdgeMs,
                healthState: this.healthState,
            });

            yield TaskScheduler.waitFor(TimeUtil.fromMilliseconds(waitMs));

            const delayMs = segmentEndTime.playbackSegment - liveEdgeMs;
            this.diagnosticsReporter?.recordFetchDelay(delayMs);

            this._enqueueRequest(false, this.segmentIndex, segmentStartTime, segmentEndTime);
            this.segmentEndTime = segmentEndTime;
            this.segmentIndex++;
        }

        if (!this._shouldContinueFetching()) {
            this.console.log("Fetch task: complete");
        }
        this.console.log("Fetch task: exiting");
    }

    /**
     * Enqueues a single request (header or media segment) into the
     * request queue.
     *
     * @private
     * @param {boolean} isHeader - Whether this is a header request
     * @param {number} [segmentIndex] - Segment index (for media requests)
     * @param {TimeUtil} [startTime] - Segment start time
     * @param {TimeUtil} [endTime] - Segment end time
     * @returns {Object} Queue entry with promise
     */
    _enqueueRequest(isHeader, segmentIndex, startTime, endTime) {
        this.console.log("Fetch task: addRequestToQueue", {
            header: isHeader,
            segmentIndex,
            presentationStartTime: startTime,
            segmentEndTime: endTime,
        });

        assert(
            isHeader || (segmentIndex !== undefined && endTime !== undefined && startTime !== undefined),
            "segmentIndex must be defined if not a header request"
        );

        const abortLinker = new AbortController();
        abortLinker.linkTo(this.masterAbortController.signal);
        const signal = abortLinker.signal;

        return this.requestQueue.enqueue({
            signal,
            execute: async () => {
                try {
                    if (isHeader) {
                        return await this._makeHeaderRequest(signal);
                    }
                    return await this._makeMediaSegmentRequest(signal, segmentIndex, startTime, endTime);
                } finally {
                    abortLinker.destroy();
                    if (
                        (!this._activeTask?.isRunning && this._shouldContinueFetching() && !this._isDestroyed) ||
                        isHeader
                    ) {
                        this._activeTask?.retryOnError();
                    }
                }
            },
            onCancel: () => {
                abortLinker.destroy();
            },
            priority: segmentIndex || 0,
        });
    }

    /**
     * Downloads and parses the MP4 header (moov box) to extract the
     * timescale for this supplementary track.
     *
     * @private
     * @param {AbortSignal} signal
     * @returns {Promise<void>}
     */
    async _makeHeaderRequest(signal) {
        this.console.log("Making header request");

        const headerData = await this._fetchSegmentData(signal, {
            segmentIndex: undefined,
            isHeaderRequest: true,
            stream: this.stream,
            presentationStartTime: TimeUtil.ZERO,
            segmentEndTime: TimeUtil.ZERO,
        });

        const parser = new Mp4BoxParser(this.console, {}, headerData, ["moov"], false, {
            parseTimescaleOnly: true,
        });

        const parseResult = parser.parseInitSegment();
        if (!parseResult.success) {
            throw new Error(parseResult.parseError);
        }

        const mdhdBox = Mp4BoxParser.path(parser, ["moov", "trak", "mdia", "mdhd"]);
        assert(mdhdBox !== undefined, "mdhd should be defined");

        /** @type {number} Timescale from the mdhd box */
        this.timescaleValue = mdhdBox.timescaleValue;
    }

    /**
     * Downloads and parses a media segment to extract timed events.
     *
     * @private
     * @param {AbortSignal} signal
     * @param {number} segmentIndex
     * @param {TimeUtil} startTime
     * @param {TimeUtil} endTime
     * @returns {Promise<Array>} Parsed events
     */
    async _makeMediaSegmentRequest(signal, segmentIndex, startTime, endTime) {
        const networkTimestamp = this.viewableSession.networkState.networkTimestamp || TimeUtil.EPOCH;
        startTime.adjustForNetworkTime(networkTimestamp);

        this._sessionMetrics.emitDiagnosticEvent({
            segmentIndex,
            segmentStart: startTime.toMs(),
            segmentEnd: endTime.toMs(),
        });

        let segmentData;
        try {
            segmentData = await this._fetchSegmentData(signal, {
                isHeaderRequest: false,
                segmentEndTime: endTime,
                presentationStartTime: startTime,
                stream: this.stream,
                segmentIndex,
            });
        } catch (error) {
            if (!TimeUtil.isAbortError(error)) {
                this.events.emit("mediaEventsReceived", {
                    type: "mediaEventsReceived",
                    events: [],
                    segmentEndTime: endTime,
                    segmentIndex,
                    isError: true,
                });
            }
            return;
        }

        // Wait for header to be parsed if needed
        if (this.timescaleValue === undefined) {
            await this._headerPromise;
        }

        assert(
            this.timescaleValue !== undefined,
            "timescale should be defined once header request resolves"
        );

        // Parse the event boxes from the segment
        const eventBoxParser = new EventBoxParser(this.console, {}, segmentData);
        const parseContext = { events: [] };
        const result = eventBoxParser.parseEventBoxes(parseContext);

        this.console.debug("Parsed media events: ", result.done);

        if (result.error) {
            throw new Error(result.error);
        }

        this.console.debug("Received media events", {
            events: parseContext.events,
            segmentEndTime: endTime,
            segmentIndex,
        });

        // Emit parsed events
        this.events.emit("mediaEventsReceived", {
            type: "mediaEventsReceived",
            events: this._transformEvents(parseContext.events),
            segmentEndTime: endTime,
            segmentIndex,
        });

        return parseContext.events;
    }

    /**
     * Transforms raw parsed event data into the canonical event format.
     *
     * @private
     * @param {Array} rawEvents - Raw events from the parser
     * @returns {Array} Transformed events
     */
    _transformEvents(rawEvents) {
        return (
            rawEvents?.reduce((acc, raw) => {
                const transformed = this._transformSingleEvent(raw);
                if (transformed) acc.push(transformed);
                return acc;
            }, []) || []
        );
    }

    /**
     * Transforms a single raw event into the canonical format.
     * Handles both Netflix custom events (NfBx) and SCTE-35 events (emsg).
     *
     * @private
     * @param {Object} rawEvent
     * @returns {Object|undefined} Transformed event, or undefined if invalid
     */
    _transformSingleEvent(rawEvent) {
        if (!rawEvent.eventData) return undefined;

        const presentationTime = new TimeUtil(rawEvent.presentationTimeTicks, this.timescaleValue)
            .adjustForNetworkTime(this.track.presentationTime);

        const eventDuration =
            rawEvent.durationTicks !== undefined
                ? new TimeUtil(rawEvent.durationTicks, this.timescaleValue)
                : undefined;

        if (rawEvent.schemeUri === Scte35BoxParser.NETFLIX_SCHEME_URI) {
            // Netflix custom event box (NfBx)
            const nfParser = new Scte35BoxParser(
                new DataView(
                    rawEvent.eventData.buffer,
                    rawEvent.eventData.byteOffset,
                    rawEvent.eventData.byteLength
                ),
                platform.decodeUtf8,
                this.console
            );

            const parsed = nfParser.parse();
            if (!parsed) return undefined;

            const header = parsed.header;
            return {
                type: "netflix",
                presentationTime,
                eventDuration,
                id: header.messageId,
                applicationScope: rawEvent.value,
                isCancellation: header.cancel || false,
                contentType: header.contentType || "application/json",
                payload: parsed.body,
            };
        }

        if (rawEvent.schemeUri === EventBoxParser.SCTE35_SCHEME_URI) {
            // SCTE-35 event message box (emsg)
            const emsgParser = new EventBoxParser(
                new DataView(
                    rawEvent.eventData.buffer,
                    rawEvent.eventData.byteOffset,
                    rawEvent.eventData.byteLength
                ),
                this.console
            );

            const parsed = emsgParser.parse();
            if (!parsed) return undefined;

            // Extract Netflix-specific data from the SCTE-35 payload
            let nflxData;
            if (parsed.spliceDescriptorTag === 12 && parsed.privateData?.byteLength > 4) {
                const decoded = platform.decodeUtf8(new Uint8Array(parsed.privateData));
                if (decoded.slice(0, 4) === "NFLX") {
                    nflxData = decoded.slice(4);
                }
            }

            return {
                id: parsed.id,
                type: parsed.event,
                presentationTime,
                eventDuration,
                scte35Data: parsed,
                nflxData,
            };
        }

        return undefined;
    }
}
