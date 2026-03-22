/**
 * Netflix Cadmium Player - CdnReporter
 * Reports CDN (Content Delivery Network) information for telemetry events.
 * Collects streaming and presenting CDN IDs/names for audio, video, text,
 * and media events tracks. Also reports CDN download distribution data.
 *
 * @module CdnReporter
 */

// import { TimeUtil, flattenArray } from './Module_91176';
// import { MediaType, PlaybackState } from './Module_65161';
// import { BufferType } from './Module_89527';
// import { TelemetryEvent, LogEvent } from './Module_91967';

/**
 * Gathers CDN usage data and formats it for telemetry event payloads.
 */
class CdnReporter {
  /**
   * @param {Object} playgraph - The active playgraph instance.
   * @param {Object} downloadInfoMap - Map of CDN download distribution data, keyed by viewable ID.
   * @param {Object} config - Reporter configuration.
   * @param {boolean} config.cdndldistEnabled - Whether CDN download distribution is enabled.
   */
  constructor(playgraph, downloadInfoMap, config) {
    /** @type {Object} */
    this.playgraph = playgraph;

    /** @type {Object} */
    this.downloadInfoMap = downloadInfoMap;

    /** @type {Object} */
    this.config = config;

    /** @type {string} */
    this.reporterName = "CdnReporter";
  }

  /**
   * Whether this reporter is enabled.
   * @returns {boolean}
   */
  get enabled() {
    return true;
  }

  /**
   * Serialize CDN information into a telemetry event payload.
   * Populates `cdnidinfo` for streaming/presenting CDN data and
   * `cdndldist` for download distribution stats.
   *
   * @param {Object} eventContext - The telemetry event context.
   * @param {Object} eventContext.utilityInstance - The utility/log event type.
   * @param {Object} eventContext.seekHandler - The telemetry trigger event.
   * @returns {Object} Payload fields to merge into the telemetry event.
   */
  serialize(eventContext) {
    const triggerEvent = eventContext.seekHandler;
    const payload = {};

    // Include CDN ID info for relevant trigger events
    const cdnTriggerEvents = [
      TelemetryEvent.startPlay,
      TelemetryEvent.resumePlay,
      TelemetryEvent.bufferingStart,
      TelemetryEvent.bitrateChange,
      TelemetryEvent.cdnSwitch,
      TelemetryEvent.error,
    ];

    if (cdnTriggerEvents.includes(triggerEvent)) {
      const cdnInfo = this.getCurrentCdnInfo();
      if (cdnInfo) {
        payload.cdnidinfo = {
          audio: {
            streaming_cdn_id: cdnInfo.streaming_cdn_id,
            streaming_cdn_name: cdnInfo.streaming_cdn_name,
            presenting_cdn_id: cdnInfo.presenting_cdn_id,
            presenting_cdn_name: cdnInfo.presenting_cdn_name,
          },
          video: {
            streaming_cdn_id: cdnInfo.streaming_cdn_id,
            streaming_cdn_name: cdnInfo.streaming_cdn_name,
            presenting_cdn_id: cdnInfo.presenting_cdn_id,
            presenting_cdn_name: cdnInfo.presenting_cdn_name,
          },
          text: {
            streaming_cdn_id: cdnInfo.streaming_cdn_id,
            streaming_cdn_name: cdnInfo.streaming_cdn_name,
            presenting_cdn_id: cdnInfo.presenting_cdn_id,
            presenting_cdn_name: cdnInfo.presenting_cdn_name,
          },
          mediaevents: {
            streaming_cdn_id: cdnInfo.streaming_cdn_id,
            streaming_cdn_name: cdnInfo.streaming_cdn_name,
          },
        };
      }
    }

    // Include CDN download distribution on end playback
    if (this.config.cdndldistEnabled && eventContext.utilityInstance === LogEvent.endPlayback) {
      const distData = flattenArray(
        Object.keys(this.downloadInfoMap).map(viewableId => {
          const viewableData = this.downloadInfoMap[viewableId];
          return Object.keys(viewableData).map(cdnKey => {
            const entry = viewableData[cdnKey];
            return {
              cdnid: entry.cdnid,
              pbcid: entry.pbcid,
              dls: Object.keys(entry.downloads).map(dlKey => {
                const dl = entry.downloads[dlKey];
                const idKey = dl.mediaType === MediaType.VIDEO ? "adlid" : "dlid";
                return {
                  tm: dl.totalTime,
                  bitrate: dl.bitrate,
                  [idKey]: dl.downloadableStreamId,
                  vf: dl.vmaf,
                };
              }),
            };
          });
        })
      );
      payload.cdndldist = JSON.stringify(distData);
    }

    return payload;
  }

