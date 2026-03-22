/**
 * Netflix Cadmium Player - MslControl
 *
 * Core controller for Netflix's Message Security Layer (MSL) protocol.
 * Manages secure message exchange between client and server, handling
 * master token acquisition/renewal, key exchange, message sending/receiving,
 * and error recovery for various MSL error codes.
 *
 * MSL is Netflix's custom protocol for authenticated and encrypted
 * communication, built on top of standard transport (HTTP).
 *
 * Exports:
 *   - MslControlResult (j3b) - Result container for input/output streams
 *   - MslControllerCore (m3b) - Core MSL message orchestration logic
 *   - MslControl (l3b / default) - Main public API with concurrency control
 *
 * @module msl/MslControl
 */

// Dependencies
// import { __importDefault, __extends } from '../modules/Module_22970.js';          // tslib helpers
// import asyncComplete from '../modules/Module_42979.js';                            // async completion helper
// import interruptibleComplete from '../modules/Module_79804.js';                    // interruptible async complete
// import MslInterruptedException from '../modules/Module_25978.js';                  // MSL interrupted exception
// import MslException from '../modules/Module_1966.js';                              // MSL base exception
// import { IDa as DefaultMessageFactory } from '../modules/Module_31238.js';         // default message factory
// import { ZJa as MasterTokenLock } from '../modules/Module_74015.js';               // master token lock/mutex
// import { oM as createMessageId } from '../modules/Module_93652.js';                // message ID utilities
// import MslInternalException from '../modules/Module_10690.js';                     // MSL internal exception
// import MslConstants from '../modules/Module_51411.js';                             // MSL constants (ErrorType, etc.)
// import { ghb as MessageContext } from '../modules/Module_41962.js';                // message context
// import MslMessageException from '../modules/Module_20754.js';                      // MSL message exception
// import MslErrorCode from '../modules/Module_36114.js';                             // MSL error codes
// import { S5 as RenewalLockQueue } from '../modules/Module_89752.js';               // renewal lock queue
// import { xlb as Semaphore } from '../modules/Module_81214.js';                     // semaphore for concurrency
// import { readBytes as isMslError } from '../modules/Module_32260.js';              // MSL error type checker

/**
 * Checks whether an error is an MslInterruptedException by walking the cause chain.
 * @param {Error} error - The error to inspect
 * @returns {boolean} True if any error in the cause chain is an MslInterruptedException
 */
function isMslInterruptedError(error) {
    while (error) {
        if (error instanceof MslInterruptedException) {
            return true;
        }
        error = isMslError(error) ? error.cause : undefined;
    }
    return false;
}

/**
 * Creates a cancellation function that cancels a semaphore ticket and aborts a task.
 * @param {MslControl} mslControl - The MslControl instance
 * @param {*} semaphoreTicket - The semaphore wait ticket, or null
 * @param {Object} task - The task to abort
 * @returns {Function} A cancellation function
 */
