/**
 * Netflix Cadmium Player - MSL Message Input Stream
 *
 * Implements the MSL (Message Security Layer) input stream for reading
 * authenticated and encrypted messages from Netflix's custom protocol.
 * Handles key exchange, header verification, payload chunk reading,
 * and master token renewal.
 *
 * @module msl/MessageInputStream
 * @see Webpack Module 34801
 */

// === Imports ===
import AsyncExecutor from '../async/AsyncExecutor.js';              // Module 42979 - async error-safe executor
import SyncAsyncExecutor from '../async/SyncAsyncExecutor.js';      // Module 79804 - sync/async callback executor
import { CryptoContext } from '../crypto/CryptoContext.js';          // Module 43088 - crypto context
import MslException from '../error/MslException.js';                // Module 35661 - MSL exception base
import MslError from '../error/MslError.js';                        // Module 36114 - MSL error codes
import MslEncoderException from '../error/MslEncoderException.js';  // Module 88257 - encoder exception
import MslEncodingException from '../error/MslEncodingException.js'; // Module 6838 - encoding exception
import { BaseInputStream } from '../io/BaseInputStream.js';         // Module 53389 - base input stream
import { parseHeader } from '../msg/HeaderParser.js';               // Module 58511 - header parsing
import { ErrorHeader } from '../msg/ErrorHeader.js';                // Module 70390 - error header
import { Semaphore } from '../util/Semaphore.js';                   // Module 89752 - async semaphore
import MslMessageException from '../error/MslMessageException.js';  // Module 20754 - message-level exception
import MslEntityAuthException from '../error/MslEntityAuthException.js'; // Module 80760
import MslUserAuthException from '../error/MslUserAuthException.js'; // Module 67609
import MslInternalException from '../error/MslInternalException.js'; // Module 10690
import { parsePayloadChunk } from '../msg/PayloadChunkParser.js';   // Module 42296 - payload chunk parsing
import MslIoException from '../error/MslIoException.js';            // Module 48795 - I/O exception
import { MessageHeader } from '../msg/MessageHeader.js';            // Module 54449 - message header
import { isMslException } from '../error/MslErrorUtil.js';          // Module 32260 - MSL error type check


/**
 * Authenticate a key exchange response by iterating through available
 * key exchange schemes to find a matching authentication factory.
 *
 * Tries each scheme in order; if one fails with an MSL error, the next
 * scheme is attempted. Non-MSL errors propagate immediately.
 *
 * @param {MslContext} mslContext - The MSL context providing crypto and factory access
 * @param {MessageHeader} messageHeader - The message header containing key response data
 * @param {Array<KeyRequestData>} keyExchangeSchemes - Ordered list of key exchange schemes to try
 * @param {Object} callbacks - Async callbacks { result, error }
 * @returns {CryptoContext|null} The authenticated crypto context, or null if no key response data
 */
function authenticateKeyResponse(mslContext, messageHeader, keyExchangeSchemes, callbacks) {
    AsyncExecutor(callbacks, function () {
        const masterToken = messageHeader.masterToken;
        const keyResponseData = messageHeader.keyResponseData;

        // No key response data means nothing to authenticate
        if (!keyResponseData) {
            return null;
        }

        const keyResponseMasterToken = keyResponseData.masterToken;

        // If the key response master token is already decrypted/verified,
        // create a crypto context directly from it
        if (keyResponseMasterToken.isDecrypted()) {
            return new CryptoContext(mslContext, keyResponseMasterToken);
        }

        const keyExchangeScheme = keyResponseData.scheme;
        const keyExchangeFactory = mslContext.getKeyExchangeFactory(keyExchangeScheme);

        if (!keyExchangeFactory) {
            throw new MslException(MslError.KEYX_FACTORY_NOT_FOUND, keyExchangeScheme);
        }

        let schemeIndex = 0;
        let lastError = null;

        /**
         * Recursively try the next key exchange scheme in the list.
         */
        function tryNextScheme() {
            AsyncExecutor(callbacks, function () {
                if (schemeIndex >= keyExchangeSchemes.length) {
                    if (lastError) {
                        throw lastError;
                    }
                    throw new MslException(MslError.KEYX_RESPONSE_UNVERIFIABLE, keyExchangeSchemes);
                }

                const scheme = keyExchangeSchemes[schemeIndex];

                if (keyExchangeScheme !== scheme.scheme) {
                    ++schemeIndex;
                    tryNextScheme();
                } else {
                    keyExchangeFactory.generateResponse(mslContext, scheme, keyResponseData, masterToken, {
                        result: callbacks.result,
                        error: function (err) {
                            AsyncExecutor(callbacks, function () {
                                if (!isMslException(err)) {
                                    throw err;
                                }
                                lastError = err;
                                ++schemeIndex;
                                tryNextScheme();
                            });
                        }
                    });
                }
            });
        }

        tryNextScheme();
    });
}


/**
 * Annotate an MSL error with message header context fields for debugging.
 *
 * Attaches master token, entity auth data, user ID token, user auth data,
 * and message ID to the error object if it is an MSL exception.
 *
 * @param {Error} error - The error to annotate
 * @param {MessageHeader} header - The message header providing context
 * @param {'full'|'partial'} [type='full'] - 'full' includes entityAuthData; 'partial' omits it
 */
