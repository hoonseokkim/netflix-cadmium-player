/**
 * Subtitle Buffer Manager
 *
 * Manages the download buffer for timed text / subtitle data. Tracks subtitle
 * index segments (sidx), handles buffer size limits, cleanup, and provides
 * methods for finding subtitle entries by presentation time range. Also manages
 * a quiet period after buffering and visual status markers for debugging.
 *
 * @module SubtitleBufferManager
 * @original Module_76290
 */

// import { SubtitleDownloader } from './SubtitleDownloader';
// import { SubtitleUtils } from './SubtitleUtils';

/**
 * Checks whether a subtitle entry overlaps the [startPts, endPts] range.
 * @param {number} startPts
 * @param {number} endPts
 * @param {Object} entry - Subtitle entry with displayTime and duration
 * @returns {boolean}
 */
function isEntryInRange(startPts, endPts, entry) {
    const entryVisible = entry.displayTime <= startPts && startPts <= entry.displayTime + entry.duration;
    return (startPts <= entry.displayTime && entry.displayTime <= endPts) || entryVisible;
}

/**
 * Determines if a gap exists between two sidx entries, meaning we should
 * advance to the next segment.
 * @param {number} currentPts
 * @param {Object} previousSidx
 * @param {Object} nextSidx
 * @returns {boolean}
 */
function shouldAdvanceToNextSegment(currentPts, previousSidx, nextSidx) {
    return previousSidx &&
        (!previousSidx.entries.length && currentPts > previousSidx.startTime ||
            currentPts > previousSidx.endTime) &&
        nextSidx.entries.length &&
        currentPts < nextSidx.endTime;
}

/**
 * Tracks the current sidx location for efficient lookups.
 */
class SidxCursor {
    /**
     * @param {Object} [sidx] - Current sidx segment
     * @param {number} [index] - Index within the sidx array
     */
    constructor(sidx, index) {
        this.sidx = sidx;
        this.index = index;
    }

    /** Resets the cursor. */
    reset() {
        this.sidx = undefined;
        this.index = undefined;
    }
}

/**
 * Debug status marker that tracks which segments are loaded.
 */
class SegmentStatusTracker {
    /**
     * @param {number} totalSegments - Total number of segments
     * @param {boolean} enabled - Whether tracking is enabled
     */
    constructor(totalSegments, enabled) {
        this.enabled = !!enabled;
        if (this.enabled) {
            this.statusMarkers = Array(totalSegments).fill("-");
        }
    }

    /**
     * Marks a segment as loaded.
     * @param {number} index
     */
    markLoaded(index) {
        if (this.enabled && index < this.statusMarkers.length) {
            this.statusMarkers[index] = "x";
        }
    }

    /**
     * Marks a segment as unloaded.
     * @param {number} index
     */
    markUnloaded(index) {
        if (this.enabled && index < this.statusMarkers.length) {
            this.statusMarkers[index] = "-";
        }
    }

    /** @returns {string} Visual representation of loaded segments */
    toString() {
        return this.enabled && "|" + this.statusMarkers.join("") + "|";
    }
}

/**
 * Manages a quiet period after buffering to avoid excessive requests.
 */
class BufferingQuietPeriod {
    /**
     * @param {number} durationMs - Quiet period duration in ms (0 to disable)
     */
    constructor(durationMs) {
        this.enabled = durationMs !== 0;
        this.active = false;
        this.durationMs = durationMs || 3000;
        this.timerId = undefined;
    }

    /** Starts the quiet period timer. */
    start() {
        if (!this.enabled) return;
        this.active = true;
        this.timerId = setTimeout(() => {
            this.active = false;
            this.timerId = undefined;
        }, this.durationMs);
    }

    /** Cancels the quiet period. */
    stop() {
        this.active = false;
        clearTimeout(this.timerId);
        this.timerId = undefined;
    }
}

/**
 * Manages the subtitle/timed-text download buffer.
 * Handles segment loading, cleanup, and entry lookups by time range.
 */
