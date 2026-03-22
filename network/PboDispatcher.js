/**
 * Netflix Cadmium Player - PBO Command Dispatcher
 *
 * Sends API commands to Netflix's PBO (Playback Operations) backend.
 * Supports WebSocket and HTTP transports with automatic fallback
 * and exponential backoff retry logic.
 *
 * @module PboDispatcher
 * @original Module 71976
 */

import { __decorate, __param } from '../../modules/Module_22970.js'; // tslib decorators
import { injectable, injectDecorator } from '../../modules/Module_22674.js'; // DI framework
import { ellaSendRateMultiplier, ri, seekToSample, MILLISECONDS } from '../../modules/Module_5021.js'; // time/rate utilities
import { internal_Pmb } from '../../modules/Module_14543.js'; // transport factory token
import { LoggerToken } from '../../modules/Module_87386.js';
import { jX as DataToken } from '../../modules/Module_63368.js';
import { ClockToken } from '../../modules/Module_81918.js';
import { enumConstants } from '../../modules/Module_34231.js';
import { internal_Lla as RandomGeneratorToken } from '../../modules/Module_10306.js';
import { valueList as SchedulerToken } from '../../modules/Module_53085.js';
import { kua as isPboError } from '../../modules/Module_71977.js';
import { nativeProcessor as ConfigToken } from '../../modules/Module_7605.js';
import { pFa as EventBusToken } from '../../modules/Module_15160.js';
import { ZFa } from '../../modules/Module_85001.js';
import { cD as QueryParamKeys, M5b as HeaderKeys } from '../../modules/Module_19114.js';
import { ola as PboResponseParser } from '../../modules/Module_45385.js';
import { YIa as ReceiverToken } from '../../modules/Module_15348.js';
import { dPb as raceWithTimeout } from '../../modules/Module_91176.js';
import { internal_Snb as BackpressureToken } from '../../modules/Module_82229.js';
import { internal_Jib as BackoffToken } from '../../modules/Module_17391.js';

/**
 * Known UI version prefixes and their corresponding platform names.
 * @type {Record<string, string>}
 */
const UI_VERSION_PREFIX_MAP = {
    'shakti-': 'akira',
};

// ────────────────────────────────────────────────────────────────────────────
// PboCommandHistory
// ────────────────────────────────────────────────────────────────────────────

/**
 * Maintains a bounded history of PBO command records for debugging.
 * When history is enabled, keeps the most recent N records and can
 * serialize them to JSON for error reporting.
 */
class PboCommandHistory {
    /**
     * @param {object} config - PBO configuration with history limits.
     * @param {number} [config.BXa] - Maximum number of history entries to retain.
     */
    constructor(config) {
        /** @type {object} */
        this.config = config;

        /** @type {PboCommandRecord[]} */
        this.entries = [];
    }

    /**
     * Adds a command record to the history, evicting the oldest entry
     * if the configured maximum size has been exceeded.
     *
     * @param {PboCommandRecord} record - The command record to track.
     */
    addRecord(record) {
        this.entries.push(record);
        if (this.config.BXa > 0 && this.entries.length > this.config.BXa) {
            this.entries.shift();
        }
    }

    /**
     * Returns the history entries array for JSON serialization.
     * @returns {PboCommandRecord[]}
     */
    toJSON() {
        return this.entries;
    }
}

// ────────────────────────────────────────────────────────────────────────────
// PboCommandRecord
// ────────────────────────────────────────────────────────────────────────────

/**
 * Records timing and outcome information for a single PBO command execution.
 * Used by PboCommandHistory for debugging and error reporting.
 */
class PboCommandRecord {
    /**
     * @param {object} clock - Clock service providing getCurrentTime().
     * @param {object} transport - The transport instance used for this command.
     * @param {object} context - The command context (method name, URL, etc.).
     */
    constructor(clock, transport, context) {
        /** @type {object} */
        this.clock = clock;

        /** @type {object} */
        this.transport = transport;

        /** @type {object} */
        this.context = context;

        /** @type {object} */
        this.startTime = this.clock.getCurrentTime();

        /** @type {boolean|undefined} */
        this.success = undefined;

        /** @type {object|undefined} */
        this.elapsedTime = undefined;

        /** @type {string|undefined} */
        this.subcode = undefined;

        /** @type {string|undefined} */
        this.extcode = undefined;
    }

