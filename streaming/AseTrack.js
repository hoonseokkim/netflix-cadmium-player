/**
 * AseTrack - Base track class for Netflix's Adaptive Streaming Engine (ASE).
 *
 * Represents a media track (audio, video, or text) within a streaming session.
 * Manages downloadable streams, bitrate constraints, header data, frame duration,
 * and provides methods for fragment lookup and stream metadata serialization.
 *
 * Subclassed by AseAudioTrack (Module 1913 / internal_Zhb) and
 * AseVideoTrack (Module 92945 / ufb) which extend with header parsing logic.
 *
 * @module AseTrack
 * @webpack-module 26279
 * @export P5
 */

import { __read, __values } from '../../tslib';
import { MediaType } from '../types/MediaType';               // Module 6198 / 91176
import { assert } from '../assert/assert';                     // Module 52571
import { HeaderContainer } from '../classes/HeaderContainer';  // Module 69575 / internal_Blb
import { lookupSegmentByProperties, findLastFragment } from '../mp4/FragmentLookup'; // Module 65077
import { FrameRate } from '../timing/FrameRate';               // Module 444 / AG
import { Resolution } from '../classes/Resolution';            // Module 52629 / aY
import { isLiveStream } from '../live/LiveStreamUtil';         // Module 8149
import { DEBUG } from '../core/debug';                         // Module 48170
import { BitrateSource } from '../abr/BitrateSource';         // Module 91967 / XP
import { LiveDownloadable } from '../live/LiveDownloadable';   // Module 87225 / zGa
import { AseDownloadable } from '../streaming/AseDownloadable'; // Module 48834 / internal_Yhb

/**
 * @typedef {Object} AseTrackParams
 * @property {Object} trackMetadata - Metadata for the track from the manifest
 * @property {Object} viewableSession - The viewable session this track belongs to
 * @property {number} mediaType - The media type (audio, video, or text)
 * @property {number} trackIndex - Index of the track within its type
 * @property {number} STREAMING - Absolute track index across all types
 * @property {boolean} isReadyForPlayback - Whether this track is ready for initial playback
 */

/**
 * @typedef {Object} StreamConstraints
 * @property {Object|undefined} minBitrateConstraint - Minimum bitrate constraint with bitrate and reason
 * @property {Object|undefined} maxBitrateConstraint - Maximum bitrate constraint with bitrate and reason
 */

