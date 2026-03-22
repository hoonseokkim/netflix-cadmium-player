/**
 * Netflix Cadmium Player — Ad Break Wrapper
 *
 * Wraps raw ad-break manifest data into a richer object model used by the
 * playback pipeline, ad UI, and impression-tracking subsystems.
 *
 * Exports three classes:
 *   - AdBreakWrapper           — Core wrapper around a single ad break.
 *   - SyntheticTimingMarker    — Represents a synthetic pre/post-roll timing marker.
 *   - AdBreakWrapperWithPadding — Composite that adds pre/post padding to an ad break.
 *   - AdItem                   — Individual ad within an ad break.
 *
 * @module AdBreakWrapper
 */

// Dependencies
// import { TimeUtil } from './modules/TimeUtil';
// import { oja as TimingMarkerPosition } from './modules/TimingMarkerPosition';

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Map an ad-break indication type to a display color code.
 *
 * @param {string} indicationType
 * @returns {number}
 */
function getColorForIndicationType(indicationType) {
  switch (indicationType) {
    case "AD_BREAK":
    case "AD_BREAK_ENUMERATED_ADS":
      return 52;
    case "NON_AD_BREAK":
      return 34;
    case "NO_INDICATION":
    default:
      return 60;
  }
}

/**
 * Derive seek / pause / language-selection UX policy from a server-provided
 * control mode string.
 *
 * @param {string} controlMode
 * @returns {{ seekEnabled: boolean|undefined, playPauseEnabled: boolean|undefined, languageSelectionEnabled: boolean|undefined }}
 */
function getUxControlsForMode(controlMode) {
  switch (controlMode) {
    case "ENABLED_AS_NORMAL":
      return { seekEnabled: true, playPauseEnabled: true, languageSelectionEnabled: true };
    case "DISABLED_EXCEPT_FOR_PAUSE_EXIT":
      return { seekEnabled: false, playPauseEnabled: true, languageSelectionEnabled: true };
    case "DISABLED_EXCEPT_FOR_PAUSE_EXIT_LIVE_EDGE":
      return { seekEnabled: false, playPauseEnabled: true, languageSelectionEnabled: true };
    default:
      return { seekEnabled: undefined, playPauseEnabled: undefined, languageSelectionEnabled: undefined };
  }
}

/**
 * Parse a compact 3-char UX control string (e.g. "TFT", "TT*") into the
 * controls object, using a bitmask for wildcard positions.
 *
 * @param {string|undefined} uxString
 * @param {object}           target    - Object to write the flags into.
 * @param {number}           bitmask   - Display-order used for wildcard resolution.
 */
function parseUxControlString(uxString, target, bitmask) {
  if (uxString?.length >= 3) {
    let wildcardIndex = 0;
    const flags = uxString
      .toLowerCase()
      .substring(0, 3)
      .split("")
      .map((ch) => {
        if (ch === "t") return true;
        if (ch === "f") return false;
        if (ch === "*") return ((1 << wildcardIndex++) & bitmask) === 0;
        return undefined;
      });
    target.seekEnabled = flags[0];
    target.playPauseEnabled = flags[1];
    target.languageSelectionEnabled = flags[2];
  } else {
    target.seekEnabled = undefined;
    target.playPauseEnabled = undefined;
    target.languageSelectionEnabled = undefined;
  }
}

// ─────────────────────────────────────────────────────────────
//  AdItem — individual ad inside an ad break
// ─────────────────────────────────────────────────────────────

/**
 * Wraps a single ad's metadata (start/end times, tracking events, verification
 * tokens) within an ad break.
 */
class AdItem {
  /**
   * @param {object} adData - Raw ad descriptor from the manifest / hydration response.
   */
  constructor(adData) {
    /** @type {object} Raw ad data. */
    this.adData = adData;

    /** @type {boolean} */
    this.isSkippableAd = false;

    /** @type {boolean} Whether impressions have been reported. */
    this.impressionReported = false;

    /** @type {boolean} Whether times have been normalized. */
    this.isNormalized = false;

    /** @type {TimeUtil} */
    this.startTime = TimeUtil.fromMilliseconds(this.adData.startTimeMs);

    /** @type {TimeUtil} */
    this.endTime = TimeUtil.fromMilliseconds(this.adData.contentEndPts);
  }

