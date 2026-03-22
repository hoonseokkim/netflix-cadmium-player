/**
 * @module monitoring/DroppedFrameFilter
 * @description Monitors video playback for dropped frames and restricts resolution
 *              when the dropped frame rate exceeds configured thresholds. Periodically
 *              samples the platform's dropped frame counter while playing, records
 *              per-resolution dropped frame statistics, and triggers resolution
 *              downgrades when patterns indicate the device cannot sustain a given height.
 *
 *              Key behaviors:
 *              - Polls dropped frames every 1 second during PLAYING/NORMAL state
 *              - Maintains per-resolution dropped frame history (ring buffer)
 *              - Computes dropped frame rate distributions for ABR decision-making
 *              - Fires resolution restriction events when thresholds are exceeded
 *              - Exposes cumulative and percentile-based dropped frame reporters
 *
 * @see Module_95136
 */

import { MAX_HEIGHT as kgb } from '../config/DroppedFrameConfig.js';           // Module 33096
import { sortNumericAscending } from '../utils/ArrayUtils.js';                  // Module 52569 (FCa)
import { totalTime } from '../utils/MathUtils.js';                              // Module 22365
import { PlayerStates, PlayerEvents } from '../core/PlayerConstants.js';        // Module 85001
import { forEachProperty, parseInteger } from '../utils/ObjectUtils.js';        // Module 3887
import { MILLISECONDS } from '../core/TimeUnits.js';                            // Module 5021
import { ObservableValue } from '../core/ObservableValue.js';                   // Module 81734

/**
 * @class DroppedFrameFilter
 * Monitors dropped frames during playback and restricts resolution when thresholds are breached.
 */
