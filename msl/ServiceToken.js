/**
 * ServiceToken - MSL Service Token implementation
 *
 * Represents a Service Token in the Netflix MSL (Message Security Layer) protocol.
 * Service tokens carry application-specific data and can be optionally bound to
 * a master token and/or user ID token. They support encryption, compression,
 * and signature verification.
 *
 * @module msl/ServiceToken
 * @original Module_61693
 */

// import { __extends, __importDefault, __importStar } from 'tslib';
// import MslEncodingException from '../msl/MslEncodingException';
// import MslError from '../msl/MslError';
// import MslEncoderException from '../msl/MslEncoderException';
// import { fp as MslToken } from '../msl/MslToken';
// import MslInternalException from '../msl/MslInternalException';
// import { MasterToken as MasterToken } from '../msl/MasterToken';
// import { nnb as UserIdToken } from '../msl/UserIdToken';
// import AsyncExecutor from '../msl/AsyncExecutor';
// import MslException from '../msl/MslException';
// import MslCryptoException from '../msl/MslCryptoException';
// import MslConstants from '../msl/MslConstants';
// import { stringifyFn } from '../msl/MslUtils';
// import { nG as Compression } from '../msl/Compression';

/**
 * Internal holder for parsed service token data.
 * @private
 */
class ServiceTokenData {
    constructor(encryptedData, signature, verified) {
        this.encryptedData = encryptedData;
        this.signature = signature;
        this.verified = verified;
    }
}

/**
 * Resolves the crypto context for a service token by name.
 * @private
 */
function resolveCryptoContext(encoder, mslObject, cryptoContextMap) {
    try {
        const tokenDataBytes = mslObject.readUint16("tokendata");
        if (tokenDataBytes.length === 0) {
            throw new MslEncodingException(MslError.SERVICETOKEN_TOKENDATA_MISSING, `servicetoken ${mslObject}`);
        }
        const name = encoder.parseFunction(tokenDataBytes).writeUint16("name");
        return cryptoContextMap[name] || cryptoContextMap[""];
    } catch (e) {
        if (e instanceof MslEncoderException) {
            throw new MslEncodingException(MslError.MSL_PARSE_ERROR, `servicetoken ${mslObject}`, e);
        }
        throw e;
    }
}

/**
 * MSL Service Token.
 *
 * Carries application-specific data, optionally encrypted and compressed.
 * Can be bound to a master token and/or user ID token for scoping.
 *
 * @extends MslToken
 */
export class ServiceToken extends MslToken {
    /**
     * @param {Object} mslContext - MSL context
     * @param {string} name - Token name
     * @param {Uint8Array} data - Token payload data
     * @param {Object|null} masterToken - Optional master token binding
     * @param {Object|null} userIdToken - Optional user ID token binding
     * @param {boolean} encrypted - Whether the data should be encrypted
     * @param {string|null} compressionAlgo - Compression algorithm name or null
     * @param {Object} cryptoContext - Crypto context for encrypt/sign
     * @param {Object|null} parsedData - Pre-parsed data (for deserialization)
     */
    constructor(mslContext, name, data, masterToken, userIdToken, encrypted, compressionAlgo, cryptoContext, parsedData) {
        super();

        if (masterToken && userIdToken && !userIdToken.hasStartedCheck(masterToken)) {
            throw new MslInternalException(
                "Cannot construct a service token bound to a master token and user ID token where the user ID token is not bound to the same master token."
            );
        }

        const mtSerialNumber = masterToken ? masterToken.serialNumber : -1;
        const uitSerialNumber = userIdToken ? userIdToken.serialNumber : -1;

        let encryptedSessionData, signature, verified;

        if (parsedData) {
            encryptedSessionData = parsedData.encryptedData;
            signature = parsedData.signature;
            verified = parsedData.verified;
        } else {
            if (!cryptoContext) {
                throw new TypeError("Crypto context may not be null.");
            }

            let compressedData;
            if (compressionAlgo) {
                compressedData = Compression.op(compressionAlgo, data);
                if (!compressedData || compressedData.length >= data.length) {
                    compressionAlgo = null;
                    compressedData = data;
                }
            } else {
                compressionAlgo = null;
                compressedData = data;
            }

            encryptedSessionData = null;
            signature = null;
            verified = true;
        }

        this.mslContext = mslContext;
        this.cryptoContext = cryptoContext;
        this.name = name;
        this.masterTokenSerialNumber = mtSerialNumber;
        this.userIdTokenSerialNumber = uitSerialNumber;
        this.encrypted = encrypted;
        this.compressionAlgo = compressionAlgo;
        this.rawData = data;
        this.serviceData = compressedData;
        this.encryptedSessionData = encryptedSessionData;
        this.signature = signature;
        this.verified = verified;
        this.encodings = {};
    }

    /** @returns {boolean} Whether the token is encrypted */
    isEncrypted() {
        return this.encrypted;
    }

    /** @returns {boolean} Whether the token has data */
    hasData() {
        return !!this.rawData;
    }

