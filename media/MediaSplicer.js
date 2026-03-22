/**
 * Media Splicer
 *
 * Manages media fragment editing and splicing for the streaming pipeline.
 * Builds a chain of "event handler" transforms (splice operations) that
 * are applied to each media fragment before it is appended to the
 * SourceBuffer. The exact set of transforms depends on:
 *
 * - Media type (audio vs video)
 * - Codec profile and track properties
 * - Configuration flags (seamless audio, negative PTS guard,
 *   silent frame insertion, truncation, ad playgraph support)
 *
 * Audio-specific transforms:
 *   - NegativePtsGuard: prevents negative presentation timestamps
 *   - SeamlessAudioSplicer: handles gapless audio transitions
 *   - SilentFrameInserter: inserts silence on seek for certain titles
 *   - EndOfStreamAudioTruncator: trims trailing audio at EOS
 *   - OverlapGuard: prevents overlapping audio segments
 *
 * Video-specific transforms:
 *   - CodecProfileSplicer: manages codec profile transitions
 *   - StallGuard / FrameCountStallGuard: prevents playback stalls
 *   - SeamlessVideoSplicer: handles seamless video transitions
 *   - AdBreakSplicer / AdBreakGapSplicer: ad insertion splicing
 *
 * @module MediaSplicer
 * @source Module_98321
 */

import { TimeUtil, findLast } from '../core/Asejs';
import { platform } from '../core/CadmiumPlatformFactory';
import { MediaType } from '../media/MediaType';
import { assert } from '../assert/Assert';
import { nkb as CodecProfileSplicer } from '../streaming/StreamFilterChain';
import { internal_Nhb as OverlapGuard } from '../streaming/StreamingErrorNotifier';
import { mlb as SeamlessAudioSplicer } from '../streaming/StreamingBarrelExports';
import { yhb as NegativePtsGuard } from '../streaming/StreamingProfileTimestampOffset';
import { internal_Umb as EndOfStreamAudioTruncator } from '../streaming/AseStreamingConfigDefaults';
import { internal_Heb as SilentFrameInserter } from '../streaming/StreamSegmentInfo';
import { G$a as FrameCountStallGuard } from '../streaming/BranchCollectionManager';
import { I$a as StallGuard } from '../streaming/BranchBase';
import { H$a as VideoLocationHistoryHandler } from '../streaming/LocationHistory';
import { snb as AudioLocationHistoryHandler } from '../streaming/LocationHistory_1';
import { TCa as SeamlessVideoSplicer } from '../streaming/ViewableEntry';
import { bmb as TimestampNormalizer } from '../streaming/WorkingSegment';
import { internal_Ieb as AdBreakGapSplicer } from '../streaming/PlaygraphMetricsReporter';
import { internal_Ifb as AdBreakSplicer } from '../streaming/PlaygraphSeekEventReplay';

class MediaSplicer {
    /**
     * @param {Object} config          - Streaming configuration.
     * @param {string} mediaType       - MediaType.V (audio) or MediaType.U (video).
     * @param {Object} codecProfilesMap - Map of supported codec profiles.
     * @param {Object} console         - Logger instance.
     */
    constructor(config, mediaType, codecProfilesMap, console) {
        this.config = config;
        this.mediaType = mediaType;
        this.codecProfilesMap = codecProfilesMap;
        this.console = console;
    }

    /**
     * Apply the splice transform chain to a media fragment.
     *
     * @param {Object} fragment - The media fragment to process.
     * @param {Object} context  - Additional splice context (e.g. seek info).
     * @returns {{ offset: number, getBoxData: boolean, logDataArray?: Array, kv?: * }}
     */
    applying(fragment, context) {
        // Initialize track on first call; reinitialize on track change
        if (this.track === undefined) {
            this._initializeHandlers(fragment.stream);
        } else if (this.track !== fragment.stream.track) {
            assert(this.eventHandlersMap !== undefined);
            assert(this.mediaType !== MediaType.V || this.track.frameDuration);
            assert(this.mediaType !== MediaType.V || fragment.stream.track.frameDuration);
            this.track = fragment.stream.track;
            this.eventHandlersMap.forEach(function (handler) {
                return handler.getIdentifier(fragment.stream);
            });
        }

        assert(this.eventHandlersMap !== undefined);

        // Run the fragment through every handler in the chain
        const result = this.eventHandlersMap.reduce(function (state, handler) {
            return handler.applying(state, context);
        }, {
            Na: fragment,
            offset: fragment.internal_Eya || TimeUtil.seekToSample,
            qf: this.config.seamlessAudio,
            getBoxData: false
        });

        const logData = result.data;
        const offset = result.offset;
        let shouldReparse = result.getBoxData;
        let logDataArray = result.logDataArray;
        logDataArray = logDataArray === undefined ? [] : logDataArray;

        // Apply location history edits if present
        if (logData.ase_location_history) {
            assert(fragment.ase_location_history, "Fragments must be marked for edit at request time");
            fragment.setEditWindow(logData.ase_location_history);
        }

        // If no reparse needed and location history handler can process it
        if (!shouldReparse && this._locationHistoryHandler && this._locationHistoryHandler.dgc(fragment)) {
            const historyResult = this._locationHistoryHandler.ase_location_history(
                fragment,
                !!(fragment.currentSegment && fragment.currentSegment.fadeOut)
            );
            const success = historyResult.success;
            const historyLogData = historyResult.logDataArray;
            const kv = historyResult.kv;

            Array.prototype.push.apply(logDataArray, historyLogData === undefined ? [] : historyLogData);

            return {
                offset: offset,
                getBoxData: !success,
                logDataArray: logDataArray,
                kv: kv
            };
        }

        return {
            offset: offset,
            getBoxData: shouldReparse
        };
    }

