/**
 * Netflix Cadmium Player — Open Connect Network Graph
 *
 * Maintains the hierarchical network topology for Open Connect (Netflix
 * CDN) playback: Network -> Locations -> Servers -> URLs.  Each node
 * carries a health status (OK / TEMPORARY / PERMANENT failure) that
 * propagates upward when all children of a node have failed.
 *
 * The graph is populated from manifest data and is consumed by the
 * LocationSelector to pick the best CDN endpoint for each stream.
 *
 * Node types (directionEnum):
 *  - NETWORK   — root sentinel
 *  - LOCATION  — geographic CDN site (e.g. "us-east-1")
 *  - SERVER    — individual OCA (Open Connect Appliance)
 *  - URL       — a concrete download URL for a specific stream
 *
 * @module OcNetwork
 */

// import * as helpers     from '../ads/AdBreakMismatchLogger.js';
// import * as util        from '../abr/InitialStreamSelector.js';
// import { platform }     from '../core/AsejsEngine.js';
// import { MediaType }    from '../core/AsejsEngine.js';
// import NodeType         from '../streaming/MediaFragment.js';
// import { statusEnum }   from '../modules/Module_36670.js';

const logger = new platform.Console('ASEJS_OC_NETWORK', 'media|asejs');

/**
 * Hierarchical CDN topology graph for Open Connect.
 */
class OcNetwork {
  /**
   * @param {Object}  throughputMonitor - Provides per-location throughput estimates.
   * @param {boolean} isLive            - Whether the current manifest is a live stream.
   */
  constructor(throughputMonitor, isLive) {
    this.throughputMonitor = throughputMonitor;
    this.isLive = isLive;

    /** @type {Object<string, Object>} Location nodes keyed by location key. */
    this.locations = {};

    /** @type {Object<string, Object>} Server nodes keyed by server ID. */
    this.servers = {};

    /** @type {Object<string, Object>} Stream descriptors keyed by downloadable ID. */
    this.streams = {};

    /** @type {Object<string, Object>} URL nodes keyed by URL string. */
    this.urls = {};

    /** @type {Object[]} Ordered list of location-level children of the root. */
    this.children = [];

    /** @type {Object} Root network node. */
    this.rootNode = {
      id: 'network',
      directionEnum: NodeType.default.xk.iK,
      status: statusEnum.rq,
      probeInfo: undefined,
      parent: undefined,
      children: this.children,
    };
  }

  /* ------------------------------------------------------------------ */
  /*  Static status propagation                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Propagates failure status **upward** from a child node. If all
   * children of a parent have failed, the parent is marked as failed too.
   *
   * @param {Object} node - The node whose parent should be re-evaluated.
   */
  static propagateFailureUp(node) {
    const parent = node.parent;
    if (!parent?.children) return;

    let statusChanged = false;
    const buckets = {
      [statusEnum.rq]: [],
      [statusEnum.PERMANENT]: [],
      [statusEnum.TEMPORARY]: [],
    };

    parent.children.forEach((child) => {
      if (child) buckets[child.status].push(child);
    });

    if (buckets[statusEnum.rq].length > 0) return; // at least one child is OK

    if (buckets[statusEnum.PERMANENT].length === parent.children.length) {
      if (parent.status !== statusEnum.PERMANENT) {
        parent.status = statusEnum.PERMANENT;
        logger.error('PERM failing :', `${NodeType.default.xk.name[parent.directionEnum]} ${parent.id}`);
        statusChanged = true;
      }
    } else if (parent.status === statusEnum.rq) {
      parent.status = statusEnum.TEMPORARY;
      logger.error('TEMP failing :', `${NodeType.default.xk.name[parent.directionEnum]} ${parent.id}`);
      statusChanged = true;
    }

    if (statusChanged) OcNetwork.propagateFailureUp(parent);
  }

  /**
   * Builds a human-readable path string from a node up to the root.
   *
   * @param {Object} node - Starting node.
   * @returns {string} Slash-separated path (e.g. "/locationId/serverId(name)/<url>").
   */
  static buildNodePath(node) {
    const parts = [];
    let current = node;

    while (current) {
      switch (current.directionEnum) {
        case NodeType.default.xk.UP:
          parts.unshift(`${current.id}(${current.name})`);
          break;
        case NodeType.default.xk.LOCATION:
          parts.unshift(current.id);
          break;
        case NodeType.default.xk.URL:
          parts.unshift(`<url for ${current.stream.bitrate}>`);
          break;
      }
      current = current.parent;
    }

    return parts.length ? `/${parts.join('/')}` : '';
  }

