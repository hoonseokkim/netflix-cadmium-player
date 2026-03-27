/**
 * Netflix Cadmium Player — Default ASE (Adaptive Streaming Engine) Configuration
 *
 * Defines all default configuration parameters for Netflix's adaptive streaming
 * engine. These values govern bitrate selection, buffering thresholds, throughput
 * estimation, network monitoring, live streaming behavior, audio/video profile
 * switching, and many other aspects of the player's streaming logic.
 *
 * The configuration is exported as an observable value so that downstream
 * consumers can react to dynamic overrides applied at runtime.
 *
 * Key configuration areas:
 * - **Bitrate selection**: initial bitrate ranges, up/down-switch thresholds
 * - **Buffering**: prebuffer sizes, rebuffer factors, watermark levels
 * - **Throughput estimation**: filter types (EWMA, sliding window, IQR, t-digest, entropy)
 * - **Network**: parallel connections, socket buffer sizes, failure handling
 * - **Live streaming**: latency control, request pacing, ad break handling
 * - **VMAF-aware selection**: quality-based stream filtering
 * - **Playgraph/branching**: combined playgraphs, exit zones, transitions
 *
 * @module DefaultAseConfig
 */

import { configBase } from '../modules/Module_36948.js';

// ─── Audio Profiles ───────────────────────────────────────────────────────────

/**
 * Audio profiles that support dynamic switching during playback.
 * @type {string[]}
 */
const SWITCHABLE_AUDIO_PROFILES = [
  'ddplus-5.1-dash',
  'ddplus-5.1hq-dash',
  'ddplus-atmos-dash',
];

/**
 * Per-profile overrides for audio bitrate initialization ranges.
 * @type {Array<{profiles: string[], override: {minInitAudioBitrate: number, maxInitAudioBitrate: number}}>}
 */
const SWITCHABLE_AUDIO_PROFILES_OVERRIDE = [
  {
    profiles: ['ddplus-5.1-dash', 'ddplus-5.1hq-dash'],
    override: {
      minInitAudioBitrate: 0,
      maxInitAudioBitrate: 65535,
    },
  },
  {
    profiles: ['ddplus-atmos-dash'],
    override: {
      minInitAudioBitrate: 0,
      maxInitAudioBitrate: 65535,
    },
  },
];

// ─── Throughput Filter Definitions ────────────────────────────────────────────

/**
 * Names of enabled throughput estimation filters.
 * @type {string[]}
 */
const ENABLED_FILTERS = [
  'throughput-ewma',
  'throughput-sw',
  'throughput-sw-fast',
  'throughput-iqr',
  'throughput-tdigest',
  'avtp',
  'entropy',
];

/**
 * Default definitions for each throughput estimation filter.
 *
 * Filter types include:
 * - `discontiguous-ewma` — Exponentially-weighted moving average with gap handling
 * - `slidingwindow` — Simple sliding-window average
 * - `iqr` — Interquartile-range based estimator
 * - `iqr-history` — IQR using historical data
 * - `discrete-ewma` — Discrete exponentially-weighted moving average
 * - `tdigest` — t-digest quantile estimator
 * - `tdigest-history` — t-digest using historical data
 * - `avtp` — Average throughput
 * - `entropy` — Entropy-based estimator with HD/UHD bucket lists
 *
 * @type {Record<string, object>}
 */
const DEFAULT_FILTER_DEFINITIONS = {
  'throughput-ewma': {
    type: 'discontiguous-ewma',
    /** Measurement window (ms) */
    mw: 5000,
    /** Weight time constant (ms) */
    wt: 5000,
  },
  'throughput-sw': {
    type: 'slidingwindow',
    mw: 5000,
  },
  'throughput-sw-fast': {
    type: 'slidingwindow',
    mw: 500,
  },
  'throughput-iqr': {
    type: 'iqr',
    /** Maximum samples */
    mx: Infinity,
    /** Minimum samples */
    mn: 5,
    /** Bandwidth window (ms) */
    bw: 15000,
    /** Update interval (ms) */
    iv: 1000,
  },
  'throughput-iqr-history': {
    type: 'iqr-history',
  },
  'throughput-location-history': {
    type: 'discrete-ewma',
    /** Half-life (seconds) */
    hl: 14400,
    /** Initial value (seconds) */
    in: 3600,
  },
  'respconn-location-history': {
    type: 'discrete-ewma',
    hl: 100,
    in: 25,
  },
  'throughput-tdigest': {
    type: 'tdigest',
    /** Maximum centroids */
    maxc: 25,
    /** Compression factor */
    c: 0.5,
    /** Buffer size */
    b: 1000,
    /** Window (ms) */
    w: 15000,
    /** Minimum samples */
    mn: 6,
  },
  'throughput-tdigest-history': {
    type: 'tdigest-history',
    maxc: 25,
    /** Reconstruction method */
    rc: 'ewma',
    c: 0.5,
    hl: 7200,
  },
  'respconn-ewma': {
    type: 'discrete-ewma',
    hl: 10,
    in: 10,
  },
  average: {
    type: 'avtp',
  },
  entropy: {
    type: 'entropy',
    /** Measurement window (ms) */
    mw: 2000,
    /** Sliding window (ms) */
    sw: 60000,
    /** Initial estimator */
    in: 'none',
    /** Minimum samples */
    mins: 1,
    /** HD bitrate bucket boundaries (kbps) */
    hdl: [150, 230, 352, 539, 825, 1264, 1936, 2966, 4543, 6958],
    /** UHD bitrate bucket boundaries (kbps) */
    uhdl: [150, 230, 352, 539, 825, 1264, 1936, 2966, 4543, 6958, 10657, 16322, 25000],
  },
};