function annotateError(error, header, type = 'full') {
    if (!isMslException(error)) return;

    error.setMasterToken(header.masterToken);

    if (type === 'full') {
        error.setEntityAuthData(header.entityAuthData);
    }

    error.setUserIdToken(header.userIdToken);
    error.setUserAuthData(header.userAuthData);
    error.setMessageId(header.messageId);
}


/**
 * MSL Message Input Stream.
 *
 * Reads MSL messages from an underlying transport stream. Handles header
 * parsing, key exchange authentication, payload chunk decryption, sequence
 * number validation, mark/reset buffering, and stream lifecycle management.
 *
 * The constructor is asynchronous: it starts reading and parsing the message
 * header immediately. Callers should use {@link isReady} or wait for the
 * ready semaphore before reading payload data.
 *
 * @extends BaseInputStream
 */
class MessageInputStream extends BaseInputStream {
    /**
     * Create a new MessageInputStream.
     *
     * Immediately begins reading from the transport to parse the message header,
     * authenticate key exchange, and verify entity/user authentication.
     *
     * @param {MslContext} mslContext - The MSL context for crypto operations
     * @param {InputStream} transport - The underlying transport input stream
     * @param {Array<KeyRequestData>} keyExchangeSchemes - Supported key exchange schemes
     * @param {Object<string, CryptoContext>} cryptoContexts - Map of crypto contexts by key ID
     * @param {TokenFactory} tokenFactory - Token factory for creating/verifying tokens
     * @param {Object} callbacks - Async callbacks { result, timeout, error }
     */
    constructor(mslContext, transport, keyExchangeSchemes, cryptoContexts, tokenFactory, callbacks) {
        super();

        /** @type {MslContext} MSL context for crypto and key exchange */
        this.mslContext = mslContext;

        /** @type {InputStream} Underlying transport stream */
        this.transport = transport;

        /** @type {number} Expected next payload sequence number (starts at 1) */
        this._payloadSequenceNumber = 1;

        /** @type {boolean} Whether end-of-message has been reached */
        this._endOfMessage = false;

        /** @type {boolean} Whether this stream operates in handshake-only mode */
        this._handshakeOnly = false;

        /** @type {boolean} Whether mark/reset buffering is currently active */
        this._markActive = false;

        /** @type {Array<Uint8Array>} Buffer of payload data chunks for mark/reset replay */
        this._payloadBuffer = [];

        /** @type {number} Read-ahead index into _payloadBuffer (-1 = not replaying) */
        this._readAheadIndex = -1;

        /** @type {number} Current byte offset within the current payload data chunk */
        this._currentOffset = 0;

        /** @type {number} Saved byte offset for mark/reset restoration */
        this._savedOffset = 0;

        /** @type {number} Mark read limit in bytes (-1 = unlimited, 0 = initial) */
        this._markReadLimit = 0;

        /** @type {number} Bytes read since mark was set */
        this._bytesReadSinceMark = 0;

        /** @type {boolean} Whether header parsing and initialization is complete */
        this._initialized = false;

        /** @type {Semaphore} Signals when initialization is done */
        this._readySemaphore = new Semaphore();

        /** @type {boolean} Whether the stream has been aborted */
        this._aborted = false;

        /** @type {boolean} Whether a timeout occurred during initialization */
        this._timedOut = false;

        /** @private @type {MessageHeader|ErrorHeader|undefined} The parsed header */
        this._header = undefined;

        /** @private @type {CryptoContext|null} Crypto context from key exchange response */
        this._keyResponseCryptoContext = null;

        /** @private @type {CryptoContext|null} Active crypto context for payload decryption */
        this._payloadCryptoContext = null;

        /** @private @type {MslTokenizer|undefined} The tokenizer for reading MSL objects */
        this._tokenizer = undefined;

        /** @private @type {Error|null} Error that occurred during initialization */
        this._initError = null;

        /** @private @type {Uint8Array|null|undefined} Current payload data chunk being read */
        this._currentPayloadData = undefined;

        /** @private @type {boolean|null|undefined} Cached handshake detection result */
        this._isHandshakeMessage = undefined;

        /** @private @type {Error|null} Deferred error from a partial payload read */
        this._deferredError = null;

        const self = this;

        // ----------------------------------------------------------------
        // Initialization chain: tokenizer -> header -> key exchange -> verification
        // ----------------------------------------------------------------

        /**
         * Signal that initialization is complete and unblock any waiters.
         */
        function completeInit() {
            self._initialized = true;
            self._readySemaphore.signal(true);
        }

        /**
         * Called when the MSL tokenizer is ready. Checks for data and reads the header.
         * @param {MslTokenizer} tokenizer - The MSL tokenizer for this stream
         */
        function onTokenizerReady(tokenizer) {
            SyncAsyncExecutor(callbacks, function () {
                self._tokenizer = tokenizer;

                self._tokenizer.hasMore({
                    result: function (hasMore) {
                        if (hasMore) {
                            readHeader();
                        } else {
                            self._initError = new MslEncoderException(MslError.MESSAGE_DATA_MISSING);
                            completeInit();
                        }
                    },
                    timeout: function () {
                        self._timedOut = true;
                        completeInit();
                    },
                    error: function (err) {
                        if (err instanceof MslEncodingException) {
                            err = new MslEncoderException(MslError.MSL_PARSE_ERROR, 'header', err);
                        }
                        self._initError = err;
                        completeInit();
                    }
                });

                return self;
            });
        }

        /**
         * Read and parse the message header object from the tokenizer.
         */
        function readHeader() {
            self._tokenizer.nextObject({
                result: function (headerObject) {
                    parseHeader(mslContext, headerObject, cryptoContexts, {
                        result: onHeaderParsed,
                        error: function (err) {
                            self._initError = err;
                            completeInit();
                        }
                    });
                },
                timeout: function () {
                    self._timedOut = true;
                    completeInit();
                },
                error: function (err) {
                    if (err instanceof MslEncodingException) {
                        err = new MslEncoderException(MslError.MSL_PARSE_ERROR, 'header', err);
                    }
                    self._initError = err;
                    completeInit();
                }
            });
        }

        /**
         * Process the parsed header. If it is an error header, finish immediately.
         * Otherwise, authenticate key exchange and verify the message.
         * @param {MessageHeader|ErrorHeader} header - The parsed header
         */
        function onHeaderParsed(header) {
            self._header = header;

            // Error headers have no payloads to process
            if (self._header instanceof ErrorHeader) {
                self._keyResponseCryptoContext = null;
                self._payloadCryptoContext = null;
                completeInit();
                return;
            }

            const msgHeader = self._header;

            // Authenticate the key exchange response
            authenticateKeyResponse(mslContext, msgHeader, keyExchangeSchemes, {
                result: function (cryptoContext) {
                    try {
                        self._keyResponseCryptoContext = cryptoContext;
                        self._payloadCryptoContext = self._keyResponseCryptoContext
                            ? self._keyResponseCryptoContext
                            : msgHeader.cryptoContext;

                        try {
                            // Handshake messages must be renewable and have key request data
                            if (msgHeader.isHandshake() && (!msgHeader.isRenewable() || msgHeader.keyRequestData.length === 0)) {
                                throw new MslMessageException(MslError.INCOMPLETE_NONREPLAYABLE_MESSAGE, msgHeader);
                            }

                            try {
                                const masterToken = msgHeader.masterToken;
                                if (masterToken && masterToken.isVerified) {
                                    verifyEntityAuthentication(mslContext, msgHeader);
                                } else {
                                    verifyMessageSequenceNumber(mslContext, msgHeader);
                                }
                            } catch (err) {
                                if (isMslException(err)) {
                                    err.setMasterToken(msgHeader.masterToken);
                                    err.setEntityAuthData(msgHeader.userIdToken);
                                    err.setUserIdToken(msgHeader.userAuthData);
                                    err.setUserAuthData(msgHeader.messageId);
                                }
                                self._initError = err;
                                completeInit();
                            }
                        } catch (err) {
                            annotateError(err, msgHeader);
                            self._initError = err;
                            completeInit();
                        }
                    } catch (err) {
                        annotateError(err, msgHeader);
                        self._initError = err;
                        completeInit();
                    }
                },
                error: function (err) {
                    annotateError(err, msgHeader);
                    self._initError = err;
                    completeInit();
                }
            });
        }

        /**
         * Verify the message sequence number against the token store.
         * @param {MslContext} ctx - MSL context
         * @param {MessageHeader} header - The message header
         */
        function verifyMessageSequenceNumber(ctx, header) {
            const masterToken = header.masterToken;
            const messageSequenceNumber = header.nonReplayableId;

            if (typeof messageSequenceNumber === 'number') {
                if (masterToken) {
                    // NOTE: Original code references (null).checkSequenceNumber - dead code path
                    (null).checkSequenceNumber(ctx, masterToken, messageSequenceNumber, {
                        result: function (err) {
                            if (err) {
                                self._initError = new MslMessageException(err, header)
                                    .setMasterToken(masterToken)
                                    .setUserIdToken(header.userIdToken)
                                    .setUserAuthData(header.userAuthData)
                                    .setMessageId(header.messageId);
                            }
                            completeInit();
                        },
                        error: function (err) {
                            if (isMslException(err)) {
                                err.setMasterToken(masterToken);
                                err.setUserIdToken(header.userIdToken);
                                err.setUserAuthData(header.userAuthData);
                                err.setMessageId(header.messageId);
                            }
                            self._initError = err;
                            completeInit();
                        }
                    });
                } else {
                    self._initError = new MslMessageException(MslError.MESSAGE_REPLAYED_UNRECOVERABLE, header)
                        .setEntityAuthData(header.entityAuthData)
                        .setUserIdToken(header.userIdToken)
                        .setUserAuthData(header.userAuthData)
                        .setMessageId(header.messageId);
                    completeInit();
                }
            } else {
                completeInit();
            }
        }

        /**
         * Verify master token renewal for expired tokens.
         * @param {MslContext} ctx - MSL context
         * @param {MessageHeader} header - The message header
         */
        function verifyMasterTokenRenewal(ctx, header) {
            const masterToken = header.masterToken;
            try {
                if (masterToken.isExpired(null)) {
                    if (header.isRenewable()) {
                        if (header.keyRequestData.length === 0) {
                            // Expired master token, not renewable, no key request data
                            self._initError = new MslMessageException(MslError.MASTERTOKEN_EXPIRED_NOT_RENEWABLE, header)
                                .setMasterToken(masterToken)
                                .setUserIdToken(header.userIdToken)
                                .setUserAuthData(header.userAuthData)
                                .setMessageId(header.messageId);
                            completeInit();
                        } else {
                            // NOTE: Original code references (null).isMasterTokenRenewable - dead code path
                            (null).isMasterTokenRenewable(ctx, masterToken, {
                                result: function (err) {
                                    if (err) {
                                        self._initError = new MslMessageException(err, 'Master token is expired and not renewable.')
                                            .setMasterToken(masterToken)
                                            .setUserIdToken(header.userIdToken)
                                            .setUserAuthData(header.userAuthData)
                                            .setMessageId(header.messageId);
                                        completeInit();
                                    } else {
                                        verifyMessageSequenceNumber(ctx, header);
                                    }
                                },
                                error: function (err) {
                                    if (isMslException(err)) {
                                        err.setMasterToken(header.masterToken);
                                        err.setUserIdToken(header.userIdToken);
                                        err.setUserAuthData(header.userAuthData);
                                        err.setMessageId(header.messageId);
                                    }
                                    self._initError = err;
                                    completeInit();
                                }
                            });
                        }
                    } else {
                        // Master token expired and message is not renewable
                        self._initError = new MslMessageException(MslError.MASTERTOKEN_EXPIRED, header)
                            .setMasterToken(masterToken)
                            .setUserIdToken(header.userIdToken)
                            .setUserAuthData(header.userAuthData)
                            .setMessageId(header.messageId);
                        completeInit();
                    }
                } else {
                    // Master token is not expired
                    verifyMessageSequenceNumber(ctx, header);
                }
            } catch (err) {
                if (isMslException(err)) {
                    err.setMasterToken(header.masterToken);
                    err.setUserIdToken(header.userIdToken);
                    err.setUserAuthData(header.userAuthData);
                    err.setMessageId(header.messageId);
                }
                self._initError = err;
                completeInit();
            }
        }

        /**
         * Verify user authentication (user ID token) for the message.
         * @param {MslContext} ctx - MSL context
         * @param {MessageHeader} header - The message header
         */
        function verifyUserAuthentication(ctx, header) {
            const masterToken = header.masterToken;
            const userIdToken = header.userIdToken;

            try {
                if (userIdToken) {
                    // NOTE: Original code references (null).isUserIdTokenRevoked - dead code path
                    (null).isUserIdTokenRevoked(ctx, masterToken, userIdToken, {
                        result: function (err) {
                            if (err) {
                                self._initError = new MslUserAuthException(err, userIdToken)
                                    .setMasterToken(masterToken)
                                    .setUserIdToken(userIdToken)
                                    .setMessageId(header.messageId);
                                completeInit();
                            } else {
                                verifyMasterTokenRenewal(ctx, header);
                            }
                        },
                        error: function (err) {
                            if (isMslException(err)) {
                                err.setMasterToken(header.masterToken);
                                err.setUserIdToken(header.userIdToken);
                                err.setUserAuthData(header.userAuthData);
                                err.setMessageId(header.messageId);
                            }
                            self._initError = err;
                            completeInit();
                        }
                    });
                } else {
                    verifyMasterTokenRenewal(ctx, header);
                }
            } catch (err) {
                if (isMslException(err)) {
                    err.setMasterToken(header.masterToken);
                    err.setUserIdToken(header.userIdToken);
                    err.setUserAuthData(header.userAuthData);
                    err.setMessageId(header.messageId);
                }
                self._initError = err;
                completeInit();
            }
        }

        /**
         * Verify entity authentication for network-bound messages.
         * @param {MslContext} ctx - MSL context
         * @param {MessageHeader} header - The message header
         */
        function verifyEntityAuthentication(ctx, header) {
            const masterToken = header.masterToken;
            try {
                // NOTE: Original code references (null).isEntityRevoked - dead code path
                (null).isEntityRevoked(ctx, masterToken, {
                    result: function (err) {
                        if (err) {
                            self._initError = new MslEntityAuthException(err, masterToken)
                                .setUserIdToken(header.userIdToken)
                                .setUserAuthData(header.userAuthData)
                                .setMessageId(header.messageId);
                            completeInit();
                        } else {
                            verifyUserAuthentication(ctx, header);
                        }
                    },
                    error: function (err) {
                        if (isMslException(err)) {
                            err.setMasterToken(header.masterToken);
                            err.setUserIdToken(header.userIdToken);
                            err.setUserAuthData(header.userAuthData);
                            err.setMessageId(header.messageId);
                        }
                        self._initError = err;
                        completeInit();
                    }
                });
            } catch (err) {
                if (isMslException(err)) {
                    err.setMasterToken(header.masterToken);
                    err.setUserIdToken(header.userIdToken);
                    err.setUserAuthData(header.userAuthData);
                    err.setMessageId(header.messageId);
                }
                self._initError = err;
                completeInit();
            }
        }

        // --- Begin initialization: create tokenizer from transport ---
        SyncAsyncExecutor(callbacks, function () {
            mslContext.encoderFactory.createTokenizer(transport, tokenFactory, {
                result: onTokenizerReady,
                timeout: callbacks.timeout,
                error: callbacks.error
            });
        });
    }

