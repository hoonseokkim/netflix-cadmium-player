/**
 * Branch Collection
 *
 * Manages a collection of media request branches in the streaming
 * pipeline. A "branch" represents an active or pending media segment
 * download. The collection is organized as a tree (via `valuesMap`)
 * with branches indexed by segment ID (via `branches` multimap).
 *
 * Provides operations to:
 * - Add, remove, and query branches by segment ID
 * - Traverse the tree (parent, children, root)
 * - Iterate, map, filter, reduce over all branches
 * - Rebuild the tree when the playgraph changes (E2c / ase_Ylc)
 * - Get a manifest-variant summary (cAc)
 *
 * @module BranchCollection
 * @source Module_88874
 */

import { __generator, __values } from '../core/ReflectMetadataPolyfill';
import { findLast } from '../core/Asejs';
import { phb as MultiMap } from '../streaming/RequestCollection';
import { assert } from '../assert/Assert';
import { pma as TreeMap } from '../streaming/PlaygraphTree';

class BranchCollection {
    constructor() {
        /** @type {MultiMap} Branches indexed by segment ID. */
        this.branches = new MultiMap();

        /** @type {TreeMap} Tree structure tracking parent-child relationships. */
        this.valuesMap = new TreeMap();
    }

    /** Whether the collection is empty. */
    get empty() {
        return this.branches.empty;
    }

    /** Number of branches in the collection. */
    get size() {
        return this.branches.size;
    }

    /**
     * Clear and cancel all branches.
     */
    create() {
        const allBranches = this.branches.values();
        this.branches.clear();
        this.valuesMap.clear();
        allBranches.forEach(function (branch) {
            return branch.cancelStreaming();
        });
    }

    /**
     * Get branches for a given segment ID, optionally filtered by start time.
     *
     * @param {string} segmentId    - Segment identifier.
     * @param {number} [startTimeMs] - Optional start time to filter by.
     * @param {Object} [logger]      - Optional logger for diagnostics.
     * @returns {Array|undefined} Matching branches.
     */
    getActiveBranchList(segmentId, startTimeMs, logger) {
        const branches = this.branches.key(segmentId);

        if (startTimeMs) {
            const filtered = branches ? branches.filter(function (branch) {
                return branch.currentSegment.startTimeMs === startTimeMs;
            }) : undefined;

            if (filtered && filtered.length === 0) {
                if (logger) {
                    logger.pauseTrace(
                        `getBranches ${segmentId} startTimeMs: ${startTimeMs} no matches, have ${branches ? branches.map(function (b) { return b.currentSegment.startTimeMs; }) : undefined}`
                    );
                }
            }
            return filtered;
        }

        return branches;
    }

    /** Check whether any branch exists for the given segment ID. */
    has(segmentId) {
        return this.branches.has(segmentId);
    }

    /** Get the root branch of the tree. */
    root() {
        return this.valuesMap.root;
    }

    /** Check if a specific branch instance is in the collection. */
    contains(branch) {
        const segmentId = branch.currentSegment.id;
        if (this.has(segmentId)) {
            return this.getActiveBranchList(segmentId).indexOf(branch) !== -1;
        }
    }

    /** Register a branch in the tree. */
    SL(branch) {
        this.valuesMap.SL(branch);
    }

    /** Get the parent of a branch in the tree. */
    getParent(branch) {
        return this.valuesMap.parent(branch);
    }

    /** Get the children of a branch in the tree. */
    getChildren(branch) {
        return this.valuesMap.children(branch);
    }

    /** Get ancestor chain for a branch. */
    $sa(branch) {
        return this.valuesMap.$sa(branch);
    }

    /**
     * Remove a branch from the collection.
     * Handles root removal (promoting single child) and leaf removal.
     */
    removeBranch(branch) {
        if (this.branches.delete(branch.currentSegment.id, branch)) {
            const children = this.valuesMap.children(branch);

            if (this.valuesMap.root === branch) {
                if (children.length === 0) {
                    this.valuesMap.clear();
                } else {
                    assert(children.length === 1, "cannot remove the root branch with multiple successors");
                    this.valuesMap.$Tc(children[0]);
                }
            } else {
                assert(children.length === 0, "cannot remove non-root branch with successors");
                this.valuesMap.item(branch);
            }
        }
    }

