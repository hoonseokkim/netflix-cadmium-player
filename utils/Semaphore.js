/**
 * @file Semaphore - Counting semaphore for async concurrency control
 * @module utils/Semaphore
 * @description Implements a counting semaphore that manages access to a finite
 * number of resources. Waiters are queued in FIFO order and can be cancelled
 * or timed out. Used to throttle concurrent operations (e.g., network requests).
 * @original Module_81214
 */

import MaxInteger from '../core/MaxInteger.js';
import asyncComplete from '../utils/AsyncComplete.js';
import NfError from '../core/NfError.js';

/**
 * Advances to the next waiter ID, wrapping around at MaxInteger.
 * @param {number} id - Current waiter ID
 * @returns {number} Next waiter ID
 */
function nextId(id) {
    return id === MaxInteger.MAX_SAFE_INTEGER ? 1 : id + 1;
}

/**
 * Finds the next active waiter in the queue starting from the current head.
 * @param {Semaphore} semaphore - The semaphore instance
 * @returns {number} The ID of the next active waiter, or 0 if none
 */
function findNextWaiter(semaphore) {
    if (Object.keys(semaphore.waiters).length === 0) {
        return 0;
    }
    let id = nextId(semaphore.headWaiterId);
    while (!semaphore.waiters[id]) {
        id = nextId(id);
    }
    return id;
}

/**
 * Counting semaphore for controlling concurrent access to a limited resource pool.
 *
 * @class Semaphore
 * @example
 *   const sem = new Semaphore(3); // Allow 3 concurrent operations
 *   const waiterId = sem.wait(5000, callback); // Wait up to 5s for a resource
 *   // ... use resource ...
 *   sem.signal(); // Release resource back to pool
 */
export class Semaphore {
    /**
     * @param {number} count - Initial number of available resources
     */
    constructor(count) {
        /** @type {number} Maximum resource count (initial value) */
        this.maxCount = count;

        /** @type {number} Currently available resources */
        this.availableCount = count;

        /** @type {Object<number, Function>} Map of waiter ID to resolve callback */
        this.waiters = {};

        /** @type {number} ID of the first (oldest) waiter in the queue */
        this.headWaiterId = 0;

        /** @type {number} Monotonically increasing ID counter for new waiters */
        this.nextWaiterId = 0;
    }

    /**
     * Cancel a specific waiter by ID.
     * The waiter's callback is invoked with `false` to indicate cancellation.
     * @param {number} waiterId - The ID returned from `wait()`
     */
    cancel(waiterId) {
        if (this.waiters[waiterId]) {
            this.waiters[waiterId].call(this, false);
            delete this.waiters[waiterId];
            if (waiterId === this.headWaiterId) {
                this.headWaiterId = findNextWaiter(this);
            }
        }
    }

    /**
     * Cancel all pending waiters in the queue.
     */
    cancelAll() {
        while (this.headWaiterId !== 0) {
            this.cancel(this.headWaiterId);
        }
    }

    /**
     * Wait for a resource to become available.
     *
     * If a resource is immediately available, the callback fires asynchronously
     * with `result(true)`. Otherwise the waiter is enqueued.
     *
     * @param {number} timeoutMs - Timeout in ms (-1 for no timeout)
     * @param {Object} callback - Callback object with `result`, `timeout`, `error` methods
     * @returns {number} Waiter ID (0 if resource was immediately available)
     */
    wait(timeoutMs, callback) {
        const self = this;

        // Resource immediately available
        if (this.availableCount > 0) {
            --this.availableCount;
            setTimeout(() => {
                callback.result(true);
            }, 0);
            return 0;
        }

        // Enqueue this waiter
        const waiterId = nextId(this.nextWaiterId);
        this.nextWaiterId = waiterId;

        asyncComplete(callback, () => {
            let timeoutHandle;

            // Set up timeout if requested
            if (timeoutMs !== -1) {
                timeoutHandle = setTimeout(() => {
                    delete self.waiters[waiterId];
                    if (waiterId === self.headWaiterId) {
                        self.headWaiterId = findNextWaiter(self);
                    }
                    callback.timeout();
                }, timeoutMs);
            }

            // Register the waiter callback
            self.waiters[waiterId] = (signaled) => {
                clearTimeout(timeoutHandle);
                if (signaled) {
                    if (self.availableCount <= 0) {
                        setTimeout(() => {
                            callback.error(new NfError('Semaphore waiter signaled without any available resources.'));
                        }, 0);
                        return;
                    }
                    --self.availableCount;
                }
                setTimeout(() => {
                    callback.result(signaled);
                }, 0);
            };

            // Set head if this is the first waiter
            if (!self.headWaiterId) {
                self.headWaiterId = waiterId;
            }
        });

        return waiterId;
    }

    /**
     * Signal that a resource has been released back to the pool.
     * Wakes the oldest waiter if any are queued.
     * @throws {NfError} If all resources are already available (double-signal)
     */
    signal() {
        if (this.availableCount === this.maxCount) {
            throw new NfError('Semaphore signaled despite all resources being already available.');
        }

        ++this.availableCount;

        if (this.headWaiterId) {
            const waiterCallback = this.waiters[this.headWaiterId];
            delete this.waiters[this.headWaiterId];
            this.headWaiterId = findNextWaiter(this);
            waiterCallback.call(this, true);
        }
    }
}

export default Semaphore;
