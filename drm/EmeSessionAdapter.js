/**
 * Netflix Cadmium Player -- EmeSessionAdapter
 *
 * Standard W3C EME session adapter.  Wraps the browser's
 * `MediaKeySession` API and provides a uniform interface for:
 *
 *   - Creating MediaKeys from a `MediaKeySystemAccess` object
 *   - Creating and managing key sessions
 *   - Setting server certificates
 *   - Generating license requests (`generateRequest`)
 *   - Updating sessions with license responses (`update`)
 *   - Closing sessions
 *   - Adding/removing event listeners for `message` and
 *     `keystatuseschange` events
 *
 * This is the base adapter used for Widevine.  PlayReady and FairPlay
 * extend this class with scheme-specific behaviour (see
 * {@link PlayReadyEmeSessionAdapter} and {@link FairPlayEmeSessionAdapter}).
 *
 * Original: Webpack Module 90349
 *
 * @module drm/EmeSessionAdapter
 */

// import { buildTransportPacket } from '../utils/Mixins.js';         // Module 66523
// import { ErrorCode, EventTypeEnum } from '../core/ErrorCodes.js';  // Module 36129
// import { DrmError } from '../drm/DrmError.js';                     // Module 61731

// ---------------------------------------------------------------------------
// Internal: Lightweight wrapper around a native MediaKeySession
// ---------------------------------------------------------------------------

/**
 * Thin wrapper around a native `MediaKeySession`.  Proxies event
 * listener registration and session operations while tracking the
 * session's `closed` promise for unexpected-close detection.
 */
class NativeKeySessionWrapper {
  /**
   * @param {MediaKeys} mediaKeys - The MediaKeys object that owns the session.
   * @param {Function} [onClosedCallback] - Called if the session's `closed`
   *   promise resolves (indicating the CDM closed it).
   */
  constructor(mediaKeys, onClosedCallback) {
    /** @private */
    this._onClosed = onClosedCallback;

    /** @type {MediaKeySession} The underlying browser session. */
    this._session = mediaKeys.createSession('temporary');

    // Monitor unexpected closure
    this._session.closed.then((reason) => {
      this._onClosed?.(reason);
    });
  }

  /**
   * Add an event listener to the underlying session.
   * @param {string} type
   * @param {Function} handler
   * @param {*} [options]
   */
  addEventListener(type, handler, options) {
    this._session.addEventListener(type, handler, options);
  }

  /**
   * Remove an event listener from the underlying session.
   * @param {string} type
   * @param {Function} handler
   * @param {*} [options]
   */
  removeEventListener(type, handler, options) {
    this._session.removeEventListener(type, handler, options);
  }

  /**
   * Generate a license request for the given init data.
   * @param {string} initDataType - e.g. "cenc"
   * @param {BufferSource} initData - Concatenated PSSH boxes.
   * @returns {Promise<void>}
   */
  generateRequest(initDataType, initData) {
    return this._session.generateRequest(initDataType, initData);
  }

  /**
   * Update the session with a license response.
   * @param {BufferSource} response - License response bytes.
   * @returns {Promise<void>}
   */
  update(response) {
    return this._session.update(response);
  }

  /**
   * Close and release the session.
   * @returns {Promise<void>}
   */
  close() {
    return this._session.close();
  }

  /** @returns {string} The CDM-assigned session ID. */
  get sessionId() {
    return this._session.sessionId;
  }

  /** @returns {number} Expiration time (ms since epoch), or NaN. */
  get expiration() {
    return this._session.expiration;
  }

  /** @returns {MediaKeyStatusMap} Current key statuses. */
  get keyStatuses() {
    return this._session.keyStatuses;
  }
}

// ---------------------------------------------------------------------------
// EmeSessionAdapter -- the main export
// ---------------------------------------------------------------------------

/** EME event type for license/challenge messages. */
const EVENT_MESSAGE = 'message';

/** EME event type for key-status changes. */
const EVENT_KEY_STATUS_CHANGE = 'keystatuseschange';

/**
 * Standard EME session adapter (Widevine base implementation).
 *
 * Injected dependencies (via IoC decorators in the original):
 *   - `navigator`          (for `requestMediaKeySystemAccess`)
 *   - `typeChecker`        (runtime type validation)
 *   - `base64Codec`        (Base64 encode/decode)
 *   - `elementFactory`     (DOM element factory -- unused in standard path)
 *   - `platformConfig`     (platform feature flags)
 *   - `textDecoder`        (TextDecoder wrapper)
 */
export class EmeSessionAdapter {
  /** @type {string} */
  static MESSAGE_EVENT = EVENT_MESSAGE;

  /** @type {string} */
  static KEY_STATUS_CHANGE_EVENT = EVENT_KEY_STATUS_CHANGE;

  /**
   * @param {Navigator} navigator - Browser navigator for MKSA.
   * @param {object} typeChecker - Runtime type-check utility.
   * @param {object} base64Codec - Base64 encode/decode helper.
   * @param {object} elementFactory - DOM element factory.
   * @param {object} platformConfig - Platform feature flags.
   * @param {object} textDecoder - Text decoder wrapper.
   */
  constructor(navigator, typeChecker, base64Codec, elementFactory, platformConfig, textDecoder) {
    /** @private */ this._navigator = navigator;
    /** @private */ this._typeChecker = typeChecker;
    /** @private */ this._base64Codec = base64Codec;
    /** @private */ this._elementFactory = elementFactory;
    /** @private */ this._platformConfig = platformConfig;
    /** @private */ this._textDecoder = textDecoder;

    /** @type {NativeKeySessionWrapper|undefined} */
    this.emeSession = undefined;
  }

  // -----------------------------------------------------------------------
  // Session ID
  // -----------------------------------------------------------------------

