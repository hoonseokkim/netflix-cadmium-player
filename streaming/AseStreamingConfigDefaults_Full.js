/**
 * Netflix Cadmium Player - ASE Streaming Configuration Defaults (Full)
 *
 * Complete default configuration for the Adaptive Streaming Engine (ASE).
 * This is the most comprehensive config module, containing ~500+ parameters
 * that control every aspect of the streaming pipeline:
 *
 * - **Buffer management**: watermark levels, buffer sizes, trailing buffer
 * - **ABR / stream selection**: bitrate curves, VMAF thresholds, bandwidth margins
 * - **Network**: throughput estimation filters, pacing, concurrency, retries
 * - **Audio**: codec selection, timestamp offsets, padding, seamless switching
 * - **Pipelining**: request sizes, parallelism, socket buffer sizes
 * - **Branching / interactive**: playgraph weights, branch offsets, choice maps
 * - **Live streaming**: latency control, ELLA relay, presentation delay
 * - **Ads (DAI)**: ad playgraphs, hydration windows, ad break handling
 * - **Telemetry**: diagnostics, hindsight, research environment settings
 *
 * Each entry is a tuple: [configKeyName(s), defaultValue].
 * Keys can be a string or array of strings (for backward compatibility aliases).
 *
 * @module AseStreamingConfigDefaults_Full
 * @original Module_36948
 */

/**
 * @type {Object.<string, [string|string[], *]>}
 */
