/**
 * Netflix Cadmium Player -- DrmInitDataPssh
 *
 * Pre-built PSSH (Protection System Specific Header) init-data blobs
 * used for key-system validation during the capability-probing phase.
 *
 * When the player discovers available key systems, it optionally
 * performs a "dry-run" license cycle using these test PSSH boxes to
 * confirm that the CDM can actually generate a request.  The PSSH
 * data contains placeholder/test key IDs.
 *
 * Original: Webpack Module 84218
 *
 * @module drm/DrmInitDataPssh
 */

/**
 * Widevine test PSSH box (Base64-encoded).
 *
 * System ID: EDEF8BA9-79D6-4ACE-A3C8-27DCD51D21ED (Widevine)
 * Contains a single all-zero key ID for validation purposes.
 *
 * @type {string[]}
 */
export const WIDEVINE_TEST_PSSH = [
  'AAAANHBzc2gAAAAA7e+LqXnWSs6jyCfc1R0h7QAAABQIARIQAAAAAAPSZ0kAAAAAAAAAAA==',
];

/**
 * FairPlay test init-data (Base64-encoded SKD URLs).
 *
 * These are `skd://netflix/` protocol URIs containing test key
 * material used to validate FairPlay streaming capability.
 *
 * @type {string[]}
 */
export const FAIRPLAY_TEST_INIT_DATA = [
  'c2tkOi8vbmV0ZmxpeC9BQUFBQkFBQUFBQUV3MzFBcDVKNTB0Qml4WTVMaTNYSGJFc3dKdDdybTdhdEExVWpPMkw3Q1ArckJYTT0=',
  'c2tkOi8vbmV0ZmxpeC9BQUFBQkFBQUFBQUV3MzFCczgwL0dQUmxsNXEweHl3bHhac1Nya3hjMndPRHZpWWNCMmJoWDdQOTNHQT0=',
  'c2tkOi8vbmV0ZmxpeC9BQUFBQkFBQUFBQUV3MzFDcWNFL25GeU0waXVKY1pKSi9xTkl3T0xJaGFCdnB4WEpDNGtyV2VpaGJBOD0=',
  'c2tkOi8vbmV0ZmxpeC9BQUFBQkFBQUFBQUV3MzFFamVRbC8rZTBLYWpjSEhZQkt1U0hkb21BdXhmSGlWUTNZYTFpRGJqYjF5Zz0=',
];

/**
 * PlayReady test PSSH box (Base64-encoded).
 *
 * System ID: 9A04F079-9840-4286-AB92-E65BE0885F95 (PlayReady)
 * Contains a PlayReady Header Object (PRO) with:
 *   - AES-CTR encrypted key ID
 *   - License acquisition URL pointing to Netflix rights manager
 *   - LUI URL for PlayReady UI interactions
 *
 * @type {string[]}
 */
export const PLAYREADY_TEST_PSSH = [
  'AAADPHBzc2gAAAAAmgTweZhAQoarkuZb4IhflQAAAxwcAwAAAQABABIDPABXAFIATQBIAEUAQQBEAEUAUgAgAHgAbQBsAG4AcwA9ACIAaAB0AHQAcAA6AC8ALwBzAGMAaABlAG0AYQBzAC4AbQBpAGMAcgBvAHMAbwBmAHQALgBjAG8AbQAvAEQAUgBNAC8AMgAwADAANwAvADAAMwAvAFAAbABhAHkAUgBlAGEAZAB5AEgAZQBhAGQAZQByACIAIAB2AGUAcgBzAGkAbwBuAD0AIgA0AC4AMgAuADAALgAwACIAPgA8AEQAQQBUAEEAPgA8AFAAUgBPAFQARQBDAFQASQBOAEYATwA+ADwASwBJAEQAUwA+ADwASwBJAEQAIABBAEwARwBJAEQAPQAiAEEARQBTAEMAVABSACIAIABWAEEATABVAEUAPQAiAEEAQQBBAEEAQQBNAFkARQB4AEkARQBBAEEAQQBBAEEAQQBBAEEAQQBBAEEAPQA9ACIAPgA8AC8ASwBJAEQAPgA8AC8ASwBJAEQAUwA+ADwALwBQAFIATwBUAEUAQwBUAEkATgBGAE8APgA8AEwAQQBfAFUAUgBMAD4AaAB0AHQAcAA6AC8ALwBjAGEAcABwAHIAcwB2AHIAMAA2AC8AcwBpAGwAdgBlAHIAbABpAGcAaAB0ADUALwByAGkAZwBoAHQAcwBtAGEAbgBhAGcAZQByAC4AYQBzAG0AeAA8AC8ATABBAF8AVQBSAEwAPgA8AEwAVQBJAF8AVQBSAEwAPgBoAHQAdABwADoALwAvAGMAYQBwAHAAcgBzAHYAcgAwADYALwBzAGkAbAB2AGUAcgBsAGkAZwBoAHQANQAvAHIAaQBnAGgAdABzAG0AYQBuAGEAZwBlAHIALgBhAHMAbQB4ADwALwBMAFUASQBfAFUAUgBMAD4APABEAEUAQwBSAFkAUABUAE8AUgBTAEUAVABVAFAAPgBPAE4ARABFAE0AQQBOAEQAPAAvAEQARQBDAFIAWQBQAFQATwBSAFMARQBUAFUAUAA+ADwALwBEAEEAVABBAD4APAAvAFcAUgBNAEgARQBBAEQARQBSAD4A',
];
