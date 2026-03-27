/**
 * Netflix Cadmium Player - ELLA ABR Channel Selector
 *
 * Adaptive bitrate channel selection using a PROBE/STAY/DRAIN state machine.
 * Detects congestion via packet loss rate and queuing delay, then selects
 * the appropriate ELLA channel (bitrate tier + relay channel) accordingly.
 */

// import { platform } from '../core/AsejsEngine.js';
// import { MediaType } from '../streaming/AseTrack.js';
// import { assert } from '../ads/AdPoliciesManager.js';

/**
 * State machine phases for channel selection.
 * @enum {number}
 */
const ChannelState = Object.freeze({
    PROBE: 0,
    STAY: 1,
    DRAIN: 2,
});

/**
 * Detected network congestion severity.
 * @enum {number}
 */
const CongestionLevel = Object.freeze({
    NO_CONGESTION: 0,
    SOME_CONGESTION: 1,
    CONGESTION: 2,
});

const logger = new d.platform.Console("ASEJS_ELLA_CHANNEL_SELECTOR", "media|asejs");

/**
 * ELLA adaptive bitrate channel selector.
 *
 * Uses a three-state machine (PROBE -> STAY -> DRAIN) driven by packet-loss
 * and queuing-delay metrics to walk up/down the available bitrate ladder.
 */
class EllaChannelSelector {
    /**
     * @param {Object} ellaStreams - Map of MediaType to stream arrays.
     * @param {Object} networkTracker - Network statistics tracker.
     * @param {Object} config - ELLA configuration parameters.
     */
    constructor(ellaStreams, networkTracker, config) {
        this.ellaStreams = ellaStreams;
        this.networkTracker = networkTracker;
        this.selectorName = "SimpleEllaChannelSelector";
        this.channelState = ChannelState.PROBE;
        this.lastCongestionTimestamp = -1;
        this.roundRobinCounter = 0;

        // Configuration
        this.bandwidthOracle = config.ellaBandwidthOracle;
        this.bandwidthOracleMargin = config.ellaBandwidthOracleMargin;
        this.audioThroughputPercent = config.ellaAudioThroughputPercentage;
        this.throughputSelectionMargin = config.ellaThroughputBasedSelectionMargin;
        this.channelSelectionMode = config.ellaChannelSelectionMode;
        this.channelSwitchRRRate = config.ellaChannelSwitchRRRate;
        this.packetLossThresholds = config.ellaPktLossRateThreshold;
        this.queuingDelayThresholds = config.ellaQueuingDelayThreshold;
        this.lockPeriodToStayMs = config.ellaLockPeriodToStayMs;
        this.lockPeriodToDrainMs = config.ellaLockPeriodToDrainMs;
        this.maxBitrateKbps = config.ellaMaxEncodingBitrateKbps;
        this.minBitrateKbps = config.ellaMinEncodingBitrateKbps;
        this.enableForceDownswitch = config.ellaEnableForceDownswitch;

        // Filter video streams by max/min bitrate bounds
        let videoStreams = this.ellaStreams[p.MediaType.U];
        videoStreams = videoStreams.filter((stream) => stream.bitrate <= this.maxBitrateKbps);
        if (videoStreams[videoStreams.length - 1].bitrate >= this.minBitrateKbps) {
            videoStreams = videoStreams.filter((stream) => stream.bitrate >= this.minBitrateKbps);
        }
        this.ellaStreams[p.MediaType.U] = videoStreams;
    }

    /**
     * The name of this channel selector implementation.
     * @returns {string}
     */
    get name() {
        return this.selectorName;
    }

