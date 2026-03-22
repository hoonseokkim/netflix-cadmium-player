/**
 * Netflix Cadmium Player - ELLA Manager
 *
 * Orchestrates the ELLA (Enhanced Low-Latency Algorithm) streaming lifecycle.
 * Manages the ASE client, coordinates segment reception with the request manager,
 * handles HTTP/ELLA mixing proximity checks, and collects streaming telemetry.
 */

// import { platform } from './modules/Module_66164.js';
// import { findLast, assert } from './modules/Module_91176.js';
// import { laser, mediaTypeToString } from './classes/DISABLED.js';
// import { EllaAseClient } from './ella/EllaAseClient.js';
// import { EllaSegmentSerializer } from './modules/Module_37468.js';

const logger = new d.platform.Console("ASEJS_ELLA_MANAGER", "media|asejs");

/**
 * ELLA fragment/segment manager.
 *
 * Acts as the bridge between the ASE client (transport layer) and the
 * player's request manager. Receives streaming objects, maps them to
 * downloadable segments, and feeds them into the playback pipeline.
 * Also handles HTTP/ELLA mixing when the player is near/far from the
 * live edge.
 */
class EllaManager {
    /**
     * @param {Object} config - Player configuration.
     * @param {Object} mediaEngine - Media engine with live session info.
     * @param {Object} track - Track metadata and downloadables.
     * @param {Object} requestEventEmitter - Emits request lifecycle events.
     * @param {Object} ellaAlgorithms - ELLA algorithm suite.
     * @param {Array} relayServers - Available relay server descriptors.
     * @param {Object} proximityChecker - HTTP/ELLA proximity logic.
     * @param {*} securityKey - Security key material.
     * @param {*} securityToken - Security token.
     */
    constructor(config, mediaEngine, track, requestEventEmitter, ellaAlgorithms, relayServers, proximityChecker, securityKey, securityToken) {
        this.config = config;
        this.mediaEngine = mediaEngine;
        this.track = track;
        this.ellaAlgorithms = ellaAlgorithms;
        this.proximityChecker = proximityChecker;

        this.lastSegment = null;
        this.running = true;
        this.liveEdgeOverride = undefined;
        this.lastLiveEdgeUpdateTimestamp = 0;
        this.isEllaActive = false;

        /** @type {Object} Interval statistics for telemetry */
        this.intervalStats = {
            activeTimeMs: 0,
            segmentsReceived: 0,
            segmentsMissed: 0,
            duplicateSegments: 0,
            totalPacketsSent: 0,
            totalPacketsReceived: 0,
            totalQueuingDelay: 0,
            queuingDelaySampleCount: 0,
            streamDurations: new Map(),
        };

        this.activeStartTimestamp = undefined;

        const playgraphId = this.mediaEngine.isLive.playgraphId ?? -1;
        this.aseClient = new f.ocb(
            config, track, this, this, ellaAlgorithms, relayServers,
            playgraphId, securityKey, securityToken
        );

        this.requestEventEmitter = requestEventEmitter;
        this.running = true;

        if (this.config.liveIsEllaHttpMixingEnabled) {
            this.startProximityChecking();
        } else {
            this.startEllaStreaming();
        }

        logger.pauseTrace("EllaFragmentManager constructor: ", this.config.liveIsEllaEnabled);
    }

    /**
     * The current live edge time, with timeout-based invalidation.
     * Falls back to the viewable session's live edge when no override is set.
     * @type {number|undefined}
     */
    get liveEdgeTime() {
        const elapsed = d.platform.platform.now() - this.lastLiveEdgeUpdateTimestamp;
        if (elapsed > this.track.trackInfo.playbackSegment * this.config.liveEllaTimeoutMultiplier) {
            this.downloadBitrate = undefined;
        }
        if (this.liveEdgeOverride !== undefined) {
            return this.liveEdgeOverride;
        }
        try {
            return this.track.viewableSession.getLiveEdgeTime(true) - this.config.liveEllaEdgeCushion;
        } catch (error) {
            // Swallow - viewable session may not be ready
        }
    }

