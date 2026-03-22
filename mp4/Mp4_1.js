/**
 * Netflix Cadmium Player - Media Fragment Editor Module
 * Component: MP4
 *
 * Provides utilities for splitting and editing MP4 media fragment responses.
 * Locates the moof (movie fragment) box boundary within response chunks
 * and optionally extracts the mdat (media data) box header info that follows.
 */

// Dependencies
// import { platform } from './Platform';                   // webpack 66164
// import { Mp4BoxParser, readBoxType } from './Mp4BoxParser'; // webpack 91562
// import { assert } from './TimeUtil';                      // webpack 91176
// import { concatenateArrayBuffers } from './BufferUtils';   // webpack 69575

/**
 * Checks whether every element in an array is an ArrayBuffer.
 * @param {Array} chunks - Array of response chunks
 * @returns {boolean}
 */
export function allArrayBuffers(chunks) {
    return chunks?.every((chunk) => chunk instanceof ArrayBuffer);
}

/**
 * @class MediaFragmentEditor
 *
 * Splits an array of response chunks at the moof (movie fragment) box
 * boundary. When extractMdatHeader is true, also reads the mdat box
 * size/type that immediately follows the moof.
 *
 * This is used during progressive download to separate the moof metadata
 * from the mdat payload so they can be processed independently.
 */
export class MediaFragmentEditor {
    /**
     * @param {Console} parentConsole - Parent console for log context
     * @param {string} mediaType - e.g. "video", "audio"
     */
    constructor(parentConsole, mediaType) {
        /** @type {Console} */
        this.console = parentConsole;

        /** @type {string} */
        this.mediaType = mediaType;

        /** @type {Console} MP4-specific console */
        this.mp4Console = new platform.Console("MP4", "media|asejs");
    }

    /**
     * Returns the stream's pending fragment data.
     * @param {Object} request - A media request with a stream reference
     * @returns {*}
     */
    getPendingFragmentData(request) {
        return request.stream.pendingFragmentData;
    }

    /**
     * Splits the response chunks at the moof box boundary.
     *
     * If extractMdatHeader is true, also reads the 8-byte mdat header
     * (box size + "mdat" type) that immediately follows the moof.
     *
     * @param {Array<ArrayBuffer>} responseChunks - Response data chunks
     * @param {boolean} [extractMdatHeader=false] - Whether to also read the mdat header
     * @returns {Object} Result with moofData, mdatOffset, mdatSize, and remaining chunks
     */
    splitAtMoofBoundary(responseChunks, extractMdatHeader = false) {
        const firstChunk = responseChunks[0];

        if (!(firstChunk instanceof ArrayBuffer)) {
            this.mp4Console.RETRY(
                `MediaFragmentEditor [${this.mediaType}]: response is not ArrayBuffer`
            );
            return { remainingChunks: responseChunks };
        }

        // Find the end of the moof box in the first chunk
        const moofEnd = Mp4BoxParser.path(new DataView(firstChunk), ["moof"]).end;

        if (!moofEnd) {
            this.mp4Console.RETRY(
                `MediaFragmentEditor [${this.mediaType}]: start of moof not found in first response`
            );
            return { remainingChunks: responseChunks };
        }

        // If extractMdatHeader is true, we need 8 more bytes for the mdat box header
        const requiredBytes = moofEnd + (extractMdatHeader ? 8 : 0);

        // Accumulate enough chunks to cover the moof (and optional mdat header)
        let accumulatedSize = firstChunk.byteLength;
        let chunkCount = 1;

        while (accumulatedSize < requiredBytes && chunkCount < responseChunks.length) {
            const chunk = responseChunks[chunkCount];
            if (chunk instanceof ArrayBuffer) {
                accumulatedSize += chunk.byteLength;
            }
            ++chunkCount;
        }

        if (accumulatedSize < requiredBytes) {
            this.mp4Console.RETRY(
                `MediaFragmentEditor [${this.mediaType}]: moof not found in responses`
            );
            return { remainingChunks: responseChunks };
        }

        // Concatenate the chunks that contain the moof if there are multiple
        let moofBuffer = firstChunk;
        if (chunkCount !== 1) {
            const moofChunks = responseChunks.slice(0, chunkCount);
            if (!allArrayBuffers(moofChunks)) {
                this.mp4Console.RETRY(
                    `MediaFragmentEditor [${this.mediaType}]: moof responses are not ArrayBuffer`
                );
                return { remainingChunks: responseChunks };
            }
            moofBuffer = concatenateArrayBuffers(moofChunks);
        }

        const remaining = responseChunks.slice(chunkCount);

        if (extractMdatHeader) {
            const dataView = new DataView(moofBuffer);
            const mdatSize = dataView.getUint32(moofEnd);
            assert(
                readBoxType(dataView.getUint32(moofEnd + 4)) === "mdat",
                "Expected mdat after moof"
            );

            return {
                moofData: moofBuffer,
                mdatOffset: moofEnd,
                mdatSize,
                remainingChunks: remaining,
            };
        }

        return {
            moofData: moofBuffer,
            remainingChunks: remaining,
        };
    }
}
