/**
 * Netflix Cadmium Player — ManifestEndpointCommand
 *
 * Command class that fetches the playback manifest from the Netflix API.
 * Constructs the correct API endpoint path based on the session context
 * (prefetch, postplay, live, ad-break hydration, prefetch-live-ads) and
 * dispatches the HTTP request via the MSL transport layer.
 *
 * After receiving the response it:
 *   1. Runs any registered manifest processors on the raw data.
 *   2. Parses the manifest via a factory (`manifestParserFactory`).
 *   3. Handles licensed-manifest DRM flows and attaches license data.
 *
 * Uses dependency injection (`@injectable`) with platform, manifest parser,
 * license broker, request transformer, and optional manifest processors.
 *
 * @module manifest/ManifestEndpointCommand
 */

// ─── Dependencies ──────────────────────────────────────────
// import { __decorate, __param } from 'tslib';
// import { FlavorType } from '../modules/Module_72639';          // PRE_FETCH, SUPPLEMENTAL
// import { CommandCategory } from '../modules/Module_36129';     // ea.MANIFEST
// import { EndpointNames } from '../modules/Module_19114';       // oj.manifestRef, oj.cGc
// import { BaseCommand } from '../modules/Module_51658';         // lj
// import { injectable, inject, optional, multiInject } from '../modules/Module_22674';
// import { PlatformToken } from '../modules/Module_91581';
// import { MslPreference } from '../modules/Module_34231';       // PreferNoMsl, PreferMsl
// import { getMaxBitrateStream } from '../modules/Module_56039'; // JVa

// ─── Endpoint Path Builder ─────────────────────────────────

/**
 * Determine the endpoint path, operation name, and call-mode flags
 * for a manifest request based on the session context.
 *
 * @param {Object}  request       - The manifest request descriptor.
 * @param {boolean} isLicensed    - True when the endpoint is "licensedManifest".
 * @returns {{ endpointPath: string, operationName: string, callModeFlag: number }}
 */
function resolveEndpointInfo(request, isLicensed) {
  let operationName = isLicensed ? 'licensedManifest' : 'manifest';
  let endpointPath = operationName;

  const isPrefetch = request.flavor === FlavorType.PRE_FETCH;
  const isPostplay =
    request.sessionContext.manifestFormat === 'postplay' ||
    request.sessionContext.manifestFormat === 'postplay-seamless' ||
    request.isPostplay;

  if (isPrefetch || isPostplay) {
    endpointPath = (isPostplay ? 'postplay/' : 'prefetch/') + endpointPath;
  }

  const isLive = request.sessionContext.manifestFormat === 'live';
  if (isLive) {
    endpointPath += '/live';
  }

  // Ad-break hydration takes priority
  const isAdBreakHydration =
    !!request.adContext?.adBreakToken || !!request.adContext?.adBreakId;
  if (isAdBreakHydration) {
    endpointPath = 'adBreakHydration' + (isLive ? '/live' : '');
  }

  // Prefetch live ads
  const isPrefetchLiveAds = !!request.prefetchLiveAds;
  if (isPrefetchLiveAds) {
    operationName = endpointPath = 'prefetchLiveAds';
  }

  // Append /ad for ad-supported content (unless ad-break hydration or live-ads prefetch)
  if (request.execPointer && !isAdBreakHydration && !isPrefetchLiveAds) {
    endpointPath += '/ad';
  }

  const hasCachedManifest = !!request.hasManifestCached;
  const callModeFlag = (isPrefetch || hasCachedManifest) ? 0 : 3;

  return {
    endpointPath,
    operationName,
    callModeFlag,
  };
}

// ─── ManifestEndpointCommand ───────────────────────────────

export class ManifestEndpointCommand /* extends BaseCommand */ {
  /**
   * @param {Object} platform                - Platform capabilities descriptor.
   * @param {Object} manifestParserFactory   - Creates a parsed manifest from raw data.
   * @param {Object} licenseBroker           - Manages license acquisition from manifest tracks.
   * @param {Function} requestTransformerFactory - Builds the MSL request transformer.
   * @param {Array}  [manifestProcessors]    - Optional post-fetch processors.
   */
  constructor(platform, manifestParserFactory, licenseBroker, requestTransformerFactory, manifestProcessors) {
    // super(CommandCategory.MANIFEST);
    this.platform = platform;
    this.manifestParserFactory = manifestParserFactory;
    this.licenseBroker = licenseBroker;
    this.requestTransformerFactory = requestTransformerFactory;
    this.manifestProcessors = manifestProcessors || [];
  }

  /**
   * Execute the manifest fetch.
   *
   * @param {Object} context - Execution context (connection, auth, etc.).
   * @param {Object} request - Manifest request descriptor.
   * @returns {Promise<Object>} Parsed manifest result.
   */
  execute(context, request) {
    const self = this;

    const mslPreference =
      request.flavor === FlavorType.SUPPLEMENTAL
        ? MslPreference.PreferNoMsl
        : MslPreference.PreferMsl;

    return this.requestTransformerFactory()
      .transform(request, mslPreference)
      .then(function ([payload, transportConfig]) {
        const endpointInfo = self.resolveEndpointInfo(
          request,
          transportConfig.endpointName === 'licensedManifest'
        );

        return self
          .send(
            context,
            {
              url: transportConfig.endpointName,
              name: endpointInfo.operationName,
              callMode: endpointInfo.callMode,
              callModeFlag: endpointInfo.callModeFlag,
            },
            payload,
            undefined,
            mslPreference
          )
          .then(function (response) {
            const rawManifest = response.result;

            // Run post-fetch processors (e.g. ad insertion, DRM annotation)
            self.manifestProcessors.forEach(function (processor) {
              return processor.process(rawManifest);
            });

            // Parse the manifest
            const parsedResult = self.manifestParserFactory.create(rawManifest);
            const manifestContent = parsedResult.manifestContent;

            // Handle licensed-manifest DRM license flow
            if (transportConfig.drmHandler) {
              const licenseUrls = manifestContent.video_tracks
                .map(function (track) {
                  return track.license;
                })
                .filter(Boolean);

              if (licenseUrls.length > 0) {
                const licenseSet = self.licenseBroker.createLicenseSet(licenseUrls);
                const maxBitrateStream = getMaxBitrateStream(manifestContent.video_tracks[0].streams);
                transportConfig.drmHandler.attachLicenseData(licenseSet, maxBitrateStream);
                parsedResult.drmHandler = transportConfig.drmHandler;
                parsedResult.isLicensedManifest = true;
              } else {
                transportConfig.drmHandler.close();
              }
            }

            parsedResult.supplementalConfig = transportConfig.supplementalConfig;
            parsedResult.networkInfo = transportConfig.networkInfo;

            return parsedResult;
          });
      })
      .catch(function (error) {
        throw self.errorWrapper(error);
      });
  }
}
