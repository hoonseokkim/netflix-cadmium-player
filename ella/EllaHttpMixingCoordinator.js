/**
 * Netflix Cadmium Player - Ella HTTP Mixing Coordinator
 *
 * Coordinates between Ella (low-latency streaming transport) and
 * traditional HTTP segment fetching for hybrid delivery mode.
 *
 * In mixing mode, HTTP is used to catch up to the Ella live position,
 * then Ella takes over for real-time delivery. This coordinator decides
 * when each transport should be active based on proximity thresholds.
 *
 * @module ella/EllaHttpMixingCoordinator
 */

/**
 * Coordinates HTTP and Ella streaming pipelines for hybrid delivery.
 *
 * Decision methods return objects with:
 * - `shouldProceed` (boolean): whether the operation should proceed
 * - `reason` (string): human-readable explanation
 * - `context` (object, optional): diagnostic data for logging
 */
export class EllaHttpMixingCoordinator {
  /**
   * @param {Object} config - Player configuration.
   * @param {boolean} config.liveIsEllaEnabled - Whether Ella is enabled.
   * @param {boolean} config.liveIsEllaHttpMixingEnabled - Whether HTTP mixing is enabled.
   * @param {number} config.liveEllaProximityThresholdMs - Distance threshold for switching.
   * @param {Object} console - Logging console.
   */
  constructor(config, console) {
    /** @type {Object} */
    this.config = config;
    /** @type {Object} */
    this.console = console;
  }

  /**
   * Determines whether an HTTP header request should proceed.
   *
   * @param {Object} headerState - Header download state.
   * @param {boolean} headerState.headerReceived - Whether the header has been received.
   * @param {Object} pipelineState - Pipeline position state.
   * @param {number|undefined} pipelineState.ellaPosition - Ella streaming position (ms).
   * @param {number} pipelineState.httpPosition - Current HTTP pipeline position (ms).
   * @returns {{ shouldProceed: boolean, reason: string, context?: Object }}
   */
  shouldFetchHeader(headerState, pipelineState) {
    if (!headerState.headerReceived) {
      return { shouldProceed: true, reason: 'headerNotReceived' };
    }

    if (!this.config.liveIsEllaHttpMixingEnabled) {
      return { shouldProceed: false, reason: 'ellaNonMixingMode' };
    }

    const ellaPosition = pipelineState.ellaPosition;
    if (ellaPosition === undefined) {
      return { shouldProceed: true, reason: 'noEllaPositionDefined' };
    }

    const distance = ellaPosition - pipelineState.httpPosition;

    if (pipelineState.httpPosition < ellaPosition) {
      return {
        shouldProceed: true,
        reason: 'httpCatchingUp',
        context: {
          httpPosition: pipelineState.httpPosition,
          ellaPosition,
          distance,
        },
      };
    }

    return {
      shouldProceed: false,
      reason: 'ellaCaughtUp',
      context: {
        httpPosition: pipelineState.httpPosition,
        ellaPosition,
        distance,
      },
    };
  }

  /**
   * Determines whether an HTTP segment request should proceed.
   *
   * @param {Object} segment - The segment to fetch.
   * @param {Object} pipelineState - Pipeline position state.
   * @returns {{ shouldProceed: boolean, reason: string, context?: Object }}
   */
  shouldFetchSegment(segment, pipelineState) {
    const segmentStart = segment.presentationStartTime.playbackSegment;
    const segmentEnd = segment.segmentEndTime.playbackSegment;

    if (!this.config.liveIsEllaHttpMixingEnabled) {
      return {
        shouldProceed: true,
        reason: 'ellaNonMixingMode',
        context: { segmentIndex: segment.index, segmentEnd },
      };
    }

    const ellaPosition = pipelineState.ellaPosition;
    if (ellaPosition === undefined) {
      return {
        shouldProceed: true,
        reason: 'establishingEllaPosition',
        context: { segmentIndex: segment.index, segmentEnd },
      };
    }

    const distance = ellaPosition - pipelineState.httpPosition;
    const isBehind = pipelineState.httpPosition < segmentStart;
    const isAhead = pipelineState.httpPosition > segmentStart;

    if (isBehind || isAhead) {
      return {
        shouldProceed: false,
        reason: isBehind ? 'pipelineBehindElla' : 'pipelineAheadOfElla',
        context: {
          ellaPosition,
          segmentIndex: segment.index,
          segmentStart,
          segmentEnd,
          httpPosition: pipelineState.httpPosition,
          distance,
        },
      };
    }

    return {
      shouldProceed: true,
      reason: 'pipelineCaughtUpToElla',
      context: {
        ellaPosition,
        segmentIndex: segment.index,
        segmentEnd,
        httpPosition: pipelineState.httpPosition,
        distance,
      },
    };
  }

  /**
   * Determines whether Ella streaming should be started.
   * HTTP must be close enough to the Ella position.
   *
   * @param {Object} pipelineState - Pipeline position state.
   * @returns {{ shouldProceed: boolean, reason: string, context?: Object }}
   */
  shouldStartStreaming(pipelineState) {
    if (pipelineState.ellaPosition === undefined) {
      return { shouldProceed: false, reason: 'noEllaPosition' };
    }

    const distance = pipelineState.ellaPosition - pipelineState.httpPosition;
    const threshold = this.config.liveEllaProximityThresholdMs;

    if (distance <= threshold) {
      return {
        shouldProceed: true,
        reason: 'proximityThresholdReached',
        context: {
          distance,
          threshold,
          httpPosition: pipelineState.httpPosition,
          ellaPosition: pipelineState.ellaPosition,
        },
      };
    }

    return {
      shouldProceed: false,
      reason: 'tooFarFromElla',
      context: {
        distance,
        threshold,
        httpPosition: pipelineState.httpPosition,
        ellaPosition: pipelineState.ellaPosition,
      },
    };
  }

  /**
   * Determines whether Ella streaming should be stopped.
   * HTTP has fallen too far behind Ella (2x proximity threshold).
   *
   * @param {Object} pipelineState - Pipeline position state.
   * @returns {{ shouldProceed: boolean, reason: string, context?: Object }}
   */
  shouldStopStreaming(pipelineState) {
    if (pipelineState.ellaPosition === undefined) {
      return { shouldProceed: false, reason: 'noEllaPosition' };
    }

    const distance = pipelineState.ellaPosition - pipelineState.httpPosition;
    const threshold = 2 * this.config.liveEllaProximityThresholdMs;

    if (distance > threshold) {
      return {
        shouldProceed: true,
        reason: 'tooFarBehindElla',
        context: {
          distance,
          threshold,
          httpPosition: pipelineState.httpPosition,
          ellaPosition: pipelineState.ellaPosition,
        },
      };
    }

    return {
      shouldProceed: false,
      reason: 'withinStopThreshold',
      context: {
        distance,
        threshold,
        httpPosition: pipelineState.httpPosition,
        ellaPosition: pipelineState.ellaPosition,
      },
    };
  }
}
