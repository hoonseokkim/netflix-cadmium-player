# XGBoost Prefetch Prioritization Model

Netflix embeds a pre-trained XGBoost decision tree directly inside the Cadmium player to predict which titles a user will play next while they browse the Netflix UI. The prediction drives prefetch scheduling — pre-loading manifests and initial video segments for predicted titles so playback starts instantly.

## What Problem Does It Solve?

When a user scrolls through the Netflix browse UI, there are hundreds of visible titles. Prefetching all of them wastes bandwidth. Prefetching none causes a cold start delay when the user hits play. The XGBoost model picks the **top 5 most likely titles** based on real-time browsing behavior and prefetches only those.

---

## Model Architecture

**Type:** Single gradient-boosted decision tree (XGBoost format)

| Property | Value |
|----------|-------|
| Format | XGBoost binary tree |
| Tree depth | 7 levels |
| Total nodes | 228 (114 internal + 114 leaf) |
| Features | 145 (26 numeric + 119 categorical) |
| Output | Leaf score (float, range ~[-1.0, +1.0]) |
| Storage | Flat map, 1-indexed binary heap layout |
| Config key | `_format: "xgboost"`, `_modelName: "tree"` |

This is a **single tree**, not an ensemble. The weights are baked directly into the JavaScript source code — no external model file is loaded at runtime.

### Source Files

| File | Lines | Role |
|------|-------|------|
| `abr/DecisionTree.js` | 1,039 | Tree structure, nodes, features, config |
| `player/PlayPredictionModel.js` | 432 | Event processing, model dispatch, preparer integration |
| `prefetch/PrefetchManager.js` | 220 | Wishlist management, budget allocation, claiming |
| `prefetch/PrefetchWishlistBuilder.js` | 89 | Budget-aware item prioritization |
| `prefetch/PrefetchPlaygraphFactory.js` | 49 | Creates playgraphs for prefetch items |

---

## The 145 Features

### Indices 0-10: Session & Scroll Metrics (numeric)

| Index | Name | How It's Updated |
|-------|------|-----------------|
| 0 | `maxColIndex` | `max(current, event.colIndex)` — furthest column visited |
| 1 | `avgColIndex` | Running mean of column indices |
| 2 | `maxRowIndex` | `max(current, event.rowIndex)` — furthest row visited |
| 3 | `avgRowIndex` | Running mean of row indices |
| 4 | `sessionDuration` | `now() - sessionStart` in milliseconds |
| 5 | `scrollUpCount` | Cumulative up-scroll events |
| 6 | `scrollLeftCount` | Cumulative left-scroll events |
| 7 | `scrollRightCount` | Cumulative right-scroll events |
| 8 | `scrollDownCount` | Cumulative down-scroll events |
| 9 | `pageColumnCount` | Columns currently visible on page |
| 10 | `pageRowCount` | Rows currently visible on page |

### Indices 11-26: UI Layout Flags (16 categorical)

One-hot encoded flags for UI layout/content-type configurations. Feature 14 (`uiLayout_3`) is the **root split feature** of the tree — the single most important signal.

### Indices 27-49: Region Flags (23 categorical)

Geographic or content-region indicators. Presence/absence determines routing.

### Indices 50-128: Grid Mask Cells (79 categorical)

Spatial partitioning of the browse UI. The page is divided into a grid:
- Page size: 100 rows x 75 columns
- Block size: 20 rows x 15 columns
- Result: 5x5 = 25 unique cells (with 79 feature slots for padding/future expansion)

The `GridMaskParams` class maps `(rowBlock, colBlock)` coordinates. This tells the model **where on the screen** the user is focused.

### Indices 129-144: Row Context Sizes (16 numeric)

Track the maximum list length observed for each Netflix row type:

