/**
 * @file SuffixedAuthData.js
 * @description MSL (Message Security Layer) authentication data with a root + suffix
 *              identifier scheme. Used for scoped entity authentication where the
 *              identity is composed of a root identity and a suffix (e.g., per-device
 *              or per-session authentication).
 * @module msl/SuffixedAuthData
 * @original Module_66734
 */

import { __extends, __importDefault } from 'tslib'; // Module 22970
import { n6 as BaseAuthData } from '../msl/MessageHeader'; // Module 58768
import { dG as AuthDataSchemes } from '../msl/MslControl'; // Module 36332
import asyncComplete from '../msl/MslMessageStreamFactory'; // Module 42979
import MslEncodingException from '../msl/MslInternalException'; // Module 6838
import MslException from '../msl/MslMessageException'; // Module 88257
import MslError from '../msl/MslInterruptedException'; // Module 36114

/**
 * Entity authentication data using a root + suffix identifier scheme.
 * The full identity is "root.suffix".
 *
 * @extends BaseAuthData
 */
export class SuffixedAuthData extends BaseAuthData {
  /**
   * @param {string} root - Root identity
   * @param {string} suffix - Suffix identity
   */
  constructor(root, suffix) {
    super(AuthDataSchemes.u3b);

    /** @type {string} Root part of the identity */
    this.root = root;

    /** @type {string} Suffix part of the identity */
    this.suffix = suffix;
  }

  /**
   * Returns the full profile identifier: "root.suffix".
   * @returns {string}
   */
  getProfileIdentifier() {
    return this.root + '.' + this.suffix;
  }

  /**
   * Serializes this auth data into an MSL encoding.
   * @param {Object} encoder - MSL encoder
   * @param {Object} format - Encoding format
   */
  registerEncoding(encoder, format) {
    asyncComplete(format, () => {
      const obj = encoder.zf();
      obj.put('root', this.root);
      obj.put('suffix', this.suffix);
      return obj;
    });
  }

  /**
   * Checks equality with another auth data instance.
   * @param {*} other
   * @returns {boolean}
   */
  equals(other) {
    if (this === other) return true;
    if (!(other instanceof SuffixedAuthData)) return false;
    return super.equals(other) && this.root === other.root && this.suffix === other.suffix;
  }
}

/**
 * Deserializes a SuffixedAuthData from an MSL encoded object.
 * @param {Object} mslObject - The MSL encoded data
 * @returns {SuffixedAuthData}
 * @throws {MslException} If the data cannot be authenticated
 */
export function deserializeSuffixedAuthData(mslObject) {
  try {
    const root = mslObject.writeUint16('root');
    const suffix = mslObject.writeUint16('suffix');
    return new SuffixedAuthData(root, suffix);
  } catch (error) {
    if (error instanceof MslEncodingException) {
      throw new MslException(MslError.lf, 'Unauthenticated suffixed authdata' + mslObject);
    }
    throw error;
  }
}
