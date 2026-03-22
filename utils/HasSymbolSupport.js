/**
 * Netflix Cadmium Player — Symbol Support Detection
 *
 * Polyfill-style checks for native ES6 Symbol support.  Used by the
 * player to decide whether to use Symbol-based property keys or fall
 * back to string-based keys for private/internal properties.
 *
 * @module HasSymbolSupport
 */

/**
 * Checks whether the runtime environment fully supports ES6 Symbols,
 * including `Symbol()`, `Symbol.iterator`, `Object.getOwnPropertySymbols`,
 * and correct enumeration behavior.
 *
 * @returns {boolean} `true` if the environment has full Symbol support.
 */
export function hasNativeSymbols() {
  if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
    return false;
  }

  if (typeof Symbol.iterator === "symbol") {
    return true;
  }

  const testObj = {};
  const testSymbol = Symbol("test");
  const wrappedSymbol = Object(testSymbol);

  if (typeof testSymbol === "string" ||
      Object.prototype.toString.call(testSymbol) !== "[object Symbol]" ||
      Object.prototype.toString.call(wrappedSymbol) !== "[object Symbol]") {
    return false;
  }

  // Verify symbol property is non-enumerable with for-in
  testObj[testSymbol] = 42;
  for (const _key in testObj) {
    return false;
  }

  if (typeof Object.keys === "function" && Object.keys(testObj).length !== 0) {
    return false;
  }

  if (typeof Object.getOwnPropertyNames === "function" &&
      Object.getOwnPropertyNames(testObj).length !== 0) {
    return false;
  }

  const symbols = Object.getOwnPropertySymbols(testObj);
  if (symbols.length !== 1 || symbols[0] !== testSymbol) {
    return false;
  }

  if (!Object.prototype.propertyIsEnumerable.call(testObj, testSymbol)) {
    return false;
  }

  if (typeof Object.getOwnPropertyDescriptor === "function") {
    const descriptor = Object.getOwnPropertyDescriptor(testObj, testSymbol);
    if (descriptor.value !== 42 || descriptor.enumerable !== true) {
      return false;
    }
  }

  return true;
}

/**
 * Checks whether the runtime has Symbol support (quick check).
 *
 * @returns {boolean} `true` if `Symbol` exists and produces symbols.
 */
export function hasSymbols() {
  const nativeSymbol = typeof Symbol !== "undefined" && Symbol;
  if (typeof nativeSymbol !== "function" || typeof Symbol !== "function" ||
      typeof nativeSymbol("foo") !== "symbol" || typeof Symbol("bar") !== "symbol") {
    return false;
  }
  return hasNativeSymbols();
}