    /**
     * Marks this command record as successfully completed and records elapsed time.
     */
    markSuccess() {
        this.success = true;
        this.elapsedTime = this.clock.getCurrentTime().lowestWaterMarkLevelBufferRelaxed(this.startTime);
    }

    /**
     * Marks this command record as failed and records elapsed time and error codes.
     *
     * @param {object} error - The error object containing sub/external codes.
     */
    markFailed(error) {
        this.success = false;
        this.elapsedTime = this.clock.getCurrentTime().lowestWaterMarkLevelBufferRelaxed(this.startTime);
        this.subcode = error.errorSubCode || error.errorSubCode;
        this.extcode = error.errorExternalCode || error.errorExternalCode;
    }

    /**
     * @returns {string} JSON string representation.
     */
    toString() {
        return JSON.stringify(this);
    }

    /**
     * Custom JSON serialization. Includes transport info, timing, and
     * error codes (when the command failed).
     *
     * @returns {object}
     */
    toJSON() {
        const base = Object.assign(
            {
                success: this.success,
                method: this.context.so,
                startTime: this.startTime.toUnit(MILLISECONDS),
                elapsedTime: this.elapsedTime
                    ? this.elapsedTime.toUnit(MILLISECONDS)
                    : 'in progress',
            },
            this.transport.internal_Gpa(),
        );

        if (this.success) {
            return base;
        }

        return Object.assign(
            {},
            base,
            this.transport.internal_Gpa(),
            {
                subcode: this.subcode,
                extcode: this.extcode,
            },
        );
    }
}

// ────────────────────────────────────────────────────────────────────────────
// PboDispatcher
// ────────────────────────────────────────────────────────────────────────────

/**
 * Central dispatcher for PBO (Playback Operations) API commands.
 *
 * Manages transport selection (WebSocket vs HTTP), request parameter
 * decoration, response parsing, device command handling, and retry
 * logic with exponential backoff.
 *
 * @injectable
 */
class PboDispatcher {
    /**
     * @param {object} logger - Logger factory (creates sub-logger "Pbo").
     * @param {Function} transportFactory - Factory function returning a transport instance.
     * @param {object} data - Data serializer/deserializer (JSON-like).
     * @param {object} clock - Clock service for timing.
     * @param {object} platformInfo - Platform/browser information (VH).
     * @param {object} randomGenerator - Random number generator for jittered backoff.
     * @param {object} scheduler - Scheduler for delayed execution.
     * @param {object} config - PBO configuration.
     * @param {object} eventBus - Event bus for emitting server time updates.
     * @param {object} receiver - Command telemetry/logging receiver.
     * @param {object} backpressure - Backpressure/rate-limit header parser.
     * @param {object} backoffManager - Backoff state manager for throttled endpoints.
     */
    constructor(logger, transportFactory, data, clock, platformInfo, randomGenerator, scheduler, config, eventBus, receiver, backpressure, backoffManager) {
        /** @type {Function} */
        this.transportFactory = transportFactory;

        /** @type {object} */
        this.data = data;

        /** @type {object} */
        this.clock = clock;

        /** @type {object} */
        this.platformInfo = platformInfo;

        /** @type {object} */
        this.randomGenerator = randomGenerator;

        /** @type {object} */
        this.scheduler = scheduler;

        /** @type {object} */
        this.config = config;

        /** @type {object} */
        this.eventBus = eventBus;

        /** @type {object} */
        this.receiver = receiver;

        /** @type {object} */
        this.backpressure = backpressure;

        /** @type {object} */
        this.backoffManager = backoffManager;

        /** @type {object} */
        this.log = logger.createSubLogger('Pbo');

        /** @type {PboCommandHistory|undefined} */
        this.commandHistory = config.CPb ? new PboCommandHistory(config) : undefined;

        /** @type {object} */
        this.transport = this.transportFactory();

        /**
         * Cached parsed UI version info.
         * @type {{ platformPrefix: string, uiVersion: string, rawVersion: string }|undefined}
         * @private
         */
        this._parsedUiVersion = undefined;
    }

