# Netflix Cadmium Player vs dash.js

A technical comparison between Netflix's proprietary Cadmium player and the DASH Industry Forum's open-source dash.js reference player.

---

## Overview

| | Cadmium | dash.js |
|--|---------|---------|
| **Type** | Proprietary, production-grade | Open-source reference implementation |
| **Version** | v6.0055.939.911 | v5.2.0 |
| **Codebase** | ~708 deobfuscated ES2025 files (from 182K-line webpack bundle) | ~287 source files |
| **Standard** | Netflix-proprietary streaming protocol | MPEG-DASH compliant |
| **DI Framework** | InversifyJS (full IoC container) | FactoryMaker (custom lightweight factory) |
| **Design Pattern** | Playgraph (directed graph) | Event-driven pipeline with StreamProcessors |

---

## Architecture Comparison

### Cadmium: Playgraph-Based Architecture

Cadmium models all streaming as a **directed graph** (Playgraph):

```
Netflix Web UI
    ↓
VideoPlayer / PlaybackInstance (player/)
    ↓
ASE Integration Layer (streaming/)
    ├→ Manifest Fetch & Parse (manifest/, network/)
    ├→ DRM License Acquisition (drm/, msl/)
    ├→ ABR Stream Selection (abr/)
    ├→ Media Pipeline (streaming/, buffer/)
    │   ├→ HTTP Segment Downloads (network/)
    │   ├→ MP4 Parsing & Editing (mp4/)
    │   └→ MSE SourceBuffer Append (media/, buffer/)
    ├→ Subtitle Rendering (text/)
    ├→ Telemetry & Logging (telemetry/, monitoring/)
    └→ Ad Insertion (ads/)
```

- **Nodes** = segments (time-bounded content units)
- **Edges** = weighted branches (next-segment choices)
- **Weights** = probability for branch auto-selection (0–1 normalized)

This single abstraction handles ABR quality switching, ad insertion (`PlaygraphMerger`), and interactive branching (Bandersnatch) — no separate code paths needed.

### dash.js: Pipeline-Based Architecture

dash.js follows a traditional **event-driven pipeline** model:

```
MediaPlayer (facade)
    ↓
StreamController
    ├→ Stream (one per DASH period)
    │   └→ StreamProcessor (one per media type)
    │       ├→ ScheduleController (segment scheduling)
    │       ├→ FragmentController (download management)
    │       ├→ BufferController (MSE buffer ops)
    │       └→ RepresentationController (quality selection)
    ├→ AbrController (rule-based ABR)
    ├→ ProtectionController (DRM/EME)
    └→ ThroughputController (bandwidth measurement)
```

- Periods → AdaptationSets → Representations (standard DASH MPD hierarchy)
- Loose coupling via central `EventBus`
- Per-media-type `StreamProcessor` instances (video, audio, text)

---

## Key Differences

### 1. Adaptive Bitrate (ABR)

#### Cadmium: Multi-Signal Feasibility Simulation

Cadmium's ABR is a **multi-layer pipeline**:

```
Network Throughput Data
    ↓
Throughput Estimation Filters (5+ in parallel)
├→ Discrete EWMA
├→ Continuous EWMA (time-gap aware)
├→ Pausable EWMA (ignores idle periods)
├→ T-Digest (streaming quantile estimator)
└→ Stddev CI (standard deviation confidence interval)
    ↓
Stream Filtering (bitrate caps, DRM constraints, codec profiles)
    ↓
Stream Selection Algorithm
├→ Up/Down switch decision (hysteresis windows)
├→ Lock periods after downswitch
└→ Buffer-based feasibility simulation
    ↓
Selected Stream
```

Key files:
- `abr/StreamSelectionAlgorithm.js` — core decision logic with `refresh()` called every 200–500ms
- `abr/BufferBasedSelector.js` — simulates buffer behavior using **actual next segment sizes**
- `abr/InitialStreamSelector.js` — startup quality (VMAF-based or bitrate-curve-based)
- `abr/DecisionTree.js` — XGBoost ML model (145 features, 228 nodes) for prefetch prioritization

