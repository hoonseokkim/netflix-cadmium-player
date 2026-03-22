/**
 * @module DisconnectReason
 * @description Enumeration of reasons for disconnecting from a live stream.
 * Used by the live playback system to track and report why a viewer
 * was disconnected from a live session.
 *
 * @original Module 11346
 */

import { createStringEnum } from '../utils/EnumFactory.js';

/**
 * Reasons for disconnecting from a live stream.
 *
 * @enum {string}
 * @property {string} UNSPECIFIED - No specific reason given
 * @property {string} AT_LIVE_EDGE - Client is at the live edge
 * @property {string} CHANNEL_SWITCH - User switched channels
 * @property {string} INCOMING_SUBSCRIBER - New subscriber taking the slot
 * @property {string} RELAY_SWITCH - Relay server switch occurred
 * @property {string} NO_CLIENT_SUBSCRIPTION - Client has no active subscription
 * @property {string} BEHIND_LIVE_EDGE - Client fell too far behind live edge
 * @property {string} SHUTDOWN - Server or session shutdown
 * @property {string} RETRY - Disconnected for retry
 * @property {string} SERVER_ACK - Server acknowledged disconnect
 * @property {string} JOIN_TIMEOUT - Timed out while joining
 * @property {string} JOIN_REJECTED - Join request was rejected
 * @property {string} KEEPALIVE_TIMEOUT - Keepalive timeout expired
 * @property {string} SUBSCRIBER_LEAVING - Subscriber is leaving
 */
export const DisconnectReason = createStringEnum([
    "UNSPECIFIED",
    "AT_LIVE_EDGE",
    "CHANNEL_SWITCH",
    "INCOMING_SUBSCRIBER",
    "RELAY_SWITCH",
    "NO_CLIENT_SUBSCRIPTION",
    "BEHIND_LIVE_EDGE",
    "SHUTDOWN",
    "RETRY",
    "SERVER_ACK",
    "JOIN_TIMEOUT",
    "JOIN_REJECTED",
    "KEEPALIVE_TIMEOUT",
    "SUBSCRIBER_LEAVING"
]);
