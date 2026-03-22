# Netflix Cadmium Player (Deobfuscated)

Reverse-engineered and deobfuscated source code of Netflix's **Cadmium** streaming player (`cadmium-playercore v6.0055.939.911`).

The original obfuscated webpack bundle has been fully deobfuscated into **707 ES2025 files** across **32 domain directories**, with descriptive naming, proper class syntax, and JSDoc documentation throughout.

## Architecture Overview

Netflix's Cadmium player is a sophisticated adaptive streaming engine built on:

- **Media Source Extensions (MSE)** for video/audio buffering
- **Encrypted Media Extensions (EME)** for DRM (Widevine, PlayReady, FairPlay)
- **Message Security Layer (MSL)** for authenticated/encrypted API communication
- **InversifyJS** for dependency injection
- **Playgraph** data structure for content timeline modeling (supports interactive/branching content like Bandersnatch)

### High-Level Data Flow

```
UI Layer (Netflix Web App)
    |
    v
VideoPlayer / PlaybackInstance  (player/)
    |
    v
ASE Integration Layer  (streaming/)
    |
    +---> Manifest Fetch & Parse  (manifest/, network/)
    +---> DRM License Acquisition  (drm/, msl/)
    +---> ABR Stream Selection  (abr/)
    +---> Media Pipeline  (streaming/, buffer/)
    |         |
    |         +---> HTTP Segment Downloads  (network/)
    |         +---> MP4 Parsing & Editing  (mp4/)
    |         +---> MSE Source Buffer Append  (media/, buffer/)
    |
    +---> Subtitle Rendering  (text/)
    +---> Telemetry & Logging  (telemetry/, monitoring/)
    +---> Ad Insertion (DAI)  (ads/)
```

## Directory Structure

