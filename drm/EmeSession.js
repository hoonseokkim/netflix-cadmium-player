/**
 * Netflix Cadmium Player — EmeSession
 *
 * Manages a single EME (Encrypted Media Extensions) session for DRM
 * content playback. Handles the full lifecycle of a DRM session:
 *
 *   1. Creating MediaKeys and the underlying key session
 *   2. Generating license challenges (initial and renewal)
 *   3. Processing license responses and updating the session
 *   4. Monitoring key status changes (usable, expired, restricted, etc.)
 *   5. Handling license renewal via timeout or CDM-initiated requests
 *   6. Closing the session and cleaning up resources
 *
 * The class bridges the W3C EME API with Netflix's license management
 * infrastructure, translating CDM events into internal DRM state
 * transitions and error handling.
 *
 * @module drm/EmeSession
 */

// import { MILLISECONDS } from '../timing/TimeUnit';           // Module 5021
// import { ErrorCode, EventTypeEnum } from '../core/ErrorCodes'; // Module 36129
// import { trustedConfig } from '../drm/DrmConfig';             // Module 24735
// import { DrmState } from '../drm/DrmState';                   // Module 28289
// import { KeyStatus } from '../drm/KeyStatus';                 // Module 28048
// import { LicenseUpdateType } from '../drm/LicenseUpdateType'; // Module 27995
// import { DrmError } from '../drm/DrmError';                   // Module 61731
// import { PromiseTimerSymbol } from '../utils/PromiseTimer';   // Module 59818
// import { PlaybackError } from '../core/PlaybackError';        // Module 31149
// import { ObservableValue } from '../utils/ObservableValue';   // Module 81734
// import { Deferred } from '../utils/Deferred';                 // Module 94293
// import { parseHexErrorCode } from '../utils/ErrorUtils';      // Module 82100

/**
 * Enum representing the current license negotiation state.
 * @readonly
 * @enum {number}
 */
export const LicenseState = Object.freeze({
  UNKNOWN: 0,
  CREATE: 1,
  LICENSE: 2,
  RENEWAL: 3,
  CLOSED: 4,
});

/** @type {string} EME message type for initial license requests */
export const LICENSE_REQUEST_TYPE = 'license-request';

/** @type {string} EME message type for license renewals */
export const LICENSE_RENEWAL_TYPE = 'license-renewal';

/**
 * Maps W3C MediaKeyStatus strings to internal key status and optional error codes.
 * @type {Record<string, {status: number, error?: number}>}
 */
const KEY_STATUS_MAP = {
  usable: {
    status: 'KEY_USABLE', // t.XJ.XWb
  },
  expired: {
    status: 'KEY_EXPIRED', // t.XJ.expired
    error: 'PLAY_MSE_EME_KEY_STATUS_CHANGE_EXPIRED', // c.ea.*
  },
  released: {
    status: 'KEY_RELEASED', // t.XJ.released
  },
  'output-not-allowed': {
    status: 'KEY_OUTPUT_RESTRICTED', // t.XJ.xMb
    error: 'PLAY_MSE_EME_KEY_STATUS_CHANGE_OUTPUT_NOT_ALLOWED',
  },
  'output-restricted': {
    status: 'KEY_OUTPUT_RESTRICTED', // t.XJ.xMb
    error: 'PLAY_MSE_EME_KEY_STATUS_CHANGE_OUTPUT_RESTRICTED',
  },
  'output-downscaled': {
    status: 'KEY_OUTPUT_DOWNSCALED', // t.XJ.MNc
  },
  'status-pending': {
    status: 'KEY_STATUS_PENDING', // t.XJ.i_c
  },
  'internal-error': {
    status: 'KEY_INTERNAL_ERROR', // t.XJ.bDc
    error: 'PLAY_MSE_EME_KEY_STATUS_CHANGE_INTERNAL_ERROR',
  },
};

/**
 * Maps EME session close reason strings to internal event type codes.
 * @type {Record<string, number>}
 */
