/**
 * @module NodeEventEmitterPolyfill
 * @description Node.js-compatible EventEmitter polyfill bundled in the player.
 * Provides full event subscription (on/once/addListener), emission, removal,
 * max-listener warnings, and a static `once()` that returns a Promise.
 *
 * This module also bundles:
 *   - ToPrimitive (ES6 Symbol.toPrimitive / OrdinaryToPrimitive)
 *   - Function.prototype.bind polyfill
 *
 * @see Module_5885
 */

const reflectApply = typeof Reflect === 'object' && typeof Reflect.apply === 'function'
  ? Reflect.apply
  : (fn, thisArg, args) => Function.prototype.apply.call(fn, thisArg, args);

const numberIsNaN = Number.isNaN || ((n) => n !== n);

/** @type {number} */
let defaultMaxListeners = 10;

/**
 * Node.js-style event emitter supporting on/once/off/emit with listener-count warnings.
 */
export class NodeEventEmitter {
  constructor() {
    NodeEventEmitter._init.call(this);
  }

  /**
   * Default maximum listeners per event before a warning is emitted.
   * @type {number}
   */
  static get defaultMaxListeners() {
    return defaultMaxListeners;
  }

  static set defaultMaxListeners(value) {
    if (typeof value !== 'number' || value < 0 || numberIsNaN(value)) {
      throw new RangeError(
        `The value of "defaultMaxListeners" is out of range. ` +
        `It must be a non-negative number. Received ${value}.`
      );
    }
    defaultMaxListeners = value;
  }