    // ── Public API ──────────────────────────────────────────────────────

    /**
     * Sends a PBO command with the given inputs. Creates a command record,
     * tracks it in history (if enabled), and delegates to _executeCommand.
     *
     * @param {object} context - Command context (method name, URL, headers, etc.).
     * @param {object} inputs - Command input payload.
     * @returns {Promise<object>} Resolves with the parsed response on success.
     */
    send(context, inputs) {
        const record = new PboCommandRecord(this.clock, this.transport, context);
        if (this.commandHistory) {
            this.commandHistory.addRecord(record);
        }
        return this._executeCommand(context, inputs, record);
    }

    // ── Command Execution ───────────────────────────────────────────────

    /**
     * Executes a command: retries until success or failure, then parses the
     * response and handles device commands, success, or error outcomes.
     *
     * @param {object} context - Command context.
     * @param {object} inputs - Command input payload.
     * @param {PboCommandRecord} record - Tracking record for this command.
     * @returns {Promise<object>}
     * @private
     */
    _executeCommand(context, inputs, record) {
        const self = this;
        return new Promise((resolve, reject) => {
            self._retryLoop(context, inputs)
                .then((response) => {
                    self._emitServerTime(response);

                    const [result, error] = self._parseResponse(response);

                    if (result) {
                        self.receiver.t3a({
                            command: context.so,
                            url: context.url,
                            inputs,
                            outputs: result,
                        });
                        self._markRecordSuccess(record);
                        resolve(response);
                    }

                    if (error) {
                        self._handleFailure(record, error);
                        reject(error);
                    }
                })
                .catch((error) => {
                    self.receiver.t3a({
                        command: context.so,
                        inputs,
                        outputs: error,
                        url: context.url,
                    });
                    const historyDump = self._handleFailure(record, error);
                    if (error.configFlag) {
                        error.configFlag = [error.configFlag, ' ', historyDump].join('');
                    }
                    reject(error);
                });
        });
    }

    /**
     * Emits a server time synchronization event if the response contains
     * a serverTime field.
     *
     * @param {object} response - Parsed PBO response.
     * @private
     */
    _emitServerTime(response) {
        const serverTime = response.serverTime;
        if (serverTime) {
            this.eventBus.emit(ZFa.ZRb, ellaSendRateMultiplier(serverTime));
        }
    }

    /**
     * Parses the PBO response, handling device commands (reset/reload/exit),
     * normal results, error codes, and malformed responses.
     *
     * @param {object} response - The raw PBO response object.
     * @returns {[object|undefined, object|undefined]} Tuple of [result, error].
     * @private
     */
    _parseResponse(response) {
        const result = response.result;

        // Handle server-initiated device commands
        if ('deviceCommand' in response) {
            const deviceCommand = response.deviceCommand;
            this.log.pauseTrace(`Received device command '${deviceCommand}'`);

            let errorCode;
            switch (deviceCommand) {
                case 'reset':
                    errorCode = 'RESET_DEVICE';
                    break;
                case 'reload':
                    errorCode = 'RELOAD_DEVICE';
                    break;
                case 'exit':
                    errorCode = 'EXIT_DEVICE';
                    break;
                default:
                    errorCode = 'FAIL';
                    this.log.error(`Unhandled device command '${deviceCommand}'`);
            }

            return [
                undefined,
                {
                    SI: true,
                    code: errorCode,
                    detail: {
                        message: `Server sent device action to '${deviceCommand}' device`,
                    },
                },
            ];
        }

        // Normal result
        if (result) {
            return [result, undefined];
        }

        // Error code present but no result
        if (response.code) {
            this.log.error(
                'Response did not contain a result or an error but did contain an error code',
                response,
            );
            return [
                undefined,
                {
                    code: response.code,
                    detail: { message: response.message },
                },
            ];
        }

        // Completely malformed response
        this.log.error('Response did not contain a result or an error', response);
        return [
            undefined,
            {
                code: 'FAIL',
                detail: { message: 'Response did contain a result or an error' },
            },
        ];
    }

    // ── Transport & Request Building ────────────────────────────────────

