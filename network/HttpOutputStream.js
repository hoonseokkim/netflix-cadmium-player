/**
 * Netflix Cadmium Player - HTTP Output Stream
 *
 * Manages an HTTP request/response lifecycle as a writable output stream.
 * Buffers write operations and sends them as the request body, then
 * waits for the response. Handles timeouts, errors, and abort signals.
 *
 * Used by the MSL (Message Security Layer) transport to send encrypted
 * messages to the Netflix API and receive responses.
 *
 * Flow:
 *   1. Write data chunks via `write()`
 *   2. Call `closing()` to flush buffered data and send the HTTP request
 *   3. Call `getResponse()` (nca) to await the HTTP response
 *   4. Response resolves via the internal deferred queue
 *
 * @module network/HttpOutputStream
 * @original Module_41161
 */

// import { default as TimeoutError } from './TimeoutError';           // Module 10690
// import { default as ensureCallback } from './EnsureCallback';       // Module 42979
// import { S5 as DeferredQueue } from './DeferredQueue';              // Module 89752
// import { default as safeExecute } from './SafeExecute';             // Module 79804
// import { wja as WriteBuffer } from './WriteBuffer';                 // Module 25078
// import { default as StreamClosedError } from './StreamClosedError'; // Module 48795

export class HttpOutputStream {
  /**
   * @param {Object} httpClient - The underlying HTTP client for sending requests.
   * @param {number} timeout - Request timeout in milliseconds.
   */
  constructor(httpClient, timeout) {
    /** @private HTTP client instance */
    this._httpClient = httpClient;

    /** @private Timeout duration in ms */
    this._timeout = timeout;

    /** @private Buffered write data */
    this._writeBuffer = new WriteBuffer();

    /** @private Response state: { response?, timedOut?, error?, closed? } */
    this._responseState = undefined;

    /** @private Active HTTP request handle for abort */
    this._activeRequest = undefined;

    /** @private Whether the stream is in a processing/closed state */
    this.isProcessing = false;

    /** @private Deferred response queue */
    this._deferredQueue = new DeferredQueue();
  }

  /**
   * Updates the timeout duration for the stream.
   * @param {number} timeout - New timeout in milliseconds.
   */
  setTimeout(timeout) {
    this._timeout = timeout;
  }

  /**
   * Waits for and retrieves the HTTP response. Resolves when the
   * response arrives, or rejects on timeout/error.
   *
   * @param {Function} callback - Callback for async scheduling.
   */
  getResponse(callback) {
    this._deferredQueue.await(-1, {
      result: (response) => {
        ensureCallback(callback, () => {
          if (response) {
            this._deferredQueue.item(response);
          }
          return response;
        });
      },
      timeout: () => {
        ensureCallback(callback, () => {
          this._responseState = { closed: true };
          this._deferredQueue.item(this._responseState);
          this.abort();
          throw new TimeoutError(
            "Timeout while waiting for HttpOutputStream.getResponse() despite no timeout being specified."
          );
        });
      },
      error: (err) => {
        ensureCallback(callback, () => {
          this._responseState = { closed: true };
          this._deferredQueue.item(this._responseState);
          throw err;
        });
      },
    });
  }

  /**
   * Aborts the active HTTP request and marks the stream as processing.
   */
  abort() {
    if (this._activeRequest) {
      this._activeRequest.abort();
    }
    this.isProcessing = true;
  }

  /**
   * Flushes buffered writes and sends the HTTP request. The response
   * is delivered through the deferred queue.
   *
   * @param {Object} _unused - Unused parameter.
   * @param {Function} callback - Callback for async scheduling.
   */
  closing(_unused, callback) {
    safeExecute(callback, () => {
      if (this._responseState || this._activeRequest || this.isProcessing) {
        return true;
      }

      const body = this._writeBuffer.flush();
      if (body.length > 0) {
        this._activeRequest = this._httpClient.send(
          { body },
          {
            result: (response) => {
              this._responseState = { response };
              this._deferredQueue.item(this._responseState);
            },
            timeout: () => {
              this._responseState = { timedOut: true };
              this._deferredQueue.item(this._responseState);
            },
            error: (err) => {
              this._responseState = { closed: true, error: err };
              this._deferredQueue.item(this._responseState);
            },
          }
        );
      }
      return true;
    });
  }

  /**
   * Writes data to the output buffer. Throws if the stream is already closed.
   *
   * @param {*} data - Data to write.
   * @param {*} offset - Offset into the data.
   * @param {*} length - Number of bytes to write.
   * @param {*} encoding - Data encoding.
   * @param {Function} callback - Callback for async scheduling.
   */
  write(data, offset, length, encoding, callback) {
    safeExecute(callback, () => {
      if (this._responseState) {
        throw new StreamClosedError("HttpOutputStream already closed.");
      }
      this._writeBuffer.write(data, offset, length, encoding, callback);
    }, this);
  }

  /**
   * Batches log data to be sent with the stream. No-ops if already closed.
   *
   * @param {*} logData - Log data to batch.
   * @param {Function} callback - Callback for async scheduling.
   */
  logBatcher(logData, callback) {
    safeExecute(callback, () => {
      if (this._responseState) {
        return true;
      }
      this._writeBuffer.logBatcher(logData, callback);
    });
  }
}
