/**
 * Netflix Cadmium Player — Adaptive Streaming Engine (ASE) Core
 *
 * The central engine that orchestrates adaptive streaming for the Netflix player.
 * Manages the lifecycle of playgraphs (content streaming graphs), viewable sessions,
 * segment download requests, player instances, network monitoring, and buffer control.
 *
 * Key responsibilities:
 * - Opening/closing the engine and initializing subsystems (scheduler, event bus, monitors)
 * - Creating and removing playgraphs for content items
 * - Creating and managing player instances
 * - Tracking viewable sessions (manifest lookups, download state, side channels)
 * - Issuing download request opportunities based on streaming mode and buffer state
 * - Handling network failures and underflow events
 * - Maintaining weight-based priority across multiple playgraphs
 *
 * @module AsejsEngine
 * @webpack-module 29088
 * @export S9a
 */

import {
  __assign,
  __awaiter,
  __decorate,
  __generator,
  __read,
  __spreadArray,
  __values,
} from '../../tslib';

import { ClockWatcher } from '../events/ClockWatcher';                         // Module 90745
import { TimeUtil, findLast, flatten, NX, mX } from '../types/MediaType';      // Module 91176
import { platform } from '../core/Platform';                                    // Module 66164
import { laser } from '../telemetry/Laser';                                    // Module 97685
import { EngineRequestState, StreamingModeEnum } from '../types/EngineEnums';  // Module 8743
import { BufferSizeLimiter } from '../buffer/BufferSizeLimiter';               // Module 58348
import { ViewableSession } from '../streaming/ViewableSession';                // Module 6200
import { EventBus } from '../events/EventBus';                                 // Module 79183
import { MonitoringSystemFactory } from '../monitoring/MonitoringSystem';       // Module 3033
import { MediaType, timeSlice } from '../types/MediaType';                     // Module 65161
import { TaskScheduler } from '../streaming/TaskScheduler';                    // Module 19089
import { assert } from '../assert/assert';                                     // Module 52571
import { SessionTraceProcessor } from '../telemetry/SessionTraceProcessor';    // Module 7470
import { StreamableListener } from '../streaming/StreamableListener';          // Module 35438
import { PlaygraphMetricsReporter } from '../streaming/PlaygraphMetricsReporter'; // Module 37058
import { SessionMetrics, consoleLogger } from '../monitoring/SessionMetrics';  // Module 61996
import { EventProcessorAdapter } from '../events/EventProcessorAdapter';       // Module 54366
import { NetworkChangeProcessor } from '../network/NetworkChangeProcessor';    // Module 650
import { EngineScheduler } from '../timing/EngineScheduler';                   // Module 40666
import { ClockFactory } from '../timing/ClockFactory';                         // Module 17122
import { mathTanh } from '../utils/ConsoleFactory';                            // Module 69575
import { EngineEventProcessor } from '../events/EngineEventProcessor';         // Module 8478
import { BandwidthAggregator } from '../network/BandwidthAggregator';         // Module 27255
import { UnderflowHandler } from '../streaming/UnderflowHandler';             // Module 93747
import { PlaygraphStartHandler } from '../streaming/PlaygraphStartHandler';   // Module 75402
import { EventProcessingPipeline } from '../events/EventProcessingPipeline';  // Module 91967
import { ViewableLookup } from '../streaming/ViewableLookup';                 // Module 33143
import { ViewableEventHandler } from '../streaming/ViewableEventHandler';     // Module 29688
import { FragmentCacheHandler } from '../mp4/FragmentCacheHandler';           // Module 14609
import { ViewableConfigHandler } from '../streaming/ViewableConfigHandler';   // Module 27288
import { ConfigProviderFactory } from '../streaming/ConfigProviderFactory';   // Module 23102
import { PlaygraphManager } from '../streaming/PlaygraphManager';             // Module 27459
import { BufferLimitCalculator } from '../buffer/BufferLimitCalculator';      // Module 61567
import { PlaygraphFactory } from '../streaming/PlaygraphFactory';             // Module 66607
import { PlayerFactory } from '../player/PlayerFactory';                       // Module 66701
import { ViewableBinding } from '../streaming/ViewableBinding';               // Module 11177
import { EngineConfigWrapper } from '../core/EngineConfigWrapper';            // Module 358
import { validateEngineConfig } from '../core/EngineConfigValidator';         // Module 18945

/** @type {number} Auto-incrementing playgraph ID counter */
let nextPlaygraphId = 0;

/**
 * The Adaptive Streaming Engine (ASE) — the central orchestrator for Netflix streaming.
 *
 * Manages all streaming subsystems: playgraphs, viewable sessions, segment requests,
 * player instances, monitoring, scheduling, and event processing.
 */
