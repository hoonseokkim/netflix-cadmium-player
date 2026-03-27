/**
 * Buffer Health Monitor
 *
 * Monitors the health of playback buffers, emitting "healthChange" events
 * when the buffer level transitions between health states: EMPTY, CRITICAL,
 * LOW, and HEALTHY. Used by the ABR (adaptive bitrate) logic to make
 * quality decisions based on buffer conditions.
 *
 * @module BufferHealthMonitor
 * @source Module_74371
 */
export default function BufferHealthMonitor(module, exports, require) {
    var tslib, TimeUtil, EventEmitterModule, ObjectAssign;

    /**
     * Determines the health level of a buffer based on current level and thresholds.
     *
     * @param {number} bufferLevel - Current buffer level in seconds
     * @param {Object} thresholds - Object with JHc (healthy) and internal_Omc (low) thresholds
     * @returns {number} Health state enum value
     */
    function determineHealthLevel(bufferLevel, thresholds) {
        if (bufferLevel > thresholds.JHc) return BufferHealthState.HEALTHY;
        if (bufferLevel > thresholds.internal_Omc) return BufferHealthState.LOW;
        if (bufferLevel > 0) return BufferHealthState.CRITICAL;
        return BufferHealthState.EMPTY;
    }

    Object.defineProperties(exports, {
        __esModule: {
            value: true
        }
    });
    exports.createPipelineHealthMonitor = exports.cjb = void 0;

    tslib = require(22970);
    TimeUtil = require(91176);
    EventEmitterModule = require(90745);
    ObjectAssign = require(54520);

    /**
     * Buffer health state enum.
     * EMPTY(0) < CRITICAL(1) < LOW(2) < HEALTHY(3)
     */
    var BufferHealthState;
    (function (state) {
        state[state.EMPTY = 0] = "EMPTY";
        state[state.CRITICAL = 1] = "CRITICAL";
        state[state.LOW = 2] = "LOW";
        state[state.HEALTHY = 3] = "HEALTHY";
    })(BufferHealthState || (exports.cjb = BufferHealthState = {}));

    /**
     * Combined health snapshot holding both buffer and overall health state.
     * The minimumHealth property returns the minimum of both states.
     */
    var HealthSnapshot = (function () {
        function HealthSnapshot() {
            this.healthState = BufferHealthState.EMPTY;
            this.buffer = BufferHealthState.EMPTY;
        }
        Object.defineProperties(HealthSnapshot.prototype, {
            minimumHealth: {
                get: function () {
                    return Math.min(this.buffer, this.healthState);
                },
                enumerable: false,
                configurable: true
            }
        });
        return HealthSnapshot;
    })();

    /**
     * Creates a buffer health monitor that periodically checks buffer levels
     * and emits events when health state changes.
     *
     * @param {Object} config - Configuration with health check interval, thresholds, and stream access
     * @returns {Object} Monitor control object with start/stop/addListener/removeListener
     */
    exports.createPipelineHealthMonitor = function createBufferHealthMonitor(config) {
        var eventEmitter, healthStates, timerHandle, isHealthDegraded;

        function checkHealth() {
            var streams, iterator, item, stream, previousSnapshot, currentSnapshot,
                encryptionState, relaxedWaterMark, bufferSegment, bufferHealth;

            streams = config.tyc();
            try {
                for (var iter = tslib.__values(streams), next = iter.next(); !next.done; next = iter.next()) {
                    stream = next.value;
                    if (!stream.hasMoreSegments) {
                        previousSnapshot = healthStates[stream.n2a] || new HealthSnapshot();
                        currentSnapshot = (0, ObjectAssign.NI)(new HealthSnapshot(), healthStates[stream.n2a]);

                        encryptionState = config.initializeEncryption();
                        relaxedWaterMark = stream.liveEdgeTime.lowestWaterMarkLevelBufferRelaxed(encryptionState).playbackSegment;
                        currentSnapshot.healthState = determineHealthLevel(relaxedWaterMark, config);

                        bufferSegment = stream.IZ.playbackSegment;
                        bufferHealth = determineHealthLevel(bufferSegment, config);
                        currentSnapshot.buffer = bufferHealth;

                        if (isHealthDegraded && currentSnapshot.minimumHealth < BufferHealthState.HEALTHY) {
                            // Skip emitting while health is degraded and not yet recovered
                        } else {
                            if (isHealthDegraded) {
                                isHealthDegraded = false;
                            }
                            if (currentSnapshot.minimumHealth !== previousSnapshot.minimumHealth) {
                                healthStates[stream.n2a] = currentSnapshot;
                                eventEmitter.emit("healthChange", {
                                    ABc: currentSnapshot.minimumHealth,
                                    yoc: currentSnapshot.minimumHealth < previousSnapshot.minimumHealth,
                                    me: stream,
                                    ISc: Math.min(bufferSegment, relaxedWaterMark)
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                var errorResult = { error: error };
            } finally {
                try {
                    if (next && !next.done && (iter.return)) iter.return.call(iter);
                } finally {
                    if (errorResult) throw errorResult.error;
                }
            }
        }

        eventEmitter = new EventEmitterModule.EventEmitter();
        healthStates = {};
        timerHandle = null;
        isHealthDegraded = false;

        var monitor = {
            get isCancelled() {
                return !(timerHandle === null || timerHandle === undefined || !timerHandle.isCancelled);
            },

            start: function () {
                return tslib.__awaiter(void 0, void 0, void 0, function () {
                    return tslib.__generator(this, function () {
                        if (monitor.isCancelled) return [2];
                        timerHandle = config.forceEstRelativeLiveBookmark.startMonitoring(
                            checkHealth,
                            TimeUtil.fromMilliseconds(config.healthCheckInterval)
                        );
                        return [2];
                    });
                });
            },

            stopTimer: function () {
                return timerHandle === null || timerHandle === undefined
                    ? undefined
                    : timerHandle.destroy();
            },

            markHealthDegraded: function () {
                isHealthDegraded = true;
            },

            addListener: eventEmitter.addListener.bind(eventEmitter),
            removeListener: eventEmitter.removeListener.bind(eventEmitter)
        };

        return monitor;
    };
}
