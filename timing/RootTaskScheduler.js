/**
 * Netflix Cadmium Player - Root Task Scheduler
 * Webpack Module: 47359
 *
 * Central scheduler that manages timed task execution for the player pipeline.
 * Extends EventEmitter and listens to player clock events (stopStart, clockAdjusted,
 * speedChanged) to keep wake-up timers in sync with the media timeline.
 *
 * Tasks are maintained in a priority queue sorted by:
 *   1. Absolute wake-up time
 *   2. Task group priority (forceEstRelativeLiveBookmark)
 *   3. Individual task priority
 *   4. Insertion order (id)
 *
 * Scheduling modes:
 *   - microTask: The next task is already past due; execute via Promise.resolve()
 *   - setTimeout: Schedule a native (or priority) timeout based on wall-clock
 *     distance to the next wake-up time, with exponential back-off on clock-skew
 *     retries.
 *
 * Exports:
 *   - RootTaskScheduler (class, extends EventEmitter)
 *   - ScheduleType (enum: none | microTask | setTimeout)
 */

// ── Dependencies (webpack IDs for reference) ──
// import { __extends, __spreadArray, __read } from 'tslib';            // 22970
// import { EventEmitter, ClockWatcher } from './EventEmitter';         // 90745
// import { platform } from './Platform';                               // 66164
// import { assert } from './Assert';                                   // 43529
// import { createComparator } from './Comparator';                     // 70248
// import { TimeUtil } from './TimeUtil';                               // 44847
// import { PriorityQueue } from './PriorityQueue';                     // 50214
// import { DisposableGroup } from './DisposableGroup';                 // 73550
// import { debugEnabled } from './Debug';                              // 32910
// import { scheduleTimer, cancelTimer } from './Settimeout';           // 95130
// import { completionState } from './CompletionState';                 // 47061
// import { WakeUpTimeType } from './WakeUpTimeType';                   // 36992
// import { SchedulerStats } from './SchedulerStats';                   // 56161

// ────────────────────────────────────────────────────────────────────────────
// Enums
// ────────────────────────────────────────────────────────────────────────────

/**
 * Describes how the next execution is scheduled.
 * @enum {number}
 */
export const ScheduleType = Object.freeze({
    /** No pending schedule */
    none: 0,
    /** Queued as a microtask (Promise.resolve) — task is already past due */
    microTask: 1,
    /** Queued via setTimeout / priority setTimeout */
    setTimeout: 2,
});

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

/**
 * Apply exponential back-off to a time duration.
 * On repeated clock-skew retries the minimum delay doubles each time,
 * capped at 2^6 = 64 × 10 ms = 640 ms.
 *
 * @param {TimeUtil} duration - The base duration until the target time
 * @param {number} retryCount - Number of previous clock-skew retries
 * @returns {TimeUtil} Adjusted duration (possibly increased)
 */
function applyBackOff(duration, retryCount) {
    if (retryCount > 0) {
        const minDelayMs = 10 * (1 << (Math.min(retryCount, 6) - 1));
        return TimeUtil.max(duration, TimeUtil.fromMilliseconds(minDelayMs));
    }
    return duration;
}

/**
 * Schedule a wall-clock timeout that wakes when the player clock reaches
 * `targetTime`. Handles clock-skew by re-checking after each timeout fires
 * and retrying with exponential back-off if the target has not been reached.
 *
 * @param {Object} options
 * @param {Object} options.playerCore - Player core reference (provides currentTime, speed, zj)
 * @param {Function} options.onReady - Callback invoked once the target time is reached
 * @param {TimeUtil} options.targetTime - The player-clock time to wait for
 * @param {Object} [options.retryTimeout] - Existing retry state (for recursive calls)
 * @param {number} [options.priority=0] - Timer priority level
 * @param {boolean} [options.usePrioritySetTimeout=true] - Use priority-aware setTimeout
 * @param {boolean} [options.enableBackOff=true] - Apply exponential back-off on retries
 * @returns {RetryTimeoutState} Mutable state object with .id for cancellation
 */
