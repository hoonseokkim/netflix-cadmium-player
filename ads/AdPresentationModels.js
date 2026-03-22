/**
 * Netflix Cadmium Player — Ad Presentation View Models
 *
 * Provides a set of read-only facade/view-model classes that wrap internal
 * ad-related data structures and expose a clean, getter-based public API
 * for the ad presentation layer, UI components, and impression tracking.
 *
 * Class hierarchy:
 *   - PlaybackContainerAdsFacade  — Top-level facade wrapping a playback container
 *   - PresentingAdBreakView       — View of a currently-presenting ad break
 *   - AdBreakView                 — Describes an ad break (collection, padding, duration, type)
 *   - AdInfoView                  — Current ad within a break (ad reference, progress, index)
 *   - PaddingInfoView             — Padding segment info (type, progress, duration)
 *   - AdBreakProgressView         — Progress/offset tracking for an ad break
 *   - AdBreakPositionView         — Segment-level position within an ad break
 *   - AdCollectionView            — Collection of ads within a break
 *   - PaddingView                 — Simple padding duration wrapper
 *   - AdView                      — Individual ad with timing, events, verification
 *
 * Original: Webpack Module 54952
 *
 * @module AdPresentationModels
 */

// ─────────────────────────────────────────────────────────────
//  AdView
// ─────────────────────────────────────────────────────────────

/**
 * View model for an individual ad within an ad break.
 * Wraps the internal ad data and exposes read-only properties
 * for timing, verification, events, and UI state.
 */
class AdView {
    /** @type {object} Internal ad data */
    #adData;

    /**
     * @param {object} adData - Internal ad data object
     */
    constructor(adData) {
        this.#adData = adData;
    }

    /**
     * Whether this ad has already been played.
     * @returns {boolean}
     */
    get hasPlayed() {
        return this.#adData.isSkippableAd;
    }

    /**
     * Unique identifier for this ad.
     * @returns {string}
     */
    get id() {
        return this.#adData.id;
    }

