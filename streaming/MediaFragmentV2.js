/**
 * @module MediaFragment
 * @description Represents a downloaded media fragment (segment) with content timing,
 * edit windows, VMAF quality scores, SAP (Stream Access Point) metadata, and
 * region information. Supports trimming, extending, and applying edit windows
 * to fragments for seamless playback transitions.
 * @see Module_50468
 */

import { __extends, __assign, __importDefault } from '../core/tslib.js';
import { TimeUtil } from '../media/MediaTypes.js';
import { assert } from '../assert/Assert.js';
import MediaTypeConstants from '../media/MediaTypeConstants.js';
import { FKa as FragmentStats } from '../streaming/FragmentStats.js';
import { outputList } from '../core/Registry.js';
import { RJ as ResponseIterator } from '../streaming/ResponseIterator.js';
import { xW as BaseMediaRequest } from '../network/BaseMediaRequest.js';
import { WF as ContentWindow } from '../streaming/ContentWindow.js';
import { processingContext } from '../streaming/ProcessingContext.js';

/**
 * Represents a media fragment/segment with timing, quality, and edit metadata.
 * Extends BaseMediaRequest to add fragment-specific properties like content
 * start/end ticks, VMAF scores, edit windows, and sample access points.
 */
export class MediaFragment extends BaseMediaRequest {
    /**
     * @param {Object} stream - The parent stream.
     * @param {Object} segment - Segment metadata.
     * @param {Object} properties - Fragment properties (index, ticks, vmaf, region, etc.).
     * @param {Function} [timestampCallback] - Optional callback for timestamp offsets.
     */
    constructor(stream, segment, properties, timestampCallback) {
        super(stream, properties);
        this.isPreProcessed = false;
        MediaFragment.initializeData(this, stream, segment, properties, timestampCallback);
    }

    /**
     * Initializes fragment data fields from stream and properties.
     * @static
     */
    static initializeData(fragment, stream, segment, properties, timestampCallback) {
        BaseMediaRequest.iYa(fragment, stream, properties);
        fragment.currentIndex = properties.index;
        fragment.contentStartTicks = properties.contentStartTicks;
        fragment.contentEndTicksValue = properties.contentEndTicks;
        fragment.vmafScore = properties.vmaf ?? stream.vmaf;
        fragment.qz = properties.qz;
        fragment.currentSegment = segment;
        fragment.timestampCallback = timestampCallback;
        fragment.isFirstFragment = !!properties.xn;
        fragment.hasStateInfo = !!properties.stateInfo;
        fragment.regionValue = properties.region ?? 0;
        fragment.isKeyRotation = !!properties.kUa;
        fragment.hasAdBreak = !!properties.AB;
        fragment.contentView = (properties.TH === undefined || properties.UL === undefined ||
            (properties.TH === properties.contentStartTicks && properties.UL === properties.contentEndTicks))
            ? fragment
            : new ContentWindow(fragment, { Cb: properties.TH, contentEndTicks: properties.UL });
        fragment.n9b = properties.awa;
        fragment.additionalSAPsArray = properties.additionalSAPs;
        fragment.R0 = stream.R0;
        fragment.editWindow = properties.ase_location_history
            ? fragment.parseEditWindow(properties.ase_location_history)
            : undefined;
        fragment.sampleVersion = properties.sv;
        fragment.appended = false;
        fragment.isLastResponse = false;
        fragment.pendingResponses = [];
    }

    /**
     * Computes aggregate fragment statistics for an array of fragments.
     * @param {MediaFragment[]} fragments
     * @returns {FragmentStats}
     */
    static computeStats(fragments) {
        const durations = new Uint32Array(fragments.length);
        const sizes = new Uint32Array(fragments.length);
        const streamIndices = new Uint8Array(fragments.length);
        const vmafScores = new Uint8Array(fragments.length);
        let totalSize = 0;

        for (let i = 0; i < fragments.length; i++) {
            const frag = fragments[i];
            const size = frag.contentLength;
            durations[i] = frag.contentEndTicksValue - frag.contentStartTicks;
            sizes[i] = size;
            streamIndices[i] = frag.stream.streamIndex;
            if (frag.vmaf !== undefined && frag.vmaf !== null) {
                vmafScores[i] = frag.vmaf;
            }
            totalSize += size;
        }

        return new FragmentStats(
            durations, sizes,
            fragments.length ? fragments[0].timescaleValue : 1000,
            totalSize
        );
    }

