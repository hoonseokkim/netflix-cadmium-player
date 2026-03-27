/**
 * Netflix Cadmium Player - MSL Token Store
 *
 * Implements the MSL (Message Security Layer) Token Store, extending the base
 * MslStore. Manages master tokens, user ID tokens, and service tokens for
 * authenticated streaming sessions. Handles key serialization/deserialization
 * with optional system-key wrapping for secure persistence.
 *
 * @module MslTokenStore
 * @see Webpack Module 74810
 */

import { hh as MslCrypto } from '../modules/Module_50441.js';               // p - WebCrypto abstraction
import { default as MslError } from './MslTokenStore_25137.js';             // c - MslError constructor
import { default as MslErrorCodes } from '../msg/MessageCapabilities.js';       // g - Error code enum (.WC etc.)
import {
    stringifyFn as encodeBase64,
    decodeBase64
} from '../msg/MessageHeader.js';                                         // f - Base64 encode/decode
import { default as asyncExecutor } from '../msg/MessageCapabilities.js';       // e - Async callback executor
import { af as WebCryptoAlgorithms } from '../modules/Module_96837.js';      // h - Algorithm definitions (.XO = AES-CBC, .fX = HMAC)
import { BG as KeyUsages } from '../crypto/KeyUsages.js';                // k - Key usage constants
import { f8 as MasterTokenCryptoContext } from '../msg/MessageHeader.js'; // l - MasterToken CryptoContext
import { nj as MslObject } from '../modules/Module_9000.js';                // m - MSL object wrapper
import { UX as MslStore } from '../modules/Module_25137.js';                // n - Base MslStore class
import { internal_Bxa as parseMasterToken } from './KeyResponseData.js'; // q - MasterToken parser
import { d2a as parseUserIdToken } from '../msg/MessageHeader.js';        // r - UserIdToken parser
import { internal_Exa as parseServiceToken } from '../msg/MessageHeader.js'; // u - ServiceToken parser
import { $Ka as SymmetricCryptoContext } from '../modules/Module_72672.js';  // v - SymmetricCryptoContext
import { yKa as SecretKey } from '../modules/Module_60426.js';              // w - SecretKey wrapper

/**
 * Service token names that should be excluded from the store.
 * These streaming-specific tokens are managed separately.
 * @type {Record<string, boolean>}
 */
const EXCLUDED_SERVICE_TOKENS = {
    'streaming.servicetokens.movie': true,
    'streaming.servicetokens.license': true,
};

/**
 * Cached system key used for wrapping/unwrapping crypto keys.
 * Shared across all MslTokenStore instances.
 * @type {CryptoKey|null}
 */
let cachedSystemKey = null;

/**
 * MSL Token Store - manages master tokens, user ID tokens, and service tokens
 * for Netflix MSL-authenticated streaming sessions.
 *
 * @extends MslStore
 */
class MslTokenStore extends MslStore {
    /**
     * @param {Object} debugLogger - Logger instance for debug/error tracing
     * @param {string} esn - ESN (device identifier) bound to this token store
     * @param {Object} keyExchangeRequestData - Current key exchange request data
     * @param {Function|null} keyExchangeDataGenerator - Async generator for new key exchange data
     * @param {string} systemKeyAlgorithm - Algorithm name for system key generation (e.g., "AES-KW")
     * @param {string|null} systemKeyWrapFormat - Key wrap format (e.g., "jwk"); null if wrapping disabled
     */
    constructor(debugLogger, esn, keyExchangeRequestData, keyExchangeDataGenerator, systemKeyAlgorithm, systemKeyWrapFormat) {
        super();

        /** @type {Object} */
        this.debugLogger = debugLogger;

        /** @type {string} */
        this.esn = esn;

        /** @type {Object} */
        this.keyExchangeRequestData = keyExchangeRequestData;

        /** @type {Function|null} */
        this.keyExchangeDataGenerator = keyExchangeDataGenerator;

        /**
         * Algorithm name used for generating the system wrapping key.
         * @type {string}
         * @private
         */
        this._systemKeyAlgorithm = systemKeyAlgorithm;

        /**
         * Key wrap format for system key wrapping. When null/falsy, keys are
         * stored directly without system key wrapping.
         * @type {string|null}
         * @private
         */
        this._systemKeyWrapFormat = systemKeyWrapFormat;

        /**
         * Additional key exchange state to persist (e.g., public/private keys).
         * Set when new key exchange request data is generated.
         * @type {Object|null}
         * @private
         */
        this._keyExchangeExtraState = null;
    }

