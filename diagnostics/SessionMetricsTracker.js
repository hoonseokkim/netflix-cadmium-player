/**
 * Netflix Cadmium Player - Session Metrics Tracker
 *
 * Lightweight session diagnostics tracker that records method call traces,
 * deduplicates repeated calls, and emits structured diagnostic events.
 * Also provides a `consoleLogger` decorator for automatic method instrumentation.
 *
 * @module diagnostics/SessionMetricsTracker
 */

/**
 * Retrieve the SessionMetricsTracker instance attached to an object.
 *
 * @param {Object} obj - The instrumented object.
 * @returns {SessionMetricsTracker|undefined}
 */
export function getSessionMetrics(obj) {
  return obj?.sessionMetricsRef;
}

/**
 * Method decorator that wraps a method with diagnostic tracing.
 * Records method entry/exit, return values, errors, and supports deduplication.
 *
 * @param {Object} [options] - Decorator options.
 * @param {string} [options.methodName] - Override display name for the method.
 * @param {boolean} [options.dedup] - Enable deduplication of consecutive identical calls.
 * @param {boolean} [options.return] - Capture the return value.
 * @param {boolean|string[]} [options.eventData] - Capture call arguments.
 * @param {boolean} [options.increment] - Increment a named counter.
 * @returns {Function} The decorator function.
 */
export function consoleLogger(options) {
  return function (_target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...callArgs) {
      const metrics = getSessionMetrics(this);
      let traceEntry;

      if (metrics) {
        const methodName = options?.methodName ?? String(propertyKey);
        traceEntry = metrics.recordMethodCall(methodName, {}, options?.dedup, options?.increment);
      }

      const previousEntry = metrics?.currentTraceEntry;
      if (metrics) {
        metrics.currentTraceEntry = traceEntry;
      }

      let error;
      try {
        let result = originalMethod?.apply(this, arguments);

        if (result && typeof result.then === 'function') {
          result = result.then(
            (value) => {
              if (traceEntry && options?.return) {
                traceEntry.data.resolve = value;
              }
              return value;
            },
            (rejection) => {
              if (traceEntry) {
                traceEntry.data.reject = `${rejection}`;
              }
              return Promise.reject(rejection);
            }
          );
        }

        return result;
      } catch (e) {
        error = e;
        throw e;
      } finally {
        if (metrics) metrics.currentTraceEntry = previousEntry;
        if (traceEntry) {
          if (!traceEntry.data) traceEntry.data = {};
          if (error) {
            traceEntry.data.error = `${error}`;
            metrics?.logError(traceEntry);
          } else if (options?.return) {
            traceEntry.data.lastReturn = undefined;
          }
        }
      }
    };
  };
}

/**
 * Session-scoped diagnostics tracker that records method call traces.
 * Attaches itself to the target object as a non-enumerable `sessionMetricsRef` property.
 */
export class SessionMetricsTracker {
  /**
   * @param {Object} config - Configuration.
   * @param {Object} config.engineRef - The object to instrument.
   * @param {string} config.source - Descriptive source name for log entries.
   * @param {number} [config.maxEntries=10] - Maximum number of trace entries to retain.
   * @param {Object} [config.console] - Optional scoped console for debug output.
   */
  constructor(config) {
    /** @type {Array<Object>} Ring buffer of trace entries */
    this.traceEntries = [];
    /** @type {boolean} Whether this tracker has been destroyed */
    this.isDestroyed = false;
    /** @type {Object} Counter map for increment-tracked methods */
    this.methodCounters = {};
    /** @type {Object} Merged configuration */
    this.config = { maxEntries: 10, ...config };
    /** @type {Object|undefined} The currently executing trace entry */
    this.currentTraceEntry = undefined;

    // Attach this metrics instance to the target object
    Object.defineProperties(config.engineRef, {
      sessionMetricsRef: {
        enumerable: false,
        value: this,
        configurable: true,
      },
    });
  }

  /** @returns {string} Source name */
  get source() {
    return this.config.source;
  }

  /** @returns {boolean} Whether still active */
  get enabled() {
    return !this.isDestroyed;
  }

  /** @returns {Array<Object>} Copy of trace entries */
  get entries() {
    return [...this.traceEntries];
  }

  /** @returns {Object} Counter map */
  get counters() {
    return this.methodCounters;
  }

  /**
   * Add diagnostic data to the currently executing trace entry.
   *
   * @param {Object} data - Key-value pairs to merge.
   */
  emitDiagnosticEvent(data) {
    if (this.isDestroyed) return;
    const currentEntry = this.currentTraceEntry;
    if (currentEntry) {
      currentEntry.data = { ...currentEntry.data, ...data };
    }
  }

  /**
   * Record a method call as a new trace entry.
   *
   * @param {string} methodName - The method name.
   * @param {Object} contextData - Diagnostic context data.
   * @param {boolean} [dedup] - Whether to deduplicate consecutive identical calls.
   * @param {boolean} [increment] - Whether to increment the method counter.
   * @returns {Object|undefined} The created trace entry.
   */
  recordMethodCall(methodName, contextData, dedup, increment) {
    if (this.isDestroyed) return;

    const entry = {
      methodName,
      data: Object.keys(contextData).length > 0 ? contextData : undefined,
      timestamp: Date.now(),
    };

    if (increment) {
      this.methodCounters[methodName] =
        (this.methodCounters[methodName] || 0) + 1;
    }

    // Deduplication: merge into the last entry if same method
    let isDuplicate = false;
    if (dedup && this.traceEntries.length > 0) {
      const lastEntry = this.traceEntries[this.traceEntries.length - 1];
      if (lastEntry.methodName === methodName) {
        lastEntry.data = lastEntry.data || {};
        lastEntry.data.dedup = lastEntry.data.dedup || { hitCount: 1 };
        lastEntry.data.dedup.hitCount++;
        lastEntry.data.dedup.lastEntry = entry;
        isDuplicate = true;
      }
    }

    if (!isDuplicate) {
      this.traceEntries.push(entry);
    }

    if (this.traceEntries.length > this.config.maxEntries) {
      this.traceEntries.shift();
    }

    return entry;
  }

  /**
   * Destroy this metrics tracker and detach from the engine reference.
   */
  destroy() {
    Object.defineProperties(this.config.engineRef, {
      sessionMetricsRef: {
        enumerable: false,
        value: null,
        configurable: true,
      },
    });
    this.isDestroyed = true;
    this.clear();
  }

  /**
   * Clear all trace entries and method counters.
   */
  clear() {
    this.traceEntries = [];
    this.methodCounters = {};
  }
}
