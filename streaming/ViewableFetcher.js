/**
 * Netflix Cadmium Player - Viewable Fetcher
 *
 * Manages the lifecycle of fetching and creating a "viewable" session
 * for a playback branch. A viewable represents a piece of content
 * (movie, episode, ad) that can be played. This class:
 *
 *   - Checks if the viewable is already cached/available
 *   - Optionally waits for a pre-fetch operation to complete
 *   - Creates the viewable session via the viewable creator service
 *   - Tracks timing metrics (request start, session ready)
 *   - Handles cancellation and error propagation
 *   - Provides a promise-based API for awaiting session readiness
 *
 * @module streaming/ViewableFetcher
 * @original Module_26286
 */

// import { __awaiter, __generator } from 'tslib';     // Module 22970
// import { Deferred } from './Deferred';                // Module 91176
// import { platform } from './Platform';                // Module 66164

export class ViewableFetcher {
  /**
   * @param {Object} viewableId - Identifier for the content to fetch.
   * @param {Object} viewableCreator - Service that creates viewable sessions.
   * @param {Function} onSessionReady - Callback when the session is ready.
   * @param {Function} onError - Callback for error handling.
   * @param {Function} onDestroy - Callback when the viewable is destroyed.
   * @param {Function} createDecompressor - Factory for creating decompressors.
   */
  constructor(viewableId, viewableCreator, onSessionReady, onError, onDestroy, createDecompressor) {
    /** @private */
    this._viewableId = viewableId;
    /** @private */
    this._viewableCreator = viewableCreator;
    /** @private */
    this._onSessionReady = onSessionReady;
    /** @private */
    this._onError = onError;
    /** @private */
    this._onDestroy = onDestroy;
    /** @private */
    this._createDecompressor = createDecompressor;

    /** @private Deferred that resolves with the viewable session */
    this._sessionDeferred = new Deferred();
  }

  /**
   * The viewable session, if available.
   * @type {Object|undefined}
   */
  get viewableSession() {
    return this._internal?.viewableSession;
  }

  /**
   * Promise that resolves when the viewable session is ready.
   * @type {Promise<Object>}
   */
  get sessionReady() {
    return this._sessionDeferred.promise;
  }

  /**
   * Disposes of the viewable fetcher and its session.
   * Notifies the session of cancellation and calls the destroy callback.
   */
  destroy() {
    if (this.viewableSession) {
      this.viewableSession.cancel(this._branchContext);
      this._onDestroy(this.viewableSession);
    }
    this._internal?.decompressor?.release();
    this._internal = undefined;
  }

  /**
   * Checks if the viewable is already cached/available.
   * @returns {boolean}
   */
  isCached() {
    return this._viewableCreator.isCached(this._viewableId);
  }

  /**
   * Fetches or creates the viewable session for the given branch context.
   * If not cached and a prefetch function is provided, waits for the
   * prefetch to complete first.
   *
   * @param {Object} branchContext - The branch context (contains cancellation flag).
   * @param {Function} [prefetchFn] - Optional async prefetch function.
   * @returns {Promise<Object>} The viewable session.
   * @throws {Error} If the branch is cancelled during fetch.
   */
  async fetch(branchContext, prefetchFn) {
    this._branchContext = branchContext;

    // Wait for prefetch if not cached
    let prefetchResult;
    if (!this._viewableCreator.isCached(this._viewableId) && prefetchFn) {
      prefetchResult = await prefetchFn();
      if (branchContext.isCancelledFlag) {
        throw new Error("Branch cancelled");
      }
    }

    // Create the viewable session
    const decompressor = this._createDecompressor();
    const { sessionReady, viewableSession, decompressor: decomp } =
      this._viewableCreator.createViewable(this._viewableId, decompressor);

    this._internal = { decompressor: decomp, viewableSession };

    const timing = {
      requestStartTime: platform.now(),
      sessionReadyTime: undefined,
    };

    // If session is immediately available (cached)
    if (viewableSession) {
      timing.sessionReadyTime = timing.requestStartTime;
      this._onSessionCreated(viewableSession, branchContext, prefetchResult, timing, false);
      this._sessionDeferred.resolve(viewableSession);
      return viewableSession;
    }

    // Wait for async session creation
    let session;
    try {
      session = await sessionReady;
      timing.sessionReadyTime = platform.now();
    } catch (error) {
      timing.sessionReadyTime = platform.now();
      this._onError(branchContext, error, prefetchResult, timing);
      throw error;
    }

    this._sessionDeferred.resolve(session);
    this._onSessionCreated(session, branchContext, prefetchResult, timing, true);
    return session;
  }

  /**
   * Internal handler called when a viewable session is successfully created.
   *
   * @private
   * @param {Object} session - The created viewable session.
   * @param {Object} branchContext - The branch context.
   * @param {*} prefetchResult - Result from prefetch, if any.
   * @param {Object} timing - Timing metrics.
   * @param {boolean} wasAsync - Whether the session was created asynchronously.
   */
  _onSessionCreated(session, branchContext, prefetchResult, timing, wasAsync) {
    if (this._internal) {
      this._internal.viewableSession = session;
      session.setBranchContext(branchContext);
      this._onSessionReady(branchContext, session, prefetchResult, timing, wasAsync);
    }
  }
}