export class SubtitleBufferManager {
    /**
     * @param {Object} config - Configuration with bufferSize, debug flags, etc.
     * @param {Object} subtitleTrack - The subtitle track metadata
     * @param {Object[]} sidxSegments - Array of sidx index segments
     */
    constructor(config, subtitleTrack, sidxSegments) {
        /** @type {number} Current buffer usage in bytes */
        this.currentBufferSize = 0;
        /** @type {number} Reserved buffer space for pending downloads */
        this.reservedBufferSize = 0;
        /** @type {number} Maximum buffer size in bytes (default 4MB) */
        this.maxBufferSize = config.bufferSize || 4194304;

        /** @type {SidxCursor} */
        this.cursor = new SidxCursor();
        /** @type {Object|undefined} Previous sidx for transition tracking */
        this.previousSidx = undefined;

        /** @type {boolean} */
        this.debugEnabled = config.debugLogging;
        /** @type {Object} */
        this.logger = config.logger;
        /** @type {Object} */
        this.subtitleTrack = subtitleTrack;
        /** @type {Object[]} */
        this.sidxSegments = sidxSegments;

        /** @type {SubtitleDownloader} */
        this.downloader = new SubtitleDownloader(config);
        /** @type {SegmentStatusTracker} */
        this.statusTracker = new SegmentStatusTracker(this.sidxSegments.length, config.enableStatusMarkers);
        /** @type {BufferingQuietPeriod} */
        this.quietPeriod = new BufferingQuietPeriod(config.quietPeriodDurationMs);
    }

    /** @returns {SidxCursor} The current cursor */
    get currentCursor() {
        return this.cursor;
    }

    /** @returns {boolean} Whether quiet period is inactive */
    get isReady() {
        return !this.quietPeriod.active;
    }

    /** Logs the current segment status markers. */
    _logStatus() {
        if (this.statusTracker.enabled) {
            this.logger.debug("Buffer: " + this.statusTracker.toString());
        }
    }

    /**
     * Reserves buffer space for a pending download.
     * @param {number} bytes
     */
    reserveSpace(bytes) {
        this.reservedBufferSize += bytes;
        this.logger.debug("Reserved buffer size is", this.currentBufferSize + this.reservedBufferSize, "after reserving", bytes);
    }

    /**
     * Releases previously reserved buffer space.
     * @param {number} bytes
     */
    unreserveSpace(bytes) {
        this.reservedBufferSize -= bytes;
        this.logger.debug("Reserved buffer size is", this.currentBufferSize + this.reservedBufferSize, "after unreserving", bytes);
    }

    /**
     * Claims buffer space after data is loaded.
     * @param {number} bytes
     */
    claimSpace(bytes) {
        this.currentBufferSize += bytes;
        this.logger.debug("Buffer size is", this.currentBufferSize, "after claiming", bytes);
    }

    /**
     * Frees buffer space when data is evicted.
     * @param {number} bytes
     */
    freeSpace(bytes) {
        this.currentBufferSize -= bytes;
        this.logger.debug("Buffer size is", this.currentBufferSize, "after clearing", bytes);
    }

    /**
     * Clears space and updates status markers for evicted segments.
     * @param {number} bytes - Space to free
     * @param {Object[]} [segments] - Segments being evicted
     */
    clearSegments(bytes, segments) {
        this.freeSpace(bytes);
        if (segments && this.statusTracker.enabled) {
            segments.forEach((seg) => this.statusTracker.markUnloaded(seg.index));
            this._logStatus();
        }
    }

    /**
     * Updates the cursor position based on current playback time.
     * @param {number} currentPts
     */
    updateCursorPosition(currentPts) {
        const newSidx = this._findSidxForTime(currentPts);
        if ((!newSidx || newSidx.index) !== (!this.cursor || this.cursor.index)) {
            this.previousSidx = this.cursor.sidx;
            if (newSidx) {
                if (this.debugEnabled) this.logger.debug("Current sidx is index", newSidx.index);
                this.cursor = newSidx;
            } else {
                if (this.debugEnabled) this.logger.debug("Current sidx is out of range");
                this.cursor.reset();
            }
        }

        // Clean up old previous sidx if it's far from current time
        if (this.previousSidx && typeof this.previousSidx.index === "number" &&
            (currentPts < this.previousSidx.startTime - 35000 || currentPts > this.previousSidx.endTime + 35000)) {
            this._evictSegment(this.previousSidx.index);
            this.previousSidx = undefined;
            this._logStatus();
        }
    }

