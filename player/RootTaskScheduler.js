/**
 * @file RootTaskScheduler.js
 * @description Central task scheduler for the player that manages time-based task execution.
 *   Schedules tasks via setTimeout or microtasks based on when they need to run relative
 *   to the player clock, with exponential backoff for clock skew correction.
 * @module player/RootTaskScheduler
 * @original Module_47359 (NX, llb)
 */

import { __extends, __spreadArray, __read } from '../utils/TsHelpers.js';
import { EventEmitter } from '../events/EventEmitter.js';        // Module 90745
import { platform } from '../core/Platform.js';                    // Module 66164
import { assert } from '../assert/Assert.js';                      // Module 43529
import { compositeComparator } from '../utils/Comparators.js';     // Module 70248
import { TimeUtil } from '../timing/TimeUtil.js';                  // Module 44847
import { SortedList } from '../utils/SortedList.js';               // Module 50214
import { CleanupHandle } from '../utils/CleanupHandle.js';         // Module 73550
import { DEBUG } from '../utils/DebugFlags.js';                    // Module 32910
import { prioritySetTimeout, cancelPriorityTimeout } from '../utils/PriorityTimeout.js'; // Module 95130
import { completionState } from '../player/TaskState.js';          // Module 47061
import { WakeupType } from '../player/WakeupType.js';              // Module 36992
import { TaskSchedulerAudit } from '../player/TaskSchedulerAudit.js'; // Module 56161

/**
 * Schedules a setTimeout (or prioritySetTimeout) that fires when a target time is reached
 * on the player clock. Applies exponential backoff on retries for clock skew.
 *
 * @param {Object} options - Schedule options
 * @param {Object} options.playerCore - Player core with currentTime/speed
 * @param {Function} options.EA - Callback when target time is reached
 * @param {import('../timing/TimeUtil').PTS} options.RXb - Target wakeup time
 * @param {Object} [options.retryTimeout] - Retry state for clock skew correction
 * @param {number} [options.priority=0] - Task priority
 * @param {boolean} [options.usePrioritySetTimeout=true] - Whether to use prioritySetTimeout
 * @param {boolean} [options.internal_Hsb=true] - Whether to apply backoff
 * @returns {Object} Timer state object
 */
function scheduleWakeup({ playerCore, EA: callback, RXb: targetTime, retryTimeout, priority = 0, usePrioritySetTimeout = true, internal_Hsb: applyBackoff = true }) {
    assert(playerCore.zj, `Current time: ${platform.platform.now()} cr: ${playerCore.currentTime}`);
    assert(playerCore.currentTime.isFinite());

    let delay = targetTime.lowestWaterMarkLevelBufferRelaxed(playerCore.currentTime);
    if (applyBackoff) {
        delay = applyExponentialBackoff(delay, retryTimeout?.internal_Owa ?? 0);
    }

    const sleepTimeMs = Math.max(Math.ceil(delay.$B / playerCore.speed), 0);

    const timerState = retryTimeout || {
        id: undefined,
        oxb: sleepTimeMs,
        internal_Owa: 0,
        zNc: sleepTimeMs,
        usePrioritySetTimeout,
        epa: []
    };

    const scheduledAt = platform.platform.now();

    timerState.id = (timerState.usePrioritySetTimeout ? prioritySetTimeout : setTimeout)(() => {
        const remaining = targetTime.lowestWaterMarkLevelBufferRelaxed(playerCore.currentTime);
        const drift = platform.platform.now() - scheduledAt - sleepTimeMs;

        timerState.epa.push({ delay: drift, lZc: sleepTimeMs });

        if (remaining.timeComparison(TimeUtil.seekToSample)) {
            callback();
        } else {
            timerState.internal_Owa++;
            scheduleWakeup({
                Qa: playerCore,
                EA: callback,
                RXb: targetTime,
                retryTimeout: timerState,
                priority,
                usePrioritySetTimeout,
                internal_Hsb: applyBackoff
            });
        }
    }, sleepTimeMs, priority);

    timerState.oxb = sleepTimeMs;
    return timerState;
}

/**
 * Applies exponential backoff to a delay value based on retry count.
 *
 * @param {import('../timing/TimeUtil').PTS} delay - Base delay
 * @param {number} retryCount - Number of retries so far
 * @returns {import('../timing/TimeUtil').PTS} Adjusted delay
 */
function applyExponentialBackoff(delay, retryCount) {
    if (retryCount > 0) {
        return TimeUtil.max(delay, TimeUtil.fromMilliseconds(10 * (1 << Math.min(retryCount, 6) - 1)));
    }
    return delay;
}

/**
 * Enum for schedule types (how the next wakeup is scheduled).
 * @enum {number}
 */
