/**
 * Netflix Cadmium Player - Partitioned List
 *
 * A composite list data structure that partitions elements across multiple
 * sub-lists based on a classification function. Supports all standard list
 * operations (push, pop, shift, unshift, splice, find, map, reduce, forEach, etc.)
 * while maintaining correct indexing across partitions.
 *
 * Used in the streaming pipeline to manage requests separated by priority or type
 * (e.g., active vs pending requests) while presenting a unified list interface.
 *
 * @module PartitionedList
 * @see Module_99735
 */

import { __spreadArray, __read } from '../_tslib.js';

/**
 * A list that distributes elements across multiple internal sub-lists
 * based on a classifier function, while maintaining a unified index space.
 *
 * @template T
 */
export class PartitionedList {
    /**
     * @param {Array<Object>} sublists - Array of sub-list objects, each with standard list methods
     * @param {function(T): number} classifier - Function that returns the sub-list index for a given element
     */
    constructor(sublists, classifier) {
        /** @type {Array<Object>} The internal sub-lists */
        this.sublists = sublists;

        /** @type {function(T): number} Classification function */
        this.classifier = classifier;

        this._recalculate();
    }

    /** @returns {number} Total number of elements across all sub-lists */
    get length() {
        return this.totalLength;
    }

    /** @returns {boolean} Whether the list is empty */
    get empty() {
        return this.totalLength === 0;
    }

    /**
     * Returns the first element in the first non-empty sub-list.
     * @returns {T|undefined}
     */
    first() {
        return this.firstSublist?.key(0);
    }

    /**
     * Returns the last element in the last non-empty sub-list.
     * @returns {T|undefined}
     */
    last() {
        return this.lastSublist?.key(this.lastSublist.length - 1);
    }

    /**
     * Gets an element by global index (supports negative indexing).
     * @param {number} index - Global index
     * @returns {T|undefined}
     */
    key(index) {
        if (index < 0) index += this.length;
        for (let i = 0; i < this.sublists.length; i++) {
            if (this.offsets[i + 1] > index) {
                return this.sublists[i].key(index - this.offsets[i]);
            }
        }
    }

    /**
     * Appends an element to the appropriate sub-list.
     * @param {T} element - Element to add
     * @returns {number} New total length
     */
    push(element) {
        this.sublists[this.classifier(element)].push(element);
        this._recalculate();
        return this.totalLength;
    }

    /**
     * Removes and returns the first element.
     * @returns {T|undefined}
     */
    shift() {
        if (!this.firstSublist) return;
        const element = this.firstSublist.shift();
        this._recalculate();
        return element;
    }

    /**
     * Removes and returns the last element.
     * @returns {T|undefined}
     */
    pop() {
        if (!this.lastSublist) return;
        const element = this.lastSublist.pop();
        this._recalculate();
        return element;
    }

    /**
     * Prepends an element to the appropriate sub-list.
     * @param {T} element - Element to add
     * @returns {number} New total length
     */
    unshift(element) {
        this.sublists[this.classifier(element)].unshift(element);
        this._recalculate();
        return this.totalLength;
    }

    /**
     * Inserts an element into the appropriate sub-list using ordered insertion.
     * @param {T} element
     */
    insertNode(element) {
        const idx = this.classifier(element);
        this.sublists[idx].insertNode(element);
        this._recalculate();
    }

    /**
     * Removes a specific element from whichever sub-list contains it.
     * @param {T} element
     * @returns {boolean} Whether the element was found and removed
     */
    item(element) {
        const found = this.sublists.some(sublist => sublist.item(element));
        if (found) this._recalculate();
        return found;
    }

