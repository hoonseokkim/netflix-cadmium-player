/**
 * Netflix Cadmium Player - EventEmitter
 *
 * Simple event emitter used throughout the player for pub/sub event handling.
 * Supports synchronous and asynchronous event dispatch.
 *
 * @module Module_94886
 */

// import { scheduleAsync } from '../text/SubtitleDownloader.js'; // webpack module 32219
// import { OrderedList } from './EventEmitter.js';   // webpack module 20483

/**
 * Basic event emitter with named event channels.
 */
export class EventEmitter {
    constructor() {
        /** @type {Object<string, OrderedList>} Map of event name to subscriber list */
        this._listeners = {};

        // Bind methods for use as callbacks
        this.on = (event, handler, priority) => {
            this.addListener(event, handler, priority);
        };

        this.addListener = (event, handler, priority) => {
            if (this._listeners) {
                (this._listeners[event] = this._listeners[event] || new OrderedList(true)).item(handler, priority);
            }
        };

        this.removeListener = (event, handler) => {
            if (this._listeners && this._listeners[event]) {
                this._listeners[event].removeAll(handler);
            }
        };

        this.getListeners = (event) => {
            return this._listeners && this._listeners[event] ? this._listeners[event].flatten() : [];
        };

        this.emit = (event, data, async) => {
            if (this._listeners) {
                const listeners = this.getListeners(event);
                for (let i = 0; i < listeners.length; i++) {
                    if (async) {
                        const listener = listeners[i];
                        scheduleAsync(() => { listener(data); });
                    } else {
                        listeners[i].call(this, data);
                    }
                }
            }
        };
    }

    /**
     * Remove all listeners and prevent further event handling.
     */
    cleanup() {
        this._listeners = undefined;
    }
}
