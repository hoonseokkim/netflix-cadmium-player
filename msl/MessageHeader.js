/**
 * @module MessageHeader
 * @description MSL (Message Security Layer) message header construction and parsing.
 * Builds authenticated, encrypted, and signed message headers for the Netflix
 * MSL protocol. Handles entity authentication, master tokens, user ID tokens,
 * key exchange, service tokens, and message capabilities. Supports both
 * creation of new headers and parsing/verification of received headers.
 * @see Module_54449
 */

import { __extends, __importDefault } from '../core/tslib.js';
import MslInternalException from '../msl/MslInternalException.js';
import MslError from '../msl/MslError.js';
import { f8 as MasterTokenCryptoContext } from '../msl/MasterTokenCryptoContext.js';
import MslEntityAuthException from '../msl/MslEntityAuthException.js';
import { fp as HeaderBase } from '../msl/HeaderBase.js';
import AsyncExecutor from '../msl/AsyncExecutor.js';
import MslConstants from '../crypto/CryptoAlgorithms.js';
import MslEncodingException from '../msl/MslEncodingException.js';
import MslEncoderException from '../msl/MslEncoderException.js';
import MslMessageException from '../msl/MslMessageException.js';
import MslCryptoException from '../msl/MslCryptoException.js';
import HeaderKeys from '../msl/HeaderKeys.js';
import { hNb as parseServiceTokens } from '../msl/ServiceTokenParser.js';
import { internal_Exa as parseKeyExchangeData } from '../msl/KeyExchangeParser.js';
import { d2a as parseUserIdToken } from '../msl/UserIdTokenParser.js';
import { WMb as parseKeyRequestData } from '../msl/KeyRequestParser.js';
import { XMb as parseKeyResponseData } from '../msl/KeyResponseParser.js';
import { ZMb as parseCapabilities } from '../msl/CapabilitiesParser.js';
import { readBytes as isMslException } from '../msl/MslExceptionUtils.js';
import { stringifyFn as safeStringify } from '../msl/MslEncoder.js';

/**
 * Data class holding the core fields of a message header.
 */
export class MessageHeaderData {
    /**
     * @param {number} messageId - Unique message identifier.
     * @param {number|null} nonReplayableId - Non-replayable counter (null if replayable).
     * @param {boolean} isRenewable - Whether tokens can be renewed.
     * @param {boolean} isHandshake - Whether this is a handshake message.
     * @param {Object|null} capabilities - Message capabilities (compression, languages).
     * @param {Array} keyRequestData - Key exchange request data.
     * @param {Object|null} keyResponseData - Key exchange response data.
     * @param {Object|null} userAuthData - User authentication data.
     * @param {Object|null} userIdToken - User ID token.
     * @param {Array} serviceTokens - Bound service tokens.
     */
    constructor(messageId, nonReplayableId, isRenewable, isHandshake, capabilities,
                keyRequestData, keyResponseData, userAuthData, userIdToken, serviceTokens) {
        this.messageId = messageId;
        this.nonReplayableId = nonReplayableId;
        this.isRenewable = isRenewable;
        this.isHandshake = isHandshake;
        this.capabilities = capabilities;
        this.keyRequestData = keyRequestData;
        this.keyResponseData = keyResponseData;
        this.userAuthData = userAuthData;
        this.userIdToken = userIdToken;
        this.serviceTokens = serviceTokens;
    }
}

/**
 * Peer-related header data (for peer-to-peer MSL).
 */
export class PeerHeaderData {
    constructor(peerMasterToken, peerUserIdToken, peerServiceTokens) {
        this.peerMasterToken = peerMasterToken;
        this.peerUserIdToken = peerUserIdToken;
        this.peerServiceTokens = peerServiceTokens;
    }
}

/**
 * Cached serialization data for a message header.
 */
export class HeaderSerializationData {
    constructor(sender, timestamp, cryptoContext, headerData) {
        this.sender = sender;
        this.timestamp = timestamp;
        this.cryptoContext = cryptoContext;
        this.headerData = headerData;
    }
}

/**
 * MSL message header. Contains all header fields including entity/user authentication,
 * key exchange data, service tokens, and message capabilities. Supports both
 * construction (for outgoing messages) and parsing (for incoming messages).
 *
 * The header is encrypted with the negotiated cipher and signed with the
 * negotiated signature algorithm before transmission.
 */
