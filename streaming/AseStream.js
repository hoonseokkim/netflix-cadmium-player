/**
 * @module AseStream
 *
 * Base class representing a single adaptive streaming stream (audio, video, or
 * text) in the Netflix Cadmium player's Adaptive Streaming Engine (ASE).
 *
 * An AseStream holds all per-bitrate metadata for one selectable rendition of a
 * track: bitrate, content profile, VMAF quality scores, segment index, network
 * key, and buffer-fittability state. It delegates track-level properties (media
 * type, timescale, frame duration, track ID) to its parent AseTrack, and
 * session-level operations (header fetching, stream header lookup) to the
 * ViewableSession.
 *
 * Subclasses (e.g. AseAudioStream, AseVideoStream) extend this to add
 * media-type-specific behaviour such as codec capability checks and DRM
 * configuration.
 *
 * Original: Module_11031
 *
 * @dependencies
 *   Module 22970 - tslib helpers (__assign)
 *   Module 91176 - TimeUtil (tick / timescale arithmetic)
 *   Module 6198  - MediaType enum
 *   Module 52571 - assert utility
 *   Module 48170 - debug flags
 *   Module 92140 - AudioQualityScorer (internal_Klb)
 *   Module 50468 - MediaFragment (buildFunction)
 */

import { __assign } from '../tslib'; // Module 22970
import { TimeUtil } from '../timing/TimeUtil'; // Module 91176
import { MediaType } from '../media/MediaTypes'; // Module 6198
import { assert } from '../assert/Assert'; // Module 52571
import { debugFlags } from '../core/DebugFlags'; // Module 48170
import { AudioQualityScorer } from '../media/AudioQualityScorer'; // Module 92140
import { MediaFragment } from './MediaFragment'; // Module 50468

/**
 * Configuration object passed when constructing an AseStream.
 * @typedef {Object} AseStreamConfig
 * @property {number} streamIndex - Ordinal index of this stream within its track
 * @property {Object} segmentVmafData - Per-segment VMAF quality metadata
 * @property {Object} track - Parent AseTrack instance
 * @property {string} [i7a] - Text stream downloadable ID override
 * @property {*} [ck] - CDN key / content key reference
 * @property {boolean} [isPlayable=true] - Whether this stream is allowed to play
 * @property {*} [disallowedBy] - Reason/entity that disallowed this stream
 */

/**
 * Base class for an adaptive stream rendition in the ASE pipeline.
 *
 * Holds metadata for one specific bitrate/profile combination within a track,
 * including VMAF scores, buffer-fittability caching, segment indexing, and
 * serialisation helpers.
 */
