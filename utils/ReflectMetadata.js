/**
 * Netflix Cadmium Player — Reflect Metadata Polyfill
 *
 * A polyfill for the ECMAScript Reflect Metadata proposal, providing an API
 * to attach and query metadata on objects and their properties. Used
 * extensively by the Cadmium dependency-injection system.
 *
 * Based on the `reflect-metadata` package by Ron Buckton.
 *
 * @see https://rbuckton.github.io/reflect-metadata/
 * @module ReflectMetadata
 */

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const _hasOwn = Object.prototype.hasOwnProperty;
const _supportsCreate = typeof Object.create === "function";

/**
 * Whether the `__proto__` property actually sets the internal [[Prototype]].
 * @type {boolean}
 */
const _supportsProto = (() => {
    const sentinel = {};
    function Ctor() {}
    Ctor.prototype = sentinel;
    return new Ctor().__proto__ === sentinel;
})();

// ---------------------------------------------------------------------------
// Null-prototype dictionary helpers
// ---------------------------------------------------------------------------

/**
 * Mark a dictionary as "live" by setting a flag and deleting its inverse.
 * Used to distinguish polyfill dictionaries from plain objects.
 *
 * @param {Object} dict
 * @returns {Object}
 */
function _markDictionary(dict) {
    dict.__used__ = 1;
    delete dict.__unused__;
    return dict;
}

/**
 * Create a null-prototype dictionary, using the best available mechanism.
 * @returns {Object}
 */
const createDictionary = _supportsCreate
    ? () => _markDictionary(Object.create(null))
    : _supportsProto
        ? () => _markDictionary({ __proto__: null })
        : () => _markDictionary({});

// ---------------------------------------------------------------------------
// Safe property access on null-prototype dictionaries
// ---------------------------------------------------------------------------

/**
 * Helpers for reading / testing keys on null-prototype dictionaries.
 * When the environment cannot produce true null-prototype objects we fall
 * back to `hasOwnProperty` checks.
 */
const DictionaryOps = (() => {
    const needsHasOwnCheck = !_supportsCreate && !_supportsProto;
    return {
        /**
         * @param {Object} dict
         * @param {string} key
         * @returns {boolean}
         */
        has: needsHasOwnCheck
            ? (dict, key) => _hasOwn.call(dict, key)
            : (dict, key) => key in dict,

        /**
         * @param {Object} dict
         * @param {string} key
         * @returns {*}
         */
        get: needsHasOwnCheck
            ? (dict, key) => (_hasOwn.call(dict, key) ? dict[key] : undefined)
            : (dict, key) => dict[key],
    };
})();

// ---------------------------------------------------------------------------
// FunctionPrototype — used by getParentConstructor
// ---------------------------------------------------------------------------

/** @type {Function} */
const FunctionPrototype = Object.getPrototypeOf(Function);

// ---------------------------------------------------------------------------
// Map / Set / WeakMap (use native when available, polyfill otherwise)
// ---------------------------------------------------------------------------

/** @type {MapConstructor} */
const MapImpl = typeof Map === "function" ? Map : createMapPolyfill();

/** @type {SetConstructor} */
const SetImpl = typeof Set === "function" ? Set : createSetPolyfill();

/** @type {WeakMapConstructor} */
const WeakMapImpl = typeof WeakMap === "function" ? WeakMap : createWeakMapPolyfill();

/**
 * The root metadata storage — maps targets to per-property metadata maps.
 * Structure: WeakMap<target, Map<propertyKey, Map<metadataKey, metadataValue>>>
 *
 * @type {WeakMap<object, Map>}
 */
const metadataStore = new WeakMapImpl();

// ---------------------------------------------------------------------------
// Core internal operations
// ---------------------------------------------------------------------------