| Index | Name | Row Type |
|-------|------|----------|
| 129 | `watchAgainCount` | Watch Again |
| 130 | `recentlyAddedCount` | Recently Added |
| 131 | `similarsCount` | Similar Titles |
| 132 | `queueCount` | My List |
| 133 | `continueWatchingCount` | Continue Watching |
| 134 | `genreCount` | Genre rows |
| 135 | `trendingNowCount` | Trending Now |
| 136 | `topTenCount` | Top 10 |
| 137 | `billboardCount` | Billboard |
| 138 | `newReleaseCount` | New Releases |
| 139 | `ultraHDCount` | Ultra HD 4K |
| 140 | `popularTitlesCount` | Popular Titles |
| 141 | `becauseYouAddedCount` | Because You Added |
| 142 | `bigRowCount` | Big Row (promotional) |
| 143 | `becauseYouLikedCount` | Because You Liked |
| 144 | `netflixOriginalsCount` | Netflix Originals |

---

## Tree Node Structure

Each of the 228 nodes is a `DecisionTreeNode`:

```javascript
class DecisionTreeNode {
    constructor(leftChild, rightChild, missingChild, featureIndex, split, isLeaf, leafValue)

    evaluate(input) {
        // Internal node routing:
        //   Categorical: null → rightChild, "missing" → missingChild, else → leftChild
        //   Numeric:     null → missingChild, value < split → leftChild, else → rightChild
        // Leaf node: return leafValue (float)
    }
}
```

### Binary Heap Layout

Nodes are stored in a flat `Record<string, DecisionTreeNode>` with 1-indexed binary heap keys:

```
           "0" (root)
          /          \
       "1"            "2"
      /    \          /    \
    "3"    "4"      "5"    "6"
   / \    / \      / \    / \
  ...  ...  ...  ...  ...  ...
```

### Example: Root Node

```javascript
this.nodes["0"] = N("1","2","1","14","-0.0000100136",0,0);
// Split on feature 14 (uiLayout_3)
// If present → left child "1"
// If null → right child "2"
// If missing → follow "1"
```

### Leaf Value Range

Leaf values range from **-0.999780** to **+0.993951**. Higher scores indicate stronger engagement prediction. Key threshold examples:

| Leaf Value | Meaning |
|-----------|---------|
| +0.99 | Very high confidence — user very likely to play this title |
| +0.50 | Moderate confidence |
| ~0.00 | Neutral |
| -0.50 | Low confidence |
| -0.99 | Very low confidence — unlikely to play |

---

## Prediction Flow

### Step 1: UI Event Capture

The Netflix browse UI sends navigation events to `PlayPredictionModel`:

```javascript
event = {
    direction: "down" | "up" | "left" | "right",
    xc: [{                              // context array
        context: "genre" | "continueWatching" | ...,
        rowIndex: number,
        list: [{                         // titles in view
            J: viewableId,               // Netflix title ID
            hasContent: boolean,
            index: number,
            property: "playFocused" | ...
        }]
    }],
    rba: { rowIndex, lic }              // row info
}
```

### Step 2: Event Normalization

`PlayPredictionModel._normalizeEvent()` converts string enums to numeric indices using `ContextTypes`, `DirectionTypes`, and `PropertyTypes`.

### Step 3: Action Classification

```javascript
_classifyAction(event) → ActionType:
    FIRST_LOAD     // model just initialized
    PLAY_FOCUS     // user focused on a play button
    SEARCH         // search context detected
    SCROLL         // up/down scroll
    DEFAULT        // horizontal scroll or other
```

### Step 4: Feature Vector Update

Each feature's `.update(event)` method is called to accumulate state:
- Scroll counters increment
- Session duration recalculates
- Row context sizes take `max(current, newListLength)`
- Grid mask cells are set based on cursor position

### Step 5: Tree Traversal

```javascript
tree.predict(input) {
    // Start at root "0"
    // Evaluate feature at each internal node
    // Follow left/right/missing child pointer
    // Return leaf value when reached
}
```

### Step 6: Ranking & Dispatch

Predictions are ranked by score, expanded into `PredictedTitle` objects with priority ranks, and dispatched:

```javascript
predictions = model.update(normalizedEvent, actionType);
predictions = _expandPredictions(predictions, itemsPerRank);
videoPreparer.CU(predictions);    // prefetch video segments
uiPreparer.CU(predictions);       // prefetch UI metadata
```

---

## Prefetch Pipeline

After the model produces predictions, the prefetch system takes over:

