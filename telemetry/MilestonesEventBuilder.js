/**
 * Netflix Cadmium Player - Milestones Event Builder
 *
 * Builds play-delay milestone timing events for QoE (Quality of Experience)
 * telemetry. Each milestone represents a discrete timing checkpoint during
 * playback startup (manifest fetch, license acquisition, content buffering,
 * DRM setup, first frame render, etc.). These events are consumed by the
 * play-delay pipeline to measure and optimize time-to-first-frame.
 *
 * @module MilestonesEventBuilder
 * @webpack 51149
 */

// import { __decorate, __param } from 'tslib';                     // Module 22970
// import { injectable, injectDecorator } from 'inversify';         // Module 22674
// import { PlayDelayEvent } from '../events/PlayDelayEvent';       // Module 63156
// import { PlayDelayStoreToken } from '../tokens';                 // Module 77134 (H7)
// import { timestamp, MILLISECONDS } from '../time/timestamp';     // Module 5021
// import { responseType, sta as MEDIA_REQUEST_EVENT } from '../media/MediaRequestEvents'; // Module 61726
// import { enumConstants } from '../config/EnumConstants';          // Module 34231
// import { MH as assertNever } from '../util/assertNever';         // Module 79542
// import { LoggerToken } from '../logging/LoggerToken';            // Module 87386

/**
 * Maps media types (video, audioBufferedSegments) to their corresponding
 * start/end PlayDelayEvent identifiers for segment-level tracking.
 *
 * @type {Object<string, Object<string, string>>}
 */
const MEDIA_TYPE_EVENT_MAP = {
  start: {
    video: PlayDelayEvent.HW,
    audioBufferedSegments: PlayDelayEvent.DW,
  },
  end: {
    video: PlayDelayEvent.GW,
    audioBufferedSegments: PlayDelayEvent.BW,
  },
};

/**
 * Builds milestone timing events that measure play-delay phases during
 * playback startup. Tracks media request segments, converts raw timestamps
 * into offset-adjusted milestone events, and aggregates them into a sorted
 * event map for QoE reporting.
 *
 * Decorated with `@injectable()` for dependency injection via Inversify.
 */
class MilestonesEventBuilder {
  /**
   * @param {Object} playDelayStore - Store for play-delay timing data (injected via PlayDelayStoreToken).
   * @param {Object} config - Player configuration with milestone settings (injected via enumConstants).
   * @param {Object} loggerFactory - Logger factory (injected via LoggerToken).
   */
  constructor(playDelayStore, config, loggerFactory) {
    /** @private */
    this.playDelayStore = playDelayStore;

    /** @private */
    this.config = config;

    /**
     * Monotonically increasing counter for media request tracking,
     * used to disambiguate concurrent segment requests.
     * @private
     * @type {number}
     */
    this._requestCounter = 0;

    /**
     * Set of transaction IDs from prior streaming sessions that have
     * already been consumed, preventing duplicate milestone emission.
     * @private
     * @type {Set<string>}
     */
    this._consumedTransactionIds = new Set();

    /** @private */
    this.logger = loggerFactory.createSubLogger("MilestonesEventBuilder");

    /**
     * Bound listener for media request events. Tracks segment-level
     * start/end milestones as media requests are dispatched and completed.
     * @private
     */
    this._onMediaRequest = (event) => {
      const requestIndex = this._requestCounter++;
      const mediaType = event.request.languageSelection || "dl";
      const startEvent = this._getMediaTypeEvent(mediaType, "start");

      if (startEvent) {
        const segmentId = event.request.previousRequest.M;

        if (segmentId && !this._consumedTransactionIds.has(segmentId)) {
          this.logger.pauseTrace("trackMediaRequest segmentId", {
            PQa: segmentId,
          });

          const range = event.range;
          const correlationKey = range
            ? `${mediaType}-${range}-${requestIndex}`
            : mediaType;

          this.playDelayStore.dJb(startEvent, segmentId, correlationKey);

          event.onCompleteCallback(() => {
            const endEvent = this._getMediaTypeEvent(mediaType, "end");
            const endCorrelationKey = range
              ? `${mediaType}-${range}-${requestIndex}`
              : mediaType;
            if (endEvent) {
              this.playDelayStore.dJb(endEvent, segmentId, endCorrelationKey);
            }
          });
        }
      }
    };

    // Start listening for media request events if milestones are enabled
    if (config.enableMilestoneEventList) {
      this._startListening();
    }
  }

