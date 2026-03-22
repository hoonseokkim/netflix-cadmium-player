/**
 * Netflix Cadmium Player - DownloadTrackPool
 * Component: ASEJS_DOWNLOAD_TRACK_POOL
 *
 * Manages a pool of download tracks (HTTP connections) used to fetch
 * audio, video, text, and header segments from Netflix CDNs.
 *
 * Download tracks are the low-level transport abstractions that handle
 * HTTP connections, pipelining, and open-range requests. This pool
 * enables sharing tracks across multiple consumers (branches) to
 * reduce connection overhead, and configures each track based on
 * media type and platform capabilities.
 *
 * Key concepts:
 * - Track sharing: Multiple branches downloading the same media type
 *   can share a single HTTP connection/track.
 * - Pipelining: Multiple HTTP requests sent over one connection without
 *   waiting for responses (HTTP/1.1 pipelining or HTTP/2 multiplexing).
 * - Open-range requests: Streaming downloads using HTTP Range headers
 *   without a known end byte.
 */

// Dependencies
// import { __importDefault, __assign } from './modules/Module_22970.js';
// import { platform } from './modules/Module_66164.js';
// import DefaultTransport from './modules/Module_14282.js';
// import { MediaType } from './modules/Module_65161.js';
// import { DownloadTrackHandle } from './modules/Module_91772.js';

/**
 * @class DownloadTrackPool
 * @description Singleton pool that creates and manages download tracks for
 *   all media types. Handles track lifecycle, sharing, pipelining configuration,
 *   and transport event forwarding.
 */
class DownloadTrackPool {
  /**
   * @param {Function} transportFactory - Factory/constructor for creating transport
   *   instances. Also provides media type constants (VIDEO, AUDIO, TEXT_MEDIA_TYPE)
   *   and a clearTimeout utility.
   */
  constructor(transportFactory) {
    /** @type {Function} Transport factory for creating download tracks */
    this.transportFactory = transportFactory;

    /** @type {Array<PoolEntry>} Active pool entries, each wrapping a track */
    this.tracks = [];

    // ======== MODULE: ASEJS_DOWNLOAD_TRACK_POOL ========
    /** @type {Console} Scoped console logger */
    this.console = new platform.Console('ASEJS_DOWNLOAD_TRACK_POOL', 'asejs');
  }

  /**
   * Returns the singleton instance, creating it if necessary.
   * @returns {DownloadTrackPool}
   */
  static get instance() {
    if (DownloadTrackPool._singletonInstance === undefined) {
      DownloadTrackPool._singletonInstance = new DownloadTrackPool(platform.clearTimeout);
    }
    return DownloadTrackPool._singletonInstance;
  }

  /**
   * Resets the singleton instance (used during session teardown).
   */
  static create() {
    DownloadTrackPool._singletonInstance = undefined;
  }

  /**
   * Acquires a download track handle from the pool. If track sharing is enabled
   * and a compatible track already exists, it will be reused. Otherwise a new
   * track is created.
   *
   * @param {boolean} hasManifest - Whether the caller has a manifest (determines
   *   track configuration like open-range vs pipelined).
   * @param {string} branchKey - Branch identifier for matching shared tracks.
   * @param {string} mediaType - One of MediaType.VIDEO, MediaType.AUDIO,
   *   MediaType.TEXT_MEDIA_TYPE, or header type.
   * @param {Object} streamingSession - The streaming session context.
   * @param {boolean} isBranched - Whether this is for a branched/interactive segment.
   * @param {Object} config - Player configuration with pipeline, socket, and
   *   connection settings.
   * @returns {DownloadTrackHandle} A handle wrapping the underlying track,
   *   which can be used to issue download requests.
   */
  acquireTrack(hasManifest, branchKey, mediaType, streamingSession, isBranched, config) {
    let existingIndex = config.shareDownloadTracks
      ? this.findSharedTrack(mediaType, branchKey, hasManifest, config.shareOpenRangeTracks)
      : -1;

    /** @type {PoolEntry} */
    let poolEntry;
    let isShared;

    if (existingIndex === -1) {
      poolEntry = {
        track: this.createTrack(mediaType, streamingSession, hasManifest, isBranched, config),
        hasManifest: mediaType,
        branchKey: branchKey,
        mediaType: hasManifest,
        handles: [],
        isNoneTrack: false,
        destroyed: false,
      };
      this.tracks.push(poolEntry);
      this.listenForNoneTrack(poolEntry);
      isShared = false;
    } else {
      isShared = true;
      poolEntry = this.tracks[existingIndex];
    }

    const handle = new DownloadTrackHandle(this.console, poolEntry.track, poolEntry.isNoneTrack, isShared);
    poolEntry.handles.push(handle);
    return handle;
  }

