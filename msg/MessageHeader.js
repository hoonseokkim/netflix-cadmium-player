/**
 * Netflix Cadmium Player - MSL Message Header
 *
 * Implements the MSL (Message Security Layer) message header, which contains
 * all the metadata for an MSL message: entity/master token authentication,
 * key exchange data, user authentication, message ID, capabilities, and
 * service tokens. The header is encrypted and signed using a crypto context
 * derived from the entity authentication or master token.
 *
 * The MessageHeader class extends the abstract Header base class and provides
 * serialization (processData) that encrypts header data, signs it, and
 * encodes it with either a master token or entity auth data.
 *
 * @module msg/MessageHeader
 * @see Webpack Module 54449
 */

// === Imports ===
import AsyncExecutor from '../async/AsyncExecutor.js';                   // Module 42979 (r)
import MslEntityAuthException from '../error/MslEntityAuthException.js'; // Module 80760 (l)
import MslError from '../error/MslError.js';                             // Module 36114 (m)
import { NullCryptoContext } from '../crypto/CryptoContext.js';           // Module 43088 (n) - n.f8
import MslKeyExchangeException from '../error/MslKeyExchangeException.js'; // Module 24571 (q)
import { Header } from '../msg/Header.js';                               // Module 48235 (t) - t.fp
import MslConstants from '../util/MslConstants.js';                      // Module 51411 (u)
import MslInternalException from '../error/MslInternalException.js';     // Module 10690 (v)
import MslEncodingException from '../error/MslEncodingException.js';     // Module 6838 (w)
import MslEncoderException from '../error/MslEncoderException.js';       // Module 88257 (x)
import MslCryptoException from '../error/MslCryptoException.js';         // Module 42458 (y)
import HeaderConstants from '../msg/HeaderConstants.js';                  // Module 58511 (A)
import { parseUserIdToken } from '../msg/UserIdTokenParser.js';          // Module 5248 (z) - z.hNb
import { parseServiceToken } from '../msg/ServiceTokenParser.js';        // Module 61693 (B) - B.internal_Exa
// Module 58892 - side-effect import
import { parseUserIdTokenFromData } from '../msg/UserIdTokenCreator.js'; // Module 85065 (C) - C.d2a
import { parseKeyRequestData } from '../msg/KeyRequestDataParser.js';    // Module 59786 (D) - D.WMb
import { parseKeyResponseData } from '../msg/KeyResponseDataParser.js';  // Module 49140 (E) - E.XMb
import MslMessageException from '../error/MslMessageException.js';       // Module 20754 (G)
import { stringifyFn } from '../util/JsonUtil.js';                       // Module 44127 (F)
import { parseMessageCapabilities } from '../msg/MessageCapabilities.js'; // Module 68480 (H) - H.ZMb
import MslUserAuthException from '../error/MslUserAuthException.js';     // Module 88361 (J)
import { isMslException, generateRandomMessageId } from '../error/MslErrorUtil.js'; // Module 32260 (M)


// === Helper Functions ===

/**
 * Get the crypto context for a message based on its authentication data.
 * If a master token is provided, attempts to wrap authentication using
 * the MSL context's decoder map. Otherwise, resolves the entity
 * authentication scheme and creates the appropriate crypto context.
 *
 * @param {Object} mslContext - The MSL context
 * @param {Object} entityAuthData - Entity authentication data (used if no master token)
 * @param {Object} masterToken - Master token (takes priority if provided)
 * @returns {Object} The crypto context for encrypting/signing
 * @throws {MslEntityAuthException} If master token is untrusted
 * @throws {MslKeyExchangeException} If entity auth scheme is unsupported
 */
function getCryptoContext(mslContext, entityAuthData, masterToken) {
    if (masterToken) {
        const wrappedContext = mslContext.decoderMap.wrapAuthentication(masterToken);
        if (wrappedContext) return wrappedContext;

        if (!masterToken.networkResult || !masterToken.fda()) {
            throw new MslEntityAuthException(MslError.jgb, masterToken);
        }
        return new NullCryptoContext(mslContext, masterToken);
    }

    const scheme = entityAuthData.scheme;
    const factory = mslContext.osa(scheme);
    if (!factory) {
        throw new MslKeyExchangeException(MslError.GEa, scheme.name);
    }
    return factory.wrapAuthentication(mslContext, entityAuthData);
}

/**
 * Parse key response data from the header, if present.
 *
 * @param {Object} mslContext - The MSL context
 * @param {Object} keyResponseDataMo - Key response data MslObject
 * @param {Object} callback - Async callback with result/error
 */