function scheduleClockTimeout({
    playerCore,
    onReady,
    targetTime,
    retryTimeout,
    priority = 0,
    usePrioritySetTimeout = true,
    enableBackOff = true,
}) {
    assert(playerCore.zj,
        `Current time: ${platform.platform.now()} cr: ${playerCore.currentTime}`);
    assert(playerCore.currentTime.isFinite());

    // Compute wall-clock milliseconds until target
    let duration = targetTime.lowestWaterMarkLevelBufferRelaxed(playerCore.currentTime);
    if (enableBackOff) {
        duration = applyBackOff(duration, retryTimeout?.clockSkewRetries ?? 0);
    }

    const sleepTimeMs = Math.max(Math.ceil(duration.$B / playerCore.speed), 0);

    // Build or reuse the mutable timeout state
    const state = retryTimeout ?? {
        id: undefined,
        sleepTimeMs,
        clockSkewRetries: 0,
        originalSleepTimeMs: sleepTimeMs,
        usePrioritySetTimeout,
        delayHistory: [],
    };

    const scheduledAt = platform.platform.now();

    const timerFn = state.usePrioritySetTimeout ? scheduleTimer : setTimeout;
    state.id = timerFn(() => {
        const remaining = targetTime.lowestWaterMarkLevelBufferRelaxed(playerCore.currentTime);
        const overshoot = platform.platform.now() - scheduledAt - sleepTimeMs;

        state.delayHistory.push({
            delay: overshoot,
            requestedSleepMs: sleepTimeMs,
        });

        if (remaining.timeComparison(TimeUtil.seekToSample)) {
            // Target time reached (or passed)
            onReady();
        } else {
            // Clock skew — retry
            state.clockSkewRetries++;
            scheduleClockTimeout({
                playerCore,
                onReady,
                targetTime,
                retryTimeout: state,
                priority,
                usePrioritySetTimeout,
                enableBackOff,
            });
        }
    }, sleepTimeMs, priority);

    state.sleepTimeMs = sleepTimeMs;
    return state;
}

// ────────────────────────────────────────────────────────────────────────────
// ScheduleState — tracks the current pending schedule
// ────────────────────────────────────────────────────────────────────────────

/**
 * Holds the state of the scheduler's current pending wake-up.
 * At most one schedule is active at a time.
 */
class ScheduleState {
    constructor() {
        this.reset();
    }

    /** @type {RetryTimeoutState|undefined} The active timeout state, if any */
    get activeTimeout() {
        return this._activeTimeout;
    }

    /** @type {TimeUtil} The player-clock time of the next scheduled wake-up */
    get nextWakeUpTime() {
        return this._nextWakeUpTime;
    }

    /** @type {number} Timestamp (wall-clock ms) when the schedule was created */
    get timeScheduled() {
        return this._timeScheduled;
    }

    /** @type {ScheduleType} How the current schedule was created */
    get scheduleType() {
        return this._scheduleType;
    }

    /**
     * Record a new pending schedule.
     *
     * @param {TimeUtil} wakeUpTime - Target player-clock time
     * @param {ScheduleType} type - How it was scheduled
     * @param {RetryTimeoutState} [timeoutState] - Timeout handle (for setTimeout type)
     */
    set(wakeUpTime, type, timeoutState) {
        this._timeScheduled = (type === ScheduleType.none) ? 0 : platform.platform.now();
        this._nextWakeUpTime = wakeUpTime;
        this._scheduleType = type;

        if (debugEnabled) {
            assert(!this._activeTimeout, 'Invalid replacement of timeout value');
        }
        this._activeTimeout = timeoutState;
    }

    /**
     * Clear the current schedule back to the idle state.
     */
    reset() {
        this._activeTimeout = undefined;
        this.set(TimeUtil.uh, ScheduleType.none);
    }
}

// ────────────────────────────────────────────────────────────────────────────
// RootTaskScheduler
// ────────────────────────────────────────────────────────────────────────────

/** Maximum iterations per execution tick before aborting */
const MAX_TICK_ITERATIONS = 10_000;

