/**
 * Netflix Cadmium Player — MemoryDeadlockProtector
 *
 * Prevents memory deadlocks during playback by monitoring buffer memory
 * utilisation across audio, video, and text media types. When memory
 * usage exceeds a configurable threshold and pre-buffering requirements
 * are not yet met, the protector evicts discontiguous (non-playing)
 * branches from the buffer to free space.
 *
 * The algorithm:
 *   1. Check whether the player already has enough pre-buffer to play.
 *   2. If not, check memory utilisation against the configured max.
 *   3. If utilisation exceeds `memDeadlockOverageThreshold`, iterate
 *      over discontiguous branches (sorted by priority) and reset them,
 *      tallying freed bytes until enough space is reclaimed.
 *
 * @module buffer/MemoryDeadlockProtector
 */

// import { __values, __decorate } from 'tslib';
// import { DEBUG } from '../modules/Module_48170';
// import { sortByPriority } from '../modules/Module_62629';
// import { MediaType } from '../modules/Module_65161';
// import { SessionMetricsClass, consoleLogger } from '../modules/Module_61996';

export class MemoryDeadlockProtector {
  /**
   * @param {Function} getMemoryLimits       - Returns `{ total: { V, U, TEXT } }` memory limits.
   * @param {Function} getCurrentMemoryUsage - Returns current memory usage per media type.
   * @param {Object}   logger                - Console/debug logger.
   */
  constructor(getMemoryLimits, getCurrentMemoryUsage, logger) {
    /** @private */
    this.getMemoryLimits = getMemoryLimits;
    /** @private */
    this.getCurrentMemoryUsage = getCurrentMemoryUsage;
    /** @private */
    this.console = logger;

    /** @type {SessionMetricsClass} Diagnostics tracer. */
    this.diagnosticsTracer = new SessionMetricsClass({
      instance: this,
      console: logger,
      source: 'MemoryDeadlockProtector',
      sampleInterval: 5,
    });
  }

  /**
   * Evaluate whether the player can continue buffering, or whether
   * branches need to be evicted to free memory.
   *
   * @param {Object} state - Current playback/buffer state.
   * @returns {{ canContinue: boolean, freedBytes?: Array }}
   */
  checkForDeadlock(state) {
    const config = state.config;
    const minPrebufferMs =
      config.minPrebufSize + (config.timedTextConfig?.playbackSegment ?? 0);

    const hasEnoughBuffer = this._hasEnoughBuffer(minPrebufferMs, state);

    if (DEBUG) {
      this.console.debug(`MDP: has prebuf: ${hasEnoughBuffer}`);
    }

    if (hasEnoughBuffer) {
      return { canContinue: true };
    }

    const { overagePerType, utilisationRatio } = this._computeMemoryOverage(config);

    if (!overagePerType || !utilisationRatio) {
      return { canContinue: false };
    }

    if (DEBUG) {
      this.console.debug(`MDP: utilizing ${Math.round(100 * utilisationRatio)}%`);
    }

    if (utilisationRatio >= config.memDeadlockOverageThreshold) {
      return this._resetDiscontiguousBranches(state, overagePerType);
    }

    return { canContinue: true };
  }

  /**
   * Evict discontiguous branches to free memory.
   *
   * @private
   * @param {Object} state        - Playback state.
   * @param {Array}  overagePerType - Per-media-type overage info.
   * @returns {{ canContinue: boolean, freedBytes: Array }}
   */
  _resetDiscontiguousBranches(state, overagePerType) {
    this.diagnosticsTracer.emitDiagnosticEvent({ overage: overagePerType });

    const player = state.player;
    const allBranches = state.branches;
    let playerBranches = player.branches;
    let currentTrack = player.currentTrackInfo;

    // Find the first branch that has no more segments (end of track)
    for (let i = 0; i < playerBranches.length; i++) {
      if (!playerBranches[i].hasMoreSegments) {
        currentTrack = playerBranches[i];
        playerBranches = playerBranches.slice(0, i + 1);
        break;
      }
    }

    let freedEnough = false;
    const freedBytes = [
      { mediaType: MediaType.VIDEO, bytes: 0 },
      { mediaType: MediaType.AUDIO, bytes: 0 },
      { mediaType: MediaType.TEXT, bytes: 0 },
    ];

    if (!currentTrack?.hasMoreSegments) {
      // Sort discontiguous branches by priority and evict
      const candidates = allBranches
        .slice()
        .filter((branch) => playerBranches.indexOf(branch) === -1)
        .sort((a, b) => sortByPriority(a) - sortByPriority(b));

      for (const branch of candidates) {
        const bufferStatus = branch.getBufferStatus();

        freedBytes[MediaType.VIDEO].bytes += bufferStatus.audioBufferedBytes ?? 0;
        freedBytes[MediaType.AUDIO].bytes += bufferStatus.videoBufferedBytes ?? 0;

        if (DEBUG) {
          this.console.debug(
            `Resetting discontiguous branch ${branch.currentSegment.id}`,
            bufferStatus
          );
        }

        branch.reset();

        freedEnough = freedBytes.every(
          (entry) => entry.bytes >= overagePerType[entry.mediaType].bytes
        );

        if (freedEnough) break;
      }
    }

    return {
      canContinue: freedEnough,
      freedBytes,
    };
  }

  /**
   * Compute per-media-type memory overage.
   *
   * @private
   * @param {Object} config
   * @returns {{ utilisationRatio: number, overagePerType: Array|undefined }}
   */
  _computeMemoryOverage(config) {
    const mediaTypes = [MediaType.VIDEO, MediaType.AUDIO, MediaType.TEXT];

    if (!config.memDeadlockShouldCheckMemory) {
      return {};
    }

    const currentUsage = this.getCurrentMemoryUsage();
    const limits = this.getMemoryLimits().total;
    const maxUtilisation = config.memDeadlockMaxUtilizationPercentage;
    let peakUtilisation = 0;

    const overagePerType = mediaTypes.map(function (mediaType) {
      const overage = currentUsage[mediaType] - limits[mediaType] * maxUtilisation;
      peakUtilisation = Math.max(
        limits[mediaType] > 0 ? currentUsage[mediaType] / limits[mediaType] : 0,
        peakUtilisation
      );
      return {
        bytes: Math.max(0, overage),
        mediaType,
      };
    });

    return {
      utilisationRatio: peakUtilisation,
      overagePerType,
    };
  }

  /**
   * Check whether the player already has enough buffered content
   * to satisfy the minimum pre-buffer requirement.
   *
   * @private
   * @param {number} minPrebufferMs - Minimum pre-buffer in milliseconds.
   * @param {Object} state          - Playback state.
   * @returns {boolean}
   */
  _hasEnoughBuffer(minPrebufferMs, state) {
    const self = this;
    let result = false;

    const player = state.hasStarted ? state.player : undefined;

    if (player?.isReadyToPlay) {
      const activeMediaTypes = player.trackManager
        .getActiveTracks()
        .map((t) => t.mediaType);

      const bufferStatus = player.getBufferLevels();

      result = activeMediaTypes.every(function (mediaType) {
        let bufferedMs;

        if (mediaType === MediaType.VIDEO) {
          bufferedMs = bufferStatus.audioBufferedMs ?? 0;
        } else if (mediaType === MediaType.AUDIO) {
          bufferedMs = bufferStatus.videoBufferedMs ?? 0;
        } else {
          if (DEBUG) {
            self.console.pauseTrace('hasEnoughBuffer ignoring mediaType:', mediaType);
          }
          return true;
        }

        return bufferedMs >= minPrebufferMs;
      });
    }

    return result;
  }
}
