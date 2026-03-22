/**
 * Netflix Cadmium Player - Live Branch Appender
 *
 * Determines when to append the next branch segment during live playback.
 * Handles timing logic for transitions between content and ad break segments,
 * ensuring branches are appended at the right moment relative to the live edge.
 *
 * @module live/LiveBranchAppender
 */

/**
 * Controls the timing of branch appending during live stream playback.
 *
 * Uses the playgraph's segment graph and live edge constraints to determine
 * whether to append immediately, wait for a player-timed trigger, or use
 * "panic" mode for urgent appends.
 */
export class LiveBranchAppender {
  /**
   * @param {Object} playgraph - The playgraph instance for segment lookups.
   * @param {Object} console - Scoped console logger.
   */
  constructor(playgraph, console) {
    /** @type {Object} */
    this.playgraph = playgraph;
    /** @type {Object} */
    this.console = console;
  }

  /**
   * Create a "panic" schedule that triggers branch appending immediately
   * or after a timed delay.
   *
   * @param {Object} delay - Time value for the delay. If negative, appends immediately.
   * @returns {Object} Schedule with `trigger` and `reason` fields.
   */
  panic(delay) {
    if (delay.lessThan(TimeUtil.ZERO)) {
      return {
        trigger: { type: 'immediate' },
        reason: 'Invoking Panic',
      };
    }
    return {
      trigger: { type: 'player', when: ScheduleDelay.fromTime(delay) },
      reason: 'Panic',
    };
  }

  /**
   * Determine when to append the next branch segment during live playback.
   *
   * Decision tree:
   * 1. Not live or multi-choice -> no action
   * 2. No media events store -> immediate append
   * 3. Transition from adBreak to content -> immediate
   * 4. Like-to-like non-adBreak transitions -> immediate
   * 5. Successor beyond live edge -> immediate
   * 6. Within JIT distance -> panic mode
   * 7. Otherwise -> wait until calculated player position
   *
   * @param {Object} branch - The current branch being played.
   * @param {boolean} isMultiChoice - Whether the current segment has multiple choices.
   * @returns {Object} Schedule with optional `trigger` and `reason`.
   */
  handleBranchAppending(branch, isMultiChoice) {
    const viewableSession = branch.viewableSession;

    if (!viewableSession.isAdPlaygraph || isMultiChoice) {
      return { reason: 'not live or multi-choice' };
    }

    if (!viewableSession.mediaEventsStore) {
      return {
        reason: 'no media events store',
        trigger: { type: 'immediate' },
      };
    }

    const liveEdgeInfo = viewableSession.networkState.liveEdgeConstraints;
    const defaultNextId = this.playgraph.workingPlaygraph.key(
      branch.currentSegment.id
    )?.defaultNext;
    const successorNode = this.playgraph.workingPlaygraph.key(defaultNextId);

    if (!successorNode) {
      return { reason: 'successor not found' };
    }

    // Immediate for adBreak -> content transitions
    if (
      branch.currentSegment.type !== successorNode.type &&
      branch.currentSegment.type === 'adBreak'
    ) {
      return {
        trigger: { type: 'immediate' },
        reason: 'transition from adBreak',
      };
    }

    // Immediate for like-to-like non-adBreak transitions
    if (
      branch.currentSegment.type === successorNode.type &&
      branch.currentSegment.type !== 'adBreak'
    ) {
      return {
        trigger: { type: 'immediate' },
        reason: 'transition to like segments',
      };
    }

    // Calculate time until successor ends relative to live edge
    const timeToLiveEdge = successorNode.endTime
      .subtract(branch.segmentEndTime)
      .add(branch.previousState)
      .subtract(liveEdgeInfo.appendingConstraint);

    const config = this.playgraph.config;
    const playerPosition = this.playgraph.setPosition.add(timeToLiveEdge);
    const jitDistance = branch.previousState.subtract(
      TimeUtil.fromMilliseconds(config.jitBranchAppendingDistance)
    );

    if (successorNode.offset.isFinite()) {
      if (timeToLiveEdge.lessThan(TimeUtil.ZERO)) {
        return {
          trigger: { type: 'immediate' },
          reason: 'successor end beyond live edge end',
        };
      }

      if (jitDistance.lessThan(playerPosition)) {
        return this.panic(jitDistance);
      }

      return {
        trigger: {
          type: 'player',
          when: ScheduleDelay.fromTime(playerPosition),
        },
        reason: 'waiting till live edge beyond successor end',
      };
    }

    return {
      ...this.panic(jitDistance),
      reason: 'successor not finite',
    };
  }
}
