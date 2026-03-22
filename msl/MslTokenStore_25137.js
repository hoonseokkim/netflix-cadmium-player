/**
 * @file MslTokenStore_25137.js
 * @description MSL (Message Security Layer) base token store implementation.
 *              Manages authentication tokens, master tokens, user ID tokens,
 *              and service tokens. Handles token lifecycle: adding, removing,
 *              looking up, managing non-replayable IDs, and token bindings.
 *              This is the lower-level store (Module_25137) distinct from
 *              MslTokenStore.js which extends MslStore.
 * @module msl/MslTokenStore_25137
 * @original Module_25137
 */

// import MaxNonReplayableId from './MaxNonReplayableId';       // Module 51411
// import MslException from './MslException';                   // Module 10690
// import MslInternalException from './MslInternalException';   // Module 1966
// import MslError from './MslError';                           // Module 36114
// import { readBytes as isMslError } from './MslExceptionUtils'; // Module 32260

/**
 * Base in-memory token store for the MSL protocol.
 * Manages master tokens, their crypto contexts, user ID tokens,
 * service tokens, and non-replayable IDs.
 */
export class MslBaseTokenStore {
  constructor() {
    /** @type {Object<string, MasterToken>} Serialized token -> MasterToken */
    this.masterTokens = {};
    /** @type {Object<string, CryptoContext>} Serialized token -> CryptoContext */
    this.cryptoContexts = {};
    /** @type {Object<string, UserIdToken>} User ID -> UserIdToken */
    this.userIdTokens = {};
    /** @type {Object<number, number>} Serial number -> last non-replayable ID */
    this.nonReplayableIds = {};
    /** @type {Object<string, ServiceToken>} Unbound service tokens */
    this.unboundServiceTokens = {};
    /** @type {Object<number, Object<string, ServiceToken>>} Master-bound tokens */
    this.masterBoundServiceTokens = {};
    /** @type {Object<number, Object<string, ServiceToken>>} User-bound tokens */
    this.userBoundServiceTokens = {};
  }

  /**
   * Add or remove a master token with its crypto context.
   * @param {MasterToken} masterToken
   * @param {CryptoContext} [cryptoContext] - If omitted, the token is removed.
   */
  addMasterToken(masterToken, cryptoContext) {
    if (cryptoContext) {
      const key = masterToken.serialize();
      this.masterTokens[key] = masterToken;
      this.cryptoContexts[key] = cryptoContext;
    } else {
      this._removeMasterToken(masterToken);
    }
  }

  /**
   * @returns {MasterToken|null} The newest master token, or null.
   */
  getNewestMasterToken() {
    let newest = null;
    for (const key in this.masterTokens) {
      const token = this.masterTokens[key];
      if (!newest || token.isNewerThan(newest)) newest = token;
    }
    return newest;
  }

  /**
   * Increment and return the next non-replayable ID.
   * @param {MasterToken} masterToken
   * @returns {number}
   */
  getNextNonReplayableId(masterToken) {
    const serial = masterToken.SerialNumber;
    let id = this.nonReplayableIds[serial] ?? 0;
    if (id < 0 || id > MAX_NON_REPLAYABLE_ID) {
      throw new MslException(`Non-replayable ID ${id} is outside the valid range.`);
    }
    const next = id === MAX_NON_REPLAYABLE_ID ? 0 : id + 1;
    this.nonReplayableIds[serial] = next;
    return next;
  }

  /**
   * @param {MasterToken} masterToken
   * @returns {CryptoContext|undefined}
   */
  getCryptoContext(masterToken) {
    return this.cryptoContexts[masterToken.serialize()];
  }

  /** @private */
  _removeMasterToken(masterToken) {
    const key = masterToken.serialize();
    if (!this.masterTokens[key]) return;
    const serial = masterToken.SerialNumber;

    for (const k in this.masterTokens) {
      const t = this.masterTokens[k];
      if (!t.equals(masterToken) && t.SerialNumber === serial) {
        delete this.masterTokens[key];
        delete this.cryptoContexts[key];
        return;
      }
    }

    Object.keys(this.userIdTokens).forEach((k) => {
      if (this.userIdTokens[k].isBoundTo(masterToken)) {
        this._removeUserIdToken(this.userIdTokens[k]);
      }
    });

    try {
      this._removeServiceTokens(null, masterToken, null);
    } catch (err) {
      if (isMslError(err)) {
        throw new MslException("Unexpected exception removing master-bound service tokens.", err);
      }
      throw err;
    }

    delete this.nonReplayableIds[serial];
    delete this.masterTokens[key];
    delete this.cryptoContexts[key];
  }

  /** Clear all stored tokens. @private */
  _clearAll() {
    [this.masterTokens, this.cryptoContexts, this.nonReplayableIds,
     this.userIdTokens, this.userBoundServiceTokens, this.masterBoundServiceTokens
    ].forEach((m) => { for (const k in m) delete m[k]; });
  }

