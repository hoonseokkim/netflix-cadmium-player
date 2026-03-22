/**
 * Netflix Cadmium Player - PaddingBranch
 *
 * A specialized streaming branch that generates audio and video padding frames
 * to fill gaps between content segments. Padding branches produce silence (audio)
 * and blank/repeated frames (video) that are inserted at segment boundaries to
 * ensure seamless playback transitions.
 *
 * Extends BranchBase (Module 58049) and overrides stream/request management
 * to serve synthetic padding content rather than real media data.
 *
 * @module PaddingBranch
 * @see Module 58049 - BranchBase (parent class)
 * @see Module 27259 - PaddingCodecSelector
 * @see Module 70842 - Branch factory that instantiates PaddingBranch
 */

import { __extends, __awaiter, __generator } from '../../core/runtime';
import { TimeUtil, Deferred } from '../../timing/TimeUtil';
import { platform } from '../../core/platform';
import { MediaType } from '../../media/MediaType';
import { outputList } from '../../utils/outputList';
import { RequestQueue } from '../../streaming/RequestQueue';
import { assert } from '../../assert/assert';
import { createScopedConsole } from '../../utils/createScopedConsole';
import { StreamingSessionManager } from '../../streaming/StreamingSessionManager';
import { getAudioCodecString } from '../../media/AudioCodecUtil';
import { PaddingCodecSelector } from './PaddingCodecSelector';
import { BranchBase } from './BranchBase';

/**
 * State of a padding branch request lifecycle.
 * @enum {number}
 */
export const PaddingBranchState = Object.freeze({
    CREATED: 0,
    CANCELLED: 1,
});

/**
 * A branch that generates synthetic padding frames (audio silence and video blanks)
 * to fill timing gaps between real content segments during adaptive streaming.
 *
 * Padding branches are created by the branch factory when the player configuration
 * indicates padding is needed (config.$D is true) and the segment matches the
 * current viewable. They produce RequestQueue entries containing padding fragment
 * requests that are processed by the streaming pipeline.
 *
 * @extends BranchBase
 */
export class PaddingBranch extends BranchBase {
    /**
     * @param {Object} console - Scoped console/logger instance
     * @param {Object} segment - The current segment descriptor
     * @param {Object} qualityDescriptor - Quality/offset descriptor for the branch
     * @param {Function} getParentCallback - Callback to retrieve the parent branch
     * @param {Object} viewableSession - Session metadata for the current viewable
     * @param {Object} config - Padding configuration options
     */
    constructor(console, segment, qualityDescriptor, getParentCallback, viewableSession, config) {
        super(
            segment,
            getParentCallback,
            qualityDescriptor,
            TimeUtil.seekToSample,
            createScopedConsole(platform, console, 'AsePadding')
        );

        /** @type {Object} The viewable session associated with this padding branch */
        this.viewableSession = viewableSession;

        /** @type {Object} Configuration for padding behavior */
        this.config = config;

        /** @type {RequestQueue} Queue for video padding fragment requests */
        this.videoRequestQueue = new RequestQueue(this.console);

        /** @type {RequestQueue} Queue for audio padding fragment requests */
        this.audioRequestQueue = new RequestQueue(this.console);

        /** @type {Deferred} Deferred that resolves when initialization is complete */
        this.initDeferred = new Deferred();

        /** @type {Object} Codec selector for choosing appropriate padding codecs */
        this.paddingCodecSelector = new PaddingCodecSelector(config).create();

        this.console.pauseTrace(`PaddingBranch {${segment.id}}: created`);
    }

    /**
     * Loads audio padding frames and enqueues them into the audio request queue.
     * Retrieves audio stream metadata from the parent branch and creates padding
     * fragment requests through the streaming session manager.
     *
     * @param {Object} segmentBoundary - The time boundary for padding generation
     * @returns {Promise<void>}
     * @private
     */
    async loadAndEnqueueAudioPadding(segmentBoundary) {
        const audioMeta = await this.loadAudioPaddingFrames();
        const { durationValue, codecString, bitrate, codecValue } = audioMeta;

        const scopedConsole = createScopedConsole(platform, this.console, '[0]');
        this.audioRequestQueue = new RequestQueue(scopedConsole);

        const fragments = StreamingSessionManager.instance().yha.POb(
            this.viewableSession,
            durationValue,
            codecString,
            bitrate,
            codecValue,
            segmentBoundary,
            this.currentSegment,
            this.computeTimestampOffset.bind(this),
            this.config,
            scopedConsole
        );

        for (const fragment of fragments) {
            this.audioRequestQueue.enqueue(fragment);
        }
        this.audioRequestQueue.prioritizeBranch();
    }

