/**
 * @module ComponentDependencyResolver
 * @description Resolves component dependencies from a manifest/session data context.
 *              Performs topological traversal of component dependency graphs, detects
 *              circular dependencies, and provides dependency injection by name lookup.
 *              Original: Module_48406
 */

import { getValues } from '../utils/ObjectUtils'; // Module 91176 (Q0a, qcc)
import { dataQuery } from '../utils/DataQuery'; // Module 27851
import { toCamelCase } from '../utils/StringFormatter'; // Module 21016 (tZ)

/**
 * Performs a depth-first traversal of a component's dependency tree.
 * Returns a flat list of all components visited, detecting circular dependencies.
 *
 * @param {Object} root - The root component definition
 * @param {Object} [current=root] - Current component being visited
 * @param {Object} [visited={}] - Map of fully visited component names
 * @param {Object} [visiting={}] - Map of currently-in-stack component names
 * @returns {Array<Object>} Flat list of components and any circular dependency markers
 */
export function traverseDependencyTree(root, current = root, visited = {}, visiting = {}) {
    const result = [current];
    visiting[current.name] = current;

    const dependencies = current.isLazy ? [] : current.dependencies;
    const childResults = dependencies.flatMap((dep) => {
        if (visited[dep.name]) return [];
        if (visiting[dep.name]) {
            // Circular dependency detected
            return [{
                root,
                parentComponent: current,
                circularComponent: dep,
            }];
        }
        return traverseDependencyTree(root, dep, visited, visiting);
    });

    visited[current.name] = current;
    return [...result, ...childResults];
}

/**
 * Checks if a traversal result entry represents a circular dependency.
 * @param {Object} entry - Entry from traverseDependencyTree
 * @returns {boolean} True if the entry is a circular dependency marker
 */
export function isCircularDependency(entry) {
    return dataQuery(entry)?.parentComponent !== undefined;
}

/**
 * Resolves component dependencies from a manifest session context.
 * Validates dependency graphs and detects circular references at construction time.
 */
class ComponentDependencyResolver {
    /**
     * @param {Object} manifestSessionData - Session data providing component lookups
     */
    constructor(manifestSessionData) {
        /** @type {Object} Session data for component resolution */
        this.manifestSessionData = manifestSessionData;

        /** @type {Object<string, Object>} Map of component name to component definition */
        this._componentMap = {};

        this._registerComponents(manifestSessionData.eventHandlersMap);
        this._validateNoCycles();
    }

    /**
     * Resolves all dependencies for a component by name.
     * @param {string} componentName - Name of the component
     * @returns {Object<string, *>} Map of camelCased dependency names to resolved instances
     * @throws {Error} If a dependency cannot be found in any available context
     */
    resolveDependencies(componentName) {
        const resolved = {};
        const componentDef = this._componentMap[componentName];

        if (componentDef.isLazy) return resolved;

        for (const dep of componentDef.dependencies) {
            const instance = this.manifestSessionData.getComponent(dep.name);
            if (!instance) {
                throw Error(`The dependency "${dep.name}" for component "${componentName}" could not be found in any available context.`);
            }
            resolved[toCamelCase(dep.name)] = instance;
        }

        return resolved;
    }

    /**
     * Looks up a component definition by name, falling back to manifest data.
     * @param {string} componentName - Name of the component
     * @returns {Object|undefined} Component definition
     */
    getComponentDefinition(componentName) {
        return this._componentMap[componentName] || this.manifestSessionData.getComponentDefinition(componentName);
    }

    /**
     * Registers component definitions, initially with empty dependency lists,
     * then resolves dependency references in a second pass.
     * @private
     * @param {Array<Object>} components - Array of component definitions
     */
    _registerComponents(components) {
        // First pass: register all components with empty dependency arrays
        for (const component of components) {
            this._componentMap[component.name] = component.isLazy
                ? component
                : { ...component, dependencies: [] };
        }

        // Second pass: resolve dependency references
        for (const component of components) {
            if (component.isLazy || component.dependencies.length === 0) continue;

            const registered = this._componentMap[component.name];
            if (registered.isLazy) continue;

            registered.dependencies = component.dependencies.map((dep, index) => {
                if (dep === undefined) {
                    throw Error(
                        `An undefined component definition was provided to component "${component.name}" at index ${index}. This is likely due to a circular dependency at the ES module level.`
                    );
                }
                const resolved = this.getComponentDefinition(dep.name);
                if (!resolved) {
                    throw Error(`Component "${component.name}" requires "${dep.name}" which is not included in any available context.`);
                }
                return resolved;
            });
        }
    }

    /**
     * Validates that there are no circular dependencies in the component graph.
     * @private
     * @throws {Error} If circular dependencies are detected
     */
    _validateNoCycles() {
        const circularDeps = [];

        for (const component of getValues(this._componentMap)) {
            const traversalResult = traverseDependencyTree(component);
            circularDeps.push(...traversalResult.filter(isCircularDependency));
        }

        if (circularDeps.length > 0) {
            throw Error(
                "Circular dependencies found:\n" +
                circularDeps.map((dep) =>
                    `Circular dependency detected: ${dep.root.name} -> ${dep.parentComponent.name} -> ${dep.circularComponent.name}`
                ).join("\n")
            );
        }
    }
}

export { ComponentDependencyResolver };
export default ComponentDependencyResolver;
