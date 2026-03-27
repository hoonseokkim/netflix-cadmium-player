/**
 * @module LiveAdBreakPrepLogblobBuilder
 * @description Logblob builder that collects telemetry data about the preparation
 * phase of live ad breaks. Tracks three preparation stages:
 *
 * 1. **auxManifest** - When a branch viewable (auxiliary manifest) is received or
 *    fails for an ad playgraph. This covers the initial manifest fetch for the ad break.
 *
 * 2. **hydration** - When an ad break is hydrated (fully populated with ad data)
 *    or hydration fails/is skipped.
 *
 * 3. **prefetch** - When DAI (Dynamic Ad Insertion) prefetch completes or fails,
 *    providing cache updates for upcoming ad breaks.
 *
 * Each stage produces an ad impression data payload that is emitted as a
 * "liveadbreakprep" logblob event for Netflix's telemetry infrastructure.
 *
 * @original Module_10940
 */

import { __assign } from '../ads/AdBreakMismatchLogger.js';      // tslib helpers
import { EventEmitter } from '../events/EventEmitter.js';    // Module 90745
import { TimeUtil } from '../timing/TimeUtil.js';             // Module 91176
import * as ErrorUtil from '../modules/Module_95407.js';      // bD.getErrorCode error code extraction
import { LogblobPhase } from '../modules/Module_60028.js';    // Z7 enum (StartPlayback, Creation, etc.)

/**
 * Builds "liveadbreakprep" logblob events that report on the preparation
 * stages of live ad breaks (manifest fetching, hydration, DAI prefetch).
 *
 * Implements the logblob builder interface:
 * - `logblobType` identifies the event type
 * - `reportInterval` controls collection frequency
 * - `startPhase` determines when collection begins
 * - `execute()` returns the next pending event (if any)
 */
export class LiveAdBreakPrepLogblobBuilder {
  /**
   * @param {Object} segmentMap - The segment map providing access to playback container and player state.
   * @param {EventEmitter} adBreakEvents - Event emitter for ad break lifecycle events
   *   (adBreakHydrated, adBreakHydrationFailed, adBreakHydrationSkipped).
   */
  constructor(segmentMap, adBreakEvents) {
    /** @type {Object} */
    this.segmentMap = segmentMap;

    /** @type {string} Logblob event type identifier */
    this.logblobType = 'liveadbreakprep';

    /** @type {number} Report interval (one-shot, reports once per data availability) */
    this.reportInterval = TimeUtil.uh;

    /** @type {EventEmitter} Emits "collectionRequested" when new data is ready */
    this.events = new EventEmitter();

    /** @type {number} Phase at which this builder starts collecting (after playback starts) */
    this.startPhase = LogblobPhase.StartPlayback;

    /** @private @type {Object|undefined} Pending ad impression data to be reported */
    this.adImpressionData = undefined;

    // Listen for ad break hydration lifecycle events
    adBreakEvents.addListener('adBreakHydrated', this.onAdBreakHydrated.bind(this));
    adBreakEvents.addListener('adBreakHydrationFailed', this.onAdBreakHydrationFailed.bind(this));
    adBreakEvents.addListener('adBreakHydrationSkipped', this.onAdBreakHydrationFailed.bind(this));

    // Listen for branch viewable (auxiliary manifest) events from the segment map
    segmentMap.events.addListener('branchViewableReceived', this.onBranchViewableReceived.bind(this));
    segmentMap.events.addListener('branchViewableFailed', this.onBranchViewableFailed.bind(this));
  }

  /**
   * Registers DAI (Dynamic Ad Insertion) prefetch event listeners on the given emitter.
   * Called after construction when the DAI prefetch controller becomes available.
   *
   * @param {EventEmitter} daiPrefetchEvents - Emitter for DAI prefetch lifecycle events.
   */
  registerDaiPrefetchListeners(daiPrefetchEvents) {
    daiPrefetchEvents.addListener('daiPrefetchComplete', this.onDaiPrefetchComplete.bind(this));
    daiPrefetchEvents.addListener('daiPrefetchFailed', this.onDaiPrefetchFailed.bind(this));
  }

