/**
 * Netflix Cadmium Player — Initial Stream Selector
 *
 * Selects the starting (initial) stream for playback based on either
 * VMAF-based quality selection or traditional bitrate-based selection.
 *
 * Two strategies are supported:
 *   1. VMAF-based: Uses VMAF quality scores, historical throughput digests,
 *      and configurable curve functions (logarithmic or sigmoid) to pick the
 *      highest-quality stream that can be delivered within the estimated
 *      throughput budget.
 *   2. Bitrate-based: Uses historical throughput and an initial bitrate
 *      selection curve to pick the best stream whose bitrate fits within
 *      the estimated download capacity.
 *
 * @module InitialStreamSelector
 */

// --- Dependency stubs (webpack imports in original) ---
// import * as typeUtils from '../utils/typeUtils';          // Module 17267 — wc, typeofChecker, isEmpty
// import { findIndex, findLast } from '../utils/array';     // Module 91176 — hn, findLast
// import { MediaType } from '../media/MediaType';           // Module 65161
// import { TDigestHistogram } from '../stats/TDigest';      // Module 88318 — rmb.syc
// import { sigmoid } from '../utils/math';                  // Module 65167 — ZYc (sigmoid function)
// import {
//   constrainValue,
//   StreamSelectorClass,
//   kbpsToBytes,
//   convertBpsToKbps,
// } from './StreamSelector';                                // Module 13550

import * as typeUtils from '../utils/typeUtils.js';
import { findIndex, findLast } from '../utils/array.js';
// import { MediaType } from '../media/MediaType.js';
// import { TDigestHistogram } from '../stats/TDigest.js';
// import { sigmoid } from '../utils/math.js';
import {
  constrainValue,
  StreamSelectorClass,
  kbpsToBytes,
  convertBpsToKbps,
} from './StreamSelector.js';

/**
 * Reference to the sigmoid function from the math utilities.
 * Used in VMAF target calculation with sigmoid-based curves.
 * @type {(x: number) => number}
 */
// const sigmoid = mathUtils.ZYc;

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

/** Maximum throughput value (in kbps) before normalization. */
const MAX_THROUGHPUT_KBPS = 100000;

/** Divisor to normalize throughput from kbps to Mbps. */
const THROUGHPUT_NORMALIZATION_DIVISOR = 1000;

/* ------------------------------------------------------------------ */
/*  Private helper functions                                          */
/* ------------------------------------------------------------------ */

/**
 * Calculates the VMAF delay target (in ms) from the estimated throughput
 * using the configured curve method.
 *
 * Supported methods (prefixes):
 *   - "log*"     — logarithmic curve:  1000 * (a + b * ln(1 + throughput))
 *   - "sigmoid*" — sigmoid curve:      1000 * (a + b * sigmoid(throughput))
 *
 * Falls back to the default starting bitrate (`config.$s`) if the method
 * is unrecognized or the curve coefficients are missing.
 *
 * @param {number} estimatedThroughput - Estimated throughput in kbps.
 * @param {Object} config - ABR configuration object.
 * @param {string} config.selectStartingVMAFMethod - Curve method name.
 * @param {Object} config.selectStartingVMAFMethodCurve - Map of method name to [a, b] coefficients.
 * @param {number} config.$s - Default starting bitrate fallback.
 * @returns {number} VMAF delay target in milliseconds.
 */
function calculateVmafDelayTarget(estimatedThroughput, config) {
  // Normalize throughput: constrain to [0, MAX_THROUGHPUT_KBPS] then convert to Mbps
  const normalizedThroughput =
    constrainValue(estimatedThroughput, 0, MAX_THROUGHPUT_KBPS) /
    THROUGHPUT_NORMALIZATION_DIVISOR;

  const method = config.selectStartingVMAFMethod;

  // Logarithmic curve: method starts with "log"
  if (method.lastIndexOf('log', 0) === 0) {
    const curveCoefficients = config.selectStartingVMAFMethodCurve[method];
    if (curveCoefficients && curveCoefficients.length === 2) {
      const [intercept, slope] = curveCoefficients;
      return 1000 * (intercept + slope * Math.log(1 + normalizedThroughput));
    }
    return config.$s;
  }

  // Sigmoid curve: method starts with "sigmoid"
  if (method.lastIndexOf('sigmoid', 0) === 0) {
    const curveCoefficients = config.selectStartingVMAFMethodCurve[method];
    if (curveCoefficients && curveCoefficients.length === 2) {
      const [intercept, slope] = curveCoefficients;
      // sigmoid() is the imported ZYc function from Module 65167
      return 1000 * (intercept + slope * sigmoid(normalizedThroughput));
    }
    return config.$s;
  }

  // Unrecognized method — use default
  return config.$s;
}

