/**
 * @file AdPoliciesManager.js
 * @description Manages ad-break policies during playback: determines when and which
 *   pre-roll/mid-roll ads to show on seek, evaluates ad-break drops, and adjusts seek
 *   positions to accommodate ad insertion within the playgraph.
 * @module ads/AdPoliciesManager
 * @original Module_45991 (O9a)
 */

import { TimeUtil, assert, isDefined, pipe } from '../timing/TimeUtil.js';
import { SegmentType } from '../ads/SegmentType.js';         // Module 79048 (ed)
import { DEBUG } from '../utils/DebugFlags.js';               // Module 48170
import { assert as strictAssert } from '../assert/Assert.js'; // Module 52571
import { getAdInfo, getContentSegmentInfo } from '../ads/AdSegmentUtils.js'; // Module 14103
import { AdDropEvaluatorGkb } from '../ads/AdDropEvaluatorGkb.js'; // Module 3758
import { AdDropEvaluatorWfb } from '../ads/AdDropEvaluatorWfb.js'; // Module 88700
import { AdDropEvaluatorTbb } from '../ads/AdDropEvaluatorTbb.js'; // Module 15905
import { AdDropEvaluatorSbb } from '../ads/AdDropEvaluatorSbb.js'; // Module 73803
import { AdDropEvaluatorOhb } from '../ads/AdDropEvaluatorOhb.js'; // Module 70778
import { AdDropEvaluatorIkb } from '../ads/AdDropEvaluatorIkb.js'; // Module 45496
import { AdDropEvaluatorHkb } from '../ads/AdDropEvaluatorHkb.js'; // Module 77184
import { findLast } from '../utils/CollectionUtils.js';

/**
 * Finds the first content segment reachable from the given starting segment.
 * Follows the defaultNext chain, skipping non-content segments.
 *
 * @param {Object} segmentMap - Map of segment IDs to segment objects
 * @param {string} segmentId - Starting segment ID
 * @returns {string|undefined} First content segment ID, or undefined if none found
 */
function findFirstContentSegment(segmentMap, segmentId) {
    const segment = segmentId && segmentMap.segments[segmentId];
    if (!segment) return undefined;
    if (segment.type !== SegmentType.content) {
        return findFirstContentSegment(segmentMap, segment.defaultNext);
    }
    return segmentId;
}

/**
 * Manages ad policies for seek operations and playback transitions.
 * Evaluates whether pre-roll or mid-roll ad breaks should be shown,
 * adjusts seek positions to respect ad break boundaries, and determines
 * when ad breaks can be skipped or dropped.
 */
export class AdPoliciesManager {
    /**
     * @param {Object} configParam - Ad configuration parameters including per-viewable ad breaks
     * @param {Object} logger - Console/logger instance
     * @param {Object} previousValue - Player session state accessor
     * @param {Object} config - Player configuration
     * @param {Object} viewableSessionMap - Map of viewable IDs to session objects
     * @param {Object} adContext - Additional ad context (e.g., live event info)
     */
    constructor(configParam, logger, previousValue, config, viewableSessionMap, adContext) {
        /** @type {Object} Ad configuration with per-viewable ad break arrays */
        this.configParam = configParam;

        /** @type {Object} Logger */
        this.console = logger;

        /** @type {Object} Player session state accessor */
        this.previousValue = previousValue;

        /** @type {Object} Player config */
        this.config = config;

        /** @type {Object} Map of viewable IDs to sessions */
        this.viewableSessionMap = viewableSessionMap;

        /**
         * @type {Array<Object>} Pipeline of ad-break drop evaluators.
         * Each evaluator implements `registerAdListener` to vote on whether an ad break should be dropped.
         */
        this.adDropEvaluators = [
            new AdDropEvaluatorHkb(logger),
            new AdDropEvaluatorGkb(logger),
            new AdDropEvaluatorIkb(),
            new AdDropEvaluatorWfb(config, logger),
            new AdDropEvaluatorTbb(),
            new AdDropEvaluatorSbb(adContext),
            new AdDropEvaluatorOhb()
        ].filter(isDefined);

        /** @type {Object|undefined} Cached pending ad break for deferred insertion */
        this.pendingAdBreak = undefined;
    }

    /**
     * Resets the cached pending ad break state.
     */
    reset() {
        this.pendingAdBreak = undefined;
    }

