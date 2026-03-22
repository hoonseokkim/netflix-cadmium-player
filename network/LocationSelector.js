/**
 * Netflix Cadmium Player — CDN Location Selector
 *
 * Selects the optimal CDN location and server for each stream based on
 * throughput estimates, network-failure status, and location ranking from
 * the manifest. Extends EventEmitter to signal "networkFailed" and
 * "issueServerProbeRequest" events to the error-recovery pipeline.
 *
 * Key responsibilities:
 *  - Maintaining a ranked, filtered list of candidate locations.
 *  - Checking each stream's availability against the current OcNetwork graph.
 *  - Detecting location / server failover and logging selection reasons.
 *  - Driving probe-based switchback to a previously failed primary server.
 *  - Gating location switches for live DVR playback.
 *
 * @module LocationSelector
 * @extends EventEmitter
 */

// --- external dependency stubs ---
// import * as helpers       from '../modules/Module_22970.js';
// import * as util          from '../modules/Module_17267.js';
// import { EventEmitter }   from '../modules/Module_90745.js';
// import { platform }       from '../modules/Module_66164.js';
// import { Deferred, qB }   from '../modules/Module_91176.js';
// import { laser, mediaTypeToString } from '../classes/DISABLED.js';
// import { dk as isTimedText }        from '../modules/Module_8149.js';
// import NodeType           from '../modules/Module_14282.js';
// import { assert }         from '../modules/Module_52571.js';
// import { statusEnum, MJa as LocationState } from '../modules/Module_36670.js';
// import { nK as OcNetwork } from './OcNetwork.js';

const logger = new platform.Console('ASEJS_LOCATION_SELECTOR', 'media|asejs');

/**
 * Selects CDN locations and servers for each playback stream.
 *
 * @extends EventEmitter
 */
class LocationSelector extends EventEmitter {
  /**
   * @param {Object} manifest          - Initial parsed manifest.
   * @param {Array}  streamFilter      - Optional stream-ID filter sets.
   * @param {Object} networkMonitor    - Live throughput / confidence provider.
   * @param {Object} throughputMonitor - Per-location throughput monitor.
   * @param {Object} config            - Player configuration.
   * @param {Function} logDataCallback - Callback to emit structured log data.
   */
  constructor(manifest, streamFilter, networkMonitor, throughputMonitor, config, logDataCallback) {
    super();

    this.networkMonitor = networkMonitor;
    this.throughputMonitor = throughputMonitor;
    this.config = config;
    this.logDataCallback = logDataCallback;

    /** @type {string} Identifier for live playback mode. */
    this.livePlaybackMode = 'LIVE';

    /** @type {number} Current location-state (STARTUP, PLAYING, REBUFFER). */
    this.currentLocationState = LocationState.STARTUP;

    /** @type {number|null} Timestamp of the last manifest update. */
    this.lastManifestUpdateTime = null;

    /** @type {Object[]|null} Cached list of candidate locations for the current evaluation. */
    this.selectedLocations = null;

    /** @type {number} Reason code for the most recent location selection. */
    this.lastSelectionReason = NodeType.default.aA.STARTUP;

    /** @type {boolean} Whether the stream is live. */
    this.isLive = qB(manifest.manifestType);

    /** @type {OcNetwork} Underlying CDN topology graph. */
    this.locationHandler = new OcNetwork(throughputMonitor, this.isLive);

    this.updateManifestMetadata(manifest, streamFilter, NodeType.default.aA.STARTUP);

    /** @type {boolean} Whether a "networkFailed" event has been emitted. */
    this.networkFailedReported = false;

    /** @type {Object<string, Object>} Tracks probe-switchback attempt state per server. */
    this.selectionAttempts = {};
  }

  /* ------------------------------------------------------------------ */
  /*  Delegation to OcNetwork                                            */
  /* ------------------------------------------------------------------ */

