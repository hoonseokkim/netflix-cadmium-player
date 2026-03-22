/**
 * @file HttpRequestObserver - Delegate pattern for HTTP request lifecycle events
 * @module network/HttpRequestObserver
 * @description Provides a proxy/delegate object that safely forwards HTTP request
 * lifecycle events (data received, completion, failure, redirects, etc.) to an
 * optional underlying handler. Uses optional chaining to safely handle cases
 * where no handler is set.
 * @original Module_81392
 */

/**
 * Base class that delegates HTTP request lifecycle events to an optional handler.
 * All methods safely no-op if no handler is set.
 *
 * @class HttpRequestObserverBase
 */
export class HttpRequestObserverBase {
    /**
     * @param {Object} [handler] - Optional handler implementing request lifecycle callbacks
     */
    constructor(handler) {
        /** @type {Object|undefined} The underlying event handler */
        this.handler = handler;
    }

    /**
     * Replace the current handler.
     * @param {Object} handler - New handler
     */
    setHandler(handler) {
        this.handler = handler;
    }

    /**
     * Clear the current handler.
     */
    clearHandler() {
        this.handler = undefined;
    }

    /**
     * Called when bytes are extracted from the response.
     * @param {*} data - Extracted byte data
     */
    extractBytes(data) {
        this.handler?.extractBytes?.(data);
    }

    /**
     * Called when the request becomes active.
     * @param {*} requestInfo - Request information
     */
    onRequestActive(requestInfo) {
        this.handler?.onRequestActive?.(requestInfo);
    }

    /**
     * Called when the first byte of the response is received.
     * @param {*} timing - First byte timing information
     */
    onFirstByteReceived(timing) {
        this.handler?.onFirstByte?.(timing);
    }

    /**
     * Called when data is received from the response.
     * @param {*} data - Received data
     * @param {*} metadata - Data metadata
     */
    onDataReceived(data, metadata) {
        this.handler?.onDataReceived?.(data, metadata);
    }

    /**
     * Called when the request completes successfully.
     * @param {*} result - Completion result
     * @param {*} metadata - Completion metadata
     */
    onRequestCompleted(result, metadata) {
        this.handler?.onRequestComplete?.(result, metadata);
    }

    /**
     * Called when the request fails and we skip to the next segment.
     * @param {*} error - Failure information
     */
    onRequestFailed(error) {
        this.handler?.onRequestFailed?.(error);
    }

    /**
     * Called when the request is redirected to a different branch/CDN.
     * @param {*} fromUrl - Original URL
     * @param {*} toUrl - Redirect target URL
     * @param {*} metadata - Redirect metadata
     */
    onRequestRedirectedBranch(fromUrl, toUrl, metadata) {
        this.handler?.onRequestRedirectedBranch?.(fromUrl, toUrl, metadata);
    }

    /**
     * Called when the content length changes during the request.
     * @param {*} oldLength - Previous content length
     * @param {*} newLength - New content length
     * @param {*} metadata - Change metadata
     */
    onContentLengthChanged(oldLength, newLength, metadata) {
        this.handler?.onContentLengthChanged?.(oldLength, newLength, metadata);
    }

    /**
     * Called when the request is redirected.
     * @param {*} redirectInfo - Redirect information
     */
    onRequestRedirected(redirectInfo) {
        this.handler?.onRequestRedirected?.(redirectInfo);
    }

    /**
     * Called when response metadata is extracted.
     * @param {*} metadata - Response metadata
     */
    onResponseMetadata(metadata) {
        this.handler?.onResponseMetadata?.(metadata);
    }

    /**
     * Called when fragment timing information is resolved.
     * @param {*} fragmentId - Fragment identifier
     * @param {*} startTime - Fragment start time
     * @param {*} endTime - Fragment end time
     * @param {*} metadata - Timing metadata
     */
    recordFragmentTiming(fragmentId, startTime, endTime, metadata) {
        this.handler?.onFragmentTimesResolved?.(fragmentId, startTime, endTime, metadata);
    }
}

/**
 * Concrete HTTP request observer that extends the base with direct method aliases.
 * The prototype is patched so that handler method names map directly to observer methods.
 *
 * @class HttpRequestObserver
 * @extends HttpRequestObserverBase
 */
export class HttpRequestObserver extends HttpRequestObserverBase {
    constructor(...args) {
        super(...args);
    }
}

// Alias methods on prototype so the observer can also be used directly as a handler
HttpRequestObserver.prototype.extractBytes = HttpRequestObserver.prototype.extractBytes;
HttpRequestObserver.prototype.onRequestActive = HttpRequestObserver.prototype.onRequestActive;
HttpRequestObserver.prototype.onFirstByte = HttpRequestObserver.prototype.onFirstByteReceived;
HttpRequestObserver.prototype.onDataReceived = HttpRequestObserver.prototype.onDataReceived;
HttpRequestObserver.prototype.onRequestComplete = HttpRequestObserver.prototype.onRequestCompleted;
HttpRequestObserver.prototype.onRequestFailed = HttpRequestObserver.prototype.onRequestFailed;
HttpRequestObserver.prototype.onRequestRedirectedBranch = HttpRequestObserver.prototype.onRequestRedirectedBranch;
HttpRequestObserver.prototype.onContentLengthChanged = HttpRequestObserver.prototype.onContentLengthChanged;
HttpRequestObserver.prototype.onRequestRedirected = HttpRequestObserver.prototype.onRequestRedirected;
HttpRequestObserver.prototype.onResponseMetadata = HttpRequestObserver.prototype.onResponseMetadata;
HttpRequestObserver.prototype.onFragmentTimesResolved = HttpRequestObserver.prototype.recordFragmentTiming;

export default HttpRequestObserver;
