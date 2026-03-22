/**
 * Netflix Cadmium Player - Playgraph Position Mapper
 *
 * Maps positions between an "upper" (simplified) playgraph and a "lower"
 * (detailed) playgraph. Used when the player needs to convert between
 * different resolution levels of the segment graph, such as when branching
 * content has been combined or split across playgraphs.
 *
 * The mapper maintains a bidirectional segment-ID mapping and supports:
 * - Looking up the upper segment that corresponds to a lower segment
 * - Looking up all lower segments that correspond to an upper segment
 * - Mapping positions (segment ID + offset) in both directions
 *
 * @module PlaygraphPositionMapper
 * @original Module_43341
 */

// import { __values, __generator, __spreadArray, __read } from '../utils/TsLibHelpers';
// import { TimeUtil, assert, findLast } from '../streaming/SegmentUtils';

/**
 * Finds a segment in a successor chain that matches a target timeline.
 *
 * @param {Iterable} successors - Iterator of successor segments
 * @param {*} targetTimeline - The timeline identifier to match
 * @returns {{ segment: Object|undefined, accumulatedOffset: * }}
 */
function findSegmentOnTimeline(successors, targetTimeline) {
    let accumulatedOffset = TimeUtil.seekToSample;

    for (const segment of successors) {
        if (segment.timeline === targetTimeline) {
            return { segment, accumulatedOffset };
        }
        accumulatedOffset = accumulatedOffset.item(segment.offset);
    }

    return { segment: undefined, accumulatedOffset: TimeUtil.seekToSample };
}

/**
 * Generates a sequence of segments by following default-next pointers.
 *
 * @generator
 * @param {Object} startSegment - The initial segment
 * @param {Array} allSegments - The full list of segments to look up by ID
 * @yields {Object} Segments in default-next order
 */
function* walkDefaultNextChain(startSegment, allSegments) {
    let current = startSegment;
    while (current) {
        yield current;
        const nextId = current.defaultNext ?? undefined;
        current = nextId ? findLast(allSegments, (s) => s.id === nextId) : undefined;
    }
}

/**
 * Maps positions between two playgraph levels (upper and lower).
 */
export class PlaygraphPositionMapper {
    /**
     * @param {Object} upperPlaygraph - The upper (simplified) playgraph
     * @param {Object} lowerPlaygraph - The lower (detailed) playgraph
     * @param {Object} [segmentIdMapping={}] - Map from lower segment ID to upper segment ID
     */
    constructor(upperPlaygraph, lowerPlaygraph, segmentIdMapping = {}) {
        /** @private */
        this.upper = upperPlaygraph;
        /** @private */
        this.lower = lowerPlaygraph;
        /** @private */
        this.segmentIdMapping = segmentIdMapping;
    }

    /**
     * Gets the upper segment ID that a lower segment ID maps to.
     *
     * @param {string} lowerSegmentId - A segment ID in the lower playgraph
     * @returns {string|undefined} The corresponding upper segment ID
     */
    getUpperId(lowerSegmentId) {
        return this.segmentIdMapping[lowerSegmentId];
    }

    /**
     * Gets all lower segment IDs that map to a given upper segment ID.
     *
     * @param {string} upperSegmentId - A segment ID in the upper playgraph
     * @returns {string[]} Array of lower segment IDs
     */
    getLowerIds(upperSegmentId) {
        return Object.keys(this.segmentIdMapping).filter(
            (lowerId) => this.segmentIdMapping[lowerId] === upperSegmentId
        );
    }

    /**
     * Maps a lower-playgraph segment to its corresponding upper-playgraph segment info.
     *
     * @param {Object} lowerSegment - A segment from the lower playgraph
     * @returns {Object|undefined} The upper playgraph segment info, or undefined
     */
    mapSegmentToUpper(lowerSegment) {
        const upperId = this.getUpperId(lowerSegment.id);
        return upperId ? this.upper.getSegmentInfo(upperId) : undefined;
    }