  /** @returns {string} Unique ad identifier. */
  get id() {
    return this.adData.id;
  }

  /** @returns {boolean} Whether this ad has been normalized. */
  get normalized() {
    return this.isNormalized;
  }

  /** @returns {number} Start time in milliseconds. */
  get startTimeMs() {
    return this.adData.startTimeMs;
  }

  /** @returns {number} End time in milliseconds. */
  get endTimeMs() {
    return this.adData.contentEndPts;
  }

  /** @returns {TimeUtil} */
  get startTimeValue() {
    return this.startTime;
  }

  /** @returns {TimeUtil} */
  get endTimeValue() {
    return this.endTime;
  }

  /** @returns {TimeUtil} Duration as a TimeUtil value. */
  get duration() {
    return this.endTime.lowestWaterMarkLevelBufferRelaxed(this.startTime);
  }

  /** @returns {object|undefined} Action-based ad tracking events. */
  get actionAdEvents() {
    return this.adData.actionAdEvents;
  }

  /** @returns {object|undefined} Time-based ad tracking events. */
  get timedAdEvents() {
    return this.adData.timedAdEvents;
  }

  /** @returns {*} Quality-of-service data. */
  get qo() {
    return this.adData.qo;
  }

  /** @returns {*} Creative metadata. */
  get creativeMetadata() {
    return this.adData.c1;
  }

  /** @returns {*} Third-party verification token for viewability measurement. */
  get thirdPartyVerificationToken() {
    return this.adData.thirdPartyVerificationToken;
  }

  /**
   * Normalize the ad's start/end times to presentation timestamps.
   *
   * @param {TimeUtil} normalizedStart
   * @param {TimeUtil} normalizedEnd
   */
  normalize(normalizedStart, normalizedEnd) {
    this.startTime = normalizedStart;
    this.endTime = normalizedEnd;
    this.isNormalized = true;
  }

  /** @returns {*} Companion ad reference. */
  get companionAd() {
    return this.companionAdRef;
  }

  /**
   * Set the companion ad reference.
   * @param {*} ref
   */
  setCompanionAd(ref) {
    this.companionAdRef = ref;
  }

  /** @returns {*} UI component descriptor for this ad. */
  get uiComponent() {
    return this.adData.uiComponent;
  }
}

// ─────────────────────────────────────────────────────────────
//  AdBreakWrapper
// ─────────────────────────────────────────────────────────────

/**
 * Rich wrapper around a manifest ad-break descriptor.
 *
 * Tracks hydration state, UX controls, ad items, and provides helper
 * accessors consumed by the playback and UI layers.
 */
class AdBreakWrapper {
  /**
   * @param {object} config       - Ad configuration (e.g. UX control strings).
   * @param {object} adBreakData  - Raw ad-break data from the manifest.
   * @param {number} displayOrder - Positional index in the break list.
   * @param {number} [currentAdIndex=NaN]
   */
  constructor(config, adBreakData, displayOrder, currentAdIndex = NaN) {
    /** @type {object} */
    this.config = config;

    /** @type {object} Raw ad-break data. */
    this.adBreakData = adBreakData;

    /** @type {number} Position in the ordered break list. */
    this.displayOrder = displayOrder;

    /** @type {number} Index of the currently-playing ad. */
    this.currentAdIndex = currentAdIndex;

    /** @type {boolean} Whether skippability was determined by hydration. */
    this.isSkippableFromHydration = false;

    /** @type {boolean} Whether the break has been presented to the user. */
    this.hasBeenPresented = false;

    /** @type {boolean} Whether a fallback ad is being shown. */
    this.shownFallbackAd = false;

    /** @type {{ seekEnabled: boolean|undefined, playPauseEnabled: boolean|undefined, languageSelectionEnabled: boolean|undefined }} */
    this.syntheticAdBreakUx = {
      seekEnabled: undefined,
      playPauseEnabled: undefined,
      languageSelectionEnabled: undefined,
    };

    /** @type {boolean} Whether this is a dynamic ad break. */
    this.isDynamicAdBreak = false;

    /** @type {boolean} Whether insertion was acknowledged. */
    this.insertionAcknowledged = false;

    /** @type {AdItem[]} List of individual ads in this break. */
    this.adsList = [];

    this.updateFromAdData(adBreakData, displayOrder);
  }

