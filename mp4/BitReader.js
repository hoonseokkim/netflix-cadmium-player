/**
 * Netflix Cadmium Player - Bit Reader/Writer
 *
 * Provides bit-level read/write access to binary data buffers.
 * Used for parsing and modifying media container headers (e.g., MP4/fMP4 boxes,
 * codec configuration records, SEI NAL units).
 *
 * @module mp4/BitReader
 */

/**
 * A binary bit reader/writer that operates on a Uint8Array buffer.
 * Supports reading and writing arbitrary bit widths, with optimized
 * fast paths for aligned 8/16/32-bit operations.
 */
export class BitReader {
  /**
   * @param {Uint8Array} data - The raw byte buffer to read from / write to.
   */
  constructor(data) {
    /** @type {Uint8Array} */
    this.data = data;
    /** @type {number} Current byte read position */
    this.readPosition = 0;
    /** @type {number} Number of unconsumed bits remaining in the bit buffer */
    this.bitsRemaining = 0;
    /** @type {number} Accumulated bit buffer for sub-byte reads */
    this.bitBuffer = 0;
    /** @type {DataView} DataView over the same underlying ArrayBuffer */
    this.dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
  }

  /**
   * Current byte offset in the underlying buffer.
   * @returns {number}
   */
  get offset() {
    return this.readPosition;
  }

  /**
   * Read the specified number of bits from the buffer.
   * Uses fast paths for byte-aligned reads of 8, 16, or 32 bits.
   *
   * @param {number} numBits - Number of bits to read (1-32).
   * @returns {number} The unsigned integer value read.
   */
  read(numBits) {
    // Fast paths for byte-aligned reads
    if (this.bitsRemaining === 0) {
      if (numBits === 8) return this.data[this.readPosition++];
      if (numBits === 16) {
        const value = this.dataView.getUint16(this.readPosition);
        this.readPosition += 2;
        return value;
      }
      if (numBits === 32) {
        const value = this.dataView.getUint32(this.readPosition);
        this.readPosition += 4;
        return value;
      }
    }

    // General case: accumulate bits
    while (this.bitsRemaining < numBits) {
      this.bitBuffer = (this.bitBuffer << 8) + this.data[this.readPosition++];
      this.bitsRemaining += 8;
    }

    this.bitsRemaining -= numBits;
    return (this.bitBuffer >>> this.bitsRemaining) & ((1 << numBits) - 1);
  }

  /**
   * Advance the read position by the specified number of bits.
   *
   * @param {number} numBits - Number of bits to skip.
   */
  advance(numBits) {
    if (numBits <= this.bitsRemaining) {
      this.bitsRemaining -= numBits;
    } else {
      numBits -= this.bitsRemaining;
      const fullBytes = Math.floor(numBits / 8);
      this.readPosition += fullBytes;
      this.bitBuffer = this.data[this.readPosition++];
      this.bitsRemaining = 8 - (numBits - 8 * fullBytes);
    }
  }

  /**
   * Write the specified number of bits to the buffer.
   * Uses fast paths for byte-aligned writes of 8, 16, or 32 bits.
   *
   * @param {number} numBits - Number of bits to write (1-32).
   * @param {number} value - The unsigned integer value to write.
   */
  write(numBits, value) {
    value &= (1 << numBits) - 1;

    if (this.bitsRemaining === 0) {
      if (numBits === 8) { this.data[this.readPosition++] = value; return; }
      if (numBits === 16) { this.dataView.setUint16(this.readPosition, value); this.readPosition += 2; return; }
      if (numBits === 32) { this.dataView.setUint32(this.readPosition, value); this.readPosition += 4; return; }
    }

    // Write remaining bits into the current partial byte
    if (this.bitsRemaining > 0) {
      const bitsToWrite = Math.min(numBits, this.bitsRemaining);
      const mask = this.data[this.readPosition - 1] &
        (~((1 << this.bitsRemaining) - 1) ^ ((1 << (this.bitsRemaining - bitsToWrite)) - 1));
      this.data[this.readPosition - 1] = mask ^
        (numBits >= bitsToWrite ? value >>> (numBits - bitsToWrite) : value << (this.bitsRemaining - bitsToWrite));
      this.bitsRemaining -= bitsToWrite;
      numBits -= bitsToWrite;
    }

    // Write full bytes
    while (numBits >= 8) {
      numBits -= 8;
      this.data[this.readPosition++] = (value >>> numBits) & 255;
    }

    // Write remaining partial bits
    if (numBits > 0) {
      this.bitsRemaining = 8 - numBits;
      const existingBits = this.data[this.readPosition] & ((1 << this.bitsRemaining) - 1);
      this.bitBuffer = this.data[this.readPosition++] =
        existingBits ^ ((value & ((1 << numBits) - 1)) << (8 - numBits));
    }
  }

  /**
   * Move the read position backward by the specified number of bits.
   *
   * @param {number} numBits - Number of bits to reverse.
   */
  reverse(numBits) {
    if (this.bitsRemaining !== 0 && numBits <= 8 - this.bitsRemaining) {
      this.bitsRemaining += numBits;
    } else {
      if (this.bitsRemaining !== 0) {
        numBits -= 8 - this.bitsRemaining;
        --this.readPosition;
      }
      this.readPosition -= Math.floor(numBits / 8);
      this.bitBuffer = this.data[this.readPosition - 1];
      this.bitsRemaining = numBits % 8;
    }
  }

  /**
   * Discard any remaining sub-byte bits and align to the next byte boundary.
   */
  alignToByteBoundary() {
    this.bitsRemaining = 0;
  }
}
