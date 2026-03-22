/**
 * Netflix Cadmium Player - Graph Location Service
 *
 * Converts playback positions between the "UX playgraph" (simplified graph
 * exposed to the UI) and the "working playgraph" (full internal graph used
 * by the streaming engine). Maintains bidirectional caches (WeakMaps) for
 * efficient repeated lookups, and clears them whenever the segment map
 * is normalized or updated.
 *
 * @module GraphLocationService
 * @original Module_40981
 */

// import { __decorate } from '../utils/TsLibHelpers';
// import { Console } from '../monitoring/DebugLogConsole';
// import { SessionMetrics } from '../telemetry/SessionMetrics';
// import { clampSegmentPosition } from '../streaming/PlaygraphUtils';
// import { assert } from '../assert/Assert';
// import { DEBUG } from '../core/DebugFlags';
// import { createCache, clearAllCaches, cacheDecorator } from '../streaming/CacheHelpers';

/**
 * Service that maps positions between UX and working playgraphs.
 *
 * The UX playgraph is a simplified representation shown to the user interface,
 * while the working playgraph contains the full segment structure used by the
 * streaming engine. This service handles bidirectional mapping between the two.
 */
export class GraphLocationService {
    /**
     * @param {Function} getUxPlaygraph - Returns the current UX playgraph
     * @param {Function} getPreviousState - Returns the previous state containing the working playgraph
     * @param {Object} config - Configuration object
     * @param {string} [prefix] - Optional identifier prefix for logging (e.g. "content:", "ads:")
     */
    constructor(getUxPlaygraph, getPreviousState, config, prefix) {
        /** @private */
        this.getUxPlaygraph = getUxPlaygraph;
        /** @private */
        this.getPreviousState = getPreviousState;
        /** @private */
        this.config = config;
        /** @private */
        this.prefix = prefix;

        /** @private Cache: UX position -> working position */
        this.downConvertCache = new WeakMap();
        /** @private Cache: working position -> UX position */
        this.upConvertCache = new WeakMap();

        const sanitizedPrefix = prefix?.replace(":", "") ?? "";
        /** @private */
        this.console = new Console(`GRAPHLOCATIONSERVICE ${sanitizedPrefix}`);

        /** @private */
        this.diagnosticsTracer = new SessionMetrics({
            owner: this,
            source: (prefix || "") + "GraphLocation",
            console: this.console,
        });

        // Initialize memoization caches for both conversion directions
        createCache(this, "d", new MemoCache(config, positionsAreEqual));
        createCache(this, "u", new MemoCache(config, positionsAreEqual));
    }

    /**
     * Initializes event listeners to clear caches when segment maps change.
     * Called once after the playgraph is ready.
     */
    initialize() {
        if (this.prefix === "temp") return;

        const events = this.getPreviousState()?.events;
        if (events) {
            events.on("segmentNormalized", () => {
                this.#clearCaches();
            });
            events.on("playgraphUpdating", () => {
                this.#clearCaches();
            });
        }
    }

    /**
     * Creates a temporary GraphLocationService scoped to a single segment.
     *
     * @param {Object} segment - A segment with a Q2 (uxPlaygraph) property
     * @returns {GraphLocationService} Temporary instance
     */
    createTemporary(segment) {
        return new GraphLocationService(
            () => segment.Q2,
            () => ({ Ib: segment }),
            this.config,
            "temp"
        );
    }

