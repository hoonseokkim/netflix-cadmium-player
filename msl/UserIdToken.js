/**
 * @file UserIdToken - MSL User ID Token for authenticated messaging
 * @module msl/UserIdToken
 * @description Implements the MSL (Message Security Layer) User ID Token,
 * which binds a user identity to a master token. The token includes a renewal
 * window, expiration time, serial numbers, and encrypted user data. Supports
 * creation from scratch and parsing from serialized MSL JSON.
 * @original Module_85065
 */

import { fp as MslToken } from '../msl/MslTokenBase.js';
import NfError from '../core/NfError.js';
import MaxInteger from '../core/MaxInteger.js';
import asyncComplete from '../utils/AsyncComplete.js';
import CryptoError from '../crypto/CryptoError.js';
import MslEncodingException from '../msl/MslEncodingException.js';
import MslException from '../msl/MslException.js';
import MslError from '../msl/MslError.js';
import MslEncoderException from '../msl/MslEncoderException.js';
import { stringifyFn } from '../utils/MslUtils.js';

/**
 * Internal data holder for serialized token components.
 * @private
 */
class TokenData {
    /**
     * @param {Object} issuerData - Parsed issuer data object
     * @param {Uint8Array} encryptedTokenData - Encrypted token data bytes
     * @param {Uint8Array} signature - Token signature bytes
     * @param {boolean} verified - Whether the signature was verified
     */
    constructor(issuerData, encryptedTokenData, signature, verified) {
        this.issuerData = issuerData;
        this.encryptedTokenData = encryptedTokenData;
        this.signature = signature;
        this.verified = verified;
    }
}

/**
 * MSL User ID Token that identifies a user within an MSL session.
 * Bound to a master token via serial number linkage.
 *
 * @class UserIdToken
 * @extends MslToken
 */
export class UserIdToken extends MslToken {
    /**
     * @param {Object} mslContext - MSL context with crypto and encoding support
     * @param {Date} renewalWindow - When the token becomes eligible for renewal
     * @param {Date} expiration - When the token expires
     * @param {Object} masterToken - The master token this is bound to
     * @param {number} serialNumber - This token's serial number
     * @param {Object} [issuerData] - Optional issuer-specific data
     * @param {Object} [user] - The user identity
     * @param {TokenData} [tokenData] - Pre-existing serialized token data
     * @throws {NfError} If expiration is before renewal window, or no master token,
     *   or serial number out of range
     */
    constructor(mslContext, renewalWindow, expiration, masterToken, serialNumber, issuerData, user, tokenData) {
        super();

        if (expiration.getTime() < renewalWindow.getTime()) {
            throw new NfError('Cannot construct a user ID token that expires before its renewal window opens.');
        }
        if (!masterToken) {
            throw new NfError('Cannot construct a user ID token without a master token.');
        }
        if (serialNumber < 0 || serialNumber > MaxInteger.MAX_SAFE_INTEGER) {
            throw new NfError(`Serial number ${serialNumber} is outside the valid range.`);
        }

        const renewalWindowSeconds = Math.floor(renewalWindow.getTime() / 1000);
        const expirationSeconds = Math.floor(expiration.getTime() / 1000);
        const masterTokenSerial = masterToken.SerialNumber;

        /** @type {Object} MSL context */
        this.mslContext = mslContext;

        /** @type {number} Renewal window (unix seconds) */
        this.renewalWindow = renewalWindowSeconds;

        /** @type {number} Expiration time (unix seconds) */
        this.tokenExpiration = expirationSeconds;

        /** @type {number} Master token serial number */
        this.masterTokenSerialNumber = masterTokenSerial;

        /** @type {number} This token's serial number */
        this.SerialNumber = serialNumber;

        /** @type {Object|null} Issuer-specific data */
        this.issuerData = issuerData;

        /** @type {Object|null} User identity */
        this.user = user;

        /** @type {boolean} Whether the token data has been verified */
        this.verified = true;

        /** @type {Object} Cache for encoded representations */
        this.encodings = {};

        if (tokenData) {
            this.tokenDataObject = tokenData.issuerData;
            this.encryptedTokenData = tokenData.encryptedTokenData;
            this.tokenSignature = tokenData.signature;
            this.verified = tokenData.verified;
        } else {
            this.tokenDataObject = mslContext.defaultValue.createObject();
            if (issuerData) {
                this.tokenDataObject.put('issuerdata', issuerData);
            }
            this.tokenDataObject.put('identity', user.serialize());
            this.encryptedTokenData = null;
            this.tokenSignature = null;
        }
    }