    /**
     * Evaluates whether an ad break should be dropped based on the pipeline of evaluators.
     *
     * @param {Object} adBreak - The ad break to evaluate
     * @param {number} retryCount - Timed text download retry count before CDN switch
     * @param {string} viewableId - Target viewable ID
     * @param {Object} context - Additional evaluation context
     * @param {Object} [cachedViewable] - Cached viewable object to avoid lookups
     * @returns {Object} Evaluation result from the pipeline
     */
    registerAdListener(adBreak, retryCount, viewableId, context, cachedViewable) {
        const viewable = cachedViewable?.J === viewableId
            ? cachedViewable
            : this.previousValue.playlistArray().filter((v) => v.J === viewableId)[0];

        const currentSegments = Array.from(this.previousValue.player.branches).map(
            (branch) => branch.currentSegment
        );

        const adBreakPlayer = this.previousValue.playbackContainer?.adBreakPlayer;
        const activePlayback = this.previousValue.player.$L();

        const evaluationInput = {
            GIb: viewable,
            adBreak,
            spc: context,
            timedTextDownloadRetryCountBeforeCdnSwitch: retryCount,
            cL: currentSegments.map((seg) => adBreakPlayer?.pS(seg.id)).filter(isDefined),
            GFc: activePlayback && adBreakPlayer?.pS(activePlayback.currentSegment.id)
        };

        const evaluatorFns = this.adDropEvaluators.map(
            (evaluator) => evaluator.registerAdListener.bind(evaluator)
        );

        const result = pipe.vM(evaluationInput, evaluatorFns);

        if (DEBUG) {
            this.console.info('Evaluated ad-break drop', {
                Ub: retryCount,
                Xbd: currentSegments.map((seg) => seg.id),
                result
            });
        }

        return result;
    }

    /**
     * Checks if a seek position is effectively at the beginning (for live or initial seeks).
     *
     * @param {Object} seekPosition - Seek position with M (segment ID) and offset
     * @param {Object} viewable - Viewable session object
     * @returns {boolean} True if the position is at the start
     */
    isAtStart(seekPosition, viewable) {
        if (seekPosition.offset.equal(TimeUtil.seekToSample)) {
            return true;
        }
        if (viewable.isAdPlaygraph && viewable.liveEventTimes?.startTime) {
            const liveStart = viewable.networkState.rvb(TimeUtil.seekToSample);
            this.console.pauseTrace(
                `Checking ${seekPosition.offset.playbackSegment} against ${liveStart.playbackSegment} for live seek`
            );
            return seekPosition.offset.playbackSegment === liveStart.playbackSegment;
        }
        return false;
    }