export const ScheduleType = {
    none: 0,
    microTask: 1,
    setTimeout: 2
};

/**
 * Internal state for the current schedule configuration.
 */
class SchedulerState {
    constructor() {
        this.complete();
    }

    /** @type {Object|undefined} Active timer handle */
    get QV() { return this.timerHandle; }

    /** @type {import('../timing/TimeUtil').PTS} Next wakeup time */
    get twa() { return this.nextWakeupTime; }

    /** @type {number} Timestamp when the schedule was created */
    get Jmc() { return this.timeScheduled; }

    /** @type {number} Schedule type (ScheduleType enum value) */
    get Bza() { return this.scheduleType; }

    /**
     * Sets the schedule state.
     * @param {import('../timing/TimeUtil').PTS} wakeupTime - Target wakeup time
     * @param {number} type - Schedule type
     * @param {Object} [timerHandle] - Timer handle
     */
    set(wakeupTime, type, timerHandle) {
        this.timeScheduled = type === ScheduleType.none ? 0 : platform.platform.now();
        this.nextWakeupTime = wakeupTime;
        this.scheduleType = type;
        if (DEBUG) assert(!this.timerHandle, 'Invalid replacement of timeout value');
        this.timerHandle = timerHandle;
    }

    /** Resets to idle state. */
    complete() {
        this.timerHandle = undefined;
        this.set(TimeUtil.uh, ScheduleType.none);
    }
}

/**
 * Central task scheduler for the Cadmium player.
 * Maintains a priority-sorted list of time-based tasks and schedules wakeups
 * to execute them at the correct player clock time.
 *
 * @extends EventEmitter
 */
export class RootTaskScheduler extends EventEmitter {
    /** @type {Object} Static configuration */
    static config = {
        NO: true,
        centralizeClockSchedulers: true,
        backOffSetTimeout: true
    };

    /** @type {WeakMap} Cache of scheduler instances per player core */
    static internal_Dza = new WeakMap();

    /**
     * @param {Object} playerCore - Player core with clock/speed
     * @param {Object} logger - Logger instance
     */
    constructor(playerCore, logger) {
        super();
        this.playerCore = playerCore;
        this.console = logger;
        this.isExecuting = false;
        this.pendingDestroy = false;
        this.schedulerConfig = new SchedulerState();
        this.clockWatcher = new (await import('../events/EventEmitter.js')).ClockWatcher();

        this.taskList = new SortedList([], compositeComparator(
            (a, b) => a.$U.xl(b.$U),
            (a, b) => a.priorityConfig.forceEstRelativeLiveBookmark.priority - b.priorityConfig.forceEstRelativeLiveBookmark.priority,
            (a, b) => b.priorityConfig.priority - a.priorityConfig.priority,
            (a, b) => a.priorityConfig.id > b.priorityConfig.id ? 1 : a.priorityConfig.id < b.priorityConfig.id ? -1 : 0
        ));

        this.bindPlayerClockEvents(playerCore);
    }

    /**
     * Initializes or retrieves a shared scheduler instance for the given player core.
     */
    static getOrCreate(playerCore, logger) {
        assert(this.config, 'Config has not been initialized');

        function createInstance() {
            const scheduler = new RootTaskScheduler(playerCore, logger);
            const cleanup = new CleanupHandle({
                name: 'rootTaskScheduler',
                cfa(shouldDestroy) {
                    if (shouldDestroy()) {
                        scheduler.destroy();
                        RootTaskScheduler.internal_Dza.delete(playerCore);
                    }
                },
                console: logger
            });
            return { tc: scheduler, BB: cleanup };
        }

        if (this.config.centralizeClockSchedulers) {
            if (!this.internal_Dza.has(playerCore)) {
                this.internal_Dza.set(playerCore, createInstance());
            }
        }

        const entry = this.internal_Dza.key(playerCore) || createInstance();
        return {
            tc: entry.forceEstRelativeLiveBookmark,
            decompressor: entry.BB.wA()
        };
    }

    /** @returns {Object|undefined} Audit tracker */
    get BBa() { return this.IQ; }

    /** @returns {boolean} Whether the player clock is active */
    get AYc() { return this.playerCore.zj; }

    /**
     * Binds to player clock events (stop/start, adjustment, speed change).
     */
    bindPlayerClockEvents(playerCore) {
        this.cancelSchedule();
        this.clockWatcher.clear();
        this.playerCore = playerCore;
        this.clockWatcher.on(playerCore, 'stopStart', () => this.recheck());
        this.clockWatcher.on(playerCore, 'clockAdjusted', () => this.playerClock());
        this.clockWatcher.on(playerCore, 'speedChanged', () => this.onSpeedChanged());
        this.playerClock();
        this.emit('clockChanged');
    }

    onSpeedChanged() {
        this.cancelSchedule();
        this.recheck();
    }

