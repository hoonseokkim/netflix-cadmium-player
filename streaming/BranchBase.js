/**
 * BranchBase - Base class for playback graph branches
 *
 * Represents a branch in the Netflix playback graph (segment tree).
 * Manages branch state, parent relationships, quality descriptors,
 * buffer offsets, and media type availability signals.
 *
 * @module streaming/BranchBase
 * @original Module_58049
 */

// import { __awaiter, __generator } from 'tslib';
// import { EventEmitter } from '../events/EventEmitter';
// import { assert } from '../assert';
// import { platform } from '../core/platform';
// import { RJ as Deferred } from '../utils/Deferred';
// import { u as DEBUG } from '../core/debug';
// import { MediaType } from '../types/MediaType';
// import { mathTanh as createLogger } from '../utils/logger';
// import { ase_Fib as BranchBarrier } from '../streaming/BranchBarrier';

/**
 * Enum for branch request states.
 * @enum {number}
 */
export const BranchRequestState = {
    CREATED: 0,
    CANCELLED: 1,
};

/**
 * Comparator for sorting media requests by media type priority.
 * Order: Video (0) < Audio (1) < Text (2) < Other (3)
 *
 * @param {Object} a - First media request
 * @param {Object} b - Second media request
 * @returns {number} Sort comparison value
 */
export function compareByMediaType(a, b) {
    return getMediaTypeOrder(a.mediaType) - getMediaTypeOrder(b.mediaType);
}

/**
 * Returns a numeric ordering for media types.
 * @param {string} mediaType
 * @returns {number}
 */
function getMediaTypeOrder(mediaType) {
    if (mediaType === MediaType.VIDEO) return 0;
    if (mediaType === MediaType.AUDIO) return 1;
    if (mediaType === MediaType.TEXT) return 2;
    return 3;
}

/**
 * Checks if an event is a "media type not available" event.
 *
 * @param {Object} event - The event to check
 * @returns {boolean} True if the event type is "mediaTypeNotAvailable"
 */
export function isMediaTypeNotAvailable(event) {
    return event.type === "mediaTypeNotAvailable";
}

/** @type {{ lW: Function }} */
export const mediaTypeComparators = {
    lW: compareByMediaType,
};

let branchIdCounter = 0;

/**
 * Base class for playback graph branches.
 *
 * A branch represents a segment of playback in the Netflix playgraph.
 * It tracks viewable content, parent relationships, quality descriptors,
 * buffer offsets, and media type availability.
 */
export class BranchBase {
    /**
     * @param {Object} viewableId - The viewable content descriptor
     * @param {Function|undefined} getParentFn - Function to resolve parent branch
     * @param {Object} branchOffset - Quality descriptor / buffer offset
     * @param {*} trackFilter - Track filter criteria
     * @param {Object} logContext - Logging context
     */
    constructor(viewableId, getParentFn, branchOffset, trackFilter, logContext) {
        this.viewableId = viewableId;
        this.getParentFn = getParentFn;
        this.branchOffset = branchOffset;
        this.trackFilter = trackFilter;
        this.requestState = BranchRequestState.CREATED;
        this.tracks = [];
        this.skipInitialization = false;
        this.mediaTypeNotAvailableMap = new Map();
        this.events = new EventEmitter();

        const idSuffix = viewableId.id && viewableId.id.length ? `{${viewableId.id}}` : "";
        this.console = createLogger(platform, logContext, idSuffix);
        this.branchId = `${viewableId.id}-${branchIdCounter++}`;

        if (DEBUG) {
            this.console.debug(`BranchBase created with id ${this.branchId}`);
        }

        this.barrier = new BranchBarrier(this);
    }

    /** @returns {number} Current request state */
    get state() {
        return this.requestState;
    }

    /** @returns {boolean} Whether the branch has been cancelled */
    get isCancelled() {
        return this.requestState === BranchRequestState.CANCELLED;
    }

    /** @returns {Object} The viewable content descriptor */
    get viewable() {
        return this.viewableId;
    }

    /** @returns {Array} List of tracks associated with this branch */
    get trackList() {
        return this.tracks;
    }

    /** @returns {Object|undefined} Parent branch */
    get parent() {
        return this.getParentFn?.call(this, this);
    }

    /** @returns {string} Unique branch identifier */
    get id() {
        return this.branchId;
    }

    /** @returns {Object|undefined} Parent quality descriptor */
    get parentQuality() {
        return this.parentQualityDescriptor;
    }

    /**
     * Called when the branch is being reset.
     * Resets the barrier and adjusts branch offset from parent state.
     */
    resetting() {
        this.barrier.resetting();
        if (this.parent?.previousState) {
            const offset = this.parent.previousState.lowestWaterMarkLevelBufferRelaxed(this.trackFilter);
            this.adjustBranchOffset(offset, "on parent normalization");
        }
    }

