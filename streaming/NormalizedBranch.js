/**
 * Netflix Cadmium Player - NormalizedBranch
 * Webpack Module 33928 (exported as `ZHa`)
 *
 * A normalized branch represents a single segment's streaming pipeline within
 * the playgraph. It extends BranchCallbackHandler to manage a collection of
 * per-media-type pipelines (audio, video, text), coordinating their creation,
 * normalization, cancellation, and buffer status reporting.
 *
 * "Normalization" refers to resolving relative segment timestamps into absolute
 * PTS (Presentation Timestamp) values, so that all media pipelines share a
 * consistent timeline. When a segment's start or end time changes, the branch
 * renormalizes — truncating pipelines and re-emitting events.
 *
 * Key responsibilities:
 * - Creates and manages per-media-type pipelines via the abstract `createPipelines()`
 * - Normalizes segment timestamps through a PipelineNormalizer
 * - Provides buffer level queries (buffer duration, buffer bytes, buffered end time)
 * - Responds to playgraph state changes to check buffering progress
 * - Handles segment updates that may require renormalization
 * - Emits branch lifecycle events: branchEdited, branchOffsetUpdated,
 *   requestComplete, lastRequestIssued, branchStreamingComplete, checkBufferingProgress
 *
 * Original obfuscated name: class `r` in Module 33928
 */

// Dependencies (commented out — resolved by the module bundler):
// import { __extends, __read, __awaiter, __generator } from './modules/Module_22970';  // tslib helpers
// import { TimeUtil, findLast } from './modules/Module_91176';                          // time utilities
// import { platform } from './modules/Module_66164';                                    // platform services
// import { laser, fVb as formatContentType } from './modules/Module_97685';             // telemetry / logging
// import { BranchCallbackHandler } from './modules/Module_81392';                       // base class (bP)
// import { MediaType, PlaybackState, timeSlice as isBufferingState } from './modules/Module_65161'; // media enums
// import { assert } from './modules/Module_52571';                                      // assertion utility
// import { PipelineCollection } from './modules/Module_32412';                          // vX — typed pipeline list
// import { eQb as computeTruncationPoints } from './modules/Module_99548';              // truncation helper
// import { mathTanh as createScopedConsole } from './modules/Module_69575';             // scoped console logger

