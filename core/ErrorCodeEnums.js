/**
 * Netflix Cadmium Player - Error Code Enumerations
 *
 * Comprehensive error code definitions for the player, covering:
 * - Fatal error codes (7xxx series): initialization failures, DRM issues, network errors
 * - Detailed sub-error codes (1xxx-5xxx series): component-level error classification
 * - Business rule error codes: account restrictions, content availability, branching errors
 * - HTTP status helpers and error formatting utilities
 *
 * @module ErrorCodeEnums
 * @original Module_36129
 */

/**
 * Fatal error codes (top-level player errors).
 * Used to signal fatal conditions that typically stop playback.
 * @enum {number}
 */
export const FatalErrorCode = Object.freeze({
    UNKNOWN: 7001,
    UNHANDLED_EXCEPTION: 7002,
    INIT_COMPONENT_LOG_TO_REMOTE: 7003,
    HLS_NOT_SUPPORTED: 7004,
    INIT_ASYNCCOMPONENT: 7010,
    INIT_HTTP: 7011,
    INIT_BADMOVIEID: 7014,
    INIT_PLAYBACK_LOCK: 7020,
    INIT_SESSION_LOCK: 7022,
    INIT_POSTAUTHORIZE: 7029,
    INIT_HEADER_MEDIA: 7031,
    INIT_TIMEDTEXT_TRACK: 7034,
    ASE_SESSION_ERROR: 7037,
    ASE_SEEK_THREW: 7038,
    ASE_SKIPPED_THREW: 7039,
    ASE_UNDERFLOW_THREW: 7040,
    INIT_CORE_OBJECTS1: 7041,
    INIT_CORE_OBJECTS2: 7042,
    INIT_CORE_OBJECTS3: 7043,
    INIT_COMPONENT_STORAGE: 7053,
    INIT_COMPONENT_STORAGELOCK: 7054,
    INIT_COMPONENT_MAINTHREADMONITOR: 7058,
    INIT_COMPONENT_DEVICE: 7059,
    INIT_COMPONENT_MSL: 7063,
    INIT_COMPONENT_LOGBLOBBATCHER: 7066,
    INIT_COMPONENT_PERSISTEDPLAYDATA: 7067,
    INIT_COMPONENT_WEBCRYPTO: 7083,
    INIT_COMPONENT_IDB_VIEWER_TOOL: 7086,
    INIT_COMPONENT_BATTERY_MANAGER: 7088,
    INIT_COMPONENT_ASE: 7089,
    INIT_COMPONENT_DRM_CACHE: 7091,
    INIT_COMPONENT_DRM: 7092,
    INIT_COMPONENT_FTL: 7094,
    INIT_COMPONENT_PREPARE_MODEL: 7095,
    INIT_COMPONENT_VIDEO_SESSION_EDGE: 7096,
    INIT_COMPONENT_VIDEO_SESSION_MDX: 7097,
    INIT_COMPONENT_VIDEO_SESSION_TEST: 7098,
    INIT_COMPONENT_SOCKETROUTER: 7099,
    MANIFEST: 7111,
    MANIFEST_MISTMATCH: 7114,
    MANIFEST_VERIFY: 7117,
    START: 7120,
    LICENSE: 7121,
    RELEASE: 7122,
    STOP: 7123,
    KEEPALIVE: 7125,
    PING: 7131,
    ENGAGE: 7134,
    LOGBLOB: 7137,
    PAUSE: 7138,
    RESUME: 7139,
    SPLICE: 7140,
    BIND: 7142,
    BIND_DEVICE: 7144,
    GENERATE_SCREENSHOTS: 7145,
    AD_EVENT: 7146,
    PLAYER_RESTART: 7147,
    ALE_PROVISION_FAILURE: 7148,
    SOCKET_ROUTER_FAILURE: 7200,
    PLAY_INIT_EXCEPTION: 7202,
    PLAY_MSE_EME_KEY_STATUS_CHANGE_EXPIRED: 7332,
    PLAY_MSE_EME_KEY_STATUS_CHANGE_INTERNAL_ERROR: 7333,
    PLAY_MSE_EME_KEY_STATUS_CHANGE_OUTPUT_NOT_ALLOWED: 7334,
    PLAY_MSE_EME_KEY_STATUS_EXCEPTION: 7335,
    PLAY_MSE_EME_KEY_STATUS_CHANGE_OUTPUT_RESTRICTED: 7336,
    PLAY_MSE_EME_KEY_MAPPING_EXCEPTION: 7338,
    PLAY_MSE_NOTSUPPORTED: 7351,
    PLAY_MSE_DECODER_TIMEOUT: 7353,
    PLAY_MSE_SOURCEADD: 7355,
    PLAY_MSE_CREATE_MEDIAKEYS: 7356,
    PLAY_MSE_GENERATEKEYREQUEST: 7357,
    PLAY_MSE_EVENT_ERROR: 7361,
    PLAY_MSE_SETMEDIAKEYS: 7362,
    PLAY_MSE_EVENT_KEYERROR: 7363,
    PLAY_MSE_EME_SESSION_CLOSE: 7364,
    PLAY_MSE_GETCURRENTTIME: 7365,
    PLAY_MSE_SETCURRENTTIME: 7367,
    PLAY_MSE_SOURCEAPPEND: 7371,
    PLAY_MSE_UNEXPECTED_SEEKING: 7375,
    PLAY_MSE_UNEXPECTED_SEEKED: 7376,
    PLAY_MSE_UNEXPECTED_REWIND: 7377,
    PLAY_MSE_SOURCEBUFFER_ERROR: 7381,
    PLAY_MSE_SOURCEBUFFER_CHANGETYPE: 7382,
    PLAY_MSE_CREATE_MEDIASOURCE: 7391,
    PLAY_MSE_CREATE_MEDIASOURCE_OBJECTURL: 7392,
    PLAY_MSE_CREATE_MEDIASOURCE_OPEN: 7393,
    PLAY_MSE_EME_MISSING_DRMHEADER: 7394,
    PLAY_MSE_EME_MISSING_PSSH: 7395,
    PLAY_MSE_EME_NO_PRK_SUPPORT: 7397,
    PLAY_MSE_DURATIONCHANGE_ERROR: 7398,
    PLAY_MSE_SET_LICENSE_ERROR: 7399,
    EXTERNAL: 7400,
    PAUSE_TIMEOUT: 7500,
    INACTIVITY_TIMEOUT: 7502,
    AUTHORIZATION_EXPIRED: 7510,
    EME_INVALID_KEYSYSTEM: 7700,
    EME_CREATE_MEDIAKEYS_SYSTEMACCESS_FAILED: 7701,
    EME_CREATE_MEDIAKEYS_FAILED: 7702,
    EME_GENERATEREQUEST_FAILED: 7703,
    EME_UPDATE_FAILED: 7704,
    EME_KEYSESSION_ERROR: 7705,
    EME_KEYMESSAGE_EMPTY: 7706,
    EME_REMOVE_FAILED: 7707,
    EME_LOAD_FAILED: 7708,
    EME_CREATE_SESSION_FAILED: 7709,
    EME_LDL_RENEWAL_ERROR: 7710,
    EME_INVALID_INITDATA_DATA: 7711,
    EME_INVALID_LICENSE_DATA: 7712,
    EME_LDL_KEYSSION_ALREADY_CLOSED: 7713,
    EME_CLOSE_FAILED: 7716,
    EME_SESSION_CLOSED_UNEXPECTEDLY: 7717,
    EME_SET_SERVER_CERTIFICATE: 7718,
    PLAYDATA_STORE_FAILURE: 7800,
    BRANCH_PLAY_FAILURE: 7900,
    BRANCH_QUEUE_FAILURE: 7901,
    BRANCH_UPDATE_NEXT_SEGMENT_WEIGHTS_FAILURE: 7902,
    BRANCH_CHOICE_MAP_MISSING: 7903,
    PBO_EVENTLOOKUP_FAILURE: 8100,
});

