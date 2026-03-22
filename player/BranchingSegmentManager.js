/**
 * BranchingSegmentManager - Interactive content segment navigation manager
 *
 * Manages playback of branching/interactive content segments (e.g., Bandersnatch).
 * Handles playing next segments (with ASE seamless branch or seek fallback),
 * queueing segments for delayed seek, and updating segment weights.
 *
 * @module player/BranchingSegmentManager
 * @original Module_61494
 */

// import { ea as ErrorCodes, EventTypeEnum } from '../core/ErrorCodes';
// import { we as NfError } from '../core/NfError';
// import { PlayerEvents, streamState } from '../player/PlayerEvents';
// import { ri as seconds } from '../timing/TimeUnits';

/**
 * Error subclass for branching segment management failures.
 * @private
 */
class BranchingSegmentError extends NfError {
    constructor(code, message, eventType, data) {
        super(code, eventType, undefined, undefined, undefined, message, undefined, data);
    }

    toString() {
        return `${this.code}-${this.errorSubCode} : ${this.message}\n${JSON.stringify(this.data)}`;
    }
}

/**
 * Represents a segment in the playgraph with timing and navigation info.
 * @private
 */
class PlaygraphSegment {
    constructor(id, segmentData) {
        this.id = id;
        this.segmentData = segmentData;
    }

    /** @returns {number} Content start PTS in milliseconds */
    get startTimeMs() {
        return this.segmentData.startTimeMs;
    }

    /** @returns {number|undefined} Content end PTS in milliseconds */
    get contentEndPts() {
        return this.segmentData.endTimeMs ?? undefined;
    }

    /** @returns {string[]} IDs of possible next segments */
    get nextSegmentIds() {
        return Object.keys(this.segmentData.next ?? {});
    }

    toJSON() {
        return {
            id: this.id,
            contentStartPts: this.startTimeMs,
            contentEndPts: this.contentEndPts,
        };
    }
}

/**
 * Manages segment navigation for interactive/branching content.
 *
 * Supports:
 * - Playing the next segment via ASE seamless branching or seek fallback
 * - Queueing segments for delayed seek at end of current segment
 * - Updating next segment weights (for choice probabilities)
 */
export class BranchingSegmentManager {
    /**
     * @param {Object} logger - Logger factory
     * @param {Object} player - Player instance with seek capability
     * @param {Object} playerState - Player state object
     * @param {Object} momentObserver - Moment/PTS observer for delayed seeks
     * @param {Object} scheduler - Task scheduler
     * @param {Object} eventBus - Event bus
     * @param {Function} configFn - Configuration getter
     */
    constructor(logger, player, playerState, momentObserver, scheduler, eventBus, configFn) {
        this.player = player;
        this.playerState = playerState;
        this.momentObserver = momentObserver;
        this.scheduler = scheduler;
        this.eventBus = eventBus;
        this.configFn = configFn;

        /** @private */
        this.cancelDelayedSeek = () => {
            if (this.delayedSeekHandle) {
                this.delayedSeekHandle.cancel();
                this.delayedSeekHandle = undefined;
            }
        };

        this.log = logger.createSubLogger("SegmentManager", this.playerState);

        /** @type {Map<string, PlaygraphSegment>} */
        this.segments = new Map();

        if (this.playerState.sessionContext.isSeeking) {
            this.playerState.addEventListener(PlayerEvents.SEGMENT_PRESENTING, (event) =>
                this.onSegmentPresenting(event)
            );
            this.playerState.addEventListener(PlayerEvents.CLOSED, this.cancelDelayedSeek);
        }
    }

    /**
     * Called when a segment starts presenting. Populates the segment map.
     * @private
     */
    onSegmentPresenting(event) {
        const segmentId = event.position.segmentId;

        if (this.segments.size === 0) {
            Object.entries(this.playerState.internal_Jba()).forEach(([id, data]) => {
                this.segments.set(id, new PlaygraphSegment(id, data));
            });
        }

        this.currentSegment = this.segments.get(segmentId);
    }

    /**
     * Plays a segment - either via seamless branch or full seek.
     *
     * @param {string} segmentId - Target segment ID
     * @returns {Promise<void>}
     */
    playing(segmentId) {
        if (this.queuedSegment) {
            this.queuedSegment = undefined;
        }
        this.cancelDelayedSeek();
        this.log.pauseTrace("Playing segment", segmentId);

        return this.isNextSegment(segmentId)
            ? this.playNextSegmentSeamless(segmentId)
            : this.seekToSegment(segmentId);
    }

    /**
     * Queues a segment for playback - either via ASE or delayed seek.
     *
     * @param {string} segmentId - Target segment ID
     * @returns {Promise<void>}
     */
    queueing(segmentId) {
        this.log.pauseTrace("Queueing segment", segmentId);

        return this.isNextSegment(segmentId)
            ? this.queueNextSegment(segmentId)
            : this.queueSeparatedSegment(segmentId);
    }