```
.
├── abr/            (34)  Adaptive Bitrate
│   ├── DecisionTree.js          ML decision tree (XGBoost, 145 features)
│   ├── StreamSelectionAlgorithm.js  Core quality selection with buffer simulation
│   ├── InitialStreamSelector.js     VMAF + bitrate-curve startup selection
│   ├── DefaultAseConfig.js          400+ tunable ABR parameters
│   └── ...
│
├── ads/            (16)  Ad Insertion
│   ├── PlayerAdManager.js       Ad lifecycle management
│   ├── DaiPrefetcher.js         Dynamic Ad Insertion prefetching
│   ├── AdPresentationModels.js  10 ad view model classes
│   └── ...
│
├── ase/            (14)  ASE Engine Internals
│   ├── DeliveryDistribution.js  Throughput distribution estimator
│   ├── ThroughputEstimators.js  EWMA family filters
│   ├── LiveRequestManager.js    Live segment request timing
│   └── ...
│
├── buffer/         (11)  Buffer Management
│   ├── SourceBufferManager.js   MSE SourceBuffer append pipeline
│   ├── BufferingStateTracker.js Buffering lifecycle management
│   ├── BufferSizeLimiter.js     Memory budget enforcement
│   ├── BufferHealthMonitor.js   EMPTY/CRITICAL/LOW/HEALTHY states
│   └── ...
│
├── core/           (66)  Core Infrastructure
│   ├── ErrorCodes.js            400+ error codes & event types
│   ├── PlayerConfig.js          700+ configuration properties
│   ├── NfError.js               Structured error class
│   ├── AsejsEngine.js           Central ASE orchestrator (singleton)
│   ├── PlayerConstants.js       Codec MIME types, DRM UUIDs, MP4 FourCCs
│   └── ...
│
├── crypto/         (27)  Cryptography
│   ├── DerKeyUtils.js           ASN.1/DER encoding, RSA key conversion
│   ├── WebCryptoWrapper.js      WebCrypto API abstraction
│   ├── AES_CBC_HS256_Cipher.js  AES-CBC + HMAC-SHA256
│   ├── AleClient.js             Application Level Encryption
│   └── ...
│
├── drm/            (48)  Digital Rights Management
│   ├── EmeSession.js            EME session lifecycle (create/license/renew/close)
│   ├── PlayReadyCapabilityDetector.js  PlayReady feature probing
│   ├── MediaCapabilityDetector.js      Media Capabilities API
│   ├── LicenseBroker.js         License acquisition & caching
│   ├── KeySystemAccessWrapper.js       MediaKeySystemAccess wrapper
│   └── ...
│
├── ella/           (6)   Ella CDN Selection
│   ├── EllaManager.js           Ella low-latency CDN coordinator
│   └── ...
│
├── events/         (19)  Event System
│   ├── EventEmitter.js          Pub/sub event handling
│   ├── Observable.js            Reactive value with subscribers
│   ├── Signal.js                Reactive Signal containers
│   └── ...
│
├── live/           (9)   Live Streaming
│   ├── LivePlaybackManager.js   Live edge tracking, slate detection
│   ├── LivePipeline.js          Live pipeline with ELLA integration
│   ├── LiveNormalizedBranch.js  Live branch with IDR handling
│   └── ...
│
├── manifest/       (12)  Manifest Processing
│   ├── ManifestTransformer.js   Full manifest-to-model transformation
│   ├── ManifestEndpointCommand.js  Manifest fetch via MSL
│   ├── AudioTrackParser.js      Audio track parsing & filtering
│   └── ...
│
├── media/          (28)  Media Source Extensions
│   ├── MediaSourceElement.js    <video> + MSE wrapper
│   ├── MediaSourceManager.js    Media presenter (play/pause/seek)
│   ├── SourceBuffer.js          MSE SourceBuffer with codec switching
│   ├── MediaSplicer.js          Fragment editing pipeline
│   └── ...
│
├── monitoring/     (20)  Debug & Monitoring
│   ├── DebugLogConsole.js       In-browser debug overlay
│   ├── Logger.js                Core logging with sink dispatch
│   ├── DroppedFrameFilter.js    Resolution restriction on frame drops
│   └── ...
│
├── mp4/            (27)  ISO BMFF / MP4 Parsing
│   ├── BoxParserRegistry.js     Complete MP4 box parser registry
│   ├── AudioMediaFragmentEditor.js  Audio fade-in/fade-out
│   ├── TrackRunBox.js           'trun' box parser/editor
│   ├── FragmentIndex.js         Fragment duration/size arrays
│   └── ...
│
├── msl/            (24)  Message Security Layer
│   ├── MslControl.js            Core MSL controller (12 classes, 2300 lines)
│   ├── MslTokenStore.js         Master/user/service token management
│   ├── MessageInputStream.js    Message parsing & decryption
│   ├── MasterToken.js           Session token with key management
│   └── ...
│
├── network/        (41)  Network Layer
│   ├── PboDispatcher.js         PBO command dispatch (WebSocket + HTTP)
│   ├── AseMediaRequest.js       Media segment HTTP requests
│   ├── HttpClient.js            XHR-based media downloader
│   ├── HttpRequestWrapper.js    Request lifecycle with retry/backoff
│   └── ...
│
├── player/         (27)  Player Interface
│   ├── PlaybackInstance.js      Main orchestrator (3900+ lines)
│   ├── VideoPlayer.js           Public player API facade
│   ├── HlsVideoPlayer.js       Native HLS player (Safari/iOS)
│   ├── PlayerEvents.js          9 event enums, 40+ events
│   ├── PlayerInfoOverlay.js     Ctrl+Alt+Shift+Q debug overlay
│   └── ...
│
├── streaming/      (91)  Streaming Pipeline
│   ├── AseIntegration.js        Bridge between player state and ASE
│   ├── BranchCollectionManager.js  Pipeline branch lifecycle
│   ├── MediaRequestPipeline.js  Per-media-type request pipeline
│   ├── MediaPipeline.js         Base media pipeline class
│   ├── ManifestCache.js         Two-tier cache with leases
│   ├── ManifestSchemaMapper.js  Wire-format property mapping
│   ├── NormalizedBranch.js      Pipeline branch coordinator
│   ├── AseTrack.js              Base streaming track class
│   ├── AseStream.js             Stream rendition (bitrate/profile)
│   ├── MediaFragment.js         Single media segment
│   ├── QueueIterator.js         Async iterable queue
│   └── ...
│
├── telemetry/      (22)  Telemetry & Analytics
│   ├── LogblobBuilder.js        Central telemetry payload builder
│   ├── MilestonesEventBuilder.js  Play-delay QoE milestones
│   ├── PlayDataManager.js       Session telemetry dispatch
│   └── ...
│
├── text/           (16)  Subtitles & Captions
│   ├── SubtitleScheduler.js     Cue lifecycle (stage/show/remove)
│   ├── SubtitleDownloader.js    Timed text track manager
│   ├── TimedTextRenderer.js     Caption DOM renderer
│   ├── TtmlParser.js            TTML subtitle parser
│   └── ...
│
├── timing/         (9)   Timing & Scheduling
│   ├── RootTaskScheduler.js     Clock-synced task scheduler
│   ├── TimeUnits.js             Microsecond-to-hour hierarchy
│   ├── TimeUtil.js              Rational time arithmetic
│   └── ...
│
├── types/          (3)   Type Definitions
│   ├── MediaType.js             AUDIO/VIDEO/TIMED_TEXT/SUPPLEMENTARY
│   └── ...
│
├── utils/          (44)  Utilities
│   ├── ObjectUtils.js           Property manipulation helpers
│   ├── PlatformGlobals.js       Browser API references
│   ├── TypeChecks.js            Runtime type validation
│   ├── DomHelpers.js            DOM/browser utilities
│   ├── TsLibHelpers.js          TypeScript runtime helpers
│   └── ...
│
├── symbols/        (52)  DI Injection Tokens
├── ioc/            (16)  IoC Container & Bindings
├── di/             (3)   DI Container Core
├── msg/            (5)   MSL Message Protocol
├── diagnostics/    (4)   Session Diagnostics
├── prefetch/       (3)   Background Prefetching
├── assert/         (4)   Assertion Utilities
├── config/         (2)   Configuration
└── classes/        (3)   Legacy Classes
```

