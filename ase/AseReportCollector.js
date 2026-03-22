/**
 * Netflix Cadmium Player - ASE Report Collector
 * Deobfuscated from Module_75402
 *
 * Collects Adaptive Streaming Engine (ASE) reports for telemetry.
 * Tracks stream selection decisions across audio, video, and text media types.
 * Uses sampling (denominator-based) to control reporting volume and
 * emits collected reports at configurable intervals or on playback end.
 */

import { __importDefault } from '../core/tslib';
import { EventEmitter } from '../events/EventEmitter';
import { TimeUtil, flatten } from '../core/TimeUtil';
import MediaType from '../media/MediaType';
import AseReportEntry from './AseReportEntry';
import { PlaybackLifecycle } from '../streaming/EngineState';
import { ReportState } from './AseReportState';

/**
 * Manages collection and reporting of ASE stream selection data.
 */
class AseReportCollector {

    /**
     * @param {Object} session - The streaming session context
     * @param {Object} session.config - Configuration with ASE report settings
     * @param {boolean} session.aseReportEnabled - Whether ASE reporting is active
     * @param {Object} session.events - Event emitter for session events
     */
    constructor(session) {
        this.session = session;
        this.eventType = "aseReport";
        this.eventName = "asereport";
        this.reportInterval = TimeUtil.INFINITE;
        this.events = new EventEmitter();
        this.state = ReportState.Creation;
        this.isListening = false;
        this.selectionCount = 0;
        this.onRequestIssued = this.onRequestIssued.bind(this);

        this.applyConfigOverrides({
            type: "asereportconfigoverrides",
            aseReportDenominator: this.session.config.aseReportDenominator,
            aseReportIntervalMs: this.session.config.aseReportIntervalMs,
            aseReportMaxStreamSelections: this.session.config.aseReportMaxStreamSelections
        });
    }

    /**
     * Applies configuration overrides and determines if this session
     * should collect ASE reports (based on random sampling).
     *
     * @param {Object} config - Override configuration
     */
    applyConfigOverrides(config) {
        const forceEnabled = this.session.config.forceAseReport;
        const denominator = config.aseReportDenominator !== null && config.aseReportDenominator !== undefined
            ? config.aseReportDenominator
            : this.session.config.aseReportDenominator;

        // Sample at 1-in-denominator rate, or force enable
        if (Math.floor(1E6 * Math.random()) % denominator === 0 || forceEnabled) {
            const intervalMs = config.aseReportIntervalMs !== null && config.aseReportIntervalMs !== undefined
                ? config.aseReportIntervalMs
                : this.session.config.aseReportIntervalMs;
            this.reportInterval = TimeUtil.fromMilliseconds(intervalMs);

            this.maxStreamSelections = config.aseReportMaxStreamSelections !== null && config.aseReportMaxStreamSelections !== undefined
                ? config.aseReportMaxStreamSelections
                : this.session.config.aseReportMaxStreamSelections;

            this.session.aseReportEnabled = true;
            this.startListening();
        } else {
            this.reportInterval = TimeUtil.INFINITE;
            this.isListening = this.session.aseReportEnabled = false;
            this.session.events.removeListener("requestIssued", this.onRequestIssued);
        }
    }

    /**
     * Starts listening for stream selection events if ASE reporting is enabled.
     */
    startListening() {
        const self = this;

        if (this.session.aseReportEnabled && !this.isListening) {
            const entries = [];
            entries[MediaType.AUDIO] = new AseReportEntry(this.session.config, MediaType.AUDIO);
            entries[MediaType.VIDEO] = new AseReportEntry(this.session.config, MediaType.VIDEO);
            entries[MediaType.TEXT] = new AseReportEntry(this.session.config, MediaType.TEXT);
            this.reportEntries = entries;
            this.isListening = true;

            this.session.events.on("openComplete", function () {
                return self.emitReportEnabled();
            });

            this.emitReportEnabled();
            this.session.events.on("requestIssued", this.onRequestIssued);
        }
    }

    /**
     * Emits an event indicating ASE reporting is enabled for this session.
     */
    emitReportEnabled() {
        this.session.events.emit("aseReportEnabled", {
            type: "asereportenabled"
        });
    }

    /**
     * Handles request issued events, recording stream selection data.
     *
     * @param {Object} event - The request issued event
     * @param {Object} event.result - Selection result
     * @param {Array} event.streamList - Available streams
     * @param {number} event.mediaType - Media type (audio/video/text)
     */
    onRequestIssued(event) {
        if (event.result && event.streamList) {
            this.reportEntries[event.mediaType].addSelection(event.result, event.streamList);
            if (++this.selectionCount >= this.maxStreamSelections) {
                this.events.emit("collectionRequested");
            }
        }
    }

    /**
     * Collects all recorded stream selection data and resets the entries.
     *
     * @returns {Array} Flattened array of stream selection report entries
     */
    collectReportData() {
        const data = flatten(
            this.reportEntries.map(function (entry) {
                return entry.serialize();
            }).filter(function (entry) {
                return entry !== undefined;
            })
        );

        this.reportEntries.forEach(function (entry) {
            return entry.reset(true);
        });

        this.selectionCount = 0;
        return data;
    }

    /**
     * Executes the report collection, returning report data if conditions are met.
     *
     * @param {Object} params
     * @param {string} params.lifecycleState - Current playback lifecycle state
     * @param {boolean} params.forceCollect - Whether to force collection
     * @param {boolean} params.isEndPlayback - Whether playback is ending
     * @returns {Object} Report result with shouldSend flag and optional event data
     */
    execute(params) {
        const lifecycleState = params.lifecycleState;
        const forceCollect = params.forceCollect;
        const shouldCollect = params.isEndPlayback || forceCollect || lifecycleState === PlaybackLifecycle.endPlayback;

        if (this.session.aseReportEnabled && this.isListening && shouldCollect) {
            const reportData = this.collectReportData();
            if (reportData && reportData.length) {
                return {
                    shouldSend: true,
                    event: {
                        type: "asereport",
                        streamSelections: reportData
                    }
                };
            }
        }

        return { shouldSend: false };
    }
}

export { AseReportCollector };