  /**
   * Builds request/response timing information from a viewable session's network state.
   *
   * @private
   * @param {Object} viewableSession - The viewable session containing network state.
   * @param {Object} [requestInfo] - Request timing info with jC (request timestamp) and mC (response timestamp).
   * @returns {{ requestTime: number|undefined, requestSoffms: number|undefined, responseSoffms: number|undefined }}
   */
  buildRequestTimingData(viewableSession, requestInfo) {
    const defaultTimeOffset = this.segmentMap.player.defaultTimeOffset;
    return {
      requestTime: requestInfo?.jC
        ? viewableSession.networkState?.q2a(requestInfo.jC)
        : undefined,
      requestSoffms: requestInfo?.jC
        ? requestInfo.jC - defaultTimeOffset
        : undefined,
      responseSoffms: requestInfo?.mC
        ? requestInfo.mC - defaultTimeOffset
        : undefined,
    };
  }

  /**
   * Handles successful receipt of a branch viewable (auxiliary manifest) for an ad playgraph.
   * Collects impression data including manifest ID, playback context, ad scheduling info,
   * and request timing.
   *
   * @private
   * @param {Object} event - Branch viewable received event.
   */
  onBranchViewableReceived(event) {
    if (
      event.adc &&
      event.viewableSession.jk &&
      event.viewableSession.jk.isAdPlaygraph &&
      event.viewableSession.jk.manifestRef?.adverts?.hasAdverts
    ) {
      const requestInfo = event.q4a;
      const adSchedulingData = event.ase_Ow;
      const currentSegment = event.currentSegment;

      // Look up ad break info from the ad break player
      const adBreakInfo = this.segmentMap.playbackContainer?.adBreakPlayer?.pS(currentSegment.id);
      const adBreakDetails = adBreakInfo?.xf || {};
      const adBreakTriggerId = adBreakDetails.hb;
      const autoskip = adBreakDetails.qo;
      const adBreakLocationMs = adBreakDetails.kj;

      // Extract ad scheduling window data
      const scheduling = adSchedulingData || {};
      const windowDurationMs = scheduling.ase_Xia;
      const anchorTime = scheduling.TQ;
      const targetOffsetMs = scheduling.K4;
      const targetTime = scheduling.xC;
      const timeRandomizationWasCalculated = scheduling.timeRandomizationWasCalculated;

      this.adImpressionData = {
        ...{
          prep: 'auxManifest',
          auxMid: event.viewableSession.J.toString(),
          auxPlaybackcontextid: event.viewableSession.manifestRef?.playbackContextId,
        },
        ...this.buildRequestTimingData(event.viewableSession.jk, requestInfo),
        windowDurationMs,
        anchorTime,
        targetOffsetMs,
        targetTime,
        timeRandomizationWasCalculated,
        adBreakTriggerId,
        autoskip,
        adBreakLocationMs,
      };

      this.events.emit('collectionRequested');
    }
  }

