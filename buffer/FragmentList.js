/**
 * @file FragmentList.js
 * @description An ordered, array-like collection of media fragments with gap tracking.
 * Provides standard array operations (push, pop, splice, etc.) along with
 * binary-search-based lookups by presentation time. Tracks content length
 * and maintains a contiguous-range state tracker that detects gaps between
 * fragments. Used by the buffer management system to track which fragments
 * are buffered and their time ranges.
 * @module buffer/FragmentList
 * @see Module_71472
 */

import { assert } from '../assert/Assert.js';
import { ContiguousRange } from '../buffer/ContiguousRange.js';

/**
 * An ordered collection of media fragments that tracks content ranges and gaps.
 * Implements standard array-like iteration (Symbol.iterator), search, and
 * mutation operations while maintaining buffer state metadata.
 */
export class FragmentList {
  /**
   * @param {Object} console - Console/logger instance for debug output
   * @param {Array|FragmentList} [initialFragments] - Optional initial fragments to populate
   */
  constructor(console, initialFragments) {
    /** @type {Object} */
    this.console = console;

    /** @private @type {Array<Object>} Internal fragment storage */
    this._fragments = [];

    /** @private @type {ContiguousRange|undefined} Current contiguous range state */
    this._rangeState = undefined;

    /** @private @type {number} Total content length in bytes */
    this._contentLength = 0;

    if (initialFragments?.length) {
      if (Array.isArray(initialFragments)) {
        this._fragments = initialFragments.slice();
        this._onFragmentsAdded(0, this._fragments.length);
      } else if (initialFragments instanceof FragmentList) {
        this._fragments = initialFragments._fragments.slice();
        this._onFragmentsAdded(0, this._fragments.length);
      }
    }
  }

  // ─── Properties ──────────────────────────────────────────

  /** @type {number} Number of fragments in the list */
  get length() {
    return this._fragments.length;
  }

  /** @type {boolean} Whether the list is empty */
  get empty() {
    return this._fragments.length === 0;
  }

  /** @type {Object|undefined} The first fragment */
  get first() {
    return this._fragments[0];
  }

  /** @type {Object|undefined} The last fragment */
  get last() {
    return this._fragments[this._fragments.length - 1];
  }

  /** @type {number|undefined} Content start ticks of the first fragment */
  get contentStartTicks() {
    return this.first?.contentStartTicks;
  }

  /** @type {number|undefined} Content end ticks of the last contiguous fragment */
  get contentEndTicks() {
    return this.last?.contentEndTicks;
  }

  /** @type {ContiguousRange|undefined} Current contiguous range state */
  get rangeState() {
    return this._rangeState;
  }

  /** @type {number} Total content length in bytes */
  get totalContentLength() {
    return this._contentLength;
  }

  /** @type {number|undefined} Timescale value from the first fragment */
  get timescale() {
    return this.first?.timescaleValue;
  }

  /** @type {*} Cached metadata from the first fragment */
  get cachedMetadata() {
    return this.first?.cachedMetadata;
  }

  /** @type {Array<Object>} Direct access to the internal fragment array */
  get fragments() {
    return this._fragments;
  }

  // ─── Content Length ──────────────────────────────────────

  /**
   * Adds to the total content length counter.
   * @param {number} bytes - Number of bytes to add
   */
  addContentLength(bytes) {
    this._contentLength += bytes;
  }

  // ─── Validation ──────────────────────────────────────────

  /**
   * Validates the internal consistency of the fragment list.
   * Asserts that fragments are contiguous, content length is accurate,
   * and the range state matches the actual fragment boundaries.
   */
  trimToEditBoundaries() {
    if (this._fragments.length === 0) {
      assert(this._rangeState === undefined);
      assert(this._contentLength === 0);
    } else {
      assert(this._rangeState instanceof ContiguousRange);
      assert(typeof this._contentLength === 'number');
      assert(this._lastValidated !== undefined && this._lastValidated.contentStartTicks === this.contentStartTicks);

      const endTicks = this._fragments.reduce((acc, frag, i) => {
        return i === 0 || frag.contentStartTicks === acc ? frag.contentEndTicks : acc;
      }, 0);
      assert(this._lastValidated.contentEndTicks === endTicks);

      assert(
        this._fragments.reduce((acc, frag, i) => {
          return i === 0 || frag.contentStartTicks === acc ? frag.contentEndTicks : acc;
        }, 0) === this._lastValidated.contentEndTicks
      );

      assert(
        this._fragments.reduce((acc, frag) => acc + frag.la, 0) === this._contentLength
      );
    }
  }