export class AsejsEngine {
  /**
   * @param {Object} consoleLogger - A console/logging interface scoped to ASEJS
   */
  constructor(consoleLogger) {
    /** @type {Object} Console logger for this engine instance */
    this.console = consoleLogger;

    /** @type {string} Current engine lifecycle state (OPEN or CLOSED) */
    this.requestState = EngineRequestState.CLOSED;

    /** @type {Array<ViewableEntry>} Active viewable entries (segment request bookkeeping) */
    this.pendingSegmentRequests = [];

    /** @type {Array<Object>} Queued manifest side-channel configurations */
    this.manifestSideChannelConfigs = [];

    /** @type {Array<Object>} Active player instances */
    this.playerInstances = [];

    /** @type {Array<PlaygraphEntry>} Active playgraph entries with metadata */
    this.playgraphItems = [];

    /** @type {Object} Stream configuration map (codec/profile settings) */
    this.streamConfigMap = {};

    /** @type {Object} Media Source Extensions capability map */
    this.mediaSourceExtensions = {};

    /** @type {string} Current streaming mode (default, disabled, lowCpuPlaybackStarting) */
    this.currentStreamingMode = StreamingModeEnum.default;

    /** @type {Object} Engine-level options */
    this.engineOptions = {
      concurrentStreamingEnabled: false,
    };

    /** @type {SessionMetrics} Metrics tracker for this engine session */
    this.sessionMetrics = new SessionMetrics({
      owner: this,
      source: 'engine',
      isLive: 10,
      console: consoleLogger,
    });
  }

  // ─── Getters ───────────────────────────────────────────────────

  /**
   * Returns the current configuration provider, asserting it exists.
   * @returns {Object} The active configuration provider
   */
  get currentConfigProvider() {
    assert(this.configurationProvider);
    return this.configurationProvider;
  }

  /**
   * Returns the current engine lifecycle state.
   * @returns {string} One of EngineRequestState values
   */
  get state() {
    return this.requestState;
  }

  /**
   * Returns all active player instances.
   * @returns {Array<Object>}
   */
  get players() {
    return this.playerInstances;
  }

  /**
   * Returns segment maps for all active playgraphs.
   * @returns {Array<Object>}
   */
  get segmentMaps() {
    return this.playgraphItems.map((entry) => entry.segmentMap);
  }

  /**
   * Returns all active playgraph entries (with metadata).
   * @returns {Array<PlaygraphEntry>}
   */
  get playgraphs() {
    return this.playgraphItems;
  }

  /**
   * Returns the network monitor from the monitoring subsystem.
   * @returns {Object}
   */
  get networkMonitor() {
    this.assertOpen();
    return this.monitoringSystem.networkMonitor;
  }

  /**
   * Returns the latency monitor from the monitoring subsystem.
   * @returns {Object}
   */
  get latencyMonitor() {
    this.assertOpen();
    return this.monitoringSystem.latencyMonitor;
  }

  /**
   * Returns the throughput monitor from the monitoring subsystem.
   * @returns {Object}
   */
  get throughputMonitor() {
    this.assertOpen();
    return this.monitoringSystem.throughputMonitor;
  }

  /**
   * Returns the default monitor from the monitoring subsystem.
   * @returns {Object}
   */
  get defaultMonitor() {
    this.assertOpen();
    return this.monitoringSystem.default;
  }

  /**
   * Returns the number of pending segment requests.
   * @returns {number}
   */
  get pendingRequestCount() {
    return this.pendingSegmentRequests.length;
  }

  /**
   * Returns the current stream configuration map.
   * @returns {Object}
   */
  get streamConfigs() {
    return this.streamConfigMap;
  }

  /**
   * Returns the buffer size limiter instance (if enabled).
   * @returns {BufferSizeLimiter|undefined}
   */
  get bufferLimiter() {
    return this.bufferLimiterInstance;
  }

  /**
   * Returns the current Media Source Extensions map.
   * @returns {Object}
   */
  get mediaSourceExtensionMap() {
    return this.mediaSourceExtensions;
  }

  /**
   * Returns the computed buffer limits (lazily cached).
   * @returns {Object}
   */
  get bufferLimits() {
    if (!this._cachedBufferLimits) {
      this._cachedBufferLimits = this.computeBufferLimits();
    }
    return this._cachedBufferLimits;
  }

  /**
   * Returns the list of playgraph IDs from active playgraph items.
   * @returns {Array<Object>}
   */
  get playgraphIdList() {
    // Referenced in z1a and removePlaygraph — returns the playgraph items themselves
    return this.playgraphItems;
  }

  // ─── Engine Lifecycle ──────────────────────────────────────────