/**
 * Interpolates a bitrate from the initial bitrate selection curve based
 * on the effective bitrate at the current throughput.
 *
 * The curve is an array of `{ r: throughputThreshold, d: bitrateTarget }`
 * points sorted by `r` in ascending order.
 *
 * @param {Object} config - ABR configuration.
 * @param {Array<{r: number, d: number}>} config.initialBitrateSelectionCurve
 * @param {number} config.$s - Default starting bitrate fallback.
 * @param {number} effectiveBitrate - The effective bitrate to look up.
 * @returns {number} Interpolated bitrate target (floored).
 */
function interpolateBitrateFromCurve(config, effectiveBitrate) {
  if (!config.initialBitrateSelectionCurve) {
    return config.$s;
  }

  const curve = config.initialBitrateSelectionCurve;
  const index = findIndex(curve, (point) => effectiveBitrate <= point.r);

  // Below the lowest threshold — return the minimum bitrate
  if (index === 0) {
    return curve[0].d;
  }

  // Above the highest threshold — return the maximum bitrate
  if (index === -1) {
    return curve[curve.length - 1].d;
  }

  // Between two curve points — linearly interpolate
  const lowerPoint = curve[index - 1];
  const upperPoint = curve[index];
  return Math.floor(
    lowerPoint.d +
      ((upperPoint.d - lowerPoint.d) *
        (effectiveBitrate - lowerPoint.r)) /
        (upperPoint.r - lowerPoint.r)
  );
}

/**
 * Checks whether a stream meets the minimum initial bitrate requirements.
 *
 * @param {Object} stream - Stream descriptor with optional `videoBitrateKbps` and `cw` (audio bitrate).
 * @param {Object} config - ABR configuration with `minInitVideoBitrate` and `minInitAudioBitrate`.
 * @returns {boolean} True if both audio and video bitrates meet minimums.
 */
function meetsMinimumBitrate(stream, config) {
  const videoOk = stream.videoBitrateKbps
    ? stream.videoBitrateKbps >= config.minInitVideoBitrate
    : true;
  const audioOk = stream.cw
    ? stream.cw >= config.minInitAudioBitrate
    : true;
  return audioOk && videoOk;
}

/**
 * Looks up a profile-specific override from a list of audio profile overrides.
 *
 * @param {string} profileName - The audio profile name to search for.
 * @param {Array<{profiles: string[], override: Object}>} overrideList - Override definitions.
 * @returns {Object|undefined} The matching override, or undefined.
 */
function findAudioProfileOverride(profileName, overrideList) {
  let matchedOverride;
  overrideList.some((entry) => {
    const profiles = entry.profiles;
    const found = profiles && profiles.indexOf(profileName) >= 0;
    if (found) {
      matchedOverride = entry.override;
    }
    return found;
  });
  return matchedOverride;
}

/**
 * Checks whether a stream's bitrates are below the maximum initial bitrate limits,
 * considering audio profile overrides.
 *
 * @param {Object} stream - Stream descriptor.
 * @param {Object} config - ABR configuration.
 * @returns {boolean} True if the stream is within the maximum initial bitrate limits.
 */