  /** @returns {*} Quality-of-service descriptor. */
  get qo() {
    return this.adBreakData.metadata.qo;
  }

  /** @returns {number} Display order (positional index). */
  get orderIndex() {
    return this.displayOrder;
  }

  /** @returns {boolean} Whether the break is hydration-ready (findNode set). */
  get isHydrationReady() {
    return !!this.adBreakData.state.findNode;
  }

  /** @returns {boolean} Whether the break was skipped entirely. */
  get wasSkipped() {
    return !!this.adBreakData.state.MB;
  }

  set wasSkipped(value) {
    this.adBreakData.state.MB = value;
  }

  /**
   * Reconcile the internal ads list with a new array of raw ad descriptors.
   *
   * @param {object[]} [rawAds=[]]
   */
  updateAdsList(rawAds = []) {
    const self = this;
    this.adsList = rawAds.map((ad, i) => {
      const existing = self.adsList[i];
      return existing?.id === ad.id ? existing : new AdItem(ad);
    });
  }

  /**
   * Full update from new manifest/hydration data.
   *
   * @param {object} newData      - Updated ad-break data.
   * @param {number} displayOrder - New display order.
   */
  updateFromAdData(newData, displayOrder) {
    const prevState = this.adBreakData.state;
    this.adBreakData = newData;
    const metadata = newData.metadata;
    const state = newData.state;
    const sequenceChanged = state.sequenceId !== prevState.sequenceId;

    if (this.adsList.length !== metadata.duration?.length || sequenceChanged) {
      this.updateAdsList(metadata.duration);
      if (metadata.source === "hydration" && state.isSkippableAd !== undefined) {
        this.isSkippableFromHydration = state.isSkippableAd;
      }
    }

    this.displayOrder = displayOrder;
    parseUxControlString(this.config.syntheticAdBreakUx, this.syntheticAdBreakUx, displayOrder);

    // Extract per-break color override from the config string (positions 4+).
    const uxStr = this.config.syntheticAdBreakUx;
    let colorOverride;
    if (uxStr?.length > 4) {
      const colorPart = uxStr.substring(4);
      const colorIdx = displayOrder % (colorPart.length / 2);
      colorOverride = parseInt(colorPart.substring(2 * colorIdx, 2 * colorIdx + 2), 16);
    }
    this.adDisplayColor = colorOverride;

    // Apply server-side UX display overrides.
    if (metadata.uxDisplay) {
      if (metadata.uxDisplay.oXb) {
        this.adDisplayColor = getColorForIndicationType(metadata.uxDisplay.oXb);
      }
      if (metadata.uxDisplay.zBa) {
        this.syntheticAdBreakUx = getUxControlsForMode(metadata.uxDisplay.zBa);
      }
    }

    // If the break is ready and source is not "viewable", present now.
    if (state.findNode && metadata.source !== "viewable") {
      this.presentAdNow(newData, state.sequenceId ?? -1);
      this.isDynamicAdBreak = state.DM || false;
    }

    this.currentAdIndex = state.sequenceId ?? -1;
  }

  /** @returns {object} Location object from metadata. */
  get location() {
    return this.adBreakData.metadata.location;
  }

  /** @returns {TimeUtil} Presentation time value. */
  get timeValue() {
    return this.adBreakData.metadata.timeValue;
  }

  /** @returns {number} Original location in milliseconds. */
  get originalLocationMs() {
    return this.adBreakData.metadata.kj;
  }

  /** @returns {*} Expiration / TTL data. */
  get expirationData() {
    return this.adBreakData.metadata.eZ;
  }

  /** @returns {number} Display color code. */
  get displayColor() {
    return this.adDisplayColor ?? this.adBreakData.metadata.internal_Zp;
  }

  /** @returns {number} Current ad sequence index. */
  get sequenceIndex() {
    return this.currentAdIndex;
  }

  /** @returns {object} Synthetic UX controls. */
  get uxControls() {
    return this.syntheticAdBreakUx;
  }

  /** @returns {object} Action-based ad-break events (e.g. impression URLs). */
  get actionAdBreakEvents() {
    return this.adBreakData.metadata.actionAdBreakEvents;
  }

  /** @returns {AdItem[]} Individual ads in this break. */
  get ads() {
    return this.adsList;
  }

