/**
 * Netflix Cadmium Player -- PlayReadyEmeSessionAdapter
 *
 * Extends {@link EmeSessionAdapter} with PlayReady-specific renewal
 * behaviour.  When a PlayReady CDM needs to renew keys it cannot
 * simply re-use the existing session; instead a brand-new
 * `MediaKeySession` must be created and a fresh `generateRequest`
 * issued.  This adapter handles that "re-key via new session" flow
 * and monitors key-status changes on the new session so the old
 * session can be closed once the new keys become usable.
 *
 * Original: Webpack Module 963
 *
 * @module drm/PlayReadyEmeSessionAdapter
 */

import { EmeSessionAdapter } from './EmeSessionAdapter.js';

/**
 * PlayReady EME session adapter with renewal-via-new-session support.
 */
export class PlayReadyEmeSessionAdapter extends EmeSessionAdapter {
  constructor(...args) {
    super(...args);

    /**
     * Handler for key-status changes on the renewal session.
     * Once any key reaches "usable" status, the old session is closed.
     * @private
     */
    this._onRenewalKeyStatusChange = (event) => {
      const statuses = event.target.keyStatuses;
      try {
        for (const [, status] of statuses) {
          if (status === 'usable') {
            this.emeSession?.removeEventListener(
              'keystatuseschange',
              this._onRenewalKeyStatusChange,
            );
            this._previousSession?.close();
            this._previousSession = undefined;
            break;
          }
        }
      } catch (err) {
        console.error('Error handling key status change', err);
      }
    };
  }

  // -----------------------------------------------------------------------
  // Renewal via new session
  // -----------------------------------------------------------------------

  /**
   * Initialize a renewal DRM flow by creating a new session on the
   * same `MediaKeys` object.  The previous session is retained until
   * the new session's keys become usable.
   *
   * @param {MediaKeys} mediaKeys - The existing MediaKeys instance.
   * @param {Function} onMessage - Message handler for the new session.
   * @param {Function} onKeyStatus - Key-status handler for the new session.
   * @param {Function} onClosed - Unexpected-close handler.
   * @returns {Promise<void>}
   */
  initializeDRMFlow(mediaKeys, onMessage, onKeyStatus, onClosed) {
    // Detach handlers from current session
    this.removeMessageHandler(onMessage);
    this.removeKeyStatusHandler(onKeyStatus);

    // Keep the old session alive until renewal completes
    this._previousSession = this.emeSession;

    // Create a fresh session for the renewal request
    this.emeSession = new _NativeKeySessionWrapper(mediaKeys, onClosed);

    // Attach handlers to the new session
    this.addMessageHandler(onMessage);
    this.addKeyStatusHandler(onKeyStatus);

    // Monitor for usable keys to know when to close old session
    this.emeSession.addEventListener(
      'keystatuseschange',
      this._onRenewalKeyStatusChange,
    );

    // Re-issue the generate request with the stored init data
    return this.generateRequest(this._initDataType, this._initData, false);
  }

  // -----------------------------------------------------------------------
  // Close (both current and previous sessions)
  // -----------------------------------------------------------------------

  /**
   * Close both the active and any retained previous session.
   * @returns {Promise<void>}
   */
  close() {
    if (!this.emeSession) {
      throw new Error('EME_CLOSE_FAILED: key session is not valid');
    }

    const closeOne = (session) => {
      return session?.sessionId ? session.close() : Promise.resolve();
    };

    return Promise.all([
      closeOne(this.emeSession),
      closeOne(this._previousSession),
    ])
      .then(() => {})
      .finally(() => {
        this.emeSession = undefined;
        this._previousSession = undefined;
      });
  }

  // -----------------------------------------------------------------------
  // Generate request (stores init data for renewal)
  // -----------------------------------------------------------------------

  /**
   * Generate a license request, caching the init-data for potential
   * renewal via {@link initializeDRMFlow}.
   *
   * @param {string} initDataType
   * @param {BufferSource[]} initDataArray
   * @param {boolean} [_isRenewal]
   * @returns {Promise<void>}
   */
  generateRequest(initDataType, initDataArray, _isRenewal) {
    this._initDataType = initDataType;
    this._initData = initDataArray;
    return super.generateRequest(initDataType, initDataArray);
  }
}

// Re-use the NativeKeySessionWrapper from the parent module
// (In the original codebase this is the `d` constructor from Module_90349)
class _NativeKeySessionWrapper {
  constructor(mediaKeys, onClosed) {
    this._onClosed = onClosed;
    this._session = mediaKeys.createSession('temporary');
    this._session.closed.then((reason) => this._onClosed?.(reason));
  }
  addEventListener(t, h, o) { this._session.addEventListener(t, h, o); }
  removeEventListener(t, h, o) { this._session.removeEventListener(t, h, o); }
  generateRequest(t, d) { return this._session.generateRequest(t, d); }
  update(r) { return this._session.update(r); }
  close() { this._onClosed = undefined; return this._session.close(); }
  get sessionId() { return this._session.sessionId; }
  get expiration() { return this._session.expiration; }
  get keyStatuses() { return this._session.keyStatuses; }
}
