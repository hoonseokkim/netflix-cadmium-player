/**
 * Netflix Cadmium Playercore - Module 17187
 * Extracted from cadmium-playercore-6.0055.939.911.js
 *
 * Node.js-style EventEmitter polyfill used by the Cadmium player.
 * Supports add/remove listeners, once, emit, and max-listener warnings.
 */

export const hSa = 10;

function isFunction(value) {
    return typeof value === "function";
}

function isObject(value) {
    return typeof value === "object" && value !== null;
}

export class EventEmitter {
    constructor() {
        this.uc = {};
        this.pA = undefined;
    }

    setMaxListeners(n) {
        if (typeof n !== "number" || n < 0 || isNaN(n)) {
            throw TypeError("n must be a positive number");
        }
        this.pA = n;
        return this;
    }

    emit(event) {
        this.uc || (this.uc = {});

        if (event === "error" && (!this.uc.error || (isObject(this.uc.error) && !this.uc.error.length))) {
            const err = arguments[1];
            if (err instanceof Error) throw err;
            const wrappedError = Error('Uncaught, unspecified "error" event. (' + err + ")");
            wrappedError.context = err;
            throw wrappedError;
        }

        const handler = this.uc[event];
        if (handler === undefined) return false;

        if (isFunction(handler)) {
            switch (arguments.length) {
                case 1:
                    handler.call(this);
                    break;
                case 2:
                    handler.call(this, arguments[1]);
                    break;
                case 3:
                    handler.call(this, arguments[1], arguments[2]);
                    break;
                default: {
                    const args = Array.prototype.slice.call(arguments, 1);
                    handler.apply(this, args);
                }
            }
        } else if (isObject(handler)) {
            const args = Array.prototype.slice.call(arguments, 1);
            const listeners = handler.slice();
            const len = listeners.length;
            for (let i = 0; i < len; i++) {
                listeners[i].apply(this, args);
            }
        }

        return true;
    }

    addListener(event, listener) {
        if (!isFunction(listener)) {
            throw TypeError("listener must be a function");
        }
        this.uc || (this.uc = {});

        if (this.uc.CKc) {
            this.emit("newListener", event, isFunction(listener.listener) ? listener.listener : listener);
        }

        if (this.uc[event]) {
            if (isObject(this.uc[event])) {
                this.uc[event].push(listener);
            } else {
                this.uc[event] = [this.uc[event], listener];
            }
        } else {
            this.uc[event] = listener;
        }

        if (isObject(this.uc[event]) && !this.uc[event].X8a) {
            const maxListeners = this.pA === undefined ? hSa : this.pA;
            if (maxListeners && maxListeners > 0 && this.uc[event].length > maxListeners) {
                this.uc[event].X8a = true;
                console.error(
                    "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
                    this.uc[event].length
                );
                if (typeof console.trace === "function") console.trace();
            }
        }

        return this;
    }

    on(...args) {
        return this.addListener(...args);
    }

    once(event, listener) {
        if (!isFunction(listener)) {
            throw TypeError("listener must be a function");
        }

        let fired = false;
        const wrapper = function () {
            this.removeListener(event, wrapper);
            if (!fired) {
                fired = true;
                listener.apply(this, arguments);
            }
        };
        wrapper.listener = listener;
        this.on(event, wrapper);
        return this;
    }

    removeListener(event, listener) {
        if (!isFunction(listener)) {
            throw TypeError("listener must be a function");
        }
        if (!this.uc || !this.uc[event]) return this;

        const handler = this.uc[event];
        const len = handler.length;
        let position = -1;

        if (handler === listener || (isFunction(handler.listener) && handler.listener === listener)) {
            delete this.uc[event];
            if (this.uc.removeListener) this.emit("removeListener", event, listener);
        } else if (isObject(handler)) {
            for (let i = len - 1; i >= 0; i--) {
                if (handler[i] === listener || (handler[i].listener && handler[i].listener === listener)) {
                    position = i;
                    break;
                }
            }
            if (position < 0) return this;
            if (handler.length === 1) {
                handler.length = 0;
                delete this.uc[event];
            } else {
                handler.splice(position, 1);
            }
            if (this.uc.removeListener) this.emit("removeListener", event, listener);
        }

        return this;
    }

    removeAllListeners(event) {
        if (!this.uc) return this;

        if (!this.uc.removeListener) {
            if (arguments.length === 0) {
                this.uc = {};
            } else if (this.uc[event]) {
                delete this.uc[event];
            }
            return this;
        }

        if (arguments.length === 0) {
            for (const key in this.uc) {
                if (key !== "removeListener") this.removeAllListeners(key);
            }
            this.removeAllListeners("removeListener");
            this.uc = {};
            return this;
        }

        const listeners = this.uc[event];
        if (isFunction(listeners)) {
            this.removeListener(event, listeners);
        } else if (listeners) {
            while (listeners.length) {
                this.removeListener(event, listeners[listeners.length - 1]);
            }
        }
        delete this.uc[event];
        return this;
    }

    listeners(event) {
        if (this.uc && this.uc[event]) {
            return isFunction(this.uc[event]) ? [this.uc[event]] : this.uc[event].slice();
        }
        return [];
    }

    listenerCount(event) {
        if (this.uc) {
            const handler = this.uc[event];
            if (isFunction(handler)) return 1;
            if (handler) return handler.length;
        }
        return 0;
    }
}

export function listenerCount(emitter, event) {
    return emitter.listenerCount(event);
}
