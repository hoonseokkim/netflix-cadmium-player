/**
 * @file NetworkRequestEnums.js
 * @description Enumerations for the network request subsystem: abort/cancel reasons,
 *   request lifecycle states, detailed error codes (DNS, connection, HTTP, SSL, socket),
 *   and codec profile feature flags.
 *
 * @module network/NetworkRequestEnums
 * @original Module_48220 (enumNamespace)
 */

/**
 * Namespace object that groups all network request enumerations.
 * @namespace
 */
export function NetworkRequestEnums() {}

/**
 * Reasons a media request can be aborted / cancelled.
 * @enum {string}
 */
NetworkRequestEnums.abortMessage = Object.freeze({
    /** Manual request abort (reason 1) */
    Shb: 'mr1',
    /** Internal abort (reason 2) */
    internal_Rhb: 'mr2',
    /** Timeout abort (reason 3) */
    internal_Thb: 'mr3',
    /** Overridden by higher-priority request (reason 4) */
    O7: 'mr4',
    /** Superseded during seek (reason 5) */
    Q3b: 'mr5',
    /** Pipeline flush / reset (reason 6) */
    oK: 'mr6',
});

/**
 * Lifecycle states for a network request.
 * The `name` array provides human-readable labels indexed by state number.
 * @enum {number}
 */
NetworkRequestEnums.he = Object.freeze({
    /** Request created but not yet opened */
    UNSENT: 0,
    /** Connection opened, headers sent */
    OPENED: 1,
    /** Response status received, awaiting body */
    receivingState: 2,
    /** Actively receiving response body data */
    RECEIVING: 3,
    /** Request completed successfully */
    DONE: 5,
    /** Request was aborted before completion */
    ABORTED: 7,
    /** Human-readable state names (indexed by state value) */
    name: [
        'UNSENT',
        'OPENED',
        'SENT',
        'RECEIVING',
        'PAUSED',
        'DONE',
        'FAILED',
        'ABORTED',
    ],
});

/**
 * Detailed network error codes covering DNS, connection, HTTP, SSL, and socket failures.
 * The `name` array provides human-readable labels indexed by error code.
 *
 * Negative values indicate no error; codes 0-52 cover the full range of failures
 * the player can encounter when fetching media fragments from Open Connect CDNs.
 *
 * @enum {number}
 */