  /**
   * Opens the engine: initializes the scheduler, event bus, monitoring,
   * task scheduler, buffer limiter, config provider, playgraph manager,
   * underflow handler, and event processing pipeline.
   *
   * @param {Object} config - The streaming configuration object
   * @param {Object} monitoringConfig - Configuration for network/latency/throughput monitors
   * @param {Object} [initialConfigOverrides] - Optional initial config provider overrides
   * @param {Object} [additionalConfigOverrides] - Optional secondary config overrides
   * @returns {boolean} True if opened successfully, false if already open
   */
  open(config, monitoringConfig, initialConfigOverrides, additionalConfigOverrides) {
    if (this.requestState === EngineRequestState.OPEN) {
      return false;
    }

    // Subscribe to config changes that disable media events tracking
    if (config.on !== undefined) {
      config.on('changed', () => {
        if (!config.enableMediaEventsTrack) {
          this.pendingSegmentRequests.forEach((entry) => {
            const session = entry.viewableSession;
            if (session?.mediaEventsStore) {
              session.mediaEventsStore.disable();
            }
          });
        }
      });
    }

    // Wrap the configuration
    this.configWrapper = new EngineConfigWrapper(config, this.console);
    this.config = this.configWrapper.resolvedConfig;
    NX.validateConfig(this.config);

    // Initialize the engine scheduler with a real-time clock
    this.engineScheduler = new EngineScheduler(
      new ClockFactory({
        useRealTime: true,
        currentTime: () => TimeUtil.fromMilliseconds(platform.platform.now()),
        speed: 1,
      }),
      this.console,
      'Engine Scheduler'
    );

    // Create the engine event bus
    this.engineEventEmitter = new EventBus(this.console, config);

    // Create the task scheduler
    this.taskScheduler = new TaskScheduler(
      this.issueRequestOpportunity.bind(this),
      this.engineScheduler,
      config
    );

    // Optionally create a buffer size limiter
    if (config.useBufferSizeLimiter || platform.setImmediate.codecProfilesMap?.supportsLimiting) {
      this.bufferLimiterInstance = new BufferSizeLimiter(this.console, config, () => {
        return this.bufferSizeMap;
      });
    }

    // Initialize monitoring (network, latency, throughput)
    this.monitoringSystem = MonitoringSystemFactory.create(config, this.console, monitoringConfig);

    // Mark the engine as open
    this.requestState = EngineRequestState.OPEN;

    // Create the configuration provider
    this.configurationProvider = ConfigProviderFactory(config);
    if (initialConfigOverrides) {
      this.configurationProvider.applyInitialOverrides(initialConfigOverrides);
    }
    if (additionalConfigOverrides) {
      this.configurationProvider.applyAdditionalOverrides(additionalConfigOverrides);
    }

    // Create the playgraph manager
    this.playgraphManager = new PlaygraphManager({
      scheduleOpportunity: () => {
        if (this.requestState !== EngineRequestState.CLOSED) {
          this.taskScheduler.scheduleOpportunity('playgraphOpportunity');
        }
      },
    });

    // Create the underflow handler
    this.underflowHandler = new UnderflowHandler(
      () => this.getBufferLimits(),
      () => this.getStreamingCapabilities().global,
      this.console
    );

    // Initialize the event processing pipeline
    this.initializeEventProcessingPipeline();

    return true;
  }

  /**
   * Creates a new playgraph for a content item, registers event listeners,
   * and returns the playgraph session object.
   *
   * @param {Object} manifestId - The manifest identifier
   * @param {Object} playbackConfig - Playback configuration
   * @param {Object} streamConfig - Stream-level configuration overrides
   * @param {Object} manifestCache - The manifest cache for resolving content
   * @param {boolean} [allowReuse=true] - Whether to reuse existing playgraphs
   * @returns {Object} The created (or reused) playgraph session
   */
  createPlaygraph(manifestId, playbackConfig, streamConfig, manifestCache, allowReuse = true) {
    this.assertOpen();

    // Extend the stream config with shared MSE and buffer limiter info
    streamConfig = Object.create(streamConfig, {
      sharedMse: { value: this.sharedMediaSourceExtensions },
      useBufferSizeLimiter: { value: !!this.bufferLimiterInstance },
    });

    // Try to reuse an existing playgraph
    if (allowReuse) {
      const existing = this.currentConfigProvider.findExistingPlaygraph(manifestId, streamConfig);
      if (existing) {
        existing.updatePlaybackConfig(playbackConfig);

        const createViewableFn = this.createViewable.bind(this, manifestCache, existing);
        createViewableFn.manifestCache = manifestCache;

        const cacheResult = existing.attachManifestCache(createViewableFn).manifestCache;
        const validation = manifestCache.validateCache?.(cacheResult);

        if (validation && !validation.success) {
          this.removePlaygraph(existing);
          // Fall through to create a new one
        } else {
          return existing;
        }
      }
    }

    // Factory function for creating viewable sessions within this playgraph
    const createViewableFn = (viewableConfig) => {
      return this.createViewable(manifestCache, playgraphSession, viewableConfig);
    };
    createViewableFn.manifestCache = manifestCache;

    // Create the viewable lookup helper
    const viewableLookup = new ViewableLookup(
      createViewableFn,
      manifestCache,
      (cacheEntry, config) => !!this.lookupViewable(config, cacheEntry).existingEntry
    );

    // Build the playgraph session via the factory
    let failureReason;
    const playgraphSession = PlaygraphFactory(
      streamConfig,
      [
        manifestId,
        playbackConfig,
        streamConfig,
        nextPlaygraphId++,
        this.networkMonitor,
        viewableLookup,
        (reason) => this.taskScheduler.scheduleOpportunity(reason),
        allowReuse
          ? this.currentConfigProvider.registerPlaygraph.bind(this.currentConfigProvider)
          : () => {},
        this.getBufferLimits.bind(this),
        this.configWrapper,
      ],
      this.console
    );

    // Register event handlers on the playgraph session
    playgraphSession.addHandler(new StreamableListener(playgraphSession));
    playgraphSession.addHandler(new PlaygraphMetricsReporter(playgraphSession.branchScheduler));
    playgraphSession.addHandler(new ViewableConfigHandler(this.configWrapper, playgraphSession));

    if (failureReason) {
      playgraphSession.addHandler(new FragmentCacheHandler(failureReason));
    }

    playgraphSession.eventPipeline.addHandler(new PlaygraphStartHandler(playgraphSession));
    playgraphSession.eventPipeline.addHandler(new ViewableEventHandler(playgraphSession));

    // Register global event processors with this playgraph
    this.eventProcessingPipeline.processors.forEach((processor) => {
      playgraphSession.addHandler(processor);
    });

    // Register with the playgraph manager
    this.playgraphManager.createPlaygraph(playgraphSession);

    // Set up event listeners for pruning, weight changes, and underflow
    const listeners = new ClockWatcher();
    listeners.on(playgraphSession.events, 'requestsPruned', this.onRequestsPruned.bind(this));
    listeners.on(playgraphSession.events, 'weightUpdated', this.updatePlaygraphWeights.bind(this));
    listeners.on(playgraphSession.events, 'underflow', this.handleUnderflow.bind(this, playgraphSession));

    this.playgraphItems.push({
      segmentMap: playgraphSession,
      eventListeners: listeners,
      weightFraction: 0,
    });

    this.updatePlaygraphWeights();
    validateEngineConfig(this.config);

    if (laser.isEnabled) {
      laser.log({
        playgraphId: playgraphSession.id,
        type: 'STREAMING_STATE_CHANGE',
        state: 'LOADING_METADATA',
      });
    }

    return playgraphSession;
  }