  /** @private */
  static _init() {
    if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    }
    this._maxListeners = this._maxListeners || undefined;
  }

  /**
   * Sets the maximum number of listeners before a leak warning.
   * @param {number} n
   * @returns {this}
   */
  setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || numberIsNaN(n)) {
      throw new RangeError(
        `The value of "n" is out of range. ` +
        `It must be a non-negative number. Received ${n}.`
      );
    }
    this._maxListeners = n;
    return this;
  }

  /**
   * Emits an event, calling all registered listeners with the provided arguments.
   * @param {string|symbol} eventName
   * @param {...*} args
   * @returns {boolean} True if listeners were called
   */
  emit(eventName, ...args) {
    const isError = eventName === 'error';
    const events = this._events;

    if (events !== undefined) {
      if (isError && events.error === undefined) {
        /* fall through to error handling */
      } else {
        const handler = events[eventName];
        if (handler === undefined) return false;

        if (typeof handler === 'function') {
          reflectApply(handler, this, args);
        } else {
          const listeners = [...handler];
          for (const listener of listeners) {
            reflectApply(listener, this, args);
          }
        }
        return true;
      }
    }

    if (!isError) return false;

    const err = args[0];
    if (err instanceof Error) throw err;
    const wrappedError = new Error('Unhandled error.' + (err ? ` (${err.message})` : ''));
    wrappedError.context = err;
    throw wrappedError;
  }

  /**
   * Registers a listener for an event.
   * @param {string|symbol} eventName
   * @param {Function} listener
   * @returns {this}
   */
  addListener(eventName, listener) {
    return _addListener(this, eventName, listener, false);
  }

  /** Alias for addListener. */
  on(eventName, listener) {
    return this.addListener(eventName, listener);
  }

  /**
   * Prepends a listener (called before other listeners).
   * @param {string|symbol} eventName
   * @param {Function} listener
   */
  prependListener(eventName, listener) {
    _addListener(this, eventName, listener, true);
  }

  /**
   * Registers a one-time listener.
   * @param {string|symbol} eventName
   * @param {Function} listener
   * @returns {this}
   */
  once(eventName, listener) {
    _validateListener(listener);
    this.on(eventName, _wrapOnce(this, eventName, listener));
    return this;
  }

  /**
   * Prepends a one-time listener.
   * @param {string|symbol} eventName
   * @param {Function} listener
   */
  prependOnceListener(eventName, listener) {
    _validateListener(listener);
    this.prependListener(eventName, _wrapOnce(this, eventName, listener));
  }

  /**
   * Removes a specific listener.
   * @param {string|symbol} eventName
   * @param {Function} listener
   * @returns {this}
   */
  removeListener(eventName, listener) {
    _validateListener(listener);
    const events = this._events;
    if (events === undefined) return this;

    const list = events[eventName];
    if (list === undefined) return this;

    if (list === listener || list.listener === listener) {
      if (--this._eventsCount === 0) {
        this._events = Object.create(null);
      } else {
        delete events[eventName];
        if (events.removeListener) {
          this.emit('removeListener', eventName, list.listener || listener);
        }
      }
    } else if (typeof list !== 'function') {
      let position = -1;
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i] === listener || list[i].listener === listener) {
          position = i;
          break;
        }
      }
      if (position < 0) return this;

      if (position === 0) {
        list.shift();
      } else {
        for (let k = position; k + 1 < list.length; k++) {
          list[k] = list[k + 1];
        }
        list.pop();
      }

      if (list.length === 1) events[eventName] = list[0];
      if (events.removeListener) {
        this.emit('removeListener', eventName, list[position]?.listener || listener);
      }
    }
    return this;
  }

  /** Alias for removeListener. */
  off(eventName, listener) {
    return this.removeListener(eventName, listener);
  }

  /**
   * Removes all listeners, or all listeners for a specific event.
   * @param {string|symbol} [eventName]
   * @returns {this}
   */
  removeAllListeners(eventName) {
    const events = this._events;
    if (events === undefined) return this;

    if (events.removeListener === undefined) {
      if (arguments.length === 0) {
        this._events = Object.create(null);
        this._eventsCount = 0;
      } else if (events[eventName] !== undefined) {
        if (--this._eventsCount === 0) {
          this._events = Object.create(null);
        } else {
          delete events[eventName];
        }
      }
      return this;
    }

    if (arguments.length === 0) {
      for (const key of Object.keys(events)) {
        if (key !== 'removeListener') this.removeAllListeners(key);
      }
      this.removeAllListeners('removeListener');
      this._events = Object.create(null);
      this._eventsCount = 0;
      return this;
    }

    const listeners = events[eventName];
    if (typeof listeners === 'function') {
      this.removeListener(eventName, listeners);
    } else if (listeners !== undefined) {
      for (let i = listeners.length - 1; i >= 0; i--) {
        this.removeListener(eventName, listeners[i]);
      }
    }
    return this;
  }

  /**
   * Returns a copy of the listeners array for the given event.
   * @param {string|symbol} eventName
   * @returns {Function[]}
   */
  listeners(eventName) {
    const events = this._events;
    if (events === undefined) return [];
    const handler = events[eventName];
    if (handler === undefined) return [];
    if (typeof handler === 'function') return [handler.listener || handler];
    return handler.map((h) => h.listener || h);
  }

  /**
   * Returns the number of listeners for the given event.
   * @param {string|symbol} eventName
   * @returns {number}
   */
  listenerCount(eventName) {
    const events = this._events;
    if (events === undefined) return 0;
    const handler = events[eventName];
    if (handler === undefined) return 0;
    if (typeof handler === 'function') return 1;
    return handler.length;
  }

  /**
   * Static helper to get listener count from any emitter.
   * @param {NodeEventEmitter} emitter
   * @param {string|symbol} eventName
   * @returns {number}
   */
  static listenerCount(emitter, eventName) {
    return typeof emitter.listenerCount === 'function'
      ? emitter.listenerCount(eventName)
      : NodeEventEmitter.prototype.listenerCount.call(emitter, eventName);
  }

  /**
   * Returns a Promise that resolves when the event fires once.
   * @param {NodeEventEmitter} emitter
   * @param {string|symbol} eventName
   * @returns {Promise<any[]>}
   */
  static once(emitter, eventName) {
    return new Promise((resolve, reject) => {
      function errorHandler(err) {
        emitter.removeListener(eventName, resolver);
        reject(err);
      }
      function resolver(...args) {
        if (typeof emitter.removeListener === 'function') {
          emitter.removeListener('error', errorHandler);
        }
        resolve(args);
      }
      _addEventListener(emitter, eventName, resolver, { once: true });
      if (eventName !== 'error') {
        _addErrorHandler(emitter, errorHandler, { once: true });
      }
    });
  }
}

NodeEventEmitter.EventEmitter = NodeEventEmitter;
NodeEventEmitter.prototype._events = undefined;
NodeEventEmitter.prototype._eventsCount = 0;
NodeEventEmitter.prototype._maxListeners = undefined;

/* ---- Internal helpers ---- */

function _validateListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError(
      `The "listener" argument must be of type Function. Received type ${typeof listener}`
    );
  }
}

