/**
 * Netflix Cadmium Player - RequestTask
 *
 * A concrete request task that extends the base async request class.
 * Wraps a callable action with a priority level, supports pending-state
 * priority boosting and optional reuse-on-error behaviour via the
 * request scheduler.
 *
 * Originally: Module 12847 (export: h8)
 *
 * Dependencies:
 *   - Module 22970 (__extends) - tslib inheritance helper
 *   - Module 47061 (XX, completionState) - base AsyncRequest class + completion states
 *   - Module 36992 (ie.U8a) - request priority constants
 */

import { __extends } from '../modules/Module_22970';
import { XX as AsyncRequest, completionState as CompletionState } from '../modules/Module_47061';
import { ie as RequestPriority } from '../modules/Module_36992';

/**
 * @typedef {Object} RequestTaskOptions
 * @property {boolean} [reuseOnError=false] - Whether to re-enqueue the task on error
 *   instead of destroying it.
 */

/**
 * A schedulable request task that wraps an action callback.
 *
 * When the request is still pending, its scheduling priority is determined by
 * the `pendingPriority` passed at construction time.  Once the request has
 * completed (or failed), the priority falls back to a default constant.
 *
 * @extends AsyncRequest
 */
class RequestTask extends AsyncRequest {
    /**
     * @param {number} pendingPriority - Priority value used while the request is pending.
     * @param {Function} action - The callback to invoke when the task is executed.
     * @param {*} requestContext - Opaque context forwarded to the base AsyncRequest.
     * @param {RequestTaskOptions} [options={}] - Optional behaviour flags.
     */
    constructor(pendingPriority, action, requestContext, options = {}) {
        super(requestContext);

        /** @private {number} Priority while request is in pending state */
        this._pendingPriority = pendingPriority;

        /** @private {Function} The action to execute */
        this._action = action;

        /** @private {RequestTaskOptions} */
        this.options = options;
    }

    /**
     * Returns the scheduling priority for this task.
     * Uses the pending priority while the request is still pending;
     * otherwise falls back to the default priority constant.
     *
     * @returns {number} The current effective priority.
     */
    getSchedulingPriority() {
        return this.requestState === CompletionState.pending
            ? this._pendingPriority
            : RequestPriority.U8a;
    }

    /**
     * Executes the wrapped action callback.
     */
    execute() {
        this._action();
    }

    /**
     * Called by the scheduler when the task fails.
     * If `reuseOnError` is enabled, re-creates and re-enqueues the task;
     * otherwise destroys it.
     */
    reuseOnErrorCacheSize() {
        if (this.options.internal_Ild) {
            super.create();
            this.XG.zga(this);
        } else {
            this.destroy();
        }
    }
}

export { RequestTask };
export { RequestTask as h8 };