/**
 * Retrieve (or optionally create) the metadata map for a given
 * `(target, propertyKey)` pair.
 *
 * @param {object}               target      The target object.
 * @param {string|symbol|undefined} propertyKey The property key, or
 *   `undefined` for the target itself.
 * @param {boolean}              create      Whether to create the map if it
 *   does not exist.
 * @returns {Map|undefined} The metadata map, or `undefined` if it does not
 *   exist and `create` is false.
 */
function getOrCreateMetadataMap(target, propertyKey, create) {
    let targetMap = metadataStore.get(target);
    if (!targetMap) {
        if (!create) return undefined;
        targetMap = new MapImpl();
        metadataStore.set(target, targetMap);
    }

    let propertyMap = targetMap.get(propertyKey);
    if (!propertyMap) {
        if (!create) return undefined;
        propertyMap = new MapImpl();
        targetMap.set(propertyKey, propertyMap);
    }

    return propertyMap;
}

/**
 * Walk the prototype chain of `target` looking for `metadataKey` on
 * `propertyKey`.
 *
 * @param {*}                       metadataKey
 * @param {object}                  target
 * @param {string|symbol|undefined} propertyKey
 * @returns {boolean}
 */
function hasMetadataInChain(metadataKey, target, propertyKey) {
    if (hasOwnMetadata(metadataKey, target, propertyKey)) return true;
    const parent = getParentConstructor(target);
    return parent !== null ? hasMetadataInChain(metadataKey, parent, propertyKey) : false;
}

/**
 * Check whether `target` itself (no prototype walk) owns the given metadata.
 *
 * @param {*}                       metadataKey
 * @param {object}                  target
 * @param {string|symbol|undefined} propertyKey
 * @returns {boolean}
 */
function hasOwnMetadata(metadataKey, target, propertyKey) {
    const map = getOrCreateMetadataMap(target, propertyKey, false);
    return map !== undefined && !!map.has(metadataKey);
}

/**
 * Get metadata for `metadataKey` walking the prototype chain.
 *
 * @param {*}                       metadataKey
 * @param {object}                  target
 * @param {string|symbol|undefined} propertyKey
 * @returns {*}
 */
function getMetadataInChain(metadataKey, target, propertyKey) {
    if (hasOwnMetadata(metadataKey, target, propertyKey)) {
        return getOwnMetadataValue(metadataKey, target, propertyKey);
    }
    const parent = getParentConstructor(target);
    return parent !== null ? getMetadataInChain(metadataKey, parent, propertyKey) : undefined;
}

/**
 * Get own metadata value (no prototype walk).
 *
 * @param {*}                       metadataKey
 * @param {object}                  target
 * @param {string|symbol|undefined} propertyKey
 * @returns {*}
 */
function getOwnMetadataValue(metadataKey, target, propertyKey) {
    const map = getOrCreateMetadataMap(target, propertyKey, false);
    return map === undefined ? undefined : map.get(metadataKey);
}

/**
 * Collect all metadata keys for `target` including inherited ones.
 *
 * @param {object}                  target
 * @param {string|symbol|undefined} propertyKey
 * @returns {Array<*>}
 */
function getMetadataKeysInChain(target, propertyKey) {
    const ownKeys = getOwnMetadataKeys(target, propertyKey);
    const parent = getParentConstructor(target);
    if (parent === null) return ownKeys;

    const parentKeys = getMetadataKeysInChain(parent, propertyKey);
    if (parentKeys.length <= 0) return ownKeys;
    if (ownKeys.length <= 0) return parentKeys;

    const seen = new SetImpl();
    for (let i = 0; i < ownKeys.length; i++) {
        seen.add(ownKeys[i]);
    }
    for (let i = 0; i < parentKeys.length; i++) {
        seen.add(parentKeys[i]);
    }
    return setToArray(seen);
}

/**
 * Collect own metadata keys (no prototype walk).
 *
 * @param {object}                  target
 * @param {string|symbol|undefined} propertyKey
 * @returns {Array<*>}
 */
