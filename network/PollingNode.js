/**
 * @file PollingNode.js
 * @description A polling network node that periodically executes a request function.
 *              Extends the base polling mechanism (Mlb) and delegates actual request
 *              execution to a configurable audio media type handler. Used for
 *              health-check or keep-alive polling in the streaming pipeline.
 * @module network/PollingNode
 * @original Module_74041
 */

import { __extends } from 'tslib'; // Module 22970
import { Mlb as BasePollingNode } from '../network/PboDispatcher'; // Module 8678

/**
 * A configurable polling node that delegates request execution to a factory-provided handler.
 *
 * @extends BasePollingNode
 */
export class PollingNode extends BasePollingNode {
  /**
   * @param {Object} config - Polling configuration
   * @param {number} config.interval - Polling interval (BN)
   * @param {*} config.G3 - G3 setting
   * @param {*} config.BH - BH parameter
   * @param {*} config.Rfa - Rfa setting
   * @param {*} config.fXb - fXb setting
   * @param {Function} config.audioMediaTypeId - Factory that creates the request handler
   * @param {*} config.srb - srb parameter
   * @param {string} config.url - Target URL
   * @param {number} config.nxa - Timeout
   * @param {Object} nodeInfo - Node metadata (includes visible flag)
   */
  constructor(config, nodeInfo) {
    super({
      BN: config.interval,
      G3: config.G3,
      BH: config.BH,
      Rfa: config.Rfa,
      fXb: config.fXb,
      nodeInfo,
    });

    /** @type {Function} The request handler created by the factory */
    this._requestHandler = config.audioMediaTypeId({
      trace: this.pauseTrace,
      nodeModuleRef: this.nodeModuleRef,
      BH: config.BH,
      srb: config.srb,
      url: config.url,
      visible: nodeInfo.visible,
      timeout: config.nxa,
      eventLogger: this.eventLogger,
      nodeInfo,
    });
  }

  /**
   * Executes a polling request by delegating to the request handler.
   * @param {*} params - Request parameters
   * @returns {*} Result from the request handler
   */
  audioMediaTypeId(params) {
    return this._requestHandler(params);
  }
}
