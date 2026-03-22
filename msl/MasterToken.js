/**
 * MasterToken - MSL Master Token implementation
 *
 * Represents a Master Token in the Netflix MSL (Message Security Layer) protocol.
 * Master tokens contain encrypted session data (encryption key, HMAC key, identity)
 * and are used to establish secure communication channels.
 *
 * @module msl/MasterToken
 * @original Module_58892
 */

// import { __extends, __importDefault } from 'tslib';
// import { fp as MslToken } from '../msl/MslToken';
// import MslInternalException from '../msl/MslInternalException';
// import MslConstants from '../msl/MslConstants';
// import MslCryptoException from '../msl/MslCryptoException';
// import MslError from '../msl/MslError';
// import AsyncExecutor from '../msl/AsyncExecutor';
// import MslEncoderException from '../msl/MslEncoderException';
// import MslEncodingException from '../msl/MslEncodingException';
// import MslException from '../msl/MslException';
// import { stringifyFn } from '../msl/MslUtils';
// import { RXa as importKey } from '../crypto/KeyImport';
// import { BG as KeyUsage } from '../crypto/KeyUsage';

/**
 * Internal holder for parsed/cached master token data.
 * @private
 */
class MasterTokenData {
    /**
     * @param {Object} sessionData - Parsed session data object
     * @param {Uint8Array} encryptedData - Encrypted token data bytes
     * @param {Uint8Array} signature - Token signature bytes
     * @param {boolean} verified - Whether the signature was verified
     */
    constructor(sessionData, encryptedData, signature, verified) {
        this.sessionData = sessionData;
        this.encryptedData = encryptedData;
        this.signature = signature;
        this.verified = verified;
    }
}

/**
 * MSL Master Token.
 *
 * Contains the session identity, encryption key, and HMAC/signature key
 * needed to secure MSL messages. Supports serialization, verification,
 * renewal checking, and expiration comparison.
 *
 * @extends MslToken
 */
export class MasterToken extends MslToken {
    /**
     * @param {Object} mslContext - MSL context providing crypto and encoder
     * @param {Date} renewalWindow - When the token becomes eligible for renewal
     * @param {Date} expiration - When the token expires
     * @param {number} sequenceNumber - Token sequence number
     * @param {number} serialNumber - Token serial number
     * @param {Object|null} issuerData - Optional issuer-specific data
     * @param {string} identity - Token identity string
     * @param {Object} encryptionKey - Encryption key object
     * @param {Object} signatureKey - HMAC/signature key object
     * @param {Object|null} tokenData - Pre-parsed token data (for deserialization)
     */
    constructor(mslContext, renewalWindow, expiration, sequenceNumber, serialNumber, issuerData, identity, encryptionKey, signatureKey, tokenData) {
        super();

        if (expiration.getTime() < renewalWindow.getTime()) {
            throw new MslInternalException("Cannot construct a master token that expires before its renewal window opens.");
        }
        if (sequenceNumber < 0 || sequenceNumber > MslConstants.MAX_LONG_VALUE) {
            throw new MslInternalException(`Sequence number ${sequenceNumber} is outside the valid range.`);
        }
        if (serialNumber < 0 || serialNumber > MslConstants.MAX_LONG_VALUE) {
            throw new MslInternalException(`Serial number ${serialNumber} is outside the valid range.`);
        }

        const renewalWindowSeconds = Math.floor(renewalWindow.getTime() / 1000);
        const expirationSeconds = Math.floor(expiration.getTime() / 1000);

        let sessionData, encryptedSessionData, signature, verified;

        if (tokenData) {
            // Reconstructing from parsed data
            sessionData = tokenData.sessionData;
            encryptedSessionData = tokenData.encryptedData;
            signature = tokenData.signature;
            verified = tokenData.verified;
        } else {
            // Creating a new token
            const encKeyBytes = encryptionKey.T4();
            const encAlgoName = MslConstants.EncryptionAlgo.nS(encryptionKey.algorithm);
            const sigKeyBytes = signatureKey.T4();
            const sigAlgoName = MslConstants.SignatureAlgo.nS(signatureKey.algorithm);

            if (!encAlgoName || !sigAlgoName) {
                throw new MslCryptoException(
                    MslError.UNIDENTIFIED_ALGORITHM,
                    `encryption algorithm: ${encryptionKey.algorithm}; signature algorithm: ${signatureKey.algorithm}`
                );
            }

            sessionData = mslContext.defaultValue.zf();
            if (issuerData) sessionData.put("issuerdata", issuerData);
            sessionData.put("identity", identity);
            sessionData.put("encryptionkey", encKeyBytes);
            sessionData.put("encryptionalgorithm", encAlgoName);
            sessionData.put("hmackey", sigKeyBytes);
            sessionData.put("signaturekey", sigKeyBytes);
            sessionData.put("signaturealgorithm", sigAlgoName);

            encryptedSessionData = null;
            signature = null;
            verified = true;
        }

        this.mslContext = mslContext;
        this.renewalWindowSec = renewalWindowSeconds;
        this.expirationSec = expirationSeconds;
        this.sequenceNumber = sequenceNumber;
        this.serialNumber = serialNumber;
        this.sessionData = sessionData;
        this.issuerData = issuerData;
        this.identity = identity;
        this.encryptionKey = encryptionKey;
        this.signatureKey = signatureKey;
        this.encryptedSessionData = encryptedSessionData;
        this.signature = signature;
        this.verified = verified;
        this.encodings = {};
    }

