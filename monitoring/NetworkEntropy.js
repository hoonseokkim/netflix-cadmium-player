/**
 * Netflix Cadmium Player — Network Entropy Analyzer
 *
 * Computes Shannon entropy over a Markov transition matrix of throughput
 * states to quantify network variability.  High entropy indicates
 * unpredictable throughput (frequent bitrate ladder transitions),
 * while low entropy signals stable network conditions.
 *
 * The entropy is computed separately for HD and UHD bitrate ladders so
 * the ABR controller can make tier-specific decisions.
 *
 * Algorithm overview:
 *  1. Throughput samples from a sliding window are quantized into
 *     discrete states based on configurable bitrate-ladder thresholds.
 *  2. State transitions are accumulated in a transition matrix.
 *  3. Shannon entropy is computed from the column-marginal probabilities
 *     and normalized by log2 to produce a bits-per-transition metric.
 *
 * @module NetworkEntropy
 */

// import * as helpers   from '../modules/Module_22970.js';
// import { platform }   from '../modules/Module_66164.js';
// import { j6 as SlidingWindowBucket } from '../modules/Module_72697.js';
// import { U6a as sumArray }            from '../modules/Module_94451.js';
// import { writable }                   from '../modules/Module_51044.js';
// import { u as TRACE_ENABLED }         from '../modules/Module_48170.js';

const logger = new platform.Console('ASEJS_NETWORK_ENTROPY', 'media|asejs');

/**
 * Creates a square matrix of the given size initialized to zeros.
 *
 * @param {Array} bitrateLadder - Bitrate ladder array (matrix size = length + 1).
 * @returns {number[][]} Zero-initialized square matrix.
 */
function createTransitionMatrix(bitrateLadder) {
  const size = bitrateLadder.length + 1;
  const matrix = new Array(size);
  for (let row = 0; row < size; row++) {
    matrix[row] = new Array(size);
    for (let col = 0; col < size; col++) {
      matrix[row][col] = 0;
    }
  }
  return matrix;
}

/**
 * Extends SlidingWindowBucket to compute network entropy over throughput
 * samples.
 *
 * @extends SlidingWindowBucket
 */
class NetworkEntropy extends SlidingWindowBucket {
  /**
   * @param {Object} config
   * @param {number} config.sw   - Sliding window size (ms).
   * @param {number} config.mw   - Measurement window size (ms).
   * @param {Array}  config.uhdl - UHD bitrate ladder thresholds (kbps).
   * @param {Array}  config.hdl  - HD bitrate ladder thresholds (kbps).
   * @param {number} [config.mins] - Minimum sample count for valid entropy.
   */
  constructor(config) {
    super(config.sw, config.mw);

    /** @type {number} Sliding window duration (ms). */
    this.slidingWindowMs = config.sw;

    /** @type {number} Measurement window duration (ms). */
    this.measurementWindowMs = config.mw;

    /**
     * Bitrate ladders keyed by tier ("uhd", "logMediaPipelineStatus" for HD).
     * @type {Object<string, number[]>}
     */
    this.bitrateLadders = {
      uhd: writable(config.uhdl),
      logMediaPipelineStatus: writable(config.hdl),
    };

    /**
     * Number of measurement-window buckets that fit in the sliding window.
     * @type {number}
     */
    this.bucketsPerWindow = Math.max(Math.ceil(this.slidingWindowMs / this.measurementWindowMs), 1);

    /**
     * Minimum transitions required before entropy is considered valid.
     * @type {number}
     */
    this.minimumTransitions = config.mins || 1;

    this.reset();
  }

  /* ------------------------------------------------------------------ */
  /*  Filter interface                                                   */
  /* ------------------------------------------------------------------ */

