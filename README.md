# Netflix Cadmium Player (Partially Deobfuscated)

Partially deobfuscated source of Netflix's **Cadmium** streaming player (`cadmium-playercore v6.0055.939.911`), reverse-engineered by [Claude Opus 4.6](https://claude.ai).

The original obfuscated webpack bundle has been split into **706 ES2025 files** across **32 domain directories**, plus **187 extracted webpack module stubs** in `modules/`. Descriptive naming, proper class syntax, and JSDoc documentation have been applied where possible.

**Deobfuscation status:** ~130 `internal_` identifiers have been resolved to meaningful names, but ~301 remain unresolved. 310 broken imports were fixed. 187 webpack modules were extracted from the bundle. This is a work in progress — significant portions of the codebase still contain opaque naming and unresolved references.

## Architecture

Netflix's Cadmium player is a sophisticated adaptive streaming engine built on:

- **Media Source Extensions (MSE)** for video/audio buffering
- **Encrypted Media Extensions (EME)** for DRM (Widevine, PlayReady, FairPlay)
- **Message Security Layer (MSL)** for authenticated/encrypted API communication
- **InversifyJS** for dependency injection
- **Playgraph** data structure for content timeline modeling (supports interactive/branching content like Bandersnatch)

### Data Flow

```
UI Layer (Netflix Web App)
    │
    v
VideoPlayer / PlaybackInstance  (player/)
    │
    v
ASE Integration Layer  (streaming/)
    │
    ├──> Manifest Fetch & Parse  (manifest/, network/)
    ├──> DRM License Acquisition  (drm/, msl/)
    ├──> ABR Stream Selection  (abr/)
    ├──> Media Pipeline  (streaming/, buffer/)
    │       ├──> HTTP Segment Downloads  (network/)
    │       ├──> MP4 Parsing & Editing  (mp4/)
    │       └──> MSE Source Buffer Append  (media/, buffer/)
    │
    ├──> Subtitle Rendering  (text/)
    ├──> Telemetry & Logging  (telemetry/, monitoring/)
    └──> Ad Insertion (DAI)  (ads/)
```

## Directory Structure

| Directory | Files | Description |
|-----------|------:|-------------|
| `abr/` | 34 | Adaptive bitrate selection ([deep dive](docs/adaptive-bitrate.md)) |
| `ads/` | 16 | Dynamic ad insertion (DAI) |
| `ase/` | 14 | ASE engine internals (throughput estimators, delivery distribution) |
| `buffer/` | 11 | MSE buffer management and health monitoring |
| `core/` | 66 | Central infrastructure (~320 error codes, ~535 config properties, engine singleton) |
| `crypto/` | 27 | Cryptography (AES, RSA, DER/ASN.1, WebCrypto) |
| `drm/` | 48 | DRM stack (Widevine, PlayReady, FairPlay via EME) |
| `ella/` | 6 | Ella low-latency CDN selection |
| `events/` | 19 | Event system (pub/sub, observables, signals) |
| `live/` | 9 | Live streaming (edge tracking, slate detection) |
| `manifest/` | 12 | Manifest fetch, parse, and transformation |
| `media/` | 28 | MSE integration (`<video>` + SourceBuffer management) |
| `monitoring/` | 20 | Debug overlay, logging, dropped frame handling |
| `mp4/` | 27 | ISO BMFF / MP4 box parsing and editing |
| `msl/` | 24 | Message Security Layer protocol |
| `network/` | 41 | HTTP/WebSocket transport, segment downloads, PBO dispatch |
| `player/` | 27 | Player interface (PlaybackInstance, VideoPlayer API) |
| `streaming/` | 91 | Streaming pipeline (branches, tracks, fragments, caching) |
| `telemetry/` | 22 | Analytics and QoE telemetry |
| `text/` | 16 | Subtitles and captions (TTML, scheduling, rendering) |
| `timing/` | 9 | Clock-synced scheduling, rational time arithmetic |
| `utils/` | 44 | Platform globals, type checks, DOM helpers |
| `symbols/` | 52 | DI injection tokens |
| `ioc/` | 16 | IoC container and bindings |
| `di/` | 3 | DI container core |
| `msg/` | 5 | MSL message protocol |
| `diagnostics/` | 4 | Session diagnostics |
| `prefetch/` | 3 | Background prefetching |
| `assert/` | 4 | Assertion utilities |
| `types/` | 3 | Media type enums (AUDIO/VIDEO/TIMED_TEXT/SUPPLEMENTARY) |
| `config/` | 2 | Configuration |
| `classes/` | 3 | Legacy classes |
| `modules/` | 187 | Extracted webpack module stubs (partially resolved) |

## Key Components

**PlaybackInstance** (`player/PlaybackInstance.js`) — Main orchestrator (3,900+ lines). Manages the entire playback lifecycle from loading through teardown.

**ASE Engine** (`core/AsejsEngine.js`) — Adaptive Streaming Engine singleton. Coordinates playgraphs, sessions, network monitoring, and buffer management.

**MSL Protocol** (`msl/`) — Netflix's custom Message Security Layer for authenticated, encrypted client-server communication with master token management and key exchange.

**DRM Stack** (`drm/`) — Complete EME integration: Widevine (Chrome/Android), PlayReady (Edge/Windows), FairPlay (Safari/iOS).

## Documentation

- [Adaptive Bitrate (ABR) Deep Dive](docs/adaptive-bitrate.md) — Throughput estimation, stream selection algorithm, startup logic, ML decision tree
- [MSL (Message Security Layer)](docs/msl-message-security-layer.md) — Netflix's custom encrypted messaging protocol: message format, token system, RSA key exchange, AES-CBC encryption, DRM license flow
- [Playgraph Data Structures](docs/playgraph-data-structures.md) — Directed graph content engine: segments, weighted branches, ABR switches, ad insertion, interactive branching (Bandersnatch), live streaming
- [XGBoost Prefetch Prioritization Model](docs/xgboost-prefetch-model.md) — 145-feature ML decision tree for predicting which titles to prefetch based on real-time browse behavior
- [BTS Live Stream Investigation](docs/bts-live-investigation.md) — Captured manifest/playapi responses, bitrate ladder, CDN infrastructure, segment templates
- [Cadmium vs dash.js](docs/cadmium-vs-dashjs.md) — Technical comparison of Netflix's proprietary Cadmium player and the open-source dash.js reference implementation: architecture, ABR, security, DRM, buffer management, CDN intelligence

## Version

- **Player Core:** `cadmium-playercore v6.0055.939.911`
- **Deobfuscation Date:** March 2026

## Disclaimer

This repository is for **educational and research purposes only**. The code is the intellectual property of Netflix, Inc. This deobfuscation was performed for the purpose of understanding streaming technology architecture.