    /**
     * Applies ad policies to a seek position, potentially adjusting it to accommodate
     * pre-roll or mid-roll ad breaks in the playgraph.
     *
     * @param {Object} seekTarget - Target seek position {M: segmentId, offset}
     * @param {Object} seekResolver - Resolver that computes canonical seek positions
     * @param {Object} [playgraph] - Working playgraph (defaults to current)
     * @returns {Object} Result with adjusted seekPosition, entryPoint, and policy info
     */
    applyAdPoliciesToSeekPosition(seekTarget, seekResolver, playgraph) {
        if (playgraph === undefined) {
            playgraph = this.previousValue.workingPlaygraph;
        }

        const segmentMap = playgraph.segmentMap;
        const viewableId = playgraph.QI.key(seekTarget.M)?.J;

        strictAssert(
            viewableId !== undefined,
            'AdPolicies::applyAdPoliciesToSeekPosition: viewableId must exist in outermost playgraph for segment: ' + seekTarget.M
        );

        const adBreaksForViewable = this.configParam.fu[viewableId];
        let resolvedPosition = seekResolver.CH(seekTarget);
        let adjustedPosition = resolvedPosition;
        const targetSegment = segmentMap.segments[resolvedPosition.M];
        const adInfo = getAdInfo(resolvedPosition.M);

        let matchedAdBreak;
        if (adBreaksForViewable && adInfo?.timedTextDownloadRetryCountBeforeCdnSwitch !== undefined) {
            matchedAdBreak = adBreaksForViewable[adInfo.timedTextDownloadRetryCountBeforeCdnSwitch];
        } else if (adBreaksForViewable && adInfo?.hb) {
            matchedAdBreak = adBreaksForViewable.filter((ab) => ab.hb === adInfo.hb)[0];
        }

        if (DEBUG) {
            this.console.debug('AdPolicies::applyAdPoliciesToSeekPosition', {
                Fm: seekTarget,
                ISa: resolvedPosition
            });
        }

        const viewableSession = this.viewableSessionMap.key(viewableId);
        strictAssert(viewableSession, 'AdPolicies::applyAdPoliciesToSeekPosition: viewable must exist: ' + viewableId);

        let adResult;
        let currentSegmentId;

        if (this.isAtStart(resolvedPosition, viewableSession)) {
            adResult = this.getPrerollAdBreakForPlaygraph(segmentMap, adBreaksForViewable, resolvedPosition);
        } else {
            if (targetSegment.type === SegmentType.padding) {
                resolvedPosition = {
                    M: targetSegment.defaultNext,
                    offset: TimeUtil.seekToSample
                };
            }

            const activePlayback = this.previousValue.player.$L();
            if (activePlayback?.currentSegment.id) {
                currentSegmentId = activePlayback.currentSegment.id;
            } else {
                const firstContent = findFirstContentSegment(segmentMap, segmentMap.initialSegment);
                if (this.previousValue.hasStarted && this.previousValue.player.hasPlayingContent ||
                    this.previousValue.mediae_Baa() ||
                    firstContent !== resolvedPosition.M ||
                    !this.config.enablePrerollForInitialSeek) {
                    currentSegmentId = firstContent;
                } else {
                    adResult = this.getPrerollAdBreakForPlaygraph(segmentMap, adBreaksForViewable, seekResolver.CH({
                        M: seekTarget.M,
                        offset: TimeUtil.seekToSample
                    }));
                }
            }

            if (!adResult && currentSegmentId) {
                if (DEBUG) {
                    this.console.pauseTrace(`ads::seekStreaming: seek from segment ${currentSegmentId}`);
                }
                adResult = this.getPrerollAdOnSeek(currentSegmentId, resolvedPosition, playgraph);
            }
        }

        const hasAdverts = !!viewableSession.adverts?.hasAdverts;
        const adResultPz = adResult?.adBreak.bya.pz;
        const matchedPz = matchedAdBreak?.bya.pz;
        const shouldShowAd = hasAdverts || adResultPz || matchedPz;

        let entryPoint;

        if (adResult && !shouldShowAd) {
            if (adResult.M) {
                adjustedPosition = {
                    M: adResult.M,
                    offset: TimeUtil.seekToSample
                };

                if (DEBUG) {
                    this.console.debug('AdPolicies::applyAdPoliciesToSeekPosition adjusting entrypoint', {
                        ISa: resolvedPosition
                    });
                }

                if (targetSegment.type === SegmentType.thirdPartyVerificationToken) {
                    resolvedPosition = {
                        M: resolvedPosition.M,
                        offset: TimeUtil.seekToSample
                    };
                    if (DEBUG) {
                        this.console.debug('AdPolicies::applyAdPoliciesToSeekPosition snapping entrypoint to beginning of ad', {
                            ISa: resolvedPosition
                        });
                    }
                }
                entryPoint = resolvedPosition;
            } else {
                if (targetSegment.type !== SegmentType.thirdPartyVerificationToken) {
                    this.pendingAdBreak = adResult.adBreak;
                }
            }
        }

        const policy = {
            ZAc: shouldShowAd ? targetSegment.type === SegmentType.thirdPartyVerificationToken : !!adResult,
            vuc: currentSegmentId,
            to: resolvedPosition
        };

        if (!entryPoint && targetSegment.type === SegmentType.thirdPartyVerificationToken && !matchedAdBreak) {
            if (DEBUG) {
                this.console.debug('AdPolicies::applyAdPoliciesToSeekPosition seeking to an ad, defaulting entryPoint', {
                    PA: entryPoint,
                    ISa: resolvedPosition
                });
            }

            if (resolvedPosition.offset.greaterThan(TimeUtil.seekToSample)) {
                if (DEBUG) {
                    this.console.debug('AdPolicies::resetting seek position to beginning of ad');
                }
                resolvedPosition = {
                    M: resolvedPosition.M,
                    offset: TimeUtil.seekToSample
                };
            }
            adjustedPosition = entryPoint = resolvedPosition;
        }

        if (DEBUG) {
            this.console.debug(
                'AdPolicies::applyAdPoliciesToSeekPosition returning: ',
                `{ seekPosition: ${adjustedPosition}, entryPoint: ${entryPoint}, policy: ${policy}}`
            );
        }

        return {
            Fm: adjustedPosition,
            PA: entryPoint,
            J2a: policy
        };
    }