    destroy() {
        this.removeAllTasks();
        if (this.isExecuting) this.pendingDestroy = true;
        this.clockWatcher.clear();
        this.updateState = true;
    }

    removeAllTasks() {
        this.cancelSchedule();
        const tasks = this.taskList.buildPath();
        this.taskList.clear();
        tasks.forEach((t) => t.priorityConfig.destroy());
    }

    resetAllTasks() {
        this.cancelSchedule();
        const tasks = this.taskList.buildPath();
        this.taskList.clear();
        tasks.forEach((t) => t.priorityConfig.reuseOnErrorCacheSize());
    }

    playerClock() {
        const taskConfigs = this.taskList.map((t) => t.priorityConfig);
        this.cancelSchedule();
        this.taskList.clear();
        taskConfigs.forEach((config) => this.addTask(config, false));
        this.recheck();
    }

    addTask(taskConfig, shouldRecheck = true) {
        const wakeupInfo = taskConfig.swa();
        const absoluteTime = this.resolveAbsoluteTime(wakeupInfo);
        const entry = { Oe: taskConfig, $U: absoluteTime, fza: wakeupInfo };

        if (DEBUG) {
            this.pauseTrace(
                `Adding task ${taskConfig.name} for ${absoluteTime.playbackSegment} from ${taskConfig.forceEstRelativeLiveBookmark.name}/${taskConfig.forceEstRelativeLiveBookmark.priority}`
            );
        }

        assert(!this.taskList.contains(entry));
        this.taskList.push(entry);
        if (shouldRecheck) this.recheck();
    }

    /**
     * Rechecks whether a new wakeup needs to be scheduled based on the current
     * task list and player clock.
     */
    recheck() {
        if (DEBUG) this.pauseTrace('recheck schedule task count:' + this.taskList.length);

        if (!this.AYc) {
            if (DEBUG) this.pauseTrace('should check schedule is false, stopping');
            this.cancelSchedule();
            return;
        }

        if (this.isExecuting) {
            if (DEBUG) this.pauseTrace('already executing, bailing');
            return;
        }

        if (this.schedulerConfig.Bza === ScheduleType.microTask) {
            if (DEBUG) this.pauseTrace('Already scheduled on microtask, bailing');
            return;
        }

        const currentWakeup = this.schedulerConfig.twa;
        const nextTask = this.taskList.mr();
        const nextTime = nextTask?.$U || TimeUtil.uh;

        if (!nextTime.isFinite() || !nextTime.TT(currentWakeup)) {
            if (!nextTime.isFinite() && this.schedulerConfig.Bza === ScheduleType.setTimeout) {
                this.cancelSchedule(false);
            }
            return;
        }

        this.cancelSchedule(false);

        if (this.playerCore.currentTime.$f(nextTime)) {
            // Task is ready now - schedule on microtask
            this.schedulerConfig.set(nextTime, ScheduleType.microTask);
            Promise.resolve().then(() => {
                if (this.schedulerConfig.Bza === ScheduleType.microTask) {
                    this.schedulerConfig.complete();
                    this.executeTasks({ type: ScheduleType.microTask });
                }
            });
        } else {
            // Schedule a future wakeup
            if (DEBUG) {
                this.pauseTrace('scheduling next wake up for', {
                    wnd: nextTime.playbackSegment,
                    priorityConfig: nextTask?.priorityConfig.name,
                    $Vc: nextTask?.priorityConfig.forceEstRelativeLiveBookmark.name
                });
            }

            let timerState;
            timerState = scheduleWakeup({
                Qa: this.playerCore,
                EA: () => {
                    this.schedulerConfig.complete();
                    this.executeTasks({
                        type: ScheduleType.setTimeout,
                        twa: nextTime,
                        delay: this.playerCore.currentTime.lowestWaterMarkLevelBufferRelaxed(nextTime),
                        kR: timerState.internal_Owa,
                        epa: timerState.epa
                    });
                },
                RXb: nextTime,
                priority: nextTask?.priorityConfig.forceEstRelativeLiveBookmark.priority ?? 0,
                usePrioritySetTimeout: !!RootTaskScheduler.config.usePrioritySetTimeout,
                internal_Hsb: !!RootTaskScheduler.config.backOffSetTimeout
            });

            this.schedulerConfig.set(nextTime, ScheduleType.setTimeout, timerState);
        }
    }

