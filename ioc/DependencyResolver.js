/**
 * @module ioc/DependencyResolver
 * @description Resolves dependencies from an InversifyJS-style IoC container.
 *              Walks the binding metadata tree, handling different binding types:
 *              - ConstantValue (abb): returns cached constant
 *              - Function: returns cached function reference
 *              - Constructor (bbb): instantiates via constructor
 *              - DynamicValue (internal_Ybb): invokes factory with context
 *              - Factory (eFa): invokes factory function with context
 *              - Provider (pkb): invokes provider with context
 *              - Instance: recursively resolves constructor dependencies
 *
 *              Supports singleton (GKa) and request-scoped caching.
 *              Handles array/multi-inject bindings and post-activation hooks.
 *
 * @see Module_85933
 */

import { O1b as AMBIGUOUS_MATCH_ERROR, XZb as makeLazyError } from '../ioc/ErrorMessages.js';       // Module 25640
import { dependencyScope, eventTypeName } from '../ioc/BindingConstants.js';                          // Module 5493
import { wGb as isStackOverflow } from '../ioc/ErrorDetection.js';                                    // Module 69523
import { M0 as serializeServiceId } from '../ioc/ServiceIdSerializer.js';                             // Module 48530
import { XUc as resolveInstance } from '../ioc/InstanceResolver.js';                                  // Module 40198

/**
 * Safely invokes a lazy factory (DynamicValue, Factory, or Provider), wrapping
 * stack overflow errors with a descriptive message.
 *
 * @param {string} bindingType - Binding type name for error messages
 * @param {*} serviceId - The service identifier being resolved
 * @param {Function} factory - The factory function to invoke
 * @returns {*} The resolved value
 * @throws {Error} Enhanced error if the factory causes a stack overflow
 * @private
 */
function invokeSafely(bindingType, serviceId, factory) {
  try {
    return factory();
  } catch (error) {
    if (isStackOverflow(error)) {
      throw Error(makeLazyError(bindingType, serviceId.toString()));
    }
    throw error;
  }
}

/**
 * Creates a resolver function that resolves a single binding request.
 * The resolver handles all binding types and caching strategies.
 *
 * @param {Map|null} requestScope - Request-scoped cache (Map of id -> value)
 * @returns {Function} Resolver function that accepts a binding request
 * @private
 */
function createResolver(requestScope) {
  return function resolveBinding(request) {
    const bindings = request.k$;
    const childRequests = request.xQa;
    const isArrayTarget = request.target && request.target.isArray();
    const isNewTarget = !request.RI || !request.RI.target || !request.target || !request.RI.target.rIc(request.target.ti);

    // Multi-inject: resolve each child request independently
    if (isArrayTarget && isNewTarget) {
      return childRequests.map((child) => createResolver(requestScope)(child));
    }

    let result = null;

    if (request.target.oGb() || bindings.length === 0) {
      return;
    }

    const binding = bindings[0];
    const isSingleton = binding.scope === dependencyScope.GKa;
    const isRequestScoped = binding.scope === dependencyScope.Request;

    // Return cached singleton
    if (isSingleton && binding.bOa) {
      return binding.cache;
    }

    // Return request-scoped cached value
    if (isRequestScoped && requestScope !== null && requestScope.has(binding.id)) {
      return requestScope.key(binding.id);
    }

    // Resolve based on binding type
    if (binding.type === eventTypeName.abb) {
      // ConstantValue binding
      result = binding.cache;
    } else if (binding.type === eventTypeName.Function) {
      // Function binding
      result = binding.cache;
    } else if (binding.type === eventTypeName.bbb) {
      // Constructor binding
      result = binding.$q;
    } else if (binding.type === eventTypeName.internal_Ybb && binding.w_ !== null) {
      // DynamicValue binding
      result = invokeSafely("toDynamicValue", binding.ti, () => binding.w_(request.V2));
    } else if (binding.type === eventTypeName.eFa && binding.audioMediaTypeId !== null) {
      // Factory binding
      result = invokeSafely("toFactory", binding.ti, () => binding.audioMediaTypeId(request.V2));
    } else if (binding.type === eventTypeName.pkb && binding.IU !== null) {
      // Provider binding
      result = invokeSafely("toProvider", binding.ti, () => binding.IU(request.V2));
    } else if (binding.type === eventTypeName.Instance && binding.$q !== null) {
      // Instance binding - recursively resolve constructor dependencies
      result = resolveInstance(binding.$q, childRequests, createResolver(requestScope));
    } else {
      const serviceIdStr = serializeServiceId(request.ti);
      throw Error(AMBIGUOUS_MATCH_ERROR + " " + serviceIdStr);
    }

    // Apply post-activation hook if present
    if (typeof binding.YE === "function") {
      result = binding.YE(request.V2, result);
    }

    // Cache singleton
    if (isSingleton) {
      binding.cache = result;
      binding.bOa = true;
    }

    // Cache in request scope
    if (isRequestScoped && requestScope !== null && !requestScope.has(binding.id)) {
      requestScope.set(binding.id, result);
    }

    return result;
  };
}

/**
 * Resolves a dependency request from the IoC container.
 *
 * @param {Object} context - Resolution context containing the request plan
 * @returns {*} The resolved value
 */
function resolve(context) {
  return createResolver(context.d3.K4a.DUc)(context.d3.K4a);
}

export { resolve };
