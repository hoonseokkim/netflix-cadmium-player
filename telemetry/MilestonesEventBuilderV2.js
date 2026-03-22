/**
 * @module MilestonesEventBuilder
 * @description Builds play-delay milestone events for telemetry. Tracks the timing
 * of key playback stages (manifest request, license acquisition, buffering, DRM,
 * timed text, first frame render) and constructs structured event objects with
 * component categorization (manifest/license/buffering/playback) and step
 * classification (start/end/discrete).
 * @see Module_51149
 */

import { __decorate, __param } from '../core/tslib.js';
import { injectable, inject as injectDecorator } from '../core/inversify.js';
import { PlayDelayEvent } from '../telemetry/PlayDelayEvent.js';
import { H7 as PlayDelayStoreToken } from '../telemetry/PlayDelayStore.js';
import { timestamp, MILLISECONDS } from '../timing/Timestamp.js';
import { responseType as mediaRequestEvents, sta as MEDIA_REQUEST_EVENT } from '../events/MediaRequestEvents.js';
import { enumConstants as ConfigToken } from '../core/ConfigTokens.js';
import { MH as assertNever } from '../utils/ExhaustiveCheck.js';
import { LoggerToken } from '../core/LoggerToken.js';

/**
 * Maps media types to start/end PlayDelayEvent names for milestone tracking.
 */
const MEDIA_TYPE_MILESTONES = {
    start: {
        video: PlayDelayEvent.HW,
        audioBufferedSegments: PlayDelayEvent.DW
    },
    end: {
        video: PlayDelayEvent.GW,
        audioBufferedSegments: PlayDelayEvent.BW
    }
};

/**
 * Builds structured milestone events that capture the timing of each
 * phase in the play-delay waterfall (manifest, DRM, buffering, etc.).
 * Decorated with @injectable() for IoC container registration.
 *
 * Key responsibilities:
 * - Listens for media request events and records download milestones
 * - Converts raw timestamps into normalized play-delay events
 * - Categorizes events by component (manifest/license/buffering/playback)
 *   and infrastructure (aws/device/cdn/mixed)
 * - Filters incomplete event pairs (start without end)
 * - Computes aggregate buffering start/end timestamps
 */
export class MilestonesEventBuilder {
    /**
     * @param {Object} playDelayStore - Store for play delay timing data.
     * @param {Object} config - Player configuration with milestone settings.
     * @param {Object} logger - Logger instance.
     */
    constructor(playDelayStore, config, logger) {
        this.playDelayStore = playDelayStore;
        this.config = config;
        this.requestCounter = 0;
        this.processedTransactionIds = new Set();
        this.logger = logger.createSubLogger('MilestonesEventBuilder');

        this.onMediaRequest = (event) => {
            const requestIndex = this.requestCounter++;
            const mediaType = event.request.languageSelection || 'dl';
            const milestoneStart = this.getMilestoneEvent(mediaType, 'start');

            if (milestoneStart) {
                const segmentId = event.request.previousRequest.M;
                if (segmentId && !this.processedTransactionIds.has(segmentId)) {
                    this.logger.pauseTrace('trackMediaRequest segmentId', { PQa: segmentId });
                    const range = event.range;
                    const correlationId = range ? `${mediaType}-${range}-${requestIndex}` : mediaType;
                    this.playDelayStore.dJb(milestoneStart, segmentId, correlationId);

                    event.onCompleteCallback(() => {
                        const milestoneEnd = this.getMilestoneEvent(mediaType, 'end');
                        const endCorrelationId = range ? `${mediaType}-${range}-${requestIndex}` : mediaType;
                        if (milestoneEnd) {
                            this.playDelayStore.dJb(milestoneEnd, segmentId, endCorrelationId);
                        }
                    });
                }
            }
        };

        if (config.enableMilestoneEventList) {
            this.startListening();
        }
    }