/**
 * Detailed error sub-codes for specific component/subsystem failures.
 * @enum {number}
 */
export const ErrorSubCode = Object.freeze({
    UNKNOWN: 1001,
    EXCEPTION: 1003,
    INVALID_DI: 1004,
    ASYNCLOAD_EXCEPTION: 1011,
    ASYNCLOAD_TIMEOUT: 1013,
    ASYNCLOAD_BADCONFIG: 1015,
    ASYNCLOAD_COMPONENT_DUPLICATE: 1016,
    ASYNCLOAD_COMPONENT_MISSING: 1017,

    // HTTP errors (1100-1199)
    HTTP_UNKNOWN: 1101,
    HTTP_XHR: 1102,
    HTTP_PROTOCOL: 1103,
    HTTP_OFFLINE: 1104,
    HTTP_TIMEOUT: 1105,
    HTTP_READTIMEOUT: 1106,
    HTTP_ABORT: 1107,
    HTTP_PARSE: 1108,
    HTTP_BAD_URL: 1110,
    HTTP_PROXY: 1111,

    // MSE errors
    MSE_AUDIO: 1203,
    MSE_VIDEO: 1204,
    MSE_MEDIA_ERR_BASE: 1250,
    MSE_MEDIA_ERR_ABORTED: 1251,
    MSE_MEDIA_ERR_NETWORK: 1252,
    MSE_MEDIA_ERR_DECODE: 1253,
    MSE_MEDIA_ERR_SRC_NOT_SUPPORTED: 1254,
    MSE_MEDIA_ERR_ENCRYPTED: 1255,

    // EME key errors
    EME_MEDIA_KEYERR_BASE: 1260,
    EME_MEDIA_KEYERR_UNKNOWN: 1261,
    EME_MEDIA_KEYERR_CLIENT: 1262,
    EME_MEDIA_KEYERR_SERVICE: 1263,
    EME_MEDIA_KEYERR_OUTPUT: 1264,
    EME_MEDIA_KEYERR_HARDWARECHANGE: 1265,
    EME_MEDIA_KEYERR_DOMAIN: 1266,
    EME_MEDIA_UNAVAILABLE_CDM: 1269,
    EME_INTERNAL_ERROR: 1270,
    EME_CLOSED_BY_APPLICATION: 1271,
    EME_RELEASE_ACKNOWLEDGED: 1272,
    EME_HARDWARE_CONTEXT_RESET: 1273,
    EME_RESOURCE_EVICTED: 1274,
    EME_ERROR_NODRMSESSSION: 1280,
    EME_ERROR_NODRMREQUESTS: 1281,
    EME_ERROR_INDIV_FAILED: 1282,
    EME_ERROR_UNSUPPORTED_MESSAGETYPE: 1283,
    EME_TIMEOUT_MESSAGE: 1284,
    EME_TIMEOUT_KEYCHANGE: 1285,
    EME_UNDEFINED_DATA: 1286,
    EME_INVALID_STATE: 1287,
    EME_LDL_DOES_NOT_SUPPORT_PRK: 1288,
    EME_EMPTY_DATA: 1289,
    EME_TIMEOUT: 1290,

    // Protocol errors
    NCCP_METHOD_NOT_SUPPORTED: 1303,
    NCCP_PARSEXML: 1305,
    PROCESS_EXCEPTION: 1309,
    NCCP_NETFLIXID_MISSING: 1311,
    NCCP_SECURENETFLIXID_MISSING: 1312,
    NCCP_HMAC_MISSING: 1313,
    NCCP_HMAC_MISMATCH: 1315,
    NCCP_HMAC_FAILED: 1317,
    NCCP_CLIENTTIME_MISSING: 1321,
    NCCP_CLIENTTIME_MISMATCH: 1323,
    GENERIC: 1331,
    NCCP_PROTOCOL_INVALIDDEVICECREDENTIALS: 1333,
    NCCP_PROTOCOL_REDIRECT_LOOP: 1337,
    NCCP_TRANSACTION: 1341,
    NCCP_INVALID_DRMTYPE: 1343,
    NCCP_INVALID_LICENCE_RESPONSE: 1344,
    NCCP_MISSING_PAYLOAD: 1345,
    PROTOCOL_NOT_INITIALIZED: 1346,
    PROTOCOL_MISSING_FIELD: 1347,
    PROTOCOL_MISMATCHED_PROFILEGUID: 1348,

    // Storage errors
    STORAGE_NODATA: 1402,
    STORAGE_EXCEPTION: 1403,
    STORAGE_QUOTA_NOT_GRANTED: 1405,
    STORAGE_QUOTA_TO_SMALL: 1407,
    STORAGE_LOAD_ERROR: 1411,
    STORAGE_LOAD_TIMEOUT: 1412,
    STORAGE_SAVE_ERROR: 1414,
    STORAGE_SAVE_TIMEOUT: 1415,
    STORAGE_DELETE_ERROR: 1417,
    STORAGE_DELETE_TIMEOUT: 1418,
    STORAGE_FS_REQUESTFILESYSTEM: 1421,
    STORAGE_FS_GETDIRECTORY: 1423,
    STORAGE_FS_READENTRIES: 1425,
    STORAGE_FS_FILEREAD: 1427,
    STORAGE_FS_FILEWRITE: 1429,
    STORAGE_FS_FILEREMOVE: 1431,
    STORAGE_FS_PARSEJSON: 1432,
    STORAGE_NO_LOCALSTORAGE: 1451,
    STORAGE_LOCALSTORAGE_ACCESS_EXCEPTION: 1453,

    // NTBA / crypto
    NTBA_UNKNOWN: 1501,
    NTBA_EXCEPTION: 1502,
    NTBA_CRYPTO_KEY: 1504,
    NTBA_CRYPTO_OPERATION: 1506,
    NTBA_CRYPTO_KEYEXCHANGE: 1508,
    NTBA_DECRYPT_UNSUPPORTED: 1515,

    // Device errors
    DEVICE_NO_ESN: 1553,
    DEVICE_ERROR_GETTING_ESN: 1555,

    // Format errors
    FORMAT_UNKNOWN: 1701,
    FORMAT_XML: 1713,
    FORMAT_XML_CONTENT: 1715,
    FORMAT_BASE64: 1721,
    FORMAT_DFXP: 1723,

    // IndexedDB errors
    INDEXDB_OPEN_EXCEPTION: 1801,
    INDEXDB_NOT_SUPPORTED: 1802,
    INDEXDB_OPEN_ERROR: 1803,
    INDEXDB_OPEN_NULL: 1804,
    INDEXDB_OPEN_BLOCKED: 1805,
    INDEXDB_OPEN_TIMEOUT: 1807,
    INDEXDB_INVALID_STORE_STATE: 1808,
    INDEXDB_ACCESS_EXCEPTION: 1809,

    // MSL errors
    MSL_UNKNOWN: 1901,
    MSL_INIT_NO_MSL: 1911,
    MSL_INIT_ERROR: 1913,
    MSL_INIT_NO_WEBCRYPTO: 1915,
    MSL_ERROR: 1931,
    MSL_REQUEST_TIMEOUT: 1933,
    MSL_READ_TIMEOUT: 1934,
    MSL_ERROR_HEADER: 1935,
    MSL_ERROR_ENVELOPE: 1936,
    MSL_ERROR_MISSING_PAYLOAD: 1937,
    MSL_ERROR_REAUTH: 1957,

    // WebCrypto errors
    WEBCRYPTO_MISSING: 2103,
    WEBCRYPTOKEYS_MISSING: 2105,
    WEBCRYPTO_IFRAME_LOAD_ERROR: 2107,

    // Cached data errors
    CACHEDDATA_PARSEJSON: 2200,
    CACHEDDATA_UNSUPPORTED_VERSION: 2201,
    CACHEDDATA_UPGRADE_FAILED: 2202,
    CACHEDDATA_INVALID_FORMAT: 2203,

    // Account errors
    ACCOUNT_CHANGE_INFLIGHT: 3000,
    ACCOUNT_INVALID: 3001,

    // Downloaded content errors
    DOWNLOADED_MANIFEST_UNAVAILABLE: 3100,
    DOWNLOADED_MANIFEST_PARSE_EXCEPTION: 3101,
    DOWNLOADED_LICENSE_UNAVAILABLE: 3200,
    DOWNLOADED_LICENSE_UNUSEABLE: 3201,
    DOWNLOADED_LICENSE_EXCEPTION: 3202,

    // Virtual asset storage errors
    STORAGE_VA_LOAD_ERROR: 3300,
    STORAGE_VA_LOAD_TIMEOUT: 3301,
    STORAGE_VA_SAVE_ERROR: 3302,
    STORAGE_VA_SAVE_TIMEOUT: 3303,
    STORAGE_VA_REMOVE_ERROR: 3304,
    STORAGE_VA_REMOVE_TIMEOUT: 3305,

    // PBO device errors
    PBO_DEVICE_EOL_WARNING: 3077,
    PBO_DEVICE_EOL_FINAL: 3078,
    PBO_DEVICE_RESET: 3100,
    PBO_DEVICE_RELOAD: 3101,
    PBO_DEVICE_EXIT: 3102,

    // PBO business rule errors (5xxx)
    PBO_VIEWABLE_OUT_OF_AVAILABILITY_WINDOW: 5003,
    PBO_ACCOUNT_ON_HOLD: 5005,
    PBO_CONCURRENT_STREAM_QUOTA_EXCEEDED: 5006,
    PBO_INCORRECT_PIN: 5007,
    PBO_MOBILE_ONLY: 5008,
    PBO_VIEWABLE_RESTRICTED_BY_PROFILE: 5009,
    PBO_ADS_UNAVAILABLE_VIEWABLE: 5010,
    PBO_ADS_UNSUPPORTED_DEVICE: 5011,
    PBO_ADS_UNSUPPORTED_CLIENT_APP_VERSION: 5012,
    PBO_ADS_UNSUPPORTED_COUNTRY: 5013,
    PBO_ADS_VPN_USE_DETECTED: 5014,
    PBO_LIVE_STREAMING_UNSUPPORTED_DEVICE: 5015,
    PBO_LIVE_STREAMING_UNSUPPORTED_APP_VERSION: 5016,
    PBO_CONTENT_PREVIEW_MFA_REQUIRED_EXCEPTION: 5017,
    PBO_INSUFFICIENT_MATURITY_LEVEL: 5033,
    PBO_BLACKLISTED_IP: 5059,
    PBO_AGE_VERIFICATION_REQUIRED: 5070,
    PBO_CHOICE_MAP_ERROR: 5080,
    PBO_RESTRICTED_TO_TESTERS: 5090,
    PBO_MALFORMED_REQUEST: 5091,
    PBO_INVALID_SERVICE_VERSION: 5092,
    PBO_MDX_INVALID_CTICKET: 5093,
    PBO_FREE_PREVIEW_ENDED: 5094,
    PBO_STREAMING_LOCATION_DISALLOWED: 5095,
    PBO_EXTRA_MEMBER_STREAM_HOLD: 5096,
    PBO_EXTRA_MEMBER_REMOVED_STREAM_HOLD: 5097,

    // Decoder timeout errors
    DECODER_TIMEOUT_BUFFERING: 5100,
    DECODER_TIMEOUT_PRESENTING: 5101,
    DECODER_TIMEOUT_PLAYING: 5102,

    // Downloader IO
    DOWNLOADER_IO_ERROR: 5200,

    // Branching errors
    BRANCHING_SEGMENT_NOTFOUND: 5300,
    BRANCHING_PRESENTER_UNINITIALIZED: 5301,
    BRANCHING_SEGMENT_STREAMING_NOT_STARTED: 5302,
    BRANCHING_ASE_UNINITIALIZED: 5303,
    BRANCHING_ASE_FAILURE: 5304,
    BRANCHING_MOMENT_FAILURE: 5305,
    BRANCHING_CURRENT_SEGMENT_UNINITIALIZED: 5306,
    BRANCHING_SEGMENT_LASTPTS_UNINIITALIZED: 5307,
    BRANCHING_SEEK_THREW: 5308,
    BRANCHING_PLAY_NOTENOUGHNEXTSEGMENTS: 5309,
    BRANCHING_PLAY_TIMEDOUT: 5310,
    BRANCHING_SEGMENT_ALREADYQUEUED: 5311,
    BRANCHING_UPDATE_NEXT_SEGMENT_WEIGHTS_THREW: 5312,

    // Studio / manifest
    STUDIO_MUXED_MANIFEST: 5500,
    MANIFEST_HYDRATION_FAILURE: 5600,

    // Auxiliary manifest errors
    AUXILIARY_MANIFEST_ERROR_RETRIEVING_PARENT_MANIFEST: 5700,
    AUXILIARY_MANIFEST_NO_MATCHING_HEACC_AUDIO_STREAM_FOUND: 5701,
    AUXILIARY_MANIFEST_ADBREAK_HYDRATION_FATAL_ERROR: 5702,
});

