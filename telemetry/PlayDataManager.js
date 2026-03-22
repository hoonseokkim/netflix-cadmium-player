/**
 * @file PlayDataManager - Manages sending playback telemetry data on session end
 * @module telemetry/PlayDataManager
 * @description Registers as a player component to send play data (viewing
 * telemetry) and log blobs when a playback session ends. Listens for the
 * unload/close event to ensure data is flushed. Also handles cleanup on
 * page visibility change (e.g., tab close).
 * @original Module_86258
 */

import { SUCCESS } from '../core/ResultCodes.js';
import { visibilityChangeEvent, pageHideEvent } from '../core/PageVisibility.js';
import { getService } from '../core/ServiceLocator.js';
import { EventTypeEnum } from '../core/EventTypes.js';
import { PlayDataServiceToken } from '../core/ServiceTokens.js';
import { PlayerEvents } from '../player/PlayerEvents.js';
import { LogBlobServiceToken } from '../core/LogBlobTokens.js';
import { ComponentRegistryToken } from '../core/ComponentTokens.js';

/**
 * Initialize the PlayDataManager for a playback session.
 * Sets up event listeners for session end and page unload to flush telemetry.
 *
 * @param {Object} session - The playback session context
 * @param {Function} session.recordPlayDelay - Record timing marks
 * @param {Function} session.addEventListener - Register session event listeners
 * @param {Function} session.D4c - Prepare play data for sending
 * @param {Object} session.aseGcSettings - ASE garbage collection settings
 * @param {Function} session.internal_Ewa - Signal that data sending is complete
 * @returns {Object} Empty object (manager has no public API, works via side effects)
 */
export function createPlayDataManager(session) {
    const logger = getService.createLogger(session, 'PlayDataManager');
    let isDisposed = false;
    let playDataServicePromise;
    let playDataService;

    session.recordPlayDelay('pdctor');

    /**
     * Initialize the play data service lazily.
     * @returns {Promise<Object>} The play data service
     */
    function initPlayDataService() {
        if (!playDataServicePromise) {
            session.recordPlayDelay('pdsb');
            playDataServicePromise = getService.container.get(PlayDataServiceToken)()
                .then((service) => {
                    playDataService = service;
                    session.recordPlayDelay('pdsc');
                    return service;
                })
                .catch((error) => {
                    logger.error('Unable to initialize the playdata services', error);
                    session.recordPlayDelay('pdse');
                    throw error;
                });
        }
        return playDataServicePromise;
    }

    /**
     * Handle page unload/visibility change by disposing resources.
     */
    function onPageUnload() {
        isDisposed = true;
        if (playDataService) {
            playDataService.close();
        }
        visibilityChangeEvent.removeListener(pageHideEvent, onPageUnload);
    }

    // Clean up listener when session ends
    session.addEventListener(PlayerEvents.destroy, () => {
        visibilityChangeEvent.removeListener(pageHideEvent, onPageUnload);
    });

    // Send telemetry data when session ends
    session.addEventListener(PlayerEvents.destroy, () => {
        if (!isDisposed) {
            session.D4c();

            const sendTasks = [
                // Task 1: Send play data
                initPlayDataService()
                    .then((service) => service.sendPlayData(session.aseGcSettings))
                    .then(() => logger.info('Sent the playdata'))
                    .catch((error) => logger.error('Unable to send the playdata', error)),

                // Task 2: Send log blob
                new Promise((resolve) => {
                    getService.container.get(LogBlobServiceToken)
                        .flush(false)
                        .catch(() => {
                            logger.error('Unable to send logblob');
                            resolve(undefined);
                        })
                        .then(() => resolve(undefined));
                })
            ];

            Promise.all(sendTasks)
                .then(() => session.internal_Ewa())
                .catch(() => session.internal_Ewa());
        }
    });

    // Register for page unload
    visibilityChangeEvent.addListener(pageHideEvent, onPageUnload);

    return {};
}

// Register this component in the component registry
getService.container.get(ComponentRegistryToken).register(
    EventTypeEnum.INIT_COMPONENT_PERSISTEDPLAYDATA,
    (done) => { done(SUCCESS); }
);

export default createPlayDataManager;