export class AseStream {
    /**
     * @param {AseStreamConfig} streamDescriptor - Stream initialisation properties
     * @param {Object} config - Player/session configuration
     * @param {Object} [logger] - Optional console/logger instance
     */
    constructor(streamDescriptor, config, logger) {
        /** @type {Object} Player configuration */
        this.config = config;

        /** @type {Object|undefined} Logger / console reference */
        this.logger = logger;

        /** @type {TimeUtil} Presentation timestamp offset for this profile */
        this.profileTimestampOffset = TimeUtil.seekToSample;

        /** @type {boolean} Whether to apply profile-level timestamp offsets during streaming */
        this.applyProfileStreamingOffset = true;

        /**
         * Map of cached segment-level auxiliary data (e.g. per-fragment HTTP timing).
         * @type {Map<*, *>}
         */
        this._auxiliaryDataMap = new Map();

        /** @type {number} Ordinal stream index within the parent track */
        this._streamIndex = streamDescriptor.streamIndex;

        /** @type {Object} Raw VMAF quality metadata for segments */
        this.segmentVmafData = streamDescriptor.segmentVmafData;

        /** @type {Object} Parent AseTrack reference */
        this.track = streamDescriptor.track;

        /**
         * Network key from ELLA metadata (false for text streams).
         * @type {string|boolean}
         */
        this._networkKey = this.mediaType !== MediaType.TEXT_MEDIA_TYPE
            ? this.ellaMetadata.networkKey
            : false;

        /** @type {string|undefined} Text-stream downloadable ID override */
        this._textDownloadableId = streamDescriptor.i7a;

        /** @type {*} CDN / content key reference */
        this._contentKey = streamDescriptor.ck;

        const playable = streamDescriptor.isPlayable;
        /** @type {boolean} Whether this stream is currently allowed to play */
        this.isPlayable = playable === undefined ? true : playable;

        /** @type {*} Entity/reason that disallowed this stream */
        this.disallowedBy = streamDescriptor.disallowedBy;

        /** @type {boolean|undefined} Cached buffer-fittability result */
        this._fittableCache = undefined;

        /** @type {number} Download byte count for accounting */
        this._downloadedBytes = 0;

        /** @type {number} Download request count for accounting */
        this._downloadRequestCount = 0;

        /** @type {string|undefined} Current CDN URL */
        this.url = undefined;

        /** @type {*} Internal field (Zga) */
        this._lastRequestTimestamp = undefined;

        /** @type {*} Whether to adjust audio timestamps for live */
        this.liveAdjustAudioTimestamps = undefined;

        /** @type {*} Internal field (pv) */
        this._pendingData = undefined;

        /** @type {*} Internal field (b_a) */
        this._cachedSegmentData = undefined;

        /** @type {*} CDN location info */
        this.location = undefined;

        /** @type {number|undefined} Current buffer length for this stream */
        this.bufferLength = undefined;

        /** @type {*} Runtime configuration snapshot */
        this.runtimeConfig = undefined;

        /** @type {boolean} Whether this stream has been filtered out by ABR */
        this.isFiltered = false;

        /** @type {*} Internal field ($g) */
        this._headerData = undefined;

        /** @type {*} Internal field (gZa) */
        this._headerInfo = undefined;

        // Apply profile-level timestamp offset if configured
        const configRef = this.config;
        let offsetEntry = configRef
            && typeof configRef.profileTimestampOffsets === 'object'
            && configRef.profileTimestampOffsets[this.profile];

        if (typeof offsetEntry === 'object') {
            offsetEntry = offsetEntry[this.bitrate];
            if (offsetEntry) {
                this.profileTimestampOffset = new TimeUtil(offsetEntry.ticks, offsetEntry.timescale);
            }
        }

        /**
         * Whether this audio profile uses non-sync (non-keyframe) samples.
         * @type {boolean}
         */
        this.hasNonSyncSamples = configRef.audioProfilesNonSyncSamples?.indexOf(this.profile) >= 0;

        /**
         * Whether this stream supports random-access seeking (SAP).
         * Audio streams always support it; video streams support it for live,
         * baseline/main-profile H.264, and HEVC (except Dolby).
         * @type {boolean}
         */
        this.supportsRandomAccess = this.mediaType === MediaType.V
            ? true
            : this.mediaType === MediaType.U
                ? (this.isLive
                    || this.profileName.indexOf('h264bpl') !== -1
                    || this.profileName.indexOf('h264mpl') !== -1
                    || (this.profileName.indexOf('hevc') !== -1
                        && this.profileName.indexOf('do') === -1))
                : false;

        // Extract per-fragment VMAF data into a compact Uint8Array if enabled
        if (configRef.perFragmentVMAFConfig?.xed
            && this.mediaType === MediaType.U) {
            const vmafData = this.segmentVmafData;
            if (vmafData.segmentVmaf?.length > 0) {
                const rawVmaf = vmafData.segmentVmaf.splice(0, vmafData.segmentVmaf.length);
                const compactVmaf = new Uint8Array(rawVmaf.length);
                for (let i = 0; i < rawVmaf.length; i++) {
                    compactVmaf[i] = rawVmaf[i].vmaf;
                }
                this.segmentVmaf = compactVmaf;
            }
        }
    }

    // -----------------------------------------------------------------------
    // Computed properties (getters)
    // -----------------------------------------------------------------------

    /**
     * Marker property indicating this is an AseStream instance.
     * @type {boolean}
     */
    get isAseStream() {
        return true;
    }

    /**
     * The ViewableSession that owns this stream's parent track.
     * @type {Object}
     */
    get viewableSession() {
        return this.track.viewableSession;
    }

    /**
     * Session-level context object (J).
     * @type {Object}
     */
    get sessionContext() {
        return this.viewableSession.J;
    }

    /**
     * Playgraph ID for the current viewable session.
     * @type {string}
     */
    get playgraphId() {
        return this.viewableSession.playgraphId;
    }

    /**
     * Movie / content ID from the parent track.
     * @type {number}
     */
    get movieId() {
        return this.track.R;
    }

    /**
     * Media type enum value (AUDIO, VIDEO, or TEXT).
     * @type {number}
     */
    get mediaType() {
        return this.track.mediaType;
    }

