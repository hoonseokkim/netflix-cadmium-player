/**
 * @file TransitionLoggerSymbol.js
 * @description Dependency injection symbol for the transition logger service.
 *              Used as a token to bind/resolve the transition logger in the IoC container.
 *              The transition logger records playback state transitions (e.g., buffering,
 *              playing, paused) and segment/stream switches for analytics.
 * @module symbols/TransitionLoggerSymbol
 * @original Module_25830
 */

/**
 * Symbol identifier for the TransitionLogger service in the DI container.
 * @type {string}
 */
export const TransitionLoggerSymbol = "TransitionLoggerSymbol";
