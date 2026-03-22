/**
 * Netflix Cadmium Player - Queue Iterator
 *
 * Provides an async iterable queue that supports enqueue/dequeue operations,
 * item removal, and ordered iteration. Used for managing ordered sequences
 * of media requests and processing pipelines.
 *
 * @module QueueIterator
 * @original Module_89645
 */

// import { __read, __extends } from 'tslib'; // webpack 22970
// import { platform } from '../core/Platform.js'; // webpack 66164
// import { EventEmitter } from '../events/EventEmitter.js'; // webpack 90745
// import { AsyncIterator, map } from '../utils/AsyncIterator.js'; // webpack 29092
// import { u as DEBUG_ENABLED } from '../core/Debug.js'; // webpack 48170
// import { createChildLogger } from '../utils/Logger.js'; // webpack 69575
// import { assert } from '../assert/Assert.js'; // webpack 52571
// import { mixin } from '../utils/Mixin.js'; // webpack 85254

/**
 * Unwraps a queue iterator result, calling the acknowledgment callback
 * @param {IteratorResult} result - The iterator result
 * @returns {IteratorResult} The unwrapped result with value only
 */
function unwrapAcknowledged(result) {
    result.acknowledge();
    return {
        done: false,
        value: result.value
    };
}

/**
 * Wraps an iterator result with an acknowledgment callback
 * @param {IteratorResult} result - The raw iterator result
 * @param {Function} acknowledge - The acknowledgment callback
 * @returns {IteratorResult} The wrapped result
 */
function wrapWithAcknowledge(result, acknowledge) {
    if (result.done) return result;
    return {
        value: {
            value: result.value,
            acknowledge
        }
    };
}

/**
 * Maps a queue iterator to auto-acknowledge items on iteration.
 * @param {AsyncIterator} iterator - The queue iterator to wrap
 * @returns {AsyncIterator} An iterator that auto-acknowledges items
 */
export function autoAcknowledge(iterator) {
    return map(iterator, unwrapAcknowledged);
}

/**
 * A queue that supports async iteration with ordered item tracking.
 * Items can be enqueued, dequeued, cleared, and iterated over.
 * Extends EventEmitter for "onRemoved" and "onDequeue" events.
 */
export class QueueIterator {
    /**
     * @param {Object} logger - Logger instance
     * @param {*} maxLength - Maximum queue length (undefined = unlimited)
     */
    constructor(logger, maxLength) {
        /** @type {Object} Logger instance */
        this.logger = logger;

        /** @type {number|undefined} Maximum number of items (undefined = unlimited) */
        this._maxLength = maxLength;

        /** @type {number} Total number of pruned items */
        this._prunedCount = 0;

        /** @type {number} Next unique item ID */
        this._nextId = 0;

        /** @type {Array<QueueEntry>} The internal queue of entries */
        this._queue = [];

        this.logger = createChildLogger(platform, this.logger, "QueueIterator:");
    }

    /**
     * Gets the total number of pruned items
     * @returns {number}
     */
    get prunedCount() {
        return this._prunedCount;
    }

    /**
     * Number of resolved items at the front of the queue
     * @returns {number}
     */
    get resolvedFrontCount() {
        let i;
        for (i = 0; i < this._queue.length; i++) {
            const entry = this._queue[i];
            if (!entry.isResolved || entry.item?.done) break;
        }
        return i;
    }

    /**
     * Gets the current count/max-length
     * @returns {number|undefined}
     */
    get count() {
        return this._maxLength;
    }

    /**
     * Whether the queue is empty (maxLength is 0)
     * @returns {boolean}
     */
    get isEmpty() {
        return this._maxLength === 0;
    }

    /**
     * Number of requested items at the front of the queue
     * @returns {number}
     */
    get requestedFrontCount() {
        let i;
        for (i = 0; i < this._queue.length && this._queue[i].isRequested; i++);
        return i;
    }

    /**
     * Gets the head value of the queue (first non-done item)
     * @returns {*} The value of the first item, or undefined
     */
    get head() {
        const first = this._queue[0];
        const item = first && first.item;
        return item && !item.done && item.value;
    }