    set liveEdgeTime(value) {
        this.liveEdgeOverride = value;
        this.lastLiveEdgeUpdateTimestamp = d.platform.platform.now();
    }

    /**
     * Whether ELLA streaming is currently active.
     * @type {boolean}
     */
    get isStreaming() {
        return this.isEllaActive;
    }

    /**
     * Start the periodic proximity check timer for HTTP/ELLA mixing.
     */
    startProximityChecking() {
        if (this.proximityCheckTimer) return;
        this.proximityCheckTimer = setInterval(() => {
            this.checkProximityAndSwitch();
        }, this.config.liveEllaProximityCheckIntervalMs);
    }

    /**
     * Stop the proximity check timer.
     */
    stopProximityChecking() {
        if (this.proximityCheckTimer) {
            clearInterval(this.proximityCheckTimer);
            this.proximityCheckTimer = undefined;
        }
    }

    /**
     * Check whether the player should switch between HTTP and ELLA streaming
     * based on proximity to the live edge.
     */
    checkProximityAndSwitch() {
        if (!this.config.liveIsEllaHttpMixingEnabled) return;

        const playerState = {
            up: this.mediaEngine.fl,
            gm: this.downloadBitrate,
        };

        if (this.isEllaActive) {
            // Check if we should switch away from ELLA back to HTTP
            if (this.proximityChecker.QYc(playerState).ng) {
                this.stopEllaStreaming();
            }
        } else {
            // Check if we should switch from HTTP to ELLA
            if (this.proximityChecker.OYc(playerState).ng) {
                this.startEllaStreaming();
            }
        }
    }

    /**
     * Start ELLA streaming via the ASE client.
     */
    startEllaStreaming() {
        if (this.isEllaActive || this.aseClient.isFailed) return;
        try {
            this.aseClient.startStreaming();
            this.isEllaActive = true;
            this.recordActiveStart();
        } catch (error) {
            logger.error("Failed to start ELLA streaming", error);
            throw error;
        }
    }

    /**
     * Stop ELLA streaming and record elapsed active time.
     */
    stopEllaStreaming() {
        if (!this.isEllaActive) return;
        try {
            this.aseClient.stopStreaming();
        } catch (error) {
            logger.error("Failed to stop ELLA streaming", error);
        }
        this.isEllaActive = false;
        this.recordActiveEnd();
        this.downloadBitrate = undefined;
    }

    /**
     * Shut down the manager and clean up timers.
     */
    closing() {
        if (this.isEllaActive) {
            this.aseClient.stopStreaming();
            this.recordActiveEnd();
        }
        this.downloadBitrate = undefined;
    }

