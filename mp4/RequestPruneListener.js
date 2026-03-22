/**
 * Netflix Cadmium Player - Request Prune Listener
 *
 * Listens for "requestsPruned" events on the playgraph and invokes
 * a configured callback (typically to trigger garbage collection or
 * buffer management after pruned requests).
 *
 * @module mp4/RequestPruneListener
 */

/**
 * Binds a callback to playgraph request-pruning events.
 */
export class RequestPruneListener {
  /**
   * @param {Object} config - Configuration object.
   * @param {Function} config.pruneCallback - Callback to invoke when requests are pruned.
   */
  constructor({ pruneCallback }) {
    /** @type {Function} The prune callback */
    this.pruneCallback = pruneCallback;
    /** @type {Function} Bound event handler for attaching/detaching */
    this.boundHandler = this._createHandler();
  }

  /**
   * Attaches the prune listener to a playgraph's events.
   *
   * @param {Object} playgraph - Playgraph instance with an `events` EventEmitter.
   */
  attach(playgraph) {
    playgraph.events.on('requestsPruned', this.boundHandler);
  }

  /**
   * Detaches the prune listener from a playgraph's events.
   *
   * @param {Object} playgraph - Playgraph instance with an `events` EventEmitter.
   */
  detach(playgraph) {
    playgraph.events.removeListener('requestsPruned', this.boundHandler);
  }

  /**
   * Creates a bound handler function that invokes the prune callback.
   *
   * @returns {Function} The event handler.
   * @private
   */
  _createHandler() {
    return () => this.pruneCallback();
  }
}