    /**
     * Updates the weights for next segment selection.
     *
     * @param {string} segmentId - Current segment ID
     * @param {Object} weightUpdates - New weight values
     * @returns {Promise<void>}
     */
    updateNextSegmentWeights(segmentId, weightUpdates) {
        const session = this.playerState.streamingSession;
        if (!session?.isDeviceMonitored) {
            return Promise.reject(
                this.createError(
                    ErrorCodes.BRANCH_UPDATE_FAILURE,
                    "ASE session manager is not yet initialized",
                    EventTypeEnum.BRANCHING_ASE_UNINITIALIZED,
                    { segmentId, updates: weightUpdates }
                )
            );
        }

        this.log.pauseTrace("Updating next segment weights", segmentId, weightUpdates);

        return new Promise((resolve, reject) => {
            try {
                session.M2c(segmentId, weightUpdates);
                this.playerState.fireEvent(PlayerEvents.SEGMENT_WEIGHTS_UPDATED, {
                    M: segmentId,
                    RWb: weightUpdates,
                });
                resolve();
            } catch (e) {
                reject(
                    this.createError(
                        ErrorCodes.BRANCH_UPDATE_FAILURE,
                        "updateNextSegmentWeights threw an exception",
                        EventTypeEnum.BRANCHING_UPDATE_NEXT_SEGMENT_WEIGHTS_THREW,
                        { segmentId, updates: weightUpdates, error: e }
                    )
                );
            }
        });
    }

    /**
     * Checks if a segment ID is a direct "next" from the current segment.
     * @private
     */
    isNextSegment(segmentId) {
        if (!this.currentSegment) return false;
        return this.playerState.internal_Jba()[this.currentSegment.id]?.next?.[segmentId] !== undefined;
    }

    /**
     * Gets the PTS where the presenting branch ends.
     * @private
     */
    getPresentingBranchEndPts() {
        const session = this.playerState.streamingSession;
        if (session?.isDeviceMonitored) {
            return session.getStreamState().BPc;
        }
    }

    /**
     * Gets the currently playing stream ID.
     * @private
     */
    getCurrentStreamId() {
        const session = this.playerState.streamingSession;
        if (session?.isDeviceMonitored) {
            return session.getStreamState().id;
        }
    }

    /**
     * Attempts seamless branch transition via ASE, falls back to seek on failure.
     * @private
     */
    playNextSegmentSeamless(segmentId) {
        const session = this.playerState.streamingSession;

        if (!session?.isDeviceMonitored) {
            return Promise.reject(
                this.createError(ErrorCodes.BRANCH_PLAY_FAILURE, "ASE session manager is not yet initialized",
                    EventTypeEnum.BRANCHING_ASE_UNINITIALIZED, { id: segmentId })
            );
        }

        // Single next segment - just seek directly
        if (this.currentSegment && this.currentSegment.nextSegmentIds.length === 1) {
            return this.seekToSegment(segmentId);
        }

        if (!this.playerState.mediaSourceManager) {
            this.log.RETRY("MediaPresenter is not initialized", segmentId);
            return Promise.reject(
                this.createError(ErrorCodes.BRANCH_PLAY_FAILURE, "MediaPresenter is not initialized",
                    EventTypeEnum.BRANCHING_PRESENTER_UNINITIALIZED, { id: segmentId })
            );
        }

        return new Promise((resolve, reject) => {
            let repositioned = false;
            let aseStopped = false;
            let completed = false;
            const seekTarget = this.getPresentingBranchEndPts();

            if (seekTarget === undefined) {
                this.log.debug("playNextSegment: getPresentingBranchPlayerEndPts undefined, fallback to full seek.",
                    { segment: segmentId });
                return this.seekToSegment(segmentId);
            }

            this.playerState.fireEvent(PlayerEvents.SEGMENT_TRANSITION, {
                Li: this.currentSegment?.id,
                s2: segmentId,
            });

            const onAseStopped = () => {
                aseStopped = true;
                session.removeEventListener("stop", onAseStopped);
                tryComplete();
            };

            const onRepositioned = () => {
                session.aseTimer();
                repositioned = true;
                this.playerState.removeEventListener(PlayerEvents.REPOSITIONED, onRepositioned);
                tryComplete();
            };

            const tryComplete = () => {
                if (completed || !aseStopped || !repositioned) return;
                timeoutHandle.cancel();
                completed = true;

                if (session.mpa(segmentId, false)) {
                    resolve();
                } else {
                    this.log.error("playNextSegment: ASE chooseNextSegment failed. Falling back to full seek.",
                        { segment: segmentId });
                    this.seekToSegment(segmentId).then(resolve).catch(reject);
                }
            };

            session.addEventListener("stop", onAseStopped);
            this.playerState.addEventListener(PlayerEvents.REPOSITIONED, onRepositioned);

            const timeoutHandle = this.scheduler.scheduleDelay(seconds(10), () => {
                completed = true;
                timeoutHandle.cancel();
                reject(this.createError(ErrorCodes.BRANCH_PLAY_FAILURE,
                    "Timed out waiting for the player to be repositioned and ASE to be stopped",
                    EventTypeEnum.BRANCHING_PLAY_TIMEDOUT,
                    { id: segmentId, stopped: aseStopped, repositioned, completed }
                ));
            });

            this.player.seek(seekTarget, streamState.SEGMENT_CHANGED);
        });
    }

