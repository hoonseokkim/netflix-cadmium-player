/**
 * Netflix Cadmium Player — AsePaddingRequest
 *
 * Represents a padding media request injected by the ASE (Adaptive Streaming
 * Engine) to fill gaps in the media timeline. Padding requests are
 * pre-generated silent audio or blank video fragments used during
 * transitions, ad insertions, or timeline discontinuities.
 *
 * Extends the base media request class (`buildFunction` from Module 50468)
 * and is pre-loaded with raw padding data on construction.
 *
 * @module streaming/AsePaddingRequest
 * @original Module_79459
 */

// import { __extends } from 'tslib';                          // Module 22970
// import { viewableId } from '../player/ViewableConstants';    // Module 79048
// import { u as DEBUG } from '../utils/AseGlobals';            // Module 48170
// import { buildFunction as BaseMediaRequest } from '../streaming/BaseMediaRequest'; // Module 50468

/**
 * A padding media request that fills timeline gaps with pre-generated data.
 */
export class AsePaddingRequest /* extends BaseMediaRequest */ {
    /**
     * @param {Object} trackInfo - Track metadata (contains profile info)
     * @param {ArrayBuffer} rawData - Pre-generated padding media data
     * @param {*} mediaType - Media type identifier (audio/video)
     * @param {*} contentOptions - Content configuration options
     * @param {number} contentStartTicks - Content start time in ticks
     * @param {number} contentEndTicks - Content end time in ticks
     * @param {Object} logger - Console/logging interface
     * @param {*} currentSegment - Current segment reference
     * @param {*} segmentInfo - Segment info for base class
     * @param {boolean} [enableTransitions=true] - Whether transitions are enabled
     * @param {boolean} [includeStateInfo=true] - Whether to include state info
     */
    constructor(
        trackInfo,
        rawData,
        mediaType,
        contentOptions,
        contentStartTicks,
        contentEndTicks,
        logger,
        currentSegment,
        segmentInfo,
        enableTransitions = true,
        includeStateInfo = true
    ) {
        super(mediaType, segmentInfo, {
            index: 0,
            offset: 0,
            la: 0,
            contentStartTicks,
            contentEndTicks,
            O: contentOptions,
            xn: enableTransitions,
            stateInfo: includeStateInfo,
            sv: null, // w parameter
        }, null /* v */);

        /** @private */
        this._trackInfo = trackInfo;

        /** @type {Object} Logger reference */
        this.console = logger;

        /** @type {*} Current segment context */
        this.currentSegment = segmentInfo;

        if (DEBUG) {
            this.console.log(
                `AsePaddingRequest [${this.mediaType}], constructed ${this.toString()}` +
                `, ${rawData.byteLength} bytes` +
                `, ${this.sampleCount} samples`
            );
        }

        this.loadRawData(rawData, true);
    }

    /**
     * The encoding profile of the padding data.
     * @type {*}
     */
    get profile() {
        return this._trackInfo.profile;
    }

    /**
     * Padding requests cannot be aborted.
     * @returns {boolean} Always false
     */
    abort() {
        return false;
    }

    /**
     * Serialize padding request info for logging/debugging.
     * @returns {Object}
     */
    toJSON() {
        return {
            viewableId: viewableId,
            startPts: this.timestamp?.playbackSegment,
            endPts:
                (this.timestamp?.playbackSegment) +
                (this.offset?.playbackSegment),
            contentStartTicks: this.contentStartTicks,
            contentEndTicks: this.contentEndTicks,
            contentStartPts: this.presentationStartTime?.playbackSegment,
            contentEndPts: this.segmentEndTime?.playbackSegment,
        };
    }

    /**
     * @returns {string} Human-readable description of the padding request
     */
    toString() {
        return (
            `[padding c:${this.presentationStartTime.playbackSegment}-${this.segmentEndTime.playbackSegment},` +
            `p:${this.timestamp.playbackSegment}-${this.previousState.playbackSegment},` +
            `d:${this.segmentEndTime.playbackSegment - this.presentationStartTime.playbackSegment}]`
        );
    }
}
