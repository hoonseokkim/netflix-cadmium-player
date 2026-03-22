/**
 * @module DependencyResolver
 * @description Resolves constructor dependencies for the dependency injection
 * container (InversifyJS-style). Reads constructor parameter metadata
 * (decorators, inject targets, named/tagged bindings) and builds a
 * dependency target list that the container uses to satisfy constructor
 * arguments at instantiation time.
 * @origin Module_34912
 */

import { LazyServiceIdentifier } from '../classes/LazyServiceIdentifier.js';
import { ERROR_MESSAGES } from '../classes/ErrorMessages.js';
import { TargetType } from '../classes/TargetType.js';
import { METADATA_KEY } from '../classes/MetadataKeys.js';
import { getFunctionName } from '../classes/ReflectionUtils.js';
import { Target } from '../classes/Target.js';

// Re-export getFunctionName for consumers
export { getFunctionName };

/**
 * Aggregates metadata entries for a single parameter into a structured object.
 * @param {Array<{key: string, value: *}>} metadataList - Metadata entries for one parameter
 * @returns {{ value: *, injectDecorator: *, named: *, isOptional: boolean }}
 * @private
 */
function aggregateMetadata(metadataList) {
  const result = {};
  metadataList.forEach((entry) => {
    result[entry.key.toString()] = entry.value;
  });

  return {
    value: result[METADATA_KEY.INJECT],
    injectDecorator: result[METADATA_KEY.MULTI_INJECT],
    named: result[METADATA_KEY.NAMED],
    isOptional: result[METADATA_KEY.OPTIONAL],
  };
}

/**
 * Resolves constructor parameter dependencies for a given class.
 * Reads design-time type metadata and decorator metadata to produce
 * an array of Target objects that describe each dependency.
 *
 * @param {Object} container - The DI container / metadata reader
 * @param {string} className - Name of the class being resolved
 * @param {Function} constructor - The constructor function
 * @param {boolean} allowUnresolved - If true, skips parameters with no metadata
 * @returns {Target[]} Array of dependency targets
 */
export function resolveConstructorDependencies(container, className, constructor, allowUnresolved) {
  const paramInfo = container.getConstructorMetadata(constructor);
  const designTypes = paramInfo.designParamTypes;

  if (designTypes === undefined) {
    throw Error(ERROR_MESSAGES.MISSING_INJECTABLE_ANNOTATION + ' ' + className + '.');
  }

  const paramMetadata = paramInfo.parameterMetadata;
  const paramKeys = Object.keys(paramMetadata);
  const paramCount = constructor.length === 0 && paramKeys.length > 0
    ? paramKeys.length
    : constructor.length;

  const targets = [];

  for (let i = 0; i < paramCount; i++) {
    const index = i;
    const entries = paramMetadata[index.toString()] || [];
    const aggregated = aggregateMetadata(entries);
    const isOptional = aggregated.isOptional === true;

    let serviceIdentifier = designTypes[index];
    const injected = aggregated.injectDecorator || aggregated.value;

    if (injected) {
      serviceIdentifier = injected;
    }

    if (serviceIdentifier instanceof LazyServiceIdentifier) {
      serviceIdentifier = serviceIdentifier.unwrapKey();
    }

    if (!isOptional) {
      const isUnresolvable =
        serviceIdentifier === Function ||
        serviceIdentifier === Object ||
        serviceIdentifier === undefined;

      if (!allowUnresolved && isUnresolvable) {
        throw Error(
          ERROR_MESSAGES.MISSING_INJECT_ANNOTATION + ' argument ' + index + ' in class ' + className + '.'
        );
      }

      const target = new Target(TargetType.CONSTRUCTOR, aggregated.named, serviceIdentifier);
      target.metadata = entries;
      targets.push(target);
    }
    // Optional parameters with no binding are skipped (null)
  }

  // Also resolve property injection targets from the prototype chain
  const propertyTargets = resolvePropertyDependencies(container, constructor);
  return targets.concat(propertyTargets);
}

/**
 * Resolves property injection dependencies by walking up the prototype chain.
 * @param {Object} container - The DI container / metadata reader
 * @param {Function} constructor - The constructor function
 * @returns {Target[]}
 * @private
 */
function resolvePropertyDependencies(container, constructor) {
  const properties = container.getPropertyMetadata(constructor);
  const targets = [];

  for (const key of Object.keys(properties)) {
    const entries = properties[key];
    const aggregated = aggregateMetadata(entries);
    const target = new Target(
      TargetType.PROPERTY,
      aggregated.named || key,
      aggregated.injectDecorator || aggregated.value
    );
    target.metadata = entries;
    targets.push(target);
  }

  // Walk up the prototype chain for inherited property injections
  const parent = Object.getPrototypeOf(constructor.prototype).constructor;
  if (parent !== Object) {
    const parentTargets = resolvePropertyDependencies(container, parent);
    return targets.concat(parentTargets);
  }

  return targets;
}

/**
 * Counts the number of non-optional base class constructor dependencies
 * by walking up the prototype chain.
 * @param {Object} container - The DI container
 * @param {Function} constructor - The derived class constructor
 * @returns {number} Number of base class dependencies
 */
export function countBaseClassDependencies(container, constructor) {
  const parent = Object.getPrototypeOf(constructor.prototype).constructor;

  if (parent !== Object) {
    const parentName = getFunctionName(parent);
    const parentTargets = resolveConstructorDependencies(container, parentName, parent, true);

    const optionalCount = parentTargets
      .map((t) => t.metadata.filter((m) => m.key === METADATA_KEY.OPTIONAL))
      .flat().length;

    const requiredCount = parentTargets.length - optionalCount;
    return requiredCount > 0 ? requiredCount : countBaseClassDependencies(container, parent);
  }

  return 0;
}