export class AseTrack {
  /**
   * @param {AseTrackParams} params - Track initialization parameters
   * @param {Object} config - Player configuration
   * @param {Object} console - Logger/console instance
   */
  constructor(params, config, console) {
    this.config = config;
    this.console = console;

    /** @type {Map<string, number>} Overrides for minimum bitrate keyed by source */
    this.minBitrateOverrides = new Map();
    /** @type {Map<string, number>} Overrides for maximum bitrate keyed by source */
    this.maxBitrateOverrides = new Map();
    /** @type {HeaderContainer} Container for parsed header data */
    this.headerContainer = new HeaderContainer();
    /** @type {number} Number of pending header requests */
    this._pendingHeaderRequests = 0;

    this.trackMetadata = params.trackMetadata;
    this.viewableSession = params.viewableSession;
    this.mediaType = params.mediaType;
    this.trackIndex = params.trackIndex;
    this.STREAMING = params.STREAMING;

    // Initialize media-type-specific properties
    if (this.mediaType === MediaType.VIDEO) {
      const metadata = this.trackMetadata;
      const firstStream = __read(metadata.streams, 1)[0];

      this._resolution = new Resolution(
        { w: metadata.maxWidth, h: metadata.maxHeight },
        { w: metadata.displayWidth, h: metadata.displayHeight }
      );

      if (firstStream.framerate_value !== undefined && firstStream.framerate_scale !== undefined) {
        this._frameRate = FrameRate.from({
          numerator: firstStream.framerate_value,
          denominator: firstStream.framerate_scale,
        });
        this._manifestFrameDuration = this._frameRate.frameDuration();
        if (DEBUG) {
          this.console.pauseTrace(
            'AseTrack: video frame duration normalized to ' +
              this._manifestFrameDuration.toString() +
              ' from ' +
              JSON.stringify(firstStream)
          );
        }
      }

      if (metadata.videoFrameRateNumerator !== undefined && metadata.videoFrameRateDenominator !== undefined) {
        this._videoFrameRate = FrameRate.from({
          numerator: metadata.videoFrameRateNumerator,
          denominator: metadata.videoFrameRateDenominator,
        });
      }
    } else if (this.mediaType === MediaType.AUDIO) {
      this._audioChannels = this.trackMetadata.streams[0].channels;
      this._audioSampleRate = 48000;
    }

    // Set the timescale value (frame duration reference)
    this._frameDurationRef = this._manifestFrameDuration;
    this._timescaleValue = this._frameDurationRef?.timescaleValue;

    if (this.mediaType === MediaType.TEXT_MEDIA_TYPE) {
      this._timescaleValue = 1000;
    }

    /** @type {boolean} Whether the track has been switched */
    this._switched = false;
    /** @type {number} Minimum bitrate floor */
    this._minBitrateFloor = -Infinity;
    /** @type {number} Maximum bitrate ceiling */
    this._maxBitrateCeiling = Infinity;

    // Parse streams into downloadable objects
    const parsed = AseTrack._parseStreams(this, params.isReadyForPlayback);
    this.contentProfile = parsed.contentProfile;
    this._minBitrate = parsed.minBitrate;
    this._maxBitrate = parsed.maxBitrate;

    /** @type {Array<AseDownloadable|LiveDownloadable>} All downloadable streams for this track */
    this.downloadables = parsed.downloadables;

    // Set initial bitrate constraints from manifest
    this._setBitrateOverrides(BitrateSource.manifestRef, parsed.maxBitrate, parsed.minBitrate);

    /** @type {Object} Map of stream ID to downloadable */
    this._downloadablesByStreamId = this.downloadables.reduce((map, downloadable) => {
      map[downloadable.selectedStreamId] = downloadable;
      return map;
    }, {});

    if (DEBUG) {
      assert(this.movieId !== undefined);
      assert(this.mediaType !== undefined);
      assert(
        this._frameDurationRef === undefined ||
          this._timescaleValue === this._frameDurationRef.timescaleValue
      );
    }

    if (DEBUG) {
      this.console.pauseTrace(
        `AseTrack: new track for movie ${this.movieId}, mediaType ${this.mediaType}` +
          `, viewableId ${this.viewableSession.viewableId}, track ${this.trackId}` +
          `, frameDuration ${this.frameDuration?.toString()}` +
          `, trackIndex ${this.trackIndex}` +
          `, absoluteTrackIndex ${this.STREAMING}`
      );
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Static Methods
  // ──────────────────────────────────────────────────────────────

  /**
   * Parses track metadata streams into downloadable objects and determines
   * bitrate bounds and content profile.
   *
   * @param {AseTrack} track - The track instance being initialized
   * @param {boolean} isReadyForPlayback - Whether the track is ready for playback
   * @returns {{ contentProfile: boolean, minBitrate: number, maxBitrate: number, downloadables: Array }}
   * @private
   */
  static _parseStreams(track, isReadyForPlayback) {
    const config = track.config;
    const isVideo = track.mediaType === MediaType.VIDEO;
    let contentProfile = false;
    let minBitrate = Infinity;
    let maxBitrate = 0;
    const downloadables = [];

    const DownloadableClass = isLiveStream(track) ? LiveDownloadable : AseDownloadable;

    if (track.mediaType === MediaType.AUDIO || track.mediaType === MediaType.VIDEO) {
      const metadata = track.trackMetadata;
      const hasNetworkKey = metadata.streams.some((stream) => stream.networkKey);

      metadata.streams.forEach((stream, index) => {
        const bitrate = stream.bitrate;
        let isPlayable = true;

        if (isVideo) {
          const networkKey = stream.networkKey;
          isPlayable = isReadyForPlayback ? true : networkKey === hasNetworkKey;
          contentProfile = contentProfile || networkKey;
        }

        if (isPlayable) {
          if (bitrate < minBitrate) minBitrate = bitrate;
          if (bitrate > maxBitrate) maxBitrate = bitrate;
        }

        const downloadable = new DownloadableClass(
          {
            streamData: stream,
            streamIndex: index,
            track,
            isPlayable,
          },
          config,
          track.console
        );
        downloadables.push(downloadable);
      });
    } else if (track.mediaType === MediaType.TEXT_MEDIA_TYPE) {
      const textMetadata = track.trackMetadata;
      const downloadableId = textMetadata.downloadableIds['imsc1.1'];

      if (DEBUG) {
        track.console.pauseTrace('parsing text track dlid:', downloadableId);
      }

      const textDownloadable = textMetadata.ttDownloadables['imsc1.1'];
      if (textDownloadable) {
        const downloadable = new DownloadableClass(
          {
            streamData: textDownloadable,
            streamIndex: 0,
            track,
            isPlayable: true,
            downloadableId,
            urls: [],
          },
          config,
          track.console
        );
        downloadables.push(downloadable);
        track.headerContainer.set(downloadable);
      }
    } else {
      // Other media types (e.g., auxiliary streams)
      const metadata = track.trackMetadata;
      metadata.streams.forEach((stream, index) => {
        const downloadable = new DownloadableClass(
          {
            streamData: stream,
            streamIndex: index,
            track,
            isPlayable: true,
          },
          config,
          track.console
        );
        downloadables.push(downloadable);
      });
    }

    return {
      contentProfile,
      minBitrate,
      maxBitrate,
      downloadables,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Getters (property accessors)
  // ──────────────────────────────────────────────────────────────

  /**
   * Whether this track needs an initial header fetch (no header received and no pending requests).
   * @returns {boolean}
   */
  get needsHeaderFetch() {
    return !this.headerReceived && this._pendingHeaderRequests === 0;
  }

  /**
   * Whether this track has been switched to a different stream.
   * @returns {boolean}
   */
  get isSwitched() {
    return this._switched;
  }

  /**
   * The movie ID string for this track's viewable session.
   * @returns {string}
   */
  get movieId() {
    return String(this.viewableSession.movieId);
  }

  /**
   * The track identifier.
   * @returns {string|number}
   */
  get trackId() {
    return this.mediaType === MediaType.TEXT_MEDIA_TYPE
      ? this.trackMetadata.id
      : this.trackMetadata.track_id;
  }

  /**
   * The codec value for this track.
   * @returns {string|undefined}
   */
  get codecValue() {
    return this._codecValue;
  }

  /**
   * The frame duration reference (timescale).
   * @returns {Object|undefined}
   */
  get frameDuration() {
    return this._frameDurationRef;
  }

  /**
   * The frame rate for this video track.
   * @returns {FrameRate|undefined}
   */
  get frameRate() {
    return this._frameRate;
  }

  /**
   * The video frame rate (from manifest metadata).
   * @returns {FrameRate|undefined}
   */
  get videoFrameRate() {
    return this._videoFrameRate;
  }

  /**
   * The video resolution descriptor.
   * @returns {Resolution|undefined}
   */
  get resolution() {
    return this._resolution;
  }

  /**
   * The number of audio channels.
   * @returns {number|undefined}
   */
  get channels() {
    return this._audioChannels;
  }

  /**
   * The audio sample rate.
   * @returns {number|undefined}
   */
  get sampleRate() {
    return this._audioSampleRate;
  }

  /**
   * The codec profile string.
   * @returns {string}
   */
  get profile() {
    return this.mediaType === MediaType.TEXT_MEDIA_TYPE
      ? this.trackMetadata.rawTrackType
      : this.trackMetadata.profile;
  }

  /**
   * The codec variant string.
   * @returns {string}
   */
  get codecVariant() {
    return this.mediaType === MediaType.TEXT_MEDIA_TYPE
      ? this.trackMetadata.rawTrackType
      : this.trackMetadata.codecVariant;
  }

  /**
   * The timescale value (duration per frame unit).
   * @returns {number|undefined}
   */
  get timescaleValue() {
    return this._timescaleValue;
  }

  /**
   * The sample multiplier for audio.
   * @returns {number|undefined}
   */
  get sampleMultiplier() {
    return this._sampleMultiplier;
  }

  /**
   * Frame duration info object with media type and duration details.
   * @returns {Object|undefined}
   */
  get unknownDuration() {
    return this._frameDurationInfo;
  }

  /**
   * The parsed header data value from the header container.
   * @returns {Object|undefined}
   */
  get headerData() {
    return this.headerContainer.value;
  }

  /**
   * The header container instance (internal access).
   * @returns {HeaderContainer}
   */
  get headerContainerRef() {
    return this.headerContainer;
  }

  /**
   * Whether any downloadable has multiple URLs (CDN redundancy).
   * @returns {boolean}
   */
  get hasMultipleCdnUrls() {
    return this.downloadables.some((d) => {
      return (d.urls?.length ?? 0) > 1;
    });
  }

  /**
   * Whether this track belongs to an ad playgraph.
   * @returns {boolean}
   */
  get isAdPlaygraph() {
    return this.viewableSession.isAdPlaygraph;
  }

  /**
   * The audio description flag for audio tracks.
   * @returns {*|undefined}
   */
  get audioDescription() {
    return this.mediaType === MediaType.AUDIO
      ? this.trackMetadata.audioDescription
      : undefined;
  }

  // ──────────────────────────────────────────────────────────────
  // Public Methods
  // ──────────────────────────────────────────────────────────────

  /**
   * Retrieves the downloadable stream for a given stream ID.
   * @param {string|number} streamId - The stream identifier
   * @returns {AseDownloadable|LiveDownloadable|undefined}
   */
  getStreamById(streamId) {
    return this._getDownloadableMap()[streamId];
  }

  /**
   * Returns the internal map of stream ID to downloadable.
   * @returns {Object}
   * @private
   */
  _getDownloadableMap() {
    return this._downloadablesByStreamId;
  }

  /**
   * Checks equality with another track by movie ID, media type, and track ID.
   * @param {AseTrack} other - The other track to compare
   * @returns {boolean}
   */
  equals(other) {
    return !!other && this.movieId === other.movieId && this.mediaType === other.mediaType && this.trackId === other.trackId;
  }

  /**
   * Increments the count of pending header requests.
   */
  incrementPendingHeaderRequests() {
    this._pendingHeaderRequests++;
  }

  /**
   * Decrements the count of pending header requests.
   */
  decrementPendingHeaderRequests() {
    if (DEBUG) {
      assert(this._pendingHeaderRequests > 0, 'Removing more header requests than opened');
    }
    if (this._pendingHeaderRequests > 0) {
      this._pendingHeaderRequests--;
    }
  }

  /**
   * Sets bitrate overrides for a given source (e.g., manifest, ABR, etc.).
   * @param {string} source - The source identifier for the override
   * @param {number} [maxBitrate] - Maximum bitrate override value
   * @param {number} [minBitrate] - Minimum bitrate override value
   * @private
   */
  _setBitrateOverrides(source, maxBitrate, minBitrate) {
    if (maxBitrate !== undefined && maxBitrate !== this.minBitrateOverrides.key(source)) {
      this.minBitrateOverrides.set(source, maxBitrate);
    }
    if (minBitrate !== undefined && minBitrate !== this.maxBitrateOverrides.key(source)) {
      this.maxBitrateOverrides.set(source, minBitrate);
    }
  }

  /**
   * Computes the effective bitrate constraints from all overrides,
   * including constraints from linked ad playgraph sessions.
   *
   * @returns {StreamConstraints} The resolved minimum and maximum bitrate constraints
   */
  getStreamConstraints() {
    let minConstraint;
    let maxConstraint;

    // Find the tightest min bitrate (lowest floor)
    this.minBitrateOverrides.forEach((bitrate, reason) => {
      if (minConstraint === undefined || bitrate < minConstraint.bitrate) {
        minConstraint = { bitrate, reason };
      }
    });

    // Find the tightest max bitrate (highest ceiling)
    this.maxBitrateOverrides.forEach((bitrate, reason) => {
      if (maxConstraint === undefined || bitrate > maxConstraint.bitrate) {
        maxConstraint = { bitrate, reason };
      }
    });

    // If not an ad and has a linked manifest, also consider its constraints
    if (!this.isAdPlaygraph && this.viewableSession.hasLinkedManifest) {
      const linkedManifest = this.viewableSession.linkedManifest;
      if (linkedManifest) {
        for (const linkedTrack of linkedManifest.getTracks(this.mediaType)) {
          linkedTrack.minBitrateOverrides.forEach((bitrate, reason) => {
            if (minConstraint === undefined || bitrate < minConstraint.bitrate) {
              minConstraint = { bitrate, reason };
            }
          });
          linkedTrack.maxBitrateOverrides.forEach((bitrate, reason) => {
            if (maxConstraint === undefined || bitrate > maxConstraint.bitrate) {
              maxConstraint = { bitrate, reason };
            }
          });
        }
      }
    }

    // Snap min constraint to nearest available bitrate
    if (maxConstraint !== undefined) {
      const sorted = this.downloadables.sort((a, b) => a.bitrate - b.bitrate);
      const eligible = sorted.filter((d) => d.bitrate >= maxConstraint.bitrate);
      if (eligible.length > 0) {
        maxConstraint.bitrate = eligible[0].bitrate;
      } else {
        this.console.pauseTrace(
          'No streams found for min encoding bitrate cap',
          maxConstraint.bitrate,
          'using highest bitrate stream'
        );
        maxConstraint.bitrate = sorted[sorted.length - 1].bitrate;
      }
    }

    return {
      maxBitrateConstraint: maxConstraint,
      minBitrateConstraint: minConstraint,
    };
  }

  /**
   * Called when the first header for this track is received.
   * Sets the header container if not already populated.
   *
   * @param {Object} stream - The stream whose header completed first
   */
  onFirstHeaderComplete(stream) {
    if (this.headerContainer.value === undefined) {
      if (DEBUG) {
        this.console.pauseTrace('first AseTrack.onHeaderComplete for stream:', stream.id);
      }
      this.headerContainer.set(stream);
    }
  }

  /**
   * Copies header and timing metadata from another AseTrack.
   * Used when transitioning between viewable sessions (e.g., pre-buffered content).
   *
   * @param {AseTrack} sourceTrack - The track to copy header data from
   */
  copyHeaderFrom(sourceTrack) {
    if (DEBUG) {
      assert(sourceTrack instanceof AseTrack);
    }
    if (DEBUG) {
      this.console.pauseTrace(
        'AseTrack: copying header to movie ' + this.movieId +
          ', track ' + this.trackId +
          ', mediaType ' + this.mediaType +
          ', from movie ' + sourceTrack.movieId +
          ', track ' + sourceTrack.trackId +
          ', mediaType ' + sourceTrack.mediaType +
          ', track.headerReceived ' + sourceTrack.headerReceived
      );
    }

    if (!this.headerReceived) {
      this.setTimescaleValue(sourceTrack.timescaleValue);
      this.setSampleMultiplier(sourceTrack.sampleMultiplier);
      this._setFrameDuration(sourceTrack.frameDuration);
      this._frameDurationInfo = sourceTrack.unknownDuration;

      if (sourceTrack.headerContainerRef.value) {
        this.headerContainer.set(sourceTrack.headerContainerRef.value);
      } else {
        this.headerContainer.markPending();
      }
    }
  }

  /**
   * Finds the first fragment at or after a given PTS using the parsed header data.
   *
   * @param {*} downloadable - The downloadable stream to search within
   * @param {*} pts - The presentation timestamp to search for
   * @param {*} [parentLastFragment] - The last fragment of the parent (for continuity)
   * @param {*} [extra] - Additional search parameters
   * @returns {*} The matching fragment, or undefined
   */
  findFirstFragment(downloadable, pts, parentLastFragment, extra) {
    assert(this.headerData);
    const header = this.headerData;
    const result = lookupSegmentByProperties(this.mediaType, downloadable, header, pts, parentLastFragment, extra);
    if (DEBUG) {
      this.console.pauseTrace(
        'AseTrack.findFirstFragment() pts:', pts,
        'parentLastFragment:', parentLastFragment?.toString(),
        'found:', result
      );
    }
    return result;
  }

  /**
   * Finds the last fragment at or before a given PTS using the parsed header data.
   *
   * @param {*} downloadable - The downloadable stream to search within
   * @param {*} pts - The presentation timestamp to search for
   * @param {*} [extra] - Additional search parameters
   * @returns {*} The matching fragment, or undefined
   */
  findLastFragment(downloadable, pts, extra) {
    assert(this.headerData);
    const header = this.headerData;
    const result = findLastFragment(this.mediaType, downloadable, header, pts, extra);
    if (DEBUG) {
      this.console.pauseTrace('AseTrack.findLastFragment() pts:', pts, 'found:', result);
    }
    return result;
  }

  /**
   * Serializes stream metadata for reporting/telemetry based on media type.
   * @returns {Object} Media-type-specific stream information
   */
  getStreamInfo() {
    switch (this.mediaType) {
      case MediaType.AUDIO: {
        assert(this.mediaType === MediaType.AUDIO);
        assert(this.channels !== undefined);
        assert(this.sampleRate !== undefined);
        return {
          channels: this.channels,
          profile: this.profile,
          codecVariant: this.codecVariant,
          bitrate: this.downloadables[this.downloadables.length - 1].bitrate,
          sampleRate: this.sampleRate,
          codecValue: this.codecValue,
        };
      }
      case MediaType.VIDEO: {
        assert(this.mediaType === MediaType.VIDEO);
        assert(this.videoFrameRate !== undefined);
        assert(this.resolution !== undefined);
        return {
          viewableId: this.viewableSession.viewableId,
          contentProfile: this.contentProfile,
          profile: this.profile,
          framerateNumerator: this.videoFrameRate.numeratorValue,
          framerateDenominator: this.videoFrameRate.denominator,
          codecVariant: this.codecVariant,
          resolution: this.resolution,
          maxWidth: this.resolution.resolution.w,
          maxHeight: this.resolution.resolution.h,
          displayWidth: this.resolution.displayResolution.w,
          displayHeight: this.resolution.displayResolution.h,
          codecValue: this.codecValue,
        };
      }
      case MediaType.TEXT_MEDIA_TYPE: {
        assert(this.mediaType === MediaType.TEXT_MEDIA_TYPE);
        return {
          profile: this.profile,
          codecVariant: this.codecVariant,
        };
      }
      default:
        assert(false, `Unsupported mediaType: ${this.mediaType}`);
    }
  }

  /**
   * Serializes this track to a minimal JSON representation.
   * @returns {{ movieId: string, mediaType: number, trackId: string|number }}
   */
  toJSON() {
    return {
      movieId: this.movieId,
      mediaType: this.mediaType,
      trackId: this.trackId,
    };
  }

  /**
   * Returns a compact string representation (e.g., "a:12345" or "v:67890").
   * @returns {string}
   */
  toString() {
    return (this.mediaType === 0 ? 'a' : 'v') + ':' + this.trackId;
  }

  // ──────────────────────────────────────────────────────────────
  // Protected / Internal Methods
  // ──────────────────────────────────────────────────────────────

  /**
   * Sets the timescale value (duration per sample or frame).
   * @param {number} value - The timescale value
   */
  setTimescaleValue(value) {
    if (DEBUG) {
      assert(
        this._timescaleValue === undefined || this._timescaleValue === value
      );
    }
    this._timescaleValue = value;
  }

  /**
   * Sets the sample multiplier for audio decoding.
   * @param {number} value - The sample multiplier
   */
  setSampleMultiplier(value) {
    if (DEBUG) {
      assert(
        this._sampleMultiplier === undefined || this._sampleMultiplier === value
      );
    }
    this._sampleMultiplier = value;
  }

  /**
   * Updates the frame duration reference and recalculates frame rate for video.
   * @param {Object} duration - The new frame duration object
   * @private
   */
  _setFrameDuration(duration) {
    if (DEBUG) {
      assert(duration !== undefined);
    }
    const normalized = new FrameRate(duration.timescaleValue, duration.scale).frameDuration();
    if (DEBUG) {
      assert(
        this._frameDurationRef === undefined || this._frameDurationRef.equal(normalized)
      );
    }
    this._frameDurationRef = duration;
    if (this.mediaType === MediaType.VIDEO) {
      this._frameRate = FrameRate.fromDuration(duration);
    }
  }
}

export { AseTrack };