  /**
   * Add a user ID token bound to a master token.
   * @param {string} userId
   * @param {UserIdToken} userIdToken
   */
  addUserIdToken(userId, userIdToken) {
    let bound = false;
    for (const k in this.masterTokens) {
      if (userIdToken.isBoundTo(this.masterTokens[k])) { bound = true; break; }
    }
    if (!bound) {
      throw new MslInternalException(MslError.USERIDTOKEN_MASTERTOKEN_MISMATCH,
        `uit mtserialnumber ${userIdToken.serialNumber}`);
    }
    this.userIdTokens[userId] = userIdToken;
  }

  /** @param {string} userId @returns {UserIdToken|undefined} */
  getUserIdToken(userId) { return this.userIdTokens[userId]; }

  /** @private */
  _removeUserIdToken(userIdToken) {
    let boundMaster = null;
    for (const k in this.masterTokens) {
      if (userIdToken.isBoundTo(this.masterTokens[k])) { boundMaster = this.masterTokens[k]; break; }
    }
    Object.keys(this.userIdTokens).forEach((k) => {
      if (this.userIdTokens[k].equals(userIdToken)) {
        try { this._removeServiceTokens(null, boundMaster, userIdToken); }
        catch (err) {
          if (isMslError(err)) throw new MslException("Unexpected exception removing user-bound service tokens.", err);
          throw err;
        }
        delete this.userIdTokens[k];
      }
    });
  }

  /**
   * Store service tokens after validating bindings.
   * @param {ServiceToken[]} tokens
   */
  storeServiceTokens(tokens) {
    tokens.forEach((t) => {
      if (t.isMasterTokenBound()) {
        let ok = false;
        for (const k in this.masterTokens) if (t.isBoundTo(this.masterTokens[k])) { ok = true; break; }
        if (!ok) throw new MslInternalException(MslError.SERVICETOKEN_MASTERTOKEN_MISMATCH, `st mtserialnumber ${t.serialNumber}`);
      }
      if (t.isUserIdTokenBound()) {
        let ok = false;
        for (const k in this.userIdTokens) if (t.isBoundTo(this.userIdTokens[k])) { ok = true; break; }
        if (!ok) throw new MslInternalException(MslError.SERVICETOKEN_USERIDTOKEN_MISMATCH, `st uitserialnumber ${t.userSerialNumber}`);
      }
    });
    tokens.forEach((t) => {
      if (t.isUnbound()) {
        this.unboundServiceTokens[t.serialize()] = t;
      } else {
        if (t.isMasterTokenBound()) {
          const b = this.masterBoundServiceTokens[t.serialNumber] || {};
          b[t.serialize()] = t;
          this.masterBoundServiceTokens[t.serialNumber] = b;
        }
        if (t.isUserIdTokenBound()) {
          const b = this.userBoundServiceTokens[t.userSerialNumber] || {};
          b[t.serialize()] = t;
          this.userBoundServiceTokens[t.userSerialNumber] = b;
        }
      }
    });
  }

  /**
   * Get matching service tokens.
   * @param {MasterToken} [masterToken]
   * @param {UserIdToken} [userIdToken]
   * @returns {ServiceToken[]}
   */
  getServiceTokens(masterToken, userIdToken) {
    if (userIdToken) {
      if (!masterToken) throw new MslInternalException(MslError.USERIDTOKEN_MASTERTOKEN_MISSING);
      if (!userIdToken.isBoundTo(masterToken))
        throw new MslInternalException(MslError.USERIDTOKEN_MASTERTOKEN_MISMATCH,
          `uit mtserialnumber ${userIdToken.serialNumber}; mt ${masterToken.SerialNumber}`);
    }
    const result = {};
    for (const k in this.unboundServiceTokens) { const t = this.unboundServiceTokens[k]; result[t.serialize()] = t; }
    if (masterToken) {
      const mb = this.masterBoundServiceTokens[masterToken.SerialNumber];
      if (mb) for (const k in mb) { const t = mb[k]; if (!t.isUserIdTokenBound()) result[k] = t; }
    }
    if (userIdToken) {
      const ub = this.userBoundServiceTokens[userIdToken.SerialNumber];
      if (ub) for (const k in ub) { const t = ub[k]; if (t.isBoundTo(masterToken)) result[k] = t; }
    }
    return Object.values(result);
  }

  /** @private */
  _removeServiceTokens(name, masterToken, userIdToken) {
    if (userIdToken && masterToken && !userIdToken.isBoundTo(masterToken))
      throw new MslInternalException(MslError.USERIDTOKEN_MASTERTOKEN_MISMATCH,
        `uit mtserialnumber ${userIdToken.serialNumber}; mt ${masterToken.SerialNumber}`);

    if (name && !masterToken && !userIdToken) {
      Object.keys(this.unboundServiceTokens).forEach((k) => {
        if (this.unboundServiceTokens[k].name === name) delete this.unboundServiceTokens[k];
      });
    }
    if (masterToken && !userIdToken) {
      const b = this.masterBoundServiceTokens[masterToken.SerialNumber];
      if (b) { Object.keys(b).forEach((k) => { if (!name || b[k].name === name) delete b[k]; }); }
    }
    if (userIdToken) {
      const b = this.userBoundServiceTokens[userIdToken.SerialNumber];
      if (b) { Object.keys(b).forEach((k) => { if (!name || b[k].name === name) delete b[k]; }); }
    }
  }
}
