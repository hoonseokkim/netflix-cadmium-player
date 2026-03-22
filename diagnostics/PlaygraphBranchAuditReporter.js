/**
 * Netflix Cadmium Player - Playgraph Branch Audit Reporter
 *
 * Diagnostic reporter that collects branch statistics and decision data
 * from the playgraph (interactive/branching content) system. Emits an
 * audit snapshot on underflow or end-of-playback events.
 *
 * @module diagnostics/PlaygraphBranchAuditReporter
 */

/**
 * Reports playgraph branch audit data at the end of playback or on underflow.
 * Tracks branch count statistics and serializes branch state for diagnostics.
 */
export class PlaygraphBranchAuditReporter {
  /**
   * @param {Map} branchMap - Map of branch ID to branch data.
   * @param {Object} playgraph - The playgraph instance with events, decisions, and player state.
   */
  constructor(branchMap, playgraph) {
    /** @type {Map} */
    this.branchMap = branchMap;
    /** @type {Object} */
    this.playgraph = playgraph;
    /** @type {Object} Running statistics on branch count over time */
    this.branchCountStats = new RunningStat();

    playgraph.events.on('branchesReevaluated', () => {
      this.branchCountStats.push(branchMap.size);
    });
  }

  /** @returns {string} The reporter name */
  get name() {
    return 'playgraph-branch-audit';
  }

  /** @returns {string} Short identifier for log tagging */
  get shortName() {
    return 'paudit';
  }

  /** @returns {boolean} Whether this reporter is enabled (follows debug flag) */
  get enabled() {
    return DEBUG;
  }

  /**
   * Serializes branch audit data on underflow or end-of-playback events.
   *
   * @param {Object} event - The playback event.
   * @param {string} event.eventType - The event type identifier.
   * @returns {Object|undefined} Audit snapshot or undefined if not relevant.
   */
  deserialize({ eventType }) {
    if (eventType === 'underflow' || eventType === 'endPlayback') {
      const snapshot = {
        branchCountStats: this.branchCountStats.toJSON(),
        decisions: this.playgraph.decisions.toJSON(),
        player: this.playgraph.player.hasPlayingContent
          ? this.playgraph.player.branches.map(
              (branch) => branch.currentSegment.id
            )
          : [],
      };

      this.branchMap.forEach((branch, branchId) => {
        const branchSnapshot = getBranchSnapshot(branch);
        snapshot[branchId] = {
          probabilities: branch.probabilities.map((prob) => ({
            duration: prob.duration,
            immediate: prob.immediate,
            seamless: prob.seamless,
          })),
          parent: branch.parent?.currentSegment.id,
          normalized: branch.isPlaybackActive,
          hasViewable: branch.hasViewable,
          headerRequested:
            branch.hasViewable && branch.viewableSession.headerRequested,
          ...branchSnapshot,
        };
      });

      return snapshot;
    }
  }
}