    /**
     * Builds play-delay events from timestamps for a given playback session.
     * @param {Object} sessionData - Session data with playDelayTimestamps, sourceTransactionId, etc.
     * @returns {Object} Map of event name to structured event data.
     */
    buildPlayDelayEvents(sessionData) {
        const completedEventIds = new Set();
        const timestamps = sessionData.playDelayTimestamps;
        const transactionId = sessionData.sourceTransactionId;
        const maxTimestamp = sessionData.JTb === undefined ? null : sessionData.JTb;
        const storedEvents = this.playDelayStore.internal_Dxc(transactionId);

        const linkedSessions = sessionData.streamingSession?.Qmc;
        if (linkedSessions) {
            linkedSessions.forEach(id => storedEvents.push(...this.playDelayStore.internal_Cxc(id)));
        }

        this.playDelayStore.PTc(sessionData.sourceTransactionId);
        if (linkedSessions) {
            linkedSessions.forEach(id => this.playDelayStore.OTc(id));
            if (linkedSessions.length > 0) {
                linkedSessions.forEach(id => this.processedTransactionIds.add(id));
            }
        }

        const events = this.collectTimestampEvents(timestamps, transactionId);

        let allEvents = events.concat(storedEvents)
            .map(e => this.formatEvent(e, sessionData))
            .filter(e => e.ts <= (maxTimestamp ?? e.ts));

        // Compute aggregate buffering bounds
        const bufferingStart = allEvents
            .filter(e => this.isBufferingStartEvent(e))
            .reduce((min, e) => Math.min(min, e.ts), Infinity);
        const bufferingEnd = allEvents
            .filter(e => this.isBufferingEndEvent(e))
            .reduce((max, e) => Math.max(max, e.ts), -Infinity);

        if (bufferingStart !== Infinity) {
            allEvents.push({ eventName: PlayDelayEvent.internal_Gja, eventId: 'content-buffering', ts: bufferingStart, comp: 'buffering', cat: 'cdn', step: 'start' });
        }
        if (bufferingEnd !== -Infinity) {
            allEvents.push({ eventName: PlayDelayEvent.internal_Fja, eventId: 'content-buffering', ts: bufferingEnd, comp: 'buffering', cat: 'cdn', step: 'end' });
        }

        allEvents.forEach(e => { if (e.step === 'end') completedEventIds.add(e.eventId); });

        return allEvents
            .filter(e => e.step !== 'start' || completedEventIds.has(e.eventId))
            .sort((a, b) => a.ts - b.ts)
            .reduce((result, event) => {
                const name = event.eventName;
                delete event.eventName;
                if (name) result[name] = event;
                return result;
            }, {});
    }

    /** @private */
    collectTimestampEvents(timestamps, transactionId) {
        const events = [];
        const add = (name, key, correlationId) => {
            if (key in timestamps) {
                events.push({ name, $n: timestamp(this.adjustTimestamp(timestamp(timestamps[key]), {}, true)), sourceTransactionId: transactionId, correlationId });
            }
        };
        add(PlayDelayEvent.internal_Ila, 'pr_ats', 'request-pre-manifest');
        add(PlayDelayEvent.internal_Gla, 'ats', 'request-manifest');
        add(PlayDelayEvent.internal_Hla, 'pr_at', 'request-pre-manifest');
        add(PlayDelayEvent.internal_Fla, 'at', 'request-manifest');
        add(PlayDelayEvent.internal_Ela, 'lg', 'request-license');
        if ('lr' in timestamps) {
            add(PlayDelayEvent.internal_Dla, 'lr', 'request-license');
            add(PlayDelayEvent.dja, 'lr', 'apply-license');
        }
        if ('ld' in timestamps) {
            add(PlayDelayEvent.cja, 'ld', 'apply-license');
            add(PlayDelayEvent.internal_Nja, 'ld', 'drm');
        }
        add(PlayDelayEvent.FW, 'tt_start', 'request-timed-text');
        add(PlayDelayEvent.EW, 'tt_comp', 'request-timed-text');
        add(PlayDelayEvent.ika, 'ffr', 'first-frame-render');
        add(PlayDelayEvent.qma, 'uiCalledPlay', 'ui-called-play');

        const firstManifestSent = this.findFirstAvailableKey(timestamps, ['ats', 'pr_ats']);
        const firstManifestReceived = this.findFirstAvailableKey(timestamps, ['at', 'pr_at']);
        if (firstManifestSent) add(PlayDelayEvent.internal_Qka, firstManifestSent, 'manifest');
        if (firstManifestReceived) add(PlayDelayEvent.internal_Pka, firstManifestReceived, 'manifest');

        const drmStartKey = this.findFirstAvailableKey(timestamps, ['drm_start', 'lg']);
        if (drmStartKey) add(PlayDelayEvent.internal_Oja, drmStartKey, 'drm');

        return events;
    }

