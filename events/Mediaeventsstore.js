/**
 * Netflix Cadmium Player - Media Events Store
 * Component: MEDIAEVENTSSTORE
 *
 * Central store for live-stream media events: ad breaks, program boundaries,
 * chapter markers, and custom Netflix application events. Manages event
 * ingestion from the MediaEventsFetcher, event ordering, de-duplication,
 * cancellation, and notifies subscribers when the model updates.
 */

// Dependencies
// import { __values, __assign, __decorate, __awaiter, __generator } from 'tslib'; // webpack 22970
// import { EventEmitter } from './EventEmitter';            // webpack 90745
// import { TimeUtil, YX, LP, assert, xM } from './TimeUtil'; // webpack 91176
// import { MediaType } from './Mp4BoxParser';                // webpack 91562
// import { platform } from './Platform';                     // webpack 66164
// import { debugEnabled } from './Debug';                    // webpack 48170
// import { isLiveStream } from './LiveUtils';                // webpack 8149
// import { SessionMetricsClass, consoleLogger } from './SessionMetrics'; // webpack 61996
// import { ko } from './Pipeline';                           // webpack 54366
// import { MediaEventsFetcherFactory } from './MediaEventsFetcherFactory'; // webpack 45173
// import { isNetflixEvent } from './MediaEventUtils';        // webpack 89025
// import { MediaEventsDiagnostics } from './MediaEventsDiagnostics'; // webpack 12381
// import { createBehavior } from './MediaEventsBehavior';    // webpack 4786

/**
 * Event type priority for sorting events at the same presentation time.
 * Lower number = processed first.
 * @type {Object<string, number>}
 */
const EVENT_TYPE_PRIORITY = {
    breakend: 1,
    cancel: 1,
    programend: 2,
    programstart: 3,
    adbreak: 3,
    breakstart: 4,
    programbreakaway: 5,
    netflix: 6,
};

/**
 * @class MediaEventsStore
 *
 * Ingests, stores, and manages media events (ad breaks, program
 * boundaries, Netflix custom events) for a live viewable session.
 * Events arrive from the MediaEventsFetcher and are processed
 * sequentially by segment index.
 */
