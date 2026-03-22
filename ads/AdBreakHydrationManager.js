/**
 * Netflix Cadmium Player — Ad Break Hydration Manager
 *
 * Manages the lifecycle of ad-break hydration: scheduling, fetching, dehydrating,
 * and emitting hydration events so the playback pipeline can stitch dynamic ad
 * insertion (DAI) breaks into the stream at the correct presentation times.
 *
 * @module AdBreakHydrationManager
 */

// Dependencies
// import { __awaiter, __generator, __assign, __decorate, __read, __spreadArray } from 'tslib';
// import { EventEmitter } from './modules/EventEmitter';
// import { AbortController, Deferred, assert, findLast, gd, ooa, jic, wKb } from './modules/Utils';
// import { TimeUtil, observableBool } from './modules/TimeUtil';
// import { platform } from './modules/Platform';
// import { MediaType } from './modules/MediaType';
// import { timeSlice, F7 } from './modules/StreamConstants';
// import { dataBucketSymbol } from './modules/SegmentMap';
// import { ie } from './modules/SchedulerEvents';
// import { u as DEBUG } from './modules/Debug';
// import { oAb } from './modules/BranchUtils';
// import { SessionMetricsClass, consoleLogger } from './modules/SessionMetrics';
// import { ko } from './modules/SessionMetricsSink';
// import { mathTanh as createScopedConsole } from './modules/ConsoleFactory';
// import { bD as ErrorParser } from './modules/ErrorParser';

/** Error codes that allow ad-break playback to continue after a failed hydration. */
export const RECOVERABLE_AD_BREAK_ERRORS = ["AD_BREAK_UNAVAILABLE"];

/**
 * Internal tracking entry for a single ad-break hydration request.
 * Each scheduled ad break gets one HydrationItem that carries its abort
 * controller, deferred gate, and completion state.
 */
class HydrationItem {
  /**
   * @param {string} viewableId - Parent viewable identifier.
   * @param {object} adBreak   - Ad-break descriptor from the manifest.
   */
  constructor(viewableId, adBreak) {
    /** @type {string} */
    this.viewableId = viewableId;

    /** @type {object} */
    this.adBreak = adBreak;

    /** @type {boolean} Whether the hydration request has been dispatched. */
    this.hydrationDispatched = false;

    /** @type {boolean} Whether the ad-break data has been fully hydrated. */
    this.adBreakHydrated = false;

    /** @type {boolean} Whether this item was cancelled because the player passed it. */
    this.cancelledAsTooLate = false;

    /** @type {number} Sequence id assigned when hydration completes (-1 = unset). */
    this.seqId = -1;

    /** @type {AbortController} Per-item abort controller for cancellation. */
    this.abortController = new AbortController();

    /** @type {Deferred} Resolves when the item is expedited (e.g. live catch-up). */
    this.expediteDeferred = new Deferred();
  }

  /**
   * Structural equality check used by the diff algorithm.
   * @param {HydrationItem} a
   * @param {HydrationItem} b
   * @returns {boolean}
   */
  static isEqual(a, b) {
    return b.viewableId === a.viewableId && b.adBreak === a.adBreak;
  }

  /** @returns {AbortSignal} */
  get abortSignal() {
    return this.abortController.signal;
  }

  /** Abort the current controller and create a fresh one. */
  resetAbortController() {
    this.abort();
    this.abortController = new AbortController();
  }

  /** Signal abort on the current controller. */
  abort() {
    this.abortController.abort();
  }

  /** Mark the expedite gate as resolved so waiting promises can proceed. */
  resolveExpedite() {
    this.expediteDeferred.resolve();
  }
}

/**
 * Orchestrates ad-break hydration for a single playback session.
 *
 * Hydration is the process of fetching ad-break data (creative URLs,
 * duration info, third-party tracking pixels, etc.) ahead of the playback
 * position so that the player can seamlessly insert ads.
 */
