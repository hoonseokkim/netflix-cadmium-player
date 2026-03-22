/**
 * Netflix Cadmium Player - Media Events Manager
 *
 * Manages live ad-insertion media events for streaming playback. Handles
 * scheduling, triggering, elapsed tracking, and skip logic for server-side
 * inserted advertisements during live streaming.
 *
 * This is one of the largest and most complex managers in the player,
 * coordinating between the playgraph scheduler, media events store,
 * ad break detection, and the branch scheduler for timing.
 *
 * @module events/MediaEventsManager
 */

/**
 * Manages media events (ads, breaks, Netflix-specific triggers) within
 * a live streaming playgraph.
 *
 * Key responsibilities:
 * - Processes viewable media event stores
 * - Schedules and triggers media events based on playback position
 * - Handles event skip logic for buffered content
 * - Coordinates with the branch scheduler for timing
 * - Emits mediaEventReceived/Triggered/Elapsed/Cancelled events
 */
export class MediaEventsManager {
  /**
   * @param {Object} playgraph - The playgraph controller.
   * @param {Object} pendingSegmentRequests - Tracks in-flight segment requests.
   * @param {Object} config - Player configuration.
   * @param {Object} console - Logging console.
   */
  constructor(playgraph, pendingSegmentRequests, config, console) {
    /** @type {Object} */
    this.playgraph = playgraph;
    /** @type {Object} */
    this.pendingSegmentRequests = pendingSegmentRequests;
    /** @type {Object} */
    this.config = config;
    /** @type {Object} */
    this.events = new EventEmitter();
    /** @type {Object} */
    this.console = console;

    /** @private */
    this._branchScheduler = this.playgraph.branchScheduler;
    /** @private */
    this._viewableWatcher = new ClockWatcher();
    /** @private */
    this._clockAdjustWatcher = new ClockWatcher();
    /** @private */
    this._eventTracker = new MediaEventTracker();
  }

  /**
   * Whether the media events feature is enabled.
   * @type {boolean}
   */
  get enabled() {
    return this.config.enableLiveAdPlaygraphs;
  }

  /**
   * Processes a newly received viewable, setting up event listeners for
   * media events, ad breaks, and model updates.
   *
   * @param {Object} viewable - The viewable to process.
   */
  onViewableReceived(viewable) {
    if (!this.enabled || !viewable.isAdPlaygraph) return;

    const store = viewable.mediaEventsStore;
    if (!store) return;

    // Emit already-existing media events
    store.store.mediaEventsList.forEach((event) => {
      this.events.emit('mediaEventReceived', {
        id: event.id,
        applicationScope: event.applicationScope,
        category: event.category,
        payload: event.payload,
      });
    });

    // Listen for new events
    this._viewableWatcher.addListener(
      store.events,
      'netflixEventReceived',
      (event) => {
        this.events.emit('mediaEventReceived', {
          id: event.id,
          applicationScope: event.applicationScope,
          category: event.category,
          payload: event.payload,
        });
      }
    );

    // Listen for cancelled events
    this._viewableWatcher.addListener(
      store.events,
      'netflixEventCancelled',
      (event) => {
        const cancelledData = {
          id: event.id,
          applicationScope: event.applicationScope,
          durationMs: event.duration.playbackSegment,
          category: event.category,
          payload: event.payload,
          timestamp: Date.now(),
        };
        this.events.emit('mediaEventCancelled', cancelledData);
        this._eventTracker.recordCancelled(cancelledData);
        this._scheduledTask?.reschedule();
      }
    );

    // Listen for model updates (ad breaks, netflix events)
    this._viewableWatcher.addListener(
      store.events,
      'modelUpdated',
      (update) => {
        if (
          update.updatedTypes.has('breakstart') ||
          update.updatedTypes.has('adbreak') ||
          update.updatedTypes.has('breakend')
        ) {
          this.events.emit('adsUpdated', {
            viewable,
            updateTimestamp: update.timestamp,
          });
        }

        if (update.updatedTypes.has('netflix')) {
          this._scheduledTask?.reschedule();
        }
      }
    );

    // Listen for progress updates
    this._viewableWatcher.addListener(
      store.events,
      'progress',
      (progress) => {
        if (!this._skipTask) return;
        this.events.emit('mediaEventsProgress', {
          viewable,
          segmentEndTime: progress.segmentEndTime,
        });
      }
    );

    // React to clock changes by restarting the media events task
    if (viewable.isAdPlaygraph) {
      this._viewableWatcher.on(this._branchScheduler, 'clockChanged', () => {
        this._clockAdjustWatcher.clear();
        this._clockAdjustWatcher.on(
          this._branchScheduler.playerCore,
          'clockAdjusted',
          (adj) => {
            if (adj.reason === 'skipped') {
              this._scheduledTask?.reschedule();
            }
          }
        );
        this._scheduledTask?.reschedule();
      });

      this._scheduledTask = this._branchScheduler.createScheduledTask(
        () => this._processMediaEvents(viewable),
        'media-events-scheduler'
      );
    }
  }

