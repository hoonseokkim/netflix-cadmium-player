/**
 * ManifestSchemaMapper
 *
 * Inversify-injectable class that defines the property-name mapping schema
 * used to translate Netflix's obfuscated wire-format manifest keys into
 * human-readable property names.
 *
 * The mapper holds several nested sub-schemas (relay servers, URLs, CDN
 * servers, DRM headers, audio/video/timed-text tracks, ads, live metadata,
 * etc.) and exposes a single `parseManifest()` method that delegates the
 * recursive renaming work to an injected `ManifestEnricher` instance.
 *
 * @module ManifestSchemaMapper
 * @netflix Webpack Module 97791
 */

import { __decorate, __param } from 'tslib'; // Module 22970
import { injectable, inject } from 'inversify'; // Module 22674
import { ANY_PLACEHOLDER, ENRICHER_SYMBOL } from './SchemaConstants.js'; // Module 90030

// ─── Shared Sub-Schemas ────────────────────────────────────────────────────────

/**
 * Schema for relay server entries (used in audio, video, media-event,
 * and ELLA tracks).
 * @type {[string, Object]}
 */
const RELAY_SERVER_SCHEMA = {
    id: 'id',
    ipAddress: 'address',
    port: 'port',
    key: 'key',
    certificate: 'clientKeyToken',
};

/**
 * Schema for individual download URL entries.
 * @type {Object}
 */
const URL_SCHEMA = {
    Ug: 'cdn_id',
    url: 'url',
    G1: 'liveOcaCapabilities',
};

/**
 * Schema for MP4 box-offset descriptors (moov / sidx / ssix).
 * @type {Object}
 */
const BOX_OFFSET_SCHEMA = {
    size: 'size',
    offset: 'offset',
};

/**
 * Schema for ELLA (Enhanced Low-Latency Algorithm) channel entries.
 * @type {Object}
 */
const ELLA_CHANNEL_SCHEMA = {
    ec: 'channelName',
    dutyCycle: 'dutyCycle',
    encodingBitrateKbps: 'encodingBitrate',
    fecRate: 'fecLevel',
    isOverrideChannel: 'containsFullData',
};

/**
 * Schema for CDN server entries (used in servers list and timed-text CDN lists).
 * @type {Object}
 */
const CDN_SERVER_SCHEMA = {
    id: 'id',
    name: 'name',
    type: 'type',
    rank: 'rank',
    DIb: 'lowgrade',
    Roc: ['dns', {
        host: 'host',
        gDc: 'ipv4',
        hDc: 'ipv6',
        auc: 'forceLookup',
    }],
    key: 'key',
};

/**
 * Schema for DRM header entries (used in video tracks).
 * @type {Object}
 */
const DRM_HEADER_SCHEMA = {
    la: 'bytes',
    mhc: 'checksum',
    JR: 'drmHeaderId',
    xB: 'keyId',
    resolution: ['resolution', {
        height: 'height',
        width: 'width',
    }],
};

/**
 * Schema for ad event token pairs (start/complete/stop).
 * @type {Object}
 */
const AD_EVENT_SCHEMA = {
    event: 'event',
    ay: 'adEventToken',
};

// ─── ManifestSchemaMapper ──────────────────────────────────────────────────────

/**
 * Defines the full property-mapping schema for Netflix streaming manifests
 * and delegates recursive renaming to an injected ManifestEnricher.
 */
