/**
 * Netflix Cadmium Player - ABR Rule Engine (Algorithm)
 *
 * Implements a rule-based algorithm engine for adaptive bitrate decisions.
 * Rules are evaluated in order against state transitions, and matching
 * rules produce actions that modify the ABR store.
 *
 * Also provides combinator and debounce utilities for composing
 * complex rule predicates.
 *
 * @module abr/RuleEngine
 */

/**
 * Extracts the display name of a rule predicate.
 * @param {Function} predicate
 * @returns {string}
 */
function getPredicateName(predicate) {
  return predicate.displayName ?? predicate.name;
}

/**
 * Creates a sequential combinator predicate.
 *
 * All predicates must fire in order within a single evaluation pass.
 * The reset predicate resets the sequence counter.
 *
 * @param {Array<Function>} predicates - Ordered list of predicates to match.
 * @param {Function} resetPredicate - Predicate that resets the sequence.
 * @returns {Function} Combined predicate with a `reset` method.
 */
export function createCombinator(predicates, resetPredicate) {
  let matchIndex = 0;

  return Object.assign(
    function combinedPredicate(previousState, nextState, ...args) {
      for (let i = matchIndex; i < predicates.length; i++) {
        if (predicates[i](previousState, nextState, ...args)) {
          matchIndex++;
          if (matchIndex === predicates.length) {
            matchIndex = 0;
            return true;
          }
        } else {
          break;
        }
      }
      if (resetPredicate(previousState, nextState, ...args)) {
        matchIndex = 0;
      }
      return false;
    },
    {
      reset() {
        matchIndex = 0;
      },
      displayName: `combinator(${predicates.map(getPredicateName).join(', ')})`,
    }
  );
}

/**
 * Creates a debounced predicate that fires after a delay.
 *
 * The trigger predicate starts a timer; when it elapses, the
 * debounced predicate fires. The cancel predicate aborts the timer.
 *
 * @param {Object} options
 * @param {Function} options.trigger - Trigger predicate.
 * @param {number} options.delayMs - Debounce delay in milliseconds.
 * @param {Function} [options.cancel] - Cancel predicate (defaults to trigger).
 * @param {Object} options.scheduler - Scheduler for timer tasks.
 * @returns {Function} Debounced predicate with a `reset` method.
 */
export function createDebouncedPredicate({
  trigger,
  delayMs,
  cancel,
  scheduler,
}) {
  const cancelPredicate = cancel ?? trigger;
  let timerTask;
  let fired = false;

  function resetTimer() {
    timerTask?.destroy();
    timerTask = undefined;
    fired = false;
  }

  function onTimerComplete() {
    fired = true;
    timerTask = undefined;
  }

  return Object.assign(
    function debouncedPredicate(previousState, nextState, ...args) {
      if (!fired && !timerTask && trigger(previousState, nextState, ...args)) {
        timerTask = scheduler.scheduleTimer(
          TimeUtil.fromMilliseconds(delayMs),
          onTimerComplete
        );
      }

      if (cancelPredicate(previousState, nextState, ...args)) {
        resetTimer();
      }

      const result = fired;
      if (result) fired = false;
      return result;
    },
    {
      reset: resetTimer,
      displayName: `debounced(${getPredicateName(trigger)}, ${delayMs}ms)`,
    }
  );
}

/**
 * Rule-based algorithm engine for ABR decisions.
 *
 * Evaluates an ordered list of [predicate, action] rules against
 * state transitions. When a predicate matches, its associated
 * action(s) are executed, potentially modifying the ABR store state.
 */
export class RuleEngine {
  /**
   * @param {Array<[Function, Function|Array<Function>]>} rules - Ordered rule list.
   * @param {Object} options - Configuration options.
   * @param {Object} options.store - The ABR state store.
   * @param {Function} [options.getExtraArgs] - Extra arguments provider for predicates.
   */
  constructor(rules, options) {
    /** @type {Array} */
    this.rules = rules;
    /** @type {Object} */
    this.store = options.store;
    /** @type {Function} */
    this._getExtraArgs = options.getExtraArgs || (() => []);

    this.store.addListener('update', this.onUpdate.bind(this));
  }

  /**
   * Resets all rule predicates.
   */
  reset() {
    this.rules.forEach(([predicate]) => predicate.reset?.());
  }

  /**
   * Handles a state update by evaluating all rules in order.
   *
   * @param {Object} updateEvent
   * @param {Object} updateEvent.previousState - Previous ABR state.
   * @param {Object} updateEvent.nextState - Next ABR state.
   */
  onUpdate(updateEvent) {
    const previousState = updateEvent.previousState;
    let currentState = updateEvent.nextState;

    this.store.beginBatchUpdate();

    try {
      for (const [predicate, actions] of this.rules) {
        const actionList = Array.isArray(actions) ? actions : [actions];

        if (
          predicate(
            previousState,
            currentState,
            ...this._getExtraArgs()
          )
        ) {
          for (const action of actionList) {
            const result = action?.(currentState, getPredicateName(predicate));

            if (result?.reset) {
              this.store.reset(result.stateUpdate);
            } else if (result?.stateUpdate) {
              this.store.update(result.stateUpdate);
            }

            if (result?.breakRules) break;
          }

          currentState = this.store.value;
        }
      }
    } finally {
      this.store.endBatchUpdate();
    }
  }
}