  /**
   * Handles an underflow event from a playgraph session.
   *
   * @param {Object} playgraphSession - The playgraph that reported underflow
   */
  handleUnderflow(playgraphSession) {
    const result = this.underflowHandler.handleUnderflow(playgraphSession);
    if (!result?.suppressReconfiguration) {
      this.currentConfigProvider.create();
    }
  }

  /**
   * Removes and destroys a playgraph, cleaning up event listeners and laser logs.
   *
   * @param {Object} playgraphSession - The playgraph session to remove
   */
  removePlaygraph(playgraphSession) {
    this.playgraphManager.removePlaygraph(playgraphSession);
    playgraphSession.destroy();

    this.playgraphItems = this.playgraphItems.filter((entry) => {
      if (entry.segmentMap === playgraphSession) {
        entry.eventListeners.clear();
        return false;
      }
      return true;
    });

    this.updatePlaygraphWeights();

    if (laser.isEnabled) {
      laser.log({
        type: 'STREAMING_STATE_CHANGE',
        playgraphId: playgraphSession.id,
        state: 'UNLOADED',
      });
      laser.log({
        type: 'PRESENTING_STATE_CHANGE',
        playgraphId: playgraphSession.id,
        state: 'UNLOADED',
      });
      if (this.playgraphIdList.length === 0) {
        laser.flush();
      }
    }
  }

  /**
   * Creates a new player instance for a given playgraph session.
   *
   * @param {Object} playgraphSession - The playgraph session to bind the player to
   * @param {Object} playerConfig - Player configuration including media types for branching
   * @returns {Object} The created player instance
   */
  createPlayer(playgraphSession, playerConfig) {
    this.assertOpen();

    const mediaTypes = playerConfig.mediaTypesForBranching ?? [
      MediaType.AUDIO,
      MediaType.VIDEO,
    ];

    const player = PlayerFactory(playerConfig, [
      playgraphSession,
      mediaTypes,
      this.applyMediaSourceExtensions(playerConfig),
    ]);

    this.playerInstances.push(player);
    return player;
  }

  /**
   * Destroys a player instance and removes it from the active list.
   *
   * @param {Object} player - The player instance to destroy
   */
  destroyPlayer(player) {
    this.assertOpen();
    this.playerInstances = this.playerInstances.filter((p) => p !== player);
    player.destroy();
  }

  /**
   * Updates the stream configuration map and MSE capabilities.
   *
   * @param {Object} streamConfigMap - New stream configuration map
   * @param {Object} mseMap - New Media Source Extensions capability map
   */
  setStreamConfiguration(streamConfigMap, mseMap) {
    this.streamConfigMap = streamConfigMap;
    this.mediaSourceExtensions = mseMap;
    this._cachedBufferLimits = undefined;
  }

  /**
   * Adds a manifest side-channel configuration for a given manifest entry.
   * If a viewable session already exists for that manifest, the side channel is
   * attached immediately; otherwise it is queued.
   *
   * @param {Object} manifestId - The manifest identifier to attach the side channel to
   * @param {Object} sideChannelConfig - The side-channel configuration
   */
  addManifestSideChannel(manifestId, sideChannelConfig) {
    const entry = findLast(this.pendingSegmentRequests, (e) => e.manifestCacheEntry.equals(manifestId));
    const session = entry?.viewableSession;

    if (session) {
      session.addManifestSideChannel({
        ...sideChannelConfig,
        onException: this.notifyAseException.bind(this),
      });
    } else {
      this.manifestSideChannelConfigs.push({
        manifestId,
        config: sideChannelConfig,
      });
    }
  }

  /**
   * Removes queued manifest side-channel configurations for a given manifest ID.
   *
   * @param {Object} manifestId - The manifest identifier to remove side channels for
   */
  removeManifestSideChannel(manifestId) {
    this.manifestSideChannelConfigs = this.manifestSideChannelConfigs.filter(
      (entry) => !entry.manifestId.equals(manifestId)
    );
  }

  /**
   * Closes the engine, tearing down all playgraphs, monitoring, and subsystems.
   */
  close() {
    if (this.requestState === EngineRequestState.CLOSED) {
      return;
    }

    this.destroyAllPlaygraphs();
    assert(
      this.pendingSegmentRequests.length === 0,
      'Unexpected viewable lease after Playgraph destruction.'
    );
    this.destroyAllPlayers();
    this.manifestSideChannelConfigs = [];
    delete this.monitoringSystem;
    this.requestState = EngineRequestState.CLOSED;
    this.engineScheduler.destroy();
  }