/**
 * Central task scheduler for the Cadmium player.
 *
 * Maintains a priority queue of scheduled tasks, each associated with a
 * wake-up time on the player clock. When the player clock advances past a
 * task's wake-up time the task is executed. After execution the task
 * re-reports its next desired wake-up time and is re-inserted into the queue.
 *
 * @extends EventEmitter
 */
export class RootTaskScheduler /* extends EventEmitter */ {

    /**
     * Global configuration. Must be set via `RootTaskScheduler.setConfig()`
     * before instances are created through the centralized path.
     * @type {{ usePrioritySetTimeout: boolean, centralizeClockSchedulers: boolean, backOffSetTimeout: boolean }}
     */
    static config = {
        usePrioritySetTimeout: true,
        centralizeClockSchedulers: true,
        backOffSetTimeout: true,
    };

    /**
     * Cache of scheduler instances keyed by playerCore (weak references).
     * Used when `centralizeClockSchedulers` is enabled so that multiple
     * consumers sharing the same playerCore share one scheduler.
     * @type {WeakMap}
     */
    static _centralizedInstances = new WeakMap();

    /**
     * Set the global scheduler configuration.
     * @param {Object} config
     */
    static setConfig(config) {
        this.config = config;
    }

    /**
     * Factory that returns a (possibly shared) scheduler instance for a player
     * core. When `centralizeClockSchedulers` is enabled, repeated calls with
     * the same playerCore return the same scheduler.
     *
     * @param {Object} playerCore
     * @param {Object} console - Logger / console wrapper
     * @returns {{ scheduler: RootTaskScheduler, disposable: Object }}
     */
    static getOrCreateScheduler(playerCore, console) {
        assert(this.config, 'Config has not been initialized');

        const createPair = () => {
            const scheduler = new RootTaskScheduler(playerCore, console);
            const disposableGroup = new DisposableGroup({
                name: 'rootTaskScheduler',
                onDispose: (shouldDestroy) => {
                    if (shouldDestroy()) {
                        scheduler.destroy();
                        RootTaskScheduler._centralizedInstances.delete(playerCore);
                    }
                },
                console,
            });
            return { scheduler, disposableGroup };
        };

        if (this.config.centralizeClockSchedulers) {
            if (!this._centralizedInstances.has(playerCore)) {
                this._centralizedInstances.set(playerCore, createPair());
            }
        }

        const pair = this._centralizedInstances.get(playerCore) || createPair();
        return {
            scheduler: pair.scheduler,
            disposable: pair.disposableGroup.acquire(),
        };
    }

    /**
     * @param {Object} playerCore - The player core (provides currentTime, speed, zj)
     * @param {Object} console - Logger / console wrapper
     */
    constructor(playerCore, console) {
        // super(); // EventEmitter
        this._playerCore = playerCore;
        this._console = console;

        /** @type {boolean} Whether we are currently inside the execution loop */
        this._isExecuting = false;

        /** @type {boolean} Flagged when destroy is called mid-execution */
        this._pendingDestroy = false;

        /** @type {boolean} Set to true when fully destroyed */
        this._destroyed = false;

        /** @type {ScheduleState} Current wake-up state */
        this._scheduleState = new ScheduleState();

        /** @type {ClockWatcher} Manages event subscriptions on the player clock */
        this._clockWatcher = new ClockWatcher();

        /** @type {PriorityQueue} Sorted queue of {task, absoluteWakeUp, wakeUpSpec} entries */
        this._taskQueue = new PriorityQueue([], createComparator(
            (a, b) => a.absoluteWakeUp.xl(b.absoluteWakeUp),
            (a, b) => a.task.taskGroup.priority - b.task.taskGroup.priority,
            (a, b) => b.task.priority - a.task.priority,
            (a, b) => a.task.id > b.task.id ? 1 : a.task.id < b.task.id ? -1 : 0,
        ));

        /** @type {SchedulerStats|undefined} Optional stats collector */
        this._stats = undefined;

        this._bindClockEvents(playerCore);
    }

    // ── Properties ──────────────────────────────────────────────────────