    /**
     * Frame duration from the parent track.
     * @type {TimeUtil}
     */
    get frameDuration() {
        return this.track.frameDuration;
    }

    /**
     * Timescale value from the parent track.
     * @type {number}
     */
    get timescaleValue() {
        return this.track.timescaleValue;
    }

    /**
     * Sample multiplier from the parent track.
     * @type {number}
     */
    get sampleMultiplier() {
        return this.track.sampleMultiplier;
    }

    /**
     * Track ID from the parent track.
     * @type {number}
     */
    get trackId() {
        return this.track.trackId;
    }

    /**
     * Segment VMAF data (only for non-text streams).
     * @type {Object|undefined}
     */
    get vmafMetadata() {
        if (this.mediaType !== MediaType.TEXT_MEDIA_TYPE) {
            return this.segmentVmafData;
        }
    }

    /**
     * The ordinal stream index within its parent track.
     * @type {number}
     */
    get streamIndex() {
        return this._streamIndex;
    }

    /**
     * Downloadable ID: for text streams uses the override, otherwise ELLA metadata.
     * @type {string}
     */
    get downloadableId() {
        if (this.mediaType === MediaType.TEXT_MEDIA_TYPE) {
            return this._textDownloadableId ?? '';
        }
        return this.ellaMetadata.downloadable_id;
    }

    /**
     * Unique stream identifier (alias for selectedStreamId).
     * @type {*}
     */
    get id() {
        return this.selectedStreamId;
    }

    /**
     * Network key for CDN routing (false for text streams).
     * @type {string|boolean}
     */
    get networkKey() {
        return this._networkKey;
    }

    /**
     * Whether this stream belongs to an ad playgraph.
     * @type {boolean}
     */
    get isAdPlaygraph() {
        return this.track.isAdPlaygraph;
    }

    /**
     * Bitrate in kbps (0 for text streams).
     * @type {number}
     */
    get bitrate() {
        return this.mediaType === MediaType.TEXT_MEDIA_TYPE
            ? 0
            : this.ellaMetadata.bitrate;
    }

    /**
     * VMAF quality score for this stream.
     * For video streams, falls back to segment VMAF data.
     * @type {number|undefined}
     */
    get vmaf() {
        if (this.jra) return this.jra;
        if (this.mediaType === MediaType.U) {
            return this.segmentVmafData.vmaf ?? undefined;
        }
    }

    /**
     * Audio quality score computed from bitrate and profile.
     * Only applicable to non-audio streams (returns undefined for audio).
     * @type {number|undefined}
     */
    get audioQualityScore() {
        if (this.mediaType !== MediaType.V) {
            return AudioQualityScorer.internal_Klb
                .internal_Ywc()
                .audioQualityScore(this.bitrate, this.profile);
        }
        return undefined;
    }

    /**
     * Encoded resolution width (video streams only).
     * @type {number|undefined}
     */
    get resolutionWidth() {
        if (this.mediaType === MediaType.U) {
            return this.segmentVmafData.res_w || undefined;
        }
    }

    /**
     * Encoded resolution height (video streams only).
     * @type {number|undefined}
     */
    get resolutionHeight() {
        if (this.mediaType === MediaType.U) {
            return this.segmentVmafData.res_h || undefined;
        }
    }

    /**
     * Content profile name (e.g. "h264mpl30-dash-cenc", "hevc-main10-L40-dash").
     * Returns "timedtext" for text streams.
     * @type {string}
     */
    get profile() {
        return this.mediaType === MediaType.TEXT_MEDIA_TYPE
            ? 'timedtext'
            : this.ellaMetadata.content_profile;
    }

    /**
     * Alias for profile (content profile identifier).
     * @type {string}
     */
    get contentProfile() {
        return this.profile;
    }

    /**
     * Segment index (SIDX) data for video streams.
     * @type {*|undefined}
     */
    get segmentIndexData() {
        if (this.mediaType === MediaType.U) {
            return this.segmentVmafData.sidx;
        }
    }

    /**
     * Whether this audio profile uses non-sync samples.
     * @type {boolean}
     */
    get usesNonSyncSamples() {
        return this.hasNonSyncSamples;
    }

    /**
     * Event fired when the fragment index's ended state changes.
     * @type {*}
     */
    get endedChangedEvent() {
        return this.fragmentIndex && this.fragmentIndex.endedChangedEvent;
    }

