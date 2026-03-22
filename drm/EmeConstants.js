/**
 * Netflix Cadmium Player -- EmeConstants
 *
 * Constants used throughout the EME (Encrypted Media Extensions)
 * subsystem: init-data types, session types, security/robustness
 * levels, and utility functions for capability detection.
 *
 * Also contains the Netflix FairPlay Application Certificate and
 * PlayReady Metering Certificate as Base64-encoded strings.
 *
 * Original: Webpack Module 82100
 *
 * @module drm/EmeConstants
 */

// ---------------------------------------------------------------------------
// Init-data and session types
// ---------------------------------------------------------------------------

/** Standard CENC (Common Encryption) init-data type. */
export const INIT_DATA_TYPE_CENC = 'cenc';

/** Temporary (non-persistent) EME session type. */
export const SESSION_TYPE_TEMPORARY = 'temporary';

// ---------------------------------------------------------------------------
// Security / robustness levels
// ---------------------------------------------------------------------------

/** Software-only crypto (Widevine L3). */
export const SW_SECURE_CRYPTO = 'SW_SECURE_CRYPTO';

/** Software-based decoding with secure output (Widevine L2). */
export const SW_SECURE_DECODE = 'SW_SECURE_DECODE';

/** Hardware-secured decoding pipeline. */
export const HW_SECURE_DECODE = 'HW_SECURE_DECODE';

/** Full hardware security chain -- TEE-based (Widevine L1). */
export const HW_SECURE_ALL = 'HW_SECURE_ALL';

/**
 * Map of robustness level constants keyed by their name.
 * @type {Record<string, string>}
 */
export const SecurityLevel = Object.freeze({
  SW_SECURE_CRYPTO,
  SW_SECURE_DECODE,
  HW_SECURE_DECODE,
  HW_SECURE_ALL,
});

/**
 * Robustness levels that indicate hardware DRM.
 * @type {string[]}
 */
export const HW_DRM_ROBUSTNESS_LEVELS = [HW_SECURE_ALL];

// ---------------------------------------------------------------------------
// Certificate blobs (Base64)
// ---------------------------------------------------------------------------

/**
 * Netflix FairPlay Application Certificate (Base64-encoded DER).
 * Used to set the server certificate on FairPlay key sessions.
 * @type {string}
 */
