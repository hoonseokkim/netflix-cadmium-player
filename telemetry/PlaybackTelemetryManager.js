/**
 * Netflix Cadmium Player — Playback Telemetry Manager
 *
 * Listens to player state changes (seeking, track changes, stalls, buffer
 * switches, playback rate, presenting state) and drives the log-blob manager
 * to record telemetry events.  Also schedules mid-play log flushes at
 * configured key-points and intervals.
 *
 * @module PlaybackTelemetryManager
 */

// Dependencies
// import { MILLISECONDS } from './modules/Module_5021';     // time unit
// import { scheduleAsync } from './modules/Module_32219';   // async scheduler
// import { cb as PlayerEventNames, setState as PresentingState, streamState as StreamStateEnum } from './modules/Module_85001';
// import { MediaType } from './modules/Module_26388';

/**
 * Coordinates telemetry collection during active playback.
 *
 * Created when a playback session begins and torn down when the player
 * fires the `closed` event.  Manages listeners on the player state's
 * observable properties and schedules periodic log flushes.
 */
export class PlaybackTelemetryManager {
  /**
   * @param {object} playerState     - Observable player state model.
   * @param {object} mediaFactory    - Factory for log-batch flushing.
   * @param {function} config        - Returns telemetry configuration.
   * @param {object} lastVideoSync   - Clock that provides current time.
   * @param {object} logBlobManager  - Underlying log-blob event recorder.
   */
  constructor(playerState, mediaFactory, config, lastVideoSync, logBlobManager) {
    /** @private */ this.playerState = playerState;
    /** @private */ this.mediaFactory = mediaFactory;
    /** @private */ this.config = config;
    /** @private */ this.lastVideoSync = lastVideoSync;
    /** @private */ this.logBlobManager = logBlobManager;

    /** @private Whether telemetry collection has started. */
    this.isStarted = false;

    /** @private Pending repositioning context. */
    this.pendingReposition = undefined;

    /** @private Timestamp of the last reposition event. */
    this.repositionTimestamp = undefined;

    /** @private Last audio track selection for change detection. */
    this.lastAudioTrackSelection = undefined;

    /** @private Last target-buffer stream for switch detection. */
    this.lastTargetStream = undefined;

    /** @private Timeout handle for initial log flush. */
    this.initialFlushTimeout = undefined;

    /** @private Cleanup function for mid-play timers. */
    this.midplayCleanup = undefined;

    // --- Bound callbacks ---

    /** @private Teardown: remove all listeners and flush. */
    this.onClosed = () => {
      this.clearTimers();
      this.playerState.subscriberList.isSeeking.removeListener(this.onSeekChange);
      this.playerState.subscriberList.tracks.removeListener(this.logBlobManager.gq);
      this.playerState.subscriberList.tracks.removeListener(this.onTrackChanged);
      this.playerState.subscriberList.playbackRate.removeListener(this.logBlobManager.Z9);
      this.playerState.mk.removeListener(this.onMuteChange);
      this.playerState.C3.removeListener(this.onReposition);
      this.playerState.subscriberList.targetBuffer.removeListener(this.onTargetBufferChange);
      this.playerState.presentingState.removeListener(this.onPresentingComplete);
      this.playerState.presentingState.removeListener(this.onFirstPlay);
      this.playerState.subscriberList.isStalled.removeListener(this.onStallChange);
      this.playerState.subscriberList.playbackRate.removeListener(this.logBlobManager.qha);
      this.playerState.removeEventListener(PlayerEventNames.closed, this.onClosed);
      this.playerState.removeEventListener(PlayerEventNames.internal_Ioa, this.logBlobManager.logBlobEvent);
    };

    /** @private Wait for first PLAYING state then start telemetry. */
    this.onFirstPlay = () => {
      if (this.playerState.presentingState.value === PresentingState.PLAYING) {
        this.playerState.presentingState.removeListener(this.onFirstPlay);
        this.startTelemetry();
      }
    };

    /** @private Forward seek events to log-blob manager. */
    this.onSeekChange = (change) => {
      if (this.isStarted) {
        this.logBlobManager.yJ(change);
      }
    };

    /** @private Handle stream reposition events. */
    this.onReposition = (change) => {
      if (this.isStarted && change.newValue !== undefined) {
        if (this.pendingReposition && this.repositionTimestamp) {
          this.logBlobManager.r2a(
            this.getTime() - this.repositionTimestamp,
            this.pendingReposition.F4a,
          );
        }
        this.pendingReposition = { F4a: "repos", kQb: change.newValue };
        this.logBlobManager.XN(
          change.newValue,
          this.playerState.subscriberList.mediaTimeObservable.value,
          this.playerState.subscriberList.targetBuffer.value,
        );
        this.repositionTimestamp = this.getTime();
        scheduleAsync(this.onPresentingComplete);
      }
    };

    /** @private Handle mute state changes. */
    this.onMuteChange = (change) => {
      if (this.isStarted) {
        this.logBlobManager.internal_Lxa(!change.newValue);
      }
    };

    /** @private Handle audio/video track changes. */
    this.onTrackChanged = (change) => {
      if (change.XE) {
        this.lastAudioTrackSelection = change.XE;
        this.logBlobManager.eventCallback(change);
        this.pendingReposition = { F4a: "repos", kQb: StreamStateEnum.TRACK_CHANGED };
        this.repositionTimestamp = this.getTime();
        scheduleAsync(this.onPresentingComplete);
      }
    };

    /** @private Flush pending reposition when presenting completes. */
    this.onPresentingComplete = () => {
      if (this.repositionTimestamp && this.pendingReposition &&
          this.playerState.presentingState.value !== PresentingState.WAITING) {
        const elapsed = this.getTime() - this.repositionTimestamp;
        this.logBlobManager.mv(elapsed, false, this.pendingReposition);

        if (this.lastAudioTrackSelection &&
            this.lastAudioTrackSelection !== this.playerState.subscriberList.tracks.audioTrackSelection) {
          this.logBlobManager.rPa();
        }

        this.repositionTimestamp = undefined;
        this.pendingReposition = undefined;
      }
    };

    /** @private Handle stall recovery events. */
    this.onStallChange = (change) => {
      if (change.oldValue && change.sn?.jR) {
        this.logBlobManager.qH(change.oldValue, change.newValue, change.sn.jR, change.sn.g$);
      }
    };

    /** @private Handle target buffer / stream switches. */
    this.onTargetBufferChange = (change) => {
      if (change.newValue) {
        const stream = change.newValue.stream;
        if (this.lastTargetStream !== stream) {
          if (this.lastTargetStream && stream) {
            this.logBlobManager.Z3a(this.lastTargetStream, stream, change.newValue.CZ.startTime);
          }
          this.lastTargetStream = stream;
        }
      }
    };

    // Register all listeners
    this.registerListeners();
  }