Oscillation prevention:
- `BitrateDirectionStateMachine` (NONE → INCREASING → DECREASING → DISABLED)
- `lockPeriodAfterDownswitch` — prevents immediate upswitch after downswitch
- `lowestBufForUpswitch` — minimum buffer level before considering upswitch
- `skipBitrateInUpswitch` — skip intermediate bitrates when buffer is healthy

#### dash.js: Rule-Based Voting

dash.js uses independent **ABR rules** that vote on quality:

| Rule | Strategy |
|------|----------|
| **BolaRule** | Buffer Occupancy-based Latency-Aware (min buffer = 10s) |
| **ThroughputRule** | Network throughput-based selection |
| **L2ARule** | Learning-based algorithm |
| **LoL+ Rule** | Low-latency streaming (target latency = 1.5s) |

Abandon fragment rules: `InsufficientBufferRule`, `AbandonRequestsRule`, `DroppedFramesRule`, `SwitchHistoryRule`

Rules return `SwitchRequest` objects with quality index and priority. `AbrController` aggregates and applies them.

**Key difference**: Cadmium simulates future buffer state with real segment sizes before switching. dash.js rules evaluate current state independently without forward simulation.

---

### 2. Security

#### Cadmium: MSL (Message Security Layer) + EME

Cadmium adds **application-layer encryption** on top of HTTPS:

```
MSL Message:
├── entityauthdata | mastertoken      ← device identity OR session token
├── headerdata (AES-CBC encrypted)    ← all control fields
│   ├── messageId (anti-replay)
│   ├── keyRequestData (key exchange)
│   ├── keyResponseData (session keys)
│   ├── userAuthData / userIdToken
│   ├── serviceTokens[] (license data)
│   └── capabilities
└── signature (HMAC-SHA256)           ← over headerdata
```

Key exchange flow:
```
Client                              Server
  │ Generate RSA key pair              │
  ├─ Send public key ────────────────→ │
  │                                    │
  │  Wrap AES + HMAC keys with RSA     │
  │←─ Send MasterToken ─────────────── │
  │                                    │
  └──── AES-128-CBC + HMAC session ────┘
```

Crypto stack: AES-128-CBC (encryption), HMAC-SHA256 (integrity), RSA (key exchange), SHA256withRSA (entity auth)

Token system:
- **Master Token** — session-level auth, ~12h expiry
- **User ID Token** — binds user identity to master token
- **Service Tokens** — carry app data (licenses, DRM payloads)

#### dash.js: Standard EME Only

dash.js relies on browser EME + HTTPS. No application-layer encryption. DRM handled via `ProtectionController` with retries:
- License request retries: 3, timeout: 8000ms
- Certificate request retries: 3, timeout: 8000ms
- Supports Widevine, PlayReady, FairPlay, ClearKey

**Key difference**: Cadmium protects against MITM even if TLS is compromised and detects tampering at the application level. dash.js trusts HTTPS entirely.

---

### 3. DRM

Both support the same three major DRM systems via EME:

| | Cadmium | dash.js |
|--|---------|---------|
| **Widevine** | Chrome, Android, Linux | Yes |
| **PlayReady** | Edge, Windows, Xbox | Yes |
| **FairPlay** | Safari, iOS, tvOS | Yes |
| **ClearKey** | Testing only | Legacy + W3C versions |
| **License caching** | MslTokenStore (1h expiry) | No built-in caching |
| **Session model** | `EmeSession` with state machine (UNKNOWN → CREATE → LICENSE → RENEWAL → CLOSED) | Multiple `ProtectionModel` versions (01b, 3Feb2014, Default) |
| **Key status tracking** | Full monitoring (usable, expired, output-not-allowed, output-downscaled) | Basic key status events |