function reconstructKeyResponseData(mslContext, keyResponseDataMo, callback) {
    AsyncExecutor(callback, function () {
        if (keyResponseDataMo) {
            parseKeyResponseData(mslContext, keyResponseDataMo, callback);
        } else {
            return null;
        }
    });
}

/**
 * Parse user ID token from the header, if present.
 *
 * @param {Object} mslContext - The MSL context
 * @param {Object} userIdTokenMo - User ID token MslObject
 * @param {Object} masterToken - The associated master token
 * @param {Object} callback - Async callback with result/error
 */
function reconstructUserIdToken(mslContext, userIdTokenMo, masterToken, callback) {
    AsyncExecutor(callback, function () {
        if (userIdTokenMo) {
            parseUserIdTokenFromData(mslContext, userIdTokenMo, masterToken, callback);
        } else {
            return null;
        }
    });
}

/**
 * Parse user authentication data from the header, if present.
 *
 * @param {Object} mslContext - The MSL context
 * @param {Object} masterToken - The associated master token
 * @param {Object} userAuthDataMo - User auth data MslObject
 * @param {Object} callback - Async callback with result/error
 */
function reconstructUserAuthData(mslContext, masterToken, userAuthDataMo, callback) {
    AsyncExecutor(callback, function () {
        if (userAuthDataMo) {
            parseUserIdToken(mslContext, masterToken, userAuthDataMo, callback);
        } else {
            return null;
        }
    });
}

/**
 * Parse all service tokens from the header data.
 * Iterates through the service tokens array, parsing each one and
 * deduplicating by serialized representation.
 *
 * @param {Object} mslContext - The MSL context
 * @param {Object} serviceTokensArray - MslArray of service token objects
 * @param {Object} masterToken - The associated master token
 * @param {Object} userIdToken - The associated user ID token
 * @param {Object} cryptoContext - The crypto context for the message
 * @param {string} headerDataString - Header data string for error messages
 * @param {Object} callback - Async callback with result/error
 */
function reconstructServiceTokens(mslContext, serviceTokensArray, masterToken, userIdToken, cryptoContext, headerDataString, callback) {
    /** @type {Object<string, Object>} Map of serialized token to token object for dedup */
    const tokenMap = {};

    /**
     * Recursively parse service tokens from the array.
     *
     * @param {Object} array - MslArray of service tokens
     * @param {number} index - Current index being processed
     * @param {Object} cb - Async callback
     */
    function parseNext(array, index, cb) {
        AsyncExecutor(cb, function () {
            if (index >= array.size()) {
                const results = [];
                for (const key in tokenMap) {
                    results.push(tokenMap[key]);
                }
                return results;
            }

            let tokenMo;
            try {
                tokenMo = array.authData(index, mslContext.defaultValue);
            } catch (err) {
                if (err instanceof MslEncodingException) {
                    throw new MslEncoderException(MslError.lf, "headerdata " + headerDataString, err);
                }
                throw err;
            }

            parseServiceToken(mslContext, tokenMo, masterToken, userIdToken, cryptoContext, {
                result: function (token) {
                    AsyncExecutor(cb, function () {
                        tokenMap[token.serialize()] = token;
                        parseNext(array, index + 1, cb);
                    });
                },
                error: cb.error
            });
        });
    }

    AsyncExecutor(callback, function () {
        if (serviceTokensArray) {
            parseNext(serviceTokensArray, 0, callback);
        } else {
            return [];
        }
    });
}

/**
 * Parse peer data from the header (stub - returns empty peer data).
 * In the non-peer-to-peer case, peer tokens are not present.
 *
 * @param {Object} mslContext - The MSL context
 * @param {Object} headerDataMo - Parsed header data MslObject
 * @param {Object} keyResponseData - Key response data
 * @param {Object} cryptoContext - The crypto context
 * @param {Object} callback - Async callback with result/error
 */
function reconstructPeerData(mslContext, headerDataMo, keyResponseData, cryptoContext, callback) {
    AsyncExecutor(callback, function () {
        return {
            peerMasterToken: null,
            peerUserIdToken: null,
            peerServiceTokens: []
        };
    });
}

/**
 * Parse key request data items from the header.
 * Iterates through the key request data array, parsing each entry.
 *
 * @param {Object} mslContext - The MSL context
 * @param {Object} headerDataMo - Parsed header data MslObject
 * @param {Object} callback - Async callback with result/error
 */
