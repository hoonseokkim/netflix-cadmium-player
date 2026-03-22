/**
 * Netflix Cadmium Player - ABR Stream Simulation & Selection
 *
 * Implements the Adaptive Bitrate (ABR) stream selection algorithm.
 * Simulates buffer fill under different stream bitrate candidates to determine
 * the optimal quality level. Considers buffer levels, playback rate, download
 * throughput, and configurable watermark thresholds for up/down switching.
 *
 * Key functions:
 *   - calculateSimulationDuration: Computes how long to simulate based on buffer state
 *   - simulateStreamFeasibility: Runs a buffer simulation for a candidate stream
 *   - selectStream: Main entry point that evaluates all candidate streams and picks the best
 *
 * @module StreamSimulator
 * @see Module_98301
 */

import * as NumberUtils from '../utils/NumberUtils.js';
import { assert, cPa, hn } from '../assert/Assert.js';
import { buildFunction } from '../buffer/BufferUtils.js';
import { StreamSelectorClass } from '../abr/StreamSelectorResult.js';
import simulateBufferFill from '../abr/BufferSimulator.js';
import { playerPhase } from '../player/PlayerPhase.js';
import { internal_Glb as FragmentCollector } from '../buffer/FragmentCollector.js';

/**
 * Calculates the simulation duration based on buffer state.
 * When buffer is empty, returns minSimulationDuration. Otherwise scales
 * between min and max based on the ratio of available to total buffer.
 *
 * @param {Object} config - ABR configuration parameters
 * @param {number} bufferSize - Current buffer size in bytes
 * @param {Object} streamInfo - Stream information with bufferLength and bitrate
 * @returns {number} Simulation duration in seconds
 */
function calculateSimulationDuration(config, bufferSize, streamInfo) {
    if (!streamInfo.bufferLength) {
        return config.minSimulationDuration;
    }

    const bufferRatio = (streamInfo.internal_Sha || streamInfo.bufferLength) / streamInfo.bufferLength;

    if (bufferRatio <= 1) {
        return config.maxSimulationDuration;
    }

    const estimatedBuffer = config.simulationFullBufferPercentage *
        Math.min(8 * bufferSize / streamInfo.bitrate, config.maxMediaBufferAllowed);
    const adjustedDuration = (estimatedBuffer - config.miniModalHorizontalLowestWaterMarkLevel) / (bufferRatio - 1);

    return Math.min(
        Math.max(adjustedDuration, config.minSimulationDuration),
        config.maxSimulationDuration
    );
}

/**
 * Simulates whether a candidate stream is feasible given current network/buffer conditions.
 * Builds a fragment collection from primary and secondary stream fragments, then runs
 * a buffer fill simulation to determine if the stream can sustain playback.
 *
 * @param {Object} config - ABR configuration
 * @param {Object} currentStream - The first/primary stream candidate
 * @param {Array} primaryFragments - Primary stream fragment descriptors
 * @param {Array} secondaryFragments - Secondary stream fragment descriptors
 * @param {Array} throughputSamples - Network throughput measurement samples
 * @param {number} playbackPosition - Current playback position
 * @param {number} downloadPosition - Current download position
 * @param {number} bufferEnd - Buffer end position
 * @param {number} bufferStart - Buffer start position
 * @param {number} startPosition - Start position for fragment indexing
 * @param {number} sampleCount - Number of throughput samples
 * @param {boolean} isPartialBuffer - Whether buffer is partially filled
 * @param {number} pendingBytes - Bytes pending in buffer
 * @param {number} primaryBlockCount - Number of primary blocks to simulate
 * @param {number} secondaryBlockCount - Number of secondary blocks to simulate
 * @param {number} playbackRate - Current playback rate multiplier
 * @param {Object} playerState - Current player state info
 * @param {number} simulationDuration - Duration of the simulation
 * @param {number} offsetBytes - Byte offset for adjustment
 * @returns {Object|boolean} Simulation result with feasibility flag, or false if infeasible
 */