export class MediaEventsStore {
    /**
     * @param {Object} scheduler - Task scheduler for background work
     * @param {Object} viewableSession - The live viewable session
     * @param {Object} config - Player configuration
     * @param {Object} [eventHistory] - Previously received event history for fast start
     */
    constructor(scheduler, viewableSession, config, eventHistory) {
        /** @type {Object} */
        this.viewableSession = viewableSession;

        /** @type {Object} */
        this.config = config;

        /** @type {Object|undefined} */
        this.eventHistory = eventHistory;

        /**
         * @type {Object} The internal data store
         * @property {Array} programMap - List of programs with start/end events
         * @property {Array} netflixEvents - Netflix application events
         * @property {Array} adBreaks - Ad break entries
         */
        this.store = {
            programMap: [],

            /** @returns {Object|undefined} Most recent program */
            get lastProgram() {
                return this.programMap.length > 0
                    ? this.programMap[this.programMap.length - 1]
                    : undefined;
            },

            /** @returns {Object|undefined} Earliest program */
            get firstProgram() {
                return this.programMap.length > 0 ? this.programMap[0] : undefined;
            },

            netflixEvents: [],
            adBreaks: [],

            /**
             * Returns a diagnostic summary of the current store state.
             * @returns {Object}
             */
            getDiagnosticSummary() {
                return {
                    last5NetflixMediaEvents: this.netflixEvents
                        .map((evt) => ({
                            id: evt.id,
                            contentTimestamp: new TimeUtil.YX(
                                evt.presentationTime,
                                evt.presentationTime.add(evt.duration)
                            ).toString(),
                        }))
                        .slice(-5),
                    netflixMediaEventsCount: this.netflixEvents.length,
                    last5adBreaks: this.adBreaks
                        .map((ab) => ({
                            id: ab.id,
                            contentTimestamp: new TimeUtil.YX(
                                ab.presentationTime,
                                ab.presentationTime.add(ab.duration)
                            ).toString(),
                        }))
                        .slice(-5),
                    adBreaksCount: this.adBreaks.length,
                    last5Programs: this.programMap
                        .map((prog) => ({
                            id: prog.id,
                            programStart: prog.programStartEvent?.presentationTime?.toString(),
                            programEnd: prog.programEndEvent?.presentationTime?.toString(),
                        }))
                        .slice(-5),
                };
            },
        };

        /** @private @type {boolean} Whether the model has been updated at least once */
        this._hasModelUpdated = false;

        /** @type {Map} Netflix events keyed by composite key */
        this.netflixEventsMap = new Map();

        /** @type {Map} Ad breaks keyed by ID */
        this.adBreaksMap = new Map();

        /** @type {PriorityQueue} Incoming segment event queue, ordered by segmentIndex */
        this.eventQueue = new LP([], (a, b) => a.segmentIndex - b.segmentIndex);

        /** @type {TimeUtil} Earliest event time processed so far */
        this.earliestEventTime = TimeUtil.ZERO;

        /** @type {MediaEventsDiagnostics} */
        this.diagnostics = new MediaEventsDiagnostics();

        /**
         * Comparator for sorting events within the same segment.
         * Events are sorted first by presentation time, then by type priority.
         * @private
         */
        this._eventComparator = (a, b) => {
            if (!a.presentationTime.equal(b.presentationTime)) {
                return a.presentationTime.compareTo(b.presentationTime);
            }
            assert(a.type !== b.type, "events with the same presentation time should not have the same type");
            const priorityA = EVENT_TYPE_PRIORITY[a.type] ?? 0;
            const priorityB = EVENT_TYPE_PRIORITY[b.type] ?? 0;
            return priorityA - priorityB;
        };

        assert(viewableSession.isAdPlaygraph, "MediaEventsStore requires live Viewable");

        /** @type {EventEmitter} */
        this.events = new EventEmitter();

        let startContentTimestamp = TimeUtil.ZERO;

        /** @type {Object} Behavior strategy for event processing */
        this.behavior = createBehavior(this.viewableSession, this.store);

        this.console = new platform.Console(
            "MEDIAEVENTSSTORE",
            "asejs",
            `[${this.viewableSession.sessionId}]`
        );

        if (debugEnabled) {
            this.console.log(
                `Creating MediaEventsStore: synthesizeLiveIdrMismatch=${this.config.synthesizeLiveIdrMismatch}`
            );
        }

        /** @type {SessionMetricsClass} */
        this.sessionMetrics = new SessionMetricsClass({
            engine: this,
            source: "media-events-store",
            maxEntries: 10,
            console: this.console,
        });

        this.viewableSession.eventProcessingPipeline.register(new ko(this.sessionMetrics));

        // -- Process event history (for fast start on tune-in) --
        const enableHistory = config.enableMediaEventHistory;
        if (this.eventHistory && enableHistory) {
            const history = this.eventHistory;
            const cutoffTimeMs = history.cutoffTimeMs;
            const baseTimeMs = history.baseTimeMs;
            const timescaleValue = history.timescaleValue;

            if (timescaleValue && cutoffTimeMs >= baseTimeMs) {
                startContentTimestamp = TimeUtil.fromMilliseconds(cutoffTimeMs - baseTimeMs)
                    .applyTimescaleOffset(timescaleValue);
            }

            const logicalLiveEdge = TimeUtil.fromMilliseconds(
                this.viewableSession.getLiveEdgeTime(true)
            );

            if (this._needsMediaEventsFromHistory(startContentTimestamp, logicalLiveEdge)) {
                if (debugEnabled) {
                    this.console.log(
                        "needs events from media event history, adjusting startContentTimestamp",
                        "startContentTimestamp", startContentTimestamp?.toMs(),
                        "logicalLiveEdge", logicalLiveEdge?.toMs(),
                        "new startContentTimestamp", TimeUtil.min(startContentTimestamp, logicalLiveEdge)?.toMs()
                    );
                }
                startContentTimestamp = TimeUtil.min(startContentTimestamp, logicalLiveEdge);
            }

            this._processEventHistory(startContentTimestamp);

            if (debugEnabled) {
                this.console.log(
                    "processed history: cutoffTimeMs", cutoffTimeMs,
                    "baseTimeMs", baseTimeMs,
                    "startContentTimestamp", startContentTimestamp.toMs()
                );
            }
        } else if (debugEnabled) {
            this.console.log("no media events history");
        }

        // -- Start the media events fetcher if behavior requires it --
        if (this.behavior.shouldFetchEvents()) {
            this.fetcher = new MediaEventsFetcherFactory(
                scheduler,
                viewableSession,
                config,
                this.isEventsModelComplete.bind(this),
                this.diagnostics
            );

            this.fetcher.events.on("mediaEventsReceived", (segmentData) => {
                this.eventQueue.push(segmentData);

                if (debugEnabled) {
                    this.console.info("Received media events", {
                        segmentIndex: segmentData.segmentIndex,
                        queueHead: this.eventQueue
                            .toArray()
                            .slice(0, 5)
                            .map((item) => item.segmentIndex),
                    });
                }

                this._processEventQueue();

                if (this.isComplete) {
                    this.fetcher?.destroy();
                }
            });

            this.fetcher.events.on("eosReceived", () => {
                this.fetcher?.destroy();
            });

            this.events.on("modelUpdated", () => {
                this._hasModelUpdated = true;
            });
        }

        // -- Determine effective start timestamp --
        const eventEndContentTimestamp = this.viewableSession.networkState.eventEndContentTimestamp;
        if (eventEndContentTimestamp?.isFinite()) {
            // Bounded event window
            if (this.store.lastProgram?.programEndEvent === undefined) {
                const eventStartTimestamp = this.viewableSession.networkState.eventStartContentTimestamp;
                if (eventStartTimestamp !== undefined) {
                    startContentTimestamp = TimeUtil.max(startContentTimestamp, eventStartTimestamp);
                }
            }
        } else {
            // Unbounded — use configured catchup window
            const maxCatchupMs = viewableSession.hasSegmentAvailabilityWindow
                ? config.linearMaximumEventsCatchupMs
                : config.liveMaximumEventsCatchupMs;

            startContentTimestamp = TimeUtil.max(
                startContentTimestamp,
                TimeUtil.fromMilliseconds(this.viewableSession.getLiveEdgeTime(true) - maxCatchupMs)
            );
        }

        // Listen for URL updates to restart fetcher
        this.viewableSession.events.on("urlsUpdated", () => {
            this.fetcher?.updateSegmentIndex(this.currentSegmentIndex);
        });

        this._startFetching(startContentTimestamp);

        if (debugEnabled && this.fetcher) {
            this.console.log(
                `starting retrieval at segment ${this.currentSegmentIndex}, ` +
                `startSegmentNumber: ${this.supplementaryStream.track.startSegmentNumber}, ` +
                `startContentTimestamp: ${startContentTimestamp.toMs()}, ` +
                `eventStartContentTimestamp: ${this.viewableSession.networkState.eventStartContentTimestamp?.toMs()}, ` +
                `eventEndContentTimestamp: ${eventEndContentTimestamp?.toMs()}, ` +
                `logicalLiveEdge: ${this.viewableSession.getLiveEdgeTime(true)}, ` +
                `averageSegmentDuration: ${this.supplementaryStream.track.trackInfo.toMs()}`
            );
        }
    }