    /** @returns {SchedulerStats|undefined} */
    get stats() {
        return this._stats;
    }

    /** @returns {boolean} Whether the player clock is valid / ticking */
    get isClockValid() {
        return this._playerCore.zj;
    }

    // ── Stats ───────────────────────────────────────────────────────────

    /**
     * Lazily create a stats collector.
     * @returns {SchedulerStats}
     */
    getOrCreateStats() {
        if (!this._stats) {
            this._stats = new SchedulerStats();
        }
        return this._stats;
    }

    /**
     * Returns a snapshot of the current scheduler state for diagnostics.
     * @returns {Object}
     */
    getStats() {
        const info = {
            hasSchedule: !!this._scheduleState.activeTimeout,
            schedule: this._scheduleState.activeTimeout && {
                sleepTime: this._scheduleState.activeTimeout.sleepTimeMs,
                originalSleepTime: this._scheduleState.activeTimeout.originalSleepTimeMs,
                clockSkewAdjustments: this._scheduleState.activeTimeout.clockSkewRetries,
            },
            nextWakeup: this._scheduleState.nextWakeUpTime.playbackSegment,
            timeScheduled: this._scheduleState.timeScheduled,
            scheduleType: ScheduleType[this._scheduleState.scheduleType] ?? String(this._scheduleState.scheduleType),
            numTasks: this._taskQueue.length,
            lastVideoSync: {
                ir: this._playerCore.zj,
                ct: this._playerCore.currentTime.playbackSegment,
                sp: this._playerCore.speed,
            },
        };
        if (debugEnabled) {
            this._trace('audit', info);
        }
        return info;
    }

    // ── Clock binding ───────────────────────────────────────────────────

    /**
     * Subscribe to relevant player-clock events and trigger an initial recheck.
     * @param {Object} playerCore
     * @private
     */
    _bindClockEvents(playerCore) {
        this._cancelPendingTimeout();
        this._clockWatcher.clear();
        this._playerCore = playerCore;

        this._clockWatcher.on(playerCore, 'stopStart', () => this._recheckSchedule());
        this._clockWatcher.on(playerCore, 'clockAdjusted', () => this._onClockAdjusted());
        this._clockWatcher.on(playerCore, 'speedChanged', () => this._onSpeedChanged());

        this._onClockAdjusted();
        this.emit('clockChanged');
    }

    /**
     * Handle a speed change: cancel existing timeout, then reschedule.
     * @private
     */
    _onSpeedChanged() {
        this._cancelPendingTimeout();
        this._recheckSchedule();
    }

    /**
     * Handle a clock adjustment: rebuild the task queue with recalculated
     * absolute wake-up times, then reschedule.
     * @private
     */
    _onClockAdjusted() {
        const tasks = this._taskQueue.map(entry => entry.task);
        this._cancelPendingTimeout();
        this._taskQueue.clear();
        tasks.forEach(task => this._insertTask(task, /* recheck */ false));
        this._recheckSchedule();
    }

    // ── Lifecycle ───────────────────────────────────────────────────────

    /**
     * Destroy the scheduler, cancelling all pending timers and clearing tasks.
     */
    destroy() {
        this._removeAllTasks();
        if (this._isExecuting) {
            this._pendingDestroy = true;
        }
        this._clockWatcher.clear();
        this._destroyed = true;
    }

    /**
     * Remove all tasks and invoke each task's destroy() method.
     */
    _removeAllTasks() {
        this._cancelPendingTimeout();
        const entries = this._taskQueue.buildPath();
        this._taskQueue.clear();
        entries.forEach(entry => entry.task.destroy());
    }

    /**
     * Remove all tasks and invoke each task's reuseOnErrorCacheSize() method.
     * Used for error-recovery scenarios.
     */
    reuseOnErrorCacheSize() {
        this._cancelPendingTimeout();
        const entries = this._taskQueue.buildPath();
        this._taskQueue.clear();
        entries.forEach(entry => entry.task.reuseOnErrorCacheSize());
    }

    // ── Task management ─────────────────────────────────────────────────