    /**
     * Whether this token has a bound user identity.
     * @returns {boolean}
     */
    hasUser() {
        return !!this.user;
    }

    /**
     * Get the renewal window as a Date.
     * @returns {Date}
     */
    getRenewalWindow() {
        return new Date(1000 * this.renewalWindow);
    }

    /**
     * Check if the token is within its renewal window.
     * @param {Date} [now] - Optional current time for comparison
     * @returns {boolean}
     */
    isRenewable(now) {
        if (now) {
            return this.getRenewalWindow().getTime() <= now.getTime();
        }
        return this.verified
            ? this.getRenewalWindow().getTime() <= this.mslContext.getTime()
            : true;
    }

    /**
     * Get the expiration time as a Date.
     * @returns {Date}
     */
    getExpiration() {
        return new Date(1000 * this.tokenExpiration);
    }

    /**
     * Check if the token has expired.
     * @param {Date} [now] - Optional current time for comparison
     * @returns {boolean}
     */
    isExpired(now) {
        if (now) {
            return this.getExpiration().getTime() <= now.getTime();
        }
        return this.verified
            ? this.getExpiration().getTime() <= this.mslContext.getTime()
            : false;
    }

    /**
     * Check if this token is bound to the given master token.
     * @param {Object} masterToken
     * @returns {boolean}
     */
    isBoundTo(masterToken) {
        return masterToken && masterToken.SerialNumber === this.masterTokenSerialNumber;
    }

    /**
     * Encode the token for transmission in an MSL message.
     * @param {Object} encoder - MSL encoder
     * @param {Object} format - Encoding format
     * @param {Object} callback - Async callback with result/error
     */
    toMslEncoding(encoder, format, callback) {
        const self = this;

        function finalizeEncoding(tokenData, signature) {
            asyncComplete(callback, () => {
                const container = encoder.createObject();
                container.put('tokendata', tokenData);
                container.put('signature', signature);
                encoder.encodeObject(container, format, {
                    result: (encoded) => {
                        asyncComplete(callback, () => {
                            self.encodings[format.name] = encoded;
                        });
                    },
                    error: callback.error
                });
            });
        }

        asyncComplete(callback, () => {
            // Return cached encoding if available
            if (self.encodings[format.name]) {
                return self.encodings[format.name];
            }

            // Use pre-existing encrypted data if available
            if (self.encryptedTokenData != null || self.tokenSignature != null) {
                finalizeEncoding(self.encryptedTokenData, self.tokenSignature);
            } else {
                // Encrypt and sign from scratch
                const cryptoContext = self.mslContext.mslCryptoContext;

                encoder.encodeObject(self.tokenDataObject, format, {
                    result: (encodedUserData) => {
                        cryptoContext.encrypt(encodedUserData, encoder, format, {
                            result: (encryptedUserData) => {
                                asyncComplete(callback, () => {
                                    const tokenDataObj = encoder.createObject();
                                    tokenDataObj.put('renewalwindow', self.renewalWindow);
                                    tokenDataObj.put('expiration', self.tokenExpiration);
                                    tokenDataObj.put('mtserialnumber', self.masterTokenSerialNumber);
                                    tokenDataObj.put('serialnumber', self.SerialNumber);
                                    tokenDataObj.put('userdata', encryptedUserData);

                                    encoder.encodeObject(tokenDataObj, format, {
                                        result: (encodedTokenData) => {
                                            cryptoContext.sign(encodedTokenData, encoder, format, {
                                                result: (signature) => {
                                                    finalizeEncoding(encodedTokenData, signature);
                                                },
                                                error: (err) => {
                                                    asyncComplete(callback, () => {
                                                        if (err instanceof CryptoError) {
                                                            throw new MslEncodingException('Error signing the token data.', err);
                                                        }
                                                        throw err;
                                                    });
                                                }
                                            });
                                        },
                                        error: callback.error
                                    });
                                });
                            },
                            error: (err) => {
                                asyncComplete(callback, () => {
                                    if (err instanceof CryptoError) {
                                        throw new MslEncodingException('Error encrypting the user data.', err);
                                    }
                                    throw err;
                                });
                            }
                        });
                    },
                    error: callback.error
                });
            }
        });
    }

