/**
 * Netflix Cadmium Player - ELLA ASE Client
 *
 * Manages connections to ELLA relay servers, handles channel joining with
 * retry logic across multiple relays, processes received media objects,
 * monitors channel health, and triggers channel/relay switches when needed.
 */

// import { __awaiter, __generator } from './modules/Module_22970.js';
// import { platform } from './modules/Module_66164.js';
// import { assert, findLast } from './modules/Module_91176.js';
// import { laser, mediaTypeToString } from './classes/DISABLED.js';
// import { EllaChannelHealthMonitor } from './ella/EllaChannelHealth.js';

/**
 * Streaming lifecycle state.
 * @enum {number}
 */
const StreamingState = Object.freeze({
    STOPPED: 0,
    STARTING: 1,
    STARTED: 2,
});

const logger = new p.platform.Console("ASEJS_ELLA_ASE_CLIENT", "media|asejs");

/**
 * ELLA ASE (Adaptive Streaming Engine) client.
 *
 * Connects to relay servers, subscribes to media channels, receives
 * streaming objects (segments), tracks network/channel health, and
 * orchestrates ABR-driven channel switches.
 */
class EllaAseClient {
    /**
     * @param {Object} config - Player configuration.
     * @param {Object} track - Track metadata and downloadables.
     * @param {Object} segmentHandler - Callback handler for received segments.
     * @param {Object} callbacks - Event callbacks (onRelaySwitch, onEllaFallback, etc.).
     * @param {Object} ellaAlgorithms - ELLA algorithm suite (channelSelector, networkTracker, channelHealthMonitor).
     * @param {Array} relayServers - Available relay server descriptors.
     * @param {number} playgraphId - Playgraph session identifier.
     * @param {*} securityKey - Security/DRM key material.
     * @param {*} securityToken - Security/DRM token.
     */
    constructor(config, track, segmentHandler, callbacks, ellaAlgorithms, relayServers, playgraphId, securityKey, securityToken) {
        this.config = config;
        this.track = track;
        this.segmentHandler = segmentHandler;
        this.callbacks = callbacks;
        this.ellaAlgorithms = ellaAlgorithms;
        this.relayServers = relayServers;
        this.playgraphId = playgraphId;
        this.securityKey = securityKey;
        this.securityToken = securityToken;

        this.currentChannel = null;
        this.nextChannel = null;
        this.connection = null;
        this.expectedObjectId = null;
        this.isFailed = false;

        this.networkStats = {
            packetsSent: 0,
            packetsReceived: 0,
            packetLossRate: 0,
            queuingDelay: 0,
        };

        this.state = StreamingState.STOPPED;
        this.drmSessionId = null;
        this.healthTimerHandle = null;
        this.lastHealthCheckTimestamp = 0;
        this.healthMonitorWindowMs = 0;
        this.lastActivityTimestamp = 0;
        this.isAttemptingChannelFix = false;
        this.objectIdToEventIdMap = new Map();
        this.processedObjectIds = new Set();
        this.connectionTimestamp = 0;
        this.currentRelayServer = undefined;

        this.mediaType = this.track.mediaType;

        logger.pauseTrace(this.mediaType, "ELLA: Constructor: ", this.config.liveIsEllaEnabled);
        (0, c.assert)(ellaAlgorithms);
        (0, c.assert)(relayServers);
        logger.pauseTrace(this.mediaType, "using channel selector: ", this.ellaAlgorithms.channelSelector.name);
        logger.pauseTrace(this.mediaType, "first relay server is ", JSON.stringify(this.relayServers[0]));
        logger.pauseTrace(this.mediaType, "security keys: ", this.securityKey, this.securityToken);

        this.channelStateTracker = new f.pcb();
    }

    /**
     * The segment duration in ms from the track's playback info.
     * @returns {number}
     */
    get segmentDurationMs() {
        return this.track.trackInfo.playbackSegment;
    }

    /**
     * Create a unique event ID for telemetry, combining media type, connection timestamp, and object ID.
     *
     * @param {number} objectId - The object/segment ID.
     * @returns {string} Unique event identifier.
     */
    createObjectEventId(objectId) {
        return `${(0, g.mediaTypeToString)(this.mediaType)}-${this.connectionTimestamp}-${objectId}`;
    }

    /**
     * Extract the numeric relay server ID from a relay server descriptor.
     *
     * @param {Object} relayServer - Relay server object with an `id` field.
     * @returns {number} Numeric relay ID.
     */
    getRelayServerId(relayServer) {
        return Number(relayServer.id);
    }

