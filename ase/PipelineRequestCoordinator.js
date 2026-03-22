/**
 * Netflix Cadmium Player - ASE Pipeline Request Coordinator
 *
 * Manages the lifecycle of pipeline update requests in the adaptive
 * streaming engine. Coordinates request state transitions through
 * CREATED -> STARTED -> REQUEST_ISSUED -> EVALUATED -> DESTRUCTED,
 * ensuring proper sequencing of async operations.
 *
 * @module ase/PipelineRequestCoordinator
 */

/**
 * State enum for pipeline requests.
 * @enum {number}
 */
export const RequestState = Object.freeze({
  CREATED: 0,
  STARTED: 1,
  REQUEST_ISSUED: 2,
  EVALUATED: 3,
  DESTRUCTED: 4,
});

/**
 * Coordinates a single pipeline update request through its lifecycle.
 *
 * Ensures that evaluation completes before destruction, and that
 * callbacks are properly sequenced with state transitions. Uses
 * internal promises to allow async waiting on specific states.
 */
export class PipelineRequestCoordinator {
  /**
   * @param {Function} onUpdate - Callback invoked when the request is evaluated.
   * @param {Object} console - Logging console.
   * @param {string} name - Descriptive name for this coordinator.
   */
  constructor(onUpdate, console, name) {
    /** @private @type {Function} */
    this.onUpdate = onUpdate;
    /** @type {Object} */
    this.console = console;
    /** @type {string} */
    this.name = name;
    /** @private @type {number} */
    this.requestState = RequestState.CREATED;
    /** @private @type {Object<number, Promise>} */
    this._statePromises = {};
    /** @private @type {Object<number, Function>} */
    this._stateResolvers = {};
  }

  /**
   * The current state of the request.
   * @type {number}
   */
  get state() {
    return this.requestState;
  }

  /**
   * Starts the request lifecycle: transitions to STARTED, triggers
   * the update callback, then transitions to EVALUATED.
   */
  start() {
    if (
      this.requestState === RequestState.DESTRUCTED ||
      this.requestState === RequestState.STARTED
    ) {
      return;
    }

    this._transitionTo(RequestState.STARTED);

    // Create promises for EVALUATED and REQUEST_ISSUED states
    for (const state of [RequestState.EVALUATED, RequestState.REQUEST_ISSUED]) {
      const promise = new Promise((resolve) => {
        this._stateResolvers[state] = resolve;
        this._statePromises[state] = promise;
      });
    }

    this.onUpdate();
    this._transitionTo(RequestState.EVALUATED);
  }

  /**
   * Transitions to a new state and resolves any waiting promise.
   *
   * @private
   * @param {number} newState - The target state.
   */
  _transitionTo(newState) {
    this.requestState = newState;
    if (this._stateResolvers) {
      const resolver = this._stateResolvers[newState];
      resolver?.();
    }
  }

  /**
   * Destroys the coordinator, waiting for any in-progress evaluation
   * to complete first.
   *
   * @returns {Promise<void>}
   */
  async destroy() {
    if (this.requestState === RequestState.STARTED) {
      await this._statePromises[RequestState.EVALUATED];
    }

    this._stateResolvers = undefined;
    this._statePromises = undefined;
    this.requestState = RequestState.DESTRUCTED;
  }

  /**
   * Waits for the coordinator to reach a specific state, then
   * executes an optional callback.
   *
   * @param {number} targetState - The state to wait for.
   * @param {Function} [callback] - Optional callback to run after reaching the state.
   */
  async waitForState(targetState, callback) {
    if (this.requestState === RequestState.DESTRUCTED) return;

    if (this.requestState !== RequestState.EVALUATED) {
      if (!this._statePromises) return;

      switch (targetState) {
        case RequestState.EVALUATED:
          await this._statePromises[RequestState.EVALUATED];
          break;
        case RequestState.REQUEST_ISSUED:
          await this._statePromises[RequestState.REQUEST_ISSUED];
          break;
      }
    }

    callback?.();
  }
}
