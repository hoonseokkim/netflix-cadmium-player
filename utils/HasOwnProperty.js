/**
 * @module HasOwnProperty
 * @description Provides a safe, unbound version of Object.prototype.hasOwnProperty.
 *              Uses Function.prototype.call bound to hasOwnProperty for safe property
 *              checking on any object (including those without Object.prototype).
 *              Original: Module_72196
 */

import callBind from '../utils/CallBind'; // Module 4090

const call = Function.prototype.call;
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Safe hasOwnProperty check that works on any object.
 * Usage: hasOwn(obj, 'property')
 *
 * @param {Object} obj - Object to check
 * @param {string} prop - Property name to check
 * @returns {boolean} Whether the object has the specified own property
 */
const hasOwn = callBind.call(call, hasOwnProperty);

export default hasOwn;
