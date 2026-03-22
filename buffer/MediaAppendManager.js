/**
 * @module MediaAppendManager
 * @description Manages appending audio and video media segments to MSE
 * SourceBuffers. Handles buffering queues, quota exceeded recovery,
 * end-of-stream signaling, codec switching, segment eviction, and
 * buffer range computation. Core component of the Cadmium player's
 * MSE (Media Source Extensions) pipeline.
 * @origin Module_33059
 */

import { config } from '../core/PlayerConfig.js';
import { MediaBufferType } from '../types/MediaBufferType.js';
import {
  fetchOperation,
  disposableList,
} from '../core/PlayerServiceLocator.js';
import { ErrorCode } from '../types/ErrorCodes.js';
import { assert } from '../assert/assert.js';
import { initializeModel } from '../utils/ErrorFormatter.js';
import { segmentDurationMs, SEGMENT_HEADER_CONSTANTS } from './PlayerConstants.js';
import { PlayerState } from '../player/PlayerState.js';
import { getMediaTypeString } from '../media/MediaTypeUtils.js';
import { MILLISECONDS, toSeconds } from '../timing/TimeConversion.js';
import { ReadyState } from '../media/ReadyState.js';
import { ProfileMatcher } from '../media/ProfileMatcher.js';
import { CDN_CACHE } from '../network/CdnCache.js';
import { MediaType } from '../types/MediaType.js';
import { PlaygraphSegmentType } from '../streaming/PlaygraphSegmentType.js';
import { CodecProfileRegex } from '../media/CodecProfileRegex.js';

/**
 * @typedef {Object} BufferTrack
 * @property {string} type - Buffer type (audio/video)
 * @property {Array} segments - Appended segment records
 * @property {Array} appendQueue - Queue of segments awaiting append
 * @property {boolean} quotaExceeded - Whether quota was exceeded
 */

/**
 * Manages the append pipeline for audio and video SourceBuffers.
 */
export class MediaAppendManager {
  /**
   * @param {Object} playerState - Current player state
   * @param {Object} layoutEngine - Layout/rendering engine
   */
  constructor(playerState, layoutEngine) {
    this.playerState = playerState;
    this.layoutEngine = layoutEngine;
    this.forceHeaderAppend = false;

    this.log = fetchOperation(this.playerState, 'MediaAppendManager');
    this.mediaSourceElement = this.playerState.mediaSourceElement;
    this.htmlVideoElement = this.mediaSourceElement.htmlVideoElement;

    this.audioEndReached = false;
    this.videoEndReached = false;

    /** @type {BufferTrack} */
    this.audioBufferTrack = {
      type: MediaBufferType.audioBufferedSegments,
      segments: [],
      appendQueue: [],
      quotaExceeded: false,
    };

    /** @type {BufferTrack} */
    this.videoBufferTrack = {
      type: MediaBufferType.videoBufferedSegments,
      segments: [],
      appendQueue: [],
      quotaExceeded: false,
    };

    /** @type {Object.<string, BufferTrack>} Maps media type to buffer track */
    this.bufferTrackMap = {
      [MediaType.VIDEO]: this.videoBufferTrack,
      [MediaType.AUDIO]: this.audioBufferTrack,
    };

    this.closed = false;
    this.maxDecoderBufferMs = config.maxDecoderBufferMilliseconds;
    this.minDecoderBufferMs = config.minDecoderBufferMilliseconds;
    this.optimalDecoderBufferMs = this.playerState.sessionContext.isSeeking
      ? config.optimalDecoderBufferMillisecondsBranching
      : config.optimalDecoderBufferMilliseconds;

    this.canEvictBuffer = true;
    this.base64Encoder = disposableList.key('Base64EncoderSymbol');
    this.encryptedHeaderAppended = false;

    assert(this.maxDecoderBufferMs > this.minDecoderBufferMs, 'bad config');
    assert(this.maxDecoderBufferMs > this.optimalDecoderBufferMs, 'bad config');
  }

