/**
 * @module PboEventSenderSymbols
 * @description Dependency injection symbol and command types for the PBO
 * (Playback Observation) event sender. PBO events track playback lifecycle
 * actions such as keep-alive heartbeats, stream splicing, pause, and resume.
 *
 * @original Module_10469
 */

/**
 * Enum of PBO event command types sent during playback.
 * @enum {string}
 */
export const PboCommandType = {
    /** Periodic heartbeat to signal active playback */
    KEEP_ALIVE: "keepAlive",
    /** Stream splice point (e.g., ad insertion or quality switch) */
    SPLICE: "splice",
    /** Playback paused by user or system */
    PAUSE: "pause",
    /** Playback resumed after pause */
    RESUME: "resume",
};

/**
 * Symbol identifier for the PBO event sender service.
 * @type {string}
 * @internal
 */
export const PboEventSenderSymbol = "PboEventSenderSymbol";