    // -- Computed properties ------------------------------------------------

    /** @returns {TimeUtil} Current processing watermark */
    get processingWatermark() {
        return this.earliestEventTime;
    }

    /** @returns {boolean} Whether the model has been updated at least once */
    get hasModelUpdated() {
        return this._hasModelUpdated;
    }

    /** @returns {boolean} Whether event processing is complete */
    get isComplete() {
        return this.isEventsModelComplete(this.earliestEventTime);
    }

    /**
     * Returns the supplementary media track used for event delivery.
     * @returns {Object}
     */
    get supplementaryTrack() {
        const track = this.viewableSession.getTracks(MediaType.supplementaryMediaType)[0];
        assert(isLiveStream(track), "MediaEventsStore: track is not live");
        return track;
    }

    /**
     * Returns the first downloadable stream for the supplementary track.
     * @returns {Object}
     */
    get supplementaryStream() {
        return this.supplementaryTrack.downloadables[0];
    }

    // -- Public methods -----------------------------------------------------

    /**
     * Resets the store and restarts event fetching from the current live edge.
     */
    resetAndRestart() {
        const restartTime = TimeUtil.fromMilliseconds(
            this.viewableSession.getLiveEdgeTime(true) - this.config.liveMaximumEventsCatchupMs
        );
        this.currentSegmentIndex = 0;
        this.eventQueue.clear();
        this._hasModelUpdated = false;
        this.earliestEventTime = restartTime;
        this._restartFetcher(restartTime);
    }

    /**
     * Checks whether media events are available up to the given timestamp.
     * If not, may trigger a catchup restart.
     *
     * @param {TimeUtil} timestamp
     * @returns {boolean}
     */
    hasMediaEvents(timestamp) {
        if (this.isComplete || this.earliestEventTime.greaterThan(timestamp)) {
            if (debugEnabled) {
                this.console.pauseTrace(`hasMediaEvents ${timestamp.toMs()} returns true`);
            }
            return true;
        }

        const catchupCutoff = timestamp.subtract(
            TimeUtil.fromMilliseconds(this.config.liveMediaEventsCatchupMs)
        );

        if (debugEnabled) {
            this.console.pauseTrace(
                `hasMediaEvents ${timestamp.toMs()} returns false,` +
                ` cutoff (${this.earliestEventTime.toMs()})` +
                ` catchup (${catchupCutoff.toMs()})`
            );
        }

        if (this.earliestEventTime.lessThan(catchupCutoff)) {
            if (debugEnabled) {
                this.console.pauseTrace(`catchup to ${catchupCutoff.toMs()}`);
            }
            this._restartFetcher(catchupCutoff);
        }

        return false;
    }