  /**
   * Changes the streaming mode and triggers a scheduling opportunity.
   *
   * @param {string} mode - The new streaming mode
   */
  setStreamingMode(mode) {
    this.currentStreamingMode = mode;
    this.taskScheduler.scheduleOpportunity('streamingModeChanged');
  }

  /**
   * Updates concurrent streaming device settings and propagates to playgraphs.
   *
   * @param {Object} settings - Object with concurrentStreamingEnabled flag
   */
  setConcurrentStreamingDevice(settings) {
    this.engineOptions.concurrentStreamingEnabled = settings.concurrentStreamingEnabled;

    if (this.config.enableConcurrentStreamingHandling) {
      const isConcurrent = settings.concurrentStreamingEnabled === true;

      if (this.config.set) {
        this.config.set({ enableCprVideo: isConcurrent });
      } else {
        this.config.enableCprVideo = settings.concurrentStreamingEnabled === true;
      }

      for (const entry of this.playgraphItems) {
        entry.segmentMap.setConcurrentStreaming(isConcurrent);
      }
    }
  }

  // ─── Viewable Management ──────────────────────────────────────

  /**
   * Updates a viewable session by resolving the manifest and applying new data.
   *
   * @param {Object} viewableConfig - The updated viewable configuration
   * @returns {Promise<void>}
   */
  async updateViewable(viewableConfig) {
    assert(viewableConfig, 'ase.updateViewable(): Viewable config not found.');

    const entry = findLast(this.pendingSegmentRequests, (e) =>
      e.manifestCacheEntry.equals(viewableConfig)
    );
    assert(entry, 'ase.updateViewable(): Viewable entry not found.');

    const session = await entry.sessionPromise;
    const manifestData = await viewableConfig.manifestData;
    session.updateViewable(manifestData);
  }

  /**
   * Looks up an existing viewable entry by manifest cache key.
   *
   * @param {Object} manifestCache - The manifest cache to look in
   * @param {Object} viewableConfig - Viewable config with manifestId and bufferMode
   * @returns {Object} Object with existingEntry and manifestCacheEntry
   * @private
   */
  lookupViewable(manifestCache, viewableConfig) {
    const cacheEntry = manifestCache.getManifestCacheEntry(
      viewableConfig.manifestId,
      viewableConfig.bufferMode
    );
    return {
      existingEntry: findLast(this.pendingSegmentRequests, (e) =>
        e.manifestCacheEntry.equals(cacheEntry)
      ),
      manifestCacheEntry: cacheEntry,
    };
  }

  /**
   * Creates (or reuses) a viewable session for a given content item within a playgraph.
   * Handles parent manifest resolution for auxiliary content (e.g., ads).
   *
   * @param {Object} manifestCache - The manifest cache
   * @param {Object} playgraphSession - The owning playgraph session
   * @param {Object} viewableConfig - Configuration with manifestId and bufferMode
   * @param {Object} [parentDecompressor] - Decompressor from parent viewable (for auxiliary content)
   * @returns {Object} A ViewableBinding instance
   * @private
   */
  createViewable(manifestCache, playgraphSession, viewableConfig, parentDecompressor) {
    const manifestId = viewableConfig.manifestId;
    const bufferMode = viewableConfig.bufferMode;
    const lookup = this.lookupViewable(manifestCache, viewableConfig);
    let existingEntry = lookup?.existingEntry;
    const cacheEntry = lookup.manifestCacheEntry;

    if (!existingEntry) {
      // Check if this viewable has a parent manifest (e.g., for auxiliary/ad content)
      const parentManifestId = bufferMode?.auxiliaryManifestInfo?.parentManifestId;
      let parentViewable;
      let parentDecomp;

      if (parentManifestId !== undefined) {
        parentViewable = this.createViewable(manifestCache, playgraphSession, {
          manifestId: parentManifestId,
          bufferMode: {},
        });
        parentDecomp = parentViewable.decompressor;
      }

      if (laser.isEnabled) {
        laser.log({
          playgraphId: playgraphSession.id,
          type: 'VIEWABLE_REQUEST_STATE_CHANGE',
          id: manifestId.toString(),
          state: 'WAITING',
          isAd: !!(bufferMode?.execPointer),
        });
      }

      // Create the viewable entry with a promise that resolves to the session
      existingEntry = {
        manifestCacheEntry: cacheEntry,
        sessionPromise: (async () => {
          const [manifestData, parentSession] = await Promise.all([
            cacheEntry.manifestData,
            parentViewable?.sessionPromise,
          ]);

          const session = this.initializeDownloadSession(
            manifestId,
            cacheEntry,
            manifestData,
            playgraphSession.id,
            parentSession
          );

          if (laser.isEnabled) {
            laser.log({
              playgraphId: playgraphSession.id,
              type: 'VIEWABLE_REQUEST_STATE_CHANGE',
              id: manifestId.toString(),
              state: 'COMPLETED',
              viewableType: session.isAdPlaygraph
                ? session.isAuxiliaryContent
                  ? 'LIVE'
                  : 'LIVE_DVR'
                : 'SVOD',
            });
          }

          // Wait for server clock sync if needed for ad playback
          if (
            session.isAdPlaygraph &&
            session.mediaEventsStore &&
            !session.encodingInfo.isClockSynced &&
            !session.mediaEventsStore.complete
          ) {
            await Promise.race([
              session.encodingInfo.clockSyncPromise,
              new Promise((resolve) =>
                setTimeout(resolve, this.config.serverClockSyncOnViewableRetrievalTimeout)
              ),
            ]);
          }

          existingEntry.viewableSession = session;
          return session;
        })(),
        refCount: undefined,
        refCounter: new mX({
          name: 'viewableCollection',
          onRelease: (shouldDestroy) => {
            if (shouldDestroy()) {
              parentDecomp?.release();
              this.removeViewableEntry(existingEntry);
            }
          },
          console: mathTanh(
            platform,
            this.console,
            `${manifestId}`
          ),
        }),
      };

      this.pendingSegmentRequests.push(existingEntry);
    }

    // Create and return the binding
    const binding = new ViewableBinding(
      existingEntry,
      this.console,
      playgraphSession,
      viewableConfig,
      parentDecompressor
    );
    binding.events.once('error', this.removeViewableEntry.bind(this, existingEntry, false));

    return binding;
  }

