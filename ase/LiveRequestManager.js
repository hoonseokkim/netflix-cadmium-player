/**
 * Netflix Cadmium Player - Live Request Manager
 *
 * Extends the base request manager to handle live streaming scenarios.
 * Creates requests for live text media, tracks fragment timing updates,
 * and manages live segment boundaries. Handles the special cases of
 * live content where segment durations and edit lists may change
 * dynamically during playback.
 *
 * @module ase/LiveRequestManager
 */

/**
 * Request manager specialized for live streaming content.
 *
 * Handles live text requests, fragment time resolution for live segments,
 * and propagates timing updates through the fragment index. Extends
 * BaseRequestManager with live-specific logic for segment tracking and
 * timing correction.
 *
 * @extends BaseRequestManager
 */
export class LiveRequestManager /* extends BaseRequestManager */ {
  /**
   * @param {Object} liveTracker - Live content tracker with segment recording methods.
   * @param {...*} args - Remaining arguments passed to BaseRequestManager.
   */
  constructor(liveTracker, ...args) {
    // super(liveTracker, ...args);
    /** @type {Object} Live content tracker for recording segment boundaries */
    this.liveTracker = liveTracker;
  }

  /**
   * Creates a download request, handling live text media as a special case.
   *
   * For text media types, creates an AseLiveTextRequest. For other media
   * types, delegates to the base class and records any missing segments
   * in the live tracker.
   *
   * @param {Object} requestParams - Request parameters (must not have a header set).
   * @param {Object} downloadTrack - The download track descriptor.
   * @param {Object} streamInfo - Stream information including mediaType.
   * @returns {Object} The created request object.
   */
  serializeRecord(requestParams, downloadTrack, streamInfo) {
    const config = this.config;

    if (streamInfo.mediaType === MediaType.TEXT_MEDIA_TYPE) {
      const textRequest = new AseLiveTextRequest(
        streamInfo,
        this.isLive.liveTrack.track,
        requestParams,
        this.fragmentIndex,
        this.isLive.currentSegment,
        config,
        this.console,
        this.requestContext
      );

      this.recordRequest(textRequest);
      return textRequest;
    }

    const request = super.serializeRecord(requestParams, downloadTrack, streamInfo);

    if (!(request instanceof MissingSegmentType)) {
      this.liveTracker.recordMissingSegment(request);
    }

    return request;
  }

  /**
   * Called when fragment timing data is resolved for a live request.
   *
   * Updates fragment boundaries, handles edit list changes for first/last
   * fragments, and propagates timing corrections to subsequent fragments
   * in the fragment index.
   *
   * @param {Object} fragment - The fragment whose times were resolved.
   * @param {Object} timingData - Resolved timing information.
   * @param {boolean} timesChanged - Whether the timing data differs from predictions.
   * @param {boolean} editChanged - Whether the fragment edit list changed.
   */
  onFragmentTimesResolved(fragment, timingData, timesChanged, editChanged) {
    if (
      fragment.isFirstFragment &&
      fragment.stream.track.onFirstFragmentLive(
        this.isLive,
        fragment.index,
        timingData
      ) &&
      fragment.sampleCount !== timingData.fragmentDuration
    ) {
      this.console.RETRY(
        'LiveRequestManager: onfragmenttimes: predicted fragment sample count incorrect',
        `current = ${fragment.sampleCount}, actual = ${timingData.fragmentDuration}`
      );
      fragment.extendFragmentEnd(timingData.fragmentDuration);
      timesChanged = true;
    }

    if (editChanged) {
      if (fragment.isFirstFragment) {
        this.liveTracker.updateFirstFragmentEdit(fragment);
      } else if (fragment.stateInfo) {
        this.liveTracker.updateLastFragmentEdit(fragment);
      }
    }

    if (timesChanged) {
      const fragmentIdx = this.fragmentIndex.indexOf(fragment);
      if (fragmentIdx + 1 < this.fragmentIndex.length) {
        const nextFragment = this.fragmentIndex.key(fragmentIdx + 1);
        nextFragment?.updateContentStart(fragment.contentEnd);
      }
      this.fragmentIndex.update();
    }

    this.liveTracker.recordMissingSegment(fragment);
  }

  /**
   * Updates presentation timestamps for all fragments in the index
   * based on the latest live track segment data.
   */
  updateFragmentTimes() {
    if (!this.fragmentIndex.length) return;

    const track = this.fragmentIndex.key(0).stream.track;

    this.fragmentIndex.forEach((fragment) => {
      const segment = track.getTrackSegment(fragment.index);
      const startTime = segment.presentationStartTime;
      const endTime = segment.segmentEndTime;
      fragment.trimFragment(startTime, endTime, false);
    });

    this.fragmentIndex.update();
  }
}
