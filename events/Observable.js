/**
 * Netflix Cadmium Player - Observable
 *
 * A reactive observable value that notifies subscribers when it changes.
 * Subscribers are sorted by priority and receive change notifications
 * with both old and new values.
 *
 * @module Module_81734
 */

// import { OBSERVABLE_PRIORITY_PREFIX } from '../config/PlayerConfiguration.js'; // webpack module 33096
// import { assert, assertFunction } from '../config/PlayerConfiguration.js';     // webpack module 45146

let observableCounter = 0;

/**
 * Observable value that notifies subscribers on change.
 */
export class Observable {
    /**
     * @param {*} initialValue - Initial value of the observable
     * @param {Function} [initialSubscriber] - Optional initial subscriber
     */
    constructor(initialValue, initialSubscriber) {
        /** @type {Array<Function>} List of subscriber callbacks, sorted by priority */
        this._subscribers = initialSubscriber ? [initialSubscriber] : [];
        /** @type {string} Unique priority key for this observable instance */
        this._priorityKey = "$op$" + observableCounter++;
        /** @type {*} Current value */
        this._currentValue = initialValue;
        /** @type {*} Source/reason for last change */
        this._lastSource = undefined;
    }

    /**
     * Current value of the observable.
     * @type {*}
     */
    get value() {
        return this._currentValue;
    }

    /**
     * Source/reason for the last value change.
     * @type {*}
     */
    get source() {
        return this._lastSource;
    }

    /**
     * Add a subscriber that will be called when the value changes.
     * Subscribers are sorted by priority (lower priority number = called first).
     * @param {Function} callback - Subscriber function receiving { oldValue, newValue, sn }
     * @param {number} [priority=0] - Subscriber priority for ordering
     */
    addListener(callback, priority) {
        assertFunction(callback);
        assert(this._subscribers.indexOf(callback) < 0);
        callback[OBSERVABLE_PRIORITY_PREFIX + this._priorityKey] = priority;
        this._subscribers = this._subscribers.slice();
        this._subscribers.push(callback);
        this._subscribers.sort((a, b) => this._comparePriority(a, b));
    }

    /**
     * Remove a subscriber.
     * @param {Function} callback - Previously registered subscriber
     */
    removeListener(callback) {
        assertFunction(callback);
        this._subscribers = this._subscribers.slice();
        const index = this._subscribers.indexOf(callback);
        if (index >= 0) this._subscribers.splice(index, 1);
    }

    /**
     * Set a new value and notify all subscribers if the value changed.
     * @param {*} newValue - New value to set
     * @param {*} [source] - Source/reason for the change
     */
    set(newValue, source) {
        if (this._currentValue !== newValue) {
            const change = {
                oldValue: this._currentValue,
                newValue: newValue,
                sn: source
            };
            this._currentValue = newValue;
            this._lastSource = source;
            const subscribers = this._subscribers;
            const len = subscribers.length;
            for (let i = 0; i < len; i++) {
                subscribers[i](change);
            }
        }
    }

    /**
     * Returns a Promise that resolves when the value satisfies a predicate.
     * If the current value already satisfies it, resolves immediately.
     * @param {Function} predicate - Function that returns true when condition is met
     * @returns {Promise<*>} Resolves with the satisfying value
     */
    when(predicate) {
        return new Promise((resolve) => {
            const listener = (change) => {
                if (predicate(change.newValue)) {
                    this.removeListener(listener);
                    resolve(change.newValue);
                }
            };
            if (predicate(this._currentValue)) {
                return resolve(this._currentValue);
            }
            this.addListener(listener);
        });
    }

    /**
     * Compare two subscribers by their priority values.
     * @private
     */
    _comparePriority(a, b) {
        return (a[OBSERVABLE_PRIORITY_PREFIX + this._priorityKey] || 0) -
               (b[OBSERVABLE_PRIORITY_PREFIX + this._priorityKey] || 0);
    }
}
