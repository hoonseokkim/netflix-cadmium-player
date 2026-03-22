/**
 * @module LogblobBuilderSymbols
 * @description Dependency injection symbols for log blob builder services.
 * Log blobs are structured telemetry payloads sent to Netflix's logging
 * infrastructure for playback diagnostics and analytics.
 *
 * @original Module_10242
 */

/**
 * Symbol identifier for the standard log blob builder service.
 * @type {string}
 */
export const LogblobBuilderSymbol = "LogblobBuilderSymbol";

/**
 * Symbol identifier for the HLS-specific log blob builder factory.
 * Used when the player operates in HLS streaming mode.
 * @type {string}
 */
export const HLSLogblobBuilderFactorySymbol = "HLSLogblobBuilderFactorySymbol";