export default function NormalizedBranchModule(t, b, a) {
  var tslib, TimeUtil, findLastUtil, platformModule, telemetry,
      baseModule, mediaEnums, assertModule, PipelineCollectionModule,
      normalizerHelpers, consoleFactory;

  /**
   * Sort comparator that places video pipelines before audio/text.
   * Video (MediaType.U) sorts to index 0; everything else sorts after.
   *
   * @param {Pipeline} a - First pipeline
   * @param {Pipeline} b - Second pipeline
   * @returns {number} Sort order (-1, 0, or 1)
   */
  function sortVideoFirst(a, b) {
    return (
      (a.mediaType === mediaEnums.MediaType.U ? 0 : 1) -
      (b.mediaType === mediaEnums.MediaType.U ? 0 : 1)
    );
  }

  Object.defineProperties(b, {
    __esModule: { value: true },
  });

  b.ZHa = b.h5b = undefined;

  // ── Module imports ──────────────────────────────────────────────────
  tslib = a(22970);
  TimeUtil = a(91176);
  findLastUtil = a(91176);
  platformModule = a(66164);
  telemetry = a(97685);
  baseModule = a(81392);
  mediaEnums = a(65161);
  assertModule = a(52571);
  PipelineCollectionModule = a(32412);
  normalizerHelpers = a(99548);
  consoleFactory = a(69575);

  /** Exported test/internal utilities */
  b.h5b = {
    lW: sortVideoFirst,
  };

  // ── NormalizedBranch class ──────────────────────────────────────────

  /**
   * @class NormalizedBranch
   * @extends BranchCallbackHandler
   *
   * Manages a collection of media pipelines (audio/video/text) for a single
   * segment within the playgraph. Handles normalization of timestamps,
   * buffering progress checks, and segment lifecycle events.
   */
  const NormalizedBranch = (function (_super) {
    /**
     * @constructor
     * @param {Object} manifest - Manifest/track information (contains `.tracks`, `.parent`, `.playgraphId`)
     * @param {Object} config - Streaming configuration
     * @param {string} logTag - Logging tag / component name
     * @param {Object} viewableSession - Current viewable session
     * @param {Object} segment - The segment being streamed (contains `.startTime`, `.endTime`, `.id`, `.J`)
     * @param {Object} viewableId - Viewable identifier (contains `.id`, `.type`, `.IYa`, `.xO`, `.J`)
     * @param {number|undefined} startTimeOverride - Optional override for the start time
     * @param {Object} pipelineFactory - Factory/config for creating pipelines
     * @param {Object} branchOffset - Initial branch offset (PTS offset for this branch)
     * @param {Function} currentPlayer - Returns the current playback position
     * @param {Object} playgraphState - Observable playback state (with addListener/removeListener)
     * @param {Object} events - Event emitter for branch events
     * @param {Object} branchScheduler - Scheduler for branch-level tasks
     */
    function NormalizedBranch(
      manifest, config, logTag, viewableSession, segment,
      viewableId, startTimeOverride, pipelineFactory,
      branchOffset, currentPlayer, playgraphState,
      events, branchScheduler
    ) {
      var parentBranch, result;
      result = _super.call(this, viewableSession) || this;

      result.manifest = manifest;
      result.config = config;
      result.viewableSession = viewableSession;
      result.segment = segment;
      result.viewableId = viewableId;
      result.branchOffset = branchOffset;
      result.currentPlayer = currentPlayer;
      result.playgraphState = playgraphState;
      result.events = events;
      result.branchScheduler = branchScheduler;

      /** @type {PipelineCollection} Collection of per-media-type pipelines */
      result.pipelines = new PipelineCollectionModule.vX([]);

      /** @type {boolean} Whether this branch has been cancelled */
      result.isCancelled = false;

      /** @type {boolean} Whether the first request has been issued (for telemetry) */
      result._hasLoggedFirstRequest = false;

      /** @type {number} Timestamp of the last buffering-complete check */
      result._lastBufferingCheckTime = 0;

      /** @type {Function} Bound handler for playgraph state changes */
      result._onPlaygraphStateChangeBound = result.onPlaygraphStateChange.bind(result);

      (0, assertModule.assert)(
        viewableSession.J === result.currentSegment.J ||
        (isNaN(viewableSession.J) && isNaN(result.currentSegment.J))
      );

      // Build a scoped console logger with the viewable ID tag
      var idTag = viewableId.id && viewableId.id.length ? '{' + viewableId.id + '}' : '';
      result.console = (0, consoleFactory.mathTanh)(platformModule.platform, logTag, idTag);

      // Resolve the effective start time
      result.startTime = startTimeOverride || result.currentSegment.startTime;

      // Capture the parent branch's previous state (for offset recalculation)
      parentBranch = result.parent;
      result._parentPreviousState = parentBranch?.previousState ?? undefined;

      // Subscribe to playgraph state changes
      result.playgraphState?.addListener(result._onPlaygraphStateChangeBound);

      // Create the media pipelines (abstract — implemented by subclasses)
      var createResult = result.createPipelines(pipelineFactory, result.startTime, !!parentBranch);
      result.ER = createResult.ER;

      return result;
    }

    tslib.__extends(NormalizedBranch, _super);

    // ── Computed properties ─────────────────────────────────────────

    /** @type {boolean} Whether this branch has been cancelled */
    Object.defineProperties(NormalizedBranch.prototype, {
      fd: {
        get: function () {
          return this.isCancelled;
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {Object} The viewable identifier */
    Object.defineProperties(NormalizedBranch.prototype, {
      K: {
        get: function () {
          return this.viewableId;
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {boolean} Whether any pipeline has pending initialization */
    Object.defineProperties(NormalizedBranch.prototype, {
      lUa: {
        get: function () {
          return this.pipelines.some(function (p) {
            return p.lUa;
          });
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {boolean} Whether all pipelines have flagged the last segment */
    Object.defineProperties(NormalizedBranch.prototype, {
      Pk: {
        get: function () {
          return this.pipelines.every(function (p) {
            return p.isLastSegmentFlag;
          });
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {boolean} Whether all pipelines still have more segments to fetch */
    Object.defineProperties(NormalizedBranch.prototype, {
      Dk: {
        get: function () {
          return this.pipelines.every(function (p) {
            return p.hasMoreSegments;
          });
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {number} Total segment count across all pipelines */
    Object.defineProperties(NormalizedBranch.prototype, {
      bL: {
        get: function () {
          return this.getSortedPipelines().reduce(function (sum, p) {
            return sum + p.segmentCount;
          }, 0);
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {boolean} Whether all pipelines are actively playing back */
    Object.defineProperties(NormalizedBranch.prototype, {
      ag: {
        get: function () {
          return this.getSortedPipelines().every(function (p) {
            return p.isPlaybackActive();
          });
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {Object} The manifest tracks */
    Object.defineProperties(NormalizedBranch.prototype, {
      oa: {
        get: function () {
          return this.manifest.tracks;
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {number} The timescale value from the primary pipeline */
    Object.defineProperties(NormalizedBranch.prototype, {
      O: {
        get: function () {
          return this.wr.timescaleValue;
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {Object} Content start ticks from the primary pipeline */
    Object.defineProperties(NormalizedBranch.prototype, {
      Cb: {
        get: function () {
          return this.wr.contentStartTicks;
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {Object} Content end ticks from the primary pipeline */
    Object.defineProperties(NormalizedBranch.prototype, {
      Pb: {
        get: function () {
          return this.wr.contentEndTicks;
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {number} Download state of the quality descriptor at the current timescale */
    Object.defineProperties(NormalizedBranch.prototype, {
      Xp: {
        get: function () {
          return this.qualityDescriptor.downloadState(this.timescaleValue).$;
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {Object} Start time item for the quality descriptor */
    Object.defineProperties(NormalizedBranch.prototype, {
      lI: {
        get: function () {
          return this.startTime.item(this.qualityDescriptor);
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {Object} Segment start time item for the quality descriptor */
    Object.defineProperties(NormalizedBranch.prototype, {
      bx: {
        get: function () {
          return this.currentSegment.startTime.item(this.qualityDescriptor);
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {Object} Segment end time item for the quality descriptor */
    Object.defineProperties(NormalizedBranch.prototype, {
      tU: {
        get: function () {
          return this.currentSegment.endTime.item(this.qualityDescriptor);
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {Object|undefined} Maximum previous state across all pipelines */
    Object.defineProperties(NormalizedBranch.prototype, {
      Nua: {
        get: function () {
          return this.pipelines.reduce(function (maxState, pipeline) {
            if (maxState && pipeline.previousState) {
              return TimeUtil.TimeUtil.max(maxState, pipeline.previousState);
            }
            return pipeline.previousState ? pipeline.previousState : maxState;
          }, undefined);
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {Object|undefined} Maximum live edge time across all pipelines */
    Object.defineProperties(NormalizedBranch.prototype, {
      Hk: {
        get: function () {
          return this.pipelines.reduce(function (maxEdge, pipeline) {
            var edge = pipeline.liveEdgeTime;
            if (maxEdge && edge) {
              return TimeUtil.TimeUtil.max(maxEdge, edge);
            }
            return maxEdge || edge;
          }, undefined);
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {Object} Default manifest variant from the primary pipeline */
    Object.defineProperties(NormalizedBranch.prototype, {
      Gz: {
        get: function () {
          return this.wr.defaultManifestVariant;
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {Object} The branch offset (PTS offset) */
    Object.defineProperties(NormalizedBranch.prototype, {
      Qd: {
        get: function () {
          return this.branchOffset;
        },
        enumerable: false,
        configurable: true,
      },
    });

    /** @type {Object|undefined} The parent branch */
    Object.defineProperties(NormalizedBranch.prototype, {
      parent: {
        get: function () {
          return this.manifest.parent;
        },
        enumerable: false,
        configurable: true,
      },
    });

    // ── Instance methods ────────────────────────────────────────────

    /**
     * Create additional pipelines for this branch (e.g. after a track switch).
     * Delegates to the abstract `createPipelines()`.
     *
     * @param {Object} pipelineFactory - Factory/config for pipeline creation
     * @param {Object} [startTime] - Start time override (defaults to presentationStartTime or this.startTime)
     * @param {boolean} hasParent - Whether this branch has a parent
     * @param {*} extra - Additional arguments
     * @returns {Object} Result with ER flag
     */
    NormalizedBranch.prototype.DWb = function (pipelineFactory, startTime, hasParent, extra) {
      if (startTime === undefined) {
        startTime = this.presentationStartTime || this.startTime;
      }
      return this.createPipelines(pipelineFactory, startTime, hasParent, extra);
    };

    /**
     * Renormalize this branch after a segment boundary change.
     * Truncates each pipeline to its last valid fragment, then re-normalizes
     * the segment timestamps. Emits "branchEdited" when done.
     */
    NormalizedBranch.prototype.resetState = function () {
      var segment, result, audioLastFragment, videoLastFragment, textLastFragment,
          audioPipeline, videoPipeline, textPipeline, contentEndTime;

      if (!this.pipelineNormalizer) return;

      segment = this.viewableId;
      result = tslib.__read(
        this.pipelineNormalizer.resetState(segment, segment.endTime),
        3
      );
      audioLastFragment = result[0];
      videoLastFragment = result[1];
      textLastFragment = result[2];

      // Truncate audio pipeline
      audioPipeline = this.getPipelineByMediaType(mediaEnums.MediaType.V);
      if (audioPipeline) {
        (0, assertModule.assert)(
          audioLastFragment,
          'branch.renormalize: audioLastFragment should be defined'
        );
        audioPipeline.truncate(audioLastFragment);
      }

      // Truncate video pipeline
      videoPipeline = this.getPipelineByMediaType(mediaEnums.MediaType.U);
      if (videoPipeline) {
        (0, assertModule.assert)(
          videoLastFragment,
          'branch.renormalize: videoLastFragment should be defined'
        );
        videoPipeline.truncate(videoLastFragment);
      }

      // Truncate text pipeline
      textPipeline = this.getPipelineByMediaType(mediaEnums.MediaType.TEXT_MEDIA_TYPE);
      if (textPipeline) {
        (0, assertModule.assert)(
          textLastFragment,
          'branch.renormalize: lastTextFragment should be defined'
        );
        textPipeline.truncate(textLastFragment);
      }

      // Re-normalize the segment timestamps
      contentEndTime = this.pipelineNormalizer.segmentEndTime;
      segment.normalize(segment.startTime, contentEndTime);

      if (contentEndTime?.lessThan(segment.startTime)) {
        this.console.error(
          'NormalizedBranch.renormalize(): contentEndTimestamp is less than segment.startTimestamp',
          {
            Gjd: contentEndTime?.ca(),
            uld: segment.startTime.ca(),
          }
        );
      }

      this.events.emit('branchEdited', { type: 'branchEdited' });
    };

    /**
     * Update this branch with a new segment. If the segment boundaries have
     * changed and a normalizer is present, triggers renormalization.
     *
     * @param {Object} newSegment - The updated segment
     * @returns {boolean} Whether renormalization was performed
     */
    NormalizedBranch.prototype.update = function (newSegment) {
      var shouldRenormalize;

      (0, assertModule.assert)(
        newSegment.startTimeMs !== undefined,
        'segment.startTimeMs is required for normalized branch update'
      );
      (0, assertModule.assert)(
        newSegment.contentEndPts !== undefined,
        'segment.endTimeMs is required for normalized branch update'
      );
      (0, assertModule.assert)(
        this.currentSegment.startTimeMs !== undefined,
        'this.segment.startTimeMs is required for normalized branch update'
      );
      (0, assertModule.assert)(
        this.currentSegment.contentEndPts !== undefined,
        'this.segment.endTimeMs is required for normalized branch update'
      );
      (0, assertModule.assert)(
        this.currentSegment.id === newSegment.id,
        'segment.id must match this.segment.id'
      );

      shouldRenormalize =
        this.pipelineNormalizer &&
        (newSegment.startTimeMs !== this.currentSegment.startTimeMs ||
         newSegment.contentEndPts !== this.currentSegment.contentEndPts);

      if (shouldRenormalize) {
        this.console.debug('NormalizedBranch.update() should renormalize');
      }

      this.viewableId = newSegment;

      if (shouldRenormalize) {
        this.resetState();
        return true;
      }
      return false;
    };

    /**
     * Check if the branch offset matches the expected value, and update it
     * if different. Asserts that no pipeline has been attached yet.
     *
     * @param {Object} expectedOffset - The expected branch offset
     */
    NormalizedBranch.prototype.hasUnexpectedState = function (expectedOffset) {
      if (!this.qualityDescriptor.equal(expectedOffset)) {
        this.console.debug('updateBranchOffset', {
          Rwa: this.branchOffset.ca(),
          owa: expectedOffset.ca(),
        });

        (0, assertModule.assert)(
          this.pipelines.every(function (p) { return !p.yqa; }),
          'Cannot adjust branch offset after attaching'
        );

        this.branchOffset = expectedOffset;

        this.events.emit('branchOffsetUpdated', {
          type: 'branchOffsetUpdated',
          qualityDescriptor: expectedOffset,
        });
        this.events.emit('branchEdited', { type: 'branchEdited' });
      }
    };

    /**
     * Get the request iterator for a given media type pipeline.
     *
     * @param {string} mediaType - The media type to query
     * @returns {Promise<Iterator|undefined>} The request iterator, or undefined
     */
    NormalizedBranch.prototype.getRequestIterator = function (mediaType) {
      return tslib.__awaiter(this, undefined, undefined, function () {
        var pipeline;
        return tslib.__generator(this, function (state) {
          switch (state.label) {
            case 0:
              return [4, Promise.resolve()];
            case 1:
              state.T();
              pipeline = this.getPipelineByMediaType(mediaType);
              return pipeline ? [2, pipeline.getRequestIterator()] : [2, undefined];
          }
        });
      });
    };

    /**
     * Clear cached data across all pipelines.
     */
    NormalizedBranch.prototype.CY = function () {
      this.pipelines.forEach(function (p) {
        return p.CY();
      });
    };

    /**
     * Initialize/create all pipelines.
     */
    NormalizedBranch.prototype.create = function () {
      this.pipelines.forEach(function (p) {
        p.create();
      });
    };

    /**
     * Cancel streaming on this branch. Disposes the normalizer, cancels all
     * pipelines, and removes the playgraph state listener.
     *
     * @param {string} reason - Cancellation reason (e.g. "aborted")
     */
    NormalizedBranch.prototype.cancelStreaming = function (reason) {
      if (this.isCancelled) return;

      this.isCancelled = true;
      this.pipelineNormalizer?.dispose();
      this.pipelineNormalizer = undefined;

      this.pipelines.forEach(function (p) {
        p.cancelStreaming(reason === 'aborted');
      });

      this.playgraphState?.removeListener(this._onPlaygraphStateChangeBound);
    };

    /**
     * Whether the branch is ready for playback. Default implementation
     * always returns true; subclasses may override.
     *
     * @returns {boolean}
     */
    NormalizedBranch.prototype.isReadyForPlayback = function () {
      return true;
    };

    /**
     * Get the pipeline for a specific media type.
     *
     * @param {string} mediaType - The media type (VIDEO, AUDIO, TEXT)
     * @returns {Pipeline|undefined} The pipeline, or undefined
     */
    NormalizedBranch.prototype.getPipelineByMediaType = function (mediaType) {
      return this.pipelines.key(mediaType);
    };

    /**
     * Get all pipelines sorted by the given comparator (default: video first).
     *
     * @param {Function} [comparator=sortVideoFirst] - Sort comparator
     * @returns {Pipeline[]} Sorted array of pipelines
     */
    NormalizedBranch.prototype.getSortedPipelines = function (comparator) {
      if (comparator === undefined) {
        comparator = sortVideoFirst;
      }
      return this.pipelines.items.slice().sort(comparator);
    };

    /**
     * Get all pipeline items (unsorted).
     *
     * @returns {Pipeline[]} Array of pipelines
     */
    NormalizedBranch.prototype.returning = function () {
      return this.pipelines.items;
    };

    /**
     * Alias for getPipelineByMediaType.
     *
     * @param {string} mediaType
     * @returns {Pipeline|undefined}
     */
    NormalizedBranch.prototype.noop = function (mediaType) {
      return this.getPipelineByMediaType(mediaType);
    };

    /**
     * Get the buffer level (in seconds) for a given media type.
     *
     * @param {string} mediaType - The media type
     * @param {boolean} useRequestedLevel - If true, return the requested buffer level
     * @returns {number} Buffer level in seconds, or 0
     */
    NormalizedBranch.prototype.getStartTime = function (mediaType, useRequestedLevel) {
      var pipeline = this.getPipelineByMediaType(mediaType);
      if (!pipeline) return 0;

      if (useRequestedLevel) {
        return pipeline.requestedBufferLevel;
      }

      var bufferedEnd = pipeline.L$;
      if (bufferedEnd === undefined) return 0;

      var currentPosition = this.currentPlayer();
      return bufferedEnd - currentPosition;
    };

    /**
     * Get buffer status across audio and video pipelines.
     *
     * @returns {Object} Buffer status with milliseconds and bytes for audio/video
     */
    NormalizedBranch.prototype.getBufferStatus = function () {
      var audioBufferInfo = this.getPipelineByMediaType(mediaEnums.MediaType.V)?.IZ;
      var videoBufferInfo = this.getPipelineByMediaType(mediaEnums.MediaType.U)?.IZ;

      return {
        jW: videoBufferInfo?.playbackSegment ?? 0,
        abuflmsec: audioBufferInfo?.playbackSegment ?? 0,
        vbuflbytes: videoBufferInfo?.la ?? 0,
        abuflbytes: audioBufferInfo?.la ?? 0,
      };
    };

    /**
     * Get the buffered end time for a given media type.
     *
     * @param {string} mediaType - The media type
     * @returns {number} Buffered end time, or 0
     */
    NormalizedBranch.prototype.getEndTime = function (mediaType) {
      var pipeline = this.getPipelineByMediaType(mediaType);
      return pipeline ? (pipeline.L$ ?? 0) : 0;
    };

    /**
     * Update request URLs for a given media type pipeline.
     *
     * @param {string} mediaType - The media type
     * @returns {Array} Updated URLs, or empty array
     */
    NormalizedBranch.prototype.updateRequestUrls = function (mediaType) {
      return this.getPipelineByMediaType(mediaType)?.updateRequestUrls() || [];
    };

    /**
     * Handle playgraph state changes. When transitioning to a buffering state,
     * check whether buffering is complete.
     *
     * @param {Object} event - State change event with `newValue`
     */
    NormalizedBranch.prototype.onPlaygraphStateChange = function (event) {
      var newState = event.newValue;
      if ((0, mediaEnums.timeSlice)(newState)) {
        this.checkBufferingProgress();
      }
    };

    /**
     * Check whether all pipelines are within range of the given position.
     *
     * @param {number} position - Playback position to check
     * @returns {boolean} Whether all pipelines are within range
     */
    NormalizedBranch.prototype.isWithinRange = function (position) {
      return this.pipelines.every(function (p) {
        return p.isWithinRange(position);
      });
    };

    /**
     * Get the segment boundary for a given media type.
     *
     * @param {string} mediaType - The media type
     * @returns {Object} Segment boundary, or the default seek-to-sample value
     */
    NormalizedBranch.prototype.getSegmentBoundary = function (mediaType) {
      return this.pipelines.key(mediaType)?.ase_Rmc || TimeUtil.TimeUtil.seekToSample;
    };

    /**
     * Attempt to truncate pipelines at the last segment boundary. Used when
     * the branch detects it has reached its terminal segment.
     *
     * @param {Array} segments - Array of segment boundary candidates
     * @returns {boolean} Whether any truncation was performed
     */
    NormalizedBranch.prototype.isLastSegment = function (segments) {
      var endTimeBoundary = this.wr.kHb;
      if (!endTimeBoundary) return false;

      var lastSegment = (0, findLastUtil.findLast)(segments, function (seg) {
        return endTimeBoundary.playbackSegment <= seg.presentationStartTime.playbackSegment;
      });
      if (!lastSegment) return false;

      var truncationTime = lastSegment.presentationStartTime;
      var didTruncate = false;

      var truncationPoints = tslib.__read(
        (0, normalizerHelpers.eQb)(this.config, this.pipelines, truncationTime),
        3
      );
      var audioTruncation = truncationPoints[0];
      var videoTruncation = truncationPoints[1];
      var textTruncation = truncationPoints[2];

      if (videoTruncation) {
        var changed = this.getPipelineByMediaType(mediaEnums.MediaType.U).truncate(videoTruncation);
        if (!didTruncate) didTruncate = changed;
      }
      if (audioTruncation) {
        var changed = this.getPipelineByMediaType(mediaEnums.MediaType.V).truncate(audioTruncation);
        if (!didTruncate) didTruncate = changed;
      }
      if (textTruncation) {
        var changed = this.getPipelineByMediaType(mediaEnums.MediaType.TEXT_MEDIA_TYPE).truncate(textTruncation);
        if (!didTruncate) didTruncate = changed;
      }

      if (didTruncate) {
        var event = { type: 'branchEdited' };
        this.events.emit(event.type, event);
      }

      return didTruncate;
    };

    /**
     * Called when the first request for this branch becomes active.
     * Logs a telemetry event for segment change on the first invocation.
     *
     * @param {Object} requestInfo - Information about the active request
     */
    NormalizedBranch.prototype.onRequestActive = function (requestInfo) {
      if (!this._hasLoggedFirstRequest) {
        this._hasLoggedFirstRequest = true;

        var segment = this.viewableId;
        if (segment.type) {
          var logEntry = {};
          logEntry.playgraphId = this.manifest.playgraphId;
          logEntry.type = 'STREAMING_PLAYGRAPH_SEGMENT_CHANGE';
          logEntry.contentType = (0, telemetry.fVb)(segment.type);
          logEntry.isMainContent = segment.IYa;
          logEntry.isTerminal = segment.xO;
          logEntry.segmentId = segment.id;
          logEntry.viewableId = segment.J.toString();
          logEntry.viewableType = this.viewableSession.isAdPlaygraph ? 'LIVE' : 'SVOD';
          telemetry.laser.log(logEntry);
        }
      }

      this.wba(requestInfo);
    };

    /**
     * Called when a request completes. Checks buffering progress and emits
     * completion events. If more segments remain, signals branch streaming complete.
     *
     * @param {Object} request - The completed request
     * @param {*} result - The request result
     */
    NormalizedBranch.prototype.onRequestComplete = function (request, result) {
      if (!this.isCancelled) {
        (0, assertModule.assert)(!request.isEndOfStream);
        this.checkBufferingProgress();

        this.events.emit('requestComplete', {
          type: 'requestComplete',
          isLive: this.manifest,
        });

        if (this.hasMoreSegments) {
          this._emitBranchStreamingComplete();
        }
      }

      this.onRequestCompleted(request, result);
    };

    /**
     * Called when data is received during a request. Optionally checks
     * buffering progress if frequent checks are enabled.
     *
     * @param {Object} request - The request
     * @param {*} data - The received data
     */
    NormalizedBranch.prototype.onDataReceived = function (request, data) {
      if (this.config.enableMoreFrequentBufferingCompleteCheck) {
        this.checkBufferingProgress(true);
      }
      this.onDataReceived(request, data);
    };

    /**
     * Called when the first byte of a response is received. Optionally
     * checks buffering progress if frequent checks are enabled.
     *
     * @param {Object} request - The request
     */
    NormalizedBranch.prototype.onFirstByte = function (request) {
      if (this.config.enableMoreFrequentBufferingCompleteCheck) {
        this.checkBufferingProgress(true);
      }
      this.onFirstByteReceived(request);
    };

    /**
     * Replace the pipeline collection with a new set. Cancels any pipelines
     * that are not in the new set, then normalizes.
     *
     * @param {PipelineCollection} newPipelines - The replacement pipelines
     * @param {*} arg1 - First normalization argument
     * @param {*} arg2 - Second normalization argument
     * @returns {Object} Normalization result with `Bqa` and `ER` flags
     */
    NormalizedBranch.prototype.FFb = function (newPipelines, arg1, arg2) {
      var changed = newPipelines.length > 0;

      // Cancel pipelines that are not in the new set
      this.pipelines
        .filter(function (p) { return !newPipelines.xEb(p); })
        .forEach(function (p) {
          changed = true;
          p.cancelStreaming();
        });

      this.pipelines = newPipelines;

      if (changed) {
        return this.normalize(arg1, arg2);
      }
      return { Bqa: false, ER: false };
    };

    /**
     * Subscribe to a pipeline's "lastRequestIssued" event and propagate it
     * as a branch-level event when all pipelines are at their last segment.
     *
     * @param {Pipeline} pipeline - The pipeline to subscribe to
     */
    NormalizedBranch.prototype.ase_Nta = function (pipeline) {
      var self = this;
      pipeline.events.on('lastRequestIssued', function () {
        if (self.isLastSegmentFlag) {
          self.events.emit('lastRequestIssued', {
            type: 'lastRequestIssued',
          });
        }
      });
    };

    /**
     * Normalize all pipeline timestamps through the PipelineNormalizer.
     * Updates the primary pipeline reference (`wr`) and recalculates the
     * branch offset if this is a continuation from a parent branch.
     *
     * @returns {Object} Normalization result with `Bqa` (changed) and `ER` flags
     */
    NormalizedBranch.prototype.normalize = function () {
      (0, assertModule.assert)(
        this.pipelineNormalizer,
        'Must call through normalize through subclass to create pipeline normalizer'
      );

      this.wr = this.pipelines.wr;

      var result = this.pipelineNormalizer.normalize();
      var changed = result.ase_Bqa;
      var er = result.ER;

      // Recalculate branch offset from parent's previous state if normalization changed
      if (changed && this._parentPreviousState) {
        this.branchOffset = this._parentPreviousState.lowestWaterMarkLevelBufferRelaxed(
          this.presentationStartTime
        );
      }

      return { Bqa: changed, ER: er };
    };

    /**
     * Check whether we should perform a buffering-complete check right now.
     * Only checks during buffering states, and respects a minimum interval.
     *
     * @param {boolean} isFrequentCheck - Whether this is a frequent (data-driven) check
     * @returns {boolean} Whether the check should proceed
     */
    NormalizedBranch.prototype.zYc = function (isFrequentCheck) {
      var isBuffering = (0, mediaEnums.timeSlice)(
        this.playgraphState?.value || mediaEnums.PlaybackState.STREAMING
      );

      return (
        isBuffering &&
        (!isFrequentCheck ||
          this._lastBufferingCheckTime + this.config.minCheckBufferingCompleteInterval <
            platformModule.platform.platform.now())
      );
    };

    /**
     * Emit a "checkBufferingProgress" event if conditions are met.
     * Throttled by `minCheckBufferingCompleteInterval`.
     *
     * @param {boolean} [isFrequentCheck=false] - Whether this is a frequent check
     */
    NormalizedBranch.prototype.checkBufferingProgress = function (isFrequentCheck) {
      if (isFrequentCheck === undefined) {
        isFrequentCheck = false;
      }

      if (this.zYc(isFrequentCheck)) {
        this._lastBufferingCheckTime = platformModule.platform.platform.now();
        var event = { type: 'checkBufferingProgress' };
        this.events.emit(event.type, event);
      }
    };

    /**
     * Emit a "branchStreamingComplete" event indicating all requests
     * for this branch have been issued.
     * @private
     */
    NormalizedBranch.prototype._emitBranchStreamingComplete = function () {
      var event = { type: 'branchStreamingComplete' };
      this.events.emit(event.type, event);
    };

    /**
     * Serialize this branch to a JSON-friendly object for logging/debugging.
     *
     * @returns {Object} JSON representation
     */
    NormalizedBranch.prototype.toJSON = function () {
      return {
        segment: this.currentSegment.id,
        branchOffset: this.qualityDescriptor?.playbackSegment,
        viewableId: this.viewableId.J,
        contentStartPts: this.presentationStartTime?.playbackSegment,
        contentEndPts: this.segmentEndTime?.playbackSegment,
      };
    };

    return NormalizedBranch;
  })(baseModule.bP);

  b.ZHa = NormalizedBranch;
}