    /**
     * @returns {Date} The renewal window start time
     */
    getRenewalWindow() {
        return new Date(1000 * this.renewalWindowSec);
    }

    /**
     * @returns {Date} The token expiration time
     */
    getExpiration() {
        return new Date(1000 * this.expirationSec);
    }

    /**
     * @returns {boolean} Whether session data is present
     */
    hasSessionData() {
        return !!this.sessionData;
    }

    /**
     * Checks if the token is within its renewal window.
     *
     * @param {Date} [now] - Optional reference time; defaults to MSL context time
     * @returns {boolean} True if the token is renewable
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
     * Checks if the token has expired.
     *
     * @param {Date} [now] - Optional reference time
     * @returns {boolean} True if the token has expired
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
     * Determines if this token is newer than another token.
     *
     * Handles sequence number wraparound by considering a window of 127
     * below the max long value.
     *
     * @param {MasterToken} other - Token to compare against
     * @returns {boolean} True if this token is newer
     */
    isNewerThan(other) {
        if (this.sequenceNumber === other.sequenceNumber) {
            return this.getExpiration() > other.getExpiration();
        }
        if (this.sequenceNumber > other.sequenceNumber) {
            const cutoff = this.sequenceNumber - MslConstants.MAX_LONG_VALUE + 127;
            return other.sequenceNumber >= cutoff;
        }
        const cutoff = other.sequenceNumber - MslConstants.MAX_LONG_VALUE + 127;
        return this.sequenceNumber < cutoff;
    }

    /**
     * Serializes the token to an MSL encoding.
     *
     * @param {Object} encoder - MSL encoder
     * @param {Object} format - Encoding format
     * @param {Object} callback - { result, error } callbacks
     */
    toMslEncoding(encoder, format, callback) {
        const self = this;

        function finalizeEncoding(tokenData, sig) {
            AsyncExecutor(callback, () => {
                const container = encoder.zf();
                container.put("tokendata", tokenData);
                container.put("signature", sig);
                encoder.cryptoFunction(container, format, {
                    result(encoded) {
                        AsyncExecutor(callback, () => {
                            self.encodings[format.name] = encoded;
                        });
                    },
                    error: callback.error,
                });
            });
        }

        AsyncExecutor(callback, () => {
            if (self.encodings[format.name]) {
                return self.encodings[format.name];
            }

            if (self.encryptedSessionData != null || self.signature != null) {
                finalizeEncoding(self.encryptedSessionData, self.signature);
            } else {
                let cryptoContext;
                try {
                    cryptoContext = self.mslContext.rna;
                } catch (e) {
                    if (e instanceof MslCryptoException) {
                        throw new MslEncoderException("Error creating the MSL crypto context.", e);
                    }
                    throw e;
                }

                encoder.cryptoFunction(self.sessionData, format, {
                    result(encodedSession) {
                        cryptoContext.encrypt(encodedSession, encoder, format, {
                            result(encryptedData) {
                                AsyncExecutor(callback, () => {
                                    const tokenDataObj = encoder.zf();
                                    tokenDataObj.put("renewalwindow", self.renewalWindowSec);
                                    tokenDataObj.put("expiration", self.expirationSec);
                                    tokenDataObj.put("sequencenumber", self.sequenceNumber);
                                    tokenDataObj.put("serialnumber", self.serialNumber);
                                    tokenDataObj.put("sessiondata", encryptedData);

                                    encoder.cryptoFunction(tokenDataObj, format, {
                                        result(encodedTokenData) {
                                            cryptoContext.sign(encodedTokenData, encoder, format, {
                                                result(sig) {
                                                    finalizeEncoding(encodedTokenData, sig);
                                                },
                                                error(e) {
                                                    AsyncExecutor(callback, () => {
                                                        if (e instanceof MslCryptoException) {
                                                            throw new MslEncoderException("Error signing the token data.", e);
                                                        }
                                                        throw e;
                                                    });
                                                },
                                            });
                                        },
                                        error: callback.error,
                                    });
                                });
                            },
                            error(e) {
                                AsyncExecutor(callback, () => {
                                    if (e instanceof MslCryptoException) {
                                        throw new MslEncoderException("Error encrypting the session data.", e);
                                    }
                                    throw e;
                                });
                            },
                        });
                    },
                    error: callback.error,
                });
            }
        });
    }

