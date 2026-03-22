/**
 * @file AseStreamWithFragmentIndex - ASE Stream subclass with fragment indexing
 * @module streaming/AseStreamWithFragmentIndex
 * @description Extends the base AseStream (O5) to add fragment index management.
 * When a header is received for a stream, this class builds a fragment index
 * from the header's fragment metadata (offsets, sizes, timescales) and optionally
 * applies a profile-level timestamp offset so that all fragment timestamps are
 * adjusted to a common timeline.
 *
 * @original Module_48834
 *
 * @dependencies
 *   Module 22970 - tslib helpers (__extends)
 *   Module 91176 - assert utility
 *   Module 89613 - FragmentIndex (internal_Zlb)
 *   Module 48170 - debug flags
 *   Module 11031 - AseStream base class (O5)
 */

// import { __extends } from '../tslib';
// import { assert } from '../assert/Assert';
// import { FragmentIndex } from './FragmentIndex';
// import { debugFlags } from '../core/DebugFlags';
// import { AseStream } from './AseStream';

/**
 * An AseStream subclass that manages a fragment index built from
 * stream header data. Supports profile timestamp offset adjustment
 * for aligning fragment times across different renditions.
 *
 * @class AseStreamWithFragmentIndex
 * @extends AseStream
 */
export class AseStreamWithFragmentIndex /* extends AseStream */ {
    /**
     * @param {Object} streamConfig - Stream configuration
     * @param {Object} setConfig - Configuration with streaming offset settings
     * @param {Object} console - Logger / trace console
     */
    constructor(streamConfig, setConfig, console) {
        // super(streamConfig, setConfig, console);

        /** @type {Object} Configuration including applyProfileStreamingOffset */
        this.setConfig = setConfig;

        /** @type {Object} Logger for trace output */
        this.console = console;

        /** @type {FragmentIndex|undefined} The fragment index built from header data */
        this.fragmentIndex = undefined;

        /** @type {boolean} Whether to apply profile-level timestamp offsets */
        this.applyProfileStreamingOffset = setConfig.applyProfileStreamingOffset;
    }

    /**
     * Whether the stream's track property is available.
     * @type {Object}
     * @readonly
     */
    get track() {
        return this.track;
    }

    /**
     * Whether a fragment index has been built (i.e., header was received).
     * @type {boolean}
     * @readonly
     */
    get hasFragmentIndex() {
        return !!this.fragmentIndex;
    }

    /**
     * The current fragment index, or undefined if no header received yet.
     * @type {FragmentIndex|undefined}
     * @readonly
     */
    get currentFragmentIndex() {
        return this.fragmentIndex;
    }