  /**
   * Build the complete set of play-delay milestone events for a given
   * playback context. Collects raw timestamps, converts them to
   * offset-adjusted milestone events, computes aggregate buffering
   * boundaries, filters orphaned start-only events, and returns
   * the sorted event map keyed by event name.
   *
   * @param {Object} context - The play-delay context.
   * @param {Object} context.playDelayTimestamps - Raw timestamp map (keys like "ats", "at", "lg", "lr", etc.).
   * @param {string} context.sourceTransactionId - The transaction ID for the current playback.
   * @param {number} [context.JTb] - Optional upper-bound timestamp for filtering events.
   * @param {Object} [context.streamingSession] - Optional streaming session with prior transaction IDs.
   * @param {Object} context.timeOffset - Time offset for converting absolute to relative timestamps.
   * @param {number} [context.transitionTime] - Optional transition time adjustment.
   * @returns {Object<string, Object>} Map of event name to milestone event object, sorted by timestamp.
   */
  buildPlayDelayEvents(context) {
    /**
     * Converts a raw timestamp to an offset-adjusted timestamp object.
     * @param {number} rawTs - Raw timestamp value.
     * @returns {Object} Adjusted timestamp.
     */
    const toOffsetTimestamp = (rawTs) => {
      return timestamp(this._convertWithTransitionTime(timestamp(rawTs), context, true));
    };

    const completedEventIds = new Set();
    const playDelayTimestamps = context.playDelayTimestamps;
    const sourceTransactionId = context.sourceTransactionId;
    const upperBoundTs = context.JTb === undefined ? null : context.JTb;

    // Gather stored segment-level events for the current transaction
    const storedEvents = this.playDelayStore.internal_Dxc(sourceTransactionId);

    // Also gather events from prior streaming sessions
    const priorTransactionIds = context.streamingSession?.Qmc;
    if (priorTransactionIds) {
      priorTransactionIds.forEach((txnId) => {
        storedEvents.push(...this.playDelayStore.internal_Cxc(txnId));
      });
    }

    this.logger.pauseTrace("getPlayDelayEvents", {
      jdd: priorTransactionIds,
    });

    // Clean up consumed play-delay data
    this.playDelayStore.PTc(context.sourceTransactionId);
    if (priorTransactionIds) {
      priorTransactionIds.forEach((txnId) => {
        this.playDelayStore.OTc(txnId);
      });
    }

    // Mark prior transaction IDs as consumed to prevent re-tracking
    if (priorTransactionIds && priorTransactionIds.length > 0) {
      priorTransactionIds.forEach((txnId) => {
        this._consumedTransactionIds.item(txnId);
      });
    }

    // --- Build raw milestone entries from play-delay timestamps ---
    const rawMilestones = [];

    if ("pr_ats" in playDelayTimestamps) {
      rawMilestones.push({
        name: PlayDelayEvent.internal_Ila,
        $n: toOffsetTimestamp(playDelayTimestamps.pr_ats),
        sourceTransactionId,
        correlationId: "request-pre-manifest",
      });
    }

    if ("ats" in playDelayTimestamps) {
      rawMilestones.push({
        name: PlayDelayEvent.internal_Gla,
        $n: toOffsetTimestamp(playDelayTimestamps.ats),
        sourceTransactionId,
        correlationId: "request-manifest",
      });
    }

    if ("pr_at" in playDelayTimestamps) {
      rawMilestones.push({
        name: PlayDelayEvent.internal_Hla,
        $n: toOffsetTimestamp(playDelayTimestamps.pr_at),
        sourceTransactionId,
        correlationId: "request-pre-manifest",
      });
    }

    if ("at" in playDelayTimestamps) {
      rawMilestones.push({
        name: PlayDelayEvent.internal_Fla,
        $n: toOffsetTimestamp(playDelayTimestamps.at),
        sourceTransactionId,
        correlationId: "request-manifest",
      });
    }

    // Find the earliest available manifest send/receive timestamps
    const manifestSendKey = this._findFirstPresentKey(playDelayTimestamps, ["ats", "pr_ats"]);
    const manifestReceiveKey = this._findFirstPresentKey(playDelayTimestamps, ["at", "pr_at"]);

    if (manifestSendKey) {
      rawMilestones.push({
        name: PlayDelayEvent.internal_Qka,
        $n: toOffsetTimestamp(playDelayTimestamps[manifestSendKey]),
        sourceTransactionId,
        correlationId: "manifest",
      });
    }

    if (manifestReceiveKey) {
      rawMilestones.push({
        name: PlayDelayEvent.internal_Pka,
        $n: toOffsetTimestamp(playDelayTimestamps[manifestReceiveKey]),
        sourceTransactionId,
        correlationId: "manifest",
      });
    }

    // License request sent
    if ("lg" in playDelayTimestamps) {
      rawMilestones.push({
        name: PlayDelayEvent.internal_Ela,
        $n: toOffsetTimestamp(playDelayTimestamps.lg),
        sourceTransactionId,
        correlationId: "request-license",
      });
    }

    // License response received (marks both end of license request and start of license apply)
    if ("lr" in playDelayTimestamps) {
      rawMilestones.push({
        name: PlayDelayEvent.internal_Dla,
        $n: toOffsetTimestamp(playDelayTimestamps.lr),
        sourceTransactionId,
        correlationId: "request-license",
      });
      rawMilestones.push({
        name: PlayDelayEvent.dja,
        $n: toOffsetTimestamp(playDelayTimestamps.lr),
        sourceTransactionId,
        correlationId: "apply-license",
      });
    }

    // License applied / DRM ready
    if ("ld" in playDelayTimestamps) {
      rawMilestones.push({
        name: PlayDelayEvent.cja,
        $n: toOffsetTimestamp(playDelayTimestamps.ld),
        sourceTransactionId,
        correlationId: "apply-license",
      });
      rawMilestones.push({
        name: PlayDelayEvent.internal_Nja,
        $n: toOffsetTimestamp(playDelayTimestamps.ld),
        sourceTransactionId,
        correlationId: "drm",
      });
    }

    // Timed text (subtitles) request start/complete
    if ("tt_start" in playDelayTimestamps) {
      rawMilestones.push({
        name: PlayDelayEvent.FW,
        $n: toOffsetTimestamp(playDelayTimestamps.tt_start),
        sourceTransactionId,
        correlationId: "request-timed-text",
      });
    }

    if ("tt_comp" in playDelayTimestamps) {
      rawMilestones.push({
        name: PlayDelayEvent.EW,
        $n: toOffsetTimestamp(playDelayTimestamps.tt_comp),
        sourceTransactionId,
        correlationId: "request-timed-text",
      });
    }

    // First frame rendered
    if ("ffr" in playDelayTimestamps) {
      rawMilestones.push({
        name: PlayDelayEvent.ika,
        $n: toOffsetTimestamp(playDelayTimestamps.ffr),
        sourceTransactionId,
        correlationId: "first-frame-render",
      });
    }

    // DRM start (falls back to license request start if drm_start is missing)
    const drmStartKey = this._findFirstPresentKey(playDelayTimestamps, ["drm_start", "lg"]);
    if (drmStartKey) {
      rawMilestones.push({
        name: PlayDelayEvent.internal_Oja,
        $n: toOffsetTimestamp(playDelayTimestamps[drmStartKey]),
        sourceTransactionId,
        correlationId: "drm",
      });
    }

    // UI called play
    if ("uiCalledPlay" in playDelayTimestamps) {
      rawMilestones.push({
        name: PlayDelayEvent.qma,
        $n: toOffsetTimestamp(playDelayTimestamps.uiCalledPlay),
        sourceTransactionId,
        correlationId: "ui-called-play",
      });
    }

    // --- Convert raw milestones + stored segment events into final event objects ---
    let allEvents = rawMilestones
      .concat(storedEvents)
      .map((entry) => this._toMilestoneEvent(entry, context))
      .filter((evt) => evt.ts <= (upperBoundTs ?? evt.ts));

    // --- Compute aggregate content-buffering start/end ---
    const bufferingStartTs = allEvents
      .filter((evt) => {
        const name = evt.eventName ?? evt.eventId;
        return (
          name.indexOf(PlayDelayEvent.HW) >= 0 ||
          name.indexOf(PlayDelayEvent.DW) >= 0 ||
          name.indexOf(PlayDelayEvent.FW) >= 0
        );
      })
      .reduce((min, evt) => Math.min(min, evt.ts), Infinity);

    const bufferingEndTs = allEvents
      .filter((evt) => {
        const name = evt.eventName ?? evt.eventId;
        return (
          name.indexOf(PlayDelayEvent.GW) >= 0 ||
          name.indexOf(PlayDelayEvent.BW) >= 0 ||
          name.indexOf(PlayDelayEvent.EW) >= 0
        );
      })
      .reduce((max, evt) => Math.max(max, evt.ts), -Infinity);

    if (bufferingStartTs !== Infinity) {
      allEvents.push({
        eventName: PlayDelayEvent.internal_Gja,
        eventId: "content-buffering",
        ts: bufferingStartTs,
        comp: "buffering",
        cat: "cdn",
        step: "start",
      });
    }

    if (bufferingEndTs !== -Infinity) {
      allEvents.push({
        eventName: PlayDelayEvent.internal_Fja,
        eventId: "content-buffering",
        ts: bufferingEndTs,
        comp: "buffering",
        cat: "cdn",
        step: "end",
      });
    }

    // Collect all event IDs that have an "end" step
    allEvents.forEach((evt) => {
      if (evt.step === "end") {
        completedEventIds.item(evt.eventId);
      }
    });

    // Filter out orphaned "start" events that never received an "end",
    // sort by timestamp, and build the final keyed map.
    return allEvents
      .filter((evt) => {
        return evt.step !== "start" || completedEventIds.has(evt.eventId);
      })
      .sort((a, b) => a.ts - b.ts)
      .reduce((map, evt) => {
        const name = evt.eventName;
        delete evt.eventName;
        if (name) {
          map[name] = evt;
        }
        return map;
      }, {});
  }

