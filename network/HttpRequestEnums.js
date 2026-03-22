/**
 * @file HttpRequestEnums.js
 * @description Enumerations for the HTTP transport layer: abort reasons, request states,
 *   network error codes, and codec profile configuration flags.
 * @module network/HttpRequestEnums
 * @original Module_48220 (enumNamespace)
 */

/**
 * Namespace containing all HTTP request related enumerations.
 */
export class HttpRequestEnums {
    /**
     * Reasons for aborting an HTTP request.
     * @enum {string}
     */
    static abortMessage = {
        /** Manual abort reason 1 */
        Shb: 'mr1',
        /** Manual abort reason 2 */
        internal_Rhb: 'mr2',
        /** Manual abort reason 3 */
        internal_Thb: 'mr3',
        /** Manual abort reason 4 (general) */
        O7: 'mr4',
        /** Manual abort reason 5 */
        Q3b: 'mr5',
        /** Manual abort reason 6 */
        oK: 'mr6'
    };

    /**
     * HTTP request lifecycle states.
     * @enum {number}
     */
    static requestState = {
        /** Request has been created but not opened */
        UNSENT: 0,
        /** Request has been opened */
        OPENED: 1,
        /** Request has been sent, waiting for response */
        receivingState: 2,
        /** Response body is being received */
        RECEIVING: 3,
        /** Response fully received */
        DONE: 5,
        /** Request was aborted */
        ABORTED: 7,
        /** Human-readable names for each state */
        name: 'UNSENT OPENED SENT RECEIVING PAUSED DONE FAILED ABORTED'.split(' ')
    };

    /**
     * Detailed network error codes for HTTP transport failures.
     * Covers DNS, connection, TLS, HTTP protocol, and socket-level errors.
     * @enum {number}
     */
    static errorNameMap = {
        NO_ERROR: -1,
        DNS_ERROR: 0,
        DNS_TIMEOUT: 1,
        DNS_QUERY_REFUSED: 2,
        DNS_NOT_FOUND: 3,
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

        // Legacy aliases
        DNS_ERROR_LEGACY: 46,
        DNS_TIMEOUT_LEGACY: 47,
        CONNECTION_CLOSED_LEGACY: 48,
        TIMEOUT: 49,
        CONNECTION_REFUSED_LEGACY: 50,
        CONNECTION_RESET_LEGACY: 51,
        CONNECTION_RESET_ON_CONNECT_LEGACY: 52,
        CONNECTION_NO_ADDRESS_LEGACY: 53,

        /**
         * Human-readable error names indexed by error code.
         * @type {string[]}
         */
        name: (
            'DNS_ERROR DNS_TIMEOUT DNS_QUERY_REFUSED DNS_NOT_FOUND ' +
            'CONNECTION_REFUSED CONNECTION_TIMEOUT CONNECTION_CLOSED CONNECTION_RESET ' +
            'CONNECTION_RESET_ON_CONNECT CONNECTION_RESET_WHILE_RECEIVING CONNECTION_NET_UNREACHABLE ' +
            'CONNECTION_NO_ROUTE_TO_HOST CONNECTION_NETWORK_DOWN CONNECTION_NO_ADDRESS CONNECTION_ERROR ' +
            'HTTP_CONNECTION_ERROR HTTP_CONNECTION_TIMEOUT HTTP_CONNECTION_STALL HTTP_PROTOCOL_ERROR ' +
            'HTTP_RESPONSE_4XX HTTP_RESPONSE_420 HTTP_RESPONSE_5XX HTTP_TOO_MANY_REDIRECTS ' +
            'HTTP_TRANSACTION_TIMEOUT HTTP_MESSAGE_LENGTH_ERROR HTTP_HEADER_LENGTH_ERROR ' +
            'DNS_NOT_SUPPORTED DNS_EXPIRED SSL_ERROR DNS_BAD_FAMILY DNS_BAD_FLAGS DNS_BAD_HINTS ' +
            'DNS_BAD_NAME DNS_BAD_STRING DNS_CANCELLED DNS_CHANNEL_DESTROYED DNS_CONNECTION_REFUSED ' +
            'DNS_EOF DNS_FILE DNS_FORMAT_ERROR DNS_NOT_IMPLEMENTED DNS_NOT_INITIALIZED DNS_NO_DATA ' +
            'DNS_NO_MEMORY DNS_NO_NAME DNS_QUERY_MALFORMED DNS_RESPONSE_MALFORMED DNS_SERVER_FAILURE ' +
            'SOCKET_ERROR TIMEOUT HTTPS_CONNECTION_ERROR HTTPS_CONNECTION_TIMEOUT ' +
            'HTTPS_CONNECTION_REDIRECT_TO_HTTP HTTP_RESPONSE_452'
        ).split(' ')
    };

    /**
     * Codec profile configuration flags.
     * @type {Object}
     */
    static codecProfilesMap = {
        C4a: {
            /** Whether the profile is optional */
            O5c: true,
            /** Whether the profile is required */
            isRequired: false,
            /** Whether the profile is currently enabled */
            isEnabled: true
        }
    };
}

export default HttpRequestEnums;
