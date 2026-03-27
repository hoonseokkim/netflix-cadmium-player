/**
 * Netflix Cadmium Player - Play Prediction Model
 *
 * Manages predictive prefetching of content based on user navigation behavior.
 * Tracks UI events (browse, focus, play) across the Netflix browse UI and predicts
 * which titles the user is likely to play next, then schedules prefetch of those
 * titles' manifests and initial segments.
 *
 * Uses a configurable ML model (default: "modelone") and translates raw UI
 * navigation events into prediction model inputs. The predicted titles are
 * prioritized by rank and dispatched to video and UI preparers.
 *
 * @module PlayPredictionModel
 * @see Module_99886
 */

import getNow from '../utils/GetNow.js';
import { q7 as ContextTypes, hX as PropertyTypes, XC as DirectionTypes, SF as ActionTypes } from '../player/PredictionConstants.js';
import { assert, iAb as findPlayEvent } from '../assert/Assert.js';
import ModelOne from '../player/ModelOne.js';
import { config as appConfig } from '../core/AppConfig.js';
import { ClockWatcher } from '../events/ClockWatcher.js';

/**
 * Represents a predicted title to prefetch.
 */
class PredictedTitle {
    /**
     * @param {number} viewableId - The Netflix title ID
     * @param {number} priority - Prefetch priority rank
     * @param {boolean} hasContent - Whether the title has playable content
     * @param {*} [seasonInfo] - Optional season/episode info
     * @param {*} [rowContext] - Row context from browse UI
     * @param {Object} [manifestSessionData] - Session data for manifest request
     */
    constructor(viewableId, priority, hasContent, seasonInfo, rowContext, manifestSessionData) {
        /** @type {number} Title ID (also stored as movieId) */
        this.R = this.J = viewableId;

        /** @type {number} Prefetch priority rank */
        this.priority = priority;

        /** @type {boolean} Whether title has content */
        this.hasContent = hasContent;

        if (manifestSessionData?.manifestFormat) {
            this.manifestFormat = manifestSessionData.manifestFormat;
        }

        if (seasonInfo !== undefined) {
            /** @type {*} Season/episode context */
            this.c3 = seasonInfo;
        }

        /** @type {*} Row context from browse UI */
        this.zp = rowContext;

        /** @type {Object|undefined} Manifest session data */
        this.manifestSessionData = manifestSessionData;
    }
}

/**
 * Core play prediction model that processes UI navigation events and
 * produces ranked lists of titles to prefetch.
 */
export class PlayPredictionModel {
    /**
     * @param {*} _unused - Unused parameter
     * @param {Object} logger - Console/logger instance
     * @param {Object} telemetry - Telemetry reporter
     * @param {Object} videoPreparer - Video content preparer
     * @param {Object} uiPreparer - UI content preparer
     */
    constructor(_unused, logger, telemetry, videoPreparer, uiPreparer) {
        assert(videoPreparer !== undefined, "video preparer is null");
        assert(uiPreparer !== undefined, "ui preparer is null");

        /** @type {Object} Logger instance */
        this.console = logger;

        /** @type {Object} Telemetry reporter for play focus events */
        this.telemetry = telemetry;

        /** @type {Object} Video content preparer */
        this.videoPreparer = videoPreparer;

        /** @type {Object} UI content preparer */
        this.uiPreparer = uiPreparer;

        /** @type {Object} Current PPM configuration */
        this.ppmConfig = appConfig.ppmConfig;

        /** @type {Array} Buffer for replaying events on model change */
        this.eventBuffer = [];

        /** @type {boolean} Whether replay is in progress */
        this.isReplaying = false;

        /** @type {number} Timestamp of first prediction */
        this.firstPredictionTimestamp = 0;

        // Watch for config changes
        new ClockWatcher().on(appConfig, "changed", this._onConfigChanged, this);

        this._createModel();
    }