    // ====================================================================
    // Payload reading methods
    // ====================================================================

    /**
     * Read the next payload chunk object from the tokenizer.
     *
     * Checks if the tokenizer has more objects, reads the next one, and
     * wraps encoding errors as MSL encoder exceptions.
     *
     * @param {Object} callbacks - { result(MslObject|null), timeout, error }
     */
    readNextPayloadChunk(callbacks) {
        const self = this;

        SyncAsyncExecutor(callbacks, function () {
            if (!self.getMessageHeader()) {
                throw new MslInternalException('Read attempted with error message.');
            }

            if (self._endOfMessage) {
                return null;
            }

            self._tokenizer.hasMore({
                result: function (hasMore) {
                    SyncAsyncExecutor(callbacks, function () {
                        if (!hasMore) {
                            self._endOfMessage = true;
                            return null;
                        }

                        self._tokenizer.nextObject({
                            result: callbacks.result,
                            timeout: callbacks.timeout,
                            error: function (err) {
                                SyncAsyncExecutor(callbacks, function () {
                                    if (err instanceof MslEncodingException) {
                                        throw new MslEncoderException(MslError.MSL_PARSE_ERROR, 'payloadchunk', err);
                                    }
                                    throw err;
                                });
                            }
                        });
                    });
                },
                timeout: callbacks.timeout,
                error: function (err) {
                    SyncAsyncExecutor(callbacks, function () {
                        if (err instanceof MslEncodingException) {
                            throw new MslEncoderException(MslError.MSL_PARSE_ERROR, 'payloadchunk', err);
                        }
                        throw err;
                    });
                }
            });
        });
    }