class AdBreakHydrationManager {
  /**
   * @param {object} trackIdProvider    - Provides viewable creation and upload-queue helpers.
   * @param {object} playgraph          - The active playgraph instance.
   * @param {object} playerCore         - Player-core scheduler / timing reference.
   * @param {object} config             - Ad-hydration configuration blob.
   * @param {object} consoleInstance    - Base console logger.
   */
  constructor(trackIdProvider, playgraph, playerCore, config, consoleInstance) {
    /** @type {object} */
    this.trackIdProvider = trackIdProvider;

    /** @type {object} */
    this.playgraph = playgraph;

    /** @type {object} */
    this.playerCore = playerCore;

    /** @type {object} */
    this.config = config;

    /** @type {HydrationItem[]} Active hydration items. */
    this.items = [];

    /** @type {Map<string, object>} Map of hydration-event descriptors keyed by ad-break id. */
    this.hydrationEvents = new Map();

    /** @type {number} Monotonically increasing sequence counter. */
    this.seqId = 1;

    /** @type {boolean} Whether the player has started (gate for hydration). */
    this.playerStarted = false;

    /** @type {EventEmitter} */
    this.events = new EventEmitter();

    // Wait for the player-started signal before allowing hydration.
    const self = this;
    this.playgraph.branchScheduler.createScheduledTask(function* () {
      yield ie.QBa;
      self.playerStarted = true;
    }, "playerStartedHydrator");

    /** @type {object} Scoped console. */
    this.console = createScopedConsole(platform, consoleInstance, "ADBREAKHYDRATOR");

    /** @type {SessionMetricsClass} */
    this.sessionMetrics = new SessionMetricsClass({
      Ej: this,
      source: "AdBreakHydrator",
      console: this.console,
    });

    this.playgraph.eventProcessingPipeline.getRemaining(
      new ko(this.sessionMetrics)
    );

    /** @type {object} Snapshot of the current-time at construction (used for pacing). */
    this.lastHydrationTime = this.playerCore.playerCore.currentTime;
  }

  // ──────────────────────────────────────────────
  //  Hydration-event bookkeeping
  // ──────────────────────────────────────────────

  /**
   * Build a unique string key for an ad-break, using either its
   * `currentIndexValue` or a positional fallback.
   *
   * @param {object}  adBreak       - Ad-break descriptor.
   * @param {number} [displayOrder] - Fallback positional index.
   * @returns {string}
   */
  buildAdBreakKey(adBreak, displayOrder) {
    if (adBreak?.currentIndexValue !== undefined) {
      const indexValue = adBreak.currentIndexValue();
      return `${adBreak.timedTextDownloadRetryCountBeforeCdnSwitch}:${indexValue ?? ""}`;
    }
    return `${displayOrder}:${adBreak.metadata.hb ?? ""}`;
  }

  /**
   * Store a hydration event (hydrated / dehydrated / tooLate / skipped / failed).
   *
   * @param {object} adBreak      - Ad-break descriptor.
   * @param {object} hydrationEvt - The event payload.
   */
  setHydrationEvent(adBreak, hydrationEvt) {
    const key = this.buildAdBreakKey(adBreak);
    this.sessionMetrics.emitDiagnosticEvent({
      id: key,
      Sed: hydrationEvt.type,
    });
    if (DEBUG) {
      this.console.log("Setting hydration event", {
        id: key,
        event: { ...hydrationEvt, jn: undefined },
      });
    }
    this.hydrationEvents.set(key, hydrationEvt);
  }

  /**
   * Clear all stored hydration events (e.g. on seek).
   */
  clearAllHydrationEvents() {
    const self = this;
    this.sessionMetrics.emitDiagnosticEvent({
      Pgd: Array.from(this.hydrationEvents.values()).map((evt) =>
        self.buildAdBreakKey(evt.IO)
      ),
    });
    this.console.log("Clearing adBreak hydrator events on seek");
    this.hydrationEvents.clear();
  }

  /**
   * Cancel in-flight hydrations for a specific ad-break id and mark them as
   * "tooLate" so the player skips the break.
   *
   * @param {string} adBreakId
   */
  cancelAndSkipAdBreak(adBreakId) {
    const self = this;
    this.items = this.items.filter((item) => {
      if (
        adBreakId.length &&
        item.adBreak.currentIndexValue() === adBreakId &&
        !item.adBreakHydrated
      ) {
        if (DEBUG) {
          self.console.log("Cancelling adBreak hydrations for", {
            viewableId: item.viewableId,
            timedTextDownloadRetryCountBeforeCdnSwitch:
              item.adBreak.timedTextDownloadRetryCountBeforeCdnSwitch,
            hb: adBreakId,
          });
        }
        item.cancelledAsTooLate = true;
        item.abort();
        self.setHydrationEvent(item.adBreak, {
          type: "tooLate",
          L: undefined,
          seqId: -1,
          IO: item.adBreak,
        });
        return false;
      }
      return true;
    });
  }

