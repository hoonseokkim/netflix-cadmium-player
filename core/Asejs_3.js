/**
 * Netflix Cadmium Player — ASEJS Viewable (AseViewable)
 *
 * The central "viewable" class in the Adaptive Streaming Engine.  An
 * AseViewable represents a single piece of playable content (movie,
 * episode, or ad) and owns:
 *
 *   - Track lists (audio / video / timed-text / supplementary)
 *   - CDN location management and URL rotation
 *   - Network error handling and retry logic
 *   - Header / fragment request scheduling
 *   - Live-stream clock sync and live-event timing
 *   - Side-channel (OCA) integration and black-box notification
 *   - Encoder logging and diagnostic events
 *   - Chapter normalisation
 *   - TCP connection sharing policy
 *
 * Extends the abstract base-pipeline viewable (`BaseViewable`).
 *
 * @module AseViewable
 */

// Dependencies (representative — actual imports are from the webpack graph)
// import { __extends, __assign, __awaiter, __generator, __values, __read,
//          __spreadArray, __decorate, __param } from 'tslib';
// import { EventEmitter } from './modules/EventEmitter';
// import { TimeUtil, observableBool, flatten, findLast, XY, hn, np, assert,
//          qB, hasSegmentAvailabilityWindow } from './modules/TimeUtil';
// import { platform } from './modules/Platform';
// import { Sidechannel, internal_Ilc, tmc } from './network/Sidechannel';
// import { ErrorDirectorClass } from './monitoring/ErrorDirector';
// import { MediaType, F7 as ALL_MEDIA_TYPES } from './modules/MediaType';
// import { assert as softAssert } from './modules/Assert';
// import { isLiveStream } from './modules/StreamUtils';
// import { MediaEventsStore as MediaEventsStore } from './events/MediaEventsStore';
// import { EventProcessingPipeline as EventProcessingPipeline } from './modules/EventProcessingPipeline';
// import { ServerClock, DeltaTracker } from './core/Asejs_4';
// import { HeaderManager as HeaderManager } from './modules/HeaderManager';
// import { NetworkStateManager as NetworkStateManager } from './modules/NetworkStateManager';
// import { PendingRequest as PendingRequest } from './modules/PendingRequest';
// import { $ab as PaddingViewableEventProcessor } from './modules/PaddingViewableEventProcessor';
// import { BaseViewable (bP) } from './modules/BaseViewable';

/**
 * Holds per-media-type download state for a viewable.
 * @private
 */
class MediaTypeStreamState {
  /**
   * @param {number} mediaType
   */
  constructor(mediaType) {
    /** @type {number} */
    this.mediaType = mediaType;

    /** @type {*} Pending download handle. */
    this.pendingDownloadHandle = undefined;
  }
}

/**
 * @enum {number} Stream switchability classification.
 */
const StreamSwitchability = Object.freeze({
  NO_DATA: 0,
  SWITCHABLE: 1,
  NONSWITCHABLE: 2,
  SWITCHABLE_AND_NONSWITCHABLE: 3,
});

// ─────────────────────────────────────────────────────────────
//  Track factory
// ─────────────────────────────────────────────────────────────

/**
 * Create the appropriate track instance (ad-aware or standard) based on
 * whether the viewable is an ad playgraph.
 *
 * @param {object} params - Track creation parameters.
 * @param {object} config - Player configuration.
 * @param {Console} console
 * @returns {object} The new track instance.
 * @private
 */
function createTrack(params, config, console) {
  return params.viewableSession.isAdPlaygraph
    ? new AdAwareTrack(params, config, console)
    : new StandardTrack(params, config, console);
}

// ─────────────────────────────────────────────────────────────
//  AseViewable
// ─────────────────────────────────────────────────────────────

/**
 * Full-featured viewable for ASEJS playback.
 *
 * @extends BaseViewable
 */
