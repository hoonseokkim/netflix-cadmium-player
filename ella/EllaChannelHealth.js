/**
 * Netflix Cadmium Player - ELLA Channel Health Monitor
 *
 * Tracks per-channel health by monitoring received vs. expected segments,
 * detecting gaps (consecutive missed packets), and accumulating window-based
 * failure statistics used by the ABR and relay-failover logic.
 */

// import { platform } from '../core/AsejsEngine.js';
// import { XW as ChannelSubscriptionState } from './modules/Module_51330.js';

const logger = new c.platform.Console("ASEJS_ELLA_CHANNEL_HEALTH", "media|asejs");

/**
 * Build a composite key for a channel on a specific relay, scoped to a media type.
 *
 * @param {Object} channelKey - Object with relayId and channelName.
 * @param {string} mediaType - The media type identifier.
 * @returns {string} Composite key string.
 */
function buildChannelKey(channelKey, mediaType) {
    return `${mediaType}:${channelKey.relayId}:${channelKey.channelName}`;
}

/**
 * Create a fresh set of health counters for a channel.
 *
 * @returns {Object} Initial health record.
 */
function createDefaultHealthRecord() {
    return {
        eventBasedStats: {
            totalMissed: 0,
            totalReceived: 0,
            totalWindowFailures: 0,
            windowReceived: 0,
            consecutiveMissedCount: 0,
        },
        timeBasedStats: {
            totalMissed: 0,
            totalReceived: 0,
            totalWindowFailures: 0,
            windowReceived: 0,
            consecutiveMissedCount: 0,
        },
        lastSegmentId: null,
        lastReceivedTimestamp: null,
        state: g.XW.UNSUBSCRIBED,
    };
}

/**
 * Monitors the health of individual ELLA channels by tracking segment
 * reception, detecting gaps, and computing window-based failure metrics.
 */
class EllaChannelHealthMonitor {
    constructor() {
        /** @type {Map<string, Object>} Channel key -> health record */
        this.channelHealthMap = new Map();

        /** @type {Map<string, Object>} Channel key -> timing info (subscribeTime, windowStartTime) */
        this.channelTimingMap = new Map();

        logger.pauseTrace("EllaChannelHealthMonitor created");
    }

    /**
     * Record that we are attempting to subscribe to a channel.
     *
     * @param {Object} channelKey - Channel identification { channelName, relayId }.
     * @param {string} mediaType - The media type.
     */
    onChannelJoining(channelKey, mediaType) {
        const key = buildChannelKey(channelKey, mediaType);
        let record = this.channelHealthMap.key(key);
        if (!record) {
            record = createDefaultHealthRecord();
            this.channelHealthMap.set(key, record);
        }

        record.state = g.XW.SUBSCRIBING;
        record.lastReceivedTimestamp = null;
        record.lastSegmentId = null;

        const now = c.platform.platform.now();
        this.channelTimingMap.set(key, {
            subscribeTime: now,
            windowStartTime: now,
        });

        logger.pauseTrace(
            mediaType,
            `Channel health: SUBSCRIBING to channel=${channelKey.channelName}, relay=${channelKey.relayId}`
        );
    }

    /**
     * Record that we have successfully subscribed to a channel.
     *
     * @param {Object} channelKey - Channel identification.
     * @param {string} mediaType - The media type.
     */
    onChannelJoined(channelKey, mediaType) {
        const key = buildChannelKey(channelKey, mediaType);
        let record = this.channelHealthMap.key(key);
        if (!record) {
            record = createDefaultHealthRecord();
            this.channelHealthMap.set(key, record);
        }

        record.state = g.XW.SUBSCRIBED;

        logger.pauseTrace(
            mediaType,
            `Channel health: SUBSCRIBED to channel=${channelKey.channelName}, relay=${channelKey.relayId}`
        );
    }

    /**
     * Record that a channel join attempt has failed or we unsubscribed.
     *
     * @param {Object} channelKey - Channel identification.
     * @param {string} mediaType - The media type.
     */
    onChannelJoinFailed(channelKey, mediaType) {
        const key = buildChannelKey(channelKey, mediaType);
        const record = this.channelHealthMap.key(key);
        if (record) {
            record.state = g.XW.UNSUBSCRIBED;
        }
        this.channelTimingMap.delete(key);

        logger.pauseTrace(
            mediaType,
            `Channel health: UNSUBSCRIBED from channel=${channelKey.channelName}, relay=${channelKey.relayId}`
        );
    }

    /**
     * Record that a segment was received on this channel.
     * Detects gaps in segment IDs and updates consecutive-miss counters.
     *
     * @param {Object} channelKey - Channel identification.
     * @param {string} mediaType - The media type.
     * @param {number} segmentId - The received segment's ID.
     * @param {number} receivedTimestamp - Timestamp when the segment was received.
     */
    onObjectProgress(channelKey, mediaType, segmentId, receivedTimestamp) {
        const key = buildChannelKey(channelKey, mediaType);
        let record = this.channelHealthMap.key(key);
        if (!record) {
            record = createDefaultHealthRecord();
            record.state = g.XW.SUBSCRIBED;
            this.channelHealthMap.set(key, record);
        }

        const eventStats = record.eventBasedStats;

        // Detect gap between last received segment and this one
        if (record.lastSegmentId !== null && segmentId > record.lastSegmentId + 1) {
            const missedCount = segmentId - record.lastSegmentId - 1;
            eventStats.totalMissed += missedCount;
            eventStats.totalWindowFailures += missedCount;
            eventStats.consecutiveMissedCount += missedCount;

            logger.log(
                mediaType,
                `Channel health [event-based]: Gap detected channel=${channelKey.channelName}, relay=${channelKey.relayId}, ` +
                `lastSegmentId=${record.lastSegmentId}, currentSegmentId=${segmentId}, missedCount=${missedCount}`
            );
        }

        eventStats.totalReceived += 1;
        eventStats.windowReceived += 1;
        eventStats.consecutiveMissedCount = 0;

        record.lastSegmentId = segmentId;
        record.lastReceivedTimestamp = receivedTimestamp;

        logger.pauseTrace(
            mediaType,
            `Channel health [event-based]: Segment received channel=${channelKey.channelName}, relay=${channelKey.relayId}, ` +
            `segmentId=${segmentId}, totalReceived=${eventStats.totalReceived}, ` +
            `windowReceived=${eventStats.windowReceived}`
        );
    }