    /**
     * Read the next payload data from the stream.
     *
     * Parses the next payload chunk, validates its message ID and sequence
     * number against the header, detects end-of-message, detects handshake
     * messages, and manages the replay buffer for mark/reset support.
     *
     * @param {Object} callbacks - { result(Uint8Array|null), timeout, error }
     */
    readPayloadData(callbacks) {
        const self = this;

        SyncAsyncExecutor(callbacks, function () {
            const messageHeader = self.getMessageHeader();

            if (!messageHeader) {
                throw new MslInternalException('Read attempted with error message.');
            }

            // If replaying from the mark/reset buffer, return buffered data
            if (self._readAheadIndex !== -1 && self._readAheadIndex < self._payloadBuffer.length) {
                return self._payloadBuffer[self._readAheadIndex++];
            }

            // If we have already reached end of message, no more data
            if (self._endOfMessage) {
                return null;
            }

            // Read the next payload chunk object from the tokenizer
            self.readNextPayloadChunk({
                result: function (chunkObject) {
                    SyncAsyncExecutor(callbacks, function () {
                        if (!chunkObject) {
                            return null;
                        }

                        // Parse and decrypt the payload chunk
                        parsePayloadChunk(self.mslContext, chunkObject, self._payloadCryptoContext, {
                            result: function (payloadChunk) {
                                SyncAsyncExecutor(callbacks, function () {
                                    const masterToken = messageHeader.masterToken;
                                    const entityAuthData = messageHeader.entityAuthData;
                                    const userIdToken = messageHeader.userIdToken;
                                    const userAuthData = messageHeader.userAuthData;

                                    // Validate message ID matches header
                                    if (payloadChunk.messageId !== messageHeader.messageId) {
                                        throw new MslMessageException(
                                            MslError.PAYLOAD_MESSAGE_ID_MISMATCH,
                                            'payload mid ' + payloadChunk.messageId + ' header mid ' + messageHeader.messageId
                                        ).setMasterToken(masterToken).setEntityAuthData(entityAuthData).setUserIdToken(userIdToken).setUserAuthData(userAuthData);
                                    }

                                    // Validate payload sequence number
                                    if (payloadChunk.sequenceNumber !== self._payloadSequenceNumber) {
                                        throw new MslMessageException(
                                            MslError.PAYLOAD_SEQUENCE_NUMBER_MISMATCH,
                                            'payload seqno ' + payloadChunk.sequenceNumber + ' expected seqno ' + self._payloadSequenceNumber
                                        ).setMasterToken(masterToken).setEntityAuthData(entityAuthData).setUserIdToken(userIdToken).setUserAuthData(userAuthData);
                                    }

                                    ++self._payloadSequenceNumber;

                                    // Detect handshake messages: renewable with key request data,
                                    // end-of-message flag set, and empty payload data
                                    if (self._isHandshakeMessage == null) {
                                        self._isHandshakeMessage = messageHeader.isRenewable()
                                            && messageHeader.keyRequestData.length > 0
                                            && payloadChunk.isEndOfMessage
                                            && payloadChunk.data.length === 0;
                                    }

                                    // Mark end of message if this is the last chunk
                                    if (payloadChunk.isEndOfMessage) {
                                        self._endOfMessage = true;
                                    }

                                    const data = payloadChunk.data;

                                    // Store in replay buffer if mark/reset buffering is active
                                    if (self._savedOffset !== -1) {
                                        self._payloadBuffer.push(data);
                                        self._readAheadIndex = -1;
                                    }

                                    return data;
                                });
                            },
                            error: callbacks.error
                        });
                    });
                },
                timeout: callbacks.timeout,
                error: callbacks.error
            });
        });
    }