/**
 * Business rule error codes returned by the playback orchestration backend.
 * @enum {number}
 */
export const BusinessRuleErrorCode = Object.freeze({
    BR_VIEWABLE_OUT_OF_AVAILABILITY_WINDOW: 5003,
    BR_ACCOUNT_ON_HOLD: 5005,
    BR_CONCURRENT_STREAM_QUOTA_EXCEEDED: 5006,
    BR_INSUFFICIENT_MATURITY_LEVEL: 5033,
    BR_BLACKLISTED_IP: 5059,
    BR_AGE_VERIFICATION_REQUIRED: 5070,
    BR_PLAYBACK_CONTEXT_CREATION: 2204,
    BR_DRM_LICENSE_AQUISITION: 2205,
    BR_PLAYBACK_SERVICE_ERROR: 2206,
    BR_ENDPOINT_ERROR: 2207,
    BR_AUTHORIZATION_ERROR: 2208,
});

/**
 * HTTP status code constants used in error handling.
 * @enum {string}
 */
export const HttpStatusCode = Object.freeze({
    BAD_REQUEST: "400",
    UNAUTHORIZED: "401",
    PAYLOAD_TOO_LARGE: "413",
});

/**
 * Error source type identifiers.
 * @enum {number}
 */
export const ErrorSourceType = Object.freeze({
    HEADER_APPEND: 1,
    FILESYSTEM: 2,
    ZIGZAG: 3,
    STREAM_ERROR: 4,
    OPEN_RANGE: 5,
    ZONE_INFO: 6,
    UNDEFINED: 7,
    MSE: 8,
    TIMED_TEXT: 9,
    WATERMARK: 10,
});