const SESSION_CLOSE_REASON_MAP = {
  'internal-error': 'EME_INTERNAL_ERROR', // c.EventTypeEnum.*
  'closed-by-application': 'EME_CLOSED_BY_APPLICATION',
  'release-acknowledged': 'EME_RELEASE_ACKNOWLEDGED',
  'hardware-context-reset': 'EME_HARDWARE_CONTEXT_RESET',
  'resource-evicted': 'EME_RESOURCE_EVICTED',
};

/**
 * Manages a single EME DRM session including license acquisition,
 * renewal, key status monitoring, and error handling.
 */
export class EmeSession {
  /**
   * @param {object} loggerFactory     - Factory for creating sub-loggers.
   * @param {object} videoSyncClock    - Clock providing current playback time.
   * @param {object} base64Codec       - Encoder/decoder for base64 key ID encoding.
   * @param {object} config            - DRM configuration (timeouts, feature flags).
   * @param {object} licenseManager    - Manages license server communication and timeouts.
   * @param {object} encryptionSession - Underlying CDM encryption session wrapper.
   */
  constructor(loggerFactory, videoSyncClock, base64Codec, config, licenseManager, encryptionSession) {
    /** @private @type {object} */
    this._videoSyncClock = videoSyncClock;

    /** @private @type {object} */
    this._base64Codec = base64Codec;

    /** @private @type {object} */
    this._config = config;

    /** @private @type {object} */
    this._licenseManager = licenseManager;

    /** @private @type {object} */
    this._encryptionSession = encryptionSession;

    /** @type {ObservableValue} Observable key status map */
    this.keyStatuses = new ObservableValue({});

    /** @private @type {boolean} Whether a renewal timer has been started */
    this._renewalTimerStarted = false;

    /** @private @type {object} */
    this._log = loggerFactory.createSubLogger('EmeSession');

    /** @private @type {number} */
    this._licenseState = LicenseState.UNKNOWN;

    /** @private @type {object} The underlying EME MediaKeySession wrapper */
    this._emeSession = encryptionSession.getMediaKeySession();

    /** @private @type {object} Parser for EME messages and errors */
    this._messageParser = encryptionSession.getMessageParser();

    /** @private @type {Array<{time: number, yea: number}>} DRM state transition timestamps */
    this._playDelayTimestamps = [];

    /**
     * Error callback. Initially buffers the first error; replaced via
     * `setErrorCallback()` which also flushes the buffered error.
     * @private
     * @type {Function|undefined}
     */
    this._onError = (error) => {
      this._bufferedError = error;
    };

    // ── Bind event handlers (bound to `this` for later removal) ──

    /**
     * Handles `message` events from the CDM (license challenges and renewals).
     * @private
     */
    this._onKeyMessage = (event) => {
      try {
        const parsed = this._messageParser.nRa(event);
        const messageData = parsed.ET;
        const messageType = parsed.messageType;
        const sessionId = parsed.drmSessionId;

        this._keyIds = this._keyIds || parsed.keyIds;
        this._updateSessionId(sessionId);

        this._log.pauseTrace(`Received ${event.type} event`, {
          sessionId,
          messageType,
          keyIds: this._keyIds,
        });

        // Handle renewal requests from the CDM
        if (messageType === LICENSE_RENEWAL_TYPE) {
          if (this._config.DSa) {
            this._log.pauseTrace('Disabling license renewal');
            return;
          }
          this._log.pauseTrace('Received a renewal request');
          this._challengeType = trustedConfig.$r;
          this._licenseState = LicenseState.RENEWAL;
        }

        // Notify DRM state transitions
        if (this._licenseState === LicenseState.LICENSE) {
          this._notifyLicenseStateChange(DrmState.receivedLicenseChallenge);
        }
        if (this._licenseState === LicenseState.RENEWAL) {
          this._notifyLicenseStateChange(DrmState.receivedRenewalChallengeComplete);
        }

        const challengeResult = {
          rL: messageData,
          internal_Ltb: messageType,
          type: this._challengeType,
        };

        this._onChallengeGenerated?.(challengeResult);

        if (this._isDataEmpty(messageData)) {
          this._rejectChallenge(new PlaybackError(ErrorCode.EME_KEYMESSAGE_EMPTY));
        } else if (this._pendingChallenge && !this._pendingChallenge.NXb) {
          this._resolveChallenge(challengeResult);
        }
      } catch (error) {
        this._rejectChallenge(error);
      }
    };

    /**
     * Swaps adjacent byte pairs in a Uint8Array (little-endian to big-endian
     * conversion for 16-bit values, used for key ID encoding normalization).
     * @private
     * @param {Uint8Array} data
     * @returns {Uint8Array}
     */
    this._swapByteOrder = (data) => {
      const swapped = new Uint8Array(data);
      for (let i = 0; i < data.length; i += 2) {
        swapped[i] = data[i + 1];
        swapped[i + 1] = data[i];
      }
      return swapped;
    };

    /**
     * Encodes a key ID with swapped byte order (for PlayReady compatibility).
     * @private
     * @param {string} encodedKeyId - Base64-encoded key ID.
     * @returns {string} Base64-encoded key ID with swapped byte order.
     */
    this._encodeSwappedKeyId = (encodedKeyId) => {
      let decoded = this._base64Codec.decode(encodedKeyId);
      decoded = this._swapByteOrder(decoded);
      return this._base64Codec.encode(decoded);
    };

    /**
     * Handles `keystatuseschange` events from the CDM. Iterates over all
     * key statuses, logs them, checks for errors, and resolves or rejects
     * pending license operations accordingly.
     * @private
     */
    this._onKeyStatusChange = (event) => {
      const session = event.target;
      const keyStatuses = session.keyStatuses;

      this._updateSessionId(session.drmSessionId);
      this._log.pauseTrace(`Received event: ${event.type}`);

      let keyError;

      try {
        // Build a sorted list of key statuses by resolution height
        const statusEntries = [];
        for (const [keyBuffer, statusString] of keyStatuses) {
          const encodedKeyId = this._base64Codec.encode(new Uint8Array(keyBuffer));
          const height = this._keyHeightMap?.[encodedKeyId];
          statusEntries.push({ encodedKeyId, status: statusString, height });
        }
        statusEntries.sort((a, b) => (a.height || 0) - (b.height || 0));

        const keyIds = statusEntries.map((e) => e.encodedKeyId);
        const heights = statusEntries.map((e) => e.height);
        const statuses = statusEntries.map((e) => e.status);

        this._keyStatusSummary = `${keyIds}, ${heights}, ${statuses}`;
        this._log.pauseTrace(`KeyStatus: ${this._keyStatusSummary}`);

        // Map statuses to internal representation and detect errors
        const internalStatuses = {};
        for (const [keyBuffer, statusString] of keyStatuses) {
          const encodedKeyId = this._base64Codec.encode(new Uint8Array(keyBuffer));
          const mappedStatus = KEY_STATUS_MAP[statusString];
          internalStatuses[encodedKeyId] = mappedStatus.status;
          if (this._shouldReportKeyError(encodedKeyId, mappedStatus.error)) {
            keyError = new DrmError(mappedStatus.error);
          }
        }
        this.keyStatuses.set(internalStatuses);
      } catch (exception) {
        keyError = new DrmError(ErrorCode.PLAY_MSE_EME_KEY_STATUS_EXCEPTION);
        keyError.zaa(exception);
      }

      if (keyError) {
        if (this._pendingLicense) {
          this._handleLicenseError(keyError);
        } else {
          this._handleCdmError(keyError);
        }
      } else {
        // Success path
        if (!this._messageParser.xpa()) {
          this._resolveLicense();
        }

        // Check if renewal is needed for LIMITED license type
        if (
          this._challengeType === trustedConfig.LIMITED &&
          !this._messageParser.tPa()
        ) {
          if (this._config.DSa) {
            this._log.pauseTrace('Disabling license renewal');
          } else {
            this._scheduleRenewal();
          }
        }
      }
    };

    /**
     * Handles unexpected session closure from the CDM.
     * @private
     */
    this._onSessionClosed = (reason) => {
      this._log.error(`MediaKeySession closed unexpectedly: ${reason}`);
      this._handleCdmError(
        new PlaybackError(ErrorCode.EME_SESSION_CLOSED_UNEXPECTEDLY, SESSION_CLOSE_REASON_MAP[reason])
      );
    };
  }