  /**
   * Flushes accumulated bucket data into the entropy transition matrix.
   * Called periodically by the NetworkMonitor's logBatcher cycle.
   */
  logBatcher() {
    this.ph.forEach((byteCount, index) => {
      this._addSampleToMatrix(byteCount, this.NUa(index));
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Entropy computation                                                */
  /* ------------------------------------------------------------------ */

  /**
   * Computes Shannon entropy for each bitrate-ladder tier from the
   * accumulated transition matrix.
   *
   * @returns {Object<string, number>} Map of tier name to entropy value
   *   (bits per transition). Returns -1 if insufficient data.
   */
  computeEntropy() {
    const ladders = this.bitrateLadders;

    for (const tierName in ladders) {
      if (TRACE_ENABLED) {
        logger.pauseTrace(`Calculating Network Entropy based on ${tierName} bitrate ladder (${JSON.stringify(ladders[tierName])})`);
      }

      const ladder = ladders[tierName];
      const transitionTracker = this.transitionTrackers[tierName];
      const matrix = this.transitionMatrices[tierName];

      // Flush any pending first-state transition
      if (transitionTracker.first !== undefined) {
        const firstState = transitionTracker.first;
        const prevState = transitionTracker.previousState;
        if (prevState !== undefined) {
          matrix[firstState][prevState] += 1;
        }
        transitionTracker.first = undefined;
      }

      if (TRACE_ENABLED) {
        logger.pauseTrace(`Transition Matrix: ${this._formatMatrix(matrix)}`);
      }

      // Compute column-marginal (steady-state) vector
      const columnMarginals = [];
      const numStates = ladder.length + 1;
      let totalTransitions = 0;

      for (let col = 0; col < numStates; col++) {
        let colSum = 0;
        for (let row = 0; row < numStates; row++) {
          colSum += matrix[row][col];
        }
        totalTransitions += colSum;
        columnMarginals.push(colSum);
      }

      if (TRACE_ENABLED) {
        logger.pauseTrace(`steadyStateVector: ${JSON.stringify(columnMarginals)}`);
      }

      // Compute Shannon entropy
      let entropy = -1;

      if (totalTransitions > this.minimumTransitions) {
        entropy = 0;
        for (let col = 0; col < numStates; col++) {
          if (columnMarginals[col] <= 0) continue;
          for (let row = 0; row < numStates; row++) {
            const count = matrix[row][col];
            if (count > 0) {
              entropy -= count * Math.log(count / columnMarginals[col]);
            }
          }
        }
        entropy /= totalTransitions * Math.log(2);
      }

      if (TRACE_ENABLED) {
        logger.pauseTrace(`entropy: ${entropy}`);
      }

      this.entropyResults[tierName] = entropy;
    }

    return this.entropyResults;
  }

  /* ------------------------------------------------------------------ */
  /*  Internal helpers                                                   */
  /* ------------------------------------------------------------------ */

  /**
   * Converts a byte-count / duration sample into a throughput value,
   * quantizes it, and records the state transition in each tier's matrix.
   *
   * @param {number} byteCount - Bytes in the sample bucket.
   * @param {number} durationMs - Duration of the sample bucket (ms).
   * @private
   */
  _addSampleToMatrix(byteCount, durationMs) {
    const maxBuckets = this.bucketsPerWindow;

    // Maintain sliding windows for bytes and durations
    while (this.byteWindow.length >= maxBuckets) this.byteWindow.shift();
    while (this.durationWindow.length >= maxBuckets) this.durationWindow.shift();

    this.byteWindow.push(byteCount);
    this.durationWindow.push(durationMs);

    const totalBytes = sumArray(this.byteWindow);
    const totalDuration = sumArray(this.durationWindow);

    if (totalDuration <= 0) return;

    const throughputBps = (8 * totalBytes) / totalDuration;

    if (TRACE_ENABLED) {
      logger.pauseTrace(`Adding sliding window throughput into Transition Matrix: ${throughputBps}`);
    }

    for (const tierName in this.bitrateLadders) {
      const tracker = this.transitionTrackers[tierName];
      const matrix = this.transitionMatrices[tierName];
      const state = this._quantizeThroughput(throughputBps, this.bitrateLadders[tierName]);
      const prevState = tracker.previousState;

      if (prevState !== undefined) {
        matrix[state][prevState] += 1;
      } else {
        tracker.first = state;
      }

      tracker.previousState = state;
    }
  }

  /**
   * Maps a throughput value to a discrete state index based on the
   * bitrate ladder thresholds.
   *
   * @param {number}   throughput    - Throughput in bps.
   * @param {number[]} bitrateLadder - Sorted threshold array (kbps).
   * @returns {number} State index (0 = below lowest, N = above highest).
   * @private
   */
  _quantizeThroughput(throughput, bitrateLadder) {
    let state = 0;
    while (state < bitrateLadder.length && throughput > bitrateLadder[state]) {
      state += 1;
    }
    return state;
  }

  /**
   * Called when the oldest bucket is evicted from the parent
   * SlidingWindowBucket. Flushes it into the transition matrix first.
   * @override
   */
  shift() {
    this._addSampleToMatrix(this.ph[0], this.NUa(0));
    super.shift();
  }

  /**
   * Resets all entropy-related state (windows, matrices, trackers).
   */
  reset() {
    /** @type {number[]} Sliding window of byte counts. */
    this.byteWindow = [];

    /** @type {number[]} Sliding window of durations. */
    this.durationWindow = [];

    if (this.bitrateLadders === undefined) return;

    /** @type {Object<string, number>} Most recent entropy per tier. */
    this.entropyResults = { hd: 0, uhd: 0 };

    /**
     * Per-tier transition trackers storing the last quantized state
     * and any pending "first" transition.
     * @type {Object<string, {first: number|undefined, previousState: number|undefined}>}
     */
    this.transitionTrackers = {
      hd:  { first: undefined, previousState: undefined },
      uhd: { first: undefined, previousState: undefined },
    };

    /**
     * Per-tier transition matrices.
     * @type {Object<string, number[][]>}
     */
    this.transitionMatrices = {
      hd:  createTransitionMatrix(this.bitrateLadders.logMediaPipelineStatus),
      uhd: createTransitionMatrix(this.bitrateLadders.uhd),
    };

    super.reset();
  }

  /**
   * Formats a transition matrix as a multi-line string for debug logging.
   *
   * @param {number[][]} matrix
   * @returns {string}
   * @private
   */
  _formatMatrix(matrix) {
    let output = '';
    const size = matrix.length;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        output += ` ${matrix[row][col]}`;
      }
      output += '\n';
    }
    return output;
  }
}

export { NetworkEntropy as ase_Dhb };
