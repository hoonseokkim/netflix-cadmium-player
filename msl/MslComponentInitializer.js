/**
 * @file MslComponentInitializer.js
 * @description Initializes the MSL (Message Security Layer) component for secure
 *   communication with Netflix servers. Handles MSL store persistence, key exchange,
 *   error handling, and exposes mslFetch/sendSecure APIs on the service bus.
 * @module msl/MslComponentInitializer
 * @original Module_46493
 */

import { __awaiter } from '../utils/TsHelpers.js';
import { MslStoreCreator } from '../msl/MslStoreCreator.js';         // Module 62807
import { MslCryptoContext } from '../msl/MslCryptoContext.js';         // Module 80824
import { DeviceInfo } from '../config/DeviceInfo.js';                  // Module 50040
import { ESN } from '../config/ESN.js';                                // Module 1481
import { config as playerConfig } from '../config/PlayerConfig.js';    // Module 29204
import { SUCCESS } from '../events/ComponentResult.js';                // Module 33096
import { EventTypeEnum, eG } from '../events/EventTypes.js';          // Module 36129
import { assert } from '../assert/Assert.js';                          // Module 45146
import { disposableList, getCategoryLog, eH } from '../utils/ServiceLocator.js'; // Module 31276
import { TimingMarker } from '../monitoring/TimingMarker.js';          // Module 77134
import { TimingMilestones } from '../monitoring/TimingMilestones.js';  // Module 63156
import { StorageKeys } from '../utils/StorageKeys.js';                 // Module 17892
import { assignProperties, parseInteger } from '../utils/ObjectUtils.js'; // Module 3887
import { WebCrypto } from '../crypto/WebCrypto.js';                    // Module 22365
import { DLb as parseMslInternalError } from '../msl/MslErrorParser.js'; // Module 52569
import { DebouncedTimer } from '../utils/DebouncedTimer.js';           // Module 45842
import { ellaSendRateMultiplier } from '../ella/EllaConfig.js';        // Module 5021
import { vk as componentKey } from '../core/ComponentKeys.js';         // Module 11479
import { MHa as mslServiceKey } from '../msl/MslServiceKey.js';       // Module 50681
import { serviceBus } from '../core/ServiceBus.js';                    // Module 59219
import { HttpToken } from '../network/HttpToken.js';                   // Module 32934
import { SP as userProfileKey } from '../core/UserProfileKey.js';      // Module 71501
import { initMslContext } from '../msl/MslContextFactory.js';          // Module 65799
import { MslUrlBuilder } from '../msl/MslUrlBuilder.js';               // Module 8129

/**
 * Registers and initializes the MSL component.
 * This is called during player startup and handles:
 * - Loading/creating the MSL store from persistent storage
 * - Initializing the MSL context with device credentials
 * - Setting up mslFetch and sendSecure on the service bus
 * - Error handling and MSL store persistence
 */
