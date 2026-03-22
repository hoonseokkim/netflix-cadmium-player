/**
 * Netflix Cadmium Player -- PacingFilter
 *
 * A decorator/wrapper around a stream selection filter that adds pacing-aware
 * logic. When the CDN returns pacing headers (e.g., CPR / Capacity Pacing Rate),
 * this filter can suppress or allow stream candidates based on the configured
 * pacing strategy:
 *
 * - "requested"        : Always reject paced items
 * - "requested-low"    : Reject only if pace rate <= CDN's CPR network ID
 * - "inferred"         : Use pace-rate inference to decide; reject if inferred pacing active
 * - "inferred-strict"  : Reject if inferred pacing is active at all
 * - (default/none)     : Allow all items through
 *
 * @module ase/PacingFilter
 * @original Module_66917
 * @dependencies
 *   Module 66164 - platform globals (Console)
 */

import { platform } from '../utils/PlatformGlobals'; // Module 66164

/** @type {Console} */
const console = new platform.Console("ASEJS_PACING_FILTER", "media|asejs");

/**
 * Filter that wraps another stream selection filter and adds CDN pacing logic.
 */
class PacingFilter {
    /**
     * @param {Object} config - Pacing configuration
     * @param {string} config.ignorePacedRequestStrategy - Strategy name
     * @param {number} config.effectivePaceRateFactor - Multiplier for pace rate
     * @param {number} config.pacedThresholdPct - Threshold percentage for inferred mode
     * @param {Object} innerFilter - The wrapped stream selection filter
     */
    constructor(config, innerFilter) {
        this.config = config;
        this.filter = innerFilter;
    }

    /**
     * Create a shallow copy of this filter (shares the same inner filter).
     * @returns {PacingFilter}
     */
    clone() {
        return new PacingFilter(this.config, this.filter);
    }

    /**
     * Determine whether a stream candidate should be allowed through the filter.
     *
     * @param {number} bitrate - Candidate bitrate
     * @param {number} bufferLevel - Current buffer level
     * @param {number} throughput - Estimated throughput
     * @param {Object} streamInfo - Stream metadata
     * @param {Object} [streamInfo.paceRate] - CDN pace-rate descriptor
     * @param {Object} [streamInfo.cdnId] - CDN identifier with cprNetworkId
     * @returns {boolean} True if the candidate should be included (not paced away)
     * @private
     */
    _shouldAllowPacedRequest(bitrate, bufferLevel, throughput, streamInfo) {
        const paceRate = streamInfo.paceRate;

        if (!paceRate || !paceRate.isActive()) {
            return true;
        }

        switch (this.config.ignorePacedRequestStrategy) {
            case "requested":
                return false;

            case "requested-low": {
                const adjustedRate = paceRate.applyFactor(this.config.effectivePaceRateFactor);
                return adjustedRate.getRate() > (streamInfo.cdnId?.cprNetworkId || 0);
            }

            case "inferred": {
                const adjustedRate = paceRate.applyFactor(this.config.effectivePaceRateFactor);
                const isPaced = adjustedRate.isInferredPaced(bitrate, bufferLevel, throughput, this.config.pacedThresholdPct);
                if (!isPaced) break;
                return adjustedRate.getRate() > (streamInfo.cdnId?.cprNetworkId || 0);
            }

            case "inferred-strict": {
                const adjustedRate = paceRate.applyFactor(this.config.effectivePaceRateFactor);
                if (adjustedRate.isInferredPaced(bitrate, bufferLevel, throughput, this.config.pacedThresholdPct)) {
                    return false;
                }
                break;
            }
        }

        return true;
    }

    /**
     * Process one stream candidate. Delegates to the inner filter only if pacing allows it.
     */
    item(bitrate, bufferLevel, throughput, streamInfo) {
        if (this._shouldAllowPacedRequest(bitrate, bufferLevel, throughput, streamInfo)) {
            this.filter.item(bitrate, bufferLevel, throughput, streamInfo);
        }
    }

    /** @param {*} value */
    key(value) {
        if (this.filter.key) return this.filter.key(value);
    }

    /** @param {*} value */
    start(value) {
        if (this.filter.start) this.filter.start(value);
    }

    /** @param {*} value */
    aseTimer(value) {
        if (this.filter.aseTimer) this.filter.aseTimer(value);
    }

    logBatcher() {
        if (this.filter.logBatcher) this.filter.logBatcher();
    }

    /** @param {*} value */
    create(value) {
        if (this.filter.create) this.filter.create(value);
    }
}

export { PacingFilter };
