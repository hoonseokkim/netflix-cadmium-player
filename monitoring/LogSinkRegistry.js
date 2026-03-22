/**
 * Log Sink Registry
 *
 * Registry for log sinks that collects and manages logging output destinations.
 * Allows registering named log sinks and maintains a flat list for iteration.
 * Used as an injectable singleton in the Cadmium player's logging infrastructure.
 *
 * @module LogSinkRegistry
 * @original Module_80401
 * @injectable
 */

// import { injectable } from './DependencyInjection';

/**
 * Manages a set of named log sinks (logging output destinations).
 *
 * @injectable
 */
export class LogSinkRegistry {
    constructor() {
        /**
         * Named log sink map
         * @type {Object<string, Object>}
         */
        this._sinkMap = {};

        /**
         * Flat array of all registered sinks for fast iteration
         * @type {Object[]}
         */
        this.logSinks = [];
    }

    /**
     * Registers a log sink under a given name.
     * @param {string} name - Unique sink identifier
     * @param {Object} sink - The log sink to register
     */
    registerSink(name, sink) {
        if (sink) {
            this._sinkMap[name] = sink;
            this.logSinks = Object.values(this._sinkMap);
        }
    }
}
