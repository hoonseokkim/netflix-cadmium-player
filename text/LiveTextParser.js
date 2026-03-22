/**
 * Netflix Cadmium Player - LiveTextParser
 * Manages a sliding window of live subtitle/timed-text segments.
 * Maintains an ordered array of text segments indexed by segment ID,
 * supports segment lookup by PTS, and handles segment eviction
 * to bound memory usage during long-running live streams.
 *
 * @module LiveTextParser
 */

// import { findLast } from './Module_91176';

/**
 * Maximum PTS gap (in ticks) to keep past segments before eviction.
 * @type {number}
 */
export const MAX_SEGMENT_PTS_GAP = 10000;

/**
 * A single text segment entry in the segment manager.
 */
class TextSegmentEntry {
  /**
   * @param {Object} segmentData - Raw segment data from the parser.
   * @param {number} segmentData.segmentId - Unique segment identifier.
   * @param {string} segmentData.xml - The XML/TTML payload.
   * @param {number} segmentData.startPts - Presentation start time in ticks.
   * @param {number} segmentData.endPts - Presentation end time in ticks.
   * @param {number} segmentData.size - Byte size of the segment payload.
   * @param {*} segmentData.supplementalData - Additional segment metadata.
   * @param {boolean} segmentData.endOfStream - Whether this is the final segment.
   * @param {number} downloadTimestamp - Timestamp when segment was downloaded.
   */
  constructor(segmentData, downloadTimestamp) {
    /** @type {number} */
    this.segmentId = segmentData.segmentId;

    /** @type {string} */
    this.xml = segmentData.xml;

    /** @type {number} */
    this.startPts = segmentData.startPts;

    /** @type {number} */
    this.endPts = segmentData.endPts;

    /** @type {number} */
    this.downloadTimestamp = downloadTimestamp;

    /** @type {number} */
    this.size = segmentData.size;

    /** @type {*} */
    this.supplementalData = segmentData.supplementalData;

    /** @type {boolean} */
    this.endOfStream = segmentData.endOfStream;

    /** @type {Object|undefined} Parsed header data (set later via setHeader) */
    this.header = undefined;
  }
}

/**
 * Manages a sliding window of live text (subtitle) segments.
 * Provides ordered insertion, PTS-based lookup, and automatic eviction.
 */
class LiveTextParser {
  /**
   * @param {Object} console - Scoped console for debug/error logging.
   */
  constructor(console) {
    /** @type {Array<TextSegmentEntry>} Ordered array of text segments */
    this.segments = [];

    /** @type {number} Highest segment ID seen so far */
    this.highestSegmentId = 0;

    /** @type {Object} Scoped console logger */
    this.console = console;

    /** @type {TextSegmentEntry|undefined} The end-of-stream segment, if received */
    this.eosSegment = undefined;

    /** @type {TextSegmentEntry|undefined} The currently playing segment */
    this.currentSegment = undefined;

    /** @type {TextSegmentEntry|undefined} The last segment that was parsed/rendered */
    this.lastParsedSegment = undefined;
  }

  /**
   * The end-of-stream segment entry, if one has been received.
   * @returns {TextSegmentEntry|undefined}
   */
  get endOfStreamSegment() {
    return this.eosSegment;
  }

  /**
   * Find a segment entry that contains the given PTS value.
   *
   * @param {number} pts - Presentation timestamp in ticks.
   * @returns {TextSegmentEntry|undefined} The matching segment, or undefined.
   */
  findSegmentByPts(pts) {
    return findLast(this.segments, entry => pts >= entry.startPts && pts < entry.endPts);
  }

  /**
   * Add a new segment to the manager. Maintains insertion order by segment ID.
   * Evicts old segments that are too far from the current position.
   *
   * @param {Object} segmentData - Raw segment data.
   * @param {number} downloadTimestamp - Download timestamp.
   */
  addSegment(segmentData, downloadTimestamp) {
    const segments = this.segments;

    // Evict segments that are too far behind the current position
    while (segments.length > 0 && segmentData.segmentId - segments[0].segmentId >= 300) {
      this.removeFirst();
    }

    // Evict segments that are too far ahead
    while (segments.length > 0 && segments[segments.length - 1].segmentId - segmentData.segmentId >= 300) {
      this.removeLast();
    }

    const entry = new TextSegmentEntry(segmentData, downloadTimestamp);
    const length = segments.length;

    if (length === 0 || segments[length - 1].segmentId < entry.segmentId) {
      // Append at end (common case for in-order segments)
      this.appendSegment(entry);
    } else {
      // Find insertion point for out-of-order segment
      const existingEntry = findLast(segments, s => s.segmentId >= entry.segmentId);
      if (existingEntry?.segmentId === entry.segmentId) {
        return; // Duplicate segment, ignore
      }
      this.insertSegmentAt(segments.indexOf(existingEntry), entry);
    }

    if (entry.endOfStream) {
      this.console.pauseTrace("EOS segment added to segment manager");
      this.eosSegment = entry;
    }

    this.highestSegmentId = segments[segments.length - 1].segmentId;
  }