    /**
     * Adds a master token to the store. Optionally triggers generation of
     * new key exchange request data (skipped during restore from persistence).
     *
     * @param {Object} masterToken - The master token to store
     * @param {Object} cryptoContext - The associated crypto context
     * @param {boolean} [skipKeyExchangeGeneration=false] - When true, skip generating new keyx data
     */
    addMasterToken(masterToken, cryptoContext, skipKeyExchangeGeneration) {
        this.debugLogger.pauseTrace('Adding MasterToken', {
            SequenceNumber: masterToken.pk,
            SerialNumber: masterToken.SerialNumber,
            Expiration: masterToken.expirationTime().getTime(),
        });

        super.adding(masterToken, cryptoContext);

        if (!skipKeyExchangeGeneration && this.keyExchangeDataGenerator) {
            this.debugLogger.pauseTrace('Generating new keyx request data');
            this.keyExchangeDataGenerator().then(
                (result) => {
                    const iter = Fa(result);
                    this.keyExchangeRequestData = iter.next().value;
                    this._keyExchangeExtraState = iter.next().value;
                },
                (error) => {
                    this.debugLogger.error('Unable to generate new keyx request data', '' + error);
                }
            );
        }
    }

    /**
     * Adds a user ID token to the store.
     *
     * @param {string} userId - The user identifier
     * @param {Object} userIdToken - The user ID token to store
     */
    addUserIdToken(userId, userIdToken) {
        this.debugLogger.pauseTrace('Adding UserIdToken', {
            UserId: userId,
            SerialNumber: userIdToken.SerialNumber,
            MTSerialNumber: userIdToken.ik,
            Expiration: userIdToken.expirationTime().getTime(),
        });

        super.adding(userId, userIdToken);
    }

    /**
     * Adds service tokens to the store, filtering out excluded streaming tokens.
     *
     * @param {Array<Object>} serviceTokens - Array of service tokens
     */
    addServiceTokens(serviceTokens) {
        const filtered = serviceTokens.filter((token) => !EXCLUDED_SERVICE_TOKENS[token.name]);
        super.internal_Sna(filtered);
    }

    /**
     * Returns a list of all user IDs that have tokens in this store.
     *
     * @returns {string[]} Array of user ID strings
     */
    getUserIds() {
        const userIds = [];
        for (const userId in this.objectProperties) {
            userIds.push(userId);
        }
        return userIds;
    }

    /**
     * Returns the current key exchange request data.
     *
     * @returns {Object} The key exchange request data
     */
    getKeyExchangeRequestData() {
        return this.keyExchangeRequestData;
    }

    /**
     * Serializes the token store state for persistence.
     * Extracts the master token, user tokens, service tokens, and crypto keys,
     * encoding them as JSON-safe objects.
     *
     * @param {Object} callbacks - Callback object with { result, timeout, error }
     */
    serialize(callbacks) {
        const self = this;

        asyncExecutor(callbacks, function () {
            const masterToken = self.oE();

            if (!masterToken) {
                callbacks.result(null);
                return;
            }

            self._extractCryptoKeys(masterToken, {
                result(serializedKeys) {
                    asyncExecutor(callbacks, function () {
                        const userProperties = self.objectProperties;

                        const userList = Object.keys(userProperties).map((userId) => {
                            const userIdToken = userProperties[userId];
                            return {
                                userId,
                                userIdTokenJSON: self._tokenToJSON(userIdToken),
                                serviceTokenJSONList: self.decodeMessage(masterToken, userIdToken).map(self._tokenToJSON),
                            };
                        });

                        serializedKeys.esn = self.esn;
                        serializedKeys.masterTokenJSON = self._tokenToJSON(masterToken);
                        serializedKeys.userList = userList;

                        // Merge any extra key exchange state (e.g., wrapped public/private keys)
                        if (self._keyExchangeExtraState) {
                            Object.keys(self._keyExchangeExtraState).forEach((key) => {
                                serializedKeys[key] = self._keyExchangeExtraState[key];
                            });
                        }

                        return serializedKeys;
                    }, null);
                },
                timeout: callbacks.timeout,
                error: callbacks.error,
            });
        }, null);
    }