function createCanceller(mslControl, semaphoreTicket, task) {
    return function () {
        if (semaphoreTicket) {
            mslControl._semaphore.cancel(semaphoreTicket);
        }
        task.abort();
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Data Classes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Result container holding input (response) and output (request) streams
 * from an MSL message exchange.
 */
export class MslControlResult {
    /**
     * @param {Object} input - The response/input stream
     * @param {Object} outputStream - The request/output stream
     */
    constructor(input, outputStream) {
        /** @type {Object} The response input stream (MessageInputStream) */
        this.input = input;
        /** @type {Object} The request output stream (MessageOutputStream) */
        this.cU = outputStream;
    }
}

/**
 * Composite key for identifying a unique MSL context + master token pair.
 * Used as a serializable map key for master token mutexes.
 */
class MslContextMasterTokenKey {
    /**
     * @param {Object} mslContext - The MSL context (decoder state)
     * @param {Object} masterToken - The master token
     */
    constructor(mslContext, masterToken) {
        this.decoderState = mslContext;
        this.masterToken = masterToken;
    }

    /**
     * @param {MslContextMasterTokenKey} other
     * @returns {boolean}
     */
    equals(other) {
        if (this === other) return true;
        if (!(other instanceof MslContextMasterTokenKey)) return false;
        return this.decoderState === other.decoderState &&
            this.masterToken.equals(other.masterToken);
    }

    /** @returns {string} Serialized key for use as map index */
    serialize() {
        return this.decoderState.serialize() + ':' + this.masterToken.serialize();
    }
}

/**
 * Wrapper/proxy for an MSL message builder that delegates all calls
 * to an underlying proxy. Provides a uniform interface for MSL message
 * configuration (encryption, integrity, user auth, key exchange, etc.).
 */
class MessageBuilderProxy {
    /** @param {Object} wrappedProxy - The underlying message proxy */
    constructor(wrappedProxy) {
        this.wrappedProxy = wrappedProxy;
    }

    /** @returns {Object} Map of crypto contexts keyed by name */
    getCryptoContexts() {
        return this.wrappedProxy.gsa();
    }

    /** @returns {string|null} Expected user ID for response validation */
    getUserId() {
        return this.wrappedProxy.vWa();
    }

    /** @returns {boolean} Whether encryption is required for this message */
    isEncrypted() {
        return this.wrappedProxy.hda();
    }

    /** @returns {boolean} Whether integrity protection is required */
    isIntegrityProtected() {
        return this.wrappedProxy.gua();
    }

    /** @returns {boolean} Whether the message is non-replayable */
    isNonReplayable() {
        return this.wrappedProxy.isNonReplayable();
    }

    /** @returns {boolean} Whether user authentication is required */
    requiresUserAuthentication() {
        return this.wrappedProxy.uda();
    }

    /** @returns {string|null} The user auth data identifier (e.g., profileGuid) */
    getUserAuthDataId() {
        return this.wrappedProxy.bB();
    }

    /**
     * Retrieves user authentication data for this message.
     * @param {*} errorCode - Error code triggering re-authentication, or null
     * @param {boolean} isRenewable - Whether the token is renewable
     * @param {boolean} isRequired - Whether user auth is required
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    getUserAuthData(errorCode, isRenewable, isRequired, callback) {
        this.wrappedProxy.internal_Vsa(errorCode, isRenewable, isRequired, callback);
    }

    /**
     * Gets key request data for key exchange operations.
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    getKeyRequestData(callback) {
        this.wrappedProxy.yS(callback);
    }

    /**
     * Prepares the message by setting service tokens on the message context.
     * @param {Object} messageContext - The message context
     * @param {boolean} isHandshake - Whether this is a handshake message
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    prepareMessage(messageContext, isHandshake, callback) {
        this.wrappedProxy.m8a(messageContext, isHandshake, callback);
    }

    /**
     * Writes the message payload to the output stream.
     * @param {Object} outputStream - The message output stream
     * @param {number} timeout - Write timeout
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    write(outputStream, timeout, callback) {
        this.wrappedProxy.write(outputStream, timeout, callback);
    }

    /** @returns {Object|null} The message debug context for logging */
    getMessageDebugContext() {
        return this.wrappedProxy.jsa();
    }
}

/**
 * Extended message builder proxy that writes queued message objects before
 * the main payload. Used for retry/batch scenarios where previously queued
 * messages need to be resent.
 */
class QueuedMessageBuilderProxy extends MessageBuilderProxy {
    /**
     * @param {Array|null} objectQueue - Queue of message objects to write first
     * @param {Object} wrappedProxy - The underlying message proxy
     */
    constructor(objectQueue, wrappedProxy) {
        super(wrappedProxy);
        /** @type {Array|null} */
        this.objectQueue = objectQueue;
    }

    /**
     * Writes all queued objects sequentially (header, data, close/batch),
     * then falls back to the base write if the queue is empty.
     * @param {Object} outputStream - The message output stream
     * @param {number} timeout - Write timeout
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    write(outputStream, timeout, callback) {
        const self = this;

        if (this.objectQueue && this.objectQueue.length !== 0) {
            const writeNext = function (index) {
                if (index === self.objectQueue.length) {
                    callback.result(true);
                } else {
                    const item = self.objectQueue[index];
                    outputStream.fXc(item.internal_Cpa, timeout, {
                        result() {
                            outputStream.write(item.data, 0, item.data.length, timeout, {
                                result() {
                                    interruptibleComplete(callback, function () {
                                        if (item.sTa) {
                                            // Close the current message segment
                                            outputStream.closing(timeout, {
                                                result(success) {
                                                    success ? writeNext(index + 1) : callback.result(success);
                                                },
                                                timeout: callback.timeout,
                                                error: callback.error
                                            });
                                        } else {
                                            // Batch: continue without closing
                                            outputStream.logBatcher(timeout, {
                                                result(success) {
                                                    success ? writeNext(index + 1) : callback.result(success);
                                                },
                                                timeout: callback.timeout,
                                                error: callback.error
                                            });
                                        }
                                    });
                                },
                                timeout: callback.timeout,
                                error: callback.error
                            });
                        },
                        timeout: callback.timeout,
                        error: callback.error
                    });
                }
            };
            writeNext(0);
        } else {
            super.write(outputStream, timeout, callback);
        }
    }
}

/**
 * Message builder proxy that disables user authentication requirement.
 * Used for send-only operations that don't need user auth.
 */
class NoUserAuthMessageBuilderProxy extends MessageBuilderProxy {
    constructor(wrappedProxy) {
        super(wrappedProxy);
    }

    /** @returns {boolean} Always false - no user auth required */
    requiresUserAuthentication() {
        return false;
    }
}

/**
 * Holds a master token and its associated lock ticket from the master
 * token mutex. The lock must be released when the master token is no
 * longer needed.
 */
class MasterTokenContext {
    /**
     * @param {Object} masterToken - The acquired master token
     * @param {*} lockTicket - The mutex lock ticket
     */
    constructor(masterToken, lockTicket) {
        /** @type {Object} */
        this.mc = masterToken;
        /** @type {*} */
        this.d1c = lockTicket;
    }
}

/**
 * Holds a message builder paired with its proxy wrapper.
 * Used when building error recovery messages.
 */
class MessageBuilderContext {
    /**
     * @param {Object} messageBuilder - The MSL message builder
     * @param {MessageBuilderProxy} builderProxy - The proxy wrapper
     */
    constructor(messageBuilder, builderProxy) {
        /** @type {Object} */
        this.logBlobManager = messageBuilder;
        /** @type {MessageBuilderProxy} */
        this.hKc = builderProxy;
    }
}

/**
 * Represents a pending send request containing the output stream
 * and whether a handshake (key exchange) response is expected.
 */
class SendRequest {
    /**
     * @param {Object} outputStream - The message output stream
     * @param {boolean} expectsHandshake - Whether a handshake response is expected
     */
    constructor(outputStream, expectsHandshake) {
        /** @type {Object} */
        this.request = outputStream;
        /** @type {boolean} */
        this.tE = expectsHandshake;
    }
}

/**
 * Represents a completed request/response exchange, combining the
 * response stream with the original send request metadata.
 */
class SendResponse {
    /**
     * @param {Object} responseStream - The response input stream
     * @param {SendRequest} sendRequest - The original send request
     */
    constructor(responseStream, sendRequest) {
        /** @type {Object} */
        this.request = sendRequest.request;
        /** @type {boolean} */
        this.tE = sendRequest.tE;
        /** @type {Object} */
        this.response = responseStream;
    }
}

/** Sentinel object used to signal that the renewal lock should be reacquired */
const RENEWAL_LOCK_SENTINEL = {};

// ─────────────────────────────────────────────────────────────────────────────
// MslControllerCore - Internal MSL message orchestrator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Core MSL message controller managing the full lifecycle of MSL messages:
 * master token acquisition, message building, sending, receiving, key renewal,
 * and error recovery. This class is the internal engine behind MslControl.
 */
export class MslControllerCore {
    /**
     * @param {Object} [messageFactory] - Factory for creating message builders and streams.
     *   Defaults to DefaultMessageFactory if not provided.
     */
    constructor(messageFactory) {
        if (!messageFactory) {
            messageFactory = new DefaultMessageFactory();
        }
        /** @type {Object} Factory for creating MSL message builders/streams */
        this._messageFactory = messageFactory;
        /** @type {Object|null} Optional message filter for request/response transformation */
        this._messageFilter = null;
        /** @type {Array<{cryptoGenerator: Object, queueing: Object}>} Active renewal lock entries */
        this._renewalLocks = [];
        /** @type {Object<string, MasterTokenLock>} Map of serialized MasterTokenState -> MasterTokenLock */
        this._masterTokenMutexes = {};
    }

    // ── Master Token Acquisition ────────────────────────────────────────

    /**
     * Acquires the newest master token from the MSL store, handling concurrent
     * access via a per-token mutex. If the token changes during acquisition,
     * releases the lock and retries.
     *
     * @param {Object} task - The task context (supports e4 for abort registration)
     * @param {Object} mslContext - The MSL context (contains decoderMap/mslStore)
     * @param {number} timeout - Operation timeout in ms
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    getNewestMasterToken(task, mslContext, timeout, callback) {
        const self = this;

        interruptibleComplete(callback, function () {
            const tokenStore = mslContext.decoderMap;
            const masterToken = tokenStore.oE();
            if (!masterToken) return null;

            const contextKey = new MslContextMasterTokenKey(mslContext, masterToken).serialize();
            let tokenLock = self._masterTokenMutexes[contextKey];
            if (!tokenLock) {
                tokenLock = new MasterTokenLock();
                self._masterTokenMutexes[contextKey] = tokenLock;
            }

            const lockTicket = tokenLock.ySc(timeout, {
                result(ticket) {
                    interruptibleComplete(callback, function () {
                        if (ticket === undefined) {
                            throw new MslInterruptedException('getNewestMasterToken aborted.');
                        }

                        // Verify the master token hasn't changed while we waited
                        const currentMasterToken = tokenStore.oE();
                        if (masterToken.equals(currentMasterToken)) {
                            return new MasterTokenContext(masterToken, ticket);
                        }

                        // Token changed: release lock, wait for full release, then retry
                        tokenLock.unlock(ticket);
                        tokenLock.lYb(timeout, {
                            result(newTicket) {
                                interruptibleComplete(callback, function () {
                                    if (newTicket === undefined) {
                                        throw new MslInterruptedException('getNewestMasterToken aborted.');
                                    }
                                    delete self._masterTokenMutexes[contextKey];
                                    tokenLock.unlock(newTicket);
                                    return self.getNewestMasterToken(task, mslContext, timeout, callback);
                                });
                            },
                            timeout: callback.timeout,
                            error: callback.error
                        });
                    });
                },
                timeout: callback.timeout,
                error: callback.error
            });

            // Register abort handler to cancel pending lock acquisition
            task.e4(function () {
                if (lockTicket) tokenLock.cancel(lockTicket);
            });
        });
    }

    /**
     * Removes a master token from the MSL store and releases its associated mutex.
     * Executes asynchronously on the next tick to avoid blocking.
     *
     * @param {Object} mslContext - The MSL context
     * @param {Object} masterToken - The master token to remove
     */
    removeMasterToken(mslContext, masterToken) {
        const self = this;

        if (masterToken) {
            setTimeout(function () {
                const contextKey = new MslContextMasterTokenKey(mslContext, masterToken).serialize();
                let tokenLock = self._masterTokenMutexes[contextKey];
                if (!tokenLock) {
                    tokenLock = new MasterTokenLock();
                    self._masterTokenMutexes[contextKey] = tokenLock;
                }
                tokenLock.lYb(-1, {
                    result(ticket) {
                        if (ticket) {
                            mslContext.decoderMap.OPb(masterToken);
                            delete self._masterTokenMutexes[contextKey];
                            tokenLock.unlock(ticket);
                        }
                    },
                    timeout() {
                        throw new MslInternalException('Unexpected timeout received.');
                    },
                    error(err) {
                        throw err;
                    }
                });
            }, 0);
        }
    }

    /**
     * Releases a master token mutex lock.
     * @param {Object} mslContext - The MSL context
     * @param {MasterTokenContext} masterTokenCtx - The master token context with lock ticket
     */
    releaseMasterTokenLock(mslContext, masterTokenCtx) {
        if (masterTokenCtx && masterTokenCtx.mc) {
            const contextKey = new MslContextMasterTokenKey(mslContext, masterTokenCtx.mc).serialize();
            const tokenLock = this._masterTokenMutexes[contextKey];
            if (tokenLock) {
                tokenLock.unlock(masterTokenCtx.d1c);
            }
        }
    }

    // ── Key Exchange and Token Updates ──────────────────────────────────

    /**
     * Processes key exchange response data from a message header. Stores
     * the new master token and crypto context, then removes the old master token.
     *
     * @param {Object} mslContext - The MSL context
     * @param {Object} messageHeader - The message header containing key response
     * @param {Object} keyExchangeResult - The key exchange result (keyResponseData + cryptoContext)
     */
    processKeyResponseData(mslContext, messageHeader, keyExchangeResult) {
        const tokenStore = mslContext.decoderMap;
        if (keyExchangeResult) {
            tokenStore.adding(keyExchangeResult.keyResponseData.mc, keyExchangeResult.qp);
            this.removeMasterToken(mslContext, messageHeader.mc);
        }
    }

    /**
     * Updates the master token from a response message's key response data.
     * @param {Object} mslContext - The MSL context
     * @param {Object} requestHeader - The original request header
     * @param {Object} responseMessage - The response message
     */
    updateMasterTokenFromResponse(mslContext, requestHeader, responseMessage) {
        const headerData = responseMessage.checkFunction();
        if (headerData) {
            const tokenStore = mslContext.decoderMap;
            const keyResponseData = headerData.keyResponseData;
            if (keyResponseData) {
                tokenStore.adding(keyResponseData.mc, responseMessage.gna);
                this.removeMasterToken(mslContext, requestHeader.mc);
            }
        }
    }

    /**
     * Updates service tokens in the MSL store. Removes empty tokens and
     * adds non-empty ones.
     *
     * @param {Object} mslContext - The MSL context
     * @param {Object} masterToken - The current master token
     * @param {Object} userIdToken - The current user ID token
     * @param {Array} serviceTokens - Array of service tokens to process
     */
    updateServiceTokens(mslContext, masterToken, userIdToken, serviceTokens) {
        const tokenStore = mslContext.decoderMap;
        const pendingAdditions = [];

        for (let i = 0; i < serviceTokens.length; ++i) {
            const serviceToken = serviceTokens[i];
            if (!serviceToken.hasStartedCheck(masterToken) || !masterToken.networkResult) {
                const data = serviceToken.getData();
                if (data && data.length === 0) {
                    // Empty data = deletion signal
                    tokenStore.internal_Uya(
                        serviceToken.name,
                        serviceToken.itemsListProcessor() ? masterToken : null,
                        serviceToken.hasStarted() ? userIdToken : null
                    );
                } else {
                    pendingAdditions.push(serviceToken);
                }
            }
        }

        if (pendingAdditions.length > 0) {
            tokenStore.internal_Sna(pendingAdditions);
        }
    }

    // ── Message Building ────────────────────────────────────────────────

    /**
     * Creates a new message builder by acquiring the newest master token
     * and looking up the associated user ID token.
     *
     * @param {Object} task - The task context
     * @param {Object} mslContext - The MSL context
     * @param {MessageBuilderProxy} messageProxy - The message builder proxy
     * @param {number} timeout - Timeout in ms
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    createInitialMessageBuilder(task, mslContext, messageProxy, timeout, callback) {
        const self = this;

        this.getNewestMasterToken(task, mslContext, timeout, {
            result(masterTokenCtx) {
                asyncComplete(callback, function () {
                    try {
                        const masterToken = masterTokenCtx && masterTokenCtx.mc;
                        let userIdToken;

                        if (masterToken) {
                            const userId = messageProxy.getUserAuthDataId();
                            const tokenStore = mslContext.decoderMap;
                            const storedToken = userId ? tokenStore.yy(userId) : null;
                            userIdToken = (storedToken && storedToken.hasStartedCheck(masterToken))
                                ? storedToken : null;
                        } else {
                            userIdToken = null;
                        }

                        self._messageFactory.WZ(mslContext, masterToken, userIdToken, null, {
                            result(messageBuilder) {
                                asyncComplete(callback, function () {
                                    messageBuilder.onSegmentReceived(messageProxy.isNonReplayable());
                                    return { lb: messageBuilder, iq: masterTokenCtx };
                                });
                            },
                            error(err) {
                                asyncComplete(callback, function () {
                                    self.releaseMasterTokenLock(mslContext, masterTokenCtx);
                                    if (isMslError(err)) {
                                        err = new MslInternalException(
                                            'User ID token not bound to master token despite internal check.',
                                            err
                                        );
                                    }
                                    throw err;
                                });
                            }
                        });
                    } catch (err) {
                        self.releaseMasterTokenLock(mslContext, masterTokenCtx);
                    }
                });
            },
            timeout: callback.timeout,
            error: callback.error
        });
    }

    /**
     * Creates a response message builder from a received message header,
     * then acquires the newest master token for the response.
     *
     * @param {Object} task - The task context
     * @param {Object} mslContext - The MSL context
     * @param {MessageBuilderProxy} messageProxy - The message builder proxy
     * @param {Object} receivedHeader - The received message header
     * @param {number} timeout - Timeout in ms
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    createResponseMessageBuilder(task, mslContext, messageProxy, receivedHeader, timeout, callback) {
        const self = this;

        this._messageFactory.plc(mslContext, receivedHeader, {
            result(messageBuilder) {
                interruptibleComplete(callback, function () {
                    messageBuilder.onSegmentReceived(messageProxy.isNonReplayable());

                    self.getNewestMasterToken(task, mslContext, timeout, {
                        result(masterTokenCtx) {
                            interruptibleComplete(callback, function () {
                                try {
                                    const masterToken = masterTokenCtx && masterTokenCtx.mc;
                                    let userIdToken;

                                    if (masterToken) {
                                        const userId = messageProxy.getUserAuthDataId();
                                        const tokenStore = mslContext.decoderMap;
                                        const storedToken = userId ? tokenStore.yy(userId) : null;
                                        userIdToken = (storedToken && storedToken.hasStartedCheck(masterToken))
                                            ? storedToken : null;
                                    } else {
                                        userIdToken = null;
                                    }

                                    messageBuilder.cSb(masterToken, userIdToken);
                                    return { lb: messageBuilder, iq: masterTokenCtx };
                                } catch (err) {
                                    self.releaseMasterTokenLock(mslContext, masterTokenCtx);
                                }
                            });
                        },
                        timeout: callback.timeout,
                        error: callback.error
                    });
                });
            },
            error: callback.error
        });
    }

    // ── Error Recovery ──────────────────────────────────────────────────

    /**
     * Handles MSL error responses with recovery strategies based on the error code:
     *   - zi/zg (entity reauth): Re-authenticate the entity without master token
     *   - ud/internal_Wla (user reauth): Prompt for new user auth data
     *   - $e (key exchange): Retry with new key request
     *   - o7 (expired key request data): Retry with fresh key request data
     *   - m6 (master token expired/revoked): Get new master token + key exchange
     *   - TJa (token renewal): Acquire newest master token and retry
     *
     * @param {Object} task - The task context
     * @param {Object} mslContext - The MSL context
     * @param {MessageBuilderProxy} messageProxy - The message builder proxy
     * @param {SendRequest} sendRequest - The original send request
     * @param {Object} errorHeader - The error response header
     * @param {number} timeout - Timeout in ms
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    handleErrorResponse(task, mslContext, messageProxy, sendRequest, errorHeader, timeout, callback) {
        const self = this;

        /**
         * Builds a retry message with a fresh master token.
         * @param {Object} headerData - The original request header data
         * @param {Array} objectQueue - Queued message objects to resend
         */
        function buildWithMasterToken(headerData, objectQueue) {
            self.getNewestMasterToken(task, mslContext, timeout, {
                result(masterTokenCtx) {
                    interruptibleComplete(callback, function () {
                        const masterToken = masterTokenCtx && masterTokenCtx.mc;
                        const messageId = createMessageId(errorHeader.readString);
                        const queuedProxy = new QueuedMessageBuilderProxy(objectQueue, messageProxy);

                        self._messageFactory.WZ(mslContext, masterToken, null, messageId, {
                            result(builder) {
                                interruptibleComplete(callback, function () {
                                    builder.onSegmentReceived(queuedProxy.isNonReplayable());
                                    return {
                                        KH: new MessageBuilderContext(builder, queuedProxy),
                                        iq: masterTokenCtx
                                    };
                                });
                            },
                            error: callback.error
                        });
                    });
                },
                timeout: callback.timeout,
                error: callback.error
            });
        }

        /**
         * Builds a retry message without a master token (entity auth only).
         * @param {Object} headerData - The original request header data
         * @param {Array} objectQueue - Queued message objects to resend
         */
        function buildWithoutMasterToken(headerData, objectQueue) {
            interruptibleComplete(callback, function () {
                const messageId = createMessageId(errorHeader.readString);
                const queuedProxy = new QueuedMessageBuilderProxy(objectQueue, messageProxy);

                self._messageFactory.WZ(mslContext, null, null, messageId, {
                    result(builder) {
                        interruptibleComplete(callback, function () {
                            builder.onSegmentReceived(queuedProxy.isNonReplayable());
                            return {
                                KH: new MessageBuilderContext(builder, queuedProxy),
                                iq: null
                            };
                        });
                    },
                    error: callback.error
                });
            });
        }

        interruptibleComplete(callback, function () {
            const headerData = sendRequest.request.checkFunction();
            const objectQueue = sendRequest.request.objectQueue;
            const errorCode = errorHeader.errorCode;

            switch (errorCode) {
                // Entity re-authentication required (entity unknown or entity revoked)
                case MslConstants.ErrorType.zi:
                case MslConstants.ErrorType.zg:
                    mslContext.nsa({
                        result(success) {
                            interruptibleComplete(callback, function () {
                                if (!success) return null;
                                buildWithoutMasterToken(headerData, objectQueue);
                            });
                        },
                        error: callback.error
                    });
                    break;

                // User re-authentication required
                case MslConstants.ErrorType.ud:
                case MslConstants.ErrorType.internal_Wla:
                    messageProxy.getUserAuthData(errorCode, false, true, {
                        result(success) {
                            interruptibleComplete(callback, function () {
                                if (!success) return null;
                                buildWithMasterToken(headerData, objectQueue);
                            });
                        },
                        error: callback.error
                    });
                    break;

                // Key exchange required
                case MslConstants.ErrorType.$e:
                    buildWithMasterToken(headerData, objectQueue);
                    break;

                // Expired key request data - retry with force-renewed keys
                case MslConstants.ErrorType.o7:
                    messageProxy.getKeyRequestData({
                        result(keyRequestData) {
                            interruptibleComplete(callback, function () {
                                if (keyRequestData === null || keyRequestData.length === 0) return null;

                                const messageId = createMessageId(errorHeader.readString);
                                const queuedProxy = new QueuedMessageBuilderProxy(objectQueue, messageProxy);

                                self._messageFactory.WZ(mslContext, null, null, messageId, {
                                    result(builder) {
                                        interruptibleComplete(callback, function () {
                                            builder.F5a(true); // Force key renewal
                                            builder.onSegmentReceived(queuedProxy.isNonReplayable());
                                            return {
                                                KH: new MessageBuilderContext(builder, queuedProxy),
                                                iq: null
                                            };
                                        });
                                    },
                                    error: callback.error
                                });
                            });
                        },
                        error: callback.error
                    });
                    break;

                // Master token expired or revoked - get new token with key exchange
                case MslConstants.ErrorType.m6:
                    messageProxy.getKeyRequestData({
                        result(keyRequestData) {
                            interruptibleComplete(callback, function () {
                                if (keyRequestData === null || keyRequestData.length === 0) return null;

                                self.getNewestMasterToken(task, mslContext, timeout, {
                                    result(masterTokenCtx) {
                                        interruptibleComplete(callback, function () {
                                            const masterToken = masterTokenCtx && masterTokenCtx.mc;
                                            let userIdToken;

                                            if (masterToken) {
                                                const userId = messageProxy.getUserAuthDataId();
                                                const tokenStore = mslContext.decoderMap;
                                                userIdToken = userId ? tokenStore.yy(userId) : null;
                                                userIdToken = (userIdToken && userIdToken.hasStartedCheck(masterToken))
                                                    ? userIdToken : null;
                                            } else {
                                                userIdToken = null;
                                            }

                                            const messageId = createMessageId(errorHeader.readString);
                                            const queuedProxy = new QueuedMessageBuilderProxy(objectQueue, messageProxy);

                                            self._messageFactory.WZ(mslContext, masterToken, userIdToken, messageId, {
                                                result(builder) {
                                                    interruptibleComplete(callback, function () {
                                                        const originalMasterToken = headerData.mc;
                                                        // Only force key renewal if same master token
                                                        if (!originalMasterToken || originalMasterToken.equals(masterToken)) {
                                                            builder.F5a(true);
                                                        }
                                                        builder.onSegmentReceived(queuedProxy.isNonReplayable());
                                                        return {
                                                            KH: new MessageBuilderContext(builder, queuedProxy),
                                                            iq: masterTokenCtx
                                                        };
                                                    });
                                                },
                                                error: callback.error
                                            });
                                        });
                                    },
                                    timeout: callback.timeout,
                                    error: callback.error
                                });
                            });
                        },
                        error: callback.error
                    });
                    break;

                // Token renewal required
                case MslConstants.ErrorType.TJa:
                    self.getNewestMasterToken(task, mslContext, timeout, {
                        result(masterTokenCtx) {
                            interruptibleComplete(callback, function () {
                                const masterToken = masterTokenCtx && masterTokenCtx.mc;
                                let userIdToken;

                                if (masterToken) {
                                    const userId = messageProxy.getUserAuthDataId();
                                    const tokenStore = mslContext.decoderMap;
                                    userIdToken = userId ? tokenStore.yy(userId) : null;
                                    userIdToken = (userIdToken && userIdToken.hasStartedCheck(masterToken))
                                        ? userIdToken : null;
                                } else {
                                    userIdToken = null;
                                }

                                const messageId = createMessageId(errorHeader.readString);
                                const queuedProxy = new QueuedMessageBuilderProxy(objectQueue, messageProxy);

                                self._messageFactory.WZ(mslContext, masterToken, userIdToken, messageId, {
                                    result(builder) {
                                        interruptibleComplete(callback, function () {
                                            builder.onSegmentReceived(queuedProxy.isNonReplayable());
                                            return {
                                                KH: new MessageBuilderContext(builder, queuedProxy),
                                                iq: masterTokenCtx
                                            };
                                        });
                                    },
                                    error: callback.error
                                });
                            });
                        },
                        timeout: callback.timeout,
                        error: callback.error
                    });
                    break;

                default:
                    return null;
            }
        });
    }

    /**
     * Performs post-error cleanup of master tokens based on the error code.
     * Removes master tokens for entity reauth errors, removes user ID tokens
     * for key exchange / user reauth errors.
     *
     * @param {Object} mslContext - The MSL context
     * @param {Object} requestHeader - The original request header
     * @param {Object} errorHeader - The error response header
     */
    handleErrorHeaderCleanup(mslContext, requestHeader, errorHeader) {
        switch (errorHeader.errorCode) {
            case MslConstants.ErrorType.zg:
            case MslConstants.ErrorType.zi:
                this.removeMasterToken(mslContext, requestHeader.mc);
                break;
            case MslConstants.ErrorType.$e:
            case MslConstants.ErrorType.ud: {
                const userIdToken = requestHeader.isAborted;
                if (requestHeader.mc && userIdToken) {
                    mslContext.decoderMap.fga(userIdToken);
                }
                break;
            }
        }
    }

    // ── Send/Receive ────────────────────────────────────────────────────

    /**
     * Sends an MSL message. Builds the message header, prepares key exchange
     * if needed, creates the output stream, and writes the payload.
     *
     * @param {Object} task - The task context
     * @param {Object} mslContext - The MSL context
     * @param {MessageBuilderProxy} messageProxy - The message builder proxy
     * @param {string} requestData - Request/manifest data
     * @param {Object} messageBuilder - The message builder
     * @param {number} writeTimeout - Write timeout
     * @param {number} streamTimeout - Stream/debug timeout
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    sendMessage(task, mslContext, messageProxy, requestData, messageBuilder, writeTimeout, streamTimeout, callback) {
        const self = this;

        /**
         * Builds the header and sends through the output stream.
         */
        function buildAndSend(masterToken, userIdToken, isHandshake) {
            interruptibleComplete(callback, function () {
                const messageContext = new MessageContext(mslContext, messageProxy, messageBuilder);

                messageProxy.prepareMessage(messageContext, isHandshake, {
                    result() {
                        messageBuilder.getStreamHeader({
                            result(header) {
                                interruptibleComplete(callback, function () {
                                    // Notify debug context
                                    const debugCtx = messageProxy.getMessageDebugContext();
                                    if (debugCtx) debugCtx.sent(header);

                                    // Process key exchange data from header
                                    const keyExchangeData = messageBuilder.zK;
                                    self.processKeyResponseData(mslContext, header, keyExchangeData);
                                    self.updateServiceTokens(
                                        mslContext,
                                        keyExchangeData ? keyExchangeData.keyResponseData.mc : masterToken,
                                        userIdToken,
                                        header.lO
                                    );

                                    const cryptoContext = keyExchangeData ? keyExchangeData.qp : header.qp;

                                    if (task.isProcessing) {
                                        throw new MslInterruptedException('send aborted.');
                                    }

                                    // Apply message filter if configured
                                    const filteredData = self._messageFilter != null
                                        ? self._messageFilter.agd(requestData)
                                        : requestData;

                                    self._messageFactory.amc(mslContext, filteredData, header, cryptoContext, streamTimeout, {
                                        result(outputStream) {
                                            interruptibleComplete(callback, function () {
                                                task.e4(function () { outputStream.abort(); });
                                                outputStream.internal_Yhc(writeTimeout);

                                                outputStream.isReady({
                                                    result(ready) {
                                                        interruptibleComplete(callback, function () {
                                                            if (!ready) {
                                                                throw new MslInterruptedException('MessageOutputStream aborted.');
                                                            }
                                                            writePayload(outputStream, isHandshake);
                                                        });
                                                    },
                                                    timeout: callback.timeout,
                                                    error: callback.error
                                                });
                                            });
                                        },
                                        timeout: callback.timeout,
                                        error: callback.error
                                    });
                                });
                            },
                            timeout: callback.timeout,
                            error: callback.error
                        });
                    },
                    error: callback.error
                });
            });
        }

        /**
         * Writes the payload to the output stream, or returns immediately
         * if a handshake response is expected.
         */
        function writePayload(outputStream, isHandshake) {
            if (isHandshake) {
                interruptibleComplete(callback, function () {
                    return new SendRequest(outputStream, isHandshake);
                });
            } else {
                messageProxy.write(outputStream, streamTimeout, {
                    result() {
                        interruptibleComplete(callback, function () {
                            if (task.isProcessing) {
                                throw new MslInterruptedException('MessageOutputStream write aborted.');
                            }
                            return new SendRequest(outputStream, isHandshake);
                        });
                    },
                    timeout: callback.timeout,
                    error: callback.error
                });
            }
        }

        /**
         * Determines whether a handshake/key exchange is needed, gathers
         * key request data, then sends.
         */
        function prepareKeyRequestData(masterToken, userIdToken, forceHandshake) {
            interruptibleComplete(callback, function () {
                // Determine if handshake (key exchange) is needed
                const needsHandshake = !!(
                    forceHandshake ||
                    (messageProxy.isEncrypted() && !messageBuilder.$Xb()) ||
                    (messageProxy.isIntegrityProtected() && !messageBuilder.bYb())
                ) || (messageProxy.isNonReplayable() && !(messageBuilder.isNonReplayable() && masterToken));

                messageBuilder.wXc(needsHandshake);
                const keyRequestData = [];

                if (messageBuilder.timeUntilExpiry()) {
                    const remoteTime = mslContext.internal_Isa();

                    if (!masterToken || masterToken.timeUntilExpiry(remoteTime) || messageProxy.isNonReplayable()) {
                        messageProxy.getKeyRequestData({
                            result(data) {
                                interruptibleComplete(callback, function () {
                                    if (needsHandshake && (data === null || data.length === 0)) {
                                        throw new MslMessageException(MslErrorCode.a1b);
                                    }
                                    if (data !== null) {
                                        for (let i = 0; i < data.length; ++i) {
                                            const item = data[i];
                                            keyRequestData.push(item);
                                            messageBuilder.internal_Eac(item);
                                        }
                                    }
                                    buildAndSend(masterToken, userIdToken, needsHandshake, keyRequestData);
                                });
                            },
                            error: callback.error
                        });
                        return;
                    }
                }

                buildAndSend(masterToken, userIdToken, needsHandshake, keyRequestData);
            });
        }

        // ── Main send flow ──
        interruptibleComplete(callback, function () {
            const masterToken = messageBuilder.oE();
            const userIdToken = messageBuilder.yy();
            let forceHandshake = false;

            if (messageProxy.getUserAuthDataId()) {
                const noUserToken = !userIdToken;
                messageProxy.getUserAuthData(null, messageBuilder.timeUntilExpiry(), noUserToken, {
                    result(userAuthData) {
                        interruptibleComplete(callback, function () {
                            if (userAuthData) {
                                if (messageBuilder.ZXb() && messageBuilder.aYb()) {
                                    messageBuilder.iteratorValue(userAuthData);
                                } else {
                                    forceHandshake = true;
                                }
                            }
                            prepareKeyRequestData(masterToken, userIdToken, forceHandshake);
                        });
                    },
                    error: callback.error
                });
            } else {
                prepareKeyRequestData(masterToken, userIdToken, forceHandshake);
            }
        });
    }

    /**
     * Receives and validates an MSL response message. Creates an input stream,
     * validates the message ID, updates tokens, and returns the parsed message.
     *
     * @param {Object} task - The task context
     * @param {Object} mslContext - The MSL context
     * @param {MessageBuilderProxy} messageProxy - The message builder proxy
     * @param {string} requestData - The request data
     * @param {Object} requestHeader - The original request header for validation
     * @param {number} streamTimeout - Stream timeout
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    receiveResponse(task, mslContext, messageProxy, requestData, requestHeader, streamTimeout, callback) {
        const self = this;

        /**
         * Processes and validates the received response message.
         */
        function processResponse(responseStream) {
            interruptibleComplete(callback, function () {
                const messageHeader = responseStream.checkFunction();
                const errorHeader = responseStream.z0();

                // Notify debug context
                const debugCtx = messageProxy.getMessageDebugContext();
                if (debugCtx) debugCtx.received(messageHeader || errorHeader);

                let masterToken, keyTokens, userIdToken, errorCallbackFn;

                if (messageHeader) {
                    masterToken = messageHeader.mc;
                    keyTokens = messageHeader.jm;
                    userIdToken = messageHeader.isAborted;
                    errorCallbackFn = messageHeader.errorCallbackFn;
                } else {
                    masterToken = null;
                    keyTokens = errorHeader.jm;
                    userIdToken = null;
                    errorCallbackFn = null;
                }

                // Validate response message ID matches expected
                if (requestHeader) {
                    const errorCode = errorHeader ? errorHeader.errorCode : null;

                    if (messageHeader || (
                        errorCode !== MslConstants.ErrorType.ha &&
                        errorCode !== MslConstants.ErrorType.fs &&
                        errorCode !== MslConstants.ErrorType.zg &&
                        errorCode !== MslConstants.ErrorType.zi
                    )) {
                        const responseMessageId = messageHeader ? messageHeader.readString : errorHeader.readString;
                        const expectedMessageId = createMessageId(requestHeader.readString);

                        if (responseMessageId !== expectedMessageId) {
                            throw new MslMessageException(
                                MslErrorCode.J6b,
                                'expected ' + expectedMessageId + '; received ' + responseMessageId
                            ).qc(masterToken).fg(keyTokens).getLength(userIdToken).iteratorValue(errorCallbackFn);
                        }
                    }
                }

                try {
                    // Validate user identity in response
                    const expectedUserId = messageProxy.getUserId();
                    if (expectedUserId && keyTokens) {
                        const profileId = keyTokens.getProfileIdentifier();
                        if (profileId && expectedUserId !== profileId) {
                            throw new MslMessageException(
                                MslErrorCode.K2b,
                                'expected ' + expectedUserId + '; received ' + profileId
                            );
                        }
                    }

                    if (messageHeader) {
                        // Update master token from response key exchange
                        if (requestHeader) {
                            self.updateMasterTokenFromResponse(mslContext, requestHeader, responseStream);
                        }

                        const keyResponseData = messageHeader.keyResponseData;
                        const responseMasterToken = keyResponseData ? keyResponseData.mc : messageHeader.mc;
                        const responseUserIdToken = messageHeader.isAborted;
                        const serviceTokens = messageHeader.lO;

                        // Store user ID token if present
                        const userId = messageProxy.getUserAuthDataId();
                        if (userId && responseUserIdToken && !responseUserIdToken.networkResult) {
                            mslContext.decoderMap.adding(userId, responseUserIdToken);
                        }

                        self.updateServiceTokens(mslContext, responseMasterToken, responseUserIdToken, serviceTokens);
                    }

                    // Process entity authentication tokens
                    const entityAuthTokens = messageHeader
                        ? messageHeader.SWa()
                        : (errorHeader === null || errorHeader === undefined ? undefined : errorHeader.SWa());
                    if (entityAuthTokens && requestHeader) {
                        mslContext.j3c(entityAuthTokens);
                    }
                } catch (err) {
                    if (isMslError(err)) {
                        err.qc(masterToken);
                        err.fg(keyTokens);
                        err.getLength(userIdToken);
                        err.iteratorValue(errorCallbackFn);
                    }
                    throw err;
                }

                return responseStream;
            });
        }

        // ── Main receive flow ──
        interruptibleComplete(callback, function () {
            if (task.isProcessing) {
                throw new MslInterruptedException('receive aborted.');
            }

            // Copy key request data from the request header
            let keyRequestData = [];
            if (requestHeader) {
                keyRequestData = requestHeader.DE.filter(function () { return true; });
            }

            const cryptoContexts = messageProxy.getCryptoContexts();
            const filteredData = self._messageFilter
                ? self._messageFilter.internal_Sfd(requestData)
                : requestData;

            self._messageFactory.zRa(mslContext, filteredData, keyRequestData, cryptoContexts, streamTimeout, {
                result(inputStream) {
                    interruptibleComplete(callback, function () {
                        task.e4(function () { inputStream.abort(); });

                        inputStream.isReady({
                            result(ready) {
                                interruptibleComplete(callback, function () {
                                    if (!ready) {
                                        throw new MslInterruptedException('MessageInputStream aborted.');
                                    }
                                    processResponse(inputStream);
                                });
                            },
                            timeout: callback.timeout,
                            error: callback.error
                        });
                    });
                },
                timeout: callback.timeout,
                error: callback.error
            });
        });
    }

    // ── Full Exchange Cycle ──────────────────────────────────────────────

    /**
     * Performs a full send/receive exchange: acquires the renewal lock,
     * sends the message, optionally receives a response, then releases locks.
     *
     * @param {Object} task - The task context
     * @param {Object} mslContext - The MSL context
     * @param {MessageBuilderProxy} messageProxy - The message builder proxy
     * @param {string} requestData - Request data
     * @param {Object} builderContext - Context for the exchange
     * @param {Object} builderResult - {logBlobManager, iq}
     * @param {number} receiveMode - 0=always, 1=conditional, 2=send-only
     * @param {boolean} ownedConnection - Whether we opened the connection
     * @param {number} timeout - Timeout
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    performExchange(task, mslContext, messageProxy, requestData, builderContext, builderResult, receiveMode, ownedConnection, timeout, callback) {
        const self = this;

        /**
         * Executes the send/receive after lock acquisition.
         */
        function executeSendReceive(exchangeInfo, renewalQueue, lockAcquired) {
            interruptibleComplete(callback, function () {
                const messageBuilder = exchangeInfo.logBlobManager;
                const masterTokenCtx = exchangeInfo.iq;
                messageBuilder.F5a(lockAcquired);

                self.sendMessage(task, mslContext, messageProxy, requestData, messageBuilder, ownedConnection, timeout, {
                    result(sendResult) {
                        interruptibleComplete(callback, function () {
                            const requestHeader = sendResult.request.checkFunction();
                            const keyRequestData = requestHeader.DE;

                            // Determine whether to receive a response
                            const shouldReceive = !(
                                receiveMode === 0 ||
                                sendResult.tE ||
                                (receiveMode === 1 && (keyRequestData == null || keyRequestData.length === 0)) ||
                                (requestHeader.timeUntilExpiry() && requestHeader.mc && requestHeader.errorCallbackFn)
                            );

                            if (!shouldReceive) {
                                self.receiveResponse(task, mslContext, messageProxy, requestData, requestHeader, timeout, {
                                    result(response) {
                                        interruptibleComplete(callback, function () {
                                            const errorHeader = response.z0();
                                            if (errorHeader) {
                                                self.handleErrorHeaderCleanup(mslContext, requestHeader, errorHeader);
                                            }
                                            if (lockAcquired) {
                                                self.releaseRenewalLock(mslContext, renewalQueue, response);
                                            }
                                            self.releaseMasterTokenLock(mslContext, masterTokenCtx);
                                            response.bic(ownedConnection);
                                            return new SendResponse(response, sendResult);
                                        });
                                    },
                                    timeout() {
                                        interruptibleComplete(callback, function () {
                                            if (lockAcquired) self.releaseRenewalLock(mslContext, renewalQueue, null);
                                            self.releaseMasterTokenLock(mslContext, masterTokenCtx);
                                            callback.timeout();
                                        });
                                    },
                                    error(err) {
                                        interruptibleComplete(callback, function () {
                                            if (lockAcquired) self.releaseRenewalLock(mslContext, renewalQueue, null);
                                            self.releaseMasterTokenLock(mslContext, masterTokenCtx);
                                            callback.error(err);
                                        });
                                    }
                                });
                            } else {
                                interruptibleComplete(callback, function () {
                                    if (lockAcquired) self.releaseRenewalLock(mslContext, renewalQueue, null);
                                    self.releaseMasterTokenLock(mslContext, masterTokenCtx);
                                    return new SendResponse(null, sendResult);
                                });
                            }
                        });
                    },
                    timeout() {
                        interruptibleComplete(callback, function () {
                            if (lockAcquired) self.releaseRenewalLock(mslContext, renewalQueue, null);
                            self.releaseMasterTokenLock(mslContext, masterTokenCtx);
                            callback.timeout();
                        });
                    },
                    error(err) {
                        interruptibleComplete(callback, function () {
                            if (lockAcquired) self.releaseRenewalLock(mslContext, renewalQueue, null);
                            self.releaseMasterTokenLock(mslContext, masterTokenCtx);
                            callback.error(err);
                        });
                    }
                });
            });
        }

        // ── Main exchange flow ──
        interruptibleComplete(callback, function () {
            const renewalQueue = new RenewalLockQueue();

            self.acquireRenewalLock(task, mslContext, messageProxy, renewalQueue, builderResult, timeout, {
                result(lockAcquired) {
                    executeSendReceive(builderResult, renewalQueue, lockAcquired);
                },
                timeout() {
                    interruptibleComplete(callback, function () {
                        self.releaseMasterTokenLock(mslContext, builderResult.iq);
                        callback.timeout();
                    });
                },
                error(err) {
                    interruptibleComplete(callback, function () {
                        self.releaseMasterTokenLock(mslContext, builderResult.iq);
                        if (err instanceof MslInterruptedException) return null;
                        callback.error(err);
                    });
                }
            });
        });
    }

    // ── Renewal Lock Management ─────────────────────────────────────────

    /**
     * Acquires the renewal lock for this MSL context. Ensures only one
     * operation performs token renewal at a time. Checks whether renewal
     * is actually needed before acquiring.
     *
     * @param {Object} task - The task context
     * @param {Object} mslContext - The MSL context
     * @param {MessageBuilderProxy} messageProxy - The message builder proxy
     * @param {Object} renewalQueue - The renewal lock queue
     * @param {Object} builderResult - {logBlobManager, iq}
     * @param {number} timeout - Timeout
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    acquireRenewalLock(task, mslContext, messageProxy, renewalQueue, builderResult, timeout, callback) {
        const self = this;

        /**
         * Attempts to acquire the lock by waiting on an existing queue or
         * creating a new entry.
         */
        function tryAcquireLock(masterToken, userIdToken, userId, messageBuilder, masterTokenCtx) {
            interruptibleComplete(callback, function () {
                if (task.isProcessing) {
                    throw new MslInterruptedException('acquireRenewalLock aborted.');
                }

                // Find existing renewal queue for this MSL context
                let existingQueue = null;
                for (let i = 0; i < self._renewalLocks.length; ++i) {
                    const entry = self._renewalLocks[i];
                    if (entry.cryptoGenerator === mslContext) {
                        existingQueue = entry.queueing;
                        break;
                    }
                }

                // No existing queue - we are the first; create entry and acquire
                if (!existingQueue) {
                    self._renewalLocks.push({
                        Ik: mslContext,
                        queueing: renewalQueue
                    });
                    return true;
                }

                // Wait on the existing queue for the current renewal to complete
                const waitTicket = existingQueue.internal_Afa(timeout, {
                    result(lockResult) {
                        interruptibleComplete(callback, function () {
                            if (lockResult === undefined) {
                                throw new MslInterruptedException('acquireRenewalLock aborted.');
                            }

                            // Pass the result to the next waiter
                            existingQueue.item(lockResult);

                            if (lockResult === RENEWAL_LOCK_SENTINEL) {
                                // Sentinel means no master token was produced; retry
                                tryAcquireLock(masterToken, userIdToken, userId, messageBuilder, masterTokenCtx);
                            } else {
                                const previousMasterToken = masterToken;

                                if (masterToken && masterToken.equals(lockResult)) {
                                    // Same master token - check if renewal still needed
                                    checkRenewalNeeded(previousMasterToken, masterToken, userIdToken, userId, messageBuilder, masterTokenCtx);
                                } else {
                                    // Master token changed - release old lock and re-acquire
                                    self.releaseMasterTokenLock(mslContext, masterTokenCtx);
                                    self.getNewestMasterToken(task, mslContext, timeout, {
                                        result(newMasterTokenCtx) {
                                            interruptibleComplete(callback, function () {
                                                masterToken = (builderResult.iq = newMasterTokenCtx) && newMasterTokenCtx.mc;
                                                if (masterToken) {
                                                    checkRenewalNeeded(previousMasterToken, masterToken, userIdToken, userId, messageBuilder, newMasterTokenCtx);
                                                } else {
                                                    tryAcquireLock(masterToken, userIdToken, userId, messageBuilder, newMasterTokenCtx);
                                                }
                                            });
                                        },
                                        timeout: callback.timeout,
                                        error: callback.error
                                    });
                                }
                            }
                        });
                    },
                    timeout: callback.timeout,
                    error: callback.error
                });

                task.e4(function () {
                    if (waitTicket) existingQueue.cancel(waitTicket);
                });
            });
        }

        /**
         * Checks whether renewal is actually needed and acquires the lock if so.
         */
        function checkIfRenewalNeeded(masterToken, userIdToken) {
            interruptibleComplete(callback, function () {
                if (task.isProcessing) {
                    throw new MslInterruptedException('acquireRenewalLock aborted.');
                }

                const remoteTime = mslContext.internal_Isa();

                if (!masterToken ||
                    masterToken.timeUntilExpiry(remoteTime) ||
                    (!userIdToken && messageProxy.getUserAuthDataId()) ||
                    (userIdToken && userIdToken.timeUntilExpiry(remoteTime))) {

                    // Need renewal - find or create queue entry
                    let existingQueue = null;
                    for (let i = 0; i < self._renewalLocks.length; ++i) {
                        const entry = self._renewalLocks[i];
                        if (entry.cryptoGenerator === mslContext) {
                            existingQueue = entry.queueing;
                            break;
                        }
                    }

                    if (!existingQueue) {
                        self._renewalLocks.push({
                            Ik: mslContext,
                            queueing: renewalQueue
                        });
                        return true;
                    }
                }

                return false;
            });
        }

        /**
         * After lock acquisition, verifies token state and decides whether
         * to actually perform renewal.
         */
        function checkRenewalNeeded(previousMasterToken, masterToken, userIdToken, userId, messageBuilder, masterTokenCtx) {
            interruptibleComplete(callback, function () {
                // Refresh user ID token if stale
                if ((userId && !userIdToken) || (userIdToken && !userIdToken.hasStartedCheck(masterToken))) {
                    const storedToken = mslContext.decoderMap.yy(userId);
                    userIdToken = (storedToken && storedToken.hasStartedCheck(masterToken)) ? storedToken : null;
                }

                messageBuilder.cSb(masterToken, userIdToken);
                const remoteTime = mslContext.internal_Isa();

                if (masterToken.matchExpiry(remoteTime)) {
                    // Master token expired - must renew
                    tryAcquireLock(masterToken, userIdToken, userId, messageBuilder, masterTokenCtx);
                } else if (messageBuilder.timeUntilExpiry() && masterToken.equals(previousMasterToken)) {
                    // Builder is renewable and token hasn't changed - try renewal
                    tryAcquireLock(masterToken, userIdToken, userId, messageBuilder, masterTokenCtx);
                } else if (messageProxy.requiresUserAuthentication() && !userIdToken) {
                    // Need user ID token but don't have one - must renew
                    tryAcquireLock(masterToken, userIdToken, userId, messageBuilder, masterTokenCtx);
                } else {
                    // No forced renewal - check if opportunistic renewal makes sense
                    checkIfRenewalNeeded(masterToken, userIdToken);
                }
            });
        }

        // ── Main lock acquisition flow ──
        interruptibleComplete(callback, function () {
            const messageBuilder = builderResult.logBlobManager;
            const masterTokenCtx = builderResult.iq;
            const masterToken = messageBuilder.oE();
            const userIdToken = messageBuilder.yy();
            const userId = messageProxy.getUserAuthDataId();
            const remoteTime = mslContext.internal_Isa();

            // Determine if renewal is needed
            const needsRenewal =
                (messageProxy.isEncrypted() && !messageBuilder.$Xb()) ||
                (messageProxy.isIntegrityProtected() && !messageBuilder.bYb()) ||
                messageBuilder.timeUntilExpiry() ||
                (!masterToken && messageProxy.isNonReplayable()) ||
                (masterToken && masterToken.matchExpiry(remoteTime)) ||
                !(userIdToken || !userId || (messageBuilder.ZXb() && messageBuilder.aYb())) ||
                (messageProxy.requiresUserAuthentication() && (!masterToken || (userId && !userIdToken)));

            if (needsRenewal) {
                tryAcquireLock(masterToken, userIdToken, userId, messageBuilder, masterTokenCtx);
            } else {
                checkIfRenewalNeeded(masterToken, userIdToken);
            }
        });
    }

    /**
     * Releases the renewal lock and signals the next waiting thread with
     * the new master token from the response, or the sentinel value if
     * no master token was produced.
     *
     * @param {Object} mslContext - The MSL context
     * @param {Object} renewalQueue - The renewal lock queue to release
     * @param {Object|null} responseStream - The response message (or null on failure)
     */
    releaseRenewalLock(mslContext, renewalQueue, responseStream) {
        let lockIndex, lockEntry;

        for (let i = 0; i < this._renewalLocks.length; ++i) {
            const entry = this._renewalLocks[i];
            if (entry.cryptoGenerator === mslContext) {
                lockIndex = i;
                lockEntry = entry.queueing;
                break;
            }
        }

        if (lockEntry !== renewalQueue) {
            throw new MslInternalException('Attempt to release renewal lock that is not owned by this queue.');
        }

        // Signal the next waiter with the new master token or sentinel
        if (responseStream) {
            const messageHeader = responseStream.checkFunction();
            if (messageHeader) {
                const keyResponseData = messageHeader.keyResponseData;
                if (keyResponseData) {
                    renewalQueue.item(keyResponseData.mc);
                } else {
                    const responseMasterToken = messageHeader.mc;
                    if (responseMasterToken) {
                        renewalQueue.item(responseMasterToken);
                    } else {
                        renewalQueue.item(RENEWAL_LOCK_SENTINEL);
                    }
                }
            } else {
                renewalQueue.item(RENEWAL_LOCK_SENTINEL);
            }
        } else {
            renewalQueue.item(RENEWAL_LOCK_SENTINEL);
        }

        this._renewalLocks.splice(lockIndex, 1);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// No-op callback for fire-and-forget close operations
// ─────────────────────────────────────────────────────────────────────────────

/** @type {Object} No-op callbacks used during cleanup/close operations */
const NOOP_CALLBACK = {
    result() {},
    timeout() {},
    error() {}
};

// ─────────────────────────────────────────────────────────────────────────────
// RequestTask - Request/response exchange task with retry and error recovery
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represents a single MSL request/response operation that can be executed,
 * retried, and cancelled. Manages the full lifecycle including handshake,
 * error recovery, and retry with new keys.
 */
class RequestTask {
    /**
     * @param {MslControllerCore} controllerCore - The MSL controller core
     * @param {Object} mslContext - The MSL context (decoder state)
     * @param {MessageBuilderProxy} messageProxy - The message builder proxy
     * @param {Object} connectionFactory - Factory/URL for creating connections
     * @param {Object} requestOutputStream - Existing output stream (or null)
     * @param {Object} responseInputStream - Existing input stream (or null)
     * @param {Object} previousExchange - Previous exchange result for retry (or null)
     * @param {number} receiveMode - 0=always receive, 1=conditional, 2=send-only
     * @param {number} attemptCount - Current retry attempt count
     * @param {number} timeout - Operation timeout in ms
     */
    constructor(controllerCore, mslContext, messageProxy, connectionFactory, requestOutputStream, responseInputStream, previousExchange, receiveMode, attemptCount, timeout) {
        let previousBuilder = null;
        let previousMasterTokenCtx = null;
        if (previousExchange) {
            previousBuilder = previousExchange.logBlobManager;
            previousMasterTokenCtx = previousExchange.iq;
        }

        /** @type {MslControllerCore} */
        this._controllerCore = controllerCore;
        /** @type {Object} */
        this._mslContext = mslContext;
        /** @type {MessageBuilderProxy} */
        this._messageProxy = messageProxy;
        /** @type {Object} */
        this._connectionFactory = connectionFactory;
        /** @type {Object|null} */
        this._outputStream = requestOutputStream;
        /** @type {Object|null} */
        this._inputStream = responseInputStream;
        /** @type {boolean} Whether we opened the connection */
        this._ownedConnection = false;
        /** @type {Object|null} */
        this._previousBuilder = previousBuilder;
        /** @type {Object|null} */
        this._previousMasterTokenCtx = previousMasterTokenCtx;
        /** @type {number} */
        this._receiveMode = receiveMode;
        /** @type {number} */
        this._timeout = timeout;
        /** @type {number} */
        this._attemptCount = attemptCount;
        /** @type {boolean} */
        this.isProcessing = false;
        /** @type {boolean} Whether max retries was reached */
        this._maxRetriesHit = false;
        /** @type {Function|null} */
        this._abortCallback = null;
    }

    /** Aborts this task, triggering any registered abort callbacks. */
    abort() {
        this.isProcessing = true;
        if (this._abortCallback) {
            this._abortCallback.call(this);
        }
    }

    /**
     * Registers an abort callback.
     * @param {Function} callback - Called when abort() is invoked
     */
    e4(callback) {
        this._abortCallback = callback;
    }

    /**
     * Executes the request/response cycle with error recovery.
     *
     * @param {MessageBuilderProxy} messageProxy - The message builder proxy
     * @param {Object} builderContext - {lb: messageBuilder, iq: masterTokenCtx}
     * @param {number} timeout - Timeout
     * @param {number} attemptCount - Current attempt count
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    execute(messageProxy, builderContext, timeout, attemptCount, callback) {
        const self = this;

        /**
         * Handles a successful response (contains a message header, not an error).
         * If a handshake was performed, builds a response and retries.
         */
        function handleSuccessResponse(exchangeResult) {
            interruptibleComplete(callback, function () {
                const responseStream = exchangeResult.response;
                const messageHeader = responseStream.checkFunction();

                // No handshake needed - return the exchange result
                if (!exchangeResult.tE) {
                    return new MslControlResult(responseStream, exchangeResult.request);
                }

                // Handshake was performed - need to close streams and resend
                closeStreams(exchangeResult, function (ok) {
                    interruptibleComplete(callback, function () {
                        if (!ok) return null;

                        const queuedProxy = new QueuedMessageBuilderProxy(null, messageProxy);
                        self._controllerCore.createResponseMessageBuilder(
                            self, self._mslContext, messageProxy, messageHeader, timeout, {
                                result(newBuilderCtx) {
                                    interruptibleComplete(callback, function () {
                                        const retryTask = new RequestTask(
                                            self._controllerCore, self._mslContext, queuedProxy,
                                            self._connectionFactory, null, null, newBuilderCtx,
                                            self._receiveMode, attemptCount, self._timeout
                                        );
                                        self.e4(function () { retryTask.abort(); });
                                        retryTask.call(callback);
                                    });
                                },
                                timeout: callback.timeout,
                                error: callback.error
                            }
                        );
                    });
                });
            });
        }

        /**
         * Handles an error response by invoking error recovery.
         */
        function handleErrorResponse(exchangeResult) {
            interruptibleComplete(callback, function () {
                const responseStream = exchangeResult.response;

                self._controllerCore.handleErrorResponse(
                    self, self._mslContext, messageProxy, exchangeResult, responseStream.z0(), timeout, {
                        result(recoveryResult) {
                            interruptibleComplete(callback, function () {
                                if (!recoveryResult) {
                                    return new MslControlResult(responseStream, null);
                                }

                                const recoveryContext = recoveryResult.KH;
                                const retryTask = new RequestTask(
                                    self._controllerCore, self._mslContext, recoveryContext.hKc,
                                    self._connectionFactory, null, null,
                                    { lb: recoveryContext.logBlobManager, iq: recoveryResult.iq },
                                    self._receiveMode, attemptCount, self._timeout
                                );

                                self.e4(function () { retryTask.abort(); });

                                retryTask.call({
                                    result(retryResult) {
                                        interruptibleComplete(callback, function () {
                                            self._maxRetriesHit = retryTask._maxRetriesHit;
                                            handleFinalResult(exchangeResult, retryResult);
                                        });
                                    },
                                    timeout: callback.timeout,
                                    error: callback.error
                                });
                            });
                        },
                        timeout: callback.timeout,
                        error: callback.error
                    }
                );
            });
        }

        /**
         * Determines the final result after error recovery.
         */
        function handleFinalResult(originalExchange, retryResult) {
            interruptibleComplete(callback, function () {
                return (self._maxRetriesHit || (retryResult && !retryResult.input))
                    ? new MslControlResult(originalExchange.response, null)
                    : retryResult;
            });
        }

        /**
         * Closes both request and response streams, with error handling.
         */
        function closeStreams(exchangeResult, onComplete) {
            exchangeResult.request.closing(self._timeout, {
                result(requestClosed) {
                    if (requestClosed) {
                        exchangeResult.response.closing(self._timeout, {
                            result(responseClosed) { onComplete.call(self, responseClosed); },
                            timeout() { onComplete.call(self, true); },
                            error(err) {
                                if (isMslInterruptedError(err)) onComplete.call(self, false);
                                onComplete.call(self, true);
                            }
                        });
                    } else {
                        onComplete.call(self, false);
                    }
                },
                timeout() {
                    exchangeResult.response.closing(self._timeout, {
                        result(responseClosed) { onComplete.call(self, responseClosed); },
                        timeout() { onComplete.call(self, true); },
                        error(err) {
                            if (isMslInterruptedError(err)) onComplete.call(self, false);
                            onComplete.call(self, true);
                        }
                    });
                },
                error(err) {
                    if (isMslInterruptedError(err)) {
                        onComplete.call(self, false);
                        return;
                    }
                    exchangeResult.response.closing(self._timeout, {
                        result(responseClosed) { onComplete.call(self, responseClosed); },
                        timeout() { onComplete.call(self, true); },
                        error(err2) {
                            if (isMslInterruptedError(err2)) onComplete.call(self, false);
                            onComplete.call(self, true);
                        }
                    });
                }
            });
        }

        /**
         * Handles error response that requires closing streams first.
         */
        function handleClosedError(exchangeResult) {
            interruptibleComplete(callback, function () {
                closeStreams(exchangeResult, function (ok) {
                    if (ok) {
                        handleErrorResponse(exchangeResult);
                    } else {
                        callback.result(null);
                    }
                });
            });
        }

        // ── Main execute flow ──
        interruptibleComplete(callback, function () {
            // Check max retries
            if (attemptCount + 2 > MslConstants.w2b) {
                self._controllerCore.releaseMasterTokenLock(self._mslContext, builderContext.iq);
                self._maxRetriesHit = true;
                return null;
            }

            self._controllerCore.performExchange(
                self, self._mslContext, messageProxy, self._outputStream, self._inputStream,
                builderContext, self._receiveMode, self._ownedConnection, timeout, {
                    result(exchangeResult) {
                        interruptibleComplete(callback, function () {
                            if (!exchangeResult) return null;

                            attemptCount += 2;

                            if (!exchangeResult.response) {
                                return new MslControlResult(exchangeResult.response, exchangeResult.request);
                            }

                            if (exchangeResult.response.checkFunction()) {
                                handleSuccessResponse(exchangeResult);
                            } else {
                                handleClosedError(exchangeResult);
                            }
                        });
                    },
                    timeout: callback.timeout,
                    error: callback.error
                }
            );
        });
    }

    /**
     * Entry point for executing this task. Opens a connection if needed,
     * acquires a message builder, then executes the request/response cycle.
     *
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    call(callback) {
        const self = this;

        /**
         * Begins execution with the given message builder and master token context.
         */
        function executeWithBuilder(messageBuilder, masterTokenCtx, timeout) {
            interruptibleComplete(callback, function () {
                self.execute(self._messageProxy, { lb: messageBuilder, iq: masterTokenCtx }, timeout, self._attemptCount, {
                    result(result) {
                        interruptibleComplete(callback, function () {
                            // Close output stream after completion
                            if (result && result.cU) result.cU.l_c();

                            // Close input stream if we opened connection but got no response
                            if (!self._ownedConnection || (result && result.input)) {
                                // Keep open
                            } else {
                                self._outputStream.closing(timeout, NOOP_CALLBACK);
                            }

                            return result;
                        });
                    },
                    timeout() {
                        interruptibleComplete(callback, function () {
                            if (self._ownedConnection) {
                                self._inputStream.closing(timeout, NOOP_CALLBACK);
                                self._outputStream.closing(timeout, NOOP_CALLBACK);
                            }
                            callback.timeout();
                        });
                    },
                    error(err) {
                        interruptibleComplete(callback, function () {
                            if (self._ownedConnection) {
                                self._inputStream.closing(timeout, NOOP_CALLBACK);
                                self._outputStream.closing(timeout, NOOP_CALLBACK);
                            }
                            if (isMslInterruptedError(err)) return null;
                            callback.error(err);
                        });
                    }
                });
            });
        }

        // ── Main call flow ──
        interruptibleComplete(callback, function () {
            let timeout = self._timeout;

            // Open connection if we don't have streams
            if (!self._outputStream || !self._inputStream) {
                try {
                    self._connectionFactory.setTimeout(self._timeout);
                    const startTime = Date.now();
                    const streams = self._connectionFactory.qNc();
                    self._inputStream = streams.cU;
                    self._outputStream = streams.input;

                    if (timeout !== -1) {
                        timeout = self._timeout - (Date.now() - startTime);
                    }

                    self._ownedConnection = true;
                } catch (err) {
                    if (self._previousBuilder) {
                        self._controllerCore.releaseMasterTokenLock(self._mslContext, self._previousMasterTokenCtx);
                    }
                    if (self._inputStream) self._inputStream.closing(self._timeout, NOOP_CALLBACK);
                    if (self._outputStream) self._outputStream.closing(self._timeout, NOOP_CALLBACK);
                    if (isMslInterruptedError(err)) return null;
                    throw err;
                }
            }

            if (self._previousBuilder) {
                // Use existing message builder from previous exchange
                executeWithBuilder(self._previousBuilder, self._previousMasterTokenCtx, timeout);
            } else {
                // Create a new message builder
                self._controllerCore.createInitialMessageBuilder(self, self._mslContext, self._messageProxy, self._timeout, {
                    result(builderResult) {
                        interruptibleComplete(callback, function () {
                            executeWithBuilder(builderResult.logBlobManager, builderResult.iq, timeout);
                        });
                    },
                    timeout() {
                        interruptibleComplete(callback, function () {
                            if (self._ownedConnection) {
                                self._inputStream.closing(self._timeout, NOOP_CALLBACK);
                                self._outputStream.closing(self._timeout, NOOP_CALLBACK);
                            }
                            callback.timeout();
                        });
                    },
                    error(err) {
                        interruptibleComplete(callback, function () {
                            if (self._ownedConnection) {
                                self._inputStream.closing(self._timeout, NOOP_CALLBACK);
                                self._outputStream.closing(self._timeout, NOOP_CALLBACK);
                            }
                            if (isMslInterruptedError(err)) return null;
                            callback.error(err);
                        });
                    }
                });
            }
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// SendTask - Send-only MSL operation (no response expected)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wraps a RequestTask configured for send-only mode (receiveMode=2).
 * Returns only the output stream, not the full exchange result.
 */
class SendTask {
    /**
     * @param {MslControllerCore} controllerCore - The MSL controller core
     * @param {Object} mslContext - The MSL context
     * @param {MessageBuilderProxy} messageProxy - The message builder proxy
     * @param {Object} connectionFactory - Connection factory
     * @param {Object} requestOutputStream - Existing output stream
     * @param {Object} responseInputStream - Existing input stream
     * @param {number} timeout - Operation timeout
     */
    constructor(controllerCore, mslContext, messageProxy, connectionFactory, requestOutputStream, responseInputStream, timeout) {
        this._requestTask = new RequestTask(
            controllerCore, mslContext, messageProxy, connectionFactory,
            requestOutputStream, responseInputStream, null, 2, 0, timeout
        );
    }

    /**
     * Executes the send-only operation.
     * @param {Object} callback - Async callbacks {result, timeout, error}
     */
    call(callback) {
        this._requestTask.call({
            result(result) {
                asyncComplete(callback, function () {
                    return result ? result.cU : null;
                });
            },
            timeout: callback.timeout,
            error: callback.error
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MslControl - Public API for MSL message operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Main public API for the MSL control layer with concurrency-controlled
 * send and request operations. Uses an optional semaphore to limit
 * concurrent MSL operations.
 *
 * Usage:
 *   const mslControl = new MslControl(maxConcurrent, messageFactory);
 *   const cancel = mslControl.request(mslContext, messageProxy, connectionUrl, timeout, callbacks);
 *   cancel(); // to abort the operation
 */
export class MslControl {
    /**
     * @param {number} [maxConcurrent] - Maximum concurrent operations (0 or omitted = unlimited)
     * @param {Object} [messageFactory] - Optional message factory
     */
    constructor(maxConcurrent, messageFactory) {
        let semaphore = null;
        if (typeof maxConcurrent === 'number' && maxConcurrent > 0) {
            semaphore = new Semaphore(maxConcurrent);
        }
        /** @type {MslControllerCore} */
        this._controllerCore = new MslControllerCore(messageFactory);
        /** @type {Semaphore|null} */
        this._semaphore = semaphore;
        /** @type {boolean} */
        this._isShutdown = false;
    }

    /**
     * Submits a task for execution, optionally waiting on the semaphore
     * to control concurrency.
     *
     * @param {Object} task - Task with a call() method
     * @param {*} defaultResult - Default result if semaphore denies access
     * @param {number} timeout - Timeout value
     * @param {Object} callback - Async callbacks {result, timeout, error}
     * @returns {Function} Cancellation function
     */
    submit(task, defaultResult, timeout, callback) {
        const self = this;

        if (this._semaphore) {
            const wrappedCallback = {
                result(result) {
                    asyncComplete(callback, function () {
                        self._semaphore.signal();
                        return result;
                    });
                },
                timeout() {
                    asyncComplete(callback, function () {
                        self._semaphore.signal();
                        callback.timeout();
                    });
                },
                error(err) {
                    asyncComplete(callback, function () {
                        self._semaphore.signal();
                        callback.error(err);
                    });
                }
            };

            const ticket = this._semaphore.wait(timeout, {
                result(acquired) {
                    if (acquired) {
                        setTimeout(function () { task.call(wrappedCallback); }, 0);
                    } else {
                        callback.result(defaultResult);
                    }
                },
                timeout: callback.timeout,
                error: callback.error
            });

            return createCanceller(this, ticket, task);
        }

        setTimeout(function () { task.call(callback); }, 0);
        return createCanceller(this, null, task);
    }

    /**
     * Sends an MSL message (send-only, no response expected).
     *
     * @param {Object} mslContext - The MSL context
     * @param {Object} messageProxy - The message builder proxy
     * @param {...*} args - Variable arguments:
     *   3 args: [connectionFactory, timeout, callback]
     *   4 args: [inputStream, outputStream, timeout, callback]
     * @returns {Function} Cancellation function
     */
    send(mslContext, messageProxy, ...args) {
        if (this._isShutdown) {
            throw new MslException('MslControl is shutdown.');
        }

        let connectionFactory, requestOutputStream, responseInputStream, timeout, cb;

        if (args.length === 3) {
            connectionFactory = args[0];
            requestOutputStream = null;
            responseInputStream = null;
            timeout = args[1];
            cb = args[2];
        } else if (args.length === 4) {
            connectionFactory = null;
            requestOutputStream = args[0];
            responseInputStream = args[1];
            timeout = args[2];
            cb = args[3];
        }

        new NoUserAuthMessageBuilderProxy(messageProxy);

        const task = new SendTask(
            this._controllerCore, mslContext, messageProxy,
            connectionFactory, requestOutputStream, responseInputStream, timeout
        );

        return this.submit(task, null, timeout, cb);
    }

    /**
     * Sends an MSL request and receives a response.
     *
     * @param {Object} mslContext - The MSL context
     * @param {Object} messageProxy - The message builder proxy
     * @param {...*} args - Variable arguments:
     *   3 args: [connectionFactory, timeout, callback]
     *   4 args: [inputStream, outputStream, timeout, callback]
     * @returns {Function} Cancellation function
     */
    request(mslContext, messageProxy, ...args) {
        if (this._isShutdown) {
            throw new MslException('MslControl is shutdown.');
        }

        let connectionFactory, requestOutputStream, responseInputStream, timeout, cb;

        if (args.length === 3) {
            connectionFactory = args[0];
            requestOutputStream = null;
            responseInputStream = null;
            timeout = args[1];
            cb = args[2];
        } else if (args.length === 4) {
            connectionFactory = null;
            requestOutputStream = args[0];
            responseInputStream = args[1];
            timeout = args[2];
            cb = args[3];
        }

        const task = new RequestTask(
            this._controllerCore, mslContext, messageProxy,
            connectionFactory, requestOutputStream, responseInputStream,
            null, 0, 0, timeout
        );

        return this.submit(task, null, timeout, cb);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export { MslControlResult as j3b };
export { MslControllerCore as m3b };
export { MslControl as l3b };
export default MslControl;