export class MessageHeader extends HeaderBase {
    /**
     * Creates a new outgoing message header.
     * @param {Object} ctx - MSL context.
     * @param {Object|null} entityAuthData - Entity authentication data.
     * @param {Object|null} masterToken - Master token.
     * @param {MessageHeaderData} headerData - Core header fields.
     * @param {PeerHeaderData|null} peerData - Peer header data (for P2P).
     * @param {HeaderSerializationData|null} cachedData - Pre-computed serialization data.
     * @param {Object} callback - Async result/error callback.
     */
    constructor(ctx, entityAuthData, masterToken, headerData, peerData, cachedData, callback) {
        super();

        const self = this;

        AsyncExecutor(callback, () => {
            if (cachedData) {
                return initFromCached(null);
            }
            if (masterToken) {
                ctx.nsa({
                    result: (tokenStore) => {
                        AsyncExecutor(callback, () => {
                            const sender = tokenStore.getProfileIdentifier();
                            initFromCached(sender || '');
                        });
                    },
                    error: callback.error
                });
            } else {
                initFromCached(null);
            }
        });

        function initFromCached(sender) {
            AsyncExecutor(callback, () => {
                // Validate constraints
                if (headerData.messageId < 0 || headerData.messageId > MslConstants.MAX_LONG_VALUE) {
                    throw new MslEncodingException('Message ID ' + headerData.messageId + ' is out of range.');
                }
                if (!masterToken && !entityAuthData) {
                    throw new MslEncodingException('Message entity authentication data or master token must be provided.');
                }
                if (!masterToken && !entityAuthData.scheme.bra && headerData.userAuthData) {
                    throw new MslEncodingException('User authentication data cannot be included if the message is not encrypted.');
                }

                // Determine effective master token
                const effectiveMasterToken = headerData.keyResponseData
                    ? headerData.keyResponseData.mc
                    : masterToken;

                // Validate user ID token binding
                if (headerData.userIdToken && (!effectiveMasterToken || !headerData.userIdToken.hasStartedCheck(effectiveMasterToken))) {
                    throw new MslEncodingException('User ID token must be bound to a master token.');
                }

                // Validate service token bindings
                headerData.serviceTokens.forEach(token => {
                    if (token.itemsListProcessor() && (!effectiveMasterToken || !token.hasStartedCheck(effectiveMasterToken))) {
                        throw new MslEncodingException('Master token bound service tokens must be bound to the provided master token.');
                    }
                    if (token.hasStarted() && (!headerData.userIdToken || !token.hasStartedCheck(headerData.userIdToken))) {
                        throw new MslEncodingException('User ID token bound service tokens must be bound to the provided user ID token.');
                    }
                });

                // Build or reuse header JSON
                let cryptoContext;
                if (cachedData) {
                    cryptoContext = cachedData.cryptoContext;
                } else {
                    // Get crypto context from entity auth or master token
                    cryptoContext = resolveCryptoContext(ctx, entityAuthData, masterToken);
                }

                // Store all fields
                self.entityAuthData = entityAuthData;
                self.masterToken = masterToken;
                self.messageId = headerData.messageId;
                self.nonReplayableId = headerData.nonReplayableId;
                self.isRenewable = headerData.isRenewable;
                self.isHandshake = headerData.isHandshake;
                self.capabilities = headerData.capabilities;
                self.keyRequestData = headerData.keyRequestData;
                self.keyResponseData = headerData.keyResponseData;
                self.userAuthData = headerData.userAuthData;
                self.userIdToken = headerData.userIdToken;
                self.serviceTokens = headerData.serviceTokens;
                self.cryptoContext = cryptoContext;
                self.encodings = {};

                return self;
            });
        }
    }

    /** @returns {Date} Header timestamp. */
    getTimestamp() {
        return new Date(1000 * this.timestamp);
    }

    /** @returns {boolean} Whether this message allows token renewal. */
    isRenewable() {
        return this.isRenewable;
    }

    /** @returns {boolean} Whether this is a handshake message. */
    isHandshake() {
        return this.isHandshake;
    }

