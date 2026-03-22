/**
 * Netflix Cadmium Player - Ad Break Mismatch Logger
 * Deobfuscated from Module_79785
 *
 * Logs mismatches between manifest ad break locations and media events
 * ad break locations. Used for debugging ad insertion issues.
 */

import { __decorate } from "tslib"; // Module 22970
import { injectable } from "inversify"; // Module 22674

@injectable()
class AdBreakMismatchLogger {
    /**
     * Report ad break location mismatches to the log blob manager.
     *
     * @param {Object} mismatchData - Mismatch information
     * @param {Array} mismatchData.manifestUnmatchedAdBreakLocations - Ad breaks in manifest but not in media events
     * @param {Array} mismatchData.mediaEventsUnmatchedAdBreakLocations - Ad breaks in media events but not in manifest
     * @param {string} mismatchData.sev - Severity level
     * @param {Object} sessionContext - Playback session context
     */
    reportMismatch(mismatchData, sessionContext) {
        sessionContext.mediaStorageManager.logBlobManager.MOa({
            xid: sessionContext.sourceTransactionId,
            playbackcontextid: sessionContext.playbackContextId,
            pbcid: sessionContext.correlationId,
            manifestUnmatchedAdBreakLocations: mismatchData.manifestUnmatchedAdBreakLocations,
            mediaEventsUnmatchedAdBreakLocations: mismatchData.mediaEventsUnmatchedAdBreakLocations,
            sev: mismatchData.sev
        });
    }
}

export { AdBreakMismatchLogger };
