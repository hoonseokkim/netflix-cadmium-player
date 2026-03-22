/**
 * Netflix Cadmium Player - Reentrant Guard
 *
 * Creates a guard wrapper around a function that prevents recursive/reentrant
 * calls. If the function is called while already executing, it will be
 * re-invoked once after the current execution completes (coalescing).
 *
 * @module ReentrantGuard
 * @original Module_97368
 */

/**
 * Wraps a function to prevent reentrant execution. If the wrapped function
 * is called while already running, the call is queued and the function is
 * re-executed once after the current invocation completes.
 *
 * @param {Function} fn - The function to guard against reentrant calls
 * @returns {Function} Guarded function that coalesces reentrant calls
 *
 * @example
 * const guardedUpdate = createReentrantGuard(() => {
 *     // This won't be called recursively even if something
 *     // inside triggers another update
 *     updateState();
 *     notifyListeners(); // may call guardedUpdate() again
 * });
 */
export function createReentrantGuard(fn) {
    let isExecuting = false;
    let isPending = false;

    return function guardedInvocation() {
        if (isExecuting) {
            // Already executing - mark as pending for re-execution
            isPending = true;
        } else {
            // Execute and keep looping while re-invocations are pending
            for (isPending = true; isPending; ) {
                isPending = false;
                isExecuting = true;
                try {
                    fn();
                } finally {
                    isExecuting = false;
                }
            }
        }
    };
}
