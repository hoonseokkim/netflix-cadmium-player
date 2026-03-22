/**
 * Netflix Cadmium Player — Pace-Rate Selector
 *
 * Controls download pacing so that the player does not fetch segments faster
 * than necessary.  Supports several pacing strategies:
 *
 * - **maxStreamBitrate** – pace at the peak bitrate of the selected stream.
 * - **static**           – pace at a fixed rate (`staticPacingRateKbps`).
 * - **none**             – no pacing (returns 0).
 * - **regression**       – polynomial-regression model that interpolates
 *                          pacing coefficients as a function of buffer
 *                          fullness.
 * - **epsGreedy**        – `min(regression, observedThroughput)`.
 *
 * Two "modes" wrap the chosen algorithm:
 *
 * - **HYBRID** – server-side CSPR with a client-side fallback.
 * - **CCSP**   – pure client-controlled server pacing.
 *
 * @module PacerateSelector
 */

// Dependencies
// import { platform }            from './modules/Module_66164.js';
// import { MediaType, OP }       from './modules/Module_65161.js';
// import { GX as PacingResult }  from './modules/Module_29217.js';

// ---------------------------------------------------------------------------
// Utility helpers (module-private)
// ---------------------------------------------------------------------------

/**
 * Returns the max bitrate of a stream's media type from the viewable session.
 *
 * @param {Object} stream
 * @returns {number}
 */
const getMaxStreamBitrate = (stream) => {
  return getMaxBitrateFromSession(stream.mediaSource);
};

/**
 * Reads the max average bitrate for a stream from the viewable session's
 * bitrate map.
 *
 * @param {Object|null} stream
 * @returns {number}
 */
const getMaxBitrateFromSession = (stream) => {
  const bitrateMap = stream?.viewableSession?.aN;
  return bitrateMap ? bitrateMap[stream.mediaType] || 0 : 0;
};

/**
 * Returns the average bitrate of a stream (or 0).
 *
 * @param {Object|null} stream
 * @returns {number}
 */
const getAverageBitrate = (stream) => {
  return stream?.bitrate || 0;
};

/**
 * Returns the observed throughput from a stream's throughput estimator.
 *
 * @param {Object} stream
 * @returns {number}
 */
const getObservedThroughput = (stream) => {
  const config = stream.getConfig;
  return config?.bufferLength?.average || 0;
};

/**
 * Returns the mean throughput from the normalised-media-type estimator.
 *
 * @param {Object} stream
 * @returns {number}
 */
const getMeanThroughput = (stream) => {
  const config = stream.getConfig;
  return config?.normalizeMediaType?.gZ || 0;
};

/**
 * Returns the standard deviation of throughput from the normalised estimator.
 *
 * @param {Object} stream
 * @returns {number}
 */
const getStdDevThroughput = (stream) => {
  const config = stream.getConfig;
  return Math.sqrt(config?.normalizeMediaType?.q5 || 0);
};

/**
 * Computes a target buffer level (in ms) based on a ratio of estimated
 * throughput to observed throughput, with multiplicative std-dev headroom.
 *
 * @param {Object} config - Pace-rate configuration subset.
 * @param {Object} stream
 * @returns {number} Target buffer level in ms.
 */
const computeTargetBufferLevel = (config, stream) => {
  const multiplier = config.targetBufferLevelStddevMultiplier;
  const estimatedThroughput = getMeanThroughput(stream) + multiplier * getStdDevThroughput(stream);
  const observedThroughput = stream.bufferLength || 0;

  let ratio = 0;
  if (observedThroughput > 0) {
    ratio = estimatedThroughput / observedThroughput - 1;
  }

  return config.minTargetBufferLevelMs + config.targetBufferLevelDurationMs * Math.max(0, ratio);
};

/**
 * Returns the effective fragment bitrate for a given stream at a given
 * playback position.
 *
 * @param {Object|undefined} downloadHint
 * @param {Object} stream
 * @param {number} startPosition
 * @returns {number}
 */
const getFragmentBitrate = (downloadHint, stream, startPosition) => {
  if (!stream) return 0;
  if (startPosition !== undefined && stream.fragmentIndex) {
    const fragmentBitrate = downloadHint === undefined
      ? stream.fragmentIndex?.key(startPosition).CPa
      : downloadHint.ZBb(stream, startPosition).CPa;
    return fragmentBitrate || stream.endedChangedEvent || 0;
  }
  return stream.endedChangedEvent || 0;
};

