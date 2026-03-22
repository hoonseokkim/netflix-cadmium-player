/**
 * Netflix Cadmium Player - SideChannel
 * Constructs encrypted side-channel query parameters appended to CDN download
 * requests. Carries buffer state, throughput hints, and congestion control
 * metadata for server-side adaptive bitrate optimization.
 *
 * @module SideChannel
 */

// import { platform } from './Module_66164';
// import { CryptoEncoder, constrainValue } from './Module_69575';

/**
 * Builds encrypted side-channel payloads for CDN download requests.
 * The side channel carries client-side telemetry to inform server-side
 * decisions like rate limiting and congestion response.
 */
class SideChannel {
  /**
   * @param {string} encryptionKey - Key for encrypting side-channel data.
   * @param {Object} requestContext - Configuration from the manifest/CDN context.
   * @param {string} requestContext.sourceTransactionId - Correlation ID for the request.
   * @param {number} requestContext.fragmentDurationTicks - Fragment duration in ticks.
   * @param {number} requestContext.timescale - Timescale divisor for tick conversion.
   * @param {boolean} requestContext.isDownloadLimited - Whether download rate limiting is active.
   * @param {boolean} requestContext.enableBlackBoxNotification - Whether black box notifications are enabled.
   * @param {boolean} requestContext.includePadding - Whether to include request padding.
   * @param {Function} errorCallback - Callback for reporting encoding errors.
   */
  constructor(encryptionKey, requestContext, errorCallback) {
    /** @type {Object} */
    this.requestContext = requestContext;

    /** @type {Function} */
    this.errorCallback = errorCallback;

    /** @type {Object} Crypto encoder for obfuscating side-channel data */
    this.cryptoEncoder = new CryptoEncoder(encryptionKey);

    /** @type {string} Source transaction ID for correlation */
    this.sourceTransactionId = requestContext.sourceTransactionId;

    /**
     * Fragment duration in milliseconds (computed from ticks/timescale).
     * @type {number}
     */
    this.fragmentDurationMs = 1000 * requestContext.fragmentDurationTicks / requestContext.timescale;

    /** @type {boolean} Whether download rate limiting is active */
    this.isDownloadLimited = requestContext.isDownloadLimited;

    /** @type {boolean} Whether CCSP (Client-side Congestion Signaling Protocol) was previously active */
    this.wasCcspActive = false;
  }

  /**
   * Build the side-channel query string for a download request.
   * Encodes buffer level, rate limit hints, timing info, and congestion
   * control metadata into an encrypted payload.
   *
   * @param {Object} params - Request parameters.
   * @param {number} [params.bufferLevelMs] - Current buffer level in ms.
   * @param {number} [params.nginxSendingRate] - Server-side sending rate hint.
   * @param {string} [params.blackBoxReason] - Reason for black box notification.
   * @param {number} [params.totalTimeMs] - Total elapsed time in ms.
   * @param {number} [params.playTimeMs] - Total play time in ms.
   * @param {Object} [params.congestionControl] - Congestion control metadata.
   * @param {Object} [params.byteRange] - Byte range for partial requests.
   * @returns {string|undefined} Encrypted side-channel payload, or undefined on error.
   */
  buildSideChannelPayload(params) {
    const payload = {
      s_xid: this.sourceTransactionId,
      dl: this.isDownloadLimited ? 1 : 0,
    };

    // Include padding flag if configured
    if (this.requestContext.includePadding) {
      payload.r_pad = 1;
    }

    // Buffer level as a bucket (1-5) based on fragment duration
    if (params.bufferLevelMs) {
      payload.bs = constrainValue(
        Math.floor(params.bufferLevelMs / this.fragmentDurationMs) + 1,
        1,
        5
      );
    }

    // Server rate limit hint
    if (params.nginxSendingRate) {
      payload.limit_rate = params.nginxSendingRate;
    }

    // Black box notification reason
    if (params.blackBoxReason) {
      payload.bb_reason = params.blackBoxReason;
    }

    // Total time
    if (params.totalTimeMs) {
      payload.tm = params.totalTimeMs;
    }

    // Play time
    if (params.playTimeMs) {
      payload.play_ms = params.playTimeMs;
    }

    // Congestion control metadata
    if (params.congestionControl) {
      const cc = params.congestionControl;
      const protocol = cc.protocol;

      if (protocol === "HYBRID") {
        payload.hybrid = cc.metrics.pacing;
        payload.cspr = cc.metrics.networkInfo;
        payload.liveEventTimes = cc.metrics.catchUpMode;
        payload.cldl = cc.metrics.requestLevelLogging;
        payload.h_ms = cc.metrics.hybridTimeMs;
      } else if (protocol === "CCSP") {
        const isActive = cc.isActive();
        // Only include CCSP data when state changes or was previously active
        if (isActive || (!isActive && this.wasCcspActive)) {
          payload.cpr_ss = cc.steadyState;
          payload.cpr_ca = cc.congestionAvoidance;
          payload.cpr_rec = cc.recovery;
          this.wasCcspActive = isActive;
        }
      }
    }

    // Byte range
    if (params.byteRange) {
      payload.br = `${params.byteRange.start}+${params.byteRange.size}`;
    }

    return this.encryptPayload(payload);
  }

  /**
   * Send a black box notification to the server via a dedicated request.
   *
   * @param {string} reason - Reason for the notification.
   * @param {string} [url] - URL to send the notification to.
   */
  sendBlackBoxNotification(reason, url) {
    if (!this.requestContext.enableBlackBoxNotification) return;

    try {
      const request = new platform.NetworkRequest(undefined, "notification");
      const payload = this.buildSideChannelPayload({ blackBoxReason: reason });
      if (url && payload) {
        request.send(url, undefined, 2, undefined, undefined, undefined, payload);
      }
    } catch (error) {
      this.errorCallback(`SideChannel: Error when sending sendBlackBoxNotification. Error: ${error}`);
    }
  }

  /**
   * Encrypt a payload object into an obfuscated query string.
   *
   * @private
   * @param {Object} payload - Key-value pairs to encode.
   * @returns {string|undefined} Encrypted string, or undefined on error.
   */
  encryptPayload(payload) {
    try {
      const queryString = this.serializeToQueryString(payload);
      return this.cryptoEncoder.encrypt(queryString);
    } catch (error) {
      this.errorCallback(`SideChannel: Error when obfuscating msg. Error: ${error}`);
      return undefined;
    }
  }

  /**
   * Serialize an object to a URL-encoded query string.
   *
   * @private
   * @param {Object} payload - Key-value pairs.
   * @returns {string} URL-encoded query string.
   */
  serializeToQueryString(payload) {
    return Object.keys(payload)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(payload[key]))}`)
      .join("&");
  }
}

export { SideChannel };
