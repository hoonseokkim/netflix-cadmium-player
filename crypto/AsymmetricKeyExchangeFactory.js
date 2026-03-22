/**
 * Netflix Cadmium Player — Asymmetric Key Exchange Factory
 *
 * Implements the MSL (Message Security Layer) asymmetric key exchange
 * mechanism. Supports multiple key exchange schemes:
 *   - RSA          — raw RSA key wrapping
 *   - JWE_RSA      — JSON Web Encryption with RSA (A128GCM)
 *   - JWEJS_RSA    — JSON Web Encryption JSON Serialization with RSA
 *   - JWK_RSA      — JSON Web Key with RSA
 *   - JWK_RSAES    — JSON Web Key with RSA-ES (Diffie-Hellman style)
 *
 * The factory creates asymmetric key-pair request data, processes key
 * response data, and performs the key unwrap to produce the symmetric
 * encryption and HMAC keys for the MSL crypto session.
 *
 * @module crypto/AsymmetricKeyExchangeFactory
 */

// ─── Dependencies ──────────────────────────────────────────
// import { __extends, __importDefault } from 'tslib';
// import { KeyExchangeRequestData, KeyExchangeType } from '../modules/Module_75948';
// import { efb as BaseKeyRequestData } from '../modules/Module_59786';
// import { ffb as BaseKeyResponseData } from '../modules/Module_49140';
// import { cfb as BaseKeyExchangeFactory } from '../modules/Module_75316';
// import asyncComplete from '../modules/Module_42979';
// import Arrays from '../modules/Module_14945';
// import KeyExchangeError from '../modules/Module_35661';
// import EncodingError from '../modules/Module_6838';
// import MslEncodingError from '../modules/Module_88257';
// import MslError from '../modules/Module_36114';
// import { importKey as QXa } from '../modules/Module_42486';
// import { Algorithm as af } from '../modules/Module_96837';
// import { KeyUsage as BG } from '../modules/Module_10558';
// import { KeyFormat as kl } from '../modules/Module_11475';
// import MslInternalError from '../modules/Module_42458';
// import { JweAlgorithm, JweContentEncryption, JweEncryptor as Reb } from '../modules/Module_69351';
// import { RsaWrappingCryptoContext, WrappingMode } from '../modules/Module_33863';
// import IllegalStateError from '../modules/Module_10690';
// import { isMslError as readBytes } from '../modules/Module_32260';
// import { SymmetricCryptoSession as f8 } from '../modules/Module_43088';

// ─── Key Exchange Mechanism Enum ───────────────────────────

/**
 * Enumeration of supported asymmetric key-exchange mechanism names.
 * @readonly
 * @enum {string}
 */
export const KeyExchangeMechanism = {
  /** Raw RSA key wrapping */
  RSA: 'RSA',
  /** Elliptic Curve Cryptography (reserved, not actively used here) */
  ECC: 'ECC',
  /** JSON Web Encryption with RSA */
  JWE_RSA: 'JWE_RSA',
  /** JSON Web Encryption JSON Serialization with RSA */
  JWEJS_RSA: 'JWEJS_RSA',
  /** JSON Web Key with RSA */
  JWK_RSA: 'JWK_RSA',
  /** JSON Web Key with RSA-ES */
  JWK_RSAES: 'JWK_RSAES',
};

// ─── Asymmetric Key Request Data ───────────────────────────

/**
 * Holds the request-side data for an asymmetric key exchange:
 * a key-pair ID, the mechanism, a public key, and optionally a private key.
 *
 * Extends the base MSL KeyRequestData class.
 */
