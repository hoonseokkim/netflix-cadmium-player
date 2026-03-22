/**
 * Netflix Cadmium Player -- Video Sync Factory
 *
 * Factory that creates video synchronization instances. Each sync instance
 * monitors A/V sync for a specific playback session, using the media factory,
 * configuration, clock, and a child factory for detailed sync tracking.
 *
 * @module player/VideoSyncFactory
 * @original Module_27134
 * @injectable
 */

// import { __decorate, __param } from 'tslib';                    // Module 22970
// import { injectable, inject } from './DependencyInjection';      // Module 22674
// import { oq as MediaFactoryToken } from './LogBatcherSymbols';   // Module 45118
// import { w7 as VideoSyncTrackerFactoryToken } from './Tokens';   // Module 98326
// import { ConfigToken } from './Config';                          // Module 4203
// import { PlayerCoreToken } from './PlayerCore';                  // Module 30869
// import { ClockToken } from './Clock';                            // Module 81918
// import { z7 as VideoSyncInstance } from './VideoSyncInstance';   // Module 99400

/**
 * Injectable factory for creating VideoSync instances per playback session.
 *
 * Injected dependencies:
 *   - mediaFactory (MediaFactoryToken)
 *   - config (ConfigToken)
 *   - playerCore (PlayerCoreToken)
 *   - clock (ClockToken)
 *   - trackerFactory (VideoSyncTrackerFactoryToken)
 */
export class VideoSyncFactory {
  /**
   * @param {Object} mediaFactory - Factory for media element access.
   * @param {Object} config - Player configuration.
   * @param {Object} playerCore - Core player reference.
   * @param {Object} clock - Application clock for timestamp tracking.
   * @param {Object} trackerFactory - Factory for creating child sync trackers.
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
   * Creates a new VideoSync instance for a playback session.
   *
   * @param {Object} session - The playback session context.
   * @param {Object} mediaElement - The media element being synced.
   * @param {Object} scheduler - The task scheduler for timing.
   * @param {Object} options - Additional sync options.
   * @returns {VideoSyncInstance} A new video sync instance.
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