  // ──────────────────────────────────────────────
  //  Applying hydration results to the ad-break list
  // ──────────────────────────────────────────────

  /**
   * Walk the incoming ad-break descriptors and merge any stored hydration
   * events into them, returning an updated array ready for presentation.
   *
   * @param {object[]} adBreaks - Raw ad-break descriptors.
   * @returns {object[]}
   */
  applyHydrationResults(adBreaks) {
    const self = this;
    if (!this.hydrationEvents.size) return adBreaks;

    return adBreaks.map((adBreak, index) => {
      const key = self.buildAdBreakKey(adBreak, index);
      if (!key || !self.hydrationEvents.has(key)) return adBreak;

      const evt = self.hydrationEvents.get(key);

      // ── Too late: mark as skipped ──
      if (evt?.type === "tooLate") {
        adBreak.state.sj = false;
        adBreak.state.MB = true;
        return adBreak;
      }

      // ── Dehydration placeholder ──
      if (evt?.type === "dehydration") {
        return {
          xa: {
            ...adBreak.metadata,
            yb: evt.cQa ? undefined : [],
            actionAdBreakEvents: {},
            source: "hydration",
          },
          state: {
            ...adBreak.state,
            Fn: !evt.cQa,
            sequenceId: evt?.seqId,
            sj: evt.cQa,
            isSkippableAd: evt.isSkippableAd,
          },
        };
      }

      const parentViewable = evt.jn;
      const hasAdverts =
        parentViewable.isAdPlaygraph &&
        !!parentViewable.manifestRef.adverts?.hasAdverts;

      // ── Fully hydrated ──
      if (evt.type === "adBreakHydrated") {
        const hydratedData = evt.B9;
        const adBreakToken = evt.adBreakToken;
        const hb = evt.hb;
        const {
          locationMs,
          kj: originalLocationMs,
          location,
          timeValue,
          expirationObject,
          duration,
        } = adBreak.metadata;
        const timedTextRetryId =
          adBreak.metadata.type === "dynamic"
            ? adBreak.metadata.timedTextDownloadRetryCountBeforeCdnSwitch
            : undefined;

        return {
          xa: {
            ...hydratedData,
            kj: originalLocationMs,
            locationMs,
            location,
            duration: hydratedData.yu
              ? expirationObject || duration
              : hydratedData.duration?.length
                ? hydratedData.duration.reduce(
                    (acc, ad) =>
                      acc.item(
                        TimeUtil.fromMilliseconds(
                          ad.contentEndPts - ad.startTimeMs
                        )
                      ),
                    TimeUtil.seekToSample
                  )
                : TimeUtil.seekToSample,
            expirationObject: expirationObject || TimeUtil.seekToSample,
            timeValue,
            adBreakToken,
            hb,
            timedTextDownloadRetryCountBeforeCdnSwitch: timedTextRetryId,
            source: "hydration",
            type: hydratedData.yu ? "embedded" : "dynamic",
          },
          state: {
            ...adBreak.state,
            Fn: true,
            sj: false,
            sequenceId: evt?.seqId,
            DM: false,
          },
        };
      }

      // ── Adverts exist but not yet hydrated: mark for discovery ──
      if (hasAdverts) {
        adBreak.state.findNode = true;
        adBreak.state.sequenceId = evt?.seqId;
      } else if (evt.type === "adBreakHydrationSkipped") {
        adBreak.state.findNode = false;
        adBreak.state.sj = false;
        adBreak.state.DM = true;
        adBreak.state.sequenceId = evt?.seqId;
      }

      return adBreak;
    });
  }

  // ──────────────────────────────────────────────
  //  Dehydration (reverting a hydrated break)
  // ──────────────────────────────────────────────

