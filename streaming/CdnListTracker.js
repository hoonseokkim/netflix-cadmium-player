/**
 * @file CdnListTracker.js
 * @description Tracks CDN usage and playback time per stream/source buffer combination.
 *              Extends the base branch tracking system to record how long each CDN
 *              (identified by downloadable stream ID) is used during playback.
 *              Listens for skip, pause, and underflow events to finalize timing data.
 * @module streaming/CdnListTracker
 * @original Module_89527
 */

import { __extends } from 'tslib'; // Module 22970
import { ClockWatcher } from './ClockWatcher'; // Module 90745
import { assert } from '../assert/AssertionUtils'; // Module 52571
import { DEBUG_ENABLED as u } from '../core/DebugSymbols'; // Module 48170
import { BaseBranchTracker } from './BranchBase'; // Module 546

/** @type {number} Auto-incrementing instance counter for unique branch IDs */
let instanceCounter = 0;

/**
 * Tracks CDN usage metrics per source buffer during playback.
 * Records total playback time attributed to each downloadable stream (CDN).
 *
 * @extends BaseBranchTracker
 */
export class CdnListTracker extends BaseBranchTracker {
  /**
   * @param {Object} cdnDataMap - Mutable map of route key -> CDN usage entry
   * @param {Object} yNc - Track state configuration
   * @param {Object} asePlayer - Player reference
   * @param {Object} loa - LOA config
   * @param {Object} events - Event emitter
   * @param {Object} configurationSnapshot - Config snapshot
   * @param {*} forceEstRelativeLiveBookmark - Live bookmark setting
   * @param {*} priority - Optional priority
   */
  constructor(cdnDataMap, yNc, asePlayer, loa, events, configurationSnapshot, forceEstRelativeLiveBookmark, priority) {
    super(
      `cdnList${instanceCounter++}`,
      yNc, asePlayer, loa, events, configurationSnapshot,
      forceEstRelativeLiveBookmark, 'cdnList', priority
    );

    /** @type {Object} Map of route key -> CDN usage entry */
    this.cdnDataMap = cdnDataMap;

    this._initEventListeners();
  }

  /**
   * Sets up event listeners for skip, pause, and underflow events.
   * These events trigger finalization of the current CDN timing entry.
   * @private
   */
  _initEventListeners() {
    this._clockWatcher = new ClockWatcher();

    this._clockWatcher.on(this.asePlayer.player, 'skipped', (event) => {
      if (this._pendingEvent) {
        if (event?.yOb) {
          this._finalizeTiming(event.yOb);
        }
        this._pendingEvent = undefined;
      }
    });

    this._clockWatcher.on(this.asePlayer.player, 'paused', () => {
      if (this._pendingEvent && this.asePlayer.isPlaybackStarted) {
        this._finalizeTiming(this.asePlayer.setPosition);
      }
    });

    this._clockWatcher.on(this.asePlayer.player, 'underflow', () => {
      if (this._pendingEvent && this.asePlayer.isPlaybackStarted) {
        this._finalizeTiming(this.asePlayer.setPosition);
      }
    });
  }

  /**
   * Updates the track state and reinitializes event listeners.
   * @param {*} k
   * @param {*} l
   * @param {*} m
   */
  updateTrackState(k, l, m) {
    this._clockWatcher.clear();
    super.updateTrackState(k, l, m);
    this._initEventListeners();
  }

  /**
   * Closes this tracker, cleaning up event listeners.
   */
  closing() {
    if (u) this.console.pauseTrace('close');
    super.closing();
    this._clockWatcher.clear();
  }

  /**
   * Retrieves CDN entries matching the given stream key, finalizing any pending timing.
   * @param {*} position - Current position for finalization
   * @param {*} streamKey - The stream key to filter by
   * @returns {Array<Object>} Matching CDN data entries
   */
  getCdnEntriesForStream(position, streamKey) {
    if (this._pendingEvent) {
      this._finalizeTiming(position);
    }
    return this._getRouteKeysForStream(streamKey).map((key) => this.cdnDataMap[key]);
  }

  /**
   * Removes CDN entries matching the given stream key.
   * @param {*} streamKey - The stream key to remove entries for
   */
  removeCdnEntriesForStream(streamKey) {
    this._getRouteKeysForStream(streamKey).forEach((key) => {
      delete this.cdnDataMap[key];
    });
  }

  /**
   * Returns route keys from the CDN data map that match the given stream key.
   * @param {*} streamKey
   * @returns {string[]}
   * @private
   */
  _getRouteKeysForStream(streamKey) {
    return Object.keys(this.cdnDataMap).filter(
      (key) => this.cdnDataMap[key].R === `${streamKey}`
    );
  }

