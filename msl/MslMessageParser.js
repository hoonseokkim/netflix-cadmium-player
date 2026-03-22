/**
 * @module MslMessageParser
 * @description Parses incoming MSL (Message Security Layer) messages.
 * Handles the top-level message structure: extracts entity auth data,
 * master token, header data, error data, and signature fields.
 * Delegates to header or error parsers depending on message type.
 *
 * @original Module_58511
 */

// import AsyncExecutor from './AsyncExecutor';             // Module 42979
// import MslEncoderException from './MslEncoderException'; // Module 6838
// import MslEncodingException from './MslEncodingException'; // Module 88257
// import { parseEntityAuthData } from '...';               // Module 58768
// import { verifyMasterToken } from '...';                 // Module 58892
// import MslException from './MslException';               // Module 20754
// import MslError from './MslError';                       // Module 36114
// import { parseHeaderData } from '...';                   // Module 54449
// import { parseErrorData } from '...';                    // Module 70390

/**
 * MSL message field names.
 * @enum {string}
 */
export const MslMessageFields = {
  ENTITY_AUTH_DATA: 'entityauthdata',
  MASTER_TOKEN: 'mastertoken',
  HEADER_DATA: 'headerdata',
  ERROR_DATA: 'errordata',
  SIGNATURE: 'signature',
};

/**
 * Parses an MSL message from its encoded representation.
 *
 * Extracts the entity authentication data and/or master token, verifies
 * the signature, then delegates to either the header data parser or the
 * error data parser depending on which fields are present.
 *
 * @param {Object} mslContext - The MSL context (crypto, entity auth schemes, etc.).
 * @param {Object} encodedMessage - The encoded MSL message object with has/readUint16/authData methods.
 * @param {Object} cryptoContexts - Map of crypto contexts for decryption.
 * @param {Object} callbacks - Callback object with `result` and `error` handlers.
 */
export function parseMslMessage(mslContext, encodedMessage, cryptoContexts, callbacks) {

  /**
   * Continues parsing after entity auth is resolved: verifies master token,
   * then proceeds to parse header or error data.
   *
   * @param {Object|null} entityAuthData - Parsed entity authentication data.
   * @param {Object|null} masterToken - Parsed master token.
   * @param {Uint8Array} signature - Message signature bytes.
   */
  function onEntityAuthResolved(entityAuthData, masterToken, signature) {
    if (masterToken) {
      verifyMasterToken(mslContext, masterToken, {
        result(verifiedToken) {
          onTokensResolved(entityAuthData, verifiedToken, signature);
        },
        error: callbacks.error,
      });
    } else {
      onTokensResolved(entityAuthData, null, signature);
    }
  }

  /**
   * Dispatches to header or error parser based on message contents.
   *
   * @param {Object|null} entityAuthData - Entity auth data.
   * @param {Object|null} masterToken - Verified master token.
   * @param {Uint8Array} signature - Message signature.
   */
  function onTokensResolved(entityAuthData, masterToken, signature) {
    AsyncExecutor.run(callbacks, () => {
      if (encodedMessage.has('headerdata')) {
        const headerData = encodedMessage.readUint16('headerdata');
        if (headerData.length === 0) {
          throw new MslException(MslError.HEADER_DATA_MISSING)
            .setMasterToken(masterToken)
            .setEntityAuthData(entityAuthData);
        }
        parseHeaderData(mslContext, headerData, entityAuthData, masterToken, signature, cryptoContexts, callbacks);
      } else if (encodedMessage.has('errordata')) {
        const errorData = encodedMessage.readUint16('errordata');
        if (errorData.length === 0) {
          throw new MslException(MslError.HEADER_DATA_MISSING)
            .setMasterToken(masterToken)
            .setEntityAuthData(entityAuthData);
        }
        parseErrorData(mslContext, errorData, entityAuthData, signature, callbacks);
      } else {
        throw new MslEncodingException(MslError.MSL_PARSE_ERROR, encodedMessage);
      }
    });
  }

  // Entry point: extract top-level fields
  AsyncExecutor.run(callbacks, () => {
    const factory = mslContext.defaultValue;
    const entityAuthDataRaw = encodedMessage.has('entityauthdata')
      ? encodedMessage.authData('entityauthdata', factory)
      : null;
    const masterTokenRaw = encodedMessage.has('mastertoken')
      ? encodedMessage.authData('mastertoken', factory)
      : null;
    const signature = encodedMessage.readUint16('signature');

    if (entityAuthDataRaw) {
      parseEntityAuthData(mslContext, entityAuthDataRaw, {
        result(parsedEntityAuth) {
          onEntityAuthResolved(parsedEntityAuth, masterTokenRaw, signature);
        },
        error: callbacks.error,
      });
    } else {
      onEntityAuthResolved(null, masterTokenRaw, signature);
    }
  });
}
