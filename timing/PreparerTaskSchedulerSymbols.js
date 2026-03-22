/**
 * @file PreparerTaskSchedulerSymbols - Event types and DI token for task scheduling
 * @module timing/PreparerTaskSchedulerSymbols
 * @description Defines the event type constants for the preparer task scheduler
 * lifecycle (start, abort, fail, success) and the DI symbol for the scheduler.
 * The preparer task scheduler manages pre-loading and preparation tasks that
 * run before playback begins.
 * @original Module_87657
 */

/**
 * Task scheduler lifecycle event types.
 * @type {Object<string, string>}
 */
export const TaskSchedulerEvents = {
    /** A task has started execution */
    TASK_START: 'taskstart',
    /** A task was aborted before completion */
    TASK_ABORT: 'taskabort',
    /** A task failed with an error */
    TASK_FAIL: 'taskfail',
    /** A task completed successfully */
    TASK_SUCCESS: 'tasksuccess'
};

/**
 * DI symbol for the preparer task scheduler.
 * @type {string}
 */
export const PreparerTaskSchedulerSymbol = 'PreparerTaskSchedulerSymbol';

export default {
    TaskSchedulerEvents,
    PreparerTaskSchedulerSymbol
};