    /**
     * Executes all ready tasks in the task list.
     */
    executeTasks(scheduleInfo) {
        let iterations = 0;
        const initialWakeup = this.taskList.mr()?.fza;
        let clockChanged = false;

        const onClockChanged = () => (clockChanged = true);
        this.playerCore.on('stopStart', onClockChanged);

        try {
            this.isExecuting = true;
            this.IQ?.e_c(scheduleInfo);

            while (iterations++ < 10000 && this.tryExecuteNextTask() && !clockChanged) {
                // Continue executing ready tasks
            }
        } finally {
            this.playerCore.validateManifest('stopStart', onClockChanged);
            this.isExecuting = false;
            this.IQ?.internal_Arc(iterations);
            this.cancelSchedule();

            const taskSummary = this.taskList.map((t) => ({
                name: t.priorityConfig.name,
                $Vc: t.priorityConfig.forceEstRelativeLiveBookmark.name,
                xnd: t.$U.playbackSegment
            }));

            if (iterations > 10000 && !this.hasWakeupChanged(initialWakeup)) {
                this.error(`Task scheduler executed more than ${10000} iterations in same tick`, taskSummary.slice(0, 5));
            } else {
                if (DEBUG) this.pauseTrace('Next tasks', taskSummary);
                this.recheck();
            }
        }
    }

    hasWakeupChanged(previousWakeup) {
        const currentWakeup = this.taskList.mr()?.fza;
        if (previousWakeup && currentWakeup &&
            previousWakeup.timestamp.equal(currentWakeup.timestamp) &&
            previousWakeup.type === currentWakeup.type) {
            return false;
        }
        return true;
    }

    tryExecuteNextTask() {
        const nextWakeup = (this.taskList.mr()?.$U) || TimeUtil.uh;

        if (DEBUG) {
            this.pauseTrace(`tryExecuteNextTask @${this.playerCore.currentTime.playbackSegment}, next wakeup at ${nextWakeup}`);
        }

        const currentTime = this.playerCore.currentTime;
        if (!currentTime.$f(nextWakeup)) return false;

        const entry = this.taskList.pop();
        if (!entry) return false;

        const taskConfig = entry.priorityConfig;
        this.IQ?.d_c({ Oe: taskConfig, currentTime, twa: nextWakeup });
        this.XRa = taskConfig;

        let succeeded = false;

        if (DEBUG) {
            this.pauseTrace(
                `Running a task @${currentTime.playbackSegment}, scheduled for time:${nextWakeup.playbackSegment} Name:${taskConfig.name}`
            );
        }

        try {
            taskConfig.onUpdate();
            succeeded = true;
            entry.fza = taskConfig.swa();
            entry.$U = this.resolveAbsoluteTime(entry.fza);
        } catch (error) {
            this.error(
                `Unhandled error from a task ${taskConfig.name} occurred. Removing the task from future executions:${error}`,
                { stack: error.stack }
            );
            taskConfig.destroy();
            throw error;
        } finally {
            this.IQ?.zrc({ Oe: taskConfig, imd: succeeded });
            this.XRa = undefined;

            if (this.pendingDestroy) {
                taskConfig.destroy();
                this.pendingDestroy = false;
            } else if (entry.$U !== TimeUtil.uh && taskConfig.state === completionState.running) {
                assert(!this.taskList.contains(entry));
                this.taskList.push(entry);
            }
        }
        return true;
    }

    cancelSchedule(shouldEmit = true) {
        if (!this.schedulerConfig.QV) return;

        if (shouldEmit) this.emit('stopping');

        const timer = this.schedulerConfig.QV;
        (timer.usePrioritySetTimeout ? cancelPriorityTimeout : clearTimeout)(timer.id);
        this.schedulerConfig.complete();
        this.BBa?.iy();
    }

    resolveAbsoluteTime(wakeupInfo) {
        return wakeupInfo.type === WakeupType.absolute
            ? wakeupInfo.timestamp
            : wakeupInfo.timestamp.item(this.playerCore.currentTime);
    }

    getStats() {
        const stats = {
            hasSchedule: !!this.schedulerConfig.QV,
            schedule: this.schedulerConfig.QV && {
                sleepTime: this.schedulerConfig.QV.oxb,
                originalSleepTime: this.schedulerConfig.QV.zNc,
                clockSkewAdjustments: this.schedulerConfig.QV.internal_Owa
            },
            nextWakeup: this.schedulerConfig.twa.playbackSegment,
            timeScheduled: this.schedulerConfig.Jmc,
            scheduleType: ScheduleType[this.schedulerConfig.Bza],
            numTasks: this.taskList.length,
            lastVideoSync: {
                ir: this.playerCore.zj,
                ct: this.playerCore.currentTime.playbackSegment,
                sp: this.playerCore.speed
            }
        };

        if (DEBUG) this.pauseTrace('audit', stats);
        return stats;
    }

    pauseTrace(...args) {
        this.console?.pauseTrace('RootTaskScheduler:', ...args);
    }

    error(...args) {
        this.console?.error('RootTaskScheduler:', ...args);
    }
}

export default RootTaskScheduler;