    /**
     * Select the best channel for the given media type based on the current
     * selection mode, network conditions, and ABR state.
     *
     * @param {string} mediaType - The media type (video or audio).
     * @param {Object|null} currentChannel - Currently selected channel, or null for initial selection.
     * @param {boolean} forceDownswitch - Whether a forced downswitch is requested.
     * @returns {Object|null} Channel selection result with streamId, channelName, and streamInfo.
     */
    selectChannel(mediaType, currentChannel, forceDownswitch) {
        if (null === this.ellaStreams[mediaType]) {
            return null;
        }

        const streams = this.ellaStreams[mediaType];

        if (this.channelSelectionMode === "highest") {
            return this.selectHighestChannel(mediaType, streams);
        }
        if (this.channelSelectionMode === "round-robin" && mediaType === p.MediaType.U) {
            return this.selectRoundRobinChannel(currentChannel, streams);
        }
        if (currentChannel === null) {
            return this.selectInitialChannel(mediaType, streams);
        }
        if (mediaType === p.MediaType.V) {
            return currentChannel;
        }
        if (mediaType === p.MediaType.U) {
            return this.selectBandwidthBasedChannel(
                mediaType,
                streams,
                currentChannel,
                this.enableForceDownswitch && forceDownswitch
            );
        }
        return null;
    }

    /**
     * Select the initial channel whose bitrate fits within the available bandwidth.
     *
     * @param {string} mediaType - The media type.
     * @param {Array} streams - Available streams sorted by bitrate.
     * @returns {Object} Channel selection result.
     */
    selectInitialChannel(mediaType, streams) {
        const availableBandwidth = this.getAvailableBandwidth(mediaType);
        const eligibleStreams = streams.filter((stream) => stream.bitrate < availableBandwidth);
        const selectedStream = eligibleStreams.length === 0 ? streams[0] : eligibleStreams[eligibleStreams.length - 1];

        const result = {
            Oa: selectedStream.selectedStreamId,
            channelName: selectedStream.channels[0].channelName,
            streamInfo: selectedStream,
        };

        logger.pauseTrace(
            `ELLA Channel selected for ${mediaType}: ${result.channelName} (${selectedStream.bitrate}kbps)`
        );
        return result;
    }

    /**
     * Always select the highest-bitrate channel available.
     *
     * @param {string} mediaType - The media type.
     * @param {Array} streams - Available streams sorted by bitrate.
     * @returns {Object} Channel selection result.
     */
    selectHighestChannel(mediaType, streams) {
        const topStream = streams[streams.length - 1];
        const result = {
            Oa: topStream.selectedStreamId,
            channelName: topStream.channels[0].channelName,
            streamInfo: topStream,
        };

        if (mediaType === p.MediaType.U) {
            logger.pauseTrace(
                `ELLA Channel selection result for ${mediaType}: ${result.channelName} (${result.streamInfo.bitrate}kbps)`
            );
        }
        return result;
    }

    /**
     * Select channels in round-robin order across streams and their sub-channels.
     *
     * @param {Object|null} currentChannel - Current selection, or null for first pick.
     * @param {Array} streams - Available streams.
     * @returns {Object} Channel selection result.
     */
    selectRoundRobinChannel(currentChannel, streams) {
        if (currentChannel === null) {
            this.roundRobinCounter = 0;
            const result = {
                Oa: streams[0].selectedStreamId,
                channelName: streams[0].channels[0].channelName,
                streamInfo: streams[0],
            };
            logger.pauseTrace(
                `ELLA Round-robin initial selection: ${result.channelName} (${result.streamInfo.bitrate}kbps)`
            );
            return result;
        }

        this.roundRobinCounter++;
        if (this.roundRobinCounter < this.channelSwitchRRRate) {
            return currentChannel;
        }

        this.roundRobinCounter = 0;
        const nextChannel = this.getNextRoundRobinChannel(currentChannel, streams);
        logger.pauseTrace(
            `ELLA Round-robin switching to: ${nextChannel.channelName} (${nextChannel.streamInfo.bitrate}kbps)`
        );
        return nextChannel;
    }

    /**
     * Advance to the next channel in round-robin sequence.
     *
     * @param {Object} currentChannel - Current channel selection.
     * @param {Array} streams - Available streams.
     * @returns {Object} Next channel selection.
     */
    getNextRoundRobinChannel(currentChannel, streams) {
        const position = this.findCurrentChannelPosition(currentChannel, streams);
        const streamIndex = position.streamIndex;
        const channelIndex = position.channelIndex;
        const currentStream = streams[streamIndex];

        // Try next sub-channel within the same stream
        if (channelIndex < currentStream.channels.length - 1) {
            return {
                Oa: currentStream.selectedStreamId,
                channelName: currentStream.channels[channelIndex + 1].channelName,
                streamInfo: currentStream,
            };
        }

        // Wrap to the next stream (or back to first)
        const nextStream = streams[streamIndex < streams.length - 1 ? streamIndex + 1 : 0];
        return {
            Oa: nextStream.selectedStreamId,
            channelName: nextStream.channels[0].channelName,
            streamInfo: nextStream,
        };
    }

