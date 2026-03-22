/**
 * Netflix Cadmium Player - Presentation Delay Controller
 * Component: ASEJS_PRESENTATION_DELAY_CONTROLLER
 *
 * Controls the target presentation delay (latency) for live streams.
 * Uses a state machine to decide when to INCREASE, DECREASE, or
 * MAINTAIN the presentation delay based on buffer health, QoE signals,
 * and platform capabilities. Communicates with the platform's
 * presentation delay API to apply changes.
 */

// Dependencies
// import { __assign } from 'tslib';                                // webpack 22970
// import { platform } from './Platform';                            // webpack 66164
// import { ObservableState, Algorithm, timerCondition, orCondition, transitionStateMachine } from './TimeUtil'; // webpack 91176
// import { DISABLED } from './DisabledState';                       // webpack 97685
// import { debugEnabled } from './Debug';                            // webpack 48170
// import { presentationDelayStateDef } from './PresentationDelayState'; // webpack 23093
// import { presentationDelayTransitions } from './PresentationDelayTransitions'; // webpack 19250

// ---------------------------------------------------------------------------
// Condition predicates — each receives (previousState, currentState, config)
// ---------------------------------------------------------------------------

/**
 * Returns true when the state has been initialized (aua flag set).
 * @param {Object} _prev
 * @param {Object} current
 * @returns {boolean}
 */
function isInitialized(_prev, current) {
    return current.isInitialized;
}

/**
 * Returns true when the platform transitioned from estimating to
 * having a confirmed presentation delay.
 * @param {Object} prev
 * @param {Object} current
 * @returns {boolean}
 */
function platformConfirmedDelay(prev, current) {
    return prev.hasPlatformEstimate && !current.hasPlatformEstimate;
}

/**
 * Returns true when the target presentation delay overshot below
 * the current position (needs increase).
 * @param {Object} _prev
 * @param {Object} state
 * @param {Object} config
 * @returns {boolean}
 */
function isOvershotBelow(_prev, state, config) {
    const target = state.targetPresentationDelayMs;
    const current = state.currentPresentationDelayMs;
    const tolerance = config.targetPresentationDelayToleranceMs;
    return state.isActive && target < current - tolerance;
}

/**
 * Returns true when the target presentation delay overshot above
 * the current position (needs decrease).
 * @param {Object} _prev
 * @param {Object} state
 * @param {Object} config
 * @returns {boolean}
 */
function isOvershotAbove(_prev, state, config) {
    const target = state.targetPresentationDelayMs;
    const current = state.currentPresentationDelayMs;
    const tolerance = config.targetPresentationDelayToleranceMs;
    return state.isActive && target > current + tolerance;
}

/**
 * Returns true when the adjustment has reached its target (within tolerance).
 * @param {Object} _prev
 * @param {Object} state
 * @param {Object} config
 * @returns {boolean}
 */
function hasReachedTarget(_prev, state, config) {
    const target = state.targetPresentationDelayMs;
    const adjustment = state.adjustmentDirection;
    const current = state.currentPresentationDelayMs;
    const tolerance = config.targetPresentationDelayToleranceMs;

    if (!state.isActive) return false;

    if (adjustment === "DECREASING" && target <= current) return true;
    if (adjustment === "INCREASING" && target >= current) return true;
    if (adjustment === "NONE" && Math.abs(target - current) <= tolerance) return true;

    return false;
}

/**
 * Returns true when the QoE lock count has increased (a new negative
 * QoE signal was received before the lock period expired).
 * @param {Object} prev
 * @param {Object} current
 * @returns {boolean}
 */
function qoeLockCountIncreased(prev, current) {
    return prev.qoeLockCount > 0 && prev.qoeLockCount < current.qoeLockCount;
}

/**
 * Returns true when the platform transitioned from not estimating
 * to estimating the delay.
 * @param {Object} prev
 * @param {Object} current
 * @returns {boolean}
 */
