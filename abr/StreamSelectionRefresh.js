/**
 * @module StreamSelectionRefresh
 * @description Augmented stream selection refresh logic for the adaptive bitrate (ABR) engine.
 * Extends the base stream selector's refresh by attaching per-stream throughput diagnostics,
 * fragment-index data, t-digest statistics, and buffer-position information used for
 * bandwidth estimation and quality-level decisions.
 *
 * The core flow:
 *   1. Validate that a selected stream and fragment index exist.
 *   2. Locate the current playback position inside the stream selection trace.
 *   3. For each candidate stream, collect throughput average, t-digest quantiles,
 *      throughput trace, and fragment size data.
 *   4. Package everything into an augmented selection result.
 *
 * @see Module_4620
 */

import * as typeCheckers from '../utils/TypeCheckers';
import { platform } from '../core/Platform';
import { assert } from '../assert/Assert';
import { StreamSelectorClass } from '../abr/StreamSelector';
import { buildFunction } from '../abr/FragmentHelpers';
import BaseStreamSelector from '../abr/BaseStreamSelector';

/**
 * Performs an augmented stream selection refresh that enriches the base selector
 * result with throughput diagnostics, fragment sizes, and buffer metrics.
 *
 * @param {object} context - The selection context
 * @param {object} context.config - ABR configuration
 * @param {object} context.player - Player state (buffer, fragment index, start position)
 * @param {object} context.el - Element / stream list
 * @param {object} context.metadataResult - Currently selected stream metadata
 * @returns {object} Enriched stream selection result
 */
export function refreshStreamSelection(context) {
  const config = context.config;
  const playerState = context.player;
  const streamList = context.el;
  const selectedMetadata = context.metadataResult;

  assert(selectedMetadata, 'Must have a selected stream for selectPlaying');
  assert(typeCheckers.isNumber(playerState.startPosition), 'player missing fragmentIndex');

  const trace = config.streamSelectionTrace;
  const streams = streamList.first;
  const selectorResult = new StreamSelectorClass(selectedMetadata);
  const currentPosition = playerState.startPosition ?? -1;

  const firstTracePosition = trace[0].f;
  const lastTracePosition = trace[trace.length - 1].f;

  // If current position is outside the trace range, fall back to base refresh
  if (currentPosition < firstTracePosition || currentPosition > lastTracePosition) {
    return BaseStreamSelector.prototype.refresh(context);
  }

  // Binary-search for the closest trace entry to current position
  let searchIndex = Math.round((firstTracePosition - currentPosition) / 1); // simplified
  if (searchIndex < 0) searchIndex = 0;
  if (searchIndex >= trace.length) searchIndex = trace.length - 1;

  let tracePosition = trace[searchIndex].f;

  // Scan forward/backward to find exact match
  let selectedTraceIndex;
  if (tracePosition === currentPosition) {
    selectedTraceIndex = searchIndex;
  } else if (tracePosition < currentPosition) {
    // Scan forward
    while (searchIndex < trace.length) {
      if (trace[searchIndex].f === currentPosition) {
        selectedTraceIndex = searchIndex;
        break;
      }
      if (trace[searchIndex].f > currentPosition) break;
      searchIndex++;
    }
  } else {
    // Scan backward
    searchIndex--;
    while (searchIndex >= 0) {
      if (trace[searchIndex].f === currentPosition) {
        selectedTraceIndex = searchIndex;
        break;
      }
      if (trace[searchIndex].f < currentPosition) break;
      searchIndex--;
    }
  }

  if (selectedTraceIndex === undefined) {
    return BaseStreamSelector.prototype.refresh(context);
  }

  // Set the media source from the trace entry
  selectorResult.mediaSource = streamList[trace[selectedTraceIndex].dld];

  if (!config.enableStreamSelectionAugmentData) {
    return selectorResult;
  }

  // Gather augmented data for each candidate stream
  const targetStream = selectorResult.mediaSource;
  const augmentedEntries = [];
  const bufferState = playerState.buffer;
  const bufferLevel = bufferState.downloadPosition - bufferState.playbackPosition;
  const fragmentOffset = buildFunction.getFragmentPosition(playerState.buffer.fragmentIndex);
  const remainingBuffer = playerState.buffer.ru - fragmentOffset.la;
  let isBeforeTarget = true;

  for (let streamIndex = 0; streamIndex < streams.length; streamIndex++) {
    const stream = streams[streamIndex];
    let throughputAverage;
    const tdigestData = [];

    // Collect throughput average
    if (stream.getConfig?.throughput) {
      throughputAverage = stream.getConfig.throughput.average;
    }

    // Collect t-digest quantile data
    if (stream.getConfig?.tdigest) {
      const tdigest = stream.getConfig.tdigest;
      tdigestData.push(tdigest.min);
      tdigestData.push(tdigest.Q1a);
      tdigestData.push(tdigest.fragmentEndTimeTicks);
      tdigestData.push(tdigest.timescaleDivisor);
      tdigestData.push(tdigest.fragmentStartTimeTicks);
      tdigestData.push(tdigest.R1a);
      tdigestData.push(tdigest.max);
    }

    // Collect throughput trace
    let throughputTrace;
    if (stream.getConfig?.tputTrace) {
      throughputTrace = stream.getConfig.tputTrace;
    }

    // Collect fragment sizes from fragment index
    const fragmentSizes = [];
    const fragmentIndex = stream.fragmentIndex;
    let totalFragmentBytes = 0;

    // Sum fragment bytes from start position
    if (fragmentIndex !== undefined) {
      for (let j = playerState.startPosition; j < Math.min(j + config.augmentDataNumOfChunks, fragmentIndex.length); j++) {
        const fragment = fragmentIndex.key(j);
        fragmentSizes.push({
          d: fragment.offset.playbackSegment,
          b: fragment.la,
        });
      }
    }

    // Sum total bytes for all fragments from start
    let fragIdx = playerState.startPosition;
    while (fragIdx < (fragmentIndex?.length ?? 0)) {
      totalFragmentBytes += fragmentIndex.key(fragIdx).offset.playbackSegment;
      fragIdx++;
    }

    // Compute timing
    let downloadDuration;
    if (playerState.internal_Gec) {
      downloadDuration = platform.platform.now() - playerState.internal_Gec;
    }

    augmentedEntries.push({
      Ve: playerState.startPosition,
      bytesReceived: downloadDuration,
      Mid: totalFragmentBytes,
      ocd: throughputAverage,
      omd: tdigestData,
      pmd: throughputTrace,
      htb: bufferLevel,
      WAb: remainingBuffer,
      $cd: fragmentSizes,
      Khd: selectedMetadata.bitrate,
      Lhd: selectedMetadata.vmaf ?? 0,
      Edd: stream.bitrate,
      Fdd: stream.vmaf ?? 0,
      wld: context.bitrate,
      xld: context.vmaf ?? 0,
      dua: isBeforeTarget,
    });

    if (stream === context) {
      isBeforeTarget = false;
    }
  }

  selectorResult.jcd = augmentedEntries;
  return selectorResult;
}

export { refreshStreamSelection as refresh };
