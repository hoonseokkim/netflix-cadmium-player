/**
 * Netflix Cadmium Player -- Video Sync Instance Factory
 *
 * Injectable factory that creates VideoSyncInstance objects for each
 * playback session. Depends on the media factory, player config,
 * player core, application clock, and a child tracker factory.
 *
 * The `create()` method instantiates a VideoSyncInstance by first
 * creating a child sync tracker and then composing all dependencies.
 *
 * @module player/VideoSyncInstanceFactory
 * @original Module_26158
 * @injectable
 */

// import { __decorate, __param } from 'tslib';                        // Module 22970
// import { injectable, inject } from './DependencyInjection';          // Module 22674
// import { oq as MediaFactoryToken } from './LogBatcherSymbols';       // Module 45118
// import { w7 as VideoSyncTrackerFactoryToken } from './SyncTokens';   // Module 98326
// import { ConfigToken } from './Config';                              // Module 4203
// import { PlayerCoreToken } from './PlayerCore';                      // Module 30869
// import { ClockToken } from './Clock';                                // Module 81918
// import { z7 as VideoSyncInstance } from './VideoSyncInstance';       // Module 99400

/**
 * Factory for creating VideoSyncInstance objects.
 *
 * Injected dependencies (via IoC decorators):
 *   0: mediaFactory   (MediaFactoryToken - Module 45118)
 *   1: config         (ConfigToken - Module 4203)
 *   2: playerCore     (PlayerCoreToken - Module 30869)
 *   3: clock          (ClockToken - Module 81918)
 *   4: trackerFactory (VideoSyncTrackerFactoryToken - Module 98326)
 */
export class VideoSyncInstanceFactory {
  /**
   * @param {Object} mediaFactory - Factory for accessing media elements.
   * @param {Object} config - Player configuration.
   * @param {Object} playerCore - Core player reference.
   * @param {Object} clock - Application clock for A/V sync timestamps.
   * @param {Object} trackerFactory - Factory for creating sync tracker sub-components.
   */
  constructor(mediaFactory, config, playerCore, clock, trackerFactory) {
    /** @private */
    this.mediaFactory = mediaFactory;
    /** @private */
    this.config = config;
    /** @private */
    this.playerCore = playerCore;
    /** @private */
    this.clock = clock;
    /** @private */
    this._trackerFactory = trackerFactory;
  }

  /**
   * Creates a new VideoSyncInstance for a playback session.
   *
   * @param {Object} session - The playback session context.
   * @param {Object} mediaElement - The HTMLMediaElement being synchronized.
   * @param {Object} scheduler - The task scheduler for timed operations.
   * @param {Object} options - Additional synchronization options.
   * @returns {VideoSyncInstance} A configured video sync instance.
   */
  create(session, mediaElement, scheduler, options) {
    const tracker = this._trackerFactory.create(session, mediaElement);
    return new VideoSyncInstance(
      session,
      mediaElement,
      scheduler,
      options,
      this.mediaFactory,
      this.config,
      this.clock,
      tracker
    );
  }
}