function reconstructKeyRequestData(mslContext, headerDataMo, callback) {
    /** @type {Array<Object>} Accumulated key request data objects */
    const keyRequests = [];

    /**
     * Recursively parse key request data entries.
     *
     * @param {Object} array - MslArray of key request data
     * @param {number} index - Current index
     * @param {Object} cb - Async callback
     */
    function parseNext(array, index, cb) {
        AsyncExecutor(cb, function () {
            if (index >= array.size()) return keyRequests;

            const requestMo = array.authData(index, mslContext.defaultValue);
            parseKeyRequestData(mslContext, requestMo, {
                result: function (keyRequest) {
                    AsyncExecutor(cb, function () {
                        keyRequests.push(keyRequest);
                        parseNext(array, index + 1, cb);
                    });
                },
                error: cb.error
            });
        });
    }

    AsyncExecutor(callback, function () {
        try {
            if (!headerDataMo.has("keyrequestdata")) return [];

            const keyRequestArray = headerDataMo.YVa("keyrequestdata");
            parseNext(keyRequestArray, 0);
        } catch (err) {
            if (err instanceof MslEncodingException) {
                throw new MslEncoderException(MslError.lf, "headerdata " + headerDataMo, err);
            }
            throw err;
        }
    });
}


// === Data Classes ===

/**
 * Container for message header construction parameters.
 * Holds all the fields that define a message header's content.
 */
class HeaderData {
    /**
     * @param {number} messageId - The message ID
     * @param {?number} nonReplayableId - Non-replayable message ID, or null
     * @param {boolean} renewable - Whether the message is renewable
     * @param {boolean} handshake - Whether this is a handshake message
     * @param {?Object} capabilities - Message capabilities, or null
     * @param {Array<Object>} keyExchangeData - Key exchange request data
     * @param {?Object} keyResponseData - Key exchange response data, or null
     * @param {?Object} userAuthData - User authentication data, or null
     * @param {boolean} isAborted - Whether the message is aborted (user ID token)
     * @param {Array<Object>} serviceTokens - Service tokens
     */
    constructor(messageId, nonReplayableId, renewable, handshake, capabilities, keyExchangeData, keyResponseData, userAuthData, isAborted, serviceTokens) {
        /** @type {number} */
        this.messageId = messageId;
        /** @type {?number} */
        this.nonReplayableId = nonReplayableId;
        /** @type {boolean} */
        this.renewable = renewable;
        /** @type {boolean} */
        this.handshake = handshake;
        /** @type {?Object} */
        this.capabilities = capabilities;
        /** @type {Array<Object>} */
        this.keyExchangeData = keyExchangeData;
        /** @type {?Object} */
        this.keyResponseData = keyResponseData;
        /** @type {?Object} */
        this.userAuthData = userAuthData;
        /** @type {boolean} User ID token */
        this.userIdToken = isAborted;
        /** @type {Array<Object>} */
        this.serviceTokens = serviceTokens;
    }
}

/**
 * Container for peer-related header data (used in peer-to-peer mode).
 */
class HeaderPeerData {
    /**
     * @param {?Object} peerMasterToken - Peer master token, or null
     * @param {?Object} peerUserIdToken - Peer user ID token, or null
     * @param {Array<Object>} peerServiceTokens - Peer service tokens
     */
    constructor(peerMasterToken, peerUserIdToken, peerServiceTokens) {
        /** @type {?Object} */
        this.peerMasterToken = peerMasterToken;
        /** @type {?Object} */
        this.peerUserIdToken = peerUserIdToken;
        /** @type {Array<Object>} */
        this.peerServiceTokens = peerServiceTokens;
    }
}

/**
 * Container for pre-parsed header components used when reconstructing
 * a MessageHeader from encoded bytes.
 */
class ParsedHeaderData {
    /**
     * @param {?Object} userId - The user identity
     * @param {number} timestamp - Timestamp in seconds since epoch
     * @param {Object} cryptoContext - The header crypto context
     * @param {Object} headerDataMo - The parsed header data MslObject
     */
    constructor(userId, timestamp, cryptoContext, headerDataMo) {
        /** @type {?Object} */
        this.userId = userId;
        /** @type {number} */
        this.timestamp = timestamp;
        /** @type {Object} */
        this.cryptoContext = cryptoContext;
        /** @type {Object} */
        this.headerDataMo = headerDataMo;
    }
}


// === MessageHeader Class ===

/**
 * MSL message header. Contains all metadata required for MSL message
 * processing: authentication tokens, encryption parameters, key exchange
 * data, capabilities, and service tokens.
 *
 * The header is serialized by encrypting the header data JSON, signing it,
 * and encoding it alongside the master token or entity auth data.
 *
 * @extends Header
 */
