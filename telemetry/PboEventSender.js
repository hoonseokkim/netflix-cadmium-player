/**
 * @module PboEventSender
 * @description Sends PBO (Playback Operation) lifecycle events to the Netflix backend.
 *              Handles start, stop, and custom PBO events, executing them through
 *              the appropriate event handler and reporting errors via logging.
 *              Original: Module_44698
 */

import { __decorate, __param } from 'tslib'; // Module 22970
import { PboEventType, PboEventHandlerToken } from '../telemetry/PboEventSenderSymbols'; // Module 87607
import { LoggerToken } from '../monitoring/LoggerToken'; // Module 87386
import { injectable, inject as injectDecorator } from 'inversify'; // Module 22674

/**
 * Sends PBO (Playback Operation) events to Netflix analytics.
 */
class PboEventSender {
    /**
     * @param {Object} logger - Logger factory for creating sub-loggers
     * @param {Function} eventHandlerFactory - Factory that creates event handlers by event type
     */
    constructor(logger, eventHandlerFactory) {
        /** @type {Function} Factory for PBO event handlers */
        this.eventHandlerFactory = eventHandlerFactory;

        /** @type {Object} Logger instance */
        this.log = logger.createSubLogger("PboEventSenderImpl");
    }

    /**
     * Sends a PBO start event.
     * @param {Object} manifestContext - Context with manifest ref and links
     * @param {Object} sessionData - Session data including movie ID
     * @returns {Promise<void>}
     */
    sendStartEvent(manifestContext, sessionData) {
        const handler = this.eventHandlerFactory(PboEventType.start);
        return this._executeEvent(handler, manifestContext, sessionData);
    }

    /**
     * Sends a PBO stop event.
     * @param {Object} sessionData - Session data including movie ID
     * @returns {Promise<void>}
     */
    sendStopEvent(sessionData) {
        return this.eventHandlerFactory(PboEventType.stopTimer).execute({
            log: this.log,
            J: sessionData.R,
        }, sessionData).then(() => {}).catch((error) => {
            this.log.error("PBO stop event failed", error);
            throw error;
        });
    }

    /**
     * Sends a custom PBO event by type.
     * @param {string} eventType - The PBO event type identifier
     * @param {Object} manifestContext - Context with manifest ref and links
     * @param {Object} sessionData - Session data including movie ID
     * @returns {Promise<void>}
     */
    sendEvent(eventType, manifestContext, sessionData) {
        const handler = this.eventHandlerFactory(eventType);
        return this._executeEvent(handler, manifestContext, sessionData);
    }

    /**
     * Executes an event handler with the given context.
     * @private
     * @param {Object} handler - PBO event handler
     * @param {Object} manifestContext - Context with manifest ref and links
     * @param {Object} sessionData - Session data
     * @returns {Promise<void>}
     */
    _executeEvent(handler, manifestContext, sessionData) {
        return handler.execute({
            log: this.log,
            links: manifestContext.manifestRef.links,
            J: sessionData.R,
        }, sessionData).then(() => {}).catch((error) => {
            this.log.error("PBO event failed", error);
            throw error;
        });
    }
}

export { PboEventSender };
export default PboEventSender;