    /**
     * Gets the pending ad break for a given viewable and position.
     *
     * @param {string} viewableId - Viewable ID
     * @param {Object} position - Current position
     * @param {boolean} isInitial - Whether this is the initial play
     * @param {string} initialSegmentId - ID of the initial segment
     * @returns {Object|undefined} Ad break to play, if any
     */
    getPendingAdBreak(viewableId, position, isInitial, initialSegmentId) {
        if (this.pendingAdBreak) {
            const adBreak = this.pendingAdBreak;
            this.pendingAdBreak = undefined;
            return adBreak;
        }

        const adBreaks = this.configParam.fu[viewableId];
        if (!adBreaks || !adBreaks.length) return undefined;

        if (isInitial && position.M === initialSegmentId && position.offset.equal(TimeUtil.seekToSample)) {
            const firstBreak = adBreaks[0];
            if (firstBreak.location.playbackSegment === 0 && firstBreak.empty && !firstBreak.isSkippableAd && !firstBreak.isAdBreakCompleted) {
                return firstBreak;
            }
        } else if (!isInitial) {
            return this.getEmptyAdForSegment(position.M, adBreaks);
        }
    }

    /**
     * Finds a pre-roll ad break when seeking between segments.
     * Walks the segment chain from `fromSegmentId` to `toPosition`, looking for
     * ad breaks that should trigger.
     *
     * @param {string} fromSegmentId - Source segment ID
     * @param {Object} toPosition - Target seek position
     * @param {Object} playgraph - Working playgraph
     * @returns {Object|undefined} Ad break result with segment ID and ad break data
     */
    getPrerollAdOnSeek(fromSegmentId, toPosition, playgraph) {
        if (DEBUG) {
            this.console.pauseTrace(
                `AdPoliciesManager: getPrerollAdOnSeek: from ${fromSegmentId} to ${JSON.stringify(toPosition)}`
            );
        }

        if (!playgraph) {
            if (DEBUG) this.console.pauseTrace('AdPoliciesManager: getPrerollOnSeek: returning undefined');
            return undefined;
        }

        const outerSegmentId = playgraph.$M(toPosition.M);
        strictAssert(outerSegmentId, 'inner WorkingPlaygraph segmentId should map correctly to outermost');

        const adBreaks = this.configParam.fu[playgraph.QI.segmentMap.segments[outerSegmentId].J];
        const segments = playgraph.segmentMap.segments;

        let currentId = segments[fromSegmentId]?.defaultNext;
        if (!segments[fromSegmentId]) {
            currentId = this.previousValue.segmentMap.segments[fromSegmentId].defaultNext;
        }

        let lastType;
        let candidateResult;

        while (currentId) {
            const segment = segments[currentId];
            if (!segment) {
                this.console.RETRY(`AdPoliciesManager: getPrerollOnSeek: segment ${currentId} not found`);
                break;
            }

            if (segment.type === SegmentType.content && (lastType === SegmentType.content || lastType === undefined) && adBreaks) {
                const emptyAd = this.getEmptyAdForSegment(currentId, adBreaks);
                if (emptyAd) {
                    candidateResult = { Sa: emptyAd };
                }
            }

            if (currentId === toPosition.M) {
                const isBeforeAd = candidateResult && !candidateResult.M;
                const hasTransition = lastType && lastType !== SegmentType.content;
                const result = isBeforeAd || hasTransition ? candidateResult : undefined;

                if (DEBUG) {
                    this.console.pauseTrace('AdPoliciesManager: getPrerollOnSeek: returning', {
                        result,
                        Mhd: candidateResult,
                        pfd: isBeforeAd
                    });
                }
                return result;
            }

            if (segment.type === SegmentType.thirdPartyVerificationToken && lastType !== SegmentType.thirdPartyVerificationToken) {
                if (DEBUG) {
                    this.console.pauseTrace(`AdPoliciesManager: getPrerollOnSeek: found start of ad break: ${currentId}`);
                }

                const adSegmentInfo = getAdInfo(currentId);
                strictAssert(adSegmentInfo, 'AdPoliciesManager: getPrerollOnSeek: Unable to find ad from ad segmentId');

                const foundBreak = adSegmentInfo.timedTextDownloadRetryCountBeforeCdnSwitch !== undefined
                    ? adBreaks[adSegmentInfo.timedTextDownloadRetryCountBeforeCdnSwitch]
                    : findLast(adBreaks, (ab) => ab.hb === adSegmentInfo.hb);

                if (foundBreak) {
                    candidateResult = { M: currentId, adBreak: foundBreak };
                }
            }

            lastType = segment.type;
            currentId = segment.defaultNext;
        }

        if (DEBUG) this.console.pauseTrace('AdPoliciesManager: getPrerollOnSeek: returning undefined');
    }

