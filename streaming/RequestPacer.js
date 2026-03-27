/**
 * Netflix Cadmium Player - RequestPacer
 * Webpack Module 19089 (exported as `RequestPacer`)
 *
 * Paces and throttles outgoing media segment download requests to ensure
 * no more than `maxAllowedOutstandingRequests` are in-flight simultaneously.
 *
 * When a request opportunity arises (e.g. a segment finishes downloading or
 * the playgraph signals new data is needed), the pacer coalesces triggers
 * via a microtask, then runs an opportunity loop that repeatedly calls the
 * `requestFactory` callback. Each invocation either returns a request to
 * issue (with a `factorySymbol`) or a rejection reason. If the factory
 * returns a numeric `delayMs` instead, the pacer schedules a deferred
 * re-check after that many milliseconds.
 *
 * Logging is performed through Netflix's "laser" diagnostic system and
 * decorated console-logger methods.
 *
 * Original obfuscated name: class `k` in Module 19089
 */

// Dependencies (webpack module references):
// import { __awaiter, __generator, __decorate } from './Module_22970';  // 22970 - tslib helpers
// import { platform } from './Module_66164';           // 66164 - platform abstraction (now(), Console)
// import { ie, TimeUtil } from './Module_91176';       // 91176 - time utilities (millisecondsDelay, fromMilliseconds)
// import { laser } from './Module_97685';              // 97685 - laser diagnostic logger
// import { assert } from './Module_52571';             // 52571 - assertion utility
// import { consoleLogger, SessionMetricsClass } from './Module_61996';  // 61996 - console logging decorator + metrics
// import { jh as RunningStatistic } from './Module_69575';  // 69575 - running statistic / sliding window

import { __awaiter, __generator, __decorate } from '../core/tslib.js';
import { platform } from '../core/platform.js';
import { TimeInterval, TimeUtil } from '../timing/TimeUtil.js';
import { laser } from '../telemetry/laser.js';
import { assert } from '../assert/assert.js';
import { consoleLogger, SessionMetricsClass } from '../monitoring/SessionMetrics.js';
import { RunningStatistic } from '../utils/RunningStatistic.js';

/**
 * Configuration for the RequestPacer.
 * @typedef {Object} RequestPacerConfig
 * @property {number} maxAllowedOutstandingRequests - Maximum concurrent in-flight requests
 */

/**
 * Result returned by the request factory callback.
 * @typedef {Object} RequestFactoryResult
 * @property {symbol|undefined} factorySymbol - Present if a request was successfully created
 * @property {string} [reason] - Reason the request opportunity was rejected
 * @property {number} [delayMs] - Millisecond delay before retrying (deferred availability)
 */

/**
 * Segment descriptor passed to addRequest / recordRequestComplete.
 * @typedef {Object} SegmentDescriptor
 * @property {string} mediaType - The media type (audio/video/text)
 * @property {{ playbackSegment: number }} [presentationStartTime] - Start PTS
 * @property {{ playbackSegment: number }} [segmentEndTime] - End PTS
 */

/**
 * Paces outgoing media segment requests, ensuring the number of
 * concurrent in-flight requests does not exceed a configured maximum.
 */
export class RequestPacer {
  /**
   * @param {() => RequestFactoryResult} requestFactory - Callback that attempts to
   *   create and issue a new download request. Returns a result indicating success
   *   (with `factorySymbol`) or rejection (with `reason` / `delayMs`).
   * @param {Object} engineScheduler - Scheduler for deferred tasks (e.g. delayed re-checks)
   * @param {RequestPacerConfig} config - Configuration object
   */
  constructor(requestFactory, engineScheduler, config) {
    /** @private */
    this._requestFactory = requestFactory;
    /** @private */
    this._engineScheduler = engineScheduler;
    /** @private */
    this._config = config;

    /** @type {number} Number of requests currently in flight */
    this.numOutstanding = 0;

    /** @private */
    this._console = new platform.Console('ASEJS_REQUEST_PACER', 'media|asejs');

    /** @private {boolean} Whether a check-opportunity microtask is already scheduled */
    this._opportunityScheduled = false;

    /** @private {number} The delay (ms) of the currently active deferred availability task */
    this._currentDeferredDelay = -Infinity;

    /** @private {Object|undefined} Handle to the currently scheduled deferred availability task */
    this._deferredTask = undefined;

    /** @private */
    this._sessionMetrics = new SessionMetricsClass({
      Ej: this,
      source: 'RequestPacer',
      grb: () => ({
        numOutstanding: this.numOutstanding,
      }),
      isLive: 10,
    });

    /** @private {RunningStatistic} Tracks scheduling-to-execution latency */
    this._schedulingLatencyStats = new RunningStatistic();
  }

  /**
   * The number of outstanding (in-flight) requests.
   * @type {number}
   * @readonly
   */
  get outstandingRequestCount() {
    return this.numOutstanding;
  }

  /**
   * Schedules a request opportunity check on the next microtask.
   * Multiple calls within the same tick are coalesced into a single check.
   *
   * Decorated with @consoleLogger({ methodName: 'checkRequestOpportunity' })
   *
   * @param {string} trigger - Descriptive label for what triggered this opportunity
   *   (e.g. 'prunedRequest', 'playgraphOpportunity', 'deferredAvailabilityDelay')
   * @returns {Promise<void>|undefined} A promise if a microtask was scheduled, undefined if coalesced
   */
  checkRequestOpportunity(trigger) {
    if (this._opportunityScheduled) {
      return;
    }

    this._opportunityScheduled = true;
    const scheduledAt = platform.platform.now();

    return Promise.resolve().then(() => {
      this._opportunityScheduled = false;
      this._runOpportunityLoop(trigger, scheduledAt);
    });
  }