    /**
     * Skips media events ahead to the given timestamp if needed.
     * @param {TimeUtil} timestamp
     */
    skipMediaEvents(timestamp) {
        if (!this.isComplete && this.earliestEventTime.isBefore(timestamp)) {
            const adjusted = timestamp.add(this.supplementaryTrack.trackInfo);
            if (debugEnabled) {
                this.console.pauseTrace(`skip to ${adjusted.toMs()}`);
            }
            this._restartFetcher(adjusted);
        }
    }

    /**
     * Updates an ad break when a point-of-interest (POI) timestamp changes.
     * @param {TimeUtil} oldTimestamp
     * @param {TimeUtil} newTimestamp
     */
    updateAdBreakTimestamp(oldTimestamp, newTimestamp) {
        if (debugEnabled) {
            this.console.pauseTrace(`POI changed from ${oldTimestamp.toMs()} to ${newTimestamp.toMs()}`);
        }

        let found = false;
        for (let i = 0; i < this.store.adBreaks.length; i++) {
            const adBreak = this.store.adBreaks[i];

            if (adBreak.presentationTime.playbackSegment === oldTimestamp.playbackSegment) {
                if (debugEnabled) {
                    this.console.pauseTrace(
                        `Updating adBreak ${i}, id:${adBreak.id} location: ${adBreak.presentationTime.toMs()}` +
                        ` to location ${newTimestamp.toMs()}` +
                        ` from ${adBreak.presentationTime.toMs()} and duration from ${adBreak.duration.toMs()}` +
                        ` to ${adBreak.duration.add(adBreak.presentationTime.subtract(newTimestamp)).toMs()}`
                    );
                }
                adBreak.duration = adBreak.duration.add(adBreak.presentationTime.subtract(newTimestamp));
                adBreak.presentationTime = newTimestamp;
                found = true;
                break;
            }

            if (
                adBreak.presentationTime.add(adBreak.duration).playbackSegment ===
                oldTimestamp.playbackSegment
            ) {
                if (debugEnabled) {
                    this.console.pauseTrace(
                        `Updating adBreak ${i}, id:${adBreak.id} location: ${adBreak.presentationTime.toMs()}` +
                        ` duration to ${newTimestamp.subtract(adBreak.presentationTime).toMs()}` +
                        ` from ${adBreak.duration.toMs()}`
                    );
                }
                adBreak.duration = newTimestamp.subtract(adBreak.presentationTime);
                found = true;
                break;
            }
        }

        if (debugEnabled && !found) {
            this.console.RETRY(
                `POI changed from ${oldTimestamp.toMs()} to ${newTimestamp.toMs()} but no adBreak found`
            );
        }
    }

    /**
     * Checks whether the events model is complete up to the given timestamp.
     * @param {TimeUtil} timestamp
     * @returns {boolean}
     */
    isEventsModelComplete(timestamp) {
        if (this.behavior.isEventsModelComplete()) {
            if (debugEnabled) {
                this.console.pauseTrace("isEventsModelComplete ending because the model is complete");
            }
            return true;
        }

        const eventEndTimestamp = this.viewableSession.networkState.eventEndTimestamp;
        const isPastEnd = timestamp.isAfterOrEqual(eventEndTimestamp);

        if (isPastEnd && debugEnabled) {
            this.console.pauseTrace("isEventsModelComplete ending at time:", {
                timestamp,
                eventEndTimestamp,
            });
        }

        return isPastEnd;
    }

    /**
     * Destroys the fetcher and cleans up resources.
     */
    destroy() {
        this.fetcher?.destroy();
    }

    /**
     * Disables event fetching and skips far into the future.
     */
    disable() {
        this.destroy();
        const farFuture = TimeUtil.fromMilliseconds(72_000_000); // 20 hours
        this.skipMediaEvents(farFuture);
    }

    // -- Private methods ----------------------------------------------------

    /**
     * Computes the segment index and starts the fetcher.
     * @private
     * @param {TimeUtil} startTimestamp
     */
    _startFetching(startTimestamp) {
        const segmentOffset = Math.floor(
            startTimestamp.scaleBy(this.supplementaryStream.track.trackInfo)
        );
        this.currentSegmentIndex = segmentOffset + this.supplementaryStream.track.startSegmentNumber;
        this.earliestEventTime = this.supplementaryStream.track.trackInfo.convertTicks(segmentOffset);

        if (this.fetcher) {
            assert(!this.fetcher.isRunning, "retrieval service should not be running at start");
            this.fetcher.start(this.currentSegmentIndex);
        }
    }