  /**
   * Removes a viewable entry, optionally destroying its session.
   *
   * @param {Object} entry - The viewable entry to remove
   * @param {boolean} [shouldDestroy=true] - Whether to destroy the session
   * @private
   */
  removeViewableEntry(entry, shouldDestroy = true) {
    assert(entry, 'expected viewableEntry to exist');

    const cacheEntry = entry.manifestCacheEntry;
    const session = entry.viewableSession;
    const sessionPromise = entry.sessionPromise;

    if (shouldDestroy) {
      cacheEntry.release();
      if (session) {
        session.destroy();
      } else {
        sessionPromise.then((s) => s.destroy());
      }
    }

    this.pendingSegmentRequests = this.pendingSegmentRequests.filter((e) => e !== entry);
  }

  /**
   * Initializes a download session for a viewable, setting up network callbacks,
   * monitoring, and side-channel attachment.
   *
   * @param {Object} manifestId - The manifest identifier
   * @param {Object} cacheEntry - The manifest cache entry
   * @param {Object} manifestData - Resolved manifest data
   * @param {string} playgraphId - The owning playgraph's ID
   * @param {Object} [parentSession] - Parent session for auxiliary content
   * @returns {Object} The initialized ViewableSession
   * @private
   */
  initializeDownloadSession(manifestId, cacheEntry, manifestData, playgraphId, parentSession) {
    this.assertOpen();

    const config = manifestData.config;

    const sessionConfig = {
      manifest: manifestData.manifestRef,
      config,
      isReadyForPlayback: manifestData.isReadyForPlayback,
      networkMonitor: this.monitoringSystem.networkMonitor,
      throughputMonitor: this.monitoringSystem.throughputMonitor,
      networkCallbacks: {
        onNetworkRecovery: () => this.taskScheduler.scheduleOpportunity('networkFailureReset'),
        onNetworkFailure: this.reportStreamingFailure.bind(this, manifestId),
      },
      requestCallbacks: {
        onRequestStart: this.onRequestStart.bind(this),
        onRequestComplete: this.onRequestComplete.bind(this),
        getSchedulerState: () => this.taskScheduler.schedulerState,
      },
      sharedMediaSourceExtensions: this.mediaSourceExtensions,
      bufferSizeLimiter: this.bufferLimiterInstance,
      configWrapper: this.configWrapper,
      taskScheduler: this.taskScheduler,
      engineScheduler: this.engineScheduler,
      playgraphId,
    };

    const session = new ViewableSession(manifestId, sessionConfig, parentSession);

    // Attach queued manifest side-channel if applicable
    if (config.enableOCSideChannel) {
      const sideChannel = findLast(this.manifestSideChannelConfigs, (sc) =>
        sc.manifestId.equals(cacheEntry)
      );

      if (sideChannel) {
        const scConfig = sideChannel.config;
        this.removeManifestSideChannel(cacheEntry);

        const useUnified = session.isAdPlaygraph
          ? config.liveEnableUnifiedSideChannel || config.enableUnifiedSideChannel
          : config.svodEnableUnifiedSideChannel || config.enableUnifiedSideChannel;

        const enrichedConfig = {
          ...scConfig,
          onException: this.notifyAseException.bind(this),
        };

        if (useUnified) {
          session.attachUnifiedSideChannel(enrichedConfig);
        } else {
          session.addManifestSideChannel(enrichedConfig);
        }
      }
    }

    return session;
  }

  // ─── Request Scheduling ────────────────────────────────────────

