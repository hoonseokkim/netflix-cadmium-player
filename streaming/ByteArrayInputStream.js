/**
 * Netflix Cadmium Player - Byte Array Input Stream
 *
 * A seekable input stream backed by a Uint8Array (or similar typed array).
 * Supports mark/reset for re-reading, read/skip operations, and async-style
 * callbacks via an interruptible completion pattern.
 *
 * Used in the MSL (Message Security Layer) protocol for reading binary payloads.
 *
 * @module ByteArrayInputStream
 * @see Module_99881
 */

import { __extends } from '../_tslib.js';
import { BaseInputStream as BaseInputStream } from '../msl/BaseInputStream.js';
import interruptibleComplete from '../utils/InterruptibleComplete.js';
import MslIoException from '../msl/MslIoException.js';

/**
 * Input stream that reads from an in-memory byte array with mark/reset support.
 * @extends BaseInputStream
 */
export class ByteArrayInputStream extends BaseInputStream {
    /**
     * @param {Uint8Array} sourceData - The byte array to read from
     */
    constructor(sourceData) {
        super();

        /** @type {Uint8Array} The source byte data */
        this.sourceData = sourceData;

        /** @type {boolean} Whether the stream has been closed */
        this.isClosed = false;

        /** @type {number} Current read position */
        this.position = 0;

        /** @type {number} Marked position for reset (-1 = no mark) */
        this.markPosition = -1;
    }

    /** No-op abort implementation. */
    abort() {}

    /**
     * Closes the stream.
     * @param {number} timeout - Timeout value (unused)
     * @param {Object} callback - Callback with result/timeout/error
     */
    close(timeout, callback) {
        interruptibleComplete(callback, () => {
            this.isClosed = true;
        });
    }

    /**
     * Marks the current position for later reset.
     */
    mark() {
        this.markPosition = this.position;
    }

    /**
     * Resets the read position to the last marked position.
     * @throws {MslIoException} If no mark has been set
     */
    reset() {
        if (this.markPosition === -1) {
            throw new MslIoException("Cannot reset before input stream has been marked or if mark has been invalidated.");
        }
        this.position = this.markPosition;
    }

    /**
     * Reads bytes from the stream.
     * @param {number} count - Number of bytes to read (-1 for all remaining)
     * @param {*} _unused - Unused parameter
     * @param {Object} callback - Callback receiving the read Uint8Array or null at EOF
     */
    read(count, _unused, callback) {
        const self = this;
        interruptibleComplete(callback, () => {
            if (self.isClosed) {
                throw new MslIoException("Stream is already closed.");
            }
            if (self.position === self.sourceData.length) {
                return null; // EOF
            }
            if (count === -1) {
                count = self.sourceData.length - self.position;
            }
            const slice = self.sourceData.subarray(self.position, self.position + count);
            self.position += slice.length;
            return slice;
        });
    }

    /**
     * Skips bytes in the stream.
     * @param {number} count - Number of bytes to skip
     * @param {*} _unused - Unused parameter
     * @param {Object} callback - Callback receiving the number of bytes actually skipped
     */
    skip(count, _unused, callback) {
        const self = this;
        interruptibleComplete(callback, () => {
            const previousPosition = self.position;
            self.position = Math.min(self.position + count, self.sourceData.length);
            return self.position - previousPosition;
        });
    }
}