function getOwnMetadataKeys(target, propertyKey) {
    const map = getOrCreateMetadataMap(target, propertyKey, false);
    const keys = [];
    if (map) {
        forEachEntry(map, (_value, key) => keys.push(key));
    }
    return keys;
}

// ---------------------------------------------------------------------------
// Type / argument helpers
// ---------------------------------------------------------------------------

/**
 * @param {*} value
 * @returns {boolean} `true` if `value` is `undefined`.
 */
function isUndefined(value) {
    return value === undefined;
}

/**
 * @param {*} value
 * @returns {boolean}
 */
function isArray(value) {
    return Array.isArray
        ? Array.isArray(value)
        : value instanceof Array || Object.prototype.toString.call(value) === "[object Array]";
}

/**
 * @param {*} value
 * @returns {boolean} `true` if `value` is a non-null object or a function.
 */
function isObjectOrFunction(value) {
    return typeof value === "object" ? value !== null : typeof value === "function";
}

/**
 * Coerce a value to a valid property key (`string` or `symbol`).
 *
 * @param {*} value
 * @returns {string|symbol}
 */
function toPropertyKey(value) {
    return typeof value === "symbol" ? value : String(value);
}

/**
 * Walk one step up the "logical" prototype chain. For plain objects this is
 * simply `Object.getPrototypeOf`. For constructors (functions) whose
 * `.prototype` has a non-trivial `constructor`, return that constructor so
 * that metadata attached to a base class is visible from the subclass.
 *
 * @param {object} target
 * @returns {object|null}
 */
function getParentConstructor(target) {
    const proto = Object.getPrototypeOf(target);

    if (typeof target !== "function" || target === FunctionPrototype || proto !== FunctionPrototype) {
        return proto;
    }

    const targetProto = target.prototype;
    const parentProto = targetProto && Object.getPrototypeOf(targetProto);
    if (parentProto == null || parentProto === Object.prototype) {
        return proto;
    }

    const parentCtor = parentProto.constructor;
    return typeof parentCtor !== "function" || parentCtor === target ? proto : parentCtor;
}

// ---------------------------------------------------------------------------
// Iterator / collection utilities
// ---------------------------------------------------------------------------

/**
 * Advance an iterator by one step, returning the result or `undefined` when
 * the iterator is done.
 *
 * @param {Iterator} iterator
 * @returns {IteratorResult|undefined}
 */
function iteratorNext(iterator) {
    const result = iterator.next();
    return result.done ? undefined : result;
}

/**
 * Iterate the entries of a `Map`-like (or anything with `.forEach`).
 *
 * @param {Map|object} collection
 * @param {Function}   callback  `(value, key, collection) => void`
 * @param {*}          [thisArg]
 */
function forEachEntry(collection, callback, thisArg) {
    const entriesFn = collection.entries;
    if (typeof entriesFn === "function") {
        const iterator = entriesFn.call(collection);
        let step;
        try {
            while ((step = iteratorNext(iterator))) {
                const pair = step.value;
                callback.call(thisArg, pair[1], pair[0], collection);
            }
        } finally {
            if (step) {
                const returnFn = iterator["return"];
                if (returnFn) returnFn.call(iterator);
            }
        }
    } else {
        const forEachFn = collection.forEach;
        if (typeof forEachFn === "function") {
            forEachFn.call(collection, callback, thisArg);
        }
    }
}

/**
 * Convert a `Set`-like collection to an array of its keys.
 *
 * @param {Set|object} set
 * @returns {Array<*>}
 */
function setToArray(set) {
    const result = [];
    forEachEntry(set, (_value, key) => result.push(key));
    return result;
}

/**
 * Build a simple iterator over parallel key/value arrays.
 *
 * @param {Array}  [keys]
 * @param {Array}  [values]
 * @param {"key"|"value"|"key+value"} mode
 * @returns {Iterator}
 */