    /**
     * Create a channel key object for health tracking.
     *
     * @param {string} channelName - The channel name.
     * @param {number} relayId - The relay server ID.
     * @returns {Object} Channel key with channelName (as `ec`) and relayId.
     */
    createChannelKey(channelName, relayId) {
        return { ec: channelName, relayId };
    }

    /**
     * Join a specific channel on a relay server. Sets up the transport
     * connection and event listeners for object reception.
     *
     * @param {Object} relayServer - The relay server to connect to.
     * @param {string} channelName - The channel to subscribe to.
     */
    async joinChannel(relayServer, channelName) {
        const viewableSession = this.track.viewableSession;
        const transportPromise = viewableSession.ellaTransport;

        if (!transportPromise) {
            throw Error("Ella is not enabled for this viewable");
        }

        const transport = await transportPromise;
        logger.pauseTrace(this.mediaType, "ELLA: Joining channel", relayServer, channelName);

        const relayId = this.getRelayServerId(relayServer);
        const channelKey = this.createChannelKey(channelName, relayId);
        this.channelStateTracker.onChannelJoining(channelKey, this.mediaType);

        try {
            const sessionKey = await viewableSession.ellaSessionKey;
            this.connection = await transport.join(sessionKey, relayServer.ipAddress, relayServer.port, channelName);
            this.channelStateTracker.onChannelJoined(channelKey, this.mediaType);

            this.connection?.on("object", this.onObjectReceived.bind(this));
            this.connection?.on("first-byte", this.onFirstByteReceived.bind(this));
            this.connection?.on("progress", this.onProgressUpdate.bind(this));
            this.connection?.on("abandoned", this.onObjectAbandoned.bind(this));
        } catch (error) {
            this.channelStateTracker.onChannelJoinFailed(channelKey, this.mediaType);
            throw error;
        }
    }

    /**
     * Attempt to join a channel, cycling through available relay servers on failure.
     *
     * @param {string} channelName - The channel to subscribe to.
     * @param {string} [reason="AT_LIVE_EDGE"] - Reason for the join attempt (for telemetry).
     * @returns {Object|null} The relay server that was successfully joined, or null if all failed.
     */
    async joinChannelWithRetry(channelName, reason = "AT_LIVE_EDGE") {
        const previousChannel = this.nextChannel || this.currentChannel;
        const previousBitrate = previousChannel?.streamInfo.bitrate ?? 0;
        const maxAttempts = this.relayServers?.length ?? 0;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const nextRelayId = this.ellaAlgorithms.channelHealthMonitor.getNextValidRelay(this.mediaType);
            if (nextRelayId === null) {
                logger.error(this.mediaType, "ELLA: No more valid relay servers available after", attempt, "attempts");
                return null;
            }

            const relayServer = this.findRelayServerById(nextRelayId);
            if (relayServer === null) {
                logger.error(this.mediaType, "ELLA: Could not find relay server with id", nextRelayId);
                attempt++;
                continue;
            }

            this.connectionTimestamp = p.platform.platform.now();
            this.drmSessionId = `${channelName}-${relayServer.id}-${this.connectionTimestamp}`;

            try {
                logger.pauseTrace(
                    this.mediaType,
                    "ELLA: Attempting to join channel", channelName,
                    "on relay server", relayServer.id,
                    "(attempt", attempt + 1, "of", maxAttempts, ")"
                );

                if (previousChannel) {
                    g.laser.log({
                        type: "ELLA_CHANNEL_STATE_CHANGE",
                        state: "SUBSCRIBING",
                        perspective: "OUTGOING",
                        playgraphId: this.playgraphId,
                        id: this.drmSessionId,
                        bitrateKbps: previousBitrate,
                        mediaType: (0, g.mediaTypeToString)(this.mediaType),
                        channelName: previousChannel.channelName,
                        subscriber: { nodeType: "CLIENT", context: { xid: "123" } },
                        provider: { nodeType: "RELAY", context: { relayId: 123 } },
                        reason,
                    });
                }

                await this.joinChannel(relayServer, channelName);

                logger.pauseTrace(this.mediaType, "ELLA: Successfully joined channel", channelName, "on relay server", relayServer.id);
                g.laser.log({
                    type: "ELLA_CHANNEL_STATE_CHANGE",
                    perspective: "OUTGOING",
                    state: "SUBSCRIBED",
                    playgraphId: this.playgraphId,
                    id: this.drmSessionId,
                });

                this.reportRelaySwitch(relayServer, channelName, attempt);
                return relayServer;
            } catch (error) {
                logger.error(
                    this.mediaType,
                    "ELLA: Failed to join channel", channelName,
                    "on relay server", relayServer.id,
                    "Error:", error?.message || error
                );

                this.ellaAlgorithms?.channelHealthMonitor.reportChannelFailure(
                    this.getRelayServerId(relayServer),
                    channelName
                );
                this.reportRelayFailure(relayServer, channelName, "fail_to_join");

                g.laser.log({
                    type: "ELLA_CHANNEL_STATE_CHANGE",
                    perspective: "OUTGOING",
                    state: "UNSUBSCRIBED",
                    reason: "JOIN_REJECTED",
                    playgraphId: this.playgraphId,
                    id: this.drmSessionId,
                    error: {
                        code: "JOIN_REJECTED",
                        message: error?.message || String(error) || "Failed to join relay server",
                    },
                });
            }
        }

