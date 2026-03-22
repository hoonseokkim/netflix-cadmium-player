/**
 * Ad Event Types
 *
 * Defines the event type constants used for ad playback tracking in the
 * Cadmium player. Includes events for individual ads (start, progress,
 * complete, stop), ad breaks (start, complete, stop), and error/lifecycle
 * events (error, exit, unload).
 *
 * @module AdEventTypes
 * @original Module_80966
 */

/**
 * Individual ad lifecycle events
 * @enum {string}
 */
export const AdEvents = Object.freeze({
    AD_START: "adStart",
    AD_PROGRESS: "adProgress",
    AD_COMPLETE: "adComplete",
    AD_STOP: "adStop",
});

/**
 * Ad break lifecycle events
 * @enum {string}
 */
export const AdBreakEvents = Object.freeze({
    AD_BREAK_COMPLETE: "adBreakComplete",
    AD_BREAK_START: "adBreakStart",
    AD_BREAK_STOP: "adBreakStop",
});

/**
 * Ad error and lifecycle events
 * @enum {string}
 */
export const AdLifecycleEvents = Object.freeze({
    ERROR: "error",
    EXIT: "exit",
    UNLOAD: "unload",
});

/**
 * DI symbol for the ad impression logger factory
 * @type {string}
 */
export const AD_IMPRESSION_LOGGER_FACTORY_SYMBOL = "AdImpressionLoggerrFactorySymbol";