    // ====================================================================
    // Stream readiness and state
    // ====================================================================

    /**
     * Check whether the stream is ready for reading.
     *
     * Waits for initialization to complete. Returns true if the stream is
     * ready, false if aborted, or throws on initialization error.
     *
     * @param {Object} callbacks - { result(boolean), timeout, error }
     */
    isReady(callbacks) {
        const self = this;

        /**
         * Check the initialization result state.
         */
        function checkState() {
            SyncAsyncExecutor(callbacks, function () {
                if (self._aborted) {
                    return false;
                }
                if (self._timedOut) {
                    callbacks.timeout();
                } else {
                    if (self._initError) {
                        throw self._initError;
                    }
                    return true;
                }
            });
        }

        SyncAsyncExecutor(callbacks, function () {
            if (self._initialized) {
                checkState();
            } else {
                self._readySemaphore.wait(-1, {
                    result: function (value) {
                        SyncAsyncExecutor(callbacks, function () {
                            if (value === undefined) {
                                return false;
                            }
                            checkState();
                        });
                    },
                    timeout: function () {
                        AsyncExecutor(callbacks, function () {
                            throw new MslInternalException(
                                'Timeout while waiting for MessageInputStream.isReady() despite no timeout being specified.'
                            );
                        });
                    },
                    error: callbacks.error
                });
            }
        });
    }

