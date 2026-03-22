/**
 * Netflix Cadmium Player -- ManifestRequestBuilder
 *
 * Constructs the manifest request payload sent to the Netflix backend.
 * The manifest request includes:
 *
 *   - Viewable ID (movie/episode ID)
 *   - Supported audio/video profiles (codecs)
 *   - DRM type and version
 *   - License challenge (for "licensed manifest" flow)
 *   - UI version, platform info, client capabilities
 *   - Ad-break hydration tokens
 *   - Live streaming parameters
 *
 * This is the glue between the DRM pipeline and the manifest API --
 * if using the "licensed manifest" flow, the DRM challenge is embedded
 * directly in the manifest request to achieve single-round-trip
 * playback start.
 *
 * Original: Webpack Module 3035
 *
 * @module drm/ManifestRequestBuilder
 */

// import { DrmScheme } from './DrmScheme.js';
// import { KeySystemHelper } from './KeySystemIds.js';
// import { MediaKeySystemAccessServices } from './MediaKeySystemAccessServices.js';

/**
 * Builds manifest request payloads.
 */
export class ManifestRequestBuilder {
  /**
   * @param {object} version - UI/player version info.
   * @param {object} platform - Platform identification.
   * @param {Function} config - Configuration accessor.
   * @param {object} videoConfigBuilder - Video output config builder.
   * @param {object} milestoneStore - Playback milestone tracker.
   * @param {object} mediaKeyServices - MediaKeySystemAccess services.
   * @param {object} challengeBuilder - DRM challenge builder.
   * @param {object} playerCore - Player core instance.
   * @param {object} profileBuilder - Audio/video profile builder.
   */
  constructor(version, platform, config, videoConfigBuilder, milestoneStore, mediaKeyServices, challengeBuilder, playerCore, profileBuilder) {
    /** @private */ this._version = version;
    /** @private */ this._platform = platform;
    /** @private */ this._config = config;
    /** @private */ this._videoConfigBuilder = videoConfigBuilder;
    /** @private */ this._milestoneStore = milestoneStore;
    /** @private */ this._mediaKeyServices = mediaKeyServices;
    /** @private */ this._challengeBuilder = challengeBuilder;
    /** @private */ this._playerCore = playerCore;
    /** @private */ this._profileBuilder = profileBuilder;
  }

  /**
   * Build a manifest request payload.
   *
   * @param {object} playbackRequest - Playback request context.
   * @param {object} mediaElement - HTMLMediaElement for DRM attachment.
   * @returns {Promise<[object, object]>} Tuple of [manifestPayload, metadata].
   */
  async build(playbackRequest, mediaElement) {
    const sessionContext = playbackRequest.sessionContext;
    const sessionParams = { ...sessionContext.initialParams, ...sessionContext.sessionParams };
    const viewableId = playbackRequest.movieId;
    const cfg = this._config();

    const [audioProfiles, videoProfiles, videoOutputInfo, videoConfig, drmData, drmType, liveAdsCapability] = await Promise.all([
      this._profileBuilder.getAudioProfiles({ manifestFormat: sessionContext.manifestFormat }),
      this._profileBuilder.getVideoProfiles({ manifestFormat: sessionContext.manifestFormat }),
      this._profileBuilder.getVideoOutputInfo(),
      this._buildVideoConfig(playbackRequest.sourceTransactionId, mediaElement),
      this._getDrmData(playbackRequest),
      this._getDrmType(playbackRequest),
      this._getLiveAdsCapability(),
    ]);

    const profiles = [
      ...audioProfiles.getProfiles(),
      ...videoProfiles.getProfiles(),
      ...cfg.defaultProfiles,
      'iso_23001_18-dash-live',
      'BIF240', 'BIF320',
    ].filter(Boolean);

    const payload = {
      type: 'standard',
      manifestVersion: this._version.isV3Manifest ? 'v3' : this._version.isV2Manifest ? 'v2' : 'v1',
      viewableId,
      profiles,
      flavor: playbackRequest.flavor,
      drmType,
      drmVersion: drmType === 'playready' ? 30 : 0,
      usePsshBox: true,
      isBranching: !!sessionContext.isSeeking,
      useHttpsStreams: true,
      supportsUnequalizedDownloadables: cfg.supportsUnequalizedDownloadables,
      uiVersion: this._version.uiVersion,
      uiPlatform: this._version.uiPlatform,
      clientVersion: this._platform.version,
      platform: cfg.browserInfo?.version,
      osVersion: cfg.browserInfo?.os?.version,
      osName: cfg.browserInfo?.os?.name,
      videoOutputInfo,
      isUIAutoPlay: sessionContext.manifestFormat === 'postplay' || !!sessionParams.isUIAutoPlay,
      challenge: videoConfig,
      isNonMember: this._version.isNonMember,
      supportsAdBreakHydration: true,
      liveMetadataFormat: 'INDEXED_SEGMENT_TEMPLATE',
      useBetterTextUrls: true,
      liveAdsCapability,
      supportsNetflixMediaEvents: true,
    };

    // Embed DRM challenge if available (licensed manifest flow)
    const metadata = {
      requestType: drmData
        ? 'licensedManifest'
        : playbackRequest.adBreakToken ? 'adBreakHydration' : 'manifest',
      drmSession: drmData?.drmSession,
      audioProfiles,
      videoProfiles,
    };

    if (drmData) {
      payload.challenges = {
        default: [{
          drmSessionId: drmData.drmSession.getSessionId() || 'session',
          clientTime: this._playerCore.currentTimeMs,
          challengeBase64: drmData.challenge,
        }],
      };
      payload.profileGroups = [{ name: 'default', profiles }];
      payload.licenseType = playbackRequest.type === 'LIMITED' ? 'limited' : 'standard';
      if (playbackRequest.sourceTransactionId) {
        payload.xid = playbackRequest.sourceTransactionId.toString();
      }
    }

    return [payload, metadata];
  }

  // -----------------------------------------------------------------------
  // Private helpers
  // -----------------------------------------------------------------------

  /** @private */
  async _buildVideoConfig(xid, mediaElement) {
    const result = await this._videoConfigBuilder.build(mediaElement);
    const milestones = xid && this._milestoneStore.getPlaybackMilestones(xid);
    milestones?.addMilestone('cad');
    return result;
  }

  /** @private */
  async _getDrmData(request) {
    if (request.type === undefined) return undefined;
    const needsChallenge =
      (request.type === 'LIMITED' && this._version.enableDolbyVision) ||
      (request.type === 'STANDARD_RENEWAL' && this._version.enableHEVC);
    return needsChallenge
      ? this._challengeBuilder.getChallenge(request.type)
      : undefined;
  }

  /** @private */
  async _getDrmType(request) {
    if (this._config().disableDAISupportedForHWDRM) {
      const access = await this._mediaKeyServices.getAccess();
      return access.observeKey.includes('3000') ? 'replace' : this._config().liveAdsCapability;
    }
    return this._mediaKeyServices.getDrmType();
  }

  /** @private */
  async _getLiveAdsCapability() {
    return this._config().liveAdsCapability || 'none';
  }
}