  /**
   * Called when media is appended. Records timing data for the stream/buffer combo.
   * @param {Object} params
   * @param {Object} params.stream
   * @param {number} params.sourceBufferIndex
   * @param {*} params.timestamp
   * @param {*} params.previousState
   */
  isPlaybackStartedProperty({ stream, sourceBufferIndex, timestamp, previousState }) {
    assert(timestamp !== undefined);
    assert(previousState !== undefined);
    if (u) {
      this.console.pauseTrace(`Media appended ${timestamp.ca()}-${previousState.ca()}`);
    }
    this.BOa({ stream, sourceBufferIndex }, timestamp, previousState);
  }

  /**
   * Checks if two playback metric references refer to the same stream/buffer.
   * @param {Object} a
   * @param {Object} b
   * @returns {boolean}
   */
  rua(a, b) {
    return a.stream === b.stream && a.sourceBufferIndex === b.sourceBufferIndex;
  }

  /**
   * Generates a unique route key for a playback metrics entry.
   * @param {Object} entry
   * @returns {string} Route key like "bufferIdx::pbcid"
   */
  routeRequest(entry) {
    const metrics = entry.playbackMetrics;
    const bufferIndex = metrics.sourceBufferIndex;
    const pbcid = metrics.stream.viewableSession.manifestRef.cdnResponseData?.pbcid;
    return `${bufferIndex}::${pbcid}`;
  }

  /**
   * Records a pending CDN usage event at a given timestamp.
   * @param {Object} event - The playback event with metrics
   * @param {*} timestamp - When the event occurred
   */
  cTa(event, timestamp) {
    if (u) {
      this.console.pauseTrace(
        `Presenting event for ( ${event.playbackMetrics.stream.id}, ${event.playbackMetrics.sourceBufferIndex} )` +
        ` at ${timestamp.ca()}`
      );
    }
    if (this._pendingEvent) {
      this._finalizeTiming(timestamp);
    } else {
      this._lastTimestamp = timestamp;
    }
    this._pendingEvent = event;
  }

  /**
   * Finalizes timing for the currently pending CDN event.
   * Calculates the duration since the last timestamp and adds it to the CDN entry.
   * @param {*} position - The current position
   * @private
   */
  _finalizeTiming(position) {
    assert(this._pendingEvent);

    // Clamp to max position if applicable
    if (this.VRa?.lessThan(position)) {
      position = this.VRa;
    }

    const event = this._pendingEvent;
    const dataMap = this.cdnDataMap;
    const metrics = event.playbackMetrics;
    const stream = metrics.stream;
    const bufferIndex = metrics.sourceBufferIndex;
    const downloadableStreamId = stream.ellaMetadata?.sh;
    const duration = position
      .lowestWaterMarkLevelBufferRelaxed(this._lastTimestamp || event.timestamp)
      .playbackSegment;

    if (bufferIndex !== undefined && downloadableStreamId !== undefined) {
      const pbcid = stream.viewableSession.manifestRef.cdnResponseData?.pbcid;
      const trackKey = stream.track.R;
      const routeKey = this.routeRequest(event);

      const entry = dataMap[routeKey] || (dataMap[routeKey] = {
        Gk: bufferIndex,
        pbcid,
        R: trackKey,
        yo: {},
      });

      const streamEntry = entry.yo[downloadableStreamId] || (entry.yo[downloadableStreamId] = {
        bitrate: stream.bitrate,
        downloadableStreamId,
        mediaType: stream.mediaType,
        totalTime: 0,
        vmaf: stream.vmaf,
      });

      streamEntry.totalTime = Math.max(streamEntry.totalTime + duration, 0);
    }

    this._lastTimestamp = position;
  }

  /**
   * Clones this tracker to a new instance, preserving pending state.
   * @param {*} newKey
   * @param {Object} [options={}]
   * @returns {CdnListTracker}
   */
  clone(newKey, options = {}) {
    const Ctor = options.$ld || CdnListTracker;
    const cloned = new Ctor(
      newKey,
      this.yNc, this.asePlayer, this.loa,
      this.events, this.configurationSnapshot,
      this.forceEstRelativeLiveBookmark, options.priority
    );
    this.item(cloned);
    cloned._pendingEvent = this._pendingEvent;
    cloned._lastTimestamp = this._lastTimestamp;
    if (u) {
      cloned.console.pauseTrace('Cloning', { Vbd: cloned.hk.length });
    }
    return cloned;
  }

  /**
   * Resets the tracker state upon creation.
   */
  create() {
    super.create();
    this._lastTimestamp = undefined;
  }

  /**
   * Formats a playback metric entry for debug display.
   * @param {Object} metric
   * @returns {string}
   */
  GM(metric) {
    return `(${metric.stream.selectedStreamId}, ${metric.sourceBufferIndex})`;
  }
}
