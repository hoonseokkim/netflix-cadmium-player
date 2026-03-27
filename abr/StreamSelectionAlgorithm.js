/**
 * Netflix Cadmium Player — ABR Stream Selection Algorithm
 *
 * Core ABR stream selection algorithm containing three standalone functions:
 *
 * - `refresh` — main entry point that evaluates all candidate streams and
 *   selects the best quality level given current buffer, throughput, and
 *   configuration constraints.
 * - `simulateFeasibility` — runs a buffer simulation for a candidate stream
 *   to determine whether switching to it is feasible without rebuffering.
 * - `calculateSimulationDuration` — computes how long the buffer simulation
 *   should run based on current buffer fill level and stream bitrate.
 *
 * @module StreamSelectionAlgorithm
 */

import * as numberUtils from './InitialStreamSelector.js';  // number utilities (wc = isFiniteNumber)
import { assert, hn as findIndex, cPa as findLast } from '../core/AsejsEngine.js'; // assert & array helpers
import { buildFunction } from '../streaming/AseStream.js'; // fragment index builder
import { StreamSelectorClass } from './StreamSelector.js'; // stream selector result
import runBufferSimulation from '../modules/Module_62737.js'; // buffer simulation runner
import { playerPhase } from '../core/AsejsEngine.js'; // player state enum
import { internal_Glb as SegmentSizeAccumulator } from '../modules/Module_20880.js'; // segment size accumulator

/**
 * Computes how long a buffer simulation should run based on the current
 * buffer fill level and the candidate stream's bitrate.
 *
 * When the buffer is empty, returns `config.minSimulationDuration`.
 * Otherwise, scales the duration between min and max based on how much
 * of the buffer capacity is filled relative to the drain rate.
 *
 * @param {Object} config - ABR configuration object.
 * @param {number} config.minSimulationDuration - Floor for simulation duration.
 * @param {number} config.maxSimulationDuration - Ceiling for simulation duration.
 * @param {number} config.simulationFullBufferPercentage - Target fill fraction.
 * @param {number} config.maxMediaBufferAllowed - Maximum media buffer in seconds.
 * @param {number} config.miniModalHorizontalLowestWaterMarkLevel - Low watermark offset.
 * @param {number} throughputBps - Current measured throughput in bits per second.
 * @param {Object} stream - The candidate stream descriptor.
 * @param {number} stream.bufferLength - Buffer capacity in bytes for this stream.
 * @param {number} stream.bitrate - Bitrate of this stream in bits per second.
 * @param {number} [stream.internal_Sha] - Alternate buffer length metric.
 * @returns {number} Duration in seconds the simulation should run.
 */
export function calculateSimulationDuration(config, throughputBps, stream) {
  if (!stream.bufferLength) {
    return config.minSimulationDuration;
  }

  const drainRatio = (stream.internal_Sha || stream.bufferLength) / stream.bufferLength;

  if (drainRatio <= 1) {
    return config.maxSimulationDuration;
  }

  // Scale duration: larger drain ratio means shorter simulation needed
  const maxBufferSeconds = Math.min(8 * throughputBps / stream.bitrate, config.maxMediaBufferAllowed);
  const targetFill = config.simulationFullBufferPercentage * maxBufferSeconds;
  const adjustedDuration = (targetFill - config.miniModalHorizontalLowestWaterMarkLevel) / (drainRatio - 1);

  return Math.min(
    Math.max(adjustedDuration, config.minSimulationDuration),
    config.maxSimulationDuration
  );
}