    /**
     * Converts a position from UX playgraph coordinates to working playgraph coordinates.
     * (Down-conversion: simplified -> full)
     *
     * @param {Object} position - Position in UX playgraph space { M: segmentId, offset }
     * @returns {Object} Corresponding position in working playgraph space
     */
    downConvertPosition(position) {
        if (DEBUG) {
            this.console.trace("downConverting", position);
        }

        if (this.downConvertCache.has(position)) {
            return this.downConvertCache.get(position);
        }

        let result;
        try {
            const uxSegmentMap = this.getUxPlaygraph().segmentMap;
            const workingSegmentMap = this.getPreviousState().workingPlaygraph.segmentMap;

            if (uxSegmentMap === workingSegmentMap) {
                return (result = position);
            }

            if (workingSegmentMap.segments[position.M]) {
                if (!uxSegmentMap.segments[position.M] && DEBUG) {
                    this.console.warn(
                        "Received a down converted position unexpectedly",
                        position,
                        new Error().stack
                    );
                }
                const workingPlaygraph = this.getPreviousState().workingPlaygraph;
                return (result = this.#findMatchingSegment(position, workingPlaygraph) || position);
            }

            const clamped = clampSegmentPosition(position, this.getUxPlaygraph());
            const mapped = this.getUxPlaygraph().mapPositionDown({
                offset: clamped.clampedOffset,
                M: position.M,
            });

            assert(!!mapped, "mapPositionDown on uxPlaygraph should return a value");

            result = {
                offset: clamped.progressStats.item(mapped.offset),
                M: mapped.M,
            };

            if (DEBUG) {
                this.console.trace("downConverting ret:", result, this.getUxPlaygraph().identifier);
            }
            return result;
        } finally {
            if (result) {
                this.downConvertCache.set(position, result);
                this.upConvertCache.set(result, position);
            }
        }
    }

    /**
     * Converts a position from working playgraph coordinates to UX playgraph coordinates.
     * (Up-conversion: full -> simplified)
     *
     * @param {Object} position - Position in working playgraph space { M: segmentId, offset }
     * @returns {Object} Corresponding position in UX playgraph space
     */
    upConvertPosition(position) {
        if (DEBUG) {
            this.console.trace("upConverting", position);
        }

        if (this.upConvertCache.has(position)) {
            return this.upConvertCache.get(position);
        }

        let result;
        try {
            const uxSegmentMap = this.getUxPlaygraph().segmentMap;
            const workingSegmentMap = this.getPreviousState().workingPlaygraph.segmentMap;

            if (uxSegmentMap === workingSegmentMap) {
                return position;
            }

            if (uxSegmentMap.segments[position.M]) {
                if (!workingSegmentMap.segments[position.M] && DEBUG) {
                    this.console.warn(
                        "Received an up converted position unexpectedly",
                        position,
                        new Error().stack
                    );
                }
                return position;
            }

            const workingPlaygraph = this.getPreviousState().workingPlaygraph;
            const clamped = clampSegmentPosition(position, workingPlaygraph);
            const mapped = workingPlaygraph.mapPositionUp({
                offset: clamped.clampedOffset,
                M: position.M,
            });

            assert(!!mapped, "mapPositionUp on combinedPlaygraph should return a value");

            result = {
                offset: clamped.progressStats.item(mapped.offset),
                M: mapped.M,
            };

            if (DEBUG) {
                this.console.trace(
                    "upConverting ret:",
                    result,
                    workingPlaygraph.identifier
                );
            }
            return result;
        } finally {
            if (result) {
                this.upConvertCache.set(position, result);
                this.downConvertCache.set(result, position);
            }
        }
    }

    /**
     * Finds the deepest reachable segment in the working playgraph
     * for a given UX position by walking through successors.
     *
     * @param {Object} position - Position in UX playgraph space
     * @returns {string} The deepest segment ID in the working playgraph path
     */
    findDeepestSegment(position) {
        const mapped = this.downConvertPosition(position);
        assert(!!mapped, "mapPositionDown on uxPlaygraph should return a value");

        let segmentId = mapped.M;
        const workingPlaygraph = this.getPreviousState().workingPlaygraph;
        const successors = workingPlaygraph.segmentGraph.getSuccessors(segmentId);

        for (const successor of successors) {
            if (
                workingPlaygraph.resolveSegmentId(successor.id) !== position.M &&
                segmentId !== mapped.M
            ) {
                break;
            }
            segmentId = successor.id;
        }

        assert(segmentId, `Could not find any segments in the path of ${position}`);
        return segmentId;
    }

    // --- Private helpers ---

    /**
     * Clears all caches and recreates the WeakMaps.
     * @private
     */
    #clearCaches() {
        clearAllCaches(this).forEach((cache) => cache.clear());
        this.downConvertCache = new WeakMap();
        this.upConvertCache = new WeakMap();
    }

    /**
     * Attempts to find a matching segment by walking the successor chain.
     *
     * @private
     * @param {Object} position - The position to match
     * @param {Object} playgraph - The working playgraph
     * @returns {Object|undefined} Mapped position or undefined
     */
    #findMatchingSegment(position, playgraph) {
        const segmentInfo = playgraph.getSegmentInfo(position.M);
        if (!segmentInfo) return undefined;

        if (!segmentInfo.offset.isFinite() || position.offset.lessThan(segmentInfo.offset)) {
            return position;
        }

        let currentOffset = position.offset;
        const successors = playgraph.segmentGraph.getSuccessors(position.M);

        for (const successor of successors) {
            if (!successor.offset.isFinite() || currentOffset.lessThan(successor.offset)) {
                return { M: successor.id, offset: currentOffset };
            }
            currentOffset = currentOffset.subtract(successor.offset);
        }

        return undefined;
    }
}

/**
 * Compares two playgraph positions for equality.
 * @param {Object} a - First position
 * @param {Object} b - Second position
 * @returns {boolean}
 */
function positionsAreEqual(a, b) {
    return a.M === b.M && a.offset.equal(b.offset);
}

export default GraphLocationService;
