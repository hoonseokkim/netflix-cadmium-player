/**
 * Netflix Cadmium Player - PlaybackRegistry
 *
 * Global registry that tracks active playback instances. Maintains an ordered
 * list of playback instances (`instanceList`), lifecycle hook queues, and the
 * current "active instance" pointer used by the rest of the player.
 *
 * Also provides helpers for closing secondary instances and registering
 * lifecycle hooks for different event phases.
 *
 * Originally: Module 13044
 *
 * Dependencies:
 *   - Module 33096 (SUCCESS) - result constants
 *   - Module 45146 (assert)  - assertion utility
 */

import { SUCCESS } from '../modules/Module_33096';
import { assert } from '../modules/Module_45146';

// ---------------------------------------------------------------------------
// Hook phase constants
// ---------------------------------------------------------------------------

/** @type {number} Hook phase: triggered before playback starts */
export const HOOK_PHASE_PRE_PLAYBACK = 1;

/** @type {number} Hook phase: triggered after playback ends */
export const HOOK_PHASE_POST_PLAYBACK = 3;

// ---------------------------------------------------------------------------
// Global state
// ---------------------------------------------------------------------------

/**
 * Ordered list of active playback instances.
 * At most two instances may exist simultaneously (for seamless transitions).
 * @type {Array<Object>}
 */
export const instanceList = [];

/**
 * Hook callbacks registered for HOOK_PHASE_PRE_PLAYBACK.
 * @type {Array<Function>}
 */
export const prePlaybackHooks = [];

/**
 * Hook callbacks registered for HOOK_PHASE_POST_PLAYBACK.
 * @type {Array<Function>}
 */
export const postPlaybackHooks = [];

/**
 * Holder for the currently-active playback instance and related metadata.
 *
 * @type {{ index: number, activeInstance: Object|undefined, jUa: *|undefined }}
 */
export const playbackInstanceHolder = {
    index: 0,
    activeInstance: undefined,
    jUa: undefined,
};

// ---------------------------------------------------------------------------
// Rebuffer reason string constants
// ---------------------------------------------------------------------------

/** @type {string} Rebuffer caused by network conditions */
export const REBUFFER_REASON_NETWORK = 'network';

/** @type {string} Rebuffer caused by media decode / source buffer issues */
export const REBUFFER_REASON_MEDIA = 'media';

/** @type {string} Rebuffer caused by timed text (subtitle) loading */
export const REBUFFER_REASON_TIMED_TEXT = 'timedtext';

/** @type {string} General playback rebuffer */
export const REBUFFER_REASON_PLAYBACK = 'playback';

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

/**
 * Recursively closes any secondary playback instance (i.e. the one that is
 * not `excludeInstance`). Invokes `closing()` on the other instance and
 * retries until no secondary instance remains, then calls the completion
 * callback with SUCCESS.
 *
 * @param {Function|null} callback - Called with SUCCESS when all secondary instances are closed.
 * @param {Object} [excludeInstance] - The instance to keep alive.
 */
export function closeSecondaryInstances(callback, excludeInstance) {
    let other = instanceList[0];
    if (other === excludeInstance) {
        other = instanceList[1];
    }

    if (other) {
        other.closing(() => {
            closeSecondaryInstances(callback, excludeInstance);
        });
    } else if (callback) {
        callback(SUCCESS);
    }
}

/**
 * Registers a lifecycle hook callback for the given phase.
 *
 * @param {number} phase - One of HOOK_PHASE_PRE_PLAYBACK or HOOK_PHASE_POST_PLAYBACK.
 * @param {Function} callback - The hook function to register.
 */
export function registerLifecycleHook(phase, callback) {
    switch (phase) {
        case HOOK_PHASE_PRE_PLAYBACK:
            prePlaybackHooks.push(callback);
            return;
        case HOOK_PHASE_POST_PLAYBACK:
            postPlaybackHooks.push(callback);
            return;
    }
    assert(false);
}

/**
 * Returns the currently active playback instance if it exists in the
 * instance list, or undefined otherwise.
 *
 * @returns {Object|undefined} The active playback instance.
 */
export function getActiveInstance() {
    if (
        playbackInstanceHolder.activeInstance &&
        instanceList.includes(playbackInstanceHolder.activeInstance)
    ) {
        return playbackInstanceHolder.activeInstance;
    }
    return undefined;
}

// Legacy named exports matching original obfuscated identifiers
export {
    instanceList as tq,
    prePlaybackHooks as iJa,
    postPlaybackHooks as jJa,
    HOOK_PHASE_PRE_PLAYBACK as mjb,
    HOOK_PHASE_POST_PLAYBACK as hJa,
    REBUFFER_REASON_NETWORK as gJa,
    REBUFFER_REASON_MEDIA as fJa,
    REBUFFER_REASON_TIMED_TEXT as ljb,
    REBUFFER_REASON_PLAYBACK as njb,
    closeSecondaryInstances as ojb,
    registerLifecycleHook as m5b,
    getActiveInstance as kJa,
};
