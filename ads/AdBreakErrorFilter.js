/**
 * Netflix Cadmium Player - Ad Break Error Filter
 *
 * Filters ad break registration by checking individual ad pods for
 * errors or blocklist status. When an ad pod has failed or is
 * blocklisted, it is marked for skipping in the ad break listener
 * response.
 *
 * @module ads/AdBreakErrorFilter
 */

/**
 * Filters ad break pod registration, marking error or blocklisted
 * pods for skipping during ad break playback.
 */
export class AdBreakErrorFilter {
  /**
   * @param {Object} blocklistChecker - Object with a check(id) method to determine blocklist status.
   */
  constructor(blocklistChecker) {
    /** @type {Object} Blocklist checker instance */
    this.blocklistChecker = blocklistChecker;
  }

  /**
   * Registers an ad break listener, scanning each ad pod for errors
   * or blocklist status. Pods that have errors or are blocklisted are
   * added to the skip list.
   *
   * @param {Object} adBreakContext - Context containing the adBreak data.
   * @param {Object} adBreakContext.adBreak - The ad break with a pods array.
   * @param {Function} registerFn - The base registration function.
   * @returns {Object} Registration result with skip indices and reason.
   */
  registerAdListener(adBreakContext, registerFn) {
    const { adBreak } = adBreakContext;
    const result = registerFn(adBreakContext);

    if (!result.isSkipped) {
      adBreak.duration.forEach((pod, index) => {
        if (pod.hasError || this.blocklistChecker.isBlocklisted(pod.id)) {
          result.skipIndices.push(index);
          result.reason = 'error';
        }
      });
    }

    return result;
  }
}