function isWithinMaxBitrateLimits(stream, config) {
  // Determine the effective max audio bitrate based on profile overrides
  let audioProfile = stream.getStreamsByType(/* MediaType.VIDEO */ 'V');
  if (audioProfile) {
    const profileName = audioProfile.profileName;
    audioProfile =
      config &&
      config.switchableAudioProfiles &&
      config.switchableAudioProfiles.indexOf(profileName) >= 0
        ? findAudioProfileOverride(profileName, config.switchableAudioProfilesOverride)
        : findAudioProfileOverride(profileName, config.audioProfilesOverride);
  } else {
    audioProfile = undefined;
  }

  const maxAudioBitrate = audioProfile
    ? audioProfile.maxInitAudioBitrate ?? config.$u
    : config.$u;

  const videoWithinLimit = stream.videoBitrateKbps
    ? stream.videoBitrateKbps <= config.maxInitVideoBitrate
    : true;
  const audioWithinLimit = stream.cw ? stream.cw <= maxAudioBitrate : true;

  return audioWithinLimit && videoWithinLimit;
}

/**
 * Estimates the historical throughput for a stream and creates a
 * StreamSelector result object.
 *
 * Uses the TDigest histogram from the metadata's notification list to
 * estimate throughput at a given quantile. Falls back to the stream's
 * raw `bufferLength` throughput if the digest is unavailable.
 *
 * @param {Object} stream - The stream descriptor.
 * @param {Object} config - ABR configuration.
 * @param {number} [config.selectStartingVMAFTDigest] - Quantile percentile (0-100) for TDigest estimation.
 * @returns {Object} StreamSelector result with `mediaSource`, `selectedStreamReason`, and `reason`.
 */
function estimateHistoricalThroughput(stream, config) {
  const result = new StreamSelectorClass();
  result.mediaSource = stream;

  const streamConfig = result.mediaSource.getConfig;
  result.getConfig = streamConfig;

  let estimatedThroughput = 0;
  const notificationList = streamConfig?.notificationList;

  // Attempt to build a TDigest quantile function from historical data
  let hasDigest =
    typeUtils.wc(config.selectStartingVMAFTDigest) &&
    config.selectStartingVMAFTDigest >= 0 &&
    config.selectStartingVMAFTDigest <= 100 &&
    notificationList;

  if (hasDigest) {
    // TDigestHistogram.syc() builds a quantile function from serialized data
    const quantileFn = TDigestHistogram.rmb.syc(notificationList);
    if (typeUtils.typeofChecker(quantileFn)) {
      notificationList.kk = quantileFn;
      hasDigest = true;
    } else {
      hasDigest = false;
    }
  }

  if (hasDigest && notificationList.kk) {
    // Use TDigest quantile estimation at the configured percentile
    estimatedThroughput =
      notificationList.kk(config.selectStartingVMAFTDigest / 100) ||
      result.mediaSource.bufferLength;
    result.reason = 'hist_tdigest';
  } else if (result.mediaSource.bufferLength) {
    // Fall back to raw historical throughput
    estimatedThroughput = result.mediaSource.bufferLength;
    result.reason = 'hist_throughput';
  }

  result.selectedStreamReason = estimatedThroughput;
  return result;
}

/**
 * Computes the minimum required download speed (in kbps) for a stream,
 * given the prebuffer and media rate configuration.
 *
 * @param {number} bitrateTimesPlaybackRate - Stream bitrate multiplied by playback rate.
 * @param {number} estimatedThroughput - Estimated throughput.
 * @param {Object} config - ABR configuration.
 * @param {number} config.minPrebufSize - Minimum prebuffer size.
 * @param {number} config.mediaRate - Media rate multiplier.
 * @returns {number} Required download speed in kbps.
 */
function computeRequiredDownloadSpeed(bitrateTimesPlaybackRate, estimatedThroughput, config) {
  const requiredBytes = kbpsToBytes(config.minPrebufSize, bitrateTimesPlaybackRate * config.mediaRate);
  return convertBpsToKbps(requiredBytes, estimatedThroughput);
}