    /**
     * Updates the prediction model with a new UI navigation event.
     * @param {Object} event - Navigation event with context, direction, and item lists
     */
    update(event) {
        this.console.log("PlayPredictionModel update: ", JSON.stringify(event));

        if (!event?.xc?.[0]) return;

        // Buffer events for replay if model hasn't been initialized
        if (!this.isReplaying && this.eventBuffer.length < appConfig.maxNumberPayloadsStored) {
            this.eventBuffer.push(event);
        }

        const normalizedEvent = this._normalizeEvent(event);
        const actionType = this._classifyAction(normalizedEvent);

        this.console.log("actionType", actionType);

        // Run prediction
        let predictions = appConfig.modelSelector === "mlmodel"
            ? this.model.update(event, actionType)
            : this.model.update(normalizedEvent, actionType);

        predictions = this._expandPredictions(predictions, appConfig.itemsPerRank || 1);

        this.console.log("PlayPredictionModel.prototype.update() - returnedList: ", JSON.stringify(predictions));

        // Record first prediction timestamp
        if (this.firstPredictionTimestamp === 0) {
            this.firstPredictionTimestamp = getNow();
            if (this.telemetry?.kga) {
                this.telemetry.kga({ ooc: this.firstPredictionTimestamp });
            }
        }

        // Report to telemetry
        if (this.telemetry?.dUc) {
            this._recordTimestamp();
            const titleList = predictions.map(p => ({ vmd: p.J }));
            // Telemetry data prepared but not sent in this path
        }

        // Dispatch predictions to preparers
        this.videoPreparer.CU(predictions);
        this.uiPreparer.CU(predictions);
        this.isModelInitialized = false;
    }

    /**
     * Returns PPM configuration, optionally for a specific key.
     * @param {string} [key] - Optional config key
     * @returns {Object} PPM config or specific value
     */
    getConfig(key) {
        return key ? this.ppmConfig[key] : this.ppmConfig;
    }

    /**
     * Records a timestamp for telemetry.
     */
    recordTimestamp() {
        this.firstPredictionTimestamp = getNow();
        if (this.telemetry?.kga) {
            this.telemetry.kga({ ooc: this.firstPredictionTimestamp });
        }
    }

    /**
     * Reports a play focus event for telemetry.
     * @param {Array} contexts - Navigation contexts
     * @param {number} direction - Navigation direction
     * @param {Object} rowInfo - Row information
     * @private
     */
    _reportPlayFocusEvent(contexts, direction, rowInfo) {
        this.console.log("reportPlayFocusEvent: ", direction, rowInfo);

        const eventData = {};
        const playEventInfo = findPlayEvent(contexts);

        if (this.telemetry?.reportPlayFocusEvent) {
            eventData.timestamp = getNow();
            eventData.direction = DirectionTypes.name[direction];

            if (rowInfo) {
                eventData.rowIndex = rowInfo.rowIndex;
                eventData.colIndex = rowInfo.lic;
            }

            if (playEventInfo.timeNode !== undefined) {
                eventData.requestId = contexts[playEventInfo.timeNode].requestId;
            }

            this.telemetry.reportPlayFocusEvent(eventData);
        }
    }

    // --- Private Methods ---

    /**
     * Handles config change events.
     * @private
     */
    _onConfigChanged() {
        this.console.log("config changed");
        if (appConfig.ppmConfig) {
            this.ppmConfig = appConfig.ppmConfig;
        }
        if (appConfig.modelSelector !== this.currentModelName) {
            this._createModel();
            this._replayEvents();
        }
    }

    /**
     * Creates the prediction model based on config.
     * @private
     */
    _createModel() {
        this.isModelInitialized = true;
        this.currentModelName = appConfig.modelSelector;
        this.console.log("create model: " + appConfig.modelSelector, appConfig.rowFirst, appConfig.colFirst);

        switch (appConfig.modelSelector) {
            case "modelone":
            default:
                this.model = new ModelOne(this.console);
                break;
        }
    }

    /**
     * Replays buffered events through the new model.
     * @private
     */
    _replayEvents() {
        if (this.isReplaying) return;

        this.isReplaying = true;
        for (let i = 0; i < this.eventBuffer.length; i++) {
            this.console.log("PlayPredictionModel replay: ", JSON.stringify(this.eventBuffer[i]));
            const normalized = this._normalizeEvent(this.eventBuffer[i]);
            const action = this._classifyAction(normalized);
            this.model.update(normalized, action);
            this.isModelInitialized = false;
        }
        this.eventBuffer = [];
    }

