/**
 * Netflix Cadmium Player — ThroughputTracker
 *
 * Sliding-window throughput (bitrate) tracker that accumulates byte counts
 * over fixed time slots and computes per-slot throughput in bits/second.
 *
 * The tracker divides time into slots of `slotDuration` ms and maintains
 * a circular window of at most `windowDuration / slotDuration` slots.
 * Each sample (bytes transferred over a time range) is distributed across
 * the appropriate slots. A companion `times` array tracks how many ms
 * of active transfer time each slot has seen, so throughput = 8 * bytes / time.
 *
 * Supports two interpolation modes for querying:
 *   - "last": fill gaps with the previous slot's throughput
 *   - "average": exponentially weighted moving average across slots
 *
 * @module monitoring/ThroughputTracker
 * @original Module_72697
 */

// import { u as DEBUG } from '../utils/AseGlobals';       // Module 48170
// import { assert } from '../assert/AssertionUtils';       // Module 52571

export class ThroughputTracker {
    /**
     * @param {number} windowDuration - Total window duration in ms
     * @param {number} slotDuration - Duration of each time slot in ms
     * @param {Function} [onEvict] - Callback invoked with evicted slot's throughput
     */
    constructor(windowDuration, slotDuration, onEvict) {
        /** @type {number} Total window duration in ms */
        this.windowDuration = windowDuration;

        /** @type {number} Duration of each time slot in ms */
        this.slotDuration = slotDuration;

        /** @type {Function|undefined} Callback when a slot is evicted from the window */
        this.onEvict = onEvict;

        /** @type {number} Maximum number of slots in the window */
        this.maxSlots = Math.floor((windowDuration + slotDuration - 1) / slotDuration);

        this.reset();
    }

    /**
     * Reset all internal state.
     */
    reset() {
        /** @type {number[]} Byte counts per slot */
        this.byteCounts = [];

        /** @type {number[]} Active transfer time (ms) per slot */
        this.times = [];

        /** @type {number|null} Current time cursor (right edge of the window) */
        this.cursor = null;

        /** @type {number|null} Start time of the current active transfer period */
        this.activeStart = null;
    }

    /**
     * Evict the oldest slot from the window.
     * Invokes the onEvict callback with the slot's throughput if provided.
     * @private
     */
    _evictOldest() {
        if (this.onEvict) {
            this.onEvict(this._computeSlotThroughput(this.byteCounts[0], 0));
        }
        this.byteCounts.shift();
        this.times.shift();
    }

    /**
     * Compute throughput (bits/sec) for a specific slot.
     * @param {number} bytes - Byte count in the slot
     * @param {number} index - Slot index
     * @returns {number|null} Throughput in bits/sec, or null if no active time
     * @private
     */
    _computeSlotThroughput(bytes, index) {
        const activeTime = this._getSlotActiveTime(index);
        return activeTime === 0 ? null : (8 * bytes) / activeTime;
    }

    /**
     * Get the active transfer time for a slot, including any ongoing transfer.
     * @param {number} index - Slot index
     * @returns {number} Active time in ms (scaled to seconds for bits/sec)
     * @private
     */
    _getSlotActiveTime(index) {
        let time = this.times[index];
        if (this.activeStart !== null) {
            const slotStart =
                this.cursor - (this.byteCounts.length - index - 1) * this.slotDuration;
            if (slotStart > this.activeStart) {
                time =
                    slotStart - this.activeStart <= this.slotDuration
                        ? time + (slotStart - this.activeStart)
                        : this.slotDuration;
            }
        }
        return time;
    }

    /**
     * Add bytes to a specific slot.
     * @param {number} index - Slot index
     * @param {number} bytes - Byte count to add
     * @private
     */
    _addToSlot(index, bytes) {
        this.byteCounts[index] = (this.byteCounts[index] || 0) + bytes;
    }

    /**
     * Append a new empty slot to the end of the window.
     * @private
     */
    _pushSlot() {
        this.byteCounts.push(0);
        this.times.push(0);
        this.cursor += this.slotDuration;
    }