class MessageHeader extends Header {
    /**
     * Create a new MessageHeader, either from construction parameters or
     * by parsing encoded header data.
     *
     * @param {Object} mslContext - The MSL context
     * @param {?Object} entityAuthData - Entity authentication data (null if master token provided)
     * @param {?Object} masterToken - Master token (null if entity auth data provided)
     * @param {Object} headerData - HeaderData with message parameters
     * @param {?Object} peerData - HeaderPeerData for peer mode, or null
     * @param {?Object} parsedData - ParsedHeaderData when reconstructing from bytes, or null
     * @param {Object} callback - Async callback with result/error
     */
    constructor(mslContext, entityAuthData, masterToken, headerData, peerData, parsedData, callback) {
        super();

        /** @type {Object} Cached encodings keyed by encoder format name */
        this.encodings = {};

        const self = this;

        /**
         * Internal initialization after sender identity is resolved.
         * @param {?string} senderIdentity - The sender entity identity, or null
         */
        function initialize(senderIdentity) {
            AsyncExecutor(callback, function () {
                // Validate message ID range
                if (headerData.messageId < 0 || headerData.messageId > MslConstants.kf) {
                    throw new MslInternalException(
                        "Message ID " + headerData.messageId + " is out of range."
                    );
                }

                // Must have either entity auth data or master token
                if (!masterToken && !entityAuthData) {
                    throw new MslInternalException(
                        "Message entity authentication data or master token must be provided."
                    );
                }

                // User auth data requires encrypted message (unless master token present)
                if (!masterToken && !entityAuthData.scheme.bra && headerData.userAuthData) {
                    throw new MslInternalException(
                        "User authentication data cannot be included if the message is not encrypted."
                    );
                }

                // If master token is present, entity auth data is not needed
                const effectiveEntityAuthData = masterToken ? null : entityAuthData;

                const nonReplayableId = headerData.nonReplayableId;
                const renewable = headerData.renewable;
                const handshake = headerData.handshake;
                const capabilities = headerData.capabilities;
                const messageId = headerData.messageId;
                const keyExchangeData = headerData.keyExchangeData ? headerData.keyExchangeData : [];
                const keyResponseData = headerData.keyResponseData;
                const userAuthData = headerData.userAuthData;
                const userIdToken = headerData.userIdToken;
                const serviceTokens = headerData.serviceTokens ? headerData.serviceTokens : [];
                const peerServiceTokens = [];

                // Determine the effective master token (from key response or direct)
                const effectiveMasterToken = keyResponseData ? keyResponseData.mc : masterToken;

                // Validate user ID token binding to master token
                if (userIdToken && (!effectiveMasterToken || !userIdToken.hasStartedCheck(effectiveMasterToken))) {
                    throw new MslInternalException(
                        "User ID token must be bound to a master token."
                    );
                }

                // Validate service token bindings
                serviceTokens.forEach(function (token) {
                    if (token.itemsListProcessor() && (!effectiveMasterToken || !token.hasStartedCheck(effectiveMasterToken))) {
                        throw new MslInternalException(
                            "Master token bound service tokens must be bound to the provided master token."
                        );
                    }
                    if (token.hasStarted() && (!userIdToken || !token.hasStartedCheck(userIdToken))) {
                        throw new MslInternalException(
                            "User ID token bound service tokens must be bound to the provided user ID token."
                        );
                    }
                }, self);

                // Validate peer service token bindings (should be empty in non-p2p)
                peerServiceTokens.forEach(function (token) {
                    if (token.itemsListProcessor()) {
                        throw new MslInternalException(
                            "Master token bound peer service tokens must be bound to the provided peer master token."
                        );
                    }
                    if (token.hasStarted()) {
                        throw new MslInternalException(
                            "User ID token bound peer service tokens must be bound to the provided peer user ID token."
                        );
                    }
                }, self);

                let userId, timestamp, headerDataMo, cryptoContext;

                if (parsedData) {
                    // Reconstructing from parsed data
                    userId = parsedData.userId;
                    timestamp = parsedData.timestamp;
                    headerDataMo = parsedData.headerDataMo;
                    cryptoContext = parsedData.cryptoContext;
                } else {
                    // Constructing a new header
                    userId = userIdToken ? userIdToken.userId : null;
                    timestamp = parseInt(mslContext.getTime() / 1000);

                    try {
                        headerDataMo = mslContext.defaultValue.zf();
                        if (typeof senderIdentity === "string") {
                            headerDataMo.put("sender", senderIdentity);
                        }
                        headerDataMo.put("timestamp", timestamp);
                        headerDataMo.put("messageid", messageId);
                        headerDataMo.put("nonreplayable", typeof nonReplayableId === "number");
                        if (typeof nonReplayableId === "number") {
                            headerDataMo.put("nonreplayableid", nonReplayableId);
                        }
                        headerDataMo.put("renewable", renewable);
                        headerDataMo.put("handshake", handshake);
                        if (capabilities) headerDataMo.put("capabilities", capabilities);
                        if (keyExchangeData.length > 0) headerDataMo.put("keyrequestdata", keyExchangeData);
                        if (keyResponseData) headerDataMo.put("keyresponsedata", keyResponseData);
                        if (userAuthData) headerDataMo.put("userauthdata", userAuthData);
                        if (userIdToken) headerDataMo.put("useridtoken", userIdToken);
                        if (serviceTokens.length > 0) headerDataMo.put("servicetokens", serviceTokens);
                        if (peerServiceTokens.length > 0) headerDataMo.put("peerservicetokens", peerServiceTokens);
                    } catch (err) {
                        if (err instanceof MslEncodingException) {
                            throw new MslEncoderException(MslError.R2b, "headerdata", err)
                                .qc(masterToken).fg(effectiveEntityAuthData).getLength(null).iteratorValue(userAuthData).vi(messageId);
                        }
                        throw err;
                    }

                    try {
                        cryptoContext = getCryptoContext(mslContext, effectiveEntityAuthData, masterToken);
                    } catch (err) {
                        if (isMslException(err)) {
                            err.qc(masterToken);
                            err.fg(effectiveEntityAuthData);
                            err.getLength(userIdToken);
                            err.iteratorValue(userAuthData);
                            err.vi(messageId);
                        }
                        throw err;
                    }
                }

                // Store all fields on the instance
                self.entityAuthData = effectiveEntityAuthData;
                self.masterToken = masterToken;
                self.headerDataMo = headerDataMo;
                self.timestamp = timestamp;
                self.messageId = messageId;
                self.nonReplayableId = nonReplayableId;
                self.renewable = renewable;
                self.handshake = handshake;
                self.messageCapabilities = capabilities;
                self.keyExchangeData = keyExchangeData;
                self.keyResponseData = keyResponseData;
                self.userAuthData = userAuthData;
                self.userIdToken = userIdToken;
                self.serviceTokens = serviceTokens;
                self.peerMasterToken = null;
                self.peerUserIdToken = null;
                self.peerServiceTokens = peerServiceTokens;
                self.userId = userId;
                self.cryptoContext = cryptoContext;
                self.encodings = {};

                return self;
            });
        }

        // Resolve sender identity before initialization
        AsyncExecutor(callback, function () {
            if (parsedData) {
                // When reconstructing, sender is already known
                initialize(null);
            } else if (masterToken) {
                // Get sender identity from MSL context
                mslContext.nsa({
                    result: function (entityInfo) {
                        AsyncExecutor(callback, function () {
                            const identity = entityInfo.getProfileIdentifier();
                            initialize(identity ? identity : "");
                        });
                    },
                    error: callback.error
                });
            } else {
                initialize(null);
            }
        });

        return self;
    }