    /**
     * Locate the stream index and sub-channel index of the current selection.
     *
     * @param {Object} currentChannel - Current channel selection.
     * @param {Array} streams - Available streams.
     * @returns {{ streamIndex: number, channelIndex: number }}
     */
    findCurrentChannelPosition(currentChannel, streams) {
        const streamIndex = this.findStreamIndex(streams, currentChannel.selectedStreamId);
        const channelIndex = this.findChannelIndex(streams[streamIndex].channels, currentChannel.channelName);
        return { streamIndex, channelIndex };
    }

    /**
     * Update the PROBE/STAY/DRAIN state machine based on current congestion.
     *
     * @param {boolean} isAtTopStream - Whether the current stream is the highest available.
     * @param {boolean} forceDownswitch - Whether to force a drain (downswitch).
     */
    updateChannelSelectionState(isAtTopStream, forceDownswitch) {
        const congestion = this.detectCongestionLevel();

        switch (this.channelState) {
            case ChannelState.PROBE:
                this.handleProbeState(congestion, isAtTopStream);
                break;
            case ChannelState.DRAIN:
                this.handleDrainState(congestion);
                break;
            case ChannelState.STAY:
                this.handleStayState(congestion, isAtTopStream);
                break;
            default:
                logger.error("Unsupported channel selection state: ", this.channelState);
        }

        if (forceDownswitch) {
            this.channelState = ChannelState.DRAIN;
        }

        logger.pauseTrace("updateChannelSelectionState: ", this.channelState);
    }

    /**
     * Detect the current network congestion level from packet loss and queuing delay.
     *
     * @returns {number} One of CongestionLevel values.
     */
    detectCongestionLevel() {
        const stats = this.networkTracker.networkStats;
        const packetLossRate = stats.packetLossRate;
        const queuingDelay = stats.queuingDelay;
        let congestion;

        switch (this.channelSelectionMode) {
            case "loss-only":
                congestion = this.detectLossOnlyCongestion(packetLossRate);
                break;
            case "loss-queuing-delay":
                congestion = this.detectLossAndDelayCongestion(packetLossRate, queuingDelay);
                break;
            case "highest":
                return CongestionLevel.NO_CONGESTION;
            default:
                logger.error(
                    "Unsupported channel selection mode: ",
                    this.channelSelectionMode,
                    "falling back to LOSS_QUEUING_DELAY"
                );
                congestion = this.detectLossAndDelayCongestion(packetLossRate, queuingDelay);
        }

        logger.pauseTrace("network congestion level: ", congestion, packetLossRate, queuingDelay);
        return congestion;
    }

    /**
     * Detect congestion using both packet loss rate and queuing delay.
     *
     * @param {number} packetLossRate - Current packet loss rate.
     * @param {number} queuingDelay - Current queuing delay.
     * @returns {number} CongestionLevel value.
     */
    detectLossAndDelayCongestion(packetLossRate, queuingDelay) {
        if (packetLossRate < this.packetLossThresholds[0] && queuingDelay < this.queuingDelayThresholds[0]) {
            if (this.lastCongestionTimestamp === -1) {
                this.lastCongestionTimestamp = d.platform.platform.now();
            }
            return CongestionLevel.NO_CONGESTION;
        }

        this.lastCongestionTimestamp = -1;
        if (packetLossRate > this.packetLossThresholds[1] || queuingDelay > this.queuingDelayThresholds[1]) {
            return CongestionLevel.CONGESTION;
        }
        return CongestionLevel.SOME_CONGESTION;
    }

