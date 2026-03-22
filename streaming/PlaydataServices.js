/**
 * Netflix Cadmium Player - Playdata Services
 *
 * Manages playback data collection, persistence (IndexedDB), and reporting
 * to Netflix servers. Handles start/stop/pause/resume/splice lifecycle events,
 * periodic playdata snapshots, and keepalive pings during active playback.
 *
 * @module PlaydataServices
 * @original Module_91859
 * @injectable
 */

// import { __decorate, __param } from 'tslib'; // webpack 22970
// import { injectable, inject } from 'inversify'; // webpack 22674
// import { ellaSendRateMultiplier } from '../utils/ConfigUtils.js'; // webpack 5021
// import { LoggerToken, LogLevel } from '../core/LoggerToken.js'; // webpack 87386
// import { valueList as SchedulerToken } from '../core/Scheduler.js'; // webpack 53085
// import { TIa as PlaydataStoreToken } from '../streaming/PlaydataStore.js'; // webpack 32979
// import { internal_Mib as PlaydataFactoryToken } from '../streaming/PlaydataFactory.js'; // webpack 62278
// import { xjb as PlaydataConfigToken } from '../streaming/PlaydataConfig.js'; // webpack 95398
// import { errorCodes, internal_Yka } from '../core/ErrorCodes.js'; // webpack 36129
// import { qla as PlaydataEncoder } from '../streaming/PlaydataEncoder.js'; // webpack 23048
// import { pla as PlaydataEventType, internal_Oib } from '../streaming/PlaydataEventTypes.js'; // webpack 10469
// import { zN as partition } from '../utils/ArrayUtils.js'; // webpack 45266
// import { PlayerCoreToken } from '../player/PlayerCore.js'; // webpack 30869
// import { T7 as ViewableConfigToken } from '../core/ViewableConfig.js'; // webpack 79274

/**
 * Manages a single playdata monitoring session for one playback.
 * Periodically saves playdata to IDB and handles final send on stop.
 * @private
 */
class PlaydataMonitor {
    /**
     * @param {Object} logger - Logger instance
     * @param {Object} scheduler - Scheduler for intervals
     * @param {Object} startTime - Playback start time reference
     * @param {Object} snapshotFactory - Creates playdata snapshots
     * @param {Object} playdataStore - Persistent playdata store (IDB)
     * @param {Object} playdataSender - Sends playdata to server
     */
    constructor(logger, scheduler, startTime, snapshotFactory, playdataStore, playdataSender) {
        this.log = logger;
        this.scheduler = scheduler;
        this.startTime = startTime;
        this._snapshotFactory = snapshotFactory;
        this._playdataStore = playdataStore;
        this._playdataSender = playdataSender;
        this._hasLoggedIdbError = false;
        this.isCancelled = false;
    }

    /**
     * Starts periodic playdata collection
     * @param {Object} config - Collection interval config
     * @param {Object} initialPlaydata - Initial playdata to persist
     */
    startCollection(config, initialPlaydata) {
        const self = this;

        function saveSnapshot() {
            const snapshot = self._snapshotFactory.create(self.startTime);
            self._playdataStore.saveChanges(snapshot).catch((error) => {
                const level = self._hasLoggedIdbError ? LogLevel.WARN : LogLevel.ERROR;
                self._hasLoggedIdbError = true;
                self.log.write(level, "Unable to save playdata changes to IDB", error);
            });
        }

        this.log.trace("Adding initial playdata", initialPlaydata);

        this._playdataStore.addPlaydata(initialPlaydata).then(() => {
            self.log.trace("Scheduling monitor", { interval: config });
            self._intervalHandle = self.scheduler.repeatInterval(config, saveSnapshot);
        }).catch((error) => {
            self.log.error("Unable to add playdata", {
                error,
                playdata: new PlaydataEncoder().encode(initialPlaydata)
            });
            self._intervalHandle = self.scheduler.repeatInterval(config, saveSnapshot);
        });
    }