    /**
     * Get the header timestamp as a Date object.
     *
     * @returns {Date} The timestamp when this header was created
     */
    getTimestamp() {
        return new Date(1000 * this.timestamp);
    }

    /**
     * Check if this message is renewable.
     *
     * @returns {boolean} True if the message is renewable
     */
    isRenewable() {
        return this.renewable;
    }

    /**
     * Check if this is a handshake message.
     *
     * @returns {boolean} True if this is a handshake message
     */
    isHandshake() {
        return this.handshake;
    }

    /**
     * Encode the message header into the specified encoder format.
     * Encrypts the header data, signs it, and packages it with the
     * master token or entity authentication data.
     *
     * @param {Object} encoder - The MSL encoder
     * @param {Object} format - The encoder format
     * @param {Object} callback - Async callback with result/error
     */
    processData(encoder, format, callback) {
        const self = this;

        AsyncExecutor(callback, function () {
            // Return cached encoding if available
            if (self.encodings[format.name]) {
                return self.encodings[format.name];
            }

            // Step 1: Encode the header data
            encoder.cryptoFunction(self.headerDataMo, format, {
                result: function (encodedHeaderData) {
                    AsyncExecutor(callback, function () {
                        // Step 2: Encrypt the header data
                        self.cryptoContext.encrypt(encodedHeaderData, encoder, format, {
                            result: function (ciphertext) {
                                AsyncExecutor(callback, function () {
                                    // Step 3: Sign the encrypted header data
                                    self.cryptoContext.sign(ciphertext, encoder, format, {
                                        result: function (signature) {
                                            AsyncExecutor(callback, function () {
                                                // Step 4: Build the final encoded object
                                                const headerMo = encoder.zf();

                                                if (self.masterToken) {
                                                    headerMo.put(HeaderConstants.internal_Yeb, self.masterToken);
                                                } else {
                                                    headerMo.put(HeaderConstants.hGa, self.entityAuthData);
                                                }

                                                headerMo.put(HeaderConstants.internal_Xeb, ciphertext);
                                                headerMo.put(HeaderConstants.jGa, signature);

                                                // Step 5: Encode the complete header
                                                encoder.cryptoFunction(headerMo, format, {
                                                    result: function (encoded) {
                                                        AsyncExecutor(callback, function () {
                                                            return (self.encodings[format.name] = encoded);
                                                        });
                                                    },
                                                    error: callback.error
                                                });
                                            });
                                        },
                                        error: function (err) {
                                            AsyncExecutor(callback, function () {
                                                if (err instanceof MslCryptoException) {
                                                    err = new MslEncodingException("Error signing the header data.", err);
                                                }
                                                throw err;
                                            });
                                        }
                                    });
                                });
                            },
                            error: function (err) {
                                AsyncExecutor(callback, function () {
                                    if (err instanceof MslCryptoException) {
                                        err = new MslEncodingException("Error encrypting the header data.", err);
                                    }
                                    throw err;
                                });
                            }
                        });
                    });
                },
                error: callback.error
            });
        });
    }
}


