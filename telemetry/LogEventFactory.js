/**
 * Netflix Cadmium Player - Log Event Factory
 * Deobfuscated from Module_69124
 *
 * Creates telemetry log events for the Netflix player.
 * LogEvent instances carry all contextual data (browser info, platform,
 * version, experiment groups, session IDs, etc.) needed for server-side
 * log processing. The LogEventFactory is an injectable service that
 * constructs LogEvent objects with the correct dependencies.
 */

import { __decorate, __param } from '../core/tslib';
import { calculateByteSize } from '../core/ByteSize';
import { injectable, inject as injectDecorator } from '../ioc/inversify';
import { PlayerCoreToken } from '../core/PlayerCoreToken';
import { MILLISECONDS } from '../core/TimeUnit';
import { jsonEncoderToken } from '../telemetry/JsonEncoderToken';
import { configToken } from '../config/ConfigToken';
import { ClockToken } from '../core/ClockToken';
import { uniqueIdGeneratorToken } from '../telemetry/UniqueIdGeneratorToken';
import { PlatformToken } from '../core/PlatformToken';
import { userAgentDataToken } from '../core/UserAgentDataToken';

/**
 * Represents a single telemetry log event with all contextual metadata.
 */
class LogEvent {
    /**
     * @param {Object} config - Player configuration (browser info, group name, etc.)
     * @param {Object} platform - Platform information (version, debug label)
     * @param {Object} jsonEncoder - JSON encoder for serializing event data
     * @param {Object} userAgentData - User-Agent Client Hints data
     * @param {string} eventType - Event type identifier (e.g., "startup", "heartbeat")
     * @param {string} severity - Event severity level
     * @param {Object} systemClock - System clock for timestamps
     * @param {Object} eventData - The event payload data
     * @param {Object} sequenceCounter - Sequence number and app ID tracker
     * @param {Object} uniqueIdGenerator - Generates unique log IDs
     * @param {Object} [sessionContext] - Optional session context (manifest, transaction IDs)
     */
    constructor(config, platform, jsonEncoder, userAgentData, eventType, severity, systemClock, eventData, sequenceCounter, uniqueIdGenerator, sessionContext) {
        this.platform = platform;
        this.jsonEncoder = jsonEncoder;
        this.userAgentData = userAgentData;
        this.type = eventType;
        this.severity = severity;
        this.timestamp = systemClock;
        this.sequenceCounter = sequenceCounter;
        this.data = eventData;

        // Set core event metadata
        this.data.type = eventType;
        this.data.sev = severity;
        this.data.devmod = this.platform.debugLabel;
        this.data.clver = this.platform.version;

        // Set browser and OS information
        if (config && config.browserInfo) {
            if (config.browserInfo.os) {
                this.data.osplatform = config.browserInfo.os.name;
                this.data.osver = userAgentData.platformVersion.isSupported
                    ? userAgentData.platformVersion.version
                    : config.browserInfo.os.version;
            }
            this.data.browsername = config.browserInfo.name;
            this.data.browserver = config.browserInfo.version;
        }

        // Set tester flag
        if (config.isTester) {
            this.data.tester = true;
        }

        // Build group name from various sources
        if (config.groupName && !this.data.groupname) {
            this.data.groupname = config.groupName;
        }
        if (config.serverGroupName) {
            this.data.groupname = this.data.groupname
                ? this.data.groupname + "|" + config.serverGroupName
                : config.serverGroupName;
        }
        if (config.uiGroupName) {
            this.data.uigroupname = config.uiGroupName;
        }
        if (this.data.uigroupname) {
            this.data.groupname = this.data.groupname
                ? this.data.groupname + ("|" + this.data.uigroupname)
                : this.data.uigroupname;
        }

        // Set sequence and identity
        this.data.appLogSeqNum = this.sequenceCounter.incrementSequence();
        this.data.uniqueLogId = uniqueIdGenerator.generateId();
        this.data.appId = this.sequenceCounter.id;

        // Set session context (manifest, offsets, experiment allocation)
        if (sessionContext) {
            const currentTime = this.sequenceCounter.getCurrentTime();
            this.data.soffms = currentTime.getRelativeOffset(sessionContext.timeOffset).toUnit(MILLISECONDS);
            this.data.mid = this.data.mid || sessionContext.manifestId;
            this.data.lvpi = sessionContext.lastVideoPlaybackIndex;
            this.data.uiLabel = sessionContext.manifestFormat;
            this.data.uxLabels = sessionContext.uxLabels;

            // Use "playbackxid" for startup events, "xid" for all others
            const xidKey = eventType === "startup" ? "playbackxid" : "xid";
            this.data[xidKey] = (xidKey === "xid" && this.data.xid) || sessionContext.sourceTransactionId;

            // Format A/B test allocation into group name
            if (sessionContext.abTestAllocation) {
                let allocationLabel = sessionContext.abTestAllocation;
                const parts = sessionContext.abTestAllocation.split(".");
                if (parts && parts.length > 1 && parts[0][0] !== "S") {
                    allocationLabel = "SABTest" + parts[0] + ".internal_Cell" + parts[1];
                }
                this.data.groupname = this.data.groupname
                    ? this.data.groupname + "|" + allocationLabel
                    : allocationLabel;
            }
        }
    }

