/**
 * Netflix Cadmium Player — StreamingStatusEnums
 *
 * Enumerations for streaming health status and buffering phase type.
 *
 * @module core/StreamingStatusEnums
 * @original Module_36670
 */

/**
 * Streaming health status.
 * @enum {number}
 */
export const StreamingStatus = {
    /** Stream is healthy */
    OK: 0,
    /** Temporary degradation (may recover) */
    TEMPORARY: 1,
    /** Permanent failure */
    PERMANENT: 2,
};

/**
 * Buffering phase — indicates when buffering occurs in the playback lifecycle.
 * @enum {number}
 */
export const BufferingPhase = {
    /** Initial startup buffering */
    STARTUP: 0,
    /** Mid-playback rebuffering */
    REBUFFER: 1,
};
