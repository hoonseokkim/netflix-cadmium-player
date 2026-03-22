/**
 * Netflix Cadmium Player - Graph Streaming Process (Request Scheduler)
 * Component: EventBusClass
 *
 * Evaluates which media streamables (audio, video, text tracks) should
 * issue download requests, based on priority, concurrency limits, and
 * buffering state. Acts as the central scheduling decision-maker in the
 * streaming pipeline.
 */

// Dependencies
// import { __values, __decorate } from 'tslib';              // webpack 22970
// import { maxByComparator, removeSingle } from './TimeUtil'; // webpack 91176
// import { platform } from './Platform';                      // webpack 66164
// import { isBufferingState, resolveBlocking } from './StreamableUtils'; // webpack 57141
// import { timeSlice, MediaType } from './Constants';         // webpack 65161
// import { SessionMetricsClass, consoleLogger } from './SessionMetrics'; // webpack 61996
// import { computePriority, getStreamableState } from './StreamablePriority'; // webpack 62629

/**
 * Returns the furthest buffered position among streamables sharing the
 * same group as the given streamable.
 *
 * @param {Array<Object>} streamables - All candidate streamables
 * @param {Object} streamable - The reference streamable
 * @returns {number} The furthest buffered position in the group
 */
function getFurthestGroupPosition(streamables, streamable) {
    return streamables
        .filter((s) => s.groupId === streamable.groupId)
        .reduce(maxByComparator((s) => s.bufferedEndMs), streamable)
        .bufferedEndMs;
}

/**
 * @class GraphStreamingProcess
 *
 * On each "request opportunity" callback, this class evaluates the set
 * of eligible streamables, sorts them by priority, checks concurrency
 * windows, and returns whether a request should be issued (and for
 * which streamable).
 */
export class GraphStreamingProcess {
    /**
     * @param {Console} console - Logger instance
     * @param {Object} config - Scheduling configuration
     * @param {number} config.minStreamableConcurrencyWindow - Min concurrency window (ms)
     * @param {number} config.maxStreamableConcurrencyWindow - Max concurrency window (ms)
     * @param {number} config.streamableConcurrencyFactor - Factor for dynamic window
     * @param {number} [config.bufferingConcurrencyWindow] - Special window during buffering
     */
    constructor(console, config) {
        /** @type {Console} */
        this.console = console;

        /** @type {Object} */
        this.config = config;

        /** @private @type {number} Timestamp of last successful request */
        this._lastSuccessfulRequestMs = 0;

        /** @type {SessionMetricsClass} */
        this._diagnostics = new SessionMetricsClass({
            maxEntries: 10,
            engine: this,
            source: "GraphStreamingProcess",
        });
    }

    /**
     * Partitions streamables into those that are currently available
     * (ready to download) vs. those that are waiting.
     *
     * @param {Array<Object>} streamables
     * @returns {Object} { availableStreamables, waitingCount, nextAvailableTime, reason }
     */
    partitionByAvailability(streamables) {
        const result = {
            availableStreamables: [],
            waitingCount: 0,
            nextAvailableTime: -Infinity,
            reason: "available",
        };

        const available = [];
        let nextWaiting;

        for (const streamable of streamables) {
            if (streamable.availableAtMs <= platform.now()) {
                available.push(streamable);
            } else {
                result.waitingCount++;
                if (!nextWaiting || streamable.availableAtMs < nextWaiting.availableAtMs) {
                    nextWaiting = streamable;
                }
            }
        }

        if (nextWaiting) {
            result.nextAvailableTime = nextWaiting.availableAtMs;
            if (available.length === 0) {
                assert(
                    nextWaiting.availabilityReason !== "available",
                    "next available streamable cannot be available"
                );
                result.reason = nextWaiting.availabilityReason;
            }
        }

        result.availableStreamables = available;
        return result;
    }

    /**
     * Main scheduling entry point. Evaluates all eligible streamables,
     * determines which (if any) should issue a download request.
     *
     * @param {Object} requestContext - Context about the current request opportunity
     * @param {Array<Object>} eligibleStreamables - Streamables that could request
     * @returns {Object} { shouldRequest: boolean, reason: string }
     */
    onRequestOpportunity(requestContext, eligibleStreamables) {
        const result = {
            shouldRequest: false,
            reason: "noEligibleStreamables",
        };

        const diagnosticReasons = [];

        if (eligibleStreamables.length === 0) {
            this._emitDiagnostics(eligibleStreamables, diagnosticReasons);
            return result;
        }

        const prioritized = this._sortByPriority(eligibleStreamables);
        const isAnyBuffering = prioritized.some(
            (s) => getStreamableState(s) === 1 && timeSlice(s.bufferingState)
        );

        const candidates = prioritized.slice();
        const mediaTypeBlocking = [false, false, false, false];
        let blockingGroupId;

        for (const streamable of prioritized) {
            // Skip streamables in a blocked group (e.g., waiting for header)
            if (streamable.isLastSegment && (!blockingGroupId || streamable.groupId === blockingGroupId)) {
                if (streamable.isLastSegment) {
                    blockingGroupId = streamable.groupId;
                }
                continue;
            }

            if (mediaTypeBlocking[streamable.mediaType] === "global") {
                continue;
            }

            // Check if the streamable is eligible for a request
            const eligibility = streamable.checkEligibility(
                requestContext,
                streamable.concurrencyLimit ?? 1
            );

            const blockingReason = resolveBlocking(eligibility.reason);
            if (blockingReason) {
                mediaTypeBlocking[streamable.mediaType] = blockingReason;
                removeSingle(candidates, streamable);
            }

            if (eligibility.canRequest) {
                const furthestPosition = getFurthestGroupPosition(candidates, streamable);

                if (this._checkConcurrency(streamable, isAnyBuffering, furthestPosition)) {
                    const requestResult = streamable.issueRequest();
                    this._recordDiagnostic(diagnosticReasons, streamable, requestResult.reason);

                    if (requestResult.issued) {
                        this._lastSuccessfulRequestMs = platform.now();
                    }

                    if (requestResult.issued) {
                        result.shouldRequest = true;
                        result.reason = "success";
                        break;
                    }

                    if (
                        requestResult.reason === "globalVideoMemoryLimit" ||
                        requestResult.reason === "globalAudioMemoryLimit"
                    ) {
                        this.console.pauseTrace(
                            `GSP.onRequestOpportunity stopping at memory limit: ${requestResult.reason}`
                        );
                        break;
                    }

                    if (requestResult.reason === "pipelineTryIssueHeaderRequest") {
                        blockingGroupId = streamable.groupId;
                        this.console.pauseTrace(
                            "GSP.onRequestOpportunity stopping due to blocking header"
                        );
                    }
                } else {
                    this._recordDiagnostic(diagnosticReasons, streamable, "concurrencyCheck");
                    if (!blockingReason) break;
                }
            } else {
                this._recordDiagnostic(diagnosticReasons, streamable, eligibility.reason);
            }
        }

        this._emitDiagnostics(eligibleStreamables, diagnosticReasons);
        return result;
    }

