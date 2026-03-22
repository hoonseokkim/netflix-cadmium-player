/**
 * Netflix Cadmium Player - Priority Timer Manager
 * Component: SETTIMEOUT
 *
 * A singleton priority-queue based timer system that replaces raw
 * setTimeout calls with priority-aware scheduling. Timers are stored
 * in a min-heap ordered by (fireTime, priority, id). A single native
 * setTimeout wakes the system when the earliest timer is due.
 */

// Dependencies
// import { platform } from './Platform';          // webpack 66164
// import { debugEnabled } from './Debug';          // webpack 32910
// import { assert } from './Assert';               // webpack 43529
// import { PriorityQueue } from './PriorityQueue'; // webpack 50214

/**
 * Comparator for the timer priority queue.
 * Orders first by fire time, then by priority level, then by insertion order.
 *
 * @param {Object} a
 * @param {Object} b
 * @returns {number}
 */
function timerComparator(a, b) {
    return a.fireTimeMs - b.fireTimeMs || a.priority - b.priority || a.id - b.id;
}

/**
 * Schedules a callback with priority and delay.
 * Convenience wrapper around the singleton.
 *
 * @param {Function} callback - Function to execute when the timer fires
 * @param {number} delayMs - Delay in milliseconds (must be finite and >= 0)
 * @param {number} priority - Priority level (lower = higher priority)
 * @returns {number} Timer ID (for cancellation)
 */
export function scheduleTimer(callback, delayMs, priority) {
    return PriorityTimerManager.instance.scheduleTimer(callback, delayMs, priority);
}

/**
 * Cancels a previously scheduled timer.
 *
 * @param {number} timerId - The timer ID returned by scheduleTimer
 */
export function cancelTimer(timerId) {
    PriorityTimerManager.instance.cancelTimer(timerId);
}

/**
 * Resets the singleton, clearing all pending timers.
 * Used during player teardown.
 */
export function resetTimerManager() {
    PriorityTimerManager.reset();
}

/**
 * @class PriorityTimerManager
 *
 * Internal singleton that manages the priority queue of timers and
 * a single native setTimeout for waking at the right moment.
 */
class PriorityTimerManager {
    constructor() {
        /** @type {PriorityQueue} Min-heap of pending timers */
        this._queue = new PriorityQueue([], timerComparator);

        /** @private @type {number} Monotonically increasing timer ID counter */
        this._nextId = 0;

        this.console = new platform.Console("SETTIMEOUT");

        /**
         * The wake callback. When the native setTimeout fires, this
         * executes all timers whose fire time has arrived.
         * @private
         */
        this._onWake = () => {
            const now = platform.now();
            this._pendingWake = undefined;

            if (debugEnabled) {
                this.console.pauseTrace(`[${now}] Wake`);
            }

            try {
                while (!this._queue.isEmpty && this._queue.peek().fireTimeMs <= now) {
                    const timer = this._queue.pop();

                    if (debugEnabled) {
                        this.console.pauseTrace(
                            `[${platform.now()}] Executing p${timer.priority} timer ${timer.id} scheduled for ${timer.fireTimeMs}`
                        );
                    }

                    timer.callback();
                }
            } finally {
                this._scheduleNextWake();
            }
        };
    }

    /**
     * Returns the singleton instance, creating it if needed.
     * @returns {PriorityTimerManager}
     */
    static get instance() {
        return PriorityTimerManager._singleton || (PriorityTimerManager._singleton = new PriorityTimerManager());
    }

    /**
     * Resets the singleton (clears all timers).
     */
    static reset() {
        assert(
            PriorityTimerManager._singleton === undefined || PriorityTimerManager._singleton._queue.isEmpty,
            "Singleton SetTimeoutWithPriority reset with pending timers"
        );
        PriorityTimerManager._singleton = undefined;
    }

    /**
     * Schedules a new timer.
     *
     * @param {Function} callback - The function to call
     * @param {number} delayMs - Delay in milliseconds
     * @param {number} priority - Priority (lower = fires first at same time)
     * @returns {number} Timer ID
     */
    scheduleTimer(callback, delayMs, priority) {
        assert(isFinite(delayMs) && delayMs >= 0);

        const now = platform.now();
        const fireTimeMs = now + delayMs;

        this._queue.push({
            id: ++this._nextId,
            fireTimeMs,
            priority,
            callback,
        });

        if (debugEnabled) {
            this.console.pauseTrace(
                `[${now}] New p${priority} timer ${this._nextId} scheduled for ${fireTimeMs} in ${delayMs}ms`
            );
        }

        this._scheduleNextWake();
        return this._nextId;
    }

    /**
     * Cancels a pending timer by ID.
     *
     * @param {number} timerId
     */
    cancelTimer(timerId) {
        const entry = this._queue.find((t) => t.id === timerId);

        if (entry) {
            const previousEarliest = this._queue.peek().fireTimeMs;
            this._queue.remove(entry);

            if (debugEnabled) {
                this.console.pauseTrace(
                    `[${platform.now()}] Removing timer ${entry.id} scheduled for ${entry.fireTimeMs}`
                );
            }

            if (this._queue.isEmpty || this._queue.peek().fireTimeMs > previousEarliest) {
                this._scheduleNextWake();
            }
        }
    }

    /**
     * Cancels the current native setTimeout wake timer.
     * @private
     */
    _clearWake() {
        if (this._pendingWake) {
            clearTimeout(this._pendingWake.nativeId);

            if (debugEnabled) {
                this.console.pauseTrace(`[${platform.now()}] Clearing wake timer`);
            }

            this._pendingWake = undefined;
        }
    }

    /**
     * Ensures a native setTimeout is set for the earliest pending timer.
     * If the earliest timer has changed, cancels the old wake and sets a new one.
     * @private
     */
    _scheduleNextWake() {
        if (this._queue.isEmpty) {
            this._clearWake();
            return;
        }

        const earliestFireTime = this._queue.peek().fireTimeMs;

        if (earliestFireTime !== this._pendingWake?.fireTimeMs) {
            this._clearWake();

            const delayMs = Math.max(0, earliestFireTime - platform.now());

            if (debugEnabled) {
                this.console.pauseTrace(
                    `[${platform.now()}] Setting wake timer for ${earliestFireTime} in ${delayMs}ms`
                );
            }

            this._pendingWake = {
                nativeId: setTimeout(this._onWake, delayMs),
                fireTimeMs: earliestFireTime,
            };
        }
    }
}
