/**
 * Netflix Cadmium Player — PreserveAppendedAdsPolicy
 *
 * Ad buffering policy that prevents already-appended (in-buffer) ad segments
 * from being re-fetched or discarded during ad-break rehydration.
 *
 * When a new ad ordering is computed, this policy filters out ad IDs that
 * are already present in the source buffer, keeping the download list
 * lean and avoiding redundant network requests.
 *
 * @module ads/PreserveAppendedAdsPolicy
 */

export class PreserveAppendedAdsPolicy {
  /**
   * @param {Object} logger - Console/debug logger instance.
   */
  constructor(logger) {
    /** @type {Object} */
    this.console = logger;
  }

  /**
   * Filter an ad-break's download list to exclude ads whose media
   * is already buffered in the source buffer.
   *
   * @param {Object} adBreakState - Current ad-break state, including
   *   `appendedSegments` (list of appended segments with ad metadata)
   *   and `adBreak` (the ad break descriptor).
   * @param {Object} downloadPlan - The proposed download plan produced
   *   by the upstream policy, containing an `adIds` array and a `reason`.
   * @returns {Object} The (possibly modified) download plan.
   */
  registerAdListener(adBreakState, downloadPlan) {
    // Collect IDs of ads already appended to the buffer
    const bufferedAdIds = adBreakState.appendedSegments.reduce(function (set, segment) {
      if (!segment.adMetadata.isBufferMarker) {
        set.add(segment.adMetadata.adId);
      }
      return set;
    }, new Set());

    // Remove already-buffered ad IDs from the download list
    const filteredAdIds = downloadPlan.adIds.filter(function (id) {
      return !bufferedAdIds.has(id);
    });

    if (downloadPlan.adIds.length !== filteredAdIds.length) {
      downloadPlan.adIds = filteredAdIds;
      downloadPlan.reason = 'ad in buffer';

      this.console.log('PreserveIndividualAppendedAdsPolicy: preserving ads in ad break', {
        retryCount: adBreakState.timedTextDownloadRetryCountBeforeCdnSwitch,
        adBreakId: adBreakState.adBreak.adBreakId,
        appendedSegments: adBreakState.appendedSegments,
        remainingAdIds: downloadPlan.adIds,
      });
    }

    return downloadPlan;
  }
}