---

### 4. Buffer Management

#### Cadmium

- `AsePlayerBuffer` — per-media-type buffer with DRM readiness detection
- `SourceBufferManager` — MSE SourceBuffer abstraction with JIT buffering
- `MediaSourceManager` — HTMLVideoElement integration, gap detection, rebuffer tracking
- `BufferHealthMonitor` — continuous health tracking with memory deadlock detection
- **Throttling**: `JustInTimeThrottler`, `BatchRequestThrottler`, `AppendPacer`
- **Memory protection**: Limits total buffered bytes to prevent OOM on constrained devices

#### dash.js

- `BufferController` — buffer state management (BUFFER_END_THRESHOLD = 0.5s)
- `SourceBufferSink` — append queue with quota exceeded handling (check interval: 50ms)
- Append window offsets: START = 0.1s, END = 0.01s
- Standard buffer pruning for old data

**Key difference**: Cadmium has dedicated throttlers and memory deadlock detection for constrained devices. dash.js has simpler pruning and quota handling.

---

### 5. Network & CDN

#### Cadmium

- `NetworkMonitor` — central throughput engine with pluggable filters
- `LocationSelector` — per-CDN throughput tracking via `EndpointActivity`
- CDN fallback chains with health-based switching
- ELLA (Enhanced Low-Latency ABR) integration
- `PboDispatcher` — Playback Optimization protocol for network hints
- `Sidechannel` — WebSocket for low-latency control channel
- Cross-session throughput persistence for warm-start

#### dash.js

- `ThroughputController` — measures from HTTP requests and media segments
- Uses browser Performance API
- `SchemeLoaderFactory` — pluggable loader architecture (HTTP, HTTPS, custom)
- Supports both XHR and Fetch APIs
- CDN selection delegated to manifest/server side

**Key difference**: Cadmium actively selects and switches CDNs based on per-endpoint health metrics. dash.js relies on server-side CDN decisions.

---

### 6. Content Model

| Feature | Cadmium | dash.js |
|---------|---------|---------|
| **ABR quality tiers** | Graph branches with weights | AdaptationSet → Representations |
| **Ad insertion** | `PlaygraphMerger` merges ad playgraph at time boundaries | Not built-in (external VAST/VMAP) |
| **Interactive branching** | `BranchingSegmentManager` with seamless/seek-based transitions | Not supported |
| **Live streaming** | Edge tracking, slate detection, dynamic manifest merging | Period preloading, live latency management |
| **Multi-period** | Playgraph handles transitions | `StreamController` manages period switching |
| **Offline playback** | Not present | `OfflineController` with IndexedDB storage |

---

### 7. Telemetry & Monitoring

#### Cadmium

- ~320 enumerated error codes
- Debug overlay (`PlayerInfoOverlay`) showing real-time stats
- Session trace-to-server for problematic sessions
- QoE metrics: play delay, buffering events, bitrate switches, dropped frames
- Per-CDN network metrics

#### dash.js

- `MetricsReporting` with pluggable handlers and reporters
- DVBErrorsTranslator for standards-compliant error reporting
- Throughput and buffer occupancy tracking
- `DroppedFramesHistory` for playback quality detection

---

## Where Cadmium Excels Over dash.js

### 1. ABR Quality & Stability

Cadmium runs **5+ throughput estimation filters in parallel** and combines them into a composite estimate with confidence weighting. Before switching bitrate, it runs a **buffer-based feasibility simulation** using actual upcoming segment sizes to verify no rebuffering will occur. dash.js uses simpler individual rules that vote independently without forward simulation.

### 2. Bitrate Oscillation Prevention

Cadmium has a dedicated `BitrateDirectionStateMachine` plus hysteresis mechanisms: lock periods after downswitches, minimum buffer thresholds for upswitches, and intermediate bitrate skipping. dash.js has `SwitchHistoryRule` but lacks the same depth of oscillation control.