    /** @returns {string} Human-readable representation (session data redacted) */
    toString() {
        const encoder = this.mslContext.defaultValue;
        const tokenData = encoder.zf();
        tokenData.put("renewalwindow", this.renewalWindowSec);
        tokenData.put("expiration", this.expirationSec);
        tokenData.put("sequencenumber", this.sequenceNumber);
        tokenData.put("serialnumber", this.serialNumber);
        tokenData.put("sessiondata", "(redacted)");

        const container = encoder.zf();
        container.put("tokendata", tokenData);
        container.put("signature", this.signature ? this.signature : "(null)");
        return container.toString();
    }

    /**
     * Checks equality based on serial number, sequence number, and expiration.
     * @param {*} other
     * @returns {boolean}
     */
    equals(other) {
        if (this === other) return true;
        if (!(other instanceof MasterToken)) return false;
        return (
            this.serialNumber === other.serialNumber &&
            this.sequenceNumber === other.sequenceNumber &&
            this.getExpiration().getTime() === other.getExpiration().getTime()
        );
    }

    /**
     * @returns {string} Serialized identity string "serialNumber:sequenceNumber:expiration"
     */
    serialize() {
        return `${this.serialNumber}:${this.sequenceNumber}:${this.getExpiration().getTime()}`;
    }
}

/**
 * Creates a new MasterToken.
 *
 * @param {Object} mslContext
 * @param {Date} renewalWindow
 * @param {Date} expiration
 * @param {number} sequenceNumber
 * @param {number} serialNumber
 * @param {Object|null} issuerData
 * @param {string} identity
 * @param {Object} encryptionKey
 * @param {Object} signatureKey
 * @param {Object} callback - { result, error }
 */
export function createMasterToken(mslContext, renewalWindow, expiration, sequenceNumber, serialNumber, issuerData, identity, encryptionKey, signatureKey, callback) {
    AsyncExecutor(callback, () => {
        return new MasterToken(mslContext, renewalWindow, expiration, sequenceNumber, serialNumber, issuerData, identity, encryptionKey, signatureKey, null);
    });
}

/**
 * Parses a MasterToken from an MSL-encoded object.
 *
 * Verifies the signature, decrypts session data, and reconstructs
 * the encryption and signature keys.
 *
 * @param {Object} mslContext
 * @param {Object} mslObject - The encoded MSL object
 * @param {Object} callback - { result, error }
 */