  /* ------------------------------------------------------------------
   * Public getters
   * ----------------------------------------------------------------*/

  /**
   * Returns the observable key reference from the encryption session.
   * @returns {object}
   */
  getObservableKey() {
    return this._encryptionSession.observeKey;
  }

  /**
   * Returns a human-readable summary of the last key status change.
   * @returns {string|undefined}
   */
  getKeyStatusSummary() {
    return this._keyStatusSummary;
  }

  /**
   * Returns the current DRM session ID.
   * @returns {string|undefined}
   */
  getSessionId() {
    return this._sessionId;
  }

  /**
   * Returns the underlying MediaKeySession.
   * @returns {object}
   */
  getKeySession() {
    return this._encryptionSession.getKeySession();
  }

  /**
   * Returns whether license data has been received.
   * @returns {boolean}
   */
  checkDrmReady() {
    return this._licenseData !== undefined;
  }

  /**
   * Returns the extracted output restrictions from the license.
   * @returns {object|undefined}
   */
  getExtractedOutput() {
    return this._extractedOutput;
  }

  /* ------------------------------------------------------------------
   * Session lifecycle
   * ----------------------------------------------------------------*/

  /**
   * Creates a new EME session: creates MediaKeys, sets the server
   * certificate, creates the key session, and attaches event listeners.
   *
   * @param {object} mediaKeyProvider - Provider for MediaKeys instance.
   * @param {string} challengeType   - The license type (e.g. standard, limited).
   * @param {object} [keyHeightMap]  - Optional map of key IDs to resolution heights.
   * @returns {Promise<void>}
   */
  async createSession(mediaKeyProvider, challengeType, keyHeightMap) {
    this._keyHeightMap = this._keyHeightMap ?? keyHeightMap;
    this._challengeType = challengeType;
    this._licenseState = LicenseState.CREATE;
    this._notifyLicenseStateChange(DrmState.licenseStarted);

    try {
      if (!mediaKeyProvider.oEb()) {
        const mediaKeys = await this._licenseManager.removeCallback(
          this._config.internal_Erb,
          this._emeSession.createMediaKeys(this._encryptionSession)
        );

        this._log.pauseTrace('Created media keys');

        await this._setServerCertificate(mediaKeys)
          .then(() => mediaKeyProvider.setMediaKeys(mediaKeys))
          .catch((error) => {
            throw this._wrapDrmError(error, ErrorCode.EME_SET_SERVER_CERTIFICATE);
          });
      }

      this._mediaKeys = mediaKeyProvider.mediaKeys;

      try {
        this._emeSession.createSession(this._mediaKeys, this._onSessionClosed);
        this._emeSession.onKeyMessage(this._onKeyMessage);
        this._emeSession.onKeyStatusChange(this._onKeyStatusChange);
        this._updateSessionId(this._emeSession.getSessionId());
      } catch (error) {
        throw this._wrapDrmError(error, ErrorCode.EME_CREATE_SESSION_FAILED);
      }
    } catch (error) {
      throw this._wrapDrmError(error, ErrorCode.EME_CREATE_MEDIAKEYS_FAILED);
    }
  }

