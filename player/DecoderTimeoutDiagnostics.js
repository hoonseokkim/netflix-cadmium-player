/**
 * Netflix Cadmium Player — DecoderTimeoutDiagnostics
 *
 * Builds a detailed diagnostic error when the video decoder times out
 * (i.e. media time stops advancing despite data being buffered).
 *
 * Collects state from the media source, source buffers, playback engine,
 * and DOM to assemble a structured diagnostics payload, including:
 *   - Current media time, buffering/presenting/playback states
 *   - Per-source-buffer updating status and undecoded byte ranges
 *   - Tab visibility, decoded frame count, video-element-in-DOM check
 *   - A diagnostic "reason code" indicating the probable cause
 *
 * The result is a `PlayerError` of category `PLAY_MSE_DECODER_TIMEOUT`.
 *
 * @module player/DecoderTimeoutDiagnostics
 */

// ─── Dependencies ──────────────────────────────────────────
// import { __decorate, __param } from 'tslib';
// import { injectable, inject } from '../modules/Module_22674';
// import { ClockToken } from '../modules/Module_81918';
// import { PlayerError } from '../modules/Module_31149';
// import { CommandCategory, EventTypeEnum } from '../modules/Module_36129';
// import { PresentingState, BufferingState } from '../modules/Module_85001';
// import { toMilliseconds, MILLISECONDS } from '../modules/Module_5021';
// import { document as globalDocument } from '../modules/Module_22365';

// ─── Diagnostic Reason Codes ───────────────────────────────

/** Buffer has zero ranges (completely empty). */
const REASON_NO_RANGES = '1';

/** Buffer has multiple disjoint ranges (gap detected). */
const REASON_MULTIPLE_RANGES = '2';

/** Current media time is outside the buffered range. */
const REASON_TIME_OUTSIDE_RANGE = '3';

/** MSE / internal buffer updating state mismatch. */
const REASON_BUFFER_BUSY_MISMATCH = '4';

/** Undecoded data is less than the timeout threshold. */
const REASON_UNDECODED_BELOW_THRESHOLD = '5';

/** Video element has zero decoded frames (decoder stalled). */
const REASON_ZERO_DECODED_FRAMES = '6';

// ─── State Label Arrays ────────────────────────────────────

const MEDIA_TYPE_LABELS = ['Audio', 'Video'];
const BUFFERING_STATE_LABELS = ['', 'NORMAL', 'BUFFERING', 'STALLED'];
const PRESENTING_STATE_LABELS = ['', 'WAITING', 'PLAYING ', 'PAUSED', 'ENDED'];
const PLAYBACK_STATE_LABELS = [
  'STATE_NOTLOADED',
  'STATE_LOADING',
  'STATE_NORMAL',
  'STATE_CLOSING',
  'STATE_CLOSED',
];

// ─── DecoderTimeoutDiagnostics ─────────────────────────────

export class DecoderTimeoutDiagnostics {
  /**
   * @param {Object} clock  - Player clock (for `getCurrentTime()`).
   * @param {Object} config - Decoder timeout configuration thresholds.
   */
  constructor(clock, config) {
    /** @private */
    this.clock = clock;
    /** @private */
    this.config = config;
  }