/**
 * Validates whether a candidate stream is acceptable for initial selection.
 *
 * Checks both the quality constraint (VMAF range or bitrate range) and
 * the throughput constraint (VMAF delay target or bitrate delay target).
 *
 * @param {Object} stream - Stream descriptor.
 * @param {number} estimatedThroughput - Estimated throughput value.
 * @param {boolean} useVmaf - Whether VMAF-based selection is active.
 * @param {number} requiredDownloadSpeed - Minimum required download speed in kbps.
 * @param {number} vmafDelayTarget - VMAF delay target in milliseconds.
 * @param {Object} config - ABR configuration.
 * @returns {{ accepted: boolean, reason?: string }} Validation result.
 */
function validateStreamCandidate(stream, estimatedThroughput, useVmaf, requiredDownloadSpeed, vmafDelayTarget, config) {
  // Check throughput feasibility: delay target must accommodate the required download speed
  const throughputOk = vmafDelayTarget >= requiredDownloadSpeed;

  // Check quality constraints
  const qualityOk = useVmaf
    ? stream.vmaf >= config.minStartingVideoVMAF && stream.vmaf <= config.maxStartingVideoVMAF
    : meetsMinimumBitrate(stream, config) && isWithinMaxBitrateLimits(stream, config);

  const accepted = throughputOk && qualityOk;

  if (accepted) {
    return { accepted };
  }

  // Provide a rejection reason
  let reason;
  if (!qualityOk) {
    reason = useVmaf ? 'no_valid_VMAF' : 'no_valid_Bitrate';
  } else {
    reason = 'no_valid_DelayTarget';
  }

  return { accepted, reason };
}

/* ------------------------------------------------------------------ */
/*  Main selection strategies                                         */
/* ------------------------------------------------------------------ */

/**
 * VMAF-based initial stream selection.
 *
 * Iterates the stream list from highest to lowest quality, checking each
 * stream against VMAF constraints and throughput feasibility. Returns the
 * best acceptable stream, or falls back to the lowest-bitrate stream.
 *
 * @param {Object} config - ABR configuration.
 * @param {Object} player - Player state (provides `playbackRate`).
 * @param {Object[]} streams - Available streams sorted by quality (ascending).
 * @param {Object} [metadataResult] - Metadata for historical throughput estimation.
 * @returns {Object} StreamSelector result for the chosen stream.
 */
function selectInitialStreamByVmaf(config, player, streams, metadataResult) {
  // Determine whether VMAF-based quality checks can be used
  const useVmaf =
    !!config.minStartingVideoVMAF &&
    !!config.maxStartingVideoVMAF &&
    streams.every((stream) => stream.vmaf && stream.vmaf <= 110);

  let selectedResult = null;

  // Walk from highest quality to lowest
  for (let i = streams.length - 1; i >= 0; i--) {
    // Skip streams that don't meet the minimum quality/bitrate threshold
    const meetsMinimum = useVmaf
      ? streams[i].vmaf >= config.minStartingVideoVMAF
      : meetsMinimumBitrate(streams[i], config);

    if (!meetsMinimum) {
      continue;
    }

    const candidateStream = streams[i];
    selectedResult = estimateHistoricalThroughput(candidateStream, config);

    const requiredSpeed = computeRequiredDownloadSpeed(
      candidateStream.bitrate * player.playbackRate,
      selectedResult.selectedStreamReason,
      config
    );
    const vmafTarget = calculateVmafDelayTarget(
      selectedResult.selectedStreamReason,
      config
    );

    const validation = validateStreamCandidate(
      candidateStream,
      selectedResult.selectedStreamReason,
      useVmaf,
      requiredSpeed,
      vmafTarget,
      config
    );

    selectedResult.Y0 = requiredSpeed;

    if (validation.accepted) {
      break;
    }

    // Not accepted — record the reason and try the next lower stream
    selectedResult.reason = validation.reason;

    // If this is the last iteration, selectedResult will be returned with the reason
    if (i === 0) {
      break;
    }
  }

  // Fallback: if no acceptable stream was found
  if (typeUtils.isEmpty(selectedResult) && !meetsMinimumBitrate(streams[streams.length - 1], config)) {
    // Even the lowest stream is below minimum bitrate
    selectedResult = estimateHistoricalThroughput(streams[streams.length - 1], config);
    selectedResult.reason = 'below_minInitVideoBitrate';
  }

  if (typeUtils.isEmpty(selectedResult)) {
    // Absolute fallback: pick the lowest-quality stream
    selectedResult = estimateHistoricalThroughput(streams[0], config);
    selectedResult.reason = 'fallback_no_acceptable_stream';
  }

  return selectedResult;
}

