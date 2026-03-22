/**
 * @module LicenseProvider
 * @description Provides DRM license acquisition via the PBO (Playback Orchestration) service.
 * Executes license requests against configured endpoints, processes the response,
 * and converts raw license data into a format the CDM can consume.
 *
 * @original Module_660
 */

// import { injectable, inject } from 'inversify'; // Module 22674
// import { LoggerToken } from '...';              // Module 87386

/**
 * @class LicenseProvider
 */
export class LicenseProvider {
  /**
   * @param {Object} pboExecutor - PBO command executor for license requests.
   * @param {Object} logger - Logger factory.
   * @param {Object} licenseRequestBuilder - Builds license request payloads.
   * @param {Object} licenseResponseParser - Parses license response payloads.
   */
  constructor(pboExecutor, logger, licenseRequestBuilder, licenseResponseParser) {
    /** @private */
    this.pboExecutor = pboExecutor;

    /** @private */
    this.licenseRequestBuilder = licenseRequestBuilder;

    /** @private */
    this.licenseResponseParser = licenseResponseParser;

    /** @private */
    this.logger = logger.createSubLogger('LicenseProviderImpl');
  }

  /**
   * Acquires a DRM license for the given session parameters.
   *
   * @param {Object} params - License request parameters.
   * @param {Object} params.links - Service endpoint links.
   * @param {*} params.J - Session/viewable identifier.
   * @returns {Promise<Object>} Parsed license response data.
   */
  acquireLicense(params) {
    const requestPayload = this.licenseRequestBuilder.buildRequest(params);

    return this.pboExecutor
      .execute({
        log: this.logger,
        links: params.links,
        J: params.J,
      }, requestPayload)
      .then((responses) => {
        // Extract raw license data from each response
        responses.map((response) => response.rawLicenseData);
        return this.licenseResponseParser.parseResponse(responses);
      })
      .catch((error) => {
        this.logger.error('PBO license failed', error);
        return Promise.reject(error);
      });
  }
}