  /**
   * Handles position updates, destroying skip tasks on seek.
   *
   * @param {Object} viewable - The active viewable.
   * @param {Object} position - The new position.
   */
  updatePosition(viewable, position) {
    if (this._skipTask) this._destroySkipTask();
    this._checkSeekPosition(viewable, position);
  }

  /**
   * Returns ad container descriptors for the given viewable.
   *
   * @param {Object} viewable - The viewable to get ads for.
   * @returns {Array<Object>|undefined} Ad container descriptors.
   */
  getAdsContainers(viewable) {
    if (!this.enabled) return undefined;

    const store = viewable.mediaEventsStore;
    if (!store) return undefined;

    return (store.store.adBreaks || []).map((adBreak) => ({
      timeValue: adBreak.timeValue,
      location: adBreak.location,
      locationMs: adBreak.location.playbackSegment,
      enabled: viewable.isAuxiliary
        ? adBreak.breakType === 'BreakStart'
        : true,
      duration: adBreak.duration,
      type: 'embedded',
      breakType: adBreak.breakType,
      hydrationMetadata: adBreak.hydrationMetadata,
      source: 'mediaEvents',
    }));
  }

  /**
   * Tears down the manager, releasing all listeners and tasks.
   */
  destroy() {
    if (this._skipTask) this._destroySkipTask();
    this._clockAdjustWatcher.clear();
    this._viewableWatcher.clear();
    this._eventTracker.reset();
  }

  /**
   * Opens (triggers) a media event.
   *
   * @private
   * @param {Object} viewable - The active viewable.
   * @param {Object} event - The media event to open.
   */
  _openMediaEvent(viewable, event) {
    this._currentEvent = event;

    const triggerData = {
      id: event.id,
      applicationScope: event.applicationScope,
      eventDelay: this._calculateEventDelay(viewable, event.timeValue),
      duration: event.duration.playbackSegment,
      category: event.category,
      payload: event.payload,
      timestamp: Date.now(),
    };

    this.events.emit('mediaEventTriggered', triggerData);
    this._eventTracker.recordTriggered(triggerData);
  }

  /**
   * Closes (elapses) a media event.
   *
   * @private
   * @param {Object} viewable - The active viewable.
   * @param {Object} event - The media event to close.
   */
  _closeMediaEvent(viewable, event) {
    this._currentEvent = undefined;

    const endTime = event.timeValue.add(event.duration);
    const elapsedData = {
      id: event.id,
      applicationScope: event.applicationScope,
      eventDelay: this._calculateEventDelay(viewable, endTime),
      timestamp: Date.now(),
    };

    this.events.emit('mediaEventElapsed', elapsedData);
    this._eventTracker.recordElapsed(elapsedData);
  }

  /**
   * Destroys the active skip task.
   * @private
   */
  _destroySkipTask() {
    this._skipTask?.destroy();
    this._skipTask = undefined;
    this._skipOffset = undefined;
  }
}