    /**
     * Seeks directly to a segment's start time.
     * @private
     */
    seekToSegment(segmentId) {
        const segment = this.segments.get(segmentId);
        if (!segment) {
            return Promise.reject(
                this.createError(ErrorCodes.BRANCH_PLAY_FAILURE, "Unable to find the separated segment",
                    EventTypeEnum.SEGMENT_NOT_FOUND, { id: segmentId })
            );
        }

        return new Promise((resolve, reject) => {
            try {
                this.player.seek(segment.startTimeMs, streamState.SEEK);
                resolve();
            } catch (e) {
                reject(this.createError(ErrorCodes.BRANCH_PLAY_FAILURE, "Seek threw an exception",
                    EventTypeEnum.BRANCHING_SEEK_THREW, { id: segment.id, error: e }));
            }
        });
    }

    /**
     * Queues the next segment via ASE, or falls back to delayed seek.
     * @private
     */
    queueNextSegment(segmentId) {
        const session = this.playerState.streamingSession;
        if (!session?.isDeviceMonitored) {
            return Promise.reject(
                this.createError(ErrorCodes.BRANCH_QUEUE_FAILURE, "ASE session manager is not yet initialized",
                    EventTypeEnum.BRANCHING_ASE_UNINITIALIZED, { id: segmentId })
            );
        }

        this.playerState.fireEvent(PlayerEvents.SEGMENT_TRANSITION, {
            Li: this.currentSegment?.id,
            s2: segmentId,
        });

        if (session.mpa(segmentId, true)) {
            return Promise.resolve();
        }

        this.log.error("queueNextSegment: ASE chooseNextSegment failed - falling back to a delayed seek",
            { segment: segmentId });
        return this.scheduleDelayedSeek(segmentId);
    }

    /**
     * @deprecated Use queueNextSegment instead
     * @private
     */
    queueSeparatedSegment(segmentId) {
        this.log.error("calls to queueSeparatedSegment are deprecated", {
            segment: segmentId,
            mid: this.playerState.R,
            srcsegment: this.getCurrentStreamId(),
        });
        return this.scheduleDelayedSeek(segmentId);
    }

    /**
     * Schedules a delayed seek near the end of the current segment.
     * @private
     */
    scheduleDelayedSeek(segmentId) {
        if (this.queuedSegment) {
            return Promise.reject(
                this.createError(ErrorCodes.BRANCH_QUEUE_FAILURE,
                    "Unable to queue segment - already queued for delayed seek",
                    EventTypeEnum.BRANCHING_SEGMENT_ALREADYQUEUED, {
                        currentSegment: this.currentSegment?.id,
                        queuedSegment: this.queuedSegment.id,
                        failedSegment: segmentId,
                    })
            );
        }

        if (!this.currentSegment) {
            return Promise.reject(
                this.createError(ErrorCodes.BRANCH_QUEUE_FAILURE,
                    "Unable to queue - no currently playing segment",
                    EventTypeEnum.BRANCHING_CURRENT_SEGMENT_UNINITIALIZED, { nextSegmentid: segmentId })
            );
        }

        const targetSegment = this.segments.get(segmentId);
        if (!targetSegment) {
            return Promise.reject(
                this.createError(ErrorCodes.BRANCH_QUEUE_FAILURE, "Unable to find the separated segment",
                    EventTypeEnum.SEGMENT_NOT_FOUND, {
                        nextSegmentid: segmentId,
                        currentSegmentId: this.currentSegment.id,
                    })
            );
        }

        this.queuedSegment = {
            id: segmentId,
            promise: new Promise((resolve, reject) => {
                this.delayedSeekHandle = this.momentObserver.internal_Uvb(
                    { $Cb: () => ellaSendRateMultiplier(100) },
                    () => this.player.null() || 0
                );

                const seekPts = this.getPresentingBranchEndPts() -
                    this.configFn().minimumTimeBeforeDelayedSeekToQueuedSegment;

                this.delayedSeekHandle.observe(seekPts, () => {
                    this.queuedSegment = undefined;
                    this.cancelDelayedSeek();
                    this.seekToSegment(targetSegment.id).then(resolve).catch(reject);
                });
            }),
        };

        this.queuedSegment.promise.catch((error) => {
            this.playerState.fireError(error.code, error);
        });

        return Promise.resolve();
    }

    /**
     * Creates a typed segment error with logging.
     * @private
     */
    createError(code, message, eventType, data) {
        this.log.RETRY(message, data);
        return new BranchingSegmentError(code, message, eventType, data);
    }
}
