/**
 * CcspSessionFactory - Creates CCSP (Client-Controlled Streaming Protocol) sessions
 *
 * Factory functions for creating outbound (player-to-server) and inbound
 * (server-to-player) CCSP communication sessions. Configures transport
 * layers and the set of fields exchanged between client and server.
 *
 * @module streaming/CcspSessionFactory
 * @original Module_62333
 */

// import { __spreadArray, __read } from 'tslib';
// import { AFa as OutboundTransport } from '../streaming/OutboundTransport';
// import { InboundTransport as InboundTransport } from '../streaming/InboundTransport';
// import { pP as Direction, DKa as CcspSession } from '../streaming/CcspSession';

/** Fields sent from client to server in outbound messages */
const OUTBOUND_FIELDS = [
    "bufferScore",
    "clientTimestamp",
    "playPositionMs",
    "ccspSlowStart",
    "ccspCongestionAvoidance",
    "ccspRecovery",
    "hybridMode",
    "hybridPaceRate",
    "hybridCatchUp",
    "hybridRequestLogging",
    "hybridMaxsegHint",
    "byteRangeHint",
    "blackBoxReason",
];

/** Fields included in inbound-only (bidirectional) messages */
const INBOUND_ONLY_FIELDS = ["blackBoxReason"];

/** Fields received from server in inbound messages */
const SERVER_RESPONSE_FIELDS = [
    "serverTimeMs",
    "encoderTag",
    "encoderRegion",
    "liveEventStart",
    "liveEventEnd",
    "maxBitrate",
    "prefetchStart",
    "prefetchDuration",
    "postplayStart",
    "postplayDuration",
];

/**
 * Creates an outbound-only CCSP session (client sends data, no server response).
 *
 * @param {string} pbcid - Playback Context ID
 * @param {Object} drmSession - DRM session reference
 * @param {*} transportConfig - Additional transport configuration
 * @param {Object} console - Logger instance
 * @returns {CcspSession} Configured CCSP session
 */
export function createOutboundSession(pbcid, drmSession, transportConfig, console) {
    const config = {
        direction: Direction.OUTBOUND,
        transport: {
            uBa: new OutboundTransport({ Sf: pbcid }),
        },
        drmSession,
        UWb: [...OUTBOUND_FIELDS],
        h1a: transportConfig,
        console,
        pbcid,
    };
    return new CcspSession(config);
}

/**
 * Creates a bidirectional CCSP session (client sends and receives server data).
 *
 * @param {string} pbcid - Playback Context ID
 * @param {Object} drmSession - DRM session reference
 * @param {*} transportConfig - Additional transport configuration
 * @param {number} [pollIntervalMs=1000] - Server polling interval in milliseconds
 * @param {Object} console - Logger instance
 * @returns {CcspSession} Configured bidirectional CCSP session
 */
export function createBidirectionalSession(pbcid, drmSession, transportConfig, pollIntervalMs, console) {
    const config = {
        direction: Direction.BIDIRECTIONAL,
        transport: {
            uBa: new OutboundTransport({ Sf: pbcid }),
            LSa: new InboundTransport({ Sf: pbcid }),
        },
        drmSession,
        UWb: [...INBOUND_ONLY_FIELDS],
        fpc: [...SERVER_RESPONSE_FIELDS],
        h1a: transportConfig,
        wnc: pollIntervalMs || 1000,
        console,
        pbcid,
    };
    return new CcspSession(config);
}