export const ASE_CONFIG_DEFAULTS = Object.freeze({
    // --- Buffering & check intervals ---
    minCheckBufferingCompleteInterval: ["minCheckBufferingCompleteInterval", 200],
    enableMoreFrequentBufferingCompleteCheck: ["enableMoreFrequentBufferingCompleteCheck", false],

    // --- Audio timestamp offsets ---
    defaultAacTimestampOffset: ["defaultAacTimestampOffset", { ticks: -3268, timescale: 48000 }],
    profileTimestampOffsets: ["profileTimestampOffsets", {
        "heaac-2-dash": { 64: { ticks: -3268, timescale: 48000 }, 96: { ticks: -3268, timescale: 48000 } },
        "heaac-2hq-dash": { 128: { ticks: -3268, timescale: 48000 } },
        "heaac-5.1-dash": { 192: { ticks: -3268, timescale: 48000 } },
    }],

    // --- Codec & padding ---
    paddingCodecSelector: ["paddingCodecSelector", "strict"],
    stallAtFrameCount: ["stallAtFrameCount", undefined],
    saveBitrateMs: ["saveBitrateMs", 0],

    // --- Download data requirements ---
    requireDownloadDataAtBuffering: ["requireDownloadDataAtBuffering", false],
    indicatorForDownloadDataAtBuffering: ["indicatorForDownloadDataAtBuffering", "oncomplete"],
    requireSetupConnectionDuringBuffering: ["requireSetupConnectionDuringBuffering", false],

    // --- Request sizes ---
    maxRequestSize: ["maxRequestSize", 0],
    minVideoMediaRequestSizeBytes: ["minVideoMediaRequestSizeBytes", 0],
    minAudioMediaRequestSizeBytes: ["minAudioMediaRequestSizeBytes", 0],
    maxVideoMediaRequestSizeBytes: ["maxVideoMediaRequestSizeBytes", Infinity],
    maxAudioMediaRequestSizeBytes: ["maxAudioMediaRequestSizeBytes", Infinity],
    minVideoMediaRequestDuration: ["minVideoMediaRequestDuration", 0],
    minAudioMediaRequestDuration: ["minAudioMediaRequestDuration", 0],
    minMediaRequestDuration: ["minMediaRequestDuration", 0],
    maxMediaRequestDuration: ["maxMediaRequestDuration", Infinity],
    maxVideoMediaRequestDuration: ["maxVideoMediaRequestDuration", Infinity],
    maxAudioMediaRequestDuration: ["maxAudioMediaRequestDuration", Infinity],
    maxMediaRequestSizeBytesInFraction: ["maxMediaRequestSizeBytesInFraction", 1],

    // --- Nginx rate limiting ---
    enableNginxRateLimit: ["enableNginxRateLimit", false],
    nginxSendingRate: ["nginxSendingRate", 40000],

    // --- Client pacing (CPR) ---
    enableCprAudio: ["enableCprAudio", false],
    enableCprVideo: ["enableCprVideo", true],
    enableCprLive: ["enableCprLive", false],
    enableCprDai: ["enableCprDai", false],
    enableCprSvodAd: ["enableCprSvodAd", false],
    enableHybridPacing: ["enableHybridPacing", false],
    catchUpMode: ["catchUpMode", false],
    maxSegHint: ["maxSegHint", 4],

    // --- Request logging ---
    requestLevelLogging: ["requestLevelLogging", false],

    // --- Concurrent streaming ---
    enableConcurrentStreamingHandling: ["enableConcurrentStreamingHandling", false],
    enablePacingOnSwitchableAudio: ["enablePacingOnSwitchableAudio", false],

    // --- Pipeline ---
    pipelineEnabled: ["pipelineEnabled", true],
    enableSCByteRangeHints: ["enableSCByteRangeHints", false],

    // --- Segment fading ---
    segmentFadeDuration: ["segmentFadeDuration", 400],

    // --- Pre-buffer sizes ---
    maxPrebufSize: ["maxPrebufSize", 50000],
    minPrebufSize: ["minPrebufSize", 5756],
    minimumJustInTimeBufferLevel: ["minimumJustInTimeBufferLevel", 3000],

    // --- Missing segments ---
    enableMissingSegmentsDetection: ["enableMissingSegmentsDetection", true],
    enableMissingSegmentsReplacement: ["enableMissingSegmentsReplacement", true],
    enableNextSegmentSizeFromOC: ["enableNextSegmentSizeFromOC", true],

    // --- Live streaming pipeline ---
    liveSwitchStreamsOnErrorInPipeline: ["liveSwitchStreamsOnErrorInPipeline", true],
    liveEdgeRetryWindowMs: ["liveEdgeRetryWindowMs", 6000],
    simulateLiveEdge: ["simulateLiveEdge", false],
    simulateLiveEdgeDistance: ["simulateLiveEdgeDistance", 0],

    // --- First request aggregation ---
    allowFirstRequestAggregation: ["allowFirstRequestAggregation", false],
    reuseOnErrorCacheTimeout: ["reuseOnErrorCacheTimeout", 60000],

    // --- Exit zones ---
    useExitZones: ["useExitZones", true],
    liveEndSlateMaxDuration: ["liveEndSlateMaxDuration", 60000],

    // --- Stream selection algorithms ---
    ase_stream_selector: ["ase_stream_selector", "optimized"],
    audiostreamSelectorAlgorithm: ["audiostreamSelectorAlgorithm", "selectaudioadaptive"],
    liveStreamSelectorAlgorithm: ["liveStreamSelectorAlgorithm", "livesimple"],
    jointStreamSelectorEnabled: ["jointStreamSelectorEnabled", false],
    smartHeaderPreDownloading: ["smartHeaderPreDownloading", false],
    minBufferLenForHeaderDownloading: ["minBufferLenForHeaderDownloading", 10000],

    // --- Connect time ---
    connectTimeMultiplier: ["connectTimeMultiplier", 1],

    // --- Buffer watermarks ---
    lowestWaterMarkLevel: [["lowestWaterMarkLevel", "lowestWatermarkLevel"], 30000],
    lowestWaterMarkLevelBufferRelaxed: ["lowestWaterMarkLevelBufferRelaxed", false],
    minRequiredBuffer: ["minRequiredBuffer", 20000],
    maxTrailingBufferLen: ["maxTrailingBufferLen", 15000],
    maxMediaBufferAllowed: ["maxMediaBufferAllowed", 270000],

    // --- Simulation duration ---
    simulationDurationStrategy: ["simulationDurationStrategy", "default"],
    simulationFullBufferPercentage: ["simulationFullBufferPercentage", 1],
    minSimulationDuration: ["minSimulationDuration", 20000],
    maxSimulationDuration: ["maxSimulationDuration", 300000],

    // --- Stream retention windows ---
    highStreamRetentionWindow: ["highStreamRetentionWindow", 90000],
    lowStreamTransitionWindow: ["lowStreamTransitionWindow", 510000],
    highStreamRetentionWindowUp: ["highStreamRetentionWindowUp", 500000],
    lowStreamTransitionWindowUp: ["lowStreamTransitionWindowUp", 100000],
    highStreamRetentionWindowDown: ["highStreamRetentionWindowDown", 600000],
    lowStreamTransitionWindowDown: ["lowStreamTransitionWindowDown", 0],
    highStreamInfeasibleBitrateFactor: ["highStreamInfeasibleBitrateFactor", 0.5],

    // --- Fast switching ---
    fastDownswitchFactor: ["fastDownswitchFactor", 3],
    fastUpswitchFactor: ["fastUpswitchFactor", 3],
    fastUpswitchFactorWithoutHeaders: ["fastUpswitchFactorWithoutHeaders", 3],
    fastUpswitchFactorForNextSegment: ["fastUpswitchFactorForNextSegment", 1],
    considerConnectTime: ["considerConnectTime", true],
    lowestBufForUpswitch: ["lowestBufForUpswitch", 9000],
    lockPeriodAfterDownswitch: ["lockPeriodAfterDownswitch", 15000],
    lowWatermarkLevel: ["lowWatermarkLevel", 15000],
    skipBitrateInUpswitch: ["skipBitrateInUpswitch", false],
    watermarkLevelForSkipStart: ["watermarkLevelForSkipStart", 8000],

    // --- Stream selection trace ---
    streamSelectionTrace: ["streamSelectionTrace", [
        { f: 60, s: 5 }, { f: 61, s: 3 }, { f: 62, s: 2 }, { f: 63, s: 0 },
    ]],

    // --- Header pre-downloading ---
    enableAllHeadersPreDownloading: ["enableAllHeadersPreDownloading", false],
    enableStreamSelectionAugmentData: ["enableStreamSelectionAugmentData", false],
    augmentDataNumOfChunks: ["augmentDataNumOfChunks", 30],
    minFragmentVmaf: ["minFragmentVmaf", undefined],

    // --- Live stream selection ---
    liveStreamSelectorUseLatency: ["liveStreamSelectorUseLatency", true],
    latencyMultiplierForLive: ["latencyMultiplierForLive", 4],
    latencyAverageMultiplierForLive: ["latencyAverageMultiplierForLive", 1],
    throughputDiscountForLive: ["throughputDiscountForLive", 0.8],
    throughputDiscountExponentBC: ["throughputDiscountExponentBC", 1.5],
    liveBufferRatioStrategy: ["liveBufferRatioStrategy", "strict"],
    throughputThresholdSelectorParam: ["throughputThresholdSelectorParam", 0],
    reportedFilters: ["reportedFilters", []],

    // --- Buffering selector ---
    bufferingSelectorAlgorithm: ["bufferingSelectorAlgorithm", "default"],
    upswitchDuringBufferingFactor: ["upswitchDuringBufferingFactor", 2],
    allowUpswitchDuringBuffering: ["allowUpswitchDuringBuffering", false],
    liveMaxUpswitchSteps: ["liveMaxUpswitchSteps", Infinity],
    noRepeatedFirstSelectionLogic: ["noRepeatedFirstSelectionLogic", false],

    // --- Throughput defaults ---
    defaultThroughput: ["defaultThroughput", 1537],

    // --- Bitrate constraints ---
    minInitVideoBitrate: ["minInitVideoBitrate", -Infinity],
    maxInitVideoBitrate: ["maxInitVideoBitrate", Infinity],
    minInitAudioBitrate: ["minInitAudioBitrate", -Infinity],
    maxInitAudioBitrate: ["maxInitAudioBitrate", Infinity],
    minAcceptableVideoBitrate: ["minAcceptableVideoBitrate", -Infinity],
    minAcceptableVMAF: ["minAcceptableVMAF", 0],
    minAcceptableVMAFRebufferScalingFactor: ["minAcceptableVMAFRebufferScalingFactor", 0],
    minAllowedVideoBitrate: ["minAllowedVideoBitrate", -Infinity],
    maxAllowedVideoBitrate: ["maxAllowedVideoBitrate", Infinity],
    maxSegmentBitrate: ["maxSegmentBitrate", Infinity],
    minAllowedVmaf: ["minAllowedVmaf", -Infinity],
    maxAllowedVmaf: ["maxAllowedVmaf", Infinity],
    minRequiredAudioBuffer: ["minRequiredAudioBuffer", 0],
    initialBitrateSelectionCurve: ["initialBitrateSelectionCurve", null],

    // --- Audio bandwidth ---
    throughputPercentForAudio: ["throughputPercentForAudio", 15],
    bandwidthMargin: ["bandwidthMargin", 0],
    bandwidthMarginCurve: ["bandwidthMarginCurve", [
        { m: 20, b: 15000 }, { m: 17, b: 30000 }, { m: 10, b: 60000 }, { m: 5, b: 120000 },
    ]],
    bandwidthMarginCurveAudio: ["bandwidthMarginCurveAudio", {
        min: 0.7135376, max: 0.85, center: 76376, scale: 18862.4, gamma: 3.0569,
    }],
    bandwidthMarginContinuous: ["bandwidthMarginContinuous", false],
    bandwidthMarginForAudio: ["bandwidthMarginForAudio", true],
    switchConfigBasedOnInSessionTput: ["switchConfigBasedOnInSessionTput", true],
    conservBandwidthMargin: ["conservBandwidthMargin", 20],
    conservBandwidthMarginTputThreshold: ["conservBandwidthMarginTputThreshold", 6000],
    conservBandwidthMarginCurve: ["conservBandwidthMarginCurve", [
        { m: 25, b: 15000 }, { m: 20, b: 30000 }, { m: 15, b: 60000 },
        { m: 10, b: 120000 }, { m: 5, b: 240000 },
    ]],

    // --- Bandwidth manifold (ABR quality model) ---
    bandwidthManifold: ["bandwidthManifold", {
        curves: [
            { min: 0.05, max: 0.82, center: 70000, scale: 178000, gamma: 1.16 },
            { min: 0, max: 0.03, center: 150000, scale: 160000, gamma: 3.7 },
        ],
        threshold: 14778,
        gamma: 2.1,
        niqrcurve: { min: 1, max: 1, center: 2, scale: 2, gamma: 1 },
        filter: "throughput-sw",
        niqrfilter: "throughput-iqr",
        simpleScaling: true,
    }],

    // --- VMAF ---
    maxStartingVideoVMAF: ["maxStartingVideoVMAF", 110],
    minStartingVideoVMAF: ["minStartingVideoVMAF", 1],
    activateSelectStartingVMAF: ["activateSelectStartingVMAF", false],
    selectStartingVMAFTDigest: ["selectStartingVMAFTDigest", -1],
    selectStartingVMAFMethod: ["selectStartingVMAFMethod", "fallback"],
    selectStartingVMAFMethodCurve: ["selectStartingVMAFMethodCurve", {
        log_p50: [6.0537, -0.8612],
        log_p40: [5.41, -0.7576],
        log_p20: [4.22, -0.867],
        sigmoid_1: [11.0925, -8.0793],
    }],

    // --- Rebuffering ---
    rebufferingFactor: ["rebufferingFactor", 1],
    rebufferCheckDuration: ["rebufferCheckDuration", 60000],
    useMaxPrebufSize: ["useMaxPrebufSize", true],
    lowThroughputThreshold: ["lowThroughputThreshold", 400],
    excludeSessionWithoutHistoryFromLowThroughputThreshold: ["excludeSessionWithoutHistoryFromLowThroughputThreshold", false],

    // --- Long connect time penalty ---
    enablePenaltyForLongConnectTime: ["enablePenaltyForLongConnectTime", false],
    penaltyFactorForLongConnectTime: ["penaltyFactorForLongConnectTime", 2],
    longConnectTimeThreshold: ["longConnectTimeThreshold", 200],
    additionalBufferingLongConnectTime: ["additionalBufferingLongConnectTime", 2000],
    additionalBufferingPerFailure: ["additionalBufferingPerFailure", 8000],

    // --- Buffering time ---
    maxBufferingTime: ["maxBufferingTime", 2000],
    upperThroughputPredictionFactor: ["upperThroughputPredictionFactor", 1.6],
    mediaRate: ["mediaRate", 1.5],

    // --- Round robin ---
    timeAtEachBitrateRoundRobin: ["timeAtEachBitrateRoundRobin", 10000],
    roundRobinDirection: ["roundRobinDirection", "forward"],
    marginPredictor: ["marginPredictor", "simple"],

    // --- VMAF estimation from bitrate ---
    enableVmafEstimationFromBitrate: ["enableVmafEstimationFromBitrate", false],
    maxVMAFMappingBitrate: ["maxVMAFMappingBitrate", 16000],
    maxVMAFMappingVMAF: ["maxVMAFMappingVMAF", 110],

    // --- Audio switching ---
    audioBwFactor: ["audioBwFactor", 1],
    audioSwitchConfig: ["audioSwitchConfig", {
        upSwitchFactor: 5.02, downSwitchFactor: 3.76,
        lowestBufForUpswitch: 16000, lockPeriodAfterDownswitch: 16000,
    }],
    audioSwitchConfigLive: ["audioSwitchConfigLive", {
        upSwitchFactor: 2.5, downSwitchFactor: 1.3,
        lowestBufForUpswitch: 6000, lockPeriodAfterDownswitch: 30000,
    }],
    switchableAudioProfilesOverride: ["switchableAudioProfilesOverride", [
        { profiles: ["ddplus-5.1-dash", "ddplus-5.1hq-dash"], override: { maxInitAudioBitrate: 192 } },
        { profiles: ["ddplus-atmos-dash"], override: { minInitAudioBitrate: 448, maxInitAudioBitrate: 448, minAudioBitrate: 448 } },
    ]],
    audioProfilesOverride: ["audioProfilesOverride", [
        { profiles: ["ddplus-5.1-dash", "ddplus-5.1hq-dash"], override: { maxInitAudioBitrate: 256, audioBwFactor: 5.02 } },
        { profiles: ["ddplus-atmos-dash"], override: { maxInitAudioBitrate: 448 } },
    ]],
    limitAudioDiscountByMaxAudioBitrate: ["limitAudioDiscountByMaxAudioBitrate", false],

    // --- Live slow buffer ---
    liveSlowBufferFilling: ["liveSlowBufferFilling", false],
    liveSlowBufferFillingMinBitrate: ["liveSlowBufferFillingMinBitrate", 1200],
    liveResyncClockOn404Error: ["liveResyncClockOn404Error", true],
    enableConditionalServerTimeUpdate: ["enableConditionalServerTimeUpdate", true],
    negligibleServerTimeDeltaDifference: ["negligibleServerTimeDeltaDifference", 1000],

    // --- Network measurement ---
    networkMeasurementGranularity: ["networkMeasurementGranularity", "video_location"],

    // --- Branching ---
    maxFragsForFittableOnBranching: ["maxFragsForFittableOnBranching", 300],
    applyProfileStreamingOffset: ["applyProfileStreamingOffset", true],
    sanitizeMediaVideoFrameDuration: ["sanitizeMediaVideoFrameDuration", true],

    // --- WSSL estimate ---
    enableWsslEstimate: ["enableWsslEstimate", false],
    maxRequestsToAttachOnBranchActivation: ["maxRequestsToAttachOnBranchActivation", undefined],
    enableManagerDebugTraces: ["enableManagerDebugTraces", false],
    simulatePartialBlocks: ["simulatePartialBlocks", true],

    // --- Live initial fetch ---
    liveInitialFetchSizeBytes: ["liveInitialFetchSizeBytes", 1024],
    liveTextInitialFetchSizeBytes: ["liveTextInitialFetchSizeBytes", 40],
    liveEditInitialFetchSizeBytes: ["liveEditInitialFetchSizeBytes", 4096],

    // --- Per-fragment VMAF ---
    perFragmentVMAFConfig: ["perFragmentVMAFConfig", { enabled: false, earlyManifestProcessing: false }],

    // --- Live audio ---
    liveAdjustAudioTimestamps: ["liveAdjustAudioTimestamps", false],
    debugFragmentTimes: ["debugFragmentTimes", false],
    enableTwoPartLiveFragmentEditing: ["enableTwoPartLiveFragmentEditing", true],
    parseAdditionalBoxesMp4Header: ["parseAdditionalBoxesMp4Header", true],
    minAudioMediaRequestDurationCache: ["minAudioMediaRequestDurationCache", 0],
    minVideoMediaRequestDurationCache: ["minVideoMediaRequestDurationCache", 0],

    // --- Forced JS requests ---
    enableForcedJsRequests: ["enableForcedJsRequests", false],
    missedRequestFailureTimeout: ["missedRequestFailureTimeout", 5000],
    markRequestActiveOnFirstByte: ["markRequestActiveOnFirstByte", false],
    useNativeDataViewMethods: ["useNativeDataViewMethods", true],

    // --- Network retry ---
    networkRequestRetryDelay: ["networkRequestRetryDelay", 500],
    networkRequestRetryMinJitter: ["networkRequestRetryMinJitter", 100],
    networkRequestRetryMaxJitter: ["networkRequestRetryMaxJitter", 2000],

    // --- MP4/codec translation ---
    translateToVp9Draft: ["translateToVp9Draft", false],
    reorderTrakMvex: ["reorderTrakMvex", false],
    insertSilentFrames: ["insertSilentFrames", 0],
    forceDiscontinuityAtTransition: ["forceDiscontinuityAtTransition", true],
    supportAudioResetOnDiscontinuity: ["supportAudioResetOnDiscontinuity", undefined],
    supportAudioEasingOnDiscontinuity: ["supportAudioEasingOnDiscontinuity", undefined],

    // --- WSSL request ---
    maxWsslRequestSize: ["maxWsslRequestSize", 131072],
    maxWsslRequestRatio: ["maxWsslRequestRatio", 0.2],

    // --- Live early request ---
    liveEarlyRequestProbability: ["liveEarlyRequestProbability", 0],
    liveEarlyRequestDefaultOffsetMs: ["liveEarlyRequestDefaultOffsetMs", -500],
    supportLiveIdrMismatch: ["supportLiveIdrMismatch", false],
    synthesizeLiveIdrMismatch: ["synthesizeLiveIdrMismatch", 0],

    // --- Non-pipelined CPR ---
    enableCsprNonPipelined: ["enableCsprNonPipelined", false],
    enableCprAudioNonPipelined: ["enableCprAudioNonPipelined", false],
    enableCprVideoNonPipelined: ["enableCprVideoNonPipelined", false],

    // --- Pacing rate selection ---
    enablePaceReportLogging: ["enablePaceReportLogging", false],
    paceRateSelectorAlgorithm: ["paceRateSelectorAlgorithm", "regression"],
    paceRateSelectorAlgorithmAudio: ["paceRateSelectorAlgorithmAudio", "default"],
    paceRateSelectorAlgorithmNonPipelined: ["paceRateSelectorAlgorithmNonPipelined", "default"],
    staticPacingRateKbps: ["staticPacingRateKbps", 0],
    clientPacingParams: ["clientPacingParams", {
        minRequiredBuffer: 0,
        rateDiscountFactors: [1, 1, 1],
        lowestAllowedRateFactor: 1,
        lowestAllowedFragmentBitrateFactors: [0, 0, 0],
    }],
    unpacedFragmentInterval: ["unpacedFragmentInterval", 0],

    // --- Regression pacing coefficients ---
    regressionAlgoPacingCoefficients: ["regressionAlgoPacingCoefficients", [
        { playerStates: [0, 1, 2], networkConfidence: [], bufferLevelPct: 0, coefficients: { offset: 0 } },
        { playerStates: [], networkConfidence: [0, 1, 2], bufferLevelPct: 0, coefficients: { offset: 0 } },
        { playerStates: [], networkConfidence: [], bufferLevelPct: 0, coefficients: { maxAverageBitrate: 6.4 } },
        { playerStates: [], networkConfidence: [], bufferLevelPct: 1, coefficients: { maxAverageBitrate: 2.8 } },
    ]],

    // --- Target buffer ---
    targetBufferLevelStddevMultiplier: ["targetBufferLevelStddevMultiplier", 1],
    targetBufferLevelDurationMs: ["targetBufferLevelDurationMs", 0],
    pacingTargetBufferStrategy: ["pacingTargetBufferStrategy", "capacityPercentage"],
    minTargetBufferLevelMs: ["minTargetBufferLevelMs", 270000],
    needMinimumNetworkConfidence: ["needMinimumNetworkConfidence", true],
    biasTowardHistoricalThroughput: ["biasTowardHistoricalThroughput", false],

    // --- Location / error handling ---
    liveDvrSwitchThresholdms: ["liveDvrSwitchThresholdms", 10000],
    probeServerWhenError: ["probeServerWhenError", false],
    probeBeforeSwitchingBackToPrimary: ["probeBeforeSwitchingBackToPrimary", true],
    minIntervalForSwitchingBackToPrimary: ["minIntervalForSwitchingBackToPrimary", 60000],
    maxIntervalForSwitchingBackToPrimary: ["maxIntervalForSwitchingBackToPrimary", 960000],
    enableInitialThroughputHistory: ["enableInitialThroughputHistory", true],
    locationSelectorPersistFailures: ["locationSelectorPersistFailures", true],
    locationStatisticsUpdateInterval: ["locationStatisticsUpdateInterval", 60000],
    httpsConnectErrorAsPerm: ["httpsConnectErrorAsPerm", false],
    throttledNetworkFailureThresholdMs: ["throttledNetworkFailureThresholdMs", 2000],
    maxThrottledNetworkFailures: ["maxThrottledNetworkFailures", 5],
    networkFailureResetWaitMs: ["networkFailureResetWaitMs", 2000],
    maxBufferingTimeAllowedWithNetworkError: ["maxBufferingTimeAllowedWithNetworkError", 60000],
    replicateErrorDirectorInitialBuffering: ["replicateErrorDirectorInitialBuffering", true],
    networkFailureAbandonMs: ["networkFailureAbandonMs", 60000],
    allowSwitchback: ["allowSwitchback", true],
    maxDelayToReportFailure: ["maxDelayToReportFailure", 300],

    // --- Probing ---
    probeRequestTimeoutMilliseconds: ["probeRequestTimeoutMilliseconds", 30000],
    probeRequestConnectTimeoutMilliseconds: ["probeRequestConnectTimeoutMilliseconds", 8000],
    probeDetailDenominator: ["probeDetailDenominator", 100],
    minProbeIntervalMs: ["minProbeIntervalMs", 2000],

    // --- Concurrency ---
    minStreamableConcurrencyWindow: ["minStreamableConcurrencyWindow", 3000],
    maxStreamableConcurrencyWindow: ["maxStreamableConcurrencyWindow", Infinity],
    streamableConcurrencyFactor: ["streamableConcurrencyFactor", 0.3],
    bufferingConcurrencyWindow: ["bufferingConcurrencyWindow", 7800],
    rebufferRiskHalfLife: ["rebufferRiskHalfLife", 10000],
    enableDiscontiguousBuffering: ["enableDiscontiguousBuffering", false],
    maxAllowedOutstandingRequests: ["maxAllowedOutstandingRequests", 4],
    liveRequestSpreadMs: ["liveRequestSpreadMs", 0],
    liveEdgeCushionWithSpreadMs: ["liveEdgeCushionWithSpreadMs", 0],
    enableLive504Handling: ["enableLive504Handling", false],

    // --- Switchable audio ---
    switchableAudioProfiles: ["switchableAudioProfiles", []],
    maxRebufSize: ["maxRebufSize", Infinity],
    prebufferTimeLimit: ["prebufferTimeLimit", 60000],
    audioBufferTargetAvailableSize: ["audioBufferTargetAvailableSize", 262144],
    videoBufferTargetAvailableSize: ["videoBufferTargetAvailableSize", 1048576],

    // --- Graph selector ---
    graphSelectorSetAudioRate: ["graphSelectorSetAudioRate", false],
    jointStreamCreationAlgorithm: ["jointStreamCreationAlgorithm", "optimized"],
    minimumBufferingCompleteInterval: ["minimumBufferingCompleteInterval", 10000],
    bufferingCompleteOnMemoryLimit: ["bufferingCompleteOnMemoryLimit", false],
    maxFastPlayBufferInMs: ["maxFastPlayBufferInMs", 20000],
    maxBufferingCompleteBufferInMs: ["maxBufferingCompleteBufferInMs", Infinity],

    // --- Playgraph weights ---
    playgraphDefaultWeight: ["playgraphDefaultWeight", 65520],
    minimumDownstreamBranchProbability: ["minimumDownstreamBranchProbability", 0.075],
    enableCombinedPlaygraphs: ["enableCombinedPlaygraphs", true],
    enableAdPlaygraphs: ["enableAdPlaygraphs", true],
    enableLiveAdPlaygraphs: ["enableLiveAdPlaygraphs", true],
    enableLiveProgramPlaygraphs: ["enableLiveProgramPlaygraphs", false],
    enableLiveProgramPlaygraphsForLinear: ["enableLiveProgramPlaygraphsForLinear", true],

    // --- Branch creation ---
    branchCreationThreshold: ["branchCreationThreshold", 120000],
    branchDistanceThreshold: ["branchDistanceThreshold", 60000],
    defaultBranchOffsetEnabled: ["defaultBranchOffsetEnabled", true],
    defaultBranchOffsetMs: ["defaultBranchOffsetMs", 10000],
    minimumContentStartTimestampForBranchOffsetMs: ["minimumContentStartTimestampForBranchOffsetMs", 86400000],
    waitForDrmToAppendHeadersWhenClearAndEncryptedContent: ["waitForDrmToAppendHeadersWhenClearAndEncryptedContent", false],
    maxTotalBufferLevelPerSession: ["maxTotalBufferLevelPerSession", 0],
    allowParallelStreaming: ["allowParallelStreaming", true],

    // --- Header cache ---
    defaultHeaderCacheSize: ["defaultHeaderCacheSize", 4],
    defaultHeaderCacheDataPrefetchMs: ["defaultHeaderCacheDataPrefetchMs", 0],
    keepWishListOnExpiration: ["keepWishListOnExpiration", true],
    reuseOnErrorCacheSize: ["reuseOnErrorCacheSize", 1],
    manifestCacheDormantCacheEnabled: ["manifestCacheDormantCacheEnabled", true],
    manifestCacheReuseOnErrorEnabled: ["manifestCacheReuseOnErrorEnabled", true],

    // --- Prefetching ---
    livePrefetchEnabled: ["livePrefetchEnabled", false],
    livePrefetchEnabledForStickySteering: ["livePrefetchEnabledForStickySteering", true],
    prefetchWeightBudget: ["prefetchWeightBudget", 32],
    prefetchWhilePlaying: ["prefetchWhilePlaying", true],
    prefetcherSoftReset: ["prefetcherSoftReset", true],
    prefetchBudgetInBytes: ["prefetchBudgetInBytes", 0],

    // --- Pipeline health ---
    pipelineHealthThresholdCriticalMs: ["pipelineHealthThresholdCriticalMs", 2000],
    pipelineHealthThresholdLowMs: ["pipelineHealthThresholdLowMs", 6000],
    enableRequestAbandonment: ["enableRequestAbandonment", false],
    requestAbandonmentLockIntervalMs: ["requestAbandonmentLockIntervalMs", 10000],
    streamModeAppendAttachThreshold: ["streamModeAppendAttachThreshold", 0.75],

    // --- Download tracks ---
    shareDownloadTracks: ["shareDownloadTracks", true],
    shareOpenRangeTracks: ["shareOpenRangeTracks", false],
    usePipelineForAudio: ["usePipelineForAudio", false],
    usePipelineDetectionForAudio: ["usePipelineDetectionForAudio", false],
    usePipelineForBranchedAudio: ["usePipelineForBranchedAudio", true],
    usePipelineForText: ["usePipelineForText", true],

    // --- Parallelism / socket buffers ---
    maxParallelConnections: ["maxParallelConnections", 3],
    maxActiveRequestsPerSession: ["maxActiveRequestsPerSession", undefined],
    minRequestSize: ["minRequestSize", 65536],
    socketReceiveBufferSize: ["socketReceiveBufferSize", 0],
    audioSocketReceiveBufferSize: ["audioSocketReceiveBufferSize", 32768],
    videoSocketReceiveBufferSize: ["videoSocketReceiveBufferSize", 65536],
    textSocketReceiveBufferSize: ["textSocketReceiveBufferSize", 32768],
    usePipelineDetectionForVideo: ["usePipelineDetectionForVideo", false],
    minVideoSocketReceiveBufferSize: ["minVideoSocketReceiveBufferSize", 65536],
    headersSocketReceiveBufferSize: ["headersSocketReceiveBufferSize", 32768],
    disableHeaderDownloadTracks: ["disableHeaderDownloadTracks", false],

    // --- Stream filtering ---
    streamFilteringRules: ["streamFilteringRules", {
        enabled: false, profiles: ["playready-h264mpl40-dash"], action: "keepLowest",
    }],
    ignoreUserFilterOnEmptyResult: ["ignoreUserFilterOnEmptyResult", true],
    enableResolutionVMAFStreamFilter: ["enableResolutionVMAFStreamFilter", false],
    percentCapTitlesForResolutionVMAFStreamFilter: ["percentCapTitlesForResolutionVMAFStreamFilter", 100],
    resolutionVMAFCappingRuleList: ["resolutionVMAFCappingRuleList", []],
    useLiveBitrateDynamicCap: ["useLiveBitrateDynamicCap", true],
    useProbabilisticLiveBitrateDynamicCap: ["useProbabilisticLiveBitrateDynamicCap", false],
    useLiveBitrateDynamicCapForDai: ["useLiveBitrateDynamicCapForDai", true],

    // --- ASE diagnostics ---
    aseDiagnostics: ["aseDiagnostics", [
        { id: "queue-audit", qcEnabled: true },
        { id: "task-audit", qcEnabled: true },
        { id: "trace-ShimSession", qcEnabled: true },
        { id: "trace-engine", qcEnabled: true },
        { id: "trace-RequestPacer", qcEnabled: true },
        { id: "trace-BufferStateTracker", qcEnabled: true },
        { id: "trace-GraphStreamingProcess", qcEnabled: true },
        { id: "trace-AsePlaygraph", qcEnabled: true },
        { id: "playgraph-branch-audit", qcEnabled: true },
        { id: "content-playgraph", qcEnabled: true },
        { id: "trace-CphAsePlaygraph", qcEnabled: true },
        { id: "trace-GraphLocation", qcEnabled: true },
        { id: "cache-ads::gls", qcEnabled: true },
        { id: "cache-content::gls", qcEnabled: true },
        { id: "trace-LiveOCSideChannel", qcEnabled: true },
        { id: "trace-media-events-provider", qcEnabled: true },
        { id: "trace-Prefetcher", qcEnabled: true },
        { id: "trace-AdBreakHydrator", qcEnabled: true },
    ]],
    enableAseReporting: ["enableAseReporting", true],

    // --- Memory deadlock ---
    memDeadlockShouldCheckMemory: ["memDeadlockShouldCheckMemory", true],
    memDeadlockOverageThreshold: ["memDeadlockOverageThreshold", 0.9],
    memDeadlockMaxUtilizationPercentage: ["memDeadlockMaxUtilizationPercentage", 0.5],

    // --- Ad LRU caches ---
    enableAdLruCaches: ["enableAdLruCaches", false],
    paddingMediaType: ["paddingMediaType", "padding"],
    paddingDurationMs: ["paddingDurationMs", 1000],
    maxLiveDAIReplacedMismatchDurationMs: ["maxLiveDAIReplacedMismatchDurationMs", 2100],
    enablePrerollForInitialSeek: ["enablePrerollForInitialSeek", false],
    rehydrateSkippableAdBreaks: ["rehydrateSkippableAdBreaks", true],
    exposeDroppedAdsToUI: ["exposeDroppedAdsToUI", false],
    hydrateWaitTimeBetweenAdBreaksMs: ["hydrateWaitTimeBetweenAdBreaksMs", 5000],
    maxPlayerDistancePriorToAdBreakHydrationMs: ["maxPlayerDistancePriorToAdBreakHydrationMs", 60000],
    excludedContentPlaygraphIds: ["excludedContentPlaygraphIds", []],

    // --- ASE GC ---
    aseGcSettings: ["aseGcSettings", { segmentPresenting: true, branchPruned: true }],

    // --- Seamless audio ---
    seamlessAudio: ["seamlessAudio", false],
    appendFirstHeaderOnComplete: ["appendFirstHeaderOnComplete", true],
    waitForDrmToAppendMedia: ["waitForDrmToAppendMedia", false],
    enableJustInTimeAppends: ["enableJustInTimeAppends", false],
    enableAsyncAppend: ["enableAsyncAppend", false],
    timeBeforeEndOfStreamBufferMark: ["timeBeforeEndOfStreamBufferMark", 6000],
    delayNotificationOfEoS: ["delayNotificationOfEoS", false],
    minAudioPtsGap: ["minAudioPtsGap", undefined],
    minimumAudioFramesPerFragment: ["minimumAudioFramesPerFragment", 1],
    requireAudioStreamToEncompassVideo: ["requireAudioStreamToEncompassVideo", false],
    mediaSourceSupportsNegativePts: ["mediaSourceSupportsNegativePts", false],
    truncateEndOfStreamAudio: ["truncateEndOfStreamAudio", false],
    insertSilentFramesOnSeek: ["insertSilentFramesOnSeek", false],
    insertSilentFramesOnSeekForTitles: ["insertSilentFramesOnSeekForTitles", []],
    seamlessAudioMaximumSyncError: ["seamlessAudioMaximumSyncError", undefined],
    seamlessAudioMinimumSyncError: ["seamlessAudioMinimumSyncError", undefined],
    audioProfilesNonSyncSamples: ["audioProfilesNonSyncSamples", ["xheaac-dash"]],
    applyProfileTimestampOffset: ["applyProfileTimestampOffset", false],
    useDpiAssumedAacEncoderDelay: ["useDpiAssumedAacEncoderDelay", true],
    insertSilentFramesOnSeekCount: ["insertSilentFramesOnSeekCount", 3],
    segmentFadeInDuration: ["segmentFadeInDuration", -1],
    segmentFadeOutDuration: ["segmentFadeOutDuration", -1],
    maximumFade: ["maximumFade", {
        "heaac-2-dash": -44, "heaac-2hq-dash": -44,
        "ddplus-5.1hq-dash": -44, "ddplus-5.1-dash": -44,
    }],
    retainSbrOnFade: ["retainSbrOnFade", false],
    insertSilentFrameOnFade: ["insertSilentFrameOnFade", true],
    forceAppendHeadersAfterDrm: ["forceAppendHeadersAfterDrm", false],
    appendPacingFactor: ["appendPacingFactor", 0],
    appendPacingThreshold: ["appendPacingThreshold", 3000],

    // --- Live request logging ---
    enableLiveRequestLogger: ["enableLiveRequestLogger", false],
    cdndldistEnabled: ["cdndldistEnabled", false],
    playerPtsPadding: ["playerPtsPadding", 1],

    // --- Session history ---
    minNumSessionHistory: ["minNumSessionHistory", 5],
    baselineHighAndStableThreshold: ["baselineHighAndStableThreshold", { bwThreshold: 20000, nethreshold: 0.15 }],
    liveLowQualityAvoidance: ["liveLowQualityAvoidance", true],
    liveLowQualityThreshold: ["liveLowQualityThreshold", 850],
    liveLowQualityMultiplier: ["liveLowQualityMultiplier", 6],
    liveReportSendIntervalMs: ["liveReportSendIntervalMs", 60000],
    liveReportCollectIntervalMs: ["liveReportCollectIntervalMs", 5000],

    // --- Config manager ---
    useConfigManager: ["useConfigManager", true],
    globalConfigMutationAllowList: ["globalConfigMutationAllowList", {
        SR: "enableMissingSegmentsReplacement",
        minimumPresentationDelayMs: "minimumPresentationDelayMs",
        minPrebufSize: "minPrebufSize",
        enableRequestAbandonment: "enableRequestAbandonment",
        enableMediaEventsTrack: "enableMediaEventsTrack",
        liveAdManifestWindowMs: "liveAdManifestWindowMs",
        liveAdManifestWindowAllowanceMs: "liveAdManifestWindowAllowanceMs",
        alwaysRetainAds: "alwaysRetainAds",
        enableLiveAdPlaygraphs: "enableLiveAdPlaygraphs",
    }],

    // --- Network measurement thresholds ---
    ignoreShortResponses: ["ignoreShortResponses", true],
    shortResponseDurationMs: ["shortResponseDurationMs", 10],
    shortResponseBytes: ["shortResponseBytes", 10000],
    expandDownloadTime: ["expandDownloadTime", true],
    minimumResponseDurationMs: ["minimumResponseDurationMs", 10],
    minimumMeasurementTime: ["minimumMeasurementTime", 500],
    minimumMeasurementBytes: ["minimumMeasurementBytes", 131072],
    probingMeasurementTime: ["probingMeasurementTime", 2000],
    probingMeasurementBytes: ["probingMeasurementBytes", 262144],
    stopNetworkConfidence: ["stopNetworkConfidence", true],
    historicBandwidthUpdateInterval: ["historicBandwidthUpdateInterval", 2000],
    stopOnAllInactiveRequests: ["stopOnAllInactiveRequests", false],
    enableActiveRequestsInFilters: ["enableActiveRequestsInFilters", true],
    resetActiveRequestsAtSessionInit: ["resetActiveRequestsAtSessionInit", true],

    // --- Throughput filters ---
    enableThroughputTraceResearchData: ["enableThroughputTraceResearchData", false],
    throughputTraceParam: ["throughputTraceParam", { numB: 3600, bSizeMs: 2000, fillS: "last", fillHl: 1000 }],
    wsslAggregationMethod: ["wsslAggregationMethod", "max"],
    secondThroughputEstimator: ["secondThroughputEstimator", "slidingwindow"],
    defaultFilter: ["defaultFilter", "throughput-ewma"],
    defaultFilterField: ["defaultFilterField", "average"],
    secondaryFilter: ["secondaryFilter", "throughput-sw"],
    startMonitorOnLoadStart: ["startMonitorOnLoadStart", false],
    enableFilters: ["enableFilters", [
        "throughput-ewma", "initial-throughput-ewma", "throughput-sw",
        "throughput-sw-fast", "throughput-iqr", "avtp", "entropy", "deliverytime",
    ]],
    experimentalFilter: ["experimentalFilter", ["initial-throughput-ewma"]],

    // --- Header request size ---
    headerRequestSize: ["headerRequestSize", 4096],
    estimateHeaderSize: ["estimateHeaderSize", true],
    useSidxInfoFromManifestForHeaderRequestSize: ["useSidxInfoFromManifestForHeaderRequestSize", false],
    fastPlayHeaderRequestSize: ["fastPlayHeaderRequestSize", 0],
    minTimeBetweenHeaderRequests: ["minTimeBetweenHeaderRequests", undefined],

    // --- OC Side Channel ---
    enableOCSideChannel: ["enableOCSideChannel", true],
    decryptOCSideChannelMinInterval: ["decryptOCSideChannelMinInterval", 1000],
    decryptOCSideChannelMinIntervalAfterCompleted: ["decryptOCSideChannelMinIntervalAfterCompleted", 1000],
    enableLiveOCSideChannelRefresh: ["enableLiveOCSideChannelRefresh", true],
    liveOCSideChannelRefreshInterval: ["liveOCSideChannelRefreshInterval", 30000],
    OCSCBufferQuantizationConfig: ["OCSCBufferQuantizationConfig", { lv: 5, mx: 240 }],
    enableUnifiedSideChannel: ["enableUnifiedSideChannel", false],
    liveEnableUnifiedSideChannel: ["liveEnableUnifiedSideChannel", false],
    svodEnableUnifiedSideChannel: ["svodEnableUnifiedSideChannel", false],

    // --- Transition ---
    forceImmediateTransitionTypeForTitles: ["forceImmediateTransitionTypeForTitles", []],
    forceImmediateTransitionExitZone: ["forceImmediateTransitionExitZone", 0],
    maxActiveRequestsSABCell100: ["maxActiveRequestsSABCell100", 2],
    contentOverrides: ["contentOverrides", undefined],
    contentProfileOverrides: ["contentProfileOverrides", undefined],

    // --- Error thresholds ---
    maxNetworkErrorsDuringBuffering: ["maxNetworkErrorsDuringBuffering", 20],
    maxFastPlayContentTimeThresholdMs: ["maxFastPlayContentTimeThresholdMs", 112000],

    // --- Branch timing ---
    minimumTimeBeforeBranchDecision: ["minimumTimeBeforeBranchDecision", 2000],
    minimumAppendedMediaBeforePlayback: ["minimumAppendedMediaBeforePlayback", 5000],
    jitBranchAppendingDistance: ["jitBranchAppendingDistance", 10000],

    // --- Research ---
    researchEnvironmentEnabled: ["researchEnvironmentEnabled", false],
    ase_dump_fragments: ["ase_dump_fragments", false],
    stallAtFrameCountAudio: ["stallAtFrameCountAudio", undefined],

    // --- IQR ---
    maxIQRSamples: ["maxIQRSamples", 100],
    minIQRSamples: ["minIQRSamples", 5],

    // --- Seamless audio profiles ---
    seamlessAudioProfiles: ["seamlessAudioProfiles", []],
    seamlessAudioProfilesAndTitles: ["seamlessAudioProfilesAndTitles", {}],
    editCompleteFragments: ["editCompleteFragments", true],
    audioOverlapGuardSampleCount: ["audioOverlapGuardSampleCount", 2],

    // --- JS Bridge perf ---
    enableRecordJSBridgePerf: ["enableRecordJSBridgePerf", false],
    JSBridgeTDigestConfig: ["JSBridgeTDigestConfig", { maxc: 25, c: 0.5 }],

    // --- Hindsight ---
    hindsightDenominator: ["hindsightDenominator", 0],
    hindsightDebugDenominator: ["hindsightDebugDenominator", 0],
    hindsightAlgorithmsEnabled: ["hindsightAlgorithmsEnabled", []],
    hindsightParam: ["hindsightParam", { numB: Infinity, bSizeMs: 1000, fillS: "last", fillHl: 1000 }],

    // --- ASE reporting ---
    aseReportDenominator: ["aseReportDenominator", 0],
    aseReportIntervalMs: ["aseReportIntervalMs", 300000],
    aseReportMaxStreamSelections: ["aseReportMaxStreamSelections", 400],

    // --- Contiguous buffer ---
    contiguousBufferMultiplier: ["contiguousBufferMultiplier", 3],
    contiguousBufferMinimumAudio: ["contiguousBufferMinimumAudio", 1048576],
    contiguousBufferMinimumVideo: ["contiguousBufferMinimumVideo", 8388608],
    contiguousBufferMinimumText: ["contiguousBufferMinimumText", 0],
    useBufferSizeLimiter: ["useBufferSizeLimiter", false],
    useStaticBufferSizeLimiter: ["useStaticBufferSizeLimiter", false],

    // --- PTS / setTimeout ---
    supportsPtsChanged: ["supportsPtsChanged", true],
    usePrioritySetTimeout: ["usePrioritySetTimeout", false],
    centralizeClockSchedulers: ["centralizeClockSchedulers", true],
    backOffSetTimeout: ["backOffSetTimeout", true],
    skipIntroPlaygraphEnabled: ["skipIntroPlaygraphEnabled", false],
    enableMediaEventHistory: ["enableMediaEventHistory", true],
    enableBufferSizeLimiterTracer: ["enableBufferSizeLimiterTracer", false],

    // --- Live ---
    liveShouldAccountForPlayDelay: ["liveShouldAccountForPlayDelay", false],
    useManifestServerExpiration: ["useManifestServerExpiration", false],
    alwaysRetainAds: ["alwaysRetainAds", false],
    enableMediaEventsTrack: ["enableMediaEventsTrack", false],

    // --- Live ad manifest ---
    liveAdManifestWindowMs: ["liveAdManifestWindowMs", 10000],
    liveAdManifestWindowAllowanceMs: ["liveAdManifestWindowAllowanceMs", 5000],
    liveAdEarlyTerminationCushionMs: ["liveAdEarlyTerminationCushionMs", 1000],
    liveAdManifestWindowOnset: ["liveAdManifestWindowOnset", 0],
    enableLiveManifestThrottling: ["enableLiveManifestThrottling", true],
    reuseTcpConnectionsWhenStickySteered: ["reuseTcpConnectionsWhenStickySteered", false],
    liveShareTcpConnections: ["liveShareTcpConnections", [[]]],
    liveUseMediaTcpForHeaders: ["liveUseMediaTcpForHeaders", false],

    // --- Synthetic ads ---
    syntheticAdBreakUx: ["syntheticAdBreakUx", ""],
    padOcaSideChannelRequests: ["padOcaSideChannelRequests", true],

    // --- Live hydration ---
    liveHydrationMinDistanceFromLiveEdge: ["liveHydrationMinDistanceFromLiveEdge", 30000],
    canPerformHydrationsCloseToLiveEdge: ["canPerformHydrationsCloseToLiveEdge", false],
    liveHydrationMinDistanceFromPlayback: ["liveHydrationMinDistanceFromPlayback", 120000],
    liveHydrationDefaultJitterWindow: ["liveHydrationDefaultJitterWindow", 30000],
    liveHydrationDistanceThatNeedJitter: ["liveHydrationDistanceThatNeedJitter", 120000],
    canPerformSoftHydrations: ["canPerformSoftHydrations", true],
    paceHydrationPolicyByLiveEdge: ["paceHydrationPolicyByLiveEdge", true],

    // --- Black box ---
    enableBlackBoxNotification: ["enableBlackBoxNotification", true],
    liveMediaEventsMinBufferMs: ["liveMediaEventsMinBufferMs", 4000],
    maxWaitTimeForMediaEventsWhileBufferingMS: ["maxWaitTimeForMediaEventsWhileBufferingMS", 5000],
    liveMediaEventsCatchupMs: ["liveMediaEventsCatchupMs", 30000],
    earlyFetchMediaEvents: ["earlyFetchMediaEvents", true],
    liveMaximumEventsCatchupMs: ["liveMaximumEventsCatchupMs", 120000],
    linearMaximumEventsCatchupMs: ["linearMaximumEventsCatchupMs", 20000],
    enableAdPlaygraphsForBranching: ["enableAdPlaygraphsForBranching", true],
    alwaysSendSideChannel: ["alwaysSendSideChannel", true],
    defaultTimeoutForFetchRequests: ["defaultTimeoutForFetchRequests", 8000],
    serverClockSyncOnViewableRetrievalTimeout: ["serverClockSyncOnViewableRetrievalTimeout", 10000],
    enableLiveWithAdsOptimalPanic: ["enableLiveWithAdsOptimalPanic", false],

    // --- Batch requests ---
    batchRequestThrottlerMaxDuration: ["batchRequestThrottlerMaxDuration", 15000],
    batchRequestThrottlerSleepDuration: ["batchRequestThrottlerSleepDuration", 0],
    enableLiveAdBreakReportingEvents: ["enableLiveAdBreakReportingEvents", true],

    // --- Presentation delay ---
    minimumPresentationDelayMs: ["minimumPresentationDelayMs", 10000],
    liveEdgeSegmentSkipCount: ["liveEdgeSegmentSkipCount", 0],
    linearEnforceSegmentAvailabilityWindowAtIssueRequest: ["linearEnforceSegmentAvailabilityWindowAtIssueRequest", true],
    mediaEventsMaxRetry: ["mediaEventsMaxRetry", 20],
    enablePresentationDelayControl: ["enablePresentationDelayControl", false],
    targetPresentationDelayToleranceMs: ["targetPresentationDelayToleranceMs", 500],
    presentationDelayQoeLockPeriodMs: ["presentationDelayQoeLockPeriodMs", 60000],

    // --- Live request pacing ---
    enableLiveRequestPacing: ["enableLiveRequestPacing", true],
    enableLiveLikeRequestPacing: ["enableLiveLikeRequestPacing", false],
    liveLikeRequestPacingMultiplier: ["liveLikeRequestPacingMultiplier", 1],
    logarithmicRequestPacingCurveCenterPositionMs: ["logarithmicRequestPacingCurveCenterPositionMs", 40000],
    logarithmicRequestPacingCurveSharpness: ["logarithmicRequestPacingCurveSharpness", 8],
    maxLiveTargetBufferDurationMs: ["maxLiveTargetBufferDurationMs", 240000],

    // --- ELLA (Enhanced Low-Latency Access) ---
    liveIsEllaEnabled: ["liveIsEllaEnabled", false],
    liveIsEllaABREnabled: ["liveIsEllaABREnabled", true],
    liveIsEllaHttpMixingEnabled: ["liveIsEllaHttpMixingEnabled", true],
    liveEllaEdgeCushion: ["liveEllaEdgeCushion", 4000],
    liveEllaProximityThresholdMs: ["liveEllaProximityThresholdMs", 4000],
    liveEllaProximityCheckIntervalMs: ["liveEllaProximityCheckIntervalMs", 500],
    liveEllaTimeoutMultiplier: ["liveEllaTimeoutMultiplier", 2],
    ellaBandwidthOracle: ["ellaBandwidthOracle", -1],
    ellaBandwidthOracleMargin: ["ellaBandwidthOracleMargin", 0.2],
    ellaAudioThroughputPercentage: ["ellaAudioThroughputPercentage", 10],
    ellaThroughputBasedSelectionMargin: ["ellaThroughputBasedSelectionMargin", 0.4],
    ellaChannelSelectionMode: ["ellaChannelSelectionMode", "loss-queuing-delay"],
    ellaChannelSwitchRRRate: ["ellaChannelSwitchRRRate", 1],
    ellaPktLossRateThreshold: ["ellaPktLossRateThreshold", [0.01, 0.02]],
    ellaQueuingDelayThreshold: ["ellaQueuingDelayThreshold", [200, 500]],
    ellaLockPeriodToStayMs: ["ellaLockPeriodToStayMs", 10000],
    ellaLockPeriodToDrainMs: ["ellaLockPeriodToDrainMs", 10000],
    ellaMaxEncodingBitrateKbps: ["ellaMaxEncodingBitrateKbps", 8500],
    ellaMinEncodingBitrateKbps: ["ellaMinEncodingBitrateKbps", 800],
    ellaEnableForceDownswitch: ["ellaEnableForceDownswitch", false],
    ellaImplementation: ["ellaImplementation", "js"],
    ellaCdnBaseUrl: ["ellaCdnBaseUrl", "https://occ.a.nflxso.net/genc/nrdp/ella/$packageName/$version/$filename"],
    ellaCdnFilename: ["ellaCdnFilename", "index.release.js"],
    ellaCdnSkipVersionCheck: ["ellaCdnSkipVersionCheck", false],
    ellaRelayFailureRecordWindowMs: ["ellaRelayFailureRecordWindowMs", 600000],
    ellaRelayMaxFailuresInWindow: ["ellaRelayMaxFailuresInWindow", 50],
    ellaRelayMaxConsecutiveFailures: ["ellaRelayMaxConsecutiveFailures", 10],
    ellaChannelHealthMonitoringWindowMs: ["ellaChannelHealthMonitoringWindowMs", 60000],
    ellaChannelHealthPollingIntervalMs: ["ellaChannelHealthPollingIntervalMs", 10000],
    ellaChannelMaxFailuresInWindow: ["ellaChannelMaxFailuresInWindow", 10],
    ellaChannelMaxConsecutiveFailures: ["ellaChannelMaxConsecutiveFailures", 5],
    overrideManifestForElla: ["overrideManifestForElla", true],
    overrideEllaRelayServers: ["overrideEllaRelayServers", true],
    ellaRelayServers: ["ellaRelayServers", [
        { id: 2, ipAddress: "2a00:86c0:2028:2028::166", port: 7002, certificate: "" },
        { id: 1, ipAddress: "198.38.100.140", port: 7002, certificate: "" },
        { id: 3, ipAddress: "::1", port: 7002, certificate: "" },
    ]],
    ellaFecRate: ["ellaFecRate", 0.1],
    ellaSendRateMultiplier: ["ellaSendRateMultiplier", [1.1, 1.2, 1.5]],
    ellaChannelNamePrefix: ["ellaChannelNamePrefix", "/2557822/1263725932"],
    ellaMovieId: ["ellaMovieId", 82101269],

    // --- SVOD pacing ---
    enableSvodRequestPacing: ["enableSvodRequestPacing", true],
    svodBufferGrowthRateSlope: ["svodBufferGrowthRateSlope", 2],
    minSvodTargetBufferDurationMs: ["minSvodTargetBufferDurationMs", 60000],
    enableSvodLogarithmicPacing: ["enableSvodLogarithmicPacing", false],
    svodLogarithmicRequestPacingCurveCenterPositionMs: ["svodLogarithmicRequestPacingCurveCenterPositionMs", 40000],
    svodLogarithmicRequestPacingCurveSharpness: ["svodLogarithmicRequestPacingCurveSharpness", 8],

    // --- Explicit downloadables ---
    explicitVideoDownloadablesMap: ["explicitVideoDownloadablesMap", {}],
    adsTruncationThreshold: ["adsTruncationThreshold", 2500],
    useNextSegmentSizeForLiveSelection: ["useNextSegmentSizeForLiveSelection", false],

    // --- Laser (debug/test tool) ---
    laser: ["laser", false],
    laserEvents: ["laserEvents", { "*": true }],
    laserSessionType: ["laserSessionType", "MANUAL_TEST"],
    laserSessionDescription: ["laserSessionDescription", undefined],
    laserSessionName: ["laserSessionName", undefined],
    laserRunId: ["laserRunId", undefined],
});

/** @type {Object} Alias for backward compatibility */
export const configSchema = ASE_CONFIG_DEFAULTS;

/** @type {Object} Alias for backward compatibility */
export const configBase = ASE_CONFIG_DEFAULTS;

export default ASE_CONFIG_DEFAULTS;