  /**
   * Set the currently playing segment. Evicts segments whose end PTS
   * is too far behind the current segment.
   *
   * @param {Object} segmentInfo - Segment info with segmentId and endPts.
   */
  setCurrentSegment(segmentInfo) {
    if (segmentInfo === undefined) {
      this.console.warn("Current segment is undefined.");
      return;
    }

    this.currentSegment = segmentInfo;
    this.console.pauseTrace(`Current segment id is ${segmentInfo.segmentId}`);

    // Evict old segments that are beyond the gap threshold
    while (this.segments[0]?.endPts < segmentInfo.endPts - MAX_SEGMENT_PTS_GAP) {
      this.removeFirst();
    }
  }

  /**
   * Get the next segment after the last parsed segment.
   *
   * @returns {TextSegmentEntry|undefined} The next unparsed segment.
   */
  getNextUnparsedSegment() {
    if (!this.lastParsedSegment) {
      return this.segments[0];
    }
    if (this.highestSegmentId !== this.lastParsedSegment.segmentId) {
      return this.segments[this.segments.indexOf(this.lastParsedSegment) + 1];
    }
    return undefined;
  }

  /**
   * Mark a segment as parsed by its segment ID.
   *
   * @param {number} segmentId - The segment ID that was parsed.
   */
  updateMaxParsedSegment(segmentId) {
    this.lastParsedSegment = this.findSegmentById(segmentId);
  }

  /**
   * Find a segment entry by its segment ID.
   *
   * @param {number} segmentId - The segment ID to look up.
   * @returns {TextSegmentEntry|undefined}
   */
  findSegmentById(segmentId) {
    const entry = findLast(this.segments, s => s.segmentId === segmentId);
    if (entry === undefined) {
      this.console.error(`Segment with segmentId ${segmentId} is not in segmentArray`);
    }
    return entry;
  }

  /**
   * Get the segment ID of the last parsed segment, or -1 if none.
   *
   * @returns {number}
   */
  getLastParsedSegmentId() {
    return this.lastParsedSegment?.segmentId ?? -1;
  }

  /**
   * Set the parsed header data for a segment.
   *
   * @param {number} segmentId - The segment to update.
   * @param {Object} header - The parsed header data.
   */
  setSegmentHeader(segmentId, header) {
    const entry = this.findSegmentById(segmentId);
    if (entry !== undefined) {
      this.segments[this.segments.indexOf(entry)].header = header;
    }
  }

  /**
   * Get a segment entry by its segment ID (alias for findSegmentById).
   *
   * @param {number} segmentId
   * @returns {TextSegmentEntry|undefined}
   */
  getSegment(segmentId) {
    return this.findSegmentById(segmentId);
  }

  /**
   * Get the parsed header data for a segment.
   *
   * @param {number} segmentId
   * @returns {Object} The header data, or an empty object if not found.
   */
  getSegmentHeader(segmentId) {
    const entry = this.findSegmentById(segmentId);
    return entry?.header ?? {};
  }

  /**
   * Remove the oldest (first) segment.
   * @private
   */
  removeFirst() {
    this.segments.shift();
  }

  /**
   * Append a segment entry at the end.
   * @private
   * @param {TextSegmentEntry} entry
   */
  appendSegment(entry) {
    this.segments.push(entry);
  }

  /**
   * Insert a segment entry at a specific index.
   * @private
   * @param {number} index
   * @param {TextSegmentEntry} entry
   */
  insertSegmentAt(index, entry) {
    this.segments.splice(index, 0, entry);
  }

  /**
   * Remove the newest (last) segment.
   * @private
   */
  removeLast() {
    this.segments.pop();
  }
}

export { LiveTextParser, TextSegmentEntry };
