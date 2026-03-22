/**
 * @module AleKeyExchangeFactory
 * @description Factory that creates and manages ALE (Application Level Encryption)
 * key exchange sessions. Selects the appropriate key exchange handler
 * (CLEAR, RSA-OAEP-256, or AUTH-DH) based on configuration and validates
 * scheme compatibility. Handles the full key provisioning lifecycle:
 * init -> server response -> session creation.
 *
 * @see Module_7379
 */

import { __assign, __awaiter, __generator } from '../core/tslib';
import { DrmSessionManager } from '../drm/DrmSessionManager';
import { VMb as parseProvisioningResponse, yib as PROVISIONING_VERSION } from '../crypto/ProvisioningParser';
import { AleKeyxScheme, AleScheme } from '../crypto/AleEncryptionSchemes';
import { ClearKeyxHandler } from '../crypto/ClearKeyxHandler';
import { xib as ALE_VERSION } from '../crypto/AleConstants';
import { RSA_OAEP_256_KeyxHandler } from '../crypto/RsaOaepKeyxHandler';
import { DiffieHellmanKeyxHandler } from '../crypto/DiffieHellmanKeyxHandler';

/**
 * Factory for creating ALE key exchange sessions.
 * Validates scheme compatibility and delegates to the appropriate handler.
 */
export class AleKeyExchangeFactory {
  /**
   * @param {object} config
   * @param {string} config.scheme - ALE encryption scheme
   * @param {string} config.keyx - Key exchange scheme
   * @param {object} config.crypto - Crypto implementation
   * @param {object} config.drmKeyWrapper - DRM key wrapper
   * @param {string} config.hvb - Key exchange type identifier
   * @param {object} [config.wj] - Shared secret config (for AUTH-DH)
   * @param {object} [config.dhKeyExchangeConfig] - Diffie-Hellman parameters (for AUTH-DH)
   */
  constructor(config) {
    AleKeyExchangeFactory.validateSchemeCompat(config);

    switch (config.keyx) {
      case AleKeyxScheme.CLEAR:
        this._keyExchangeHandler = new ClearKeyxHandler(config.crypto, config.drmKeyWrapper, config.scheme);
        break;

      case AleKeyxScheme.RSA_OAEP_256:
        this._keyExchangeHandler = new RSA_OAEP_256_KeyxHandler(config.crypto, config.drmKeyWrapper, config.scheme);
        break;

      case AleKeyxScheme.AUTH_DH:
        if (!config.wj || !config.dhKeyExchangeConfig) {
          throw new Error('missing config for AUTH-DH keyx scheme');
        }
        this._keyExchangeHandler = new DiffieHellmanKeyxHandler(
          config.crypto, config.drmKeyWrapper, config.wj, config.dhKeyExchangeConfig
        );
        break;

      default:
        throw new Error('unsupported key exchange scheme');
    }

    this._config = { ...config };
  }

  /**
   * Validates that the encryption scheme and key exchange scheme are compatible.
   * A128CBC-HS256-NRD requires AUTH-DH, and vice versa.
   * @param {object} config
   * @throws {Error} If schemes are incompatible
   */
  static validateSchemeCompat(config) {
    const isNrdScheme = config.scheme === AleScheme.A128CBC_HS256_NRD;
    const isAuthDhKeyx = config.keyx === AleKeyxScheme.AUTH_DH;

    if ((isNrdScheme && !isAuthDhKeyx) || (isAuthDhKeyx && !isNrdScheme)) {
      throw new Error('ALE scheme and Keyx scheme are incompatible');
    }
  }

  /**
   * Initiates the key exchange by producing a JSON request payload.
   * @returns {Promise<string>} JSON string to send to the provisioning server
   */
  async initKeyExchange() {
    const keyxData = await this._keyExchangeHandler.generateKeyRequest();
    const request = {
      ver: ALE_VERSION,
      scheme: this._config.scheme,
      type: this._config.hvb,
      keyx: keyxData,
    };
    return JSON.stringify(request);
  }

  /**
   * Processes the provisioning server response and creates a DRM session.
   * @param {string} responseData - Raw response from provisioning server
   * @returns {Promise<DrmSessionManager>} A new DRM session
   * @throws {Error} If version, scheme, or keyx scheme mismatch
   */
  async createSession(responseData) {
    const response = parseProvisioningResponse(responseData);

    if (response.ver !== PROVISIONING_VERSION) {
      throw new Error('incompatible provisioning response version');
    }
    if (response.scheme !== this._config.scheme) {
      throw new Error('inconsistent scheme in provisioning response');
    }
    if (response.keyx.scheme !== this._config.keyx) {
      throw new Error('inconsistent keyx scheme in provisioning response');
    }

    const keyMaterial = await this._keyExchangeHandler.processKeyResponse(response.keyx);
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + response.ttl);

    const renewalWindow = response.rw !== undefined
      ? response.rw
      : this._computeRenewalWindow(response.ttl);

    const renewalTime = new Date(expiration.getTime());
    renewalTime.setSeconds(renewalTime.getSeconds() - renewalWindow);

    return new DrmSessionManager(
      response.token,
      expiration,
      renewalTime,
      keyMaterial,
      this._config.drmKeyWrapper
    );
  }

  /**
   * Computes a default renewal window: min(ttl/3, 86400 seconds / 1 day).
   * @param {number} ttl - Time to live in seconds
   * @returns {number} Renewal window in seconds
   * @private
   */
  _computeRenewalWindow(ttl) {
    return Math.min(Math.floor(ttl / 3), 86400);
  }
}

export { AleKeyExchangeFactory as a$a };
