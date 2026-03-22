/**
 * WebCrypto Cipher Context
 *
 * Implements a cipher context using the Web Crypto API for AES-CBC encryption/decryption,
 * HMAC signing/verification, and key wrapping/unwrapping operations. This is part of the
 * MSL (Message Security Layer) crypto infrastructure.
 *
 * @module WebCryptoCipherContext
 * @original Module_72672
 */

// import { asyncCallback } from './asyncCallback';
// import { MslError } from './MslError';
// import { MslErrorCode } from './MslErrorCode';
// import { MslEncoderException } from './MslEncoderException';
// import { createCipherPayload, parseCipherPayload, PayloadFormat } from './CipherPayloadFormat';
// import { webCrypto } from './WebCryptoWrapper';
// import { CipherAlgorithm } from './CipherAlgorithm';
// import { MslInternalException } from './MslInternalException';
// import { wrapSecretKey } from './SecretKeyWrapper';
// import { wrapPublicKey } from './PublicKeyWrapper';
// import { wrapPrivateKey } from './PrivateKeyWrapper';
// import { createSignatureEnvelope, parseSignatureEnvelope, EnvelopeFormat } from './SignatureEnvelope';
// import { isMslError } from './MslErrorUtils';

/**
 * Cipher context that performs cryptographic operations using the Web Crypto API.
 * Supports AES-CBC encryption/decryption, HMAC-SHA256 signing/verification,
 * and AES key wrapping/unwrapping.
 */
export class WebCryptoCipherContext {
    /**
     * @param {Object} cryptoGenerator - Random number generator for IV generation
     * @param {string} id - Identifier for this cipher context
     * @param {Object} [encryptionKey] - Key used for encryption/decryption (raw CryptoKey in .gx)
     * @param {Object} [hmacKey] - Key used for HMAC signing/verification (raw CryptoKey in .gx)
     * @param {Object} [wrapUnwrapKey] - Key used for key wrap/unwrap (raw CryptoKey in .gx)
     */
    constructor(cryptoGenerator, id, encryptionKey, hmacKey, wrapUnwrapKey) {
        /** @type {Object} */
        this.cryptoGenerator = cryptoGenerator;
        /** @type {string} */
        this.id = id;
        /** @type {CryptoKey|undefined} */
        this.encryptionDecryptionKey = encryptionKey?.gx;
        /** @type {CryptoKey|undefined} */
        this.hmacKey = hmacKey?.gx;
        /** @type {CryptoKey|undefined} */
        this.wrapUnwrapKey = wrapUnwrapKey?.gx;
    }

    /**
     * Encrypts data using AES-CBC with a random IV, then packages the result
     * into a cipher payload envelope.
     *
     * @param {Uint8Array} data - Data to encrypt
     * @param {Object} encoder - MSL encoder for serializing the payload
     * @param {Object} format - Output encoding format
     * @param {Object} callback - Callback with result/error handlers
     */
    encrypt(data, encoder, format, callback) {
        const self = this;
        asyncCallback(callback, () => {
            if (!self.encryptionDecryptionKey) {
                throw new MslError(MslErrorCode.ENCRYPT_NOT_SUPPORTED, "no encryption/decryption key");
            }
            if (data.length === 0) {
                return data;
            }

            const iv = new Uint8Array(16);
            self.cryptoGenerator.getRandomSource().getRandomValues(iv);

            webCrypto.encrypt(
                { name: CipherAlgorithm.AES_CBC.name, iv },
                self.encryptionDecryptionKey,
                data
            ).then(
                (ciphertext) => {
                    createCipherPayload(self.id, iv, new Uint8Array(ciphertext), {
                        result(payloadEnvelope) {
                            payloadEnvelope.processData(encoder, format, {
                                result: callback.result,
                                error(err) {
                                    if (err instanceof MslEncoderException) {
                                        err = new MslError(MslErrorCode.INTERNAL_ENCRYPT_ERROR, null, err);
                                    }
                                    callback.error(err);
                                },
                            });
                        },
                        error(err) {
                            isMslError(err) || (err = new MslError(MslErrorCode.ENCRYPT_ERROR, null, err));
                            callback.error(err);
                        },
                    });
                },
                (err) => {
                    callback.error(new MslError(MslErrorCode.ENCRYPT_ERROR, null, err));
                }
            );
        });
    }

    /**
     * Decrypts data from a cipher payload envelope using AES-CBC.
     *
     * @param {Uint8Array} data - Encrypted envelope data
     * @param {Object} parser - Parser for the cipher payload envelope
     * @param {Object} callback - Callback with result/error handlers
     */
    decrypt(data, parser, callback) {
        const self = this;
        asyncCallback(callback, () => {
            if (!self.encryptionDecryptionKey) {
                throw new MslError(MslErrorCode.DECRYPT_NOT_SUPPORTED, "no encryption/decryption key");
            }
            if (data.length === 0) {
                return data;
            }

            let envelope;
            try {
                envelope = parser.parseFunction(data);
            } catch (err) {
                if (err instanceof MslEncoderException) {
                    throw new MslError(MslErrorCode.CIPHERTEXT_ENVELOPE_PARSE_ERROR, null, err);
                }
                throw new MslError(MslErrorCode.DECRYPT_ERROR, null, err);
            }

            parseCipherPayload(envelope, PayloadFormat.windowList, {
                result(parsed) {
                    try {
                        webCrypto.decrypt(
                            { name: CipherAlgorithm.AES_CBC.name, iv: parsed.iv },
                            self.encryptionDecryptionKey,
                            parsed.ciphertext
                        ).then(
                            (plaintext) => callback.result(new Uint8Array(plaintext)),
                            (err) => callback.error(new MslError(MslErrorCode.DECRYPT_ERROR, null, err))
                        );
                    } catch (err) {
                        isMslError(err) ? callback.error(err) : callback.error(new MslError(MslErrorCode.DECRYPT_ERROR, null, err));
                    }
                },
                error(err) {
                    if (err instanceof MslInternalException) {
                        err = new MslError(MslErrorCode.INTERNAL_ENCRYPT_ERROR, null, err);
                    }
                    isMslError(err) || (err = new MslError(MslErrorCode.DECRYPT_ERROR, null, err));
                    callback.error(err);
                },
            });
        });
    }