export function registerMslComponent() {
    const mslState = {};

    const componentRegistration = disposableList.key(componentKey);

    componentRegistration.register(EventTypeEnum.INIT_COMPONENT_MSL, function initMsl(onComplete) {
        assert(playerConfig);

        // WebCrypto is required for MSL
        if (!WebCrypto.jK || !WebCrypto.vo || !WebCrypto.vo.unwrapKey) {
            onComplete({ Ya: EventTypeEnum.MSL_INIT_NO_WEBCRYPTO });
            return;
        }

        const timingMarker = disposableList.key(TimingMarker);
        const timingMilestones = TimingMilestones.jo;
        const log = getCategoryLog('Msl');
        const shouldDeleteStore = playerConfig.mslDeleteStore;
        const shouldPersistStore = playerConfig.mslPersistStore;
        const storeName = playerConfig.bE ? 'mslstoretest' : 'mslstore';
        const initialState = DeviceInfo.bSb;
        let shouldRefreshUserAuth = true;
        const allowTokenRefresh = !initialState || initialState.success;

        // Server identity public key (test vs production)
        const serverPublicKey = eH(
            playerConfig.bE
                ? 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm84o+RfF7KdJgbE6lggYAdUxOArfgCsGCq33+kwAK/Jmf3VnNo1NOGlRpLQUFAqYRqG29u4wl8fH0YCn0v8JNjrxPWP83Hf5Xdnh7dHHwHSMc0LxA2MyYlGzn3jOF5dG/3EUmUKPEjK/SKnxeKfNRKBWnm0K1rzCmMUpiZz1pxgEB/cIJow6FrDAt2Djt4L1u6sJ/FOy/zA1Hf4mZhytgabDfapxAzsks+HF9rMr3wXW5lSP6y2lM+gjjX/bjqMLJQ6iqDi6++7ScBh0oNHmgUxsSFE3aBRBaCL1kz0HOYJe26UqJqMLQ71SwvjgM+KnxZvKa1ZHzQ+7vFTwE7+yxwIDAQAB'
                : 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlibeiUhffUDs6QqZiB+jXH/MNgITf7OOcMzuSv4G3JysWkc0aPbT3vkCVaxdjNtw50zo2Si8I24z3/ggS3wZaF//lJ/jgA70siIL6J8kBt8zy3x+tup4Dc0QZH0k1oxzQxM90FB5x+UP0hORqQEUYZCGZ9RbZ/WNV70TAmFkjmckutWN9DtR6WUdAQWr0HxsxI9R05nz5qU2530AfQ95h+WGZqnRoG0W6xO1X05scyscNQg0PNCy3nfKBG+E6uIl5JB4dpc9cgSNgkfAIeuPURhpD0jHkJ/+4ytpdsXAGmwYmoJcCSE1TJyYYoExuoaE8gLFeM01xXK5VINU7/eWjQIDAQAB'
        );

        const sendUserAuthIfRequired = !!playerConfig.sendUserAuthIfRequired;

        /**
         * Initializes the MSL context with optional persisted store state.
         * @param {Object} [storeState] - Previously persisted MSL store state
         */
        function initializeWithStore(storeState) {
            if (storeState?.userList && playerConfig.shouldClearUserData) {
                storeState.userList = [];
            }

            const cryptoContext = new MslCryptoContext();
            MslCryptoContext.NHa.execute(cryptoContext);

            const mslConfig = {
                esn: ESN.wj,
                esnPrefix: ESN.platformPrefix,
                authenticationKeyNames: playerConfig.authenticationKeyNames,
                systemKeyWrapFormat: playerConfig.systemKeyWrapFormat,
                serverIdentityId: 'MSL_TRUSTED_NETWORK_SERVER_KEY',
                serverIdentityKeyData: serverPublicKey,
                storeState,
                notifyMilestone: componentRegistration.recordPlayDelay.bind(componentRegistration),
                log,
                ErrorSubCodes: {
                    MSL_REQUEST_TIMEOUT: EventTypeEnum.MSL_REQUEST_TIMEOUT,
                    MSL_READ_TIMEOUT: EventTypeEnum.MSL_READ_TIMEOUT
                }
            };

            initMslContext(mslConfig, {
                result(mslContext) {
                    onMslContextReady(mslContext);
                },
                timeout() {
                    onComplete({ Ya: EventTypeEnum.MSL_INIT_ERROR });
                },
                error(error) {
                    onComplete(buildMslError(EventTypeEnum.MSL_INIT_ERROR, undefined, error));
                }
            });
        }

        /**
         * Called when the MSL context is fully initialized. Sets up the send API
         * and MSL store persistence.
         * @param {Object} mslContext - Initialized MSL context
         */
        function onMslContextReady(mslContext) {
            let serializedStore;
            const persistDebouncer = disposableList.key(DebouncedTimer)(ellaSendRateMultiplier(100));

            if (shouldPersistStore) {
                mslContext.xac((storeEvent) => {
                    serializedStore = storeEvent.w_c;
                    persistDebouncer.scheduleHydration(persistStore);
                });
            }

            function persistStore() {
                if (allowTokenRefresh) {
                    disposableList.key(StorageKeys).create().then((storage) => {
                        return storage.save(storeName, serializedStore, false);
                    }).catch((error) => {
                        log.error('Error persisting msl store', eG(error));
                    });
                }
            }

            // Expose MSL send capabilities
            assignProperties(mslState, {
                Vgd() {
                    shouldRefreshUserAuth = true;
                },

                send(request) {
                    function buildMslRequest() {
                        const credentials = request.kN;
                        const mslRequest = {
                            method: request.method,
                            nonReplayable: request.z0a,
                            encrypted: request.ry,
                            userId: request.userId,
                            body: request.body,
                            timeout: 2 * request.timeout,
                            url: new MslUrlBuilder(request),
                            allowTokenRefresh,
                            sendUserAuthIfRequired,
                            shouldSendUserAuthData: playerConfig.shouldSendUserAuthData
                        };

                        if (credentials.email) {
                            mslRequest.email = credentials.email;
                            mslRequest.password = credentials.password || '';
                        } else if (shouldRefreshUserAuth) {
                            mslRequest.useNetflixUserAuthData = true;
                        }

                        return mslRequest;
                    }

                    return new Promise((resolve, reject) => {
                        const mslRequest = buildMslRequest();

                        mslContext.send(mslRequest).then((response) => {
                            if (shouldRefreshUserAuth) shouldRefreshUserAuth = false;
                            resolve({
                                body: response.body,
                                headers: response.headers
                            });
                        }).catch((error) => {
                            if (error.error) {
                                const errorCode = error.error.cadmiumResponse?.errorcode
                                    ? error.error.cadmiumResponse.errorcode
                                    : mslContext.NDc(error.error)
                                        ? EventTypeEnum.MSL_ERROR_REAUTH
                                        : mslContext.MDc(error.error)
                                            ? EventTypeEnum.MSL_ERROR_HEADER
                                            : EventTypeEnum.MSL_ERROR;

                                reject(buildMslError(errorCode, mslContext.getErrorCode(error.error), error.error));
                            } else {
                                log.error('Unknown MSL error', error);
                                error.errorSubCode = error.errorSubCode;
                                reject({
                                    Ya: error.errorSubCode || EventTypeEnum.MSL_UNKNOWN
                                });
                            }
                        });
                    });
                },

                KT: mslContext
            });

            // Register mslFetch on the service bus
            serviceBus.fD.UQ.mslFetch = async function mslFetch(url, options) {
                const userProfile = disposableList.key(userProfileKey);
                const response = await mslState.send({
                    kN: {
                        Je: disposableList.key(HttpToken),
                        profile: userProfile
                    },
                    timeout: 8000,
                    url: url.toString(),
                    body: options?.body,
                    headers: {
                        'Content-Encoding': 'msl_v1',
                        'Content-Type': 'application/json'
                    },
                    userId: userProfile,
                    fQb: false,
                    z0a: true,
                    ry: true
                });

                const responseObj = {
                    get body() {
                        this.bodyUsed = true;
                        return response.body;
                    }
                };

                responseObj.bodyUsed = false;
                responseObj.ok = true;
                responseObj.status = 200;
                responseObj.statusText = 'OK';
                responseObj.type = 'basic';
                responseObj.url = url.toString();
                responseObj.headers = new Headers(response.headers);
                responseObj.TEXT_MEDIA_TYPE = function () { return Promise.resolve(this.body); };
                responseObj.data = function () { return Promise.resolve(JSON.videoSampleEntry(this.body)); };
                responseObj.arrayBuffer = function () { return Promise.resolve(new Uint8Array(this.body)); };
                responseObj.clone = function () { return Object.assign({}, this); };
                responseObj.blob = function () { return this.arrayBuffer().then((buf) => new Blob([buf])); };
                responseObj.formData = function () { throw Error('Not implemented'); };
                responseObj.redirected = false;

                return responseObj;
            };

            // Register sendSecure on the service bus
            serviceBus.fD.UQ.sendSecure = function sendSecure(request) {
                const userProfile = disposableList.key(userProfileKey);

                return mslState.send({
                    kN: {
                        Je: disposableList.key(HttpToken),
                        profile: userProfile
                    },
                    timeout: request.timeout || 8000,
                    url: request.url,
                    body: request.body,
                    headers: {
                        ...request.headers,
                        'Content-Encoding': 'msl_v1',
                        'Content-Type': 'application/json'
                    },
                    userId: userProfile,
                    fQb: false,
                    z0a: true,
                    ry: true
                }).then((res) => ({
                    ok: true,
                    status: 200,
                    code: 200,
                    statusText: 'OK',
                    headers: new Headers(res.headers),
                    body: res.body
                })).catch((err) => {
                    const status = err.httpcode;
                    const statusText = err.statusText;
                    const errorBody = { ...err.error, content: err.content };
                    return {
                        ok: false,
                        status,
                        code: status,
                        statusText,
                        headers: new Headers(err.headers),
                        body: JSON.stringify(errorBody)
                    };
                });
            };

            onComplete(SUCCESS);
            disposableList.key(mslServiceKey).nKc(mslState);
        }

        /**
         * Builds an MSL error object from a caught exception.
         */
        function buildMslError(errorCode, mslCode, cause) {
            const result = { Ya: errorCode, hra: mslCode };

            if (!cause) return result;

            const getStackTrace = (msg) => {
                msg = msg || '' + cause;
                if (cause.stack) {
                    const stack = '' + cause.stack;
                    msg = stack.indexOf(msg) >= 0 ? stack : msg + stack;
                }
                return msg;
            };

            const cadmiumResponse = cause.cadmiumResponse;
            if (cadmiumResponse) {
                const subCode = cadmiumResponse.errorSubcode?.toString();
                if (subCode) cadmiumResponse.errorSubcode = subCode;
                cadmiumResponse.errorcode = errorCode;
                cadmiumResponse.hra = mslCode;
                cadmiumResponse.content = cadmiumResponse.configFlag;
                cadmiumResponse.configFlag = getStackTrace(cause.message);
                cadmiumResponse.error = {
                    subCode: errorCode,
                    errorExternalCode: subCode,
                    mslCode,
                    data: cause.cause,
                    message: cause.message
                };
                return cadmiumResponse;
            }

            const stackTrace = getStackTrace(cause.errorMessage);
            const externalCode = parseInteger(cause.$ca) || parseInteger(cause.error?..$ca);
            const internalData = cause.internal_Zaa !== undefined
                ? parseMslInternalError(cause.internal_Zaa)
                : undefined;

            if (stackTrace) result.configFlag = stackTrace;
            if (externalCode) result.errorSubcode = externalCode;
            result.error = {
                subCode: errorCode,
                errorExternalCode: externalCode.toString(),
                mslCode,
                data: internalData,
                message: stackTrace
            };
            return result;
        }

        // Load or create the MSL store
        disposableList.key(StorageKeys).create().then((storage) => {
            if (shouldDeleteStore) {
                storage.item(storeName).then(() => {
                    initializeWithStore();
                }).catch((err) => {
                    log.error('Unable to delete MSL store', eG(err));
                    initializeWithStore();
                });
            } else if (shouldPersistStore) {
                storage.loading(storeName).then((loaded) => {
                    timingMarker.mark(timingMilestones.V2b);
                    initializeWithStore(loaded.value);
                }).catch((err) => {
                    if (err.errorcode === EventTypeEnum.STORAGE_NODATA) {
                        timingMarker.mark(timingMilestones.X2b);
                        initializeWithStore();
                    } else {
                        log.error('Error loading msl store', eG(err));
                        timingMarker.mark(timingMilestones.W2b);
                        storage.item(storeName).then(() => {
                            initializeWithStore();
                        }).catch((deleteErr) => {
                            onComplete(deleteErr);
                        });
                    }
                });
            } else {
                initializeWithStore();
            }
        }).catch((err) => {
            log.error('Error creating app storage while loading msl store', eG(err));
            onComplete(err);
        });
    });
}

export default registerMslComponent;
