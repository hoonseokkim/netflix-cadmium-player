/**
 * @module StreamingErrorNotifier
 * @description Handles streaming error notifications in the Cadmium player.
 * Tracks whether a fatal (non-temporary) error has already been emitted
 * so that permanent failures are only reported once, while temporary
 * failures can still propagate.
 * @origin Module_31485
 */

/**
 * Notifies listeners of streaming errors, ensuring permanent errors
 * are emitted only once while allowing temporary failure events through.
 */
export class StreamingErrorNotifier {
  /**
   * @param {Object} console - Logger / console interface for error logging
   * @param {Object} events - Event emitter to dispatch error events on
   */
  constructor(console, events) {
    /** @type {Object} */
    this.console = console;

    /** @type {Object} */
    this.events = events;

    /**
     * Whether a permanent (non-temporary) error has already been reported.
     * Once set to true, no further errors are emitted.
     * @type {boolean}
     */
    this.permanentErrorReported = false;
  }

  /**
   * Returns whether a permanent error has already been reported.
   * @returns {boolean}
   */
  hasPermanentError() {
    return this.permanentErrorReported;
  }

  /**
   * Handles a network failure event. Dispatches to the appropriate
   * handler based on whether it carries a structured error or a
   * legacy error payload.
   * @param {Object} errorEvent - The network failure event
   * @param {Object} [errorEvent.structuredError] - Structured error object (if present)
   * @param {string} [errorEvent.errorMessage] - Legacy error message
   * @param {string} [errorEvent.errorSubCode] - Legacy error sub-code
   * @param {number} [errorEvent.networkErrorCode] - Network-layer error code
   * @param {number} [errorEvent.httpCode] - HTTP status code
   * @param {*} [errorEvent.nativeCode] - Native / platform error code
   * @param {*} [errorEvent.viewableId] - ID of the viewable being played
   * @param {boolean} [errorEvent.temporaryFailure] - Whether the failure is temporary
   * @param {string} [errorEvent.server] - Server identifier
   */
  onNetworkFailure(errorEvent) {
    if (errorEvent.structuredError === undefined) {
      this._emitError(errorEvent.errorMessage, errorEvent.errorSubCode, {
        networkErrorCode: errorEvent.networkErrorCode,
        httpCode: errorEvent.httpCode,
        nativeCode: errorEvent.nativeCode,
        viewableId: errorEvent.viewableId,
        temporaryFailure: !!errorEvent.temporaryFailure,
        server: errorEvent.server,
      });
    } else {
      this._handleStructuredError(errorEvent.structuredError);
    }
  }

  /**
   * Handles a structured error by extracting its message and category,
   * then delegating to the core emit method.
   * @param {Object} structuredError
   * @param {string} structuredError.message - Error message
   * @param {Object} [structuredError.category] - Error category details
   * @private
   */
  _handleStructuredError(structuredError) {
    this._emitError(
      structuredError.message,
      undefined,
      {
        ...structuredError.category,
        err: /* serialized context */ undefined,
      }
    );
  }

  /**
   * Core error emission logic. Skips if a permanent error has already
   * been reported. Marks permanent error state unless the failure is
   * flagged as temporary. Emits an "error" event on the event bus.
   * @param {string} message - Error message
   * @param {string} [errorSubCode] - Error sub-code (defaults to "NFErr_MC_StreamingFailure")
   * @param {Object} [metadata={}] - Additional metadata
   * @private
   */
  _emitError(message, errorSubCode, metadata = {}) {
    if (this.permanentErrorReported) {
      return;
    }

    if (!metadata.temporaryFailure) {
      this.permanentErrorReported = true;
    }

    const errorPayload = {
      type: 'error',
      error: errorSubCode ?? 'NFErr_MC_StreamingFailure',
      errormsg: message,
      temporaryFailure: false,
      ...metadata,
    };

    this.console.error('notifyStreamingError:', errorPayload);
    this.events.emit('error', errorPayload);
  }
}