    /**
     * Maps an upper-playgraph segment to its corresponding lower-playgraph segment infos.
     *
     * @param {Object} upperSegment - A segment from the upper playgraph
     * @returns {Object[]} Array of lower playgraph segment infos
     */
    mapSegmentToLower(upperSegment) {
        return this.getLowerIds(upperSegment.id).map((lowerId) =>
            this.lower.getSegmentInfo(lowerId)
        );
    }

    /**
     * Maps a position from lower playgraph coordinates to upper playgraph coordinates.
     *
     * Handles same-timeline segments (direct offset mapping), beginning-of-segment
     * edge cases, end-of-segment edge cases, and cross-timeline interpolation.
     *
     * @param {Object} position - Position in lower playgraph space { M: segmentId, offset }
     * @returns {Object|undefined} Position in upper playgraph space, or undefined
     */
    mapPositionUp(position) {
        const lowerSegment = this.lower.getSegmentInfo(position.M);
        assert(lowerSegment && lowerSegment.containsOffset(position.offset));

        const upperSegment = this.mapSegmentToUpper(lowerSegment);
        if (!upperSegment) return undefined;

        // Same timeline: direct offset conversion
        if (upperSegment.timeline === lowerSegment.timeline) {
            const convertedOffset = upperSegment.convertToLocal(
                lowerSegment.convertToGlobal(position.offset)
            );
            return { M: upperSegment.id, offset: convertedOffset };
        }

        // At the very start with no predecessors mapped to this upper segment
        if (
            position.offset.equal(TimeUtil.seekToSample) &&
            [...this.lower.segmentGraph.getPredecessors(position.M)].filter(
                (s) => this.getUpperId(s.id) === upperSegment.id
            ).length === 0
        ) {
            return { M: upperSegment.id, offset: TimeUtil.seekToSample };
        }

        // At the very end with no successors mapped to this upper segment
        if (
            [...this.lower.segmentGraph.getSuccessors(position.M)].filter(
                (s) => this.getUpperId(s.id) === upperSegment.id
            ).length === 0
        ) {
            return { M: upperSegment.id, offset: upperSegment.offset };
        }

        // Cross-timeline interpolation
        assert(lowerSegment.endTime.isFinite());

        const forward = findSegmentOnTimeline(
            this.lower.segmentGraph.getSuccessors(position.M),
            upperSegment.timeline
        );
        const backward = findSegmentOnTimeline(
            this.lower.segmentGraph.getPredecessors(position.M),
            upperSegment.timeline
        );

        const forwardTime = forward.segment ? forward.segment.startTime : upperSegment.endTime;
        assert(forwardTime);

        const backwardTime = backward.segment ? backward.segment.endTime : upperSegment.startTime;
        assert(backwardTime);

        const totalSpan = backward.accumulatedOffset.item(forward.accumulatedOffset);
        const normalizedProgress = position.offset
            .item(backward.accumulatedOffset)
            .scaledValue(totalSpan);

        const interpolatedTime = backwardTime.item(
            forwardTime.subtract(backwardTime).multiply(normalizedProgress)
        );

        const convertedOffset = upperSegment.convertToLocal(interpolatedTime);
        return { M: upperSegment.id, offset: convertedOffset };
    }