export const FAIRPLAY_APP_CERTIFICATE = 'MIIE2jCCA8KgAwIBAgIIBRGnbPd8z1YwDQYJKoZIhvcNAQEFBQAwfzELMAkGA1UEBhMCVVMxEzARBgNVBAoMCkFwcGxlIEluYy4xJjAkBgNVBAsMHUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MTMwMQYDVQQDDCpBcHBsZSBLZXkgU2VydmljZXMgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkwHhcNMTMwMzI3MjEyNjU2WhcNMTUwMzI4MjEyNjU2WjBjMQswCQYDVQQGEwJVUzEUMBIGA1UECgwLTmV0ZmxpeC5jb20xDDAKBgNVBAsMA0VEUzEwMC4GA1UEAwwnRlBTIEFwcGxpY2F0aW9uIENlcnRpZmljYXRlICgyMDEzIHYxLjApMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDfaIdDptThILsQcAbDMvT5FpK4JNn/BnHAY++rS9OFfhg5R4pV7CI+UMZeC64TFJJZciq6dX4/Vh7JDDULooAeZxlOLqJB4v+KDMpFS6VsRPweeMRSCE5rQffF5HoRKx682Kw4Ltv2PTxE3M16ktYCOxq+/7fxevMt3uII+2V0tQIDAQABo4IB+DCCAfQwHQYDVR0OBBYEFDuQUJCSl+l2UeybrEfNbUR1JcwSMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUY+RHVMuFcVlGLIOszEQxZGcDLL4wgeIGA1UdIASB2jCB1zCB1AYJKoZIhvdjZAUBMIHGMIHDBggrBgEFBQcCAjCBtgyBs1JlbGlhbmNlIG9uIHRoaXMgY2VydGlmaWNhdGUgYnkgYW55IHBhcnR5IGFzc3VtZXMgYWNjZXB0YW5jZSBvZiB0aGUgdGhlbiBhcHBsaWNhYmxlIHN0YW5kYXJkIHRlcm1zIGFuZCBjb25kaXRpb25zIG9mIHVzZSwgY2VydGlmaWNhdGUgcG9saWN5IGFuZCBjZXJ0aWZpY2F0aW9uIHByYWN0aWNlIHN0YXRlbWVudHMuMDUGA1UdHwQuMCwwKqAooCaGJGh0dHA6Ly9jcmwuYXBwbGUuY29tL2tleXNlcnZpY2VzLmNybDAOBgNVHQ8BAf8EBAMCBSAwLQYLKoZIhvdjZAYNAQMBAf8EGwGcLBpLUU8iNtuBsGfgldUUE/I42u6RKyl8uzBJBgsqhkiG92NkBg0BBAEB/wQ3AV+LX+Xo3O4lI5WzFXfxVrna5jJD1GHioNsMHMKUv97Kx9dCozZVRhmiGdTREdjOptDoUjj2ODANBgkqhkiG9w0BAQUFAAOCAQEAmkGc6tT450ENeFTTmvhyTHfntjWyEpEvsvoubGpqPnbPXhYsaz6U1RuoLkf5q4BkaXVE0yekfKiPa5lOSIYOebyWgDkWBuJDPrQFw8QYreq5T/rteSNQnJS1lAbg5vyLzexLMH7kq47OlCAnUlrI20mvGM71RuU6HlKJIlWIVlId5JZQF2ae0/A6BVZWh35+bQu+iPI1PXjrTVYqtmrV6N+vV8UaHRdKV6rCD648iJebynWZj4Gbgzqw7AX4RE6UwiX0Rgz9ZMM5Vzfgrgk8KxOmsuaP8Kgqf5KWeH/LDa+ocftU7zGz1jO5L999JptFIatsdPyZXnA3xM+QjzBW8w==';

/**
 * Netflix PlayReady Metering Certificate (Base64-encoded, chain format).
 * @type {string}
 */
export const PLAYREADY_METERING_CERT = 'Q0hBSQAAAAEAAAUMAAAAAAAAAAJDRVJUAAAAAQAAAfwAAAFsAAEAAQAAAFhr+y4Ydms5rTmj6bCCteW2AAAAAAAAAAAAAAAJzZtwNxHterM9CAoJYOM3CF9Tj0d9KND413a+UtNzRTb/////AAAAAAAAAAAAAAAAAAAAAAABAAoAAABU8vU0ozkqocBJMVIX2K4dugAAADZodHRwOi8vbnJkcC5uY2NwLm5ldGZsaXguY29tL3Jtc2RrL3JpZ2h0c21hbmFnZXIuYXNteAAAAAABAAUAAAAMAAAAAAABAAYAAABcAAAAAQABAgAAAAAAglDQ2GehCoNSsOaaB8zstNK0cCnf1+9gX8wM+2xwLlqJ1kyokCjt3F8P2NqXHM4mEU/G1T0HBBSI3j6XpKqzgAAAAAEAAAACAAAABwAAAEgAAAAAAAAACE5ldGZsaXgAAAAAH1BsYXlSZWFkeSBNZXRlcmluZyBDZXJ0aWZpY2F0ZQAAAAAABjIwMjQ4AAAAAAEACAAAAJAAAQBAU73up7T8eJYVK4UHuKYgMQIRbo0yf27Y5EPZRPmzkx1ZDMor7Prs77CAOU9S9k0RxpxPnqUwAKRPIVCe0aX2+AAAAgBb65FSx1oKG2r8AxQjio+UrYGLhvA7KMlxJBbPXosAV/CJufnIdUMSA0DhxD2W3eRLh2vHukIL4VH9guUcEBXsQ0VSVAAAAAEAAAL8AAACbAABAAEAAABYyTlnSi+jZfRvYL0rk9sVfwAAAAAAAAAAAAAABFNh3USSkWi88BlSM6PZ2gMuceJFJ9hzz0WzuCiwF9qv/////wAAAAAAAAAAAAAAAAAAAAAAAQAFAAAADAAAAAAAAQAGAAAAYAAAAAEAAQIAAAAAAFvrkVLHWgobavwDFCOKj5StgYuG8DsoyXEkFs9eiwBX8Im5+ch1QxIDQOHEPZbd5EuHa8e6QgvhUf2C5RwQFewAAAACAAAAAQAAAAwAAAAHAAABmAAAAAAAAACATWljcm9zb2Z0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAUGxheVJlYWR5IFNMMCBNZXRlcmluZyBSb290IENBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAMS4wLjAuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAIAAAAkAABAECsAomwQgNY0bm6U6Au9JRvwjbNnRzmVkZi+kg7npnRQ2T+4LgyrePBdBRQ3qb/jxXkn++4sOFa7vjRpFBzV0MMAAACAIZNYc/yJW5CLFaLPCgAHPs+FSdlhYS6BSG3mxgo2TbeHYJqj8Pm5/p6kNXKKUbx9kou+59dz/5+Q060QpP6xas=';