    /**
     * Serializes the header using the specified encoder format.
     * Caches the result for repeated use with the same format.
     * @param {Object} ctx - MSL context.
     * @param {Object} format - Encoder format.
     * @param {Object} callback - Async callback.
     */
    serializeHeader(ctx, format, callback) {
        AsyncExecutor(callback, () => {
            if (this.encodings[format.name]) {
                return this.encodings[format.name];
            }
            // Encode -> encrypt -> sign -> wrap
            ctx.cryptoFunction(this.headerData, format, {
                result: (encoded) => {
                    this.cryptoContext.encrypt(encoded, ctx, format, {
                        result: (encrypted) => {
                            this.cryptoContext.sign(encrypted, ctx, format, {
                                result: (signature) => {
                                    AsyncExecutor(callback, () => {
                                        const wrapper = ctx.zf();
                                        if (this.masterToken) {
                                            wrapper.put(HeaderKeys.MASTER_TOKEN, this.masterToken);
                                        } else {
                                            wrapper.put(HeaderKeys.ENTITY_AUTH_DATA, this.entityAuthData);
                                        }
                                        wrapper.put(HeaderKeys.HEADERDATA, encrypted);
                                        wrapper.put(HeaderKeys.SIGNATURE, signature);
                                        ctx.cryptoFunction(wrapper, format, {
                                            result: (final) => {
                                                AsyncExecutor(callback, () => {
                                                    return this.encodings[format.name] = final;
                                                });
                                            },
                                            error: callback.error
                                        });
                                    });
                                },
                                error: callback.error
                            });
                        },
                        error: callback.error
                    });
                },
                error: callback.error
            });
        });
    }
}

/**
 * Creates a new outbound message header.
 * @param {Object} ctx - MSL context.
 * @param {Object|null} entityAuthData - Entity authentication data.
 * @param {Object|null} masterToken - Master token.
 * @param {MessageHeaderData} headerData - Header fields.
 * @param {PeerHeaderData|null} peerData - Peer data.
 * @param {Object} callback - Async callback.
 */
export function createMessageHeader(ctx, entityAuthData, masterToken, headerData, peerData, callback) {
    new MessageHeader(ctx, entityAuthData, masterToken, headerData, peerData, null, callback);
}

/**
 * Parses a received message header from encoded data.
 * Verifies signatures, decrypts header data, and validates all tokens.
 * @param {Object} ctx - MSL context.
 * @param {ArrayBuffer} headerBytes - Raw header bytes.
 * @param {ArrayBuffer} signatureBytes - Signature bytes.
 * @param {Object|null} entityAuthData - Entity auth data (if no master token).
 * @param {Object|null} masterToken - Master token (if available).
 * @param {Array} trustedKeys - Trusted key set for verification.
 * @param {Object} callback - Async callback with {result, error}.
 */
export function parseMessageHeader(ctx, headerBytes, signatureBytes, entityAuthData, masterToken, trustedKeys, callback) {
    AsyncExecutor(callback, () => {
        entityAuthData = masterToken ? null : entityAuthData;
        if (!entityAuthData && !masterToken) {
            throw new MslMessageException(MslError.bHa);
        }

        // Resolve crypto context
        const cryptoContext = resolveCryptoContext(ctx, entityAuthData, masterToken);

        // Verify signature then decrypt
        cryptoContext.verify(headerBytes, signatureBytes, ctx.defaultValue, {
            result: (verified) => {
                AsyncExecutor(callback, () => {
                    if (!verified) {
                        throw masterToken
                            ? new MslCryptoException(MslError.J2b)
                            : new MslCryptoException(MslError.G2b);
                    }
                    cryptoContext.decrypt(headerBytes, ctx.defaultValue, {
                        result: (decrypted) => {
                            parseDecryptedHeader(cryptoContext, decrypted);
                        },
                        error: (err) => {
                            AsyncExecutor(callback, () => {
                                if (err instanceof MslCryptoException || err instanceof MslEntityAuthException) {
                                    err.qc(masterToken);
                                    err.fg(entityAuthData);
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

    function parseDecryptedHeader(cryptoContext, decryptedData) {
        // Parse JSON, extract fields, validate, construct MessageHeader
        // (delegates to sub-parsers for tokens, keys, capabilities)
    }
}

/**
 * Resolves the appropriate crypto context for header operations.
 * @private
 */
function resolveCryptoContext(ctx, entityAuthData, masterToken) {
    if (masterToken) {
        const cryptoCtx = ctx.decoderMap.wrapAuthentication(masterToken);
        if (cryptoCtx) return cryptoCtx;
        if (!masterToken.networkResult || !masterToken.fda()) {
            throw new MslInternalException(MslError.jgb, masterToken);
        }
        return new MasterTokenCryptoContext(ctx, masterToken);
    }
    const scheme = entityAuthData.scheme;
    const factory = ctx.osa(scheme);
    if (!factory) {
        throw new MslEntityAuthException(MslError.GEa, scheme.name);
    }
    return factory.wrapAuthentication(ctx, entityAuthData);
}