    /**
     * Start time of the ad in the playback segment.
     * @returns {{ ms: number }}
     */
    get startTime() {
        return { ms: this.#adData.startTime.playbackSegment };
    }

    /**
     * End time of the ad in the playback segment.
     * @returns {{ ms: number }}
     */
    get endTime() {
        return { ms: this.#adData.endTime.playbackSegment };
    }

    /**
     * Start time in absolute milliseconds.
     * @returns {number}
     */
    get startTimeMs() {
        return this.#adData.startTimeMs;
    }

    /**
     * End time in absolute milliseconds (content end PTS).
     * @returns {number}
     */
    get endTimeMs() {
        return this.#adData.contentEndPts;
    }

    /**
     * Whether third-party ad verification is enabled.
     * @returns {boolean}
     */
    get is3pVerificationEnabled() {
        return this.#adData.c1;
    }

    /**
     * Third-party verification token for ad measurement.
     * @returns {string|undefined}
     */
    get thirdPartyVerificationToken() {
        return this.#adData.thirdPartyVerificationToken;
    }

    /**
     * Time-based ad events (e.g., quartile tracking pixels).
     * @returns {Array}
     */
    get timedAdEvents() {
        return this.#adData.timedAdEvents;
    }

    /**
     * Action-based ad events (e.g., click-through, skip).
     * @returns {Array}
     */
    get actionAdEvents() {
        return this.#adData.actionAdEvents;
    }

    /**
     * Whether the ad should be automatically skipped.
     * @returns {boolean}
     */
    get autoSkip() {
        return this.#adData.qo;
    }

    /**
     * UI component identifier for rendering this ad.
     * @returns {string|undefined}
     */
    get uiComponent() {
        return this.#adData.uiComponent;
    }

    /**
     * Whether this ad is in an error state.
     * @returns {boolean}
     */
    get isError() {
        return this.#adData.yE;
    }
}

// ─────────────────────────────────────────────────────────────
//  PaddingView
// ─────────────────────────────────────────────────────────────

/**
 * Simple view model wrapping a padding segment's duration.
 */
class PaddingView {
    /** @type {object} Internal padding data */
    #paddingData;

    /**
     * @param {object} paddingData - Internal padding data object
     */
    constructor(paddingData) {
        this.#paddingData = paddingData;
    }

    /**
     * Duration of the padding segment.
     * @returns {{ ms: number }}
     */
    get duration() {
        return { ms: this.#paddingData.duration.playbackSegment };
    }
}

// ─────────────────────────────────────────────────────────────
//  AdCollectionView
// ─────────────────────────────────────────────────────────────

/**
 * View model for a collection of ads within an ad break.
 * Provides access to the list of ads, total duration, and break metadata.
 */
class AdCollectionView {
    /** @type {object} Internal ad collection data */
    #collectionData;

    /**
     * @param {object} collectionData - Internal ad collection data object
     */
    constructor(collectionData) {
        this.#collectionData = collectionData;
    }

    /**
     * Array of individual ad views within this collection.
     * @returns {AdView[]}
     */
    get ads() {
        return this.#collectionData.duration.map((adData) => new AdView(adData));
    }

    /**
     * Total duration of the ad collection.
     * @returns {{ ms: number }}
     */
    get duration() {
        return { ms: this.#collectionData.duration.playbackSegment };
    }

    /**
     * Type of the ad collection (e.g., "embedded", "stitched").
     * @returns {string}
     */
    get type() {
        return this.#collectionData.type;
    }

    /**
     * SCTE-35 segmentation type ID.
     * @returns {number|undefined}
     */
    get segmentationTypeId() {
        return this.#collectionData.internal_Zp;
    }

    /**
     * Whether this collection is a pre-roll.
     * @returns {boolean}
     */
    get isPreroll() {
        return this.#collectionData.i1;
    }
}

// ─────────────────────────────────────────────────────────────
//  AdBreakPositionView
// ─────────────────────────────────────────────────────────────

/**
 * View model representing the playback position within an ad break,
 * including the segment ID and offset.
 */
class AdBreakPositionView {
    /** @type {object} Internal position data */
    #positionData;

    /**
     * @param {object} positionData - Internal position data object
     */
    constructor(positionData) {
        this.#positionData = positionData;
    }

    /**
     * Segment identifier for the current position.
     * @returns {string|number}
     */
    get segmentId() {
        return this.#positionData.M;
    }

    /**
     * Offset within the segment.
     * @returns {{ ms: number }}
     */
    get offset() {
        return { ms: this.#positionData.offset.playbackSegment };
    }
}

// ─────────────────────────────────────────────────────────────
//  AdBreakProgressView
// ─────────────────────────────────────────────────────────────

/**
 * View model for tracking playback progress through an ad break,
 * both with and without padding segments.
 */
class AdBreakProgressView {
    /** @type {object} Internal progress data */
    #progressData;

    /**
     * @param {object} progressData - Internal progress data object
     */
    constructor(progressData) {
        this.#progressData = progressData;
    }

    /**
     * Progress ratio through the ad break (excluding padding).
     * @returns {number} Value between 0 and 1
     */
    get adBreakProgress() {
        return this.#progressData.lac;
    }

    /**
     * Current offset within the ad break (excluding padding).
     * @returns {{ ms: number }}
     */
    get adBreakOffset() {
        return { ms: this.#progressData.vqb.playbackSegment };
    }

    /**
     * Progress ratio through the ad break (including padding).
     * @returns {number} Value between 0 and 1
     */
    get adBreakWithPaddingProgress() {
        return this.#progressData.nac;
    }

    /**
     * Current offset within the ad break (including padding).
     * @returns {{ ms: number }}
     */
    get adBreakWithPaddingOffset() {
        return { ms: this.#progressData.mac.playbackSegment };
    }
}

// ─────────────────────────────────────────────────────────────
//  PaddingInfoView
// ─────────────────────────────────────────────────────────────

/**
 * View model for padding segment information within an ad break,
 * including the padding type, progress, and duration.
 */
class PaddingInfoView {
    /** @type {object} Internal padding info data */
    #paddingInfoData;

    /**
     * @param {object} paddingInfoData - Internal padding info data object
     */
    constructor(paddingInfoData) {
        this.#paddingInfoData = paddingInfoData;
    }

    /**
     * Type of padding (e.g., "start", "end").
     * @returns {string}
     */
    get paddingType() {
        return this.#paddingInfoData.wxa;
    }

    /**
     * Progress ratio through the padding segment.
     * @returns {number} Value between 0 and 1
     */
    get paddingProgress() {
        return this.#paddingInfoData.cOc;
    }

    /**
     * Duration of the padding segment.
     * @returns {{ ms: number }}
     */
    get paddingDuration() {
        return { ms: this.#paddingInfoData.txa.playbackSegment };
    }
}

// ─────────────────────────────────────────────────────────────
//  AdInfoView
// ─────────────────────────────────────────────────────────────

/**
 * View model for the currently-playing ad within a break.
 * Provides the ad itself, its progress, and its index in the break.
 */
class AdInfoView {
    /** @type {object} Internal ad info data */
    #adInfoData;

    /**
     * @param {object} adInfoData - Internal ad info data object
     */
    constructor(adInfoData) {
        this.#adInfoData = adInfoData;
    }

    /**
     * The current ad being played.
     * @returns {AdView}
     */
    get ad() {
        return new AdView(this.#adInfoData.thirdPartyVerificationToken);
    }

    /**
     * Playback progress of the current ad.
     * @returns {number} Value between 0 and 1
     */
    get adProgress() {
        return this.#adInfoData.internal_Eqb;
    }

    /**
     * Index of the current ad within the ad break.
     * @returns {number}
     */
    get index() {
        return this.#adInfoData.index;
    }
}

// ─────────────────────────────────────────────────────────────
//  AdBreakView
// ─────────────────────────────────────────────────────────────

/**
 * View model describing a complete ad break, including its ad collection,
 * padding segments, duration, type, and structural metadata.
 */
class AdBreakView {
    /** @type {object} Internal ad break data */
    #adBreakData;

    /**
     * @param {object} adBreakData - Internal ad break data object
     */
    constructor(adBreakData) {
        this.#adBreakData = adBreakData;
    }

    /**
     * The collection of ads within this break.
     * @returns {AdCollectionView}
     */
    get adCollection() {
        return new AdCollectionView(this.#adBreakData.xf);
    }

    /**
     * Padding at the start of the ad break.
     * @returns {PaddingView}
     */
    get startPadding() {
        return new PaddingView(this.#adBreakData.tha);
    }

    /**
     * Padding at the end of the ad break.
     * @returns {PaddingView}
     */
    get endPadding() {
        return new PaddingView(this.#adBreakData.N_);
    }

    /**
     * Whether the ad break has padding segments.
     * @returns {boolean}
     */
    get hasPadding() {
        return this.#adBreakData.lBc;
    }

    /**
     * Duration of the ad break (excluding padding).
     * @returns {{ ms: number }}
     */
    get duration() {
        return { ms: this.#adBreakData.duration.playbackSegment };
    }

    /**
     * Duration of the padding segments combined.
     * @returns {{ ms: number }}
     */
    get paddingDuration() {
        return { ms: this.#adBreakData.txa.playbackSegment };
    }

    /**
     * Type of the ad break (e.g., "embedded", "stitched").
     * @returns {string}
     */
    get type() {
        return this.#adBreakData.type;
    }

    /**
     * SCTE-35 segmentation type ID for the ad break.
     * @returns {number|undefined}
     */
    get segmentationTypeId() {
        return this.#adBreakData.internal_Zp;
    }

    /**
     * Whether this ad break is a pre-roll.
     * @returns {boolean}
     */
    get isPreroll() {
        return this.#adBreakData.i1;
    }
}

// ─────────────────────────────────────────────────────────────
//  PresentingAdBreakView
// ─────────────────────────────────────────────────────────────

/**
 * View model for a currently-presenting ad break, combining
 * the ad break definition with live playback state (current ad,
 * padding, progress, position).
 */
class PresentingAdBreakView {
    /** @type {object} Internal presenting ad break data */
    #presentingData;

    /**
     * @param {object} presentingData - Internal presenting ad break data
     */
    constructor(presentingData) {
        this.#presentingData = presentingData;
    }

    /**
     * The ad break being presented.
     * @returns {AdBreakView}
     */
    get adBreak() {
        return new AdBreakView(this.#presentingData.adBreak);
    }

    /**
     * Information about the currently-playing ad, if any.
     * @returns {AdInfoView|undefined}
     */
    get adInfo() {
        const data = this.#presentingData.XK;
        if (data) {
            return new AdInfoView(data);
        }
    }

    /**
     * Information about the current padding segment, if any.
     * @returns {PaddingInfoView|undefined}
     */
    get paddingInfo() {
        const data = this.#presentingData.U1a;
        if (data) {
            return new PaddingInfoView(data);
        }
    }

    /**
     * Progress through the ad break.
     * @returns {AdBreakProgressView}
     */
    get progress() {
        return new AdBreakProgressView(this.#presentingData.progress);
    }

    /**
     * Current playback position within the ad break.
     * @returns {AdBreakPositionView}
     */
    get position() {
        return new AdBreakPositionView(this.#presentingData.position);
    }

    /**
     * Index of the current item within the ad break.
     * @returns {number}
     */
    get index() {
        return this.#presentingData.index;
    }
}

// ─────────────────────────────────────────────────────────────
//  PlaybackContainerAdsFacade
// ─────────────────────────────────────────────────────────────

/**
 * Top-level facade that wraps a playback container and provides
 * a clean API for accessing ad-related state: the currently-presenting
 * ad break, player control state, ad containers, and log info.
 *
 * This is the primary export used by the ad manager when constructing
 * ad presentation views from internal playback container state.
 */
class PlaybackContainerAdsFacade {
    /** @type {object} Internal playback container */
    #playbackContainer;

    /**
     * @param {object} playbackContainer - Internal playback container instance
     */
    constructor(playbackContainer) {
        this.#playbackContainer = playbackContainer;
    }

    /**
     * Returns a view of the currently-presenting ad break, if any.
     * @returns {PresentingAdBreakView|undefined}
     */
    getPresentingAdBreak() {
        const presentingData = this.#playbackContainer.aB();
        if (presentingData) {
            return new PresentingAdBreakView(presentingData);
        }
    }

    /**
     * Returns the current player control state, indicating which
     * controls are enabled during ad playback.
     * @returns {{ seekEnabled: boolean, playPauseEnabled: boolean, languageSelectionEnabled: boolean }}
     */
    getPlayerControlState() {
        const state = this.#playbackContainer.getPlayerControlState();
        return {
            seekEnabled: state.pz,
            playPauseEnabled: state.playPauseEnabled,
            languageSelectionEnabled: state.languageSelectionEnabled,
        };
    }

    /**
     * Returns the ad containers associated with this playback container.
     * @returns {Array}
     */
    getAds() {
        return this.#playbackContainer.getAdsContainers();
    }

    /**
     * Returns log information for debugging and telemetry.
     * @returns {object}
     */
    getLogInfo() {
        return this.#playbackContainer.sCb();
    }
}

// ─────────────────────────────────────────────────────────────
//  Exports
// ─────────────────────────────────────────────────────────────

export {
    PlaybackContainerAdsFacade,
    PresentingAdBreakView,
    AdBreakView,
    AdInfoView,
    PaddingInfoView,
    AdBreakProgressView,
    AdBreakPositionView,
    AdCollectionView,
    PaddingView,
    AdView,
};
