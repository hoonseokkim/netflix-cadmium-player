/**
 * Netflix Cadmium Player - Metrics Counter
 *
 * A metrics counter that wraps a provider-supplied counter instance
 * and maintains a local running total. Used for lightweight telemetry
 * within the player (e.g., counting segment downloads, errors, retries).
 *
 * @module telemetry/Counter
 */

/**
 * Wraps a metrics counter with a local cumulative total.
 */
export class Counter {
  /**
   * @param {Object} metricsProvider - Provider with a counter(name, tags) factory method.
   * @param {string} name - Counter metric name.
   * @param {Object} tags - Metric tags/labels.
   */
  constructor(metricsProvider, name, tags) {
    /** @type {number} Local running total */
    this.total = 0;
    /** @type {Object} The underlying provider counter */
    this.counter = metricsProvider.counter(name, tags);
  }

  /**
   * Increments the counter by the given amount.
   *
   * @param {number} [amount=1] - Amount to increment by.
   */
  increment(amount = 1) {
    this.total += amount;
    this.counter.increment(amount);
  }
}