  /**
   * Associates session metadata (e.g. transaction ID) with this session.
   * @param {object} sessionInfo - Session metadata including sourceTransactionId.
   */
  setSessionInfo(sessionInfo) {
    this._sessionInfo = sessionInfo;
    this._log.setLogProperty('xid', sessionInfo.sourceTransactionId);
  }

  /**
   * Generates a license challenge and returns the challenge data.
   *
   * @param {Uint8Array} initData  - Initialization data (e.g. PSSH box).
   * @param {string}     initDataType - Init data type (e.g. 'cenc', 'webm').
   * @returns {Promise<object>} The challenge result.
   */
  generateChallenge(initData, initDataType) {
    return this._generateRequest(initData, initDataType, false).then((result) => result);
  }

  /**
   * Generates a license challenge without returning the data (fire-and-forget).
   *
   * @param {Uint8Array} initData  - Initialization data.
   * @param {string}     initDataType - Init data type.
   * @returns {Promise<void>}
   */
  generateChallengeFireAndForget(initData, initDataType) {
    return this._generateRequest(initData, initDataType, true).then(() => {});
  }

  /**
   * Processes a license response from the license server.
   *
   * @param {object} licenseResponse - Contains `o1` and `DB` (license data buffers).
   * @param {object} [keyHeightMap]  - Optional map of key IDs to resolution heights.
   */
  processLicenseResponse(licenseResponse, keyHeightMap) {
    this._keyHeightMap = this._keyHeightMap ?? keyHeightMap;
    this._o1 = licenseResponse.o1;

    const licenseBuffers = licenseResponse.DB.map((item) => item.data);

    if (this._isDataEmpty(licenseBuffers)) {
      this._log.error('The license buffer is empty');
      this._rejectChallenge(
        new DrmError(ErrorCode.EME_INVALID_LICENSE_DATA, EventTypeEnum.EME_EMPTY_DATA)
      );
      return;
    }

    if (this._licenseState === LicenseState.LICENSE) {
      this._notifyLicenseStateChange(DrmState.receivedLicense);
      this._licenseData = licenseBuffers;
      this._extractedOutput = this._messageParser.extractOutput(this._keyIds, licenseBuffers);
      if (this._pendingChallenge?.NXb) {
        this._resolveChallenge();
      }
    }

    if (this._licenseState === LicenseState.RENEWAL) {
      this._notifyLicenseStateChange(DrmState.receivedRenewalLicenseComplete);
      this._licenseData = licenseBuffers;
      this._extractedOutput = this._messageParser.extractOutput(this._keyIds, licenseBuffers);
      this._updateSessionWithLicense();
    }
  }