// ─── Throughput-to-Bitrate Selection Curves ───────────────────────────────────

/**
 * Default throughput-to-video-bitrate selection curve.
 * Each entry maps a throughput margin percentage (`m`) to a bitrate threshold
 * in kbps (`b`). At higher buffer levels, a lower margin is required.
 * @type {Array<{m: number, b: number}>}
 */
const DEFAULT_VIDEO_BITRATE_SELECTION_CURVE = [
  { m: 65, b: 8000 },
  { m: 65, b: 30000 },
  { m: 50, b: 60000 },
  { m: 45, b: 90000 },
  { m: 40, b: 120000 },
  { m: 20, b: 180000 },
  { m: 5, b: 240000 },
];

/**
 * In-session throughput-to-bitrate selection curve (more aggressive than default).
 * Used after `switchConfigBasedOnInSessionTput` is enabled.
 * @type {Array<{m: number, b: number}>}
 */
const IN_SESSION_VIDEO_BITRATE_SELECTION_CURVE = [
  { m: 80, b: 8000 },
  { m: 80, b: 30000 },
  { m: 70, b: 60000 },
  { m: 60, b: 90000 },
  { m: 50, b: 120000 },
  { m: 30, b: 180000 },
  { m: 10, b: 240000 },
];

// ─── AAC Timestamp Offsets ────────────────────────────────────────────────────

/**
 * Default AAC audio timestamp offset for synchronization.
 * @type {{ticks: number, timescale: number}}
 */
const DEFAULT_AAC_TIMESTAMP_OFFSET = {
  ticks: -3268,
  timescale: 48000,
};

/**
 * Per-audio-profile timestamp offset overrides, keyed by profile name
 * and then by bitrate (kbps).
 * @type {Record<string, Record<number, {ticks: number, timescale: number}>>}
 */
const PROFILE_TIMESTAMP_OFFSETS = {
  'heaac-2-dash': {
    64: { ticks: -3268, timescale: 48000 },
    96: { ticks: -3268, timescale: 48000 },
  },
  'heaac-2hq-dash': {
    128: { ticks: -3268, timescale: 48000 },
  },
  'heaac-5.1-dash': {
    192: { ticks: -3268, timescale: 48000 },
  },
  AMP_AUDIO_PROFILE_DEFAULT: {
    194: { ticks: -3268, timescale: 48000 },
  },
  FMP4_AAC: {
    194: { ticks: -3268, timescale: 48000 },
  },
};

// ─── Default ASE Configuration ────────────────────────────────────────────────

/**
 * Complete default configuration for the Adaptive Streaming Engine.
 *
 * This configuration object is exported as an observable value, allowing
 * runtime overrides (e.g. from A/B tests or server-side config) to be
 * applied and detected by downstream consumers.
 *
 * @type {object}
 */