function createArrayIterator(keys, values, mode) {
    let index = 0;
    return {
        next() {
            if ((keys || values) && index < (keys || values).length) {
                const i = index++;
                switch (mode) {
                    case "key":
                        return { value: keys[i], done: false };
                    case "value":
                        return { value: values[i], done: false };
                    case "key+value":
                        return { value: [keys[i], values[i]], done: false };
                }
            }
            keys = values = undefined;
            return { value: undefined, done: true };
        },
        throw(error) {
            keys = values = undefined;
            throw error;
        },
        return(value) {
            keys = values = undefined;
            return { value, done: true };
        },
    };
}

// ---------------------------------------------------------------------------
// Map polyfill (used only when native Map is unavailable)
// ---------------------------------------------------------------------------

/**
 * Create a minimal `Map` polyfill class.
 *
 * @returns {MapConstructor}
 */
function createMapPolyfill() {
    /** Unique sentinel used to invalidate the single-key cache. */
    const EMPTY_SENTINEL = {};

    class PolyfillMap {
        constructor() {
            /** @type {Array<*>} */
            this._keys = [];
            /** @type {Array<*>} */
            this._values = [];
            /** @type {*} Cached lookup key */
            this._cacheKey = EMPTY_SENTINEL;
            /** @type {number} Cached lookup index */
            this._cacheIndex = -2;
        }

        /** @returns {number} */
        get size() {
            return this._keys.length;
        }

        /**
         * @param {*} key
         * @returns {boolean}
         */
        has(key) {
            return this._findIndex(key, false) >= 0;
        }

        /**
         * @param {*} key
         * @returns {*}
         */
        get(key) {
            const index = this._findIndex(key, false);
            return index >= 0 ? this._values[index] : undefined;
        }

        /**
         * @param {*} key
         * @param {*} value
         * @returns {this}
         */
        set(key, value) {
            const index = this._findIndex(key, true);
            this._values[index] = value;
            return this;
        }

        /**
         * @param {*} key
         * @returns {boolean}
         */
        delete(key) {
            const index = this._findIndex(key, false);
            if (index >= 0) {
                const length = this._keys.length;
                for (let i = index + 1; i < length; i++) {
                    this._keys[i - 1] = this._keys[i];
                    this._values[i - 1] = this._values[i];
                }
                this._keys.length--;
                this._values.length--;
                this._cacheKey = EMPTY_SENTINEL;
                this._cacheIndex = -2;
                return true;
            }
            return false;
        }

        clear() {
            this._keys.length = 0;
            this._values.length = 0;
            this._cacheKey = EMPTY_SENTINEL;
            this._cacheIndex = -2;
        }

        /** @returns {Iterator} */
        keys() {
            return createArrayIterator(this._keys, undefined, "key");
        }

        /** @returns {Iterator} */
        values() {
            return createArrayIterator(undefined, this._values, "value");
        }

        /** @returns {Iterator} */
        entries() {
            return createArrayIterator(this._keys, this._values, "key+value");
        }

        /**
         * Find the index of `key`, optionally inserting it if absent.
         *
         * @param {*}       key
         * @param {boolean} insertIfMissing
         * @returns {number}
         * @private
         */
        _findIndex(key, insertIfMissing) {
            if (this._cacheKey === key) return this._cacheIndex;

            let index = this._keys.indexOf(key);
            if (index < 0 && insertIfMissing) {
                index = this._keys.length;
                this._keys.push(key);
                this._values.push(undefined);
            }

            this._cacheKey = key;
            this._cacheIndex = index;
            return index;
        }
    }

    return PolyfillMap;
}

// ---------------------------------------------------------------------------
// Set polyfill (used only when native Set is unavailable)
// ---------------------------------------------------------------------------

/**
 * Create a minimal `Set` polyfill class backed by the Map polyfill.
 *
 * @returns {SetConstructor}
 */
