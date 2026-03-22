/**
 * @module QueueAuditReporter
 * @description Telemetry reporter that captures queue audit data at playback transitions,
 *              underflow events, and end-of-playback. Reports branch queue state, per-media-type
 *              iterator snapshots, and clock drift statistics for streaming diagnostics.
 *              Original: Module_5653
 */

import { __values, __assign } from 'tslib'; // Module 22970
import { PlaybackEventType } from '../streaming/PlaybackState'; // Module 48170 (u)
import { StreamingEvent } from '../streaming/StreamingEvents'; // Module 91967

/**
 * Reports queue audit snapshots for streaming diagnostics.
 */
class QueueAuditReporter {
    /**
     * @param {Object} asePlayer - ASE player instance providing queue/drift data
     */
    constructor(asePlayer) {
        /** @type {Object} Reference to ASE player */
        this.asePlayer = asePlayer;
    }

    /**
     * Reporter name identifier.
     * @type {string}
     */
    get reporterName() {
        return QueueAuditReporter.REPORTER_NAME;
    }

    /**
     * Telemetry event type identifier.
     * @type {string}
     */
    get eventType() {
        return "qaudit";
    }

    /**
     * Whether this reporter is enabled.
     * @type {boolean}
     */
    get enabled() {
        return PlaybackEventType.enabled;
    }

    /**
     * Captures queue audit data on relevant playback events.
     * @param {Object} event - Playback event with utilityInstance and seekHandler
     * @returns {Object|undefined} Queue audit snapshot or undefined if not applicable
     */
    deserialize(event) {
        const eventType = event.utilityInstance;
        const seekHandler = event.seekHandler;

        const isEndPlayback = eventType === StreamingEvent.endPlayback;
        const isUnderflow = eventType === StreamingEvent.underflow;

        if (isEndPlayback || isUnderflow || seekHandler === "transition") {
            const queueState = this.asePlayer.getQueueState();
            if (queueState) {
                const iteratorSnapshots = {};
                for (const mediaIterator of queueState.mediaIterators) {
                    iteratorSnapshots[mediaIterator.mediaType] = this._getIteratorSnapshot(mediaIterator);
                }

                return {
                    branchQueue: serializeBranchQueue(queueState.branchQueue, isUnderflow),
                    playerIterator: iteratorSnapshots,
                    driftStats: this.asePlayer.clockDriftCollection,
                };
            }
        }
    }

    /**
     * Gets a snapshot of a media iterator's state.
     * @private
     * @param {Object} mediaIterator - Media iterator instance
     * @returns {Object|undefined} Iterator snapshot
     */
    _getIteratorSnapshot(mediaIterator) {
        return mediaIterator?.getSnapshot();
    }

    /** @type {string} Static reporter name */
    static REPORTER_NAME = "queue-audit";
}

/**
 * Serializes a single branch entry for the queue audit.
 * @param {Object} branch - Branch object with current segment and media streams
 * @param {boolean} includeVerbose - Whether to include verbose request details
 * @returns {Object|undefined} Serialized branch data
 */
export function serializeBranch(branch, includeVerbose) {
    if (!branch) return branch;

    const currentSegment = branch.currentSegment;
    const mediaStreams = {};

    branch.getMediaStreams().forEach((stream) => {
        mediaStreams[stream.mediaType] = serializeMediaStream(stream, includeVerbose);
    });

    return {
        sId: currentSegment?.id,
        cancelled: branch.isCancelledFlag,
        RM: mediaStreams,
    };
}

/**
 * Serializes a media stream's state for the queue audit.
 * @param {Object} stream - Media stream with request emitter and track info
 * @param {boolean} includeVerbose - Whether to include verbose request details
 * @returns {Object|undefined} Serialized stream data
 */
export function serializeMediaStream(stream, includeVerbose) {
    if (!stream?.requestEventEmitter) return undefined;

    const verboseData = includeVerbose ? stream.requestEventEmitter.getVerboseSnapshot() : {};

    return {
        ...stream.requestEventEmitter.getBasicSnapshot(),
        unsentRequests: stream.requestEventEmitter.JO,
        lastFragmentContentEndPts: stream.lastFragment?.segmentEndTime.playbackSegment,
        trackAttributes: stream.track?.parseStream(),
        bitrate: stream.lastFragment?.bitrate,
        lastAppendedTimestamp: stream.lastAppendedTimestamp?.playbackSegment,
        ...verboseData,
    };
}

/**
 * Serializes an array of branches for the queue audit.
 * @param {Array<Object>} branches - Array of branch objects
 * @param {boolean} includeVerbose - Whether to include verbose data
 * @returns {Array<Object>} Serialized branch array
 */
export function serializeBranchQueue(branches, includeVerbose) {
    return branches.map((branch) => serializeBranch(branch, includeVerbose));
}

export { QueueAuditReporter };
export default QueueAuditReporter;