  /**
   * Dehydrate a set of previously-hydrated ad breaks (e.g. on rewind past them).
   *
   * @param {object[]} adBreaks  - Ad-break descriptors to dehydrate.
   * @param {boolean}  forceSkip - If true, force skippability.
   */
  dehydrateAdBreaks(adBreaks, forceSkip) {
    const self = this;
    const results = adBreaks
      .map((ab) => [
        self.processDehydration(ab, forceSkip),
        {
          index: ab.timedTextDownloadRetryCountBeforeCdnSwitch,
          Omd: ab.hb,
        },
      ])
      .filter((entry) => gd(entry[0]));
    this.sessionMetrics.emitDiagnosticEvent({ dehydrated: results });
  }

  /**
   * Process dehydration for a single ad break.
   *
   * @param {object}  adBreak   - Ad-break descriptor.
   * @param {boolean} forceSkip - Whether to force-skip the break.
   * @returns {string|undefined} Previous event type if changed.
   * @private
   */
  processDehydration(adBreak, forceSkip) {
    if (!adBreak.isMissing) return;

    const key = this.buildAdBreakKey(adBreak);
    let previousType;
    if (this.hydrationEvents.has(key)) {
      previousType = this.hydrationEvents.get(key)?.type;
    }

    if (adBreak.currentIndexValue() || adBreak.internal_Ura()) {
      const triggerId = adBreak.internal_Ura();
      const indexValue = adBreak.currentIndexValue();

      this.hydrationEvents.set(key, {
        type: "dehydration",
        L: undefined,
        seqId: this.seqId++,
        cQa: forceSkip || !adBreak.isSkippableAd,
        isSkippableAd: forceSkip ? false : adBreak.isSkippableAd,
        IO: {
          Ub: adBreak.timedTextDownloadRetryCountBeforeCdnSwitch,
          internal_Ura: () => triggerId,
          currentIndexValue: () => indexValue,
          isSkippableAd: adBreak.isSkippableAd,
          isMissing: adBreak.isMissing,
          kj: adBreak.kj,
        },
      });

      return previousType !== "dehydration" ? previousType : undefined;
    }
  }

  // ──────────────────────────────────────────────
  //  Scheduling
  // ──────────────────────────────────────────────

  /**
   * Evaluate which ad breaks need hydration and schedule fetches accordingly.
   * Called whenever the ad-break schedule changes.
   *
   * @param {Array<{viewableId: string, adBreak: object, cda: boolean}>} schedule
   */
  async scheduleAdBreakHydration(schedule) {
    const self = this;
    const pairs = schedule.map((entry) => [
      new HydrationItem(entry.viewableId, entry.adBreak),
      entry.cda,
    ]);
    const newItems = pairs.map(([item]) => item);
    const diff = jic(this.items, newItems, HydrationItem.isEqual);
    this.items = diff.result;

    // Abort any removed items that were not yet hydrated.
    diff.dga.forEach((item) => {
      if (!item.adBreakHydrated) item.abort();
    });

    // Resolve the expedite gate for items whose `cda` flag is set.
    pairs
      .filter(([, cda]) => cda)
      .forEach(([target]) => {
        const found = findLast(self.items, (i) =>
          HydrationItem.isEqual(i, target)
        );
        found?.resolveExpedite();
      });

    if (DEBUG) {
      this.console.log("Evaluated schedule", {
        added: diff.krb.length,
        removed: diff.dga.length,
        kept: diff.qya.length,
        total: diff.result.length,
      });
    }
    this.sessionMetrics.emitDiagnosticEvent({
      nbc: diff.krb.length,
      dga: diff.dga.length,
      qya: diff.qya.length,
      BKc: diff.result.length,
    });

    const hydrationPromises = this.items
      .filter((item) => !item.hydrationDispatched)
      .map((item) => self.scheduleHydration(item));

    if (timeSlice(this.playgraph.playgraphState.value)) {
      // Buffering — race so we release decompressor locks quickly.
      const decompressors = this.items.map(
        (item) => self.trackIdProvider.createViewable(item.viewableId).decompressor
      );
      try {
        await Promise.race(hydrationPromises);
      } finally {
        decompressors.forEach((d) => d.release());
      }
    } else {
      await Promise.all(hydrationPromises);
    }
  }