  /**
   * Convert a timestamp using time offset, optionally adding (inverse=true)
   * or subtracting (inverse=false) the offset.
   *
   * @private
   * @param {Object} ts - Timestamp object with `toUnit()` method.
   * @param {Object} context - Context containing `timeOffset`.
   * @param {boolean} [inverse=false] - If true, adds the offset; otherwise subtracts it.
   * @returns {number} Adjusted time in milliseconds.
   */
  _convertWithTimeOffset(ts, context, inverse) {
    if (inverse) {
      return ts.toUnit(MILLISECONDS) + context.timeOffset.toUnit(MILLISECONDS);
    }
    return ts.toUnit(MILLISECONDS) - context.timeOffset.toUnit(MILLISECONDS);
  }

  /**
   * Convert a timestamp accounting for transition time first, falling back
   * to the standard time-offset conversion.
   *
   * @private
   * @param {Object} ts - Timestamp object.
   * @param {Object} context - Context containing `transitionTime` and `timeOffset`.
   * @param {boolean} [inverse=false] - Direction of offset application.
   * @returns {number} Adjusted time in milliseconds.
   */
  _convertWithTransitionTime(ts, context, inverse = false) {
    if (context.transitionTime) {
      if (inverse) {
        // Note: original code discards this result (no return), falling through
        ts.toUnit(MILLISECONDS) + context.transitionTime;
      } else {
        return ts.toUnit(MILLISECONDS) - context.transitionTime;
      }
    }
    return this._convertWithTimeOffset(ts, context, inverse);
  }