class AseViewable extends BaseViewable {
  /**
   * @param {string} viewableId    - Unique viewable identifier.
   * @param {object} viewableParams - Initialization parameters bag.
   * @param {object} parentViewable - Parent viewable reference (for ad viewables).
   */
  constructor(viewableId, viewableParams, parentViewable) {
    const {
      manifestRef,
      isReadyForPlayback: clearPlayEnabled,
      config,
      rga: requestGroupAggregator,
      networkMonitor,
      throughputMonitor,
      internal_Xrc: errorHandlers,
      sharedMediaSourceExtensions,
      bufferSizeLimiter,
      configWrapper,
      pW: playerScheduler,
      playgraphId,
    } = viewableParams;

    super();

    /** @type {string} */
    this.viewableId = viewableId;

    /** @type {object|undefined} Parent viewable for ad-break viewables. */
    this.parentViewable = parentViewable;

    /** @type {boolean} */
    this.hasInitialized = false;

    /** @type {number} Stream switchability state. */
    this.streamSwitchability = StreamSwitchability.NO_DATA;

    /** @type {object} Snapshot of live-event start/end times. */
    this.liveEventTimesSnapshot = {};

    /** @type {object} Live timing action state (prefetch / execute). */
    this.liveTimingActions = {};

    /** @type {object} Snapshots of live timing calculations. */
    this.liveTimingSnapshots = {};

    /** @type {object} Per-media-type encoder info for diagnostics. */
    this.encoderLoggingInfo = {
      [MediaType.V]: {},
      [MediaType.U]: {},
      [MediaType.TEXT_MEDIA_TYPE]: {},
      [MediaType.supplementaryMediaType]: {},
    };

    /** @type {boolean} Whether chapter normalisation has been applied. */
    this.chaptersNormalized = false;

    /** @type {object[]} Registered branches. */
    this.branches = [];

    /** @type {object[]} Paused network requests. */
    this.pausedRequests = [];

    /** @type {object[]} Pending header requests. */
    this.pendingHeaderRequests = [];

    /** @type {boolean} Whether the viewable has been closed/destroyed. */
    this.isClosed = false;

    /** @type {boolean} Whether a side-channel warning has been emitted. */
    this.sideChannelWarningEmitted = false;

    /** @type {MediaTypeStreamState[]} Per-media-type download states. */
    this.mediaTypeStates = [
      new MediaTypeStreamState(MediaType.V),
      new MediaTypeStreamState(MediaType.U),
      new MediaTypeStreamState(MediaType.TEXT_MEDIA_TYPE),
    ];

    /** @type {object} Event processing pipeline. */
    this.eventProcessingPipeline = new EventProcessingPipeline(config, this.console);

    /** @type {object} Manifest reference. @private */
    this.manifestRef = manifestRef;

    /** @type {number} Playgraph id. */
    this.playgraphId = playgraphId ?? -1;

    /** @type {Console} */
    this.console = new platform.Console(
      "ASEJS",
      "media|asejs",
      `<${String(this.viewableId)}>`
    );
    this.console.log("creating viewable:", viewableId);

    /** @type {object} Configuration wrapper. */
    this.configWrapper = configWrapper;

    if (config.useConfigManager) {
      const sharedResources = {
        tC: sharedMediaSourceExtensions,
        bufferSizeLimiter,
      };
      this.configWrapper.updating(this, config);
      this.configWrapper.GXc(this, manifestRef, sharedResources);
      this.config = this.configWrapper.configManager(this);
    } else {
      /** @type {object} */
      this.config = config;
    }

    /** @type {ServerClock} */
    this.serverClock = new ServerClock(this, this.config);

    /** @type {string|undefined} Steering session id from manifest. */
    this.steeringSessionId =
      manifestRef.steeringAdditionalInfo?.oZc ?? undefined;

    /** @type {EventEmitter} */
    this.events = new EventEmitter();

    /** @type {object} Header request manager. */
    this.headerManager = new HeaderManager(
      this,
      this.console,
      this.config,
      (logData) => this.events.emit("logdata", logData),
      (report) => this.events.emit("transportReport", report)
    );

    /** @type {object} */
    this.networkMonitor = networkMonitor;

    /** @type {object} */
    this.requestGroupAggregator = requestGroupAggregator;

    /** @type {object} */
    this.sharedMediaSourceExtensions = sharedMediaSourceExtensions;

    /** @type {object} */
    this.bufferLimiterInstance = bufferSizeLimiter;

    /** @type {boolean} */
    this.clearPlayEnabled = !!clearPlayEnabled;

    /** @type {boolean} */
    this.isReadyForPlayback = !!clearPlayEnabled;

    /** @type {object} Network state manager. */
    this.networkState = new NetworkStateManager(this, this.config, this.console);

    /** @type {boolean} */
    this.isAuxiliary = this.isAuxiliaryContent;

    // ── Live max-bitrate cap ──
    let liveMaxBitrate;
    if (this.isAdPlaygraph) {
      liveMaxBitrate = manifestRef.liveMetadata.maxBitrate;
    }

    /** @type {object[]} Chapter markers. */
    this.chapters = [...(manifestRef.chapters || [])];

    // ── Build track lists ──
    /** @type {object[][]} Tracks grouped by media type [audio, video, text, supplementary]. */
    this.tracksByType = [[], [], [], []];

    /** @type {object} Stream-id-to-downloadable map, by media type. */
    this.streamMaps = [{}, {}, {}, {}];

    /** @type {number[]} Max bitrate per media type. */
    this.maxBitrateByType = [0, 0];

    /** @type {boolean} Whether any track has a DRM content profile. */
    this.hasDrmContentProfile = false;

    /** @type {*} Video normalization helper. */
    let videoNormalizer;

    const trackListKeys = ["audio_tracks", "video_tracks", , "mediaEventTracks"];

    trackListKeys.forEach((key, mediaTypeIdx) => {
      if (!key || !this.manifestRef[key]) return;

      this.manifestRef[key].forEach((trackMeta, trackIdx) => {
        if (
          trackMeta.type === MediaType.V &&
          (trackMeta.isNone || trackMeta.isMissing === false)
        ) {
          return;
        }

        const track = createTrack(
          {
            viewableSession: this,
            trackMetadata: trackMeta,
            mediaType: mediaTypeIdx,
            isReadyForPlayback: this.isReadyForPlayback,
            trackIndex: trackIdx,
            STREAMING:
              trackIdx +
              (mediaTypeIdx === MediaType.V
                ? this.manifestRef.video_tracks.length
                : 0),
            SM: liveMaxBitrate,
          },
          this.config,
          this.console
        );

        // VMAF estimation for video tracks.
        if (
          mediaTypeIdx === MediaType.U &&
          config.enableVmafEstimationFromBitrate
        ) {
          new VmafEstimator(config).estimateFromBitrate(track.downloadables);
        }

        // Video normalizer & chapter normalization.
        if (mediaTypeIdx === MediaType.U) {
          videoNormalizer = VideoNormalizerFactory.from({
            Zy: trackMeta.qea,
            pw: trackMeta.pea,
          });

          if (!this.isAdPlaygraph && this.chapters.length > 0) {
            track.headerContainerRef.once(() => {
              if (this.chaptersNormalized) return;
              this.chaptersNormalized = true;
              this.chapters = this.chapters.map((ch) => {
                const normalizedMs = track
                  .lookupSegmentByProperties(
                    this.config,
                    TimeUtil.fromMilliseconds(ch.startOffsetMs)
                  )
                  .presentationStartTime.playbackSegment;
                this.console.log(
                  `normalizing chapter "${ch.title}" from ${ch.startOffsetMs} to ${normalizedMs}`
                );
                return { title: ch.title, startOffsetMs: normalizedMs };
              });
              this.events.emit("chaptersUpdated", { L: this });
            });
          }
        }

        this.tracksByType[mediaTypeIdx].push(track);
        this.streamMaps[mediaTypeIdx] = {
          ...this.streamMaps[mediaTypeIdx],
          ...track.getStreamMap(),
        };
        if (track.maxBitrate > this.maxBitrateByType[track.mediaType]) {
          this.maxBitrateByType[track.mediaType] = track.maxBitrate;
        }
        this.hasDrmContentProfile =
          this.hasDrmContentProfile || track.contentProfile;
      });
    });

    // ── Timed-text tracks for ad viewables ──
    if (this.isAdPlaygraph) {
      this.manifestRef.timedtexttracks.forEach((trackMeta, trackIdx) => {
        if (trackMeta.isNone || trackMeta.isMissing === false) return;
        const mediaType = MediaType.TEXT_MEDIA_TYPE;
        const track = createTrack(
          {
            viewableSession: this,
            trackMetadata: trackMeta,
            mediaType,
            isReadyForPlayback: false,
            trackIndex: trackIdx,
            STREAMING: trackIdx,
          },
          this.config,
          this.console
        );
        this.tracksByType[mediaType].push(track);
        this.streamMaps[mediaType] = {
          ...this.streamMaps[mediaType],
          ...track.getStreamMap(),
        };
      });
    }

    // ── Adverts (ad-break manifest data) ──
    if (this.manifestRef.adverts) {
      softAssert(videoNormalizer, "Should have video track if there are adverts");
      this.adverts = {
        ...this.manifestRef.adverts,
        cc:
          this.manifestRef.adverts.adBreaks?.map((adBreak, idx) => {
            const normalizedLocation = videoNormalizer.normalize(
              adBreak.locationMs
            );
            const totalDuration =
              adBreak.duration?.reduce(
                (acc, ad) =>
                  acc.item(
                    TimeUtil.fromMilliseconds(ad.contentEndPts - ad.startTimeMs)
                  ),
                TimeUtil.seekToSample
              ) || TimeUtil.seekToSample;

            const enriched = {
              ...adBreak,
              Ub: idx,
              kj: adBreak.locationMs,
              locationMs: normalizedLocation.playbackSegment,
              duration: totalDuration,
              location: normalizedLocation,
              source: "viewable",
              timeValue: normalizedLocation,
              type: adBreak.yu ? "embedded" : "dynamic",
            };

            if (adBreak.duration !== adBreak.ads) {
              enriched.unnormalizedLocationMs = enriched.kj;
              enriched.locationMs = enriched.locationMs;
              enriched.location = enriched.location;
              enriched.contentTimestamp = enriched.timeValue;
              enriched.type = enriched.type;
            }
            return enriched;
          }) || [],
      };
    }

    /** @type {object} CDN / location selector. */
    this.locationSelector = new LocationSelector(
      this.manifestRef,
      this.streamMaps,
      networkMonitor,
      throughputMonitor,
      this.config,
      (logData) => this.events.emit("logdata", logData)
    );

    // ── Text indexer for live ──
    if (this.isAdPlaygraph) {
      this.textIndexer = new TextIndexer(
        this.console,
        this.config,
        this,
        this.headerManager
      );
    }

    // ── Error handling ──
    const onStreamFailure = errorHandlers.hM;
    const onNetworkFailureCb = errorHandlers.onNetworkFailure;
    this.networkFailureCallback = errorHandlers.onNetworkFailure;
    this.onNetworkFailureCb = onNetworkFailureCb;
    this.retryHandler = onStreamFailure;

    /** @type {ErrorDirectorClass} */
    this.errorDirector = new ErrorDirectorClass(
      this.hasLiveParent,
      this.locationSelector,
      this.config,
      this.handleStreamingFailure.bind(this),
      this.resetAndRetryRequests.bind(this),
      this.sendBlackBoxNotification.bind(this)
    );

    this.errorDirector.events.addListener("requestError", (evt) => {
      if (
        this.isAdPlaygraph &&
        this.config.liveResyncClockOn404Error &&
        evt.httpCode === 404
      ) {
        this.serverClock.resync();
      }
    });

    /** @type {object} Timecode annotations. */
    this.timecodes = [...(manifestRef.timecodeAnnotations || [])];

    /** @type {object} TCP connection sharing map. */
    this.connectionSharingMap = this.buildConnectionSharingMap();

    // ── Supplementary media events store (for live) ──
    const supplementaryTracks =
      this.tracksByType[MediaType.supplementaryMediaType];
    if (
      this.isAdPlaygraph &&
      supplementaryTracks?.length &&
      this.config.enableMediaEventsTrack &&
      manifestRef.mediaEventHistory !== undefined
    ) {
      const trackTimescale = supplementaryTracks[0].timescaleValue;
      if (
        trackTimescale !== undefined &&
        manifestRef.mediaEventHistory.timescaleValue !== trackTimescale
      ) {
        this.console.RETRY(
          "MediaEventsStore: MediaEvents history timescale does not match track timescale",
          {
            historyTimescale: manifestRef.mediaEventHistory.timescaleValue,
            trackTimescale,
          }
        );
        manifestRef.mediaEventHistory.timescaleValue = trackTimescale;
      }
      this.mediaEventsStore = new MediaEventsStore(
        playerScheduler,
        this,
        this.config,
        manifestRef.mediaEventHistory
      );

      // Adjust ad-break content timestamps based on program-start event.
      if (
        this.adverts &&
        this.mediaEventsStore.store?.internal_Dra?.programStartEvent
      ) {
        const programStartTime =
          this.mediaEventsStore.store.internal_Dra.programStartEvent?.timeValue;
        this.adverts.adBreaks.forEach((ab) => {
          ab.timeValue = ab.location.item(programStartTime);
          if (ab.duration !== ab.ads) {
            ab.contentTimestamp = ab.timeValue;
          }
        });
      }
      this.eventProcessingPipeline.getRemaining(
        new MediaEventsProcessorSink(this.mediaEventsStore.xo)
      );
    }

    this.eventProcessingPipeline.getRemaining(
      new PaddingViewableEventProcessor(this.connectionSharingMap)
    );

    // ── ELLA transport (analytics) ──
    if (this.isEllaEnabled) {
      this.ellaTransport = loadEllaTransport(this.config).then(async (ella) => {
        this.ellaSessionKey = ella.getPlaybackMetrics({
          zPa: this.config.ellaCdnBaseUrl,
        });
        return ella;
      });
    }
  }

