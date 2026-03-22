/**
 * Netflix Cadmium Player - ParentBranchHelper
 * Component: PARENT-BRANCH-HELPER
 *
 * Manages the parent-child branch relationship for interactive/branched content.
 * Coordinates promise chains between parent and child branches to ensure
 * proper sequencing of normalization (timestamp resolution) and viewable
 * readiness across the branch hierarchy.
 *
 * In Netflix's interactive content (e.g., Bandersnatch), content is organized
 * as a tree of branches. A child branch cannot begin playback until its parent
 * branch has completed normalization and viewable preparation.
 */

// Dependencies
// import { assert, DeferredPromise, lazyInitializer } from './modules/Module_91176.js';
// import { platform } from './modules/Module_66164.js';
// import { DEBUG_ENABLED } from './modules/Module_48170.js';

/**
 * @class ParentBranchHelper
 * @description Coordinates parent-child branch dependencies for interactive content.
 *   Maintains two promise chains:
 *   1. parentNormalizationPromise - resolves when the parent branch's segment
 *      timestamps have been normalized (resolved to absolute PTS values).
 *   2. parentViewablePromise - resolves when the parent branch's viewable
 *      session (DRM keys, manifest, etc.) is ready.
 *
 *   Both must resolve before a child branch can begin downloading/appending media.
 */
class ParentBranchHelper {
  /**
   * @param {Object} branchInfo - The branch information object containing parent references.
   * @param {string} branchInfo.branchId - Unique identifier for this branch.
   * @param {Object} [branchInfo.parent] - Parent branch reference, if any.
   * @param {Promise} [branchInfo.parent.normalizationPromise] - Promise that resolves when
   *   parent normalization is complete.
   * @param {Promise} [branchInfo.parent.viewableReadyPromise] - Promise that resolves when
   *   parent viewable session is ready.
   */
  constructor(branchInfo) {
    /** @type {Object} The branch info containing parent reference and branchId */
    this.branchInfo = branchInfo;

    /**
     * @type {DeferredPromise}
     * Deferred promise for parent normalization completion.
     * Resolves when the parent branch's timestamps have been resolved.
     */
    this.parentNormalizationDeferred = new DeferredPromise({ cancelOnReject: false });

    /**
     * @type {DeferredPromise}
     * Deferred promise for parent viewable readiness.
     * Resolves when the parent branch's viewable session is fully prepared.
     */
    this.parentViewableDeferred = new DeferredPromise({ cancelOnReject: false });

    // ======== MODULE: PARENT-BRANCH-HELPER ========
    /** @type {Console} Scoped console logger for this branch */
    this.console = new platform.Console(
      'PARENT-BRANCH-HELPER',
      'asejs',
      `{${branchInfo.branchId}}`
    );

    /**
     * @type {Function}
     * Lazy initializer that sets up the promise chain on first access.
     * Ensures setupPromiseChain() is called exactly once.
     */
    this.lazySetup = lazyInitializer(() => this.setupPromiseChain());
  }

  /**
   * Resets the promise chains when the branch is being reparented
   * to a different parent branch.
   */
  reset() {
    DEBUG_ENABLED && this.console.debug('Reparenting - resetting promises');
    this.setupPromiseChain();
  }

  /**
   * Sets up or resets the promise chains that track parent branch state.
   *
   * Creates fresh DeferredPromise instances for both normalization and
   * viewable readiness, then wires them to the parent branch's corresponding
   * promises. If there is no parent branch, the promises resolve immediately.
   *
   * @returns {boolean} Always returns true to indicate setup was performed.
   */
  setupPromiseChain() {
    DEBUG_ENABLED && this.console.debug('setting up promise chain');

    // Reset normalization deferred if already settled
    if (this.parentNormalizationDeferred.isSettled) {
      this.parentNormalizationDeferred = new DeferredPromise({ cancelOnReject: false });
      this.parentNormalizationDeferred.promise.then(() => {
        DEBUG_ENABLED && this.console.debug('Parent normalization complete');
      });
    }

    // Reset viewable deferred if already settled
    if (this.parentViewableDeferred.isSettled) {
      this.parentViewableDeferred = new DeferredPromise({ cancelOnReject: false });
      this.parentViewableDeferred.then(() => {
        DEBUG_ENABLED && this.console.debug('Parent viewable complete');
      });
    }

    if (this.branchInfo.parent) {
      // Wire up to parent branch's promises
      DEBUG_ENABLED && this.console.debug('Listening to parent', {
        id: this.branchInfo.parent.branchId,
        normalizationPromise: !!this.branchInfo.parent.normalizationPromise,
        viewableReadyPromise: !!this.branchInfo.parent.viewableReadyPromise,
      });

      const parentBranch = this.branchInfo.parent;
      this.parentNormalizationDeferred.chain(parentBranch.normalizationPromise, false);
      this.parentViewableDeferred.chain(parentBranch.viewableReadyPromise, false);
    } else {
      // No parent — resolve immediately
      DEBUG_ENABLED && this.console.debug('Resolving directly, no parent branch');
      this.parentNormalizationDeferred.chain(Promise.resolve(), false);
      this.parentViewableDeferred.chain(Promise.resolve(), false);
    }

    return true;
  }

  /**
   * Returns a promise that resolves when the parent branch's viewable
   * session is ready. Triggers lazy initialization of the promise chain
   * if it hasn't been set up yet.
   *
   * @returns {Promise<void>} Resolves when parent viewable is ready.
   */
  waitForParentViewable() {
    this.lazySetup();
    return this.parentViewableDeferred.promise;
  }

  /**
   * Returns a promise that resolves when the parent branch's segment
   * timestamps have been normalized. Triggers lazy initialization of
   * the promise chain if it hasn't been set up yet.
   *
   * @returns {Promise<void>} Resolves when parent normalization is complete.
   */
  waitForParentNormalization() {
    this.lazySetup();
    return this.parentNormalizationDeferred.promise;
  }
}

export { ParentBranchHelper };