  /**
   * Handles a license acquisition failure.
   * @param {Error} error - The error from the license server.
   */
  handleLicenseFailure(error) {
    if (this._licenseState === LicenseState.RENEWAL) {
      this._notifyLicenseStateChange(DrmState.receivedRenewalLicenseFailed);
      this._handleCdmError(error);
    } else {
      this._rejectChallenge(error);
    }
  }

  /**
   * Registers a callback invoked when a challenge is generated.
   * @param {Function} callback
   */
  setChallengeCallback(callback) {
    this._onChallengeGenerated = callback;
  }

  /**
   * Registers a callback invoked on unrecoverable CDM errors.
   * Flushes any buffered error immediately.
   * @param {Function} callback
   */
  setErrorCallback(callback) {
    this._onError = callback;
    if (this._bufferedError) {
      callback(this._bufferedError);
      this._bufferedError = undefined;
    }
  }

  /**
   * Closes the EME session, removes event listeners, and releases resources.
   * @returns {Promise<void>}
   */
  async close() {
    this._onChallengeGenerated = undefined;
    this._licenseState = LicenseState.CLOSED;
    this._playDelayTimestamps = [];

    if (this._renewalTimeoutHandle !== undefined) {
      clearTimeout(this._renewalTimeoutHandle);
      this._renewalTimeoutHandle = undefined;
    }

    if (!this._emeSession.FEc()) {
      return;
    }

    this._log.pauseTrace('Closing the session');
    this._emeSession.SPb(this._onKeyMessage);
    this._emeSession.QPb(this._onKeyStatusChange);
    this._mediaKeys = undefined;

    try {
      await this._licenseManager.removeCallback(
        this._config.internal_Drb,
        this._emeSession.closing()
      );
      this._log.info('Closed the session');
    } catch (error) {
      this._log.error('Close failed', error);
      this._messageParser.xL(error).code = ErrorCode.PLAY_MSE_EME_SESSION_CLOSE;
      throw error;
    }
  }

  /* ------------------------------------------------------------------
   * Key height map property (with byte-swapped key alias)
   * ----------------------------------------------------------------*/

  /**
   * Returns the key-to-height map (includes byte-swapped aliases).
   * @returns {object|undefined}
   */
  get _keyHeightMap() {
    return this._keyHeightMapInternal;
  }

