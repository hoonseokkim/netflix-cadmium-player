/**
 * @module buffer/BufferSizeLimiter
 * @description Controls whether new media requests can be issued based on memory
 *              budget constraints. Checks multiple levels of memory limits:
 *
 *              1. Media duration limit - maximum buffered duration per media type
 *              2. Playgraph memory limit - per-playgraph byte budget
 *              3. Global/static memory limit - total memory across all playgraphs
 *              4. Per-media-type memory limit - separate audio/video byte budgets
 *
 *              When a static buffer size limiter is enabled, the "certain contiguous"
 *              memory (segments known to be contiguous in the buffer) is subtracted
 *              from global usage before checking per-type limits, allowing more
 *              accurate memory accounting.
 *
 * @see Module_86048
 */

import { MediaType, qPb as isMediaTypeLimit } from '../core/PlayerConstants.js';  // Module 65161
import { u as DEBUG_ENABLED } from '../config/DebugFlags.js';                      // Module 48170

/**
 * Computes total "certain contiguous" memory for a given media type across all
 * playgraph segments that are confirmed contiguous (dB === undefined or 1).
 *
 * @param {Object} usage - Current memory usage report
 * @param {string} mediaType - The media type to sum
 * @returns {number} Total contiguous bytes for the media type (0 for supplementary)
 * @private
 */
function getCertainContiguousBytes(usage, mediaType) {
  if (mediaType === MediaType.supplementaryMediaType) return 0;

  return Object.keys(usage.playgraphIdList)
    .map((key) => usage.playgraphIdList[key])
    .filter((entry) => entry.dB === undefined || entry.dB === 1)
    .reduce((sum, entry) => sum + entry.internal_Caa[mediaType], 0);
}

/**
 * Evaluates memory budget constraints to determine if a new media request
 * can be issued for a given playgraph segment.
 */
class BufferSizeLimiter {
  /**
   * @param {Object} segmentMap - Segment map with config, id, and buffer query methods
   * @param {Object} console - Logger/console for debug output
   * @param {Function} getMemoryLimits - Returns current memory limit configuration
   */
  constructor(segmentMap, console, getMemoryLimits) {
    /** @type {Object} */
    this.segmentMap = segmentMap;
    /** @type {Object} */
    this.console = console;
    /** @type {Function} */
    this.getMemoryLimits = getMemoryLimits;
  }

  /**
   * Checks whether a new request can be issued given current memory usage.
   *
   * @param {Object} usage - Current memory usage across all playgraphs and media types
   * @param {string} mediaType - The media type being requested (audio/video/text)
   * @param {boolean} useStaticLimit - Whether static buffer size limiter is active
   * @returns {{ lU: boolean, reason: string|undefined }} Whether the request is allowed
   */
  handleError(usage, mediaType, useStaticLimit) {
    const useStaticBufferSizeLimiter = useStaticLimit && this.segmentMap.config.useStaticBufferSizeLimiter;
    const useBufferSizeLimiter = this.segmentMap.config.useBufferSizeLimiter || useStaticBufferSizeLimiter;
    const memoryLimits = this.getMemoryLimits();

    let staticUsage;
    if (useStaticBufferSizeLimiter) {
      const global = usage.global;
      staticUsage = {
        [MediaType.V]: global[MediaType.V] - getCertainContiguousBytes(usage, MediaType.V),
        [MediaType.U]: global[MediaType.U] - getCertainContiguousBytes(usage, MediaType.U),
        [MediaType.TEXT_MEDIA_TYPE]: global[MediaType.TEXT_MEDIA_TYPE] - getCertainContiguousBytes(usage, MediaType.TEXT_MEDIA_TYPE),
      };
    }

    const failReason =
      this.checkMediaDurationLimit(mediaType) ||
      this.checkPlaygraphMemoryLimit(usage) ||
      this.checkGlobalMemoryLimit(usage, memoryLimits, staticUsage) ||
      this.checkMediaTypeMemoryLimit(usage, memoryLimits, staticUsage, mediaType);

    const isMediaTypeSpecific = isMediaTypeLimit(failReason);

    if (failReason && (!isMediaTypeSpecific || useBufferSizeLimiter)) {
      if (DEBUG_ENABLED) {
        this.console.log(
          `canIssueRequest ${this.segmentMap.id} [${mediaType}] static limit: ` +
          `${useStaticLimit}, usage: ${JSON.stringify(usage)}, failed ${failReason}`
        );
      }
      return { lU: false, reason: failReason };
    }

    if (DEBUG_ENABLED) {
      this.console.log(
        `canIssueRequest ${this.segmentMap.id} [${mediaType}] static limit: ` +
        `${useStaticLimit}, usage: ${JSON.stringify(usage)}, success ${failReason}`
      );
    }
    return { lU: true, reason: failReason };
  }