export class AsymmetricKeyRequestData /* extends BaseKeyRequestData */ {
  /**
   * @param {string|number} keyPairId   - Identifier for the key pair.
   * @param {string}        mechanism   - One of the `KeyExchangeMechanism` values.
   * @param {CryptoKey}     publicKey   - The public key for wrapping.
   * @param {CryptoKey|null} privateKey - The private key for unwrapping (may be null).
   */
  constructor(keyPairId, mechanism, publicKey, privateKey) {
    // super(KeyExchangeType.ASYMMETRIC);
    this.keyPairId = keyPairId;
    this.mechanism = mechanism;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  /**
   * Serialise to an MSL encoder object.
   */
  toMslEncoding(encoder, callback) {
    const self = this;
    asyncComplete(callback, function () {
      const obj = encoder.createObject();
      obj.put('keypairid', self.keyPairId);
      obj.put('mechanism', self.mechanism);
      obj.put('publickey', self.publicKey.toByteArray());
      return obj;
    });
  }

  /**
   * Structural equality check.
   * @param {AsymmetricKeyRequestData} other
   * @returns {boolean}
   */
  equals(other) {
    if (other === this) return true;
    if (!(other instanceof AsymmetricKeyRequestData)) return false;

    const privateKeysEqual =
      this.privateKey === other.privateKey ||
      (this.privateKey &&
        other.privateKey &&
        Arrays.equal(this.privateKey.toByteArray(), other.privateKey.toByteArray()));

    return (
      super.equals(other) &&
      this.keyPairId === other.keyPairId &&
      this.mechanism === other.mechanism &&
      Arrays.equal(this.publicKey.toByteArray(), other.publicKey.toByteArray()) &&
      privateKeysEqual
    );
  }

  /**
   * Serialise to a colon-delimited string.
   * @returns {string}
   */
  serialize() {
    const pubBytes = this.publicKey.toByteArray();
    const privBytes = this.privateKey && this.privateKey.toByteArray();
    let result =
      super.serialize() +
      ':' + this.keyPairId +
      ':' + this.mechanism +
      ':' + Arrays.toBase64(pubBytes);
    if (privBytes) {
      result += ':' + Arrays.toBase64(privBytes);
    }
    return result;
  }
}

// ─── Asymmetric Key Response Data ──────────────────────────

/**
 * Holds the response-side data: a key-pair ID plus the wrapped
 * encryption key and HMAC key bytes.
 */
export class AsymmetricKeyResponseData /* extends BaseKeyResponseData */ {
  /**
   * @param {Object}     masterToken   - The MSL master token.
   * @param {string|number} keyPairId  - Key pair identifier matching the request.
   * @param {Uint8Array} encryptionKey - Wrapped symmetric encryption key.
   * @param {Uint8Array} hmacKey       - Wrapped HMAC key.
   */
  constructor(masterToken, keyPairId, encryptionKey, hmacKey) {
    // super(masterToken, KeyExchangeType.ASYMMETRIC);
    this.keyPairId = keyPairId;
    this.encryptionKey = encryptionKey;
    this.hmacKey = hmacKey;
  }

  toMslEncoding(encoder, callback) {
    const self = this;
    asyncComplete(callback, function () {
      const obj = encoder.createObject();
      obj.put('keypairid', self.keyPairId);
      obj.put('encryptionkey', self.encryptionKey);
      obj.put('hmackey', self.hmacKey);
      return obj;
    });
  }

  equals(other) {
    if (this === other) return true;
    if (!(other instanceof AsymmetricKeyResponseData)) return false;
    return (
      super.equals(other) &&
      this.keyPairId === other.keyPairId &&
      Arrays.equal(this.encryptionKey, other.encryptionKey) &&
      Arrays.equal(this.hmacKey, other.hmacKey)
    );
  }