class DroppedFrameFilter {
  /**
   * @param {Object} playerState - Current player state observable
   * @param {Object} subscriberList - Subscriber/reporter registry for the session
   * @param {Object} logger - Logger instance
   * @param {Object} lastVideoSync - Video sync clock for current time
   * @param {Function} configProvider - Returns dropped frame filter configuration
   */
  constructor(playerState, subscriberList, logger, lastVideoSync, configProvider) {
    /** @type {Object} Player state observable */
    this.playerState = playerState;

    /** @type {Object} Session subscriber/reporter registry */
    this.subscriberList = subscriberList;

    /** @type {Object} Logger instance */
    this.logger = logger;

    /** @type {Object} Video sync clock */
    this.lastVideoSync = lastVideoSync;

    /** @type {Object.<number, Array<number>>} Per-resolution dropped frame history */
    this.qualityInfo = {};

    /** @type {Object.<number, Object.<number, number>>} Per-resolution dropped frame count distributions */
    this.droppedFrameDistributions = {};

    /** @type {Array<number>} Sorted list of observed resolution heights */
    this.observedHeights = [];

    /** @private @type {number} Polling interval in ms */
    this.pollingIntervalMs = 1000;

    /** @private @type {number} Maximum allowed resolution height (relaxes over time) */
    this.maxAllowedHeight = kgb;

    /**
     * Listener callback: starts/stops the polling interval based on player state.
     * Polling runs only when playing in NORMAL state with matching session ID.
     * @private
     */
    this.onStateChanged = () => {
      const isPlayingNormally =
        this.playerState.presentingState.value === PlayerStates.setState.PLAYING &&
        this.playerState.state.value === PlayerStates.pacingTargetBufferStrategy.NORMAL &&
        this.playerState.R === this.subscriberList.R;

      if (this.pollingTimer) {
        if (!isPlayingNormally) {
          clearInterval(this.pollingTimer);
          this.pollingTimer = undefined;
          this.lastSample = undefined;
        }
      } else if (isPlayingNormally) {
        this.pollingTimer = Da.setInterval(this.onPollDroppedFrames, this.pollingIntervalMs);
      }
    };

    /**
     * Periodic callback: reads the platform dropped frame counter, computes
     * the delta since last poll, and records the result for the current resolution.
     * @private
     */
    this.onPollDroppedFrames = () => {
      const targetBuffer = this.playerState.targetBuffer.value;
      const stream = targetBuffer && targetBuffer.stream;
      const height = stream && stream.height != null ? stream.height : null;

      if (height === null || height <= 0) return;

      const currentTimeMs = this.lastVideoSync.getCurrentTime().toUnit(MILLISECONDS);
      const platformDroppedFrames = this.playerState.mediaSourceManager.vS();

      if (!platformDroppedFrames) return;

      if (
        this.lastSample &&
        currentTimeMs - this.lastSample.platform < 2 * this.pollingIntervalMs &&
        height === this.lastSample.height
      ) {
        const droppedDelta = platformDroppedFrames - this.lastSample.kpc;
        this.recordDroppedFrames(height, droppedDelta);
        this.updateDroppedFrameStats(height, droppedDelta);
      }

      this.lastSample = {
        time: currentTimeMs,
        kpc: platformDroppedFrames,
        height: height,
      };

      if (this.playerState.viewableContext) {
        this.playerState.viewableContext.mXc(this.qualityInfo);
      }
    };

    /**
     * Returns average dropped frames per resolution across all observed heights.
     * @returns {Object.<number, number>} Map of resolution height to average dropped frames
     */
    this.getAverageDroppedFrames = () => {
      const result = {};
      if (this.droppedFrameDistributions) {
        this.observedHeights.forEach((height) => {
          const distribution = this.droppedFrameDistributions[height];
          if (distribution) {
            let totalDropped = 0;
            let totalSamples = 0;
            forEachProperty(distribution, (count, occurrences) => {
              totalDropped += parseInteger(count);
              totalSamples += occurrences;
            });
            result[height] = totalDropped / totalSamples;
          }
        });
      }
      return result;
    };

    /**
     * Returns percentile-based dropped frame statistics at given thresholds.
     * @param {Array<number>} percentiles - List of percentile boundaries
     * @returns {Object.<number, Object.<number, number>>} Percentile -> height -> value
     */
    this.getDroppedFramePercentiles = (percentiles) => {
      const result = {};
      percentiles.forEach((p) => {
        result[p] = {};
      });

      if (this.droppedFrameDistributions) {
        sortNumericAscending(percentiles);
        this.observedHeights.forEach((height) => {
          const distribution = this.droppedFrameDistributions[height];
          if (distribution) {
            let totalSamples = 0;
            let cumulativeCount = 0;
            forEachProperty(distribution, (count, occurrences) => {
              totalSamples += occurrences;
            });

            const sortedCounts = Object.keys(distribution).map(Number);
            sortNumericAscending(sortedCounts);

            for (
              let i = sortedCounts.length - 1, currentCount = sortedCounts[i], pi = percentiles.length - 1;
              pi >= 0;
              pi--
            ) {
              const threshold = percentiles[pi];
              while (currentCount >= threshold && i >= 0) {
                const freq = distribution[currentCount];
                if (freq) cumulativeCount += freq;
                currentCount = sortedCounts[--i];
              }
              result[threshold][height] = totalTime((cumulativeCount / totalSamples) * 100);
            }
          }
        });
      }
      return result;
    };

    /**
     * Listener for resolution restriction release.
     * When restriction is cleared, notifies the player state.
     * @private
     */
    this.onRestrictionChanged = (event) => {
      if (event.oldValue === false && event.newValue === true) {
        this.playerState.lza();
        this.isRestricted.set(false);
      }
    };

    // Initialize sub-logger
    this.log = this.logger.createSubLogger("DFF", playerState);

    // Load configuration
    this.droppedFrameThresholds = configProvider().opc;
    this.maxObservationCount = configProvider().droppedFrameRateFilterMaxObservation;
    this.minHeightThreshold = configProvider().droppedFrameRateFilterMinHeight;

    // Register reporters on subscriber list
    this.subscriberList.droppedFrameReporter = {
      XUa: this.getAverageDroppedFrames,
      gca: this.getDroppedFramePercentiles,
    };

    // Observable for whether resolution is currently restricted
    this.isRestricted = new ObservableValue(false, this.onRestrictionChanged);

    // Listen for state changes to start/stop polling
    playerState.state.addListener(this.onStateChanged);
    playerState.presentingState.addListener(this.onStateChanged);
    playerState.addEventListener(PlayerEvents.ZM, this.onStateChanged);
  }

