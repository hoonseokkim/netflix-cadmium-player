/**
 * @module ContentTimeRange
 * @description Represents a time range within a media content stream, with optional
 * overrides for start and end ticks. Inherits default values from a parent
 * content descriptor when overrides are not set. Used to track playback
 * windows and content boundaries within the streaming pipeline.
 *
 * @see Module_5800
 */

import { outputList } from '../core/OutputList';
import { processingContext } from '../core/ProcessingContext';

/**
 * A content time range that can override start/end ticks from a parent descriptor.
 */
export class ContentTimeRange {
  /**
   * @param {object} parent - Parent content descriptor providing default tick values
   * @param {object} options
   * @param {number} [options.contentStartTicks] - Override for start ticks
   * @param {number} [options.contentEndTicks] - Override for end ticks
   */
  constructor(parent, options) {
    /** @private */
    this._parent = parent;

    /** @private @type {number|undefined} */
    this._contentStartTicks = options.contentStartTicks;

    /** @private @type {number|undefined} */
    this._contentEndTicks = options.contentEndTicks;
  }

  /**
   * Content start ticks. Falls back to parent's contentStartTicks if not overridden.
   * @type {number}
   */
  get contentStartTicks() {
    return this._contentStartTicks !== undefined
      ? this._contentStartTicks
      : this._parent.contentStartTicks;
  }

  /**
   * Content end ticks. Falls back to parent's contentEndTicks if not overridden.
   * @type {number}
   */
  get contentEndTicks() {
    return this._contentEndTicks !== undefined
      ? this._contentEndTicks
      : this._parent.contentEndTicks;
  }

  /**
   * The timescale value, always delegated to the parent.
   * @type {number}
   */
  get timescale() {
    return this._parent.timescaleValue;
  }

  /**
   * Cached metadata, always delegated to the parent.
   * @type {*}
   */
  get cachedMetadata() {
    return this._parent.cachedMetadata;
  }

  /**
   * Sets the content start ticks override.
   * @param {number} ticks
   */
  setContentStartTicks(ticks) {
    this._contentStartTicks = ticks;
  }

  /**
   * Sets the content end ticks override.
   * @param {number} ticks
   */
  setContentEndTicks(ticks) {
    this._contentEndTicks = ticks;
  }

  /**
   * Clears the content end ticks override, reverting to the parent value.
   */
  clearContentEndTicks() {
    this._contentEndTicks = undefined;
  }
}

// Register with the processing context
outputList(processingContext, ContentTimeRange);

export { ContentTimeRange as WF };