  // ──────────────────────────────────────────────
  //  Properties
  // ──────────────────────────────────────────────

  /** @returns {boolean} Whether the network state manager indicates auxiliary manifest. */
  get isAuxiliaryManifestReady() {
    return this.networkState.isAuxiliaryManifest();
  }

  /** @returns {object} The manifest reference. */
  get manifest() {
    return this.manifestRef;
  }

  /** @returns {boolean} Whether the manifest is a multi-period (dynamic) manifest. */
  get isMultiPeriod() {
    return qB(this.manifestRef.manifestType);
  }

  /** @returns {boolean} Whether the manifest has a segment availability window. */
  get hasSegmentWindow() {
    return hasSegmentAvailabilityWindow(this.manifestRef.manifestType);
  }

  /** @returns {boolean} Whether this is an unbounded live event. */
  get isUnboundedLive() {
    return (
      this.isAdPlaygraph && !this.liveEventTimes?.endTime
    );
  }

  /** @returns {string} Movie / content id. */
  get movieId() {
    return this.manifestRef.movieId;
  }

  /** @returns {object} Choice map for interactive content. */
  get choiceMap() {
    return this.manifestRef.choiceMap;
  }

  /** @returns {number} Content duration. */
  get duration() {
    return this.manifestRef.duration;
  }

  /** @returns {boolean} Whether the viewable has been disposed/closed. */
  get isDisposed() {
    return this.isClosed;
  }

  /** @returns {object} Buffer-size limiter instance. */
  get bufferLimiter() {
    return this.bufferLimiterInstance;
  }

  /** @returns {ErrorDirectorClass} */
  get errorHandler() {
    softAssert(
      this.errorDirector,
      "ErrorDirector is not available on old architecture prefetch viewables."
    );
    return this.errorDirector;
  }

  /** @returns {EventEmitter} Error-director events. */
  get errorEvents() {
    return this.errorHandler.events;
  }

  /** @returns {number} Current server time in ms. */
  get serverTimeMs() {
    return this.serverClock.serverTimeMs;
  }

  /** @returns {object} Snapshot of live event start/end times. */
  get liveEventTimes() {
    return this.liveEventTimesSnapshot;
  }

  /** @returns {object} Live timing snapshots. */
  get liveTimings() {
    return this.liveTimingSnapshots;
  }

  /** @returns {number} Current stream switchability state. */
  get switchability() {
    return this.streamSwitchability;
  }

  set switchability(value) {
    this.streamSwitchability = value;
  }

  /** @returns {boolean} Whether steering is sticky. */
  get isStickySteeringEnabled() {
    return (
      this.manifestRef.steeringAdditionalInfo?.stickySteeringMetadata?.tB ||
      false
    );
  }

  /** @returns {number} Playgraph id. */
  get playgraphIndex() {
    return this.playgraphId;
  }

  /** @returns {boolean} Whether the viewable has a live parent. */
  get hasLiveParent() {
    return !!this.liveParent;
  }

  /** @returns {object|undefined} The live-parent viewable (self for live, parent's live parent otherwise). */
  get liveParent() {
    return this.isAdPlaygraph ? this : this.parentViewable?.liveParent;
  }

  /** @returns {boolean} Whether ELLA analytics are enabled. */
  get isEllaEnabled() {
    return this.config.liveIsEllaEnabled ? this.isAdPlaygraph : false;
  }

  /**
   * Check whether the config manager detected a manifest change.
   * @returns {boolean}
   */
  hasConfigChanged() {
    return this.config.useConfigManager
      ? this.configWrapper.hasConfigChanged(this.manifestRef)
      : false;
  }

  // ──────────────────────────────────────────────
  //  Lifecycle
  // ──────────────────────────────────────────────

  /** Destroy the viewable and release all resources. */
  destroy() {
    this.events.emit("destructed", { L: this });
    this.close();
    this.dispose();
  }

  /**
   * Check if the current video track supports HDR.
   * @param {object} trackSelector
   * @returns {boolean}
   */
  hasHdrContent(trackSelector) {
    const track = this.resolveTrack(MediaType.U, trackSelector);
    return !!(track?.JJb);
  }

