/**
 * Netflix Cadmium Player - Waitable Queue
 *
 * A queue that supports waiting for items with timeout. Consumers register
 * wait handlers that are resolved when items arrive, with optional timeouts.
 *
 * @module WaitableQueue
 * @original Module_89752
 */

// import { default as MaxCounter } from '../utils/MaxCounter.js'; // webpack 51411
// import { default as CancelGuard } from '../utils/CancelGuard.js'; // webpack 79804

/**
 * Finds the next active wait handler in the circular queue
 * @param {WaitableQueue} queue - The queue instance
 * @returns {number} The next active handler ID, or 0 if none
 */
function findNextActiveHandler(queue) {
    if (Object.keys(queue._waitHandlers).length === 0) return 0;
    let id = nextId(queue._currentHandlerId);
    while (!queue._waitHandlers[id]) {
        id = nextId(id);
    }
    return id;
}

/**
 * Computes the next handler ID, wrapping around at max counter value
 * @param {number} id - Current handler ID
 * @returns {number} Next handler ID
 */
function nextId(id) {
    return id === MaxCounter.MAX_VALUE ? 1 : id + 1;
}

/**
 * A queue where consumers can register wait operations that resolve
 * when items are provided. Supports timeout-based cancellation.
 */
export class WaitableQueue {
    constructor() {
        /** @type {Array<*>} Buffer of items waiting for consumers */
        this._pendingItems = [];

        /** @type {Object<number, Function>} Active wait handler callbacks keyed by ID */
        this._waitHandlers = {};

        /** @type {number} Currently active handler ID */
        this._currentHandlerId = 0;

        /** @type {number} Last assigned handler ID */
        this._lastHandlerId = 0;
    }

    /**
     * Cancels a specific wait handler by ID
     * @param {number} handlerId - The handler ID to cancel
     */
    cancel(handlerId) {
        if (this._waitHandlers[handlerId]) {
            const handler = this._waitHandlers[handlerId];
            delete this._waitHandlers[handlerId];
            if (handlerId === this._currentHandlerId) {
                this._currentHandlerId = findNextActiveHandler(this);
            }
            handler.call(this, undefined);
        }
    }

    /**
     * Cancels all active wait handlers
     */
    cancelAll() {
        while (this._currentHandlerId !== 0) {
            this.cancel(this._currentHandlerId);
        }
    }

    /**
     * Registers a wait operation with optional timeout
     * @param {number} timeout - Timeout in ms (-1 for no timeout)
     * @param {Object} callbacks - Object with result() and timeout() methods
     * @returns {number} The handler ID for cancellation
     */
    wait(timeout, callbacks) {
        const self = this;
        const handlerId = nextId(this._lastHandlerId);
        this._lastHandlerId = handlerId;

        CancelGuard(callbacks, () => {
            if (self._pendingItems.length > 0) {
                const item = self._pendingItems.shift();
                setTimeout(() => {
                    callbacks.result(item);
                }, 0);
            } else {
                let timeoutHandle;
                if (timeout !== -1) {
                    timeoutHandle = setTimeout(() => {
                        delete self._waitHandlers[handlerId];
                        if (handlerId === self._currentHandlerId) {
                            self._currentHandlerId = findNextActiveHandler(self);
                        }
                        callbacks.timeout();
                    }, timeout);
                }

                self._waitHandlers[handlerId] = (value) => {
                    clearTimeout(timeoutHandle);
                    setTimeout(() => {
                        callbacks.result(value);
                    }, 0);
                };

                if (!self._currentHandlerId) {
                    self._currentHandlerId = handlerId;
                }
            }
        });

        return handlerId;
    }

    /**
     * Provides an item to the queue. If a handler is waiting, resolves it
     * immediately. Otherwise buffers the item.
     * @param {*} item - The item to provide
     */
    provide(item) {
        if (this._currentHandlerId) {
            const handler = this._waitHandlers[this._currentHandlerId];
            delete this._waitHandlers[this._currentHandlerId];
            this._currentHandlerId = findNextActiveHandler(this);
            handler.call(this, item);
        } else {
            this._pendingItems.push(item);
        }
    }
}