  /** @returns {Object[]} Top-level location nodes. */
  getLocations() {
    return this.locationHandler.getLocations();
  }

  /**
   * Returns the location ID for a given URL.
   * @param {string} url
   * @returns {string|undefined}
   */
  getLocationForUrl(url) {
    return this.locationHandler.getLocationForUrl(url);
  }

  /**
   * Returns the server node for a given server ID.
   * @param {string} serverId
   * @returns {Object|undefined}
   */
  getServer(serverId) {
    return this.locationHandler.getServer(serverId);
  }

  /**
   * Returns all server nodes hosting a given stream.
   * @param {Object} stream
   * @returns {Object[]}
   */
  getServersForStream(stream) {
    return this.locationHandler.getServersForStream(stream);
  }

  /**
   * Returns the internal stream descriptor for a source-stream.
   * @param {Object} sourceStream
   * @returns {Object|undefined}
   */
  findStreamBySource(sourceStream) {
    return this.locationHandler.findStreamBySource(sourceStream);
  }

  /**
   * Builds a probe URL for the given byte-range hint and download URL.
   *
   * @param {Object} byteRangeHint - Byte-range metadata.
   * @param {Object} sourceStream  - Source stream descriptor.
   * @returns {string}
   */
  buildProbeUrl(byteRangeHint, sourceStream) {
    if (!sourceStream || !byteRangeHint) return '';
    if (!isTimedText(sourceStream) || (isTimedText(sourceStream) && sourceStream.track?.qFb)) {
      return sourceStream.I0?.(undefined, byteRangeHint) ?? '';
    }
    return '';
  }

  /* ------------------------------------------------------------------ */
  /*  Manifest update                                                    */
  /* ------------------------------------------------------------------ */

  /**
   * Updates the CDN graph from a new or refreshed manifest.
   *
   * @param {Object} manifest         - Parsed manifest.
   * @param {Array}  [streamFilter]   - Optional stream-ID filter sets.
   * @param {number} [updateMode]     - Reason for the update.
   */
  updateManifestMetadata(manifest, streamFilter, updateMode) {
    if (updateMode === undefined) updateMode = NodeType.default.aA.fgb;

    this.locationHandler.updateManifestMetadata(manifest, streamFilter, updateMode);
    this.lastManifestUpdateTime = platform.platform.now();

    const manifestType = manifest.manifestType;
    const liveMetadata = manifest.liveMetadata;

    assert(
      (this.isLive && qB(manifestType) && !!liveMetadata) ||
      (!this.isLive && !qB(manifestType) && !liveMetadata),
    );

    if (this.isLive) {
      this.liveStartTimestamp = liveMetadata.KLc;
    }

    this.selectedLocations = null;
    this.lastSelectionReason = updateMode;
  }

  /* ------------------------------------------------------------------ */
  /*  Location selection                                                 */
  /* ------------------------------------------------------------------ */