  /**
   * Handles failure to fetch a branch viewable (auxiliary manifest) for an ad playgraph.
   * Records the error code along with available ad scheduling and timing data.
   *
   * @private
   * @param {Object} event - Branch viewable failed event.
   */
  onBranchViewableFailed(event) {
    if (
      event.jk &&
      event.jk.isAdPlaygraph &&
      event.jk.manifestRef?.adverts?.hasAdverts
    ) {
      const requestInfo = event.q4a;
      const adSchedulingData = event.ase_Ow;
      const currentSegment = event.currentSegment;
      const error = event.error;

      // Look up ad break info from the ad break player
      const adBreakInfo = this.segmentMap.playbackContainer?.adBreakPlayer?.pS(currentSegment.id);
      const adBreakDetails = adBreakInfo?.xf || {};
      const adBreakTriggerId = adBreakDetails.hb;
      const autoskip = adBreakDetails.qo;
      const adBreakLocationMs = adBreakDetails.kj;

      // Extract ad scheduling window data
      const scheduling = adSchedulingData || {};
      const windowDurationMs = scheduling.ase_Xia;
      const anchorTime = scheduling.TQ;
      const targetOffsetMs = scheduling.K4;
      const targetTime = scheduling.xC;
      const timeRandomizationWasCalculated = scheduling.timeRandomizationWasCalculated;

      // Extract error code, falling back to "failed"
      const errorCode = ErrorUtil.bD.getErrorCode(error) ?? 'failed';

      this.adImpressionData = {
        ...{
          prep: 'auxManifest',
          auxMid: event.J.toString(),
        },
        ...this.buildRequestTimingData(event.jk, requestInfo),
        windowDurationMs,
        anchorTime,
        targetOffsetMs,
        targetTime,
        timeRandomizationWasCalculated,
        adBreakTriggerId,
        autoskip,
        adBreakLocationMs,
        errorCode,
      };

      this.events.emit('collectionRequested');
    }
  }

  /**
   * Handles successful ad break hydration. Records hydration-specific data including
   * planned ad break duration, distances from live edge, and ad scheduling parameters.
   *
   * @private
   * @param {Object} event - Ad break hydrated event.
   */
  onAdBreakHydrated(event) {
    if (
      event.jn.isAdPlaygraph &&
      event.jn.manifestRef.adverts?.hasAdverts
    ) {
      const adBreakTriggerId = event.hb;
      const adBreakConfig = event.B9;
      const schedulingData = event.ase_Ow || {};

      const distanceFromLiveEdgeMs = schedulingData.ase_Lxb;
      const distanceToAdBreakMs = schedulingData.ase_Mxb;
      const windowDurationMs = schedulingData.ase_Xia;
      const targetOffsetMs = schedulingData.K4;
      const targetTime = schedulingData.xC;
      const timeRandomizationWasCalculated = schedulingData.timeRandomizationWasCalculated;

      const autoskip = adBreakConfig.qo;
      const adDurations = adBreakConfig.duration;
      const adBreakLocationMs = event.IO.kj;

      this.adImpressionData = {
        ...{ prep: 'hydration' },
        ...this.buildRequestTimingData(event.jn, event.AJ),
        adBreakTriggerId,
        autoskip,
        adBreakLocationMs,
        adBreakDurationPlanned: adDurations?.reduce(
          (total, segment) => total + segment.contentEndPts - segment.startTimeMs,
          0
        ),
        distanceFromLiveEdgeMs,
        distanceToAdBreakMs,
        windowDurationMs,
        targetOffsetMs,
        targetTime,
        timeRandomizationWasCalculated,
      };

      this.events.emit('collectionRequested');
    }
  }

  /**
   * Handles ad break hydration failure or skip. Records error information along
   * with available scheduling data. Reuses the same handler for both
   * "adBreakHydrationFailed" and "adBreakHydrationSkipped" events.
   *
   * @private
   * @param {Object} event - Ad break hydration failed/skipped event.
   */
  onAdBreakHydrationFailed(event) {
    if (
      event.jn.isAdPlaygraph &&
      event.jn.manifestRef.adverts?.hasAdverts
    ) {
      const requestInfo = event.AJ;
      const adBreakTriggerId = event.hb;
      const schedulingData = event.ase_Ow || {};

      const distanceFromLiveEdgeMs = schedulingData.ase_Lxb;
      const distanceToAdBreakMs = schedulingData.ase_Mxb;
      const windowDurationMs = schedulingData.ase_Xia;
      const targetOffsetMs = schedulingData.K4;
      const targetTime = schedulingData.xC;
      const timeRandomizationWasCalculated = schedulingData.timeRandomizationWasCalculated;

      const adBreakLocationMs = event.IO.kj;
      let errorCode = event.errorCode;
      if (!errorCode) {
        errorCode = event.type === 'adBreakHydrationSkipped' ? 'skipped' : 'failed';
      }

      this.adImpressionData = {
        ...{ prep: 'hydration' },
        ...this.buildRequestTimingData(event.jn, requestInfo),
        adBreakTriggerId,
        autoskip: undefined,
        adBreakLocationMs,
        errorCode,
        distanceFromLiveEdgeMs,
        distanceToAdBreakMs,
        windowDurationMs,
        targetOffsetMs,
        targetTime,
        timeRandomizationWasCalculated,
      };

      this.events.emit('collectionRequested');
    }
  }

