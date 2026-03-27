/**
 * @file LicenseBroker.js
 * @description Manages DRM license acquisition, caching, and application for playback.
 *              Orchestrates the EME (Encrypted Media Extensions) license flow:
 *              1. Attempts to use cached license sessions
 *              2. Falls back to requesting new licenses from the license server
 *              3. Sets MediaKeys on the video element
 *              4. Handles errors and retries for DRM operations
 * @module drm/LicenseBroker
 * @original Module_128
 */

import { __decorate } from 'tslib'; // Module 22970
import { ea as ErrorCodes } from '../core/ErrorCodes'; // Module 36129
import { fetchOperation } from '../core/MetadataReader'; // Module 31276
import { gpc as formatKeyId } from '../drm/DrmState'; // Module 28289
import { MILLISECONDS } from '../timing/TimeUnits'; // Module 5021
import { injectable } from 'inversify'; // Module 22674
import { sja as BaseBroker } from '../drm/DrmSessionManager'; // Module 20124
import { PlayerEvents } from '../player/PlayerEvents'; // Module 85001
import { XFb as getCodecProfile } from '../media/HevcProfileConfig'; // Module 82100
import { JVa as getStreamSecurityLevel } from '../drm/DrmScheme'; // Module 56039
import { getLicenseType as getLicenseType } from '../drm/EmeSession'; // Module 54973

/**
 * Manages the DRM license lifecycle for encrypted content playback.
 * Handles license acquisition from cache or server, MediaKeys setup,
 * and error recovery.
 *
 * @extends BaseBroker
 * @injectable
 */
export class LicenseBroker extends BaseBroker {
  /**
   * @param {Object} config - DRM configuration
   * @param {Object} session - License session manager
   * @param {Object} playerState - Current player state reference
   * @param {Object} mediaSourceElement - Media source element reference
   * @param {Function} licenseProviderFactory - Factory to create license providers
   * @param {Object} mediaKeysManager - Manages MediaKeys instances
   */
  constructor(config, session, playerState, mediaSourceElement, licenseProviderFactory, mediaKeysManager) {
    super(playerState, mediaSourceElement);

    /** @type {Object} DRM configuration */
    this.config = config;

    /** @type {Object} License session manager */
    this.session = session;

    /** @type {Function} Factory that creates license providers */
    this._licenseProviderFactory = licenseProviderFactory;

    /** @type {Object} Manages MediaKeys instances and state */
    this._mediaKeysManager = mediaKeysManager;

    /** @type {Object} Logger for this broker */
    this.log = fetchOperation(this.playerState, 'LicenseBroker');

    /** @type {Set<string>} Set of viewable IDs that have been processed */
    this._processedViewableIds = new Set();

    /** @type {boolean} Whether MediaKeys have been set on the video element */
    this._mediaKeysSet = false;
  }

  /**
   * Initiates the license acquisition flow for a given viewable.
   * Attempts cached license first, falls back to fresh license request.
   * @param {Object} viewable - The viewable/content to acquire a license for
   */
  startLicenseAcquisition() {
    const viewable = this.playerState.aseGcSettings;

    if (this._processedViewableIds.has(viewable.R)) return;

    this._processedViewableIds.add(viewable.R);
    viewable.recordPlayDelay('drm_start');

    this._tryUseCachedLicense(viewable)
      .catch(() => this._requestNewLicense(viewable))
      .then(() => this._onLicenseApplied(viewable))
      .catch((error) => this._onLicenseFailed(viewable, error))
      .catch((error) => this.fireError(error.code, error, error.errorExternalCode));
  }

  /**
   * Attempts to use a cached license session for the given viewable.
   * @param {Object} viewable
   * @returns {Promise}
   * @private
   */
  _tryUseCachedLicense(viewable) {
    return Promise.all([
      this.session.getKeyStatus(viewable.R),
      this._licenseProviderFactory(),
    ]).then(([cachedResult, licenseProvider]) => {
      return cachedResult.internal_Tza.then((mediaKeysResult) => {
        const currentKeys = this._mediaKeysManager.mediaKeys;
        if (currentKeys && currentKeys !== mediaKeysResult.mediaKeys) {
          this.log.RETRY('Cannot use cached license session as its uses different MediaKeys');
          return Promise.reject();
        }

        if (cachedResult.QZa.source === 'manifest') {
          const licenseRequest = this._buildLicenseRequest(viewable);
          licenseProvider.uKb(licenseRequest, mediaKeysResult);
        }

        return mediaKeysResult;
      }).then((mediaKeysResult) => {
        return this._applyCachedLicense(mediaKeysResult, viewable, cachedResult.QZa);
      });
    }).catch((error) => {
      this.log.RETRY('eme not in cache', error);
      throw error;
    });
  }

  /**
   * Applies a cached license to the viewable.
   * @param {Object} mediaKeysResult
   * @param {Object} viewable
   * @param {Object} licenseSource
   * @returns {Promise}
   * @private
   */
  _applyCachedLicense(mediaKeysResult, viewable, licenseSource) {
    this._bindErrorHandler(mediaKeysResult, viewable);
    viewable.qZ = licenseSource;
    this._mediaKeysManager.setMediaKeys(mediaKeysResult.mediaKeys);
    return mediaKeysResult.$Oa();
  }

