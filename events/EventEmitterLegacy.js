/**
 * Netflix Cadmium Player -- EventEmitterLegacy
 *
 * A lightweight Node.js-style EventEmitter polyfill. This is bundled alongside
 * an Array.prototype.includes polyfill (from es-shims). The EventEmitter
 * supports on/once/emit/removeListener/removeAllListeners with max-listener
 * leak warnings.
 *
 * @module events/EventEmitterLegacy
 * @original Module_26860
 * @dependencies
 *   Module 14926 - defineProperties (es-abstract)
 *   Module 44878 - Array.prototype.includes polyfill implementation
 */

// --------------------------------------------------------------------------
// Part 1: Array.prototype.includes polyfill (ES2016 / ES7)
// --------------------------------------------------------------------------

import defineProperties from '../utils/DefineProperties'; // Module 14926
import arrayIncludesImpl from '../utils/ArrayIncludesImpl'; // Module 44878

/**
 * Installs the Array.prototype.includes polyfill if needed.
 * @returns {Function} The includes implementation
 */
export function shimArrayIncludes() {
    const includesImpl = arrayIncludesImpl();
    defineProperties(Array.prototype, {
        includes: includesImpl,
    }, {
        includes: function () {
            return Array.prototype.includes !== includesImpl;
        },
    });
    return includesImpl;
}

// --------------------------------------------------------------------------
// Part 2: EventEmitter (Node-compatible polyfill)
// --------------------------------------------------------------------------

function isFunction(value) {
    return typeof value === 'function';
}

function isObject(value) {
    return typeof value === 'object' && value !== null;
}

/**
 * Lightweight EventEmitter compatible with the Node.js EventEmitter API.
 * @constructor
 */
export function EventEmitter() {
    this.callbackMap = this.callbackMap || {};
    this._maxListeners = this._maxListeners || undefined;
}

EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype.callbackMap = undefined;
EventEmitter.prototype._maxListeners = undefined;

/** Default max listeners before a warning is printed */
EventEmitter.defaultMaxListeners = 10;

/**
 * Set the maximum number of listeners before a memory leak warning.
 * @param {number} n
 * @returns {EventEmitter}
 */
EventEmitter.prototype.setMaxListeners = function (n) {
    if (typeof n !== 'number' || n < 0 || isNaN(n)) {
        throw TypeError('n must be a positive number');
    }
    this._maxListeners = n;
    return this;
};

/**
 * Emit an event with the given arguments.
 * @param {string} type - The event name
 * @param {...*} args - Arguments to pass to listeners
 * @returns {boolean} True if any listener was invoked
 */
EventEmitter.prototype.emit = function (type) {
    this.callbackMap || (this.callbackMap = {});

    // Special handling for 'error' events: throw if unhandled
    if (type === 'error' && (!this.callbackMap.error ||
        (isObject(this.callbackMap.error) && !this.callbackMap.error.length))) {
        const err = arguments[1];
        if (err instanceof Error) throw err;
        const unhandled = Error('Uncaught, unspecified "error" event. (' + err + ')');
        unhandled.context = err;
        throw unhandled;
    }

    const handler = this.callbackMap[type];
    if (handler === undefined) return false;

    if (isFunction(handler)) {
        switch (arguments.length) {
            case 1: handler.call(this); break;
            case 2: handler.call(this, arguments[1]); break;
            case 3: handler.call(this, arguments[1], arguments[2]); break;
            default:
                const args = Array.prototype.slice.call(arguments, 1);
                handler.apply(this, args);
        }
    } else if (isObject(handler)) {
        const args = Array.prototype.slice.call(arguments, 1);
        const listeners = handler.slice();
        for (let i = 0; i < listeners.length; i++) {
            listeners[i].apply(this, args);
        }
    }

    return true;
};

/**
 * Add an event listener.
 * @param {string} type - Event name
 * @param {Function} listener - Callback
 * @returns {EventEmitter}
 */