  /**
   * Schedule the hydration fetch for a single HydrationItem after
   * applying pacing gates (inter-break delay, proximity gate, rebuffer
   * detection).
   *
   * @param {HydrationItem} item
   * @private
   */
  async scheduleHydration(item) {
    if (DEBUG) {
      this.console.log("Start scheduling for adbreak", {
        lnd: item.viewableId,
        Ccd: item.adBreak.timedTextDownloadRetryCountBeforeCdnSwitch,
      });
    }
    const itemId = `${item.adBreak.timedTextDownloadRetryCountBeforeCdnSwitch}:${item.adBreak.currentIndexValue() ?? ""}`;
    this.sessionMetrics.emitDiagnosticEvent({ id: itemId });

    item.resetAbortController();
    const signal = item.abortSignal;
    const segmentRef = dataBucketSymbol(
      this.playgraph.segmentMap,
      item.viewableId,
      item.adBreak.timeValue
    );
    const cleanupPromise = ooa(signal);

    try {
      // Race: rebuffer-expedite vs. (pacing + proximity) vs. abort-cleanup.
      const reason = await Promise.race([
        (async () => {
          await this.waitForRebuffer(signal);
          if (DEBUG) this.console.log("Rebuffering detected, expediting hydration");
          return "rebuffer";
        })(),
        Promise.all([
          this.waitForInterBreakDelay(cleanupPromise),
          this.waitForProximityGate(segmentRef, cleanupPromise),
        ]).then(() => "gatesPassed"),
        cleanupPromise.then(() => "cleanup"),
      ]);

      if (DEBUG) this.console.log("Schedule completed for reason", reason);
      if (signal.aborted) return;

      if (DEBUG) {
        this.console.log("Making Item Fetch", {
          Dcd: item.adBreak.timedTextDownloadRetryCountBeforeCdnSwitch,
          locationMs: item.adBreak.location.playbackSegment,
        });
      }
      item.hydrationDispatched = true;
      await this.queueAdBreakHydration(item, reason, signal);
    } finally {
      // Clean up the item from the list if it was not replaced.
      if (item.abortSignal === signal) {
        const idx = this.items.indexOf(item);
        if (idx !== -1) {
          if (DEBUG) {
            this.console.log(
              `Removing item ${idx}, ${this.items.length - 1} left`
            );
          }
          this.items.splice(idx, 1);
        }
      }
    }
  }

  /**
   * Wait until the player enters a buffering / rebuffer state.
   *
   * @param {AbortSignal} signal
   * @private
   */
  async waitForRebuffer(signal) {
    if (timeSlice(this.playgraph.playgraphState.value)) {
      if (DEBUG) this.console.log("Buffering detected, expediting hydration");
      return;
    }
    return observableBool.H4c(
      [this.playgraph.playgraphState],
      ([state]) => timeSlice(state),
      signal
    );
  }

  /**
   * Pace hydration by waiting a configured minimum time since the last break.
   *
   * @param {Promise} cleanupPromise - Resolves on abort so the wait can be torn down.
   * @private
   */
  waitForInterBreakDelay(cleanupPromise) {
    const self = this;
    return new Promise((resolve) => {
      const targetTime = self.lastHydrationTime.item(
        TimeUtil.fromMilliseconds(self.config.hydrateWaitTimeBetweenAdBreaksMs)
      );
      const task = self.playerCore.uu(
        ie.millisecondsDelay(targetTime),
        resolve,
        "hydratorWaitTask"
      );
      cleanupPromise.then(() => task.destroy());
    });
  }

  /**
   * Wait until the playback position is close enough to the ad break.
   *
   * @param {object}  segmentRef     - Segment-map reference for the ad break.
   * @param {Promise} cleanupPromise - Resolves on abort.
   * @private
   */
  async waitForProximityGate(segmentRef, cleanupPromise) {
    if (!this.config.maxPlayerDistancePriorToAdBreakHydrationMs) {
      return Promise.resolve();
    }
    const maxDistance = TimeUtil.fromMilliseconds(
      this.config.maxPlayerDistancePriorToAdBreakHydrationMs
    );
    try {
      await new Promise((resolve) => {
        const node = this.playgraph.eB(segmentRef, true);
        const task = this.playgraph.branchScheduler.uu(
          ie.millisecondsDelay(node.lowestWaterMarkLevelBufferRelaxed(maxDistance)),
          resolve,
          "waitJitHydrateAdBreak"
        );
        cleanupPromise.then(() => task.destroy());
      });
    } catch (err) {
      if (DEBUG) this.console.RETRY("waitJitHydrateAdBreak failed", VC.wy(err));
    }
  }

