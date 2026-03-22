# Netflix BTS Live Stream — Behind the Scenes Investigation

Investigation of Netflix's live streaming infrastructure captured during a BTS live event on **2026-03-21**, by setting a breakpoint at `C = x.dea.create(D)` in the obfuscated Cadmium player (`cadmium-playercore-6.0055.939.911.js`).

Two key API responses were intercepted:
- [**manifest**](bts-live-manifest.json) — The streaming manifest (returned by the manifest endpoint)
- [**playapi**](bts-live-playapi.json) — The PlayAPI response (wraps the manifest with session metadata)

## Content Metadata

| Field | Value |
|-------|-------|
| **movieId** | `82157128` |
| **streamingType** | `LIVE` |
| **viewableType** | `MOVIE` |
| **drmType** | `widevine` |
| **manifestVersion** | `v2` |
| **isBranching** | `false` |
| **eventStartTime** | `2026-03-21T10:59:32.817Z` |
| **clientIpAddress** | `14.47.176.155` (South Korea) |

## PlayAPI vs Manifest

The **playapi** response is a wrapper around the manifest with additional session metadata:

```json
{
    "id": 177409347003829060,
    "version": 2,
    "serverTime": 1774093470549,
    "result": { /* identical to manifest content */ },
    "common": { "cadToken": "C1-Bgj..." },
    "from": "playapi"
}
```

The `result` field contains the exact same 48 keys as the raw manifest. The wrapper adds:
- **`id`** — Unique request identifier
- **`serverTime`** — Server timestamp (epoch ms)
- **`common.cadToken`** — Cadmium authentication token for the session
- **`from`** — Source identifier (`"playapi"`)

## Video Bitrate Ladder

11 video streams using H.264 profiles with PlayReady DRM, all at ~29.97 fps (`30000/1001`):

| Profile | Bitrate (kbps) | H.264 Level |
|---------|---------------:|-------------|
| `h264hpl30-dash-playready-live` | 275 | 3.0 |
| `h264hpl30-dash-playready-live` | 350 | 3.0 |
| `h264hpl30-dash-playready-live` | 450 | 3.0 |
| `h264hpl30-dash-playready-live` | 700 | 3.0 |
| `h264hpl30-dash-playready-live` | 850 | 3.0 |
| `h264hpl30-dash-playready-live` | 1,300 | 3.0 |
| `h264hpl31-dash-playready-live` | 2,000 | 3.1 |
| `h264hpl31-dash-playready-live` | 3,000 | 3.1 |
| `h264hpl31-dash-playready-live` | 6,000 | 3.1 |
| `h264hpl40-dash-playready-live` | 8,000 | 4.0 |
| `h264hpl40-dash-playready-live` | 14,000 | 4.0 |

Notable: `pix_w` and `pix_h` are both `1` for all streams (resolution not pre-declared in the manifest for live — actual resolution is in the init segment). `maxBitrate` in liveMetadata is capped at `6000`, though the ladder goes up to `14000`.

## Audio Streams

2 audio streams in Korean (primary), unencrypted:

| Profile | Bitrate (kbps) | Channels |
|---------|---------------:|----------|
| `heaac-2-dash` | 96 | 2.0 |
| `heaac-2hq-dash` | 128 | 2.0 |

## Timed Text (Subtitles)

3 subtitle tracks in TTML format:

| Language | Description | Type |
|----------|-------------|------|
| *(none)* | 끄기 (Off) | PRIMARY |
| `ko` | 한국어 | ASSISTIVE |
| `en` | 영어 (English) | ASSISTIVE |

## CDN Infrastructure (Open Connect Appliances)

All 3 CDN servers are Netflix **Open Connect Appliances** (OCA) located in **Tokyo, Japan**:

| Server | Rank | Type |
|--------|------|------|
| `c133.tyo001.ix.nflxvideo.net` | 1 | OPEN_CONNECT_APPLIANCE |
| `c124.tyo001.ix.nflxvideo.net` | 2 | OPEN_CONNECT_APPLIANCE |
| `c010.tyo013.ix.nflxvideo.net` | 3 | OPEN_CONNECT_APPLIANCE |