  /** @returns {boolean} Whether the break has zero duration. */
  get empty() {
    return this.duration.equal(TimeUtil.seekToSample);
  }

  /** @returns {string} Data source ("viewable" | "hydration"). */
  get source() {
    return this.adBreakData.metadata.source;
  }

  /** @returns {TimeUtil} Total duration of this ad break. */
  get duration() {
    if (this.adBreakData.metadata.type === "embedded") {
      return this.adBreakData.metadata.duration;
    }
    return this.adsList.reduce(
      (acc, ad) => acc.item(ad.endTime.lowestWaterMarkLevelBufferRelaxed(ad.startTime)),
      TimeUtil.seekToSample
    );
  }

  /** @returns {*} Ad-pod identifier for dynamic breaks. */
  get adPodId() {
    const meta = this.adBreakData.metadata;
    return meta.type === "dynamic" ? meta.ywa : undefined;
  }

  /** @returns {string} "dynamic" or "embedded". */
  get type() {
    return this.adsList.length ||
      (!this.adBreakData.metadata.yu && this.adBreakData.metadata.type !== "embedded")
      ? "dynamic"
      : "embedded";
  }

  /** @returns {string|undefined} Ad-break identifier (hb). */
  get adBreakId() {
    return this.adBreakData.metadata.hb;
  }

  /** @returns {boolean} Whether all ads in the break are skippable (pre-hydration check). */
  get allAdsSkippablePreCheck() {
    if (this.isSkippableAd || (!this.isPending && !this.shownFallbackAd)) {
      return this.adsList.every((ad) => ad.isSkippableAd);
    }
    return false;
  }

  /** @returns {boolean} Whether the break as a whole is skippable. */
  get isSkippable() {
    if (this.isSkippableFromHydration) return true;
    return this.adsList.length ? this.adsList.every((ad) => ad.isSkippableAd) : false;
  }

  /** @returns {boolean} Whether the break is still pending hydration. */
  get isPending() {
    return !!this.adBreakData.state.sj;
  }

  /** @returns {boolean} Whether the break is pending and actually awaiting data. */
  get isPendingAndWaiting() {
    const isViewableSource =
      this.adBreakData.metadata.source === "viewable" && this.isMissing;
    return !!this.adBreakData.state.sj && !this.isMissing && !isViewableSource;
  }

  /** @returns {boolean} Whether the ad break is currently being presented. */
  get isPresenting() {
    return !!this.adBreakData.state.findNode;
  }

  /** @returns {TimeUtil} Expiration timestamp. */
  get expirationTime() {
    return this.adBreakData.metadata.expirationObject;
  }

  /** @returns {boolean} Whether the break has been presented to the user. */
  get presented() {
    return this.hasBeenPresented;
  }

  set presented(value) {
    if (value) this.hasBeenPresented = true;
  }

  /**
   * @returns {string|undefined} The ad-break trigger id (token used to initiate hydration).
   */
  getAdBreakToken() {
    return this.adBreakData.metadata.adBreakToken;
  }

  /**
   * @returns {string|undefined} The ad-break index value (hb).
   */
  currentIndexValue() {
    return this.adBreakData.metadata.hb;
  }

  /** @returns {boolean} Whether an SCTE cancellation was triggered for this break. */
  get scteCancellationTriggered() {
    return this.adBreakData.state.scteCancellationTriggered ?? false;
  }

  /**
   * Mark the break as skippable when it has no individual ads.
   */
  markSkippableIfEmpty() {
    if (!this.adsList.length) {
      this.isSkippableFromHydration = true;
    }
  }

  /**
   * Acknowledge that ad insertion was completed.
   */
  acknowledgeInsertion() {
    this.insertionAcknowledged = true;
  }

  /**
   * Immediately present this ad break to the user (e.g. for fallback ads).
   *
   * @param {object} adData   - Ad-break data to present.
   * @param {number} seqIndex - Sequence index.
   */
  presentAdNow(adData, seqIndex) {
    if (this.shownFallbackAd && seqIndex === this.currentAdIndex) return;
    this.adBreakData = adData;
    this.updateAdsList(adData.metadata.duration);
    this.shownFallbackAd = true;
    this.currentAdIndex = seqIndex;
    this.isDynamicAdBreak = adData.state.DM;
  }

