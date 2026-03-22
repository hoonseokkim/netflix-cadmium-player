/**
 * @file OpenConnectSymbols.js
 * @description Dependency injection symbols for Open Connect CDN services.
 *              Open Connect is Netflix's proprietary CDN. These symbols are used
 *              as tokens in the IoC container to bind/resolve:
 *              - The side channel service (for out-of-band CDN communication)
 *              - The media request downloader service (for fetching A/V segments)
 * @module symbols/OpenConnectSymbols
 * @original Module_31034
 */

/**
 * Symbol identifier for the Open Connect side channel service in the DI container.
 * The side channel communicates buffer/playback state to the CDN for optimized delivery.
 * @type {string}
 */
export const OpenConnectSideChannelSymbol = "OpenConnectSideChannelSymbol";

/**
 * Symbol identifier for the media request downloader service in the DI container.
 * Handles downloading audio/video segments from Open Connect CDN servers.
 * @type {string}
 */
export const MediaRequestDownloaderSymbol = "MediaRequestDownloaderSymbol";
