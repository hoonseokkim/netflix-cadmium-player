/**
 * @file ClampedBitrateProperty.js
 * @description A bitrate property that clamps its value to a maximum bound.
 * Extends the base BitrateProperty class and ensures values are always
 * clamped to the range [0, maxBitrate] when set.
 * @module abr/ClampedBitrateProperty
 * @see Module_65361
 */

import { BitrateProperty } from '../abr/BitrateProperty.js';
import { clamp } from '../utils/MathUtils.js';

/**
 * A bitrate property that enforces a maximum value constraint.
 * Used for bitrate settings that should never exceed a configured ceiling.
 * @extends BitrateProperty
 */
export class ClampedBitrateProperty extends BitrateProperty {
  /**
   * @param {*} initialValue - Initial bitrate value passed to the parent constructor
   * @param {number} maxBitrate - The maximum allowed bitrate value
   */
  constructor(initialValue, maxBitrate) {
    super(initialValue);
    /** @type {number} Maximum bitrate ceiling */
    this.maxBitrate = maxBitrate;
  }

  /**
   * Sets the bitrate value, clamping it to [0, maxBitrate].
   * @param {number} value - The bitrate value to set
   */
  set(value) {
    super.set(clamp(value, 0, this.maxBitrate));
  }
}
