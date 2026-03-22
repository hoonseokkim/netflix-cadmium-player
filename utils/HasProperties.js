/**
 * @module HasProperties
 * @description Utility function to check if an object has all properties defined
 * in a reference object. Used for interface/shape validation.
 * @original Module_19809
 */

/**
 * Checks whether the target object has all properties defined in the reference object.
 *
 * @param {Object} target - The object to check
 * @param {Object} requiredProperties - An object whose keys represent the required properties
 * @returns {boolean} True if all keys in requiredProperties exist (are not undefined) in target
 *
 * @example
 * has({ a: 1, b: 2 }, { a: true, b: true }); // true
 * has({ a: 1 }, { a: true, b: true }); // false (missing 'b')
 */
export function has(target, requiredProperties) {
    for (const key in requiredProperties) {
        if (target[key] === undefined) {
            return false;
        }
    }
    return true;
}

export default { has };