  /**
   * Evaluates all candidate locations and filters streams based on CDN
   * health, network confidence, and live-capability constraints.
   *
   * @param {Object}   requestContext    - Download request context.
   * @param {Object[]} streams           - Stream descriptors to evaluate.
   * @param {string}   [playbackMode]    - Current playback mode (live / DVR).
   * @param {Object}   [currentStream]   - The stream currently being played.
   * @returns {boolean} True if at least one playable stream was found.
   */
  selectLocation(requestContext, streams, playbackMode, currentStream) {
    const config = this.config;
    const didDvrSwitch = this._checkDvrSwitch(playbackMode, config);

    platform.SD?.(requestContext);

    if (this.locationHandler.isFailed()) return false;

    let playableCount = 0;
    const minimumConfidence = this._updateMinimumNetworkConfidence(config);

    if (util.isEmpty(this.selectedLocations)) {
      this.selectedLocations = this._getDefaultLocations();
    }

    if (!this.selectedLocations) {
      this.reportEngineError(NodeType.default.xk.iK, false);
      return false;
    }

    const candidateLocations = this.selectedLocations;
    if (!candidateLocations.length) {
      this.reportEngineError(NodeType.default.xk.iK, false);
      return false;
    }

    streams.forEach((stream, index) => {
      const streamId = stream.id;

      if (this._checkStreamCandidate(candidateLocations, stream, config, didDvrSwitch, playbackMode, minimumConfidence)) {
        stream.isFiltered = false;
        stream.failureStatus = undefined;
        if (stream.isPlayable) ++playableCount;
      } else if (stream.failureStatus === statusEnum.TEMPORARY) {
        this.locationHandler.networkStatus = statusEnum.TEMPORARY;
      } else if (!stream.isFiltered) {
        logger.RETRY(`Failing stream [${index}] ${streamId} (${stream.bitrate} Kbps)`);
        stream.markUnavailable();
        stream.isFiltered = true;
        if (currentStream && stream.selectedStreamId === currentStream.selectedStreamId) {
          this.locationHandler.networkStatus = stream.failureStatus ?? statusEnum.rq;
        }
      }
    });

    if (this.locationHandler.isFailed()) {
      logger.RETRY('Network has failed, not updating stream selection');
      this.networkFailedReported = true;
      this.emit('networkFailed', {
        lua: this.locationHandler.networkStatus === statusEnum.PERMANENT,
      });
      return false;
    }

    if (playableCount === 0) {
      logger.RETRY(`Did not find a URL for ANY stream...${streams.length ? '' : '(empty stream list)'}`);
      this.reportEngineError(NodeType.default.xk.iK, true);
      return false;
    }

    return true;
  }

