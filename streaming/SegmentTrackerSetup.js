/**
 * Netflix Cadmium Player — Segment Tracker Setup
 *
 * Initializes a segment tracker (A9a) and wires it to an event source
 * so that segment-related changes are automatically tracked. Acts as a
 * thin setup wrapper that creates the tracker and registers its update
 * callback on the event source.
 *
 * @module streaming/SegmentTrackerSetup
 * @original Module_14430
 */

import { A9a as SegmentTracker } from '../modules/Module_57966.js';

/**
 * Sets up a segment tracker and binds it to the event source.
 */
export class SegmentTrackerSetup {
  /**
   * @param {object} config - Tracker configuration.
   * @param {object} console - Logger instance.
   * @param {object} eventSource - Observable that fires on segment changes.
   * @param {object} managerRef - Reference to the parent manager.
   * @param {object} cn - Connection/context object.
   * @param {object} configParam - Additional configuration parameter.
   * @param {*} initialState - Initial state for the tracker.
   */
  constructor(config, console, eventSource, managerRef, cn, configParam, initialState) {
    /** @private */
    this.config = config;
    /** @private */
    this.console = console;
    /** @private */
    this.eventSource = eventSource;
    /** @private */
    this.managerRef = managerRef;
    /** @private */
    this.cn = cn;
    /** @private */
    this.configParam = configParam;

    /**
     * The underlying segment tracker instance.
     * @type {SegmentTracker}
     */
    this.tracker = new SegmentTracker(
      this.config,
      this.console,
      this.eventSource,
      this.managerRef,
      this.cn,
      this.configParam,
      initialState,
    );

    // Register the tracker's update callback on the event source
    this.eventSource.wac(this.tracker.asc.bind(this.tracker));
  }
}

export { SegmentTrackerSetup as x9a };