// ---------------------------------------------------------------------------
// Widevine service certificate (binary protobuf, Base64)
// ---------------------------------------------------------------------------

/**
 * Widevine CDM service certificate (Base64-encoded protobuf).
 * Set via `MediaKeys.setServerCertificate()` to enable privacy mode.
 * @type {string}
 */
export const WIDEVINE_SERVICE_CERT = 'Cr0CCAMSEOVEukALwQ8307Y2+LVP+0MYh/HPkwUijgIwggEKAoIBAQDm875btoWUbGqQD8eAGuBlGY+Pxo8YF1LQR+Ex0pDONMet8EHslcZRBKNQ/09RZFTP0vrYimyYiBmk9GG+S0wB3CRITgweNE15cD33MQYyS3zpBd4z+sCJam2+jj1ZA4uijE2dxGC+gRBRnw9WoPyw7D8RuhGSJ95OEtzg3Ho+mEsxuE5xg9LM4+Zuro/9msz2bFgJUjQUVHo5j+k4qLWu4ObugFmc9DLIAohL58UR5k0XnvizulOHbMMxdzna9lwTw/4SALadEV/CZXBmswUtBgATDKNqjXwokohncpdsWSauH6vfS6FXwizQoZJ9TdjSGC60rUB2t+aYDm74cIuxAgMBAAE6EHRlc3QubmV0ZmxpeC5jb20SgAOE0y8yWw2Win6M2/bw7+aqVuQPwzS/YG5ySYvwCGQd0Dltr3hpik98WijUODUr6PxMn1ZYXOLo3eED6xYGM7Riza8XskRdCfF8xjj7L7/THPbixyn4mULsttSmWFhexzXnSeKqQHuoKmerqu0nu39iW3pcxDV/K7E6aaSr5ID0SCi7KRcL9BCUCz1g9c43sNj46BhMCWJSm0mx1XFDcoKZWhpj5FAgU4Q4e6f+S8eX39nf6D6SJRb4ap7Znzn7preIvmS93xWjm75I6UBVQGo6pn4qWNCgLYlGGCQCUm5tg566j+/g5jvYZkTJvbiZFwtjMW5njbSRwB3W4CrKoyxw4qsJNSaZRTKAvSjTKdqVDXV/U5HK7SaBA6iJ981/aforXbd2vZlRXO/2S+Maa2mHULzsD+S5l4/YGpSt7PnkCe25F+nAovtl/ogZgjMeEdFyd/9YMYjOS4krYmwp3yJ7m9ZzYCQ6I8RQN4x/yLlHG5RH/+WNLNUs6JAZ0fFdCmw=';

/**
 * Extended Widevine service certificate (with certificate chain, Base64).
 * @type {string}
 */