    /**
     * Extracts the encryption and HMAC keys from the crypto context associated
     * with the given master token. If system key wrapping is enabled, wraps
     * the keys before returning.
     *
     * @param {Object} masterToken - The master token whose crypto context to extract
     * @param {Object} callbacks - Callback object with { result, timeout, error }
     * @private
     */
    _extractCryptoKeys(masterToken, callbacks) {
        const self = this;

        asyncExecutor(callbacks, function () {
            const cryptoContext = self.wrapAuthentication(masterToken);

            if (!(cryptoContext instanceof SymmetricCryptoContext)) {
                throw new MslError(MslErrorCodes.WC, 'CryptoContext was not a SymmetricCryptoContext');
            }

            const keys = {
                encryptionKey: cryptoContext.uw,
                hmacKey: cryptoContext.hmacKey,
            };

            if (keys.encryptionKey && keys.hmacKey) {
                if (self._systemKeyWrapFormat) {
                    self._wrapKeysWithSystemKey(keys, callbacks);
                } else {
                    return keys;
                }
            } else {
                throw new MslError(MslErrorCodes.WC, 'Unable to get CryptoContext keys');
            }
        }, null);
    }

    /**
     * Converts a token object to a JSON-serializable representation.
     *
     * @param {Object} token - Token with encryptedSessionData and signature (cl)
     * @returns {{ tokendata: string, signature: string }} Base64-encoded token parts
     * @private
     */
    _tokenToJSON(token) {
        return {
            tokendata: encodeBase64(token.encryptedSessionData),
            signature: encodeBase64(token.cl),
        };
    }

    /**
     * Retrieves or creates the system-level CryptoKey used for wrapping
     * session keys. The key is cached across all instances.
     *
     * @param {string} algorithmName - The wrapping algorithm name (e.g., "AES-KW")
     * @param {Object} callbacks - Callback object with { result, error }
     * @private
     */
    _getOrCreateSystemKey(algorithmName, callbacks) {
        if (cachedSystemKey) {
            callbacks.result(cachedSystemKey);
            return;
        }

        Promise.resolve()
            .then(() => MslCrypto.generateKey({ name: algorithmName }, false, ['wrapKey', 'unwrapKey']))
            .then((key) => {
                cachedSystemKey = key;
                callbacks.result(cachedSystemKey);
            })
            .catch(() => {
                callbacks.error(new MslError(MslErrorCodes.WC, 'Unable to get system key'));
            });
    }

    /**
     * Wraps encryption and HMAC keys with the system key for secure storage.
     * If the keys already have cached wrapped representations, returns those
     * immediately without re-wrapping.
     *
     * @param {{ encryptionKey: CryptoKey, hmacKey: CryptoKey }} keys - Keys to wrap
     * @param {Object} callbacks - Callback object with { result, timeout, error }
     * @private
     */
    _wrapKeysWithSystemKey(keys, callbacks) {
        const self = this;

        this._getOrCreateSystemKey(this._systemKeyAlgorithm, {
            result(systemKey) {
                asyncExecutor(callbacks, function () {
                    const encryptionKey = keys.encryptionKey;
                    const hmacKey = keys.hmacKey;

                    const cachedWrappedEncKey = encryptionKey.$netflix$msl$wrapsys;
                    const cachedWrappedHmacKey = hmacKey.$netflix$msl$wrapsys;

                    // Return cached wrapped keys if available
                    if (cachedWrappedEncKey && cachedWrappedHmacKey) {
                        return {
                            wrappedEncryptionKey: cachedWrappedEncKey,
                            wrappedHmacKey: cachedWrappedHmacKey,
                        };
                    }

                    // Wrap both keys with the system key
                    Promise.resolve()
                        .then(() =>
                            Promise.all([
                                MslCrypto.wrapKey(self._systemKeyWrapFormat, encryptionKey, systemKey, systemKey.algorithm),
                                MslCrypto.wrapKey(self._systemKeyWrapFormat, hmacKey, systemKey, systemKey.algorithm),
                            ])
                        )
                        .then(([wrappedEnc, wrappedHmac]) => {
                            const wrappedEncStr = encodeBase64(wrappedEnc, true);
                            encryptionKey.$netflix$msl$wrapsys = wrappedEncStr;

                            const wrappedHmacStr = encodeBase64(wrappedHmac, true);
                            hmacKey.$netflix$msl$wrapsys = wrappedHmacStr;

                            callbacks.result({
                                wrappedEncryptionKey: wrappedEncStr,
                                wrappedHmacKey: wrappedHmacStr,
                            });
                        })
                        .catch((error) => {
                            callbacks.error(new MslError(MslErrorCodes.WC, 'Error wrapping key with SYSTEM key', error));
                        });
                }, null);
            },
            timeout: callbacks.timeout,
            error: callbacks.error,
        });
    }