    /**
     * Stops collection and optionally sends final playdata to server
     * @param {boolean} shouldSend - Whether to send data to server
     * @returns {Promise<void>}
     */
    stop(shouldSend) {
        const self = this;
        if (this.isCancelled) return Promise.resolve();

        if (this._intervalHandle) this._intervalHandle.cancel();
        const snapshot = this._snapshotFactory.create(this.startTime);

        return this._playdataStore.saveChanges(snapshot)
            .catch((error) => {
                self.log.error("Unable to update playdata changes during stop", error);
            })
            .then(() => {
                if (shouldSend) {
                    if (self.startTime.background.value) {
                        self.log.trace("Playback is currently in the background, not sending playdata", snapshot);
                        return Promise.resolve();
                    }
                    self.log.trace("Sending final playdata to the server", snapshot);
                    return self._playdataSender.sendPlaydata(snapshot);
                }
                self.log.trace("Not configured to send play data");
            })
            .then(() => {
                if (shouldSend) {
                    self.log.trace("Removing playdata from the persisted store", snapshot);
                    return self._playdataStore.removePlaydata(snapshot);
                }
                self.log.trace("Not configured to send play data, keeping in IDB");
            })
            .then(() => {
                self.log.info("Successfully stopped the playback", snapshot.sessionId);
            })
            .catch((error) => {
                self.log.error("Unable to remove playdata changes", error);
                throw error;
            });
    }

    /**
     * Cancels collection immediately without sending
     */
    cancel() {
        this.isCancelled = true;
        if (this._intervalHandle) this._intervalHandle.cancel();
        this._playdataStore.saveChanges(this._snapshotFactory.create(this.startTime));
    }
}

/**
 * Top-level playdata service that manages multiple playback sessions.
 * Handles start, stop, pause, resume, splice, and keepalive events.
 */
export class PlaydataServices {
    /**
     * @param {Object} config - Playdata configuration
     * @param {Object} logger - Logger factory
     * @param {Object} scheduler - Task scheduler
     * @param {Object} playdataStore - Persistent store (IDB)
     * @param {Object} snapshotFactory - Snapshot creator
     * @param {Object} playdataSender - Server communication
     * @param {Function} viewableConfig - Viewable error config resolver
     */
    constructor(config, logger, scheduler, playdataStore, snapshotFactory, playdataSender, viewableConfig) {
        this.config = config;
        this.scheduler = scheduler;
        this._playdataStore = playdataStore;
        this._snapshotFactory = snapshotFactory;
        this._playdataSender = playdataSender;
        this._viewableConfig = viewableConfig;
        this._pendingEventChain = Promise.resolve();
        this.closed = false;
        this.log = logger.createSubLogger("PlaydataServices");

        /** @type {Array<{key: string, monitor: PlaydataMonitor, started: boolean, stopped: boolean}>} */
        this._sessions = [];

        /** @type {Set<string>} Active session transaction IDs */
        this._activeSessions = new Set();
    }

    /**
     * Initializes the service by reading persisted playdata from IDB
     * @returns {Promise<PlaydataServices>}
     */
    initialize() {
        const self = this;
        if (!this._initPromise) {
            this.log.trace("Starting playdata services");
            this._initPromise = this._playdataStore.readAll()
                .then(() => self)
                .catch((error) => {
                    self.log.error("Unable to read the playdata, it will be deleted", error);
                    return self;
                });
        }
        return this._initPromise;
    }

    /**
     * Marks the service as closing and cancels all active monitors
     */
    close() {
        this.closed = true;
        this._sessions.forEach(session => session.monitor.cancel());
    }

    /**
     * Sends any unsent persisted playdata to the server
     * @param {*} [sessionId] - Specific session to send (Infinity = all)
     * @returns {Promise<void>}
     */
    sendPersistedPlaydata(sessionId) {
        if (this.closed) return Promise.resolve();
        const config = this.config;
        return config.playdataEnabled && config.sendPlaydata
            ? this._flushPersistedPlaydata(sessionId)
            : Promise.resolve();
    }