function createSetPolyfill() {
    class PolyfillSet {
        constructor() {
            /** @type {Map} */
            this._map = new MapImpl();
        }

        /** @returns {number} */
        get size() {
            return this._map.size;
        }

        /**
         * @param {*} value
         * @returns {boolean}
         */
        has(value) {
            return this._map.has(value);
        }

        /**
         * @param {*} value
         * @returns {this}
         */
        add(value) {
            this._map.set(value, value);
            return this;
        }

        /**
         * @param {*} value
         * @returns {boolean}
         */
        delete(value) {
            return this._map.delete(value);
        }

        clear() {
            this._map.clear();
        }

        /** @returns {Iterator} */
        keys() {
            return this._map.keys();
        }

        /** @returns {Iterator} */
        values() {
            return this._map.values();
        }

        /** @returns {Iterator} */
        entries() {
            return this._map.entries();
        }
    }

    return PolyfillSet;
}

// ---------------------------------------------------------------------------
// WeakMap polyfill (used only when native WeakMap is unavailable)
// ---------------------------------------------------------------------------

/**
 * Create a minimal `WeakMap` polyfill that stores data as a hidden property
 * on the key object, keyed by a random UUID.
 *
 * @returns {WeakMapConstructor}
 */
function createWeakMapPolyfill() {
    const rootDict = createDictionary();

    /**
     * Generate a unique `@@WeakMap@@<uuid>` key that does not collide with
     * any existing property on `rootDict`.
     *
     * @returns {string}
     */
    function generateUniqueKey() {
        let key;
        do {
            const bytes = typeof Uint8Array === "function"
                ? (typeof crypto !== "undefined"
                    ? crypto.getRandomValues(new Uint8Array(16))
                    : typeof msCrypto !== "undefined"
                        ? msCrypto.getRandomValues(new Uint8Array(16))
                        : fillRandom(new Uint8Array(16), 16))
                : fillRandom(Array(16), 16);

            // Set version (4) and variant (10xx) bits per RFC 4122.
            bytes[6] = (bytes[6] & 0x4f) | 0x40;
            bytes[8] = (bytes[8] & 0xbf) | 0x80;

            let uuid = "";
            for (let i = 0; i < 16; i++) {
                if (i === 4 || i === 6 || i === 8) uuid += "-";
                if (bytes[i] < 16) uuid += "0";
                uuid += bytes[i].toString(16).toLowerCase();
            }
            key = "@@WeakMap@@" + uuid;
        } while (DictionaryOps.has(rootDict, key));

        rootDict[key] = true;
        return key;
    }

    /**
     * Fill `array` with `count` random bytes.
     *
     * @param {Array|Uint8Array} array
     * @param {number}           count
     * @returns {Array|Uint8Array}
     */
    function fillRandom(array, count) {
        for (let i = 0; i < count; i++) {
            array[i] = (Math.random() * 255) | 0;
        }
        return array;
    }

    const hiddenPropertyName = generateUniqueKey();

    /**
     * Retrieve (or create) the hidden metadata dictionary stored on `target`.
     *
     * @param {object}  target
     * @param {boolean} create
     * @returns {Object|undefined}
     */
    function getHiddenDict(target, create) {
        if (!_hasOwn.call(target, hiddenPropertyName)) {
            if (!create) return undefined;
            Object.defineProperty(target, hiddenPropertyName, {
                value: createDictionary(),
            });
        }
        return target[hiddenPropertyName];
    }

    class PolyfillWeakMap {
        constructor() {
            /** @type {string} */
            this._key = generateUniqueKey();
        }

        /**
         * @param {object} key
         * @returns {boolean}
         */
        has(key) {
            const dict = getHiddenDict(key, false);
            return dict !== undefined ? DictionaryOps.has(dict, this._key) : false;
        }

        /**
         * @param {object} key
         * @returns {*}
         */
        get(key) {
            const dict = getHiddenDict(key, false);
            return dict !== undefined ? DictionaryOps.get(dict, this._key) : undefined;
        }

        /**
         * @param {object} key
         * @param {*}      value
         * @returns {this}
         */
        set(key, value) {
            getHiddenDict(key, true)[this._key] = value;
            return this;
        }

        /**
         * @param {object} key
         * @returns {boolean}
         */
        delete(key) {
            const dict = getHiddenDict(key, false);
            return dict !== undefined ? delete dict[this._key] : false;
        }

        clear() {
            this._key = generateUniqueKey();
        }
    }

    return PolyfillWeakMap;
}