  /** Close pending requests and mark the viewable as closed. @private */
  close() {
    this.pendingHeaderRequests = [];
    this.errorDirector?.destroy();
    this.locationSelector.destroy();
    this.mediaEventsStore?.destroy();
    this.isClosed = true;
  }

  /** Dispose header and text-indexer resources. @private */
  dispose() {
    this.headerManager.dispose();
    this.textIndexer?.dispose();
  }

  // ──────────────────────────────────────────────
  //  Manifest updates
  // ──────────────────────────────────────────────

  /**
   * Update the viewable with a refreshed manifest (e.g. after a license renewal
   * or live manifest refresh).
   *
   * @param {object} updateParams - { manifestRef, isReadyForPlayback }.
   */
  updateFromManifest(updateParams) {
    const newManifest = updateParams.manifestRef;
    const newClearPlay = updateParams.isReadyForPlayback;

    let liveMaxBitrate;
    if (this.isAdPlaygraph) {
      liveMaxBitrate = newManifest.liveMetadata.maxBitrate;
    }

    softAssert(
      newClearPlay === this.isReadyForPlayback,
      "Updating Viewable clearplay not supported"
    );
    softAssert(
      newManifest.movieId === this.manifestRef.movieId,
      "Changing Viewable manifest movieId unsupported"
    );

    const trackListKeys = ["audio_tracks", "video_tracks"];
    trackListKeys.forEach((key, mediaTypeIdx) => {
      const newTracks = newManifest[key];
      const existing = this.tracksByType[mediaTypeIdx];

      softAssert(
        existing.every((trk) => {
          const meta = newTracks[trk.trackIndex];
          return (
            meta &&
            meta.trackIdMatch === trk.trackId &&
            (meta.type === MediaType.U || meta.isMissing !== false)
          );
        }),
        "Existing tracks must still exist and be hydrated in updated manifest"
      );

      newTracks.forEach((trackMeta, trackIdx) => {
        if (
          trackMeta.type === MediaType.V &&
          (trackMeta.isNone || trackMeta.isMissing === false)
        ) {
          return;
        }

        const existingTrack = this.getTrackById(trackMeta.trackIdMatch);
        if (existingTrack) {
          if (isLiveStream(existingTrack)) {
            existingTrack.SM = liveMaxBitrate;
            existingTrack.g4(EventProcessingPipeline.XP.manifestRef, liveMaxBitrate);
          }
          const streams = trackMeta.streams;
          const existingStreamIds = Object.keys(existingTrack.getStreamMap());
          softAssert(
            streams.length === existingStreamIds.length,
            "Expected updated manifest track to have same number of streams"
          );
          streams.forEach((s) => {
            softAssert(
              existingStreamIds.indexOf(s.downloadable_id) !== -1,
              "Changing Viewable track streams unsupported"
            );
          });
        } else {
          const newTrack = createTrack(
            {
              viewableSession: this,
              trackMetadata: trackMeta,
              mediaType: mediaTypeIdx,
              isReadyForPlayback: this.isReadyForPlayback,
              trackIndex: trackIdx,
              STREAMING:
                trackIdx +
                (mediaTypeIdx === MediaType.V
                  ? this.manifestRef.video_tracks.length
                  : 0),
              SM: liveMaxBitrate,
            },
            this.config,
            this.console
          );
          existing.push(newTrack);
          this.streamMaps[mediaTypeIdx] = {
            ...this.streamMaps[mediaTypeIdx],
            ...newTrack.getStreamMap(),
          };
          if (newTrack.maxBitrate > this.maxBitrateByType[newTrack.mediaType]) {
            this.maxBitrateByType[newTrack.mediaType] = newTrack.maxBitrate;
          }
          softAssert(
            this.hasDrmContentProfile || !newTrack.contentProfile,
            "Can not update clear viewable with drm track."
          );
        }
      });
    });

    this.manifestRef = newManifest;
    this.locationSelector.updateManifestMetadata(this.manifestRef, this.streamMaps);
  }

  // ──────────────────────────────────────────────
  //  Side channel (OCA)
  // ──────────────────────────────────────────────

  /**
   * Initialise the v2 manifest side channel.
   * @param {object} params
   */
  initSideChannelV2(params) {
    const { pbcid, sourceTransactionId, s_, VT: logWarning } = params;
    if (pbcid && sourceTransactionId) {
      this.blackBoxNotifier2 = new Sidechannel(pbcid, {
        Ia: String(sourceTransactionId),
        s_: !!s_,
        UIc: this.config.OCSCBufferQuantizationConfig.mx,
        internal_Aec: this.config.OCSCBufferQuantizationConfig.lv,
        bOc: this.config.padOcaSideChannelRequests,
        enableBlackBoxNotification: this.config.enableBlackBoxNotification,
      }, logWarning);
    } else if (!this.sideChannelWarningEmitted) {
      logWarning("SideChannel: pbcid/xid is missing.");
      this.sideChannelWarningEmitted = true;
    }
  }

  /**
   * Initialise the v1 side-channel coordinator.
   * @param {object} params
   */
  initSideChannelCoordinator(params) {
    const { pbcid, sourceTransactionId, s_, VT: logWarning } = params;
    if (pbcid && sourceTransactionId) {
      const opts = {
        sessionId: String(sourceTransactionId),
        s_: !!s_,
        SKc: this.config.enableNginxRateLimit
          ? this.config.nginxSendingRate
          : undefined,
        dVc: this.config.padOcaSideChannelRequests,
      };
      this.sideChannelCoordinator = this.isAdPlaygraph
        ? createLiveSideChannel(
            pbcid,
            opts,
            this.handleSideChannelResponse.bind(this),
            this.config.decryptOCSideChannelMinInterval,
            this.console
          )
        : createStaticSideChannel(pbcid, opts, undefined, this.console);

      if (this.sideChannelCoordinator) {
        this.sideChannelCoordinator.getRemaining(this.eventProcessingPipeline);
      }
    } else if (!this.sideChannelWarningEmitted) {
      logWarning("SideChannelCoordinator: pbcid/xid is missing.");
      this.sideChannelWarningEmitted = true;
    }
  }

  /**
   * Handle a decoded side-channel response (clock sync, live timings, encoder info, etc.).
   * @param {object} sideChannelData
   * @param {object} requestMetadata
   * @private
   */
  handleSideChannelResponse(sideChannelData, requestMetadata) {
    // Clock sync.
    if (
      sideChannelData.response?.serverTimeMs !== undefined &&
      requestMetadata.throughputEstimateObj !== undefined
    ) {
      this.conditionallyUpdateServerTime(
        sideChannelData.response.serverTimeMs,
        requestMetadata.throughputEstimateObj
      );
    }

    // Live event times.
    if (
      sideChannelData.title?.internal_Yua ||
      sideChannelData.title?.internal_Xua
    ) {
      this.updateLiveEventTimes(
        sideChannelData.title.internal_Yua?.platform,
        sideChannelData.title.internal_Xua?.platform
      );
    }

    // Encoder info.
    if (sideChannelData.data && requestMetadata.mediaType) {
      this.updateEncoderInfo(requestMetadata.mediaType, {
        Bo: sideChannelData.data.encoderTag,
        encoderRegion: sideChannelData.data.encoderRegion,
        encodingLoggingInfo: requestMetadata.byteRangeHint,
        downloadableStreamId: requestMetadata.selectedStreamId,
      });
    }

    // Max bitrate update.
    if (sideChannelData.title?.maxBitrate !== undefined) {
      const newMax = sideChannelData.title.maxBitrate;
      if (newMax > 0) {
        this.getTracks(MediaType.U).forEach((track) => {
          if (isLiveStream(track)) {
            track.SM = newMax;
            track.g4(EventProcessingPipeline.XP.hTb, newMax);
          }
        });
      }
    }

    // Live timing messages (prefetch / execute).
    if (
      sideChannelData.title?.BU?.platform !== undefined &&
      sideChannelData.title?.zU !== undefined
    ) {
      this.updateLiveTimings(
        "prefetch",
        sideChannelData.title.BU.platform,
        String(sideChannelData.title.zU)
      );
    }
    if (
      sideChannelData.title?.wU?.platform !== undefined &&
      sideChannelData.title?.vU !== undefined
    ) {
      this.updateLiveTimings(
        "execute",
        sideChannelData.title.wU.platform,
        String(sideChannelData.title.vU)
      );
    }
  }

