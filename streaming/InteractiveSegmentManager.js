/**
 * Netflix Cadmium Player -- InteractiveSegmentManager
 *
 * Manages segment-level playback for Netflix interactive content (e.g., Bandersnatch).
 * Interactive titles have a "playgraph" with multiple segments connected by
 * branching choices. This manager handles:
 *
 * - Tracking the current segment based on PTS (presentation timestamp)
 * - Pre-buffering upcoming segments (including branching alternatives)
 * - Switching between segments when the viewer reaches a decision point
 * - Coordinating with the license/DRM layer for segment downloads
 * - Applying choice weights from the manifest's "next" configuration
 *
 * @module streaming/InteractiveSegmentManager
 * @original Module_78192
 * @dependencies
 *   Module 76290 - LicenseChallengeCoordinator (manages DRM for segments)
 *   Module 67725 - Segment (individual segment state container)
 */

import LicenseChallengeCoordinator from '../drm/LicenseChallengeCoordinator'; // Module 76290
import Segment from '../streaming/WorkingSegment';                             // Module 67725

/**
 * Find the segment ID that contains the given PTS.
 *
 * @param {number} pts - Presentation timestamp in milliseconds
 * @param {Object} segmentMap - Map of segment IDs to segment metadata
 * @returns {string|undefined} The matching segment ID, or undefined
 * @private
 */
function findSegmentAtPts(pts, segmentMap) {
    pts = pts || 0;
    if (!segmentMap) return undefined;

    for (const segmentId in segmentMap.segments) {
        const seg = segmentMap.segments[segmentId];
        if (pts >= (seg.startTimeMs || 0) && (!seg.contentEndPts || pts < seg.contentEndPts)) {
            return segmentId;
        }
    }
}

/**
 * Look up segment metadata by ID.
 *
 * @param {string} segmentId
 * @param {Object} segmentMap
 * @returns {Object|undefined}
 * @private
 */
function getSegmentData(segmentId, segmentMap) {
    return segmentId && segmentMap && segmentMap.segments[segmentId];
}

/**
 * Manages interactive content segment playback, branching, and pre-buffering.
 *
 * @param {Object} options
 * @param {Object} options.logger - Logger instance
 * @param {Object} [options.interactiveGraph] - The interactive playgraph configuration
 * @param {number} [options.startPosition] - Initial playback position
 * @param {Object} httpClient - HTTP client for making requests
 * @param {Array} [sidxList] - List of segment index entries
 */
function InteractiveSegmentManager(options, httpClient, sidxList) {
    this.logger = options.logger;
    this.sidxList = sidxList;
    this.segmentMap = this._parseSegmentMap(options.interactiveGraph);

    /** @type {Array<Segment>} All known segments */
    this.segments = [];

    const lastSidx = sidxList && sidxList[sidxList.length - 1];
    /** @type {number|undefined} End time of the content */
    this.contentEndTime = lastSidx && (lastSidx.endTime || lastSidx.duration);

    /** License/DRM coordinator for segment downloads */
    this.licenseCoordinator = new LicenseChallengeCoordinator(options, httpClient, sidxList);

    // Initialize the first (current) segment
    const initialSegmentId = findSegmentAtPts(options.startPosition || 0, this.segmentMap);
    this.currentSegment = this._createSegment(initialSegmentId);
}

Object.defineProperties(InteractiveSegmentManager.prototype, {
    /** @type {boolean} Whether a license request is pending */
    isLicensePending: {
        get: function () {
            return this.licenseCoordinator.isLicensePending;
        }
    }
});

/**
 * Check if a license handshake is needed for a given PTS.
 * @param {number} pts
 * @param {Object} headers
 * @returns {boolean}
 */
InteractiveSegmentManager.prototype.checkLicenseNeeded = function (pts, headers) {
    return this.licenseCoordinator && this.licenseCoordinator.checkLicenseNeeded(pts, headers);
};

/**
 * Drive buffering at the given PTS. Downloads segment data for the
 * current segment and pre-buffers upcoming branch alternatives.
 *
 * @param {number} pts - Current presentation timestamp
 * @param {Function} [callback] - Called when buffering is complete or throttled
 */