```
PlayPredictionModel
  → PredictedTitle[] (ranked by priority)
    → PrefetchWishlistBuilder.createPrefetchWishlist()
      → Budget allocation (625 KB/s = ~5 Mbps per item)
      → Max items constrained by total budget
        → PrefetchManager.updateWishlist()
          → PrefetchPlaygraphFactory.resolvePlaygraph()
            → Create playgraph for each prefetch item
              → Start buffering video/audio segments
```

### Budget System

```javascript
DEFAULT_PREFETCH_BYTES_PER_SECOND = 625_000;  // 625 KB/s ≈ 5 Mbps

budgetPerItem = (dataPrefetchDurationMs * 625000) / 1000;
maxItems = floor(totalBudgetBytes / budgetPerItem);
```

Items beyond the budget get 0 bytes allocated (manifest-only prefetch).

### Claiming

When the user actually plays a title, `PrefetchManager.claimPrefetchedPlaygraph()` hands off the pre-buffered playgraph to the active player — enabling instant playback with no buffering delay.

---

## Model Lifecycle

### Initialization

```javascript
// PlayPredictionModel constructor
this._createModel();  // creates ModelOne instance

// ModelOne is the default (and only) model in this build
switch (appConfig.modelSelector) {
    case "modelone":
    default:
        this.model = new ModelOne(this.console);
}
```

### Hot-Swapping

The model can be changed at runtime via config:

```javascript
_onConfigChanged() {
    if (appConfig.modelSelector !== this.currentModelName) {
        this._createModel();      // create new model
        this._replayEvents();     // replay buffered events through new model
    }
}
```

Events are buffered (up to `maxNumberPayloadsStored: 10`) so that when the model changes, the new model can "catch up" on recent browse history.

### Config Parameters

```javascript
modelSelector: "modelone"           // which model to use
_modelName: "tree"                  // internal model name
_format: "xgboost"                  // serialization format
_itemsToKeep: 5                     // top predictions to keep
_itemsThreshold: null               // score threshold (disabled)
cacheLimit: 20                      // prediction cache size
maxNumberTitlesScheduled: 5         // max concurrent prefetches
maxNumberPayloadsStored: 10         // event replay buffer size
holdDuration: 15000                 // ms before hold triggers prefetch
```

### Prefetch Geometry

How many titles to prefetch based on interaction type:

| Trigger | Rows | Columns |
|---------|------|---------|
| First load | 2 | 5 |
| Vertical scroll | 2 | 6 |
| Horizontal scroll | 6 | — |
| Search | 3 (top) | — |
| Continue Watching | 2 | — |
| Episode list | — | 5 |

---

## Telemetry Integration

The model reports timing and prediction data for analytics:

```javascript
// First prediction timestamp
telemetry.kga({ ooc: firstPredictionTimestamp });

// Play focus events
telemetry.reportPlayFocusEvent({
    timestamp, direction, rowIndex, requestId
});
```

---

## Key Insights

### Why a Single Tree (Not an Ensemble)?

Running in-browser JavaScript means latency and code size matter. A single depth-7 tree:
- **7 comparisons** per prediction (fast)
- **228 nodes** of static data (~5 KB)
- No iterative ensemble summation
- Good enough for ranking 5-10 candidates, not precise probability estimation

### Why 79 Grid Cells for a 5x5 Grid?

The 79 categorical features (indices 50-128) over-provision for the 25 actual cells. This allows the grid partitioning to be reconfigured server-side (finer grid = more cells) without changing the feature vector layout. The extra slots remain `null` (routed to `rightChild`/`missingChild`).

### The Root Split: uiLayout_3

Feature 14 (`uiLayout_3`) is the root split — the most important signal. This is a UI layout flag, suggesting that the **type of page/view** the user is on is the strongest predictor of what they'll play next. Different layouts (browse, search, details, kids) have fundamentally different user intent.

### Feature Update is Cumulative

Features like scroll counts and max indices **accumulate across the session**. The model sees not just the current event but the full browsing history: how far the user has scrolled, how long they've been browsing, and the size of each row type they've encountered. This captures browsing patterns (quick scroller vs. careful browser).
