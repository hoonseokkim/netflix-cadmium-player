/**
 * Netflix Cadmium Player -- InstanceResolver
 *
 * Resolves (instantiates) a class from its IoC binding metadata. Handles
 * constructor injection of tagged dependencies (cbb = constructor param)
 * and named property injection (Oab = named property). Also invokes any
 * @postConstruct-decorated initialization method after creation.
 *
 * @module ioc/InstanceResolver
 * @original Module_40198
 * @dependencies
 *   Module 25640 - error message formatters (Y4b)
 *   Module 5493  - injection target types (wG: cbb = constructor, Oab = namedProperty)
 *   Module 37425 - reflection metadata keys (Q7 = postConstruct key)
 */

import { formatPostConstructError } from '../core/ErrorMessages';          // Module 25640
import { InjectionTargetType } from '../ioc/DependencyConstants';          // Module 5493
import { METADATA_KEY } from '../utils/ReflectMetadata';                   // Module 37425

/**
 * Injects named properties into the instance from the binding metadata.
 *
 * Filters the dependency list for named-property injections (type === Oab),
 * resolves each via the resolver function, and assigns them to the instance.
 *
 * @param {Object} instance - The newly created instance
 * @param {Array<Object>} dependencies - Binding dependency descriptors
 * @param {Function} resolver - Resolves a dependency descriptor to a value
 * @returns {Object} The instance with properties injected
 */
function injectNamedProperties(instance, dependencies, resolver) {
    const namedDeps = dependencies.filter(
        (dep) => dep.target !== null && dep.target.type === InjectionTargetType.namedProperty
    );
    const resolvedValues = namedDeps.map(resolver);

    namedDeps.forEach((dep, index) => {
        const propertyName = dep.target.name.value();
        instance[propertyName] = resolvedValues[index];
    });

    return instance;
}

/**
 * Invokes the @postConstruct lifecycle method on the instance, if one is defined.
 *
 * @param {Function} targetClass - The constructor function
 * @param {Object} instance - The created instance
 */
function invokePostConstruct(targetClass, instance) {
    if (Reflect.hasMetadata(METADATA_KEY.postConstruct, targetClass)) {
        const metadata = Reflect.getMetadata(METADATA_KEY.postConstruct, targetClass);
        try {
            instance[metadata.value]();
        } catch (error) {
            throw Error(formatPostConstructError(targetClass.name, error.message));
        }
    }
}

/**
 * Resolves an IoC binding by constructing the target class with its
 * constructor dependencies and injecting named properties.
 *
 * @param {Function} targetClass - The class/constructor to instantiate
 * @param {Array<Object>} dependencies - Array of dependency descriptors
 * @param {Function} resolver - Resolves a single dependency descriptor to its value
 * @returns {Object} The fully resolved and initialized instance
 */
export function resolveInstance(targetClass, dependencies, resolver) {
    let instance = null;

    if (dependencies.length > 0) {
        // Resolve constructor parameters
        const constructorArgs = dependencies
            .filter((dep) => dep.target !== null && dep.target.type === InjectionTargetType.constructorParam)
            .map(resolver);

        // Create instance with constructor injection
        instance = new (targetClass.bind.apply(targetClass, [undefined].concat(constructorArgs)))();

        // Inject named properties
        instance = injectNamedProperties(instance, dependencies, resolver);
    } else {
        instance = new targetClass();
    }

    // Invoke @postConstruct lifecycle hook if present
    invokePostConstruct(targetClass, instance);

    return instance;
}