  /**
   * Checks whether a given quality level should be filtered due to dropped frames.
   * @param {Object} qualityLevel - Quality level with height and lower properties
   * @returns {boolean} True if this quality should be excluded
   */
  nJ(qualityLevel) {
    return qualityLevel.lower && qualityLevel.height > this.minHeightThreshold
      ? qualityLevel.height >= this.getDroppedFrameThreshold()
      : false;
  }

  /**
   * Records a dropped frame count for a given resolution height.
   * Maintains a ring buffer of the last N observations.
   * @param {number} height - Video resolution height
   * @param {number} droppedCount - Number of dropped frames in this interval
   */
  recordDroppedFrames(height, droppedCount) {
    let history = this.qualityInfo[height];
    if (!history) {
      this.qualityInfo[height] = history = [];
      if (height > this.minHeightThreshold) {
        this.observedHeights.push(height);
        sortNumericAscending(this.observedHeights);
      }
    }
    if (droppedCount > 0 && !(this.highestDropHeight && this.highestDropHeight < height)) {
      this.highestDropHeight = height;
    }
    history.push(droppedCount);
    if (history.length > this.maxObservationCount) {
      history.shift();
    }
  }

  /**
   * Updates the dropped frame distribution histogram for a given resolution.
   * @param {number} height - Video resolution height
   * @param {number} droppedCount - Number of dropped frames
   */
  updateDroppedFrameStats(height, droppedCount) {
    let distribution = this.droppedFrameDistributions[height];
    if (!distribution) {
      this.droppedFrameDistributions[height] = distribution = {};
    }
    const existing = distribution[droppedCount];
    distribution[droppedCount] = existing ? existing + 1 : 1;
  }

  /**
   * Evaluates whether to restrict resolution based on dropped frame history.
   * Scans observed heights from lowest to the current max, checking if any
   * height's dropped frame pattern exceeds the configured thresholds.
   * @returns {number} The maximum allowed resolution height
   */
  getDroppedFrameThreshold() {
    if (this.highestDropHeight) {
      for (let i = 0, len = this.observedHeights.length; i < len; i++) {
        const height = this.observedHeights[i];
        if (height >= this.highestDropHeight && height < this.maxAllowedHeight) {
          const history = this.qualityInfo[height];
          if (history && this.exceedsThreshold(this.droppedFrameThresholds, history) && this.maxAllowedHeight !== height) {
            this.log.RETRY("Restricting resolution due to high number of dropped frames", {
              MaxHeight: height,
            });
            this.subscriberList.fw.set({
              reason: "droppedFrames",
              height: height,
            });
            this.isRestricted.set(true);
            return (this.maxAllowedHeight = height);
          }
        }
      }
      this.highestDropHeight = undefined;
    }
    return this.maxAllowedHeight;
  }

  /**
   * Checks if the dropped frame history exceeds any configured threshold pair.
   * Each threshold is [requiredCount, minDroppedFrames]: if at least `requiredCount`
   * samples have >= `minDroppedFrames` drops, the threshold is exceeded.
   * @param {Array<Array<number>>} thresholds - Array of [count, minDrops] pairs
   * @param {Array<number>} history - Recent dropped frame observations
   * @returns {boolean} True if any threshold is exceeded
   * @private
   */
  exceedsThreshold(thresholds, history) {
    for (let i = 0, tLen = thresholds.length; i < tLen; i++) {
      let requiredCount = thresholds[i][0];
      const minDroppedFrames = thresholds[i][1];
      for (let j = 0, hLen = history.length; j < hLen; j++) {
        if (history[j] >= minDroppedFrames && --requiredCount <= 0) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * @returns {string} Filter key identifier
   */
  get xra() {
    return "df";
  }
}

export { DroppedFrameFilter };