### 3. Unified Content Graph (Playgraph)

ABR quality tiers, ad insertion, and interactive branching are **weighted edges in a single directed graph**. Ad insertion is just a graph merge. Interactive choices are just branch weights. dash.js handles these as separate concepts with distinct code paths (and lacks interactive support entirely).

### 4. Application-Layer Security (MSL)

Full encryption/signing layer on top of HTTPS — RSA key exchange, AES-128-CBC session encryption, HMAC-SHA256 message authentication, anti-replay message IDs, and token lifecycle management. Protects against MITM even if TLS is compromised.

### 5. CDN Intelligence

Built-in per-CDN throughput tracking, health-based CDN switching with fallback chains, and ELLA integration. dash.js delegates CDN selection to the server side.

### 6. ML-Powered Prefetch

XGBoost decision tree (145 features, 228 nodes) for predicting which content to buffer while users browse the Netflix UI — before they even hit play. dash.js has no equivalent predictive prefetching.

### 7. Memory & Device Optimization

`JustInTimeThrottler`, `BatchRequestThrottler`, `AppendPacer`, and `BufferHealthMonitor` with memory deadlock detection — all designed to prevent OOM on constrained devices (mobile, smart TVs, set-top boxes).

---

## Where dash.js Has Advantages

### 1. Open Standard & Interoperability

dash.js implements the MPEG-DASH standard and works with any DASH-compliant server. Cadmium is tightly coupled to Netflix's infrastructure (MSL, Open Connect CDN, ELLA).

### 2. Pluggable & Extensible

Custom ABR rules, custom scheme loaders, custom protection models, custom metric reporters — all via clean extension points. Cadmium is optimized for one use case.

### 3. Offline Support

Built-in `OfflineController` with IndexedDB storage for download-and-playback. Not present in Cadmium's web player codebase.

### 4. Low-Latency Streaming

Dedicated LoL+ rule with learning-based ABR (`LearningAbrController`) and QoE evaluation specifically for low-latency live streaming. Cadmium's live support is more focused on Netflix's specific live event needs.

### 5. Multi-EME Version Support

Handles legacy webkit-prefixed EME APIs (`ProtectionModel_01b`), transition APIs (`ProtectionModel_3Feb2014`), and modern standard APIs — broader browser compatibility.

### 6. Microsoft Smooth Streaming

Built-in MSS (Microsoft Smooth Streaming) support for legacy content. Cadmium is DASH/Netflix-proprietary only.

---

## Summary

| Dimension | Winner | Why |
|-----------|--------|-----|
| ABR sophistication | **Cadmium** | Multi-filter estimation + feasibility simulation |
| Oscillation prevention | **Cadmium** | State machine + hysteresis + lock periods |
| Security | **Cadmium** | MSL app-layer encryption on top of HTTPS |
| CDN selection | **Cadmium** | Per-endpoint health tracking + ELLA |
| Prefetch intelligence | **Cadmium** | XGBoost ML model |
| Memory management | **Cadmium** | JIT throttling + deadlock detection |
| Content model flexibility | **Cadmium** | Playgraph unifies ABR/ads/branching |
| Interoperability | **dash.js** | MPEG-DASH standard, works with any server |
| Extensibility | **dash.js** | Pluggable rules, loaders, reporters |
| Offline support | **dash.js** | Built-in IndexedDB offline controller |
| Low-latency live | **dash.js** | LoL+ with learning-based ABR |
| Browser compatibility | **dash.js** | Multi-EME version support |

Cadmium is a deeply optimized, vertically-integrated player built for Netflix's specific infrastructure. dash.js is a flexible, standards-compliant reference implementation for general-purpose DASH streaming. Cadmium's advantages come from tight backend integration, sophisticated multi-signal ABR, and the Playgraph abstraction that unifies multiple streaming concerns into one data structure.