    /**
     * Splices elements across partition boundaries.
     * @param {number} start - Start index
     * @param {number} deleteCount - Number of elements to remove
     * @param {...T} newElements - Elements to insert
     * @returns {Array<T>} Removed elements
     */
    splice(start, deleteCount, ...newElements) {
        const removed = [];
        const end = start + Math.max(0, deleteCount);
        let insertTarget;

        for (let i = 0; i < this.sublists.length; i++) {
            const sublist = this.sublists[i];
            const subStart = this.offsets[i];
            const subEnd = this.offsets[i + 1];

            if (start < subEnd) {
                const localStart = start - subStart;
                const localEnd = Math.min(end - subStart, sublist.length);

                if (insertTarget === undefined && localStart > 0 && localEnd < sublist.length) {
                    removed.push(...sublist.splice(localStart, localEnd - localStart, ...newElements));
                } else {
                    removed.push(...sublist.splice(localStart, localEnd - localStart));
                    if (insertTarget === undefined) {
                        insertTarget = (i > 0 && localStart === 0) ? i - 1 : i;
                    }
                }

                start = subEnd;
                if (start >= end) break;
            }
        }

        // Insert remaining new elements
        if (newElements.length && insertTarget !== undefined) {
            let classIdx = this.classifier(newElements[0]);

            while (insertTarget > 0 && classIdx < insertTarget && this.sublists[insertTarget].empty) {
                insertTarget--;
            }

            while (newElements.length && classIdx === insertTarget) {
                this.sublists[insertTarget].push(newElements.shift());
                if (!newElements.length) break;
                classIdx = this.classifier(newElements[0]);
            }

            while (newElements.length && ++insertTarget < this.sublists.length && this.sublists[insertTarget].empty) {
                while (newElements.length && classIdx === insertTarget) {
                    this.sublists[insertTarget].push(newElements.shift());
                    if (!newElements.length) break;
                    classIdx = this.classifier(newElements[0]);
                }
            }

            if (newElements.length) {
                const target = this.sublists[insertTarget];
                target.splice(0, 0, ...newElements);
            }
        }

        this._recalculate();
        return removed;
    }

    /**
     * Finds the first element matching a predicate.
     * @param {function(T, number, PartitionedList): boolean} predicate
     * @returns {T|undefined}
     */
    find(predicate) {
        let result;
        this.sublists.some((sublist, subIdx) => {
            result = sublist.find(this._wrapCallback(predicate, subIdx));
            return result !== undefined;
        });
        return result;
    }

    /**
     * Finds the global index of the first element matching a predicate.
     * @param {function(T, number, PartitionedList): boolean} predicate
     * @returns {number} Global index, or -1 if not found
     */
    findIndex(predicate) {
        for (let i = 0; i < this.sublists.length; i++) {
            const localIdx = this.sublists[i].findIndex(this._wrapCallback(predicate, i));
            if (localIdx !== -1) return localIdx + this.offsets[i];
        }
        return -1;
    }

    /**
     * Returns the global index of a specific element.
     * @param {T} element
     * @returns {number} Global index, or -1 if not found
     */
    indexOf(element) {
        for (let i = 0; i < this.sublists.length; i++) {
            const localIdx = this.sublists[i].indexOf(element);
            if (localIdx !== -1) return localIdx + this.offsets[i];
        }
        return -1;
    }

    /**
     * Maps all elements with a callback, returning a flat array.
     * @param {function(T, number, PartitionedList): *} callback
     * @returns {Array}
     */
    map(callback) {
        const mapped = this.sublists.map((sublist, subIdx) =>
            sublist.map(this._wrapCallback(callback, subIdx))
        );
        return Array.prototype.concat.apply([], mapped);
    }

    /**
     * Reduces all elements across partitions.
     * @param {function(*, T, number, PartitionedList): *} reducer
     * @param {*} initialValue
     * @returns {*}
     */
    reduce(reducer, initialValue) {
        return this.sublists.reduce(
            (acc, sublist, subIdx) => sublist.reduce(this._wrapReducer(reducer, subIdx), acc),
            initialValue
        );
    }

    /**
     * Iterates over all elements in order.
     * @param {function(T, number, PartitionedList): void} callback
     */
    forEach(callback) {
        this.sublists.forEach((sublist, subIdx) => {
            sublist.forEach(this._wrapCallback(callback, subIdx));
        });
    }

    /**
     * Iterates in reverse order.
     * @param {function(T, number, PartitionedList): void} callback
     */
    forEachReverse(callback) {
        for (let i = this.sublists.length - 1; i >= 0; i--) {
            this.sublists[i].i0(this._wrapCallback(callback, i));
        }
    }