    /**
     * Handle a received ELLA object: deserialize it into a segment,
     * validate it, and feed it to the request manager pipeline.
     *
     * @param {Object} ellaObject - The received ELLA streaming object.
     * @param {string} channelName - Name of the channel the object arrived on.
     * @param {Object} networkStats - Current network statistics.
     */
    onObjectReceived(ellaObject, channelName, networkStats) {
        if (!this.running) return;

        this.lastSegment = this.deserializeObject(ellaObject, channelName);
        if (!this.lastSegment) return;

        const packetSummary = ellaObject.aOc;

        g.laser.log({
            type: "ELLA_OBJECT_STATE_CHANGE",
            state: "RECEIVED",
            playgraphId: this.mediaEngine.isLive.playgraphId ?? 0,
            id: this.aseClient.createObjectEventId(ellaObject.metadata.objectId),
            packetSummary: {
                earliestPacketTimestampMs: packetSummary?.earliestPacketTimestampMs ?? 0,
                latestPacketTimestampMs: packetSummary?.latestPacketTimestampMs ?? 0,
                totalPackets: packetSummary?.totalPackets ?? 0,
                totalBytes: packetSummary?.totalBytes ?? ellaObject.data.length,
                minPacketId: packetSummary?.minPacketId ?? 0,
                maxPacketId: packetSummary?.maxPacketId ?? 0,
                outOfOrderDetected: packetSummary?.outOfOrderDetected ?? false,
            },
        });

        this.downloadBitrate = this.lastSegment.segmentEndTime.playbackSegment;
        this.updateIntervalStats(this.lastSegment, networkStats);

        // Ask the coordinator whether this segment should be accepted
        const coordinatorResult = this.proximityChecker.tYc(this.lastSegment, {
            up: this.mediaEngine.fl,
            gm: this.downloadBitrate,
        });

        if (coordinatorResult.ng) {
            // Segment accepted - push into the request pipeline
            this.requestEventEmitter.by(this.lastSegment);
            this.requestEventEmitter.onDataReceived(this.lastSegment, ellaObject.data.length);
            this.requestEventEmitter.onRequestComplete(this.lastSegment, 0);
            this.mediaEngine.recordMissingSegment(this.lastSegment);
            this.mediaEngine.replaceMissingSegment(
                this.lastSegment.segmentEndTime.playbackSegment,
                this.lastSegment.index + 1
            );

            g.laser.log({
                type: "ELLA_SEGMENT_RECEIVED",
                state: "RECEIVED",
                mediaType: (0, g.mediaTypeToString)(this.mediaEngine.mediaType),
                bitrateKbps: this.lastSegment.bitrate,
                segmentSizeBytes: this.lastSegment.la,
                playgraphId: this.mediaEngine.isLive.playgraphId ?? 0,
                segmentId: ellaObject.metadata.objectId,
            });

            logger.pauseTrace("ELLA fragment added to request manager", this.lastSegment);
        } else {
            // Segment rejected by the coordinator
            g.laser.log({
                type: "ELLA_SEGMENT_RECEIVED",
                state: "DROPPED",
                mediaType: (0, g.mediaTypeToString)(this.mediaEngine.mediaType),
                bitrateKbps: this.lastSegment.bitrate,
                segmentSizeBytes: this.lastSegment.la,
                playgraphId: this.mediaEngine.isLive.playgraphId ?? 0,
                segmentId: ellaObject.metadata.objectId,
                error: {
                    code: "COORDINATOR_REJECTED",
                    message: coordinatorResult.reason,
                },
            });
        }
    }

    /**
     * Handle a stream (bitrate tier) change from the ASE client.
     *
     * @param {string} streamId - The new stream's selectedStreamId.
     */
    onStreamChanged(streamId) {
        if (!this.running) return;

        const matchingDownloadable = (0, p.findLast)(this.track.downloadables, (dl) => {
            return dl.selectedStreamId === streamId;
        });

        if (matchingDownloadable) {
            logger.pauseTrace("EllaFragmentManager: found stream matching streamId", streamId);
            this.mediaEngine.bLc(
                matchingDownloadable,
                this.lastSegment?.previousState.playbackSegment,
                this.lastSegment?.segmentEndTime.playbackSegment
            );
        } else {
            logger.pauseTrace("EllaFragmentManager: no stream found matching streamId", streamId);
        }
    }

    /**
     * Cancel all ELLA streaming and clean up.
     */
    cancelStreaming() {
        this.running = false;
        this.stopProximityChecking();
        this.aseClient.stopStreaming();
        this.recordActiveEnd();
    }