  /**
   * Propagates recovery status **upward**. If at least one child is OK,
   * the parent is reset to OK.
   *
   * @param {Object} node - The node whose parent should be re-evaluated.
   */
  static propagateRecoveryUp(node) {
    const parent = node.parent;
    if (!parent || parent.children.length === 0 || parent.status === statusEnum.rq) return;

    const buckets = {
      [statusEnum.rq]: [],
      [statusEnum.PERMANENT]: [],
      [statusEnum.TEMPORARY]: [],
    };

    parent.children.forEach((child) => {
      if (child) buckets[child.status].push(child);
    });

    if (buckets[statusEnum.rq].length > 0) {
      parent.status = statusEnum.rq;
      OcNetwork.propagateRecoveryUp(parent);
    }
  }

  /**
   * Returns a human-readable label for a node's health status.
   * @param {Object} node
   * @returns {string}
   */
  static getStatusLabel(node) {
    switch (node.status) {
      case statusEnum.rq:        return 'OK';
      case statusEnum.PERMANENT: return 'FAILED PERMANENTLY';
      case statusEnum.TEMPORARY: return 'FAILED TEMPORARILY';
      default:                   return 'INVALID';
    }
  }

  /**
   * Recursively resets the status of a node (and its descendants).
   *
   * @param {Object}  node            - The node to reset.
   * @param {boolean} resetPermanent  - Also reset PERMANENT failures?
   */
  static resetStatus(node, resetPermanent) {
    if (node.status === statusEnum.TEMPORARY || (node.status === statusEnum.PERMANENT && resetPermanent)) {
      node.status = statusEnum.rq;
    }
    node.children?.forEach((child) => {
      if (child) OcNetwork.resetStatus(child, resetPermanent);
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Instance accessors                                                 */
  /* ------------------------------------------------------------------ */

  /** @returns {Object[]} Top-level location children of the root. */
  getLocations() {
    return this.children;
  }

  /**
   * Finds a URL node for a specific server within a stream.
   *
   * @param {Object} stream   - Stream descriptor.
   * @param {string} serverId - Server ID to look up.
   * @returns {Object|undefined} The matching URL node.
   */
  findUrlForServer(stream, serverId) {
    for (let i = 0; i < stream.urls.length; i++) {
      if (stream.urls[i].server.id === serverId) {
        return stream.urls[i];
      }
    }
    return undefined;
  }

  /**
   * Whether the entire network root is in a failed state.
   * @returns {boolean}
   */
  isFailed() {
    return this.isNodeFailed(this.rootNode);
  }

  /**
   * Network-root health status.
   * @type {number}
   */
  get networkStatus() {
    return this.rootNode.status;
  }

  set networkStatus(value) {
    this.rootNode.status = value;
  }

  /**
   * Returns the location ID that hosts a given URL.
   * @param {string} urlKey
   * @returns {string|undefined}
   */
  getLocationForUrl(urlKey) {
    const urlNode = this.urls[urlKey];
    return urlNode?.parent?.id;
  }

  /**
   * Returns the server node for a given server ID.
   * @param {string} serverId
   * @returns {Object|undefined}
   */
  getServer(serverId) {
    return this.servers[serverId];
  }

  /**
   * Returns all server nodes whose URLs match a given stream's URL.
   *
   * @param {Object} stream - Stream descriptor with a `url` property.
   * @returns {Object[]} Matching server nodes.
   */
  getServersForStream(stream) {
    const matchingServers = [];
    for (const urlKey of Object.keys(this.urls)) {
      const urlNode = this.urls[urlKey];
      if (urlNode.url === stream.url) {
        matchingServers.push(urlNode.server);
      }
    }
    return matchingServers;
  }

  /**
   * Finds the internal stream descriptor for a given source-stream object.
   *
   * @param {Object} sourceStream
   * @returns {Object|undefined}
   */
  findStreamBySource(sourceStream) {
    for (const id in this.streams) {
      if (this.streams[id].sourceStream === sourceStream) {
        return this.streams[id];
      }
    }
    return undefined;
  }

  /* ------------------------------------------------------------------ */
  /*  Manifest update                                                    */
  /* ------------------------------------------------------------------ */

  /**
   * Ingests a parsed manifest and populates / updates the network graph.
   *
   * @param {Object} manifest       - Parsed manifest object with locations, servers, tracks.
   * @param {Array}  [streamFilter] - Optional list of stream-ID sets to retain.
   * @param {number} [updateMode]   - Update mode (STARTUP, REFRESH, etc.).
   */
  updateManifestMetadata(manifest, streamFilter, updateMode) {
    if (updateMode === undefined) updateMode = NodeType.default.aA.fgb;

    // --- Locations ---
    manifest.locations.forEach((loc) => {
      const key = loc.key;

      if (this.locations[key]) {
        this.locations[key].rank = loc.rank;
        this.locations[key].level = loc.level;
        this.locations[key].weight = loc.weight;
      } else {
        const locationChildren = [];
        const throughputEstimate = this.throughputMonitor.key(key);

        const locationNode = {
          id: key,
          directionEnum: NodeType.default.xk.LOCATION,
          status: statusEnum.rq,
          rank: loc.rank,
          level: loc.level,
          weight: loc.weight,
          probeInfo: undefined,
          parent: this.rootNode,
          children: locationChildren,
          servers: locationChildren,
          streamMap: {},
          throughputEstimate,
        };

        this.locations[key] = locationNode;
        this.rootNode.children.push(locationNode);
      }
    });

    this.children.sort((a, b) => a.level - b.level || a.rank - b.rank);

    // --- Servers ---
    manifest.servers.forEach((srv) => {
      const serverId = srv.id;

      if (this.servers[serverId]) {
        this.servers[serverId].rank = srv.rank;
      } else {
        const locationNode = this.locations[srv.key];
        if (!locationNode) return;

        const serverChildren = [];
        const serverNode = {
          id: serverId,
          directionEnum: NodeType.default.xk.UP,
          status: statusEnum.rq,
          probeInfo: undefined,
          parent: locationNode,
          children: serverChildren,
          urls: serverChildren,
          name: srv.name,
          type: srv.type,
          rank: srv.rank,
          location: locationNode,
        };

        this.servers[serverId] = serverNode;
        locationNode.children.push(serverNode);
      }
    });

    // --- Streams ---
    let shouldCreateStreams = true;

    if (streamFilter) {
      shouldCreateStreams = false;
      this._updateStreamFilter(streamFilter);
    }

    manifest.audio_tracks.forEach((track) => this._processTrack(MediaType.V, track, shouldCreateStreams));
    manifest.video_tracks.forEach((track) => this._processTrack(MediaType.U, track, shouldCreateStreams));
    manifest.timedtexttracks?.forEach((track) => this._processTimedTextTrack(track, shouldCreateStreams));
    manifest.mediaEventTracks?.forEach((track) => this._processTrack(MediaType.supplementaryMediaType, track, shouldCreateStreams));

    // Prune locations with no URLs
    const activeLocations = this.children.filter((location) => {
      const hasNoUrls = location.servers.every((srv) => srv.urls.length === 0);
      if (hasNoUrls) {
        location.servers.forEach((srv) => { this.servers[srv.id] = undefined; });
        this.locations[location.id] = undefined;
        location.parent = undefined;
        location.children.length = 0;
        location.streamMap = {};
      }
      return !hasNoUrls;
    });

    activeLocations.forEach((location) => {
      location.servers.sort((a, b) => a.rank - b.rank);
    });

    this.children = activeLocations;
    this.rootNode.children = activeLocations;
    this.onStreamsUpdated();
  }

  /**
   * Checks whether a node is in a failed state (TEMPORARY or PERMANENT).
   * @param {Object} node
   * @returns {boolean}
   */
  isNodeFailed(node) {
    return node.status !== statusEnum.rq;
  }

  /* ------------------------------------------------------------------ */
  /*  Internal stream / URL helpers                                      */
  /* ------------------------------------------------------------------ */

  /**
   * Updates the internal stream map based on an external stream-filter list.
   * Removes streams not present in the filter.
   *
   * @param {Array} filterSets - Array of stream-ID to metadata maps.
   * @private
   */
  _updateStreamFilter(filterSets) {
    const retainedIds = new Set();

    for (const filterSet of filterSets) {
      for (const streamId of Object.keys(filterSet)) {
        retainedIds.add(streamId);
        const metadata = filterSet[streamId];
        if (!metadata) continue;

        const existing = this.streams[streamId];
        this.streams[streamId] = existing
          ? { ...existing, ...metadata }
          : {
              id: streamId,
              bitrate: metadata.bitrate,
              vmaf: null,
              type: metadata.mediaType,
              clear: !metadata.networkKey,
              isPlayable: true,
              urls: [],
              locationUrlMap: {},
              locations: [],
              sourceStream: metadata,
              liveMode: this.isLive ? 'LIVE' : undefined,
            };
      }
    }

    // Remove streams no longer in the filter
    for (const id of Object.keys(this.streams)) {
      if (!retainedIds.has(id)) delete this.streams[id];
    }
  }

  /**
   * Processes a single audio / video / supplementary track from the manifest.
   *
   * @param {number}  mediaType        - MediaType enum value.
   * @param {Object}  track            - Track descriptor from the manifest.
   * @param {boolean} shouldCreateNew  - Whether to create new stream entries.
   * @private
   */
  _processTrack(mediaType, track, shouldCreateNew) {
    track.streams.forEach((stream) => {
      this._processStream(mediaType, stream.downloadable_id.toString(), stream, shouldCreateNew);
    });
  }

  /**
   * Processes a timed-text (subtitle) track from the manifest.
   *
   * @param {Object}  track            - Timed-text track descriptor.
   * @param {boolean} shouldCreateNew  - Whether to create new stream entries.
   * @private
   */
  _processTimedTextTrack(track, shouldCreateNew) {
    if (track.id === 'none') return;
    const downloadableId = track.downloadableIds['imsc1.1'];
    const downloadable = track.ttDownloadables['imsc1.1'];
    if (downloadable && downloadableId) {
      this._processStream(MediaType.TEXT_MEDIA_TYPE, downloadableId, downloadable, shouldCreateNew);
    }
  }

  /**
   * Creates or updates a stream entry and attaches its URL nodes.
   *
   * @param {number}  mediaType        - MediaType enum value.
   * @param {string}  streamId         - Downloadable ID.
   * @param {Object}  streamData       - Stream metadata from the manifest.
   * @param {boolean} shouldCreateNew  - Whether to create new stream entries.
   * @private
   */
  _processStream(mediaType, streamId, streamData, shouldCreateNew) {
    let stream = this.streams[streamId];

    if (util.isUndefined(stream) && shouldCreateNew) {
      let profile = '';
      let bitrate = 0;
      let vmaf = null;

      if (mediaType === MediaType.U || mediaType === MediaType.V) {
        profile = streamData.content_profile;
        bitrate = streamData.bitrate;
        if (mediaType === MediaType.U) vmaf = streamData.vmaf;
      }

      stream = {
        id: streamId,
        bitrate,
        vmaf,
        type: mediaType,
        profile,
        clear: profile.indexOf('none-') === 0,
        isPlayable: true,
        urls: [],
        locationUrlMap: {},
        locations: [],
        liveMode: this.isLive ? 'LIVE' : undefined,
      };

      this.streams[streamId] = stream;
    } else if (!stream && !shouldCreateNew) {
      return;
    }

    this._attachUrls(stream, streamData.urls);

    // Sort URLs within each location by server rank
    util.forEachEntry(stream.locationUrlMap, (urlList) => {
      urlList.sort((a, b) => a.server.rank - b.server.rank);
    });

    // Sort the stream's location list by level then rank
    stream.locations = stream.locations.sort((a, b) => a.level - b.level || a.rank - b.rank);
  }

  /**
   * Creates URL nodes for a stream and links them into the topology graph.
   *
   * @param {Object}  stream  - Internal stream descriptor.
   * @param {Array}   urlList - Array of URL metadata from the manifest.
   * @private
   */
  _attachUrls(stream, urlList) {
    urlList.forEach((urlMeta) => {
      const rawUrl = urlMeta.url;
      let urlNode = this.urls[rawUrl];
      const serverNode = this.servers[urlMeta.cdn_id];
      let liveCapabilities;

      if (this.isLive) liveCapabilities = urlMeta.liveOcaCapabilities;

      if (!serverNode) return;

      if (util.isUndefined(urlNode)) {
        urlNode = {
          id: rawUrl,
          directionEnum: NodeType.default.xk.URL,
          status: statusEnum.rq,
          probeInfo: undefined,
          parent: serverNode,
          children: [],
          url: rawUrl,
          server: serverNode,
          stream,
          liveCapabilities,
        };
        this.urls[rawUrl] = urlNode;
        serverNode.children.push(urlNode);
      }

      const locationNode = serverNode.location;
      stream.urls.push(urlNode);

      // Add location reference if not already present
      if (!stream.locations.some((loc) => loc.id === locationNode.id)) {
        stream.locations.push(locationNode);
      }

      locationNode.streamMap[stream.id] = stream;

      const existingList = stream.locationUrlMap[locationNode.id];
      if (existingList) {
        existingList.push(urlNode);
      } else {
        stream.locationUrlMap[locationNode.id] = [urlNode];
      }
    });
  }

  /**
   * Hook called after streams are updated. Override in subclasses to
   * trigger fragment-list refreshes, etc.
   */
  onStreamsUpdated() {}
}

export { OcNetwork };