  /**
   * Sets the key-to-height map. For each entry, also creates a
   * byte-swapped alias (PlayReady uses different endianness for key IDs).
   * @param {object|undefined} map
   */
  set _keyHeightMap(map) {
    if (!map) return;
    const expanded = {};
    for (const [keyId, height] of Object.entries(map)) {
      expanded[keyId] = height;
      expanded[this._encodeSwappedKeyId(keyId)] = height;
    }
    this._keyHeightMapInternal = expanded;
  }

  /* ------------------------------------------------------------------
   * Private — license challenge generation
   * ----------------------------------------------------------------*/

  /**
   * Generates an EME license request (generateRequest).
   *
   * @private
   * @param {Uint8Array} initData        - PSSH / init data.
   * @param {string}     initDataType    - Init data MIME type.
   * @param {boolean}    waitForLicense  - If true, the promise resolves only
   *                                       after the license is also received.
   * @returns {Promise<object>}
   */
  _generateRequest(initData, initDataType, waitForLicense) {
    this._licenseState = LicenseState.LICENSE;
    this._log.pauseTrace('Generating a license challenge');

    if (!initData) {
      const error = new DrmError(ErrorCode.EME_INVALID_INITDATA_DATA, EventTypeEnum.EME_UNDEFINED_DATA);
      this._rejectChallenge(error);
      return Promise.reject(error);
    }

    if (this._isDataEmpty(initData)) {
      const error = new DrmError(ErrorCode.EME_INVALID_INITDATA_DATA, EventTypeEnum.EME_EMPTY_DATA);
      this._rejectChallenge(error);
      return Promise.reject(error);
    }

    this._pendingChallenge = {
      z4: new Deferred(),
      NXb: waitForLicense,
    };

    this._licenseManager
      .removeCallback(
        this._config.internal_Frb,
        this._emeSession.generateRequest(this._messageParser.DVa(), initData, initDataType)
      )
      .then(() => {
        this._updateSessionId(this._emeSession.getSessionId());
      })
      .catch((error) => {
        const drmError = new DrmError(
          ErrorCode.EME_GENERATEREQUEST_FAILED,
          error instanceof PromiseTimerSymbol ? EventTypeEnum.EME_TIMEOUT : EventTypeEnum.EXCEPTION
        );

        try {
          const wrapped = this._messageParser.xL(error);
          drmError.errorExternalCode = wrapped.errorExternalCode;
          drmError.message = 'Unable to generate request.';
          drmError.zaa(error);
        } catch (_) {
          // Ignore wrapping failures
        }

        this._log.error('Unable to generate a license request', drmError);
        this._rejectChallenge(drmError);
      });

    return this._pendingChallenge.z4.promise;
  }

  /* ------------------------------------------------------------------
   * Private — license update
   * ----------------------------------------------------------------*/

  /**
   * Sends the stored license data to the CDM via session.update().
   *
   * @private
   * @returns {Promise<void>}
   */
  _updateSessionWithLicense() {
    if (!this._licenseData) {
      const error = new DrmError(ErrorCode.EME_INVALID_LICENSE_DATA, EventTypeEnum.EME_UNDEFINED_DATA);
      this._handleLicenseError(error);
      return Promise.reject(error);
    }

    this._pendingLicense = new Deferred();
    const licenseData = this._licenseData;
    this._licenseData = undefined;

    const updateType =
      this._licenseState === LicenseState.LICENSE
        ? LicenseUpdateType.Request
        : LicenseUpdateType.Renewal;

    this._licenseManager
      .removeCallback(
        this._config.internal_Irb,
        this._emeSession.update(licenseData, updateType, this._keyIds)
      )
      .then(() => {
        if (this._messageParser.xpa()) {
          this._resolveLicense();
        }
      })
      .catch((error) => {
        const wrapped = this._messageParser.xL(error);
        wrapped.code = ErrorCode.PLAY_MSE_SET_LICENSE_ERROR;
        wrapped.message = 'Unable to update the EME';
        this._log.error(wrapped.message, wrapped);
        this._handleLicenseError(wrapped);
      });

    return this._pendingLicense.promise;
  }