  /**
   * Registers event listeners on the player state.
   * @private
   */
  registerListeners() {
    this.playerState.addEventListener(PlayerEventNames.closed, this.onClosed);
    this.playerState.addEventListener(PlayerEventNames.internal_Ioa, this.logBlobManager.logBlobEvent);
    this.playerState.subscriberList.isSeeking.addListener(this.onSeekChange);
    this.playerState.subscriberList.tracks.addListener([MediaType.TEXT_MEDIA_TYPE], this.logBlobManager.gq);
    this.playerState.subscriberList.tracks.addListener([MediaType.V], this.onTrackChanged);
    this.playerState.subscriberList.playbackRate.addListener(this.logBlobManager.Z9);
    this.playerState.mk.addListener(this.onMuteChange);
    this.playerState.C3.addListener(this.onReposition);
    this.playerState.subscriberList.targetBuffer.addListener(this.onTargetBufferChange);
    this.playerState.presentingState.addListener(this.onPresentingComplete);
    this.playerState.presentingState.addListener(this.onFirstPlay);
    this.playerState.subscriberList.isStalled.addListener(this.onStallChange);
    this.playerState.subscriberList.playbackRate.addListener(this.logBlobManager.qha);
  }

  /**
   * Returns the current playback time in milliseconds.
   * @private
   * @returns {number}
   */
  getTime() {
    return this.lastVideoSync.getCurrentTime().toUnit(MILLISECONDS);
  }

  /**
   * Starts telemetry collection and schedules mid-play log points.
   * @private
   */
  startTelemetry() {
    if (this.isStarted) return;

    this.isStarted = true;
    this.logBlobManager.aq(this.playerState);
    this.setupMidplayTimers();

    const initialTimeout = this.config().initialLogFlushTimeout;
    if (initialTimeout) {
      this.initialFlushTimeout = Da.setTimeout(() => {
        this.mediaFactory.logBatcher(false).catch(() =>
          this.log.RETRY("failed to flush log batcher on initialLogFlushTimeout")
        );
        this.initialFlushTimeout = undefined;
      }, initialTimeout);
    }
  }

  /**
   * Clears all pending timers and finalizes the log blob.
   * @private
   */
  clearTimers() {
    if (this.initialFlushTimeout) {
      Da.clearTimeout(this.initialFlushTimeout);
      this.initialFlushTimeout = undefined;
    }
    if (this.midplayCleanup) {
      this.midplayCleanup();
    }

    if (this.isStarted) {
      this.logBlobManager.vw();
    } else if (this.playerState.lastError) {
      this.logBlobManager.aq(this.playerState);
    } else {
      this.logBlobManager.s2a();
    }
  }

  /**
   * Sets up mid-play log flush timers based on configuration.
   * Includes both key-point timeouts and a periodic interval.
   * @private
   */
  setupMidplayTimers() {
    const config = this.config();
    if (!config.midplayEnabled) return;

    const timeouts = [];

    config.midplayKeyPoints.forEach((keyPoint) => {
      timeouts.push(Da.setTimeout(this.logBlobManager.HI, keyPoint));
    });

    let interval;
    if (config.midplayIntervalMilliseconds) {
      interval = Da.setInterval(this.logBlobManager.HI, config.midplayIntervalMilliseconds);
    }

    this.midplayCleanup = () => {
      timeouts.forEach((t) => Da.clearTimeout(t));
      if (interval) Da.clearInterval(interval);
    };
  }
}