  /**
   * Create a shallow clone of this wrapper.
   * @returns {AdBreakWrapper}
   */
  clone() {
    return new AdBreakWrapper(this.config, this.adBreakData, this.displayOrder, this.currentAdIndex);
  }
}

// ─────────────────────────────────────────────────────────────
//  SyntheticTimingMarker
// ─────────────────────────────────────────────────────────────

/**
 * Represents a synthetic timing marker (pre-roll or post-roll padding)
 * that can be attached to an ad break.
 */
class SyntheticTimingMarker {
  /**
   * @param {string} position     - "start" or "end" (from TimingMarkerPosition).
   * @param {number} durationMs   - Duration of the padding in milliseconds.
   */
  constructor(position, durationMs) {
    /** @type {string} */
    this.position = position;

    /** @type {number} */
    this.durationMs = durationMs;
  }

  /** @returns {TimeUtil} Duration as a TimeUtil value. */
  get duration() {
    return TimeUtil.fromMilliseconds(this.durationMs);
  }

  /** @returns {SyntheticTimingMarker} Shared pre-roll marker (zero duration). */
  static get preRollMarker() {
    if (!this._preRollMarker) {
      this._preRollMarker = new SyntheticTimingMarker(TimingMarkerPosition.start, 0);
    }
    return this._preRollMarker;
  }

  /** @returns {SyntheticTimingMarker} Shared post-roll marker (zero duration). */
  static get postRollMarker() {
    if (!this._postRollMarker) {
      this._postRollMarker = new SyntheticTimingMarker(TimingMarkerPosition.end, 0);
    }
    return this._postRollMarker;
  }
}

// ─────────────────────────────────────────────────────────────
//  AdBreakWrapperWithPadding
// ─────────────────────────────────────────────────────────────

/**
 * Composite wrapper that decorates an AdBreakWrapper with optional
 * pre-roll and post-roll padding (synthetic timing markers).
 */
class AdBreakWrapperWithPadding {
  /**
   * @param {AdBreakWrapper}               adBreak    - The core ad break.
   * @param {SyntheticTimingMarker} [preRoll]  - Pre-roll timing marker.
   * @param {SyntheticTimingMarker} [postRoll] - Post-roll timing marker.
   */
  constructor(adBreak, preRoll, postRoll) {
    /** @type {AdBreakWrapper} */
    this.adBreak = adBreak;

    /** @type {SyntheticTimingMarker} */
    this.preRollMarker = preRoll || SyntheticTimingMarker.preRollMarker;

    /** @type {SyntheticTimingMarker} */
    this.postRollMarker = postRoll || SyntheticTimingMarker.preRollMarker;
  }

  /** @returns {SyntheticTimingMarker} Pre-roll timing marker. */
  get preRoll() {
    return this.preRollMarker;
  }

  /** @returns {SyntheticTimingMarker} Post-roll timing marker. */
  get postRoll() {
    return this.postRollMarker;
  }

  /** @returns {boolean} Whether custom padding markers are applied. */
  get hasPadding() {
    return (
      this.preRollMarker !== SyntheticTimingMarker.preRollMarker ||
      this.postRoll !== SyntheticTimingMarker.postRollMarker
    );
  }

  /** @returns {TimeUtil} Total duration including padding. */
  get duration() {
    return this.adBreak.duration.item(this.preRoll.duration).item(this.postRoll.duration);
  }

  /** @returns {TimeUtil} Total padding duration (pre + post). */
  get paddingDuration() {
    return this.preRoll.duration.item(this.postRoll.duration);
  }

  /** @returns {string} "dynamic" or "embedded". */
  get type() {
    return this.adBreak.type;
  }

  /** @returns {number} Display color code. */
  get displayColor() {
    return this.adBreak.internal_Zp;
  }

  /** @returns {boolean} Whether insertion was acknowledged. */
  get insertionAcknowledged() {
    return this.adBreak.insertionAcknowledged;
  }

  /**
   * Create a shallow clone.
   * @returns {AdBreakWrapperWithPadding}
   */
  clone() {
    return new AdBreakWrapperWithPadding(this.adBreak.clone(), this.preRoll, this.postRoll);
  }
}

export { AdBreakWrapper, AdItem, SyntheticTimingMarker, AdBreakWrapperWithPadding };