        logger.error(this.mediaType, "ELLA: Exhausted all relay servers. Unable to join channel", channelName);
        return null;
    }

    /**
     * Report a relay failure to the callback handler.
     *
     * @param {Object} relayServer - The failing relay server.
     * @param {string} channelName - The channel that failed.
     * @param {string} reason - Failure reason string.
     */
    reportRelayFailure(relayServer, channelName, reason) {
        if (this.callbacks.onRelayFailure) {
            const relayId = this.getRelayServerId(relayServer);
            logger.pauseTrace(this.mediaType, "ELLA: Relay failure detected", relayId, channelName, "reason:", reason);
            this.callbacks.onRelayFailure(relayId, channelName, reason);
        }
    }

    /**
     * Report a relay switch to the callback handler.
     *
     * @param {Object} relayServer - The new relay server.
     * @param {string} channelName - The channel being switched to.
     * @param {number} attemptNumber - Which retry attempt succeeded (0 = first try).
     */
    reportRelaySwitch(relayServer, channelName, attemptNumber) {
        const relayId = this.getRelayServerId(relayServer);
        if (this.currentRelayServer && this.getRelayServerId(this.currentRelayServer) === relayId) return;
        if (!this.callbacks.onRelaySwitch) return;

        let reason;
        if (!this.currentRelayServer && attemptNumber === 0) {
            reason = "initial";
        } else if (attemptNumber > 0) {
            reason = "fail_to_join";
        } else {
            reason = "fail_to_receive";
        }

        logger.pauseTrace(this.mediaType, "ELLA: Relay switch detected", relayId, channelName, "reason:", reason);
        this.callbacks.onRelaySwitch(relayId, channelName, reason);
    }

    /**
     * Determine whether a channel switch is needed based on ABR selection
     * and relay health.
     *
     * @param {boolean} hasGap - Whether a gap in segment IDs was detected.
     * @returns {boolean} True if a channel switch should be performed.
     */
    needsChannelSwitch(hasGap) {
        if (!this.config.liveIsEllaABREnabled) return false;

        let switchNeeded = false;
        const nextValidRelay = this.ellaAlgorithms.channelHealthMonitor.getNextValidRelay(this.mediaType);
        this.nextChannel = this.ellaAlgorithms.channelSelector.selectChannel(this.mediaType, this.currentChannel, hasGap);

        if (nextValidRelay === null || this.nextChannel === null) {
            if (this.callbacks.onEllaFallback) {
                this.callbacks.onEllaFallback("fail_to_receive");
            }
            return switchNeeded;
        }

        const currentRelayId = this.currentRelayServer ? this.getRelayServerId(this.currentRelayServer) : undefined;
        const nextChannelName = this.nextChannel?.channelName;
        const currentChannelName = this.currentChannel?.channelName;

        if (nextValidRelay !== currentRelayId || nextChannelName !== currentChannelName) {
            logger.pauseTrace(
                this.mediaType,
                " need to switch to channel ",
                this.nextChannel.channelName,
                ", relay server: ",
                nextValidRelay
            );
            switchNeeded = true;
        }

        return switchNeeded;
    }

    /**
     * Handle a fully received streaming object (media segment).
     * Updates health tracking, forwards the segment to the manager,
     * resets network stats, and checks whether a channel switch is needed.
     *
     * @param {Object} ellaObject - The received ELLA object with metadata and data payload.
     */
    async onObjectReceived(ellaObject) {
        logger.pauseTrace(
            `${this.mediaType}, ELLA: Object complete (objectId=${ellaObject.metadata.objectId}, channelId=${ellaObject.channelId}, channelName=${ellaObject.channelName})`
        );

        // First object: mark streaming as started
        if (this.expectedObjectId === null) {
            this.expectedObjectId = ellaObject.metadata.objectId;
            if (this.state !== StreamingState.STARTED && this.callbacks.onEllaStarted) {
                this.callbacks.onEllaStarted(
                    1,
                    this.currentRelayServer ? this.getRelayServerId(this.currentRelayServer) : 0,
                    this.currentChannel?.channelName ?? "",
                    this.networkStats
                );
            }
            this.state = StreamingState.STARTED;
        }

        // Detect and discard duplicate (late/out-of-order) segments
        if (ellaObject.metadata.objectId < this.expectedObjectId) {
            if (this.callbacks.onDuplicateSegment) {
                this.callbacks.onDuplicateSegment(1);
            }
            logger.error(
                this.mediaType,
                "Duplicate segment: ",
                ellaObject.channelId,
                ellaObject.channelName,
                ellaObject.metadata.objectId
            );
            return;
        }

        const hasGap = ellaObject.metadata.objectId > this.expectedObjectId;

        // Update channel health tracking
        if (this.currentRelayServer && this.ellaAlgorithms) {
            const relayId = this.getRelayServerId(this.currentRelayServer);
            const channelKey = this.createChannelKey(ellaObject.channelName, relayId);
            this.channelStateTracker.onObjectProgress(
                channelKey,
                this.mediaType,
                ellaObject.metadata.objectId,
                p.platform.platform.now()
            );
            this.ellaAlgorithms.channelHealthMonitor.reportChannelSuccess(relayId, ellaObject.channelName);
            this.performHealthCheck();
        }

        this.processedObjectIds.item(ellaObject.metadata.objectId);

        // Forward to the segment handler (EllaManager)
        this.segmentHandler.onObjectReceived(ellaObject, this.connection.channelName, this.networkStats);
        this.ellaAlgorithms.networkTracker.resetNetworkStats();

        // Check if ABR wants to switch channels
        await this.checkAndSwitchChannel(hasGap);
        this.expectedObjectId = ellaObject.metadata.objectId + 1;
    }

    /**
     * Handle the first byte of a new object being received.
     * Emits a telemetry event for object tracking.
     *
     * @param {Object} event - First-byte event with objectId.
     */
    onFirstByteReceived(event) {
        const objectId = event.objectId;
        if (this.objectIdToEventIdMap.has(objectId) || this.processedObjectIds.has(objectId)) {
            return;
        }

        const eventId = this.createObjectEventId(objectId);
        this.objectIdToEventIdMap.set(objectId, eventId);

        g.laser.log({
            type: "ELLA_OBJECT_STATE_CHANGE",
            state: "RECEIVING",
            playgraphId: this.playgraphId,
            channelName: this.currentChannel?.channelName ?? "",
            objectType: "MEDIA_SEGMENT",
            objectId,
            id: eventId,
            objectBoundaryIndex: 0,
            provider: {
                nodeType: "RELAY",
                context: {
                    relayId: this.currentRelayServer ? this.getRelayServerId(this.currentRelayServer) : 0,
                },
            },
            subscriber: {
                nodeType: "CLIENT",
                context: { xid: "123" },
            },
        });
    }

    /**
     * Handle an object that was abandoned (incomplete/timed out).
     *
     * @param {Object} event - Abandoned event with objectId and packet summary.
     */
    onObjectAbandoned(event) {
        const objectId = event.objectId;
        this.processedObjectIds.item(objectId);

        const eventId = this.objectIdToEventIdMap.key(objectId) ?? this.createObjectEventId(objectId);
        const packetSummary = event.aOc;

        g.laser.log({
            type: "ELLA_OBJECT_STATE_CHANGE",
            state: "ABANDONED",
            playgraphId: this.playgraphId,
            id: eventId,
            packetSummary: {
                earliestPacketTimestampMs: packetSummary?.earliestPacketTimestampMs ?? 0,
                latestPacketTimestampMs: packetSummary?.latestPacketTimestampMs ?? 0,
                totalPackets: packetSummary?.totalPackets ?? 0,
                totalBytes: packetSummary?.totalBytes ?? 0,
                minPacketId: packetSummary?.minPacketId ?? 0,
                maxPacketId: packetSummary?.maxPacketId ?? 0,
                outOfOrderDetected: packetSummary?.outOfOrderDetected ?? false,
            },
            error: {
                code: "ABANDONED",
                message: "Object abandoned by ella-object",
            },
        });

        logger.pauseTrace(this.mediaType, "ELLA: Object abandoned", { kr: objectId });
    }

    /**
     * If a channel switch is needed, disconnect from the current channel
     * and join the new one selected by the ABR algorithm.
     *
     * @param {boolean} hasGap - Whether a gap in segment IDs was detected.
     */
    async checkAndSwitchChannel(hasGap) {
        const switchNeeded = this.needsChannelSwitch(hasGap);
        if (!switchNeeded) return;

        const newStreamId = this.nextChannel.selectedStreamId;
        const switchInfo = {
            Hgc: this.nextChannel.channelName,
            encodingBitrateKbps: this.nextChannel.streamInfo.bitrate,
        };

        this.logChannelStateChange("CHANNEL_SWITCH");

        const newRelay = await this.joinChannelWithRetry(this.nextChannel.channelName, "CHANNEL_SWITCH");
        if (!newRelay) {
            logger.error(
                this.mediaType,
                "ELLA: Failed to switch to channel",
                this.nextChannel.channelName,
                "after trying all available relay servers"
            );
            this.isFailed = true;
            if (this.callbacks.onEllaFallback) {
                this.callbacks.onEllaFallback("fail_to_join");
            }
            return;
        }

        logger.pauseTrace(
            this.mediaType,
            "switched from channel: ",
            this.currentChannel?.channelName,
            this.currentChannel?.selectedStreamId,
            this.currentChannel?.streamInfo.bitrate,
            " relay server: ",
            this.currentRelayServer,
            " to channel: ",
            this.nextChannel?.channelName,
            this.nextChannel?.selectedStreamId,
            this.nextChannel?.streamInfo.bitrate,
            " relay server: ",
            newRelay
        );

        if (this.callbacks.onChannelSwitch) {
            logger.pauseTrace(this.mediaType, "ELLA: Channel switch detected", newStreamId, switchInfo, this.networkStats);
            this.callbacks.onChannelSwitch(newStreamId, switchInfo, this.networkStats);
        }

        // Notify stream change if the stream (bitrate tier) actually changed
        if (this.currentChannel?.selectedStreamId !== this.nextChannel?.selectedStreamId) {
            this.callbacks.onStreamChanged(this.nextChannel.selectedStreamId);
        }

        this.currentChannel = this.nextChannel;
        this.currentRelayServer = newRelay;
    }

    /**
     * Handle progress updates from the transport layer.
     * Updates network statistics (packet loss, queuing delay) and
     * emits per-object progress telemetry.
     *
     * @param {Object} progressEvent - Progress event with aggregated and per-object stats.
     */
    onProgressUpdate(progressEvent) {
        logger.pauseTrace(this.mediaType, "ella object progress: ", JSON.stringify(progressEvent));

        const aggregateStats = progressEvent.progressStats;

        if (aggregateStats.bytesReceived > 0) {
            const networkUpdate = {
                bytesReceived: aggregateStats.bytesReceived,
                nVb: aggregateStats.packetsSent,
                mVb: aggregateStats.packetsLost,
                JMb: aggregateStats.avgQueuingDelay ?? 0,
            };

            const timeRange = {
                nb: progressEvent.startTime,
                endTime: progressEvent.endTime,
            };

            this.ellaAlgorithms.networkTracker.updateNetworkStats(
                this.currentRelayServer ? this.getRelayServerId(this.currentRelayServer) : 0,
                this.currentChannel?.channelName ?? "",
                this.mediaType,
                timeRange,
                networkUpdate
            );

            const trackerStats = this.ellaAlgorithms.networkTracker.networkStats;
            this.networkStats = {
                packetsSent: trackerStats.packetsSent,
                packetsReceived: trackerStats.packetsReceived,
                packetLossRate: trackerStats.packetLossRate,
                queuingDelay: trackerStats.queuingDelay,
            };

            logger.pauseTrace(this.mediaType, "ELLA: Network stat updated", this.networkStats);
            this.performHealthCheck();
        }

        // Emit per-object progress telemetry
        const perObjectProgress = progressEvent.perObjectProgress;
        for (const objectIdStr in perObjectProgress) {
            const objectData = perObjectProgress[objectIdStr];
            const objectId = Number(objectIdStr);

            if (this.processedObjectIds.has(objectId)) continue;
            const eventId = this.objectIdToEventIdMap.key(objectId);
            if (!eventId) continue;

            const objStats = objectData.progressStats;
            g.laser.log({
                type: "ELLA_OBJECT_STATE_CHANGE",
                state: "IN_PROGRESS",
                playgraphId: this.playgraphId,
                id: eventId,
                packetSummary: {
                    minPacketId: objStats.minPacketId,
                    maxPacketId: objStats.maxPacketId,
                    earliestPacketTimestampMs: objStats.earliestPacketTimestampMs,
                    latestPacketTimestampMs: objStats.latestPacketTimestampMs,
                    totalPackets: objStats.totalPackets,
                    totalBytes: objStats.totalBytes,
                    outOfOrderDetected: objStats.outOfOrderDetected,
                },
            });
        }
    }

    /**
     * Run a health check on the current channel. Detects consecutive missed
     * segments and window-based failures, triggering relay failure reports
     * or channel fix attempts as needed.
     */
    performHealthCheck() {
        if (!this.currentRelayServer || !this.currentChannel || !this.ellaAlgorithms) return;

        const relayId = this.getRelayServerId(this.currentRelayServer);
        const channelKey = this.createChannelKey(this.currentChannel.channelName, relayId);
        const now = p.platform.platform.now();

        this.lastActivityTimestamp = now;
        this.channelStateTracker.updateChannelActivity(channelKey, this.mediaType, now, this.bufferTargetMs);

        const healthStats = this.channelStateTracker.getChannelHealthStats(channelKey, this.mediaType);

        // Check for consecutive missed segments
        if (healthStats && healthStats.consecutiveMissedCount > 0) {
            const shouldReport = this.ellaAlgorithms.channelHealthMonitor.checkConsecutiveMissed(
                relayId,
                this.currentChannel.channelName,
                healthStats.consecutiveMissedCount
            );
            if (shouldReport) {
                this.reportRelayFailure(
                    this.currentRelayServer,
                    this.currentChannel.channelName,
                    "consecutive_missed_timeout"
                );
            }
        }

        // Attempt to fix unhealthy channels
        if (this.isChannelUnhealthy(channelKey) && !this.isAttemptingChannelFix) {
            this.attemptChannelFix().catch((error) => {
                logger.error(this.mediaType, "ELLA: Error attempting channel fix:", error?.message || error);
            });
        }

        // Window-based health check (periodic)
        if (now - this.lastHealthCheckTimestamp >= this.healthMonitorWindowMs) {
            if (healthStats && healthStats.totalWindowFailures > 0) {
                const shouldReport = this.ellaAlgorithms.channelHealthMonitor.checkWindowMissed(
                    relayId,
                    this.currentChannel.channelName,
                    healthStats.totalWindowFailures
                );
                if (shouldReport) {
                    this.reportRelayFailure(
                        this.currentRelayServer,
                        this.currentChannel.channelName,
                        "window_missed_timeout"
                    );
                }
                if (this.callbacks.onWindowMissed) {
                    this.callbacks.onWindowMissed(healthStats.totalWindowFailures);
                }
            }
            this.channelStateTracker.resetWindowStats(channelKey, this.mediaType, now);
            this.lastHealthCheckTimestamp = now;
        }
    }

    /**
     * Start periodic health monitoring with a polling timer.
     */
    startHealthMonitoring() {
        const pollingIntervalMs = this.config.ellaChannelHealthPollingIntervalMs;
        this.healthMonitorWindowMs = this.config.ellaChannelHealthMonitoringWindowMs;
        this.lastActivityTimestamp = this.lastHealthCheckTimestamp = p.platform.platform.now();

        this.healthTimerHandle = setInterval(() => {
            if (p.platform.platform.now() - this.lastActivityTimestamp >= pollingIntervalMs) {
                this.performHealthCheck();
            }
        }, pollingIntervalMs);

        logger.pauseTrace(
            this.mediaType,
            `ELLA: Health monitoring timer started (polling=${pollingIntervalMs}ms, window=${this.healthMonitorWindowMs}ms)`
        );
    }

    /**
     * Stop the periodic health monitoring timer.
     */
    stopHealthMonitoring() {
        if (this.healthTimerHandle) {
            clearInterval(this.healthTimerHandle);
            this.healthTimerHandle = null;
        }
        this.lastHealthCheckTimestamp = this.healthMonitorWindowMs = this.lastActivityTimestamp = 0;
        logger.pauseTrace(this.mediaType, "ELLA: Health monitoring timer stopped");
    }

    /**
     * Check if a channel is unhealthy based on consecutive failures
     * or window-based failure thresholds.
     *
     * @param {Object} channelKey - Channel key for health lookup.
     * @returns {boolean} True if the channel exceeds failure thresholds.
     */
    isChannelUnhealthy(channelKey) {
        const stats = this.channelStateTracker.getChannelHealthStats(channelKey, this.mediaType);
        if (!stats) return false;

        const maxConsecutive = this.config.ellaChannelMaxConsecutiveFailures;
        const maxWindowFailures = this.config.ellaChannelMaxFailuresInWindow;

        if (stats.consecutiveMissedCount > maxConsecutive) {
            logger.log(
                this.mediaType,
                `ELLA: Channel unhealthy - consecutive missed ${stats.consecutiveMissedCount} > ${maxConsecutive}`
            );
            return true;
        }
        if (stats.totalWindowFailures > maxWindowFailures) {
            logger.log(
                this.mediaType,
                `ELLA: Channel unhealthy - window missed ${stats.totalWindowFailures} > ${maxWindowFailures}`
            );
            return true;
        }
        return false;
    }

    /**
     * Attempt to fix an unhealthy channel by disconnecting and rejoining.
     */
    async attemptChannelFix() {
        if (this.isAttemptingChannelFix) {
            logger.pauseTrace(this.mediaType, "ELLA: Already attempting channel fix, skipping");
            return;
        }
        if (!this.currentRelayServer || !this.currentChannel || !this.connection) {
            logger.pauseTrace(this.mediaType, "ELLA: No current channel to fix");
            return;
        }

        this.isAttemptingChannelFix = true;
        const channelName = this.currentChannel.channelName;
        logger.log(
            this.mediaType,
            `ELLA: Attempting to fix unhealthy channel ${channelName} on relay ${this.getRelayServerId(this.currentRelayServer)}`
        );

        try {
            const newRelay = await this.reconnectToChannel(channelName, "KEEPALIVE_TIMEOUT");
            if (newRelay) {
                this.currentRelayServer = newRelay;
                logger.log(this.mediaType, `ELLA: Successfully fixed channel ${channelName} on relay ${newRelay.id}`);
            } else {
                logger.error(this.mediaType, "ELLA: Failed to fix channel - no available relay servers");
                this.isFailed = true;
                if (this.callbacks.onEllaFallback) {
                    this.callbacks.onEllaFallback("fail_to_fix_channel");
                }
            }
        } finally {
            this.isAttemptingChannelFix = false;
        }
    }

    /**
     * Log a channel state change, flush window stats, close the current
     * connection, and emit telemetry for any abandoned in-flight objects.
     *
     * @param {string} reason - The reason for the state change.
     */
    logChannelStateChange(reason) {
        // Flush window stats and report failures for the outgoing channel
        if (this.currentRelayServer && this.currentChannel && this.ellaAlgorithms) {
            const relayId = this.getRelayServerId(this.currentRelayServer);
            const channelKey = this.createChannelKey(this.currentChannel.channelName, relayId);
            const healthStats = this.channelStateTracker.getChannelHealthStats(channelKey, this.mediaType);

            if (healthStats && healthStats.totalWindowFailures > 0) {
                this.ellaAlgorithms.channelHealthMonitor.checkWindowMissed(
                    relayId,
                    this.currentChannel.channelName,
                    healthStats.totalWindowFailures
                );
                if (this.callbacks.onWindowMissed) {
                    this.callbacks.onWindowMissed(healthStats.totalWindowFailures);
                }
            }
            this.channelStateTracker.onChannelJoinFailed(channelKey, this.mediaType);
        }

        // Close the transport connection and emit telemetry
        if (this.connection) {
            if (this.drmSessionId) {
                g.laser.log({
                    type: "ELLA_CHANNEL_STATE_CHANGE",
                    perspective: "OUTGOING",
                    state: "UNSUBSCRIBING",
                    playgraphId: this.playgraphId,
                    id: this.drmSessionId,
                    reason,
                });
            }

            this.connection.closing();

            if (this.drmSessionId) {
                g.laser.log({
                    type: "ELLA_CHANNEL_STATE_CHANGE",
                    perspective: "OUTGOING",
                    state: "UNSUBSCRIBED",
                    playgraphId: this.playgraphId,
                    id: this.drmSessionId,
                    reason: "SERVER_ACK",
                });
            }

            this.connection = null;
            this.drmSessionId = null;

            // Report abandoned objects that were in flight
            this.objectIdToEventIdMap.forEach((eventId, objectId) => {
                if (!this.processedObjectIds.has(objectId)) {
                    g.laser.log({
                        type: "ELLA_OBJECT_STATE_CHANGE",
                        state: "ABANDONED",
                        playgraphId: this.playgraphId,
                        id: eventId,
                        packetSummary: {
                            earliestPacketTimestampMs: 0,
                            latestPacketTimestampMs: 0,
                            totalPackets: 0,
                            totalBytes: 0,
                            minPacketId: 0,
                            maxPacketId: 0,
                            outOfOrderDetected: false,
                        },
                        error: {
                            code: "CONNECTION_CLOSED",
                            message: "Object abandoned due to connection close",
                        },
                    });
                }
            });

            this.objectIdToEventIdMap.clear();
            this.processedObjectIds.clear();
        }
    }

    /**
     * Disconnect from the current channel and reconnect via joinChannelWithRetry.
     *
     * @param {string} channelName - The channel to reconnect to.
     * @param {string} disconnectReason - Reason for the disconnect (for telemetry).
     * @param {string} [joinReason="CHANNEL_SWITCH"] - Reason for the rejoin.
     * @returns {Object|null} The relay server joined, or null on failure.
     */
    async reconnectToChannel(channelName, disconnectReason, joinReason = "CHANNEL_SWITCH") {
        this.logChannelStateChange(disconnectReason);
        return this.joinChannelWithRetry(channelName, joinReason);
    }

    /**
     * Start streaming by selecting the initial channel and joining a relay server.
     */
    startStreaming() {
        logger.pauseTrace(this.mediaType, "ELLA: Starting streaming");
        this.state = StreamingState.STARTING;

        if (this.relayServers === undefined || this.relayServers.length === 0) {
            logger.error(this.mediaType, "ELLA: No relay servers available. Fall back to HTTP");
            return;
        }

        this.currentChannel = this.ellaAlgorithms.channelSelector.selectChannel(this.mediaType, null, false);
        if (this.currentChannel === null) {
            logger.error(this.mediaType, "ELLA: No valid ella channel. Fall back to HTTP");
            return;
        }

        this.callbacks.onStreamChanged(this.currentChannel.selectedStreamId);
        const channelName = this.currentChannel.channelName;

        (async () => {
            try {
                const relayServer = await this.joinChannelWithRetry(channelName);
                if (relayServer) {
                    this.currentRelayServer = relayServer;
                    this.startHealthMonitoring();

                    if (this.callbacks.onChannelSwitch) {
                        const switchInfo = {
                            Hgc: this.currentChannel.channelName,
                            encodingBitrateKbps: this.currentChannel.streamInfo.bitrate,
                        };
                        logger.pauseTrace(
                            this.mediaType,
                            "ELLA: Channel switch detected",
                            this.currentChannel.selectedStreamId,
                            switchInfo,
                            this.networkStats
                        );
                        this.callbacks.onChannelSwitch(
                            this.currentChannel.selectedStreamId,
                            switchInfo,
                            this.networkStats
                        );
                    }
                } else {
                    logger.error(this.mediaType, "ELLA: Failed to join any relay server. Fallback to HTTP required.");
                    this.isFailed = true;
                    if (this.callbacks.onEllaFallback) {
                        this.callbacks.onEllaFallback("fail_to_join");
                    }
                }
            } catch (error) {
                logger.error(this.mediaType, "ELLA: Unexpected error in startStreaming", error?.message || error);
            }
        })();
    }

    /**
     * Find a relay server descriptor by its numeric ID.
     *
     * @param {number} relayId - The relay ID to search for.
     * @returns {Object|null} The matching relay server, or null if not found.
     */
    findRelayServerById(relayId) {
        for (let i = 0; i < this.relayServers.length; i++) {
            if (Number(this.relayServers[i].id) === relayId) {
                return this.relayServers[i];
            }
        }
        return null;
    }

    /**
     * Stop streaming: disconnect from the current channel and reset state.
     */
    stopStreaming() {
        logger.pauseTrace(this.mediaType, "ELLA: Stopping streaming");
        this.stopHealthMonitoring();
        this.logChannelStateChange("BEHIND_LIVE_EDGE");
        this.expectedObjectId = null;
        this.state = StreamingState.STOPPED;
    }
}

export { EllaAseClient };
