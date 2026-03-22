/**
 * @file AdFocusMonitorSymbol.js
 * @description Dependency injection symbol for the ad focus monitor service.
 *              Used as a token to bind/resolve the ad focus monitor in the IoC container.
 *              The ad focus monitor tracks whether the player window/tab has focus
 *              during ad playback (to detect ad fraud / verify viewability).
 * @module symbols/AdFocusMonitorSymbol
 * @original Module_25540
 */

/**
 * Symbol identifier for the AdFocusMonitor service in the DI container.
 * @type {string}
 */
export const AdFocusMonitorSymbol = "AdFocusMonitorSymbol";
