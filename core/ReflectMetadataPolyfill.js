/**
 * Netflix Cadmium Player - Reflect Metadata Polyfill
 *
 * A polyfill for the Reflect Metadata API (reflect-metadata).
 * Provides decorator metadata support used by the player's dependency injection system.
 *
 * Exposes the following methods on Reflect:
 *   - decorate(decorators, target, propertyKey?, attributes?)
 *   - metadata(metadataKey, metadataValue)
 *   - defineMetadata(metadataKey, metadataValue, target, propertyKey?)
 *   - hasMetadata(metadataKey, target, propertyKey?)
 *   - hasOwnMetadata(metadataKey, target, propertyKey?)
 *   - getMetadata(metadataKey, target, propertyKey?)
 *   - getOwnMetadata(metadataKey, target, propertyKey?)
 *   - getMetadataKeys(target, propertyKey?)
 *   - getOwnMetadataKeys(target, propertyKey?)
 *   - deleteMetadata(metadataKey, target, propertyKey?)
 *
 * @module ReflectMetadataPolyfill
 * @see https://rbuckton.github.io/reflect-metadata/
 */

// eslint-disable-next-line no-unused-vars
export default function installReflectMetadata(exports, module, __webpack_require__) {
    let Reflect_; // local Reflect namespace

    (function (Reflect_ns) {
        (function (registerMethod) {
            const hasOwn = Object.prototype.hasOwnProperty;
            const supportsSymbol = typeof Symbol === 'function';
            const toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== 'undefined'
                ? Symbol.toPrimitive
                : '@@toPrimitive';
            const iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== 'undefined'
                ? Symbol.iterator
                : '@@iterator';
            const supportsCreate = typeof Object.create === 'function';
            const supportsProto = ({ __proto__: [] }) instanceof Array;
            const needsHasOwnFallback = !supportsCreate && !supportsProto;

            /**
             * Utility for creating null-prototype objects.
             * @type {{ create: () => object, has: (obj: object, key: string) => boolean, get: (obj: object, key: string) => any }}
             */
            const HashMap = {
                create: supportsCreate
                    ? () => cleanObject(Object.create(null))
                    : supportsProto
                        ? () => cleanObject({ __proto__: null })
                        : () => cleanObject({}),
                has: needsHasOwnFallback
                    ? (obj, key) => hasOwn.call(obj, key)
                    : (obj, key) => key in obj,
                get: needsHasOwnFallback
                    ? (obj, key) => hasOwn.call(obj, key) ? obj[key] : undefined
                    : (obj, key) => obj[key],
            };

            const FunctionPrototype = Object.getPrototypeOf(Function);

            // Prefer native Map/Set/WeakMap when available, fall back to polyfills
            const usePolyfill = (
                typeof process === 'object' &&
                process.env?.REFLECT_METADATA_USE_MAP_POLYFILL === 'true'
            );
            const MapImpl = usePolyfill || typeof Map !== 'function' || typeof Map.prototype.entries !== 'function'
                ? createMapPolyfill()
                : Map;
            const SetImpl = usePolyfill || typeof Set !== 'function' || typeof Set.prototype.entries !== 'function'
                ? createSetPolyfill()
                : Set;
            const WeakMapImpl = usePolyfill || typeof WeakMap !== 'function'
                ? createWeakMapPolyfill()
                : WeakMap;

            /** @type {WeakMap<object, Map<string|symbol|undefined, Map<any, any>>>} */
            const metadataStore = new WeakMapImpl();

            // ──────────────────────────────────────────────
            // Core metadata operations
            // ──────────────────────────────────────────────

            /**
             * Get or create the metadata map for (target, propertyKey).
             * @param {object} target
             * @param {string|symbol|undefined} propertyKey
             * @param {boolean} create - Whether to create missing maps
             * @returns {Map<any, any>|undefined}
             */
            function getOrCreateMetadataMap(target, propertyKey, create) {
                let targetMap = metadataStore.get(target);
                if (isUndefined(targetMap)) {
                    if (!create) return undefined;
                    targetMap = new MapImpl();
                    metadataStore.set(target, targetMap);
                }
                let propertyMap = targetMap.get(propertyKey);
                if (isUndefined(propertyMap)) {
                    if (!create) return undefined;
                    propertyMap = new MapImpl();
                    targetMap.set(propertyKey, propertyMap);
                }
                return propertyMap;
            }

            /**
             * Check if metadata key exists on target or its prototype chain.
             * @param {any} metadataKey
             * @param {object} target
             * @param {string|symbol|undefined} propertyKey
             * @returns {boolean}
             */
            function hasMetadataInChain(metadataKey, target, propertyKey) {
                if (hasOwnMetadataImpl(metadataKey, target, propertyKey)) return true;
                const parent = getPrototypeOf(target);
                return parent === null ? false : hasMetadataInChain(metadataKey, parent, propertyKey);
            }

            /**
             * Check if metadata key exists directly on target (not prototype chain).
             * @param {any} metadataKey
             * @param {object} target
             * @param {string|symbol|undefined} propertyKey
             * @returns {boolean}
             */
            function hasOwnMetadataImpl(metadataKey, target, propertyKey) {
                const metadataMap = getOrCreateMetadataMap(target, propertyKey, false);
                return isUndefined(metadataMap) ? false : Boolean(metadataMap.has(metadataKey));
            }

            /**
             * Get metadata value from target or its prototype chain.
             * @param {any} metadataKey
             * @param {object} target
             * @param {string|symbol|undefined} propertyKey
             * @returns {any}
             */
            function getMetadataInChain(metadataKey, target, propertyKey) {
                if (hasOwnMetadataImpl(metadataKey, target, propertyKey)) {
                    return getOwnMetadataImpl(metadataKey, target, propertyKey);
                }
                const parent = getPrototypeOf(target);
                if (parent !== null) {
                    return getMetadataInChain(metadataKey, parent, propertyKey);
                }
                return undefined;
            }

            /**
             * Get metadata value directly from target.
             * @param {any} metadataKey
             * @param {object} target
             * @param {string|symbol|undefined} propertyKey
             * @returns {any}
             */
            function getOwnMetadataImpl(metadataKey, target, propertyKey) {
                const metadataMap = getOrCreateMetadataMap(target, propertyKey, false);
                if (!isUndefined(metadataMap)) return metadataMap.get(metadataKey);
                return undefined;
            }

            /**
             * Get all metadata keys from target and its prototype chain.
             * @param {object} target
             * @param {string|symbol|undefined} propertyKey
             * @returns {any[]}
             */
            function getMetadataKeysInChain(target, propertyKey) {
                const ownKeys = getOwnMetadataKeysImpl(target, propertyKey);
                const parent = getPrototypeOf(target);
                if (parent === null) return ownKeys;

                const parentKeys = getMetadataKeysInChain(parent, propertyKey);
                if (parentKeys.length <= 0) return ownKeys;
                if (ownKeys.length <= 0) return parentKeys;

                const seen = new SetImpl();
                const result = [];
                for (let i = 0; i < ownKeys.length; i++) {
                    const key = ownKeys[i];
                    if (!seen.has(key)) {
                        seen.add(key);
                        result.push(key);
                    }
                }
                for (let i = 0; i < parentKeys.length; i++) {
                    const key = parentKeys[i];
                    if (!seen.has(key)) {
                        seen.add(key);
                        result.push(key);
                    }
                }
                return result;
            }

            /**
             * Get own metadata keys directly from target.
             * @param {object} target
             * @param {string|symbol|undefined} propertyKey
             * @returns {any[]}
             */
            function getOwnMetadataKeysImpl(target, propertyKey) {
                const keys = [];
                const metadataMap = getOrCreateMetadataMap(target, propertyKey, false);
                if (isUndefined(metadataMap)) return keys;

                const keysIteratorFn = getMethod(metadataMap, iteratorSymbol);
                if (!isFunction(keysIteratorFn)) throw new TypeError();

                const keysIterator = keysIteratorFn.call(metadataMap);
                if (!isObject(keysIterator)) throw new TypeError();

                let index = 0;
                for (;;) {
                    const step = keysIterator.next();
                    const iterResult = step.done ? false : step;
                    if (!iterResult) {
                        keys.length = index;
                        return keys;
                    }
                    const value = iterResult.value;
                    try {
                        keys[index] = value;
                    } catch (err) {
                        try {
                            const returnFn = keysIterator['return'];
                            if (returnFn) returnFn.call(keysIterator);
                        } finally {
                            throw err;
                        }
                    }
                    index++;
                }
            }

            // ──────────────────────────────────────────────
            // Type utilities
            // ──────────────────────────────────────────────

            /**
             * Return a numeric type tag for a value.
             * @param {any} value
             * @returns {number} 0=undefined, 1=null, 2=boolean, 3=string, 4=symbol, 5=number, 6=object
             */
            function getTypeTag(value) {
                if (value === null) return 1;
                switch (typeof value) {
                    case 'undefined': return 0;
                    case 'boolean': return 2;
                    case 'string': return 3;
                    case 'symbol': return 4;
                    case 'number': return 5;
                    case 'object': return value === null ? 1 : 6;
                    default: return 6;
                }
            }

            /** @param {any} value @returns {boolean} */
            function isUndefined(value) {
                return value === undefined;
            }

            /** @param {any} value @returns {boolean} */
            function isObject(value) {
                return typeof value === 'object' ? value !== null : typeof value === 'function';
            }

            /**
             * Convert a value to a primitive using ToPrimitive semantics.
             * @param {any} value
             * @param {number} preferredType - 3 for string, 5 for number
             * @returns {string|number|boolean|symbol|null|undefined}
             */
            function toPrimitive(value, preferredType) {
                switch (getTypeTag(value)) {
                    case 0: return value;
                    case 1: return value;
                    case 2: return value;
                    case 3: return value;
                    case 4: return value;
                    case 5: return value;
                }
                const hint = preferredType === 3 ? 'string' : preferredType === 5 ? 'number' : 'default';
                const exotic = getMethod(value, toPrimitiveSymbol);
                if (exotic !== undefined) {
                    const result = exotic.call(value, hint);
                    if (isObject(result)) throw new TypeError();
                    return result;
                }
                // OrdinaryToPrimitive
                const actualHint = hint === 'default' ? 'number' : hint;
                if (actualHint === 'string') {
                    const toStr = value.toString;
                    if (isFunction(toStr)) {
                        const strResult = toStr.call(value);
                        if (!isObject(strResult)) return strResult;
                    }
                    const valOf = value.valueOf;
                    if (isFunction(valOf)) {
                        const numResult = valOf.call(value);
                        if (!isObject(numResult)) return numResult;
                    }
                } else {
                    const valOf = value.valueOf;
                    if (isFunction(valOf)) {
                        const numResult = valOf.call(value);
                        if (!isObject(numResult)) return numResult;
                    }
                    const toStr = value.toString;
                    if (isFunction(toStr)) {
                        const strResult = toStr.call(value);
                        if (!isObject(strResult)) return strResult;
                    }
                }
                throw new TypeError();
            }

            /**
             * Convert to property key (string or symbol).
             * @param {any} value
             * @returns {string|symbol}
             */
            function toPropertyKey(value) {
                const key = toPrimitive(value, 3);
                return typeof key === 'symbol' ? key : '' + key;
            }

            /** @param {any} value @returns {boolean} */
            function isArray(value) {
                return Array.isArray
                    ? Array.isArray(value)
                    : value instanceof Object
                        ? value instanceof Array
                        : Object.prototype.toString.call(value) === '[object Array]';
            }

            /** @param {any} value @returns {boolean} */
            function isFunction(value) {
                return typeof value === 'function';
            }

            /**
             * Get a callable method from an object, or undefined.
             * @param {object} obj
             * @param {string|symbol} key
             * @returns {Function|undefined}
             */
            function getMethod(obj, key) {
                const func = obj[key];
                if (func !== undefined && func !== null) {
                    if (!isFunction(func)) throw new TypeError();
                    return func;
                }
                return undefined;
            }

            /**
             * Get the prototype of a target, with special handling for constructors.
             * @param {object} target
             * @returns {object|null}
             */
            function getPrototypeOf(target) {
                const proto = Object.getPrototypeOf(target);
                if (typeof target !== 'function' || target === FunctionPrototype || proto !== FunctionPrototype) {
                    return proto;
                }
                // For constructor functions, try to find the parent class
                const prototype = target.prototype;
                const protoOfProto = prototype && Object.getPrototypeOf(prototype);
                if (protoOfProto == null || protoOfProto === Object.prototype) {
                    return proto;
                }
                const constructor = protoOfProto.constructor;
                return typeof constructor !== 'function' || constructor === target
                    ? proto
                    : constructor;
            }

            /**
             * Remove a sentinel property to ensure the object is in dictionary mode.
             * @param {object} obj
             * @returns {object}
             */
            function cleanObject(obj) {
                obj.__placeholder__ = undefined;
                delete obj.__placeholder__;
                return obj;
            }

            // ──────────────────────────────────────────────
            // Map polyfill (for environments without native Map)
            // ──────────────────────────────────────────────

            /**
             * Create a simple Map polyfill class.
             * @returns {new () => Map}
             */
            function createMapPolyfill() {
                const EMPTY_ARRAY = [];
                const SENTINEL = {};

                /**
                 * Iterator for the polyfill Map/Set.
                 */
                class MapIterator {
                    /**
                     * @param {any[]} keys
                     * @param {any[]} values
                     * @param {(key: any, value: any) => any} selector
                     */
                    constructor(keys, values, selector) {
                        this._index = 0;
                        this._keys = keys;
                        this._values = values;
                        this._selector = selector;
                    }

                    ['@@iterator']() { return this; }
                    [iteratorSymbol]() { return this; }

                    /** @returns {{ value: any, done: boolean }} */
                    next() {
                        const index = this._index;
                        if (index >= 0 && index < this._keys.length) {
                            const result = this._selector(this._keys[index], this._values[index]);
                            if (index + 1 >= this._keys.length) {
                                this._index = -1;
                                this._values = this._keys = EMPTY_ARRAY;
                            } else {
                                this._index++;
                            }
                            return { value: result, done: false };
                        }
                        return { value: undefined, done: true };
                    }

                    /** @param {any} error */
                    throw(error) {
                        if (this._index >= 0) {
                            this._index = -1;
                            this._values = this._keys = EMPTY_ARRAY;
                        }
                        throw error;
                    }

                    /** @param {any} value @returns {{ value: any, done: boolean }} */
                    return(value) {
                        if (this._index >= 0) {
                            this._index = -1;
                            this._values = this._keys = EMPTY_ARRAY;
                        }
                        return { value, done: true };
                    }
                }

                /**
                 * Polyfill Map implementation using parallel arrays.
                 */
                class PolyfillMap {
                    constructor() {
                        this._keys = [];
                        this._values = [];
                        this._cachedKey = SENTINEL;
                        this._cachedIndex = -2;
                    }

                    /** @returns {number} */
                    get size() {
                        return this._keys.length;
                    }

                    /** @param {any} key @returns {boolean} */
                    has(key) {
                        return this._findIndex(key, false) >= 0;
                    }

                    /** @param {any} key @returns {any} */
                    get(key) {
                        const index = this._findIndex(key, false);
                        return index >= 0 ? this._values[index] : undefined;
                    }

                    /**
                     * @param {any} key
                     * @param {any} value
                     * @returns {this}
                     */
                    set(key, value) {
                        const index = this._findIndex(key, true);
                        this._values[index] = value;
                        return this;
                    }

                    /** @param {any} key @returns {boolean} */
                    delete(key) {
                        const index = this._findIndex(key, false);
                        if (index >= 0) {
                            const size = this._keys.length;
                            for (let i = index + 1; i < size; i++) {
                                this._keys[i - 1] = this._keys[i];
                                this._values[i - 1] = this._values[i];
                            }
                            this._keys.length--;
                            this._values.length--;
                            if (key === this._cachedKey) {
                                this._cachedKey = SENTINEL;
                                this._cachedIndex = -2;
                            }
                            return true;
                        }
                        return false;
                    }

                    clear() {
                        this._keys.length = 0;
                        this._values.length = 0;
                        this._cachedKey = SENTINEL;
                        this._cachedIndex = -2;
                    }

                    /** @returns {MapIterator} */
                    keys() {
                        return new MapIterator(this._keys, this._values, (k) => k);
                    }

                    /** @returns {MapIterator} */
                    values() {
                        return new MapIterator(this._keys, this._values, (_k, v) => v);
                    }

                    /** @returns {MapIterator} */
                    entries() {
                        return new MapIterator(this._keys, this._values, (k, v) => [k, v]);
                    }

                    ['@@iterator']() { return this.entries(); }
                    [iteratorSymbol]() { return this.entries(); }

                    /**
                     * Find the index of a key, optionally inserting if not found.
                     * @param {any} key
                     * @param {boolean} insertIfMissing
                     * @returns {number}
                     * @private
                     */
                    _findIndex(key, insertIfMissing) {
                        if (this._cachedKey !== key) {
                            this._cachedIndex = this._keys.indexOf(this._cachedKey = key);
                        }
                        if (this._cachedIndex < 0 && insertIfMissing) {
                            this._cachedIndex = this._keys.length;
                            this._keys.push(key);
                            this._values.push(undefined);
                        }
                        return this._cachedIndex;
                    }
                }

                return PolyfillMap;
            }

            // ──────────────────────────────────────────────
            // Set polyfill
            // ──────────────────────────────────────────────

            /**
             * Create a simple Set polyfill backed by the Map polyfill.
             * @returns {new () => Set}
             */
            function createSetPolyfill() {
                class PolyfillSet {
                    constructor() {
                        /** @private */
                        this._map = new MapImpl();
                    }

                    get size() { return this._map.size; }

                    /** @param {any} value @returns {boolean} */
                    has(value) { return this._map.has(value); }

                    /**
                     * @param {any} value
                     * @returns {this}
                     */
                    add(value) {
                        this._map.set(value, value);
                        return this;
                    }

                    /** @param {any} value @returns {boolean} */
                    delete(value) { return this._map.delete(value); }

                    clear() { this._map.clear(); }

                    keys() { return this._map.keys(); }
                    values() { return this._map.values(); }
                    entries() { return this._map.entries(); }

                    ['@@iterator']() { return this.keys(); }
                    [iteratorSymbol]() { return this.keys(); }
                }

                return PolyfillSet;
            }

            // ──────────────────────────────────────────────
            // WeakMap polyfill
            // ──────────────────────────────────────────────

            /**
             * Create a WeakMap polyfill using hidden properties with UUID keys.
             * @returns {new () => WeakMap}
             */
            function createWeakMapPolyfill() {
                const keys = HashMap.create();

                /**
                 * Generate a unique UUID-based key for use as a hidden property.
                 * @returns {string}
                 */
                function createUniqueKey() {
                    let key;
                    do {
                        const bytes = typeof Uint8Array === 'function'
                            ? (typeof crypto !== 'undefined'
                                ? crypto.getRandomValues(new Uint8Array(16))
                                : typeof msCrypto !== 'undefined'
                                    ? msCrypto.getRandomValues(new Uint8Array(16))
                                    : fillRandom(new Uint8Array(16), 16))
                            : fillRandom(Array(16), 16);

                        bytes[6] = (bytes[6] & 0x4f) | 0x40; // version 4
                        bytes[8] = (bytes[8] & 0xbf) | 0x80; // variant 1

                        let hex = '';
                        for (let i = 0; i < 16; ++i) {
                            const byte = bytes[i];
                            if (i === 4 || i === 6 || i === 8) hex += '-';
                            if (byte < 16) hex += '0';
                            hex += byte.toString(16).toLowerCase();
                        }
                        key = '@@WeakMap@@' + hex;
                    } while (HashMap.has(keys, key));

                    keys[key] = true;
                    return key;
                }

                const rootKey = createUniqueKey();

                /**
                 * Get the hidden storage object from a target.
                 * @param {object} target
                 * @param {boolean} create - Whether to create it if missing
                 * @returns {object|undefined}
                 */
                function getHiddenStorage(target, create) {
                    if (!hasOwn.call(target, rootKey)) {
                        if (!create) return undefined;
                        Object.defineProperty(target, rootKey, { value: HashMap.create() });
                    }
                    return target[rootKey];
                }

                /**
                 * Fill an array with random bytes.
                 * @param {number[]|Uint8Array} array
                 * @param {number} length
                 * @returns {number[]|Uint8Array}
                 */
                function fillRandom(array, length) {
                    for (let i = 0; i < length; ++i) {
                        array[i] = (Math.random() * 255) | 0;
                    }
                    return array;
                }

                class PolyfillWeakMap {
                    constructor() {
                        this._key = createUniqueKey();
                    }

                    /** @param {object} target @returns {boolean} */
                    has(target) {
                        const storage = getHiddenStorage(target, false);
                        return storage !== undefined ? HashMap.has(storage, this._key) : false;
                    }

                    /** @param {object} target @returns {any} */
                    get(target) {
                        const storage = getHiddenStorage(target, false);
                        return storage !== undefined ? HashMap.get(storage, this._key) : undefined;
                    }

                    /**
                     * @param {object} target
                     * @param {any} value
                     * @returns {this}
                     */
                    set(target, value) {
                        getHiddenStorage(target, true)[this._key] = value;
                        return this;
                    }

                    /** @param {object} target @returns {boolean} */
                    delete(target) {
                        const storage = getHiddenStorage(target, false);
                        return storage !== undefined ? delete storage[this._key] : false;
                    }

                    clear() {
                        this._key = createUniqueKey();
                    }
                }

                return PolyfillWeakMap;
            }

            // ──────────────────────────────────────────────
            // Install Reflect API methods
            // ──────────────────────────────────────────────

            /**
             * Apply an array of decorators to a target or property.
             * @param {Function[]} decorators
             * @param {object|Function} target
             * @param {string|symbol} [propertyKey]
             * @param {PropertyDescriptor} [attributes]
             * @returns {Function|PropertyDescriptor}
             */
            registerMethod('decorate', function decorate(decorators, target, propertyKey, attributes) {
                if (isUndefined(propertyKey)) {
                    // Class decoration
                    if (!isArray(decorators)) throw new TypeError();
                    if (typeof target !== 'function') throw new TypeError();
                    for (let i = decorators.length - 1; i >= 0; --i) {
                        const decorated = decorators[i](target);
                        if (!isUndefined(decorated) && decorated !== null) {
                            if (typeof decorated !== 'function') throw new TypeError();
                            target = decorated;
                        }
                    }
                    return target;
                }

                // Member decoration
                if (!isArray(decorators)) throw new TypeError();
                if (!isObject(target)) throw new TypeError();
                if (!isObject(attributes) && !isUndefined(attributes) && attributes !== null) {
                    throw new TypeError();
                }
                if (attributes === null) attributes = undefined;
                propertyKey = toPropertyKey(propertyKey);

                for (let i = decorators.length - 1; i >= 0; --i) {
                    const decorated = decorators[i](target, propertyKey, attributes);
                    if (!isUndefined(decorated) && decorated !== null) {
                        if (!isObject(decorated)) throw new TypeError();
                        attributes = decorated;
                    }
                }
                return attributes;
            });

            /**
             * Create a metadata decorator.
             * @param {any} metadataKey
             * @param {any} metadataValue
             * @returns {(target: object, propertyKey?: string|symbol) => void}
             */
            registerMethod('metadata', function metadata(metadataKey, metadataValue) {
                return function decorator(target, propertyKey) {
                    if (!isObject(target)) throw new TypeError();
                    if (!isUndefined(propertyKey)) {
                        const tag = getTypeTag(propertyKey);
                        if (tag !== 3 && tag !== 4) throw new TypeError();
                    }
                    getOrCreateMetadataMap(target, propertyKey, true).set(metadataKey, metadataValue);
                };
            });

            /**
             * Define metadata on a target.
             * @param {any} metadataKey
             * @param {any} metadataValue
             * @param {object} target
             * @param {string|symbol} [propertyKey]
             */
            registerMethod('defineMetadata', function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
                if (!isObject(target)) throw new TypeError();
                if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);
                getOrCreateMetadataMap(target, propertyKey, true).set(metadataKey, metadataValue);
            });

            /**
             * Check if metadata exists on target or its prototype chain.
             * @param {any} metadataKey
             * @param {object} target
             * @param {string|symbol} [propertyKey]
             * @returns {boolean}
             */
            registerMethod('hasMetadata', function hasMetadata(metadataKey, target, propertyKey) {
                if (!isObject(target)) throw new TypeError();
                if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);
                return hasMetadataInChain(metadataKey, target, propertyKey);
            });

            /**
             * Check if metadata exists directly on target.
             * @param {any} metadataKey
             * @param {object} target
             * @param {string|symbol} [propertyKey]
             * @returns {boolean}
             */
            registerMethod('hasOwnMetadata', function hasOwnMetadata(metadataKey, target, propertyKey) {
                if (!isObject(target)) throw new TypeError();
                if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);
                return hasOwnMetadataImpl(metadataKey, target, propertyKey);
            });

            /**
             * Get metadata value from target or its prototype chain.
             * @param {any} metadataKey
             * @param {object} target
             * @param {string|symbol} [propertyKey]
             * @returns {any}
             */
            registerMethod('getMetadata', function getMetadata(metadataKey, target, propertyKey) {
                if (!isObject(target)) throw new TypeError();
                if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);
                return getMetadataInChain(metadataKey, target, propertyKey);
            });

            /**
             * Get metadata value directly from target.
             * @param {any} metadataKey
             * @param {object} target
             * @param {string|symbol} [propertyKey]
             * @returns {any}
             */
            registerMethod('getOwnMetadata', function getOwnMetadata(metadataKey, target, propertyKey) {
                if (!isObject(target)) throw new TypeError();
                if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);
                return getOwnMetadataImpl(metadataKey, target, propertyKey);
            });

            /**
             * Get all metadata keys from target and its prototype chain.
             * @param {object} target
             * @param {string|symbol} [propertyKey]
             * @returns {any[]}
             */
            registerMethod('getMetadataKeys', function getMetadataKeys(target, propertyKey) {
                if (!isObject(target)) throw new TypeError();
                if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);
                return getMetadataKeysInChain(target, propertyKey);
            });

            /**
             * Get own metadata keys directly from target.
             * @param {object} target
             * @param {string|symbol} [propertyKey]
             * @returns {any[]}
             */
            registerMethod('getOwnMetadataKeys', function getOwnMetadataKeys(target, propertyKey) {
                if (!isObject(target)) throw new TypeError();
                if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);
                return getOwnMetadataKeysImpl(target, propertyKey);
            });

            /**
             * Delete metadata from target.
             * @param {any} metadataKey
             * @param {object} target
             * @param {string|symbol} [propertyKey]
             * @returns {boolean}
             */
            registerMethod('deleteMetadata', function deleteMetadata(metadataKey, target, propertyKey) {
                if (!isObject(target)) throw new TypeError();
                if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);

                const metadataMap = getOrCreateMetadataMap(target, propertyKey, false);
                if (isUndefined(metadataMap) || !metadataMap.delete(metadataKey)) return false;
                if (metadataMap.size > 0) return true;

                const targetMap = metadataStore.get(target);
                targetMap.delete(propertyKey);
                if (targetMap.size > 0) return true;

                metadataStore.delete(target);
                return true;
            });

        })(function installOnReflect(registerMethod) {
            /**
             * Define a method on the target object if it doesn't already exist as a function.
             * @param {object} target
             * @param {Function} [fallback] - Optional callback to also register on
             * @returns {(name: string, impl: Function) => void}
             */
            function createRegistrar(target, fallback) {
                return function (name, impl) {
                    if (typeof target[name] !== 'function') {
                        Object.defineProperty(target, name, {
                            configurable: true,
                            writable: true,
                            value: impl,
                        });
                    }
                    if (fallback) fallback(name, impl);
                };
            }

            const globalObject = typeof __webpack_require__.g === 'object'
                ? __webpack_require__.g
                : typeof self === 'object'
                    ? self
                    : typeof this === 'object'
                        ? this
                        : Function('return this;')();

            let registrar = createRegistrar(Reflect_ns);

            if (typeof globalObject.Reflect === 'undefined') {
                globalObject.Reflect = Reflect_ns;
            } else {
                registrar = createRegistrar(globalObject.Reflect, registrar);
            }

            registerMethod(registrar);
        });

    })(Reflect_ || (Reflect_ = {}));
}