  /**
   * Handles successful DAI prefetch completion. Records which ad break triggers
   * were upserted in the cache, along with window and timing parameters.
   *
   * @private
   * @param {Object} event - DAI prefetch complete event.
   */
  onDaiPrefetchComplete(event) {
    if (event.viewableSession.isAdPlaygraph) {
      const requestInfo = event.AJ;
      const schedulingData = event.ase_Ow;

      // Filter to only ad break triggers that had an UPSERT action
      const adBreakTriggerIds = Object.keys(event.lOb.adBreakCacheUpdates).filter(
        (triggerId) => event.lOb.adBreakCacheUpdates[triggerId].action === 'UPSERT'
      );

      this.adImpressionData = {
        ...{ prep: 'prefetch' },
        ...this.buildRequestTimingData(event.viewableSession, requestInfo),
        adBreakTriggerIds,
        windowOffsetMs: schedulingData.windowOffsetMs,
        windowDurationMs: schedulingData.windowDurationMs,
        presentationOffsetMs: schedulingData.nya,
        anchorSource: schedulingData.anchorSource,
        anchorTime: schedulingData.TQ.playbackSegment,
        targetOffsetMs: schedulingData.xC - schedulingData.windowOffsetMs,
        targetTime: schedulingData.TQ.playbackSegment + schedulingData.nya + schedulingData.xC,
        timeRandomizationWasCalculated: schedulingData.timeRandomizationWasCalculated,
      };

      this.events.emit('collectionRequested');
    }
  }

  /**
   * Handles DAI prefetch failure. Records error information along with available
   * window and timing parameters.
   *
   * @private
   * @param {Object} event - DAI prefetch failed event.
   */
  onDaiPrefetchFailed(event) {
    if (event.viewableSession.isAdPlaygraph) {
      const requestInfo = event.AJ;
      const schedulingData = event.ase_Ow;
      const errorCode = event.errorCode ?? 'failed';

      this.adImpressionData = {
        ...{ prep: 'prefetch' },
        ...this.buildRequestTimingData(event.viewableSession, requestInfo),
        adBreakTriggerIds: undefined,
        windowOffsetMs: schedulingData.windowOffsetMs,
        windowDurationMs: schedulingData.windowDurationMs,
        presentationOffsetMs: schedulingData.nya,
        anchorSource: schedulingData.anchorSource,
        anchorTime: schedulingData.TQ.playbackSegment,
        targetOffsetMs: schedulingData.xC - schedulingData.windowOffsetMs,
        targetTime: schedulingData.TQ.playbackSegment + schedulingData.nya + schedulingData.xC,
        timeRandomizationWasCalculated: schedulingData.timeRandomizationWasCalculated,
        errorCode,
      };

      this.events.emit('collectionRequested');
    }
  }

  /**
   * Executes the logblob builder, returning the next pending "liveadbreakprep" event
   * if data is available. Clears the pending data after returning it.
   *
   * @returns {{ hasData: boolean, event?: Object }} Result with hasData flag and optional logblob event.
   */
  execute() {
    if (this.adImpressionData) {
      const data = this.adImpressionData;
      this.adImpressionData = undefined;
      return {
        hasData: true,
        event: {
          type: 'logblob',
          logblobType: 'liveadbreakprep',
          ...data,
        },
      };
    }
    return { hasData: false };
  }
}