InteractiveSegmentManager.prototype.driveBuffering = function (pts, callback) {
    this.licenseCoordinator.updatePts(pts);
    this._switchSegmentIfNeeded(pts);

    // If no segment map and past content end, signal completion
    if (!this.segmentMap && this.contentEndTime && pts > this.contentEndTime) {
        if (callback) callback();
        return;
    }

    // Drive the current segment
    const currentDone = this._driveSegment(pts, this.currentSegment, 2, callback);

    // If the segment map indicates branching with pending choices, pre-buffer branches
    if (this.segmentMap && this.currentSegment.pendingChoices.length > 0) {
        if (callback) callback();
    } else if (this.segmentMap && this.currentSegment.isFullyDownloaded && currentDone) {
        // Pre-buffer upcoming branch segments
        if (this.segments.length < 2) {
            this._expandBranches(this.currentSegment);
        }
        const maxBranches = Math.ceil(2 / (this.segments.length - 1));
        for (let i = 0; i < this.segments.length && currentDone && i < 3; i++) {
            const seg = this.segments[i];
            this._driveSegment(seg.startTime, seg, maxBranches);
        }
    }
};

/**
 * Handle a completed seek to the given PTS.
 * @param {number} pts
 * @returns {boolean} Whether the seek was handled
 */
InteractiveSegmentManager.prototype.handleSeek = function (pts) {
    if (!this.licenseCoordinator.handleSeek(pts)) return false;
    this.licenseCoordinator.commitSeek();
    this.driveBuffering(pts);
    this.currentSegment.isFullyDownloaded = false;
    return true;
};

/**
 * Open the output (start playback) at the given PTS.
 * @param {number} pts
 * @param {Function} callback
 */
InteractiveSegmentManager.prototype.openOutput = function (pts, callback) {
    this._switchSegmentIfNeeded(pts);
    this.segments.forEach((seg) => {
        seg.isFullyDownloaded = false;
    });

    const firstSidx = this.currentSegment.sidxEntries && this.currentSegment.sidxEntries[0];
    this.licenseCoordinator.openOutput(pts, firstSidx && firstSidx.index);

    const pendingRequests = this.licenseCoordinator.getPendingRequests(pts);
    if (pendingRequests && pendingRequests.length) {
        this.licenseCoordinator.submitRequests(pendingRequests, callback);
    } else {
        if (callback) callback();
    }
};

/**
 * Notify that the next segment for a given segment ID has been chosen.
 * Prunes branches that were not selected.
 *
 * @param {string} segmentId - Current segment ID
 * @param {string} nextSegmentId - The chosen next segment ID
 */
InteractiveSegmentManager.prototype.setNextSegment = function (segmentId, nextSegmentId) {
    this.logger.debug("Set next segment to", nextSegmentId, "for segment", segmentId);
    const segment = this._findSegment(segmentId) || this._createSegment(segmentId);
    segment.nextSegmentId = nextSegmentId;

    const self = this;
    segment.childSegments = segment.childSegments.filter((child) => {
        if (child.id === nextSegmentId) return true;
        self._deleteSegment(child);
        return false;
    });
};

/**
 * Apply choice weights from configuration.
 * @param {string} segmentId
 * @param {Object} weights - Map of next-segment IDs to weight values
 */
InteractiveSegmentManager.prototype.applyChoiceWeights = function (segmentId, weights) {
    const segData = getSegmentData(segmentId, this.segmentMap);
    Object.keys(segData.next).forEach((nextId) => {
        segData.next[nextId].weight = weights[nextId] || 0;
    });
};

/**
 * Parse the interactive graph configuration into an internal segment map.
 * @param {Object} graph
 * @returns {Object|undefined}
 * @private
 */
InteractiveSegmentManager.prototype._parseSegmentMap = function (graph) {
    const result = {};
    const segments = (graph || {}).segments;
    if (!segments) return undefined;

    result.segments = {};
    for (const segmentId in segments) {
        const raw = segments[segmentId] || {};
        result.segments[segmentId] = {
            startTimeMs: raw.startTimeMs,
            contentEndPts: raw.contentEndPts,
            defaultNext: raw.defaultNext,
            next: this._parseNextMap(raw.next),
        };
    }
    return result;
};

/**
 * Parse the "next" choice map for a segment.
 * @param {Object} nextMap
 * @returns {Object}
 * @private
 */
InteractiveSegmentManager.prototype._parseNextMap = function (nextMap) {
    const result = {};
    for (const key in nextMap) {
        result[key] = {
            weight: (nextMap[key] || {}).weight,
        };
    }
    return result;
};