/**
 * Runs a buffer feasibility simulation for a candidate stream.
 *
 * Determines whether switching to the given stream is feasible by simulating
 * buffer behavior using upcoming segment sizes. Returns `false` early if the
 * stream's buffer capacity is too low relative to its bitrate, or if fragment
 * index data is unavailable.
 *
 * @param {Object} config - ABR configuration object.
 * @param {number} config.highStreamInfeasibleBitrateFactor - Factor for feasibility check.
 * @param {boolean} config.$da - Whether to cap simulation duration at buffered range.
 * @param {number} config.minRequiredBuffer - Minimum buffer to avoid rebuffer.
 * @param {Object[]} streams - Sorted array of available stream descriptors.
 * @param {Array<{stream: Object, blocks: number, startPosition: number}>} primarySegments -
 *   Segments from the primary (high) stream to include in simulation.
 * @param {Array<{stream: Object, blocks: number, startPosition: number}>} secondarySegments -
 *   Segments from the secondary (low/fallback) stream to include in simulation.
 * @param {Int32Array} throughputSamples - Historical throughput sample array.
 * @param {number} playbackPosition - Current playback position in ms.
 * @param {number} maxTrailingBufferLen - Maximum trailing buffer length in ms.
 * @param {number} downloadPosition - Current download position in ms.
 * @param {number} bufferFillLevel - Current buffer fill level in ms.
 * @param {number} segmentIndex - Index of current segment in the fragment index.
 * @param {number} startBlockIndex - Start block index in the throughput sample array.
 * @param {number} partialBytes - Bytes of partial segment already downloaded.
 * @param {number} pendingBytes - Additional pending bytes.
 * @param {number} primaryBlockCount - Number of primary stream blocks to simulate.
 * @param {number} secondaryBlockCount - Number of secondary stream blocks to simulate.
 * @param {number} simulationDuration - Maximum duration for the simulation.
 * @param {number} playbackRate - Current playback rate multiplier.
 * @param {number} internal_Jqa - Internal scheduling parameter.
 * @param {number} [bitrateOffset=0] - Bitrate offset for weighted calculation.
 * @returns {Object|false} Simulation result with `{ result, internal_Zda, canAutoSelect }`,
 *   or `false` if the stream is infeasible.
 */
export function simulateFeasibility(
  config,
  streams,
  primarySegments,
  secondarySegments,
  throughputSamples,
  playbackPosition,
  maxTrailingBufferLen,
  downloadPosition,
  bufferFillLevel,
  segmentIndex,
  startBlockIndex,
  partialBytes,
  pendingBytes,
  primaryBlockCount,
  secondaryBlockCount,
  simulationDuration,
  internal_Jqa,
  playbackRate,
  bitrateOffset
) {
  if (bitrateOffset === undefined) {
    bitrateOffset = 0;
  }

  const candidateStream = primarySegments[0].stream;

  // Get the first secondary stream (if any)
  const firstSecondaryEntry = secondarySegments[0];
  let fallbackStream = firstSecondaryEntry != null ? firstSecondaryEntry.stream : undefined;

  assert(candidateStream, "First stream undefined");

  const bufferCapacity = candidateStream.bufferLength;

  // Calculate buffered range and check fragment index availability
  const bufferedRange = downloadPosition - playbackPosition;
  const throughputSampleCount = throughputSamples.length;
  const hasFragmentIndex = candidateStream.fragmentIndex && candidateStream.fragmentIndex.length;
  const hasFallbackFragmentIndex =
    (fallbackStream != null ? fallbackStream.fragmentIndex : undefined) &&
    (fallbackStream != null ? fallbackStream.fragmentIndex : undefined).length;

  assert(startBlockIndex <= throughputSampleCount);

  // Optionally cap simulation duration at the current buffered range
  if (config.$da) {
    simulationDuration = Math.min(simulationDuration, bufferedRange);
  }

  // Quick infeasibility check: buffer capacity too low for the bitrate
  if (
    !bufferCapacity ||
    bufferCapacity < candidateStream.bitrate * playbackRate * config.highStreamInfeasibleBitrateFactor ||
    !hasFragmentIndex
  ) {
    return false;
  }

  // If no fallback fragment index, use the candidate as fallback
  if (!hasFallbackFragmentIndex) {
    fallbackStream = candidateStream;
  }

  // Build segment size accumulator from throughput samples
  const segmentAccumulator = new SegmentSizeAccumulator(throughputSamples);

  // Clamp block counts to available fragment index range
  primaryBlockCount = Math.max(0, Math.min(primaryBlockCount, candidateStream.fragmentIndex.length - segmentIndex));
  secondaryBlockCount = Math.max(0, Math.min(secondaryBlockCount, fallbackStream.fragmentIndex.length - segmentIndex - primaryBlockCount));

  // Feed primary segment sizes into accumulator
  primarySegments.forEach((segment) => {
    const stream = segment.stream;
    const blocks = segment.blocks;
    const startPos = segment.startPosition;
    if (numberUtils.wc(startPos) && stream.fragmentIndex) {
      segmentAccumulator.item(stream.fragmentIndex.sC.subarray(startPos, startPos + blocks));
    }
  });

  // Feed secondary segment sizes into accumulator
  secondarySegments.forEach((segment) => {
    const stream = segment.stream;
    const blocks = segment.blocks;
    const startPos = segment.startPosition;
    if (secondaryBlockCount > 0 && numberUtils.wc(startPos) && stream.fragmentIndex) {
      segmentAccumulator.item(stream.fragmentIndex.sC.subarray(startPos, startPos + blocks));
    }
  });

  // Run simulation if there are blocks to simulate
  if (primaryBlockCount > 0 || secondaryBlockCount > 0) {
    return runBufferSimulation({
      luc: segmentAccumulator,
      blocks: startBlockIndex + primaryBlockCount + secondaryBlockCount,
      playbackPosition,
      downloadPosition,
      iZc: maxTrailingBufferLen,
      partial: partialBytes,
      fl: bufferFillLevel,
      startPosition: startBlockIndex,
      internal_Jtc: startBlockIndex + primaryBlockCount,
      internal_Jqa,
      WAb: pendingBytes,
      bufferLength: (bufferCapacity - bitrateOffset) / playbackRate,
      FJc: simulationDuration,
      minRequiredBuffer: config.minRequiredBuffer,
      sqc: false,
    });
  }

  // No blocks to simulate — check if buffer capacity exceeds stream's ended threshold
  if (bufferCapacity > candidateStream.endedChangedEvent) {
    return { result: true, internal_Zda: 0, canAutoSelect: true };
  } else {
    return { result: false, internal_Zda: 0, canAutoSelect: true };
  }
}

