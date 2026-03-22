/**
 * Netflix Cadmium Player - Manifest Schema Mapper
 *
 * Defines the mapping schema between obfuscated manifest property names and their
 * human-readable counterparts. Used by the manifest deserializer to translate
 * the streaming manifest received from the Netflix API into internal data structures.
 * Covers video/audio/text tracks, DRM headers, playgraph segments, ad breaks,
 * live metadata, ELLA channels, and more.
 *
 * @module ManifestSchemaMapper
 * @see Module_97791
 */

import { __decorate, __param } from '../_tslib.js';
import { injectable, injectDecorator } from '../ioc/Decorators.js';
import { anyPlaceholder, internal_Dcb } from '../manifest/ManifestConstants.js';

/**
 * Maps obfuscated manifest property names to human-readable names.
 * Provides a complete schema definition for deserializing Netflix streaming manifests.
 */
class ManifestSchemaMapper {
    /**
     * @param {Object} manifestDeserializer - The deserializer that translates raw manifest data
     */
    constructor(manifestDeserializer) {
        this.manifestDeserializer = manifestDeserializer;

        /** @type {Object} Playgraph segment schema mapping */
        this.segmentSchema = {
            J: "viewableId",
            programId: "programId",
            startTimeMs: "startTimeMs",
            contentEndPts: "endTimeMs",
            next: ["next", {
                Mj: [anyPlaceholder, {
                    weight: "weight",
                    fe: "transitionType",
                }],
            }],
            defaultNext: "defaultNext",
            km: "exitZones",
            main: "main",
            type: "type",
            fe: "transitionType",
            playbackRate: "playbackRate",
            weight: "weight",
        };

        /** @type {Object} Choice map / parallel graph schema for interactive content */
        this.choiceMapMediaSchema = {
            Uh: "mediaTypes",
            initialSegment: "initialSegment",
            segments: ["segments", {
                Mj: [anyPlaceholder, Object.assign(Object.assign({}, this.segmentSchema), {
                    next: ["next", {
                        Mj: [anyPlaceholder, {
                            weight: "weight",
                            fe: "transitionType",
                            FVb: "transitionHint",
                            Nld: "skipRegionOffset",
                            Old: "skipRegionWeight",
                            tpc: "earliestSkipRequestOffset",
                        }],
                    }],
                    FVb: "transitionHint",
                    tpc: "earliestSkipRequestOffset",
                })],
            }],
        };

        /** @type {Object} Top-level manifest schema for the main streaming manifest */
        this.manifestSchema = {
            aR: "bookmark",
            YIb: "manifestVersion",
            KR: "drmType",
            qed: "drmVersion",
            expiration: "expiration",
            R: "movieId",
            qcPackageId: "packageId",
            duration: "duration",
            playbackContextId: "playbackContextId",
            defaultTrackOrderList: ["defaultTrackOrderList", {
                Z1: "mediaId",
                trackIdentifier: "videoTrackId",
                uUb: "subtitleTrackId",
                ew: "audioTrackId",
                ukd: "preferenceOrder",
            }],
            mediaEventTracks: ["mediaEventTracks", {
                id: "id",
                profile: "profile",
                type: "type",
                relayServers: ["relayServers", {
                    id: "id",
                    ipAddress: "address",
                    port: "port",
                    key: "key",
                    certificate: "clientKeyToken",
                }],
                streams: ["streams", {
                    sh: "downloadable_id",
                    urls: ["urls", {
                        Ug: "cdn_id",
                        url: "url",
                        G1: "liveOcaCapabilities",
                    }],
                }],
            }],
            eligibleABTestMap: ["eligibleABTestMap", {
                Mj: anyPlaceholder,
            }],
            badgingInfo: ["badgingInfo", {
                jed: "dolbyDigitalAudio",
                wgd: "hdrVideo",
                ked: "dolbyVisionVideo",
                Umd: "ultraHdVideo",
                "3dVideo": "3dVideo",
                ied: "dolbyAtmosAudio",
                ccd: "assistiveAudio",
                lld: "sdVideo",
                ugd: "hdVideo",
                vgd: "hdr10PlusVideo",
            }],
            type: "type",
            audioTextShortcuts: ["audioTextShortcuts", {
                id: "id",
                ew: "audioTrackId",
                textTrackId: "textTrackId",
            }],
            gkd: "partiallyHydrated",
            wJb: "maxRecommendedAudioRank",
            xJb: "maxRecommendedTextRank",
            sessionInfoId: "drmContextId",
            hEb: "hasDrmProfile",
            aBc: "hasClearProfile",
            iM: "hasDrmStreams",
            ata: "hasClearStreams",
            locations: ["locations", {
                Gc: "rank",
                level: "level",
                weight: "weight",
                key: "key",
            }],
            links: ["links", {}],
            $k: ["servers", {
                id: "id",
                name: "name",
                type: "type",
                rank: "rank",
                DIb: "lowgrade",
                Roc: ["dns", {
                    host: "host",
                    gDc: "ipv4",
                    hDc: "ipv6",
                    auc: "forceLookup",
                }],
                key: "key",
            }],
            audio_tracks: ["audio_tracks", {
                type: "type",
                EV: "subType",
                variant: "variant",
                language: "trackType",
                ff: "new_track_id",
                trackIdMatch: "track_id",
                IRc: "profileType",
                k_c: "stereo",
                profile: "profile",
                channels: "channels",
                language: "language",
                Igc: "channelsFormat",
                internal_Gha: "surroundFormatLabel",
                name: "languageDescription",
                internal_Ioc: "disallowedSubtitleTracks",
                fxb: "defaultTimedText",
                isNative: "isNative",
                isNone: "isNoneTrack",
                Acd: "bitrates",
                Nbc: "allowedVideoTrackId",
                relayServers: ["relayServers", {
                    id: "id",
                    ipAddress: "address",
                    port: "port",
                    key: "key",
                    certificate: "clientKeyToken",
                }],
                streams: ["streams", {
                    sh: "downloadable_id",
                    size: "size",
                    profileNameRef: "content_profile",
                    language: "trackType",
                    bitrate: "bitrate",
                    networkKey: "isDrm",
                    urls: ["urls", {
                        Ug: "cdn_id",
                        url: "url",
                        G1: "liveOcaCapabilities",
                    }],
                    PT: "new_stream_id",
                    type: "type",
                    channels: "channels",
                    Igc: "channelsFormat",
                    internal_Gha: "surroundFormatLabel",
                    language: "language",
                    hcd: "audioKey",
                    moov: ["moov", { size: "size", offset: "offset" }],
                    sidx: ["sidx", { size: "size", offset: "offset" }],
                    ssix: ["ssix", { size: "size", offset: "offset" }],
                    drmSchemes: "tags",
                    pUc: "representationId",
                    ellaChannels: ["ellaChannels", {
                        ec: "channelName",
                        dutyCycle: "dutyCycle",
                        encodingBitrateKbps: "encodingBitrate",
                        fecRate: "fecLevel",
                        isOverrideChannel: "containsFullData",
                    }],
                }],
                E$: "codecName",
                rawTrackType: "rawTrackType",
                id: "id",
                rank: "rank",
                isMissing: "hydrated",
                MLc: "offTrackDisallowed",
            }],
            video_tracks: ["video_tracks", {
                jj: "trackType",
                ff: "new_track_id",
                type: "type",
                trackIdMatch: "track_id",
                hEb: "hasDrmProfile",
                aBc: "hasClearProfile",
                iM: "hasDrmStreams",
                ata: "hasClearStreams",
                groupName: "groupName",
                relayServers: ["relayServers", {
                    id: "id",
                    ipAddress: "address",
                    port: "port",
                    key: "key",
                    certificate: "clientKeyToken",
                }],
                streams: ["streams", {
                    sh: "downloadable_id",
                    size: "size",
                    profileNameRef: "content_profile",
                    language: "trackType",
                    JR: "drmHeaderId",
                    bitrate: "bitrate",
                    networkKey: "isDrm",
                    urls: ["urls", {
                        Ug: "cdn_id",
                        url: "url",
                        G1: "liveOcaCapabilities",
                    }],
                    PT: "new_stream_id",
                    type: "type",
                    ikd: "peakBitrate",
                    Boc: "dimensionsCount",
                    Coc: "dimensionsLabel",
                    p2a: "pix_w",
                    o2a: "pix_h",
                    u4a: "res_w",
                    gza: "res_h",
                    xwb: "crop_x",
                    ywb: "crop_y",
                    wwb: "crop_w",
                    vwb: "crop_h",
                    FUa: "framerate_value",
                    EUa: "framerate_scale",
                    ATb: "startByteOffset",
                    vmaf: "vmaf",
                    moov: ["moov", { size: "size", offset: "offset" }],
                    sidx: ["sidx", { size: "size", offset: "offset" }],
                    ssix: ["ssix", { size: "size", offset: "offset" }],
                    segmentVmaf: ["segmentVmaf", { offset: "offset", vmaf: "vmaf" }],
                    drmSchemes: "tags",
                    pUc: "representationId",
                    ellaChannels: ["ellaChannels", {
                        ec: "channelName",
                        dutyCycle: "dutyCycle",
                        encodingBitrateKbps: "encodingBitrate",
                        fecRate: "fecLevel",
                        isOverrideChannel: "containsFullData",
                    }],
                }],
                IRc: "profileType",
                k_c: "stereo",
                profile: "profile",
                Boc: "dimensionsCount",
                Coc: "dimensionsLabel",
                snippets: ["snippets", {
                    Mj: [anyPlaceholder, {
                        Pld: "snippetSpec",
                        startTimeMs: "startTimeMs",
                        contentEndPts: "endTimeMs",
                    }],
                }],
                drmHeader: ["drmHeader", {
                    la: "bytes",
                    mhc: "checksum",
                    JR: "drmHeaderId",
                    xB: "keyId",
                    resolution: ["resolution", { height: "height", width: "width" }],
                }],
                prkDrmHeaders: ["prkDrmHeaders", {
                    la: "bytes",
                    mhc: "checksum",
                    JR: "drmHeaderId",
                    xB: "keyId",
                    resolution: ["resolution", { height: "height", width: "width" }],
                }],
                flavor: "flavor",
                Qgd: "ict",
                maxWidth: "maxWidth",
                maxHeight: "maxHeight",
                HNb: "pixelAspectX",
                INb: "pixelAspectY",
                Iid: "maxCroppedWidth",
                Hid: "maxCroppedHeight",
                Jid: "maxCroppedX",
                Kid: "maxCroppedY",
                qea: "max_framerate_value",
                pea: "max_framerate_scale",
                minWidth: "minWidth",
                minHeight: "minHeight",
                ijd: "minCroppedWidth",
                hjd: "minCroppedHeight",
                jjd: "minCroppedX",
                kjd: "minCroppedY",
                isMissing: "hydrated",
                rank: "rank",
                license: ["license", {
                    aGc: "licenseResponseBase64",
                    Ekd: "providerSessionToken",
                    rld: "secureStopExpected",
                    ped: "drmSessionId",
                    oed: "drmGroupId",
                    links: ["links", {}],
                }],
            }],
            cdnResponseData: ["cdnResponseData", {
                lV: "sessionABTestCell",
                pbcid: "pbcid",
            }],
            choiceMap: ["choiceMap", Object.assign(Object.assign({}, this.choiceMapMediaSchema), {
                type: "type",
                J: "viewableId",
                fe: "transitionType",
                FVb: "transitionHint",
                N3c: "uxlabel",
                parallelGraphs: ["parallelGraphs", {
                    Mj: [anyPlaceholder, this.choiceMapMediaSchema],
                }],
            })],
            contentPlaygraph: ["contentPlaygraph", {
                Z: ["playgraph", {
                    Ef: "initialSegment",
                    fe: "transitionType",
                    N3c: "uxlabel",
                    segments: ["segments", {
                        Mj: [anyPlaceholder, this.segmentSchema],
                    }],
                }],
                startIdent: ["startIdent", {
                    Rgd: "identToken",
                    J: "viewableId",
                }],
            }],
            media: ["media", {
                id: "id",
                tracks: ["tracks", {
                    V: "AUDIO",
                    TEXT_MEDIA_TYPE: "TEXT",
                    U: "VIDEO",
                }],
            }],
            recommendedMedia: ["recommendedMedia", {
                eo: "videoTrackId",
                ew: "audioTrackId",
                timedTextTrackId: "timedTextTrackId",
            }],
            timedtexttracks: ["timedtexttracks", {
                jj: "trackType",
                ff: "new_track_id",
                type: "type",
                EV: "subType",
                variant: "variant",
                rawTrackType: "rawTrackType",
                name: "languageDescription",
                language: "language",
                id: "id",
                isNone: "isNoneTrack",
                mda: "isForcedNarrative",
                downloadableIds: ["downloadableIds", {}],
                Lmd: "trackVariant",
                Ged: "encodingProfileNames",
                Nbc: "allowedVideoTrackId",
                cdnlist: ["cdnlist", {
                    id: "id",
                    name: "name",
                    type: "type",
                    rank: "rank",
                    DIb: "lowgrade",
                    Roc: ["dns", {
                        host: "host",
                        gDc: "ipv4",
                        hDc: "ipv6",
                        auc: "forceLookup",
                    }],
                    key: "key",
                }],
                ttDownloadables: ["ttDownloadables", {
                    Mj: [anyPlaceholder, {
                        id: "id",
                        size: "size",
                        mmd: "textKey",
                        tgd: "hashValue",
                        sgd: "hashAlgo",
                        jhd: "isImage",
                        offset: "midxOffset",
                        size: "midxSize",
                        height: "height",
                        width: "width",
                        downloadUrls: ["downloadUrls", {}],
                        urls: ["urls", {
                            url: "url",
                            urlId: "cdn_id",
                            G1: "liveOcaCapabilities",
                        }],
                    }],
                }],
                trackLanguage: "isLanguageLeftToRight",
                iB: "headIdentDuration",
                rank: "rank",
                isMissing: "hydrated",
            }],
            trickplays: ["trickplays", {
                sh: "downloadable_id",
                size: "size",
                urls: "urls",
                id: "id",
                interval: "interval",
                kPc: "pixelsAspectY",
                jPc: "pixelsAspectX",
                width: "width",
                height: "height",
                iB: "headIdentDuration",
                Tgd: "imageCount",
            }],
            watermarkInfo: ["watermarkInfo", {
                opacity: "opacity",
                id: "id",
                anchor: "anchor",
            }],
            ned: "dpsid",
            isSeeking: "isBranching",
            snd: "viewableType",
            execPointer: "isAd",
            PRE_FETCH: "isSupplemental",
            clientIpAddress: "clientIpAddress",
            Zmd: "urlExpirationDuration",
            vid: "manifestExpirationDuration",
            steeringAdditionalInfo: ["steeringAdditionalInfo", {
                Wld: "steeringId",
                Obd: "additionalGroupNames",
                streamingClientConfig: ["streamingClientConfig", {}],
                stickySteeringMetadata: ["stickySteeringMetadata", {
                    tB: "isSteeringSticky",
                    xAa: "stickySteeringToken",
                }],
                oZc: "slowInitialBufferingSignal",
                liveEdgeCushionWithSpreadMs: "liveEdgeCushionWithSpreadMs",
            }],
            auxiliaryManifestToken: "auxiliaryManifestToken",
            liveMetadata: ["liveMetadata", {
                Iqa: ["downloadableIdToSegmentTemplateId", { Mj: anyPlaceholder }],
                segmentTemplateIdToSegmentTemplate: ["segmentTemplateIdToSegmentTemplate", {
                    Mj: [anyPlaceholder, {
                        XQ: "availabilityStartTime",
                        OCc: "initialization",
                        media: "media",
                        KQc: "presentationTimeOffset",
                        FTb: "startNumber",
                        duration: "duration",
                        O: "timescale",
                    }],
                }],
                KLc: "ocLiveWindowDurationSeconds",
                kra: "eventAvailabilityOffsetMs",
                liveEventStartTime: "eventStartTime",
                liveEventEndTime: "eventEndTime",
                internal_Jxb: "disableLiveUi",
                maxBitrate: "maxBitrate",
                XQ: "availabilityStartTime",
                iWc: "segmentAvailabilityWindowSeconds",
            }],
            mediaEventHistory: ["mediaEventHistory", {
                O: "timescale",
                internal_Zdc: "baseTimeMs",
                internal_Wmc: "cutoffTimeMs",
                mediaEvents: ["mediaEvents", {
                    type: "type",
                    id: "id",
                    timestamp: "timestamp",
                    duration: "duration",
                    internal_Zp: "segmentationTypeId",
                    hb: "adBreakTriggerId",
                    applicationScope: "applicationScope",
                }],
            }],
            manifestType: "streamingType",
            timecodeAnnotations: ["timecodeAnnotations", {
                xrc: "endOffsetMs",
                r4: "startOffsetMs",
                type: "type",
            }],
            chapters: ["chapters", {
                r4: "startOffsetMs",
                title: "title",
            }],
            pOb: "prefetchTtl",
            auxiliaryManifests: "auxiliaryManifests",
            adverts: "adverts",
            LXa: "ignoreUserTextPreferences",
            ella: ["ella", {
                P0a: "obfuscationKey",
                L8a: "verificationKey",
                relayServers: ["relayServers", {
                    id: "id",
                    ipAddress: "address",
                    port: "port",
                    key: "key",
                    certificate: "clientKeyToken",
                }],
            }],
        };

        /** @type {Object} Ad break schema for DAI (Dynamic Ad Insertion) */
        this.adBreakSchema = {
            Xu: "locationMs",
            adBreakToken: "adBreakToken",
            hb: "adBreakTriggerId",
            yu: "embedded",
            rQc: "prefetchWindowOffsetMs",
            EPb: "refreshCache",
            qQc: "prefetchWindowDurationMs",
            qo: "autoSkip",
            uxDisplay: ["uxDisplay", {
                oXb: "uxIndication",
                zBa: "uxPlayerControl",
            }],
            duration: ["ads", {
                id: "id",
                startTimeMs: "startTimeMs",
                contentEndPts: "endTimeMs",
                timedAdEvents: ["timedAdEvents", {
                    event: "event",
                    ay: "adEventToken",
                    fq: "timeMs",
                }],
                actionAdEvents: ["actionAdEvents", {
                    start: ["start", { event: "event", ay: "adEventToken" }],
                    complete: ["complete", { event: "event", ay: "adEventToken" }],
                    aseTimer: ["stop", { event: "event", ay: "adEventToken" }],
                }],
                qo: "autoSkip",
                c1: "is3pVerificationEnabled",
                thirdPartyVerificationToken: "thirdPartyVerificationToken",
                uiComponent: ["uiComponent", {
                    Lbd: "adImpressionMetadataId",
                    Tmd: "uiToken",
                    Smd: "uiLoadDelayMaxMs",
                }],
            }],
            actionAdBreakEvents: ["actionAdBreakEvents", {
                complete: ["complete", { event: "event", ay: "adEventToken" }],
                start: ["start", { event: "event", ay: "adEventToken" }],
                aseTimer: ["stop", { event: "event", ay: "adEventToken" }],
            }],
            eZ: "auditPingUrl",
        };

        /** @type {Object} Adverts container schema for the entire ad system */
        this.advertsSchema = {
            cc: ["adBreaks", this.adBreakSchema],
            eZ: "auditPingUrl",
            OQb: "retainAdBreaks",
            adBreakCacheUpdates: ["adBreakCacheUpdates", {
                Mj: [anyPlaceholder, {
                    action: "action",
                    adBreak: ["adBreak", this.adBreakSchema],
                }],
            }],
            hasAdverts: "daiSupported",
            exb: "defaultPrefetchWindowDurationMs",
            internal_Enc: "defaultPrefetchWindowOffsetMs",
            MCc: "initialPrefetchWindowDurationMs",
            NCc: "initialPrefetchWindowOffsetMs",
            vNc: "orderedAdBreakTriggerIds",
        };

        /** @type {Object} Full schema including auxiliary manifests and adverts */
        this.fullManifestSchema = Object.assign(Object.assign({}, this.manifestSchema), {
            Gq: ["auxiliaryManifests", this.manifestSchema],
            adverts: ["adverts", this.advertsSchema],
        });
    }

    /**
     * Deserializes a raw manifest using the full manifest schema.
     * @param {Object} rawManifest - The raw manifest data from the Netflix API
     */
    deserializeManifest(rawManifest) {
        this.manifestDeserializer.Q_(rawManifest, this.fullManifestSchema);
    }
}

export { ManifestSchemaMapper as gHa };

export const decoratedManifestSchemaMapper = __decorate([
    injectable(),
    __param(0, injectDecorator(internal_Dcb)),
], ManifestSchemaMapper);