    /**
     * Performs a single send attempt through the current transport.
     * On WebSocket failure, falls back to HTTP. On HTTP failure, evaluates
     * whether a retry is warranted.
     *
     * @param {number} attemptIndex - Zero-based attempt number.
     * @param {object} context - Command context.
     * @param {object} inputs - Command input payload.
     * @returns {Promise<{ retry: boolean, rNb?: object, delay?: number, error?: object, headers?: object }>}
     * @private
     */
    _sendAttempt(attemptIndex, context, inputs) {
        const self = this;
        let responseHeaders;

        this._setRequestParams(context, attemptIndex);
        this.transport = this.transportFactory(inputs, context.so);

        return this.transport.send(context, inputs)
            .then((response) => {
                responseHeaders = response.headers;
                return {
                    retry: false,
                    rNb: PboResponseParser.BOc(self.data, response.body),
                    headers: responseHeaders,
                };
            })
            .catch((error) => {
                // WebSocket failure: fall back to HTTP transparently
                if (self.transport.O7a === 'sr') {
                    inputs.iQc = false;
                    context.headers['x-netflix.client.request.transport'] = 'httpAfterWS';
                    self.log.RETRY(
                        'SocketRouter message failed, falling back to HTTP',
                        Object.assign({ Method: context.so }, self._formatError(error)),
                    );
                    return {
                        retry: true,
                        delay: undefined,
                        error,
                        headers: error?.headers ?? {},
                    };
                }

                // HTTP failure: determine retry eligibility
                responseHeaders = responseHeaders ?? error.headers;
                const backpressureInfo = self.backpressure.dzc(responseHeaders);
                let maxRetries = PboResponseParser.internal_Gxc(error, backpressureInfo);
                maxRetries = maxRetries !== undefined
                    ? Math.min(maxRetries, context.callModeFlag)
                    : context.callModeFlag;

                if (self._shouldRetry(context, error, attemptIndex, maxRetries)) {
                    const retryDelay = self._calculateRetryDelay(
                        backpressureInfo,
                        attemptIndex,
                        maxRetries,
                    );
                    self.log.RETRY(
                        'Method failed, retrying',
                        Object.assign(
                            {
                                Method: context.so,
                                Attempt: attemptIndex + 1,
                                WaitTime: retryDelay,
                                MaxRetries: maxRetries,
                            },
                            self._formatError(error),
                        ),
                    );
                    return {
                        retry: true,
                        delay: retryDelay,
                        error,
                        headers: responseHeaders,
                    };
                }

                return {
                    retry: false,
                    error,
                    headers: responseHeaders,
                };
            });
    }

    /**
     * Parses a raw UI version string into a platform prefix and version.
     * Results are cached to avoid repeated parsing.
     *
     * @param {string} rawVersion - The raw UI version string (e.g. "shakti-v1234").
     * @returns {{ platformPrefix: string, uiVersion: string, rawVersion: string }}
     * @private
     */
    _parseUiVersion(rawVersion) {
        if (this._parsedUiVersion && this._parsedUiVersion.rawVersion === rawVersion) {
            return this._parsedUiVersion;
        }

        let platformPrefix = '';
        let uiVersion = rawVersion;

        Object.entries(UI_VERSION_PREFIX_MAP).find(([prefix, platform]) => {
            if (rawVersion.indexOf(prefix) === 0) {
                platformPrefix = platform;
                uiVersion = rawVersion.slice(prefix.length);
                return true;
            }
            return false;
        });

        this._parsedUiVersion = {
            platformPrefix,
            uiVersion,
            rawVersion,
        };

        return this._parsedUiVersion;
    }

