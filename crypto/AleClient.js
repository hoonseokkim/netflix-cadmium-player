/**
 * @module AleClient
 * @description Application Level Encryption (ALE) client for secure communication.
 *              Manages ALE sessions including key exchange, provisioning, encryption,
 *              and decryption. Supports session reuse and automatic renewal on failure.
 *              Original: Module_61222
 */

import { __awaiter, __generator, __assign } from 'tslib'; // Module 22970
import { AleScheme, AleKeyxScheme, AleServiceFactory } from '../crypto/AleEncryptionSchemes'; // Module 73608
import { now } from '../timing/Clock'; // Module 28020
import { toError, createAleError } from '../utils/ErrorUtils'; // Module 62411

/**
 * Wraps an async step with error enrichment for ALE failure diagnostics.
 * @private
 * @param {string} step - Name of the ALE step being executed
 * @param {Function} operation - Async operation to execute
 * @param {Object} context - Context with token, session, metadata info
 * @returns {Promise<*>} Result of the operation, or a rejected promise with diagnostic info
 */
async function executeWithDiagnostics(step, operation, context) {
    try {
        return await operation();
    } catch (error) {
        const { token, drmSession, qv, metadata } = context;
        const failureInfo = {
            type: "ale-failure",
            step,
            cause: toError(error),
            now: new Date().toISOString(),
            timestamp: now(),
            token: token ?? drmSession?.token,
            qv: metadata?.pk || qv,
            isNoneTrack: metadata?.createdAt.toISOString(),
            expiration: drmSession?.expirationTime().toISOString(),
            elapsedSinceCreation: metadata ? now() - metadata.createdTimestamp : undefined,
            initiating: drmSession?.isSessionValid(),
        };
        return Promise.reject(failureInfo);
    }
}

/**
 * Client for Application Level Encryption (ALE).
 * Handles encrypted communication with Netflix backend services.
 */
class AleClient {
    /**
     * @param {Object} options - ALE client configuration options
     * @param {Object} config - ALE protocol configuration (scheme, key exchange type, etc.)
     */
    constructor(options, config) {
        /** @type {number} Monotonically increasing session sequence number */
        this.qv = 1;

        /** @type {Object} Client options */
        this.options = { ...options };

        /** @type {Object} Node/device information */
        this.nodeInfo = options.nodeInfo;

        /** @type {boolean} Whether to drop session on encrypt/decrypt failure */
        this.options.dropSessionOnFailure = options.dropSessionOnFailure ?? true;

        /** @type {boolean} Whether to validate session before renewal */
        this.options.validateBeforeRenewal = options.validateBeforeRenewal ?? true;

        /** @type {Function} Trace logger */
        this.traceLog = options.traceLog.extend(config.hvb, "ale-client");

        /** @type {Object} ALE configuration */
        this.config = config;

        /** @type {Object|undefined} Current DRM/ALE session */
        this.drmSession = undefined;

        /** @type {Object|undefined} Session metadata (sequence number, timestamps) */
        this.metadata = undefined;
    }

    /**
     * Creates default ALE config for the SOCKETROUTER scheme.
     * @static
     * @param {Object} options - Options containing nodeInfo
     * @returns {Object} ALE configuration object
     */
    static createDefaultConfig(options) {
        const nodeInfo = options.nodeInfo;
        return {
            hvb: "SOCKETROUTER",
            scheme: AleScheme.A128CBC_HS256,
            keyx: AleKeyxScheme.CLEAR,
            crypto: nodeInfo.crypto,
            drmKeyWrapper: nodeInfo.drmKeyWrapper,
            wj: nodeInfo.wj,
        };
    }

    /**
     * Factory method that creates an AleClient with default configuration.
     * @static
     * @param {Object} options - Client options
     * @returns {AleClient} New ALE client instance
     */
    static createWithDefaults(options) {
        return new AleClient(options, this.createDefaultConfig(options));
    }

    /**
     * Gets or creates the ALE service factory (lazily initialized).
     * @private
     * @returns {AleServiceFactory} The ALE service factory
     */
    _getOrCreateService() {
        if (!this._serviceFactory) {
            this._serviceFactory = new AleServiceFactory(this.config);
        }
        return this._serviceFactory;
    }