/**
 * Filters pacing coefficient sets by player state (cprStreamId) and
 * throughput-confidence level, then sorts by buffer-fullness threshold.
 *
 * @param {Object[]} coefficients - All pacing-coefficient entries.
 * @param {number} playerState - Current player phase id.
 * @param {number} confidenceLevel - Throughput estimator confidence.
 * @returns {Object[]} Sorted, filtered coefficient set.
 */
const filterPacingCoefficients = (coefficients, playerState, confidenceLevel) => {
  const matchesArray = (arr, value) => {
    return arr !== undefined && arr.filter((item) => item === value).length > 0;
  };

  // First filter by player state
  let filtered = coefficients.filter((entry) => matchesArray(entry.cya, playerState));
  if (filtered.length === 0) {
    filtered = coefficients.filter((entry) => !entry.cya || entry.cya.length === 0);
  }

  // Then filter by confidence level
  let result = filtered.filter((entry) => matchesArray(entry.MKb, confidenceLevel));
  if (result.length === 0) {
    result = filtered.filter((entry) => !entry.MKb || entry.MKb.length === 0);
  }

  return result.sort((a, b) => a.internal_Roa - b.internal_Roa);
};

/**
 * Evaluates a polynomial pacing-rate model against the current stream state.
 *
 * The model takes a set of named coefficients and multiplies each by the
 * corresponding stream metric (selected bitrate, upswitch bitrate, buffer
 * level, throughput, etc.).
 *
 * @param {Object} streamState - Current stream state.
 * @param {Object} coefficientMap - Coefficient name → multiplier.
 * @returns {number} Computed pacing rate in kbps.
 */
const evaluatePacingModel = (streamState, coefficientMap) => {
  if (!coefficientMap || typeof coefficientMap !== "object") return 0;

  const stream = streamState.mediaSource;
  const upswitchStream = streamState.vBa;
  const maxStream = streamState.fBa;

  const features = {
    selectedFragmentBitrate: getFragmentBitrate(streamState.UH, stream, streamState.startPosition) * streamState.playbackRate,
    selectedPeakBitrate: (stream.endedChangedEvent || getAverageBitrate(stream) || 0) * streamState.playbackRate,
    upswitchPeakBitrate: (upswitchStream.endedChangedEvent || getAverageBitrate(upswitchStream) || 0) * streamState.playbackRate,
    maxPeakBitrate: (maxStream.endedChangedEvent || getAverageBitrate(maxStream) || 0) * streamState.playbackRate,
    selectedAverageBitrate: getAverageBitrate(stream) * streamState.playbackRate,
    upswitchAverageBitrate: getAverageBitrate(upswitchStream) * streamState.playbackRate,
    maxAverageBitrate: getMaxBitrateFromSession(stream) * streamState.playbackRate,
    bufferLevelMs: streamState.bufferLevelMs,
    observedThroughput: getObservedThroughput(streamState.mediaSource) || 0,
    averagetp: getMeanThroughput(streamState.mediaSource) || 0,
    stddevtp: getStdDevThroughput(streamState.mediaSource) || 0,
  };

  const offset = coefficientMap.offset || 0;

  return Object.keys(features).reduce(
    (sum, key) => sum + (coefficientMap[key] || 0) * features[key],
    offset,
  );
};

/**
 * Computes the regression-based pacing rate by interpolating between two
 * neighbouring coefficient sets that bracket the current buffer-fullness
 * ratio.
 *
 * @param {Object} streamState
 * @param {Object} config - Pace-rate configuration.
 * @returns {number} Pacing rate in kbps.
 */
