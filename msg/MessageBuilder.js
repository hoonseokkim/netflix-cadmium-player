/**
 * Netflix Cadmium Player — MSL Message Builder
 *
 * Builds MSL (Message Security Layer) message objects, managing message IDs,
 * service tokens, master tokens, user ID tokens, key exchange data, and
 * crypto context resolution.  Part of Netflix's custom secure messaging
 * protocol used for DRM license exchange and authenticated API requests.
 *
 * @module MessageBuilder
 */

// Dependencies
// import MaxMessageId from './modules/Module_51411';          // max message ID constant
// import MslError from './modules/Module_10690';              // MSL error class
// import asyncExecutor from './modules/Module_42979';         // async execution wrapper
// import MslErrorCode from './modules/Module_36114';          // error code constants
// import MslException from './modules/Module_20754';          // MSL exception class
// import { MessageHeader as MessageHeader, MessageCapabilities as MessageCapabilities, SZ as sendMessage } from './modules/Module_54449';
// import defaultMessageId from './modules/Module_32260';      // message ID utilities
// import { readBytes as isMslError } from './modules/Module_32260';

/**
 * Increments a message ID, wrapping around at the maximum value.
 *
 * @param {number} messageId - Current message ID (0 to MaxMessageId).
 * @returns {number} The next message ID.
 * @throws {MslError} If the message ID is out of range.
 */
export function incrementMessageId(messageId) {
  if (messageId < 0 || messageId > MaxMessageId.kf) {
    throw new MslError(`Message ID ${messageId} is outside the valid range.`);
  }
  return messageId === MaxMessageId.kf ? 0 : messageId + 1;
}

/**
 * Decrements a message ID, wrapping around at zero.
 *
 * @param {number} messageId - Current message ID (0 to MaxMessageId).
 * @returns {number} The previous message ID.
 * @throws {MslError} If the message ID is out of range.
 */
export function decrementMessageId(messageId) {
  if (messageId < 0 || messageId > MaxMessageId.kf) {
    throw new MslError(`Message ID ${messageId} is outside the valid range.`);
  }
  return messageId === 0 ? MaxMessageId.kf : messageId - 1;
}

/**
 * Builds an MSL message with headers, service tokens, crypto contexts,
 * and key exchange data.
 */
export class MessageBuilder {
  /**
   * @param {object} decoderState  - MSL decoder/encoder state.
   * @param {*} sendType           - Message send type.
   * @param {*} receiveType        - Message receive type.
   * @param {number} [messageId]   - Optional explicit message ID.
   * @param {object} callback      - Async callback context.
   */
  constructor(decoderState, sendType, receiveType, messageId, callback) {
    asyncExecutor(callback, () => {
      if (messageId === undefined || messageId === null) {
        messageId = defaultMessageId.decode(decoderState);
      } else if (messageId < 0 || messageId > MaxMessageId.kf) {
        throw new MslError(`Message ID ${messageId} is outside the valid range.`);
      }

      decoderState.nsa({
        result: (cryptoContext) => {
          asyncExecutor(callback, () => {
            this.#initialize(decoderState, messageId, decoderState.EG, cryptoContext, sendType, receiveType, null);
            return this;
          });
        },
        error: callback.error,
      });
    });
  }

  /**
   * Initializes the message builder's internal state.
   * @private
   */
  #initialize(decoderState, messageId, entityAuthData, cryptoContext, sendType, receiveType, serviceTokens) {
    /** @type {Array} Decoded service tokens from master/user tokens. */
    const tokens = [];
    const decoded = decoderState.decoderMap.decodeMessage(sendType, receiveType);
    tokens.push(...decoded);

    if (serviceTokens) {
      serviceTokens.forEach((token) => {
        if (token.itemsListProcessor() && !token.hasStartedCheck(sendType)) {
          throw new MslException(MslErrorCode.hKa, `st ${token}; mt ${sendType}`).qc(sendType);
        }
        if (token.hasStarted() && !token.hasStartedCheck(receiveType)) {
          throw new MslException(MslErrorCode.iKa, `st ${token}; uit ${receiveType}`).qc(sendType).getLength(receiveType);
        }
        tokens.push(token);
      });
    }

