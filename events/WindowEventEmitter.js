/**
 * Netflix Cadmium Player - Window Event Emitter
 *
 * Sets up global browser event listeners (beforeunload, keydown, resize,
 * visibilitychange, global error) and relays them through a shared EventEmitter.
 * Uses jQuery if available on the Netflix page, otherwise falls back to native
 * addEventListener.
 *
 * @module WindowEventEmitter
 * @original Module_37509
 */

// import { EventEmitter } from './EventEmitter';
// import { scheduleAsync } from '../utils/Scheduler';
// import { document as doc } from '../utils/PlatformGlobals';

/**
 * Window event type identifiers.
 * @enum {number}
 */
export const WindowEventType = Object.freeze({
    /** Window/tab is about to unload (beforeunload) */
    BEFORE_UNLOAD: 1,
    /** User pressed a key (keydown) */
    KEY_DOWN: 2,
    /** Browser window was resized */
    RESIZE: 3,
    /** Document visibility changed (tab hidden/shown) */
    VISIBILITY_CHANGE: 4,
    /** Uncaught global error occurred */
    GLOBAL_ERROR: 5,
});

/**
 * Initializes global window event listeners and emits events through
 * the shared event bus.
 *
 * @param {Object} eventEmitter - An EventEmitter instance (jl class)
 * @param {Function} scheduleAsync - Async scheduler function
 * @param {Document} document - The document object
 */
export function initializeWindowEvents(eventEmitter, scheduleAsync, document) {
    scheduleAsync(() => {
        const jQuery = window.jQuery;
        const $window = jQuery ? jQuery(window) : null;

        /**
         * Registers an event listener on the window, using jQuery if available.
         * @param {string} eventName - DOM event name
         * @param {Function} handler - Event handler
         */
        function addEventListener(eventName, handler) {
            if ($window) {
                $window.on(eventName, handler);
            } else {
                window.addEventListener(eventName, handler);
            }
        }

        // Check for Netflix Cadmium custom beforeunload handler
        const cadmiumHandler =
            window.netflix?.cadmium?.addBeforeUnloadHandler;

        let isHidden = document.hidden;

        // Before-unload handler
        if (cadmiumHandler) {
            cadmiumHandler((event) => {
                eventEmitter.emit(WindowEventType.BEFORE_UNLOAD, event);
            });
        } else {
            addEventListener("beforeunload", (event) => {
                eventEmitter.emit(WindowEventType.BEFORE_UNLOAD, event);
            });
        }

        // Keydown handler
        addEventListener("keydown", (event) => {
            eventEmitter.emit(WindowEventType.KEY_DOWN, event);
        });

        // Resize handler
        addEventListener("resize", () => {
            eventEmitter.emit(WindowEventType.RESIZE);
        });

        // Visibility change handler
        document.addEventListener("visibilitychange", () => {
            if (isHidden !== document.hidden) {
                isHidden = document.hidden;
                eventEmitter.emit(WindowEventType.VISIBILITY_CHANGE);
            }
        });
    });

    // Global error handler (runs immediately, not deferred)
    window.addEventListener("error", (errorEvent) => {
        eventEmitter.emit(WindowEventType.GLOBAL_ERROR, errorEvent);
        return true;
    });
}

export default {
    WindowEventType,
    initializeWindowEvents,
};