    /**
     * Get a string representation of the token (with redacted user data).
     * @returns {string}
     */
    toString() {
        const encoder = this.mslContext.defaultValue;
        const tokenDataObj = encoder.createObject();
        tokenDataObj.put('renewalwindow', this.renewalWindow);
        tokenDataObj.put('expiration', this.tokenExpiration);
        tokenDataObj.put('mtserialnumber', this.masterTokenSerialNumber);
        tokenDataObj.put('serialnumber', this.SerialNumber);
        tokenDataObj.put('userdata', '(redacted)');

        const container = encoder.createObject();
        container.put('tokendata', tokenDataObj);
        container.put('signature', this.tokenSignature ? this.tokenSignature : '(null)');
        return container.toString();
    }

    /**
     * Check equality based on serial numbers.
     * @param {*} other
     * @returns {boolean}
     */
    equals(other) {
        if (this === other) return true;
        if (!(other instanceof UserIdToken)) return false;
        return this.SerialNumber === other.SerialNumber &&
               this.masterTokenSerialNumber === other.masterTokenSerialNumber;
    }

    /**
     * Get a unique key for this token.
     * @returns {string}
     */
    uniqueKey() {
        return this.SerialNumber + ':' + this.masterTokenSerialNumber;
    }
}

/**
 * Create a new UserIdToken asynchronously.
 * @param {Object} mslContext
 * @param {Date} renewalWindow
 * @param {Date} expiration
 * @param {Object} masterToken
 * @param {number} serialNumber
 * @param {Object} issuerData
 * @param {Object} user
 * @param {Object} callback
 */
export function createUserIdToken(mslContext, renewalWindow, expiration, masterToken, serialNumber, issuerData, user, callback) {
    asyncComplete(callback, () => {
        return new UserIdToken(mslContext, renewalWindow, expiration, masterToken, serialNumber, issuerData, user, null);
    });
}

/**
 * Parse a UserIdToken from an MSL-encoded JSON object.
 * @param {Object} mslContext
 * @param {Object} mslObject - The encoded token object
 * @param {Object} masterToken - The bound master token
 * @param {Object} callback
 */