    /**
     * Detect congestion using packet loss rate only.
     *
     * @param {number} packetLossRate - Current packet loss rate.
     * @returns {number} CongestionLevel value.
     */
    detectLossOnlyCongestion(packetLossRate) {
        if (packetLossRate < this.packetLossThresholds[0]) {
            if (this.lastCongestionTimestamp === -1) {
                this.lastCongestionTimestamp = d.platform.platform.now();
            }
            return CongestionLevel.NO_CONGESTION;
        }

        this.lastCongestionTimestamp = -1;
        if (packetLossRate > this.packetLossThresholds[1]) {
            return CongestionLevel.CONGESTION;
        }
        return CongestionLevel.SOME_CONGESTION;
    }

    /**
     * Handle DRAIN state transitions.
     * Moves to STAY once congestion clears and the lock period has elapsed.
     *
     * @param {number} congestion - Current congestion level.
     */
    handleDrainState(congestion) {
        const now = d.platform.platform.now();
        this.channelState =
            congestion === CongestionLevel.NO_CONGESTION &&
            now > this.lastCongestionTimestamp + this.lockPeriodToDrainMs
                ? ChannelState.STAY
                : ChannelState.DRAIN;
    }

    /**
     * Handle PROBE state transitions.
     * Moves to STAY on mild congestion, DRAIN on heavy congestion,
     * or stays in PROBE if no congestion and not at top stream.
     *
     * @param {number} congestion - Current congestion level.
     * @param {boolean} isAtTopStream - Whether the current stream is the highest available.
     */
    handleProbeState(congestion, isAtTopStream) {
        if (congestion === CongestionLevel.SOME_CONGESTION) {
            this.channelState = ChannelState.STAY;
        } else if (congestion === CongestionLevel.NO_CONGESTION) {
            this.channelState = isAtTopStream ? ChannelState.STAY : ChannelState.PROBE;
        } else {
            this.channelState = ChannelState.DRAIN;
        }
    }

    /**
     * Handle STAY state transitions.
     * Moves to PROBE once the lock period elapses with no congestion,
     * or to DRAIN on heavy congestion.
     *
     * @param {number} congestion - Current congestion level.
     * @param {boolean} isAtTopStream - Whether the current stream is the highest available.
     */
    handleStayState(congestion, isAtTopStream) {
        const now = d.platform.platform.now();
        if (
            congestion === CongestionLevel.NO_CONGESTION &&
            !isAtTopStream &&
            now > this.lastCongestionTimestamp + this.lockPeriodToStayMs
        ) {
            this.channelState = ChannelState.PROBE;
        } else if (congestion === CongestionLevel.CONGESTION) {
            this.channelState = ChannelState.DRAIN;
        } else {
            this.channelState = ChannelState.STAY;
        }
    }

    /**
     * Select channel based on bandwidth estimation and the state machine.
     * This is the main ABR path for video streams.
     *
     * @param {string} mediaType - The media type (must be video).
     * @param {Array} streams - Available streams sorted by bitrate.
     * @param {Object} currentChannel - Currently selected channel.
     * @param {boolean} forceDownswitch - Whether to force a bitrate reduction.
     * @returns {Object} Channel selection result.
     */
    selectBandwidthBasedChannel(mediaType, streams, currentChannel, forceDownswitch) {
        (0, c.assert)(mediaType === p.MediaType.U);

        let result = currentChannel;
        let streamIndex = this.findStreamIndex(streams, currentChannel.selectedStreamId);
        const currentStreamInfo = currentChannel.streamInfo;

        // Force downswitch if bandwidth oracle indicates the current bitrate is too high
        if (this.bandwidthOracle !== -1 && currentStreamInfo.bitrate > this.bandwidthOracle) {
            forceDownswitch = true;
        }

        const isAtTop = this.isTopEllaStream(streams, streamIndex);
        const channelIndex = this.findChannelIndex(currentStreamInfo.channels, currentChannel.channelName);

        this.updateChannelSelectionState(isAtTop, forceDownswitch);

        switch (this.channelState) {
            case ChannelState.STAY:
                result = {
                    Oa: streams[streamIndex].selectedStreamId,
                    channelName: streams[streamIndex].channels[0].channelName,
                    streamInfo: streams[streamIndex],
                };
                break;

            case ChannelState.DRAIN: {
                // Step down one stream level
                if (streamIndex > 0) {
                    streamIndex--;
                }
                // Also consider what initial selection would pick (bandwidth-based floor)
                const initialSelection = this.selectInitialChannel(mediaType, streams);
                const initialIndex = this.findStreamIndex(streams, initialSelection.selectedStreamId);
                streamIndex = Math.min(streamIndex, initialIndex);
                if (forceDownswitch) {
                    streamIndex = 0;
                }
                result = {
                    Oa: streams[streamIndex].selectedStreamId,
                    channelName: streams[streamIndex].channels[0].channelName,
                    streamInfo: streams[streamIndex],
                };
                break;
            }

            case ChannelState.PROBE:
                // Try next sub-channel, or next stream tier
                if (channelIndex < currentStreamInfo.channels.length - 1) {
                    result = {
                        Oa: currentChannel.selectedStreamId,
                        channelName: currentStreamInfo.channels[channelIndex + 1].channelName,
                        streamInfo: currentStreamInfo,
                    };
                } else {
                    (0, c.assert)(!isAtTop);
                    result = {
                        Oa: streams[streamIndex + 1].selectedStreamId,
                        channelName: streams[streamIndex + 1].channels[0].channelName,
                        streamInfo: streams[streamIndex + 1],
                    };
                }
                break;

            default:
                logger.error("Invalid channel selection state: ", this.channelState);
        }

        logger.pauseTrace(
            `ELLA Channel selection result for ${mediaType}: ${result.channelName} (${result.streamInfo.bitrate}kbps)`
        );
        return result;
    }