  // ──────────────────────────────────────────────
  //  Live-jitter scheduling
  // ──────────────────────────────────────────────

  /**
   * For live streams, calculate optional jitter parameters so that not all
   * clients hydrate at the exact same wall-clock moment.
   *
   * @param {object}        parentViewable
   * @param {HydrationItem} item
   * @returns {object|undefined} Jitter descriptor, or undefined if not applicable.
   * @private
   */
  computeLiveJitter(parentViewable, item) {
    if (!parentViewable.isAuxiliary || !this.config.paceHydrationPolicyByLiveEdge) return;

    const liveEdgeNode = parentViewable.networkState.getPlaygraphNode(true);
    const distanceToBreak = TimeUtil.max(
      TimeUtil.seekToSample,
      liveEdgeNode.lowestWaterMarkLevelBufferRelaxed(item.adBreak.timeValue)
    );
    const needsJitter = distanceToBreak.timeComparison(
      TimeUtil.fromMilliseconds(this.config.liveHydrationDistanceThatNeedJitter)
    );
    const jitterWindow =
      parentViewable.manifestRef.adverts?.exb ??
      this.config.liveHydrationDefaultJitterWindow;
    const jitterMs = Math.floor(Math.random() * jitterWindow);

    if (DEBUG) {
      this.console.log("Checking schedule for live jitter and adbreak hydration", {
        nia: item.adBreak.currentIndexValue(),
        jitterMs,
        jitterWindow,
        liveEdge: liveEdgeNode.ca(),
        distance: distanceToBreak.ca(),
        needsJitter,
      });
    }

    if (needsJitter) {
      const currentPosition = this.playgraph.resolveTime(this.playgraph.position).timeValue;
      return {
        Lxb: distanceToBreak.playbackSegment,
        ase_Mxb: item.adBreak.timeValue
          .lowestWaterMarkLevelBufferRelaxed(currentPosition).playbackSegment,
        ase_Xia: jitterWindow,
        K4: jitterMs,
        xC: parentViewable.encodingpipelinetime + jitterMs,
        timeRandomizationWasCalculated: parentViewable.encodingpipelinetime,
      };
    }
  }

  /**
   * Execute the live-jitter delay.
   *
   * @param {object}        jitterInfo
   * @param {HydrationItem} item
   * @param {AbortSignal}   signal
   * @private
   */
  async executeLiveJitterDelay(jitterInfo, item, signal) {
    await new Promise((resolve, reject) => {
      const task = this.playerCore.uu(
        ie.manifestUrlFetch(TimeUtil.fromMilliseconds(jitterInfo.K4)),
        resolve,
        "hydrationLiveJitterTask"
      );
      signal.addEventListener("abort", () => {
        task.destroy();
        reject();
      });
    });
    if (DEBUG) {
      this.console.log("Live jitter completed", {
        nia: item.adBreak.currentIndexValue(),
      });
    }
  }

  // ──────────────────────────────────────────────
  //  Core hydration fetch
  // ──────────────────────────────────────────────