    /**
     * Reset / destroy the splicer state.
     */
    create() {
        this.eventHandlersMap = undefined;
        this.track = undefined;
    }

    /**
     * Initialize the handler chain based on the stream's media type and config.
     * @private
     */
    _initializeHandlers(stream) {
        this.track = stream.track;

        // Create the location-history handler (audio vs video)
        if (this.mediaType === MediaType.V) {
            this._locationHistoryHandler = new VideoLocationHistoryHandler(
                this.console, this.config, stream.profile
            );
        } else if (this.mediaType === MediaType.U) {
            this._locationHistoryHandler = new AudioLocationHistoryHandler(
                this.console, this.config
            );
        }

        this.eventHandlersMap = [];

        if (this.mediaType === MediaType.V) {
            // Audio pipeline handlers
            this.eventHandlersMap.push(new CodecProfileSplicer(this.config, this.codecProfilesMap, this.console));

            if (this.config.seamlessAudio) {
                this.eventHandlersMap.push(new SeamlessAudioSplicer(this.config, this.console));
            }

            this.eventHandlersMap.push(new TimestampNormalizer(this.console));

            // Silent frame insertion for specific titles on seek
            if (stream.applyProfileStreamingOffset && stream.durationValue &&
                this._shouldInsertSilentFrames(stream.viewableSession.J)) {
                this.eventHandlersMap.push(new SilentFrameInserter(this.config));
            }

            // Negative PTS guard
            if (!this.config.mediaSourceSupportsNegativePts) {
                this.console.log(
                    `MediaSplicer: NegativePtsGuard:  ${stream.durationValue ? stream.durationValue.ca() : undefined}`
                );
                this.eventHandlersMap.push(new NegativePtsGuard(this.config, this.console));
            }

            if (this._isIndependentAudioMode()) {
                // Independent audio mode: stall guard, seamless video, overlap guard, truncator
                if (!this.config.stallAtFrameCount) {
                    this.eventHandlersMap.push(
                        new FrameCountStallGuard(this.config, this.codecProfilesMap, this.console)
                    );
                }
                if (this.config.seamlessAudio) {
                    this.eventHandlersMap.push(new SeamlessVideoSplicer(this.console));
                }
                const msCapabilities = platform.MediaSource.codecProfilesMap;
                if (msCapabilities && msCapabilities.internal_Ukd !== false) {
                    this.eventHandlersMap.push(new OverlapGuard(this.console));
                }
                if (this.config.truncateEndOfStreamAudio) {
                    assert(stream.frameDuration);
                    this.eventHandlersMap.push(
                        new EndOfStreamAudioTruncator(stream.frameDuration, this.console)
                    );
                }
            } else {
                // Dependent audio mode
                this.eventHandlersMap.push(new StallGuard(this.console));
                if (this.config.seamlessAudio) {
                    this.eventHandlersMap.push(new SeamlessVideoSplicer(this.console));
                }
            }
        }

        // Ad playgraph handlers
        if (stream.viewableSession.isAdPlaygraph ||
            (stream.viewableSession.jk && stream.viewableSession.jk.isAdPlaygraph)) {
            this.eventHandlersMap.push(new AdBreakSplicer());
            if (this._isIndependentAudioMode()) {
                this.eventHandlersMap.push(new AdBreakGapSplicer(this.console));
            }
        }

        // Notify all handlers of the initial stream
        this.eventHandlersMap.forEach(function (handler) {
            return handler.getIdentifier(stream);
        });
    }

    /**
     * Check if silent frame insertion is enabled for this title.
     * @private
     */
    _shouldInsertSilentFrames(titleId) {
        return this.config.insertSilentFramesOnSeek ||
            (this.config.insertSilentFramesOnSeekForTitles &&
                this.config.insertSilentFramesOnSeekForTitles.indexOf(titleId) !== -1);
    }

    /**
     * Whether the audio stream operates independently of the video stream.
     * @private
     */
    _isIndependentAudioMode() {
        return !this.config.requireAudioStreamToEncompassVideo;
    }
}

export { MediaSplicer as internal_Zgb };
