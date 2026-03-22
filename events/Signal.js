/**
 * Signal and SignalTracker - Reactive value observation primitives
 *
 * Signal is a reactive value container that notifies listeners when set.
 * SignalTracker manages subscriptions to multiple signals and provides
 * cleanup/unsubscribe functionality.
 *
 * @module events/Signal
 * @original Module_61113
 */

// import { findLast } from '../utils/array';

/**
 * A reactive value container that supports persistent and one-shot listeners.
 *
 * When a value is set, all persistent listeners are called first,
 * then all one-shot listeners are called and cleared.
 */
export class Signal {
    /**
     * @param {*} [initialValue] - Optional initial value
     */
    constructor(initialValue) {
        /** @private */
        this.currentValue = initialValue;
        /** @type {Array<Function>} Persistent listeners */
        this.listeners = [];
        /** @type {Array<Function>} One-shot listeners */
        this.onceListeners = [];
    }

    /** @returns {*} The current value */
    get value() {
        return this.currentValue;
    }

    /**
     * Sets the signal value and notifies all listeners.
     *
     * Persistent listeners fire first. One-shot listeners are cleared
     * after being called.
     *
     * @param {*} newValue - The new value
     */
    set(newValue) {
        this.currentValue = newValue;

        // Move once-listeners to a local copy and clear them before firing
        const pendingOnce = this.onceListeners;
        this.onceListeners = [];

        this.listeners.forEach((listener) => listener(newValue));
        pendingOnce.forEach((listener) => listener(newValue));
    }

    /**
     * Clears the current value (sets to undefined).
     */
    reset() {
        this.currentValue = undefined;
    }

    /**
     * Registers a persistent listener.
     * If the signal already has a value, the listener is called immediately.
     *
     * @param {Function} listener - Callback receiving the value
     */
    on(listener) {
        this.listeners = this.listeners.concat([listener]);
        if (this.currentValue !== undefined) {
            listener(this.currentValue);
        }
    }

    /**
     * Registers a one-shot listener.
     * If the signal already has a value, the listener is called immediately
     * and is NOT added to the pending queue.
     *
     * @param {Function} listener - Callback receiving the value
     */
    once(listener) {
        if (this.currentValue !== undefined) {
            listener(this.currentValue);
        } else {
            this.onceListeners.push(listener);
        }
    }

    /**
     * Removes a specific listener (persistent or one-shot).
     *
     * @param {Function} listener - The listener to remove
     */
    removeListener(listener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
        this.onceListeners = this.onceListeners.filter((l) => l !== listener);
    }
}

/**
 * Tracks subscriptions to multiple Signals and enables bulk cleanup.
 */
export class SignalTracker {
    constructor() {
        /** @type {Array<{signal: Signal, listener: Function, wrappedOnce?: Function}>} */
        this.subscriptions = [];
    }

    /**
     * Subscribes to a signal with a persistent listener.
     *
     * @param {Signal} signal - The signal to observe
     * @param {Function} listener - The listener callback
     */
    on(signal, listener) {
        this.subscriptions.push({ signal, listener });
        signal.on(listener);
    }

    /**
     * Subscribes to a signal with a one-shot listener.
     *
     * If the signal does not yet have a value, wraps the listener
     * so it can be properly removed during cleanup.
     *
     * @param {Signal} signal
     * @param {Function} listener
     */
    once(signal, listener) {
        if (signal.value === undefined) {
            const wrappedOnce = (value) => {
                this.removeSubscription(signal, listener);
                listener(value);
            };
            this.subscriptions.push({ signal, listener, wrappedOnce });
            signal.once(wrappedOnce);
        } else {
            signal.once(listener);
        }
    }

    /**
     * Removes a specific subscription.
     *
     * @param {Signal} signal
     * @param {Function} listener
     */
    removeListener(signal, listener) {
        const entry = findLast(this.subscriptions, (s) => s.signal === signal && s.listener === listener);
        if (entry !== undefined) {
            signal.removeListener(entry.wrappedOnce || entry.listener);
        }
        this.removeSubscription(signal, listener);
    }

    /**
     * Removes all subscriptions and unregisters all listeners.
     */
    removeAllListeners() {
        this.subscriptions.forEach((entry) => {
            entry.signal.removeListener(entry.wrappedOnce || entry.listener);
        });
        this.subscriptions = [];
    }

    /**
     * Removes a subscription entry from the internal list.
     * @private
     */
    removeSubscription(signal, listener) {
        this.subscriptions = this.subscriptions.filter(
            (entry) => entry.signal !== signal || entry.listener !== listener
        );
    }
}
