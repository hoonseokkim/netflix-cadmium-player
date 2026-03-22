/**
 * Netflix Cadmium Player - Pre-Shared Keys Authentication Scheme
 * Deobfuscated from Module_79925
 *
 * MSL authentication scheme handler for pre-shared keys (PSK).
 * Extends the base authentication scheme class. Validates that
 * authentication data contains required PSK fields and throws
 * appropriate MSL exceptions on failure.
 */

import { __extends, __importDefault } from "tslib"; // Module 22970
import { AuthSchemeId } from "../msl/AuthSchemeId"; // Module 32256
import addAuthData from "../msl/addAuthData"; // Module 42979
import { aNb as createPskAuthData, THa as PskAuthenticationData } from "../msl/PskAuthenticationData"; // Module 49123
import MslEncodingException from "../msl/MslEncodingException"; // Module 10690
import MslEntityAuthException from "../msl/MslEntityAuthException"; // Module 88361
import MslEntityAuthErrorCode from "../msl/MslEntityAuthErrorCode"; // Module 99075
import MslAuthErrorCode from "../msl/MslAuthErrorCode"; // Module 36114
import { BaseAuthScheme } from "../msl/BaseAuthScheme"; // Module 49137

class PresharedKeysAuthScheme extends BaseAuthScheme {
    constructor() {
        super(AuthSchemeId.PHa); // PSK auth scheme identifier
    }

    /**
     * Register the authentication encoding for PSK scheme.
     * @param {Object} encoder - MSL encoder
     * @param {Object} encoderFormat - Encoding format
     */
    registerEncoding(encoder, encoderFormat) {
        addAuthData(encoderFormat, function () {
            return createPskAuthData(encoder);
        });
    }

    /**
     * Validate PSK authentication data.
     * Throws MslEntityAuthException if data is invalid.
     * @param {Object} authData - Authentication data to validate
     * @throws {MslEncodingException} If authData is wrong type
     * @throws {MslEntityAuthException} If required fields are missing or invalid
     */
    validateAuthData(authData) {
        if (!(authData instanceof PskAuthenticationData)) {
            throw new MslEncodingException("Incorrect authentication data type " + authData + ".");
        }

        const keyData = authData.internal_Lga;

        if (!authData.NT || !keyData) {
            throw new MslEntityAuthException(MslEntityAuthErrorCode.r3b).iteratorValue(authData);
        }

        throw new MslEntityAuthException(MslAuthErrorCode.P6b, this.scheme).iteratorValue(authData);
    }
}

export { PresharedKeysAuthScheme };
