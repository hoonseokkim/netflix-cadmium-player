/**
 * PlaygraphTree - Generic tree data structure for the playgraph
 *
 * Implements a general-purpose tree with parent/child relationships,
 * used to represent the playgraph (interactive content segment hierarchy).
 * Supports add, remove, move, reparent, traversal, diff, and cloning.
 *
 * @module streaming/PlaygraphTree
 * @original Module_61520
 */

// import { u as DEBUG } from '../core/debug';
// import { RJa as BiMap } from '../utils/BiMap';
// import { assert } from '../assert';

/**
 * Formats a tree as a string for debugging.
 *
 * @param {PlaygraphTree} tree - The tree to format
 * @param {Function} formatter - Formats a single node value to a string
 * @returns {string} Indented text representation
 */
export function formatTree(tree, formatter) {
    let result = "";
    tree.traverse((value, _parent, _tree, depth) => {
        result += `${Array(depth + 1).join("-")}${formatter(value)}\n`;
        return true;
    });
    return result;
}

/**
 * A generic tree data structure.
 *
 * Each value in the tree is unique. Internally, nodes are stored as
 * `{ value, parent?, children? }` objects, with a BiMap for fast lookup.
 */
export class PlaygraphTree {
    constructor() {
        /** @private @type {Map} Fast value-to-node lookup */
        this.nodeMap = new BiMap();
        /** @private @type {Object|undefined} Root node */
        this.rootNode = undefined;
    }

    /** @returns {boolean} Whether the tree is empty */
    get empty() {
        return !this.rootNode;
    }

    /** @returns {*|undefined} The root value, or undefined if empty */
    get root() {
        return this.rootNode?.value;
    }

    /** @returns {Array} All values in traversal order */
    get values() {
        const result = [];
        this.traverse((value) => !!result.push(value));
        return result;
    }

    /**
     * Checks if a value exists in the tree.
     * @param {*} value
     * @returns {boolean}
     */
    has(value) {
        return !!this.nodeMap.get(value);
    }

    /**
     * Returns the parent value of the given value.
     * @param {*} value
     * @returns {*|undefined}
     */
    parent(value) {
        const node = this.nodeMap.get(value);
        if (DEBUG) assert(node, "Attempted to find the parent of a node not in the tree");
        return node?.parent?.value;
    }

    /**
     * Returns the child values of the given value.
     * @param {*} value
     * @returns {Array}
     */
    children(value) {
        const node = this.nodeMap.get(value);
        if (DEBUG) assert(node, "Attempted to find the children of a node not in the tree");
        return node?.children ? node.children.map((child) => child.value) : [];
    }

    /**
     * Checks if a value has any children.
     * @param {*} value
     * @returns {boolean}
     */
    hasChildren(value) {
        const node = this.nodeMap.get(value);
        if (DEBUG) assert(node, "Attempted to find the children of a node not in the tree");
        return node?.children !== undefined && node.children.length > 0;
    }

    /**
     * Adds a value to the tree.
     *
     * @param {*} value - The value to add (must be unique)
     * @param {*} [parentValue] - Parent value (required unless tree is empty)
     * @returns {PlaygraphTree} this (for chaining)
     */
    add(value, parentValue) {
        if (DEBUG) assert(!this.nodeMap.get(value), "Attempted to add a value to tree that is already present");

        const node = { value };

        if (this.rootNode === undefined) {
            if (DEBUG) assert(parentValue === undefined, "a parent cannot be specified when the tree is empty");
            this.rootNode = node;
        } else {
            if (DEBUG) assert(parentValue !== undefined, "a parent must be specified when the tree is non-empty");
            const parentNode = this.nodeMap.get(parentValue);
            if (DEBUG) assert(parentNode, "Parent value does not exist in tree");
            this.attachChild(node, parentNode);
        }

        this.nodeMap.set(value, node);
        return this;
    }

    /**
     * Removes a value and all its descendants from the tree.
     *
     * @param {*} value - The value to remove
     * @returns {PlaygraphTree} this (for chaining)
     */
    remove(value) {
        const node = this.nodeMap.get(value);
        if (DEBUG) assert(node, "Attempted to remove a node not in the tree");
        this.removeNode(node);
        return this;
    }

    /**
     * @private
     * Removes a node and all descendants, cleaning up the node map.
     */
    removeNode(node) {
        this.traversePostOrder((val) => this.nodeMap.delete(val), node.value);
        if (node.parent === undefined) {
            this.rootNode = undefined;
        } else {
            this.detachChild(node);
        }
    }

    /**
     * Moves a node to a new parent.
     *
     * @param {*} value - Value to move
     * @param {*} newParentValue - New parent value
     * @returns {PlaygraphTree} this
     */
    move(value, newParentValue) {
        const node = this.nodeMap.get(value);
        const newParent = this.nodeMap.get(newParentValue);

        if (DEBUG) {
            assert(node, "cannot move a value that is not in the tree");
            assert(newParent, "cannot move a value to a parent value not in the tree");
            assert(node?.parent, "cannot move the root node");
            assert(!this.isDescendantOf(node, newParent), "cannot move a node below itself or one of its descendants");
        }

        if (node.parent !== newParent) {
            this.detachChild(node);
            this.attachChild(node, newParent);
        }

        return this;
    }