    /**
     * Whether this stream can fit in the available buffer.
     * Uses cached value if available, otherwise computes it.
     * @type {boolean}
     */
    get fittableInBuffer() {
        return this._fittableCache !== undefined
            ? this._fittableCache
            : this._computeFittability();
    }

    set fittableInBuffer(value) {
        this._fittableCache = value;
    }

    /**
     * Whether this stream is ready for selection (playable and not filtered).
     * @type {boolean}
     */
    get isReadyForSelection() {
        return this.isPlayable && !this.isFiltered;
    }

    /**
     * Whether this stream is eligible for automatic ABR selection.
     * @type {boolean}
     */
    get isAutoSelectable() {
        return this.isReadyForSelection && this.canAutoSelect !== false;
    }

    /**
     * CDN / content key reference.
     * @type {*}
     */
    get ck() {
        return this._contentKey;
    }

    /**
     * Whether this stream requires an IDR-only mode workaround for H.264 main profile.
     * Checks that the fragment index header has been received and that the stream is
     * H.264 main profile without a known GOP structure.
     * @type {boolean}
     */
    get needsIdrOnlyMode() {
        assert(!!this.fragmentIndex, 'Initial header should have been received already');
        return this.viewableSession.vYa()
            && this.profileName.indexOf('h264mpl') > -1
            && this.fragmentIndex.KOa === undefined;
    }

    // -----------------------------------------------------------------------
    // Instance methods
    // -----------------------------------------------------------------------

    /**
     * Returns a human-readable bitrate string (e.g. "1500kbps").
     * @returns {string}
     */
    getBitrateLabel() {
        return `${this.bitrate}kbps`;
    }

    /**
     * Fetches the stream header from the viewable session.
     * @returns {Object|undefined} Stream header object
     */
    getStreamHeader() {
        return this.viewableSession.getStreamHeader(this.mediaType, this.selectedStreamId);
    }

    /**
     * Returns the fragment index from the current stream header, if available.
     * @returns {Object|undefined} Fragment index
     */
    getFragmentIndexFromHeader() {
        const header = this.getStreamHeader();
        return header && header.stream.fragmentIndex;
    }

    /**
     * Initiates a media segment download via the viewable session.
     * @param {*} fragmentRef - Fragment reference
     * @param {*} options - Download options
     * @returns {*} Download result / promise
     */
    initiateDownload(fragmentRef, options) {
        return this.viewableSession.IC(this, fragmentRef, options);
    }

    /**
     * Signals the parent track that content has been appended (c1a).
     */
    notifyContentAppended() {
        this.track.c1a();
    }

    /**
     * Signals the parent track that a buffer operation completed (bxa).
     */
    notifyBufferOperationComplete() {
        this.track.bxa();
    }

    /**
     * Creates a MediaFragment for the segment at the given index.
     * @param {number} segmentIndex - Zero-based segment index
     * @returns {MediaFragment} A new MediaFragment instance
     */
    getSegmentAtIndex(segmentIndex) {
        if (debugFlags.u) {
            assert(
                this.fragmentIndex && segmentIndex >= 0 && segmentIndex < this.fragmentIndex.length
            );
        }
        return new MediaFragment(this, undefined, this.fragmentIndex.key(segmentIndex));
    }

    /**
     * Transfers a fragment reference from another stream of the same track,
     * preserving any edit-window and sample-version metadata.
     * @param {MediaFragment} sourceFragment - Fragment from another stream on the same track
     * @returns {MediaFragment} A new MediaFragment for this stream at the same index
     */
    transferFragment(sourceFragment) {
        if (debugFlags.u) {
            assert(sourceFragment instanceof MediaFragment);
            assert(this.trackId === sourceFragment.stream.trackId);
        }

        const newFragment = this.getSegmentAtIndex(sourceFragment.index);

        if (sourceFragment.ase_location_history) {
            newFragment.setEditWindow(sourceFragment.ase_location_history);
            newFragment.setSampleVersion(sourceFragment.sv);

            if (debugFlags.u && this.logger) {
                this.logger.pauseTrace(
                    'AseStream: other stream fragment: '
                    + JSON.stringify(sourceFragment)
                    + ' transferring edit:'
                    + JSON.stringify(sourceFragment.ase_location_history)
                );
            }
        }

        return newFragment;
    }