    /**
     * Evicts segments that are too far behind current playback.
     * @param {number} currentPts
     * @param {number} startIndex - Starting index for cleanup
     */
    cleanupBehind(currentPts, startIndex) {
        const count = this.sidxSegments?.length ?? 0;
        for (let i = startIndex; i < count; i++) {
            const seg = this.sidxSegments[i];
            if (seg && ((seg.endTime || seg.endTimeAlt) >= currentPts - 10000 &&
                (seg.endTime || seg.endTimeAlt) < currentPts + 300000 ||
                this._evictSegment(i)));
        }
        this.quietPeriod.stop();
        this._logStatus();
    }

    /**
     * Aggressively evicts all segments except the current one.
     */
    aggressiveCleanup() {
        this.logger.debug("executing aggressive cleanup");
        const count = this.sidxSegments?.length ?? 0;
        for (let i = 0; i < count; i++) {
            if (i === this.cursor.index) {
                i += 2;
            }
            this._evictSegment(i);
        }
        this.quietPeriod.stop();
        this._logStatus();
    }

    /**
     * Checks if there's room in the buffer for a download of given size.
     * @param {number} size
     * @returns {boolean}
     */
    _hasBufferSpace(size) {
        return this.currentBufferSize + this.reservedBufferSize + size <= this.maxBufferSize;
    }

    /**
     * Evicts images from a specific segment index.
     * @param {number} index
     */
    _evictSegment(index) {
        const segment = this.sidxSegments[index];
        const imageCount = segment?.images?.length ?? 0;
        if (imageCount > 0) {
            const size = SubtitleUtils.calculateSize([segment]);
            segment.images = [];
            this.statusTracker.markUnloaded(index);
            this.freeSpace(size);
            if (this.debugEnabled) {
                this.logger.debug("cleaning up space from sidx", {
                    index,
                    start: segment.startTime,
                    size,
                    images: imageCount,
                    remaining: this.currentBufferSize,
                });
            }
        }
    }

    /**
     * Finds the sidx containing the given presentation time.
     * @param {number} pts
     * @returns {SidxCursor|undefined}
     */
    _findSidxForTime(pts) {
        const cursor = this.cursor;
        const currentSidx = cursor.sidx;
        const currentIndex = cursor.index;
        const segments = this.sidxSegments;
        let found = false;
        let result;

        if (currentSidx) {
            if (currentSidx.entries.length) {
                if ((currentIndex === 0 && pts <= currentSidx.startTime) ||
                    (pts >= currentSidx.startTime && pts <= currentSidx.endTime)) {
                    found = true;
                    result = cursor;
                } else if (currentIndex > 0) {
                    const prev = segments[currentIndex - 1];
                    if (shouldAdvanceToNextSegment(pts, prev, currentSidx)) {
                        found = true;
                        result = cursor;
                    }
                }
            } else {
                const prev = segments[currentIndex - 1];
                const next = segments[currentIndex + 1];
                if (shouldAdvanceToNextSegment(pts, prev, currentSidx)) {
                    found = true;
                    result = cursor;
                } else if (next?.endTime && pts <= next.endTime &&
                    (pts >= currentSidx.endTime || pts >= currentSidx.endTimeAlt)) {
                    found = true;
                    result = new SidxCursor(next, currentIndex + 1);
                }
            }
        }

        if (!found) {
            for (let i = 0; i < segments.length; i++) {
                if (segments[i].entries.length && pts <= segments[i].endTime) {
                    result = new SidxCursor(segments[i], i);
                    break;
                }
            }
        }

        return result;
    }
}