NetworkRequestEnums.errorNameMap = Object.freeze({
    NO_ERROR: -1,

    /* DNS errors (0-3) */
    DNS_ERROR_GENERIC: 0,
    DNS_TIMEOUT_INITIAL: 1,
    DNS_QUERY_REFUSED: 2,
    DNS_NOT_FOUND: 3,

    /* Connection errors (4-13) */
    CONNECTION_REFUSED: 4,
    CONNECTION_TIMEOUT: 5,
    CONNECTION_CLOSED: 6,
    CONNECTION_RESET: 7,
    CONNECTION_RESET_ON_CONNECT: 8,
    CONNECTION_RESET_WHILE_RECEIVING: 9,
    CONNECTION_NET_UNREACHABLE: 10,
    CONNECTION_NO_ROUTE_TO_HOST: 11,
    CONNECTION_NETWORK_DOWN: 12,
    CONNECTION_NO_ADDRESS: 13,
    CONNECTION_ERROR: 14,

    /* HTTP errors (15-24) */
    HTTP_CONNECTION_ERROR: 15,
    HTTP_CONNECTION_TIMEOUT: 16,
    HTTP_CONNECTION_STALL: 17,
    HTTP_PROTOCOL_ERROR: 18,
    HTTP_RESPONSE_4XX: 19,
    HTTP_RESPONSE_420: 20,
    HTTP_RESPONSE_5XX: 21,
    HTTP_TOO_MANY_REDIRECTS: 22,
    HTTP_TRANSACTION_TIMEOUT: 23,
    HTTP_MESSAGE_LENGTH_ERROR: 24,

    /* Additional errors (25-52) */
    HTTP_HEADER_LENGTH_ERROR: 25,
    DNS_NOT_SUPPORTED: 26,
    DNS_EXPIRED: 27,
    SSL_ERROR: 28,
    DNS_BAD_FAMILY: 29,
    DNS_BAD_FLAGS: 30,
    DNS_BAD_HINTS: 31,
    DNS_BAD_NAME: 32,
    DNS_BAD_STRING: 33,
    DNS_CANCELLED: 34,
    DNS_CHANNEL_DESTROYED: 35,
    DNS_CONNECTION_REFUSED: 36,
    DNS_EOF: 37,
    DNS_FILE: 38,
    DNS_FORMAT_ERROR: 39,
    DNS_NOT_IMPLEMENTED: 40,
    DNS_NOT_INITIALIZED: 41,
    DNS_NO_DATA: 42,
    DNS_NO_MEMORY: 43,
    DNS_NO_NAME: 44,
    DNS_QUERY_MALFORMED: 45,
    DNS_ERROR: 46,
    DNS_TIMEOUT: 47,
    CONNECTION_CLOSED_NAMED: 48,
    TIMEOUT: 49,
    CONNECTION_REFUSED_NAMED: 50,
    CONNECTION_RESET_NAMED: 51,
    CONNECTION_RESET_ON_CONNECT_NAMED: 52,
    CONNECTION_NO_ADDRESS_NAMED: 53,

    /** Human-readable error names (indexed by error code) */
    name: [
        'DNS_ERROR', 'DNS_TIMEOUT', 'DNS_QUERY_REFUSED', 'DNS_NOT_FOUND',
        'CONNECTION_REFUSED', 'CONNECTION_TIMEOUT', 'CONNECTION_CLOSED',
        'CONNECTION_RESET', 'CONNECTION_RESET_ON_CONNECT',
        'CONNECTION_RESET_WHILE_RECEIVING', 'CONNECTION_NET_UNREACHABLE',
        'CONNECTION_NO_ROUTE_TO_HOST', 'CONNECTION_NETWORK_DOWN',
        'CONNECTION_NO_ADDRESS', 'CONNECTION_ERROR',
        'HTTP_CONNECTION_ERROR', 'HTTP_CONNECTION_TIMEOUT',
        'HTTP_CONNECTION_STALL', 'HTTP_PROTOCOL_ERROR',
        'HTTP_RESPONSE_4XX', 'HTTP_RESPONSE_420', 'HTTP_RESPONSE_5XX',
        'HTTP_TOO_MANY_REDIRECTS', 'HTTP_TRANSACTION_TIMEOUT',
        'HTTP_MESSAGE_LENGTH_ERROR', 'HTTP_HEADER_LENGTH_ERROR',
        'DNS_NOT_SUPPORTED', 'DNS_EXPIRED', 'SSL_ERROR',
        'DNS_BAD_FAMILY', 'DNS_BAD_FLAGS', 'DNS_BAD_HINTS',
        'DNS_BAD_NAME', 'DNS_BAD_STRING', 'DNS_CANCELLED',
        'DNS_CHANNEL_DESTROYED', 'DNS_CONNECTION_REFUSED', 'DNS_EOF',
        'DNS_FILE', 'DNS_FORMAT_ERROR', 'DNS_NOT_IMPLEMENTED',
        'DNS_NOT_INITIALIZED', 'DNS_NO_DATA', 'DNS_NO_MEMORY',
        'DNS_NO_NAME', 'DNS_QUERY_MALFORMED', 'DNS_RESPONSE_MALFORMED',
        'DNS_SERVER_FAILURE', 'SOCKET_ERROR', 'TIMEOUT',
        'HTTPS_CONNECTION_ERROR', 'HTTPS_CONNECTION_TIMEOUT',
        'HTTPS_CONNECTION_REDIRECT_TO_HTTP', 'HTTP_RESPONSE_452',
    ],
});

/**
 * Codec profile feature flags used during capability negotiation.
 * @type {Object}
 */
NetworkRequestEnums.codecProfilesMap = Object.freeze({
    C4a: {
        /** Whether the profile is supported by output constraints */
        O5c: true,
        /** Whether the profile is mandatory for playback */
        isRequired: false,
        /** Whether the profile is currently enabled */
        isEnabled: true,
    },
});

export default NetworkRequestEnums;