    /**
     * Number of items at the front that have been resolved
     * @returns {number}
     */
    get resolvedCount() {
        let i;
        for (i = 0; i < this._queue.length && this._queue[i].isResolved; i++);
        return i;
    }

    /**
     * Sets the end marker for the queue
     */
    setEndMarker() {
        if (this._maxLength === undefined) {
            const logger = this.logger;
            DEBUG_ENABLED && logger && logger.trace("QueueIterator: enqueueEnd");
            this._updateCount(this.resolvedCount - (this._maxLength || 0));
        }
    }

    /**
     * Returns an array of all items in the queue
     * @returns {Array<IteratorResult>}
     */
    getItems() {
        return this._queue.map(entry => entry.item);
    }

    /**
     * Returns cached array of active (non-done) values
     * @returns {Array<*>}
     */
    getActiveValues() {
        if (!this._cachedValues) {
            this._cachedValues = this._queue
                .filter(entry => entry?.item && !entry.item.done)
                .map(entry => entry.item.value);
        }
        return this._cachedValues;
    }

    /**
     * Updates the internal count/maxLength
     * @param {number|undefined} delta - Change in count
     * @private
     */
    _updateCount(delta) {
        DEBUG_ENABLED && this.logger.trace("updateCount", {
            currentCount: this._maxLength,
            delta
        });

        if (this._maxLength !== undefined) {
            const entry = this._queue[this._maxLength];
            if (entry) this._resetEntry(entry);
        }

        this._maxLength = this._maxLength === undefined
            ? delta
            : delta === undefined
                ? delta
                : this._maxLength + delta;

        if (this._maxLength !== undefined) {
            this._maxLength = Math.max(0, this._maxLength);
            const entry = this._queue[this._maxLength];
            if (entry) {
                entry.resultDeferred.resolve({ done: true });
            }
        }
    }

    /**
     * Enqueues a value into the queue
     * @param {*} value - The value to enqueue
     * @returns {Promise} Resolves when the item is consumed
     */
    enqueue(value) {
        DEBUG_ENABLED && this.logger.trace("Enqueue called");
        const index = this.resolvedCount;
        this._invalidateCache();
        return this._provideResult(index, { value, done: false }).completionDeferred.promise;
    }

    /**
     * Resets the end marker
     */
    resetEnd() {
        DEBUG_ENABLED && this.logger.trace("resetEnd");
        this._updateCount(undefined);
    }

    /**
     * Clears the queue, optionally setting a new max length
     * @param {number} [newMaxLength] - New maximum length
     */
    clear(newMaxLength) {
        DEBUG_ENABLED && this.logger.trace("clear");
        this._prune();

        const requestedCount = this.requestedFrontCount;
        const removeCount = this._queue.length - requestedCount;

        if (removeCount > 0) {
            const removeInfo = { index: requestedCount, count: removeCount };
            DEBUG_ENABLED && this.logger.trace("Removing items", removeInfo);
            this._queue.splice(requestedCount, removeCount);
            this._invalidateCache();
            this.emit("onRemoved", removeInfo);
        }

        for (let i = 1; i < requestedCount; i++) {
            this._resetEntry(this._queue[i]);
        }

        this._maxLength = undefined;
        this._updateCount(newMaxLength ? newMaxLength + requestedCount : newMaxLength);
        if (this._prunedCount) this._prunedCount = 0;
    }

    /**
     * Creates a new iterator instance for this queue
     * @returns {QueueIteratorInstance}
     */
    getIterator() {
        const self = this;
        const logger = createChildLogger(platform, this.logger, "QueueIteratorInstance::");
        return new QueueIteratorInstance(this, (index) => self._getNextItem(index), logger);
    }

    /**
     * Dequeues the front item from the queue
     */
    dequeue() {
        if (this.requestedFrontCount > 0) {
            const first = this._queue[0];
            if (first.isResolved) {
                DEBUG_ENABLED && this.logger.trace("dequeue", first.id);
                this._prune(1);
                this.emit("onDequeue", first.resultDeferred.promise);
            }
        }
    }