    /**
     * Creates or reuses an ALE session through key exchange and provisioning.
     * @private
     * @returns {Promise<Object>} The ALE DRM session
     */
    async _ensureSession() {
        // Reuse valid existing session
        if (this.drmSession && !this.drmSession.isSessionValid()) {
            this.traceLog("Reusing session with expiration", this.drmSession.expirationTime().toISOString());
            return this.drmSession;
        }

        this.metadata = undefined;
        const sequenceNumber = this.qv++;

        // Step 1: Get/create the ALE service
        const service = await executeWithDiagnostics("create-service", () => this._getOrCreateService(), { qv: sequenceNumber });

        // Step 2: Initiate key exchange
        const keyExchangeRequest = await executeWithDiagnostics("get-request", () => service.initKeyExchange(), { qv: sequenceNumber });
        this.traceLog("Provision request", keyExchangeRequest);

        // Step 3: Provision with the node
        const provisionResponse = await executeWithDiagnostics("provision", () => this.nodeInfo.provision(keyExchangeRequest), { qv: sequenceNumber });
        this.traceLog("Provision response", provisionResponse);

        // Step 4: Create session from provision response
        this.drmSession = await executeWithDiagnostics("create-session", () => service.createSession(provisionResponse), { qv: sequenceNumber });

        this.metadata = {
            pk: sequenceNumber,
            createdTimestamp: now(),
            createdAt: new Date(),
        };

        this.traceLog("Created session with expiration", this.drmSession.expirationTime().toISOString());
        return this.drmSession;
    }

    /**
     * Validates the current session and renews if needed.
     * @private
     * @param {string} operationName - Name of the calling operation (for diagnostics)
     * @returns {Promise<Object>} Valid ALE session
     */
    async _validateAndRenewSession(operationName) {
        if (!this.options.validateBeforeRenewal) {
            const { drmSession, qv, metadata } = this;
            await executeWithDiagnostics(operationName, () => {
                if (!drmSession) throw createAleError("No session has been created");
                if (drmSession.isSessionValid()) throw createAleError("Session is due for renewal");
            }, { drmSession, qv, metadata });
        }
        return this._ensureSession();
    }

    /**
     * Initializes the ALE session (creates if needed).
     * @returns {Promise<void>}
     */
    async initialize() {
        await this._ensureSession();
    }

    /**
     * Whether the current session needs renewal.
     * @type {boolean}
     */
    get needsRenewal() {
        return this.drmSession?.isSessionValid() ?? true;
    }

    /**
     * Drops the current session, forcing a new one on next operation.
     */
    dropSession() {
        if (this.drmSession) {
            this.traceLog("Dropping session");
            this.drmSession = undefined;
        }
    }

    /**
     * Encrypts a plaintext string using the ALE session.
     * @param {string} plaintext - String to encrypt
     * @returns {Promise<{token: string, ciphertext: string}>} Token and ciphertext
     */
    async encrypt(plaintext) {
        try {
            const session = await this._validateAndRenewSession("encrypt");
            const token = session.token;
            const ciphertext = await executeWithDiagnostics("encrypt", () => session.encryptString(plaintext), {
                drmSession: session,
                token,
                metadata: this.metadata,
            });
            const result = { token, ciphertext };
            this.traceLog("Encrypted : ", plaintext, result);
            return result;
        } catch (error) {
            this.traceLog("Encrypt failed :", error);
            if (this.options.dropSessionOnFailure) this.dropSession();
            throw error;
        }
    }

    /**
     * Decrypts ciphertext using the ALE session.
     * @param {string} ciphertext - Encrypted content to decrypt
     * @returns {Promise<string>} Decrypted plaintext
     */
    async decrypt(ciphertext) {
        try {
            const session = await this._validateAndRenewSession("decrypt");
            const plaintext = await executeWithDiagnostics("decrypt", () => session.decryptContent(ciphertext), {
                drmSession: session,
                metadata: this.metadata,
            });
            this.traceLog("Decrypted : ", ciphertext, plaintext);
            return plaintext;
        } catch (error) {
            this.traceLog("Decrypt failed :", error);
            if (this.options.dropSessionOnFailure) this.dropSession();
            throw error;
        }
    }
}

export { AleClient };
export default AleClient;
