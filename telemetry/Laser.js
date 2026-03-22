/**
 * Netflix Cadmium Player - LASER Analytics Configurator
 * Configures the LASER (Live Application Session Event Recording) system
 * for the Cadmium player. LASER provides real-time session telemetry
 * for debugging and quality monitoring.
 *
 * @module Laser
 */

// import { __awaiter, __generator } from 'tslib';
// import { VERSION } from './Module_91877';
// import { laser } from './DISABLED';
// import { externalModules } from './Module_57349';
// import { platform } from './Module_66164';
// import { DEBUG } from './Module_48170';

/** @type {string} The Cadmium platform build version */
const PLATFORM_VERSION = "6.0055.939.911";

/** @type {string} The product identifier */
const PRODUCT_NAME = "CADMIUM";

/**
 * Configure and initialize the LASER analytics system based on player settings.
 * Sets up the log sink transport, enables/disables event capture, and manages
 * the LASER session lifecycle.
 *
 * @param {Object} settings - Player configuration settings.
 * @param {boolean} settings.laser - Whether LASER is enabled.
 * @param {string[]} [settings.laserEvents] - List of event types to capture.
 * @param {string} [settings.laserSessionType] - Session type (default: "MANUAL_TEST").
 * @param {string} [settings.laserSessionName] - Optional session name.
 * @param {string} [settings.laserSessionDescription] - Optional session description.
 * @param {string} [settings.laserRunId] - Optional run ID for grouping sessions.
 */
export function configureLaser(settings) {
  if (settings.laser) {
    if (!laser.isConfigured) {
      const console = new platform.Console("LASER");
      const schemaVersion = VERSION;

      laser.configure({
        console,
        product: PRODUCT_NAME,
        platformVersion: PLATFORM_VERSION,
        schemaVersion,
        client: async () => {
          const logSink = await externalModules.import("laserLogSink");
          DEBUG && console.pauseTrace("External socket client ready");

          return {
            send(event) {
              const channel = event.ntl ? "laser-event-ntl" : "laser-event";
              delete event.ntl;
              logSink.send(channel, event);
            },
          };
        },
      });

      laser.setPlatform(platform.platform);
      DEBUG && console.pauseTrace(
        `Configured for ${PRODUCT_NAME} (${PLATFORM_VERSION}). Using schema v${schemaVersion}`
      );
    }

    laser.enable(settings.laserEvents);

    // Start a new session if one isn't already active
    if (!laser.hasActiveSession) {
      const sessionConfig = {
        type: settings.laserSessionType ?? "MANUAL_TEST",
      };
      if (settings.laserSessionName) {
        sessionConfig.name = settings.laserSessionName;
      }
      if (settings.laserSessionDescription) {
        sessionConfig.description = settings.laserSessionDescription;
      }
      if (settings.laserRunId) {
        sessionConfig.runId = settings.laserRunId;
      }
      laser.startSession(sessionConfig);
    }
  } else {
    laser.disable();
  }
}