  /**
   * Checks if the buffered media duration exceeds the configured maximum.
   * @param {string} mediaType
   * @returns {string|undefined} "mediaDurationLimit" if exceeded
   * @private
   */
  checkMediaDurationLimit(mediaType) {
    const maxDuration = this.segmentMap.config.maxMediaBufferAllowed;
    if (this.segmentMap.owc(mediaType) >= (maxDuration || Infinity)) {
      return "mediaDurationLimit";
    }
  }

  /**
   * Checks if the per-playgraph memory limit is exceeded.
   * @param {Object} usage
   * @returns {string|undefined} "playgraphMemoryLimit" if exceeded
   * @private
   */
  checkPlaygraphMemoryLimit(usage) {
    return usage.playgraphIdList[this.segmentMap.id].total.total > (this.segmentMap.zsa() || Infinity)
      ? "playgraphMemoryLimit"
      : undefined;
  }

  /**
   * Checks if the total global memory limit (or static equivalent) is exceeded.
   * @param {Object} usage
   * @param {Object} memoryLimits
   * @param {Object} [staticUsage]
   * @returns {string|undefined} "staticMemoryLimit" or "globalMemoryLimit" if exceeded
   * @private
   */
  checkGlobalMemoryLimit(usage, memoryLimits, staticUsage) {
    const global = usage.global;
    if (staticUsage) {
      return staticUsage[MediaType.V] + staticUsage[MediaType.U] > (memoryLimits.z6a.total || Infinity)
        ? "staticMemoryLimit"
        : undefined;
    }
    return global.total > (memoryLimits.total.total || Infinity)
      ? "globalMemoryLimit"
      : undefined;
  }

  /**
   * Checks if the per-media-type memory limit (audio or video) is exceeded.
   * @param {Object} usage
   * @param {Object} memoryLimits
   * @param {Object} [staticUsage]
   * @param {string} mediaType
   * @returns {string|undefined} Limit reason string if exceeded
   * @private
   */
  checkMediaTypeMemoryLimit(usage, memoryLimits, staticUsage, mediaType) {
    const global = usage.global;
    if (mediaType === MediaType.supplementaryMediaType) return undefined;

    if (staticUsage) {
      if (DEBUG_ENABLED) {
        this.console.log(
          `checkRequestByMediaTypeMemory [${mediaType}]:` +
          ` using static limit ${memoryLimits.z6a[mediaType]}, usage: ${staticUsage}` +
          ` (global: ${global[mediaType]}` +
          ` - certain contiguous: ${getCertainContiguousBytes(usage, mediaType)})`
        );
      }
      return staticUsage[mediaType] > (memoryLimits.z6a[mediaType] || Infinity)
        ? (mediaType === MediaType.U ? "staticVideoMemoryLimit" : "staticAudioMemoryLimit")
        : undefined;
    }

    return global[mediaType] > (memoryLimits.total[mediaType] || Infinity)
      ? (mediaType === MediaType.U ? "globalVideoMemoryLimit" : "globalAudioMemoryLimit")
      : undefined;
  }
}

export { BufferSizeLimiter };