  // ─── Element Access ──────────────────────────────────────

  /**
   * Gets a fragment by index (supports negative indices).
   * @param {number} index - The fragment index
   * @returns {Object|undefined}
   */
  get(index) {
    if (index < 0) index += this._fragments.length;
    return this._fragments[index];
  }

  // ─── Mutation Methods ────────────────────────────────────

  /**
   * Appends a fragment to the end of the list.
   * @param {Object} fragment
   * @returns {number} New length
   */
  push(fragment) {
    this._fragments.push(fragment);
    this._onFragmentsAdded(this._fragments.length - 1);
    return this.length;
  }

  /**
   * Prepends a fragment to the beginning of the list.
   * @param {Object} fragment
   * @returns {number} New length
   */
  unshift(fragment) {
    this._fragments.unshift(fragment);
    this._onFragmentsAdded(0, 1);
    return this.length;
  }

  /**
   * Removes and returns the last fragment.
   * @returns {Object|undefined}
   */
  pop() {
    if (this._fragments.length === 0) return;
    this._onFragmentsRemoved(this._fragments.length - 1);
    return this._fragments.pop();
  }

  /**
   * Removes and returns the first fragment.
   * @returns {Object|undefined}
   */
  shift() {
    if (this._fragments.length === 0) return;
    this._onFragmentsRemoved(0);
    return this._fragments.shift();
  }

  /**
   * Removes/inserts fragments at a specified position.
   * @param {number} start - Start index
   * @param {number} [deleteCount] - Number of elements to remove
   * @param {...Object} items - Elements to insert
   * @returns {Array<Object>} Removed elements
   */
  splice(start, deleteCount, ...items) {
    if (start < 0) start += this._fragments.length;
    if (start < 0) start = 0;
    if (start > this._fragments.length) start = this._fragments.length;
    if (deleteCount === undefined || deleteCount < 0) deleteCount = 0;
    deleteCount = Math.min(deleteCount, this._fragments.length - start);

    if (deleteCount > 0) {
      this._onFragmentsRemoved(start, start + deleteCount);
    }

    const removed = this._fragments.splice(start, deleteCount, ...items);

    if (items.length > 0) {
      this._onFragmentsAdded(start, start + items.length);
    }

    return removed;
  }

  /**
   * Returns a new FragmentList containing a shallow copy of a portion.
   * @param {number} [start=0]
   * @param {number} [end=length]
   * @returns {FragmentList}
   */
  slice(start = 0, end = this._fragments.length) {
    if (start < 0) start += this._fragments.length;
    if (start >= this._fragments.length) return new FragmentList(this.console);
    if (end > this._fragments.length) end = this._fragments.length;
    if (end < 0) end += this._fragments.length;
    return new FragmentList(this.console, this._fragments.slice(start, end));
  }

  /**
   * Inserts a fragment in sorted order by content start ticks.
   * Uses binary search for efficient insertion into the correct position.
   * @param {Object} fragment - The fragment to insert
   */
  insertNode(fragment) {
    if (this._fragments.length === 0 || fragment.contentStartTicks >= this.contentEndTicks) {
      this.push(fragment);
    } else if (fragment.contentEndTicks <= this.contentStartTicks) {
      this.unshift(fragment);
    } else {
      let low = 0;
      let high = this._fragments.length - 1;

      while (low < high - 1) {
        const mid = Math.floor((high + low) / 2);
        assert(mid !== high && mid !== low);
        if (fragment.contentStartTicks >= this._fragments[mid].contentEndTicks) {
          low = mid;
        } else {
          high = mid;
        }
      }

      assert(low !== high, 'Fragments may not be in order');
      assert(
        this._fragments[low].contentEndTicks <= fragment.contentStartTicks &&
        this._fragments[high].contentStartTicks >= fragment.contentEndTicks,
        'Inserted fragment does not fit within array'
      );

      this.splice(high, 0, fragment);
    }
  }