    /**
     * Initializes the branch data from parent state.
     * Sets up quality descriptors and waits for parent normalization.
     */
    data() {
        if (this.parent) {
            if (this.parent.previousState) {
                const offset = this.parent.previousState.lowestWaterMarkLevelBufferRelaxed(this.trackFilter);
                this.adjustBranchOffset(offset, "at intialization");
            }
            this.initializeQualityDescriptor();
            this.waitForParentNormalization();
        }
        if (DEBUG) {
            this.console.pauseTrace(`BranchBase {${this.currentSegment.id}}: Initialization complete`);
        }
    }

    /**
     * Asynchronously initializes the quality descriptor from parent.
     * @private
     */
    async initializeQualityDescriptor() {
        await this.barrier.PXb();
        if (this.isCancelledFlag || !this.parent) return;
        this.parentQualityDescriptor = this.parent?.viewableSession?.isAuxiliary
            ? this.parent.qualityDescriptor
            : this.parent.trackMeta;
    }

    /**
     * Waits for parent normalization and adjusts branch offset.
     * @private
     */
    async waitForParentNormalization() {
        if (DEBUG) {
            this.console.pauseTrace(`Branch {${this.currentSegment.id}}: waitForParent Normalization Started`);
        }
        await this.barrier.OXb();
        if (DEBUG) {
            this.console.pauseTrace(`Branch {${this.currentSegment.id}}: waitForParent Normalization Complete`);
        }
        if (this.isCancelledFlag || !this.parent) return;
        if (this.parent.previousState) {
            const offset = this.parent.previousState.lowestWaterMarkLevelBufferRelaxed(this.trackFilter);
            this.adjustBranchOffset(offset, "on parent normalization");
        }
    }

    /**
     * Updates the branch's viewable content.
     *
     * @param {Object} newViewable - The new viewable content
     */
    update(newViewable) {
        assert(this.handleVideoPadding(newViewable), "Cannot update branch with segment");
        this.viewableId = newViewable;
    }

    /**
     * Adjusts the branch offset to a new quality descriptor.
     *
     * @param {Object} newOffset - The new quality descriptor offset
     * @param {string} [reason="unknown"] - Reason for the adjustment
     */
    adjustBranchOffset(newOffset, reason = "unknown") {
        if (DEBUG) {
            this.console.log(
                `AseBranch adjusting branchOffset to ${newOffset.ca()} from ${this.qualityDescriptor.ca()} ${reason}`
            );
        }
        this.branchOffset = newOffset;
        this.events.emit("branchOffsetUpdated", {
            type: "branchOffsetUpdated",
            qualityDescriptor: newOffset,
        });
    }

    /**
     * Searches ancestor branches for a matching noop result.
     *
     * @param {*} query - The lookup key
     * @returns {*} The first matching result from ancestors, or undefined
     */
    findInAncestors(query) {
        if (!this.isCancelledFlag) {
            let current = this.parent;
            while (current) {
                const result = current.noop(query);
                if (result) return result;
                current = current.parent;
            }
        }
    }

    /**
     * Cancels streaming for this branch by clearing the parent reference
     * and resetting the barrier.
     */
    cancelStreaming() {
        this.getParentFn = undefined;
        this.barrier.resetting();
    }

    /**
     * Checks if the branch supports a given media type.
     *
     * @param {string} mediaType - The media type to check
     * @returns {boolean} True if any track matches the media type
     */
    supportsMediaType(mediaType) {
        return this.tracks.some((track) => track.mediaType === mediaType);
    }

    /**
     * Creates a deferred signal for when a media type becomes unavailable.
     *
     * @param {string} mediaType - The media type
     * @returns {Promise} A promise that resolves when the signal fires
     */
    getMediaTypeNotAvailableSignal(mediaType) {
        if (!this.mediaTypeNotAvailableMap.has(mediaType)) {
            const deferred = new Deferred(this.console, 1);
            deferred.enqueue({
                ma: this,
                K: this.currentSegment,
                type: "mediaTypeNotAvailable",
            });
            this.mediaTypeNotAvailableMap.set(mediaType, deferred);
        }
        return this.mediaTypeNotAvailableMap.key(mediaType).ase_Yra();
    }

    /**
     * Clears media type not available signals for recovered media types.
     *
     * @param {Array<string>} mediaTypes - The media types that have recovered
     */
    clearMediaTypeSignals(mediaTypes) {
        mediaTypes.forEach((mediaType) => {
            this.mediaTypeNotAvailableMap.delete(mediaType);
        });
    }
}
