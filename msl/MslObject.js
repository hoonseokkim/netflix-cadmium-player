/**
 * @file MslObject.js
 * @description Core MSL (Message Security Layer) data structures: MslObject (key-value map)
 *   and comparison utilities for deep equality checks across MslObject, MslArray, and
 *   Uint8Array types. Also provides encode/serialize helpers for MSL protocol messages.
 * @module msl/MslObject
 * @original Module_46383 (W$, azb, $yb, internal_Qrc, graphFactory) + inline 9E3 (nj)
 */

import { MslEncodable } from '../msl/MslEncodable.js';  // Module 48235 (fp)
import { MslArray } from '../msl/MslArray.js';           // Module 77633 (ml)
import { MslError } from '../msl/MslError.js';           // Module 6838
import { ArrayUtil } from '../msl/ArrayUtil.js';          // Module 14945
import { quote, stringify } from '../msl/MslStringUtil.js'; // Module 21399
import { executeAsync } from '../msl/AsyncExecutor.js';   // Module 42979

// ─── Deep Equality ────────────────────────────────────────────────

/**
 * Deep-compares two MslObject instances for equality.
 * Recursively compares all keys/values including nested MslObject, MslArray, and Uint8Array.
 *
 * @param {MslObject|null} a - First object
 * @param {MslObject|null} b - Second object
 * @returns {boolean} True if structurally equal
 */