    /**
     * Handles receipt of a stream header. Validates the fragment data, optionally
     * applies a profile timestamp offset, then builds a FragmentIndex and notifies
     * the parent track.
     *
     * @param {*} headerKey - Header identification key
     * @param {*} trackParam1 - Parameter forwarded to track.duplicate()
     * @param {*} trackParam2 - Parameter forwarded to track.duplicate()
     * @param {Object} fragmentsData - Fragment metadata from the header
     * @param {number} fragmentsData.renditionValue - Start tick for the first fragment
     * @param {Array} [fragmentsData.og] - Optional fragment offset groups
     * @param {number} fragmentsData.offset - Byte offset of first fragment
     * @param {Array} fragmentsData.sizes - Array of fragment byte sizes
     * @param {number} fragmentsData.timescaleValue - Timescale for tick conversion
     * @param {*} indexParam - Parameter forwarded to FragmentIndex constructor
     * @param {*} trackParam3 - Parameter forwarded to track.duplicate()
     * @param {*} indexParam2 - Parameter forwarded to FragmentIndex constructor
     * @param {*} indexParam3 - Parameter forwarded to track.first()
     */
    onHeaderReceived(headerKey, trackParam1, trackParam2, fragmentsData, indexParam, trackParam3, indexParam2, indexParam3) {
        // debugFlags.u && this.console?.pauseTrace("AseStream.onHeaderReceived");

        if (!fragmentsData) {
            this.console.error("AseStream.onHeaderReceived: fragmentsData was undefined.");
            return;
        }

        const hasRendition = fragmentsData.renditionValue !== undefined;
        const hasHeaderOrOffsetGroups = this.track.headerReceived || (fragmentsData.og !== undefined && fragmentsData.og.length > 0);
        const hasOffset = fragmentsData.offset !== undefined;
        const hasSizes = fragmentsData.sizes !== undefined && fragmentsData.sizes.length > 0;

        if (!(hasRendition && hasHeaderOrOffsetGroups && hasOffset && hasSizes)) {
            this.console.error(
                "AseStream.onHeaderReceived: fragmentsData was missing data:" +
                hasRendition + "," +
                this.track.headerReceived + "," +
                this.track.a3a + "," +
                (fragmentsData.og !== undefined) + "," +
                !(!fragmentsData.og || !fragmentsData.og.length) + "," +
                hasOffset + "," +
                (fragmentsData.sizes !== undefined) + "," +
                hasSizes
            );
            return;
        }

        // Apply profile timestamp offset if configured and this is the first rendition
        if (this.applyProfileStreamingOffset && this.durationValue && fragmentsData.renditionValue === 0) {
            // debugFlags.u && this.console.pauseTrace(
            //     "Applying profile timestamp offset of " + this.durationValue.toString() +
            //     " fragments.startTicks " + fragmentsData.renditionValue + " / " +
            //     fragmentsData.timescaleValue + " for profile " + this.profile
            // );
            fragmentsData.renditionValue += this.durationValue.downloadState(fragmentsData.timescaleValue).$;
        }

        if (this.headerReceived) {
            // debugFlags.u && this.console.pauseTrace("Duplicate header received for stream ", this);
            return;
        }

        // Store header key, notify track, build fragment index
        this.headerKey = headerKey;
        this.track.duplicate(this, trackParam1, trackParam2, fragmentsData, trackParam3, indexParam3);
        this.fragmentIndex = new FragmentIndex(
            this.internal_Tpb,
            this.track.unknownDuration,
            fragmentsData,
            indexParam,
            trackParam3,
            indexParam2,
            this.R
        );
        this.track.first(this);
    }

    /**
     * Copies fragment index and track info from another AseStreamWithFragmentIndex.
     * Used when switching streams without re-downloading headers.
     *
     * @param {AseStreamWithFragmentIndex} sourceStream - The stream to copy from
     */
    copyFromStream(sourceStream) {
        // assert(sourceStream instanceof AseStream);
        // assert(sourceStream.selectedStreamId === this.selectedStreamId);

        if (!this.headerReceived) {
            this.track.aseTrack(sourceStream.track);
            this.fragmentIndex = sourceStream.fragmentIndex;
            this.headerKey = sourceStream.ck;
        }
    }

    /**
     * Resolves the download URL, falling back to the stream's own URL.
     *
     * @param {*} _k - Unused
     * @param {*} _l - Unused
     * @param {string} [overrideUrl] - Optional override URL
     * @returns {string} The URL to use for downloading
     */
    resolveDownloadUrl(_k, _l, overrideUrl) {
        return overrideUrl || this.url;
    }

    /**
     * Calculates the bufferable range from the fragment index, considering
     * minimum required buffer, current playback position, and shared MSE state.
     *
     * @returns {*} The bufferable range information
     */
    getBufferableRange() {
        const playbackSegment = this.viewableSession?.sharedMediaSourceExtensions?.playbackSegment ?? 0;
        const lookahead = this.viewableSession?.sharedMediaSourceExtensions?.la ?? 0;

        return this.fragmentIndex.apa(
            this.setConfig.minRequiredBuffer,
            this.ru,
            playbackSegment,
            lookahead,
            this.oJb
        );
    }

    /**
     * Identity pass-through for a download parameter.
     *
     * @param {*} _k - Unused
     * @param {*} value - The value to return
     * @returns {*} The passed-in value unchanged
     */
    resolveDownloadParam(_k, value) {
        return value;
    }
}