    /**
     * Decorates the command context URL with request parameters including
     * attempt number, call mode, request ID, UI version, and browser info.
     *
     * @param {object} context - Command context with url and headers.
     * @param {number} attemptIndex - Zero-based attempt number.
     * @private
     */
    _setRequestParams(context, attemptIndex) {
        const params = context.url.searchParams;

        // Attempt number (1-based)
        params.set(QueryParamKeys.internal_Gkb, (attemptIndex + 1).toString());

        // Call mode: either as header or query param depending on config
        if (this.config.$Wb.includes(context.callMode)) {
            context.headers[HeaderKeys.fKa] = context.callMode;
        } else {
            params.set(QueryParamKeys.fKa, context.callMode);
        }

        // Request ID
        params.set(QueryParamKeys.internal_Hkb, context.requestId);

        // Session-bound request qualifier
        if (context.J) {
            params.set(QueryParamKeys.$2b, encodeURIComponent(context.J));
        }

        // UI version and browser info
        const uiVersionInfo = this._parseUiVersion(this.config.uiVersion ?? '');
        if (uiVersionInfo.platformPrefix) {
            params.set(QueryParamKeys.internal_Rab, uiVersionInfo.platformPrefix);

            if (uiVersionInfo.uiVersion) {
                params.set(QueryParamKeys.internal_Wmb, encodeURIComponent(uiVersionInfo.uiVersion));
            }

            const browserInfo = this.platformInfo.browserInfo;
            if (browserInfo?.name) {
                params.set(QueryParamKeys.lab, encodeURIComponent(browserInfo.name));
            }
            if (browserInfo?.version) {
                params.set(QueryParamKeys.mab, encodeURIComponent(browserInfo.version));
            }
            if (browserInfo?.os?.name) {
                params.set(QueryParamKeys.internal_Whb, encodeURIComponent(browserInfo.os.name));
            }
            if (browserInfo?.os?.version) {
                params.set(QueryParamKeys.internal_Xhb, encodeURIComponent(browserInfo.os.version));
            }
        }
    }

    // ── Retry Logic ─────────────────────────────────────────────────────

    /**
     * Recursive retry loop. Checks for backoff state before each attempt,
     * sends the request, and retries on transient failures with appropriate
     * delay.
     *
     * @param {object} context - Command context.
     * @param {object} inputs - Command input payload.
     * @param {number} [attemptIndex=0] - Current attempt number.
     * @returns {Promise<object>} Resolves with the parsed response body.
     * @private
     */
    _retryLoop(context, inputs, attemptIndex = 0) {
        const self = this;

        // Check for active backoff before sending
        if (context.J !== undefined) {
            const backoffState = this.backoffManager.ovc(context.callMode, context.J);
            if (backoffState) {
                if (backoffState.yZ) {
                    throw {
                        pboc: false,
                        code: 'FAIL',
                        detail: {
                            message: 'The request is cancelled because of the backoff',
                        },
                    };
                }
                return this._wait(context.waitTimeMs, backoffState.mVc).then(() =>
                    self._retryLoop(context, inputs, attemptIndex),
                );
            }
        }

        return this._sendAttempt(attemptIndex++, context, inputs).then((attemptResult) => {
            // Log the attempt telemetry
            self.receiver.t3a({
                command: context.so + '-attempt',
                inputs,
                outputs: attemptResult,
                url: context.url,
            });

            // Update backoff manager with response headers
            self.backoffManager.DRc(attemptResult.headers, context.callMode);

            if (attemptResult.retry) {
                return self._wait(context.waitTimeMs, attemptResult.delay).then(() =>
                    self._retryLoop(context, inputs, attemptIndex),
                );
            }

            if (attemptResult.error) {
                throw attemptResult.error;
            }

            if (attemptResult.rNb === undefined) {
                throw {
                    pboc: false,
                    code: 'FAIL',
                    detail: { message: 'The response was undefined' },
                };
            }

            return attemptResult.rNb;
        });
    }

    /**
     * Determines whether the failed request should be retried based on
     * the error type and whether the retry limit has been reached.
     *
     * @param {object} context - Command context.
     * @param {object} error - The error from the failed attempt.
     * @param {number} attemptIndex - Current attempt number.
     * @param {number} maxRetries - Maximum allowed retries.
     * @returns {boolean} True if the request should be retried.
     * @private
     */
    _shouldRetry(context, error, attemptIndex, maxRetries) {
        const isRetriable = PboResponseParser.vEc(error);

        if (isRetriable && attemptIndex < maxRetries) {
            return true;
        }

        if (isRetriable) {
            this.log.error(
                'Method failed, retry limit exceeded, giving up',
                Object.assign(
                    {
                        Method: context.so,
                        Attempt: attemptIndex + 1,
                        MaxRetries: maxRetries,
                    },
                    this._formatError(error),
                ),
            );
        } else {
            this.log.error(
                'Method failed with an error that is not retriable, giving up',
                Object.assign({ Method: context.so }, this._formatError(error)),
            );
        }

        return false;
    }

