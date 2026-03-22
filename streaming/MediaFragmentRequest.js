/**
 * Netflix Cadmium Player -- MediaFragmentRequest
 *
 * Represents a media fragment download request that splits into two parts:
 * a "moof" (movie fragment) header request followed by a "mdat" (media data)
 * payload request. Extends the base fragment request class to handle the
 * two-phase download pattern used by the ISOBMFF streaming pipeline.
 *
 * When ASE location history (partial segment) information is available,
 * the mdat request range is adjusted to only fetch the needed samples.
 *
 * @module streaming/MediaFragmentRequest
 * @original Module_51440
 * @dependencies
 *   Module 22970 - tslib (__assign, __extends)
 *   Module 91562 - side-effect import
 *   Module 66164 - platform globals
 *   Module 52571 - assert
 *   Module 85254 - decorator utility (outputList)
 *   Module 50468 - MediaFragment (buildFunction)
 *   Module 50247 - base fragment request class (N5)
 */

import { __assign, __extends } from '../utils/TsLibHelpers';
import { outputList } from '../utils/ExportAggregator';                   // Module 85254
import { buildFunction as MediaFragmentBuilder } from '../streaming/MediaFragment'; // Module 50468
import { BaseFragmentRequest } from '../streaming/BaseFragmentRequest';    // Module 50247

/**
 * A media fragment request that downloads moof (header) and mdat (data) separately.
 *
 * @extends BaseFragmentRequest
 */
class MediaFragmentRequest extends BaseFragmentRequest {
    /**
     * @param {Function} requestIdFactory - Factory to generate request IDs
     * @param {Object} httpClient - HTTP transport for making requests
     * @param {string} boxType - Always "moof" for the initial request
     * @param {Object} segmentInfo - Segment descriptor with offset/length
     * @param {Object} stream - The stream this fragment belongs to
     * @param {Object} track - The track this fragment belongs to
     * @param {Object} viewableSession - The viewable session context
     * @param {*} extraContext - Additional context
     * @param {*} fragmentOptions - Fragment-specific options
     */
    constructor(requestIdFactory, httpClient, segmentInfo, stream, track, viewableSession, extraContext, fragmentOptions) {
        const moofDescriptor = {
            ...segmentInfo,
            offset: segmentInfo.offset,
            size: segmentInfo.headerSize + 8, // moof box header is 8 bytes
            maxRequestSize: undefined,
            responseType: 0, // arraybuffer
        };

        super(requestIdFactory, httpClient, "moof", moofDescriptor, stream, track, viewableSession, extraContext);

        /** Whether this fragment has been fully initialized */
        this._isInitialized = true;

        /** Whether the fragment data is ready for append */
        this._isComplete = false;

        // Initialize media fragment data
        MediaFragmentBuilder.data(this, requestIdFactory, track, segmentInfo, fragmentOptions);

        // Compute the mdat (payload) range descriptor
        this._mdatDescriptor = this._computeMdatRange(segmentInfo, moofDescriptor.size);

        // Issue a follow-up request for the mdat portion
        this.makeFollowupRequest(httpClient, "mdat", segmentInfo, this._mdatDescriptor);
    }

    /**
     * Check if this fragment can be appended to the source buffer.
     * Requires both the internal readiness flag and the base class check.
     * @returns {boolean}
     */
    canAppend() {
        return this._checkInitialized() && super.canAppend();
    }

    /**
     * Compute the byte range for the mdat (media data) portion,
     * adjusting for partial segment requests when location history is present.
     *
     * @param {Object} segmentInfo - Full segment descriptor
     * @param {number} moofSize - Size of the moof portion in bytes
     * @returns {Object} Descriptor with offset and size for the mdat request
     */
    _computeMdatRange(segmentInfo, moofSize) {
        const mdatRange = {
            offset: segmentInfo.offset + moofSize,
            size: segmentInfo.size - moofSize,
        };

        if (this.ase_location_history) {
            // Adjust start offset if we only need a subset of samples
            if (this.ase_location_history.start > 0) {
                const startByteOffset = this.getByteOffsetForSample(this.ase_location_history.start);
                if (startByteOffset) {
                    mdatRange.offset = segmentInfo.offset + startByteOffset;
                    mdatRange.size = segmentInfo.size - startByteOffset;
                }
            }

            // Adjust end offset if we don't need all samples
            if (this.ase_location_history.end !== null &&
                this.ase_location_history.end < this.sampleCount) {
                const endByteOffset = this.getByteOffsetForSample(this.ase_location_history.end);
                if (endByteOffset) {
                    mdatRange.size -= (segmentInfo.size - endByteOffset);
                }
            }
        }

        return mdatRange;
    }

    /**
     * @returns {string} Debug representation of this request
     */
    toString() {
        return "ID: " + this.getRequestId() + ":" + super.toString();
    }
}

export { MediaFragmentRequest };

// Register this class with the MediaFragment builder system
outputList(MediaFragmentBuilder, MediaFragmentRequest);