  /**
   * Removes a specific fragment from the list.
   * @param {Object} fragment - The fragment to remove
   * @returns {boolean} Whether the fragment was found and removed
   */
  remove(fragment) {
    const index = this._fragments.indexOf(fragment);
    if (index < 0) return false;
    this.splice(index, 1);
    return true;
  }

  /**
   * Concatenates multiple FragmentLists into a new one.
   * @param {...FragmentList} lists
   * @returns {FragmentList}
   */
  concat(...lists) {
    const arrays = lists.map((list) => list._fragments);
    return new FragmentList(
      this.console,
      Array.prototype.concat.apply(this._fragments, arrays)
    );
  }

  // ─── Iteration Methods ───────────────────────────────────

  /** @param {Function} callback */
  forEach(callback) {
    this._fragments.forEach((frag, i) => callback(frag, i, this));
  }

  /** @param {Function} callback @returns {boolean} */
  some(callback) {
    return this._fragments.some((frag, i) => callback(frag, i, this));
  }

  /** @param {Function} callback @returns {boolean} */
  every(callback) {
    return this._fragments.every((frag, i) => callback(frag, i, this));
  }

  /** @param {Function} callback @returns {Array} */
  map(callback) {
    return this._fragments.map((frag, i) => callback(frag, i, this));
  }

  /** @param {Function} callback @param {*} initial @returns {*} */
  reduce(callback, initial) {
    return this._fragments.reduce((acc, frag, i) => callback(acc, frag, i, this), initial);
  }

  /** @param {Object} fragment @returns {number} */
  indexOf(fragment) {
    return this._fragments.indexOf(fragment);
  }

  /** @param {Function} callback @returns {Object|undefined} */
  find(callback) {
    let foundIndex;
    return this._fragments.some((frag, i) => {
      foundIndex = i;
      return callback(frag, i, this);
    }) ? this._fragments[foundIndex] : undefined;
  }

  /** @param {Function} callback @returns {number} */
  findIndex(callback) {
    let foundIndex;
    return this._fragments.some((frag, i) => {
      foundIndex = i;
      return callback(frag, i, this);
    }) ? foundIndex : -1;
  }

  /** @param {Function} callback @returns {FragmentList} */
  filter(callback) {
    return new FragmentList(
      this.console,
      this._fragments.filter((frag, i) => callback(frag, i, this))
    );
  }

  /**
   * Iterates fragments in reverse order.
   * @param {Function} callback
   */
  forEachReverse(callback) {
    for (let i = this._fragments.length - 1; i >= 0; --i) {
      callback(this._fragments[i], i, this);
    }
  }

  /**
   * Tests whether any fragment matches (reverse order).
   * @param {Function} callback
   * @returns {boolean}
   */
  someReverse(callback) {
    for (let i = this._fragments.length - 1; i >= 0; --i) {
      if (callback(this._fragments[i], i, this)) return true;
    }
    return false;
  }

  // ─── Binary Search Methods ───────────────────────────────