    /**
     * Loads video padding frames and enqueues them into the video request queue.
     * Retrieves video stream metadata from the parent branch, selects appropriate
     * padding codec/framerate, and creates padding fragment requests.
     *
     * @param {Object} segmentBoundary - The time boundary for padding generation
     * @returns {Promise<void>}
     * @private
     */
    async loadVideoPaddingFrames(segmentBoundary) {
        const videoMeta = await this.getVideoPaddingMetadata();
        const { profile, zD: resolution, codecValue } = videoMeta;

        const frameRate = this.parent?.$d(MediaType.U)?.track.frameDuration?.K3a();
        assert(frameRate, 'padding branches should always have a frameRate');

        const scopedConsole = createScopedConsole(platform, this.console, '[0]');

        const selectedCodec = this.paddingCodecSelector.MRb({
            profile,
            frameRate,
        });
        const { profile: selectedProfile, frameRate: selectedFrameRate } = selectedCodec;

        const result = StreamingSessionManager.instance().yha.QOb(
            this.viewableSession,
            this.viewableSession.m4c,
            selectedProfile,
            selectedFrameRate,
            resolution,
            codecValue,
            segmentBoundary,
            this.currentSegment,
            this.computeTimestampOffset.bind(this),
            scopedConsole
        );

        const { duration, fragmentIndex } = result;

        this.currentSegment.CSb([]);

        for (const fragment of fragmentIndex) {
            this.videoRequestQueue.enqueue(fragment);
        }
        this.videoRequestQueue.prioritizeBranch();

        this.paddingDuration = duration;
        this.viewableSession.lS = duration.playbackSegment;
    }

    /**
     * Whether this branch is a padding branch.
     * @type {boolean}
     * @readonly
     */
    get Pk() {
        return true;
    }

    /**
     * Whether this branch supports dynamic quality changes.
     * @type {boolean}
     * @readonly
     */
    get Dk() {
        return true;
    }

    /**
     * The buffer level for this branch (always 0 for padding).
     * @type {number}
     * @readonly
     */
    get bL() {
        return 0;
    }

    /**
     * Whether initialization has completed.
     * @type {boolean}
     * @readonly
     */
    get ag() {
        return this.initDeferred.aO;
    }

    /**
     * Promise that resolves when the branch is fully initialized.
     * @type {Promise<void>}
     * @readonly
     */
    get UO() {
        return this.initDeferred.promise;
    }

    /**
     * Immediately resolved promise (padding has no async preparation needed).
     * @type {Promise<void>}
     * @readonly
     */
    get PBa() {
        return Promise.resolve();
    }

    /**
     * Whether this branch is operational (always true for padding).
     * @type {boolean}
     * @readonly
     */
    get om() {
        return true;
    }

    /**
     * The timescale value for this branch's segment boundary.
     * @type {number}
     * @readonly
     */
    get O() {
        return this.segmentBoundary.timescaleValue;
    }

    /**
     * Content start ticks in the current timescale.
     * @type {number}
     * @readonly
     */
    get Cb() {
        return this.currentSegment.startTime.downloadState(this.timescaleValue).$;
    }

    /**
     * Content end ticks (start ticks plus segment boundary).
     * @type {number}
     * @readonly
     */
    get Pb() {
        return this.contentStartTicks + this.segmentBoundary.$;
    }

    /**
     * Quality descriptor ticks in the current timescale.
     * @type {number}
     * @readonly
     */
    get Xp() {
        return this.qualityDescriptor.downloadState(this.timescaleValue).$;
    }