  /**
   * Build a diagnostic `PlayerError` for a decoder timeout event.
   *
   * @param {Object} playerContext - Rich player state snapshot.
   * @returns {PlayerError} Error with structured diagnostic details JSON.
   */
  buildTimeoutError(playerContext) {
    const self = this;
    const mediaTimeMs = playerContext.mediaTime.value;
    const bufferingState = playerContext.avBufferingState.value;
    const presentingState = playerContext.presentingState.value;
    const playbackState = playerContext.state.value;

    const details = {
      segmentId: playerContext.getCurrentSegmentId(),
      mediaTime: mediaTimeMs,
      segmentTime: playerContext.getSegmentTime(),
      bufferingState: BUFFERING_STATE_LABELS[bufferingState],
      presentingState: PRESENTING_STATE_LABELS[presentingState],
      playbackState: PLAYBACK_STATE_LABELS[playbackState],
      mseBuffersBusy: this._getMseBufferStatus(playerContext),
      intBuffersBusy: this._getInternalBufferStatus(playerContext),
      tabVisible: this._isTabVisible(),
      decodedFrameCount: this._getDecodedFrameCount(playerContext),
      videoElementInDom: this._isVideoElementInDom(playerContext),
      lastVideoSync: this.clock
        .getCurrentTime()
        .subtract(toMilliseconds(playerContext.lastHeartbeat))
        .toUnit(MILLISECONDS),
    };

    // Choose timeout threshold based on presenting state
    const timeoutThreshold =
      presentingState === PresentingState.WAITING
        ? playerContext.sessionContext.isSeeking
          ? this.config.seekingTimeoutThreshold
          : this.config.waitingTimeoutThreshold
        : this.config.playingTimeoutThreshold;

    let eventType;
    let reasonCode;

    if (bufferingState !== BufferingState.NORMAL) {
      // Buffering / stalled
      eventType = EventTypeEnum.DECODER_TIMEOUT_BUFFERING;
      if (this._hasBufferBusyMismatch(details.mseBuffersBusy, details.intBuffersBusy)) {
        reasonCode = REASON_BUFFER_BUSY_MISMATCH;
      }
    } else {
      // Normal buffering state — check presenting state
      if (presentingState !== PresentingState.PLAYING) {
        eventType = EventTypeEnum.DECODER_TIMEOUT_PRESENTING;
      } else {
        eventType = EventTypeEnum.DECODER_TIMEOUT_PLAYING;

        const mediaSourceMgr = playerContext.mediaSourceManager;
        if (mediaSourceMgr && mediaSourceMgr.getDecodedFrameCount() === 0) {
          reasonCode = REASON_ZERO_DECODED_FRAMES;
        }
      }

      // Inspect source buffers for detailed diagnostics
      const mediaSourceMgr = playerContext.mediaSourceManager;
      if (mediaSourceMgr) {
        details.mediaBuffered = mediaSourceMgr.getBufferedDuration();
        details.mediaBufferedSegments = mediaSourceMgr.getBufferedSegmentCount();

        mediaSourceMgr.mediaSourceElement.sourceBuffers.forEach(function (sourceBuffer) {
          const label = MEDIA_TYPE_LABELS[sourceBuffer.mediaType];
          details[label + 'Ranges'] = sourceBuffer.getBufferStatus();

          let buffered;
          try {
            buffered = sourceBuffer.buffered();
          } catch (e) {
            buffered = undefined;
          }

          if (buffered && buffered.length !== 0) {
            const undecodedMs = 1000 * buffered.end(0) - mediaTimeMs;
            details[label + 'Undecoded'] = undecodedMs;

            if (buffered.length > 1) {
              reasonCode = REASON_MULTIPLE_RANGES;
            }

            if (mediaTimeMs < 1000 * buffered.start(0) || mediaTimeMs > 1000 * buffered.end(0)) {
              reasonCode = REASON_TIME_OUTSIDE_RANGE;
            } else if (undecodedMs < timeoutThreshold.toUnit(MILLISECONDS)) {
              reasonCode = REASON_UNDECODED_BELOW_THRESHOLD;
            } else if (self._hasBufferBusyMismatch(details.mseBuffersBusy, details.intBuffersBusy)) {
              reasonCode = REASON_BUFFER_BUSY_MISMATCH;
            }
          } else {
            details[label + 'Undecoded'] = 0;
            reasonCode = REASON_NO_RANGES;
          }
        });
      }
    }

    // Attach reposition trace data
    const traceData = playerContext.repositionTracker.getTraceData();
    const lastRepositionTime = traceData.repositionTrace?.[0]?.newMediaTime;
    details.lastRepositionCausedTimeout = mediaTimeMs === lastRepositionTime;
    details.trackChangeInProgress = playerContext.streamingSession?.trackUpdateCallback;

    Object.assign(details, traceData);

    // Serialise details to JSON
    let detailsJson = '';
    try {
      detailsJson = JSON.stringify(details);
    } catch (e) {
      detailsJson = 'Cannot stringify details: ' + e;
    }

    return new PlayerError(
      CommandCategory.PLAY_MSE_DECODER_TIMEOUT,
      eventType,
      reasonCode,
      undefined,
      undefined,
      undefined,
      detailsJson,
      undefined
    );
  }

  // ─── Private Helpers ─────────────────────────────────────

  /**
   * Get MSE source buffer updating status.
   * @private
   */
  _getMseBufferStatus(playerContext) {
    if (!playerContext.mediaSourceElement) return undefined;
    const status = {};
    playerContext.mediaSourceElement.sourceBuffers.forEach(function (sb) {
      status[sb.type === 0 ? 'audio' : 'video'] = { updating: sb.updating() };
    });
    return status;
  }

  /**
   * Get internal buffer updating status.
   * @private
   */
  _getInternalBufferStatus(playerContext) {
    if (!playerContext.mediaSourceElement) return undefined;
    const status = {};
    playerContext.mediaSourceElement.sourceBuffers.forEach(function (sb) {
      status[sb.type === 0 ? 'audio' : 'video'] = { updating: sb.getUpdatingState() };
    });
    return status;
  }

  /** @private */
  _isTabVisible() {
    return !globalDocument.hidden;
  }

  /** @private */
  _getDecodedFrameCount(playerContext) {
    const mgr = playerContext.mediaSourceManager;
    const videoEl = mgr?.mediaSourceElement?.htmlVideoElement;
    return videoEl && videoEl.webkitDecodedFrameCount !== undefined
      ? videoEl.webkitDecodedFrameCount
      : NaN;
  }

  /** @private */
  _isVideoElementInDom(playerContext) {
    const mgr = playerContext.mediaSourceManager;
    const videoEl = mgr?.mediaSourceElement?.htmlVideoElement;
    return videoEl ? globalDocument.body.contains(videoEl) : false;
  }

  /**
   * Detect mismatch between MSE buffer updating and internal buffer updating.
   * @private
   */
  _hasBufferBusyMismatch(mseStatus, intStatus) {
    return !(
      mseStatus?.audio?.updating === intStatus?.audio?.updating &&
      mseStatus?.video?.updating === intStatus?.video?.updating
    );
  }
}
