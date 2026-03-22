# Adaptive Bitrate (ABR) Deep Dive

Netflix's ABR system is one of the most sophisticated in the industry. It operates as a multi-layered pipeline that continuously selects the optimal video/audio quality based on network conditions, buffer state, device capabilities, and ML predictions.

## ABR Architecture

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

## Key ABR Files

| File | Purpose |
|------|---------|
| `abr/StreamSelectionAlgorithm.js` | Core quality selection — the `refresh()` function |
| `abr/BufferBasedSelector.js` | Buffer simulation to test if a candidate stream is feasible |
| `abr/InitialStreamSelector.js` | First rendition selection (startup) |
| `abr/InitialBitrateSelector.js` | Bitrate-curve-based startup selection |
| `abr/DecisionTree.js` | XGBoost ML model for prefetch prioritization |
| `abr/DefaultAseConfig.js` | ~270 tunable ABR parameters |
| `abr/StreamSelectionRefresh.js` | Periodic ABR refresh with throughput augmentation |
| `abr/BandwidthAllocator.js` | Audio/video bandwidth split with margin curves |
| `abr/BandwidthConfidence.js` | Confidence factor (0-1) based on download progress |
| `abr/AggregatingFilter.js` | Sliding window throughput smoothing |
| `abr/StddevPredictor.js` | Standard deviation-based throughput prediction |
| `abr/BitrateDirectionStateMachine.js` | Tracks NONE/INCREASING/DECREASING/DISABLED |
| `ase/ThroughputEstimators.js` | EWMA family filters (discrete, continuous, pausable) |
| `monitoring/TdigestFilter.js` | Streaming quantile estimator (T-Digest) for throughput percentiles |
| `abr/StddevPredictor.js` | Standard deviation-based throughput prediction |
| `ase/DeliveryDistribution.js` | Exponentially-weighted throughput distribution |

## Steady-State ABR: The `refresh()` Loop

The core ABR loop runs in `StreamSelectionAlgorithm.js` via the `refresh()` function:

### 1. Gather State
```
- Current stream (the quality we're playing now)
- Sorted stream list (all available qualities, lowest to highest bitrate)
- Buffer state: playback position, download position, buffer ahead (ms)
- Playback rate (1x, 1.5x, 2x, etc.)
- Partial block size (bytes already downloaded for in-progress segment)
```

### 2. Build Simulation Windows
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

### 3. Build Lazy Feasibility Tests
For each candidate stream, create a test function that:
1. **Quick rejection**: Skip if previous candidate already failed with better throughput
2. **Segment bitrate check**: Reject if next segment exceeds `maxSegmentBitrate`
3. **Fast path**: If buffer already exceeds `bitrate * playbackRate * switchFactor`, accept immediately
4. **Full simulation**: Run `simulateFeasibility()` — builds a combined fragment list from primary and secondary segments, then delegates to the buffer simulator

### 4. Decision Logic
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

### 5. Hysteresis & Lock Periods
To prevent oscillation:
- **`lockPeriodAfterDownswitch`**: After downswitching, don't allow upswitch for N ms
- **`lowestBufForUpswitch`**: Minimum buffer level (ms) before considering upswitch
- **`skipBitrateInUpswitch`**: When enabled and buffer is healthy, allow skipping intermediate bitrates

## Throughput Estimation

Netflix uses multiple parallel throughput estimators in `ase/ThroughputEstimators.js`:

| Estimator | Type | Description |
|-----------|------|-------------|
| **Discrete EWMA** | `ewma` | Exponentially-weighted moving average on per-segment throughput |
| **Continuous EWMA** | `cewma` | EWMA that accounts for inter-sample time gaps |
| **Pausable EWMA** | `pewma` | EWMA that pauses during non-download periods |
| **TDigest** | `tdigest` | Streaming quantile estimator for throughput percentiles (`monitoring/TdigestFilter.js`) |
| **Stddev CI** | `stddev` | Mean ± k*stddev confidence interval predictor (`abr/StddevPredictor.js`) |

The `BandwidthConfidence` module produces a 0-1 confidence factor based on how much data has been downloaded vs. the target buffer, used to weight throughput estimates.

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

The curve is defined as an array of `{ m: margin_percent, b: bitrate_kbps }` objects, where `m` is the throughput safety margin percentage and `b` is the bitrate threshold:

```javascript
// From DefaultAseConfig.js
videoBitrateSelectionCurve: [
    { m: 65, b: 8000 },    // 65% margin for streams up to 8 Mbps
    { m: 65, b: 30000 },   // 65% margin for streams up to 30 Mbps
    { m: 50, b: 60000 },   // 50% margin for streams up to 60 Mbps
    { m: 45, b: 90000 },   // 45% margin for streams up to 90 Mbps
    { m: 40, b: 120000 },  // 40% margin for streams up to 120 Mbps
    { m: 20, b: 180000 },  // 20% margin for streams up to 180 Mbps
    { m: 5,  b: 240000 },  // 5% margin for streams up to 240 Mbps
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

## ML Decision Tree (`abr/DecisionTree.js`)

Netflix uses an XGBoost-trained decision tree model with **145 features** for predicting user engagement, primarily used for **prefetch prioritization** (which titles to pre-buffer in the browse UI):

**Feature categories:**
- **Session metrics** (indices 0-10): `maxColIndex`, `avgColIndex`, `maxRowIndex`, `avgRowIndex`, `sessionDuration`, scroll counts (up/down/left/right), page dimensions
- **UI layout categoricals** (11-26): 16 visibility/trigger/content type features
- **Region flags** (27-49): 23 geographic/content region indicators
- **Grid cells** (50-128): 79 positional features from a 100x75 grid divided into 20x15 cells
- **Row context sizes** (129-144): Continue Watching count, Recently Added, Trending Now, Because You Watched, New Releases, etc.

The tree evaluates these features to produce a leaf value (engagement probability), which determines prefetch priority for content tiles the user hasn't scrolled to yet.
