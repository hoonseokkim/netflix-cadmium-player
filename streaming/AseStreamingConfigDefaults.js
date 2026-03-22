/**
 * Netflix Cadmium Player - ASE (Adaptive Streaming Engine) Default Configuration
 *
 * Defines the complete set of default configuration parameters for the adaptive
 * streaming engine. Each entry maps an internal property key to a tuple of
 * [configName, defaultValue] used by the ConfigManager to build runtime configs.
 *
 * Categories covered:
 *  - Buffering & prebuffer sizing
 *  - Media request sizing & duration constraints
 *  - Stream selection / ABR (Adaptive Bitrate) algorithms
 *  - Bandwidth estimation & throughput filters
 *  - Client-side pacing (CPR) & pacing rate selection
 *  - Network error handling & location failover
 *  - Live streaming (latency, ELLA, presentation delay, ad insertion)
 *  - Audio processing (seamless audio, fading, timestamp offsets)
 *  - Playgraph management & branching
 *  - Prefetching & header caching
 *  - OC (Open Connect) side-channel communication
 *  - SVOD (Subscription Video on Demand) ad support
 *  - Diagnostics, reporting & research tooling (Laser, Hindsight)
 *
 * @module AseStreamingConfigDefaults
 * @see Module_36948
 */

// ─────────────────────────────────────────────────────────────────────────────
// Default AAC timestamp offset values (in ticks / timescale)
// ─────────────────────────────────────────────────────────────────────────────
/** @type {{ ticks: number, timescale: number }} */
const DEFAULT_AAC_TIMESTAMP_OFFSET = { ticks: -3268, timescale: 48_000 };

// ─────────────────────────────────────────────────────────────────────────────
// Main configuration defaults
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The base configuration object for the ASE.
 *
 * Each property is a tuple of `[configKey, defaultValue]` where `configKey` is
 * the string name (or array of aliases) used to look up overrides from the
 * manifest / steering response, and `defaultValue` is the fallback.
 *
 * @type {Record<string, [string | string[], any]>}
 */