  /**
   * Returns byte counts for video/audio data both queued and in the buffer.
   * @returns {{ videoToAppend: number, videoInBuffer: number, audioToAppend: number, audioInBuffer: number }}
   */
  getBufferStats() {
    const countBytes = (acc, segment) => {
      const hasResponse = !!segment.response;
      const responseData = segment.response;
      if (segment.isEndOfStream) return acc + (responseData.byteLength || 0);
      const rangeSize = (segment.byteOffsetEnd ?? 0) - (segment.byteOffsetStart ?? 0);
      return (hasResponse ? responseData.byteLength : rangeSize) + acc;
    };

    const countSegmentBytes = (acc, record) => countBytes(acc, record.segmentData);

    const video = this.bufferTrackMap[MediaType.VIDEO];
    const audio = this.bufferTrackMap[MediaType.AUDIO];

    return {
      videoToAppend: video.appendQueue.reduce(countBytes, 0),
      videoInBuffer: video.segments.reduce(countSegmentBytes, 0),
      audioToAppend: audio.appendQueue.reduce(countBytes, 0),
      audioInBuffer: audio.segments.reduce(countSegmentBytes, 0),
    };
  }

  /**
   * Returns PTS ranges for currently buffered audio and video segments.
   * @returns {{ audioBufferedSegments: number[][], videoBufferedSegments: number[][] }}
   */
  getBufferedRanges() {
    return {
      audioBufferedSegments: this.audioBufferTrack.segments.map(
        (s) => [s.segmentData.ptsStart, s.segmentData.ptsEnd]
      ),
      videoBufferedSegments: this.videoBufferTrack.segments.map(
        (s) => [s.segmentData.ptsStart, s.segmentData.ptsEnd]
      ),
    };
  }

  /**
   * Appends a minimal "free" MP4 atom to the audio source buffer
   * to keep it alive (workaround for some browser MSE implementations).
   */
  appendKeepAliveAtom() {
    if (this.audioBufferTrack.sourceBuffer &&
        !this.audioBufferTrack.sourceBuffer.getUpdatingState()) {
      // "free" MP4 box: [0,0,0,8, 'f','r','e','e']
      this.audioBufferTrack.sourceBuffer.appendMediaData(
        new Uint8Array([0, 0, 0, 8, 102, 114, 101, 101])
      );
    }
  }

  /**
   * Marks both audio and video tracks for buffer trimming.
   */
  markForTrimming() {
    this.audioBufferTrack.needsTrimming = true;
    this.videoBufferTrack.needsTrimming = true;
  }

  /**
   * Marks the given media type as having reached end-of-stream.
   * @param {string} mediaType - MediaType.AUDIO or MediaType.VIDEO
   */
  markEndReached(mediaType) {
    if (mediaType === MediaType.AUDIO) {
      this.audioEndReached = true;
    } else if (mediaType === MediaType.VIDEO) {
      this.videoEndReached = true;
    }
  }

  /**
   * Checks whether either source buffer is currently updating.
   * @returns {boolean}
   */
  getUpdatingState() {
    return !!(this.audioBufferTrack.sourceBuffer?.getUpdatingState()) ||
           !!(this.videoBufferTrack.sourceBuffer?.getUpdatingState());
  }

  /**
   * Sets the timestamp offset on both source buffers.
   * @param {number} offset
   */
  setTimestampOffset(offset) {
    this.audioBufferTrack.sourceBuffer?.setTimestampOffset(offset);
    this.videoBufferTrack.sourceBuffer?.setTimestampOffset(offset);
  }

  /**
   * Enqueues a segment for appending to the appropriate buffer track.
   * @param {Object} segment - Media segment with mediaType and response data
   */
  enqueueSegment(segment) {
    if (segment.mediaType === MediaType.AUDIO) {
      this.audioEndReached = false;
    } else if (segment.mediaType === MediaType.VIDEO) {
      this.videoEndReached = false;
    }

    const track = this.bufferTrackMap[segment.mediaType];
    if (track) {
      track.appendQueue.push(segment);
    } else {
      assert(false);
    }
  }