    /**
     * Removes a specific value from the queue
     * @param {*} value - The value to remove
     */
    remove(value) {
        for (let i = 0; i < this._queue.length; i++) {
            const entry = this._queue[i];
            const item = entry.item;
            if (item && !item.done && item.value === value) {
                this._queue.splice(i, 1);
                if (this._maxLength && this._maxLength > i) this._maxLength--;
                this._invalidateCache();
                DEBUG_ENABLED && this.logger.trace("removed", { id: entry.id });
                this.emit("onRemoved", { index: i, count: 1 });
                break;
            }
        }
    }

    /**
     * Prunes consumed items from the front of the queue
     * @param {number} [count] - Number of items to prune
     * @private
     */
    _prune(count) {
        count = count || Math.min(this.requestedFrontCount, this.resolvedCount);
        if (count > 0) {
            const pruned = this._queue.splice(0, count);
            this._invalidateCache();
            if (this._maxLength) this._maxLength -= count;
            DEBUG_ENABLED && this.logger.trace("pruned", count);

            Promise.resolve().then(() => {
                pruned.forEach(entry => entry.completionDeferred.resolve());
            });

            this.emit("onRemoved", { index: 0, count });
            this._prunedCount += count;
        }
    }

    /**
     * Gets the next item at the given index
     * @param {number} index - Queue index
     * @returns {Promise<IteratorResult>}
     * @private
     */
    _getNextItem(index) {
        DEBUG_ENABLED && this.logger.trace("getNextItemCalled", { offset: index });

        let promise;
        if (this.length === undefined || this.length > 0) {
            this._ensureEntry(index);
            const entry = this._queue[index];
            entry.requestDeferred.resolve();
            promise = entry.resultDeferred.promise;
            DEBUG_ENABLED && this.logger.trace("getNextItem:return", { id: entry.id });
        } else {
            DEBUG_ENABLED && this.logger.trace("getNextItem:returnDone");
            promise = Promise.resolve({ done: true });
        }
        return promise;
    }

    /**
     * Provides a result at the given queue index
     * @param {number} index - Queue index
     * @param {IteratorResult} result - The result to provide
     * @returns {QueueEntry} The queue entry
     * @private
     */
    _provideResult(index, result) {
        let debugValue = !result.done && result.value;
        debugValue = debugValue && debugValue.toJSON ? debugValue.toJSON() : debugValue;
        DEBUG_ENABLED && this.logger.trace("Providing result", { index, item: debugValue });

        this._ensureEntry(index);
        const entry = this._queue[index];
        entry.resultDeferred.resolve(result);
        return entry;
    }

    /**
     * Ensures a queue entry exists at the given index
     * @param {number} index - Queue index
     * @private
     */
    _ensureEntry(index) {
        if (this._queue[index] === undefined) {
            const entry = {};
            this._resetEntry(entry);
            this._queue[index] = entry;

            if (index === this._maxLength) {
                entry.resultDeferred.resolve({ done: true });
            }

            DEBUG_ENABLED && this.logger.trace("Item initialized", { index });
        }
    }

    /**
     * Creates a deferred promise with an optional callback
     * @param {Function} [callback] - Optional resolve callback
     * @returns {{promise: Promise, resolve: Function, reject: Function}}
     * @private
     */
    _createDeferred(callback) {
        const deferred = {};
        deferred.promise = new Promise((resolve, reject) => {
            deferred.resolve = (value) => {
                resolve(value);
                if (callback) callback(value);
            };
            deferred.reject = reject;
        });
        return deferred;
    }