  // ──────────────────────────────────────────────
  //  Track access
  // ──────────────────────────────────────────────

  /**
   * Check whether this viewable has interactive (choice-map) content.
   * @returns {boolean}
   */
  hasChoiceMap() {
    return this.choiceMap !== undefined;
  }

  /**
   * Get tracks by media type (or all tracks if type is undefined).
   * @param {number} [mediaType]
   * @returns {object[]}
   */
  getTracks(mediaType) {
    return mediaType === undefined
      ? flatten(this.tracksByType)
      : this.tracksByType[mediaType];
  }

  /**
   * Resolve a track using a selector function.
   * @param {number}   mediaType
   * @param {object}   selector
   * @returns {object|undefined}
   * @private
   */
  resolveTrack(mediaType, selector) {
    const tracks = this.getTracks(mediaType);
    const idx = selector.kV(
      this.manifestRef,
      tracks.map((t) => t.trackMetadata)
    );
    return typeof idx === "number" && idx >= 0 ? tracks[idx] : undefined;
  }

  /**
   * Find a track by its unique track id.
   * @param {string} trackId
   * @returns {object|undefined}
   */
  getTrackById(trackId) {
    let found;
    this.tracksByType.some((group) =>
      group.some((track) => {
        if (track.trackId === trackId) {
          found = track;
          return true;
        }
      })
    );
    if (!found) {
      this.console.RETRY(
        "getTrackById not found:",
        trackId,
        "length:",
        this.tracksByType.length
      );
    }
    return found;
  }

  /**
   * Get a specific stream (downloadable) by media type and stream id.
   * @param {number} mediaType
   * @param {string} streamId
   * @returns {object|undefined}
   */
  getStreamByTypeAndId(mediaType, streamId) {
    const map = this.getStreamMap(mediaType);
    return map?.[streamId];
  }

  /**
   * Get the full stream map for a media type.
   * @param {number} mediaType
   * @returns {object}
   */
  getStreamMap(mediaType) {
    return this.streamMaps[mediaType];
  }

  /**
   * Resolve CDN location and server for a given request.
   * @param {object} requestInfo
   * @returns {{ gZa: boolean, ZEc: boolean }}
   */
  resolveLocation(requestInfo) {
    if (requestInfo.tya === undefined || requestInfo.b3a === undefined) {
      const cdn = this.locationSelector
        .D0()
        .filter((c) => c.streams[requestInfo.selectedStreamId] !== undefined)[0];
      const server = cdn.children.filter((s) =>
        s.urls.some((u) => u.stream.id === requestInfo.selectedStreamId)
      )[0];
      requestInfo.tya = cdn.id;
      requestInfo.b3a = server.id;
    }
    return {
      gZa: requestInfo.location === requestInfo.tya,
      ZEc: requestInfo.liveAdjustAudioTimestamps === requestInfo.b3a,
    };
  }

  // ──────────────────────────────────────────────
  //  Fragment / header handling
  // ──────────────────────────────────────────────

  /**
   * Process a parsed TFDT (track fragment decode time) box.
   * @param {object} streamInfo
   * @param {*}      location
   * @param {*}      fragmentData
   */
  onFragmentTimeParsed(streamInfo, location, fragmentData) {
    if (location !== undefined && fragmentData !== undefined) {
      this.updateNetworkMonitorLocation(streamInfo.mediaType, location);
      streamInfo.parseTfdt(location, fragmentData);
    }
  }

  /**
   * Update network monitor with the current CDN location for a media type.
   * @param {number} mediaType
   * @param {*}      location
   * @private
   */
  updateNetworkMonitorLocation(mediaType, location) {
    const granularity = this.config.networkMeasurementGranularity;
    if (
      granularity === "location" ||
      (granularity === "video_location" && mediaType === MediaType.U)
    ) {
      this.networkMonitor.setNetworkMonitorListener(location);
    }
  }

  /**
   * Report a network failure.
   * @param {object} failureInfo
   * @returns {boolean}
   */
  onNetworkFailure(failureInfo) {
    softAssert(
      this.networkFailureCallback,
      "Stream failure reporting can not be used on old architecture prefetch viewables."
    );
    return this.networkFailureCallback(failureInfo);
  }

  /**
   * Normalize a timestamp to the nearest segment boundary.
   * @param {object[]} trackSelectors
   * @param {number}   timestampMs
   * @returns {TimeUtil|undefined}
   */
  normalizeTimestamp(trackSelectors, timestampMs) {
    softAssert(
      !this.isAdPlaygraph,
      "Unexpected normalizeTimestamp. Live segments not supported. Use AsePlaygraph.normalizeLiveSegment() instead."
    );
    let track = this.resolveTrack(
      MediaType.U,
      trackSelectors[MediaType.U]
    );
    if (!track) {
      this.console.log(
        "normalizeTimestamp looking for audio track in absence of video track"
      );
      track = this.resolveTrack(MediaType.V, trackSelectors[MediaType.V]);
    }
    if (track?.headerData) {
      const time = TimeUtil.fromMilliseconds(timestampMs);
      const segStart = track.lookupSegmentByProperties(
        this.config,
        time,
        undefined,
        true
      ).presentationStartTime;
      return time
        .item(track.headerData.durationValue)
        .timeComparison(segStart)
        ? segStart
        : track.RL(this.config, time).segmentEndTime;
    }
  }

  // ──────────────────────────────────────────────
  //  URL rotation
  // ──────────────────────────────────────────────

  /**
   * Rotate CDN URLs for all media types.
   * @param {object} [failedStream]
   * @returns {boolean}
   */
  updateRequestUrls(failedStream) {
    if (this.isDisposed) {
      this.console.error("updateRequestUrls, closed Viewable:", this.viewableId);
      return false;
    }
    ALL_MEDIA_TYPES.forEach((mt) => {
      if (this.updateStreamUrlsForMediaType(mt, failedStream)) {
        this.updateStreamUrlsForBranch(mt);
      }
    });
    this.updateHeadersRequestUrls();
    this.events.emit("urlsUpdated", {});
    return true;
  }

  /**
   * Look up a segment by properties using the video track.
   * @param {object}   config
   * @param {TimeUtil} time
   * @param {object}   [trackSelector]
   * @returns {object|undefined}
   */
  lookupSegmentByProperties(config, time, trackSelector) {
    const track = this.resolveTrack(MediaType.U, trackSelector);
    return track?.headerData ? track.lookupSegmentByProperties(config, time) : undefined;
  }