    /**
     * Normalizes a raw UI event into the model's input format.
     * @param {Object} event - Raw navigation event
     * @returns {Object} Normalized event
     * @private
     */
    _normalizeEvent(event) {
        const result = {};
        const contexts = event.xc || [];

        const processContext = (ctx) => {
            const normalized = {};
            const contextIdx = ContextTypes.name.indexOf(ctx.context);
            normalized.context = contextIdx >= 0 ? contextIdx : ContextTypes.pG;
            normalized.rowIndex = ctx.rowIndex;
            normalized.requestId = ctx.requestId;
            normalized.list = [];

            const items = ctx.list || [];
            items.forEach((item) => {
                const normalizedItem = {
                    J: item.J,
                    hasContent: item.hasContent,
                    index: item.index,
                    c3: item.c3,
                    lya: item.lya,
                    list: item.list,
                    manifestSessionData: item.manifestSessionData,
                };

                if (item.property !== undefined) {
                    const propIdx = PropertyTypes.name.indexOf(item.property);
                    normalizedItem.property = propIdx >= 0 ? propIdx : PropertyTypes.pG;
                }

                normalized.list.push(normalizedItem);
            });

            result.xc.push(normalized);
        };

        if (event.direction !== undefined) {
            const dirIdx = DirectionTypes.name.indexOf(event.direction);
            result.direction = dirIdx >= 0 ? dirIdx : DirectionTypes.pG;
        }

        if (event.rba !== undefined) {
            result.mfd = event.rba.rowIndex;
            result.lfd = event.rba.lic;
        }

        result.rba = event.rba;
        result.xc = [];
        contexts.forEach(processContext);

        return result;
    }

    /**
     * Classifies the action type based on the normalized event.
     * @param {Object} event - Normalized event
     * @returns {number} Action type constant
     * @private
     */
    _classifyAction(event) {
        const direction = event.direction || DirectionTypes.pG;
        const rowInfo = event.rba;
        const contexts = event.xc || [];

        if (this.isModelInitialized) {
            return ActionTypes.internal_Rcb;
        }

        if (contexts.some(this._hasPlayEvent)) {
            this._reportPlayFocusEvent(contexts, direction, rowInfo);
            return ActionTypes.P7;
        }

        if (contexts[0].context === ContextTypes.internal_Ula) {
            return ActionTypes.internal_Ula;
        }

        if (direction === DirectionTypes.xkb || direction === DirectionTypes.ifb) {
            return ActionTypes.internal_Wkb;
        }

        return ActionTypes.pG;
    }

    /**
     * Checks if a context contains a play-related event.
     * @param {Object} context
     * @returns {boolean}
     * @private
     */
    _hasPlayEvent(context) {
        return (context.list || []).some(
            item => item.property === PropertyTypes.P7 || item.property === PropertyTypes.nbb
        );
    }

    /**
     * Expands predictions into a flat list with priority ranks and episode lists.
     * @param {Array} predictions - Raw model predictions
     * @param {number} itemsPerRank - Items per priority rank
     * @returns {Array<PredictedTitle>} Expanded prediction list
     * @private
     */
    _expandPredictions(predictions, itemsPerRank) {
        const result = [];

        for (let i = 0; i < predictions.length; i++) {
            const prediction = predictions[i];
            const rank = Math.floor(i / itemsPerRank) + 1;

            if (prediction.list !== undefined) {
                const episodes = prediction.list;
                for (let j = 0; j < Math.min(appConfig.colEpisodeList, episodes.length); j++) {
                    episodes[j].zp = prediction.zp;
                    this._addPrediction(episodes[j], rank, result);
                    if (result.length >= appConfig.maxNumberTitlesScheduled) break;
                }
            } else {
                this._addPrediction(prediction, rank, result);
            }

            if (result.length >= appConfig.maxNumberTitlesScheduled) break;
        }

        return result;
    }

    /**
     * Adds a single prediction to the result list.
     * @param {Object} item - Predicted item
     * @param {number} rank - Priority rank
     * @param {Array} result - Result array to append to
     * @private
     */
    _addPrediction(item, rank, result) {
        const getSessionData = (entry) => {
            if (entry.manifestFormat) {
                if (!entry.manifestSessionData) entry.manifestSessionData = {};
                entry.manifestSessionData.manifestFormat = entry.manifestFormat;
            }
            return entry.manifestSessionData;
        };

        const linkedItems = item.lya;

        if (linkedItems !== undefined && Array.isArray(linkedItems)) {
            linkedItems.forEach((linked) => {
                if (linked.J !== undefined) {
                    const sessionData = getSessionData(linked);
                    result.push(new PredictedTitle(linked.J, rank, linked.hasContent, linked.c3, item.zp, sessionData));
                }
            });
        } else if (linkedItems !== undefined && linkedItems.J !== undefined) {
            const sessionData = getSessionData(linkedItems);
            result.push(new PredictedTitle(linkedItems.J, rank, linkedItems.hasContent, linkedItems.c3, item.zp, sessionData));
        }

        if (item.J !== undefined) {
            const sessionData = getSessionData(item);
            result.push(new PredictedTitle(item.J, rank, item.hasContent, item.c3, item.zp, sessionData));
        }
    }

    /** @private */
    _recordTimestamp() {
        getNow();
    }
}
