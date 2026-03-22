/**
 * @file ObservableValue - Reactive value with change notification
 * @module events/ObservableValue
 * @description Implements an observable value (similar to a reactive signal) that
 * notifies sorted listeners when the value changes. Listeners can be prioritized
 * and the `when()` method returns a Promise that resolves when a condition is met.
 * @original Module_81734
 */

import { PRIORITY_KEY_PREFIX } from '../events/EventBusClass.js';
import { validateFunction, assert } from '../assert/Assert.js';

/** @type {number} Global counter for unique observable IDs */
let observableCounter = 0;

/**
 * An observable value that notifies listeners when it changes.
 *
 * @class ObservableValue
 * @example
 *   const bitrate = new ObservableValue(0);
 *   bitrate.addListener(onChange);
 *   bitrate.set(5000000); // Triggers onChange({ oldValue: 0, newValue: 5000000 })
 *
 *   // Wait for a specific condition
 *   await bitrate.when(v => v > 1000000);
 */
export class ObservableValue {
    /**
     * @param {*} initialValue - The initial value
     * @param {Function} [initialListener] - Optional initial listener
     */
    constructor(initialValue, initialListener) {
        /** @type {Function[]} Sorted list of subscriber functions */
        this.subscriberList = initialListener ? [initialListener] : [];

        /** @type {string} Unique ID for this observable's priority key */
        this.priorityKey = '$op$' + observableCounter++;

        /** @type {*} The current stored value */
        this._value = initialValue;

        /** @type {*} The serial number of the last change */
        this._serialNumber = undefined;
    }

    /**
     * The current value.
     * @type {*}
     * @readonly
     */
    get value() {
        return this._value;
    }

    /**
     * The serial number of the last value change.
     * @type {*}
     * @readonly
     */
    get sn() {
        return this._serialNumber;
    }

    /**
     * Add a listener that will be called when the value changes.
     * Listeners are sorted by their priority.
     *
     * @param {Function} listener - Callback function receiving `{ oldValue, newValue, sn }`
     * @param {number} [priority] - Optional priority for sort ordering
     */
    addListener(listener, priority) {
        validateFunction(listener);
        assert(this.subscriberList.indexOf(listener) < 0);

        listener[PRIORITY_KEY_PREFIX + this.priorityKey] = priority;

        // Copy-on-write to avoid mutation during iteration
        this.subscriberList = this.subscriberList.slice();
        this.subscriberList.push(listener);
        this.subscriberList.sort((a, b) => this._comparePriority(a, b));
    }

    /**
     * Remove a listener.
     * @param {Function} listener - The listener to remove
     */
    removeListener(listener) {
        validateFunction(listener);
        this.subscriberList = this.subscriberList.slice();
        const index = this.subscriberList.indexOf(listener);
        if (index >= 0) {
            this.subscriberList.splice(index, 1);
        }
    }

    /**
     * Set a new value. If the value is different from the current value,
     * all listeners are notified synchronously.
     *
     * @param {*} newValue - The new value to set
     * @param {*} [serialNumber] - Optional serial number for this change
     */
    set(newValue, serialNumber) {
        if (this._value !== newValue) {
            const changeEvent = {
                oldValue: this._value,
                newValue: newValue,
                sn: serialNumber
            };

            this._value = newValue;
            this._serialNumber = serialNumber;

            const listeners = this.subscriberList;
            const count = listeners.length;
            for (let i = 0; i < count; i++) {
                listeners[i](changeEvent);
            }
        }
    }

    /**
     * Returns a Promise that resolves when the predicate returns true for the value.
     * If the predicate is already satisfied, resolves immediately.
     *
     * @param {Function} predicate - Function that receives the value and returns boolean
     * @returns {Promise<*>} Resolves with the value that satisfies the predicate
     */
    when(predicate) {
        const self = this;
        return new Promise((resolve) => {
            function onChange(event) {
                if (predicate(event.newValue)) {
                    self.removeListener(onChange);
                    resolve(event.newValue);
                }
            }

            // Check current value first
            if (predicate(self._value)) {
                return resolve(self._value);
            }

            self.addListener(onChange);
        });
    }

    /**
     * Compare two listeners by their priority for sort ordering.
     * @private
     * @param {Function} a - First listener
     * @param {Function} b - Second listener
     * @returns {number} Sort comparison result
     */
    _comparePriority(a, b) {
        return (a[PRIORITY_KEY_PREFIX + this.priorityKey] || 0) -
               (b[PRIORITY_KEY_PREFIX + this.priorityKey] || 0);
    }
}

export default ObservableValue;
