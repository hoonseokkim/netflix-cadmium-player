/**
 * Unhandled Exception Handler
 *
 * Attaches a global unhandled exception listener during playback that captures
 * uncaught errors, logs them, and optionally triggers a fatal playback error
 * if the exception originates from the player's source code. Automatically
 * detaches on player close or end-of-playback.
 *
 * @module UnhandledExceptionHandler
 * @original Module_78719
 */

// import { config } from './PlayerConfig';
// import { globalEvents, UNHANDLED_ERROR_EVENT } from './GlobalEvents';
// import { initializeModel } from './ErrorModel';
// import { ErrorCodes } from './ErrorCodes';
// import { PlayerEvents } from './PlayerEvents';

/**
 * Registers a global unhandled exception handler for the player.
 * The handler:
 * - Logs all uncaught exceptions
 * - Checks if the exception source matches the player source
 * - If so, fires a fatal UNHANDLED_EXCEPTION playback error
 * - Automatically unregisters on player close or end-of-playback
 *
 * @param {Object} player - The player instance with fireError, addEventListener, removeEventListener
 * @param {Object} logger - Logger for error reporting
 */
export function registerUnhandledExceptionHandler(player, logger) {
    /**
     * Handles an uncaught exception event.
     * @param {ErrorEvent} event
     */
    function onUncaughtException(event) {
        const error = event.error || event;
        const errorModel = initializeModel(error);
        logger.error("uncaught exception", error, errorModel);

        const stack = error?.stack;
        const isPlayerSource = stack &&
            config.unhandledExceptionSource &&
            config.unhandledExceptionsArePlaybackErrors
                ? stack.indexOf(config.unhandledExceptionSource) >= 0
                : undefined;

        if (isPlayerSource) {
            if (event?.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            }
            player.fireError(ErrorCodes.UNHANDLED_EXCEPTION);
        }
    }

    /**
     * Cleans up by removing the exception handler.
     */
    function cleanup() {
        globalEvents.removeListener(UNHANDLED_ERROR_EVENT, onUncaughtException);
        player.removeEventListener(PlayerEvents.CLOSE, cleanup);
        player.removeEventListener(PlayerEvents.END_OF_PLAYBACK, cleanup);
    }

    try {
        globalEvents.addListener(UNHANDLED_ERROR_EVENT, onUncaughtException);
        player.addEventListener(PlayerEvents.CLOSE, cleanup);
        if (config.ignoreUnhandledExceptionDuringPlayback) {
            player.addEventListener(PlayerEvents.END_OF_PLAYBACK, cleanup);
        }
    } catch (err) {
        logger.error("exception in exception handler ", err);
    }
}