    /**
     * Insert a task into the priority queue.
     *
     * @param {Object} task - The task to schedule (must have .swa(), .name, .taskGroup, etc.)
     * @param {boolean} [recheck=true] - Whether to immediately recheck the schedule
     * @private
     */
    _insertTask(task, recheck = true) {
        const wakeUpSpec = task.swa();
        const absoluteWakeUp = this._resolveAbsoluteTime(wakeUpSpec);

        const entry = {
            task,
            absoluteWakeUp,
            wakeUpSpec,
        };

        if (debugEnabled) {
            this._trace(
                `Adding task ${task.name} for ${absoluteWakeUp.playbackSegment}` +
                ` from ${task.taskGroup.name}/${task.taskGroup.priority}`
            );
        }

        assert(!this._taskQueue.contains(entry));
        this._taskQueue.push(entry);

        if (recheck) {
            this._recheckSchedule();
        }
    }

    /**
     * Bulk update: remove specified tasks and add new ones, then recheck.
     *
     * @param {Object} changes
     * @param {Object[]} [changes.removed] - Tasks to remove
     * @param {Object[]} [changes.added] - Tasks to add
     */
    updateTasks(changes) {
        this._cancelPendingTimeout();

        if (changes.removed) {
            this._taskQueue.map(e => e)
                .filter(entry => changes.removed.indexOf(entry.task) !== -1)
                .forEach(entry => this._taskQueue.item(entry));
        }

        changes.added?.forEach(task => this._insertTask(task, /* recheck */ false));
        this._recheckSchedule();
    }

    /**
     * Re-schedule an existing task: remove it, then re-insert with a fresh
     * wake-up time.
     *
     * @param {Object} task
     */
    rescheduleTask(task) {
        this._removeTask(task, /* recheck */ false);
        this._insertTask(task);
    }

    /**
     * Remove a single task from the queue.
     *
     * @param {Object} task
     * @param {boolean} [recheck=true]
     */
    _removeTask(task, recheck = true) {
        const entry = this._taskQueue.find(e => e.task === task);
        if (entry) {
            this._removeEntry(entry, recheck);
        }
    }

    /**
     * Remove an entry from the queue.
     *
     * @param {Object} entry
     * @param {boolean} recheck
     * @private
     */
    _removeEntry(entry, recheck) {
        this._taskQueue.item(entry);
        if (recheck) {
            this._recheckSchedule();
        }
    }

    // ── Scheduling logic ────────────────────────────────────────────────

    /**
     * Cancel the currently pending timeout (if any) and reset the schedule state.
     *
     * @param {boolean} [emitStopping=true] - Whether to emit a "stopping" event
     * @private
     */
    _cancelPendingTimeout(emitStopping = true) {
        if (this._scheduleState.activeTimeout) {
            if (emitStopping) {
                this.emit('stopping');
            }
            const timeout = this._scheduleState.activeTimeout;
            const cancelFn = timeout.usePrioritySetTimeout ? cancelTimer : clearTimeout;
            cancelFn(timeout.id);
            this._scheduleState.reset();
            this._stats?.cancelPendingTimeout();
        }
    }