function simulateStreamFeasibility(config, currentStream, primaryFragments, secondaryFragments,
    throughputSamples, playbackPosition, downloadPosition, bufferEnd, bufferStart,
    startPosition, sampleCount, isPartialBuffer, pendingBytes, primaryBlockCount,
    secondaryBlockCount, playbackRate, playerState, simulationDuration, offsetBytes) {

    if (offsetBytes === undefined) offsetBytes = 0;

    const firstStream = primaryFragments[0].stream;
    const secondaryStream = secondaryFragments[0]?.stream;

    assert(firstStream, "First stream undefined");

    const totalBufferLength = firstStream.bufferLength;
    const bufferRange = bufferEnd - playbackPosition;
    const throughputCount = throughputSamples.length;
    const primaryIndexLength = firstStream.fragmentIndex?.length;
    const secondaryIndexLength = secondaryStream?.fragmentIndex?.length;

    assert(sampleCount <= throughputCount);

    if (config.$da) {
        playbackRate = Math.min(playbackRate, bufferRange);
    }

    // Check if the high stream is feasible based on bitrate
    if (!totalBufferLength ||
        totalBufferLength < firstStream.bitrate * simulationDuration * config.highStreamInfeasibleBitrateFactor ||
        !primaryIndexLength) {
        return false;
    }

    if (!secondaryIndexLength) {
        secondaryStream = firstStream;
    }

    const fragmentCollector = new FragmentCollector(throughputSamples);

    primaryBlockCount = Math.max(0, Math.min(primaryBlockCount, firstStream.fragmentIndex.length - startPosition));
    secondaryBlockCount = Math.max(0, Math.min(secondaryBlockCount, secondaryStream.fragmentIndex.length - startPosition - primaryBlockCount));

    // Collect primary stream fragments
    primaryFragments.forEach((fragment) => {
        const stream = fragment.stream;
        const blocks = fragment.blocks;
        const startPos = fragment.startPosition;
        if (NumberUtils.wc(startPos) && stream.fragmentIndex) {
            fragmentCollector.item(stream.fragmentIndex.sC.subarray(startPos, startPos + blocks));
        }
    });

    // Collect secondary stream fragments
    secondaryFragments.forEach((fragment) => {
        const stream = fragment.stream;
        const blocks = fragment.blocks;
        const startPos = fragment.startPosition;
        if (secondaryBlockCount > 0 && NumberUtils.wc(startPos) && stream.fragmentIndex) {
            fragmentCollector.item(stream.fragmentIndex.sC.subarray(startPos, startPos + blocks));
        }
    });

    // Run buffer fill simulation or return simple feasibility check
    if (primaryBlockCount > 0 || secondaryBlockCount > 0) {
        return simulateBufferFill({
            luc: fragmentCollector,
            blocks: sampleCount + primaryBlockCount + secondaryBlockCount,
            playbackPosition,
            downloadPosition: bufferEnd,
            iZc: bufferStart,
            partial: isPartialBuffer,
            fl: bufferStart,
            startPosition: sampleCount,
            internal_Jtc: sampleCount + primaryBlockCount,
            internal_Jqa: playerState,
            WAb: pendingBytes,
            bufferLength: (totalBufferLength - offsetBytes) / simulationDuration,
            FJc: playbackRate,
            minRequiredBuffer: config.minRequiredBuffer,
            sqc: false,
        });
    }

    // No fragments to simulate - check if buffer exceeds stream end
    return totalBufferLength > firstStream.endedChangedEvent
        ? { result: true, internal_Zda: 0, canAutoSelect: true }
        : { result: false, internal_Zda: 0, canAutoSelect: true };
}

/**
 * Main ABR stream selection function. Evaluates all candidate streams by running
 * buffer simulations and selects the best quality that can sustain playback.
 * Handles both upswitch and downswitch scenarios with configurable watermarks.
 *
 * @param {Object} params - Selection parameters
 * @param {Object} params.config - ABR configuration
 * @param {Object} params.player - Player state (buffer, position, playback rate, etc.)
 * @param {Object} params.el - Stream list with candidates
 * @param {boolean} params.internal_Mca - Internal flag
 * @param {boolean} params.h0 - Whether to use fast upswitch for next segment
 * @param {Object} params.metadataResult - Currently selected stream
 * @param {number} params.playerPositionMs - Last downswitch position in ms
 * @param {number} params.IZa - IZa timestamp
 * @returns {Object} Stream selection result with chosen stream and metadata
 */
