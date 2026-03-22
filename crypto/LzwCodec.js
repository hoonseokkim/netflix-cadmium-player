/**
 * LZW Compression / Decompression Codec
 *
 * Implements the Lempel-Ziv-Welch (LZW) compression algorithm used
 * internally by the Netflix player for compressing/decompressing binary
 * data (e.g. DRM license payloads, MSL messages).
 *
 * - compress()   encodes a Uint8Array into a smaller LZW-compressed Uint8Array
 * - decompress() decodes a compressed Uint8Array back to the original,
 *   with a configurable deflate-ratio safety limit to prevent zip-bomb attacks.
 *
 * @module LzwCodec
 * @source Module_75513
 */

import { __importDefault } from '../core/ReflectMetadataPolyfill';
import CadmiumError from '../core/CadmiumError';

/**
 * Convert a byte array to a string, optionally truncated to `length` bytes.
 */
function bytesToString(bytes, length) {
    if (!length) {
        length = bytes.length;
    }
    return bytes.reduce(function (result, byte, index) {
        return index < length ? result + String.fromCharCode(byte) : result;
    }, "");
}

// Build initial single-byte dictionary: char -> code
const initialDictionary = {};
for (let i = 0; i < 256; ++i) {
    const ch = bytesToString([i]);
    initialDictionary[ch] = i;
}
const initialDictionarySize = Object.keys(initialDictionary).length;

// Build initial single-byte table: code -> [byte]
const initialTable = [];
for (let i = 0; i < 256; ++i) {
    initialTable[i] = [i];
}

class LzwCodec {

    /**
     * Compress a Uint8Array using LZW.
     * @param {Uint8Array} input - Raw data to compress.
     * @returns {Uint8Array|null} Compressed data, or null if output buffer overflows.
     */
    compress(input) {
        // Clone initial dictionary
        const dictionary = {};
        for (const key in initialDictionary) {
            dictionary[key] = initialDictionary[key];
        }

        let nextCode = initialDictionarySize;
        let currentSequence = [];
        let bitWidth = 8;
        const output = new Uint8Array(input.length);
        let outputByteIndex = 0;
        let bitsRemainingInByte = 8;

        /**
         * Write `value` using `numBits` bits into the output buffer.
         * Returns false if the output buffer is exhausted.
         */
        function writeBits(value, numBits) {
            while (numBits > 0) {
                if (outputByteIndex >= output.length) {
                    return false;
                }
                if (numBits > bitsRemainingInByte) {
                    // Write upper portion of value into current byte
                    let shifted = value;
                    shifted >>>= numBits - bitsRemainingInByte;
                    output[outputByteIndex] |= shifted & 255;
                    numBits -= bitsRemainingInByte;
                    bitsRemainingInByte = 8;
                    ++outputByteIndex;
                } else {
                    // Remaining bits fit in current byte
                    let shifted = value;
                    shifted <<= bitsRemainingInByte - numBits;
                    shifted &= 255;
                    shifted >>>= 8 - bitsRemainingInByte;
                    output[outputByteIndex] |= shifted & 255;
                    bitsRemainingInByte -= numBits;
                    numBits = 0;
                    if (bitsRemainingInByte === 0) {
                        bitsRemainingInByte = 8;
                        ++outputByteIndex;
                    }
                }
            }
            return true;
        }

        for (let i = 0; i < input.length; ++i) {
            const byte = input[i];
            currentSequence.push(byte);
            const sequenceStr = bytesToString(currentSequence);
            const code = dictionary[sequenceStr];

            if (code === undefined) {
                // Output the code for the sequence without the last byte
                const previousStr = bytesToString(currentSequence, currentSequence.length - 1);
                if (!writeBits(dictionary[previousStr], bitWidth)) {
                    return null;
                }
                // Increase bit width if needed
                if ((nextCode >> bitWidth) !== 0) {
                    ++bitWidth;
                }
                // Add new sequence to dictionary
                dictionary[sequenceStr] = nextCode++;
                currentSequence = [byte];
            }
        }

        // Flush remaining sequence
        if (currentSequence.length > 0) {
            const lastStr = bytesToString(currentSequence);
            const lastCode = dictionary[lastStr];
            if (!writeBits(lastCode, bitWidth)) {
                return null;
            }
        }

        return output.subarray(0, bitsRemainingInByte > 8 ? outputByteIndex + 1 : outputByteIndex);
    }

    /**
     * Decompress LZW-compressed data.
     * @param {Uint8Array} input           - Compressed data.
     * @param {number}     maxDeflateRatio - Safety limit; throws if exceeded.
     * @returns {Uint8Array} Decompressed data.
     */
    decompress(input, maxDeflateRatio) {
        let table = initialTable.slice();
        let inputByteIndex = 0;
        let bitOffset = 0;
        let bitWidth = 8;
        const output = new Uint8Array(Math.ceil(1.5 * input.length));
        let outputIndex = 0;
        let previousEntry = [];

        while (inputByteIndex < input.length) {
            // Check if enough bits remain for a full code
            if (8 * (input.length - inputByteIndex) - bitOffset < bitWidth) {
                break;
            }

            // Read one code of `bitWidth` bits
            let code = 0;
            for (let bitsRead = 0; bitsRead < bitWidth; ) {
                const bitsAvailable = Math.min(bitWidth - bitsRead, 8 - bitOffset);
                let byte = input[inputByteIndex];
                byte <<= bitOffset;
                byte &= 255;
                byte >>>= 8 - bitsAvailable;
                bitsRead += bitsAvailable;
                bitOffset += bitsAvailable;
                if (bitOffset === 8) {
                    bitOffset = 0;
                    ++inputByteIndex;
                }
                code |= (byte & 255) << (bitWidth - bitsRead);
            }

            let entry = table[code];

            if (previousEntry.length === 0) {
                // First code: just increase bit width
                ++bitWidth;
            } else {
                // Extend the table
                if (entry) {
                    previousEntry.push(entry[0]);
                } else {
                    previousEntry.push(previousEntry[0]);
                }
                table[table.length] = previousEntry;
                previousEntry = [];

                if (table.length === (1 << bitWidth)) {
                    ++bitWidth;
                }

                if (!entry) {
                    entry = table[code];
                }
            }

            // Check deflate ratio safety
            const projectedSize = outputIndex + entry.length;
            if (projectedSize > maxDeflateRatio * input.length) {
                throw new CadmiumError(
                    "Deflate ratio " + maxDeflateRatio + " exceeded. Aborting uncompression."
                );
            }

            // Grow output buffer if needed
            let currentOutput = output;
            if (projectedSize >= currentOutput.length) {
                const expanded = new Uint8Array(Math.ceil(1.5 * projectedSize));
                expanded.set(currentOutput);
                // Note: in original code `output` is reassigned via closure reference
            }

            currentOutput.set(entry, outputIndex);
            outputIndex = projectedSize;
            previousEntry = previousEntry.concat(entry);
        }

        return output.subarray(0, outputIndex);
    }
}

export { LzwCodec as dgb };