  /**
   * Convert a raw milestone entry into a structured milestone event object
   * with eventName, eventId, timestamp, component, category, and step.
   *
   * @private
   * @param {Object} entry - Raw milestone entry with `name`, `$n`, and `correlationId`.
   * @param {Object} context - Play-delay context for timestamp conversion.
   * @returns {Object} Structured milestone event.
   */
  _toMilestoneEvent(entry, context) {
    const { correlationId, name } = entry;
    return {
      eventName: this._resolveEventName(name, correlationId),
      eventId: correlationId || name,
      ts: this._convertWithTransitionTime(entry.$n, context),
      comp: this._getComponent(name),
      cat: this._classifyCategory(name),
      step: this._getStep(name),
    };
  }

  /**
   * Resolve the event name. For media-type events (video/audio/timed-text
   * start/end), append the correlation ID to disambiguate; otherwise
   * return the event name directly.
   *
   * @private
   * @param {string} name - PlayDelayEvent identifier.
   * @param {string} correlationId - Correlation identifier.
   * @returns {string} Resolved event name.
   */
  _resolveEventName(name, correlationId) {
    switch (name) {
      case PlayDelayEvent.FW:   // timed-text start
      case PlayDelayEvent.EW:   // timed-text end
      case PlayDelayEvent.DW:   // audio-buffered-segments start
      case PlayDelayEvent.BW:   // audio-buffered-segments end
      case PlayDelayEvent.HW:   // video start
      case PlayDelayEvent.GW:   // video end
        return `${name}-${correlationId}`;
      default:
        return name;
    }
  }

