/**
 * FTL Probe Parameter Parser
 *
 * Parses and validates FTL (Fast Turn-on Latency) network probe
 * configuration from JSON responses. FTL probes are used to measure
 * network connectivity and latency to Open Connect CDN appliances.
 *
 * Validates:
 * - Pulse count and timeout
 * - Pulse delay array
 * - URL list with name/method/url for each endpoint
 * - Logblob destination string
 * - Context object
 * - Optional "next" delay for chaining probes
 *
 * @module FtlProbeParameterParser
 * @source Module_69936
 */

import { __decorate, __param } from '../core/ReflectMetadataPolyfill';
import { injectable, injectDecorator } from '../ioc/ComponentDependencyResolver';
import { buildTransportPacket } from '../network/TransportBindings';
import { M7 as DrmConfigSymbol } from '../symbols/DrmSessionDependencies';
import { ellaSendRateMultiplier as toMilliseconds } from '../ella/EllaManager';
import { symbolMarker as TypeValidatorSymbol } from '../symbols/DrmSessionDependencies';
import { jX as JsonParserSymbol } from '../symbols/DrmSessionDependencies';

class FtlProbeParameterParser {
    /**
     * @param {Object} typeValidator - Type/schema validator (isObject, isPositiveInteger, etc.).
     * @param {Object} jsonParser    - JSON parser for raw responses.
     */
    constructor(typeValidator, jsonParser) {
        this.is = typeValidator;
        this.data = jsonParser;
        buildTransportPacket(this, "json");
    }

    /**
     * Parse and validate FTL probe parameters from a raw response.
     *
     * @param {*} rawResponse - Raw response data to parse.
     * @returns {Object} Parsed probe configuration.
     * @throws {Error} If any required field is missing or has an invalid type.
     */
    videoSampleEntry(rawResponse) {
        const params = this.data.videoSampleEntry(rawResponse);

        if (!this.is.YNa(params)) {
            throw Error("FtlProbe: param: not an object");
        }
        if (params.next && !this.is.t9(params.next)) {
            throw Error("FtlProbe: param.next: not a positive integer");
        }
        if (!this.is.t9(params.pulses)) {
            throw Error("FtlProbe: param.pulses: not a positive integer");
        }
        if (params.pulse_delays && !this.is.SQ(params.pulse_delays)) {
            throw Error("FtlProbe: param.pulse_delays: not an array");
        }
        if (!this.is.t9(params.pulse_timeout)) {
            throw Error("FtlProbe: param.pulse_timeout: not a positive integer");
        }
        if (!this.is.SQ(params.urls)) {
            throw Error("FtlProbe: param.urls: not an array");
        }
        if (!this.is.isValidInterval(params.logblob)) {
            throw Error("FtlProbe: param.logblob: not a string");
        }
        if (!this.is.N9(params.ctx)) {
            throw Error("FtlProbe: param.ctx: not an object");
        }

        // Validate each URL entry
        for (let i = 0; i < params.urls.length; ++i) {
            const urlEntry = params.urls[i];
            if (!this.is.YNa(urlEntry)) {
                throw Error("FtlProbe: param.urls[" + i + "]: not an object");
            }
            if (!this.is.filterPredicate(urlEntry.name)) {
                throw Error("FtlProbe: param.urls[" + i + "].name: not a string");
            }
            if (!this.is.filterPredicate(urlEntry.method)) {
                throw Error("FtlProbe: param.urls[" + i + "].method: not a string");
            }
            if (!this.is.filterPredicate(urlEntry.url)) {
                throw Error("FtlProbe: param.urls[" + i + "].url: not a string");
            }
        }

        return {
            pulseCount: params.pulses,
            pulseDelays: params.pulse_delays
                ? params.pulse_delays.map(toMilliseconds)
                : [],
            pulseTimeout: toMilliseconds(params.pulse_timeout),
            nextDelay: params.next ? toMilliseconds(params.next) : undefined,
            urls: params.urls,
            logBlobData: params.logblob,
            context: params.ctx
        };
    }
}

export { FtlProbeParameterParser };

// IoC registration
FtlProbeParameterParser = __decorate([
    injectable(),
    __param(0, injectDecorator(TypeValidatorSymbol)),
    __param(1, injectDecorator(JsonParserSymbol))
], FtlProbeParameterParser);