  /**
   * Records that a new request has been issued (increments outstanding count).
   * Emits a diagnostic event with the segment's PTS range and asserts
   * the outstanding count has not exceeded the configured maximum.
   *
   * Decorated with @consoleLogger({ methodName: 'addRequest' })
   *
   * @param {SegmentDescriptor} segment - The segment being requested
   */
  addRequest(segment) {
    this._sessionMetrics.emitDiagnosticEvent({
      mediaType: segment.mediaType,
      contentStartPts: segment.presentationStartTime?.playbackSegment,
      contentEndPts: segment.segmentEndTime?.playbackSegment,
    });

    this.numOutstanding++;

    assert(
      this.numOutstanding <= this._config.maxAllowedOutstandingRequests,
      'More than maxAllowedOutstandingRequests are outstanding'
    );
  }

  /**
   * Records that a request has completed (decrements outstanding count).
   * Emits a diagnostic event and triggers a new opportunity check
   * (since a slot has freed up).
   *
   * Decorated with @consoleLogger({ methodName: 'removeRequest' })
   *
   * @param {SegmentDescriptor} segment - The segment whose request completed
   */
  recordRequestComplete(segment) {
    this._sessionMetrics.emitDiagnosticEvent({
      mediaType: segment.mediaType,
      contentStartPts: segment.presentationStartTime?.playbackSegment,
      contentEndPts: segment.segmentEndTime?.playbackSegment,
    });

    this.numOutstanding--;

    assert(
      this.numOutstanding >= 0,
      'Received remove request when there are no requests outstanding'
    );

    this.checkRequestOpportunity('prunedRequest');
  }

  /**
   * Core opportunity loop: repeatedly asks the request factory for new
   * requests while there are available slots (outstanding < max).
   *
   * For each iteration:
   * 1. If already at capacity, log the rejection and exit.
   * 2. Call the request factory.
   * 3. If the factory returned no `factorySymbol` but a numeric `delayMs`,
   *    schedule a deferred re-check.
   * 4. If a request was issued, increment the counter and continue.
   * 5. Otherwise, exit the loop.
   *
   * @private
   * @param {string} trigger - What triggered this opportunity loop
   * @param {number} scheduledAt - Timestamp (ms) when the opportunity was first scheduled
   */
  _runOpportunityLoop(trigger, scheduledAt) {
    const maxOutstanding = this._config.maxAllowedOutstandingRequests;
    const timeSinceScheduled = platform.platform.now() - scheduledAt;
    let requestsIssued = 0;

    this._schedulingLatencyStats.push(timeSinceScheduled);

    // Log if we're already at capacity
    if (laser.isEnabled && this.numOutstanding === maxOutstanding) {
      laser.log({
        type: 'REQUEST_OPPORTUNITY',
        trigger,
        actioned: false,
        rejection: 'maxAllowedOutstandingRequests',
      });
    }

    // Issue requests while there are available slots
    while (this.numOutstanding < maxOutstanding) {
      const result = this._requestFactory();

      // If no request was created and result has a numeric delayMs, schedule deferred check
      if (!result.factorySymbol && typeof result.delayMs === 'number') {
        this._scheduleDeferredAvailability(result);
      }

      // Log the opportunity result
      if (laser.isEnabled) {
        if (result.factorySymbol) {
          laser.log({
            type: 'REQUEST_OPPORTUNITY',
            trigger,
            actioned: true,
          });
        } else {
          laser.log({
            type: 'REQUEST_OPPORTUNITY',
            trigger,
            actioned: false,
            rejection: result.reason,
          });
        }
      }

      // If no request was issued, stop the loop
      if (!result.factorySymbol) {
        break;
      }

      requestsIssued++;
    }

    // Emit completion metrics
    this._sessionMetrics.J9('requestOpportunityRunnerComplete', {
      requestsIssued,
      scheduledMs: scheduledAt,
      timeSinceScheduled,
    }, true);
  }

  /**
   * Schedules (or reschedules) a deferred availability check.
   * If a deferred task already exists with a longer delay than the new one,
   * the existing task is cancelled and replaced with the shorter delay.
   *
   * Decorated with @consoleLogger({ methodName: 'checkRequestOpportunityRunner' })
   *
   * @private
   * @param {RequestFactoryResult} result - The factory result containing the `delayMs` field
   */
  async _scheduleDeferredAvailability(result) {
    const delayMs = result.delayMs;

    // If there's an existing deferred task with a longer delay, cancel it
    if (this._deferredTask && delayMs < this._currentDeferredDelay) {
      this._deferredTask.destroy();
    } else if (this._deferredTask) {
      // Current task already has a shorter or equal delay; keep it
      return;
    }

    // Schedule a new deferred check
    this._deferredTask = this._engineScheduler.uu(
      TimeInterval.millisecondsDelay(TimeUtil.fromMilliseconds(delayMs)),
      () => {
        this.checkRequestOpportunity('deferredAvailabilityDelay');
        this._deferredTask = undefined;
        this._currentDeferredDelay = -Infinity;
      },
      'deferredAvailabilityTask'
    );

    this._currentDeferredDelay = delayMs;
  }
}

// Apply console-logger decorators (mirrors the original __decorate calls)
// These decorate the methods so that invocations are logged to the console
// under the specified method names with diagnostic-first (df) formatting.
//
// Original decorator mappings:
//   wl  -> 'checkRequestOpportunity'   (df + eventData)
//   by  -> 'addRequest'                (df)
//   lz  -> 'removeRequest'             (df)
//   aub -> 'checkRequestOpportunityRunner' (df)

export { RequestPacer as RequestPacer };
export default RequestPacer;