  /**
   * Converts play delay timestamps to a map of key ID -> milliseconds.
   * @param {Array} timestamps
   * @returns {Object}
   * @private
   */
  _formatPlayDelayTimestamps(timestamps) {
    const result = {};
    timestamps.forEach((entry) => {
      result[formatKeyId(entry.yea)] = entry.platform.toUnit(MILLISECONDS);
    });
    return result;
  }

  /**
   * Binds the error handler to a media keys result for the given viewable.
   * @param {Object} mediaKeysResult
   * @param {Object} viewable
   * @private
   */
  _bindErrorHandler(mediaKeysResult, viewable) {
    viewable.hm = mediaKeysResult;
    mediaKeysResult.qXc((error) => {
      this.fireError(error.code, error, error.errorExternalCode);
    });
  }

  /**
   * Called when a license is successfully applied.
   * Records delay metrics and either finalizes or sets MediaKeys.
   * @param {Object} viewable
   * @private
   */
  _onLicenseApplied(viewable) {
    this.log.info(
      `Successfully applied license for xid: ${viewable.sourceTransactionId}, ` +
      `viewable: ${viewable.R}, segment: ${viewable.M}`
    );
    this._recordPlayDelay(viewable);

    if (this._mediaKeysSet) {
      this._finalizeForViewable(viewable.R);
    } else {
      this.setMediaKeys(viewable);
    }
  }

  /**
   * Called when license acquisition fails. Records delay and re-throws.
   * @param {Object} viewable
   * @param {Error} error
   * @private
   */
  _onLicenseFailed(viewable, error) {
    this._recordPlayDelay(viewable);
    throw error;
  }

  /**
   * Records play delay metrics from the license session.
   * @param {Object} viewable
   * @private
   */
  _recordPlayDelay(viewable) {
    if (viewable.hm) {
      viewable.lM(this._formatPlayDelayTimestamps(viewable.hm.playDelayTimestamps));
    }
  }

  /**
   * Builds a license request object from viewable metadata.
   * @param {Object} viewable
   * @returns {Object} License request parameters
   * @private
   */
  _buildLicenseRequest(viewable) {
    const encryptedMeta = viewable.encryptedContentMetadata[0];
    const profileName = encryptedMeta.streams[0].profileName;
    const codecProfile = getCodecProfile(profileName);
    const securityLevel = getStreamSecurityLevel(encryptedMeta.streams);

    return {
      type: getLicenseType(this.config, false),
      initData: viewable.JU.map((data) => fetchOperation(data)),
      internal_Zta: codecProfile,
      wB: securityLevel,
      sessionInfo: {
        R: viewable.R,
        sourceTransactionId: viewable.sourceTransactionId,
        playbackContextId: viewable.playbackContextId,
        sessionInfoId: viewable.sessionInfoId,
        links: viewable.manifestRef.links,
        manifestType: viewable.manifestRef.manifestContent.manifestType,
        trackIdentifier: viewable.tracks.videoTrack?.trackId ||
          viewable.parsedManifest.defaultTrack.trackId,
      },
    };
  }

  /**
   * Requests a new license from the license server.
   * @param {Object} viewable
   * @returns {Promise}
   * @private
   */
  _requestNewLicense(viewable) {
    return this._licenseProviderFactory().then((licenseProvider) => {
      const licenseRequest = this._buildLicenseRequest(viewable);
      this._processedViewableIds.add(viewable.R);

      return licenseProvider.license(licenseRequest, this._mediaKeysManager).then((result) => {
        this._bindErrorHandler(result, viewable);
        this.playerState.fireEvent(PlayerEvents.RZa, { R: viewable.R });
        return result.$Oa();
      });
    });
  }

  /**
   * Sets MediaKeys on the HTML video element.
   * @param {Object} viewable
   */
  setMediaKeys(viewable) {
    if (this._mediaKeysSet) {
      this.log.pauseTrace('Media Keys already set');
      return;
    }

    try {
      if (this.mediaSourceElement.htmlVideoElement) {
        this._mediaKeysSet = true;
        this.mediaSourceElement.htmlVideoElement
          .setMediaKeys(viewable.hm.mediaKeys)
          .then(() => {
            this._finalizeForViewable(viewable.R);
          })
          .catch((error) => {
            error = this.bAc(error);
            this.fireError(ErrorCodes.PLAY_MSE_SETMEDIAKEYS, error, error.errorSubcode);
          });
      } else {
        this._finalizeForViewable(viewable.R);
      }
    } catch (error) {
      this.fireError(ErrorCodes.PLAY_MSE_SETMEDIAKEYS, error, undefined);
    }
  }

  /**
   * Acquires and applies a license directly (bypasses cache).
   * @param {Object} [viewable] - Optional viewable, defaults to current player state
   * @returns {Promise}
   */
  acquireLicenseDirect(viewable) {
    viewable = viewable ?? this.playerState;
    return this._requestNewLicense(viewable)
      .then(() => this._onLicenseApplied(viewable))
      .catch((error) => this._onLicenseFailed(viewable, error));
  }

  /**
   * Cleanup on close - releases media keys.
   */
  closing() {
    this._mediaKeysManager.QTc();
  }

  /**
   * Returns the yB property from config.
   * @returns {*}
   */
  get yB() {
    return this.config.yB;
  }
}