    /**
     * Check whether this message is a handshake message.
     *
     * A handshake message is renewable with key request data, has an
     * end-of-message payload chunk, and contains empty payload data.
     * The first payload chunk may be read to determine this status.
     *
     * @param {Object} callbacks - { result(boolean|undefined), timeout, error }
     */
    isHandshake(callbacks) {
        const self = this;

        SyncAsyncExecutor(callbacks, function () {
            const messageHeader = self.getMessageHeader();

            // Error headers are never handshake messages
            if (!messageHeader) {
                return false;
            }

            // If the header itself declares a handshake, it is one
            if (messageHeader.isHandshake()) {
                return true;
            }

            // If we have not yet determined handshake status, read the first payload to find out
            if (self._isHandshakeMessage == null) {
                self.readPayloadData({
                    result: function (data) {
                        SyncAsyncExecutor(callbacks, function () {
                            if (!self._aborted) {
                                self._currentPayloadData = data;
                                self._currentOffset = 0;
                                if (!self._currentPayloadData) {
                                    self._isHandshakeMessage = false;
                                }
                                return self._isHandshakeMessage;
                            }
                        });
                    },
                    timeout: callbacks.timeout,
                    error: function (err) {
                        SyncAsyncExecutor(callbacks, function () {
                            if (isMslException(err)) {
                                self._deferredError = new MslIoException('Error reading the payload chunk.', err);
                            }
                            throw err;
                        });
                    }
                });
            } else {
                return self._isHandshakeMessage;
            }
        });
    }

    // ====================================================================
    // Header accessors
    // ====================================================================

    /**
     * Get the message header if this message has one.
     *
     * @returns {MessageHeader|null} The MessageHeader, or null if this is an error message
     */
    getMessageHeader() {
        return this._header instanceof MessageHeader ? this._header : null;
    }

    /**
     * Get the error header if this message is an error response.
     *
     * @returns {ErrorHeader|null} The ErrorHeader, or null if this is a normal message
     */
    getErrorHeader() {
        return this._header instanceof ErrorHeader ? this._header : null;
    }

    /**
     * Get the entity identity (profile identifier) from the message.
     *
     * Extracts the identity from the master token if present, otherwise
     * falls back to the entity authentication data.
     *
     * @returns {string} The entity identity string
     */
    getProfileIdentifier() {
        const messageHeader = this.getMessageHeader();

        if (messageHeader) {
            const masterToken = messageHeader.masterToken;
            return masterToken
                ? masterToken.identity
                : messageHeader.entityAuthData.getProfileIdentifier();
        }

        return this.getErrorHeader().entityAuthData.getProfileIdentifier();
    }

    // ====================================================================
    // Stream control
    // ====================================================================

    /**
     * Set whether this stream should operate in handshake-only mode.
     *
     * In handshake-only mode, {@link closing} will close the transport
     * directly instead of draining remaining payload data.
     *
     * @param {boolean} handshakeOnly - True to enable handshake-only mode
     */
    setHandshakeOnly(handshakeOnly) {
        this._handshakeOnly = handshakeOnly;
    }

    /**
     * Abort the stream, preventing any further reads.
     *
     * Cancels the underlying transport and releases the ready semaphore
     * so that any waiters are unblocked.
     */
    abort() {
        this._aborted = true;
        this.transport.abort();
        this._readySemaphore.cancel();
    }

