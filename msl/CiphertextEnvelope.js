/**
 * Ciphertext Envelope
 *
 * Implements the MSL (Message Security Layer) ciphertext envelope format.
 * Supports two versions:
 *   - Version 1 (Wl): Legacy format using keyId + IV + ciphertext + SHA256
 *   - Version 2 (eA): Modern format using cipherSpec + IV + ciphertext
 *
 * Provides encoding (processData) and decoding (Z1a) of encrypted payloads
 * within MSL messages. Part of Netflix's MSL crypto layer.
 *
 * @module CiphertextEnvelope
 * @source Module_25881
 */
export default function CiphertextEnvelope(module, exports, require) {
    var tslib, MslEncodable, AsyncExecutor, CipherSpecModule, Base64Utils,
        MslEncodingException, MslObjectMissingException, MslCryptoException,
        MslErrorCodes, MslInternalException;

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Z1a = exports.ARa = exports.k3b = exports.uf = void 0;

    tslib = require(22970);
    MslEncodable = require(48235);
    AsyncExecutor = tslib.__importDefault(require(42979));
    CipherSpecModule = tslib.__importDefault(require(51411));
    Base64Utils = require(44127);
    MslEncodingException = tslib.__importDefault(require(42458));
    MslObjectMissingException = tslib.__importDefault(require(6838));
    MslCryptoException = tslib.__importDefault(require(88257));
    MslErrorCodes = tslib.__importDefault(require(36114));
    MslInternalException = tslib.__importDefault(require(10690));

    /**
     * Envelope version constants.
     * Wl (1): Legacy key-ID based envelope
     * eA (2): Modern cipher-spec based envelope
     */
    exports.uf = {
        Wl: 1,
        eA: 2
    };

    /**
     * CiphertextEnvelope class - wraps encrypted data with metadata
     * needed for decryption (key ID or cipher spec, IV, ciphertext).
     */
    var CiphertextEnvelopeClass = (function (parent) {
        function CiphertextEnvelopeClass(keyOrCipherSpec, iv, ciphertext) {
            var self = parent.call(this) || this;
            var version = exports.uf.windowList;
            var keyId = keyOrCipherSpec;
            var cipherSpec = null;

            // Check if the first argument is a known cipher spec
            for (var spec in CipherSpecModule.default.FDa) {
                if (CipherSpecModule.default.FDa[spec] == keyOrCipherSpec) {
                    version = exports.uf.eA;
                    keyId = null;
                    cipherSpec = keyOrCipherSpec;
                    break;
                }
            }

            self.version = version;
            self.xB = keyId;          // keyId (v1) or null (v2)
            self.shc = cipherSpec;     // cipherSpec (v2) or null (v1)
            self.iv = iv;
            self.ciphertext = ciphertext;
            return self;
        }

        tslib.__extends(CiphertextEnvelopeClass, parent);

        /**
         * Serializes this envelope into an MSL object for transmission.
         *
         * @param {Object} encoder - MSL encoder
         * @param {Object} format - Output format
         * @param {Function} callback - Completion callback
         */
        CiphertextEnvelopeClass.prototype.processData = function (encoder, format, callback) {
            var self = this;

            AsyncExecutor.default(callback, function () {
                var mslObject = encoder.zf();

                switch (self.version) {
                    case exports.uf.windowList:
                        mslObject.put("keyid", self.xB);
                        if (self.iv) mslObject.put("iv", self.iv);
                        mslObject.put("ciphertext", self.ciphertext);
                        mslObject.put("sha256", Base64Utils.decodeBase64("AA=="));
                        break;

                    case exports.uf.eA:
                        mslObject.put("version", self.version);
                        mslObject.put("cipherspec", self.shc);
                        if (self.iv) mslObject.put("iv", self.iv);
                        mslObject.put("ciphertext", self.ciphertext);
                        break;

                    default:
                        throw new MslInternalException.default(
                            "Ciphertext envelope version " + self.version + " encoding unsupported."
                        );
                }

                encoder.cryptoFunction(mslObject, format, callback);
            }, this);
        };

        return CiphertextEnvelopeClass;
    })(MslEncodable.fp);

    exports.k3b = CiphertextEnvelopeClass;

    /**
     * Creates a new CiphertextEnvelope instance asynchronously.
     *
     * @param {*} keyOrCipherSpec - Key ID or cipher specification
     * @param {Uint8Array|null} iv - Initialization vector
     * @param {Uint8Array} ciphertext - Encrypted data
     * @param {Function} callback - Receives the new envelope
     */
    exports.ARa = function createCiphertextEnvelope(keyOrCipherSpec, iv, ciphertext, callback) {
        AsyncExecutor.default(callback, function () {
            return new CiphertextEnvelopeClass(keyOrCipherSpec, iv, ciphertext);
        });
    };

    /**
     * Parses a CiphertextEnvelope from an MSL object.
     * Auto-detects the version if not provided.
     *
     * @param {Object} mslObject - The MSL object to parse
     * @param {number|null} version - Optional version override
     * @param {Function} callback - Receives the parsed envelope
     */
    exports.Z1a = function parseCiphertextEnvelope(mslObject, version, callback) {
        AsyncExecutor.default(callback, function () {
            var isValidVersion, keyOrCipherSpec, iv, ciphertext;

            // Auto-detect version if not provided
            if (!version) {
                try {
                    version = mslObject.xS("version");
                    isValidVersion = false;
                    for (var v in exports.uf) {
                        if (exports.uf[v] == version) {
                            isValidVersion = true;
                            break;
                        }
                    }
                    if (!isValidVersion) {
                        throw new MslEncodingException.default(
                            MslErrorCodes.default.internal_Ymb,
                            "ciphertext envelope " + mslObject
                        );
                    }
                } catch (error) {
                    if (error instanceof MslObjectMissingException.default) {
                        version = exports.uf.windowList;
                    } else {
                        throw error;
                    }
                }
            }

            switch (version) {
                case exports.uf.windowList:
                    try {
                        keyOrCipherSpec = mslObject.writeUint16("keyid");
                        iv = mslObject.has("iv") ? mslObject.readUint16("iv") : null;
                        ciphertext = mslObject.readUint16("ciphertext");
                        mslObject.readUint16("sha256"); // read and discard
                    } catch (error) {
                        if (error instanceof MslObjectMissingException.default) {
                            throw new MslCryptoException.default(
                                MslErrorCodes.default.lf,
                                "ciphertext envelope " + mslObject,
                                error
                            );
                        }
                        throw error;
                    }
                    break;

                case exports.uf.eA:
                    try {
                        if (mslObject.xS("version") != exports.uf.eA) {
                            throw new MslEncodingException.default(
                                MslErrorCodes.default.internal_Ymb,
                                "ciphertext envelope " + mslObject
                            );
                        }
                        keyOrCipherSpec = CipherSpecModule.default.FDa.nS(
                            mslObject.writeUint16("cipherspec")
                        );
                        if (!keyOrCipherSpec) {
                            throw new MslEncodingException.default(
                                MslErrorCodes.default.K6b,
                                "ciphertext envelope " + mslObject
                            );
                        }
                        iv = mslObject.has("iv") ? mslObject.readUint16("iv") : null;
                        ciphertext = mslObject.readUint16("ciphertext");
                    } catch (error) {
                        if (error instanceof MslObjectMissingException.default) {
                            throw new MslCryptoException.default(
                                MslErrorCodes.default.lf,
                                "ciphertext envelope " + mslObject,
                                error
                            );
                        }
                        throw error;
                    }
                    break;

                default:
                    throw new MslEncodingException.default(
                        MslErrorCodes.default.O6b,
                        "ciphertext envelope " + mslObject
                    );
            }

            return new CiphertextEnvelopeClass(keyOrCipherSpec, iv, ciphertext);
        });
    };
}
