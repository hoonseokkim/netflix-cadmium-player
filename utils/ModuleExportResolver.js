/**
 * @file ModuleExportResolver.js
 * @description Resolves a module's export by checking for a pre-computed value
 *              first, then falling back to calling the module factory function
 *              with a context. This is a low-level module system utility used
 *              during Cadmium's lazy module loading.
 *
 *              Pattern: `result = cachedValue || factoryFn.call(context, args)`
 * @module utils/ModuleExportResolver
 * @original Module_29919
 */

// import factoryFn from './Module_4090';   // The module factory function
// import args from './Module_49638';       // Arguments to pass to factory
// import context from './Module_68418';    // `this` context for the call
// import cachedValue from './Module_36476'; // Pre-computed cached value (may be falsy)

/**
 * Resolves a module export, preferring a cached value over invoking the factory.
 *
 * @param {*} cachedValue - Pre-computed module value (used if truthy).
 * @param {Function} factoryFn - Factory function to invoke as fallback.
 * @param {*} context - The `this` context for the factory call.
 * @param {*} args - Arguments passed to the factory.
 * @returns {*} The resolved module export.
 */
export function resolveModuleExport(cachedValue, factoryFn, context, args) {
  return cachedValue || factoryFn.call(context, args);
}