    /**
     * Re-evaluate the schedule: look at the next task in the queue and
     * determine whether to fire immediately (microTask), schedule a timeout,
     * or do nothing.
     * @private
     */
    _recheckSchedule() {
        if (debugEnabled) {
            this._trace(`recheck schedule task count:${this._taskQueue.length}`);
        }

        if (!this.isClockValid) {
            if (debugEnabled) this._trace('should check schedule is false, stopping');
            this._cancelPendingTimeout();
            return;
        }

        if (this._isExecuting) {
            if (debugEnabled) this._trace('already executing, bailing');
            return;
        }

        if (this._scheduleState.scheduleType === ScheduleType.microTask) {
            if (debugEnabled) this._trace('Already scheduled on microtask, bailing');
            return;
        }

        const currentNextWakeUp = this._scheduleState.nextWakeUpTime;
        const topEntry = this._taskQueue.mr();
        const nextWakeUp = topEntry?.absoluteWakeUp ?? TimeUtil.uh;

        if (!nextWakeUp.isFinite() || !nextWakeUp.TT(currentNextWakeUp)) {
            // No finite wake-up, or it's not earlier than the existing schedule
            if (!nextWakeUp.isFinite() && this._scheduleState.scheduleType === ScheduleType.setTimeout) {
                // Had a timeout but now there's nothing to schedule — cancel it
                this._cancelPendingTimeout(/* emitStopping */ false);
            }
            return;
        }

        // A new (earlier) wake-up is needed — cancel any existing timeout
        this._cancelPendingTimeout(/* emitStopping */ false);

        if (this._playerCore.currentTime.$f(nextWakeUp)) {
            // Already past the wake-up time — use a microtask
            this._scheduleState.set(nextWakeUp, ScheduleType.microTask);
            Promise.resolve().then(() => {
                if (this._scheduleState.scheduleType === ScheduleType.microTask) {
                    this._scheduleState.reset();
                    this._executeTasks({ type: ScheduleType.microTask });
                }
            });
        } else {
            // Schedule a wall-clock timeout
            if (debugEnabled) {
                this._trace('scheduling next wake up for', {
                    wnd: nextWakeUp.playbackSegment,
                    task: topEntry?.task.name,
                    taskGroup: topEntry?.task.taskGroup.name,
                });
            }

            const timeoutState = scheduleClockTimeout({
                playerCore: this._playerCore,
                onReady: () => {
                    this._scheduleState.reset();
                    this._executeTasks({
                        type: ScheduleType.setTimeout,
                        nextWakeUpTime: nextWakeUp,
                        delay: this._playerCore.currentTime.lowestWaterMarkLevelBufferRelaxed(nextWakeUp),
                        clockSkewRetries: timeoutState.clockSkewRetries,
                        delayHistory: timeoutState.delayHistory,
                    });
                },
                targetTime: nextWakeUp,
                priority: topEntry?.task.taskGroup.priority ?? 0,
                usePrioritySetTimeout: !!RootTaskScheduler.config.usePrioritySetTimeout,
                enableBackOff: !!RootTaskScheduler.config.backOffSetTimeout,
            });

            this._scheduleState.set(nextWakeUp, ScheduleType.setTimeout, timeoutState);
        }
    }

    // ── Task execution ──────────────────────────────────────────────────

    /**
     * Main execution loop. Pops tasks from the queue whose wake-up time has
     * been reached and runs them, re-inserting tasks that wish to continue.
     *
     * @param {Object} triggerInfo - Information about what triggered this execution
     * @private
     */
    _executeTasks(triggerInfo) {
        let iterationCount = 0;
        const initialWakeUpSpec = this._taskQueue.mr()?.wakeUpSpec;
        let clockStopped = false;

        const onStopStart = () => { clockStopped = true; };
        this._playerCore.on('stopStart', onStopStart);

        try {
            this._isExecuting = true;
            this._stats?.onExecutionStart(triggerInfo);

            while (iterationCount++ < MAX_TICK_ITERATIONS && this._tryExecuteNextTask() && !clockStopped) {
                // continue executing ready tasks
            }
        } finally {
            this._playerCore.validateManifest('stopStart', onStopStart);
            this._isExecuting = false;
            this._stats?.onExecutionEnd(iterationCount);
            this._cancelPendingTimeout();

            const remainingTasks = this._taskQueue.map(entry => ({
                name: entry.task.name,
                taskGroup: entry.task.taskGroup.name,
                wakeUpTime: entry.absoluteWakeUp.playbackSegment,
            }));

            if (iterationCount > MAX_TICK_ITERATIONS && !this._hasWakeUpAdvanced(initialWakeUpSpec)) {
                this._error(
                    `Task scheduler executed more than ${MAX_TICK_ITERATIONS} iterations in same tick`,
                    remainingTasks.slice(0, 5)
                );
            } else {
                if (debugEnabled) this._trace('Next tasks', remainingTasks);
                this._recheckSchedule();
            }
        }
    }