## Key Components

### PlaybackInstance (`player/PlaybackInstance.js`)
The main orchestrator (3,900+ lines). Manages the entire playback lifecycle: loading, authorization, manifest fetching, ASE streaming session integration, media source management, track selection, seeking, ad insertion, subtitle rendering, and teardown.

### ASE Engine (`core/AsejsEngine.js`)
The Adaptive Streaming Engine singleton. Manages playgraphs (content timeline graphs), viewable sessions, player instances, and coordinates network monitoring, buffer limiting, task scheduling, and event processing.

### MSL Protocol (`msl/`)
Netflix's custom Message Security Layer for authenticated, encrypted client-server communication. Implements master token management, key exchange (RSA, Diffie-Hellman, pre-shared keys), message signing/verification, and payload encryption.

### DRM Stack (`drm/`)
Complete EME integration supporting three DRM schemes:
- **Widevine** (Chrome, Android) — Standard W3C EME adapter
- **PlayReady** (Edge, Windows) — Dual-session renewal, MS-specific capability detection
- **FairPlay** (Safari, iOS) — Custom PSSH building, JSON response mapping

---

## How ABR (Adaptive Bitrate) Works

Netflix's ABR system is one of the most sophisticated in the industry. It operates as a multi-layered pipeline that continuously selects the optimal video/audio quality based on network conditions, buffer state, device capabilities, and even ML predictions.

### ABR Architecture

```
                     ┌──────────────────────────────┐
                     │     Throughput Estimation     │
                     │  (EWMA, TDigest, Stddev CI)  │
                     └──────────┬───────────────────┘
                                │
                                v
┌─────────────┐    ┌────────────────────────┐    ┌──────────────────┐
│  Stream     │───>│  Stream Selection      │───>│  Buffer-Based    │
│  Filtering  │    │  Algorithm (refresh)   │    │  Feasibility     │
│             │    │                        │    │  Simulation      │
└─────────────┘    └────────────────────────┘    └──────────────────┘
       │                      │                          │
       v                      v                          v
  Bitrate caps          Up/Down switch            Can this bitrate
  DRM constraints       Hysteresis windows        sustain without
  Profile filters       Lock periods              rebuffering?
```

### Key ABR Files