  /**
   * Update server time from a side-channel response.
   * @param {number} serverTimeMs
   * @param {number} segmentDurationMs
   */
  conditionallyUpdateServerTime(serverTimeMs, segmentDurationMs) {
    this.serverClock.conditionallyUpdateServerTime(serverTimeMs, segmentDurationMs);
  }

  /**
   * Get the live-segment duration from the video track.
   * @returns {TimeUtil}
   */
  getLiveSegmentDuration() {
    const tracks = this.getTracks();
    const videoTrack = tracks[hn(tracks, (t) => t.mediaType === MediaType.U)];
    softAssert(videoTrack, "AseViewable.getLiveSegmentDuration(): No video track");
    softAssert(
      isLiveStream(videoTrack),
      "AseViewable.getLiveSegmentDuration(): Video stream undefined or not live"
    );
    return videoTrack.trackInfo;
  }

  /** @private */
  updateStreamUrlsForMediaType(mediaType, failedStream) {
    if (this.isDisposed) {
      this.console.RETRY("updateStreamUrls ignored, viewable cleaned up");
      return false;
    }
    return this.branches
      .reduce(
        (acc, branch) =>
          XY(
            acc,
            branch.tracks.filter((t) => t.mediaType === mediaType)
          ),
        []
      )
      .map((track) =>
        this.locationSelector.selectLocation(
          this.viewableId,
          track.downloadables,
          undefined,
          failedStream
        )
      )
      .every(Boolean);
  }

  /** @private */
  updateHeadersRequestUrls() {
    softAssert(
      this.headerManager,
      "Headers not available on old architecture prefetch viewables."
    );
    this.headerManager.updateRequestUrls();
  }

  /** @private */
  updateStreamUrlsForBranch(mediaType) {
    const updated = [];
    if (this.isDisposed) {
      this.console.RETRY("updateStreamUrls ignored, viewable cleaned up");
    } else {
      for (const branch of this.branches) {
        const result = branch.updateRequestUrls(mediaType);
        if (result.length) updated.push(...result);
      }
    }
  }

  // ──────────────────────────────────────────────
  //  Setup & buffer status
  // ──────────────────────────────────────────────

  /** Initialise the location selector and trigger initial black-box notifications. */
  setup() {
    this.locationSelector.setup();
    if (this.blackBoxNotifier2 || this.sideChannelCoordinator) {
      ALL_MEDIA_TYPES.forEach((mt) => {
        this.sendBlackBoxNotification(
          "rebuffer",
          this.getMediaTypeStreamState(mt).pendingDownloadHandle
        );
      });
    }
  }

  /**
   * Get the download state for a media type.
   * @param {number} mediaType
   * @returns {MediaTypeStreamState}
   */
  getMediaTypeStreamState(mediaType) {
    return this.mediaTypeStates[mediaType];
  }

  /**
   * Send a black-box notification (OCA-side notification for debugging).
   * @param {string} eventType
   * @param {*}      downloadHandle
   */
  sendBlackBoxNotification(eventType, downloadHandle) {
    if (!this.config.enableBlackBoxNotification) return;

    let notification;
    if (this.sideChannelCoordinator) {
      notification = this.sideChannelCoordinator.lwb({ n$: eventType });
    } else if (this.blackBoxNotifier2) {
      notification = this.blackBoxNotifier2.tu({ n$: eventType });
    }

    if (downloadHandle && notification) {
      try {
        new platform.setImmediate(undefined, "notification").send(
          downloadHandle,
          undefined,
          2,
          undefined,
          undefined,
          undefined,
          notification
        );
      } catch (err) {
        this.console.error("BlackBox notification failed:", err);
      }
    }
  }

  /** Resume any paused network requests. */
  resumePausedRequests() {
    if (this.pausedRequests.length === 0) return;
    const stillPaused = [];
    this.pausedRequests.forEach((req) => {
      if (!req.resume()) stillPaused.push(req);
    });
    this.pausedRequests = stillPaused;
  }

  // ──────────────────────────────────────────────
  //  Header requests
  // ──────────────────────────────────────────────

  /**
   * Get a stream header.
   * @param {object} stream
   * @param {object} options
   * @returns {*}
   */
  getStreamHeader(stream, options) {
    return this.headerManager.getStreamHeader(stream, options);
  }

  /**
   * Queue a header request for later dispatch.
   * @param {object} stream
   * @param {object} requestKey
   * @param {*}      callback
   */
  queueHeaderRequest(stream, requestKey, callback) {
    this.pendingHeaderRequests.push({
      K: requestKey,
      stream,
      internal_Hzc: callback,
    });
  }

  /** Clear all pending header requests. */
  clearPendingRequests() {
    this.pendingHeaderRequests = [];
  }

  /**
   * Remove pending requests for a specific stream.
   * @param {object} stream
   */
  removeStreamRequests(stream) {
    this.pendingHeaderRequests = this.pendingHeaderRequests.filter(
      (r) => r.stream !== stream
    );
  }

  /**
   * Remove a single pending request.
   * @param {object} request
   */
  removeRequest(request) {
    this.pendingHeaderRequests = this.pendingHeaderRequests.filter(
      (r) => r !== request
    );
  }

  /**
   * Get all pending requests wrapped as PendingRequest objects.
   * @returns {PendingRequest[]}
   */
  getPendingRequests() {
    if (this.onNetworkFailureCb()) return [];
    return this.pendingHeaderRequests.map(
      (req) => new PendingRequest(this, req)
    );
  }

  /**
   * Proxy to headerManager.IC.
   */
  IC(a, b, c) {
    softAssert(
      this.headerManager,
      "Headers not available on old architecture prefetch viewables."
    );
    return this.headerManager.IC(a, b, c);
  }

  /**
   * Proxy to headerManager.BY.
   */
  BY(a, b) {
    softAssert(
      this.headerManager,
      "Headers not available on old architecture prefetch viewables."
    );
    this.headerManager.BY(a, b);
  }

  /**
   * Called when header fragments are received for a stream.
   * @param {object} headerInfo
   */
  onHeaderFragmentsReceived(headerInfo) {
    const mediaType = headerInfo.mediaType;
    this.getStreamByTypeAndId(mediaType, headerInfo.selectedStreamId).H2c(
      platform.C0()[mediaType],
      this.hasChoiceMap() ? this.config.maxFragsForFittableOnBranching : 0
    );
    this.events.emit("onHeaderFragments", headerInfo);
  }

  // ──────────────────────────────────────────────
  //  Branch management
  // ──────────────────────────────────────────────

  /**
   * Register a branch with this viewable.
   * @param {object} branch
   */
  registerBranch(branch) {
    this.branches.push(branch);
  }

  /**
   * Unregister a branch.
   * @param {object} branch
   */
  unregisterBranch(branch) {
    const idx = this.branches.indexOf(branch);
    softAssert(
      idx !== -1,
      "Unexpected call to unregisterBranch, branch not registered with Viewable."
    );
    this.branches.splice(idx, 1);
  }

  // ──────────────────────────────────────────────
  //  Request lifecycle callbacks
  // ──────────────────────────────────────────────

  /**
   * Notify the request-group aggregator of a completed request.
   * @param {object} request
   */
  onRequestGroupComplete(request) {
    this.requestGroupAggregator?.by(request);
  }

  /**
   * Called when a media request becomes active.
   * @param {object} request
   */
  onRequestActive(request) {
    if (this.isDisposed) {
      this.console.RETRY(
        "onloadstart ignored, viewable cleaned up, mediaRequest:",
        request
      );
    } else if (request.location !== undefined) {
      this.updateNetworkMonitorLocation(request.mediaType, request.location);
    }
  }