function selectStream(params) {
    const config = params.config;
    const player = params.player;
    const streamList = params.el;
    const internalMca = params.internal_Mca;
    const isFastUpswitchNextSegment = params.h0;
    let selectedStream = params.metadataResult;
    const lastDownswitchPosition = params.playerPositionMs;
    const izaTimestamp = params.IZa;

    assert(selectedStream, "Must have a selected stream");

    if (player.startPosition === undefined) {
        player.startPosition = 0;
    }
    assert(NumberUtils.wc(player.startPosition), "invalid player fragmentIndex");
    assert(typeof player.buffer.ru === "number");
    assert(typeof player.internal_Jqa === "number");

    const candidates = streamList.first;
    const result = new StreamSelectorClass();
    const currentStream = selectedStream;

    // Find index of currently selected stream
    const currentIndex = hn(candidates, (candidate) => candidate.isEqual(selectedStream));
    assert(currentIndex >= 0, "Selected stream not found in stream list");

    // Extract buffer state
    const bufferStartPts = player.buffer.startPts;
    const playbackPosition = player.buffer.playbackPosition;
    const bufferStart = player.buffer.fl;
    const downloadPosition = player.buffer.downloadPosition;
    const startPosition = player.startPosition;
    const bufferLevel = downloadPosition - playbackPosition;
    const partialBuffer = (player.state === playerPhase.PLAYING || player.state === playerPhase.PAUSED)
        ? player.buffer.partial : 0;
    const maxTrailingBuffer = config.maxTrailingBufferLen;
    const lowestWaterMark = config.miniModalHorizontalLowestWaterMarkLevel ?? 1000;

    // Mark streams without fragment indices as needing headers
    streamList.TL((candidate, index, subIndex) => {
        if (subIndex !== undefined) {
            const stream = candidate[subIndex];
            if (!stream.fragmentIndex?.length) {
                stream.qx = true;
            }
        }
    });

    // Build throughput samples and calculate pending bytes
    const throughputSamples = buildFunction.internal_Tpa(player.buffer.fragmentIndex);
    const pendingBytes = player.buffer.ru - throughputSamples.la;

    // Determine how many candidates to evaluate
    const maxCandidateIndex = (config.skipBitrateInUpswitch || isFastUpswitchNextSegment) &&
        bufferLevel >= config.watermarkLevelForSkipStart
        ? candidates.length
        : currentIndex + 2;

    // Build simulation duration array for each candidate
    const simulationDurations = (() => {
        if (config.simulationDurationStrategy === "variable") {
            return candidates.slice(0, maxCandidateIndex).map((candidate) => {
                return [calculateSimulationDuration(config, player.buffer.ru, candidate), 0];
            });
        }
        return candidates.slice(0, maxCandidateIndex).map((candidate, idx) => {
            if (idx < currentIndex) {
                return [config.highStreamRetentionWindowDown, config.lowStreamTransitionWindowDown];
            } else if (idx === currentIndex) {
                return [config.highStreamRetentionWindow, config.lowStreamTransitionWindow];
            } else {
                return [config.highStreamRetentionWindowUp, config.lowStreamTransitionWindowUp];
            }
        });
    })(maxCandidateIndex);

    // Build evaluation functions for each candidate
    let previousEvaluation = undefined;

    const evaluators = candidates.slice(0, maxCandidateIndex).map((candidate, idx) => {
        const isDownswitch = currentIndex > idx;

        return () => {
            const lowerIdx = Math.max(idx - 1, 0);
            const highDuration = simulationDurations[idx][0];
            const lowDuration = simulationDurations[idx][1];
            const playbackRate = player.playbackRate;

            // Get fragment data for this candidate
            const highResult = streamList.FWa(idx, startPosition, highDuration);
            const highBlocks = highResult.C7a;
            const highFragments = highResult.D6a;

            const lowResult = streamList.FWa(lowerIdx, startPosition + highBlocks, lowDuration);
            const lowBlocks = lowResult.C7a;
            const lowFragments = lowResult.D6a;

            const stream = highFragments[0].stream;
            const secondaryStream = lowFragments[0]?.stream;
            const bufferLength = stream.bufferLength || 0;
            const hasFragmentIndex = stream.fragmentIndex?.length;

            // Determine fast switch factor
            let switchFactor = isFastUpswitchNextSegment
                ? config.fastUpswitchFactorForNextSegment
                : hasFragmentIndex
                    ? config.fastUpswitchFactor
                    : config.fastUpswitchFactorWithoutHeaders;
            switchFactor = isDownswitch ? config.fastDownswitchFactor : switchFactor;

            // Check for infeasibility conditions
            if ((previousEvaluation && !previousEvaluation.ura &&
                previousEvaluation.bufferLength >= bufferLength &&
                previousEvaluation.bitrate <= stream.bitrate) ||
                (Infinity !== config.maxSegmentBitrate && config.maxSegmentBitrate > 0 &&
                    stream.fragmentIndex && startPosition < stream.fragmentIndex.length &&
                    8 * stream.fragmentIndex.gZc()[startPosition] / stream.fragmentIndex.gyb()[startPosition] > config.maxSegmentBitrate)) {
                return false;
            }

            // For upswitch, mark streams without headers
            if (!isDownswitch || !hasFragmentIndex) {
                if (!isDownswitch && !hasFragmentIndex) {
                    stream.qx = true;
                }
            }

            // Quick check: if buffer exceeds threshold, stream is feasible
            if (!isDownswitch || !hasFragmentIndex) {
                if (hasFragmentIndex) {
                    if (bufferLength >= Math.max(stream.endedChangedEvent * playbackRate, stream.bitrate * playbackRate * switchFactor) && stream.canAutoSelect) {
                        return true;
                    }
                } else if (bufferLength >= stream.bitrate * playbackRate * switchFactor) {
                    return true;
                }
            }

            // Full simulation: calculate throughput offset and run simulation
            const throughputOffset = !config.S$ || stream === currentStream ||
                (stream.liveAdjustAudioTimestamps === currentStream.liveAdjustAudioTimestamps && internalMca)
                ? 0
                : (() => {
                    const cfg = stream.getConfig;
                    return cfg?.playbackRateRef?.average
                        ? cfg.playbackRateRef.average + config.O$ * (cfg.playbackRateRef.xg ? Math.sqrt(cfg.playbackRateRef.xg) : 0)
                        : 0;
                })();

            const totalDuration = highDuration + lowDuration;
            const combinedCw = (stream.cw ?? 0) * highDuration / totalDuration +
                (secondaryStream?.cw ?? 0) * lowDuration / totalDuration;

            const simResult = simulateStreamFeasibility(
                config, candidates, highFragments, lowFragments, throughputSamples,
                playbackPosition + throughputOffset - bufferStartPts, maxTrailingBuffer,
                downloadPosition - bufferStartPts, bufferStart - bufferStartPts, startPosition,
                throughputSamples.length, partialBuffer, pendingBytes, highBlocks, lowBlocks,
                lowestWaterMark, player.internal_Jqa, player.playbackRate, combinedCw
            );

            if (simResult?.result) {
                result.iid = simResult.internal_Zda;
            }

            previousEvaluation = {
                ura: simResult?.result,
                bufferLength,
                bitrate: stream.bitrate,
            };

            return simResult?.result;
        };
    });

    assert(evaluators.length === simulationDurations.length);

    // Evaluate: try to retain current stream, then upswitch or downswitch
    if (evaluators[currentIndex]()) {
        // Current stream is feasible - try to upswitch
        if (currentIndex + 1 < candidates.length &&
            bufferLevel > config.lowestBufForUpswitch &&
            (lastDownswitchPosition === undefined ||
                (izaTimestamp && izaTimestamp > lastDownswitchPosition) ||
                (bufferStart - lastDownswitchPosition > config.lockPeriodAfterDownswitch &&
                    bufferLevel > config.lowWatermarkLevel))) {

            selectedStream = cPa(candidates.slice(currentIndex + 1, maxCandidateIndex), (candidate, idx) => {
                return evaluators[currentIndex + 1 + idx]();
            });
        }
    } else {
        // Current stream is not feasible - downswitch
        if (selectedStream.fragmentIndex?.length) {
            selectedStream = cPa(candidates.slice(0, currentIndex), (candidate, idx) => {
                return evaluators[idx]();
            });
            if (!selectedStream) {
                selectedStream = candidates[0];
            }
        }
    }

    result.mediaSource = selectedStream || currentStream;
    return result;
}

export { simulateStreamFeasibility, selectStream, calculateSimulationDuration };