  /**
   * Sets up a listener that marks the pool entry as a "none track" once
   * the underlying track fires a "created" event (meaning it was initialized
   * but not yet used for actual media).
   *
   * @private
   * @param {PoolEntry} poolEntry - The pool entry to monitor.
   */
  listenForNoneTrack(poolEntry) {
    function onCreated() {
      poolEntry.isNoneTrack = true;
      poolEntry.track.removeListener('created', onCreated);
    }
    poolEntry.track.on('created', onCreated);
  }

  /**
   * Releases a download track handle back to the pool. If this was the last
   * handle using the underlying track, the track is fully cleaned up.
   *
   * @param {DownloadTrackHandle} handle - The handle to release.
   */
  releaseTrack(handle) {
    handle.clearListeners();

    const poolIndex = this.findTrackIndex((entry) => entry.track === handle.track);

    if (poolIndex !== -1) {
      const poolEntry = this.tracks[poolIndex];
      if (poolEntry.handles.length === 1) {
        // Last handle — destroy the track
        poolEntry.track.clearListeners();
        poolEntry.destroyed = true;
      } else {
        // Remove just this handle
        const handleIndex = poolEntry.handles.indexOf(handle);
        if (handleIndex >= 0) {
          poolEntry.handles.splice(handleIndex, 1);
        }
      }
    } else {
      // Track not found in pool — clean up directly
      handle.track.clearListeners();
    }
  }

  /**
   * Executes the transport factory's execute method (e.g., for flushing
   * pending operations).
   */
  execute() {
    this.transportFactory.execute();
  }

  /**
   * Creates a new download track with appropriate transport configuration
   * based on media type, platform capabilities, and player config.
   *
   * @private
   * @param {string} mediaType - The media type (VIDEO, AUDIO, TEXT, or header).
   * @param {Object} streamingSession - Session context for the track.
   * @param {boolean} hasManifest - Whether a manifest is available.
   * @param {boolean} isBranched - Whether this is branched content.
   * @param {Object} config - Player configuration.
   * @returns {Object} The created download track instance.
   */
  createTrack(mediaType, streamingSession, hasManifest, isBranched, config) {
    const self = this;
    let usePipelineForAudio = false;
    let usePipelineForText = false;
    let usePipelineForVideo = false;
    const isLive = streamingSession.isLive;

    /** @type {Object} Transport configuration */
    let transportConfig;

    if (hasManifest) {
      if (mediaType === MediaType.VIDEO) {
        // Video track configuration
        let connectionCount = 1;
        if (config.pipelineEnabled) {
          usePipelineForVideo = true;
          connectionCount = config.maxParallelConnections;
        } else if (config.maxActiveRequestsPerSession && config.maxActiveRequestsPerSession > 2) {
          usePipelineForVideo = true;
          connectionCount = config.maxActiveRequestsPerSession;
        }
        transportConfig = {
          type: this.transportFactory.VIDEO,
          openRange: isLive ? false : !usePipelineForVideo,
          pipeline: usePipelineForVideo,
          connections: connectionCount,
          socketBufferSize: config.videoSocketReceiveBufferSize,
          minRequestSize: config.minRequestSize,
        };
      } else if (mediaType === MediaType.AUDIO) {
        // Audio track configuration
        usePipelineForAudio =
          config.pipelineEnabled && (config.usePipelineForAudio || (isBranched && config.usePipelineForBranchedAudio));
        transportConfig = {
          type: this.transportFactory.AUDIO,
          openRange: isLive ? false : !usePipelineForAudio,
          pipeline: usePipelineForAudio,
          connections: 1,
          socketBufferSize: config.audioSocketReceiveBufferSize,
          minRequestSize: config.minRequestSize,
        };
      } else if (mediaType === MediaType.TEXT_MEDIA_TYPE) {
        // Text/subtitle track configuration
        usePipelineForText = isLive ? false : !config.usePipelineForText;
        transportConfig = {
          type: this.transportFactory.TEXT_MEDIA_TYPE,
          openRange: usePipelineForText,
          pipeline: config.pipelineEnabled,
          connections: 1,
          socketBufferSize: config.textSocketReceiveBufferSize,
          minRequestSize: config.minRequestSize,
        };
      } else {
        // Header track configuration
        transportConfig = {
          type: config.disableHeaderDownloadTracks
            ? this.transportFactory.VIDEO
            : this.transportFactory.HEADER,
          openRange: false,
          pipeline: true,
          connections: 1,
          socketBufferSize: config.headersSocketReceiveBufferSize,
          minRequestSize: config.minRequestSize,
        };
      }
    } else {
      // No manifest — fallback configuration
      transportConfig = {
        type: mediaType === MediaType.AUDIO ? DefaultTransport.types.AUDIO : DefaultTransport.types.VIDEO,
        openRange: false,
        pipeline: false,
        connections: 1,
        socketBufferSize:
          mediaType === MediaType.AUDIO ? config.audioSocketReceiveBufferSize : config.videoSocketReceiveBufferSize,
        minRequestSize: config.minRequestSize,
      };
    }

    const track = new this.transportFactory(transportConfig, streamingSession);
    track.pipelineEnabled = usePipelineForVideo;

    // Forward transport report events to the first handle
    track.on('transportreport', (report) => {
      const idx = self.findTrackIndex((entry) => entry.track === track);
      if (idx !== -1) {
        const entry = self.tracks[idx];
        if (entry.handles.length) {
          entry.handles[0].emit('transportreport', report);
        }
      }
    });

    // Forward media request complete events
    track.on('mediaRequestComplete', (report) => {
      const idx = self.findTrackIndex((entry) => entry.track === track);
      if (idx !== -1) {
        const entry = self.tracks[idx];
        if (entry.handles.length) {
          entry.handles[0].emit('mediaRequestComplete', report);
        }
      }
    });

    // Clean up pool entry when track is destroyed
    track.on('destroyed', () => {
      const idx = self.findTrackIndex((entry) => entry.track === track);
      if (idx !== -1) {
        self.tracks.splice(idx, 1);
      }
      track.removeAllListeners();
    });

    // Handle pipeline disabled event — fall back to simpler config
    track.on('pipelinedisabled', () => {
      track.pipelineEnabled = false;
      if (isLive) {
        track.reconfigure({
          ...track.config,
          pipeline: false,
          openRange: false,
          connections: 1,
        });
      } else if (
        (usePipelineForAudio && config.usePipelineDetectionForAudio) ||
        config.usePipelineDetectionForVideo
      ) {
        if (config.usePipelineDetectionForVideo && track.config.type === MediaType.VIDEO) {
          track.reconfigure({
            ...track.config,
            socketBufferSize: config.minVideoSocketReceiveBufferSize,
            pipeline: false,
            openRange: true,
            connections: 1,
          });
        } else {
          track.reconfigure({
            ...track.config,
            pipeline: false,
            openRange: true,
          });
        }
      }
    });

    return track;
  }