    /**
     * Stores auxiliary data for a given key (e.g. per-fragment HTTP timing).
     * @param {*} key
     * @param {*} value
     */
    setAuxiliaryData(key, value) {
        this._auxiliaryDataMap.set(key, value);
    }

    /**
     * Retrieves auxiliary data for a given key.
     * @param {*} key
     * @returns {*}
     */
    getAuxiliaryData(key) {
        return this._auxiliaryDataMap.key(key);
    }

    /**
     * Updates download accounting counters.
     * @param {number} bytes - Bytes downloaded
     * @param {number} requestCount - Number of requests made
     */
    updateDownloadAccounting(bytes, requestCount) {
        this._downloadedBytes = bytes;
        this._downloadRequestCount = requestCount;
    }

    /**
     * Resets transient download/location state to undefined.
     * Called when switching CDN locations or after errors.
     */
    resetConnectionState() {
        this.bufferLength = undefined;
        this.runtimeConfig = undefined;
        this.liveAdjustAudioTimestamps = undefined;
        this.location = undefined;
        this.url = undefined;
    }

    /**
     * Builds a stream descriptor object for logging/telemetry, dispatching
     * to the appropriate media-type-specific serialiser.
     * @returns {Object} Stream descriptor
     */
    parseStream() {
        switch (this.mediaType) {
            case MediaType.V:
                return this._parseAudioStream();
            case MediaType.U:
                return this._parseVideoStream();
            case MediaType.TEXT_MEDIA_TYPE:
                return this._parseTextStream();
            default:
                assert(false, `Unsupported mediaType: ${this.mediaType}`);
        }
    }

    /**
     * Serialises this stream to a plain JSON-friendly object.
     * @returns {Object}
     */
    toJSON() {
        return {
            movieId: this.movieId,
            mediaType: this.mediaType,
            streamId: this.selectedStreamId,
            bitrate: this.bitrate,
            streamIndex: this.streamIndex,
            isAvailable: this.isPlayable,
            fittable: this.canAutoSelect,
            vmaf: this.vmaf,
            resolutionWidth: this.resolutionWidth,
            resolutionHeight: this.resolutionHeight,
        };
    }

    /**
     * Returns a compact string identifier: "a:<id>:<bitrate>" or "v:<id>:<bitrate>".
     * @returns {string}
     */
    toString() {
        const prefix = this.mediaType === 0 ? 'a' : 'v';
        return `${prefix}:${this.selectedStreamId}:${this.bitrate}`;
    }

    // -----------------------------------------------------------------------
    // Private helpers
    // -----------------------------------------------------------------------

    /**
     * Computes whether this stream's bitrate can fit in the available buffer.
     * Caches the result on the track for subsequent lookups.
     * @private
     * @returns {boolean}
     */
    _computeFittability() {
        // Before headers arrive, assume fittable
        if (!this.headerReceived) return true;

        // Fast paths using track-level cached thresholds
        if (this.track.vXa >= this.bitrate) {
            return (this._fittableCache = true);
        }
        if (this.track.CIb <= this.bitrate) {
            return (this._fittableCache = false);
        }

        if (debugFlags.u && this.logger) {
            this.logger.pauseTrace(
                'isStreamFittableInBuffer: minRequiredBuffer ' + this.config.minRequiredBuffer
            );
        }

        const fittable = this.apa();

        if (fittable) {
            // Update "highest fittable" threshold unless specific conditions prevent it
            if (!(this.track.a3a && !this.networkKey && this.track.contentProfile)) {
                this.track.vXa = this.bitrate;
            }
        } else {
            // Update "lowest non-fittable" threshold
            this.track.CIb = this.bitrate;
        }

        return (this._fittableCache = fittable);
    }

    /**
     * Builds a video stream descriptor by merging track-level data with profile name.
     * @private
     * @returns {Object}
     */
    _parseVideoStream() {
        return {
            ...this.track.parseStream(),
            profile: this.profileName,
        };
    }

    /**
     * Builds an audio stream descriptor by merging track-level data with profile and bitrate.
     * @private
     * @returns {Object}
     */
    _parseAudioStream() {
        return {
            ...this.track.parseStream(),
            profile: this.profileName,
            bitrate: this.bitrate,
        };
    }

    /**
     * Builds a text stream descriptor by merging track-level data with profile name.
     * @private
     * @returns {Object}
     */
    _parseTextStream() {
        return {
            ...this.track.parseStream(),
            profile: this.profileName,
        };
    }
}

export default AseStream;
