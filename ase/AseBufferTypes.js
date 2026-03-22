/**
 * Netflix Cadmium Player -- AseBufferTypes
 *
 * Enumerations and IoC symbols for the ASE (Adaptive Streaming Engine)
 * buffer management system.
 *
 * @module ase/AseBufferTypes
 * @original Module_24550
 */

/**
 * Lifecycle state of a buffered segment/chunk.
 * Tracks the progression from download through append into the source buffer.
 * @enum {number}
 */
export const SegmentLifecycleState = Object.freeze({
    /** Segment data is currently being downloaded */
    downloading: 0,
    /** Segment data has been fully downloaded */
    downloaded: 1,
    /** Segment data has been appended to the SourceBuffer */
    appended: 2,
    /** Segment data is confirmed buffered and playable */
    buffered: 3,
    /** Segment data has been removed/evicted from the buffer */
    removed: 4,
    /** Segment is no longer needed (e.g. after a seek past it) */
    unused: 5,
});

/**
 * Download request state flags (bitmask-style values).
 * @enum {number}
 */
export const DownloadRequestState = Object.freeze({
    /** Request is queued, waiting to start */
    waiting: 1,
    /** Request is next in line to start downloading */
    ondeck: 2,
    /** Request is actively downloading */
    downloading: 4,
    /** Request has finished downloading */
    downloaded: 8,
    /** Request is in progress (ondeck | downloading) */
    inprogress: 6,
});

/**
 * IoC symbol for the ASE buffer view service.
 * @type {string}
 */
export const AseBufferViewSymbol = "AseBufferViewSymbol";

/**
 * IoC symbol for the ASE buffer accounting service.
 * @type {string}
 */
export const AseBufferAccountingSymbol = "AseBufferAccountingSymbol";