function platformStartedEstimating(prev, current) {
    return !prev.hasPlatformEstimate && current.hasPlatformEstimate;
}

/**
 * Returns true when playback transitioned from stopped to playing.
 * @param {Object} prev
 * @param {Object} current
 * @returns {boolean}
 */
function playbackStarted(prev, current) {
    return !prev.isCurrentlyPlaying && current.isCurrentlyPlaying;
}

/**
 * Returns true when intent transitioned from present to absent.
 * @param {Object} prev
 * @param {Object} current
 * @returns {boolean}
 */
function intentRemoved(prev, current) {
    return prev.hasLiveIntent && !current.hasLiveIntent;
}

/**
 * Returns true when intent transitioned from absent to present.
 * @param {Object} prev
 * @param {Object} current
 * @returns {boolean}
 */
function intentAdded(prev, current) {
    return !prev.hasLiveIntent && current.hasLiveIntent;
}

/**
 * @class PresentationDelayController
 *
 * Uses an Algorithm (state-machine with condition/action pairs) to
 * manage the target presentation delay for live playback. Actions
 * request delay changes from the platform and transition the internal
 * adjustment state machine (INCREASING / DECREASING / MAINTAINING / DISABLED).
 */
export class PresentationDelayController {
    /**
     * @param {Object} manifestSession - Manifest session with platform delay API
     * @param {Object} config - Presentation delay configuration
     * @param {number} config.minimumPresentationDelayMs - Floor for the delay
     * @param {number} config.targetPresentationDelayToleranceMs - Tolerance band
     * @param {number} config.presentationDelayQoeLockPeriodMs - QoE lock period
     */
    constructor(manifestSession, config) {
        /** @type {Object} */
        this.manifestSession = manifestSession;

        /** @type {Object} */
        this.config = config;

        this.console = new platform.Console("ASEJS_PRESENTATION_DELAY_CONTROLLER", "asejs");

        /** @type {ObservableState} Reactive state container */
        this.state = new ObservableState({
            model: presentationDelayStateDef,
        });

        // -- Action callbacks (bound to this instance) ----------------------

        /**
         * Requests an INCREASE to the presentation delay.
         * @private
         */
        this._requestIncrease = (stateSnapshot, reason) => {
            const currentDelay = stateSnapshot.currentPresentationDelayMs;
            const target = stateSnapshot.targetPresentationDelayMs;

            if (this.state.value.increaseBlocked) return;

            const response = this.manifestSession.requestDelayChange({
                type: "INCREASE",
                currentPresentationDelayMs: currentDelay,
            });

            if (debugEnabled) {
                this._logDelayRequest({ reason, request: "INCREASE", currentPresentationDelayMs: currentDelay, targetPresentationDelayMs: target, response });
            }

            const approved = this._handlePlatformResponse(response);
            return { adjustmentDirection: this._transitionAdjustment(approved ? "INCREASE" : "DISABLE") };
        };

        /**
         * Requests a DECREASE to the presentation delay.
         * @private
         */
        this._requestDecrease = (stateSnapshot, reason) => {
            const currentDelay = stateSnapshot.currentPresentationDelayMs;
            const target = stateSnapshot.targetPresentationDelayMs;

            if (this.state.value.decreaseBlocked || !this.state.value.hasPlatformEstimate) return;

            const response = this.manifestSession.requestDelayChange({
                type: "DECREASE",
                currentPresentationDelayMs: currentDelay,
            });

            if (debugEnabled) {
                this._logDelayRequest({ reason, request: "DECREASE", currentPresentationDelayMs: currentDelay, targetPresentationDelayMs: target, response });
            }

            const approved = this._handlePlatformResponse(response);
            return { adjustmentDirection: this._transitionAdjustment(approved ? "DECREASE" : "DISABLE") };
        };

        /**
         * Requests a MAINTAIN (hold at current delay).
         * @private
         */
        this._requestMaintain = (stateSnapshot, reason) => {
            const currentDelay = stateSnapshot.currentPresentationDelayMs;
            const target = stateSnapshot.targetPresentationDelayMs;

            if (this.state.value.maintainBlocked) return;

            const response = this.manifestSession.requestDelayChange({
                type: "MAINTAIN",
                currentPresentationDelayMs: currentDelay,
            });

            if (debugEnabled) {
                this._logDelayRequest({ reason, request: "MAINTAIN", currentPresentationDelayMs: currentDelay, targetPresentationDelayMs: target, response });
            }

            const approved = this._handlePlatformResponse(response);
            return { adjustmentDirection: this._transitionAdjustment(approved ? "MAINTAIN" : "DISABLE") };
        };

        /**
         * Handles platform response (APPROVED or rejected).
         * @private
         * @param {Object} response
         * @returns {boolean} Whether the request was approved
         */
        this._handlePlatformResponse = (response) => {
            if (response.status === "APPROVED") {
                if (debugEnabled) this.console.log("The platform approved the request");
                return true;
            }

            if (debugEnabled) {
                this.console.log(`The platform rejected the request with reason "${response.reason}"`);
            }

            switch (response.reason) {
                case "NOT_SUPPORTED":
                    return false;
                case "TARGET_ACHIEVED":
                    return true;
                case "NO_LIVE_INTENT":
                    if (debugEnabled && this.state.value.hasLiveIntent) {
                        this.console.RETRY("Request requested due to NO_LIVE_INTENT, but ASE has intent");
                    }
                    return true;
                default:
                    if (debugEnabled) {
                        throw new Error(`Unexpected rejection: ${response.reason}`);
                    }
                    return false;
            }
        };

        /**
         * Sets the target to the configured minimum delay.
         * @private
         */
        this._setMinimumTarget = (_state, reason) => {
            if (this.state.value.currentPresentationDelayMs !== this.config.minimumPresentationDelayMs) {
                if (debugEnabled) {
                    this.console.log(
                        `Setting target to configured minimum at ${this.config.minimumPresentationDelayMs}ms due to "${reason}"`
                    );
                }
                return { adjustmentDirection: { targetDelayMs: this.config.minimumPresentationDelayMs } };
            }
        };

        /**
         * Unsets the target (revert to default).
         * @private
         */
        this._unsetTarget = (_state, reason) => {
            if (debugEnabled) {
                this.console.log(`Unsetting target due to "${reason}"`);
            }
            return { adjustmentDirection: { targetDelayMs: -1 } };
        };

        /**
         * Halts a decrease and freezes at the current position.
         * @private
         */
        this._haltDecrease = (_state, reason) => {
            if (this.state.value.decreaseBlocked) {
                if (debugEnabled) {
                    this.console.log(
                        `Halting decrease to ${this.state.value.currentPresentationDelayMs}ms due to "${reason}". ` +
                        `Setting new target to ${this.state.value.targetPresentationDelayMs}ms.`
                    );
                }
                return {
                    adjustmentDirection: { targetDelayMs: this.state.value.targetPresentationDelayMs },
                };
            }
        };

        /**
         * Resets QoE to acceptable after the lock period expires.
         * @private
         */
        this._resetQoeLock = (_state, reason) => {
            if (debugEnabled) {
                this.console.log(
                    `No negative QoE signals have been received for ${this.config.presentationDelayQoeLockPeriodMs}ms, ` +
                    `setting QoE to "acceptable" due to "${reason}"`
                );
            }
            return { adjustmentDirection: { qoeLockCount: 0 } };
        };

        // Bind public API methods
        this.notifyPlaybackReady = this.notifyPlaybackReady.bind(this);
        this.updateTargetDelay = this.updateTargetDelay.bind(this);
        this.updateCurrentDelay = this.updateCurrentDelay.bind(this);
        this.reportNegativeQoE = this.reportNegativeQoE.bind(this);
        this.dispose = this.dispose.bind(this);

        // -- Build the state machine algorithm ------------------------------

        /** @type {Algorithm} */
        this.algorithm = new Algorithm(
            [
                [isInitialized, () => ({ initialized: true })],
                [
                    orCondition([intentAdded, playbackStarted], intentRemoved),
                    this._setMinimumTarget,
                ],
                [
                    orCondition([intentRemoved, playbackStarted], intentAdded),
                    this._unsetTarget,
                ],
                [
                    timerCondition(
                        this.config.presentationDelayQoeLockPeriodMs,
                        this.manifestSession.forceEstRelativeLiveBookmark
                    ),
                    this._resetQoeLock,
                ],
                [platformStartedEstimating, this._setMinimumTarget],
                [qoeLockCountIncreased, this._haltDecrease],
                [platformConfirmedDelay, this._requestMaintain],
                [hasReachedTarget, this._requestMaintain],
                [isOvershotAbove, this._requestDecrease],
                [isOvershotBelow, this._requestIncrease],
            ],
            {
                store: this.state,
                getExtraArgs: () => [this.config],
            }
        );
    }

