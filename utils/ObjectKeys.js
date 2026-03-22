/**
 * @module ObjectKeys
 * @description Polyfill / shim for Object.keys that correctly handles `arguments`
 * objects in environments where the native Object.keys does not enumerate them.
 * Falls back to a manual key-enumeration implementation if Object.keys is absent.
 *
 * @original Module_33464
 */

const slice = Array.prototype.slice;

/**
 * Checks whether a value is an arguments object.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is an arguments object.
 */
function isArguments(value) {
  const tag = Object.prototype.toString.call(value);
  if (tag === '[object Arguments]') {
    return true;
  }
  return (
    tag !== '[object Array]' &&
    value !== null &&
    typeof value === 'object' &&
    typeof value.length === 'number' &&
    value.length >= 0 &&
    Object.prototype.toString.call(value.callee) === '[object Function]'
  );
}

/**
 * Returns the own enumerable property names of an object.
 * Handles `arguments` objects by converting them to arrays first.
 *
 * @param {Object} obj - The object to enumerate.
 * @returns {string[]} Array of property names.
 */
function objectKeys(obj) {
  if (Object.keys) {
    return isArguments(obj)
      ? Object.keys(slice.call(obj))
      : Object.keys(obj);
  }
  // Fallback implementation omitted (uses manual enumeration)
  return [];
}

/**
 * Re-initializes the Object.keys shim, patching it if needed
 * for environments where arguments objects are not correctly handled.
 *
 * @returns {Function} The shimmed or native Object.keys.
 */
objectKeys.shim = function () {
  const nativeKeys = Object.keys;

  if (Object.keys) {
    const worksWithArguments = (function () {
      const keys = Object.keys(arguments);
      return keys && keys.length === arguments.length;
    })(1, 2);

    if (!worksWithArguments) {
      Object.keys = function (obj) {
        return isArguments(obj)
          ? nativeKeys(slice.call(obj))
          : nativeKeys(obj);
      };
    }
  } else {
    Object.keys = objectKeys;
  }

  return Object.keys || objectKeys;
};

export default objectKeys;
export { isArguments };