  /**
   * Issues a request opportunity: gathers pending requests from all playgraphs,
   * evaluates eligibility, and dispatches download requests.
   *
   * @returns {Object} Result with Ff (hasWork), reason, and pending request info
   * @private
   */
  issueRequestOpportunity() {
    assert(this.state === EngineRequestState.OPEN);

    const capabilities = this.getStreamingCapabilities();
    const pendingRequests = this.collectPendingRequests();

    const evaluation = this.engineEventEmitter.evaluateRequests(pendingRequests);
    const eligibleRequests = evaluation.eligibleRequests;
    const activeRequests = evaluation.activeRequests;
    const reason = evaluation.reason;
    const unavailableCount = evaluation.unavailableCount;

    if (eligibleRequests.length > 0) {
      const dispatchResult = this.engineEventEmitter.dispatchRequests(
        capabilities,
        eligibleRequests
      );
      if (!dispatchResult.factorySymbol && unavailableCount > 0) {
        return {
          hasWork: false,
          reason: dispatchResult.reason,
          activeRequests,
        };
      }
      return dispatchResult;
    }

    if (unavailableCount > 0) {
      assert(reason !== 'available', 'Unavailable streamables may not be available');
      return {
        hasWork: false,
        reason,
        activeRequests,
      };
    }

    return {
      hasWork: false,
      reason: 'noEligibleStreamables',
    };
  }

  /**
   * Collects all pending download requests across playgraphs and viewable sessions,
   * applying streaming mode filters and prefetch logic.
   *
   * @returns {Array<Object>} Flattened list of pending requests
   * @private
   */
  collectPendingRequests() {
    const prefetchWhilePlaying =
      this.config.prefetchWhilePlaying ??
      this.playgraphItems.every((entry) => !entry.segmentMap.hasStarted);

    // Gather requests from playgraphs
    let playgraphRequests = flatten(
      this.playgraphItems.map((entry) => {
        return entry.segmentMap.getPendingRequests().map((request) => {
          if (!entry.segmentMap.hasStarted && entry.weightFraction !== 1) {
            request.priority = entry.weightFraction;
          }
          return request;
        });
      })
    );

    // Apply streaming mode filters
    if (this.currentStreamingMode === StreamingModeEnum.disabled) {
      playgraphRequests = [];
    } else if (this.currentStreamingMode === StreamingModeEnum.lowCpuPlaybackStarting) {
      playgraphRequests = playgraphRequests.filter((request) => {
        return this.config.maxBufferingCompleteBufferInMs >= request.streamingPlayerMs - request.presentationTimeMs;
      });
    }

    // If not prefetching while playing, filter to highest-priority requests only
    if (!prefetchWhilePlaying) {
      const primaryRequests = playgraphRequests.filter((request) => {
        return (request.priority ?? 1) === 1;
      });
      if (primaryRequests.length) {
        playgraphRequests = primaryRequests;
      }
    }

    // Gather requests from active viewable sessions
    const sessionRequests = this.pendingSegmentRequests.reduce((acc, entry) => {
      if (entry.viewableSession) {
        return [...acc, ...entry.viewableSession.getPendingRequests()];
      }
      return acc;
    }, []);

    return flatten([...playgraphRequests, ...sessionRequests]);
  }

  // ─── Internal Helpers ──────────────────────────────────────────

  /**
   * Asserts the engine is in the OPEN state; throws if closed.
   * @private
   */
  assertOpen() {
    if (this.requestState === EngineRequestState.CLOSED) {
      throw new Error('Engine CLOSED');
    }
  }

  /**
   * Destroys all playgraphs and clears event listeners.
   * @private
   */
  destroyAllPlaygraphs() {
    for (const entry of this.playgraphItems) {
      entry.eventListeners.clear();
      this.removePlaygraph(entry.segmentMap);
    }
  }

  /**
   * Destroys all player instances.
   * @private
   */
  destroyAllPlayers() {
    for (const player of this.playerInstances) {
      this.destroyPlayer(player);
    }
  }

  /**
   * Reports a streaming failure to all playgraphs that reference the given manifest.
   *
   * @param {Object} manifestId - The manifest that encountered a failure
   * @param {Object} failureInfo - Details about the failure
   * @returns {boolean} Whether any playgraph handled the failure
   * @private
   */
  reportStreamingFailure(manifestId, failureInfo) {
    failureInfo.manifestId = manifestId;
    let handled = false;

    this.findPlaygraphsForManifest(manifestId).forEach((playgraph) => {
      if (!failureInfo.restrictToActive || timeSlice(playgraph.playgraphState.value)) {
        handled = playgraph.reportStreamingFailure(failureInfo);
      }
    });

    return handled;
  }

  /**
   * Checks if any playgraph referencing the given manifest has recovered from failure.
   *
   * @param {Object} manifestId - The manifest identifier
   * @returns {boolean} Whether any playgraph has recovered
   * @private
   */
  hasRecoveredFromFailure(manifestId) {
    return this.findPlaygraphsForManifest(manifestId).some((playgraph) => {
      return playgraph.hasRecoveredFromFailure();
    });
  }

  /**
   * Finds all playgraphs whose segment map references the given manifest.
   *
   * @param {Object} manifestId - The manifest identifier to search for
   * @returns {Array<Object>} Matching playgraph sessions
   * @private
   */
  findPlaygraphsForManifest(manifestId) {
    return this.playgraphItems
      .filter((entry) => {
        let current = entry.segmentMap;
        while (current.previousValue) {
          current = current.previousValue;
        }
        const segments = current.segmentMap;
        return Object.keys(segments.segments).some(
          (key) => segments.segments[key].manifestId === manifestId
        );
      })
      .map((entry) => entry.segmentMap);
  }

