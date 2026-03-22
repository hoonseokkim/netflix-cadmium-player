/**
 * Netflix Cadmium Player - Buffering Progress Tracker
 *
 * Computes and emits a synthetic "progress" value (0..1) representing how far
 * along the player is during the buffering/loading phase. The progress is
 * time-based and accounts for stalls, visibility changes, and AV/text
 * buffering state transitions. Updates are polled at 100ms intervals during
 * active buffering and on-demand otherwise.
 *
 * @module BufferingProgressTracker
 * @original Module_39480
 */

// import { listenerPriority } from '../events/ListenerPriority';
// import { config } from '../core/PlayerConfig';
// import { now } from '../timing/Clock';
// import { clamp } from '../utils/MathUtils';
// import { document as doc } from '../utils/PlatformGlobals';
// import { scheduleAsync } from '../utils/Scheduler';
// import { isFiniteNumber } from '../utils/TypeChecks';
// import { PlayerState, PresentingState, PlaygraphState } from '../types/PlayerEnums';

/**
 * Installs the buffering progress tracker on a player session.
 *
 * Monitors the player's loading and presenting states to compute a progress
 * value that smoothly transitions from 0 to 1 during buffering. Handles
 * edge cases like stalls (instant progress jump) and backwards progress
 * (grace period before accepting a regression).
 *
 * @param {Object} session - The player session object with observable state
 * @param {Object} session.currentRequestedTime - Observable holding the current progress info
 * @param {Object} session.state - Observable for player state (LOADING, NORMAL, etc.)
 * @param {Object} session.presentingState - Observable for presenting state (WAITING, PAUSED, etc.)
 * @param {Object} session.playgraphState - Observable for playgraph state (STALLED, etc.)
 * @param {Object} session.avBufferingState - Observable for A/V buffering state
 * @param {Object} session.textBufferingState - Observable for text buffering state
 */
export function installBufferingProgressTracker(session) {
    const progressObservable = session.currentRequestedTime;
    let lastPresentingChangeTime = 0;
    let bufferingStartTime;
    let minBufferingEndTime;
    let progressBackwardsTimestamp;
    let pollIntervalId;

    /**
     * Whether the player is in a state that warrants active polling.
     * @returns {boolean}
     */
    function isActivelyBuffering() {
        return (
            session.state.value === PlayerState.LOADING ||
            (session.state.value === PlayerState.NORMAL &&
                session.presentingState.value === PresentingState.WAITING)
        );
    }

    /**
     * Starts or stops the 100ms polling interval based on buffering activity.
     */
    function updatePolling() {
        if (isActivelyBuffering()) {
            if (!pollIntervalId) {
                pollIntervalId = setInterval(computeProgress, 100);
            }
        } else if (pollIntervalId) {
            clearInterval(pollIntervalId);
            pollIntervalId = undefined;
            scheduleAsync(computeProgress);
        }
    }

    /**
     * Recomputes the buffering progress and updates the observable if changed.
     */
    function computeProgress() {
        const currentTime = now();
        const previousValue = progressObservable.value;
        const previousProgress = previousValue ? previousValue.progress : 0;

        const shouldShowProgress =
            session.state.value === PlayerState.LOADING ||
            (isActivelyBuffering() &&
                currentTime - lastPresentingChangeTime > config.internalBufferingTimeout);

        let progress;
        let isStalled = false;
        let isProgressRollback = false;

        if (shouldShowProgress && session.state.value === PlayerState.NORMAL) {
            if (session.playgraphState.value === PlaygraphState.STALLED) {
                progress = previousProgress;
                isStalled = true;
            } else {
                let elapsed = currentTime;
                bufferingStartTime = bufferingStartTime || currentTime;
                minBufferingEndTime =
                    minBufferingEndTime ||
                    bufferingStartTime + config.minBufferingTimeInMilliseconds + 1;

                if (isFiniteNumber(elapsed)) {
                    elapsed = Math.max(elapsed, minBufferingEndTime);
                    progress =
                        (1000 *
                            clamp(
                                (currentTime - bufferingStartTime) /
                                    (elapsed - bufferingStartTime),
                                0,
                                0.99
                            )) /
                        1000;
                }
            }

            // Handle backwards progress (can happen if estimates change)
            if (progress < previousProgress) {
                if (previousProgress - progress < config.progressBackwardsMinPercent / 100) {
                    progress = previousProgress;
                    progressBackwardsTimestamp = undefined;
                } else if (progressBackwardsTimestamp) {
                    if (
                        currentTime - progressBackwardsTimestamp >
                        config.progressBackwardsGraceTimeMilliseconds
                    ) {
                        isProgressRollback = true;
                        progressBackwardsTimestamp = undefined;
                    } else {
                        progress = previousProgress;
                    }
                } else {
                    progressBackwardsTimestamp = currentTime;
                    progress = previousProgress;
                }
            }
        } else {
            // Reset buffering tracking when not showing progress
            progressBackwardsTimestamp = undefined;
            minBufferingEndTime = undefined;
            bufferingStartTime = undefined;
        }

        const newValue = shouldShowProgress
            ? {
                  endedEvent: isStalled,
                  progress,
                  progressRollback: isProgressRollback,
              }
            : null;

        // Only update if there is a meaningful change
        const shouldUpdate =
            !newValue ||
            !progressObservable ||
            !previousValue ||
            (isFiniteNumber(newValue.progress) && !isFiniteNumber(previousValue.progress)) ||
            (isFiniteNumber(newValue.progress) &&
                isFiniteNumber(previousValue.progress) &&
                Math.abs(newValue.progress - previousValue.progress) > 0.01) ||
            newValue.endedEvent !== previousValue.endedEvent;

        if (shouldUpdate) {
            progressObservable.set(newValue);
        }
    }

    // Subscribe to state changes
    session.state.addListener(() => {
        updatePolling();
        computeProgress();
    }, ListenerPriority.HIGH);

    session.presentingState.addListener((change) => {
        if (
            change.oldValue !== PresentingState.WAITING ||
            change.newValue !== PresentingState.WAITING
        ) {
            lastPresentingChangeTime = now();
        }
        updatePolling();
    });

    session.playgraphState.addListener(() => updatePolling());
    session.avBufferingState.addListener(() => updatePolling());
    session.textBufferingState.addListener(() => updatePolling());

    // Start initial polling
    if (!pollIntervalId) {
        pollIntervalId = setInterval(computeProgress, 100);
    }
}

export default { installBufferingProgressTracker };