export function parseUserIdToken(mslContext, mslObject, masterToken, callback) {
    asyncComplete(callback, () => {
        const cryptoContext = mslContext.mslCryptoContext;
        const encoder = mslContext.defaultValue;

        const tokenDataBytes = mslObject.getBytes('tokendata');
        if (tokenDataBytes.length === 0) {
            throw new MslEncoderException(MslError.USERIDTOKEN_TOKENDATA_MISSING, 'useridtoken ' + mslObject)
                .setMasterToken(masterToken);
        }

        const signatureBytes = mslObject.getBytes('signature');

        cryptoContext.verify(tokenDataBytes, signatureBytes, encoder, {
            result: (verified) => {
                _parseTokenData(encoder, cryptoContext, tokenDataBytes, signatureBytes, verified);
            },
            error: callback.error
        });
    });

    function _parseTokenData(encoder, cryptoContext, tokenDataBytes, signatureBytes, verified) {
        asyncComplete(callback, () => {
            const tokenData = encoder.parseObject(tokenDataBytes);
            const renewalWindow = tokenData.getLong('renewalwindow');
            const expiration = tokenData.getLong('expiration');

            if (expiration < renewalWindow) {
                throw new MslException(MslError.USERIDTOKEN_EXPIRES_BEFORE_RENEWAL, 'usertokendata ' + tokenData)
                    .setMasterToken(masterToken);
            }

            const mtSerialNumber = tokenData.getLong('mtserialnumber');
            if (mtSerialNumber < 0 || mtSerialNumber > MaxInteger.MAX_SAFE_INTEGER) {
                throw new MslException(MslError.USERIDTOKEN_MASTERTOKEN_SERIAL_NUMBER_OUT_OF_RANGE, 'usertokendata ' + tokenData)
                    .setMasterToken(masterToken);
            }

            const serialNumber = tokenData.getLong('serialnumber');
            if (serialNumber < 0 || serialNumber > MaxInteger.MAX_SAFE_INTEGER) {
                throw new MslException(MslError.USERIDTOKEN_SERIAL_NUMBER_OUT_OF_RANGE, 'usertokendata ' + tokenData)
                    .setMasterToken(masterToken);
            }

            const encryptedUserData = tokenData.getBytes('userdata');
            if (encryptedUserData.length === 0) {
                throw new MslException(MslError.USERIDTOKEN_USERDATA_MISSING)
                    .setMasterToken(masterToken);
            }

            if (verified) {
                cryptoContext.decrypt(encryptedUserData, encoder, {
                    result: (decryptedData) => {
                        _parseUserData(encoder, tokenDataBytes, signatureBytes, verified,
                            renewalWindow, expiration, mtSerialNumber, serialNumber, decryptedData);
                    },
                    error: (err) => {
                        asyncComplete(callback, () => {
                            if (err instanceof CryptoError) err.setMasterToken(masterToken);
                            throw err;
                        });
                    }
                });
            } else {
                _finalize(tokenDataBytes, signatureBytes, verified,
                    renewalWindow, expiration, mtSerialNumber, serialNumber, null, null, null);
            }
        });
    }

    function _parseUserData(encoder, tokenDataBytes, signatureBytes, verified,
        renewalWindow, expiration, mtSerialNumber, serialNumber, decryptedUserData) {
        asyncComplete(callback, () => {
            const userData = encoder.parseObject(decryptedUserData);
            const issuerData = userData.has('issuerdata') ? userData.getObject('issuerdata', encoder) : null;
            const identity = userData.getString('identity');

            if (!identity || identity.length === 0) {
                throw new MslException(MslError.USERIDTOKEN_IDENTITY_MISSING, 'userdata ' + userData)
                    .setMasterToken(masterToken);
            }

            // Note: In production, this calls TokenFactory.createUser()
            // which resolves the identity string to a User object
        });
    }

    function _finalize(tokenDataBytes, signatureBytes, verified,
        renewalWindow, expiration, mtSerialNumber, serialNumber, userData, issuerData, user) {
        asyncComplete(callback, () => {
            const renewalDate = new Date(1000 * renewalWindow);
            const expirationDate = new Date(1000 * expiration);

            if (!masterToken || mtSerialNumber !== masterToken.SerialNumber) {
                throw new MslException(MslError.USERIDTOKEN_MASTERTOKEN_MISMATCH,
                    `uit mtserialnumber ${mtSerialNumber}; mt ${masterToken}`)
                    .setMasterToken(masterToken);
            }

            const tokenDataHolder = new TokenData(userData, tokenDataBytes, signatureBytes, verified);
            return new UserIdToken(mslContext, renewalDate, expirationDate, masterToken,
                serialNumber, issuerData, user, tokenDataHolder);
        });
    }
}

export default UserIdToken;
