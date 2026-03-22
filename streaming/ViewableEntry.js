/**
 * @module ViewableEntry
 * @description Represents an entry in the viewable session pipeline. Manages the lifecycle
 * of a streaming session entry including decompression, error handling, and network
 * failure recovery. Emits events when errors occur and releases resources on failure.
 *
 * @original Module 11177
 */

import { __awaiter, __generator } from '../utils/TsLibHelpers.js';
import { EventEmitter } from '../events/EventEmitter.js';
import { createLazy } from '../utils/LazyInitializer.js';
import { DEBUG } from '../utils/DebugFlags.js';
import { NetworkError } from '../network/NetworkError.js';

/**
 * Represents a viewable entry in the streaming pipeline.
 * Wraps a session provider and handles async initialization with error recovery.
 */
export class ViewableEntry {
    /**
     * @param {Object} sessionProvider - Provider for the underlying viewable session
     * @param {Object} console - Console/logger instance for debug output
     * @param {Object} networkFailureHandler - Handler for network failure events
     * @param {Object} bufferMode - Current buffer mode configuration
     * @param {Object|null} resourceHandle - Optional resource handle to release on error
     */
    constructor(sessionProvider, console, networkFailureHandler, bufferMode, resourceHandle) {
        this._sessionProvider = sessionProvider;
        this.console = console;
        this._networkFailureHandler = networkFailureHandler;
        this.bufferMode = bufferMode;
        this._resourceHandle = resourceHandle;

        /** @type {EventEmitter} Event emitter for error events */
        this.events = new EventEmitter();

        /** @type {Object} Decompressor instance for this entry */
        this.decompressor = sessionProvider.decompressorFactory.create();

        /** @private Lazy-initialized promise for the session */
        this._lazySession = createLazy(() => this._initializeSession());
    }

    /**
     * The underlying viewable session, if available.
     * @type {Object|undefined}
     */
    get viewableSession() {
        return this._sessionProvider?.viewableSession;
    }

    /**
     * Lazily-initialized promise that resolves to the media query result.
     * On failure, handles network errors, emits error events, and releases resources.
     * @type {Promise<Object>}
     */
    get mediaQuery() {
        return this._lazySession();
    }

    /**
     * @private
     * Initializes the session, handling errors with network failure reporting
     * and resource cleanup.
     * @returns {Promise<Object>} The session media query result
     */
    async _initializeSession() {
        try {
            return await this._sessionProvider.mediaQuery;
        } catch (error) {
            if (NetworkError.isNetworkError(error)) {
                this._networkFailureHandler.onNetworkFailure({
                    movieId: this.bufferMode.movieId,
                    errorMessage: error.message,
                    cause: error
                });
            }

            if (DEBUG) {
                this.console.pauseTrace(
                    "Removing broken viewable entry due to error",
                    this.bufferMode
                );
            }

            this.events.emit("error", { error });
            this._resourceHandle?.release();

            throw error;
        }
    }
}
