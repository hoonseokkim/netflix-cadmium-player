/**
 * @module FtlProbeConfig
 * @description Configuration for the FTL (Fast Tunnel Link) network probe.
 * FTL probes are used to measure connection quality and latency to Netflix servers.
 * Extends ConfigBase with configurable endpoint, enable flag, and delay settings.
 *
 * @original Module_34731
 */

// import { injectable, inject } from 'inversify';  // Module 22674
// import { ConfigBase } from '...';                 // Module 64174
// import { config, types } from '...';              // Module 12501

/**
 * @class FtlProbeConfig
 * @extends ConfigBase
 */
export class FtlProbeConfig extends ConfigBase {
  /**
   * @param {Object} configProvider - Configuration provider.
   * @param {Object} emeSession - EME session with endpoint info.
   * @param {Object} playerCore - Player core instance.
   */
  constructor(configProvider, emeSession, playerCore) {
    super(configProvider, 'FtlProbeConfigImpl');

    /** @private */
    this.emeSession = emeSession;

    /** @private */
    this.playerCore = playerCore;
  }

  /**
   * Whether FTL probing is enabled.
   * @config ftlEnabled
   * @type {boolean}
   */
  get enabled() {
    return true;
  }

  /**
   * The full FTL probe endpoint URL with query parameters.
   * @type {string}
   */
  get endpoint() {
    const separator = this.baseEndpoint.indexOf('?') === -1 ? '?' : '&';
    return `${this.baseEndpoint}${separator}monotonic=${this.playerCore.monotonicTimestamp}&device=web`;
  }

  /**
   * Delay before starting FTL probing (seekToSample duration).
   * @config ftlStartDelay
   * @type {number}
   */
  get startDelay() {
    return seekToSample;
  }

  /**
   * Optional force parameter for the FTL endpoint.
   * @config ftlEndpointForceParam
   * @type {string}
   */
  get endpointForceParam() {
    return '';
  }

  /**
   * Base FTL endpoint URL constructed from EME session endpoint.
   * @config ftlEndpoint
   * @type {string}
   */
  get baseEndpoint() {
    return this.emeSession.endpoint + '/ftl/probe' +
      (this.endpointForceParam ? '?force=' + this.endpointForceParam : '');
  }
}
