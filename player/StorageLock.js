/**
 * @module StorageLock
 * @description Manages localStorage-based locks to enforce single-session playback.
 * Uses localStorage entries with timestamps and session IDs to coordinate
 * exclusive access across browser tabs. Locks auto-refresh on an interval
 * and expire after a configurable timeout.
 * @see Module_50040
 */

import { SUCCESS, lK as noop, DX as disposePhase, segmentDurationMs } from '../core/constants.js';
import { config } from '../core/PlayerConfig.js';
import { writeBytes } from '../events/EventBus.js';
import { getEpochTime as getEpochTime } from '../timing/Clock.js';
import { ea as EventTypes } from '../core/EventTypes.js';
import { assert } from '../assert/Assert.js';
import { disposableList } from '../core/DisposableList.js';
import { forEachProperty, initializeModel as stringifyError } from '../utils/ObjectUtils.js';
import { internal_Tka as absValue } from '../utils/MathUtils.js';
import { storage as storageAvailable } from '../core/Platform.js';
import { EM as isValidNumber } from '../utils/TypeChecks.js';
import { vk as componentKey } from '../core/ComponentKeys.js';

/** @type {Object|undefined} */
export let storageLockApi;

/**
 * Initializes the StorageLock component.
 * Registers with the INIT_COMPONENT_STORAGELOCK event and sets up
 * lock acquisition, refresh, and release mechanisms.
 */
disposableList.key(componentKey).register(EventTypes.INIT_COMPONENT_STORAGELOCK, function onInit(done) {
    let refreshStarted = false;
    const logger = disposableList.getCategoryLog('StorageLock');
    const activeLocks = {};
    const sessionId = Date.now() + '-' + Math.floor(1e6 * Math.random());

    /**
     * Starts the periodic lock refresh interval if not already started.
     * Also registers a beforeunload handler to clean up locks.
     */
    function startRefreshInterval() {
        if (refreshStarted) return;
        refreshStarted = true;

        const intervalId = setInterval(refreshAllLocks, config.lockRefresh);

        writeBytes.addListener(writeBytes.downloadNode, function onBeforeUnload(event) {
            if (event && event.isPopStateEvent) {
                logger.pauseTrace('popstate event, Lock timers can stay');
            } else {
                forEachProperty(activeLocks, (key, lock) => {
                    localStorage.removeItem(lock.name);
                });
                clearInterval(intervalId);
            }
        }, disposePhase);
    }

    /**
     * Refreshes all active locks by updating their timestamps in localStorage.
     */
    function refreshAllLocks() {
        const now = getEpochTime();
        forEachProperty(activeLocks, (key, lock) => {
            let lockData = localStorage.getItem(lock.name);
            lockData = JSON.parse(lockData);
            if (lockData) {
                lockData.updated = now;
            } else {
                lockData = {
                    updated: now,
                    drmSessionId: sessionId,
                    length: 1
                };
            }
            localStorage.setItem(lock.name, JSON.stringify(lockData));
        });
    }

    assert(storageAvailable);

    storageLockApi = {
        /**
         * Attempts to acquire a named lock in localStorage.
         * @param {string} name - The lock name (prefixed with "lock-").
         * @param {Function} callback - Called with { success: boolean, gva?: LockHandle }.
         * @param {boolean} [allowWait=false] - Whether to wait and retry if the lock is held by another session.
         */
        acquire(name, callback, allowWait = false) {
            if (!localStorage) {
                if (absValue.a_a) {
                    logger.error('Local storage access exception', {
                        errorSubCode: EventTypes.STORAGE_LOCALSTORAGE_ACCESS_EXCEPTION,
                        errorDetails: stringifyError(absValue.a_a)
                    });
                } else {
                    logger.error('No localstorage', {
                        errorSubCode: EventTypes.STORAGE_NO_LOCALSTORAGE
                    });
                }
                callback({ success: true });
                return;
            }

            const now = getEpochTime();
            const lockKey = 'lock-' + name;
            const newLockData = {
                updated: now,
                drmSessionId: sessionId,
                length: 1
            };

            try {
                if (lockKey in localStorage) {
                    const rawData = localStorage.getItem(lockKey);
                    let lastUpdated = 0;
                    const existingLock = JSON.parse(rawData);

                    if (isValidNumber(existingLock.updated)) {
                        lastUpdated = existingLock.updated;
                    }

                    const elapsedMs = absValue(now - lastUpdated) * segmentDurationMs;
                    const isSameSession = sessionId === existingLock.drmSessionId;

                    if (elapsedMs < config.lockExpiration) {
                        if (isSameSession) {
                            existingLock.length += 1;
                            logger.debug('Incremented lock count for existing playbackSession', {
                                id: sessionId,
                                length: existingLock.length
                            });
                            existingLock.updated = now;
                            commitLock(existingLock);
                        } else if (allowWait) {
                            const waitMs = config.lockExpiration - elapsedMs + segmentDurationMs;
                            logger.error('Waiting until current expiration to confirm whether lock is still active', {
                                id: sessionId,
                                length: existingLock.length,
                                Epoch: now,
                                LockEpoch: lastUpdated,
                                waitTimeoutMs: waitMs
                            });
                            setTimeout(() => this.acquire(name, callback, false), waitMs);
                        } else {
                            callback({ success: false });
                        }
                    } else {
                        logger.error('Lock was expired or invalid, ignoring', {
                            Epoch: now,
                            LockEpoch: lastUpdated
                        });
                        commitLock(newLockData);
                    }
                } else {
                    commitLock(newLockData);
                }
            } catch (err) {
                logger.error('Error acquiring Lock', {
                    errorSubCode: EventTypes.EXCEPTION,
                    errorDetails: stringifyError(err)
                });
                callback({ success: true });
            }

            /**
             * Writes lock data to localStorage and invokes the callback.
             * @param {Object} lockData - The lock data to persist.
             */
            function commitLock(lockData) {
                localStorage.setItem(lockKey, JSON.stringify(lockData));
                const handle = { Qy: lockKey };
                activeLocks[lockKey] = handle;
                logger.pauseTrace('Lock acquired', { Name: handle.name });
                startRefreshInterval();
                callback({ success: true, gva: handle });
            }
        },

        /**
         * Releases a previously acquired lock.
         * @param {Object} lockHandle - The lock handle returned from acquire().
         * @param {Function} [callback] - Optional callback invoked with SUCCESS.
         */
        release(lockHandle, callback) {
            assert(activeLocks[lockHandle.name] === lockHandle);

            if (localStorage) {
                try {
                    const rawData = localStorage.getItem(lockHandle.name);
                    const lockData = JSON.parse(rawData);
                    if (lockData && lockData.length > 1) {
                        lockData.length--;
                        localStorage.setItem(lockHandle.name, JSON.stringify(lockData));
                        logger.pauseTrace('Lock count decremented', {
                            Name: lockHandle.name,
                            length: lockData.length
                        });
                    } else {
                        localStorage.removeItem(lockHandle.name);
                        delete activeLocks[lockHandle.name];
                        logger.pauseTrace('Lock released', {
                            Name: lockHandle.name
                        });
                    }
                } catch (err) {
                    logger.error('Unable to release Lock', {
                        Name: lockHandle.name
                    }, err);
                }
                if (callback) callback(SUCCESS);
            }
        }
    };

    if (config.enforceSingleSession) {
        storageLockApi.acquire('session', (result) => {
            storageLockApi.bSb = result;
            done(SUCCESS);
        });
    } else {
        done(SUCCESS);
    }
});