| File | Purpose |
|------|---------|
| `abr/StreamSelectionAlgorithm.js` | Core quality selection — the `refresh()` function |
| `abr/BufferBasedSelector.js` | Buffer simulation to test if a candidate stream is feasible |
| `abr/InitialStreamSelector.js` | First rendition selection (startup) |
| `abr/InitialBitrateSelector.js` | Bitrate-curve-based startup selection |
| `abr/DecisionTree.js` | XGBoost ML model for prefetch prioritization |
| `abr/DefaultAseConfig.js` | 400+ tunable ABR parameters |
| `abr/StreamSelectionRefresh.js` | Periodic ABR refresh with throughput augmentation |
| `abr/BandwidthAllocator.js` | Audio/video bandwidth split with margin curves |
| `abr/BandwidthConfidence.js` | Confidence factor (0-1) based on download progress |
| `abr/AggregatingFilter.js` | Sliding window throughput smoothing |
| `abr/StddevPredictor.js` | Standard deviation-based throughput prediction |
| `abr/BitrateDirectionStateMachine.js` | Tracks NONE/INCREASING/DECREASING/DISABLED |
| `ase/ThroughputEstimators.js` | EWMA family filters (discrete, continuous, pausable) |
| `ase/DeliveryDistribution.js` | Exponentially-weighted throughput distribution |

### Steady-State ABR: The `refresh()` Loop

The core ABR loop runs in `StreamSelectionAlgorithm.js` via the `refresh()` function. Here's how it works:

#### 1. Gather State
```
- Current stream (the quality we're playing now)
- Sorted stream list (all available qualities, lowest to highest bitrate)
- Buffer state: playback position, download position, buffer ahead (ms)
- Playback rate (1x, 1.5x, 2x, etc.)
- Partial block size (bytes already downloaded for in-progress segment)
```

#### 2. Build Simulation Windows
For each candidate stream, compute how long to simulate buffer fill:

- **Variable strategy**: Duration computed from buffer fill ratio
  ```
  if bufferFillRatio <= 1: use maxSimulationDuration
  else: scale between min and max based on how full the buffer is
  ```
- **Fixed strategy**: Use configured retention/transition windows
  - Streams below current: `highStreamRetentionWindowDown` / `lowStreamTransitionWindowDown`
  - Current stream: `highStreamRetentionWindow` / `lowStreamTransitionWindow`
  - Streams above current: `highStreamRetentionWindowUp` / `lowStreamTransitionWindowUp`

#### 3. Build Lazy Feasibility Tests
For each candidate stream, create a test function that:
1. **Quick rejection**: Skip if previous candidate already failed with better throughput
2. **Segment bitrate check**: Reject if next segment exceeds `maxSegmentBitrate`
3. **Fast path**: If buffer already exceeds `bitrate * playbackRate * switchFactor`, accept immediately
4. **Full simulation**: Run `simulateFeasibility()` — builds a combined fragment list from primary and secondary segments, then delegates to the buffer simulator

#### 4. Decision Logic
```
if currentStream is feasible:
    // Try to UPSWITCH
    if buffer > lowestBufForUpswitch AND
       not in downswitch lock period AND
       buffer > lowWatermarkLevel:
        → Find highest feasible stream above current
else:
    // Must DOWNSWITCH
    → Find highest feasible stream below current
    → Fall back to lowest stream if none feasible
```

#### 5. Hysteresis & Lock Periods
To prevent oscillation:
- **`lockPeriodAfterDownswitch`**: After downswitching, don't allow upswitch for N ms
- **`lowestBufForUpswitch`**: Minimum buffer level (ms) before considering upswitch
- **`skipBitrateInUpswitch`**: When enabled and buffer is healthy, allow skipping intermediate bitrates

### Throughput Estimation

Netflix uses multiple parallel throughput estimators in `ase/ThroughputEstimators.js`:

| Estimator | Type | Description |
|-----------|------|-------------|
| **Discrete EWMA** | `ewma` | Exponentially-weighted moving average on per-segment throughput |
| **Continuous EWMA** | `cewma` | EWMA that accounts for inter-sample time gaps |
| **Pausable EWMA** | `pewma` | EWMA that pauses during non-download periods |
| **TDigest** | `tdigest` | Streaming quantile estimator for throughput percentiles |
| **Stddev CI** | `stddev` | Mean ± k*stddev confidence interval predictor |

The `BandwidthConfidence` module produces a 0-1 confidence factor based on how much data has been downloaded vs. the target buffer, used to weight throughput estimates.

---

## First Rendition Selection (Startup Logic)