  serialize() {
    return (
      super.serialize() +
      ':' + this.keyPairId +
      ':' + Arrays.toBase64(this.encryptionKey) +
      ':' + Arrays.toBase64(this.hmacKey)
    );
  }
}

// ─── Helper: Create Request Data from MSL Payload ──────────

/**
 * Parse an MSL-encoded key request payload into an `AsymmetricKeyRequestData`
 * by importing the public key via Web Crypto.
 *
 * @param {Object}   encodedData - Encoded MSL object with keypairid, mechanism, publickey.
 * @param {Object}   callback    - { result, error } async result handler.
 */
export function parseKeyRequestData(encodedData, callback) {
  asyncComplete(callback, function () {
    let keyPairId, mechanism, publicKeyBytes;

    try {
      keyPairId = encodedData.readUint16('keypairid');
      mechanism = encodedData.readUint16('mechanism');
      publicKeyBytes = encodedData.readUint16('publickey');

      if (!KeyExchangeMechanism[mechanism]) {
        throw new KeyExchangeError(MslError.UNKNOWN_KEYX_MECHANISM, mechanism);
      }
    } catch (err) {
      if (err instanceof EncodingError) {
        throw new MslEncodingError(MslError.MSL_PARSE_ERROR, 'keydata ' + encodedData);
      }
      throw err;
    }

    try {
      switch (mechanism) {
        case KeyExchangeMechanism.RSA:
        case KeyExchangeMechanism.JWE_RSA:
        case KeyExchangeMechanism.JWEJS_RSA:
        case KeyExchangeMechanism.JWK_RSA:
          importKey(publicKeyBytes, Algorithm.RSA, KeyUsage.WRAP, KeyFormat.SPKI, {
            result(key) {
              callback.result(new AsymmetricKeyRequestData(keyPairId, mechanism, key, null));
            },
            error: callback.error,
          });
          break;

        case KeyExchangeMechanism.JWK_RSAES:
          importKey(publicKeyBytes, Algorithm.DH, KeyUsage.WRAP, KeyFormat.SPKI, {
            result(key) {
              callback.result(new AsymmetricKeyRequestData(keyPairId, mechanism, key, null));
            },
            error: callback.error,
          });
          break;

        default:
          throw new MslInternalError(MslError.UNSUPPORTED_KEYX_MECHANISM, mechanism);
      }
    } catch (err) {
      if (!isMslError(err)) {
        throw new MslInternalError(MslError.KEYX_FACTORY_ERROR, 'keydata ' + encodedData, err);
      }
      throw err;
    }
  });
}

/**
 * Parse an MSL-encoded key response payload.
 *
 * @param {Object} masterToken - The MSL master token.
 * @param {Object} encodedData - Encoded MSL object.
 * @returns {AsymmetricKeyResponseData}
 */
export function parseKeyResponseData(masterToken, encodedData) {
  let keyPairId, encryptionKey, hmacKey;

  try {
    keyPairId = encodedData.readUint16('keypairid');
    encryptionKey = encodedData.readUint16('encryptionkey');
    hmacKey = encodedData.readUint16('hmackey');
  } catch (err) {
    if (err instanceof EncodingError) {
      throw new MslEncodingError(MslError.MSL_PARSE_ERROR, 'keydata ' + encodedData);
    }
    throw err;
  }

  return new AsymmetricKeyResponseData(masterToken, keyPairId, encryptionKey, hmacKey);
}

// ─── Helper: Create Crypto Context for Mechanism ───────────

/**
 * Build the appropriate crypto context (JWE or RSA wrapping) for
 * the given key-exchange mechanism.
 *
 * @param {Object}     mslContext   - MSL context.
 * @param {string|number} keyPairId
 * @param {string}     mechanism    - One of KeyExchangeMechanism values.
 * @param {CryptoKey}  privateKey
 * @param {*}          extra
 * @returns {Object}   Crypto context with `unwrapKey` method.
 */
function createCryptoContext(mslContext, keyPairId, mechanism, privateKey, extra) {
  switch (mechanism) {
    case KeyExchangeMechanism.JWE_RSA:
    case KeyExchangeMechanism.JWEJS_RSA:
      return new JweEncryptor(mslContext, JweAlgorithm.RSA, JweContentEncryption.A128GCM, privateKey, extra);

    case KeyExchangeMechanism.RSA:
    case KeyExchangeMechanism.JWK_RSA:
      return new RsaWrappingCryptoContext(mslContext, keyPairId, privateKey, extra, WrappingMode.UNWRAP_JWK);

    case KeyExchangeMechanism.JWK_RSAES:
      return new RsaWrappingCryptoContext(mslContext, keyPairId, privateKey, extra, WrappingMode.UNWRAP_JWES);

    default:
      throw new MslInternalError(MslError.UNSUPPORTED_KEYX_MECHANISM, mechanism);
  }
}

// ─── Asymmetric Key Exchange Factory ───────────────────────

/**
 * Factory class that orchestrates asymmetric key exchange for MSL sessions.
 * Extends the base key exchange factory.
 */
export class AsymmetricKeyExchangeFactory /* extends BaseKeyExchangeFactory */ {
  /**
   * @param {Object} authUtils - Authentication utilities.
   */
  constructor(authUtils) {
    // super(KeyExchangeType.ASYMMETRIC);
    this.authUtils = authUtils;
  }