/**
 * Switch the current segment if the PTS has moved outside its range.
 * @param {number} pts
 * @private
 */
InteractiveSegmentManager.prototype._switchSegmentIfNeeded = function (pts) {
    if (!this.segmentMap) return;
    if (this.currentSegment.startTime > pts || (this.currentSegment.endTime && this.currentSegment.endTime < pts)) {
        const oldSegment = this.currentSegment;
        const newSegmentId = findSegmentAtPts(pts, this.segmentMap);

        if (newSegmentId) {
            this.logger.debug("Switching segments from", this.currentSegment.id, "to", newSegmentId, "at pts", pts);
            this.currentSegment = this._findSegment(newSegmentId) || this._createSegment(newSegmentId);
            this._deleteSegment(oldSegment);
        } else {
            this.logger.debug("The pts is outside of the current segment but not in a new one yet");
        }
    }
};

/**
 * Create a new Segment and add it to the segments list.
 * @param {string} segmentId
 * @returns {Segment}
 * @private
 */
InteractiveSegmentManager.prototype._createSegment = function (segmentId) {
    this.logger.debug("SegmentManager: creating segment", segmentId);
    const segment = new Segment(segmentId, getSegmentData(segmentId, this.segmentMap), this.sidxList, this.logger);
    this.segments.push(segment);
    this.logger.debug("SegmentManager: segment contains", segment.sidxEntries.length, "sidxes");
    return segment;
};

/**
 * Delete a segment and its children, cleaning up resources.
 * @param {Segment} segment
 * @private
 */
InteractiveSegmentManager.prototype._deleteSegment = function (segment) {
    if (!segment || segment === this.currentSegment) return;

    this.logger.debug("SegmentManager: deleting segment", segment.id);
    segment.childSegments.forEach(this._deleteSegment.bind(this));
    this.segments = this.segments.filter((s) => s !== segment);

    const lastEntry = segment.getLastEntry();
    this.licenseCoordinator.releaseSegmentResources(
        lastEntry && lastEntry.size || 0,
        lastEntry && lastEntry.sidxEntries
    );
};

/**
 * Find a segment by ID in the segments list.
 * @param {string} segmentId
 * @returns {Segment|undefined}
 * @private
 */
InteractiveSegmentManager.prototype._findSegment = function (segmentId) {
    for (let i = 0; segmentId && i < this.segments.length; i++) {
        if (segmentId === this.segments[i].id) {
            return this.segments[i];
        }
    }
};

/**
 * Expand branch children for a segment based on the choice graph.
 * @param {Segment} segment
 * @private
 */
InteractiveSegmentManager.prototype._expandBranches = function (segment) {
    const nextId = segment.nextSegmentId;
    if (nextId && nextId !== "") {
        segment.childSegments.push(this._createSegment(nextId));
    } else {
        const choices = segment.pendingChoices;
        for (const choiceId in choices) {
            const choice = choices[choiceId];
            if (!choice || !choice.weight) break;
            segment.childSegments.push(this._createSegment(choiceId));
        }
    }
};

/**
 * Drive download for a single segment.
 * @param {number} pts
 * @param {Segment} segment
 * @param {number} maxRequests
 * @param {Function} [callback]
 * @returns {boolean} True if segment is fully downloaded
 * @private
 */
InteractiveSegmentManager.prototype._driveSegment = function (pts, segment, maxRequests, callback) {
    if (!segment || segment.isFullyDownloaded) {
        this.logger.debug("Done driving segment", segment && segment.id);
        return true;
    }

    if (!this.licenseCoordinator.isReady) {
        this.logger.debug("Throttling buffering in quiet period");
        return false;
    }

    this.logger.debug("Drive streaming of segment", segment.id, "from pts", pts);
    const requests = this.licenseCoordinator.getSegmentRequests(pts, segment, maxRequests);
    const requestCount = (requests && requests.length) || 0;

    if (requestCount === 0) {
        this.logger.debug("Segment is fully downloaded", segment && segment.id);
        segment.isFullyDownloaded = true;
        if (callback) callback();
        return true;
    }

    this.logger.debug("Downloading", requestCount, "sidxes in segment", segment.id);
    return this.licenseCoordinator.submitRequests(requests, function (error, result) {
        if (error) segment.isFullyDownloaded = false;
        if (callback) callback(error, result);
    });
};

export default InteractiveSegmentManager;
