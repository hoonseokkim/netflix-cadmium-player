/**
 * Netflix Cadmium Player - DOM Helpers / Player Utilities
 * (Originally Webpack Module 52569)
 *
 * Collection of DOM/browser utility functions including:
 * - Query string parsing and cookie reading
 * - Object/array comparison and manipulation
 * - DOM element creation and insertion
 * - MP4 box traversal and CENC default key extraction
 * - GUID byte-swapping (mixed-endian to big-endian)
 * - Typed array debug formatting
 * - Statistical helpers (min, max, percentile, stddev)
 * - Bitrate range selection
 * - Aspect ratio calculation
 * - Endianness detection
 * - Performance timing retrieval
 * - Cached chunk restoration for media buffers
 * - ArrayBuffer.prototype.slice polyfill
 *
 * @module DomHelpers
 */

import { AVC_SAMPLE_ENTRY_TYPE, HEVC_SAMPLE_ENTRY_TYPE } from "./Module_33096"; // h = a(33096)  - MP4 box type constants
import { toUint8Array, log } from "./Module_31276";                              // k = a(31276)  - encoding/logging utilities
import { trim, forEachProperty, parseInteger, randomInt } from "./Module_3887";  // l = a(3887)   - string/object helpers
import {
    location as browserLocation,   // m.bla
    document,                       // m.$i
    performance as perf,            // m.$C
    sort as arraySort,              // m.sort
    reduce as arrayReduce,          // m.reduce
    fromCharCode,                   // m.dmb  - String.fromCharCode
    mathFloor,                      // m.uX   - Math.floor
    mathRound,                      // m.totalTime - Math.round
    mathPow,                        // m.internal_Cgb - Math.pow
    mathSqrt,                       // m.internal_Dgb - Math.sqrt
} from "./Module_22365";                                                         // m = a(22365) - platform globals
import {
    isArray,
    isTypedArray,       // n.yda
    isString,           // n.arrayCheck
    isFunction,         // n.typeofChecker
    isNumber,           // n.wc
    isDefined,          // n.gd (unused here but available)
} from "./Module_32687";                                                         // n = a(32687) - type checks
import { CENC_SCHEME_TYPE } from "./Module_82100";                               // q = a(82100) - DRM constants


// ---------------------------------------------------------------------------
// Internal / private helpers
// ---------------------------------------------------------------------------

/** @type {Object|undefined} Cached parsed query string parameters */
let _cachedQueryParams;

/**
 * Parse the current page's query string into a key-value map.
 * Results are cached after the first call.
 *
 * @returns {Object<string, string|null>} Parsed query parameters (keys lowercased).
 */
function getQueryParams() {
    if (_cachedQueryParams) {
        return _cachedQueryParams;
    }
    let raw = browserLocation.search.substr(1);
    const hashIdx = raw.indexOf("#");
    if (hashIdx >= 0) {
        raw = raw.substr(0, hashIdx);
    }
    _cachedQueryParams = parseQueryString(raw);
    return _cachedQueryParams;
}

/**
 * Parse a raw query string (without leading "?") into a key-value map.
 *
 * @param {string} queryString - The query string to parse.
 * @returns {Object<string, string|null>} Parsed parameters (keys lowercased).
 */
function parseQueryString(queryString) {
    const plusRegex = /[+]/g;
    const pairs = (queryString || "").split("&");
    const result = {};
    for (let i = 0; i < pairs.length; i++) {
        const trimmed = trim(pairs[i]);
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx >= 0) {
            const key = decodeURIComponent(trimmed.substr(0, eqIdx).replace(plusRegex, "%20")).toLowerCase();
            const value = decodeURIComponent(trimmed.substr(eqIdx + 1).replace(plusRegex, "%20"));
            result[key] = value;
        } else {
            result[trimmed.toLowerCase()] = null;
        }
    }
    return result;
}

/**
 * Extract the name of a function from its toString() representation.
 *
 * @param {Function} fn - The function whose name to extract.
 * @returns {string} The function name, or empty string if not found.
 */