    /**
     * Gets the pre-roll ad break for the initial segment of a playgraph.
     * Handles padding segments by following the defaultNext chain.
     *
     * @param {Object} segmentMap - Playgraph segment map
     * @param {Array<Object>} adBreaks - Available ad breaks for the viewable
     * @param {Object} seekPosition - Current seek position
     * @returns {Object|undefined} Ad break result
     */
    getPrerollAdBreakForPlaygraph(segmentMap, adBreaks, seekPosition) {
        const segments = segmentMap.segments;
        const segmentId = seekPosition.M;
        const segment = segments[segmentId];

        if (!segment) {
            if (DEBUG) {
                this.console.RETRY(`AdPoliciesManager: getPrerollAdBreakForPlaygraph: segment ${segmentId} not found`);
            }
            return undefined;
        }

        const segType = segment.type;

        if (segType === SegmentType.padding) {
            return this.getPrerollAdBreakForPlaygraph(segmentMap, adBreaks, {
                M: segments[segmentId].defaultNext,
                offset: TimeUtil.seekToSample
            });
        }

        if (DEBUG) {
            this.console.pauseTrace('AdPoliciesManager: getPrerollAdBreakForPlaygraph', segmentId);
        }

        if (segType === SegmentType.thirdPartyVerificationToken) {
            const adSegmentInfo = getAdInfo(segmentId);
            strictAssert(adSegmentInfo, 'getPrerollAdBreakForPlaygraph: getPrerollSegmentId: Unable to find ad from ad segmentId');

            const adBreak = adSegmentInfo.timedTextDownloadRetryCountBeforeCdnSwitch !== undefined
                ? adBreaks[adSegmentInfo.timedTextDownloadRetryCountBeforeCdnSwitch]
                : findLast(adBreaks, (ab) => ab.hb === adSegmentInfo.hb);

            strictAssert(adBreak, 'getPrerollAdBreakForPlaygraph: Unable to find ad break');
            return { M: segmentId, adBreak };
        }

        if (segType === SegmentType.content) {
            const emptyAd = this.getEmptyAdForSegment(segmentId, adBreaks);
            if (emptyAd) return { Sa: emptyAd };

            const dynamicAd = this.getDynamicAdForSegment(segmentId, adBreaks);
            if (dynamicAd?.type === 'dynamic') {
                return { M: segmentId, adBreak: dynamicAd };
            }
        } else if (DEBUG) {
            strictAssert(true, "Can't get preroll; initial segment was padding and it had no default next segment");
        }
    }

    /**
     * Gets an empty (unfilled) ad break preceding a content segment.
     *
     * @param {string} segmentId - Content segment ID
     * @param {Array<Object>} adBreaks - Available ad breaks
     * @returns {Object|undefined} The empty, non-skippable, incomplete ad break if found
     */
    getEmptyAdForSegment(segmentId, adBreaks) {
        const contentInfo = getContentSegmentInfo(segmentId);
        strictAssert(contentInfo, 'Should have contentInfo from segment name');

        if (contentInfo.PZ > 0) {
            const adBreak = adBreaks[contentInfo.PZ - 1];

            if (DEBUG) {
                this.console.pauseTrace('getEmptyAdForSegment', {
                    ogd: !!adBreak,
                    adBreak: adBreak && {
                        index: adBreak.timedTextDownloadRetryCountBeforeCdnSwitch,
                        empty: adBreak.empty,
                        isSkippableAd: adBreak.isSkippableAd,
                        isAdBreakCompleted: adBreak.isAdBreakCompleted,
                        source: adBreak.source
                    }
                });
            }

            if (!adBreak) {
                if (DEBUG) this.console.RETRY('AdPoliciesManager: getNonEmptyAdForSegment: adBreak not found');
            } else if (adBreak.empty && !adBreak.isSkippableAd && !adBreak.isAdBreakCompleted) {
                return adBreak;
            }
        }
    }

    /**
     * Gets a dynamic (not yet filled) non-empty ad break for a content segment.
     *
     * @param {string} segmentId - Content segment ID
     * @param {Array<Object>} adBreaks - Available ad breaks
     * @returns {Object|undefined} The dynamic, non-skippable, incomplete ad break if found
     */
    getDynamicAdForSegment(segmentId, adBreaks) {
        const contentInfo = getContentSegmentInfo(segmentId);
        strictAssert(contentInfo, 'Should have contentInfo from segment name');

        if (contentInfo.PZ > 0) {
            const adBreak = adBreaks[contentInfo.PZ - 1];
            if (!adBreak) {
                if (DEBUG) this.console.RETRY('AdPoliciesManager: getNonEmptyAdForSegment: adBreak not found');
            } else if (!adBreak.empty && !adBreak.isSkippableAd && !adBreak.isAdBreakCompleted) {
                return adBreak;
            }
        }
    }
}

export default AdPoliciesManager;