// ---------------------------------------------------------------------------
// Public API — mirrors the tc39 Reflect Metadata proposal
// ---------------------------------------------------------------------------

/**
 * Apply an array of decorators to a target, optionally with a property key
 * and descriptor.
 *
 * Overloaded signatures:
 *   - `decorate(decorators, target)` — class decorators
 *   - `decorate(decorators, target, propertyKey)` — member decorators
 *     (without descriptor)
 *   - `decorate(decorators, target, propertyKey, descriptor)` — member
 *     decorators (with descriptor)
 *
 * @param {Function[]}             decorators
 * @param {object|Function}        target
 * @param {string|symbol}          [propertyKey]
 * @param {PropertyDescriptor}     [descriptor]
 * @returns {Function|PropertyDescriptor|undefined}
 */
export function decorate(decorators, target, propertyKey, descriptor) {
    if (isUndefined(descriptor)) {
        if (isUndefined(propertyKey)) {
            // Class decorator: decorate(decorators, target)
            if (!isArray(decorators)) throw new TypeError();
            if (typeof target !== "function") throw new TypeError();

            for (let i = decorators.length - 1; i >= 0; --i) {
                const decorated = decorators[i](target);
                if (!isUndefined(decorated)) {
                    if (typeof decorated !== "function") throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }

        // Member decorator without descriptor: decorate(decorators, target, key)
        if (!isArray(decorators)) throw new TypeError();
        if (!isObjectOrFunction(target)) throw new TypeError();
        propertyKey = toPropertyKey(propertyKey);
        for (let i = decorators.length - 1; i >= 0; --i) {
            decorators[i](target, propertyKey);
        }
    } else {
        // Member decorator with descriptor: decorate(decorators, target, key, desc)
        if (!isArray(decorators)) throw new TypeError();
        if (!isObjectOrFunction(target)) throw new TypeError();
        if (isUndefined(propertyKey)) throw new TypeError();
        if (!isObjectOrFunction(descriptor)) throw new TypeError();

        propertyKey = toPropertyKey(propertyKey);
        for (let i = decorators.length - 1; i >= 0; --i) {
            const result = decorators[i](target, propertyKey, descriptor);
            if (!isUndefined(result)) {
                if (!isObjectOrFunction(result)) throw new TypeError();
                descriptor = result;
            }
        }
        return descriptor;
    }
}

/**
 * Create a decorator that defines metadata on a target.
 *
 * @param {*} metadataKey   The metadata key.
 * @param {*} metadataValue The metadata value.
 * @returns {Function} A decorator function.
 */
export function metadata(metadataKey, metadataValue) {
    return function decorator(target, propertyKey) {
        if (isUndefined(propertyKey)) {
            if (typeof target !== "function") throw new TypeError();
            getOrCreateMetadataMap(target, undefined, true).set(metadataKey, metadataValue);
        } else {
            if (!isObjectOrFunction(target)) throw new TypeError();
            propertyKey = toPropertyKey(propertyKey);
            getOrCreateMetadataMap(target, propertyKey, true).set(metadataKey, metadataValue);
        }
    };
}

/**
 * Define metadata on a target (imperative form).
 *
 * @param {*}                       metadataKey
 * @param {*}                       metadataValue
 * @param {object}                  target
 * @param {string|symbol}           [propertyKey]
 */
export function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
    if (!isObjectOrFunction(target)) throw new TypeError();
    if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);
    getOrCreateMetadataMap(target, propertyKey, true).set(metadataKey, metadataValue);
}