function getFunctionName(fn) {
    const match = (/function (.{1,})\(/).exec(fn.toString());
    return match && match.length > 1 ? match[1] : "";
}

/**
 * Get the constructor name of an object.
 *
 * @param {*} obj - Any value.
 * @returns {string} The constructor's function name.
 */
function getConstructorName(obj) {
    return getFunctionName(obj.constructor);
}

/**
 * Sort a numeric array in ascending order (in-place).
 *
 * @param {number[]} arr - The array to sort.
 * @returns {number[]} The sorted array.
 */
function sortNumericAscending(arr) {
    return arraySort.call(arr, (a, b) => a - b);
}

/**
 * Sum all elements of a numeric array.
 *
 * @param {number[]} arr - The array to sum.
 * @returns {number} The sum.
 */
function sumArray(arr) {
    let total = 0;
    for (let i = arr.length; i--; ) {
        total += arr[i];
    }
    return total;
}


// ---------------------------------------------------------------------------
// Exported functions
// ---------------------------------------------------------------------------

/**
 * Shallow-compare two objects for property equality.
 * Returns true if every own property in `a` exists in `b` with the same value.
 *
 * @param {Object} a - First object.
 * @param {Object} b - Second object.
 * @returns {boolean} True if objects are shallowly equal.
 */
export function shallowEqual(a, b) {
    if (a === b) return true;
    if (!a || !b) return false;
    for (const key in a) {
        if (a.hasOwnProperty(key) && (!b.hasOwnProperty(key) || a[key] !== b[key])) {
            return false;
        }
    }
    return true;
}

/**
 * Pick a random element from an array.
 *
 * @param {Array} arr - Source array.
 * @returns {*} A randomly chosen element, or undefined if array is empty/falsy.
 */
export function pickRandom(arr) {
    if (arr && arr.length) {
        const idx = randomInt(0, arr.length - 1);
        return arr[idx];
    }
}

/**
 * Check whether two arrays contain the same elements (order-independent).
 * Both arrays are sorted in-place before comparison.
 *
 * @param {Array} a - First array.
 * @param {Array} b - Second array.
 * @returns {boolean} True if arrays have identical sorted contents.
 */
export function arraysEqualUnordered(a, b) {
    if (a.length !== b.length) return false;
    a.sort();
    b.sort();
    for (let i = a.length; i--; ) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

/**
 * Add a one-time event listener to a DOM element.
 * The listener removes itself after the first invocation.
 *
 * @param {EventTarget} element - The target element.
 * @param {string} eventName - Event type (e.g. "click").
 * @param {Function} callback - Handler to invoke once.
 */
export function addOnceEventListener(element, eventName, callback) {
    function handler() {
        element.removeEventListener(eventName, handler);
        callback.apply(this, arguments);
    }
    element.addEventListener(eventName, handler);
}

/**
 * Parse all cookies from `document.cookie` into a key-value map.
 *
 * @returns {Object<string, string>} Cookie name-value pairs.
 */
export function getCookies() {
    const parts = document.cookie.split("; ");
    const cookies = {};
    for (let i = 0; i < parts.length; i++) {
        const part = trim(parts[i]);
        if (part) {
            const eqIdx = part.indexOf("=");
            if (eqIdx > 0) {
                cookies[part.substr(0, eqIdx)] = part.substr(eqIdx + 1);
            }
        }
    }
    return cookies;
}

/**
 * Get the current page's parsed query string parameters (cached).
 * Also acts as a callable function and stores cached value on itself.
 *
 * @type {Function & { cachedParams: Object|undefined }}
 */
export const getConfigParams = Object.assign(getQueryParams, {
    cachedParams: undefined,
});

/** @see parseQueryString */
export { parseQueryString };

/** @see getFunctionName */
export { getFunctionName };

/**
 * Get the constructor name of an object.
 *
 * @param {*} obj - Any value.
 * @returns {string} Constructor name.
 */
export { getConstructorName };

/**
 * Produce a human-readable debug string for any value.
 * - Arrays / TypedArrays: prints ASCII chars for printable bytes, "." otherwise.
 * - Strings: returns as-is.
 * - Objects: lists key-value pairs.
 *
 * @param {*} value - The value to format.
 * @returns {string} A debug representation like "[Array ...]".
 */
export function toDebugString(value) {
    let body = "";
    if (isArray(value) || isTypedArray(value)) {
        body = arrayReduce.call(value, (acc, byte) => {
            return acc + (byte >= 32 && byte < 128 ? fromCharCode(byte) : ".");
        }, "");
    } else if (isString(value)) {
        body = value;
    } else {
        forEachProperty(value, (key, val) => {
            body += (body ? ", " : "") + "{" + key + ": " + (isFunction(val) ? getFunctionName(val) || "function" : val) + "}";
        });
    }
    return "[" + getConstructorName(value) + " " + body + "]";
}

/**
 * Prepend a child element as the first child of a parent.
 *
 * @param {Element} parent - The parent DOM element.
 * @param {Element} child - The child element to prepend.
 */
export function prependChild(parent, child) {
    if (parent.firstChild) {
        parent.insertBefore(child, parent.firstChild);
    } else {
        parent.appendChild(child);
    }
}

/**
 * Linearly interpolate within a table of keyframes.
 * Each keyframe is an array where index 0 is the position key and
 * the remaining indices are the values to interpolate.
 *
 * @param {Array<number[]>} keyframes - Sorted array of keyframe arrays.
 * @param {number} position - The position to interpolate at.
 * @returns {number[]} Interpolated values (without the position key).
 */
export function interpolateKeyframes(keyframes, position) {
    let prev = keyframes[0];
    if (position <= prev[0]) {
        return prev.slice(1);
    }
    for (let i = 1, curr; (curr = keyframes[i++]); ) {
        if (position <= curr[0]) {
            const t = (position - prev[0]) / (curr[0] - prev[0]);
            const result = [];
            for (let j = 1; j < prev.length; j++) {
                result.push((prev[j] || 0) + t * ((curr[j] || 0) - (prev[j] || 0)));
            }
            return result;
        }
        prev = curr;
    }
    return prev.slice(1);
}

/**
 * Check if every element in `subset` exists in `superset`.
 * All elements must be strings or numbers.
 *
 * @param {Array} subset - Elements that must all be present.
 * @param {Array} superset - The set to check against.
 * @returns {boolean} True if superset contains all subset elements.
 */
export function isSubsetOf(subset, superset) {
    const lookup = {};
    for (let i = 0; i < superset.length; i++) {
        const item = superset[i];
        if (typeof item !== "string" && typeof item !== "number") {
            return false;
        }
        lookup[item] = 1;
    }
    for (let i = 0; i < subset.length; i++) {
        if (!lookup[subset[i]]) {
            return false;
        }
    }
    return true;
}

/** Sort numeric array ascending (exported alias). */
export { sortNumericAscending };

/** Sum all elements of a numeric array (exported alias). */
export { sumArray };

/**
 * Find the maximum value in an array, optionally using an accessor function.
 *
 * @param {Array} arr - Source array.
 * @param {Function} [accessor] - Optional function(element, index) returning a comparable value.
 * @returns {*} The maximum value, or undefined if array is empty.
 */
export function findMaxValue(arr, accessor) {
    let i = -1;
    const len = arr.length;
    let max, val;
    if (arguments.length === 1) {
        // No accessor - compare values directly
        while (++i < len && !(null != (max = arr[i]) && max <= max)) {
            max = undefined;
        }
        while (++i < len) {
            if (null != (val = arr[i]) && val > max) {
                max = val;
            }
        }
    } else {
        // With accessor
        while (++i < len && !(null != (max = accessor.call(arr, arr[i], i)) && max <= max)) {
            max = undefined;
        }
        while (++i < len) {
            if (null != (val = accessor.call(arr, arr[i], i)) && val > max) {
                max = val;
            }
        }
    }
    return max;
}

/**
 * Find the minimum value in an array, optionally using an accessor function.
 *
 * @param {Array} arr - Source array.
 * @param {Function} [accessor] - Optional function(element, index) returning a comparable value.
 * @returns {*} The minimum value, or undefined if array is empty.
 */
export function findMinValue(arr, accessor) {
    let i = -1;
    const len = arr.length;
    let min, val;
    if (arguments.length === 1) {
        while (++i < len && !(null != (min = arr[i]) && min <= min)) {
            min = undefined;
        }
        while (++i < len) {
            if (null != (val = arr[i]) && min > val) {
                min = val;
            }
        }
    } else {
        while (++i < len && !(null != (min = accessor.call(arr, arr[i], i)) && min <= min)) {
            min = undefined;
        }
        while (++i < len) {
            if (null != (val = accessor.call(arr, arr[i], i)) && min > val) {
                min = val;
            }
        }
    }
    return min;
}

/**
 * Wrap an IDBRequest or thenable in a Promise.
 * If the value already has a `.then` method it is returned as-is;
 * otherwise it is treated as an IDBRequest and wrapped.
 *
 * @param {IDBRequest|Promise} request - The request or promise to wrap.
 * @returns {Promise} A promise resolving with the result.
 */
export function wrapAsPromise(request) {
    if (isFunction(request.then)) {
        return request;
    }
    return new Promise((resolve, reject) => {
        request.oncomplete = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Select bitrates from a sorted list that match the given range selectors.
 *
 * Selectors can be:
 * - A plain number: exact match
 * - A string ending with "+": the first bitrate above the number
 * - A string ending with "-": the last bitrate below the number
 *
 * @param {number[]} bitrates - Available bitrate values.
 * @param {Array<number|string>} selectors - Range selectors.
 * @returns {number[]} Matched bitrates, sorted ascending.
 */
export function selectBitrateRange(bitrates, selectors) {
    const selected = [];

    function addUnique(value) {
        if (selected.indexOf(value) < 0 && isNumber(value)) {
            selected.push(value);
        }
    }

    bitrates = bitrates.slice();
    sortNumericAscending(bitrates);

    if (!selectors || !selectors.length) return bitrates;
    if (!bitrates.length) return [];

    let sIdx = selectors.length;
    try {
        while (sIdx--) {
            const selectorStr = "" + selectors[sIdx];
            const threshold = parseInteger(selectorStr);
            const lastChar = selectorStr[selectorStr.length - 1];

            switch (lastChar) {
                case "-":
                    // Find the highest bitrate below the threshold
                    for (let j = bitrates.length; j--; ) {
                        if (bitrates[j] < threshold) {
                            addUnique(bitrates[j]);
                            break;
                        }
                    }
                    break;
                case "+":
                    // Find the lowest bitrate above the threshold
                    for (let j = 0; j < bitrates.length; j++) {
                        if (bitrates[j] > threshold) {
                            addUnique(bitrates[j]);
                            break;
                        }
                    }
                    break;
                default:
                    // Exact match
                    if (bitrates.indexOf(threshold) >= 0) {
                        addUnique(threshold);
                    }
            }
        }
    } catch (e) {
        // Silently ignore selector parse errors
    }

    if (!selected.length) {
        selected.push(bitrates[0]);
    }
    sortNumericAscending(selected);
    return selected;
}

/**
 * Compute the standard deviation of the first `count` elements
 * of an array, given a mean value.
 *
 * @param {number[]} values - The data array.
 * @param {number} count - How many elements to consider.
 * @param {number} mean - The mean to measure deviation from.
 * @returns {number} The standard deviation.
 */
export function standardDeviation(values, count, mean) {
    const squaredDiffs = [];
    for (let i = 0; i < count; i++) {
        squaredDiffs.push(mathPow(values[i] - mean, 2));
    }
    return mathSqrt(sumArray(squaredDiffs) / squaredDiffs.length);
}

/**
 * Compute the k-th percentile of a sorted numeric array
 * using linear interpolation between elements.
 *
 * @param {number[]} sortedArr - A sorted numeric array.
 * @param {number} percentile - A value between 0 and 1 (e.g. 0.95 for 95th percentile).
 * @returns {number} The interpolated percentile value.
 */
export function computePercentile(sortedArr, percentile) {
    const len = sortedArr.length;
    const rank = (len - 1) * percentile + 1;
    if (rank === 1) return sortedArr[0];
    if (rank === len) return sortedArr[len - 1];
    const lower = mathFloor(rank);
    return sortedArr[lower - 1] + (rank - lower) * (sortedArr[lower] - sortedArr[lower - 1]);
}

/**
 * Find a box by type within an array of MP4 boxes.
 * Supports matching against multiple types.
 *
 * @param {Array} boxes - Array of parsed MP4 box objects (each with a `.type` property).
 * @param {string|string[]} types - One or more box type fourCC codes.
 * @returns {Object} The first matching box.
 * @throws {Error} If boxes is not a non-empty array or the box is not found.
 */
export function findBoxByType(boxes, types) {
    if (!isArray(boxes)) throw Error("boxes is not an array");
    if (boxes.length <= 0) throw Error("There are no boxes in boxes");

    types = isArray(types) ? types : [types];
    for (let i = 0; i < boxes.length; i++) {
        for (let j = 0; j < types.length; j++) {
            if (boxes[i].type === types[j]) {
                return boxes[i];
            }
        }
    }
    throw Error("Box not found " + types);
}

/**
 * Extract the default CENC encryption key ID from a parsed MP4 init segment.
 * Navigates: moov -> trak -> mdia -> minf -> stbl -> stsd -> (avc1|encv) -> sinf -> schi -> tenc
 *
 * @param {Object} moovBox - The parsed 'moov' MP4 box with `.findChildByPath()` support.
 * @returns {Uint8Array} The 16-byte default key ID.
 */
export function extractDefaultKeyId(moovBox) {
    const sampleEntry = moovBox.findChildByPath(
        "trak/mdia/minf/stbl/stsd/" + AVC_SAMPLE_ENTRY_TYPE + "|" + HEVC_SAMPLE_ENTRY_TYPE
    );
    const sinfBox = sampleEntry.children.filter(
        (child) => child.type === "sinf" && child.parsedData.schm.schemeType === CENC_SCHEME_TYPE
    )[0];
    return sinfBox.findChildByPath("schi/tenc").defaultKeyId;
}

/**
 * Convert a GUID byte array from mixed-endian (Microsoft) format
 * to big-endian (standard) format by swapping specific byte pairs.
 *
 * The swaps are: [0]<->[3], [1]<->[2], [4]<->[5], [6]<->[7]
 *
 * @param {ArrayBuffer|Uint8Array} guidBytes - 16-byte GUID in mixed-endian format.
 * @returns {Uint8Array} The GUID in big-endian byte order.
 */
export function swapGuidEndianness(guidBytes) {
    const bytes = new Uint8Array(guidBytes);

    function swap(i, j) {
        const tmp = bytes[i];
        bytes[i] = bytes[j];
        bytes[j] = tmp;
    }

    swap(0, 3);
    swap(1, 2);
    swap(4, 5);
    swap(6, 7);
    return bytes;
}

/**
 * Create a property accessor function that extracts a named property.
 *
 * @param {string} propName - The property name to extract.
 * @returns {Function} A function that takes an object and returns `obj[propName]`.
 */
export function propertyAccessor(propName) {
    return (obj) => obj && obj[propName];
}

/**
 * Check whether a URL string starts with "https".
 *
 * @param {string} url - The URL to test.
 * @returns {boolean} True if the URL is HTTPS.
 */
export function isHttpsUrl(url) {
    return url && url.toLowerCase().indexOf("https") === 0;
}

/**
 * Detect the byte order (endianness) of the current platform.
 *
 * @returns {"LE"|"BE"|"undefined"} The detected endianness.
 */
export function detectEndianness() {
    const buffer = new ArrayBuffer(4);
    const u8 = new Uint8Array(buffer);
    const u32 = new Uint32Array(buffer);
    u8[0] = 0xA1;
    u8[1] = 0xB2;
    u8[2] = 0xC3;
    u8[3] = 0xD4;
    if (u32[0] === 0xD4C3B2A1) return "LE";
    if (u32[0] === 0xA1B2C3D4) return "BE";
    return "undefined";
}

/**
 * Retrieve the load duration of the playercore script from the
 * Performance Resource Timing API.
 *
 * @returns {string|undefined} JSON-stringified rounded duration, or undefined.
 */
export function getPlayercoreLoadDuration() {
    try {
        const pattern = /playercore.*js/;
        const entries = perf.getEntries("resource").filter(
            (entry) => pattern.exec(entry.name) !== null
        );
        if (entries && entries.length > 0) {
            const duration = mathRound(entries[0].duration);
            return JSON.stringify(duration);
        }
    } catch (e) {
        // Silently ignore if Performance API is unavailable
    }
}

/**
 * Restore media data from cached chunks into a media buffer's chunk descriptors.
 * Each chunk's `.media` property is populated with the cached ArrayBuffer data.
 *
 * @param {Array} chunks - Array of chunk descriptor objects (each with `.media` and `.playbackInfo`).
 * @param {*} stream - The stream identifier to attach to each restored chunk.
 * @param {Object} cachedStream - The cached stream object with `.cachedChunks` array and `.type`.
 */
export function restoreCachedChunks(chunks, stream, cachedStream) {
    if (chunks && chunks.length) {
        if (cachedStream && cachedStream.cachedChunks) {
            try {
                chunks.forEach((chunk, index) => {
                    const cached = cachedStream.cachedChunks[index];
                    const mediaData = cached && cached.media;
                    if (mediaData && isString(mediaData)) {
                        // Convert cached string data to ArrayBuffer via Uint8Array
                        const buffer = toUint8Array(mediaData).buffer;
                        chunk.media = {
                            arrayBuffer: buffer,
                            length: buffer.byteLength,
                            stream: stream,
                            sourceBufferArray: cached.cdn,
                        };
                    } else {
                        log.RETRY("chunk not in cache", chunk.playbackInfo);
                    }
                });
            } catch (err) {
                log.error("error reading cached chunks", err);
            }
        } else {
            log.RETRY("chunks not available in cached stream", cachedStream.type);
        }
    } else {
        log.RETRY("chunks not available in mediabuffer", cachedStream.type);
    }
}

/**
 * Compare two arrays for strict element-wise equality.
 *
 * @param {Array} a - First array.
 * @param {Array} b - Second array.
 * @returns {boolean} True if arrays have same length and identical elements.
 */
export function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = a.length; i--; ) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

/**
 * Serialize an object's properties into a semicolon-delimited string.
 * Format: "key1:value1;key2:value2"
 *
 * @param {Object} obj - The object to serialize.
 * @returns {string} Serialized string.
 */
export function serializeProperties(obj) {
    let result = "";
    forEachProperty(obj, (key, value) => {
        result += (result ? ";" : "") + key + ":" + value;
    });
    return result;
}

/**
 * Create a DOM element with optional styles, inner HTML, and attributes.
 *
 * @param {string} tagName - The HTML tag name.
 * @param {string} [cssText] - Inline CSS text to apply.
 * @param {string} [innerHTML] - Inner HTML content.
 * @param {Object} [attributes] - Key-value pairs of attributes to set.
 * @returns {HTMLElement} The created element.
 */
export function createElement(tagName, cssText, innerHTML, attributes) {
    const el = document.createElement(tagName);
    if (cssText) el.style.cssText = cssText;
    if (innerHTML) el.innerHTML = innerHTML;
    if (attributes) {
        forEachProperty(attributes, (name, value) => {
            el.setAttribute(name, value);
        });
    }
    return el;
}

/**
 * Calculate dimensions that fit within a given aspect ratio.
 * If the source is wider than the target ratio, height is adjusted;
 * otherwise width is adjusted.
 *
 * @param {number} width - Source width.
 * @param {number} height - Source height.
 * @param {number} aspectRatio - Target aspect ratio (width / height).
 * @returns {{ width: number, height: number }} Fitted dimensions (rounded).
 */
export function calculateAspectRatio(width, height, aspectRatio) {
    let resultWidth, resultHeight;
    if (width / height > aspectRatio) {
        resultWidth = mathRound(height * aspectRatio);
        resultHeight = height;
    } else {
        resultWidth = width;
        resultHeight = mathRound(width / aspectRatio);
    }
    return {
        width: resultWidth,
        height: resultHeight,
    };
}

// ---------------------------------------------------------------------------
// Polyfill: ArrayBuffer.prototype.slice
// ---------------------------------------------------------------------------
if (!isFunction(ArrayBuffer.prototype.slice)) {
    /**
     * Polyfill for ArrayBuffer.prototype.slice for environments that lack it.
     *
     * @param {number} [begin=0] - Start byte offset.
     * @param {number} [end=byteLength] - End byte offset.
     * @returns {ArrayBuffer} A new ArrayBuffer containing the sliced data.
     */
    ArrayBuffer.prototype.slice = function (begin, end) {
        if (begin === undefined) begin = 0;
        if (end === undefined) end = this.byteLength;
        begin = Math.floor(begin);
        end = Math.floor(end);
        if (begin < 0) begin += this.byteLength;
        if (end < 0) end += this.byteLength;
        begin = Math.min(Math.max(0, begin), this.byteLength);
        end = Math.min(Math.max(0, end), this.byteLength);
        if (end - begin <= 0) return new ArrayBuffer(0);

        const result = new ArrayBuffer(end - begin);
        const target = new Uint8Array(result);
        const source = new Uint8Array(this, begin, end - begin);
        target.set(source);
        return result;
    };
}