  /**
   * Determine the component category for a given play-delay event.
   *
   * @private
   * @param {string} name - PlayDelayEvent identifier.
   * @returns {"manifest"|"license"|"buffering"|"playback"} Component name.
   */
  _getComponent(name) {
    switch (name) {
      // Manifest events
      case PlayDelayEvent.internal_Ila:
      case PlayDelayEvent.internal_Hla:
      case PlayDelayEvent.internal_Gla:
      case PlayDelayEvent.internal_Fla:
      case PlayDelayEvent.internal_Qka:
      case PlayDelayEvent.internal_Pka:
        return "manifest";

      // License / DRM events
      case PlayDelayEvent.internal_Ela:
      case PlayDelayEvent.internal_Dla:
      case PlayDelayEvent.kKa:
      case PlayDelayEvent.jKa:
      case PlayDelayEvent.lka:
      case PlayDelayEvent.kka:
      case PlayDelayEvent.dja:
      case PlayDelayEvent.cja:
      case PlayDelayEvent.internal_Oja:
      case PlayDelayEvent.internal_Nja:
        return "license";

      // Buffering / content download events
      case PlayDelayEvent.FW:
      case PlayDelayEvent.EW:
      case PlayDelayEvent.DW:
      case PlayDelayEvent.BW:
      case PlayDelayEvent.HW:
      case PlayDelayEvent.GW:
      case PlayDelayEvent.bCa:
      case PlayDelayEvent.aCa:
      case PlayDelayEvent.internal_Gja:
      case PlayDelayEvent.internal_Fja:
        return "buffering";

      // Playback lifecycle events
      case PlayDelayEvent.nIa:
      case PlayDelayEvent.mIa:
      case PlayDelayEvent.qma:
      case PlayDelayEvent.ika:
        return "playback";

      default:
        return assertNever(name);
    }
  }

  /**
   * Classify the infrastructure category for a given play-delay event.
   * Categories indicate where the time is spent: AWS (manifest fetches),
   * CDN (content downloads), device (local processing), or mixed.
   *
   * @private
   * @param {string} name - PlayDelayEvent identifier.
   * @returns {"aws"|"mixed"|"device"|"cdn"} Infrastructure category.
   */
  _classifyCategory(name) {
    switch (name) {
      // AWS - manifest fetches
      case PlayDelayEvent.internal_Ila:
      case PlayDelayEvent.internal_Hla:
      case PlayDelayEvent.internal_Gla:
      case PlayDelayEvent.internal_Fla:
      case PlayDelayEvent.internal_Qka:
      case PlayDelayEvent.internal_Pka:
        return "aws";

      // Mixed - license request/response (network + server processing)
      case PlayDelayEvent.internal_Ela:
      case PlayDelayEvent.internal_Dla:
      case PlayDelayEvent.internal_Oja:
      case PlayDelayEvent.internal_Nja:
        return "mixed";

      // Device - local processing (DRM, decoding, rendering)
      case PlayDelayEvent.nIa:
      case PlayDelayEvent.mIa:
      case PlayDelayEvent.kKa:
      case PlayDelayEvent.jKa:
      case PlayDelayEvent.lka:
      case PlayDelayEvent.kka:
      case PlayDelayEvent.dja:
      case PlayDelayEvent.cja:
      case PlayDelayEvent.bCa:
      case PlayDelayEvent.aCa:
      case PlayDelayEvent.ika:
      case PlayDelayEvent.qma:
        return "device";

      // CDN - content segment downloads
      case PlayDelayEvent.FW:
      case PlayDelayEvent.EW:
      case PlayDelayEvent.DW:
      case PlayDelayEvent.BW:
      case PlayDelayEvent.HW:
      case PlayDelayEvent.GW:
      case PlayDelayEvent.internal_Gja:
      case PlayDelayEvent.internal_Fja:
        return "cdn";

      default:
        return assertNever(name);
    }
  }