export function mslObjectEquals(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;

    const keysA = a.getKeys();
    const keysB = b.getKeys();

    if (keysA !== keysB && (keysA == null || keysB == null || keysA.length !== keysB.length || !ArrayUtil.T$(keysA, keysB))) {
        return false;
    }

    for (let i = 0; i < keysA.length; ++i) {
        const key = keysA[i];
        const valA = a.elementAtIndex(key);
        const valB = b.elementAtIndex(key);

        if (valA !== valB) {
            if (valA == null || valB == null) return false;

            if (valA instanceof Uint8Array || valB instanceof Uint8Array) {
                const binA = a.readUint16(key);
                const binB = b.readUint16(key);
                if (!ArrayUtil.equal(binA, binB)) return false;
            } else if (valA instanceof MslObject && valB instanceof MslObject) {
                if (!mslObjectEquals(valA, valB)) return false;
            } else if (valA instanceof MslArray && valB instanceof MslArray) {
                if (!mslArrayEquals(valA, valB)) return false;
            } else if (typeof valA !== typeof valB || valA != valB) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Deep-compares two MslArray instances for equality.
 *
 * @param {MslArray|null} a - First array
 * @param {MslArray|null} b - Second array
 * @returns {boolean} True if structurally equal
 */
export function mslArrayEquals(a, b) {
    if (a === b) return true;
    if (a == null || b == null || a.size() !== b.size()) return false;

    for (let i = 0; i < a.size(); ++i) {
        const valA = a.elementAtIndex(i);
        const valB = b.elementAtIndex(i);

        if (valA !== valB) {
            if (valA == null || valB == null) return false;

            if (valA instanceof Uint8Array || valB instanceof Uint8Array) {
                const binA = a.readUint16(i);
                const binB = b.readUint16(i);
                if (!ArrayUtil.equal(binA, binB)) return false;
            } else if (valA instanceof MslObject && valB instanceof MslObject) {
                if (!mslObjectEquals(valA, valB)) return false;
            } else if (valA instanceof MslArray && valB instanceof MslArray) {
                if (!mslArrayEquals(valA, valB)) return false;
            } else if (typeof valA !== typeof valB || valA != valB) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Compares two MslArray instances for shallow element equality (by reference or value).
 *
 * @param {MslArray|null} a - First array
 * @param {MslArray|null} b - Second array
 * @returns {boolean} True if elements match shallowly
 */
export function mslArrayShallowEquals(a, b) {
    if (a == b) return true;
    if (a == null || b == null || a.size() !== b.size()) return false;

    const arrA = [];
    const arrB = [];
    for (let i = 0; i < a.size(); ++i) {
        arrA[i] = a.elementAtIndex(i);
        arrB[i] = b.elementAtIndex(i);
    }
    return ArrayUtil.T$(arrA, arrB);
}

/**
 * Encodes a sequence of values into an MslArray on the given MSL context, handling
 * asynchronous MslEncodable values.
 *
 * @param {Object} mslContext - MSL encoder context
 * @param {Array} values - Values to encode (primitives, MslObject, MslArray, MslEncodable, etc.)
 * @param {Object} callback - Async callback with result/error handlers
 */
export function encodeToMslArray(mslContext, values, callback) {
    function encodeNext(encoder, targetArray, index, cb) {
        executeAsync(cb, () => {
            if (index >= values.length) return targetArray;

            const value = values[index];

            if (value instanceof Boolean || typeof value === 'boolean' ||
                value instanceof Uint8Array ||
                value instanceof Number || typeof value === 'number' ||
                value instanceof MslObject || value instanceof MslArray ||
                value instanceof String || typeof value === 'string' ||
                (value instanceof Object && value.constructor === Object) ||
                value instanceof Array || value === null) {
                targetArray.put(-1, value);
                encodeNext(encoder, targetArray, index + 1, cb);
            } else if (value instanceof MslEncodable) {
                value.processData(encoder, encoder.cDb(), {
                    result(encoded) {
                        executeAsync(cb, () => {
                            const parsed = encoder.parseFunction(encoded);
                            targetArray.put(-1, parsed);
                            encodeNext(encoder, targetArray, index + 1, cb);
                        });
                    },
                    error: cb.error
                });
            } else {
                throw new MslError('Class ' + typeof value + ' is not MSL encoding-compatible.');
            }
        });
    }

    executeAsync(callback, () => {
        const encoder = mslContext.defaultValue;
        const array = encoder.W$();
        encodeNext(encoder, array, 0, callback);
    });
}

/**
 * Merges two MslObject instances, with the second object's keys overriding the first.
 *
 * @param {MslObject|null} base - Base object (may be null)
 * @param {MslObject|null} overrides - Override object (may be null)
 * @returns {MslObject|null} Merged MslObject, or null if both inputs are null
 */
export function mergeMslObjects(base, overrides) {
    if (!base && !overrides) return null;

    const result = base ? new MslObject(base.xCb()) : new MslObject();

    if (!overrides) return result;

    const keys = overrides.getKeys();
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        result.put(key, overrides.key(key));
    }
    return result;
}

// ─── MslObject Class ──────────────────────────────────────────────

/**
 * Key-value map used in the MSL (Message Security Layer) protocol.
 * Values can be booleans, numbers, strings, Uint8Arrays, MslObjects, MslArrays,
 * MslEncodable instances, plain objects, or arrays.
 */
export class MslObject {
    /**
     * @param {Object|null} [initialData=null] - Optional initial key-value pairs
     */
    constructor(initialData = null) {
        /** @type {Object} Internal storage map */
        this.map = {};

        if (initialData) {
            for (const key in initialData) {
                if (!(key instanceof String) && typeof key !== 'string') {
                    throw new TypeError('Map key is not a string.');
                }
                this.put(key, initialData[key]);
            }
        }
    }

    /**
     * Gets a required value by key.
     * @param {string} key
     * @returns {*} The value (wrapping plain objects/arrays into MslObject/MslArray)
     * @throws {MslError} If key not found
     */
    key(key) {
        if (key instanceof String) key = key.valueOf();
        if (typeof key !== 'string') throw new TypeError('Unsupported key.');

        const value = this.map[key];
        if (value === null || value === undefined) {
            throw new MslError('MslObject[' + quote(key) + '] not found.');
        }
        if (value instanceof Object && value.constructor === Object) return new MslObject(value);
        if (value instanceof Array) return new MslArray(value);
        return value;
    }

    /**
     * Gets a boolean value by key.
     * @param {string} key
     * @returns {boolean}
     * @throws {MslError} If value is not a boolean
     */
    getBoolean(key) {
        const value = this.key(key);
        if (value instanceof Boolean) return value.valueOf();
        if (typeof value === 'boolean') return value;
        throw new MslError('MslObject[' + quote(key) + '] is not a boolean.');
    }

    /**
     * Gets binary data (Uint8Array) by key.
     * @param {string} key
     * @returns {Uint8Array}
     * @throws {MslError} If value is not a Uint8Array
     */
    readUint16(key) {
        const value = this.key(key);
        if (value instanceof Uint8Array) return value;
        throw new MslError('MslObject[' + quote(key) + '] is not binary data.');
    }

    /**
     * Gets an integer value by key (truncated to 32-bit int).
     * @param {string} key
     * @returns {number}
     * @throws {MslError} If value is not a number
     */
    getInt(key) {
        const value = this.key(key);
        if (value instanceof Number) return value.valueOf() << 0;
        if (typeof value === 'number') return value << 0;
        throw new MslError('MslObject[' + quote(key) + '] is not a number.');
    }

    /**
     * Gets an MslArray by key.
     * @param {string} key
     * @returns {MslArray}
     * @throws {MslError} If value is not an array
     */
    getMslArray(key) {
        const value = this.key(key);
        if (value instanceof MslArray) return value;
        if (value instanceof Array) return new MslArray(value);
        throw new MslError('MslObject[' + quote(key) + '] is not a MslArray.');
    }

    /**
     * Gets a nested MslObject by key, optionally decoding from binary.
     * @param {string} key
     * @param {Object} encoder - MSL encoder for binary decoding
     * @returns {MslObject}
     * @throws {MslError} If value cannot be converted to MslObject
     */
    authData(key, encoder) {
        const value = this.key(key);
        if (value instanceof MslObject) return value;
        if (value instanceof Object && value.constructor === Object) return new MslObject(value);
        if (value instanceof Uint8Array) {
            try {
                return encoder.parseFunction(value);
            } catch (e) {
                if (e instanceof MslError) {
                    throw new MslError('MslObject[' + quote(key) + '] is not a MslObject.');
                }
                throw e;
            }
        }
        throw new MslError('MslObject[' + quote(key) + '] is not a MslObject.');
    }

    /**
     * Gets a numeric value by key (as a float/long).
     * @param {string} key
     * @returns {number}
     * @throws {MslError} If value is not a number
     */
    getLong(key) {
        const value = this.key(key);
        if (value instanceof Number) return parseInt(value.valueOf());
        if (typeof value === 'number') return value;
        throw new MslError('MslObject[' + quote(key) + '] is not a number.');
    }

    /**
     * Gets a string value by key.
     * @param {string} key
     * @returns {string}
     * @throws {MslError} If value is not a string
     */
    getString(key) {
        const value = this.key(key);
        if (value instanceof String) return value.valueOf();
        if (typeof value === 'string') return value;
        throw new MslError('MslObject[' + quote(key) + '] is not a string.');
    }

    /**
     * Checks if a key exists in this object.
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        if (typeof key !== 'string') throw new TypeError('Null key.');
        return this.map.hasOwnProperty(key);
    }

    /**
     * Gets a value by key, returning null if not found. Wraps raw objects/arrays.
     * @param {string} key
     * @returns {*|null}
     */
    elementAtIndex(key) {
        if (key instanceof String) key = key.valueOf();
        if (typeof key !== 'string') throw new TypeError('Unsupported key.');

        const value = this.map[key];
        try {
            if (value instanceof Object && value.constructor === Object) return new MslObject(value);
            if (value instanceof Array) return new MslArray(value);
        } catch (_e) {
            if (value instanceof TypeError) return null;
        }
        return value;
    }

    /**
     * Gets an optional MslArray by key.
     * @param {string} key
     * @returns {MslArray|null}
     */
    optMslArray(key) {
        const value = this.elementAtIndex(key);
        if (value instanceof MslArray) return value;
        if (value instanceof Array) return new MslArray(value);
        return null;
    }

    /**
     * Gets an optional string with a default fallback.
     * @param {string} key
     * @param {string|null} defaultValue
     * @returns {string|null}
     */
    optString(key, defaultValue) {
        const value = this.elementAtIndex(key);
        if (value instanceof String) return value.valueOf();
        if (typeof value === 'string') return value;
        if (defaultValue instanceof String) return defaultValue.valueOf();
        if (typeof defaultValue === 'string' || defaultValue === null) return defaultValue;
        return '';
    }

    /**
     * Sets a key-value pair. Null values delete the key.
     * @param {string} key
     * @param {*} value
     * @returns {MslObject} this
     */
    put(key, value) {
        if (key instanceof String) key = key.valueOf();
        if (typeof key !== 'string') throw new TypeError('Unsupported key.');

        if (value === null) {
            delete this.map[key];
            return this;
        }

        if (value instanceof Boolean || typeof value === 'boolean' ||
            value instanceof Uint8Array ||
            value instanceof Number || typeof value === 'number' ||
            value instanceof MslObject || value instanceof MslArray ||
            value instanceof String || typeof value === 'string' ||
            value instanceof MslEncodable) {
            this.map[key] = value;
        } else if (value instanceof Object && value.constructor === Object) {
            this.map[key] = new MslObject(value);
        } else if (value instanceof Array) {
            this.map[key] = new MslArray(value);
        } else {
            throw new TypeError('Value [' + typeof value + '] is an unsupported type.');
        }
        return this;
    }

    /**
     * Removes and returns a value by key.
     * @param {string} key
     * @returns {*|undefined}
     */
    item(key) {
        if (key instanceof String) key = key.valueOf();
        if (typeof key !== 'string') throw new TypeError('Unsupported key.');

        const value = this.elementAtIndex(key);
        delete this.map[key];
        return value;
    }

    /**
     * Returns all keys in this object.
     * @returns {string[]}
     */
    getKeys() {
        return Object.keys(this.map);
    }

    /**
     * Returns a shallow copy of the internal map.
     * @returns {Object}
     */
    xCb() {
        const copy = {};
        for (const k in this.map) copy[k] = this.map[k];
        return copy;
    }

    /**
     * Deep equality check against another MslObject.
     * @param {MslObject} other
     * @returns {boolean}
     */
    equals(other) {
        if (this == other) return true;
        if (!(other instanceof MslObject)) return false;
        try {
            return mslObjectEquals(this, other);
        } catch (e) {
            if (e instanceof MslError) return false;
            throw e;
        }
    }

    /**
     * Returns a JSON-like string representation.
     * @returns {string}
     */
    toString() {
        let result = '{';
        const keys = Object.keys(this.map);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = this.map[key];
            result += (value instanceof MslObject || value instanceof MslArray)
                ? quote(key) + ':{}'
                : quote(key) + ':' + stringify(value);
            if (i !== keys.length - 1) result += ',';
        }
        return result + '}';
    }
}

export default MslObject;