    /**
     * Compute the available bandwidth for a given media type,
     * split between audio and video according to the configured ratio.
     *
     * @param {string} mediaType - The media type.
     * @returns {number} Available bandwidth in kbps after applying margins.
     */
    getAvailableBandwidth(mediaType) {
        let totalBandwidth =
            this.bandwidthOracle === -1
                ? this.networkTracker.getAvailableBandwidth()
                : this.bandwidthOracle;

        const share =
            mediaType === p.MediaType.V
                ? this.audioThroughputPercent / 100
                : (100 - this.audioThroughputPercent) / 100;

        return totalBandwidth * share * (1 - this.throughputSelectionMargin);
    }

    /**
     * Find the index of a stream by its selectedStreamId.
     *
     * @param {Array} streams - Array of stream objects.
     * @param {string} streamId - The stream ID to find.
     * @returns {number} Index of the matching stream.
     */
    findStreamIndex(streams, streamId) {
        let index = 0;
        for (; index < streams.length && streams[index].selectedStreamId !== streamId; index++);
        (0, c.assert)(index < streams.length);
        return index;
    }

    /**
     * Find the index of a channel by its channelName.
     *
     * @param {Array} channels - Array of channel objects.
     * @param {string} channelName - The channel name to find.
     * @returns {number} Index of the matching channel.
     */
    findChannelIndex(channels, channelName) {
        let index = 0;
        for (; index < channels.length && channels[index].channelName !== channelName; index++);
        (0, c.assert)(index < channels.length);
        return index;
    }

    /**
     * Determine whether the stream at the given index is effectively the top
     * (highest usable) ELLA stream, considering the bandwidth oracle cap.
     *
     * @param {Array} streams - Available streams sorted by bitrate.
     * @param {number} streamIndex - Index of the current stream.
     * @returns {boolean} True if this is the top usable stream.
     */
    isTopEllaStream(streams, streamIndex) {
        if (streamIndex === streams.length - 1) {
            return true;
        }

        const nextStream = streams[streamIndex + 1];
        const dutyCycle = nextStream.channels[0].dutyCycle;
        logger.pauseTrace(
            "isTopEllaStream: ",
            dutyCycle,
            nextStream.bitrate,
            this.bandwidthOracle,
            this.bandwidthOracleMargin
        );

        if (
            this.bandwidthOracle !== -1 &&
            dutyCycle !== undefined &&
            nextStream.bitrate / dutyCycle > this.bandwidthOracle * (1 - this.bandwidthOracleMargin)
        ) {
            return true;
        }
        return false;
    }
}

export { EllaChannelSelector };