export const ASE_CONFIG_DEFAULTS = {

  // ── Buffering ─────────────────────────────────────────────────────────

  /** Minimum interval (ms) between checks for buffering-complete state. */
  minCheckBufferingCompleteInterval: ["minCheckBufferingCompleteInterval", 200],

  /** When true, buffering-complete checks run more frequently. */
  enableMoreFrequentBufferingCompleteCheck: ["enableMoreFrequentBufferingCompleteCheck", false],

  // ── Audio timestamp offsets ───────────────────────────────────────────

  /** Default timestamp offset applied to AAC audio. */
  defaultAacTimestampOffset: ["defaultAacTimestampOffset", { ...DEFAULT_AAC_TIMESTAMP_OFFSET }],

  /**
   * Per-profile timestamp offsets keyed by audio profile name and bitrate.
   * @type {[string, Record<string, Record<number, { ticks: number, timescale: number }>>]}
   */
  profileTimestampOffsets: ["profileTimestampOffsets", {
    "heaac-2-dash": {
      64:  { ticks: -3268, timescale: 48_000 },
      96:  { ticks: -3268, timescale: 48_000 },
    },
    "heaac-2hq-dash": {
      128: { ticks: -3268, timescale: 48_000 },
    },
    "heaac-5.1-dash": {
      192: { ticks: -3268, timescale: 48_000 },
    },
  }],

  // ── Codec & stall ─────────────────────────────────────────────────────

  /** Strategy for selecting padding codec: "strict" or "relaxed". */
  paddingCodecSelector: ["paddingCodecSelector", "strict"],

  /** If set, stall playback when the decoded frame count reaches this value. */
  stallAtFrameCount: ["stallAtFrameCount", undefined],

  /** How long (ms) to delay saving bitrate measurements. */
  saveBitrateMs: ["saveBitrateMs", 0],

  // ── Download-during-buffering ─────────────────────────────────────────

  /** Require download data to be present before exiting buffering. */
  requireDownloadDataAtBuffering: ["requireDownloadDataAtBuffering", false],

  /** Which indicator to use: "oncomplete" or "onprogress". */
  indicatorForDownloadDataAtBuffering: ["indicatorForDownloadDataAtBuffering", "oncomplete"],

  /** Set up a connection while still in buffering state. */
  requireSetupConnectionDuringBuffering: ["requireSetupConnectionDuringBuffering", false],

  // ── Request sizing ────────────────────────────────────────────────────

  /** Maximum size (bytes) of a single media request (0 = unlimited). */
  maxRequestSize: ["maxRequestSize", 0],

  // ── Nginx rate limiting ───────────────────────────────────────────────

  /** Enable Nginx-side rate limiting of media delivery. */
  enableNginxRateLimit: ["enableNginxRateLimit", false],

  /** Target Nginx sending rate in kbps. */
  nginxSendingRate: ["nginxSendingRate", 40_000],

  // ── Client-side Pacing Rate (CPR) ─────────────────────────────────────

  /** Enable CPR for audio streams. */
  enableCprAudio: ["enableCprAudio", false],

  /** Enable CPR for video streams. */
  enableCprVideo: ["enableCprVideo", true],

  /** Enable CPR for live streams. */
  enableCprLive: ["enableCprLive", false],

  /** Enable CPR for DAI (Dynamic Ad Insertion) streams. */
  enableCprDai: ["enableCprDai", false],

  /** Enable CPR for SVOD ad-supported streams. */
  enableCprSvodAd: ["enableCprSvodAd", false],

  /** Enable hybrid pacing (combination of server and client pacing). */
  enableHybridPacing: ["enableHybridPacing", false],

  /** When true, the player tries to catch up to a target buffer level. */
  catchUpMode: ["catchUpMode", false],

  /** Maximum number of segment hints to send per request. */
  maxSegHint: ["maxSegHint", 4],

  /** Log individual request-level details. */
  requestLevelLogging: ["requestLevelLogging", false],

  /** Handle concurrent streaming sessions gracefully. */
  enableConcurrentStreamingHandling: ["enableConcurrentStreamingHandling", false],

  /** Apply pacing to switchable audio tracks. */
  enablePacingOnSwitchableAudio: ["enablePacingOnSwitchableAudio", false],

  // ── Pipeline ──────────────────────────────────────────────────────────

  /** Enable the media request pipeline. */
  pipelineEnabled: ["pipelineEnabled", true],

  /** Enable byte-range hints in side-channel requests. */
  enableSCByteRangeHints: ["enableSCByteRangeHints", false],

  // ── Segment & prebuffer ───────────────────────────────────────────────

  /** Duration (ms) for cross-fading between segments. */
  segmentFadeDuration: ["segmentFadeDuration", 400],

  /** Maximum prebuffer size in kbps. */
  maxPrebufSize: ["maxPrebufSize", 50_000],

  /** Minimum prebuffer size in kbps. */
  minPrebufSize: ["minPrebufSize", 5756],

  /** Minimum buffer level (ms) for just-in-time appending. */
  minimumJustInTimeBufferLevel: ["minimumJustInTimeBufferLevel", 3000],

  // ── Missing segments ──────────────────────────────────────────────────

  /** Detect missing segments in the stream. */
  enableMissingSegmentsDetection: ["enableMissingSegmentsDetection", true],

  /** Replace detected missing segments with synthesized data. */
  enableMissingSegmentsReplacement: ["enableMissingSegmentsReplacement", true],

  /** Use next-segment-size information from OC (Open Connect). */
  enableNextSegmentSizeFromOC: ["enableNextSegmentSizeFromOC", true],

  // ── Live streaming basics ─────────────────────────────────────────────

  /** Switch streams on pipeline error during live playback. */
  liveSwitchStreamsOnErrorInPipeline: ["liveSwitchStreamsOnErrorInPipeline", true],

  /** Window (ms) for retrying at the live edge after errors. */
  liveEdgeRetryWindowMs: ["liveEdgeRetryWindowMs", 6000],

  /** Simulate being at the live edge (testing only). */
  simulateLiveEdge: ["simulateLiveEdge", false],

  /** Simulated distance from live edge in ms (testing only). */
  simulateLiveEdgeDistance: ["simulateLiveEdgeDistance", 0],

  // ── Media request size constraints ────────────────────────────────────

  /** Minimum video media request size in bytes. */
  minVideoMediaRequestSizeBytes: ["minVideoMediaRequestSizeBytes", 0],

  /** Minimum audio media request size in bytes. */
  minAudioMediaRequestSizeBytes: ["minAudioMediaRequestSizeBytes", 0],

  /** Maximum video media request size in bytes. */
  maxVideoMediaRequestSizeBytes: ["maxVideoMediaRequestSizeBytes", Infinity],

  /** Maximum audio media request size in bytes. */
  maxAudioMediaRequestSizeBytes: ["maxAudioMediaRequestSizeBytes", Infinity],

  // ── Media request duration constraints ────────────────────────────────

  /** Minimum video media request duration (ms). */
  minVideoMediaRequestDuration: ["minVideoMediaRequestDuration", 0],

  /** Minimum audio media request duration (ms). */
  minAudioMediaRequestDuration: ["minAudioMediaRequestDuration", 0],

  /** Minimum media request duration (ms) for any type. */
  minMediaRequestDuration: ["minMediaRequestDuration", 0],

  /** Maximum media request duration (ms) for any type. */
  maxMediaRequestDuration: ["maxMediaRequestDuration", Infinity],

  /** Maximum video media request duration (ms). */
  maxVideoMediaRequestDuration: ["maxVideoMediaRequestDuration", Infinity],

  /** Maximum audio media request duration (ms). */
  maxAudioMediaRequestDuration: ["maxAudioMediaRequestDuration", Infinity],

  // ── Request aggregation & caching ─────────────────────────────────────

  /** Allow aggregating the first media request. */
  allowFirstRequestAggregation: ["allowFirstRequestAggregation", false],

  /** Timeout (ms) for reuse-on-error cache entries. */
  reuseOnErrorCacheTimeout: ["reuseOnErrorCacheTimeout", 60_000],

  /** Maximum fraction of request size in bytes. */
  maxMediaRequestSizeBytesInFraction: ["maxMediaRequestSizeBytesInFraction", 1],

  // ── Exit zones ────────────────────────────────────────────────────────

  /** Use exit-zone logic for playback transitions. */
  useExitZones: ["useExitZones", true],

  /** Maximum duration (ms) of live end-slate content. */
  liveEndSlateMaxDuration: ["liveEndSlateMaxDuration", 60_000],

  // ── Stream selection algorithms ───────────────────────────────────────

  /** ASE stream selector algorithm variant. */
  ase_stream_selector: ["ase_stream_selector", "optimized"],

  /** Audio stream selector algorithm name. */
  audiostreamSelectorAlgorithm: ["audiostreamSelectorAlgorithm", "selectaudioadaptive"],

  /** Live stream selector algorithm name. */
  liveStreamSelectorAlgorithm: ["liveStreamSelectorAlgorithm", "livesimple"],

  /** Enable joint audio+video stream selection. */
  jointStreamSelectorEnabled: ["jointStreamSelectorEnabled", false],

  // ── Header pre-downloading ────────────────────────────────────────────

  /** Enable smart header pre-downloading based on heuristics. */
  smartHeaderPreDownloading: ["smartHeaderPreDownloading", false],

  /** Minimum buffer length (ms) before header downloads are allowed. */
  minBufferLenForHeaderDownloading: ["minBufferLenForHeaderDownloading", 10_000],

  // ── Watermark levels ──────────────────────────────────────────────────

  /** Multiplier applied to connect time in stream selection. */
  connectTimeMultiplier: ["connectTimeMultiplier", 1],

  /**
   * Lowest water-mark level (ms) below which urgent downloading starts.
   * Accepts multiple config key aliases.
   */
  lowestWaterMarkLevel: [["lowestWaterMarkLevel", "lowestWatermarkLevel"], 30_000],

  /** Whether lowest water-mark level is relaxed when buffer is adequate. */
  lowestWaterMarkLevelBufferRelaxed: ["lowestWaterMarkLevelBufferRelaxed", false],

  // ── Buffer levels ─────────────────────────────────────────────────────

  /** Minimum required buffer (ms) before playback starts. */
  minRequiredBuffer: ["minRequiredBuffer", 20_000],

  /** Maximum trailing buffer (ms) kept behind playback position. */
  maxTrailingBufferLen: ["maxTrailingBufferLen", 15_000],

  /** Absolute maximum media buffer allowed (ms). */
  maxMediaBufferAllowed: ["maxMediaBufferAllowed", 270_000],

  // ── ABR simulation ────────────────────────────────────────────────────

  /** Strategy for calculating simulation duration: "default" or custom. */
  simulationDurationStrategy: ["simulationDurationStrategy", "default"],

  /** Percentage of full buffer used in simulation. */
  simulationFullBufferPercentage: ["simulationFullBufferPercentage", 1],

  /** Minimum simulation duration (ms) for ABR decisions. */
  minSimulationDuration: ["minSimulationDuration", 20_000],

  /** Maximum simulation duration (ms) for ABR decisions. */
  maxSimulationDuration: ["maxSimulationDuration", 300_000],

  // ── Stream retention & transition windows ─────────────────────────────

  /** Window (ms) for retaining a high-quality stream before downswitch. */
  highStreamRetentionWindow: ["highStreamRetentionWindow", 90_000],

  /** Window (ms) for transitioning to a lower stream. */
  lowStreamTransitionWindow: ["lowStreamTransitionWindow", 510_000],

  /** Retention window (ms) specifically for upswitches. */
  highStreamRetentionWindowUp: ["highStreamRetentionWindowUp", 500_000],

  /** Transition window (ms) specifically for upswitches. */
  lowStreamTransitionWindowUp: ["lowStreamTransitionWindowUp", 100_000],

  /** Retention window (ms) specifically for downswitches. */
  highStreamRetentionWindowDown: ["highStreamRetentionWindowDown", 600_000],

  /** Transition window (ms) specifically for downswitches. */
  lowStreamTransitionWindowDown: ["lowStreamTransitionWindowDown", 0],

  /** Factor below which a bitrate is considered infeasible for high streams. */
  highStreamInfeasibleBitrateFactor: ["highStreamInfeasibleBitrateFactor", 0.5],

  // ── Switch factors ────────────────────────────────────────────────────

  /** Throughput multiplier required for a fast downswitch. */
  fastDownswitchFactor: ["fastDownswitchFactor", 3],

  /** Throughput multiplier required for a fast upswitch. */
  fastUpswitchFactor: ["fastUpswitchFactor", 3],

  /** Fast upswitch factor when headers are not yet downloaded. */
  fastUpswitchFactorWithoutHeaders: ["fastUpswitchFactorWithoutHeaders", 3],

  /** Fast upswitch factor for the very next segment. */
  fastUpswitchFactorForNextSegment: ["fastUpswitchFactorForNextSegment", 1],

  /** Whether to account for TCP connect time in ABR decisions. */
  considerConnectTime: ["considerConnectTime", true],

  /** Minimum buffer level (ms) required before considering an upswitch. */
  lowestBufForUpswitch: ["lowestBufForUpswitch", 9000],

  /** Lock period (ms) after a downswitch before allowing upswitch. */
  lockPeriodAfterDownswitch: ["lockPeriodAfterDownswitch", 15_000],

  /** Low water-mark level (ms) triggering caution in ABR. */
  lowWatermarkLevel: ["lowWatermarkLevel", 15_000],

  /** Allow skipping intermediate bitrate levels during upswitch. */
  skipBitrateInUpswitch: ["skipBitrateInUpswitch", false],

  /** Buffer level (ms) at which bitrate skipping begins. */
  watermarkLevelForSkipStart: ["watermarkLevelForSkipStart", 8000],

  // ── Stream selection tracing ──────────────────────────────────────────

  /**
   * Trace configuration for stream selection decisions.
   * Each entry: { f: flag, s: severity }.
   */
  streamSelectionTrace: ["streamSelectionTrace", [
    { f: 60, s: 5 },
    { f: 61, s: 3 },
    { f: 62, s: 2 },
    { f: 63, s: 0 },
  ]],

  /** Pre-download all headers for all available streams. */
  enableAllHeadersPreDownloading: ["enableAllHeadersPreDownloading", false],

  /** Enable augmented data collection for stream selection. */
  enableStreamSelectionAugmentData: ["enableStreamSelectionAugmentData", false],

  /** Number of chunks to include in augment data. */
  augmentDataNumOfChunks: ["augmentDataNumOfChunks", 30],

  /** Minimum VMAF score required per fragment. */
  minFragmentVmaf: ["minFragmentVmaf", undefined],

  // ── Live stream selection ─────────────────────────────────────────────

  /** Use latency measurements in live stream selection. */
  liveStreamSelectorUseLatency: ["liveStreamSelectorUseLatency", true],

  /** Multiplier applied to latency in live ABR. */
  latencyMultiplierForLive: ["latencyMultiplierForLive", 4],

  /** Multiplier applied to average latency for live ABR. */
  latencyAverageMultiplierForLive: ["latencyAverageMultiplierForLive", 1],

  /** Discount factor applied to throughput for live streams. */
  throughputDiscountForLive: ["throughputDiscountForLive", 0.8],

  /** Exponent for throughput discount during buffering-complete. */
  throughputDiscountExponentBC: ["throughputDiscountExponentBC", 1.5],

  /** Strategy for buffer ratio in live ABR: "strict" or "relaxed". */
  liveBufferRatioStrategy: ["liveBufferRatioStrategy", "strict"],

  /** Threshold parameter for throughput-based stream selector. */
  throughputThresholdSelectorParam: ["throughputThresholdSelectorParam", 0],

  /** List of reported filter names. */
  reportedFilters: ["reportedFilters", []],

  // ── Buffering selector ────────────────────────────────────────────────

  /** Algorithm used for selecting streams during buffering. */
  bufferingSelectorAlgorithm: ["bufferingSelectorAlgorithm", "default"],

  /** Factor for allowing upswitch during buffering. */
  upswitchDuringBufferingFactor: ["upswitchDuringBufferingFactor", 2],

  /** Allow quality upswitch while still in buffering state. */
  allowUpswitchDuringBuffering: ["allowUpswitchDuringBuffering", false],

  /** Maximum number of upswitch steps allowed for live. */
  liveMaxUpswitchSteps: ["liveMaxUpswitchSteps", Infinity],

  /** Skip repeated first-selection logic. */
  noRepeatedFirstSelectionLogic: ["noRepeatedFirstSelectionLogic", false],

  // ── Initial bitrate / throughput ──────────────────────────────────────

  /** Default throughput estimate (kbps) when no history is available. */
  defaultThroughput: ["defaultThroughput", 1537],

  /** Minimum initial video bitrate (kbps). */
  minInitVideoBitrate: ["minInitVideoBitrate", -Infinity],

  /** Maximum initial video bitrate (kbps). */
  maxInitVideoBitrate: ["maxInitVideoBitrate", Infinity],

  /** Minimum initial audio bitrate (kbps). */
  minInitAudioBitrate: ["minInitAudioBitrate", -Infinity],

  /** Maximum initial audio bitrate (kbps). */
  maxInitAudioBitrate: ["maxInitAudioBitrate", Infinity],

  // ── Bitrate / VMAF constraints ────────────────────────────────────────

  /** Minimum acceptable video bitrate (kbps). */
  minAcceptableVideoBitrate: ["minAcceptableVideoBitrate", -Infinity],

  /** Minimum acceptable VMAF score for video quality. */
  minAcceptableVMAF: ["minAcceptableVMAF", 0],

  /** Scaling factor for minimum acceptable VMAF during rebuffering. */
  minAcceptableVMAFRebufferScalingFactor: ["minAcceptableVMAFRebufferScalingFactor", 0],

  /** Hard minimum allowed video bitrate (kbps). */
  minAllowedVideoBitrate: ["minAllowedVideoBitrate", -Infinity],

  /** Hard maximum allowed video bitrate (kbps). */
  maxAllowedVideoBitrate: ["maxAllowedVideoBitrate", Infinity],

  /** Maximum allowed segment bitrate (kbps). */
  maxSegmentBitrate: ["maxSegmentBitrate", Infinity],

  /** Minimum allowed VMAF score. */
  minAllowedVmaf: ["minAllowedVmaf", -Infinity],

  /** Maximum allowed VMAF score. */
  maxAllowedVmaf: ["maxAllowedVmaf", Infinity],

  /** Minimum required audio buffer (ms). */
  minRequiredAudioBuffer: ["minRequiredAudioBuffer", 0],

  /** Curve for initial bitrate selection (null = use default logic). */
  initialBitrateSelectionCurve: ["initialBitrateSelectionCurve", null],

  /** Percentage of throughput reserved for audio. */
  throughputPercentForAudio: ["throughputPercentForAudio", 15],

  // ── Bandwidth margin ──────────────────────────────────────────────────

  /** Fixed bandwidth margin (percent) for ABR. */
  bandwidthMargin: ["bandwidthMargin", 0],

  /**
   * Bandwidth margin curve: array of { m: margin%, b: bufferMs } breakpoints.
   * Larger buffers allow smaller margins.
   */
  bandwidthMarginCurve: ["bandwidthMarginCurve", [
    { m: 20, b: 15_000 },
    { m: 17, b: 30_000 },
    { m: 10, b: 60_000 },
    { m: 5,  b: 120_000 },
  ]],

  /** Bandwidth margin curve for audio, using sigmoid parameters. */
  bandwidthMarginCurveAudio: ["bandwidthMarginCurveAudio", {
    min: 0.7135376,
    max: 0.85,
    oH: 76376,
    scale: 18862.4,
    gamma: 3.0569,
  }],

  /** Use continuous (interpolated) bandwidth margin instead of step. */
  bandwidthMarginContinuous: ["bandwidthMarginContinuous", false],

  /** Apply bandwidth margin to audio stream selection. */
  bandwidthMarginForAudio: ["bandwidthMarginForAudio", true],

  /** Switch bandwidth config based on in-session throughput. */
  switchConfigBasedOnInSessionTput: ["switchConfigBasedOnInSessionTput", true],

  // ── Conservative bandwidth margin ─────────────────────────────────────

  /** Conservative bandwidth margin (percent). */
  conservBandwidthMargin: ["conservBandwidthMargin", 20],

  /** Throughput threshold (kbps) below which conservative margin applies. */
  conservBandwidthMarginTputThreshold: ["conservBandwidthMarginTputThreshold", 6000],

  /** Conservative bandwidth margin curve. */
  conservBandwidthMarginCurve: ["conservBandwidthMarginCurve", [
    { m: 25, b: 15_000 },
    { m: 20, b: 30_000 },
    { m: 15, b: 60_000 },
    { m: 10, b: 120_000 },
    { m: 5,  b: 240_000 },
  ]],

  // ── Bandwidth manifold ────────────────────────────────────────────────

  /**
   * Multi-dimensional bandwidth margin using sigmoid curves, IQR-based
   * network quality, and throughput filtering.
   */
  bandwidthManifold: ["bandwidthManifold", {
    curves: [
      { min: 0.05, max: 0.82, oH: 70_000, scale: 178_000, gamma: 1.16 },
      { min: 0, max: 0.03, oH: 150_000, scale: 160_000, gamma: 3.7 },
    ],
    threshold: 14778,
    gamma: 2.1,
    niqrcurve: {
      min: 1,
      max: 1,
      center: 2,
      scale: 2,
      gamma: 1,
    },
    filter: "throughput-sw",
    niqrfilter: "throughput-iqr",
    simpleScaling: true,
  }],

  // ── Starting VMAF ─────────────────────────────────────────────────────

  /** Maximum starting video VMAF score. */
  maxStartingVideoVMAF: ["maxStartingVideoVMAF", 110],

  /** Minimum starting video VMAF score. */
  minStartingVideoVMAF: ["minStartingVideoVMAF", 1],

  /** Activate VMAF-based starting quality selection. */
  activateSelectStartingVMAF: ["activateSelectStartingVMAF", false],

  /** T-Digest percentile index for starting VMAF selection (-1 = disabled). */
  selectStartingVMAFTDigest: ["selectStartingVMAFTDigest", -1],

  /** Method for selecting starting VMAF: "fallback" or "curve". */
  selectStartingVMAFMethod: ["selectStartingVMAFMethod", "fallback"],

  /** Curve parameters for starting VMAF selection method. */
  selectStartingVMAFMethodCurve: ["selectStartingVMAFMethodCurve", {
    log_p50: [6.0537, -0.8612],
    log_p40: [5.41, -0.7576],
    log_p20: [4.22, -0.867],
    sigmoid_1: [11.0925, -8.0793],
  }],

  // ── Rebuffering ───────────────────────────────────────────────────────

  /** Scaling factor for rebuffer penalty in ABR calculations. */
  rebufferingFactor: ["rebufferingFactor", 1],

  /** Duration (ms) over which rebuffer risk is evaluated. */
  rebufferCheckDuration: ["rebufferCheckDuration", 60_000],

  /** Use the maximum prebuffer size for initial buffering. */
  useMaxPrebufSize: ["useMaxPrebufSize", true],

  // ── Low throughput handling ────────────────────────────────────────────

  /** Throughput (kbps) below which the session is considered low-throughput. */
  lowThroughputThreshold: ["lowThroughputThreshold", 400],

  /** Exclude sessions without history from low-throughput classification. */
  excludeSessionWithoutHistoryFromLowThroughputThreshold: [
    "excludeSessionWithoutHistoryFromLowThroughputThreshold", false
  ],

  // ── Long connect time penalty ─────────────────────────────────────────

  /** Penalize streams with long TCP connect times. */
  enablePenaltyForLongConnectTime: ["enablePenaltyForLongConnectTime", false],

  /** Penalty multiplier applied for long connect times. */
  penaltyFactorForLongConnectTime: ["penaltyFactorForLongConnectTime", 2],

  /** Threshold (ms) defining a "long" connect time. */
  longConnectTimeThreshold: ["longConnectTimeThreshold", 200],

  /** Extra buffering (ms) added when connect time is long. */
  additionalBufferingLongConnectTime: ["additionalBufferingLongConnectTime", 2000],

  /** Extra buffering (ms) added per prior failure. */
  additionalBufferingPerFailure: ["additionalBufferingPerFailure", 8000],

  /** Maximum total buffering time (ms). */
  maxBufferingTime: ["maxBufferingTime", 2000],

  // ── Throughput prediction ─────────────────────────────────────────────

  /** Upper bound multiplier for throughput prediction. */
  upperThroughputPredictionFactor: ["upperThroughputPredictionFactor", 1.6],

  /** Media playback rate multiplier for ABR calculations. */
  mediaRate: ["mediaRate", 1.5],

  /** Duration (ms) at each bitrate in round-robin mode. */
  timeAtEachBitrateRoundRobin: ["timeAtEachBitrateRoundRobin", 10_000],

  /** Direction for round-robin: "forward" or "reverse". */
  roundRobinDirection: ["roundRobinDirection", "forward"],

  /** Margin predictor algorithm: "simple", "stddev", etc. */
  marginPredictor: ["marginPredictor", "simple"],

  // ── VMAF estimation ───────────────────────────────────────────────────

  /** Estimate VMAF from bitrate when per-fragment VMAF is unavailable. */
  enableVmafEstimationFromBitrate: ["enableVmafEstimationFromBitrate", false],

  /** Maximum bitrate (kbps) for VMAF-from-bitrate mapping. */
  maxVMAFMappingBitrate: ["maxVMAFMappingBitrate", 16_000],

  /** Maximum VMAF score for VMAF-from-bitrate mapping. */
  maxVMAFMappingVMAF: ["maxVMAFMappingVMAF", 110],

  // ── Audio ABR ─────────────────────────────────────────────────────────

  /** Bandwidth factor applied to audio stream selection. */
  audioBwFactor: ["audioBwFactor", 1],

  /** Audio switch configuration for VOD playback. */
  audioSwitchConfig: ["audioSwitchConfig", {
    upSwitchFactor: 5.02,
    downSwitchFactor: 3.76,
    lowestBufForUpswitch: 16_000,
    lockPeriodAfterDownswitch: 16_000,
  }],

  /** Audio switch configuration for live playback. */
  audioSwitchConfigLive: ["audioSwitchConfigLive", {
    upSwitchFactor: 2.5,
    downSwitchFactor: 1.3,
    lowestBufForUpswitch: 6000,
    lockPeriodAfterDownswitch: 30_000,
  }],

  /**
   * Per-profile overrides for switchable audio.
   * Each entry: { profiles: string[], override: Partial<AudioConfig> }.
   */
  switchableAudioProfilesOverride: ["switchableAudioProfilesOverride", [
    {
      profiles: ["ddplus-5.1-dash", "ddplus-5.1hq-dash"],
      override: { maxInitAudioBitrate: 192 },
    },
    {
      profiles: ["ddplus-atmos-dash"],
      override: { minInitAudioBitrate: 448, maxInitAudioBitrate: 448, minAudioBitrate: 448 },
    },
  ]],

  /** Per-profile overrides for audio profiles. */
  audioProfilesOverride: ["audioProfilesOverride", [
    {
      profiles: ["ddplus-5.1-dash", "ddplus-5.1hq-dash"],
      override: { maxInitAudioBitrate: 256, audioBwFactor: 5.02 },
    },
    {
      profiles: ["ddplus-atmos-dash"],
      override: { maxInitAudioBitrate: 448 },
    },
  ]],

  /** Limit audio discount by the maximum audio bitrate. */
  limitAudioDiscountByMaxAudioBitrate: ["limitAudioDiscountByMaxAudioBitrate", false],

  // ── Live slow buffer filling ──────────────────────────────────────────

  /** Enable slow buffer filling for live to reduce bandwidth spikes. */
  liveSlowBufferFilling: ["liveSlowBufferFilling", false],

  /** Minimum bitrate (kbps) allowed during slow buffer filling. */
  liveSlowBufferFillingMinBitrate: ["liveSlowBufferFillingMinBitrate", 1200],

  /** Resync the clock on 404 errors during live playback. */
  liveResyncClockOn404Error: ["liveResyncClockOn404Error", true],

  /** Only update server time when the delta is significant. */
  enableConditionalServerTimeUpdate: ["enableConditionalServerTimeUpdate", true],

  /** Minimum server time delta difference (ms) considered significant. */
  negligibleServerTimeDeltaDifference: ["negligibleServerTimeDeltaDifference", 1000],

  // ── Network measurement ───────────────────────────────────────────────

  /** Granularity for network measurement: "video_location" or "global". */
  networkMeasurementGranularity: ["networkMeasurementGranularity", "video_location"],

  /** Maximum fragments considered fittable during branching. */
  maxFragsForFittableOnBranching: ["maxFragsForFittableOnBranching", 300],

  /** Apply per-profile streaming offsets from the manifest. */
  applyProfileStreamingOffset: ["applyProfileStreamingOffset", true],

  /** Sanitize video frame duration in media data. */
  sanitizeMediaVideoFrameDuration: ["sanitizeMediaVideoFrameDuration", true],

  /** Enable WSSL (Weighted Sliding-window Sample Library) estimation. */
  enableWsslEstimate: ["enableWsslEstimate", false],

  /** Max requests to re-attach when activating a branch. */
  maxRequestsToAttachOnBranchActivation: ["maxRequestsToAttachOnBranchActivation", undefined],

  /** Enable debug traces from the ASE manager. */
  enableManagerDebugTraces: ["enableManagerDebugTraces", false],

  /** Simulate partial blocks in download simulation. */
  simulatePartialBlocks: ["simulatePartialBlocks", true],

  // ── Live initial fetch sizes ──────────────────────────────────────────

  /** Initial fetch size (bytes) for live media requests. */
  liveInitialFetchSizeBytes: ["liveInitialFetchSizeBytes", 1024],

  /** Initial fetch size (bytes) for live text (subtitle) requests. */
  liveTextInitialFetchSizeBytes: ["liveTextInitialFetchSizeBytes", 40],

  /** Initial fetch size (bytes) for live edit requests. */
  liveEditInitialFetchSizeBytes: ["liveEditInitialFetchSizeBytes", 4096],

  // ── Per-fragment VMAF ─────────────────────────────────────────────────

  /** Configuration for per-fragment VMAF processing. */
  perFragmentVMAFConfig: ["perFragmentVMAFConfig", {
    enabled: false,
    earlyManifestProcessing: false,
  }],

  /** Adjust audio timestamps for live streams. */
  liveAdjustAudioTimestamps: ["liveAdjustAudioTimestamps", false],

  /** Log fragment timing details for debugging. */
  debugFragmentTimes: ["debugFragmentTimes", false],

  /** Enable two-part fragment editing for live content. */
  enableTwoPartLiveFragmentEditing: ["enableTwoPartLiveFragmentEditing", true],

  /** Parse additional MP4 boxes from headers. */
  parseAdditionalBoxesMp4Header: ["parseAdditionalBoxesMp4Header", true],

  // ── Request duration caching ──────────────────────────────────────────

  /** Minimum audio media request duration (ms) from cache. */
  minAudioMediaRequestDurationCache: ["minAudioMediaRequestDurationCache", 0],

  /** Minimum video media request duration (ms) from cache. */
  minVideoMediaRequestDurationCache: ["minVideoMediaRequestDurationCache", 0],

  // ── Forced JS requests ────────────────────────────────────────────────

  /** Force media requests through JavaScript (bypass native). */
  enableForcedJsRequests: ["enableForcedJsRequests", false],

  /** Timeout (ms) for detecting missed requests as failures. */
  missedRequestFailureTimeout: ["missedRequestFailureTimeout", 5000],

  /** Mark a request as active upon receiving the first byte. */
  markRequestActiveOnFirstByte: ["markRequestActiveOnFirstByte", false],

  /** Use native DataView methods for binary parsing. */
  useNativeDataViewMethods: ["useNativeDataViewMethods", true],

  // ── Network request retry ─────────────────────────────────────────────

  /** Base delay (ms) before retrying a failed network request. */
  networkRequestRetryDelay: ["networkRequestRetryDelay", 500],

  /** Minimum jitter (ms) added to retry delay. */
  networkRequestRetryMinJitter: ["networkRequestRetryMinJitter", 100],

  /** Maximum jitter (ms) added to retry delay. */
  networkRequestRetryMaxJitter: ["networkRequestRetryMaxJitter", 2000],

  // ── Codec translation ─────────────────────────────────────────────────

  /** Translate VP9 codec strings to draft format. */
  translateToVp9Draft: ["translateToVp9Draft", false],

  /** Reorder TRAK/MVEX boxes in MP4 headers. */
  reorderTrakMvex: ["reorderTrakMvex", false],

  // ── Audio discontinuity ───────────────────────────────────────────────

  /** Number of silent frames to insert at transitions. */
  insertSilentFrames: ["insertSilentFrames", 0],

  /** Force a discontinuity at audio/video transitions. */
  forceDiscontinuityAtTransition: ["forceDiscontinuityAtTransition", true],

  /** Support audio buffer reset on discontinuity (undefined = platform default). */
  supportAudioResetOnDiscontinuity: ["supportAudioResetOnDiscontinuity", undefined],

  /** Support audio easing on discontinuity (undefined = platform default). */
  supportAudioEasingOnDiscontinuity: ["supportAudioEasingOnDiscontinuity", undefined],

  // ── WSSL ──────────────────────────────────────────────────────────────

  /** Maximum WSSL request size in bytes. */
  maxWsslRequestSize: ["maxWsslRequestSize", 131072],

  /** Maximum WSSL request ratio relative to segment size. */
  maxWsslRequestRatio: ["maxWsslRequestRatio", 0.2],

  // ── Live early requests ───────────────────────────────────────────────

  /** Probability of issuing early requests for live segments. */
  liveEarlyRequestProbability: ["liveEarlyRequestProbability", 0],

  /** Default offset (ms, negative = before) for early live requests. */
  liveEarlyRequestDefaultOffsetMs: ["liveEarlyRequestDefaultOffsetMs", -500],

  /** Support IDR mismatch in live streams. */
  supportLiveIdrMismatch: ["supportLiveIdrMismatch", false],

  /** Synthesize IDR mismatch for testing (0 = disabled). */
  synthesizeLiveIdrMismatch: ["synthesizeLiveIdrMismatch", 0],

  // ── Non-pipelined CPR ─────────────────────────────────────────────────

  /** Enable CPR for non-pipelined requests (general). */
  enableCsprNonPipelined: ["enableCsprNonPipelined", false],

  /** Enable CPR for non-pipelined audio requests. */
  enableCprAudioNonPipelined: ["enableCprAudioNonPipelined", false],

  /** Enable CPR for non-pipelined video requests. */
  enableCprVideoNonPipelined: ["enableCprVideoNonPipelined", false],

  // ── Pace rate selection ───────────────────────────────────────────────

  /** Enable logging of pacing rate decisions. */
  enablePaceReportLogging: ["enablePaceReportLogging", false],

  /** Algorithm for pacing rate selection (video): "regression", "default". */
  paceRateSelectorAlgorithm: ["paceRateSelectorAlgorithm", "regression"],

  /** Algorithm for pacing rate selection (audio). */
  paceRateSelectorAlgorithmAudio: ["paceRateSelectorAlgorithmAudio", "default"],

  /** Algorithm for non-pipelined pacing rate selection. */
  paceRateSelectorAlgorithmNonPipelined: ["paceRateSelectorAlgorithmNonPipelined", "default"],

  /** Static pacing rate in kbps (0 = dynamic). */
  staticPacingRateKbps: ["staticPacingRateKbps", 0],

  /** Client pacing parameters for buffer-aware pacing. */
  clientPacingParams: ["clientPacingParams", {
    minRequiredBuffer: 0,
    rateDiscountFactors: [1, 1, 1],
    lowestAllowedRateFactor: 1,
    lowestAllowedFragmentBitrateFactors: [0, 0, 0],
  }],

  /** Interval (ms) between unpaced fragments (0 = no delay). */
  unpacedFragmentInterval: ["unpacedFragmentInterval", 0],

  /**
   * Regression-based pacing coefficients.
   * Entries are matched by player state, network confidence, and buffer level.
   */
  regressionAlgoPacingCoefficients: ["regressionAlgoPacingCoefficients", [
    {
      playerStates: [0, 1, 2],
      networkConfidence: [],
      bufferLevelPct: 0,
      coefficients: { offset: 0 },
    },
    {
      playerStates: [],
      networkConfidence: [0, 1, 2],
      bufferLevelPct: 0,
      coefficients: { offset: 0 },
    },
    {
      playerStates: [],
      networkConfidence: [],
      bufferLevelPct: 0,
      coefficients: { maxAverageBitrate: 6.4 },
    },
    {
      playerStates: [],
      networkConfidence: [],
      bufferLevelPct: 1,
      coefficients: { maxAverageBitrate: 2.8 },
    },
  ]],

  /** Multiplier for target buffer level standard deviation. */
  targetBufferLevelStddevMultiplier: ["targetBufferLevelStddevMultiplier", 1],

  /** Duration (ms) for target buffer level calculation. */
  targetBufferLevelDurationMs: ["targetBufferLevelDurationMs", 0],

  /** Strategy for pacing target buffer: "capacityPercentage", etc. */
  pacingTargetBufferStrategy: ["pacingTargetBufferStrategy", "capacityPercentage"],

  /** Minimum target buffer level (ms). */
  minTargetBufferLevelMs: ["minTargetBufferLevelMs", 270_000],

  /** Require minimum network confidence before making ABR decisions. */
  needMinimumNetworkConfidence: ["needMinimumNetworkConfidence", true],

  /** Bias toward historical throughput in ABR decisions. */
  biasTowardHistoricalThroughput: ["biasTowardHistoricalThroughput", false],

  // ── Live DVR ──────────────────────────────────────────────────────────

  /** Threshold (ms) for switching between live and DVR modes. */
  liveDvrSwitchThresholdms: ["liveDvrSwitchThresholdms", 10_000],

  // ── Server probing ────────────────────────────────────────────────────

  /** Probe the server when an error occurs. */
  probeServerWhenError: ["probeServerWhenError", false],

  /** Probe before switching back to a primary CDN location. */
  probeBeforeSwitchingBackToPrimary: ["probeBeforeSwitchingBackToPrimary", true],

  /** Minimum interval (ms) before switching back to primary. */
  minIntervalForSwitchingBackToPrimary: ["minIntervalForSwitchingBackToPrimary", 60_000],

  /** Maximum interval (ms) for switching back to primary. */
  maxIntervalForSwitchingBackToPrimary: ["maxIntervalForSwitchingBackToPrimary", 960_000],

  // ── Throughput history ────────────────────────────────────────────────

  /** Use initial throughput history from previous sessions. */
  enableInitialThroughputHistory: ["enableInitialThroughputHistory", true],

  /** Persist location failures across sessions. */
  locationSelectorPersistFailures: ["locationSelectorPersistFailures", true],

  /** Interval (ms) for updating location statistics. */
  locationStatisticsUpdateInterval: ["locationStatisticsUpdateInterval", 60_000],

  /** Treat HTTPS connect errors as permanent failures. */
  httpsConnectErrorAsPerm: ["httpsConnectErrorAsPerm", false],

  // ── Network failure handling ──────────────────────────────────────────

  /** Threshold (ms) for classifying a network failure as throttled. */
  throttledNetworkFailureThresholdMs: ["throttledNetworkFailureThresholdMs", 2000],

  /** Max throttled failures before triggering location switch. */
  maxThrottledNetworkFailures: ["maxThrottledNetworkFailures", 5],

  /** Wait (ms) before resetting network failure counters. */
  networkFailureResetWaitMs: ["networkFailureResetWaitMs", 2000],

  /** Maximum buffering time (ms) allowed with network errors. */
  maxBufferingTimeAllowedWithNetworkError: ["maxBufferingTimeAllowedWithNetworkError", 60_000],

  /** Replicate error director behavior during initial buffering. */
  replicateErrorDirectorInitialBuffering: ["replicateErrorDirectorInitialBuffering", true],

  /** Time (ms) after which to abandon a request due to network failure. */
  networkFailureAbandonMs: ["networkFailureAbandonMs", 60_000],

  /** Allow switching back to a previously failed location. */
  allowSwitchback: ["allowSwitchback", true],

  /** Maximum delay (ms) before reporting a failure. */
  maxDelayToReportFailure: ["maxDelayToReportFailure", 300],

  // ── Probe configuration ───────────────────────────────────────────────

  /** Timeout (ms) for probe requests. */
  probeRequestTimeoutMilliseconds: ["probeRequestTimeoutMilliseconds", 30_000],

  /** Connect timeout (ms) for probe requests. */
  probeRequestConnectTimeoutMilliseconds: ["probeRequestConnectTimeoutMilliseconds", 8000],

  /** Denominator for probe detail reporting (1 in N sessions). */
  probeDetailDenominator: ["probeDetailDenominator", 100],

  /** Minimum interval (ms) between probes. */
  minProbeIntervalMs: ["minProbeIntervalMs", 2000],

  // ── Concurrency ───────────────────────────────────────────────────────

  /** Minimum concurrency window (ms) for streamable content. */
  minStreamableConcurrencyWindow: ["minStreamableConcurrencyWindow", 3000],

  /** Maximum concurrency window (ms) for streamable content. */
  maxStreamableConcurrencyWindow: ["maxStreamableConcurrencyWindow", Infinity],

  /** Factor controlling streamable concurrency scaling. */
  streamableConcurrencyFactor: ["streamableConcurrencyFactor", 0.3],

  /** Concurrency window (ms) during buffering state. */
  bufferingConcurrencyWindow: ["bufferingConcurrencyWindow", 7800],

  /** Half-life (ms) for rebuffer risk decay. */
  rebufferRiskHalfLife: ["rebufferRiskHalfLife", 10_000],

  /** Allow discontiguous buffering (gaps in buffer). */
  enableDiscontiguousBuffering: ["enableDiscontiguousBuffering", false],

  /** Maximum outstanding concurrent requests. */
  maxAllowedOutstandingRequests: ["maxAllowedOutstandingRequests", 4],

  // ── Live request spreading ────────────────────────────────────────────

  /** Spread (ms) for staggering live requests across clients. */
  liveRequestSpreadMs: ["liveRequestSpreadMs", 0],

  /** Extra cushion (ms) at live edge when request spreading is used. */
  liveEdgeCushionWithSpreadMs: ["liveEdgeCushionWithSpreadMs", 0],

  /** Handle HTTP 504 errors specifically for live. */
  enableLive504Handling: ["enableLive504Handling", false],

  // ── Switchable audio ──────────────────────────────────────────────────

  /** List of audio profile names that support mid-stream switching. */
  switchableAudioProfiles: ["switchableAudioProfiles", []],

  // ── Rebuffering limits ────────────────────────────────────────────────

  /** Maximum rebuffer size (kbps, Infinity = unlimited). */
  maxRebufSize: ["maxRebufSize", Infinity],

  /** Time limit (ms) for prebuffering. */
  prebufferTimeLimit: ["prebufferTimeLimit", 60_000],

  // ── Buffer target sizes ───────────────────────────────────────────────

  /** Target available audio buffer size (bytes). */
  audioBufferTargetAvailableSize: ["audioBufferTargetAvailableSize", 262144],

  /** Target available video buffer size (bytes). */
  videoBufferTargetAvailableSize: ["videoBufferTargetAvailableSize", 1048576],

  // ── Joint stream / graph selection ────────────────────────────────────

  /** Allow graph selector to set audio playback rate. */
  graphSelectorSetAudioRate: ["graphSelectorSetAudioRate", false],

  /** Algorithm for joint stream creation: "optimized" or "simple". */
  jointStreamCreationAlgorithm: ["jointStreamCreationAlgorithm", "optimized"],

  /** Minimum interval (ms) between buffering-complete checks. */
  minimumBufferingCompleteInterval: ["minimumBufferingCompleteInterval", 10_000],

  /** Declare buffering complete when hitting memory limit. */
  bufferingCompleteOnMemoryLimit: ["bufferingCompleteOnMemoryLimit", false],

  /** Maximum fast-play buffer duration (ms). */
  maxFastPlayBufferInMs: ["maxFastPlayBufferInMs", 20_000],

  /** Maximum buffer (ms) beyond which buffering is declared complete. */
  maxBufferingCompleteBufferInMs: ["maxBufferingCompleteBufferInMs", Infinity],

  // ── Playgraph ─────────────────────────────────────────────────────────

  /** Default weight assigned to a playgraph. */
  playgraphDefaultWeight: ["playgraphDefaultWeight", 65520],

  /** Minimum probability for a downstream branch to be kept. */
  minimumDownstreamBranchProbability: ["minimumDownstreamBranchProbability", 0.075],

  /** Enable combined playgraph mode. */
  enableCombinedPlaygraphs: ["enableCombinedPlaygraphs", true],

  /** Enable ad-specific playgraphs. */
  enableAdPlaygraphs: ["enableAdPlaygraphs", true],

  /** Enable ad playgraphs for live streams. */
  enableLiveAdPlaygraphs: ["enableLiveAdPlaygraphs", true],

  /** Enable program-level playgraphs for live. */
  enableLiveProgramPlaygraphs: ["enableLiveProgramPlaygraphs", false],

  /** Enable program playgraphs for linear live content. */
  enableLiveProgramPlaygraphsForLinear: ["enableLiveProgramPlaygraphsForLinear", true],

  // ── Branching ─────────────────────────────────────────────────────────

  /** Threshold (ms) for creating a new branch. */
  branchCreationThreshold: ["branchCreationThreshold", 120_000],

  /** Minimum distance (ms) between branches. */
  branchDistanceThreshold: ["branchDistanceThreshold", 60_000],

  /** Enable default branch offset. */
  defaultBranchOffsetEnabled: ["defaultBranchOffsetEnabled", true],

  /** Default branch offset (ms) from content start. */
  defaultBranchOffsetMs: ["defaultBranchOffsetMs", 10_000],

  /** Minimum content start timestamp (ms) for branch offset to apply. */
  minimumContentStartTimestampForBranchOffsetMs: [
    "minimumContentStartTimestampForBranchOffsetMs", 86_400_000
  ],

  /** Wait for DRM before appending headers when mixing clear+encrypted. */
  waitForDrmToAppendHeadersWhenClearAndEncryptedContent: [
    "waitForDrmToAppendHeadersWhenClearAndEncryptedContent", false
  ],

  /** Max total buffer level (ms) per session (0 = unlimited). */
  maxTotalBufferLevelPerSession: ["maxTotalBufferLevelPerSession", 0],

  /** Allow parallel streaming of multiple content pieces. */
  allowParallelStreaming: ["allowParallelStreaming", true],

  // ── Header caching ────────────────────────────────────────────────────

  /** Default number of headers to cache. */
  defaultHeaderCacheSize: ["defaultHeaderCacheSize", 4],

  /** Prefetch interval (ms) for header cache data (0 = disabled). */
  defaultHeaderCacheDataPrefetchMs: ["defaultHeaderCacheDataPrefetchMs", 0],

  /** Keep the wish list when a cached entry expires. */
  keepWishListOnExpiration: ["keepWishListOnExpiration", true],

  /** Number of reuse-on-error cache slots. */
  reuseOnErrorCacheSize: ["reuseOnErrorCacheSize", 1],

  /** Enable dormant manifest cache. */
  manifestCacheDormantCacheEnabled: ["manifestCacheDormantCacheEnabled", true],

  /** Enable reuse-on-error in manifest cache. */
  manifestCacheReuseOnErrorEnabled: ["manifestCacheReuseOnErrorEnabled", true],

  // ── Prefetching ───────────────────────────────────────────────────────

  /** Enable prefetching for live content. */
  livePrefetchEnabled: ["livePrefetchEnabled", false],

  /** Enable prefetching for sticky-steered live content. */
  livePrefetchEnabledForStickySteering: ["livePrefetchEnabledForStickySteering", true],

  /** Weight budget allocated to prefetch requests. */
  prefetchWeightBudget: ["prefetchWeightBudget", 32],

  /** Allow prefetching during playback (not just during idle). */
  prefetchWhilePlaying: ["prefetchWhilePlaying", true],

  /** Soft-reset prefetcher on stream change. */
  prefetcherSoftReset: ["prefetcherSoftReset", true],

  /** Byte budget for prefetch requests (0 = use weight-based). */
  prefetchBudgetInBytes: ["prefetchBudgetInBytes", 0],

  // ── Pipeline health ───────────────────────────────────────────────────

  /** Buffer level (ms) below which pipeline health is critical. */
  pipelineHealthThresholdCriticalMs: ["pipelineHealthThresholdCriticalMs", 2000],

  /** Buffer level (ms) below which pipeline health is low. */
  pipelineHealthThresholdLowMs: ["pipelineHealthThresholdLowMs", 6000],

  // ── Request abandonment ───────────────────────────────────────────────

  /** Enable abandoning slow requests in favor of new ones. */
  enableRequestAbandonment: ["enableRequestAbandonment", false],

  /** Lock interval (ms) after abandoning a request. */
  requestAbandonmentLockIntervalMs: ["requestAbandonmentLockIntervalMs", 10_000],

  // ── Stream mode ───────────────────────────────────────────────────────

  /** Threshold for attaching in stream mode appending. */
  streamModeAppendAttachThreshold: ["streamModeAppendAttachThreshold", 0.75],

  // ── Download tracks ───────────────────────────────────────────────────

  /** Share download tracks between audio and video. */
  shareDownloadTracks: ["shareDownloadTracks", true],

  /** Share open-range download tracks. */
  shareOpenRangeTracks: ["shareOpenRangeTracks", false],

  /** Use pipeline for audio downloads. */
  usePipelineForAudio: ["usePipelineForAudio", false],

  /** Use pipeline detection for audio. */
  usePipelineDetectionForAudio: ["usePipelineDetectionForAudio", false],

  /** Use pipeline for branched audio content. */
  usePipelineForBranchedAudio: ["usePipelineForBranchedAudio", true],

  /** Use pipeline for text (subtitle) downloads. */
  usePipelineForText: ["usePipelineForText", true],

  // ── Parallel connections ──────────────────────────────────────────────

  /** Maximum number of parallel TCP connections. */
  maxParallelConnections: ["maxParallelConnections", 3],

  /** Max active requests per session (undefined = use platform default). */
  maxActiveRequestsPerSession: ["maxActiveRequestsPerSession", undefined],

  /** Minimum request size in bytes. */
  minRequestSize: ["minRequestSize", 65536],

  // ── Socket receive buffer sizes ───────────────────────────────────────

  /** Default socket receive buffer size (0 = OS default). */
  socketReceiveBufferSize: ["socketReceiveBufferSize", 0],

  /** Socket receive buffer size for audio. */
  audioSocketReceiveBufferSize: ["audioSocketReceiveBufferSize", 32768],

  /** Socket receive buffer size for video. */
  videoSocketReceiveBufferSize: ["videoSocketReceiveBufferSize", 65536],

  /** Socket receive buffer size for text. */
  textSocketReceiveBufferSize: ["textSocketReceiveBufferSize", 32768],

  /** Use pipeline detection for video. */
  usePipelineDetectionForVideo: ["usePipelineDetectionForVideo", false],

  /** Minimum video socket receive buffer size. */
  minVideoSocketReceiveBufferSize: ["minVideoSocketReceiveBufferSize", 65536],

  /** Socket receive buffer size for header downloads. */
  headersSocketReceiveBufferSize: ["headersSocketReceiveBufferSize", 32768],

  /** Disable dedicated header download tracks. */
  disableHeaderDownloadTracks: ["disableHeaderDownloadTracks", false],

  // ── Stream filtering ──────────────────────────────────────────────────

  /** Rules for filtering available streams by profile. */
  streamFilteringRules: ["streamFilteringRules", {
    enabled: false,
    profiles: ["playready-h264mpl40-dash"],
    action: "keepLowest",
  }],

  /** Ignore user filters when they would result in an empty stream set. */
  ignoreUserFilterOnEmptyResult: ["ignoreUserFilterOnEmptyResult", true],

  /** Enable resolution-VMAF-based stream filtering. */
  enableResolutionVMAFStreamFilter: ["enableResolutionVMAFStreamFilter", false],

  /** Percentage of titles to apply resolution-VMAF capping to. */
  percentCapTitlesForResolutionVMAFStreamFilter: [
    "percentCapTitlesForResolutionVMAFStreamFilter", 100
  ],

  /** List of resolution-VMAF capping rules. */
  resolutionVMAFCappingRuleList: ["resolutionVMAFCappingRuleList", []],

  // ── Live bitrate cap ──────────────────────────────────────────────────

  /** Use dynamic bitrate capping for live streams. */
  useLiveBitrateDynamicCap: ["useLiveBitrateDynamicCap", true],

  /** Use probabilistic dynamic bitrate capping for live. */
  useProbabilisticLiveBitrateDynamicCap: ["useProbabilisticLiveBitrateDynamicCap", false],

  /** Use dynamic bitrate capping for DAI live. */
  useLiveBitrateDynamicCapForDai: ["useLiveBitrateDynamicCapForDai", true],

  // ── ASE diagnostics ───────────────────────────────────────────────────

  /**
   * Diagnostic trace/audit configurations.
   * Each entry: { ic: identifier, qcEnabled: boolean }.
   */
  aseDiagnostics: ["aseDiagnostics", [
    { ic: "queue-audit", qcEnabled: true },
    { ic: "task-audit", qcEnabled: true },
    { ic: "trace-ShimSession", qcEnabled: true },
    { ic: "trace-engine", qcEnabled: true },
    { ic: "trace-RequestPacer", qcEnabled: true },
    { ic: "trace-BufferStateTracker", qcEnabled: true },
    { ic: "trace-GraphStreamingProcess", qcEnabled: true },
    { ic: "trace-AsePlaygraph", qcEnabled: true },
    { ic: "playgraph-branch-audit", qcEnabled: true },
    { ic: "content-playgraph", qcEnabled: true },
    { ic: "trace-CphAsePlaygraph", qcEnabled: true },
    { ic: "trace-GraphLocation", qcEnabled: true },
    { ic: "cache-ads::gls", qcEnabled: true },
    { ic: "cache-content::gls", qcEnabled: true },
    { ic: "trace-LiveOCSideChannel", qcEnabled: true },
    { ic: "trace-media-events-provider", qcEnabled: true },
    { ic: "trace-Prefetcher", qcEnabled: true },
    { ic: "trace-AdBreakHydrator", qcEnabled: true },
  ]],

  /** Enable ASE reporting pipeline. */
  enableAseReporting: ["enableAseReporting", true],

  // ── Memory deadlock detection ─────────────────────────────────────────

  /** Check memory usage to detect deadlocks. */
  memDeadlockShouldCheckMemory: ["memDeadlockShouldCheckMemory", true],

  /** Memory overage threshold (fraction) triggering deadlock detection. */
  memDeadlockOverageThreshold: ["memDeadlockOverageThreshold", 0.9],

  /** Maximum memory utilization (fraction) before deadlock logic activates. */
  memDeadlockMaxUtilizationPercentage: ["memDeadlockMaxUtilizationPercentage", 0.5],

  /** Enable LRU caches for ad content. */
  enableAdLruCaches: ["enableAdLruCaches", false],

  // ── Padding ───────────────────────────────────────────────────────────

  /** Media type string used for padding segments. */
  paddingMediaType: ["paddingMediaType", "padding"],

  /** Duration (ms) of padding segments. */
  paddingDurationMs: ["paddingDurationMs", 1000],

  /** Max allowed mismatch (ms) for live DAI replaced content. */
  maxLiveDAIReplacedMismatchDurationMs: ["maxLiveDAIReplacedMismatchDurationMs", 2100],

  // ── Ad handling ───────────────────────────────────────────────────────

  /** Enable preroll for initial seek operations. */
  enablePrerollForInitialSeek: ["enablePrerollForInitialSeek", false],

  /** Rehydrate ad breaks that were skipped. */
  rehydrateSkippableAdBreaks: ["rehydrateSkippableAdBreaks", true],

  /** Expose information about dropped ads to the UI. */
  exposeDroppedAdsToUI: ["exposeDroppedAdsToUI", false],

  /** Wait time (ms) between ad break hydrations. */
  hydrateWaitTimeBetweenAdBreaksMs: ["hydrateWaitTimeBetweenAdBreaksMs", 5000],

  /** Max player distance (ms) from ad break before hydration starts. */
  maxPlayerDistancePriorToAdBreakHydrationMs: [
    "maxPlayerDistancePriorToAdBreakHydrationMs", 60_000
  ],

  /** Content playgraph IDs excluded from processing. */
  excludedContentPlaygraphIds: ["excludedContentPlaygraphIds", []],

  // ── ASE garbage collection ────────────────────────────────────────────

  /** GC settings for ASE resources. */
  aseGcSettings: ["aseGcSettings", {
    segmentPresenting: true,
    branchPruned: true,
  }],

  // ── Seamless audio ────────────────────────────────────────────────────

  /** Enable seamless audio transitions. */
  seamlessAudio: ["seamlessAudio", false],

  // ── Appending ─────────────────────────────────────────────────────────

  /** Append the first header only after download is complete. */
  appendFirstHeaderOnComplete: ["appendFirstHeaderOnComplete", true],

  /** Wait for DRM initialization before appending media data. */
  waitForDrmToAppendMedia: ["waitForDrmToAppendMedia", false],

  /** Enable just-in-time media appending. */
  enableJustInTimeAppends: ["enableJustInTimeAppends", false],

  /** Enable asynchronous media appending. */
  enableAsyncAppend: ["enableAsyncAppend", false],

  /** Time (ms) before end-of-stream to set the buffer mark. */
  timeBeforeEndOfStreamBufferMark: ["timeBeforeEndOfStreamBufferMark", 6000],

  /** Delay notification of end-of-stream. */
  delayNotificationOfEoS: ["delayNotificationOfEoS", false],

  // ── Audio processing ──────────────────────────────────────────────────

  /** Minimum PTS gap (ms) for audio (undefined = auto). */
  minAudioPtsGap: ["minAudioPtsGap", undefined],

  /** Minimum audio frames required per fragment. */
  minimumAudioFramesPerFragment: ["minimumAudioFramesPerFragment", 1],

  /** Require audio stream to fully encompass the video duration. */
  requireAudioStreamToEncompassVideo: ["requireAudioStreamToEncompassVideo", false],

  /** Whether the platform's MediaSource supports negative PTS values. */
  mediaSourceSupportsNegativePts: ["mediaSourceSupportsNegativePts", false],

  /** Truncate audio at end of stream to match video. */
  truncateEndOfStreamAudio: ["truncateEndOfStreamAudio", false],

  /** Insert silent frames on seek. */
  insertSilentFramesOnSeek: ["insertSilentFramesOnSeek", false],

  /** List of title IDs where silent-frame insertion on seek is enabled. */
  insertSilentFramesOnSeekForTitles: ["insertSilentFramesOnSeekForTitles", []],

  /** Maximum sync error (ms) for seamless audio (undefined = auto). */
  seamlessAudioMaximumSyncError: ["seamlessAudioMaximumSyncError", undefined],

  /** Minimum sync error (ms) for seamless audio (undefined = auto). */
  seamlessAudioMinimumSyncError: ["seamlessAudioMinimumSyncError", undefined],

  /** Audio profiles that use non-sync samples (e.g. xHE-AAC). */
  audioProfilesNonSyncSamples: ["audioProfilesNonSyncSamples", ["xheaac-dash"]],

  /** Apply per-profile timestamp offsets to audio. */
  applyProfileTimestampOffset: ["applyProfileTimestampOffset", false],

  /** Use DPI-assumed AAC encoder delay. */
  useDpiAssumedAacEncoderDelay: ["useDpiAssumedAacEncoderDelay", true],

  /** Number of silent frames to insert on seek. */
  insertSilentFramesOnSeekCount: ["insertSilentFramesOnSeekCount", 3],

  // ── Segment fading ────────────────────────────────────────────────────

  /** Fade-in duration (ms) for segments (-1 = use segmentFadeDuration). */
  segmentFadeInDuration: ["segmentFadeInDuration", -1],

  /** Fade-out duration (ms) for segments (-1 = use segmentFadeDuration). */
  segmentFadeOutDuration: ["segmentFadeOutDuration", -1],

  /**
   * Maximum fade durations (dB) per audio profile.
   * Negative values indicate attenuation.
   */
  maximumFade: ["maximumFade", {
    "heaac-2-dash": -44,
    "heaac-2hq-dash": -44,
    "ddplus-5.1hq-dash": -44,
    "ddplus-5.1-dash": -44,
  }],

  /** Retain SBR (Spectral Band Replication) data during fades. */
  retainSbrOnFade: ["retainSbrOnFade", false],

  /** Insert a silent frame when starting/ending a fade. */
  insertSilentFrameOnFade: ["insertSilentFrameOnFade", true],

  /** Force appending headers after DRM initialization. */
  forceAppendHeadersAfterDrm: ["forceAppendHeadersAfterDrm", false],

  /** Append pacing factor (0 = no pacing). */
  appendPacingFactor: ["appendPacingFactor", 0],

  /** Threshold (ms) for append pacing to activate. */
  appendPacingThreshold: ["appendPacingThreshold", 3000],

  // ── Live request logging ──────────────────────────────────────────────

  /** Enable detailed live request logging. */
  enableLiveRequestLogger: ["enableLiveRequestLogger", false],

  /** Enable CDN download distribution tracking. */
  cdndldistEnabled: ["cdndldistEnabled", false],

  /** PTS padding (ms) added to player timestamps. */
  playerPtsPadding: ["playerPtsPadding", 1],

  // ── Session history ───────────────────────────────────────────────────

  /** Minimum number of session history entries for stable ABR. */
  minNumSessionHistory: ["minNumSessionHistory", 5],

  /** Thresholds for classifying bandwidth as "high and stable". */
  baselineHighAndStableThreshold: ["baselineHighAndStableThreshold", {
    bwThreshold: 20_000,
    nethreshold: 0.15,
  }],

  // ── Live quality avoidance ────────────────────────────────────────────

  /** Avoid low quality during live playback. */
  liveLowQualityAvoidance: ["liveLowQualityAvoidance", true],

  /** Bitrate threshold (kbps) for "low quality" classification. */
  liveLowQualityThreshold: ["liveLowQualityThreshold", 850],

  /** Multiplier applied during low-quality avoidance. */
  liveLowQualityMultiplier: ["liveLowQualityMultiplier", 6],

  // ── Live reporting ────────────────────────────────────────────────────

  /** Interval (ms) for sending live reports. */
  liveReportSendIntervalMs: ["liveReportSendIntervalMs", 60_000],

  /** Interval (ms) for collecting live report data. */
  liveReportCollectIntervalMs: ["liveReportCollectIntervalMs", 5000],

  // ── Config manager ────────────────────────────────────────────────────

  /** Use the config manager for runtime config overrides. */
  useConfigManager: ["useConfigManager", true],

  /**
   * Allow list for global config mutations from the manifest.
   * Maps short keys to full config property names.
   */
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

  // ── Short response filtering ──────────────────────────────────────────

  /** Ignore very short responses in throughput estimation. */
  ignoreShortResponses: ["ignoreShortResponses", true],

  /** Duration (ms) below which a response is "short". */
  shortResponseDurationMs: ["shortResponseDurationMs", 10],

  /** Bytes below which a response is "short". */
  shortResponseBytes: ["shortResponseBytes", 10_000],

  /** Expand download time to account for TCP effects. */
  expandDownloadTime: ["expandDownloadTime", true],

  /** Minimum response duration (ms) for measurements. */
  minimumResponseDurationMs: ["minimumResponseDurationMs", 10],

  /** Minimum time (ms) for a valid throughput measurement. */
  minimumMeasurementTime: ["minimumMeasurementTime", 500],

  /** Minimum bytes for a valid throughput measurement. */
  minimumMeasurementBytes: ["minimumMeasurementBytes", 131072],

  /** Time (ms) for probing-phase measurements. */
  probingMeasurementTime: ["probingMeasurementTime", 2000],

  /** Bytes for probing-phase measurements. */
  probingMeasurementBytes: ["probingMeasurementBytes", 262144],

  // ── Network confidence ────────────────────────────────────────────────

  /** Stop updating network confidence after convergence. */
  stopNetworkConfidence: ["stopNetworkConfidence", true],

  /** Interval (ms) for updating historic bandwidth estimates. */
  historicBandwidthUpdateInterval: ["historicBandwidthUpdateInterval", 2000],

  /** Stop measurement when all requests are inactive. */
  stopOnAllInactiveRequests: ["stopOnAllInactiveRequests", false],

  /** Include active requests in throughput filters. */
  enableActiveRequestsInFilters: ["enableActiveRequestsInFilters", true],

  /** Reset active request counters at session initialization. */
  resetActiveRequestsAtSessionInit: ["resetActiveRequestsAtSessionInit", true],

  /** Enable throughput trace data for research. */
  enableThroughputTraceResearchData: ["enableThroughputTraceResearchData", false],

  /** Parameters for throughput trace collection. */
  throughputTraceParam: ["throughputTraceParam", {
    numB: 3600,
    bSizeMs: 2000,
    fillS: "last",
    fillHl: 1000,
  }],

  // ── Throughput filters ────────────────────────────────────────────────

  /** Aggregation method for WSSL: "max" or "average". */
  wsslAggregationMethod: ["wsslAggregationMethod", "max"],

  /** Second throughput estimator type. */
  secondThroughputEstimator: ["secondThroughputEstimator", "slidingwindow"],

  /** Default throughput filter name. */
  defaultFilter: ["defaultFilter", "throughput-ewma"],

  /** Default field from the filter output to use. */
  defaultFilterField: ["defaultFilterField", "average"],

  /** Secondary throughput filter name. */
  secondaryFilter: ["secondaryFilter", "throughput-sw"],

  /** Start monitoring throughput on load start event. */
  startMonitorOnLoadStart: ["startMonitorOnLoadStart", false],

  /** List of throughput filters to enable. */
  enableFilters: ["enableFilters", [
    "throughput-ewma",
    "initial-throughput-ewma",
    "throughput-sw",
    "throughput-sw-fast",
    "throughput-iqr",
    "avtp",
    "entropy",
    "deliverytime",
  ]],

  /** Experimental filters (not used in production ABR). */
  experimentalFilter: ["experimentalFilter", ["initial-throughput-ewma"]],

  /** Overrides for specific filter definitions. */
  filterDefinitionOverrides: ["filterDefinitionOverrides", {
    "initial-throughput-ewma": {
      type: "initial-discontiguous-ewma",
      mw: 10_000,
      playerStates: [0, 1],
    },
    "throughput-ewma": {
      mw: 4060.623425,
    },
    "throughput-ewma2": {
      type: "discontiguous-ewma",
      mw: 97831.788213,
    },
  }],

  /**
   * Complete set of default filter definitions.
   * Keys are filter names; values are filter configuration objects.
   */
  defaultFilterDefinitions: ["defaultFilterDefinitions", {
    "throughput-ewma": {
      type: "discontiguous-ewma",
      mw: 4060.623425,
    },
    "throughput-ewma2": {
      type: "discontiguous-ewma",
      mw: 97831.788213,
    },
    "initial-throughput-ewma": {
      type: "initial-discontiguous-ewma",
      mw: 10_000,
      playerStates: [0, 1],
    },
    "throughput-sw": {
      type: "slidingwindow",
      mw: 300_000,
    },
    "throughput-sw-fast": {
      type: "slidingwindow",
      mw: 500,
    },
    "throughput-wssl": {
      type: "wssl",
      mw: 5000,
      max_n: 20,
    },
    "throughput-iqr": {
      type: "iqr",
      mx: 100,
      mn: 5,
      bw: 15_000,
      iv: 1000,
    },
    "throughput-iqr-history": {
      type: "iqr-history",
    },
    "throughput-location-history": {
      type: "discrete-ewma",
      hl: 14400,
    },
    "respconn-location-history": {
      type: "discrete-ewma",
      hl: 100,
    },
    "throughput-tdigest": {
      type: "tdigest",
      maxc: 25,
      c: 0.5,
      b: 1000,
      w: 15_000,
    },
    "throughput-ci": {
      type: "ci",
      max_n: 10,
      maxc: 25,
      c: 0.5,
      lowPercentile: 0.1,
      highPercentile: 0.9,
      initialPercentile: 0.2,
      decay: false,
      halfLife: 5000,
      maxDecay: 1_000_000_000,
    },
    "throughput-tdigest-history": {
      type: "tdigest-history",
      maxc: 25,
      rc: "ewma",
      c: 0.5,
      hl: 7200,
    },
    "respconn-ewma": {
      type: "discrete-ewma",
      hl: 10,
    },
    average: {
      type: "avtp",
    },
    entropy: {
      type: "entropy",
      mw: 2000,
      sw: 60_000,
      mins: 1,
      hdl: [150, 230, 352, 539, 825, 1264, 1936, 2966, 4543, 6958],
      uhdl: [150, 230, 352, 539, 825, 1264, 1936, 2966, 4543, 6958, 10657, 16322, 25000],
    },
    deliverytime: {
      type: "deliverytime",
      hl: 4000,
      max_n: 10,
      min_iv: 500,
      min_b: 16384,
    },
    "deliverytime-ci": {
      type: "deliverytime-ci",
      hl: 4000,
      max_n: 10,
      metric: "deliverytime",
      lowPercentile: 0.1,
      highPercentile: 0.9,
      initialPercentile: 0.2,
      accuracy: 1e-10,
      maxIterations: 20,
      min_iv: 500,
      min_b: 16384,
    },
  }],

  // ── Bandwidth history expiration ──────────────────────────────────────

  /** Expiration time (seconds) for fast historic bandwidth data. */
  fastHistoricBandwidthExpirationTime: ["fastHistoricBandwidthExpirationTime", 10_368_000],

  /** Expiration time (seconds) for bandwidth history. */
  bandwidthExpirationTime: ["bandwidthExpirationTime", 5_184_000],

  /** Expiration time (seconds) for failure records. */
  failureExpirationTime: ["failureExpirationTime", 86400],

  // ── Network interruption ──────────────────────────────────────────────

  /** Minimum duration (ms) for a network interruption to be reported. */
  minReportedNetIntrDuration: ["minReportedNetIntrDuration", 4000],

  /** Window (ms) for storing network interruption history. */
  netIntrStoreWindow: ["netIntrStoreWindow", 36_000],

  /** Minimum duration (ms) for a network interruption to be recorded. */
  minNetIntrDuration: ["minNetIntrDuration", 8000],

  // ── Session history persistence ───────────────────────────────────────

  /** Minimum session history duration (ms) for persistence. */
  minSessionHistoryDuration: ["minSessionHistoryDuration", 300_000],

  /** Maximum session history entries stored. */
  maxNumSessionHistoryStored: ["maxNumSessionHistoryStored", 10],

  // ── Paced request handling ────────────────────────────────────────────

  /** Strategy for ignoring paced requests: "none", "all", "partial". */
  ignorePacedRequestStrategy: ["ignorePacedRequestStrategy", "none"],

  /** Threshold (fraction) for classifying a request as paced. */
  pacedThresholdPct: ["pacedThresholdPct", 0.1],

  /** Factor applied to effective pacing rate. */
  effectivePaceRateFactor: ["effectivePaceRateFactor", 1],

  // ── Standard deviation predictor ──────────────────────────────────────

  /** Multiplier for stddev-based throughput prediction (lower bound). */
  stddevPredictorMultiplier: ["stddevPredictorMultiplier", -0.3],

  /** Multiplier for stddev-based throughput prediction (upper bound). */
  stddevPredictorUpperMultiplier: ["stddevPredictorUpperMultiplier", 2],

  /** Source filter for stddev predictor. */
  stddevPredictorSource: ["stddevPredictorSource", "deliverytime"],

  /** Source filter for confidence interval predictor. */
  ciPredictorSource: ["ciPredictorSource", "throughput-ci"],

  // ── Network monitor ───────────────────────────────────────────────────

  /** Add header download data to the network monitor. */
  addHeaderDataToNetworkMonitor: ["addHeaderDataToNetworkMonitor", true],

  /** Report failed requests to the network monitor. */
  reportFailedRequestsToNetworkMonitor: ["reportFailedRequestsToNetworkMonitor", false],

  /** ASE location history depth (0 = disabled). */
  ase_location_history: ["ase_location_history", 0],

  /** Interval (ms) for periodic history persistence (0 = disabled). */
  periodicHistoryPersistMs: ["periodicHistoryPersistMs", 0],

  /** Enable session trace summary at end of play. */
  enableSessionTraceSummaryEndplay: ["enableSessionTraceSummaryEndplay", false],

  // ── Advanced throughput filters ───────────────────────────────────────

  /** Response time average filter configuration. */
  filterResponseTimeAverage: ["filterResponseTimeAverage", { enabled: false }],

  /** Throughput trend filter configuration. */
  filterThroughputTrend: ["filterThroughputTrend", { enabled: false }],

  /** Throughput coefficient-of-variation filter. */
  filterThroughputCoefficientOfVariation: ["filterThroughputCoefficientOfVariation", {
    enabled: false,
  }],

  /** Throughput switches filter. */
  filterThroughputSwitches: ["filterThroughputSwitches", {
    enabled: false,
    switchThreshold: 0.15,
    minSwitchDuration: 200,
    windowSize: 60_000,
  }],

  /** Low throughput filter. */
  filterLowThroughput: ["filterLowThroughput", {
    enabled: false,
    lowThroughputValue: 3000,
  }],

  /** Throughput bucket percentiles filter. */
  filterThroughputBucketPercentiles: ["filterThroughputBucketPercentiles", {
    enabled: false,
    windowSize: 300_000,
    bucketCount: 30,
    minBucketSize: 25,
    minFillRatio: 0.5,
    percentiles: [0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95],
    includeRaw: true,
  }],

  /** Response time bucket percentiles filter. */
  filterResponseTimeBucketPercentiles: ["filterResponseTimeBucketPercentiles", {
    enabled: false,
    windowSize: 300_000,
    bucketCount: 30,
    minBucketSize: 25,
    minFillRatio: 0.5,
    percentiles: [0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95],
    includeRaw: true,
  }],

  // ── Header requests ───────────────────────────────────────────────────

  /** Default header request size in bytes. */
  headerRequestSize: ["headerRequestSize", 4096],

  /** Estimate header size from manifest data. */
  estimateHeaderSize: ["estimateHeaderSize", true],

  /** Use SIDX info from manifest for header request sizing. */
  useSidxInfoFromManifestForHeaderRequestSize: [
    "useSidxInfoFromManifestForHeaderRequestSize", false
  ],

  /** Header request size for fast-play mode (0 = use default). */
  fastPlayHeaderRequestSize: ["fastPlayHeaderRequestSize", 0],

  /** Minimum time (ms) between header requests (undefined = no limit). */
  minTimeBetweenHeaderRequests: ["minTimeBetweenHeaderRequests", undefined],

  // ── OC side-channel ───────────────────────────────────────────────────

  /** Enable Open Connect side-channel communication. */
  enableOCSideChannel: ["enableOCSideChannel", true],

  /** Minimum interval (ms) between OC side-channel decrypt operations. */
  decryptOCSideChannelMinInterval: ["decryptOCSideChannelMinInterval", 1000],

  /** Min interval (ms) for OC side-channel decrypt after completion. */
  decryptOCSideChannelMinIntervalAfterCompleted: [
    "decryptOCSideChannelMinIntervalAfterCompleted", 1000
  ],

  /** Enable refreshing OC side-channel data for live. */
  enableLiveOCSideChannelRefresh: ["enableLiveOCSideChannelRefresh", true],

  /** Refresh interval (ms) for live OC side-channel. */
  liveOCSideChannelRefreshInterval: ["liveOCSideChannelRefreshInterval", 30_000],

  /** Buffer quantization config for OC side-channel. */
  OCSCBufferQuantizationConfig: ["OCSCBufferQuantizationConfig", {
    lv: 5,
    mx: 240,
  }],

  /** Enable unified side-channel for VOD. */
  enableUnifiedSideChannel: ["enableUnifiedSideChannel", false],

  /** Enable unified side-channel for live. */
  liveEnableUnifiedSideChannel: ["liveEnableUnifiedSideChannel", false],

  /** Enable unified side-channel for SVOD. */
  svodEnableUnifiedSideChannel: ["svodEnableUnifiedSideChannel", false],

  // ── Transitions ───────────────────────────────────────────────────────

  /** Title IDs forced to use immediate transition type. */
  forceImmediateTransitionTypeForTitles: ["forceImmediateTransitionTypeForTitles", []],

  /** Exit zone (ms) for forced immediate transitions. */
  forceImmediateTransitionExitZone: ["forceImmediateTransitionExitZone", 0],

  /** Max active requests for SAB Cell 100. */
  maxActiveRequestsSABCell100: ["maxActiveRequestsSABCell100", 2],

  // ── Content overrides ─────────────────────────────────────────────────

  /** Per-content configuration overrides (undefined = none). */
  contentOverrides: ["contentOverrides", undefined],

  /** Per-content-profile configuration overrides (undefined = none). */
  contentProfileOverrides: ["contentProfileOverrides", undefined],

  // ── Error handling ────────────────────────────────────────────────────

  /** Maximum network errors tolerated during buffering. */
  maxNetworkErrorsDuringBuffering: ["maxNetworkErrorsDuringBuffering", 20],

  // ── Fast play ─────────────────────────────────────────────────────────

  /** Maximum content time (ms) threshold for fast-play mode. */
  maxFastPlayContentTimeThresholdMs: ["maxFastPlayContentTimeThresholdMs", 112_000],

  // ── Branch decisions ──────────────────────────────────────────────────

  /** Minimum time (ms) before making a branch decision. */
  minimumTimeBeforeBranchDecision: ["minimumTimeBeforeBranchDecision", 2000],

  /** Minimum appended media (ms) before allowing playback. */
  minimumAppendedMediaBeforePlayback: ["minimumAppendedMediaBeforePlayback", 5000],

  /** Distance (ms) for JIT branch appending. */
  jitBranchAppendingDistance: ["jitBranchAppendingDistance", 10_000],

  // ── Research / debug ──────────────────────────────────────────────────

  /** Enable the research environment. */
  researchEnvironmentEnabled: ["researchEnvironmentEnabled", false],

  /** Dump fragment data for debugging. */
  ase_dump_fragments: ["ase_dump_fragments", false],

  /** Stall at frame count for audio (undefined = disabled). */
  stallAtFrameCountAudio: ["stallAtFrameCountAudio", undefined],

  // ── IQR ───────────────────────────────────────────────────────────────

  /** Maximum IQR samples. */
  maxIQRSamples: ["maxIQRSamples", 100],

  /** Minimum IQR samples. */
  minIQRSamples: ["minIQRSamples", 5],

  // ── Seamless audio profiles ───────────────────────────────────────────

  /** Audio profiles supporting seamless transitions. */
  seamlessAudioProfiles: ["seamlessAudioProfiles", []],

  /** Per-title seamless audio profile configurations. */
  seamlessAudioProfilesAndTitles: ["seamlessAudioProfilesAndTitles", {}],

  // ── Fragment editing ──────────────────────────────────────────────────

  /** Edit complete fragments (trim/adjust). */
  editCompleteFragments: ["editCompleteFragments", true],

  /** Guard sample count to prevent audio overlap. */
  audioOverlapGuardSampleCount: ["audioOverlapGuardSampleCount", 2],

  // ── JS Bridge performance ─────────────────────────────────────────────

  /** Record JS bridge call performance. */
  enableRecordJSBridgePerf: ["enableRecordJSBridgePerf", false],

  /** T-Digest config for JS bridge performance tracking. */
  JSBridgeTDigestConfig: ["JSBridgeTDigestConfig", {
    maxc: 25,
    c: 0.5,
  }],

  // ── Hindsight (offline analysis) ──────────────────────────────────────

  /** Denominator for hindsight sampling (0 = disabled). */
  hindsightDenominator: ["hindsightDenominator", 0],

  /** Denominator for hindsight debug mode (0 = disabled). */
  hindsightDebugDenominator: ["hindsightDebugDenominator", 0],

  /** List of hindsight algorithm names to enable. */
  hindsightAlgorithmsEnabled: ["hindsightAlgorithmsEnabled", []],

  /** Parameters for hindsight data collection. */
  hindsightParam: ["hindsightParam", {
    numB: Infinity,
    bSizeMs: 1000,
    fillS: "last",
    fillHl: 1000,
  }],

  // ── ASE reporting ─────────────────────────────────────────────────────

  /** Denominator for ASE report sampling (0 = disabled). */
  aseReportDenominator: ["aseReportDenominator", 0],

  /** Interval (ms) between ASE reports. */
  aseReportIntervalMs: ["aseReportIntervalMs", 300_000],

  /** Maximum stream selections included in ASE reports. */
  aseReportMaxStreamSelections: ["aseReportMaxStreamSelections", 400],

  // ── Contiguous buffer ─────────────────────────────────────────────────

  /** Multiplier for contiguous buffer sizing. */
  contiguousBufferMultiplier: ["contiguousBufferMultiplier", 3],

  /** Minimum contiguous buffer for audio (bytes). */
  contiguousBufferMinimumAudio: ["contiguousBufferMinimumAudio", 1048576],

  /** Minimum contiguous buffer for video (bytes). */
  contiguousBufferMinimumVideo: ["contiguousBufferMinimumVideo", 8388608],

  /** Minimum contiguous buffer for text (bytes). */
  contiguousBufferMinimumText: ["contiguousBufferMinimumText", 0],

  /** Use dynamic buffer size limiter. */
  useBufferSizeLimiter: ["useBufferSizeLimiter", false],

  /** Use static buffer size limiter. */
  useStaticBufferSizeLimiter: ["useStaticBufferSizeLimiter", false],

  // ── Scheduling ────────────────────────────────────────────────────────

  /** Supports PTS changed events from the platform. */
  supportsPtsChanged: ["supportsPtsChanged", true],

  /** Use priority-based setTimeout. */
  usePrioritySetTimeout: ["usePrioritySetTimeout", false],

  /** Centralize clock-based schedulers. */
  centralizeClockSchedulers: ["centralizeClockSchedulers", true],

  /** Back off setTimeout intervals when idle. */
  backOffSetTimeout: ["backOffSetTimeout", true],

  // ── Skip intro ────────────────────────────────────────────────────────

  /** Enable skip-intro playgraph for branching. */
  skipIntroPlaygraphEnabled: ["skipIntroPlaygraphEnabled", false],

  // ── Media events ──────────────────────────────────────────────────────

  /** Enable media event history tracking. */
  enableMediaEventHistory: ["enableMediaEventHistory", true],

  /** Enable buffer size limiter tracer. */
  enableBufferSizeLimiterTracer: ["enableBufferSizeLimiterTracer", false],

  /** Account for play delay in live buffering calculations. */
  liveShouldAccountForPlayDelay: ["liveShouldAccountForPlayDelay", false],

  /** Use manifest server expiration for cache invalidation. */
  useManifestServerExpiration: ["useManifestServerExpiration", false],

  /** Always retain ad content in cache. */
  alwaysRetainAds: ["alwaysRetainAds", false],

  /** Enable media events track for ad tracking. */
  enableMediaEventsTrack: ["enableMediaEventsTrack", false],

  // ── Live ad manifest ──────────────────────────────────────────────────

  /** Window (ms) for live ad manifest. */
  liveAdManifestWindowMs: ["liveAdManifestWindowMs", 10_000],

  /** Allowance (ms) beyond the ad manifest window. */
  liveAdManifestWindowAllowanceMs: ["liveAdManifestWindowAllowanceMs", 5000],

  /** Cushion (ms) for early termination of live ads. */
  liveAdEarlyTerminationCushionMs: ["liveAdEarlyTerminationCushionMs", 1000],

  /** Onset time (ms) for live ad manifest window. */
  liveAdManifestWindowOnset: ["liveAdManifestWindowOnset", 0],

  /** Throttle manifest requests for live content. */
  enableLiveManifestThrottling: ["enableLiveManifestThrottling", true],

  // ── TCP connections ───────────────────────────────────────────────────

  /** Reuse TCP connections when sticky-steered to a CDN. */
  reuseTcpConnectionsWhenStickySteered: ["reuseTcpConnectionsWhenStickySteered", false],

  /** Share TCP connections for live media types. */
  liveShareTcpConnections: ["liveShareTcpConnections", [[]]],

  /** Use media TCP connection for header downloads in live. */
  liveUseMediaTcpForHeaders: ["liveUseMediaTcpForHeaders", false],

  // ── Synthetic ads ─────────────────────────────────────────────────────

  /** UX treatment for synthetic ad breaks (empty = disabled). */
  syntheticAdBreakUx: ["syntheticAdBreakUx", ""],

  /** Pad OCA side-channel requests for uniform sizing. */
  padOcaSideChannelRequests: ["padOcaSideChannelRequests", true],

  // ── Live hydration ────────────────────────────────────────────────────

  /** Min distance (ms) from live edge for hydration. */
  liveHydrationMinDistanceFromLiveEdge: ["liveHydrationMinDistanceFromLiveEdge", 30_000],

  /** Allow hydrations close to the live edge. */
  canPerformHydrationsCloseToLiveEdge: ["canPerformHydrationsCloseToLiveEdge", false],

  /** Min distance (ms) from playback position for hydration. */
  liveHydrationMinDistanceFromPlayback: ["liveHydrationMinDistanceFromPlayback", 120_000],

  /** Default jitter window (ms) for hydration timing. */
  liveHydrationDefaultJitterWindow: ["liveHydrationDefaultJitterWindow", 30_000],

  /** Distance (ms) from playback where jitter is applied. */
  liveHydrationDistanceThatNeedJitter: ["liveHydrationDistanceThatNeedJitter", 120_000],

  /** Allow soft (non-disruptive) hydrations. */
  canPerformSoftHydrations: ["canPerformSoftHydrations", true],

  /** Pace hydration policy based on live edge distance. */
  paceHydrationPolicyByLiveEdge: ["paceHydrationPolicyByLiveEdge", true],

  // ── Black box / media events ──────────────────────────────────────────

  /** Enable black box notification for diagnostics. */
  enableBlackBoxNotification: ["enableBlackBoxNotification", true],

  /** Minimum buffer (ms) for live media events. */
  liveMediaEventsMinBufferMs: ["liveMediaEventsMinBufferMs", 4000],

  /** Max wait time (ms) for media events during buffering. */
  maxWaitTimeForMediaEventsWhileBufferingMS: [
    "maxWaitTimeForMediaEventsWhileBufferingMS", 5000
  ],

  /** Catchup window (ms) for live media events. */
  liveMediaEventsCatchupMs: ["liveMediaEventsCatchupMs", 30_000],

  /** Eagerly fetch media events ahead of playback. */
  earlyFetchMediaEvents: ["earlyFetchMediaEvents", true],

  /** Maximum catchup window (ms) for live media events. */
  liveMaximumEventsCatchupMs: ["liveMaximumEventsCatchupMs", 120_000],

  /** Maximum catchup window (ms) for linear live events. */
  linearMaximumEventsCatchupMs: ["linearMaximumEventsCatchupMs", 20_000],

  /** Enable ad playgraphs for branching logic. */
  enableAdPlaygraphsForBranching: ["enableAdPlaygraphsForBranching", true],

  /** Always send side-channel data regardless of conditions. */
  alwaysSendSideChannel: ["alwaysSendSideChannel", true],

  // ── Fetch / timeouts ──────────────────────────────────────────────────

  /** Default timeout (ms) for fetch-based requests. */
  defaultTimeoutForFetchRequests: ["defaultTimeoutForFetchRequests", 8000],

  /** Timeout (ms) for server clock sync during viewable retrieval. */
  serverClockSyncOnViewableRetrievalTimeout: [
    "serverClockSyncOnViewableRetrievalTimeout", 10_000
  ],

  /** Enable optimal panic behavior for live with ads. */
  enableLiveWithAdsOptimalPanic: ["enableLiveWithAdsOptimalPanic", false],

  // ── Batch request throttling ──────────────────────────────────────────

  /** Maximum duration (ms) for batch request throttling. */
  batchRequestThrottlerMaxDuration: ["batchRequestThrottlerMaxDuration", 15_000],

  /** Sleep duration (ms) between batched requests. */
  batchRequestThrottlerSleepDuration: ["batchRequestThrottlerSleepDuration", 0],

  /** Enable reporting events for live ad breaks. */
  enableLiveAdBreakReportingEvents: ["enableLiveAdBreakReportingEvents", true],

  // ── Presentation delay ────────────────────────────────────────────────

  /** Minimum presentation delay (ms) from live edge. */
  minimumPresentationDelayMs: ["minimumPresentationDelayMs", 10_000],

  /** Number of segments to skip at the live edge. */
  liveEdgeSegmentSkipCount: ["liveEdgeSegmentSkipCount", 0],

  /** Enforce segment availability window at request time for linear. */
  linearEnforceSegmentAvailabilityWindowAtIssueRequest: [
    "linearEnforceSegmentAvailabilityWindowAtIssueRequest", true
  ],

  /** Maximum retries for media events. */
  mediaEventsMaxRetry: ["mediaEventsMaxRetry", 20],

  /** Enable active presentation delay control. */
  enablePresentationDelayControl: ["enablePresentationDelayControl", false],

  /** Tolerance (ms) for target presentation delay. */
  targetPresentationDelayToleranceMs: ["targetPresentationDelayToleranceMs", 500],

  /** Lock period (ms) for QoE-based presentation delay decisions. */
  presentationDelayQoeLockPeriodMs: ["presentationDelayQoeLockPeriodMs", 60_000],

  // ── Live request pacing ───────────────────────────────────────────────

  /** Enable request pacing for live streams. */
  enableLiveRequestPacing: ["enableLiveRequestPacing", true],

  /** Enable live-like request pacing for VOD. */
  enableLiveLikeRequestPacing: ["enableLiveLikeRequestPacing", false],

  /** Multiplier for live-like request pacing. */
  liveLikeRequestPacingMultiplier: ["liveLikeRequestPacingMultiplier", 1],

  /** Center position (ms) for logarithmic request pacing curve. */
  logarithmicRequestPacingCurveCenterPositionMs: [
    "logarithmicRequestPacingCurveCenterPositionMs", 40_000
  ],

  /** Sharpness of the logarithmic request pacing curve. */
  logarithmicRequestPacingCurveSharpness: ["logarithmicRequestPacingCurveSharpness", 8],

  /** Maximum target buffer duration (ms) for live. */
  maxLiveTargetBufferDurationMs: ["maxLiveTargetBufferDurationMs", 240_000],

  // ── ELLA (Experimental Low-Latency Architecture) ──────────────────────

  /** Enable ELLA for live streaming. */
  liveIsEllaEnabled: ["liveIsEllaEnabled", false],

  /** Enable ELLA ABR (adaptive bitrate) integration. */
  liveIsEllaABREnabled: ["liveIsEllaABREnabled", true],

  /** Enable ELLA HTTP mixing (fallback to HTTP). */
  liveIsEllaHttpMixingEnabled: ["liveIsEllaHttpMixingEnabled", true],

  /** Edge cushion (ms) for ELLA live streaming. */
  liveEllaEdgeCushion: ["liveEllaEdgeCushion", 4000],

  /** Proximity threshold (ms) for ELLA. */
  liveEllaProximityThresholdMs: ["liveEllaProximityThresholdMs", 4000],

  /** Check interval (ms) for ELLA proximity. */
  liveEllaProximityCheckIntervalMs: ["liveEllaProximityCheckIntervalMs", 500],

  /** Timeout multiplier for ELLA requests. */
  liveEllaTimeoutMultiplier: ["liveEllaTimeoutMultiplier", 2],

  /** ELLA bandwidth oracle value (-1 = auto). */
  ellaBandwidthOracle: ["ellaBandwidthOracle", -1],

  /** Margin for ELLA bandwidth oracle. */
  ellaBandwidthOracleMargin: ["ellaBandwidthOracleMargin", 0.2],

  /** Percentage of throughput allocated to audio in ELLA. */
  ellaAudioThroughputPercentage: ["ellaAudioThroughputPercentage", 10],

  /** Margin for throughput-based selection in ELLA. */
  ellaThroughputBasedSelectionMargin: ["ellaThroughputBasedSelectionMargin", 0.4],

  /** Channel selection mode for ELLA: "loss-queuing-delay", etc. */
  ellaChannelSelectionMode: ["ellaChannelSelectionMode", "loss-queuing-delay"],

  /** Round-robin rate for ELLA channel switching. */
  ellaChannelSwitchRRRate: ["ellaChannelSwitchRRRate", 1],

  /** Packet loss rate thresholds for ELLA channel selection. */
  ellaPktLossRateThreshold: ["ellaPktLossRateThreshold", [0.01, 0.02]],

  /** Queuing delay thresholds (ms) for ELLA channel selection. */
  ellaQueuingDelayThreshold: ["ellaQueuingDelayThreshold", [200, 500]],

  /** Lock period (ms) to stay on current ELLA channel. */
  ellaLockPeriodToStayMs: ["ellaLockPeriodToStayMs", 10_000],

  /** Lock period (ms) to drain before switching ELLA channel. */
  ellaLockPeriodToDrainMs: ["ellaLockPeriodToDrainMs", 10_000],

  /** Maximum encoding bitrate (kbps) for ELLA. */
  ellaMaxEncodingBitrateKbps: ["ellaMaxEncodingBitrateKbps", 8500],

  /** Minimum encoding bitrate (kbps) for ELLA. */
  ellaMinEncodingBitrateKbps: ["ellaMinEncodingBitrateKbps", 800],

  /** Enable forced downswitch in ELLA. */
  ellaEnableForceDownswitch: ["ellaEnableForceDownswitch", false],

  /** ELLA implementation: "js" or "native". */
  ellaImplementation: ["ellaImplementation", "js"],

  /** CDN base URL template for ELLA scripts. */
  ellaCdnBaseUrl: ["ellaCdnBaseUrl",
    "https://occ.a.nflxso.net/genc/nrdp/ella/$packageName/$version/$filename"],

  /** CDN filename for ELLA script. */
  ellaCdnFilename: ["ellaCdnFilename", "index.release.js"],

  /** Skip CDN version check for ELLA. */
  ellaCdnSkipVersionCheck: ["ellaCdnSkipVersionCheck", false],

  /** Window (ms) for recording ELLA relay failures. */
  ellaRelayFailureRecordWindowMs: ["ellaRelayFailureRecordWindowMs", 600_000],

  /** Maximum relay failures allowed in the recording window. */
  ellaRelayMaxFailuresInWindow: ["ellaRelayMaxFailuresInWindow", 50],

  /** Maximum consecutive relay failures before fallback. */
  ellaRelayMaxConsecutiveFailures: ["ellaRelayMaxConsecutiveFailures", 10],

  /** Window (ms) for ELLA channel health monitoring. */
  ellaChannelHealthMonitoringWindowMs: ["ellaChannelHealthMonitoringWindowMs", 60_000],

  /** Polling interval (ms) for ELLA channel health. */
  ellaChannelHealthPollingIntervalMs: ["ellaChannelHealthPollingIntervalMs", 10_000],

  /** Maximum channel failures in the health monitoring window. */
  ellaChannelMaxFailuresInWindow: ["ellaChannelMaxFailuresInWindow", 10],

  /** Maximum consecutive channel failures. */
  ellaChannelMaxConsecutiveFailures: ["ellaChannelMaxConsecutiveFailures", 5],

  /** Override manifest settings for ELLA. */
  overrideManifestForElla: ["overrideManifestForElla", true],

  /** Override ELLA relay server list from config. */
  overrideEllaRelayServers: ["overrideEllaRelayServers", true],

  /** Default ELLA relay server list. */
  ellaRelayServers: ["ellaRelayServers", [
    { id: 2, ipAddress: "2a00:86c0:2028:2028::166", port: 7002, certificate: "" },
    { id: 1, ipAddress: "198.38.100.140", port: 7002, certificate: "" },
    { id: 3, ipAddress: "::1", port: 7002, certificate: "" },
  ]],

  /** Forward Error Correction rate for ELLA. */
  ellaFecRate: ["ellaFecRate", 0.1],

  /** Send rate multipliers for ELLA [low, medium, high]. */
  ellaSendRateMultiplier: ["ellaSendRateMultiplier", [1.1, 1.2, 1.5]],

  /** Channel name prefix for ELLA. */
  ellaChannelNamePrefix: ["ellaChannelNamePrefix", "/2557822/1263725932"],

  /** Movie ID for ELLA testing. */
  ellaMovieId: ["ellaMovieId", 82101269],

  // ── SVOD request pacing ───────────────────────────────────────────────

  /** Enable request pacing for SVOD content. */
  enableSvodRequestPacing: ["enableSvodRequestPacing", true],

  /** Slope for SVOD buffer growth rate. */
  svodBufferGrowthRateSlope: ["svodBufferGrowthRateSlope", 2],

  /** Minimum target buffer duration (ms) for SVOD. */
  minSvodTargetBufferDurationMs: ["minSvodTargetBufferDurationMs", 60_000],

  /** Enable logarithmic pacing for SVOD. */
  enableSvodLogarithmicPacing: ["enableSvodLogarithmicPacing", false],

  /** Center position (ms) for SVOD logarithmic pacing curve. */
  svodLogarithmicRequestPacingCurveCenterPositionMs: [
    "svodLogarithmicRequestPacingCurveCenterPositionMs", 40_000
  ],

  /** Sharpness of SVOD logarithmic pacing curve. */
  svodLogarithmicRequestPacingCurveSharpness: [
    "svodLogarithmicRequestPacingCurveSharpness", 8
  ],

  // ── Explicit downloadables ────────────────────────────────────────────

  /** Map of explicit video downloadable IDs to config. */
  explicitVideoDownloadablesMap: ["explicitVideoDownloadablesMap", {}],

  /** Truncation threshold (ms) for ad content. */
  adsTruncationThreshold: ["adsTruncationThreshold", 2500],

  /** Use next segment size for live stream selection. */
  useNextSegmentSizeForLiveSelection: ["useNextSegmentSizeForLiveSelection", false],

  // ── Laser (testing framework) ─────────────────────────────────────────

  /** Enable Laser testing framework. */
  laser: ["laser", false],

  /** Events configuration for Laser. */
  laserEvents: ["laserEvents", { "*": true }],

  /** Session type for Laser: "MANUAL_TEST", etc. */
  laserSessionType: ["laserSessionType", "MANUAL_TEST"],

  /** Description for the Laser test session. */
  laserSessionDescription: ["laserSessionDescription", undefined],

  /** Name for the Laser test session. */
  laserSessionName: ["laserSessionName", undefined],

  /** Run ID for the Laser test session. */
  laserRunId: ["laserRunId", undefined],
};

/**
 * Alias used internally by the ASE config system.
 * @type {typeof ASE_CONFIG_DEFAULTS}
 */
export const internalConfigBase = ASE_CONFIG_DEFAULTS;

/**
 * Primary export consumed by the ConfigManager.
 * @type {typeof ASE_CONFIG_DEFAULTS}
 */
export const configBase = ASE_CONFIG_DEFAULTS;

export default ASE_CONFIG_DEFAULTS;
