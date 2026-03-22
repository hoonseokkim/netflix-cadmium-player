/**
 * Netflix Cadmium Player -- DrmLicenseHandler
 *
 * High-level coordinator for DRM license acquisition.  Sits between
 * the playback pipeline and the EME session layer, handling:
 *
 *   1. Creating an EME session via {@link EmeSessionFactory}
 *   2. Generating license challenges (with or without a pre-existing
 *      manifest challenge)
 *   3. Sending license requests to the Netflix license server
 *   4. Routing license responses back to the EME session
 *   5. Configuring session info (transaction ID, movie ID, etc.)
 *
 * There are two license acquisition paths:
 *
 *   - **Licensed Manifest** (`getChallenge`): The license challenge
 *     is generated first and embedded in the manifest request.  The
 *     server returns both the manifest and the license in one round-trip.
 *
 *   - **Separate License** (`license`): The manifest is fetched first,
 *     then a separate license request is made with the challenge.
 *
 * Original: Webpack Module referenced at line ~16400 of the deobfuscated
 * bundle (function `d` with exports `uEa`).
 *
 * @module drm/DrmLicenseHandler
 */

// import { EmeSessionFactory } from './EmeSessionFactory.js';
// import { DrmState } from './DrmState.js';

/**
 * Coordinates DRM license acquisition for a playback session.
 */
export class DrmLicenseHandler {
  /**
   * @param {object} logger - Debug logger.
   * @param {object} licenseApi - Network API for license requests.
   * @param {object} platformConfig - Platform config / feature flags.
   * @param {object} emeSessionFactory - Factory for creating EmeSession instances.
   * @param {object} milestoneStore - Playback milestone store for telemetry.
   * @param {object} performanceMarker - Performance marker utility.
   */
  constructor(logger, licenseApi, platformConfig, emeSessionFactory, milestoneStore, performanceMarker) {
    /** @private */ this._licenseApi = licenseApi;
    /** @private */ this._emeSessionFactory = emeSessionFactory;
    /** @private */ this._milestoneStore = milestoneStore;
    /** @private */ this._performanceMarker = performanceMarker;

    this.log = logger.createSubLogger('DrmLicenseHandler');
  }

  // -----------------------------------------------------------------------
  // Licensed manifest path
  // -----------------------------------------------------------------------

  /**
   * Generate a license challenge for embedding in a manifest request.
   *
   * Creates an EME session, generates a request, and returns both the
   * session and the challenge data for inclusion in the manifest call.
   *
   * @param {object} sessionParams - DRM session parameters (init data, type, etc.).
   * @param {object} mediaElement - The HTMLMediaElement for setMediaKeys.
   * @returns {Promise<[EmeSession, { drmScheme: number, data: * }]>}
   */
  async getChallenge(sessionParams, mediaElement) {
    const session = await this._createAndInitSession(mediaElement, sessionParams.type, sessionParams.keyHeightMap);
    const challenge = await session.generateRequestWithChallenge(sessionParams.initData, sessionParams.initDataTransform);

    return [session, {
      drmScheme: session.getKeySession(),
      data: challenge.data,
    }];
  }

  // -----------------------------------------------------------------------
  // Separate license path
  // -----------------------------------------------------------------------

  /**
   * Generate a license challenge and immediately send a license request.
   *
   * Unlike `getChallenge`, this path does not return the challenge data;
   * instead the session's internal message handler sends the license
   * request automatically when the CDM emits a message event.
   *
   * @param {object} sessionParams - DRM session parameters.
   * @param {object} mediaElement - The HTMLMediaElement.
   * @returns {Promise<EmeSession>} The initialised session.
   */
  async license(sessionParams, mediaElement) {
    this.log.info('Requesting challenges', this._formatLogParams(sessionParams));

    const session = await this._createAndInitSession(mediaElement, sessionParams.type, sessionParams.keyHeightMap);

    this._configureSession(sessionParams, session);

    await session.generateRequestFireAndForget(sessionParams.initData, sessionParams.initDataTransform);

    return session;
  }

  // -----------------------------------------------------------------------
  // License request sending
  // -----------------------------------------------------------------------

  /**
   * Send a license request to the Netflix license server.
   *
   * @param {object} sessionParams - Session parameters (transaction ID, etc.).
   * @param {EmeSession} emeSession - The active EME session.
   * @param {object} challengeData - The challenge data from the CDM.
   * @returns {Promise<*>} License server response.
   */
  async sendLicenseRequest(sessionParams, emeSession, challengeData) {
    this.log.info('Sending license request', this._formatLogParams(sessionParams, challengeData.type));

    return this._licenseApi.license({
      transactionId: sessionParams.sessionInfo.sourceTransactionId,
      playbackContextId: sessionParams.sessionInfo.playbackContextId,
      sessionInfoIds: [sessionParams.sessionInfo.sessionInfoId],
      data: [{
        sessionId: emeSession.getSessionId() || 'session',
        data: challengeData.data,
      }],
      type: challengeData.type,
      drmScheme: emeSession.getKeySession(),
      messageType: challengeData.messageType,
      links: sessionParams.sessionInfo.links,
      manifestType: sessionParams.sessionInfo.manifestType,
      movieId: sessionParams.sessionInfo.movieId,
      trackIdentifier: sessionParams.sessionInfo.trackIdentifier,
    });
  }

  // -----------------------------------------------------------------------
  // Private helpers
  // -----------------------------------------------------------------------

  /**
   * Create a new EME session and initialise it (createSession + generateRequest).
   *
   * @param {object} mediaElement
   * @param {number} type - DRM type (standard/limited).
   * @param {object} [keyHeightMap] - Map of key IDs to resolution heights.
   * @returns {Promise<EmeSession>}
   * @private
   */
  async _createAndInitSession(mediaElement, type, keyHeightMap) {
    const session = await this._emeSessionFactory.create();
    await session.createSession(mediaElement, type, keyHeightMap);
    return session;
  }

  /**
   * Configure session metadata (transaction ID, etc.) and wire up
   * the license-request callback.
   *
   * @param {object} sessionParams
   * @param {EmeSession} session
   * @private
   */
  _configureSession(sessionParams, session) {
    session.setSessionInfo(sessionParams.sessionInfo);
    this._wireMessageCallback(sessionParams, session);
  }

  /**
   * Wire the session's message callback to send license requests.
   *
   * @param {object} sessionParams
   * @param {EmeSession} session
   * @private
   */
  _wireMessageCallback(sessionParams, session) {
    session.setMessageCallback((challengeData) => {
      this.sendLicenseRequest(sessionParams, session, challengeData);
    });
  }

  /**
   * Format log parameters for license request telemetry.
   *
   * @param {object} params
   * @param {string} [type]
   * @returns {object}
   * @private
   */
  _formatLogParams(params, type) {
    return {
      movieId: params.sessionInfo?.movieId,
      videoTrackId: params.sessionInfo?.trackIdentifier,
      xid: params.sessionInfo?.sourceTransactionId,
      type,
    };
  }
}