    // -- Public API ---------------------------------------------------------

    /**
     * Called when playback is ready — updates the playback-ready flag.
     * @param {boolean} isReady
     */
    notifyPlaybackReady(isReady) {
        this._updateState({ isPlaybackReady: isReady });
    }

    /**
     * Updates the target presentation delay.
     * @param {number} targetMs
     */
    updateTargetDelay(targetMs) {
        this._updateState({ targetPresentationDelayMs: targetMs });
    }

    /**
     * Reports a negative QoE signal (e.g., rebuffer, stall).
     */
    reportNegativeQoE() {
        this._updateState({ qoeLockCount: this.state.value.qoeLockCount + 1 });
    }

    /**
     * Updates the current measured presentation delay.
     * @param {number} currentDelayMs
     */
    updateCurrentDelay(currentDelayMs) {
        this._updateState({ currentDelayMs });
    }

    /**
     * Disposes of the algorithm and resets state.
     */
    dispose() {
        this.algorithm.dispose();
        if (!this.state.value.isInitialized) {
            this.state.dispose();
        }
    }

    // -- Private methods ----------------------------------------------------

    /**
     * Transitions the adjustment state machine.
     * @private
     * @param {string} event - "INCREASE", "DECREASE", "MAINTAIN", or "DISABLE"
     * @returns {Object} New adjustment direction state
     */
    _transitionAdjustment(event) {
        const result = transitionStateMachine(
            presentationDelayTransitions,
            this.state.value.adjustmentDirection,
            event
        );

        if (debugEnabled && result.transitioned) {
            this.console.log(
                `Transitioned from "${result.fromState}" to "${result.toState}" due to event "${result.event}"`
            );
        }

        return { direction: result.toState };
    }

    /**
     * Updates the observable state.
     * @private
     * @param {Object} patch
     */
    _updateState(patch) {
        this.state.next({ ...patch });
    }

    /**
     * Logs a presentation delay change request for diagnostics.
     * @private
     */
    _logDelayRequest({ reason, request, currentPresentationDelayMs, targetPresentationDelayMs, response }) {
        let message =
            request === "MAINTAIN"
                ? `Requesting ${request}${currentPresentationDelayMs !== -1 ? ` at ${currentPresentationDelayMs}ms` : ""}`
                : `Requesting ${request} from ${targetPresentationDelayMs}ms to ${currentPresentationDelayMs}ms`;

        message += ` due to "${reason}"`;

        if (DISABLED.laser.isEnabled) {
            DISABLED.laser.log({
                playgraphId: this.manifestSession.getPlaygraphId(),
                type: "PRESENTATION_DELAY_CHANGE_REQUEST",
                actioned: response.status === "APPROVED",
                reason,
                action: request,
                source: "AUTOMATIC",
                targetPresentationDelayMs: currentPresentationDelayMs,
            });
        }

        this.console.log(message);
    }
}