    /**
     * Starts a new playback session with playdata collection
     * @param {Object} playbackState - Current playback state
     * @param {boolean} enableKeepalive - Whether to send keepalive pings
     * @param {Function} errorCallback - Error handler for keepalive failures
     */
    startPlayback(playbackState, enableKeepalive, errorCallback) {
        if (this.closed) return;
        this._startCollection(playbackState);
        this._sendStartEvent(playbackState).catch((error) => {
            this.log.error("Start command failed", {
                playdata: error.playdata,
                error: error.error
            });
        });
        if (enableKeepalive) {
            const interval = this._getKeepaliveInterval(playbackState);
            this._scheduleKeepalive(interval, playbackState, errorCallback);
        }
    }

    /**
     * Stops playback data collection for a session
     * @param {Object} playbackState - Playback state to stop
     * @returns {Promise<void>}
     */
    stopPlayback(playbackState) {
        if (this.closed) return Promise.resolve();

        const self = this;
        const snapshot = this._snapshotFactory.create(playbackState);
        this._activeSessions.delete(snapshot.sourceTransactionId);

        const partitioned = partition(
            (session) => session.key === snapshot.sourceTransactionId,
            this._sessions
        );
        const matching = partitioned.next().value;
        this._sessions = partitioned.next().value;

        return Promise.all(matching.map((session) => {
            session.stopped = true;
            return session.monitor.stop(self.config.sendPlaydata);
        })).then(() => {});
    }

    /**
     * Sends a pause event
     * @param {Object} playbackState - Current playback state
     * @returns {Promise<void>}
     */
    sendPauseEvent(playbackState) {
        return this._sendLifecycleEvent(PlaydataEventType.pause, playbackState, "PAUSE");
    }

    /**
     * Sends a resume event
     * @param {Object} playbackState - Current playback state
     * @returns {Promise<void>}
     */
    sendResumeEvent(playbackState) {
        return this._sendLifecycleEvent(PlaydataEventType.resume, playbackState, "RESUME");
    }

    /**
     * Sends a splice event
     * @param {Object} playbackState - Current playback state
     * @returns {Promise<void>}
     */
    sendSpliceEvent(playbackState) {
        return this._sendLifecycleEvent(PlaydataEventType.splice, playbackState, "SPLICE");
    }

    /**
     * Cancels the keepalive timer
     */
    cancelKeepalive() {
        this._cancelKeepaliveTimer();
    }

    // --- Private methods ---

    /** @private */
    _startCollection(playbackState) {
        playbackState.recordPlayDelay("pdb");
        if (!this.config.collectionConfig.isEnabled()) return;

        const snapshot = this._snapshotFactory.create(playbackState);
        const txId = snapshot.sourceTransactionId;

        if (this._sessions.some(s => s.key === txId)) {
            this.log.trace("Already collecting playdata, ignoring", snapshot);
            return;
        }

        this.log.info("Starting to collect playdata", snapshot);
        this._activeSessions.add(txId);
        this._sessions.push({
            key: txId,
            monitor: this._createMonitor(playbackState, snapshot),
            started: false,
            stopped: false
        });
    }

    /** @private */
    _flushPersistedPlaydata(sessionId) {
        const self = this;
        let toSend;
        const persisted = this._playdataStore.playdata.filter(
            (pd) => !self._activeSessions.has(pd.sourceTransactionId)
        );

        if (sessionId && sessionId === Infinity) {
            toSend = persisted;
        } else {
            const partitioned = partition((pd) => pd.sessionId === sessionId, persisted);
            toSend = partitioned.next().value;
            const remaining = partitioned.next().value;

            if (remaining?.length > 0) {
                this.scheduler.scheduleDelay(this.config.sendDelay, () => {
                    self._sendAndRemove(remaining).catch(() => {});
                });
            }
        }

        return toSend?.length ? this._sendAndRemove(toSend) : Promise.resolve();
    }

