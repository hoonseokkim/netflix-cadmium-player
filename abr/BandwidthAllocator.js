/**
 * Netflix Cadmium Player — Bandwidth Allocator
 *
 * Manages bandwidth allocation between audio and video streams during
 * adaptive bitrate streaming. Determines how much bandwidth is available
 * for each media type based on throughput history, buffer state, and
 * configurable margin curves.
 *
 * Supports two allocation strategies:
 * 1. Margin-based: Uses a bandwidth margin curve to compute lower/upper bounds
 * 2. Percentage-based: Allocates a fixed percentage of throughput to audio
 *
 * @module abr/BandwidthAllocator
 * @original Module_50612
 */

import { playerPhase } from '../modules/Module_65161.js'; // player phase enum
import { zTa as interpolateCurve } from '../modules/Module_65167.js'; // curve interpolation
import { calculateEffectiveBandwidth } from '../modules/Module_28847.js'; // bandwidth calculation

/**
 * Allocates bandwidth between audio and video streams.
 *
 * Tracks the current audio bitrate and a cached bandwidth value, then
 * uses them to discount audio bandwidth from total throughput so the ABR
 * algorithm can select appropriate video bitrate levels.
 */
export class BandwidthAllocator {
  /**
   * @param {object} config - ABR configuration.
   * @param {number} config.throughputPercentForAudio - Percentage of throughput reserved for audio.
   * @param {boolean} config.bandwidthMarginForAudio - Whether to use margin-based allocation.
   * @param {Array} config.bandwidthMarginCurveAudio - Curve points for margin interpolation.
   * @param {boolean} config.enableInitialThroughputHistory - Use throughput history during startup.
   * @param {boolean} config.limitAudioDiscountByMaxAudioBitrate - Cap audio discount by max bitrate.
   */
  constructor(config) {
    /** @private */
    this.config = config;

    /**
     * Cached bandwidth value for external queries.
     * @private
     * @type {number|null}
     */
    this.cachedBandwidth = null;

    /**
     * Current audio bitrate used for bandwidth discounting.
     * @private
     * @type {number|null}
     */
    this.currentAudioBitrate = null;

    /**
     * Calculate bandwidth allocation for audio, given throughput stats
     * and buffer state.
     *
     * @param {object} throughputStats - Throughput history with average values.
     * @param {object} bufferState - Current buffer levels (downloadPosition, playbackPosition).
     * @param {string} playerPhaseValue - Current player phase (STARTING, BUFFERING, etc.).
     * @returns {{lower: number, upper: number|undefined}} Bandwidth allocation bounds.
     */
    this.calculateAudioBandwidthAllocation = (throughputStats, bufferState, playerPhaseValue) => {
      const availableBandwidth = this.getAvailableBandwidth(throughputStats, playerPhaseValue);

      if (this.config.bandwidthMarginForAudio) {
        const bufferDuration = bufferState.downloadPosition - bufferState.playbackPosition;
        const marginFactor = interpolateCurve(this.config.bandwidthMarginCurveAudio, bufferDuration, 1);
        return {
          lower: availableBandwidth * (1 - marginFactor),
          upper: undefined,
        };
      }

      return {
        lower: availableBandwidth * this.config.throughputPercentForAudio / 100,
        upper: undefined,
      };
    };
  }

  /**
   * Compute effective bandwidth for video by discounting audio bitrate.
   *
   * @param {number} totalBandwidth - Total measured bandwidth.
   * @param {number} [maxAudioBitrate] - Maximum audio bitrate for capping.
   * @returns {number} Effective bandwidth available for video.
   */
  computeVideoBandwidth(totalBandwidth, maxAudioBitrate) {
    const discounted = this.currentAudioBitrate === null
      ? totalBandwidth * (100 - this.config.throughputPercentForAudio) / 100
      : calculateEffectiveBandwidth(totalBandwidth, this.currentAudioBitrate);

    if (this.config.limitAudioDiscountByMaxAudioBitrate && maxAudioBitrate) {
      const maxDiscounted = calculateEffectiveBandwidth(totalBandwidth, maxAudioBitrate);
      return Math.max(maxDiscounted, discounted);
    }

    return discounted;
  }

  /**
   * Check if throughput location history should be used (during startup phases).
   *
   * @param {string} phase - Current player phase.
   * @returns {boolean} True if throughput history should be preferred.
   * @private
   */
  shouldUseThroughputHistory(phase) {
    return this.config.enableInitialThroughputHistory &&
      (phase === playerPhase.STARTING || phase === playerPhase.BUFFERING);
  }

  /**
   * Get available bandwidth from throughput stats, choosing between
   * throughput location history and buffer-based estimate.
   *
   * @param {object} throughputStats - Statistics with throughputLocationHistory and bufferLength.
   * @param {string} playerPhaseValue - Current player phase.
   * @returns {number} Available bandwidth estimate.
   */
  getAvailableBandwidth(throughputStats, playerPhaseValue) {
    if (this.shouldUseThroughputHistory(playerPhaseValue)) {
      return throughputStats.throughputLocationHistory?.average
        ?? throughputStats.bufferLength?.average
        ?? 0;
    }
    return throughputStats.bufferLength?.average ?? 0;
  }

  /**
   * Update the current audio bitrate.
   * @param {number} bitrate - New audio bitrate.
   */
  setAudioBitrate(bitrate) {
    this.currentAudioBitrate = bitrate;
  }

  /**
   * Get the current audio bitrate.
   * @returns {number|null}
   */
  getAudioBitrate() {
    return this.currentAudioBitrate;
  }

  /**
   * Set the cached bandwidth value.
   * @param {number} bandwidth
   */
  setCachedBandwidth(bandwidth) {
    this.cachedBandwidth = bandwidth;
  }

  /**
   * Get the cached bandwidth value.
   * @returns {number|null}
   */
  getCachedBandwidth() {
    return this.cachedBandwidth;
  }
}

export { BandwidthAllocator as TJ };