    /**
     * Restarts the fetcher from a new timestamp if the segment index advanced.
     * @private
     * @param {TimeUtil} startTimestamp
     */
    _restartFetcher(startTimestamp) {
        const segmentOffset = Math.floor(
            startTimestamp.scaleBy(this.supplementaryStream.track.trackInfo)
        );
        const oldIndex = this.currentSegmentIndex;
        const newIndex = segmentOffset + this.supplementaryStream.track.startSegmentNumber;

        if (newIndex > oldIndex) {
            this.currentSegmentIndex = newIndex;
            this.earliestEventTime = this.supplementaryStream.track.trackInfo.convertTicks(segmentOffset);
        }

        if (this.fetcher) {
            if (debugEnabled) {
                this.console.pauseTrace("Restarting retrieval", {
                    start: startTimestamp.toMs(),
                    segmentIndex: newIndex,
                });
            }

            if (this.fetcher.isStarted) {
                if (newIndex > oldIndex) {
                    this.eventQueue.clear();
                    this.fetcher.restart(this.currentSegmentIndex);
                }
            } else {
                this.fetcher.start(this.currentSegmentIndex);
            }
        }

        this._processEventQueue();
    }

    /**
     * Processes all queued segment events in order by segment index.
     * Emits "modelUpdated" when new events affect the data model and
     * "progress" when the processing watermark advances.
     * @private
     */
    _processEventQueue() {
        const updatedTypes = new Set();
        const updatedTimestamps = [];

        this.currentSegmentIndex ??= this.supplementaryStream.track.startSegmentNumber;

        let madeProgress = false;

        if (debugEnabled) {
            this.console.log("Starting process loop", {
                segmentIndex: this.currentSegmentIndex,
                queueHead: this.eventQueue.peek()?.segmentIndex,
                queueLength: this.eventQueue.length,
                watermark: this.earliestEventTime.toString(),
            });
        }

        while (this.eventQueue.length > 0) {
            const nextItem = this.eventQueue.peek();

            if (nextItem?.segmentIndex === this.currentSegmentIndex) {
                // Process events from this segment
                if (nextItem.events.length) {
                    if (debugEnabled) {
                        this.console.log("Adding media events", {
                            segmentIndex: this.currentSegmentIndex,
                            next: nextItem,
                        });
                    }
                } else if (debugEnabled) {
                    this.console.debug("Empty media events", {
                        segmentIndex: this.currentSegmentIndex,
                        next: nextItem,
                    });
                }

                const events = nextItem.events;
                events.sort(this._eventComparator);

                for (const event of events) {
                    // Apply timescale offset from event history if available
                    if (this.eventHistory) {
                        const timescaleValue = this.eventHistory.timescaleValue;
                        event.presentationTime = event.presentationTime.applyTimescaleOffset(timescaleValue);
                        event.eventDuration = event.eventDuration
                            ? event.eventDuration.applyTimescaleOffset(timescaleValue)
                            : undefined;
                    }

                    if (this._addEvent(event)) {
                        updatedTypes.add(event.type);
                        updatedTimestamps.push(event.presentationTime);

                        if (debugEnabled) {
                            this.console.debug("Adding event updated model", {
                                presentationTime: event.presentationTime,
                                segmentEndTime: nextItem.segmentEndTime,
                            });
                        }
                    }
                }

                this.earliestEventTime = TimeUtil.max(this.earliestEventTime, nextItem.segmentEndTime);
                madeProgress = true;
                this.currentSegmentIndex++;
                this.eventQueue.pop();
            } else if ((nextItem?.segmentIndex ?? 0) < this.currentSegmentIndex) {
                // Drop stale events from before our current position
                if (debugEnabled) {
                    this.console.RETRY("Dropping old media event", {
                        expectedIndex: this.currentSegmentIndex,
                        receivedIndex: nextItem?.segmentIndex,
                    });
                }
                this.eventQueue.pop();
                this.diagnostics?.recordDroppedSegment(nextItem?.segmentIndex ?? 0);
            } else {
                // Gap in segment indices — wait for missing segments
                if (debugEnabled) {
                    this.console.info("First item in queue is later... waiting", {
                        expectedIndex: this.currentSegmentIndex,
                        nextIndex: nextItem?.segmentIndex,
                    });
                }
                break;
            }
        }

        // Emit model-updated if any events changed the model
        if (updatedTypes.size > 0) {
            this.events.emit("modelUpdated", {
                type: "modelUpdated",
                updatedEventTypes: updatedTypes,
                updatedTimestamps,
            });
        }

        // Emit progress if we advanced the watermark
        if (madeProgress) {
            if (debugEnabled) {
                this.console.pauseTrace(`progress to ${this.earliestEventTime.toMs()}`);
            }
            this.events.emit("progress", {
                type: "progress",
                segmentEndTime: this.earliestEventTime,
            });
        }

        if (debugEnabled) {
            this.console.log("Exiting process loop", {
                segmentIndex: this.currentSegmentIndex,
                queueHead: this.eventQueue.peek()?.segmentIndex,
                watermark: this.earliestEventTime.toString(),
                madeProgress,
                queueContents: this.eventQueue.toArray().map((item) => item.segmentIndex),
            });
        }
    }