  /**
   * Checks whether a specific stream has an available (non-failed) URL
   * in any of the candidate locations.
   *
   * @param {Object[]} candidateLocations
   * @param {Object}   stream
   * @param {Object}   config
   * @param {boolean}  didDvrSwitch
   * @param {string}   playbackMode
   * @param {number}   minimumConfidence
   * @returns {boolean}
   * @private
   */
  _checkStreamCandidate(candidateLocations, stream, config, didDvrSwitch, playbackMode, minimumConfidence) {
    const streamId = stream.id;
    const throughputSnapshot = this.networkMonitor.getThroughputSnapshot();

    return candidateLocations.some((location) => {
      const locationStream = location.streamMap[streamId];
      if (!locationStream) return false;

      const primaryLocation = locationStream.locations[0];
      if (stream.primaryLocation === undefined) {
        stream.primaryLocation = primaryLocation.id;
        stream.primaryServer = locationStream.locationUrlMap[primaryLocation.id][0].server.id;
      }

      return locationStream.locationUrlMap[location.id].some((urlNode) => {
        const isAvailable = this._isUrlAvailable(urlNode, stream, config.probeServerWhenError, didDvrSwitch, playbackMode);
        if (!isAvailable) return false;

        this._updateStreamSelection(urlNode, location, candidateLocations, stream, locationStream, config.probeServerWhenError, didDvrSwitch, playbackMode);
        this._updateThroughputEstimate(config, throughputSnapshot, location, stream, minimumConfidence);
        return true;
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Network confidence                                                 */
  /* ------------------------------------------------------------------ */

  /**
   * Determines the minimum confidence level required for location
   * selection, and optionally pushes the current throughput snapshot
   * into the matching location node.
   *
   * @param {Object} config
   * @returns {number} Required minimum confidence level.
   * @private
   */
  _updateMinimumNetworkConfidence(config) {
    const snapshot = this.networkMonitor.getThroughputSnapshot();
    let requiredConfidence = NodeType.default.viewRange.HAVE_SOMETHING;

    if (config.needMinimumNetworkConfidence) {
      requiredConfidence = NodeType.default.viewRange.HAVE_MINIMUM;
    }

    if (this.networkMonitor.location && snapshot.confidence >= requiredConfidence) {
      const locationNode = this.locationHandler.locations[this.networkMonitor.location];
      if (locationNode) locationNode.throughputEstimate = snapshot;
    }

    return requiredConfidence;
  }

  /* ------------------------------------------------------------------ */
  /*  DVR / live mode                                                     */
  /* ------------------------------------------------------------------ */

  /**
   * Checks whether the playback mode has switched (e.g. live -> DVR) and
   * invalidates the cached location selection if so.
   *
   * @param {string} playbackMode
   * @param {Object} config
   * @returns {boolean} Whether a DVR switch occurred.
   * @private
   */
  _checkDvrSwitch(playbackMode, config) {
    let switched = false;

    if (
      this.isLive &&
      playbackMode !== undefined &&
      playbackMode !== this.livePlaybackMode &&
      (this.lastDvrSwitchTime === undefined ||
        platform.platform.now() - this.lastDvrSwitchTime > config.liveDvrSwitchThresholdms)
    ) {
      this.livePlaybackMode = playbackMode;
      this.lastDvrSwitchTime = platform.platform.now();
      switched = true;
    }

    if (switched) this.selectedLocations = null;
    return switched;
  }

  /* ------------------------------------------------------------------ */
  /*  URL / server availability                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Tests whether a single URL node is available for selection.
   *
   * @param {Object}  urlNode
   * @param {Object}  stream
   * @param {boolean} probeOnError
   * @param {boolean} didDvrSwitch
   * @param {string}  playbackMode
   * @returns {boolean}
   * @private
   */
  _isUrlAvailable(urlNode, stream, probeOnError, didDvrSwitch, playbackMode) {
    // Server is failed
    if (this.locationHandler.isNodeFailed(urlNode.server)) {
      stream.failureStatus = urlNode.server.status;
      if (probeOnError && stream.server === urlNode.server.id && urlNode.server.probeInfo) {
        stream.probeInfo = urlNode.server.probeInfo;
      }
      return false;
    }

    // URL itself is failed
    if (this.locationHandler.isNodeFailed(urlNode)) {
      stream.failureStatus = urlNode.status;
      return false;
    }

    // Live capability check
    if (didDvrSwitch && urlNode.liveCapabilities) {
      if (!urlNode.liveCapabilities.some((cap) => cap === playbackMode)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Updates stream metadata with the selected URL / location / server.
   *
   * @param {Object}   urlNode
   * @param {Object}   location
   * @param {Object[]} allLocations
   * @param {Object}   stream
   * @param {Object}   locationStream
   * @param {boolean}  probeOnError
   * @param {boolean}  didDvrSwitch
   * @param {string}   playbackMode
   * @private
   */
  _updateStreamSelection(urlNode, location, allLocations, stream, locationStream, probeOnError, didDvrSwitch, playbackMode) {
    let selectionReason = 'unknown';
    const primaryLocation = locationStream.locations[0];

    // If switching away from primary location, issue a probe request
    if (primaryLocation.id !== location.id) {
      this._issueProbeIfNeeded(locationStream);
    }

    if (stream.location !== location.id) {
      if (probeOnError) {
        stream.isPrimaryLocation = location.id === primaryLocation.id;
      } else if (location !== allLocations[0] && didDvrSwitch && locationStream.liveMode !== playbackMode) {
        selectionReason = `${NodeType.default.aA.v6b}`;
      } else if (location !== allLocations[0]) {
        selectionReason = `${NodeType.default.aA.WCa}`;
      } else if (stream.location === undefined) {
        selectionReason = `${NodeType.default.aA.STARTUP}`;
      } else if (!util.isUndefined(stream.previousLocation) && stream.previousLocation !== location.id) {
        selectionReason = 'locationfailover';
      } else if (!util.isUndefined(stream.previousServer) && stream.previousServer !== urlNode.server.id) {
        selectionReason = 'serverfailover';
      } else {
        selectionReason = 'performance';
      }

      stream.location = location.id;
      stream.locationLevel = location.level;
      stream.selectionReason = selectionReason;

      if (laser.isEnabled) {
        laser.log({
          playgraphId: stream.playgraphId,
          type: 'LOCATION_SELECTION',
          serverName: urlNode.server.name,
          serverId: urlNode.server.id.toString(),
          serverType: urlNode.server.type,
          locationId: location.id,
          locationRank: location.rank,
          locationWeight: location.weight,
          mediaType: mediaTypeToString(urlNode.stream.sourceStream?.mediaType ?? 0),
          reason: selectionReason,
        });
      }
    }

    stream.url = urlNode.url;
    stream.server = urlNode.server.id;
    stream.serverName = urlNode.server.name;
    stream.cdnType = urlNode.server.type;

    if (didDvrSwitch) locationStream.liveMode = playbackMode;
  }

  /**
   * Updates the throughput estimate used for a stream, biasing toward
   * historical data or live measurements as configured.
   *
   * @param {Object} config
   * @param {Object} snapshot
   * @param {Object} location
   * @param {Object} stream
   * @param {number} minimumConfidence
   * @private
   */
  _updateThroughputEstimate(config, snapshot, location, stream, minimumConfidence) {
    if (config.biasTowardHistoricalThroughput) {
      stream.throughputEstimate =
        location.throughputEstimate.confidence >= NodeType.default.viewRange.HAVE_MINIMUM ||
        snapshot.confidence < minimumConfidence
          ? location.throughputEstimate
          : snapshot;
    } else {
      stream.throughputEstimate =
        snapshot.confidence === NodeType.default.viewRange.HAVE_NOTHING ||
        location.throughputEstimate.confidence >= NodeType.default.viewRange.HAVE_MINIMUM
          ? location.throughputEstimate
          : snapshot;
    }

    if (config.enableInitialThroughputHistory && !stream.throughputEstimate.throughputLocationHistory) {
      stream.throughputEstimate.throughputLocationHistory = location.throughputEstimate.throughputLocationHistory;
    }
  }

  /**
   * Emits a "issueServerProbeRequest" event if the primary server is
   * failed and the switchback interval has elapsed.
   *
   * @param {Object} locationStream - Stream scoped to a location.
   * @private
   */
  _issueProbeIfNeeded(locationStream) {
    const now = platform.platform.now();
    const config = this.config;
    const primaryServer = locationStream.urls[0].server;
    const serverId = primaryServer.id;
    const attempt = this.selectionAttempts[serverId];

    if (!this.locationHandler.isNodeFailed(primaryServer)) return;

    if (attempt) {
      if (
        config.probeBeforeSwitchingBackToPrimary &&
        now > attempt.nextProbeTime
      ) {
        const newInterval = Math.min(2 * attempt.probeInterval, config.maxIntervalForSwitchingBackToPrimary);
        this.selectionAttempts[serverId] = {
          firstAttemptTime: attempt.firstAttemptTime,
          probeInterval: newInterval,
          nextProbeTime: now + newInterval,
        };
        this.emit('issueServerProbeRequest', {
          Hb: primaryServer,
          url: this.locationHandler.findUrlForServer(locationStream, serverId),
          stream: locationStream,
        });
      }
    } else {
      this.selectionAttempts[serverId] = {
        firstAttemptTime: now,
        probeInterval: config.minIntervalForSwitchingBackToPrimary,
        nextProbeTime: now + config.minIntervalForSwitchingBackToPrimary,
      };
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Default location resolution                                        */
  /* ------------------------------------------------------------------ */

  /**
   * Builds and sorts the default list of candidate locations by filtering
   * out failed locations and optionally refreshing throughput estimates.
   *
   * @returns {Object[]|null} Sorted candidate locations, or null if none available.
   * @private
   */
  _getDefaultLocations() {
    const config = this.config;
    const now = platform.platform.now();

    const candidates = this.locationHandler.getLocations().filter((loc) => {
      return !this.locationHandler.isNodeFailed(loc) && loc.level !== 0;
    });

    if (candidates.length === 0) return null;

    // Refresh per-location throughput estimates if the update interval has elapsed
    if (
      this.lastManifestUpdateTime === null ||
      this.lastManifestUpdateTime + config.locationStatisticsUpdateInterval < now
    ) {
      candidates.forEach((loc) => {
        if (loc.id !== this.networkMonitor.location) {
          loc.throughputEstimate = this.throughputMonitor.key(loc.id);
        }
      });
      this.lastManifestUpdateTime = now;
    }

    candidates.sort((a, b) => a.level - b.level || a.rank - b.rank);
    return candidates;
  }

  /* ------------------------------------------------------------------ */
  /*  Host / port URL matching                                           */
  /* ------------------------------------------------------------------ */

  /**
   * Finds all URL nodes whose host and port match the given values.
   *
   * @param {string} host - Hostname to match.
   * @param {string|number} port - Port to match.
   * @returns {{url: Object, server: Object}[]}
   */
  findUrlsByHostPort(host, port) {
    const results = [];
    const urlPattern = /^http(s?):\/\/([^\/:]+):?([0-9]*)/;

    util.forEach(this.locationHandler.urls, (urlNode, urlString) => {
      const server = urlNode.server;
      const match = urlString.match(urlPattern);
      if (!match || match.length !== 4) return;

      const isSecure = match[1] === 's';
      const matchedHost = match[2];
      let matchedPort = match[3];

      if (!matchedPort.length) {
        matchedPort = isSecure ? '443' : '80';
      }

      if (util.arrayCheck(matchedHost) && util.arrayCheck(match) && matchedHost === host && matchedPort == port) {
        let matchingUrlNode;
        server.urls.some((candidate) => {
          if (candidate.url === urlString) {
            matchingUrlNode = candidate;
            return true;
          }
          return false;
        });

        if (matchingUrlNode) {
          results.push({ url: matchingUrlNode, server });
        }
      }
    });

    return results;
  }

  /* ------------------------------------------------------------------ */
  /*  Failure reporting                                                  */
  /* ------------------------------------------------------------------ */

  /**
   * Reports a failure at a specific level of the network graph and
   * propagates status changes upward.
   *
   * @param {number}  nodeType       - NodeType level (URL, SERVER, LOCATION, NETWORK).
   * @param {boolean} isPermanent    - Whether the failure is permanent.
   * @param {string}  [url]          - The failing URL string (if applicable).
   * @param {Object}  [probeInfo]    - Probe metadata to attach to the failed node.
   */
  reportEngineError(nodeType, isPermanent, url, probeInfo) {
    let node = nodeType !== NodeType.default.xk.iK && url
      ? this.locationHandler.urls[url]
      : this.locationHandler.rootNode;

    const previousStatus = this.locationHandler.networkStatus;
    const targetStatus = isPermanent ? statusEnum.PERMANENT : statusEnum.TEMPORARY;

    // Walk up to the correct graph level
    while (node?.parent && node.directionEnum !== nodeType) {
      node = node.parent;
    }

    if (!node) {
      logger.RETRY(`Unable to find failure entity for URL ${url}`);
      return;
    }

    const oldStatus = node.status;
    if (oldStatus === targetStatus) return;

    logger.RETRY(
      `reportFailure: ${isPermanent ? 'PERM' : 'TEMP'} failure reported for ` +
      `${NodeType.default.xk.name[nodeType]} at ${OcNetwork.buildNodePath(node)} : was ${OcNetwork.getStatusLabel(node)}`
    );

    // Only escalate, never de-escalate via this path
    if (oldStatus === statusEnum.PERMANENT) return;
    if (oldStatus === statusEnum.TEMPORARY || oldStatus === statusEnum.rq) {
      // Apply the new status
    } else {
      throw new Error('Invalid failure state');
    }

    node.status = targetStatus;
    OcNetwork.propagateFailureUp(node);

    this.networkFailedReported = this.networkFailedReported || this.locationHandler.isFailed();
    const updatedStatus = this.locationHandler.networkStatus;

    if (updatedStatus > previousStatus) {
      // Walk up to find the nearest server-level ancestor for logging
      let ancestor = node;
      while (ancestor && ancestor.directionEnum !== NodeType.default.xk.UP) {
        ancestor = ancestor.parent;
      }

      const serverId = ancestor?.id;
      const isFinalPermanent = updatedStatus === statusEnum.PERMANENT;

      logger.RETRY(`Emitting networkFailed, permanent = ${isFinalPermanent} serverId = ${serverId}`);
      this.emit('networkFailed', { lua: isFinalPermanent, sourceBufferIndex: ancestor });
    }

    this.selectedLocations = null;
    this.lastSelectionReason = NodeType.default.aA.ERROR;

    if (probeInfo) {
      this.lastSelectionReason = NodeType.default.aA.Z4b;
      node.probeInfo = probeInfo;
    }

    this.locationHandler.onStreamsUpdated();
  }

  /**
   * Resets a server's failure status, allowing traffic to return to it.
   *
   * @param {string}  serverId       - The server to reset.
   * @param {boolean} resetPermanent - Also clear PERMANENT failures.
   */
  resetServerStatus(serverId, resetPermanent) {
    const serverNode = this.locationHandler.servers[serverId];
    if (serverNode) {
      OcNetwork.resetStatus(serverNode, resetPermanent);
      OcNetwork.propagateRecoveryUp(serverNode);
    }
    this.selectedLocations = null;
    this.lastSelectionReason = NodeType.default.aA.rIa;
  }

  /**
   * Resets the entire network graph to a healthy state.
   */
  resetNetworkStatus() {
    OcNetwork.resetStatus(this.locationHandler.rootNode, false);
    this.selectionAttempts = {};
  }

  /* ------------------------------------------------------------------ */
  /*  Log / event helpers                                                */
  /* ------------------------------------------------------------------ */

  /**
   * Forwards structured log data to the log-data callback.
   * @param {Object} data
   */
  emitLogData(data) {
    this.logDataCallback(data);
  }

  /* ------------------------------------------------------------------ */
  /*  Playback state transitions                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Signals that playback has entered a rebuffer state.
   * Downgrades confidence on non-active locations.
   */
  onRebuffer() {
    const activeLocation = this.networkMonitor.location;
    this.currentLocationState = LocationState.REBUFFER;

    this.locationHandler.getLocations().forEach((loc) => {
      if (
        loc.id !== activeLocation &&
        loc.throughputEstimate?.confidence > NodeType.default.viewRange.HAVE_SOMETHING
      ) {
        loc.throughputEstimate.confidence = NodeType.default.viewRange.HAVE_SOMETHING;
      }
    });
  }

  /**
   * Persists temporary failures as throughput-monitor failures so they
   * survive across ABR evaluation rounds.
   */
  persistTemporaryFailures() {
    if (this.networkFailedReported) return;
    this.locationHandler.getLocations().forEach((loc) => {
      if (loc.status === statusEnum.TEMPORARY) {
        this.throughputMonitor.fail(loc.id, platform.platform.now());
      }
    });
  }

  /**
   * Called when the rebuffer state is entered — alias for onRebuffer().
   */
  setup() {
    this.onRebuffer();
  }

  /**
   * Called when playback is destroyed / cleaned up. Persists failures
   * if configured.
   */
  destroy() {
    if (this.config.locationSelectorPersistFailures) {
      this.persistTemporaryFailures();
    }
  }

  /**
   * Clears probe-attempt state after a successful download from a server.
   * @param {string} serverId
   */
  onSuccessfulDownload(serverId) {
    delete this.selectionAttempts[serverId];
  }
}

export { LocationSelector as v7 };