    /**
     * Unwraps previously wrapped encryption and HMAC keys using the system key.
     *
     * @param {Object} persistedState - Object with wrappedEncryptionKey and wrappedHmacKey (base64)
     * @param {Object} callbacks - Callback object with { result, timeout, error }
     * @private
     */
    _unwrapKeysWithSystemKey(persistedState, callbacks) {
        const self = this;

        this._getOrCreateSystemKey(this._systemKeyAlgorithm, {
            result(systemKey) {
                asyncExecutor(callbacks, function () {
                    const wrappedEncKey = decodeBase64(persistedState.wrappedEncryptionKey, true);
                    const wrappedHmacKey = decodeBase64(persistedState.wrappedHmacKey, true);

                    Promise.resolve()
                        .then(() =>
                            Promise.all([
                                MslCrypto.unwrapKey(
                                    self._systemKeyWrapFormat, wrappedEncKey, systemKey,
                                    systemKey.algorithm, WebCryptoAlgorithms.XO, false, KeyUsages.encrypt
                                ),
                                MslCrypto.unwrapKey(
                                    self._systemKeyWrapFormat, wrappedHmacKey, systemKey,
                                    systemKey.algorithm, WebCryptoAlgorithms.fX, false, KeyUsages.sign
                                ),
                            ])
                        )
                        .then(([unwrappedEncKey, unwrappedHmacKey]) => {
                            // Cache the wrapped representations on the unwrapped keys
                            unwrappedEncKey.$netflix$msl$wrapsys = persistedState.wrappedEncryptionKey;
                            unwrappedHmacKey.$netflix$msl$wrapsys = persistedState.wrappedHmacKey;

                            callbacks.result({
                                encryptionKey: unwrappedEncKey,
                                hmacKey: unwrappedHmacKey,
                            });
                        })
                        .catch((error) => {
                            callbacks.error(new MslError(MslErrorCodes.WC, 'Error wrapping key with SYSTEM key', error));
                        });
                }, null);
            },
            timeout: callbacks.timeout,
            error: callbacks.error,
        });
    }