// === Factory Functions ===

/**
 * Create a new MessageHeader with the given parameters.
 *
 * @param {Object} mslContext - The MSL context
 * @param {?Object} entityAuthData - Entity authentication data
 * @param {?Object} masterToken - Master token
 * @param {Object} headerData - HeaderData construction parameters
 * @param {?Object} peerData - HeaderPeerData for peer-to-peer mode
 * @param {Object} callback - Async callback with result/error
 */
function createMessageHeader(mslContext, entityAuthData, masterToken, headerData, peerData, callback) {
    new MessageHeader(mslContext, entityAuthData, masterToken, headerData, peerData, null, callback);
}

/**
 * Parse and reconstruct a MessageHeader from encoded header bytes.
 * Verifies the signature, decrypts the header data, and reconstructs
 * all embedded tokens (key response, user ID token, user auth data,
 * service tokens, key request data, and peer data).
 *
 * @param {Object} mslContext - The MSL context
 * @param {Uint8Array} encryptedHeaderData - The encrypted header data bytes
 * @param {Uint8Array} signatureBytes - The header signature bytes
 * @param {?Object} entityAuthData - Entity authentication data
 * @param {?Object} masterToken - Master token
 * @param {Object} cryptoContext - Crypto context for verification
 * @param {Object} callback - Async callback with result/error
 */
