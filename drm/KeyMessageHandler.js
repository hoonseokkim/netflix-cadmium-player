/**
 * @file KeyMessageHandler.js
 * @description Handles EME (Encrypted Media Extensions) key messages and responses.
 *              Processes key request messages from the CDM (Content Decryption Module),
 *              formats them into license challenge payloads, and parses license responses
 *              back into key mappings. Supports both single-key and multi-key (HEVC) scenarios.
 * @module drm/KeyMessageHandler
 * @original Module_8265
 */

import { __decorate, __param } from 'tslib'; // Module 22970
import { injectable, injectDecorator } from 'inversify'; // Module 22674
import { ea as ErrorCodes, EventTypeEnum } from '../core/ErrorCodes'; // Module 36129
import { dP as ByteConverterToken } from '../core/CadmiumError'; // Module 6405
import { zG as Base64Token } from '../crypto/CryptoBarrelExports'; // Module 84408
import { wk as PlaybackError } from '../core/PlaybackError'; // Module 61731
import { promiseTimerSymbol } from '../timing/RootTaskScheduler'; // Module 59818
import { keyMap as KeyMapToken } from '../crypto/KeyFormat'; // Module 2248
import { ZF, bFa } from '../media/HevcProfileConfig'; // Module 82100
import { aHa as KEY_MESSAGE_TYPE_LICENSE_REQUEST, $Ga as KEY_MESSAGE_TYPE_INDIVIDUALIZATION } from '../drm/EmeConstants'; // Module 97737
import { we as DrmError } from '../drm/DrmState'; // Module 31149
import { nativeProcessor as NativeProcessorToken } from '../core/DeviceCapabilitiesConfig'; // Module 7605
import { ama as KeyIdMapper } from '../drm/KeySystemIds'; // Module 47450

/**
 * Handles EME key message processing: parsing CDM messages into license challenges
 * and parsing license responses into key ID mappings.
 *
 * @injectable
 */
export class KeyMessageHandler {
  /**
   * @param {Object} byteConverter - Converts between byte formats (hex/int)
   * @param {Object} base64Codec - Base64 encode/decode operations
   * @param {Object} textCodec - Text encode/decode (UTF-8 <-> ArrayBuffer)
   * @param {Object} versionConfig - Feature flags (e.g., enableHEVC)
   */
  constructor(byteConverter, base64Codec, textCodec, versionConfig) {
    /** @type {Object} Byte format converter */
    this._byteConverter = byteConverter;

    /** @type {Object} Base64 codec */
    this._base64Codec = base64Codec;

    /** @type {Object} Text encoder/decoder */
    this._textCodec = textCodec;

    /** @type {Object} Version/feature configuration */
    this._versionConfig = versionConfig;
  }

  /**
   * Whether the platform supports persistent sessions.
   * @returns {boolean} Always false for this handler
   */
  supportsPersistentSessions() {
    return false;
  }

  /**
   * Whether the platform supports session load.
   * @returns {boolean} Always false for this handler
   */
  supportsSessionLoad() {
    return false;
  }

  /**
   * Whether the platform supports secure stop.
   * @returns {boolean} Always true for this handler
   */
  supportsSecureStop() {
    return true;
  }

  /**
   * Returns the default DRM scheme identifier.
   * @returns {*}
   */
  getDefaultDrmScheme() {
    return ZF;
  }

  /**
   * Decodes the DRM scheme from a profile string.
   * @returns {*}
   */
  decodeDrmScheme() {
    return this._base64Codec.decode(bFa);
  }

  /**
   * Returns additional key system configurations (empty by default).
   * @returns {Array}
   */
  getAdditionalKeySystemConfigs() {
    return [];
  }

  /**
   * Pre-processes a key session before use (no-op by default).
   * @param {Object} session - The EME session
   */
  initializeSession(session) {
    session.initiating();
  }

