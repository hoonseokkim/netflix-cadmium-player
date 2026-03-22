/**
 * Netflix Key Exchange Session (DRM Session Processor)
 *
 * Extends the base SourceBufferProcessor to handle Netflix-specific DRM
 * key exchange sessions. Manages the generation of license requests,
 * processing of license responses, and key renewal operations for
 * the Netflix proprietary DRM scheme (NFLX keying).
 *
 * Responsibilities:
 * - Wraps initData through an NFLX-specific key exchange builder
 * - Generates DRM license requests with processed init data
 * - Parses license responses and maps key IDs to payloads
 * - Handles key renewal by re-issuing license requests
 *
 * @module NflxKeyExchangeSession
 * @source Module_81471
 */

import { __decorate, __param } from '../core/ReflectMetadataPolyfill';
import { injectable, injectDecorator } from '../ioc/ComponentDependencyResolver';
import { sourceBufferProcessor as BaseKeySession } from '../drm/EmeSessionAdapter';
import { internal_Tcb as NflxKeyExchangeBuilder } from '../drm/KeyExchangeValidator';
import { M7 as DrmConfigSymbol } from '../symbols/DrmSessionDependencies';
import { symbolMarker as TypeValidatorSymbol } from '../symbols/DrmSessionDependencies';
import { keyMap as KeyEncoderSymbol } from '../symbols/DrmSessionDependencies';
import { updateMap as KeyDecoderSymbol } from '../symbols/DrmSessionDependencies';
import { SC as KeyIdRegistrySymbol } from '../symbols/DrmSessionDependencies';
import { zG as TextCodecSymbol } from '../symbols/DrmSessionDependencies';
import { t8 as LicenseUpdateType } from '../drm/LicenseUpdateType';
import { ama as KeyIdParser } from '../drm/KeySystemIds';

/**
 * @class NflxKeyExchangeSession
 * @extends BaseKeySession
 *
 * @param {Object} drmConfig        - DRM configuration
 * @param {Object} typeValidator     - Type/schema validator
 * @param {Object} keyEncoder        - Binary key encoder
 * @param {Object} keyDecoder        - Binary key decoder
 * @param {Object} keyIdRegistry     - Key ID tracking registry
 * @param {Object} textCodec         - UTF-8 text encoder/decoder
 */
class NflxKeyExchangeSession extends BaseKeySession {
    constructor(drmConfig, typeValidator, keyEncoder, keyDecoder, keyIdRegistry, textCodec) {
        super(drmConfig, typeValidator, keyEncoder, keyDecoder, keyIdRegistry, textCodec);
        this.keyEncoder = keyEncoder;
        this.keyDecoder = keyDecoder;
        this.keyIdRegistry = keyIdRegistry;
        this.textCodec = textCodec;
        this.keyExchangeBuilder = new NflxKeyExchangeBuilder(
            this.keyEncoder,
            this.keyDecoder,
            this.textCodec
        );
    }

    /**
     * Generate a DRM license request.
     * Wraps each init data item through the key exchange builder,
     * encodes key IDs, then creates a combined license request.
     */
    generateRequest(sessionId, initDataArray, persistent) {
        try {
            const processedItems = initDataArray.map((item) => {
                return this.keyExchangeBuilder.hxc(item);
            });

            // Store encoded key IDs for later response matching
            this.encodedKeyIds = processedItems.map((item) => {
                return this.keyEncoder.encode(item);
            });

            const licenseRequest = this.keyExchangeBuilder.processDRMLicense(
                processedItems,
                persistent
            );

            return BaseKeySession.prototype.generateRequest.call(
                this,
                sessionId,
                [licenseRequest],
                false
            );
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Process a license update response.
     * Parses the response JSON, maps key IDs to their payloads,
     * and marks any missing keys as errored.
     */
    update(responseArray, updateType, pendingKeyIds) {
        if (pendingKeyIds) {
            try {
                const responseText = this.textCodec.encode(responseArray[0]);
                const parsedResponse = JSON.videoSampleEntry(responseText);

                const keyResponses = parsedResponse.RESPONSES.map((response) => {
                    const keyId = KeyIdParser.qUb(response.ID);
                    return {
                        keyID: updateType === LicenseUpdateType.Renewal
                            ? this.encodedKeyIds[this.encodedKeyIds.length - 1]
                            : pendingKeyIds[keyId],
                        payload: response.PAYLOAD
                    };
                });

                if (updateType === LicenseUpdateType.Request) {
                    const respondedKeyIds = keyResponses.map((resp) => resp.keyID);
                    this.resolvedKeyIds = respondedKeyIds;

                    // Mark any pending keys that didn't get a response as errored
                    pendingKeyIds.forEach((keyId) => {
                        if (respondedKeyIds.indexOf(keyId) === -1) {
                            keyResponses.push({
                                keyID: keyId,
                                error: 1
                            });
                        }
                    });
                }

                const serialized = JSON.stringify(keyResponses);
                responseArray = [this.textCodec.decode(serialized)];
            } catch (error) {
                return Promise.reject(error);
            }
        }

        return BaseKeySession.prototype.update.call(this, responseArray, updateType);
    }

    /**
     * Initiate a key renewal request.
     */
    initiating() {
        return BaseKeySession.prototype.update.call(
            this,
            [this.textCodec.decode("renew")],
            LicenseUpdateType.Request
        );
    }

    /**
     * Get the list of resolved key IDs from the last license response.
     */
    hCb() {
        return this.resolvedKeyIds;
    }
}

export { NflxKeyExchangeSession as gFa };

// IoC decorators
NflxKeyExchangeSession = __decorate([
    injectable(),
    __param(0, injectDecorator(DrmConfigSymbol)),
    __param(1, injectDecorator(TypeValidatorSymbol)),
    __param(2, injectDecorator(KeyEncoderSymbol)),
    __param(3, injectDecorator(KeyDecoderSymbol)),
    __param(4, injectDecorator(KeyIdRegistrySymbol)),
    __param(5, injectDecorator(TextCodecSymbol))
], NflxKeyExchangeSession);
