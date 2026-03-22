/**
 * Netflix Cadmium Player - Pre-Shared Key Profile Authentication Data
 * Deobfuscated from Module_75563
 *
 * MSL entity authentication data for the PSK Profile scheme.
 * Extends the base EntityAuthenticationData class with a profile prefix
 * and profile identifier. Used for authenticating entities that share
 * a pre-shared key with a specific profile designation.
 *
 * Also provides a parser function to deserialize PSK profile auth data
 * from an MSL object.
 */

import { __extends, __importDefault } from "tslib"; // Module 22970
import { EntityAuthenticationData } from "../msl/EntityAuthenticationData"; // Module 58768
import { EntityAuthScheme } from "../msl/EntityAuthScheme"; // Module 36332
import addAuthData from "../msl/addAuthData"; // Module 42979
import MslEncoderException from "../msl/MslEncoderException"; // Module 6838
import MslEncodingException from "../msl/MslEncodingException"; // Module 88257
import MslAuthErrorCode from "../msl/MslAuthErrorCode"; // Module 36114

class PresharedProfileAuthData extends EntityAuthenticationData {
    /**
     * @param {string} profilePrefix - PSK identity prefix
     * @param {string} profile - Profile identifier
     */
    constructor(profilePrefix, profile) {
        super(EntityAuthScheme.a5b); // PSK_PROFILE scheme
        this.profilePrefix = profilePrefix;
        this.profile = profile;
    }

    /**
     * Get the full profile identifier (prefix + profile).
     * @returns {string}
     */
    getProfileIdentifier() {
        return this.profilePrefix + "-" + this.profile;
    }

    /**
     * Register authentication encoding data for MSL serialization.
     * @param {Object} encoder - MSL encoder
     * @param {Object} encoderFormat - Encoding format
     */
    registerEncoding(encoder, encoderFormat) {
        const self = this;
        addAuthData(encoderFormat, function () {
            const mslObject = encoder.zf();
            mslObject.put("pskid", self.profilePrefix);
            mslObject.put("profile", self.profile);
            return mslObject;
        });
    }

    /**
     * Check equality with another PresharedProfileAuthData instance.
     * @param {*} other - Object to compare with
     * @returns {boolean}
     */
    equals(other) {
        if (this === other) return true;
        if (!(other instanceof PresharedProfileAuthData)) return false;
        return super.equals(other) &&
            this.profilePrefix == other.profilePrefix &&
            this.profile == other.profile;
    }
}

/**
 * Parse PSK profile authentication data from an MSL object.
 *
 * @param {Object} mslObject - MSL object containing pskid and profile fields
 * @returns {PresharedProfileAuthData}
 * @throws {MslEncodingException} If required fields are missing
 */
function parsePresharedProfileAuthData(mslObject) {
    try {
        const pskId = mslObject.writeUint16("pskid");
        const profile = mslObject.writeUint16("profile");
        return new PresharedProfileAuthData(pskId, profile);
    } catch (error) {
        if (error instanceof MslEncoderException) {
            throw new MslEncodingException(MslAuthErrorCode.lf, "psk profile authdata " + mslObject);
        }
        throw error;
    }
}

export { PresharedProfileAuthData, parsePresharedProfileAuthData };
