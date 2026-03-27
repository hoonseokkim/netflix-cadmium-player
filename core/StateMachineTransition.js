/**
 * @module core/StateMachineTransition
 * @description Computes state machine transitions given a state definition map,
 *              the current state, and an incoming event. Supports:
 *              - FINAL states (no transitions out)
 *              - Per-state event-specific transitions
 *              - Global/default event transitions (fallback)
 *
 *              Returns a transition descriptor with:
 *              - nextState: the resolved target state
 *              - currentState: the original state before transition
 *              - didTransition: whether the state actually changed
 *              - event: the triggering event name
 *
 * @see Module_89989
 */

/**
 * Resolves a state machine transition.
 *
 * Resolution order:
 * 1. If current state is FINAL, stay in current state
 * 2. If current state has an event-specific transition, use it
 * 3. If the global `on` map has the event, use that transition
 * 4. Otherwise, stay in current state (no transition)
 *
 * @param {Object} stateDefinition - State machine definition
 * @param {Object} stateDefinition.RTb - Map of state names to state descriptors
 * @param {Object} [stateDefinition.on] - Global/default event transition map
 * @param {string} currentState - The current state name
 * @param {string} event - The event/action name triggering the transition
 * @returns {Object} Transition result
 * @returns {string} result.Yy - The next state after transition
 * @returns {string} result.UQc - The current state before transition
 * @returns {boolean} result.internal_Lq - Whether the state changed
 * @returns {string} result.event - The event that triggered the transition
 */
function resolveTransition(stateDefinition, currentState, event) {
  let nextState;

  // Check if current state is FINAL (terminal state)
  if (stateDefinition.RTb[currentState]?.type === "FINAL") {
    nextState = currentState;
  } else {
    // Check per-state event transition
    const stateEvents = stateDefinition.RTb?.[currentState]?.on;
    if (stateEvents && event in stateEvents) {
      nextState = stateEvents[event];
    }
    // Fall back to global event transition
    else if (stateDefinition.on && event in stateDefinition.on) {
      nextState = stateDefinition.on[event];
    }
    // No transition defined
    else {
      nextState = currentState;
    }
  }

  return {
    Yy: nextState,
    UQc: currentState,
    internal_Lq: nextState !== currentState,
    event: event,
  };
}

export { resolveTransition };
