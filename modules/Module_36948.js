/**
 * Netflix Cadmium Playercore - Module 36948
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 */

// Webpack module 36948
// Parameters: t (module), b (exports), N/A (require)

export const fRa = {
    zea: ["minCheckBufferingCompleteInterval", 200],
    Hyb: ["enableMoreFrequentBufferingCompleteCheck", false],
    maa: ["defaultAacTimestampOffset", {
        ticks: -3268,
        timescale: 48E3
    }],
    Lfa: ["profileTimestampOffsets", {
        "heaac-2-dash": {
            64: {
                ticks: -3268,
                timescale: 48E3
            },
            96: {
                ticks: -3268,
                timescale: 48E3
            }
        },
        "heaac-2hq-dash": {
            128: {
                ticks: -3268,
                timescale: 48E3
            }
        },
        "heaac-5.1-dash": {
            192: {
                ticks: -3268,
                timescale: 48E3
            }
        }
    }],
    eU: ["paddingCodecSelector", "strict"],
    Xn: ["stallAtFrameCount", undefined],
    Iga: ["saveBitrateMs", 0],
    vga: ["requireDownloadDataAtBuffering", false],
    fFb: ["indicatorForDownloadDataAtBuffering", "oncomplete"],
    wga: ["requireSetupConnectionDuringBuffering", false],
    dN: ["maxRequestSize", 0],
    Iyb: ["enableNginxRateLimit", false],
    Vea: ["nginxSendingRate", 4E4],
    Laa: ["enableCprAudio", false],
    GH: ["enableCprVideo", true],
    Cyb: ["enableCprLive", false],
    vqc: ["enableCprDai", false],
    wqc: ["enableCprSvodAd", false],
    Oaa: ["enableHybridPacing", false],
    hpa: ["catchUpMode", false],
    KIc: ["maxSegHint", 4],
    dza: ["requestLevelLogging", false],
    eTa: ["enableConcurrentStreamingHandling", false],
    Yqc: ["enablePacingOnSwitchableAudio", false],
    pr: ["pipelineEnabled", true],
    Jyb: ["enableSCByteRangeHints", false],
    jJ: ["segmentFadeDuration", 400],
    NE: ["maxPrebufSize", 5E4],
    Pp: ["minPrebufSize", 5756],
    Fea: ["minimumJustInTimeBufferLevel", 3E3],
    Fed: ["enableMissingSegmentsDetection", true],
    SR: ["enableMissingSegmentsReplacement", true],
    Uqc: ["enableNextSegmentSizeFromOC", true],
    eva: ["liveSwitchStreamsOnErrorInPipeline", true],
    zGc: ["liveEdgeRetryWindowMs", 6E3],
    tV: ["simulateLiveEdge", false],
    cZc: ["simulateLiveEdgeDistance", 0],
    Uva: ["minVideoMediaRequestSizeBytes", 0],
    Pva: ["minAudioMediaRequestSizeBytes", 0],
    RIc: ["maxVideoMediaRequestSizeBytes", Infinity],
    uIc: ["maxAudioMediaRequestSizeBytes", Infinity],
    QE: ["minVideoMediaRequestDuration", 0],
    LB: ["minAudioMediaRequestDuration", 0],
    Tva: ["minMediaRequestDuration", 0],
    zva: ["maxMediaRequestDuration", Infinity],
    QIc: ["maxVideoMediaRequestDuration", Infinity],
    tIc: ["maxAudioMediaRequestDuration", Infinity],
    ROa: ["allowFirstRequestAggregation", false],
    rVc: ["reuseOnErrorCacheTimeout", 6E4],
    FIc: ["maxMediaRequestSizeBytesInFraction", 1],
    Bia: ["useExitZones", true],
    dIb: ["liveEndSlateMaxDuration", 6E4],
    GAa: ["ase_stream_selector", "optimized"],
    udc: ["audiostreamSelectorAlgorithm", "selectaudioadaptive"],
    Lda: ["liveStreamSelectorAlgorithm", "livesimple"],
    zda: ["jointStreamSelectorEnabled", false],
    rTb: ["smartHeaderPreDownloading", false],
    g2: ["minBufferLenForHeaderDownloading", 1E4],
    O$: ["connectTimeMultiplier", 1],
    HB: [["lowestWaterMarkLevel", "lowestWatermarkLevel"], 3E4],
    $da: ["lowestWaterMarkLevelBufferRelaxed", false],
    Vy: ["minRequiredBuffer", 2E4],
    CI: ["maxTrailingBufferLen", 15E3],
    BI: ["maxMediaBufferAllowed", 27E4],
    lAa: ["simulationDurationStrategy", "default"],
    dZc: ["simulationFullBufferPercentage", 1],
    jKb: ["minSimulationDuration", 2E4],
    Cva: ["maxSimulationDuration", 3E5],
    Gca: ["highStreamRetentionWindow", 9E4],
    Uda: ["lowStreamTransitionWindow", 51E4],
    Ica: ["highStreamRetentionWindowUp", 5E5],
    Wda: ["lowStreamTransitionWindowUp", 1E5],
    Hca: ["highStreamRetentionWindowDown", 6E5],
    Vda: ["lowStreamTransitionWindowDown", 0],
    Fca: ["highStreamInfeasibleBitrateFactor", .5],
    fba: ["fastDownswitchFactor", 3],
    b0: ["fastUpswitchFactor", 3],
    Hsc: ["fastUpswitchFactorWithoutHeaders", 3],
    Gsc: ["fastUpswitchFactorForNextSegment", 1],
    S$: ["considerConnectTime", true],
    GB: ["lowestBufForUpswitch", 9E3],
    qT: ["lockPeriodAfterDownswitch", 15E3],
    Yda: ["lowWatermarkLevel", 15E3],
    pha: ["skipBitrateInUpswitch", false],
    Via: ["watermarkLevelForSkipStart", 8E3],
    D_c: ["streamSelectionTrace", [{
        f: 60,
        s: 5
    }, {
        f: 61,
        s: 3
    }, {
        f: 62,
        s: 2
    }, {
        f: 63,
        s: 0
    }]],
    zyb: ["enableAllHeadersPreDownloading", false],
    drc: ["enableStreamSelectionAugmentData", false],
    zdc: ["augmentDataNumOfChunks", 30],
    ljd: ["minFragmentVmaf", undefined],
    Mda: ["liveStreamSelectorUseLatency", true],
    Mua: ["latencyMultiplierForLive", 4],
    OFc: ["latencyAverageMultiplierForLive", 1],
    RUb: ["throughputDiscountForLive", .8],
    QUb: ["throughputDiscountExponentBC", 1.5],
    Vua: ["liveBufferRatioStrategy", "strict"],
    a1c: ["throughputThresholdSelectorParam", 0],
    zNa: ["reportedFilters", []],
    s$: ["bufferingSelectorAlgorithm", "default"],
    VWb: ["upswitchDuringBufferingFactor", 2],
    xrb: ["allowUpswitchDuringBuffering", false],
    $ua: ["liveMaxUpswitchSteps", Infinity],
    cLb: ["noRepeatedFirstSelectionLogic", false],
    Hnc: ["defaultThroughput", 1537],
    Uy: ["minInitVideoBitrate", -Infinity],
    IB: ["maxInitVideoBitrate", Infinity],
    Ty: ["minInitAudioBitrate", -Infinity],
    $u: ["maxInitAudioBitrate", Infinity],
    HT: ["minAcceptableVideoBitrate", -Infinity],
    GT: ["minAcceptableVMAF", 0],
    AJc: ["minAcceptableVMAFRebufferScalingFactor", 0],
    IT: ["minAllowedVideoBitrate", -Infinity],
    hea: ["maxAllowedVideoBitrate", Infinity],
    K_a: ["maxSegmentBitrate", Infinity],
    II: ["minAllowedVmaf", -Infinity],
    hJb: ["maxAllowedVmaf", Infinity],
    i2: ["minRequiredAudioBuffer", 0],
    rM: ["initialBitrateSelectionCurve", null],
    MV: ["throughputPercentForAudio", 15],
    h$: ["bandwidthMargin", 0],
    j$: ["bandwidthMarginCurve", [{
        m: 20,
        b: 15E3
    }, {
        m: 17,
        b: 3E4
    }, {
        m: 10,
        b: 6E4
    }, {
        m: 5,
        b: 12E4
    }]],
    Jsb: ["bandwidthMarginCurveAudio", {
        min: .7135376,
        max: .85,
        oH: 76376,
        scale: 18862.4,
        gamma: 3.0569
    }],
    i$: ["bandwidthMarginContinuous", false],
    Ksb: ["bandwidthMarginForAudio", true],
    Jha: ["switchConfigBasedOnInSessionTput", true],
    P$: ["conservBandwidthMargin", 20],
    R$: ["conservBandwidthMarginTputThreshold", 6E3],
    Q$: ["conservBandwidthMarginCurve", [{
        m: 25,
        b: 15E3
    }, {
        m: 20,
        b: 3E4
    }, {
        m: 15,
        b: 6E4
    }, {
        m: 10,
        b: 12E4
    }, {
        m: 5,
        b: 24E4
    }]],
    BA: ["bandwidthManifold", {
        curves: [{
            min: .05,
            max: .82,
            oH: 7E4,
            scale: 178E3,
            gamma: 1.16
        }, {
            min: 0,
            max: .03,
            oH: 15E4,
            scale: 16E4,
            gamma: 3.7
        }],
        threshold: 14778,
        gamma: 2.1,
        niqrcurve: {
            min: 1,
            max: 1,
            center: 2,
            scale: 2,
            gamma: 1
        },
        filter: "throughput-sw",
        niqrfilter: "throughput-iqr",
        simpleScaling: true
    }],
    BJb: ["maxStartingVideoVMAF", 110],
    Tw: ["minStartingVideoVMAF", 1],
    EY: ["activateSelectStartingVMAF", false],
    Oza: ["selectStartingVMAFTDigest", -1],
    jO: ["selectStartingVMAFMethod", "fallback"],
    LRb: ["selectStartingVMAFMethodCurve", {
        log_p50: [6.0537, -.8612],
        log_p40: [5.41, -.7576],
        log_p20: [4.22, -.867],
        sigmoid_1: [11.0925, -8.0793]
    }],
    Vfa: ["rebufferingFactor", 1],
    v3: ["rebufferCheckDuration", 6E4],
    Cia: ["useMaxPrebufSize", true],
    jva: ["lowThroughputThreshold", 400],
    lra: ["excludeSessionWithoutHistoryFromLowThroughputThreshold", false],
    Zqc: ["enablePenaltyForLongConnectTime", false],
    Mxa: ["penaltyFactorForLongConnectTime", 2],
    iva: ["longConnectTimeThreshold", 200],
    Wna: ["additionalBufferingLongConnectTime", 2E3],
    Xna: ["additionalBufferingPerFailure", 8E3],
    $s: ["maxBufferingTime", 2E3],
    v8a: ["upperThroughputPredictionFactor", 1.6],
    CT: ["mediaRate", 1.5],
    e1c: ["timeAtEachBitrateRoundRobin", 1E4],
    yVc: ["roundRobinDirection", "forward"],
    sva: ["marginPredictor", "simple"],
    irc: ["enableVmafEstimationFromBitrate", false],
    OIc: ["maxVMAFMappingBitrate", 16E3],
    PIc: ["maxVMAFMappingVMAF", 110],
    mPa: ["audioBwFactor", 1],
    wdc: ["audioSwitchConfig", {
        upSwitchFactor: 5.02,
        downSwitchFactor: 3.76,
        lowestBufForUpswitch: 16E3,
        lockPeriodAfterDownswitch: 16E3
    }],
    xdc: ["audioSwitchConfigLive", {
        upSwitchFactor: 2.5,
        downSwitchFactor: 1.3,
        lowestBufForUpswitch: 6E3,
        lockPeriodAfterDownswitch: 3E4
    }],
    vJ: ["switchableAudioProfilesOverride", [{
        profiles: ["ddplus-5.1-dash", "ddplus-5.1hq-dash"],
        override: {
            maxInitAudioBitrate: 192
        }
    }, {
        profiles: ["ddplus-atmos-dash"],
        override: {
            minInitAudioBitrate: 448,
            maxInitAudioBitrate: 448,
            minAudioBitrate: 448
        }
    }]],
    Aoa: ["audioProfilesOverride", [{
        profiles: ["ddplus-5.1-dash", "ddplus-5.1hq-dash"],
        override: {
            maxInitAudioBitrate: 256,
            audioBwFactor: 5.02
        }
    }, {
        profiles: ["ddplus-atmos-dash"],
        override: {
            maxInitAudioBitrate: 448
        }
    }]],
    Tua: ["limitAudioDiscountByMaxAudioBitrate", false],
    oT: ["liveSlowBufferFilling", false],
    YGc: ["liveSlowBufferFillingMinBitrate", 1200],
    TGc: ["liveResyncClockOn404Error", true],
    Uqa: ["enableConditionalServerTimeUpdate", true],
    hwa: ["negligibleServerTimeDeltaDifference", 1E3],
    mwa: ["networkMeasurementGranularity", "video_location"],
    zIc: ["maxFragsForFittableOnBranching", 300],
    ci: ["applyProfileStreamingOffset", true],
    jRb: ["sanitizeMediaVideoFrameDuration", true],
    jrc: ["enableWsslEstimate", false],
    IIc: ["maxRequestsToAttachOnBranchActivation", undefined],
    iTa: ["enableManagerDebugTraces", false],
    kAa: ["simulatePartialBlocks", true],
    eIb: ["liveInitialFetchSizeBytes", 1024],
    aHc: ["liveTextInitialFetchSizeBytes", 40],
    CGc: ["liveEditInitialFetchSizeBytes", 4096],
    kU: ["perFragmentVMAFConfig", {
        enabled: false,
        earlyManifestProcessing: false
    }],
    $Hb: ["liveAdjustAudioTimestamps", false],
    Zpa: ["debugFragmentTimes", false],
    Zqa: ["enableTwoPartLiveFragmentEditing", true],
    iOc: ["parseAdditionalBoxesMp4Header", true],
    gjd: ["minAudioMediaRequestDurationCache", 0],
    ojd: ["minVideoMediaRequestDurationCache", 0],
    fTa: ["enableForcedJsRequests", false],
    SJc: ["missedRequestFailureTimeout", 5E3],
    eJb: ["markRequestActiveOnFirstByte", false],
    l5: ["useNativeDataViewMethods", true],
    nwa: ["networkRequestRetryDelay", 500],
    xKc: ["networkRequestRetryMinJitter", 100],
    wKc: ["networkRequestRetryMaxJitter", 2E3],
    M7a: ["translateToVp9Draft", false],
    b4a: ["reorderTrakMvex", false],
    BFb: ["insertSilentFrames", 0],
    ofd: ["forceDiscontinuityAtTransition", true],
    cmd: ["supportAudioResetOnDiscontinuity", undefined],
    bmd: ["supportAudioEasingOnDiscontinuity", undefined],
    Pid: ["maxWsslRequestSize", 131072],
    Oid: ["maxWsslRequestRatio", .2],
    Wua: ["liveEarlyRequestProbability", 0],
    Jda: ["liveEarlyRequestDefaultOffsetMs", -500],
    F4: ["supportLiveIdrMismatch", false],
    J4: ["synthesizeLiveIdrMismatch", 0],
    xqc: ["enableCsprNonPipelined", false],
    uqc: ["enableCprAudioNonPipelined", false],
    Maa: ["enableCprVideoNonPipelined", false],
    Xqc: ["enablePaceReportLogging", false],
    WNc: ["paceRateSelectorAlgorithm", "regression"],
    XNc: ["paceRateSelectorAlgorithmAudio", "default"],
    YNc: ["paceRateSelectorAlgorithmNonPipelined", "default"],
    STb: ["staticPacingRateKbps", 0],
    upa: ["clientPacingParams", {
        minRequiredBuffer: 0,
        rateDiscountFactors: [1, 1, 1],
        lowestAllowedRateFactor: 1,
        lowestAllowedFragmentBitrateFactors: [0, 0, 0]
    }],
    p2c: ["unpacedFragmentInterval", 0],
    BTc: ["regressionAlgoPacingCoefficients", [{
        playerStates: [0, 1, 2],
        networkConfidence: [],
        bufferLevelPct: 0,
        coefficients: {
            offset: 0
        }
    }, {
        playerStates: [],
        networkConfidence: [0, 1, 2],
        bufferLevelPct: 0,
        coefficients: {
            offset: 0
        }
    }, {
        playerStates: [],
        networkConfidence: [],
        bufferLevelPct: 0,
        coefficients: {
            maxAverageBitrate: 6.4
        }
    }, {
        playerStates: [],
        networkConfidence: [],
        bufferLevelPct: 1,
        coefficients: {
            maxAverageBitrate: 2.8
        }
    }]],
    K0c: ["targetBufferLevelStddevMultiplier", 1],
    J0c: ["targetBufferLevelDurationMs", 0],
    $Nc: ["pacingTargetBufferStrategy", "capacityPercentage"],
    KJc: ["minTargetBufferLevelMs", 27E4],
    fwa: ["needMinimumNetworkConfidence", true],
    Noa: ["biasTowardHistoricalThroughput", false],
    yGc: ["liveDvrSwitchThresholdms", 1E4],
    YI: ["probeServerWhenError", false],
    Gfa: ["probeBeforeSwitchingBackToPrimary", true],
    h2: ["minIntervalForSwitchingBackToPrimary", 6E4],
    jea: ["maxIntervalForSwitchingBackToPrimary", 96E4],
    D_: ["enableInitialThroughputHistory", true],
    tHc: ["locationSelectorPersistFailures", true],
    Qda: ["locationStatisticsUpdateInterval", 6E4],
    NBc: ["httpsConnectErrorAsPerm", false],
    Rha: ["throttledNetworkFailureThresholdMs", 2E3],
    oea: ["maxThrottledNetworkFailures", 5],
    kwa: ["networkFailureResetWaitMs", 2E3],
    iea: ["maxBufferingTimeAllowedWithNetworkError", 6E4],
    bUc: ["replicateErrorDirectorInitialBuffering", true],
    jwa: ["networkFailureAbandonMs", 6E4],
    QQ: ["allowSwitchback", true],
    S1: ["maxDelayToReportFailure", 300],
    wya: ["probeRequestTimeoutMilliseconds", 3E4],
    Bkd: ["probeRequestConnectTimeoutMilliseconds", 8E3],
    vya: ["probeDetailDenominator", 100],
    Bea: ["minProbeIntervalMs", 2E3],
    Eea: ["minStreamableConcurrencyWindow", 3E3],
    MIc: ["maxStreamableConcurrencyWindow", Infinity],
    Aha: ["streamableConcurrencyFactor", .3],
    cR: ["bufferingConcurrencyWindow", 7800],
    tPb: ["rebufferRiskHalfLife", 1E4],
    C_: ["enableDiscontiguousBuffering", false],
    P1: ["maxAllowedOutstandingRequests", 4],
    dva: ["liveRequestSpreadMs", 0],
    C1: ["liveEdgeCushionWithSpreadMs", 0],
    Xqa: ["enableLive504Handling", false],
    cq: ["switchableAudioProfiles", []],
    nea: ["maxRebufSize", Infinity],
    h3: ["prebufferTimeLimit", 6E4],
    V9: ["audioBufferTargetAvailableSize", 262144],
    Jia: ["videoBufferTargetAvailableSize", 1048576],
    VDb: ["graphSelectorSetAudioRate", false],
    lFc: ["jointStreamCreationAlgorithm", "optimized"],
    nKb: ["minimumBufferingCompleteInterval", 1E4],
    Fec: ["bufferingCompleteOnMemoryLimit", false],
    xva: ["maxFastPlayBufferInMs", 2E4],
    jJb: ["maxBufferingCompleteBufferInMs", Infinity],
    JPc: ["playgraphDefaultWeight", 65520],
    e0a: ["minimumDownstreamBranchProbability", .075],
    PR: ["enableCombinedPlaygraphs", true],
    $D: ["enableAdPlaygraphs", true],
    RR: ["enableLiveAdPlaygraphs", true],
    qy: ["enableLiveProgramPlaygraphs", false],
    F_: ["enableLiveProgramPlaygraphsForLinear", true],
    GPa: ["branchCreationThreshold", 12E4],
    qec: ["branchDistanceThreshold", 6E4],
    Anc: ["defaultBranchOffsetEnabled", true],
    Bnc: ["defaultBranchOffsetMs", 1E4],
    PJc: ["minimumContentStartTimestampForBranchOffsetMs", 864E5],
    A4c: ["waitForDrmToAppendHeadersWhenClearAndEncryptedContent", false],
    AT: ["maxTotalBufferLevelPerSession", 0],
    Jbc: ["allowParallelStreaming", true],
    hqa: ["defaultHeaderCacheSize", 4],
    gqa: ["defaultHeaderCacheDataPrefetchMs", 0],
    qFc: ["keepWishListOnExpiration", true],
    $kd: ["reuseOnErrorCacheSize", 1],
    RIb: ["manifestCacheDormantCacheEnabled", true],
    THc: ["manifestCacheReuseOnErrorEnabled", true],
    bva: ["livePrefetchEnabled", false],
    cva: ["livePrefetchEnabledForStickySteering", true],
    oQc: ["prefetchWeightBudget", 32],
    pQc: ["prefetchWhilePlaying", true],
    wQc: ["prefetcherSoftReset", true],
    kQc: ["prefetchBudgetInBytes", 0],
    Rxa: ["pipelineHealthThresholdCriticalMs", 2E3],
    Sxa: ["pipelineHealthThresholdLowMs", 6E3],
    UR: ["enableRequestAbandonment", false],
    oga: ["requestAbandonmentLockIntervalMs", 1E4],
    FAa: ["streamModeAppendAttachThreshold", .75],
    oYc: ["shareDownloadTracks", true],
    pYc: ["shareOpenRangeTracks", false],
    D3c: ["usePipelineForAudio", false],
    C3c: ["usePipelineDetectionForAudio", false],
    E3c: ["usePipelineForBranchedAudio", true],
    F3c: ["usePipelineForText", true],
    Bva: ["maxParallelConnections", 3],
    O1: ["maxActiveRequestsPerSession", undefined],
    Cea: ["minRequestSize", 65536],
    p6a: ["socketReceiveBufferSize", 0],
    Y9: ["audioSocketReceiveBufferSize", 32768],
    Pia: ["videoSocketReceiveBufferSize", 65536],
    X0c: ["textSocketReceiveBufferSize", 32768],
    eXb: ["usePipelineDetectionForVideo", false],
    LJc: ["minVideoSocketReceiveBufferSize", 65536],
    qta: ["headersSocketReceiveBufferSize", 32768],
    Doc: ["disableHeaderDownloadTracks", false],
    w4: ["streamFilteringRules", {
        enabled: false,
        profiles: ["playready-h264mpl40-dash"],
        action: "keepLowest"
    }],
    REb: ["ignoreUserFilterOnEmptyResult", true],
    K_: ["enableResolutionVMAFStreamFilter", false],
    pfa: ["percentCapTitlesForResolutionVMAFStreamFilter", 100],
    K3: ["resolutionVMAFCappingRuleList", []],
    j5: ["useLiveBitrateDynamicCap", true],
    m5: ["useProbabilisticLiveBitrateDynamicCap", false],
    k5: ["useLiveBitrateDynamicCapForDai", true],
    vcc: ["aseDiagnostics", [{
        ic: "queue-audit",
        enabled: true
    }, {
        ic: "task-audit",
        enabled: true
    }, {
        ic: "trace-ShimSession",
        enabled: true
    }, {
        ic: "trace-engine",
        enabled: true
    }, {
        ic: "trace-RequestPacer",
        enabled: true
    }, {
        ic: "trace-BufferStateTracker",
        enabled: true
    }, {
        ic: "trace-GraphStreamingProcess",
        enabled: true
    }, {
        ic: "trace-AsePlaygraph",
        enabled: true
    }, {
        ic: "playgraph-branch-audit",
        enabled: true
    }, {
        ic: "content-playgraph",
        enabled: true
    }, {
        ic: "trace-CphAsePlaygraph",
        enabled: true
    }, {
        ic: "trace-GraphLocation",
        enabled: true
    }, {
        ic: "cache-ads::gls",
        enabled: true
    }, {
        ic: "cache-content::gls",
        enabled: true
    }, {
        ic: "trace-LiveOCSideChannel",
        enabled: true
    }, {
        ic: "trace-media-events-provider",
        enabled: true
    }, {
        ic: "trace-Prefetcher",
        enabled: true
    }, {
        ic: "trace-AdBreakHydrator",
        enabled: true
    }]],
    oqc: ["enableAseReporting", true],
    iJc: ["memDeadlockShouldCheckMemory", true],
    hJc: ["memDeadlockOverageThreshold", .9],
    gJc: ["memDeadlockMaxUtilizationPercentage", .5],
    mqc: ["enableAdLruCaches", false],
    vxa: ["paddingMediaType", "padding"],
    uxa: ["paddingDurationMs", 1E3],
    EIc: ["maxLiveDAIReplacedMismatchDurationMs", 2100],
    J_: ["enablePrerollForInitialSeek", false],
    CTc: ["rehydrateSkippableAdBreaks", true],
    dba: ["exposeDroppedAdsToUI", false],
    YBc: ["hydrateWaitTimeBetweenAdBreaksMs", 5E3],
    vJb: ["maxPlayerDistancePriorToAdBreakHydrationMs", 6E4],
    cba: ["excludedContentPlaygraphIds", []],
    $rb: ["aseGcSettings", {
        segmentPresenting: true,
        branchPruned: true
    }],
    U3: ["seamlessAudio", false],
    koa: ["appendFirstHeaderOnComplete", true],
    OBa: ["waitForDrmToAppendMedia", false],
    Eed: ["enableJustInTimeAppends", false],
    pqc: ["enableAsyncAppend", false],
    f1c: ["timeBeforeEndOfStreamBufferMark", 6E3],
    Vnc: ["delayNotificationOfEoS", false],
    Qva: ["minAudioPtsGap", undefined],
    OJc: ["minimumAudioFramesPerFragment", 1],
    YU: ["requireAudioStreamToEncompassVideo", false],
    vea: ["mediaSourceSupportsNegativePts", false],
    U1c: ["truncateEndOfStreamAudio", false],
    pYa: ["insertSilentFramesOnSeek", false],
    CFb: ["insertSilentFramesOnSeekForTitles", []],
    $4a: ["seamlessAudioMaximumSyncError", undefined],
    a5a: ["seamlessAudioMinimumSyncError", undefined],
    nsb: ["audioProfilesNonSyncSamples", ["xheaac-dash"]],
    eL: ["applyProfileTimestampOffset", false],
    x8a: ["useDpiAssumedAacEncoderDelay", true],
    UCc: ["insertSilentFramesOnSeekCount", 3],
    Kza: ["segmentFadeInDuration", -1],
    Lza: ["segmentFadeOutDuration", -1],
    U1: ["maximumFade", {
        "heaac-2-dash": -44,
        "heaac-2hq-dash": -44,
        "ddplus-5.1hq-dash": -44,
        "ddplus-5.1-dash": -44
    }],
    N3: ["retainSbrOnFade", false],
    AFb: ["insertSilentFrameOnFade", true],
    Jra: ["forceAppendHeadersAfterDrm", false],
    Lrb: ["appendPacingFactor", 0],
    bcc: ["appendPacingThreshold", 3E3],
    Pqc: ["enableLiveRequestLogger", false],
    xgc: ["cdndldistEnabled", false],
    FPc: ["playerPtsPadding", 1],
    gKb: ["minNumSessionHistory", 5],
    Osb: ["baselineHighAndStableThreshold", {
        bwThreshold: 2E4,
        nethreshold: .15
    }],
    Zua: ["liveLowQualityAvoidance", true],
    Kda: ["liveLowQualityThreshold", 850],
    E1: ["liveLowQualityMultiplier", 6],
    jIb: ["liveReportSendIntervalMs", 6E4],
    WZa: ["liveReportCollectIntervalMs", 5E3],
    ZWb: ["useConfigManager", true],
    tAc: ["globalConfigMutationAllowList", {
        SR: "enableMissingSegmentsReplacement",
        Tk: "minimumPresentationDelayMs",
        Pp: "minPrebufSize",
        UR: "enableRequestAbandonment",
        I_: "enableMediaEventsTrack",
        Lp: "liveAdManifestWindowMs",
        Wu: "liveAdManifestWindowAllowanceMs",
        M9: "alwaysRetainAds",
        RR: "enableLiveAdPlaygraphs"
    }],
    xta: ["ignoreShortResponses", true],
    WSb: ["shortResponseDurationMs", 10],
    VSb: ["shortResponseBytes", 1E4],
    l8b: ["expandDownloadTime", true],
    pKb: ["minimumResponseDurationMs", 10],
    Xva: ["minimumMeasurementTime", 500],
    Wva: ["minimumMeasurementBytes", 131072],
    yya: ["probingMeasurementTime", 2E3],
    xya: ["probingMeasurementBytes", 262144],
    p_c: ["stopNetworkConfidence", true],
    a9b: ["historicBandwidthUpdateInterval", 2E3],
    yAa: ["stopOnAllInactiveRequests", false],
    B_: ["enableActiveRequestsInFilters", true],
    wQb: ["resetActiveRequestsAtSessionInit", true],
    Kyb: ["enableThroughputTraceResearchData", false],
    SUb: ["throughputTraceParam", {
        numB: 3600,
        bSizeMs: 2E3,
        fillS: "last",
        fillHl: 1E3
    }],
    nYb: ["wsslAggregationMethod", "max"],
    Fza: ["secondThroughputEstimator", "slidingwindow"],
    qob: ["defaultFilter", "throughput-ewma"],
    $7b: ["defaultFilterField", "average"],
    Kpb: ["secondaryFilter", "throughput-sw"],
    sAa: ["startMonitorOnLoadStart", false],
    e8b: ["enableFilters", ("throughput-ewma initial-throughput-ewma throughput-sw throughput-sw-fast throughput-iqr avtp entropy deliverytime").split(" ")],
    m8b: ["experimentalFilter", ["initial-throughput-ewma"]],
    vMa: ["filterDefinitionOverrides", {
        "initial-throughput-ewma": {
            type: "initial-discontiguous-ewma",
            mw: 1E4,
            playerStates: [0, 1]
        },
        "throughput-ewma": {
            mw: 4060.623425
        },
        "throughput-ewma2": {
            type: "discontiguous-ewma",
            mw: 97831.788213
        }
    }],
    rob: ["defaultFilterDefinitions", {
        "throughput-ewma": {
            type: "discontiguous-ewma",
            mw: 4060.623425
        },
        "throughput-ewma2": {
            type: "discontiguous-ewma",
            mw: 97831.788213
        },
        "initial-throughput-ewma": {
            type: "initial-discontiguous-ewma",
            mw: 1E4,
            playerStates: [0, 1]
        },
        "throughput-sw": {
            type: "slidingwindow",
            mw: 3E5
        },
        "throughput-sw-fast": {
            type: "slidingwindow",
            mw: 500
        },
        "throughput-wssl": {
            type: "wssl",
            mw: 5E3,
            max_n: 20
        },
        "throughput-iqr": {
            type: "iqr",
            mx: 100,
            mn: 5,
            bw: 15E3,
            iv: 1E3
        },
        "throughput-iqr-history": {
            type: "iqr-history"
        },
        "throughput-location-history": {
            type: "discrete-ewma",
            hl: 14400
        },
        "respconn-location-history": {
            type: "discrete-ewma",
            hl: 100
        },
        "throughput-tdigest": {
            type: "tdigest",
            maxc: 25,
            c: .5,
            b: 1E3,
            w: 15E3
        },
        "throughput-ci": {
            type: "ci",
            max_n: 10,
            maxc: 25,
            c: .5,
            lowPercentile: .1,
            highPercentile: .9,
            initialPercentile: .2,
            decay: false,
            halfLife: 5E3,
            maxDecay: 1E9
        },
        "throughput-tdigest-history": {
            type: "tdigest-history",
            maxc: 25,
            rc: "ewma",
            c: .5,
            hl: 7200
        },
        "respconn-ewma": {
            type: "discrete-ewma",
            hl: 10
        },
        avtp: {
            type: "avtp"
        },
        entropy: {
            type: "entropy",
            mw: 2E3,
            sw: 6E4,
            mins: 1,
            hdl: [150, 230, 352, 539, 825, 1264, 1936, 2966, 4543, 6958],
            uhdl: [150, 230, 352, 539, 825, 1264, 1936, 2966, 4543, 6958, 10657, 16322, 25E3]
        },
        deliverytime: {
            type: "deliverytime",
            hl: 4E3,
            max_n: 10,
            min_iv: 500,
            min_b: 16384
        },
        "deliverytime-ci": {
            type: "deliverytime-ci",
            hl: 4E3,
            max_n: 10,
            metric: "deliverytime",
            lowPercentile: .1,
            highPercentile: .9,
            initialPercentile: .2,
            accuracy: 1E-10,
            maxIterations: 20,
            min_iv: 500,
            min_b: 16384
        }
    }],
    p8b: ["fastHistoricBandwidthExpirationTime", 10368E3],
    G8b: ["bandwidthExpirationTime", 5184E3],
    o8b: ["failureExpirationTime", 86400],
    hpb: ["minReportedNetIntrDuration", 4E3],
    vKc: ["netIntrStoreWindow", 36E3],
    Djd: ["minNetIntrDuration", 8E3],
    Dea: ["minSessionHistoryDuration", 3E5],
    mea: ["maxNumSessionHistoryStored", 10],
    hCc: ["ignorePacedRequestStrategy", "none"],
    ifa: ["pacedThresholdPct", .1],
    VSa: ["effectivePaceRateFactor", 1],
    A6a: ["stddevPredictorMultiplier", -.3],
    B6a: ["stddevPredictorUpperMultiplier", 2],
    j_c: ["stddevPredictorSource", "deliverytime"],
    npa: ["ciPredictorSource", "throughput-ci"],
    Ona: ["addHeaderDataToNetworkMonitor", true],
    $ya: ["reportFailedRequestsToNetworkMonitor", false],
    $pa: ["ase_location_history", 0],
    rfa: ["periodicHistoryPersistMs", 0],
    L_: ["enableSessionTraceSummaryEndplay", false],
    btc: ["filterResponseTimeAverage", {
        enabled: false
    }],
    ftc: ["filterThroughputTrend", {
        enabled: false
    }],
    etc: ["filterThroughputCoefficientOfVariation", {
        enabled: false
    }],
    Uzb: ["filterThroughputSwitches", {
        enabled: false,
        U3a: .15,
        $Na: 200,
        ro: 6E4
    }],
    Rzb: ["filterLowThroughput", {
        enabled: false,
        LV: 3E3
    }],
    Tzb: ["filterThroughputBucketPercentiles", {
        enabled: false,
        ro: 3E5,
        Q1: 30,
        R1: 25,
        PD: .5,
        dF: [.05, .1, .25, .5, .75, .9, .95],
        P3: true
    }],
    Szb: ["filterResponseTimeBucketPercentiles", {
        enabled: false,
        ro: 3E5,
        Q1: 30,
        R1: 25,
        PD: .5,
        dF: [.05, .1, .25, .5, .75, .9, .95],
        P3: true
    }],
    Cca: ["headerRequestSize", 4096],
    S_: ["estimateHeaderSize", true],
    G3c: ["useSidxInfoFromManifestForHeaderRequestSize", false],
    Izb: ["fastPlayHeaderRequestSize", 0],
    d0a: ["minTimeBetweenHeaderRequests", undefined],
    TR: ["enableOCSideChannel", true],
    n_: ["decryptOCSideChannelMinInterval", 1E3],
    fqa: ["decryptOCSideChannelMinIntervalAfterCompleted", 1E3],
    E_: ["enableLiveOCSideChannelRefresh", true],
    F1: ["liveOCSideChannelRefreshInterval", 3E4],
    CX: ["OCSCBufferQuantizationConfig", {
        lv: 5,
        mx: 240
    }],
    aE: ["enableUnifiedSideChannel", false],
    mT: ["liveEnableUnifiedSideChannel", false],
    GV: ["svodEnableUnifiedSideChannel", false],
    uba: ["forceImmediateTransitionTypeForTitles", []],
    tba: ["forceImmediateTransitionExitZone", 0],
    tva: ["maxActiveRequestsSABCell100", 2],
    rdd: ["contentOverrides", undefined],
    sdd: ["contentProfileOverrides", undefined],
    Ava: ["maxNetworkErrorsDuringBuffering", 20],
    yIc: ["maxFastPlayContentTimeThresholdMs", 112E3],
    Gea: ["minimumTimeBeforeBranchDecision", 2E3],
    NJc: ["minimumAppendedMediaBeforePlayback", 5E3],
    UGb: ["jitBranchAppendingDistance", 1E4],
    Vkd: ["researchEnvironmentEnabled", false],
    Ypa: ["ase_dump_fragments", false],
    yTb: ["stallAtFrameCountAudio", undefined],
    H_a: ["maxIQRSamples", 100],
    b0a: ["minIQRSamples", 5],
    mld: ["seamlessAudioProfiles", []],
    nld: ["seamlessAudioProfilesAndTitles", {}],
    xpc: ["editCompleteFragments", true],
    rdc: ["audioOverlapGuardSampleCount", 2],
    brc: ["enableRecordJSBridgePerf", false],
    bGa: ["JSBridgeTDigestConfig", {
        maxc: 25,
        c: .5
    }],
    xXa: ["hindsightDenominator", 0],
    wXa: ["hindsightDebugDenominator", 0],
    Agd: ["hindsightAlgorithmsEnabled", []],
    yXa: ["hindsightParam", {
        numB: Infinity,
        bSizeMs: 1E3,
        fillS: "last",
        fillHl: 1E3
    }],
    aw: ["aseReportDenominator", 0],
    yA: ["aseReportIntervalMs", 3E5],
    fL: ["aseReportMaxStreamSelections", 400],
    hRa: ["contiguousBufferMultiplier", 3],
    mvb: ["contiguousBufferMinimumAudio", 1048576],
    ovb: ["contiguousBufferMinimumVideo", 8388608],
    nvb: ["contiguousBufferMinimumText", 0],
    MJ: ["useBufferSizeLimiter", false],
    H3c: ["useStaticBufferSizeLimiter", false],
    Z6a: ["supportsPtsChanged", true],
    NO: ["usePrioritySetTimeout", false],
    Ktb: ["centralizeClockSchedulers", true],
    Gsb: ["backOffSetTimeout", true],
    Mld: ["skipIntroPlaygraphEnabled", false],
    Paa: ["enableMediaEventHistory", true],
    rqc: ["enableBufferSizeLimiterTracer", false],
    XZa: ["liveShouldAccountForPlayDelay", false],
    dnd: ["useManifestServerExpiration", false],
    M9: ["alwaysRetainAds", false],
    I_: ["enableMediaEventsTrack", false],
    Lp: ["liveAdManifestWindowMs", 1E4],
    Wu: ["liveAdManifestWindowAllowanceMs", 5E3],
    wGc: ["liveAdEarlyTerminationCushionMs", 1E3],
    xGc: ["liveAdManifestWindowOnset", 0],
    Nqc: ["enableLiveManifestThrottling", true],
    RQb: ["reuseTcpConnectionsWhenStickySteered", false],
    WGc: ["liveShareTcpConnections", [[]]],
    bHc: ["liveUseMediaTcpForHeaders", false],
    Mha: ["syntheticAdBreakUx", ""],
    KMb: ["padOcaSideChannelRequests", true],
    IGc: ["liveHydrationMinDistanceFromLiveEdge", 3E4],
    fgc: ["canPerformHydrationsCloseToLiveEdge", false],
    Whd: ["liveHydrationMinDistanceFromPlayback", 12E4],
    GGc: ["liveHydrationDefaultJitterWindow", 3E4],
    HGc: ["liveHydrationDistanceThatNeedJitter", 12E4],
    Rcd: ["canPerformSoftHydrations", true],
    VNc: ["paceHydrationPolicyByLiveEdge", true],
    JL: ["enableBlackBoxNotification", true],
    gIb: ["liveMediaEventsMinBufferMs", 4E3],
    Nid: ["maxWaitTimeForMediaEventsWhileBufferingMS", 5E3],
    LGc: ["liveMediaEventsCatchupMs", 3E4],
    upc: ["earlyFetchMediaEvents", true],
    fIb: ["liveMaximumEventsCatchupMs", 12E4],
    eGc: ["linearMaximumEventsCatchupMs", 2E4],
    nqc: ["enableAdPlaygraphsForBranching", true],
    Obc: ["alwaysSendSideChannel", true],
    Jnc: ["defaultTimeoutForFetchRequests", 8E3],
    QWc: ["serverClockSyncOnViewableRetrievalTimeout", 1E4],
    Qqc: ["enableLiveWithAdsOptimalPanic", false],
    aec: ["batchRequestThrottlerMaxDuration", 15E3],
    Qsb: ["batchRequestThrottlerSleepDuration", 0],
    QR: ["enableLiveAdBreakReportingEvents", true],
    Tk: ["minimumPresentationDelayMs", 1E4],
    lT: ["liveEdgeSegmentSkipCount", 0],
    THb: ["linearEnforceSegmentAvailabilityWindowAtIssueRequest", true],
    bJc: ["mediaEventsMaxRetry", 20],
    kTa: ["enablePresentationDelayControl", false],
    Qha: ["targetPresentationDelayToleranceMs", 500],
    mya: ["presentationDelayQoeLockPeriodMs", 6E4],
    G_: ["enableLiveRequestPacing", true],
    Mqc: ["enableLiveLikeRequestPacing", false],
    KGc: ["liveLikeRequestPacingMultiplier", 1],
    J1: ["logarithmicRequestPacingCurveCenterPositionMs", 4E4],
    K1: ["logarithmicRequestPacingCurveSharpness", 8],
    cN: ["maxLiveTargetBufferDurationMs", 24E4],
    D1: ["liveIsEllaEnabled", false],
    JGc: ["liveIsEllaABREnabled", true],
    KE: ["liveIsEllaHttpMixingEnabled", true],
    DGc: ["liveEllaEdgeCushion", 4E3],
    cIb: ["liveEllaProximityThresholdMs", 4E3],
    EGc: ["liveEllaProximityCheckIntervalMs", 500],
    FGc: ["liveEllaTimeoutMultiplier", 2],
    Dpc: ["ellaBandwidthOracle", -1],
    Epc: ["ellaBandwidthOracleMargin", .2],
    Cpc: ["ellaAudioThroughputPercentage", 10],
    aqc: ["ellaThroughputBasedSelectionMargin", .4],
    Jpc: ["ellaChannelSelectionMode", "loss-queuing-delay"],
    Kpc: ["ellaChannelSwitchRRRate", 1],
    Upc: ["ellaPktLossRateThreshold", [.01, .02]],
    Vpc: ["ellaQueuingDelayThreshold", [200, 500]],
    Ppc: ["ellaLockPeriodToStayMs", 1E4],
    Opc: ["ellaLockPeriodToDrainMs", 1E4],
    Qpc: ["ellaMaxEncodingBitrateKbps", 8500],
    Rpc: ["ellaMinEncodingBitrateKbps", 800],
    Lpc: ["ellaEnableForceDownswitch", false],
    ZSa: ["ellaImplementation", "js"],
    XSa: ["ellaCdnBaseUrl", "https://occ.a.nflxso.net/genc/nrdp/ella/$packageName/$version/$filename"],
    pyb: ["ellaCdnFilename", "index.release.js"],
    qyb: ["ellaCdnSkipVersionCheck", false],
    Wpc: ["ellaRelayFailureRecordWindowMs", 6E5],
    Ypc: ["ellaRelayMaxFailuresInWindow", 50],
    Xpc: ["ellaRelayMaxConsecutiveFailures", 10],
    ryb: ["ellaChannelHealthMonitoringWindowMs", 6E4],
    Fpc: ["ellaChannelHealthPollingIntervalMs", 1E4],
    Hpc: ["ellaChannelMaxFailuresInWindow", 10],
    Gpc: ["ellaChannelMaxConsecutiveFailures", 5],
    TNc: ["overrideManifestForElla", true],
    BMb: ["overrideEllaRelayServers", true],
    syb: ["ellaRelayServers", [{
        id: 2,
        PQ: "2a00:86c0:2028:2028::166",
        port: 7002,
        FZ: ""
    }, {
        id: 1,
        PQ: "198.38.100.140",
        port: 7002,
        FZ: ""
    }, {
        id: 3,
        PQ: "::1",
        port: 7002,
        FZ: ""
    }]],
    Npc: ["ellaFecRate", .1],
    $pc: ["ellaSendRateMultiplier", [1.1, 1.2, 1.5]],
    Ipc: ["ellaChannelNamePrefix", "/2557822/1263725932"],
    Spc: ["ellaMovieId", 82101269],
    Raa: ["enableSvodRequestPacing", true],
    G4: ["svodBufferGrowthRateSlope", 2],
    j2: ["minSvodTargetBufferDurationMs", 6E4],
    frc: ["enableSvodLogarithmicPacing", false],
    x0c: ["svodLogarithmicRequestPacingCurveCenterPositionMs", 4E4],
    y0c: ["svodLogarithmicRequestPacingCurveSharpness", 8],
    NTa: ["explicitVideoDownloadablesMap", {}],
    ubc: ["adsTruncationThreshold", 2500],
    cXb: ["useNextSegmentSizeForLiveSelection", false],
    jb: ["laser", false],
    p1: ["laserEvents", {
        "*": true
    }],
    u1: ["laserSessionType", "MANUAL_TEST"],
    r1: ["laserSessionDescription", undefined],
    t1: ["laserSessionName", undefined],
    q1: ["laserRunId", undefined]
};
export const Nic = fRa;
export const ke = Nic;

// Detected exports: fRa, Nic, ke