    /**
     * Deserialize a received ELLA object into a player segment record.
     *
     * @param {Object} ellaObject - The received ELLA object.
     * @param {string} channelName - The channel name for stream matching.
     * @returns {Object|null} Serialized segment record, or null on failure.
     */
    deserializeObject(ellaObject, channelName) {
        (0, p.assert)(ellaObject.complete === true, "received an incomplete object from ella");

        if (!this.mediaEngine.isLive) return null;

        let viewableSession;
        try {
            viewableSession = this.mediaEngine.isLive.viewableSession;
        } catch (error) {
            return null;
        }

        const objectId = ellaObject.metadata.objectId;
        logger.pauseTrace("ella object: ", JSON.stringify(ellaObject.metadata), channelName);

        // Find the downloadable stream matching this channel name
        const matchingStream = this.findStreamByChannelName(this.track.downloadables, channelName);

        if (!matchingStream) {
            logger.error("ELLA object received but no stream found matching channel name", {
                kr: ellaObject.metadata.objectId,
                channelName,
                downloadables: this.track.downloadables,
            });
            return null;
        }

        const segmentInfo = this.mediaEngine.createSegmentFragment(matchingStream, objectId);
        const {
            byteRangeHint,
            presentationStartTime,
            segmentEndTime,
            TH,
            UL,
            xn,
            stateInfo,
            ase_location_history,
            sv,
        } = segmentInfo;

        // Check buffer size limits
        if (viewableSession.bufferSizeLimiter && !viewableSession.bufferSizeLimiter.kpa(this.mediaEngine.mediaType, 0)) {
            return null;
        }

        const serialized = e.scb.serializeRecord(
            matchingStream,
            ellaObject,
            this.mediaEngine.isLive.currentSegment,
            {
                ji: byteRangeHint,
                index: byteRangeHint,
                contentStartTicks: presentationStartTime.$,
                contentEndTicks: segmentEndTime.$,
                TH,
                UL,
                O: matchingStream.timescaleValue,
                offset: 0,
                la: 0,
                xn,
                stateInfo,
                sv,
                ase_location_history,
            },
            true
        );

        matchingStream.IC(this.mediaEngine.isLive.currentSegment);
        return serialized;
    }

    /**
     * Find a downloadable stream that matches a given channel name.
     * Falls back to extracting a stream ID from a URL-style channel name.
     *
     * @param {Array} downloadables - Available downloadable streams.
     * @param {string} channelName - The channel name to match.
     * @returns {Object|undefined} Matching downloadable stream.
     */
    findStreamByChannelName(downloadables, channelName) {
        // First try matching via ellaChannels metadata
        let match = (0, p.findLast)(downloadables, (dl) => {
            return dl.segmentVmafData.ellaChannels?.some((ch) => ch.channelName === channelName) ?? false;
        });
        if (match) return match;

        // Fallback: extract stream ID from URL-style channel name
        if (channelName.indexOf("/") !== -1) {
            const parts = channelName.split("/");
            const streamId = parts[parts.length - 1]?.split("?")[0];
            if (streamId) {
                match = (0, p.findLast)(downloadables, (dl) => dl.selectedStreamId === streamId);
            }
        }
        return match;
    }

    /**
     * Record the timestamp when ELLA streaming became active.
     */
    recordActiveStart() {
        this.activeStartTimestamp = d.platform.platform.now();
    }

    /**
     * Record elapsed active time when ELLA streaming stops.
     */
    recordActiveEnd() {
        if (this.activeStartTimestamp !== undefined) {
            const elapsed = d.platform.platform.now() - this.activeStartTimestamp;
            this.intervalStats.activeTimeMs += elapsed;
            this.activeStartTimestamp = undefined;
        }
    }

    /**
     * Update interval telemetry stats with data from a received segment.
     *
     * @param {Object} segment - The received segment record.
     * @param {Object} networkStats - Network statistics for this reception.
     */
    updateIntervalStats(segment, networkStats) {
        this.intervalStats.segmentsReceived++;
        this.intervalStats.totalPacketsSent += networkStats.packetsSent;
        this.intervalStats.totalPacketsReceived += networkStats.packetsReceived;
        this.intervalStats.totalQueuingDelay += networkStats.queuingDelay;
        this.intervalStats.queuingDelaySampleCount++;

        const segmentDuration =
            segment.segmentEndTime.playbackSegment - segment.presentationStartTime.playbackSegment;

        const stream = segment.stream;
        if (stream) {
            const streamKey = `${stream.selectedStreamId}_${stream.bitrate}`;
            let entry = this.intervalStats.streamDurations.key(streamKey);
            if (!entry) {
                entry = {
                    Oa: stream.selectedStreamId,
                    bitrate: stream.bitrate,
                    duration: 0,
                };
                this.intervalStats.streamDurations.set(streamKey, entry);
            }
            entry.duration += segmentDuration;
        }
    }