    /**
     * Record a data transfer sample.
     * Distributes the bytes across the appropriate time slots.
     *
     * @param {number} bytes - Number of bytes transferred
     * @param {number} startTime - Transfer start time (ms)
     * @param {number} endTime - Transfer end time (ms)
     */
    addSample(bytes, startTime, endTime) {
        // Initialize cursor on first sample
        if (this.cursor === null) {
            const slotsNeeded = Math.max(
                Math.floor((endTime - startTime + this.slotDuration - 1) / this.slotDuration),
                1
            );
            this.cursor = startTime;
            while (this.byteCounts.length < slotsNeeded) {
                this._pushSlot();
            }
        }

        // Extend window to cover endTime
        while (this.cursor <= endTime) {
            this._pushSlot();
            if (this.byteCounts.length > this.maxSlots) {
                this._evictOldest();
            }
        }

        // Track the earliest sample start time
        if (this.activeStart === null || startTime < this.activeStart) {
            this.activeStart = startTime;
        }

        // Distribute bytes across slots
        if (startTime > this.cursor - this.slotDuration) {
            // Entirely within the last slot
            this._addToSlot(this.byteCounts.length - 1, bytes);
        } else if (startTime === endTime) {
            // Zero-duration sample: place in the appropriate slot
            const slotIndex =
                this.byteCounts.length -
                Math.max(Math.ceil((this.cursor - endTime) / this.slotDuration), 1);
            if (slotIndex >= 0) {
                this._addToSlot(slotIndex, bytes);
            }
        } else {
            // Spans multiple slots: distribute proportionally
            for (let i = 1; i <= this.byteCounts.length; ++i) {
                const slotStart = this.cursor - i * this.slotDuration;
                const slotEnd = slotStart + this.slotDuration;

                if (slotStart > endTime) continue;
                if (slotEnd < startTime) break;

                const overlap = Math.min(slotEnd, endTime) - Math.max(slotStart, startTime);
                const fraction = overlap / (endTime - startTime);
                this._addToSlot(
                    this.byteCounts.length - i,
                    Math.round(bytes * fraction)
                );
            }
        }

        // Trim excess slots
        while (this.byteCounts.length > this.maxSlots) {
            this._evictOldest();
        }
    }

    /**
     * Mark a playback start point. Initializes cursor and activeStart
     * if they haven't been set yet.
     * @param {number} time - Start time (ms)
     */
    start(time) {
        if (this.activeStart === null) this.activeStart = time;
        if (this.cursor === null) this.cursor = time;
    }

    /**
     * Record a timer tick / seek event. Extends the window to cover the given
     * time, updates active transfer times for all slots, and resets activeStart.
     *
     * If the gap since the last cursor position exceeds 10x the window duration,
     * the tracker is reset entirely (data is stale).
     *
     * @param {number} time - Current time (ms)
     */
    recordTimerTick(time) {
        if (this.cursor === null) return;

        // Reset if data is too stale
        if (time - this.cursor > 10 * this.windowDuration) {
            this.reset();
            return;
        }

        // Extend window
        while (this.cursor <= time) {
            this._pushSlot();
            if (this.byteCounts.length > this.maxSlots) {
                this._evictOldest();
            }
        }

        // Update active times for slots that overlap the active period
        const endIndex =
            this.byteCounts.length - Math.ceil((this.cursor - time) / this.slotDuration);
        const startIndex =
            this.byteCounts.length -
            Math.ceil((this.cursor - this.activeStart) / this.slotDuration);

        if (DEBUG) {
            assert(endIndex >= startIndex, 'end index must be after start index');
        }

        if (endIndex >= 0) {
            let adjustedStartIndex = startIndex;
            if (adjustedStartIndex < 0) {
                this.activeStart = this.cursor - this.slotDuration * this.byteCounts.length;
                adjustedStartIndex = 0;
            }

            if (adjustedStartIndex === endIndex) {
                this.times[adjustedStartIndex] += time - this.activeStart;
            } else if (endIndex > adjustedStartIndex) {
                // First partial slot
                this.times[adjustedStartIndex] +=
                    (this.cursor - this.activeStart) % this.slotDuration;
                // Last partial slot
                this.times[endIndex] +=
                    this.slotDuration - ((this.cursor - time) % this.slotDuration);
                // Full slots in between
                for (let i = adjustedStartIndex + 1; i < endIndex; ++i) {
                    this.times[i] = this.slotDuration;
                }
            }
        }

        this.activeStart = null;
    }

    /**
     * Query the throughput history with interpolation.
     *
     * @param {string} mode - "last" (forward-fill) or "average" (EWMA)
     * @param {number} [halfLifeMs=2000] - Half-life in ms for "average" mode
     * @returns {Array<number|null>} Per-slot throughput values (bits/sec)
     */
    query(mode, halfLifeMs) {
        const throughputs = this.byteCounts.map((bytes, i) =>
            this._computeSlotThroughput(bytes, i)
        );

        if (mode === 'last') {
            // Forward-fill: replace nulls with the previous value
            for (let i = 0; i < throughputs.length; ++i) {
                if (throughputs[i] === null) {
                    throughputs[i] = i > 0 ? throughputs[i - 1] : 0;
                }
            }
        } else if (mode === 'average') {
            // Exponentially weighted moving average
            const alpha = 1 - Math.pow(0.5, 1 / ((halfLifeMs || 2000) / this.slotDuration));
            let ewma = undefined;
            for (let i = 0; i < throughputs.length; ++i) {
                if (throughputs[i] === null) {
                    throughputs[i] = Math.floor(ewma || 0);
                } else {
                    ewma =
                        ewma !== undefined
                            ? alpha * throughputs[i] + (1 - alpha) * ewma
                            : throughputs[i];
                }
            }
        }

        return throughputs;
    }

    /**
     * Update the window duration (re-computes max slots).
     * @param {number} newWindowDuration - New window duration in ms
     */
    setWindowDuration(newWindowDuration) {
        this.maxSlots = Math.floor(
            (newWindowDuration + this.slotDuration - 1) / this.slotDuration
        );
    }
}