    /**
     * Start time relative to quality descriptor.
     * @type {Object}
     * @readonly
     */
    get lI() {
        return this.currentSegment.startTime.item(this.qualityDescriptor);
    }

    /**
     * Exit zone time (not supported for padding segments; asserts if exit zone exists).
     * @type {Object}
     * @readonly
     */
    get f0() {
        assert(!this.currentSegment.km, 'exit zone not supported for padding segments');
        return TimeUtil.seekToSample;
    }

    /**
     * Whether all request queues (both audio and video) have completed.
     * @type {boolean}
     * @readonly
     */
    get TY() {
        return this.audioRequestQueue && this.videoRequestQueue
            ? this.audioRequestQueue.mI && this.videoRequestQueue.mI
            : false;
    }

    /**
     * Whether any request queues exist.
     * @type {boolean}
     * @readonly
     */
    get XOa() {
        return !(!this.audioRequestQueue && !this.videoRequestQueue);
    }

    /**
     * Branch start time relative to quality descriptor.
     * @type {Object}
     * @readonly
     */
    get bx() {
        return this.currentSegment.startTime.item(this.qualityDescriptor);
    }

    /**
     * Branch end time relative to quality descriptor.
     * @type {Object}
     * @readonly
     */
    get tU() {
        return this.currentSegment.endTime.item(this.qualityDescriptor);
    }

    /**
     * Previous state of the branch (presentation start time).
     * @type {Object}
     * @readonly
     */
    get Nua() {
        return this.previousState;
    }

    /**
     * Previous state (alias for backwards compatibility).
     * @type {Object}
     * @readonly
     */
    get Hk() {
        return this.previousState;
    }

    /**
     * The branch offset / quality descriptor.
     * @type {Object}
     * @readonly
     */
    get Qd() {
        return this.gD;
    }

    /**
     * The effective duration of this padding branch.
     * Falls back to computing duration from segment start/end times.
     * @type {Object}
     * @readonly
     */
    get BT() {
        return this.paddingDuration
            || this.currentSegment.endTime.lowestWaterMarkLevelBufferRelaxed(this.currentSegment.startTime);
    }

    /**
     * Seek-to-sample time (always returns the zero/seek sample for padding).
     * @type {Object}
     * @readonly
     */
    get Gz() {
        return TimeUtil.seekToSample;
    }

    /**
     * Initializes the padding branch. Waits for the parent branch to be ready,
     * then generates padding fragments for both audio and video media types.
     *
     * @returns {Promise<void>}
     * @override
     */
    async data() {
        await super.data();

        try {
            if (this.parent) {
                await this.parent.UO;
            }

            this.console.pauseTrace(`PaddingBranch {${this.currentSegment.id}}: init`);
            this.paddingDuration = this.currentSegment.endTime
                .lowestWaterMarkLevelBufferRelaxed(this.currentSegment.startTime);

            await this.refreshPaddingFragments([MediaType.V, MediaType.U]);
            this.initDeferred.resolve();
        } catch (error) {
            if (!this.isCancelledFlag) {
                throw error;
            }
        }
    }

    /**
     * Returns an async iterator over pending requests for the given media type.
     * Audio requests come from audioRequestQueue, video from videoRequestQueue.
     * Other types fall back to the base class unavailable-media handler.
     *
     * @param {string} mediaType - The media type to get requests for
     * @returns {Promise<AsyncIterator>}
     * @override
     */
    async getRequestIterator(mediaType) {
        this.console.pauseTrace(
            `PaddingBranch {${this.currentSegment.id}}: getRequestIterator(${mediaType})`
        );

        if (mediaType === MediaType.V) {
            return this.audioRequestQueue.ase_Yra();
        }
        if (mediaType === MediaType.U) {
            return this.videoRequestQueue.ase_Yra();
        }
        return this.NCb(mediaType);
    }

    /**
     * No-op create method. Padding branches are fully initialized in the constructor.
     * @override
     */
    create() {}