    /**
     * Returns the encoded byte size of the event data (cached after first call).
     * @returns {number} The byte size of the encoded event
     */
    get size() {
        if (!this.cachedSize) {
            this.cachedSize = calculateByteSize(this.jsonEncoder.encode(this.data).length);
        }
        return this.cachedSize;
    }
}

/**
 * Factory for creating LogEvent instances with injected dependencies.
 */
class LogEventFactory {
    /**
     * @param {Object} playerCore - Core player instance (system clock)
     * @param {Object} jsonEncoder - JSON encoder service
     * @param {Object} config - Player configuration
     * @param {Object} sequenceCounter - Log sequence counter and app ID
     * @param {Object} uniqueIdGenerator - Unique ID generator
     * @param {Object} platform - Platform information
     * @param {Object} userAgentData - User-Agent Client Hints data
     */
    constructor(playerCore, jsonEncoder, config, sequenceCounter, uniqueIdGenerator, platform, userAgentData) {
        this.playerCore = playerCore;
        this.jsonEncoder = jsonEncoder;
        this.config = config;
        this.sequenceCounter = sequenceCounter;
        this.uniqueIdGenerator = uniqueIdGenerator;
        this.platform = platform;
        this.userAgentData = userAgentData;
    }

    /**
     * Creates a new LogEvent instance.
     *
     * @param {string} eventType - The event type identifier
     * @param {string} severity - The severity level
     * @param {Object} eventData - The event payload data
     * @param {Object} [sessionContext] - Optional session context
     * @returns {LogEvent} A fully initialized log event
     */
    createLogEvent(eventType, severity, eventData, sessionContext) {
        return new LogEvent(
            this.config,
            this.platform,
            this.jsonEncoder,
            this.userAgentData,
            eventType,
            severity,
            this.playerCore.systemClock,
            eventData,
            this.sequenceCounter,
            this.uniqueIdGenerator,
            sessionContext
        );
    }
}

let LogEventFactoryExport = LogEventFactory;
export { LogEventFactoryExport as LogEventFactory };

LogEventFactoryExport = __decorate([
    injectable(),
    __param(0, injectDecorator(PlayerCoreToken)),
    __param(1, injectDecorator(jsonEncoderToken)),
    __param(2, injectDecorator(configToken)),
    __param(3, injectDecorator(ClockToken)),
    __param(4, injectDecorator(uniqueIdGeneratorToken)),
    __param(5, injectDecorator(PlatformToken)),
    __param(6, injectDecorator(userAgentDataToken))
], LogEventFactoryExport);