/**
 * Main ABR stream selection entry point.
 *
 * Evaluates all candidate streams against current playback conditions
 * (buffer level, throughput, playback rate, configuration) and selects
 * the best feasible quality level. Handles both up-switching and
 * down-switching logic with configurable lock periods, watermark levels,
 * and fast-switch factors.
 *
 * @param {Object} params - Selection parameters.
 * @param {Object} params.config - ABR configuration with all tuning knobs.
 * @param {Object} params.player - Current player state (buffer, position, rate, etc.).
 * @param {Object} params.el - Stream list manager with `first`, `FWa`, and `TL` methods.
 * @param {boolean} params.internal_Mca - Whether cross-stream timestamp comparison is disabled.
 * @param {boolean} params.h0 - Whether this is a next-segment fast upswitch opportunity.
 * @param {Object} params.metadataResult - Currently selected stream (must not be null).
 * @param {number} [params.playerPositionMs] - Current player position in ms (for lock period).
 * @param {boolean} [params.IZa] - Whether to override lock period timing.
 * @returns {StreamSelectorClass} Selection result with `.mediaSource` and optional `.iid`.
 */
export function refresh(params) {
  const config = params.config;
  const player = params.player;
  const streamList = params.el;
  const disableTimestampComparison = params.internal_Mca;
  const isNextSegmentUpswitch = params.h0;
  let selectedStream = params.metadataResult;
  const playerPositionMs = params.playerPositionMs;
  const overrideLockPeriod = params.IZa;

  assert(selectedStream, "Must have a selected stream");

  if (player.startPosition === undefined) {
    player.startPosition = 0;
  }
  assert(numberUtils.wc(player.startPosition), "invalid player fragmentIndex");

  // Validate player state types
  assert("number" === typeof player.buffer.ru);
  assert("number" === typeof player.internal_Jqa);

  // Get sorted stream list and initialize result
  const streams = streamList.first;
  const result = new StreamSelectorClass();
  const currentStream = selectedStream;

  // Find index of currently selected stream in the list
  const currentStreamIndex = findIndex(streams, (stream) => stream.isEqual(selectedStream));
  assert(currentStreamIndex >= 0, "Selected stream not found in stream list");

  // Extract buffer state from player
  const startPts = player.buffer.startPts;
  const playbackPosition = player.buffer.playbackPosition;
  const bufferFillLevel = player.buffer.fl;
  const downloadPosition = player.buffer.downloadPosition;
  const segmentIndex = player.startPosition;
  const bufferLevelMs = downloadPosition - playbackPosition;

  // Partial bytes: only count if player is actively playing or paused
  const partialBytes =
    player.state === playerPhase.PLAYING || player.state === playerPhase.PAUSED
      ? player.buffer.partial
      : 0;

  const maxTrailingBufferLen = config.maxTrailingBufferLen;
  const lowestWaterMarkLevel = config.miniModalHorizontalLowestWaterMarkLevel != null
    ? config.miniModalHorizontalLowestWaterMarkLevel
    : 1000;

  // Mark streams without fragment index headers as needing header fetch
  streamList.TL((streamArray, _listIndex, streamIdx) => {
    if (streamIdx !== undefined) {
      const stream = streamArray[streamIdx];
      if (!(stream.fragmentIndex != null && stream.fragmentIndex.length)) {
        stream.qx = true;
      }
    }
  });

  // Build throughput sample array from player's fragment index
  const throughputSamples = buildFunction.internal_Tpa(player.buffer.fragmentIndex);
  const pendingBytes = player.buffer.ru - throughputSamples.la;

  // Determine how many candidate streams to evaluate
  // If skipBitrateInUpswitch is enabled and buffer is above watermark, evaluate all streams
  const maxCandidateIndex =
    (config.skipBitrateInUpswitch || isNextSegmentUpswitch) &&
    bufferLevelMs >= config.watermarkLevelForSkipStart
      ? streams.length
      : currentStreamIndex + 2;

  // Build simulation duration/window pairs for each candidate stream
  const simulationWindows = (function computeSimulationWindows(candidateCount) {
    if (config.simulationDurationStrategy === "variable") {
      // Variable strategy: compute duration per-stream based on buffer fill
      return streams.slice(0, candidateCount).map((stream) => {
        return [calculateSimulationDuration(config, player.buffer.ru, stream), 0];
      });
    }

    // Fixed strategy: use configured retention/transition windows based on direction
    return streams.slice(0, candidateCount).map((_stream, index) => {
      if (index < currentStreamIndex) {
        // Downswitch: use "down" windows
        return [config.highStreamRetentionWindowDown, config.lowStreamTransitionWindowDown];
      } else if (index === currentStreamIndex) {
        // Current: use neutral windows
        return [config.highStreamRetentionWindow, config.lowStreamTransitionWindow];
      } else {
        // Upswitch: use "up" windows
        return [config.highStreamRetentionWindowUp, config.lowStreamTransitionWindowUp];
      }
    });
  })(maxCandidateIndex);

  // Track previous candidate evaluation for early-exit optimization
  let previousCandidate = undefined;

  // Build lazy evaluation thunks for each candidate stream
  const candidateEvaluators = streams.slice(0, maxCandidateIndex).map((candidateStream, candidateIndex) => {
    const isDownswitch = currentStreamIndex > candidateIndex;

    return function evaluateCandidate() {
      // Get the secondary (fallback) candidate index
      const fallbackIndex = Math.max(candidateIndex - 1, 0);

      const retentionWindow = simulationWindows[candidateIndex][0];
      const transitionWindow = simulationWindows[candidateIndex][1];
      const playbackRate = player.playbackRate;

      // Gather primary stream segments within the retention window
      const primaryResult = streamList.FWa(candidateIndex, segmentIndex, retentionWindow);
      const primaryBlockCount = primaryResult.C7a;
      const primarySegments = primaryResult.D6a;

      // Gather secondary (fallback) stream segments within the transition window
      const secondaryResult = streamList.FWa(fallbackIndex, segmentIndex + primaryBlockCount, transitionWindow);
      const secondaryBlockCount = secondaryResult.C7a;
      const secondarySegments = secondaryResult.D6a;

      // Extract stream descriptors
      const primaryStream = primarySegments[0].stream;
      const secondaryStream = secondarySegments[0] != null ? secondarySegments[0].stream : undefined;

      const streamBufferCapacity = primaryStream.bufferLength || 0;
      const hasHeaders = primaryStream.fragmentIndex && primaryStream.fragmentIndex.length;

      // Determine fast-switch factor based on direction and header availability
      let fastSwitchFactor = isNextSegmentUpswitch
        ? config.fastUpswitchFactorForNextSegment
        : hasHeaders
          ? config.fastUpswitchFactor
          : config.fastUpswitchFactorWithoutHeaders;
      fastSwitchFactor = isDownswitch ? config.fastDownswitchFactor : fastSwitchFactor;

      // Early exit: if previous candidate at same or higher bitrate was infeasible
      // with more buffer, skip this one
      if (
        previousCandidate &&
        !previousCandidate.ura &&
        previousCandidate.bufferLength >= streamBufferCapacity &&
        previousCandidate.bitrate <= primaryStream.bitrate
      ) {
        return false;
      }

      // Early exit: segment bitrate exceeds max allowed
      if (
        Infinity !== config.maxSegmentBitrate &&
        config.maxSegmentBitrate > 0 &&
        primaryStream.fragmentIndex &&
        segmentIndex < primaryStream.fragmentIndex.length &&
        (8 * primaryStream.fragmentIndex.gZc()[segmentIndex]) /
          primaryStream.fragmentIndex.gyb()[segmentIndex] >
          config.maxSegmentBitrate
      ) {
        return false;
      }

      // Fast path checks for streams that can be selected without full simulation
      if (!isDownswitch || !hasHeaders) {
        // Mark streams without headers as needing header fetch
        if (!isDownswitch && !hasHeaders) {
          primaryStream.qx = true;
        }

        if (hasHeaders) {
          // Stream has headers: check buffer vs threshold for fast accept
          if (
            streamBufferCapacity >=
              Math.max(
                primaryStream.endedChangedEvent * playbackRate,
                primaryStream.bitrate * playbackRate * fastSwitchFactor
              ) &&
            primaryStream.canAutoSelect
          ) {
            return true;
          }
        } else {
          // No headers: simpler bitrate-based check
          if (streamBufferCapacity >= primaryStream.bitrate * playbackRate * fastSwitchFactor) {
            return true;
          }
        }
      }

      // Full simulation path: compute cross-stream throughput adjustment
      let throughputAdjustment = 0;
      if (
        config.S$ &&
        primaryStream !== currentStream &&
        !(primaryStream.liveAdjustAudioTimestamps === currentStream.liveAdjustAudioTimestamps && disableTimestampComparison)
      ) {
        const streamConfig = primaryStream.getConfig;
        if (streamConfig && streamConfig.playbackRateRef && streamConfig.playbackRateRef.average) {
          throughputAdjustment =
            streamConfig.playbackRateRef.average +
            config.O$ *
              (streamConfig.playbackRateRef.xg
                ? Math.sqrt(streamConfig.playbackRateRef.xg)
                : 0);
        }
      }

      // Compute weighted bitrate offset for primary/secondary mix
      const totalWindow = retentionWindow + transitionWindow;
      const weightedBitrateOffset =
        ((primaryStream.cw != null ? primaryStream.cw : 0) * retentionWindow) / totalWindow +
        ((secondaryStream != null ? secondaryStream.cw : undefined) != null
          ? (secondaryStream != null ? secondaryStream.cw : undefined)
          : 0) *
          transitionWindow /
          totalWindow;

      // Run the full buffer simulation
      const simResult = simulateFeasibility(
        config,
        streams,
        primarySegments,
        secondarySegments,
        throughputSamples,
        playbackPosition + throughputAdjustment - startPts,
        maxTrailingBufferLen,
        downloadPosition - startPts,
        bufferFillLevel - startPts,
        segmentIndex,
        throughputSamples.length,
        partialBytes,
        pendingBytes,
        primaryBlockCount,
        secondaryBlockCount,
        lowestWaterMarkLevel,
        player.internal_Jqa,
        player.playbackRate,
        weightedBitrateOffset
      );

      // Track improvement in internal metric
      if (simResult && simResult.result) {
        result.iid = simResult.internal_Zda;
      }

      // Record this candidate for early-exit checks on subsequent candidates
      previousCandidate = {
        ura: simResult && simResult.result,
        bufferLength: streamBufferCapacity,
        bitrate: primaryStream.bitrate,
      };

      return simResult && simResult.result;
    };
  });

  assert(candidateEvaluators.length === simulationWindows.length);

  // --- Stream selection decision ---
  if (candidateEvaluators[currentStreamIndex]()) {
    // Current stream is feasible — try to upswitch if conditions allow
    if (
      currentStreamIndex + 1 < streams.length &&
      bufferLevelMs > config.lowestBufForUpswitch &&
      (
        playerPositionMs === undefined ||
        (overrideLockPeriod && overrideLockPeriod > playerPositionMs) ||
        (bufferFillLevel - playerPositionMs > config.lockPeriodAfterDownswitch &&
          bufferLevelMs > config.lowWatermarkLevel)
      )
    ) {
      // Find the highest feasible stream above the current one
      selectedStream = findLast(
        streams.slice(currentStreamIndex + 1, maxCandidateIndex),
        (_stream, index) => candidateEvaluators[currentStreamIndex + 1 + index]()
      );
    }
  } else {
    // Current stream is infeasible — downswitch
    if (selectedStream.fragmentIndex && selectedStream.fragmentIndex.length) {
      // Find the highest feasible stream below the current one
      selectedStream = findLast(
        streams.slice(0, currentStreamIndex),
        (_stream, index) => candidateEvaluators[index]()
      );

      // If no lower stream is feasible, fall back to the lowest stream
      if (!selectedStream) {
        selectedStream = streams[0];
      }
    }
  }

  result.mediaSource = selectedStream || currentStream;
  return result;
}