    /** Iterate over all branches. */
    forEach(callback) {
        const self = this;
        this.branches.forEach(function (branch, segmentId) {
            return callback(branch, segmentId, self);
        });
    }

    /** Get a flat array of all branches. */
    values() {
        return this.branches.values();
    }

    /** Reduce over all branches. */
    reduce(callback, initialValue) {
        const self = this;
        return this.branches.reduce(function (acc, branch, segmentId) {
            return callback(acc, branch, segmentId, self);
        }, initialValue);
    }

    /** Map over all branches. */
    map(callback) {
        const self = this;
        return this.branches.map(function (branch, segmentId) {
            return callback(branch, segmentId, self);
        });
    }

    /** Filter branches. */
    filter(callback) {
        const self = this;
        return this.branches.filter(function (branch, segmentId) {
            return callback(branch, segmentId, self);
        });
    }

    /**
     * Get a summary of all branches' manifest variants, keyed by segment ID.
     * @returns {Object} Map of segmentId -> [playbackSegment, ...]
     */
    getManifestVariantSummary() {
        const summary = {};
        this.forEach(function (branch, segmentId) {
            const variant = branch.defaultManifestVariant;
            if (variant) {
                if (!summary[segmentId]) {
                    summary[segmentId] = [];
                }
                summary[segmentId].push(variant.playbackSegment);
            }
        });
        return summary;
    }

    /**
     * Rebuild the branch tree from a new playgraph structure.
     * Reuses existing branches where possible; creates new ones otherwise.
     *
     * @param {Object} newPlaygraph     - New playgraph tree to reconcile with.
     * @param {Function} branchFactory  - Factory to create new branches.
     * @param {Object} [logger]         - Optional logger.
     * @returns {{ mz: Array, c4a: Array }} Removed branches and reset branches.
     */
    E2c(newPlaygraph, branchFactory, logger) {
        const self = this;
        const newTree = this._buildNewBranchTree(newPlaygraph, branchFactory, logger);
        const reconcileResult = newTree.internal_Gxb(this.valuesMap);
        const addedBranches = reconcileResult.NY;
        const removedBranches = reconcileResult.removed;
        const resetBranches = reconcileResult.c4a;

        this.valuesMap.clear();
        this.valuesMap = newTree;

        addedBranches.forEach(function (branch) {
            return self.branches.set(branch.currentSegment.id, branch);
        });
        addedBranches.forEach(function (branch) {
            return branch.data();
        });
        removedBranches.forEach(function (branch) {
            return self.branches.delete(branch.currentSegment.id, branch);
        });
        resetBranches.forEach(function (branch) {
            branch.resetting();
        });

        return {
            mz: removedBranches,
            c4a: resetBranches
        };
    }

    /** Iterator protocol support. */
    [Symbol.iterator]() {
        return __generator(this, function (state) {
            switch (state.label) {
                case 0:
                    return [5, __values(this.branches)];
                case 1:
                    state.T();
                    return [2];
            }
        });
    }

    /**
     * Build a new branch tree by reconciling the new playgraph with existing branches.
     * @private
     */
    _buildNewBranchTree(newPlaygraph, branchFactory, logger) {
        const self = this;
        const branchMap = new Map();
        const newTree = new TreeMap();

        newPlaygraph.SL(function (node, parentNode) {
            let parentBranch;
            if (parentNode) {
                parentBranch = branchMap.key(parentNode);
                if (!parentBranch) return true;
            }

            // Try to reuse an existing branch
            const reusableBranch = findLast(
                self.getActiveBranchList(
                    node.currentSegment.id,
                    node.currentSegment.startTimeMs,
                    logger
                ),
                function (candidate) {
                    return self.valuesMap.parent(candidate) === parentBranch || !parentNode;
                }
            );

            if (logger) {
                logger.pauseTrace(
                    `createNewBranchTree ${node.currentSegment.id} reusableBranch: ${!!reusableBranch}`
                );
            }

            const branch = reusableBranch || branchFactory(node.currentSegment.id, parentBranch);
            branch.xh = node.xh;
            branchMap.set(node, branch);
            newTree.item(branch, parentBranch);

            if (reusableBranch) {
                branch.update(node.currentSegment);
            }

            return true;
        });

        return newTree;
    }
}

export { BranchCollection as internal_Hjb };
