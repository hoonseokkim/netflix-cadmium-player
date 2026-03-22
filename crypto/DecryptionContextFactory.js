/**
 * @file DecryptionContextFactory.js
 * @description Factory for creating decryption contexts used in DRM content decryption.
 * Wraps the creation of a DecryptionContext with the platform-specific PBCID
 * (Protection Block Chain ID) from the player configuration.
 * @module crypto/DecryptionContextFactory
 * @see Module_66026
 */

import { DecryptionContext } from '../crypto/DecryptionContext.js';

/**
 * Factory class that creates DecryptionContext instances from player configuration.
 */
export class DecryptionContextFactory {
  /**
   * @param {Object} config - Player configuration object
   * @param {string} config.pbcid - Protection Block Chain ID for decryption
   */
  constructor(config) {
    /** @type {Object} */
    this.config = config;

    /** @type {DecryptionContext} The created decryption context */
    this.decryptionContext = new DecryptionContext(config.pbcid);
  }
}