  /**
   * Execute the actual hydration network request for a single ad break and
   * emit the appropriate event (hydrated / skipped / failed).
   *
   * @param {HydrationItem} item   - The hydration item.
   * @param {string}        reason - Why hydration was triggered.
   * @param {AbortSignal}   signal - Abort signal from the outer schedule.
   * @private
   */
  async queueAdBreakHydration(item, reason, signal) {
    const adBreak = item.adBreak;
    const viewableId = item.viewableId;
    const itemId = `${adBreak.timedTextDownloadRetryCountBeforeCdnSwitch}:${adBreak.currentIndexValue() ?? ""}`;

    this.sessionMetrics.emitDiagnosticEvent({ id: itemId, reason });

    const adBreakToken = adBreak.internal_Ura();
    const hb = adBreak.currentIndexValue();
    const resolvedToken = hb ?? adBreakToken;
    assert(resolvedToken, "adBreakToken or adBreakTriggerId must exist if adBreak hydration was queued");

    const seqId = this.seqId++;
    item.seqId = seqId;

    const viewable = this.trackIdProvider.createViewable(viewableId);
    const decompressor = viewable.decompressor;
    let hydrationCompleted = false;
    const [uploadFn, uploadTimestamps] = wKb(
      this.trackIdProvider.updateUploadQueue.bind(this.trackIdProvider)
    );

    let liveJitterInfo;

    try {
      const parentViewable = await viewable.mq;

      if (parentViewable.isAuxiliary) {
        liveJitterInfo = this.computeLiveJitter(parentViewable, item);
        if (liveJitterInfo) {
          await Promise.race([
            this.executeLiveJitterDelay(liveJitterInfo, item, signal),
            item.expediteDeferred.promise,
          ]);
        }
      }

      if (item.abortSignal.aborted || signal.aborted) return;

      const response = await uploadFn({
        Pj: adBreakToken,
        hb,
        J: viewableId,
      });

      if (item.abortSignal.aborted || signal.aborted) return;

      item.adBreakHydrated = true;
      const hydratedData = response.B9;
      const parentRef = response.jn;

      if (DEBUG) {
        this.console.log(
          `Hydrated response with ${response.B9.duration?.length} ads`
        );
        this.console.debug("Hydrated complete response ", { response: hydratedData });
      }

      const hydratedEvent = {
        type: "adBreakHydrated",
        adBreakToken,
        hb,
        B9: hydratedData,
        jn: parentRef,
        IO: item.adBreak,
        seqId,
        AJ: { jC: uploadTimestamps.start, mC: uploadTimestamps.end },
        ase_Ow: liveJitterInfo,
      };

      this.setHydrationEvent(item.adBreak, { ...hydratedEvent });
      this.events.emit("adBreakHydrated", hydratedEvent);
      hydrationCompleted = true;
    } catch (error) {
      if (!signal.aborted) {
        const errorCategory = ErrorParser.internal_Yzc(error);
        const errorCode = ErrorParser.internal_Sba(error);
        const parentViewable = await viewable.mq;
        assert(parentViewable, "parentAseViewable must exist");

        if (
          errorCategory === "adBreakHydration" &&
          errorCode &&
          RECOVERABLE_AD_BREAK_ERRORS.indexOf(errorCode) !== -1
        ) {
          if (DEBUG) {
            this.console.log(
              "AdBreak hydration failed with recoverable error, playback can continue. " +
                "Hydration will be attempted again if user revisits the adBreak location. " +
                `errorCode: ${errorCode}, parentViewableId: ${viewableId}, adBreakToken: ${adBreakToken}`
            );
          }
          const skippedEvent = {
            type: "adBreakHydrationSkipped",
            adBreakToken,
            hb,
            error,
            errorCode,
            jn: parentViewable,
            IO: item.adBreak,
            seqId: this.seqId++,
            AJ: { jC: uploadTimestamps.start, mC: uploadTimestamps.end },
            ase_Ow: liveJitterInfo,
          };
          this.setHydrationEvent(item.adBreak, skippedEvent);
          adBreak.isDynamicAdBreak = true;
          this.events.emit("adBreakHydrationSkipped", skippedEvent);
          hydrationCompleted = true;
          return;
        }

        const failedEvent = {
          type: "adBreakHydrationFailed",
          adBreakToken,
          hb,
          error,
          errorCode,
          jn: parentViewable,
          IO: item.adBreak,
          seqId,
          AJ: { jC: uploadTimestamps.start, mC: uploadTimestamps.end },
          ase_Ow: liveJitterInfo,
        };
        this.setHydrationEvent(item.adBreak, failedEvent);
        this.events.emit("adBreakHydrationFailed", failedEvent);
        hydrationCompleted = true;
      }
    } finally {
      if (!hydrationCompleted && !item.cancelledAsTooLate) {
        const parentViewable = await viewable.mq;
        assert(parentViewable, "parentAseViewable must exist");
        this.events.emit("adBreakHydrationSkipped", {
          type: "adBreakHydrationSkipped",
          adBreakToken,
          hb,
          jn: parentViewable,
          IO: item.adBreak,
          seqId,
          AJ: { jC: uploadTimestamps.start, mC: uploadTimestamps.end },
          ase_Ow: liveJitterInfo,
        });
      }
      item.adBreakHydrated = true;
      decompressor.release();
      if (!signal.aborted) {
        this.playgraph.onAdHydrationComplete();
      }
    }
  }

  /**
   * Tear down: cancel all pending hydrations.
   */
  destroy() {
    this.scheduleAdBreakHydration([]);
  }
}

export { AdBreakHydrationManager };
