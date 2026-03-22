/**
 * Netflix Cadmium Player — ASEJS Padding Viewable
 *
 * A lightweight stub viewable used when the player needs a placeholder
 * (e.g. for padding segments between ad breaks).  It satisfies the
 * viewable interface but has no real streaming data, no DRM, and
 * limited time calculations.
 *
 * @module AsejsPaddingViewable
 */

// Dependencies
// import { platform } from './modules/Platform';
// import { viewableId } from './modules/ViewableId';
// import { TimeUtil, assert } from './modules/TimeUtil';

/**
 * Stub viewable for inter-break padding segments.
 */
class PaddingViewable {
  /**
   * @param {string} viewableId       - Unique viewable identifier.
   * @param {number} fragmentDuration - Expected fragment duration in ms (for timestamp snapping).
   */
  constructor(viewableId, fragmentDuration) {
    /** @type {string} */
    this.viewableId = viewableId;

    /** @type {number} */
    this.fragmentDurationMs = fragmentDuration;

    /** @type {boolean} */
    this.isReadyForPlayback = false;

    /** @type {boolean} */
    this.contentProfile = false;

    /** @type {boolean} */
    this.isReadyForPlayback = false;

    /** @type {boolean} */
    this.hasInitialized = false;

    /** @type {string} Formatted viewable id string. */
    this.formattedId = `${viewableId}`;

    /** @type {boolean} */
    this.isAuxiliaryContent = false;

    /** @type {boolean} */
    this.isAdPlaygraph = false;

    /** @type {boolean} */
    this.hasSegmentAvailabilityWindow = false;

    /** @type {boolean} */
    this.isAuxiliary = false;

    /** @type {boolean} */
    this.isAuxiliaryManifest = false;

    /** @type {Console} */
    this.console = new platform.Console("ASEJS", "media|asejs", "PaddingViewable");
  }

  /**
   * Server time is not synced on padding viewables — falls back to device clock.
   * @returns {number}
   */
  get serverTimeMs() {
    this.console.RETRY(
      "Unexpected access of serverTimeMs on PaddingViewable. " +
        "serverTimeMs is not server synced on PaddingViewable and will be based on the device clock."
    );
    return platform.platform.now();
  }

  /**
   * @returns {boolean} Always false — padding viewables have no HDR content.
   */
  hasHdrContent() {
    return false;
  }

  /** No-op: padding viewables have no tracks. */
  getTrackById() {}

  /** @returns {boolean} Always false. */
  get isDisposed() {
    return false;
  }

  /** No-op. */
  setup() {}

  /** No-op. */
  clearPendingRequests() {}

  /**
   * @returns {boolean} Always true — padding viewables cannot fail.
   */
  onNetworkFailure() {
    return true;
  }

  /** No-op. */
  getChapters() {}

  /**
   * Snap a raw timestamp to the nearest fragment boundary.
   *
   * @param {*}      _selectors - Unused track selectors.
   * @param {number} timestampMs - Raw timestamp in milliseconds.
   * @returns {TimeUtil}
   */
  normalizeTimestamp(_selectors, timestampMs) {
    assert(
      this.fragmentDurationMs,
      "Padding viewable must have fragmentDuration set when timestamp normalization is requested"
    );
    const lower = Math.floor(timestampMs / this.fragmentDurationMs) * this.fragmentDurationMs;
    const upper = Math.ceil(timestampMs / this.fragmentDurationMs) * this.fragmentDurationMs;
    return Math.abs(timestampMs - lower) <= Math.abs(timestampMs - upper)
      ? TimeUtil.fromMilliseconds(lower)
      : TimeUtil.fromMilliseconds(upper);
  }

  /** No-op. */
  getPlaygraphNode() {}

  /**
   * @returns {TimeUtil} Sentinel "unknown" time.
   */
  getBufferEndTime() {
    return TimeUtil.g0a;
  }

  /**
   * @returns {number} -1 (no live edge).
   */
  getLiveEdgeTime() {
    return -1;
  }

  /**
   * @returns {TimeUtil} -1 ms (no live segment duration).
   */
  getLiveSegmentDuration() {
    return TimeUtil.fromMilliseconds(-1);
  }
}

export { PaddingViewable };
