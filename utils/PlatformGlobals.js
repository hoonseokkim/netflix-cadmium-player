/**
 * Netflix Cadmium Player - Platform Globals
 *
 * Captures references to browser/platform globals (window, document, navigator,
 * crypto, MediaSource, etc.) and standard library functions (Math, Array prototype).
 * Provides a single import point for all platform APIs used throughout the player.
 *
 * @module Module_22365
 */

const global = globalThis;

// Browser APIs
export const navigator = global.navigator;
export const browserUserAgent = navigator?.userAgent;
export const location = global.location;
export const screen = global.screen;
export const devicePixelRatio = global.devicePixelRatio;
export const performance = global.performance;
export const document = global.document;
export const documentElement = document.documentElement;

// Array prototype methods
export const arrayProto = Array.prototype;
export const sort = arrayProto.sort;
export const map = arrayProto.map;
export const slice = arrayProto.slice;
export const every = arrayProto.every;
export const reduce = arrayProto.reduce;
export const filter = arrayProto.filter;
export const forEach = arrayProto.forEach;
export const pop = arrayProto.pop;

// Object/Date/String built-ins
export const objectCreate = Object.create;
export const dateNow = Date.now;
export const fromCharCode = String.fromCharCode;

// Math functions
export const floor = Math.floor;
export const ceil = Math.ceil;
export const round = Math.round;
export const max = Math.max;
export const min = Math.min;
export const random = Math.random;
export const abs = Math.abs;
export const pow = Math.pow;
export const sqrt = Math.sqrt;

// URL encoding
export const escape = global.escape;
export const unescape = global.unescape;

// Media/Crypto APIs
export const URL = global.URL || global.webkitURL;
export const NativeMediaSource = global.MediaSource || global.WebKitMediaSource;
export const crypto = global.webkitCrypto || global.msCrypto || global.crypto;
export const subtle = crypto && (crypto.webkitSubtle || crypto.subtle);
export const cryptoKeys = global.webkitCryptokeys || global.msCryptokeys || global.cryptokeys;

// Storage APIs (wrapped in try/catch for restricted environments)
export let indexedDB;
export let indexedDBError;
try {
    indexedDB = global.indexedDB;
} catch (e) {
    indexedDBError = e || "noex";
}

export let localStorage;
export let localStorageError;
try {
    localStorage = global.localStorage;
} catch (e) {
    localStorageError = e || "noex";
}