    /** @private */
    _sendAndRemove(playdataList) {
        const self = this;
        function sendOne(pd) {
            return self._playdataSender.sendPlaydata(pd).then(() => self._removePlaydata(pd));
        }
        return playdataList.reduce(
            (chain, pd) => chain.then(() => sendOne(pd)),
            Promise.resolve()
        );
    }

    /** @private */
    _removePlaydata(playdata) {
        const self = this;
        return this._playdataStore.removePlaydata(playdata).then(() => {}).catch((error) => {
            self.log.error("Unable to complete the stop lifecycle event", error);
            throw error;
        });
    }

    /** @private */
    _createMonitor(playbackState, snapshot) {
        const monitor = new PlaydataMonitor(
            this.log, this.scheduler, playbackState,
            this._snapshotFactory, this._playdataStore, this._playdataSender
        );
        monitor.startCollection(this.config.collectionConfig, snapshot);
        return monitor;
    }

    /** @private */
    _sendStartEvent(playbackState) {
        const self = this;
        const snapshot = this._snapshotFactory.create(playbackState);

        return this._playdataSender.sendStartEvent(playbackState, snapshot).then(() => {
            self._markSessionStarted(playbackState);
        }).catch((error) => {
            self._markSessionStarted(playbackState);
            throw { playdata: snapshot, error };
        });
    }

    /** @private */
    _markSessionStarted(playbackState) {
        this._sessions
            .filter(s => s.key === playbackState.sourceTransactionId.toString())
            .forEach(s => s.started = true);
    }

    /**
     * Sends a lifecycle event (pause/resume/splice/keepalive)
     * @private
     */
    _sendLifecycleEvent(eventType, playbackState, errorCode) {
        const self = this;

        function isInactive(state) {
            const sessions = self._sessions.filter(
                s => s.key === state.sourceTransactionId.toString()
            );
            return sessions.length === 0 || sessions.reduce((acc, s) => acc || s.stopped || !s.started, false);
        }

        if (isInactive(playbackState)) return this._pendingEventChain;

        return this._pendingEventChain = this._pendingEventChain
            .catch(() => Promise.resolve())
            .then(() => {
                if (isInactive(playbackState)) return Promise.resolve();
                const snapshot = self._snapshotFactory.create(playbackState);
                return self._playdataSender.sendLifecycleEvent(eventType, playbackState, snapshot);
            })
            .then(result => result)
            .catch((error) => {
                self.log.error("Failed to send event", {
                    eventKey: eventType,
                    xid: playbackState.sourceTransactionId,
                    error
                });
                let viewableError;
                if (error.errorDisplayMessage) {
                    viewableError = self._viewableConfig(errorCode, error);
                } else if (error.mslCode === "CONTENT_UNAVAILABLE") {
                    viewableError = self._viewableConfig(errorCode, error);
                }
                throw { originalError: error, viewableError };
            });
    }

    /** @private */
    _scheduleKeepalive(interval, playbackState, errorCallback) {
        const self = this;
        this._cancelKeepaliveTimer();

        this._keepaliveHandle = this.scheduler.scheduleDelay(interval, () => {
            self._cancelKeepaliveTimer();
            self._sendLifecycleEvent(PlaydataEventType.keepalive, playbackState, "KEEPALIVE")
                .then(() => self._scheduleKeepalive(interval, playbackState, errorCallback))
                .catch((error) => {
                    const viewableError = error.viewableError;
                    if (viewableError) errorCallback(viewableError);
                    if (error.originalError?.mslCode !== "CONTENT_UNAVAILABLE") {
                        self._scheduleKeepalive(interval, playbackState, errorCallback);
                    }
                });
        });
    }

    /** @private */
    _cancelKeepaliveTimer() {
        if (this._keepaliveHandle) {
            this._keepaliveHandle.cancel();
            this._keepaliveHandle = undefined;
        }
    }

    /** @private */
    _getKeepaliveInterval(playbackState) {
        return playbackState.sessionContext.keepaliveRate
            ? ellaSendRateMultiplier(playbackState.sessionContext.keepaliveRate)
            : this.config.defaultKeepaliveInterval;
    }
}