  /**
   * Enqueues a header segment for the given media type.
   * @param {Object} segment - Header segment
   * @param {ArrayBuffer} headerData - Raw header data
   * @param {Object} streamInfo - Stream info including profile
   */
  enqueueHeaderSegment(segment, headerData, streamInfo) {
    const headerEntry = this._createHeaderEntry(segment.mediaType, headerData, streamInfo);

    if (!this.encryptedHeaderAppended && segment.mediaType === MediaType.VIDEO) {
      this._maybeForceEncryptedHeader(segment, streamInfo.profile);
      this.encryptedHeaderAppended = true;
    }

    this._pushToQueue(headerEntry);
  }

  /**
   * Registers a SourceBuffer for the given media type track.
   * @param {Object} sourceBuffer - The MSE SourceBuffer wrapper
   */
  registerSourceBuffer(sourceBuffer) {
    const track = this.bufferTrackMap[sourceBuffer.type];
    if (track) {
      try {
        track.sourceBuffer = sourceBuffer;
      } catch (error) {
        this.fireError(ErrorCode.PLAY_MSE_SOURCEADD, {
          mediaType: getMediaTypeString(sourceBuffer.type),
          details: initializeModel(error),
        });
      }
    }
  }

  /**
   * Releases references and marks the manager as closed.
   */
  closing() {
    this.htmlVideoElement = undefined;
    this.mediaSourceElement = undefined;
    this.closed = true;
  }

  /**
   * Fires a playback error unless the manager is already closed.
   * @param {string} errorCode
   * @param {Object} [details]
   * @param {*} [extra]
   */
  fireError(errorCode, details, extra) {
    if (!this.closed) {
      this.playerState.fireError(errorCode, details, extra);
    }
  }

  /**
   * Checks whether the buffer is sufficiently filled for smooth playback.
   * @param {number} currentTimeMs - Current playback position in ms
   * @returns {boolean}
   */
  isBufferSufficient(currentTimeMs) {
    const threshold = this._getBufferThreshold();
    return (
      this._isTrackBufferSufficient(this.audioBufferTrack, currentTimeMs, threshold) &&
      this._isTrackBufferSufficient(this.videoBufferTrack, currentTimeMs, threshold)
    );
  }

  /**
   * Clears all buffered segments and resets end-of-stream state.
   */
  clearAllBuffers() {
    [this.audioBufferTrack, this.videoBufferTrack].forEach((track) => {
      track.segments = [];
      track.lastAppended = undefined;
      track.appendQueue = [];
    });
    this.videoEndReached = false;
    this.audioEndReached = false;
    this.playerState.fireEvent(PlayerState.BUFFER_CLEARED);
  }

  // --- Private helpers ---

  /** @private */
  _getBufferThreshold() {
    return this.playerState.presentingState.value === PlayerState.WAITING
      ? this.optimalDecoderBufferMs
      : this.minDecoderBufferMs;
  }

  /** @private */
  _isTrackBufferSufficient(track, currentTimeMs, threshold) {
    const lastSegment = track.lastAppended?.segmentData;
    if (!track.sourceBuffer || (track.appendQueue.length === 0 && this._isTrackEnded(track))) {
      return true;
    }
    return (lastSegment && lastSegment.ptsEnd - currentTimeMs >= threshold) || false;
  }

  /** @private */
  _isTrackEnded(track) {
    return (
      (track.type === MediaBufferType.audioBufferedSegments && this.audioEndReached) ||
      (track.type === MediaBufferType.videoBufferedSegments && this.videoEndReached)
    );
  }

  /** @private */
  _createHeaderEntry(mediaType, data, streamInfo) {
    return {
      mediaType,
      isHeaderSegment: false,
      response: data,
      getRequestId() { return 'header'; },
      get isContentSegment() { return !this.isHeaderSegment; },
      profile: streamInfo.profile,
    };
  }

  /** @private */
  _pushToQueue(entry) {
    const track = this.bufferTrackMap[entry.mediaType];
    if (track) {
      track.appendQueue.push(entry);
    } else {
      assert(false);
    }
  }
}