    /**
     * Calculate the expected number of segments between two timestamps
     * given a fixed segment duration.
     *
     * @param {number} startTime - Start timestamp in ms.
     * @param {number} endTime - End timestamp in ms.
     * @param {number} segmentDurationMs - Duration of each segment in ms.
     * @returns {number} Expected segment count (floored, non-negative).
     */
    calculateExpectedSegments(startTime, endTime, segmentDurationMs) {
        if (segmentDurationMs <= 0) return 0;
        return Math.max(0, Math.floor((endTime - startTime) / segmentDurationMs));
    }

    /**
     * Update time-based health metrics by comparing expected vs. actually
     * received segments over the subscription lifetime and current window.
     *
     * @param {Object} channelKey - Channel identification.
     * @param {string} mediaType - The media type.
     * @param {number} currentTime - Current timestamp in ms.
     * @param {number} segmentDurationMs - Expected segment duration in ms.
     */
    updateChannelActivity(channelKey, mediaType, currentTime, segmentDurationMs) {
        const key = buildChannelKey(channelKey, mediaType);
        const record = this.channelHealthMap.key(key);
        const timing = this.channelTimingMap.key(key);

        if (!record || record.state !== g.XW.SUBSCRIBED || !timing) {
            return;
        }

        if (segmentDurationMs <= 0) {
            logger.error(mediaType, "Channel health: Invalid segment duration", segmentDurationMs);
            return;
        }

        const timeStats = record.timeBasedStats;
        const eventStats = record.eventBasedStats;

        const expectedTotal = this.calculateExpectedSegments(timing.subscribeTime, currentTime, segmentDurationMs);
        const expectedInWindow = this.calculateExpectedSegments(timing.windowStartTime, currentTime, segmentDurationMs);

        timeStats.totalMissed = Math.max(0, expectedTotal - eventStats.totalReceived);
        timeStats.totalWindowFailures = Math.max(0, expectedInWindow - eventStats.windowReceived);
        timeStats.totalReceived = eventStats.totalReceived;
        timeStats.windowReceived = eventStats.windowReceived;
        timeStats.consecutiveMissedCount =
            record.lastReceivedTimestamp !== null
                ? this.calculateExpectedSegments(record.lastReceivedTimestamp, currentTime, segmentDurationMs)
                : expectedTotal;

        if (timeStats.totalMissed > 0 || timeStats.consecutiveMissedCount > 0) {
            logger.log(
                mediaType,
                `Channel health [time-based] poll: channel=${channelKey.channelName}, relay=${channelKey.relayId}, ` +
                `expectedTotal=${expectedTotal}, expectedInWindow=${expectedInWindow}, ` +
                `eventReceived=${eventStats.totalReceived}, eventReceivedInWindow=${eventStats.windowReceived}, ` +
                `totalMissed=${timeStats.totalMissed}, windowMissed=${timeStats.totalWindowFailures}, ` +
                `consecutive=${timeStats.consecutiveMissedCount}`
            );
        }
    }

    /**
     * Reset the window-based counters for a channel, starting a new monitoring window.
     *
     * @param {Object} channelKey - Channel identification.
     * @param {string} mediaType - The media type.
     * @param {number} windowStartTime - Timestamp for the new window start.
     */
    resetWindowStats(channelKey, mediaType, windowStartTime) {
        const key = buildChannelKey(channelKey, mediaType);
        const record = this.channelHealthMap.key(key);
        const timing = this.channelTimingMap.key(key);

        if (record) {
            logger.pauseTrace(
                mediaType,
                `Channel health: Resetting window metrics channel=${channelKey.channelName}, relay=${channelKey.relayId}, ` +
                `eventBased: windowMissed=${record.eventBasedStats.totalWindowFailures}, windowReceived=${record.eventBasedStats.windowReceived}, ` +
                `timeBased: windowMissed=${record.timeBasedStats.totalWindowFailures}, windowReceived=${record.timeBasedStats.windowReceived}`
            );

            record.eventBasedStats.totalWindowFailures = 0;
            record.eventBasedStats.windowReceived = 0;
            record.timeBasedStats.totalWindowFailures = 0;
            record.timeBasedStats.windowReceived = 0;

            if (timing) {
                timing.windowStartTime = windowStartTime;
            }
        }
    }

    /**
     * Retrieve the time-based health statistics for a given channel.
     *
     * @param {Object} channelKey - Channel identification.
     * @param {string} mediaType - The media type.
     * @returns {Object|null} Time-based health stats, or null if unavailable.
     */
    getChannelHealthStats(channelKey, mediaType) {
        const key = buildChannelKey(channelKey, mediaType);
        const record = this.channelHealthMap.key(key);
        return record?.timeBasedStats || null;
    }
}

export { EllaChannelHealthMonitor };
