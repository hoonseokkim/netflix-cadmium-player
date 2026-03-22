/**
 * StreamDisallowRegistry - Registry for stream disallow filters
 *
 * Maintains a collection of stream filter factories. Each factory can
 * create a filter that checks whether a given stream should be disallowed.
 * Used by the ABR (Adaptive Bitrate) system to filter out streams that
 * should not be selected.
 *
 * @module streaming/StreamDisallowRegistry
 * @original Module_59032
 */

/** @type {Array<Function>} Registered filter factory functions */
const filterFactories = [];

/**
 * Registers a new stream disallow filter factory.
 *
 * @param {Function} factory - A function (config, context) => filter | null.
 *   If the factory returns a filter, it will be added to the registry instance.
 */
export function registerDisallowFilter(factory) {
    filterFactories.push(factory);
}

/**
 * A registry instance that holds active stream disallow filters
 * created from registered factories.
 */
export class StreamDisallowRegistry {
    /**
     * @param {Object} config - Player/streaming configuration
     * @param {Object} context - Streaming context
     */
    constructor(config, context) {
        /** @type {Array<Object>} Active filter instances */
        this.filters = [];

        filterFactories.forEach((factory) => {
            const filter = factory(config, context);
            if (filter) {
                this.filters.push(filter);
            }
        });
    }

    /**
     * Checks a stream against all registered filters and returns
     * the list of reasons why the stream is disallowed (if any).
     *
     * @param {Object} stream - The stream to check
     * @returns {string[]|undefined} Array of disallow reasons, or undefined if allowed
     */
    getDisallowReasons(stream) {
        const reasons = [];
        for (let i = this.filters.length; i--; ) {
            const filter = this.filters[i];
            if (filter.nJ(stream)) {
                reasons.push(filter.xra);
            }
        }
        if (reasons.length) {
            return reasons;
        }
    }
}