    /**
     * Cancels streaming for this padding branch, clears duration state,
     * emits a branchDestroyed event, and removes all event listeners.
     *
     * @param {string} [reason='other'] - The cancellation reason
     * @override
     */
    cancelStreaming(reason = 'other') {
        super.cancelStreaming(reason);
        this.requestState = PaddingBranchState.CANCELLED;
        this.paddingDuration = undefined;
        this.events.emit('branchDestroyed', {
            type: 'branchDestroyed',
            reason,
        });
        this.events.removeAllListeners();
    }

    /**
     * Padding branches are always ready for playback.
     * @returns {boolean} Always true
     * @override
     */
    isReadyForPlayback() {
        return true;
    }

    /**
     * No-op - padding branches do not have child stream selectors.
     * @override
     */
    $d() {}

    /**
     * Checks whether this branch supports the given media type.
     * Padding branches support audio (V) and video (U) only.
     *
     * @param {string} mediaType - The media type to check
     * @returns {boolean}
     * @override
     */
    supportsMediaType(mediaType) {
        return [MediaType.V, MediaType.U].some((type) => type === mediaType);
    }

    /**
     * Returns an empty array (padding branches have no track-level data).
     * @returns {Array}
     * @override
     */
    $A() {
        return [];
    }

    /**
     * Delegates to parent branch's streamBundle.
     *
     * @param {*} value - Parameter passed to parent's streamBundle
     * @returns {*}
     * @override
     */
    streamBundle(value) {
        return this.parent?.streamBundle(value);
    }

    /**
     * Returns an empty array (no returning data for padding).
     * @returns {Array}
     * @override
     */
    returning() {
        return [];
    }

    /**
     * No-op method.
     * @override
     */
    noop() {}

    /**
     * Returns the playback start time for this branch.
     * @returns {number} Start time in playback units
     * @override
     */
    getStartTime() {
        return this.segmentBoundary.playbackSegment;
    }

    /**
     * Returns an empty buffer status (padding has no buffer metrics).
     * @returns {Object}
     * @override
     */
    getBufferStatus() {
        return {};
    }

    /**
     * Returns the playback end time for this branch.
     * @returns {number} End time in playback units
     * @override
     */
    getEndTime() {
        return this.currentSegment.endTime.playbackSegment;
    }

    /**
     * Resumes playback by waiting for initialization and parent readiness,
     * then refreshes padding fragments for the specified media types.
     *
     * @param {*} _v - Unused
     * @param {*} _w - Unused
     * @param {*} _x - Unused
     * @param {Array<string>} mediaTypes - Media types to refresh
     * @returns {Promise<void>}
     * @override
     */
    async canResume(_v, _w, _x, mediaTypes) {
        await this.initDeferred.promise;
        if (this.parent) {
            await this.parent.UO;
        }
        await this.refreshPaddingFragments(mediaTypes);
    }

    /**
     * Clears and reloads padding fragments for the specified media types.
     * For video (U), reloads video padding frames from the parent's metadata.
     * For audio (V), reloads audio padding frames from the parent's metadata.
     *
     * @param {Array<string>} mediaTypes - Which media types to refresh
     * @returns {Promise<void>}
     * @private
     */
    async refreshPaddingFragments(mediaTypes) {
        if (mediaTypes.indexOf(MediaType.U) !== -1) {
            this.videoRequestQueue.clear();
            await this.loadVideoPaddingFrames(this.segmentBoundary);
        }

        if (mediaTypes.indexOf(MediaType.V) !== -1) {
            this.audioRequestQueue.clear();
            this.console.pauseTrace(
                `AsePaddingBranch {${this.currentSegment.id}}: video duration ${this.segmentBoundary.ca()}`
            );
            await this.loadAndEnqueueAudioPadding(this.segmentBoundary);
        }
    }

    /**
     * Returns an empty array (padding URLs are not updateable).
     * @returns {Array}
     * @override
     */
    updateRequestUrls() {
        return [];
    }

    /**
     * Checks whether a given time falls within this branch's range.
     *
     * @param {Object} time - The time to check
     * @returns {boolean} True if time is between previousState and timestamp
     * @override
     */
    isWithinRange(time) {
        return !!(this.previousState?.greaterThan(time) && this.timestamp?.lessThan(time));
    }

    /**
     * Returns the segment boundary for this branch.
     * @returns {Object}
     * @override
     */
    getSegmentBoundary() {
        return this.segmentBoundary;
    }