export function parseMasterToken(mslContext, mslObject, callback) {
    // Implementation follows the complex async verification/decryption chain
    // from the original obfuscated code. See original Module_58892 for full flow.
    AsyncExecutor(callback, () => {
        const cryptoContext = mslContext.rna;
        const encoder = mslContext.defaultValue;

        let tokenDataBytes, signatureBytes;
        try {
            tokenDataBytes = mslObject.readUint16("tokendata");
            if (tokenDataBytes.length === 0) {
                throw new MslEncodingException(MslError.MASTERTOKEN_TOKENDATA_MISSING, `mastertoken ${mslObject}`);
            }
            signatureBytes = mslObject.readUint16("signature");
        } catch (e) {
            if (e instanceof MslEncoderException) {
                throw new MslEncodingException(MslError.MSL_PARSE_ERROR, `mastertoken ${mslObject}`, e);
            }
            throw e;
        }

        cryptoContext.verify(tokenDataBytes, signatureBytes, encoder, {
            result(verified) {
                parseTokenData(cryptoContext, encoder, tokenDataBytes, signatureBytes, verified);
            },
            error: callback.error,
        });
    });

    function parseTokenData(cryptoCtx, encoder, tokenDataBytes, signatureBytes, verified) {
        AsyncExecutor(callback, () => {
            const tokenData = encoder.parseFunction(tokenDataBytes);
            const renewalWindowSec = tokenData.messageIdGetter("renewalwindow");
            const expirationSec = tokenData.messageIdGetter("expiration");

            if (expirationSec < renewalWindowSec) {
                throw new MslException(MslError.MASTERTOKEN_EXPIRES_BEFORE_RENEWAL, `mastertokendata ${tokenData}`);
            }

            const seqNum = tokenData.messageIdGetter("sequencenumber");
            if (seqNum < 0 || seqNum > MslConstants.MAX_LONG_VALUE) {
                throw new MslException(MslError.MASTERTOKEN_SEQUENCE_NUMBER_OUT_OF_RANGE, `mastertokendata ${tokenData}`);
            }

            const serialNum = tokenData.messageIdGetter("serialnumber");
            if (serialNum < 0 || serialNum > MslConstants.MAX_LONG_VALUE) {
                throw new MslException(MslError.MASTERTOKEN_SERIAL_NUMBER_OUT_OF_RANGE, `mastertokendata ${tokenData}`);
            }

            const sessionDataBytes = tokenData.readUint16("sessiondata");
            if (sessionDataBytes.length === 0) {
                throw new MslEncodingException(MslError.MASTERTOKEN_SESSIONDATA_MISSING, `mastertokendata ${tokenData}`);
            }

            const renewalWindow = new Date(1000 * renewalWindowSec);
            const expiration = new Date(1000 * expirationSec);

            if (verified) {
                cryptoCtx.decrypt(sessionDataBytes, encoder, {
                    result(decryptedData) {
                        parseSessionData(cryptoCtx, encoder, tokenDataBytes, signatureBytes, verified, renewalWindow, expiration, seqNum, serialNum, decryptedData);
                    },
                    error: callback.error,
                });
            } else {
                finalizeToken(cryptoCtx, encoder, tokenDataBytes, signatureBytes, verified, renewalWindow, expiration, seqNum, serialNum, null, null, null, null, null);
            }
        });
    }

    function parseSessionData(cryptoCtx, encoder, tokenDataBytes, signatureBytes, verified, renewalWindow, expiration, seqNum, serialNum, decryptedSessionData) {
        AsyncExecutor(callback, () => {
            const sessionData = encoder.parseFunction(decryptedSessionData);
            const issuerData = sessionData.has("issuerdata") ? sessionData.authData("issuerdata", encoder) : null;
            const identity = sessionData.writeUint16("identity");
            const encKeyBytes = sessionData.readUint16("encryptionkey");
            const encAlgoName = sessionData.ffa("encryptionalgorithm", MslConstants.EncryptionAlgo.defaultAlgo);
            const sigKeyBytes = sessionData.has("signaturekey") ? sessionData.readUint16("signaturekey") : sessionData.readUint16("hmackey");
            const sigAlgoName = sessionData.ffa("signaturealgorithm", MslConstants.SignatureAlgo.defaultAlgo);

            const encAlgo = MslConstants.EncryptionAlgo.B7a(encAlgoName);
            const sigAlgo = MslConstants.SignatureAlgo.B7a(sigAlgoName);

            if (!encAlgo || !sigAlgo) {
                throw new MslCryptoException(
                    MslError.UNIDENTIFIED_ALGORITHM,
                    `encryption algorithm: ${encAlgoName}; signature algorithm: ${sigAlgoName}`
                );
            }

            importKey(encKeyBytes, encAlgo, KeyUsage.encrypt, {
                result(encKey) {
                    importKey(sigKeyBytes, sigAlgo, KeyUsage.sign, {
                        result(sigKey) {
                            finalizeToken(cryptoCtx, encoder, tokenDataBytes, signatureBytes, verified, renewalWindow, expiration, seqNum, serialNum, sessionData, issuerData, identity, encKey, sigKey);
                        },
                        error(e) {
                            callback.error(new MslCryptoException(MslError.MASTERTOKEN_KEY_CREATION_ERROR, e));
                        },
                    });
                },
                error(e) {
                    callback.error(new MslCryptoException(MslError.MASTERTOKEN_KEY_CREATION_ERROR, e));
                },
            });
        });
    }

    function finalizeToken(cryptoCtx, encoder, tokenDataBytes, signatureBytes, verified, renewalWindow, expiration, seqNum, serialNum, sessionData, issuerData, identity, encKey, sigKey) {
        AsyncExecutor(callback, () => {
            const parsedData = new MasterTokenData(sessionData, tokenDataBytes, signatureBytes, verified);
            return new MasterToken(mslContext, renewalWindow, expiration, seqNum, serialNum, issuerData, identity, encKey, sigKey, parsedData);
        });
    }
}
