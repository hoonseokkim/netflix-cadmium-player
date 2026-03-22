/**
 * Netflix Cadmium Player — ABR Stream Selector (Base)
 *
 * Core utilities and base class for adaptive-bitrate stream selection.
 * Provides helpers for checking stream readiness, constraining numeric
 * values, selecting the best available stream index, and converting
 * between bits-per-second and kilobits-per-second.
 *
 * @module StreamSelector
 */

// Dependencies
// import { platform } from './modules/Module_66164.js';
// import { playerPhase } from './modules/Module_65161.js';

/** @type {boolean} Whether verbose logging is enabled */
let verboseLogging = false;

/** Console logger scoped to ASEJS_STREAM_SELECTOR */
// export const console = new platform.Console("ASEJS_STREAM_SELECTOR", "media|asejs");

/**
 * Checks whether a stream is ready for selection.
 *
 * @param {Object} stream - The stream descriptor.
 * @param {boolean} [includeManualSelect] - When true, also allows streams
 *   that have `canAutoSelect === false`.
 * @returns {boolean}
 */
export const isStreamReady = (stream, includeManualSelect) => {
  return stream && stream.isReadyForSelection && (includeManualSelect || stream.canAutoSelect !== false);
};

/**
 * Returns `true` when the stream at `index` is the last available
 * (ready-for-selection) stream in the list.
 *
 * @param {Object[]} streams - Ordered list of stream descriptors.
 * @param {number} index - Current stream index.
 * @returns {boolean}
 */
export const isLastAvailableStream = (streams, index) => {
  return !streams.slice(index + 1).some((stream) => isStreamReady(stream));
};

/**
 * Clamps `value` between `min` and `max`.  If `value` is not a number the
 * minimum is returned.
 *
 * @param {number|*} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const constrainValue = (value, min, max) => {
  return typeof value === "number" ? Math.min(Math.max(value, min), max) : min;
};

/**
 * Searches the stream list for the best available stream, starting from a
 * preferred index and expanding outward.  An optional `filterFn` can reject
 * individual candidates.
 *
 * @param {Object[]} streams - Ordered list of stream descriptors.
 * @param {number|number[]} preferredIndexOrRange - Either a single preferred
 *   index or a `[minIndex, maxIndex, startIndex]` tuple.
 * @param {Function} [filterFn] - Optional `(stream, index) => boolean`
 *   predicate; returning `false` skips the candidate.
 * @returns {number} Index of the selected stream, or `-1` if none found.
 */
export const selectBestStream = (streams, preferredIndexOrRange, filterFn) => {
  const totalStreams = streams.length;
  let minIndex = 0;
  let maxIndex = totalStreams;

  /**
   * Validates a single candidate stream.
   * @param {number} idx
   * @returns {boolean}
   */
  const isCandidate = (idx) => {
    const stream = streams[idx];
    if (!stream.isReadyForSelection) {
      if (verboseLogging && !stream.isPlayable) {
        console.log(`Stream [${idx}] ${stream.id} (${stream.bitrate} Kbps): Not available`);
      }
      if (verboseLogging && stream.isFiltered) {
        console.log(`Stream [${idx}] ${stream.id} (${stream.bitrate} Kbps): Failed`);
      }
      return false;
    }
    if (filterFn && !filterFn(stream, idx)) {
      return false;
    }
    if (verboseLogging) {
      console.log(`Stream [${idx}] ${stream.id} (${stream.bitrate} Kbps): Available`);
    }
    return true;
  };

  let startIndex;

  if (Array.isArray(preferredIndexOrRange)) {
    minIndex = constrainValue(preferredIndexOrRange[0], 0, totalStreams);
    maxIndex = constrainValue(preferredIndexOrRange[1], 0, totalStreams);
    startIndex = preferredIndexOrRange[2] ?? minIndex + 1;
  }

  startIndex = constrainValue(startIndex || 0, minIndex + 1, maxIndex);

  // Search downward from the preferred index
  for (let i = startIndex - 1; i >= minIndex; --i) {
    if (isCandidate(i)) return i;
  }

  // Search upward from the preferred index
  for (let i = startIndex + 1; i < maxIndex; ++i) {
    if (isCandidate(i)) return i;
  }

  if (verboseLogging) {
    console.log("Found no available streams");
  }

  return -1;
};

/**
 * Converts a throughput value from bytes-per-second to kilobits-per-second,
 * normalized by the number of concurrent connections.
 *
 * @param {number} bytesPerSecond
 * @param {number} connectionCount
 * @returns {number} Throughput in kbps.
 */
export const convertBpsToKbps = (bytesPerSecond, connectionCount) => {
  return Math.floor((bytesPerSecond / (125 * connectionCount)) * 1000);
};

/**
 * Converts kilobits-per-second back to bytes, scaled by connection count.
 *
 * @param {number} kbps
 * @param {number} connectionCount
 * @returns {number} Byte count.
 */
export const kbpsToBytes = (kbps, connectionCount) => {
  return Math.ceil((kbps / 1000) * connectionCount * 125);
};

/**
 * Determines whether the selector should wait for more data in the buffer
 * before switching streams.  During STARTING or REBUFFERING the answer is
 * always `true`; during PLAYING with sufficient buffer it is `false`.
 *
 * @param {Object} player - Player state (state, buffer).
 * @param {number|null} presentationDelay - Minimum presentation delay in ms.
 * @param {number} minBufferThresholdMs - Required buffer level in ms.
 * @param {boolean} currentWaitFlag - Previously computed wait flag.
 * @returns {boolean}
 */
export const shouldWaitForBuffer = (player, presentationDelay, minBufferThresholdMs, currentWaitFlag) => {
  const bufferLevel = player.buffer.downloadPosition - player.buffer.playbackPosition;
  const hasEnoughBuffer = bufferLevel >= minBufferThresholdMs - (presentationDelay ?? 0);

  if (player.state === playerPhase.STARTING || player.state === playerPhase.REBUFFERING) {
    return true;
  }
  if (player.state === playerPhase.PLAYING && hasEnoughBuffer) {
    return false;
  }
  return currentWaitFlag;
};

/**
 * Returns a stream-level override value, falling back to `defaultValue` when
 * no override is present.
 *
 * @param {Object} stream
 * @param {*} defaultValue
 * @returns {*}
 */
export const getStreamOverrideValue = (stream, defaultValue) => {
  const override = stream.ZGc;
  return override === undefined ? defaultValue : override;
};

/**
 * Base class for all stream selectors.  Tracks a media source reference and
 * two internal position cursors used during bitrate adaptation.
 */
export class StreamSelectorBase {
  /**
   * @param {Object} mediaSource - The media source to select streams for.
   */
  constructor(mediaSource) {
    /** @type {Object} */
    this.mediaSource = mediaSource;

    /** @type {number} Last selected stream index */
    this.lastSelectedIndex = 0;

    /** @type {number} Previous selected stream index */
    this.previousSelectedIndex = 0;
  }
}