  /**
   * Called when data is received for a media request.
   * @param {object} request
   */
  onDataReceived(request) {
    if (this.isDisposed) {
      this.console.RETRY(
        "onprogress ignored, viewable cleaned up, mediaRequest:",
        request
      );
    } else if (isDataRequest(request)) {
      this.errorHandler.LO(request);
    }
  }

  /**
   * Called when a media request completes.
   * @param {object} request
   */
  onRequestComplete(request) {
    if (isCompletableRequest(request)) {
      this.requestGroupAggregator?.recordRequestComplete(request);
    }
    if (this.isDisposed) {
      this.console.RETRY(
        "oncomplete ignored, viewable cleaned up, mediaRequest:",
        request
      );
    } else if (!this.onNetworkFailureCb() && isDataRequest(request)) {
      this.errorHandler.LO(request);
    }
  }

  /**
   * Called when a request is redirected to a different branch.
   * @param {object}  request
   * @param {object}  _newBranch
   * @param {boolean} wasCompleted
   */
  onRequestRedirectedBranch(request, _newBranch, wasCompleted) {
    if (wasCompleted) {
      this.requestGroupAggregator?.recordRequestComplete(request);
    }
  }

  /**
   * Called when a media request fails.
   * @param {object} request
   */
  onRequestFailed(request) {
    if (this.isDisposed) {
      this.console.RETRY(
        "onerror ignored, viewable cleaned up, mediaRequest:",
        request
      );
    } else if (isDataRequest(request)) {
      this.errorHandler.reportEngineError(
        request,
        undefined,
        request.status,
        request.errorCode,
        request.dh
      );
      if (
        !this.updateRequestUrls(request.stream) ||
        this.onNetworkFailure({
          ej: request.errorName || "unknown",
          errorSubCode: "NFErr_MC_StreamingFailure",
          networkErrorCode: request.errorCode,
          httpCode: request.status,
          dh: request.dh,
          liveAdjustAudioTimestamps: request.stream.liveAdjustAudioTimestamps,
        })
      ) {
        // Error was handled or propagated.
      }
    }
  }

  /**
   * Track paused requests.
   * @param {object} request
   */
  onRequestPaused(request) {
    if (isPausableRequest(request)) {
      this.pausedRequests.push(request);
    }
  }

  // ──────────────────────────────────────────────
  //  Live event & timing updates
  // ──────────────────────────────────────────────

  /** Read live event times from the manifest metadata. */
  updateLiveEventTimesFromMetadata() {
    this.updateLiveEventTimes(
      this.manifestRef.liveMetadata?.liveEventStartTime,
      this.manifestRef.liveMetadata?.liveEventEndTime,
      true
    );
  }

  /** Re-apply pending live timing actions. @private */
  reapplyLiveTimings() {
    const pf = this.liveTimingActions.prefetch;
    if (pf?.startTime !== undefined && pf?.duration !== undefined) {
      this.updateLiveTimings("prefetch", pf.startTime, pf.duration, false);
    }
    const ex = this.liveTimingActions.execute;
    if (ex?.startTime !== undefined && ex?.duration !== undefined) {
      this.updateLiveTimings("execute", ex.startTime, ex.duration, false);
    }
  }

  /**
   * Update live-event start/end times and emit events.
   * @param {number}  [startTime]
   * @param {number}  [endTime]
   * @param {boolean} [force]
   * @param {*}       [metadata]
   */
  updateLiveEventTimes(startTime, endTime, force, metadata) {
    softAssert(
      this.manifestRef.liveMetadata,
      "Missing manifest liveMetadata."
    );
    const manifestTimes = this.manifestRef.liveMetadata;
    const prevTimes = this.liveEventTimes;

    this.liveEventTimesSnapshot = {
      startTime:
        manifestTimes.liveEventStartTime ?? startTime ?? prevTimes.startTime,
      endTime:
        manifestTimes.liveEventEndTime ?? endTime ?? prevTimes.endTime,
      ML: metadata,
    };

    const startChanged =
      this.liveEventTimesSnapshot.startTime !== prevTimes.startTime;
    const endChanged =
      this.liveEventTimesSnapshot.endTime !== prevTimes.endTime;
    const metadataChanged = this.didLiveTimingsChange(prevTimes);

    if (force || startChanged || endChanged || metadataChanged) {
      this.events.emit("liveEventTimesUpdated", {
        L: this,
        ...this.liveEventTimesSnapshot,
      });
      this.reapplyLiveTimings();
    }

    if (endChanged || metadataChanged) {
      this.branches.forEach((b) => b.resetState());
    }
  }

  /**
   * Update per-media-type encoder logging info.
   * @param {number} mediaType
   * @param {object} info
   */
  updateEncoderInfo(mediaType, info) {
    if (
      this.encoderLoggingInfo[mediaType].encoderRegion !== info.encoderRegion ||
      this.encoderLoggingInfo[mediaType].encoderTag !== info.encoderTag
    ) {
      this.encoderLoggingInfo[mediaType] = info;
      this.events.emit("liveLoggingInfoUpdated", {
        L: this,
        mediaType,
        info,
      });
    }
  }

  /**
   * Update live-timing annotations (prefetch / execute windows).
   * @param {string}  action    - "prefetch" or "execute".
   * @param {number}  startTime - Wall-clock start in ms.
   * @param {string}  duration  - Duration string (seconds).
   * @param {boolean} [force]
   */
  updateLiveTimings(action, startTime, duration, force) {
    const executeChanged =
      !this.liveTimingActions.execute ||
      this.liveTimingActions.execute.startTime !== startTime ||
      this.liveTimingActions.execute.duration !== duration ||
      force;
    const prefetchChanged =
      !this.liveTimingActions.prefetch ||
      this.liveTimingActions.prefetch.startTime !== startTime ||
      this.liveTimingActions.prefetch.duration !== duration ||
      force;

    if (!this.networkState.liveEventStartTime) {
      this.console.RETRY(
        "Received oc live message prior to event start, ignoring",
        { action, actionTime: startTime, duration }
      );
      return;
    }

    const normalizedStart = this.networkState.cjc(startTime);
    const durationMs = 1000 * Number(duration);
    const jitteredStart =
      Math.floor(Math.random() * durationMs) + normalizedStart.playbackSegment;
    const rawStartMs = normalizedStart.playbackSegment;
    const timecodeType = action === "execute" ? "ending" : "prefetch";

    if (
      (action === "execute" && executeChanged) ||
      (action === "prefetch" && prefetchChanged)
    ) {
      this.liveTimingActions[action] = { startTime, duration };
      this.liveTimingSnapshots[action] = {
        rawStartMs,
        rawEndMs: rawStartMs + durationMs,
        selectedStartMs: jitteredStart,
      };
      this.timecodes = this.timecodes.filter((tc) => tc.type !== timecodeType);
      this.timecodes.push({
        r4: jitteredStart,
        xrc: jitteredStart,
        type: timecodeType,
      });
      this.events.emit("livePostplayUpdated", {
        L: this,
        jitteredStart: jitteredStart,
        action,
      });
    }
  }

  /** @returns {object[]} Chapter markers. */
  getChapters() {
    return this.chapters;
  }

  // ──────────────────────────────────────────────
  //  Live fragment & edge
  // ──────────────────────────────────────────────

