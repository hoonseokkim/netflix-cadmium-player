/**
 * @module PrioritizedCallbackList
 * @description An injectable collection of callbacks organized by priority levels.
 * Callbacks are stored in buckets keyed by numeric priority, and can be
 * flattened into a single ordered list (lowest priority number first).
 * Supports deduplication to prevent the same callback from being registered twice.
 * @original Module_20483
 */

// Dependencies: inversify (injectable decorator)

/**
 * A prioritized list of callbacks, organized into priority-keyed buckets.
 * Used by the event system to maintain ordered listener lists.
 *
 * @injectable
 */
export class PrioritizedCallbackList {
    /**
     * @param {boolean} [deduplicate=false] - If true, prevents duplicate callbacks at the same priority
     */
    constructor(deduplicate = false) {
        /** @private */
        this._deduplicate = deduplicate;

        /**
         * Map of priority level to callback arrays.
         * @private
         * @type {Object.<number, Array<Function>>}
         */
        this._callbackMap = {
            0: []
        };
    }

    /**
     * Adds a callback at the given priority level.
     *
     * @param {Function} callback - The callback to register
     * @param {number} [priority=0] - The priority bucket (lower = higher priority)
     */
    add(callback, priority = 0) {
        const bucket = this._callbackMap[priority];
        if (bucket) {
            if (this._deduplicate && bucket.indexOf(callback) !== -1) {
                return;
            }
            bucket.push(callback);
        } else {
            this._callbackMap[priority] = [callback];
        }
    }

    /**
     * Removes a callback from the given priority level.
     *
     * @param {Function} callback - The callback to remove
     * @param {number} [priority=0] - The priority bucket to remove from
     */
    remove(callback, priority = 0) {
        this._removeCallback(callback, priority);
    }

    /**
     * Removes a callback from all priority levels.
     *
     * @param {Function} callback - The callback to remove
     */
    removeAll(callback) {
        this._removeCallback(callback);
    }

    /**
     * Returns a flattened array of all callbacks, ordered by priority (lowest first).
     *
     * @returns {Array<Function>} All callbacks in priority order
     */
    flatten() {
        return Object.keys(this._callbackMap)
            .sort()
            .reduce((result, key) => {
                return result.concat(this._callbackMap[key]);
            }, []);
    }

    /**
     * Internal method to remove a callback from one or all priority buckets.
     *
     * @private
     * @param {Function} callback - The callback to remove
     * @param {number} [priority] - If specified, only remove from this priority
     */
    _removeCallback(callback, priority) {
        Object.entries(this._callbackMap).forEach(([key, bucket]) => {
            if (priority === undefined || priority === parseInt(key)) {
                const index = bucket.indexOf(callback);
                if (index > -1) {
                    bucket.splice(index, 1);
                }
            }
        });
    }
}

export default PrioritizedCallbackList;