    /**
     * Wraps a key using AES key wrapping.
     *
     * @param {Object} keyToWrap - Key to wrap (raw CryptoKey in .gx)
     * @param {Object} encoder - MSL encoder
     * @param {Object} format - Output encoding format
     * @param {Object} callback - Callback with result/error handlers
     */
    wrapKey(keyToWrap, encoder, format, callback) {
        const self = this;
        asyncCallback(callback, () => {
            if (!self.wrapUnwrapKey) {
                throw new MslError(MslErrorCode.INTERNAL_WRAP_KEY_MISSING, "no wrap/unwrap key");
            }
            webCrypto.wrapKey("raw", keyToWrap.gx, self.wrapUnwrapKey, self.wrapUnwrapKey.algorithm).then(
                (wrappedKey) => callback.result(new Uint8Array(wrappedKey)),
                (err) => callback.error(new MslError(MslErrorCode.WRAP_KEY_ERROR, null, err))
            );
        });
    }

    /**
     * Unwraps a key using AES key unwrapping.
     *
     * @param {Uint8Array} wrappedKeyData - The wrapped key bytes
     * @param {Object} algorithm - Target algorithm for the unwrapped key
     * @param {string[]} usages - Key usages for the unwrapped key
     * @param {Object} callback - Callback with result/error handlers
     */
    unwrapKey(wrappedKeyData, algorithm, usages, callback) {
        const self = this;

        function processUnwrappedKey(cryptoKey) {
            asyncCallback(callback, () => {
                switch (cryptoKey.type) {
                    case "secret":
                        wrapSecretKey(cryptoKey, callback);
                        break;
                    case "public":
                        wrapPublicKey(cryptoKey, callback);
                        break;
                    case "private":
                        wrapPrivateKey(cryptoKey, callback);
                        break;
                    default:
                        throw new MslError(MslErrorCode.UNWRAP_KEY_UNEXPECTED_TYPE, "type: " + cryptoKey.type);
                }
            });
        }

        asyncCallback(callback, () => {
            if (!self.wrapUnwrapKey) {
                throw new MslError(MslErrorCode.UNWRAP_KEY_MISSING, "no wrap/unwrap key");
            }
            webCrypto.unwrapKey("raw", wrappedKeyData, self.wrapUnwrapKey, self.wrapUnwrapKey.algorithm, algorithm, false, usages).then(
                (cryptoKey) => processUnwrappedKey(cryptoKey),
                (err) => callback.error(new MslError(MslErrorCode.UNWRAP_KEY_ERROR, null, err))
            );
        }, this);
    }

    /**
     * Signs data using HMAC-SHA256, then packages the signature in an envelope.
     *
     * @param {Uint8Array} data - Data to sign
     * @param {Object} encoder - MSL encoder
     * @param {Object} format - Output encoding format
     * @param {Object} callback - Callback with result/error handlers
     */
    sign(data, encoder, format, callback) {
        const self = this;
        asyncCallback(callback, () => {
            if (!self.hmacKey) {
                throw new MslError(MslErrorCode.SIGN_KEY_MISSING, "no signature key.");
            }
            webCrypto.sign(self.hmacKey.algorithm, self.hmacKey, data).then(
                (signature) => {
                    asyncCallback(callback, () => {
                        createSignatureEnvelope(new Uint8Array(signature), {
                            result(envelope) {
                                envelope.readUint16(encoder, format, {
                                    result: callback.result,
                                    error(err) {
                                        asyncCallback(callback, () => {
                                            if (err instanceof MslEncoderException) {
                                                err = new MslError(MslErrorCode.SIGNATURE_ENVELOPE_ERROR, undefined, err);
                                            }
                                            callback.error(err);
                                        });
                                    },
                                });
                            },
                            error: callback.error,
                        });
                    });
                },
                (err) => callback.error(new MslError(MslErrorCode.SIGN_ERROR, null, err))
            );
        });
    }

    /**
     * Verifies an HMAC-SHA256 signature on data.
     *
     * @param {Uint8Array} data - The signed data
     * @param {Uint8Array} signatureEnvelopeData - The signature envelope
     * @param {Object} format - Format for parsing
     * @param {Object} callback - Callback with result/error handlers
     */
    verify(data, signatureEnvelopeData, format, callback) {
        const self = this;
        asyncCallback(callback, () => {
            if (!self.hmacKey) {
                throw new MslError(MslErrorCode.VERIFY_KEY_MISSING, "no signature key.");
            }
            parseSignatureEnvelope(signatureEnvelopeData, EnvelopeFormat.windowList, format, {
                result(parsed) {
                    asyncCallback(callback, () => {
                        const onResult = callback.result;
                        webCrypto.verify(self.hmacKey.algorithm, self.hmacKey, parsed.signature, data).then(
                            onResult,
                            (err) => callback.error(new MslError(MslErrorCode.SIGN_ERROR, undefined, err))
                        );
                    });
                },
                error: callback.error,
            });
        });
    }
}
