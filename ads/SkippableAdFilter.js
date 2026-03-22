/**
 * Netflix Cadmium Player - Skippable Ad Filter
 *
 * Filters ad break registration for skippable ads. If the ad break
 * is skippable and not an auxiliary manifest, the entire break is
 * marked as played (skipped) rather than being processed normally.
 *
 * @module ads/SkippableAdFilter
 */

/**
 * Filters ad break registration to auto-skip skippable ad breaks.
 */
export class SkippableAdFilter {
  /**
   * Registers an ad break listener. If the ad break is skippable and
   * not from an auxiliary manifest, returns a "played" result that
   * effectively skips the ad break.
   *
   * @param {Object} adBreakContext - Context with adBreak and optional manifest info.
   * @param {Object} adBreakContext.adBreak - The ad break descriptor.
   * @param {Object} [adBreakContext.manifestInfo] - Optional manifest info with isAuxiliary flag.
   * @param {Function} registerFn - The base registration function.
   * @returns {Object} Registration result, or a skip result for skippable ads.
   */
  registerAdListener(adBreakContext, registerFn) {
    const { adBreak, GIb: manifestInfo } = adBreakContext;

    if (manifestInfo?.isAuxiliary || !adBreak.isSkippableAd) {
      return registerFn(adBreakContext);
    }

    return {
      isSkipped: true,
      skipIndices: [],
      reason: 'played',
    };
  }
}
