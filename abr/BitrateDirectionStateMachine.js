/**
 * Netflix Cadmium Player — BitrateDirectionStateMachine
 *
 * State machine definition for tracking the direction of bitrate changes
 * (increasing, decreasing, or stable). Used by the ABR algorithm to
 * detect bitrate oscillation and stabilize stream selection.
 *
 * States:
 *   - NONE:       No direction established
 *   - INCREASING: Bitrate is trending upward
 *   - DECREASING: Bitrate is trending downward
 *   - DISABLED:   State tracking is disabled
 *
 * @module abr/BitrateDirectionStateMachine
 * @original Module_19250
 */

/**
 * State machine configuration for bitrate direction tracking.
 * @type {Object}
 */
export const bitrateDirectionStateMachine = {
    /** @type {string} Initial state */
    initial: 'NONE',

    /** State transition definitions */
    states: {
        NONE: {
            on: {
                /** Transition to INCREASING when bitrate goes up */
                BITRATE_INCREASE: 'INCREASING',
                /** Transition to DECREASING when bitrate goes down */
                BITRATE_DECREASE: 'DECREASING',
            },
        },
        DECREASING: {
            on: {
                /** Return to NONE when direction resets */
                DIRECTION_RESET: 'NONE',
            },
        },
        INCREASING: {
            on: {
                /** Return to NONE when direction resets */
                DIRECTION_RESET: 'NONE',
            },
        },
        /** Terminal disabled state — no transitions out */
        DISABLED: {},
    },

    /** Global transitions available from any state */
    on: {
        /** Disable direction tracking from any state */
        DISABLE: 'DISABLED',
    },
};
