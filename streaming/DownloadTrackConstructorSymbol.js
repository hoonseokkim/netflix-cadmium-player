/**
 * @file DownloadTrackConstructorSymbol.js
 * @description Defines the dependency injection symbol and event bus factory interface
 * for download track construction. The EventBusFactory provides versioning
 * constants and an execute method for track construction operations.
 * @module streaming/DownloadTrackConstructorSymbol
 * @see Module_67263
 */

/**
 * Event bus factory for download track construction.
 * Provides version constants for the download track protocol.
 */
export class EventBusFactory {
  constructor() {
    /** @type {number} Version V0 */
    this.V = 0;

    /** @type {number} Version V1 */
    this.U = 1;

    /** @type {number} Version V2 */
    this.V2 = 2;

    /**
     * Execute method placeholder for track construction.
     * Overridden by implementations.
     */
    this.execute = function () {};
  }
}

/**
 * Dependency injection symbol for the DownloadTrackConstructorFactory.
 * @type {string}
 */
export const DOWNLOAD_TRACK_CONSTRUCTOR_FACTORY_SYMBOL = 'DownloadTrackConstructorFactorySymbol';