  /**
   * Binary search for a fragment by presentation time using presentation start/end.
   * @param {number} time - The presentation time to search for
   * @returns {number} Fragment index, or -1 if not found
   */
  findByPresentationTime(time) {
    if (this.empty || time < this.first.presentationStartTime.playbackSegment || time >= this.last.segmentEndTime.playbackSegment) {
      return -1;
    }

    let low = 0;
    let high = this._fragments.length - 1;

    while (high > low) {
      const mid = Math.floor((high + low) / 2);
      if (time >= this._fragments[mid].presentationStartTime.playbackSegment &&
          time < this._fragments[mid].segmentEndTime.playbackSegment) {
        high = mid;
        break;
      }
      if (time < this._fragments[mid].segmentEndTime.playbackSegment) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    return high;
  }

  /**
   * Binary search for a fragment by timestamp range.
   * @param {number} time - The timestamp to search for
   * @returns {number} Fragment index, or -1 if not found
   */
  findByTimestamp(time) {
    if (this.empty || time < this.first.timestamp.playbackSegment || time >= this.last.previousState.playbackSegment) {
      return -1;
    }

    let low = 0;
    let high = this._fragments.length - 1;

    while (high > low) {
      const mid = Math.floor((high + low) / 2);
      if (time >= this._fragments[mid].timestamp.playbackSegment &&
          time < this._fragments[mid].previousState.playbackSegment) {
        high = mid;
        break;
      }
      if (time < this._fragments[mid].previousState.playbackSegment) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    return high;
  }

  /**
   * Finds a fragment containing the given timestamp.
   * @param {number} time
   * @returns {Object|undefined}
   */
  getFragmentAtTimestamp(time) {
    const index = this.findByTimestamp(time);
    return index >= 0 ? this._fragments[index] : undefined;
  }

  /**
   * Moves a fragment from this list to another, maintaining sorted order.
   * @param {Object} fragment - The fragment to transfer
   * @param {FragmentList} targetList - The destination list
   */
  transferTo(fragment, targetList) {
    this.remove(fragment);
    targetList.insertNode(fragment);
  }

  /**
   * Revalidates the range state starting from the first fragment.
   */
  update() {
    if (this._rangeState) {
      this._rangeState.iXc(this.contentStartTicks);
      this._updateRangeState(0);
    }
  }

  // ─── Symbol.iterator ─────────────────────────────────────

  /**
   * Makes FragmentList iterable with for...of loops.
   * @returns {Iterator<Object>}
   */
  *[Symbol.iterator]() {
    for (let i = 0; i < this._fragments.length; i++) {
      yield this._fragments[i];
    }
  }

  // ─── Private Methods ─────────────────────────────────────

  /**
   * Updates the contiguous range state starting from a given index.
   * @param {number} startIndex
   * @private
   */
  _updateRangeState(startIndex) {
    let endTicks = this._fragments[startIndex].contentEndTicks;

    for (let i = startIndex + 1; i < this._fragments.length && endTicks === this._fragments[i].contentStartTicks; ++i) {
      endTicks = this._fragments[i].contentEndTicks;
    }

    if (i < this._fragments.length) {
      // There's a gap
      if (this._rangeState === undefined) {
        this._rangeState = new ContiguousRange(this, { Pb: endTicks });
      } else {
        this._rangeState.f4(endTicks);
      }
    } else {
      // No gap - contiguous to end
      if (this._rangeState === undefined) {
        this._rangeState = new ContiguousRange(this, {});
      } else {
        this._rangeState.tpa();
      }
    }
  }

  /**
   * Called after fragments are added. Updates content length and range state.
   * @param {number} startIndex
   * @param {number} [endIndex]
   * @private
   */
  _onFragmentsAdded(startIndex, endIndex = startIndex + 1) {
    for (let i = startIndex; i < endIndex; ++i) {
      this._contentLength += this._fragments[i].la;
    }

    if (this._rangeState === undefined || startIndex === 0) {
      this._updateRangeState(0);
    } else if (this._rangeState.contentEndTicks === this.contentEndTicks) {
      this._updateRangeState(startIndex - 1);
    } else if (this._fragments[startIndex].contentStartTicks === this._rangeState.contentEndTicks) {
      this._updateRangeState(startIndex);
    }
  }

  /**
   * Called before fragments are removed. Updates content length and range state.
   * @param {number} startIndex
   * @param {number} [endIndex]
   * @private
   */
  _onFragmentsRemoved(startIndex, endIndex = startIndex + 1) {
    if (startIndex === 0) {
      this._rangeState = undefined;
      if (endIndex < this.length) {
        this._updateRangeState(endIndex);
      }
    } else {
      const state = this._rangeState;
      if (state.contentEndTicks > this._fragments[startIndex - 1].contentEndTicks) {
        if (endIndex < this.length) {
          state.f4(this._fragments[startIndex - 1].contentEndTicks);
        } else {
          state.tpa();
        }
      }
    }

    for (let i = startIndex; i < endIndex; ++i) {
      this._contentLength -= this._fragments[i].la;
    }
  }
}
