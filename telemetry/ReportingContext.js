/**
 * Netflix Cadmium Player - Reporting Context
 *
 * Manages a collection of diagnostic reporters that generate telemetry data.
 * Each reporter contributes fields to logblob reports (startplay, midplay, endplay, etc.).
 * Handles reporter registration, serialization, and cycle detection.
 *
 * @module ReportingContext
 * @original Module_91967
 */

// import { __read, __values, __assign } from 'tslib'; // webpack 22970
// import * as configExports from '../types/ConfigExports.js'; // webpack 91176
// import { SerializationError } from '../utils/SerializationError.js'; // webpack 67164
// import { BaseReporter } from '../telemetry/BaseReporter.js'; // webpack 29739

/**
 * Debug flag for reporting diagnostics
 * @type {boolean}
 */
export let DEBUG_REPORTING = false;

/**
 * Enum for playback timing phases used in reports
 * @enum {string}
 */
export const PlaybackTimingPhase = {
    startPlayback: "startPlayback",
    endPlayback: "endPlayback",
    underflow: "underflow"
};

/**
 * Map of report event types to their string identifiers
 * @type {Object<string, string>}
 */
export const ReportEventTypes = {
    startPlay: "startplay",
    midPlay: "midplay",
    endPlay: "endplay",
    interruptionPlay: "intrplay",
    changeStream: "chgstrm",
    playbackAborted: "playbackaborted",
    renderStreamSwitch: "renderstrmswitch",
    liveReport: "livereport",
    reposition: "repos",
    resumePlay: "resumeplay",
    stateChanged: "statechanged",
    aseReport: "aseReport",
    liveErrorRestart: "liveerrorrestart",
    transition: "transition"
};

/**
 * Map of report source categories
 * @type {Object<string, string>}
 */
export const ReportSources = {
    network: "network",
    client: "client",
    manifest: "manifest",
    ocSideChannel: "oc_sc"
};

/**
 * Collects and manages diagnostic reporters for telemetry generation.
 * Reporters are registered and then queried during report serialization.
 */
export class ReportingContext {
    /**
     * @param {Object} config - Reporting configuration (aseDiagnostics, enableAseReporting)
     * @param {Object} logger - Logger/console instance
     */
    constructor(config, logger) {
        /** @type {Object} */
        this.config = config;

        /** @type {Object} */
        this.logger = logger;

        /** @type {Array<Object>} Registered reporters */
        this._reporters = [new BaseReporter("child")];
    }

    /**
     * Registers a diagnostic reporter if enabled by configuration
     * @param {Object} reporter - Reporter with reporterName, qcEnabled, deserialize, etc.
     */
    registerReporter(reporter) {
        const diagnosticConfig = (this.config.aseDiagnostics || [])
            .filter(d => d.reporterName === reporter.reporterName)[0];

        const isEnabled = (this.config.enableAseReporting ?? 1) &&
                          (diagnosticConfig?.qcEnabled ?? reporter.qcEnabled);

        if (isEnabled) {
            this._reporters.push(reporter);
        } else if (reporter.destroy) {
            reporter.destroy();
        }
    }

    /**
     * Finds the last registered reporter matching the given name
     * @param {Object} reporter - Reporter to search for by name
     * @returns {Object|undefined} The matching reporter
     */
    findReporter(reporter) {
        return configExports.findLast(this._reporters, (r) => r.reporterName === reporter.reporterName);
    }

    /**
     * Serializes all reporters into a single report object
     * @param {Object} utilityInstance - Utility context for report generation
     * @param {Object} seekHandler - Seek state handler
     * @returns {Object} Combined report data from all reporters
     */
    serialize(utilityInstance, seekHandler) {
        let report = {};
        const errors = [];

        for (const reporter of this._reporters) {
            try {
                const data = reporter.deserialize({
                    utilityInstance,
                    seekHandler
                });
                if (data) {
                    if (reporter.auditName) {
                        report[reporter.auditName] = data;
                    } else {
                        report = { ...report, ...data };
                    }
                }
            } catch (error) {
                errors.push(Error(`${reporter.reporterName}::${error}`));
            }
        }

        if (errors.length) {
            report["rpt-error"] = SerializationError.stringify(
                new SerializationError("Reporting error", errors)
            );
        }

        if (DEBUG_REPORTING) {
            const [payload, metadata] = configExports.safeStringify(report);
            if (metadata.hasCycles) {
                this.logger.error("Cycles found in report generation", {
                    payload,
                    utilityInstance,
                    seekHandler
                });
            }
        }

        return report;
    }

    /**
     * Serializes PDS (playdata service) specific report data
     * @returns {Object} Combined PDS report data
     */
    serializePds() {
        let report = {};
        const errors = [];

        for (const reporter of this._reporters) {
            try {
                const data = reporter.serializePds?.();
                if (data) {
                    if (reporter.auditName) {
                        report[reporter.auditName] = data;
                    } else {
                        report = { ...report, ...data };
                    }
                }
            } catch (error) {
                errors.push(Error(`${reporter.reporterName}::${error}`));
            }
        }

        if (errors.length) {
            report["rpt-error"] = SerializationError.stringify(
                new SerializationError("Reporting error", errors)
            );
        }

        if (DEBUG_REPORTING) {
            const [payload, metadata] = configExports.safeStringify(report);
            if (metadata.hasCycles) {
                this.logger.error("Cycles found in PDS report generation", { payload });
            }
        }

        return report;
    }
}