class ManifestSchemaMapper {
    /**
     * @param {Object} enricher - Injected ManifestEnricher instance
     *                             (bound to ENRICHER_SYMBOL / "EnricherSymbol")
     */
    constructor(enricher) {
        /** @private */
        this.enricher = enricher;

        // ── Playgraph segment schema ─────────────────────────────────────

        /** @private Schema for individual playgraph segment entries. */
        this.playgraphSegmentSchema = {
            J: 'viewableId',
            programId: 'programId',
            startTimeMs: 'startTimeMs',
            contentEndPts: 'endTimeMs',
            next: ['next', {
                Mj: [ANY_PLACEHOLDER, {
                    weight: 'weight',
                    fe: 'transitionType',
                }],
            }],
            defaultNext: 'defaultNext',
            km: 'exitZones',
            main: 'main',
            type: 'type',
            fe: 'transitionType',
            playbackRate: 'playbackRate',
            weight: 'weight',
        };

        // ── Choice-map / parallel-graph sub-schema ───────────────────────

        /** @private Schema for choice-map media-type/segment entries. */
        this.choiceMediaSchema = {
            Uh: 'mediaTypes',
            initialSegment: 'initialSegment',
            segments: ['segments', {
                Mj: [ANY_PLACEHOLDER, Object.assign(
                    Object.assign({}, this.playgraphSegmentSchema),
                    {
                        next: ['next', {
                            Mj: [ANY_PLACEHOLDER, {
                                weight: 'weight',
                                fe: 'transitionType',
                                FVb: 'transitionHint',
                                Nld: 'skipRegionOffset',
                                Old: 'skipRegionWeight',
                                tpc: 'earliestSkipRequestOffset',
                            }],
                        }],
                        FVb: 'transitionHint',
                        tpc: 'earliestSkipRequestOffset',
                    },
                )],
            }],
        };

        // ── Root manifest schema ─────────────────────────────────────────

        /** @private Core manifest property-mapping schema. */
        this.manifestSchema = {
            aR: 'bookmark',
            YIb: 'manifestVersion',
            KR: 'drmType',
            qed: 'drmVersion',
            expiration: 'expiration',
            R: 'movieId',
            qcPackageId: 'packageId',
            duration: 'duration',
            playbackContextId: 'playbackContextId',

            // -- Default track ordering --
            defaultTrackOrderList: ['defaultTrackOrderList', {
                Z1: 'mediaId',
                trackIdentifier: 'videoTrackId',
                uUb: 'subtitleTrackId',
                ew: 'audioTrackId',
                ukd: 'preferenceOrder',
            }],

            // -- Media event tracks --
            mediaEventTracks: ['mediaEventTracks', {
                id: 'id',
                profile: 'profile',
                type: 'type',
                relayServers: ['relayServers', RELAY_SERVER_SCHEMA],
                streams: ['streams', {
                    sh: 'downloadable_id',
                    urls: ['urls', URL_SCHEMA],
                }],
            }],

            // -- A/B test map --
            eligibleABTestMap: ['eligibleABTestMap', {
                Mj: ANY_PLACEHOLDER,
            }],

            // -- Badging info --
            badgingInfo: ['badgingInfo', {
                jed: 'dolbyDigitalAudio',
                wgd: 'hdrVideo',
                ked: 'dolbyVisionVideo',
                Umd: 'ultraHdVideo',
                '3dVideo': '3dVideo',
                ied: 'dolbyAtmosAudio',
                ccd: 'assistiveAudio',
                lld: 'sdVideo',
                ugd: 'hdVideo',
                vgd: 'hdr10PlusVideo',
            }],

            type: 'type',

            // -- Audio/text shortcuts --
            audioTextShortcuts: ['audioTextShortcuts', {
                id: 'id',
                ew: 'audioTrackId',
                textTrackId: 'textTrackId',
            }],

            gkd: 'partiallyHydrated',
            wJb: 'maxRecommendedAudioRank',
            xJb: 'maxRecommendedTextRank',
            sessionInfoId: 'drmContextId',
            hEb: 'hasDrmProfile',
            aBc: 'hasClearProfile',
            iM: 'hasDrmStreams',
            ata: 'hasClearStreams',

            // -- CDN locations --
            locations: ['locations', {
                Gc: 'rank',
                level: 'level',
                weight: 'weight',
                key: 'key',
            }],

            links: ['links', {}],

            // -- CDN servers --
            $k: ['servers', CDN_SERVER_SCHEMA],

            // -- Audio tracks --
            audio_tracks: ['audio_tracks', {
                type: 'type',
                EV: 'subType',
                variant: 'variant',
                language: 'trackType',
                ff: 'new_track_id',
                trackIdMatch: 'track_id',
                IRc: 'profileType',
                k_c: 'stereo',
                profile: 'profile',
                channels: 'channels',
                language: 'language',
                Igc: 'channelsFormat',
                internal_Gha: 'surroundFormatLabel',
                name: 'languageDescription',
                internal_Ioc: 'disallowedSubtitleTracks',
                fxb: 'defaultTimedText',
                isNative: 'isNative',
                isNone: 'isNoneTrack',
                Acd: 'bitrates',
                Nbc: 'allowedVideoTrackId',
                relayServers: ['relayServers', RELAY_SERVER_SCHEMA],
                streams: ['streams', {
                    sh: 'downloadable_id',
                    size: 'size',
                    profileNameRef: 'content_profile',
                    language: 'trackType',
                    bitrate: 'bitrate',
                    networkKey: 'isDrm',
                    urls: ['urls', URL_SCHEMA],
                    PT: 'new_stream_id',
                    type: 'type',
                    channels: 'channels',
                    Igc: 'channelsFormat',
                    internal_Gha: 'surroundFormatLabel',
                    language: 'language',
                    hcd: 'audioKey',
                    moov: ['moov', BOX_OFFSET_SCHEMA],
                    sidx: ['sidx', BOX_OFFSET_SCHEMA],
                    ssix: ['ssix', BOX_OFFSET_SCHEMA],
                    drmSchemes: 'tags',
                    pUc: 'representationId',
                    ellaChannels: ['ellaChannels', ELLA_CHANNEL_SCHEMA],
                }],
                E$: 'codecName',
                rawTrackType: 'rawTrackType',
                id: 'id',
                rank: 'rank',
                isMissing: 'hydrated',
                MLc: 'offTrackDisallowed',
            }],

            // -- Video tracks --
            video_tracks: ['video_tracks', {
                jj: 'trackType',
                ff: 'new_track_id',
                type: 'type',
                trackIdMatch: 'track_id',
                hEb: 'hasDrmProfile',
                aBc: 'hasClearProfile',
                iM: 'hasDrmStreams',
                ata: 'hasClearStreams',
                groupName: 'groupName',
                relayServers: ['relayServers', RELAY_SERVER_SCHEMA],
                streams: ['streams', {
                    sh: 'downloadable_id',
                    size: 'size',
                    profileNameRef: 'content_profile',
                    language: 'trackType',
                    JR: 'drmHeaderId',
                    bitrate: 'bitrate',
                    networkKey: 'isDrm',
                    urls: ['urls', URL_SCHEMA],
                    PT: 'new_stream_id',
                    type: 'type',
                    ikd: 'peakBitrate',
                    Boc: 'dimensionsCount',
                    Coc: 'dimensionsLabel',
                    p2a: 'pix_w',
                    o2a: 'pix_h',
                    u4a: 'res_w',
                    gza: 'res_h',
                    xwb: 'crop_x',
                    ywb: 'crop_y',
                    wwb: 'crop_w',
                    vwb: 'crop_h',
                    FUa: 'framerate_value',
                    EUa: 'framerate_scale',
                    ATb: 'startByteOffset',
                    vmaf: 'vmaf',
                    moov: ['moov', BOX_OFFSET_SCHEMA],
                    sidx: ['sidx', BOX_OFFSET_SCHEMA],
                    ssix: ['ssix', BOX_OFFSET_SCHEMA],
                    segmentVmaf: ['segmentVmaf', {
                        offset: 'offset',
                        vmaf: 'vmaf',
                    }],
                    drmSchemes: 'tags',
                    pUc: 'representationId',
                    ellaChannels: ['ellaChannels', ELLA_CHANNEL_SCHEMA],
                }],
                IRc: 'profileType',
                k_c: 'stereo',
                profile: 'profile',
                Boc: 'dimensionsCount',
                Coc: 'dimensionsLabel',
                snippets: ['snippets', {
                    Mj: [ANY_PLACEHOLDER, {
                        Pld: 'snippetSpec',
                        startTimeMs: 'startTimeMs',
                        contentEndPts: 'endTimeMs',
                    }],
                }],
                drmHeader: ['drmHeader', DRM_HEADER_SCHEMA],
                prkDrmHeaders: ['prkDrmHeaders', DRM_HEADER_SCHEMA],
                flavor: 'flavor',
                Qgd: 'ict',
                maxWidth: 'maxWidth',
                maxHeight: 'maxHeight',
                HNb: 'pixelAspectX',
                INb: 'pixelAspectY',
                Iid: 'maxCroppedWidth',
                Hid: 'maxCroppedHeight',
                Jid: 'maxCroppedX',
                Kid: 'maxCroppedY',
                qea: 'max_framerate_value',
                pea: 'max_framerate_scale',
                minWidth: 'minWidth',
                minHeight: 'minHeight',
                ijd: 'minCroppedWidth',
                hjd: 'minCroppedHeight',
                jjd: 'minCroppedX',
                kjd: 'minCroppedY',
                isMissing: 'hydrated',
                rank: 'rank',
                license: ['license', {
                    aGc: 'licenseResponseBase64',
                    Ekd: 'providerSessionToken',
                    rld: 'secureStopExpected',
                    ped: 'drmSessionId',
                    oed: 'drmGroupId',
                    links: ['links', {}],
                }],
            }],

            // -- CDN response data --
            cdnResponseData: ['cdnResponseData', {
                lV: 'sessionABTestCell',
                pbcid: 'pbcid',
            }],

            // -- Choice map (branching / interactive) --
            choiceMap: ['choiceMap', Object.assign(
                Object.assign({}, this.choiceMediaSchema),
                {
                    type: 'type',
                    J: 'viewableId',
                    fe: 'transitionType',
                    FVb: 'transitionHint',
                    N3c: 'uxlabel',
                    parallelGraphs: ['parallelGraphs', {
                        Mj: [ANY_PLACEHOLDER, this.choiceMediaSchema],
                    }],
                },
            )],

            // -- Content playgraph --
            contentPlaygraph: ['contentPlaygraph', {
                Z: ['playgraph', {
                    Ef: 'initialSegment',
                    fe: 'transitionType',
                    N3c: 'uxlabel',
                    segments: ['segments', {
                        Mj: [ANY_PLACEHOLDER, this.playgraphSegmentSchema],
                    }],
                }],
                startIdent: ['startIdent', {
                    Rgd: 'identToken',
                    J: 'viewableId',
                }],
            }],

            // -- Media descriptor --
            media: ['media', {
                id: 'id',
                tracks: ['tracks', {
                    V: 'AUDIO',
                    TEXT_MEDIA_TYPE: 'TEXT',
                    U: 'VIDEO',
                }],
            }],

            // -- Recommended media --
            recommendedMedia: ['recommendedMedia', {
                eo: 'videoTrackId',
                ew: 'audioTrackId',
                timedTextTrackId: 'timedTextTrackId',
            }],

            // -- Timed text (subtitle) tracks --
            timedtexttracks: ['timedtexttracks', {
                jj: 'trackType',
                ff: 'new_track_id',
                type: 'type',
                EV: 'subType',
                variant: 'variant',
                rawTrackType: 'rawTrackType',
                name: 'languageDescription',
                language: 'language',
                id: 'id',
                isNone: 'isNoneTrack',
                mda: 'isForcedNarrative',
                downloadableIds: ['downloadableIds', {}],
                Lmd: 'trackVariant',
                Ged: 'encodingProfileNames',
                Nbc: 'allowedVideoTrackId',
                cdnlist: ['cdnlist', CDN_SERVER_SCHEMA],
                ttDownloadables: ['ttDownloadables', {
                    Mj: [ANY_PLACEHOLDER, {
                        id: 'id',
                        size: 'size',
                        mmd: 'textKey',
                        tgd: 'hashValue',
                        sgd: 'hashAlgo',
                        jhd: 'isImage',
                        offset: 'midxOffset',
                        size: 'midxSize',
                        height: 'height',
                        width: 'width',
                        downloadUrls: ['downloadUrls', {}],
                        urls: ['urls', {
                            url: 'url',
                            urlId: 'cdn_id',
                            G1: 'liveOcaCapabilities',
                        }],
                    }],
                }],
                trackLanguage: 'isLanguageLeftToRight',
                iB: 'headIdentDuration',
                rank: 'rank',
                isMissing: 'hydrated',
            }],

            // -- Trickplay (thumbnail) tracks --
            trickplays: ['trickplays', {
                sh: 'downloadable_id',
                size: 'size',
                urls: 'urls',
                id: 'id',
                interval: 'interval',
                kPc: 'pixelsAspectY',
                jPc: 'pixelsAspectX',
                width: 'width',
                height: 'height',
                iB: 'headIdentDuration',
                Tgd: 'imageCount',
            }],

            // -- Watermark info --
            watermarkInfo: ['watermarkInfo', {
                opacity: 'opacity',
                id: 'id',
                anchor: 'anchor',
            }],

            ned: 'dpsid',
            isSeeking: 'isBranching',
            snd: 'viewableType',
            execPointer: 'isAd',
            PRE_FETCH: 'isSupplemental',
            clientIpAddress: 'clientIpAddress',
            Zmd: 'urlExpirationDuration',
            vid: 'manifestExpirationDuration',

            // -- Steering additional info --
            steeringAdditionalInfo: ['steeringAdditionalInfo', {
                Wld: 'steeringId',
                Obd: 'additionalGroupNames',
                streamingClientConfig: ['streamingClientConfig', {}],
                stickySteeringMetadata: ['stickySteeringMetadata', {
                    tB: 'isSteeringSticky',
                    xAa: 'stickySteeringToken',
                }],
                oZc: 'slowInitialBufferingSignal',
                liveEdgeCushionWithSpreadMs: 'liveEdgeCushionWithSpreadMs',
            }],

            auxiliaryManifestToken: 'auxiliaryManifestToken',

            // -- Live metadata --
            liveMetadata: ['liveMetadata', {
                Iqa: ['downloadableIdToSegmentTemplateId', {
                    Mj: ANY_PLACEHOLDER,
                }],
                segmentTemplateIdToSegmentTemplate: ['segmentTemplateIdToSegmentTemplate', {
                    Mj: [ANY_PLACEHOLDER, {
                        XQ: 'availabilityStartTime',
                        OCc: 'initialization',
                        media: 'media',
                        KQc: 'presentationTimeOffset',
                        FTb: 'startNumber',
                        duration: 'duration',
                        O: 'timescale',
                    }],
                }],
                KLc: 'ocLiveWindowDurationSeconds',
                kra: 'eventAvailabilityOffsetMs',
                liveEventStartTime: 'eventStartTime',
                liveEventEndTime: 'eventEndTime',
                internal_Jxb: 'disableLiveUi',
                maxBitrate: 'maxBitrate',
                XQ: 'availabilityStartTime',
                iWc: 'segmentAvailabilityWindowSeconds',
            }],

            // -- Media event history --
            mediaEventHistory: ['mediaEventHistory', {
                O: 'timescale',
                internal_Zdc: 'baseTimeMs',
                internal_Wmc: 'cutoffTimeMs',
                mediaEvents: ['mediaEvents', {
                    type: 'type',
                    id: 'id',
                    timestamp: 'timestamp',
                    duration: 'duration',
                    internal_Zp: 'segmentationTypeId',
                    hb: 'adBreakTriggerId',
                    applicationScope: 'applicationScope',
                }],
            }],

            manifestType: 'streamingType',

            // -- Timecode annotations --
            timecodeAnnotations: ['timecodeAnnotations', {
                xrc: 'endOffsetMs',
                r4: 'startOffsetMs',
                type: 'type',
            }],

            // -- Chapters --
            chapters: ['chapters', {
                r4: 'startOffsetMs',
                title: 'title',
            }],

            pOb: 'prefetchTtl',
            auxiliaryManifests: 'auxiliaryManifests',
            adverts: 'adverts',
            LXa: 'ignoreUserTextPreferences',

            // -- ELLA (Enhanced Low-Latency Algorithm) --
            ella: ['ella', {
                P0a: 'obfuscationKey',
                L8a: 'verificationKey',
                relayServers: ['relayServers', RELAY_SERVER_SCHEMA],
            }],
        };

        // ── Ad break schema ──────────────────────────────────────────────

        /** @private Schema for a single ad break. */
        this.adBreakSchema = {
            Xu: 'locationMs',
            adBreakToken: 'adBreakToken',
            hb: 'adBreakTriggerId',
            yu: 'embedded',
            rQc: 'prefetchWindowOffsetMs',
            EPb: 'refreshCache',
            qQc: 'prefetchWindowDurationMs',
            qo: 'autoSkip',
            uxDisplay: ['uxDisplay', {
                oXb: 'uxIndication',
                zBa: 'uxPlayerControl',
            }],
            duration: ['ads', {
                id: 'id',
                startTimeMs: 'startTimeMs',
                contentEndPts: 'endTimeMs',
                timedAdEvents: ['timedAdEvents', {
                    event: 'event',
                    ay: 'adEventToken',
                    fq: 'timeMs',
                }],
                actionAdEvents: ['actionAdEvents', {
                    start: ['start', AD_EVENT_SCHEMA],
                    complete: ['complete', AD_EVENT_SCHEMA],
                    aseTimer: ['stop', AD_EVENT_SCHEMA],
                }],
                qo: 'autoSkip',
                c1: 'is3pVerificationEnabled',
                thirdPartyVerificationToken: 'thirdPartyVerificationToken',
                uiComponent: ['uiComponent', {
                    Lbd: 'adImpressionMetadataId',
                    Tmd: 'uiToken',
                    Smd: 'uiLoadDelayMaxMs',
                }],
            }],
            actionAdBreakEvents: ['actionAdBreakEvents', {
                complete: ['complete', AD_EVENT_SCHEMA],
                start: ['start', AD_EVENT_SCHEMA],
                aseTimer: ['stop', AD_EVENT_SCHEMA],
            }],
            eZ: 'auditPingUrl',
        };

        // ── Adverts (top-level ad container) schema ──────────────────────

        /** @private Schema for the top-level adverts object. */
        this.advertsSchema = {
            cc: ['adBreaks', this.adBreakSchema],
            eZ: 'auditPingUrl',
            OQb: 'retainAdBreaks',
            adBreakCacheUpdates: ['adBreakCacheUpdates', {
                Mj: [ANY_PLACEHOLDER, {
                    action: 'action',
                    adBreak: ['adBreak', this.adBreakSchema],
                }],
            }],
            hasAdverts: 'daiSupported',
            exb: 'defaultPrefetchWindowDurationMs',
            internal_Enc: 'defaultPrefetchWindowOffsetMs',
            MCc: 'initialPrefetchWindowDurationMs',
            NCc: 'initialPrefetchWindowOffsetMs',
            vNc: 'orderedAdBreakTriggerIds',
        };

        // ── Full manifest schema (core + auxiliary + adverts) ────────────

        /**
         * @private
         * Complete schema: merges the core manifest schema with auxiliary-
         * manifest and adverts sub-schemas.
         */
        this.fullManifestSchema = Object.assign(
            Object.assign({}, this.manifestSchema),
            {
                Gq: ['auxiliaryManifests', this.manifestSchema],
                adverts: ['adverts', this.advertsSchema],
            },
        );
    }

    // ─── Public API ────────────────────────────────────────────────────────

    /**
     * Parse (enrich) a raw manifest object by recursively renaming its
     * obfuscated wire-format keys according to the full manifest schema.
     *
     * @param {Object} manifest - The raw manifest object from the Netflix API
     */
    parseManifest(manifest) {
        this.enricher.parseManifest(manifest, this.fullManifestSchema);
    }
}

// ─── Dependency Injection Decorators ───────────────────────────────────────────

const DecoratedManifestSchemaMapper = __decorate(
    [
        injectable(),
        __param(0, inject(ENRICHER_SYMBOL)),
    ],
    ManifestSchemaMapper,
);

export { DecoratedManifestSchemaMapper as ManifestSchemaMapper };
export default ManifestSchemaMapper;