    /**
     * Check whether the top-of-queue wake-up spec has changed compared to
     * a previous snapshot. Used to detect infinite-loop scenarios.
     *
     * @param {Object|undefined} previousSpec
     * @returns {boolean} True if the wake-up has advanced (safe to continue)
     * @private
     */
    _hasWakeUpAdvanced(previousSpec) {
        const currentSpec = this._taskQueue.mr()?.wakeUpSpec;
        if (previousSpec && currentSpec &&
            previousSpec.timestamp.equal(currentSpec.timestamp) &&
            previousSpec.type === currentSpec.type) {
            return false;
        }
        return true;
    }

    /**
     * Signal that the currently executing task should be destroyed after
     * it finishes (called externally when a task's owner is torn down
     * mid-execution).
     */
    requestDestroyCurrentTask() {
        if (this._isExecuting) {
            this._pendingDestroy = true;
        }
    }

    /**
     * Attempt to pop and execute the next ready task.
     *
     * @returns {boolean} True if a task was executed, false if none were ready
     * @private
     */
    _tryExecuteNextTask() {
        const topWakeUp = this._taskQueue.mr()?.absoluteWakeUp ?? TimeUtil.uh;

        if (debugEnabled) {
            this._trace(
                `tryExecuteNextTask @${this._playerCore.currentTime.playbackSegment}, ` +
                `next wakeup at ${topWakeUp}`
            );
        }

        const currentTime = this._playerCore.currentTime;
        if (!currentTime.$f(topWakeUp)) {
            return false;
        }

        const entry = this._taskQueue.pop();
        if (!entry) {
            return false;
        }

        const task = entry.task;
        this._stats?.onTaskStart({ task, currentTime, nextWakeUpTime: topWakeUp });

        this._currentlyExecutingTask = task;
        let succeeded = false;

        if (debugEnabled) {
            this._trace(
                `Running a task @${currentTime.playbackSegment}, ` +
                `scheduled for time:${topWakeUp.playbackSegment} ` +
                `Name:${task.name}`
            );
        }

        try {
            task.onUpdate();
            succeeded = true;

            // Task ran successfully — update its wake-up spec for re-insertion
            entry.wakeUpSpec = task.swa();
            entry.absoluteWakeUp = this._resolveAbsoluteTime(entry.wakeUpSpec);
        } catch (error) {
            this._error(
                `Unhandled error from a task ${task.name} occurred. ` +
                `Removing the task from future executions:${error}`,
                { stack: error.stack }
            );
            task.destroy();
            throw error;
        } finally {
            this._stats?.onTaskEnd({ task, succeeded });
            this._currentlyExecutingTask = undefined;

            if (this._pendingDestroy) {
                // Destroy was requested while this task was running
                task.destroy();
                this._pendingDestroy = false;
            } else if (entry.absoluteWakeUp !== TimeUtil.uh && task.state === completionState.running) {
                // Task wants to run again — re-insert it
                assert(!this._taskQueue.contains(entry));
                this._taskQueue.push(entry);
            }
        }

        return true;
    }

    // ── Time resolution ─────────────────────────────────────────────────

    /**
     * Convert a wake-up specification to an absolute player-clock time.
     * Absolute specs are returned as-is; relative specs are offset from
     * the current player time.
     *
     * @param {Object} wakeUpSpec - { type, timestamp }
     * @returns {TimeUtil} Absolute player-clock time
     * @private
     */
    _resolveAbsoluteTime(wakeUpSpec) {
        if (wakeUpSpec.type === WakeUpTimeType.absolute) {
            return wakeUpSpec.timestamp;
        }
        return wakeUpSpec.timestamp.item(this._playerCore.currentTime);
    }

    // ── Logging ─────────────────────────────────────────────────────────

    /**
     * @param {...*} args
     * @private
     */
    _trace(...args) {
        this._console?.pauseTrace('RootTaskScheduler:', ...args);
    }

    /**
     * @param {...*} args
     * @private
     */
    _error(...args) {
        this._console?.error('RootTaskScheduler:', ...args);
    }
}