  /* ------------------------------------------------------------------
   * Private — server certificate
   * ----------------------------------------------------------------*/

  /**
   * Sets the server certificate on the MediaKeys instance.
   * @private
   * @param {MediaKeys} mediaKeys
   * @returns {Promise<void>}
   */
  _setServerCertificate(mediaKeys) {
    return this._licenseManager.removeCallback(
      this._config.internal_Hrb,
      this._emeSession.setServerCertificate(mediaKeys, this._messageParser.dsa())
    );
  }

  /* ------------------------------------------------------------------
   * Private — session ID management
   * ----------------------------------------------------------------*/

  /**
   * Updates the stored session ID, logging when it changes.
   * @private
   * @param {string} newSessionId
   */
  _updateSessionId(newSessionId) {
    if (!newSessionId || newSessionId === this._sessionId) return;
    if (this._sessionId) {
      this._log.RETRY(`sessionId changed from ${this._sessionId} to ${newSessionId}`);
    }
    this._sessionId = newSessionId;
    this._log.setLogProperty('sessionId', newSessionId);
  }

  /* ------------------------------------------------------------------
   * Private — license renewal
   * ----------------------------------------------------------------*/

  /**
   * Schedules a license renewal after the configured timeout.
   * @private
   */
  _scheduleRenewal() {
    if (this._renewalTimerStarted) return;

    this._renewalTimerStarted = true;
    this._log.info('Kicking off license renewal', {
      timeout: this._config.B1,
    });

    this._renewalTimeoutHandle = setTimeout(() => {
      this._renewalTimeoutHandle = undefined;
      this._initiateRenewal();
    }, this._config.B1.toUnit(MILLISECONDS));
  }

  /**
   * Initiates a license renewal request.
   * @private
   */
  _initiateRenewal() {
    this._log.pauseTrace('Initiating a renewal request');
    this._challengeType = trustedConfig.$r;
    this._licenseState = LicenseState.RENEWAL;

    if (this._messageParser.dQa()) {
      this._messageParser.oYa(this._emeSession);
    } else {
      this._renewSession();
    }
  }

  /**
   * Creates a new EME session for license renewal (re-keying).
   * @private
   */
  _renewSession() {
    this._emeSession
      .initializeDRMFlow(
        this._mediaKeys,
        this._onKeyMessage,
        this._onKeyStatusChange,
        this._onSessionClosed
      )
      .then(() => {
        this._log.debug('Creating session to renew license');
        this._updateSessionId(this._emeSession.getSessionId());
      })
      .catch(() => {
        this._handleCdmError(new DrmError(ErrorCode.EME_GENERATEREQUEST_FAILED));
      });
  }

  /* ------------------------------------------------------------------
   * Private — promise resolution helpers
   * ----------------------------------------------------------------*/

  /**
   * Resolves the pending challenge promise and clears the pending state.
   * @private
   * @param {object} [result]
   */
  _resolveChallenge(result) {
    this._pendingChallenge?.z4.resolve(result);
    this._pendingChallenge = undefined;
  }

  /**
   * Closes the session then rejects the pending challenge promise.
   * @private
   * @param {Error} error
   */
  _rejectChallenge(error) {
    this.close().then(
      () => {
        this._log.pauseTrace('Issuing a generate challenge error');
        this._pendingChallenge?.z4.reject(error);
        this._pendingChallenge = undefined;
      },
      (closeError) => {
        this._log.error('EmeSession closed with an error.', this._messageParser.xL(closeError));
        this._pendingChallenge?.z4.reject(error);
        this._pendingChallenge = undefined;
      }
    );
  }

  /**
   * Resolves the pending license promise if one exists.
   * @private
   */
  _resolveLicense() {
    if (!this._pendingLicense) return;

    this._log.info('Successfully added license');

    if (this._licenseState === LicenseState.LICENSE) {
      this._notifyLicenseStateChange(DrmState.addLicenseComplete);
    } else if (this._licenseState === LicenseState.RENEWAL) {
      this._notifyLicenseStateChange(DrmState.addRenewalLicenseComplete);
    }

    this._pendingLicense.resolve();
    this._pendingLicense = undefined;
  }

