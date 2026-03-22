/**
 * @module MediaPipelineFactory
 * @description Factory function that creates the appropriate media pipeline for a given segment.
 * If the segment is a padding/filler viewable (e.g., interstitial), creates a lightweight
 * PaddingMediaPipeline. Otherwise, creates a full ContentMediaPipeline with all subsystems
 * (events, quality selection, scheduling, etc.).
 *
 * @original Module_70842
 */

// import { PADDING_VIEWABLE_ID } from '...'; // Module 79048
// import { PaddingMediaPipeline } from '...'; // Module 10943
// import { ContentMediaPipeline } from '...'; // Module 1552
// import { PaddingMediaSource } from '...';   // Module 25813

/**
 * Creates a media pipeline appropriate for the given segment context.
 *
 * @param {Object} context - Pipeline creation context.
 * @param {Object} context.config - Player configuration.
 * @param {Object} context.console - Logger/console instance.
 * @param {Object} context.G2a - Media source helper with segment-feeding capability.
 * @param {Object} context.currentSegment - The current playback segment descriptor.
 * @param {Object} context.events - Event emitter for pipeline events.
 * @param {Object} context.e3 - Media element reference.
 * @param {Object} context.ar - Audio/video renderer.
 * @param {Object} context.qualityDescriptor - Quality/bitrate descriptor.
 * @param {Object} context.currentPlayer - Current player instance.
 * @param {Object} context.playgraphState - Playgraph state manager.
 * @param {Object} context.branchScheduler - Branch scheduler for multi-branch playback.
 * @param {Object} context.LC - Lifecycle controller.
 * @param {Object} context.engineScheduler - Engine scheduler.
 * @returns {Object} A media pipeline instance (either padding or full content pipeline).
 */
export function createMediaPipeline(context) {
  const {
    config,
    console: logger,
    G2a: mediaSourceHelper,
    currentSegment,
    events,
    e3: mediaElement,
    ar: renderer,
    qualityDescriptor,
    currentPlayer,
    playgraphState,
    branchScheduler,
    LC: lifecycleController,
    engineScheduler,
  } = context;

  // Padding viewable: lightweight pipeline for filler/interstitial content
  if (currentSegment.J === PADDING_VIEWABLE_ID && config.hasPaddingMedia) {
    const paddingSource = new PaddingMediaPipeline(
      currentSegment.J,
      config.paddingMediaType
    );
    return new PaddingMediaSource(
      logger,
      currentSegment,
      qualityDescriptor,
      mediaSourceHelper.feedSegment.bind(mediaSourceHelper),
      paddingSource,
      config
    );
  }

  // Full content pipeline
  return new ContentMediaPipeline(
    config,
    logger,
    events,
    currentSegment,
    mediaElement,
    renderer,
    qualityDescriptor,
    currentPlayer,
    mediaSourceHelper.feedSegment.bind(mediaSourceHelper),
    playgraphState,
    branchScheduler,
    lifecycleController,
    engineScheduler
  );
}