    /** @returns {boolean} True - this is a segment-based request. */
    get pDc() { return true; }
    /** @returns {boolean} True - has range-based content. */
    get rB() { return true; }
    /** @returns {number} Segment index. */
    get index() { return this.currentIndex; }
    /** @returns {number|undefined} VMAF quality score. */
    get vmaf() { return this.vmafScore; }
    /** @returns {number} Bitrate in kbps for this segment. */
    get bitrateKbps() { return 8 * this.la / this.offset.playbackSegment; }
    /** @returns {number} Content start ticks. */
    get Cb() { return this.contentStartTicks; }
    /** @returns {number} Content end ticks. */
    get Pb() { return this.contentEndTicksValue; }
    /** @returns {number} Timestamp offset from callback. */
    get timestampOffset() { return this.timestampCallback?.call(this) ?? 0; }
    /** @returns {boolean} Whether this is the first fragment. */
    get xn() { return this.isFirstFragment; }
    /** @returns {boolean} Whether state info is attached. */
    get Si() { return this.hasStateInfo; }
    /** @returns {number} Region identifier. */
    get region() { return this.regionValue; }
    /** @returns {boolean} Whether key rotation applies. */
    get kUa() { return this.isKeyRotation; }
    /** @returns {boolean} Whether an ad break is present. */
    get AB() { return this.hasAdBreak; }
    /** @returns {*} Additional fragment metadata. */
    get awa() { return this.n9b; }
    /** @returns {Array|undefined} Additional stream access points. */
    get additionalSAPs() { return this.additionalSAPsArray; }
    /** @returns {Object|undefined} Edit window definition. */
    get editWindowDef() { return this.editWindow; }
    /** @returns {*} Sample version. */
    get sv() { return this.sampleVersion; }

    /** @returns {number} Number of editable samples. */
    get editableSampleCount() {
        if (!this.editWindow) return this.sampleCount;
        return (this.editWindow.end ?? this.sampleCount) - this.editWindow.start;
    }

    /** Content start ticks (possibly adjusted by edit window). */
    get TH() { return this.contentView.contentStartTicks; }
    /** Content end ticks (possibly adjusted by edit window). */
    get UL() { return this.contentView.contentEndTicks; }
    /** Duration in ticks. */
    get durationTicks() { return this.contentView.durationTicks; }
    /** Duration as TimeUtil offset. */
    get SAb() { return this.contentView.offset; }
    /** Presentation start time. */
    get presentationStartTime() { return this.contentView.presentationStartTime; }
    /** Segment end time. */
    get segmentEndTime() { return this.contentView.segmentEndTime; }

    /** @returns {number} Number of frames in the fragment. */
    get frameCount() {
        const ticks = this.durationTicks;
        assert(ticks);
        return ticks / this.stream.frameDuration.$;
    }

    /** @returns {boolean} Whether this is the last response. */
    get isLastResponseReceived() { return this.isLastResponse; }
    /** @returns {boolean} Whether there are pending response buffers. */
    get hasPendingResponses() { return this.pendingResponses.length > 0; }

    /**
     * Trims the fragment to new content start/end times.
     * @param {TimeUtil} newStart - New content start.
     * @param {TimeUtil} newEnd - New content end.
     * @param {boolean} isExtension - Whether this extends the fragment.
     */
    trimFragment(newStart, newEnd, isExtension) {
        assert(newStart.timescaleValue === this.timescaleValue, 'Cannot change content timestamp timescale');
        assert(newEnd.timescaleValue === this.timescaleValue, 'Cannot change content timestamp timescale');

        if (this.isWholeFragment(this.editWindow)) {
            this.contentStartTicks = newStart.$;
            this.contentEndTicksValue = newEnd.$;
            this.contentView = this;
            if (this.editWindow) {
                this.editWindow = { ...this.editWindow, start: 0, end: null };
            }
        } else {
            assert(this.editWindow, 'Undefined edit window should be handled as whole fragment');
            const origSampleCount = this.sampleCount;
            this.contentView = new ContentWindow(this, { Cb: newStart.$, contentEndTicks: newEnd.$ });
            const edit = this.editWindow;
            const editEnd = edit.end;
            this.editWindow.end = (isExtension || origSampleCount >= this.sampleCount)
                ? (editEnd === null || editEnd >= this.sampleCount ? null : this.editWindow.end)
                : (editEnd === null ? origSampleCount : editEnd);
            this.contentStartTicks = newStart.item(this.frameDuration.wh(edit.start)).$;
            this.contentEndTicksValue = newStart.item(
                this.frameDuration.wh(this.editWindow.end ?? this.sampleCount)
            ).$;
        }
    }

    /** Marks this fragment as the first in the stream. */
    markFirstFragment() { this.isFirstFragment = true; }

    /** Sets the sample version. */
    setSampleVersion(version) { this.sampleVersion = version; }