    /**
     * Calculates the delay before the next retry attempt. Uses server-provided
     * backpressure delay if available, otherwise falls back to exponential
     * backoff with jitter.
     *
     * @param {object|null} backpressureInfo - Parsed backpressure header info.
     * @param {number} attemptIndex - Current attempt number.
     * @param {number} maxRetries - Maximum allowed retries.
     * @returns {number} Delay in milliseconds.
     * @private
     */
    _calculateRetryDelay(backpressureInfo, attemptIndex, maxRetries) {
        // Use server-specified retry delay if present
        const serverDelay = backpressureInfo?.I4a;
        if (serverDelay !== undefined) {
            return ri(serverDelay);
        }

        // Exponential backoff with jitter
        const minDelay = 1000 * (attemptIndex === 0 ? 1 : attemptIndex);
        const maxDelay = 1000 * Math.pow(2, Math.min(attemptIndex, maxRetries));
        return ellaSendRateMultiplier(this.randomGenerator.fPb(minDelay, maxDelay));
    }

    /**
     * Waits for the specified delay, optionally racing against a timeout.
     *
     * @param {number|undefined} timeoutMs - Optional timeout to race against.
     * @param {number|undefined} delayMs - Delay duration in ms.
     * @returns {Promise<void>}
     * @private
     */
    _wait(timeoutMs, delayMs) {
        const self = this;
        const delayPromise = new Promise((resolve) => {
            self.scheduler.scheduleDelay(delayMs || seekToSample, resolve);
        });
        return timeoutMs ? raceWithTimeout(timeoutMs, delayPromise, true) : delayPromise;
    }

    // ── Helpers ─────────────────────────────────────────────────────────

    /**
     * Formats an error for structured logging. If the error is already a
     * PBO error object, returns it directly; otherwise extracts key fields.
     *
     * @param {object} error - The error to format.
     * @returns {object} A loggable error summary.
     * @private
     */
    _formatError(error) {
        if (isPboError(error)) {
            return error;
        }
        return {
            message: error.message,
            errorSubCode: error.errorSubCode,
            errorExternalCode: error.errorExternalCode,
            mslCode: error.mslCode,
            data: error.data,
        };
    }

    /**
     * Marks a command record as successful.
     *
     * @param {PboCommandRecord} record
     * @private
     */
    _markRecordSuccess(record) {
        record.markSuccess();
    }

    /**
     * Marks a command record as failed and dumps command history if enabled.
     *
     * @param {PboCommandRecord} record - The command record.
     * @param {object} error - The error that caused the failure.
     * @returns {string} Serialized command history, or empty string.
     * @private
     */
    _handleFailure(record, error) {
        record.markFailed(error);
        if (this.commandHistory) {
            try {
                const historyJson = this.data.stringify(this.commandHistory);
                this.log.error('PBO command history', historyJson);
                return historyJson;
            } catch (_e) {
                // Ignore serialization failures
            }
        }
        return '';
    }
}

// ── Dependency Injection Decorators ─────────────────────────────────────────

let PboDispatcherInjectable = PboDispatcher;

export { PboDispatcherInjectable as EIa };

PboDispatcherInjectable = __decorate(
    [
        injectable(),
        __param(0, injectDecorator(LoggerToken)),
        __param(1, injectDecorator(internal_Pmb)),
        __param(2, injectDecorator(DataToken)),
        __param(3, injectDecorator(ClockToken)),
        __param(4, injectDecorator(enumConstants)),
        __param(5, injectDecorator(RandomGeneratorToken)),
        __param(6, injectDecorator(SchedulerToken)),
        __param(7, injectDecorator(ConfigToken)),
        __param(8, injectDecorator(EventBusToken)),
        __param(9, injectDecorator(ReceiverToken)),
        __param(10, injectDecorator(BackpressureToken)),
        __param(11, injectDecorator(BackoffToken)),
    ],
    PboDispatcherInjectable,
);

export {
    PboDispatcher,
    PboCommandRecord,
    PboCommandHistory,
    UI_VERSION_PREFIX_MAP,
};
