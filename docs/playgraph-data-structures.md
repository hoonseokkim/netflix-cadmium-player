# Playgraph — Netflix's Directed Graph Content Engine

Playgraph is Netflix's unified directed graph that represents the content timeline. It solves multiple streaming problems — ABR quality switches, ad insertion, interactive branching (Bandersnatch), and live streaming — with a single data structure.

## The Problem

A naive player treats content as a linear sequence of segments. But Netflix needs to handle:

- **ABR**: seamless quality switching at segment boundaries
- **Ads**: interleaving ad breaks into main content
- **Interactive content**: user choices that branch the storyline (Bandersnatch)
- **Live streaming**: dynamic manifest updates, presentation delay
- **Multi-track**: synchronized audio + video + text pipelines

Playgraph models all of these as a **directed graph where nodes are segments and edges are weighted branches**.

---

## Core Data Structures

### Segment

A time-based unit of content with connections to next segments.

```
Segment {
  id: string                        // unique identifier
  viewableId: string                // which content (movie, ad, etc.)
  startTimeMs: number               // start PTS
  contentEndPts: number             // end PTS
  next: {                           // outgoing edges (branches)
    [branchId]: {
      weight?: number               // selection probability weight
      transitionMode?: "immediate"  // for interactive choices
    }
  }
  defaultNext?: string              // explicit default branch ID
  main?: string                     // main branch marker (viewable ID)
}
```

### Branch

A weighted edge from one segment to the next. Managed by `BranchBase`.

```
Branch {
  id: string                        // branch identifier
  viewableId: string                // parent content
  parent: Branch                    // quality level parent
  trackList: MediaType[]            // audio, video, text tracks
  bufferOffsets: Map                 // per-media-type buffer state
  mediaTypeNotAvailableMap: Map     // signals unavailable media types
}
```

### BranchWeight

Holds probability for branch selection.

```
BranchWeight {
  weight: number                    // raw weight value
  normalizedWeight: number          // probability (0-1)
}

Normalization rules:
  Weighted:    normalizedWeight = weight / totalWeight
  Uniform:     normalizedWeight = 1 / branchCount  (when no weights set)
  Zero-weight: normalizedWeight = 0  (never auto-selected)
```

### WorkingSegment

Runtime mutable wrapper around raw segment data (`WorkingSegment.js`, 685 lines). Provides computed properties and lazy branch weight normalization.

```
WorkingSegment {
  segment: Segment                  // underlying raw segment
  branches: Map<id, BranchWeight>   // normalized branch weights
  selfProbability: number           // prob of staying (immediate mode)
  forcedChoices: Array              // override for explicit branch selection
  transitionMode: string            // "immediate" or default
}
```

Self-probability for interactive "immediate" transitions:
```
selfProb = segmentWeight / (segmentWeight + sum(branchWeights))
```

### WorkingPlaygraph

Lazy-instantiated wrapper around the full graph (`Workingplaygraph.js`, 845 lines).

```
WorkingPlaygraph {
  segments: WeakMap<id, WorkingSegment>   // lazy cache
  parent: WorkingPlaygraph                // for hierarchical composition
  normalizationFn: Function               // relative → absolute PTS

  // Generator-based traversal:
  forwardFromSegment(id)    → all next-branch segments
  predecessorsOf(id)        → all incoming edges
  defaultPathFrom(id)       → highest-weight path forward
  ancestorsOf(id)           → walk backward through graph
}
```

### PlaygraphTree

Generic tree with BiMap-based bidirectional lookup (`PlaygraphTree.js`, 367 lines).

```
PlaygraphTree {
  bimap: BiMap<value, node>         // fast value ↔ node lookup

  Node {
    value: any
    parent?: Node
    children?: Node[]
  }

  Operations:
    add, remove, move, replant
    traverse (pre-order, post-order, leaf-first)
    diff, clone, equals
}
```

### BranchCollection

Tree of parallel download branches (`BranchCollection.js`, 304 lines). Organizes branches as parent-child for quality level hierarchy.

---

## Key Files

| File | Lines | Purpose |
|------|-------|---------|
| `streaming/Playgraph.js` | 3,338 | Core playgraph engine — the central orchestrator |
| `streaming/Workingplaygraph.js` | 845 | Runtime wrapper with lazy WorkingSegment cache |
| `streaming/WorkingSegment.js` | 685 | Mutable segment with computed branch weights |
| `streaming/PlaygraphTree.js` | 367 | Tree data structure with BiMap traversal |
| `streaming/PlaygraphManager.js` | 464 | High-level orchestrator + MediaSession API |
| `streaming/PlaygraphMerger.js` | 219 | Merges two playgraphs for ad insertion |
| `streaming/PlaygraphPositionMapper.js` | 339 | Position mapping between resolution levels |
| `streaming/PlaygraphTimeMapper.js` | 151 | Timestamp translation for live streaming |
| `streaming/PlaygraphSequenceBuilder.js` | 75 | Builds playgraph from manifest data |
| `streaming/PlaygraphMetricsReporter.js` | 1,085 | Pipeline health + network metrics reporting |
| `streaming/PlaygraphSeekEventReplay.js` | — | Seek event handling |
| `streaming/BranchBase.js` | 300 | Branch node with quality/buffer tracking |
| `streaming/BranchCollection.js` | 304 | Tree of parallel download branches |
| `streaming/BranchCollectionManager.js` | — | Collection management |
| `streaming/SegmentRequestDescriptor.js` | 134 | Segment download request metadata |
| `player/BranchingSegmentManager.js` | 457 | Interactive content navigation |

---

## How Each Problem Is Solved

### ABR Quality Switches

Different bitrates are modeled as branches from the same segment node. Switching quality = choosing a different branch at the next segment boundary. No rebuffering because segments are time-aligned and pre-synchronized.