    /**
     * Restores the token store from a previously persisted state object.
     * Parses and re-creates the master token, unwraps crypto keys, then
     * restores all user ID tokens and their associated service tokens.
     *
     * @param {Object} mslConfig - MSL configuration (contains esn, etc.)
     * @param {Object} mslContext - MSL context for token parsing
     * @param {Object} persistedState - The serialized state from serialize()
     * @param {Object} callbacks - Callback object with { result, timeout, error }
     */
    restoreFromPersistedState(mslConfig, mslContext, persistedState, callbacks) {
        const self = this;
        const logger = self.debugLogger;

        // ESN mismatch means tokens belong to a different device - start fresh
        if (persistedState.esn !== self.esn) {
            logger.error('Esn mismatch, starting fresh');
            callbacks.error();
            return;
        }

        /**
         * Restores user ID tokens and their service tokens after master token is ready.
         * @param {Object} masterToken - The restored master token
         * @param {Object} doneCallbacks - Callback object
         */
        function restoreUserTokens(masterToken, doneCallbacks) {
            let userList;
            try {
                userList = persistedState.userList.slice();
            } catch (_e) { /* empty */ }

            if (!userList) {
                doneCallbacks.result();
                return;
            }

            (function processNextUser() {
                const userEntry = userList.shift();

                if (!userEntry) {
                    doneCallbacks.result();
                    return;
                }

                // Decode the user ID token from base64
                const decodedTokenData = {};
                for (const field in userEntry.userIdTokenJSON) {
                    decodedTokenData[field] = decodeBase64(userEntry.userIdTokenJSON[field]);
                }
                const tokenMslObject = new MslObject(decodedTokenData);

                parseUserIdToken(mslContext, tokenMslObject, masterToken, {
                    result(userIdToken) {
                        try {
                            self.addUserIdToken(userEntry.userId, userIdToken);
                            restoreServiceTokens(masterToken, userIdToken, userEntry.serviceTokenJSONList, {
                                result: processNextUser,
                                timeout: processNextUser,
                                error: processNextUser,
                            });
                        } catch (_e) {
                            processNextUser();
                        }
                    },
                    error() {
                        processNextUser();
                    },
                });
            })();
        }

        /**
         * Restores service tokens bound to a master token and user ID token.
         * @param {Object} masterToken - The master token
         * @param {Object} userIdToken - The user ID token
         * @param {Array} serviceTokenJSONList - Serialized service tokens
         * @param {Object} doneCallbacks - Callback object
         */
        function restoreServiceTokens(masterToken, userIdToken, serviceTokenJSONList, doneCallbacks) {
            let tokenList;
            try {
                tokenList = serviceTokenJSONList.slice();
            } catch (_e) { /* empty */ }

            if (!tokenList) {
                doneCallbacks.result();
                return;
            }

            const cryptoContext = self.wrapAuthentication(masterToken);

            (function processNextToken() {
                const tokenJSON = tokenList.shift();

                if (!tokenJSON) {
                    doneCallbacks.result();
                    return;
                }

                // Decode all fields from base64
                const decoded = {};
                for (const field in tokenJSON) {
                    decoded[field] = decodeBase64(tokenJSON[field]);
                }
                const tokenMslObject = new MslObject(decoded);

                // Extract the token name to build a crypto context map
                const tokenName = mslContext.defaultValue.parseFunction(tokenMslObject.key('tokendata')).writeUint16('name');
                const cryptoContexts = {};
                cryptoContexts[tokenName] = cryptoContext;

                parseServiceToken(mslContext, tokenMslObject, masterToken, userIdToken, cryptoContexts, {
                    result(serviceToken) {
                        self.addServiceTokens([serviceToken]);
                        processNextToken();
                    },
                    error() {
                        processNextToken();
                    },
                });
            })();
        }

        // Main restoration flow: parse master token, then restore keys, then user tokens
        (function restoreMasterToken(masterTokenCallbacks) {
            let completed = false;
            let masterToken = null;
            let encryptionKey = null;
            let hmacKey = null;

            /**
             * Called after each async step completes. When all three values
             * (masterToken, encryptionKey, hmacKey) are available, constructs
             * the crypto context and adds the master token to the store.
             */
            function tryFinalize() {
                if (completed || !masterToken || !encryptionKey || !hmacKey) return;

                completed = true;
                new SecretKey(encryptionKey, {
                    result(encSecret) {
                        new SecretKey(hmacKey, {
                            result(hmacSecret) {
                                const cryptoContext = new MasterTokenCryptoContext(
                                    mslContext, masterToken, mslConfig.esn, encSecret, hmacSecret
                                );
                                self.addMasterToken(masterToken, cryptoContext, /* skipKeyExchangeGeneration */ true);
                                masterTokenCallbacks.result(masterToken);
                            },
                            error: masterTokenCallbacks.error,
                        });
                    },
                    error: masterTokenCallbacks.error,
                });
            }

            /**
             * Reports an error and prevents further finalization.
             * @param {string} message - Error description
             * @param {*} [cause] - Optional underlying error
             */
            function reportError(message, cause) {
                logger.error(message, cause && '' + cause);
                if (!completed) {
                    completed = true;
                    masterTokenCallbacks.error(new MslError(MslErrorCodes.WC, message));
                }
            }

            if (!persistedState.masterTokenJSON) {
                reportError('Persisted store is corrupt');
                return;
            }

            // Decode and parse the master token
            const decodedMasterToken = {};
            for (const field in persistedState.masterTokenJSON) {
                decodedMasterToken[field] = decodeBase64(persistedState.masterTokenJSON[field]);
            }
            const masterTokenMslObject = new MslObject(decodedMasterToken);

            parseMasterToken(mslContext, masterTokenMslObject, {
                result(parsedToken) {
                    masterToken = parsedToken;
                    tryFinalize();
                },
                error(err) {
                    reportError('Error parsing MasterToken', err);
                },
            });

            // Restore the crypto keys (wrapped or raw)
            if (self._systemKeyWrapFormat) {
                // Keys were wrapped with system key - unwrap them
                self._unwrapKeysWithSystemKey(persistedState, {
                    result(keys) {
                        encryptionKey = keys.encryptionKey;
                        hmacKey = keys.hmacKey;
                        tryFinalize();
                    },
                    timeout() {
                        reportError('Timeout unwrapping keys');
                    },
                    error(err) {
                        reportError('Error unwrapping keys', err);
                    },
                });
            } else {
                // Keys were stored raw - validate them by attempting crypto operations
                Promise.resolve()
                    .then(() =>
                        MslCrypto.encrypt(
                            { name: WebCryptoAlgorithms.XO.name, iv: new Uint8Array(16) },
                            persistedState.encryptionKey,
                            new Uint8Array(1)
                        )
                    )
                    .then(() => {
                        encryptionKey = persistedState.encryptionKey;
                    })
                    .catch(() => {
                        reportError('Error loading encryptionKey');
                    })
                    .then(() => MslCrypto.sign(WebCryptoAlgorithms.fX, persistedState.hmacKey, new Uint8Array(1)))
                    .then(() => {
                        hmacKey = persistedState.hmacKey;
                        tryFinalize();
                    })
                    .catch(() => {
                        reportError('Error loading hmacKey');
                    });
            }
        })({
            result(masterToken) {
                restoreUserTokens(masterToken, callbacks);
            },
            timeout: callbacks.timeout,
            error: callbacks.error,
        });
    }
}

export default MslTokenStore;

export { MslTokenStore, EXCLUDED_SERVICE_TOKENS };