    /**
     * Padding branches are never the last segment.
     * @returns {boolean} Always false
     * @override
     */
    isLastSegment() {
        return false;
    }

    /**
     * Serializes this branch to a JSON-compatible object for diagnostics.
     *
     * @returns {{ segment: string, viewableId: *, contentStartPts: number|undefined, contentEndPts: number|undefined }}
     * @override
     */
    toJSON() {
        return {
            segment: this.currentSegment.id,
            viewableId: this.viewableId.J,
            contentStartPts: this.presentationStartTime?.playbackSegment,
            contentEndPts: this.segmentEndTime?.playbackSegment,
        };
    }

    /**
     * Retrieves video padding metadata from the parent branch's video stream.
     * Waits for the parent's video stream list to be populated if not yet available.
     *
     * @returns {Promise<{ profile: string, zD: *, codecValue: * }>}
     * @private
     */
    async getVideoPaddingMetadata() {
        let videoStreamList = this.parent?.$d(MediaType.U)?.configObject.elementList;

        if (!videoStreamList) {
            await this.parent?.$d(MediaType.U)?.configObject.MXb;

            if (this.isCancelledFlag) {
                return Promise.reject();
            }
        }

        videoStreamList = this.parent?.$d(MediaType.U)?.configObject.elementList;
        assert(videoStreamList, 'Parent of padding branch must have last selected video stream');

        const resolution = videoStreamList.track.resolution?.zD;
        const codecValue = videoStreamList.track.codecValue;
        const profile = videoStreamList.profileName;

        return { profile, zD: resolution, codecValue };
    }

    /**
     * Retrieves audio padding metadata from the parent branch's audio stream.
     * Waits for the parent's audio stream list to be populated if not yet available.
     *
     * @returns {Promise<{ durationValue: Object, codecString: string, bitrate: number, codecValue: * }>}
     * @private
     */
    async loadAudioPaddingFrames() {
        let audioStreamList = this.parent?.$d(MediaType.V)?.configObject.elementList;

        if (!audioStreamList) {
            await this.parent?.$d(MediaType.V)?.configObject.MXb;

            if (this.isCancelledFlag) {
                return Promise.reject();
            }
        }

        audioStreamList = this.parent?.$d(MediaType.V)?.configObject.elementList;
        assert(audioStreamList, 'Parent of padding branch must have last selected audio stream');

        const durationValue = audioStreamList.durationValue || TimeUtil.seekToSample;
        const codecString = getAudioCodecString(audioStreamList.profile);
        const bitrate = audioStreamList.bitrate;
        const codecValue = audioStreamList.track.codecValue;

        return { durationValue, codecString, bitrate, codecValue };
    }

    /**
     * Computes a timestamp offset for a padding fragment at the given position.
     *
     * @param {*} position - The position value
     * @param {*} timescale - The timescale to convert to
     * @returns {number} The computed offset in ticks
     * @private
     */
    computeTimestampOffset(position, timescale) {
        return this.gD.item(timescale).downloadState(position).$;
    }

    /**
     * Returns an empty array (no pending stream segments).
     * @returns {Array}
     * @override
     */
    GS() {
        return [];
    }

    /**
     * Returns Infinity (no download limit for padding).
     * @returns {number}
     * @override
     */
    fDb() {
        return Infinity;
    }

    /**
     * Returns Infinity (no size limit for padding).
     * @returns {number}
     * @override
     */
    ase_Psa() {
        return Infinity;
    }

    /**
     * Handles errors by always indicating recovery is possible.
     * @returns {{ lU: boolean, reason: undefined }}
     * @override
     */
    handleError() {
        return {
            lU: true,
            reason: undefined,
        };
    }

    /**
     * Validates whether a segment matches this padding branch by comparing
     * start time and content end PTS.
     *
     * @param {Object} segment - The segment to check
     * @returns {boolean} True if the segment matches this branch
     * @override
     */
    handleVideoPadding(segment) {
        return (
            segment.startTimeMs === this.currentSegment.startTimeMs
            && segment.contentEndPts === this.currentSegment.contentEndPts
        );
    }
}