    /**
     * Resets a queue entry with new deferreds
     * @param {QueueEntry} entry - The entry to reset
     * @private
     */
    _resetEntry(entry) {
        const self = this;

        entry.resultDeferred = this._createDeferred((result) => {
            entry.item = result;
            entry.isResolved = true;
            DEBUG_ENABLED && self.logger.trace("Item resolved", { id: entry.id });
        });

        if (entry.id && entry.isRequested && !entry.isResolved) {
            entry.resultDeferred.resolve({ done: true });
            DEBUG_ENABLED && this.logger.warn("Overwriting requested queue item", entry.id);
        }

        entry.completionDeferred = this._createDeferred();
        entry.requestDeferred = this._createDeferred(() => {
            entry.isRequested = true;
            DEBUG_ENABLED && self.logger.trace("Item requested", { id: entry.id });
        });

        entry.id = this._nextId++;
        entry.isRequested = false;
        entry.isResolved = false;
        entry.item = undefined;
    }

    /**
     * Invalidates the cached values array
     * @private
     */
    _invalidateCache() {
        this._cachedValues = undefined;
    }

    /**
     * Creates an acknowledging iterator that dequeues items when acknowledged
     * @returns {QueueIteratorInstance}
     */
    createAcknowledgingIterator() {
        const self = this;
        const logger = createChildLogger(platform, this.logger, "QueueIteratorInstance::");

        const iterator = new QueueIteratorInstance(this, (index) => {
            if (self.length === 0) {
                return AsyncIterator.done();
            }

            const promise = self._getNextItem(index);
            const headEntry = self._queue[0];

            return promise.then((result) => {
                return wrapWithAcknowledge(result, () => {
                    if (!iterator._disposed) {
                        if (headEntry === self._queue[0]) {
                            self.dequeue();
                        } else {
                            assert(
                                !self._queue.filter(e => e.resultDeferred.promise === promise).length,
                                "Out of order acknowledgements are not supported"
                            );
                        }
                    }
                });
            });
        }, logger);

        return iterator;
    }
}

// Mixin EventEmitter onto QueueIterator
// mixin(EventEmitter, QueueIterator);

/**
 * An iterator instance that tracks its position in a QueueIterator.
 * Automatically adjusts its index when items are removed from the queue.
 */
export class QueueIteratorInstance extends AsyncIterator {
    /**
     * @param {QueueIterator} parent - The parent queue
     * @param {Function} getNextFn - Function to get next item by index
     * @param {Object} logger - Logger instance
     */
    constructor(parent, getNextFn, logger) {
        super(function () {
            DEBUG_ENABLED && this.logger.trace("Next item requested", { index: this.index });
            return this._getNext(this.index++);
        });

        /** @type {QueueIterator} */
        this.parent = parent;

        /** @type {Function} */
        this._getNext = getNextFn;

        /** @type {Object} */
        this.logger = logger;

        /** @type {boolean} */
        this._disposed = false;

        /** @type {number} Current iteration index */
        this.index = 0;

        /** @type {boolean} Whether listening to removal events */
        this._listening = false;

        /** @type {Function} Handler for item removal events */
        this._onRemoved = (event) => {
            const removedIndex = event.index;
            const removedCount = event.count;
            if (this.index >= removedIndex) {
                this.index = Math.max(removedIndex, this.index - removedCount);
            }
            DEBUG_ENABLED && this.logger?.trace("QueueIteratorInstance: onRemoved modified", this.index);
        };
    }

    /**
     * Cleans up the iterator
     */
    cleanup() {
        this.logger.trace("disposed");
        this._disposed = true;
        this._unsubscribe();
        super.cleanup();
    }

    /**
     * Gets the next value from the iterator
     * @returns {Promise<IteratorResult>}
     */
    next() {
        if (!this._disposed) this._subscribe();
        return super.next();
    }

    /**
     * Cancels the iterator
     * @returns {Promise<IteratorResult>}
     */
    cancel() {
        this._unsubscribe();
        return super.cancel();
    }

    /**
     * Unsubscribes from parent removal events
     * @private
     */
    _unsubscribe() {
        this.parent.removeListener("onRemoved", this._onRemoved);
        this._listening = false;
    }

    /**
     * Subscribes to parent removal events
     * @private
     */
    _subscribe() {
        if (!this._listening) {
            this._listening = true;
            this.parent.on("onRemoved", this._onRemoved);
        }
    }
}