const computeRegressionPacingRate = (streamState, config) => {
  const coefficients = filterPacingCoefficients(
    config.regressionAlgoPacingCoefficients,
    streamState.cprStreamId,
    streamState.mediaSource.getConfig?.confidence ?? OP.HAVE_NOTHING,
  );

  if (coefficients.length === 0) return 0;

  // Compute the buffer-fullness ratio
  let bufferFullness;
  switch (config.$Nc) {
    case "implicit": {
      const targetBuffer = computeTargetBufferLevel(config, streamState.mediaSource);
      bufferFullness = streamState.bufferLevelMs / targetBuffer;
      break;
    }
    case "capacityPercentage":
      bufferFullness = Math.max(
        streamState.internal_Dec / streamState.internal_Bec || 0,
        streamState.bufferLevelMs / config.maxMediaBufferAllowed,
      );
      break;
    default:
      bufferFullness = 0;
  }

  // Find the bracket
  let bracketIndex = -1;
  for (let i = 0; i < coefficients.length; i++) {
    if (coefficients[i].internal_Roa >= bufferFullness) {
      bracketIndex = i;
      break;
    }
  }

  // Beyond the last threshold → use last coefficient set
  if (bracketIndex === -1) {
    return evaluatePacingModel(streamState, coefficients[coefficients.length - 1].NQa);
  }

  // Below the first threshold → use first coefficient set
  if (bracketIndex === 0) {
    return evaluatePacingModel(streamState, coefficients[0].NQa);
  }

  // Linear interpolation between the two bracketing coefficient sets
  const lowerThreshold = coefficients[bracketIndex - 1].internal_Roa;
  const lowerRate = evaluatePacingModel(streamState, coefficients[bracketIndex - 1].NQa);
  const upperThreshold = coefficients[bracketIndex].internal_Roa;
  const upperRate = evaluatePacingModel(streamState, coefficients[bracketIndex].NQa);

  const alpha = Math.min((bufferFullness - lowerThreshold) / (upperThreshold - lowerThreshold), 1);
  return (1 - alpha) * lowerRate + alpha * upperRate;
};

// ---------------------------------------------------------------------------
// Algorithm registry
// ---------------------------------------------------------------------------

/**
 * Map of pacing-algorithm names to their implementations.
 * Each function has the signature `(streamState, config) => rateKbps`.
 */
const pacingAlgorithms = {
  maxStreamBitrate: getMaxStreamBitrate,

  static: (streamState, config) => config.staticPacingRateKbps,

  none: () => 0,

  regression: computeRegressionPacingRate,

  epsGreedy: (streamState, config) => {
    return Math.min(
      computeRegressionPacingRate(streamState, config) || 0,
      getObservedThroughput(streamState.mediaSource),
    );
  },

  default: getMaxStreamBitrate,
};

// ---------------------------------------------------------------------------
// Main class
// ---------------------------------------------------------------------------

/**
 * Pace-rate selector — decides how fast to download the next segment so
 * the player does not over-fetch beyond what is needed for smooth playback.
 */