    /**
     * Processes event history from a prior session for fast start.
     * @private
     * @param {TimeUtil} startTimestamp
     */
    _processEventHistory(startTimestamp) {
        const updatedTimestamps = [];

        if (!this.eventHistory) return;

        const { mediaEvents, timescaleValue } = this.eventHistory;

        if (!mediaEvents.length) return;

        const updatedTypes = new Set();

        mediaEvents.forEach((historyEvent) => {
            const presentationTime = new TimeUtil(historyEvent.timestamp, timescaleValue);
            const eventDuration =
                historyEvent.duration !== undefined
                    ? new TimeUtil(historyEvent.duration, timescaleValue)
                    : undefined;

            let processedEvent;

            if (historyEvent.type === "netflix") {
                const endTime = presentationTime.add(eventDuration || TimeUtil.ZERO);
                if (startTimestamp.isAfterOrEqual(endTime)) {
                    processedEvent = {
                        type: historyEvent.type,
                        id: historyEvent.id,
                        presentationTime,
                        eventDuration,
                        applicationScope: historyEvent.applicationScope,
                    };
                } else if (debugEnabled) {
                    this.console.pauseTrace("skipping in-progress event id:", historyEvent.id);
                }
            } else {
                processedEvent = {
                    type: historyEvent.type,
                    id: historyEvent.id,
                    presentationTime,
                    eventDuration,
                    scte35Type: historyEvent.scte35Type,
                    nflxData: historyEvent.nflxData,
                };
            }

            if (processedEvent) {
                this._addEvent(processedEvent);
                updatedTimestamps.push(processedEvent.presentationTime);
                updatedTypes.add(processedEvent.type);
            }
        });

        if (updatedTypes.size) {
            this.events.emit("modelUpdated", {
                type: "modelUpdated",
                updatedEventTypes: updatedTypes,
                updatedTimestamps,
            });
        }

        this.sessionMetrics.emitDiagnosticEvent({
            store: this.store.getDiagnosticSummary(),
        });
    }

    /**
     * Routes an event to the appropriate handler (Netflix vs. standard).
     * @private
     * @param {Object} event
     * @returns {boolean} Whether the model was updated
     */
    _addEvent(event) {
        const updated = isNetflixEvent(event)
            ? this._addNetflixEvent(event)
            : this._addStandardEvent(event);

        this.sessionMetrics.emitDiagnosticEvent({
            adBreakCount: this.store.adBreaks.length,
            modelUpdated: updated,
            type: event.type,
        });

        this.diagnostics?.recordEvent(event, updated, event.presentationTime);

        return updated;
    }

    /**
     * Adds or cancels a Netflix application event.
     * @private
     * @param {Object} event
     * @returns {boolean}
     */
    _addNetflixEvent(event) {
        let modelChanged = false;
        const isCancellation = event.isCancellation;
        const compositeKey = `${event.id}-${event.applicationScope}`;
        const existing = this.netflixEventsMap.get(compositeKey);

        if (!existing && !isCancellation) {
            // New event
            const entry = {
                key: compositeKey,
                id: event.id,
                duration: event.eventDuration || TimeUtil.ZERO,
                presentationTime: event.presentationTime,
                applicationScope: event.applicationScope,
                contentType: event.contentType,
                payload: event.payload,
            };
            this.netflixEventsMap.set(entry.key, entry);
            modelChanged = true;

            if (debugEnabled) {
                this.console.pauseTrace("emitting netflixEventReceived:", entry);
            }
            this.events.emit("netflixEventReceived", entry);
        } else if (existing && isCancellation) {
            // Cancellation of existing event
            const newDuration = event.presentationTime.subtract(existing.presentationTime);
            modelChanged = this._performCancellation(event, existing, newDuration);

            const updatedEntry = {
                ...existing,
                duration: newDuration,
                contentType: event.contentType,
                payload: event.payload,
            };

            if (debugEnabled) {
                this.console.pauseTrace("emitting netflixEventCancelled:", updatedEntry);
            }
            this.events.emit("netflixEventCancelled", updatedEntry);
        } else if (debugEnabled) {
            this.console.pauseTrace("Duplicate NetflixMediaEvent ignored:", {
                compositeKey,
                existing,
                event,
            });
        }

        if (modelChanged) {
            this.store.netflixEvents = Array.from(this.netflixEventsMap.values());
        }

        return modelChanged;
    }

