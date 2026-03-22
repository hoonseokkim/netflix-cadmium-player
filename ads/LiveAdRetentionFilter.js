/**
 * Netflix Cadmium Player — Live Ad Retention Filter
 *
 * Determines which ads in a live ad break should be retained or dropped
 * based on timing constraints.  When the live edge has progressed past
 * an ad's scheduled end time (plus a configurable cushion), the ad is
 * marked for early termination ("live-drop").
 *
 * Used during live streaming to gracefully skip ads that can no longer
 * be presented in full before the live window moves past them.
 *
 * @module LiveAdRetentionFilter
 */

// Dependencies
// import { __values } from 'tslib';
// import { TimeUtil } from './modules/Module_91176';

/**
 * Filters ads in a live ad break based on time constraints.
 */
export class LiveAdRetentionFilter {
  /**
   * @param {object} config  - Filter configuration.
   * @param {boolean} config.alwaysRetainAds - When true, never drop any ads.
   * @param {number} config.liveAdEarlyTerminationCushionMs - Grace period in ms
   *   before considering an ad eligible for early termination.
   * @param {object} console - Console/logger instance.
   */
  constructor(config, console) {
    /** @private */ this.config = config;
    /** @private */ this.console = console;
  }

  /**
   * Evaluates an ad break and decides which ads to retain or drop.
   *
   * @param {object} adBreakContext - Context for the ad break being evaluated.
   * @param {object} adBreakContext.GIb   - Ad break metadata.
   * @param {object} adBreakContext.adBreak - The ad break descriptor with timing info.
   * @param {function} defaultFilter - The default/fallback filter function.
   * @returns {{ ny: boolean, oy: number[], reason?: string }}
   *   - `ny`: true if the entire break should be skipped.
   *   - `oy`: indices of individual ads to drop.
   *   - `reason`: reason string (e.g., "live-drop").
   */
  registerAdListener(adBreakContext, defaultFilter) {
    // If configured to always retain, use the default filter
    if (this.config.alwaysRetainAds) {
      return defaultFilter(adBreakContext);
    }

    const metadata = adBreakContext.GIb;
    const adverts = metadata?.adverts;
    const isAlreadyProcessed = adverts?.OQb;

    // Only process ad playgraphs with advert data
    if (!metadata?.isAdPlaygraph || !adverts) {
      return defaultFilter(adBreakContext);
    }

    const liveEdgeTime = metadata.getPlaygraphNode(true);
    const earliestEventTime = metadata.mediaEventsStore?.earliestEventTime;
    const { adBreak } = adBreakContext;
    const adBreakEndTime = adBreak.timeValue.item(adBreak.expirationObject || adBreak.duration);
    const canSkipBreak = !isAlreadyProcessed && adBreak.qo;

    // Drop entire break if live edge is past the ad break end
    if (liveEdgeTime && adBreakEndTime.lessThan(liveEdgeTime) && canSkipBreak) {
      return {
        ny: true,
        oy: [],
        reason: "live-drop",
      };
    }

    // Check individual ads for live-drop eligibility
    if (liveEdgeTime && adBreak.duration) {
      let filterResult = defaultFilter(adBreakContext);
      if (filterResult.ny) {
        return filterResult;
      }

      // Build cumulative duration list, reversed for back-to-front evaluation
      let cumulativeDuration = TimeUtil.seekToSample;
      const adEntries = adBreak.duration
        .map((ad, index) => {
          cumulativeDuration = cumulativeDuration.item(ad.duration);
          return { ad, index, cumulativeEnd: cumulativeDuration };
        })
        .reverse();

      const droppedIndices = filterResult.oy || [];

      for (const entry of adEntries) {
        const { index } = entry;

        // Skip already-dropped ads
        if (droppedIndices.indexOf(index) !== -1) continue;

        // Stop if this ad is not skippable
        if (!entry.thirdPartyVerificationToken.qo) break;

        const adEndTime = adBreak.timeValue.item(entry.cumulativeEnd);
        const breakEndTime = adBreak.timeValue.item(adBreak.expirationObject || adBreak.duration);
        const cushionedTime = (earliestEventTime || liveEdgeTime).item(
          TimeUtil.fromMilliseconds(this.config.liveAdEarlyTerminationCushionMs)
        );

        // Drop if the ad's end is past the live edge, or the break end
        // is past the cushioned time
        if (adEndTime.lessThan(liveEdgeTime) || breakEndTime.lessThan(cushionedTime)) {
          droppedIndices.push(index);
        } else {
          break;
        }
      }

      return {
        ny: false,
        oy: droppedIndices,
        reason: "live-drop",
      };
    }

    return defaultFilter(adBreakContext);
  }
}
