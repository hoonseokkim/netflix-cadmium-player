/**
 * Netflix Cadmium Player — Stream Filter Chain
 *
 * A composable filter system for stream selection. Filters can be combined
 * with AND (all must pass) and OR (fallback if primary yields no results)
 * semantics across primary and fallback priority groups.
 *
 * @module StreamFilterChain
 */

// Dependencies
// import { PP as PASSTHROUGH_FILTER } from './modules/Module_25320';

/**
 * Priority group for stream filters.
 * @enum {number}
 */
export const FilterPriority = {
  /** Primary filters are applied first. */
  primary: 0,
  /** Fallback filters are applied when primary yields no results. */
  fallback: 1,
};

/**
 * A chain of stream filters that supports AND/OR composition
 * and primary/fallback priority grouping.
 */
export class StreamFilterChain {
  /**
   * @param {object|Array<object>} initialFilter - Initial filter(s) to add.
   * @param {boolean} [allowPassthrough=false] - Whether passthrough filters are allowed.
   */
  constructor(initialFilter, allowPassthrough = false) {
    this.allowPassthrough = allowPassthrough;

    /** @type {{ [FilterPriority]: Array<{filter: object, isAnd: boolean}> }} */
    this.filters = {
      [FilterPriority.primary]: [],
      [FilterPriority.fallback]: [],
    };

    if (Array.isArray(initialFilter)) {
      initialFilter.forEach((f) => this.and(f, FilterPriority.primary));
    } else {
      this.and(initialFilter);
    }
  }

  /**
   * Adds a filter with AND semantics (intersection).
   * If the filter is the passthrough sentinel, it is ignored.
   *
   * @param {object} filter - The stream filter to add.
   * @param {number} [priority=FilterPriority.primary] - Which priority group.
   * @returns {this}
   */
  and(filter, priority = FilterPriority.primary) {
    if (filter !== PASSTHROUGH_FILTER) {
      this.filters[priority].push({ filter, isAnd: true });
    }
    return this;
  }

  /**
   * Adds a filter with OR semantics (fallback).
   * The OR filter is tried only when the preceding filters yield zero results.
   *
   * @param {object} filter - The stream filter to add.
   * @param {number} [priority=FilterPriority.primary] - Which priority group.
   * @returns {this}
   */
  or(filter, priority = FilterPriority.primary) {
    this.filters[priority].push({ filter, isAnd: false });
    return this;
  }

  /**
   * Removes filters that do not satisfy the predicate.
   *
   * @param {function(number, object): boolean} predicate - Receives (priority, filter).
   */
  filter(predicate) {
    [FilterPriority.primary, FilterPriority.fallback].forEach((priority) => {
      this.filters[priority] = this.filters[priority].filter((entry) =>
        predicate(priority, entry.filter)
      );
    });
  }

  /**
   * Applies the filter chain to a list of streams.
   *
   * AND filters narrow the current result set; OR filters re-apply
   * to the original stream list when the current result is empty.
   *
   * @param {Array} streams - The full list of available streams.
   * @param {*} arg1 - Additional context argument (e.g., media type).
   * @param {*} arg2 - Additional context argument.
   * @param {*} arg3 - Additional context argument.
   * @returns {Array} The filtered stream list.
   */
  filterStreams(streams, arg1, arg2, arg3) {
    return [FilterPriority.primary, FilterPriority.fallback].reduce(
      (result, priority) => {
        return this.filters[priority].reduce((current, entry) => {
          if (entry.isAnd) {
            // AND: narrow the current set
            return entry.filter.filterStreams(current, arg1, arg2, arg3);
          }
          // OR: use as fallback when current is empty
          if (current.length === 0) {
            return entry.filter.filterStreams(streams, arg1, arg2, arg3);
          }
          return current;
        }, result);
      },
      streams
    );
  }
}