/**
 * Bitrate-based initial stream selection (non-VMAF path).
 *
 * Filters streams by maximum bitrate limits, then walks from highest to
 * lowest looking for the first stream whose bitrate fits within the
 * historical throughput estimate.
 *
 * @param {Object} config - ABR configuration.
 * @param {Object} player - Player state (provides `playbackRate`).
 * @param {Object[]} streams - Available streams sorted by quality (ascending).
 * @param {Object} [metadataResult] - Metadata for historical throughput estimation.
 * @returns {Object} StreamSelector result for the chosen stream.
 */
function selectInitialStreamByBitrate(config, player, streams, metadataResult) {
  const result = new StreamSelectorClass();
  const minBitrateThreshold = Math.max(config.minInitVideoBitrate, config.minAcceptableVideoBitrate);

  // Filter to streams within max bitrate limits, then reverse so we iterate high-to-low
  const eligibleStreams = streams
    .filter((stream) => isWithinMaxBitrateLimits(stream, config))
    .reverse();

  result.mediaSource =
    findLast(eligibleStreams, (candidateStream) => {
      const historicalThroughput = candidateStream.bufferLength;

      if (candidateStream.bitrate <= minBitrateThreshold) {
        // Stream is at or below the minimum — check if historical throughput supports it
        if (!historicalThroughput) {
          result.reason = 'no_historical_lte_minbitrate';
          return true; // Accept it (best we can do)
        }

        const effectiveBitrate = candidateStream.bitrate * player.playbackRate;
        if (historicalThroughput && effectiveBitrate <= historicalThroughput) {
          result.selectedStreamReason = historicalThroughput;
          result.reason = 'lt_hist_lte_minbitrate';
          return true;
        }

        // Historical throughput insufficient
        result.selectedStreamReason = historicalThroughput;
        result.reason = 'hist_tput_lt_minbitrate';
        return false;
      }

      // Stream is above minimum bitrate threshold
      const effectiveBitrate = candidateStream.bitrate * player.playbackRate;

      if (!historicalThroughput) {
        // No historical data available
        return false;
      }

      // Check whether the stream can be buffered within the delay target
      const delayTarget = interpolateBitrateFromCurve(config, effectiveBitrate);
      const requiredSpeed = computeRequiredDownloadSpeed(
        effectiveBitrate,
        historicalThroughput,
        config
      );

      if (requiredSpeed <= delayTarget) {
        result.selectedStreamReason = historicalThroughput;
        result.reason = 'hist_bufftime';
        return true;
      }

      return false;
    }) || streams[0];

  return result;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                        */
/* ------------------------------------------------------------------ */

/**
 * Selects the initial stream for playback.
 *
 * Routes to either VMAF-based or bitrate-based selection depending on
 * the `activateSelectStartingVMAF` configuration flag.
 *
 * @param {Object} params
 * @param {Object} params.config - ABR configuration.
 * @param {Object} params.player - Player state (provides `playbackRate`).
 * @param {Object} params.metadataResult - Metadata for historical throughput.
 * @param {Object} params.el - Element container; `el.first` holds the stream list.
 * @returns {Object} StreamSelector result for the chosen starting stream.
 */
export function selectInitialStream(params) {
  const { config, player, metadataResult } = params;
  const streams = params.el.first;

  if (config.activateSelectStartingVMAF) {
    return selectInitialStreamByVmaf(config, player, streams, metadataResult);
  }
  return selectInitialStreamByBitrate(config, player, streams, metadataResult);
}

/**
 * Validates whether a candidate stream is acceptable for initial selection.
 * Exported as a public utility for use by other ABR modules.
 *
 * @see validateStreamCandidate
 */
export const validateInitialStreamCandidate = validateStreamCandidate;