    /**
     * Maps a position from upper playgraph coordinates to lower playgraph coordinates.
     *
     * Walks the default-next chain of lower segments to find the correct segment
     * and interpolate the offset.
     *
     * @param {Object} position - Position in upper playgraph space { M: segmentId, offset }
     * @returns {Object} Position in lower playgraph space
     */
    mapPositionDown(position) {
        const upperSegment = this.upper.getSegmentInfo(position.M);
        assert(upperSegment);

        const timeline = upperSegment.timeline;
        const localOffset = upperSegment.convertFromExternal(position.offset);
        const globalTime = upperSegment.convertToGlobal(localOffset);
        assert(globalTime);

        const lowerSegments = this.mapSegmentToLower(upperSegment);

        // Direct match: same timeline and contains the time
        const directMatches = lowerSegments
            .filter((s) => s.timeline === timeline)
            .filter((s) => s.containsTime(globalTime));

        if (directMatches.length) {
            const match = directMatches[0];
            return { M: match.id, offset: match.convertToLocal(globalTime) };
        }

        // At beginning with no predecessors in upper graph
        if (localOffset.equal(TimeUtil.seekToSample) && !this.upper.hasPredecessors(position.M)) {
            return { M: lowerSegments[0].id, offset: TimeUtil.seekToSample };
        }

        // At end with no successors in upper graph
        if (
            localOffset.equal(upperSegment.offset) &&
            !this.upper.hasSuccessors(position.M)
        ) {
            const lastSegment = lowerSegments[lowerSegments.length - 1];
            return { M: lastSegment.id, offset: lastSegment.offset };
        }

        // Walk default-next chain and interpolate
        const defaultNextIds = new Set(
            lowerSegments.map((s) => s.defaultNext).filter(Boolean)
        );
        const headSegments = lowerSegments.filter((s) => !defaultNextIds.has(s.id));
        const tailSegments = lowerSegments.filter((s) => defaultNextIds.has(s.id));

        for (const headSegment of headSegments) {
            const chain = [...walkDefaultNextChain(headSegment, tailSegments)];
            const intervals = [];
            let prevEnd;
            let lastSeg;

            for (const seg of chain) {
                lastSeg = seg;
                if (prevEnd) {
                    intervals.push({ time: prevEnd, segment: seg, isEnd: false });
                }
                prevEnd = undefined;

                if (seg.timeline === timeline) {
                    intervals.push({ time: seg.startTime, segment: seg, isEnd: false });
                    prevEnd = seg.endTime;
                } else if (intervals.length === 0) {
                    intervals.push({
                        time: upperSegment.startTime,
                        segment: seg,
                        isEnd: false,
                    });
                }
            }

            if (lastSeg) {
                if (prevEnd) {
                    intervals.push({ time: prevEnd, segment: lastSeg, isEnd: true });
                } else {
                    intervals.push({
                        time: upperSegment.endTime,
                        segment: lastSeg,
                        isEnd: true,
                    });
                }
            }

            // Binary search for the matching interval
            const lowerBound = intervals.find((i) => i.time.isAfterOrEqual(globalTime));
            const upperBound = findLast(intervals, (i) => i.time.isBefore(globalTime));

            if (
                lowerBound &&
                upperBound &&
                lowerBound.time.isAfterOrEqual(globalTime) &&
                upperBound.time.isBefore(globalTime)
            ) {
                if (lowerBound.segment.id === upperBound.segment.id) {
                    return { M: lowerBound.segment.id, offset: TimeUtil.seekToSample };
                }

                if (lowerBound.time.playbackSegment === upperBound.time.playbackSegment) {
                    return { M: upperBound.segment.id, offset: TimeUtil.seekToSample };
                }

                // Interpolate between bounds
                const normalizedProgress = globalTime
                    .subtract(lowerBound.time)
                    .scaledValue(upperBound.time.subtract(lowerBound.time));

                const subChain = chain.slice(
                    chain.indexOf(lowerBound.segment),
                    chain.indexOf(upperBound.segment) + (upperBound.isEnd ? 1 : 0)
                );

                let totalOffset = subChain
                    .reduce(
                        (acc, seg) => acc.item(seg.offset),
                        TimeUtil.seekToSample
                    )
                    .multiply(normalizedProgress);

                let targetSeg;
                for (const seg of subChain) {
                    targetSeg = seg;
                    if (totalOffset.lessThan(seg.offset)) break;
                    totalOffset = totalOffset.subtract(seg.offset);
                }

                if (targetSeg && totalOffset.lessThan(targetSeg?.offset)) {
                    return { M: targetSeg.id, offset: totalOffset };
                }
            }
        }

        assert(
            false,
            "Upper playgraph position should always map to something in lower playgraph"
        );
    }
}

export default PlaygraphPositionMapper;