  /**
   * Closes the session then rejects the pending license promise.
   * @private
   * @param {Error} error
   */
  _handleLicenseError(error) {
    this._log.error('Failed to add license', error);

    this.close().then(
      () => {
        this._log.pauseTrace('Issuing a license error');
        this._pendingChallenge?.z4.reject(error);
        this._pendingChallenge = undefined;
        this._pendingLicense?.reject(error);
        this._pendingLicense = undefined;
      },
      (closeError) => {
        this._log.error('EmeSession closed with an error.', this._messageParser.xL(closeError));
        if (this._licenseState === LicenseState.RENEWAL) {
          this._notifyLicenseStateChange(DrmState.addRenewalLicenseFailed);
        }
        this._pendingChallenge?.z4.reject(error);
        this._pendingChallenge = undefined;
        this._pendingLicense?.reject(error);
        this._pendingLicense = undefined;
      }
    );
  }

  /**
   * Closes the session then invokes the error callback.
   * @private
   * @param {Error} error
   */
  _handleCdmError(error) {
    this.close().then(
      () => {
        this._log.pauseTrace('Issuing a CDM error');
        this._pendingChallenge = undefined;
        this._pendingLicense = undefined;
        this._onError?.(error);
      },
      (closeError) => {
        this._log.error('EmeSession closed with an error.', this._messageParser.xL(closeError));
        this._pendingChallenge = undefined;
        this._pendingLicense = undefined;
        this._onError?.(error);
      }
    );
  }

  /* ------------------------------------------------------------------
   * Private — DRM state notification
   * ----------------------------------------------------------------*/

  /**
   * Records a DRM state transition with the current playback time.
   * @private
   * @param {number} drmState - The DRM state constant.
   */
  _notifyLicenseStateChange(drmState) {
    this._playDelayTimestamps.push({
      time: this._videoSyncClock.getCurrentTime(),
      yea: drmState,
    });
  }

  /* ------------------------------------------------------------------
   * Private — validation helpers
   * ----------------------------------------------------------------*/

  /**
   * Checks if the given data array is empty or contains an empty buffer.
   * @private
   * @param {Array<Uint8Array>} data
   * @returns {boolean}
   */
  _isDataEmpty(data) {
    return data.length === 0 || data.reduce((empty, item) => empty || item.length === 0, false);
  }

  /**
   * Determines whether a key status error should be reported.
   * For output-restricted errors, only reports if the key's resolution
   * exceeds 1080p and the config allows it.
   *
   * @private
   * @param {string} encodedKeyId - Base64-encoded key ID.
   * @param {number|undefined} errorCode
   * @returns {boolean}
   */
  _shouldReportKeyError(encodedKeyId, errorCode) {
    const activeKeyIds = this._emeSession.hCb();
    if (activeKeyIds && !activeKeyIds.includes(encodedKeyId)) {
      return false;
    }

    if (errorCode === ErrorCode.PLAY_MSE_EME_KEY_STATUS_CHANGE_OUTPUT_RESTRICTED) {
      const isAbove1080p = (this._keyHeightMap?.[encodedKeyId] ?? 0) > 1080;
      return isAbove1080p ? this._config.zMb : this._config.yMb;
    }

    return !!errorCode;
  }

  /**
   * Wraps an error into a DrmError with the appropriate error code,
   * unless it already has one.
   *
   * @private
   * @param {Error} error       - The original error.
   * @param {number} errorCode  - Fallback error code.
   * @returns {DrmError}
   */
  _wrapDrmError(error, errorCode) {
    if (error?.code && error?.errorSubCode) {
      return error;
    }

    const hexCode = parseHexErrorCode(error?.message);

    return new DrmError(
      errorCode,
      error instanceof PromiseTimerSymbol ? EventTypeEnum.EME_TIMEOUT : EventTypeEnum.EXCEPTION,
      hexCode?.toString(16)?.toUpperCase(),
      error?.message,
      error
    );
  }
}