    /**
     * Applies an edit window to this fragment.
     * @param {Object} [editDef={}] - Edit window definition with start/end.
     */
    setEditWindow(editDef = {}) {
        const frameTicks = this.stream.frameDuration.$;
        const currentEdit = this.editWindow || { start: 0, end: null };
        const parsed = this.parseEditWindow(editDef);

        if (this.isWholeFragment(parsed)) {
            this.contentStartTicks = this.contentView.contentStartTicks;
            this.contentEndTicksValue = this.contentView.contentEndTicks;
            this.contentView = this;
        } else {
            if (!this.contentView || this.contentView === this) {
                this.contentView = new ContentWindow(this, this);
            }
            this.contentStartTicks = this.contentView.contentStartTicks + parsed.start * frameTicks;
            this.contentEndTicksValue = this.contentView.contentStartTicks +
                (parsed.end ?? this.sampleCount) * frameTicks;
        }
        this.editWindow = { ...currentEdit, ...parsed };
    }

    /**
     * Finds the keyframe at or before the given playback position.
     * @param {number} positionMs - Playback position in ms.
     * @returns {Object|undefined} SAP entry with start offset and content time.
     */
    findKeyframe(positionMs) {
        if (positionMs < this.presentationStartTime.playbackSegment ||
            positionMs >= this.segmentEndTime.playbackSegment) return undefined;
        if (!this.additionalSAPs || !this.additionalSAPs.length) return undefined;

        const relativePos = new TimeUtil(
            positionMs + 1 - this.presentationStartTime.playbackSegment, 1000
        ).scaledValue(this.stream.frameDuration);

        for (let i = this.additionalSAPs.length - 1; i >= 0; i--) {
            if (this.additionalSAPs[i].start <= relativePos) {
                return this.additionalSAPs[i];
            }
        }
        return { Jl: 0, hasContent: this.contentStart.playbackSegment };
    }

    toString() {
        return `[${this.selectedStreamId}, ${this.bitrate}kbit/s, ` +
            `c:${this.presentationStartTime.playbackSegment}-${this.segmentEndTime.playbackSegment},` +
            `p:${this.timestamp.playbackSegment}-${this.previousState.playbackSegment},` +
            `d:${this.offset.playbackSegment}]`;
    }

    toJSON() {
        return {
            movieId: this.R,
            streamId: this.selectedStreamId,
            bitrate: this.bitrate,
            index: this.index,
            startPts: this.presentationStartTime.playbackSegment,
            endPts: this.segmentEndTime.playbackSegment,
            contentStartPts: this.presentationStartTime.playbackSegment,
            contentEndPts: this.segmentEndTime.playbackSegment,
            fragmentStartPts: this.contentStart.playbackSegment,
            fragmentEndPts: this.contentEnd.playbackSegment,
            edit: this.editWindow
        };
    }

    /**
     * Gets a response iterator for streaming fragment data.
     * @returns {AsyncIterator}
     */
    getResponseIterator() {
        assert(!this.responseIterator, 'Should not get response iterator more than once');
        this.responseIterator = new ResponseIterator(this.stream.console);
        return this.responseIterator.getIterator();
    }

    /**
     * Feeds raw response data to the fragment.
     * @param {ArrayBuffer} data - Response chunk.
     * @param {boolean} isLast - Whether this is the final chunk.
     */
    loadRawData(data, isLast) {
        if (this.responseIterator) {
            this.responseIterator.enqueue(data);
            if (isLast) this.responseIterator.prioritizeBranch();
        } else {
            this.pendingResponses.push(data);
        }
        this.isLastResponse = isLast;
    }

    /** Clears pending response buffers. */
    getPayloadSize() {
        this.pendingResponses = [];
    }

    /**
     * Extends fragment metadata with additional box data.
     * @param {Object} boxData - MP4 box metadata with content length and end ticks.
     */
    extractBoxMetadata(boxData) {
        this.contentLength += boxData.la;
        this.contentEndTicksValue = boxData.contentEndTicks;
        if (this.editWindow) {
            this.contentView = new ContentWindow(this, {
                Cb: this.TH,
                contentEndTicks: this.contentEndTicksValue
            });
            this.editWindow.end = this.sampleCount;
        }
    }

    /** @private */
    parseEditWindow(def) {
        const start = Math.max(def.start || 0, 0);
        const end = (def.end === undefined || def.end === null || def.end === this.sampleCount)
            ? null
            : Math.min(this.sampleCount, Math.max(start, def.end < 0 ? this.sampleCount + def.end : def.end));
        return { ...def, start, end };
    }

    /** @private */
    isWholeFragment(edit) {
        return !edit || (edit.start === 0 && (edit.end === this.sampleCount || edit.end === null));
    }
}

outputList(processingContext, MediaFragment);
