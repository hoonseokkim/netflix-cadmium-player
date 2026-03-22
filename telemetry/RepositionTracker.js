/**
 * @file RepositionTracker - Tracks media reposition (seek) events for telemetry
 * @module telemetry/RepositionTracker
 * @description Records a trace of recent reposition events (seek, live edge jump,
 * track change, etc.) along with timestamps for diagnostic reporting. Maintains
 * a rolling buffer of the last 5 reposition events. Uses dependency injection
 * via inversify decorators.
 * @original Module_82557
 */

import { streamState } from '../player/PlayerEvents.js';
import { injectable, injectDecorator } from '../core/Inversify.js';
import { ClockToken } from '../timing/ClockTokens.js';
import { MILLISECONDS } from '../timing/TimeUnits.js';

/**
 * Tracks and reports media reposition events for telemetry and debugging.
 *
 * @class RepositionTracker
 * @injectable
 */
export class RepositionTracker {
    /**
     * @param {Object} clock - The player clock providing current time
     */
    constructor(clock) {
        /** @type {Object} Clock reference for timing */
        this.clock = clock;

        /** @type {Array<{time: *, event: Object}>} Rolling buffer of reposition events (max 5) */
        this.repositionTrace = [];
    }

    /**
     * Record a reposition event. Ignores the INITIAL state.
     * Maintains a maximum of 5 recent events (newest first).
     *
     * @param {Object} event - The reposition event
     * @param {number} event.cause - The reposition cause (from streamState enum)
     * @param {number} [event.OT] - New media time
     * @param {number} [event.XT] - Old media time
     * @param {*} [event.encryptionMetadata] - Content PTS
     * @param {boolean} [event.skip] - Whether this was a skip
     */
    recordReposition(event) {
        if (event.cause !== streamState.INITIAL) {
            this.repositionTrace.unshift({
                time: this.clock.getCurrentTime(),
                event: event
            });
            if (this.repositionTrace.length > 5) {
                this.repositionTrace.pop();
            }
        }
    }

    /**
     * Get the current reposition diagnostics for telemetry reporting.
     *
     * @returns {Object} Diagnostic info including time since last reposition,
     *   cause, and full trace of recent repositions
     */
    getDiagnostics() {
        if (this.repositionTrace.length === 0) {
            return {};
        }

        const latest = this.repositionTrace[0];

        return {
            timeSinceLastRepositionMs: this._timeSinceMs(latest.time),
            lastRepositionCause: this._causeToString(latest.event.cause),
            repositionTrace: this.repositionTrace.map((entry) => ({
                timeSince: this._timeSinceMs(entry.time),
                cause: this._causeToString(entry.event.cause),
                newMediaTime: entry.event.OT,
                oldMediaTime: entry.event.XT,
                contentPts: entry.event.encryptionMetadata,
                skip: entry.event.skip
            }))
        };
    }

    /**
     * Calculate milliseconds elapsed since a given timestamp.
     * @private
     * @param {*} timestamp - The reference timestamp
     * @returns {number} Elapsed milliseconds
     */
    _timeSinceMs(timestamp) {
        return this.clock.getCurrentTime()
            .lowestWaterMarkLevelBufferRelaxed(timestamp)
            .toUnit(MILLISECONDS);
    }

    /**
     * Convert a reposition cause enum value to a human-readable string.
     * @private
     * @param {number} cause - The cause enum value
     * @returns {string} Human-readable cause string
     */
    _causeToString(cause) {
        switch (cause) {
            case streamState.INITIAL:
                return 'initial';
            case streamState.SEEK:
                return 'seek';
            case streamState.LIVE_EDGE:
                return 'live_edge';
            case streamState.SEGMENT_CHANGED:
                return 'segment_changed';
            case streamState.TRACK_CHANGED:
                return 'track_changed';
            case streamState.FORCE_REBUFFER:
                return 'force_rebuffer';
            case streamState.FRAGMENTS_MISSING:
                return 'fragments_missing';
            case streamState.MEDIA_DISCONTINUITY:
                return 'media_discontinuity';
        }
    }
}

export default RepositionTracker;