export class ResolutionSelector {
  /**
   * @param {Object} config - ABR / pacing configuration.
   * @param {string} [mediaType] - The media type this selector is bound to
   *   (audio or video).  Determines which algorithm name is read from config.
   */
  constructor(config, mediaType) {
    /** @type {Object} */
    this.pacingConfig = config;

    // Resolve the algorithm function
    const algorithmName = mediaType === MediaType.V
      ? this.pacingConfig.paceRateSelectorAlgorithmAudio
      : this.pacingConfig.paceRateSelectorAlgorithm;

    /** @type {Function} Bound pacing algorithm */
    this.algorithm = (pacingAlgorithms[algorithmName] || pacingAlgorithms["default"]).bind(this);

    // Determine pacing mode (HYBRID vs CCSP)
    /** @type {string|undefined} */
    this.pacingMode = undefined;

    if (config.enableHybridPacing) {
      this.pacingMode = "HYBRID";
    } else if (config.enableCprVideo || config.enableCprAudio || config.enableConcurrentStreamingHandling) {
      this.pacingMode = "CCSP";
    }
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Computes the pacing result for a single pipelined or non-pipelined
   * download request.
   *
   * @param {Object} streamState - Current stream state including buffer level,
   *   media source, playback rate, etc.
   * @returns {PacingResult} Pacing instruction for the downloader.
   */
  computePacingRate(streamState) {
    const mediaType = streamState.mediaSource?.mediaType;

    const isPacingEnabled =
      this.pacingConfig.enableHybridPacing ||
      (mediaType === MediaType.V && this.pacingConfig.enableCprAudio) ||
      (mediaType === MediaType.U && this.pacingConfig.enableCprVideo);

    // Return zero-rate pacing result when pacing is disabled or conditions
    // are not met (e.g. buffer too low, unpaced fragment interval, etc.)
    const zeroPacingResult = this._buildPacingResult(0, streamState);

    const clientPacingParams = this.pacingConfig.clientPacingParams;

    if (
      !this.pacingMode ||
      !isPacingEnabled ||
      !clientPacingParams ||
      (this.pacingConfig.unpacedFragmentInterval &&
        streamState.startPosition &&
        streamState.startPosition % this.pacingConfig.unpacedFragmentInterval === 0) ||
      streamState.bufferLevelMs < clientPacingParams.minRequiredBuffer
    ) {
      return zeroPacingResult;
    }

    // Compute pacing rate using the selected algorithm
    const pacingRateKbps = streamState.pipelineEnabled
      ? this.algorithm(streamState, this.pacingConfig)
      : this._computeNonPipelinedRate(streamState);

    return this._buildPacingResult(pacingRateKbps, streamState);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Computes the pacing rate for non-pipelined requests.
   *
   * @param {Object} streamState
   * @returns {number} Rate in kbps.
   * @private
   */
  _computeNonPipelinedRate(streamState) {
    const mediaType = streamState.mediaSource?.mediaType;

    if (this.pacingMode === "HYBRID" && !this.pacingConfig.enableCsprNonPipelined) {
      return 0;
    }

    if (this.pacingMode === "CCSP") {
      const isAudioDisabled = mediaType === MediaType.V && !this.pacingConfig.enableCprAudioNonPipelined;
      const isVideoDisabled = mediaType === MediaType.U && !this.pacingConfig.enableCprVideoNonPipelined;

      if (isAudioDisabled || isVideoDisabled) {
        return 0;
      }
    }

    if (this.pacingConfig.paceRateSelectorAlgorithmNonPipelined === "static") {
      return this.pacingConfig.staticPacingRateKbps;
    }

    return getMaxBitrateFromSession(streamState.mediaSource);
  }

  /**
   * Builds a `PacingResult` object from the computed rate, applying
   * client-pacing-parameter scaling when in CCSP or HYBRID mode.
   *
   * @param {number} baseRateKbps - Raw pacing rate.
   * @param {Object} streamState - Current stream state.
   * @returns {PacingResult}
   * @private
   */
  _buildPacingResult(baseRateKbps, streamState) {
    const clientParams = this.pacingConfig.clientPacingParams;
    const peakBitrate = streamState.kva?.endedChangedEvent;
    const fragmentBitrate = getFragmentBitrate(streamState.UH, streamState.mediaSource, streamState.startPosition)
      * streamState.playbackRate;
    const fragmentIdFactors = clientParams?.fid || [0, 0, 0];

    let result;

    if (this.pacingMode === "CCSP" && clientParams) {
      result = new PacingResult(this.pacingMode, clientParams ? {
        CF: this._applyPacingScaling(baseRateKbps, clientParams.B3a[0], peakBitrate, fragmentBitrate, fragmentIdFactors[0]),
        QD: this._applyPacingScaling(baseRateKbps, clientParams.B3a[1], peakBitrate, fragmentBitrate, fragmentIdFactors[1]),
        sF: this._applyPacingScaling(baseRateKbps, clientParams.B3a[2], peakBitrate, fragmentBitrate, fragmentIdFactors[2]),
      } : {
        CF: 0,
        QD: 0,
        sF: 0,
      }, undefined);
    } else if (this.pacingMode === "HYBRID") {
      let scaledRate = baseRateKbps;
      if (this.pacingConfig.clientPacingParams) {
        scaledRate = this._applyPacingScaling(baseRateKbps, clientParams.B3a[0], peakBitrate, fragmentBitrate, fragmentIdFactors[0]);
      }

      result = new PacingResult(this.pacingMode, undefined, {
        PEb: 1,
        networkInfo: scaledRate,
        catchUpMode: Number(this.pacingConfig.catchUpMode),
        FJb: this.pacingConfig.maxSegHint,
        requestLevelLogging: Number(this.pacingConfig.requestLevelLogging),
      });
    } else {
      result = new PacingResult(this.pacingMode, undefined, undefined);
    }

    return result;
  }

  /**
   * Scales a raw pacing rate by a client-pacing divisor and applies a
   * minimum-threshold check.
   *
   * @param {number} rawRate
   * @param {number} divisor
   * @param {number} peakBitrate
   * @param {number} fragmentBitrate
   * @param {number} fragmentIdFactor
   * @returns {number}
   * @private
   */
  _applyPacingScaling(rawRate, divisor, peakBitrate, fragmentBitrate, fragmentIdFactor) {
    if (!divisor || rawRate === 0) return 0;

    let scaled = Math.ceil(rawRate / divisor);
    scaled = Math.max(scaled, Math.ceil(fragmentBitrate * fragmentIdFactor));

    const minThreshold = (this.pacingConfig.clientPacingParams.hid || 0) * (peakBitrate || 0);
    return scaled < minThreshold ? 0 : scaled;
  }
}

// ---------------------------------------------------------------------------
// Exported helpers (used by other ABR modules)
// ---------------------------------------------------------------------------

export { filterPacingCoefficients as internal_Lfd };
export { getObservedThroughput as $fd };
export { computeTargetBufferLevel as internal_Rfd };
