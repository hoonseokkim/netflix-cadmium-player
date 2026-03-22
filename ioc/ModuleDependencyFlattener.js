/**
 * Netflix Cadmium Player -- ModuleDependencyFlattener
 *
 * Flattens a module dependency graph into a linear list of concrete modules.
 * Used by the IoC container to resolve the full set of modules that need to
 * be loaded for a given entry point.
 *
 * The algorithm performs a depth-first traversal:
 *   - Group modules (wE = true) are expanded by recursing into their children (zpa).
 *   - Leaf modules are collected.
 *   - Leaf modules with transitive dependencies (tR) also have those dependencies
 *     pushed onto the stack.
 *   - Deduplication is by module name.
 *
 * @module ioc/ModuleDependencyFlattener
 * @original Module_26653
 */

/**
 * Flatten a module dependency graph into a deduplicated list of leaf modules.
 *
 * @param {Iterable<Object>} modules - Root set of module descriptors
 * @param {string} modules[].name - Unique module name
 * @param {boolean} [modules[].isGroup] - True if this is a group (container) module
 * @param {Array<Object>} [modules[].children] - Child modules (for groups)
 * @param {Array<Object>} [modules[].transitiveDeps] - Transitive dependencies (for leaves)
 * @returns {Array<Object>} Flat, deduplicated list of leaf modules
 */
export function flattenModuleDependencies(modules) {
    const result = [];
    const visited = Object.create(null);

    // Convert iterable to array and use as a stack (DFS)
    const stack = Array.from(modules);

    while (stack.length > 0) {
        const current = stack.pop();

        if (visited[current.name]) {
            continue;
        }

        visited[current.name] = true;

        if (current.isGroup) {
            // Group module: expand its children onto the stack
            for (const child of current.children) {
                stack.push(child);
            }
        } else {
            // Leaf module: collect it
            result.push(current);

            // Also push any transitive dependencies
            if (current.transitiveDeps) {
                for (const dep of current.transitiveDeps) {
                    stack.push(dep);
                }
            }
        }
    }

    return result;
}
