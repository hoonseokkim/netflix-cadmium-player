/**
 * @file KeyResponseData.js
 * @description MSL (Message Security Layer) key response data handling.
 *              Provides the KeyResponseData class for wrapping master-token-scoped
 *              key exchange data, and a factory function for deserializing key
 *              response data from MSL-encoded payloads.
 * @module msl/KeyResponseData
 * @original Module_49140
 */

import { __extends, __importDefault } from 'tslib'; // Module 22970
import { fp as BaseKeyResponseData } from '../msl/MslTokenStore'; // Module 48235
import asyncComplete from '../msl/MslMessageStreamFactory'; // Module 42979
import { internal_Bxa as deserializeMasterToken } from '../msl/MslControl'; // Module 58892
import MslKeyExchangeException from '../msl/MslInternalException'; // Module 35661
import MslError from '../msl/MslInterruptedException'; // Module 36114
import MslEncodingException from '../msl/MslInternalException'; // Module 6838
import MslException from '../msl/MslMessageException'; // Module 88257

/**
 * Key response data that wraps a master token and a key exchange scheme.
 * Contains the master token and scheme-specific key data needed to
 * establish session keys.
 *
 * @extends BaseKeyResponseData
 */
export class KeyResponseData extends BaseKeyResponseData {
  /**
   * @param {Object} masterToken - The master token
   * @param {Object} keyExchangeScheme - The key exchange scheme used
   */
  constructor(masterToken, keyExchangeScheme) {
    super();

    /** @type {Object} The MSL master token */
    this.masterToken = masterToken;

    /** @type {Object} The key exchange scheme */
    this.keyExchangeScheme = keyExchangeScheme;
  }

  /**
   * Serializes key data into MSL-encoded format.
   * @param {Object} encoder - MSL encoder
   * @param {Object} context - Encoding context
   * @param {Object} format - Output format
   */
  processData(encoder, context, format) {
    this.KVa(encoder, {
      result: (keyData) => {
        asyncComplete(format, () => {
          const obj = encoder.zf();
          obj.put('mastertoken', this.masterToken);
          obj.put('scheme', this.keyExchangeScheme.name);
          obj.put('keydata', keyData);
          encoder.cryptoFunction(obj, context, format);
        });
      },
      error: format.error,
    });
  }

  /**
   * Checks equality with another KeyResponseData instance.
   * @param {*} other
   * @returns {boolean}
   */
  equals(other) {
    if (this === other) return true;
    if (!(other instanceof KeyResponseData)) return false;
    return this.masterToken.equals(other.masterToken) &&
      this.keyExchangeScheme === other.keyExchangeScheme;
  }

  /**
   * Returns a string representation.
   * @returns {string}
   */
  serialize() {
    return this.masterToken.serialize() + ':' + this.keyExchangeScheme;
  }
}

/**
 * Deserializes key response data from an MSL-encoded payload.
 * Parses the master token, resolves the key exchange scheme, and
 * creates the appropriate key response data object.
 *
 * @param {Object} ctx - MSL context with scheme resolution
 * @param {Object} mslObject - The MSL-encoded key response
 * @param {Object} callbacks - Async callbacks { result, error }
 * @throws {MslKeyExchangeException} If the scheme is unknown
 * @throws {MslException} If encoding is invalid
 */
export function deserializeKeyResponseData(ctx, mslObject, callbacks) {
  asyncComplete(callbacks, () => {
    const defaultValue = ctx.defaultValue;

    try {
      const masterTokenData = mslObject.authData('mastertoken', defaultValue);
      const schemeName = mslObject.writeUint16('scheme');
      const scheme = ctx.jCb(schemeName);

      if (!scheme) {
        throw new MslKeyExchangeException(MslError.$mb, schemeName);
      }

      const keyData = mslObject.authData('keydata', defaultValue);

      deserializeMasterToken(ctx, masterTokenData, {
        result: (masterToken) => {
          asyncComplete(callbacks, () => {
            const factory = ctx.IVa(scheme);
            if (!factory) {
              throw new MslKeyExchangeException(MslError.gGa, scheme.name);
            }
            factory.nmc(masterToken, keyData, callbacks);
          });
        },
        error: callbacks.error,
      });
    } catch (error) {
      if (error instanceof MslEncodingException) {
        throw new MslException(MslError.lf, 'keyresponsedata ' + mslObject, error);
      }
      throw error;
    }
  });
}