  /**
   * Get the current session ID, if a session has been created.
   * @returns {string|undefined}
   */
  getSessionId() {
    return this.emeSession?.sessionId;
  }

  // -----------------------------------------------------------------------
  // MediaKeySystemAccess
  // -----------------------------------------------------------------------

  /**
   * Request a `MediaKeySystemAccess` from the browser.
   *
   * @param {string} keySystem - EME key-system identifier.
   * @param {MediaKeySystemConfiguration[]} configs - Supported configurations.
   * @returns {Promise<MediaKeySystemAccess>}
   */
  requestMediaKeySystemAccess(keySystem, configs) {
    return this._navigator.requestMediaKeySystemAccess(keySystem, configs);
  }

  // -----------------------------------------------------------------------
  // MediaKeys lifecycle
  // -----------------------------------------------------------------------

  /**
   * Create `MediaKeys` from the given `MediaKeySystemAccess`.
   *
   * @param {MediaKeySystemAccess} access
   * @returns {Promise<MediaKeys>}
   */
  createMediaKeys(access) {
    return access.createMediaKeys();
  }

  /**
   * Create a new key session from the given `MediaKeys`.
   *
   * @param {MediaKeys} mediaKeys
   * @param {Function} onClosedCallback - Invoked if the CDM closes the session.
   */
  createSession(mediaKeys, onClosedCallback) {
    this.emeSession = new NativeKeySessionWrapper(mediaKeys, onClosedCallback);
  }

  // -----------------------------------------------------------------------
  // DRM flow operations
  // -----------------------------------------------------------------------

  /**
   * Not supported for standard Widevine sessions.
   * Subclasses (PlayReady) override this for renewal via new session.
   *
   * @returns {Promise<never>}
   */
  initializeDRMFlow() {
    throw new Error('EME_GENERATEREQUEST_FAILED: initializeDRMFlow not supported');
  }

  /**
   * Whether a session currently exists.
   * @returns {boolean}
   */
  hasSession() {
    return !!this.emeSession;
  }

  /**
   * Set the server certificate on the given `MediaKeys` object.
   *
   * @param {MediaKeys} mediaKeys
   * @param {BufferSource|null} certificate - Server certificate bytes.
   * @returns {Promise<void>}
   */
  setServerCertificate(mediaKeys, certificate) {
    if (this._typeChecker.isFunction(mediaKeys.setServerCertificate) && certificate) {
      return mediaKeys.setServerCertificate(certificate);
    }
    return Promise.resolve();
  }

  /**
   * Generate a license request for the given init data.
   *
   * @param {string} initDataType - e.g. "cenc"
   * @param {BufferSource[]} initDataArray - Array of init-data buffers (first is used).
   * @returns {Promise<void>}
   */
  generateRequest(initDataType, initDataArray) {
    if (!this.emeSession) {
      throw new Error('EME_GENERATEREQUEST_FAILED: key session is not valid');
    }
    return this.emeSession.generateRequest(initDataType, initDataArray[0]);
  }

  /**
   * Update the session with a license response.
   *
   * @param {BufferSource[]} responseArray - Array of response buffers (first is used).
   * @returns {Promise<void>}
   */
  update(responseArray) {
    if (!this.emeSession) {
      throw new Error('EME_UPDATE_FAILED: key session is not valid');
    }
    return this.emeSession.update(responseArray[0]);
  }

  // -----------------------------------------------------------------------
  // Session close
  // -----------------------------------------------------------------------

  /**
   * Close the current key session.
   *
   * @returns {Promise<void>}
   */
  close() {
    if (!this.emeSession) {
      throw new Error('EME_CLOSE_FAILED: key session is not valid');
    }

    let closePromise = Promise.resolve();
    if (this.getSessionId()) {
      closePromise = this.emeSession.close();
    }
    this.emeSession = undefined;
    return closePromise;
  }

  /**
   * Renewal via re-keying is not supported for standard Widevine.
   * @returns {Promise<never>}
   */
  renew() {
    throw new Error('EME_LDL_RENEWAL_ERROR: renewal not supported');
  }

  // -----------------------------------------------------------------------
  // Event listeners
  // -----------------------------------------------------------------------

  /**
   * Add a `message` event handler to the session.
   * @param {Function} handler
   */
  addMessageHandler(handler) {
    if (!this.emeSession) {
      throw new ReferenceError('Unable to add message handler, key session is not valid');
    }
    this.emeSession.addEventListener(EVENT_MESSAGE, handler);
  }

  /**
   * Add a `keystatuseschange` event handler to the session.
   * @param {Function} handler
   */
  addKeyStatusHandler(handler) {
    if (!this.emeSession) {
      throw new ReferenceError('Unable to add key status handler, key session is not valid');
    }
    this.emeSession.addEventListener(EVENT_KEY_STATUS_CHANGE, handler);
  }

  /**
   * Remove a previously-added `message` event handler.
   * @param {Function} handler
   */
  removeMessageHandler(handler) {
    if (!this.emeSession) {
      throw new ReferenceError('Unable to remove message handler, key session is not valid');
    }
    this.emeSession.removeEventListener(EVENT_MESSAGE, handler);
  }

  /**
   * Remove a previously-added `keystatuseschange` event handler.
   * @param {Function} handler
   */
  removeKeyStatusHandler(handler) {
    if (!this.emeSession) {
      throw new ReferenceError('Unable to remove key status handler, key session is not valid');
    }
    this.emeSession.removeEventListener(EVENT_KEY_STATUS_CHANGE, handler);
  }

  /**
   * Return the set of key IDs that should be checked for status.
   * Standard adapter returns undefined (check all); subclasses override.
   *
   * @returns {string[]|undefined}
   */
  getTrackedKeyIds() {
    return undefined;
  }
}
