/**
 * @module OnDemandNormalizedBranch
 * @description Extends NormalizedBranch for on-demand (non-live) streaming scenarios.
 * Creates media pipelines from track lists, manages pipeline creation for
 * on-demand content, handles video padding detection, and coordinates
 * normalization with segment timing.
 * @original Module_20717
 */

import { __extends } from 'tslib'; // Module 22970
import { DEBUG } from '../utils/Debug'; // Module 48170
import { PipelineCollection } from '../streaming/PipelineCollection'; // Module 32412
import { OnDemandPipeline } from '../streaming/OnDemandPipeline'; // Module 95052
import { registerClass } from '../core/Registry'; // Module 85254
import { processingContext } from '../streaming/ProcessingContext'; // Module 71808
import { OnDemandNormalizerConfig } from '../streaming/OnDemandNormalizerConfig'; // Module 72117
import { NormalizedBranch } from '../streaming/NormalizedBranch'; // Module 33928

/**
 * Normalized branch implementation for on-demand (VOD) content.
 * Manages pipeline creation and normalization for non-live streams.
 *
 * @extends NormalizedBranch
 */
export class OnDemandNormalizedBranch extends NormalizedBranch {
    /**
     * Creates media pipelines from a list of tracks for on-demand playback.
     *
     * @param {Array} trackList - List of track descriptors
     * @param {Object} manifest - The current manifest/segment info
     * @param {Object} branchConfig - Branch configuration
     * @param {Array} [excludedMediaTypes=[]] - Media types to exclude from pipeline creation
     * @returns {Object} The created pipeline collection
     */
    createPipelines(trackList, manifest, branchConfig, excludedMediaTypes = []) {
        DEBUG && this.console.pauseTrace('OnDemandNormalizedBranch.createPipelines');

        const pipelineCollection = new PipelineCollection();

        trackList.forEach((trackDescriptor) => {
            let pipeline = this.oe.find((existingPipeline) => {
                return (
                    existingPipeline.track === trackDescriptor.track &&
                    !(
                        excludedMediaTypes.some((type) => type === existingPipeline.mediaType) &&
                        this.isLive.XOa
                    )
                );
            });

            if (pipeline === undefined) {
                pipeline = new OnDemandPipeline(
                    this,
                    this.config,
                    this.console,
                    this.oU,
                    this.isLive,
                    trackDescriptor.track,
                    manifest,
                    this.branchScheduler,
                    trackDescriptor.BVb()
                );
                this.ase_Nta(pipeline);
            } else {
                pipeline.CY();
            }

            pipelineCollection.add(pipeline);
        });

        return this.FFb(pipelineCollection, manifest, branchConfig);
    }

    /**
     * Normalizes playback timing for the branch, creating an on-demand
     * normalizer configuration.
     *
     * @param {number} presentationStartTime - The presentation start timestamp
     * @param {Object} splice - Splice/transition information
     * @returns {*} Result of parent normalize call
     */
    normalize(presentationStartTime, splice) {
        this.UB?.dispose();

        this.UB = new OnDemandNormalizerConfig({
            console: this.console,
            config: this.config,
            L: this.viewableSession,
            K: this.currentSegment,
            oe: this.oe,
            presentationStartTime,
            segmentEndTime: this.currentSegment.endTime,
            splice
        });

        return super.normalize(presentationStartTime, splice);
    }

    /**
     * Determines whether video padding should be applied at the given position.
     * For on-demand content, padding applies only at the start of the current segment.
     *
     * @param {Object} position - The position info with startTimeMs
     * @returns {boolean} True if position matches the current segment start
     */
    handleVideoPadding(position) {
        return position.startTimeMs === this.currentSegment.startTimeMs;
    }
}

registerClass(processingContext, OnDemandNormalizedBranch);

export default OnDemandNormalizedBranch;