    /** @private */ this.decoderState = decoderState;
    /** @private */ this.cryptoContext = cryptoContext;
    /** @private */ this.masterToken = sendType;
    /** @private */ this.messageId = messageId;
    /** @private */ this.entityAuthData = entityAuthData;
    /** @private */ this.keyExchangeData = null;
    /** @private */ this.isNonReplayableFlag = false;
    /** @private */ this.isRenewableFlag = false;
    /** @private */ this.isHandshakeFlag = false;
    /** @private */ this.keyRequestData = {};
    /** @private */ this.customData = null;
    /** @private */ this.userIdToken = receiveType;
    /** @private @type {Array} */ this.serviceTokens = tokens;
    /** @private */ this.peerUserIdToken = null;
    /** @private */ this.peerMasterToken = null;
    /** @private */ this.peerServiceTokens = [];
  }

  /**
   * Returns the current message ID.
   * @returns {number}
   */
  getMessageId() {
    return this.messageId;
  }

  /**
   * Sets the message ID.
   * @param {number} id - New message ID.
   * @returns {this}
   * @throws {MslError} If the ID is out of range.
   */
  setMessageId(id) {
    if (id < 0 || id > MaxMessageId.kf) {
      throw new MslError(`Message ID ${id} is out of range.`);
    }
    this.messageId = id;
    return this;
  }

  /**
   * Returns the master token.
   * @returns {*}
   */
  getMasterToken() {
    return this.masterToken;
  }

  /**
   * Returns the user ID token.
   * @returns {*}
   */
  getUserIdToken() {
    return this.userIdToken;
  }

  /**
   * Returns the master token or the crypto context's entity auth data as fallback.
   * @returns {*}
   */
  getAuthTokenOrEntityAuth() {
    return this.masterToken || this.cryptoContext.scheme.bra;
  }

  /**
   * Returns the master token, key exchange data token, or entity auth as fallback.
   * @returns {*}
   */
  getAuthTokenOrKeyExchangeOrEntityAuth() {
    return this.masterToken || this.keyExchangeData || this.cryptoContext.scheme.bra;
  }

  /**
   * Returns the master token or the crypto context's peer entity auth.
   * @returns {*}
   */
  getPeerAuthTokenOrEntityAuth() {
    return this.masterToken || this.cryptoContext.scheme.OOb;
  }

  /**
   * Returns the master token, key exchange data, or peer entity auth as fallback.
   * @returns {*}
   */
  getPeerAuthTokenOrKeyExchangeOrEntityAuth() {
    return this.masterToken || this.keyExchangeData || this.cryptoContext.scheme.OOb;
  }

  /**
   * Builds the final message header and sends it.
   * @param {object} callback - Async callback context with `result` and `error`.
   */
  getStreamHeader(callback) {
    asyncExecutor(callback, () => {
      const keyResponseData = this.keyExchangeData
        ? this.keyExchangeData.keyResponseData
        : null;

      const keyRequests = Object.values(this.keyRequestData);

      let nonReplayableIdToken = null;
      if (this.isNonReplayableFlag) {
        if (!this.masterToken) {
          throw new MslException(MslErrorCode.v3b);
        }
        nonReplayableIdToken = this.decoderState.decoderMap.byc(this.masterToken);
      }

      const header = new MessageHeader(
        this.messageId,
        nonReplayableIdToken,
        this.isRenewableFlag,
        this.isHandshakeFlag,
        this.entityAuthData,
        keyRequests,
        keyResponseData,
        this.customData,
        this.userIdToken,
        this.serviceTokens,
      );

      const capabilities = new MessageCapabilities(
        this.peerMasterToken,
        this.peerUserIdToken,
        this.peerServiceTokens,
      );

      this.#sendMessage(this.decoderState, this.cryptoContext, this.masterToken, header, capabilities, callback);
    });
  }

  /**
   * Sends the built message.
   * @private
   */
  #sendMessage(decoderState, cryptoContext, masterToken, header, capabilities, callback) {
    sendMessage(decoderState, cryptoContext, masterToken, header, capabilities, callback);
  }

  /**
   * Returns whether the message is non-replayable.
   * @returns {boolean}
   */
  isNonReplayable() {
    return this.isNonReplayableFlag;
  }

  /**
   * Sets the non-replayable flag. Disables handshake when enabled.
   * @param {boolean} value
   */
  setNonReplayable(value) {
    this.isNonReplayableFlag = value;
    if (value) {
      this.isHandshakeFlag = false;
    }
  }

  /**
   * Returns whether the message is renewable.
   * @returns {boolean}
   */
  isRenewable() {
    return this.isRenewableFlag;
  }

  /**
   * Sets the renewable flag. Disables handshake when disabled.
   * @param {boolean} value
   */
  setRenewable(value) {
    this.isRenewableFlag = value;
    if (!value) {
      this.isHandshakeFlag = false;
    }
  }

  /**
   * Returns whether this is a handshake message.
   * @returns {boolean}
   */
  isHandshake() {
    return this.isHandshakeFlag;
  }

  /**
   * Sets the handshake flag. Enables non-replayable=false and renewable=true.
   * @param {boolean} value
   */
  setHandshake(value) {
    if (this.isHandshakeFlag = value) {
      this.isNonReplayableFlag = false;
      this.isRenewableFlag = true;
    }
  }

  /**
   * Sets the master token and user ID token, re-deriving service tokens.
   *
   * @param {*} masterToken  - New master token.
   * @param {*} userIdToken  - New user ID token (must be bound to master token).
   * @throws {MslError} If the user ID token is not bound to the master token.
   */
  setAuthTokens(masterToken, userIdToken) {
    if (userIdToken && !userIdToken.hasStartedCheck(masterToken)) {
      throw new MslError("User ID token must be bound to master token.");
    }
    if (this.keyExchangeData) {
      throw new MslError("Attempt to set message builder master token when key exchange data exists as a trusted network server.");
    }

    let newTokens;
    try {
      newTokens = this.decoderState.decoderMap.decodeMessage(masterToken, userIdToken);
    } catch (error) {
      if (isMslError(error)) {
        throw new MslError("Invalid master token and user ID token combination despite checking above.", error);
      }
      throw error;
    }

    // Remove service tokens not bound to the new master/user tokens
    for (let i = this.serviceTokens.length - 1; i >= 0; --i) {
      const token = this.serviceTokens[i];
      if ((token.hasStarted() && !token.hasStartedCheck(userIdToken)) ||
          (token.itemsListProcessor() && !token.hasStartedCheck(masterToken))) {
        this.serviceTokens.splice(i, 1);
      }
    }

    // Add newly derived tokens
    newTokens.forEach((token) => {
      this.#removeMatchingToken(token.name, token.itemsListProcessor(), token.hasStarted());
      this.serviceTokens.push(token);
    });

    this.masterToken = masterToken;
    this.userIdToken = userIdToken;
    if (!userIdToken) {
      this.customData = null;
    }
  }

  /**
   * Sets custom data on the message.
   * @param {*} data - Custom data payload.
   * @returns {this}
   */
  setCustomData(data) {
    this.customData = data;
    return this;
  }

  /**
   * Adds a key request data entry.
   * @param {object} keyRequest - Key request with a `serialize()` method.
   */
  addKeyRequestData(keyRequest) {
    this.keyRequestData[keyRequest.serialize()] = keyRequest;
  }

  /**
   * Adds a service token, validating it against the current master/user tokens.
   *
   * @param {object} token - The service token to add.
   * @throws {MslException} If the token is not properly bound.
   */
  addServiceToken(token) {
    const boundMasterToken = this.keyExchangeData
      ? this.keyExchangeData.keyResponseData.mc
      : this.masterToken;

    if (token.itemsListProcessor() && !token.hasStartedCheck(boundMasterToken)) {
      throw new MslException(MslErrorCode.hKa, `st ${token}; mt ${boundMasterToken}`).qc(boundMasterToken);
    }
    if (token.hasStarted() && !token.hasStartedCheck(this.userIdToken)) {
      throw new MslException(MslErrorCode.iKa, `st ${token}; uit ${this.userIdToken}`).qc(boundMasterToken).getLength(this.userIdToken);
    }

    this.#removeMatchingToken(token.name, token.itemsListProcessor(), token.hasStarted());
    this.serviceTokens.push(token);
  }

  /**
   * Removes existing service tokens that match the given name and binding properties.
   * @private
   */
  #removeMatchingToken(...args) {
    let name, isMasterBound, isUserBound;

    if (args.length === 1) {
      const token = args[0];
      name = token.name;
      isMasterBound = token.itemsListProcessor();
      isUserBound = token.hasStarted();
    } else {
      [name, isMasterBound, isUserBound] = args;
    }

    for (let i = this.serviceTokens.length - 1; i >= 0; --i) {
      const existing = this.serviceTokens[i];
      if (existing.name === name &&
          existing.itemsListProcessor() === isMasterBound &&
          existing.hasStarted() === isUserBound) {
        this.serviceTokens.splice(i, 1);
      }
    }
  }

  /**
   * Returns a copy of the current service tokens.
   * @returns {Array}
   */
  getServiceTokens() {
    return [...this.serviceTokens];
  }
}

/**
 * Creates a new MessageBuilder instance (convenience factory).
 *
 * @param {object} decoderState - MSL decoder state.
 * @param {*} sendType          - Send type.
 * @param {*} receiveType       - Receive type.
 * @param {number} [messageId]  - Optional message ID.
 * @param {object} callback     - Async callback.
 */
export function createMessageBuilder(decoderState, sendType, receiveType, messageId, callback) {
  new MessageBuilder(decoderState, sendType, receiveType, messageId, callback);
}