When playback starts, Netflix doesn't have real-time throughput data yet. The initial stream selection uses a different algorithm from steady-state ABR.

### Entry Point: `InitialStreamSelector.js`

The `selectInitialStream()` function chooses the starting quality using one of two strategies:

### Strategy 1: VMAF-Based Selection (when `activateSelectStartingVMAF` is enabled)

```
for each stream from HIGHEST to LOWEST quality:
    1. Look up the stream's VMAF score
    2. Compute a "delay target" from estimated throughput:
       - logarithmic method:  delay = a * ln(throughput) + b
       - sigmoid method:      delay = L / (1 + e^(-k*(throughput - x0)))
    3. If VMAF score >= delay target → select this stream
```

This means: "Pick the highest quality where the estimated play delay (buffering time) is acceptable given the predicted VMAF quality gain."

### Strategy 2: Bitrate-Based Selection (default)

```
1. Estimate historical throughput:
   - From TDigest quantile (preferred)
   - Or from raw buffer length / bitrate ratio

2. Apply safety margin:
   throughputBudget = historicalThroughput * safetyMarginPercent

3. Walk the bitrate selection curve:
   - The curve maps throughput → max allowed bitrate
   - Uses linear interpolation between configured points
   - Two curves available:
     a. Default: videoBitrateSelectionCurve
     b. In-session: inSessionVideoBitrateSelectionCurve
        (used after inSessionThroughputSampleThreshold samples)

4. Find highest stream where:
   - bitrate <= interpolated max from curve
   - bitrate >= minInitVideoBitrate (default: 560 kbps)
   - bitrate <= maxInitAudioBitrate (for audio)
   - stream passes DRM/profile/resolution constraints
```

### Bitrate Selection Curve

The curve is defined as an array of `[throughput_kbps, max_bitrate_kbps]` points:

```javascript
// Example from DefaultAseConfig.js
videoBitrateSelectionCurve: [
    [300,   200],    // At 300 kbps throughput → allow up to 200 kbps video
    [600,   400],    // At 600 kbps → 400 kbps
    [1000,  750],    // At 1 Mbps → 750 kbps
    [2000,  1500],   // At 2 Mbps → 1.5 Mbps
    [4000,  3000],   // At 4 Mbps → 3 Mbps
    [8000,  5800],   // At 8 Mbps → 5.8 Mbps
    [20000, 16000],  // At 20 Mbps → 16 Mbps
]
// Linear interpolation between points
```

### Stream Validation

Before accepting a candidate, `validateInitialStreamCandidate()` checks:

1. **Min bitrate**: `stream.bitrate >= minInitVideoBitrate`
2. **Max bitrate limits**: Per-profile overrides (e.g., audio may have different caps)
3. **DRM constraints**: Stream must be playable under current key system
4. **Resolution limits**: Device/HDCP may restrict to 1080p or lower
5. **Codec support**: Device must support the stream's codec profile
6. **Fragment index**: Stream must have parsed header data available

### ABR ML Decision Tree (`abr/DecisionTree.js`)

Netflix also uses an XGBoost-trained decision tree model with **145 features** for predicting user engagement, primarily used for **prefetch prioritization** (which titles to pre-buffer in the browse UI):

**Feature categories:**
- **Session metrics** (indices 0-10): `maxColIndex`, `avgColIndex`, `maxRowIndex`, `avgRowIndex`, `sessionDuration`, scroll counts (up/down/left/right), page dimensions
- **UI layout categoricals** (11-26): 16 visibility/trigger/content type features
- **Region flags** (27-49): 23 geographic/content region indicators
- **Grid cells** (50-128): 79 positional features from a 100x75 grid divided into 20x15 cells
- **Row context sizes** (129-144): Continue Watching count, Recently Added, Trending Now, Because You Watched, New Releases, etc.

The tree evaluates these features to produce a leaf value (engagement probability), which determines prefetch priority for content tiles the user hasn't scrolled to yet.

---

## Version

- **Player Core:** `cadmium-playercore v6.0055.939.911`
- **Deobfuscation Date:** March 2026

## Disclaimer

This repository is for **educational and research purposes only**. The code is the intellectual property of Netflix, Inc. This deobfuscation was performed for the purpose of understanding streaming technology architecture.