    /**
     * Close the stream gracefully.
     *
     * In handshake-only mode, delegates directly to the transport close.
     * For normal messages with a handshake, drains all remaining payload
     * data before signaling close completion.
     *
     * @param {number} timeout - Close timeout in milliseconds
     * @param {Object} callbacks - { result(boolean), timeout, error }
     */
    closing(timeout, callbacks) {
        const self = this;

        /**
         * Drain all remaining payload data before closing.
         */
        function drainPayloadData() {
            self.readPayloadData({
                result: function (data) {
                    if (data) {
                        drainPayloadData();
                    } else {
                        callbacks.result(true);
                    }
                },
                timeout: function () {
                    callbacks.timeout();
                },
                error: function () {
                    callbacks.result(true);
                }
            });
        }

        SyncAsyncExecutor(callbacks, function () {
            self._tokenizer.closing(timeout, {
                result: function () {
                    if (self._handshakeOnly) {
                        // Handshake-only mode: close transport directly
                        self.transport.closing(timeout, callbacks);
                    } else if (self.getMessageHeader()) {
                        // Normal message: check handshake status then drain if needed
                        self.isHandshake({
                            result: function (isHandshake) {
                                if (isHandshake) {
                                    drainPayloadData();
                                } else {
                                    callbacks.result(true);
                                }
                            },
                            timeout: callbacks.timeout,
                            error: function () {
                                callbacks.result(true);
                            }
                        });
                    } else {
                        // Error headers: just close
                        callbacks.result(true);
                    }
                },
                timeout: callbacks.timeout,
                error: function () {
                    callbacks.result(true);
                }
            });
        });
    }

    // ====================================================================
    // Mark / Reset / Read
    // ====================================================================

    /**
     * Mark the current position in the stream for later reset.
     *
     * Saves the current read state so that a subsequent call to {@link reset}
     * will rewind to this position and replay buffered data.
     *
     * @param {number} [readLimit] - Maximum bytes to buffer before invalidating the mark.
     *                                If falsy, buffering is unlimited.
     */
    mark(readLimit) {
        this._markReadLimit = readLimit ? readLimit : -1;
        this._bytesReadSinceMark = 0;
        this._markActive = true;

        if (this._currentPayloadData) {
            // Trim buffer: remove chunks before the current one
            while (this._payloadBuffer.length > 0 && this._payloadBuffer[0] !== this._currentPayloadData) {
                this._payloadBuffer.shift();
            }

            // Ensure current data is in the buffer
            if (this._payloadBuffer.length === 0) {
                this._payloadBuffer.push(this._currentPayloadData);
            }

            // Set read-ahead to replay from beginning of buffer
            this._readAheadIndex = 0;
            this._currentPayloadData = this._payloadBuffer[this._readAheadIndex++];
            this._savedOffset = this._currentOffset;
        } else {
            // No current data: clear the buffer
            this._readAheadIndex = -1;
            this._payloadBuffer = [];
        }
    }