  /**
   * Handle the first live fragment received for a track.
   * @param {object} trackInfo
   * @param {object} branch
   */
  onFirstFragmentLive(trackInfo, branch) {
    if (this.isAdPlaygraph && trackInfo.mediaType === MediaType.V) {
      const videoTrack = findLast(
        branch.tracks,
        (t) => t.mediaType === MediaType.U
      );
      softAssert(
        isLiveStream(videoTrack),
        "onFirstFragmentReceived called with non-live branch"
      );
      const startOffset = videoTrack.vy;
      trackInfo.XLc(
        videoTrack.presentationTime,
        this.config.$Hb ? startOffset : TimeUtil.seekToSample
      );
      this.branches.forEach((b) =>
        b.isPlaybackActive
          ? b.updateFragmentTimes(trackInfo)
          : b.isPlaybackActive
      );
    }
  }

  /**
   * Get the live-edge time.
   * @param {boolean} [useFallback=false]
   * @returns {number}
   */
  getLiveEdgeTime(useFallback = false) {
    return this.networkState.getLiveEdgeTime(useFallback);
  }

  /**
   * Get the current playgraph node for the live edge.
   * @param {boolean} [useFallback=false]
   * @returns {object}
   */
  getPlaygraphNode(useFallback = false) {
    return this.networkState.getPlaygraphNode(useFallback);
  }

  /**
   * Get the buffer end time for the live edge.
   * @returns {TimeUtil}
   */
  getBufferEndTime() {
    return this.networkState.getBufferEndTime();
  }

  /**
   * Record a playgraph update from the network state.
   * @param {*} update
   */
  recordPlaygraphUpdate(update) {
    this.networkState.recordPlaygraphUpdate(update);
    this.mediaEventsStore?.cuc();
  }

  /**
   * Report a playgraph update (delta adjustment).
   * @param {number} delta
   */
  reportPlaygraphUpdate(delta) {
    this.networkState.reportPlaygraphUpdate(delta);
  }

  // ──────────────────────────────────────────────
  //  Error handling
  // ──────────────────────────────────────────────

  /**
   * Handle a streaming failure (permanent or transient).
   * @param {object} failureInfo
   * @private
   */
  handleStreamingFailure(failureInfo) {
    if (this.isClosed) return;

    const {
      lua: isPermanent,
      BNc: lastErrorCode,
      DNc: lastHttpCode,
      ENc: lastNativeCode,
      liveAdjustAudioTimestamps: server,
    } = failureInfo;

    this.console.RETRY(
      `Streaming failure, is permanent: ${isPermanent}, ` +
        `last error code: ${lastErrorCode}, last http code: ${lastHttpCode}, ` +
        `last native code: ${lastNativeCode}, server: ${server}`
    );

    let handled;
    if (isPermanent) {
      this.console.RETRY(" > Permanent failure, done");
      handled = this.onNetworkFailure({
        ej: "Permanent failure",
        errorSubCode: "NFErr_MC_StreamingFailure",
        networkErrorCode: lastErrorCode,
        httpCode: lastHttpCode,
        dh: lastNativeCode,
        liveAdjustAudioTimestamps: server,
      });
    } else {
      this.console.RETRY(" > We are buffering, calling it!");
      handled = this.onNetworkFailure({
        ej: "Temporary failure while buffering",
        errorSubCode: "NFErr_MC_StreamingFailure",
        networkErrorCode: lastNativeCode,
        httpCode: lastHttpCode,
        dh: lastNativeCode,
        f7a: true,
        liveAdjustAudioTimestamps: server,
      });
    }

    if (!handled) {
      this.console.RETRY(" > Resetting failures");
      this.errorHandler.H3();
    }
  }

  /**
   * Reset all errors and retry pending requests.
   * @private
   */
  resetAndRetryRequests() {
    softAssert(
      this.retryHandler,
      "Error handling not available on old architecture prefetch viewables."
    );
    if (!this.isClosed) {
      this.updateRequestUrls();
      this.retryHandler();
    }
  }

  /** @private */
  didLiveTimingsChange(prevTimes) {
    if (prevTimes.ML && this.liveEventTimesSnapshot.ML) {
      return this.liveEventTimesSnapshot.ML < prevTimes.ML;
    }
    return this.liveEventTimesSnapshot.ML !== prevTimes.ML;
  }

  // ──────────────────────────────────────────────
  //  TCP connection sharing
  // ──────────────────────────────────────────────

  /**
   * Validate that the specified media types share compatible CDN locations
   * and server assignments.
   *
   * @param {number[]} mediaTypes
   * @returns {boolean}
   */
  validateConnectionSharingAvailability(mediaTypes) {
    if (
      !mediaTypes ||
      mediaTypes.length < 2 ||
      !mediaTypes.every((mt) => (this.tracksByType[mt] || []).length > 0)
    ) {
      return false;
    }

    const locationsByType = {};
    const serversByTypeAndLocation = {};

    for (const mt of mediaTypes) {
      locationsByType[mt] = new Set();
      serversByTypeAndLocation[mt] = {};
      for (const track of this.tracksByType[mt]) {
        for (const dl of track.downloadables) {
          if (dl.location === undefined || dl.liveAdjustAudioTimestamps === undefined) {
            locationsByType[mt] = new Set(["__invalid__"]);
            break;
          }
          locationsByType[mt].add(dl.location);
          const loc = dl.location;
          const map = serversByTypeAndLocation[mt];
          (map[loc] = map[loc] || new Set()).add(dl.liveAdjustAudioTimestamps);
        }
      }
    }

    const baseType = mediaTypes[0];
    const baseLocations = Array.from(locationsByType[baseType] || []);

    for (let i = 1; i < mediaTypes.length; i++) {
      const otherLocations = Array.from(locationsByType[mediaTypes[i]] || []);
      if (np(baseLocations, otherLocations).length > 0 || np(otherLocations, baseLocations).length > 0) {
        return false;
      }
    }

    for (const loc of baseLocations) {
      const baseServers = Array.from(serversByTypeAndLocation[baseType][loc] || new Set())
        .slice()
        .sort((a, b) => a - b);

      for (let i = 1; i < mediaTypes.length; i++) {
        const otherServers = Array.from(
          serversByTypeAndLocation[mediaTypes[i]][loc] || new Set()
        )
          .slice()
          .sort((a, b) => a - b);

        if (
          baseServers.length !== otherServers.length ||
          baseServers.some((v, idx) => v !== otherServers[idx])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Build the TCP connection sharing map based on config and track availability.
   * @returns {object}
   * @private
   */
  buildConnectionSharingMap() {
    const groups = this.config.liveShareTcpConnections || [];
    const sharingMap = {};

    if (!this.isAdPlaygraph || groups.length === 0) return sharingMap;

    for (const group of groups) {
      if (this.validateConnectionSharingAvailability(group)) {
        const primary = group[0];
        for (const mt of group) {
          if (mt !== primary) sharingMap[mt] = primary;
        }
      }
    }

    return sharingMap;
  }

  /**
   * Map a media-type's stream location through the connection-sharing map.
   * @param {number} mediaType
   * @returns {number}
   */
  mapStreamLocation(mediaType) {
    const map = this.connectionSharingMap;
    return map && map[mediaType] !== undefined ? map[mediaType] : mediaType;
  }
}

export { AseViewable, MediaTypeStreamState, StreamSwitchability };