  /**
   * Aggregates streaming capabilities across all playgraph sessions.
   *
   * @returns {Object} Aggregated capability data
   * @private
   */
  getStreamingCapabilities() {
    const aggregator = new BandwidthAggregator();

    this.playgraphItems.forEach((entry) => {
      const playgraph = entry.segmentMap;
      const weight = entry.weightFraction;
      const capabilities = playgraph.getStreamingCapabilities();
      capabilities.priority = weight;
      aggregator.item(playgraph.id, capabilities);
    });

    return aggregator;
  }

  /**
   * Returns the buffer limits (delegates to lazily cached getter).
   *
   * @returns {Object} Buffer limit configuration
   * @private
   */
  getBufferLimits() {
    return this.bufferLimits;
  }

  /**
   * Computes buffer limits from the current buffer size map and config.
   *
   * @returns {Object} Object with total limits per media type and additional constraints
   * @private
   */
  computeBufferLimits() {
    const additionalLimits = BufferLimitCalculator(this.config, this.bufferSizeMap);

    return {
      total: {
        [MediaType.VIDEO]: this.bufferSizeMap.videoBufferedSegments || Infinity,
        [MediaType.AUDIO]: this.bufferSizeMap.audioBufferedSegments || Infinity,
        [MediaType.TEXT_MEDIA_TYPE]: this.bufferSizeMap.TEXT_MEDIA_TYPE || Infinity,
        total: this.bufferSizeMap.total || Infinity,
      },
      additionalLimits,
    };
  }

  /**
   * Notifies the task scheduler and buffer limiter that a request has started.
   *
   * @param {Object} requestInfo - Information about the started request
   * @private
   */
  onRequestStart(requestInfo) {
    this.taskScheduler.onRequestStart(requestInfo);
    this.bufferLimiterInstance?.onRequestStart(requestInfo);
  }

  /**
   * Notifies the task scheduler that a request has completed.
   *
   * @param {Object} requestInfo - Information about the completed request
   * @private
   */
  onRequestComplete(requestInfo) {
    this.taskScheduler.onRequestComplete(requestInfo);
  }

  /**
   * Recalculates weight fractions for all playgraph items based on their
   * individual weights relative to the total.
   * @private
   */
  updatePlaygraphWeights() {
    const totalWeight = this.playgraphIdList.reduce(
      (sum, entry) => Math.max(entry.weight, 0) + sum,
      0
    );

    this.playgraphItems.forEach((entry) => {
      entry.weightFraction =
        entry.segmentMap.weight <= 0 ? 0 : entry.segmentMap.weight / totalWeight;
    });
  }

  /**
   * Handles the requestsPruned event by notifying the buffer limiter and
   * triggering a scheduling opportunity.
   *
   * @param {Object} event - The pruning event with a requests array
   * @private
   */
  onRequestsPruned(event) {
    if (!this.bufferLimiterInstance) {
      return;
    }

    event.requests.forEach((request) => {
      this.bufferLimiterInstance.onRequestComplete(request);
    });

    this.pendingSegmentRequests.forEach((entry) => {
      entry.viewableSession?.resumePausedRequests();
    });

    this.taskScheduler.scheduleOpportunity('prunedRequest');
  }

  /**
   * Applies media source extension overrides to a player config.
   *
   * @param {Object} playerConfig - The player configuration
   * @returns {Object} Extended config with MSE overrides
   * @private
   */
  applyMediaSourceExtensions(playerConfig) {
    const overrides = {};
    if (!playerConfig.sharedMse && this.mediaSourceExtensions) {
      overrides.sharedMse = { value: this.mediaSourceExtensions };
    }
    return Object.create(playerConfig, overrides);
  }

  /**
   * Initializes the event processing pipeline with all engine-level processors.
   * @private
   */
  initializeEventProcessingPipeline() {
    this.eventProcessingPipeline = new EventProcessingPipeline(this.config, this.console);

    this.eventProcessingPipeline.addHandler(new EngineEventProcessor(this));
    this.eventProcessingPipeline.addHandler(
      new NetworkChangeProcessor(this.networkMonitor, this.taskScheduler)
    );
    this.eventProcessingPipeline.addHandler(
      new SessionTraceProcessor(
        this.networkMonitor,
        this.config.enableSessionTraceSummaryEndplay
      )
    );

    // Register diagnostics tracers as event processor adapters
    this.eventProcessingPipeline.addHandler(new EventProcessorAdapter(this.sessionMetrics));
    this.eventProcessingPipeline.addHandler(
      new EventProcessorAdapter(this.taskScheduler.requestProcessor)
    );
    this.eventProcessingPipeline.addHandler(
      new EventProcessorAdapter(this.engineEventEmitter.diagnosticsTracer)
    );
    this.eventProcessingPipeline.addHandler(
      new EventProcessorAdapter(this.underflowHandler.diagnosticsTracer)
    );
    this.eventProcessingPipeline.addHandler(
      new EventProcessorAdapter(this.currentConfigProvider.diagnosticsTracer, {
        includeOnResume: false,
      })
    );

    if (this.bufferLimiterInstance) {
      this.eventProcessingPipeline.addHandler(
        new EventProcessorAdapter(this.bufferLimiterInstance.diagnosticsTracer)
      );
    }
  }

  /**
   * Notification callback for ASE exceptions (no-op placeholder for side-channel use).
   * @private
   */
  notifyAseException() {
    // Intentional no-op — used as callback reference for side-channel configs
  }
}

export { AsejsEngine };