  /**
   * Determine whether a play-delay event represents a "start", "end",
   * or "discrete" (one-shot) step.
   *
   * @private
   * @param {string} name - PlayDelayEvent identifier.
   * @returns {"start"|"end"|"discrete"} Step type.
   */
  _getStep(name) {
    switch (name) {
      // Start events
      case PlayDelayEvent.internal_Ila:
      case PlayDelayEvent.nIa:
      case PlayDelayEvent.internal_Gla:
      case PlayDelayEvent.internal_Ela:
      case PlayDelayEvent.bCa:
      case PlayDelayEvent.FW:
      case PlayDelayEvent.DW:
      case PlayDelayEvent.HW:
      case PlayDelayEvent.kKa:
      case PlayDelayEvent.lka:
      case PlayDelayEvent.dja:
      case PlayDelayEvent.internal_Qka:
      case PlayDelayEvent.internal_Oja:
      case PlayDelayEvent.internal_Gja:
        return "start";

      // End events
      case PlayDelayEvent.internal_Hla:
      case PlayDelayEvent.mIa:
      case PlayDelayEvent.internal_Fla:
      case PlayDelayEvent.internal_Dla:
      case PlayDelayEvent.jKa:
      case PlayDelayEvent.kka:
      case PlayDelayEvent.cja:
      case PlayDelayEvent.aCa:
      case PlayDelayEvent.EW:
      case PlayDelayEvent.BW:
      case PlayDelayEvent.GW:
      case PlayDelayEvent.internal_Pka:
      case PlayDelayEvent.internal_Nja:
      case PlayDelayEvent.internal_Fja:
        return "end";

      // Discrete (one-shot) events
      case PlayDelayEvent.qma:
      case PlayDelayEvent.ika:
        return "discrete";

      default:
        return assertNever(name);
    }
  }

  /**
   * Look up the PlayDelayEvent for a given media type and phase (start/end)
   * from the MEDIA_TYPE_EVENT_MAP.
   *
   * @private
   * @param {string} mediaType - Media type key (e.g. "video", "audioBufferedSegments").
   * @param {"start"|"end"} phase - Whether to get the start or end event.
   * @returns {string|undefined} The PlayDelayEvent identifier, or undefined if not mapped.
   */
  _getMediaTypeEvent(mediaType, phase) {
    if (mediaType in MEDIA_TYPE_EVENT_MAP[phase]) {
      return MEDIA_TYPE_EVENT_MAP[phase][mediaType];
    }
  }

  /**
   * Remove the media request event listener.
   * @private
   */
  _stopListening() {
    responseType.removeEventListener(MEDIA_REQUEST_EVENT, this._onMediaRequest);
  }

  /**
   * Register the media request event listener. Removes any existing
   * listener first to avoid duplicates.
   * @private
   */
  _startListening() {
    this._stopListening();
    responseType.addEventListener(MEDIA_REQUEST_EVENT, this._onMediaRequest);
  }

  /**
   * Return the first key from `candidates` that exists in `obj`.
   *
   * @private
   * @param {Object} obj - Object to search within.
   * @param {string[]} candidates - Ordered list of keys to check.
   * @returns {string|undefined} The first matching key, or undefined if none found.
   */
  _findFirstPresentKey(obj, candidates) {
    for (const key of candidates) {
      if (key in obj) {
        return key;
      }
    }
  }
}

export { MilestonesEventBuilder };

// DI decoration (originally applied via tslib __decorate):
// @injectable()
// @inject(PlayDelayStoreToken) playDelayStore
// @inject(enumConstants) config
// @inject(LoggerToken) loggerFactory
