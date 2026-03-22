/**
 * Netflix Cadmium Player - Pause Timeout Monitor
 *
 * Monitors player inactivity and fires timeout events when the player
 * has been paused or inactive for too long. Implements two mechanisms:
 *
 * 1. **Pause timeout**: A disposable timer that fires after
 *    `pauseTimeoutLimitMilliseconds` while the player is paused or ended.
 * 2. **Inactivity monitor**: A periodic check (at `inactivityMonitorInterval`)
 *    that detects wall-clock gaps (e.g., laptop sleep) exceeding the
 *    pause timeout and fires an inactivity timeout event.
 *
 * @module PauseTimeoutMonitor
 * @original Module_42654
 */

// import { config } from '../core/PlayerConfig';
// import { now } from '../timing/Clock';
// import { FatalErrorCode } from '../core/ErrorCodeEnums';
// import { PeriodicTimer } from '../utils/PeriodicTimer';
// import { Math.max as maxOf } from '../utils/PlatformGlobals';
// import { isDefined } from '../utils/TypeChecks';
// import { PlayerState, PresentingState, PlayerEvents } from '../types/PlayerEnums';
// import { DisposableTimer } from '../utils/DisposableTimer';
// import { TimerFactory } from '../timing/TimerFactory';

/**
 * Installs the pause timeout monitor on a player session.
 *
 * @param {Object} session - The player session object
 * @param {Function} session.PRE_FETCH - Returns true if this is a pre-fetch session (skips monitoring)
 * @param {Object} session.presentingState - Observable for the current presenting state
 * @param {Object} session.state - Observable for the current player state
 * @param {Function} session.fireEvent - Fires a player event
 * @param {Function} session.addEventListener - Registers an event listener
 * @param {number} [session.maxWallClockGap] - Tracks the maximum wall-clock gap detected
 */
export function installPauseTimeoutMonitor(session) {
    const timeoutLimit = config.pauseTimeoutLimitMilliseconds;

    if (session.PRE_FETCH() || !timeoutLimit) {
        return;
    }

    /**
     * Updates the timer state based on current player/presenting state.
     * Resets the timer when paused/ended; stops it otherwise.
     */
    function onStateChanged() {
        if (
            session.state.value !== PlayerState.NORMAL ||
            (session.presentingState.value !== PresentingState.PAUSED &&
                session.presentingState.value !== PresentingState.ENDED)
        ) {
            pauseTimer.cancel();
        } else {
            pauseTimer.restart();
        }
    }

    // Create the main pause timeout timer
    const pauseTimer = DisposableTimer.create(TimerFactory.setTimeout)(timeoutLimit, () => {
        session.fireEvent(PlayerEvents.STOP_PLAYBACK, FatalErrorCode.PAUSE_TIMEOUT);
    });

    session.presentingState.addListener(onStateChanged);
    session.state.addListener(onStateChanged);

    // Optional inactivity monitor for detecting wall-clock gaps (e.g. sleep/wake)
    if (config.inactivityMonitorInterval) {
        let lastCheckTime = now();

        const inactivityMonitor = new PeriodicTimer(
            config.inactivityMonitorInterval,
            () => {
                const currentTime = now();
                const elapsed = currentTime - lastCheckTime;

                // If wall-clock gap exceeds pause timeout, fire inactivity timeout
                if (elapsed > timeoutLimit) {
                    session.fireEvent(
                        PlayerEvents.STOP_PLAYBACK,
                        FatalErrorCode.INACTIVITY_TIMEOUT
                    );
                    inactivityMonitor.stop();
                }

                // Track maximum detected gap for telemetry
                if (elapsed > 2 * config.inactivityMonitorInterval) {
                    session.maxWallClockGap = Math.max(elapsed, session.maxWallClockGap || 0);
                }

                lastCheckTime = currentTime;
            }
        );

        inactivityMonitor.start();

        // Listen for user activity to reset the pause timer
        session.addEventListener(PlayerEvents.CLEAR_TIMEOUT, () => {
            pauseTimer.cancel();
            if (isDefined(inactivityMonitor)) {
                inactivityMonitor.stop();
            }
        });
    } else {
        session.addEventListener(PlayerEvents.CLEAR_TIMEOUT, () => {
            pauseTimer.cancel();
        });
    }
}

export default { installPauseTimeoutMonitor };