  /**
   * Parses an EME key message event into a structured license request.
   * Handles both license-request and individualization message types.
   *
   * @param {MediaKeyMessageEvent} messageEvent - The EME key message event
   * @returns {Object} Parsed message with type, sessionId, challenges, messageType, and keyIds
   * @throws {DrmError} If the message payload is empty
   */
  parseKeyMessage(messageEvent) {
    let challenges = [];
    let keyIds;

    if (messageEvent.messageType === KEY_MESSAGE_TYPE_LICENSE_REQUEST ||
        messageEvent.messageType === KEY_MESSAGE_TYPE_INDIVIDUALIZATION) {

      if (messageEvent.messageType === KEY_MESSAGE_TYPE_LICENSE_REQUEST) {
        const decoded = this._textCodec.encode(new Uint8Array(messageEvent.message));
        const parsed = JSON.videoSampleEntry(decoded);
        keyIds = parsed.map((entry) => entry.keyID);
        challenges = parsed.map((entry) => entry.payload);
      } else {
        challenges = [this._base64Codec.encode(new Uint8Array(messageEvent.message))];
      }

      if (challenges.length === 0 || !challenges.every((c) => c && c.length)) {
        throw new DrmError(ErrorCodes.EME_KEYMESSAGE_EMPTY);
      }

      challenges = this._buildChallengePayload(challenges);
      challenges = this._textCodec.decode(JSON.stringify(challenges));
    } else {
      challenges = new Uint8Array(messageEvent.message);
    }

    return {
      type: messageEvent.type,
      drmSessionId: messageEvent.target.drmSessionId,
      ET: [challenges],
      messageType: messageEvent.messageType,
      keyIds,
    };
  }

  /**
   * Creates an error object from a key error event.
   * @param {Event} errorEvent - The EME error event
   * @returns {PlaybackError}
   */
  createKeyError(errorEvent) {
    const mediaError = errorEvent.target?.error;
    let systemCode, errorCode;

    if (mediaError) {
      systemCode = mediaError.systemCode;
      errorCode = mediaError.code;
    }

    const error = new PlaybackError(
      ErrorCodes.PLAY_MSE_EVENT_KEYERROR,
      errorEvent instanceof promiseTimerSymbol ? EventTypeEnum.EME_TIMEOUT : EventTypeEnum.EME_MEDIA_KEYERR_BASE,
      systemCode ? this._byteConverter.internal_Ora(systemCode, 4) : errorCode,
      '',
      mediaError
    );
    error.zaa(errorEvent);
    return error;
  }

  /**
   * Wraps challenge data into the versioned challenge format.
   * @param {Array<Uint8Array>} challenges - Individual challenge payloads
   * @returns {Object} Versioned challenge payload
   * @private
   */
  _buildChallengePayload(challenges) {
    const formatted = challenges.map((payload, index) => ({
      ID: KeyIdMapper.zCc(index),
      PAYLOAD: payload,
    }));

    return {
      VERSION: this._versionConfig.enableHEVC ? 3 : 1,
      CHALLENGES: formatted,
    };
  }

  /**
   * Extracts key ID mappings from a license server response.
   * Maps response key IDs back to the original challenge key IDs.
   *
   * @param {Array} originalKeyIds - Key IDs from the original challenge
   * @param {Array<Uint8Array>} [responseData] - Raw license response
   * @returns {Array<{from: Uint8Array, to: Uint8Array}>|undefined} Key ID mappings
   * @throws {PlaybackError} If response parsing fails
   */
  extractKeyMappings(originalKeyIds, responseData) {
    if (!responseData || !this._versionConfig.enableHEVC) return undefined;

    try {
      const decoded = this._textCodec.encode(responseData[0]);
      const parsed = JSON.videoSampleEntry(decoded);

      return parsed.RESPONSES
        .sort((a, b) => (a.ID > b.ID ? 1 : -1))
        .map((response) => {
          const index = KeyIdMapper.qUb(response.ID);
          const fromKey = this._base64Codec.decode(response.DHB).subarray(4, 12);
          const toKey = this._base64Codec.decode(originalKeyIds[index]).subarray(0, 8);
          return { from: fromKey, to: toKey };
        });
    } catch (error) {
      throw new PlaybackError(
        ErrorCodes.PLAY_MSE_EME_KEY_MAPPING_EXCEPTION,
        undefined, undefined, undefined, error
      );
    }
  }
}
