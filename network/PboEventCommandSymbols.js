/**
 * @file PboEventCommandSymbols - DI tokens and constants for PBO event commands
 * @module network/PboEventCommandSymbols
 * @description Defines the command types and dependency injection symbols for
 * Playback Observation (PBO) event commands. PBO events track the playback
 * lifecycle (start, stop, pause, resume, keep-alive, engage, splice).
 * @original Module_87607
 */

/**
 * PBO (Playback Observation) command types.
 * These map to the different lifecycle events reported to the Netflix backend.
 * @type {Object<string, string>}
 */
export const PboCommandType = {
    /** Playback started */
    start: 'start',
    /** Playback stopped */
    stop: 'stop',
    /** Keep-alive heartbeat during playback */
    keepAlive: 'keepAlive',
    /** User engagement signal */
    engage: 'engage',
    /** Ad splice point */
    splice: 'splice',
    /** Playback paused */
    pause: 'pause',
    /** Playback resumed */
    resume: 'resume'
};

/** @type {string} DI symbol for the PBO event command factory */
export const EventPboCommandFactorySymbol = 'EventPboCommandFactorySymbol';

/** @type {string} DI symbol for the start event PBO command */
export const StartEventPboCommandSymbol = 'StartEventPboCommandSymbol';

/** @type {string} DI symbol for the stop event PBO command */
export const StopEventPboCommandSymbol = 'StopEventPboCommandSymbol';

/** @type {string} DI symbol for the keep-alive event PBO command */
export const KeepAliveEventPboCommandSymbol = 'KeepAliveEventPboCommandSymbol';

/** @type {string} DI symbol for the splice event PBO command */
export const SpliceEventPboCommandSymbol = 'SpliceEventPboCommandSymbol';

/** @type {string} DI symbol for the engage event PBO command */
export const EngageEventPboCommandSymbol = 'EngageEventPboCommandSymbol';

/** @type {string} DI symbol for the pause event PBO command */
export const PauseEventPboCommandSymbol = 'PauseEventPboCommandSymbol';

/** @type {string} DI symbol for the resume event PBO command */
export const ResumeEventPboCommandSymbol = 'ResumeEventPboCommandSymbol';

export default {
    PboCommandType,
    EventPboCommandFactorySymbol,
    StartEventPboCommandSymbol,
    StopEventPboCommandSymbol,
    KeepAliveEventPboCommandSymbol,
    SpliceEventPboCommandSymbol,
    EngageEventPboCommandSymbol,
    PauseEventPboCommandSymbol,
    ResumeEventPboCommandSymbol
};