/**
 * Check whether metadata exists anywhere in the prototype chain.
 *
 * @param {*}                       metadataKey
 * @param {object}                  target
 * @param {string|symbol}           [propertyKey]
 * @returns {boolean}
 */
export function hasMetadata(metadataKey, target, propertyKey) {
    if (!isObjectOrFunction(target)) throw new TypeError();
    if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);
    return hasMetadataInChain(metadataKey, target, propertyKey);
}

/**
 * Check whether the target itself (own, no prototype walk) has the metadata.
 *
 * @param {*}                       metadataKey
 * @param {object}                  target
 * @param {string|symbol}           [propertyKey]
 * @returns {boolean}
 */
export function hasOwnReflectMetadata(metadataKey, target, propertyKey) {
    if (!isObjectOrFunction(target)) throw new TypeError();
    if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);
    return hasOwnMetadata(metadataKey, target, propertyKey);
}

/**
 * Retrieve metadata, walking the prototype chain.
 *
 * @param {*}                       metadataKey
 * @param {object}                  target
 * @param {string|symbol}           [propertyKey]
 * @returns {*}
 */
export function getMetadata(metadataKey, target, propertyKey) {
    if (!isObjectOrFunction(target)) throw new TypeError();
    if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);
    return getMetadataInChain(metadataKey, target, propertyKey);
}

/**
 * Retrieve own metadata (no prototype walk).
 *
 * @param {*}                       metadataKey
 * @param {object}                  target
 * @param {string|symbol}           [propertyKey]
 * @returns {*}
 */
export function getOwnMetadata(metadataKey, target, propertyKey) {
    if (!isObjectOrFunction(target)) throw new TypeError();
    if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);
    return getOwnMetadataValue(metadataKey, target, propertyKey);
}

/**
 * Get all metadata keys (own + inherited).
 *
 * @param {object}                  target
 * @param {string|symbol}           [propertyKey]
 * @returns {Array<*>}
 */
export function getMetadataKeys(target, propertyKey) {
    if (!isObjectOrFunction(target)) throw new TypeError();
    if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);
    return getMetadataKeysInChain(target, propertyKey);
}

/**
 * Get own metadata keys (no prototype walk).
 *
 * @param {object}                  target
 * @param {string|symbol}           [propertyKey]
 * @returns {Array<*>}
 */
export function getOwnMetadataKeys(target, propertyKey) {
    if (!isObjectOrFunction(target)) throw new TypeError();
    if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);
    return getOwnMetadataKeys(target, propertyKey);
}

/**
 * Delete a metadata entry from the target.
 *
 * @param {*}                       metadataKey
 * @param {object}                  target
 * @param {string|symbol}           [propertyKey]
 * @returns {boolean} `true` if the entry was found and deleted.
 */
export function deleteMetadata(metadataKey, target, propertyKey) {
    if (!isObjectOrFunction(target)) throw new TypeError();
    if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);

    const metadataMap = getOrCreateMetadataMap(target, propertyKey, false);
    if (isUndefined(metadataMap) || !metadataMap.delete(metadataKey)) return false;
    if (metadataMap.size > 0) return true;

    const targetMap = metadataStore.get(target);
    targetMap.delete(propertyKey);
    if (targetMap.size > 0) return true;

    metadataStore.delete(target);
    return true;
}

// ---------------------------------------------------------------------------
// Default export — all public functions bundled as a Reflect-like namespace
// ---------------------------------------------------------------------------

export default {
    decorate,
    metadata,
    defineMetadata,
    hasMetadata,
    hasOwnMetadata: hasOwnReflectMetadata,
    getMetadata,
    getOwnMetadata,
    getMetadataKeys,
    getOwnMetadataKeys,
    deleteMetadata,
};
