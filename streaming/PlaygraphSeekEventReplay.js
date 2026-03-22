/**
 * @module PlaygraphSeekEventReplay
 * @description Handles replaying prefetched playgraph events after a seek
 * operation. When the user seeks, some prefetched events may no longer be
 * valid; this module discards stale events and replays the remaining ones
 * at the new seek position.
 * @origin Module_34297
 */

import { debugEnabled } from '../utils/DebugFlags.js';
import { formatPosition } from '../utils/PositionFormatter.js';

/**
 * Manages the replay of prefetched playgraph events after a seek.
 */
export class PlaygraphSeekEventReplay {
  /**
   * Sets up a one-time seek listener that discards invalid prefetched events
   * and replays the remaining ones at the new seek position.
   *
   * @param {Object} player - Player event emitter with `.events.once()`
   * @param {*} originalSeekPosition - The original seek target position
   * @param {Object} eventQueue - Queue of prefetched playgraph events
   * @param {Function} eventQueue.filter - Filters events by predicate
   * @param {Function} eventQueue.replay - Replays remaining events
   * @param {Function} eventQueue.destroy - Destroys the queue
   * @param {number} eventQueue.length - Current queue length
   * @param {Object} logger - Logger instance
   */
  static attachSeekHandler(player, originalSeekPosition, eventQueue, logger) {
    player.events.once('seeking', (seekEvent) => {
      const newPosition = seekEvent.position;
      const originalLength = eventQueue.length;

      if (!seekEvent.duplicate) {
        // Discard events that are not "segmentNormalized" type
        eventQueue.filter((event) => event.eventType !== 'segmentNormalized');

        if (debugEnabled) {
          logger.log(
            `Discarding ${originalLength - eventQueue.length} events from prefetched playgraph` +
            ` for original seek position ${formatPosition(originalSeekPosition)}` +
            ` due to seek to ${formatPosition(newPosition)}`
          );
        }
      }

      if (debugEnabled) {
        logger.log(
          `Replaying ${eventQueue.length} events from prefetched playgraph` +
          `for seek position ${formatPosition(newPosition)}`
        );
      }

      eventQueue.replay();
      eventQueue.destroy();
    });
  }
}