  /**
   * Generate request data (key-pair creation).
   */
  generateRequestData(encodedData, callback) {
    parseKeyRequestData(encodedData, callback);
  }

  /**
   * Parse response data from MSL message.
   */
  generateResponseData(masterToken, encodedData, callback) {
    asyncComplete(callback, function () {
      return parseKeyResponseData(masterToken, encodedData);
    });
  }

  /**
   * Unwrap the symmetric keys from the response and create an MSL
   * crypto session (SymmetricCryptoSession).
   *
   * @param {Object} mslContext       - MSL context.
   * @param {AsymmetricKeyRequestData}  requestData
   * @param {AsymmetricKeyResponseData} responseData
   * @param {Object} messageHeader    - MSL message header (for error context).
   * @param {Object} callback         - { result, error } async handler.
   */
  createCryptoSession(mslContext, requestData, responseData, messageHeader, callback) {
    asyncComplete(callback, function () {
      if (!(requestData instanceof AsymmetricKeyRequestData)) {
        throw new IllegalStateError('Key request data ' + requestData + ' was not created by this factory.');
      }
      if (!(responseData instanceof AsymmetricKeyResponseData)) {
        throw new IllegalStateError('Key response data ' + responseData + ' was not created by this factory.');
      }

      const requestKeyPairId = requestData.keyPairId;
      const responseKeyPairId = responseData.keyPairId;

      if (requestKeyPairId !== responseKeyPairId) {
        throw new KeyExchangeError(
          MslError.KEYX_RESPONSE_REQUEST_MISMATCH,
          'request ' + requestKeyPairId + '; response ' + responseKeyPairId
        ).setMessageHeader(messageHeader);
      }

      const privateKey = requestData.privateKey;
      if (!privateKey) {
        throw new KeyExchangeError(
          MslError.KEYX_PRIVATE_KEY_MISSING,
          'request Asymmetric private key'
        ).setMessageHeader(messageHeader);
      }

      const cryptoContext = createCryptoContext(
        mslContext,
        requestKeyPairId,
        requestData.mechanism,
        privateKey,
        null
      );

      // Unwrap the AES encryption key
      cryptoContext.unwrapKey(responseData.encryptionKey, Algorithm.AES_CBC, KeyUsage.ENCRYPT, {
        result(unwrappedEncryptionKey) {
          // Unwrap the HMAC key
          cryptoContext.unwrapKey(responseData.hmacKey, Algorithm.HMAC_SHA256, KeyUsage.SIGN, {
            result(unwrappedHmacKey) {
              // Get the entity identity
              mslContext.getEntityAuthenticationData({
                result(entityAuthData) {
                  asyncComplete(callback, function () {
                    return new SymmetricCryptoSession(
                      mslContext,
                      responseData.masterToken,
                      entityAuthData.getProfileIdentifier(),
                      unwrappedEncryptionKey,
                      unwrappedHmacKey
                    );
                  });
                },
                error(err) {
                  asyncComplete(callback, function () {
                    if (isMslError(err)) err.setMessageHeader(messageHeader);
                    throw err;
                  });
                },
              });
            },
            error(err) {
              asyncComplete(callback, function () {
                if (isMslError(err)) err.setMessageHeader(messageHeader);
                throw err;
              });
            },
          });
        },
        error(err) {
          asyncComplete(callback, function () {
            if (isMslError(err)) err.setMessageHeader(messageHeader);
            throw err;
          });
        },
      });
    });
  }
}
