/**
 * @module FunctionBind
 * @description Provides a bound version of Function.prototype.apply using
 *              Function.prototype.call. This is a low-level utility from the
 *              es-abstract/call-bind ecosystem used for safe function invocation.
 *              Original: Module_26497
 *
 * Also includes re-exports of Function.prototype.apply (Module 49638) and
 * Function.prototype.call (Module 68418).
 */

import callBind from '../utils/CallBind'; // Module 4090
import { apply } from '../utils/FunctionApply'; // Module 49638
import reflectApply from '../utils/ReflectApply'; // Module 29919

/**
 * Returns a bound version of Function.prototype.apply.
 * Equivalent to: `callBind(Function.prototype.apply, fn, arguments)`
 *
 * @returns {Function} Bound function that applies arguments safely
 */
const boundApply = function () {
    return reflectApply(callBind, apply, arguments);
};

export default boundApply;

/**
 * Reference to Function.prototype.apply
 * Original: Module 49638
 */
export { apply };

/**
 * Reference to Function.prototype.call
 * Original: Module 68418
 */
export const call = Function.prototype.call;
