/**
 * @file PaddingCodecSelectorFactory.js
 * @description Factory for creating padding codec selectors based on configuration.
 *              Padding codecs are used to generate filler media data when the player
 *              needs to pad the media source buffer (e.g., during ad transitions or
 *              stream switches). Supports "strict" (exact codec match) and "flexible"
 *              (best-effort codec match) selection strategies.
 * @module abr/PaddingCodecSelectorFactory
 * @original Module_27259
 */

// import { assert } from './utils';                           // Module 52571
// import { FlexiblePaddingCodecSelector } from './flexible';  // Module 36974
// import { StrictPaddingCodecSelector } from './strict';      // Module 603

/**
 * Factory that creates a padding codec selector based on the player's
 * configuration setting.
 */
export class PaddingCodecSelectorFactory {
  /**
   * @param {object} config - Player configuration object.
   * @param {string} config.paddingCodecSelector - Either "strict" or "flexible".
   */
  constructor(config) {
    /** @private */
    this.config = config;
  }

  /**
   * Create a new padding codec selector instance based on the configured strategy.
   * @returns {StrictPaddingCodecSelector|FlexiblePaddingCodecSelector} The codec selector.
   * @throws {Error} If the configured selector type is invalid.
   */
  create() {
    switch (this.config.paddingCodecSelector) {
      case "strict":
        return new StrictPaddingCodecSelector();
      case "flexible":
        return new FlexiblePaddingCodecSelector();
      default:
        throw new Error(
          `Invalid padding codec selector: ${this.config.paddingCodecSelector}`
        );
    }
  }
}