    /**
     * Processes a standard media event (ad break, program boundary, etc.).
     * @private
     * @param {Object} event
     * @returns {boolean}
     */
    _addStandardEvent(event) {
        let modelChanged = false;
        const eventMetadata = event.scte35Data;
        const scte35Type = eventMetadata?.scte35SpliceType || event.scte35Type;
        const lastProgram = this.store.lastProgram;

        // Apply IDR mismatch correction if configured
        if (this.config.synthesizeLiveIdrMismatch) {
            const idrOffset = this.viewableSession
                .getTracks(MediaType.VIDEO)[0]
                .frameDuration?.convertTicks(this.config.synthesizeLiveIdrMismatch);

            if (idrOffset) {
                this.console.log(
                    `Adjusting event timestamp ${event.presentationTime.toMs()} by ${idrOffset.toMs()}`
                );
                event.presentationTime = event.presentationTime.add(idrOffset);
            }
        }

        const eventId = event.presentationTime.value;
        this.console.debug("Processing event", {
            id: eventId,
            watermark: this.earliestEventTime,
            event,
        });

        if (!this.behavior.shouldProcessEvent(event)) {
            return false;
        }

        switch (event.type) {
            case "breakstart":
            case "adbreak": {
                if (event.presentationTime.lessThan(this.earliestEventTime)) break;

                const existing = this.adBreaksMap.get(eventId);
                if (
                    existing &&
                    existing.presentationTime.equal(event.presentationTime) &&
                    existing.duration.equal(event.eventDuration || TimeUtil.ZERO) &&
                    existing.scte35Type === scte35Type
                ) {
                    break; // Duplicate, skip
                }

                if (this.behavior.shouldAddAdBreak()) {
                    this._upsertAdBreak(eventId, event, eventMetadata);
                    modelChanged = true;
                }
                break;
            }

            case "cancel": {
                const candidates = this.store.adBreaks
                    .filter(
                        (ab) =>
                            ab.parentEventId === eventMetadata?.id &&
                            ab.scte35Type === scte35Type
                    )
                    .sort((a, b) => a.presentationTime.compareTo(b.presentationTime));

                if (candidates.length === 0) break;

                const target = candidates[candidates.length - 1];
                if (target.presentationTime.add(target.duration).lessThan(event.presentationTime)) {
                    break;
                }

                modelChanged = this._performCancellation(
                    event,
                    target,
                    event.presentationTime.subtract(target.presentationTime)
                );
                break;
            }

            case "breakend": {
                const candidates = this.store.adBreaks
                    .filter((ab) => {
                        const range = new TimeUtil.YX(
                            ab.presentationTime,
                            ab.presentationTime.add(ab.duration)
                        );
                        return (
                            ab.parentEventId === eventMetadata?.id &&
                            range.contains(event.presentationTime)
                        );
                    })
                    .sort((a, b) => a.presentationTime.compareTo(b.presentationTime));

                if (candidates.length === 0) break;

                const target = candidates[candidates.length - 1];
                if (target.presentationTime.add(target.duration).lessThan(event.presentationTime)) {
                    break;
                }

                modelChanged = this._handleBreakEnd(target, event);
                break;
            }

            case "programend":
                if (
                    lastProgram &&
                    lastProgram.id === event.id &&
                    !lastProgram.programEndEvent?.presentationTime
                ) {
                    this.console.debug("Setting program end", event.presentationTime);
                    lastProgram.programEndEvent = { timestamp: event.presentationTime };
                    modelChanged = true;
                }
                break;

            case "programstart":
                if (lastProgram && lastProgram.id === event.id) {
                    // Update end time from duration if available
                    if (
                        event.eventDuration?.isFinite() &&
                        event.eventDuration.greaterThan(TimeUtil.ZERO) &&
                        !lastProgram.programEndEvent
                    ) {
                        this.console.debug(
                            "Setting program end from programstart event",
                            event.presentationTime
                        );
                        lastProgram.programEndEvent = {
                            timestamp: event.presentationTime.add(event.eventDuration),
                        };
                        modelChanged = true;
                    }
                } else if (
                    this.store.programMap.filter((p) => p.id === event.id).length > 0
                ) {
                    this.console.debug(
                        "Skipping program start because it not the latest program start",
                        event.presentationTime
                    );
                } else if (
                    lastProgram?.programStartEvent &&
                    event.presentationTime.lessThan(lastProgram.programStartEvent.presentationTime)
                ) {
                    this.console.debug(
                        "Skipping program start event because it is before the last program start",
                        event.presentationTime
                    );
                } else {
                    if (lastProgram && !lastProgram.programEndEvent) {
                        this.console.debug(
                            "Received a new program start while program end is not set, setting program end automatically",
                            event.presentationTime
                        );
                        lastProgram.programEndEvent = { timestamp: event.presentationTime };
                    }

                    this.console.debug("Setting program start", event.presentationTime);
                    assert(event.id !== undefined, "Program start event must have an id");

                    this.store.programMap.push({
                        id: event.id,
                        programStartEvent: { timestamp: event.presentationTime },
                    });
                    modelChanged = true;
                }
                break;
        }

        if (modelChanged) {
            this.store.adBreaks = Array.from(this.adBreaksMap.values());
        }

        return modelChanged;
    }