    /** @private */
    isBufferingStartEvent(e) {
        const name = e.eventName ?? e.eventId;
        return name.includes(PlayDelayEvent.HW) || name.includes(PlayDelayEvent.DW) || name.includes(PlayDelayEvent.FW);
    }

    /** @private */
    isBufferingEndEvent(e) {
        const name = e.eventName ?? e.eventId;
        return name.includes(PlayDelayEvent.GW) || name.includes(PlayDelayEvent.BW) || name.includes(PlayDelayEvent.EW);
    }

    /** @private */
    getMilestoneEvent(mediaType, step) {
        if (mediaType in MEDIA_TYPE_MILESTONES[step]) return MEDIA_TYPE_MILESTONES[step][mediaType];
    }

    /** @private */
    stopListening() {
        mediaRequestEvents.removeEventListener(MEDIA_REQUEST_EVENT, this.onMediaRequest);
    }

    /** @private */
    startListening() {
        this.stopListening();
        mediaRequestEvents.addEventListener(MEDIA_REQUEST_EVENT, this.onMediaRequest);
    }

    /** @private */
    findFirstAvailableKey(timestamps, keys) {
        for (const key of keys) { if (key in timestamps) return key; }
    }

    /** @private */
    formatEvent(event, sessionData) {
        return {
            eventName: this.getEventName(event.name, event.correlationId),
            eventId: event.correlationId || event.name,
            ts: this.adjustTimestamp(event.$n, sessionData),
            comp: this.getComponent(event.name),
            cat: this.classifyComponent(event.name),
            step: this.getStep(event.name)
        };
    }

    /** @private */
    adjustTimestamp(ts, sessionData, isReverse = false) {
        if (sessionData.transitionTime) {
            if (!isReverse) return ts.toUnit(MILLISECONDS) - sessionData.transitionTime;
        }
        const offset = sessionData.timeOffset ? sessionData.timeOffset.toUnit(MILLISECONDS) : 0;
        return isReverse ? ts.toUnit(MILLISECONDS) + offset : ts.toUnit(MILLISECONDS) - offset;
    }

    /** @private */
    getEventName(name, correlationId) {
        switch (name) {
            case PlayDelayEvent.FW: case PlayDelayEvent.EW:
            case PlayDelayEvent.DW: case PlayDelayEvent.BW:
            case PlayDelayEvent.HW: case PlayDelayEvent.GW:
                return name + '-' + correlationId;
            default: return name;
        }
    }

