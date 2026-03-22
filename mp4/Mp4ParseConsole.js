/**
 * Netflix Cadmium Player - MP4 Parse Console
 *
 * Debug wrapper for MP4 (ISO BMFF) parsing. Creates a DataView over
 * raw buffer data and delegates parsing to the debug utility, which
 * walks the MP4 box tree and logs structural information.
 *
 * @module mp4/Mp4ParseConsole
 */

/**
 * Provides debug-level MP4 box parsing with console logging.
 * Used during development and debugging to inspect MP4 container structure.
 */
export class Mp4ParseConsole {
  /**
   * @param {Object} console - Logger/console instance for trace output.
   * @param {Object} stream - The media stream being parsed.
   * @param {ArrayBuffer|{data: ArrayBuffer, offset: number, length: number}} buffer -
   *   Raw MP4 data as an ArrayBuffer or a typed-array-like descriptor.
   */
  constructor(console, stream, buffer) {
    /** @type {Object} Logger instance */
    this.console = console;
    /** @type {Object} Media stream reference */
    this.stream = stream;
    /** @type {DataView} DataView over the MP4 buffer */
    this.buffer =
      buffer instanceof ArrayBuffer
        ? new DataView(buffer)
        : new DataView(buffer.data, buffer.offset, buffer.length);
  }

  /**
   * Parses the MP4 data starting from a video sample entry box.
   * Initializes the debug parser with the MP4 box definitions and
   * returns the parsed sample entry structure.
   *
   * @param {*} sampleEntryParam - Parameter passed to the debug parser's videoSampleEntry method.
   * @returns {Object} Parsed video sample entry data.
   */
  videoSampleEntry(sampleEntryParam) {
    const cursor = new BufferCursor(this.buffer.byteLength);
    this.debugUtility = new Mp4DebugParser(
      mp4BoxDefinitions.childrenMap,
      cursor,
      this.buffer,
      this.console,
      { verbose: true }
    );
    const result = this.debugUtility.videoSampleEntry(sampleEntryParam);
    /** @type {Object} Parsed MP4 box children map */
    this.childrenMap = this.debugUtility.childrenMap;
    return result;
  }
}