function parseMessageHeader(mslContext, encryptedHeaderData, signatureBytes, entityAuthData, masterToken, cryptoContext, callback) {

    /**
     * Parse the initial header fields from decrypted header data and begin
     * reconstruction of embedded tokens.
     *
     * @param {Object} headerCryptoContext - The resolved crypto context
     * @param {Object} headerDataMo - The parsed header data MslObject
     * @param {number} messageId - The message ID
     * @param {?number} timestamp - The timestamp, or null
     * @param {?Object} keyResponseDataMo - Key response data MslObject
     * @param {?Object} userIdTokenMo - User ID token MslObject
     * @param {?Object} userAuthDataMo - User auth data MslObject
     * @param {?Object} serviceTokensArray - Service tokens MslArray
     * @param {Object} cb - Async callback
     */
    function parseHeaderFields(headerCryptoContext, headerDataMo, messageId, timestamp, keyResponseDataMo, userIdTokenMo, userAuthDataMo, serviceTokensArray, cb) {
        AsyncExecutor(cb, function () {
            reconstructKeyResponseData(mslContext, keyResponseDataMo, {
                result: function (keyResponseData) {
                    AsyncExecutor(cb, function () {
                        const effectiveMasterToken = keyResponseData ? keyResponseData.mc : masterToken;

                        reconstructUserIdToken(mslContext, userIdTokenMo, effectiveMasterToken, {
                            result: function (userIdToken) {
                                AsyncExecutor(cb, function () {
                                    reconstructUserAuthData(mslContext, effectiveMasterToken, userAuthDataMo, {
                                        result: function (userAuthData) {
                                            AsyncExecutor(cb, function () {
                                                if (userAuthData) {
                                                    // Verify message is encrypted if user auth data is present
                                                    if (!masterToken && !entityAuthData.scheme.bra) {
                                                        throw new MslMessageException(MslError.I6b)
                                                            .getLength(userIdToken)
                                                            .iteratorValue(userAuthData);
                                                    }

                                                    // Find and invoke the user auth factory
                                                    const scheme = userAuthData.scheme;
                                                    const factory = mslContext.ODb(scheme);
                                                    if (!factory) {
                                                        throw new MslUserAuthException(MslError.fnb, scheme)
                                                            .getLength(userIdToken)
                                                            .iteratorValue(userAuthData);
                                                    }

                                                    factory.ssb(userAuthData, userIdToken, {
                                                        result: function (userId) {
                                                            reconstructServiceTokens(mslContext, serviceTokensArray, effectiveMasterToken, userIdToken, cryptoContext, headerDataMo, {
                                                                result: function (serviceTokens) {
                                                                    assembleHeader(headerCryptoContext, headerDataMo, messageId, timestamp, keyResponseData, userIdToken, userAuthData, userId, serviceTokens, cb);
                                                                },
                                                                error: cb.error
                                                            });
                                                        },
                                                        error: cb.error
                                                    });
                                                } else {
                                                    const userId = userIdToken ? userIdToken.userId : null;

                                                    reconstructServiceTokens(mslContext, serviceTokensArray, effectiveMasterToken, userIdToken, cryptoContext, headerDataMo, {
                                                        result: function (serviceTokens) {
                                                            assembleHeader(headerCryptoContext, headerDataMo, messageId, timestamp, keyResponseData, userIdToken, userAuthData, userId, serviceTokens, cb);
                                                        },
                                                        error: cb.error
                                                    });
                                                }
                                            });
                                        },
                                        error: cb.error
                                    });
                                });
                            },
                            error: cb.error
                        });
                    });
                },
                error: cb.error
            });
        });
    }

    /**
     * Parse the decrypted header data bytes into an MslObject and extract
     * key fields for further processing.
     *
     * @param {Object} headerCryptoContext - The resolved crypto context
     * @param {Uint8Array} decryptedHeaderData - The decrypted header data bytes
     */
    function parseDecryptedHeaderData(headerCryptoContext, decryptedHeaderData) {
        AsyncExecutor(callback, function () {
            const encoder = mslContext.defaultValue;
            let headerDataMo, messageId;

            try {
                headerDataMo = encoder.parseFunction(decryptedHeaderData);
                messageId = headerDataMo.messageIdGetter("messageid");
                if (messageId < 0 || messageId > MslConstants.kf) {
                    throw new MslMessageException(MslError.mgb, "headerdata " + headerDataMo)
                        .qc(masterToken).fg(entityAuthData);
                }
            } catch (err) {
                if (err instanceof MslEncodingException) {
                    throw new MslEncoderException(MslError.lf, "headerdata " + stringifyFn(decryptedHeaderData), err)
                        .qc(masterToken).fg(entityAuthData);
                }
                throw err;
            }

            let timestamp, keyResponseDataMo, userIdTokenMo, userAuthDataMo, serviceTokensArray;
            try {
                timestamp = headerDataMo.has("timestamp") ? headerDataMo.messageIdGetter("timestamp") : null;
                keyResponseDataMo = headerDataMo.has("keyresponsedata") ? headerDataMo.authData("keyresponsedata", encoder) : null;
                userIdTokenMo = headerDataMo.has("useridtoken") ? headerDataMo.authData("useridtoken", encoder) : null;
                userAuthDataMo = headerDataMo.has("userauthdata") ? headerDataMo.authData("userauthdata", encoder) : null;
                serviceTokensArray = headerDataMo.has("servicetokens") ? headerDataMo.YVa("servicetokens") : null;
            } catch (err) {
                if (err instanceof MslEncodingException) {
                    throw new MslEncoderException(MslError.lf, "headerdata " + headerDataMo, err)
                        .qc(masterToken).fg(entityAuthData).vi(messageId);
                }
                throw err;
            }

            // Wrap error callback to annotate exceptions with context
            const originalCallback = callback;
            callback = {
                result: originalCallback.result,
                error: function (err) {
                    if (isMslException(err)) {
                        err.qc(masterToken);
                        err.fg(entityAuthData);
                        err.vi(messageId);
                    }
                    originalCallback.error(err);
                }
            };

            parseHeaderFields(headerCryptoContext, headerDataMo, messageId, timestamp, keyResponseDataMo, userIdTokenMo, userAuthDataMo, serviceTokensArray, callback);
        });
    }

    /**
     * Assemble the final MessageHeader from all reconstructed components.
     *
     * @param {Object} headerCryptoContext - The resolved crypto context
     * @param {Object} headerDataMo - The parsed header data MslObject
     * @param {number} messageId - The message ID
     * @param {?number} timestamp - The timestamp, or null
     * @param {?Object} keyResponseData - Reconstructed key response data
     * @param {?Object} userIdToken - Reconstructed user ID token
     * @param {?Object} userAuthData - Reconstructed user auth data
     * @param {?Object} userId - The resolved user identity
     * @param {Array<Object>} serviceTokens - Reconstructed service tokens
     * @param {Object} cb - Async callback
     */
    function assembleHeader(headerCryptoContext, headerDataMo, messageId, timestamp, keyResponseData, userIdToken, userAuthData, userId, serviceTokens, cb) {
        AsyncExecutor(cb, function () {
            const encoder = mslContext.defaultValue;

            let nonReplayableId, renewable, handshake, capabilities;
            try {
                nonReplayableId = headerDataMo.has("nonreplayableid") ? headerDataMo.messageIdGetter("nonreplayableid") : null;
                renewable = headerDataMo.getBoolean("renewable");
                handshake = headerDataMo.has("handshake") ? headerDataMo.getBoolean("handshake") : false;

                if (nonReplayableId < 0 || nonReplayableId > MslConstants.kf) {
                    throw new MslMessageException(MslError.thb, "headerdata " + headerDataMo.toString());
                }

                capabilities = null;
                if (headerDataMo.has("capabilities")) {
                    const capsMo = headerDataMo.authData("capabilities", encoder);
                    capabilities = parseMessageCapabilities(capsMo);
                }
            } catch (err) {
                if (err instanceof MslEncodingException) {
                    throw new MslEncoderException(MslError.lf, "headerdata " + headerDataMo.toString(), err)
                        .qc(masterToken).fg(entityAuthData).getLength(userIdToken).iteratorValue(userAuthData).vi(messageId);
                }
                throw err;
            }

            // Parse key request data
            reconstructKeyRequestData(mslContext, headerDataMo, {
                result: function (keyRequestData) {
                    // Reconstruct peer data
                    reconstructPeerData(mslContext, headerDataMo, keyResponseData, cryptoContext, {
                        result: function (peerData) {
                            AsyncExecutor(cb, function () {
                                const peerMasterToken = peerData.peerMasterToken;
                                const peerUserIdToken = peerData.peerUserIdToken;
                                const peerServiceTokens = peerData.peerServiceTokens;

                                const hdrData = new HeaderData(messageId, nonReplayableId, renewable, handshake, capabilities, keyRequestData, keyResponseData, userAuthData, userIdToken, serviceTokens);
                                const hdrPeerData = new HeaderPeerData(peerMasterToken, peerUserIdToken, peerServiceTokens);
                                const parsed = new ParsedHeaderData(userId, timestamp, headerCryptoContext, headerDataMo);

                                new MessageHeader(mslContext, entityAuthData, masterToken, hdrData, hdrPeerData, parsed, cb);
                            });
                        },
                        error: cb.error
                    });
                },
                error: function (err) {
                    AsyncExecutor(cb, function () {
                        if (isMslException(err)) {
                            err.getLength(userIdToken);
                            err.iteratorValue(userAuthData);
                        }
                        throw err;
                    });
                }
            });
        });
    }

    // === Main parse flow ===
    AsyncExecutor(callback, function () {
        const encoder = mslContext.defaultValue;

        // Normalize: if master token is present, entity auth data is unused
        entityAuthData = masterToken ? null : entityAuthData;

        if (!entityAuthData && !masterToken) {
            throw new MslMessageException(MslError.bHa);
        }

        // Resolve the crypto context for this header
        let headerCryptoContext;
        try {
            headerCryptoContext = getCryptoContext(mslContext, entityAuthData, masterToken);
        } catch (err) {
            if (isMslException(err)) {
                err.qc(masterToken);
                err.fg(entityAuthData);
            }
            throw err;
        }

        // Verify the signature
        headerCryptoContext.verify(encryptedHeaderData, signatureBytes, encoder, {
            result: function (verified) {
                AsyncExecutor(callback, function () {
                    if (!verified) {
                        if (masterToken) {
                            throw new MslCryptoException(MslError.J2b);
                        }
                        throw new MslCryptoException(MslError.G2b);
                    }

                    // Decrypt the header data
                    headerCryptoContext.decrypt(encryptedHeaderData, encoder, {
                        result: function (decryptedData) {
                            parseDecryptedHeaderData(headerCryptoContext, decryptedData);
                        },
                        error: function (err) {
                            AsyncExecutor(callback, function () {
                                if (err instanceof MslCryptoException || err instanceof MslKeyExchangeException) {
                                    err.qc(masterToken);
                                    err.fg(entityAuthData);
                                }
                                throw err;
                            });
                        }
                    });
                });
            },
            error: function (err) {
                AsyncExecutor(callback, function () {
                    if (err instanceof MslCryptoException || err instanceof MslKeyExchangeException) {
                        err.qc(masterToken);
                        err.fg(entityAuthData);
                    }
                    throw err;
                });
            }
        });
    });
}


// === Exports ===
export {
    MessageHeader,            // b.wX
    HeaderData,               // b.MessageHeader
    HeaderPeerData,           // b.MessageCapabilities
    ParsedHeaderData,         // b.s_b
    createMessageHeader,      // b.SZ
    parseMessageHeader        // b.$Mb
};