Each stream URL points to these OCAs with `liveOcaCapabilities: ["LIVE", "DVR"]`, indicating both live edge playback and time-shift (DVR) rewind support.

## Live Metadata

```json
{
    "ocLiveWindowDurationSeconds": 270,
    "maxBitrate": 6000,
    "eventStartTime": "2026-03-21T10:59:32.817Z",
    "eventAvailabilityOffsetMs": 12649,
    "disableLiveUi": false
}
```

- **DVR window**: 270 seconds (4.5 minutes) — users can rewind up to 4.5 minutes behind live edge
- **Max bitrate**: 6,000 kbps (ABR will cap at this for live, even though 8,000 and 14,000 kbps renditions exist in the ladder)
- **Availability offset**: 12,649 ms — segments become available ~12.6 seconds after their presentation time

### Segment Templates

4 segment template types, all sharing `timescale=30000` (video) or `48000` (audio):

| Template | Format | Extension | Timescale | Duration | Init Segment |
|----------|--------|-----------|----------:|----------|--------------|
| 0 | Video (CMAF) | `.cmfv` | 30,000 | 60,060 (~2.002s) | `s_init.cmfv` |
| 1 | Timed Text | `.ttml` | 30,000 | 60,060 (~2.002s) | *(none)* |
| 2 | Media Events (CMAF) | `.cmfm` | 30,000 | 60,060 (~2.002s) | `s_init.cmfm` |
| 3 | Audio (CMAF) | `.cmfa` | 48,000 | 96,096 (~2.002s) | `s_init.cmfa` |

Segment numbering starts at `startNumber: 377`, with `availabilityStartTime: 2026-03-21T05:12:45.400Z`.

URL pattern: `https://<oca-host>/live/s_<Number>.<ext>?o=1&v=<ver>&e=<expiry>&t=<token>`

## Steering & Location

- **Location key**: `1-4766-high` (level 1, rank 1)
- **Live edge cushion**: 4,000 ms (how far behind live edge the player targets)
- **Live edge cushion with spread**: 4,436 ms (adds jitter to avoid CDN thundering herd)
- **Steering ID**: Used for server-side traffic steering across OCAs

## DRM Configuration

- **DRM type**: Widevine
- **DRM context ID**: `2755359`
- **Has DRM profile**: `true`
- **Has clear streams**: `false` (all video is encrypted)
- **Audio is unencrypted** (`isDrm: false` on audio streams)

License endpoints:
- **Standard**: `/license?licenseType=standard&playbackContextId=...`
- **Limited**: `/license?licenseType=limited&playbackContextId=...`

## Ad Configuration

```json
{
    "daiSupported": false,
    "retainAdBreaks": false,
    "adBreaks": []
}
```

No ads during this live event.

## Breakpoint Context

The manifest and playapi responses were captured by setting a breakpoint at:

```javascript
C = x.dea.create(D);
```

in the original obfuscated `cadmium-playercore-6.0055.939.911.js`. In the deobfuscated code, this corresponds to the MSL/manifest request creation path where the player constructs a streaming session from the server response. The variable `D` contains the parsed manifest/playapi response object, and `x.dea.create()` maps to the session/viewable factory that initializes the ASE streaming pipeline.

## Pre-Playback Speed Test

Before fetching init segments, the player runs a throughput probe via Netflix's **Probnik** system:

```
GET /api/ftl/probe?monotonic=false&device=web&iter=0
```

This returns URLs to multiple OCA servers worldwide, each serving a 5 KB test payload. The player downloads from several servers in parallel to estimate network throughput before selecting the initial video bitrate.

## Segment Download Flow

1. **Speed test** (Probnik) — 5 KB downloads to multiple OCAs
2. **Init segments** — `s_init.cmfm` (media events), `s_init.cmfv` (video), `s_init.cmfa` (audio)
3. **Media segments** — `s_<N>.cmfv`, `s_<N>.cmfa`, `s_<N>.ttml`, `s_<N>.cmfm` in ~2-second chunks
4. **Continuous CMFM downloads** — Media event metadata segments downloaded throughout playback