    /**
     * Tests whether any element matches a predicate.
     * @param {function(T, number, PartitionedList): boolean} predicate
     * @returns {boolean}
     */
    some(predicate) {
        return this.sublists.some((sublist, subIdx) =>
            sublist.some(this._wrapCallback(predicate, subIdx))
        );
    }

    /**
     * Tests whether any element matches, iterating in reverse within sub-lists.
     * @param {function(T, number, PartitionedList): boolean} predicate
     * @returns {boolean}
     */
    someReverse(predicate) {
        for (let i = this.sublists.length - 1; i >= 0; i--) {
            if (this.sublists[i].q6a(this._wrapCallback(predicate, i))) return true;
        }
        return false;
    }

    /**
     * Tests whether all elements match a predicate.
     * @param {function(T, number, PartitionedList): boolean} predicate
     * @returns {boolean}
     */
    every(predicate) {
        return this.sublists.every((sublist, subIdx) =>
            sublist.every(this._wrapCallback(predicate, subIdx))
        );
    }

    /**
     * Iterates elements in sorted order using a comparator, invoking a callback for each.
     * Performs a merge-sort style iteration across all partitions.
     * @param {function(T, T): number} comparator
     * @param {function(T, number, PartitionedList): void} callback
     */
    sortByComparator(comparator, callback) {
        const findMinIndex = (candidates) => {
            return candidates.reduce((minIdx, val, idx, arr) => {
                if (val === undefined) return minIdx;
                if (minIdx === undefined) return idx;
                return comparator(val, arr[minIdx]) < 0 ? idx : minIdx;
            }, undefined);
        };

        const cursors = this.sublists.map(() => 0);
        let exhaustedCount = this.sublists.filter(s => s.empty).length;

        while (exhaustedCount < this.sublists.length) {
            const candidates = cursors.map((cursor, subIdx) =>
                cursor < this.sublists[subIdx].length ? this.sublists[subIdx].key(cursor) : undefined
            );
            const minIdx = findMinIndex(candidates);
            callback(candidates[minIdx], this.offsets[minIdx] + cursors[minIdx], this);
            cursors[minIdx]++;
            if (cursors[minIdx] === this.sublists[minIdx].length) exhaustedCount++;
        }
    }

    /**
     * Removes an element and re-inserts it (moves it to a potentially new position).
     * @param {T} element
     * @returns {boolean} Whether the move succeeded
     */
    move(element) {
        return this.item(element) ? (this.insertNode(element), true) : false;
    }

    /**
     * Moves the first element of sublist[1] to the end of sublist[0].
     */
    promoteFirst() {
        if (this.sublists[1].length) {
            const element = this.sublists[1].shift();
            this.sublists[0].push(element);
            this._recalculate();
        }
    }

    /**
     * Serializes all elements to JSON.
     * @returns {Array}
     */
    toJSON() {
        return this.map(element => element.toJSON());
    }

    /**
     * Recalculates internal offset table and references.
     * Must be called after any structural modification.
     * @private
     */
    _recalculate() {
        this.totalLength = 0;
        this.offsets = [0];
        this.lastSublist = this.firstSublist = undefined;

        for (let i = 0; i < this.sublists.length; i++) {
            const sublist = this.sublists[i];
            this.totalLength += sublist.length;
            this.offsets.push(this.offsets[this.offsets.length - 1] + sublist.length);
            if (!this.firstSublist && sublist.length) this.firstSublist = sublist;
            if (sublist.length) this.lastSublist = sublist;
        }
    }

    /**
     * Wraps a callback to translate local sub-list indices to global indices.
     * @private
     */
    _wrapCallback(callback, sublistIndex) {
        const offset = this.offsets[sublistIndex];
        return (element, localIndex) => callback(element, offset + localIndex, this);
    }

    /**
     * Wraps a reducer to translate local sub-list indices to global indices.
     * @private
     */
    _wrapReducer(reducer, sublistIndex) {
        const offset = this.offsets[sublistIndex];
        return (acc, element, localIndex) => reducer(acc, element, offset + localIndex, this);
    }
}