    /** @private */
    getComponent(name) {
        switch (name) {
            case PlayDelayEvent.internal_Ila: case PlayDelayEvent.internal_Hla:
            case PlayDelayEvent.internal_Gla: case PlayDelayEvent.internal_Fla:
            case PlayDelayEvent.internal_Qka: case PlayDelayEvent.internal_Pka:
                return 'manifest';
            case PlayDelayEvent.internal_Ela: case PlayDelayEvent.internal_Dla:
            case PlayDelayEvent.kKa: case PlayDelayEvent.jKa:
            case PlayDelayEvent.lka: case PlayDelayEvent.kka:
            case PlayDelayEvent.dja: case PlayDelayEvent.cja:
            case PlayDelayEvent.internal_Oja: case PlayDelayEvent.internal_Nja:
                return 'license';
            case PlayDelayEvent.FW: case PlayDelayEvent.EW:
            case PlayDelayEvent.DW: case PlayDelayEvent.BW:
            case PlayDelayEvent.HW: case PlayDelayEvent.GW:
            case PlayDelayEvent.bCa: case PlayDelayEvent.aCa:
            case PlayDelayEvent.internal_Gja: case PlayDelayEvent.internal_Fja:
                return 'buffering';
            case PlayDelayEvent.nIa: case PlayDelayEvent.mIa:
            case PlayDelayEvent.qma: case PlayDelayEvent.ika:
                return 'playback';
            default: return assertNever(name);
        }
    }

    /** @private */
    classifyComponent(name) {
        switch (name) {
            case PlayDelayEvent.internal_Ila: case PlayDelayEvent.internal_Hla:
            case PlayDelayEvent.internal_Gla: case PlayDelayEvent.internal_Fla:
            case PlayDelayEvent.internal_Qka: case PlayDelayEvent.internal_Pka:
                return 'aws';
            case PlayDelayEvent.internal_Ela: case PlayDelayEvent.internal_Dla:
            case PlayDelayEvent.internal_Oja: case PlayDelayEvent.internal_Nja:
                return 'mixed';
            case PlayDelayEvent.nIa: case PlayDelayEvent.mIa:
            case PlayDelayEvent.kKa: case PlayDelayEvent.jKa:
            case PlayDelayEvent.lka: case PlayDelayEvent.kka:
            case PlayDelayEvent.dja: case PlayDelayEvent.cja:
            case PlayDelayEvent.bCa: case PlayDelayEvent.aCa:
            case PlayDelayEvent.ika: case PlayDelayEvent.qma:
                return 'device';
            case PlayDelayEvent.FW: case PlayDelayEvent.EW:
            case PlayDelayEvent.DW: case PlayDelayEvent.BW:
            case PlayDelayEvent.HW: case PlayDelayEvent.GW:
            case PlayDelayEvent.internal_Gja: case PlayDelayEvent.internal_Fja:
                return 'cdn';
            default: return assertNever(name);
        }
    }

    /** @private */
    getStep(name) {
        switch (name) {
            case PlayDelayEvent.internal_Ila: case PlayDelayEvent.nIa:
            case PlayDelayEvent.internal_Gla: case PlayDelayEvent.internal_Ela:
            case PlayDelayEvent.bCa: case PlayDelayEvent.FW:
            case PlayDelayEvent.DW: case PlayDelayEvent.HW:
            case PlayDelayEvent.kKa: case PlayDelayEvent.lka:
            case PlayDelayEvent.dja: case PlayDelayEvent.internal_Qka:
            case PlayDelayEvent.internal_Oja: case PlayDelayEvent.internal_Gja:
                return 'start';
            case PlayDelayEvent.internal_Hla: case PlayDelayEvent.mIa:
            case PlayDelayEvent.internal_Fla: case PlayDelayEvent.internal_Dla:
            case PlayDelayEvent.jKa: case PlayDelayEvent.kka:
            case PlayDelayEvent.cja: case PlayDelayEvent.aCa:
            case PlayDelayEvent.EW: case PlayDelayEvent.BW:
            case PlayDelayEvent.GW: case PlayDelayEvent.internal_Pka:
            case PlayDelayEvent.internal_Nja: case PlayDelayEvent.internal_Fja:
                return 'end';
            case PlayDelayEvent.qma: case PlayDelayEvent.ika:
                return 'discrete';
            default: return assertNever(name);
        }
    }
}