    /**
     * Inserts or updates an ad break entry.
     * @private
     * @param {string} id - Event ID
     * @param {Object} event - The media event
     * @param {Object} [metadata] - SCTE-35 metadata
     */
    _upsertAdBreak(id, event, metadata) {
        const lastProgramStart = this.store.lastProgram?.programStartEvent?.presentationTime;
        const scte35Type = metadata?.scte35SpliceType || event.scte35Type;

        this.adBreaksMap.set(id, {
            id,
            duration: event.eventDuration || TimeUtil.ZERO,
            presentationTime: event.presentationTime,
            location: lastProgramStart
                ? event.presentationTime.subtract(lastProgramStart)
                : TimeUtil.ZERO,
            scte35Type,
            nflxData: event.nflxData,
            parentEventId: metadata?.id,
        });

        if (debugEnabled) {
            this.console.debug("Upserting event", {
                id,
                adBreak: this.adBreaksMap.get(id),
            });
        }
    }

    /**
     * Cancels or shortens an existing event entry.
     * @private
     * @param {Object} cancelEvent - The cancel event
     * @param {Object} targetEntry - The entry being cancelled
     * @param {TimeUtil} newDuration - The shortened duration
     * @returns {boolean} Whether the model changed
     */
    _performCancellation(cancelEvent, targetEntry, newDuration) {
        let changed = false;

        if (newDuration.equal(TimeUtil.ZERO)) {
            // Full cancellation — remove the entry
            this.console.debug("Deleting event", targetEntry.id);
            this.sessionMetrics.emitDiagnosticEvent({ deleting: true });

            if (isNetflixEvent(cancelEvent)) {
                this.netflixEventsMap.delete(targetEntry.key);
            } else {
                this.adBreaksMap.delete(targetEntry.id);
            }
            changed = true;
        } else if (newDuration.lessThan(targetEntry.duration)) {
            // Partial cancellation — shorten the duration
            this.console.debug("Updating event", {
                id: targetEntry.id,
                newDuration,
            });
            this.sessionMetrics.emitDiagnosticEvent({ adjusting: newDuration });

            if (isNetflixEvent(cancelEvent)) {
                this.netflixEventsMap.set(targetEntry.key, { ...targetEntry, duration: newDuration });
            } else {
                this.adBreaksMap.set(targetEntry.id, { ...targetEntry, duration: newDuration });
            }
            changed = true;
        }

        return changed;
    }

    /**
     * Handles a break-end event by adjusting the duration of the matching ad break.
     * @private
     * @param {Object} adBreak - The ad break entry
     * @param {Object} breakEndEvent - The break-end event
     * @returns {boolean} Whether the model changed
     */
    _handleBreakEnd(adBreak, breakEndEvent) {
        let changed = false;
        const newDuration = breakEndEvent.presentationTime.subtract(adBreak.presentationTime);

        if (newDuration.equal(TimeUtil.ZERO)) {
            this.console.error(
                "Unexpected zero-length adBreak after breakend media event (early terminated adbreak)",
                adBreak.nflxData
            );
        } else if (newDuration.lessThan(adBreak.duration)) {
            this.console.debug("Updating event", { id: adBreak.id, newDuration });
            this.sessionMetrics.emitDiagnosticEvent({ adjusting: newDuration });
            this.adBreaksMap.set(adBreak.id, { ...adBreak, duration: newDuration });
            changed = true;
        }

        return changed;
    }

    /**
     * Determines if we need to fetch events from history to cover an
     * in-progress Netflix event that spans the tune-in point.
     * @private
     * @param {TimeUtil} startTimestamp
     * @param {TimeUtil} liveEdge
     * @returns {boolean}
     */
    _needsMediaEventsFromHistory(startTimestamp, liveEdge) {
        if (!this.eventHistory || !this.config.earlyFetchMediaEvents) return false;

        const { mediaEvents, timescaleValue } = this.eventHistory;
        if (!mediaEvents.length) return false;

        return mediaEvents.some((evt) => {
            const presentationTime = new TimeUtil(evt.timestamp, timescaleValue);
            const eventDuration =
                evt.duration !== undefined ? new TimeUtil(evt.duration, timescaleValue) : undefined;
            const endTime = presentationTime.add(eventDuration || TimeUtil.ZERO);

            return evt.type === "netflix" && presentationTime.lessThan(startTimestamp) && endTime.greaterThan(liveEdge);
        });
    }
}