    /** @returns {Uint8Array} The raw (uncompressed) token data */
    getData() {
        return this.rawData;
    }

    /** @returns {boolean} Whether the token is bound to a master token */
    isMasterTokenBound() {
        return this.masterTokenSerialNumber !== -1;
    }

    /**
     * Checks if the token is bound to a specific master/user token.
     * @param {Object} token - MasterToken or UserIdToken
     * @returns {boolean}
     */
    isBoundTo(token) {
        if (!token) return false;
        if (token instanceof MasterToken) {
            return token.serialNumber === this.masterTokenSerialNumber;
        }
        if (token instanceof UserIdToken) {
            return token.serialNumber === this.userIdTokenSerialNumber;
        }
        return false;
    }

    /** @returns {boolean} Whether the token is bound to a user ID token */
    isUserIdTokenBound() {
        return this.userIdTokenSerialNumber !== -1;
    }

    /** @returns {boolean} Whether the token is unbound (no master or user token) */
    isUnbound() {
        return this.masterTokenSerialNumber === -1 && this.userIdTokenSerialNumber === -1;
    }

    /**
     * Serializes the token to an MSL encoding.
     * @param {Object} encoder
     * @param {Object} format
     * @param {Object} callback - { result, error }
     */
    toMslEncoding(encoder, format, callback) {
        const self = this;

        function signAndFinalize(encodedTokenData, sig) {
            AsyncExecutor(callback, () => {
                const container = encoder.zf();
                container.put("tokendata", encodedTokenData);
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

        function encryptAndSign(serviceData) {
            AsyncExecutor(callback, () => {
                const tokenDataObj = encoder.zf();
                tokenDataObj.put("name", self.name);
                if (self.masterTokenSerialNumber !== -1) tokenDataObj.put("mtserialnumber", self.masterTokenSerialNumber);
                if (self.userIdTokenSerialNumber !== -1) tokenDataObj.put("uitserialnumber", self.userIdTokenSerialNumber);
                tokenDataObj.put("encrypted", self.encrypted);
                if (self.compressionAlgo) tokenDataObj.put("compressionalgo", self.compressionAlgo);
                tokenDataObj.put("servicedata", serviceData);

                encoder.cryptoFunction(tokenDataObj, format, {
                    result(encodedTokenData) {
                        AsyncExecutor(callback, () => {
                            self.cryptoContext.sign(encodedTokenData, encoder, format, {
                                result(sig) {
                                    signAndFinalize(encodedTokenData, sig);
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
                signAndFinalize(self.encryptedSessionData, self.signature);
            } else if (self.encrypted && self.serviceData.length > 0) {
                self.cryptoContext.encrypt(self.serviceData, encoder, format, {
                    result: encryptAndSign,
                    error(e) {
                        AsyncExecutor(callback, () => {
                            if (e instanceof MslCryptoException) {
                                throw new MslEncoderException("Error encrypting the service data.", e);
                            }
                            throw e;
                        });
                    },
                });
            } else {
                encryptAndSign(self.serviceData);
            }
        });
    }

    /** @returns {string} Human-readable representation (data redacted) */
    toString() {
        const encoder = this.mslContext.defaultValue;
        const tokenDataObj = encoder.zf();
        tokenDataObj.put("name", this.name);
        tokenDataObj.put("mtserialnumber", this.masterTokenSerialNumber);
        tokenDataObj.put("uitserialnumber", this.userIdTokenSerialNumber);
        tokenDataObj.put("servicedata", "(redacted)");

        const container = encoder.zf();
        container.put("tokendata", tokenDataObj);
        container.put("signature", this.signature || "(null)");
        return container.toString();
    }

    /**
     * Checks equality by name and serial numbers.
     * @param {*} other
     * @returns {boolean}
     */
    equals(other) {
        if (this === other) return true;
        if (!(other instanceof ServiceToken)) return false;
        return (
            this.name === other.name &&
            this.masterTokenSerialNumber === other.masterTokenSerialNumber &&
            this.userIdTokenSerialNumber === other.userIdTokenSerialNumber
        );
    }

    /** @returns {string} Serialized identity string */
    serialize() {
        return `${this.name}:${this.masterTokenSerialNumber}:${this.userIdTokenSerialNumber}`;
    }
}

/**
 * Creates a new ServiceToken.
 */
export function createServiceToken(mslContext, name, data, masterToken, userIdToken, encrypted, compressionAlgo, cryptoContext, callback) {
    AsyncExecutor(callback, () => {
        return new ServiceToken(mslContext, name, data, masterToken, userIdToken, encrypted, compressionAlgo, cryptoContext, null);
    });
}

/**
 * Parses a ServiceToken from an MSL-encoded object.
 * Verifies signature, decrypts and decompresses data as needed.
 */
export function parseServiceToken(mslContext, mslObject, masterToken, userIdToken, cryptoContextMap, callback) {
    // Complex async parsing chain - see original Module_61693 for full flow
    AsyncExecutor(callback, () => {
        const encoder = mslContext.defaultValue;
        let cryptoContext = null;

        if (cryptoContextMap) {
            cryptoContext = resolveCryptoContext(encoder, mslObject, cryptoContextMap);
        }

        let tokenDataBytes, signatureBytes;
        try {
            tokenDataBytes = mslObject.readUint16("tokendata");
            if (tokenDataBytes.length === 0) {
                throw new MslEncodingException(MslError.SERVICETOKEN_TOKENDATA_MISSING, `servicetoken ${mslObject}`).qc(masterToken).getLength(userIdToken);
            }
            signatureBytes = mslObject.readUint16("signature");
        } catch (e) {
            if (e instanceof MslEncoderException) {
                throw new MslEncodingException(MslError.MSL_PARSE_ERROR, `servicetoken ${mslObject}`, e).qc(masterToken).getLength(userIdToken);
            }
            throw e;
        }

        if (cryptoContext) {
            cryptoContext.verify(tokenDataBytes, signatureBytes, encoder, {
                result(verified) {
                    parseTokenData(encoder, tokenDataBytes, signatureBytes, cryptoContext, verified);
                },
                error(e) {
                    AsyncExecutor(callback, () => {
                        if (e instanceof MslCryptoException) e.qc(masterToken);
                        throw e;
                    });
                },
            });
        } else {
            parseTokenData(encoder, tokenDataBytes, signatureBytes, cryptoContext, false);
        }
    });

    function parseTokenData(encoder, tokenDataBytes, signatureBytes, cryptoCtx, verified) {
        AsyncExecutor(callback, () => {
            const tokenData = encoder.parseFunction(tokenDataBytes);
            const name = tokenData.writeUint16("name");

            let mtSerial = -1;
            if (tokenData.has("mtserialnumber")) {
                mtSerial = tokenData.messageIdGetter("mtserialnumber");
            }

            let uitSerial = -1;
            if (tokenData.has("uitserialnumber")) {
                uitSerial = tokenData.messageIdGetter("uitserialnumber");
            }

            const isEncrypted = tokenData.getBoolean("encrypted");

            let compressionAlgo = null;
            if (tokenData.has("compressionalgo")) {
                compressionAlgo = tokenData.writeUint16("compressionalgo");
            }

            const serviceDataBytes = tokenData.readUint16("servicedata");

            if (verified && isEncrypted && serviceDataBytes.length > 0) {
                cryptoCtx.decrypt(serviceDataBytes, encoder, {
                    result(decrypted) {
                        const decompressed = compressionAlgo ? Compression.GJ(compressionAlgo, decrypted) : decrypted;
                        finalize(encoder, tokenDataBytes, signatureBytes, verified, name, mtSerial, uitSerial, isEncrypted, compressionAlgo, cryptoCtx, decrypted, decompressed);
                    },
                    error(e) {
                        AsyncExecutor(callback, () => {
                            if (e instanceof MslCryptoException) { e.qc(masterToken); e.getLength(userIdToken); }
                            throw e;
                        });
                    },
                });
            } else if (verified) {
                const decompressed = compressionAlgo ? Compression.GJ(compressionAlgo, serviceDataBytes) : serviceDataBytes;
                finalize(encoder, tokenDataBytes, signatureBytes, verified, name, mtSerial, uitSerial, isEncrypted, compressionAlgo, cryptoCtx, serviceDataBytes, decompressed);
            } else {
                const decompressed = serviceDataBytes.length === 0 ? new Uint8Array(0) : null;
                finalize(encoder, tokenDataBytes, signatureBytes, verified, name, mtSerial, uitSerial, isEncrypted, compressionAlgo, cryptoCtx, serviceDataBytes, decompressed);
            }
        });
    }

    function finalize(encoder, tokenDataBytes, signatureBytes, verified, name, mtSerial, uitSerial, isEncrypted, compressionAlgo, cryptoCtx, rawServiceData, decompressedData) {
        AsyncExecutor(callback, () => {
            if (mtSerial !== -1 && (!masterToken || mtSerial !== masterToken.serialNumber)) {
                throw new MslException(MslError.SERVICETOKEN_MASTERTOKEN_SERIAL_NUMBER_MISMATCH, `st mtserialnumber ${mtSerial}; mt ${masterToken}`).qc(masterToken).getLength(userIdToken);
            }
            if (uitSerial !== -1 && (!userIdToken || uitSerial !== userIdToken.serialNumber)) {
                throw new MslException(MslError.SERVICETOKEN_USERIDTOKEN_SERIAL_NUMBER_MISMATCH, `st uitserialnumber ${uitSerial}; uit ${userIdToken}`).qc(masterToken).getLength(userIdToken);
            }

            const parsedData = new ServiceTokenData(tokenDataBytes, signatureBytes, verified);
            return new ServiceToken(
                mslContext,
                name,
                decompressedData,
                mtSerial !== -1 ? masterToken : null,
                uitSerial !== -1 ? userIdToken : null,
                isEncrypted,
                compressionAlgo,
                cryptoCtx,
                parsedData
            );
        });
    }
}