  /**
   * Get a summary of current CDN IDs for all media types.
   * Used for quick CDN identification without full serialization.
   *
   * @returns {Object|undefined} CDN summary with streaming/presenting IDs per media type.
   */
  getCdnSummary() {
    const cdnInfo = this.getCurrentCdnInfo();
    if (!cdnInfo) return undefined;

    return {
      cdnIds: {
        audio: {
          streamingCdnId: cdnInfo.streaming_cdn_id,
          presentingCdnId: cdnInfo.presenting_cdn_id,
        },
        video: {
          streamingCdnId: cdnInfo.streaming_cdn_id,
          presentingCdnId: cdnInfo.presenting_cdn_id,
        },
        text: {
          streamingCdnId: cdnInfo.streaming_cdn_id,
          presentingCdnId: cdnInfo.presenting_cdn_id,
        },
        mediaEvents: {
          streamingCdnId: cdnInfo.streaming_cdn_id,
        },
      },
    };
  }

  /**
   * Collect current CDN information from the active player's media tracks.
   * Resolves streaming and presenting CDN IDs and names for audio, video,
   * text, and media events.
   *
   * @private
   * @returns {Object|undefined} CDN info object, or undefined if playback hasn't started.
   */
  getCurrentCdnInfo() {
    const player = this.playgraph.player;
    if (!player.isPlaybackStarted) return undefined;

    const activeSegment = player.activeSegment;
    const viewableSession = activeSegment.viewableSession;
    const cdnProvider = viewableSession.cdnProvider;

    // Get streaming CDN IDs from track element lists
    const audioStreamingCdnId = player.getMediaTypeInfo(MediaType.AUDIO)
      ?.elementList?.activeCdnId;
    const videoStreamingCdnId = player.getMediaTypeInfo(MediaType.VIDEO)
      ?.elementList?.activeCdnId;
    const textStreamingCdnId = player.getMediaTypeInfo(MediaType.TEXT_MEDIA_TYPE)
      ?.elementList?.activeCdnId;
    const mediaEventsStreamingCdnId = viewableSession.mediaEventsStore
      ?.mediaEventsTransport?.cdnId;

    // Get presenting CDN IDs from buffer state
    const audioPresentingCdnId = player.mediaTypeBufferMap.key(MediaType.AUDIO)
      ?.getBuffer(BufferType.PRESENTING)?.getLatestEntry()?.cdnId;
    const videoPresentingCdnId = player.mediaTypeBufferMap.key(MediaType.VIDEO)
      ?.getBuffer(BufferType.PRESENTING)?.getLatestEntry()?.cdnId;
    const textPresentingCdnId = player.mediaTypeBufferMap.key(MediaType.TEXT_MEDIA_TYPE)
      ?.getBuffer(BufferType.PRESENTING)?.getLatestEntry()?.cdnId;

    return {
      audioStreamingCdnId,
      streaming_cdn_name: audioStreamingCdnId ? cdnProvider?.getCdn(audioStreamingCdnId)?.name : undefined,
      presenting_cdn_id: audioPresentingCdnId,
      presenting_cdn_name: audioPresentingCdnId ? cdnProvider?.getCdn(audioPresentingCdnId)?.name : undefined,
      streaming_cdn_id: videoStreamingCdnId,
      streaming_cdn_name: videoStreamingCdnId ? cdnProvider?.getCdn(videoStreamingCdnId)?.name : undefined,
      presenting_cdn_id: videoPresentingCdnId,
      presenting_cdn_name: videoPresentingCdnId ? cdnProvider?.getCdn(videoPresentingCdnId)?.name : undefined,
      textStreamingCdnId,
      textStreamingCdnName: textStreamingCdnId ? cdnProvider?.getCdn(textStreamingCdnId)?.name : undefined,
      textPresentingCdnId,
      textPresentingCdnName: textPresentingCdnId ? cdnProvider?.getCdn(textPresentingCdnId)?.name : undefined,
      mediaEventsStreamingCdnId,
      mediaEventsStreamingCdnName: mediaEventsStreamingCdnId ? cdnProvider?.getCdn(mediaEventsStreamingCdnId)?.name : undefined,
    };
  }
}

export { CdnReporter };