  /**
   * Searches the pool for an existing track that can be shared with a new consumer.
   * Matching is based on media type, branch key, and open-range compatibility.
   *
   * @private
   * @param {boolean} hasManifest - Whether caller has a manifest.
   * @param {string} branchKey - The branch key to match.
   * @param {string} mediaType - The media type to match.
   * @param {boolean} shareOpenRangeTracks - Whether to share open-range tracks.
   * @returns {number} Index of the matching pool entry, or -1 if none found.
   */
  findSharedTrack(hasManifest, branchKey, mediaType, shareOpenRangeTracks) {
    return this.findTrackIndex((entry) => {
      if (entry.destroyed) return false;
      if (!shareOpenRangeTracks && entry.track.config.isOpenRange) {
        return !entry.hasManifest && entry.mediaType === mediaType;
      }
      return entry.hasManifest && entry.branchKey === branchKey && entry.mediaType === mediaType;
    });
  }

  /**
   * Finds the index of the first pool entry matching the predicate.
   *
   * @private
   * @param {Function} predicate - Test function receiving a pool entry.
   * @returns {number} Index of match, or -1 if not found.
   */
  findTrackIndex(predicate) {
    for (let i = 0; i < this.tracks.length; ++i) {
      if (predicate(this.tracks[i])) {
        return i;
      }
    }
    return -1;
  }
}

/**
 * @typedef {Object} PoolEntry
 * @property {Object} track - The underlying download track instance.
 * @property {boolean} hasManifest - Whether the track was created with a manifest.
 * @property {string} branchKey - Branch identifier for sharing.
 * @property {string} mediaType - The media type this track handles.
 * @property {DownloadTrackHandle[]} handles - Active handles referencing this track.
 * @property {boolean} isNoneTrack - Whether this track was marked as a "none" track.
 * @property {boolean} destroyed - Whether this track has been destroyed.
 */

export { DownloadTrackPool };