function _addListener(target, eventName, listener, prepend) {
  _validateListener(listener);
  let events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else if (events.newListener !== undefined) {
    target.emit('newListener', eventName, listener.listener ?? listener);
    events = target._events;
  }

  const existing = events[eventName];
  if (existing === undefined) {
    events[eventName] = listener;
    ++target._eventsCount;
  } else if (typeof existing === 'function') {
    events[eventName] = prepend ? [listener, existing] : [existing, listener];
  } else {
    prepend ? existing.unshift(listener) : existing.push(listener);
  }

  const maxListeners = target._maxListeners === undefined
    ? NodeEventEmitter.defaultMaxListeners
    : target._maxListeners;
  if (maxListeners > 0 && existing?.length > maxListeners && !existing._warned) {
    existing._warned = true;
    const warning = new Error(
      `Possible EventEmitter memory leak detected. ${existing.length} ` +
      `${String(eventName)} listeners added. Use emitter.setMaxListeners() to increase limit`
    );
    warning.name = 'MaxListenersExceededWarning';
    warning.emitter = target;
    warning.type = eventName;
    warning.count = existing.length;
    if (console?.warn) console.warn(warning);
  }

  return target;
}

function _wrapOnce(target, eventName, listener) {
  const state = { fired: false, wrapFn: undefined, target, type: eventName, listener };
  const wrapped = function (...args) {
    if (!state.fired) {
      state.fired = true;
      target.removeListener(eventName, state.wrapFn);
      return listener.apply(target, args);
    }
  };
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

function _addErrorHandler(emitter, handler, options) {
  if (typeof emitter.on === 'function') {
    _addEventListener(emitter, 'error', handler, options);
  }
}

function _addEventListener(emitter, eventName, handler, options) {
  if (typeof emitter.on === 'function') {
    options.once ? emitter.once(eventName, handler) : emitter.on(eventName, handler);
  } else if (typeof emitter.addEventListener === 'function') {
    emitter.addEventListener(eventName, function wrapper(event) {
      if (options.once) emitter.removeEventListener(eventName, wrapper);
      handler(event);
    });
  } else {
    throw new TypeError(
      `The "emitter" argument must be of type EventEmitter. Received type ${typeof emitter}`
    );
  }
}

/* ---- ToPrimitive polyfill (bundled) ---- */

/**
 * ES2015 ToPrimitive abstract operation.
 * @param {*} input
 * @param {typeof String|typeof Number} [preferredType]
 * @returns {string|number|boolean|symbol|bigint|null|undefined}
 */
export function toPrimitive(input, preferredType) {
  if (_isPrimitive(input)) return input;

  let hint = 'default';
  if (preferredType === String) hint = 'string';
  else if (preferredType === Number) hint = 'number';

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive) {
    const method = input[Symbol.toPrimitive];
    if (method != null) {
      if (typeof method !== 'function') {
        throw new TypeError(`${method} is not a function`);
      }
      const result = method.call(input, hint);
      if (_isPrimitive(result)) return result;
      throw new TypeError('unable to convert exotic object to primitive');
    }
  }

  if (hint === 'default') hint = 'number';

  // OrdinaryToPrimitive
  const methodNames = hint === 'string'
    ? ['toString', 'valueOf']
    : ['valueOf', 'toString'];

  for (const name of methodNames) {
    const method = input[name];
    if (typeof method === 'function') {
      const result = method.call(input);
      if (_isPrimitive(result)) return result;
    }
  }

  throw new TypeError('No default value');
}

function _isPrimitive(value) {
  return value === null || (typeof value !== 'function' && typeof value !== 'object');
}

/* ---- Function.prototype.bind polyfill (bundled) ---- */

/**
 * Polyfill for Function.prototype.bind.
 * @param {*} thisArg
 * @param {...*} boundArgs
 * @returns {Function}
 */
export function bindPolyfill(thisArg, ...boundArgs) {
  const target = this;
  if (typeof target !== 'function') {
    throw new TypeError('Function.prototype.bind called on incompatible ' + target);
  }

  const bound = function (...args) {
    if (new.target) {
      const result = target.apply(this, [...boundArgs, ...args]);
      return Object(result) === result ? result : this;
    }
    return target.apply(thisArg, [...boundArgs, ...args]);
  };

  if (target.prototype) {
    const Empty = function () {};
    Empty.prototype = target.prototype;
    bound.prototype = new Empty();
    Empty.prototype = null;
  }

  return bound;
}

export default NodeEventEmitter;