    /**
     * Record missed segments in the interval window.
     *
     * @param {number} count - Number of segments missed.
     */
    onWindowMissed(count) {
        this.intervalStats.segmentsMissed += count;
    }

    /**
     * Record duplicate segments in the interval window.
     *
     * @param {number} count - Number of duplicate segments detected.
     */
    onDuplicateSegment(count) {
        this.intervalStats.duplicateSegments += count;
    }

    /**
     * Handle a channel switch event from the ASE client.
     */
    onChannelSwitch() {
        if (this.running) {
            this.ellaAlgorithms?.networkTracker.getAvailableBandwidth();
        }
    }

    /**
     * Handle a relay server switch event.
     *
     * @param {number} relayId - New relay server ID.
     * @param {string} channelName - Channel name on the new relay.
     * @param {string} reason - Reason for the switch.
     */
    onRelaySwitch(relayId, channelName, reason) {
        if (!this.running) return;
        const currentPlaybackSegment = this.lastSegment?.segmentEndTime.playbackSegment;
        this.mediaEngine.H0a(relayId, channelName, currentPlaybackSegment, reason);
    }

    /**
     * Handle a relay server failure event.
     *
     * @param {number} relayId - Failed relay server ID.
     * @param {string} channelName - Channel on the failed relay.
     * @param {string} reason - Failure reason.
     */
    onRelayFailure(relayId, channelName, reason) {
        if (!this.running) return;
        const currentPlaybackSegment = this.lastSegment?.segmentEndTime.playbackSegment;
        this.mediaEngine.reportRelayFailure(relayId, channelName, currentPlaybackSegment, reason);
    }

    /**
     * Handle a complete ELLA fallback (all relays failed).
     * Stops ELLA streaming and falls back to HTTP.
     *
     * @param {string} reason - Fallback reason.
     */
    onEllaFallback(reason) {
        if (!this.running) return;
        logger.error(
            this.mediaEngine.mediaType,
            "ELLA: All relay servers have failed. Client is in failed state. Fallback to HTTP required."
        );
        this.stopEllaStreaming();
        this.mediaEngine.G0a(reason);
    }

    /**
     * Handle the ELLA streaming started event.
     *
     * @param {number} status - Status code.
     * @param {number} relayId - Relay server ID.
     * @param {string} channelName - Channel name.
     * @param {Object} networkStats - Initial network stats.
     */
    onEllaStarted(status, relayId, channelName, networkStats) {
        if (this.running) {
            this.mediaEngine.I0a(status, relayId, channelName, networkStats);
        }
    }

    /**
     * Collect and return the accumulated interval telemetry stats.
     *
     * @returns {Object} Interval statistics snapshot.
     */
    getIntervalStats() {
        return {
            kq: this.intervalStats.activeTimeMs + (this.activeStartTimestamp ? d.platform.platform.now() - this.activeStartTimestamp : 0),
            rx: this.intervalStats.segmentsReceived,
            GC: this.intervalStats.segmentsMissed,
            fia: this.intervalStats.duplicateSegments,
            hia: this.intervalStats.totalPacketsSent,
            gia: this.intervalStats.totalPacketsReceived,
            internal_Jdc: this.intervalStats.queuingDelaySampleCount > 0
                ? this.intervalStats.totalQueuingDelay / this.intervalStats.queuingDelaySampleCount
                : 0,
            l$: Array.from(this.intervalStats.streamDurations.values()),
        };
    }

    /**
     * Get the underlying ASE client instance.
     *
     * @returns {EllaAseClient} The ASE client.
     */
    getAseClient() {
        return this.aseClient;
    }
}

export { EllaManager };
