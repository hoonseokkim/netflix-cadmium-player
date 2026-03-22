/**
 * @module SampleGroupList
 * @description Manages a list of sample groups (chunks of media samples) from MP4 containers.
 * Each sample group holds timing/offset/size data. This class provides methods to
 * access individual groups, compute total byte lengths, and locate a specific
 * sample by global index across all groups.
 * @original Module_20880
 */

/**
 * A collection of sample groups from an MP4 media segment.
 * Each group contains timing metadata, byte offsets, and sample sizes.
 */
export class SampleGroupList {
    /**
     * @param {Object} initialGroup - The first sample group to add
     * @param {number} initialGroup.timescaleValue - The timescale for this group
     * @param {number} initialGroup.length - Number of samples in the group
     * @param {*} initialGroup.og - Offset/timing data for the group
     * @param {Array<number>} initialGroup.sizes - Array of sample byte sizes
     */
    constructor(initialGroup) {
        /** @private @type {Array<Object>} */
        this._groups = [];
        this._groups.push(initialGroup);
    }

    /**
     * The timescale value from the first sample group.
     * @type {number}
     */
    get timescale() {
        return this._groups[0].timescaleValue;
    }

    /**
     * Number of sample groups in this list.
     * @type {number}
     */
    get length() {
        return this._groups.length;
    }

    /**
     * Total byte size of all samples across all groups (cached after first computation).
     * @type {number}
     */
    get totalByteLength() {
        return this._cachedTotalBytes ??= this._groups.reduce(
            (sum, group) => sum + group.length,
            0
        );
    }

    /**
     * Returns the offset/timing data for a sample group at the given index.
     *
     * @param {number} groupIndex - Index of the sample group
     * @returns {*} The offset/timing data for the group
     */
    getGroupOffsets(groupIndex) {
        return this._groups[groupIndex].og;
    }

    /**
     * Returns the sample sizes array for a sample group at the given index.
     *
     * @param {number} groupIndex - Index of the sample group
     * @returns {Array<number>} Array of sample byte sizes
     */
    getGroupSizes(groupIndex) {
        return this._groups[groupIndex].sizes;
    }

    /**
     * Adds a new sample group to the list.
     *
     * @param {Object} group - The sample group to add
     */
    add(group) {
        this._groups.push(group);
    }

    /**
     * Locates a sample by its global index across all groups.
     * Returns a [groupIndex, localSampleIndex] tuple.
     *
     * @param {number} globalIndex - The global sample index
     * @returns {[number, number]} Tuple of [groupIndex, localSampleIndex]
     */
    findSampleLocation(globalIndex) {
        let groupIndex = 0;
        let remaining = globalIndex;

        while (remaining >= 0) {
            const group = this._groups[groupIndex];
            if (remaining < group.length) {
                break;
            }
            groupIndex++;
            remaining -= group.length;
        }

        return [groupIndex, remaining];
    }
}

export default SampleGroupList;