EventEmitter.prototype.addListener = function (type, listener) {
    if (!isFunction(listener)) {
        throw TypeError('listener must be a function');
    }

    this.callbackMap || (this.callbackMap = {});

    // Emit 'newListener' before adding
    if (this.callbackMap.newListener) {
        this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);
    }

    if (!this.callbackMap[type]) {
        this.callbackMap[type] = listener;
    } else if (isObject(this.callbackMap[type])) {
        this.callbackMap[type].push(listener);
    } else {
        this.callbackMap[type] = [this.callbackMap[type], listener];
    }

    // Memory leak detection
    if (isObject(this.callbackMap[type]) && !this.callbackMap[type]._warned) {
        const maxListeners = this._maxListeners === undefined
            ? EventEmitter.defaultMaxListeners
            : this._maxListeners;

        if (maxListeners && maxListeners > 0 && this.callbackMap[type].length > maxListeners) {
            this.callbackMap[type]._warned = true;
            console.error(
                '(node) warning: possible EventEmitter memory leak detected. %d listeners added. ' +
                'Use emitter.setMaxListeners() to increase limit.',
                this.callbackMap[type].length
            );
            if (typeof console.trace === 'function') {
                console.trace();
            }
        }
    }

    return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

/**
 * Add a one-time event listener that removes itself after first invocation.
 * @param {string} type - Event name
 * @param {Function} listener - Callback
 * @returns {EventEmitter}
 */
EventEmitter.prototype.once = function (type, listener) {
    if (!isFunction(listener)) {
        throw TypeError('listener must be a function');
    }

    let fired = false;

    function onceWrapper() {
        this.removeListener(type, onceWrapper);
        if (!fired) {
            fired = true;
            listener.apply(this, arguments);
        }
    }

    onceWrapper.listener = listener;
    this.on(type, onceWrapper);
    return this;
};

/**
 * Remove a specific listener for an event.
 * @param {string} type - Event name
 * @param {Function} listener - The listener to remove
 * @returns {EventEmitter}
 */
EventEmitter.prototype.removeListener = function (type, listener) {
    if (!isFunction(listener)) {
        throw TypeError('listener must be a function');
    }

    if (!this.callbackMap || !this.callbackMap[type]) return this;

    const list = this.callbackMap[type];
    let position = -1;

    if (list === listener || (isFunction(list.listener) && list.listener === listener)) {
        delete this.callbackMap[type];
        if (this.callbackMap.removeListener) {
            this.emit('removeListener', type, listener);
        }
    } else if (isObject(list)) {
        for (let i = list.length; i-- > 0;) {
            if (list[i] === listener || (list[i].listener && list[i].listener === listener)) {
                position = i;
                break;
            }
        }

        if (position < 0) return this;

        if (list.length === 1) {
            list.length = 0;
            delete this.callbackMap[type];
        } else {
            list.splice(position, 1);
        }

        if (this.callbackMap.removeListener) {
            this.emit('removeListener', type, listener);
        }
    }

    return this;
};

/**
 * Remove all listeners, optionally for a specific event type.
 * @param {string} [type] - Event name; omit to remove all listeners for all events
 * @returns {EventEmitter}
 */
EventEmitter.prototype.removeAllListeners = function (type) {
    if (!this.callbackMap) return this;

    if (!this.callbackMap.removeListener) {
        if (arguments.length === 0) {
            this.callbackMap = {};
        } else if (this.callbackMap[type]) {
            delete this.callbackMap[type];
        }
        return this;
    }

    if (arguments.length === 0) {
        for (const key in this.callbackMap) {
            if (key !== 'removeListener') {
                this.removeAllListeners(key);
            }
        }
        this.removeAllListeners('removeListener');
        this.callbackMap = {};
        return this;
    }

    const listeners = this.callbackMap[type];
    if (isFunction(listeners)) {
        this.removeListener(type, listeners);
    } else if (listeners) {
        while (listeners.length) {
            this.removeListener(type, listeners[listeners.length - 1]);
        }
    }
    delete this.callbackMap[type];
    return this;
};

/**
 * Get all listeners for a given event type.
 * @param {string} type - Event name
 * @returns {Array<Function>}
 */
EventEmitter.prototype.listeners = function (type) {
    if (this.callbackMap && this.callbackMap[type]) {
        return isFunction(this.callbackMap[type])
            ? [this.callbackMap[type]]
            : this.callbackMap[type].slice();
    }
    return [];
};

/**
 * Get the number of listeners for a given event type.
 * @param {string} type - Event name
 * @returns {number}
 */
EventEmitter.prototype.listenerCount = function (type) {
    if (this.callbackMap) {
        const handler = this.callbackMap[type];
        if (isFunction(handler)) return 1;
        if (handler) return handler.length;
    }
    return 0;
};

/**
 * Static method: get listener count for an emitter + event type.
 * @param {EventEmitter} emitter
 * @param {string} type
 * @returns {number}
 */
EventEmitter.listenerCount = function (emitter, type) {
    return emitter.listenerCount(type);
};