/**
 * Determines whether an error is "soft" (i.e., recoverable/expected based on state).
 *
 * @param {number} fatalCode - The FatalErrorCode value
 * @param {number} subCode - The ErrorSubCode value
 * @param {number} elapsedMs - Time elapsed in milliseconds
 * @param {number} [keyStatusCount] - Optional key status count
 * @returns {boolean} True if the error is considered "soft"
 */
export function isSoftError(fatalCode, subCode, elapsedMs, keyStatusCount) {
    return (
        fatalCode === FatalErrorCode.PAUSE_TIMEOUT ||
        fatalCode === FatalErrorCode.INACTIVITY_TIMEOUT ||
        (fatalCode === FatalErrorCode.PLAY_MSE_EME_KEY_STATUS_CHANGE_EXPIRED &&
            (elapsedMs >= 43200000 || (keyStatusCount !== undefined && keyStatusCount === 0))) ||
        (fatalCode === FatalErrorCode.EME_SESSION_CLOSED_UNEXPECTEDLY &&
            subCode === ErrorSubCode.EME_HARDWARE_CONTEXT_RESET &&
            Number(keyStatusCount) > 0)
    );
}

/**
 * Checks whether an error sub-code is an HTTP error (in the 1100-1199 range).
 *
 * @param {number} subCode - Error sub-code to check
 * @returns {boolean} True if the sub-code is an HTTP error
 */
