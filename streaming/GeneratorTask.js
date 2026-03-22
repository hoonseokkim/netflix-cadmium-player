/**
 * Netflix Cadmium Player - Generator-Based Task
 * Deobfuscated from Module_84007
 *
 * A task implementation that wraps a generator function, allowing
 * cooperative multitasking via yield points. Each call to execute()
 * advances the generator one step. Supports cancellation and restart.
 */

import { __extends } from '../core/tslib';
import { platform } from '../core/Platform';
import { TimeUtil } from '../core/TimeUtil';
import { assert } from '../assert/Assert';
import { TaskState, BaseTask } from './RequestTask';
import { WakeupSchedule } from '../streaming/WakeupSchedule';

/**
 * Task that executes a generator function step-by-step.
 * Extends BaseTask to integrate with the task scheduler.
 */
const GeneratorTask = (function (BaseTaskClass) {

    /**
     * @param {Function} generatorFactory - Factory function that returns an iterator/generator
     * @param {*} taskGroup - The task group this task belongs to
     * @param {*} taskConfig - Task configuration
     */
    function GeneratorTask(generatorFactory, taskGroup, taskConfig) {
        const self = BaseTaskClass.call(this, taskGroup, taskConfig) || this;
        self.generatorFactory = generatorFactory;
        self.isExecuting = false;
        self.cancelRequested = false;
        self.create();
        return self;
    }

    __extends(GeneratorTask, BaseTaskClass);

    /**
     * Creates or restarts the generator.
     * Cancels any currently running generator before creating a new one.
     */
    GeneratorTask.prototype.create = function () {
        if (this.requestState === TaskState.running || this.requestState === TaskState.pending) {
            var _a, _b;
            (_b = (_a = this.generator) === null || _a === void 0 ? void 0 : _a.return) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
        BaseTaskClass.prototype.create.call(this);
        this.generator = this.generatorFactory();
        this.cancelRequested = false;
        this.nextWakeup = WakeupSchedule.createManifestUrlFetch(TimeUtil.seekToSample);
    };

    /**
     * Restarts the generator task on error, reusing the cache.
     */
    GeneratorTask.prototype.reuseOnErrorCacheSize = function () {
        this.create();
        assert(this.taskGroup);
        this.taskGroup.rescheduleTask(this);
    };

    /**
     * Returns the current wakeup schedule for this task.
     * @returns {Object} The next scheduled wakeup descriptor
     */
    GeneratorTask.prototype.getNextWakeup = function () {
        return this.nextWakeup;
    };

    /**
     * Executes one step of the generator.
     * Advances the generator by calling next() and updates
     * the wakeup schedule based on the yielded value.
     */
    GeneratorTask.prototype.execute = function () {
        var _a, _b, _c;
        var result;
        try {
            this.isExecuting = true;
            result = ((_a = this.generator) === null || _a === void 0 ? void 0 : _a.next()) || { done: true };
        } finally {
            this.isExecuting = false;
            this.lastRunMono = platform.platform.now();
            this.processPendingCancel();
        }

        if (result.done) {
            this.nextWakeup = WakeupSchedule.completed;
            (_c = (_b = this.generator) === null || _b === void 0 ? void 0 : _b.return) === null || _c === void 0 ? void 0 : _c.call(_b);
            this.generator = undefined;
        } else {
            this.nextWakeup = result.value;
        }
    };

    /**
     * Processes any pending cancel request that occurred during execution.
     */
    GeneratorTask.prototype.processPendingCancel = function () {
        if (this.cancelRequested) {
            this.cancelGenerator();
        }
    };

    /**
     * Cancels the generator. If currently executing, defers the cancel
     * until execution completes to avoid inconsistent state.
     */
    GeneratorTask.prototype.cancelGenerator = function () {
        var _a, _b;
        if (this.isExecuting) {
            this.cancelRequested = true;
        } else {
            this.cancelRequested = false;
            (_b = (_a = this.generator) === null || _a === void 0 ? void 0 : _a.return) === null || _b === void 0 ? void 0 : _b.call(_a);
            this.generator = undefined;
        }
    };

    /**
     * Destroys the task, cancelling the generator and calling the base destroy.
     */
    GeneratorTask.prototype.destroy = function () {
        this.cancelGenerator();
        BaseTaskClass.prototype.destroy.call(this);
    };

    /**
     * Returns diagnostic stats for this task.
     * @returns {Object} Task state, next wakeup info, and last run timestamp
     */
    GeneratorTask.prototype.getStats = function () {
        return {
            state: TaskState[this.state],
            nextWakeup: {
                ms: this.nextWakeup.timestamp.playbackSegment,
                type: WakeupSchedule.WakeupType[this.nextWakeup.type]
            },
            lastRunMono: this.lastRunMono
        };
    };

    return GeneratorTask;
})(BaseTask);

export { GeneratorTask };