    /**
     * Replants the tree at a new root, discarding everything outside the subtree.
     *
     * @param {*} newRootValue - The value to become the new root
     */
    replant(newRootValue) {
        const newRootNode = this.nodeMap.get(newRootValue);
        if (DEBUG) assert(newRootNode, "cannot replant at a value that is not in the tree");

        this.detachChild(newRootNode);

        // Remove all old nodes not under new root
        this.traversePostOrder((val) => {
            this.nodeMap.delete(val);
            return true;
        });

        this.rootNode = newRootNode;
    }

    /**
     * Removes all nodes from the tree.
     * @returns {PlaygraphTree} this
     */
    clear() {
        if (this.rootNode) {
            this.remove(this.rootNode.value);
        }
        return this;
    }

    /**
     * Creates a deep clone of the tree structure.
     * @returns {PlaygraphTree}
     */
    clone() {
        const copy = new PlaygraphTree();
        this.traverse((value, parentValue) => {
            copy.add(value, parentValue);
            return true;
        });
        return copy;
    }

    // ─── Traversal ───────────────────────────────────────────────────

    /**
     * Depth-first pre-order traversal of the entire tree.
     *
     * @param {Function} visitor - (value, parentValue, tree, depth) => boolean.
     *   Return true to continue visiting children.
     */
    traverse(visitor) {
        this.traverseFrom(visitor, undefined);
    }

    /**
     * Depth-first pre-order traversal from a specific starting value.
     * @private
     */
    traverseFrom(visitor, startValue, parentValue, depth = 0) {
        if (DEBUG) assert(!this.empty || startValue === undefined, "cannot iterate from a value on an empty tree");
        if (this.empty) return;

        const value = startValue ?? this.rootNode.value;
        if (visitor(value, parentValue, this, depth)) {
            this.forEachChild(value, (childValue) => {
                this.traverseFrom(visitor, childValue, value, depth + 1);
            });
        }
    }

    /**
     * Depth-first post-order traversal.
     * @private
     */
    traversePostOrder(visitor, startValue) {
        if (DEBUG) assert(!this.empty || startValue === undefined, "cannot iterate from a value on an empty tree");
        if (this.empty) return;

        const value = startValue ?? this.rootNode.value;
        this.forEachChild(value, (childValue) => {
            this.traversePostOrder(visitor, childValue);
        });
        visitor(value, this);
    }

    /**
     * Depth-first search from leaves up (post-order) returning the first match.
     *
     * @param {Function} predicate - (value, tree) => boolean
     * @param {*} [startValue]
     * @returns {*|undefined} First matching value
     */
    findFromLeaves(predicate, startValue) {
        if (this.empty) return;
        const value = startValue ?? this.rootNode.value;

        let found;
        this.someChild(value, (childValue) => {
            found = this.findFromLeaves(predicate, childValue);
            return !!found;
        });

        return found || (predicate(value, this) ? value : undefined);
    }

    /**
     * Iterates direct children of a value.
     * @private
     */
    forEachChild(value, callback) {
        const node = this.nodeMap.get(value);
        if (DEBUG) assert(node, "cannot iterate children of a value not in the tree");
        node?.children?.forEach((child) => callback(child.value, this));
    }

    /**
     * Tests if any direct child matches a predicate.
     * @private
     */
    someChild(value, predicate) {
        const node = this.nodeMap.get(value);
        if (DEBUG) assert(node, "cannot iterate children of a value not in the tree");
        return !!node?.children?.some((child) => predicate(child.value, this));
    }

    // ─── Diff / Comparison ───────────────────────────────────────────

    /**
     * Computes the difference between this tree and another.
     *
     * @param {PlaygraphTree} other
     * @returns {{ added: Array, removed: Array, reparented: Array }}
     */
    diff(other) {
        const allValues = this.values;
        const added = allValues.filter((v) => !other.has(v));
        const removed = other.values.filter((v) => !this.has(v));
        const reparented = allValues.filter((v) => other.has(v) && this.parent(v) !== other.parent(v));
        return { added, removed, reparented };
    }

    /**
     * Checks structural equality with another tree.
     *
     * @param {PlaygraphTree} other
     * @returns {boolean}
     */
    equals(other) {
        const { added, removed, reparented } = this.diff(other);
        return added.length === 0 && removed.length === 0 && reparented.length === 0;
    }

    // ─── Internal Node Operations ────────────────────────────────────

    /** @private */
    attachChild(childNode, parentNode) {
        childNode.parent = parentNode;
        (parentNode.children || (parentNode.children = [])).push(childNode);
    }

    /** @private */
    detachChild(node) {
        if (DEBUG) {
            assert(node.parent, "cannot detach the root");
            assert(node.parent.children !== undefined, "logic error: parent node does not have children");
        }
        const index = node.parent.children.indexOf(node);
        assert(index >= 0, "logic error: node does not appear in the children of its parent");
        node.parent.children.splice(index, 1);
        node.parent = undefined;
    }

    /** @private */
    isDescendantOf(ancestor, potentialDescendant) {
        let current = potentialDescendant;
        while (current !== undefined) {
            if (current === ancestor) return true;
            current = current.parent;
        }
        return false;
    }
}