export const defaultAseConfig = {
  // ── Bitrate Selection ─────────────────────────────────────────────────────

  /** Minimum initial video bitrate (kbps) */
  minInitVideoBitrate: 560,

  /** Maximum initial video bitrate (kbps) */
  maxInitVideoBitrate: Infinity,

  /** Minimum initial audio bitrate (kbps) */
  minInitAudioBitrate: 0,

  /** Maximum initial audio bitrate (kbps) */
  maxInitAudioBitrate: 65535,

  /** Minimum allowed video bitrate — no lower bound by default */
  minAllowedVideoBitrate: -Infinity,

  /** Maximum allowed video bitrate */
  maxAllowedVideoBitrate: Infinity,

  /** Audio profiles that support mid-session switching */
  switchableAudioProfiles: SWITCHABLE_AUDIO_PROFILES,

  /** Per-profile overrides for initial audio bitrate ranges */
  switchableAudioProfilesOverride: SWITCHABLE_AUDIO_PROFILES_OVERRIDE,

  /** Minimum acceptable video bitrate (kbps) — below this is rejected */
  minAcceptableVideoBitrate: 235,

  /** Static curve for initial bitrate selection (null = disabled) */
  initialBitrateSelectionCurve: null,

  // ── Buffering Thresholds ──────────────────────────────────────────────────

  /** Minimum required buffer level before playback starts (ms) */
  minRequiredBuffer: 30000,

  /** Minimum prebuffer size (ms) */
  minPrebufSize: 7800,

  /** Minimum interval for checking if buffering is complete (ms) — effectively disabled */
  minCheckBufferingCompleteInterval: 999999,

  /** Rebuffering size multiplier factor */
  rebufferingFactor: 1,

  /** Whether to use max prebuffer size cap */
  useMaxPrebufSize: true,

  /** Maximum prebuffer size (ms) */
  maxPrebufSize: 45000,

  /** Maximum rebuffer size (ms) */
  maxRebufSize: Infinity,

  /** Minimum steady-state buffer target (ms) */
  minSteadyStateBuffer: 2600,

  /** Minimum audio media request size in bytes */
  minAudioMediaRequestSizeBytes: 0,

  /** Minimum video media request size in bytes */
  minVideoMediaRequestSizeBytes: 0,

  // ── Throughput Estimation ─────────────────────────────────────────────────

  /** Percentage of throughput reserved for audio downloads */
  throughputPercentForAudio: 15,

  /** Throughput safety margin percentage */
  throughputSafetyMarginPercent: 10,

  /** Whether to use safe throughput estimation mode */
  useSafeThroughputEstimation: false,

  /** Throughput-to-bitrate selection curve for initial playback */
  videoBitrateSelectionCurve: DEFAULT_VIDEO_BITRATE_SELECTION_CURVE,

  /** Minimum samples before switching to in-session curve */
  inSessionThroughputSampleThreshold: 20,

  /** Whether to switch bitrate selection curve based on in-session throughput */
  switchConfigBasedOnInSessionTput: false,

  /** Number of in-session throughput samples required before switching */
  inSessionThroughputSwitchThreshold: 0,

  /** In-session throughput-to-bitrate selection curve */
  inSessionVideoBitrateSelectionCurve: IN_SESSION_VIDEO_BITRATE_SELECTION_CURVE,

  /** Maximum total buffer level allowed per session (ms; 0 = unlimited) */
  maxTotalBufferLevelPerSession: 0,

  // ── Bitrate Switching ─────────────────────────────────────────────────────

  /** Whether to skip intermediate bitrates during upswitch */
  skipBitrateInUpswitch: false,

  /** Buffer watermark level (ms) above which skip-upswitch is enabled */
  watermarkLevelForSkipStart: 8000,

  /** Time window (ms) to retain the current high-quality stream */
  highStreamRetentionWindow: 90000,

  /** Time window (ms) for transitioning away from low-quality streams */
  lowStreamTransitionWindow: 510000,

  /** High stream retention window for upswitches (ms) */
  highStreamRetentionWindowUp: 300000,

  /** Low stream transition window for upswitches (ms) */
  lowStreamTransitionWindowUp: 300000,

  /** High stream retention window for downswitches (ms) */
  highStreamRetentionWindowDown: 600000,

  /** Low stream transition window for downswitches (ms) */
  lowStreamTransitionWindowDown: 0,

  /** Factor for marking a bitrate as infeasible based on high-stream data */
  highStreamInfeasibleBitrateFactor: 0.5,

  /** Minimum buffer level (ms) required before allowing an upswitch */
  lowestBufForUpswitch: 15000,

  /** Lock-out period (ms) after a downswitch before allowing another switch */
  lockPeriodAfterDownswitch: 15000,

  /** Buffer watermark level (ms) below which stream quality is reduced */
  lowWatermarkLevel: 25000,

  /** Low watermark level for mini-modal horizontal UI */
  miniModalHorizontalLowestWaterMarkLevel: 20000,

  /** Whether aggressive downswitch is enabled */
  aggressiveDownswitchEnabled: false,

  /** Fast upswitch throughput multiplier */
  fastUpswitchFactor: 3,

  /** Fast downswitch throughput multiplier */
  fastDownswitchFactor: 1,

  // ── Playback & Media Buffer ───────────────────────────────────────────────

  /** Playback media rate multiplier */
  mediaRate: 1,

  /** Maximum trailing (already-played) buffer to retain (ms) */
  maxTrailingBufferLen: 10000,

  /** Target available audio buffer size (bytes) */
  audioBufferTargetAvailableSize: 262144,

  /** Target available video buffer size (bytes) */
  videoBufferTargetAvailableSize: 1048576,

  /** Maximum total media buffer allowed (ms) */
  maxMediaBufferAllowed: 240000,

  /** Maximum total media buffer allowed for live content (ms) */
  maxLiveMediaBufferAllowed: 240000,

  /** Whether to simulate partial block downloads */
  simulatePartialBlocks: true,

  /** Whether partial block simulation uses strict mode */
  simulatePartialBlocksStrictMode: false,

  /** Partial block simulation scaling factor */
  partialBlockSimulationFactor: 1,

  // ── Network & Request Management ──────────────────────────────────────────

  /** Maximum network errors tolerated during buffering */
  maxNetworkErrorsDuringBuffering: 20,

  /** Maximum time (ms) buffering is allowed while network errors occur */
  maxBufferingTimeAllowedWithNetworkError: 120000,

  /** How often (ms) to update location-based statistics */
  locationStatisticsUpdateInterval: 60000,

  /** Whether to probe the server after encountering an error */
  probeServerWhenError: false,

  /** Timeout (ms) for server probe requests */
  probeRequestTimeoutMilliseconds: 8000,

  /** Whether to allow switching back to a previously-failed server */
  allowSwitchback: true,

  /** Denominator for probe detail sampling (1/N probability) */
  probeDetailDenominator: 100,

  /** Maximum delay (ms) before reporting a failure */
  maxDelayToReportFailure: 300,

  /** Maximum active requests (SAB cell 100) */
  maxActiveRequestsSABCell100: 2,

  /** Size (bytes) of initial header request */
  headerRequestSize: 4096,

  /** Whether to estimate header sizes instead of requesting exact size */
  estimateHeaderSize: false,

  /** Minimum buffer level (ms) required before downloading headers */
  minBufferLenForHeaderDownloading: 10000,

  /** Whether HTTP pipelining is enabled */
  pipelineEnabled: false,

  /** Maximum number of parallel HTTP connections */
  maxParallelConnections: 3,

  /** General socket receive buffer size (bytes; 0 = OS default) */
  socketReceiveBufferSize: 0,

  /** Audio socket receive buffer size (bytes) */
  audioSocketReceiveBufferSize: 32768,

  /** Video socket receive buffer size (bytes) */
  videoSocketReceiveBufferSize: 65536,

  /** Headers socket receive buffer size (bytes) */
  headersSocketReceiveBufferSize: 32768,

  /** Maximum active requests per session */
  maxActiveRequestsPerSession: 3,

  /** Maximum outstanding requests allowed */
  maxAllowedOutstandingRequests: 4,

  // ── Notifications & Reporting ─────────────────────────────────────────────

  /** How often (ms) to fire buffer-level change notifications */
  bufferLevelNotifyIntervalMs: 2000,

  /** Denominator for ASE report sampling (0 = disabled) */
  aseReportDenominator: 0,

  /** How often (ms) to send ASE reports */
  aseReportIntervalMs: 300000,

  /** Maximum time (ms) allowed for prebuffering before timeout */
  prebufferTimeLimit: 240000,

  // ── Connection Quality ────────────────────────────────────────────────────

  /** Penalty multiplier for servers with long connect times */
  penaltyFactorForLongConnectTime: 2,

  /** Connect time threshold (ms) considered "long" */
  longConnectTimeThreshold: 200,

  /** Extra buffering time (ms) added when connect time is long */
  additionalBufferingLongConnectTime: 2000,

  /** Extra buffering time (ms) added per failure */
  additionalBufferingPerFailure: 8000,

  /** Duration (ms) of the rebuffer-check window */
  rebufferCheckDuration: 60000,

  // ── Side Channels (OC / Unified) ──────────────────────────────────────────

  /** Whether Open Connect side channel is enabled */
  enableOCSideChannel: true,

  /** Whether unified side channel is enabled */
  enableUnifiedSideChannel: false,

  /** Whether unified side channel is enabled for live */
  liveEnableUnifiedSideChannel: false,

  /** Whether unified side channel is enabled for SVOD */
  svodEnableUnifiedSideChannel: false,

  /** Buffer quantization config for OC side channel */
  OCSCBufferQuantizationConfig: {
    /** Quantization level */
    lv: 5,
    /** Maximum buffer (seconds) */
    mx: 240,
  },

  /** Internal flag for OC side channel */
  internal_Yqa: false,

  // ── Header Cache ──────────────────────────────────────────────────────────

  /** Number of headers to cache per stream */
  defaultHeaderCacheSize: 4,

  /** How far ahead (ms) to prefetch header data */
  defaultHeaderCacheDataPrefetchMs: 8000,

  // ── Network Failure Handling ──────────────────────────────────────────────

  /** Wait time (ms) before resetting after a network failure */
  networkFailureResetWaitMs: 2000,

  /** Time (ms) before abandoning playback due to network failure */
  networkFailureAbandonMs: 120000,

  /** Maximum throttled network failures before escalation */
  maxThrottledNetworkFailures: 3,

  /** Threshold (ms) for considering a failure throttled */
  throttledNetworkFailureThresholdMs: 2000,

  /** Throughput (kbps) below which connection is considered low-quality */
  lowThroughputThreshold: 400,

  /** Whether to exclude sessions without history from low throughput check */
  excludeSessionWithoutHistoryFromLowThroughputThreshold: false,

  // ── Audio/Video Sync ──────────────────────────────────────────────────────

  /** Whether audio stream must cover the full video duration */
  requireAudioStreamToEncompassVideo: true,

  /** Whether to limit audio throughput discount by max audio bitrate */
  limitAudioDiscountByMaxAudioBitrate: true,

  // ── Debug ─────────────────────────────────────────────────────────────────

  /** Whether to emit debug traces from the streaming manager */
  enableManagerDebugTraces: false,

  // ── Network Interruption Detection ────────────────────────────────────────

  /** Window (ms) for storing network interruption data */
  netIntrStoreWindow: 36000,

  /** Minimum duration (ms) for an interruption to be recorded */
  minNetIntrDuration: 8000,

  // ── Historical Bandwidth ──────────────────────────────────────────────────

  /** Expiration time (ms) for fast historical bandwidth estimates */
  fastHistoricBandwidthExpirationTime: 10368000,

  /** Expiration time (ms) for standard historical bandwidth estimates */
  bandwidthExpirationTime: 5184000,

  /** Expiration time (ms) for failure history records */
  failureExpirationTime: 86400,

  // ── Measurement & Sampling ────────────────────────────────────────────────

  /** Whether to expand download time measurements */
  expandDownloadTime: false,

  /** Whether to ignore short responses in throughput measurement */
  ignoreShortResponses: false,

  /** Minimum time (ms) for a valid throughput measurement */
  minimumMeasurementTime: 500,

  /** Minimum bytes for a valid throughput measurement */
  minimumMeasurementBytes: 131072,

  /** Time (ms) for probing measurements */
  probingMeasurementTime: 2000,

  /** Bytes for probing measurements */
  probingMeasurementBytes: 262144,

  /** How often (ms) to update historical bandwidth estimates */
  historicBandwidthUpdateInterval: 2000,

  // ── Stream Selector ───────────────────────────────────────────────────────

  /** VOD stream selector algorithm */
  ase_stream_selector: 'optimized',

  /** Live stream selector algorithm */
  liveStreamSelectorAlgorithm: 'livesimple',

  /** Whether joint audio+video stream selection is enabled */
  jointStreamSelectorEnabled: false,

  /** Enabled throughput estimation filters */
  enableFilters: ENABLED_FILTERS,

  /** Per-filter definition overrides (empty = use defaults) */
  filterDefinitionOverrides: {},

  /** Primary throughput filter for bitrate decisions */
  defaultFilter: 'throughput-ewma',

  /** Secondary throughput filter (fallback) */
  secondaryFilter: 'none',

  /** Complete set of filter definitions */
  defaultFilterDefinitions: DEFAULT_FILTER_DEFINITIONS,

  /** Stream selector variant */
  streamSelectorVariant: 'default',

  /** Whether to dump ASE fragment info for debugging */
  ase_dump_fragments: false,

  /** Throughput dump interval (0 = disabled) */
  throughputDumpInterval: 0,

  /** Secondary throughput estimator type */
  secondThroughputEstimator: 'none',

  /** Margin predictor algorithm */
  marginPredictor: 'simple',

  /** Source filter for confidence-interval predictor */
  ciPredictorSource: 'throughput-ci',

  /** Strategy for simulation duration calculation */
  simulationDurationStrategy: 'default',

  /** Experimental throughput filters */
  experimentalFilter: ['throughput-wssl'],

  /** Granularity of network measurements */
  networkMeasurementGranularity: 'video_location',

  /** Maximum IQR samples to retain */
  maxIQRSamples: Infinity,

  /** Minimum IQR samples required */
  minIQRSamples: 5,

  // ── Persistence ───────────────────────────────────────────────────────────

  /** How often (ms) to periodically persist history */
  periodicHistoryPersistMs: 300000,

  /** How often (ms) to save bitrate selection data */
  saveBitrateMs: 180000,

  /** Whether a minimum network confidence is required before quality decisions */
  needMinimumNetworkConfidence: true,

  /** Whether to bias toward historical throughput for initial selection */
  biasTowardHistoricalThroughput: true,

  // ── Fast Play & Media Requests ────────────────────────────────────────────

  /** Maximum fast-play buffer (ms; Infinity = no limit) */
  maxFastPlayBufferInMs: Infinity,

  /** Minimum audio media request duration (ms) */
  minAudioMediaRequestDuration: 4000,

  /** Minimum video media request duration (ms) */
  minVideoMediaRequestDuration: 4000,

  /** Whether to include header data in network monitoring */
  addHeaderDataToNetworkMonitor: false,

  // ── Hindsight (Bitrate Decision Analysis) ─────────────────────────────────

  /** Sampling denominator for hindsight analysis (0 = disabled) */
  hindsightDenominator: 0,

  /** Sampling denominator for hindsight debug logging */
  hindsightDebugDenominator: 0,

  /** Hindsight analysis parameters */
  hindsightParam: {
    /** Number of buckets */
    numB: Infinity,
    /** Bucket size (ms) */
    bSizeMs: 1000,
    /** Fill strategy for missing data */
    fillS: 'last',
    /** Fill half-life (ms) */
    fillHl: 1000,
  },

  // ── Branch & Seek ─────────────────────────────────────────────────────────

  /** Minimum time (ms) before making a branch decision */
  minimumTimeBeforeBranchDecision: 3000,

  /** Minimum time (ms) before performing a delayed seek to queued segment */
  minimumTimeBeforeDelayedSeekToQueuedSegment: 500,

  // ── Session History ───────────────────────────────────────────────────────

  /** Maximum number of session history entries to store */
  maxNumSessionHistoryStored: 30,

  /** Minimum session duration (ms) to be recorded in history */
  minSessionHistoryDuration: 300000,

  // ── DRM & Media Source ────────────────────────────────────────────────────

  /** Whether to wait for DRM initialization before appending media */
  waitForDrmToAppendMedia: false,

  /** Whether to force appending headers after DRM is ready */
  forceAppendHeadersAfterDrm: false,

  /** Whether initial key exchange is synchronous */
  initialKeyExchangeSync: true,

  /** Whether to start network monitoring on load start */
  startMonitorOnLoadStart: false,

  /** Internal flag for media source processing */
  mediaSourceFlag: false,

  /** Whether to append the first header only on download completion */
  appendFirstHeaderOnComplete: true,

  /** Minimum interval (ms) between probe requests */
  minProbeIntervalMs: 2000,

  // ── Playgraph & Content Transitions ───────────────────────────────────────

  /** Whether combined playgraphs are enabled (e.g. credits → next episode) */
  enableCombinedPlaygraphs: true,

  /** Whether playgraph ads are enabled */
  enablePlaygraphAds: true,

  /** Whether live ad playgraphs are enabled */
  enableLiveAdPlaygraphs: true,

  /** Whether to expose dropped ads to the UI layer */
  exposeDroppedAdsToUI: false,

  /** Whether live program playgraphs are enabled */
  enableLiveProgramPlaygraphs: false,

  /** Whether live program playgraphs are enabled for linear channels */
  enableLiveProgramPlaygraphsForLinear: true,

  /** Whether to retain source buffer references on fade transitions */
  retainSbrOnFade: false,

  /** Content IDs excluded from playgraph processing */
  excludedContentPlaygraphIds: [],

  /** Whether discontiguous buffering is enabled */
  enableDiscontiguousBuffering: false,

  /** Title IDs that force immediate transition type */
  forceImmediateTransitionTypeForTitles: [],

  /** Exit zone duration (ms) for forced immediate transitions */
  forceImmediateTransitionExitZone: 0,

  /** Whether to use buffer size limiter */
  useBufferSizeLimiter: false,

  /** Buffer negotiation disabled flag */
  bnd: false,

  // ── Audio Timestamp Offsets ───────────────────────────────────────────────

  /** Whether to apply per-profile timestamp offsets */
  applyProfileTimestampOffset: false,

  /** Default AAC audio timestamp offset */
  defaultAacTimestampOffset: DEFAULT_AAC_TIMESTAMP_OFFSET,

  /** Per-profile timestamp offsets by profile and bitrate */
  profileTimestampOffsets: PROFILE_TIMESTAMP_OFFSETS,

  /** Whether to apply per-profile streaming offsets */
  applyProfileStreamingOffset: false,

  /** Whether the MediaSource implementation supports negative PTS */
  mediaSourceSupportsNegativePts: false,

  // ── Download & Buffering Requirements ─────────────────────────────────────

  /** Whether download data is required during buffering */
  requireDownloadDataAtBuffering: false,

  /** Whether to require a connection setup during buffering */
  requireSetupConnectionDuringBuffering: false,

  // ── VMAF-Based Quality Selection ──────────────────────────────────────────

  /** Method for selecting starting video quality using VMAF */
  selectStartingVMAFMethod: 'fallback',

  /** Whether VMAF-based starting quality selection is active */
  activateSelectStartingVMAF: false,

  /** Minimum starting video VMAF score */
  minStartingVideoVMAF: 1,

  /** Minimum acceptable VMAF score during playback */
  minAcceptableVMAF: 1,

  /** Minimum allowed VMAF score (hard floor) */
  minAllowedVmaf: 1,

  /** Whether resolution-based VMAF stream filtering is enabled */
  enableResolutionVMAFStreamFilter: false,

  /** Rules for capping streams by resolution and VMAF */
  resolutionVMAFCappingRuleList: [],

  /** Percentage of titles subject to resolution-VMAF filtering */
  percentCapTitlesForResolutionVMAFStreamFilter: 100,

  // ── Concurrency ───────────────────────────────────────────────────────────

  /** Minimum window (ms) for streamable concurrency */
  minStreamableConcurrencyWindow: 3000,

  /** Factor for scaling streamable concurrency */
  streamableConcurrencyFactor: 0.3,

  /** Buffer level window (ms) for concurrent request decisions */
  bufferingConcurrencyWindow: 7800,

  // ── Live Streaming — Dynamic Bitrate Cap ──────────────────────────────────

  /** Whether to use probabilistic live bitrate dynamic cap */
  useProbabilisticLiveBitrateDynamicCap: configBase.useProbabilisticLiveBitrateDynamicCap[1],

  /** Whether to use live bitrate dynamic cap for DAI (Dynamic Ad Insertion) */
  useLiveBitrateDynamicCapForDai: configBase.useLiveBitrateDynamicCapForDai[1],

  /** Whether exit zones are used for transitions */
  useExitZones: true,

  // ── Per-Fragment VMAF ─────────────────────────────────────────────────────

  /** Configuration for per-fragment VMAF scoring */
  perFragmentVMAFConfig: {
    enabled: false,
    earlyManifestProcessing: false,
  },

  // ── Padding ───────────────────────────────────────────────────────────────

  /** Duration (ms) of padding content between segments */
  paddingDurationMs: 1000,

  /** Codec selection strategy for padding */
  paddingCodecSelector: 'flexible',

  /** Media type identifier for padding segments */
  paddingMediaType: 'padding',

  // ── Pipeline Health ───────────────────────────────────────────────────────

  /** Whether PTS-changed events are supported */
  supportsPtsChanged: false,

  /** Critical pipeline health threshold (ms) */
  pipelineHealthThresholdCriticalMs: 2000,

  /** Low pipeline health threshold (ms) */
  pipelineHealthThresholdLowMs: 6000,

  // ── Request Abandonment ───────────────────────────────────────────────────

  /** Whether slow-request abandonment is enabled */
  enableRequestAbandonment: false,

  /** Lock interval (ms) after abandoning a request */
  requestAbandonmentLockIntervalMs: 10000,

  // ── Stream Mode ───────────────────────────────────────────────────────────

  /** Threshold for attaching append operations in stream mode */
  streamModeAppendAttachThreshold: 0.75,

  // ── Live Streaming ────────────────────────────────────────────────────────

  /** Whether 504 error handling is enabled for live */
  enableLive504Handling: false,

  /** Whether to factor latency into live stream selection */
  liveStreamSelectorUseLatency: true,

  /** Latency multiplier for live bitrate calculations */
  latencyMultiplierForLive: 4,

  /** Buffer ratio strategy for live content */
  liveBufferRatioStrategy: 'strict',

  /** Whether to avoid selecting very low quality for live */
  liveLowQualityAvoidance: true,

  /** Bitrate threshold (kbps) considered low quality for live */
  liveLowQualityThreshold: 850,

  /** Multiplier applied to low-quality live stream penalty */
  liveLowQualityMultiplier: 6,

  /** Maximum live buffer target (ms; Infinity = no cap) */
  maxLiveBufferTarget: Infinity,

  /** Whether to enable conditional server time updates */
  enableConditionalServerTimeUpdate: false,

  /** Negligible difference threshold (ms) for server time delta */
  negligibleServerTimeDeltaDifference: 1000,

  /** Whether to switch streams on pipeline error for live */
  liveSwitchStreamsOnErrorInPipeline: true,

  /** Whether to replace missing segments in live streams */
  enableMissingSegmentsReplacement: true,

  /** Whether to simulate the live edge (for testing) */
  simulateLiveEdge: false,

  /** Whether live playback should account for play delay */
  liveShouldAccountForPlayDelay: false,

  /** Whether live content prefetching is enabled */
  livePrefetchEnabled: true,

  /** Whether live prefetching is enabled for sticky steering */
  livePrefetchEnabledForStickySteering: true,

  /** Minimum interval (ms) between OC side channel decryptions */
  decryptOCSideChannelMinInterval: 1000,

  /** Minimum interval (ms) after OC side channel is completed */
  decryptOCSideChannelMinIntervalAfterCompleted: 1000,

  /** Whether to periodically refresh live OC side channel */
  enableLiveOCSideChannelRefresh: true,

  /** Interval (ms) for live OC side channel refresh */
  liveOCSideChannelRefreshInterval: 30000,

  /** Spread (ms) applied to live requests for load balancing */
  liveRequestSpreadMs: 0,

  /** Whether two-part live fragment editing is enabled */
  enableTwoPartLiveFragmentEditing: true,

  /** Whether live buffer filling is slowed to reduce bandwidth */
  liveSlowBufferFilling: false,

  /** Probability (0–1) of sending early live requests */
  liveEarlyRequestProbability: 0,

  /** Default offset (ms) for early live requests */
  liveEarlyRequestDefaultOffsetMs: -500,

  /** Whether to support IDR frame mismatch in live streams */
  supportLiveIdrMismatch: true,

  /** Rate (0–N) of synthesized IDR mismatches for testing */
  synthesizeLiveIdrMismatch: 0,

  /** Whether ads are always retained in live playback */
  alwaysRetainAds: false,

  /** Whether media events tracking is enabled */
  enableMediaEventsTrack: true,

  /** Window (ms) for live ad manifest requests */
  liveAdManifestWindowMs: 10000,

  /** Allowance (ms) beyond the live ad manifest window */
  liveAdManifestWindowAllowanceMs: 5000,

  /** UX style for synthetic ad breaks (empty = none) */
  syntheticAdBreakUx: '',

  /** Whether media event history is enabled */
  enableMediaEventHistory: true,

  /** Whether live ad break reporting events are enabled */
  enableLiveAdBreakReportingEvents: true,

  /** Whether black-box notifications are enabled */
  enableBlackBoxNotification: true,

  /** Minimum presentation delay (ms) for live content */
  minimumPresentationDelayMs: 10000,

  /** Number of segments to skip from the live edge */
  liveEdgeSegmentSkipCount: 0,

  /** Whether to enforce segment availability at issue-request time for linear */
  linearEnforceSegmentAvailabilityWindowAtIssueRequest: true,

  /** Live edge cushion offset (ms) */
  liveEdgeCushionOffset: 0,

  // ── Branching Media Requests ──────────────────────────────────────────────

  /** Minimum video media request duration (ms) for branching content */
  minVideoMediaRequestDurationBranching: 0,

  /** Minimum video media request duration (ms) for variable-GOP content */
  minVideoMediaRequestDurationVariableGOP: 0,

  // ── Primary Server Switching ──────────────────────────────────────────────

  /** Whether to probe before switching back to primary CDN */
  probeBeforeSwitchingBackToPrimary: true,

  /** Minimum interval (ms) before switching back to primary CDN */
  minIntervalForSwitchingBackToPrimary: 60000,

  /** Maximum interval (ms) before switching back to primary CDN */
  maxIntervalForSwitchingBackToPrimary: 960000,

  // ── Presentation Delay Control (from configBase) ──────────────────────────

  /** Whether presentation delay control is enabled */
  enablePresentationDelayControl: configBase.enablePresentationDelayControl[1],

  /** Target presentation delay tolerance (ms) */
  targetPresentationDelayToleranceMs: configBase.targetPresentationDelayToleranceMs[1],

  /** QoE lock period (ms) for presentation delay */
  presentationDelayQoeLockPeriodMs: configBase.presentationDelayQoeLockPeriodMs[1],

  // ── Live Request Pacing (from configBase) ─────────────────────────────────

  /** Whether live request pacing is enabled */
  enableLiveRequestPacing: configBase.enableLiveRequestPacing[1],

  /** Center position (ms) for logarithmic request pacing curve */
  logarithmicRequestPacingCurveCenterPositionMs: configBase.logarithmicRequestPacingCurveCenterPositionMs[1],

  /** Sharpness of the logarithmic request pacing curve */
  logarithmicRequestPacingCurveSharpness: configBase.logarithmicRequestPacingCurveSharpness[1],

  /** Maximum live target buffer duration (ms) */
  maxLiveTargetBufferDurationMs: configBase.maxLiveTargetBufferDurationMs[1],

  /** Whether live bitrate dynamic cap is used */
  useLiveBitrateDynamicCap: configBase.useLiveBitrateDynamicCap[1],

  // ── SVOD Request Pacing ───────────────────────────────────────────────────

  /** Whether SVOD request pacing is enabled */
  enableSvodRequestPacing: false,

  /** Minimum SVOD target buffer duration (ms) */
  minSvodTargetBufferDurationMs: configBase.minSvodTargetBufferDurationMs[1],

  /** SVOD buffer growth rate slope */
  svodBufferGrowthRateSlope: configBase.svodBufferGrowthRateSlope[1],

  /** Live edge cushion with request spread (ms) */
  liveEdgeCushionWithSpreadMs: configBase.liveEdgeCushionWithSpreadMs[1],

  // ── CPR (Content Protection & Renewal) ────────────────────────────────────

  /** Whether CPR is enabled for video */
  enableCprVideo: false,

  /** Whether CPR is enabled for non-pipelined video */
  enableCprVideoNonPipelined: true,

  // ── Throughput History ────────────────────────────────────────────────────

  /** Whether initial throughput history seeding is enabled */
  enableInitialThroughputHistory: false,

  /** Whether active request count is fed into throughput filters */
  enableActiveRequestsInFilters: false,

  // ── LASER (Live Adaptive Streaming Engine Research) ───────────────────────

  /** Whether LASER experimentation mode is enabled */
  laser: configBase.laser[1],

  /** LASER event configuration */
  laserEvents: configBase.laserEvents[1],

  /** LASER session type identifier */
  laserSessionType: configBase.laserSessionType[1],

  /** LASER session description */
  laserSessionDescription: configBase.laserSessionDescription[1],

  /** LASER session name */
  laserSessionName: configBase.laserSessionName[1],

  /** LASER run identifier */
  laserRunId: configBase.laserRunId[1],
};

export default defaultAseConfig;