export function isHttpError(subCode) {
    return subCode >= 1100 && subCode <= 1199;
}

/**
 * Adds a 1-9 offset to a base error code when the value is in range.
 *
 * @param {number} value - The offset value (1-9)
 * @param {number} base - The base error code
 * @returns {number} The combined error code
 */
export function addErrorOffset(value, base) {
    return (value >= 1 && value <= 9) ? base + value : base;
}

/**
 * Maps a MediaError code value to an MSE media error sub-code.
 *
 * @param {number} mediaErrorCode - The MediaError.code value
 * @returns {number} The corresponding ErrorSubCode
 */
export function toMseMediaError(mediaErrorCode) {
    return addErrorOffset(mediaErrorCode, ErrorSubCode.MSE_MEDIA_ERR_BASE);
}

/**
 * Maps an EME key error code to an EME media key error sub-code.
 *
 * @param {number} keyErrorCode - The key error code value
 * @returns {number} The corresponding ErrorSubCode
 */
export function toEmeKeyError(keyErrorCode) {
    return addErrorOffset(keyErrorCode, ErrorSubCode.EME_MEDIA_KEYERR_BASE);
}

/**
 * Formats an error object into a standardized error details structure
 * for telemetry / logging.
 *
 * @param {Object} errorInfo - Raw error info
 * @param {number} [errorInfo.errorSubCode] - Sub-code from the error
 * @param {number} [errorInfo.errorcode] - Alternative error code field
 * @param {number} [errorInfo.errorExternalCode] - External error code
 * @param {number} [errorInfo.errorSubcode] - Alternative external code field
 * @param {string} [errorInfo.errorDetails] - Additional error details
 * @param {string} [errorInfo.configFlag] - Config flag details
 * @returns {{ ErrorSubCode: number, ErrorExternalCode?: number, ErrorDetails?: string }}
 */
export function formatErrorDetails(errorInfo) {
    const result = {};
    const externalCode = errorInfo.errorExternalCode || errorInfo.errorSubcode;
    const details = errorInfo.errorDetails || errorInfo.configFlag;

    result.ErrorSubCode = errorInfo.errorSubCode || errorInfo.errorcode || ErrorSubCode.UNKNOWN;

    if (externalCode) {
        result.ErrorExternalCode = externalCode;
    }
    if (details) {
        result.ErrorDetails = details;
    }

    return result;
}

export default {
    FatalErrorCode,
    ErrorSubCode,
    BusinessRuleErrorCode,
    HttpStatusCode,
    ErrorSourceType,
    isSoftError,
    isHttpError,
    addErrorOffset,
    toMseMediaError,
    toEmeKeyError,
    formatErrorDetails,
};
