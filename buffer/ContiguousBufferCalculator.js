/**
 * ContiguousBufferCalculator - Calculates available contiguous buffer space
 *
 * Computes how much buffer space remains for each media type (audio, video, text)
 * after subtracting the minimum contiguous buffer requirements from the configured limits.
 *
 * @module buffer/ContiguousBufferCalculator
 * @original Module_61567
 */

// import { MediaType } from '../types/MediaType';

/**
 * Calculates the available buffer for a single media type.
 *
 * @param {number|undefined} bufferLimit - The buffer limit for the media type
 * @param {number|undefined} contiguousBufferSize - Current contiguous buffer fill level
 * @param {number} multiplier - Contiguous buffer multiplier from config
 * @param {number} minimumBuffer - Minimum buffer to reserve for this media type
 * @returns {number} Available buffer space
 */
function calculateAvailableBuffer(bufferLimit, contiguousBufferSize, multiplier, minimumBuffer) {
    if (bufferLimit && contiguousBufferSize) {
        return Math.min(
            bufferLimit - contiguousBufferSize * multiplier,
            bufferLimit - minimumBuffer
        );
    }
    return (bufferLimit || Infinity) - minimumBuffer;
}

/**
 * Computes the remaining contiguous buffer space per media type.
 *
 * @param {Object} config - Buffer configuration
 * @param {number} config.contiguousBufferMultiplier - Multiplier for contiguous buffer calc
 * @param {number} [config.contiguousBufferMinimumAudio=0] - Min reserved audio buffer
 * @param {number} [config.contiguousBufferMinimumVideo=0] - Min reserved video buffer
 * @param {number} [config.contiguousBufferMinimumText=0] - Min reserved text buffer
 * @param {Object} bufferState - Current buffer state
 * @param {number} [bufferState.audioBufferedSegments] - Audio buffer limit
 * @param {number} [bufferState.fcd] - Audio contiguous buffer fill
 * @param {number} [bufferState.videoBufferedSegments] - Video buffer limit
 * @param {number} [bufferState.pnd] - Video contiguous buffer fill
 * @param {number} [bufferState.TEXT_MEDIA_TYPE] - Text buffer limit
 * @param {number} [bufferState.lmd] - Text contiguous buffer fill
 * @param {number} [bufferState.total] - Total buffer limit across all types
 * @returns {Object} Available buffer per media type and total
 */
export function calculateContiguousBufferLimits(config, bufferState) {
    const audioAvailable = calculateAvailableBuffer(
        bufferState.audioBufferedSegments,
        bufferState.fcd,
        config.contiguousBufferMultiplier,
        config.contiguousBufferMinimumAudio ?? 0
    );

    const videoAvailable = calculateAvailableBuffer(
        bufferState.videoBufferedSegments,
        bufferState.pnd,
        config.contiguousBufferMultiplier,
        config.contiguousBufferMinimumVideo ?? 0
    );

    const textAvailable = calculateAvailableBuffer(
        bufferState.TEXT_MEDIA_TYPE,
        bufferState.lmd,
        config.contiguousBufferMultiplier,
        config.contiguousBufferMinimumText ?? 0
    );

    const totalAvailable =
        (bufferState.total || Infinity) -
        (config.contiguousBufferMinimumAudio ?? 0) -
        (config.contiguousBufferMinimumVideo ?? 0) -
        (config.contiguousBufferMinimumText ?? 0);

    return {
        [MediaType.AUDIO]: audioAvailable,
        [MediaType.VIDEO]: videoAvailable,
        [MediaType.TEXT]: textAvailable,
        total: totalAvailable,
    };
}
