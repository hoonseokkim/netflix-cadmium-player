/**
 * @file BinaryHeap.js
 * @description A min-heap (priority queue) implementation used throughout the player
 *              for scheduling and ordering tasks. Supports push, pop, peek, remove,
 *              find, and audit operations. Default comparison is numeric ascending.
 * @module core/BinaryHeap
 * @original Module_50214
 */

/**
 * Default numeric comparator.
 * @param {number} a
 * @param {number} b
 * @returns {number} -1 if a < b, 1 if a > b, 0 if equal
 * @private
 */
function defaultCompare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * A binary min-heap (priority queue) implementation.
 *
 * Elements are ordered by a comparator function. The element with the
 * smallest value (per the comparator) is always at the top.
 *
 * @template T
 */
export class BinaryHeap {
  /**
   * @param {T[]} [initialData=[]] - Initial elements to heapify
   * @param {Function} [comparator=defaultCompare] - Comparison function (a, b) => number
   */
  constructor(initialData, comparator) {
    /** @type {T[]} Internal array storage */
    this.data = initialData || [];

    /** @type {Function} Comparison function */
    this.compare = comparator || defaultCompare;

    // Build the heap from existing data (heapify)
    if (!this.empty) {
      for (let i = (this.length >> 1) - 1; i >= 0; i--) {
        this._siftDown(i);
      }
    }
  }

  /**
   * Number of elements in the heap.
   * @returns {number}
   */
  get length() {
    return this.data.length;
  }

  /**
   * Whether the heap is empty.
   * @returns {boolean}
   */
  get empty() {
    return this.data.length === 0;
  }

  /**
   * Adds an element to the heap, maintaining heap order.
   * @param {T} element
   */
  push(element) {
    this.data.push(element);
    this._siftUp(this.length - 1);
  }

  /**
   * Removes and returns the minimum element (root).
   * @returns {T|undefined} The minimum element, or undefined if empty
   */
  pop() {
    if (this.empty) return undefined;

    const top = this.data[0];
    const last = this.data.pop();

    if (!this.empty) {
      this.data[0] = last;
      this._siftDown(0);
    }

    return top;
  }

  /**
   * Returns the minimum element without removing it.
   * @returns {T|undefined}
   */
  peek() {
    return this.data[0];
  }

  /**
   * Removes an element and re-inserts it (for when priority changes).
   * @param {T} element
   */
  update(element) {
    this.remove(element);
    this.push(element);
  }

  /**
   * Maps each element through a callback function.
   * @param {Function} callback
   * @returns {Array}
   */
  map(callback) {
    return this.data.map(callback);
  }

  /**
   * Finds the first element matching a predicate.
   * @param {Function} predicate
   * @returns {T|undefined}
   */
  find(predicate) {
    return this.data.filter(predicate)[0];
  }

  /**
   * Removes all elements from the heap.
   */
  clear() {
    this.data = [];
  }

  /**
   * Removes a specific element from the heap by identity.
   * @param {T} element - The element to remove
   */
  remove(element) {
    const arr = this.data;
    const index = arr.indexOf(element);

    if (index === -1) return;

    const last = arr.pop();

    if (index < arr.length) {
      arr[index] = last;
      const parentIndex = (index - 1) >> 1;
      const parent = arr[parentIndex];

      if (parentIndex >= 0 && this.compare(last, parent) < 0) {
        this._siftUp(index);
      } else {
        this._siftDown(index);
      }
    }
  }

  /**
   * Validates the heap invariant. Throws if any child is smaller than its parent.
   * Useful for debugging and testing.
   * @throws {Error} If the heap invariant is violated
   */
  audit() {
    const arr = this.data;
    for (let i = 1; i < arr.length; i++) {
      if (this.compare(arr[i], arr[(i - 1) >> 1]) < 0) {
        throw new Error(`Audit failed at position ${i} of ${arr}`);
      }
    }
  }

  /**
   * Checks whether an element exists in the heap.
   * @param {T} element
   * @returns {boolean}
   */
  contains(element) {
    return this.data.indexOf(element) >= 0;
  }

  /**
   * Returns a shallow copy of the internal data array.
   * @returns {T[]}
   */
  toArray() {
    return this.data.concat([]);
  }

  /**
   * Moves an element up toward the root until heap order is restored.
   * @param {number} index
   * @private
   */
  _siftUp(index) {
    const arr = this.data;
    const cmp = this.compare;
    const element = arr[index];

    while (index > 0) {
      const parentIndex = (index - 1) >> 1;
      const parent = arr[parentIndex];

      if (cmp(element, parent) >= 0) break;

      arr[index] = parent;
      index = parentIndex;
    }

    arr[index] = element;
  }

  /**
   * Moves an element down toward the leaves until heap order is restored.
   * @param {number} index
   * @private
   */
  _siftDown(index) {
    const arr = this.data;
    const cmp = this.compare;
    const halfLength = this.length >> 1;
    const element = arr[index];

    while (index < halfLength) {
      let leftIndex = (index << 1) + 1;
      let bestChild = arr[leftIndex];
      const rightIndex = leftIndex + 1;

      if (rightIndex < this.length && cmp(arr[rightIndex], bestChild) < 0) {
        leftIndex = rightIndex;
        bestChild = arr[rightIndex];
      }

      if (cmp(bestChild, element) >= 0) break;

      arr[index] = bestChild;
      index = leftIndex;
    }

    arr[index] = element;
  }
}
