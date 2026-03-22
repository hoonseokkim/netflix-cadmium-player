/**
 * Netflix Cadmium Player - Text Processing Context
 *
 * Provides timing context for text/subtitle track processing.
 * Converts raw tick-based timing into TimeUtil objects for content
 * start/end, duration, and composition offsets.
 *
 * @module TextProcessingContext
 */

import { TimeUtil } from '../modules/Module_91176.js';

/**
 * Creates a TimeUtil from ticks and timescale, returning undefined
 * for undefined inputs and ZERO for zero-value ticks.
 *
 * @param {number|undefined} ticks
 * @param {number} timescale
 * @returns {TimeUtil|undefined}
 */
function ticksToTimeUtil(ticks, timescale) {
  if (ticks === undefined) return undefined;
  if (ticks === 0) return TimeUtil.seekToSample;
  return new TimeUtil(ticks, timescale);
}

/**
 * Safely adds two potentially-undefined numbers.
 *
 * @param {number|undefined} a
 * @param {number|undefined} b
 * @returns {number|undefined}
 */
function safeAdd(a, b) {
  if (a === undefined || b === undefined) return undefined;
  return a + b;
}

/**
 * Provides timing context for text/subtitle track segments.
 *
 * Stores raw tick values and timescale, exposing computed properties
 * that convert to TimeUtil for integration with the player's timing system.
 */
export class TextProcessingContext {
  constructor() {
    // These fields are set externally after construction:
    // this.contentStartTicks
    // this.contentEndTicks
    // this.durationTicks
    // this.timescaleValue
    // this.cachedMetadata (composition time offset in ticks)
  }

  /**
   * Content duration in ticks (contentEnd - contentStart).
   * @type {number}
   */
  get contentDurationTicks() {
    const end = this.contentEndTicks;
    const start = this.contentStartTicks;
    return (end === undefined || start === undefined ? undefined : end - start) || 0;
  }

  /**
   * Content start ticks adjusted by composition offset.
   * @type {number|undefined}
   */
  get compositionStartTicks() {
    return safeAdd(this.contentStartTicks, this.cachedMetadata);
  }

  /**
   * Content end ticks adjusted by composition offset.
   * @type {number|undefined}
   */
  get compositionEndTicks() {
    return safeAdd(this.contentEndTicks, this.cachedMetadata);
  }

  /**
   * Total duration as a TimeUtil.
   * @type {TimeUtil|undefined}
   */
  get duration() {
    return ticksToTimeUtil(this.durationTicks, this.timescaleValue);
  }

  /**
   * Content start time as a TimeUtil.
   * @type {TimeUtil|undefined}
   */
  get contentStart() {
    return ticksToTimeUtil(this.contentStartTicks, this.timescaleValue);
  }

  /**
   * Content end time as a TimeUtil.
   * @type {TimeUtil|undefined}
   */
  get contentEnd() {
    return ticksToTimeUtil(this.contentEndTicks, this.timescaleValue);
  }

  /**
   * Composition-adjusted start time as a TimeUtil.
   * @type {TimeUtil|undefined}
   */
  get compositionStart() {
    return ticksToTimeUtil(this.compositionStartTicks, this.timescaleValue);
  }

  /**
   * Composition-adjusted end time as a TimeUtil.
   * @type {TimeUtil|undefined}
   */
  get compositionEnd() {
    return ticksToTimeUtil(this.compositionEndTicks, this.timescaleValue);
  }

  /**
   * Composition time offset as a TimeUtil.
   * @type {TimeUtil|undefined}
   */
  get compositionOffset() {
    return ticksToTimeUtil(this.cachedMetadata, this.timescaleValue);
  }
}