```
Segment A ──[720p branch]──▶ Segment B (720p)
           ──[1080p branch]──▶ Segment B (1080p)
           ──[4K branch]──▶ Segment B (4K)
```

`BranchCollection` tracks parallel download branches as a tree — parent-child relationships represent quality tiers.

### Ad Insertion (Multi-Period Content)

`PlaygraphMerger` combines two playgraphs that share a common viewable. It splits segments at time boundaries to interleave ad content:

```
Main:  [──── Segment 1 ────][──── Segment 2 ────][──── Segment 3 ────]
                             ↓ split here
Merged:[── Seg 1 ──][Ad Break][── Seg 2 cont ──][──── Segment 3 ────]
```

Segment IDs are mapped bidirectionally between merged and original graphs for position tracking.

### Interactive Branching (Bandersnatch)

Each user choice point is a segment with multiple weighted `next` branches. The weight system determines default path probability.

```
Story Segment ──[Choice A, weight=0.6]──▶ Branch A
              ──[Choice B, weight=0.4]──▶ Branch B
              (selfProbability for "immediate" mode)
```

`BranchingSegmentManager` handles transitions:
1. Attempts **seamless branch transition** via ASE (Adaptive Streaming Engine)
2. Falls back to **seek-based transition** if seamless fails
3. Supports **delayed seek scheduling** for queued segment changes
4. Updates branch weights based on user choice probability

Forced choices override the weight system for explicit user selections.

### Live Streaming

- `PlaygraphTimeMapper` builds a "nearest main branch map" for interpolating timestamps in the branching structure
- Dynamic manifest updates merge into the existing WorkingPlaygraph
- `PresentationDelayController` monitors and adjusts live presentation delay
- Segments are normalized from relative to absolute PTS as timing data becomes available

### Multi-Track Coordination

- `BranchBase` tracks a `trackList` with media types (audio, video, text)
- `MediaPipeline` coordinates download streams per branch per media type
- `mediaTypeNotAvailableMap` signals when a media type becomes unavailable
- Pipeline health monitor aggregates buffer state across all media types and branches

---

## Graph Traversal

WorkingPlaygraph provides both generator-based (lazy) and callback-based (immediate) traversal:

### Generator-Based (Lazy)

```javascript
forwardFromSegment(segmentId)     // all next-branch segments
predecessorsOf(segmentId)         // all incoming edges
defaultPathFrom(segmentId)        // highest-weight path forward
ancestorsOf(segmentId)            // walk backward through graph
decompressor()                    // branch tree decomposition
```

### Callback-Based (Immediate)

```javascript
visitForwardSegments(segmentId, callback)
visitPredecessors(segmentId, callback)
visitDefaultPath(segmentId, callback)
visitAncestors(segmentId, callback)
visitBranchTree(segmentId, callback)
```

---

## Normalization Flow

Segments go through a multi-stage normalization pipeline:

```
1. Raw manifest segments
   (relative timestamps from manifest parser)
        │
        ▼
2. WorkingSegment creation
   (lazy, WeakMap-cached, raw data wrapped)
        │
        ▼
3. Normalization function applied
   (when viewable timing becomes available)
   (relative PTS → absolute PTS)
        │
        ▼
4. Timespan mapping
   (absolute timescale across multiple viewables)
        │
        ▼
5. Position mapping
   (PlaygraphPositionMapper converts between
    different playgraph resolution levels)
```

---

## Integration Points

### PlaygraphManager (Orchestrator)

High-level controller that connects the playgraph to the rest of the player:

- **MediaSession API** integration for system-level controls (play/pause/seek)
- **Event forwarding** between playgraph state and player pipeline
- **Segment transitions** with validation
- **State machine coordination** with player lifecycle

### PlaygraphMetricsReporter (Monitoring)

Extends the base ASE player for playgraph-based streaming:

- **DRM viewable lifecycle** management
- **Pipeline health monitoring** with low/critical buffer thresholds
- **Network metrics** reporting (throughput EWMA, buffer duration)
- **Branch lifecycle events** and state change tracking

### Service Bus

```javascript
// Playgraph events flow through the service bus:
serviceBus.emit('segmentTransition', {from, to, mode})
serviceBus.emit('branchSwitch', {branchId, quality})
serviceBus.emit('bufferHealth', {level, threshold})
```

---

## Position System

A position in the playgraph is a `(segmentId, offset)` tuple:

```
Position {
  segmentId: string     // which segment
  offset: number        // time offset within segment (ms)
}
```

`PlaygraphPositionMapper` converts positions between different playgraph resolution levels (e.g., when a merged playgraph has finer segmentation than the original).

---

## Summary

The Playgraph is a **directed graph** where:
- **Nodes** = segments (time-bounded content units)
- **Edges** = weighted branches (next-segment choices)

| Concept | Definition |
|---------|-----------|
| **Segment** | Time-based unit of content with metadata and outgoing branches |
| **Branch** | Weighted edge to a next segment (quality tier, ad, or story choice) |
| **Playgraph** | The full directed graph of all segments and branches |
| **WorkingPlaygraph** | Runtime wrapper with lazy caching and normalization |
| **PlaygraphTree** | Tree overlay for parent-child hierarchy (quality, ads) |
| **BranchCollection** | Parallel download branch tree for multi-quality prefetching |
| **Position** | (segmentId, offset) tuple for playback location |
| **Normalization** | Relative PTS → absolute PTS when timing data arrives |
| **Weight** | Probability for branch auto-selection (0-1 normalized) |

This architecture unifies ABR, ads, interactivity, live streaming, and buffer management under one graph model — each problem is just a different pattern of nodes and weighted edges in the same structure.