export const WIDEVINE_SERVICE_CERT_EXTENDED = 'CAUSwwUKvQIIAxIQ5US6QAvBDzfTtjb4tU/7QxiH8c+TBSKOAjCCAQoCggEBAObzvlu2hZRsapAPx4Aa4GUZj4/GjxgXUtBH4THSkM40x63wQeyVxlEEo1D/T1FkVM/S+tiKbJiIGaT0Yb5LTAHcJEhODB40TXlwPfcxBjJLfOkF3jP6wIlqbb6OPVkDi6KMTZ3EYL6BEFGfD1ag/LDsPxG6EZIn3k4S3ODcej6YSzG4TnGD0szj5m6uj/2azPZsWAlSNBRUejmP6Tiota7g5u6AWZz0MsgCiEvnxRHmTRee+LO6U4dswzF3Odr2XBPD/hIAtp0RX8JlcGazBS0GABMMo2qNfCiSiGdyl2xZJq4fq99LoVfCLNChkn1N2NIYLrStQHa35pgObvhwi7ECAwEAAToQdGVzdC5uZXRmbGl4LmNvbRKAA4TTLzJbDZaKfozb9vDv5qpW5A/DNL9gbnJJi/AIZB3QOW2veGmKT3xaKNQ4NSvo/EyfVlhc4ujd4QPrFgYztGLNrxeyRF0J8XzGOPsvv9Mc9uLHKfiZQuy21KZYWF7HNedJ4qpAe6gqZ6uq7Se7f2JbelzENX8rsTpppKvkgPRIKLspFwv0EJQLPWD1zjew2PjoGEwJYlKbSbHVcUNygplaGmPkUCBThDh7p/5Lx5ff2d/oPpIlFvhqntmfOfumt4i+ZL3fFaObvkjpQFVAajqmfipY0KAtiUYYJAJSbm2DnrqP7+DmO9hmRMm9uJkXC2MxbmeNtJHAHdbgKsqjLHDiqwk1JplFMoC9KNMp2pUNdX9TkcrtJoEDqIn3zX9p+itdt3a9mVFc7/ZL4xpraYdQvOwP5LmXj9galK3s+eQJ7bkX6cCi+2X+iBmCMx4R0XJ3/1gxiM5LiStibCnfInub1nNgJDojxFA3jH/IuUcblEf/5Y0s1SzokBnR8V0KbA==';

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

/**
 * Detect the robustness level from a MediaKeySystemAccess configuration.
 *
 * @param {MediaKeySystemAccess} access - The resolved key system access object.
 * @returns {string|undefined} The matched robustness level, or undefined.
 */
export function detectRobustnessLevel(access) {
  const config = access.getConfiguration();
  return [HW_SECURE_ALL, SW_SECURE_DECODE, SW_SECURE_CRYPTO].find((level) => {
    return config.videoCapabilities?.some((cap) => cap.robustness === level);
  });
}

/**
 * Extract an HRESULT-style error code from an error message string.
 * Searches for patterns like `(hr=0x80000001)` or raw numeric codes.
 *
 * @param {string} message - Error message that may contain error codes.
 * @returns {number|undefined} The parsed numeric error code.
 */
export function extractErrorCode(message) {
  let result;
  try {
    // Try hr=XXXX pattern first
    const hrMatch = message.match(/\(hr=([0-9a-fA-F]+)\)/);
    if (hrMatch?.[1]) {
      const code = parseInt(hrMatch[1], 16);
      if (Number.isFinite(code)) return code;
    }

    // Fall back to any parenthesised numeric value
    const numPattern = /\((\d[^)]+)\)/g;
    let match;
    while ((match = numPattern.exec(message))) {
      const code = Number(match[1]);
      if (Number.isFinite(code)) result = code;
    }
  } catch (_) {
    /* ignore parse errors */
  }
  return result;
}

/**
 * Check whether a content-type string represents AV1 Main codec profile.
 *
 * @param {string} contentType - MIME type + codec string.
 * @returns {boolean}
 */
export function isAV1MainCodec(contentType) {
  // Uses CodecRegex from Module_22210
  return /av01\.0\.\d{2}M/.test(contentType);
}

/**
 * Build a unique key for a key-system + robustness pair.
 *
 * @param {{ keySystem: string, robustness?: string }} entry
 * @returns {string} Composite identifier.
 */
export function keySystemRobustnessKey(entry) {
  return entry.robustness ? `${entry.keySystem}.${entry.robustness}` : entry.keySystem;
}