    // -- Private methods ----------------------------------------------------

    /**
     * Sorts streamables by computed priority (highest first).
     * @private
     * @param {Array<Object>} streamables
     * @returns {Array<Object>}
     */
    _sortByPriority(streamables) {
        return this._computePriorities(streamables)
            .sort((a, b) => a.priority - b.priority)
            .map((entry) => entry.streamable);
    }

    /**
     * Computes a priority score for each streamable.
     * @private
     * @param {Array<Object>} streamables
     * @returns {Array<{ priority: number, streamable: Object }>}
     */
    _computePriorities(streamables) {
        return streamables.map((streamable) => ({
            priority: -computePriority(this.config, streamable, this.console),
            streamable,
        }));
    }

    /**
     * Records a diagnostic reason for a streamable's scheduling decision.
     * @private
     */
    _recordDiagnostic(reasons, streamable, reason) {
        if (this._diagnostics.isEnabled) {
            reasons.push(this._buildDiagnosticEntry(reason, streamable));
        }
    }

    /**
     * Builds a diagnostic entry for logging.
     * @private
     */
    _buildDiagnosticEntry(reason, streamable) {
        return {
            mediaType: streamable.mediaType,
            reason,
            bufferingState: streamable.bufferingState,
            currentPlayerMs: streamable.currentPlayerMs,
            bufferedEndMs: streamable.bufferedEndMs,
            streamingPlayerMs: streamable.streamingPlayerMs,
        };
    }

    /**
     * Checks whether the streamable passes concurrency checks.
     * Delegates to either the buffering or normal concurrency check
     * depending on current state.
     *
     * @private
     * @param {Object} streamable
     * @param {boolean} isAnyBuffering - Whether any streamable is buffering
     * @param {number} furthestGroupPosition - Furthest position in the group
     * @returns {boolean}
     */
    _checkConcurrency(streamable, isAnyBuffering, furthestGroupPosition) {
        if (this.config.bufferingConcurrencyWindow && (isAnyBuffering || timeSlice(streamable.bufferingState))) {
            return this._checkBufferingConcurrency(streamable, furthestGroupPosition);
        }
        return this._checkNormalConcurrency(streamable, furthestGroupPosition);
    }

    /**
     * Checks whether the streamable has not buffered beyond its capacity.
     * @private
     * @param {Object} streamable
     * @returns {boolean}
     */
    _isWithinBufferCapacity(streamable) {
        return streamable.streamingPlayerMs <= streamable.bufferedEndMs;
    }

    /**
     * Normal concurrency check using a dynamic window based on the
     * buffer depth and configured min/max/factor.
     *
     * @private
     * @param {Object} streamable
     * @param {number} furthestGroupPosition
     * @returns {boolean}
     */
    _checkNormalConcurrency(streamable, furthestGroupPosition) {
        const referencePoint =
            streamable.currentPlayerMs > furthestGroupPosition
                ? streamable.currentPlayerMs
                : furthestGroupPosition;

        const dynamicWindow = Math.max(
            this.config.minStreamableConcurrencyWindow,
            Math.min(
                (streamable.bufferedEndMs - streamable.currentPlayerMs) *
                    this.config.streamableConcurrencyFactor,
                this.config.maxStreamableConcurrencyWindow
            )
        );

        return streamable.streamingPlayerMs - referencePoint <= dynamicWindow;
    }

    /**
     * Buffering concurrency check using a fixed window.
     * @private
     * @param {Object} streamable
     * @param {number} furthestGroupPosition
     * @returns {boolean}
     */
    _checkBufferingConcurrency(streamable, furthestGroupPosition) {
        if (this.config.bufferingConcurrencyWindow === undefined) return true;

        const window = this.config.bufferingConcurrencyWindow;
        const upperBound = streamable.currentPlayerMs + window;

        if (streamable.streamingPlayerMs <= upperBound) return true;

        return (
            this._isWithinBufferCapacity(streamable) &&
            furthestGroupPosition >= upperBound &&
            streamable.streamingPlayerMs - furthestGroupPosition < window
        );
    }

    /**
     * Emits diagnostic data about scheduling decisions.
     * @private
     */
    _emitDiagnostics(streamables, reasons) {
        this._diagnostics.emitDiagnosticEvent({
            streamableCount: streamables.length,
            streamableReasons: reasons,
            lastSuccessfulRequestMs: this._lastSuccessfulRequestMs,
        });
    }
}