    /**
     * Read bytes from the stream into a buffer.
     *
     * Handles payload chunk boundaries, mark/reset buffering, and read
     * limits. Returns null at end-of-stream, empty Uint8Array on
     * timeout/abort, or false if the stream is not yet initialized.
     *
     * @param {number} requestedLength - Number of bytes to read.
     *   -1 = read all available data, 0 = read nothing, >0 = read up to N bytes
     * @param {number} timeout - Read timeout in milliseconds
     * @param {Object} callbacks - { result(Uint8Array|null|false), timeout(Uint8Array), error }
     */
    read(requestedLength, timeout, callbacks) {
        const self = this;

        /**
         * Perform the read after initialization and readiness checks pass.
         */
        function performRead() {
            SyncAsyncExecutor(callbacks, function () {
                if (self._aborted) {
                    return new Uint8Array(0);
                }
                if (self._timedOut) {
                    callbacks.timeout(new Uint8Array(0));
                } else {
                    if (self._initError) {
                        throw self._initError;
                    }

                    // Check for deferred errors from previous partial reads
                    if (self._deferredError != null) {
                        const deferredErr = self._deferredError;
                        self._deferredError = null;
                        throw deferredErr;
                    }

                    // Check handshake status: handshake messages return null (no app data)
                    self.isHandshake({
                        result: function (isHandshake) {
                            SyncAsyncExecutor(callbacks, function () {
                                if (isHandshake === undefined) {
                                    return new Uint8Array(0);
                                }
                                if (isHandshake) {
                                    return null;
                                }
                                readBytes();
                            });
                        },
                        timeout: callbacks.timeout,
                        error: function (err) {
                            SyncAsyncExecutor(callbacks, function () {
                                self._deferredError = null;
                                throw new MslIoException('Error reading the payload chunk.', err);
                            });
                        }
                    });
                }
            });
        }

        /**
         * Copy bytes from payload chunks into a contiguous output buffer.
         */
        function readBytes() {
            SyncAsyncExecutor(callbacks, function () {
                /** @type {Uint8Array|undefined} */
                let outputBuffer = (requestedLength !== -1) ? new Uint8Array(requestedLength) : undefined;
                let writeOffset = 0;
                let bytesRead = 0;

                /**
                 * Recursively copy available bytes from current and buffered chunks.
                 * @param {Object} cb - Async callbacks for this copy pass
                 */
                function copyAvailable(cb) {
                    SyncAsyncExecutor(cb, function () {
                        // If output buffer is full, return it
                        if (outputBuffer && bytesRead >= outputBuffer.length) {
                            return outputBuffer.subarray(0, bytesRead);
                        }

                        let bytesCopied = -1;

                        if (self._currentPayloadData) {
                            let available = self._currentPayloadData.length - self._currentOffset;

                            // For unbounded reads, allocate a buffer sized to all available data
                            if (!outputBuffer) {
                                let totalAvailable = available;
                                if (self._readAheadIndex !== -1) {
                                    for (let i = self._readAheadIndex; i < self._payloadBuffer.length; ++i) {
                                        totalAvailable += self._payloadBuffer[i].length;
                                    }
                                }
                                if (totalAvailable > 0) {
                                    outputBuffer = new Uint8Array(totalAvailable);
                                }
                            }

                            // Copy as many bytes as will fit in the output buffer
                            const copyLength = Math.min(available, outputBuffer ? outputBuffer.length - bytesRead : 0);

                            if (copyLength > 0) {
                                const chunk = self._currentPayloadData.subarray(
                                    self._currentOffset,
                                    self._currentOffset + copyLength
                                );
                                outputBuffer.set(chunk, writeOffset);
                                bytesCopied = copyLength;
                                writeOffset += copyLength;
                                self._currentOffset += copyLength;

                                // Track bytes read for mark/reset read limit enforcement
                                if (self._markActive) {
                                    self._bytesReadSinceMark += copyLength;
                                    if (self._markReadLimit !== -1 && self._bytesReadSinceMark > self._markReadLimit) {
                                        self._markActive = false;
                                        self._bytesReadSinceMark = self._markReadLimit = 0;
                                    }
                                }
                            }
                        }

                        if (bytesCopied !== -1) {
                            // Copied some bytes; try to copy more from the same or next chunk
                            bytesRead += bytesCopied;
                            copyAvailable(cb);
                        } else {
                            // Need more data from the next payload chunk
                            self.readPayloadData({
                                result: function (data) {
                                    SyncAsyncExecutor(cb, function () {
                                        if (self._aborted) {
                                            return outputBuffer ? outputBuffer.subarray(0, bytesRead) : new Uint8Array(0);
                                        }

                                        self._currentPayloadData = data;
                                        self._currentOffset = 0;

                                        if (self._currentPayloadData) {
                                            copyAvailable(cb);
                                        } else {
                                            // End of stream
                                            if (bytesRead === 0 && requestedLength !== 0) {
                                                return null;
                                            }
                                            return outputBuffer ? outputBuffer.subarray(0, bytesRead) : new Uint8Array(0);
                                        }
                                    });
                                },
                                timeout: function () {
                                    cb.timeout(outputBuffer ? outputBuffer.subarray(0, bytesRead) : new Uint8Array(0));
                                },
                                error: function (err) {
                                    SyncAsyncExecutor(cb, function () {
                                        if (isMslException(err)) {
                                            err = new MslIoException('Error reading the payload chunk.', err);
                                        }

                                        // If we already read some data, defer the error and return what we have
                                        if (bytesRead > 0) {
                                            self._deferredError = err;
                                            return outputBuffer.subarray(0, bytesRead);
                                        }
                                        throw err;
                                    });
                                }
                            });
                        }
                    });
                }

                copyAvailable(callbacks);
            });
        }

        // --- Entry point for read() ---
        SyncAsyncExecutor(callbacks, function () {
            if (requestedLength < -1) {
                throw new RangeError('read requested with illegal length ' + requestedLength);
            }

            if (self._initialized) {
                performRead();
            } else {
                self._readySemaphore.wait(timeout, {
                    result: function (value) {
                        if (value === undefined) {
                            callbacks.result(false);
                        } else {
                            performRead();
                        }
                    },
                    timeout: function () {
                        callbacks.timeout(new Uint8Array(0));
                    },
                    error: callbacks.error
                });
            }
        });
    }

    /**
     * Reset the stream to the previously marked position.
     *
     * If mark is active, rewinds the read position to the marked position
     * and replays buffered data. Has no effect if mark() was not previously called.
     */
    reset() {
        if (this._markActive) {
            this._readAheadIndex = 0;

            if (this._payloadBuffer.length > 0) {
                this._currentPayloadData = this._payloadBuffer[this._readAheadIndex++];
                this._currentOffset = this._savedOffset;
            } else {
                this._currentPayloadData = null;
            }

            this._bytesReadSinceMark = 0;
        }
    }
}


/**
 * Factory function to create a new MessageInputStream.
 *
 * @param {MslContext} mslContext - The MSL context
 * @param {InputStream} transport - The transport input stream
 * @param {Array<KeyRequestData>} keyExchangeSchemes - Supported key exchange schemes
 * @param {Object<string, CryptoContext>} cryptoContexts - Crypto context map
 * @param {TokenFactory} tokenFactory - Token factory
 * @param {Object} callbacks - Async callbacks { result, timeout, error }
 * @returns {MessageInputStream} The new stream instance
 */
export function createMessageInputStream(mslContext, transport, keyExchangeSchemes, cryptoContexts, tokenFactory, callbacks) {
    return new MessageInputStream(mslContext, transport, keyExchangeSchemes, cryptoContexts, tokenFactory, callbacks);
}

export { MessageInputStream };
export default MessageInputStream;
